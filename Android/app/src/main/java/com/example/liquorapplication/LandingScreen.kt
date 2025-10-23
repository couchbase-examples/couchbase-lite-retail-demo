package com.example.liquorapplication

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.List
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.ShoppingCart
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Store
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
    val databaseManager = LiquorApplication.databaseManager
    
    val navigationItems = listOf(
        NavigationItem("inventory", Icons.Default.List, "Inventory"),
        NavigationItem("profile", Icons.Default.Store, "Profile"),
        NavigationItem("orders", Icons.Default.ShoppingCart, "Orders")
    )
    
    // Scaffold with bottom navigation
    Scaffold(
        bottomBar = {
            NavigationBar(
                containerColor = Color(0xFF8E24AA),
                contentColor = Color.White
            ) {
                navigationItems.forEach { item ->
                    NavigationBarItem(
                        icon = { Icon(item.icon, contentDescription = item.label, tint = Color.White) },
                        label = { Text(item.label, color = Color.White) },
                        selected = currentScreen == item.route,
                        onClick = { currentScreen = item.route },
                        colors = NavigationBarItemDefaults.colors(
                            selectedIconColor = Color.White,
                            selectedTextColor = Color.White,
                            indicatorColor = Color(0xFF6A1B9A),
                            unselectedIconColor = Color.White.copy(alpha = 0.6f),
                            unselectedTextColor = Color.White.copy(alpha = 0.6f)
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
                    onBackPressed = { /* No back action needed with bottom nav */ }
                )
                "orders" -> OrdersScreen(
                    databaseManager = databaseManager,
                    onBackPressed = { /* No back action needed with bottom nav */ }
                )
            }
        }
    }
} 