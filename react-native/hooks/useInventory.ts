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
 *
 * Concurrency: `reload()` uses a "latest request" pattern — every call gets
 * a unique request id; only the latest request's results are applied to
 * state, so a slow query for the previous search term cannot clobber the UI
 * after the user has typed something newer. `loadMore()` is serialized via
 * its own flag so we never append the same page twice.
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
    /**
     * Monotonic counter used to identify the most recent reload() call.
     * Each call increments this and snapshots the value; only the call whose
     * snapshot still matches when its query resolves is allowed to apply
     * its results. Older in-flight queries silently drop their results.
     */
    const reloadIdRef = useRef(0);
    const isLoadingMoreRef = useRef(false);

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

            const requestId = ++reloadIdRef.current;
            if (opts.manual) setIsRefreshing(true);
            try {
                const data = await fetchPage(0, term);
                // If a newer reload has been issued in the meantime, drop these
                // stale results — the newer call will paint authoritative state.
                if (reloadIdRef.current !== requestId) return;
                setItems(data);
                offsetRef.current = data.length;
                setHasMore(data.length >= pageSize);
                setError(null);
            } catch (e) {
                if (reloadIdRef.current !== requestId) return;
                console.error('[useInventory] reload error', e);
                setError({ op: term ? 'search' : 'load', error: toError(e) });
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
        // Capture the request id at the moment loadMore was issued. If a
        // reload() runs between now and when our query resolves, the page
        // we fetched is for an outdated search/filter and must be discarded.
        const issuedAtId = reloadIdRef.current;
        const issuedAtOffset = offsetRef.current;
        const issuedAtTerm = searchRef.current;

        isLoadingMoreRef.current = true;
        setIsLoadingMore(true);
        try {
            const next = await fetchPage(issuedAtOffset, issuedAtTerm);
            if (reloadIdRef.current !== issuedAtId) return; // superseded
            if (next.length > 0) {
                setItems(prev => prev.concat(next));
                offsetRef.current = issuedAtOffset + next.length;
            }
            setHasMore(next.length >= pageSize);
        } catch (e) {
            if (reloadIdRef.current !== issuedAtId) return;
            console.error('[useInventory] loadMore error', e);
            setError({ op: 'load', error: toError(e) });
        } finally {
            isLoadingMoreRef.current = false;
            setIsLoadingMore(false);
        }
    }, [ready, hasMore, fetchPage, pageSize]);

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

    /**
     * Compute next quantity from the *latest* state inside the functional
     * setItems updater. This avoids race conditions when the user taps the
     * +/- button rapidly and the parent's `item` snapshot is stale.
     *
     * On DB failure we roll back the optimistic delta (not to a captured
     * absolute) using another functional update — this stays correct even
     * if a second successful tap landed in between, because we only undo
     * our own +1 contribution.
     */
    const incrementStock = useCallback(async (item: GroceryItem) => {
        if (!databaseService) return;
        let nextQty: number | null = null;
        setItems(prev => {
            const current = prev.find(i => i.id === item.id);
            const baseline = current?.stockQty ?? item.stockQty;
            nextQty = baseline + 1;
            return prev.map(i => (i.id === item.id ? { ...i, stockQty: nextQty as number } : i));
        });
        if (nextQty === null) return;
        try {
            await databaseService.updateStockQuantity(item.id, nextQty);
        } catch (e) {
            // Rollback the optimistic +1 so the UI reconverges with DB truth.
            setItems(prev => prev.map(i =>
                i.id === item.id ? { ...i, stockQty: Math.max(0, i.stockQty - 1) } : i,
            ));
            console.error('[useInventory] increment error', e);
            setError({ op: 'updateStock', error: toError(e) });
        }
    }, [databaseService]);

    const decrementStock = useCallback(async (item: GroceryItem) => {
        if (!databaseService) return;
        let nextQty: number | null = null;
        let appliedDelta = 0;
        setItems(prev => {
            const current = prev.find(i => i.id === item.id);
            const baseline = current?.stockQty ?? item.stockQty;
            if (baseline <= 0) return prev;
            nextQty = Math.max(0, baseline - 1);
            appliedDelta = baseline - nextQty; // 1 unless baseline was already 0
            return prev.map(i => (i.id === item.id ? { ...i, stockQty: nextQty as number } : i));
        });
        if (nextQty === null) return;
        try {
            await databaseService.updateStockQuantity(item.id, nextQty);
        } catch (e) {
            // Rollback the optimistic decrement so the UI reconverges with DB truth.
            const delta = appliedDelta;
            if (delta > 0) {
                setItems(prev => prev.map(i =>
                    i.id === item.id ? { ...i, stockQty: i.stockQty + delta } : i,
                ));
            }
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
