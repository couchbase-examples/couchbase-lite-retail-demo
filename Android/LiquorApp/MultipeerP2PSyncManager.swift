//
//  MultipeerP2PSyncManager.swift
//  LiquorApp
//
//  Created by Multipeer Connectivity Migration
//  Adapted from couchbase-lite-multipeer-sync-sample
//

import Foundation
import CouchbaseLiteSwift
import MultipeerConnectivity
import Combine
import os

/// MultipeerP2PSyncManager manages peer-to-peer synchronization using MultipeerConnectivity framework.
/// This is a direct adaptation of the working MultipeerSync sample for LiquorApp.
///
/// Key Features:
/// - Automatic peer discovery and advertising
/// - UUID-based role assignment (eliminates connection conflicts)
/// - MessageEndpoint for seamless Couchbase Lite integration
/// - CRDT conflict resolution for inventory quantities
/// - Reactive UI updates via Combine publishers
///
class MultipeerP2PSyncManager: NSObject, ObservableObject {
    
    // MARK: - Configuration
    
    private let serviceType = "_liquor-sync._tcp"
    private let myPeerID: MCPeerID
    private let myPeerUUID: String
    private let connectionManager: LiquorConnectionManager
    
    // MARK: - MultipeerConnectivity Components
    
    private var advertiser: MCNearbyServiceAdvertiser
    private var browser: MCNearbyServiceBrowser
    
    // MARK: - State Management
    
    @Published var isRunning = false
    @Published var connectedPeers: [MCPeerID] = []
    @Published var syncStatus = "Stopped"
    
    // MARK: - Logging
    
    static let logEnabled = true
    static let logger: os.Logger = {
        if logEnabled {
            return Logger(subsystem: Bundle.main.bundleIdentifier!, category: "MultipeerP2PSync")
        } else {
            return Logger(OSLog.disabled)
        }
    }()
    
    // MARK: - Initialization
    
    init(database: Database) {
        // Generate unique peer ID and UUID
        self.myPeerID = MCPeerID(displayName: UIDevice.current.name + "-Liquor")
        self.myPeerUUID = UUID().uuidString
        
        // Initialize connection manager with collections
        let collection = try! database.defaultCollection()
        self.connectionManager = LiquorConnectionManager(collections: [collection])
        
        // Initialize MultipeerConnectivity components
        self.advertiser = MCNearbyServiceAdvertiser(
            peer: myPeerID,
            discoveryInfo: ["uuid": myPeerUUID],
            serviceType: serviceType
        )
        self.browser = MCNearbyServiceBrowser(peer: myPeerID, serviceType: serviceType)
        
        super.init()
        
        // Set delegates
        advertiser.delegate = self
        browser.delegate = self
        
        // Subscribe to connection updates
        connectionManager.peerIDsPublisher
            .receive(on: DispatchQueue.main)
            .assign(to: &$connectedPeers)
        
        MultipeerP2PSyncManager.logger.info("🚀 MultipeerP2PSyncManager initialized with peer: \(self.myPeerID.displayName)")
    }
    
    // MARK: - Control Methods
    
    /// Start peer-to-peer synchronization
    func start() {
        guard !isRunning else {
            MultipeerP2PSyncManager.logger.info("⚠️ P2P sync already running")
            return
        }
        
        MultipeerP2PSyncManager.logger.info("🌟 Starting Multipeer P2P Sync...")
        
        advertiser.startAdvertisingPeer()
        browser.startBrowsingForPeers()
        
        DispatchQueue.main.async {
            self.isRunning = true
            self.syncStatus = "Discovering peers..."
        }
        
        MultipeerP2PSyncManager.logger.info("✅ P2P sync started successfully")
    }
    
    /// Stop peer-to-peer synchronization
    func stop() {
        guard isRunning else {
            MultipeerP2PSyncManager.logger.info("⚠️ P2P sync already stopped")
            return
        }
        
        MultipeerP2PSyncManager.logger.info("🛑 Stopping Multipeer P2P Sync...")
        
        advertiser.stopAdvertisingPeer()
        browser.stopBrowsingForPeers()
        connectionManager.stopAllConnections()
        
        DispatchQueue.main.async {
            self.isRunning = false
            self.syncStatus = "Stopped"
            self.connectedPeers = []
        }
        
        MultipeerP2PSyncManager.logger.info("✅ P2P sync stopped successfully")
    }
    
