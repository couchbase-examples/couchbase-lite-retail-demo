import Foundation
import CouchbaseLiteSwift

// MARK: - Notification Names
extension Notification.Name {
    static let liquorInventoryChanged = Notification.Name("liquorInventoryChanged")
}

class DatabaseManager: ObservableObject {
    var database: Database?
    private let databaseName = AppConfig.databaseName
    private let collectionName = AppConfig.collectionName
    
    // Change listener token to prevent deallocation (following working sample pattern)
    private var collectionChangeListenerToken: ListenerToken?

    // App Services Integration
    @Published var appServicesSyncManager: AppServicesSyncManager?
    @Published var isAppServicesEnabled: Bool = false

    init() {
        // Print configuration on startup
        AppConfig.printConfiguration()
        
        openDatabase()
        // REMOVED: Hard-coded data seeding - data will come from App Services
        // seedSampleDataIfNeeded()
        setupChangeListeners()
        setupAppServicesIntegration()
        
        // Auto-enable App Services if configured
        if AppConfig.enableAppServicesSync {
            DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
                self.enableAppServices()
            }
        }
    }
    
    deinit {
        // Clean up change listener
        collectionChangeListenerToken?.remove()
        print("🧹 [LiquorSync] DatabaseManager cleaned up change listeners")
    }
    
    private func setupChangeListeners() {
        guard let database = database else { 
            print("❌ [LiquorSync] No database available for change listener setup")
            return 
        }
        
        do {
            print("🔧 [LiquorSync] Setting up change listeners...")
            print("🔧 [LiquorSync] Using scope: \(AppConfig.scopeName), collection: \(collectionName)")
            
            // Get the inventory collection from the correct scope (matches Capella structure)
            let collection = try database.collection(name: collectionName, scope: AppConfig.scopeName) 
                ?? database.createCollection(name: collectionName, scope: AppConfig.scopeName)
            
            // Add collection-level change listener (following the working sample pattern)
            collectionChangeListenerToken = collection.addChangeListener { change in
                print("🔔🔔🔔 [LiquorSync] COLLECTION CHANGE LISTENER TRIGGERED!")
                print("🔧 [LiquorSync] Changed document IDs: \(change.documentIDs)")
                print("🔧 [LiquorSync] Document count: \(change.documentIDs.count)")
                
                // Always execute on main queue for UI updates (like the working sample)
                DispatchQueue.main.async { [weak self] in
                    guard let self = self else { return }
                    
                    print("🔄🔄🔄 [LiquorSync] Collection changed: \(change.documentIDs.count) documents")
                    for docId in change.documentIDs {
                        print("📄 [LiquorSync] Collection document changed: \(docId)")
                    }
                    
                    // Trigger UI update by notifying observers
                    self.objectWillChange.send()
                    
                    // Post notification for views to refresh
                    NotificationCenter.default.post(name: .liquorInventoryChanged, object: nil)
                    print("📡📡📡 [LiquorSync] Posted collection inventory changed notification")
                }
            }
            
            print("✅ [LiquorSync] Collection change listener configured for '\(collectionName)'")
            print("🔧 [LiquorSync] Collection token: \(collectionChangeListenerToken != nil ? "✅" : "❌")")
        } catch {
            print("❌ Error setting up change listeners: \(error)")
        }
    }
    
    private func openDatabase() {
        do {
            let config = DatabaseConfiguration()
            database = try Database(name: databaseName, config: config)
            print("✅ Database opened successfully: \(databaseName)")
            print("📍 Database path: \(database?.path ?? "unknown")")
            
            // Log initial document count
            let itemCount = getAllLiquorItems().count
            print("📊 Current inventory: \(itemCount) items")
            
            if itemCount == 0 {
                print("🔄 Database is empty - waiting for App Services to sync data...")
            }
        } catch {
            print("❌ Error opening database: \(error)")
        }
    }
    
    // MARK: - Data Seeding REMOVED
    // ⚠️ All data seeding methods have been removed.
    // Data will now be populated exclusively through App Services sync from Capella.
    // This includes:
    // - seedSampleDataIfNeeded() - REMOVED
    // - seedSampleData() - REMOVED
    // - seedFallbackData() - REMOVED
    // - AAStoreInventoryItem struct - REMOVED
    //
    // To populate the database:
    // 1. Ensure App Services sync is enabled in AppConfig
    // 2. Launch the app - sync will start automatically
    // 3. Data will be pulled from Capella endpoint
    
    func saveLiquorItem(_ item: LiquorItem) {
        guard let database = database else { 
            print("Database not available for saving item: \(item.name)")
            return 
        }
        
        do {
            let collection = try database.collection(name: collectionName, scope: AppConfig.scopeName) 
                ?? database.createCollection(name: collectionName, scope: AppConfig.scopeName)
            let document = MutableDocument(id: item.id)
            
            // Save using Capella field names for consistency
            document.setString(item.id, forKey: "id")
            document.setString(item.name, forKey: "name")
            document.setString(item.type, forKey: "category")  // Map 'type' to 'category' for Capella
            document.setDouble(item.price, forKey: "price")
            document.setString(item.imageURL, forKey: "imageURL")
            document.setInt(item.quantity, forKey: "stockQty")  // Map 'quantity' to 'stockQty' for Capella
            
            // Save additional fields
            if let productId = item.productId {
                document.setInt(productId, forKey: "productId")
            }
            if let sku = item.sku {
                document.setString(sku, forKey: "sku")
            }
            if let brand = item.brand {
                document.setString(brand, forKey: "brand")
            }
            if let unit = item.unit {
                document.setString(unit, forKey: "unit")
            }
            if let location = item.location {
                let locationDict = MutableDictionaryObject()
                locationDict.setInt(location.aisle, forKey: "aisle")
                locationDict.setInt(location.bin, forKey: "bin")
                document.setDictionary(locationDict, forKey: "location")
            }
            if let attributes = item.attributes {
                let attributesDict = MutableDictionaryObject()
                attributesDict.setBoolean(attributes.organic, forKey: "organic")
                attributesDict.setString(attributes.size, forKey: "size")
                attributesDict.setBoolean(attributes.perishable, forKey: "perishable")
                document.setDictionary(attributesDict, forKey: "attributes")
            }
            if let expirationDate = item.expirationDate {
                document.setInt64(expirationDate, forKey: "expirationDate")
            }
            if let lastUpdated = item.lastUpdated {
                document.setInt64(lastUpdated, forKey: "lastUpdated")
            }
            if let storeId = item.storeId {
                document.setString(storeId, forKey: "storeId")
            }
            if let docType = item.docType {
                document.setString(docType, forKey: "docType")
            }
            
            try collection.save(document: document)
            print("Saved liquor item: \(item.name)")
        } catch {
            print("Error saving liquor item \(item.name): \(error)")
        }
    }
    
    func getAllLiquorItems() -> [LiquorItem] {
        guard let database = database else { 
            print("Database not available for getting items")
            return [] 
        }
        
        do {
            guard let collection = try database.collection(name: collectionName, scope: AppConfig.scopeName) else {
                print("Collection \(collectionName) in scope \(AppConfig.scopeName) not found")
                return []
            }
            
            let query = QueryBuilder
                .select(SelectResult.all())
                .from(DataSource.collection(collection))
            
            let results = try query.execute()
            
            var liquorItems: [LiquorItem] = []
            var resultCount = 0
            
            for result in results {
                resultCount += 1
                
                // For SelectResult.all(), data is nested under collection name
                if let dict = result.dictionary(forKey: collectionName) {
                    
                    // Map Capella field names to app field names
                    guard let id = dict.string(forKey: "id"),
                          let name = dict.string(forKey: "name"),
                          let imageURL = dict.string(forKey: "imageURL") else {
                        // Skip documents missing required fields
                        continue
                    }
                    
                    // Map 'category' from Capella to 'type' in app
                    let type = dict.string(forKey: "category") ?? dict.string(forKey: "type") ?? "Unknown"
                    let price = dict.double(forKey: "price")
                    
                    // Map 'stockQty' from Capella to 'quantity' in app
                    // 🔧 SYNC FIX: Try stockQty first (for App Services sync with Android), then fall back to CRDT counter (for P2P)
                    var quantity = dict.int(forKey: "stockQty")
                    if quantity == 0 {
                        // Fall back to CRDT counter if stockQty is not set
                        let tempDoc = MutableDocument(data: dict.toDictionary())
                        quantity = getCurrentQuantity(from: tempDoc)
                    }
                    
                    // Read optional additional fields
                    let productId = dict.int(forKey: "productId")
                    let sku = dict.string(forKey: "sku")
                    let brand = dict.string(forKey: "brand")
                    let unit = dict.string(forKey: "unit")
                    let expirationDate = dict.int64(forKey: "expirationDate")
                    let lastUpdated = dict.int64(forKey: "lastUpdated")
                    let storeId = dict.string(forKey: "storeId")
                    let docType = dict.string(forKey: "docType")
                    
                    // Read location
                    var location: LiquorItem.Location? = nil
                    if let locationDict = dict.dictionary(forKey: "location") {
                        let aisle = locationDict.int(forKey: "aisle")
                        let bin = locationDict.int(forKey: "bin")
                        location = LiquorItem.Location(aisle: aisle, bin: bin)
                    }
                    
                    // Read attributes
                    var attributes: LiquorItem.Attributes? = nil
                    if let attributesDict = dict.dictionary(forKey: "attributes") {
                        let organic = attributesDict.boolean(forKey: "organic")
                        let size = attributesDict.string(forKey: "size") ?? ""
                        let perishable = attributesDict.boolean(forKey: "perishable")
                        attributes = LiquorItem.Attributes(organic: organic, size: size, perishable: perishable)
                    }
                    
                    let item = LiquorItem(
                        id: id,
                        name: name,
                        type: type,
                        price: price,
                        imageURL: imageURL,
                        quantity: quantity,
                        productId: productId,
                        sku: sku,
                        brand: brand,
                        unit: unit,
                        location: location,
                        attributes: attributes,
                        expirationDate: expirationDate,
                        lastUpdated: lastUpdated,
                        storeId: storeId,
                        docType: docType
                    )
                    liquorItems.append(item)
                    //print("Retrieved liquor item: \(name) (qty: \(quantity))")
                } else {
                    //print("Failed to parse result \(resultCount)")
                }
            }
            
            print("Retrieved \(liquorItems.count) liquor items from database")
            return liquorItems
        } catch {
            print("Error fetching liquor items: \(error)")
            return []
        }
    }
    
    func updateQuantity(for itemId: String, newQuantity: Int) {
        print("🔧 [LiquorSync] updateQuantity called for \(itemId): new=\(newQuantity)")
        guard let database = database else { 
            print("❌ [LiquorSync] Database not available")
            return 
        }
        
        do {
            guard let collection = try database.collection(name: collectionName, scope: AppConfig.scopeName) else { 
                print("❌ [LiquorSync] Collection \(collectionName) in scope \(AppConfig.scopeName) not available")
                return 
            }
            
            // Get current document and quantity
            guard let document = try collection.document(id: itemId) else {
                print("❌ [LiquorSync] Document not found for item \(itemId)")
                return
            }
            
            let currentQuantity = getCurrentQuantity(from: document)
            let difference = newQuantity - currentQuantity
            
            print("🔧 [LiquorSync] Current: \(currentQuantity), New: \(newQuantity), Diff: \(difference)")
            
            if difference > 0 {
                print("🔧 [LiquorSync] Incrementing by \(difference)")
                incrementQuantity(for: itemId, by: UInt(difference), in: collection)
            } else if difference < 0 {
                print("🔧 [LiquorSync] Decrementing by \(-difference)")
                decrementQuantity(for: itemId, by: UInt(-difference), in: collection)
            } else {
                print("🔧 [LiquorSync] No change needed (difference = 0)")
            }
            
        } catch {
            print("❌ [LiquorSync] Error updating quantity: \(error)")
        }
    }
    
    func incrementQuantity(for itemId: String, by amount: UInt = 1) {
        guard let database = database else { return }
        
        do {
            guard let collection = try database.collection(name: collectionName, scope: AppConfig.scopeName) else { return }
            incrementQuantity(for: itemId, by: amount, in: collection)
        } catch {
            print("Error incrementing quantity: \(error)")
        }
    }
    
    func decrementQuantity(for itemId: String, by amount: UInt = 1) {
        guard let database = database else { return }
        
        do {
            guard let collection = try database.collection(name: collectionName, scope: AppConfig.scopeName) else { return }
            decrementQuantity(for: itemId, by: amount, in: collection)
        } catch {
            print("Error decrementing quantity: \(error)")
        }
    }
    
    private func incrementQuantity(for itemId: String, by amount: UInt, in collection: Collection) {
        var saved = false
        var attempts = 0
        let maxAttempts = 5
        
        while !saved && attempts < maxAttempts {
            attempts += 1
            
            do {
                // Read the document and create CRDT counter
                let document = try collection.document(id: itemId)?.toMutable() ?? MutableDocument(id: itemId)
                let quantityCounter = document.crdtCounter(forKey: "quantity", actor: database?.deviceUUID ?? "unknown")
                
                let oldValue = quantityCounter.value
                
                // Increment the counter
                quantityCounter.increment(by: amount)
                
                // 🔧 SYNC FIX: Also update stockQty for App Services compatibility with Android
                let newValue = quantityCounter.value
                document.setInt(newValue, forKey: "stockQty")
                
                // Save with concurrency control and retry on failure
                saved = (try? collection.save(document: document, concurrencyControl: .failOnConflict)) ?? false
                
                if saved {
                    let newValue = getCurrentQuantity(from: document)
                    print("✅ [LiquorSync] Incremented quantity for \(itemId)")
                    print("   📊 Change: \(oldValue) → \(newValue) (+\(amount))")
                    print("   🎭 Actor: \(database?.deviceUUID ?? "unknown")")
                    print("   ⏱️  This change should sync to other devices NOW!")
                    
                    // 🔥 CRITICAL FIX: Manually post notification for local UI update
                    DispatchQueue.main.async {
                        NotificationCenter.default.post(name: .liquorInventoryChanged, object: nil)
                        print("📡 [LiquorSync] Posted inventory changed notification for LOCAL change")
                    }
                } else {
                    print("[LiquorSync] Increment failed, retrying... (attempt \(attempts))")
                }
            } catch {
                print("Error in increment attempt \(attempts): \(error)")
                break
            }
        }
        
        if !saved {
            print("[LiquorSync] Failed to increment quantity after \(maxAttempts) attempts")
        }
    }
    
    private func decrementQuantity(for itemId: String, by amount: UInt, in collection: Collection) {
        var saved = false
        var attempts = 0
        let maxAttempts = 5
        
        while !saved && attempts < maxAttempts {
            attempts += 1
            
            do {
                // Read the document and create CRDT counter
                let document = try collection.document(id: itemId)?.toMutable() ?? MutableDocument(id: itemId)
                let quantityCounter = document.crdtCounter(forKey: "quantity", actor: database?.deviceUUID ?? "unknown")
                
                let oldValue = quantityCounter.value
                
                // Decrement the counter
                quantityCounter.decrement(by: amount)
                
                // 🔧 SYNC FIX: Also update stockQty for App Services compatibility with Android
                let newValue = quantityCounter.value
                document.setInt(newValue, forKey: "stockQty")
                
                // Save with concurrency control and retry on failure
                saved = (try? collection.save(document: document, concurrencyControl: .failOnConflict)) ?? false
                
                if saved {
                    let newValue = getCurrentQuantity(from: document)
                    print("✅ [LiquorSync] Decremented quantity for \(itemId)")
                    print("   📊 Change: \(oldValue) → \(newValue) (-\(amount))")
                    print("   🎭 Actor: \(database?.deviceUUID ?? "unknown")")
                    print("   ⏱️  This change should sync to other devices NOW!")
                    
                    // 🔥 CRITICAL FIX: Manually post notification for local UI update
                    DispatchQueue.main.async {
                        NotificationCenter.default.post(name: .liquorInventoryChanged, object: nil)
                        print("📡 [LiquorSync] Posted inventory changed notification for LOCAL change")
                    }
                } else {
                    print("[LiquorSync] Decrement failed, retrying... (attempt \(attempts))")
                }
            } catch {
                print("Error in decrement attempt \(attempts): \(error)")
                break
            }
        }
        
        if !saved {
            print("[LiquorSync] Failed to decrement quantity after \(maxAttempts) attempts")
        }
    }
    
    private func getCurrentQuantity(from document: Document) -> Int {
        // Try to get CRDT counter value first
        if let counter = document.crdtCounter(forKey: "quantity") {
            return counter.value
        }
        
        // Fallback to simple integer for backward compatibility
        return Int(document.int(forKey: "quantity"))
    }
    
    func searchLiquor(_ searchText: String) -> [LiquorItem] {
        guard let database = database else { return [] }
        
        do {
            guard let collection = try database.collection(name: collectionName, scope: AppConfig.scopeName) else {
                return []
            }
            
            // Use text-based search (search both 'category' from Capella and 'type' for local docs)
            let query = QueryBuilder
                .select(SelectResult.all())
                .from(DataSource.collection(collection))
                .where(
                    Expression.property("name").like(Expression.string("%\(searchText)%"))
                    .or(Expression.property("category").like(Expression.string("%\(searchText)%")))
                    .or(Expression.property("type").like(Expression.string("%\(searchText)%")))
                )
            
            let results = try query.execute()
            
            var liquorItems: [LiquorItem] = []
            for result in results {
                // For SelectResult.all(), data is nested under collection name
                if let dict = result.dictionary(forKey: collectionName) {
                    
                    // Map Capella field names to app field names
                    guard let id = dict.string(forKey: "id"),
                          let name = dict.string(forKey: "name"),
                          let imageURL = dict.string(forKey: "imageURL") else {
                        continue
                    }
                    
                    // Map 'category' from Capella to 'type' in app
                    let type = dict.string(forKey: "category") ?? dict.string(forKey: "type") ?? "Unknown"
                    let price = dict.double(forKey: "price")
                    
                    // Map 'stockQty' from Capella to 'quantity' in app
                    let tempDoc = MutableDocument(data: dict.toDictionary())
                    var quantity = getCurrentQuantity(from: tempDoc)
                    if quantity == 0 {
                        quantity = dict.int(forKey: "stockQty")
                    }
                    
                    let item = LiquorItem(id: id, name: name, type: type, price: price, imageURL: imageURL, quantity: quantity)
                    liquorItems.append(item)
                }
            }
            
            print("Search for '\(searchText)' returned \(liquorItems.count) items")
            return liquorItems
        } catch {
            print("Error searching liquor: \(error)")
            return []
        }
    }
    
    // MARK: - Profile Operations
    
    func getStoreProfile() -> StoreProfile? {
        guard let database = database else { return nil }
        
        do {
            let collection = try database.collection(name: AppConfig.profileCollectionName, scope: AppConfig.scopeName)
                ?? database.createCollection(name: AppConfig.profileCollectionName, scope: AppConfig.scopeName)
            
            let query = QueryBuilder
                .select(SelectResult.all())
                .from(DataSource.collection(collection))
                .where(Expression.property("storeId").equalTo(Expression.string(AppConfig.storeId)))
            
            let results = try query.execute()
            
            for result in results {
                guard let dict = result.dictionary(at: 0) else { continue }
                
                let id = dict.string(forKey: "id") ?? ""
                let docType = dict.string(forKey: "docType") ?? "StoreProfile"
                let storeId = dict.string(forKey: "storeId") ?? ""
                let name = dict.string(forKey: "name") ?? ""
                
                // Parse contact
                guard let contactDict = dict.dictionary(forKey: "contact") else { continue }
                let contact = StoreProfile.Contact(
                    email: contactDict.string(forKey: "email") ?? "",
                    phone: contactDict.string(forKey: "phone") ?? ""
                )
                
                // Parse location
                guard let locationDict = dict.dictionary(forKey: "location") else { continue }
                var coordinates: StoreProfile.Coordinates? = nil
                if let coordDict = locationDict.dictionary(forKey: "coordinates") {
                    coordinates = StoreProfile.Coordinates(
                        lat: coordDict.double(forKey: "lat"),
                        lon: coordDict.double(forKey: "lon")
                    )
                }
                
                let location = StoreProfile.Location(
                    address1: locationDict.string(forKey: "address1") ?? "",
                    address2: locationDict.string(forKey: "address2"),
                    locality: locationDict.string(forKey: "locality") ?? "",
                    region: locationDict.string(forKey: "region") ?? "",
                    postalCode: locationDict.string(forKey: "postalCode") ?? "",
                    country: locationDict.string(forKey: "country") ?? "",
                    coordinates: coordinates
                )
                
                let profile = StoreProfile(
                    id: id,
                    docType: docType,
                    storeId: storeId,
                    name: name,
                    contact: contact,
                    location: location,
                    manager: dict.string(forKey: "manager"),
                    openingHours: dict.string(forKey: "openingHours")
                )
                
                print("✅ Retrieved store profile: \(profile.name)")
                return profile
            }
            
            return nil
        } catch {
            print("❌ Error fetching store profile: \(error)")
            return nil
        }
    }
    
    // MARK: - Orders Operations
    
    func getAllOrders() -> [Order] {
        guard let database = database else { return [] }
        
        do {
            let collection = try database.collection(name: AppConfig.ordersCollectionName, scope: AppConfig.scopeName)
                ?? database.createCollection(name: AppConfig.ordersCollectionName, scope: AppConfig.scopeName)
            
            let query = QueryBuilder
                .select(SelectResult.all())
                .from(DataSource.collection(collection))
                .where(Expression.property("storeId").equalTo(Expression.string(AppConfig.storeId)))
                .orderBy(Ordering.expression(Expression.property("orderDate")).descending())
            
            let results = try query.execute()
            var orders: [Order] = []
            
            for result in results {
                guard let dict = result.dictionary(at: 0) else { continue }
                
                let order = Order(
                    id: dict.string(forKey: "id") ?? "",
                    docType: dict.string(forKey: "docType") ?? "Order",
                    orderId: dict.int(forKey: "orderId"),
                    storeId: dict.string(forKey: "storeId") ?? "",
                    orderDate: dict.int64(forKey: "orderDate"),
                    orderStatus: dict.string(forKey: "orderStatus") ?? "Submitted",
                    productId: dict.int(forKey: "productId"),
                    sku: dict.string(forKey: "sku") ?? "",
                    unit: dict.string(forKey: "unit") ?? "",
                    orderQty: dict.int(forKey: "orderQty")
                )
                orders.append(order)
            }
            
            print("✅ Retrieved \(orders.count) orders")
            return orders
        } catch {
            print("❌ Error fetching orders: \(error)")
            return []
        }
    }
    
    func createOrder(item: LiquorItem, quantity: Int = 100) -> Order? {
        guard let database = database else { return nil }
        
        do {
            let collection = try database.collection(name: AppConfig.ordersCollectionName, scope: AppConfig.scopeName)
                ?? database.createCollection(name: AppConfig.ordersCollectionName, scope: AppConfig.scopeName)
            
            // Get next order ID
            let existingOrders = getAllOrders()
            let nextOrderId = (existingOrders.map { $0.orderId }.max() ?? 0) + 1
            
            let orderId = "Order_\(AppConfig.storeId.uppercased())_\(nextOrderId)"
            let order = Order(
                id: orderId,
                docType: "Order",
                orderId: nextOrderId,
                storeId: AppConfig.storeId,
                orderDate: Int64(Date().timeIntervalSince1970 * 1000),
                orderStatus: "Submitted",
                productId: item.productId ?? item.id.hashValue,
                sku: item.sku ?? item.id,
                unit: item.unit ?? "bag",
                orderQty: quantity
            )
            
            let document = MutableDocument(id: orderId)
            document.setString(order.id, forKey: "id")
            document.setString(order.docType, forKey: "docType")
            document.setInt(order.orderId, forKey: "orderId")
            document.setString(order.storeId, forKey: "storeId")
            document.setInt64(order.orderDate, forKey: "orderDate")
            document.setString(order.orderStatus, forKey: "orderStatus")
            document.setInt(order.productId, forKey: "productId")
            document.setString(order.sku, forKey: "sku")
            document.setString(order.unit, forKey: "unit")
            document.setInt(order.orderQty, forKey: "orderQty")
            
            try collection.save(document: document)
            print("✅ Created order: \(orderId)")
            
            return order
        } catch {
            print("❌ Error creating order: \(error)")
            return nil
        }
    }
    
    // MARK: - App Services Integration
    
    private func setupAppServicesIntegration() {
        guard let database = database else {
            print("❌ Database not ready for App Services integration")
            return
        }
        
        print("🌐 Setting up App Services integration...")
        appServicesSyncManager = AppServicesSyncManager(database: database)
        
        print("✅ App Services integration ready")
    }
    
    func enableAppServices() {
        guard let syncManager = appServicesSyncManager else {
            print("❌ App Services sync manager not available")
            return
        }
        
        print("🚀 Enabling App Services sync...")
        isAppServicesEnabled = true
        syncManager.enableAppServices()
    }
    
    func disableAppServices() {
        guard let syncManager = appServicesSyncManager else { return }
        
        print("🛑 Disabling App Services sync...")
        isAppServicesEnabled = false
        syncManager.disableAppServices()
    }
    
    func toggleAppServices() {
        if isAppServicesEnabled {
            disableAppServices()
        } else {
            enableAppServices()
        }
    }
    
    func resetAppServicesSync() {
        appServicesSyncManager?.resetSync()
    }
    
    // MARK: - Enhanced Sync-Aware Operations
    
    // Override the existing updateQuantity method to add App Services sync
    func updateQuantityWithAppServices(for itemId: String, newQuantity: Int) {
        // Update using the existing CRDT method
        updateQuantity(for: itemId, newQuantity: newQuantity)
        
        // Also trigger App Services sync if enabled
        if isAppServicesEnabled {
            appServicesSyncManager?.pushDocumentImmediately(itemId)
        }
    }
    
    func createLiquorItemWithSync(name: String, type: String, price: Double, imageURL: String, quantity: Int = 0) -> String? {
        // Create via App Services if enabled (will also save locally)
        if isAppServicesEnabled, let itemId = appServicesSyncManager?.createLiquorItem(
            name: name, 
            type: type, 
            price: price, 
            imageURL: imageURL, 
            quantity: quantity
        ) {
            return itemId
        }
        
        // Fallback to local creation
        let item = LiquorItem(name: name, type: type, price: price, imageURL: imageURL, quantity: quantity)
        saveLiquorItem(item)
        return item.id
    }
    
    // MARK: - Sync Status Information
    
    func getSyncStatusSummary() -> String {
        var status: [String] = []
        
        // Add App Services status
        if let syncManager = appServicesSyncManager {
            if isAppServicesEnabled {
                status.append("☁️ \(syncManager.getSyncStatusSummary())")
            } else {
                status.append("☁️ App Services disabled")
            }
        }
        
        // Add P2P status (you can integrate this with your existing P2P system)
        status.append("📡 P2P available")
        
        return status.joined(separator: " • ")
    }
    
    func getAppServicesSyncState() -> AppServicesSyncState? {
        return appServicesSyncManager?.syncState
    }
} 

// MARK: - Remove the old updateQuantity method override syntax
extension DatabaseManager {
    // We'll properly integrate this without override conflicts
    func updateQuantityWithSync(for itemId: String, newQuantity: Int) {
        // Update using the original CRDT method
        updateQuantity(for: itemId, newQuantity: newQuantity)
        
        // Also trigger App Services sync if enabled
        if isAppServicesEnabled {
            appServicesSyncManager?.pushDocumentImmediately(itemId)
        }
    }
}
