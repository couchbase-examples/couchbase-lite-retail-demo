import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DatabaseService } from '@/services/database.service';
import { Order } from '@/models/Order';
import { useCollectionListener } from './useCollectionListener';
import { useAppStateRefresh } from './useAppStateRefresh';

const DEFAULT_PAGE_SIZE = 50;

export type OrdersError = {
    op: 'load';
    error: Error;
};

export type UseOrdersResult = {
    orders: Order[];
    isLoading: boolean;
    isRefreshing: boolean;
    isLoadingMore: boolean;
    hasMore: boolean;
    error: OrdersError | null;
    clearError: () => void;
    refresh: () => Promise<void>;
    loadMore: () => Promise<void>;
};

type Args = {
    databaseService: DatabaseService | undefined;
    isDbReady: boolean;
    pageSize?: number;
};

/**
 * Owns orders fetching, listener wiring, and pagination for the orders
 * screen. Filtering by status stays in the screen since it is a local view
 * concern and we don't want to page server-side by status.
 */
export function useOrders({
    databaseService,
    isDbReady,
    pageSize = DEFAULT_PAGE_SIZE,
}: Args): UseOrdersResult {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState<OrdersError | null>(null);

    const offsetRef = useRef(0);
    const isQueryingRef = useRef(false);

    const ready = isDbReady && !!databaseService;

    const fetchPage = useCallback(async (offset: number): Promise<Order[]> => {
        if (!databaseService) return [];
        return databaseService.getOrders(pageSize, offset);
    }, [databaseService, pageSize]);

    const reload = useCallback(async (opts: { manual?: boolean } = {}) => {
        if (!ready) return;
        if (isQueryingRef.current) return;
        isQueryingRef.current = true;

        if (opts.manual) setIsRefreshing(true);
        try {
            const data = await fetchPage(0);
            setOrders(data);
            offsetRef.current = data.length;
            setHasMore(data.length >= pageSize);
            setError(null);
        } catch (e) {
            console.error('[useOrders] reload error', e);
            setError({ op: 'load', error: toError(e) });
        } finally {
            isQueryingRef.current = false;
            setIsLoading(false);
            if (opts.manual) setIsRefreshing(false);
        }
    }, [ready, fetchPage, pageSize]);

    const loadMore = useCallback(async () => {
        if (!ready || !hasMore || isLoadingMore || isQueryingRef.current) return;
        isQueryingRef.current = true;
        setIsLoadingMore(true);
        try {
            const next = await fetchPage(offsetRef.current);
            if (next.length > 0) {
                setOrders(prev => prev.concat(next));
                offsetRef.current += next.length;
            }
            setHasMore(next.length >= pageSize);
        } catch (e) {
            console.error('[useOrders] loadMore error', e);
            setError({ op: 'load', error: toError(e) });
        } finally {
            isQueryingRef.current = false;
            setIsLoadingMore(false);
        }
    }, [ready, hasMore, isLoadingMore, fetchPage, pageSize]);

    useEffect(() => {
        if (ready) {
            setIsLoading(true);
            reload();
        } else {
            setOrders([]);
            offsetRef.current = 0;
            setHasMore(true);
        }
    }, [ready, reload]);

    const registerOrdersListener = useMemo(() => {
        if (!databaseService) return undefined;
        return (cb: () => void) => databaseService.addOrdersChangeListener(cb);
    }, [databaseService]);

    useCollectionListener(
        registerOrdersListener,
        () => { reload(); },
        [],
        { enabled: ready, debounceMs: 300, label: 'orders' },
    );

    useAppStateRefresh(
        () => { if (ready) reload(); },
        { enabled: ready },
    );

    const refresh = useCallback(async () => {
        await reload({ manual: true });
    }, [reload]);

    const clearError = useCallback(() => setError(null), []);

    return {
        orders,
        isLoading,
        isRefreshing,
        isLoadingMore,
        hasMore,
        error,
        clearError,
        refresh,
        loadMore,
    };
}

function toError(e: unknown): Error {
    return e instanceof Error ? e : new Error(String(e));
}
