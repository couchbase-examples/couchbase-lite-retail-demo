import { type Database, type DatabaseConfig } from "@couchbaselabs/couchbase-lite";

export interface InventoryItem {
  _id: string;
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
  _id: string;
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

export interface DBSchema {
  inventory: InventoryItem;
  orders: Order;
}

export const RetailConfig: DatabaseConfig<DBSchema> = {
  name: "retail-inventory",
  version: 2, // Increment version to force database refresh
  collections: {
    inventory: {},
    orders: {},
  },
};

export type RetailDatabase = Database<DBSchema>;
