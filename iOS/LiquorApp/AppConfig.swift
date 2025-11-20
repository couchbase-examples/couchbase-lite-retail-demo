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
    static let currentStore: StoreLocation = .nyc
    
    // MARK: - Capella App Services Configuration (ENV/Info.plist DRIVEN)
    // Prefer Info.plist (via .xcconfig) or environment variables when running from Xcode
    private static let env = ProcessInfo.processInfo.environment
    private static let baseURL: String = env["CBL_BASE_URL"] ?? (Bundle.main.object(forInfoDictionaryKey: "CBL_BASE_URL") as? String ?? "")
    private static let aaDB: String = env["CBL_AA_DB"] ?? (Bundle.main.object(forInfoDictionaryKey: "CBL_AA_DB") as? String ?? "")
    private static let nycDB: String = env["CBL_NYC_DB"] ?? (Bundle.main.object(forInfoDictionaryKey: "CBL_NYC_DB") as? String ?? "")
    private static let aaUser: String = env["CBL_AA_USER"] ?? (Bundle.main.object(forInfoDictionaryKey: "CBL_AA_USER") as? String ?? "")
    private static let nycUser: String = env["CBL_NYC_USER"] ?? (Bundle.main.object(forInfoDictionaryKey: "CBL_NYC_USER") as? String ?? "")
    private static let passwordValue: String = env["CBL_PASSWORD"] ?? (Bundle.main.object(forInfoDictionaryKey: "CBL_PASSWORD") as? String ?? "")
    
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

