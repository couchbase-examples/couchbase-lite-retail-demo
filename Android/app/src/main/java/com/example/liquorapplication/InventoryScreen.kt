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

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun InventoryScreen(
    onBackPressed: () -> Unit,
    databaseManager: DatabaseManager
) {
    var searchText by remember { mutableStateOf("") }
    var liquorItems by remember { mutableStateOf<List<LiquorItem>>(emptyList()) }
    var filteredItems by remember { mutableStateOf<List<LiquorItem>>(emptyList()) }
    val scope = rememberCoroutineScope()
    
    LaunchedEffect(Unit) {
        liquorItems = databaseManager.getAllLiquorItems()
        filteredItems = liquorItems
    }
    
    Column(modifier = Modifier.fillMaxSize()) {
        TopAppBar(
            title = {
                Text("Liquor Inventory")
            },
            navigationIcon = {
                IconButton(onClick = onBackPressed) {
                    Icon(
                        imageVector = Icons.Default.ArrowBack,
                        contentDescription = "Back"
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
                        liquorItems
                    } else {
                        databaseManager.searchLiquor(newValue)
                    }
                }
            },
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            placeholder = { Text("Search liquor...") },
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
                LiquorItemCard(
                    item = item,
                    onQuantityChanged = { newQuantity ->
                        scope.launch {
                            // Use App Services-aware update method
                            databaseManager.updateQuantityWithAppServices(item.id, newQuantity)
                            liquorItems = databaseManager.getAllLiquorItems()
                            filteredItems = if (searchText.isEmpty()) {
                                liquorItems
                            } else {
                                databaseManager.searchLiquor(searchText)
                            }
                        }
                    }
                )
            }
        }
    }
} 