import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export interface CompassOutcomePoint {
    daysPostSession: number;
    phq9Score: number | null;
    gad7Score: number | null;
    phq2Score: number | null;
    gad2Score: number | null;
}

export interface CompassOutcomesData {
    points: CompassOutcomePoint[];
    baselinePhq9: number | null;
    baselineGad7: number | null;
    hasData: boolean;
    isLoading: boolean;
    error: string | null;
}

export function useCompassOutcomes(
    sessionId: string | undefined,
    patientUuid: string | null | undefined
): CompassOutcomesData {
    const [state, setState] = useState<CompassOutcomesData>({
        points: [],
        baselinePhq9: null,
        baselineGad7: null,
        hasData: false,
        isLoading: true,
        error: null,
    });

    useEffect(() => {
        if (!sessionId) {
            setState(s => ({ ...s, isLoading: false }));
            return;
        }

        let cancelled = false;

        const fetch = async () => {
            try {
                // Longitudinal assessments (post-session scores over time)
                const { data: longRows, error: longErr } = await supabase
                    .from('log_longitudinal_assessments')
                    .select('days_post_session, phq9_score, gad7_score, phq2_score, gad2_score')
                    .eq('session_id', sessionId)
                    .order('days_post_session', { ascending: true });

                if (longErr) throw longErr;

                const points: CompassOutcomePoint[] = (longRows ?? []).map(r => ({
                    daysPostSession: r.days_post_session,
                    phq9Score: r.phq9_score ?? null,
                    gad7Score: r.gad7_score ?? null,
                    phq2Score: r.phq2_score ?? null,
                    gad2Score: r.gad2_score ?? null,
                }));

                // Baseline assessments
                let baselinePhq9: number | null = null;
                let baselineGad7: number | null = null;

                if (patientUuid) {
                    const { data: baseline } = await supabase
                        .from('log_baseline_assessments')
                        .select('phq9_score, gad7_score')
                        .eq('patient_uuid', patientUuid)
                        .order('created_at', { ascending: false })
                        .limit(1)
                        .single();

                    baselinePhq9 = baseline?.phq9_score ?? null;
                    baselineGad7 = baseline?.gad7_score ?? null;
                }

                if (!cancelled) {
                    setState({
                        points,
                        baselinePhq9,
                        baselineGad7,
                        hasData: points.length > 0,
                        isLoading: false,
                        error: null,
                    });
                }
            } catch (err: any) {
                if (!cancelled) {
                    setState(s => ({ ...s, isLoading: false, error: err?.message ?? 'Load error' }));
                }
            }
        };

        fetch();
        return () => { cancelled = true; };
    }, [sessionId, patientUuid]);

    return state;
}
