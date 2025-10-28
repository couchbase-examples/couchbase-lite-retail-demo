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

/**
 * Create database configuration for a specific store
 * Collections are specified in {scope}.{collection} format
 */
export function createRetailConfig(storeId: string): DatabaseConfig<DBSchema> {
  // Convert storeId to scope name: "nyc-store-01" → "NYC-Store"
  const prefix = storeId.split('-')[0].toUpperCase();
  const scopeName = `${prefix}-Store`;
  
  return {
    name: "retail-inventory",
    version: 4,
    collections: {
      [`${scopeName}.inventory`]: {},
      [`${scopeName}.orders`]: {},
      [`${scopeName}.profile`]: {},
    },
  };
}

export type RetailDatabase = Database<DBSchema>;
