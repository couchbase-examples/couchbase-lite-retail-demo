package com.example.groceryapplication

import android.content.Context
import android.util.Log
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import com.couchbase.lite.*
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import kotlinx.coroutines.flow.mapNotNull
import kotlinx.coroutines.channels.awaitClose
import kotlinx.coroutines.flow.callbackFlow

class DatabaseManager(private val context: Context) {
    private var database: Database? = null
    private val databaseName = AppConfig.DATABASE_NAME
    private val collectionName = AppConfig.COLLECTION_NAME

    // Background scope for post-login sync setup. Using SupervisorJob so that
    // a failure in one launch doesn't cancel the whole scope.
    private val backgroundScope = CoroutineScope(Dispatchers.IO + SupervisorJob())

    // App Services Integration
    var appServicesSyncManager: AppServicesSyncManager? = null
        private set
    var isAppServicesEnabled by mutableStateOf(false)
        private set

    // P2P Sync Integration
    var multipeerSyncManager: MultipeerSyncManager? = null
        private set
    var isP2PEnabled by mutableStateOf(false)
        private set
    
    init {
        // Print configuration on startup
        AppConfig.printConfiguration()
        
        openDatabase()
        setupIndexes() // Setup both basic and vector indexes
        // REMOVED: Hard-coded data seeding - data will come from App Services
        // seedSampleData()
        setupAppServicesIntegration()
        setupP2PIntegration()
        
        // NOTE: Sync is NOT started here — it must wait until after login
        // so that AppConfig.currentStore is set to the correct user's store.
        // Call startSyncAfterLogin() after AuthenticationManager.login() completes.
    }
    
    /**
     * Called after login to set up indexes for the correct scope
     * and start App Services / P2P sync with the correct endpoint.
     *
     * Dispatches the heavy work (index creation, collection lookup,
     * Replicator construction) onto Dispatchers.IO so it is safe to
     * invoke from the main thread (e.g. from AuthenticationManager
     * init via checkStoredLogin()) without risking an ANR.
     *
     * Fire-and-forget: callers should not rely on sync being fully
     * configured by the time this returns. UI that depends on profile
     * data should observe it reactively (see InventoryScreen).
     */
    fun startSyncAfterLogin() {
        backgroundScope.launch {
            Log.d("DatabaseManager", "🔄 Starting sync after login for store: ${AppConfig.currentStore.displayName}")
            Log.d("DatabaseManager", "🔄 Sync URL: ${AppConfig.syncGatewayURL}")
            Log.d("DatabaseManager", "🔄 Scope: ${AppConfig.scopeName}")
            Log.d("DatabaseManager", "🔄 Username: ${AppConfig.username}")

            // Recreate indexes in the correct scope for this user
            setupIndexes()

            // Reconfigure and start App Services sync with correct endpoint.
            // setupAndStartSync() guarantees: stop old → create replicator → start new.
            if (AppConfig.ENABLE_APP_SERVICES_SYNC) {
                appServicesSyncManager?.setupAndStartSync()
                isAppServicesEnabled = true
            }

            // Auto-enable P2P if configured
            if (AppConfig.P2P_AUTO_START && AppConfig.ENABLE_P2P_SYNC) {
                enableP2P()
            }
        }
    }
    
    private fun openDatabase() {
        try {
            CouchbaseLite.init(context)
            val config = DatabaseConfiguration()
            database = Database(databaseName, config)
            Log.d("DatabaseManager", "✅ Database opened successfully: $databaseName")
            Log.d("DatabaseManager", "📍 Database path: ${database?.path}")
            Log.d("DatabaseManager", "🔄 Database ready - waiting for App Services to sync data...")
        } catch (e: Exception) {
            Log.e("DatabaseManager", "❌ Error opening database", e)
        }
    }
    
