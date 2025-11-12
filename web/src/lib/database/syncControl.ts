import { getSyncLogger } from "../logging";

const OFFLINE_MODE_KEY = "offline_mode";

/**
 * Get current offline mode state
 */
export function isOfflineMode(): boolean {
  return localStorage.getItem(OFFLINE_MODE_KEY) === "true";
}

/**
 * Set offline mode state
 */
export function setOfflineMode(offline: boolean): void {
  localStorage.setItem(OFFLINE_MODE_KEY, offline.toString());
}

/**
 * Get the global replicator instance
 */
function getReplicator(): any | null {
  return (window as any).__replicator || null;
}

/**
 * Stop the replicator (go offline)
 */
export function stopReplicator(): boolean {
  const logger = getSyncLogger();
  const replicator = getReplicator();
  
  if (!replicator) {
    logger.warn("No replicator instance found to stop");
    return false;
  }

  try {
    logger.info("Stopping replicator - going offline");
    replicator.stop();
    setOfflineMode(true);
    logger.info("Replicator stopped - now in offline mode");
    return true;
  } catch (error) {
    logger.error("Failed to stop replicator", { error });
    return false;
  }
}

/**
 * Start the replicator (go online)
 */
export function startReplicator(): boolean {
  const logger = getSyncLogger();
  const replicator = getReplicator();
  
  if (!replicator) {
    logger.warn("No replicator instance found to start");
    return false;
  }

  try {
    logger.info("Starting replicator - going online");
    replicator.run().catch((error: any) => {
      logger.error("Replicator run failed", { error });
    });
    setOfflineMode(false);
    logger.info("Replicator started - now in online mode");
    return true;
  } catch (error) {
    logger.error("Failed to start replicator", { error });
    return false;
  }
}

/**
 * Toggle between offline and online mode
 */
export function toggleOfflineMode(): boolean {
  const currentlyOffline = isOfflineMode();
  
  if (currentlyOffline) {
    // Currently offline, go online
    return startReplicator();
  } else {
    // Currently online, go offline
    return stopReplicator();
  }
}

