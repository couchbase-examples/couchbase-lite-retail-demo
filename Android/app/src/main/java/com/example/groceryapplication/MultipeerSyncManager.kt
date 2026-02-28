package com.example.groceryapplication

import android.Manifest
import android.content.Context
import android.content.pm.PackageManager
import android.os.Build
import android.util.Log
import androidx.core.content.ContextCompat
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.couchbase.lite.*
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import java.security.cert.X509Certificate
import java.util.Calendar
import java.util.Date

/**
 * MultipeerSyncManager manages peer-to-peer synchronization using the MultipeerReplicator API.
 *
 * Benefits over traditional P2P approaches:
 * - Self-organizing mesh network
 * - Automatic peer discovery via DNS-SD (Bonjour)
 * - Official Couchbase API with ongoing support
 * - Automatic connection management
 * - TLS-based security
 *
 * Based on Couchbase Lite 3.3+ MultipeerReplicator API
 */
class MultipeerSyncManager(
    private val context: Context,
    private val database: Database
) : ViewModel() {
    
    // MARK: - Configuration
    private val peerGroupID = AppConfig.P2P_PEER_GROUP_ID
    private val identityLabel = AppConfig.P2P_IDENTITY_LABEL
    
    companion object {
        private const val TAG = "MultipeerSync"
    }
    
    // MARK: - Couchbase Lite Components
    private var replicator: MultipeerReplicator? = null
    private var identity: TLSIdentity? = null
    private var collections: Set<com.couchbase.lite.Collection> = emptySet()
    
    // MARK: - Event Listener Tokens
    private var statusToken: ListenerToken? = null
    private var peerDiscoveryToken: ListenerToken? = null
    private var peerReplicatorToken: ListenerToken? = null
    private var documentReplicationToken: ListenerToken? = null
    
    // MARK: - State Management
    data class P2PSyncState(
        val isRunning: Boolean = false,
        val myPeerID: String? = null,
        val connectedPeers: List<String> = emptyList(),
        val syncStatus: String = "Stopped",
        val error: String? = null,
        val lastActivityTime: Long = 0L
    )
    
    private val _syncState = MutableStateFlow(P2PSyncState())
    val syncState: StateFlow<P2PSyncState> = _syncState.asStateFlow()
    
    // MARK: - Control Methods
    
    /**
     * Start peer-to-peer synchronization
     */
    fun start() {
        viewModelScope.launch {
            try {
                if (_syncState.value.isRunning) {
                    Log.i(TAG, "⚠️ P2P sync already running")
                    return@launch
                }
                
                // Check permissions first
                if (!hasRequiredPermissions()) {
                    val missingPermissions = getMissingPermissions()
                    Log.e(TAG, "❌ Missing required permissions for P2P sync:")
                    missingPermissions.forEach { permission ->
                        Log.e(TAG, "   - $permission")
                    }
                    Log.e(TAG, "   Please grant permissions in app settings")
                    
                    updateSyncState { state ->
                        state.copy(
                            isRunning = false,
                            syncStatus = "Permission denied",
                            error = "Nearby devices permission required for P2P sync. Please grant permissions in Settings."
                        )
                    }
                    return@launch
                }
                
                Log.i(TAG, "🌟 Starting MultipeerReplicator P2P Sync...")
                Log.i(TAG, "🔍 P2P Configuration:")
                Log.i(TAG, "   Peer Group ID: $peerGroupID")
                Log.i(TAG, "   Identity Label: $identityLabel")
                Log.i(TAG, "   Database: ${database.name}")
                
                // 1. Setup collections
                setupCollections()
                
                // 2. Create or retrieve TLS identity
                identity = createOrRetrieveIdentity()
                
                // 3. Create authenticator (accept all peers with valid certs)
                val authenticator = MultipeerCertificateAuthenticator { peerID, certs ->
                    Log.i(TAG, "🔐 Authenticating peer: $peerID")
                    // Accept all peers (can implement custom validation here)
                    true
                }
                
                // 4. Create collection configurations with CRDT conflict resolver
                val collectionConfigs = mutableSetOf<MultipeerCollectionConfiguration>()
                for (collection in collections) {
                    val config = MultipeerCollectionConfiguration.Builder(collection)
                        .setConflictResolver { peerId, conflict -> GroceryCRDTResolver.resolve(conflict) }
                        .build()
                    collectionConfigs.add(config)
                }
                
                // 5. Create MultipeerReplicator configuration
                val config = MultipeerReplicatorConfiguration.Builder()
                    .setPeerGroupID(peerGroupID)
                    .setIdentity(identity!!)
                    .setAuthenticator(authenticator)
                    .setCollections(collectionConfigs)
                    .build()
                
                // 6. Create MultipeerReplicator
                replicator = MultipeerReplicator(config)
                
                // 7. Set up event listeners
                setupEventListeners()
                
                // 8. Start replicator
                replicator?.start()
                
                // 9. Update state
                val peerID = replicator?.peerId?.toString() ?: "unknown"
                updateSyncState { state ->
                    state.copy(
                        isRunning = true,
                        syncStatus = "Running",
                        myPeerID = peerID,
                        error = null,
                        lastActivityTime = System.currentTimeMillis()
                    )
                }
                
                Log.i(TAG, "✅ MultipeerReplicator started with peer ID: $peerID")
                
                // 10. Start periodic discovery logging
                startDiscoveryLogging()
                
            } catch (e: Exception) {
                Log.e(TAG, "❌ Failed to start MultipeerReplicator", e)
                updateSyncState { state ->
                    state.copy(
                        isRunning = false,
                        syncStatus = "Error",
                        error = e.message ?: "Failed to start P2P sync"
                    )
                }
            }
        }
    }
    
    /**
     * Stop peer-to-peer synchronization
     */
    fun stop() {
        if (!_syncState.value.isRunning) {
            Log.i(TAG, "⚠️ P2P sync already stopped")
            return
        }
        
        Log.i(TAG, "🛑 Stopping MultipeerReplicator...")
        
        // Remove listeners
        statusToken?.remove()
        peerDiscoveryToken?.remove()
        peerReplicatorToken?.remove()
        documentReplicationToken?.remove()
        
        statusToken = null
        peerDiscoveryToken = null
        peerReplicatorToken = null
        documentReplicationToken = null
        
        // Stop replicator
        replicator?.stop()
        replicator = null
        
        // Update state
        updateSyncState { state ->
            state.copy(
                isRunning = false,
                syncStatus = "Stopped",
                connectedPeers = emptyList(),
                error = null
            )
        }
        
        Log.i(TAG, "✅ MultipeerReplicator stopped")
    }
    
    /**
     * Toggle P2P sync on/off
     */
    fun toggle() {
        if (_syncState.value.isRunning) {
            stop()
        } else {
            start()
        }
    }
    
    // MARK: - Setup Methods
    
    private fun setupCollections() {
        try {
            // Get all collections from correct scope
            val inventoryCollection = database.getCollection(AppConfig.COLLECTION_NAME, AppConfig.scopeName)
                ?: database.createCollection(AppConfig.COLLECTION_NAME, AppConfig.scopeName)
            
            val profileCollection = database.getCollection(AppConfig.PROFILE_COLLECTION_NAME, AppConfig.scopeName)
                ?: database.createCollection(AppConfig.PROFILE_COLLECTION_NAME, AppConfig.scopeName)
            
            val ordersCollection = database.getCollection(AppConfig.ORDERS_COLLECTION_NAME, AppConfig.scopeName)
                ?: database.createCollection(AppConfig.ORDERS_COLLECTION_NAME, AppConfig.scopeName)
            
            collections = setOf(inventoryCollection, profileCollection, ordersCollection)
            
            Log.d(TAG, "✅ Collections setup complete: ${collections.size} collections")
        } catch (e: Exception) {
            Log.e(TAG, "❌ Error setting up collections", e)
            throw e
        }
    }
    
    // MARK: - Identity Management
    
    private fun createOrRetrieveIdentity(): TLSIdentity {
        // Try to retrieve existing identity
        var identity = TLSIdentity.getIdentity(identityLabel)
        
        // Check if expired
        if (identity != null && identity.expiration.before(Date())) {
            Log.i(TAG, "⚠️ TLS identity expired, creating new one...")
            TLSIdentity.deleteIdentity(identityLabel)
            identity = null
        }
        
        // Return existing if valid
        if (identity != null) {
            Log.i(TAG, "✅ Retrieved existing TLS identity (expires: ${identity.expiration})")
            return identity
        }
        
        // Create new self-signed identity
        Log.i(TAG, "🔑 Creating new self-signed TLS identity...")
        
        val certAttributes = mapOf(
            TLSIdentity.CERT_ATTRIBUTE_COMMON_NAME to "GroceryApp",
            TLSIdentity.CERT_ATTRIBUTE_ORGANIZATION to "Couchbase Demo",
            TLSIdentity.CERT_ATTRIBUTE_ORGANIZATION_UNIT to "Mobile"
        )
        
        val calendar = Calendar.getInstance()
        calendar.add(Calendar.YEAR, 2)
        val expiration = calendar.time
        
        val newIdentity = TLSIdentity.createIdentity(
            setOf(KeyUsage.CLIENT_AUTH, KeyUsage.SERVER_AUTH),  // Both client and server auth
            certAttributes,
            expiration,
            identityLabel
        )
        
        Log.i(TAG, "✅ Created new TLS identity (expires: $expiration)")
        return newIdentity
    }
    
    // MARK: - Event Listeners
    
    private fun setupEventListeners() {
        val repl = replicator ?: return
        
        // 1. Multipeer Replicator Status Listener
        statusToken = repl.addStatusListener { status ->
            viewModelScope.launch {
                val isActive = status.isActive
                val statusText = if (isActive) "Active" else "Inactive"
                
                // Log detailed status information
                Log.i(TAG, "📊 Multipeer Replicator Status: $statusText")
                Log.i(TAG, "🔍 Status details: isActive=$isActive, error=${status.error?.message ?: "none"}")
                
                if (status.error != null) {
                    Log.e(TAG, "❌ Multipeer Replicator error: ${status.error?.message}")
                    updateSyncState { state ->
                        state.copy(
                            isRunning = isActive,
                            syncStatus = "Error: ${status.error?.message}",
                            error = status.error?.message,
                            lastActivityTime = System.currentTimeMillis()
                        )
                    }
                } else {
                    Log.i(TAG, "📊 Multipeer Replicator: $statusText")
                    updateSyncState { state ->
                        state.copy(
                            isRunning = isActive,
                            syncStatus = statusText,
                            error = null,
                            lastActivityTime = System.currentTimeMillis()
                        )
                    }
                }
            }
        }
        
        // 2. Peer Discovery Status Listener
        peerDiscoveryToken = repl.addPeerDiscoveryStatusListener { status ->
            viewModelScope.launch {
                val currentPeers = _syncState.value.connectedPeers.toMutableList()
                
                Log.i(TAG, "🔍 Peer Discovery Event:")
                Log.i(TAG, "   Peer: ${status.peer}")
                Log.i(TAG, "   Is Online: ${status.isOnline}")
                Log.i(TAG, "   Current Peers Count: ${currentPeers.size}")
                
                if (status.isOnline) {
                    // Peer came online
                    val peerIdStr = status.peer.toString()
                    if (!currentPeers.contains(peerIdStr)) {
                        currentPeers.add(peerIdStr)
                        Log.i(TAG, "✅ NEW PEER DISCOVERED: $peerIdStr")
                        Log.i(TAG, "🔍 Total connected peers: ${currentPeers.size}")
                    } else {
                        Log.i(TAG, "🔄 Peer already known: $peerIdStr")
                    }
                } else {
                    // Peer went offline
                    val peerIdStr = status.peer.toString()
                    currentPeers.remove(peerIdStr)
                    Log.i(TAG, "❌ PEER LOST: $peerIdStr")
                    Log.i(TAG, "🔍 Remaining peers: ${currentPeers.size}")
                }
                
                // Update status message
                val statusMessage = when {
                    currentPeers.isEmpty() && _syncState.value.isRunning -> "Discovering peers..."
                    currentPeers.isNotEmpty() -> "Connected to ${currentPeers.size} peer${if (currentPeers.size == 1) "" else "s"}"
                    else -> "Stopped"
                }
                
                updateSyncState { state ->
                    state.copy(
                        connectedPeers = currentPeers,
                        syncStatus = statusMessage,
                        lastActivityTime = System.currentTimeMillis()
                    )
                }
            }
        }
        
        // 3. Peer's Replicator Status Listener
        peerReplicatorToken = repl.addPeerReplicatorStatusListener { replStatus ->
            val activities = listOf("stopped", "offline", "connecting", "idle", "busy")
            val direction = if (replStatus.isOutgoing) "outgoing" else "incoming"
            val activity = activities.getOrNull(replStatus.status.activityLevel.ordinal) ?: "unknown"
            val error = replStatus.status.error?.message ?: "none"
            
            Log.i(TAG, "📊 Peer Replicator - Peer: ${replStatus.peerId.toString()}, Direction: $direction, Activity: $activity, Error: $error")
        }
        
        // 4. Peer's Document Replication Listener
        documentReplicationToken = repl.addPeerDocumentReplicationListener { docRepl ->
            viewModelScope.launch {
                val direction = if (docRepl.isPush) "Push" else "Pull"
                Log.i(TAG, "📄 Document Replication - Peer: ${docRepl.peer.toString()}, Direction: $direction, Count: ${docRepl.documents.size}")
                
                // Log each document with detailed information
                docRepl.documents.forEach { doc ->
                    val collection = "${doc.scope}.${doc.collection}"
                    val error = doc.error?.message ?: "none"
                    val flags = doc.flags
                    
                    // Check if this is a CRDT counter document (simplified check)
                    val isCRDT = flags.isNotEmpty()
                    
                    Log.i(TAG, "   📄 $collection.${doc.id} - Flags: $flags, Error: $error, CRDT: $isCRDT")
                    
                    // Log CRDT counter details if available
                    if (doc.id.contains("Inventory_AAStore_")) {
                        Log.d(TAG, "   🔢 Inventory item ${doc.id} replicated via P2P")
                    }
                }
                
                // Update sync status with replication info
                val statusMessage = if (docRepl.documents.isNotEmpty()) {
                    "📡 Synced ${docRepl.documents.size} document${if (docRepl.documents.size == 1) "" else "s"}"
                } else {
                    _syncState.value.syncStatus
                }
                
                updateSyncState { state ->
                    state.copy(
                        syncStatus = statusMessage,
                        lastActivityTime = System.currentTimeMillis()
                    )
                }
            }
        }
        
        Log.i(TAG, "✅ Event listeners configured")
    }
    
    // MARK: - Peer Information
    
    /**
     * Get list of currently connected peer IDs
     */
    fun getNeighborPeers(): List<String> {
        return replicator?.neighborPeers?.map { it.toString() } ?: emptyList()
    }
    
    /**
     * Get detailed information about a specific peer
     */
    fun getPeerInfo(peerID: String): PeerInfo? {
        // For now, return null since we need to convert String to PeerId
        // This will be implemented when we have access to the actual PeerId type
        return null
    }
    
    /**
     * Start periodic logging of peer discovery status
     */
    private fun startDiscoveryLogging() {
        viewModelScope.launch {
            var logCount = 0
            while (_syncState.value.isRunning && logCount < 10) { // Log 10 times max
                kotlinx.coroutines.delay(5000) // Wait 5 seconds
                
                if (_syncState.value.isRunning) {
                    val neighborPeers = getNeighborPeers()
                    Log.i(TAG, "🔍 Discovery Status Check #${logCount + 1}:")
                    Log.i(TAG, "   My Peer ID: ${_syncState.value.myPeerID}")
                    Log.i(TAG, "   Connected Peers: ${_syncState.value.connectedPeers.size}")
                    Log.i(TAG, "   Neighbor Peers: ${neighborPeers.size}")
                    Log.i(TAG, "   Sync Status: ${_syncState.value.syncStatus}")
                    
                    if (neighborPeers.isNotEmpty()) {
                        Log.i(TAG, "   Neighbor Peer IDs: ${neighborPeers.joinToString(", ")}")
                    }
                    
                    logCount++
                }
            }
        }
    }
    
    /**
     * Get all peer information
     */
    fun getAllPeerInfo(): Map<String, PeerInfo> {
        val neighborPeers = getNeighborPeers()
        return neighborPeers.mapNotNull { peerID ->
            getPeerInfo(peerID)?.let { peerID to it }
        }.toMap()
    }
    
    // MARK: - State Helpers
    
    private fun updateSyncState(update: (P2PSyncState) -> P2PSyncState) {
        _syncState.value = update(_syncState.value)
    }
    
    // MARK: - Permission Checking
    
    /**
     * Check if all required permissions are granted for P2P sync
     */
    private fun hasRequiredPermissions(): Boolean {
        val requiredPermissions = getRequiredPermissions()
        return requiredPermissions.all {
            ContextCompat.checkSelfPermission(context, it) == PackageManager.PERMISSION_GRANTED
        }
    }
    
    /**
     * Get list of permissions that are not granted
     */
    private fun getMissingPermissions(): List<String> {
        val requiredPermissions = getRequiredPermissions()
        return requiredPermissions.filter {
            ContextCompat.checkSelfPermission(context, it) != PackageManager.PERMISSION_GRANTED
        }
    }
    
    /**
     * Get list of required permissions based on Android version
     */
    private fun getRequiredPermissions(): List<String> {
        val permissions = mutableListOf<String>()

        when {
            Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU -> {
                // Android 13+ (API 33+): Nearby Wi-Fi devices (no location needed with neverForLocation flag)
                permissions.add(Manifest.permission.NEARBY_WIFI_DEVICES)
            }
            Build.VERSION.SDK_INT >= Build.VERSION_CODES.S -> {
                // Android 12 (API 31-32): Bluetooth permissions + location (required for mDNS)
                permissions.add(Manifest.permission.BLUETOOTH_ADVERTISE)
                permissions.add(Manifest.permission.BLUETOOTH_CONNECT)
                permissions.add(Manifest.permission.BLUETOOTH_SCAN)
                permissions.add(Manifest.permission.ACCESS_FINE_LOCATION)
            }
            else -> {
                // Android 11 and below: Location permission (required for mDNS discovery)
                permissions.add(Manifest.permission.ACCESS_FINE_LOCATION)
            }
        }

        return permissions
    }
    
    /**
     * Check if permissions are granted and return user-friendly status
     */
    fun getPermissionStatus(): String {
        if (hasRequiredPermissions()) {
            return "✅ All permissions granted"
        }
        
        val missing = getMissingPermissions()
        return "❌ Missing ${missing.size} permission(s):\n" + missing.joinToString("\n") { 
            "   - ${it.substringAfterLast('.')}" 
        }
    }
    
    // MARK: - Cleanup
    
    override fun onCleared() {
        super.onCleared()
        stop()
    }
}

