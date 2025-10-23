import SwiftUI

struct StoreProfileView: View {
    @EnvironmentObject var databaseManager: DatabaseManager
    @State private var profile: StoreProfile?
    @State private var isLoading = true
    @Environment(\.dismiss) private var dismiss
    
    var body: some View {
        NavigationView {
            Group {
                if isLoading {
                    ProgressView("Loading...")
                } else if let profile = profile {
                    List {
                        // Store Name Header
                        Section {
                            VStack(alignment: .leading, spacing: 8) {
                                Text(profile.name)
                                    .font(.title)
                                    .fontWeight(.bold)
                                
                                Text("Store ID: \(profile.storeId)")
                                    .font(.subheadline)
                                    .foregroundColor(.secondary)
                            }
                            .padding(.vertical, 8)
                        }
                        
                        // Contact Information
                        Section(header: Text("Contact Information")) {
                            HStack {
                                Text("Email")
                                    .fontWeight(.medium)
                                Spacer()
                                Text(profile.contact.email)
                                    .foregroundColor(.secondary)
                            }
                            
                            HStack {
                                Text("Phone")
                                    .fontWeight(.medium)
                                Spacer()
                                Text(profile.contact.phone)
                                    .foregroundColor(.secondary)
                            }
                        }
                        
                        // Location
                        Section(header: Text("Location")) {
                            VStack(alignment: .leading, spacing: 4) {
                                Text(profile.location.address1)
                                if let address2 = profile.location.address2 {
                                    Text(address2)
                                }
                                Text("\(profile.location.locality), \(profile.location.region) \(profile.location.postalCode)")
                                Text(profile.location.country)
                                
                                if let coords = profile.location.coordinates {
                                    Divider()
                                        .padding(.vertical, 4)
                                    HStack {
                                        Image(systemName: "mappin.circle.fill")
                                            .foregroundColor(.blue)
                                        Text("\(coords.lat), \(coords.lon)")
                                            .font(.caption)
                                            .foregroundColor(.secondary)
                                    }
                                }
                            }
                            .padding(.vertical, 4)
                        }
                        
                        // Manager Info
                        if let manager = profile.manager {
                            Section(header: Text("Management")) {
                                HStack {
                                    Text("Manager")
                                        .fontWeight(.medium)
                                    Spacer()
                                    Text(manager)
                                        .foregroundColor(.secondary)
                                }
                            }
                        }
                        
                        // Opening Hours
                        if let hours = profile.openingHours {
                            Section(header: Text("Opening Hours")) {
                                Text(hours)
                            }
                        }
                    }
                } else {
                    VStack(spacing: 16) {
                        Image(systemName: "building.2.crop.circle")
                            .font(.system(size: 64))
                            .foregroundColor(.gray)
                        
                        Text("Profile not found")
                            .font(.title2)
                            .foregroundColor(.secondary)
                        
                        Text("Waiting for sync from Capella...")
                            .font(.caption)
                            .foregroundColor(.secondary)
                            .padding(.horizontal)
                        
                        Button("Retry") {
                            loadProfile()
                        }
                        .buttonStyle(.borderedProminent)
                    }
                }
            }
            .navigationTitle("Store Profile")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Done") {
                        dismiss()
                    }
                }
            }
        }
        .onAppear {
            loadProfile()
        }
    }
    
    private func loadProfile() {
        isLoading = true
        profile = databaseManager.getStoreProfile()
        isLoading = false
    }
}

