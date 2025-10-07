import SwiftUI

struct LandingView: View {
    @State private var showInventory = false
    @State private var showMerchandising = false
    
    var body: some View {
        NavigationView {
            ZStack {
                // Background gradient
                LinearGradient(
                    gradient: Gradient(colors: [Color.purple.opacity(0.8), Color.blue.opacity(0.6)]),
                    startPoint: .topLeading,
                    endPoint: .bottomTrailing
                )
                .ignoresSafeArea()
                
                VStack(spacing: 40) {
                    // Logo and title
                    VStack(spacing: 20) {
                        Image(systemName: "wineglass.fill")
                            .font(.system(size: 80))
                            .foregroundColor(.white)
                        
                        Text("Liquor Inventory")
                            .font(.largeTitle)
                            .fontWeight(.bold)
                            .foregroundColor(.white)
                        
                        Text("Manage your liquor collection with ease")
                            .font(.title3)
                            .foregroundColor(.white.opacity(0.9))
                            .multilineTextAlignment(.center)
                            .padding(.horizontal)
                    }
                    
                    // Action buttons
                    VStack(spacing: 20) {
                        // Enter inventory button
                        Button(action: {
                            showInventory = true
                        }) {
                            HStack {
                                Image(systemName: "list.bullet.rectangle")
                                Text("Enter Inventory")
                            }
                            .font(.title2)
                            .fontWeight(.semibold)
                            .foregroundColor(.purple)
                            .padding(.horizontal, 30)
                            .padding(.vertical, 15)
                            .background(Color.white)
                            .cornerRadius(15)
                            .shadow(radius: 10)
                        }
                        .scaleEffect(showInventory ? 0.95 : 1.0)
                        .animation(.easeInOut(duration: 0.1), value: showInventory)
                        
                        // Merchandising button
                        Button(action: {
                            showMerchandising = true
                        }) {
                            HStack {
                                Image(systemName: "camera.viewfinder")
                                Text("Merchandising Scanner")
                            }
                            .font(.title2)
                            .fontWeight(.semibold)
                            .foregroundColor(.blue)
                            .padding(.horizontal, 30)
                            .padding(.vertical, 15)
                            .background(Color.white)
                            .cornerRadius(15)
                            .shadow(radius: 10)
                        }
                        .scaleEffect(showMerchandising ? 0.95 : 1.0)
                        .animation(.easeInOut(duration: 0.1), value: showMerchandising)
                    }
                    
                    Spacer()
                }
                .padding()
            }
        }
        .fullScreenCover(isPresented: $showInventory) {
            InventoryView()
        }
        .fullScreenCover(isPresented: $showMerchandising) {
            SimpleMerchandisingView()
        }
    }
}

#Preview {
    LandingView()
} 