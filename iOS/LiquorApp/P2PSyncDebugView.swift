//
//  P2PSyncDebugView.swift
//  LiquorApp
//
//  Debug view for troubleshooting P2P sync issues
//

import SwiftUI
import CouchbaseLiteSwift

struct P2PSyncDebugView: View {
    @EnvironmentObject var databaseManager: DatabaseManager
    @EnvironmentObject var p2pSyncManagerWrapper: MultipeerP2PSyncManagerWrapper
    
    @State private var debugReport = ""
    @State private var isGenerating = false
    @State private var testItemId = ""
    @State private var showTestResult = false
    
    var body: some View {
        NavigationView {
            ScrollView {
                VStack(alignment: .leading, spacing: 20) {
                    
                    // Quick Status Card
                    quickStatusCard
                    
                    // Test Sync Button
                    testSyncSection
                    
                    // Generate Full Report
                    generateReportSection
                    
                    // Debug Report Display
                    if !debugReport.isEmpty {
                        reportDisplay
                    }
                    
                    // Manual Fixes Section
                    manualFixesSection
                }
                .padding()
            }
            .navigationTitle("P2P Sync Debug")
            .navigationBarTitleDisplayMode(.inline)
        }
    }
    
    // MARK: - Quick Status Card
    
    private var quickStatusCard: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Quick Status")
                .font(.headline)
                .foregroundColor(.primary)
            
            HStack {
                StatusRow(
                    icon: "cylinder.fill",
                    title: "Database",
                    status: databaseManager.database != nil ? "✅ Ready" : "❌ Not Ready",
                    color: databaseManager.database != nil ? .green : .red
                )
            }
            
            HStack {
                StatusRow(
                    icon: "wifi",
                    title: "P2P Manager",
                    status: p2pSyncManagerWrapper.isRunning ? "✅ Running" : "❌ Stopped",
                    color: p2pSyncManagerWrapper.isRunning ? .green : .orange
                )
            }
            
            HStack {
                StatusRow(
                    icon: "person.2.fill",
                    title: "Connected Peers",
                    status: "\(p2pSyncManagerWrapper.connectedPeers.count) peer(s)",
                    color: p2pSyncManagerWrapper.connectedPeers.count > 0 ? .green : .gray
                )
            }
            
