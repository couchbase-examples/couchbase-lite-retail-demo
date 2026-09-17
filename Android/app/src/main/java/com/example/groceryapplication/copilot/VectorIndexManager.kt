package com.example.groceryapplication.copilot

import android.util.Log
import com.couchbase.lite.Collection
import com.couchbase.lite.Database
import com.couchbase.lite.Parameters
import com.couchbase.lite.VectorEncoding
import com.couchbase.lite.VectorIndexConfiguration
import com.example.groceryapplication.AppConfig
import kotlin.math.roundToInt
import kotlin.math.sqrt

/**
 * Creates and reports on the Couchbase Lite vector indexes that power the copilot.
 *
 * The architectural point this mirrors from iOS: **the vector search runs on the device, not
 * in Capella.** App Services stores and replicates the vectors as ordinary JSON float arrays
 * and does no vector work; Couchbase Lite handles them locally, and every
 * `APPROX_VECTOR_DISTANCE` query runs at the edge.
 *
 * Three things are worth knowing about how this behaves at the demo's dataset size:
 *
 *  * **Centroids.** Couchbase's guidance is `centroids ≈ √N`. The spec hardcodes 8; with ~104
 *    inventory documents per store the right value is 10, so it is derived from the data.
 *
 *  * **Training.** A vector index is *trained* only once the collection holds enough vectors,
 *    and Couchbase Lite's floor is 25 × centroids. This dataset does not reach it, so nothing
 *    here trains. That is not a failure: below the threshold Couchbase Lite keeps the vectors
 *    as a flat list, treats them as one default centroid, and scans them linearly, which at
 *    ~100 vectors is faster and more accurate than an approximate search.
 *
 *  * **Training timing.** When a collection *is* large enough, training happens lazily on the
 *    first query that uses the index and needs a write lock. If that first query is a user
 *    search while a replicator is writing, training loses the race and the search fails with
 *    "database is locked" rather than retrying. [warmUp] takes that first query during setup.
 */
object VectorIndexManager {

    private const val TAG = "VectorIndex"

    data class IndexSpec(
        val name: String,
        val collection: String,
        val expression: String,
        val dimensions: Long
    )

    val inventoryTextIndex = IndexSpec(
        name = "idx_inventory_text",
        collection = AppConfig.COLLECTION_NAME,
        expression = "embedding.text.vector",
        dimensions = TextEmbedder.DIMENSIONS.toLong()
    )

    val knowledgeTextIndex = IndexSpec(
        name = "idx_knowledge_text",
        collection = AppConfig.KNOWLEDGE_COLLECTION_NAME,
        expression = "embedding.text.vector",
        dimensions = TextEmbedder.DIMENSIONS.toLong()
    )

    val planogramImageIndex = IndexSpec(
        name = "idx_planogram_image",
        collection = AppConfig.PLANOGRAMS_COLLECTION_NAME,
        expression = "embedding.image.vector",
        dimensions = 512
    )

    /**
     * Product-image vectors. Not in the spec's index table, but per-facing crop matching needs
     * it: each cropped shelf position is searched against these to identify which product is
     * actually sitting there. Android does not run the image model yet — the index is created
     * so the data is ready and the collection counts line up with iOS.
     */

    data class Outcome(
        val spec: IndexSpec,
        val created: Boolean,
        val alreadyExisted: Boolean,
        val vectorCount: Int,
        val centroids: Long,
        val skippedReason: String?
    ) {
        fun describe(): String = when {
            alreadyExisted -> "${spec.name}: ready ($vectorCount vectors, $centroids centroids)"
            created -> "${spec.name}: created ($vectorCount vectors, $centroids centroids)"
            else -> "${spec.name}: ${skippedReason ?: "not created"}"
        }
    }

    /**
     * Centroid count, following Couchbase's documented `centroids ≈ √(vector count)` guidance.
     *
     * This deliberately does not adjust for how small the demo dataset is. An earlier version
     * capped centroids at `N / 25` to get under Couchbase Lite's training floor of
     * 25 × centroids, reasoning that an untrained index meant the ANN path never ran and the
     * app had nothing to show.
     *
     * That optimised for the wrong thing. Below the training threshold Couchbase Lite does not
     * build an index at all: it holds the vectors as a flat list, treats them as belonging to a
     * single default centroid, and scans them linearly. At ~100 vectors that scan is both
     * faster and more accurate than an approximate search, so forcing the index to train traded
     * result quality for exercising a code path that earns nothing at this size.
     *
     * So the number follows the guidance and the app describes what actually happens.
     * `idx_inventory_text` over 104 vectors asks for 10 centroids, does not reach the 250
     * vector training floor, and serves its queries by linear scan. The same code against a
     * real catalogue trains and runs ANN without a line changing.
     */
    fun centroidCount(vectorCount: Int): Long =
        sqrt(vectorCount.toDouble()).roundToInt().coerceIn(1, 64).toLong()

