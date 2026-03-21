
import { useMemo } from 'react';
import { supabase } from '../supabaseClient';
import { useDataCache } from './useDataCache';

// ─── Types ────────────────────────────────────────────────────────────────────
export type SubstanceCategory = 'psilocybin' | 'ketamine' | 'mdma' | 'ayahuasca' | 'unknown';

export function getSubstanceCategory(name: string | null | undefined): SubstanceCategory {
    if (!name) return 'unknown';
    const n = name.toLowerCase();
    if (n.includes('psilocybin') || n.includes('mushroom') || n.includes('psilocybe')) return 'psilocybin';
    if (n.includes('ketamine') || n.includes('esketamine') || n.includes('spravato')) return 'ketamine';
    if (n.includes('mdma') || n.includes('3,4-methylenedioxy')) return 'mdma';
    if (n.includes('ayahuasca') || n.includes('dmt') || n.includes('harmaline')) return 'ayahuasca';
    return 'unknown';
}

export const SUBSTANCE_ACCENT: Record<SubstanceCategory, string> = {
    psilocybin: '#2dd4bf',
    ketamine: '#a78bfa',
    mdma: '#fb7185',
    ayahuasca: '#f59e0b',
    unknown: '#2dd4bf',
};

export interface Phase3DecayPoint {
    day: number;
    phq9: number;
}

export interface Phase3PulseTrendPoint {
    day: string;
    connection: number;
    sleep: number;
    date: string;
}

// WO-553: Vitals point for PDF report inline SVG chart
export interface Phase3VitalsPoint {
    elapsedMin: number; // minutes from session start
    hr: number | null;
    bp_s: number | null;
    bp_d: number | null;
    recordedAt: string;
}

// WO-553: Timeline event for PDF event log table
export interface Phase3TimelineEvent {
    occurredAt: string;
    eventType: string;
    label: string;
}

export interface Phase3Data {
    // PHQ-9 trajectory for Symptom Decay chart
    decayPoints: Phase3DecayPoint[] | null;
    baselinePhq9: number | null;
    currentPhq9: number | null;
    // GAD-7 trajectory summary (no chart yet, used for outcome badges)
    baselineGad7: number | null;
    currentGad7: number | null;

    // Compliance (0–100)
    pulseCheckCompliance: number | null;
    phq9Compliance: number | null;

    // Integration sessions
    integrationSessionsAttended: number | null;
    integrationSessionsScheduled: number | null;

    // 7-day pulse trend
    pulseTrend: Phase3PulseTrendPoint[] | null;

    // WO-553: Vitals + timeline for PDF report
    vitalsData: Phase3VitalsPoint[] | null;
    timelineEvents: Phase3TimelineEvent[] | null;
    hasRealVitalsData: boolean;
    hasRealTimelineData: boolean;

    // Whether any panel is running on real data (false = demo data)
    hasRealDecayData: boolean;
    hasRealPulseData: boolean;
    hasRealComplianceData: boolean;
    hasRealIntegrationData: boolean;

    // WO-602: Session metadata for PK Flight Plan PDF page
    substanceName: string | null;
    substanceCategory: SubstanceCategory;
    accentColor: string;
    doseMg: number | null;
    doseMgPerKg: number | null;
    sessionDate: string | null;

    // Clinical PDF header: clinician identity + site reference
    clinicianName: string | null;  // auth user display name or email
    sessionSiteId: string | null;  // site_id UUID from log_clinical_sessions

    // Loading / error
    isLoading: boolean;
    error: string | null;
}

// ─── Mock fallback data (displayed when real data isn't available) ─────────────

const MOCK_DECAY_POINTS: Phase3DecayPoint[] = [
    { day: 7, phq9: 14 },
    { day: 14, phq9: 11 },
    { day: 30, phq9: 9 },
    { day: 60, phq9: 7 },
    { day: 90, phq9: 6 },
    { day: 120, phq9: 5 },
    { day: 180, phq9: 4 },
];

