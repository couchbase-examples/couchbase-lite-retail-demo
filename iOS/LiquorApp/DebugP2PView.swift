import SwiftUI
import CouchbaseLiteSwift

struct DebugP2PView: View {
    @EnvironmentObject var databaseManager: DatabaseManager
    @EnvironmentObject var p2pSyncManagerWrapper: MultipeerP2PSyncManagerWrapper
    @StateObject private var debugInfo = P2PDebugInfo()
    @State private var refreshTimer: Timer?
    
    var body: some View {
        NavigationView {
            ScrollView {
                VStack(alignment: .leading, spacing: 20) {
                    // Header
                    VStack(alignment: .leading, spacing: 8) {
                        Text("P2P Sync Debug")
                            .font(.largeTitle)
                            .fontWeight(.bold)
                        
                        Text("Development debugging tool")
                            .font(.caption)
                            .foregroundColor(.gray)
                    }
                    .padding(.horizontal)
                    
                    Divider()
                    
                    // P2P Status Section
                    VStack(alignment: .leading, spacing: 12) {
                        Label("P2P Sync Status", systemImage: "wifi.circle.fill")
                            .font(.headline)
                            .foregroundColor(.blue)
                        
                        P2PStatusCard(
                            title: "Passive Peer (Server)",
                            status: debugInfo.isPassivePeerRunning,
                            details: "Listening on port: \(debugInfo.listenerPort)"
                        )
                        
                        P2PStatusCard(
                            title: "Active Peer (Client)",
                            status: debugInfo.isActivePeerRunning,
                            details: "Browsing for peers"
                        )
                        
                        P2PStatusCard(
                            title: "Network Permission",
                            status: debugInfo.hasNetworkPermission,
                            details: debugInfo.networkPermissionDetails
                        )
                    }
                    .padding(.horizontal)
                    
                    Divider()
                    
                    // Connected Devices Section
                    VStack(alignment: .leading, spacing: 12) {
                        HStack {
                            Label("Connected Devices", systemImage: "devices")
                                .font(.headline)
                                .foregroundColor(.green)
                            
                            Spacer()
                            
                            Text("\(debugInfo.connectedDevices.count)")
                                .font(.title2)
                                .fontWeight(.bold)
                                .foregroundColor(.green)
                        }
                        
                        if debugInfo.connectedDevices.isEmpty {
                            VStack(spacing: 8) {
                                Image(systemName: "exclamationmark.triangle.fill")
                                    .font(.title)
                                    .foregroundColor(.orange)
                                
                                Text("No devices connected")
                                    .font(.subheadline)
                                    .foregroundColor(.secondary)
                                
                                Text("Make sure both devices are on the same network and have network permissions enabled")
                                    .font(.caption)
                                    .foregroundColor(.gray)
                                    .multilineTextAlignment(.center)
                            }
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 20)
                            .background(Color.gray.opacity(0.1))
                            .cornerRadius(8)
                        } else {
                            ForEach(debugInfo.connectedDevices, id: \.deviceId) { device in
                                DeviceCard(device: device)
                            }
                        }
                    }
                    .padding(.horizontal)
                    
                    Divider()
                    
                    // Discovered Devices Section
                    VStack(alignment: .leading, spacing: 12) {
                        HStack {
                            Label("Discovered Devices", systemImage: "magnifyingglass.circle")
                                .font(.headline)
                                .foregroundColor(.orange)
                            
                            Spacer()
                            
                            Text("\(debugInfo.discoveredDevices.count)")
                                .font(.title2)
                                .fontWeight(.bold)
                                .foregroundColor(.orange)
                        }
                        
                        if debugInfo.discoveredDevices.isEmpty {
                            VStack(spacing: 8) {
                                Image(systemName: "antenna.radiowaves.left.and.right.slash")
                                    .font(.title)
                                    .foregroundColor(.gray)
                                
                                Text("No devices discovered")
                                    .font(.subheadline)
                                    .foregroundColor(.secondary)
                                
                                Text("Check network permissions and ensure other devices are running the app")
                                    .font(.caption)
                                    .foregroundColor(.gray)
                                    .multilineTextAlignment(.center)
                            }
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 20)
                            .background(Color.gray.opacity(0.1))
                            .cornerRadius(8)
                        } else {
                            ForEach(debugInfo.discoveredDevices, id: \.deviceId) { device in
                                DeviceCard(device: device)
                            }
                        }
                    }
                    .padding(.horizontal)
                    
                    Divider()
                    
                    // Authentication Section
                    VStack(alignment: .leading, spacing: 12) {
                        Label("Authentication Details", systemImage: "key.fill")
                            .font(.headline)
                            .foregroundColor(.purple)
                        
                        VStack(alignment: .leading, spacing: 8) {
                            HStack {
                                Text("Username:")
                                    .fontWeight(.semibold)
                                Spacer()
                                Text(debugInfo.username)
                                    .foregroundColor(.blue)
                                    .font(.monospaced(.body)())
                            }
                            
                            HStack {
                                Text("Password:")
                                    .fontWeight(.semibold)
                                Spacer()
                                Text(String(repeating: "•", count: debugInfo.password.count))
                                    .foregroundColor(.blue)
                                    .font(.monospaced(.body)())
                            }
                            
                            HStack {
                                Text("Service Type:")
                                    .fontWeight(.semibold)
                                Spacer()
                                Text(debugInfo.serviceType)
                                    .foregroundColor(.blue)
                                    .font(.monospaced(.body)())
                            }
                        }
                        .padding()
                        .background(Color.purple.opacity(0.1))
                        .cornerRadius(8)
                    }
                    .padding(.horizontal)
                    
                    // Refresh Button
                    Button(action: {
                        debugInfo.refreshData()
                    }) {
                        HStack {
                            Image(systemName: "arrow.clockwise")
                            Text("Refresh Status")
                        }
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(Color.blue)
                        .foregroundColor(.white)
                        .cornerRadius(8)
                    }
                    .padding(.horizontal)
                    .padding(.bottom)
                }
            }
        }
        .onAppear {
            debugInfo.multipeerSyncManager = p2pSyncManagerWrapper
            debugInfo.refreshData()
            // Auto-refresh every 2 seconds
            refreshTimer = Timer.scheduledTimer(withTimeInterval: 2.0, repeats: true) { _ in
                debugInfo.refreshData()
            }
        }
        .onDisappear {
            refreshTimer?.invalidate()
            refreshTimer = nil
        }
    }
}

