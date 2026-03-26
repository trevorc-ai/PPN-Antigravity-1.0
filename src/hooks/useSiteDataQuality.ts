import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

/**
 * useSiteDataQuality — WO-701
 *
 * Sources:
 *   - mv_site_documentation_summary (capability #6 — documentation completeness)
 *   - mv_site_followup_compliance (capability #5 — follow-up compliance) 
 *   - log_clinical_records direct count (protocol_id gap, safety event gap)
 *
 * Zero-state: returns null when site has 0 sessions.
 */

export interface FollowupWindowCompliance {
  expected_day: number;
  total_expected: number;
  total_completed: number;
  completion_rate: number | null;
}

export interface SiteDataQuality {
  site_id: string;
  // mv_site_documentation_summary
  avg_completeness_score: number | null;   // 0–1
  total_sessions: number | null;
  // Direct counts from log_clinical_records + log_safety_events
  sessions_with_protocol_id: number | null;
  sessions_without_protocol_id: number | null;
  sessions_with_safety_events: number | null;
  // mv_site_followup_compliance per expected window
  followup_compliance: FollowupWindowCompliance[];
  // Derived rollup
  overall_followup_completion_rate: number | null;
}

export interface UseSiteDataQualityResult {
  data: SiteDataQuality | null;
  loading: boolean;
  error: string | null;
}

export function useSiteDataQuality(
  practitionerId: string | null | undefined,
): UseSiteDataQualityResult {
  const [data, setData] = useState<SiteDataQuality | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!practitionerId) {
      setData(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        // Step 1: resolve site_id
        const { data: siteRow } = await supabase
          .from('log_clinical_records')
          .select('site_id')
          .eq('practitioner_id', practitionerId)
          .not('site_id', 'is', null)
          .limit(1)
          .maybeSingle();

        if (cancelled) return;

        if (!siteRow?.site_id) {
          setData(null);
          setLoading(false);
          return;
        }

        const siteId = siteRow.site_id as string;

        // Step 2: Parallel fetch — documentation summary, followup compliance, protocol gap, safety gap
        const [docResult, followupResult, totalSessionsResult, withProtocolResult, safetyResult] = await Promise.all([
          // mv_site_documentation_summary
          supabase
            .from('mv_site_documentation_summary')
            .select('avg_completeness_score, total_sessions')
            .eq('site_id', siteId)
            .maybeSingle(),

          // mv_site_followup_compliance
          supabase
            .from('mv_site_followup_compliance')
            .select('expected_day, total_expected, total_completed, completion_rate')
            .eq('site_id', siteId)
            .order('expected_day', { ascending: true }),

          // Total session count
          supabase
            .from('log_clinical_records')
            .select('id', { count: 'exact', head: true })
            .eq('site_id', siteId),

          // Sessions WITH protocol_id
          supabase
            .from('log_clinical_records')
            .select('id', { count: 'exact', head: true })
            .eq('site_id', siteId)
            .not('protocol_id', 'is', null),

          // Sessions WITH at least one safety event (via distinct inner join count)
          supabase
            .from('log_safety_events')
            .select('session_id', { count: 'exact', head: true })
            .not('session_id', 'is', null),
        ]);

        if (cancelled) return;

        const totalSessions = totalSessionsResult.count ?? 0;
        const withProtocol = withProtocolResult.count ?? 0;
        const safetySessions = safetyResult.count ?? 0;
        const docRow = docResult.data as any;
        const followupRows = (followupResult.data ?? []) as FollowupWindowCompliance[];

        const overallFollowup =
          followupRows.length > 0
            ? followupRows.reduce((sum, r) => sum + (r.completion_rate ?? 0), 0) /
              followupRows.length
            : null;

        setData({
          site_id: siteId,
          avg_completeness_score: docRow?.avg_completeness_score ?? null,
          total_sessions: docRow?.total_sessions ?? totalSessions,
          sessions_with_protocol_id: withProtocol,
          sessions_without_protocol_id: totalSessions - withProtocol,
          sessions_with_safety_events: safetySessions,
          followup_compliance: followupRows,
          overall_followup_completion_rate: overallFollowup,
        });
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'useSiteDataQuality error';
        console.error('[useSiteDataQuality]', msg); // allow-console
        if (!cancelled) setError(msg);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [practitionerId]);

  return { data, loading, error };
}

export default useSiteDataQuality;
