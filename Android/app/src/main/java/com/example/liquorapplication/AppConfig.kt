package com.example.liquorapplication

import android.util.Log

/**
 * Store Configuration
 */
enum class StoreLocation(val displayName: String) {
    AA("Ann Arbor Store"),
    NYC("New York City Store")
}

/**
 * Centralized App Configuration
 * Matches iOS AppConfig for consistency
 */
object AppConfig {
    
    // MARK: - Current Store Selection
    // Change this value to switch between stores
    val currentStore: StoreLocation = StoreLocation.AA
    
    // MARK: - Capella App Services Configuration
    
    private const val BASE_URL = "wss://rmyrslbide2f0qwi.apps.cloud.couchbase.com:4984"
    
    val syncGatewayURL: String
        get() = when (currentStore) {
            StoreLocation.AA -> "$BASE_URL/supermarket-aa"
            StoreLocation.NYC -> "$BASE_URL/supermarket-nyc"
        }
    
    val username: String
        get() = when (currentStore) {
            StoreLocation.AA -> "aa-store-01@supermarket.com"
            StoreLocation.NYC -> "nyc-store-01@supermarket.com"
        }
    
    val password: String
        get() = "P@ssword1" // Same password for both stores
    
    val storeId: String
        get() = when (currentStore) {
            StoreLocation.AA -> "aa-store-01"
            StoreLocation.NYC -> "nyc-store-01"
        }
    
    // MARK: - Database Configuration
    const val DATABASE_NAME = "LiquorInventoryDB"
    
    // Capella Collection Configuration (matches server-side setup)
    val scopeName: String
        get() = when (currentStore) {
            StoreLocation.AA -> "AA-Store"
            StoreLocation.NYC -> "NYC-Store"
        }
    
    const val COLLECTION_NAME = "inventory"  // Main inventory collection
    const val ORDERS_COLLECTION_NAME = "orders"  // Orders collection
    const val PROFILE_COLLECTION_NAME = "profile"  // Store profile collection
    
    // MARK: - Sync Configuration (Event-Driven, Real-Time)
    // NOTE: "Continuous" sync is EVENT-DRIVEN, not polling!
    // - Keeps WebSocket connection open to Capella
    // - Changes are pushed/pulled IMMEDIATELY when they occur
    // - No polling or timers - true real-time bidirectional sync
    const val SYNC_HEARTBEAT: Long = 60 // WebSocket keepalive (not data polling!)
    const val SYNC_MAX_ATTEMPTS = 10
    const val SYNC_MAX_ATTEMPT_WAIT_TIME: Long = 300 // 5 minutes
    const val SYNC_CONTINUOUS = true // TRUE = Event-driven real-time sync
    const val SYNC_ALLOW_BACKGROUND = true
    
    // MARK: - Feature Flags
    const val ENABLE_APP_SERVICES_SYNC = true
    const val ENABLE_P2P_SYNC = true
    const val ENABLE_AUTO_DATA_SEEDING = false // DISABLED: No more hard-coded data
    
    // MARK: - Debug Configuration
    const val DEBUG_LOGGING = true
    
    // MARK: - Helper Methods
    
    fun printConfiguration() {
        Log.d("AppConfig", "📋 ========================================")
        Log.d("AppConfig", "📋 App Configuration")
        Log.d("AppConfig", "📋 ========================================")
        Log.d("AppConfig", "📋 Store: ${currentStore.displayName}")
        Log.d("AppConfig", "📋 Sync URL: $syncGatewayURL")
        Log.d("AppConfig", "📋 Username: $username")
        Log.d("AppConfig", "📋 Store ID: $storeId")
        Log.d("AppConfig", "📋 Database: $DATABASE_NAME")
        Log.d("AppConfig", "📋 Scope: $scopeName")
        Log.d("AppConfig", "📋 Collections: $COLLECTION_NAME, $ORDERS_COLLECTION_NAME, $PROFILE_COLLECTION_NAME")
        Log.d("AppConfig", "📋 App Services Sync: ${if (ENABLE_APP_SERVICES_SYNC) "✅ Enabled" else "❌ Disabled"}")
        Log.d("AppConfig", "📋 P2P Sync: ${if (ENABLE_P2P_SYNC) "✅ Enabled" else "❌ Disabled"}")
        Log.d("AppConfig", "📋 Auto Data Seeding: ${if (ENABLE_AUTO_DATA_SEEDING) "✅ Enabled" else "❌ Disabled"}")
        Log.d("AppConfig", "📋 ========================================")
    }
    
    fun getEnvironmentInfo(): Map<String, Any> {
        return mapOf(
            "store" to currentStore.name,
            "store_name" to currentStore.displayName,
            "sync_url" to syncGatewayURL,
            "username" to username,
            "store_id" to storeId,
            "database" to DATABASE_NAME,
            "scope" to scopeName,
            "collection" to COLLECTION_NAME,
            "app_services_enabled" to ENABLE_APP_SERVICES_SYNC,
            "p2p_enabled" to ENABLE_P2P_SYNC,
            "auto_seeding_enabled" to ENABLE_AUTO_DATA_SEEDING
        )
    }
}

