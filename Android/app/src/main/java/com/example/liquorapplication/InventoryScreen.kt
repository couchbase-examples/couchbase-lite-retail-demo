package com.example.liquorapplication

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.gestures.detectVerticalDragGestures
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.unit.dp
import kotlinx.coroutines.launch

import androidx.compose.material.icons.filled.Logout

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun InventoryScreen(
    onBackPressed: () -> Unit,
    authManager: AuthenticationManager,
    databaseManager: DatabaseManager
) {
    var searchText by remember { mutableStateOf("") }
    var groceryItems by remember { mutableStateOf<List<GroceryItem>>(emptyList()) }
    var filteredItems by remember { mutableStateOf<List<GroceryItem>>(emptyList()) }
    var profileName by remember { mutableStateOf<String?>(null) }
    var isRefreshing by remember { mutableStateOf(false) }
    val scope = rememberCoroutineScope()
    
    // Manual refresh now just gives visual feedback - Flow handles data updates automatically
    fun refreshData() {
        scope.launch {
            isRefreshing = true
            android.util.Log.d("InventoryScreen", "🔄 [Manual Refresh] Started...")
            
            // Reactive Flow will automatically update when data changes
            // This manual refresh just gives visual feedback to user
            kotlinx.coroutines.delay(500)
            
            // Reload profile name
            profileName = databaseManager.getStoreProfile()?.name
            
            isRefreshing = false
            android.util.Log.d("InventoryScreen", "✅ [Manual Refresh] Completed - Flow handles data updates")
        }
    }
    
    // MARK: - Reactive API Setup (Kotlin Flow)
    // Automatically collect updates from Flow - no manual refresh needed!
    LaunchedEffect(Unit) {
        android.util.Log.d("InventoryScreen", "🔄 [Reactive API] Setting up Flow collection...")
        
        // Load profile name
        profileName = databaseManager.getStoreProfile()?.name
        
        // Collect from Flow - this automatically updates when data changes
        databaseManager.getGroceryItemsFlow().collect { items ->
            groceryItems = items
            filteredItems = if (searchText.isEmpty()) {
                items
            } else {
                items.filter { item ->
                    item.name.contains(searchText, ignoreCase = true) ||
                    item.type.contains(searchText, ignoreCase = true)
                }
            }
            android.util.Log.d("InventoryScreen", "✅ [Reactive API] Flow emitted: ${items.size} items")
        }
    }
    
    Column(modifier = Modifier.fillMaxSize()) {
        TopAppBar(
            title = {
                Column {
                    Text("Grocery Mart Inventory")
                    // Show store profile name (from Capella) with Welcome and truncation
                    val displayName = profileName ?: authManager.currentUser?.fullName ?: ""
                    // Truncate if longer than 35 characters
                    val truncatedName = if (displayName.length > 35) {
                        displayName.take(32) + "..."
                    } else {
                        displayName
                    }
                    if (displayName.isNotEmpty()) {
                        Text(
                            text = "Welcome, $truncatedName",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                            maxLines = 1
                        )
                    }
                }
            },
            actions = {
                // No actions - moved to Settings screen
            }
        )
        
        // Search bar
        OutlinedTextField(
            value = searchText,
            onValueChange = { newValue ->
                searchText = newValue
                scope.launch {
                    filteredItems = if (newValue.isEmpty()) {
                        groceryItems
                    } else {
                        databaseManager.searchGrocery(newValue)
                    }
                }
            },
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            placeholder = { Text("Search products...") },
            leadingIcon = {
                Icon(
                    imageVector = Icons.Default.Search,
                    contentDescription = "Search"
                )
            },
            singleLine = true
        )
        
        // Show refreshing indicator if needed
        if (isRefreshing) {
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 8.dp),
                colors = CardDefaults.cardColors(
                    containerColor = MaterialTheme.colorScheme.primaryContainer
                )
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(12.dp),
                    horizontalArrangement = Arrangement.Center,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "🔄 Syncing data from Capella...",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onPrimaryContainer
                    )
                }
            }
        }
        
        // Inventory grid (pull down on first item to refresh)
        Box(modifier = Modifier.fillMaxSize()) {
            LazyVerticalGrid(
                columns = GridCells.Fixed(2),
                contentPadding = PaddingValues(16.dp),
                horizontalArrangement = Arrangement.spacedBy(12.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp),
                modifier = Modifier.pointerInput(Unit) {
                    var dragAmount = 0f
                    detectVerticalDragGestures(
                        onDragEnd = {
                            if (dragAmount > 300f && !isRefreshing) {
                                refreshData()
                            }
                            dragAmount = 0f
                        },
                        onVerticalDrag = { _, dragDelta ->
                            dragAmount += dragDelta
                        }
                    )
                }
            ) {
                items(filteredItems) { item ->
                    GroceryItemCard(
                        item = item,
                        storeId = AppConfig.storeId,
                        onQuantityChanged = { newQuantity ->
                            scope.launch {
                                // Use sync-aware update method (P2P or App Services)
                                databaseManager.updateQuantityWithSync(item.id, newQuantity)
                                groceryItems = databaseManager.getAllGroceryItems()
                                filteredItems = if (searchText.isEmpty()) {
                                    groceryItems
                                } else {
                                    databaseManager.searchGrocery(searchText)
                                }
                            }
                        },
                        onReorder = { groceryItem, quantity ->
                            scope.launch {
                                databaseManager.createOrder(groceryItem, quantity = quantity)
                            }
                        }
                    )
                }
            }
        }
    }
}

// MARK: - P2P Sync UI Components

/**
 * P2P Sync Indicator - Shows in top app bar
 */
@Composable
fun P2PSyncIndicator(databaseManager: DatabaseManager) {
    var showDialog by remember { mutableStateOf(false) }
    
    // Collect P2P sync state
    val p2pSyncState = databaseManager.multipeerSyncManager?.syncState?.collectAsState()?.value
        ?: MultipeerSyncManager.P2PSyncState()
    
    // Show compact badge
    CompactP2PStatusBadge(
        syncState = p2pSyncState,
        onClick = { showDialog = true }
    )
    
    // Show dialog when clicked
    if (showDialog) {
        P2PSyncDialog(
            syncState = p2pSyncState,
            onDismiss = { showDialog = false },
            onToggle = { databaseManager.toggleP2P() }
        )
    }
}

/**
 * P2P Sync Status Bar - Shows below App Services status bar
 */
@Composable
fun P2PSyncStatusBar(databaseManager: DatabaseManager) {
    // Collect P2P sync state
    val p2pSyncState = databaseManager.multipeerSyncManager?.syncState?.collectAsState()?.value
        ?: MultipeerSyncManager.P2PSyncState()
    
    // Get permission status
    val permissionStatus = databaseManager.multipeerSyncManager?.getPermissionStatus()
    
    // Only show if P2P is available
    if (AppConfig.ENABLE_P2P_SYNC) {
        P2PSyncStatusCard(
            syncState = p2pSyncState,
            onToggle = { databaseManager.toggleP2P() },
            modifier = Modifier.padding(horizontal = 16.dp, vertical = 4.dp),
            permissionStatus = permissionStatus
        )
    }
} 