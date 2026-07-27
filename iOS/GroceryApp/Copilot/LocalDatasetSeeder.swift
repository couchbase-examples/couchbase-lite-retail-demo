import Foundation
import CouchbaseLiteSwift

/// Seeds the bundled extended dataset into the local database when a collection is empty.
///
/// Why this exists: the extended dataset — descriptions, search tags, shelf/section,
/// real MiniLM vectors, the Footwear category, planograms, knowledge chunks and tasks —
/// is not in Capella yet, and the whole point of this app is that a developer can pick it
/// up and see edge vector search working. Requiring a provisioned Capella cluster before
/// the copilot does anything would defeat that.
///
/// It is deliberately conservative:
///  * only seeds a collection that is **empty**, so it can never overwrite synced data;
///  * uses the dataset's own `id` as the document ID, so when App Services does come
///    online the same documents replicate over these as ordinary updates rather than
///    creating duplicates;
///  * writes `stockQty` as a plain integer and leaves the CRDT quantity counter alone, so
///    the existing increment/decrement flow initialises exactly as it does for synced docs.
enum LocalDatasetSeeder {

    /// Maps a collection to the bundled file for the currently selected store.
    private static func resourceName(for collection: String) -> String? {
        let prefix = AppConfig.currentStore == .nyc ? "nyc_store" : "aa_store"
        switch collection {
        case AppConfig.collectionName:          return "\(prefix)_inventory"
        case AppConfig.planogramsCollectionName: return "\(prefix)_planograms"
        case AppConfig.knowledgeCollectionName:  return "\(prefix)_product_knowledge"
        case AppConfig.tasksCollectionName:      return "\(prefix)_tasks"
        case AppConfig.profileCollectionName:
            // The profile file is named with a hyphen and a store suffix.
            return AppConfig.currentStore == .nyc ? "nyc-store-01-profile" : "aa-store-01-profile"
        default:
            return nil
        }
    }

    struct SeedResult {
        let collection: String
        let inserted: Int
        let skippedReason: String?
    }

    /// Seeds every collection that is currently empty. Returns one result per collection.
    @discardableResult
    static func seedIfNeeded(into database: Database) -> [SeedResult] {
        guard AppConfig.enableLocalDatasetSeeding else {
            return [SeedResult(collection: "all", inserted: 0,
                               skippedReason: "local seeding disabled in AppConfig")]
        }

        var results: [SeedResult] = []
        for name in AppConfig.allSyncedCollections {
            // `orders` intentionally has no bundled seed: it is written by the app.
            guard let resource = resourceName(for: name) else { continue }
            do {
                results.append(try seed(collection: name, from: resource, into: database))
            } catch {
                print("❌ [Seeder] \(name): \(error)")
                results.append(SeedResult(collection: name, inserted: 0,
                                          skippedReason: "error: \(error.localizedDescription)"))
            }
        }
        return results
    }

    private static func seed(collection name: String, from resource: String,
                             into database: Database) throws -> SeedResult {
        let collection = try database.collection(name: name, scope: AppConfig.scopeName)
            ?? database.createCollection(name: name, scope: AppConfig.scopeName)

        guard collection.count == 0 else {
            return SeedResult(collection: name, inserted: 0,
                              skippedReason: "already has \(collection.count) documents")
        }

        guard let url = Bundle.main.url(forResource: resource, withExtension: "json",
                                        subdirectory: "DemoDataset")
                ?? Bundle.main.url(forResource: resource, withExtension: "json") else {
            return SeedResult(collection: name, inserted: 0,
                              skippedReason: "bundled resource '\(resource).json' not found")
        }

        let data = try Data(contentsOf: url)
        guard let docs = try JSONSerialization.jsonObject(with: data) as? [[String: Any]] else {
            return SeedResult(collection: name, inserted: 0,
                              skippedReason: "'\(resource).json' is not an array of objects")
        }

        var inserted = 0
        // One batch keeps 104 inserts to a single commit, which matters on the very first
        // launch where this runs before the UI has anything to show.
        try database.inBatch {
            for fields in docs {
                guard let docId = fields["id"] as? String else { continue }
                let doc = MutableDocument(id: docId, data: fields)
                try collection.save(document: doc)
                inserted += 1
            }
        }

        print("🌱 [Seeder] \(AppConfig.scopeName).\(name): inserted \(inserted) documents from \(resource).json")
        return SeedResult(collection: name, inserted: inserted, skippedReason: nil)
    }
}
