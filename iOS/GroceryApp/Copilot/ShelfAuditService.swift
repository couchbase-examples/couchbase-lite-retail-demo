import Foundation
import UIKit
import CouchbaseLiteSwift

/// One shelf whose expected layout is known — a `planograms` document.
/// A shelf location carried between copilot steps.
struct ShelfContext: Equatable {
    let aisle: Int
    let shelf: String
}

struct Planogram: Identifiable, Hashable {
    let id: String
    let shelf: String
    let section: String
    let aisle: Int
    let goldenImageURL: String
    let expectedLayout: [Position]

    struct Position: Hashable {
        let position: String
        let productId: Int
        let sku: String
        let facings: Int
    }
}

/// What the audit concluded about one expected shelf position.
struct PositionFinding: Identifiable, Hashable {
    let position: String
    let expectedProductId: Int
    let expectedName: String
    let expectedFacings: Int
    /// Nearest product to what the camera actually saw at this position.
    let foundProductId: Int?
    let foundName: String?
    let distance: Double
    /// Gap to the runner-up. A narrow margin means the visual call was close, which the UI
    /// surfaces rather than hiding — two similar-looking products genuinely are hard to tell
    /// apart from a photograph.
    let margin: Double

    var id: String { position }
    var isCompliant: Bool { foundProductId == expectedProductId }

    var confidence: String {
        if margin > 0.12 { return "high" }
        if margin > 0.05 { return "moderate" }
        return "low"
    }

    /// The line an associate can act on.
    var summary: String {
        guard let foundName else {
            return "\(position): could not identify anything at this position"
        }
        if isCompliant {
            return "\(position): \(expectedName) — as expected"
        }
        return "\(position): expected \(expectedName), found \(foundName)"
    }
}

struct ShelfAuditResult {
    let planogram: Planogram
    let findings: [PositionFinding]
    let capturedImage: UIImage
    let embedMilliseconds: Double
    let searchMilliseconds: Double
    /// Whole-shelf similarity against the golden planogram vector. A useful headline number,
    /// but note what it cannot do: a single global vector says "this shelf differs" without
    /// being able to say which item moved. The per-position findings above are what
    /// actually localise the problem.
    let shelfSimilarityPercent: Int?

    var compliantCount: Int { findings.filter(\.isCompliant).count }
    var violations: [PositionFinding] { findings.filter { !$0.isCompliant } }
    var compliancePercent: Int {
        guard !findings.isEmpty else { return 0 }
        return Int((Double(compliantCount) / Double(findings.count) * 100).rounded())
    }
}

/// Runs the Step 2 visual shelf audit.
///
/// The approach matters here. Embedding the whole shelf photo and comparing it to one golden
/// vector can only ever say "this shelf looks different" — a single global CLIP vector
/// carries no per-position information, and CLIP is documented to overlook exactly the fine
/// spatial detail a planogram check depends on. So instead each expected position is cropped
/// out of the photo, embedded separately, and matched against the product-image vectors on
/// the inventory documents via `APPROX_VECTOR_DISTANCE`. That is what makes
/// "expected Chocolate Recovery Shake at C3-L, found Vanilla Whey Protein Shake" possible
/// at all.
@MainActor
final class ShelfAuditService: ObservableObject {

    @Published private(set) var planograms: [Planogram] = []

    // Not private: the grid audit lives in PlanogramAudit.swift as an extension, and a
    // cross-file extension cannot see private storage.
    let databaseManager: DatabaseManager
    let embedder = ImageEmbedder.shared
    private static let metricArgument = "\"cosine\""

    init(databaseManager: DatabaseManager) {
        self.databaseManager = databaseManager
    }

