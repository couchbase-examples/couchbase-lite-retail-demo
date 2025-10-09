import { Replicator } from "@couchbaselabs/couchbase-lite";
import type { RetailDatabase } from "./types";

export interface SyncConfig {
  url: string;
  username: string;
  password: string;
}

export function setupSync(db: RetailDatabase, config: SyncConfig) {
  // Create replicator configuration
  const replicatorConfig: any = {
    database: db,
    url: config.url,
    authenticator: {
      type: "basic",
      username: config.username,
      password: config.password,
    },
    collections: {
      inventory: {
        channels: ["inventory", "store-aa-store-01"],
        pull: { continuous: true },
        push: { continuous: true },
      },
      orders: {
        channels: ["orders", "store-aa-store-01"],
        pull: { continuous: true },
        push: { continuous: true },
      },
    },
  };

  // Create replicator
  const replicator = new Replicator(replicatorConfig);

  // Status change listener
  replicator.onStatusChange = (status: any) => {
    console.log("🔄 Replicator Status:", status.activity);
    
    if (status.activity === "stopped" && status.error) {
      console.error("❌ Replication error:", status.error);
    }
    
    if (status.activity === "idle") {
      console.log("✅ Sync complete");
    }
    
    if (status.activity === "connecting") {
      console.log("🔌 Connecting to Sync Gateway...");
    }
  };

  // Document replication listener
  replicator.onDocuments = (collection: any, direction: string, documents: any[]) => {
    const arrow = direction === "push" ? "⬆️" : "⬇️";
    console.log(`${arrow} Synced ${documents.length} docs in ${collection.name}`);
  };

  // Note: Replicator starts automatically when created with continuous sync
  console.log("✅ Replicator created and will start syncing automatically");

  return replicator;
}
