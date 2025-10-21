import CouchbaseLiteSwift
import Foundation
import Combine

// MARK: - App Services Sync State
struct AppServicesSyncState {
    var isConnected: Bool = false
    var status: String = "Disconnected"
    var lastSyncTime: Date? = nil
    var documentsInSync: Int = 0
    var progress: Float = 0.0
    var error: String? = nil
    var totalDocuments: Int = 0
    var documentsCompleted: Int = 0
}

// MARK: - App Services Sync Manager
class AppServicesSyncManager: ObservableObject {
    
    // MARK: - Published Properties
    @Published var syncState = AppServicesSyncState()
    @Published var isEnabled: Bool = false
    
    // MARK: - Configuration (from AppConfig)
    private let syncGatewayURL = AppConfig.syncGatewayURL
    private let username = AppConfig.username
    private let password = AppConfig.password
    
    // MARK: - Core Components
    private var database: Database
    private var replicator: Replicator?
    private var replicatorChangeToken: ListenerToken?
    private let collectionName = AppConfig.collectionName
    
    // MARK: - Sync Control
    private var isSyncActive = false
    private let syncQueue = DispatchQueue(label: "com.liquorapp.appsync", qos: .background)
    
    // MARK: - Init
    init(database: Database) {
        self.database = database
        print("🌐 AppServicesSyncManager initialized with database: \(database.name)")
        setupAppServicesSync()
    }
    
    // MARK: - Setup Methods
    private func setupAppServicesSync() {
        print("🔧 Setting up App Services sync configuration...")
        print("🔧 Scope: \(AppConfig.scopeName), Collection: \(collectionName)")
        
        do {
            // Ensure collection exists (using scope from AppConfig to match Capella structure)
            let collection = try database.collection(name: collectionName, scope: AppConfig.scopeName) 
                ?? database.createCollection(name: collectionName, scope: AppConfig.scopeName)
            
            // Create target endpoint
            guard let url = URL(string: syncGatewayURL) else {
                throw NSError(domain: "Invalid sync gateway URL", code: -1)
            }
            
            let target = URLEndpoint(url: url)
            var config = ReplicatorConfiguration(target: target)
            
            // Configure authentication
            config.authenticator = BasicAuthenticator(username: username, password: password)
            
            // Configure replication type and behavior
            config.replicatorType = .pushAndPull
            config.continuous = true
            config.enableAutoPurge = false
            config.heartbeat = 60 // seconds
            config.maxAttempts = 10
            config.maxAttemptWaitTime = 300 // 5 minutes
            config.allowReplicatingInBackground = true
            
            // Configure collections with CRDT conflict resolver
            var collectionConfig = CollectionConfiguration()
            collectionConfig.conflictResolver = LiquorCRDTConflictResolver.shared
            config.addCollection(collection, config: collectionConfig)
            
            // Create replicator
            replicator = Replicator(config: config)
            
            // Add change listener
            replicatorChangeToken = replicator?.addChangeListener { [weak self] change in
                DispatchQueue.main.async {
                    self?.handleReplicationChange(change)
                }
            }
            
            print("✅ App Services sync configured successfully")
            updateSyncState { state in
                state.status = "☁️ Ready to sync"
            }
            
        } catch {
            print("❌ Failed to setup App Services sync: \(error)")
            updateSyncState { state in
                state.status = "Setup failed"
                state.error = error.localizedDescription
            }
        }
    }
    
    // MARK: - Public Sync Control Methods
    func enableAppServices() {
        guard !isEnabled else { return }
        
        print("🚀 Enabling App Services sync...")
        isEnabled = true
        startSync()
        
        updateSyncState { state in
            state.status = "☁️ Starting cloud sync..."
        }
    }
    
    func disableAppServices() {
        guard isEnabled else { return }
        
        print("🛑 Disabling App Services sync...")
        isEnabled = false
        stopSync()
        
        updateSyncState { state in
            state.status = "☁️ Cloud sync stopped"
            state.isConnected = false
        }
    }
    
    func toggleAppServices() {
        if isEnabled {
            disableAppServices()
        } else {
            enableAppServices()
        }
    }
    
    private func startSync() {
        guard let replicator = replicator, !isSyncActive else {
            print("⚠️ Cannot start sync - replicator not available or already active")
            return
        }
        
        syncQueue.async { [weak self] in
            guard let self = self else { return }
            
            print("🌐 Starting App Services replicator...")
            self.isSyncActive = true
            replicator.start()
            
            DispatchQueue.main.async {
                self.updateSyncState { state in
                    state.status = "☁️ Connecting to cloud..."
                }
            }
        }
    }
    
