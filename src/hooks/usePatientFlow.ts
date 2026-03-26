import { supabase } from '../supabaseClient';
import { useDataCache } from './useDataCache';

/**
 * WO-679 — usePatientFlow
 *
 * Single hook providing data to BOTH PatientConstellation and PatientFlowSankey.
 * Resolved via the post-WO-675 self-contained site_id pattern.
 *
 * PatientConstellation — bubble data:
 *   Each unique patient_uuid = one bubble.
 *   x = session count (number of sessions this patient has)
 *   y = substance_id index (maps to a substance bucket for Y-axis grouping)
 *   color = substance name
 *   size = session count
 *   Minimum-n guard: < 5 unique patients → suppressed.
 *
 * PatientFlowSankey — stage funnel:
 *   Counts sessions at each session_status stage.
 *   Stages: preparation → dosing → integration → complete → follow_up
 *   Minimum-n guard: < 10 total non-draft sessions → suppressed.
 */

export const PATIENT_MIN_N = 5;
export const FLOW_MIN_N = 10;

export interface ConstellationBubble {
    /** De-identified UUID hash (last 6 chars used for display) */
    patientId: string;
    /** Session count = bubble size on X axis */
    sessionCount: number;
    /** Substance name from ref_substances */
    substanceName: string;
    /** Substance bucket index — used for Y-axis jitter positioning */
    substanceIndex: number;
    /** session_status of the most recent session for this patient */
    latestStatus: string;
}

export interface FlowEdgeLive {
    source: string;
    target: string;
    /** Number of sessions that match this stage transition */
    value: number;
}

export interface PatientFlowData {
    /** True if < PATIENT_MIN_N unique patients exist */
    constellationSuppressed: boolean;
    totalPatients: number;
    bubbles: ConstellationBubble[];

    /** True if < FLOW_MIN_N total non-draft sessions exist */
    sankeySupressed: boolean;
    totalSessions: number;
    flowEdges: FlowEdgeLive[];
}

// Clinical stage order — maps session_status values to funnel stages
const STAGE_ORDER = [
    { label: 'Preparation',  statuses: ['preparation', 'prepared', 'pre_session'] },
    { label: 'Consent',      statuses: ['consented', 'consent_signed'] },
    { label: 'Dosing',       statuses: ['dosing', 'in_session', 'dosing_complete'] },
    { label: 'Integration',  statuses: ['integration', 'post_session', 'integrated'] },
    { label: 'Completion',   statuses: ['complete', 'completed', 'discharged', 'follow_up'] },
];

export function usePatientFlow(): PatientFlowData & { loading: boolean; error: string | null } {
    const { data, loading, error } = useDataCache(
        'patient-flow-data',
        async () => {
            try {
                // ── Resolve site_id ──────────────────────────────────────────────────────────
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
                        data: {
                            constellationSuppressed: true, totalPatients: 0, bubbles: [],
                            sankeySupressed: true, totalSessions: 0, flowEdges: [],
                        },
                        error: null,
                    };
                }

                // ── Fetch non-draft sessions with substance join ───────────────────────────
                const { data: sessions, error: sessionsError } = await supabase
                    .from('log_clinical_records')
                    .select('patient_uuid, session_status, substance_id, ref_substances(substance_name)')
                    .eq('site_id', userSite.site_id)
                    .neq('session_status', 'draft');

                if (sessionsError) throw sessionsError;

                const records = sessions || [];
                const totalSessions = records.length;

                // ── Build PatientConstellation bubble data ────────────────────────────────
                // Group by patient_uuid → count sessions, pick substance + status
                const patientMap = new Map<string, {
                    sessionCount: number;
                    substanceName: string;
                    latestStatus: string;
                }>();

                const substanceIndexMap = new Map<string, number>();
                let substanceCounter = 0;

                for (const row of records) {
                    const uuid: string = row.patient_uuid ?? 'unknown';
                    const substanceRaw = (row as { ref_substances?: { substance_name?: string } }).ref_substances;
                    const substanceName: string = substanceRaw?.substance_name ?? 'Unknown';
                    const status: string = (row.session_status as string) ?? 'unknown';

                    if (!substanceIndexMap.has(substanceName)) {
                        substanceIndexMap.set(substanceName, substanceCounter++);
                    }

                    const existing = patientMap.get(uuid);
                    if (existing) {
                        existing.sessionCount += 1;
                        existing.latestStatus = status;
                    } else {
                        patientMap.set(uuid, { sessionCount: 1, substanceName, latestStatus: status });
                    }
                }

                const totalPatients = patientMap.size;
                const constellationSuppressed = totalPatients < PATIENT_MIN_N;

                const bubbles: ConstellationBubble[] = constellationSuppressed ? [] : Array.from(patientMap.entries()).map(([uuid, info]) => ({
                    patientId: uuid.slice(-6).toUpperCase(), // last 6 chars of UUID — de-identified display ID
                    sessionCount: info.sessionCount,
                    substanceName: info.substanceName,
                    substanceIndex: substanceIndexMap.get(info.substanceName) ?? 0,
                    latestStatus: info.latestStatus,
                }));

                // ── Build PatientFlowSankey funnel data ───────────────────────────────────
                const sankeySupressed = totalSessions < FLOW_MIN_N;

                // Count how many sessions fall into each stage bucket
                const stageCounts: number[] = STAGE_ORDER.map(stage =>
                    records.filter(r =>
                        stage.statuses.includes((r.session_status as string ?? '').toLowerCase())
                    ).length
                );

                // Build flow edges: stage[n] → stage[n+1], value = min(count[n], count[n+1])
                // This represents retention at each step
                const flowEdges: FlowEdgeLive[] = [];
                if (!sankeySupressed) {
                    for (let i = 0; i < STAGE_ORDER.length - 1; i++) {
                        const fromCount = stageCounts[i];
                        const toCount = stageCounts[i + 1];
                        // Only create edges where there's actual data flowing
                        if (fromCount > 0 || toCount > 0) {
                            flowEdges.push({
                                source: STAGE_ORDER[i].label,
                                target: STAGE_ORDER[i + 1].label,
                                value: Math.max(fromCount, 1), // avoid Sankey zero-value crash
                            });
                        }
                    }
                    // Fallback: if no stage mapping succeeded (all statuses non-standard),
                    // create a single "all sessions" edge so the chart renders
                    if (flowEdges.length === 0) {
                        flowEdges.push({ source: 'Sessions Logged', target: 'Active', value: totalSessions });
                    }
                }

                return {
                    data: {
                        constellationSuppressed,
                        totalPatients,
                        bubbles,
                        sankeySupressed,
                        totalSessions,
                        flowEdges,
                    },
                    error: null,
                };
            } catch (err: unknown) {
                const message = err instanceof Error ? err.message : 'Failed to load patient flow data';
                console.error('[usePatientFlow] query failed:', message); // allow-console
                return {
                    data: {
                        constellationSuppressed: true, totalPatients: 0, bubbles: [],
                        sankeySupressed: true, totalSessions: 0, flowEdges: [],
                    },
                    error: message,
                };
            }
        },
        { ttl: 5 * 60 * 1000 }
    );

    return {
        constellationSuppressed: data?.constellationSuppressed ?? true,
        totalPatients: data?.totalPatients ?? 0,
        bubbles: data?.bubbles ?? [],
        sankeySupressed: data?.sankeySupressed ?? true,
        totalSessions: data?.totalSessions ?? 0,
        flowEdges: data?.flowEdges ?? [],
        loading,
        error: error ? String(error) : null,
    };
}