    private fun setupIndexes() {
        database?.let { db ->
            try {
                // Get collection from correct scope
                val collection = db.getCollection(collectionName, AppConfig.scopeName) 
                    ?: db.createCollection(collectionName, AppConfig.scopeName)
                
                // Create basic value indexes for search
                // Index both 'category' (Capella) and 'name' fields
                val nameIndex = IndexBuilder.valueIndex(ValueIndexItem.property("name"))
                collection.createIndex("name_index", nameIndex)
                
                val categoryIndex = IndexBuilder.valueIndex(ValueIndexItem.property("category"))
                collection.createIndex("category_index", categoryIndex)
                
                Log.d("DatabaseManager", "✅ Indexes created successfully for scope: ${AppConfig.scopeName}")
            } catch (e: Exception) {
                Log.e("DatabaseManager", "❌ Error creating indexes", e)
            }
        }
    }
    
    // MARK: - Data Seeding REMOVED
    // ⚠️ All data seeding methods have been removed.
    // Data will now be populated exclusively through App Services sync from Capella.
    
    fun saveGroceryItem(item: GroceryItem) {
        database?.let { db ->
            try {
                val collection = db.getCollection(collectionName, AppConfig.scopeName) 
                    ?: db.createCollection(collectionName, AppConfig.scopeName)
                val document = MutableDocument(item.id)
                
                // Save using Capella field names for consistency
                document.setString("id", item.id)
                document.setString("name", item.name)
                document.setString("category", item.type)  // Map 'type' to 'category' for Capella
                document.setDouble("price", item.price)
                document.setString("imageURL", item.imageURL)
                document.setInt("stockQty", item.quantity)  // Map 'quantity' to 'stockQty' for Capella
                
                // Use conflict handler for sync compatibility (Last Write Wins)
                collection.save(document, ConcurrencyControl.LAST_WRITE_WINS)
                Log.d("DatabaseManager", "Saved grocery item: ${item.name}")
            } catch (e: Exception) {
                Log.e("DatabaseManager", "Error saving grocery item", e)
            }
        }
    }
    
    // MARK: - Reactive API Methods (Flow-Based Queries)
    
    /**
     * Creates a Flow of GroceryItems that automatically emits updates when data changes
     * Uses Kotlin Flow for reactive programming (modern approach)
     * This replaces manual polling/refresh - UI updates automatically!
     */
    fun getGroceryItemsFlow(): Flow<List<GroceryItem>> = callbackFlow {
        val db = database
        if (db == null) {
            Log.e("DatabaseManager", "❌ Database not initialized")
            trySend(emptyList())
            close()
            return@callbackFlow
        }
        
        try {
            val collection = db.getCollection(collectionName, AppConfig.scopeName)
            if (collection == null) {
                Log.e("DatabaseManager", "❌ Collection not found")
                trySend(emptyList())
                close()
                return@callbackFlow
            }
            
            // Create query
            val query = QueryBuilder
                .select(SelectResult.all())
                .from(DataSource.collection(collection))
            
            Log.d("DatabaseManager", "🔄 [Reactive API] Setting up query change listener...")
            
            // Add change listener that emits to Flow
            val token = query.addChangeListener { change ->
                val results = change.results
                if (results != null) {
                    val items = mutableListOf<GroceryItem>()
                    
                    results.forEach { result ->
                        val dict = result.getDictionary(collectionName)
                        dict?.let {
                            val id = it.getString("id") ?: return@let
                            val name = it.getString("name") ?: return@let
                            val imageURL = it.getString("imageURL") ?: return@let
                            val type = it.getString("category") ?: it.getString("type") ?: "Unknown"
                            val price = it.getDouble("price")
                            // 🔧 SYNC FIX: Read stockQty FIRST (matches iOS and Web for App Services sync)
                            // Fall back to CRDT "quantity.value" only for P2P sync compatibility
                            val quantity = it.getInt("stockQty").takeIf { q -> q > 0 }
                                ?: it.getDictionary("quantity")?.getInt("value")
                                ?: it.getInt("quantity")
                            val productId = it.getInt("productId")
                            val sku = it.getString("sku")
                            val unit = it.getString("unit")
                            
                            val item = GroceryItem(id, name, type, price, imageURL, quantity, productId, sku, unit)
                            items.add(item)
                        }
                    }
                    
                    Log.d("DatabaseManager", "✅ [Reactive API] Query changed: ${items.size} items")
                    trySend(items)
                }
            }
            
            // Initial query execution
            query.execute()
            
            Log.d("DatabaseManager", "✅ [Reactive API] Flow setup complete - automatic updates enabled!")
            
            // Cleanup when Flow is cancelled
            awaitClose {
                Log.d("DatabaseManager", "🔄 [Reactive API] Removing query change listener")
                token.remove()
            }
        } catch (e: Exception) {
            Log.e("DatabaseManager", "❌ [Reactive API] Error setting up Flow", e)
            trySend(emptyList())
            close()
        }
    }
    
