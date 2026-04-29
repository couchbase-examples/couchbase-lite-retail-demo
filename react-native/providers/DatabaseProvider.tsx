import React, { useState, useRef, ReactNode, useMemo, useEffect, useCallback } from 'react';
import { DatabaseService, SyncStatus } from '@/services/database.service';
import DatabaseContext from './DatabaseContext';
import { StoreConfig } from '@/models/AppConfig';

type DatabaseProviderProps = {
    children: ReactNode;
    storeConfig: StoreConfig;
};

const DatabaseProvider: React.FC<DatabaseProviderProps> = ({ children, storeConfig }) => {
    const dbServiceRef = useRef<DatabaseService>(new DatabaseService());
    const [syncStatus, setSyncStatus] = useState<SyncStatus>('stopped');
    const [isDbReady, setIsDbReady] = useState(false);
    const [initError, setInitError] = useState<Error | null>(null);
    // Bumping this counter triggers re-init via the effect dependency array.
    const [retryCount, setRetryCount] = useState(0);
    /**
     * Tracks the last `closeDatabase()` promise so the next initialization
     * attempt can wait for it to settle before opening the database again.
     * Without this, retries (or rapid storeConfig swaps) could begin opening
     * a fresh database while the previous instance is still being closed,
     * which can fail with file-locking errors on iOS/Android.
     */
    const closePromiseRef = useRef<Promise<void>>(Promise.resolve());

    useEffect(() => {
        const dbService = dbServiceRef.current;
        let cancelled = false;

        const initialize = async () => {
            // Reset state so a retry shows the spinner instead of a stale error.
            setIsDbReady(false);
            setInitError(null);

            // Wait for any in-flight close from the previous effect run
            // before opening the database again. The cleanup callback can't
            // be async, so we hand its promise off via a ref and await it
            // here at the start of the next effect.
            try {
                await closePromiseRef.current;
            } catch {
                /* close errors are already logged in the cleanup callback */
            }
            if (cancelled) return;

            try {
                dbService.onSyncStatusChange((status) => {
                    if (!cancelled) setSyncStatus(status);
                });

                await dbService.initializeDatabase(storeConfig);
                if (cancelled) return;
                setIsDbReady(true);
                console.log('[DatabaseProvider] Database initialized successfully');
            } catch (error) {
                console.error('[DatabaseProvider] Failed to initialize database:', error);
                if (!cancelled) {
                    setInitError(error instanceof Error ? error : new Error(String(error)));
                }
            }
        };

        initialize();

        return () => {
            cancelled = true;
            // Capture the close promise so the next effect run can await it.
            closePromiseRef.current = dbService.closeDatabase().catch(e => {
                console.error('[DatabaseProvider] Cleanup error:', e);
            });
        };
    }, [storeConfig, retryCount]);

    const retryInit = useCallback(() => {
        setRetryCount(c => c + 1);
    }, []);

    const value = useMemo(
        () => ({
            databaseService: dbServiceRef.current,
            syncStatus,
            isDbReady,
            initError,
            retryInit,
        }),
        [syncStatus, isDbReady, initError, retryInit],
    );

    return (
        <DatabaseContext.Provider value={value}>
            {children}
        </DatabaseContext.Provider>
    );
};

export default DatabaseProvider;
