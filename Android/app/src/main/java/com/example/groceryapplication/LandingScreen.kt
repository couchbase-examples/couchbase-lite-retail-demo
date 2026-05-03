package com.example.groceryapplication

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.List
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.ShoppingCart
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Store
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

// Bottom Navigation Item
data class NavigationItem(
    val route: String,
    val icon: ImageVector,
    val label: String
)

@Composable
fun LandingScreen(
    authManager: AuthenticationManager,
    onLogout: () -> Unit
) {
    var currentScreen by remember { mutableStateOf("inventory") } // Start with inventory
    val context = LocalContext.current
    val databaseManager = GroceryApplication.databaseManager
    
    val navigationItems = listOf(
        NavigationItem("inventory", Icons.AutoMirrored.Filled.List, "Inventory"),
        NavigationItem("profile", Icons.Default.Store, "Profile"),
        NavigationItem("orders", Icons.Default.ShoppingCart, "Orders"),
        NavigationItem("settings", Icons.Default.Settings, "Settings")
    )
    
    // Scaffold with bottom navigation - Clean iOS-like design
    Scaffold(
        bottomBar = {
            NavigationBar(
                containerColor = MaterialTheme.colorScheme.surface,
                contentColor = Color(0xFF007AFF)     // iOS blue for active items
            ) {
                navigationItems.forEach { item ->
                    NavigationBarItem(
                        icon = { 
                            Icon(
                                item.icon, 
                                contentDescription = item.label,
                                tint = if (currentScreen == item.route) Color(0xFF007AFF) else Color(0xFF8E8E93)
                            ) 
                        },
                        label = { 
                            Text(
                                item.label, 
                                color = if (currentScreen == item.route) Color(0xFF007AFF) else Color(0xFF8E8E93)
                            ) 
                        },
                        selected = currentScreen == item.route,
                        onClick = { currentScreen = item.route },
                        colors = NavigationBarItemDefaults.colors(
                            selectedIconColor = Color(0xFF007AFF),        // iOS blue
                            selectedTextColor = Color(0xFF007AFF),        // iOS blue
                            indicatorColor = Color(0xFFE5E5EA),           // Very subtle indicator
                            unselectedIconColor = Color(0xFF8E8E93),      // iOS gray
                            unselectedTextColor = Color(0xFF8E8E93)       // iOS gray
                        )
                    )
                }
            }
        }
    ) { paddingValues ->
        Box(modifier = Modifier.padding(paddingValues)) {
            when (currentScreen) {
                "inventory" -> InventoryScreen(
                    onBackPressed = { 
                        if (!authManager.isAuthenticated) {
                            onLogout()
                        }
                    },
                    authManager = authManager,
                    databaseManager = databaseManager
                )
                "profile" -> ProfileScreen(
                    authManager = authManager,
                    databaseManager = databaseManager,
                    onBackPressed = { currentScreen = "inventory" }
                )
                "orders" -> OrdersScreen(
                    databaseManager = databaseManager,
                    onBackPressed = { currentScreen = "inventory" }
                )
                "settings" -> SettingsScreen(
                    authManager = authManager,
                    databaseManager = databaseManager,
                    onBackPressed = { currentScreen = "inventory" },
                    onLogout = onLogout // Pass logout callback to navigate to login
                )
            }
        }
    }
} 