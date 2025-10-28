//
//  LiquorAppApp.swift
//  LiquorApp
//
//  Created by Pulkit Midha on 23/07/25.
//  Migrated to MultipeerReplicator API (CBL 3.3+)
//

import SwiftUI
import CouchbaseLiteSwift
import Network

// Note: Now using official MultipeerReplicator API (CBL 3.3+)
// This replaces the old MultipeerConnectivity + MessageEndpoint approach

@main
struct LiquorAppApp: App {
    @StateObject private var databaseManager = DatabaseManager()
    @StateObject private var authManager = AuthenticationManager()
    @State private var p2pSyncManager: GroceryMultipeerSyncManager?
    
    init() {
        print("🚀 [MultipeerReplicator] Initializing new MultipeerReplicator-based P2P sync")
        print("🚀 [MultipeerReplicator] Using official Couchbase Lite 3.3+ API")
        
        // 🚀 Initialize PlantPal-style embedding optimization
        Task {
            BuildTimeBeerEmbeddingLoader.shared.processBeerData()
            BuildTimeBeerEmbeddingLoader.shared.printPerformanceMetrics()
        }
    }
    
    var body: some Scene {
        WindowGroup {
            Group {
                if authManager.isAuthenticated {
                    // Show main app after login
                    if let p2pManager = p2pSyncManager {
                        AuthenticatedContentView()
                            .environmentObject(databaseManager)
                            .environmentObject(p2pManager)
                            .environmentObject(authManager)
                    } else {
                        // Show loading while P2P initializes
                        ProgressView("Initializing P2P Sync...")
                            .task {
                                // Initialize MultipeerReplicator P2P sync when authenticated
                                await initializeMultipeerReplicatorSync()
                            }
                    }
                } else {
                    // Show login screen
                    LoginView()
                        .environmentObject(authManager)
                }
            }
            .animation(.easeInOut(duration: 0.3), value: authManager.isAuthenticated)
        }
    }
    
    @MainActor
    private func initializeMultipeerReplicatorSync() async {
        // Get the database and collections from DatabaseManager
        guard let database = databaseManager.database else {
            print("⚠️ [MultipeerReplicator] Database not ready yet")
            return
        }
        
        do {
            // Get all collections: inventory, orders, profile
            let inventoryCollection = try database.collection(name: AppConfig.collectionName, scope: AppConfig.scopeName)
                ?? database.createCollection(name: AppConfig.collectionName, scope: AppConfig.scopeName)
            
            let ordersCollection = try database.collection(name: AppConfig.ordersCollectionName, scope: AppConfig.scopeName)
                ?? database.createCollection(name: AppConfig.ordersCollectionName, scope: AppConfig.scopeName)
            
            let profileCollection = try database.collection(name: AppConfig.profileCollectionName, scope: AppConfig.scopeName)
                ?? database.createCollection(name: AppConfig.profileCollectionName, scope: AppConfig.scopeName)
            
            // Reinitialize P2P manager with ALL collections (inventory, orders, profile)
            let newP2PManager = GroceryMultipeerSyncManager(
                database: database,
                collections: [inventoryCollection, ordersCollection, profileCollection]
            )
            
            // Start MultipeerReplicator sync
            try await newP2PManager.start()
            
            // Update state
            p2pSyncManager = newP2PManager
            
            print("✅ [MultipeerReplicator] P2P sync started successfully")
            print("✅ [MultipeerReplicator] Peer ID: \(newP2PManager.myPeerID)")
            print("✅ [MultipeerReplicator] Service: _couchbaseP2P._tcp")
            print("✅ [MultipeerReplicator] Collections syncing: inventory, orders, profile")
            print("✅ [MultipeerReplicator] No idle channel issues!")
            
        } catch {
            print("❌ [MultipeerReplicator] Failed to start P2P sync: \(error)")
        }
    }
    
    // MARK: - DEPRECATED: Old Network Framework Permission Triggers
    // These methods are no longer needed since MultipeerConnectivity handles permissions automatically
    
