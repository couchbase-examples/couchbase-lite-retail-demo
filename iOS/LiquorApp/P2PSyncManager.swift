import os
import Foundation
import Network
import UIKit
import CouchbaseLiteSwift
import Combine

/// P2P Sync Manager following Couchbase documentation pattern for URLEndpointListener
final class P2PSyncManager {
    private let name: String = "LiquorInventory"
    private let database: CouchbaseLiteSwift.Database
    private let collections: [CouchbaseLiteSwift.Collection]
    
    // Hardcoded credentials (as requested)
    private let hardcodedUsername = "liquoruser"
    private let hardcodedPassword = "liquorpass123"
    
    // P2P Components following documentation pattern
    private var urlEndpointListener: URLEndpointListener?
    private var peerReplicators: [String: Replicator] = [:]
    private var discoveredPeers: [String: URL] = [:]
    
    // Network Discovery (Bonjour)
    private var listener: NWListener?
    private var browser: NWBrowser?
    private let networkQueue = DispatchQueue(label: "P2PSync.network")
    private let networkMonitor = NWPathMonitor()
    
    // State management
    private var isPassivePeer = false
    private var isActivePeer = false
    private var isRunning = false
    private var hasNetworkPermission = false
    private var lastPermissionCheck = Date()
    private var lastBonjourError: NWError?
    private var lastBonjourErrorTime = Date()
    
    // Debug information
    public var debugDiscoveredPeers: [String: String] = [:] // [peerName: endpoint]
    public var debugConnectedPeers: [String: String] = [:] // [peerName: endpoint]
    public var debugConnectionErrors: [String: String] = [:] // [peerName: errorMessage]
    
    init(database: CouchbaseLiteSwift.Database) {
        self.database = database
        self.collections = [try! database.defaultCollection()]
        
        Log.info("🔗 P2P Sync Manager initialized")
        
        // Monitor network changes
        networkMonitor.pathUpdateHandler = { [weak self] path in
            switch path.status {
            case .satisfied:
                Log.info("🌐 Network available - restarting P2P sync")
                self?.restart()
            default:
                Log.info("❌ Network unavailable - pausing P2P sync")
                self?.stopAll()
            }
        }
        networkMonitor.start(queue: networkQueue)
    }
    
    deinit {
        stopAll()
        networkMonitor.cancel()
    }
    
    // MARK: - Passive Peer (Server/Listener) - Following Documentation Pattern
    
    /// Start as passive peer (server) that accepts incoming connections
    func startAsPassivePeer() {
        guard !isPassivePeer else {
            Log.info("⚠️ Already running as passive peer")
            return
        }
        
        Log.info("🚀 Starting as PASSIVE PEER (Server/Listener)")
        
        do {
            // Step 1: Initialize URLEndpointListener (from documentation)
            try initializeURLEndpointListener()
            
            // Step 2: Start Bonjour service advertising
            startBonjourAdvertising()
            
            isPassivePeer = true
            isRunning = true
            
            Log.info("✅ Passive peer started successfully")
        } catch {
            Log.error("❌ Failed to start passive peer: \(error.localizedDescription)")
        }
    }
    
    /// Initialize URLEndpointListener following documentation pattern
    private func initializeURLEndpointListener() throws {
        guard let collection = collections.first else {
            throw P2PSyncError.collectionNotFound
        }
        
        // Create URLEndpointListenerConfiguration (from documentation)
        var listenerConfig = URLEndpointListenerConfiguration(collections: [collection])
        
        // Configure TLS (disabled for now - can be enabled later)
        listenerConfig.disableTLS = true
        
        // Enable delta sync (from documentation)
        listenerConfig.enableDeltaSync = true
        
        // Configure password authenticator (from documentation pattern)
        listenerConfig.authenticator = ListenerPasswordAuthenticator { [weak self] (username, password) -> Bool in
            guard let self = self else { return false }
            
            Log.info("🔐 Authentication attempt: username=\(username)")
            
            // Check against hardcoded credentials
            let isValid = username == self.hardcodedUsername && password == self.hardcodedPassword
            
            if isValid {
                Log.info("✅ Authentication successful for user: \(username)")
            } else {
                Log.info("❌ Authentication failed for user: \(username)")
            }
            
            return isValid
        }
        
        // Create the URLEndpointListener
        urlEndpointListener = URLEndpointListener(config: listenerConfig)
        
        // Start the listener
        try urlEndpointListener?.start()
        
        Log.info("🎧 URLEndpointListener started on port: \(urlEndpointListener?.port ?? 0)")
    }
    
