/**
 * Logging configuration using LogTape
 * Integrates with Couchbase Lite's logging system
 */

import * as logtape from "@logtape/logtape";
import { LogCategory } from "@couchbase/lite-js";

// App-specific log categories (as subcategories of CouchbaseLite)
export const APP_LOG_CATEGORY = [LogCategory, "App"];
export const SYNC_LOG_CATEGORY = [LogCategory, "AppSync"];
export const UI_LOG_CATEGORY = [LogCategory, "AppUI"];

/**
 * Initialize logging configuration
 * Call this early in the application lifecycle
 */
export async function initializeLogging() {
  await logtape.configure({
    sinks: {
      console: logtape.getConsoleSink(),
    },
    loggers: [
      // Couchbase Lite core logging (info and above)
      {
        category: LogCategory,
        lowestLevel: "info",
        sinks: ["console"],
      },
      // App-specific logging (debug and above for development)
      {
        category: APP_LOG_CATEGORY,
        lowestLevel: "debug",
        sinks: ["console"],
      },
      // Sync-specific logging
      {
        category: SYNC_LOG_CATEGORY,
        lowestLevel: "debug",
        sinks: ["console"],
      },
      // UI-specific logging
      {
        category: UI_LOG_CATEGORY,
        lowestLevel: "debug",
        sinks: ["console"],
      },
    ],
  });
}

/**
 * Get a logger for sync operations
 */
export function getSyncLogger() {
  return logtape.getLogger(SYNC_LOG_CATEGORY);
}

/**
 * Get a logger for UI operations
 */
export function getUILogger() {
  return logtape.getLogger(UI_LOG_CATEGORY);
}

/**
 * Get a logger for general app operations
 */
export function getAppLogger() {
  return logtape.getLogger(APP_LOG_CATEGORY);
}

