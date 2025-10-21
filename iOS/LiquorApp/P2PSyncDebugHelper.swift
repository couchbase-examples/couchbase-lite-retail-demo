//
//  P2PSyncDebugHelper.swift
//  LiquorApp
//
//  Comprehensive P2P Sync Debugging Tool
//

import Foundation
import CouchbaseLiteSwift
import MultipeerConnectivity

class P2PSyncDebugHelper {
    static let shared = P2PSyncDebugHelper()
    
    private init() {}
    
    // MARK: - Comprehensive Debug Report
    
    func generateDebugReport(
        database: Database?,
        p2pManager: MultipeerP2PSyncManagerWrapper?
    ) -> String {
        var report = """
        ╔════════════════════════════════════════════════════════════════╗
        ║           P2P SYNC COMPREHENSIVE DEBUG REPORT                  ║
        ╚════════════════════════════════════════════════════════════════╝
        
        """
        
        // 1. Database Status
        report += "📊 DATABASE STATUS\n"
        report += "─────────────────────────────────────────────────────────────\n"
        if let db = database {
            report += "✅ Database Name: \(db.name)\n"
            report += "✅ Database Path: \(db.path ?? "unknown")\n"
            
            // Check collections
            do {
                let collections = try db.collections()
                report += "✅ Collections: \(collections.count)\n"
                for collection in collections {
                    let scope = collection.scope.name
                    let name = collection.name
                    let count = try collection.count
                    report += "   • \(scope).\(name): \(count) documents\n"
                    
                    // Check specific liquor_items collection
                    if name == "liquor_items" {
                        report += "   🍺 LIQUOR ITEMS COLLECTION:\n"
                        let query = QueryBuilder
                            .select(SelectResult.expression(Meta.id))
                            .from(DataSource.collection(collection))
                            .limit(Expression.int(5))
                        
                        let results = try query.execute()
                        var docIds: [String] = []
                        for result in results {
                            if let id = result.string(at: 0) {
                                docIds.append(id)
                            }
                        }
                        report += "   📄 Sample Doc IDs: \(docIds.joined(separator: ", "))\n"
                    }
                }
            } catch {
                report += "❌ Error reading collections: \(error)\n"
            }
        } else {
            report += "❌ Database is NIL!\n"
        }
        report += "\n"
        
        // 2. P2P Manager Status
        report += "📡 P2P SYNC MANAGER STATUS\n"
        report += "─────────────────────────────────────────────────────────────\n"
        if let p2p = p2pManager {
            report += "✅ P2P Manager exists\n"
            report += "   Running: \(p2p.isRunning ? "✅ YES" : "❌ NO")\n"
            report += "   Connected Peers: \(p2p.connectedPeers.count)\n"
            
            for peer in p2p.connectedPeers {
                report += "   👤 Peer: \(peer)\n"  // peer is already a String
            }
            
            // Check if underlying manager exists
            if p2p.multipeerSyncManager != nil {
                report += "✅ Underlying MultipeerP2PSyncManager exists\n"
            } else {
                report += "❌ Underlying MultipeerP2PSyncManager is NIL\n"
            }
        } else {
            report += "❌ P2P Manager is NIL!\n"
        }
        report += "\n"
        
        // 3. Network Permissions
        report += "🔒 NETWORK PERMISSIONS\n"
        report += "─────────────────────────────────────────────────────────────\n"
        #if targetEnvironment(simulator)
        report += "⚠️  RUNNING IN SIMULATOR\n"
        report += "   Simulators have LIMITED MultipeerConnectivity support!\n"
        report += "   Recommendation: Test on REAL DEVICES for P2P sync\n"
        #else
        report += "✅ Running on REAL DEVICE\n"
        #endif
        report += "\n"
        
        // 4. Replication Configuration Check
        report += "⚙️  REPLICATION CONFIGURATION\n"
        report += "─────────────────────────────────────────────────────────────\n"
        report += "Service Type: _liquor-sync._tcp\n"
        report += "Protocol: MessageEndpoint (MessageStream)\n"
        report += "Replication Type: Push & Pull, Continuous\n"
        report += "Conflict Resolver: LiquorCRDTConflictResolver\n"
        report += "\n"
        
        // 5. Common Issues Checklist
        report += "🔍 COMMON ISSUES CHECKLIST\n"
        report += "─────────────────────────────────────────────────────────────\n"
        report += checkCommonIssues(database: database, p2pManager: p2pManager)
        report += "\n"
        
        report += """
        ╔════════════════════════════════════════════════════════════════╗
        ║                    END OF DEBUG REPORT                         ║
        ╚════════════════════════════════════════════════════════════════╝
        """
        
        return report
    }
    
