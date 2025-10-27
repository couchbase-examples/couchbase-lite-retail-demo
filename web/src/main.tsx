import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initializeDatabase } from "./lib/database/initDatabase";
import { DatabaseProvider } from "./lib/database/DatabaseProvider";
import { setupSync } from "./lib/database/sync";
import { getStoredCredentials, getAppEndpointUrl } from "./lib/auth";
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
  
  const syncUrl = getAppEndpointUrl(credentials.storeId);
  console.log('📡 Sync URL:', syncUrl);
  
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
    
    // Initialize database
    const db = await initializeDatabase();
    console.log('✅ Database initialized');
    
    // Note: Continuous sync will be started AFTER successful login
    // The Login page will perform one-shot profile sync, then Dashboard will start continuous sync
    console.log('📝 Sync will start after user authentication');
    
    // Render app
    const rootElement = document.getElementById("root");
    if (rootElement && !rootElement.innerHTML) {
      const root = createRoot(rootElement);
      root.render(
        <StrictMode>
          <DatabaseProvider db={db}>
            <App />
          </DatabaseProvider>
        </StrictMode>
      );
    }
  } catch (error) {
    console.error('❌ Bootstrap failed:', error);
    throw error;
  }
}

void bootstrap();
