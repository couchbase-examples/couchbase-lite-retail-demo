import os
import Foundation
import Network
import UIKit
import CouchbaseLiteSwift
import Combine

final class LiquorSyncApp {
    private let name: String = "LiquorInventory"
    private let database: CouchbaseLiteSwift.Database
    private let collections: [CouchbaseLiteSwift.Collection]
    var endpoint: LiquorSyncApp.Endpoint? {
        didSet {
            // When the endpoint changes, restart sync
            if endpoint != oldValue {
                restart()
            }
        }
    }
    private let identity: SecIdentity?
    private let ca: SecCertificate?
    
    private let uuid = UUID().uuidString
    private var listener: NWListener?
    private var browser: NWBrowser?
    private var connections = [NWConnection]()
    private var messageEndpointListener: MessageEndpointListener
    private var messageEndpointConnections = [HashableObject : NMMessageEndpointConnection]()
    private var replicators = [HashableObject : Replicator]()
    private var endpointReplicator: Replicator?
    
    private let networkMonitor = NWPathMonitor()
    private let networkQueue = DispatchQueue(label: "LiquorSyncNetworkQueue", target: .global())
    
    struct Endpoint: Equatable {
        let url: URL
        let username: String?
        let password: String?

        static func == (lhs: Endpoint, rhs: Endpoint) -> Bool {
            return lhs.url == rhs.url &&
                   lhs.username == rhs.username &&
                   lhs.password == rhs.password
        }
    }
    
    // MARK: - Init
    
    convenience init(database: CouchbaseLiteSwift.Database, identity: SecIdentity, ca: SecCertificate) {
        self.init(database: database, endpoint: nil, identity: identity, ca: ca)
    }

    init(database: CouchbaseLiteSwift.Database, endpoint: LiquorSyncApp.Endpoint? = nil, identity: SecIdentity? = nil, ca: SecCertificate? = nil) {
        self.database = database
        self.collections = [try! database.defaultCollection()]
        self.endpoint = endpoint
        self.identity = identity
        self.ca = ca
        
        // Note: CRDT conflict resolution will be configured when replicators are created
        print("[LiquorSync] P2P sync configured")
        
        // Create the message endpoint listener for incoming P2P connections
        let config = MessageEndpointListenerConfiguration(collections: collections, protocolType: .byteStream)
        messageEndpointListener = MessageEndpointListener(config: config)
        
        // Monitor network changes
        networkMonitor.pathUpdateHandler = { [weak self] path in
            switch path.status {
            case .satisfied:
                Log.info("Network available - starting sync")
                self?.restart()
            default:
                Log.info("Network unavailable - pausing sync")
                self?.pause()
            }
        }
        networkMonitor.start(queue: networkQueue)
        
        // Force network permission dialog by attempting actual network operations
        requestNetworkPermission()
        
        // Handle app background/foreground states
        setupAppStateMonitoring()
        
        // Add database change listener for basic sync simulation
        setupDatabaseChangeListener()
    }
    
    private func setupDatabaseChangeListener() {
        guard let collection = collections.first else { return }
        
        collection.addChangeListener { change in
            Log.info("Database change detected: \(change.documentIDs.count) documents")
            // Simulate P2P sync by logging changes
            for docId in change.documentIDs {
                Log.info("Document changed: \(docId)")
            }
        }
    }
    
    // MARK: - App State Monitoring
    
    private func setupAppStateMonitoring() {
        var backgroundTask: UIBackgroundTaskIdentifier?
        
        NotificationCenter.default.addObserver(forName: UIApplication.didEnterBackgroundNotification, object: nil, queue: nil) { [weak self] _ in
            backgroundTask = UIApplication.shared.beginBackgroundTask {
                self?.networkQueue.sync { [weak self] in
                    self?.pause()
                    if let backgroundTask = backgroundTask {
                        UIApplication.shared.endBackgroundTask(backgroundTask)
                    }
                    backgroundTask = nil
                }
            }
        }
        
        NotificationCenter.default.addObserver(forName: UIApplication.willEnterForegroundNotification, object: nil, queue: nil) { [weak self] _ in
            if let backgroundTask = backgroundTask {
                UIApplication.shared.endBackgroundTask(backgroundTask)
            }
            backgroundTask = nil
            self?.restart()
        }
    }
    
