import SwiftUI
import CouchbaseLiteSwift
import Combine

struct InventoryView: View {
    @EnvironmentObject var databaseManager: DatabaseManager
    @EnvironmentObject var p2pSyncManager: GroceryMultipeerSyncManager
    @EnvironmentObject var authManager: AuthenticationManager
    @State private var searchText = ""
    @State private var liquorItems: [LiquorItem] = []
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
                // Search bar
                HStack {
                    Image(systemName: "magnifyingglass")
                        .foregroundColor(.gray)
                    
                    TextField("Search liquor...", text: $searchText)
                }
                .textFieldStyle(RoundedBorderTextFieldStyle())
                .padding(.horizontal, 16)
                .padding(.vertical, 12)
                
                // Inventory grid with pull-to-refresh
                ScrollView {
                    LazyVGrid(columns: columns, spacing: 16) {
                        ForEach(filteredItems, id: \.self) { item in
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
                            // Equatable compares id + quantity, so SwiftUI detects changes without forcing recreation
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
                    // User role badge
                    if let user = authManager.currentUser {
                        Text(user.role)
                            .font(.caption)
                            .padding(.horizontal, 8)
                            .padding(.vertical, 4)
                            .background(Color.blue.opacity(0.1))
                            .cornerRadius(8)
                    }
                }
            }
        }
        .onAppear {
            setupReactiveQuery()  // Setup Reactive API publisher
            // Load profile name from Capella
            profileName = databaseManager.getStoreProfile()?.name
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
        
        print("🔄 [Reactive API] Setting up changePublisher with automatic Codable decoding...")
        
        // ✨ REACTIVE API: Manual field extraction (automatic Codable doesn't work with nested objects)
        // Extract fields manually because Couchbase returns nested objects as DictionaryObject
        query.changePublisher()
            .map { queryChange -> [LiquorItem] in
                guard let results = queryChange.results else {
                    print("⚠️ [Reactive API] No results in query change")
                    return []
                }
                
                var items: [LiquorItem] = []
                
                do {
                    for result in results.allResults() {
                        // Extract basic fields
                        guard let id = result.string(at: 0),
                              let name = result.string(forKey: "name"),
                              let category = result.string(forKey: "category"),
                              let price = result.number(forKey: "price")?.doubleValue,
                              let imageURL = result.string(forKey: "imageURL"),
                              let stockQty = result.number(forKey: "stockQty")?.intValue else {
                            continue
                        }
                        
                        // Extract optional fields
                        let productId = result.number(forKey: "productId")?.intValue
                        let sku = result.string(forKey: "sku")
                        let brand = result.string(forKey: "brand")
                        let unit = result.string(forKey: "unit")
                        let storeId = result.string(forKey: "storeId")
                        let docType = result.string(forKey: "docType")
                        let expirationDate = result.number(forKey: "expirationDate")?.int64Value
                        let lastUpdated = result.number(forKey: "lastUpdated")?.int64Value
                        
                        // Extract nested location
                        var location: LiquorItem.Location?
                        if let locationDict = result.dictionary(forKey: "location") {
                            let aisle = locationDict.int(forKey: "aisle")
                            let bin = locationDict.int(forKey: "bin")
                            location = LiquorItem.Location(aisle: aisle, bin: bin)
                        }
                        
                        // Extract nested attributes
                        var attributes: LiquorItem.Attributes?
                        if let attrDict = result.dictionary(forKey: "attributes") {
                            let organic = attrDict.boolean(forKey: "organic")
                            let size = attrDict.string(forKey: "size") ?? ""
                            let perishable = attrDict.boolean(forKey: "perishable")
                            attributes = LiquorItem.Attributes(organic: organic, size: size, perishable: perishable)
                        }
                        
                        // Create LiquorItem
                        let item = LiquorItem(
                            id: id,
                            name: name,
                            type: category,  // Map category → type
                            price: price,
                            imageURL: imageURL,
                            quantity: stockQty,  // Map stockQty → quantity
                            productId: productId,
                            sku: sku,
                            brand: brand,
                            unit: unit,
                            location: location,
                            attributes: attributes,
                            expirationDate: expirationDate,
                            lastUpdated: lastUpdated,
                            storeId: storeId,
                            docType: docType
                        )
                        
                        items.append(item)
                    }
                    
                    print("✅ [Reactive API] Query changed: \(items.count) items (manual extraction)")
                    return items
                } catch {
                    print("❌ [Reactive API] Error extracting results: \(error)")
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
            print("✅ [Reactive API] Initial query executed with .data() auto-decoding - change listener active")
        } catch {
            print("❌ [Reactive API] Error executing initial query: \(error)")
        }
        
        print("✅ [Reactive API] Automatic Codable decoding enabled - listening for changes!")
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
