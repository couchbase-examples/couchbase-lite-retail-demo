package com.example.groceryapplication

import android.content.Context
import android.util.Log
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.couchbase.lite.*
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.net.URI
import java.util.*

// MARK: - App Services Sync State
data class AppServicesSyncState(
    val isConnected: Boolean = false,
    val status: String = "Disconnected",
    val lastSyncTime: Long? = null,
    val documentsInSync: Int = 0,
    val progress: Float = 0f,
    val error: String? = null,
    val totalDocuments: Int = 0,
    val documentsCompleted: Int = 0
)

// MARK: - App Services Sync Manager
class AppServicesSyncManager(
    private val context: Context,
    private val database: Database
) : ViewModel() {
    
    companion object {
        private const val TAG = "AppServicesSync"
    }
    
    // State management
    private val _syncState = MutableStateFlow(AppServicesSyncState())
    val syncState: StateFlow<AppServicesSyncState> = _syncState.asStateFlow()
    
    // Sync control
    var isEnabled by mutableStateOf(false)
        private set
    
    // Couchbase components
    private var replicator: Replicator? = null
    private var replicatorChangeToken: ListenerToken? = null
    private var isSyncActive = false
    
    // NOTE: No init block — sync setup is deferred to after login
    // so that AppConfig.currentStore is set to the correct user's store.
    
    // MARK: - Setup Methods
    
    /**
     * Synchronously sets up the replicator with current AppConfig values.
     * Stops any existing replicator first. Does NOT start replication —
     * call enableAppServices() or setupAndStartSync() for that.
     * Thread-safe: can be called from any thread.
     */
    @Synchronized
    fun setupAppServicesSync() {
        try {
            // Stop and clean up any existing replicator before reconfiguring
            stopSync()
            replicatorChangeToken?.let { replicator?.removeChangeListener(it) }
            replicator = null
            replicatorChangeToken = null
            
            Log.d(TAG, "🔧 Setting up App Services sync configuration...")
            Log.d(TAG, "🔧 Scope: ${AppConfig.scopeName}")
            Log.d(TAG, "🔧 URL: ${AppConfig.syncGatewayURL}")
            Log.d(TAG, "🔧 User: ${AppConfig.username}")
            Log.d(TAG, "🔧 Collections: inventory, profile, orders")
            
            // Get all collections from correct scope (matches Capella structure)
            val inventoryCollection = database.getCollection(AppConfig.COLLECTION_NAME, AppConfig.scopeName)
                ?: database.createCollection(AppConfig.COLLECTION_NAME, AppConfig.scopeName)
            
            val profileCollection = database.getCollection(AppConfig.PROFILE_COLLECTION_NAME, AppConfig.scopeName)
                ?: database.createCollection(AppConfig.PROFILE_COLLECTION_NAME, AppConfig.scopeName)
            
            val ordersCollection = database.getCollection(AppConfig.ORDERS_COLLECTION_NAME, AppConfig.scopeName)
                ?: database.createCollection(AppConfig.ORDERS_COLLECTION_NAME, AppConfig.scopeName)
            
            // Create target endpoint — read dynamically from AppConfig (not frozen companion vals)
            val syncUrl = AppConfig.syncGatewayURL
            Log.d(TAG, "📡 Connecting to: $syncUrl")
            val target = URLEndpoint(URI(syncUrl))
            
            // Create replicator configuration
            val config = ReplicatorConfiguration(target)
            
            // Configure authentication — read dynamically from AppConfig
            config.authenticator = BasicAuthenticator(AppConfig.username, AppConfig.password.toCharArray())
            
            // Configure replication type and behavior
            config.replicatorType = AbstractReplicatorConfiguration.ReplicatorType.PUSH_AND_PULL
            config.isContinuous = AppConfig.SYNC_CONTINUOUS
            config.heartbeat = AppConfig.SYNC_HEARTBEAT.toInt()
            config.maxAttempts = AppConfig.SYNC_MAX_ATTEMPTS
            config.maxAttemptWaitTime = AppConfig.SYNC_MAX_ATTEMPT_WAIT_TIME.toInt()
            
            // Add all collections to replication
            config.addCollection(inventoryCollection, null)
            config.addCollection(profileCollection, null)
            config.addCollection(ordersCollection, null)
            
            // Create replicator
            replicator = Replicator(config)
            
            // Add change listener
            replicatorChangeToken = replicator?.addChangeListener { change ->
                handleReplicationChange(change)
            }
            
            Log.d(TAG, "✅ App Services sync configured successfully")
            updateSyncState { state ->
                state.copy(status = "☁️ Ready to sync")
            }
            
        } catch (e: Exception) {
            Log.e(TAG, "❌ Failed to setup App Services sync", e)
            updateSyncState { state ->
                state.copy(
                    status = "Setup failed",
                    error = e.message
                )
            }
        }
    }
    
    /**
     * Convenience: sets up the replicator with current AppConfig AND immediately starts it.
     * Called from startSyncAfterLogin() to guarantee setup → start ordering.
     */
    @Synchronized
    fun setupAndStartSync() {
        setupAppServicesSync()
        enableAppServices()
    }
    
    // MARK: - Public Sync Control Methods
    @Synchronized
    fun enableAppServices() {
        // Idempotency: skip if replicator is already running.
        // Guarding on isSyncActive (not isEnabled) lets setupAndStartSync()
        // correctly start a freshly reconfigured replicator even when a
        // previous session left isEnabled = true.
        if (isSyncActive) {
            Log.d(TAG, "ℹ️ enableAppServices: sync already active, skipping")
            return
        }

        Log.d(TAG, "🚀 Enabling App Services sync...")
        isEnabled = true
        startSync()

        updateSyncState { state ->
            state.copy(status = "☁️ Starting cloud sync...")
        }
    }

    @Synchronized
    fun disableAppServices() {
        if (!isEnabled) return

        Log.d(TAG, "🛑 Disabling App Services sync...")
        isEnabled = false
        stopSync()

        updateSyncState { state ->
            state.copy(
                status = "☁️ Cloud sync stopped",
                isConnected = false
            )
        }
    }

    @Synchronized
    fun toggleAppServices() {
        if (isEnabled) {
            disableAppServices()
        } else {
            enableAppServices()
        }
    }

    @Synchronized
    private fun startSync() {
        replicator?.let { replicator ->
            if (!isSyncActive) {
                Log.d(TAG, "🌐 Starting App Services replicator...")
                isSyncActive = true
                replicator.start()

                updateSyncState { state ->
                    state.copy(status = "☁️ Connecting to cloud...")
                }
            }
        } ?: run {
            Log.e(TAG, "⚠️ Cannot start sync - replicator not available")
        }
    }

    @Synchronized
    private fun stopSync() {
        if (isSyncActive) {
            Log.d(TAG, "🛑 Stopping App Services replicator...")
            replicator?.stop()
            isSyncActive = false

            updateSyncState { state ->
                state.copy(
                    status = "☁️ Sync stopped",
                    isConnected = false
                )
            }
        }
    }

    @Synchronized
    fun resetSync() {
        Log.d(TAG, "🔄 Resetting App Services sync...")

        stopSync()

        // Restart after a delay, but only if sync is still enabled.
        // The user may have explicitly disabled sync during the delay window.
        viewModelScope.launch {
            kotlinx.coroutines.delay(1000)
            if (isEnabled) startSync()
            else Log.d(TAG, "ℹ️ resetSync: sync was disabled during delay, skipping restart")
        }

        updateSyncState { state ->
            state.copy(
                status = "☁️ Resetting sync...",
                progress = 0f,
                error = null
            )
        }
    }
    
    // MARK: - Replication Event Handling
    private fun handleReplicationChange(change: ReplicatorChange) {
        val status = change.status
        val progress = status.progress
        
        Log.d(TAG, "📊 App Services sync change: ${status.activityLevel} - ${progress.completed}/${progress.total}")
        
        updateSyncState { state ->
            // Update connection status
            val isConnected = (status.activityLevel == ReplicatorActivityLevel.BUSY || 
                             status.activityLevel == ReplicatorActivityLevel.IDLE)
            
            // Update progress
            val progressValue = if (progress.total > 0) {
                progress.completed.toFloat() / progress.total.toFloat()
            } else 0f
            
            // Update status based on activity
            val statusMessage = when (status.activityLevel) {
                ReplicatorActivityLevel.CONNECTING -> "☁️ Connecting to cloud..."
                ReplicatorActivityLevel.BUSY -> "☁️ Syncing... (${progress.completed}/${progress.total})"
                ReplicatorActivityLevel.IDLE -> "☁️ Cloud sync ready"
                ReplicatorActivityLevel.STOPPED -> "☁️ Sync stopped"
                ReplicatorActivityLevel.OFFLINE -> "☁️ Cloud offline"
            }
            
            var newState = state.copy(
                isConnected = isConnected,
                status = statusMessage,
                progress = progressValue,
                documentsCompleted = progress.completed.toInt(),
                totalDocuments = progress.total.toInt(),
                documentsInSync = progress.total.toInt()
            )
            
            // Update last sync time for idle state
            if (status.activityLevel == ReplicatorActivityLevel.IDLE) {
                newState = newState.copy(
                    lastSyncTime = System.currentTimeMillis(),
                    progress = 1f
                )
            }
            
            // Handle errors
            status.error?.let { error ->
                Log.e(TAG, "❌ App Services sync error: $error")
                
                val errorMessage = when ((error as? Exception)?.message) {
                    null -> "Unknown sync error"
                    else -> when {
                        error.message?.contains("network", ignoreCase = true) == true -> 
                            "Network error - will retry"
                        error.message?.contains("auth", ignoreCase = true) == true -> 
                            "Authentication failed"
                        error.message?.contains("forbidden", ignoreCase = true) == true -> 
                            "Access denied"
                        error.message?.contains("not found", ignoreCase = true) == true -> 
                            "Database not found"
                        else -> "Sync error: ${error.message}"
                    }
                }
                
                newState = newState.copy(
                    status = "☁️ $errorMessage",
                    error = error.message,
                    isConnected = false
                )
            } ?: run {
                newState = newState.copy(error = null)
            }
            
            newState
        }
    }
    
    // MARK: - Document Operations
    fun pushDocumentImmediately(documentId: String) {
        if (!isEnabled || replicator == null) {
            Log.w(TAG, "⚠️ Cannot push document - sync not enabled")
            return
        }
        
        Log.d(TAG, "📤 Triggering immediate push for document: $documentId")
        
        // The document will be automatically picked up by the continuous replicator
        if (!isSyncActive) {
            startSync()
        }
    }
    
    fun createGroceryItem(name: String, type: String, price: Double, imageURL: String, quantity: Int = 0): String? {
        return try {
            val collection = database.getCollection(AppConfig.COLLECTION_NAME, AppConfig.scopeName) 
                ?: database.createCollection(AppConfig.COLLECTION_NAME, AppConfig.scopeName)
            
            val itemId = UUID.randomUUID().toString()
            val document = MutableDocument(itemId)
            
            // Set document properties
            document.setString("id", itemId)
            document.setString("name", name)
            document.setString("type", type)
            document.setDouble("price", price)
            document.setString("imageURL", imageURL)
            document.setInt("quantity", quantity)
            document.setString("document_type", "grocery_item")
            
            // Add metadata
            document.setLong("created_at", System.currentTimeMillis() / 1000)
            document.setLong("updated_at", System.currentTimeMillis() / 1000)
            document.setString("sync_source", "app_services")
            
            collection.save(document)
            
            Log.d(TAG, "✅ Created grocery item for App Services sync: $name (ID: $itemId)")
            
            // Trigger immediate sync if enabled
            if (isEnabled) {
                pushDocumentImmediately(itemId)
            }
            
            itemId
            
        } catch (e: Exception) {
            Log.e(TAG, "❌ Failed to create grocery item", e)
            null
        }
    }
    
    fun updateGroceryItemQuantity(itemId: String, newQuantity: Int): Boolean {
        return try {
            val collection = database.getCollection(AppConfig.COLLECTION_NAME, AppConfig.scopeName) 
                ?: database.createCollection(AppConfig.COLLECTION_NAME, AppConfig.scopeName)
            
            val document = collection.getDocument(itemId)?.toMutable() ?: run {
                Log.e(TAG, "❌ Document not found: $itemId")
                return false
            }
            
            // Update quantity and metadata
            document.setInt("quantity", newQuantity)
            document.setLong("updated_at", System.currentTimeMillis() / 1000)
            document.setString("last_modified_by", "app_services")
            
            collection.save(document)
            
            Log.d(TAG, "✅ Updated quantity for $itemId to $newQuantity")
            
            // Trigger immediate sync if enabled
            if (isEnabled) {
                pushDocumentImmediately(itemId)
            }
            
            true
            
        } catch (e: Exception) {
            Log.e(TAG, "❌ Failed to update quantity", e)
            false
        }
    }
    
    // MARK: - DNS Resolution Helper
    private suspend fun resolveHostToIPs(hostname: String): List<String> {
        return withContext(Dispatchers.IO) {
            try {
                val addresses = java.net.InetAddress.getAllByName(hostname)
                val ips = addresses.map { it.hostAddress }.filterNotNull()
                Log.d(TAG, "🔍 Resolved $hostname to IPs: ${ips.joinToString(", ")}")
                ips
            } catch (e: Exception) {
                Log.w(TAG, "❌ Failed to resolve $hostname: ${e.message}")
                emptyList()
            }
        }
    }
    
    // MARK: - Network Connectivity Testing
    private suspend fun testNetworkConnectivity() {
        try {
            val hostname = "orqhtoi5jy2tbev.apps.cloud.couchbase.com"
            Log.d(TAG, "🔍 Testing network connectivity...")
            Log.d(TAG, "🌐 Target hostname: $hostname")
            
            // Test basic internet connectivity first
            withContext(Dispatchers.IO) {
                try {
                    // Test multiple DNS servers to ensure internet is working
                    val dnsServers = listOf("8.8.8.8", "1.1.1.1", "8.8.4.4")
                    var dnsWorking = false
                    
                    for (dns in dnsServers) {
                        try {
                            java.net.InetAddress.getAllByName(dns)
                            Log.d(TAG, "✅ Internet connectivity confirmed ($dns reachable)")
                            dnsWorking = true
                            break
                        } catch (e: Exception) {
                            Log.w(TAG, "⚠️ DNS server $dns not reachable: ${e.message}")
                        }
                    }
                    
                    if (!dnsWorking) {
                        Log.e(TAG, "❌ No DNS servers reachable - network might be down")
                    }
                    
                    // Test general connectivity to couchbase.com
                    try {
                        val couchbaseAddresses = java.net.InetAddress.getAllByName("couchbase.com")
                        Log.d(TAG, "✅ Couchbase.com is reachable (${couchbaseAddresses.size} addresses)")
                    } catch (e: Exception) {
                        Log.w(TAG, "⚠️ Cannot reach couchbase.com: ${e.message}")
                    }
                    
                    // Now test our specific hostname
                    val addresses = java.net.InetAddress.getAllByName(hostname)
                    Log.d(TAG, "✅ DNS resolved to ${addresses.size} addresses:")
                    addresses.forEach { addr ->
                        Log.d(TAG, "   📍 ${addr.hostAddress}")
                    }
                    
                } catch (e: Exception) {
                    Log.e(TAG, "❌ DNS resolution failed for $hostname: ${e.message}")
                    
                    // Try alternative approaches
                    Log.d(TAG, "🔄 Trying alternative connectivity test...")
                    
                    // Skip DNS test and proceed (maybe DNS is slow but connection will work)
                    Log.w(TAG, "⚠️ Proceeding despite DNS test failure - connection might still work")
                    return@withContext
                }
            }
            
            Log.d(TAG, "✅ Network connectivity test passed")
        } catch (e: Exception) {
            Log.e(TAG, "❌ Network connectivity test failed: ${e.message}")
            Log.w(TAG, "⚠️ Continuing anyway - sync might still work")
            
            // Don't throw the exception - let sync attempt proceed
            updateSyncState { current ->
                current.copy(
                    error = "Network test failed, but trying sync anyway: ${e.message}",
                    status = "Testing Connection"
                )
            }
        }
    }
    
    // MARK: - Helper Methods
    private fun updateSyncState(update: (AppServicesSyncState) -> AppServicesSyncState) {
        _syncState.value = update(_syncState.value)
    }
    
    // MARK: - Status Information
    fun getSyncStatusSummary(): String {
        if (!isEnabled) {
            return "App Services sync disabled"
        }
        
        val currentState = _syncState.value
        val baseStatus = currentState.status
        
        return if (currentState.isConnected && currentState.lastSyncTime != null) {
            val time = java.text.SimpleDateFormat("HH:mm:ss", java.util.Locale.getDefault())
                .format(Date(currentState.lastSyncTime))
            "$baseStatus • Last: $time"
        } else {
            baseStatus
        }
    }
    
    fun getDebugInfo(): Map<String, Any> {
        val currentState = _syncState.value
        return mapOf(
            "enabled" to isEnabled,
            "connected" to currentState.isConnected,
            "status" to currentState.status,
            "progress" to currentState.progress,
            "documents_in_sync" to currentState.documentsInSync,
            "last_sync" to (currentState.lastSyncTime ?: 0),
            "error" to (currentState.error ?: "none"),
            "replicator_active" to isSyncActive,
            "sync_gateway_url" to AppConfig.syncGatewayURL,
            "username" to AppConfig.username
        )
    }
    
    // MARK: - Cleanup
    override fun onCleared() {
        super.onCleared()
        Log.d(TAG, "🧹 Cleaning up AppServicesSyncManager...")
        
        stopSync()
        
        replicatorChangeToken?.let { token ->
            replicator?.removeChangeListener(token)
        }
        
        replicator = null
    }
}