    /// Start Bonjour service advertising
    private func startBonjourAdvertising() {
        guard let listenerPort = urlEndpointListener?.port else {
            Log.error("❌ Cannot advertise service - listener port not available")
            return
        }
        
        do {
            // Create NWListener for Bonjour advertising (from documentation pattern)
            let tcpOptions = NWProtocolTCP.Options()
            let parameters = NWParameters(tls: nil, tcp: tcpOptions)
            parameters.allowLocalEndpointReuse = true
            
            // Create service with the actual listener port
            let txtRecord = NWTXTRecord(["port": "\(listenerPort)"])
            let service = NWListener.Service(name: "LiquorApp-\(UUID().uuidString.prefix(8))", 
                                           type: "_liquorapp._tcp", 
                                           domain: nil, 
                                           txtRecord: txtRecord)
            
            listener = try NWListener(service: service, using: parameters)
            
            listener?.stateUpdateHandler = { [weak self] newState in
                switch newState {
                case .ready:
                    Log.info("📡 Bonjour service advertising started")
                case .failed(let error):
                    Log.error("❌ Bonjour advertising failed: \(error)")
                    self?.handleNetworkError(error)
                case .cancelled:
                    Log.info("📡 Bonjour advertising cancelled")
                default:
                    break
                }
            }
            
            // We don't need to handle new connections here since URLEndpointListener handles that
            listener?.newConnectionHandler = { connection in
                Log.info("📞 New Bonjour connection detected (will be handled by URLEndpointListener)")
                connection.cancel() // Cancel since URLEndpointListener will handle the actual connection
            }
            
            listener?.start(queue: networkQueue)
            
        } catch {
            Log.error("❌ Failed to start Bonjour advertising: \(error)")
        }
    }
    
    // MARK: - Active Peer (Client) - Following Documentation Pattern
    
    /// Start as active peer (client) that discovers and connects to other peers
    func startAsActivePeer() {
        guard !isActivePeer else {
            Log.info("⚠️ Already running as active peer")
            return
        }
        
        Log.info("🔍 Starting as ACTIVE PEER (Client/Browser)")
        
        // Start browsing for peers
        startBonjourDiscovery()
        
        isActivePeer = true
        isRunning = true
        
        Log.info("✅ Active peer started successfully")
    }
    
    /// Start Bonjour service discovery
    private func startBonjourDiscovery() {
        // Create browser for discovering peers (from documentation pattern)
        let descriptor = NWBrowser.Descriptor.bonjourWithTXTRecord(type: "_liquorapp._tcp", domain: nil)
        let parameters = NWParameters()
        parameters.allowLocalEndpointReuse = true
        
        browser = NWBrowser(for: descriptor, using: parameters)
        
        browser?.stateUpdateHandler = { [weak self] newState in
            switch newState {
            case .ready:
                Log.info("🔍 Peer discovery started")
            case .failed(let error):
                Log.error("❌ Peer discovery failed: \(error)")
                self?.handleNetworkError(error)
            case .cancelled:
                Log.info("🔍 Peer discovery cancelled")
            default:
                break
            }
        }
        
        browser?.browseResultsChangedHandler = { [weak self] results, changes in
            Log.info("📋 Discovery results changed: \(results.count) peers found")
            
            for result in results {
                switch result.endpoint {
                case .service(let name, let type, let domain, let interface):
                    self?.handleDiscoveredPeer(name: name, type: type, domain: domain, interface: interface, result: result)
                default:
                    break
                }
            }
        }
        
        browser?.start(queue: networkQueue)
    }
    
    /// Handle discovered peer and attempt connection
    private func handleDiscoveredPeer(name: String, type: String, domain: String?, interface: NWInterface?, result: NWBrowser.Result) {
        Log.info("🎯 Discovered peer: \(name)")
        
        // Extract IP address and port from the service
        guard case .service(_, _, _, _) = result.endpoint else {
            Log.error("❌ Invalid service endpoint for peer: \(name)")
            return
        }
        
        // We'll get the actual port from the resolved endpoint
        Log.info("🔍 Resolving peer endpoint to get actual connection details")
        
        // Create connection using NWConnection to resolve the actual IP
        let connection = NWConnection(to: result.endpoint, using: .tcp)
        connection.stateUpdateHandler = { [weak self] state in
            switch state {
            case .ready:
                if let remoteEndpoint = connection.currentPath?.remoteEndpoint,
                   case .hostPort(let host, let port) = remoteEndpoint {
                    var hostString = "\(host)"
                    
                    // Handle IPv6 addresses and interface identifiers
                    if hostString.contains("%") {
                        // Remove interface identifier (e.g., "::1%lo0" -> "::1")
                        hostString = String(hostString.split(separator: "%").first ?? "")
                    }
                    
                    // Convert IPv6 loopback to IPv4 loopback for WebSocket compatibility
                    if hostString == "::1" {
                        hostString = "127.0.0.1"
                        Log.info("🔄 Converted IPv6 loopback to IPv4: \(hostString)")
                    }
                    
                    Log.info("🌐 Resolved peer: \(hostString):\(port)")
                    // Store debug information
                    self?.debugDiscoveredPeers[name] = "\(hostString):\(port.rawValue)"
                    // Now connect using the resolved IP and actual port
                    self?.connectToPeer(name: name, host: hostString, port: port.rawValue)
                }
                connection.cancel()
            case .failed(let error):
                Log.error("❌ Failed to resolve peer IP: \(error)")
                connection.cancel()
            default:
                break
            }
        }
        connection.start(queue: networkQueue)
    }
    
