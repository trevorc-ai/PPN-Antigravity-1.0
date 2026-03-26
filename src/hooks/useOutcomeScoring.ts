import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

/**
 * WO-687 — useOutcomeScoring
 *
 * Computational engine for clinical responder/remission status.
 * Consumes live assessment scores — NEVER returns synthetic values.
 *
 * Algorithm IDs (governed, version-locked):
 *   OUTCOME_RESPONSE_PHQ9_V1  — 50% reduction from baseline; remission < 5
 *   OUTCOME_RESPONSE_GAD7_V1  — 50% reduction from baseline; remission < 5
 *   OUTCOME_RESPONSE_PCL5_V1  — 50% reduction from baseline; remission < 20
 *   OUTCOME_RESPONSE_CAPS5_V1 — not_computable (no CAPS-5 column in live schema as of 2026-03)
 *   OUTCOME_RESPONSE_MADRS_V1 — not_computable (no MADRS column in live schema as of 2026-03)
 *
 * Data sources (schema verified 2026-03-25):
 *   Baseline:  log_baseline_assessments   (phq9_score, gad7_score, pcl5_score, assessment_date)
 *   Follow-up: log_longitudinal_assessments (phq9_score, gad7_score, assessment_date, days_post_session)
 *
 * Blocking rules (per WO-687 spec):
 *   - No baseline → confidence = 'not_computable', flags = null
 *   - Duplicate baselines → confidence = 'provisional', flags computed from earliest
 *   - No follow-up → confidence = 'not_computable', flags = null
 *   - Neither score → missing_data_flag = true, flags = null
 */

export type InstrumentCode = 'PHQ9' | 'GAD7' | 'CAPS5' | 'MADRS' | 'PCL5';

export interface OutcomeScore {
    instrument_code: InstrumentCode;
    baseline_score: number | null;
    latest_score: number | null;
    baseline_date: string | null;
    latest_date: string | null;
    window_days: number | null;
    absolute_change: number | null;
    percent_change: number | null;
    response_flag: boolean | null;
    remission_flag: boolean | null;
    response_definition: string;
    remission_definition: string;
    confidence: 'rule_based' | 'provisional' | 'not_computable';
    algorithm_id: string;
    missing_data_flag: boolean;
}

// ── Instrument configuration ────────────────────────────────────────────────

interface InstrumentConfig {
    baselineField: string | null;
    longitudinalField: string | null;
    remissionThreshold: number | null;
    responseDefinition: string;
    remissionDefinition: string;
    algorithmId: string;
}

const INSTRUMENT_CONFIG: Record<InstrumentCode, InstrumentConfig> = {
    PHQ9: {
        baselineField: 'phq9_score',
        longitudinalField: 'phq9_score',
        remissionThreshold: 5,
        responseDefinition: '≥ 50% reduction from baseline PHQ-9 score',
        remissionDefinition: 'PHQ-9 < 5 (minimal symptoms)',
        algorithmId: 'OUTCOME_RESPONSE_PHQ9_V1',
    },
    GAD7: {
        baselineField: 'gad7_score',
        longitudinalField: 'gad7_score',
        remissionThreshold: 5,
        responseDefinition: '≥ 50% reduction from baseline GAD-7 score',
        remissionDefinition: 'GAD-7 < 5 (minimal anxiety)',
        algorithmId: 'OUTCOME_RESPONSE_GAD7_V1',
    },
    PCL5: {
        baselineField: 'pcl5_score',
        longitudinalField: null, // PCL-5 not collected in log_longitudinal_assessments
        remissionThreshold: 20,
        responseDefinition: '≥ 50% reduction from baseline PCL-5 score',
        remissionDefinition: 'PCL-5 < 20 (below clinical threshold)',
        algorithmId: 'OUTCOME_RESPONSE_PCL5_V1',
    },
    CAPS5: {
        baselineField: null, // Not in live schema as of 2026-03-25
        longitudinalField: null,
        remissionThreshold: 20,
        responseDefinition: '≥ 50% reduction from baseline CAPS-5 score',
        remissionDefinition: 'CAPS-5 < 20',
        algorithmId: 'OUTCOME_RESPONSE_CAPS5_V1',
    },
    MADRS: {
        baselineField: null, // Not in live schema as of 2026-03-25
        longitudinalField: null,
        remissionThreshold: 10,
        responseDefinition: '≥ 50% reduction from baseline MADRS score',
        remissionDefinition: 'MADRS < 10 (in remission)',
        algorithmId: 'OUTCOME_RESPONSE_MADRS_V1',
    },
};

// ── Helper ───────────────────────────────────────────────────────────────────

function daysBetween(a: string, b: string): number {
    return Math.round((new Date(b).getTime() - new Date(a).getTime()) / (1000 * 60 * 60 * 24));
}

type BaselineRow = {
    assessment_date: string;
    phq9_score?: number | null;
    gad7_score?: number | null;
    pcl5_score?: number | null;
};

type LongitudinalRow = {
    assessment_date: string;
    days_post_session?: number | null;
    phq9_score?: number | null;
    gad7_score?: number | null;
};

// ── Main hook ────────────────────────────────────────────────────────────────

