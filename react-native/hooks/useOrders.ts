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
    /**
     * Optional order status to filter by (e.g. "In Review", "Approved",
     * "Submitted"). When `undefined` or empty, all orders are returned.
     * The filter is applied at the SQL++ level so that pagination works
     * across the *filtered* result set — switching tabs to "In Review"
     * will still surface items that live beyond the first page.
     */
    status?: string;
};

/**
 * Owns orders fetching, listener wiring, and pagination for the orders
 * screen. The screen passes its currently-selected status filter (if any)
 * and the hook re-runs the query whenever it changes.
 *
 * Concurrency: same "latest request id" pattern as {@link useInventory}.
 */
export function useOrders({
    databaseService,
    isDbReady,
    pageSize = DEFAULT_PAGE_SIZE,
    status,
}: Args): UseOrdersResult {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState<OrdersError | null>(null);

    const offsetRef = useRef(0);
    const statusRef = useRef<string | undefined>(status);
    const reloadIdRef = useRef(0);
    const isLoadingMoreRef = useRef(false);

    const ready = isDbReady && !!databaseService;

    const fetchPage = useCallback(
        async (offset: number, statusFilter: string | undefined): Promise<Order[]> => {
            if (!databaseService) return [];
            return databaseService.getOrders(pageSize, offset, statusFilter);
        },
        [databaseService, pageSize],
    );

    const reload = useCallback(
        async (statusFilter: string | undefined, opts: { manual?: boolean } = {}) => {
            if (!ready) return;
            const requestId = ++reloadIdRef.current;
            if (opts.manual) setIsRefreshing(true);
            try {
                const data = await fetchPage(0, statusFilter);
                if (reloadIdRef.current !== requestId) return;
                setOrders(data);
                offsetRef.current = data.length;
                setHasMore(data.length >= pageSize);
                setError(null);
            } catch (e) {
                if (reloadIdRef.current !== requestId) return;
                console.error('[useOrders] reload error', e);
                setError({ op: 'load', error: toError(e) });
            } finally {
                if (reloadIdRef.current === requestId) {
                    setIsLoading(false);
                    if (opts.manual) setIsRefreshing(false);
                }
            }
        },
        [ready, fetchPage, pageSize],
    );

    const loadMore = useCallback(async () => {
        if (!ready || !hasMore || isLoadingMoreRef.current) return;
        const issuedAtId = reloadIdRef.current;
        const issuedAtOffset = offsetRef.current;
        const issuedAtStatus = statusRef.current;

        isLoadingMoreRef.current = true;
        setIsLoadingMore(true);
        try {
            const next = await fetchPage(issuedAtOffset, issuedAtStatus);
            if (reloadIdRef.current !== issuedAtId) return;
            if (next.length > 0) {
                setOrders(prev => prev.concat(next));
                offsetRef.current = issuedAtOffset + next.length;
            }
            setHasMore(next.length >= pageSize);
        } catch (e) {
            if (reloadIdRef.current !== issuedAtId) return;
            console.error('[useOrders] loadMore error', e);
            setError({ op: 'load', error: toError(e) });
        } finally {
            isLoadingMoreRef.current = false;
            setIsLoadingMore(false);
        }
    }, [ready, hasMore, fetchPage, pageSize]);

    // Keep the ref in lock-step with the prop so listener/foreground refreshes
    // always fetch the currently-selected filter.
    useEffect(() => {
        statusRef.current = status;
    }, [status]);

    // Reload from page 0 when readiness or status changes.
    useEffect(() => {
        if (ready) {
            setIsLoading(true);
            reload(status);
        } else {
            setOrders([]);
            offsetRef.current = 0;
            setHasMore(true);
        }
    }, [ready, reload, status]);

    const registerOrdersListener = useMemo(() => {
        if (!databaseService) return undefined;
        return (cb: () => void) => databaseService.addOrdersChangeListener(cb);
    }, [databaseService]);

    useCollectionListener(
        registerOrdersListener,
        () => { reload(statusRef.current); },
        { enabled: ready, debounceMs: 300, label: 'orders' },
    );

    useAppStateRefresh(
        () => { if (ready) reload(statusRef.current); },
        { enabled: ready },
    );

    const refresh = useCallback(async () => {
        await reload(statusRef.current, { manual: true });
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