// MARK: - CRDT Conflict Resolver

/**
 * Shared CRDT resolver logic used for conflict resolution
 */
object GroceryCRDTResolver {
    
    private const val TAG = "GroceryCRDTResolver"
    
    fun resolve(conflict: Conflict): Document? {
        // Use the default conflict resolver for initial resolution
        val defaultResolver = ConflictResolver.DEFAULT
        val resolvedDoc = defaultResolver.resolve(conflict)?.toMutable() ?: return null
        
        // If either document is null, return the default resolved doc
        val localDocument = conflict.localDocument ?: return resolvedDoc
        val remoteDocument = conflict.remoteDocument ?: return resolvedDoc
        
        // Iterate over all keys in the local and remote documents
        val localAndRemoteKeys = localDocument.keys.union(remoteDocument.keys)
        
        for (key in localAndRemoteKeys) {
            // Check if either the local or remote document has a "pn-counter" type field for the current key
            val localDict = localDocument.getDictionary(key)
            val remoteDict = remoteDocument.getDictionary(key)
            
            val isLocalCounter = localDict?.getString("type") == "pn-counter"
            val isRemoteCounter = remoteDict?.getString("type") == "pn-counter"
            
            if (isLocalCounter || isRemoteCounter) {
                Log.d(TAG, "🔄 Resolving CRDT conflict for key: $key")
                
                // Initialize counters for the positive (p) and negative (n) values
                var pCounterValue = 0
                var nCounterValue = 0
                
                // Iterate over the "p" and "n" keys
                for (counterKey in listOf("p", "n")) {
                    // Get the "p" or "n" dictionary from the local and remote documents
                    val localCounter = localDict?.getDictionary(counterKey) ?: MutableDictionary()
                    val remoteCounter = remoteDict?.getDictionary(counterKey) ?: MutableDictionary()
                    
                    // Initialize a new dictionary to hold the merged counter values
                    val mergedCounter = MutableDictionary()
                    
                    // Iterate over all actors in the local and remote counters
                    val allActors = localCounter.keys.union(remoteCounter.keys)
                    
                    for (actor in allActors) {
                        // Get the local and remote values for the current actor
                        val localValue = localCounter.getInt(actor)
                        val remoteValue = remoteCounter.getInt(actor)
                        
                        // The merged value is the maximum of the local and remote values
                        val maxValue = maxOf(localValue, remoteValue)
                        mergedCounter.setInt(actor, maxValue)
                        
                        // Add the merged value to the appropriate counter
                        if (counterKey == "p") {
                            pCounterValue += maxValue
                        } else if (counterKey == "n") {
                            nCounterValue += maxValue
                        }
                    }
                    
                    // Set the merged counter in the resolved document
                    if (mergedCounter.count() > 0) {
                        // Ensure the counter structure exists
                        var counterDict = resolvedDoc.getDictionary(key)
                        if (counterDict == null) {
                            counterDict = MutableDictionary()
                            counterDict.setString("type", "pn-counter")
                            resolvedDoc.setDictionary(key, counterDict)
                        }
                        counterDict.setDictionary(counterKey, mergedCounter)
                    }
                }
                
                // Set the "value" field to the difference between positive and negative counters
                val finalValue = maxOf(0, pCounterValue - nCounterValue) // Ensure non-negative
                val counterDict = resolvedDoc.getDictionary(key)
                counterDict?.setInt("value", finalValue)
                
                Log.d(TAG, "✅ CRDT conflict resolved: $key = $finalValue")
            }
        }
        
        return resolvedDoc
    }
}

