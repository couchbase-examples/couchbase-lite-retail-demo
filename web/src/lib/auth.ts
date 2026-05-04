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
 * Extract App Endpoint from email
 * e.g., "nyc-store-01@supermarket.com" → "supermarket-nyc"
 */
export function extractAppEndpointFromEmail(email: string): string {
  const match = email.match(/^([a-zA-Z]+)-store-\d+@/);
  if (!match) {
    throw new Error('Invalid email format. Expected format: store-id@supermarket.com');
  }
  return "supermarket-" + match[1].toLowerCase();
}

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
 * Get scope name from store ID
 * e.g., "nyc-store-01" → "NYC-Store", "aa-store-01" → "AA-Store"
 */
export function getScopeNameFromStoreId(storeId: string): string {
  const prefix = storeId.split('-')[0].toUpperCase();
  return `${prefix}-Store`;
}

/**
 * Get App Services URL from environment variable
 * Returns the URL exactly as configured in .env without any modifications
 */
export function getAppServicesUrl(): string {
  const url = import.meta.env.VITE_APP_SERVICES_URL;

  if (!url) {
    throw new Error('VITE_APP_SERVICES_URL is not configured. Please check your .env file.');
  }

  return url;
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
 * Retrieve app endpoint
 */
export function getAppEndpoint(credentials: AuthCredentials): string {
  return extractAppEndpointFromEmail(credentials.email);
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

