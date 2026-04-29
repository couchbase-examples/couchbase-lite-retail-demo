import { useEffect, useRef } from 'react';

/**
 * Couchbase Lite returns a listener token shaped like `{ remove: () => Promise<void> }`.
 * We intentionally keep this loose — `cbl-reactnative` doesn't export the token type
 * and the only thing we ever do with it is call `.remove()`.
 */
type ListenerToken = { remove: () => Promise<void> } | undefined | null;

type RegisterFn = (cb: () => void) => Promise<ListenerToken>;

type UseCollectionListenerOptions = {
    /** Skip registration entirely when false. */
    enabled?: boolean;
    /**
     * Debounce delay (ms) before invoking `onChange`. Helps avoid rapid
     * re-queries while sync is streaming a burst of updates.
     */
    debounceMs?: number;
    /**
     * Optional tag used in console.warn messages so multiple listeners stay
     * distinguishable in logs.
     */
    label?: string;
};

/**
 * Subscribes to a Couchbase Lite collection change listener for as long as
 * the host component is mounted.
 *
 * Handles three subtle correctness issues we hit when each screen wrote its
 * own listener wiring:
 *  1. The component can unmount before the async `register` Promise resolves.
 *     If it does, we still need to remove the (now stale) token.
 *  2. The change event can fire dozens of times per second during initial
 *     replication; debounce keeps the UI snappy.
 *  3. Listener tokens MUST be removed before `database.close()` runs, otherwise
 *     `cbl-reactnative` logs "orphaned callback" warnings on logout.
 *
 * The hook accepts a `register` callback rather than the collection itself so
 * each screen can stay decoupled from the {@link DatabaseService} internals.
 *
 * `onChange` is read through a ref, so callers don't need to memoise it; the
 * hook only re-subscribes when `register` (the function that creates the
 * listener) actually changes. If a caller needs the subscription to restart
 * for some other reason, they can vary the `register` reference itself.
 */
export function useCollectionListener(
    register: RegisterFn | undefined | null,
    onChange: () => void,
    options: UseCollectionListenerOptions = {},
): void {
    const { enabled = true, debounceMs = 300, label = 'collection' } = options;

    // Stash the latest `onChange` in a ref so we don't re-subscribe every
    // time the parent component re-renders with a new closure.
    const onChangeRef = useRef(onChange);
    onChangeRef.current = onChange;

    useEffect(() => {
        if (!enabled || !register) return;

        let cancelled = false;
        let timer: ReturnType<typeof setTimeout> | null = null;
        let token: ListenerToken = null;

        const fire = () => {
            if (cancelled) return;
            if (timer) clearTimeout(timer);
            timer = setTimeout(() => {
                if (cancelled) return;
                onChangeRef.current();
            }, Math.max(0, debounceMs));
        };

        const subscribe = async () => {
            try {
                const t = await register(fire);
                if (cancelled) {
                    // Component unmounted before subscribe finished; clean up immediately.
                    if (t && typeof t.remove === 'function') {
                        await t.remove().catch((e: unknown) =>
                            console.warn(`[useCollectionListener:${label}] late remove error`, e),
                        );
                    }
                    return;
                }
                token = t;
            } catch (e) {
                console.warn(`[useCollectionListener:${label}] subscribe failed`, e);
            }
        };

        subscribe();

        return () => {
            cancelled = true;
            if (timer) clearTimeout(timer);
            if (token && typeof token.remove === 'function') {
                token.remove().catch((e: unknown) =>
                    console.warn(`[useCollectionListener:${label}] remove error`, e),
                );
            }
            token = null;
        };
    }, [enabled, register, debounceMs, label]);
}
