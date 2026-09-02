package com.example.groceryapplication

import com.couchbase.lite.Dictionary
import com.couchbase.lite.Result

data class GroceryItem(
    val id: String = java.util.UUID.randomUUID().toString(),
    val name: String,
    val type: String,
    val price: Double,
    val imageURL: String,
    var quantity: Int = 0,
    val productId: Int? = null,
    val sku: String? = null,
    val unit: String? = null,
    // Vector-search additions. All optional and all defaulted, so every existing
    // construction site keeps compiling and documents without these fields still decode.
    val brand: String? = null,
    val location: Location? = null,
    val attributes: Attributes? = null,
    val description: String? = null,
    val searchTags: List<String>? = null,
    val storeId: String? = null,
    val docType: String? = null
) {
    data class Location(
        val aisle: Int = 0,
        val bin: Int = 0,
        // Added by the edge-vector-search dataset extension; `shelf` drives planogram
        // matching and `section` is the human-readable zone label.
        val shelf: String? = null,
        val section: String? = null
    )

    /**
     * `attributes` is an open, category-specific object: grocery documents carry
     * organic/size/perishable, footwear carries color/material/breathable, and
     * sports-nutrition items add protein_g/sugar_g/dairyFree. Every key is nullable so a
     * document from any category decodes — the Footwear documents in the extended dataset
     * have no `organic` or `perishable` at all.
     */
    data class Attributes(
        // Grocery
        val organic: Boolean? = null,
        val size: String? = null,
        val perishable: Boolean? = null,
        // Sports nutrition
        val proteinG: Int? = null,
        val sugarG: Int? = null,
        val dairyFree: Boolean? = null,
        val vegan: Boolean? = null,
        val flavor: String? = null,
        val caffeineMg: Int? = null,
        val probiotic: Boolean? = null,
        // Footwear
        val color: String? = null,
        val material: String? = null,
        val weight: String? = null,
        val breathable: Boolean? = null,
        val waterproof: Boolean? = null,
        val gender: String? = null,
        val useCase: String? = null,
        val sizeRange: String? = null
    ) {
        /**
         * Category-appropriate highlights for the copilot result card, in a stable order so
         * the same product always renders its badges the same way. Mirrors iOS.
         */
        val displayBadges: List<String>
            get() = buildList {
                proteinG?.takeIf { it > 0 }?.let { add("${it}g protein") }
                sugarG?.let { add("${it}g sugar") }
                if (dairyFree == true) add("dairy-free")
                if (vegan == true) add("vegan")
                if (organic == true) add("organic")
                color?.let { add(it) }
                useCase?.let { add(it) }
                if (breathable == true) add("breathable")
                if (waterproof == true) add("waterproof")
            }
    }

    companion object {
        /**
         * Builds an item from a Couchbase Lite query [Result].
         *
         * Deliberately does NOT read `embedding.*.vector`: the inventory grid renders ~100
         * items, and pulling 384 floats per row into memory costs a lot for data no list view
         * displays. The copilot reads vectors only where it needs them.
         */
        fun from(row: Result, id: String): GroceryItem? {
            val name = row.getString("name") ?: return null
            val imageURL = row.getString("imageURL") ?: return null

            // Capella stores `category`; older locally-created docs used `type`.
            val type = row.getString("category") ?: row.getString("type") ?: "Unknown"

            val location = row.getDictionary("location")?.let { l ->
                Location(
                    aisle = l.getInt("aisle"),
                    bin = l.getInt("bin"),
                    shelf = l.getString("shelf"),
                    section = l.getString("section")
                )
            }

            val attributes = row.getDictionary("attributes")?.toAttributes()

            val searchTags = row.getArray("searchTags")?.let { arr ->
                (0 until arr.count()).mapNotNull { arr.getString(it) }
            }

            return GroceryItem(
                id = id,
                name = name,
                type = type,
                price = row.getDouble("price"),
                imageURL = imageURL,
                quantity = row.getInt("stockQty"),
                productId = if (row.contains("productId")) row.getInt("productId") else null,
                sku = row.getString("sku"),
                unit = row.getString("unit"),
                brand = row.getString("brand"),
                location = location,
                attributes = attributes,
                description = row.getString("description"),
                searchTags = searchTags,
                storeId = row.getString("storeId"),
                docType = row.getString("docType")
            )
        }

        /**
         * `getBoolean` returns false for an absent key, which would turn "this document has no
         * `organic` field" into "this product is not organic". Presence is checked so absent
         * stays null.
         */
        private fun Dictionary.toAttributes(): Attributes {
            fun bool(key: String): Boolean? = if (contains(key)) getBoolean(key) else null
            fun int(key: String): Int? = if (contains(key)) getInt(key) else null
            return Attributes(
                organic = bool("organic"),
                size = getString("size"),
                perishable = bool("perishable"),
                proteinG = int("protein_g"),
                sugarG = int("sugar_g"),
                dairyFree = bool("dairyFree"),
                vegan = bool("vegan"),
                flavor = getString("flavor"),
                caffeineMg = int("caffeine_mg"),
                probiotic = bool("probiotic"),
                color = getString("color"),
                material = getString("material"),
                weight = getString("weight"),
                breathable = bool("breathable"),
                waterproof = bool("waterproof"),
                gender = getString("gender"),
                useCase = getString("useCase"),
                sizeRange = getString("sizeRange")
            )
        }
    }
}
