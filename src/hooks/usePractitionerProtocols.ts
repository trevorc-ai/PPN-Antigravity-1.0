import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../supabaseClient';

interface Protocol {
    substance_id: number;
    substance_name: string;
    indication_id: number;
    indication_name: string;
    session_count: number;
    last_session: string;
    risk_level?: 'low' | 'medium' | 'high';
}

export const usePractitionerProtocols = () => {
    const { user } = useAuth();
    const [protocols, setProtocols] = useState<Protocol[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!user) {
            setProtocols([]);
            setLoading(false);
            return;
        }

        const fetchProtocols = async () => {
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
                    setProtocols([]);
                    setLoading(false);
                    return;
                }

                // Get active protocols (last 90 days)
                const ninetyDaysAgo = new Date();
                ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

                const { data: records, error: recordsError } = await supabase
                    .from('log_clinical_records')
                    .select(`
            substance_id,
            indication_id,
            created_at,
            ref_substances!inner(substance_name),
            ref_indications!inner(indication_name)
          `)
                    .eq('site_id', userSites.site_id)
                    .gte('created_at', ninetyDaysAgo.toISOString())
                    .order('created_at', { ascending: false });

                if (recordsError) throw recordsError;

                // Group by substance_id and indication_id
                const protocolMap = new Map<string, Protocol>();

                (records || []).forEach((record: any) => {
                    const key = `${record.substance_id}-${record.indication_id}`;

                    if (!protocolMap.has(key)) {
                        protocolMap.set(key, {
                            substance_id: record.substance_id,
                            substance_name: record.ref_substances?.substance_name || 'Unknown',
                            indication_id: record.indication_id,
                            indication_name: record.ref_indications?.indication_name || 'Unknown',
                            session_count: 1,
                            last_session: record.created_at,
                            risk_level: undefined // Will be calculated based on network data
                        });
                    } else {
                        const existing = protocolMap.get(key)!;
                        existing.session_count += 1;
                        if (new Date(record.created_at) > new Date(existing.last_session)) {
                            existing.last_session = record.created_at;
                        }
                    }
                });

                const protocolsArray = Array.from(protocolMap.values())
                    .sort((a, b) => b.session_count - a.session_count);

                setProtocols(protocolsArray);
            } catch (err) {
                console.error('Error fetching practitioner protocols:', err);
                setError(err instanceof Error ? err.message : 'Failed to fetch protocols');
                setProtocols([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProtocols();
    }, [user]);

    return { protocols, loading, error };
};
