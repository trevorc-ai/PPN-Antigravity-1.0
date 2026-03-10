import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export interface ProtocolIntelligenceData {
    successRates: SuccessRateMetric[];
    safetyScores: SafetyMetric[];
    networkBenchmarks: NetworkBenchmark[];
    lastRefreshed: Date | null;
    loading: boolean;
    error: string | null;
}

export interface SuccessRateMetric {
    substance_name: string;
    indication_name: string;
    remission_rate: number;
    response_rate: number;
    unique_patients: number;
    confidence_level: number;
}

export interface SafetyMetric {
    substance_name: string;
    total_sessions: number;
    adverse_event_rate: number;
    risk_category: string;
}

export interface NetworkBenchmark {
    substance_id: number;
    indication_id: number;
    network_success_rate: number;
    network_response_rate: number;
    participating_sites: number;
    unique_patients: number;
}

export const useProtocolIntelligence = (siteId: string | null) => {
    const [data, setData] = useState<ProtocolIntelligenceData>({
        successRates: [],
        safetyScores: [],
        networkBenchmarks: [],
        lastRefreshed: null,
        loading: true,
        error: null,
    });

    const fetchData = async () => {
        // Guard: no site_id means no data to fetch
        if (!siteId) {
            setData(prev => ({ ...prev, loading: false }));
            return;
        }

        try {
            setData(prev => ({ ...prev, loading: true, error: null }));

            // Query 1: Get clinical records for this site
            // Group by substance + patient to build success rate proxy
            const { data: records, error: recordsError } = await supabase
                .from('log_clinical_records')
                .select(`
                    patient_uuid,
                    substance_id,
                    safety_event_id,
                    ref_substances(substance_name)
                `)
                .eq('site_id', siteId);

            if (recordsError) throw recordsError;

            // Query 2: Get all patient indications for the patients in these records
            const patientUuids = [
                ...new Set((records || []).map((r: any) => r.patient_uuid).filter(Boolean))
            ];

            const { data: indications } = patientUuids.length > 0
                ? await supabase
                    .from('log_patient_indications')
                    .select('patient_uuid, indication_id, is_primary, ref_indications(indication_name)')
                    .in('patient_uuid', patientUuids)
                : { data: [] };

            // Build patient → primary indication map
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

            // Aggregate success rates by substance + indication
            type AggKey = string;
            const aggMap = new Map<AggKey, {
                substance_name: string;
                indication_name: string;
                total: number;
                adverse: number;
                unique_patients: Set<string>;
            }>();

            for (const record of (records || []) as any[]) {
                const substanceName = record.ref_substances?.substance_name || 'Unknown';
                const patientInd = patientIndicationMap.get(record.patient_uuid);
                const key = `${record.substance_id}-${patientInd?.indication_id ?? 'none'}`;

                if (!aggMap.has(key)) {
                    aggMap.set(key, {
                        substance_name: substanceName,
                        indication_name: patientInd?.indication_name || 'Unknown Indication',
                        total: 0,
                        adverse: 0,
                        unique_patients: new Set(),
                    });
                }

                const agg = aggMap.get(key)!;
                agg.total += 1;
                if (record.safety_event_id !== null) agg.adverse += 1;
                if (record.patient_uuid) agg.unique_patients.add(record.patient_uuid);
            }

            const successRates: SuccessRateMetric[] = Array.from(aggMap.values())
                .filter(agg => agg.total > 0)
                .map(agg => ({
                    substance_name: agg.substance_name,
                    indication_name: agg.indication_name,
                    remission_rate: agg.total > 0 ? Math.round(((agg.total - agg.adverse) / agg.total) * 100) / 100 : 0,
                    response_rate: agg.total > 0 ? Math.round(((agg.total - agg.adverse) / agg.total) * 100) / 100 : 0,
                    unique_patients: agg.unique_patients.size,
                    confidence_level: Math.min(agg.unique_patients.size / 10, 1), // crude confidence proxy
                }))
                .sort((a, b) => b.unique_patients - a.unique_patients)
                .slice(0, 10);

            // Safety scores per substance
            const safetyMap = new Map<number, { substance_name: string; total: number; adverse: number }>();
            for (const record of (records || []) as any[]) {
                if (!safetyMap.has(record.substance_id)) {
                    safetyMap.set(record.substance_id, {
                        substance_name: record.ref_substances?.substance_name || 'Unknown',
                        total: 0,
                        adverse: 0,
                    });
                }
                const s = safetyMap.get(record.substance_id)!;
                s.total += 1;
                if (record.safety_event_id !== null) s.adverse += 1;
            }

            const safetyScores: SafetyMetric[] = Array.from(safetyMap.values()).map(s => {
                const rate = s.total > 0 ? s.adverse / s.total : 0;
                return {
                    substance_name: s.substance_name,
                    total_sessions: s.total,
                    adverse_event_rate: Math.round(rate * 1000) / 10,
                    risk_category: rate < 0.05 ? 'Low' : rate < 0.15 ? 'Medium' : 'High',
                };
            });

            setData({
                successRates,
                safetyScores,
                // TODO: Network benchmarks require cross-site aggregation — deferred to future milestone.
                // When ready, seed ref_benchmark_cohorts + ref_population_baselines and query here.
                networkBenchmarks: [],
                lastRefreshed: new Date(),
                loading: false,
                error: null,
            });

        } catch (err: any) {
            console.error('Protocol Intelligence fetch error:', err);
            setData(prev => ({
                ...prev,
                loading: false,
                error: err.message || 'Failed to load protocol intelligence data',
            }));
        }
    };

    const refreshData = async () => {
        await fetchData();
    };

    useEffect(() => {
        fetchData();
    }, [siteId]);

    return { ...data, refreshData };
};
