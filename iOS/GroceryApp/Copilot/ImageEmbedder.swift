import Foundation
import CoreML
import UIKit
import Accelerate

/// On-device image embedding with CLIP ViT-B/32 (512-d, cosine, unit-norm).
///
/// Used by the shelf audit: each grid cell is cropped out of the associate's photo and
/// embedded here, then matched against the golden `PlanogramCell` vectors for that shelf.
///
/// Preprocessing has to match the script that authored the golden cell vectors
/// (embed_planogram_cells.py): stretch to 224x224 (high-quality interpolation, matching PIL
/// BICUBIC in embed_planogram_cells.py), scale to [0,1], then normalize with CLIP's channel
/// mean/std. Android does the same.
///
/// The bundled weights are int8-quantized. CLIP's vision tower is 87M parameters, so fp16
/// would be ~168MB — over GitHub's per-file limit. Quantization was verified not to change
/// any audit verdict across all 36 shelf positions in the demo dataset.
actor ImageEmbedder {

    enum EmbedderError: Error, LocalizedError {
        case modelMissing
        case badImage
        case badOutput

        var errorDescription: String? {
            switch self {
            case .modelMissing:
                return "ClipImageEncoder.mlmodelc is missing from the app bundle."
            case .badImage:
                return "That image could not be read."
            case .badOutput:
                return "The image model returned an unexpected output shape."
            }
        }
    }

    static let shared = ImageEmbedder()

    static let inputSize = 224
    static let dimensions = 512
    static let modelName = "clip-vit-b-32"
    static let metric = "cosine"

    /// CLIP's normalization constants. These are not arbitrary — they must match the values
    /// used when the stored product vectors were authored.
    private static let mean: [Float] = [0.48145466, 0.4578275, 0.40821073]
    private static let std: [Float] = [0.26862954, 0.26130258, 0.27577711]

    private var model: MLModel?
    private(set) var lastEmbedMilliseconds: Double = 0
    private(set) var computeUnitsDescription = "not loaded"

    func prepare() throws {
        if model != nil { return }
        guard let url = Bundle.main.url(forResource: "ClipImageEncoder",
                                        withExtension: "mlmodelc") else {
            throw EmbedderError.modelMissing
        }

        // The int8 graph asserts inside MPSGraph on some GPU drivers, so fall back to CPU
        // rather than letting the audit fail outright. Correct-but-slower beats broken.
        let config = MLModelConfiguration()
        config.computeUnits = .all
        do {
            model = try MLModel(contentsOf: url, configuration: config)
            computeUnitsDescription = "Neural Engine / GPU / CPU (.all)"
        } catch {
            let fallback = MLModelConfiguration()
            fallback.computeUnits = .cpuOnly
            model = try MLModel(contentsOf: url, configuration: fallback)
            computeUnitsDescription = "CPU only (fallback)"
            print("⚠️ [ImageEmbedder] .all failed (\(error.localizedDescription)); using CPU")
        }
    }

    /// Loads the model and runs one throwaway embed in the background, so the first audit
    /// does not pay for it.
    ///
    /// On a fresh install the first load compiles the model for this device, which measured
    /// about 30 seconds and looked like a hang on the first audit. An audit started before the
    /// warm-up finishes just waits on the actor, which is still quicker than loading from
    /// scratch.
    nonisolated static func warmUpInBackground() {
        Task.detached(priority: .utility) {
            let started = DispatchTime.now().uptimeNanoseconds
            do {
                let format = UIGraphicsImageRendererFormat.default()
                format.scale = 1
                let size = CGSize(width: inputSize, height: inputSize)
                let blank = UIGraphicsImageRenderer(size: size, format: format).image { ctx in
                    UIColor.gray.setFill()
                    ctx.fill(CGRect(origin: .zero, size: size))
                }
                _ = try await shared.embed(blank)
                let ms = (DispatchTime.now().uptimeNanoseconds - started) / 1_000_000
                let units = await shared.computeUnitsDescription
                print("🔥 [ImageEmbedder] CLIP warmed up in \(ms) ms (\(units))")
            } catch {
                // Not fatal: the first audit loads the model instead.
                print("⚠️ [ImageEmbedder] warm-up failed: \(error.localizedDescription)")
            }
        }
    }

    /// Embeds an image into a 512-d unit-norm vector.
    func embed(_ image: UIImage) throws -> [Float] {
        try prepare()
        guard let model else { throw EmbedderError.modelMissing }

        let started = DispatchTime.now().uptimeNanoseconds
        let pixels = try Self.preprocess(image)

        let shape = [1, 3, NSNumber(value: Self.inputSize), NSNumber(value: Self.inputSize)] as [NSNumber]
        let array = try MLMultiArray(shape: shape, dataType: .float32)
        let pointer = array.dataPointer.bindMemory(to: Float.self, capacity: pixels.count)
        pixels.withUnsafeBufferPointer { pointer.update(from: $0.baseAddress!, count: pixels.count) }

        let input = try MLDictionaryFeatureProvider(
            dictionary: ["pixel_values": MLFeatureValue(multiArray: array)])
        let output = try model.prediction(from: input)

        guard let out = output.featureValue(for: "embedding")?.multiArrayValue,
              out.count == Self.dimensions else {
            throw EmbedderError.badOutput
        }
        var vector = [Float](repeating: 0, count: Self.dimensions)
        for i in 0..<Self.dimensions { vector[i] = out[i].floatValue }

        lastEmbedMilliseconds =
            Double(DispatchTime.now().uptimeNanoseconds - started) / 1_000_000
        return vector
    }

    // MARK: - Preprocessing

    /// Stretch to 224x224, scale to [0,1], normalize with CLIP mean/std.
    /// Returns CHW-ordered floats, which is the layout the CoreML graph expects.
    static func preprocess(_ image: UIImage) throws -> [Float] {
        // Stretch to 224x224 (no aspect-preserving crop). The golden PlanogramCell vectors
        // were authored by embed_planogram_cells.py with PIL resize((224,224), BICUBIC),
        // i.e. a plain stretch; centre-cropping a tall cell throws away most of the product.
        guard let cg = image.cgImage else {
            throw EmbedderError.badImage
        }

        let side = inputSize
        var rgba = [UInt8](repeating: 0, count: side * side * 4)
        guard let context = CGContext(
            data: &rgba, width: side, height: side,
            bitsPerComponent: 8, bytesPerRow: side * 4,
            space: CGColorSpaceCreateDeviceRGB(),
            bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue
        ) else { throw EmbedderError.badImage }
        context.interpolationQuality = .high   // closest CoreGraphics gets to PIL BICUBIC
        context.draw(cg, in: CGRect(x: 0, y: 0, width: side, height: side))

        // CHW, normalized per channel.
        var out = [Float](repeating: 0, count: 3 * side * side)
        let plane = side * side
        for i in 0..<plane {
            let r = Float(rgba[i * 4 + 0]) / 255.0
            let g = Float(rgba[i * 4 + 1]) / 255.0
            let b = Float(rgba[i * 4 + 2]) / 255.0
            out[i] = (r - mean[0]) / std[0]
            out[plane + i] = (g - mean[1]) / std[1]
            out[2 * plane + i] = (b - mean[2]) / std[2]
        }
        return out
    }
}

