import Foundation

struct LiquorItem: Identifiable, Codable {
    let id: String
    var name: String
    var type: String
    var price: Double
    var imageURL: String
    var quantity: Int
    
    init(id: String = UUID().uuidString, name: String, type: String, price: Double, imageURL: String, quantity: Int = 0) {
        self.id = id
        self.name = name
        self.type = type
        self.price = price
        self.imageURL = imageURL
        self.quantity = quantity
    }
} 