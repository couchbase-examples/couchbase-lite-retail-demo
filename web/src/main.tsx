import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initializeDatabase } from "./lib/database/initDatabase";
import { DatabaseProvider } from "./lib/database/DatabaseProvider";
import { setupSync } from "./lib/database/sync";
import { getStoredCredentials, getAppServicesUrl } from "./lib/auth";
import type { RetailDatabase } from "./lib/database/types";

/**
 * Start continuous sync for inventory and orders after successful login
 * This is called from the Dashboard component after authentication
 */
export async function startContinuousSync(db: RetailDatabase) {
  // Get stored credentials
  const credentials = getStoredCredentials();
  if (!credentials) {
    console.log('⚠️ No credentials found - cannot start sync');
    return null;
  }

  console.log('🔄 Starting continuous sync for inventory and orders...');
  console.log('🏪 Store ID:', credentials.storeId);
  
  const syncUrl = getAppServicesUrl();
  console.log('📡 App Services URL:', syncUrl);
  
  try {
    const replicator = setupSync(db, {
      url: syncUrl,
      username: credentials.email,
      password: credentials.password,
      storeId: credentials.storeId,
    });
    
    console.log('✅ Continuous sync started successfully');
    
    // Store replicator instance for later use
    (window as any).__replicator = replicator;
    
    return replicator;
  } catch (syncError) {
    console.error('⚠️ Continuous sync setup failed:', syncError);
    return null;
  }
}

async function bootstrap() {
  try {
    console.log('🚀 Bootstrapping application...');
    
    // Check if user has stored credentials
    const credentials = getStoredCredentials();
    
    let db: RetailDatabase | null = null;
    
    if (credentials) {
      // User is logged in - initialize database with their storeId
      console.log('🔑 Found stored credentials for store:', credentials.storeId);
      db = await initializeDatabase(credentials.storeId);
      console.log('✅ Database initialized for', credentials.storeId);
    } else {
      // No credentials - database will be initialized after login
      console.log('📝 No stored credentials - database will initialize after login');
    }
    
    // Render app
    const rootElement = document.getElementById("root");
    if (rootElement && !rootElement.innerHTML) {
      const root = createRoot(rootElement);
      root.render(
        <StrictMode>
          {db ? (
            <DatabaseProvider db={db}>
              <App />
            </DatabaseProvider>
          ) : (
            <App />
          )}
        </StrictMode>
      );
    }
  } catch (error) {
    console.error('❌ Bootstrap failed:', error);
    throw error;
  }
}

void bootstrap();
