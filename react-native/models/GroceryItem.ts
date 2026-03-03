export interface GroceryItemLocation {
    aisle: number;
    bin: number;
}

export interface GroceryItemAttributes {
    organic: boolean;
    size: string;
    perishable: boolean;
}

export interface GroceryItem {
    id: string;             // Couchbase document ID (META().id)
    docType?: string;
    productId?: number;
    sku?: string;
    name: string;
    brand?: string;
    category: string;       // Capella field name
    price: number;
    unit?: string;
    stockQty: number;       // Capella field name
    location?: GroceryItemLocation;
    attributes?: GroceryItemAttributes;
    imageURL: string;
    expirationDate?: number;  // epoch millis
    lastUpdated?: number;     // epoch millis
    storeId?: string;
}

/**
 * Returns the quantity display color based on stock level.
 * Green (>30), Orange (11-30), Red (<=10) — matching native apps.
 */
export function getQuantityColor(qty: number): string {
    if (qty > 30) return '#34C759';   // green
    if (qty > 10) return '#FF9500';   // orange
    return '#FF3B30';                  // red
}
