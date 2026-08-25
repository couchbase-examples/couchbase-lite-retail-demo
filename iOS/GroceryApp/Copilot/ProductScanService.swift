import Foundation
import UIKit
import CouchbaseLiteSwift

/// One product matched from a camera frame.
struct ScanMatch: Identifiable {
    let productId: Int
    let name: String
    let brand: String?
    let price: Double
    let quantity: Int
    let location: GroceryItem.Location?
    let imageURL: String?
    let distance: Double

    var id: Int { productId }

    /// Cosine distance read as a similarity percentage, for a number the associate can judge.
    var similarityPercent: Int { Int(((1 - distance) * 100).rounded()) }

    /// Where to walk to. Nil when the product carries no shelf, which is what gates the
    /// hand-off into the planogram audit.
    var shelfContext: ShelfContext? {
        guard let location, let shelf = location.shelf else { return nil }
        return ShelfContext(aisle: location.aisle, shelf: shelf)
    }
}

/// Step 2, Case 1 — identify a product from a camera frame and say where it belongs.
///
/// The counterpart to the planogram audit, and deliberately a much weaker problem: the audit
/// has to reconstruct *spatial layout*, which is why an arbitrary handheld photo cannot be used
/// there. Recognising a single item carries no spatial constraint at all — one frame, one
/// embedding, nearest neighbour over the product-image vectors — which is exactly what CLIP is
/// good at, and why the camera is honest here when it is not honest on the audit screen.
@MainActor
final class ProductScanService: ObservableObject {

    private let databaseManager: DatabaseManager
    private let embedder = ImageEmbedder.shared

    /// Above this cosine distance we say "no confident match" rather than naming the nearest
    /// row. Catalogue images are clean renders and a camera frame has clutter, angle and
    /// occlusion, so the nearest neighbour is *always* something — the threshold is what stops
    /// that from being reported as a confident identification.
    static let noMatchThreshold = 0.32

    private(set) var lastEmbedMilliseconds: Double = 0
    private(set) var lastSearchMilliseconds: Double = 0

    init(databaseManager: DatabaseManager) {
        self.databaseManager = databaseManager
    }

    /// Embeds `image` on-device and returns the closest catalogue products.
    func identify(image: UIImage, limit: Int = 3) async throws -> [ScanMatch] {
        let vector = try await embedder.embed(image.normalizedUp())
        lastEmbedMilliseconds = await embedder.lastEmbedMilliseconds

        let started = DispatchTime.now().uptimeNanoseconds
        let matches = try nearest(to: vector, limit: limit)
        lastSearchMilliseconds =
            Double(DispatchTime.now().uptimeNanoseconds - started) / 1_000_000
        return matches
    }

    private func nearest(to vector: [Float], limit: Int) throws -> [ScanMatch] {
        guard let database = databaseManager.database else { return [] }

        let distanceExpr =
            "APPROX_VECTOR_DISTANCE(embedding.image.vector, $vec, \"cosine\")"
        let sql = """
            SELECT productId, name, brand, price, stockQty, location, imageURL,
                   \(distanceExpr) AS distance
            FROM `\(AppConfig.scopeName)`.`\(AppConfig.collectionName)`
            WHERE \(distanceExpr) IS VALUED
            ORDER BY distance
            LIMIT \(limit)
            """
        let query = try database.createQuery(sql)
        let params = Parameters()
        params.setValue(vector.map { Double($0) }, forName: "vec")
        query.parameters = params

        return try CopilotSearchService.executeWithRetry(query).map { row in
            var location: GroceryItem.Location?
            if let dict = row.dictionary(forKey: "location") {
                location = GroceryItem.Location(
                    aisle: dict.int(forKey: "aisle"),
                    bin: dict.int(forKey: "bin"),
                    shelf: dict.string(forKey: "shelf"),
                    section: dict.string(forKey: "section")
                )
            }
            return ScanMatch(
                productId: row.int(forKey: "productId"),
                name: row.string(forKey: "name") ?? "?",
                brand: row.string(forKey: "brand"),
                price: row.double(forKey: "price"),
                quantity: row.int(forKey: "stockQty"),
                location: location,
                imageURL: row.string(forKey: "imageURL"),
                distance: row.double(forKey: "distance")
            )
        }
    }

    /// Whether any product image vectors exist to search against.
    ///
    /// Worth checking explicitly: the shipped inventory documents carry only `embedding.text`,
    /// so on a dataset without the image pass this screen would return nothing and look broken
    /// rather than unconfigured.
    func hasImageVectors() -> Bool {
        guard let database = databaseManager.database else { return false }
        let sql = """
            SELECT COUNT(*) AS n
            FROM `\(AppConfig.scopeName)`.`\(AppConfig.collectionName)`
            WHERE embedding.image.vector IS VALUED
            """
        guard let query = try? database.createQuery(sql),
              let row = try? query.execute().next() else { return false }
        return row.int(forKey: "n") > 0
    }
}
