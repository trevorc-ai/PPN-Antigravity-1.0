import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../supabaseClient';

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

export const useSafetyAlerts = () => {
    const { user } = useAuth();
    const [alertCount, setAlertCount] = useState(0);
    const [alerts, setAlerts] = useState<SafetyAlert[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!user) {
            setAlertCount(0);
            setAlerts([]);
            setLoading(false);
            return;
        }

        const fetchAlerts = async () => {
            try {
                setLoading(true);
                setError(null);

                // Get user's site_id from user_sites
                const { data: userSites, error: userSitesError } = await supabase
                    .from('log_user_sites')
                    .select('site_id')
                    .eq('user_id', user.id)
                    .single();

                if (userSitesError) throw userSitesError;

                if (!userSites) {
                    setAlertCount(0);
                    setAlerts([]);
                    setLoading(false);
                    return;
                }

                // For MVP: Generate mock alerts based on recent safety events
                // In production, this would query a real safety_alerts table
                const { data: safetyEvents, error: safetyError } = await supabase
                    .from('log_safety_events')
                    .select('*')
                    .eq('site_id', userSites.site_id)
                    .order('created_at', { ascending: false })
                    .limit(10);

                if (safetyError) throw safetyError;

                // Convert safety events to alerts (MVP mock)
                const mockAlerts: SafetyAlert[] = (safetyEvents || [])
                    .filter(event => event.severity_grade_id && event.severity_grade_id >= 3)
                    .map((event, index) => ({
                        id: `alert-${event.id || index}`,
                        site_id: userSites.site_id,
                        substance_id: event.substance_id || 0,
                        indication_id: event.indication_id || 0,
                        severity: event.severity_grade_id >= 4 ? 'critical' : 'high',
                        alert_type: 'adverse_event',
                        message: `High severity safety event detected`,
                        created_at: event.created_at || new Date().toISOString(),
                        status: 'active'
                    }));

                setAlerts(mockAlerts);
                setAlertCount(mockAlerts.filter(a => a.status === 'active').length);
            } catch (err) {
                console.error('Error fetching safety alerts:', err);
                setError(err instanceof Error ? err.message : 'Failed to fetch safety alerts');
                setAlertCount(0);
                setAlerts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchAlerts();

        // Real-time subscription removed (WO-096 fix) — was triggering fetchAlerts()
        // on every postgres_changes event, causing Supabase ThrottleException.
        // Safety alerts are MVP/mock — fetch-once on mount is sufficient.
        // Re-enable with proper debounce when safety_alerts table is production-ready.

        return () => {
            // no subscription to clean up
        };
    }, [user]);

    return { alertCount, alerts, loading, error };
};
