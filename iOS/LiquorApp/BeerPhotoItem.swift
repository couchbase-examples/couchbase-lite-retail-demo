import Foundation
import CouchbaseLiteSwift

/// Data model representing a beer photo with its embedding
struct BeerPhotoItem: Codable, Identifiable {
    let id: String
    let filename: String
    let name: String // Human-readable name (e.g., "Heineken 6-pack")
    let brand: String
    let packSize: String // e.g., "6-pack", "12-pack", "24-pack"
    let embedding: [Float] // Vector embedding from Vision framework
    let dateAdded: Date
    
    init(filename: String, name: String, brand: String, packSize: String, embedding: [Float]) {
        self.id = UUID().uuidString
        self.filename = filename
        self.name = name
        self.brand = brand
        self.packSize = packSize
        self.embedding = embedding
        self.dateAdded = Date()
    }
    
    /// Convert to dictionary for Couchbase storage
    func toDictionary() -> [String: Any] {
        return [
            "id": id,
            "filename": filename,
            "name": name,
            "brand": brand,
            "packSize": packSize,
            "embedding": embedding,
            "dateAdded": ISO8601DateFormatter().string(from: dateAdded),
            "type": "beer_photo" // Document type for querying
        ]
    }
    
    /// Create from Couchbase dictionary
    static func fromDictionary(_ dict: [String: Any]) -> BeerPhotoItem? {
        guard let id = dict["id"] as? String,
              let filename = dict["filename"] as? String,
              let name = dict["name"] as? String,
              let brand = dict["brand"] as? String,
              let packSize = dict["packSize"] as? String,
              let dateString = dict["dateAdded"] as? String,
              let dateAdded = ISO8601DateFormatter().date(from: dateString) else {
            print("❌ Missing required fields in dict: \(dict)")
            return nil
        }
        
        // Handle embedding field - it might be [Float] or CouchbaseLiteSwift.ArrayObject
        var embedding: [Float]
        if let embeddingArray = dict["embedding"] as? [Float] {
            embedding = embeddingArray
        } else if let arrayObject = dict["embedding"] as? CouchbaseLiteSwift.ArrayObject {
            // Convert ArrayObject to [Float]
            embedding = []
            for i in 0..<arrayObject.count {
                let floatValue = arrayObject.float(at: i)
                embedding.append(floatValue)
            }
        } else {
            print("❌ Invalid embedding type in dict: \(type(of: dict["embedding"]))")
            return nil
        }
        
        var item = BeerPhotoItem(filename: filename, name: name, brand: brand, packSize: packSize, embedding: embedding)
        // Override the auto-generated values with stored ones
        item = BeerPhotoItem(id: id, filename: filename, name: name, brand: brand, packSize: packSize, embedding: embedding, dateAdded: dateAdded)
        return item
    }
    
    private init(id: String, filename: String, name: String, brand: String, packSize: String, embedding: [Float], dateAdded: Date) {
        self.id = id
        self.filename = filename
        self.name = name
        self.brand = brand
        self.packSize = packSize
        self.embedding = embedding
        self.dateAdded = dateAdded
    }
}