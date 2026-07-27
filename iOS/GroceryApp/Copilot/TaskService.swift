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

    static let statuses = ["open", "accepted", "in_progress", "done", "cancelled"]
    static let types = ["relocate", "restock", "merchandising", "general"]

    var isOpen: Bool { status == "open" }
    var isDone: Bool { status == "done" }
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

    private let databaseManager: DatabaseManager

    /// This device's display label. Soft identity: a name the UI shows, nothing more.
    static var deviceLabel: String {
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
    }

    func loadTasks() {
        guard let database = databaseManager.database else { return }
        let sql = """
            SELECT META().id AS id, taskType, title, description, status, priority,
                   createdBy, assignedTo, relatedProductId, relatedSku,
                   sourcePlanogramId, createdAt, updatedAt
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
                    updatedAt: row.int64(forKey: "updatedAt")
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
}
