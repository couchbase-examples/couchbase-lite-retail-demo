import { DocID, LastWriteWins } from "@couchbaselabs/couchbase-lite";
import type { RetailDatabase, InventoryItem, Order } from "./types";
import { getScopeNameFromStoreId } from "../auth";

/**
 * Generate a NanoID-style random string
 */
function generateNanoId(length: number = 21): string {
  const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let id = '';
  for (let i = 0; i < length; i++) {
    id += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
  }
  return id;
}

/**
 * Get the next order ID by finding the max orderId in existing orders
 */
async function getNextOrderId(db: RetailDatabase, storeId: string): Promise<number> {
  const scopeName = getScopeNameFromStoreId(storeId);
  const ordersCollectionName = `${scopeName}.orders` as any;
  
  try {
    const query = db.createQuery(
      `SELECT MAX(orderId) as maxId FROM \`${ordersCollectionName}\``
    );
    
    let maxId = 0;
    await query.execute((row) => {
      const maxValue = row.maxId;
      if (maxValue !== null && maxValue !== undefined) {
        maxId = Number(maxValue);
      }
    });
    
    return maxId + 1;
  } catch (error) {
    console.error('Error getting next order ID:', error);
    return 1;
  }
}

/**
 * Create a new order in the database
 */
export async function createOrder(
  db: RetailDatabase,
  item: InventoryItem,
  quantity: number,
  storeId: string
): Promise<Order | null> {
  try {
    const scopeName = getScopeNameFromStoreId(storeId);
    const ordersCollectionName = `${scopeName}.orders` as any;
    
    // Generate document ID
    const nanoId = generateNanoId();
    const documentId = `order-${storeId}-${nanoId}`;
    
    // Get next sequential order ID
    const nextOrderId = await getNextOrderId(db, storeId);
    
    // Create order object
    const order: Order = {
      id: documentId,
      docType: "Order",
      orderId: nextOrderId,
      storeId: storeId,
      orderDate: Date.now(),
      orderStatus: "In Review",
      productId: item.productId || 0,
      sku: item.sku,
      unit: item.unit,
      orderQty: quantity,
      type: "order"
    };
    
    console.log('Creating order:', order);
    
    // Save to database using createDocument + save pattern with conflict handler
    const collection = db.collections[ordersCollectionName];
    const docToSave = collection.createDocument(DocID(documentId), order as any);
    await collection.save(docToSave, LastWriteWins);
    
    console.log(`✅ Order created: ${documentId} (productId: ${order.productId}, qty: ${quantity})`);
    
    // Trigger sync immediately by restarting replicator if idle
    const replicator = (window as any).__replicator;
    if (replicator) {
      const status = replicator.currentStatus; // Use currentStatus stored by onStatusChange
      if (status?.activity === 'idle' || status?.activity === 'stopped') {
        console.log('🔄 Restarting replicator to push new order...');
        try {
          await replicator.stop();
          await replicator.run();
        } catch (error) {
          console.error('⚠️ Error restarting replicator:', error);
        }
      }
    }
    
    return order;
  } catch (error) {
    console.error('❌ Error creating order:', error);
    return null;
  }
}
