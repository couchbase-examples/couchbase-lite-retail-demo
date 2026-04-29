import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DatabaseService } from '@/services/database.service';
import { GroceryItem } from '@/models/GroceryItem';
import { debounce } from '@/util/debounce';
import { useCollectionListener } from './useCollectionListener';
import { useAppStateRefresh } from './useAppStateRefresh';

const DEFAULT_PAGE_SIZE = 50;
const SEARCH_DEBOUNCE_MS = 400;

export type InventoryError = {
    /** Where the failure happened — useful for routing UI messages. */
    op: 'load' | 'search' | 'updateStock' | 'createOrder';
    error: Error;
};

export type UseInventoryResult = {
    items: GroceryItem[];
    /** True only on the very first load (used for the full-screen spinner). */
    isLoading: boolean;
    /** True when a manual pull-to-refresh is in flight. */
    isRefreshing: boolean;
    /** True when an additional page is being appended via {@link loadMore}. */
    isLoadingMore: boolean;
    /**
     * False once a query returned fewer rows than the page size — the host
     * component should hide the FlatList footer spinner when this is false.
     */
    hasMore: boolean;
    search: string;
    setSearch: (term: string) => void;
    error: InventoryError | null;
    /** Clear the current error. Called by the retry button. */
    clearError: () => void;
    /** Pull-to-refresh: rerun the current query from offset 0. */
    refresh: () => Promise<void>;
    /** Append the next page. No-op while another page is loading. */
    loadMore: () => Promise<void>;
    incrementStock: (item: GroceryItem) => Promise<void>;
    decrementStock: (item: GroceryItem) => Promise<void>;
    createOrder: (item: GroceryItem, qty: number) => Promise<boolean>;
};

type Args = {
    databaseService: DatabaseService | undefined;
    isDbReady: boolean;
    /** Defaults to 50. */
    pageSize?: number;
};

/**
 * Owns inventory data fetching, search, listener wiring, and stock mutations
 * for the inventory screen. Uses {@link useCollectionListener} for change
 * detection and {@link useAppStateRefresh} so the screen reloads when the
 * app returns to the foreground.
 *
 * Pagination contract:
 *   - `refresh()` re-fetches the first page and resets `hasMore`.
 *   - `loadMore()` appends the next page using LIMIT/OFFSET.
 *   - When the user types in the search box we always reset to page 0.
 */
