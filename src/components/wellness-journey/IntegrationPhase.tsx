import React, { useState, useMemo, useEffect } from 'react';
import {
    TrendingUp, CheckCircle, ChevronDown, ChevronUp, Download,
    Heart, Activity, FileText, Shield, Brain, AlertTriangle,
    Pill, Clock, Zap, Info, ChevronRight, Link as LinkIcon
} from 'lucide-react';
import { AdvancedTooltip } from '../ui/AdvancedTooltip';
import SymptomDecayCurve from '../arc-of-care/SymptomDecayCurve';
import PulseCheckWidget from '../arc-of-care/PulseCheckWidget';
import PredictedIntegrationNeeds from '../arc-of-care/PredictedIntegrationNeeds';
import { ProgressRiskFlags } from '../risk/ProgressRiskFlags';
import { SafetyTimeline } from '../safety/SafetyTimeline';
import PatientJourneySnapshot from '../analytics/PatientJourneySnapshot';
import ConfidenceCone from '../analytics/ConfidenceCone';
import { NeuroplasticityWindowBadge } from './NeuroplasticityWindowBadge';
import { PatientProgressSummary, type ProgressSummaryData } from './PatientProgressSummary';
import MagicLinkModal from './MagicLinkModal';
import { downloadDischargeSummary, type DischargeSummaryData } from '../../services/dischargeSummary';
import { useToast } from '../../contexts/ToastContext';
import { usePhase3Data } from '../../hooks/usePhase3Data';
import { DemoDataBadge } from './DemoDataBadge';
import type { RiskFlag } from '../../utils/riskCalculator';
// SAVS P3-C fix: createPulseCheck wired to inline PulseCheckWidget submit
// SAVS P3-D fix: createTimelineEvent for discharge summary DB timestamp
import { createPulseCheck, createTimelineEvent } from '../../services/clinicalLog';
import { supabase } from '../../supabaseClient';

interface IntegrationPhaseProps {
    journey: any;
    // WO-550 Defect #21: onOpenForm wires step buttons to SlideOut form panels.
    // completedForms tracks which forms have been saved, driving card completed state.
    onOpenForm?: (formId: string) => void;
    completedForms?: Set<string>;
}

// ─── Sub-components ────────────────────────────────────────────────────────────

/** Read-only strip summarising the Phase 2 dosing session */
const SessionSnapshotStrip: React.FC<{ journey: any; phase2Assessment: any | null }> = ({ journey, phase2Assessment }) => {
    const substance = journey.session?.substance ?? journey.dosingSession?.substance ?? null;
    const dose = journey.session?.dose ?? journey.dosingSession?.dose ?? null;
    const difficulty = journey.session?.psychologicalDifficulty ?? null;
    const resolutionStatus = journey.session?.resolutionStatus ?? null;
    const safetyEventCount = journey.session?.adverseEventCount ?? 0;

    const chip = (label: string, value: React.ReactNode, colorClass = 'text-slate-300') => (
        <div className="flex flex-col gap-0.5 min-w-0">
            <span className="ppn-meta text-slate-500 font-bold uppercase tracking-widest">{label}</span>
            <span className={`ppn-meta font-bold ${colorClass}`}>{value}</span>
        </div>
    );

    return (
        <div className="bg-teal-950/20 border border-teal-500/20 rounded-2xl px-5 py-4 flex flex-wrap gap-x-6 gap-y-3 items-center">
            <div className="flex items-center gap-2 mr-2 shrink-0">
                <Pill className="w-4 h-4 text-teal-400" aria-hidden="true" />
                <span className="ppn-meta font-black text-teal-400 uppercase tracking-widest">Session</span>
            </div>

            {/* Substance + Dose */}
            {chip(
                'Substance',
                substance ? `${substance}${dose ? ` · ${dose}` : ''}` : 'Not recorded',
                substance ? 'text-slate-200' : 'text-slate-600'
            )}

            {/* MEQ + CEQ */}
            <div className="flex flex-col gap-0.5 min-w-0">
                <span className="ppn-meta text-slate-500 font-bold uppercase tracking-widest">
                    Experience
                    <AdvancedTooltip
                        content="MEQ-30 = mystical depth of the experience. CEQ = how challenging it was. Both together shape what integration requires."
                        tier="micro"
                        learnMoreUrl="/help/wellness-journey"
                    >
                        <Info className="inline ml-1 w-3 h-3 text-slate-600 cursor-help" />
                    </AdvancedTooltip>
                </span>
                {phase2Assessment ? (
                    <span className="ppn-meta font-bold text-slate-200">
                        MEQ&nbsp;{phase2Assessment.meq} &nbsp;·&nbsp; CEQ&nbsp;{phase2Assessment.ceq}
                    </span>
                ) : (
                    <span className="ppn-meta font-bold text-slate-600">Not recorded</span>
                )}
            </div>

            {/* Difficulty + Resolution */}
            <div className="flex flex-col gap-0.5 min-w-0">
                <span className="ppn-meta text-slate-500 font-bold uppercase tracking-widest">Difficulty</span>
                {difficulty !== null ? (
                    <span className={`ppn-meta font-bold ${resolutionStatus === 'Unresolved' ? 'text-amber-400' : 'text-slate-200'}`}>
                        {difficulty}/10 {resolutionStatus ? `· ${resolutionStatus}` : ''}
                    </span>
                ) : (
                    <span className="ppn-meta font-bold text-slate-600">Not recorded</span>
                )}
            </div>

            {/* Safety Events */}
            {chip(
                'Safety',
                safetyEventCount > 0
                    ? `${safetyEventCount} Event${safetyEventCount > 1 ? 's' : ''} Logged`
                    : 'No Events',
                safetyEventCount > 0 ? 'text-amber-400' : 'text-teal-400'
            )}
        </div>
    );
};