    private func stopSync() {
        guard let replicator = replicator, isSyncActive else { return }
        
        syncQueue.async { [weak self] in
            guard let self = self else { return }
            
            print("🛑 Stopping App Services replicator...")
            replicator.stop()
            self.isSyncActive = false
            
            DispatchQueue.main.async {
                self.updateSyncState { state in
                    state.status = "☁️ Sync stopped"
                    state.isConnected = false
                }
            }
        }
    }
    
    func resetSync() {
        print("🔄 Resetting App Services sync...")
        
        stopSync()
        
        // Reset checkpoint to force complete resync
        syncQueue.asyncAfter(deadline: .now() + 1.0) { [weak self] in
            // Note: resetCheckpoint might not be available in all Couchbase Lite versions
            // Alternative: stop and restart replicator to trigger a fresh sync
            
            DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
                self?.startSync()
            }
        }
        
        updateSyncState { state in
            state.status = "☁️ Resetting sync..."
            state.progress = 0.0
            state.error = nil
        }
    }
    
    // MARK: - Replication Event Handling
    private func handleReplicationChange(_ change: ReplicatorChange) {
        let status = change.status
        let progress = status.progress
        
        print("📊 App Services sync change: \(status.activity) - \(progress.completed)/\(progress.total)")
        
        updateSyncState { state in
            // Update connection status
            state.isConnected = (status.activity == .busy || status.activity == .idle)
            
            // Update progress
            if progress.total > 0 {
                state.progress = Float(progress.completed) / Float(progress.total)
                state.documentsCompleted = Int(progress.completed)
                state.totalDocuments = Int(progress.total)
                state.documentsInSync = Int(progress.total)
            }
            
            // Update status based on activity
            switch status.activity {
            case .connecting:
                state.status = "☁️ Connecting to cloud..."
                
            case .busy:
                state.status = "☁️ Syncing... (\(progress.completed)/\(progress.total))"
                
            case .idle:
                state.status = "☁️ Cloud sync ready"
                state.lastSyncTime = Date()
                state.progress = 1.0
                
            case .stopped:
                state.status = "☁️ Sync stopped"
                state.isConnected = false
                state.progress = 0.0
                
            case .offline:
                state.status = "☁️ Cloud offline"
                state.isConnected = false
                
            @unknown default:
                state.status = "☁️ Unknown sync state"
            }
            
            // Handle errors
            if let error = status.error {
                print("❌ App Services sync error: \(error)")
                
                // Handle different error types
                let errorCode = (error as NSError).code
                switch errorCode {
                case 11001: // Network error (based on common error codes)
                    state.status = "☁️ Network error - will retry"
                    state.error = "Network connectivity issue"
                case 11002: // Auth required
                    state.status = "☁️ Authentication failed"
                    state.error = "Invalid credentials"
                case 11003: // Forbidden
                    state.status = "☁️ Access denied"
                    state.error = "Permission denied"
                case 11004: // Not found
                    state.status = "☁️ Database not found"
                    state.error = "Remote database not found"
                default:
                    state.status = "☁️ Sync error"
                    state.error = error.localizedDescription
                }
                
                state.isConnected = false
            } else {
                state.error = nil
            }
        }
    }
    
    // MARK: - Document Operations
    func pushDocumentImmediately(_ documentId: String) {
        guard isEnabled, replicator != nil else {
            print("⚠️ Cannot push document - sync not enabled")
            return
        }
        
        print("📤 Triggering immediate push for document: \(documentId)")
        
        // The document will be automatically picked up by the continuous replicator
        // We can trigger a one-time sync to speed things up
        if !isSyncActive {
            startSync()
        }
    }
    
    func getConflictedDocuments() -> [String] {
        do {
            let collection = try database.collection(name: collectionName, scope: AppConfig.scopeName)
            let query = QueryBuilder
                .select(SelectResult.expression(Meta.id))
                .from(DataSource.collection(collection!))
                .where(Meta.revisionID.like(Expression.string("%-%"))) // Simple conflict detection
            
            let results = try query.execute()
            var conflicts: [String] = []
            
            for result in results {
                if let docId = result.string(at: 0) {
                    conflicts.append(docId)
                }
            }
            
            print("🔍 Found \(conflicts.count) conflicted documents")
            return conflicts
            
        } catch {
            print("❌ Failed to query conflicts: \(error)")
            return []
        }
    }
    
    // MARK: - Helper Methods
    private func updateSyncState(_ update: (inout AppServicesSyncState) -> Void) {
        var newState = syncState
        update(&newState)
        syncState = newState
    }
    
    // MARK: - Status Information
    func getSyncStatusSummary() -> String {
        if !isEnabled {
            return "App Services sync disabled"
        }
        
        let baseStatus = syncState.status
        
        if syncState.isConnected {
            if let lastSync = syncState.lastSyncTime {
                let formatter = DateFormatter()
                formatter.timeStyle = .short
                return "\(baseStatus) • Last: \(formatter.string(from: lastSync))"
            } else {
                return baseStatus
            }
        } else {
            return baseStatus
        }
    }
    
    func getDebugInfo() -> [String: Any] {
        return [
            "enabled": isEnabled,
            "connected": syncState.isConnected,
            "status": syncState.status,
            "progress": syncState.progress,
            "documents_in_sync": syncState.documentsInSync,
            "last_sync": syncState.lastSyncTime?.timeIntervalSince1970 ?? 0,
            "error": syncState.error ?? "none",
            "replicator_active": isSyncActive,
            "sync_gateway_url": syncGatewayURL,
            "username": username
        ]
    }
    
    // MARK: - Cleanup
    deinit {
        print("🧹 Cleaning up AppServicesSyncManager...")
        
        stopSync()
        
        if let token = replicatorChangeToken {
            replicator?.removeChangeListener(withToken: token)
        }
        
        replicator = nil
    }
}

