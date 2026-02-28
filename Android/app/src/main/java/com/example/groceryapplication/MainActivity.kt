package com.example.groceryapplication

import android.Manifest
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import android.util.Log
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.core.content.ContextCompat
import com.couchbase.lite.CouchbaseLite
import com.example.groceryapplication.ui.theme.GroceryApplicationTheme

class MainActivity : ComponentActivity() {
    private lateinit var authManager: AuthenticationManager
    
    // Permission launcher for P2P sync
    private val permissionLauncher = registerForActivityResult(
        ActivityResultContracts.RequestMultiplePermissions()
    ) { permissions ->
        val allGranted = permissions.values.all { it }
        if (allGranted) {
            Log.i("MainActivity", "✅ P2P permissions granted")
        } else {
            Log.w("MainActivity", "⚠️ Some P2P permissions denied")
            Log.w("MainActivity", "   P2P sync may not work without location permissions")
        }
    }
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        Log.d("MainActivity", "🚀 Starting MainActivity with App Services integration...")
        
        // Initialize AuthenticationManager with Couchbase Lite and DatabaseManager
        authManager = AuthenticationManager(this, GroceryApplication.databaseManager)
        
        // Request P2P permissions if needed
        requestP2PPermissionsIfNeeded()
        
        enableEdgeToEdge()
        setContent {
            GroceryApplicationTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    // Check if user is already authenticated (from stored session)
                    var isAuthenticated by remember { mutableStateOf(authManager.isAuthenticated) }
                    
                    if (isAuthenticated) {
                        LandingScreen(
                            authManager = authManager,
                            onLogout = {
                                isAuthenticated = false
                            }
                        )
                    } else {
                        LoginScreen(
                            authManager = authManager,
                            onLoginSuccess = {
                                isAuthenticated = true
                            }
                        )
                    }
                }
            }
        }
    }
    
    override fun onDestroy() {
        super.onDestroy()
        authManager.close()
    }
    
    // MARK: - P2P Permission Handling
    
    /**
     * Request permissions required for P2P sync (DNS-SD peer discovery)
     */
    private fun requestP2PPermissionsIfNeeded() {
        if (!AppConfig.ENABLE_P2P_SYNC) {
            Log.d("MainActivity", "⏭️  P2P sync disabled in config, skipping permissions")
            return
        }
        
        val requiredPermissions = getRequiredP2PPermissions()
        val missingPermissions = requiredPermissions.filter {
            ContextCompat.checkSelfPermission(this, it) != PackageManager.PERMISSION_GRANTED
        }
        
        if (missingPermissions.isNotEmpty()) {
            Log.i("MainActivity", "📋 Requesting P2P permissions:")
            missingPermissions.forEach { permission ->
                Log.i("MainActivity", "   - $permission")
            }
            permissionLauncher.launch(missingPermissions.toTypedArray())
        } else {
            Log.i("MainActivity", "✅ All P2P permissions already granted")
        }
    }
    
    /**
     * Get list of required permissions based on Android version
     */
    private fun getRequiredP2PPermissions(): List<String> {
        val permissions = mutableListOf<String>()
        
        when {
            Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU -> {
                // Android 13+ (API 33+): Nearby Wi-Fi devices (no location needed)
                permissions.add(Manifest.permission.NEARBY_WIFI_DEVICES)
                Log.d("MainActivity", "📱 Android 13+ detected - requesting nearby Wi-Fi devices permission")
            }
            Build.VERSION.SDK_INT >= Build.VERSION_CODES.S -> {
                // Android 12 (API 31-32): Bluetooth permissions + location (required for mDNS)
                permissions.add(Manifest.permission.BLUETOOTH_ADVERTISE)
                permissions.add(Manifest.permission.BLUETOOTH_CONNECT)
                permissions.add(Manifest.permission.BLUETOOTH_SCAN)
                permissions.add(Manifest.permission.ACCESS_FINE_LOCATION)
                Log.d("MainActivity", "📱 Android 12 detected - requesting Bluetooth + location permissions")
            }
            else -> {
                // Android 11 and below: Location permission (required for mDNS discovery)
                permissions.add(Manifest.permission.ACCESS_FINE_LOCATION)
                Log.d("MainActivity", "📱 Android 11 or below - requesting location permission for mDNS")
            }
        }
        
        return permissions
    }
    
    /**
     * Check if all P2P permissions are granted
     */
    fun hasP2PPermissions(): Boolean {
        return getRequiredP2PPermissions().all {
            ContextCompat.checkSelfPermission(this, it) == PackageManager.PERMISSION_GRANTED
        }
    }
} 