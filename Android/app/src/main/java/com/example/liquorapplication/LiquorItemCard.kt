package com.example.liquorapplication

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun LiquorItemCard(
    item: LiquorItem,
    onQuantityChanged: (Int) -> Unit
) {
    var currentQuantity by remember { mutableStateOf(item.quantity) }
    
    LaunchedEffect(item.quantity) {
        currentQuantity = item.quantity
    }
    
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .height(280.dp),
        elevation = CardDefaults.cardElevation(defaultElevation = 4.dp),
        shape = RoundedCornerShape(15.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(12.dp),
            verticalArrangement = Arrangement.SpaceBetween
        ) {
            // Image placeholder
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(100.dp)
                    .clip(RoundedCornerShape(10.dp))
                    .background(Color(0xFF8E24AA).copy(alpha = 0.2f)),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = "🍷",
                    fontSize = 48.sp
                )
            }
            
            // Item details
            Column(
                modifier = Modifier.fillMaxWidth(),
                verticalArrangement = Arrangement.spacedBy(4.dp)
            ) {
                // Name
                Text(
                    text = item.name,
                    style = MaterialTheme.typography.titleSmall,
                    fontWeight = FontWeight.SemiBold,
                    maxLines = 2,
                    overflow = TextOverflow.Ellipsis,
                    lineHeight = 18.sp
                )
                
                // Type
                Text(
                    text = item.type,
                    modifier = Modifier
                        .background(
                            color = Color(0xFF3F51B5).copy(alpha = 0.1f),
                            shape = RoundedCornerShape(6.dp)
                        )
                        .padding(horizontal = 8.dp, vertical = 2.dp),
                    style = MaterialTheme.typography.labelSmall,
                    color = Color(0xFF3F51B5)
                )
                
                // Price
                Text(
                    text = "$${String.format("%.2f", item.price)}",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF4CAF50)
                )
            }
            
            // Quantity controls
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "Qty:",
                    style = MaterialTheme.typography.labelSmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
                
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    TextButton(
                        onClick = {
                            if (currentQuantity > 0) {
                                currentQuantity -= 1
                                onQuantityChanged(currentQuantity)
                            }
                        },
                        modifier = Modifier.size(32.dp),
                        enabled = currentQuantity > 0,
                        contentPadding = PaddingValues(0.dp)
                    ) {
                        Text(
                            text = "−",
                            fontSize = 20.sp,
                            color = if (currentQuantity > 0) Color(0xFFF44336) else Color.Gray
                        )
                    }
                    
                    Text(
                        text = currentQuantity.toString(),
                        style = MaterialTheme.typography.titleSmall,
                        fontWeight = FontWeight.SemiBold,
                        modifier = Modifier.widthIn(min = 24.dp)
                    )
                    
                    TextButton(
                        onClick = {
                            currentQuantity += 1
                            onQuantityChanged(currentQuantity)
                        },
                        modifier = Modifier.size(32.dp),
                        contentPadding = PaddingValues(0.dp)
                    ) {
                        Text(
                            text = "+",
                            fontSize = 20.sp,
                            color = Color(0xFF4CAF50)
                        )
                    }
                }
            }
        }
    }
} 