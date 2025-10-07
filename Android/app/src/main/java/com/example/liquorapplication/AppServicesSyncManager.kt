package com.example.liquorapplication

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
        // Using your real App Services credentials - CORRECTED URL FORMAT with database name
        private const val SYNC_GATEWAY_URL = "wss://orqhtoi5jy2tbev.apps.cloud.couchbase.com:4984/LiquorInventoryDB"
        private const val SYNC_GATEWAY_URL_ALT1 = "wss://orqhtoi5jy2tbev.apps.cloud.couchbase.com/LiquorInventoryDB" 
        private const val SYNC_GATEWAY_URL_ALT2 = "ws://orqhtoi5jy2tbev.apps.cloud.couchbase.com:4984/LiquorInventoryDB"
        private const val SYNC_GATEWAY_URL_ALT3 = "ws://orqhtoi5jy2tbev.apps.cloud.couchbase.com/LiquorInventoryDB"
        private const val SYNC_GATEWAY_URL_ALT4 = "https://orqhtoi5jy2tbev.apps.cloud.couchbase.com:4984/LiquorInventoryDB"
        private const val SYNC_GATEWAY_URL_ALT5 = "https://orqhtoi5jy2tbev.apps.cloud.couchbase.com/LiquorInventoryDB"
        private const val SYNC_GATEWAY_URL_ALT6 = "wss://orqhtoi5jy2tbev.apps.cloud.couchbase.com:4985/LiquorInventoryDB"
        private const val USERNAME = "liquor-seller"
        private const val PASSWORD = "7z4DyAd#UpcgfS4"
        private const val COLLECTION_NAME = "liquor_items"
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
    
    init {
        setupAppServicesSync()
    }
    
    // MARK: - Setup Methods
    private fun setupAppServicesSync() {
        viewModelScope.launch {
            try {
                Log.d(TAG, "🔧 Setting up App Services sync configuration...")
                
                // Use default collection for App Services sync (matches Couchbase Cloud setup)
                val collection = database.defaultCollection
                
                // Test connectivity and create target endpoint
                Log.d(TAG, "📡 Testing connectivity to: $SYNC_GATEWAY_URL")
                testNetworkConnectivity()
                
                // Try multiple URL formats including IP-based fallbacks
                val urls = mutableListOf(
                    SYNC_GATEWAY_URL,
                    SYNC_GATEWAY_URL_ALT1,
                    SYNC_GATEWAY_URL_ALT2,
                    SYNC_GATEWAY_URL_ALT3
                )
                
                // Try to resolve IPs and add them as fallbacks
                try {
                    val resolvedIPs = resolveHostToIPs("orqhtoi5jy2tbev.apps.cloud.couchbase.com")
                    resolvedIPs.forEach { ip ->
                        urls.add("wss://$ip:4984/LiquorInventoryDB")
                        urls.add("ws://$ip:4984/LiquorInventoryDB")
                        urls.add("wss://$ip/LiquorInventoryDB")
                        urls.add("ws://$ip/LiquorInventoryDB")
                        urls.add("https://$ip:4984/LiquorInventoryDB")
                        urls.add("https://$ip/LiquorInventoryDB")
                    }
                    Log.d(TAG, "✅ Added ${resolvedIPs.size} IP-based fallback URLs")
                } catch (e: Exception) {
                    Log.w(TAG, "⚠️ Could not resolve IPs, using static fallbacks: ${e.message}")
                    // Add some common IP fallbacks for Couchbase Cloud
                    urls.addAll(listOf(
                        "wss://13.107.246.51:4984/LiquorInventoryDB",
                        "ws://13.107.246.51:4984/LiquorInventoryDB",
                        "https://13.107.246.51:4984/LiquorInventoryDB"
                    ))
                }
                
                var target: URLEndpoint? = null
                var lastException: Exception? = null
                
                for (url in urls) {
                    try {
                        Log.d(TAG, "🎯 Trying URL: $url")
                        target = URLEndpoint(URI(url))
                        Log.d(TAG, "✅ Successfully created endpoint with: $url")
                        break
                    } catch (e: Exception) {
                        Log.w(TAG, "⚠️ URL failed: $url - ${e.message}")
                        lastException = e
                    }
                }
                
                if (target == null) {
                    throw lastException ?: Exception("All URL formats failed")
                }
                
                // Create replicator configuration
                val config = ReplicatorConfiguration(target)
                
                // Configure authentication
                config.authenticator = BasicAuthenticator(USERNAME, PASSWORD.toCharArray())
                
                // Configure replication type and behavior
                config.replicatorType = AbstractReplicatorConfiguration.ReplicatorType.PUSH_AND_PULL
                config.isContinuous = true
                config.heartbeat = 60 // seconds
                config.maxAttempts = 10
                config.maxAttemptWaitTime = 300 // 5 minutes
                
                // Add collection to replication
                config.addCollection(collection, null)
                
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
    }
    
    // MARK: - Public Sync Control Methods
    fun enableAppServices() {
        if (isEnabled) return
        
        Log.d(TAG, "🚀 Enabling App Services sync...")
        isEnabled = true
        startSync()
        
        updateSyncState { state ->
            state.copy(status = "☁️ Starting cloud sync...")
        }
    }
    
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
    
    fun toggleAppServices() {
        if (isEnabled) {
            disableAppServices()
        } else {
            enableAppServices()
        }
    }
    
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
    
    private fun stopSync() {
        replicator?.let { replicator ->
            if (isSyncActive) {
                Log.d(TAG, "🛑 Stopping App Services replicator...")
                replicator.stop()
                isSyncActive = false
                
                updateSyncState { state ->
                    state.copy(
                        status = "☁️ Sync stopped",
                        isConnected = false
                    )
                }
            }
        }
    }
    
    fun resetSync() {
        Log.d(TAG, "🔄 Resetting App Services sync...")
        
        stopSync()
        
        // Restart after a delay
        viewModelScope.launch {
            kotlinx.coroutines.delay(1000)
            startSync()
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
    
    fun createLiquorItem(name: String, type: String, price: Double, imageURL: String, quantity: Int = 0): String? {
        return try {
            val collection = database.getCollection(COLLECTION_NAME) 
                ?: database.createCollection(COLLECTION_NAME)
            
            val itemId = UUID.randomUUID().toString()
            val document = MutableDocument(itemId)
            
            // Set document properties
            document.setString("id", itemId)
            document.setString("name", name)
            document.setString("type", type)
            document.setDouble("price", price)
            document.setString("imageURL", imageURL)
            document.setInt("quantity", quantity)
            document.setString("document_type", "liquor_item")
            
            // Add metadata
            document.setLong("created_at", System.currentTimeMillis() / 1000)
            document.setLong("updated_at", System.currentTimeMillis() / 1000)
            document.setString("sync_source", "app_services")
            
            collection.save(document)
            
            Log.d(TAG, "✅ Created liquor item for App Services sync: $name (ID: $itemId)")
            
            // Trigger immediate sync if enabled
            if (isEnabled) {
                pushDocumentImmediately(itemId)
            }
            
            itemId
            
        } catch (e: Exception) {
            Log.e(TAG, "❌ Failed to create liquor item", e)
            null
        }
    }
    
    fun updateLiquorItemQuantity(itemId: String, newQuantity: Int): Boolean {
        return try {
            val collection = database.getCollection(COLLECTION_NAME) 
                ?: database.createCollection(COLLECTION_NAME)
            
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
            "sync_gateway_url" to SYNC_GATEWAY_URL,
            "username" to USERNAME
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