// MARK: - Sample Document Operations Extension
extension AppServicesSyncManager {
    
    /// Create a new liquor item that will sync to the cloud
    func createLiquorItem(name: String, type: String, price: Double, imageURL: String, quantity: Int = 0) -> String? {
        do {
            let collection = try database.collection(name: collectionName, scope: AppConfig.scopeName) 
                ?? database.createCollection(name: collectionName, scope: AppConfig.scopeName)
            
            let itemId = UUID().uuidString
            let document = MutableDocument(id: itemId)
            
            // Set document properties
            document.setString(itemId, forKey: "id")
            document.setString(name, forKey: "name")
            document.setString(type, forKey: "type")
            document.setDouble(price, forKey: "price")
            document.setString(imageURL, forKey: "imageURL")
            
            // Initialize CRDT counter for quantity
            let quantityCounter = document.crdtCounter(forKey: "quantity", actor: database.deviceUUID ?? "unknown")
            if quantity > 0 {
                quantityCounter.increment(by: UInt(quantity))
            }
            
            // Add metadata
            document.setDate(Date(), forKey: "created_at")
            document.setDate(Date(), forKey: "updated_at")
            document.setString("app_services", forKey: "sync_source")
            document.setString("liquor_item", forKey: "type")
            
            try collection.save(document: document)
            
            print("✅ Created liquor item for App Services sync: \(name) (ID: \(itemId))")
            
            // Trigger immediate sync if enabled
            if isEnabled {
                pushDocumentImmediately(itemId)
            }
            
            return itemId
            
        } catch {
            print("❌ Failed to create liquor item: \(error)")
            return nil
        }
    }
    
    /// Update quantity using CRDT counter (conflict-free)
    func updateLiquorItemQuantity(itemId: String, newQuantity: Int) -> Bool {
        do {
            let collection = try database.collection(name: collectionName, scope: AppConfig.scopeName) 
                ?? database.createCollection(name: collectionName, scope: AppConfig.scopeName)
            
            guard let document = try collection.document(id: itemId)?.toMutable() else {
                print("❌ Document not found: \(itemId)")
                return false
            }
            
            // Get current quantity from CRDT counter
            let quantityCounter = document.crdtCounter(forKey: "quantity", actor: database.deviceUUID ?? "unknown")
            let currentQuantity = quantityCounter.value
            let difference = newQuantity - currentQuantity
            
            // Apply the difference using CRDT operations
            if difference > 0 {
                quantityCounter.increment(by: UInt(difference))
            } else if difference < 0 {
                quantityCounter.decrement(by: UInt(-difference))
            }
            
            // Update metadata
            document.setDate(Date(), forKey: "updated_at")
            document.setString("app_services", forKey: "last_modified_by")
            
            try collection.save(document: document)
            
            print("✅ Updated quantity for \(itemId): \(currentQuantity) → \(newQuantity)")
            
            // Trigger immediate sync if enabled
            if isEnabled {
                pushDocumentImmediately(itemId)
            }
            
            return true
            
        } catch {
            print("❌ Failed to update quantity: \(error)")
            return false
        }
    }
}
