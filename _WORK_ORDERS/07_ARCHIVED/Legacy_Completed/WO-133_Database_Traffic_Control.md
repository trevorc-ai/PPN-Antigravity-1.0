---
id: WO-133
title: "Database Traffic Control: Cache Layer + Manual Trigger Pattern"
status: 03_BUILD
owner: BUILDER
failure_count: 0
created: 2026-02-20
priority: high
tags: [performance, database, caching, supabase, useEffect, real-time, UX]
---

## USER DIRECTIVE (VERBATIM)

> "The only time we need to ping the database in real time is during an actual dosing session because that's when the timer is running and timestamps are important. But everything else can be manually triggered or cached."

---

## THE POLICY (ENFORCE THIS THROUGHOUT THE APP)

```
REAL-TIME DB ACCESS:   Wellness Journey — active dosing session (timer running) ONLY
CACHED (5 min TTL):    Analytics, Dashboard, MyProtocols, InteractionChecker,
                       ClinicianDirectory, DataExport, SearchPortal, ProfileEdit
MANUAL TRIGGER ONLY:   Any page where the user can click "Refresh" to reload
NO AUTO-POLLING:       Nowhere. Ever. Unless explicitly listed as real-time above.
```

This is a one-sentence engineering law: **"Real-time only when the timer is running."**

---

## CONTEXT

The application was rapid-firing Supabase queries during a live partner demo. Every page navigation triggered fresh database fetches with no caching, no deduplication, and no TTL. Root cause: bare `useEffect(() => { fetchData() }, [])` on 11 pages, with no cache layer and no React Query.

**No React Query is installed.** The fix uses a lightweight custom hook written once, applied selectively.

---

## LEAD ARCHITECTURE

**Approach:** Custom `useDataCache` hook — no new npm dependencies. Hook lives in `src/hooks/useDataCache.ts`. Applied to the highest-traffic pages first (Phase 1). Wellness Journey active session is explicitly excluded and remains live.

**Why not TanStack Query:** Adding React Query requires wrapping the entire app in a `QueryClientProvider` and refactoring every fetch. The custom hook approach achieves the same caching behavior with zero risk of breaking auth, routing, or the Wellness Journey flow. Can migrate to TanStack Query later if needed.

---

## PHASE 1: THE HOOK (create first)

### `src/hooks/useDataCache.ts`

```typescript
/**
 * useDataCache — Lightweight in-memory fetch cache for Supabase queries.
 *
 * POLICY: Real-time DB access only during active dosing sessions.
 * Everything else uses this hook with a 5-minute default TTL.
 *
 * Usage:
 *   const { data, loading, error, refetch } = useDataCache(
 *     'my-key',
 *     () => supabase.from('my_table').select('*'),
 *     { ttl: 5 * 60 * 1000 }  // optional, defaults to 5 min
 *   );
 */

import { useState, useEffect, useRef, useCallback } from 'react';

interface CacheEntry<T> {
    data: T;
    fetchedAt: number;
}

// Module-level cache — persists across component mounts during the session
const cache = new Map<string, CacheEntry<unknown>>();

interface UseDataCacheOptions {
    ttl?: number;           // ms, default 5 minutes
    enabled?: boolean;      // set false to skip fetching entirely
    manual?: boolean;       // if true, only fetches when refetch() is called
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

    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [lastFetchedAt, setLastFetchedAt] = useState<Date | null>(null);
    const mountedRef = useRef(true);

    const fetchData = useCallback(async (forceRefresh = false) => {
        if (!enabled) return;

        // Check cache first
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

            if (fetchError) {
                throw new Error(String(fetchError));
            }

            // Write to cache
            cache.set(key, { data: result, fetchedAt: Date.now() });
            setData(result);
            setLastFetchedAt(new Date());
        } catch (err) {
            if (!mountedRef.current) return;
            setError(err instanceof Error ? err.message : 'Fetch failed');
        } finally {
            if (mountedRef.current) setLoading(false);
        }
    }, [key, ttl, enabled, fetcher]);

    useEffect(() => {
        mountedRef.current = true;
        if (!manual) {
            fetchData();
        }
        return () => { mountedRef.current = false; };
    }, []);  // Only on mount — deliberate, this is the point

    const refetch = useCallback(() => fetchData(true), [fetchData]);

    return { data, loading, error, refetch, lastFetchedAt };
}

/**
 * clearDataCache — Call this on logout or when data must be invalidated.
 * Usage: clearDataCache() — clears all entries
 *        clearDataCache('my-key') — clears one entry
 */
export function clearDataCache(key?: string) {
    if (key) {
        cache.delete(key);
    } else {
        cache.clear();
    }
}
```

---

## PHASE 2: APPLY TO HIGH-TRAFFIC PAGES

Apply the hook to these pages in this priority order. **Do not change any Supabase query logic — only wrap the existing fetch in the hook.**

### Priority order and TTL settings:

