import { Replicator } from "@couchbaselabs/couchbase-lite";
import type { RetailDatabase } from "./types";
import { getScopeNameFromStoreId } from "../auth";

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
  const scopeName = getScopeNameFromStoreId(config.storeId);
  const inventoryCollection = `${scopeName}.inventory`;
  const ordersCollection = `${scopeName}.orders`;
  
  console.log("🔄 Setting up sync with config:", {
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
    
    console.log("🔄 Replicator Status Change:", {
      activity: status.activity,
      progress: status.progress,
      pulledRevisions: status.pulledRevisions,
      pushedRevisions: status.pushedRevisions,
      error: status.error
    });
    
    if (status.error) {
      console.error("❌ Replication error:", status.error);
      console.error("Error details:", JSON.stringify(status.error, null, 2));
    }
    
    const activity = status.activity || status.status;
    
    if (activity === "stopped" || activity === "idle") { 
      if (status.error) {
        console.error("❌ Replication stopped with error");
      } else {
        console.log("⏸️  Replicator stopped (no error)");
      }
    }
    
    if (activity === "idle") {
      console.log("✅ Sync complete - all changes synced");
    }
    
    if (activity === "connecting") {
      console.log("🔌 Connecting to App Services...");
    }

    if (activity === "busy") {
      console.log("⚡️ Sync in progress...");
    }
  };

  // Document replication listener
  replicator.onDocuments = (collection: any, direction: string, documents: any[]) => {
    const arrow = direction === "push" ? "⬆️" : "⬇️";
    console.log(`${arrow} Synced ${documents.length} docs in ${collection.name}`, {
      direction,
      collection: collection.name,
      documentIds: documents.map(d => d.id || d._id).slice(0, 5) // Show first 5 IDs
    });
    
    // Log first document for debugging
    if (documents.length > 0) {
      console.log("📄 Sample document:", documents[0]);
    }
  };

  // Log replicator object details for debugging
  console.log("🔍 Replicator object methods:", Object.keys(replicator));
  console.log("🔍 Replicator status before start:", replicator.status);
  
  // Start the replicator - THIS IS THE KEY!
  console.log("🚀 Starting replicator with .run()...");
  
  // Run async without blocking
  replicator.run().then(() => {
    console.log("✅ Replicator.run() completed");
    console.log("🔍 Replicator status after run():", replicator.status);
  }).catch((error: any) => {
    console.error("❌ Replicator.run() failed:", error);
    console.error("Error type:", typeof error);
    console.error("Error keys:", Object.keys(error || {}));
  });

  console.log("✅ Continuous replicator started");
  console.log("⏳ Waiting for sync to begin...");
  
  // Check status after 2 seconds
  setTimeout(() => {
    console.log("🔍 Replicator status after 2s:", replicator.status);
    console.log("🔍 Is replicator running?", replicator.status?.activity);
  }, 2000);

  return replicator;
}