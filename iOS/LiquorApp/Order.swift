import Foundation

struct Order: Identifiable, Codable {
    let id: String
    let docType: String
    let orderId: Int
    let storeId: String
    let orderDate: Int64
    let orderStatus: String // "Submitted", "Received"
    let productId: Int
    let sku: String
    let unit: String
    let orderQty: Int
    
    var orderDateFormatted: String {
        let date = Date(timeIntervalSince1970: TimeInterval(orderDate / 1000))
        let formatter = DateFormatter()
        formatter.dateStyle = .medium
        formatter.timeStyle = .short
        return formatter.string(from: date)
    }
}

