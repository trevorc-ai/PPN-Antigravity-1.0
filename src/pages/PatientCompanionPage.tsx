import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';

interface PatientLogEvent {
    timestamp: string;
    feeling: string;
}

// 16 emotional states — clinical psychedelic therapy state tracking
const FEELINGS = [
    { id: 'blissful', label: 'Blissful', color: 'bg-emerald-500/20 border-emerald-400/50 hover:bg-emerald-500/40 text-emerald-100' },
    { id: 'peaceful', label: 'Peaceful', color: 'bg-teal-500/20 border-teal-400/50 hover:bg-teal-500/40 text-teal-100' },
    { id: 'grounded', label: 'Grounded / Safe', color: 'bg-cyan-500/20 border-cyan-400/50 hover:bg-cyan-500/40 text-cyan-100' },
    { id: 'connected', label: 'Connected', color: 'bg-sky-500/20 border-sky-400/50 hover:bg-sky-500/40 text-sky-100' },
    { id: 'euphoric', label: 'Euphoric', color: 'bg-violet-500/20 border-violet-400/50 hover:bg-violet-500/40 text-violet-100' },
    { id: 'drifting', label: 'Drifting / Floating', color: 'bg-indigo-500/20 border-indigo-400/50 hover:bg-indigo-500/40 text-indigo-100' },
    { id: 'curious', label: 'Curious', color: 'bg-purple-500/20 border-purple-400/50 hover:bg-purple-500/40 text-purple-100' },
    { id: 'open', label: 'Open / Surrendered', color: 'bg-fuchsia-500/20 border-fuchsia-400/50 hover:bg-fuchsia-500/40 text-fuchsia-100' },
    { id: 'emotional', label: 'Emotional / Crying', color: 'bg-blue-500/20 border-blue-400/50 hover:bg-blue-500/40 text-blue-100' },
    { id: 'confused', label: 'Confused', color: 'bg-slate-500/20 border-slate-400/50 hover:bg-slate-500/40 text-slate-100' },
    { id: 'anxious', label: 'Anxious', color: 'bg-amber-500/20 border-amber-400/50 hover:bg-amber-500/40 text-amber-100' },
    { id: 'overwhelmed', label: 'Overwhelmed', color: 'bg-orange-500/20 border-orange-400/50 hover:bg-orange-500/40 text-orange-100' },
    { id: 'tense', label: 'Tense / Resistance', color: 'bg-rose-500/20 border-rose-400/50 hover:bg-rose-500/40 text-rose-100' },
    { id: 'fearful', label: 'Fearful', color: 'bg-red-600/20 border-red-500/50 hover:bg-red-600/40 text-red-100' },
    { id: 'nauseous', label: 'Nauseous', color: 'bg-yellow-700/20 border-yellow-600/50 hover:bg-yellow-700/40 text-yellow-100' },
    { id: 'need_support', label: 'Need Support', color: 'bg-pink-600/30 border-pink-400/60 hover:bg-pink-600/50 text-pink-100 ring-1 ring-pink-400/40' },
];

