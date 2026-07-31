import Foundation
import CouchbaseLiteSwift

/// A "Request Help" task — an associate asking someone else to move or restock an item.
struct StoreTask: Identifiable, Hashable {
    let id: String
    var taskType: String
    var title: String
    var detail: String
    var status: String
    var priority: String
    var createdBy: String
    var assignedTo: String?
    var relatedProductId: Int?
    var relatedSku: String?
    var sourcePlanogramId: String?
    var createdAt: Int64
    var updatedAt: Int64
    /// Net stock change recorded against this task, summed from the PN-counter.
    var quantityDelta: Int
    var aisle: Int?
    var shelf: String?

    static let statuses = ["open", "accepted", "in_progress", "done", "cancelled"]
    static let types = ["relocate", "restock", "merchandising", "general"]

    var isOpen: Bool { status == "open" }
    var isDone: Bool { status == "done" }
    var isTerminal: Bool { status == "done" || status == "cancelled" }

    /// True when this device is the one that claimed the task. Drives which actions the UI
    /// offers — the point of the two-device demo is that the *other* associate acts on it.
    var isMine: Bool { assignedTo == TaskService.deviceLabel }

    /// The next lifecycle step, or nil once the task is finished.
    var nextStatus: String? {
        switch status {
        case "open": return "accepted"
        case "accepted": return "in_progress"
        case "in_progress": return "done"
        default: return nil
        }
    }

    var nextStatusLabel: String? {
        switch status {
        case "open": return "Accept"
        case "accepted": return "Start work"
        case "in_progress": return "Mark done"
        default: return nil
        }
    }

    var locationText: String? {
        guard let aisle else { return nil }
        return shelf.map { "Aisle \(aisle) · shelf \($0)" } ?? "Aisle \(aisle)"
    }
}

/// The inventory document a task points at, resolved so the associate can correct its count.
struct TaskStockContext {
    let documentId: String
    let name: String
    let currentStock: Int
}

/// Creates and updates documents in the `tasks` collection.
///
/// The design point worth noticing: `createdBy` / `assignedTo` are **soft, app-level
/// labels**, not App Services users. Every device in a store authenticates as the same store
/// credential, so a task document syncs to every device in that scope automatically — over
/// App Services when online, or peer-to-peer when offline. Assignment is cooperative rather
/// than security-enforced, which is exactly what lets Request Help work with no
/// access-control changes at all.
///
/// Enforced per-associate isolation would need real per-user identities and channels. That is
/// out of scope, and notably the schema here does not change when it is added later — only
/// the App Services user and channel setup would.
@MainActor
final class TaskService: ObservableObject {

    @Published private(set) var tasks: [StoreTask] = []
    /// Set when a task document arrives from another device, so the UI can say so out loud —
    /// otherwise a list that silently grows looks like a local refresh rather than sync.
    @Published var lastRemoteChange: Date?

    private let databaseManager: DatabaseManager
    private var listenerToken: ListenerToken?

    /// This device's display label. Soft identity: a name the UI shows, nothing more.
    ///
    /// `nonisolated` because `StoreTask.isMine` compares against it, and a task is a plain
    /// value that gets read off the main actor.
    nonisolated static var deviceLabel: String {
        let key = "Copilot.associateLabel"
        if let existing = UserDefaults.standard.string(forKey: key) { return existing }
        // Stable per install, and readable on screen during a two-device demo.
        let suffix = String(UUID().uuidString.prefix(4))
        let label = "associate-\(suffix)"
        UserDefaults.standard.set(label, forKey: key)
        return label
    }

    init(databaseManager: DatabaseManager) {
        self.databaseManager = databaseManager
        loadTasks()
        observeRemoteChanges()
    }

    deinit { listenerToken?.remove() }

    /// Watches the `tasks` collection so a task raised on another device appears here without
    /// a manual refresh. This is what makes the two-device demo watchable: the second
    /// associate's list updates while the first is still holding their phone.
    private func observeRemoteChanges() {
        guard let database = databaseManager.database else { return }
        do {
            let collection = try database.collection(name: AppConfig.tasksCollectionName,
                                                     scope: AppConfig.scopeName)
                ?? database.createCollection(name: AppConfig.tasksCollectionName,
                                             scope: AppConfig.scopeName)
            listenerToken = collection.addChangeListener { [weak self] change in
                let ids = change.documentIDs
                Task { @MainActor [weak self] in
                    guard let self else { return }
                    let knownBefore = Set(self.tasks.map(\.id))
                    self.loadTasks()
                    // A change to a document this device did not already know about, or a
                    // status it did not write, came in over replication.
                    if ids.contains(where: { !knownBefore.contains($0) }) {
                        self.lastRemoteChange = Date()
                    }
                    print("🔔 [Tasks] collection changed: \(ids.count) document(s)")
                }
            }
        } catch {
            print("❌ [Tasks] could not observe collection: \(error)")
        }
    }

