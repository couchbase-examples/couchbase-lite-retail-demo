import UIKit
import Foundation

/// Processor for loading and processing beer photos from the dataset
class BeerPhotoProcessor: ObservableObject {
    static let shared = BeerPhotoProcessor()
    
    @Published var isProcessing = false
    @Published var processingStatus = ""
    @Published var processedCount = 0
    @Published var totalCount = 0
    
    private let embeddingManager = EmbeddingManager.shared
    private let databaseManager = BeerPhotoDatabaseManager.shared
    
    private init() {}
    
    /// Load actual beer photos from the app bundle
    private func loadBeerPhotosFromBundle() -> [(filename: String, name: String, brand: String, packSize: String)] {
        print("🔍 Looking for beer photos in app bundle...")
        
        // Check if app bundle is accessible
        guard Bundle.main.resourcePath != nil else {
            print("❌ Could not access app bundle")
            return getFallbackBeerPhotos()
        }
        
        // Define the actual beer photos with proper names (no longer using generation-*.png)
        let beerPhotoMappings = [
            (filename: "black-horizon-ale.png", name: "Black Horizon Ale", brand: "Black Horizon", packSize: "6-pack"),
            (filename: "aether-brew.png", name: "Aether Brew", brand: "Aether", packSize: "6-pack"),
            (filename: "hop-haven.png", name: "Hop Haven", brand: "Hop Haven", packSize: "6-pack"),
            (filename: "neon-peak-brew.png", name: "Neon Peak Brew", brand: "Neon Peak", packSize: "6-pack")
        ]
        
        // Verify that the files actually exist in the bundle
        var availablePhotos: [(filename: String, name: String, brand: String, packSize: String)] = []
        
        for photoMapping in beerPhotoMappings {
            if UIImage(named: photoMapping.filename.replacingOccurrences(of: ".png", with: "")) != nil {
                availablePhotos.append(photoMapping)
                print("📦 Found: \(photoMapping.filename) -> \(photoMapping.name) (\(photoMapping.brand))")
            } else {
                print("❌ Missing: \(photoMapping.filename)")
            }
        }
        
        print("📸 Found \(availablePhotos.count) beer photos in bundle")
        return availablePhotos
    }
    
    // MARK: - Removed old helper functions that were used for generation-*.png mapping
    // The new approach uses explicit mappings in loadBeerPhotosFromBundle()
    
    /// Fallback beer photos data if directory loading fails
    private func getFallbackBeerPhotos() -> [(filename: String, name: String, brand: String, packSize: String)] {
        return [
            ("black-horizon-ale.png", "Black Horizon Ale", "Black Horizon", "6-pack"),
            ("aether-brew.png", "Aether Brew", "Aether", "6-pack"),
            ("hop-haven.png", "Hop Haven", "Hop Haven", "6-pack"),
            ("neon-peak-brew.png", "Neon Peak Brew", "Neon Peak", "6-pack")
        ]
    }
    
    /// Process all beer photos and generate embeddings
    func processAllBeerPhotos() async {
        let beerPhotos = loadBeerPhotosFromBundle()
        
        await MainActor.run {
            isProcessing = true
            processingStatus = "Starting processing..."
            processedCount = 0
            totalCount = beerPhotos.count
        }
        
        print("🔄 Starting beer photo processing...")
        
        for (_, photoData) in beerPhotos.enumerated() {
            await MainActor.run {
                processingStatus = "Processing \(photoData.name)..."
            }
            
            // Load the actual image file
            if let realImage = loadBeerImage(filename: photoData.filename) {
                if let embedding = await embeddingManager.generateEmbedding(from: realImage) {
                    let beerPhoto = BeerPhotoItem(
                        filename: photoData.filename,
                        name: photoData.name,
                        brand: photoData.brand,
                        packSize: photoData.packSize,
                        embedding: embedding
                    )
                    
                    if await databaseManager.saveBeerPhoto(beerPhoto) {
                        await MainActor.run {
                            processedCount += 1
                            processingStatus = "Processed \(photoData.name) (\(processedCount)/\(totalCount))"
                        }
                        print("✅ Processed: \(photoData.name)")
                    } else {
                        print("❌ Failed to save: \(photoData.name)")
                    }
                } else {
                    print("❌ Failed to generate embedding for: \(photoData.name)")
                }
            } else {
                print("❌ Failed to load image: \(photoData.filename)")
            }
            
            // Small delay to show progress
            try? await Task.sleep(nanoseconds: 500_000_000) // 0.5 seconds
        }
        
        await MainActor.run {
            isProcessing = false
            processingStatus = "Completed! Processed \(processedCount) beer photos."
        }
        
        print("🎉 Beer photo processing completed!")
    }
    
    /// Load actual beer image from the app bundle
    private func loadBeerImage(filename: String) -> UIImage? {
        print("🖼️ Loading image from app bundle: \(filename)")
        
        // Remove file extension to get the resource name
        let imageName = filename.replacingOccurrences(of: ".png", with: "")
        
        guard let image = UIImage(named: imageName) else {
            print("❌ Failed to load image from bundle: \(filename)")
            return nil
        }
        
        print("✅ Successfully loaded image: \(filename) (\(image.size.width)x\(image.size.height))")
        return image
    }
    
    /// Check if beer photos have been processed
    func hasProcessedBeerPhotos() async -> Bool {
        let existingPhotos = await databaseManager.getAllBeerPhotos()
        return !existingPhotos.isEmpty
    }
    
    /// Get count of processed beer photos
    func getProcessedBeerPhotosCount() async -> Int {
        let existingPhotos = await databaseManager.getAllBeerPhotos()
        return existingPhotos.count
    }
    
    /// Reset all processed beer photos (for testing)
    func resetBeerPhotos() async {
        await MainActor.run {
            processingStatus = "Resetting beer photos..."
        }
        
        if await databaseManager.deleteAllBeerPhotos() {
            await MainActor.run {
                processedCount = 0
                processingStatus = "Reset completed."
            }
            print("🔄 Beer photos reset completed")
        } else {
            await MainActor.run {
                processingStatus = "Reset failed."
            }
            print("❌ Beer photos reset failed")
        }
    }
}