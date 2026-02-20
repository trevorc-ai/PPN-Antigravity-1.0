import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export interface ReferenceData {
    substances: any[];
    routes: any[];
    indications: any[];
    modalities: any[];
    smokingStatus: any[];
    severityGrades: any[];
    safetyEvents: any[];
    resolutionStatus: any[];
    dosageUnits: any[];
    dosageFrequencies: any[];
    sex: any[];
    weightRanges: any[];
    settings: any[];
    loading: boolean;
    error: any;
}

// Module-level cache — reference tables don't change during a session.
// 13 simultaneous DB queries on every component mount was causing ThrottleException.
// This ensures the fetch fires ONCE per browser session regardless of how many
// components call useReferenceData().
let _cachedData: ReferenceData | null = null;
let _fetchPromise: Promise<ReferenceData> | null = null;

const EMPTY_STATE: ReferenceData = {
    substances: [], routes: [], indications: [], modalities: [],
    smokingStatus: [], severityGrades: [], safetyEvents: [],
    resolutionStatus: [], dosageUnits: [], dosageFrequencies: [],
    sex: [], weightRanges: [], settings: [], loading: true, error: null
};

async function fetchAllReferenceData(): Promise<ReferenceData> {
    // Return cached result immediately if available
    if (_cachedData) return _cachedData;

    // Deduplicate: if a fetch is already in-flight, wait for it
    if (_fetchPromise) return _fetchPromise;

    _fetchPromise = (async () => {
        try {
            const [subRes, routeRes, indRes, modRes, smokeRes, sevRes, safeRes,
                resRes, doseUnitRes, doseFreqRes, sexRes, weightRes, settingRes] = await Promise.all([
                    supabase.from('ref_substances').select('*').order('substance_name'),
                    supabase.from('ref_routes').select('*').order('route_name'),
                    supabase.from('ref_indications').select('*').order('indication_name'),
                    supabase.from('ref_support_modality').select('*').order('modality_name'),
                    supabase.from('ref_smoking_status').select('*').order('status_name'),
                    supabase.from('ref_severity_grade').select('*').order('grade_value'),
                    supabase.from('ref_safety_events').select('*').order('event_name'),
                    supabase.from('ref_resolution_status').select('*').order('status_name'),
                    supabase.from('ref_dosage_units').select('*').order('unit_label'),
                    supabase.from('ref_dosage_frequency').select('*').order('frequency_label'),
                    supabase.from('ref_sex').select('*').order('sex_label'),
                    supabase.from('ref_weight_ranges').select('*').order('sort_order'),
                    supabase.from('ref_settings').select('*').order('setting_label'),
                ]);

            const result: ReferenceData = {
                substances: subRes.data || [],
                routes: routeRes.data || [],
                indications: indRes.data || [],
                modalities: modRes.data || [],
                smokingStatus: smokeRes.data || [],
                severityGrades: sevRes.data || [],
                safetyEvents: safeRes.data || [],
                resolutionStatus: resRes.data || [],
                dosageUnits: doseUnitRes.data || [],
                dosageFrequencies: doseFreqRes.data || [],
                sex: sexRes.data || [],
                weightRanges: weightRes.data || [],
                settings: settingRes.data || [],
                loading: false,
                error: null,
            };

            _cachedData = result;
            return result;
        } catch (err) {
            console.error('[useReferenceData] Fetch failed:', err);
            _fetchPromise = null; // allow retry on next mount
            return { ...EMPTY_STATE, loading: false, error: err };
        }
    })();

    return _fetchPromise;
}

export const useReferenceData = (): ReferenceData => {
    const [data, setData] = useState<ReferenceData>(
        _cachedData ?? EMPTY_STATE  // use cache immediately if available
    );


    useEffect(() => {
        // If already cached, state was initialized with it — nothing to do
        if (_cachedData) return;

        // Otherwise fetch once (deduplicated at module level)
        fetchAllReferenceData().then(result => setData(result));
    }, []);

    return data;
};