            HStack {
                StatusRow(
                    icon: "list.bullet",
                    title: "Inventory Items",
                    status: "\(databaseManager.getAllLiquorItems().count) items",
                    color: .blue
                )
            }
        }
        .padding()
        .background(Color(.systemGray6))
        .cornerRadius(12)
    }
    
    // MARK: - Test Sync Section
    
    private var testSyncSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Test Sync")
                .font(.headline)
            
            Text("This will modify a random item's quantity to test if changes sync to other devices.")
                .font(.caption)
                .foregroundColor(.secondary)
            
            Button(action: performSyncTest) {
                HStack {
                    Image(systemName: "arrow.triangle.2.circlepath")
                    Text("Test Sync Now")
                        .fontWeight(.semibold)
                }
                .frame(maxWidth: .infinity)
                .padding()
                .background(Color.blue)
                .foregroundColor(.white)
                .cornerRadius(10)
            }
            
            if showTestResult {
                HStack {
                    Image(systemName: "checkmark.circle.fill")
                        .foregroundColor(.green)
                    Text("Test completed! Check other device for changes.")
                        .font(.caption)
                        .foregroundColor(.green)
                }
                .padding(.vertical, 8)
            }
        }
        .padding()
        .background(Color(.systemGray6))
        .cornerRadius(12)
    }
    
    // MARK: - Generate Report Section
    
    private var generateReportSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Full Debug Report")
                .font(.headline)
            
            Button(action: generateDebugReport) {
                HStack {
                    if isGenerating {
                        ProgressView()
                            .progressViewStyle(CircularProgressViewStyle(tint: .white))
                    } else {
                        Image(systemName: "doc.text.magnifyingglass")
                    }
                    Text(isGenerating ? "Generating..." : "Generate Report")
                        .fontWeight(.semibold)
                }
                .frame(maxWidth: .infinity)
                .padding()
                .background(Color.green)
                .foregroundColor(.white)
                .cornerRadius(10)
            }
            .disabled(isGenerating)
        }
        .padding()
        .background(Color(.systemGray6))
        .cornerRadius(12)
    }
    
    // MARK: - Report Display
    
    private var reportDisplay: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Text("Debug Report")
                    .font(.headline)
                
                Spacer()
                
                Button(action: copyReportToClipboard) {
                    HStack(spacing: 4) {
                        Image(systemName: "doc.on.doc")
                        Text("Copy")
                    }
                    .font(.caption)
                    .padding(.horizontal, 12)
                    .padding(.vertical, 6)
                    .background(Color.blue.opacity(0.2))
                    .foregroundColor(.blue)
                    .cornerRadius(8)
                }
            }
            
            ScrollView(.horizontal, showsIndicators: true) {
                Text(debugReport)
                    .font(.system(.caption, design: .monospaced))
                    .padding()
                    .frame(maxWidth: .infinity, alignment: .leading)
            }
            .frame(maxHeight: 400)
            .background(Color.black.opacity(0.05))
            .cornerRadius(8)
        }
        .padding()
        .background(Color(.systemGray6))
        .cornerRadius(12)
    }
    
    // MARK: - Manual Fixes Section
    
    private var manualFixesSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Quick Fixes")
                .font(.headline)
            
            Text("Try these if sync is not working:")
                .font(.caption)
                .foregroundColor(.secondary)
            
            VStack(spacing: 8) {
                QuickFixButton(
                    title: "Restart P2P Sync",
                    icon: "arrow.clockwise",
                    color: .orange
                ) {
                    restartP2PSync()
                }
                
                QuickFixButton(
                    title: "Force Refresh Data",
                    icon: "arrow.down.circle",
                    color: .blue
                ) {
                    forceRefreshData()
                }
                
                QuickFixButton(
                    title: "Clear Console & Monitor",
                    icon: "trash",
                    color: .red
                ) {
                    clearAndMonitor()
                }
            }
        }
        .padding()
        .background(Color(.systemGray6))
        .cornerRadius(12)
    }
    
    // MARK: - Actions
    
    private func generateDebugReport() {
        isGenerating = true
        
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
            let report = P2PSyncDebugHelper.shared.generateDebugReport(
                database: databaseManager.database,
                p2pManager: p2pSyncManagerWrapper
            )
            
            debugReport = report
            isGenerating = false
            
            // Print to console for easy viewing
            print("\n" + report + "\n")
        }
    }
    
    private func performSyncTest() {
        showTestResult = false
        
        let items = databaseManager.getAllLiquorItems()
        guard let randomItem = items.randomElement() else {
            print("❌ No items to test with")
            return
        }
        
        testItemId = randomItem.id
        P2PSyncDebugHelper.shared.testLiveSync(
            database: databaseManager.database,
            itemId: randomItem.id
        )
        
        showTestResult = true
        
        // Hide after 5 seconds
        DispatchQueue.main.asyncAfter(deadline: .now() + 5) {
            showTestResult = false
        }
    }
    
    private func copyReportToClipboard() {
        #if os(iOS)
        UIPasteboard.general.string = debugReport
        #endif
        print("📋 Report copied to clipboard!")
    }
    
    private func restartP2PSync() {
        print("🔄 Restarting P2P sync...")
        p2pSyncManagerWrapper.stop()
        
        DispatchQueue.main.asyncAfter(deadline: .now() + 2.0) {
            p2pSyncManagerWrapper.start()
            print("✅ P2P sync restarted")
        }
    }
    
    private func forceRefreshData() {
        print("🔄 Force refreshing data...")
        NotificationCenter.default.post(name: .liquorInventoryChanged, object: nil)
        print("✅ Refresh notification sent")
    }
    
    private func clearAndMonitor() {
        // This will just print monitoring info
        P2PSyncDebugHelper.shared.startMonitoringReplicationActivity()
    }
}

// MARK: - Supporting Views

struct StatusRow: View {
    let icon: String
    let title: String
    let status: String
    let color: Color
    
    var body: some View {
        HStack {
            Image(systemName: icon)
                .foregroundColor(color)
                .frame(width: 24)
            
            Text(title)
                .font(.subheadline)
                .foregroundColor(.secondary)
            
            Spacer()
            
            Text(status)
                .font(.subheadline)
                .fontWeight(.medium)
                .foregroundColor(color)
        }
    }
}

struct QuickFixButton: View {
    let title: String
    let icon: String
    let color: Color
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            HStack {
                Image(systemName: icon)
                Text(title)
                Spacer()
            }
            .padding()
            .background(color.opacity(0.1))
            .foregroundColor(color)
            .cornerRadius(8)
        }
    }
}

#Preview {
    P2PSyncDebugView()
        .environmentObject(DatabaseManager())
        .environmentObject(MultipeerP2PSyncManagerWrapper(database: try! Database(name: "preview")))
}

