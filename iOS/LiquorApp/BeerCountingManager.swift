import Vision
import UIKit
import CoreImage

/// Enhanced manager for counting beer packs in planograms using object detection
class BeerCountingManager: ObservableObject {
    static let shared = BeerCountingManager()
    
    private init() {}
    
    /// Result structure for beer pack counting
    struct BeerCountResult {
        let beerType: String
        let brand: String
        let confidence: Float
        let count: Int
        let boundingBoxes: [CGRect] // Individual pack locations
    }
    
    /// Enhanced analysis result with counting
    struct PlanogramAnalysis {
        let totalPacks: Int
        let beerCounts: [BeerCountResult]
        let analysisImage: UIImage? // Image with bounding boxes drawn
    }
    
    /// Analyze planogram image to count beer packs of different types
    /// - Parameter image: The captured planogram image
    /// - Returns: Detailed analysis with counts per beer type
    func analyzePlanogramWithCounting(_ image: UIImage) async -> PlanogramAnalysis? {
        guard let cgImage = image.cgImage else {
            print("❌ Could not get CGImage from input")
            return nil
        }
        
        print("🔍 Starting planogram analysis with beer pack counting...")
        
        // Step 1: Detect all rectangular objects (potential beer packs)
        let detectedObjects = await detectRectangularObjects(in: cgImage)
        
        // Step 2: Extract and classify each detected object
        var beerCounts: [String: BeerCountResult] = [:]
        var analysisBoxes: [CGRect] = []
        
        print("📊 Starting analysis of \(detectedObjects.count) detected rectangles")
        
        // Limit processing to prevent timeouts with large numbers of objects
        let maxObjects = min(detectedObjects.count, 6) // Process max 6 objects to prevent timeouts
        let objectsToProcess = Array(detectedObjects.prefix(maxObjects))
        
        if detectedObjects.count > maxObjects {
            print("⚠️ Limiting analysis to \(maxObjects) largest rectangles to prevent timeout")
        }
        
        // Process rectangles with timeout protection and parallel processing where possible
        for (index, boundingBox) in objectsToProcess.enumerated() {
            print("🔍 Analyzing rectangle \(index + 1)/\(maxObjects): \(Int(boundingBox.width))x\(Int(boundingBox.height))")
            
            // Add timeout protection for each rectangle
            let timeoutTask = Task {
                try await Task.sleep(nanoseconds: 10_000_000_000) // 10 second timeout
                return false
            }
            
            let analysisTask = Task { () -> Bool in
                // Extract the region of interest
                if let croppedImage = cropImage(cgImage, to: boundingBox) {
                    let uiCroppedImage = UIImage(cgImage: croppedImage)
                    
                    // Generate embedding for this specific region
                    if let embedding = await EmbeddingManager.shared.generateEmbedding(from: uiCroppedImage) {
                        
                        // Search for similar beer photos using vector search
                        let searchResults = await BeerPhotoDatabaseManager.shared.searchSimilarBeerPhotos(
                            queryEmbedding: embedding,
                            limit: 1 // Only get the best match
                        )
                        
                        // Process search results inline for now
                        if let bestMatch = searchResults.first,
                           bestMatch.1 >= 0.6 { // 60% confidence threshold
                            
                            let beerType = bestMatch.0.name
                            let brand = bestMatch.0.brand
                            let confidence = bestMatch.1
                            
                            print("✅ MATCH FOUND: \(beerType) with \(String(format: "%.1f", confidence * 100))% confidence")
                            
                            // Add to count (synchronous update)
                            if var existingCount = beerCounts[beerType] {
                                // Update existing count
                                existingCount = BeerCountResult(
                                    beerType: beerType,
                                    brand: brand,
                                    confidence: max(existingCount.confidence, confidence),
                                    count: existingCount.count + 1,
                                    boundingBoxes: existingCount.boundingBoxes + [boundingBox]
                                )
                                beerCounts[beerType] = existingCount
                            } else {
                                // New beer type found
                                beerCounts[beerType] = BeerCountResult(
                                    beerType: beerType,
                                    brand: brand,
                                    confidence: confidence,
                                    count: 1,
                                    boundingBoxes: [boundingBox]
                                )
                            }
                            
                            analysisBoxes.append(boundingBox)
                            print("✅ Identified: \(beerType) (confidence: \(String(format: "%.1f", confidence * 100))%)")
                            return true
                        } else {
                            // Log rejected matches
                            if let bestMatch = searchResults.first {
                                print("❌ REJECTED: \(bestMatch.0.name) with \(String(format: "%.1f", bestMatch.1 * 100))% confidence (below 60% threshold)")
                            } else {
                                print("❌ NO MATCHES: No similar beer photos found for this rectangle")
                            }
                            return false
                        }
                    } else {
                        print("❌ FAILED: Could not generate embedding for rectangle \(index + 1)")
                        return false
                    }
                } else {
                    print("❌ CROP FAILED: Could not crop rectangle \(index + 1)")
                    return false
                }
            }
            
            // Race between analysis and timeout
            let result = await withTaskGroup(of: Bool.self) { group in
                group.addTask { 
                    do {
                        return try await timeoutTask.value
                    } catch {
                        return false // Timeout cancelled
                    }
                }
                group.addTask { await analysisTask.value }
                
                // Return the first completed task
                let firstResult = await group.next() ?? false
                group.cancelAll()
                return firstResult
            }
            
            if !result {
                print("⏰ TIMEOUT: Rectangle \(index + 1) analysis took too long, skipping")
                continue
            }
            
            // Small delay between rectangles to prevent memory pressure
            try? await Task.sleep(nanoseconds: 100_000_000) // 0.1 second delay
        }
        
        // Step 3: Create analysis image with bounding boxes
        let analysisImage = drawBoundingBoxes(on: image, boxes: analysisBoxes, results: Array(beerCounts.values))
        
        let totalPacks = beerCounts.values.reduce(0) { $0 + $1.count }
        
        print("🎯 Planogram analysis complete!")
        print("📊 Processed \(objectsToProcess.count) rectangles, found \(totalPacks) beer packs")
        
        if beerCounts.isEmpty {
            print("⚠️ No beer packs were successfully identified. This could be due to:")
            print("  - Poor lighting or image quality")
            print("  - Beer packs not matching the reference database")
            print("  - Objects too small or partially occluded") 
        } else {
            for result in beerCounts.values {
                print("📦 \(result.beerType): \(result.count) packs (\(String(format: "%.1f", result.confidence * 100))% confidence)")
            }
        }
        
        return PlanogramAnalysis(
            totalPacks: totalPacks,
            beerCounts: Array(beerCounts.values),
            analysisImage: analysisImage
        )
    }
    
