import Foundation
import CouchbaseLiteSwift

class DatabaseManager: ObservableObject {
    var database: Database?
    private let databaseName = "LiquorInventoryDB"
    private let collectionName = "liquor_items"

    // App Services Integration
    @Published var appServicesSyncManager: AppServicesSyncManager?
    @Published var isAppServicesEnabled: Bool = false

    init() {
        openDatabase()
        seedSampleDataIfNeeded()
        setupChangeListeners()
        setupAppServicesIntegration()
    }
    
    private func setupChangeListeners() {
        guard let database = database else { return }
        
        do {
            // Listen for collection changes to update UI automatically when sync occurs
            let collection = try database.collection(name: collectionName) ?? database.createCollection(name: collectionName)
            collection.addChangeListener { [weak self] change in
                DispatchQueue.main.async {
                    print("[LiquorSync] Collection changed: \(change.documentIDs)")
                    // Trigger UI update by notifying observers
                    self?.objectWillChange.send()
                }
            }
            
            print("[LiquorSync] Collection change listener configured")
        } catch {
            print("Error setting up change listeners: \(error)")
        }
    }
    
    private func openDatabase() {
        do {
            let config = DatabaseConfiguration()
            database = try Database(name: databaseName, config: config)
            print("Database opened successfully")
        } catch {
            print("Error opening database: \(error)")
        }
    }
    
    private func seedSampleDataIfNeeded() {
        // Check if data already exists
        let existingItems = getAllLiquorItems()
        if !existingItems.isEmpty {
            print("Sample data already exists (\(existingItems.count) items), skipping seeding")
            return
        }
        
        print("Starting to seed sample data...")
        seedSampleData()
    }
    
    private func seedSampleData() {
        let sampleLiquors = [
            LiquorItem(name: "Johnnie Walker Black Label", type: "Whiskey", price: 45.99, imageURL: "whiskey1"),
            LiquorItem(name: "Grey Goose Vodka", type: "Vodka", price: 39.99, imageURL: "vodka1"),
            LiquorItem(name: "Bacardi Superior Rum", type: "Rum", price: 24.99, imageURL: "rum1"),
            LiquorItem(name: "Tanqueray Gin", type: "Gin", price: 29.99, imageURL: "gin1"),
            LiquorItem(name: "Patron Silver Tequila", type: "Tequila", price: 54.99, imageURL: "tequila1"),
            LiquorItem(name: "Hennessy VS Cognac", type: "Cognac", price: 49.99, imageURL: "cognac1"),
            LiquorItem(name: "Macallan 12 Year", type: "Whiskey", price: 79.99, imageURL: "whiskey2"),
            LiquorItem(name: "Belvedere Vodka", type: "Vodka", price: 44.99, imageURL: "vodka2"),
            LiquorItem(name: "Captain Morgan Spiced Rum", type: "Rum", price: 22.99, imageURL: "rum2"),
            LiquorItem(name: "Bombay Sapphire Gin", type: "Gin", price: 26.99, imageURL: "gin2"),
            LiquorItem(name: "Don Julio Blanco", type: "Tequila", price: 49.99, imageURL: "tequila2"),
            LiquorItem(name: "Remy Martin VSOP", type: "Cognac", price: 64.99, imageURL: "cognac2"),
            LiquorItem(name: "Jack Daniel's Old No. 7", type: "Whiskey", price: 29.99, imageURL: "whiskey3"),
            LiquorItem(name: "Absolut Original Vodka", type: "Vodka", price: 19.99, imageURL: "vodka3"),
            LiquorItem(name: "Mount Gay Eclipse Rum", type: "Rum", price: 27.99, imageURL: "rum3")
        ]
        
        for liquor in sampleLiquors {
            saveLiquorItem(liquor)
        }
        print("Finished seeding \(sampleLiquors.count) sample items")
    }
    