    // MARK: - Legacy Methods (Keep for other screens until migrated)
    
    suspend fun getAllGroceryItems(): List<GroceryItem> = withContext(Dispatchers.IO) {
        database?.let { db ->
            try {
                val collection = db.getCollection(collectionName, AppConfig.scopeName) 
                    ?: return@withContext emptyList()
                val query = QueryBuilder
                    .select(SelectResult.all())
                    .from(DataSource.collection(collection))
                
                val results = query.execute()
                val groceryItems = mutableListOf<GroceryItem>()
                
                results.forEach { result ->
                    val dict = result.getDictionary(collectionName)
                    dict?.let {
                        // Map Capella field names to app field names
                        val id = it.getString("id") ?: return@let
                        val name = it.getString("name") ?: return@let
                        val imageURL = it.getString("imageURL") ?: return@let
                        
                        // Map 'category' from Capella to 'type' in app
                        val type = it.getString("category") ?: it.getString("type") ?: "Unknown"
                        val price = it.getDouble("price")
                        
                        // 🔧 SYNC FIX: Read stockQty FIRST (matches iOS and Web for App Services sync)
                        // Fall back to CRDT "quantity.value" only for P2P sync compatibility
                        val quantity = it.getInt("stockQty").takeIf { q -> q > 0 }
                            ?: it.getDictionary("quantity")?.getInt("value")
                            ?: it.getInt("quantity")
                        
                        // Read productId, sku, and unit fields (needed for order creation)
                        val productId = it.getInt("productId")
                        val sku = it.getString("sku")
                        val unit = it.getString("unit")
                        
                        val item = GroceryItem(id, name, type, price, imageURL, quantity, productId, sku, unit)
                        groceryItems.add(item)
                    }
                }
                
                Log.d("DatabaseManager", "Retrieved ${groceryItems.size} grocery items")
                return@withContext groceryItems
            } catch (e: Exception) {
                Log.e("DatabaseManager", "Error fetching grocery items", e)
                return@withContext emptyList()
            }
        } ?: emptyList()
    }
    
    fun updateQuantity(itemId: String, newQuantity: Int) {
        database?.let { db ->
            try {
                val collection = db.getCollection(collectionName, AppConfig.scopeName) ?: return
                val document = collection.getDocument(itemId)
                document?.let {
                    val mutableDoc = it.toMutable()
                    mutableDoc.setInt("stockQty", newQuantity)  // Save as stockQty for Capella
                    // IMPORTANT: Remove CRDT "quantity" field to prevent conflict storms with Web
                    // Android P2P uses CRDT counters that create complex revision histories
                    // Web uses simple stockQty field - mixing them causes infinite conflict loops
                    if (mutableDoc.contains("quantity")) {
                        mutableDoc.remove("quantity")
                        Log.d("DatabaseManager", "Removed CRDT 'quantity' field to prevent conflicts")
                    }
                    // Use conflict handler for sync compatibility (Last Write Wins)
                    collection.save(mutableDoc, ConcurrencyControl.LAST_WRITE_WINS)
                    Log.d("DatabaseManager", "Updated quantity for $itemId to $newQuantity")
                }
            } catch (e: Exception) {
                Log.e("DatabaseManager", "Error updating quantity", e)
            }
        }
    }
    
