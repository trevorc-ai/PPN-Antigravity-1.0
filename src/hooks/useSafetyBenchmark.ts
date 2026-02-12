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

export const useSafetyBenchmark = () => {
    const { user } = useAuth();
    const [benchmark, setBenchmark] = useState<SafetyBenchmark | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!user) {
            setBenchmark(null);
            setLoading(false);
            return;
        }

        const fetchBenchmark = async () => {
            try {
                setLoading(true);
                setError(null);

                // Get user's site_id from user_sites
                const { data: userSites, error: userSitesError } = await supabase
                    .from('user_sites')
                    .select('site_id')
                    .eq('user_id', user.id)
                    .single();

                if (userSitesError) throw userSitesError;

                if (!userSites) {
                    setBenchmark(null);
                    setLoading(false);
                    return;
                }

                // Get practitioner's safety metrics
                const { data: practitionerRecords, error: practitionerError } = await supabase
                    .from('log_clinical_records')
                    .select('id')
                    .eq('site_id', userSites.site_id);

                if (practitionerError) throw practitionerError;

                const { data: practitionerSafetyEvents, error: practitionerSafetyError } = await supabase
                    .from('log_safety_events')
                    .select('id')
                    .eq('site_id', userSites.site_id);

                if (practitionerSafetyError) throw practitionerSafetyError;

                const totalSessions = practitionerRecords?.length || 0;
                const adverseEvents = practitionerSafetyEvents?.length || 0;
                const practitionerRate = totalSessions > 0 ? (adverseEvents / totalSessions) * 100 : 0;

                // Get network average (all sites with N >= 10)
                const { data: allRecords, error: allRecordsError } = await supabase
                    .from('log_clinical_records')
                    .select('site_id');

                if (allRecordsError) throw allRecordsError;

                const { data: allSafetyEvents, error: allSafetyEventsError } = await supabase
                    .from('log_safety_events')
                    .select('site_id');

                if (allSafetyEventsError) throw allSafetyEventsError;

                // Calculate per-site rates
                const siteSessionCounts = new Map<string, number>();
                const siteEventCounts = new Map<string, number>();

                (allRecords || []).forEach(record => {
                    siteSessionCounts.set(record.site_id, (siteSessionCounts.get(record.site_id) || 0) + 1);
                });

                (allSafetyEvents || []).forEach(event => {
                    siteEventCounts.set(event.site_id, (siteEventCounts.get(event.site_id) || 0) + 1);
                });

                // Calculate network average (only sites with N >= 10)
                let totalNetworkSessions = 0;
                let totalNetworkEvents = 0;
                let qualifiedSites = 0;

                siteSessionCounts.forEach((sessions, siteId) => {
                    if (sessions >= 10) {
                        totalNetworkSessions += sessions;
                        totalNetworkEvents += (siteEventCounts.get(siteId) || 0);
                        qualifiedSites++;
                    }
                });

                const networkAverageRate = totalNetworkSessions > 0
                    ? (totalNetworkEvents / totalNetworkSessions) * 100
                    : 0;

                // Calculate percentile (simplified)
                const siteRates: number[] = [];
                siteSessionCounts.forEach((sessions, siteId) => {
                    if (sessions >= 10) {
                        const events = siteEventCounts.get(siteId) || 0;
                        const rate = (events / sessions) * 100;
                        siteRates.push(rate);
                    }
                });

                siteRates.sort((a, b) => a - b);
                const percentile = totalSessions >= 10
                    ? (siteRates.filter(r => r > practitionerRate).length / siteRates.length) * 100
                    : 0;

                // Determine status
                let status: SafetyBenchmark['status'];
                let comparison: SafetyBenchmark['comparison'];

                if (practitionerRate < networkAverageRate * 0.5) {
                    status = 'excellent';
                    comparison = 'above_average';
                } else if (practitionerRate < networkAverageRate * 0.8) {
                    status = 'good';
                    comparison = 'above_average';
                } else if (practitionerRate <= networkAverageRate * 1.2) {
                    status = 'average';
                    comparison = 'average';
                } else {
                    status = 'needs_improvement';
                    comparison = 'below_average';
                }

                setBenchmark({
                    practitioner_adverse_event_rate: practitionerRate,
                    network_average_rate: networkAverageRate,
                    percentile: Math.round(percentile),
                    total_sessions: totalSessions,
                    adverse_events: adverseEvents,
                    status,
                    comparison
                });
            } catch (err) {
                console.error('Error fetching safety benchmark:', err);
                setError(err instanceof Error ? err.message : 'Failed to fetch safety benchmark');
                setBenchmark(null);
            } finally {
                setLoading(false);
            }
        };

        fetchBenchmark();
    }, [user]);

    return { benchmark, loading, error };
};