    /// 🚨 DEPRECATED: AGGRESSIVE network permission trigger - forces iOS to show the permission dialog
    private func triggerNetworkPermissionDialog_DEPRECATED() {
        print("🚨 [NetworkPermission] Starting aggressive network permission trigger...")
        
        // Method 1: UDP Broadcast (most reliable)
        triggerWithUDPBroadcast_DEPRECATED()
        
        // Method 2: Bonjour service (backup after 1 second)
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
            self.triggerWithBonjourService_DEPRECATED()
        }
        
        // Method 3: mDNS multicast (backup after 2 seconds)
        DispatchQueue.main.asyncAfter(deadline: .now() + 2.0) {
            self.triggerWithMDNSMulticast_DEPRECATED()
        }
    }
    
    /// Method 1: UDP Broadcast to local network (triggers permission immediately)
    private func triggerWithUDPBroadcast_DEPRECATED() {
        print("🔥 [NetworkPermission] Method 1: UDP Broadcast trigger")
        
        let params = NWParameters.udp
        params.allowLocalEndpointReuse = true
        
        // Try multiple broadcast addresses to increase chance of triggering permission
        let broadcastAddresses = [
            "255.255.255.255",  // General broadcast
            "192.168.1.255",    // Common home network
            "10.0.0.255",       // Common office network
            "172.16.255.255"    // Common corporate network
        ]
        
        for address in broadcastAddresses {
            let connection = NWConnection(host: NWEndpoint.Host(address), port: 9999, using: params)
            
            connection.stateUpdateHandler = { state in
                switch state {
                case .ready:
                    print("✅ [NetworkPermission] UDP connection ready to \(address) - permission likely granted")
                    connection.send(content: "LiquorApp-Permission-Test".data(using: .utf8), completion: .contentProcessed({ _ in
                        connection.cancel()
                    }))
                case .failed(let error):
                    print("⚠️ [NetworkPermission] UDP connection failed to \(address): \(error)")
                    connection.cancel()
                default:
                    break
                }
            }
            
            connection.start(queue: .main)
            
            // Cancel after 3 seconds
            DispatchQueue.main.asyncAfter(deadline: .now() + 3.0) {
                connection.cancel()
            }
        }
    }
    
    /// Method 2: Bonjour service advertising (backup method)
    private func triggerWithBonjourService_DEPRECATED() {
        print("🔥 [NetworkPermission] Method 2: Bonjour service trigger")
        
        do {
            let listener = try NWListener(using: .tcp)
            listener.service = NWListener.Service(name: "LiquorApp-\(UUID().uuidString.prefix(8))", type: "_liquorapp._tcp")
            
            listener.stateUpdateHandler = { state in
                switch state {
                case .ready:
                    print("✅ [NetworkPermission] Bonjour service ready - permission granted")
                    listener.cancel()
                case .failed(let error):
                    print("⚠️ [NetworkPermission] Bonjour service failed: \(error)")
                    listener.cancel()
                default:
                    break
                }
            }
            
            listener.newConnectionHandler = { _ in } // Required to avoid POSIX error
            listener.start(queue: .main)
            
            // Cancel after 5 seconds
            DispatchQueue.main.asyncAfter(deadline: .now() + 5.0) {
                listener.cancel()
            }
            
        } catch {
            print("❌ [NetworkPermission] Bonjour listener creation failed: \(error)")
        }
    }
    
    /// Method 3: mDNS multicast (final backup)
    private func triggerWithMDNSMulticast_DEPRECATED() {
        print("🔥 [NetworkPermission] Method 3: mDNS multicast trigger")
        
        let connection = NWConnection(host: "224.0.0.251", port: 5353, using: .udp) // mDNS multicast address
        
        connection.stateUpdateHandler = { state in
            switch state {
            case .ready:
                print("✅ [NetworkPermission] mDNS connection ready - permission granted")
                connection.send(content: Data([0x00, 0x00, 0x01, 0x00, 0x00, 0x01]), completion: .contentProcessed({ _ in
                    connection.cancel()
                }))
            case .failed(let error):
                print("⚠️ [NetworkPermission] mDNS connection failed: \(error)")
                connection.cancel()
            default:
                break
            }
        }
        
        connection.start(queue: .main)
        
        // Cancel after 3 seconds
        DispatchQueue.main.asyncAfter(deadline: .now() + 3.0) {
            connection.cancel()
            print("🏁 [NetworkPermission] All network permission triggers completed")
        }
    }
}