    /// Restart P2P synchronization
    func restart() {
        MultipeerP2PSyncManager.logger.info("🔄 Restarting P2P sync...")
        stop()
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
            self.start()
        }
    }
    
    // MARK: - Status Methods
    
    func getSimpleStatus() -> MultipeerP2PStatus {
        return MultipeerP2PStatus(
            isRunning: isRunning,
            connectedPeers: connectedPeers.map { $0.displayName },
            syncStatus: syncStatus,
            serviceType: serviceType,
            myPeerName: myPeerID.displayName
        )
    }
}

// MARK: - MCSessionDelegate

extension MultipeerP2PSyncManager: MCSessionDelegate {
    func session(_ session: MCSession, peer peerID: MCPeerID, didChange state: MCSessionState) {
        switch state {
        case .connected:
            MultipeerP2PSyncManager.logger.info("✅ Peer Connected: \(peerID.displayName)")
            connectionManager.startConnection(forPeer: peerID)
            DispatchQueue.main.async {
                self.syncStatus = "Connected to \(self.connectedPeers.count) peer(s)"
            }
            
        case .notConnected:
            MultipeerP2PSyncManager.logger.info("❌ Peer Disconnected: \(peerID.displayName)")
            connectionManager.stopConnection(forPeer: peerID)
            DispatchQueue.main.async {
                let count = self.connectedPeers.count
                self.syncStatus = count > 0 ? "Connected to \(count) peer(s)" : "Discovering peers..."
            }
            
        case .connecting:
            MultipeerP2PSyncManager.logger.info("🔄 Connecting to: \(peerID.displayName)")
            DispatchQueue.main.async {
                self.syncStatus = "Connecting to \(peerID.displayName)..."
            }
            
        @unknown default:
            break
        }
    }
    
    func session(_ session: MCSession, didReceive data: Data, fromPeer peerID: MCPeerID) {
        connectionManager.receiveData(data, forPeer: peerID)
    }
    
    func session(_ session: MCSession, didReceive stream: InputStream, withName streamName: String, fromPeer peerID: MCPeerID) {
        // Not used in this implementation
    }
    
    func session(_ session: MCSession, didFinishReceivingResourceWithName resourceName: String, fromPeer peerID: MCPeerID, at localURL: URL?, withError error: Error?) {
        // Not used in this implementation
    }
    
    func session(_ session: MCSession, didStartReceivingResourceWithName resourceName: String, fromPeer peerID: MCPeerID, with progress: Progress) {
        // Not used in this implementation
    }
}

// MARK: - MCNearbyServiceAdvertiserDelegate

extension MultipeerP2PSyncManager: MCNearbyServiceAdvertiserDelegate {
    func advertiser(_ advertiser: MCNearbyServiceAdvertiser, didReceiveInvitationFromPeer peerID: MCPeerID, withContext context: Data?, invitationHandler: @escaping (Bool, MCSession?) -> Void) {
        
        // Check if already connected
        if connectionManager.containsPeer(peerID) {
            MultipeerP2PSyncManager.logger.debug("❌ Rejecting invitation from \(peerID.displayName) - already connected")
            invitationHandler(false, nil)
            return
        }
        
        MultipeerP2PSyncManager.logger.info("📨 Accepting invitation from peer: \(peerID.displayName)")
        
        // Create session and register as passive connection (listener)
        let session = MCSession(peer: self.myPeerID)
        session.delegate = self
        connectionManager.registerPeer(peerID, peerUUID: nil, session: session, listenerPeer: false)
        
        invitationHandler(true, session)
    }
}

// MARK: - MCNearbyServiceBrowserDelegate