export function useInventory({
    databaseService,
    isDbReady,
    pageSize = DEFAULT_PAGE_SIZE,
}: Args): UseInventoryResult {
    const [items, setItems] = useState<GroceryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [search, setSearchState] = useState('');
    const [error, setError] = useState<InventoryError | null>(null);

    const offsetRef = useRef(0);
    const searchRef = useRef('');
    const isQueryingRef = useRef(false);

    const ready = isDbReady && !!databaseService;

    const fetchPage = useCallback(
        async (offset: number, term: string): Promise<GroceryItem[]> => {
            if (!databaseService) return [];
            return term.length > 0
                ? databaseService.searchInventory(term, pageSize, offset)
                : databaseService.getInventoryItems(pageSize, offset);
        },
        [databaseService, pageSize],
    );

    const reload = useCallback(
        async (term: string, opts: { manual?: boolean } = {}) => {
            if (!ready) return;
            if (isQueryingRef.current) return;
            isQueryingRef.current = true;

            if (opts.manual) setIsRefreshing(true);
            try {
                const data = await fetchPage(0, term);
                setItems(data);
                offsetRef.current = data.length;
                setHasMore(data.length >= pageSize);
                setError(null);
            } catch (e) {
                console.error('[useInventory] reload error', e);
                setError({ op: term ? 'search' : 'load', error: toError(e) });
            } finally {
                isQueryingRef.current = false;
                setIsLoading(false);
                if (opts.manual) setIsRefreshing(false);
            }
        },
        [ready, fetchPage, pageSize],
    );

    const loadMore = useCallback(async () => {
        if (!ready || !hasMore || isLoadingMore || isQueryingRef.current) return;
        isQueryingRef.current = true;
        setIsLoadingMore(true);
        try {
            const next = await fetchPage(offsetRef.current, searchRef.current);
            if (next.length > 0) {
                setItems(prev => prev.concat(next));
                offsetRef.current += next.length;
            }
            setHasMore(next.length >= pageSize);
        } catch (e) {
            console.error('[useInventory] loadMore error', e);
            setError({ op: 'load', error: toError(e) });
        } finally {
            isQueryingRef.current = false;
            setIsLoadingMore(false);
        }
    }, [ready, hasMore, isLoadingMore, fetchPage, pageSize]);

    // Initial load + reset whenever the database becomes ready.
    useEffect(() => {
        if (ready) {
            setIsLoading(true);
            reload('');
        } else {
            setItems([]);
            offsetRef.current = 0;
            setHasMore(true);
        }
    }, [ready, reload]);

    // Debounced search. We wrap reload in a debounced helper that fires on
    // the trailing edge — fast typing won't queue a query per keystroke.
    const debouncedSearchRun = useMemo(
        () => debounce((term: string) => { reload(term); }, SEARCH_DEBOUNCE_MS),
        [reload],
    );

    const setSearch = useCallback((term: string) => {
        setSearchState(term);
        searchRef.current = term;
        debouncedSearchRun(term);
    }, [debouncedSearchRun]);

    // Collection listener: refresh the current page when sync writes land.
    const registerInventoryListener = useMemo(() => {
        if (!databaseService) return undefined;
        return (cb: () => void) => databaseService.addInventoryChangeListener(cb);
    }, [databaseService]);

    useCollectionListener(
        registerInventoryListener,
        () => { reload(searchRef.current); },
        [],
        { enabled: ready, debounceMs: 300, label: 'inventory' },
    );

    // Foreground refresh.
    useAppStateRefresh(
        () => { if (ready) reload(searchRef.current); },
        { enabled: ready },
    );

    const refresh = useCallback(async () => {
        await reload(searchRef.current, { manual: true });
    }, [reload]);

    const incrementStock = useCallback(async (item: GroceryItem) => {
        if (!databaseService) return;
        try {
            await databaseService.updateStockQuantity(item.id, item.stockQty + 1);
            // Optimistic update; sync listener will reconcile shortly.
            setItems(prev =>
                prev.map(i => (i.id === item.id ? { ...i, stockQty: i.stockQty + 1 } : i)),
            );
        } catch (e) {
            console.error('[useInventory] increment error', e);
            setError({ op: 'updateStock', error: toError(e) });
        }
    }, [databaseService]);

    const decrementStock = useCallback(async (item: GroceryItem) => {
        if (!databaseService || item.stockQty <= 0) return;
        try {
            await databaseService.updateStockQuantity(item.id, item.stockQty - 1);
            setItems(prev =>
                prev.map(i => (i.id === item.id ? { ...i, stockQty: i.stockQty - 1 } : i)),
            );
        } catch (e) {
            console.error('[useInventory] decrement error', e);
            setError({ op: 'updateStock', error: toError(e) });
        }
    }, [databaseService]);

    const createOrder = useCallback(async (item: GroceryItem, qty: number) => {
        if (!databaseService) return false;
        try {
            await databaseService.createOrder(item, qty);
            return true;
        } catch (e) {
            console.error('[useInventory] createOrder error', e);
            setError({ op: 'createOrder', error: toError(e) });
            return false;
        }
    }, [databaseService]);

    const clearError = useCallback(() => setError(null), []);

    return {
        items,
        isLoading,
        isRefreshing,
        isLoadingMore,
        hasMore,
        search,
        setSearch,
        error,
        clearError,
        refresh,
        loadMore,
        incrementStock,
        decrementStock,
        createOrder,
    };
}

function toError(e: unknown): Error {
    return e instanceof Error ? e : new Error(String(e));
}
