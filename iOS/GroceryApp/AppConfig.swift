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

    // The copilot's App Endpoint. Falls back to the inventory endpoint when unset, so a
    // single-backend setup keeps working with no configuration at all.
    private static var copilotBaseURL: String {
        let value = configValue(for: "CBL_COPILOT_BASE_URL")
        return value.isEmpty ? baseURL : value
    }
    private static var copilotAADB: String {
        let value = configValue(for: "CBL_COPILOT_AA_DB")
        return value.isEmpty ? aaDB : value
    }
    private static var copilotNYCDB: String {
        let value = configValue(for: "CBL_COPILOT_NYC_DB")
        return value.isEmpty ? nycDB : value
    }
    private static var copilotUserValue: String {
        let value = configValue(for: currentStore == .aa
                                ? "CBL_COPILOT_AA_USER" : "CBL_COPILOT_NYC_USER")
        return value.isEmpty ? username : value
    }
    private static var copilotPasswordValue: String {
        let value = configValue(for: "CBL_COPILOT_PASSWORD")
        return value.isEmpty ? passwordValue : value
    }

    static var syncGatewayURL: String {
        switch currentStore {
        case .aa:
            return "\(baseURL)/\(aaDB)"
        case .nyc:
            return "\(baseURL)/\(nycDB)"
        }
    }

    /// Endpoint serving the copilot's collections.
    static var copilotSyncGatewayURL: String {
        switch currentStore {
        case .aa:
            return "\(copilotBaseURL)/\(copilotAADB)"
        case .nyc:
            return "\(copilotBaseURL)/\(copilotNYCDB)"
        }
    }

    static var copilotUsername: String { copilotUserValue }
    static var copilotPassword: String { copilotPasswordValue }

    /// True when the copilot's collections come from a different App Endpoint than
    /// inventory, which means two replicators rather than one.
    static var usesSeparateCopilotEndpoint: Bool {
        copilotSyncGatewayURL != syncGatewayURL
    }

    // MARK: - Which endpoint owns `inventory`
    //
    // `inventory` can only be replicated from ONE endpoint. Two replicators pulling the
    // same collection into the same local collection would each treat the other's writes
    // as remote changes and fight over every document.
    //
    // This matters because Step 1 searches `embedding.text.vector` ON inventory documents:
    //
    //   • `false` — inventory comes from the original endpoint. Safe for the existing app,
    //     but if that endpoint's inventory has no embeddings then semantic search finds
    //     nothing over synced data, and only the bundled seed works.
    //   • `true`  — inventory comes from the copilot endpoint, whose dataset is a superset
    //     (the data-model spec is explicitly additive, so every field the current app reads
    //     is still present). This is what makes Step 1 work against live sync.
    //
    // Set to `true` once the copilot endpoint is confirmed to serve the full inventory
    // superset. Until then the original endpoint keeps ownership and nothing regresses.
    static let copilotEndpointOwnsInventory: Bool = false

    /// Collections replicated from the inventory endpoint.
    static var inventoryEndpointCollections: [String] {
        var collections = [profileCollectionName, ordersCollectionName]
        if !copilotEndpointOwnsInventory { collections.insert(collectionName, at: 0) }
        return collections
    }

    /// Collections replicated from the copilot endpoint. When there is only one endpoint
    /// these are simply added to the single replicator.
    static var copilotEndpointCollections: [String] {
        var collections = [planogramsCollectionName, knowledgeCollectionName,
                           tasksCollectionName]
        if copilotEndpointOwnsInventory { collections.insert(collectionName, at: 0) }
        return collections
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

    /// Whether footwear leads the *demo script* — suggested queries, the default planogram,
    /// and example copy.
    ///
    /// The narrative is grocery-first, so this is `false`: the suggestions, the shelf the
    /// audit opens on, and the RAG prompts are all grocery. That is a presentation choice,
    /// not a data rule.
    ///
    /// Deliberately does NOT filter the data. Per the Jul 2026 discussion the app is
    /// generic — what it can find is decided by the documents and embeddings present, not by
    /// a hardcoded category list. A real associate searching a Target or Walmart-style store
    /// should be able to find a shoe if the store stocks one. So footwear stays searchable,
    /// retrievable and seeded; it simply is not what the demo leads with.
    ///
    /// Set to `true` to put footwear back in the scripted flow, which demonstrates the
    /// "same capability, new category" generality claim.
    static let footwearNarrativeEnabled: Bool = false

    /// Categories excluded from copilot queries.
    ///
    /// Empty by design — see `footwearNarrativeEnabled`. The hook is kept because the query
    /// builders read it, so a category can be suppressed for a specific demo without
    /// touching the query code, but the default is to hide nothing.
    static var hiddenCategories: [String] { [] }

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

