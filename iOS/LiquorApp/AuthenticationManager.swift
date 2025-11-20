import Foundation
import SwiftUI
import CouchbaseLiteSwift

// MARK: - User Model
struct User {
    let username: String
    let fullName: String
    let role: String
}

// MARK: - Authentication Manager with Couchbase Lite Session Persistence
class AuthenticationManager: ObservableObject {
    @Published var isAuthenticated = false
    @Published var currentUser: User?
    @Published var loginError: String?
    @Published var showingLoginError = false
    
    private var database: Database?
    private let sessionDocID = "user_session"
    
    // Capella App Services credentials
    // Only these 2 credentials are valid
    private let validCredentials: [String: (password: String, fullName: String, role: String, endpoint: String)] = [
        // NYC user → NYC endpoint (supermarket-nyc)
        "nyc-store-01@supermarket.com": (
            password: "P@ssword1",
            fullName: "NYC Store Manager",
            role: "Store Manager",
            endpoint: "supermarket-nyc"
        ),
        // AA user → AA endpoint (supermarket-aa)
        "aa-store-01@supermarket.com": (
            password: "P@ssword1",
            fullName: "Ann Arbor Store Manager",
            role: "Store Manager",
            endpoint: "supermarket-aa"
        )
    ]
    
    init() {
        // Initialize Couchbase Lite database for session storage
        initializeDatabase()
        // Check if user is already logged in (session persistence)
        checkStoredLogin()
    }
    
    // MARK: - Database Initialization
    
    private func initializeDatabase() {
        do {
            // Create or open authentication database
            self.database = try Database(name: "AuthDB")
            print("✅ Authentication database initialized")
        } catch {
            print("❌ Failed to initialize auth database: \(error)")
        }
    }
    
    // MARK: - Authentication Methods
    
    func login(username: String, password: String) {
        // Ensure we're on the main thread for UI updates
        DispatchQueue.main.async {
            // Clear any previous error
            self.loginError = nil
            
            // Validate credentials
            guard let userCredentials = self.validCredentials[username.lowercased()],
                  userCredentials.password == password else {
                self.loginError = "Invalid username or password"
                return
            }
            
            // Create user object
            let user = User(
                username: username.lowercased(),
                fullName: userCredentials.fullName,
                role: userCredentials.role
            )
            
            // Update authentication state
            withAnimation(.easeInOut(duration: 0.3)) {
                self.currentUser = user
                self.isAuthenticated = true
            }
            
            // Store login state for session persistence
            self.storeLoginState(user: user)
            
            print("✅ Login successful: \(user.fullName) (\(user.role))")
        }
    }
    
    func logout() {
        withAnimation(.easeInOut(duration: 0.3)) {
            self.isAuthenticated = false
            self.currentUser = nil
            self.loginError = nil
        }
        
        // Clear stored login state
        clearStoredLogin()
        
        print("🚪 User logged out")
    }
    
    // MARK: - Session Persistence with Couchbase Lite
    
    private func storeLoginState(user: User) {
        guard let database = database else {
            print("❌ Database not initialized")
            return
        }
        
        do {
            let sessionDoc = MutableDocument(id: sessionDocID)
            sessionDoc.setString(user.username, forKey: "username")
            sessionDoc.setString(user.fullName, forKey: "fullName")
            sessionDoc.setString(user.role, forKey: "role")
            sessionDoc.setBoolean(true, forKey: "isAuthenticated")
            sessionDoc.setDate(Date(), forKey: "loginTime")
            
            try database.saveDocument(sessionDoc)
            print("💾 Session stored in Couchbase Lite")
        } catch {
            print("❌ Error storing session: \(error)")
        }
    }
    
    private func checkStoredLogin() {
        guard let database = database,
              let sessionDoc = database.document(withID: sessionDocID) else {
            print("ℹ️ No stored session found")
            return
        }
        
        guard sessionDoc.boolean(forKey: "isAuthenticated"),
              let username = sessionDoc.string(forKey: "username"),
              let fullName = sessionDoc.string(forKey: "fullName"),
              let role = sessionDoc.string(forKey: "role") else {
            print("ℹ️ Invalid session data")
            return
        }
        
        // Validate that the stored credentials still match the current app configuration
        guard validCredentials[username] != nil else {
            print("⚠️ Stored credentials are no longer valid, clearing session")
            clearStoredLogin()
            return
        }
        
        // Validate that the stored session matches the current store configuration
        let expectedUsername: String
        switch AppConfig.currentStore {
        case .aa:
            expectedUsername = "aa-store-01@supermarket.com"
        case .nyc:
            expectedUsername = "nyc-store-01@supermarket.com"
        }
        
        guard username == expectedUsername else {
            print("⚠️ Stored session (\(username)) doesn't match current store (\(AppConfig.currentStore.displayName)), clearing session")
            clearStoredLogin()
            return
        }
        
        // Restore user session
        let user = User(username: username, fullName: fullName, role: role)
        DispatchQueue.main.async {
            self.currentUser = user
            self.isAuthenticated = true
        }
        
        print("🔄 Restored login session from Couchbase Lite: \(user.fullName)")
    }
    
    private func clearStoredLogin() {
        guard let database = database,
              let sessionDoc = database.document(withID: sessionDocID) else {
            return
        }
        
        do {
            try database.deleteDocument(sessionDoc)
            print("🗑️ Session cleared from Couchbase Lite")
        } catch {
            print("❌ Error clearing session: \(error)")
        }
    }
    
    // MARK: - Utility Methods
    
    func getAllUsers() -> [(username: String, fullName: String, role: String, endpoint: String, password: String)] {
        return validCredentials.map { (username, details) in
            (username: username, fullName: details.fullName, role: details.role, endpoint: details.endpoint, password: details.password)
        }.sorted { $0.username < $1.username }
    }
}
