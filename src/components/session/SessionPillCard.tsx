import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity } from 'lucide-react';
import type { ActiveSession } from '../../hooks/useActiveSessions';

// ─── Elapsed timer helpers ────────────────────────────────────────────────────

function getElapsedSeconds(startedAt: string): number {
    const start = new Date(startedAt).getTime();
    const now = Date.now();
    return Math.max(0, Math.floor((now - start) / 1000));
}

function formatElapsed(totalSeconds: number): string {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return [
        String(h).padStart(2, '0'),
        String(m).padStart(2, '0'),
        String(s).padStart(2, '0'),
    ].join(':');
}

// ─── Sub-component: Live timer (ticks every second) ──────────────────────────

const LiveTimer: React.FC<{ startedAt: string }> = ({ startedAt }) => {
    const [elapsed, setElapsed] = useState(() => getElapsedSeconds(startedAt));

    useEffect(() => {
        const tick = setInterval(() => {
            setElapsed(getElapsedSeconds(startedAt));
        }, 1000);
        return () => clearInterval(tick);
    }, [startedAt]);

    return (
        <span
            className="font-mono text-amber-300 ppn-meta font-bold tabular-nums"
            aria-live="off"
            aria-label={`Session elapsed time: ${formatElapsed(elapsed)}`}
        >
            {formatElapsed(elapsed)}
        </span>
    );
};

// ─── SessionPillCard: Header compact variant ──────────────────────────────────

interface SessionPillCardProps {
    session: ActiveSession;
    /** If true, renders the larger dashboard card style */
    variant?: 'pill' | 'card';
}

const SessionPillCard: React.FC<SessionPillCardProps> = ({
    session,
    variant = 'pill',
}) => {
    const navigate = useNavigate();

    const handleClick = () => {
        // Navigate to Wellness Journey with the session's patient context
        navigate(`/wellness-journey?session=${session.id}`);
    };

    if (variant === 'pill') {
        return (
            <button
                onClick={handleClick}
                aria-label={`Go to ${session.sessionLabel}: ${session.substanceName}, ${session.patientSex}, age ${session.patientAge ?? '—'}`}
                className="
          group flex items-center gap-2 px-3 py-1.5
          rounded-xl border border-amber-500/30
          bg-amber-950/20 hover:bg-amber-950/40
          backdrop-blur-sm
          transition-all duration-200
          hover:border-amber-500/60
          hover:shadow-[0_0_12px_rgba(245,158,11,0.15)]
          active:scale-95
        "
            >
                {/* Pulsing live dot */}
                <span className="relative flex h-2 w-2 shrink-0" aria-hidden="true">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400" />
                </span>

                {/* Session label */}
                <span className="ppn-meta font-black text-amber-200/80 tracking-widest uppercase">
                    {session.sessionLabel}
                </span>

                {/* Divider */}
                <span className="text-slate-600" aria-hidden="true">·</span>

                {/* Substance */}
                <span className="text-sm font-semibold text-slate-300">
                    {session.substanceName}
                </span>

                {/* Sex · Age */}
                <span className="ppn-meta text-slate-500 hidden sm:inline">
                    {session.patientSex}
                    {session.patientAge != null && `, ${session.patientAge}`}
                </span>

                {/* Divider */}
                <span className="text-slate-600 hidden sm:inline" aria-hidden="true">·</span>

                {/* Live timer */}
                <LiveTimer startedAt={session.startedAt} />
            </button>
        );
    }

    // Dashboard card variant, larger, more detail
    return (
        <button
            onClick={handleClick}
            aria-label={`Go to ${session.sessionLabel}: ${session.substanceName}, ${session.patientSex}, age ${session.patientAge ?? '—'}`}
            className="
        group w-full text-left
        flex items-center gap-4 p-4
        rounded-2xl border border-amber-500/25
        bg-amber-950/15 hover:bg-amber-950/30
        backdrop-blur-sm
        transition-all duration-200
        hover:border-amber-500/50
        hover:shadow-[0_0_20px_rgba(245,158,11,0.12)]
        active:scale-[0.98]
      "
        >
            {/* Icon + pulse */}
            <div className="relative shrink-0">
                <div className="size-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center">
                    <Activity className="w-5 h-5 text-amber-400" aria-hidden="true" />
                </div>
                <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5" aria-hidden="true">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400" />
                </span>
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                    <span className="ppn-meta font-black text-amber-300/80 tracking-widest uppercase">
                        {session.sessionLabel}
                    </span>
                    <span className="text-slate-600 ppn-meta" aria-hidden="true">·</span>
                    <span className="ppn-meta text-slate-400">
                        {session.patientSex}
                        {session.patientAge != null && `, ${session.patientAge} yrs`}
                    </span>
                </div>
                <p className="ppn-body text-slate-200 font-semibold truncate">
                    {session.substanceName}
                </p>
            </div>

            {/* Timer */}
            <div className="shrink-0 text-right">
                <p className="ppn-meta text-slate-500 mb-0.5">ELAPSED</p>
                <LiveTimer startedAt={session.startedAt} />
            </div>

            {/* Navigate arrow */}
            <span
                className="material-symbols-outlined text-slate-600 group-hover:text-amber-400 transition-colors text-[18px]"
                aria-hidden="true"
            >
                arrow_forward
            </span>
        </button>
    );
};

export default SessionPillCard;
export { LiveTimer };
