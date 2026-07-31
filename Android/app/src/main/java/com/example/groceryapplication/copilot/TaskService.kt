package com.example.groceryapplication.copilot

import android.content.Context
import android.util.Log
import com.couchbase.lite.Database
import com.couchbase.lite.Parameters
import com.example.groceryapplication.AppConfig
import com.example.groceryapplication.getDeviceUUID
import com.example.groceryapplication.getMutableCRDTCounter
import java.util.UUID

/** A "Request Help" task — an associate asking someone else to move or restock an item. */
data class StoreTask(
    val id: String,
    val taskType: String,
    val title: String,
    val detail: String,
    val status: String,
    val priority: String,
    val createdBy: String,
    val assignedTo: String?,
    val relatedProductId: Int?,
    val createdAt: Long,
    /** Net stock change recorded against this task, read from the PN-counter. */
    val quantityDelta: Int,
    val aisle: Int?,
    val shelf: String?
) {
    val isTerminal: Boolean get() = status == "done" || status == "cancelled"

    /** The next lifecycle step, or null once the task is finished. */
    val nextStatus: String?
        get() = when (status) {
            "open" -> "accepted"
            "accepted" -> "in_progress"
            "in_progress" -> "done"
            else -> null
        }

    val nextStatusLabel: String?
        get() = when (status) {
            "open" -> "Accept"
            "accepted" -> "Start work"
            "in_progress" -> "Mark done"
            else -> null
        }

    val locationText: String?
        get() = aisle?.let { a -> shelf?.let { "Aisle $a · shelf $it" } ?: "Aisle $a" }
}

/** The inventory document a task points at, resolved so the associate can correct its count. */
data class TaskStockContext(
    val documentId: String,
    val name: String,
    val currentStock: Int
)

/**
 * Reads and updates documents in the `tasks` collection.
 *
 * The counterpart of the iOS `TaskService`, and deliberately the *resolution* half of Request
 * Help: iOS raises a task from a shelf-audit finding, and either platform can accept it,
 * correct the count and close it. That is the two-device story the doc asks for, and it works
 * across platforms because both clients share one store credential and one scope.
 *
 * `createdBy` / `assignedTo` are soft, app-level labels rather than App Services users. Every
 * device in a store authenticates as the same store credential, so a task document reaches
 * every device in that scope with no access-control changes at all.
 */