    suspend fun searchGrocery(searchText: String): List<GroceryItem> = withContext(Dispatchers.IO) {
        database?.let { db ->
            try {
                val collection = db.getCollection(collectionName, AppConfig.scopeName) 
                    ?: return@withContext emptyList()
                
                Log.d("DatabaseManager", "Searching for: '$searchText'")
                
                // Simplified search - match iOS exactly (case insensitive using uppercase comparison)
                val upperSearchText = searchText.uppercase()
                
                val query = QueryBuilder
                    .select(SelectResult.all())
                    .from(DataSource.collection(collection))
                
                val results = query.execute()
                val groceryItems = mutableListOf<GroceryItem>()
                val seenIds = mutableSetOf<String>() // Prevent duplicates
                
                results.forEach { result ->
                    val dict = result.getDictionary(collectionName)
                    dict?.let {
                        val id = it.getString("id") ?: return@let
                        val name = it.getString("name") ?: return@let
                        val imageURL = it.getString("imageURL") ?: return@let
                        
                        // Map 'category' from Capella to 'type' in app
                        val type = it.getString("category") ?: it.getString("type") ?: "Unknown"
                        val price = it.getDouble("price")
                        
                        // 🔧 SYNC FIX: Read stockQty FIRST (matches iOS and Web for App Services sync)
                        // Fall back to CRDT "quantity.value" only for P2P sync compatibility
                        val quantity = it.getInt("stockQty").takeIf { q -> q > 0 }
                            ?: it.getDictionary("quantity")?.getInt("value")
                            ?: it.getInt("quantity")
                        
                        // Read productId, sku, and unit fields (needed for order creation)
                        val productId = it.getInt("productId")
                        val sku = it.getString("sku")
                        val unit = it.getString("unit")
                        
                        // Filter in code to match search text (case insensitive)
                        val nameUpper = name.uppercase()
                        val typeUpper = type.uppercase()
                        
                        if ((nameUpper.contains(upperSearchText) || typeUpper.contains(upperSearchText)) && !seenIds.contains(id)) {
                            val item = GroceryItem(id, name, type, price, imageURL, quantity, productId, sku, unit)
                            groceryItems.add(item)
                            seenIds.add(id)
                            
                            Log.d("DatabaseManager", "Found item: $name (searching for: $searchText)")
                        }
                    }
                }
                
                Log.d("DatabaseManager", "Search for '$searchText' returned ${groceryItems.size} items")
                return@withContext groceryItems
            } catch (e: Exception) {
                Log.e("DatabaseManager", "Error searching grocery", e)
                return@withContext emptyList()
            }
        } ?: emptyList()
    }
    
    // MARK: - Profile Operations
    suspend fun getStoreProfile(): StoreProfile? = withContext(Dispatchers.IO) {
        database?.let { db ->
            try {
                val collection = db.getCollection(AppConfig.PROFILE_COLLECTION_NAME, AppConfig.scopeName) 
                    ?: return@withContext null
                    
                val query = QueryBuilder
                    .select(SelectResult.all())
                    .from(DataSource.collection(collection))
                    .where(Expression.property("storeId").equalTo(Expression.string(AppConfig.storeId)))
                    
                val results = query.execute()
                
                results.forEach { result ->
                    val dict = result.getDictionary(AppConfig.PROFILE_COLLECTION_NAME)
                    dict?.let {
                        val id = it.getString("id") ?: return@let
                        val docType = it.getString("docType") ?: "StoreProfile"
                        val storeId = it.getString("storeId") ?: return@let
                        val name = it.getString("name") ?: return@let
                        
                        // Parse contact
                        val contactDict = it.getDictionary("contact")
                        val contact = contactDict?.let { c ->
                            StoreProfile.Contact(
                                email = c.getString("email") ?: "",
                                phone = c.getString("phone") ?: ""
                            )
                        } ?: return@let
                        
                        // Parse location
                        val locationDict = it.getDictionary("location")
                        val location = locationDict?.let { l ->
                            val coordDict = l.getDictionary("coordinates")
                            val coordinates = coordDict?.let { coord ->
                                StoreProfile.Coordinates(
                                    lat = coord.getDouble("lat"),
                                    lon = coord.getDouble("lon")
                                )
                            }
                            
                            StoreProfile.Location(
                                address1 = l.getString("address1") ?: "",
                                address2 = l.getString("address2"),
                                locality = l.getString("locality") ?: "",
                                region = l.getString("region") ?: "",
                                postalCode = l.getString("postalCode") ?: "",
                                country = l.getString("country") ?: "",
                                coordinates = coordinates
                            )
                        } ?: return@let
                        
                        val profile = StoreProfile(
                            id = id,
                            docType = docType,
                            storeId = storeId,
                            name = name,
                            contact = contact,
                            location = location,
                            manager = it.getString("manager"),
                            openingHours = it.getString("openingHours")
                        )
                        
                        Log.d("DatabaseManager", "Retrieved store profile: ${profile.name}")
                        return@withContext profile
                    }
                }
                
                Log.d("DatabaseManager", "No store profile found")
                return@withContext null
            } catch (e: Exception) {
                Log.e("DatabaseManager", "Error fetching store profile", e)
                return@withContext null
            }
        } ?: null
    }
    
