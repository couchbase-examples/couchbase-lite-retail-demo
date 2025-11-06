import { Replicator } from "@couchbaselabs/couchbase-lite";
import type { RetailDatabase } from "./types";
import { getScopeNameFromStoreId } from "../auth";
import { getSyncLogger } from "../logging";

export interface SyncConfig {
  url: string;
  username: string;
  password: string;
  storeId: string;
}

/**
 * Setup ONE-SHOT sync for profile collection
 * This is used during login to fetch the store profile document
 */
export function setupOneShotSync(db: RetailDatabase, config: SyncConfig): Replicator {
  const scopeName = getScopeNameFromStoreId(config.storeId);
  const profileCollection = `${scopeName}.profile`;
  
  console.log("🔧 Setting up ONE-SHOT sync for profile with config:", {
    url: config.url,
    username: config.username,
    storeId: config.storeId,
    collection: profileCollection
  });

  const replicatorConfig: any = {
    database: db,
    url: config.url,
    credentials: {
      username: config.username,
      password: config.password,
    },
    collections: {
      [profileCollection]: {
        pull: { continuous: false } // One-shot pull only
      },
    },
  };

  const replicator = new Replicator(replicatorConfig);

  // Status change listener
  replicator.onStatusChange = (status: any) => {
    console.log("🔄 Profile Replicator Status:", status.status, status); 
    
    if (status.error) {
      console.error("❌ Profile Replication error:", status.error);
    }

    const activity = status.activity || status.status;
    
    if (activity === "stopped" || activity === "idle") { 
      if (status.error) {
        console.error("❌ Profile sync failed");
      } else {
        console.log("✅ Profile sync complete");
      }
    }
  };

  // Document replication listener
  replicator.onDocuments = (collection: any, direction: string, documents: any[]) => {
    const arrow = direction === "push" ? "⬆️" : "⬇️";
    console.log(`${arrow} Synced ${documents.length} profile docs`, {
      direction,
      collection: collection.name,
      documentIds: documents.map(d => d.id).slice(0, 5)
    });
    
    if (documents.length > 0) {
      console.log("📄 Profile document:", documents[0]);
    }
  };

  return replicator;
}

export function setupSync(db: RetailDatabase, config: SyncConfig) {
  const logger = getSyncLogger();
  const scopeName = getScopeNameFromStoreId(config.storeId);
  const inventoryCollection = `${scopeName}.inventory`;
  const ordersCollection = `${scopeName}.orders`;
  
  logger.info("Setting up continuous sync", {
    url: config.url,
    username: config.username,
    storeId: config.storeId,
    collections: [inventoryCollection, ordersCollection]
  });

  // Create replicator configuration
  const replicatorConfig: any = {
    database: db,
    url: config.url,
    credentials: {
      username: config.username,
      password: config.password,
    },
    collections: {
      [inventoryCollection]: {
        pull: { continuous: true },
        push: { continuous: true },
      },
      [ordersCollection]: {
        pull: { continuous: true },
        push: { continuous: true },
      },
    },
  };

  console.log("📡 Sync configuration:", {
    storeId: config.storeId,
    url: config.url,
    collections: [inventoryCollection, ordersCollection]
  });

  console.log("🔧 Creating replicator...");

  // Create replicator
  let replicator: any;
  try {
    replicator = new Replicator(replicatorConfig);
    console.log("✅ Replicator object created");
  } catch (error) {
    console.error("❌ Failed to create replicator:", error);
    throw error;
  }

  // Status change listener
  replicator.onStatusChange = (status: any) => {
    // Store status on replicator object for external access
    (replicator as any).currentStatus = status;
    
    const activity = status.activity || status.status;
    
    logger.debug("Replicator status change", {
      activity,
      pulledRevisions: status.pulledRevisions,
      pushedRevisions: status.pushedRevisions,
      error: status.error
    });
    
    // Log errors
    if (status.error) {
      logger.error("Replication error occurred", {
        error: status.error,
        errorDetails: JSON.stringify(status.error, null, 2)
      });
    }
    
    // Handle different activity states
    if (activity === "stopped") {
      if (status.error) {
        logger.error("Replicator stopped with error", { error: status.error });
      } else {
        logger.warn("Replicator stopped unexpectedly");
      }
    }
    
    if (activity === "idle") {
      // Idle = all caught up, still watching for changes (this is normal for continuous replication)
      logger.info("Replicator idle - all changes synced, watching for new changes");
    }
    
    if (activity === "connecting") {
      logger.info("Connecting to App Services");
    }

    if (activity === "busy") {
      logger.info("Sync in progress");
    }
  };

  // Document replication listener
  replicator.onDocuments = (collection: any, direction: string, documents: any[]) => {
    // Log document sync activity
    const arrow = direction === "push" ? "⬆️" : "⬇️";
    logger.info(`${arrow} Documents synced`, {
      direction,
      collection: collection.name,
      count: documents.length,
      documentIds: documents.map(d => d.id || d._id).slice(0, 5) // Show first 5 IDs
    });
    
    // Log sample document at debug level
    if (documents.length > 0) {
      logger.debug("Sample document synced", {
        document: documents[0]
      });
    }
  };

  // Start the replicator for continuous sync
  // With continuous replication, run() keeps the replicator active
  // and it will automatically sync changes as they occur
  logger.info("Starting continuous replicator");
  
  // Important: Don't await run() - let it run in the background
  // For continuous replication, run() will keep going until stop() is called
  replicator.run().catch((error: any) => {
    logger.error("Replicator run failed", { error });
  });

  logger.info("Continuous replicator started and watching for changes");

  return replicator;
}