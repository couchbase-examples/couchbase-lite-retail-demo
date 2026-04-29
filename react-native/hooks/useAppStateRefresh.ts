import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';

type Options = {
    /** Skip the subscription entirely when false. */
    enabled?: boolean;
    /**
     * Minimum time (ms) the app must have been backgrounded before we treat
     * a foreground transition as "needs refresh". Keeps quick app switches
     * from triggering a flood of queries. Default 2s.
     */
    minBackgroundedMs?: number;
};

/**
 * Calls {@code onForeground} whenever the app transitions back to the
 * 'active' state from 'background' or 'inactive'. The screen using this hook
 * decides what "refresh" means — typically calling its data-loading callback.
 *
 * Only one listener is registered per component instance, and it is cleaned
 * up automatically. The `onForeground` reference does not need to be stable
 * across renders — we proxy it through a ref so every render's callback is
 * picked up without re-subscribing.
 */
export function useAppStateRefresh(
    onForeground: () => void,
    options: Options = {},
): void {
    const { enabled = true, minBackgroundedMs = 2000 } = options;
    const callbackRef = useRef(onForeground);
    callbackRef.current = onForeground;

    useEffect(() => {
        if (!enabled) return;

        let lastState: AppStateStatus = AppState.currentState;
        let backgroundedAt: number | null = null;

        const handleChange = (next: AppStateStatus) => {
            const prev = lastState;
            lastState = next;

            if (next !== 'active' && (prev === 'active' || prev === 'unknown')) {
                backgroundedAt = Date.now();
                return;
            }

            if (next === 'active' && prev !== 'active') {
                const elapsed = backgroundedAt ? Date.now() - backgroundedAt : Infinity;
                backgroundedAt = null;
                if (elapsed >= minBackgroundedMs) {
                    callbackRef.current();
                }
            }
        };

        const sub = AppState.addEventListener('change', handleChange);
        return () => {
            sub.remove();
        };
    }, [enabled, minBackgroundedMs]);
}
