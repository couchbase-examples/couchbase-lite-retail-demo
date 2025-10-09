import { Database, DocID } from "@couchbaselabs/couchbase-lite";
import { RetailConfig, type InventoryItem, type Order } from "./types";
import inventoryData from "../data/aa_store_inventory.json";
import ordersData from "../data/aa_inventory_orders.json";

export async function initializeDatabase() {
  try {
    console.log('Opening Couchbase Lite database...');
    const db = await Database.open(RetailConfig);
    console.log('Database opened successfully');

    // Check if database already has data
    const inventoryCount = await db.collections.inventory.count();
    console.log(`Current inventory count: ${inventoryCount}`);
    
    // If empty, seed with initial data
    if (inventoryCount === 0) {
      console.log('Database is empty. Seeding with initial data...');
      
      // Import inventory items one by one
      console.log(`Importing ${inventoryData.length} inventory items...`);
      for (const item of inventoryData) {
        try {
          // Create a new document
          const doc = db.collections.inventory.createDocument(DocID(item._id));
          
          // Set all properties
          Object.assign(doc, item);
          doc.type = "inventory";
          
          // Save the document
          await db.collections.inventory.save(doc);
        } catch (err) {
          console.error(`Error importing item ${item._id}:`, err);
        }
      }
      console.log(`✓ Imported ${inventoryData.length} inventory items`);
      
      // Import orders
      console.log(`Importing ${ordersData.length} orders...`);
      for (const order of ordersData) {
        try {
          // Create a new document
          const doc = db.collections.orders.createDocument(DocID(order._id));
          
          // Set all properties
          Object.assign(doc, order);
          doc.type = "order";
          
          // Save the document
          await db.collections.orders.save(doc);
        } catch (err) {
          console.error(`Error importing order ${order._id}:`, err);
        }
      }
      console.log(`✓ Imported ${ordersData.length} orders`);
      
      // Verify the data was saved
      const finalCount = await db.collections.inventory.count();
      console.log(`Final inventory count: ${finalCount}`);
    } else {
      console.log('Database already has data, skipping seed');
    }

    return db;
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}
