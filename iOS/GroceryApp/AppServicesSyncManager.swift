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
    /// One replicator per App Endpoint. The copilot's collections may live on a different
    /// endpoint than inventory, in which case both run concurrently against the same local
    /// database — which is fine, as long as no collection is served by both (see
    /// `AppConfig.copilotEndpointOwnsInventory`).
    private var replicators: [String: Replicator] = [:]
    private var replicatorChangeTokens: [ListenerToken] = []
    /// Per-endpoint status, merged into `syncState` so the UI keeps its single summary.
    private var endpointActivity: [String: Replicator.ActivityLevel] = [:]
    private let collectionName = AppConfig.collectionName

    /// Kept for source compatibility with callers that only care whether sync exists.
    private var replicator: Replicator? { replicators.values.first }

    /// Called the first time every replicator reaches idle, i.e. the initial pull has landed.
    ///
    /// This is what lets the copilot's vector indexes be built from synced data. Index
    /// creation is deliberately guarded on a collection having vectors — an index created
    /// against an empty collection can never train — so on a cold start with an empty
    /// database there is nothing to index until this fires.
    var onInitialSyncComplete: (() -> Void)?
    private var hasReportedInitialSync = false
    
    // MARK: - Sync Control
    private var isSyncActive = false
    private let syncQueue = DispatchQueue(label: "com.groceryapp.appsync", qos: .background)
    
    // MARK: - Init
    init(database: Database) {
        self.database = database
        print("🌐 AppServicesSyncManager initialized with database: \(database.name)")
        setupAppServicesSync()
    }
    
    // MARK: - Setup Methods
    private func setupAppServicesSync() {
        print("🔧 Setting up App Services sync configuration...")
        print("🔧 Scope: \(AppConfig.scopeName)")

        do {
            if AppConfig.usesSeparateCopilotEndpoint {
                // Inventory and the copilot's collections live on different App Endpoints,
                // so each gets its own replicator. The collection sets are disjoint by
                // construction — `AppConfig` decides which endpoint owns `inventory` —
                // because two replicators pulling one collection into the same local
                // collection would fight over every document.
                print("🔧 Two endpoints:")
                print("   inventory → \(syncGatewayURL)")
                print("      \(AppConfig.inventoryEndpointCollections.joined(separator: ", "))")
                print("   copilot   → \(AppConfig.copilotSyncGatewayURL)")
                print("      \(AppConfig.copilotEndpointCollections.joined(separator: ", "))")

                try addReplicator(label: "inventory",
                                  urlString: syncGatewayURL,
                                  collections: AppConfig.inventoryEndpointCollections,
                                  user: username, pass: password)
                try addReplicator(label: "copilot",
                                  urlString: AppConfig.copilotSyncGatewayURL,
                                  collections: AppConfig.copilotEndpointCollections,
                                  user: AppConfig.copilotUsername,
                                  pass: AppConfig.copilotPassword)
            } else {
                print("🔧 Single endpoint: \(syncGatewayURL)")
                print("🔧 Collections: \(AppConfig.allSyncedCollections.joined(separator: ", "))")
                try addReplicator(label: "all",
                                  urlString: syncGatewayURL,
                                  collections: AppConfig.allSyncedCollections,
                                  user: username, pass: password)
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

    /// Builds one replicator for `collections` against `urlString`.
    private func addReplicator(label: String, urlString: String, collections: [String],
                               user: String, pass: String) throws {
        guard let url = URL(string: urlString) else {
            throw NSError(domain: "Invalid sync gateway URL: \(urlString)", code: -1)
        }

        // CBL 4.x: each CollectionConfiguration now carries its own collection
        // (init(collection:)), and the full set is passed to the ReplicatorConfiguration
        // initializer — `config.addCollection(_:config:)` and
        // `ReplicatorConfiguration(target:)` were removed in 4.0.
        //
        // Note for anyone hitting a 'collection not found' sync error: the App Services
        // endpoint must also be configured to serve these collections, otherwise the
        // replicator reports them as missing on the remote.
        var collectionConfigs: [CollectionConfiguration] = []
        for name in collections {
            let collection = try database.collection(name: name, scope: AppConfig.scopeName)
                ?? database.createCollection(name: name, scope: AppConfig.scopeName)
            var collectionConfig = CollectionConfiguration(collection: collection)
            // Only inventory needs the CRDT resolver — it is the one collection with
            // concurrent counter updates. Everything else is default last-write-wins.
            if name == collectionName {
                collectionConfig.conflictResolver = GroceryCRDTConflictResolver.shared
            }
            collectionConfigs.append(collectionConfig)
        }

        var config = ReplicatorConfiguration(
            collections: collectionConfigs,
            target: URLEndpoint(url: url)
        )
        config.authenticator = BasicAuthenticator(username: user, password: pass)
        config.replicatorType = .pushAndPull
        config.continuous = true
        config.enableAutoPurge = false
        config.heartbeat = 60 // seconds
        config.maxAttempts = 10
        config.maxAttemptWaitTime = 300 // 5 minutes
        config.allowReplicatingInBackground = true

        let created = Replicator(config: config)
        let token = created.addChangeListener { [weak self] change in
            DispatchQueue.main.async {
                self?.handleReplicationChange(change, endpoint: label)
            }
        }
        replicators[label] = created
        replicatorChangeTokens.append(token)
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
        guard !replicators.isEmpty, !isSyncActive else {
            print("⚠️ Cannot start sync - replicator not available or already active")
            return
        }

        let toStart = replicators
        syncQueue.async { [weak self] in
            guard let self = self else { return }

            print("🌐 Starting \(toStart.count) App Services replicator(s)...")
            self.isSyncActive = true
            for (label, replicator) in toStart {
                print("   ▶︎ \(label)")
                replicator.start()
            }

            DispatchQueue.main.async {
                self.updateSyncState { state in
                    state.status = "☁️ Connecting to cloud..."
                }
            }
        }
    }

    private func stopSync() {
        guard !replicators.isEmpty, isSyncActive else { return }

        let toStop = replicators
        syncQueue.async { [weak self] in
            guard let self = self else { return }

            print("🛑 Stopping App Services replicator(s)...")
            for replicator in toStop.values { replicator.stop() }
            self.isSyncActive = false

            DispatchQueue.main.async {
                self.endpointActivity.removeAll()
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
    private func handleReplicationChange(_ change: ReplicatorChange, endpoint: String = "all") {
        let status = change.status
        let progress = status.progress

        print("📊 [\(endpoint)] sync change: \(status.activity) - \(progress.completed)/\(progress.total)")
        endpointActivity[endpoint] = status.activity

        // With two endpoints the summary reflects the least-settled one, so the UI does not
        // claim "sync ready" while the other endpoint is still connecting or offline.
        let activities = endpointActivity.values
        let aggregated: Replicator.ActivityLevel = {
            if activities.contains(.offline) { return .offline }
            if activities.contains(.connecting) { return .connecting }
            if activities.contains(.busy) { return .busy }
            if activities.contains(.stopped) && activities.allSatisfy({ $0 == .stopped }) {
                return .stopped
            }
            return activities.allSatisfy { $0 == .idle } ? .idle : .busy
        }()

        updateSyncState { state in
            // Update connection status
            state.isConnected = (aggregated == .busy || aggregated == .idle)
            
            // Update progress
            if progress.total > 0 {
                state.progress = Float(progress.completed) / Float(progress.total)
                state.documentsCompleted = Int(progress.completed)
                state.totalDocuments = Int(progress.total)
                state.documentsInSync = Int(progress.total)
            }
            
            // Update status based on activity
            switch aggregated {
            case .connecting:
                state.status = "☁️ Connecting to cloud..."
                
            case .busy:
                state.status = "☁️ Syncing... (\(progress.completed)/\(progress.total))"
                
            case .idle:
                state.status = "☁️ Cloud sync ready"
                state.lastSyncTime = Date()
                state.progress = 1.0
                // Every endpoint has settled, so synced documents are now on disk and the
                // vector indexes can be built from them. Fires once per session.
                if !hasReportedInitialSync {
                    hasReportedInitialSync = true
                    let callback = onInitialSyncComplete
                    DispatchQueue.main.async { callback?() }
                }
                
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
        
        for token in replicatorChangeTokens {
            token.remove()
        }
        replicatorChangeTokens.removeAll()
        replicators.removeAll()
    }
}

// MARK: - Sample Document Operations Extension
extension AppServicesSyncManager {
    
    /// Create a new grocery item that will sync to the cloud
    func createGroceryItem(name: String, type: String, price: Double, imageURL: String, quantity: Int = 0) -> String? {
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
            document.setString("grocery_item", forKey: "type")
            
            try collection.save(document: document)
            
            print("✅ Created grocery item for App Services sync: \(name) (ID: \(itemId))")
            
            // Trigger immediate sync if enabled
            if isEnabled {
                pushDocumentImmediately(itemId)
            }
            
            return itemId
            
        } catch {
            print("❌ Failed to create grocery item: \(error)")
            return nil
        }
    }
    
    /// Update quantity using CRDT counter (conflict-free)
    func updateGroceryItemQuantity(itemId: String, newQuantity: Int) -> Bool {
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
