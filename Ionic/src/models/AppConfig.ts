/**
 * Per-store configuration assembled at login time from the .env values.
 * Mirrors the AppConfig in the Java / .NET / iOS / Android ports.
 */
export interface AppConfig {
  store: 'AA' | 'NYC';
  databaseName: string;
  scope: string;
  syncUrl: string;
  username: string;
  password: string;
}

export const LOCAL_DB_NAME = 'GroceryInventoryDB';
export const AUTH_DB_NAME = 'AuthDB';

export const COLLECTION_INVENTORY = 'inventory';
export const COLLECTION_ORDERS = 'orders';
export const COLLECTION_PROFILE = 'profile';
