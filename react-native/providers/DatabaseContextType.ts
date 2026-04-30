import { DatabaseService, SyncStatus } from '@/services/database.service';

export type DatabaseContextType = {
    databaseService: DatabaseService;
    syncStatus: SyncStatus;
    isDbReady: boolean;
    /**
     * Error from {@link DatabaseService.initializeDatabase}. Set when the
     * database failed to open or replicator setup threw. UI should show a
     * banner with a retry button when this is non-null.
     */
    initError: Error | null;
    /**
     * Re-runs database initialization. Useful for retry buttons after an
     * initError is shown.
     */
    retryInit: () => void;
};
