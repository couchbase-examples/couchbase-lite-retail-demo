import { type Database, type DatabaseConfig } from "@couchbaselabs/couchbase-lite";

export interface InventoryItem {
  id: string;
  docType: "Inventory";
  productId: number;
  sku: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  unit: string;
  stockQty: number;
  location: {
    aisle: number;
    bin: number;
  };
  attributes: {
    organic: boolean;
    size: string;
    perishable: boolean;
  };
  imageURL: string;
  expirationDate: number;
  lastUpdated: number;
  storeId: string;
  type: "inventory";
}

export interface Order {
  id: string;
  docType: "Order";
  orderId: number;
  storeId: string;
  orderDate: number;
  orderStatus: "Submitted" | "Received";
  productId: number;
  sku: string;
  unit: string;
  orderQty: number;
  type: "order";
}

export interface StoreProfile {
  id: string;
  docType: "StoreProfile";
  storeId: string;
  name: string;
  location: {
    address1: string;
    address2?: string | null;
    locality: string;
    region: string;
    postalCode: string;
    country: string;
    coordinates?: {
      lat: number;
      lon: number;
    };
  };
  contact: {
    phone: string;
    email: string;
  };
  manager?: string;
  openingHours?: string;
  type: "profile";
}

export interface DBSchema {
  inventory: InventoryItem;
  orders: Order;
  profile: StoreProfile;
}

// Get scope name based on store ID from session storage
function getScopeName(): string {
  const stored = sessionStorage.getItem('retail_auth_credentials');
  if (stored) {
    try {
      const credentials = JSON.parse(stored);
      const storeId = credentials.storeId;
      // Map store ID to scope name: "aa-store-01" → "AA-Store", "nyc-store-01" → "NYC-Store"
      if (storeId.startsWith('aa-')) {
        return 'AA-Store';
      } else if (storeId.startsWith('nyc-')) {
        return 'NYC-Store';
      }
    } catch (e) {
      console.error('Failed to parse credentials:', e);
    }
  }
  // Default to AA-Store if can't determine
  return 'AA-Store';
}

export const RetailConfig: DatabaseConfig<DBSchema> = {
  name: "retail-inventory",
  version: 4, // Incremented to use 'id' instead of '_id'
  collections: {
    inventory: {
      scope: getScopeName(),
    },
    orders: {
      scope: getScopeName(),
    },
    profile: {
      scope: getScopeName(),
    },
  },
};

export type RetailDatabase = Database<DBSchema>;