    func loadTasks() {
        guard let database = databaseManager.database else { return }
        let sql = """
            SELECT META().id AS id, taskType, title, description, status, priority,
                   createdBy, assignedTo, relatedProductId, relatedSku,
                   sourcePlanogramId, createdAt, updatedAt, quantityDelta, location
            FROM `\(AppConfig.scopeName)`.`\(AppConfig.tasksCollectionName)`
            ORDER BY createdAt DESC
            """
        do {
            tasks = try database.createQuery(sql).execute().compactMap { row in
                guard let id = row.string(forKey: "id") else { return nil }
                return StoreTask(
                    id: id,
                    taskType: row.string(forKey: "taskType") ?? "general",
                    title: row.string(forKey: "title") ?? "",
                    detail: row.string(forKey: "description") ?? "",
                    status: row.string(forKey: "status") ?? "open",
                    priority: row.string(forKey: "priority") ?? "normal",
                    createdBy: row.string(forKey: "createdBy") ?? "unknown",
                    assignedTo: row.string(forKey: "assignedTo"),
                    relatedProductId: row.contains(key: "relatedProductId")
                        ? row.int(forKey: "relatedProductId") : nil,
                    relatedSku: row.string(forKey: "relatedSku"),
                    sourcePlanogramId: row.string(forKey: "sourcePlanogramId"),
                    createdAt: row.int64(forKey: "createdAt"),
                    updatedAt: row.int64(forKey: "updatedAt"),
                    // `quantityDelta` is a PN-counter dictionary once anyone has adjusted a
                    // count, and a plain 0 before that.
                    quantityDelta: row.dictionary(forKey: "quantityDelta")?.int(forKey: "value")
                        ?? row.int(forKey: "quantityDelta"),
                    aisle: row.dictionary(forKey: "location")?.int(forKey: "aisle"),
                    shelf: row.dictionary(forKey: "location")?.string(forKey: "shelf")
                )
            }
        } catch {
            print("❌ [Tasks] failed to load: \(error)")
        }
    }

    /// Creates a task from a shelf-audit finding, linking back to both the product and the
    /// planogram whose audit spawned it.
    @discardableResult
    func createTask(from finding: PositionFinding,
                    planogram: Planogram,
                    taskType: String,
                    priority: String,
                    title: String,
                    detail: String,
                    assignedTo: String?) -> StoreTask? {
        guard let database = databaseManager.database else { return nil }

        do {
            let collection = try database.collection(name: AppConfig.tasksCollectionName,
                                                     scope: AppConfig.scopeName)
                ?? database.createCollection(name: AppConfig.tasksCollectionName,
                                             scope: AppConfig.scopeName)

            let scopeTag = AppConfig.currentStore == .nyc ? "NYCStore" : "AAStore"
            let docId = "Task_\(scopeTag)_\(UUID().uuidString.prefix(8).lowercased())"
            let now = Int64(Date().timeIntervalSince1970 * 1000)

            let doc = MutableDocument(id: docId)
            doc.setString("Task", forKey: "docType")
            doc.setString(AppConfig.storeId, forKey: "storeId")
            doc.setString(taskType, forKey: "taskType")
            doc.setString(title, forKey: "title")
            doc.setString(detail, forKey: "description")
            doc.setString("open", forKey: "status")
            doc.setString(priority, forKey: "priority")
            doc.setString(Self.deviceLabel, forKey: "createdBy")
            if let assignedTo, !assignedTo.isEmpty {
                doc.setString(assignedTo, forKey: "assignedTo")
            } else {
                // Null rather than absent: unassigned means "anyone can accept".
                doc.setValue(nil, forKey: "assignedTo")
            }
            doc.setInt(finding.expectedProductId, forKey: "relatedProductId")
            doc.setString(planogram.id, forKey: "sourcePlanogramId")
            doc.setInt(0, forKey: "quantityDelta")
            doc.setInt64(now, forKey: "createdAt")
            doc.setInt64(now, forKey: "updatedAt")
            doc.setValue(nil, forKey: "acceptedAt")
            doc.setValue(nil, forKey: "completedAt")

            let location = MutableDictionaryObject()
            location.setInt(planogram.aisle, forKey: "aisle")
            location.setString(planogram.shelf, forKey: "shelf")
            location.setString(planogram.section, forKey: "section")
            doc.setDictionary(location, forKey: "location")

            try collection.save(document: doc)
            print("📝 [Tasks] created \(docId) — syncs to every device in \(AppConfig.scopeName)")
            loadTasks()
            return tasks.first { $0.id == docId }
        } catch {
            print("❌ [Tasks] failed to create: \(error)")
            return nil
        }
    }

    /// Moves a task along its lifecycle. Concurrent transitions resolve last-write-wins by
    /// HLC timestamp, which is acceptable here — two associates accepting at once is a
    /// cosmetic race, not a correctness problem.
    func updateStatus(_ task: StoreTask, to status: String) {
        guard let database = databaseManager.database else { return }
        do {
            guard let collection = try database.collection(name: AppConfig.tasksCollectionName,
                                                           scope: AppConfig.scopeName),
                  let doc = try collection.document(id: task.id)?.toMutable() else { return }

            let now = Int64(Date().timeIntervalSince1970 * 1000)
            doc.setString(status, forKey: "status")
            doc.setInt64(now, forKey: "updatedAt")
            if status == "accepted" {
                doc.setInt64(now, forKey: "acceptedAt")
                // Accepting claims it for this device's soft identity.
                doc.setString(Self.deviceLabel, forKey: "assignedTo")
            }
            if status == "done" {
                doc.setInt64(now, forKey: "completedAt")
            }
            try collection.save(document: doc)
            loadTasks()
        } catch {
            print("❌ [Tasks] failed to update \(task.id): \(error)")
        }
    }

