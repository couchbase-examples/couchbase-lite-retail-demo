package com.example.liquorapplication

import android.content.Context
import android.util.Log
import com.couchbase.lite.*
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

/**
 * Authentication Manager using Couchbase Lite for session persistence
 * Stores user session in local database to maintain login state across app restarts
 */
class AuthenticationManager(private val context: Context) {
    
    companion object {
        private const val TAG = "AuthManager"
        private const val SESSION_DOC_ID = "user_session"
        private const val AUTH_COLLECTION = "auth"
    }
    
    private var database: Database? = null
    var currentUser: User? = null
        private set
    var isAuthenticated: Boolean = false
        private set
    
    // Valid credentials (matches iOS)
    private val validCredentials = mapOf(
        // Ann Arbor Store
        "aa-store-01@supermarket.com" to UserCredentials(
            password = "P@ssword1",
            fullName = "Ann Arbor Store Manager",
            role = "Store Manager"
        ),
        "aa-store-01" to UserCredentials(
            password = "P@ssword1",
            fullName = "Ann Arbor Store Manager",
            role = "Store Manager"
        ),
        // NYC Store
        "nyc-store-01@supermarket.com" to UserCredentials(
            password = "P@ssword1",
            fullName = "NYC Store Manager",
            role = "Store Manager"
        ),
        "nyc-store-01" to UserCredentials(
            password = "P@ssword1",
            fullName = "NYC Store Manager",
            role = "Store Manager"
        )
    )
    
    init {
        initializeDatabase()
        checkStoredLogin()
    }
    
    private fun initializeDatabase() {
        try {
            // Initialize Couchbase Lite if not already initialized
            CouchbaseLite.init(context)
            
            // Open or create auth database
            val dbConfig = DatabaseConfiguration()
            database = Database("AuthDB", dbConfig)
            
            Log.d(TAG, "✅ Authentication database initialized")
        } catch (e: Exception) {
            Log.e(TAG, "❌ Failed to initialize auth database", e)
        }
    }
    
    /**
     * Authenticate user with username and password
     */
    suspend fun login(username: String, password: String): LoginResult = withContext(Dispatchers.IO) {
        try {
            // Validate credentials
            val credentials = validCredentials[username.lowercase()]
            
            if (credentials == null || credentials.password != password) {
                return@withContext LoginResult.Error("Invalid username or password")
            }
            
            // Create user object
            val user = User(
                username = username.lowercase(),
                fullName = credentials.fullName,
                role = credentials.role
            )
            
            // Store session in Couchbase Lite
            storeSession(user)
            
            // Update state
            currentUser = user
            isAuthenticated = true
            
            Log.d(TAG, "✅ Login successful: ${user.fullName}")
            return@withContext LoginResult.Success(user)
            
        } catch (e: Exception) {
            Log.e(TAG, "❌ Login error", e)
            return@withContext LoginResult.Error("Login failed: ${e.message}")
        }
    }
    
    /**
     * Logout current user and clear session
     */
    fun logout() {
        try {
            clearSession()
            currentUser = null
            isAuthenticated = false
            Log.d(TAG, "🚪 User logged out")
        } catch (e: Exception) {
            Log.e(TAG, "❌ Logout error", e)
        }
    }
    
    /**
     * Check for stored login session on app start
     */
    private fun checkStoredLogin() {
        try {
            val collection = database?.defaultCollection ?: return
            val sessionDoc = collection.getDocument(SESSION_DOC_ID)
            
            if (sessionDoc != null) {
                val username = sessionDoc.getString("username")
                val fullName = sessionDoc.getString("fullName")
                val role = sessionDoc.getString("role")
                val isAuth = sessionDoc.getBoolean("isAuthenticated")
                
                if (isAuth && username != null && fullName != null && role != null) {
                    // Restore session
                    currentUser = User(username, fullName, role)
                    isAuthenticated = true
                    Log.d(TAG, "🔄 Restored login session: $fullName")
                }
            }
        } catch (e: Exception) {
            Log.e(TAG, "❌ Error checking stored login", e)
        }
    }
    
    /**
     * Store user session in Couchbase Lite
     */
    private fun storeSession(user: User) {
        try {
            val collection = database?.defaultCollection ?: return
            
            val sessionDoc = MutableDocument(SESSION_DOC_ID)
            sessionDoc.setString("username", user.username)
            sessionDoc.setString("fullName", user.fullName)
            sessionDoc.setString("role", user.role)
            sessionDoc.setBoolean("isAuthenticated", true)
            sessionDoc.setLong("loginTime", System.currentTimeMillis())
            
            collection.save(sessionDoc)
            Log.d(TAG, "💾 Session stored in Couchbase Lite")
        } catch (e: Exception) {
            Log.e(TAG, "❌ Error storing session", e)
        }
    }
    
    /**
     * Clear user session from Couchbase Lite
     */
    private fun clearSession() {
        try {
            val collection = database?.defaultCollection ?: return
            val sessionDoc = collection.getDocument(SESSION_DOC_ID)
            
            if (sessionDoc != null) {
                collection.delete(sessionDoc)
                Log.d(TAG, "🗑️  Session cleared from Couchbase Lite")
            }
        } catch (e: Exception) {
            Log.e(TAG, "❌ Error clearing session", e)
        }
    }
    
    /**
     * Close database connection
     */
    fun close() {
        try {
            database?.close()
            database = null
        } catch (e: Exception) {
            Log.e(TAG, "Error closing auth database", e)
        }
    }
}

/**
 * User data model
 */
data class User(
    val username: String,
    val fullName: String,
    val role: String
)

/**
 * User credentials data model
 */
private data class UserCredentials(
    val password: String,
    val fullName: String,
    val role: String
)

/**
 * Login result sealed class
 */
sealed class LoginResult {
    data class Success(val user: User) : LoginResult()
    data class Error(val message: String) : LoginResult()
}

