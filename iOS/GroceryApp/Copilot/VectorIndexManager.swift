import Foundation
import CouchbaseLiteSwift

/// Creates and reports on the Couchbase Lite vector indexes that power the copilot.
///
/// The important architectural point this file demonstrates: **the vector index lives on
/// the device, not in Capella.** App Services stores and replicates the vectors as
/// ordinary JSON float arrays and does no vector work at all. Couchbase Lite builds the
/// real ANN index locally from the synced documents, and every `APPROX_VECTOR_DISTANCE`
/// query runs at the edge.
///
/// Two things are worth knowing about how this behaves at the demo's dataset size:
///
///  * **Centroids.** Couchbase's guidance is `centroids ≈ √N`. The spec hardcodes 8; with
///    104 inventory documents per store the right value is 10. `centroidCount(for:)`
///    derives it so the number tracks the data instead of drifting from it.
///
///  * **Training.** A vector index is *trained* only once the collection holds enough
///    vectors, and Couchbase Lite's floor is 25 × centroids. This dataset does not reach it,
///    so nothing here is trained. That is not a failure: below the threshold Couchbase Lite
///    keeps the vectors as a flat list, treats them as one default centroid, and scans them
///    linearly, which at ~100 vectors is faster and more accurate than an approximate search.
///    Vectors are stored unquantized (`.none`) for the same reason, since quantization would
///    only add error with nothing to save.
enum VectorIndexManager {

    struct IndexSpec {
        let name: String
        let collection: String
        let expression: String
        let dimensions: UInt32
    }

    static let inventoryTextIndex = IndexSpec(
        name: "idx_inventory_text",
        collection: AppConfig.collectionName,
        expression: "embedding.text.vector",
        dimensions: UInt32(TextEmbedder.dimensions)
    )

    static let knowledgeTextIndex = IndexSpec(
        name: "idx_knowledge_text",
        collection: AppConfig.knowledgeCollectionName,
        expression: "embedding.text.vector",
        dimensions: UInt32(TextEmbedder.dimensions)
    )

    static let planogramImageIndex = IndexSpec(
        name: "idx_planogram_image",
        collection: AppConfig.planogramsCollectionName,
        expression: "embedding.image.vector",
        dimensions: 512
    )

    /// Product-image vectors. Not in the spec's index table, but per-facing crop matching
    /// needs it: each cropped shelf position is searched against these to identify which
    /// product is actually sitting there.

    /// Couchbase's sqrt(N) guidance for centroids. Training settings are left at their
    /// defaults, so an index only trains once its collection holds 25 x centroids vectors.
    ///
    /// This demo's dataset is below that, so the index is never partitioned: every vector sits
    /// in a single bucket and each query is a full scan. At this size that has no real impact.
    /// In a real app with a much larger dataset the index trains and partitions the vectors
    /// across centroids, so a query only scans the closest partitions instead of everything.
    /// Tune centroids and training size for your data.
    static func centroidCount(for vectorCount: Int) -> UInt32 {
        let bySqrt = Int(Double(vectorCount).squareRoot().rounded())
        return UInt32(min(max(bySqrt, 1), 64))
    }

    /// Result of an index-creation attempt, for logging and the diagnostics screen.
    struct Outcome {
        let spec: IndexSpec
        let created: Bool
        let alreadyExisted: Bool
        let vectorCount: Int
        let centroids: UInt32
        let skippedReason: String?
    }

