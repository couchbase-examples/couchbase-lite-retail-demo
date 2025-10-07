//
//  BuildTimeBeerEmbeddingLoader.swift
//  LiquorApp
//

import Foundation
import UIKit

// MARK: - Pre-computed Beer Embedding

struct PreComputedBeerEmbedding: Codable {
    let beerId: String
    let filename: String
    let name: String
    let brand: String
    let packSize: String
    let embedding: [Float]
    let imageDigest: String
}

class BuildTimeBeerEmbeddingLoader {
    static let shared = BuildTimeBeerEmbeddingLoader()
    
    internal var preComputedEmbeddings: [String: PreComputedBeerEmbedding] = [:]
    private var isLoaded = false
    
    private init() {
        // Load pre-computed embeddings at initialization
        loadPreComputedEmbeddings()
    }
    
    // MARK: - Load Pre-computed Embeddings
    
    private func loadPreComputedEmbeddings() {
        var embeddingsURL: URL?
        
        // First try Documents directory (for runtime-generated embeddings)
        if let documentsPath = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first {
            let documentsURL = documentsPath.appendingPathComponent("beer_embeddings.json")
            if FileManager.default.fileExists(atPath: documentsURL.path) {
                embeddingsURL = documentsURL
                print("📱 Loading REAL embeddings from Documents directory...")
            }
        }
        
        // Fallback to bundle (for default embeddings)
        if embeddingsURL == nil {
            embeddingsURL = Bundle.main.url(forResource: "beer_embeddings", withExtension: "json")
            print("📦 Loading default embeddings from app bundle...")
        }
        
        guard let url = embeddingsURL,
              let data = try? Data(contentsOf: url),
              let embeddings = try? JSONDecoder().decode([PreComputedBeerEmbedding].self, from: data) else {
            print("❌ Failed to load pre-computed beer embeddings, falling back to runtime generation")
            return
        }
        
        print("📦 Loading \(embeddings.count) pre-computed beer embeddings...")
        
        // Store embeddings indexed by beer ID for quick lookup
        preComputedEmbeddings.removeAll() // Clear existing
        for embedding in embeddings {
            preComputedEmbeddings[embedding.beerId] = embedding
        }
        
        isLoaded = true
        print("✅ Pre-computed beer embeddings loaded successfully!")
        
        let embeddingSize = embeddings.first?.embedding.count ?? 0
        let memoryKB = embeddings.count * embeddingSize * 4 / 1024
        print("💾 Memory usage: ~\(memoryKB)KB")
        print("🔢 Embedding dimensions: \(embeddingSize)")
    }
    
    // MARK: - Process Beer Data with Pre-computed Embeddings
    
    func processBeerData() {
        print("🍺 Processing beer data with pre-computed embeddings...")
        print("✅ Pre-computed embeddings loaded: \(preComputedEmbeddings.count) beers")
        
        // The actual database processing is handled by the existing BeerPhotoDatabaseManager
        // This loader just provides the pre-computed embeddings for fast search functionality
        
        print("🎉 Beer data processing complete!")
    }
    
    // MARK: - Reload Embeddings
    
    func loadEmbeddings() async {
        await MainActor.run {
            loadPreComputedEmbeddings()
        }
    }
    
    // MARK: - Fast Embedding Access Methods
    
    func getEmbedding(forBeerId beerId: String) -> [Float]? {
        return preComputedEmbeddings[beerId]?.embedding
    }
    
    func getEmbedding(forBeerName beerName: String) -> [Float]? {
        for (_, embedding) in preComputedEmbeddings {
            if embedding.name == beerName {
                return embedding.embedding
            }
        }
        return nil
    }
    
    func getAllBeerEmbeddings() -> [PreComputedBeerEmbedding] {
        return Array(preComputedEmbeddings.values)
    }
    
    var hasPreComputedEmbeddings: Bool {
        return isLoaded && !preComputedEmbeddings.isEmpty
    }
    
    // MARK: - Fast Similarity Search (PlantPal Style)
    
