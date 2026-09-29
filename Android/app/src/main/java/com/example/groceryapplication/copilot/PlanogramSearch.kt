package com.example.groceryapplication.copilot

import com.example.groceryapplication.AppConfig
import com.example.groceryapplication.DatabaseManager

import android.graphics.Bitmap
import android.util.Log
import com.couchbase.lite.Parameters

/**
 * Step 2 planogram audit on Android — Kotlin counterpart of the iOS
 * DatabaseManager+Planogram extension. Tiles a shelf photo into the golden's
 * grid, CLIP-embeds each cell (ClipImageEmbedder), and runs Couchbase Lite
 * APPROX_VECTOR_DISTANCE (COSINE) against that shelf's golden PlanogramCell docs
 * to reconstruct the layout and flag discrepancies (missing / misplaced).
 */

enum class CellStatus { CORRECT, EMPTY, MISPLACED }

data class PlanogramGrid(val rows: Int, val cols: Int, val cropTop: Double)

data class PlanogramCellResult(
    val row: Int, val col: Int,
    val expectedProduct: String, val matchedProduct: String,
    val distance: Double, val status: CellStatus
)

data class ProductVerdict(
    val product: String, val medianDistance: Double, val ok: Boolean, val note: String
)

data class PlanogramAuditResult(
    val grid: PlanogramGrid,
    val cells: List<PlanogramCellResult>,
    val verdicts: List<ProductVerdict>,
    val searches: Int
)

/** A shelf the user can audit, with its aisle for display. Shelf codes are unique, so
 *  `shelf` alone keys the queries; `aisle` is shown in the picker for clarity. */
data class ShelfRef(
    val aisle: Int,
    val shelf: String,
    val auditable: Boolean = true,
    /** Zone label shown under the picker, matching the iOS subtitle. */
    val section: String = ""
) {
    val label: String get() = "Aisle $aisle · $shelf"
}

/** A shelf location carried between copilot steps — Find (Step 1) into the audit (Step 2). */
data class ShelfContext(val aisle: Int, val shelf: String)

private const val EMPTY_THRESHOLD = 0.18   // cell distance above which nothing matches → empty/missing
private const val CHANGE_THRESHOLD = 0.12  // per-product median above which it's flagged

/**
 * Make sure the planogram image index exists before an audit runs.
 *
 * Delegates to [VectorIndexManager] rather than creating an index here. This used to build its
 * own `idx_planogram_cells` over `embedding.image.vector` on `planograms`, which is the exact
 * expression and collection `idx_planogram_image` already covers, so the app was paying to build
 * and store two identical indexes. iOS only ever had the one.
 *
 * VectorIndexManager is also the only place that gets the centroid count right: it derives it
 * from the actual vector count so the index can train, where the version here hardcoded 8.
 */
fun DatabaseManager.ensurePlanogramCellIndex() {
    val db = getDatabase() ?: return
    VectorIndexManager.ensureIndex(VectorIndexManager.planogramImageIndex, db)
}

/** Shelves that have a synced Planogram summary doc (for the picker). */
fun DatabaseManager.planogramShelves(): List<ShelfRef> {
    val db = getDatabase() ?: return emptyList()
    val sql = """
        SELECT DISTINCT aisle, shelf, grid, section FROM `${AppConfig.scopeName}`.`${AppConfig.PLANOGRAMS_COLLECTION_NAME}`
        WHERE docType = "Planogram" AND shelf IS NOT MISSING ORDER BY aisle, shelf
    """.trimIndent()
    return try {
        db.createQuery(sql).execute().mapNotNull { r ->
            // Every shelf stays listed; `auditable` gates the audit action. Hiding grid-less
            // shelves made the picker disagree with the store the associate is standing in.
            val grid = r.getDictionary("grid")
            val auditable = (grid?.getInt("rows") ?: 0) > 0 && (grid?.getInt("cols") ?: 0) > 0
            r.getString("shelf")?.let {
                ShelfRef(r.getInt("aisle"), it, auditable, r.getString("section") ?: "")
            }
        }
    } catch (e: Exception) {
        Log.e("PlanogramSearch", "❌ shelves query failed", e); emptyList()
    }
}

private fun DatabaseManager.planogramGrid(shelf: String): PlanogramGrid? {
    val db = getDatabase() ?: return null
    val sql = """
        SELECT grid FROM `${AppConfig.scopeName}`.`${AppConfig.PLANOGRAMS_COLLECTION_NAME}`
        WHERE docType = "Planogram" AND shelf = ${'$'}shelf
          AND grid.rows IS VALUED AND grid.cols IS VALUED
        LIMIT 1
    """.trimIndent()
    return try {
        val q = db.createQuery(sql)
        q.parameters = Parameters().setString("shelf", shelf)
        q.execute().firstOrNull()?.getDictionary("grid")?.let { g ->
            PlanogramGrid(g.getInt("rows"), g.getInt("cols"), g.getDouble("cropTop"))
        }
    } catch (e: Exception) {
        Log.e("PlanogramSearch", "❌ grid query failed", e); null
    }
}

/** Golden reference image URL for a shelf's Planogram summary doc, if synced. */
fun DatabaseManager.planogramGoldenUrl(shelf: String): String? {
    val db = getDatabase() ?: return null
    val sql = """
        SELECT goldenImageURL FROM `${AppConfig.scopeName}`.`${AppConfig.PLANOGRAMS_COLLECTION_NAME}`
        WHERE docType = "Planogram" AND shelf = ${'$'}shelf LIMIT 1
    """.trimIndent()
    return try {
        val q = db.createQuery(sql)
        q.parameters = Parameters().setString("shelf", shelf)
        q.execute().firstOrNull()?.getString("goldenImageURL")
    } catch (e: Exception) {
        Log.e("PlanogramSearch", "❌ golden url query failed", e); null
    }
}