    /// Loads the audited shelves for this store.
    func loadPlanograms() {
        guard let database = databaseManager.database else { return }
        let sql = """
            SELECT META().id AS id, shelf, section, aisle, goldenImageURL, expectedLayout
            FROM `\(AppConfig.scopeName)`.`\(AppConfig.planogramsCollectionName)`
            WHERE docType = "Planogram"
            ORDER BY aisle, shelf
            """
        do {
            var loaded: [Planogram] = []
            for row in try database.createQuery(sql).execute() {
                guard let id = row.string(forKey: "id"),
                      let shelf = row.string(forKey: "shelf") else { continue }

                var layout: [Planogram.Position] = []
                if let entries = row.array(forKey: "expectedLayout") {
                    for i in 0..<entries.count {
                        guard let e = entries.dictionary(at: i) else { continue }
                        layout.append(Planogram.Position(
                            position: e.string(forKey: "position") ?? "?",
                            productId: e.int(forKey: "productId"),
                            sku: e.string(forKey: "sku") ?? "",
                            facings: e.int(forKey: "facings")
                        ))
                    }
                }

                loaded.append(Planogram(
                    id: id,
                    shelf: shelf,
                    section: row.string(forKey: "section") ?? "",
                    aisle: row.int(forKey: "aisle"),
                    goldenImageURL: row.string(forKey: "goldenImageURL") ?? "",
                    expectedLayout: layout
                ))
            }
            // Every shelf stays available — the app does not hide categories. Ordering just
            // puts the demo's grocery shelf first so the audit opens on it, rather than
            // relying on aisle numbers happening to sort that way.
            let suppressed = AppConfig.hiddenCategories
            let available = loaded.filter { !suppressed.contains($0.section) }
            if AppConfig.footwearNarrativeEnabled {
                planograms = available
            } else {
                planograms = available.filter { $0.section != "Footwear" }
                    + available.filter { $0.section == "Footwear" }
            }
        } catch {
            print("❌ [ShelfAudit] failed to load planograms: \(error)")
        }
    }

    /// Audits `image` against `planogram`.
    ///
    /// Each expected position becomes an equal-width vertical band of the photo. That
    /// assumes the associate framed the whole shelf, which is what the capture UI asks for;
    /// a real deployment would want detected shelf edges instead of a fixed split, and the
    /// findings' `margin` is what exposes when the assumption did not hold.
    func audit(image: UIImage, against planogram: Planogram) async throws -> ShelfAuditResult {
        guard !planogram.expectedLayout.isEmpty else {
            throw NSError(domain: "ShelfAudit", code: 1, userInfo: [
                NSLocalizedDescriptionKey: "This planogram has no expected layout to check."
            ])
        }

        let slots = planogram.expectedLayout.count
        var findings: [PositionFinding] = []
        var totalEmbed = 0.0
        var totalSearch = 0.0

        for (index, expected) in planogram.expectedLayout.enumerated() {
            let band = CGRect(x: CGFloat(index) / CGFloat(slots), y: 0,
                              width: 1.0 / CGFloat(slots), height: 1.0)
            guard let crop = image.croppedNormalized(band) else { continue }

            let vector = try await embedder.embed(crop)
            totalEmbed += await embedder.lastEmbedMilliseconds

            let started = DispatchTime.now().uptimeNanoseconds
            let matches = try nearestProducts(to: vector, section: planogram.section, limit: 2)
            totalSearch += Double(DispatchTime.now().uptimeNanoseconds - started) / 1_000_000

            let best = matches.first
            let margin = matches.count > 1 ? matches[1].distance - matches[0].distance : 1.0

            findings.append(PositionFinding(
                position: expected.position,
                expectedProductId: expected.productId,
                expectedName: productName(for: expected.productId) ?? expected.sku,
                expectedFacings: expected.facings,
                foundProductId: best?.productId,
                foundName: best?.name,
                distance: best?.distance ?? .nan,
                margin: margin
            ))
        }

        // Whole-shelf comparison, for the headline number only.
        var shelfSimilarity: Int?
        if let goldenVector = goldenVector(for: planogram.id) {
            let whole = try await embedder.embed(image)
            let dot = zip(whole, goldenVector).reduce(0) { $0 + $1.0 * $1.1 }
            shelfSimilarity = Int((Double(max(-1, min(1, dot))) * 100).rounded())
        }

        return ShelfAuditResult(
            planogram: planogram,
            findings: findings,
            capturedImage: image,
            embedMilliseconds: totalEmbed,
            searchMilliseconds: totalSearch,
            shelfSimilarityPercent: shelfSimilarity
        )
    }

    // MARK: - Vector queries

    private struct ProductMatch {
        let productId: Int
        let name: String
        let distance: Double
    }