struct P2PStatusCard: View {
    let title: String
    let status: Bool
    let details: String
    
    var body: some View {
        HStack {
            VStack(alignment: .leading, spacing: 4) {
                Text(title)
                    .font(.subheadline)
                    .fontWeight(.semibold)
                
                Text(details)
                    .font(.caption)
                    .foregroundColor(.gray)
            }
            
            Spacer()
            
            Image(systemName: status ? "checkmark.circle.fill" : "xmark.circle.fill")
                .foregroundColor(status ? .green : .red)
                .font(.title2)
        }
        .padding()
        .background(status ? Color.green.opacity(0.1) : Color.red.opacity(0.1))
        .cornerRadius(8)
    }
}

struct DeviceCard: View {
    let device: DebugDevice
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                VStack(alignment: .leading, spacing: 2) {
                    Text(device.name)
                        .font(.subheadline)
                        .fontWeight(.semibold)
                    
                    Text("ID: \(device.deviceId)")
                        .font(.caption)
                        .foregroundColor(.gray)
                        .font(.monospaced(.caption)())
                }
                
                Spacer()
                
                VStack(alignment: .trailing, spacing: 2) {
                    Text(device.connectionStatus.rawValue)
                        .font(.caption)
                        .fontWeight(.semibold)
                        .foregroundColor(device.connectionStatus.color)
                    
                    if let endpoint = device.endpoint {
                        Text(endpoint)
                            .font(.caption2)
                            .foregroundColor(.gray)
                            .font(.monospaced(.caption2)())
                    }
                }
            }
            
            if let lastSeen = device.lastSeen {
                HStack {
                    Image(systemName: "clock")
                        .font(.caption)
                        .foregroundColor(.gray)
                    
                    Text("Last seen: \(lastSeen, formatter: timeFormatter)")
                        .font(.caption)
                        .foregroundColor(.gray)
                }
            }
            
            if let errorMessage = device.errorMessage {
                HStack {
                    Image(systemName: "exclamationmark.triangle.fill")
                        .font(.caption)
                        .foregroundColor(.orange)
                    
                    Text(errorMessage)
                        .font(.caption)
                        .foregroundColor(.orange)
                }
            }
        }
        .padding()
        .background(Color.blue.opacity(0.05))
        .cornerRadius(8)
        .overlay(
            RoundedRectangle(cornerRadius: 8)
                .stroke(device.connectionStatus.color.opacity(0.3), lineWidth: 1)
        )
    }
}