export function useOutcomeScoring(
    patientUuid: string | null | undefined,
    instrumentCode: InstrumentCode,
): { data: OutcomeScore | null; loading: boolean; error: string | null } {
    const [data, setData] = useState<OutcomeScore | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!patientUuid) {
            setData(null);
            setLoading(false);
            return;
        }

        let cancelled = false;

        async function compute() {
            setLoading(true);
            setError(null);

            const config = INSTRUMENT_CONFIG[instrumentCode];

            // Fast path — instrument not in live schema
            if (!config.baselineField && !config.longitudinalField) {
                if (!cancelled) {
                    setData({
                        instrument_code: instrumentCode,
                        baseline_score: null,
                        latest_score: null,
                        baseline_date: null,
                        latest_date: null,
                        window_days: null,
                        absolute_change: null,
                        percent_change: null,
                        response_flag: null,
                        remission_flag: null,
                        response_definition: config.responseDefinition,
                        remission_definition: config.remissionDefinition,
                        confidence: 'not_computable',
                        algorithm_id: config.algorithmId,
                        missing_data_flag: true,
                    });
                    setLoading(false);
                }
                return;
            }

            try {
                // ── Fetch baseline scores ───────────────────────────────────
                let baselineScore: number | null = null;
                let baselineDate: string | null = null;
                let duplicateBaseline = false;

                if (config.baselineField) {
                    const { data: baselineRows, error: baselineErr } = await supabase
                        .from('log_baseline_assessments')
                        .select(`assessment_date, ${config.baselineField}`)
                        .eq('patient_uuid', patientUuid)
                        .order('assessment_date', { ascending: true });

                    if (baselineErr) throw baselineErr;

                    const validBaselineRows = (baselineRows as BaselineRow[] || [])
                        .filter(r => r[config.baselineField as keyof BaselineRow] != null);

                    if (validBaselineRows.length > 1) duplicateBaseline = true;

                    if (validBaselineRows.length > 0) {
                        const first = validBaselineRows[0];
                        baselineScore = first[config.baselineField as keyof BaselineRow] as number;
                        baselineDate = first.assessment_date;
                    }
                }

                // ── Fetch latest follow-up score ────────────────────────────
                let latestScore: number | null = null;
                let latestDate: string | null = null;

                if (config.longitudinalField) {
                    const { data: longitudinalRows, error: longErr } = await supabase
                        .from('log_longitudinal_assessments')
                        .select(`assessment_date, days_post_session, ${config.longitudinalField}`)
                        .eq('patient_uuid', patientUuid)
                        .order('assessment_date', { ascending: false })
                        .limit(20);

                    if (longErr) throw longErr;

                    const validLongRows = (longitudinalRows as LongitudinalRow[] || [])
                        .filter(r => r[config.longitudinalField as keyof LongitudinalRow] != null);

                    if (validLongRows.length > 0) {
                        const latest = validLongRows[0];
                        latestScore = latest[config.longitudinalField as keyof LongitudinalRow] as number;
                        latestDate = latest.assessment_date;
                    }
                }

                // ── Blocking rules ──────────────────────────────────────────
                const missingBaseline = baselineScore == null;
                const missingFollowUp = latestScore == null;
                const missingData = missingBaseline || missingFollowUp;

                let confidence: OutcomeScore['confidence'];
                let responseFlag: boolean | null = null;
                let remissionFlag: boolean | null = null;
                let absoluteChange: number | null = null;
                let percentChange: number | null = null;
                let windowDays: number | null = null;

                if (missingBaseline || missingFollowUp) {
                    // WO-687 blocking rules: never return true flags without both scores
                    confidence = 'not_computable';
                } else {
                    // Both scores present — compute
                    absoluteChange = latestScore! - baselineScore!;
                    percentChange = baselineScore! !== 0
                        ? (baselineScore! - latestScore!) / baselineScore!
                        : null;

                    responseFlag = percentChange != null ? percentChange >= 0.50 : null;
                    remissionFlag = config.remissionThreshold != null
                        ? latestScore! < config.remissionThreshold
                        : null;

                    confidence = duplicateBaseline ? 'provisional' : 'rule_based';

                    if (baselineDate && latestDate) {
                        windowDays = daysBetween(baselineDate, latestDate);
                    }
                }

                if (!cancelled) {
                    setData({
                        instrument_code: instrumentCode,
                        baseline_score: baselineScore,
                        latest_score: latestScore,
                        baseline_date: baselineDate,
                        latest_date: latestDate,
                        window_days: windowDays,
                        absolute_change: absoluteChange,
                        percent_change: percentChange,
                        response_flag: responseFlag,
                        remission_flag: remissionFlag,
                        response_definition: config.responseDefinition,
                        remission_definition: config.remissionDefinition,
                        confidence,
                        algorithm_id: config.algorithmId,
                        missing_data_flag: missingData,
                    });
                }
            } catch (err: unknown) {
                const message = err instanceof Error ? err.message : 'Failed to compute outcome score';
                console.error('[useOutcomeScoring] error:', message); // allow-console
                if (!cancelled) setError(message);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        compute();
        return () => { cancelled = true; };
    }, [patientUuid, instrumentCode]);

    return { data, loading, error };
}
