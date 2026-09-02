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
 * The architectural point this mirrors from iOS: **the vector index lives on the device, not
 * in Capella.** App Services stores and replicates the vectors as ordinary JSON float arrays
 * and does no vector work; Couchbase Lite builds the real ANN index locally from the synced
 * documents, and every `APPROX_VECTOR_DISTANCE` query runs at the edge.
 *
 * Three things make this work at this dataset's size, all of which the spec gets wrong or
 * omits:
 *
 *  * **Centroids.** Couchbase's guidance is `centroids ≈ √N`. The spec hardcodes 8; with ~104
 *    inventory documents per store the right value is 10, so it is derived from the data.
 *
 *  * **Training size.** A vector index must be *trained* before it serves queries, and
 *    training only starts once the collection holds `minTrainingSize` vectors. The default for
 *    the quantized encodings is a multiple of the centroid count — far more than 104 — so with
 *    defaults the index silently never trains and queries come back empty.
 *
 *  * **Training timing.** Training happens lazily on the first query that uses the index and
 *    needs a write lock. If that first query is a user search while a replicator is writing,
 *    training loses the race and the search fails with "database is locked" rather than
 *    retrying. [warmUp] forces training during setup instead.
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
     * Centroid count that both follows the √N guidance and lets the index actually train.
     *
     * Couchbase's documented guidance is `centroids ≈ √(vector count)` — 10 for this dataset's
     * 104 inventory vectors. But Couchbase Lite enforces its own training floor of
     * **25 × centroids** vectors and silently raises whatever `minTrainingSize` you set to
     * meet it: ask for 10 centroids over 104 vectors and the log reads
     * "minTrainingSize of 20 is too small; raising it to 250", followed by
     * "Untrained index; queries may be slow. 250 vectors needed for training; 104 present."
     *
     * An untrained index is not broken — queries fall back to an exact brute-force scan and
     * return correct results, which at ~100 vectors is both fine and fast. But it means the ANN
     * code path never runs, which is precisely what this app exists to demonstrate. Capping
     * centroids at `N / 25` keeps the index trainable: 104 vectors gives 4 centroids and a
     * training floor of 100, which the data clears.
     *
     * Collections genuinely too small to train at all (10 knowledge chunks, 3 planograms) fall
     * back to brute force, and that is the right answer for them.
     */
    fun centroidCount(vectorCount: Int): Long {
        val bySqrt = sqrt(vectorCount.toDouble()).roundToInt()
        val trainable = vectorCount / 25
        return minOf(bySqrt, maxOf(trainable, 1)).coerceIn(1, 64).toLong()
    }

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
            // Training bounds sized to the data this store actually has. Note that Couchbase
            // Lite treats minTrainingSize as a request, not a command: it raises anything
            // below 25 × centroids. Setting it still documents intent, but [centroidCount] is
            // what actually determines whether the index can train.
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
     * Runs one throwaway vector query so the index trains here rather than on the associate's
     * first search. See the class comment for why that race matters.
     */
    private fun warmUp(spec: IndexSpec, database: Database) {
        val sql = """
            SELECT META().id
            FROM `${AppConfig.scopeName}`.`${spec.collection}`
            WHERE APPROX_VECTOR_DISTANCE(${spec.expression}, ${'$'}probe, "cosine") IS VALUED
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
