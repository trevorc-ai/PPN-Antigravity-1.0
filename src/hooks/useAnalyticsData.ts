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

                // Query 1: Count distinct patients (active protocols)
                const { data: protocolData, error: protocolError } = await supabase
                    .from('log_clinical_records')
                    .select('patient_link_code')
                    .eq('site_id', siteId);

                if (protocolError) throw protocolError;

                const uniquePatients = new Set(protocolData?.map(r => r.patient_link_code) || []);
                const protocolCount = uniquePatients.size;

                // Query 2: Count recent safety events (last 30 days)
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                const dateString = thirtyDaysAgo.toISOString().split('T')[0];

                const { data: safetyData, error: safetyError } = await supabase
                    .from('log_clinical_records')
                    .select('safety_event_id')
                    .eq('site_id', siteId)
                    .not('safety_event_id', 'is', null)
                    .gte('session_date', dateString);

                if (safetyError) throw safetyError;

                const alertCount = safetyData?.length || 0;

                // Query 3: Total sessions for efficiency calculation
                const { data: allSessions, error: sessionsError } = await supabase
                    .from('log_clinical_records')
                    .select('id, safety_event_id')
                    .eq('site_id', siteId);

                if (sessionsError) throw sessionsError;

                const totalSessions = allSessions?.length || 0;
                const sessionsWithSafetyEvents = allSessions?.filter(s => s.safety_event_id !== null).length || 0;

                // Calculate metrics
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
                console.error('Analytics fetch error:', err);
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
