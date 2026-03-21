/**
 * useActiveSessions — thin wrapper around ActiveSessionsContext.
 *
 * Consumers that pass `isAuthenticated` as a guard still work unchanged.
 * Data comes from the singleton context (one poll for all consumers).
 */
import { useActiveSessionsContext } from '../contexts/ActiveSessionsContext';
import type { ActiveSession } from '../contexts/ActiveSessionsContext';

export type { ActiveSession };

export function useActiveSessions(_isAuthenticated?: boolean) {
    const { sessions, loading, refresh } = useActiveSessionsContext();
    return { sessions, loading, error: null, refresh };
}
