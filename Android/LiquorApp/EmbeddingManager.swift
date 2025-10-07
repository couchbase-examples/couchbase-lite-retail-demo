import Vision
import UIKit
import CoreImage

/// Manager for generating image embeddings using Vision framework
class EmbeddingManager: ObservableObject {
    static let shared = EmbeddingManager()
    
    private init() {}
    
    /// Generate embedding vector from UIImage using Vision framework
    /// - Parameter image: The input image
    /// - Returns: Feature vector as array of Float values, or nil if processing fails
    func generateEmbedding(from image: UIImage) async -> [Float]? {
        guard let cgImage = image.cgImage else {
            print("❌ Could not get CGImage from UIImage")
            return nil
        }
        
        // 🚨 CRITICAL: Check if image has meaningful content before processing
        guard isImageValid(cgImage) else {
            print("❌ Image rejected: too dark, blank, or lacks meaningful content")
            return nil
        }
        
        return await withCheckedContinuation { (continuation: CheckedContinuation<[Float]?, Never>) in
            // Create Vision request for feature print (descriptor)
            let request = VNGenerateImageFeaturePrintRequest { request, error in
                if let error = error {
                    print("❌ Vision request failed: \(error.localizedDescription)")
                    continuation.resume(returning: nil)
                    return
                }
                
                guard let results = request.results as? [VNFeaturePrintObservation],
                      let featurePrint = results.first else {
                    print("❌ No feature print results found")
                    continuation.resume(returning: nil)
                    return
                }
                
                // Extract the feature vector
                let embedding = self.convertFeaturePrintToFloatArray(featurePrint)
                print("✅ Generated embedding with \(embedding.count) dimensions")
                continuation.resume(returning: embedding)
            }
            
            // Configure request for optimal feature extraction
            request.revision = VNGenerateImageFeaturePrintRequestRevision1
            
            // Create and perform the request
            let handler = VNImageRequestHandler(cgImage: cgImage, options: [:])
            
            DispatchQueue.global(qos: .userInitiated).async {
                do {
                    try handler.perform([request])
                } catch {
                    print("❌ Failed to perform Vision request: \(error.localizedDescription)")
                    continuation.resume(returning: nil)
                }
            }
        }
    }
    
    /// Convert VNFeaturePrintObservation to Float array
    private func convertFeaturePrintToFloatArray(_ featurePrint: VNFeaturePrintObservation) -> [Float] {
        let elementCount = featurePrint.elementCount
        let elementType = featurePrint.elementType
        
        switch elementType {
        case .float:
            // Access the raw data pointer and convert to Float array
            let dataPointer = featurePrint.data.withUnsafeBytes { bytes in
                return bytes.bindMemory(to: Float.self)
            }
            return Array(UnsafeBufferPointer(start: dataPointer.baseAddress, count: elementCount))
            
        case .double:
            // Handle double precision case
            let dataPointer = featurePrint.data.withUnsafeBytes { bytes in
                return bytes.bindMemory(to: Double.self)
            }
            let doubleArray = Array(UnsafeBufferPointer(start: dataPointer.baseAddress, count: elementCount))
            return doubleArray.map { Float($0) }
            
        case .unknown:
            print("⚠️ Unknown element type: \(elementType)")
            return []
        @unknown default:
            print("⚠️ Unexpected element type: \(elementType)")
            return []
        }
    }
    
    // NOTE: Cosine similarity calculation removed - we use Couchbase Vector Search exclusively
    
    /// Validate if image has meaningful content for beer detection
    /// - Parameter cgImage: The image to validate
    /// - Returns: true if image is suitable for processing, false if too dark/blank/invalid
    private func isImageValid(_ cgImage: CGImage) -> Bool {
        let width = cgImage.width
        let height = cgImage.height
        
        // Check minimum dimensions
        guard width >= 50, height >= 50 else {
            print("❌ Image too small: \(width)x\(height)")
            return false
        }
        
        // Sample pixels to check brightness and contrast
        guard let context = CGContext(
            data: nil,
            width: width,
            height: height,
            bitsPerComponent: 8,
            bytesPerRow: 0,
            space: CGColorSpaceCreateDeviceGray(),
            bitmapInfo: CGImageAlphaInfo.none.rawValue
        ) else {
            print("❌ Failed to create graphics context")
            return false
        }
        
        context.draw(cgImage, in: CGRect(x: 0, y: 0, width: width, height: height))
        
        guard let data = context.data else {
            print("❌ Failed to get pixel data")
            return false
        }
        
        let pixelData = data.bindMemory(to: UInt8.self, capacity: width * height)
        
        // Calculate brightness and contrast metrics
        var totalBrightness: Int = 0
        var brightPixels = 0
        var darkPixels = 0
        let sampleCount = min(width * height, 10000) // Sample up to 10k pixels
        let step = max(1, (width * height) / sampleCount)
        
        for i in stride(from: 0, to: width * height, by: step) {
            let pixel = Int(pixelData[i])
            totalBrightness += pixel
            
            if pixel > 200 { brightPixels += 1 }
            if pixel < 30 { darkPixels += 1 }
        }
        
        let sampledPixels = (width * height) / step
        let avgBrightness = totalBrightness / sampledPixels
        let brightRatio = Double(brightPixels) / Double(sampledPixels)
        let darkRatio = Double(darkPixels) / Double(sampledPixels)
        
        print("📊 Image analysis: brightness=\(avgBrightness), dark=\(String(format: "%.1f", darkRatio*100))%, bright=\(String(format: "%.1f", brightRatio*100))%")
        
        // Reject images that are too dark (>90% dark pixels)
        if darkRatio > 0.9 {
            print("❌ Image rejected: too dark (\(String(format: "%.1f", darkRatio*100))% dark pixels)")
            return false
        }
        
        // Reject images that are too bright/washed out (>95% bright pixels)
        if brightRatio > 0.95 {
            print("❌ Image rejected: too bright/washed out (\(String(format: "%.1f", brightRatio*100))% bright pixels)")
            return false
        }
        
        // Reject images with very low average brightness
        if avgBrightness < 20 {
            print("❌ Image rejected: average brightness too low (\(avgBrightness))")
            return false
        }
        
        print("✅ Image validation passed: suitable for processing")
        return true
    }
    
    /// Preprocess image for better feature extraction
    /// - Parameter image: Original image
    /// - Returns: Preprocessed image optimized for Vision framework
    func preprocessImage(_ image: UIImage) -> UIImage {
        // Resize to consistent dimensions for better comparison
        let targetSize = CGSize(width: 512, height: 512)
        let resizedImage = image.resized(to: targetSize)
        
        // Optional: Apply additional preprocessing like normalization
        return resizedImage
    }
}