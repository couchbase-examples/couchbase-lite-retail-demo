package com.example.groceryapplication.copilot

import android.graphics.Bitmap
import android.util.Log
import com.couchbase.lite.Parameters
import com.example.groceryapplication.AppConfig
import com.example.groceryapplication.DatabaseManager

/**
 * Step 2, Case 1 on Android — identify a product from a camera frame and report where it belongs.
 *
 * Kotlin counterpart of iOS `ProductScanService`. Deliberately a much weaker problem than the
 * planogram audit: that has to reconstruct spatial layout, so it needs the golden's fixed
 * framing. Recognising a single item has no spatial constraint — one frame, one CLIP embedding,
 * nearest neighbour over the inventory image vectors — which is why the camera is honest here
 * and not on the audit screen.
 */

data class ScanMatch(
    val productId: Int,
    val name: String,
    val brand: String?,
    val price: Double,
    val quantity: Int,
    val aisle: Int,
    val shelf: String?,
    val bin: Int,
    val section: String?,
    val imageUrl: String?,
    val distance: Double
) {
    /** Cosine distance as a similarity percentage — a number the associate can judge. */
    val similarityPercent: Int get() = ((1 - distance) * 100).toInt()

    /** Non-null only when the product names a shelf, which is what gates the audit hand-off. */
    val shelfContext: ShelfContext? get() = shelf?.let { ShelfContext(aisle, it) }

    val locationLabel: String
        get() = buildString {
            append("Aisle $aisle")
            shelf?.let { append(" shelf $it") }
            if (bin > 0) append(" bin $bin")
            section?.let { append(" · $it") }
        }
}

/**
 * Above this cosine distance we report "no confident match" instead of naming the nearest row.
 * Catalogue images are clean renders and a camera frame has clutter, angle and occlusion, so the
 * nearest neighbour is always *something*; the threshold is what stops that being presented as a
 * confident identification.
 */
const val SCAN_NO_MATCH_THRESHOLD = 0.32

/** True when any inventory document carries an image vector to search against. */
fun DatabaseManager.hasProductImageVectors(): Boolean {
    val db = getDatabase() ?: return false
    val sql = """
        SELECT COUNT(*) AS n FROM `${AppConfig.scopeName}`.`${AppConfig.COLLECTION_NAME}`
        WHERE embedding.image.vector IS VALUED
    """.trimIndent()
    return try {
        (db.createQuery(sql).execute().firstOrNull()?.getInt("n") ?: 0) > 0
    } catch (e: Exception) {
        Log.e("ProductScan", "❌ image vector count failed", e); false
    }
}

/** CLIP-embed [image] on-device and return the closest catalogue products. */
fun DatabaseManager.identifyProduct(image: Bitmap, limit: Int = 3): List<ScanMatch> {
    val db = getDatabase() ?: return emptyList()
    val vector = ClipImageEmbedder.embed(image) ?: return emptyList()
    val sql = """
        SELECT productId, name, brand, price, stockQty, location, imageURL,
               APPROX_VECTOR_DISTANCE(embedding.image.vector, ${'$'}vec, "COSINE") AS distance
        FROM `${AppConfig.scopeName}`.`${AppConfig.COLLECTION_NAME}`
        WHERE APPROX_VECTOR_DISTANCE(embedding.image.vector, ${'$'}vec, "COSINE") IS VALUED
        ORDER BY distance
        LIMIT $limit
    """.trimIndent()
    return try {
        val q = db.createQuery(sql)
        q.parameters = Parameters().setValue("vec", vector.toList())
        q.execute().map { r ->
            val loc = r.getDictionary("location")
            ScanMatch(
                productId = r.getInt("productId"),
                name = r.getString("name") ?: "?",
                brand = r.getString("brand"),
                price = r.getDouble("price"),
                quantity = r.getInt("stockQty"),
                aisle = loc?.getInt("aisle") ?: 0,
                shelf = loc?.getString("shelf"),
                bin = loc?.getInt("bin") ?: 0,
                section = loc?.getString("section"),
                imageUrl = r.getString("imageURL"),
                distance = r.getDouble("distance")
            )
        }
    } catch (e: Exception) {
        Log.e("ProductScan", "❌ scan query failed", e); emptyList()
    }
}
