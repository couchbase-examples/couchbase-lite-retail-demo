import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initializeDatabase } from "./lib/database/initDatabase";
import { DatabaseProvider } from "./lib/database/DatabaseProvider";
import { setupSync } from "./lib/database/sync";

async function bootstrap() {
  try {
    console.log('🚀 Bootstrapping application...');
    
    // Initialize database
    const db = await initializeDatabase();
    console.log('✅ Database initialized');
    
    // Set up sync if configured
    const syncUrl = import.meta.env.VITE_SYNC_GATEWAY_URL;
    const syncUsername = import.meta.env.VITE_SYNC_USERNAME;
    const syncPassword = import.meta.env.VITE_SYNC_PASSWORD;
    const enableSync = import.meta.env.VITE_ENABLE_SYNC !== 'false';
    
    if (syncUrl && syncUsername && syncPassword && enableSync) {
      console.log('🔄 Starting sync with Capella App Services...');
      console.log('📡 Sync Gateway URL:', syncUrl);
      
      try {
        const replicator = setupSync(db, {
          url: syncUrl,
          username: syncUsername,
          password: syncPassword,
        });
        
        console.log('✅ Sync configured successfully');
        
        // Store replicator instance for later use
        (window as any).__replicator = replicator;
      } catch (syncError) {
        console.error('⚠️ Sync setup failed:', syncError);
        console.log('Continuing in offline-only mode');
      }
    } else {
      console.log('⚠️ Sync not configured - running in offline-only mode');
      if (!syncUrl) console.log('   Missing: VITE_SYNC_GATEWAY_URL');
      if (!syncUsername) console.log('   Missing: VITE_SYNC_USERNAME');
      if (!syncPassword) console.log('   Missing: VITE_SYNC_PASSWORD');
    }
    
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