class TaskService(
    context: Context,
    private val databaseProvider: () -> Database?
) {
    companion object {
        private const val TAG = "TaskService"
        private const val PREFS = "copilot.prefs"
        private const val LABEL_KEY = "associateLabel"
    }

    private val prefs = context.getSharedPreferences(PREFS, Context.MODE_PRIVATE)

    /** This device's display label. Soft identity: a name the UI shows, nothing more. */
    val deviceLabel: String by lazy {
        prefs.getString(LABEL_KEY, null) ?: run {
            val label = "associate-${UUID.randomUUID().toString().take(4)}"
            prefs.edit().putString(LABEL_KEY, label).apply()
            label
        }
    }

    fun loadTasks(): List<StoreTask> {
        val database = databaseProvider() ?: return emptyList()
        val sql = """
            SELECT META().id AS id, taskType, title, description, status, priority,
                   createdBy, assignedTo, relatedProductId, createdAt, quantityDelta, location
            FROM `${AppConfig.scopeName}`.`${AppConfig.TASKS_COLLECTION_NAME}`
            ORDER BY createdAt DESC
        """.trimIndent()
        return try {
            database.createQuery(sql).execute().use { rs ->
                rs.allResults().mapNotNull { row ->
                    val id = row.getString("id") ?: return@mapNotNull null
                    val location = row.getDictionary("location")
                    StoreTask(
                        id = id,
                        taskType = row.getString("taskType") ?: "general",
                        title = row.getString("title") ?: "",
                        detail = row.getString("description") ?: "",
                        status = row.getString("status") ?: "open",
                        priority = row.getString("priority") ?: "normal",
                        createdBy = row.getString("createdBy") ?: "unknown",
                        assignedTo = row.getString("assignedTo"),
                        relatedProductId = row.getValue("relatedProductId")
                            ?.let { (it as? Number)?.toInt() },
                        createdAt = row.getLong("createdAt"),
                        // A PN-counter dictionary once anyone has adjusted a count, a plain 0
                        // before that.
                        quantityDelta = row.getDictionary("quantityDelta")?.getInt("value")
                            ?: row.getInt("quantityDelta"),
                        aisle = location?.getValue("aisle")?.let { (it as? Number)?.toInt() },
                        shelf = location?.getString("shelf")
                    )
                }
            }
        } catch (e: Exception) {
            Log.e(TAG, "❌ failed to load tasks", e)
            emptyList()
        }
    }

    /**
     * Moves a task along its lifecycle. Concurrent transitions resolve last-write-wins by HLC
     * timestamp, which is acceptable here — two associates accepting at once is a cosmetic
     * race, not a correctness problem.
     */
    fun updateStatus(task: StoreTask, status: String): Boolean {
        val database = databaseProvider() ?: return false
        return try {
            val collection = database.getCollection(
                AppConfig.TASKS_COLLECTION_NAME, AppConfig.scopeName
            ) ?: return false
            val doc = collection.getDocument(task.id)?.toMutable() ?: return false
            val now = System.currentTimeMillis()
            doc.setString("status", status)
            doc.setLong("updatedAt", now)
            if (status == "accepted") {
                doc.setLong("acceptedAt", now)
                // Accepting claims it for this device's soft identity.
                doc.setString("assignedTo", deviceLabel)
            }
            if (status == "done") doc.setLong("completedAt", now)
            collection.save(doc)
            Log.d(TAG, "📝 ${task.id} → $status")
            true
        } catch (e: Exception) {
            Log.e(TAG, "❌ failed to update ${task.id}", e)
            false
        }
    }

    fun advance(task: StoreTask): Boolean =
        task.nextStatus?.let { updateStatus(task, it) } ?: false

    fun cancel(task: StoreTask): Boolean = updateStatus(task, "cancelled")

    /** Puts a task back in the pool, clearing the claim so another associate can take it. */
    fun release(task: StoreTask): Boolean {
        val database = databaseProvider() ?: return false
        return try {
            val collection = database.getCollection(
                AppConfig.TASKS_COLLECTION_NAME, AppConfig.scopeName
            ) ?: return false
            val doc = collection.getDocument(task.id)?.toMutable() ?: return false
            doc.setString("status", "open")
            doc.setValue("assignedTo", null)
            doc.setValue("acceptedAt", null)
            doc.setLong("updatedAt", System.currentTimeMillis())
            collection.save(doc)
            true
        } catch (e: Exception) {
            Log.e(TAG, "❌ failed to release ${task.id}", e)
            false
        }
    }

    /**
     * Resolves the inventory document a task refers to, so its count can be corrected.
     *
     * Matched on `productId` rather than document id because the task is raised from a
     * planogram finding, which knows the product but not which document carries it in this
     * store's scope.
     */
    fun stockContext(task: StoreTask): TaskStockContext? {
        val database = databaseProvider() ?: return null
        val productId = task.relatedProductId ?: return null
        val sql = """
            SELECT META().id AS id, name, stockQty
            FROM `${AppConfig.scopeName}`.`${AppConfig.COLLECTION_NAME}`
            WHERE productId = ${'$'}productId LIMIT 1
        """.trimIndent()
        return try {
            val query = database.createQuery(sql)
            query.parameters = Parameters().apply { setInt("productId", productId) }
            query.execute().use { rs ->
                val row = rs.next() ?: return null
                val id = row.getString("id") ?: return null
                TaskStockContext(
                    documentId = id,
                    name = row.getString("name") ?: "Unknown product",
                    currentStock = row.getInt("stockQty")
                )
            }
        } catch (e: Exception) {
            Log.e(TAG, "❌ stock lookup failed for product $productId", e)
            null
        }
    }

    /**
     * Records a stock correction made while resolving a task.
     *
     * Two writes, deliberately of different kinds:
     *
     *  - The inventory document's `stockQty` is a **plain integer**, because that is the field
     *    Capella and the iOS client read. Concurrent edits fall to the replicator's default
     *    last-write-wins, which is this app's pre-existing inventory behaviour.
     *  - The task's `quantityDelta` is a **PN-counter**, so when two associates each restock
     *    part of the same request their contributions sum instead of overwriting. That is the
     *    field where conflict-free merging actually matters.
     */
    fun applyStockCount(task: StoreTask, newCount: Int): Boolean {
        val database = databaseProvider() ?: return false
        val context = stockContext(task) ?: return false
        val delta = newCount - context.currentStock
        if (delta == 0) return true

        return try {
            val inventory = database.getCollection(
                AppConfig.COLLECTION_NAME, AppConfig.scopeName
            ) ?: return false
            val item = inventory.getDocument(context.documentId)?.toMutable() ?: return false
            item.setInt("stockQty", newCount)
            item.setLong("lastUpdated", System.currentTimeMillis())
            inventory.save(item)

            val collection = database.getCollection(
                AppConfig.TASKS_COLLECTION_NAME, AppConfig.scopeName
            ) ?: return false
            val doc = collection.getDocument(task.id)?.toMutable() ?: return false
            val counter = doc.getMutableCRDTCounter("quantityDelta", database.getDeviceUUID())
            if (delta > 0) counter.increment(delta) else counter.decrement(-delta)
            doc.setLong("updatedAt", System.currentTimeMillis())
            collection.save(doc)

            Log.d(TAG, "📦 ${context.name}: stockQty ${context.currentStock} → $newCount " +
                    "(delta ${if (delta >= 0) "+" else ""}$delta) recorded on ${task.id}")
            true
        } catch (e: Exception) {
            Log.e(TAG, "❌ failed to apply stock count for ${task.id}", e)
            false
        }
    }
}
