import React, { useState, useEffect, useMemo } from 'react';
import {
    Activity, Sparkles, CheckCircle, ChevronRight, X, Info, Clock, Download,
    Heart, Play, AlertTriangle, FileText, Lock, CheckSquare, ArrowRight,
    CheckCircle2, Edit3, AlertCircle, Pill, ShieldAlert
} from 'lucide-react';
import { runContraindicationEngine } from '../../services/contraindicationEngine';
import { AdvancedTooltip } from '../ui/AdvancedTooltip';
import { WorkflowActionCard } from './WorkflowCards';
import AdaptiveAssessmentPage from '../../pages/AdaptiveAssessmentPage';
import { WellnessFormId } from './WellnessFormRouter';
import { LiveSessionTimeline } from './LiveSessionTimeline';
import { SessionVitalsTrendChart } from './SessionVitalsTrendChart';
import { useToast } from '../../contexts/ToastContext';
import { useProtocol } from '../../contexts/ProtocolContext';

interface TreatmentPhaseProps {
    journey: any;
    completedForms: Set<string>;
    onOpenForm: (formId: WellnessFormId) => void;
    onCompletePhase: () => void;
}

type SessionMode = 'pre' | 'live' | 'post';

export const TreatmentPhase: React.FC<TreatmentPhaseProps> = ({ journey, completedForms, onOpenForm, onCompletePhase }) => {
    const { addToast } = useToast();
    const { config } = useProtocol();
    const SESSION_KEY = `ppn_session_mode_${journey.session?.sessionId ?? journey.sessionId ?? 'demo'}`;
    const SESSION_START_KEY = `ppn_session_start_${journey.session?.sessionId ?? journey.sessionId ?? 'demo'}`;

    // Bump this counter whenever we want to force a contraindication re-evaluation
    const [contraindicationKey, setContraindicationKey] = useState(0);

    // Re-evaluate contraindications when dosing protocol or medications are updated
    // in localStorage (DosingProtocolForm and StructuredSafetyCheckForm write these keys)
    useEffect(() => {
        const bump = () => setContraindicationKey(k => k + 1);
        // storage event = cross-tab writes; ppn:dosing-updated = same-tab writes
        const handleStorage = (e: StorageEvent) => {
            if (e.key === 'ppn_dosing_protocol' || e.key === 'mock_patient_medications_names') bump();
        };
        window.addEventListener('storage', handleStorage);
        window.addEventListener('ppn:dosing-updated', bump);
        return () => {
            window.removeEventListener('storage', handleStorage);
            window.removeEventListener('ppn:dosing-updated', bump);
        };
    }, []);

    // Restore mode from localStorage on mount (survives companion-page navigation)
    const [mode, setMode] = useState<SessionMode>(() => {
        try { return (localStorage.getItem(SESSION_KEY) as SessionMode) ?? 'pre'; } catch { return 'pre'; }
    });

    const setAndPersistMode = (nextMode: SessionMode) => {
        setMode(nextMode);
        try {
            localStorage.setItem(SESSION_KEY, nextMode);
            if (nextMode === 'live') {
                // Only write start time once — don't overwrite if already set
                if (!localStorage.getItem(SESSION_START_KEY)) {
                    localStorage.setItem(SESSION_START_KEY, String(Date.now()));
                }
            } else if (nextMode === 'pre') {
                localStorage.removeItem(SESSION_START_KEY);
            }
        } catch { /* quota exceeded */ }
    };

    // Timer — calculated from wall-clock start time so it survives rerenders
    const [elapsedTime, setElapsedTime] = useState('00:00:00');
    useEffect(() => {
        if (mode !== 'live') {
            if (mode === 'pre') setElapsedTime('00:00:00');
            return;
        }
        const tick = () => {
            try {
                const raw = localStorage.getItem(SESSION_START_KEY);
                const startMs = raw ? Number(raw) : Date.now();
                const diff = Date.now() - startMs;
                const h = Math.floor(diff / 3600000).toString().padStart(2, '0');
                const m = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
                const s = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
                setElapsedTime(`${h}:${m}:${s}`);
            } catch { setElapsedTime('00:00:00'); }
        };
        tick(); // immediate first tick
        const interval = setInterval(tick, 1000);
        return () => clearInterval(interval);
    }, [mode]);

    // Derived from completedForms prop
    const isDosingProtocolComplete = completedForms.has('dosing-protocol');
    const isVitalsComplete = !config.enabledFeatures.includes('session-vitals') || completedForms.has('session-vitals');
    const canStartSession = isDosingProtocolComplete && isVitalsComplete;
    const isLive = mode === 'live';

    // Keyboard Shortcuts (live mode only)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (mode !== 'live') return;
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
            switch (e.key.toLowerCase()) {
                case 'v': onOpenForm('session-vitals'); break;
                case 'a': onOpenForm('safety-and-adverse-event'); break;
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [mode, onOpenForm]);

    // Post-session assessment state
    const [showAssessmentModal, setShowAssessmentModal] = useState(false);
    const [assessmentCompleted, setAssessmentCompleted] = useState(false);
    const [assessmentScores, setAssessmentScores] = useState<{ meq: number; edi: number; ceq: number } | null>(null);

    // Live Vitals (mock)
    const [liveVitals] = useState({ hr: 82, bp: '125/82', spo2: 98, hrv: 45 });

    // ── POST-SESSION VIEW ──────────────────────────────────────────────────────────
    if (mode === 'post') {
        return (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-500">
                <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl">
                    <div className="flex items-start justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-black text-[#A8B5D1]">Session Closeout</h2>
                            <p className="text-slate-400 mt-1">Complete mandatory post-session documentation.</p>
                        </div>
                        <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-full text-xs font-bold uppercase tracking-wider">
                            Phase 2: Closeout
                        </div>
                    </div>

                    <div className="space-y-4 mb-8">
                        <div className="p-5 bg-emerald-900/10 border border-emerald-900/30 rounded-2xl flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                                    <CheckSquare className="w-5 h-5" />
                                </div>
                                <span className="text-[#A8B5D1] font-bold line-through decoration-emerald-500/50 decoration-2">Session End Time Recorded</span>
                            </div>
                            <span className="text-xs font-mono text-emerald-600 font-bold px-2 py-1 bg-emerald-500/10 rounded">AUTO</span>
                        </div>

                        <button
                            onClick={() => setShowAssessmentModal(true)}
                            className="w-full p-5 bg-slate-800/40 border border-slate-700 hover:border-blue-500/50 hover:bg-slate-800/60 rounded-2xl flex items-center justify-between transition-all group"
                        >
                            <div className="flex items-center gap-4">
                                {assessmentCompleted ? (
                                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                                        <CheckSquare className="w-5 h-5" />
                                    </div>
                                ) : (
                                    <div className="w-8 h-8 rounded-full border-2 border-slate-600 flex items-center justify-center group-hover:border-blue-400 transition-colors">
                                        <div className="w-2 h-2 rounded-full bg-slate-600 group-hover:bg-blue-400 transition-colors opacity-0 group-hover:opacity-100" />
                                    </div>
                                )}
                                <div className="flex flex-col items-start">
                                    <span className={assessmentCompleted ? 'text-[#A8B5D1] font-bold line-through opacity-50' : 'text-[#A8B5D1] font-bold'}>
                                        Post-Session Assessments
                                    </span>
                                    <span className="text-xs text-slate-400">MEQ-30, EDI, CEQ (Standard Battery)</span>
                                </div>
                            </div>
                            {assessmentCompleted && <span className="text-xs font-bold text-emerald-500 px-2 py-1 bg-emerald-500/10 rounded border border-emerald-500/20">COMPLETED</span>}
                        </button>

                        <div className="p-5 bg-slate-800/40 border border-slate-700 rounded-2xl flex items-center justify-between opacity-50 cursor-not-allowed">
                            <div className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-full border-2 border-slate-600 flex items-center justify-center">
                                    <div className="w-2 h-2 rounded-full bg-slate-600" />
                                </div>
                                <span className="text-slate-400 font-bold">Review Safety Events (0)</span>
                            </div>
                            <span className="text-xs text-slate-600 font-bold border border-slate-700 px-2 py-1 rounded">NO EVENTS</span>
                        </div>
                    </div>

                    <div className="flex flex-col items-center pt-8 border-t border-slate-800">
                        <button
                            disabled={!assessmentCompleted}
                            onClick={onCompletePhase}
                            className={`w-full md:w-2/3 py-5 rounded-2xl font-black text-xl tracking-wide shadow-lg transition-all flex items-center justify-center gap-4 ${assessmentCompleted
                                ? 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-blue-900/40 cursor-pointer hover:scale-[1.01] active:scale-[0.99]'
                                : 'bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700'
                                }`}
                        >
                            <Lock className="w-5 h-5" />
                            SUBMIT & CLOSE SESSION
                        </button>
                        {!assessmentCompleted && (
                            <div className="flex items-center gap-2 mt-4 text-red-400/80 bg-red-950/20 px-3 py-1 rounded-full border border-red-900/30">
                                <AlertTriangle className="w-3 h-3" />
                                <span className="text-xs font-bold">Pending: Post-Session Assessments</span>
                            </div>
                        )}
                    </div>
                </div>

                {showAssessmentModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                        <div className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-[#0a1628] rounded-2xl shadow-2xl border border-slate-700">
                            <button
                                onClick={() => setShowAssessmentModal(false)}
                                className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-slate-800/80 hover:bg-slate-700 rounded-full transition-colors border border-slate-700 hover:border-slate-500"
                            >
                                <X className="w-5 h-5 text-slate-300" />
                            </button>
                            <div className="p-6">
                                <AdaptiveAssessmentPage
                                    showBackButton={false}
                                    onComplete={(scores) => {
                                        setAssessmentScores(scores);
                                        setAssessmentCompleted(true);
                                    }}
                                    onClose={() => setShowAssessmentModal(false)}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // ── BUILD STEP CARDS (pre + live) ──────────────────────────────────────────────
    const PHASE2_STEPS: Array<{ id: WellnessFormId | '__start__'; label: string; icon: string; isComplete: boolean }> = [
        {
            id: 'dosing-protocol',
            label: 'Dosing Protocol',
            icon: 'medication',
            isComplete: isDosingProtocolComplete,
        },
        ...(config.enabledFeatures.includes('session-vitals') ? [{
            id: 'session-vitals' as WellnessFormId,
            label: 'Baseline Vitals',
            icon: 'monitor_heart',
            isComplete: isVitalsComplete,
        }] : []),
        {
            id: '__start__',
            label: 'Start Session',
            icon: 'play_arrow',
            isComplete: isLive,
        },
    ];


    const currentStepIdx = isLive ? -1 : PHASE2_STEPS.findIndex(s => !s.isComplete);

    // ── Contraindication checker (local engine, no DB) ────────────────────────
    const contraindicationResults = useMemo(() => {
        try {
            // Try to get selected substance from dosing protocol cached data
            let substanceName = '';
            try {
                const cachedProtocol = localStorage.getItem('ppn_dosing_protocol');
                if (cachedProtocol) {
                    const parsed = JSON.parse(cachedProtocol);
                    substanceName = parsed.substance_name || parsed.substance || '';
                }
            } catch (_) { }

            // Try to get patient meds from structured safety check cache
            let medications: string[] = [];
            try {
                const cachedMeds = localStorage.getItem('mock_patient_medications_names');
                if (cachedMeds) medications = JSON.parse(cachedMeds);
                if (!medications.length) medications = ['Sertraline (tapering)', 'Lisinopril']; // demo fallback
            } catch (_) {
                medications = ['Sertraline (tapering)', 'Lisinopril'];
            }

            if (!substanceName || !medications.length) return null;
            const engineInput: import('../../services/contraindicationEngine').IntakeScreeningData = {
                patientId: 'demo',
                sessionSubstance: substanceName.toLowerCase(),
                medications: medications.map(m => m.toLowerCase()),
                psychiatricHistory: [],
                familyHistory: [],
            };
            return runContraindicationEngine(engineInput);
        } catch (_) { return null; }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isDosingProtocolComplete, contraindicationKey]); // re-run when dosing protocol changes or key bumped

    // Current meds list for display
    const patientMeds = useMemo(() => {
        try {
            const cached = localStorage.getItem('mock_patient_medications_names');
            if (cached) {
                const parsed = JSON.parse(cached);
                if (Array.isArray(parsed) && parsed.length) return parsed as string[];
            }
        } catch (_) { }
        return ['Sertraline (tapering)', 'Lisinopril'];
    }, []);

    return (
        <div className="space-y-4 animate-in fade-in duration-500">

            {/* ── Section Label + Progress ─────────────────────────────────────── */}
            <div className="flex items-center justify-between px-1">
                <h2 className="ppn-label" style={{ color: '#34D399' }}>
                    {isLive ? 'Session Active' : 'Session Preparation'} · {PHASE2_STEPS.length} Steps
                </h2>
                <div className="flex items-center gap-3">
                    <div className="w-28 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-emerald-700 to-emerald-400 rounded-full transition-all duration-700"
                            style={{ width: `${(PHASE2_STEPS.filter(s => s.isComplete).length / PHASE2_STEPS.length) * 100}%` }}
                            role="progressbar"
                            aria-valuenow={PHASE2_STEPS.filter(s => s.isComplete).length}
                            aria-valuemax={PHASE2_STEPS.length}
                            aria-label="Session preparation progress"
                        />
                    </div>
                    <span className="text-sm font-semibold text-slate-400">
                        {PHASE2_STEPS.filter(s => s.isComplete).length}/{PHASE2_STEPS.length}
                    </span>
                </div>
            </div>

            {/* ── Step Cards (3-up, matching Phase 1 anatomy exactly) ──────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {PHASE2_STEPS.map((step, index) => {
                    const isStart = step.id === '__start__';
                    const isCurrent = !isLive && index === currentStepIdx;

                    return (
                        <div
                            key={step.id}
                            className={[
                                'relative flex flex-col rounded-xl transition-all duration-300 overflow-hidden',
                                step.isComplete
                                    ? 'bg-teal-900/20'
                                    : isCurrent
                                        ? 'bg-emerald-900/40 shadow-lg shadow-emerald-950/60'
                                        : 'bg-slate-800/20 hover:bg-slate-800/35',
                            ].join(' ')}
                        >
                            {/* Top accent stripe */}
                            <div className={[
                                'h-0.5 w-full',
                                step.isComplete ? 'bg-teal-600/60' : isCurrent ? 'bg-emerald-400' : 'bg-slate-700/40',
                            ].join(' ')} aria-hidden="true" />

                            <div className="flex flex-col flex-1 p-4 gap-3">
                                {/* Step label + status badge */}
                                <div className="flex items-center justify-between gap-1">
                                    <span className={`text-xs md:text-sm font-bold uppercase tracking-widest ${step.isComplete ? 'text-teal-500' : isCurrent ? 'text-emerald-400' : 'text-slate-500'}`}>
                                        Step {index + 1}
                                    </span>
                                    {step.isComplete ? (
                                        <CheckCircle2 className="w-4 h-4 text-teal-400 flex-shrink-0" aria-label="Complete" />
                                    ) : (
                                        <span className="text-xs font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-700/50 text-slate-400">
                                            {isStart ? 'Gate' : 'Req'}
                                        </span>
                                    )}
                                </div>

                                {/* Icon + title */}
                                <div className="flex items-start gap-2.5">
                                    <div className={[
                                        'w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5',
                                        step.isComplete ? 'bg-teal-500/15' : isCurrent ? 'bg-emerald-500/25' : 'bg-slate-700/30',
                                    ].join(' ')}>
                                        <span className={`material-symbols-outlined text-[18px] ${step.isComplete ? 'text-teal-400' : isCurrent ? 'text-emerald-300' : 'text-slate-500'}`}>
                                            {step.icon}
                                        </span>
                                    </div>
                                    <h4 className={`text-sm md:text-base font-black leading-snug pt-1 ${step.isComplete ? 'text-teal-200' : isCurrent ? 'text-[#A8B5D1]' : 'text-slate-400'}`}>
                                        {step.label}
                                    </h4>
                                </div>

                                {/* CTA area */}
                                <div className="mt-auto pt-2">
                                    {step.isComplete ? (
                                        <div className="flex flex-col items-center gap-1 mt-2">
                                            <span className="flex items-center gap-1.5 text-sm font-black uppercase tracking-widest text-teal-400">
                                                <CheckCircle2 className="w-4 h-4" /> COMPLETED
                                            </span>
                                            {!isStart && (
                                                <button
                                                    onClick={() => onOpenForm(step.id)}
                                                    className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-400 hover:text-teal-300 transition-all"
                                                    aria-label={`Amend ${step.label}`}
                                                >
                                                    <Edit3 className="w-3.5 h-3.5" aria-hidden="true" /> Amend
                                                </button>
                                            )}
                                        </div>
                                    ) : isStart ? (
                                        /* Start Session CTA */
                                        <button
                                            onClick={canStartSession ? () => setAndPersistMode('live') : undefined}
                                            disabled={!canStartSession}
                                            className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 font-black text-sm rounded-xl transition-all active:scale-95 ${canStartSession
                                                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-950/50'
                                                : 'bg-slate-800/30 text-slate-600 cursor-not-allowed border border-slate-700/50'
                                                }`}
                                            aria-label="Start dosing session"
                                        >
                                            {canStartSession ? (
                                                <><Play className="w-4 h-4 fill-white" aria-hidden="true" /> Start</>
                                            ) : (
                                                <><Lock className="w-4 h-4" aria-hidden="true" /> Locked</>
                                            )}
                                        </button>
                                    ) : isCurrent ? (
                                        <button
                                            onClick={() => onOpenForm(step.id)}
                                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600/40 hover:bg-emerald-600/60 text-emerald-100 font-black text-sm rounded-xl transition-all active:scale-95 shadow-md shadow-emerald-950/50"
                                        >
                                            Open
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => onOpenForm(step.id)}
                                            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-slate-700/50 bg-slate-800/30 text-sm font-semibold text-slate-500 hover:text-slate-300 hover:bg-slate-700/40 hover:border-slate-600/50 transition-all"
                                        >
                                            Open
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* ── Medications & Contraindication Panel ─────────────────────── */}
            <div className="flex items-stretch gap-3 p-4 rounded-2xl bg-slate-900/40 border border-slate-800/40">
                {/* Left: patient meds as chips */}
                <div className="flex-1 min-w-0">
                    <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-2">Current Medications</p>
                    <div className="flex flex-wrap gap-1.5">
                        {patientMeds.map((med, i) => (
                            <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800/60 border border-slate-700/50 text-slate-300 text-xs font-semibold">
                                <Pill className="w-3 h-3 text-slate-500" />
                                {med}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Divider */}
                <div className="w-px bg-slate-700/40 self-stretch" />

                {/* Right: contraindication indicator */}
                <div className="flex-shrink-0 flex items-center justify-center">
                    {!contraindicationResults ? (
                        <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                            <ShieldAlert className="w-4 h-4" /> No substance selected
                        </span>
                    ) : contraindicationResults.absoluteFlags.length > 0 ? (
                        <span className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs font-black uppercase tracking-wider">
                            <AlertTriangle className="w-4 h-4 text-red-400" />
                            ABSOLUTE CONTRAINDICATION
                        </span>
                    ) : contraindicationResults.relativeFlags.length > 0 ? (
                        <span className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-300 text-xs font-black uppercase tracking-wider">
                            <AlertCircle className="w-4 h-4 text-amber-400" />
                            RELATIVE CONTRAINDICATION
                        </span>
                    ) : (
                        <span className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-950/30 border border-emerald-700/30 text-emerald-400 text-xs font-black uppercase tracking-wider">
                            <CheckCircle2 className="w-4 h-4" />
                            ALL CLEAR
                        </span>
                    )}
                </div>
            </div>

            {/* ── Timer Bar (sticky when live) ──────────────────────────────────── */}
            <div className={`rounded-2xl border transition-all duration-500 ${isLive ? 'sticky top-2 z-30 bg-[#061115]/95 border-emerald-900/40 shadow-lg shadow-emerald-950/30 backdrop-blur-xl'
                : 'bg-slate-900/30 border-slate-800/40 opacity-50 select-none'
                }`}>
                <div className="flex items-center justify-between px-5 py-4 gap-4">
                    <div>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-emerald-600/80 font-bold mb-0.5">
                            {isLive ? 'Session Active' : 'Session Timer'}
                        </p>
                        <p className="text-3xl font-black text-emerald-50/90 font-mono tracking-tight leading-none tabular-nums">
                            {elapsedTime}
                        </p>
                    </div>

                    {/* Live vitals ticker */}
                    {isLive && config.enabledFeatures.includes('session-vitals') && (
                        <div className="flex items-center gap-5 bg-[#040C0E]/60 px-4 py-3 rounded-xl border border-[#14343B]/40">
                            <div className="text-right">
                                <p className="text-[10px] uppercase tracking-widest text-[#507882] font-semibold mb-0.5">HR</p>
                                <div className="flex items-center gap-1 justify-end">
                                    <Heart className="w-3 h-3 text-rose-500/80 fill-rose-500/30 animate-pulse" />
                                    <p className="text-lg font-bold text-emerald-100 leading-none">{liveVitals.hr}</p>
                                </div>
                            </div>
                            <div className="w-px h-6 bg-[#14343B]/50" />
                            <div className="text-right">
                                <p className="text-[10px] uppercase tracking-widest text-[#507882] font-semibold mb-0.5">BP</p>
                                <p className="text-lg font-bold text-emerald-100 leading-none">{liveVitals.bp}</p>
                            </div>
                            <div className="w-px h-6 bg-[#14343B]/50" />
                            <div className="text-right">
                                <p className="text-[10px] uppercase tracking-widest text-[#507882] font-semibold mb-0.5">SpO2</p>
                                <p className={`text-lg font-bold leading-none ${liveVitals.spo2 < 95 ? 'text-amber-400' : 'text-emerald-100'}`}>{liveVitals.spo2}%</p>
                            </div>
                        </div>
                    )}

                    {/* End session button — only when live */}
                    {isLive && (
                        <div className="flex items-center gap-3 ml-auto">
                            <a
                                href={`#/companion/${journey.sessionId || 'demo-1'}`}
                                className="px-4 py-2.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 font-semibold rounded-xl border border-indigo-500/30 transition-colors uppercase tracking-widest text-xs flex items-center gap-1.5"
                            >
                                <Sparkles className="w-3.5 h-3.5" />
                                Companion
                            </a>
                            <button
                                onClick={() => setAndPersistMode('post')}
                                className="px-5 py-2.5 bg-[#0A1F24] hover:bg-[#0E292E] text-[#6E9CA8] hover:text-[#A3C7D2] font-semibold rounded-xl border border-[#14343B] transition-colors uppercase tracking-[0.15em] text-xs flex items-center gap-2 group"
                            >
                                End Session
                                <ArrowRight className="w-3.5 h-3.5 opacity-50 group-hover:translate-x-0.5 transition-transform" />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Two Large Action Buttons (session events) ────────────────────── */}
            <div className="grid grid-cols-2 gap-3">
                {/* Log Rescue Protocol — purple/pink (caring intervention) */}
                <button
                    onClick={isLive ? () => onOpenForm('rescue-protocol') : undefined}
                    disabled={!isLive}
                    className={`flex items-center justify-center gap-3 px-6 py-5 rounded-2xl font-black text-base tracking-wide transition-all active:scale-95 border ${isLive
                        ? 'bg-gradient-to-br from-purple-900/60 to-fuchsia-900/40 hover:from-purple-800/70 hover:to-fuchsia-800/50 border-purple-500/40 hover:border-purple-400/60 text-purple-100 shadow-lg shadow-purple-950/40'
                        : 'bg-slate-800/20 border-slate-700/30 text-slate-600 cursor-not-allowed'
                        }`}
                    aria-label="Log rescue protocol"
                >
                    <span className={`material-symbols-outlined text-[22px] ${isLive ? 'text-purple-300' : 'text-slate-600'}`}>
                        emergency
                    </span>
                    <span>Log Rescue Protocol</span>
                </button>

                {/* Log Adverse Reaction — red (crisis) */}
                <button
                    onClick={isLive ? () => onOpenForm('safety-and-adverse-event') : undefined}
                    disabled={!isLive}
                    className={`flex items-center justify-center gap-3 px-6 py-5 rounded-2xl font-black text-base tracking-wide transition-all active:scale-95 border ${isLive
                        ? 'bg-gradient-to-br from-red-900/60 to-rose-900/40 hover:from-red-800/70 hover:to-rose-800/50 border-red-500/40 hover:border-red-400/60 text-red-100 shadow-lg shadow-red-950/40'
                        : 'bg-slate-800/20 border-slate-700/30 text-slate-600 cursor-not-allowed'
                        }`}
                    aria-label="Log adverse reaction"
                >
                    <AlertTriangle className={`w-5 h-5 ${isLive ? 'text-red-300' : 'text-slate-600'}`} />
                    <span>Log Adverse Reaction</span>
                </button>
            </div>

            {/* Keyboard shortcuts hint — live only */}
            {isLive && (
                <div className="flex items-center justify-center gap-4 px-4 py-2.5 bg-slate-900/40 border border-slate-800/50 rounded-xl">
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-600">Quick Keys:</p>
                    {[{ key: 'V', label: 'Vitals' }, { key: 'A', label: 'Adverse' }].map(({ key, label }) => (
                        <div key={key} className="flex items-center gap-1.5">
                            <kbd className="inline-flex items-center justify-center w-5 h-5 rounded bg-slate-800 border border-slate-700 text-xs font-mono font-bold text-slate-400">{key}</kbd>
                            <span className="text-xs text-slate-600">{label}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* ── Cockpit Real Estate (live session outputs) ───────────────────── */}
            {isLive && (
                <div className="space-y-6">
                    {config.enabledFeatures.includes('session-vitals') && (
                        <SessionVitalsTrendChart
                            sessionId={journey.session?.sessionNumber?.toString() || '1'}
                            substance={journey.session?.substance}
                            onThresholdViolation={(vital, value) => {
                                addToast({
                                    title: `[ALERT] ${vital} threshold exceeded`,
                                    message: `${vital}: ${value} — review immediately`,
                                    type: 'error',
                                    persistent: true
                                });
                            }}
                        />
                    )}
                    <LiveSessionTimeline
                        sessionId={journey.session?.sessionNumber?.toString() || '1'}
                        active={true}
                    />
                </div>
            )}
        </div>
    );
};
