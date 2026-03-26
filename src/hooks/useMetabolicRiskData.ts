import { supabase } from '../supabaseClient';
import { useDataCache } from './useDataCache';

/**
 * WO-682 — useMetabolicRiskData
 *
 * Queries log_session_vitals for the most recent vitals across all active
 * sessions at the practitioner's site. Computes a simple cardiovascular
 * risk triage:
 *
 *   HIGH:     SBP ≥ 160 OR DBP ≥ 100 OR HR ≥ 120
 *   ELEVATED: SBP ≥ 140 OR DBP ≥ 90  OR HR ≥ 100
 *   NORMAL:   All values within normal range
 *
 * Per WO-682: No synthetic gauge values under any circumstance.
 * If < 1 vitals record exists → suppressed: true.
 */

export interface VitalsRiskRow {
    sessionId: string;
    recordedAt: string;
    heartRate: number | null;
    bpSystolic: number | null;
    bpDiastolic: number | null;
    oxygenSaturation: number | null;
    riskLevel: 'HIGH' | 'ELEVATED' | 'NORMAL' | 'INCOMPLETE';
}

export interface MetabolicRiskData {
    suppressed: boolean;
    totalVitalsRecords: number;
    /** Number of active sessions with vitals */
    sessionCount: number;
    /** Latest vitals record across the site */
    mostRecentVitals: VitalsRiskRow | null;
    /** Patients flagged as HIGH or ELEVATED */
    flaggedCount: number;
    allSessions: VitalsRiskRow[];
}

function classifyRisk(row: { heart_rate?: number | null; bp_systolic?: number | null; bp_diastolic?: number | null }): VitalsRiskRow['riskLevel'] {
    const hr = row.heart_rate;
    const sbp = row.bp_systolic;
    const dbp = row.bp_diastolic;

    if (hr == null && sbp == null && dbp == null) return 'INCOMPLETE';
    if ((sbp != null && sbp >= 160) || (dbp != null && dbp >= 100) || (hr != null && hr >= 120)) return 'HIGH';
    if ((sbp != null && sbp >= 140) || (dbp != null && dbp >= 90) || (hr != null && hr >= 100)) return 'ELEVATED';
    return 'NORMAL';
}

export function useMetabolicRiskData(): MetabolicRiskData & { loading: boolean; error: string | null } {
    const { data, loading, error } = useDataCache(
        'metabolic-risk-vitals',
        async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return { data: null, error: 'Not authenticated' };

                // Resolve site_id
                const { data: userSite, error: siteError } = await supabase
                    .from('log_user_sites')
                    .select('site_id')
                    .eq('user_id', user.id)
                    .maybeSingle();

                if (siteError) throw siteError;
                if (!userSite) {
                    return { data: { suppressed: true, totalVitalsRecords: 0, sessionCount: 0, mostRecentVitals: null, flaggedCount: 0, allSessions: [] }, error: null };
                }

                // Get active session IDs for this site
                const { data: sessions, error: sessionsError } = await supabase
                    .from('log_clinical_records')
                    .select('id')
                    .eq('site_id', userSite.site_id)
                    .neq('session_status', 'draft');

                if (sessionsError) throw sessionsError;
                const sessionIds = (sessions || []).map((s: { id: string }) => s.id);

                if (sessionIds.length === 0) {
                    return { data: { suppressed: true, totalVitalsRecords: 0, sessionCount: 0, mostRecentVitals: null, flaggedCount: 0, allSessions: [] }, error: null };
                }

                // Fetch most recent vitals per session
                const { data: vitals, error: vitalsError } = await supabase
                    .from('log_session_vitals')
                    .select('session_id, recorded_at, heart_rate, bp_systolic, bp_diastolic, oxygen_saturation')
                    .in('session_id', sessionIds)
                    .order('recorded_at', { ascending: false })
                    .limit(200);

                if (vitalsError) throw vitalsError;

                const allVitals = vitals || [];
                if (allVitals.length === 0) {
                    return { data: { suppressed: true, totalVitalsRecords: 0, sessionCount: 0, mostRecentVitals: null, flaggedCount: 0, allSessions: [] }, error: null };
                }

                // De-dup: keep most recent vitals per session
                type VitalsRow = { session_id: string; recorded_at: string; heart_rate: number | null; bp_systolic: number | null; bp_diastolic: number | null; oxygen_saturation: number | null };
                const sessionLatest = new Map<string, VitalsRow>();
                for (const v of allVitals as VitalsRow[]) {
                    if (!sessionLatest.has(v.session_id)) {
                        sessionLatest.set(v.session_id, v);
                    }
                }

                const rows: VitalsRiskRow[] = Array.from(sessionLatest.values()).map(v => ({
                    sessionId: v.session_id,
                    recordedAt: v.recorded_at,
                    heartRate: v.heart_rate,
                    bpSystolic: v.bp_systolic,
                    bpDiastolic: v.bp_diastolic,
                    oxygenSaturation: v.oxygen_saturation,
                    riskLevel: classifyRisk(v),
                })).sort((a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime());

                const flaggedCount = rows.filter(r => r.riskLevel === 'HIGH' || r.riskLevel === 'ELEVATED').length;

                return {
                    data: {
                        suppressed: false,
                        totalVitalsRecords: allVitals.length,
                        sessionCount: rows.length,
                        mostRecentVitals: rows[0] ?? null,
                        flaggedCount,
                        allSessions: rows,
                    },
                    error: null,
                };
            } catch (err: unknown) {
                const message = err instanceof Error ? err.message : 'Failed to load vitals risk data';
                console.error('[useMetabolicRiskData] query failed:', message); // allow-console
                return { data: { suppressed: true, totalVitalsRecords: 0, sessionCount: 0, mostRecentVitals: null, flaggedCount: 0, allSessions: [] }, error: message };
            }
        },
        { ttl: 2 * 60 * 1000 } // 2-min cache for vitals (more real-time)
    );

    return {
        suppressed: data?.suppressed ?? true,
        totalVitalsRecords: data?.totalVitalsRecords ?? 0,
        sessionCount: data?.sessionCount ?? 0,
        mostRecentVitals: data?.mostRecentVitals ?? null,
        flaggedCount: data?.flaggedCount ?? 0,
        allSessions: data?.allSessions ?? [],
        loading,
        error: error ? String(error) : null,
    };
}
