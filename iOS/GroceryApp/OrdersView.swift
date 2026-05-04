import SwiftUI
import Combine

struct OrdersView: View {
    @EnvironmentObject var databaseManager: DatabaseManager
    @State private var orders: [Order] = []
    @State private var isLoading = true
    @State private var cancellables = Set<AnyCancellable>()
    @State private var selectedFilter = "All"  // "All", "In Review", "Approved"
    @Binding var selectedTab: Int
    
    // Filter orders based on selected filter
    var filteredOrders: [Order] {
        switch selectedFilter {
        case "In Review":
            return orders.filter { $0.orderStatus == "In Review" }
        case "Approved":
            return orders.filter { $0.orderStatus == "Approved" }
        default:
            return orders
        }
    }
    
    var body: some View {
        NavigationView {
            VStack(spacing: 0) {
                // Filter Tabs
                if !isLoading {
                    Picker("Filter", selection: $selectedFilter) {
                        Text("All").tag("All")
                        Text("In Review").tag("In Review")
                        Text("Approved").tag("Approved")
                    }
                    .pickerStyle(.segmented)
                    .padding(.horizontal, 16)
                    .padding(.vertical, 8)
                    .background(Color(UIColor.systemBackground))
                }
                
                // Content
                Group {
                    if isLoading {
                        ProgressView("Loading orders...")
                    } else if filteredOrders.isEmpty {
                        VStack(spacing: 16) {
                            Text("📦")
                                .font(.system(size: 64))
                            
                            Text(selectedFilter == "All" ? "No orders yet" : "No \(selectedFilter.lowercased()) orders")
                                .font(.title2)
                                .foregroundColor(.secondary)
                            
                            Text(selectedFilter == "All" ? 
                                "Orders will appear here when you tap 'Re-order now' on products" :
                                "No orders with '\(selectedFilter)' status found")
                                .font(.body)
                                .foregroundColor(.secondary)
                                .multilineTextAlignment(.center)
                                .padding(.horizontal, 32)
                        }
                        .frame(maxWidth: .infinity, maxHeight: .infinity)
                    } else {
                        List(filteredOrders) { order in
                            OrderRow(order: order)
                        }
                    }
                }
            }
            .navigationTitle("Orders")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button(action: {
                        // Reactive query handles updates automatically
                        print("ℹ️ Refresh requested - Reactive query handles updates automatically")
                    }) {
                        Image(systemName: "arrow.clockwise")
                    }
                }
                
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Done") {
                        selectedTab = 0
                    }
                }
            }
        }
        .onAppear {
            setupReactiveQuery()
        }
        .onDisappear {
            cancellables.removeAll()
        }
    }
    
    private func setupReactiveQuery() {
        guard let query = databaseManager.createOrdersQuery() else {
            print("❌ Failed to create orders query")
            isLoading = false
            return
        }
        
        print("🔄 [Reactive API - Orders] Setting up changePublisher with automatic Codable decoding...")
        
        // ✨ REACTIVE API: Use .data(as: Order.self) for automatic Codable decoding
        // Eliminates manual field extraction for cleaner, more maintainable code
        query.changePublisher()
            .map { queryChange -> [Order] in
                do {
                    // Automatic Codable decoding - no manual field extraction needed!
                    let ordersList = try queryChange.results?.data(as: Order.self) ?? []
                    print("✅ [Reactive API - Orders] Query changed: \(ordersList.count) orders (auto-decoded via Codable)")
                    return ordersList
                } catch {
                    print("❌ [Reactive API - Orders] Error decoding results: \(error)")
                    print("   Falling back to empty array")
                    return []
                }
            }
            .receive(on: DispatchQueue.main)
            .sink { ordersList in
                orders = ordersList
                isLoading = false
                print("🔄 [Reactive API - Orders] UI updated with \(ordersList.count) orders")
            }
            .store(in: &cancellables)
        
        // Execute query initially to establish change listener
        do {
            _ = try query.execute()
            print("✅ [Reactive API - Orders] Initial query executed with .data() auto-decoding - change listener active")
        } catch {
            print("❌ [Reactive API - Orders] Error executing initial query: \(error)")
        }
        
        print("✅ [Reactive API - Orders] Automatic Codable decoding enabled - listening for changes!")
    }
}

struct OrderRow: View {
    let order: Order
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            // Header Row
            HStack {
                // `orderId` can be a long UUID-style string in imported data;
                // show a trimmed suffix so the header stays readable.
                Text("Order #\(OrderRow.shortOrderId(order.orderId))")
                    .font(.headline)
                    .fontWeight(.bold)
                
                Spacer()
                
                // Status Badge
                Text(order.orderStatus)
                    .font(.subheadline)
                    .fontWeight(.semibold)
                    .padding(.horizontal, 12)
                    .padding(.vertical, 6)
                    .background(statusColor.opacity(0.2))
                    .foregroundColor(statusColor)
                    .cornerRadius(8)
            }
            
            Divider()
            
            // Order Details
            HStack {
                VStack(alignment: .leading, spacing: 4) {
                    Text("SKU")
                        .font(.caption)
                        .foregroundColor(.secondary)
                    Text(order.sku)
                        .font(.body)
                        .fontWeight(.medium)
                }
                
                Spacer()
                
                VStack(alignment: .trailing, spacing: 4) {
                    Text("Quantity")
                        .font(.caption)
                        .foregroundColor(.secondary)
                    Text("\(order.orderQty) \(order.unit)")
                        .font(.body)
                        .fontWeight(.medium)
                }
            }
            
            // Product ID
            HStack {
                Text("Product ID:")
                    .font(.caption)
                    .foregroundColor(.secondary)
                Text("\(order.productId)")
                    .font(.caption)
            }
            
            Divider()
            
            // Date
            HStack {
                Text(order.orderDateFormatted)
                    .font(.caption)
                    .foregroundColor(.secondary)
                
                Spacer()
                
                Text(order.id)
                    .font(.caption2)
                    .foregroundColor(.secondary)
            }
        }
        .padding(.vertical, 8)
    }
    
    /// Trim long UUID-style `orderId`s to the last 6 chars so the list
    /// header stays compact. Short numeric IDs are shown as-is.
    static func shortOrderId(_ raw: String) -> String {
        guard raw.count > 10 else { return raw }
        let tail = raw.suffix(6)
        return "…\(tail)"
    }

    private var statusColor: Color {
        switch order.orderStatus {
        case "Approved":
            return Color.green
        case "In Review":
            return Color.blue
        case "Submitted":
            return Color(red: 1.0, green: 0.58, blue: 0.0)  // Darker orange for better readability
        default:
            return Color.gray
        }
    }
}