    func searchSimilarBeers(queryEmbedding: [Float], limit: Int = 10) -> [(PreComputedBeerEmbedding, Float)] {
        guard isLoaded && !preComputedEmbeddings.isEmpty else {
            print("❌ Pre-computed embeddings not available")
            return []
        }
        
        print("🔍 Searching beers using pre-computed embeddings (PlantPal style)...")
        
        // Calculate similarities with all pre-computed embeddings
        var similarities: [(embedding: PreComputedBeerEmbedding, similarity: Float, distance: Float)] = []
        
        for (_, beerEmbedding) in preComputedEmbeddings {
            let similarity = cosineSimilarity(queryEmbedding, beerEmbedding.embedding)
            let distance = 1.0 - similarity // Convert similarity to distance
            similarities.append((embedding: beerEmbedding, similarity: similarity, distance: distance))
        }
        
        // Sort by similarity (descending) and use VERY relaxed filtering
        let sortedSimilarities = similarities.sorted { $0.similarity > $1.similarity }
        let bestMatches = sortedSimilarities.filter { $0.distance <= 0.8 }.prefix(limit) // Much more permissive
        
        if bestMatches.isEmpty {
            print("🤷‍♂️ No beer matches found (even with relaxed criteria)")
            // Return the best match regardless of threshold
            if let best = sortedSimilarities.first {
                return [(best.embedding, best.similarity)]
            }
            return []
        }
        
        // Convert to results format
        
        // Post process and filter any matches that are too far away from the closest match (PlantPal filtering)
        var filteredResults: [(PreComputedBeerEmbedding, Float)] = []
        let distances = bestMatches.map { Double($0.distance) }
        let minimumDistance = distances.min() ?? .greatestFiniteMagnitude
        
        for match in bestMatches {
            if Double(match.distance) <= minimumDistance * 1.40 {
                filteredResults.append((match.embedding, match.similarity))
            }
        }
        
        print("✅ Found \(filteredResults.count) beer matches using pre-computed embeddings")
        return filteredResults
    }
    
    // MARK: - Embedding Generation for New Images (Camera Captures)
    
    func getEmbeddingForNewImage(_ image: UIImage) async -> [Float]? {
        // For new images (camera captures), we still need to generate embeddings
        // This uses the same EmbeddingManager but only for new images
        return await EmbeddingManager.shared.generateEmbedding(from: image)
    }
    
    // MARK: - Cosine Similarity Calculation (PlantPal Style)
    
    private func cosineSimilarity(_ a: [Float], _ b: [Float]) -> Float {
        guard a.count == b.count else { return 0.0 }
        
        let dotProduct = zip(a, b).map { $0 * $1 }.reduce(0, +)
        let magnitudeA = sqrt(a.map { $0 * $0 }.reduce(0, +))
        let magnitudeB = sqrt(b.map { $0 * $0 }.reduce(0, +))
        
        guard magnitudeA > 0 && magnitudeB > 0 else { return 0.0 }
        
        return dotProduct / (magnitudeA * magnitudeB)
    }
    
    // MARK: - Performance Metrics
    
    func printPerformanceMetrics() {
        let embeddingCount = preComputedEmbeddings.count
        let embeddingSize = embeddingCount * 768 * 4 // 768 floats * 4 bytes each
        let estimatedImageSize = embeddingCount * 100 * 1024 // Estimate 100KB per beer image
        
        print("""
        📊 Pre-computed Beer Embedding Performance:
        
        🍺 Beers: \(embeddingCount)
        💾 Embedding data: \(embeddingSize / 1024)KB
        🖼️ Estimated original images: \(estimatedImageSize / 1024 / 1024)MB
        📉 Size reduction: \(100 - (embeddingSize * 100 / estimatedImageSize))%
        
        ⚡ Performance benefits:
        • No runtime embedding generation for known beers
        • Instant beer database search
        • Reduced memory usage
        • Faster app startup and scanning
        • PlantPal-level performance
        """)
    }
    

}
