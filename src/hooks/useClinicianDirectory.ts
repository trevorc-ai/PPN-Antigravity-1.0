import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { CLINICIANS } from '../constants';

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
    const [practitioners, setPractitioners] = useState<Practitioner[]>([]);
    const [loading, setLoading] = useState(true);
    const [source, setSource] = useState<'live' | 'fallback'>('fallback');

    useEffect(() => {
        const fetchPractitioners = async () => {
            try {
                const { data, error } = await supabase
                    .from('ref_practitioners')
                    .select('*')
                    .eq('is_active', true)
                    .order('sort_order', { ascending: true });

                if (error || !data || data.length === 0) {
                    // Graceful fallback to constants
                    setPractitioners(CLINICIANS as Practitioner[]);
                    setSource('fallback');
                } else {
                    setPractitioners(data.map(mapDbRowToPractitioner));
                    setSource('live');
                }
            } catch {
                // Network or unexpected error — fall back silently
                setPractitioners(CLINICIANS as Practitioner[]);
                setSource('fallback');
            } finally {
                setLoading(false);
            }
        };

        fetchPractitioners();
    }, []);

    return { practitioners, loading, source };
}
