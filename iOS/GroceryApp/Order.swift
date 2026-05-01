import Foundation

struct Order: Identifiable, Codable {
    let id: String
    let docType: String
    // `orderId` is stored as a String in the imported demo dataset
    // (matches the doc ID, e.g. "order-3ac8c2eb-..."), but the app
    // also creates new orders with a numeric `orderId`. Keeping this
    // as String is the lossless superset — the UI just displays it,
    // and the sequential-next-id path now generates a string.
    let orderId: String
    let storeId: String
    let orderDate: Int64
    let orderStatus: String // "In Review", "Approved", "Submitted" (legacy)
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

    init(
        id: String,
        docType: String,
        orderId: String,
        storeId: String,
        orderDate: Int64,
        orderStatus: String,
        productId: Int,
        sku: String,
        unit: String,
        orderQty: Int
    ) {
        self.id = id
        self.docType = docType
        self.orderId = orderId
        self.storeId = storeId
        self.orderDate = orderDate
        self.orderStatus = orderStatus
        self.productId = productId
        self.sku = sku
        self.unit = unit
        self.orderQty = orderQty
    }

    // Custom Codable init so we can accept either Int or String for
    // the numeric fields. Couchbase Lite's auto-Codable path via
    // `.data()` is strict about FleeceValue types — mixing Int/String
    // across environments (imported demo data vs. locally-created docs)
    // would otherwise throw CBL error 18001.
    enum CodingKeys: String, CodingKey {
        case id, docType, orderId, storeId, orderDate, orderStatus
        case productId, sku, unit, orderQty
    }

    init(from decoder: Decoder) throws {
        let c = try decoder.container(keyedBy: CodingKeys.self)
        self.id          = try c.decodeIfPresent(String.self, forKey: .id) ?? ""
        self.docType     = try c.decodeIfPresent(String.self, forKey: .docType) ?? "Order"
        self.orderId     = Order.decodeFlexibleString(c, .orderId) ?? ""
        self.storeId     = try c.decodeIfPresent(String.self, forKey: .storeId) ?? ""
        self.orderDate   = Order.decodeFlexibleInt64(c, .orderDate) ?? 0
        self.orderStatus = try c.decodeIfPresent(String.self, forKey: .orderStatus) ?? "Submitted"
        self.productId   = Order.decodeFlexibleInt(c, .productId) ?? 0
        self.sku         = try c.decodeIfPresent(String.self, forKey: .sku) ?? ""
        self.unit        = try c.decodeIfPresent(String.self, forKey: .unit) ?? ""
        self.orderQty    = Order.decodeFlexibleInt(c, .orderQty) ?? 0
    }

    private static func decodeFlexibleString(_ c: KeyedDecodingContainer<CodingKeys>, _ key: CodingKeys) -> String? {
        if let s = try? c.decode(String.self, forKey: key) { return s }
        if let i = try? c.decode(Int.self, forKey: key) { return String(i) }
        if let i = try? c.decode(Int64.self, forKey: key) { return String(i) }
        return nil
    }

    private static func decodeFlexibleInt(_ c: KeyedDecodingContainer<CodingKeys>, _ key: CodingKeys) -> Int? {
        if let i = try? c.decode(Int.self, forKey: key) { return i }
        if let s = try? c.decode(String.self, forKey: key), let i = Int(s) { return i }
        return nil
    }

    private static func decodeFlexibleInt64(_ c: KeyedDecodingContainer<CodingKeys>, _ key: CodingKeys) -> Int64? {
        if let i = try? c.decode(Int64.self, forKey: key) { return i }
        if let i = try? c.decode(Int.self, forKey: key) { return Int64(i) }
        if let s = try? c.decode(String.self, forKey: key), let i = Int64(s) { return i }
        return nil
    }
}
