package com.example.groceryapplication

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun OrdersScreen(
    databaseManager: DatabaseManager,
    onBackPressed: () -> Unit
) {
    var orders by remember { mutableStateOf<List<Order>>(emptyList()) }
    var isLoading by remember { mutableStateOf(true) }
    var selectedFilter by remember { mutableStateOf("All") }  // "All", "In Review", "Approved"
    
    // Use Reactive API (Flow) for automatic updates
    LaunchedEffect(Unit) {
        android.util.Log.d("OrdersScreen", "🔄 [Reactive API] Setting up Flow collection...")
        
        databaseManager.getOrdersFlow().collect { ordersList ->
            orders = ordersList
            isLoading = false
            android.util.Log.d("OrdersScreen", "✅ [Reactive API] Flow emitted: ${ordersList.size} orders")
        }
    }
    
    // Filter orders based on selected filter
    val filteredOrders = when (selectedFilter) {
        "In Review" -> orders.filter { it.orderStatus == "In Review" }
        "Approved" -> orders.filter { it.orderStatus == "Approved" }
        else -> orders
    }
    
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
    ) {
        TopAppBar(
            title = { Text("Orders", fontWeight = FontWeight.SemiBold) },
            navigationIcon = {
                IconButton(onClick = onBackPressed) {
                    Icon(
                        Icons.AutoMirrored.Filled.ArrowBack,
                        contentDescription = "Back",
                        tint = Color(0xFF007AFF)  // iOS blue
                    )
                }
            },
            actions = {
                IconButton(onClick = { 
                    // Reactive Flow handles updates automatically
                    android.util.Log.d("OrdersScreen", "ℹ️ Refresh requested - Flow handles updates automatically")
                }) {
                    Icon(
                        Icons.Default.Refresh, 
                        contentDescription = "Refresh",
                        tint = Color(0xFF007AFF)  // iOS blue
                    )
                }
            },
            colors = TopAppBarDefaults.topAppBarColors(
                containerColor = MaterialTheme.colorScheme.surface,
                titleContentColor = MaterialTheme.colorScheme.onSurface
            )
        )
        
        // Filter Tabs
        TabRow(
            selectedTabIndex = when (selectedFilter) {
                "All" -> 0
                "In Review" -> 1
                "Approved" -> 2
                else -> 0
            },
            containerColor = MaterialTheme.colorScheme.surface,
            contentColor = Color(0xFF007AFF)
        ) {
            Tab(
                selected = selectedFilter == "All",
                onClick = { selectedFilter = "All" },
                text = { 
                    Text(
                        "All",
                        fontWeight = if (selectedFilter == "All") FontWeight.SemiBold else FontWeight.Normal
                    ) 
                },
                selectedContentColor = Color(0xFF007AFF),
                unselectedContentColor = Color(0xFF8E8E93)
            )
            Tab(
                selected = selectedFilter == "In Review",
                onClick = { selectedFilter = "In Review" },
                text = { 
                    Text(
                        "In Review",
                        fontWeight = if (selectedFilter == "In Review") FontWeight.SemiBold else FontWeight.Normal
                    ) 
                },
                selectedContentColor = Color(0xFF007AFF),
                unselectedContentColor = Color(0xFF8E8E93)
            )
            Tab(
                selected = selectedFilter == "Approved",
                onClick = { selectedFilter = "Approved" },
                text = { 
                    Text(
                        "Approved",
                        fontWeight = if (selectedFilter == "Approved") FontWeight.SemiBold else FontWeight.Normal
                    ) 
                },
                selectedContentColor = Color(0xFF007AFF),
                unselectedContentColor = Color(0xFF8E8E93)
            )
        }
        
        if (isLoading) {
            Box(
                modifier = Modifier.fillMaxSize(),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = "Loading orders...",
                    style = MaterialTheme.typography.bodyLarge
                )
            }
        } else if (filteredOrders.isEmpty()) {
            Box(
                modifier = Modifier.fillMaxSize(),
                contentAlignment = Alignment.Center
            ) {
                Column(
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.spacedBy(16.dp)
                ) {
                    Text(
                        text = "📦",
                        style = MaterialTheme.typography.displayLarge
                    )
                    Text(
                        text = "No orders yet",
                        style = MaterialTheme.typography.titleLarge,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    Text(
                        text = "Orders will appear here when you tap 'Re-order now' on products",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }
        } else {
            LazyColumn(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(horizontal = 16.dp, vertical = 12.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                items(filteredOrders) { order ->
                    OrderCard(order = order)
                }
            }
        }
    }
}

@Composable
fun OrderCard(order: Order) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),  // Subtle shadow like iOS
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        shape = RoundedCornerShape(12.dp)  // Rounded corners like iOS
    ) {
        Column(
            modifier = Modifier.padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            // Header Row
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "Order #${order.orderId}",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.onSurface
                )
                
                // Status Badge - More subtle iOS-like design
                Surface(
                    shape = RoundedCornerShape(8.dp),
                    color = when (order.orderStatus) {
                        "Approved" -> Color(0xFF34C759)  // iOS green
                        "In Review" -> Color(0xFF007AFF)  // iOS blue
                        "Submitted" -> Color(0xFFFFCC00)  // iOS yellow (legacy)
                        else -> Color(0xFF8E8E93)  // iOS gray
                    }.copy(alpha = 0.15f)  // More subtle background
                ) {
                    Text(
                        text = order.orderStatus,
                        modifier = Modifier.padding(horizontal = 10.dp, vertical = 5.dp),
                        style = MaterialTheme.typography.labelSmall,
                        fontWeight = FontWeight.SemiBold,
                        color = when (order.orderStatus) {
                            "Approved" -> Color(0xFF34C759)  // iOS green
                            "In Review" -> Color(0xFF007AFF)  // iOS blue
                            "Submitted" -> Color(0xFFFF9500)  // Darker orange for readability
                            else -> Color(0xFF8E8E93)  // iOS gray
                        }
                    )
                }
            }
            
            // Order Details - Clean layout
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = "SKU",
                        style = MaterialTheme.typography.bodySmall,
                        color = Color(0xFF8E8E93)  // iOS gray
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = order.sku,
                        style = MaterialTheme.typography.bodyMedium,
                        fontWeight = FontWeight.Medium,
                        color = MaterialTheme.colorScheme.onSurface
                    )
                }
                
                Column(modifier = Modifier.weight(1f), horizontalAlignment = Alignment.End) {
                    Text(
                        text = "Quantity",
                        style = MaterialTheme.typography.bodySmall,
                        color = Color(0xFF8E8E93)  // iOS gray
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = "${order.orderQty} ${order.unit}",
                        style = MaterialTheme.typography.bodyMedium,
                        fontWeight = FontWeight.Medium,
                        color = MaterialTheme.colorScheme.onSurface
                    )
                }
            }
            
            // Product ID
            Row {
                Text(
                    text = "Product ID: ",
                    style = MaterialTheme.typography.bodySmall,
                    color = Color(0xFF8E8E93)  // iOS gray
                )
                Text(
                    text = order.productId.toString(),
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurface,
                    fontWeight = FontWeight.Medium
                )
            }
            
            // Subtle divider
            Divider(
                color = Color(0xFFE5E5EA),  // iOS separator color
                thickness = 0.5.dp
            )
            
            // Date and Order ID - Clean footer
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = formatDate(order.orderDate),
                    style = MaterialTheme.typography.bodySmall,
                    color = Color(0xFF8E8E93)  // iOS gray
                )
                
                Text(
                    text = order.id,
                    style = MaterialTheme.typography.labelSmall,
                    color = Color(0xFFC7C7CC),  // Lighter iOS gray for secondary info
                    maxLines = 1
                )
            }
        }
    }
}

private fun formatDate(timestamp: Long): String {
    val formatter = SimpleDateFormat("MMM dd, yyyy HH:mm", Locale.getDefault())
    return formatter.format(Date(timestamp))
}

