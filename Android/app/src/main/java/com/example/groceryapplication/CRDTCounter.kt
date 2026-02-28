package com.example.groceryapplication

import com.couchbase.lite.*
import android.util.Log

/**
 * CRDTCounter provides conflict-free replication for counter values using
 * a Positive-Negative (PN) Counter CRDT data structure.
 *
 * This implementation allows multiple devices to increment/decrement quantities
 * independently, and all changes will converge to the same value when synced.
 *
 * Based on the CRDT implementation from the iOS app.
 */

// MARK: - CRDT Counter (Read-only)

/**
 * Read-only CRDT counter that can read merged counter values
 */
open class CRDTCounter(
    protected val document: Document,
    protected val key: String
) {
    companion object {
        private const val TAG = "CRDTCounter"
    }
    
    /**
     * Get the current value of the counter (difference between positive and negative)
     */
    val value: Int
        get() {
            val counter = document.getDictionary(key)
            return counter?.getInt("value") ?: 0
        }
}

// MARK: - Mutable CRDT Counter

/**
 * Mutable CRDT counter that can increment and decrement values
 * Each device has a unique actor ID to track its changes
 */
class MutableCRDTCounter(
    private val mutableDocument: MutableDocument,
    key: String,
    private val actor: String
) : CRDTCounter(mutableDocument, key) {
    
    companion object {
        private const val TAG = "MutableCRDTCounter"
    }
    
    /**
     * Increment the counter by the specified amount
     */
    fun increment(amount: Int = 1) {
        if (amount < 0) {
            Log.w(TAG, "⚠️ increment() called with negative value, use decrement() instead")
            return
        }
        
        // Get the counter structure
        val counter = getOrCreateCounter()
        
        // Get the positive counter
        val p = getOrCreateSubCounter(counter, "p")
        
        // Increment the value for this actor
        val currentValue = p.getInt(actor)
        p.setInt(actor, currentValue + amount)
        
        // Update the merged value
        counter.setInt("value", computeValue(counter.getDictionary("p"), counter.getDictionary("n")))
        
        Log.d(TAG, "✅ Incremented $key by $amount (actor: $actor, new value: ${counter.getInt("value")})")
    }
    
    /**
     * Decrement the counter by the specified amount
     */
    fun decrement(amount: Int = 1) {
        if (amount < 0) {
            Log.w(TAG, "⚠️ decrement() called with negative value, use increment() instead")
            return
        }
        
        // Get the counter structure
        val counter = getOrCreateCounter()
        
        // Get the negative counter
        val n = getOrCreateSubCounter(counter, "n")
        
        // Increment the negative value for this actor
        val currentValue = n.getInt(actor)
        n.setInt(actor, currentValue + amount)
        
        // Update the merged value
        counter.setInt("value", computeValue(counter.getDictionary("p"), counter.getDictionary("n")))
        
        Log.d(TAG, "✅ Decremented $key by $amount (actor: $actor, new value: ${counter.getInt("value")})")
    }
    
    /**
     * Set the counter to a specific value (calculates delta and applies increment/decrement)
     * Handles migration from regular integer fields to CRDT format
     */
    fun setValue(newValue: Int) {
        // Check if there's an existing regular integer field that needs migration
        val existingRegularValue = mutableDocument.getInt(key)
        val currentCRDTValue = value
        
        // If there's a regular value but no CRDT value, migrate it
        if (existingRegularValue > 0 && currentCRDTValue == 0) {
            Log.d(TAG, "🔄 Migrating regular $key value ($existingRegularValue) to CRDT format")
            
            // Initialize CRDT counter with the existing value
            val counter = getOrCreateCounter()
            val p = getOrCreateSubCounter(counter, "p")
            p.setInt(actor, existingRegularValue)
            counter.setInt("value", existingRegularValue)
            
            // Remove the old regular field
            mutableDocument.remove(key)
            
            Log.d(TAG, "✅ Migrated $key from $existingRegularValue to CRDT format")
        }
        
        // Now calculate delta from the current CRDT value
        val currentValue = value
        val delta = newValue - currentValue
        
        when {
            delta > 0 -> increment(delta)
            delta < 0 -> decrement(-delta)
            else -> Log.d(TAG, "Value unchanged: $newValue")
        }
    }
    
    // MARK: - Private Helpers
    
    private fun getOrCreateCounter(): MutableDictionary {
        var counter = mutableDocument.getDictionary(key)
        if (counter == null) {
            counter = MutableDictionary()
            counter.setString("type", "pn-counter")
            mutableDocument.setDictionary(key, counter)
        }
        return counter
    }
    
    private fun getOrCreateSubCounter(counter: MutableDictionary, subKey: String): MutableDictionary {
        var subCounter = counter.getDictionary(subKey)
        if (subCounter == null) {
            subCounter = MutableDictionary()
            counter.setDictionary(subKey, subCounter)
        }
        return subCounter
    }
    
    private fun computeValue(p: Dictionary?, n: Dictionary?): Int {
        // Sum the positive counter values
        val pCounterValue = p?.toMap()?.values?.sumOf { 
            when (it) {
                is Int -> it
                is Long -> it.toInt()
                is Number -> it.toInt()
                else -> 0
            }
        } ?: 0
        
        // Sum the negative counter values
        val nCounterValue = n?.toMap()?.values?.sumOf { 
            when (it) {
                is Int -> it
                is Long -> it.toInt()
                is Number -> it.toInt()
                else -> 0
            }
        } ?: 0
        
        // Return the difference between positive and negative counter values
        // Ensure non-negative quantities
        return maxOf(0, pCounterValue - nCounterValue)
    }
}