private fun DatabaseManager.expectedByCol(shelf: String): Map<Int, String> {
    val db = getDatabase() ?: return emptyMap()
    val sql = """
        SELECT `col`, expectedProduct FROM `${AppConfig.scopeName}`.`${AppConfig.PLANOGRAMS_COLLECTION_NAME}`
        WHERE docType = "PlanogramCell" AND shelf = ${'$'}shelf
    """.trimIndent()
    val map = HashMap<Int, String>()
    try {
        val q = db.createQuery(sql)
        q.parameters = Parameters().setString("shelf", shelf)
        q.execute().forEach { r -> map[r.getInt("col")] = r.getString("expectedProduct") ?: "" }
    } catch (e: Exception) {
        Log.e("PlanogramSearch", "❌ expectedByCol failed", e)
    }
    return map
}

data class NearestCell(val product: String, val row: Int, val col: Int, val dist: Double)

/**
 * Vector-search this shelf's golden cells for the nearest to `vector`.
 * Tries a hybrid query (WHERE + vector) first; if it yields no rows, falls back to a
 * pure vector scan and filters to this shelf's cells in code. Both use APPROX_VECTOR_DISTANCE.
 */
fun DatabaseManager.nearestGoldenCell(shelf: String, vector: FloatArray): NearestCell? =
    nearestCell(shelf, vector, hybrid = true) ?: nearestCell(shelf, vector, hybrid = false)

private fun DatabaseManager.nearestCell(shelf: String, vector: FloatArray, hybrid: Boolean): NearestCell? {
    val db = getDatabase() ?: return null
    val whereClause = if (hybrid) "WHERE docType = \"PlanogramCell\" AND shelf = ${'$'}shelf" else ""
    val limit = if (hybrid) 1 else 200
    val sql = """
        SELECT `row`, `col`, shelf, docType, expectedProduct,
               APPROX_VECTOR_DISTANCE(embedding.image.vector, ${'$'}vec, "COSINE") AS dist
        FROM `${AppConfig.scopeName}`.`${AppConfig.PLANOGRAMS_COLLECTION_NAME}`
        $whereClause
        ORDER BY APPROX_VECTOR_DISTANCE(embedding.image.vector, ${'$'}vec, "COSINE")
        LIMIT $limit
    """.trimIndent()
    return try {
        val q = db.createQuery(sql)
        q.parameters = Parameters().setValue("vec", vector.toList()).apply { if (hybrid) setString("shelf", shelf) }
        val rows = q.execute().allResults()
        if (rows.isEmpty()) return null
        for (r in rows) {
            if (!hybrid && (r.getString("docType") != "PlanogramCell" || r.getString("shelf") != shelf)) continue
            return NearestCell(r.getString("expectedProduct") ?: "", r.getInt("row"), r.getInt("col"), r.getDouble("dist"))
        }
        null
    } catch (e: Exception) {
        Log.e("PlanogramSearch", "❌ ${if (hybrid) "hybrid" else "scan"} query failed", e); null
    }
}

/** Full Step 2 audit: tile → embed → per-cell vector search → classify → per-product verdict. */
fun DatabaseManager.auditShelf(shelf: String, image: Bitmap): PlanogramAuditResult? {
    ensurePlanogramCellIndex()
    val grid = planogramGrid(shelf) ?: return null
    val expected = expectedByCol(shelf)
    val cw = 1.0 / grid.cols
    val ch = (1.0 - grid.cropTop) / grid.rows

    val cells = ArrayList<PlanogramCellResult>()
    var searches = 0
    for (row in 0 until grid.rows) {
        for (col in 0 until grid.cols) {
            val cellBmp = ClipImageEmbedder.crop(
                image, (col * cw).toFloat(), (grid.cropTop + row * ch).toFloat(), cw.toFloat(), ch.toFloat()
            )
            val vec = ClipImageEmbedder.embed(cellBmp) ?: continue
            searches++
            val exp = expected[col] ?: ""
            val m = nearestGoldenCell(shelf, vec)
            if (m != null) {
                val status = when {
                    m.dist > EMPTY_THRESHOLD -> CellStatus.EMPTY
                    m.col == col -> CellStatus.CORRECT
                    else -> CellStatus.MISPLACED
                }
                cells.add(PlanogramCellResult(row, col, exp, m.product, m.dist, status))
            } else {
                cells.add(PlanogramCellResult(row, col, exp, "", 1.0, CellStatus.EMPTY))
            }
        }
    }

    val verdicts = ArrayList<ProductVerdict>()
    for (col in 0 until grid.cols) {
        val colCells = cells.filter { it.col == col }
        if (colCells.isEmpty()) continue
        val dists = colCells.map { it.distance }.sorted()
        val median = dists[dists.size / 2]
        val maxDist = dists.last()
        val emptyCount = colCells.count { it.status == CellStatus.EMPTY }
        val exp = expected[col] ?: ""
        when {
            median > CHANGE_THRESHOLD -> {
                // Whole column shifted → product missing or wrong one there.
                val note = if (emptyCount > colCells.size / 2) "empty / missing — restock"
                           else "misplaced or wrong product — check"
                verdicts.add(ProductVerdict(exp, median, false, note))
            }
            // Product still present but one or more facings are gone → short-facing / gaps.
            maxDist > EMPTY_THRESHOLD ->
                verdicts.add(ProductVerdict(exp, maxDist, false, "reduced facings / gaps — restock"))
            else ->
                verdicts.add(ProductVerdict(exp, median, true, "correctly stocked"))
        }
    }
    return PlanogramAuditResult(grid, cells, verdicts, searches)
}
