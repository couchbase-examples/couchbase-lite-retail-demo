import React, { useState, useRef, ReactNode, useMemo, useEffect } from 'react';
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

    useEffect(() => {
        const dbService = dbServiceRef.current;

        const initialize = async () => {
            try {
                // Register sync status callback before initializing
                dbService.onSyncStatusChange((status) => {
                    setSyncStatus(status);
                });

                await dbService.initializeDatabase(storeConfig);
                setIsDbReady(true);
                console.log('[DatabaseProvider] Database initialized successfully');
            } catch (error) {
                console.error('[DatabaseProvider] Failed to initialize database:', error);
            }
        };

        initialize();

        // Cleanup on unmount (logout)
        return () => {
            dbService.closeDatabase().catch(e =>
                console.error('[DatabaseProvider] Cleanup error:', e)
            );
        };
    }, [storeConfig]);

    const value = useMemo(
        () => ({
            databaseService: dbServiceRef.current,
            syncStatus,
            isDbReady,
        }),
        [syncStatus, isDbReady],
    );

    return (
        <DatabaseContext.Provider value={value}>
            {children}
        </DatabaseContext.Provider>
    );
};

export default DatabaseProvider;