enum ConnectionStatus: String, CaseIterable {
    case connected = "Connected"
    case connecting = "Connecting"
    case discovered = "Discovered"
    case failed = "Failed"
    case disconnected = "Disconnected"
    
    var color: Color {
        switch self {
        case .connected: return .green
        case .connecting: return .orange
        case .discovered: return .blue
        case .failed: return .red
        case .disconnected: return .gray
        }
    }
}

struct DebugDevice {
    let deviceId: String
    let name: String
    let connectionStatus: ConnectionStatus
    let endpoint: String?
    let lastSeen: Date?
    let errorMessage: String?
}

class P2PDebugInfo: ObservableObject {
    @Published var isPassivePeerRunning = false
    @Published var isActivePeerRunning = false
    @Published var hasNetworkPermission = false
    @Published var networkPermissionDetails = "Unknown"
    @Published var listenerPort = 0
    @Published var connectedDevices: [DebugDevice] = []
    @Published var discoveredDevices: [DebugDevice] = []
    @Published var username = "liquoruser"
    @Published var password = "liquorpass123"
    @Published var serviceType = "_liquorapp._tcp"
    
    var multipeerSyncManager: MultipeerP2PSyncManagerWrapper?
    
    func refreshData() {
        guard let manager = multipeerSyncManager else {
            updateMockData()
            return
        }
        
        let status = manager.getStatus()
        
        // Update status
        isPassivePeerRunning = status.isPassivePeer
        isActivePeerRunning = status.isActivePeer
        hasNetworkPermission = status.hasNetworkPermission
        networkPermissionDetails = status.networkPermissionStatus
        listenerPort = Int(status.listenerPort ?? 0)
        username = status.username
        serviceType = status.serviceType
        
        // Update discovered devices
        discoveredDevices = status.debugDiscoveredPeers.map { (name, endpoint) in
            let connectionStatus: ConnectionStatus
            if status.debugConnectedPeers.keys.contains(name) {
                connectionStatus = .connected
            } else if status.debugConnectionErrors.keys.contains(name) {
                connectionStatus = .failed
            } else {
                connectionStatus = .discovered
            }
            
            return DebugDevice(
                deviceId: name,
                name: name.replacingOccurrences(of: "LiquorApp-", with: "Device "),
                connectionStatus: connectionStatus,
                endpoint: endpoint,
                lastSeen: Date(), // We could track this in P2PSyncManager
                errorMessage: status.debugConnectionErrors[name]
            )
        }
        
        // Update connected devices
        connectedDevices = status.debugConnectedPeers.map { (name, endpoint) in
            DebugDevice(
                deviceId: name,
                name: name.replacingOccurrences(of: "LiquorApp-", with: "Device "),
                connectionStatus: .connected,
                endpoint: endpoint,
                lastSeen: Date(),
                errorMessage: nil
            )
        }
    }
    
    private func updateMockData() {
        // Fallback to mock data if P2PSyncManager is not available
        isPassivePeerRunning = true
        isActivePeerRunning = true
        hasNetworkPermission = false
        networkPermissionDetails = "P2PSyncManager not available"
        listenerPort = 0
        discoveredDevices = []
        connectedDevices = []
    }
}

private let timeFormatter: DateFormatter = {
    let formatter = DateFormatter()
    formatter.timeStyle = .medium
    formatter.dateStyle = .none
    return formatter
}()

#Preview {
    DebugP2PView()
        .environmentObject(DatabaseManager())
}