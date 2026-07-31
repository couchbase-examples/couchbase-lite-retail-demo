package com.example.groceryapplication

import android.util.Log
import com.example.groceryapplication.BuildConfig

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
    // Set dynamically at login based on user credentials
    var currentStore: StoreLocation = StoreLocation.NYC
        private set
    
    fun setStoreForUser(username: String) {
        currentStore = when {
            username.lowercase().startsWith("aa-") -> StoreLocation.AA
            username.lowercase().startsWith("nyc-") -> StoreLocation.NYC
            else -> {
                Log.w("AppConfig", "⚠️ Unknown user prefix for: $username, defaulting to NYC")
                StoreLocation.NYC
            }
        }
        Log.d("AppConfig", "🏪 Store set to ${currentStore.displayName} for user: $username")
    }
    
    // MARK: - Capella App Services Configuration (ENV-DRIVEN)
    // Values are injected via BuildConfig (from Gradle properties or env vars)
    private val BASE_URL: String = BuildConfig.CBL_BASE_URL
    private val AA_DB: String = BuildConfig.CBL_AA_DB
    private val NYC_DB: String = BuildConfig.CBL_NYC_DB
    private val AA_USER: String = BuildConfig.CBL_AA_USER
    private val NYC_USER: String = BuildConfig.CBL_NYC_USER
    private val PASSWORD: String = BuildConfig.CBL_PASSWORD
    
    val syncGatewayURL: String
        get() = when (currentStore) {
            StoreLocation.AA -> "$BASE_URL/$AA_DB"
            StoreLocation.NYC -> "$BASE_URL/$NYC_DB"
        }
    
    val username: String
        get() = when (currentStore) {
            StoreLocation.AA -> AA_USER
            StoreLocation.NYC -> NYC_USER
        }
    
    val password: String
        get() = PASSWORD
    
    val storeId: String
        get() = when (currentStore) {
            StoreLocation.AA -> "aa-store-01"
            StoreLocation.NYC -> "nyc-store-01"
        }
    
    // MARK: - Database Configuration
    const val DATABASE_NAME = "GroceryInventoryDB"
    
    // Capella Collection Configuration (matches server-side setup)
    val scopeName: String
        get() = when (currentStore) {
            StoreLocation.AA -> "AA-Store"
            StoreLocation.NYC -> "NYC-Store"
        }
    
    const val COLLECTION_NAME = "inventory"  // Main inventory collection
    const val ORDERS_COLLECTION_NAME = "orders"  // Orders collection
    const val PROFILE_COLLECTION_NAME = "profile"  // Store profile collection

    // Collections added by the edge vector search / copilot extension. These sit in the
    // existing per-store scopes and sync under the existing single App User per store —
    // additive channel configuration, not an access-model change.
    const val PLANOGRAMS_COLLECTION_NAME = "planograms"          // Step 2: shelf audit
    const val KNOWLEDGE_COLLECTION_NAME = "product_knowledge"    // Step 3: RAG source chunks
    const val TASKS_COLLECTION_NAME = "tasks"                    // Request Help

    /**
     * Every collection the replicator should carry, in one list so the sync manager and the
     * local seeder cannot drift apart.
     */
    val allSyncedCollections: List<String>
        get() = listOf(
            COLLECTION_NAME, PROFILE_COLLECTION_NAME, ORDERS_COLLECTION_NAME,
            PLANOGRAMS_COLLECTION_NAME, KNOWLEDGE_COLLECTION_NAME, TASKS_COLLECTION_NAME
        )

    // MARK: - Store Associate Copilot (edge vector search)

    /**
     * Seeds the bundled extended dataset into the local database when a collection comes up
     * empty.
     *
     * **Off, because Capella is now the source of truth.** The App Endpoint serves all six
     * collections with real MiniLM embeddings, so the app pulls everything over the
     * replicator. Leaving this on was not wrong — synced documents carry the same IDs and
     * supersede seeded ones — but it wrote a redundant revision to every document and made it
     * impossible to tell from the UI whether sync was actually working.
     *
     * Set to `true` to work with no backend at all: useful offline, and a reasonable fallback
     * if the free-tier cluster has hibernated, since a hibernated backend with seeding off
     * means an empty inventory rather than a stale one.
     */
    const val ENABLE_LOCAL_DATASET_SEEDING = false

    /**
     * Cosine-distance ceiling for a result to count as relevant.
     *
     * Not the data-model spec's hardcoded 0.35 — that predates real vectors. Measured against
     * the actual MiniLM corpus, the hero query's best match sits at 0.24 and the 5th
     * percentile of all documents at 0.57, so 0.35 would surface almost nothing. Matches the
     * iOS default; note the bundled int8 model reads roughly 0.02 higher than iOS's fp16
     * CoreML model for the same query, which this threshold comfortably absorbs.
     */
    const val DEFAULT_RELEVANCE_THRESHOLD = 0.60

    /** How many candidates a vector query returns before threshold filtering. */
    const val COPILOT_SEARCH_LIMIT = 10

    /** Chunks retrieved for a grounded answer. */
    const val COPILOT_RAG_CHUNK_COUNT = 4

    /**
     * Whether footwear leads the demo script — suggested queries and example copy.
     *
     * The narrative is grocery-first, so this is false. It is a presentation choice, not a
     * data rule: footwear stays searchable and seeded, because what the app can find is
     * decided by the documents and embeddings present, not by a hardcoded category list.
     */
    const val FOOTWEAR_NARRATIVE_ENABLED = false
    
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
    
    // MARK: - P2P (Peer-to-Peer) Configuration
    // MultipeerReplicator settings for local device-to-device sync
    // NOTE: This MUST match iOS peer group ID for cross-platform sync!
    const val P2P_PEER_GROUP_ID = "com.example.groceryapp"  // Network identifier for discovering peers (matches iOS)
    const val P2P_IDENTITY_LABEL = "com.example.groceryapp.p2p.identity"  // TLS identity label
    const val P2P_AUTO_START = true  // Auto-start P2P sync on app launch
    
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