    // MARK: - Start/Stop
    
    private var started = false
    private var running = false

    func start() {
        networkQueue.sync {
            started = true
            resume()
        }
    }

    func stop() {
        networkQueue.sync {
            pause()
            started = false
        }
    }
    
    private func resume() {
        if started, !running {
            running = true
            
            // Start P2P sync if we have certificates
            if identity != nil, ca != nil {
                listener = createListener()
                browser = createBrowser()
                listener?.start(queue: networkQueue)
                browser?.start(queue: networkQueue)
                
                // Add fallback for simulator
                #if targetEnvironment(simulator)
                Log.info("Running in simulator - P2P sync may be limited")
                simulateP2PConnection()
                #endif
            } else {
                Log.info("No certificates found - running in basic sync mode")
            }
            
            // Start cloud sync if endpoint is configured
            endpointReplicator = createEndpointReplicator()
            endpointReplicator?.start()
        }
    }
    
    #if targetEnvironment(simulator)
    private func simulateP2PConnection() {
        // Simulate P2P connection for testing in simulator
        DispatchQueue.main.asyncAfter(deadline: .now() + 2.0) {
            Log.info("Simulated P2P connection established")
        }
    }
    #endif
    
    private func pause() {
        if started, running {
            running = false
            
            listener?.cancel()
            browser?.cancel()
            listener = nil
            browser = nil
            
            endpointReplicator?.stop()
            endpointReplicator = nil
            
            connections.forEach { connection in
                cleanupConnection(connection)
            }
            
            messageEndpointListener.closeAll()
        }
    }
    
    private func restart() {
        networkQueue.async { [weak self] in
            self?.pause()
            self?.resume()
        }
    }
    
    // MARK: - Network Parameters & Trust
    
    private var networkParameters: NWParameters {
        let tlsOptions = NWProtocolTLS.Options()
        
        if let identity = identity {
            let identity = sec_identity_create(identity)!
            sec_protocol_options_set_local_identity(tlsOptions.securityProtocolOptions, identity)
        }
        sec_protocol_options_set_verify_block(tlsOptions.securityProtocolOptions, trustVerificationBlock, DispatchQueue(label: "TrustEvaluation"))
        
        let params = NWParameters(tls: tlsOptions)
        params.includePeerToPeer = true
        params.allowLocalEndpointReuse = true
        
        return params
    }
    
    private let trustEvaluationQueue = DispatchQueue(label: "TrustEvaluationQueue")
    private var trustVerificationBlock: sec_protocol_verify_t {
        return { sec_protocol_metadata, sec_trust, sec_protocol_verify_complete in
            self.trustEvaluationQueue.async {
                let secTrust: SecTrust! = sec_trust_copy_ref(sec_trust).takeRetainedValue()
                let policy = SecPolicyCreateSSL(false, nil)
                SecTrustSetPolicies(secTrust, policy)
                SecTrustSetAnchorCertificates(secTrust, [self.ca] as CFArray)
                SecTrustSetAnchorCertificatesOnly(secTrust, true)
                
                SecTrustEvaluateAsyncWithError(secTrust, self.trustEvaluationQueue) { secTrust, trusted, error in
                    sec_protocol_verify_complete(trusted)
                }
            }
        }
    }
    
    // MARK: - P2P Network Discovery
    
