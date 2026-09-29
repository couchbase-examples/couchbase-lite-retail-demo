import Foundation
import CouchbaseLiteSwift

// Changed from struct to class to support @DocumentID (required for Reactive APIs)
class GroceryItem: Identifiable, Codable, Hashable, Equatable {
    @DocumentID var id: String?  // Reactive API: Links to Couchbase document ID
    var name: String
    var type: String // Maps to "category" in JSON
    var price: Double
    var imageURL: String
    var quantity: Int // Maps to "stockQty" in JSON
    
    // Additional fields from AA Store inventory
    var productId: Int?
    var sku: String?
    var brand: String?
    var unit: String?
    var location: Location?
    var attributes: Attributes?
    var expirationDate: Int64?
    var lastUpdated: Int64?
    var storeId: String?
    var docType: String?
    
    // Vector-search additions (all optional — absent on un-extended documents)
    var description: String?
    var searchTags: [String]?
    var embedding: Embedding?

    // Nested structures
    struct Location: Codable {
        var aisle: Int
        var bin: Int
        // Added by the edge-vector-search dataset extension; `shelf` drives
        // planogram matching and `section` is the human-readable zone label.
        var shelf: String?
        var section: String?

        init(aisle: Int, bin: Int, shelf: String? = nil, section: String? = nil) {
            self.aisle = aisle
            self.bin = bin
            self.shelf = shelf
            self.section = section
        }
    }

    /// `attributes` is an open, category-specific object: grocery documents carry
    /// organic/size/perishable, footwear carries color/material/breathable/…, and
    /// sports-nutrition items add protein_g/sugar_g/dairyFree. Every key is optional
    /// so a document from any category decodes — the 18 Footwear docs in the extended
    /// dataset have no `organic` or `perishable` at all, and non-optional fields here
    /// would fail the whole document, not just the one key.
    struct Attributes: Codable {
        // Grocery
        var organic: Bool?
        var size: String?
        var perishable: Bool?
        // Sports nutrition
        var protein_g: Int?
        var sugar_g: Int?
        var dairyFree: Bool?
        var vegan: Bool?
        var flavor: String?
        var caffeine_mg: Int?
        var probiotic: Bool?
        // Footwear
        var color: String?
        var material: String?
        var weight: String?
        var breathable: Bool?
        var waterproof: Bool?
        var gender: String?
        var useCase: String?
        var sizeRange: String?

        init(organic: Bool? = nil, size: String? = nil, perishable: Bool? = nil,
             protein_g: Int? = nil, sugar_g: Int? = nil, dairyFree: Bool? = nil,
             vegan: Bool? = nil, flavor: String? = nil, caffeine_mg: Int? = nil,
             probiotic: Bool? = nil, color: String? = nil, material: String? = nil,
             weight: String? = nil, breathable: Bool? = nil, waterproof: Bool? = nil,
             gender: String? = nil, useCase: String? = nil, sizeRange: String? = nil) {
            self.organic = organic; self.size = size; self.perishable = perishable
            self.protein_g = protein_g; self.sugar_g = sugar_g; self.dairyFree = dairyFree
            self.vegan = vegan; self.flavor = flavor; self.caffeine_mg = caffeine_mg
            self.probiotic = probiotic; self.color = color; self.material = material
            self.weight = weight; self.breathable = breathable; self.waterproof = waterproof
            self.gender = gender; self.useCase = useCase; self.sizeRange = sizeRange
        }

        /// Category-appropriate highlights for the copilot result card, in a stable
        /// order so the same product always renders its badges the same way.
        var displayBadges: [String] {
            var out: [String] = []
            if let p = protein_g, p > 0 { out.append("\(p)g protein") }
            if let s = sugar_g { out.append("\(s)g sugar") }
            if dairyFree == true { out.append("dairy-free") }
            if vegan == true { out.append("vegan") }
            if organic == true { out.append("organic") }
            if let c = color { out.append(c) }
            if let u = useCase { out.append(u) }
            if breathable == true { out.append("breathable") }
            if waterproof == true { out.append("waterproof") }
            return out
        }
    }

    /// The embedding envelope from the data-model spec (§4.3). Carried on the item so
    /// the behind-the-scenes screen can show which model produced a vector and whether
    /// it came from the cloud or the edge, without a second lookup.
    struct Embedding: Codable {
        var text: Vector?
        var image: Vector?

        struct Vector: Codable {
            var vector: [Float]?
            var model: String?
            var dim: Int?
            var metric: String?
            var source: String?
            var sourceText: String?
            var generatedAt: Int64?
        }
    }

