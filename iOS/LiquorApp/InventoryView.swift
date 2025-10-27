import SwiftUI
import CouchbaseLiteSwift
import Combine

struct InventoryView: View {
    @EnvironmentObject var databaseManager: DatabaseManager
    @EnvironmentObject var p2pSyncManagerWrapper: MultipeerP2PSyncManagerWrapper
    @EnvironmentObject var authManager: AuthenticationManager
    @State private var searchText = ""
    @State private var liquorItems: [LiquorItem] = []
    @State private var showDebugInfo = false
    @StateObject private var debugInfo = P2PDebugInfo()
    @State private var profileName: String?
    @State private var isRefreshing = false
    @State private var cancellables = Set<AnyCancellable>()  // For Combine publishers
    @Environment(\.dismiss) private var dismiss
    
    // Fixed 2-column layout to match Android
    private let columns = [
        GridItem(.flexible(), spacing: 16),
        GridItem(.flexible(), spacing: 16)
    ]
    
    var filteredItems: [LiquorItem] {
        if searchText.isEmpty {
            return liquorItems
        } else {
            return databaseManager.searchLiquor(searchText)
        }
    }
    
    var body: some View {
        NavigationView {
            VStack(spacing: 0) {
                // Search bar with sync indicator
                HStack {
                    Image(systemName: "magnifyingglass")
                        .foregroundColor(.gray)
                    
                    TextField("Search liquor...", text: $searchText)
                    
                    // Sync indicators with App Services + P2P
                    HStack(spacing: 8) {
                        // App Services sync indicator
                        AppServicesSyncIndicator()
                        
                        // P2P sync indicator (now clickable)
                        Button(action: {
                            showDebugInfo.toggle()
                        }) {
                            HStack(spacing: 4) {
                                Image(systemName: "wifi")
                                    .foregroundColor(.blue)
                                    .opacity(0.8)
                                
                                VStack(alignment: .trailing, spacing: 2) {
                                    Text("P2P")
                                        .font(.caption2)
                                        .foregroundColor(.blue)
                                        .fontWeight(.semibold)
                                
                                Text("DEBUG")
                                    .font(.caption2)
                                    .foregroundColor(.blue)
                                    .opacity(0.7)
                            }
                        }
                        .buttonStyle(PlainButtonStyle())
                        .help("Tap to show P2P debug info - Real-time inventory sync between devices")
                    }
                }
                .textFieldStyle(RoundedBorderTextFieldStyle())
                }
                .padding(.horizontal, 16)
                .padding(.vertical, 12)
                
                // P2P Debug Section (collapsible)
                if showDebugInfo {
                    InventoryP2PDebugView(debugInfo: debugInfo)
                        .transition(.opacity.combined(with: .slide))
                }
                
                // Inventory grid with pull-to-refresh
                ScrollView {
                    LazyVGrid(columns: columns, spacing: 16) {
                        ForEach(filteredItems) { item in
                            LiquorItemCard(
                                item: item,
                                storeId: AppConfig.storeId,
                                onQuantityChanged: { newQuantity in
                                    // Safely unwrap optional id
                                    guard let itemId = item.id else { return }
                                    databaseManager.updateQuantity(for: itemId, newQuantity: newQuantity)
                                    // Reactive query will update UI automatically - no manual reload needed
                                },
                                onReorder: { item, quantity in
                                    // Create order in database with specified quantity
                                    if let order = databaseManager.createOrder(item: item, quantity: quantity) {
                                        print("✅ Order created: \(order.id) with quantity: \(quantity)")
                                    }
                                }
                            )
                            .id("\(item.id ?? "")_\(item.quantity)")  // Force SwiftUI to detect quantity changes
                        }
                    }
                    .padding(.horizontal, 16)
                    .padding(.bottom, 20)
                }
                .refreshable {
                    await refreshData()
                }
            }
            .background(Color(.systemGroupedBackground))
            .navigationTitle("Grocery Inventory")
            .navigationBarTitleDisplayMode(.large)
            .toolbar {
                // Profile name on leading side (from Capella) with truncation
                ToolbarItem(placement: .navigationBarLeading) {
                    if let user = authManager.currentUser {
                        let displayName = profileName ?? user.fullName
                        // Truncate if longer than 35 characters
                        let truncatedName = displayName.count > 35 ? String(displayName.prefix(32)) + "..." : displayName
                        Text("Welcome, \(truncatedName)")
                            .font(.subheadline)
                            .foregroundColor(.secondary)
                            .lineLimit(1)
                    }
                }
                
                ToolbarItem(placement: .navigationBarTrailing) {
                    HStack(spacing: 12) {
                        // Refresh button
                        Button(action: {
                            Task {
                                await refreshData()
                            }
                        }) {
                            Image(systemName: "arrow.clockwise")
                                .foregroundColor(.blue)
                                .font(.title3)
                        }
                        
                        // User role badge
                        if let user = authManager.currentUser {
                            Text(user.role)
                                .font(.caption)
                                .padding(.horizontal, 8)
                                .padding(.vertical, 4)
                                .background(Color.blue.opacity(0.1))
                                .cornerRadius(8)
                        }
                        
                        // Logout button
                        Button(action: {
                            authManager.logout()
                            dismiss()
                        }) {
                            Image(systemName: "rectangle.portrait.and.arrow.right")
                                .foregroundColor(.red)
                                .font(.title2)
                        }
                    }
                }
            }
        }
        .onAppear {
            setupReactiveQuery()  // Setup Reactive API publisher
            // Load profile name from Capella
            profileName = databaseManager.getStoreProfile()?.name
            // Initialize P2P debug info
            debugInfo.multipeerSyncManager = p2pSyncManagerWrapper
            debugInfo.refreshData()
        }
        .onDisappear {
            // Cancel all subscriptions when view disappears
            cancellables.forEach { $0.cancel() }
            cancellables.removeAll()
        }
    }
    
