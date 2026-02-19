import React, { useState, useEffect } from 'react';
import { Activity, Sparkles, CheckCircle, ChevronRight, X, Info, Clock, Download, Heart, Play, AlertTriangle, FileText, Lock, CheckSquare, ArrowRight } from 'lucide-react';
import { AdvancedTooltip } from '../ui/AdvancedTooltip';
import AdaptiveAssessmentPage from '../../pages/AdaptiveAssessmentPage';
import { WellnessFormId } from './WellnessFormRouter';

interface TreatmentPhaseProps {
    journey: any;
    onOpenForm: (formId: WellnessFormId) => void;
}

// WO-061: Mock session timeline events
const MOCK_TIMELINE_EVENTS = [
    {
        id: 1,
        timestamp: new Date(new Date().setHours(9, 0, 0)),
        eventType: 'milestone' as const,
        description: 'Session started. Patient calm, oriented. Pre-session vitals within normal range.',
    },
    {
        id: 2,
        timestamp: new Date(new Date().setHours(9, 45, 0)),
        eventType: 'milestone' as const,
        description: 'Onset confirmed. Patient reports visual distortions and emotional opening.',
    },
    {
        id: 3,
        timestamp: new Date(new Date().setHours(10, 30, 0)),
        eventType: 'safety_event' as const,
        description: 'Patient reported transient anxiety. Verbal reassurance provided.',
        severity: 'mild' as const,
    },
    {
        id: 4,
        timestamp: new Date(new Date().setHours(11, 15, 0)),
        eventType: 'intervention' as const,
        description: 'Grounding music changed per patient request. Blanket provided for comfort.',
    },
    {
        id: 5,
        timestamp: new Date(new Date().setHours(12, 0, 0)),
        eventType: 'milestone' as const,
        description: 'Peak intensity. Patient deeply engaged, non-verbal. Monitoring continued.',
    },
];

type SessionMode = 'pre' | 'live' | 'post';