    // Codable conformance - @DocumentID handles its own encoding/decoding
    // Just decode the actual String value, not the property wrapper
    required init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        // For @DocumentID, decode as optional String - the wrapper handles the rest
        self.id = try container.decodeIfPresent(String.self, forKey: .id)
        self.name = try container.decode(String.self, forKey: .name)
        self.type = try container.decodeIfPresent(String.self, forKey: .type) ?? "Unknown"
        self.price = try container.decode(Double.self, forKey: .price)
        self.imageURL = try container.decode(String.self, forKey: .imageURL)
        self.quantity = try container.decode(Int.self, forKey: .quantity)
        self.productId = try container.decodeIfPresent(Int.self, forKey: .productId)
        self.sku = try container.decodeIfPresent(String.self, forKey: .sku)
        self.brand = try container.decodeIfPresent(String.self, forKey: .brand)
        self.unit = try container.decodeIfPresent(String.self, forKey: .unit)
        self.location = try container.decodeIfPresent(Location.self, forKey: .location)
        self.attributes = try container.decodeIfPresent(Attributes.self, forKey: .attributes)
        self.expirationDate = try container.decodeIfPresent(Int64.self, forKey: .expirationDate)
        self.lastUpdated = try container.decodeIfPresent(Int64.self, forKey: .lastUpdated)
        self.storeId = try container.decodeIfPresent(String.self, forKey: .storeId)
        self.docType = try container.decodeIfPresent(String.self, forKey: .docType)
        self.description = try container.decodeIfPresent(String.self, forKey: .description)
        self.searchTags = try container.decodeIfPresent([String].self, forKey: .searchTags)
        self.embedding = try container.decodeIfPresent(Embedding.self, forKey: .embedding)
    }
    
    // Encode method - let @DocumentID handle itself
    func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try container.encodeIfPresent(id, forKey: .id)
        try container.encode(name, forKey: .name)
        try container.encode(type, forKey: .type)
        try container.encode(price, forKey: .price)
        try container.encode(imageURL, forKey: .imageURL)
        try container.encode(quantity, forKey: .quantity)
        try container.encodeIfPresent(productId, forKey: .productId)
        try container.encodeIfPresent(sku, forKey: .sku)
        try container.encodeIfPresent(brand, forKey: .brand)
        try container.encodeIfPresent(unit, forKey: .unit)
        try container.encodeIfPresent(location, forKey: .location)
        try container.encodeIfPresent(attributes, forKey: .attributes)
        try container.encodeIfPresent(expirationDate, forKey: .expirationDate)
        try container.encodeIfPresent(lastUpdated, forKey: .lastUpdated)
        try container.encodeIfPresent(storeId, forKey: .storeId)
        try container.encodeIfPresent(docType, forKey: .docType)
        try container.encodeIfPresent(description, forKey: .description)
        try container.encodeIfPresent(searchTags, forKey: .searchTags)
        try container.encodeIfPresent(embedding, forKey: .embedding)
    }
    
    init(
        id: String? = nil,
        name: String,
        type: String,
        price: Double,
        imageURL: String,
        quantity: Int = 0,
        productId: Int? = nil,
        sku: String? = nil,
        brand: String? = nil,
        unit: String? = nil,
        location: Location? = nil,
        attributes: Attributes? = nil,
        expirationDate: Int64? = nil,
        lastUpdated: Int64? = nil,
        storeId: String? = nil,
        docType: String? = nil,
        description: String? = nil,
        searchTags: [String]? = nil,
        embedding: Embedding? = nil
    ) {
        self.id = id
        self.name = name
        self.type = type
        self.price = price
        self.imageURL = imageURL
        self.quantity = quantity
        self.productId = productId
        self.sku = sku
        self.brand = brand
        self.unit = unit
        self.location = location
        self.attributes = attributes
        self.expirationDate = expirationDate
        self.lastUpdated = lastUpdated
        self.storeId = storeId
        self.docType = docType
        self.description = description
        self.searchTags = searchTags
        self.embedding = embedding
    }

    // CodingKeys for proper Codable support
    // Maps Swift property names to JSON/SQL++ field names
    enum CodingKeys: String, CodingKey {
        case id
        case name
        case type = "category"  // Map 'category' from Capella to 'type' in app
        case price
        case imageURL
        case quantity = "stockQty"  // Map 'stockQty' from Capella to 'quantity' in app
        case productId, sku, brand, unit, location, attributes
        case expirationDate, lastUpdated, storeId, docType
        case description, searchTags, embedding
    }
    
    // MARK: - Hashable & Equatable Conformance
    
    /// Hash based on document ID - stable and unique per document
    func hash(into hasher: inout Hasher) {
        hasher.combine(id)
    }
    
    /// Equality based on document ID AND quantity - items are different if quantity changes
    /// This allows SwiftUI to detect changes without forcing card recreation
    static func == (lhs: GroceryItem, rhs: GroceryItem) -> Bool {
        return lhs.id == rhs.id && lhs.quantity == rhs.quantity
    }
    
} 