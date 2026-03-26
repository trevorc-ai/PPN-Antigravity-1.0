import { supabase } from '../supabaseClient';
import { useDataCache } from './useDataCache';

/**
 * WO-677 — ClinicPerformanceRadar Live Data Hook
 *
 * Computes radar-chart spoke values from real session and safety data.
 * Applies minimum-n suppression: < 20 non-draft sessions → suppressed: true.
 *
 * Spoke definitions (documented per WO requirement):
 *   Safety     = (sessions without any adverse event) / total sessions × 100
 *   Completion = sessions with session_status ≠ 'draft' AND substance_id IS NOT NULL / all non-draft sessions × 100
 *   DataQuality= sessions with both session_date AND substance_id populated / total sessions × 100
 *   Consent    = sessions that have ≥1 row in log_phase1_consent / total sessions × 100
 *   Efficacy   = SUPPRESSED — awaiting assessment score pipeline (WO-680)
 *   Adherence  = SUPPRESSED — awaiting assessment score pipeline (WO-680)
 */

export const MINIMUM_SESSION_THRESHOLD = 20;

export interface ClinicSpoke {
    /** Spoke key matching the radar chart's subject field */
    subject: string;
    /** My Clinic value (0–100 percentage) */
    value: number;
    /** Human-readable definition shown in tooltip */
    definition: string;
    /** How many sessions / total this is derived from, e.g. "12 of 25 sessions" */
    derivation: string;
    /** Whether this spoke is suppressed (insufficient data or awaiting pipeline) */
    suppressed: boolean;
}

export interface ClinicBenchmarks {
    /** When true, fewer than MINIMUM_SESSION_THRESHOLD non-draft sessions exist — render zero-state */
    suppressed: boolean;
    totalSessions: number;
    spokes: ClinicSpoke[];
    loading: boolean;
    error: string | null;
}