extension MultipeerP2PSyncManager: MCNearbyServiceBrowserDelegate {
    func browser(_ browser: MCNearbyServiceBrowser, foundPeer peerID: MCPeerID, withDiscoveryInfo info: [String : String]?) {
        
        guard let info = info, let uuid = info["uuid"] else {
            MultipeerP2PSyncManager.logger.warning("⚠️ Found peer \(peerID.displayName) without UUID info")
            return
        }
        
        // 🎯 KEY INNOVATION: UUID-based role assignment
        // Only invite when my UUID is smaller (prevents connection conflicts)
        if myPeerUUID < uuid {
            
            // Check if already connected
            if connectionManager.containsPeer(peerID) {
                MultipeerP2PSyncManager.logger.debug("⚠️ Ignoring \(peerID.displayName) - already connected")
                return
            }
            
            MultipeerP2PSyncManager.logger.info("🎯 Found and inviting peer: \(peerID.displayName)")
            
            // Create session and register as active connection (replicator)
            let session = MCSession(peer: self.myPeerID)
            session.delegate = self
            connectionManager.registerPeer(peerID, peerUUID: uuid, session: session, listenerPeer: true)
            
            // Invite the peer
            browser.invitePeer(peerID, to: session, withContext: nil, timeout: 10)
            
        } else {
            MultipeerP2PSyncManager.logger.debug("⏸️ Found peer \(peerID.displayName) with larger UUID - waiting for invitation")
        }
    }
    
    func browser(_ browser: MCNearbyServiceBrowser, lostPeer peerID: MCPeerID) {
        MultipeerP2PSyncManager.logger.info("📡 Lost peer: \(peerID.displayName)")
        connectionManager.stopConnection(forPeer: peerID)
    }
}

// MARK: - Supporting Types

struct MultipeerP2PStatus {
    let isRunning: Bool
    let connectedPeers: [String]
    let syncStatus: String
    let serviceType: String
    let myPeerName: String
}

// MARK: - LiquorConnectionManager

