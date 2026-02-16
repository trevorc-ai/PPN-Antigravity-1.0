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

export const useReferenceData = (): ReferenceData => {
    const [data, setData] = useState<ReferenceData>({
        substances: [],
        routes: [],
        indications: [],
        modalities: [],
        smokingStatus: [],
        severityGrades: [],
        safetyEvents: [],
        resolutionStatus: [],
        dosageUnits: [],
        dosageFrequencies: [],
        sex: [],
        weightRanges: [],
        settings: [],
        loading: true,
        error: null
    });

    useEffect(() => {
        const fetchRefs = async () => {
            try {
                const [subRes, routeRes, indRes, modRes, smokeRes, sevRes, safeRes, resRes, doseUnitRes, doseFreqRes, sexRes, weightRes, settingRes] = await Promise.all([
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
                    supabase.from('ref_settings').select('*').order('setting_label')
                ]);

                // Log errors but don't throw - fail gracefully
                if (subRes.error) console.log('Error fetching substances:', subRes.error);
                if (routeRes.error) console.log('Error fetching routes:', routeRes.error);
                if (indRes.error) console.log('Error fetching indications:', indRes.error);
                if (modRes.error) console.log('Error fetching modalities:', modRes.error);
                if (smokeRes.error) console.log('Error fetching smoking status:', smokeRes.error);
                if (sevRes.error) console.log('Error fetching severity grades:', sevRes.error);
                if (safeRes.error) console.log('Error fetching safety events:', safeRes.error);

                setData({
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
                    error: null
                });
            } catch (err) {
                console.log('Error fetching reference data (non-critical):', err);
                // Fail gracefully - set empty data instead of crashing
                setData(prev => ({ ...prev, loading: false, error: err }));
            }
        };

        fetchRefs();
    }, []);

    return data;
};
