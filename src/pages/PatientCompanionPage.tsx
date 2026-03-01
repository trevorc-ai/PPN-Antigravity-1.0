import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';

interface PatientLogEvent {
    timestamp: string;
    feeling: string;
}

/**
 * FEELINGS palette — dark-room optimised:
 * - `rest`   : dim semi-transparent bg + muted *-300/80 text (eye-safe, readable, not blinding)
 * - `glow`   : ~60% opacity fill — bright enough to register a tap without a harsh white flash
 * CSS handles the slow fade-back (1.8s ease-out) automatically via the transition class below.
 *
 * Accessibility: *-300 on effectively-black bg gives ~5–6:1 contrast ratio (WCAG AA pass).
 */
const FEELINGS = [
    { id: 'blissful', label: 'Blissful', rest: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300/80', glow: 'bg-emerald-500/60 border-emerald-400/70 text-emerald-200' },
    { id: 'peaceful', label: 'Peaceful', rest: 'bg-teal-500/15 border-teal-500/30 text-teal-300/80', glow: 'bg-teal-500/60 border-teal-400/70 text-teal-200' },
    { id: 'grounded', label: 'Grounded / Safe', rest: 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300/80', glow: 'bg-cyan-500/60 border-cyan-400/70 text-cyan-200' },
    { id: 'connected', label: 'Connected', rest: 'bg-sky-500/15 border-sky-500/30 text-sky-300/80', glow: 'bg-sky-500/60 border-sky-400/70 text-sky-200' },
    { id: 'euphoric', label: 'Euphoric', rest: 'bg-violet-500/15 border-violet-500/30 text-violet-300/80', glow: 'bg-violet-500/60 border-violet-400/70 text-violet-200' },
    { id: 'drifting', label: 'Drifting / Floating', rest: 'bg-indigo-500/15 border-indigo-500/30 text-indigo-300/80', glow: 'bg-indigo-500/60 border-indigo-400/70 text-indigo-200' },
    { id: 'curious', label: 'Curious', rest: 'bg-purple-500/15 border-purple-500/30 text-purple-300/80', glow: 'bg-purple-500/60 border-purple-400/70 text-purple-200' },
    { id: 'open', label: 'Open / Surrendered', rest: 'bg-fuchsia-500/15 border-fuchsia-500/30 text-fuchsia-300/80', glow: 'bg-fuchsia-500/60 border-fuchsia-400/70 text-fuchsia-200' },
    { id: 'emotional', label: 'Emotional / Crying', rest: 'bg-blue-500/15 border-blue-500/30 text-blue-300/80', glow: 'bg-blue-500/60 border-blue-400/70 text-blue-200' },
    { id: 'confused', label: 'Confused', rest: 'bg-slate-500/15 border-slate-500/30 text-slate-300/80', glow: 'bg-slate-500/60 border-slate-400/70 text-slate-200' },
    { id: 'anxious', label: 'Anxious', rest: 'bg-amber-500/15 border-amber-500/30 text-amber-300/80', glow: 'bg-amber-500/60 border-amber-400/70 text-amber-200' },
    { id: 'overwhelmed', label: 'Overwhelmed', rest: 'bg-orange-500/15 border-orange-500/30 text-orange-300/80', glow: 'bg-orange-500/60 border-orange-400/70 text-orange-200' },
    { id: 'tense', label: 'Tense / Resistance', rest: 'bg-rose-500/15 border-rose-500/30 text-rose-300/80', glow: 'bg-rose-500/60 border-rose-400/70 text-rose-200' },
    { id: 'fearful', label: 'Fearful', rest: 'bg-red-600/15 border-red-600/30 text-red-300/80', glow: 'bg-red-600/60 border-red-500/70 text-red-200' },
    { id: 'nauseous', label: 'Nauseous', rest: 'bg-yellow-700/15 border-yellow-700/30 text-yellow-300/80', glow: 'bg-yellow-600/60 border-yellow-500/70 text-yellow-200' },
    { id: 'need_support', label: 'Need Support', rest: 'bg-pink-600/20 border-pink-500/40 text-pink-300/80 ring-1 ring-pink-500/20', glow: 'bg-pink-500/65 border-pink-400/70 text-pink-200 ring-1 ring-pink-400/50' },
];

export default function PatientCompanionPage() {
    const { sessionId } = useParams();
    const navigate = useNavigate();

    const [recentLog, setRecentLog] = useState<string | null>(null);
    /**
     * litId: button currently in the "instant bright" phase.
     * Set on click, cleared after 160ms. The CSS transition then handles the
     * slow 1.8s fade-out automatically — no setTimeout dance needed for the fade.
     */
    const [litId, setLitId] = useState<string | null>(null);
    const [lockHoldProgress, setLockHoldProgress] = useState(0);

    const holdTimerRef = useRef<NodeJS.Timeout | null>(null);
    const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const litTimerRef = useRef<NodeJS.Timeout | null>(null);

    const handleLogFeeling = (feelingId: string, feelingLabel: string) => {
        // Persist log
        const storageKey = `companion_logs_${sessionId}`;
        const existing = localStorage.getItem(storageKey);
        const logs: PatientLogEvent[] = existing ? JSON.parse(existing) : [];
        logs.push({ timestamp: new Date().toISOString(), feeling: feelingId });
        localStorage.setItem(storageKey, JSON.stringify(logs));

        // Instant-on glow
        if (litTimerRef.current) clearTimeout(litTimerRef.current);
        setLitId(feelingId);
        // After 160ms, remove lit state → CSS transition fades it out over 1.8s
        litTimerRef.current = setTimeout(() => setLitId(null), 160);

        // Soft mid-screen confirmation (dimmed, not blinding white)
        setRecentLog(feelingLabel);
        setTimeout(() => setRecentLog(null), 2200);
    };

    const startUnlock = () => {
        let progress = 0;
        progressIntervalRef.current = setInterval(() => {
            progress += 5;
            if (progress <= 100) setLockHoldProgress(progress);
        }, 150);
        holdTimerRef.current = setTimeout(() => {
            if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
            navigate(-1);
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
            onKeyDown={(e) => { e.stopPropagation(); }}
            tabIndex={-1}
        >
            {/* ── Hold-to-exit (top right) ─────────────────────────────────────── */}
            <div className="absolute top-4 right-4 z-50 flex flex-col items-center gap-1">
                <button
                    onMouseDown={startUnlock}
                    onMouseUp={cancelUnlock}
                    onMouseLeave={cancelUnlock}
                    onTouchStart={startUnlock}
                    onTouchEnd={cancelUnlock}
                    aria-label="Hold 3 seconds to return to session"
                    className="relative w-12 h-12 flex items-center justify-center rounded-full bg-white/8 border border-white/20 text-white/40 backdrop-blur-md hover:bg-white/12 transition-colors group"
                >
                    <Lock className="w-4 h-4 group-active:text-white/70 transition-colors" />
                    {lockHoldProgress > 0 && (
                        <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
                            <circle
                                cx="24" cy="24" r="22"
                                fill="none"
                                stroke="rgba(255,255,255,0.4)"
                                strokeWidth="2"
                                strokeDasharray="138"
                                strokeDashoffset={138 - (138 * lockHoldProgress) / 100}
                                className="transition-all duration-150 ease-linear"
                            />
                        </svg>
                    )}
                </button>
                <span className="text-[10px] font-bold tracking-widest text-white/25 uppercase">
                    {lockHoldProgress > 0 ? 'Hold…' : 'Return'}
                </span>
            </div>

            {/* ── Logged toast — soft, dark-room safe ──────────────────────────── */}
            <div className={`absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 pointer-events-none transition-all duration-700 ${recentLog ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                }`}>
                <div className="px-7 py-3 bg-black/60 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl">
                    <p className="text-lg font-semibold tracking-[0.15em] text-white/60 uppercase">{recentLog}</p>
                </div>
            </div>

            {/* ══════════════════════════════════════════════════════════════════
             *  ZONE 1 — Video (grows to fill all space above the button strip)
             *  object-contain: video respects its own aspect ratio naturally.
             *  mix-blend-screen: letterbox bars are black → invisible against bg.
             *  pointer-events-none: nothing here competes with the button zone.
             * ══════════════════════════════════════════════════════════════════ */}
            <div
                className="relative flex-1 overflow-hidden pointer-events-none flex items-center justify-center"
                aria-hidden="true"
            >
                {/* Gradient overlay — dims edges for text legibility, not obtrusive */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/50 z-10" />

                {/* Prompt — dimmed, top-center */}
                <div className="absolute top-5 left-0 right-0 text-center z-20">
                    <p className="text-white/25 text-xs font-medium tracking-[0.25em] uppercase">
                        Tap to quietly log your state
                    </p>
                </div>

                {/* Spherecules — object-contain preserves natural aspect ratio.
                    mix-blend-screen makes any black letterbox bars vanish.      */}
                <video
                    src="/admin_uploads/spherecules.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-contain opacity-85 mix-blend-screen"
                />
            </div>

            {/* ══════════════════════════════════════════════════════════════════
             *  ZONE 2 — Button grid (structurally below video, never overlaps)
             *  shrink-0: never compressed by the video zone.
             *  border-t: hard visual boundary — buttons cannot bleed into video.
             * ══════════════════════════════════════════════════════════════════ */}
            <div className="relative z-20 shrink-0 w-full border-t border-white/8 bg-black/50 backdrop-blur-sm px-3 pb-5 pt-3">
                <div className="grid grid-cols-4 gap-1.5 max-w-2xl mx-auto">
                    {FEELINGS.map((f) => {
                        const isLit = litId === f.id;
                        return (
                            <button
                                key={f.id}
                                onClick={() => handleLogFeeling(f.id, f.label)}
                                /**
                                 * Transition trick for instant-on / slow-fade-off:
                                 * - When LIT:  `transition-none` → bg snaps to glow instantly
                                 * - When dim:  `transition-[background-color,border-color,box-shadow]
                                 *               duration-[1800ms] ease-out` → CSS fades it back slowly
                                 */
                                className={[
                                    'backdrop-blur-md border rounded-xl',
                                    'px-1.5 py-2.5',
                                    'text-[10px] font-semibold tracking-wider uppercase text-center',
                                    'shadow-sm select-none',
                                    isLit
                                        ? `${f.glow} transition-none scale-[1.04] shadow-lg`
                                        : `${f.rest} transition-[background-color,border-color,box-shadow] duration-[1800ms] ease-out active:scale-95`,
                                ].join(' ')}
                                aria-label={`Log feeling: ${f.label}`}
                            >
                                {f.label}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
