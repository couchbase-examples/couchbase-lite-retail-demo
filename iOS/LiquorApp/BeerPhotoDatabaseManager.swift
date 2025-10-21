import Foundation
import CouchbaseLiteSwift
import UIKit

/// Manager for beer photo database operations and vector search
class BeerPhotoDatabaseManager: ObservableObject {
    static let shared = BeerPhotoDatabaseManager()
    
    private let database: Database?
    private let collectionName = "beer_photos"
    private let vectorIndexName = "beer_embeddings_index"
    
    private init() {
        // Enable the vector search extension (like PlantPal)
        do {
            try CouchbaseLiteSwift.Extension.enableVectorSearch()
            print("✅ Vector search extension enabled")
        } catch {
            print("❌ Failed to enable vector search extension: \(error.localizedDescription)")
        }
        
        // Create/open database
        do {
            self.database = try Database(name: "LiquorInventoryDB")
            print("✅ Beer photos database opened successfully")
        } catch {
            print("❌ Failed to open database: \(error.localizedDescription)")
            self.database = nil
        }
        setupBeerPhotoCollection()
    }
    
    /// Set up the beer photos collection and vector index
    private func setupBeerPhotoCollection() {
        guard let database = database else {
            print("❌ Database not available for beer photos setup")
            return
        }
        
        do {
            // Create or get the beer photos collection
            let collection = try database.createCollection(name: collectionName)
            
            // Create vector index for embeddings
            try createVectorIndex(collection: collection)
            
            print("✅ Beer photos collection and vector index set up successfully")
        } catch {
            print("❌ Failed to setup beer photos collection: \(error.localizedDescription)")
        }
    }
    
    /// Create real vector index for beer photo embeddings using Couchbase Vector Search
    private func createVectorIndex(collection: Collection) throws {
        // Check if index already exists
        let existingIndexes = try collection.indexes()
        if existingIndexes.contains(vectorIndexName) {
            print("📊 Vector index '\(vectorIndexName)' already exists")
            return
        }
        
        // Create a real vector index on the embedding field (2048 dimensions from Vision framework)
        var vectorIndexConfig = VectorIndexConfiguration(expression: "embedding", dimensions: 2048, centroids: 8)
        vectorIndexConfig.metric = .cosine // Use cosine similarity
        vectorIndexConfig.isLazy = true // Enable lazy indexing for better performance (like PlantPal)
        try collection.createIndex(withName: vectorIndexName, config: vectorIndexConfig)
        
        // Also create a value index on type field for fast filtering
        let typeIndexName = "beer_type_index"
        if !existingIndexes.contains(typeIndexName) {
            let valueIndexConfig = ValueIndexConfiguration(["type"])
            try collection.createIndex(withName: typeIndexName, config: valueIndexConfig)
        }
        
        print("✅ Created vector index '\(vectorIndexName)' with 2048 dimensions and cosine similarity")
        
        // Setup async indexing (like PlantPal)
        setupAsyncIndexing(for: collection)
    }
    
    // MARK: - Async Indexing (inspired by PlantPal)
    
    private let asyncIndexQueue = DispatchQueue(label: "BeerPhotoAsyncIndexUpdateQueue")
    
    private func setupAsyncIndexing(for collection: Collection) {
        // Immediately update the async indexes
        asyncIndexQueue.async { [weak self] in
            Task {
                do {
                    try await self?.updateAsyncIndexes(for: collection)
                } catch {
                    print("Error updating beer photo async indexes: \(error)")
                }
            }
        }
        
        // When the collection changes, update the async indexes
        // Note: Not storing token - this listener lives for the lifetime of the manager
        _ = collection.addChangeListener { [weak self] _ in
            guard let self = self else { return }
            self.asyncIndexQueue.async {
                Task { [weak self] in
                    guard let self = self else { return }
                    do {
                        try await self.updateAsyncIndexes(for: collection)
                    } catch {
                        print("Error updating beer photo async indexes: \(error)")
                    }
                }
            }
        }
    }
    
    private func updateAsyncIndexes(for collection: Collection) async throws {
        var batchCount = 0
        
        // Check if beer photo vector index exists
        if let vectorIndex = try collection.index(withName: vectorIndexName) {
            // Update the beer photos vector index with smaller batches
            while (true) {
                guard let indexUpdater = try vectorIndex.beginUpdate(limit: 3) else {
                    break // Up to date
                }
                batchCount += 1
                
                print("🔄 Processing beer photo vector batch \(batchCount) (\(indexUpdater.count) items)...")
                
                // Generate the new embedding and set it in the index
                for i in 0..<indexUpdater.count {
                    if let data = indexUpdater.blob(at: i)?.content, let image = UIImage(data: data) {
                        if let embedding = await EmbeddingManager.shared.generateEmbedding(from: image) {
                            try indexUpdater.setVector(embedding, at: i)
                        } else {
                            print("Warning: Could not generate embedding for beer photo at position \(i)")
                        }
                    } else {
                        print("Warning: Could not process beer photo data for vector index at position \(i)")
                    }
                }
                try indexUpdater.finish()
                
                // Add a small delay between batches to prevent overwhelming the system
                Thread.sleep(forTimeInterval: 0.1)
            }
        } else {
            print("📊 Beer photo vector index not found")
        }
    }
    