export default function PatientCompanionPage() {
    const { sessionId } = useParams();
    const navigate = useNavigate();

    const [recentLog, setRecentLog] = useState<string | null>(null);
    const [lockHoldProgress, setLockHoldProgress] = useState(0);

    const holdTimerRef = useRef<NodeJS.Timeout | null>(null);
    const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

    const handleLogFeeling = (feelingId: string, feelingLabel: string) => {
        const storageKey = `companion_logs_${sessionId}`;
        const existingLogsStr = localStorage.getItem(storageKey);
        const logs: PatientLogEvent[] = existingLogsStr ? JSON.parse(existingLogsStr) : [];
        logs.push({ timestamp: new Date().toISOString(), feeling: feelingId });
        localStorage.setItem(storageKey, JSON.stringify(logs));
        setRecentLog(feelingLabel);
        setTimeout(() => setRecentLog(null), 2500);
    };

    const startUnlock = () => {
        let progress = 0;
        progressIntervalRef.current = setInterval(() => {
            progress += 5;
            if (progress <= 100) setLockHoldProgress(progress);
        }, 150);
        holdTimerRef.current = setTimeout(() => {
            if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
            navigate(-1); // Go back in history — preserves Wellness Journey session state
        }, 3000);
    };

    const cancelUnlock = () => {
        if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
        if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
        setLockHoldProgress(0);
    };

    return (
        <div
            className="fixed inset-0 bg-black overflow-hidden flex flex-col selection:bg-transparent"
            // Trap all keyboard events so Escape doesn't bubble to parent route handlers
            onKeyDown={(e) => { e.stopPropagation(); }}
            tabIndex={-1}
        >

            {/* ── Hold-to-exit lock button (top right, z-50 — above both containers) ── */}
            <div className="absolute top-4 right-4 z-50 flex flex-col items-center gap-1">
                <button
                    onMouseDown={startUnlock}
                    onMouseUp={cancelUnlock}
                    onMouseLeave={cancelUnlock}
                    onTouchStart={startUnlock}
                    onTouchEnd={cancelUnlock}
                    aria-label="Hold 3 seconds to return to session"
                    className="relative w-14 h-14 flex items-center justify-center rounded-full bg-white/10 border border-white/30 text-white/70 backdrop-blur-md hover:bg-white/20 active:bg-white/25 transition-colors group"
                >
                    <Lock className="w-5 h-5 group-active:text-white transition-colors" />
                    {lockHoldProgress > 0 && (
                        <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
                            <circle
                                cx="28" cy="28" r="26"
                                fill="none"
                                stroke="rgba(255,255,255,0.6)"
                                strokeWidth="2.5"
                                strokeDasharray="163"
                                strokeDashoffset={163 - (163 * lockHoldProgress) / 100}
                                className="transition-all duration-150 ease-linear"
                            />
                        </svg>
                    )}
                </button>
                <span className="text-[11px] font-bold tracking-widest text-white/50 uppercase">
                    {lockHoldProgress > 0 ? 'Hold...' : 'Hold to Exit'}
                </span>
            </div>

            {/* ── Feeling logged toast (mid-screen) ─────────────────────────────── */}
            <div className={`absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 transition-all duration-500 ${recentLog ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                }`}>
                <div className="px-8 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl">
                    <p className="text-2xl font-black tracking-widest text-white uppercase">{recentLog}</p>
                </div>
            </div>

            {/* ── CONTAINER 1: Video (upper region, portrait-fitted, pointer-events-none) ── */}
            {/*   flex-1 lets the video container grow to fill available space above buttons */}
            <div
                className="relative flex-1 overflow-hidden pointer-events-none"
                aria-hidden="true"
            >
                {/* Ambient gradient overlay — legibility layer */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/60 z-10" />

                {/* Top prompt — lightweight, doesn't cover spherecules */}
                <div className="absolute top-5 left-0 right-0 text-center z-20 pointer-events-none">
                    <p className="text-white/40 text-sm font-semibold tracking-[0.2em] uppercase">
                        Tap to quietly log your state
                    </p>
                </div>

                {/* Spherecules video — portrait-oriented, object-cover fills the container */}
                <video
                    src="/admin_uploads/spherecules.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover opacity-90 mix-blend-screen"
                />
            </div>

            {/* ── CONTAINER 2: Button grid (bottom strip, fully visible, independently responsive) ── */}
            {/*   shrink-0 ensures it is never compressed by the video container                       */}
            <div className="relative z-20 shrink-0 px-4 pb-5 pt-3 w-full max-w-5xl mx-auto bg-black/30">
                <div className="grid grid-cols-4 gap-2">
                    {FEELINGS.map((f) => (
                        <button
                            key={f.id}
                            onClick={() => handleLogFeeling(f.id, f.label)}
                            className={`
                                ${f.color}
                                backdrop-blur-lg border rounded-xl
                                px-2 py-3
                                text-xs font-bold tracking-wide uppercase text-center
                                transition-all duration-200
                                active:scale-95 active:brightness-150
                                shadow-lg
                            `}
                            aria-label={`Log feeling: ${f.label}`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            </div>

        </div>
    );
}
