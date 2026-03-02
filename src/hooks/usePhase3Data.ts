
import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

// ─── Types ────────────────────────────────────────────────────────────────────

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
    const [state, setState] = useState<Phase3Data>({
        decayPoints: null,
        baselinePhq9: null,
        currentPhq9: null,
        pulseCheckCompliance: null,
        phq9Compliance: null,
        integrationSessionsAttended: null,
        integrationSessionsScheduled: null,
        pulseTrend: null,
        vitalsData: null,
        timelineEvents: null,
        hasRealVitalsData: false,
        hasRealTimelineData: false,
        hasRealDecayData: false,
        hasRealPulseData: false,
        hasRealComplianceData: false,
        hasRealIntegrationData: false,
        isLoading: true,
        error: null,
    });

    useEffect(() => {
        // WO-558: No real session — null signals "no data" to consumer components.
        // Panels gate on hasRealDecayData/hasRealPulseData and show empty states.
        // MOCK_DECAY_POINTS and MOCK_PULSE_TREND are kept for DemoDataBadge panels
        // that are explicitly labelled as illustrative, but PHQ-9 numbers must be null.
        if (!sessionId || !patientId) {
            setState(prev => ({
                ...prev,
                decayPoints: null,
                baselinePhq9: null,
                currentPhq9: null,
                pulseCheckCompliance: 0,
                phq9Compliance: 0,
                integrationSessionsAttended: 0,
                integrationSessionsScheduled: 0,
                pulseTrend: null,
                vitalsData: null,
                timelineEvents: null,
                hasRealVitalsData: false,
                hasRealTimelineData: false,
                hasRealDecayData: false,
                hasRealPulseData: false,
                hasRealComplianceData: false,
                hasRealIntegrationData: false,
                isLoading: false,
                error: null,
            }));
            return;
        }

        let cancelled = false;

        const fetchAll = async () => {
            setState(prev => ({ ...prev, isLoading: true, error: null }));

            try {
                // ── 1. PHQ-9 trajectory (log_longitudinal_assessments) ─────────────────
                const { data: longitudinal, error: longErr } = await supabase
                    .from('log_longitudinal_assessments')
                    .select('days_post_session, phq9_score')
                    .eq('session_id', sessionId)
                    .order('days_post_session', { ascending: true });

                const hasRealDecayData = !longErr && longitudinal && longitudinal.length > 0;
                const decayPoints: Phase3DecayPoint[] = hasRealDecayData
                    ? longitudinal!.map(r => ({ day: r.days_post_session, phq9: r.phq9_score }))
                    : MOCK_DECAY_POINTS;

                // ── 2. Baseline PHQ-9 (log_baseline_assessments) ───────────────────────
                const { data: baselineRow, error: baselineErr } = await supabase
                    .from('log_baseline_assessments')
                    .select('phq9_score')
                    .eq('patient_id', patientId)
                    .order('created_at', { ascending: false })
                    .limit(1)
                    .single();

                // WO-558: null instead of 22 — empty state shown when no baseline recorded
                const baselinePhq9: number | null = (!baselineErr && baselineRow?.phq9_score != null)
                    ? baselineRow.phq9_score
                    : null;

                const currentPhq9 = hasRealDecayData && decayPoints.length > 0
                    ? decayPoints[decayPoints.length - 1].phq9
                    : null;

                // ── 3. Pulse check compliance ──────────────────────────────────────────
                // Get the session start date to compute days elapsed
                const { data: sessionRow } = await supabase
                    .from('log_clinical_records')
                    .select('created_at')
                    .eq('id', sessionId)
                    .single();

                let pulseCheckCompliance: number = 0;
                let hasRealComplianceData = false;

                if (sessionRow?.created_at) {
                    const sessionStartMs = new Date(sessionRow.created_at).getTime();
                    const daysSinceSession = Math.max(
                        1,
                        Math.floor((Date.now() - sessionStartMs) / 86_400_000)
                    );
                    const { count: pulseCount, error: pulseErr } = await supabase
                        .from('log_daily_pulse')
                        .select('*', { count: 'exact', head: true })
                        .eq('session_id', sessionId);

                    if (!pulseErr && pulseCount != null) {
                        hasRealComplianceData = true;
                        pulseCheckCompliance = Math.min(
                            100,
                            Math.round((pulseCount / daysSinceSession) * 100)
                        );
                    }
                }

                // PHQ-9 compliance — count longitudinal assessments vs expected weekly
                let phq9Compliance: number = 0;
                if (hasRealDecayData && sessionRow?.created_at) {
                    const weeksSinceSession = Math.max(
                        1,
                        Math.floor((Date.now() - new Date(sessionRow.created_at).getTime()) / (7 * 86_400_000))
                    );
                    phq9Compliance = Math.min(
                        100,
                        Math.round((longitudinal!.length / weeksSinceSession) * 100)
                    );
                }

                // ── 4. Integration sessions ────────────────────────────────────────────
                const { count: attendedCount, error: intErr } = await supabase
                    .from('log_integration_sessions')
                    .select('*', { count: 'exact', head: true })
                    .eq('session_id', sessionId)
                    .eq('status', 'completed');

                const hasRealIntegrationData = !intErr && attendedCount != null;
                const integrationSessionsAttended = hasRealIntegrationData ? (attendedCount ?? 0) : 0;

                // Scheduled = attended + pending (get all rows for this session)
                const { count: totalIntCount } = await supabase
                    .from('log_integration_sessions')
                    .select('*', { count: 'exact', head: true })
                    .eq('session_id', sessionId);
                const integrationSessionsScheduled = totalIntCount ?? integrationSessionsAttended;

                // ── 5. 7-day pulse trend ───────────────────────────────────────────────
                const sevenDaysAgo = new Date(Date.now() - 7 * 86_400_000).toISOString();
                const { data: pulseRows, error: pulseTrendErr } = await supabase
                    .from('log_daily_pulse')
                    .select('connection_level, sleep_quality, submitted_at')
                    .eq('session_id', sessionId)
                    .gte('submitted_at', sevenDaysAgo)
                    .order('submitted_at', { ascending: true });

                let pulseTrend: Phase3PulseTrendPoint[] = MOCK_PULSE_TREND;
                let hasRealPulseData = false;

                if (!pulseTrendErr && pulseRows && pulseRows.length > 0) {
                    hasRealPulseData = true;
                    pulseTrend = pulseRows.map(r => {
                        const d = new Date(r.submitted_at);
                        return {
                            day: DAY_LABELS[d.getDay()],
                            connection: r.connection_level ?? 0,
                            sleep: r.sleep_quality ?? 0,
                            date: d.toISOString().slice(0, 10),
                        };
                    });
                }

                // ── 6. WO-553: Session vitals for PDF inline SVG chart ─────────────────
                const { data: vitalsRows, error: vitalsErr } = await supabase
                    .from('log_session_vitals')
                    .select('recorded_at, heart_rate, systolic_bp, diastolic_bp')
                    .eq('session_id', sessionId)
                    .order('recorded_at', { ascending: true });

                let vitalsData: Phase3VitalsPoint[] | null = null;
                let hasRealVitalsData = false;

                if (!vitalsErr && vitalsRows && vitalsRows.length > 0) {
                    hasRealVitalsData = true;
                    const sessionStartMs = vitalsRows[0]?.recorded_at
                        ? new Date(vitalsRows[0].recorded_at).getTime()
                        : 0;
                    vitalsData = vitalsRows.map(r => ({
                        elapsedMin: Math.round(
                            (new Date(r.recorded_at).getTime() - sessionStartMs) / 60_000
                        ),
                        hr: r.heart_rate ?? null,
                        bp_s: r.systolic_bp ?? null,
                        bp_d: r.diastolic_bp ?? null,
                        recordedAt: r.recorded_at,
                    }));
                }

                // ── 7. WO-553: Timeline events for PDF event log table ─────────────────
                const { data: tlRows, error: tlErr } = await supabase
                    .from('log_session_timeline_events')
                    .select('occurred_at, event_type, label')
                    .eq('session_id', sessionId)
                    .order('occurred_at', { ascending: true });

                let timelineEvents: Phase3TimelineEvent[] | null = null;
                let hasRealTimelineData = false;

                if (!tlErr && tlRows && tlRows.length > 0) {
                    hasRealTimelineData = true;
                    timelineEvents = tlRows.map(r => ({
                        occurredAt: r.occurred_at,
                        eventType: r.event_type ?? 'unknown',
                        label: r.label ?? r.event_type ?? 'Event',
                    }));
                }

                if (!cancelled) {
                    setState({
                        decayPoints,
                        baselinePhq9,
                        currentPhq9,
                        pulseCheckCompliance,
                        phq9Compliance,
                        integrationSessionsAttended,
                        integrationSessionsScheduled,
                        pulseTrend,
                        vitalsData,
                        timelineEvents,
                        hasRealVitalsData,
                        hasRealTimelineData,
                        hasRealDecayData: !!hasRealDecayData,
                        hasRealPulseData,
                        hasRealComplianceData,
                        hasRealIntegrationData,
                        isLoading: false,
                        error: null,
                    });
                }
            } catch (err: any) {
                // Network / RLS failure → graceful fallback, no crash
                console.error('[usePhase3Data] Query failed — using mock fallback:', err?.message);
                if (!cancelled) {
                    setState({
                        decayPoints: null,
                        baselinePhq9: null,
                        currentPhq9: null,
                        pulseCheckCompliance: 0,
                        phq9Compliance: 0,
                        integrationSessionsAttended: 0,
                        integrationSessionsScheduled: 0,
                        pulseTrend: null,
                        vitalsData: null,
                        timelineEvents: null,
                        hasRealVitalsData: false,
                        hasRealTimelineData: false,
                        hasRealDecayData: false,
                        hasRealPulseData: false,
                        hasRealComplianceData: false,
                        hasRealIntegrationData: false,
                        isLoading: false,
                        error: 'Live data unavailable.',
                    });
                }
            }
        };

        fetchAll();
        return () => { cancelled = true; };
    }, [sessionId, patientId]);

    return state;
}
