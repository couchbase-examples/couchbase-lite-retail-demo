import Foundation
import UIKit
import CouchbaseLiteSwift

/// Step 2 planogram audit — the grid model.
///
/// This replaces the earlier named-position approach (`expectedLayout` entries cut as equal
/// vertical bands and matched against *inventory* product images). The dataset moved: each
/// shelf now ships a `Planogram` summary doc carrying a `grid` (rows, cols, cropTop) plus one
/// `PlanogramCell` doc per grid cell, each holding the CLIP embedding of that cell cropped
/// from the golden shelf photo.
///
/// Matching golden-cell-to-photo-cell rather than photo-cell-to-product-catalogue is what makes
/// "this column shifted" detectable at all: the nearest golden cell tells us *which* cell of the
/// ideal layout the camera is looking at, so a product one column to the left reads as misplaced
/// instead of merely "recognised something". The Android counterpart is `PlanogramSearch.kt`;
/// the two implement the same algorithm and thresholds deliberately.

enum CellStatus {
    case correct, empty, misplaced
}

struct PlanogramGrid {
    let rows: Int
    let cols: Int
    /// Fraction of the image height to trim off the top before tiling — the shelf's header
    /// sign, which carries no product and would otherwise skew every cell in row 0.
    let cropTop: Double
}

struct PlanogramCellResult: Identifiable {
    let row: Int
    let col: Int
    let expectedProduct: String
    let matchedProduct: String
    let distance: Double
    let status: CellStatus

    var id: String { "\(row)-\(col)" }
}

/// One column of the grid rolled up into a per-product call, which is the unit an associate
/// acts on — they restock a product, not a cell.
struct ProductVerdict: Identifiable {
    let product: String
    let medianDistance: Double
    let ok: Bool
    let note: String

    var id: String { product }
}

struct PlanogramAuditResult {
    let planogram: Planogram
    let grid: PlanogramGrid
    let cells: [PlanogramCellResult]
    let verdicts: [ProductVerdict]
    let searches: Int
    let capturedImage: UIImage
    let elapsedMilliseconds: Double

    var flaggedCount: Int { verdicts.filter { !$0.ok }.count }
}

/// Nearest golden cell to a photo cell.
private struct NearestCell {
    let product: String
    let row: Int
    let col: Int
    let distance: Double
}

/// Cell distance above which nothing on the shelf resembles the golden — a bare gap.
private let emptyThreshold = 0.18
/// Per-product median above which the whole column is flagged.
private let changeThreshold = 0.12

extension ShelfAuditService {

    // MARK: - Golden metadata

    /// The grid geometry for a shelf, from its `Planogram` summary doc.
    func planogramGrid(shelf: String) -> PlanogramGrid? {
        guard let database = databaseManager.database else { return nil }
        let sql = """
            SELECT grid FROM `\(AppConfig.scopeName)`.`\(AppConfig.planogramsCollectionName)`
            WHERE docType = "Planogram" AND shelf = $shelf LIMIT 1
            """
        do {
            let query = try database.createQuery(sql)
            let params = Parameters()
            params.setValue(shelf, forName: "shelf")
            query.parameters = params
            guard let grid = try query.execute().next()?.dictionary(forKey: "grid") else {
                return nil
            }
            return PlanogramGrid(rows: grid.int(forKey: "rows"),
                                 cols: grid.int(forKey: "cols"),
                                 cropTop: grid.double(forKey: "cropTop"))
        } catch {
            print("❌ [Planogram] grid query failed: \(error)")
            return nil
        }
    }

    /// Which product each column of the golden layout is supposed to hold.
    func expectedByColumn(shelf: String) -> [Int: String] {
        guard let database = databaseManager.database else { return [:] }
        let sql = """
            SELECT `col`, expectedProduct
            FROM `\(AppConfig.scopeName)`.`\(AppConfig.planogramsCollectionName)`
            WHERE docType = "PlanogramCell" AND shelf = $shelf
            """
        var map: [Int: String] = [:]
        do {
            let query = try database.createQuery(sql)
            let params = Parameters()
            params.setValue(shelf, forName: "shelf")
            query.parameters = params
            for row in try query.execute() {
                map[row.int(forKey: "col")] = row.string(forKey: "expectedProduct") ?? ""
            }
        } catch {
            print("❌ [Planogram] expectedByColumn failed: \(error)")
        }
        return map
    }

    // MARK: - Per-cell vector search

    /// Nearest golden cell of this shelf to `vector`.
    ///
    /// Tries the hybrid form first — a `WHERE` on docType and shelf combined with the vector
    /// ordering — and falls back to a plain vector scan filtered in code. The fallback exists
    /// because a predicate applied to the ANN candidate set can eliminate every row, which
    /// would otherwise read as "nothing on this shelf matches" for a perfectly good photo.
    private func nearestGoldenCell(shelf: String, vector: [Float]) -> NearestCell? {
        nearestCell(shelf: shelf, vector: vector, hybrid: true)
            ?? nearestCell(shelf: shelf, vector: vector, hybrid: false)
    }