    // MARK: - Orders Operations
    
    /**
     * Creates a Flow of Orders that automatically emits updates when data changes
     * Uses Kotlin Flow for reactive programming (modern approach)
     * Uses official Couchbase Lite 3.3+ Kotlin Extensions API
     * This replaces manual polling/refresh - UI updates automatically!
     */
    @OptIn(kotlinx.coroutines.ExperimentalCoroutinesApi::class)
    fun getOrdersFlow(): Flow<List<Order>> {
        val db = database
        if (db == null) {
            Log.e("DatabaseManager", "❌ Database not initialized")
            return flow { emit(emptyList()) }
        }
        
        val collection = db.getCollection(AppConfig.ORDERS_COLLECTION_NAME, AppConfig.scopeName)
        if (collection == null) {
            Log.e("DatabaseManager", "❌ Orders collection not found")
            return flow { emit(emptyList()) }
        }
        
        // Create query using QueryBuilder
        val query = QueryBuilder
            .select(SelectResult.all())
            .from(DataSource.collection(collection))
            .where(Expression.property("storeId").equalTo(Expression.string(AppConfig.storeId)))
            .orderBy(Ordering.expression(Expression.property("orderDate")).descending())
        
        Log.d("DatabaseManager", "🔄 [Reactive API - Orders] Setting up queryChangeFlow()...")
        
        // Use official Kotlin Extension: queryChangeFlow()
        return query.queryChangeFlow()
            .mapNotNull { change ->
                val err = change.error
                if (err != null) {
                    Log.e("DatabaseManager", "❌ [Reactive API - Orders] Query error: $err")
                    return@mapNotNull emptyList()
                }
                
                // Get results from query change
                val results = change.results?.allResults() ?: emptyList()
                val orders = mutableListOf<Order>()
                
                results.forEach { result ->
                    val dict = result.getDictionary(AppConfig.ORDERS_COLLECTION_NAME)
                    dict?.let {
                        // Generate a temporary ID since we can't easily get document ID from query result
                        // The document will sync with proper ID to Capella
                        val tempId = "order-${it.getInt("orderId")}-${it.getString("storeId")}"
                        
                        val order = Order(
                            id = tempId,
                            docType = it.getString("docType") ?: "Order",
                            orderId = it.getInt("orderId"),
                            storeId = it.getString("storeId") ?: "",
                            orderDate = it.getLong("orderDate"),
                            orderStatus = it.getString("orderStatus") ?: "Submitted",
                            productId = it.getInt("productId"),
                            sku = it.getString("sku") ?: "",
                            unit = it.getString("unit") ?: "",
                            orderQty = it.getInt("orderQty")
                        )
                        orders.add(order)
                    }
                }
                
                Log.d("DatabaseManager", "✅ [Reactive API - Orders] Query changed: ${orders.size} orders")
                orders
            }
    }
    
