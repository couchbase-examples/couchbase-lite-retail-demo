package com.example.groceryapplication

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Cloud
import androidx.compose.material.icons.filled.CloudOff
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.runtime.collectAsState
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.Dialog
import java.text.SimpleDateFormat
import java.util.*

// MARK: - App Services Sync Indicator
@Composable
fun AppServicesSyncIndicator(
    databaseManager: DatabaseManager,
    modifier: Modifier = Modifier
) {
    var showSyncDialog by remember { mutableStateOf(false) }
    
    Row(
        modifier = modifier
            .clickable { showSyncDialog = true }
            .padding(horizontal = 8.dp, vertical = 4.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(4.dp)
    ) {
        Icon(
            imageVector = if (databaseManager.isAppServicesEnabled) Icons.Filled.Cloud else Icons.Filled.CloudOff,
            contentDescription = "App Services Sync",
            tint = if (databaseManager.isAppServicesEnabled) Color.Green else Color.Gray,
            modifier = Modifier.size(16.dp)
        )
        
        Column(
            horizontalAlignment = Alignment.End
        ) {
            Text(
                text = "☁️",
                style = MaterialTheme.typography.bodySmall,
                color = if (databaseManager.isAppServicesEnabled) Color.Green else Color.Gray
            )
            Text(
                text = if (databaseManager.isAppServicesEnabled) "ON" else "OFF",
                style = MaterialTheme.typography.labelSmall,
                color = if (databaseManager.isAppServicesEnabled) Color.Green else Color.Gray
            )
        }
    }
    
    if (showSyncDialog) {
        ModernSyncDialog(
            databaseManager = databaseManager,
            onDismiss = { showSyncDialog = false }
        )
    }
}

// MARK: - App Services Sync Dialog
@Composable
fun AppServicesSyncDialog(
    databaseManager: DatabaseManager,
    onDismiss: () -> Unit
) {
    val syncManager = databaseManager.appServicesSyncManager ?: return
    val syncState by syncManager.syncState.collectAsState()
    
    Dialog(onDismissRequest = onDismiss) {
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            shape = RoundedCornerShape(20.dp),
            colors = CardDefaults.cardColors(
                containerColor = MaterialTheme.colorScheme.surface
            ),
            elevation = CardDefaults.cardElevation(defaultElevation = 8.dp)
        ) {
            Column(
                modifier = Modifier.padding(24.dp),
                verticalArrangement = Arrangement.spacedBy(24.dp)
            ) {
                // Header
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Filled.Cloud,
                            contentDescription = null,
                            tint = MaterialTheme.colorScheme.primary
                        )
                        Text(
                            text = "App Services Sync",
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.SemiBold
                        )
                    }
                    
                    // Toggle button
                    Button(
                        onClick = { databaseManager.toggleAppServices() },
                        colors = ButtonDefaults.buttonColors(
                            containerColor = if (databaseManager.isAppServicesEnabled) 
                                MaterialTheme.colorScheme.error.copy(alpha = 0.2f) 
                            else 
                                MaterialTheme.colorScheme.primary.copy(alpha = 0.2f)
                        )
                    ) {
                        Text(
                            text = if (databaseManager.isAppServicesEnabled) "Disable" else "Enable",
                            color = if (databaseManager.isAppServicesEnabled) 
                                MaterialTheme.colorScheme.error 
                            else 
                                MaterialTheme.colorScheme.primary,
                            style = MaterialTheme.typography.labelMedium
                        )
                    }
                }
                
                // Sync Status
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Box(
                        modifier = Modifier
                            .size(8.dp)
                            .clip(CircleShape)
                            .background(
                                if (syncState.isConnected) Color.Green else Color.Red
                            )
                    )
                    
                    Text(
                        text = syncState.status,
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurface
                    )
                }
                
                // Progress bar (if syncing)
                if (syncState.progress > 0f && syncState.progress < 1f) {
                    Column(
                        verticalArrangement = Arrangement.spacedBy(4.dp)
                    ) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text(
                                text = "Syncing...",
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                            Text(
                                text = "${(syncState.progress * 100).toInt()}%",
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                        
                        LinearProgressIndicator(
                            progress = syncState.progress,
                            modifier = Modifier.fillMaxWidth()
                        )
                    }
                }
                
                // Last sync time
                syncState.lastSyncTime?.let { lastSync ->
                    Text(
                        text = "Last sync: ${formatTime(lastSync)}",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
                
                // Error display
                syncState.error?.let { error ->
                    Text(
                        text = "Error: $error",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.error,
                        maxLines = 2
                    )
                }
                
                // Control buttons
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    if (databaseManager.isAppServicesEnabled) {
                        OutlinedButton(
                            onClick = { databaseManager.resetAppServicesSync() },
                            modifier = Modifier.weight(1f)
                        ) {
                            Text("Reset Sync")
                        }
                    }
                    
                    Button(
                        onClick = {
                            if (!databaseManager.isAppServicesEnabled) {
                                databaseManager.enableAppServices()
                            }
                        },
                        modifier = Modifier.weight(1f)
                    ) {
                        Text("Test Connection")
                    }
                    
                    OutlinedButton(
                        onClick = onDismiss,
                        modifier = Modifier.weight(1f)
                    ) {
                        Text("Close")
                    }
                }
            }
        }
    }
}

// MARK: - Sync Status Bar (for top of inventory screen)
@Composable
fun AppServicesSyncStatusBar(
    databaseManager: DatabaseManager,
    modifier: Modifier = Modifier
) {
    val syncManager = databaseManager.appServicesSyncManager ?: return
    val syncState by syncManager.syncState.collectAsState()
    
    if (!databaseManager.isAppServicesEnabled && syncState.status == "Disconnected") {
        return
    }
    
    Card(
        modifier = modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 4.dp),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.primaryContainer.copy(alpha = 0.3f)
        )
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(12.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Box(
                    modifier = Modifier
                        .size(8.dp)
                        .clip(CircleShape)
                        .background(
                            if (syncState.isConnected) Color.Green else Color(0xFFFF9800)
                        )
                )
                
                Text(
                    text = syncState.status,
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurface
                )
            }
            
            syncState.lastSyncTime?.let { lastSync ->
                Text(
                    text = "Last: ${formatTime(lastSync)}",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        }
        
        // Progress bar (if syncing)
        if (syncState.progress > 0f && syncState.progress < 1f) {
            LinearProgressIndicator(
                progress = syncState.progress,
                modifier = Modifier.fillMaxWidth()
            )
        }
    }
}

// Helper function to format time
private fun formatTime(timestamp: Long): String {
    val formatter = SimpleDateFormat("HH:mm:ss", Locale.getDefault())
    return formatter.format(Date(timestamp))
}
