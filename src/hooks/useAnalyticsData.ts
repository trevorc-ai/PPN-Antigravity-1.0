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
                // Single query: get all sessions for the site with the data we need for KPIs
                // mv_clinic_benchmarks does not yet exist — querying raw tables directly
                const { data: allSessions, error: sessionsError } = await supabase
                    .from('log_clinical_records')
                    .select('id, patient_uuid, safety_event_id, session_date')
                    .eq('site_id', siteId);

                if (sessionsError) throw sessionsError;

                const records = allSessions || [];
                const uniquePatients = new Set(records.map((r: any) => r.patient_uuid).filter(Boolean));
                const totalSessions = records.length;
                const allTimeAdverse = records.filter((s: any) => s.safety_event_id !== null).length;
                const efficiency = totalSessions > 0
                    ? ((totalSessions - allTimeAdverse) / totalSessions) * 100 : 0;
                const safetyRate = totalSessions > 0
                    ? (allTimeAdverse / totalSessions) * 100 : 0;
                const riskScore = safetyRate < 5 ? 'Low' : safetyRate < 15 ? 'Medium' : 'High';

                // Recent alerts: adverse events in last 30 days
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                const cutoff = thirtyDaysAgo.toISOString().split('T')[0];
                const recentAlerts = records.filter((r: any) =>
                    r.safety_event_id !== null && r.session_date >= cutoff
                ).length;

                return {
                    data: {
                        activeProtocols: uniquePatients.size,
                        patientAlerts: recentAlerts,
                        networkEfficiency: Number.isFinite(efficiency) ? Math.round(efficiency * 10) / 10 : 0,
                        riskScore,
                    },
                    error: null,
                };
            } catch (err: any) {
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
