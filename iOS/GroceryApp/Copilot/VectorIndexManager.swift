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
/// Two things make this actually work at this dataset's size, both of which the data-model
/// spec gets wrong or leaves out:
///
///  * **Centroids.** Couchbase's guidance is `centroids ≈ √N`. The spec hardcodes 8; with
///    104 inventory documents per store the right value is 10. `centroidCount(for:)`
///    derives it so the number tracks the data instead of drifting from it.
///
///  * **Training size.** A vector index must be *trained* before it serves queries, and
///    training only kicks off once the collection holds `minTrainingSize` vectors. The
///    default for the quantized encodings is a multiple of the centroid count — far more
///    than 104 — so with defaults the index silently never trains and queries come back
///    empty. Vectors are stored unquantized (`.none`) and the training bounds are set
///    explicitly, which is both correct here and honest: at ~100 vectors ANN buys nothing
///    over brute force, and quantization would only add error.
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
    static let inventoryImageIndex = IndexSpec(
        name: "idx_inventory_image",
        collection: AppConfig.collectionName,
        expression: "embedding.image.vector",
        dimensions: 512
    )

    /// Centroid count that both follows the √N guidance and lets the index actually train.
    ///
    /// Couchbase's documented guidance is `centroids ≈ √(vector count)` — 10 for this
    /// dataset's 104 inventory vectors. But Couchbase Lite enforces its own training floor of
    /// **25 × centroids** vectors and silently raises whatever `minTrainingSize` is set to in
    /// order to meet it. Asking for 10 centroids over 104 vectors logs
    /// "minTrainingSize of 20 is too small; raising it to 250", then
    /// "Untrained index; queries may be slow. 250 vectors needed for training; 104 present."
    ///
    /// An untrained index is not broken — queries fall back to an exact brute-force scan and
    /// return correct results, which at ~100 vectors is both fine and fast. But the ANN code
    /// path never runs, which is precisely what this app exists to demonstrate. Capping
    /// centroids at `N / 25` keeps the index trainable: 104 vectors gives 4 centroids and a
    /// training floor of 100, which the data clears.
    ///
    /// Collections genuinely too small to train at all (10 knowledge chunks, 3 planograms)
    /// fall back to brute force, and that is the right answer for them.
    static func centroidCount(for vectorCount: Int) -> UInt32 {
        let bySqrt = Int(Double(vectorCount).squareRoot().rounded())
        let trainable = vectorCount / 25
        return UInt32(min(max(min(bySqrt, max(trainable, 1)), 1), 64))
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
        // Training bounds sized to the data this store actually has. Note that Couchbase Lite
        // treats minTrainingSize as a request, not a command: it raises anything below
        // 25 × centroids. Setting it is still worth doing — it documents intent and keeps the
        // value sane if the centroid count changes — but `centroidCount(for:)` is what
        // actually determines whether the index can train.
        config.minTrainingSize = UInt32(max(1, min(vectorCount, Int(centroids) * 25)))
        config.maxTrainingSize = UInt32(max(Int(config.minTrainingSize), vectorCount))

        try collection.createIndex(withName: spec.name, config: config)

        print("""
            🧭 [VectorIndex] created '\(spec.name)' on \(AppConfig.scopeName).\(spec.collection)
               expression=\(spec.expression) dim=\(spec.dimensions) metric=cosine encoding=none
               vectors=\(vectorCount) centroids=\(centroids) \
            minTrainingSize=\(config.minTrainingSize) maxTrainingSize=\(config.maxTrainingSize)
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
                     planogramImageIndex, inventoryImageIndex] {
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

    /// Runs one throwaway vector query so the index trains here rather than on the
    /// associate's first search.
    ///
    /// Couchbase Lite trains a vector index lazily, on the first query that uses it, and
    /// training needs a write lock. If the first query happens to be a user search while a
    /// replicator is writing, training loses the race and the search fails outright with
    /// `vectorsearch exception: database is locked` — which reads as "vector search is
    /// broken" rather than "try again". Training during setup avoids that entirely: this
    /// runs from `openDatabase()`, before either replicator has started.
    private static func warmUp(_ spec: IndexSpec, in database: Database) {
        let sql = """
            SELECT META().id
            FROM `\(AppConfig.scopeName)`.`\(spec.collection)`
            WHERE APPROX_VECTOR_DISTANCE(\(spec.expression), $probe, "cosine") IS VALUED
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
