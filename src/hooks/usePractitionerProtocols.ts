import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../supabaseClient';
import { useDataCache } from './useDataCache';

interface Protocol {
    substance_id: number;
    substance_name: string;
    indication_id: number | null;
    indication_name: string;
    session_count: number;
    last_session: string;
    risk_level?: 'low' | 'medium' | 'high';
}

export const usePractitionerProtocols = () => {
    const { user } = useAuth();

    const fetchProtocols = async () => {
        try {
            // Step 1: Get the practitioner's site_id
            const { data: userSite, error: userSiteError } = await supabase
                .from('log_user_sites')
                .select('site_id')
                .eq('user_id', user!.id)
                .maybeSingle(); // maybeSingle — won't throw if no row exists

            if (userSiteError) throw userSiteError;
            if (!userSite) return { data: [], error: null };

            const ninetyDaysAgo = new Date();
            ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

            // Step 2: Get all clinical records for this site in the last 90 days
            // patient_uuid links to log_patient_indications; substance is joined inline
            const { data: records, error: recordsError } = await supabase
                .from('log_clinical_records')
                .select(`
                    patient_uuid,
                    substance_id,
                    created_at,
                    ref_substances!inner(substance_name)
                `)
                .eq('site_id', userSite.site_id)
                .gte('created_at', ninetyDaysAgo.toISOString())
                .order('created_at', { ascending: false });

            if (recordsError) throw recordsError;
            if (!records || records.length === 0) return { data: [], error: null };

            // Step 3: Get all unique patient_uuids from those records
            const patientUuids = [...new Set(records.map((r: any) => r.patient_uuid).filter(Boolean))];

            // Step 4: Fetch primary indication per patient from log_patient_indications
            const { data: indications, error: indicationsError } = await supabase
                .from('log_patient_indications')
                .select(`
                    patient_uuid,
                    indication_id,
                    is_primary,
                    ref_indications!inner(indication_name)
                `)
                .in('patient_uuid', patientUuids);

            if (indicationsError) throw indicationsError;

            // Build patient → primary indication map
            // If a patient has multiple, prefer is_primary = true, else take first
            const patientIndicationMap = new Map<string, { indication_id: number; indication_name: string }>();
            for (const ind of (indications || []) as any[]) {
                const existing = patientIndicationMap.get(ind.patient_uuid);
                if (!existing || ind.is_primary) {
                    patientIndicationMap.set(ind.patient_uuid, {
                        indication_id: ind.indication_id,
                        indication_name: ind.ref_indications?.indication_name || 'Unknown',
                    });
                }
            }

            // Step 5: Group sessions by substance + indication (patient-centric protocol view)
            const protocolMap = new Map<string, Protocol>();

            for (const record of records as any[]) {
                const substanceName = record.ref_substances?.substance_name || 'Unknown';
                const patientInd = patientIndicationMap.get(record.patient_uuid);
                const indicationId = patientInd?.indication_id ?? null;
                const indicationName = patientInd?.indication_name ?? 'Unknown Indication';

                const key = `${record.substance_id}-${indicationId ?? 'none'}`;

                if (!protocolMap.has(key)) {
                    protocolMap.set(key, {
                        substance_id: record.substance_id,
                        substance_name: substanceName,
                        indication_id: indicationId,
                        indication_name: indicationName,
                        session_count: 1,
                        last_session: record.created_at,
                        risk_level: undefined,
                    });
                } else {
                    const existing = protocolMap.get(key)!;
                    existing.session_count += 1;
                    if (new Date(record.created_at) > new Date(existing.last_session)) {
                        existing.last_session = record.created_at;
                    }
                }
            }

            const protocolsArray = Array.from(protocolMap.values())
                .sort((a, b) => b.session_count - a.session_count);

            return { data: protocolsArray, error: null };
        } catch (err) {
            console.error('Error fetching practitioner protocols:', err);
            return { data: null, error: err };
        }
    };

    const { data: protocols, loading, error, refetch, lastFetchedAt } = useDataCache<Protocol[]>(
        `practitioner-protocols-${user?.id}`,
        fetchProtocols,
        { ttl: 5 * 60 * 1000, enabled: !!user }
    );

    return {
        protocols: protocols || [],
        loading,
        error,
        refetch,
        lastFetchedAt,
    };
};
