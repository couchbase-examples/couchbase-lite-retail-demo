import { DocID, LastWriteWins } from "@couchbase/lite-js";
import type { RetailDatabase, InventoryItem, Order } from "./types";
import { getScopeNameFromStoreId } from "../auth";
import { getUILogger } from "../logging";
import { convertCBLToPlain } from "./utils";

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
  const logger = getUILogger();
  const scopeName = getScopeNameFromStoreId(storeId);
  const ordersCollectionName = `${scopeName}.orders` as any;
  
  try {
    const query = db.createQuery(
      `SELECT MAX(orderId) as maxId FROM \`${ordersCollectionName}\``
    );
    
    let maxId = 0;
    await query.execute((row) => {
      // Convert Couchbase Lite objects to plain JavaScript values
      const plainRow = convertCBLToPlain(row);
      const maxValue = plainRow.maxId;
      if (maxValue !== null && maxValue !== undefined) {
        maxId = Number(maxValue);
      }
    });
    
    logger.debug("Generated next order ID", { maxId, nextId: maxId + 1 });
    return maxId + 1;
  } catch (error) {
    logger.error("Error getting next order ID", { error });
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
  const logger = getUILogger();
  
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
    
    logger.info("Creating order", { 
      documentId, 
      orderId: nextOrderId,
      productId: order.productId,
      quantity 
    });
    
    // Save to database using createDocument + save pattern with conflict handler
    const collection = db.collections[ordersCollectionName];
    const docToSave = collection.createDocument(DocID(documentId), order as any);
    await collection.save(docToSave, LastWriteWins);
    
    logger.info("Order created and saved to collection", {
      documentId,
      orderId: nextOrderId
    });
    
    // Continuous replication will automatically sync the new order
    // No need to manually restart the replicator
    
    return order;
  } catch (error) {
    logger.error("Error creating order", { error });
    return null;
  }
}