    // MARK: - Common Issues Check
    
    private func checkCommonIssues(database: Database?, p2pManager: MultipeerP2PSyncManagerWrapper?) -> String {
        var issues = ""
        var issueCount = 0
        
        // Issue 1: P2P Manager not started
        if let p2p = p2pManager {
            if !p2p.isRunning {
                issueCount += 1
                issues += "❌ Issue \(issueCount): P2P Manager NOT RUNNING\n"
                issues += "   Fix: Call p2pSyncManagerWrapper?.start()\n\n"
            }
        } else {
            issueCount += 1
            issues += "❌ Issue \(issueCount): P2P Manager is NIL\n"
            issues += "   Fix: Initialize MultipeerP2PSyncManagerWrapper properly\n\n"
        }
        
        // Issue 2: No connected peers
        if let p2p = p2pManager, p2p.connectedPeers.isEmpty {
            issueCount += 1
            issues += "⚠️  Issue \(issueCount): NO CONNECTED PEERS\n"
            issues += "   Check: Are devices on same network?\n"
            issues += "   Check: Is Bonjour service advertised?\n\n"
        }
        
        // Issue 3: Database not initialized
        if database == nil {
            issueCount += 1
            issues += "❌ Issue \(issueCount): Database is NIL\n"
            issues += "   Fix: Ensure DatabaseManager initializes database\n\n"
        }
        
        // Issue 4: Simulator limitations
        #if targetEnvironment(simulator)
        issueCount += 1
        issues += "⚠️  Issue \(issueCount): RUNNING IN SIMULATOR\n"
        issues += "   MultipeerConnectivity has LIMITED support in simulators\n"
        issues += "   Recommendation: Test on TWO REAL DEVICES\n\n"
        #endif
        
        // Issue 5: Collection mismatch
        if let db = database {
            do {
                let collection = try db.collection(name: "liquor_items")
                if collection == nil {
                    issueCount += 1
                    issues += "❌ Issue \(issueCount): liquor_items collection NOT FOUND\n"
                    issues += "   Fix: Ensure collection is created before P2P starts\n\n"
                }
            } catch {
                issueCount += 1
                issues += "❌ Issue \(issueCount): Error checking collection: \(error)\n\n"
            }
        }
        
        if issueCount == 0 {
            issues += "✅ No obvious issues detected!\n"
            issues += "   If sync still not working, check logs for:\n"
            issues += "   • Replicator start/stop messages\n"
            issues += "   • MessageEndpoint connection messages\n"
            issues += "   • CRDT conflict resolution messages\n"
        }
        
        return issues
    }
    
    // MARK: - Live Sync Test
    
    func testLiveSync(database: Database?, itemId: String) {
        guard let db = database else {
            print("❌ Cannot test sync: Database is nil")
            return
        }
        
        print("\n🧪 LIVE SYNC TEST STARTED")
        print("═══════════════════════════════════════")
        
        do {
            let collection = try db.collection(name: "liquor_items") ?? db.createCollection(name: "liquor_items")
            
            // Get current document
            guard let doc = try collection.document(id: itemId)?.toMutable() else {
                print("❌ Document not found: \(itemId)")
                return
            }
            
            print("📄 Testing with document: \(itemId)")
            print("📊 Current data: \(doc.toDictionary())")
            
            // Increment quantity using CRDT
            let counter = doc.crdtCounter(forKey: "quantity", actor: db.deviceUUID ?? "test-actor")
            let oldValue = counter.value
            counter.increment(by: 1)
            
            // Save document
            try collection.save(document: doc)
            
            let newValue = counter.value
            print("✅ Modified document: \(itemId)")
            print("   Quantity: \(oldValue) → \(newValue)")
            print("   Device UUID: \(db.deviceUUID ?? "unknown")")
            print("\n⏳ Check OTHER DEVICE to see if change synced!")
            print("═══════════════════════════════════════\n")
            
        } catch {
            print("❌ Sync test failed: \(error)")
        }
    }
    
    // MARK: - Monitor Replication Activity
    
    func startMonitoringReplicationActivity() {
        print("\n🔍 REPLICATION ACTIVITY MONITOR STARTED")
        print("════════════════════════════════════════")
        print("Watch for these messages in console:")
        print("• [MultipeerP2P] Connection/disconnection events")
        print("• [LiquorSync] CRDT conflict resolution")
        print("• Replicator status changes")
        print("════════════════════════════════════════\n")
    }
}

