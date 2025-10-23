package com.example.liquorapplication

import android.content.Context
import android.util.Log
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import com.couchbase.lite.*
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class DatabaseManager(private val context: Context) {
    private var database: Database? = null
    private val databaseName = AppConfig.DATABASE_NAME
    private val collectionName = AppConfig.COLLECTION_NAME
    
    // App Services Integration
    var appServicesSyncManager: AppServicesSyncManager? = null
        private set
    var isAppServicesEnabled by mutableStateOf(false)
        private set
    
    init {
        // Print configuration on startup
        AppConfig.printConfiguration()
        
        openDatabase()
        setupIndexes() // Setup both basic and vector indexes
        // REMOVED: Hard-coded data seeding - data will come from App Services
        // seedSampleData()
        setupAppServicesIntegration()
        
        // Auto-enable App Services if configured
        if (AppConfig.ENABLE_APP_SERVICES_SYNC) {
            enableAppServices()
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
                
                collection.save(document)
                Log.d("DatabaseManager", "Saved grocery item: ${item.name}")
            } catch (e: Exception) {
                Log.e("DatabaseManager", "Error saving grocery item", e)
            }
        }
    }
    
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
                        
                        // Map 'stockQty' from Capella to 'quantity' in app
                        val quantity = it.getInt("stockQty").takeIf { q -> q > 0 } 
                            ?: it.getInt("quantity")
                        
                        val item = GroceryItem(id, name, type, price, imageURL, quantity)
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
                    collection.save(mutableDoc)
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
                        
                        // Map 'stockQty' from Capella to 'quantity' in app
                        val quantity = it.getInt("stockQty").takeIf { q -> q > 0 } 
                            ?: it.getInt("quantity")
                        
                        // Filter in code to match search text (case insensitive)
                        val nameUpper = name.uppercase()
                        val typeUpper = type.uppercase()
                        
                        if ((nameUpper.contains(upperSearchText) || typeUpper.contains(upperSearchText)) && !seenIds.contains(id)) {
                            val item = GroceryItem(id, name, type, price, imageURL, quantity)
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
    suspend fun getAllOrders(): List<Order> = withContext(Dispatchers.IO) {
        database?.let { db ->
            try {
                val collection = db.getCollection(AppConfig.ORDERS_COLLECTION_NAME, AppConfig.scopeName) 
                    ?: return@withContext emptyList()
                    
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
                        val order = Order(
                            id = it.getString("id") ?: return@let,
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
    
    suspend fun createOrder(item: GroceryItem, quantity: Int = 100): Order? = withContext(Dispatchers.IO) {
        database?.let { db ->
            try {
                val collection = db.getCollection(AppConfig.ORDERS_COLLECTION_NAME, AppConfig.scopeName) 
                    ?: db.createCollection(AppConfig.ORDERS_COLLECTION_NAME, AppConfig.scopeName)
                
                // Get next order ID
                val existingOrders = getAllOrders()
                val nextOrderId = (existingOrders.maxOfOrNull { it.orderId } ?: 0) + 1
                
                val orderId = "Order_${AppConfig.storeId.uppercase()}_$nextOrderId"
                val order = Order(
                    id = orderId,
                    docType = "Order",
                    orderId = nextOrderId,
                    storeId = AppConfig.storeId,
                    orderDate = System.currentTimeMillis(),
                    orderStatus = "Submitted",
                    productId = item.id.hashCode(), // Simple productId generation
                    sku = item.id,
                    unit = "bag", // Default unit
                    orderQty = quantity
                )
                
                val document = MutableDocument(orderId)
                document.setString("id", order.id)
                document.setString("docType", order.docType)
                document.setInt("orderId", order.orderId)
                document.setString("storeId", order.storeId)
                document.setLong("orderDate", order.orderDate)
                document.setString("orderStatus", order.orderStatus)
                document.setInt("productId", order.productId)
                document.setString("sku", order.sku)
                document.setString("unit", order.unit)
                document.setInt("orderQty", order.orderQty)
                
                collection.save(document)
                Log.d("DatabaseManager", "Created order: $orderId")
                
                // Trigger sync if App Services is enabled
                if (isAppServicesEnabled) {
                    appServicesSyncManager?.pushDocumentImmediately(orderId)
                }
                
                return@withContext order
            } catch (e: Exception) {
                Log.e("DatabaseManager", "Error creating order", e)
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
        
        // Add P2P status (you can add P2P integration later)
        statusParts.add("📡 P2P available")
        
        return statusParts.joinToString(" • ")
    }
    
    fun getAppServicesSyncState(): AppServicesSyncState? {
        return appServicesSyncManager?.syncState?.value
    }
    
    // MARK: - Database Access
    fun getDatabase(): Database? = database
} 