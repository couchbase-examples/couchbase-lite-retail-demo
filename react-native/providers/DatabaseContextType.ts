import { DatabaseService, SyncStatus } from '@/services/database.service';

export type DatabaseContextType = {
    databaseService: DatabaseService;
    syncStatus: SyncStatus;
    isDbReady: boolean;
};
