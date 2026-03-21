/**
 * SessionHUD — Phase 2 session status bar (timer + live vitals strip).
 *
 * Extracted from DosingSessionPhase.tsx (lines 1494-1550) as part of the
 * Stabilisation Sprint Track 2 component split. Renders in both pre and live
 * modes — appearance differs via the `isLive` flag (dimmed vs. active).
 *
 * @see DosingSessionPhase.tsx (orchestrator)
 */

import React from 'react';
import { Heart } from 'lucide-react';

interface SessionUpdateEntry {
    hr: string;
    bp: string;
    timestamp: string;
}

export interface SessionHUDProps {
    isLive: boolean;
    elapsedTime: string;
    updateLog: SessionUpdateEntry[];
    liveVitals: { hr: number; bp: string; spo2: number; hrv: number };
}

export const SessionHUD: React.FC<SessionHUDProps> = ({
    isLive,
    elapsedTime,
    updateLog,
    liveVitals,
}) => {
    const lastWithVitals = updateLog.find(e => e.hr || e.bp);
    const latestHr = lastWithVitals?.hr || liveVitals.hr.toString();
    const latestBp = lastWithVitals?.bp || liveVitals.bp;
    const latestSpo2 = liveVitals.spo2;
    const lastTime = lastWithVitals?.timestamp;

    return (
        <div className={`rounded-2xl border transition-all duration-500 ${isLive
            ? 'sticky top-2 z-30 bg-[#061115]/95 border-emerald-900/40 shadow-lg shadow-emerald-950/30 backdrop-blur-xl'
            : 'bg-slate-900/30 border-slate-800/40 opacity-50 select-none'
            }`}>
            <div className="flex items-center justify-between px-5 py-4 gap-4 flex-wrap">

                {/* ── Left: Session status + elapsed timer ── */}
                <div className="flex items-center gap-5">
                    <div>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-emerald-600/80 font-bold mb-0.5">
                            {isLive ? 'Session Active' : 'Session Timer'}
                        </p>
                        <p className="text-2xl font-black text-emerald-50/90 font-mono tracking-tight leading-none tabular-nums">
                            {elapsedTime}
                        </p>
                    </div>

                    {/* ── Most recently logged vitals from Session Updates ── */}
                    {isLive && (
                        <div className="flex items-stretch gap-0 bg-[#040C0E]/60 rounded-xl border border-[#14343B]/40 overflow-hidden">
                            <div className="px-4 py-2.5 text-center border-r border-[#14343B]/40">
                                <p className="text-[10px] uppercase tracking-widest text-[#507882] font-semibold mb-1">HR</p>
                                <div className="flex items-center gap-1 justify-center">
                                    <Heart className="w-3 h-3 text-rose-500/80 fill-rose-500/30 animate-pulse" />
                                    <p className="text-xl font-black text-emerald-100 leading-none tabular-nums">{latestHr}</p>
                                    <p className="text-[10px] text-slate-600 font-semibold self-end mb-0.5">bpm</p>
                                </div>
                            </div>
                            <div className="px-4 py-2.5 text-center border-r border-[#14343B]/40">
                                <p className="text-[10px] uppercase tracking-widest text-[#507882] font-semibold mb-1">BP</p>
                                <p className="text-xl font-black text-emerald-100 leading-none tabular-nums">{latestBp}</p>
                            </div>
                            <div className="px-4 py-2.5 text-center border-r border-[#14343B]/40">
                                <p className="text-[10px] uppercase tracking-widest text-[#507882] font-semibold mb-1">SpO2</p>
                                <p className={`text-xl font-black leading-none tabular-nums ${latestSpo2 < 95 ? 'text-amber-400' : 'text-emerald-100'}`}>
                                    {latestSpo2}%
                                </p>
                            </div>
                            <div className="px-3 py-2.5 flex flex-col justify-center">
                                <p className="text-[9px] uppercase tracking-widest text-[#507882] font-semibold">Last logged</p>
                                <p className="text-[11px] font-mono text-slate-500 leading-tight mt-0.5">
                                    {lastTime ?? '— not yet recorded'}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
