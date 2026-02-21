import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../supabaseClient';

interface SafetyBenchmark {
    practitioner_adverse_event_rate: number;
    network_average_rate: number;
    percentile: number;
    total_sessions: number;
    adverse_events: number;
    status: 'excellent' | 'good' | 'average' | 'needs_improvement';
    comparison: 'above_average' | 'average' | 'below_average';
}

// Module-level cache keyed by user_id — 5 min TTL.
// This hook fires 5 separate DB queries. Without caching it re-fires every time
// the Analytics page is mounted (every navigation back to the page).
const CACHE_TTL = 5 * 60 * 1000;
const _cache = new Map<string, { data: SafetyBenchmark; fetchedAt: number }>();
const _promises = new Map<string, Promise<SafetyBenchmark | null>>();

async function fetchBenchmarkForUser(userId: string): Promise<SafetyBenchmark | null> {
    const cached = _cache.get(userId);
    if (cached && (Date.now() - cached.fetchedAt) < CACHE_TTL) return cached.data;

    if (_promises.has(userId)) return _promises.get(userId)!;

    const promise = (async (): Promise<SafetyBenchmark | null> => {
        try {
            const { data: userSites, error: userSitesError } = await supabase
                .from('log_user_sites')
                .select('site_id')
                .eq('user_id', userId)
                .single();

            if (userSitesError || !userSites) { _promises.delete(userId); return null; }

            const { data: practitionerRecords } = await supabase
                .from('log_clinical_records')
                .select('id')
                .eq('site_id', userSites.site_id);

            const { data: practitionerSafetyEvents } = await supabase
                .from('log_safety_events')
                .select('id')
                .eq('site_id', userSites.site_id);

            const totalSessions = practitionerRecords?.length || 0;
            const adverseEvents = practitionerSafetyEvents?.length || 0;
            const practitionerRate = totalSessions > 0 ? (adverseEvents / totalSessions) * 100 : 0;

            const { data: allRecords } = await supabase
                .from('log_clinical_records')
                .select('site_id');

            const { data: allSafetyEvents } = await supabase
                .from('log_safety_events')
                .select('site_id');

            const siteSessionCounts = new Map<string, number>();
            const siteEventCounts = new Map<string, number>();

            (allRecords || []).forEach(r => {
                siteSessionCounts.set(r.site_id, (siteSessionCounts.get(r.site_id) || 0) + 1);
            });
            (allSafetyEvents || []).forEach(e => {
                siteEventCounts.set(e.site_id, (siteEventCounts.get(e.site_id) || 0) + 1);
            });

            let totalNetworkSessions = 0;
            let totalNetworkEvents = 0;
            const siteRates: number[] = [];

            siteSessionCounts.forEach((sessions, siteId) => {
                if (sessions >= 10) {
                    totalNetworkSessions += sessions;
                    totalNetworkEvents += (siteEventCounts.get(siteId) || 0);
                    const events = siteEventCounts.get(siteId) || 0;
                    siteRates.push((events / sessions) * 100);
                }
            });

            const networkAverageRate = totalNetworkSessions > 0
                ? (totalNetworkEvents / totalNetworkSessions) * 100
                : 0;

            siteRates.sort((a, b) => a - b);
            const percentile = totalSessions >= 10
                ? (siteRates.filter(r => r > practitionerRate).length / siteRates.length) * 100
                : 0;

            let status: SafetyBenchmark['status'];
            let comparison: SafetyBenchmark['comparison'];

            if (practitionerRate < networkAverageRate * 0.5) {
                status = 'excellent'; comparison = 'above_average';
            } else if (practitionerRate < networkAverageRate * 0.8) {
                status = 'good'; comparison = 'above_average';
            } else if (practitionerRate <= networkAverageRate * 1.2) {
                status = 'average'; comparison = 'average';
            } else {
                status = 'needs_improvement'; comparison = 'below_average';
            }

            const result: SafetyBenchmark = {
                practitioner_adverse_event_rate: practitionerRate,
                network_average_rate: networkAverageRate,
                percentile: Math.round(percentile),
                total_sessions: totalSessions,
                adverse_events: adverseEvents,
                status,
                comparison,
            };

            _cache.set(userId, { data: result, fetchedAt: Date.now() });
            _promises.delete(userId);
            return result;
        } catch (err) {
            console.error('Error fetching safety benchmark:', err);
            _promises.delete(userId);
            return null;
        }
    })();

    _promises.set(userId, promise);
    return promise;
}

export const useSafetyBenchmark = () => {
    const { user } = useAuth();
    const [benchmark, setBenchmark] = useState<SafetyBenchmark | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!user) { setBenchmark(null); setLoading(false); return; }

        // Serve from cache immediately if available
        const cached = _cache.get(user.id);
        if (cached && (Date.now() - cached.fetchedAt) < CACHE_TTL) {
            setBenchmark(cached.data);
            setLoading(false);
            return;
        }

        setLoading(true);
        fetchBenchmarkForUser(user.id).then(result => {
            setBenchmark(result);
            setLoading(false);
        }).catch(err => {
            setError(err instanceof Error ? err.message : 'Failed to fetch safety benchmark');
            setLoading(false);
        });
    }, [user?.id]);

    return { benchmark, loading, error };
};

/** Call on logout to clear all cached benchmark data */
export function clearBenchmarkCache(userId?: string): void {
    if (userId) { _cache.delete(userId); } else { _cache.clear(); }
}