    /// Creates the index if it is absent and the collection actually holds vectors.
    ///
    /// Guarded on a non-zero vector count because on a cold start the collection is empty
    /// until the first replication lands: creating the index against nothing produces an
    /// index that can never train. Callers re-run this after sync reaches idle.
    @discardableResult
    static func ensureIndex(_ spec: IndexSpec, in database: Database) throws -> Outcome {
        guard let collection = try database.collection(name: spec.collection,
                                                       scope: AppConfig.scopeName) else {
            return Outcome(spec: spec, created: false, alreadyExisted: false,
                           vectorCount: 0, centroids: 0,
                           skippedReason: "collection '\(spec.collection)' does not exist yet")
        }

        let vectorCount = try countVectors(in: collection, expression: spec.expression,
                                           database: database)
        guard vectorCount > 0 else {
            return Outcome(spec: spec, created: false, alreadyExisted: false,
                           vectorCount: 0, centroids: 0,
                           skippedReason: "no documents with '\(spec.expression)' yet — waiting for sync")
        }

        let existing = try collection.indexes()
        if existing.contains(spec.name) {
            return Outcome(spec: spec, created: false, alreadyExisted: true,
                           vectorCount: vectorCount,
                           centroids: centroidCount(for: vectorCount), skippedReason: nil)
        }

        let centroids = centroidCount(for: vectorCount)
        var config = VectorIndexConfiguration(expression: spec.expression,
                                              dimensions: spec.dimensions,
                                              centroids: centroids)
        config.metric = .cosine
        // Unquantized: ~100 vectors × 384 floats is ~160 KB, so there is nothing to save
        // by quantizing, and .none keeps distances exact.
        config.encoding = .none

        // Built eagerly: Couchbase Lite indexes every existing vector as soon as the index is
        // created. For a large collection, consider a lazy vector index (`isLazy = true`), which
        // defers that work and updates the index in batches you control, reducing the startup
        // cost of building it. Given this demo's small dataset, creating it this way is fine.
        // https://docs.couchbase.com/couchbase-lite/current/swift/working-with-vector-search.html
        try collection.createIndex(withName: spec.name, config: config)

        print("""
            🧭 [VectorIndex] created '\(spec.name)' on \(AppConfig.scopeName).\(spec.collection)
               expression=\(spec.expression) dim=\(spec.dimensions) metric=cosine encoding=none
               vectors=\(vectorCount) centroids=\(centroids) \
            minTrainingSize=\(config.minTrainingSize) maxTrainingSize=\(config.maxTrainingSize) (defaults)
            """)

        warmUp(spec, in: database)

        return Outcome(spec: spec, created: true, alreadyExisted: false,
                       vectorCount: vectorCount, centroids: centroids, skippedReason: nil)
    }

    /// Creates every index whose collection is populated. Returns one outcome per index so
    /// the caller can report which ones are still waiting on data.
    static func ensureAllIndexes(in database: Database) -> [Outcome] {
        var outcomes: [Outcome] = []
        for spec in [inventoryTextIndex, knowledgeTextIndex,
                     planogramImageIndex] {
            do {
                outcomes.append(try ensureIndex(spec, in: database))
            } catch {
                print("❌ [VectorIndex] failed to create '\(spec.name)': \(error)")
                outcomes.append(Outcome(spec: spec, created: false, alreadyExisted: false,
                                        vectorCount: 0, centroids: 0,
                                        skippedReason: "error: \(error.localizedDescription)"))
            }
        }
        return outcomes
    }

    /// Runs one throwaway vector query during setup rather than leaving the first one to the
    /// associate's first search.
    ///
    /// Couchbase Lite trains a vector index lazily, on the first query that uses it, and
    /// training needs a write lock. If that first query is a user search running while a
    /// replicator is writing, training loses the race and the search fails outright with
    /// `vectorsearch exception: database is locked`, which reads as "vector search is broken"
    /// rather than "try again". Doing it here, from `openDatabase()` before either replicator
    /// starts, avoids that.
    ///
    /// On this dataset nothing actually trains, because the collections sit below the training
    /// floor and are served by a linear scan. The call is kept because it costs one query at
    /// startup and is what makes the same code safe on a collection large enough to train.
    private static func warmUp(_ spec: IndexSpec, in database: Database) {
        let sql = """
            SELECT META().id
            FROM `\(AppConfig.scopeName)`.`\(spec.collection)`
            ORDER BY APPROX_VECTOR_DISTANCE(\(spec.expression), $probe, "cosine")
            LIMIT 1
            """
        do {
            let query = try database.createQuery(sql)
            let params = Parameters()
            // Any vector of the right dimension will do — only the training side effect
            // matters, not the result.
            params.setValue([Double](repeating: 0.05, count: Int(spec.dimensions)),
                            forName: "probe")
            query.parameters = params
            _ = try query.execute().allResults()
            print("🧭 [VectorIndex] '\(spec.name)' trained during setup")
        } catch {
            // Not fatal: the index will train on first use instead, and the query path
            // retries on a lock error.
            print("⚠️ [VectorIndex] warm-up of '\(spec.name)' failed: \(error.localizedDescription)")
        }
    }

    /// Counts documents that actually carry a vector at `expression`.
    private static func countVectors(in collection: Collection, expression: String,
                                     database: Database) throws -> Int {
        let sql = """
            SELECT COUNT(*) AS n
            FROM `\(AppConfig.scopeName)`.`\(collection.name)`
            WHERE \(expression) IS VALUED
            """
        let results = try database.createQuery(sql).execute()
        for row in results { return row.int(forKey: "n") }
        return 0
    }
}
