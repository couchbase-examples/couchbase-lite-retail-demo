import React, {
  ReactNode, createContext, useContext, useMemo, useRef, useState,
} from 'react';
import { AppConfig } from '../models/AppConfig';
import { User } from '../models/User';
import { DatabaseService } from '../services/database';
import { SyncService, SyncState } from '../services/sync';
import { LoginResult, login as authLogin } from '../services/auth';

interface AppContextValue {
  user: User | null;
  config: AppConfig | null;
  db: DatabaseService;
  sync: SyncService;
  syncState: SyncState;
  login: (username: string, password: string) => Promise<LoginResult>;
  logout: () => Promise<void>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp() called outside AppProvider');
  return ctx;
}

interface AppProviderProps { children: ReactNode; }

/**
 * Top-level provider that owns the singleton DatabaseService and
 * SyncService, plus current-user state. Anywhere in the React tree can
 * call useApp() to grab them.
 */
export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const dbRef = useRef<DatabaseService>(new DatabaseService());
  const syncRef = useRef<SyncService | null>(null);
  if (!syncRef.current) syncRef.current = new SyncService(dbRef.current);

  const [user, setUser] = useState<User | null>(null);
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [syncState, setSyncState] = useState<SyncState>('STOPPED');

  // Wire the sync state listener once.
  const wiredRef = useRef(false);
  if (!wiredRef.current) {
    wiredRef.current = true;
    syncRef.current.onStateChanged(setSyncState);
  }

  const value = useMemo<AppContextValue>(() => ({
    user, config,
    db: dbRef.current, sync: syncRef.current!,
    syncState,
    login: async (username, password) => {
      const result = authLogin(username, password);
      if (!result.success || !result.config) return result;
      try {
        await dbRef.current.openFor(result.config);
        await syncRef.current!.start(result.config);
        setUser(result.user!);
        setConfig(result.config);
        return result;
      } catch (e: unknown) {
        console.error('[AppProvider] login failed', e);
        return {
          success: false,
          errorMessage: e instanceof Error ? e.message : String(e),
        };
      }
    },
    logout: async () => {
      try { await syncRef.current!.stop(); } catch { /* ignore */ }
      try { await dbRef.current.close(); } catch { /* ignore */ }
      setUser(null); setConfig(null); setSyncState('STOPPED');
    },
  }), [user, config, syncState]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