    private func createListener() -> NWListener? {
        var listener: NWListener!
        do {
            listener = try NWListener(
                service: NWListener.Service(name: uuid, type: "_\(name)._tcp"),
                using: networkParameters
            )
        } catch {
            Log.error("Failed to create listener: \(error)")
            return nil
        }
        
        listener.newConnectionHandler = { [weak self] connection in
            self?.handleIncomingConnection(connection)
        }
        
        listener.stateUpdateHandler = { [weak self] newState in
            switch newState {
            case .ready:
                Log.info("P2P Listener ready for liquor inventory sync")
            case .failed(let error):
                Log.error("P2P Listener failed: \(error)")
                self?.handleNetworkError(error)
            case .cancelled:
                Log.info("P2P Listener cancelled")
            default:
                break
            }
        }
        
        return listener
    }
    
    private func handleNetworkError(_ error: NWError) {
        switch error {
        case .dns(DNSServiceErrorType(kDNSServiceErr_PolicyDenied)):
            Log.info("Network access denied by policy - P2P sync operating in basic mode")
        case .dns(DNSServiceErrorType(kDNSServiceErr_NoAuth)):
            Log.info("Network authorization failed - P2P sync requires network permissions")
            // Try to trigger the permission dialog by attempting a simple multicast operation
            DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
                self.triggerLocalNetworkPermission()
            }
        default:
            Log.error("Network error: \(error.localizedDescription)")
        }
    }
    
    /// Triggers the local network permission dialog by attempting a simple network operation
    private func triggerLocalNetworkPermission() {
        let connection = NWConnection(
            to: NWEndpoint.service(name: "test", type: "_trigger-permission._tcp", domain: "local", interface: nil),
            using: .tcp
        )
        
        connection.stateUpdateHandler = { state in
            switch state {
            case .ready:
                Log.info("Local network permission granted")
                connection.cancel()
            case .failed(let error):
                Log.info("Local network permission request failed: \(error)")
                connection.cancel()
            default:
                break
            }
        }
        
        connection.start(queue: networkQueue)
        
        // Cancel after a short timeout
        DispatchQueue.global().asyncAfter(deadline: .now() + 3.0) {
            connection.cancel()
        }
    }

    private func createBrowser() -> NWBrowser {
        let browserDescriptor = NWBrowser.Descriptor.bonjour(type: "_\(name)._tcp", domain: nil)
        let browser = NWBrowser(for: browserDescriptor, using: networkParameters)
        
        browser.browseResultsChangedHandler = { [weak self] results, changes in
            for change in changes {
                switch change {
                case .added(let result):
                    self?.handleDiscoveredPeer(result.endpoint)
                case .removed(let result):
                    Log.info("Lost liquor sync peer: \(result.endpoint)")
                    if let connection = self?.connections.first(where: { $0.endpoint == result.endpoint }) {
                        self?.cleanupConnection(connection)
                    }
                default:
                    break
                }
            }
        }
        
        browser.stateUpdateHandler = { [weak self] newState in
            switch newState {
            case .ready:
                Log.info("P2P Browser ready - searching for liquor inventory peers")
            case .failed(let error):
                Log.error("P2P Browser failed: \(error)")
                self?.handleNetworkError(error)
            case .cancelled:
                Log.info("P2P Browser cancelled")
            default:
                break
            }
        }
        
        return browser
    }
    
    // MARK: - Connection Handling
    
    private func handleIncomingConnection(_ connection: NWConnection) {
        Log.info("New incoming liquor sync connection: \(connection)")
        setupConnection(connection, isInitiator: false)
    }
    
    private func handleDiscoveredPeer(_ endpoint: NWEndpoint) {
        let connection = NWConnection(to: endpoint, using: networkParameters)
        Log.info("Connecting to discovered liquor sync peer: \(connection)")
        setupConnection(connection, isInitiator: true)
    }
    
    private func setupConnection(_ connection: NWConnection, isInitiator: Bool) {
        connection.stateUpdateHandler = { [weak self] newState in
            switch newState {
            case .ready:
                Log.info("Liquor sync connection ready: \(connection)")
                self?.connections.append(connection)
                if isInitiator {
                    self?.setupReplicator(for: connection)
                } else {
                    self?.setupMessageEndpointConnection(connection)
                }
            case .failed(let error):
                Log.error("Liquor sync connection failed: \(error)")
                self?.cleanupConnection(connection)
            case .cancelled:
                Log.info("Liquor sync connection cancelled: \(connection)")
                self?.cleanupConnection(connection)
            default:
                break
            }
        }
        
        connection.start(queue: networkQueue)
    }
    
    // MARK: - Replication Setup
    
    private func createEndpointReplicator() -> Replicator? {
        guard let endpoint = endpoint else { return nil }
        
        let url = endpoint.url.appending(path: name)
        let target = URLEndpoint(url: url)
        var config = ReplicatorConfiguration(target: target)
        config.replicatorType = .pushAndPull
        config.continuous = true
        config.allowReplicatingInBackground = true
        
        if let username = endpoint.username, let password = endpoint.password {
            config.authenticator = BasicAuthenticator(username: username, password: password)
        }

        var collectionConfig = CollectionConfiguration()
        collectionConfig.conflictResolver = LiquorCRDTConflictResolver.shared
        config.addCollections(collections, config: collectionConfig)

        let replicator = Replicator(config: config)
        
        // Add change listener for sync status
        replicator.addChangeListener { change in
            Log.info("Cloud sync status: \(change.status.activity)")
        }
        
        return replicator
    }
    
    private func setupMessageEndpointConnection(_ connection: NWConnection) {
        let messageEndpointConnection = NMMessageEndpointConnection(connection: connection)
        messageEndpointListener.accept(connection: messageEndpointConnection)
        messageEndpointConnections[HashableObject(connection)] = messageEndpointConnection
    }
    
    private func setupReplicator(for connection: NWConnection) {
        let messageEndpointDelegate = NMMessageEndpointDelegate(connection: connection)
        let target = MessageEndpoint(uid: uuid, target: nil, protocolType: .byteStream, delegate: messageEndpointDelegate)
        var config = ReplicatorConfiguration(target: target)
        config.replicatorType = .pushAndPull
        config.continuous = true
        config.allowReplicatingInBackground = true
        
        var collectionConfig = CollectionConfiguration()
        collectionConfig.conflictResolver = LiquorCRDTConflictResolver.shared
        config.addCollections(collections, config: collectionConfig)
        
        let replicator = Replicator(config: config)
        replicators[HashableObject(connection)] = replicator
        
        // Add change listener for P2P sync status
        replicator.addChangeListener { change in
            Log.info("P2P sync status: \(change.status.activity)")
        }
        
        replicator.start()
    }
    
    // MARK: - Message Endpoint Classes
    
    private class NMMessageEndpointDelegate: CouchbaseLiteSwift.MessageEndpointDelegate {
        private let connection: NWConnection
        
        init(connection: NWConnection) {
            self.connection = connection
        }
        
        func createConnection(endpoint: CouchbaseLiteSwift.MessageEndpoint) -> CouchbaseLiteSwift.MessageEndpointConnection {
            return NMMessageEndpointConnection(connection: connection)
        }
    }
    
    private class NMMessageEndpointConnection: CouchbaseLiteSwift.MessageEndpointConnection {
        private let connection: NWConnection
        private var replicatorConnection: ReplicatorConnection?
        
        init(connection: NWConnection) {
            self.connection = connection
        }
        
        func open(connection: CouchbaseLiteSwift.ReplicatorConnection, completion: @escaping (Bool, CouchbaseLiteSwift.MessagingError?) -> Void) {
            replicatorConnection = connection
            receive()
            completion(true, nil)
        }
        
        func close(error: Error?, completion: @escaping () -> Void) {
            replicatorConnection = nil
            connection.cancel()
            completion()
        }
        
        func send(message: CouchbaseLiteSwift.Message, completion: @escaping (Bool, CouchbaseLiteSwift.MessagingError?) -> Void) {
            let data = message.toData()
            Log.info("Sending liquor data: \(data.count) bytes")
            connection.send(content: data, contentContext: .defaultMessage, isComplete: true, completion: .contentProcessed({ error in
                if let error = error {
                    Log.error("Send error: \(error)")
                    completion(true, CouchbaseLiteSwift.MessagingError(error: error, isRecoverable: false))
                } else {
                    completion(true, nil)
                }
            }))
        }
        
        private func receive() {
            connection.receive(minimumIncompleteLength: 1, maximumLength: 65536) { [weak self] (data, _, _, error) in
                if let error = error {
                    Log.error("Receive error: \(error)")
                    self?.replicatorConnection?.close(error: MessagingError(error: error, isRecoverable: false))
                    self?.connection.cancel()
                } else {
                    if let data = data {
                        Log.info("Received liquor data: \(data.count) bytes")
                        let message = Message.fromData(data)
                        self?.replicatorConnection?.receive(message: message)
                    }
                    self?.receive()
                }
            }
        }
    }
    
    // MARK: - Cleanup
    
    private func cleanupConnection(_ connection: NWConnection) {
        if let messageEndpointConnection = messageEndpointConnections.removeValue(forKey: HashableObject(connection)) {
            messageEndpointListener.close(connection: messageEndpointConnection)
        }

        if let replicator = replicators.removeValue(forKey: HashableObject(connection)) {
            replicator.stop()
        }
        
        connection.cancel()
        connections.removeAll { $0 === connection }
    }
    
    /// Force network permission dialog using multiple approaches
    private func requestNetworkPermission() {
        Task {
            do {
                // Try the proven listener + browser pattern
                let hasPermission = try await requestLocalNetworkAuthorization()
                if hasPermission {
                    Log.info("✅ Local network permission granted")
                } else {
                    Log.info("❌ Local network permission denied")
                    // Try alternative approach after a brief delay
                    try await Task.sleep(nanoseconds: 1_000_000_000) // 1 second
                    await requestNetworkPermissionAlternative()
                }
            } catch {
                Log.error("Network permission request failed: \(error.localizedDescription)")
                // Try alternative approach as fallback
                await requestNetworkPermissionAlternative()
            }
        }
    }
    
    /// Alternative network permission request using direct broadcast
    private func requestNetworkPermissionAlternative() async {
        Log.info("🔄 Trying alternative network permission approach...")
        
        let queue = DispatchQueue(label: "com.couchbase.liquorapp.networkAuthAlt")
        
        // Create a simple UDP socket to trigger permission
        let connection = NWConnection(host: "224.0.0.251", port: 5353, using: .udp) // mDNS multicast
        
        connection.stateUpdateHandler = { state in
            switch state {
            case .ready:
                Log.info("✅ Alternative network connection ready - permission likely granted")
                connection.cancel()
            case .failed(let error):
                if let nwError = error as? NWError,
                   case .dns(DNSServiceErrorType(kDNSServiceErr_NoAuth)) = nwError {
                    Log.info("🚨 Alternative approach triggered permission request")
                } else {
                    Log.info("Alternative network connection failed: \(error.localizedDescription)")
                }
                connection.cancel()
            case .waiting(let error):
                Log.info("Alternative network connection waiting: \(error.localizedDescription)")
            default:
                break
            }
        }
        
        connection.start(queue: queue)
        
        // Cancel after 5 seconds
        DispatchQueue.global().asyncAfter(deadline: .now() + 5.0) {
            connection.cancel()
            Log.info("📱 Alternative network permission request completed")
        }
    }
    
    /// Checks whether Local Network permission has been granted, using the proven pattern from Nonstrict
    private func requestLocalNetworkAuthorization() async throws -> Bool {
        let queue = DispatchQueue(label: "com.couchbase.liquorapp.networkAuth")
        let serviceType = "_liquorapp._tcp" // Must match NSBonjourServices in Info.plist
        
        Log.info("🚨 Starting local network permission request using listener + browser pattern...")
        
        // Create listener
        let listener = try NWListener(using: NWParameters(tls: .none, tcp: NWProtocolTCP.Options()))
        listener.service = NWListener.Service(name: UUID().uuidString, type: serviceType)
        listener.newConnectionHandler = { _ in } // Must be set to avoid POSIX error 22
        
        // Create browser
        let parameters = NWParameters()
        parameters.includePeerToPeer = true
        let browser = NWBrowser(for: .bonjour(type: serviceType, domain: nil), using: parameters)
        
        return try await withCheckedThrowingContinuation { (continuation: CheckedContinuation<Bool, Error>) in
            var didResume = false
            
            func resume(with result: Swift.Result<Bool, Error>) {
                guard !didResume else { return }
                didResume = true
                
                // Cleanup
                listener.cancel()
                browser.cancel()
                continuation.resume(with: result)
            }
            
            // Listener state handling
            listener.stateUpdateHandler = { state in
                switch state {
                case .ready:
                    Log.info("🎯 Listener ready - waiting for browser to discover...")
                case .failed(let error), .waiting(let error):
                    Log.error("Listener failed: \(error.localizedDescription)")
                    resume(with: .failure(error))
                case .cancelled:
                    Log.info("Listener cancelled")
                default:
                    break
                }
            }
            
            // Browser state handling  
            browser.stateUpdateHandler = { state in
                switch state {
                case .ready:
                    Log.info("🔍 Browser ready - scanning for local services...")
                case .failed(let error):
                    Log.error("Browser failed: \(error.localizedDescription)")
                    resume(with: .failure(error))
                case .waiting(let error):
                    if let nwError = error as? NWError,
                       case .dns(DNSServiceErrorType(kDNSServiceErr_PolicyDenied)) = nwError {
                        Log.info("❌ Local Network Permission DENIED")
                        resume(with: .success(false))
                    } else {
                        Log.error("Browser waiting: \(error.localizedDescription)")
                        resume(with: .failure(error))
                    }
                case .cancelled:
                    Log.info("Browser cancelled")
                default:
                    break
                }
            }
            
            // Browser results handling - this indicates permission was granted
            browser.browseResultsChangedHandler = { results, changes in
                if !results.isEmpty {
                    Log.info("✅ Local Network Permission GRANTED - found \(results.count) services")
                    resume(with: .success(true))
                }
            }
            
            // Start both listener and browser
            listener.start(queue: queue)
            browser.start(queue: queue)
            
            // Auto-timeout after 10 seconds
            DispatchQueue.global().asyncAfter(deadline: .now() + 10.0) {
                Log.info("⏰ Network permission request timed out")
                resume(with: .success(false))
            }
        }
    }
    
    // MARK: - Utility Classes
    
    class Log {
        static private let logger = OSLog(subsystem: "liquor-inventory", category: "sync")
        
        static func info(_ message: String) {
            log(message, type: .info)
        }
        
        static func error(_ message: String) {
            log(message, type: .error)
        }
        
        private static func log(_ message: String, type: OSLogType) {
            let isDebuggerAttached = isatty(STDERR_FILENO) != 0
            
            if isDebuggerAttached {
                print("[LiquorSync] \(message)")
            } else {
                os_log("%{public}@", log: logger, type: type, message)
            }
        }
    }
    
    private class HashableObject: Hashable {
        let object: AnyObject

        init(_ object: AnyObject) {
            self.object = object
        }

        func hash(into hasher: inout Hasher) {
            hasher.combine(ObjectIdentifier(object))
        }

        static func ==(lhs: HashableObject, rhs: HashableObject) -> Bool {
            return lhs.object === rhs.object
        }
    }
} 