export const TreatmentPhase: React.FC<TreatmentPhaseProps> = ({ journey, onOpenForm }) => {
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
                    <div className="flex items-start justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-black text-slate-200">Session Preparation</h2>
                            <p className="text-slate-400 mt-1">Verify all safety gates before initiating dosing.</p>
                        </div>
                        <div className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-full text-xs font-bold uppercase tracking-wider">
                            Phase 2: Dosing
                        </div>
                    </div>

                    {/* Pre-Flight Checklist */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest pl-1">Required Gates</h3>

                            {/* Gate 1: Consent */}
                            <div className="flex items-center gap-4 p-4 bg-slate-800/40 border border-emerald-500/30 rounded-xl">
                                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                                    <CheckCircle className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-slate-200 font-bold">Informed Consent</p>
                                    <p className="text-xs text-slate-400">Verified signed • Oct 14, 2025</p>
                                </div>
                            </div>

                            {/* Gate 2: Vitals */}
                            <div className="flex items-center gap-4 p-4 bg-slate-800/40 border border-emerald-500/30 rounded-xl">
                                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                                    <CheckCircle className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-slate-200 font-bold">Baseline Vitals</p>
                                    <p className="text-xs text-slate-400">Within range • HR 72, BP 118/76</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest pl-1">Session Plan</h3>
                            {/* Protocol Card */}
                            <div className="p-5 bg-slate-800/40 border border-slate-700/50 rounded-xl relative overflow-hidden group hover:bg-slate-800/60 transition-colors">
                                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <FileText className="w-24 h-24 text-slate-400" />
                                </div>
                                <div className="relative z-10 space-y-3">
                                    <div className="flex justify-between text-sm border-b border-slate-700/50 pb-2">
                                        <span className="text-slate-400">Substance</span>
                                        <span className="text-slate-200 font-bold bg-slate-700/50 px-2 py-0.5 rounded">{journey.session.substance}</span>
                                    </div>
                                    <div className="flex justify-between text-sm border-b border-slate-700/50 pb-2">
                                        <span className="text-slate-400">Dosage</span>
                                        <span className="text-slate-200 font-bold">{journey.session.dosage}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400">Guide</span>
                                        <span className="text-slate-200 font-bold">Dr. Calton</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Start Button */}
                    <div className="flex flex-col items-center pt-8 border-t border-slate-800">
                        <button
                            onClick={() => setMode('live')}
                            className="group relative w-full md:w-2/3 py-5 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-black text-xl tracking-wide shadow-lg shadow-emerald-900/40 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-4"
                        >
                            <span className="w-10 h-10 rounded-full bg-black/10 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                                <Play className="w-5 h-5 fill-current ml-0.5" />
                            </span>
                            START DOSING SESSION
                            <ChevronRight className="w-6 h-6 opacity-60 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <p className="text-xs text-slate-400 mt-4 flex items-center gap-2">
                            <Info className="w-3 h-3" />
                            Action will set <code className="bg-slate-800 px-1 py-0.5 rounded text-slate-400 font-mono">dose_administered_at</code> to NOW
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
                            <p className="text-xs uppercase tracking-[0.2em] text-emerald-400 font-bold mb-1 shadow-green-900/50">Session Active</p>
                            <p className="text-4xl font-black text-white font-mono tracking-tight leading-none drop-shadow-[0_0_10px_rgba(16,185,129,0.5)] tabular-nums">
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

                {/* LIVE STREAM (Bottom) */}
                <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 relative min-h-[400px] shadow-xl">
                    <div className="flex items-center gap-4 mb-8 pb-4 border-b border-slate-800/50">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                            <Clock className="w-5 h-5 text-indigo-400" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-200">Session Stream</h3>
                            <p className="text-xs text-slate-400 font-medium">Real-time event log</p>
                        </div>
                    </div>
                    {/* Mock Stream */}
                    <div className="space-y-0 relative pl-4">
                        <div className="absolute top-2 bottom-4 left-[29px] w-0.5 bg-slate-800" />
                        {MOCK_TIMELINE_EVENTS.map((event, i) => (
                            <div key={event.id} className="relative pl-12 py-3 group">
                                <div className={`absolute left-0 top-6 w-4 h-4 rounded-full border-[3px] border-slate-900 z-10 transition-transform duration-300 group-hover:scale-125
                                    ${event.eventType === 'safety_event' ? 'bg-red-500 ring-4 ring-red-900/20' :
                                        event.eventType === 'intervention' ? 'bg-amber-500 ring-4 ring-amber-900/20' :
                                            'bg-blue-500 ring-4 ring-blue-900/20'}`}
                                />
                                <div className={`p-5 rounded-2xl border transition-all duration-300
                                    ${event.eventType === 'safety_event'
                                        ? 'bg-red-950/10 border-red-500/20 hover:border-red-500/40 hover:bg-red-950/20'
                                        : 'bg-slate-800/40 border-slate-800 hover:border-slate-600 hover:bg-slate-800/60'}`}>
                                    <div className="flex items-center gap-3 mb-1">
                                        <span className="text-sm font-mono font-bold text-slate-400">{event.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        <span className={`text-xs uppercase font-extrabold tracking-widest px-2.5 py-1 rounded-md border
                                            ${event.eventType === 'safety_event' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                                event.eventType === 'intervention' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                                    'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
                                            {event.eventType}
                                        </span>
                                    </div>
                                    <p className="text-slate-300 text-sm">{event.description}</p>
                                </div>
                            </div>
                        ))}
                        {/* "End of Stream" Indicator */}
                        <div className="relative pl-12 py-6 opacity-30">
                            <div className="absolute left-[13px] top-8 w-2 h-2 rounded-full bg-slate-700" />
                            <p className="text-xs text-slate-400 italic">Session initialized at 09:00 AM</p>
                        </div>
                    </div>
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
