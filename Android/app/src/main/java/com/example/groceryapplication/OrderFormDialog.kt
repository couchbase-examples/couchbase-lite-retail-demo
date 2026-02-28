package com.example.groceryapplication

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.Dialog

@Composable
fun OrderFormDialog(
    item: GroceryItem,
    storeId: String,
    onDismiss: () -> Unit,
    onCreateOrder: (Int) -> Unit
) {
    var orderQuantity by remember { mutableStateOf("100") }
    var isCreatingOrder by remember { mutableStateOf(false) }

    Dialog(onDismissRequest = onDismiss) {
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            elevation = CardDefaults.cardElevation(8.dp)
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(24.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                // Header
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "Create Order",
                        style = MaterialTheme.typography.headlineSmall,
                        fontWeight = FontWeight.Bold
                    )
                    IconButton(onClick = onDismiss) {
                        Icon(Icons.Default.Close, contentDescription = "Close")
                    }
                }

                Divider()

                // Product Information (Read-only)
                OrderFieldReadOnly(label = "Product Name", value = item.name)
                OrderFieldReadOnly(label = "Product ID", value = item.productId?.toString() ?: "N/A")
                OrderFieldReadOnly(label = "SKU", value = item.sku ?: "N/A")
                OrderFieldReadOnly(label = "Store ID", value = storeId)
                OrderFieldReadOnly(label = "Unit", value = item.unit ?: "N/A")
                OrderFieldReadOnly(label = "Order Status", value = "Submitted")

                // Order Quantity (Editable)
                OutlinedTextField(
                    value = orderQuantity,
                    onValueChange = { orderQuantity = it },
                    label = { Text("Order Quantity") },
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                    modifier = Modifier.fillMaxWidth(),
                    singleLine = true,
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = MaterialTheme.colorScheme.primary
                    )
                )

                Spacer(modifier = Modifier.height(8.dp))

                // Action Buttons
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    OutlinedButton(
                        onClick = onDismiss,
                        modifier = Modifier.weight(1f),
                        enabled = !isCreatingOrder
                    ) {
                        Text("Cancel")
                    }
                    Button(
                        onClick = {
                            val qty = orderQuantity.toIntOrNull() ?: 100
                            if (qty > 0) {
                                isCreatingOrder = true
                                onCreateOrder(qty)
                            }
                        },
                        modifier = Modifier.weight(1f),
                        enabled = !isCreatingOrder && orderQuantity.toIntOrNull() != null && orderQuantity.toIntOrNull()!! > 0
                    ) {
                        if (isCreatingOrder) {
                            Text("Creating...")
                        } else {
                            Text("Create Order")
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun OrderFieldReadOnly(label: String, value: String) {
    Column(modifier = Modifier.fillMaxWidth()) {
        Text(
            text = label,
            style = MaterialTheme.typography.labelMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )
        Spacer(modifier = Modifier.height(4.dp))
        Text(
            text = value,
            style = MaterialTheme.typography.bodyLarge,
            fontWeight = FontWeight.Medium
        )
    }
}