    /// Detect rectangular objects in the image (potential beer packs)
    private func detectRectangularObjects(in cgImage: CGImage) async -> [CGRect] {
        return await withCheckedContinuation { continuation in
            var detectedBoxes: [CGRect] = []
            
            // Use Vision's rectangle detection
            let request = VNDetectRectanglesRequest { request, error in
                if let error = error {
                    print("❌ Rectangle detection failed: \(error.localizedDescription)")
                    continuation.resume(returning: [])
                    return
                }
                
                guard let results = request.results as? [VNRectangleObservation] else {
                    print("❌ No rectangle detection results")
                    continuation.resume(returning: [])
                    return
                }
                
                // Filter rectangles by size and aspect ratio (typical beer pack dimensions)
                for observation in results {
                    let boundingBox = observation.boundingBox
                    
                    // Convert normalized coordinates to image coordinates
                    let imageBox = CGRect(
                        x: boundingBox.origin.x * CGFloat(cgImage.width),
                        y: (1 - boundingBox.origin.y - boundingBox.height) * CGFloat(cgImage.height),
                        width: boundingBox.width * CGFloat(cgImage.width),
                        height: boundingBox.height * CGFloat(cgImage.height)
                    )
                    
                    // Filter by size (minimum 100x100 pixels) and strict aspect ratio
                    let aspectRatio = imageBox.width / imageBox.height
                    
                    // Balanced filtering for real-world beer pack detection
                    let minPixelSize: CGFloat = 50 // Minimum 50x50 pixels (more realistic)
                    let minAreaPercentage = (imageBox.width * imageBox.height) / (CGFloat(cgImage.width) * CGFloat(cgImage.height))
                    
                    if imageBox.width >= minPixelSize && 
                       imageBox.height >= minPixelSize && 
                       aspectRatio > 0.4 && aspectRatio < 4.0 && // More flexible aspect ratio for various angles
                       minAreaPercentage >= 0.008 { // Must be at least 0.8% of image area (much more realistic)
                        
                        print("✅ Valid beer pack candidate: \(Int(imageBox.width))x\(Int(imageBox.height)), aspect: \(String(format: "%.2f", aspectRatio)), area: \(String(format: "%.1f", minAreaPercentage * 100))%")
                        detectedBoxes.append(imageBox)
                    } else {
                        print("❌ Rejected rectangle: \(Int(imageBox.width))x\(Int(imageBox.height)), aspect: \(String(format: "%.2f", aspectRatio)), area: \(String(format: "%.1f", minAreaPercentage * 100))%")
                    }
                }
                
                print("🔍 Detected \(detectedBoxes.count) potential beer pack regions")
                continuation.resume(returning: detectedBoxes)
            }
            
            // Configure rectangle detection - balanced parameters for real-world use
            request.minimumAspectRatio = 0.5 // Allow wider range for angled shots
            request.maximumAspectRatio = 3.0 // Beer packs can appear elongated from angles
            request.minimumSize = 0.015 // Minimum 1.5% of image (more realistic for phone cameras)
            request.maximumObservations = 10 // Allow more detections for multi-pack scenarios
            request.minimumConfidence = 0.6 // Lower confidence for better detection
            
            let handler = VNImageRequestHandler(cgImage: cgImage, options: [:])
            
            do {
                try handler.perform([request])
            } catch {
                print("❌ Failed to perform rectangle detection: \(error.localizedDescription)")
                continuation.resume(returning: [])
            }
        }
    }
    
