import { useCallback, useEffect, useMemo, useState } from 'react';
import { DatabaseService } from '@/services/database.service';
import { StoreProfile } from '@/models/StoreProfile';
import { useCollectionListener } from './useCollectionListener';
import { useAppStateRefresh } from './useAppStateRefresh';

export type StoreProfileError = {
    op: 'load';
    error: Error;
};

export type UseStoreProfileResult = {
    profile: StoreProfile | null;
    isLoading: boolean;
    isRefreshing: boolean;
    error: StoreProfileError | null;
    clearError: () => void;
    refresh: () => Promise<void>;
};

type Args = {
    databaseService: DatabaseService | undefined;
    isDbReady: boolean;
};

/**
 * Loads the current store's profile document and re-fetches it when:
 *   - the database becomes ready,
 *   - App Services pushes a change to the profile collection,
 *   - or the app returns to the foreground.
 *
 * The screen using this hook is just a presentation layer.
 */
export function useStoreProfile({ databaseService, isDbReady }: Args): UseStoreProfileResult {
    const [profile, setProfile] = useState<StoreProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState<StoreProfileError | null>(null);

    const ready = isDbReady && !!databaseService;

    const load = useCallback(async (opts: { manual?: boolean } = {}) => {
        if (!ready) return;
        if (opts.manual) setIsRefreshing(true);
        try {
            const data = await databaseService!.getStoreProfile();
            setProfile(data);
            setError(null);
        } catch (e) {
            console.error('[useStoreProfile] load error', e);
            setError({ op: 'load', error: toError(e) });
        } finally {
            setIsLoading(false);
            if (opts.manual) setIsRefreshing(false);
        }
    }, [ready, databaseService]);

    useEffect(() => {
        if (ready) {
            setIsLoading(true);
            load();
        } else {
            setProfile(null);
        }
    }, [ready, load]);

    const registerProfileListener = useMemo(() => {
        if (!databaseService) return undefined;
        return (cb: () => void) => databaseService.addProfileChangeListener(cb);
    }, [databaseService]);

    useCollectionListener(
        registerProfileListener,
        () => { load(); },
        [],
        { enabled: ready, debounceMs: 300, label: 'profile' },
    );

    useAppStateRefresh(
        () => { if (ready) load(); },
        { enabled: ready },
    );

    const refresh = useCallback(async () => {
        await load({ manual: true });
    }, [load]);

    const clearError = useCallback(() => setError(null), []);

    return { profile, isLoading, isRefreshing, error, clearError, refresh };
}

function toError(e: unknown): Error {
    return e instanceof Error ? e : new Error(String(e));
}