const MOCK_PULSE_TREND: Phase3PulseTrendPoint[] = [
    { day: 'Mon', connection: 3, sleep: 2, date: '2025-10-13' },
    { day: 'Tue', connection: 3, sleep: 3, date: '2025-10-14' },
    { day: 'Wed', connection: 4, sleep: 3, date: '2025-10-15' },
    { day: 'Thu', connection: 4, sleep: 4, date: '2025-10-16' },
    { day: 'Fri', connection: 5, sleep: 4, date: '2025-10-17' },
    { day: 'Sat', connection: 4, sleep: 5, date: '2025-10-18' },
    { day: 'Sun', connection: 5, sleep: 4, date: '2025-10-19' },
];

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function usePhase3Data(
    sessionId: string | undefined,
    patientId: string | undefined
): Phase3Data {
    // Stable cache key — only changes when the actual session changes
    const cacheKey = sessionId && patientId
        ? `phase3-${sessionId}`
        : 'phase3-empty';

    const { data, loading } = useDataCache<Omit<Phase3Data, 'isLoading' | 'error'>>(
        cacheKey,
        async () => {
            // No real session — return empty state immediately
            if (!sessionId || !patientId) {
                return {
                    data: {
                        decayPoints: null, baselinePhq9: null, currentPhq9: null,
                        baselineGad7: null, currentGad7: null,
                        pulseCheckCompliance: 0, phq9Compliance: 0,
                        integrationSessionsAttended: 0, integrationSessionsScheduled: 0,
                        pulseTrend: null, vitalsData: null, timelineEvents: null,
                        hasRealVitalsData: false, hasRealTimelineData: false,
                        hasRealDecayData: false, hasRealPulseData: false,
                        hasRealComplianceData: false, hasRealIntegrationData: false,
                        substanceName: null, substanceCategory: 'unknown' as SubstanceCategory,
                        accentColor: SUBSTANCE_ACCENT.unknown,
                        doseMg: null, doseMgPerKg: null, sessionDate: null,
                        clinicianName: null, sessionSiteId: null,
                    },
                    error: null,
                };
            }

            try {
                // ── 1. PHQ-9 trajectory ───────────────────────────────────────────────────
                const { data: longitudinal, error: longErr } = await supabase
                    .from('log_longitudinal_assessments')
                    .select('days_post_session, phq9_score, gad7_score')
                    .eq('session_id', sessionId)
                    .order('days_post_session', { ascending: true });

                const hasRealDecayData = !longErr && longitudinal && longitudinal.length > 0;
                const decayPoints: Phase3DecayPoint[] = hasRealDecayData
                    ? longitudinal!.map(r => ({ day: r.days_post_session, phq9: r.phq9_score }))
                    : MOCK_DECAY_POINTS;

                const currentGad7: number | null =
                    hasRealDecayData && longitudinal && longitudinal.length > 0
                        ? (longitudinal[longitudinal.length - 1].gad7_score ?? null)
                        : null;

                // ── 2. Baseline PHQ-9 ──────────────────────────────────────────────────────
                const { data: baselineRow, error: baselineErr } = await supabase
                    .from('log_baseline_assessments')
                    .select('phq9_score, gad7_score')
                    .eq('patient_uuid', patientId)
                    .order('created_at', { ascending: false })
                    .limit(1)
                    .maybeSingle();

                const baselinePhq9: number | null =
                    (!baselineErr && baselineRow?.phq9_score != null) ? baselineRow.phq9_score : null;
                const baselineGad7: number | null =
                    (!baselineErr && (baselineRow as any)?.gad7_score != null) ? (baselineRow as any).gad7_score : null;
                const currentPhq9 = hasRealDecayData && decayPoints.length > 0
                    ? decayPoints[decayPoints.length - 1].phq9 : null;

                // ── 3. Pulse check compliance ──────────────────────────────────────────────
                const { data: sessionRow } = await supabase
                    .from('log_clinical_records')
                    .select('created_at, site_id')
                    .eq('id', sessionId)
                    .single();

                let pulseCheckCompliance: number = 0;
                let hasRealComplianceData = false;

                if (sessionRow?.created_at) {
                    const sessionStartMs = new Date(sessionRow.created_at).getTime();
                    const daysSinceSession = Math.max(1, Math.floor((Date.now() - sessionStartMs) / 86_400_000));
                    const { count: pulseCount, error: pulseErr } = await supabase
                        .from('log_pulse_checks')
                        .select('*', { count: 'exact', head: true })
                        .eq('session_id', sessionId);

                    if (!pulseErr && pulseCount != null) {
                        hasRealComplianceData = true;
                        pulseCheckCompliance = Math.min(100, Math.round((pulseCount / daysSinceSession) * 100));
                    }
                }

                let phq9Compliance: number = 0;
                if (hasRealDecayData && sessionRow?.created_at) {
                    const weeksSinceSession = Math.max(1, Math.floor((Date.now() - new Date(sessionRow.created_at).getTime()) / (7 * 86_400_000)));
                    phq9Compliance = Math.min(100, Math.round((longitudinal!.length / weeksSinceSession) * 100));
                }

                // ── 4+5. Integration sessions (combined into one count query) ──────────────
                const [{ count: attendedCount, error: intErr }, { count: totalIntCount }] = await Promise.all([
                    supabase.from('log_integration_sessions')
                        .select('*', { count: 'exact', head: true })
                        .eq('dosing_session_id', sessionId)
                        .not('attendance_status_id', 'is', null),
                    supabase.from('log_integration_sessions')
                        .select('*', { count: 'exact', head: true })
                        .eq('dosing_session_id', sessionId),
                ]);

                const hasRealIntegrationData = !intErr && attendedCount != null;
                const integrationSessionsAttended = hasRealIntegrationData ? (attendedCount ?? 0) : 0;
                const integrationSessionsScheduled = totalIntCount ?? integrationSessionsAttended;

                // ── 6. 7-day pulse trend ───────────────────────────────────────────────────
                const sevenDaysAgo = new Date(Date.now() - 7 * 86_400_000).toISOString();
                const { data: pulseRows, error: pulseTrendErr } = await supabase
                    .from('log_pulse_checks')
                    .select('connection_level, sleep_quality, created_at')
                    .eq('session_id', sessionId)
                    .gte('created_at', sevenDaysAgo)
                    .order('created_at', { ascending: true });

                let pulseTrend: Phase3PulseTrendPoint[] = MOCK_PULSE_TREND;
                let hasRealPulseData = false;

                if (!pulseTrendErr && pulseRows && pulseRows.length > 0) {
                    hasRealPulseData = true;
                    pulseTrend = pulseRows.map(r => {
                        const d = new Date(r.created_at);
                        return {
                            day: DAY_LABELS[d.getDay()],
                            connection: r.connection_level ?? 0,
                            sleep: r.sleep_quality ?? 0,
                            date: d.toISOString().slice(0, 10),
                        };
                    });
                }

                // ── 7. Session vitals ──────────────────────────────────────────────────────
                const { data: vitalsRows, error: vitalsErr } = await supabase
                    .from('log_session_vitals')
                    .select('recorded_at, heart_rate, bp_systolic, bp_diastolic')
                    .eq('session_id', sessionId)
                    .order('recorded_at', { ascending: true });

                let vitalsData: Phase3VitalsPoint[] | null = null;
                let hasRealVitalsData = false;

                if (!vitalsErr && vitalsRows && vitalsRows.length > 0) {
                    hasRealVitalsData = true;
                    const sessionStartMs = vitalsRows[0]?.recorded_at
                        ? new Date(vitalsRows[0].recorded_at).getTime() : 0;
                    vitalsData = vitalsRows.map(r => ({
                        elapsedMin: Math.round((new Date(r.recorded_at).getTime() - sessionStartMs) / 60_000),
                        hr: r.heart_rate ?? null,
                        bp_s: r.bp_systolic ?? null,
                        bp_d: r.bp_diastolic ?? null,
                        recordedAt: r.recorded_at,
                    }));
                }

                // ── 8. Timeline events ─────────────────────────────────────────────────────
                const { data: tlRows, error: tlErr } = await supabase
                    .from('log_session_timeline_events')
                    .select('event_timestamp, ref_flow_event_types(event_type_code, event_type_label)')
                    .eq('session_id', sessionId)
                    .order('event_timestamp', { ascending: true });

                let timelineEvents: Phase3TimelineEvent[] | null = null;
                let hasRealTimelineData = false;

                if (!tlErr && tlRows && tlRows.length > 0) {
                    hasRealTimelineData = true;
                    timelineEvents = (tlRows as Array<{
                        event_timestamp: string;
                        ref_flow_event_types: Array<{ event_type_code: string; event_type_label?: string }> | null;
                    }>).map(r => {
                        const ref = Array.isArray(r.ref_flow_event_types) ? r.ref_flow_event_types[0] : r.ref_flow_event_types;
                        return {
                            occurredAt: r.event_timestamp,
                            eventType: (ref as { event_type_code?: string } | null)?.event_type_code ?? 'unknown',
                            label: (ref as { event_type_label?: string; event_type_code?: string } | null)?.event_type_label
                                ?? (ref as { event_type_code?: string } | null)?.event_type_code
                                ?? 'Event',
                        };
                    });
                }

                // ── 9. Dose + substance metadata ───────────────────────────────────────────
                const { data: doseRows } = await supabase
                    .from('log_dose_events')
                    .select('substance_id, dose_mg, dose_mg_per_kg')
                    .eq('session_id', sessionId)
                    .order('administered_at', { ascending: true })
                    .limit(1);

                const dose = doseRows?.[0] ?? null;
                let substanceName: string | null = null;
                if (dose?.substance_id) {
                    const { data: sub } = await supabase
                        .from('ref_substances')
                        .select('name')
                        .eq('id', dose.substance_id)
                        .single();
                    substanceName = sub?.name ?? null;
                }
                const substanceCategory = getSubstanceCategory(substanceName);
                const sessionDate = sessionRow?.created_at ?? null;
                const sessionSiteId = sessionRow?.site_id ?? null;

                // ── 10. Clinician identity (local cache, no network) ───────────────────────
                let clinicianName: string | null = null;
                try {
                    const { data: { session: authSession } } = await supabase.auth.getSession();
                    if (authSession?.user) {
                        clinicianName =
                            (authSession.user.user_metadata?.full_name as string | undefined) ??
                            (authSession.user.user_metadata?.name as string | undefined) ??
                            authSession.user.email ?? null;
                    }
                } catch { /* auth unavailable — fallback to null */ }

                return {
                    data: {
                        decayPoints, baselinePhq9, currentPhq9, baselineGad7, currentGad7,
                        pulseCheckCompliance, phq9Compliance,
                        integrationSessionsAttended, integrationSessionsScheduled,
                        pulseTrend, vitalsData, timelineEvents,
                        hasRealVitalsData, hasRealTimelineData,
                        hasRealDecayData: !!hasRealDecayData, hasRealPulseData,
                        hasRealComplianceData, hasRealIntegrationData,
                        substanceName, substanceCategory,
                        accentColor: SUBSTANCE_ACCENT[substanceCategory],
                        doseMg: dose?.dose_mg ?? null,
                        doseMgPerKg: dose?.dose_mg_per_kg ?? null,
                        sessionDate, clinicianName, sessionSiteId,
                    },
                    error: null,
                };
            } catch (err: any) {
                console.error('[usePhase3Data] Query failed — using empty fallback:', err?.message);
                return {
                    data: {
                        decayPoints: null, baselinePhq9: null, currentPhq9: null,
                        baselineGad7: null, currentGad7: null,
                        pulseCheckCompliance: 0, phq9Compliance: 0,
                        integrationSessionsAttended: 0, integrationSessionsScheduled: 0,
                        pulseTrend: null, vitalsData: null, timelineEvents: null,
                        hasRealVitalsData: false, hasRealTimelineData: false,
                        hasRealDecayData: false, hasRealPulseData: false,
                        hasRealComplianceData: false, hasRealIntegrationData: false,
                        substanceName: null, substanceCategory: 'unknown' as SubstanceCategory,
                        accentColor: SUBSTANCE_ACCENT.unknown,
                        doseMg: null, doseMgPerKg: null, sessionDate: null,
                        clinicianName: null, sessionSiteId: null,
                    },
                    error: null,
                };
            }
        },
        { ttl: 5 * 60 * 1000, enabled: true } // 5-min TTL — navigate away and back is free
    );

    // Merge cache data with isLoading/error fields consumers expect
    return useMemo<Phase3Data>(() => ({
        decayPoints: data?.decayPoints ?? null,
        baselinePhq9: data?.baselinePhq9 ?? null,
        currentPhq9: data?.currentPhq9 ?? null,
        baselineGad7: data?.baselineGad7 ?? null,
        currentGad7: data?.currentGad7 ?? null,
        pulseCheckCompliance: data?.pulseCheckCompliance ?? null,
        phq9Compliance: data?.phq9Compliance ?? null,
        integrationSessionsAttended: data?.integrationSessionsAttended ?? null,
        integrationSessionsScheduled: data?.integrationSessionsScheduled ?? null,
        pulseTrend: data?.pulseTrend ?? null,
        vitalsData: data?.vitalsData ?? null,
        timelineEvents: data?.timelineEvents ?? null,
        hasRealVitalsData: data?.hasRealVitalsData ?? false,
        hasRealTimelineData: data?.hasRealTimelineData ?? false,
        hasRealDecayData: data?.hasRealDecayData ?? false,
        hasRealPulseData: data?.hasRealPulseData ?? false,
        hasRealComplianceData: data?.hasRealComplianceData ?? false,
        hasRealIntegrationData: data?.hasRealIntegrationData ?? false,
        substanceName: data?.substanceName ?? null,
        substanceCategory: data?.substanceCategory ?? 'unknown',
        accentColor: data?.accentColor ?? SUBSTANCE_ACCENT.unknown,
        doseMg: data?.doseMg ?? null,
        doseMgPerKg: data?.doseMgPerKg ?? null,
        sessionDate: data?.sessionDate ?? null,
        clinicianName: data?.clinicianName ?? null,
        sessionSiteId: data?.sessionSiteId ?? null,
        isLoading: loading,
        error: null,
    }), [data, loading]);
}