    // MARK: - Reactive API Setup
    
    /// Setup Reactive Query Publisher (Combine Framework)
    /// This automatically updates UI when data changes - no manual refresh needed!
    private func setupReactiveQuery() {
        guard let query = databaseManager.createInventoryQuery() else {
            print("❌ Failed to create inventory query")
            loadLiquorItemsFallback()  // Fallback to old method
            return
        }
        
        print("🔄 [Reactive API] Setting up changePublisher for automatic updates...")
        
        // Subscribe to query changes using Reactive API
        query.changePublisher()
            .map { queryChange -> [LiquorItem] in
                // Manually extract results to ensure proper field mapping
                // This is more reliable than Codable decoding with CodingKeys
                do {
                    let results = try queryChange.results?.allResults() ?? []
                    var items: [LiquorItem] = []
                    
                    for result in results {
                        // Extract fields directly (same as Orders screen)
                        let id = result.string(forKey: "id")
                        let name = result.string(forKey: "name") ?? ""
                        let category = result.string(forKey: "category") ?? "Unknown"  // Actual field name
                        let price = result.double(forKey: "price")
                        let imageURL = result.string(forKey: "imageURL") ?? ""
                        let stockQty = result.int(forKey: "stockQty")  // Actual field name
                        
                        let productId = result.int(forKey: "productId")
                        let sku = result.string(forKey: "sku")
                        let brand = result.string(forKey: "brand")
                        let unit = result.string(forKey: "unit")
                        let storeId = result.string(forKey: "storeId")
                        let docType = result.string(forKey: "docType")
                        let expirationDate = result.int64(forKey: "expirationDate")
                        let lastUpdated = result.int64(forKey: "lastUpdated")
                        
                        // Parse nested location and attributes if needed
                        // For now, set to nil to keep it simple
                        
                        let item = LiquorItem(
                            id: id,
                            name: name,
                            type: category,  // Map category to type
                            price: price,
                            imageURL: imageURL,
                            quantity: stockQty,  // Map stockQty to quantity
                            productId: productId,
                            sku: sku,
                            brand: brand,
                            unit: unit,
                            location: nil,
                            attributes: nil,
                            expirationDate: expirationDate,
                            lastUpdated: lastUpdated,
                            storeId: storeId,
                            docType: docType
                        )
                        items.append(item)
                    }
                    
                    print("✅ [Reactive API] Query changed: \(items.count) items")
                    return items
                } catch {
                    print("❌ [Reactive API] Error processing results: \(error)")
                    return []
                }
            }
            .receive(on: DispatchQueue.main)  // Ensure UI updates on main thread
            .sink { items in
                // Note: Can't use [weak self] with struct - structs are value types
                liquorItems = items
                print("🔄 [Reactive API] UI updated with \(items.count) items")
            }
            .store(in: &cancellables)
        
        // CRITICAL: Execute query initially to establish change listener
        // The changePublisher needs an initial execution to start listening for changes
        do {
            _ = try query.execute()
            print("✅ [Reactive API] Initial query executed - change listener now active")
        } catch {
            print("❌ [Reactive API] Error executing initial query: \(error)")
        }
        
        print("✅ [Reactive API] Automatic updates enabled - listening for changes from sync!")
    }
    
