import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export interface AnalyticsKPIs {
    activeProtocols: number;
    patientAlerts: number;
    networkEfficiency: number;
    riskScore: string;
    loading: boolean;
    error: string | null;
}

// Module-level cache keyed by siteId — 5 min TTL.
// Analytics data does not need to be live. Re-fetching on every page mount
// was causing unnecessary DB traffic.
const CACHE_TTL = 5 * 60 * 1000;
const _cache = new Map<number, { data: Omit<AnalyticsKPIs, 'loading' | 'error'>; fetchedAt: number }>();
const _promises = new Map<number, Promise<Omit<AnalyticsKPIs, 'loading' | 'error'>>>();

async function fetchAnalyticsForSite(siteId: number): Promise<Omit<AnalyticsKPIs, 'loading' | 'error'>> {
    const cached = _cache.get(siteId);
    if (cached && (Date.now() - cached.fetchedAt) < CACHE_TTL) return cached.data;
    if (_promises.has(siteId)) return _promises.get(siteId)!;

    const promise = (async () => {
        try {
            // Primary: materialized view (fast, single query)
            const { data: benchmarkData, error: benchmarkError } = await supabase
                .from('mv_clinic_benchmarks')
                .select('*')
                .eq('site_id', siteId);

            if (!benchmarkError && benchmarkData) {
                const totalPatients = benchmarkData.reduce((sum, row) => sum + (row.unique_patients || 0), 0);
                const totalSessions = benchmarkData.reduce((sum, row) => sum + (row.total_sessions || 0), 0);
                const avgSuccessRate = benchmarkData.length > 0
                    ? benchmarkData.reduce((sum, row) => sum + (row.success_rate || 0), 0) / benchmarkData.length
                    : 0;
                const efficiency = avgSuccessRate * 100;
                const estimatedSafetyEvents = Math.round(totalSessions * (1 - avgSuccessRate));
                const safetyRate = totalSessions > 0 ? (estimatedSafetyEvents / totalSessions) * 100 : 0;
                const riskScore = safetyRate < 5 ? 'Low' : safetyRate < 15 ? 'Medium' : 'High';

                const result = {
                    activeProtocols: totalPatients,
                    patientAlerts: estimatedSafetyEvents,
                    networkEfficiency: Math.round(efficiency * 10) / 10,
                    riskScore,
                };
                _cache.set(siteId, { data: result, fetchedAt: Date.now() });
                _promises.delete(siteId);
                return result;
            }

            // Fallback: raw tables (3 queries)
            const { data: protocolData } = await supabase
                .from('log_clinical_records')
                .select('patient_link_code')
                .eq('site_id', siteId);

            const uniquePatients = new Set(protocolData?.map(r => r.patient_link_code) || []);

            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            const dateString = thirtyDaysAgo.toISOString().split('T')[0];

            const { data: safetyData } = await supabase
                .from('log_clinical_records')
                .select('safety_event_id')
                .eq('site_id', siteId)
                .not('safety_event_id', 'is', null)
                .gte('session_date', dateString);

            const { data: allSessions } = await supabase
                .from('log_clinical_records')
                .select('id, safety_event_id')
                .eq('site_id', siteId);

            const totalSessionsFb = allSessions?.length || 0;
            const sessionsWithEvents = allSessions?.filter(s => s.safety_event_id !== null).length || 0;
            const efficiencyFb = totalSessionsFb > 0
                ? ((totalSessionsFb - sessionsWithEvents) / totalSessionsFb) * 100 : 0;
            const safetyRateFb = totalSessionsFb > 0
                ? (sessionsWithEvents / totalSessionsFb) * 100 : 0;
            const riskScoreFb = safetyRateFb < 5 ? 'Low' : safetyRateFb < 15 ? 'Medium' : 'High';

            const result = {
                activeProtocols: uniquePatients.size,
                patientAlerts: safetyData?.length || 0,
                networkEfficiency: Math.round(efficiencyFb * 10) / 10,
                riskScore: riskScoreFb,
            };
            _cache.set(siteId, { data: result, fetchedAt: Date.now() });
            _promises.delete(siteId);
            return result;
        } catch {
            _promises.delete(siteId);
            return { activeProtocols: 0, patientAlerts: 0, networkEfficiency: 0, riskScore: 'Unknown' };
        }
    })();

    _promises.set(siteId, promise);
    return promise;
}

export const useAnalyticsData = (siteId: number | null) => {
    const [data, setData] = useState<AnalyticsKPIs>({
        activeProtocols: 0,
        patientAlerts: 0,
        networkEfficiency: 0,
        riskScore: 'Unknown',
        loading: !!(siteId && !_cache.has(siteId)),
        error: null,
    });

    useEffect(() => {
        if (!siteId) { setData(prev => ({ ...prev, loading: false })); return; }

        // Serve from cache immediately if fresh
        const cached = _cache.get(siteId);
        if (cached && (Date.now() - cached.fetchedAt) < CACHE_TTL) {
            setData({ ...cached.data, loading: false, error: null });
            return;
        }

        setData(prev => ({ ...prev, loading: true, error: null }));

        fetchAnalyticsForSite(siteId).then(result => {
            setData({ ...result, loading: false, error: null });
        }).catch(err => {
            setData(prev => ({ ...prev, loading: false, error: err.message || 'Failed to load analytics' }));
        });
    }, [siteId]);

    return data;
};

/** Call on logout to clear cached analytics data */
export function clearAnalyticsCache(siteId?: number): void {
    if (siteId !== undefined) { _cache.delete(siteId); } else { _cache.clear(); }
}