    /// Advances a task one step along `open → accepted → in_progress → done`.
    func advance(_ task: StoreTask) {
        guard let next = task.nextStatus else { return }
        updateStatus(task, to: next)
    }

    func cancel(_ task: StoreTask) { updateStatus(task, to: "cancelled") }

    /// Puts a task back in the pool, clearing the claim so another associate can take it.
    func release(_ task: StoreTask) {
        guard let database = databaseManager.database else { return }
        do {
            guard let collection = try database.collection(name: AppConfig.tasksCollectionName,
                                                           scope: AppConfig.scopeName),
                  let doc = try collection.document(id: task.id)?.toMutable() else { return }
            doc.setString("open", forKey: "status")
            doc.setValue(nil, forKey: "assignedTo")
            doc.setValue(nil, forKey: "acceptedAt")
            doc.setInt64(Int64(Date().timeIntervalSince1970 * 1000), forKey: "updatedAt")
            try collection.save(document: doc)
            loadTasks()
        } catch {
            print("❌ [Tasks] failed to release \(task.id): \(error)")
        }
    }

    // MARK: - Stock count

    /// Resolves the inventory document a task refers to, so its count can be corrected.
    ///
    /// Matched on `productId` rather than document id because the task is raised from a
    /// planogram finding, which knows the product but not which document carries it in this
    /// store's scope.
    func stockContext(for task: StoreTask) -> TaskStockContext? {
        guard let database = databaseManager.database, let productId = task.relatedProductId
        else { return nil }
        let sql = """
            SELECT META().id AS id, name, stockQty
            FROM `\(AppConfig.scopeName)`.`\(AppConfig.collectionName)`
            WHERE productId = $productId LIMIT 1
            """
        do {
            let query = try database.createQuery(sql)
            query.parameters = {
                let p = Parameters()
                p.setInt(productId, forName: "productId")
                return p
            }()
            guard let row = try query.execute().next(),
                  let id = row.string(forKey: "id") else { return nil }
            return TaskStockContext(documentId: id,
                                    name: row.string(forKey: "name") ?? "Unknown product",
                                    currentStock: row.int(forKey: "stockQty"))
        } catch {
            print("❌ [Tasks] stock lookup failed for product \(productId): \(error)")
            return nil
        }
    }

    /// Records a stock correction made while resolving a task.
    ///
    /// Two writes, deliberately of different kinds:
    ///
    ///  - The inventory document's `stockQty` is a **plain integer**, because that is the
    ///    field Capella and the Android client read. Concurrent edits to it fall to the
    ///    replicator's default last-write-wins, which is the pre-existing behaviour of this
    ///    app's inventory and not something this feature changes.
    ///  - The task's `quantityDelta` is a **PN-counter**, so when two associates each restock
    ///    part of the same request their contributions *sum* instead of overwriting. That is
    ///    the field where conflict-free merging actually matters, and it is what the store
    ///    manager reads to see how much was moved in total.
    @discardableResult
    func applyStockCount(for task: StoreTask, newCount: Int) -> Bool {
        guard let database = databaseManager.database,
              let context = stockContext(for: task) else { return false }
        let delta = newCount - context.currentStock
        guard delta != 0 else { return true }

        do {
            guard let inventory = try database.collection(name: AppConfig.collectionName,
                                                          scope: AppConfig.scopeName),
                  let item = try inventory.document(id: context.documentId)?.toMutable()
            else { return false }
            item.setInt(newCount, forKey: "stockQty")
            item.setInt64(Int64(Date().timeIntervalSince1970 * 1000), forKey: "lastUpdated")
            try inventory.save(document: item)

            guard let collection = try database.collection(name: AppConfig.tasksCollectionName,
                                                           scope: AppConfig.scopeName),
                  let doc = try collection.document(id: task.id)?.toMutable() else { return false }
            let counter = doc.crdtCounter(forKey: "quantityDelta", actor: database.deviceUUID)
            if delta > 0 {
                counter.increment(by: UInt(delta))
            } else {
                counter.decrement(by: UInt(-delta))
            }
            doc.setInt64(Int64(Date().timeIntervalSince1970 * 1000), forKey: "updatedAt")
            try collection.save(document: doc)

            print("📦 [Tasks] \(context.name): stockQty \(context.currentStock) → \(newCount) "
                  + "(delta \(delta >= 0 ? "+" : "")\(delta)) recorded on \(task.id)")
            loadTasks()
            return true
        } catch {
            print("❌ [Tasks] failed to apply stock count for \(task.id): \(error)")
            return false
        }
    }
}