    /// Connect to discovered peer using Replicator (from documentation)
    private func connectToPeer(name: String, host: String, port: UInt16) {
        guard !peerReplicators.keys.contains(name) else {
            Log.info("⚠️ Already connected to peer: \(name)")
            return
        }
        
        Log.info("🔌 Connecting to peer: \(name) at \(host):\(port)")
        
        // Create URL endpoint for the peer (from documentation)
        let urlString = "ws://\(host):\(port)/\(database.name)"
        guard let url = URL(string: urlString) else {
            Log.error("❌ Invalid peer URL: \(urlString)")
            debugConnectionErrors[name] = "Invalid URL: \(urlString)"
            return
        }
        
        let target = URLEndpoint(url: url)
        
        // Create replicator configuration (from documentation pattern)
        var config = ReplicatorConfiguration(target: target)
        config.replicatorType = .pushAndPull
        config.continuous = true
        config.allowReplicatingInBackground = true
        
        // Configure basic authentication (from documentation)
        config.authenticator = BasicAuthenticator(username: hardcodedUsername, password: hardcodedPassword)
        
        // Add collections with CRDT conflict resolver
        var collectionConfig = CollectionConfiguration()
        collectionConfig.conflictResolver = LiquorCRDTConflictResolver.shared
        config.addCollections(collections, config: collectionConfig)
        
        // Create and configure replicator
        let replicator = Replicator(config: config)
        
        // Add change listener (from documentation)
        _ = replicator.addChangeListener { [weak self] change in
            Log.info("🔄 P2P sync with \(name): \(change.status.activity)")
            
            // Update debug info based on status
            switch change.status.activity {
            case .connecting:
                self?.debugConnectedPeers[name] = "\(host):\(port)"
                self?.debugConnectionErrors.removeValue(forKey: name)
            case .busy, .idle:
                self?.debugConnectedPeers[name] = "\(host):\(port) ✅"
            case .stopped:
                self?.debugConnectedPeers.removeValue(forKey: name)
                if let error = change.status.error {
                    self?.debugConnectionErrors[name] = error.localizedDescription
                }
            case .offline:
                self?.debugConnectedPeers.removeValue(forKey: name)
                self?.debugConnectionErrors[name] = "Offline"
            @unknown default:
                break
            }
            
            if let error = change.status.error {
                Log.error("❌ P2P sync error with \(name): \(error.localizedDescription)")
                self?.debugConnectionErrors[name] = error.localizedDescription
            }
            
            // Log document changes
            if change.status.progress.completed > 0 {
                Log.info("📊 Synced \(change.status.progress.completed) documents with \(name)")
            }
        }
        
        // Store replicator and start sync
        peerReplicators[name] = replicator
        discoveredPeers[name] = url
        
        replicator.start()
        Log.info("✅ Started P2P sync with peer: \(name)")
    }
    
    // MARK: - Control Methods
    
    /// Stop all P2P sync operations
    func stopAll() {
        Log.info("🛑 Stopping all P2P sync operations")
        
        // Stop passive peer components
        urlEndpointListener?.stop()
        urlEndpointListener = nil
        listener?.cancel()
        listener = nil
        
        // Stop active peer components
        browser?.cancel()
        browser = nil
        
        // Stop all peer replicators
        for (name, replicator) in peerReplicators {
            Log.info("🛑 Stopping sync with peer: \(name)")
            replicator.stop()
        }
        peerReplicators.removeAll()
        discoveredPeers.removeAll()
        
        isPassivePeer = false
        isActivePeer = false
        isRunning = false
        
        Log.info("✅ All P2P sync operations stopped")
    }
    