// MARK: - Extension Functions

/**
 * Get a read-only CRDT counter from a document
 */
fun Document.getCRDTCounter(key: String): CRDTCounter? {
    val dict = this.getDictionary(key)
    return if (dict?.getString("type") == "pn-counter") {
        CRDTCounter(this, key)
    } else {
        null
    }
}

/**
 * Get a mutable CRDT counter from a mutable document
 */
fun MutableDocument.getMutableCRDTCounter(key: String, actor: String): MutableCRDTCounter {
    return MutableCRDTCounter(this, key, actor)
}

/**
 * Get the device UUID for use as actor ID
 * This is a simplified version that generates a UUID based on database name
 */
fun Database.getDeviceUUID(): String {
    val key = "${this.name}.device.uuid"
    // For now, generate a deterministic UUID based on database name
    // In a real app, you'd want to store this in SharedPreferences
    val uuid = java.util.UUID.nameUUIDFromBytes(key.toByteArray()).toString()
    Log.d("Database", "🆔 Generated device UUID: $uuid")
    return uuid
}

// MARK: - Helper to get device UUID (Android-compatible)

/**
 * Get or create a unique device UUID for this database
 * This is stored in app preferences and persists across app restarts
 */
fun getDeviceUUID(context: android.content.Context, databaseName: String): String {
    val key = "$databaseName.device.uuid"
    val prefs = context.getSharedPreferences("couchbase_prefs", android.content.Context.MODE_PRIVATE)
    
    var uuid = prefs.getString(key, null)
    if (uuid == null) {
        uuid = java.util.UUID.randomUUID().toString()
        prefs.edit().putString(key, uuid).apply()
        Log.d("CRDTCounter", "🆔 Generated new device UUID: $uuid")
    }
    return uuid
}

// MARK: - Example Usage in Comments

/**
 * Example usage for inventory quantities:
 *
 * ```kotlin
 * // Get the document
 * val collection = database.getCollection("inventory", "AA-Store")
 * val document = collection.getDocument("product-123")?.toMutable() ?: return
 * 
 * // Get device UUID as actor ID
 * val actorId = getDeviceUUID(context, database.name)
 * 
 * // Get mutable CRDT counter
 * val quantityCounter = document.getMutableCRDTCounter("stockQty", actorId)
 * 
 * // Increment quantity (e.g., receiving stock)
 * quantityCounter.increment(10)
 * 
 * // Decrement quantity (e.g., selling items)
 * quantityCounter.decrement(2)
 * 
 * // Get current value
 * val currentQty = quantityCounter.value
 * println("Current quantity: $currentQty")
 * 
 * // Save the document
 * collection.save(document)
 * ```
 *
 * The CRDT structure in the document looks like:
 * ```json
 * {
 *   "stockQty": {
 *     "type": "pn-counter",
 *     "p": {
 *       "device-uuid-1": 10,
 *       "device-uuid-2": 5
 *     },
 *     "n": {
 *       "device-uuid-1": 2,
 *       "device-uuid-2": 1
 *     },
 *     "value": 12
 *   }
 * }
 * ```
 */