    suspend fun getAllOrders(): List<Order> = withContext(Dispatchers.IO) {
        database?.let { db ->
            try {
                val collection = db.getCollection(AppConfig.ORDERS_COLLECTION_NAME, AppConfig.scopeName) 
                    ?: return@withContext emptyList()
                    
                // Query all orders for this store
                val query = QueryBuilder
                    .select(SelectResult.all())
                    .from(DataSource.collection(collection))
                    .where(Expression.property("storeId").equalTo(Expression.string(AppConfig.storeId)))
                    .orderBy(Ordering.expression(Expression.property("orderDate")).descending())
                
                val results = query.execute()
                val orders = mutableListOf<Order>()
                
                results.forEach { result ->
                    val dict = result.getDictionary(AppConfig.ORDERS_COLLECTION_NAME)
                    dict?.let {
                        // Generate a temporary ID for display purposes
                        val tempId = "order-${it.getInt("orderId")}-${it.getString("storeId")}"
                        
                        val order = Order(
                            id = tempId,
                            docType = it.getString("docType") ?: "Order",
                            orderId = it.getInt("orderId"),
                            storeId = it.getString("storeId") ?: "",
                            orderDate = it.getLong("orderDate"),
                            orderStatus = it.getString("orderStatus") ?: "Submitted",
                            productId = it.getInt("productId"),
                            sku = it.getString("sku") ?: "",
                            unit = it.getString("unit") ?: "",
                            orderQty = it.getInt("orderQty")
                        )
                        orders.add(order)
                    }
                }
                
                Log.d("DatabaseManager", "Retrieved ${orders.size} orders")
                return@withContext orders
            } catch (e: Exception) {
                Log.e("DatabaseManager", "Error fetching orders", e)
                return@withContext emptyList()
            }
        } ?: emptyList()
    }
    
    /**
     * Generates a NanoID-style unique identifier
     * Format: 21 characters using URL-safe alphabet
     */
    private fun generateNanoId(): String {
        val alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_-"
        val random = java.security.SecureRandom()
        return (1..21)
            .map { alphabet[random.nextInt(alphabet.length)] }
            .joinToString("")
    }
    
    suspend fun createOrder(item: GroceryItem, quantity: Int = 100): Order? = withContext(Dispatchers.IO) {
        database?.let { db ->
            try {
                val collection = db.getCollection(AppConfig.ORDERS_COLLECTION_NAME, AppConfig.scopeName) 
                    ?: db.createCollection(AppConfig.ORDERS_COLLECTION_NAME, AppConfig.scopeName)
                
                // Generate NanoID-style document ID
                val nanoId = generateNanoId()
                val documentId = "order-${AppConfig.storeId}-$nanoId"
                
                // Get next sequential order ID
                val existingOrders = getAllOrders()
                val nextOrderId = (existingOrders.maxOfOrNull { it.orderId } ?: 0) + 1
                
                val order = Order(
                    id = documentId,
                    docType = "Order",
                    orderId = nextOrderId,
                    storeId = AppConfig.storeId,
                    orderDate = System.currentTimeMillis(),
                    orderStatus = "In Review",  // New status for upcoming orders
                    productId = item.productId ?: 0,
                    sku = item.sku ?: "UNKNOWN",
                    unit = item.unit ?: "unit",
                    orderQty = quantity
                )
                
                val document = MutableDocument(documentId)
                document.setString("docType", order.docType)
                document.setString("storeId", order.storeId)
                document.setLong("orderDate", order.orderDate)
                document.setString("orderStatus", order.orderStatus)
                document.setInt("productId", order.productId)
                document.setString("sku", order.sku)
                document.setString("unit", order.unit)
                document.setInt("orderQty", order.orderQty)
                document.setInt("orderId", order.orderId)
                
                // Use conflict handler for sync compatibility (Last Write Wins)
                collection.save(document, ConcurrencyControl.LAST_WRITE_WINS)
                Log.d("DatabaseManager", "✅ Created order: $documentId (productId: ${order.productId}, qty: $quantity)")
                
                // Trigger sync if App Services is enabled
                if (isAppServicesEnabled) {
                    appServicesSyncManager?.pushDocumentImmediately(documentId)
                }
                
                return@withContext order
            } catch (e: Exception) {
                Log.e("DatabaseManager", "❌ Error creating order", e)
                return@withContext null
            }
        } ?: null
    }
    
