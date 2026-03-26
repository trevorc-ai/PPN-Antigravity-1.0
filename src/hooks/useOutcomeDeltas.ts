import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

/**
 * useOutcomeDeltas — WO-698
 *
 * Source: mv_outcome_deltas_by_timepoint
 * (capability #3 — session-to-follow-up delta analytics)
 *
 * Zero-state: returns [] when no follow-up assessments exist — component renders
 * "Baseline-to-follow-up data not yet available".
 *
 * Accepts either sessionId (for session-specific view) OR siteId (for site aggregate).
 * Do NOT pass both — sessionId takes precedence if both are provided.
 */

export interface OutcomeDeltas {
  patient_uuid: string | null;
  session_id: string | null;
  baseline_assessment_date: string | null;
  f_assessment_date: string | null;
  timepoint_days: number | null;
  baseline_phq9: number | null;
  f_phq9: number | null;
  phq9_delta: number | null;
  baseline_gad7: number | null;
  f_gad7: number | null;
  gad7_delta: number | null;
}

export interface UseOutcomeDeltasResult {
  data: OutcomeDeltas[];
  loading: boolean;
  error: string | null;
}

export function useOutcomeDeltas(params: {
  sessionId?: string | null;
  siteId?: string | null;
}): UseOutcomeDeltasResult {
  const { sessionId, siteId } = params;
  const [data, setData] = useState<OutcomeDeltas[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId && !siteId) {
      setData([]);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        // Source: mv_outcome_deltas_by_timepoint (capability #3 — session-to-follow-up delta analytics)
        // Zero-state: returns [] when no follow-up assessments exist
        let query = supabase
          .from('mv_outcome_deltas_by_timepoint')
          .select(
            'patient_uuid,session_id,baseline_assessment_date,f_assessment_date,timepoint_days,baseline_phq9,f_phq9,phq9_delta,baseline_gad7,f_gad7,gad7_delta',
          )
          .order('timepoint_days', { ascending: true });

        // sessionId takes precedence over siteId
        if (sessionId) {
          query = query.eq('session_id', sessionId);
        } else if (siteId) {
          query = query.eq('site_id', siteId);
        }

        const { data: rows, error: fetchErr } = await query;

        if (cancelled) return;

        if (fetchErr) {
          setError(`useOutcomeDeltas: ${fetchErr.message}`);
          setData([]);
          return;
        }

        setData((rows ?? []) as OutcomeDeltas[]);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'useOutcomeDeltas error';
        if (!cancelled) setError(msg);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [sessionId, siteId]);

  return { data, loading, error };
}

export default useOutcomeDeltas;
