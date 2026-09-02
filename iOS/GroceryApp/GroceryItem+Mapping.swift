import Foundation
import CouchbaseLiteSwift

// MARK: - Couchbase Lite → GroceryItem mapping
//
// Field extraction used to be copy-pasted in three places (DatabaseManager's list
// and search paths, and InventoryView's reactive query), which meant every new
// field had to be added three times and the copilot would have made a fourth.
// Both `Result` and `DictionaryObject` conform to `DictionaryProtocol`, so one
// helper serves every call site.
//
// Deliberately does NOT read `embedding.*.vector`: the inventory grid renders 104
// items, and pulling 384 floats per item into memory on every reactive emission
// costs a lot for data no list view displays. The copilot reads vectors through
// `embeddingMetadata(from:)` only where it actually needs them.

extension GroceryItem {

    /// Builds an item from a CBL dictionary. Returns nil when a field the UI cannot
    /// render without is missing, matching the previous `guard let` behaviour.
    static func from(_ dict: DictionaryProtocol, id: String? = nil) -> GroceryItem? {
        guard let docId = id ?? dict.string(forKey: "id"),
              let name = dict.string(forKey: "name"),
              let imageURL = dict.string(forKey: "imageURL") else {
            return nil
        }

        // Capella stores `category`; older locally-created docs used `type`.
        let type = dict.string(forKey: "category") ?? dict.string(forKey: "type") ?? "Unknown"

        var location: Location?
        if let l = dict.dictionary(forKey: "location") {
            location = Location(
                aisle: l.int(forKey: "aisle"),
                bin: l.int(forKey: "bin"),
                shelf: l.string(forKey: "shelf"),
                section: l.string(forKey: "section")
            )
        }

        var attributes: Attributes?
        if let a = dict.dictionary(forKey: "attributes") {
            // `boolean(forKey:)` returns false for an absent key, which would turn
            // "this document has no `organic` field" into "this product is not organic".
            // Presence is checked so absent stays nil.
            func bool(_ key: String) -> Bool? {
                a.contains(key: key) ? a.boolean(forKey: key) : nil
            }
            func int(_ key: String) -> Int? {
                a.contains(key: key) ? a.int(forKey: key) : nil
            }
            attributes = Attributes(
                organic: bool("organic"),
                size: a.string(forKey: "size"),
                perishable: bool("perishable"),
                protein_g: int("protein_g"),
                sugar_g: int("sugar_g"),
                dairyFree: bool("dairyFree"),
                vegan: bool("vegan"),
                flavor: a.string(forKey: "flavor"),
                caffeine_mg: int("caffeine_mg"),
                probiotic: bool("probiotic"),
                color: a.string(forKey: "color"),
                material: a.string(forKey: "material"),
                weight: a.string(forKey: "weight"),
                breathable: bool("breathable"),
                waterproof: bool("waterproof"),
                gender: a.string(forKey: "gender"),
                useCase: a.string(forKey: "useCase"),
                sizeRange: a.string(forKey: "sizeRange")
            )
        }

        var searchTags: [String]?
        if let tags = dict.array(forKey: "searchTags") {
            searchTags = (0..<tags.count).compactMap { tags.string(at: $0) }
        }

        return GroceryItem(
            id: docId,
            name: name,
            type: type,
            price: dict.double(forKey: "price"),
            imageURL: imageURL,
            quantity: dict.int(forKey: "stockQty"),
            productId: dict.contains(key: "productId") ? dict.int(forKey: "productId") : nil,
            sku: dict.string(forKey: "sku"),
            brand: dict.string(forKey: "brand"),
            unit: dict.string(forKey: "unit"),
            location: location,
            attributes: attributes,
            expirationDate: dict.contains(key: "expirationDate") ? dict.int64(forKey: "expirationDate") : nil,
            lastUpdated: dict.contains(key: "lastUpdated") ? dict.int64(forKey: "lastUpdated") : nil,
            storeId: dict.string(forKey: "storeId"),
            docType: dict.string(forKey: "docType"),
            description: dict.string(forKey: "description"),
            searchTags: searchTags
        )
    }

    /// Reads the embedding envelope's metadata — model, dimensions, metric, cloud-vs-edge
    /// provenance — without materializing the vector itself. This is what the
    /// behind-the-scenes screen displays.
    static func embeddingMetadata(from dict: DictionaryProtocol,
                                  modality: String = "text") -> Embedding.Vector? {
        guard let envelope = dict.dictionary(forKey: "embedding"),
              let m = envelope.dictionary(forKey: modality) else { return nil }
        return Embedding.Vector(
            vector: nil,
            model: m.string(forKey: "model"),
            dim: m.contains(key: "dim") ? m.int(forKey: "dim") : nil,
            metric: m.string(forKey: "metric"),
            source: m.string(forKey: "source"),
            sourceText: m.string(forKey: "sourceText"),
            generatedAt: m.contains(key: "generatedAt") ? m.int64(forKey: "generatedAt") : nil
        )
    }
}
