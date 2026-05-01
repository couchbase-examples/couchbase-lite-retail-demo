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

    /// Weak back-reference so login/logout can drive replicator lifecycle
    /// synchronously (before flipping `isAuthenticated`), avoiding the race
    /// where views observe the auth flip and read from the database before
    /// the replicator has been reconfigured for the correct store.
    weak var databaseManager: DatabaseManager?
    
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
        // Initialize Couchbase Lite database for session storage.
        // Session restoration is intentionally NOT done here — the app must
        // wire `databaseManager` first, then call `restoreSessionIfAny()`,
        // so the replicator can be reconfigured for the persisted store
        // before any view observes `isAuthenticated == true`.
        initializeDatabase()
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

            // Resolve the target store and reconfigure the database replicator
            // BEFORE flipping `isAuthenticated`. `reconfigure(for:)` is the
            // single source of truth: it sets `AppConfig.currentStore` (which
            // persists to UserDefaults), rebuilds the database, and restarts
            // the replicator — all in one synchronous call.
            //
            // Note: this IS a synchronous disk hit on the main thread. We
            // keep it synchronous deliberately — any async variant would
            // either (a) leak a brief window where views observe auth=true
            // against the previous store's scope, or (b) require a new
            // "logging in…" UI state with careful threading of @Published
            // writes back to main. For the demo dataset size (low hundreds
            // of docs) reconfigure completes in well under a frame and
            // doesn't produce a perceptible hang. If the dataset grows such
            // that this becomes noticeable, the right fix is to gate the
            // auth flip on a completion handler rather than dispatch
            // blindly to a background queue.
            let targetStore = AppConfig.store(for: username)
            self.databaseManager?.reconfigure(for: targetStore)

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
        // Stop the Capella App Services replicator BEFORE flipping auth state.
        // Otherwise the WebSocket keeps streaming for the just-logged-out user
        // until the next login triggers reconfigure() — a subtle data-leak
        // across sessions on shared devices.
        databaseManager?.disableAppServices()

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
    
    /// Restores a persisted session, if any, and reconciles the replicator
    /// with the session's store BEFORE flipping `isAuthenticated`.
    ///
    /// Called explicitly from the app's `init()` (after `databaseManager`
    /// has been wired up) so cold starts with a persisted AA session never
    /// briefly show the NYC scope or a LoginView flash.
    func restoreSessionIfAny() {
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

        // Reconcile store + replicator before announcing auth. In the common
        // case AppConfig.currentStore was already lazy-loaded from
        // UserDefaults so reconfigure is idempotent here; it also covers the
        // edge case of a session doc existing without a persisted store.
        // reconfigure(for:) is the single source of truth — it persists
        // AppConfig.currentStore itself, so we don't duplicate that write.
        let targetStore = AppConfig.store(for: username)
        databaseManager?.reconfigure(for: targetStore)

        // Restore user session. This runs synchronously on the main thread
        // (called from App.init) so the authenticated view renders on the
        // very first body evaluation — deferring via DispatchQueue.main.async
        // would briefly show LoginView on cold start.
        let user = User(username: username, fullName: fullName, role: role)
        self.currentUser = user
        self.isAuthenticated = true

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
