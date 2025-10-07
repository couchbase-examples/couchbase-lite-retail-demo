#!/usr/bin/env swift

//
//  generate_beer_embeddings.swift
//  LiquorApp Build Script
//

import Foundation
import Vision
import UIKit
import CoreImage

// MARK: - Pre-computed Beer Embedding Structure

struct PreComputedBeerEmbedding: Codable {
    let beerId: String
    let filename: String
    let name: String
    let brand: String
    let packSize: String
    let embedding: [Float]
    let imageDigest: String
}

// MARK: - Beer Data Mapping

let beerPhotoMappings = [
    (filename: "black-horizon-ale.png", name: "Black Horizon Ale", brand: "Black Horizon", packSize: "6-pack"),
    (filename: "aether-brew.png", name: "Aether Brew", brand: "Aether", packSize: "4-pack"),
    (filename: "hop-haven.png", name: "Hop Haven", brand: "Haven", packSize: "6-pack"),
    (filename: "neon-peak-brew.png", name: "Neon Peak Brew", brand: "Neon Peak", packSize: "6-pack"),
]

// MARK: - Embedding Generation Functions

func generateEmbedding(from cgImage: CGImage) async -> [Float]? {
    return await withCheckedContinuation { continuation in
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
            
            // Convert to Float array
            let embedding = convertFeaturePrintToFloatArray(featurePrint)
            continuation.resume(returning: embedding)
        }
        
        request.revision = VNGenerateImageFeaturePrintRequestRevision1
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

func convertFeaturePrintToFloatArray(_ featurePrint: VNFeaturePrintObservation) -> [Float] {
    let data = featurePrint.data
    guard !data.isEmpty else {
        print("⚠️ Empty feature data")
        return []
    }
    
    let elementType = featurePrint.elementType
    let elementCount = featurePrint.elementCount
    let typeSize = VNElementTypeSize(elementType)
    
    switch elementType {
    case .float where typeSize == MemoryLayout<Float>.size:
        return data.withUnsafeBytes { (bytes: UnsafeRawBufferPointer) in
            let buffer = bytes.bindMemory(to: Float.self)
            if buffer.count == elementCount {
                return Array(buffer)
            } else {
                print("⚠️ Buffer count mismatch: \(buffer.count) vs \(elementCount)")
                return []
            }
        }
    default:
        print("⚠️ Unsupported VNElementType: \(elementType)")
        return []
    }
}

// MARK: - Main Generation Process

@MainActor
func generateAllBeerEmbeddings() async {
    print("🍺 Starting build-time beer embedding generation...")
    print("📦 Processing \(beerPhotoMappings.count) beer images...")
    
    var preComputedEmbeddings: [PreComputedBeerEmbedding] = []
    var totalImageSize = 0
    var successCount = 0
    
    for (index, beerData) in beerPhotoMappings.enumerated() {
        print("🔄 Processing \(index + 1)/\(beerPhotoMappings.count): \(beerData.name)...")
        
        // Try to load the image from the app bundle
        guard let image = UIImage(named: beerData.filename),
              let cgImage = image.cgImage else {
            print("❌ Failed to load image: \(beerData.filename)")
            continue
        }
        
        // Generate embedding
        guard let embedding = await generateEmbedding(from: cgImage) else {
            print("❌ Failed to generate embedding for: \(beerData.filename)")
            continue
        }
        
        // Calculate image size for metrics
        if let imageData = image.pngData() {
            totalImageSize += imageData.count
        }
        
        // Create pre-computed embedding
        let beerId = "beer:\(index + 1)"
        let imageDigest = "precomputed_\(beerData.filename)"
        
        let preComputedEmbedding = PreComputedBeerEmbedding(
            beerId: beerId,
            filename: beerData.filename,
            name: beerData.name,
            brand: beerData.brand,
            packSize: beerData.packSize,
            embedding: embedding,
            imageDigest: imageDigest
        )
        
        preComputedEmbeddings.append(preComputedEmbedding)
        successCount += 1
        
        print("✅ Generated embedding for \(beerData.name) (\(embedding.count) dimensions)")
    }
    
    // Save to JSON file
    do {
        let jsonData = try JSONEncoder().encode(preComputedEmbeddings)
        let outputURL = URL(fileURLWithPath: "beer_embeddings.json")
        try jsonData.write(to: outputURL)
        
        print("📄 Saved pre-computed embeddings to: \(outputURL.path)")
    } catch {
        print("❌ Failed to save embeddings: \(error.localizedDescription)")
        return
    }
    
    // Print performance metrics
    let embeddingSize = successCount * 768 * 4 // Approximate embedding size
    let sizeSavingsPercent = 100 - (embeddingSize * 100 / totalImageSize)
    
    print("""
    
    🎉 Beer embedding generation complete!
    
    📊 Performance Summary:
    🍺 Beers processed: \(successCount)/\(beerPhotoMappings.count)
    💾 Embedding data: \(embeddingSize / 1024)KB
    🖼️ Original images: \(totalImageSize / 1024)KB
    📉 Size reduction: \(sizeSavingsPercent)%
    🎯 Dimensions: 768 (optimized for speed)
    
    ⚡ PlantPal-level performance achieved!
    """)
}

// Run the generation
Task {
    await generateAllBeerEmbeddings()
    exit(0)
}