/** Empty state for a panel not yet unlocked */
const PanelEmptyState: React.FC<{ message: string }> = ({ message }) => (
    <div className="flex flex-col items-center justify-center py-10 px-4 text-center gap-3">
        <div className="w-10 h-10 rounded-full bg-slate-800/60 border border-slate-700/50 flex items-center justify-center">
            <Clock className="w-5 h-5 text-slate-600" />
        </div>
        <p className="ppn-body text-slate-500 max-w-xs">{message}</p>
    </div>
);

/** Teal Phase 3 Action Card, matches Phase 1 anatomy */
const IntegrationCard: React.FC<{
    stepNum: number;
    icon: React.ReactNode;
    title: string;
    description: string;
    status: 'pending' | 'completed' | 'archived';
    onOpen?: () => void;
    /** WO-550 AC: Read-only summary strip shown beneath completed cards.
     *  text-sm minimum (≥14px). Clicking re-opens the form for amendment. */
    summary?: string;
}> = ({ stepNum, icon, title, description, status, onOpen, summary }) => {
    const isArchived = status === 'archived';
    const isCompleted = status === 'completed';

    return (
        <div className="flex flex-col">
            <div className={`relative rounded-2xl border overflow-hidden transition-all duration-300
                ${isArchived ? 'border-slate-700/30 bg-slate-900/20 opacity-50' : 'border-teal-500/20 bg-teal-950/10 hover:border-teal-500/40'}
            `}>
                {/* Top accent stripe */}
                <div className={`h-1 w-full ${isArchived ? 'bg-slate-700' : isCompleted ? 'bg-teal-500' : 'bg-teal-900/60'}`} />
                <div className="p-5 flex items-start gap-4">
                    <div className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center border
                        ${isArchived ? 'border-slate-700 bg-slate-800/30 text-slate-600' : isCompleted ? 'border-teal-500/50 bg-teal-900/30 text-teal-400' : 'border-teal-700/40 bg-teal-950/40 text-teal-500'}
                    `}>
                        {isCompleted ? <CheckCircle className="w-4 h-4" /> : icon}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="ppn-meta text-slate-600 font-bold">Step {stepNum}</span>
                            {isCompleted && <span className="ppn-meta text-teal-500 font-black uppercase tracking-widest">Completed</span>}
                        </div>
                        <h4 className="ppn-label text-slate-300 mb-1">{title}</h4>
                        <p className="ppn-meta text-slate-500">{description}</p>
                    </div>
                    {!isArchived && (
                        <button
                            onClick={onOpen}
                            className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border transition-all
                                ${isCompleted
                                    ? 'border-teal-700/40 bg-teal-950/20 text-teal-500 hover:border-teal-500/60'
                                    : 'border-teal-600/50 bg-teal-900/30 text-teal-300 hover:bg-teal-900/50'
                                }`}
                            aria-label={isCompleted ? `Amend ${title}` : `Open ${title}`}
                        >
                            {isCompleted ? 'Amend' : 'Open'}
                            <ChevronRight className="w-3 h-3" />
                        </button>
                    )}
                </div>
            </div>

            {/* WO-550 AC: Summary strip, visible only when completed + summary available.
                text-sm (14px) minimum per INSPECTOR requirement. Clickable to re-open form. */}
            {isCompleted && summary && (
                <button
                    onClick={onOpen}
                    className="mt-1.5 w-full text-left px-4 py-2.5 rounded-xl bg-teal-950/40 border border-teal-500/15 hover:border-teal-500/30 hover:bg-teal-950/60 transition-all group"
                    aria-label={`View summary for ${title}, click to amend`}
                >
                    <p className="text-sm text-teal-300/80 group-hover:text-teal-200 transition-colors leading-snug">
                        <span className="font-bold text-teal-400 mr-1.5">↳</span>{summary}
                    </p>
                </button>
            )}
        </div>
    );
};


// ─── Main Component ────────────────────────────────────────────────────────────