    /// Crop image to specific bounding box
    private func cropImage(_ cgImage: CGImage, to boundingBox: CGRect) -> CGImage? {
        return cgImage.cropping(to: boundingBox)
    }
    
    /// Draw bounding boxes and labels on the analysis image
    private func drawBoundingBoxes(on image: UIImage, boxes: [CGRect], results: [BeerCountResult]) -> UIImage? {
        let renderer = UIGraphicsImageRenderer(size: image.size)
        
        return renderer.image { context in
            // Draw original image
            image.draw(at: .zero)
            
            // Set up drawing context
            let cgContext = context.cgContext
            cgContext.setLineWidth(3.0)
            cgContext.setStrokeColor(UIColor.green.cgColor)
            cgContext.setFillColor(UIColor.green.withAlphaComponent(0.3).cgColor)
            
            // Draw bounding boxes
            for (index, box) in boxes.enumerated() {
                // Draw rectangle
                cgContext.addRect(box)
                cgContext.drawPath(using: .fillStroke)
                
                // Draw label if we have matching result
                if index < results.count {
                    let result = results[index]
                    let label = "\(result.beerType) (\(result.count))"
                    
                    // Draw label background
                    let labelRect = CGRect(x: box.minX, y: box.minY - 25, width: 150, height: 20)
                    cgContext.setFillColor(UIColor.black.withAlphaComponent(0.7).cgColor)
                    cgContext.fill(labelRect)
                    
                    // Draw label text
                    let attributes: [NSAttributedString.Key: Any] = [
                        .foregroundColor: UIColor.white,
                        .font: UIFont.boldSystemFont(ofSize: 14)
                    ]
                    
                    label.draw(in: labelRect, withAttributes: attributes)
                }
            }
        }
    }
}