export function useClinicBenchmarks(): ClinicBenchmarks & { refetch: () => void } {
    const { data, loading, error, refetch } = useDataCache(
        'clinic-benchmarks',
        async () => {
            try {
                // ── Step 1: Resolve authenticated user + site_id ─────────────────────────
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return { data: null, error: 'Not authenticated' };

                const { data: userSite, error: siteError } = await supabase
                    .from('log_user_sites')
                    .select('site_id')
                    .eq('user_id', user.id)
                    .maybeSingle();

                if (siteError) throw siteError;
                if (!userSite) {
                    return {
                        data: { suppressed: true, totalSessions: 0, spokes: [] },
                        error: null,
                    };
                }

                const siteId = userSite.site_id;

                // ── Step 2: Fetch all non-draft sessions for this site ────────────────────
                // Columns needed for spoke computation:
                //   session_status  → Completion spoke
                //   substance_id    → Completion + DataQuality spokes
                //   session_date    → DataQuality spoke
                const { data: sessions, error: sessionsError } = await supabase
                    .from('log_clinical_records')
                    .select('id, session_status, substance_id, session_date')
                    .eq('site_id', siteId)
                    .neq('session_status', 'draft');

                if (sessionsError) throw sessionsError;

                const records = sessions || [];
                const totalSessions = records.length;

                // ── Step 3: Minimum-n check ───────────────────────────────────────────────
                if (totalSessions < MINIMUM_SESSION_THRESHOLD) {
                    return {
                        data: { suppressed: true, totalSessions, spokes: [] },
                        error: null,
                    };
                }

                const sessionIds = records.map((r: { id: string }) => r.id);

                // ── Step 4: Fetch adverse events (Safety spoke) ───────────────────────────
                // Safety = sessions WITHOUT any AE / total sessions × 100
                const { data: safetyEvents, error: safetyError } = await supabase
                    .from('log_safety_events')
                    .select('session_id')
                    .in('session_id', sessionIds);

                if (safetyError) throw safetyError;

                const sessionsWithAE = new Set(
                    (safetyEvents || []).map((e: { session_id: string }) => e.session_id)
                );
                const sessionsWithoutAE = totalSessions - sessionsWithAE.size;
                const safetyPct = Math.round((sessionsWithoutAE / totalSessions) * 100);

                // ── Step 5: Completion spoke ──────────────────────────────────────────────
                // Completion = sessions with substance_id populated / all non-draft sessions × 100
                // substance_id IS NOT NULL signals a dosing protocol was recorded
                const completedCount = records.filter(
                    (r: { substance_id: number | null }) => r.substance_id != null
                ).length;
                const completionPct = Math.round((completedCount / totalSessions) * 100);

                // ── Step 6: Data Quality spoke ────────────────────────────────────────────
                // DataQuality = sessions with both session_date AND substance_id populated
                const dataQualityCount = records.filter(
                    (r: { session_date: string | null; substance_id: number | null }) =>
                        r.session_date != null && r.substance_id != null
                ).length;
                const dataQualityPct = Math.round((dataQualityCount / totalSessions) * 100);

                // ── Step 7: Consent spoke ─────────────────────────────────────────────────
                // Consent = sessions that have ≥1 row in log_phase1_consent
                const { data: consentRows, error: consentError } = await supabase
                    .from('log_phase1_consent')
                    .select('session_id')
                    .in('session_id', sessionIds);

                if (consentError) throw consentError;

                const sessionsWithConsent = new Set(
                    (consentRows || [])
                        .map((c: { session_id: string | null }) => c.session_id)
                        .filter(Boolean)
                );
                const consentCount = sessionsWithConsent.size;
                const consentPct = Math.round((consentCount / totalSessions) * 100);

                // ── Step 8: Assemble spokes ───────────────────────────────────────────────
                const spokes: ClinicSpoke[] = [
                    {
                        subject: 'Safety',
                        value: safetyPct,
                        definition: 'Safety: sessions with no adverse events / total sessions',
                        derivation: `${sessionsWithoutAE} of ${totalSessions} sessions had no AEs`,
                        suppressed: false,
                    },
                    {
                        subject: 'Completion',
                        value: completionPct,
                        definition: 'Completion: sessions with a dosing protocol recorded / total sessions',
                        derivation: `${completedCount} of ${totalSessions} sessions have a dosing protocol`,
                        suppressed: false,
                    },
                    {
                        subject: 'Data Quality',
                        value: dataQualityPct,
                        definition: 'Data Quality: sessions with session date and substance documented / total sessions',
                        derivation: `${dataQualityCount} of ${totalSessions} sessions have complete core documentation`,
                        suppressed: false,
                    },
                    {
                        subject: 'Consent',
                        value: consentPct,
                        definition: 'Consent: sessions with a recorded consent event / total sessions',
                        derivation: `${consentCount} of ${totalSessions} sessions have documented consent`,
                        suppressed: false,
                    },
                    {
                        subject: 'Efficacy',
                        value: 0,
                        definition: 'Efficacy: suppressed — awaiting assessment score data pipeline (WO-680)',
                        derivation: 'Not yet computable',
                        suppressed: true,
                    },
                    {
                        subject: 'Adherence',
                        value: 0,
                        definition: 'Adherence: suppressed — awaiting assessment score data pipeline (WO-680)',
                        derivation: 'Not yet computable',
                        suppressed: true,
                    },
                ];

                return {
                    data: { suppressed: false, totalSessions, spokes },
                    error: null,
                };
            } catch (err: unknown) {
                const message = err instanceof Error ? err.message : 'Failed to load clinic benchmarks';
                console.error('[useClinicBenchmarks] query failed:', message); // allow-console
                return {
                    data: { suppressed: true, totalSessions: 0, spokes: [] },
                    error: message,
                };
            }
        },
        { ttl: 5 * 60 * 1000 } // 5-min TTL — always enabled (auth check inside fetcher)
    );

    return {
        suppressed: data?.suppressed ?? true,
        totalSessions: data?.totalSessions ?? 0,
        spokes: data?.spokes ?? [],
        loading,
        error: error ? String(error) : null,
        refetch,
    };
}
