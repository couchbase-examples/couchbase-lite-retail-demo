import Foundation

// MARK: - Store Configuration
enum StoreLocation: String, CaseIterable {
    case aa = "aa"
    case nyc = "nyc"
    
    var displayName: String {
        switch self {
        case .aa: return "Ann Arbor Store"
        case .nyc: return "New York City Store"
        }
    }
}

// MARK: - App Configuration
struct AppConfig {

    // MARK: - Current Store Selection
    //
    // Lazily initialized from UserDefaults on first access so cold starts
    // with a persisted session see the correct scope BEFORE DatabaseManager
    // opens the database. Without this, DatabaseManager.init() would spot
    // a mismatch between the default (.nyc) and the store last used by the
    // signed-in user, and spuriously purge the local data.
    //
    // The didSet re-persists to UserDefaults, so callers can simply write
    // `AppConfig.currentStore = .aa` after login and be done.
    private static let persistedStoreKey = "AppConfig.persistedCurrentStore"

    static var currentStore: StoreLocation = {
        if let raw = UserDefaults.standard.string(forKey: persistedStoreKey),
           let loc = StoreLocation(rawValue: raw) {
            return loc
        }
        return .nyc
    }() {
        didSet {
            UserDefaults.standard.set(currentStore.rawValue, forKey: persistedStoreKey)
        }
    }

    /// Maps an authenticated username to its corresponding store.
    /// Credentials in this demo are prefixed with "aa-" or "nyc-";
    /// callers get a single, consistent resolution rule instead of
    /// copying the same `username.contains(...)` check in multiple places.
    static func store(for username: String) -> StoreLocation {
        let lowered = username.lowercased()
        if lowered.contains("aa-store") {
            return .aa
        }
        return .nyc
    }
    
    // MARK: - Capella App Services Configuration (ENV/Info.plist DRIVEN)
    // Prefer environment variables, then Info.plist. Computed each time
    // (not lazy-stored) so an Info.plist populated after the first access
    // during test setup still resolves correctly.
    private static func configValue(for key: String) -> String {
        ProcessInfo.processInfo.environment[key]
            ?? (Bundle.main.object(forInfoDictionaryKey: key) as? String ?? "")
    }

    private static var baseURL: String       { configValue(for: "CBL_BASE_URL") }
    private static var aaDB: String          { configValue(for: "CBL_AA_DB") }
    private static var nycDB: String         { configValue(for: "CBL_NYC_DB") }
    private static var aaUser: String        { configValue(for: "CBL_AA_USER") }
    private static var nycUser: String       { configValue(for: "CBL_NYC_USER") }
    private static var passwordValue: String { configValue(for: "CBL_PASSWORD") }
    
    static var syncGatewayURL: String {
        switch currentStore {
        case .aa:
            return "\(baseURL)/\(aaDB)"
        case .nyc:
            return "\(baseURL)/\(nycDB)"
        }
    }
    
    static var username: String {
        switch currentStore {
        case .aa:
            return aaUser
        case .nyc:
            return nycUser
        }
    }
    
    static var password: String {
        return passwordValue
    }
    
    static var storeId: String {
        switch currentStore {
        case .aa:
            return "aa-store-01"
        case .nyc:
            return "nyc-store-01"
        }
    }
    
    // MARK: - Database Configuration
    static let databaseName = "GroceryInventoryDB"
    
    // Capella Collection Configuration (matches server-side setup)
    static var scopeName: String {
        switch currentStore {
        case .aa:
            return "AA-Store"
        case .nyc:
            return "NYC-Store"
        }
    }
    
    static let collectionName = "inventory"  // Main inventory collection
    static let ordersCollectionName = "orders"  // Orders collection
    static let profileCollectionName = "profile"  // Store profile collection

    // Collections added by the edge vector search / copilot extension.
    // These sit in the existing per-store scopes and sync under the existing
    // single App User per store — no new roles, users, or channels.
    static let planogramsCollectionName = "planograms"          // Step 2: shelf audit
    static let knowledgeCollectionName = "product_knowledge"    // Step 3: RAG source chunks
    static let tasksCollectionName = "tasks"                    // Request Help

    /// Every collection the replicator should carry, in a single list so the sync
    /// manager and the local seeder cannot drift apart.
    static var allSyncedCollections: [String] {
        [collectionName, profileCollectionName, ordersCollectionName,
         planogramsCollectionName, knowledgeCollectionName, tasksCollectionName]
    }
    
