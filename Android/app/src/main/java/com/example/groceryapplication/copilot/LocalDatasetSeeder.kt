package com.example.groceryapplication.copilot

import android.content.Context
import android.util.Log
import com.couchbase.lite.Database
import com.couchbase.lite.MutableDocument
import com.example.groceryapplication.AppConfig
import com.example.groceryapplication.StoreLocation
import org.json.JSONArray
import org.json.JSONObject

/**
 * Seeds the bundled extended dataset into the local database when a collection is empty.
 *
 * Why this exists: the extended dataset — descriptions, search tags, shelf/section, real
 * MiniLM vectors, planograms, knowledge chunks and tasks — may not be in the configured
 * backend yet, and the point of this app is that a developer can pick it up and see edge vector
 * search working. Requiring a provisioned Capella cluster before the copilot does anything
 * would defeat that.
 *
 * Deliberately conservative, matching iOS:
 *  * only seeds a collection that is **empty**, so it can never overwrite synced data;
 *  * uses the dataset's own `id` as the document ID, so when App Services comes online the
 *    same documents replicate over these as ordinary updates rather than duplicates;
 *  * writes `stockQty` as a plain integer and leaves the CRDT quantity counter alone, so the
 *    existing increment/decrement flow initialises exactly as it does for synced docs.
 */
object LocalDatasetSeeder {

    private const val TAG = "Seeder"
    private const val ASSET_DIR = "copilot/dataset"

    data class SeedResult(
        val collection: String,
        val inserted: Int,
        val skippedReason: String?
    )

    /** Maps a collection to the bundled file for the currently selected store. */
    private fun assetName(collection: String): String? {
        val prefix = if (AppConfig.currentStore == StoreLocation.NYC) "nyc_store" else "aa_store"
        return when (collection) {
            AppConfig.COLLECTION_NAME -> "${prefix}_inventory"
            AppConfig.PLANOGRAMS_COLLECTION_NAME -> "${prefix}_planograms"
            AppConfig.KNOWLEDGE_COLLECTION_NAME -> "${prefix}_product_knowledge"
            AppConfig.TASKS_COLLECTION_NAME -> "${prefix}_tasks"
            // The profile file is named with hyphens and a store suffix.
            AppConfig.PROFILE_COLLECTION_NAME ->
                if (AppConfig.currentStore == StoreLocation.NYC) "nyc-store-01-profile"
                else "aa-store-01-profile"
            // `orders` intentionally has no bundled seed: it is written by the app.
            else -> null
        }
    }

    /** Seeds every collection that is currently empty. */
    fun seedIfNeeded(context: Context, database: Database): List<SeedResult> {
        if (!AppConfig.ENABLE_LOCAL_DATASET_SEEDING) {
            return listOf(SeedResult("all", 0, "local seeding disabled in AppConfig"))
        }
        return AppConfig.allSyncedCollections.mapNotNull { name ->
            val asset = assetName(name) ?: return@mapNotNull null
            try {
                seed(context, database, name, asset)
            } catch (e: Exception) {
                Log.e(TAG, "$name failed", e)
                SeedResult(name, 0, "error: ${e.message}")
            }
        }
    }

    private fun seed(
        context: Context,
        database: Database,
        name: String,
        asset: String
    ): SeedResult {
        val collection = database.getCollection(name, AppConfig.scopeName)
            ?: database.createCollection(name, AppConfig.scopeName)

        if (collection.count > 0L) {
            return SeedResult(name, 0, "already has ${collection.count} documents")
        }

        val json = try {
            context.assets.open("$ASSET_DIR/$asset.json").use {
                it.readBytes().toString(Charsets.UTF_8)
            }
        } catch (e: Exception) {
            return SeedResult(name, 0, "bundled asset '$asset.json' not found")
        }

        val docs = JSONArray(json)
        var inserted = 0
        // One batch keeps ~100 inserts to a single commit, which matters on first launch where
        // this runs before the UI has anything to show.
        database.inBatch<Exception> {
            for (i in 0 until docs.length()) {
                val fields = docs.optJSONObject(i) ?: continue
                val docId = fields.optString("id").takeIf { it.isNotEmpty() } ?: continue
                collection.save(MutableDocument(docId, fields.toPlainMap()))
                inserted++
            }
        }

        Log.i(TAG, "${AppConfig.scopeName}.$name: inserted $inserted documents from $asset.json")
        return SeedResult(name, inserted, null)
    }

    /**
     * Converts `org.json` types into the plain Kotlin maps/lists Couchbase Lite accepts.
     *
     * `MutableDocument(id, Map)` rejects `JSONObject`/`JSONArray` values, and a nested
     * `JSONArray` is exactly what every embedding vector is — so this conversion is what makes
     * the vectors land as Fleece arrays the index can read.
     *
     * Numbers are normalized to Double/Int rather than left as `java.lang.Number`, because the
     * stored vectors must be a numeric array for `APPROX_VECTOR_DISTANCE` to accept them.
     */
    private fun JSONObject.toPlainMap(): Map<String, Any?> {
        val out = HashMap<String, Any?>(length())
        for (key in keys()) {
            out[key] = unwrap(get(key))
        }
        return out
    }

    private fun unwrap(value: Any?): Any? = when (value) {
        null, JSONObject.NULL -> null
        is JSONObject -> value.toPlainMap()
        is JSONArray -> (0 until value.length()).map { unwrap(value.get(it)) }
        // org.json hands back Integer/Long/Double/BigDecimal depending on the literal; keep
        // integers as Int/Long and everything else as Double so Fleece stores a clean number.
        is java.math.BigDecimal -> value.toDouble()
        is java.math.BigInteger -> value.toLong()
        is Float -> value.toDouble()
        else -> value
    }
}
