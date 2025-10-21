import Foundation

struct LiquorItem: Identifiable, Codable {
    let id: String
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
    
    init(
        id: String = UUID().uuidString,
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
    
    // Convenience initializer for backward compatibility
    init(id: String = UUID().uuidString, name: String, type: String, price: Double, imageURL: String, quantity: Int = 0) {
        self.init(
            id: id,
            name: name,
            type: type,
            price: price,
            imageURL: imageURL,
            quantity: quantity,
            productId: nil,
            sku: nil,
            brand: nil,
            unit: nil,
            location: nil,
            attributes: nil,
            expirationDate: nil,
            lastUpdated: nil,
            storeId: nil,
            docType: nil
        )
    }
} 