extension UIImage {

    /// Redraws with the EXIF orientation baked in, so `cgImage` pixel coordinates line up with
    /// `size`.
    ///
    /// This matters for tiling. `croppedNormalized` indexes into the raw `cgImage` pixel grid,
    /// but a photo straight from the camera or photo library carries an `imageOrientation` that
    /// leaves that grid rotated relative to what the user sees — so cell (r,c) of the tiling
    /// would not be the cell (r,c) of the picture, and every distance would be measured against
    /// the wrong crop. Bundled PNGs are already `.up`, which is why the sample path never showed
    /// this, but any real photo would have tiled sideways.
    func normalizedUp() -> UIImage {
        guard imageOrientation != .up else { return self }
        let format = UIGraphicsImageRendererFormat.default()
        format.scale = scale
        return UIGraphicsImageRenderer(size: size, format: format).image { _ in
            draw(in: CGRect(origin: .zero, size: size))
        }
    }

    /// Crops a normalized sub-rectangle (0-1 in both axes), used to cut each expected shelf
    /// position out of the audit photo.
    func croppedNormalized(_ rect: CGRect) -> UIImage? {
        guard let cg = cgImage else { return nil }
        let w = CGFloat(cg.width), h = CGFloat(cg.height)
        let pixelRect = CGRect(x: (rect.minX * w).rounded(),
                               y: (rect.minY * h).rounded(),
                               width: max(1, (rect.width * w).rounded()),
                               height: max(1, (rect.height * h).rounded()))
            .intersection(CGRect(x: 0, y: 0, width: w, height: h))
        guard !pixelRect.isNull, let cropped = cg.cropping(to: pixelRect) else { return nil }
        return UIImage(cgImage: cropped, scale: 1, orientation: imageOrientation)
    }
}
