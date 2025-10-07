import SwiftUI

struct LiquorItemCard: View {
    let item: LiquorItem
    let onQuantityChanged: (Int) -> Void
    @State private var currentQuantity: Int
    
    init(item: LiquorItem, onQuantityChanged: @escaping (Int) -> Void) {
        self.item = item
        self.onQuantityChanged = onQuantityChanged
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
        VStack(alignment: .leading, spacing: 8) {
            // Liquor image - fixed size
            AsyncImage(url: URL(string: item.imageURL)) { image in
                image
                    .resizable()
                    .aspectRatio(contentMode: .fit)
            } placeholder: {
                Image(systemName: "wineglass.fill")
                    .font(.system(size: 50))
                    .foregroundColor(.purple.opacity(0.6))
            }
            .frame(width: 80, height: 80)
            .frame(maxWidth: .infinity)
            
            VStack(alignment: .leading, spacing: 6) {
                // Name - with consistent height and truncation
                Text(formatName(item.name))
                    .font(.system(size: 14, weight: .semibold))
                    .lineLimit(2)
                    .frame(height: 34, alignment: .top)
                    .foregroundColor(.primary)
                
                // Type - fixed size
                Text(item.type)
                    .font(.system(size: 11))
                    .foregroundColor(.secondary)
                    .padding(.horizontal, 6)
                    .padding(.vertical, 2)
                    .background(Color.blue.opacity(0.1))
                    .cornerRadius(6)
                    .frame(height: 20)
                
                // Price - fixed size
                Text("$\(item.price, specifier: "%.2f")")
                    .font(.system(size: 16, weight: .bold))
                    .foregroundColor(.green)
                    .frame(height: 20)
            }
            .frame(maxWidth: .infinity, alignment: .leading)
            
            Spacer(minLength: 4)
            
            // Quantity controls - fixed size
            HStack {
                Text("Qty:")
                    .font(.system(size: 10))
                    .foregroundColor(.secondary)
                
                Spacer()
                
                HStack(spacing: 8) {
                    Button(action: {
                        if currentQuantity > 0 {
                            currentQuantity -= 1
                            onQuantityChanged(currentQuantity)
                        }
                    }) {
                        Image(systemName: "minus.circle.fill")
                            .font(.system(size: 16))
                            .foregroundColor(currentQuantity > 0 ? .red : .gray)
                    }
                    .disabled(currentQuantity == 0)
                    .frame(width: 24, height: 24)
                    
                    Text("\(currentQuantity)")
                        .font(.system(size: 14, weight: .semibold))
                        .frame(minWidth: 20)
                    
                    Button(action: {
                        currentQuantity += 1
                        onQuantityChanged(currentQuantity)
                    }) {
                        Image(systemName: "plus.circle.fill")
                            .font(.system(size: 16))
                            .foregroundColor(.green)
                    }
                    .frame(width: 24, height: 24)
                }
            }
            .frame(height: 24)
        }
        .padding(12)
        .frame(width: 160, height: 220) // Fixed dimensions for consistency
        .background(Color.white)
        .cornerRadius(15)
        .shadow(color: .gray.opacity(0.3), radius: 5, x: 0, y: 2)
        .onAppear {
            currentQuantity = item.quantity
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