    // MARK: - App Services Integration
    private fun setupAppServicesIntegration() {
        database?.let { db ->
            Log.d("DatabaseManager", "🌐 Setting up App Services integration...")
            appServicesSyncManager = AppServicesSyncManager(context, db)
            Log.d("DatabaseManager", "✅ App Services integration ready")
        } ?: run {
            Log.e("DatabaseManager", "❌ Database not ready for App Services integration")
        }
    }
    
    fun enableAppServices() {
        appServicesSyncManager?.let { syncManager ->
            Log.d("DatabaseManager", "🚀 Enabling App Services sync...")
            isAppServicesEnabled = true
            syncManager.enableAppServices()
        } ?: run {
            Log.e("DatabaseManager", "❌ App Services sync manager not available")
        }
    }
    
    fun disableAppServices() {
        appServicesSyncManager?.let { syncManager ->
            Log.d("DatabaseManager", "🛑 Disabling App Services sync...")
            isAppServicesEnabled = false
            syncManager.disableAppServices()
        }
    }
    
    fun toggleAppServices() {
        if (isAppServicesEnabled) {
            disableAppServices()
        } else {
            enableAppServices()
        }
    }
    
    fun resetAppServicesSync() {
        appServicesSyncManager?.resetSync()
    }
    
    // MARK: - Enhanced Sync-Aware Operations
    fun updateQuantityWithAppServices(itemId: String, newQuantity: Int) {
        // Update using existing local method
        updateQuantity(itemId, newQuantity)
        
        // Also trigger App Services sync if enabled
        if (isAppServicesEnabled) {
            appServicesSyncManager?.pushDocumentImmediately(itemId)
        }
    }
    
    fun updateQuantityWithP2P(itemId: String, newQuantity: Int) {
        Log.d("DatabaseManager", "🔄 Updating quantity with P2P CRDT: $itemId -> $newQuantity")
        
        try {
            // Get the document from inventory collection
            val collection = database?.getCollection(AppConfig.COLLECTION_NAME, AppConfig.scopeName)
            val document = collection?.getDocument(itemId)?.toMutable()
            
            if (document == null) {
                Log.e("DatabaseManager", "❌ Document not found: $itemId")
                return
            }
            
            // Get device UUID as actor ID for CRDT
            val actorId = database?.getDeviceUUID() ?: "unknown-device"
            
            // 🔧 P2P SYNC FIX: Use CRDT counter on "quantity" field (matches iOS exactly)
            // iOS uses increment/decrement on CRDT "quantity" field
            val quantityCounter = document.getMutableCRDTCounter("quantity", actorId)
            val currentQuantity = quantityCounter.value
            val difference = newQuantity - currentQuantity
            
            Log.d("DatabaseManager", "🔧 Current: $currentQuantity, New: $newQuantity, Diff: $difference")
            
            // Apply the difference using CRDT operations (like iOS)
            if (difference > 0) {
                Log.d("DatabaseManager", "🔧 Incrementing by $difference")
                quantityCounter.increment(difference)
            } else if (difference < 0) {
                Log.d("DatabaseManager", "🔧 Decrementing by ${-difference}")
                quantityCounter.decrement(-difference)
            } else {
                Log.d("DatabaseManager", "🔧 No change needed (difference = 0)")
            }
            
            // 🔧 SYNC FIX: Also update stockQty as plain integer (matches iOS)
            // This ensures both platforms write to both fields
            val finalValue = quantityCounter.value
            document.setInt("stockQty", finalValue)
            
            // Save the document - MultipeerReplicator will detect and push this change
            // Use conflict handler for sync compatibility (Last Write Wins)
            collection.save(document, ConcurrencyControl.LAST_WRITE_WINS)
            
            Log.d("DatabaseManager", "✅ Updated quantity for $itemId: $currentQuantity → $finalValue")
            Log.d("DatabaseManager", "   🎭 Actor: $actorId")
            Log.d("DatabaseManager", "   📊 CRDT field: quantity, Plain field: stockQty")
            Log.d("DatabaseManager", "   📡 MultipeerReplicator will push this change to iOS")
            
            // Note: Reactive API will automatically detect the document change and update UI
            
        } catch (e: Exception) {
            Log.e("DatabaseManager", "❌ Failed to update quantity with P2P CRDT", e)
            // Fallback to regular update
            updateQuantity(itemId, newQuantity)
        }
    }
    
