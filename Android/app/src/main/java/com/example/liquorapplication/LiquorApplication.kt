package com.example.liquorapplication

import android.app.Application
import android.util.Log
import com.couchbase.lite.CouchbaseLite

class LiquorApplication : Application() {
    
    companion object {
        private const val TAG = "LiquorApp"
        
        // Global database manager instance
        @Volatile
        private var _databaseManager: DatabaseManager? = null
        
        val databaseManager: DatabaseManager
            get() = _databaseManager ?: error("DatabaseManager not initialized")
        
        fun setDatabaseManager(manager: DatabaseManager) {
            _databaseManager = manager
        }
    }
    
    override fun onCreate() {
        super.onCreate()
        
        Log.d(TAG, "🚀 Initializing LiquorApplication...")
        
        // Initialize Couchbase Lite
        CouchbaseLite.init(this)
        
        // Initialize database manager
        initializeDatabaseManager()
        
        // Auto-enable App Services for testing
        enableAppServicesAfterDelay()
        
        Log.d(TAG, "✅ LiquorApplication initialized successfully")
    }
    
    private fun initializeDatabaseManager() {
        try {
            setDatabaseManager(DatabaseManager(this))
            Log.d(TAG, "✅ Database manager initialized")
        } catch (e: Exception) {
            Log.e(TAG, "❌ Failed to initialize database manager", e)
            throw e
        }
    }
    
    private fun enableAppServicesAfterDelay() {
        // Auto-enable App Services after a short delay for testing
        android.os.Handler(android.os.Looper.getMainLooper()).postDelayed({
            try {
                Log.d(TAG, "🌐 Auto-enabling App Services sync for testing...")
                databaseManager.enableAppServices()
            } catch (e: Exception) {
                Log.e(TAG, "❌ Failed to auto-enable App Services", e)
            }
        }, 2000) // 2 second delay
    }
    
    override fun onTerminate() {
        super.onTerminate()
        
        Log.d(TAG, "🧹 Cleaning up LiquorApplication...")
        
        // Cleanup App Services
        try {
            _databaseManager?.disableAppServices()
        } catch (e: Exception) {
            Log.e(TAG, "❌ Error during cleanup", e)
        }
    }
}
