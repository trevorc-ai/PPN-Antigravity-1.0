import { supabase } from '../supabaseClient';
import { useDataCache } from './useDataCache';

export interface AnalyticsKPIs {
    activeProtocols: number;
    patientAlerts: number;
    networkEfficiency: number;
    riskScore: string;
    siteId: string | null;
    loading: boolean;
    error: string | null;
}

/**
 * WO-675 FIX: Hook is now fully self-contained.
 * Resolves user → site_id internally (same pattern as MyProtocols / usePractitionerProtocols)
 * so the fetch fires correctly at mount without depending on an externally-resolved async siteId.
 *
 * Previous pattern (broken): Analytics.tsx fetched site_id in useEffect → passed to this hook
 * → useDataCache fired mount-only before site_id was available → key was 'analytics-data-empty'
 * → enabled:false → fetch never ran → permanent zero state.
 */
export function useAnalyticsData(): AnalyticsKPIs & { refetch: () => void, lastFetchedAt: Date | null } {
    const { data, loading, error, refetch, lastFetchedAt } = useDataCache(
        'analytics-data',
        async () => {
            try {
                // Step 1: Resolve authenticated user + site_id (self-contained, same as MyProtocols)
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return { data: null, error: 'Not authenticated' };

                const { data: userSite, error: siteError } = await supabase
                    .from('log_user_sites')
                    .select('site_id')
                    .eq('user_id', user.id)
                    .maybeSingle();

                if (siteError) throw siteError;
                if (!userSite) return { data: { activeProtocols: 0, patientAlerts: 0, networkEfficiency: 0, riskScore: 'Unknown', siteId: null }, error: null };

                const siteId = userSite.site_id;

                // Step 2: Fetch all non-draft sessions for this site
                // NOTE: safety_event_id was removed — safety events live in log_safety_events, not as a FK on log_clinical_records
                const { data: allSessions, error: sessionsError } = await supabase
                    .from('log_clinical_records')
                    .select('id, patient_uuid, session_date')
                    .eq('site_id', siteId)
                    .neq('session_status', 'draft');

                if (sessionsError) throw sessionsError;

                const records = allSessions || [];
                const totalSessions = records.length;

                // Step 3: Count adverse events from log_safety_events (the proper table)
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
                        activeProtocols: totalSessions,   // Total non-draft sessions (matches My Protocols count)
                        patientAlerts: recentAlerts,
                        networkEfficiency: Number.isFinite(efficiency) ? Math.round(efficiency * 10) / 10 : 0,
                        riskScore,
                        siteId,
                    },
                    error: null,
                };
            } catch (err: any) {
                console.error('[useAnalyticsData] query failed:', err.message); // allow-console
                return {
                    data: { activeProtocols: 0, patientAlerts: 0, networkEfficiency: 0, riskScore: 'Unknown', siteId: null },
                    error: err.message || 'Failed to load analytics',
                };
            }
        },
        { ttl: 5 * 60 * 1000 } // 5 min TTL — always enabled (auth check is inside fetcher)
    );

    return {
        activeProtocols: data?.activeProtocols || 0,
        patientAlerts: data?.patientAlerts || 0,
        networkEfficiency: Number.isFinite(data?.networkEfficiency) ? data!.networkEfficiency : 0,
        riskScore: data?.riskScore || 'Unknown',
        siteId: data?.siteId ?? null,
        loading,
        error: error ? String(error) : null,
        refetch,
        lastFetchedAt,
    };
}