    fun updateQuantityWithSync(itemId: String, newQuantity: Int) {
        // Choose the appropriate update method based on sync type
        // IMPORTANT: App Services takes priority over P2P to avoid CRDT conflict storms
        // CRDT (P2P) creates 482+ revisions per update, causing conflicts with Web's simple updates
        when {
            isAppServicesEnabled -> updateQuantityWithAppServices(itemId, newQuantity)
            isP2PEnabled -> updateQuantityWithP2P(itemId, newQuantity)
            else -> updateQuantity(itemId, newQuantity)
        }
    }
    
    fun createGroceryItemWithSync(name: String, type: String, price: Double, imageURL: String, quantity: Int = 0): String? {
        // Create via App Services if enabled (will also save locally)
        if (isAppServicesEnabled) {
            appServicesSyncManager?.createGroceryItem(name, type, price, imageURL, quantity)?.let { itemId ->
                return itemId
            }
        }
        
        // Fallback to local creation
        val item = GroceryItem(name = name, type = type, price = price, imageURL = imageURL, quantity = quantity)
        saveGroceryItem(item)
        return item.id
    }
    
    // MARK: - P2P Sync Integration
    private fun setupP2PIntegration() {
        database?.let { db ->
            Log.d("DatabaseManager", "📡 Setting up P2P sync integration...")
            multipeerSyncManager = MultipeerSyncManager(context, db)
            Log.d("DatabaseManager", "✅ P2P sync integration ready")
        } ?: run {
            Log.e("DatabaseManager", "❌ Database not ready for P2P sync integration")
        }
    }
    
    fun enableP2P() {
        if (!AppConfig.ENABLE_P2P_SYNC) {
            Log.w("DatabaseManager", "⚠️ P2P sync is disabled in AppConfig")
            return
        }
        
        multipeerSyncManager?.let { syncManager ->
            Log.d("DatabaseManager", "🚀 Enabling P2P sync...")
            isP2PEnabled = true
            syncManager.start()
        } ?: run {
            Log.e("DatabaseManager", "❌ P2P sync manager not available")
        }
    }
    
    fun disableP2P() {
        multipeerSyncManager?.let { syncManager ->
            Log.d("DatabaseManager", "🛑 Disabling P2P sync...")
            isP2PEnabled = false
            syncManager.stop()
        }
    }
    
    fun toggleP2P() {
        if (isP2PEnabled) {
            disableP2P()
        } else {
            enableP2P()
        }
    }
    
    fun getP2PSyncState(): MultipeerSyncManager.P2PSyncState? {
        return multipeerSyncManager?.syncState?.value
    }
    
    // MARK: - Sync Status Information
    fun getSyncStatusSummary(): String {
        val statusParts = mutableListOf<String>()
        
        // Add App Services status
        appServicesSyncManager?.let { syncManager ->
            if (isAppServicesEnabled) {
                statusParts.add("☁️ ${syncManager.getSyncStatusSummary()}")
            } else {
                statusParts.add("☁️ App Services disabled")
            }
        }
        
        // Add P2P status
        multipeerSyncManager?.let { p2pManager ->
            val p2pState = p2pManager.syncState.value
            if (isP2PEnabled && p2pState.isRunning) {
                val peerCount = p2pState.connectedPeers.size
                statusParts.add("📡 P2P: $peerCount peer${if (peerCount == 1) "" else "s"}")
            } else {
                statusParts.add("📡 P2P available")
            }
        }
        
        return statusParts.joinToString(" • ")
    }
    
    fun getAppServicesSyncState(): AppServicesSyncState? {
        return appServicesSyncManager?.syncState?.value
    }
    
    // MARK: - Database Access
    fun getDatabase(): Database? = database
} 