    // MARK: - Fallback Methods
    
    /// Fallback method using old API (if Reactive API setup fails)
    private func loadLiquorItemsFallback() {
        DispatchQueue.main.async {
            self.liquorItems = self.databaseManager.getAllLiquorItems()
            print("⚠️ [Fallback] Using old API - loaded \(self.liquorItems.count) items")
        }
    }
    
    /// Manual refresh now just reloads from local DB (sync is continuous)
    private func refreshData() async {
        isRefreshing = true
        print("🔄 [Manual Refresh] Started...")
        
        // Reactive query will automatically update when data changes
        // This manual refresh just gives visual feedback to user
        try? await Task.sleep(nanoseconds: 500_000_000) // 0.5 seconds
        
        // Reload profile name
        profileName = databaseManager.getStoreProfile()?.name
        
        isRefreshing = false
        print("✅ [Manual Refresh] Completed - Reactive query handles data updates")
    }
}

// MARK: - Inventory P2P Debug View (Compact Version)

struct InventoryP2PDebugView: View {
    @ObservedObject var debugInfo: P2PDebugInfo
    
    var body: some View {
        VStack(spacing: 12) {
            // Header with current device info
            HStack {
                VStack(alignment: .leading, spacing: 4) {
                    Text("P2P Debug Info")
                        .font(.headline)
                        .foregroundColor(.blue)
                    
                    Text("Current Device: \(getCurrentDeviceName())")
                        .font(.caption)
                        .foregroundColor(.gray)
                }
                
                Spacer()
                
                // Status indicators
                HStack(spacing: 8) {
                    StatusBadge(
                        title: "Server",
                        isActive: debugInfo.isPassivePeerRunning,
                        port: debugInfo.listenerPort
                    )
                    
                    StatusBadge(
                        title: "Client",
                        isActive: debugInfo.isActivePeerRunning,
                        port: nil
                    )
                }
            }
            
            // Network permission status
            HStack {
                Image(systemName: debugInfo.hasNetworkPermission ? "checkmark.shield.fill" : "exclamationmark.shield.fill")
                    .foregroundColor(debugInfo.hasNetworkPermission ? .green : .orange)
                
                Text(debugInfo.networkPermissionDetails)
                    .font(.caption)
                    .foregroundColor(debugInfo.hasNetworkPermission ? .green : .orange)
                
                Spacer()
            }
            
            // Devices section
            if !debugInfo.discoveredDevices.isEmpty || !debugInfo.connectedDevices.isEmpty {
                VStack(spacing: 8) {
                    // Connected devices
                    if !debugInfo.connectedDevices.isEmpty {
                        ForEach(debugInfo.connectedDevices, id: \.deviceId) { device in
                            CompactDeviceRow(device: device, isConnected: true)
                        }
                    }
                    
                    // Discovered but not connected devices
                    ForEach(debugInfo.discoveredDevices.filter { device in
                        !debugInfo.connectedDevices.contains { $0.deviceId == device.deviceId }
                    }, id: \.deviceId) { device in
                        CompactDeviceRow(device: device, isConnected: false)
                    }
                }
            } else {
                HStack {
                    Image(systemName: "antenna.radiowaves.left.and.right.slash")
                        .foregroundColor(.gray)
                    Text("No devices discovered")
                        .font(.caption)
                        .foregroundColor(.gray)
                    Spacer()
                }
                .padding(.vertical, 8)
            }
            
            // Auth credentials
            HStack {
                Text("Auth: \(debugInfo.username) • \(String(repeating: "•", count: debugInfo.password.count))")
                    .font(.caption2)
                    .foregroundColor(.gray)
                    .font(.monospaced(.caption2)())
                
                Spacer()
                
                Text(debugInfo.serviceType)
                    .font(.caption2)
                    .foregroundColor(.gray)
                    .font(.monospaced(.caption2)())
            }
        }
        .padding()
        .background(Color.blue.opacity(0.05))
        .cornerRadius(12)
        .overlay(
            RoundedRectangle(cornerRadius: 12)
                .stroke(Color.blue.opacity(0.2), lineWidth: 1)
        )
        .padding(.horizontal, 16)
        .animation(.easeInOut(duration: 0.3), value: debugInfo.connectedDevices.count)
        .animation(.easeInOut(duration: 0.3), value: debugInfo.discoveredDevices.count)
    }
    
