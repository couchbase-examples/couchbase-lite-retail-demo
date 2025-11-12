import SwiftUI

struct LiquorItemCard: View {
    let item: LiquorItem
    let onQuantityChanged: (Int) -> Void
    let onReorder: (LiquorItem, Int) -> Void
    let storeId: String
    @State private var currentQuantity: Int
    @State private var showOrderPlaced = false
    @State private var showOrderForm = false
    
    init(item: LiquorItem, storeId: String = "", onQuantityChanged: @escaping (Int) -> Void, onReorder: @escaping (LiquorItem, Int) -> Void = { _, _ in }) {
        self.item = item
        self.storeId = storeId
        self.onQuantityChanged = onQuantityChanged
        self.onReorder = onReorder
        self._currentQuantity = State(initialValue: item.quantity)
    }
    
    private func formatName(_ name: String) -> String {
        // Check if name is longer than 25 characters
        if name.count > 25 {
            let words = name.split(separator: " ")
            if words.count > 1 {
                // Create initials from first letters of each word, except the last word
                let initials = words.dropLast().map { String($0.prefix(1)).uppercased() }.joined(separator: ".")
                let lastName = String(words.last!)
                
                // If still too long, truncate further
                let formatted = "\(initials). \(lastName)"
                if formatted.count > 25 {
                    return "\(initials)..."
                }
                return formatted
            } else {
                // Single word that's too long
                return String(name.prefix(22)) + "..."
            }
        }
        return name
    }
    
    var body: some View {
        ZStack {
        VStack(alignment: .leading, spacing: 0) {
            // Product image - larger size
            CachedAsyncImage(
                url: item.imageURL,
                placeholder: Image(systemName: "cart.fill")
            )
            .aspectRatio(1, contentMode: .fit)
            .frame(maxWidth: .infinity)
            .frame(height: 160)
            .background(Color(UIColor.secondarySystemBackground))
            .cornerRadius(8)
            .padding(.top, 2)
            
            VStack(alignment: .leading, spacing: 8) {
                // Product name - bold and left aligned
                Text(item.name)
                    .padding(.top, 8)
                    .font(.system(size: 16, weight: .bold))
                    .lineLimit(2)
                    .multilineTextAlignment(.leading)
                    .foregroundColor(.primary)
                    .frame(maxWidth: .infinity, alignment: .leading)
                
                // Price only
                Text("Price: $\(item.price, specifier: "%.2f")")
                    .font(.system(size: 12))
                    .foregroundColor(.secondary)
                
                // Inventory Count Section
                VStack(spacing: 8) {
                    Text("Inventory Count")
                        .font(.system(size: 13, weight: .medium))
                        .foregroundColor(.primary)
                        .frame(maxWidth: .infinity, alignment: .center)
                    
                    // Large quantity number with color coding
                    Text("\(currentQuantity)")
                        .font(.system(size: 48, weight: .bold))
                        .foregroundColor(quantityColor)
                        .frame(maxWidth: .infinity, alignment: .center)
                    
                    // Quantity controls - circular buttons
                    HStack(spacing: 16) {
                        Button(action: {
                            if currentQuantity > 0 {
                                currentQuantity -= 1
                                onQuantityChanged(currentQuantity)
                            }
                        }) {
                            Image(systemName: "minus.circle")
                                .font(.system(size: 32))
                                .foregroundColor(currentQuantity > 0 ? Color(UIColor.systemGray) : Color(UIColor.systemGray).opacity(0.3))
                        }
                        .disabled(currentQuantity == 0)
                        
                        Button(action: {
                            currentQuantity += 1
                            onQuantityChanged(currentQuantity)
                        }) {
                            Image(systemName: "plus.circle")
                                .font(.system(size: 32))
                                .foregroundColor(Color(UIColor.systemGray))
                        }
                    }
                    .frame(maxWidth: .infinity, alignment: .center)
                }
                
                // Re-order button
                Button(action: {
                    print("Opening order form for \(item.name)")
                    showOrderForm = true
                }) {
                    Text("Re-order now")
                        .font(.system(size: 14, weight: .semibold))
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 12)
                        .background(Color(hex: "FC9C0C"))
                        .cornerRadius(8)
                }
            }
            .padding(.horizontal, 12)
            .padding(.bottom, 12)
        }
        .frame(height: 440)
        .frame(maxWidth: .infinity)
        .background(Color(UIColor.systemBackground))
        .cornerRadius(12)
        .shadow(color: Color(UIColor.label).opacity(0.1), radius: 8, x: 0, y: 4)
        .onAppear {
            currentQuantity = item.quantity
        }
        .onChange(of: item.quantity) { oldValue, newValue in
            // Update local state when quantity changes from sync
            // This allows smooth updates without recreating the entire card
            if currentQuantity != newValue {
                currentQuantity = newValue
            }
        }
        
        // Order Placed Overlay
        if showOrderPlaced {
            Color(red: 0.30, green: 0.69, blue: 0.31)
                .opacity(0.95)
                .frame(height: 440)
                .frame(maxWidth: .infinity)
                .cornerRadius(12)
                .overlay(
                    VStack(spacing: 16) {
                        // Package icon
                        Text("📦")
                            .font(.system(size: 64))
                        
                        Text("Order Placed!")
                            .font(.system(size: 28, weight: .bold))
                            .foregroundColor(.white)
                        
                        Text("Replenishment order has been made")
                            .font(.system(size: 16))
                            .foregroundColor(.white.opacity(0.9))
                            .multilineTextAlignment(.center)
                            .padding(.horizontal)
                    }
                )
                .transition(.opacity)
        }
        }
        .sheet(isPresented: $showOrderForm) {
            OrderFormView(
                item: item,
                storeId: storeId,
                onCreateOrder: { quantity in
                    onReorder(item, quantity)
                    withAnimation(.easeInOut(duration: 0.3)) {
                        showOrderPlaced = true
                    }
                    // Auto-hide after 2 seconds
                    DispatchQueue.main.asyncAfter(deadline: .now() + 2.0) {
                        withAnimation(.easeInOut(duration: 0.3)) {
                            showOrderPlaced = false
                        }
                    }
                }
            )
        }
    }
    
    // Color coding for quantity
    private var quantityColor: Color {
        if currentQuantity > 30 {
            return Color(red: 0.18, green: 0.73, blue: 0.43) // Green
        } else if currentQuantity > 10 {
            return Color(red: 0.95, green: 0.76, blue: 0.06) // Yellow/Orange
        } else {
            return Color(red: 0.95, green: 0.34, blue: 0.31) // Red
        }
    }
}

#Preview {
    HStack {
        LiquorItemCard(
            item: LiquorItem(
                name: "Johnnie Walker Black Label",
                type: "Whiskey",
                price: 45.99,
                imageURL: "whiskey1",
                quantity: 5
            ),
            onQuantityChanged: { _ in }
        )
        
        LiquorItemCard(
            item: LiquorItem(
                name: "Very Long Liquor Name That Should Be Truncated",
                type: "Vodka",
                price: 99.99,
                imageURL: "vodka1",
                quantity: 2
            ),
            onQuantityChanged: { _ in }
        )
    }
    .padding()
} 