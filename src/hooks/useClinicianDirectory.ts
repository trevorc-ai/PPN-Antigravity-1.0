import { supabase } from '../supabaseClient';
import { CLINICIANS } from '../constants';
import { useDataCache } from './useDataCache';

export interface Practitioner {
    id: string | number;
    name: string;
    role: string;
    location: string;
    imageUrl?: string;
    status: string;
    verificationLevel: string;
    modalities?: string[];
    accepting_clients?: boolean;
    verified?: boolean;
}

// Maps ref_practitioners DB row to the shape PractitionerCard expects
function mapDbRowToPractitioner(row: any): Practitioner {
    return {
        id: row.practitioner_id,
        name: row.display_name,
        role: row.role,
        location: `${row.location_city}, ${row.location_country}`,
        imageUrl: row.image_url || undefined,
        status: row.accepting_clients ? 'Active' : 'Not Accepting',
        verificationLevel: row.verification_level || 'L1',
        modalities: row.modalities || [],
        accepting_clients: row.accepting_clients,
        verified: row.verified,
    };
}

export function useClinicianDirectory() {
    const { data: cachedPractitioners, loading } = useDataCache(
        'clinician-directory',
        async () => {
            try {
                const { data, error } = await supabase
                    .from('ref_practitioners')
                    .select('*')
                    .eq('is_active', true)
                    .order('sort_order', { ascending: true });

                if (error || !data || data.length === 0) {
                    return { data: CLINICIANS as Practitioner[], error: null };
                }

                return { data: data.map(mapDbRowToPractitioner), error: null };
            } catch (err) {
                return { data: CLINICIANS as Practitioner[], error: err };
            }
        },
        { ttl: 10 * 60 * 1000 } // 10 minutes
    );

    return {
        practitioners: cachedPractitioners || (CLINICIANS as Practitioner[]),
        loading,
        source: cachedPractitioners && cachedPractitioners.length > 0 && cachedPractitioners !== CLINICIANS ? 'live' : 'fallback'
    };
}