/// Connection manager specifically for LiquorApp's inventory synchronization
fileprivate class LiquorConnectionManager {
    
    // MARK: - Properties
    
    private let lock = NSLock()
    private var connections: [MCPeerID: LiquorMultipeerConnection] = [:]
    private var replicators: [MCPeerID: Replicator] = [:]
    private let collections: [Collection]
    private let listener: MessageEndpointListener
    private let peerIDsSubject = PassthroughSubject<[MCPeerID], Never>()
    
    var peerIDsPublisher: AnyPublisher<[MCPeerID], Never> {
        peerIDsSubject.eraseToAnyPublisher()
    }
    
    // MARK: - Initialization
    
    init(collections: [Collection]) {
        self.collections = collections
        
        // Create MessageEndpointListener with CRDT conflict resolver
        let config = MessageEndpointListenerConfiguration(collections: collections, protocolType: .messageStream)
        
        self.listener = MessageEndpointListener(config: config)
        
        MultipeerP2PSyncManager.logger.info("🔧 LiquorConnectionManager initialized with CRDT resolver")
    }
    
    // MARK: - Peer Management
    
    func registerPeer(_ peerID: MCPeerID, peerUUID: String?, session: MCSession, listenerPeer: Bool) {
        lock.lock()
        defer { lock.unlock() }
        
        let connection: LiquorMultipeerConnection
        
        if listenerPeer {
            // This device will be the replicator (active peer)
            MultipeerP2PSyncManager.logger.debug("📱 Registering as REPLICATOR to listener peer: \(peerID.displayName)")
            connection = LiquorMultipeerConnection.active(peerID: peerID, session: session, peerUUID: peerUUID!)
        } else {
            // This device will be the listener (passive peer)
            MultipeerP2PSyncManager.logger.debug("🎧 Registering as LISTENER for replicator peer: \(peerID.displayName)")
            connection = LiquorMultipeerConnection.passive(peerID: peerID, session: session, acceptConnection: { connection in
                MultipeerP2PSyncManager.logger.info("✅ Listener accepting connection from: \(peerID.displayName)")
                self.listener.accept(connection: connection)
            })
        }
        
        connections[connection.peerID] = connection
        peerIDsSubject.send(Array(connections.keys))
    }
    
    func containsPeer(_ peerID: MCPeerID) -> Bool {
        lock.lock()
        defer { lock.unlock() }
        return connections[peerID] != nil
    }
    
    func peers() -> [MCPeerID] {
        lock.lock()
        defer { lock.unlock() }
        return Array(connections.keys)
    }
    
    // MARK: - Connection Lifecycle
    
    func startConnection(forPeer peerID: MCPeerID) {
        lock.lock()
        defer { lock.unlock() }
        
        guard let connection = connections[peerID] else { return }
        
        if connection.active {
            startReplicator(forConnection: connection)
        }
    }
    
    func stopConnection(forPeer peerID: MCPeerID) {
        lock.lock()
        defer { lock.unlock() }
        
        guard let connection = connections[peerID] else { return }
        
        MultipeerP2PSyncManager.logger.info("🛑 Stopping connection to: \(connection.peerID.displayName)")
        stopConnection(connection)
        peerIDsSubject.send(Array(connections.keys))
    }
    
    func stopAllConnections() {
        lock.lock()
        defer { lock.unlock() }
        
        MultipeerP2PSyncManager.logger.info("🛑 Stopping all connections...")
        let conns = connections.values
        for connection in conns {
            stopConnection(connection)
        }
        peerIDsSubject.send(Array(connections.keys))
    }
    
    func receiveData(_ data: Data, forPeer peerID: MCPeerID) {
        lock.lock()
        defer { lock.unlock() }
        
        guard let connection = connections[peerID] else { return }
        connection.receive(data: data)
    }
    
    // MARK: - Private Methods
    
    private func stopConnection(_ connection: LiquorMultipeerConnection) {
        if connection.isConnected() {
            if connection.active {
                // Stop replicator
                if let replicator = replicators[connection.peerID] {
                    MultipeerP2PSyncManager.logger.debug("⏹️ Stopping replicator to: \(connection.peerID.displayName)")
                    replicator.stop()
                    replicators.removeValue(forKey: connection.peerID)
                }
            } else {
                // Close listener connection
                MultipeerP2PSyncManager.logger.debug("⏹️ Closing listener connection for: \(connection.peerID.displayName)")
                listener.close(connection: connection)
            }
        } else {
            connection.disconnect()
        }
        connections.removeValue(forKey: connection.peerID)
    }
    
    private func startReplicator(forConnection connection: LiquorMultipeerConnection) {
        MultipeerP2PSyncManager.logger.info("🚀 Starting replicator to: \(connection.peerID.displayName)")
        
        // Create MessageEndpoint
        let endpoint = MessageEndpoint(
            uid: connection.peerUUID!,
            target: connection,
            protocolType: .messageStream,
            delegate: self
        )
        
        // Configure replicator with CRDT conflict resolver
        var config = ReplicatorConfiguration(target: endpoint)
        
        var collectionConfig = CollectionConfiguration()
        collectionConfig.conflictResolver = LiquorCRDTConflictResolver.shared
        config.addCollections(self.collections, config: collectionConfig)
        
        config.continuous = true
        config.replicatorType = .pushAndPull
        
        // Create and start replicator
        let replicator = Replicator(config: config)
        replicators[connection.peerID] = replicator
        
        // Add change listener for logging
        _ = replicator.addChangeListener { change in
            MultipeerP2PSyncManager.logger.info("📊 Sync with \(connection.peerID.displayName): \(change.status.activity)")
            if let error = change.status.error {
                MultipeerP2PSyncManager.logger.error("❌ Sync error: \(error.localizedDescription)")
            }
        }
        
        replicator.start()
    }
}

// MARK: - MessageEndpointDelegate

extension LiquorConnectionManager: MessageEndpointDelegate {
    func createConnection(endpoint: MessageEndpoint) -> any MessageEndpointConnection {
        return endpoint.target as! MessageEndpointConnection
    }
}

// MARK: - LiquorMultipeerConnection

