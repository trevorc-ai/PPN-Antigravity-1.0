import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../supabaseClient';
import { useDataCache } from './useDataCache';

interface SafetyAlert {
    id: string;
    site_id: string;
    substance_id: number;
    indication_id: number;
    severity: 'low' | 'medium' | 'high' | 'critical';
    alert_type: string;
    message: string;
    created_at: string;
    status: 'active' | 'acknowledged' | 'resolved';
}

interface SafetyAlertsResult {
    alertCount: number;
    alerts: SafetyAlert[];
}

export const useSafetyAlerts = () => {
    const { user } = useAuth();

    const { data, loading, error } = useDataCache<SafetyAlertsResult>(
        user ? `safety-alerts-${user.id}` : 'safety-alerts-empty',
        async () => {
            if (!user) return { data: { alertCount: 0, alerts: [] }, error: null };

            try {
                // Get user's site_id
                const { data: userSites, error: userSitesError } = await supabase
                    .from('log_user_sites')
                    .select('site_id')
                    .eq('user_id', user.id)
                    .single();

                if (userSitesError || !userSites) {
                    return { data: { alertCount: 0, alerts: [] }, error: null };
                }

                // For MVP: derive alerts from recent high-severity safety events
                const { data: safetyEvents, error: safetyError } = await supabase
                    .from('log_safety_events')
                    .select('*')
                    .eq('site_id', userSites.site_id)
                    .order('created_at', { ascending: false })
                    .limit(10);

                if (safetyError) throw safetyError;

                const mockAlerts: SafetyAlert[] = (safetyEvents || [])
                    .filter((event: any) => event.severity_grade_id && event.severity_grade_id >= 3)
                    .map((event: any, index: number) => ({
                        id: `alert-${event.id || index}`,
                        site_id: userSites.site_id,
                        substance_id: event.substance_id || 0,
                        indication_id: event.indication_id || 0,
                        severity: event.severity_grade_id >= 4 ? 'critical' : 'high',
                        alert_type: 'adverse_event',
                        message: `High severity safety event detected`,
                        created_at: event.created_at || new Date().toISOString(),
                        status: 'active',
                    }));

                const alertCount = mockAlerts.filter((a) => a.status === 'active').length;
                return { data: { alertCount, alerts: mockAlerts }, error: null };
            } catch (err: any) {
                console.error('Error fetching safety alerts:', err);
                return { data: { alertCount: 0, alerts: [] }, error: err.message };
            }
        },
        { ttl: 5 * 60 * 1000, enabled: !!user } // 5-minute TTL — alerts are MVP, fetch-once is sufficient
    );

    return {
        alertCount: data?.alertCount ?? 0,
        alerts: data?.alerts ?? [],
        loading,
        error,
    };
};
