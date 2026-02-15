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

export const useAnalyticsData = (siteId: number | null) => {
    const [data, setData] = useState<AnalyticsKPIs>({
        activeProtocols: 0,
        patientAlerts: 0,
        networkEfficiency: 0,
        riskScore: 'Unknown',
        loading: true,
        error: null
    });

    useEffect(() => {
        if (!siteId) {
            setData(prev => ({ ...prev, loading: false }));
            return;
        }

        const fetchAnalytics = async () => {
            try {
                setData(prev => ({ ...prev, loading: true, error: null }));

                // OPTIMIZED: Single query to materialized view instead of 3 raw table queries
                const { data: benchmarkData, error: benchmarkError } = await supabase
                    .from('mv_clinic_benchmarks')
                    .select('*')
                    .eq('site_id', siteId);

                if (benchmarkError) {
                    // Fallback to raw table if materialized view doesn't exist yet
                    console.warn('Materialized view not available, using fallback:', benchmarkError);
                    return fetchAnalyticsFallback();
                }

                // Aggregate metrics across all substances/indications for this site
                const totalPatients = benchmarkData?.reduce((sum, row) => sum + (row.unique_patients || 0), 0) || 0;
                const totalSessions = benchmarkData?.reduce((sum, row) => sum + (row.total_sessions || 0), 0) || 0;
                const avgSuccessRate = benchmarkData?.length > 0
                    ? benchmarkData.reduce((sum, row) => sum + (row.success_rate || 0), 0) / benchmarkData.length
                    : 0;

                // Calculate efficiency (inverse of failure rate)
                const efficiency = avgSuccessRate * 100;

                // Count recent safety events (approximation from success rate)
                const estimatedSafetyEvents = Math.round(totalSessions * (1 - avgSuccessRate));

                // Determine risk score
                const safetyRate = totalSessions > 0 ? (estimatedSafetyEvents / totalSessions) * 100 : 0;
                const riskScore = safetyRate < 5 ? 'Low' : safetyRate < 15 ? 'Medium' : 'High';

                setData({
                    activeProtocols: totalPatients,
                    patientAlerts: estimatedSafetyEvents,
                    networkEfficiency: Math.round(efficiency * 10) / 10,
                    riskScore,
                    loading: false,
                    error: null
                });

            } catch (err: any) {
                console.error('Analytics fetch error:', err);
                setData(prev => ({
                    ...prev,
                    loading: false,
                    error: err.message || 'Failed to load analytics'
                }));
            }
        };

        // Fallback function for raw table queries (if materialized view not ready)
        const fetchAnalyticsFallback = async () => {
            try {
                const { data: protocolData } = await supabase
                    .from('log_clinical_records')
                    .select('patient_link_code')
                    .eq('site_id', siteId);

                const uniquePatients = new Set(protocolData?.map(r => r.patient_link_code) || []);
                const protocolCount = uniquePatients.size;

                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                const dateString = thirtyDaysAgo.toISOString().split('T')[0];

                const { data: safetyData } = await supabase
                    .from('log_clinical_records')
                    .select('safety_event_id')
                    .eq('site_id', siteId)
                    .not('safety_event_id', 'is', null)
                    .gte('session_date', dateString);

                const alertCount = safetyData?.length || 0;

                const { data: allSessions } = await supabase
                    .from('log_clinical_records')
                    .select('id, safety_event_id')
                    .eq('site_id', siteId);

                const totalSessions = allSessions?.length || 0;
                const sessionsWithSafetyEvents = allSessions?.filter(s => s.safety_event_id !== null).length || 0;

                const efficiency = totalSessions > 0
                    ? ((totalSessions - sessionsWithSafetyEvents) / totalSessions) * 100
                    : 0;

                const safetyRate = totalSessions > 0
                    ? (sessionsWithSafetyEvents / totalSessions) * 100
                    : 0;

                const riskScore = safetyRate < 5 ? 'Low' : safetyRate < 15 ? 'Medium' : 'High';

                setData({
                    activeProtocols: protocolCount,
                    patientAlerts: alertCount,
                    networkEfficiency: Math.round(efficiency * 10) / 10,
                    riskScore,
                    loading: false,
                    error: null
                });
            } catch (err: any) {
                console.error('Fallback analytics fetch error:', err);
                setData(prev => ({
                    ...prev,
                    loading: false,
                    error: err.message || 'Failed to load analytics'
                }));
            }
        };

        fetchAnalytics();
    }, [siteId]);

    return data;
};
