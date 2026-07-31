package com.example.groceryapplication.copilot

import android.content.Context
import android.util.Log
import com.couchbase.lite.Database
import com.couchbase.lite.Parameters
import com.couchbase.lite.Query
import com.couchbase.lite.Result
import com.example.groceryapplication.AppConfig
import com.example.groceryapplication.GroceryItem

/** A product returned by semantic search, with the distance that ranked it. */
data class SemanticHit(
    val item: GroceryItem,
    /** Cosine distance: 0 is identical, 2 is opposite. Lower is better. */
    val distance: Double
) {
    /**
     * Human-friendly confidence for the UI. Cosine distance on unit vectors maps linearly onto
     * similarity, which reads far better on screen than a raw distance.
     */
    val similarityPercent: Int get() = ((1.0 - distance / 2.0) * 100).toInt()
}

/** A retrieved knowledge chunk for the RAG step. */
data class KnowledgeHit(
    val id: String,
    val title: String,
    val chunkText: String,
    val sourceDoc: String,
    val distance: Double
)

/** What the last search actually did, for the behind-the-scenes screen. */
data class SearchTelemetry(
    val queryText: String = "",
    val embedMillis: Double = 0.0,
    val searchMillis: Double = 0.0,
    val candidatesReturned: Int = 0,
    val resultsAfterThreshold: Int = 0,
    val keywordResultCount: Int = 0,
    val tokenCount: Int = 0,
    val vectorPreview: List<Float> = emptyList()
)

/**
 * Runs the copilot's searches against Couchbase Lite — the Kotlin twin of the iOS service.
 *
 * Step 1 is a pure `APPROX_VECTOR_DISTANCE` query over the local `inventory` collection, using
 * a query vector embedded on-device a few milliseconds earlier. The same call also runs the
 * app's existing keyword `LIKE` search so the UI can show, side by side, what a non-semantic
 * search would have returned — which is the whole point being demonstrated.
 */
