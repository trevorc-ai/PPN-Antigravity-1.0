import React, { useState, useEffect, useCallback } from 'react';
import { Play, Square, Activity, Plus, FileText, CheckCircle2, Pill } from 'lucide-react';
import { WellnessFormId } from './WellnessFormRouter';
import { createTimelineEvent } from '../../services/clinicalLog';
import { useToast } from '../../contexts/ToastContext';
import { LiveSessionTimeline } from './LiveSessionTimeline';

interface MobileCockpitProps {
    journey: any;
    completedForms: Set<string>;
    onOpenForm: (formId: WellnessFormId) => void;
    onCompletePhase: () => void;
}

type SessionMode = 'pre' | 'live' | 'post';

export const MobileCockpit: React.FC<MobileCockpitProps> = ({ journey, completedForms, onOpenForm, onCompletePhase }) => {
    const { addToast } = useToast();
    const sessionId = journey.session?.sessionId ?? journey.sessionId ?? 'demo';
    const SESSION_KEY = `ppn_session_mode_${sessionId}`;
    const SESSION_START_KEY = `ppn_session_start_${sessionId}`;

    const [mode, setMode] = useState<SessionMode>(() => {
        try { return (localStorage.getItem(SESSION_KEY) as SessionMode) ?? 'pre'; } catch { return 'pre'; }
    });

    const [elapsedTime, setElapsedTime] = useState('00:00:00');

    // Timer logic matches DosingSessionPhase to remain purely parallel
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
        tick();
        const interval = setInterval(tick, 1000);
        return () => clearInterval(interval);
    }, [mode]);

    const handleStartSession = () => {
        setMode('live');
        try {
            localStorage.setItem(SESSION_KEY, 'live');
            if (!localStorage.getItem(SESSION_START_KEY)) {
                localStorage.setItem(SESSION_START_KEY, String(Date.now()));
            }
        } catch { }

        // Push start event to DB
        const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (UUID_RE.test(sessionId)) {
            createTimelineEvent({
                session_id: sessionId,
                event_timestamp: new Date().toISOString(),
                event_type_code: 'intake_completed',
                metadata: { event_description: 'Session Timer Started via Mobile Cockpit' }
            }).catch(e => console.warn('[SAVS] Timeline start event failed:', e));
        }
    };

    const handleEndSession = () => {
        setMode('post');
        try {
            localStorage.setItem(SESSION_KEY, 'post');
            localStorage.removeItem(SESSION_START_KEY); // stop timer
        } catch { }

        // Push end event to DB
        const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (UUID_RE.test(sessionId)) {
            createTimelineEvent({
                session_id: sessionId,
                event_timestamp: new Date().toISOString(),
                event_type_code: 'session_completed',
                metadata: { event_description: `Session Ended via Mobile Cockpit at ${elapsedTime}` }
            }).catch(e => console.warn('[SAVS] Timeline end event failed:', e));
        }
    };

    // SAVS: Ensure UI click registers to DB precisely
    const logQuickIntervention = async (type: string, label: string) => {
        const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (UUID_RE.test(sessionId)) {
            try {
                // Timeline: only session_completed is supported by ref_flow_event_types for Phase 2 quick actions.
                await createTimelineEvent({
                    session_id: sessionId,
                    event_timestamp: new Date().toISOString(),
                    event_type_code: 'session_completed',
                    metadata: { event_description: `Mobile Action: ${label} at ${elapsedTime}` }
                });
                addToast({ title: 'Logged', message: `${label} captured`, type: 'success' });
                // We dispatch the global event so the LiveSessionTimeline updates visually instantly
                window.dispatchEvent(new CustomEvent('ppn:session-event', { detail: { type, label } }));
            } catch (err) {
                console.error('[SAVS] Quick Intervention write failed:', err);
                addToast({ title: 'Sync Error', message: `Failed to log ${label}`, type: 'error' });
            }
        }
    };

    // Pre-Session View (Waiting to start)
    if (mode === 'pre') {
        const isDosingProtocolComplete = completedForms.has('dosing-protocol');

        return (
            <div className="flex flex-col min-h-screen bg-[#060d1a] pb-24">
                <div className="flex-1 p-6 flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-6">
                        <Play className="w-10 h-10 text-indigo-400 ml-1" />
                    </div>
                    <h2 className="text-3xl font-black text-white mb-2 tracking-tight">Ready to Begin</h2>
                    <p className="text-slate-400 mb-8 max-w-sm">
                        Please confirm your dosing protocol before starting the session timer.
                    </p>

                    <button
                        onClick={() => onOpenForm('dosing-protocol')}
                        className={`w-full max-w-sm mb-4 min-h-[60px] rounded-2xl flex items-center justify-center gap-3 font-bold transition-all duration-300 active:scale-95 ${isDosingProtocolComplete
                            ? 'bg-emerald-900/40 text-emerald-400 border border-emerald-500/30'
                            : 'bg-slate-800 border border-slate-700 text-white shadow-lg'
                            }`}
                    >
                        {isDosingProtocolComplete ? <CheckCircle2 className="w-6 h-6" /> : <Pill className="w-6 h-6 text-indigo-400" />}
                        {isDosingProtocolComplete ? 'Dosing Protocol Confirmed' : 'Confirm Dosing Protocol'}
                    </button>

                    <button
                        disabled={!isDosingProtocolComplete}
                        onClick={handleStartSession}
                        className={`w-full max-w-sm min-h-[60px] rounded-2xl flex items-center justify-center font-black text-xl transition-all duration-300 active:scale-95 ${isDosingProtocolComplete
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 border border-indigo-500'
                            : 'bg-slate-800/50 text-slate-500 border border-slate-700/50 cursor-not-allowed'
                            }`}
                    >
                        Start Session Timer
                    </button>
                </div>
            </div>
        );
    }

    // Post-Session View (Wrap up)
    if (mode === 'post') {
        return (
            <div className="flex flex-col min-h-[80vh] bg-[#060d1a] p-6 pb-24 animate-in fade-in slide-in-from-bottom-8 duration-500">
                <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 shadow-2xl">
                    <div className="flex items-center gap-3 mb-6">
                        <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                        <div>
                            <h2 className="text-2xl font-black text-white">Session Concluded</h2>
                            <p className="text-emerald-400 text-sm font-mono mt-0.5">Duration: {elapsedTime}</p>
                        </div>
                    </div>

                    <p className="text-slate-400 text-sm mb-8">
                        The live timeline has been secured to the database. You may now complete your post-session clinical notes.
                    </p>

                    <button
                        onClick={onCompletePhase}
                        className="w-full min-h-[60px] bg-blue-600 hover:bg-blue-500 text-white font-black text-lg rounded-2xl border border-blue-500 shadow-lg shadow-blue-500/20 active:scale-95 transition-all duration-300"
                    >
                        Proceed to Integration →
                    </button>
                </div>
            </div>
        );
    }

    // LIVE MODE: Cockpit
    return (
        <div className="flex flex-col min-h-screen bg-[#060d1a] selection:bg-indigo-500/30 pb-[280px]">
            {/* Header: Fixed top timer */}
            <div className="sticky top-0 z-40 bg-[#060d1a]/95 backdrop-blur-xl border-b border-slate-800/80 px-4 py-3 flex items-center justify-between">
                <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#A8B5D1]">Live Session</span>
                    <span className="text-3xl font-black text-white font-mono tracking-tight leading-none text-glow-indigo">{elapsedTime}</span>
                </div>
                <button
                    onClick={handleEndSession}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl font-bold min-h-[44px] active:scale-95 transition-all"
                >
                    <Square className="w-4 h-4" /> End
                </button>
            </div>

            {/* Scrollable Timeline View */}
            <div className="flex-1 p-4 relative">
                <LiveSessionTimeline sessionId={sessionId} active={true} />
            </div>

            {/* THE THUMB-ZONE: Fixed Bottom Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-2xl border-t border-slate-700/60 pb-safe shadow-[0_-20px_40px_-15px_rgba(0,0,0,0.5)]">

                {/* Secondary Actions (Forms that require slide-outs) */}
                <div className="grid grid-cols-2 gap-3 px-4 py-4 border-b border-slate-800/60">
                    <button
                        onClick={() => onOpenForm('session-vitals')}
                        className="flex flex-col items-center justify-center gap-1.5 p-3 min-h-[64px] bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-600/50 hover:border-slate-500 rounded-2xl active:scale-95 transition-all duration-300"
                    >
                        <Activity className="w-6 h-6 text-amber-400" />
                        <span className="text-xs font-bold uppercase tracking-wider">Log Vitals</span>
                    </button>
                    <button
                        onClick={() => onOpenForm('session-observations')}
                        className="flex flex-col items-center justify-center gap-1.5 p-3 min-h-[64px] bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-600/50 hover:border-slate-500 rounded-2xl active:scale-95 transition-all duration-300"
                    >
                        <FileText className="w-6 h-6 text-blue-400" />
                        <span className="text-xs font-bold uppercase tracking-wider">Clinical Note</span>
                    </button>
                </div>

                {/* Primary Actions: Massive FABs for instantaneous logging */}
                <div className="p-4 space-y-3">
                    <button
                        onClick={() => logQuickIntervention('clinical_decision', 'Protocol Adjusted')}
                        className="w-full flex items-center justify-center gap-3 min-h-[60px] bg-indigo-600 hover:bg-indigo-500 text-white font-black text-lg rounded-2xl shadow-lg shadow-indigo-600/20 border border-indigo-500 active:scale-95 transition-all duration-300"
                    >
                        <Plus className="w-6 h-6" />
                        Quick Action: Protocol
                    </button>

                    <button
                        onClick={() => logQuickIntervention('patient_observation', 'Patient Supported')}
                        className="w-full flex items-center justify-center gap-3 min-h-[60px] bg-teal-600/20 text-teal-300 border border-teal-500/30 hover:bg-teal-600/30 font-bold text-lg rounded-2xl active:scale-95 transition-all duration-300"
                    >
                        <CheckCircle2 className="w-6 h-6" />
                        Quick Action: Support
                    </button>
                </div>
            </div>
        </div>
    );
};
