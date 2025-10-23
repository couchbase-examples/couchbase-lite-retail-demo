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
    var showLogoutDialog by remember { mutableStateOf(false) }
    var profileName by remember { mutableStateOf<String?>(null) }
    var isRefreshing by remember { mutableStateOf(false) }
    val scope = rememberCoroutineScope()
    
    fun refreshData() {
        scope.launch {
            isRefreshing = true
            android.util.Log.d("InventoryScreen", "🔄 Manual refresh started...")
            
            // DON'T stop the replicator! Continuous sync should be running 24/7
            // Just reload data from local DB - the continuous sync will have already pulled latest data
            android.util.Log.d("InventoryScreen", "📖 Reading latest data from local database...")
            
            // Reload data
            groceryItems = databaseManager.getAllGroceryItems()
            filteredItems = if (searchText.isEmpty()) {
                groceryItems
            } else {
                databaseManager.searchGrocery(searchText)
            }
            profileName = databaseManager.getStoreProfile()?.name
            
            isRefreshing = false
            android.util.Log.d("InventoryScreen", "✅ Manual refresh completed - items: ${groceryItems.size}")
        }
    }
    
    LaunchedEffect(Unit) {
        groceryItems = databaseManager.getAllGroceryItems()
        filteredItems = groceryItems
        // Load profile name
        profileName = databaseManager.getStoreProfile()?.name
    }
    
    // Logout confirmation dialog
    if (showLogoutDialog) {
        AlertDialog(
            onDismissRequest = { showLogoutDialog = false },
            title = { Text("Sign Out") },
            text = { Text("Are you sure you want to sign out?") },
            confirmButton = {
                TextButton(
                    onClick = {
                        authManager.logout()
                        showLogoutDialog = false
                        onBackPressed()
                    }
                ) {
                    Text("Sign Out")
                }
            },
            dismissButton = {
                TextButton(onClick = { showLogoutDialog = false }) {
                    Text("Cancel")
                }
            }
        )
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
            navigationIcon = {
                IconButton(onClick = { showLogoutDialog = true }) {
                    Icon(
                        imageVector = Icons.Default.Logout,
                        contentDescription = "Sign Out"
                    )
                }
            },
            actions = {
                // Refresh button
                IconButton(onClick = { refreshData() }) {
                    Icon(
                        imageVector = Icons.Default.Refresh,
                        contentDescription = "Refresh"
                    )
                }
                // App Services sync indicator
                AppServicesSyncIndicator(databaseManager = databaseManager)
            }
        )
        
        // App Services sync status bar
        AppServicesSyncStatusBar(databaseManager = databaseManager)
        
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
                        onQuantityChanged = { newQuantity ->
                            scope.launch {
                                // Use App Services-aware update method
                                databaseManager.updateQuantityWithAppServices(item.id, newQuantity)
                                groceryItems = databaseManager.getAllGroceryItems()
                                filteredItems = if (searchText.isEmpty()) {
                                    groceryItems
                                } else {
                                    databaseManager.searchGrocery(searchText)
                                }
                            }
                        },
                        onReorder = { groceryItem ->
                            scope.launch {
                                databaseManager.createOrder(groceryItem, quantity = 100)
                            }
                        }
                    )
                }
            }
        }
    }
} 