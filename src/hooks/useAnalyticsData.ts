import { supabase } from '../supabaseClient';
import { useDataCache } from './useDataCache';

export interface AnalyticsKPIs {
    activeProtocols: number;
    patientAlerts: number;
    networkEfficiency: number;
    riskScore: string;
    loading: boolean;
    error: string | null;
}

export function useAnalyticsData(siteId: string | null): AnalyticsKPIs & { refetch: () => void, lastFetchedAt: Date | null } {
    const { data, loading, error, refetch, lastFetchedAt } = useDataCache(
        siteId ? `analytics-data-${siteId}` : 'analytics-data-empty',
        async () => {
            if (!siteId) return { data: null, error: 'No site ID provided' };

            try {
                // Step 1: Fetch all sessions for this site
                // NOTE: safety_event_id was removed — safety events live in log_safety_events, not as a FK on log_clinical_records
                const { data: allSessions, error: sessionsError } = await supabase
                    .from('log_clinical_records')
                    .select('id, patient_uuid, session_date')
                    .eq('site_id', siteId)
                    .neq('session_status', 'draft');

                if (sessionsError) throw sessionsError;

                const records = allSessions || [];
                const totalSessions = records.length;
                const uniquePatients = new Set(records.map((r: any) => r.patient_uuid).filter(Boolean));

                // Step 2: Count adverse events from log_safety_events (the proper table)
                const sessionIds = records.map((r: any) => r.id).filter(Boolean);
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                const cutoff = thirtyDaysAgo.toISOString().split('T')[0];

                let allTimeAdverse = 0;
                let recentAlerts = 0;

                if (sessionIds.length > 0) {
                    const { data: safetyData, error: safetyErr } = await supabase
                        .from('log_safety_events')
                        .select('ae_id, session_id')
                        .in('session_id', sessionIds);

                    if (!safetyErr && safetyData) {
                        allTimeAdverse = safetyData.length;
                        // Recent alerts: sessions in last 30 days that had adverse events
                        const recentSessionIds = new Set(
                            records
                                .filter((r: any) => r.session_date >= cutoff)
                                .map((r: any) => r.id)
                        );
                        recentAlerts = safetyData.filter((s: any) => recentSessionIds.has(s.session_id)).length;
                    }
                }

                const efficiency = totalSessions > 0
                    ? ((totalSessions - allTimeAdverse) / totalSessions) * 100 : 0;
                const safetyRate = totalSessions > 0
                    ? (allTimeAdverse / totalSessions) * 100 : 0;
                const riskScore = totalSessions === 0
                    ? 'Unknown'
                    : safetyRate < 5 ? 'Low' : safetyRate < 15 ? 'Medium' : 'High';

                return {
                    data: {
                        activeProtocols: totalSessions,   // Show total sessions (matches My Protocols row count)
                        patientAlerts: recentAlerts,
                        networkEfficiency: Number.isFinite(efficiency) ? Math.round(efficiency * 10) / 10 : 0,
                        riskScore,
                    },
                    error: null,
                };
            } catch (err: any) {
                console.error('[useAnalyticsData] query failed:', err.message); // allow-console
                return {
                    data: { activeProtocols: 0, patientAlerts: 0, networkEfficiency: 0, riskScore: 'Unknown' },
                    error: err.message || 'Failed to load analytics',
                };
            }
        },
        { ttl: 5 * 60 * 1000, enabled: !!siteId } // 5 min TTL
    );

    return {
        activeProtocols: data?.activeProtocols || 0,
        patientAlerts: data?.patientAlerts || 0,
        networkEfficiency: Number.isFinite(data?.networkEfficiency) ? data!.networkEfficiency : 0,
        riskScore: data?.riskScore || 'Unknown',
        loading,
        error: error ? String(error) : null,
        refetch,
        lastFetchedAt,
    };
}
