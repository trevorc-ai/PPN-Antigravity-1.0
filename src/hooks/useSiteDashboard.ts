import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

/**
 * useSiteDashboard — WO-697
 *
 * Source: mv_site_dashboard_summary (capability #10 — site dashboard rollups)
 * Zero-state: returns null when site has no data — render "—" gracefully, not 0.
 *
 * Site resolution: queries log_clinical_records by practitioner_id to find
 * the site_id for the current user, then fetches the matching MV row.
 *
 * If no site_id can be resolved (new user with 0 sessions), returns null.
 */

export interface SiteDashboardData {
  site_id: string;
  /** Ratio 0-1: proportion of expected follow-up windows completed */
  followup_completion_rate: number | null;
  /** Integer count of currently unresolved safety events */
  unresolved_safety_count: number | null;
  /** Ratio 0-1: average documentation completeness score across sessions */
  documentation_completeness_pct: number | null;
  /** Count of sessions with PHQ-9 delta < 0 (improving) */
  improving_count: number | null;
  /** Total sessions with at least one follow-up outcome */
  total_sessions_with_outcomes: number | null;
  /** Average PHQ-9 delta across the site */
  avg_phq9_delta: number | null;
  /** Average GAD-7 delta across the site */
  avg_gad7_delta: number | null;
}

export interface UseSiteDashboardResult {
  data: SiteDashboardData | null;
  loading: boolean;
  error: string | null;
}

export function useSiteDashboard(practitionerId: string | null | undefined): UseSiteDashboardResult {
  const [data, setData] = useState<SiteDashboardData | null>(null);
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
        // Step 1: resolve site_id from the practitioner's existing sessions
        const { data: siteRow } = await supabase
          .from('log_clinical_records')
          .select('site_id')
          .eq('practitioner_id', practitionerId)
          .not('site_id', 'is', null)
          .limit(1)
          .maybeSingle();

        if (cancelled) return;

        // Step 2: if no sessions exist yet, return null gracefully
        if (!siteRow?.site_id) {
          setData(null);
          setLoading(false);
          return;
        }

        const siteId = siteRow.site_id as string;

        // Step 3: fetch the MV row for this site
        // Source: mv_site_dashboard_summary (capability #10 — site dashboard rollups)
        // Zero-state: returns null when site has no data — component renders "—" not 0
        const { data: mvRow, error: mvErr } = await supabase
          .from('mv_site_dashboard_summary')
          .select('*')
          .eq('site_id', siteId)
          .maybeSingle();

        if (cancelled) return;

        if (mvErr) {
          setError(`Dashboard MV query failed: ${mvErr.message}`);
          setData(null);
          return;
        }

        if (!mvRow) {
          // Site exists but no MV data yet (new site, data not yet rolled up)
          setData(null);
          return;
        }

        // Map MV row to typed interface
        // Column names reflect the actual mv_site_dashboard_summary structure
        // as documented in PPN_Database_Update_Synopsis_2026-03-26.md
        const mapped: SiteDashboardData = {
          site_id: siteId,
          followup_completion_rate: (mvRow as any).followup_completion_rate ?? null,
          unresolved_safety_count: (mvRow as any).unresolved_safety_count ?? null,
          documentation_completeness_pct: (mvRow as any).avg_completeness_score ?? null,
          improving_count: (mvRow as any).improving_count ?? null,
          total_sessions_with_outcomes: (mvRow as any).sessions_with_outcomes ?? null,
          avg_phq9_delta: (mvRow as any).avg_phq9_delta ?? null,
          avg_gad7_delta: (mvRow as any).avg_gad7_delta ?? null,
        };

        setData(mapped);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'useSiteDashboard error';
        console.error('[useSiteDashboard]', msg); // allow-console
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

export default useSiteDashboard;