    /// Restart P2P sync (maintains current mode)
    func restart() {
        let wasPassive = isPassivePeer
        let wasActive = isActivePeer
        
        stopAll()
        
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
            if wasPassive {
                self.startAsPassivePeer()
            }
            if wasActive {
                self.startAsActivePeer()
            }
        }
    }
    
    // MARK: - Network Error Handling
    
    private func handleNetworkError(_ error: NWError) {
        // Track the latest Bonjour error for permission detection
        lastBonjourError = error
        lastBonjourErrorTime = Date()
        
        switch error {
        case .dns(DNSServiceErrorType(kDNSServiceErr_PolicyDenied)):
            Log.info("❌ Network access denied by policy")
        case .dns(DNSServiceErrorType(kDNSServiceErr_NoAuth)):
            Log.info("❌ Network authorization failed - need local network permission")
        default:
            Log.error("❌ Network error: \(error.localizedDescription)")
        }
    }
    
    // MARK: - Network Permission Detection
    
    private func checkNetworkPermission() {
        // Only check every 5 seconds to avoid spam
        guard Date().timeIntervalSince(lastPermissionCheck) > 5.0 else { return }
        lastPermissionCheck = Date()
        
        Log.info("🔍 Checking iOS local network permission...")
        
        // Check for recent NoAuth errors (within last 30 seconds)
        let recentErrorTime = Date().timeIntervalSince(lastBonjourErrorTime) < 30.0
        let hasRecentNoAuth = recentErrorTime && lastBonjourError != nil
        
        if hasRecentNoAuth {
            if case .dns(DNSServiceErrorType(kDNSServiceErr_NoAuth)) = lastBonjourError {
                Log.info("❌ Network permission check: DENIED - Recent NoAuth error detected")
                hasNetworkPermission = false
                return
            }
        }
        
        // Check if URLEndpointListener is working (indicates permission granted)
        let listenerWorking = urlEndpointListener != nil && urlEndpointListener?.port != nil
        
        // Check if we can do basic Bonjour operations
        if listenerWorking && !hasRecentNoAuth {
            Log.info("✅ Network permission check: GRANTED - No recent NoAuth errors")
            hasNetworkPermission = true
        } else if listenerWorking {
            Log.info("⚠️ Network permission check: Listener working but other issues present")
            hasNetworkPermission = true
        } else {
            Log.info("❌ Network permission check: Operations not working")
            hasNetworkPermission = false
        }
    }
    
    // MARK: - Status Methods
    
    func getStatus() -> P2PSyncStatus {
        // Check permission status periodically
        checkNetworkPermission()
        
        let permissionStatus: String
        if hasNetworkPermission {
            permissionStatus = "Network permission granted ✅"
        } else {
            permissionStatus = "iOS local network permission required"
        }
        
        return P2PSyncStatus(
            isPassivePeer: isPassivePeer,
            isActivePeer: isActivePeer,
            isRunning: isRunning,
            listenerPort: urlEndpointListener?.port,
            connectedPeers: Array(peerReplicators.keys),
            discoveredPeers: Array(discoveredPeers.keys),
            debugDiscoveredPeers: debugDiscoveredPeers,
            debugConnectedPeers: debugConnectedPeers,
            debugConnectionErrors: debugConnectionErrors,
            username: hardcodedUsername,
            serviceType: "_liquorapp._tcp",
            hasNetworkPermission: hasNetworkPermission,
            networkPermissionStatus: permissionStatus
        )
    }
}

// MARK: - Supporting Types

enum P2PSyncError: Error {
    case collectionNotFound
    case listenerNotStarted
    case invalidCredentials
    
    var localizedDescription: String {
        switch self {
        case .collectionNotFound:
            return "Database collection not found"
        case .listenerNotStarted:
            return "URL endpoint listener not started"
        case .invalidCredentials:
            return "Invalid authentication credentials"
        }
    }
}

struct P2PSyncStatus {
    let isPassivePeer: Bool
    let isActivePeer: Bool
    let isRunning: Bool
    let listenerPort: UInt16?
    let connectedPeers: [String]
    let discoveredPeers: [String]
    let debugDiscoveredPeers: [String: String] // [peerName: endpoint]
    let debugConnectedPeers: [String: String] // [peerName: endpoint]
    let debugConnectionErrors: [String: String] // [peerName: errorMessage]
    let username: String
    let serviceType: String
    let hasNetworkPermission: Bool
    let networkPermissionStatus: String
}

// MARK: - Log Class (if not already defined)

class Log {
    static func info(_ message: String) {
        print("ℹ️ [P2PSync] \(message)")
    }
    
    static func error(_ message: String) {
        print("❌ [P2PSync] \(message)")
    }
}