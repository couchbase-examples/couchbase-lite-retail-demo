import Foundation
import CoreML
import UIKit
import Accelerate

/// On-device image embedding with CLIP ViT-B/32 (512-d, cosine, unit-norm).
///
/// Used by the shelf audit: each expected shelf position is cropped out of the associate's
/// photo and embedded here, then matched against the product-image vectors stored on the
/// inventory documents.
///
/// Preprocessing has to reproduce CLIP's own pipeline exactly, because the stored product
/// vectors were authored with it: resize the shortest side to 224 (bicubic), centre crop,
/// scale to [0,1], then normalize with CLIP's channel mean/std. `verify_clip_parity.py`
/// checks this Swift path against the Python one and confirms every audit verdict survives.
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

    /// Resize shortest side to 224 (bicubic-equivalent), centre crop, normalize.
    /// Returns CHW-ordered floats, which is the layout the CoreML graph expects.
    static func preprocess(_ image: UIImage) throws -> [Float] {
        guard let resized = image.clipResizedAndCropped(to: inputSize),
              let cg = resized.cgImage else {
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

    /// CLIP's resize-then-centre-crop: scale so the shortest side is `side`, then take the
    /// centre `side`x`side` square. Cropping after scaling (rather than squashing to a
    /// square) preserves aspect ratio, which is what the offline job does.
    func clipResizedAndCropped(to side: Int) -> UIImage? {
        let target = CGFloat(side)
        let scale = target / min(size.width, size.height)
        let scaled = CGSize(width: (size.width * scale).rounded(),
                            height: (size.height * scale).rounded())

        let format = UIGraphicsImageRendererFormat.default()
        format.scale = 1
        format.opaque = true

        let renderer = UIGraphicsImageRenderer(size: CGSize(width: target, height: target),
                                              format: format)
        return renderer.image { _ in
            // Centre the scaled image over the square canvas; the overflow is the crop.
            let origin = CGPoint(x: (target - scaled.width) / 2,
                                 y: (target - scaled.height) / 2)
            draw(in: CGRect(origin: origin, size: scaled))
        }
    }

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