| Page | Cache Key | TTL | Notes |
|------|-----------|-----|-------|
| `Analytics.tsx` | `'analytics-data'` | 5 min | Add "Refresh" button in header |
| `Dashboard.tsx` | `'dashboard-summary'` | 5 min | Most-visited page — biggest win |
| `MyProtocols.tsx` | `'my-protocols'` | 5 min | Add "Refresh" button |
| `InteractionChecker.tsx` | `'interaction-ref-data'` | 30 min | Reference data almost never changes |
| `ClinicianDirectory.tsx` | `'clinician-directory'` | 10 min | Slow-changing |
| `DataExport.tsx` | `'export-sessions'` | 5 min | Add "Refresh" button |
| `SearchPortal.tsx` | `'search-results'` | manual | `manual: true` — only fetches on Search button click |
| `ProfileEdit.tsx` | `'user-profile'` | 10 min | Profile data is stable |

### Pattern for each page (example — Analytics):

```tsx
// BEFORE (fires on every mount):
useEffect(() => {
    const fetchData = async () => {
        setLoading(true);
        const { data, error } = await supabase.from('clinical_records').select('...');
        setData(data);
        setLoading(false);
    };
    fetchData();
}, []);

// AFTER (cached 5 min, manual refresh available):
const { data, loading, error, refetch, lastFetchedAt } = useDataCache(
    'analytics-data',
    () => supabase.from('clinical_records').select('...'),
    { ttl: 5 * 60 * 1000 }
);
```

---

## PHASE 3: ADD REFRESH BUTTONS

For Analytics, Dashboard, MyProtocols, and DataExport — add a subtle "Refresh" button in the page header. Style consistent with the existing UI:

```tsx
// Refresh button pattern — add near page title
<button
    onClick={refetch}
    disabled={loading}
    title={lastFetchedAt ? `Last updated: ${lastFetchedAt.toLocaleTimeString()}` : 'Not loaded'}
    style={{
        background: 'transparent',
        border: '1px solid rgba(56,139,253,0.2)',
        color: '#6b7a8d',
        fontSize: 12,
        padding: '4px 10px',
        borderRadius: 6,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 4,
    }}
>
    {loading ? '...' : '↻ Refresh'}
</button>
```

Optional: show last-fetched timestamp as muted text: `Last updated 3 min ago`

---

## PHASE 4: CLEAR CACHE ON LOGOUT

In `AuthContext.tsx` (or wherever `signOut` is defined), call `clearDataCache()` on logout so the next user session starts fresh:

```tsx
import { clearDataCache } from '../hooks/useDataCache';

const signOut = async () => {
    clearDataCache();  // wipe session cache
    await supabase.auth.signOut();
    navigate('/login');
};
```

---

## WELLNESS JOURNEY — EXPLICIT EXCLUSION

**Do NOT apply useDataCache to WellnessJourney.tsx.**

The dosing session timer and Crisis Logger require timestamp accuracy. The existing `useEffect` fetch behavior on that page is correct and intentional. If real-time subscriptions are added to the Wellness Journey in the future, that is the only sanctioned use of live DB access.

---

## SEARCH PORTAL — MANUAL TRIGGER

`SearchPortal.tsx` should use `manual: true`. The fetch should only fire when the user clicks the Search button, not on page mount. This is the correct UX — a search page with no query should show an empty state, not a full result set.

```tsx
const { data, loading, refetch } = useDataCache(
    'search-results',
    () => supabase.rpc('search_global_v2', { query: searchTerm }),
    { manual: true }
);

// Wire to Search button:
<button onClick={refetch}>Search</button>
```

---

## DEFINITION OF DONE

- [ ] `src/hooks/useDataCache.ts` created and exported
- [ ] `clearDataCache()` called in signOut
- [ ] `Analytics.tsx` converted — no bare useEffect fetch, Refresh button added
- [ ] `Dashboard.tsx` converted — Refresh button added
- [ ] `MyProtocols.tsx` converted — Refresh button added
- [ ] `InteractionChecker.tsx` converted — 30-min TTL (reference data)
- [ ] `ClinicianDirectory.tsx` converted
- [ ] `DataExport.tsx` converted — Refresh button added
- [ ] `SearchPortal.tsx` converted to manual trigger
- [ ] `ProfileEdit.tsx` converted
- [ ] `WellnessJourney.tsx` explicitly NOT touched
- [ ] No new npm dependencies added
- [ ] Supabase query count confirmed reduced in network tab during a navigation demo

## INSPECTOR CHECKLIST

- [ ] No `useEffect` on any converted page fires a Supabase query on mount without checking cache first
- [ ] WellnessJourney.tsx is unmodified
- [ ] `clearDataCache()` is called on signOut
- [ ] No real-time polling added anywhere
- [ ] Loading states still render correctly on first load
- [ ] Error states render if fetch fails

---

*WO-133 created by LEAD | February 2026*
*Policy: Real-time only when the timer is running.*