    private func nearestCell(shelf: String, vector: [Float], hybrid: Bool) -> NearestCell? {
        guard let database = databaseManager.database else { return nil }

        let distanceExpr =
            "APPROX_VECTOR_DISTANCE(embedding.image.vector, $vec, \"cosine\")"
        let whereClause = hybrid
            ? "WHERE docType = \"PlanogramCell\" AND shelf = $shelf"
            : ""
        let limit = hybrid ? 1 : 200
        let sql = """
            SELECT `row`, `col`, shelf, docType, expectedProduct, \(distanceExpr) AS dist
            FROM `\(AppConfig.scopeName)`.`\(AppConfig.planogramsCollectionName)`
            \(whereClause)
            ORDER BY \(distanceExpr)
            LIMIT \(limit)
            """
        do {
            let query = try database.createQuery(sql)
            let params = Parameters()
            params.setValue(vector.map { Double($0) }, forName: "vec")
            if hybrid { params.setValue(shelf, forName: "shelf") }
            query.parameters = params

            for row in try CopilotSearchService.executeWithRetry(query) {
                if !hybrid {
                    guard row.string(forKey: "docType") == "PlanogramCell",
                          row.string(forKey: "shelf") == shelf else { continue }
                }
                return NearestCell(product: row.string(forKey: "expectedProduct") ?? "",
                                   row: row.int(forKey: "row"),
                                   col: row.int(forKey: "col"),
                                   distance: row.double(forKey: "dist"))
            }
            return nil
        } catch {
            print("❌ [Planogram] \(hybrid ? "hybrid" : "scan") query failed: \(error)")
            return nil
        }
    }

    // MARK: - Audit

    /// Tile → embed → per-cell vector search → classify → per-product verdict.
    ///
    /// The tiling has to reproduce exactly the geometry used to build the golden cells, or
    /// cell (r,c) of the photo will not correspond to cell (r,c) of the golden and every
    /// distance becomes meaningless.
    func auditGrid(image: UIImage, planogram: Planogram) async throws -> PlanogramAuditResult {
        guard let grid = planogramGrid(shelf: planogram.shelf) else {
            throw NSError(domain: "ShelfAudit", code: 2, userInfo: [
                NSLocalizedDescriptionKey:
                    "No planogram grid for shelf \(planogram.shelf) yet — the golden cell "
                    + "documents for this shelf have not synced."
            ])
        }

        let expected = expectedByColumn(shelf: planogram.shelf)
        let cellWidth = 1.0 / Double(grid.cols)
        let cellHeight = (1.0 - grid.cropTop) / Double(grid.rows)

        // Bake in orientation before tiling: the crop indexes raw pixels, and a camera or
        // photo-library image would otherwise be sliced along the wrong axis.
        let image = image.normalizedUp()

        let started = DispatchTime.now().uptimeNanoseconds
        var cells: [PlanogramCellResult] = []
        var searches = 0

        for row in 0..<grid.rows {
            for col in 0..<grid.cols {
                let rect = CGRect(x: CGFloat(Double(col) * cellWidth),
                                  y: CGFloat(grid.cropTop + Double(row) * cellHeight),
                                  width: CGFloat(cellWidth),
                                  height: CGFloat(cellHeight))
                guard let crop = image.croppedNormalized(rect) else { continue }
                let vector = try await embedder.embed(crop)
                searches += 1

                let expectedProduct = expected[col] ?? ""
                if let match = nearestGoldenCell(shelf: planogram.shelf, vector: vector) {
                    let status: CellStatus
                    if match.distance > emptyThreshold {
                        status = .empty
                    } else if match.col == col {
                        status = .correct
                    } else {
                        status = .misplaced
                    }
                    cells.append(PlanogramCellResult(row: row, col: col,
                                                     expectedProduct: expectedProduct,
                                                     matchedProduct: match.product,
                                                     distance: match.distance,
                                                     status: status))
                } else {
                    cells.append(PlanogramCellResult(row: row, col: col,
                                                     expectedProduct: expectedProduct,
                                                     matchedProduct: "",
                                                     distance: 1.0,
                                                     status: .empty))
                }
            }
        }

        var verdicts: [ProductVerdict] = []
        for col in 0..<grid.cols {
            let columnCells = cells.filter { $0.col == col }
            guard !columnCells.isEmpty else { continue }
            let sorted = columnCells.map(\.distance).sorted()
            let median = sorted[sorted.count / 2]
            let worst = sorted[sorted.count - 1]
            let emptyCount = columnCells.filter { $0.status == .empty }.count
            let product = expected[col] ?? ""

            if median > changeThreshold {
                // The whole column moved, so this is not a facings problem — either the
                // product is gone or something else is sitting in its slot.
                let note = emptyCount > columnCells.count / 2
                    ? "empty / missing — restock"
                    : "misplaced or wrong product — check"
                verdicts.append(ProductVerdict(product: product, medianDistance: median,
                                               ok: false, note: note))
            } else if worst > emptyThreshold {
                verdicts.append(ProductVerdict(product: product, medianDistance: worst,
                                               ok: false,
                                               note: "reduced facings / gaps — restock"))
            } else {
                verdicts.append(ProductVerdict(product: product, medianDistance: median,
                                               ok: true, note: "correctly stocked"))
            }
        }

        let elapsed = Double(DispatchTime.now().uptimeNanoseconds - started) / 1_000_000

        return PlanogramAuditResult(planogram: planogram, grid: grid, cells: cells,
                                    verdicts: verdicts, searches: searches,
                                    capturedImage: image, elapsedMilliseconds: elapsed)
    }
}