    // MARK: - Sync Configuration (Event-Driven, Real-Time)
    // NOTE: "Continuous" sync is EVENT-DRIVEN, not polling!
    // - Keeps WebSocket connection open to Capella
    // - Changes are pushed/pulled IMMEDIATELY when they occur
    // - No polling or timers - true real-time bidirectional sync
    static let syncHeartbeat: UInt16 = 60 // WebSocket keepalive (not data polling!)
    static let syncMaxAttempts: Int = 10
    static let syncMaxAttemptWaitTime: TimeInterval = 300 // 5 minutes
    static let syncContinuous: Bool = true // TRUE = Event-driven real-time sync
    static let syncAllowBackground: Bool = true
    
    // MARK: - Feature Flags
    static let enableAppServicesSync: Bool = true
    static let enableP2PSync: Bool = true
    static let enableAutoDataSeeding: Bool = false // DISABLED: No more hard-coded data

    // MARK: - Store Associate Copilot (edge vector search)

    /// Seeds the bundled extended dataset into the local database when a collection
    /// comes up empty. This exists so the copilot can be built, demoed and explored
    /// with no Capella backend at all — the extended dataset is not in Capella yet,
    /// and a developer picking this app up should not need a cloud account to see
    /// vector search work. Documents that arrive over App Services supersede the
    /// seeded copies normally, since they carry the same document IDs.
    static let enableLocalDatasetSeeding: Bool = true

    /// Whether the Footwear category appears anywhere in the copilot.
    ///
    /// The demo narrative is grocery-first, and per review feedback (Jul 2026) the copilot
    /// should not surface footwear at all — the point is semantic search over the store's
    /// real grocery catalogue, and a shoe wall in a supermarket reads as contrived.
    ///
    /// Set this to `true` to restore the proposal's "same capability, new category" story,
    /// which demonstrates that the design generalizes to any retail vertical. Nothing is
    /// deleted to turn it off: the footwear documents, their vectors, their planograms and
    /// their knowledge chunks all remain in the dataset and the tooling still generates them.
    ///
    /// When `false` this controls two things — the copilot excludes the Footwear category
    /// from search, knowledge retrieval and the shelf list, and the local demo seeder omits
    /// footwear documents so a backend-free run is entirely grocery. Footwear documents that
    /// arrive over App Services are not removed; they simply are not featured.
    static let footwearNarrativeEnabled: Bool = false

    /// Categories the copilot hides. Empty unless the footwear narrative is switched off.
    static var hiddenCategories: [String] {
        footwearNarrativeEnabled ? [] : ["Footwear"]
    }

    /// Cosine-distance ceiling for a result to count as relevant.
    ///
    /// NOT the spec's hardcoded 0.35 — that was written before real vectors existed.
    /// Measured against the actual MiniLM corpus, the hero query's best match sits at
    /// 0.24 and the 5th percentile of all 104 documents is 0.57, so 0.35 would surface
    /// only 2 documents and drop legitimate near-misses. 0.60 keeps the relevant set
    /// and still excludes the bulk of the catalogue (median distance 0.81).
    /// Tunable at runtime from the copilot's behind-the-scenes screen.
    static let defaultRelevanceThreshold: Double = 0.60

    /// How many candidates a vector query returns before threshold filtering.
    static let copilotSearchLimit: Int = 10

    /// Chunks fed to the on-device SLM for RAG answers.
    static let copilotRAGChunkCount: Int = 4
    
    // MARK: - Debug Configuration
    static let debugLogging: Bool = true
    
    // MARK: - Helper Methods
    
    static func printConfiguration() {
        print("📋 ========================================")
        print("📋 App Configuration")
        print("📋 ========================================")
        print("📋 Store: \(currentStore.displayName)")
        print("📋 Sync URL: \(syncGatewayURL)")
        print("📋 Username: \(username)")
        print("📋 Store ID: \(storeId)")
        print("📋 Database: \(databaseName)")
        print("📋 Scope: \(scopeName)")
        print("📋 Collections: \(collectionName), \(ordersCollectionName), \(profileCollectionName)")
        print("📋 App Services Sync: \(enableAppServicesSync ? "✅ Enabled" : "❌ Disabled")")
        print("📋 P2P Sync: \(enableP2PSync ? "✅ Enabled" : "❌ Disabled")")
        print("📋 Auto Data Seeding: \(enableAutoDataSeeding ? "✅ Enabled" : "❌ Disabled")")
        print("📋 ========================================")
    }
    
    static func getEnvironmentInfo() -> [String: Any] {
        return [
            "store": currentStore.rawValue,
            "store_name": currentStore.displayName,
            "sync_url": syncGatewayURL,
            "username": username,
            "store_id": storeId,
            "database": databaseName,
            "collection": collectionName,
            "app_services_enabled": enableAppServicesSync,
            "p2p_enabled": enableP2PSync,
            "auto_seeding_enabled": enableAutoDataSeeding
        ]
    }
}

