package com.example.liquorapplication

import android.os.Bundle
import android.util.Log
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import com.couchbase.lite.CouchbaseLite
import com.example.liquorapplication.ui.theme.LiquorApplicationTheme

class MainActivity : ComponentActivity() {
    private lateinit var authManager: AuthenticationManager
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        Log.d("MainActivity", "🚀 Starting MainActivity with App Services integration...")
        
        // Initialize AuthenticationManager with Couchbase Lite
        authManager = AuthenticationManager(this)
        
        enableEdgeToEdge()
        setContent {
            LiquorApplicationTheme {
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
} 