package com.example.liquorapplication

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
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
    val scope = rememberCoroutineScope()
    
    LaunchedEffect(Unit) {
        groceryItems = databaseManager.getAllGroceryItems()
        filteredItems = groceryItems
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
                    // Show store profile with Welcome
                    authManager.currentUser?.let { user ->
                        Text(
                            text = "Welcome, ${user.fullName}",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
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
        
        // Inventory grid
        LazyVerticalGrid(
            columns = GridCells.Fixed(2),
            contentPadding = PaddingValues(16.dp),
            horizontalArrangement = Arrangement.spacedBy(12.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
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
                        // TODO: Implement reorder functionality
                        println("Reorder: ${groceryItem.name}")
                    }
                )
            }
        }
    }
} 