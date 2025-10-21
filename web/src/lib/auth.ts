/**
 * Authentication and credentials management
 */

export interface AuthCredentials {
  email: string;
  password: string;
  storeId: string;
}

const AUTH_STORAGE_KEY = 'retail_auth_credentials';

/**
 * Extract store ID from email
 * e.g., "nyc-store-01@supermarket.com" → "nyc-store-01"
 */
export function extractStoreIdFromEmail(email: string): string {
  const match = email.match(/^([a-zA-Z]+-store-\d+)@/);
  if (!match) {
    throw new Error('Invalid email format. Expected format: store-id@supermarket.com');
  }
  return match[1];
}

/**
 * Get App Endpoint URL based on store ID
 * Mapping is straightforward: each store connects to its corresponding endpoint
 * - nyc-store-01 → supermarket-nyc endpoint
 * - aa-store-01 → supermarket-aa endpoint
 */
export function getAppEndpointUrl(storeId: string): string {
  // Extract the store prefix (e.g., "nyc" from "nyc-store-01")
  const prefix = storeId.split('-')[0].toLowerCase();
  
  // Default base URL with port 4984 for Sync Gateway
  const baseUrl = 'wss://rmyrslbide2f0qwi.apps.cloud.couchbase.com:4984';
  
  // Map store to its corresponding endpoint
  return `${baseUrl}/supermarket-${prefix}`;
}

/**
 * Store credentials securely in sessionStorage
 */
export function storeCredentials(email: string, password: string): void {
  const storeId = extractStoreIdFromEmail(email);
  const credentials: AuthCredentials = {
    email,
    password,
    storeId,
  };
  sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(credentials));
}

/**
 * Retrieve stored credentials
 */
export function getStoredCredentials(): AuthCredentials | null {
  const stored = sessionStorage.getItem(AUTH_STORAGE_KEY);
  if (!stored) return null;
  
  try {
    return JSON.parse(stored) as AuthCredentials;
  } catch {
    return null;
  }
}

/**
 * Clear stored credentials (logout)
 */
export function clearCredentials(): void {
  sessionStorage.removeItem(AUTH_STORAGE_KEY);
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return getStoredCredentials() !== null;
}

