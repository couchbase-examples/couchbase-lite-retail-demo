//
//  MultipeerP2PSyncManagerWrapper.swift
//  LiquorApp
//
//  Created by Multipeer Migration
//  Wrapper to maintain compatibility with existing UI
//

import Foundation
import CouchbaseLiteSwift
import Combine

/// Wrapper class to bridge the new MultipeerP2PSyncManager with existing UI components
/// This maintains compatibility while migrating to MultipeerConnectivity
class MultipeerP2PSyncManagerWrapper: ObservableObject {
    
    // MARK: - Properties
    
    private let multipeerManager: MultipeerP2PSyncManager
    private var cancellables = Set<AnyCancellable>()
    
    // Published properties for UI compatibility
    @Published var isRunning = false
    @Published var connectedPeers: [String] = []
    @Published var syncStatus = "Stopped"
    
    // MARK: - Initialization
    
    init(database: Database) {
        self.multipeerManager = MultipeerP2PSyncManager(database: database)
        
        // Forward published values
        multipeerManager.$isRunning
            .assign(to: &$isRunning)
        
        multipeerManager.$connectedPeers
            .map { $0.map { $0.displayName } }
            .assign(to: &$connectedPeers)
        
        multipeerManager.$syncStatus
            .assign(to: &$syncStatus)
    }
    
    // MARK: - Control Methods
    
    func start() {
        multipeerManager.start()
    }
    
    func stop() {
        multipeerManager.stop()
    }
    
    func restart() {
        multipeerManager.restart()
    }
    
    // MARK: - Status Methods (for backward compatibility)
    
    func getStatus() -> P2PSyncStatus {
        let multipeerStatus = multipeerManager.getSimpleStatus()
        
        return P2PSyncStatus(
            isPassivePeer: false, // MultipeerConnectivity handles roles automatically
            isActivePeer: false,
            isRunning: multipeerStatus.isRunning,
            listenerPort: nil, // Not applicable for MultipeerConnectivity
            connectedPeers: multipeerStatus.connectedPeers,
            discoveredPeers: [], // Will be populated when peers connect
            debugDiscoveredPeers: [:],
            debugConnectedPeers: Dictionary(uniqueKeysWithValues: multipeerStatus.connectedPeers.map { ($0, "Connected ✅") }),
            debugConnectionErrors: [:],
            username: "multipeer", // Not used in MultipeerConnectivity
            serviceType: multipeerStatus.serviceType,
            hasNetworkPermission: true, // MultipeerConnectivity handles permissions better
            networkPermissionStatus: "MultipeerConnectivity managed ✅"
        )
    }
}
