//
//  LiquorAppApp.swift
//  LiquorApp
//
//  Created by Pulkit Midha on 23/07/25.
//

import SwiftUI
import CouchbaseLiteSwift
import Network

// Note: Using MultipeerP2PSyncManagerWrapper for better iOS P2P compatibility

@main
struct LiquorAppApp: App {
    @StateObject private var databaseManager = DatabaseManager()
    @State private var p2pSyncManagerWrapper: MultipeerP2PSyncManagerWrapper?
    
    init() {
        print("🚀 [MultipeerP2P] Initializing MultipeerConnectivity-based P2P sync functionality")
        
        // Note: MultipeerConnectivity handles network permissions automatically
        // No need for aggressive network permission triggers
        
        // 🚀 Initialize PlantPal-style embedding optimization
        Task {
            BuildTimeBeerEmbeddingLoader.shared.processBeerData()
            BuildTimeBeerEmbeddingLoader.shared.printPerformanceMetrics()
        }
    }
    
    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(databaseManager)
                .environmentObject(p2pSyncManagerWrapper ?? MultipeerP2PSyncManagerWrapper(database: databaseManager.database!))
                .onAppear {
                    // Initialize MultipeerConnectivity P2P sync when the app appears
                    initializeMultipeerP2PSync()
                    
                    // Auto-enable App Services sync for testing
                    DispatchQueue.main.asyncAfter(deadline: .now() + 2.0) {
                        print("🌐 Auto-enabling App Services sync for testing...")
                        databaseManager.enableAppServices()
                    }
                }
        }
    }
    
    private func initializeMultipeerP2PSync() {
        DispatchQueue.main.async {
            // Get the database from DatabaseManager
            if let database = self.databaseManager.database {
                
                // Initialize MultipeerConnectivity P2P sync manager
                if self.p2pSyncManagerWrapper == nil {
                    self.p2pSyncManagerWrapper = MultipeerP2PSyncManagerWrapper(database: database)
                }
                
                // Start MultipeerConnectivity sync (handles both advertising and browsing automatically)
                self.p2pSyncManagerWrapper?.start()
                
                print("🚀 [MultipeerP2P] MultipeerConnectivity P2P sync initialized")
                print("🚀 [MultipeerP2P] Device advertising as: \(UIDevice.current.name)-Liquor")
                print("🚀 [MultipeerP2P] Service type: _liquor-sync._tcp")
                print("🚀 [MultipeerP2P] Using UUID-based role assignment for conflict-free connections")
                print("🚀 [MultipeerP2P] No manual network permission triggers needed - MultipeerConnectivity handles this!")
            }
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
