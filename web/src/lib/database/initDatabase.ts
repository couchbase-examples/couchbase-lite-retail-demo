import { Database } from "@couchbaselabs/couchbase-lite";
import { createRetailConfig } from "./types";
import { getScopeNameFromStoreId } from "../auth";

export async function initializeDatabase(storeId: string) {
  try {
    console.log('Opening Couchbase Lite database for store:', storeId);
    
    const config = createRetailConfig(storeId);
    const db = await Database.open(config);
    
    console.log('✅ Database opened successfully');

    // Get scope name for collection access
    const scopeName = getScopeNameFromStoreId(storeId);
    const inventoryCollectionName = `${scopeName}.inventory` as any;
    const ordersCollectionName = `${scopeName}.orders` as any;
    const profileCollectionName = `${scopeName}.profile` as any;

    // Check current collection counts
    const inventoryCount = await db.collections[inventoryCollectionName].count();
    const ordersCount = await db.collections[ordersCollectionName].count();
    const profileCount = await db.collections[profileCollectionName].count();
    
    console.log(`Current inventory count: ${inventoryCount}`);
    console.log(`Current orders count: ${ordersCount}`);
    console.log(`Current profile count: ${profileCount}`);

    // Database starts empty and will be populated via App Services sync
    console.log('📡 Database ready for sync. Data will be populated from App Services.');

    return db;
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}