    /// Save a beer photo item to the database
    /// - Parameter beerPhoto: The beer photo item to save
    /// - Returns: Success status
    func saveBeerPhoto(_ beerPhoto: BeerPhotoItem) async -> Bool {
        guard let database = database else {
            print("❌ Database not available")
            return false
        }
        
        do {
            let collection = try database.createCollection(name: collectionName)
            let document = MutableDocument(id: beerPhoto.id, data: beerPhoto.toDictionary())
            try collection.save(document: document)
            
            print("✅ Saved beer photo: \(beerPhoto.name)")
            return true
        } catch {
            print("❌ Failed to save beer photo: \(error.localizedDescription)")
            return false
        }
    }
    
    /// Get all beer photos from the database
    /// - Returns: Array of beer photo items
    func getAllBeerPhotos() async -> [BeerPhotoItem] {
        print("🚨 NEW VERSION: getAllBeerPhotos called - if you see this, the new build is running")
        guard let database = database else {
            print("❌ Database not available")
            return []
        }
        
        do {
            let collection = try database.createCollection(name: collectionName)
            
            // First, let's check if there are any documents at all
            let countQuery = QueryBuilder
                .select(SelectResult.expression(Function.count(Expression.string("*"))))
                .from(DataSource.collection(collection))
            
            let countResults = try countQuery.execute()
            let totalDocs = countResults.next()?.int(at: 0) ?? 0
            print("🔍 Total documents in collection '\(collectionName)': \(totalDocs)")
            
            // Query all beer photo documents
            let query = QueryBuilder
                .select(SelectResult.all())
                .from(DataSource.collection(collection))
                .where(Expression.property("type").equalTo(Expression.string("beer_photo")))
            
            let results = try query.execute()
            var beerPhotos: [BeerPhotoItem] = []
            var resultCount = 0
            
            for result in results {
                resultCount += 1
                print("🔍 Processing result \(resultCount)")
                
                if let dictObj = result.dictionary(forKey: collectionName) {
                    print("✅ Got dictionary object with keys: \(dictObj.keys)")
                    
                    // Convert DictionaryObject to [String: Any]
                    var dict: [String: Any] = [:]
                    for key in dictObj.keys {
                        dict[key] = dictObj.value(forKey: key)
                    }
                    
                    print("📋 Converted dict keys: \(dict.keys)")
                    print("📋 Dict type field: \(dict["type"] as? String ?? "nil")")
                    
                    if let beerPhoto = BeerPhotoItem.fromDictionary(dict) {
                        beerPhotos.append(beerPhoto)
                        print("✅ Successfully created BeerPhotoItem: \(beerPhoto.name)")
                    } else {
                        print("❌ Failed to create BeerPhotoItem from dict: \(dict)")
                    }
                } else {
                    print("❌ No dictionary found for key '\(collectionName)' in result")
                }
            }
            
           // print("📊 Retrieved \(beerPhotos.count) beer photos from database")
            return beerPhotos
        } catch {
            print("❌ Failed to retrieve beer photos: \(error.localizedDescription)")
            return []
        }
    }
    
    /// Search for similar beer photos using Couchbase Vector Search with SQL++
    /// - Parameters:
    ///   - queryEmbedding: The embedding vector to search for
    ///   - limit: Maximum number of results to return
    /// - Returns: Array of similar beer photos with similarity scores
    func searchSimilarBeerPhotos(queryEmbedding: [Float], limit: Int = 10) async -> [(BeerPhotoItem, Float)] {
        // 🚀 OPTIMIZATION: Use pre-computed embeddings for PlantPal-level performance
        let embeddingLoader = BuildTimeBeerEmbeddingLoader.shared
        
        if embeddingLoader.hasPreComputedEmbeddings {
            print("⚡ Using pre-computed embeddings for instant search (PlantPal style)...")
            
            // Search using pre-computed embeddings (much faster than SQL++)
            let preComputedResults = embeddingLoader.searchSimilarBeers(queryEmbedding: queryEmbedding, limit: limit)
            
            // Convert to BeerPhotoItem format
            let searchResults: [(BeerPhotoItem, Float)] = preComputedResults.map { (preComputedBeer, similarity) in
                let beerPhoto = BeerPhotoItem(
                    filename: preComputedBeer.filename,
                    name: preComputedBeer.name,
                    brand: preComputedBeer.brand,
                    packSize: preComputedBeer.packSize,
                    embedding: preComputedBeer.embedding
                )
                return (beerPhoto, similarity)
            }
            
            print("⚡ Found \(searchResults.count) beer matches using pre-computed embeddings")
            return searchResults
        } else {
            print("⚠️ Pre-computed embeddings not available, falling back to database search...")
            return await fallbackDatabaseSearch(queryEmbedding: queryEmbedding, limit: limit)
        }
    }
    
