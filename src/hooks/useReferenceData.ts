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
    loading: boolean;
    error: any;
}

export const useReferenceData = (): ReferenceData => {
    const [data, setData] = useState<ReferenceData>({
        substances: [],
        routes: [],
        indications: [],
        modalities: [],
        loading: true,
        error: null
    });

    useEffect(() => {
        const fetchRefs = async () => {
            try {
                const [subRes, routeRes, indRes, modRes, smokeRes, sevRes, safeRes] = await Promise.all([
                    supabase.from('ref_substances').select('*').order('substance_name'),
                    supabase.from('ref_routes').select('*').order('route_name'),
                    supabase.from('ref_indications').select('*').order('indication_name'),
                    supabase.from('ref_support_modality').select('*').order('modality_name'),
                    supabase.from('ref_smoking_status').select('*').order('status_name'),
                    supabase.from('ref_severity_grade').select('*').order('grade_value'),
                    supabase.from('ref_safety_events').select('*').order('event_name')
                ]);

                if (subRes.error) throw subRes.error;
                if (routeRes.error) throw routeRes.error;
                if (indRes.error) throw indRes.error;
                if (modRes.error) throw modRes.error;
                if (smokeRes.error) throw smokeRes.error;
                if (sevRes.error) throw sevRes.error;
                if (safeRes.error) throw safeRes.error;

                setData({
                    substances: subRes.data || [],
                    routes: routeRes.data || [],
                    indications: indRes.data || [],
                    modalities: modRes.data || [],
                    smokingStatus: smokeRes.data || [],
                    severityGrades: sevRes.data || [],
                    safetyEvents: safeRes.data || [],
                    loading: false,
                    error: null
                });
            } catch (err) {
                console.error('Error fetching reference data:', err);
                // Fallback or keep empty
                setData(prev => ({ ...prev, loading: false, error: err }));
            }
        };

        fetchRefs();
    }, []);

    return data;
};
