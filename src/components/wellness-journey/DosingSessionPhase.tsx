import React, { useState, useEffect } from 'react';
import { Activity, Sparkles, CheckCircle, ChevronRight, X, Info, Clock, Download, Heart, Play, AlertTriangle, FileText, Lock, CheckSquare, ArrowRight, CheckCircle2, Edit3, AlertCircle, Pill } from 'lucide-react';
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
    // Session State Management (Simulating the DB status)
    const [mode, setMode] = useState<SessionMode>('pre');

    const isDosingProtocolComplete = completedForms.has('dosing-protocol');
    const isVitalsComplete = !config.enabledFeatures.includes('session-vitals') || completedForms.has('session-vitals');
    const canStartSession = isDosingProtocolComplete && isVitalsComplete;

    // Timer State
    const [elapsedTime, setElapsedTime] = useState("00:00:00");

    // Simulations for "Live" feel
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (mode === 'live') {
            const startTime = Date.now();
            interval = setInterval(() => {
                const now = Date.now();
                const diff = now - startTime;
                const h = Math.floor(diff / 3600000).toString().padStart(2, '0');
                const m = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
                const s = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
                setElapsedTime(`${h}:${m}:${s}`);
            }, 1000);
        } else if (mode === 'pre') {
            setElapsedTime("00:00:00");
        }
        return () => clearInterval(interval);
    }, [mode]);

    // Keyboard Shortcuts (Speed & Accessibility)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (mode !== 'live') return;
            // Ignore if typing in an input
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

            switch (e.key.toLowerCase()) {
                case 'v':
                    onOpenForm('session-vitals');
                    break;
                case 'a':
                    onOpenForm('safety-and-adverse-event');
                    break;
                case 'escape':
                    // Close logic handled by router usually, but good to have
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [mode, onOpenForm]);

    const [showAssessmentModal, setShowAssessmentModal] = useState(false);
    const [assessmentCompleted, setAssessmentCompleted] = useState(false);
    const [assessmentScores, setAssessmentScores] = useState<{ meq: number; edi: number; ceq: number; } | null>(null);

    // Live Vitals State (Mock)
    const [liveVitals] = useState({ hr: 82, bp: "125/82", spo2: 98, hrv: 45 });

    // ─── 1. PRE-SESSION VIEW ─────────────────────────────────────────────────────
    if (mode === 'pre') {

        // Session prep steps
        const PHASE2_STEPS = [
            {
                id: 'dosing-protocol' as WellnessFormId,
                label: 'Dosing Protocol',
                icon: 'medication',
                required: true,
                isComplete: isDosingProtocolComplete,
            },
            ...(config.enabledFeatures.includes('session-vitals') ? [{
                id: 'session-vitals' as WellnessFormId,
                label: 'Baseline Vitals',
                icon: 'monitor_heart',
                required: true,
                isComplete: isVitalsComplete,
            }] : []),
        ];

        const currentStepIdx = PHASE2_STEPS.findIndex(s => !s.isComplete);

        // Medications + contraindication check (local engine, zero network calls)
        const storedSubstance: string = (() => {
            try { return localStorage.getItem('ppn_session_substance') || journey.session.substance || ''; } catch { return journey.session.substance || ''; }
        })();
        const storedMedNames: string[] = (() => {
            try {
                const raw = localStorage.getItem('mock_patient_medications_names');
                if (raw) return JSON.parse(raw);
            } catch { /* ignore */ }
            return ['Sertraline (tapering)', 'Lisinopril']; // demo patient default
        })();

        const contraindicationResult = storedSubstance
            ? runContraindicationEngine({
                patientId: journey.patientId || 'UNKNOWN',
                sessionSubstance: storedSubstance,
                medications: storedMedNames,
                psychiatricHistory: [],
                familyHistory: [],
            })
            : null;

        const hasAbsolute = (contraindicationResult?.absoluteFlags?.length ?? 0) > 0;
        const hasRelative = (contraindicationResult?.relativeFlags?.length ?? 0) > 0;

        return (
            <div className="space-y-4 animate-in fade-in duration-500">

                {/* ── Header ─────────────────────────────────────────── */}
                <div className="flex items-center justify-between px-1">
                    <h2 className="ppn-label" style={{ color: '#34D399' }}>Session Preparation · {PHASE2_STEPS.length + 1} Steps</h2>
                    <div className="flex items-center gap-3">
                        <div className="w-28 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-emerald-700 to-emerald-400 rounded-full transition-all duration-700"
                                style={{ width: `${(PHASE2_STEPS.filter(s => s.isComplete).length / (PHASE2_STEPS.length + 1)) * 100}%` }}
                                role="progressbar"
                                aria-valuenow={PHASE2_STEPS.filter(s => s.isComplete).length}
                                aria-valuemax={PHASE2_STEPS.length + 1}
                                aria-label="Session preparation progress"
                            />
                        </div>
                        <span className="text-sm font-semibold text-slate-400">
                            {PHASE2_STEPS.filter(s => s.isComplete).length}/{PHASE2_STEPS.length + 1}
                        </span>
                    </div>
                </div>

                {/* ── Step Cards ─────────────────────────────────────── */}
                <div className={`grid grid-cols-1 sm:grid-cols-${Math.min(PHASE2_STEPS.length + 1, 4)} gap-2`}>

                    {PHASE2_STEPS.map((step, index) => {
                        const isCurrent = index === currentStepIdx;
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
                                    <div className="flex items-center justify-between gap-1">
                                        <span className={`text-xs md:text-sm font-bold uppercase tracking-widest ${step.isComplete ? 'text-teal-500' : isCurrent ? 'text-emerald-400' : 'text-slate-500'
                                            }`}>
                                            Step {index + 1}
                                        </span>
                                        {step.isComplete ? (
                                            <CheckCircle2 className="w-4 h-4 text-teal-400 flex-shrink-0" aria-label="Complete" />
                                        ) : (
                                            <span className="text-xs font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-700/50 text-slate-400">Req</span>
                                        )}
                                    </div>

                                    <div className="flex items-start gap-2.5">
                                        <div className={[
                                            'w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5',
                                            step.isComplete ? 'bg-teal-500/15' : isCurrent ? 'bg-emerald-500/25' : 'bg-slate-700/30',
                                        ].join(' ')}>
                                            <span className={`material-symbols-outlined text-[18px] ${step.isComplete ? 'text-teal-400' : isCurrent ? 'text-emerald-300' : 'text-slate-500'
                                                }`}>
                                                {step.icon}
                                            </span>
                                        </div>
                                        <h4 className={`text-sm md:text-base font-black leading-snug pt-1 ${step.isComplete ? 'text-teal-200' : isCurrent ? 'text-[#A8B5D1]' : 'text-slate-400'
                                            }`}>
                                            {step.label}
                                        </h4>
                                    </div>

                                    <div className="mt-auto pt-2">
                                        {step.isComplete ? (
                                            <div className="flex flex-col items-center gap-1 mt-2">
                                                <span className="flex items-center gap-1.5 text-sm font-black uppercase tracking-widest text-teal-400">
                                                    <CheckCircle2 className="w-4 h-4" /> CONFIRMED
                                                </span>
                                                <button
                                                    onClick={() => onOpenForm(step.id)}
                                                    className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-400 hover:text-teal-300 transition-all"
                                                    aria-label={`Amend ${step.label}`}
                                                >
                                                    <Edit3 className="w-3.5 h-3.5" aria-hidden="true" /> Amend
                                                </button>
                                            </div>
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

                    {/* Step 3: Start Session card */}
                    <div className={[
                        'relative flex flex-col rounded-xl overflow-hidden transition-all duration-300',
                        canStartSession
                            ? 'bg-emerald-900/30 shadow-lg shadow-emerald-950/40'
                            : 'bg-slate-800/10 opacity-60',
                    ].join(' ')}>
                        <div className={`h-0.5 w-full ${canStartSession ? 'bg-emerald-500/60' : 'bg-slate-700/40'}`} aria-hidden="true" />
                        <div className="flex flex-col flex-1 p-4 gap-3">
                            <div className="flex items-center justify-between gap-1">
                                <span className={`text-xs md:text-sm font-bold uppercase tracking-widest ${canStartSession ? 'text-emerald-400' : 'text-slate-500'}`}>
                                    Step {PHASE2_STEPS.length + 1}
                                </span>
                                {canStartSession ? (
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                ) : (
                                    <Lock className="w-4 h-4 text-slate-600" aria-hidden="true" />
                                )}
                            </div>
                            <div className="flex items-start gap-2.5">
                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${canStartSession ? 'bg-emerald-500/25' : 'bg-slate-700/30'}`}>
                                    <Play className={`w-4 h-4 ${canStartSession ? 'text-emerald-300 fill-emerald-300' : 'text-slate-500'}`} />
                                </div>
                                <h4 className={`text-sm md:text-base font-black leading-snug pt-1 ${canStartSession ? 'text-[#A8B5D1]' : 'text-slate-500'}`}>
                                    Start Dosing Session
                                </h4>
                            </div>
                            <div className="mt-auto pt-2">
                                <button
                                    onClick={canStartSession ? () => setMode('live') : undefined}
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
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Medications & Contraindications Panel ──────────── */}
                <div className="rounded-2xl border border-slate-700/50 bg-slate-900/60 p-4 space-y-3">
                    <div className="flex items-center gap-2">
                        <Pill className="w-4 h-4 text-slate-400" aria-hidden="true" />
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Current Medications</h3>
                    </div>

                    {storedMedNames.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {storedMedNames.map((med, i) => (
                                <span key={i} className="inline-flex items-center px-3 py-1 rounded-full bg-slate-800/70 border border-slate-600/50 text-slate-300 text-sm font-medium">
                                    {med}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-slate-500 italic">No medications recorded in Phase 1 Safety Check.</p>
                    )}

                    {/* Absolute contraindications */}
                    {hasAbsolute && contraindicationResult!.absoluteFlags.map(flag => (
                        <div key={flag.id} className="flex gap-3 p-4 bg-red-950/70 border border-red-500/60 rounded-xl">
                            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                            <div className="space-y-1">
                                <p className="text-sm font-bold text-red-300 uppercase tracking-wide">ABSOLUTE CONTRAINDICATION</p>
                                <p className="text-sm font-semibold text-red-200">{flag.headline}</p>
                                <p className="text-xs text-red-300/80 leading-relaxed">{flag.detail}</p>
                                <p className="text-xs text-red-400/50 mt-1">{flag.regulatoryBasis}</p>
                            </div>
                        </div>
                    ))}

                    {/* Relative contraindications */}
                    {hasRelative && contraindicationResult!.relativeFlags.map(flag => (
                        <div key={flag.id} className="flex gap-3 p-4 bg-amber-950/60 border border-amber-500/50 rounded-xl">
                            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                            <div className="space-y-1">
                                <p className="text-sm font-bold text-amber-300 uppercase tracking-wide">CAUTION — Relative Contraindication</p>
                                <p className="text-sm font-semibold text-amber-200">{flag.headline}</p>
                                <p className="text-xs text-amber-300/80 leading-relaxed">{flag.detail}</p>
                                <p className="text-xs text-amber-400/50 mt-1">{flag.regulatoryBasis}</p>
                            </div>
                        </div>
                    ))}

                    {!hasAbsolute && !hasRelative && storedSubstance && (
                        <div className="flex items-center gap-2 px-3 py-2 bg-emerald-950/30 border border-emerald-700/30 rounded-xl">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                            <span className="text-sm text-emerald-300 font-medium">No contraindications flagged for {storedSubstance} with current medications.</span>
                        </div>
                    )}
                </div>

                {/* Emergency Protocol shortcut */}
                {config.enabledFeatures.includes('rescue-protocol') && (
                    <button
                        onClick={() => onOpenForm('rescue-protocol')}
                        className="w-full flex items-center justify-center gap-2.5 px-6 py-3 bg-slate-950 hover:bg-slate-900 border border-red-500/60 hover:border-red-400 text-red-400 font-bold rounded-xl transition-all active:scale-95 text-sm"
                    >
                        <span className="material-symbols-outlined text-[18px] text-red-400">emergency</span>
                        Log Rescue Protocol
                    </button>
                )}
            </div>
        );
    }

    // ─── 2. LIVE SESSION VIEW ("The Cockpit") ─────────────────────────────────────
    if (mode === 'live') {
        return (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500 pb-20">

                {/* HEADS-UP DISPLAY (HUD) */}
                <div className="sticky top-4 z-30 bg-[#061115]/95 backdrop-blur-3xl border border-[#14343B]/60 rounded-2xl shadow-2xl shadow-black/80 overflow-hidden ring-1 ring-emerald-900/20">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0C3831] via-[#104A41] to-[#0C3831] w-full" />
                    <div className="p-5 flex flex-col sm:flex-row items-center justify-between gap-5">
                        {/* Timer */}
                        <div className="text-center sm:text-left">
                            <p className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-emerald-600/80 font-bold mb-1">Session Active</p>
                            <p className="text-4xl font-black text-emerald-50/90 font-mono tracking-tight leading-none tabular-nums drop-shadow-sm">
                                {elapsedTime}
                            </p>
                        </div>
                        {/* Live Vitals Ticker */}
                        {config.enabledFeatures.includes('session-vitals') && (
                            <div className="flex items-center gap-6 bg-[#040C0E]/60 p-3.5 rounded-xl border border-[#14343B]/40 shadow-inner">
                                <div className="text-right">
                                    <p className="text-[10px] uppercase tracking-widest text-[#507882] font-semibold mb-1">HR</p>
                                    <div className="flex items-center gap-1.5 justify-end">
                                        <Heart className="w-3.5 h-3.5 text-rose-500/80 fill-rose-500/30 animate-pulse" />
                                        <p className="text-xl font-bold text-emerald-100 leading-none">{liveVitals.hr}</p>
                                    </div>
                                </div>
                                <div className="w-px h-8 bg-[#14343B]/50" />
                                <div className="text-right">
                                    <p className="text-[10px] uppercase tracking-widest text-[#507882] font-semibold mb-1">BP</p>
                                    <p className="text-xl font-bold text-emerald-100 leading-none">{liveVitals.bp}</p>
                                </div>
                                <div className="w-px h-8 bg-[#14343B]/50" />
                                <div className="text-right">
                                    <p className="text-[10px] uppercase tracking-widest text-[#507882] font-semibold mb-1">SpO2</p>
                                    <p className={`text-xl font-bold leading-none ${liveVitals.spo2 < 95 ? 'text-amber-500/90' : 'text-emerald-100'}`}>{liveVitals.spo2}%</p>
                                </div>
                            </div>
                        )}
                        <div className="flex flex-wrap items-center gap-3">
                            {/* Launch Companion App */}
                            <a
                                href={`#/companion/${journey.sessionId || 'demo-1'}`}
                                className="px-5 py-3.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 hover:text-indigo-200 font-semibold rounded-xl border border-indigo-500/30 transition-colors uppercase tracking-widest text-xs flex items-center gap-2 group shadow-sm backdrop-blur-md"
                            >
                                <Sparkles className="w-4 h-4 text-indigo-400 group-hover:animate-pulse" />
                                Launch Companion
                            </a>
                            {/* End Button */}
                            <button
                                onClick={() => setMode('post')}
                                className="px-6 py-3.5 bg-[#0A1F24] hover:bg-[#0E292E] text-[#6E9CA8] hover:text-[#A3C7D2] font-semibold rounded-xl border border-[#14343B] transition-colors uppercase tracking-[0.15em] text-xs flex items-center gap-2.5 group shadow-sm"
                            >
                                End Session
                                <ArrowRight className="w-4 h-4 opacity-50 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* THE "BIG 3" ACTION DECK + SAFETY */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {config.enabledFeatures.includes('session-vitals') && (
                        <WorkflowActionCard
                            phase={2}
                            status="active"
                            title="Log Vitals"
                            description="Check & Log BP, HR, SpO2."
                            icon={<Activity className="w-5 h-5 text-fuchsia-400" />}
                            onClick={() => onOpenForm('session-vitals')}
                        />
                    )}
                    <WorkflowActionCard
                        phase={2}
                        status="active"
                        title="Adverse Safety Event"
                        description="Immediately log any severe safety concerns."
                        icon={<AlertTriangle className="w-5 h-5 text-red-500" />}
                        onClick={() => onOpenForm('safety-and-adverse-event')}
                    />
                </div>

                {/* Keyboard Shortcut Legend */}
                <div className="flex items-center justify-center gap-4 px-4 py-2.5 bg-slate-900/40 border border-slate-800/50 rounded-xl">
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-600">Quick Keys:</p>
                    {[
                        { key: 'V', label: 'Vitals' },
                        { key: 'A', label: 'Adverse' },
                    ].map(({ key, label }) => (
                        <div key={key} className="flex items-center gap-1.5">
                            <kbd className="inline-flex items-center justify-center w-5 h-5 rounded bg-slate-800 border border-slate-700 text-xs font-mono font-bold text-slate-400">{key}</kbd>
                            <span className="text-xs text-slate-600">{label}</span>
                        </div>
                    ))}
                </div>

                {/* Live Session Outputs (WO-311) */}
                <div className="space-y-6">
                    {config.enabledFeatures.includes('session-vitals') && (
                        <SessionVitalsTrendChart
                            sessionId={journey.session?.sessionNumber?.toString() || "1"}
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
                        sessionId={journey.session?.sessionNumber?.toString() || "1"}
                        active={mode === 'live'}
                    />
                </div>
            </div>
        );
    }

    // ─── 3. POST-SESSION VIEW (Closeout Checklist) ────────────────────────────────
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

                    {/* Closeout Checklist */}
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

                    {/* Finish Button */}
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

                {/* Assessment Modal (Preserved) */}
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

    return null;
};
