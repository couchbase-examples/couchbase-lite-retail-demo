//
//  ContentView.swift
//  GroceryApp
//
//  Created by Pulkit Midha on 23/07/25.
//

import SwiftUI

struct ContentView: View {
    var body: some View {
        TabView {
            // Inventory Tab
            InventoryView()
                .tabItem {
                    Image(systemName: "list.clipboard")
                    Text("Inventory")
                }
            
            // Merchandising Tab
            SimpleMerchandisingView()
                .tabItem {
                    Image(systemName: "camera.viewfinder")
                    Text("Scanner")
                }
        }
        .accentColor(.blue)
    }
}

#Preview {
    ContentView()
}