    private func getCurrentDeviceName() -> String {
        #if targetEnvironment(macCatalyst)
        return "\(ProcessInfo.processInfo.hostName) (Mac)"
        #else
        return "\(UIDevice.current.name) (iOS)"
        #endif
    }
}

struct StatusBadge: View {
    let title: String
    let isActive: Bool
    let port: Int?
    
    var body: some View {
        VStack(spacing: 2) {
            Text(title)
                .font(.caption2)
                .fontWeight(.semibold)
                .foregroundColor(isActive ? .green : .gray)
            
            if let port = port {
                Text(":\(port)")
                    .font(.caption2)
                    .foregroundColor(isActive ? .green : .gray)
                    .font(.monospaced(.caption2)())
            } else {
                Text(isActive ? "ON" : "OFF")
                    .font(.caption2)
                    .foregroundColor(isActive ? .green : .gray)
            }
        }
        .padding(.horizontal, 8)
        .padding(.vertical, 4)
        .background(isActive ? Color.green.opacity(0.1) : Color.gray.opacity(0.1))
        .cornerRadius(6)
    }
}

struct CompactDeviceRow: View {
    let device: DebugDevice
    let isConnected: Bool
    
    var body: some View {
        HStack(spacing: 8) {
            // Status indicator
            Circle()
                .fill(isConnected ? Color.green : device.connectionStatus.color)
                .frame(width: 8, height: 8)
            
            // Device info
            VStack(alignment: .leading, spacing: 2) {
                HStack {
                    Text(device.name)
                        .font(.caption)
                        .fontWeight(.semibold)
                        .foregroundColor(.primary)
                    
                    Text(device.connectionStatus.rawValue)
                        .font(.caption2)
                        .foregroundColor(device.connectionStatus.color)
                }
                
                if let endpoint = device.endpoint {
                    Text(endpoint)
                        .font(.caption2)
                        .foregroundColor(.gray)
                        .font(.monospaced(.caption2)())
                }
                
                if let error = device.errorMessage {
                    Text("Error: \(error)")
                        .font(.caption2)
                        .foregroundColor(.red)
                        .lineLimit(1)
                }
            }
            
            Spacer()
            
            // Time indicator
            if let lastSeen = device.lastSeen {
                Text(timeAgo(from: lastSeen))
                    .font(.caption2)
                    .foregroundColor(.gray)
            }
        }
        .padding(.horizontal, 8)
        .padding(.vertical, 6)
        .background(isConnected ? Color.green.opacity(0.05) : Color.gray.opacity(0.05))
        .cornerRadius(8)
    }
    
    private func timeAgo(from date: Date) -> String {
        let interval = Date().timeIntervalSince(date)
        if interval < 60 {
            return "now"
        } else if interval < 3600 {
            return "\(Int(interval/60))m"
        } else {
            return "\(Int(interval/3600))h"
        }
    }
}

// MARK: - App Services Sync Indicator Component
struct AppServicesSyncIndicator: View {
    @EnvironmentObject var databaseManager: DatabaseManager
    @State private var showSyncControls = false
    
