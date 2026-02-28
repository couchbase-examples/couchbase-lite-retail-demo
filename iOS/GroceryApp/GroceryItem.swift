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
    
    // Nested structures
    struct Location: Codable {
        var aisle: Int
        var bin: Int
    }
    
    struct Attributes: Codable {
        var organic: Bool
        var size: String
        var perishable: Bool
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
        docType: String? = nil
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