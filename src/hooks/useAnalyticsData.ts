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

export function useAnalyticsData(siteId: number | null): AnalyticsKPIs & { refetch: () => void, lastFetchedAt: Date | null } {
    const { data, loading, error, refetch, lastFetchedAt } = useDataCache(
        siteId ? `analytics-data-${siteId}` : 'analytics-data-empty',
        async () => {
            if (!siteId) return { data: null, error: 'No site ID provided' };

            try {
                // Primary: materialized view (fast, single query)
                const { data: benchmarkData, error: benchmarkError } = await supabase
                    .from('mv_clinic_benchmarks')
                    .select('*')
                    .eq('site_id', siteId);

                if (!benchmarkError && benchmarkData && benchmarkData.length > 0) {
                    const totalPatients = benchmarkData.reduce((sum, row) => sum + (row.unique_patients || 0), 0);
                    const totalSessions = benchmarkData.reduce((sum, row) => sum + (row.total_sessions || 0), 0);
                    const avgSuccessRate = benchmarkData.length > 0
                        ? benchmarkData.reduce((sum, row) => sum + (row.success_rate || 0), 0) / benchmarkData.length
                        : 0;
                    const efficiency = avgSuccessRate * 100;
                    const estimatedSafetyEvents = Math.round(totalSessions * (1 - avgSuccessRate));
                    const safetyRate = totalSessions > 0 ? (estimatedSafetyEvents / totalSessions) * 100 : 0;
                    const riskScore = safetyRate < 5 ? 'Low' : safetyRate < 15 ? 'Medium' : 'High';

                    return {
                        data: {
                            activeProtocols: totalPatients,
                            patientAlerts: estimatedSafetyEvents,
                            networkEfficiency: Math.round(efficiency * 10) / 10,
                            riskScore,
                        },
                        error: null,
                    };
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

                return {
                    data: {
                        activeProtocols: uniquePatients.size,
                        patientAlerts: safetyData?.length || 0,
                        networkEfficiency: Math.round(efficiencyFb * 10) / 10,
                        riskScore: riskScoreFb,
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
        networkEfficiency: data?.networkEfficiency || 0,
        riskScore: data?.riskScore || 'Unknown',
        loading,
        error: error ? String(error) : null,
        refetch,
        lastFetchedAt
    };
}
