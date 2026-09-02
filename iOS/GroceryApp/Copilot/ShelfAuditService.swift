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
    /// Whether this shelf has a `grid` — i.e. whether it can actually be audited.
    ///
    /// The shipped data has gone through two shapes: the older one carried only
    /// `expectedLayout`, the current one adds `grid` plus per-cell documents. A shelf from the
    /// older shape still has a name and a golden image, so it looks selectable while failing
    /// the moment you audit it. Listing it was the bug behind "no planogram grid for shelf C3".
    let isAuditable: Bool

    struct Position: Hashable {
        let position: String
        let productId: Int
        let sku: String
        let facings: Int
    }
}

/// Loads the shelves available to audit, and stages the bundled sample views.
///
/// The audit itself lives in `PlanogramAudit.swift` as an extension on this type: the photo is
/// tiled into the golden's grid and each cell matched against that shelf's golden
/// `PlanogramCell` vectors. A single whole-shelf vector could only ever say "this looks
/// different" — matching cell to golden cell is what localises *which* product moved.
@MainActor
final class ShelfAuditService: ObservableObject {

    @Published private(set) var planograms: [Planogram] = []
    /// Shelves present in the collection but not auditable, so the UI can say why the list is
    /// shorter than the store's real shelf count instead of looking broken.
    @Published private(set) var unauditableCount = 0

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
            SELECT META().id AS id, shelf, section, aisle, goldenImageURL, expectedLayout, grid
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

                // `grid.rows` rather than just `grid`: a present-but-empty dictionary is as
                // unusable as a missing one, and the audit needs both dimensions.
                let grid = row.dictionary(forKey: "grid")
                let auditable = (grid?.int(forKey: "rows") ?? 0) > 0
                    && (grid?.int(forKey: "cols") ?? 0) > 0

                loaded.append(Planogram(
                    id: id,
                    shelf: shelf,
                    section: row.string(forKey: "section") ?? "",
                    aisle: row.int(forKey: "aisle"),
                    goldenImageURL: row.string(forKey: "goldenImageURL") ?? "",
                    expectedLayout: layout,
                    isAuditable: auditable
                ))
            }
            // Every shelf stays available — the app does not hide categories. Ordering just
            // puts the demo's grocery shelf first so the audit opens on it, rather than
            // relying on aisle numbers happening to sort that way.
            let suppressed = AppConfig.hiddenCategories
            let available = loaded.filter { !suppressed.contains($0.section) }
            // Every shelf stays listed, including ones whose golden cells have not synced.
            // Hiding them made the picker disagree with the store the associate is standing in,
            // and made a Find hand-off look broken. `isAuditable` gates the audit action
            // instead, which is the only thing that actually depends on the grid.
            unauditableCount = available.filter { !$0.isAuditable }.count
            // Loud on purpose: "cannot be audited" is a data condition, and the only way to
            // tell a stale sync from a code fault is to see what actually landed on the device.
            let blocked = available.filter { !$0.isAuditable }
                .map { "\($0.aisle)/\($0.shelf)" }
            print("🧭 [ShelfAudit] store=\(AppConfig.currentStore.rawValue) "
                  + "scope=\(AppConfig.scopeName) planograms=\(loaded.count) "
                  + "auditable=\(available.count - blocked.count) "
                  + "blocked=\(blocked.count) \(blocked.sorted())")
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