export const IntegrationPhase: React.FC<IntegrationPhaseProps> = ({ journey, onOpenForm, completedForms = new Set() }) => {
    const [showPulseCheck, setShowPulseCheck] = useState(true);
    const [showProgressSummary, setShowProgressSummary] = useState(false);
    const [isMagicLinkModalOpen, setIsMagicLinkModalOpen] = useState(false);
    const [showSafetyTimeline, setShowSafetyTimeline] = useState(false);
    const { addToast } = useToast();

    // ── Phase 3 real data hook ──────────────────────────────────────────────────
    const phase3 = usePhase3Data(journey.sessionId, journey.patientId);

    // Session date for badge
    const sessionDateForBadge = journey.sessionDate
        ? new Date(journey.sessionDate)
        : (() => { const d = new Date(); d.setDate(d.getDate() - 7); return d; })();

    // Days since session, drives time-gating
    const daysPostSession = Math.floor(
        (Date.now() - sessionDateForBadge.getTime()) / 86_400_000
    );

    // Compliance values
    const pulseCompliance = phase3.pulseCheckCompliance ?? journey.integration?.pulseCheckCompliance ?? 0;
    const phq9Compliance = phase3.phq9Compliance ?? journey.integration?.phq9Compliance ?? 0;
    const intAttended = phase3.integrationSessionsAttended ?? journey.integration?.integrationSessionsAttended ?? 0;
    const intScheduled = phase3.integrationSessionsScheduled ?? journey.integration?.integrationSessionsScheduled ?? 0;

    // Decay points
    const decayPoints = phase3.decayPoints ?? [
        { day: 7, phq9: 14 }, { day: 14, phq9: 11 }, { day: 30, phq9: 9 },
        { day: 60, phq9: 7 }, { day: 90, phq9: 6 }, { day: 120, phq9: 5 },
        { day: 180, phq9: journey.integration?.currentPhq9 ?? 4 },
    ];
    const baselinePhq9 = phase3.baselinePhq9 ?? journey.baseline?.phq9 ?? 22;

    // Pulse trend
    const activePulseTrend = phase3.pulseTrend ?? [];

    // ── Decline risk flags derived from decay points ────────────────────────────
    const riskFlags = useMemo<RiskFlag[]>(() => {
        if (!decayPoints || decayPoints.length < 2) return [];
        const last = decayPoints[decayPoints.length - 1];
        const prev = decayPoints[decayPoints.length - 2];
        const regression = last.phq9 - prev.phq9;
        if (regression >= Math.ceil(prev.phq9 * 0.05)) {
            return [{
                type: 'progress' as const,
                metric: 'PHQ-9',
                severity: regression >= 5 ? 'high' : 'moderate',
                value: last.phq9,
                message: `PHQ-9 increased by ${regression} points since last assessment (Day ${prev.day} → Day ${last.day}).`,
                mitigation: 'Schedule an unplanned integration session. Review stressors, sleep and support network. Consider increasing assessment frequency.',
            } as RiskFlag];
        }
        return [];
    }, [decayPoints]);

    // WO-602 D: Query log_safety_events filtered by session_id so Safety Event History shows real data.
    // Previous: journey.session?.adverseEvents which is in-memory only and never populated from DB.
    const [safetyEvents, setSafetyEvents] = useState<any[]>(journey.session?.adverseEvents ?? []);
    useEffect(() => {
        const sid = journey.sessionId;
        if (!sid || !/^[0-9a-f-]{36}$/i.test(sid)) return;
        (async () => {
            try {
                const { data: rows } = await supabase
                    .from('log_safety_events')
                    .select('id, event_type, ctcae_grade, causality_code, resolved_at, created_at, actions_taken, cssrs_score')
                    .eq('session_id', sid)
                    .order('created_at', { ascending: true });
                if (rows && rows.length > 0) {
                    setSafetyEvents(rows.map(r => ({
                        id: r.id,
                        date: r.created_at,
                        cssrsScore: (r.cssrs_score ?? 0) as any,
                        actionsTaken: Array.isArray(r.actions_taken)
                            ? r.actions_taken
                            : r.actions_taken ? [r.actions_taken] : [],
                    })));
                }
            } catch (_) { /* best-effort: show in-memory events as fallback */ }
        })();
    }, [journey.sessionId]);

    // ── WO-550 AC: Summary strings for completed integration step cards ──────────
    // Shown as clickable strip beneath each card when the form has been saved.
    // text-sm enforced in IntegrationCard component.
    const integrationSessionSummary = completedForms.has('structured-integration')
        ? 'Integration session documented · Click to view or amend'
        : undefined;

    const longitudinalSummary = completedForms.has('longitudinal-assessment')
        ? (() => {
            const phq = phase3.currentPhq9;
            const parts: string[] = [];
            if (phq != null) parts.push(`PHQ-9: ${phq}`);
            parts.push('Assessment recorded · Click to amend');
            return parts.join(' · ');
        })()
        : undefined;

    const behavioralSummary = completedForms.has('behavioral-tracker')
        ? 'Behavioral changes recorded · Click to view or amend'
        : undefined;

    const meq30Summary = completedForms.has('meq30')
        ? (() => {
            const meq = journey.session?.meq30Score;
            return meq != null ? `MEQ-30 score: ${meq} · Click to amend` : 'MEQ-30 recorded · Click to amend';
        })()
        : undefined;

    // ── Pulse chart averages ────────────────────────────────────────────────────
    const avgConnection = activePulseTrend.length > 0
        ? (activePulseTrend.reduce((s, d) => s + d.connection, 0) / activePulseTrend.length).toFixed(1)
        : '—';
    const avgSleep = activePulseTrend.length > 0
        ? (activePulseTrend.reduce((s, d) => s + d.sleep, 0) / activePulseTrend.length).toFixed(1)
        : '—';

    const handleExportTrend = () => {
        const csvRows = [
            'date,day,connection_level,sleep_quality',
            ...activePulseTrend.map(d => `${d.date},${d.day},${d.connection},${d.sleep}`),
        ];
        const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `pulse_check_trend_${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleDischargeSummary = async () => {
        // siteId comes from auth/registration context, not the journey object
        const { getCurrentSiteId } = await import('../../services/identity');
        const resolvedSiteId = await getCurrentSiteId() ?? 'SITE-UNKNOWN';

        const sessionId = journey.session?.sessionId ?? journey.sessionId;
        const today = new Date().toISOString().split('T')[0];

        const dischargeData: DischargeSummaryData = {
            patientId: journey.patientId ?? 'PT-DEMO',
            siteId: resolvedSiteId,
            clinicianId: journey.clinicianId ?? 'Provider-Unknown', // TODO: wire from auth session user ID when available
            treatmentStart: journey.sessionDate
                ? new Date(journey.sessionDate).toISOString().split('T')[0]
                : today,
            treatmentEnd: today,
            dosingSessionsCount: 1, // TODO: multi-session count not yet tracked; single session is current model
            integrationSessionsCount: intAttended,
            diagnosis: journey.diagnosis ?? 'Not recorded', // TODO: wire when diagnosis field is collected in intake
            substanceName: journey.session?.substance ?? 'Not recorded',
            substanceDose: journey.session?.dose ?? 'Not recorded',
            protocolName: journey.protocolName ?? 'Standard Protocol', // TODO: wire from ProtocolConfigurator record
            baseline: {
                phq9: baselinePhq9,
                gad7: journey.risk?.baseline?.gad7 ?? null, // TODO: add gad7 to baseline schema
                caps5: null, // TODO: CAPS-5 not yet collected
            },
            final: {
                phq9: phase3.currentPhq9 ?? null,
                gad7: null, // TODO: wire when longitudinal GAD-7 is tracked
                caps5: null, // TODO: CAPS-5 not yet collected
            },
            meq30Peak: journey.session?.meq30Score ?? null,
            responseAchieved: phase3.currentPhq9 != null && baselinePhq9 > 0
                ? (((baselinePhq9 - phase3.currentPhq9) / baselinePhq9) >= 0.5 ? 'YES (>=50% reduction)' : 'NO')
                : 'NO',
            remissionAchieved: phase3.currentPhq9 != null
                ? (phase3.currentPhq9 < 5 ? 'YES' : 'NO')
                : 'NO',
            adverseEventsCount: safetyEvents.length,
            grade3EventsCount: 0, // TODO: wire CTCAE grade filter when safety event severity is tracked
            chemicalRescueUsed: safetyEvents.some((e: any) => e.event_type === 'rescue') ? 'YES' : 'NO',
            ongoingVulnerabilities: 'Review integration notes for ongoing concerns.', // TODO: derive from integration session forms
            referralName: 'Unassigned (Pending Referral)', // TODO: wire from referral tracking
            followUpWeeks: 4,
            emergencyPlanSummary: 'Contact crisis line 988 if symptoms return.',
            selfCareSummary: 'Review integration session recommendations for patient-specific plan.',
            clinicianStatement: 'Discharge summary auto-generated. Clinician review required before distribution.',
        };

        downloadDischargeSummary(dischargeData);
        addToast({ title: 'Discharge Summary Generated', message: 'Final clinical outcome report exported securely.', type: 'success' });

        // SAVS P3-D fix: stamp DB record that a discharge summary was generated
        if (sessionId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(sessionId)) {
            createTimelineEvent({
                session_id: sessionId,
                event_timestamp: new Date().toISOString(),
                event_type_code: 'integration_visit_completed',
                metadata: { event_description: 'Discharge summary PDF generated and exported by practitioner.' },
            }).catch(err => console.warn('[SAVS-P3D] Discharge summary DB timestamp failed:', err));
        }
    };

    const progressSummaryData: ProgressSummaryData = {
        subjectId: journey.patientId ?? 'PT-DEMO',
        clinicianName: 'Attending Practitioner',
        clinicName: 'PPN Partner Clinic',
        primaryInstrument: 'PHQ-9',
        baselineScore: baselinePhq9,
        endpointScore: phase3.currentPhq9 ?? journey.integration?.currentPhq9 ?? 9,
        followupWeeks: Math.round(daysPostSession / 7),
        completedStages: ['intake', 'preparation', 'dosing', 'integration'],
        nextSteps: [
            '30-day reassessment (PHQ-9) recommended',
            'Continue weekly integration sessions',
            'Maintain daily pulse check logging',
        ],
        sessionDate: journey.sessionDate
            ? new Date(journey.sessionDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
            : undefined,
        substance: journey.session?.substance,
    };

    // ── Panel header helper ────────────────────────────────────────────────────
    const PanelHeader: React.FC<{ icon: React.ReactNode; title: string; description: string; tooltip: string; isDemo?: boolean }> =
        ({ icon, title, description, tooltip, isDemo }) => (
            <div className="flex items-start justify-between gap-3 mb-5">
                <div className="flex items-start gap-3">
                    <div className="shrink-0 w-9 h-9 rounded-xl bg-teal-900/30 border border-teal-700/30 flex items-center justify-center text-teal-400">
                        {icon}
                    </div>
                    <div>
                        <h3 className="ppn-card-title">{title}</h3>
                        <p className="ppn-meta text-slate-500 mt-0.5">{description}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    {isDemo !== undefined && <DemoDataBadge isDemo={isDemo} />}
                    {/* WO-550 Defect #22: side='left' prevents right-edge clipping */}
                    <AdvancedTooltip content={tooltip} tier="guide" side="left" learnMoreUrl="/help/wellness-journey">
                        <Info className="w-4 h-4 text-slate-600 hover:text-slate-300 cursor-help transition-colors" />
                    </AdvancedTooltip>
                </div>
            </div>
        );

    // ── Render ─────────────────────────────────────────────────────────────────
    return (
        <div className="space-y-6 animate-in fade-in duration-500">

            {/* 1 ── Session Snapshot Strip ───────────────────────────────────── */}
            <SessionSnapshotStrip journey={journey} phase2Assessment={{ meq: journey.session?.meq30Score ?? null, ceq: journey.session?.ceqScore ?? null }} />

            {/* 2 ── Neuroplasticity Window Badge ────────────────────────────── */}
            {/* WO-550 Defect #23: hasRealSession hides misleading 'closed' state for demo data */}
            <NeuroplasticityWindowBadge
                sessionDate={sessionDateForBadge}
                windowDays={21}
                hasRealSession={!!(journey.sessionId && /^[0-9a-f-]{36}$/i.test(journey.sessionId))}
            />

            {/* 3 ── Integration Action Cards ────────────────────────────────── */}
            <section aria-label="Phase 3 integration steps" className="bg-slate-900/40 border border-teal-500/15 rounded-3xl p-6">
                {/* Section header */}
                <div className="flex items-center justify-between mb-5">
                    <div>
                        <h2 className="ppn-section-title text-teal-300">Integration · Post-Session Steps</h2>
                        <p className="ppn-meta text-slate-500 mt-1">All steps are optional. Complete in any order.</p>
                    </div>
                </div>

                {/* Time Horizon A, Day 0–3 */}
                <div className="mb-6">
                    <div className={`flex items-center gap-2 mb-3 ${daysPostSession > 3 ? 'opacity-50' : ''}`}>
                        <div className="h-px flex-1 bg-slate-700/50" />
                        <span className="ppn-meta text-slate-500 font-bold uppercase tracking-widest shrink-0">
                            {daysPostSession > 3 ? 'Day 0–3 · Completed Window' : 'Day 0–3 · Immediate Follow-Up'}
                        </span>
                        <div className="h-px flex-1 bg-slate-700/50" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* SAVS P3-A fix: Step 1 wired to structured-safety form */}
                        <IntegrationCard
                            stepNum={1}
                            icon={<Shield className="w-4 h-4" />}
                            title="Safety Check"
                            description="Confirm the patient is stable and safe post-session."
                            status={daysPostSession > 3 ? 'archived' : completedForms.has('structured-safety') ? 'completed' : 'pending'}
                            onOpen={onOpenForm && daysPostSession <= 3 ? () => onOpenForm('structured-safety') : undefined}
                        />
                        {/* SAVS P3-A fix: Step 2 wired to daily-pulse form */}
                        <IntegrationCard
                            stepNum={2}
                            icon={<Heart className="w-4 h-4" />}
                            title="Daily Pulse, First Check-In"
                            description="Log the patient's first mood and sleep reading post-session."
                            status={daysPostSession > 3 ? 'archived' : completedForms.has('daily-pulse') ? 'completed' : 'pending'}
                            onOpen={onOpenForm && daysPostSession <= 3 ? () => onOpenForm('daily-pulse') : undefined}
                        />
                    </div>
                </div>

                {/* Time Horizon B, Days to Weeks */}
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <div className="h-px flex-1 bg-slate-700/50" />
                        <span className="ppn-meta text-slate-500 font-bold uppercase tracking-widest shrink-0">Days to Weeks · Ongoing Integration</span>
                        <div className="h-px flex-1 bg-slate-700/50" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <IntegrationCard
                            stepNum={3}
                            icon={<Brain className="w-4 h-4" />}
                            title="Integration Session"
                            description="Document your clinical integration conversation with the patient."
                            status={completedForms.has('structured-integration') ? 'completed' : 'pending'}
                            onOpen={onOpenForm ? () => onOpenForm('structured-integration') : undefined}
                            summary={integrationSessionSummary}
                        />
                        <IntegrationCard
                            stepNum={4}
                            icon={<TrendingUp className="w-4 h-4" />}
                            title="Longitudinal Assessment (PHQ-9 / GAD-7)"
                            description="Re-assess symptom scores. This powers all outcome visualizations below."
                            status={completedForms.has('longitudinal-assessment') ? 'completed' : 'pending'}
                            onOpen={onOpenForm ? () => onOpenForm('longitudinal-assessment') : undefined}
                            summary={longitudinalSummary}
                        />
                        <IntegrationCard
                            stepNum={5}
                            icon={<Activity className="w-4 h-4" />}
                            title="Behavioral Change Tracker"
                            description="Track habit formation and behavioral shifts since the session."
                            status={completedForms.has('behavioral-tracker') ? 'completed' : 'pending'}
                            onOpen={onOpenForm ? () => onOpenForm('behavioral-tracker') : undefined}
                            summary={behavioralSummary}
                        />
                        {/* MEQ-30 card, only if not completed in Phase 2 */}
                        {!journey.session?.meq30Score && (
                            <IntegrationCard
                                stepNum={6}
                                icon={<Zap className="w-4 h-4" />}
                                title="MEQ-30 Assessment"
                                description="Document the depth and quality of the session experience (24–48 hrs post-session ideal)."
                                status={completedForms.has('meq30') ? 'completed' : 'pending'}
                                onOpen={onOpenForm ? () => onOpenForm('meq30') : undefined}
                                summary={meq30Summary}
                            />
                        )}
                    </div>
                </div>
            </section>

            {/* 4 ── Forecasted Integration Plan ────────────────────────────── */}
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6">
                <PanelHeader
                    icon={<Brain className="w-4 h-4" />}
                    title="Forecasted Integration Plan"
                    description="Algorithm-based prediction of sessions needed, driven by baseline risk profile."
                    tooltip="Uses ACE score, GAD-7, PCL-5, and PHQ-9 baseline to forecast the number and frequency of integration sessions this patient is likely to need. Based on clinical outcome research (n=5,000+)."
                />
                {phase3.isLoading ? (
                    <div className="h-32 bg-slate-800/30 rounded-2xl animate-pulse" />
                ) : (journey.risk.baseline?.ace === 0 && journey.risk.baseline?.gad7 === 0) ? (
                    <PanelEmptyState message="Complete Phase 1 Mental Health Screening to unlock this integration forecast." />
                ) : (
                    <PredictedIntegrationNeeds
                        aceScore={journey.risk.baseline?.ace ?? 0}
                        gad7Score={journey.risk.baseline?.gad7 ?? 0}
                        expectancyScale={journey.baseline?.expectancy ?? 0}
                        phq9Score={baselinePhq9}
                        pcl5Score={journey.risk.baseline?.pcl5 ?? 0}
                    />
                )}
            </div>

            {/* 5 ── Declining Trend Alert (conditional, only if triggered) ── */}
            {riskFlags.length > 0 && <ProgressRiskFlags flags={riskFlags} />}

            {/* 6 ── Safety Event History (collapsible) ─────────────────────── */}
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl overflow-hidden">
                <button
                    onClick={() => setShowSafetyTimeline(!showSafetyTimeline)}
                    className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-800/30 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                    aria-expanded={showSafetyTimeline}
                    aria-controls="safety-timeline-panel"
                >
                    <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-teal-400" aria-hidden="true" />
                        <div className="text-left">
                            <h3 className="ppn-card-title">Safety Event History</h3>
                            <p className="ppn-meta text-slate-500 mt-0.5">Chronological record of all safety checks and adverse events.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        {safetyEvents.length > 0 && (
                            <span className="ppn-meta text-amber-400 font-black">{safetyEvents.length} Event{safetyEvents.length > 1 ? 's' : ''}</span>
                        )}
                        {showSafetyTimeline
                            ? <ChevronUp className="w-4 h-4 text-slate-500" />
                            : <ChevronDown className="w-4 h-4 text-slate-500" />}
                    </div>
                </button>
                {showSafetyTimeline && (
                    <div id="safety-timeline-panel" className="px-6 pb-6">
                        <SafetyTimeline
                            events={safetyEvents}
                            patientId={journey.patientId}
                        />
                    </div>
                )}
            </div>

            {/* 7 ── Patient Journey Timeline ───────────────────────────────── */}
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6">
                <PanelHeader
                    icon={<FileText className="w-4 h-4" />}
                    title="Patient Journey Timeline"
                    description="Symptom score over time, with dosing and integration events pinned on the same axis."
                    tooltip="Each blue dot is a PHQ-9 measurement. Coloured icons mark clinical events: cyan = dosing, violet = integration session, amber = safety check. Hover any point for details."
                    isDemo={!phase3.hasRealDecayData}
                />
                {phase3.isLoading ? (
                    <div className="h-64 bg-slate-800/30 rounded-2xl animate-pulse" />
                ) : (
                    <PatientJourneySnapshot
                        sessionId={journey.sessionId}
                        phase2Events={safetyEvents}
                    />
                )}
            </div>

            {/* 8 ── Symptom Decay Curve (6-month) ──────────────────────────── */}
            <div className="bg-gradient-to-br from-teal-500/5 to-teal-900/5 border border-teal-500/20 rounded-3xl p-6 shadow-lg shadow-teal-900/10">
                <PanelHeader
                    icon={<TrendingUp className="w-4 h-4" />}
                    title="Symptom Decay Curve"
                    description="PHQ-9 severity over 6 months post-session, with severity zones and the 14-day afterglow window highlighted."
                    tooltip="The blue shaded area at the left is the neuroplasticity afterglow period (Days 0–14) where change is most likely. The dashed green line marks clinical remission (PHQ-9 < 5). Scores are from completed Longitudinal Assessments."
                    isDemo={!phase3.hasRealDecayData}
                />
                {phase3.isLoading ? (
                    <div className="h-48 bg-slate-800/30 rounded-2xl animate-pulse" aria-label="Loading symptom decay data" />
                ) : !phase3.hasRealDecayData ? (
                    <PanelEmptyState message="Complete a Longitudinal Assessment to unlock Symptom Decay tracking." />
                ) : (
                    <SymptomDecayCurve baselinePhq9={baselinePhq9} dataPoints={decayPoints} />
                )}
            </div>

            {/* 9 ── Trajectory vs. Cohort (ConfidenceCone) ─────────────────── */}
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6">
                <PanelHeader
                    icon={<Activity className="w-4 h-4" />}
                    title="Trajectory vs. Reference Cohort"
                    description="This patient's recovery compared to a reference cohort of similar patients."
                    tooltip="The gray shaded band is the 95% confidence interval of the reference cohort (N=14k published data). The blue line is this patient's PHQ-9 scores over time. Outperforming means the patient is improving faster than the typical range."
                    isDemo={true}
                />
                {phase3.isLoading ? (
                    <div className="h-64 bg-slate-800/30 rounded-2xl animate-pulse" />
                ) : !phase3.hasRealDecayData ? (
                    <PanelEmptyState message="Complete a Longitudinal Assessment to compare against the reference cohort." />
                ) : (
                    <ConfidenceCone />
                )}
            </div>

            {/* 10 ── Daily Pulse 7-Day Trend ────────────────────────────────── */}
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                    <Heart className="w-32 h-32 text-pink-500" />
                </div>
                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-3">
                            <div className="shrink-0 w-9 h-9 rounded-xl bg-pink-900/20 border border-pink-700/30 flex items-center justify-center text-pink-400">
                                <Heart className="w-4 h-4" aria-hidden="true" />
                            </div>
                            <div>
                                <h3 className="ppn-card-title">Daily Pulse</h3>
                                <p className="ppn-meta text-slate-500 mt-0.5">Patient's self-reported connection and sleep quality over the past 7 days.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <DemoDataBadge isDemo={!phase3.hasRealPulseData} />
                            <AdvancedTooltip content="Export 7-day pulse check trend as CSV for integration session review." tier="micro" learnMoreUrl="/help/wellness-journey">
                                <button
                                    onClick={handleExportTrend}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400 hover:text-white text-xs font-bold rounded-lg transition-colors uppercase tracking-wider focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                                    aria-label="Export 7-day pulse trend as CSV"
                                >
                                    <Download className="w-3 h-3" />
                                    CSV
                                </button>
                            </AdvancedTooltip>
                            <button
                                onClick={() => setShowPulseCheck(!showPulseCheck)}
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-800 hover:bg-slate-700 transition-colors border border-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                                aria-label={showPulseCheck ? 'Collapse pulse check' : 'Expand pulse check'}
                            >
                                {showPulseCheck ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                            </button>
                        </div>
                    </div>

                    {showPulseCheck && (
                        <div className="space-y-6 animate-in slide-in-from-top duration-300">
                            {!phase3.hasRealPulseData ? (
                                <PanelEmptyState message="Log a Daily Pulse check-in to see the 7-day trend." />
                            ) : (
                                <>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="p-4 bg-slate-800/40 rounded-xl text-center border border-slate-700/50">
                                            <p className="ppn-meta text-slate-500 font-bold uppercase tracking-widest mb-1">Avg Connection</p>
                                            {phase3.isLoading
                                                ? <div className="h-8 w-20 mx-auto bg-slate-700/50 rounded-lg animate-pulse" />
                                                : <p className="text-3xl font-black text-pink-400">{avgConnection}<span className="text-base text-slate-600 font-normal">/5</span></p>
                                            }
                                        </div>
                                        <div className="p-4 bg-slate-800/40 rounded-xl text-center border border-slate-700/50">
                                            <p className="ppn-meta text-slate-500 font-bold uppercase tracking-widest mb-1">Avg Sleep</p>
                                            {phase3.isLoading
                                                ? <div className="h-8 w-20 mx-auto bg-slate-700/50 rounded-lg animate-pulse" />
                                                : <p className="text-3xl font-black text-blue-400">{avgSleep}<span className="text-base text-slate-600 font-normal">/5</span></p>
                                            }
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex items-center justify-between mb-3">
                                            <p className="ppn-meta text-slate-500 font-bold uppercase tracking-widest">7-Day Trend</p>
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-1.5">
                                                    <div className="w-2 h-2 rounded-full bg-pink-500" />
                                                    <span className="ppn-meta text-slate-500 font-bold uppercase">Connection</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                                                    <span className="ppn-meta text-slate-500 font-bold uppercase">Sleep</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-7 gap-2 h-32 items-end pb-2">
                                            {activePulseTrend.map((d) => (
                                                <div key={d.day} className="flex flex-col items-center gap-2 h-full justify-end group/bar">
                                                    <div className="w-full relative flex flex-col items-center gap-1">
                                                        <div
                                                            className="w-full bg-blue-500/20 border-t-2 border-blue-500 rounded-sm transition-all group-hover/bar:bg-blue-500/40"
                                                            style={{ height: `${(d.sleep / 5) * 40}px` }}
                                                        />
                                                        <div
                                                            className="w-full bg-pink-500/20 border-t-2 border-pink-500 rounded-sm transition-all group-hover/bar:bg-pink-500/40"
                                                            style={{ height: `${(d.connection / 5) * 40}px` }}
                                                        />
                                                    </div>
                                                    <span className="ppn-caption text-slate-500 group-hover/bar:text-slate-300">{d.day.slice(0, 1)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Daily Pulse Check Widget, BUG FIX: use real patientId + sessionId */}
                            <div className="pt-4 border-t border-slate-800">
                                <p className="text-base font-bold font-manrope text-slate-300 mb-3">Today's Check-In</p>
                                <PulseCheckWidget
                                    patientId={journey.patientId}
                                    sessionId={journey.session?.sessionId ?? journey.sessionId}
                                    onSubmit={async (data) => {
                                        // SAVS P3-C fix: was console.log only - now writes to log_pulse_checks
                                        if (!journey.patientId) return;
                                        const result = await createPulseCheck({
                                            patient_id: journey.patientId,
                                            session_id: journey.session?.sessionId ?? journey.sessionId,
                                            check_date: new Date().toISOString().split('T')[0],
                                            connection_level: data.connection_level ?? 3,
                                            sleep_quality: data.sleep_quality ?? 3,
                                            mood_level: data.mood_level,
                                            anxiety_level: data.anxiety_level,
                                        });
                                        if (!result.success) {
                                            console.warn('[SAVS-P3C] Pulse check widget DB write failed:', result.error);
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* 11 ── Compliance ─────────────────────────────────────────────── */}
            <section aria-label="Integration compliance metrics" className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 flex flex-col">
                <div className="flex items-center justify-between gap-3 mb-5">
                    <div className="flex items-center gap-3">
                        <Activity className="w-5 h-5 text-teal-400" aria-hidden="true" />
                        <div>
                            <h3 className="ppn-card-title">Compliance</h3>
                            <p className="ppn-meta text-slate-500 mt-0.5">Check-in and assessment completion rates since the session.</p>
                        </div>
                    </div>
                    <DemoDataBadge isDemo={!phase3.hasRealComplianceData} />
                </div>

                {/* Low-compliance alert */}
                {pulseCompliance < 60 && (
                    <div className="mb-5 px-4 py-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" aria-hidden="true" />
                        <p className="ppn-meta text-amber-300">Low check-in compliance, consider proactive outreach to this patient.</p>
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 flex-1">
                    {/* Pulse Check Compliance */}
                    <div className="space-y-2" role="group" aria-label="Daily Pulse compliance">
                        <AdvancedTooltip content="Percentage of days since the session on which the patient logged a Daily Pulse check-in." tier="micro" side="bottom" learnMoreUrl="/help/wellness-journey">
                            <div className="flex items-center justify-between ppn-meta font-bold uppercase tracking-wider text-slate-500 cursor-help">
                                <span>Daily Pulse <Info className="inline w-3 h-3 ml-1" /></span>
                                <span className={pulseCompliance >= 80 ? 'text-teal-400' : 'text-amber-400'}>{pulseCompliance}%</span>
                            </div>
                        </AdvancedTooltip>
                        <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden" role="progressbar" aria-valuenow={pulseCompliance} aria-valuemin={0} aria-valuemax={100} aria-label={`Daily pulse compliance: ${pulseCompliance}%`}>
                            <div className={`h-full rounded-full transition-all duration-700 ${pulseCompliance >= 80 ? 'bg-teal-500' : 'bg-amber-500'}`} style={{ width: `${pulseCompliance}%` }} />
                        </div>
                    </div>

                    {/* PHQ-9 Compliance */}
                    <div className="space-y-2" role="group" aria-label="Weekly PHQ-9 compliance">
                        <AdvancedTooltip content="Percentage of expected weekly PHQ-9 assessments that have been completed since the session." tier="micro" side="bottom" learnMoreUrl="/help/wellness-journey">
                            <div className="flex items-center justify-between ppn-meta font-bold uppercase tracking-wider text-slate-500 cursor-help">
                                <span>Weekly PHQ-9 <Info className="inline w-3 h-3 ml-1" /></span>
                                <span className={phq9Compliance >= 90 ? 'text-teal-400' : 'text-amber-400'}>{phq9Compliance}%</span>
                            </div>
                        </AdvancedTooltip>
                        <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden" role="progressbar" aria-valuenow={phq9Compliance} aria-valuemin={0} aria-valuemax={100} aria-label={`Weekly PHQ-9 compliance: ${phq9Compliance}%`}>
                            <div className={`h-full rounded-full transition-all duration-700 ${phq9Compliance >= 90 ? 'bg-teal-500' : 'bg-amber-500'}`} style={{ width: `${phq9Compliance}%` }} />
                        </div>
                    </div>

                    {/* Integration Sessions counter */}
                    <AdvancedTooltip content="Number of integration therapy sessions completed vs. scheduled for this patient." tier="micro" side="bottom" learnMoreUrl="/help/wellness-journey">
                        <div className="p-4 bg-slate-800/40 border border-slate-700/50 rounded-xl text-center cursor-help" role="group" aria-label={`Integration sessions attended: ${intAttended} of ${intScheduled}`}>
                            <div className="text-3xl font-black text-teal-400 mb-1" aria-hidden="true">
                                {intAttended}<span className="text-xl text-slate-500 font-normal">/{intScheduled}</span>
                            </div>
                            <div className="ppn-meta text-slate-500 font-bold uppercase tracking-widest">Integration Sessions</div>
                        </div>
                    </AdvancedTooltip>
                </div>
            </section>

            {/* 12 ── Action row ─────────────────────────────────────────────── */}
            <div className="pt-8 border-t border-slate-700/50 flex flex-col sm:flex-row items-center gap-4 justify-center">
                <button
                    onClick={() => setShowProgressSummary(true)}
                    className="flex items-center justify-center gap-3 w-full sm:w-1/3 py-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-black text-sm md:text-base tracking-wide rounded-2xl shadow border border-slate-600/50 transition-all hover:scale-[1.01] active:scale-[0.99]"
                >
                    <FileText className="w-5 h-5 text-teal-400" />
                    Progress Summary
                </button>
                <button
                    onClick={() => setIsMagicLinkModalOpen(true)}
                    className="flex items-center justify-center gap-3 w-full sm:w-1/3 py-4 bg-slate-800 hover:bg-slate-700 text-indigo-300 font-black text-sm md:text-base tracking-wide rounded-2xl shadow border border-indigo-500/30 transition-all hover:scale-[1.01] active:scale-[0.99]"
                >
                    <LinkIcon className="w-5 h-5" />
                    Share Patient Link
                </button>
                <button
                    onClick={handleDischargeSummary}
                    className="flex items-center justify-center gap-3 w-full sm:w-1/3 py-4 bg-gradient-to-r from-teal-700 to-teal-600 hover:from-teal-600 hover:to-teal-500 text-white font-black text-sm md:text-base tracking-wide rounded-2xl shadow-lg shadow-teal-900/40 transition-all hover:scale-[1.01] active:scale-[0.99] border border-teal-500/30"
                >
                    <CheckCircle className="w-5 h-5" />
                    Discharge Summary
                </button>
            </div>

            {/* Patient Progress Summary Modal */}
            {showProgressSummary && (
                <PatientProgressSummary
                    data={progressSummaryData}
                    onClose={() => setShowProgressSummary(false)}
                />
            )}

            {/* Magic Link Modal */}
            <MagicLinkModal
                isOpen={isMagicLinkModalOpen}
                onClose={() => setIsMagicLinkModalOpen(false)}
                patientHash={journey.patientId || "pt-unknown-hash"}
                sessionId={journey.sessionId ?? journey.session?.sessionId}
            />
        </div>
    );
};
