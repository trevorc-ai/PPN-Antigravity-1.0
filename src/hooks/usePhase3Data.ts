
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
        hasRealDecayData: false,
        hasRealPulseData: false,
        hasRealComplianceData: false,
        hasRealIntegrationData: false,
        isLoading: true,
        error: null,
    });

    useEffect(() => {
        // If no identifiers provided, immediately fall back to mock
        if (!sessionId || !patientId) {
            setState(prev => ({
                ...prev,
                decayPoints: MOCK_DECAY_POINTS,
                baselinePhq9: 22,
                currentPhq9: 20,
                pulseCheckCompliance: 0,
                phq9Compliance: 0,
                integrationSessionsAttended: 0,
                integrationSessionsScheduled: 0,
                pulseTrend: MOCK_PULSE_TREND,
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

                const baselinePhq9: number = (!baselineErr && baselineRow?.phq9_score != null)
                    ? baselineRow.phq9_score
                    : 22; // mock fallback

                const currentPhq9 = hasRealDecayData && decayPoints.length > 0
                    ? decayPoints[decayPoints.length - 1].phq9
                    : 20;

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
                        decayPoints: MOCK_DECAY_POINTS,
                        baselinePhq9: 22,
                        currentPhq9: 20,
                        pulseCheckCompliance: 0,
                        phq9Compliance: 0,
                        integrationSessionsAttended: 0,
                        integrationSessionsScheduled: 0,
                        pulseTrend: MOCK_PULSE_TREND,
                        hasRealDecayData: false,
                        hasRealPulseData: false,
                        hasRealComplianceData: false,
                        hasRealIntegrationData: false,
                        isLoading: false,
                        error: 'Live data unavailable — showing demo data.',
                    });
                }
            }
        };

        fetchAll();
        return () => { cancelled = true; };
    }, [sessionId, patientId]);

    return state;
}
