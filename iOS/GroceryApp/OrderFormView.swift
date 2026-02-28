import SwiftUI

struct OrderFormView: View {
    let item: GroceryItem
    let storeId: String
    let onCreateOrder: (Int) -> Void
    @Environment(\.dismiss) var dismiss
    
    @State private var orderQuantity: String = "100"
    @State private var isCreating = false
    
    var body: some View {
        NavigationView {
            Form {
                Section(header: Text("Product Information")) {
                    LabeledContent("Product Name", value: item.name)
                    LabeledContent("Product ID", value: String(item.productId ?? 0))
                    LabeledContent("SKU", value: item.sku ?? "N/A")
                    LabeledContent("Store ID", value: storeId)
                    LabeledContent("Unit", value: item.unit ?? "N/A")
                    LabeledContent("Order Status", value: "Submitted")
                }
                
                Section(header: Text("Order Details")) {
                    HStack {
                        Text("Order Quantity")
                        Spacer()
                        TextField("Quantity", text: $orderQuantity)
                            .keyboardType(.numberPad)
                            .multilineTextAlignment(.trailing)
                            .frame(width: 100)
                            .textFieldStyle(RoundedBorderTextFieldStyle())
                    }
                }
                
                Section {
                    Button(action: {
                        if let qty = Int(orderQuantity), qty > 0 {
                            isCreating = true
                            onCreateOrder(qty)
                            dismiss()
                        }
                    }) {
                        HStack {
                            Spacer()
                            if isCreating {
                                ProgressView()
                                    .padding(.trailing, 8)
                            }
                            Text(isCreating ? "Creating Order..." : "Create Order")
                                .fontWeight(.semibold)
                            Spacer()
                        }
                    }
                    .disabled(isCreating || Int(orderQuantity) == nil || Int(orderQuantity)! <= 0)
                }
            }
            .navigationTitle("Create Order")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Cancel") {
                        dismiss()
                    }
                }
            }
        }
    }
}

