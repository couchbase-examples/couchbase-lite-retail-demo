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
    // Change this value to switch between stores
    static let currentStore: StoreLocation = .aa
    
    // MARK: - Capella App Services Configuration
    
    private static let baseURL = "wss://rmyrslbide2f0qwi.apps.cloud.couchbase.com:4984"
    
    static var syncGatewayURL: String {
        switch currentStore {
        case .aa:
            return "\(baseURL)/supermarket-aa"
        case .nyc:
            return "\(baseURL)/supermarket-nyc"
        }
    }
    
    static var username: String {
        switch currentStore {
        case .aa:
            return "aa-store-01@supermarket.com"
        case .nyc:
            return "nyc-store-01@supermarket.com"
        }
    }
    
    static var password: String {
        // Same password for both stores
        return "P@ssword1"
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
    static let databaseName = "LiquorInventoryDB"
    
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