    /// Nearest inventory products by product-image vector, scoped to the shelf's section so
    /// a sports-nutrition crop is never matched against a household cleaning product.
    private func nearestProducts(to vector: [Float], section: String,
                                 limit: Int) throws -> [ProductMatch] {
        guard let database = databaseManager.database else { return [] }

        let distanceExpr =
            "APPROX_VECTOR_DISTANCE(embedding.image.vector, $queryVector, \(Self.metricArgument))"
        let sql = """
            SELECT productId, name, \(distanceExpr) AS distance
            FROM `\(AppConfig.scopeName)`.`\(AppConfig.collectionName)`
            WHERE \(distanceExpr) IS VALUED
              AND location.section = $section
            ORDER BY distance
            LIMIT \(limit)
            """

        let query = try database.createQuery(sql)
        let params = Parameters()
        params.setValue(vector.map { Double($0) }, forName: "queryVector")
        params.setValue(section, forName: "section")
        query.parameters = params

        var matches = try CopilotSearchService.executeWithRetry(query).map {
            ProductMatch(productId: $0.int(forKey: "productId"),
                         name: $0.string(forKey: "name") ?? "?",
                         distance: $0.double(forKey: "distance"))
        }

        // A section filter applied to the ANN candidate set can eliminate everything, so
        // retry unscoped rather than reporting "nothing recognised" for a valid photo.
        if matches.isEmpty {
            let fallbackSQL = """
                SELECT productId, name, \(distanceExpr) AS distance
                FROM `\(AppConfig.scopeName)`.`\(AppConfig.collectionName)`
                WHERE \(distanceExpr) IS VALUED
                ORDER BY distance
                LIMIT \(limit)
                """
            let fallback = try database.createQuery(fallbackSQL)
            let p = Parameters()
            p.setValue(vector.map { Double($0) }, forName: "queryVector")
            fallback.parameters = p
            matches = try CopilotSearchService.executeWithRetry(fallback).map {
                ProductMatch(productId: $0.int(forKey: "productId"),
                             name: $0.string(forKey: "name") ?? "?",
                             distance: $0.double(forKey: "distance"))
            }
        }
        return matches
    }

    private func productName(for productId: Int) -> String? {
        guard let database = databaseManager.database else { return nil }
        let sql = """
            SELECT name FROM `\(AppConfig.scopeName)`.`\(AppConfig.collectionName)`
            WHERE productId = $pid LIMIT 1
            """
        guard let query = try? database.createQuery(sql) else { return nil }
        let params = Parameters()
        params.setValue(productId, forName: "pid")
        query.parameters = params
        return (try? query.execute())?.compactMap { $0.string(forKey: "name") }.first
    }

    private func goldenVector(for planogramId: String) -> [Float]? {
        guard let database = databaseManager.database,
              let collection = try? database.collection(name: AppConfig.planogramsCollectionName,
                                                        scope: AppConfig.scopeName),
              let doc = try? collection.document(id: planogramId),
              let image = doc.dictionary(forKey: "embedding")?.dictionary(forKey: "image"),
              let array = image.array(forKey: "vector") else { return nil }
        return (0..<array.count).map { Float(array.double(at: $0)) }
    }

    /// The bundled golden / messy shelf renders, offered as capture stand-ins.
    ///
    /// The dataset's real shelf photos do not exist yet — every `goldenImageURL` in the
    /// shipped data returns 403 — and the Simulator has no camera, so these are what make
    /// the audit demonstrable today. They are renders, not photographs, and the UI says so.
    /// Loads a bundled sample shelf view, named `nyc_aisle30_A2_golden` — aisle-qualified,
    /// because shelf letters repeat across aisles and the old `nyc_A2_golden` was ambiguous.
    ///
    /// The short form is deliberately *not* accepted as a fallback any more. The renders left
    /// over from before the rename predate the grid dataset, so matching one against a shelf's
    /// current golden cell vectors produces confident-looking nonsense rather than an obvious
    /// failure. Returning nil instead surfaces the honest "no imagery for this shelf yet".
    static func bundledShelfImage(store: String, aisle: Int, shelf: String,
                                  variant: String) -> UIImage? {
        let name = "\(store)_aisle\(aisle)_\(shelf)_\(variant)"
        guard let url = Bundle.main.url(forResource: name, withExtension: "png"),
              let data = try? Data(contentsOf: url) else { return nil }
        return UIImage(data: data)
    }
}