    var body: some View {
        Button(action: {
            showSyncControls.toggle()
        }) {
            HStack(spacing: 4) {
                Image(systemName: databaseManager.isAppServicesEnabled ? "cloud.fill" : "cloud")
                    .foregroundColor(databaseManager.isAppServicesEnabled ? .green : .gray)
                    .opacity(0.8)
                
                VStack(alignment: .trailing, spacing: 2) {
                    Text("☁️")
                        .font(.caption2)
                        .foregroundColor(databaseManager.isAppServicesEnabled ? .green : .gray)
                        .fontWeight(.semibold)
                    
                    Text(databaseManager.isAppServicesEnabled ? "ON" : "OFF")
                        .font(.caption2)
                        .foregroundColor(databaseManager.isAppServicesEnabled ? .green : .gray)
                        .opacity(0.7)
                }
            }
        }
        .buttonStyle(PlainButtonStyle())
        .help("Tap to control App Services cloud sync")
        .popover(isPresented: $showSyncControls) {
            AppServicesSyncControlPanel()
                .frame(width: 280, height: 200)
        }
    }
}

// MARK: - App Services Sync Control Panel
struct AppServicesSyncControlPanel: View {
    @EnvironmentObject var databaseManager: DatabaseManager
    
    var syncState: AppServicesSyncState? {
        databaseManager.getAppServicesSyncState()
    }
    
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            // Header
            HStack {
                Image(systemName: "cloud.fill")
                    .foregroundColor(.blue)
                Text("App Services Sync")
                    .font(.headline)
                    .fontWeight(.semibold)
                
                Spacer()
                
                Button(action: {
                    databaseManager.toggleAppServices()
                }) {
                    Text(databaseManager.isAppServicesEnabled ? "Disable" : "Enable")
                        .font(.caption)
                        .padding(.horizontal, 12)
                        .padding(.vertical, 4)
                        .background(databaseManager.isAppServicesEnabled ? Color.red.opacity(0.2) : Color.green.opacity(0.2))
                        .foregroundColor(databaseManager.isAppServicesEnabled ? .red : .green)
                        .cornerRadius(8)
                }
            }
            
            // Sync Status
            if let syncState = syncState {
                HStack {
                    Circle()
                        .fill(syncState.isConnected ? Color.green : Color.red)
                        .frame(width: 8, height: 8)
                    
                    Text(syncState.status)
                        .font(.body)
                        .foregroundColor(.primary)
                    
                    Spacer()
                }
                
                // Progress bar (if syncing)
                if syncState.progress > 0 && syncState.progress < 1 {
                    VStack(alignment: .leading, spacing: 4) {
                        HStack {
                            Text("Syncing...")
                                .font(.caption)
                                .foregroundColor(.secondary)
                            
                            Spacer()
                            
                            Text("\(Int(syncState.progress * 100))%")
                                .font(.caption)
                                .foregroundColor(.secondary)
                        }
                        
                        ProgressView(value: syncState.progress)
                            .progressViewStyle(LinearProgressViewStyle())
                            .scaleEffect(y: 0.5)
                    }
                }
                
                // Last sync time
                if let lastSync = syncState.lastSyncTime {
                    Text("Last sync: \(lastSync, formatter: timeFormatter)")
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
                
                // Error display
                if let error = syncState.error {
                    Text("Error: \(error)")
                        .font(.caption)
                        .foregroundColor(.red)
                        .lineLimit(2)
                }
            } else {
                Text("App Services not initialized")
                    .font(.body)
                    .foregroundColor(.secondary)
            }
            
            // Control buttons
            HStack {
                if databaseManager.isAppServicesEnabled {
                    Button("Reset Sync") {
                        databaseManager.resetAppServicesSync()
                    }
                    .font(.caption)
                    .padding(.horizontal, 8)
                    .padding(.vertical, 4)
                    .background(Color.orange.opacity(0.2))
                    .foregroundColor(.orange)
                    .cornerRadius(6)
                }
                
                Spacer()
                
                Button("Test Connection") {
                    // Test connection functionality
                    if !databaseManager.isAppServicesEnabled {
                        databaseManager.enableAppServices()
                    }
                }
                .font(.caption)
                .padding(.horizontal, 8)
                .padding(.vertical, 4)
                .background(Color.blue.opacity(0.2))
                .foregroundColor(.blue)
                .cornerRadius(6)
            }
        }
        .padding()
    }
    
    private var timeFormatter: DateFormatter {
        let formatter = DateFormatter()
        formatter.timeStyle = .short
        return formatter
    }
}

#Preview {
    InventoryView()
} 