import { Replicator, type ReplicatorConfig, type ReplicatorCollectionConfig, type ReplicatorStatus } from "@couchbaselabs/couchbase-lite";
import type { RetailDatabase } from "./types";

// App Services configuration
// Update this value with your actual App Services endpoint
export const APP_SERVICES_URL = "ws://localhost:4984/retail-inventory/_blipsync";

export interface ReplicatorOptions {
  continuous?: boolean;
  onStatusChange?: (status: ReplicatorStatus) => void;
  onError?: (error: Error) => void;
}

export function createReplicator(
  db: RetailDatabase,
  options: ReplicatorOptions = {}
): Replicator {
  const { continuous = false, onStatusChange, onError } = options;

  // Collection configuration for sync
  const collectionConfig: ReplicatorCollectionConfig = {
    pull: { continuous },
    push: { continuous },
  };

  const config: ReplicatorConfig = {
    database: db,
    url: APP_SERVICES_URL,
    collections: {
      inventory: collectionConfig,
      orders: collectionConfig,
    },
  };

  const replicator = new Replicator(config);

  if (onStatusChange) {
    replicator.onStatusChange = onStatusChange;
  }

  if (onError) {
    // Handle errors during replication
    replicator.onStatusChange = (status: ReplicatorStatus) => {
      if (onStatusChange) onStatusChange(status);
      
      if (status.status === 'error' && status.error) {
        onError(status.error);
      }
    };
  }

  return replicator;
}

// Helper function to start one-shot replication
export async function syncOnce(db: RetailDatabase): Promise<void> {
  const replicator = createReplicator(db, {
    continuous: false,
    onStatusChange: (status) => {
      console.log(`Sync status: ${status.status}`);
      if (status.pulledRevisions !== undefined) {
        console.log(`Pulled ${status.pulledRevisions} documents`);
      }
      if (status.pushedRevisions !== undefined) {
        console.log(`Pushed ${status.pushedRevisions} documents`);
      }
    },
    onError: (error) => {
      console.error('Sync error:', error);
    },
  });

  await replicator.run();
}

// Helper function to start continuous replication
export function startContinuousSync(db: RetailDatabase): Replicator {
  const replicator = createReplicator(db, {
    continuous: true,
    onStatusChange: (status) => {
      console.log(`Continuous sync status: ${status.status}`);
    },
    onError: (error) => {
      console.error('Continuous sync error:', error);
    },
  });

  // Start replication in background
  void replicator.run();

  return replicator;
}
