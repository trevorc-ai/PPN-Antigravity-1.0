import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../supabaseClient';
import { useDataCache } from './useDataCache';

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

    // We fetch five separate times, caching this heavy operation is important
    const { data: benchmark, loading, error } = useDataCache<SafetyBenchmark | null>(
        user ? `safety-benchmark-${user.id}` : 'safety-benchmark-empty',
        async () => {
            if (!user) return { data: null, error: 'No user ID provided' };

            try {
                const { data: userSites, error: userSitesError } = await supabase
                    .from('log_user_sites')
                    .select('site_id')
                    .eq('user_id', user.id)
                    .single();

                if (userSitesError || !userSites) return { data: null, error: null };

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

                return { data: result, error: null };
            } catch (err: any) {
                console.error('Error fetching safety benchmark:', err);
                return { data: null, error: err.message };
            }
        },
        { ttl: 5 * 60 * 1000, enabled: !!user } // 5 minute TTL
    );

    return { benchmark, loading, error };
};