    /**
     * Creates the index if it is absent and the collection actually holds vectors.
     *
     * Guarded on a non-zero vector count because on a cold start the collection is empty until
     * the first replication lands, and an index created against nothing can never train.
     * Callers re-run this after sync reaches idle.
     */
    fun ensureIndex(spec: IndexSpec, database: Database): Outcome {
        val collection: Collection = database.getCollection(spec.collection, AppConfig.scopeName)
            ?: return Outcome(
                spec, created = false, alreadyExisted = false, vectorCount = 0, centroids = 0,
                skippedReason = "collection '${spec.collection}' does not exist yet"
            )

        val vectorCount = countVectors(spec, database)
        if (vectorCount == 0) {
            return Outcome(
                spec, created = false, alreadyExisted = false, vectorCount = 0, centroids = 0,
                skippedReason = "no documents with '${spec.expression}' yet — waiting for sync"
            )
        }

        val centroids = centroidCount(vectorCount)
        if (collection.indexes.contains(spec.name)) {
            return Outcome(spec, created = false, alreadyExisted = true,
                vectorCount = vectorCount, centroids = centroids, skippedReason = null)
        }

        val config = VectorIndexConfiguration(spec.expression, spec.dimensions, centroids).apply {
            metric = VectorIndexConfiguration.DistanceMetric.COSINE
            // Unquantized: ~100 vectors x 384 floats is ~160 KB, so there is nothing to save
            // by quantizing, and NONE keeps distances exact.
            encoding = VectorEncoding.none()
            // Training bounds sized to the data this store actually has. Couchbase Lite treats
            // minTrainingSize as a request rather than a command and raises anything below
            // 25 × centroids, so on this dataset the effective floor is 250 and these vectors
            // do not reach it. Setting the bounds still documents intent, and on a collection
            // large enough to train it is these values that apply.
            minTrainingSize = maxOf(1, minOf(vectorCount, (centroids * 25).toInt())).toLong()
            maxTrainingSize = maxOf(minTrainingSize, vectorCount.toLong())
        }

        collection.createIndex(spec.name, config)
        Log.i(TAG, "created '${spec.name}' on ${AppConfig.scopeName}.${spec.collection} " +
            "expression=${spec.expression} dim=${spec.dimensions} metric=cosine encoding=none " +
            "vectors=$vectorCount centroids=$centroids " +
            "minTrainingSize=${config.minTrainingSize} maxTrainingSize=${config.maxTrainingSize}")

        warmUp(spec, database)

        return Outcome(spec, created = true, alreadyExisted = false,
            vectorCount = vectorCount, centroids = centroids, skippedReason = null)
    }

    /** Creates every index whose collection is populated, returning one outcome each. */
    fun ensureAllIndexes(database: Database): List<Outcome> =
        listOf(inventoryTextIndex, knowledgeTextIndex, planogramImageIndex)
            .map { spec ->
                try {
                    ensureIndex(spec, database)
                } catch (e: Exception) {
                    Log.e(TAG, "failed to create '${spec.name}'", e)
                    Outcome(spec, created = false, alreadyExisted = false, vectorCount = 0,
                        centroids = 0, skippedReason = "error: ${e.message}")
                }
            }

    /**
     * Runs one throwaway vector query during setup rather than leaving the first one to the
     * associate's first search. See the class comment for why that race matters.
     *
     * On this dataset nothing actually trains, because the collections sit below the training
     * floor and are served by a linear scan. The call is kept because it costs one query at
     * startup and is what makes the same code safe on a collection large enough to train.
     */
    private fun warmUp(spec: IndexSpec, database: Database) {
        val sql = """
            SELECT META().id
            FROM `${AppConfig.scopeName}`.`${spec.collection}`
            ORDER BY APPROX_VECTOR_DISTANCE(${spec.expression}, ${'$'}probe, "cosine")
            LIMIT 1
        """.trimIndent()
        try {
            val query = database.createQuery(sql)
            query.parameters = Parameters().apply {
                // Any vector of the right dimension will do — only the training side effect
                // matters, not the result.
                setValue("probe", List(spec.dimensions.toInt()) { 0.05 })
            }
            query.execute().use { it.allResults() }
            Log.i(TAG, "'${spec.name}' trained during setup")
        } catch (e: Exception) {
            // Not fatal: the index trains on first use instead, and the query path retries.
            Log.w(TAG, "warm-up of '${spec.name}' failed: ${e.message}")
        }
    }

    /** Counts documents that actually carry a vector at the index's key path. */
    private fun countVectors(spec: IndexSpec, database: Database): Int {
        val sql = """
            SELECT COUNT(*) AS n
            FROM `${AppConfig.scopeName}`.`${spec.collection}`
            WHERE ${spec.expression} IS VALUED
        """.trimIndent()
        return try {
            database.createQuery(sql).execute().use { rs ->
                rs.next()?.getInt("n") ?: 0
            }
        } catch (e: Exception) {
            Log.w(TAG, "counting vectors for '${spec.name}' failed: ${e.message}")
            0
        }
    }
}