    func saveLiquorItem(_ item: LiquorItem) {
        guard let database = database else { 
            print("Database not available for saving item: \(item.name)")
            return 
        }
        
        do {
            let collection = try database.collection(name: collectionName) ?? database.createCollection(name: collectionName)
            let document = MutableDocument(id: item.id)
            
            // IMPORTANT: Save the id field in the document content
            document.setString(item.id, forKey: "id")
            document.setString(item.name, forKey: "name")
            document.setString(item.type, forKey: "type")
            document.setDouble(item.price, forKey: "price")
            document.setString(item.imageURL, forKey: "imageURL")
            document.setInt(item.quantity, forKey: "quantity")
            
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
            guard let collection = try database.collection(name: collectionName) else {
                print("Collection \(collectionName) not found")
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
                if let dict = result.dictionary(forKey: collectionName),
                   let id = dict.string(forKey: "id"),
                   let name = dict.string(forKey: "name"),
                   let type = dict.string(forKey: "type"),
                   let imageURL = dict.string(forKey: "imageURL") {
                    
                    let price = dict.double(forKey: "price")
                    
                    // Create a temporary document to read quantity using CRDT counter
                    let tempDoc = MutableDocument(data: dict.toDictionary())
                    let quantity = getCurrentQuantity(from: tempDoc)
                    
                    let item = LiquorItem(id: id, name: name, type: type, price: price, imageURL: imageURL, quantity: quantity)
                    liquorItems.append(item)
                    print("Retrieved liquor item: \(name) (qty: \(quantity))")
                } else {
                    print("Failed to parse result \(resultCount)")
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
        guard let database = database else { return }
        
        do {
            guard let collection = try database.collection(name: collectionName) else { return }
            
            // Get current document and quantity
            guard let document = try collection.document(id: itemId) else {
                print("Document not found for item \(itemId)")
                return
            }
            
            let currentQuantity = getCurrentQuantity(from: document)
            let difference = newQuantity - currentQuantity
            
            if difference > 0 {
                incrementQuantity(for: itemId, by: UInt(difference), in: collection)
            } else if difference < 0 {
                decrementQuantity(for: itemId, by: UInt(-difference), in: collection)
            }
            // If difference is 0, no update needed
            
        } catch {
            print("Error updating quantity: \(error)")
        }
    }
    
    func incrementQuantity(for itemId: String, by amount: UInt = 1) {
        guard let database = database else { return }
        
        do {
            guard let collection = try database.collection(name: collectionName) else { return }
            incrementQuantity(for: itemId, by: amount, in: collection)
        } catch {
            print("Error incrementing quantity: \(error)")
        }
    }
    
    func decrementQuantity(for itemId: String, by amount: UInt = 1) {
        guard let database = database else { return }
        
        do {
            guard let collection = try database.collection(name: collectionName) else { return }
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
                
                // Increment the counter
                quantityCounter.increment(by: amount)
                
                // Save with concurrency control and retry on failure
                saved = (try? collection.save(document: document, concurrencyControl: .failOnConflict)) ?? false
                
                if saved {
                    let newValue = getCurrentQuantity(from: document)
                    print("[LiquorSync] Incremented quantity for \(itemId) by \(amount) -> \(newValue)")
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
                
                // Decrement the counter
                quantityCounter.decrement(by: amount)
                
                // Save with concurrency control and retry on failure
                saved = (try? collection.save(document: document, concurrencyControl: .failOnConflict)) ?? false
                
                if saved {
                    let newValue = getCurrentQuantity(from: document)
                    print("[LiquorSync] Decremented quantity for \(itemId) by \(amount) -> \(newValue)")
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
            guard let collection = try database.collection(name: collectionName) else {
                return []
            }
            
            // Use text-based search
            let query = QueryBuilder
                .select(SelectResult.all())
                .from(DataSource.collection(collection))
                .where(
                    Expression.property("name").like(Expression.string("%\(searchText)%"))
                    .or(Expression.property("type").like(Expression.string("%\(searchText)%")))
                )
            
            let results = try query.execute()
            
            var liquorItems: [LiquorItem] = []
            for result in results {
                // For SelectResult.all(), data is nested under collection name
                if let dict = result.dictionary(forKey: collectionName),
                   let id = dict.string(forKey: "id"),
                   let name = dict.string(forKey: "name"),
                   let type = dict.string(forKey: "type"),
                   let imageURL = dict.string(forKey: "imageURL") {
                    
                    let price = dict.double(forKey: "price")
                    
                    // Create a temporary document to read quantity using CRDT counter
                    let tempDoc = MutableDocument(data: dict.toDictionary())
                    let quantity = getCurrentQuantity(from: tempDoc)
                    
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
