package com.example.groceryapplication

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ShoppingCart
import androidx.compose.material.icons.outlined.AddCircle
import androidx.compose.material.icons.outlined.RemoveCircle
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import kotlinx.coroutines.delay

@Composable
fun GroceryItemCard(
    item: GroceryItem,
    onQuantityChanged: (Int) -> Unit,
    onReorder: (GroceryItem, Int) -> Unit = { _, _ -> },
    storeId: String = ""
) {
    var currentQuantity by remember { mutableStateOf(item.quantity) }
    var showOrderPlaced by remember { mutableStateOf(false) }
    var showOrderForm by remember { mutableStateOf(false) }
    
    LaunchedEffect(item.quantity) {
        currentQuantity = item.quantity
    }
    
    // Auto-hide order placed overlay after 2 seconds
    LaunchedEffect(showOrderPlaced) {
        if (showOrderPlaced) {
            kotlinx.coroutines.delay(2000)
            showOrderPlaced = false
        }
    }
    
    // Always use green color for quantity
    val quantityColor = Color(0xFF2EBC6E) // Green
    
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .height(440.dp)
    ) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .height(440.dp),
        elevation = CardDefaults.cardElevation(defaultElevation = 8.dp),
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White)
    ) {
        Column(
            modifier = Modifier.fillMaxSize()
        ) {
            // Product Image - larger size with minimal top padding
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(160.dp)
                    .padding(top = 2.dp),
                contentAlignment = Alignment.Center
            ) {
                AsyncImage(
                    model = item.imageURL,
                    contentDescription = item.name,
                    modifier = Modifier
                        .fillMaxWidth()
                        .aspectRatio(1f)
                        .clip(RoundedCornerShape(8.dp)),
                    contentScale = ContentScale.Fit
                )
                
                // Fallback shopping cart icon when image fails to load
                if (item.imageURL.isEmpty()) {
                    Icon(
                        imageVector = Icons.Default.ShoppingCart,
                        contentDescription = "Product Image",
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(32.dp),
                        tint = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }
            
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(top = 8.dp)
                    .padding(horizontal = 12.dp)
                    .padding(bottom = 12.dp),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                // Product name - bold, left aligned
                Text(
                    text = item.name,
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    maxLines = 2,
                    overflow = TextOverflow.Ellipsis,
                    color = MaterialTheme.colorScheme.onSurface,
                    modifier = Modifier.fillMaxWidth()
                )
                
                // Price only
                Text(
                    text = "Price: $${String.format("%.2f", item.price)}",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
                
                // Inventory Count Section
                Column(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Text(
                        text = "Inventory Count",
                        style = MaterialTheme.typography.bodyMedium,
                        fontWeight = FontWeight.Medium,
                        color = MaterialTheme.colorScheme.onSurface
                    )
                    
                    // Large quantity number with color coding
                    Text(
                        text = currentQuantity.toString(),
                        fontSize = 48.sp,
                        fontWeight = FontWeight.Bold,
                        color = quantityColor
                    )
                    
                    // Quantity controls - circular buttons
                    Row(
                        horizontalArrangement = Arrangement.spacedBy(16.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        IconButton(
                            onClick = {
                                if (currentQuantity > 0) {
                                    currentQuantity -= 1
                                    onQuantityChanged(currentQuantity)
                                }
                            },
                            enabled = currentQuantity > 0
                        ) {
                            Icon(
                                imageVector = Icons.Outlined.RemoveCircle,
                                contentDescription = "Decrease",
                                modifier = Modifier.size(32.dp),
                                tint = if (currentQuantity > 0) MaterialTheme.colorScheme.onSurfaceVariant else MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.3f)
                            )
                        }
                        
                        IconButton(
                            onClick = {
                                currentQuantity += 1
                                onQuantityChanged(currentQuantity)
                            }
                        ) {
                            Icon(
                                imageVector = Icons.Outlined.AddCircle,
                                contentDescription = "Increase",
                                modifier = Modifier.size(32.dp),
                                tint = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                    }
                }
                
                Spacer(modifier = Modifier.weight(1f))
                
                // Re-order button
                Button(
                    onClick = { 
                        showOrderForm = true
                    },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(48.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = Color(0xFFFC9C0C)
                    ),
                    shape = RoundedCornerShape(8.dp)
                ) {
                    Text(
                        text = "Re-order now",
                        color = Color.White,
                        fontWeight = FontWeight.SemiBold
                    )
                }
            }
        }
    }
    
    // Order Placed Overlay
    if (showOrderPlaced) {
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(Color(0xFF4CAF50).copy(alpha = 0.95f)),
            contentAlignment = Alignment.Center
        ) {
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                // Package icon
                Text(
                    text = "📦",
                    fontSize = 64.sp
                )
                
                Text(
                    text = "Order Placed!",
                    fontSize = 28.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color.White
                )
                
                Text(
                    text = "Replenishment order has been made",
                    fontSize = 16.sp,
                    color = Color.White.copy(alpha = 0.9f),
                    textAlign = TextAlign.Center
                )
            }
        }
    }
    }
    
    // Order Form Dialog
    if (showOrderForm) {
        OrderFormDialog(
            item = item,
            storeId = storeId,
            onDismiss = { showOrderForm = false },
            onCreateOrder = { quantity ->
                onReorder(item, quantity)
                showOrderForm = false
                showOrderPlaced = true
            }
        )
    }
}

