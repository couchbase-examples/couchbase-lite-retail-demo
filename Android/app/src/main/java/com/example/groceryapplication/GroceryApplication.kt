package com.example.groceryapplication

import android.app.Application
import android.util.Log
import com.couchbase.lite.CouchbaseLite

class GroceryApplication : Application() {
    
    companion object {
        private const val TAG = "GroceryApp"
        
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
        
        Log.d(TAG, "🚀 Initializing GroceryApplication...")
        
        // Initialize Couchbase Lite
        CouchbaseLite.init(this)
        
        // Initialize database manager
        initializeDatabaseManager()
        
        // NOTE: Sync is NOT started here — it starts after login
        // so the correct store endpoint is used.
        
        Log.d(TAG, "✅ GroceryApplication initialized successfully")
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
    
    override fun onTerminate() {
        super.onTerminate()

        Log.d(TAG, "🧹 Cleaning up GroceryApplication...")

        try {
            _databaseManager?.disableAppServices()
            _databaseManager?.close()  // cancel backgroundScope and release resources
        } catch (e: Exception) {
            Log.e(TAG, "❌ Error during cleanup", e)
        }
    }
}