/// MessageEndpointConnection implementation using MultipeerConnectivity for LiquorApp
fileprivate class LiquorMultipeerConnection: MessageEndpointConnection {
    
    // MARK: - Error Types
    
    enum ConnectError: Error {
        case invalidHandshake
        case unknown
    }
    
    // MARK: - Types
    
    typealias AcceptConnection = (LiquorMultipeerConnection) -> Void
    
    // MARK: - Properties
    
    private let lock = NSLock()
    private var replicatorConnection: ReplicatorConnection?
    private var connected = false
    private var openCompletion: ((Bool, MessagingError?) -> Void)?
    
    let session: MCSession
    let peerID: MCPeerID
    let peerUUID: String?
    let active: Bool
    let acceptConnection: AcceptConnection?
    
    // MARK: - Factory Methods
    
    static func active(peerID: MCPeerID, session: MCSession, peerUUID: String) -> LiquorMultipeerConnection {
        return LiquorMultipeerConnection(peerID: peerID, session: session, active: true, peerUUID: peerUUID)
    }
    
    static func passive(peerID: MCPeerID, session: MCSession, acceptConnection: @escaping AcceptConnection) -> LiquorMultipeerConnection {
        return LiquorMultipeerConnection(peerID: peerID, session: session, active: false, peerUUID: nil, acceptConnection: acceptConnection)
    }
    
    // MARK: - Initialization
    
    private init(peerID: MCPeerID, session: MCSession, active: Bool, peerUUID: String? = nil, acceptConnection: AcceptConnection? = nil) {
        self.peerID = peerID
        self.session = session
        self.peerUUID = peerUUID
        self.active = active
        self.acceptConnection = acceptConnection
    }
    
    // MARK: - MessageEndpointConnection Implementation
    
    func isConnected() -> Bool {
        lock.lock()
        defer { lock.unlock() }
        return connected
    }
    
    func open(connection: any ReplicatorConnection, completion: @escaping (Bool, MessagingError?) -> Void) {
        lock.lock()
        defer { lock.unlock() }
        
        replicatorConnection = connection
        openCompletion = completion
        
        // Perform handshake
        do {
            if active {
                MultipeerP2PSyncManager.logger.debug("📤 Sending CONNECT to: \(self.peerID.displayName)")
                try send(data: "CONNECT".data(using: .utf8)!)
            } else {
                MultipeerP2PSyncManager.logger.debug("📤 Sending OK to: \(self.peerID.displayName)")
                try send(data: "OK".data(using: .utf8)!)
                openCompleted(success: true)
            }
        } catch {
            openCompleted(success: false, error: error)
        }
    }
    
    private func openCompleted(success: Bool, error: Error? = nil) {
        guard let completion = openCompletion else { return }
        
        if success {
            MultipeerP2PSyncManager.logger.debug("✅ Connection opened to: \(self.peerID.displayName)")
            connected = true
            completion(true, nil)
        } else {
            let err = error ?? ConnectError.unknown
            MultipeerP2PSyncManager.logger.warning("❌ Failed to open connection to: \(self.peerID.displayName), Error: \(err)")
            completion(false, MessagingError(error: err, isRecoverable: false))
            session.disconnect()
        }
        openCompletion = nil
    }
    
    func close(error: Error?, completion: @escaping () -> Void) {
        lock.lock()
        defer { lock.unlock() }
        
        MultipeerP2PSyncManager.logger.debug("🔌 Closing connection to: \(self.peerID.displayName)")
        session.disconnect()
        replicatorConnection = nil
        completion()
    }
    
    func send(message: Message, completion: @escaping (Bool, MessagingError?) -> Void) {
        lock.lock()
        defer { lock.unlock() }
        
        do {
            try send(data: message.toData())
            completion(true, nil)
        } catch {
            MultipeerP2PSyncManager.logger.error("❌ Error sending message to: \(self.peerID.displayName), Error: \(error)")
            completion(false, MessagingError(error: error, isRecoverable: false))
        }
    }
    
    // MARK: - Data Transmission
    
    func send(data: Data) throws {
        try session.send(data, toPeers: [self.peerID], with: .reliable)
    }
    
    func receive(data: Data) {
        lock.lock()
        defer { lock.unlock() }
        
        if !connected {
            handleHandshake(withData: data)
        } else {
            replicatorConnection?.receive(message: Message.fromData(data))
        }
    }
    
    private func handleHandshake(withData data: Data) {
        let message = String(data: data, encoding: .utf8)
        if active {
            assert(message == "OK")
            MultipeerP2PSyncManager.logger.debug("📨 Received OK from: \(self.peerID.displayName)")
            openCompleted(success: true)
        } else {
            assert(message == "CONNECT")
            assert(acceptConnection != nil)
            MultipeerP2PSyncManager.logger.debug("📨 Received CONNECT from: \(self.peerID.displayName)")
            acceptConnection!(self)
        }
    }
    
    func disconnect() {
        lock.lock()
        defer { lock.unlock() }
        session.disconnect()
    }
}
