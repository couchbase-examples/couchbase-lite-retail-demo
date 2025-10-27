import { Database } from "@couchbaselabs/couchbase-lite";
import { RetailConfig } from "./types";

export async function initializeDatabase() {
  try {
    console.log('Opening Couchbase Lite database...');
    const db = await Database.open(RetailConfig);
    console.log('Database opened successfully');

    // Check current collection counts
    const inventoryCount = await db.collections.inventory.count();
    const ordersCount = await db.collections.orders.count();
    
    console.log(`Current inventory count: ${inventoryCount}`);
    console.log(`Current orders count: ${ordersCount}`);

    // Database starts empty and will be populated via App Services sync
    console.log('📡 Database ready for sync. Data will be populated from App Services.');

    return db;
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}