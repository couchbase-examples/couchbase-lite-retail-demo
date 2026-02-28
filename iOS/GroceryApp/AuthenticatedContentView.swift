import SwiftUI
import CouchbaseLiteSwift

// MARK: - Authenticated Content View
/// This view is shown after successful login and contains the main app content
struct AuthenticatedContentView: View {
    @EnvironmentObject var databaseManager: DatabaseManager
    @EnvironmentObject var p2pSyncManager: GroceryMultipeerSyncManager
    @EnvironmentObject var authManager: AuthenticationManager
    @State private var selectedTab = 0
    
    var body: some View {
        TabView(selection: $selectedTab) {
            // Inventory Tab
            InventoryView()
                .tabItem {
                    Image(systemName: "list.clipboard")
                    Text("Inventory")
                }
                .tag(0)
            
            // Store Profile Tab (NEW)
            StoreProfileView(selectedTab: $selectedTab)
                .tabItem {
                    Image(systemName: "building.2")
                    Text("Profile")
                }
                .tag(1)
            
            // Orders Tab (NEW)
            OrdersView(selectedTab: $selectedTab)
                .tabItem {
                    Image(systemName: "shippingbox")
                    Text("Orders")
                }
                .tag(2)
            
            // Merchandising Tab
            SimpleMerchandisingView()
                .tabItem {
                    Image(systemName: "camera.viewfinder")
                    Text("Scanner")
                }
                .tag(3)
            
            // Settings Tab (Renamed from Profile)
            SettingsView()
                .tabItem {
                    Image(systemName: "gear")
                    Text("Settings")
                }
                .tag(4)
        }
        .accentColor(.blue)
    }
}

// MARK: - Settings View (Renamed from Profile View)
struct SettingsView: View {
    @EnvironmentObject var authManager: AuthenticationManager
    @EnvironmentObject var databaseManager: DatabaseManager
    @EnvironmentObject var p2pSyncManager: GroceryMultipeerSyncManager
    @State private var isRefreshing = false
    @State private var profileName: String?
    
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
                
                // Sync Controls Section
                Section(header: Text("Sync Controls")) {
                    // Refresh button
                    Button(action: {
                        Task {
                            await refreshData()
                        }
                    }) {
                        HStack {
                            Image(systemName: "arrow.clockwise")
                                .foregroundColor(.blue)
                            Text("Refresh Data")
                            Spacer()
                        }
                    }
                    
                    // App Services Toggle
                    HStack {
                        Image(systemName: "cloud.fill")
                            .foregroundColor(databaseManager.isAppServicesEnabled ? .green : .gray)
                        Text("App Services")
                        Spacer()
                        Toggle("", isOn: Binding(
                            get: { databaseManager.isAppServicesEnabled },
                            set: { _ in databaseManager.toggleAppServices() }
                        ))
                    }
                    
                    // App Services Status (if enabled)
                    if databaseManager.isAppServicesEnabled {
                        if let syncState = databaseManager.getAppServicesSyncState() {
                            HStack {
                                Circle()
                                    .fill(syncState.isConnected ? Color.green : Color.red)
                                    .frame(width: 8, height: 8)
                                Text(syncState.status)
                                    .font(.caption)
                                    .foregroundColor(.secondary)
                                Spacer()
                                if syncState.progress > 0 && syncState.progress < 1 {
                                    Text("\(Int(syncState.progress * 100))%")
                                        .font(.caption)
                                        .foregroundColor(.secondary)
                                }
                            }
                            
                            if let error = syncState.error {
                                Text("Error: \(error)")
                                    .font(.caption)
                                    .foregroundColor(.red)
                                    .lineLimit(2)
                            }
                        }
                    }
                    
                    Divider()
                    
                    // P2P Sync Toggle
                    HStack {
                        Image(systemName: "wifi")
                            .foregroundColor(p2pSyncManager.isRunning ? .green : .gray)
                        Text("P2P Sync")
                        Spacer()
                        Toggle("", isOn: Binding(
                            get: { p2pSyncManager.isRunning },
                            set: { enabled in
                                if enabled {
                                    Task {
                                        do {
                                            try await p2pSyncManager.start()
                                        } catch {
                                            print("❌ Failed to start P2P sync: \(error)")
                                        }
                                    }
                                } else {
                                    p2pSyncManager.stop()
                                }
                            }
                        ))
                    }
                    
                    // P2P Status
                    HStack {
                        Image(systemName: "person.2")
                        Text("Connected Peers")
                        Spacer()
                        Text("\(p2pSyncManager.connectedPeers.count)")
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
                // Temporarily disabled - old debug views removed during P2P migration
                /*
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
                */
                
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
            .navigationTitle("Settings")
        }
        .onAppear {
            profileName = databaseManager.getStoreProfile()?.name
        }
    }
    
    // Refresh data function
    private func refreshData() async {
        isRefreshing = true
        print("🔄 [Manual Refresh] Started from Settings...")
        
        // Give visual feedback
        try? await Task.sleep(nanoseconds: 500_000_000) // 0.5 seconds
        
        // Reload profile name
        profileName = databaseManager.getStoreProfile()?.name
        
        isRefreshing = false
        print("✅ [Manual Refresh] Completed from Settings")
    }
}

// MARK: - Preview
#Preview {
    let db = try! Database(name: "preview")
    let collection = try! db.defaultCollection()
    
    return AuthenticatedContentView()
        .environmentObject(DatabaseManager())
        .environmentObject(GroceryMultipeerSyncManager(database: db, collections: [collection]))
        .environmentObject({
            let auth = AuthenticationManager()
            auth.isAuthenticated = true
            auth.currentUser = User(username: "admin", fullName: "Administrator", role: "Admin")
            return auth
        }())
}
