import SwiftUI

struct OrdersView: View {
    @EnvironmentObject var databaseManager: DatabaseManager
    @State private var orders: [Order] = []
    @State private var isLoading = true
    @Environment(\.dismiss) private var dismiss
    
    var body: some View {
        NavigationView {
            Group {
                if isLoading {
                    ProgressView("Loading orders...")
                } else if orders.isEmpty {
                    VStack(spacing: 16) {
                        Text("📦")
                            .font(.system(size: 64))
                        
                        Text("No orders yet")
                            .font(.title2)
                            .foregroundColor(.secondary)
                        
                        Text("Orders will appear here when you tap 'Re-order now' on products")
                            .font(.body)
                            .foregroundColor(.secondary)
                            .multilineTextAlignment(.center)
                            .padding(.horizontal, 32)
                    }
                } else {
                    List(orders) { order in
                        OrderRow(order: order)
                    }
                }
            }
            .navigationTitle("Orders")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button(action: loadOrders) {
                        Image(systemName: "arrow.clockwise")
                    }
                }
                
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Done") {
                        dismiss()
                    }
                }
            }
        }
        .onAppear {
            loadOrders()
        }
    }
    
    private func loadOrders() {
        isLoading = true
        orders = databaseManager.getAllOrders()
        isLoading = false
    }
}

struct OrderRow: View {
    let order: Order
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            // Header Row
            HStack {
                Text("Order #\(order.orderId)")
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
    
    private var statusColor: Color {
        switch order.orderStatus {
        case "Received":
            return Color.green
        case "Submitted":
            return Color.orange
        default:
            return Color.gray
        }
    }
}

