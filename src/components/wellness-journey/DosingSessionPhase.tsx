import React, { useState, useEffect } from 'react';
import { Activity, Sparkles, CheckCircle, ChevronRight, X, Info, Clock, Download, Heart, Play, AlertTriangle, FileText, Lock, CheckSquare, ArrowRight } from 'lucide-react';
import { AdvancedTooltip } from '../ui/AdvancedTooltip';
import AdaptiveAssessmentPage from '../../pages/AdaptiveAssessmentPage';
import { WellnessFormId } from './WellnessFormRouter';
import { LiveSessionTimeline } from './LiveSessionTimeline';
import { SessionVitalsTrendChart } from './SessionVitalsTrendChart';
import { useToast } from '../../contexts/ToastContext';

interface TreatmentPhaseProps {
    journey: any;
    onOpenForm: (formId: WellnessFormId) => void;
}



type SessionMode = 'pre' | 'live' | 'post';

export const TreatmentPhase: React.FC<TreatmentPhaseProps> = ({ journey, onOpenForm }) => {
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
                case 'o':
                    onOpenForm('session-observations');
                    break;
                case 'n':
                    onOpenForm('session-timeline');
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
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
                        <div>
                            <h2 className="text-2xl font-black text-slate-200">Session Preparation</h2>
                            <p className="text-slate-400 mt-1">Verify all safety gates before initiating dosing.</p>
                        </div>
                        {/* Emergency Protocol Button (Top Right) */}
                        <button
                            onClick={() => onOpenForm('rescue-protocol')}
                            className="flex-shrink-0 flex items-center gap-2.5 px-6 py-3 bg-slate-950 hover:bg-slate-900 border-2 border-red-500/80 hover:border-red-400 text-red-400 font-bold rounded-xl transition-all active:scale-95 text-base shadow-[0_0_20px_rgba(239,68,68,0.15)] group"
                        >
                            <span className="material-symbols-outlined text-red-400 group-hover:animate-pulse">emergency</span>
                            Log Rescue Protocol
                        </button>
                    </div>

                    {/* Pre-Flight Checklist Columns */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 items-stretch">

                        {/* COLUMN 1: Session Plan & Protocol */}
                        <div className="flex flex-col p-6 bg-slate-900/40 border-2 border-amber-500/40 rounded-none md:rounded-xl h-full space-y-5 shadow-2xl">
                            <button
                                onClick={() => onOpenForm('dosing-protocol')}
                                className="w-fit flex items-center justify-center gap-2 px-6 py-3.5 bg-amber-900/30 hover:bg-amber-800/40 border-2 border-amber-600/60 hover:border-amber-500 text-amber-400 font-extrabold rounded-2xl transition-all active:scale-95 text-[15px] shadow-[0_0_20px_rgba(217,119,6,0.15)]"
                            >
                                <span className="material-symbols-outlined text-[18px]">medication</span>
                                Dosing Protocol
                            </button>

                            <div className="flex-1 px-5 py-5 bg-slate-800/40 border border-slate-700/50 rounded-xl transition-colors min-h-[148px] flex flex-col justify-between mt-auto">
                                <div className="flex justify-between items-center border-b border-slate-700/50 pb-3">
                                    <span className="text-slate-400 text-base">Substance</span>
                                    <span className="text-slate-200 font-bold bg-slate-700/50 px-3 py-1 rounded text-[17px]">{journey.session.substance}</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-slate-700/50 pb-3">
                                    <span className="text-slate-400 text-base">Dosage</span>
                                    <span className="text-slate-200 font-bold text-[17px]">{journey.session.dosage}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-400 text-base">Guide</span>
                                    <span className="text-slate-200 font-bold text-[17px]">Dr. Calton</span>
                                </div>
                            </div>
                        </div>

                        {/* COLUMN 2: Required Gates & Vitals */}
                        <div className="flex flex-col p-6 bg-slate-900/40 border-2 border-amber-500/40 rounded-none md:rounded-xl h-full space-y-5 shadow-2xl">
                            <button
                                onClick={() => onOpenForm('session-vitals')}
                                className="w-fit flex items-center justify-center gap-2 px-6 py-3.5 bg-amber-900/30 hover:bg-amber-800/40 border-2 border-amber-600/60 hover:border-amber-500 text-amber-400 font-extrabold rounded-2xl transition-all active:scale-95 text-[15px] shadow-[0_0_20px_rgba(217,119,6,0.15)]"
                            >
                                <span className="material-symbols-outlined text-[18px]">monitor_heart</span>
                                Record Vitals
                            </button>

                            <div className="flex-1 flex flex-col justify-between gap-3 min-h-[148px] mt-auto">
                                {/* Gate 1: Consent */}
                                <div className="flex items-center gap-4 p-4 bg-slate-800/40 border border-emerald-500/30 rounded-xl h-full relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0 z-10">
                                        <CheckCircle className="w-5 h-5" />
                                    </div>
                                    <div className="z-10">
                                        <p className="text-slate-200 font-bold text-[15px]">Informed Consent</p>
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
                                        <p className="text-slate-200 font-bold text-[15px]">Baseline Vitals</p>
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
                            className="group relative w-full md:w-2/3 py-5 rounded-2xl bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-amber-50 font-black text-xl tracking-wide shadow-lg shadow-amber-900/40 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-4 border border-amber-500/40"
                        >
                            <span className="w-10 h-10 rounded-full bg-black/15 flex items-center justify-center group-hover:bg-black/25 transition-colors">
                                <Play className="w-5 h-5 fill-current ml-0.5" />
                            </span>
                            START DOSING SESSION
                            <ChevronRight className="w-6 h-6 opacity-60 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <p className="text-[13px] text-slate-400 mt-4 flex items-center gap-2">
                            <Info className="w-4 h-4 text-amber-500/70" />
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
                <div className="sticky top-4 z-30 bg-slate-900/90 backdrop-blur-2xl border border-slate-700/50 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden ring-1 ring-white/5">
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 via-blue-500 to-amber-500 w-full animate-pulse" />
                    <div className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                        {/* Timer */}
                        <div className="text-center sm:text-left">
                            <p className="text-xs uppercase tracking-[0.2em] text-amber-400 font-bold mb-1">Session Active</p>
                            <p className="text-4xl font-black text-white font-mono tracking-tight leading-none tabular-nums">
                                {elapsedTime}
                            </p>
                        </div>
                        {/* Live Vitals Ticker */}
                        <div className="flex items-center gap-5 bg-slate-950/50 p-3 rounded-xl border border-white/5 shadow-inner">
                            <div className="text-right">
                                <p className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-0.5">HR</p>
                                <div className="flex items-center gap-1.5 justify-end">
                                    <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 animate-pulse" />
                                    <p className="text-xl font-black text-slate-200 leading-none">{liveVitals.hr}</p>
                                </div>
                            </div>
                            <div className="w-px h-8 bg-slate-800" />
                            <div className="text-right">
                                <p className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-0.5">BP</p>
                                <p className="text-xl font-black text-slate-200 leading-none">{liveVitals.bp}</p>
                            </div>
                            <div className="w-px h-8 bg-slate-800" />
                            <div className="text-right">
                                <p className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-0.5">SpO2</p>
                                <p className={`text-xl font-black leading-none ${liveVitals.spo2 < 95 ? 'text-amber-400' : 'text-slate-200'}`}>{liveVitals.spo2}%</p>
                            </div>
                        </div>
                        {/* End Button */}
                        <button
                            onClick={() => setMode('post')}
                            className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold rounded-xl border border-slate-700 transition-colors uppercase tracking-wide text-xs flex items-center gap-2 group"
                        >
                            End Session
                            <ArrowRight className="w-3.5 h-3.5 opacity-50 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                    </div>
                </div>

                {/* THE "BIG 3" ACTION DECK + SAFETY */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">

                    {/* 1. Log Vitals */}
                    <button
                        onClick={() => onOpenForm('session-vitals')}
                        className="group relative h-44 p-6 bg-gradient-to-br from-blue-900/20 via-slate-900 to-slate-900 border border-blue-900/30 rounded-3xl hover:border-blue-500/50 hover:from-blue-900/30 hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.2)] transition-all duration-300 active:scale-[0.98] text-left overflow-hidden ring-1 ring-white/5"
                    >
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="absolute top-0 right-0 p-5 opacity-80 group-hover:opacity-100 group-hover:rotate-12 transition-all duration-500">
                            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30 group-hover:border-blue-500/50 group-hover:bg-blue-500/30 transition-colors shadow-lg shadow-blue-900/20">
                                <Activity className="w-6 h-6 text-blue-300 drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]" />
                            </div>
                        </div>
                        <div className="absolute bottom-6 left-6 right-6">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-3xl font-black text-slate-100 leading-tight tracking-tight group-hover:text-white transition-colors">Vitals</p>
                                <kbd className="hidden lg:inline-flex items-center justify-center w-6 h-6 rounded bg-blue-500/20 border border-blue-500/30 text-xs font-mono font-bold text-blue-300">V</kbd>
                            </div>
                            <p className="text-xs text-blue-200/60 font-bold uppercase tracking-widest group-hover:text-blue-200 transition-colors">Check & Log</p>
                        </div>
                    </button>

                    {/* 2. Observations */}
                    <button
                        onClick={() => onOpenForm('session-observations')}
                        className="group relative h-44 p-6 bg-gradient-to-br from-amber-900/20 via-slate-900 to-slate-900 border border-amber-900/30 rounded-3xl hover:border-amber-500/50 hover:from-amber-900/30 hover:shadow-[0_0_30px_-5px_rgba(245,158,11,0.2)] transition-all duration-300 active:scale-[0.98] text-left overflow-hidden ring-1 ring-white/5"
                    >
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="absolute top-0 right-0 p-5 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500">
                            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 flex items-center justify-center border border-amber-500/30 group-hover:border-amber-500/50 group-hover:bg-amber-500/30 transition-colors shadow-lg shadow-amber-900/20">
                                <Sparkles className="w-6 h-6 text-amber-300" />
                            </div>
                        </div>
                        <div className="absolute bottom-6 left-6 right-6">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-3xl font-black text-slate-100 leading-tight tracking-tight group-hover:text-white transition-colors">Observe</p>
                                <kbd className="hidden lg:inline-flex items-center justify-center w-6 h-6 rounded bg-amber-500/20 border border-amber-500/30 text-xs font-mono font-bold text-amber-300">O</kbd>
                            </div>
                            <p className="text-xs text-amber-200/60 font-bold uppercase tracking-widest group-hover:text-amber-200 transition-colors">Behavior & Mood</p>
                        </div>
                    </button>

                    {/* 3. Timeline Note (Secondary Action) */}
                    <button
                        onClick={() => onOpenForm('session-timeline')}
                        className="group relative h-44 p-6 bg-gradient-to-br from-emerald-900/20 via-slate-900 to-slate-900 border border-emerald-900/30 rounded-3xl hover:border-emerald-500/50 hover:from-emerald-900/30 hover:shadow-[0_0_30px_-5px_rgba(16,185,129,0.2)] transition-all duration-300 active:scale-[0.98] text-left overflow-hidden ring-1 ring-white/5"
                    >
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="absolute top-0 right-0 p-5 opacity-80 group-hover:opacity-100 group-hover:-rotate-12 transition-all duration-500">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30 group-hover:border-emerald-500/50 group-hover:bg-emerald-500/30 transition-colors shadow-lg shadow-emerald-900/20">
                                <Clock className="w-6 h-6 text-emerald-300" />
                            </div>
                        </div>
                        <div className="absolute bottom-6 left-6 right-6">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-3xl font-black text-slate-100 leading-tight tracking-tight group-hover:text-white transition-colors">Note</p>
                                <kbd className="hidden lg:inline-flex items-center justify-center w-6 h-6 rounded bg-emerald-500/20 border border-emerald-500/30 text-xs font-mono font-bold text-emerald-300">N</kbd>
                            </div>
                            <p className="text-xs text-emerald-200/60 font-bold uppercase tracking-widest group-hover:text-emerald-200 transition-colors">Add to Timeline</p>
                        </div>
                    </button>


                    {/* 4. SAFETY ALARM (Always Red) */}
                    <button
                        onClick={() => onOpenForm('safety-and-adverse-event')}
                        className="group relative h-44 p-6 bg-gradient-to-br from-red-950/40 via-red-950/20 to-red-950/10 border border-red-500/30 rounded-3xl hover:border-red-500 hover:bg-red-900/40 hover:shadow-[0_0_40px_-10px_rgba(239,68,68,0.3)] transition-all duration-300 active:scale-[0.98] text-left overflow-hidden ring-1 ring-red-500/10"
                    >
                        <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(239,68,68,0.05)_10px,rgba(239,68,68,0.05)_20px)] opacity-50" />
                        <div className="absolute top-0 right-0 p-5">
                            <div className="w-12 h-12 rounded-2xl bg-red-500/20 flex items-center justify-center border border-red-500/30 animate-pulse group-hover:animate-none group-hover:bg-red-500 group-hover:text-white transition-all duration-300 shadow-lg shadow-red-900/20">
                                <AlertTriangle className="w-6 h-6 text-red-400 group-hover:text-white" />
                            </div>
                        </div>
                        <div className="absolute bottom-6 left-6 right-6">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-3xl font-black text-red-100 leading-tight tracking-tight group-hover:text-white transition-colors">Adverse</p>
                                <kbd className="hidden lg:inline-flex items-center justify-center w-6 h-6 rounded bg-red-500/20 border border-red-500/30 text-xs font-mono font-bold text-red-300">A</kbd>
                            </div>
                            <p className="text-xs text-red-400/80 font-bold uppercase tracking-widest group-hover:text-red-200 transition-colors">Log Safety Event</p>
                        </div>
                    </button>
                </div>

                {/* Keyboard Shortcut Legend */}
                <div className="flex items-center justify-center gap-4 px-4 py-2.5 bg-slate-900/40 border border-slate-800/50 rounded-xl">
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-600">Quick Keys:</p>
                    {[
                        { key: 'V', label: 'Vitals' },
                        { key: 'O', label: 'Observe' },
                        { key: 'N', label: 'Note' },
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
                            <h2 className="text-2xl font-black text-slate-200">Session Closeout</h2>
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
                                <span className="text-slate-200 font-bold line-through decoration-emerald-500/50 decoration-2">Session End Time Recorded</span>
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
                                    <span className={assessmentCompleted ? 'text-slate-200 font-bold line-through opacity-50' : 'text-slate-200 font-bold'}>
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
                                        setTimeout(() => setShowAssessmentModal(false), 3000);
                                    }}
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