    /// Fallback database search when pre-computed embeddings are not available
    private func fallbackDatabaseSearch(queryEmbedding: [Float], limit: Int) async -> [(BeerPhotoItem, Float)] {
        guard let database = database else {
            print("❌ Database not available for vector search")
            return []
        }
        
        do {
            let collection = try database.createCollection(name: collectionName)
            
            // Simple SQL query without vector search for fallback
            let sql = """
                SELECT META().id, filename, name, brand, packSize, embedding, dateAdded
                FROM \(collectionName)
                WHERE type = "beer_photo"
                LIMIT \(limit * 2)
            """
            
            let query = try database.createQuery(sql)
            let results = try query.execute()
            var searchResults: [(BeerPhotoItem, Float)] = []
            
            for result in results {
                guard let filename = result.string(forKey: "filename"),
                      let name = result.string(forKey: "name"),
                      let brand = result.string(forKey: "brand"),
                      let packSize = result.string(forKey: "packSize"),
                      let embeddingArray = result.array(forKey: "embedding") else {
                    continue
                }
                
                // Convert ArrayObject to [Float]
                var embedding: [Float] = []
                for i in 0..<embeddingArray.count {
                    embedding.append(embeddingArray.float(at: i))
                }
                
                // Manual similarity calculation
                let similarity = calculateCosineSimilarity(queryEmbedding, embedding)
                
                let beerPhoto = BeerPhotoItem(
                    filename: filename,
                    name: name,
                    brand: brand,
                    packSize: packSize,
                    embedding: embedding
                )
                
                searchResults.append((beerPhoto, similarity))
            }
            
            // Sort by similarity and apply filtering
            let sortedResults = searchResults.sorted { $0.1 > $1.1 }
            let filteredResults = Array(sortedResults.prefix(limit))
            
            print("🔍 Found \(filteredResults.count) beer matches using fallback database search")
            return filteredResults
        } catch {
            print("❌ Failed to execute fallback database search: \(error.localizedDescription)")
            return []
        }
    }
    
    /// Calculate cosine similarity between two vectors (PlantPal style)
    private func calculateCosineSimilarity(_ a: [Float], _ b: [Float]) -> Float {
        guard a.count == b.count else { return 0.0 }
        
        let dotProduct = zip(a, b).map { $0 * $1 }.reduce(0, +)
        let magnitudeA = sqrt(a.map { $0 * $0 }.reduce(0, +))
        let magnitudeB = sqrt(b.map { $0 * $0 }.reduce(0, +))
        
        guard magnitudeA > 0 && magnitudeB > 0 else { return 0.0 }
        
        return dotProduct / (magnitudeA * magnitudeB)
    }
    
    /// Apply relaxed filtering for better beer detection (PlantPal style)
    private func applyPlantPalFiltering(to results: [(BeerPhotoItem, Float)]) -> [(BeerPhotoItem, Float)] {
        guard !results.isEmpty else {
            print("🤷‍♂️ No similarity results to filter")
            return []
        }
        
        // 🔧 MUCH MORE PERMISSIVE: Accept reasonable confidence matches (>= 0.3)
        let reasonableMatches = results.filter { $0.1 >= 0.3 }
        
        if reasonableMatches.isEmpty {
            print("🤷‍♂️ No reasonable beer photo matches found (>= 30%)")
            return []
        }
        
        // Sort by similarity (best first)
        let sortedResults = reasonableMatches.sorted { $0.1 > $1.1 }
        let bestSimilarity = sortedResults.first?.1 ?? 0.0
        
        // 🔧 RELAXED FILTERING: Accept anything within 50% of best match (very permissive)
        let filteredResults = sortedResults.filter { $0.1 >= bestSimilarity * 0.5 }
        
        print("✅ Applied relaxed filtering: \(results.count) → \(filteredResults.count) results (best: \(String(format: "%.1f", bestSimilarity * 100))%)")
        return Array(filteredResults.prefix(5)) // Return top 5 matches
    }
    

    
    /// Delete all beer photos (for testing/reset purposes)
    func deleteAllBeerPhotos() async -> Bool {
        guard let database = database else {
            print("❌ Database not available")
            return false
        }
        
        do {
            let collection = try database.createCollection(name: collectionName)
            
            // Query all beer photo documents
            let query = QueryBuilder
                .select(SelectResult.expression(Meta.id))
                .from(DataSource.collection(collection))
                .where(Expression.property("type").equalTo(Expression.string("beer_photo")))
            
            let results = try query.execute()
            
            for result in results {
                if let docId = result.string(forKey: "id") {
                    try collection.delete(document: collection.document(id: docId)!)
                }
            }
            
            print("🗑️ Deleted all beer photos from database")
            return true
        } catch {
            print("❌ Failed to delete beer photos: \(error.localizedDescription)")
            return false
        }
    }
}