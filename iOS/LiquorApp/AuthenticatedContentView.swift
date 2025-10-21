import SwiftUI
import CouchbaseLiteSwift

// MARK: - Authenticated Content View
/// This view is shown after successful login and contains the main app content
struct AuthenticatedContentView: View {
    @EnvironmentObject var databaseManager: DatabaseManager
    @EnvironmentObject var p2pSyncManagerWrapper: MultipeerP2PSyncManagerWrapper
    @EnvironmentObject var authManager: AuthenticationManager
    
    var body: some View {
        TabView {
            // Inventory Tab
            InventoryView()
                .tabItem {
                    Image(systemName: "list.clipboard")
                    Text("Inventory")
                }
            
            // Merchandising Tab
            SimpleMerchandisingView()
                .tabItem {
                    Image(systemName: "camera.viewfinder")
                    Text("Scanner")
                }
            
            // Profile Tab
            ProfileView()
                .tabItem {
                    Image(systemName: "person.circle")
                    Text("Profile")
                }
        }
        .accentColor(.blue)
    }
}

// MARK: - Profile View
struct ProfileView: View {
    @EnvironmentObject var authManager: AuthenticationManager
    @EnvironmentObject var databaseManager: DatabaseManager
    @EnvironmentObject var p2pSyncManagerWrapper: MultipeerP2PSyncManagerWrapper
    
    var body: some View {
        NavigationView {
            List {
                // User Info Section
                Section(header: Text("User Information")) {
                    if let user = authManager.currentUser {
                        HStack {
                            Image(systemName: "person.circle.fill")
                                .font(.largeTitle)
                                .foregroundColor(.blue)
                            
                            VStack(alignment: .leading, spacing: 4) {
                                Text(user.fullName)
                                    .font(.headline)
                                    .foregroundColor(.primary)
                                
                                Text("@\(user.username)")
                                    .font(.subheadline)
                                    .foregroundColor(.secondary)
                                
                                Text(user.role)
                                    .font(.caption)
                                    .padding(.horizontal, 8)
                                    .padding(.vertical, 2)
                                    .background(Color.blue.opacity(0.1))
                                    .foregroundColor(.blue)
                                    .cornerRadius(4)
                            }
                            
                            Spacer()
                        }
                        .padding(.vertical, 8)
                    }
                }
                
                // App Services Section
                Section(header: Text("Sync Status")) {
                    HStack {
                        Image(systemName: "cloud")
                            .foregroundColor(.green)
                        Text("App Services")
                        Spacer()
                        Text(databaseManager.isAppServicesEnabled ? "Enabled" : "Disabled")
                            .foregroundColor(databaseManager.isAppServicesEnabled ? .green : .orange)
                    }
                    
                    HStack {
                        Image(systemName: "wifi")
                        Text("P2P Sync")
                        Spacer()
                        Text(p2pSyncManagerWrapper.isRunning ? "Active" : "Inactive")
                            .foregroundColor(p2pSyncManagerWrapper.isRunning ? .green : .orange)
                    }
                    
                    HStack {
                        Image(systemName: "person.2")
                        Text("Connected Peers")
                        Spacer()
                        Text("\(p2pSyncManagerWrapper.connectedPeers.count)")
                            .foregroundColor(.blue)
                    }
                }
                
                // App Information Section
                Section(header: Text("App Information")) {
                    HStack {
                        Image(systemName: "info.circle")
                        Text("Version")
                        Spacer()
                        Text("1.0.0")
                            .foregroundColor(.secondary)
                    }
                    
                    HStack {
                        Image(systemName: "gear")
                        Text("Build")
                        Spacer()
                        Text("2024.09.22")
                            .foregroundColor(.secondary)
                    }
                    
                    HStack {
                        Image(systemName: "cpu")
                        Text("Database")
                        Spacer()
                        Text("Couchbase Lite")
                            .foregroundColor(.secondary)
                    }
                }
                
                // Debug Section (visible to Admin and Supervisor only)
                if let user = authManager.currentUser,
                   user.role == "Admin" || user.role == "Supervisor" {
                    Section(header: Text("Debug Tools")) {
                        NavigationLink(destination: DebugP2PView()) {
                            HStack {
                                Image(systemName: "wrench.and.screwdriver")
                                Text("P2P Debug Console")
                            }
                        }
                        
                        NavigationLink(destination: P2PSyncDebugView()) {
                            HStack {
                                Image(systemName: "stethoscope")
                                Text("Sync Diagnostics")
                                    .foregroundColor(.orange)
                            }
                        }
                    }
                }
                
                // Logout Section
                Section {
                    Button(action: {
                        authManager.logout()
                    }) {
                        HStack {
                            Image(systemName: "rectangle.portrait.and.arrow.right")
                                .foregroundColor(.red)
                            Text("Sign Out")
                                .foregroundColor(.red)
                        }
                    }
                }
            }
            .navigationTitle("Profile")
        }
    }
}

// MARK: - Preview
#Preview {
    AuthenticatedContentView()
        .environmentObject(DatabaseManager())
        .environmentObject(MultipeerP2PSyncManagerWrapper(database: try! Database(name: "preview")))
        .environmentObject({
            let auth = AuthenticationManager()
            auth.isAuthenticated = true
            auth.currentUser = User(username: "admin", fullName: "Administrator", role: "Admin")
            return auth
        }())
}
