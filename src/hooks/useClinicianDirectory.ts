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

// Module-level cache — ref_practitioners is essentially static during a session.
// 10 minute TTL — avoids refetching on every ClinicianDirectory page visit.
const CACHE_TTL = 10 * 60 * 1000;
let _cachedPractitioners: Practitioner[] | null = null;
let _fetchedAt = 0;
let _fetchPromise: Promise<Practitioner[]> | null = null;

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

async function loadPractitioners(): Promise<Practitioner[]> {
    const now = Date.now();
    if (_cachedPractitioners && (now - _fetchedAt) < CACHE_TTL) return _cachedPractitioners;
    if (_fetchPromise) return _fetchPromise;

    _fetchPromise = (async () => {
        try {
            const { data, error } = await supabase
                .from('ref_practitioners')
                .select('*')
                .eq('is_active', true)
                .order('sort_order', { ascending: true });

            if (error || !data || data.length === 0) {
                _fetchPromise = null;
                return CLINICIANS as Practitioner[];
            }

            _cachedPractitioners = data.map(mapDbRowToPractitioner);
            _fetchedAt = Date.now();
            return _cachedPractitioners;
        } catch {
            _fetchPromise = null;
            return CLINICIANS as Practitioner[];
        }
    })();

    return _fetchPromise;
}

export function useClinicianDirectory() {
    const [practitioners, setPractitioners] = useState<Practitioner[]>(
        _cachedPractitioners ?? []
    );
    const [loading, setLoading] = useState(!_cachedPractitioners);
    const [source, setSource] = useState<'live' | 'fallback'>('fallback');

    useEffect(() => {
        if (_cachedPractitioners) {
            setPractitioners(_cachedPractitioners);
            setSource('live');
            setLoading(false);
            return;
        }

        loadPractitioners().then(result => {
            setPractitioners(result);
            setSource('live');
            setLoading(false);
        });
    }, []);

    return { practitioners, loading, source };
}
