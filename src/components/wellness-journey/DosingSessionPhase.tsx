import React, { useState, useEffect } from 'react';
import { Activity, Sparkles, CheckCircle, ChevronRight, X, Info, Clock, Download, Heart, Play, AlertTriangle, FileText, Lock, CheckSquare, ArrowRight } from 'lucide-react';
import { AdvancedTooltip } from '../ui/AdvancedTooltip';
import { WorkflowActionCard } from './WorkflowCards';
import AdaptiveAssessmentPage from '../../pages/AdaptiveAssessmentPage';
import { WellnessFormId } from './WellnessFormRouter';
import { LiveSessionTimeline } from './LiveSessionTimeline';
import { SessionVitalsTrendChart } from './SessionVitalsTrendChart';
import { useToast } from '../../contexts/ToastContext';

interface TreatmentPhaseProps {
    journey: any;
    onOpenForm: (formId: WellnessFormId) => void;
    onCompletePhase: () => void;
}



type SessionMode = 'pre' | 'live' | 'post';

export const TreatmentPhase: React.FC<TreatmentPhaseProps> = ({ journey, onOpenForm, onCompletePhase }) => {
    const { addToast } = useToast();
    // Session State Management (Simulating the DB status)
    const [mode, setMode] = useState<SessionMode>('pre');

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
        return (
            <div className="space-y-6 animate-in fade-in duration-500">
                <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
                        <div>
                            <h2 className="text-2xl font-black text-[#A8B5D1]">Session Preparation</h2>
                            <p className="text-slate-400 mt-1">Verify all safety gates before initiating dosing.</p>
                        </div>
                        {/* Emergency Protocol Button (Top Right) */}
                        <button
                            onClick={() => onOpenForm('rescue-protocol')}
                            className="w-full md:w-auto flex-shrink-0 flex items-center justify-center gap-2.5 px-6 py-3 bg-slate-950 hover:bg-slate-900 border-2 border-red-500/80 hover:border-red-400 text-red-400 font-bold rounded-xl transition-all active:scale-95 text-base shadow-[0_0_20px_rgba(239,68,68,0.15)] group"
                        >
                            <span className="material-symbols-outlined text-red-400 group-hover:animate-pulse">emergency</span>
                            Log Rescue Protocol
                        </button>
                    </div>

                    {/* Pre-Flight Checklist Columns */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 items-stretch">

                        {/* COLUMN 1: Session Plan & Protocol */}
                        <div className="flex flex-col p-6 bg-slate-900/40 border-2 border-amber-500/40 rounded-none md:rounded-xl h-full space-y-5 shadow-2xl">
                            <div className="flex flex-wrap items-center justify-between gap-4">
                                <span className="text-2xl sm:text-3xl font-bold text-[#A8B5D1]">Step 1:</span>
                                <button
                                    onClick={() => onOpenForm('dosing-protocol')}
                                    className="w-full sm:w-auto flex-shrink-0 flex items-center justify-center gap-2 px-6 py-3.5 bg-amber-900/30 hover:bg-amber-800/40 border-2 border-amber-600/60 hover:border-amber-500 text-amber-400 font-extrabold rounded-2xl transition-all active:scale-95 text-[15px] shadow-[0_0_20px_rgba(217,119,6,0.15)]"
                                >
                                    <span className="material-symbols-outlined text-[18px]">medication</span>
                                    Dosing Protocol
                                </button>
                            </div>

                            <div className="flex-1 px-5 py-5 bg-slate-800/40 border border-slate-700/50 rounded-xl transition-colors min-h-[148px] flex flex-col justify-between mt-auto">
                                <div className="flex justify-between items-center border-b border-slate-700/50 pb-3">
                                    <span className="text-slate-400 text-base">Substance</span>
                                    <span className="text-[#A8B5D1] font-bold bg-slate-700/50 px-3 py-1 rounded text-[17px]">{journey.session.substance}</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-slate-700/50 pb-3">
                                    <span className="text-slate-400 text-base">Dosage</span>
                                    <span className="text-[#A8B5D1] font-bold text-[17px]">{journey.session.dosage}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-400 text-base">Guide</span>
                                    <span className="text-[#A8B5D1] font-bold text-[17px]">Dr. Calton</span>
                                </div>
                            </div>
                        </div>

                        {/* COLUMN 2: Required Gates & Vitals */}
                        <div className="flex flex-col p-6 bg-slate-900/40 border-2 border-amber-500/40 rounded-none md:rounded-xl h-full space-y-5 shadow-2xl">
                            <div className="flex flex-wrap items-center justify-between gap-4">
                                <span className="text-2xl sm:text-3xl font-bold text-[#A8B5D1]">Step 2:</span>
                                <button
                                    onClick={() => onOpenForm('session-vitals')}
                                    className="w-full sm:w-auto flex-shrink-0 flex items-center justify-center gap-2 px-6 py-3.5 bg-amber-900/30 hover:bg-amber-800/40 border-2 border-amber-600/60 hover:border-amber-500 text-amber-400 font-extrabold rounded-2xl transition-all active:scale-95 text-[15px] shadow-[0_0_20px_rgba(217,119,6,0.15)]"
                                >
                                    <span className="material-symbols-outlined text-[18px]">monitor_heart</span>
                                    Record Vitals
                                </button>
                            </div>

                            <div className="flex-1 flex flex-col justify-between gap-3 min-h-[148px] mt-auto">
                                {/* Gate 1: Consent */}
                                <div className="flex items-center gap-4 p-4 bg-slate-800/40 border border-emerald-500/30 rounded-xl h-full relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0 z-10">
                                        <CheckCircle className="w-5 h-5" />
                                    </div>
                                    <div className="z-10">
                                        <p className="text-[#A8B5D1] font-bold text-[15px]">Informed Consent</p>
                                        <p className="text-sm text-slate-400 mt-0.5">Verified signed • Oct 14, 2025</p>
                                    </div>
                                </div>

                                {/* Gate 2: Vitals */}
                                <div className="flex items-center gap-4 p-4 bg-slate-800/40 border border-emerald-500/30 rounded-xl h-full relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0 z-10">
                                        <CheckCircle className="w-5 h-5" />
                                    </div>
                                    <div className="z-10">
                                        <p className="text-[#A8B5D1] font-bold text-[15px]">Baseline Vitals</p>
                                        <p className="text-sm text-slate-400 mt-0.5">Within range • HR 72, BP 118/76</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Start Button */}
                    <div className="flex flex-col items-center pt-8 border-t border-slate-800">
                        <button
                            onClick={() => setMode('live')}
                            className="group relative w-full py-4 sm:py-5 rounded-2xl bg-gradient-to-r from-[#1A3631] to-[#122A26] hover:from-[#21433D] hover:to-[#173631] text-emerald-100 font-black text-lg sm:text-xl tracking-wide shadow-lg shadow-black/40 transition-all hover:scale-[1.01] active:scale-[0.99] flex flex-wrap items-center justify-center gap-2 sm:gap-4 border border-emerald-800/40 px-4"
                        >
                            <span className="text-2xl sm:text-3xl font-bold text-emerald-300/80 mr-0 sm:mr-2">Step 3:</span>
                            <span className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-emerald-950/50 flex items-center justify-center group-hover:bg-emerald-900/50 border border-emerald-800/50 transition-colors">
                                <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-emerald-400 text-emerald-400 ml-0.5" />
                            </span>
                            <span className="text-center text-emerald-50">START DOSING SESSION</span>
                            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 opacity-60 group-hover:translate-x-1 transition-transform text-emerald-400" />
                        </button>
                        <p className="text-[13px] text-slate-500 mt-4 flex items-center gap-2 font-medium">
                            <Info className="w-4 h-4 text-emerald-600/70" />
                            Timer will start and all activity will be timestamped until the session ends.
                        </p>
                    </div>
                </div>
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
                    <WorkflowActionCard
                        phase={2}
                        status="active"
                        title="Log Vitals"
                        description="Check & Log BP, HR, SpO2."
                        icon={<Activity className="w-5 h-5 text-fuchsia-400" />}
                        onClick={() => onOpenForm('session-vitals')}
                    />
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