class CopilotSearchService(
    private val context: Context,
    private val databaseProvider: () -> Database?
) {
    private val embedder: TextEmbedder get() = TextEmbedder.shared(context)

    @Volatile
    var telemetry: SearchTelemetry = SearchTelemetry()
        private set

    companion object {
        private const val TAG = "CopilotSearch"

        /**
         * `APPROX_VECTOR_DISTANCE`'s third argument is the distance metric, and it defaults to
         * `euclidean2` — not to the metric the index was built with. Omitting it (as the
         * data-model spec's example queries do) fails at query time with
         * "euclidean2 does not match the index's metric, cosine".
         */
        private const val METRIC_ARG = "\"cosine\""

        /**
         * Executes a query, retrying briefly if the database is momentarily write-locked.
         *
         * The replicators write continuously, and an untrained vector index takes a write lock
         * to train on first use, so a query can legitimately lose a short race and come back
         * with "database is locked". Indexes are trained during setup to make that rare, but
         * rare is not never — retrying turns a hard failure into a few milliseconds of delay
         * instead of an error mid-demo.
         */
        fun <T> executeWithRetry(query: Query, attempts: Int = 3, block: (Result) -> T?): List<T> {
            var lastError: Exception? = null
            repeat(attempts) { attempt ->
                try {
                    query.execute().use { rs ->
                        return rs.allResults().mapNotNull(block)
                    }
                } catch (e: Exception) {
                    val locked = (e.message ?: "").contains("locked", ignoreCase = true) ||
                        (e.message ?: "").contains("busy", ignoreCase = true)
                    if (!locked) throw e
                    lastError = e
                    if (attempt < attempts - 1) Thread.sleep(120L * (attempt + 1))
                }
            }
            throw lastError ?: IllegalStateException("The database stayed busy; try again.")
        }
    }

    /**
     * Raised when the copilot is asked to search a database that has never synced.
     *
     * Without this the failure surfaces as "vector search with APPROX_VECTOR_DISTANCE requires a
     * vector index", which reads like a broken build rather than "there is no data yet". The app
     * is offline-first and ships with no bundled catalogue, so an empty database on first launch
     * is an expected state, not an error.
     */
    class NoLocalDataException : Exception(
        "No products on this device yet. Connect to the network so the catalogue can sync — " +
            "after that it stays available offline."
    )

    /** Cheap COUNT, to tell "nothing has synced yet" apart from "the query failed". */
    private fun localCount(collection: String): Int {
        val database = databaseProvider() ?: return 0
        val sql = "SELECT COUNT(*) AS n FROM `${AppConfig.scopeName}`.`$collection`"
        return try {
            database.createQuery(sql).execute().use { it.next()?.getInt("n") ?: 0 }
        } catch (e: Exception) {
            0
        }
    }

    // MARK: - Step 1: semantic product search

    /**
     * Embeds [query] on-device and returns the nearest inventory items.
     *
     * @param threshold cosine-distance ceiling; results above it are dropped as irrelevant.
     * @param category optional metadata filter, exercising the hybrid vector + `WHERE` path.
     * @param inStockOnly second hybrid predicate.
     */
    fun search(
        query: String,
        threshold: Double = AppConfig.DEFAULT_RELEVANCE_THRESHOLD,
        category: String? = null,
        inStockOnly: Boolean = false
    ): List<SemanticHit> {
        val trimmed = query.trim()
        if (trimmed.isEmpty()) return emptyList()
        val database = databaseProvider() ?: return emptyList()

        // An empty collection means nothing has synced yet, so the vector index does not exist
        // and the query below would fail with an index error. Say what is actually wrong.
        if (localCount(AppConfig.COLLECTION_NAME) == 0) throw NoLocalDataException()

        // ---- on-device query embedding (the live edge inference) ----
        val vector = embedder.embed(trimmed)
        val embedMs = embedder.lastEmbedMillis
        val tokens = embedder.tokenIds(trimmed)

        val distanceExpr =
            "APPROX_VECTOR_DISTANCE(embedding.text.vector, \$queryVector, $METRIC_ARG)"

        val predicates = mutableListOf("$distanceExpr IS VALUED")
        if (!category.isNullOrEmpty()) predicates += "category = \$category"
        if (inStockOnly) predicates += "stockQty > 0"

        // `IS VALUED` is the documented way to force the vector index to be used. Distance is
        // aliased once and ordered by the alias so the expensive function is not re-evaluated
        // per row in ORDER BY.
        val sql = """
            SELECT META().id AS id, name, category, price, imageURL, stockQty,
                   productId, sku, brand, unit, location, attributes,
                   description, searchTags, storeId, docType,
                   $distanceExpr AS distance
            FROM `${AppConfig.scopeName}`.`${AppConfig.COLLECTION_NAME}`
            WHERE ${predicates.joinToString("\n              AND ")}
            ORDER BY distance
            LIMIT ${AppConfig.COPILOT_SEARCH_LIMIT}
        """.trimIndent()

        val started = System.nanoTime()
        val cblQuery = database.createQuery(sql)
        cblQuery.parameters = Parameters().apply {
            // Fleece stores the authored vectors as doubles, so the query vector is passed as
            // doubles too — matching representations keeps the distances exact.
            setValue("queryVector", vector.map { it.toDouble() })
            if (!category.isNullOrEmpty()) setValue("category", category)
        }

        val candidates = executeWithRetry(cblQuery) { row ->
            val id = row.getString("id") ?: return@executeWithRetry null
            GroceryItem.from(row, id)?.let { SemanticHit(it, row.getDouble("distance")) }
        }
        val searchMs = (System.nanoTime() - started) / 1_000_000.0

        val relevant = candidates.filter { it.distance <= threshold }
        val keywordCount = keywordSearch(trimmed).size

        telemetry = SearchTelemetry(
            queryText = trimmed,
            embedMillis = embedMs,
            searchMillis = searchMs,
            candidatesReturned = candidates.size,
            resultsAfterThreshold = relevant.size,
            keywordResultCount = keywordCount,
            tokenCount = tokens.size,
            vectorPreview = vector.take(8)
        )
        return relevant
    }

    // MARK: - The keyword baseline

    /**
     * Reproduces the app's existing inventory search — substring `LIKE` over name and
     * category — so the copilot can show what the associate would have gotten without vector
     * search. Not a strawman: it is the same predicate, over the same catalogue.
     */
    fun keywordSearch(query: String): List<GroceryItem> {
        val database = databaseProvider() ?: return emptyList()
        val terms = query.lowercase()
            .split(Regex("[^\\p{L}\\p{N}]+"))
            .filter { it.length > 2 }
        if (terms.isEmpty()) return emptyList()

        val clauses = terms.indices.map { i ->
            "(LOWER(name) LIKE \$t$i OR LOWER(category) LIKE \$t$i)"
        }
        val sql = """
            SELECT META().id AS id, name, category, price, imageURL, stockQty,
                   productId, sku, brand, unit, location, attributes, storeId, docType
            FROM `${AppConfig.scopeName}`.`${AppConfig.COLLECTION_NAME}`
            WHERE ${clauses.joinToString(" OR ")}
            ORDER BY name
        """.trimIndent()

        return try {
            val cblQuery = database.createQuery(sql)
            cblQuery.parameters = Parameters().apply {
                terms.forEachIndexed { i, term -> setValue("t$i", "%$term%") }
            }
            executeWithRetry(cblQuery) { row ->
                row.getString("id")?.let { GroceryItem.from(row, it) }
            }
        } catch (e: Exception) {
            Log.e(TAG, "keyword search failed", e)
            emptyList()
        }
    }

    // MARK: - Step 3: RAG retrieval

    /**
     * Retrieves the top knowledge chunks for a question, optionally scoped to the category of
     * the product being discussed (the hybrid retrieval path from the spec's §8.2).
     */
    fun retrieveKnowledge(
        question: String,
        relatedCategory: String? = null,
        limit: Int = AppConfig.COPILOT_RAG_CHUNK_COUNT
    ): List<KnowledgeHit> {
        val database = databaseProvider() ?: return emptyList()
        val trimmed = question.trim()
        if (trimmed.isEmpty()) return emptyList()

        // Same reasoning as `search`: an unsynced knowledge collection has no index.
        if (localCount(AppConfig.KNOWLEDGE_COLLECTION_NAME) == 0) throw NoLocalDataException()

        val vector = embedder.embed(trimmed)
        val distanceExpr =
            "APPROX_VECTOR_DISTANCE(embedding.text.vector, \$queryVector, $METRIC_ARG)"

        val predicates = mutableListOf("$distanceExpr IS VALUED")
        if (relatedCategory != null) {
            predicates += "ARRAY_CONTAINS(relatedCategories, \$category)"
        }

        val sql = """
            SELECT META().id AS id, title, chunkText, sourceDoc, $distanceExpr AS distance
            FROM `${AppConfig.scopeName}`.`${AppConfig.KNOWLEDGE_COLLECTION_NAME}`
            WHERE ${predicates.joinToString(" AND ")}
            ORDER BY distance
            LIMIT $limit
        """.trimIndent()

        val cblQuery = database.createQuery(sql)
        cblQuery.parameters = Parameters().apply {
            setValue("queryVector", vector.map { it.toDouble() })
            if (relatedCategory != null) setValue("category", relatedCategory)
        }

        val hits = executeWithRetry(cblQuery) { row ->
            val id = row.getString("id") ?: return@executeWithRetry null
            KnowledgeHit(
                id = id,
                title = row.getString("title") ?: "",
                chunkText = row.getString("chunkText") ?: "",
                sourceDoc = row.getString("sourceDoc") ?: "",
                distance = row.getDouble("distance")
            )
        }

        // A category-scoped query can legitimately come back empty — the ANN candidate set is
        // gathered before the metadata predicate is applied, so a restrictive filter can
        // eliminate every candidate. Retrying unscoped keeps retrieval useful.
        if (hits.isEmpty() && relatedCategory != null) {
            return retrieveKnowledge(trimmed, null, limit)
        }
        return hits
    }

    /** Reads the embedding envelope of any product document, for the provenance panel. */
    fun storedVectorMetadata(): Map<String, String>? {
        val database = databaseProvider() ?: return null
        val sql = """
            SELECT embedding
            FROM `${AppConfig.scopeName}`.`${AppConfig.COLLECTION_NAME}`
            WHERE embedding.text.vector IS VALUED
            LIMIT 1
        """.trimIndent()
        return try {
            database.createQuery(sql).execute().use { rs ->
                val row = rs.next() ?: return null
                val text = row.getDictionary("embedding")?.getDictionary("text") ?: return null
                buildMap {
                    text.getString("model")?.let { put("Model", it) }
                    put("Dimensions", text.getInt("dim").toString())
                    text.getString("metric")?.let { put("Metric", it) }
                    text.getString("source")?.let {
                        put("Generated", if (it == "cloud") "offline / cloud, synced to device"
                            else "on the edge")
                    }
                    text.getString("sourceText")?.let { put("Embedded field", it) }
                }
            }
        } catch (e: Exception) {
            Log.w(TAG, "reading stored vector metadata failed: ${e.message}")
            null
        }
    }
}
