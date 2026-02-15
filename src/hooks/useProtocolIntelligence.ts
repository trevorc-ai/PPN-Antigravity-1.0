import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export interface ProtocolIntelligenceData {
    successRates: SuccessRateMetric[];
    safetyScores: SafetyMetric[];
    networkBenchmarks: NetworkBenchmark[];
    lastRefreshed: Date | null;
    loading: boolean;
    error: string | null;
}

export interface SuccessRateMetric {
    substance_name: string;
    indication_name: string;
    remission_rate: number;
    response_rate: number;
    unique_patients: number;
    confidence_level: number;
}

export interface SafetyMetric {
    substance_name: string;
    total_sessions: number;
    adverse_event_rate: number;
    risk_category: string;
}

export interface NetworkBenchmark {
    substance_id: number;
    indication_id: number;
    network_success_rate: number;
    network_response_rate: number;
    participating_sites: number;
    unique_patients: number;
}

export const useProtocolIntelligence = (siteId: number | null) => {
    const [data, setData] = useState<ProtocolIntelligenceData>({
        successRates: [],
        safetyScores: [],
        networkBenchmarks: [],
        lastRefreshed: null,
        loading: true,
        error: null
    });

    const fetchData = async () => {
        if (!siteId) {
            setData(prev => ({ ...prev, loading: false }));
            return;
        }

        try {
            setData(prev => ({ ...prev, loading: true, error: null }));

            // Query 1: Success Rates from mv_outcomes_summary
            const { data: successData, error: successError } = await supabase
                .from('mv_outcomes_summary')
                .select(`
                    remission_rate,
                    response_rate,
                    unique_patients,
                    confidence_level,
                    substance:ref_substances(substance_name),
                    indication:ref_indications(indication_name)
                `)
                .order('unique_patients', { ascending: false })
                .limit(10);

            if (successError) throw successError;

            // Query 2: Network Benchmarks from mv_network_benchmarks
            const { data: networkData, error: networkError } = await supabase
                .from('mv_network_benchmarks')
                .select('*')
                .order('unique_patients', { ascending: false })
                .limit(10);

            if (networkError) throw networkError;

            // Query 3: Get last refresh timestamp
            const { data: refreshData } = await supabase
                .from('mv_outcomes_summary')
                .select('last_updated')
                .limit(1)
                .single();

            setData({
                successRates: successData?.map((row: any) => ({
                    substance_name: row.substance?.substance_name || 'Unknown',
                    indication_name: row.indication?.indication_name || 'Unknown',
                    remission_rate: row.remission_rate || 0,
                    response_rate: row.response_rate || 0,
                    unique_patients: row.unique_patients || 0,
                    confidence_level: row.confidence_level || 0
                })) || [],
                safetyScores: [], // TODO: Calculate from safety events
                networkBenchmarks: networkData || [],
                lastRefreshed: refreshData?.last_updated ? new Date(refreshData.last_updated) : null,
                loading: false,
                error: null
            });

        } catch (err: any) {
            console.error('Protocol Intelligence fetch error:', err);
            setData(prev => ({
                ...prev,
                loading: false,
                error: err.message || 'Failed to load protocol intelligence data'
            }));
        }
    };

    const refreshData = async () => {
        try {
            setData(prev => ({ ...prev, loading: true }));

            // Call manual refresh RPC function
            const { data: result, error } = await supabase
                .rpc('refresh_all_analytics');

            if (error) throw error;

            console.log('Analytics refreshed:', result);

            // Re-fetch data after refresh
            await fetchData();

        } catch (err: any) {
            console.error('Refresh error:', err);
            setData(prev => ({
                ...prev,
                loading: false,
                error: err.message || 'Failed to refresh analytics'
            }));
        }
    };

    useEffect(() => {
        fetchData();
    }, [siteId]);

    return { ...data, refreshData };
};
