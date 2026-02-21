/**
 * useDataCache — Lightweight in-memory fetch cache for Supabase queries.
 *
 * POLICY: Real-time DB access only during active dosing sessions (timer running).
 * Everything else uses this hook with a 5-minute default TTL.
 *
 * Usage:
 *   const { data, loading, error, refetch } = useDataCache(
 *     'my-cache-key',
 *     () => supabase.from('my_table').select('*'),
 *     { ttl: 5 * 60 * 1000 }  // optional, defaults to 5 min
 *   );
 */

import { useState, useEffect, useRef, useCallback } from 'react';

interface CacheEntry<T> {
    data: T;
    fetchedAt: number;
}

// Module-level cache — survives component remounts, cleared on logout
const cache = new Map<string, CacheEntry<unknown>>();

interface UseDataCacheOptions {
    ttl?: number;      // ms — default 5 minutes
    enabled?: boolean; // set false to skip entirely
    manual?: boolean;  // if true, only fetches when refetch() is called explicitly
}

interface UseDataCacheResult<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
    refetch: () => void;
    lastFetchedAt: Date | null;
}

export function useDataCache<T>(
    key: string,
    fetcher: () => Promise<{ data: T | null; error: unknown }>,
    options: UseDataCacheOptions = {}
): UseDataCacheResult<T> {
    const { ttl = 5 * 60 * 1000, enabled = true, manual = false } = options;

    const [data, setData] = useState<T | null>(() => {
        const cached = cache.get(key);
        return cached ? (cached.data as T) : null;
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [lastFetchedAt, setLastFetchedAt] = useState<Date | null>(() => {
        const cached = cache.get(key);
        return cached ? new Date(cached.fetchedAt) : null;
    });

    const mountedRef = useRef(true);

    const fetchData = useCallback(async (forceRefresh = false) => {
        if (!enabled) return;

        // Serve from cache if still fresh
        const cached = cache.get(key);
        const now = Date.now();
        if (!forceRefresh && cached && (now - cached.fetchedAt) < ttl) {
            setData(cached.data as T);
            setLastFetchedAt(new Date(cached.fetchedAt));
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const { data: result, error: fetchError } = await fetcher();
            if (!mountedRef.current) return;

            if (fetchError) throw new Error(String(fetchError));

            cache.set(key, { data: result, fetchedAt: Date.now() });
            setData(result);
            setLastFetchedAt(new Date());
        } catch (err) {
            if (!mountedRef.current) return;
            setError(err instanceof Error ? err.message : 'Fetch failed');
        } finally {
            if (mountedRef.current) setLoading(false);
        }
    }, [key, ttl, enabled]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        mountedRef.current = true;
        if (!manual) fetchData();
        return () => { mountedRef.current = false; };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps — intentional: mount-only

    const refetch = useCallback(() => fetchData(true), [fetchData]);

    return { data, loading, error, refetch, lastFetchedAt };
}

/**
 * clearDataCache — Call on logout to wipe all cached data.
 * Optionally pass a key to clear only one entry.
 */
export function clearDataCache(key?: string): void {
    if (key) {
        cache.delete(key);
    } else {
        cache.clear();
    }
}
