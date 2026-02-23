/**
 * NeuroplasticityWindowBadge — WO-241 P1.5
 *
 * Displays the remaining days in the post-session neuroplasticity window
 * (the ~21-day period of heightened synaptic plasticity following psychedelic dosing).
 *
 * Clinical basis: Castrén & Hen (2013), Ly et al. (2018) — psilocybin and MDMA
 * promote structural and functional neuroplasticity, making the integration period
 * immediately post-session critical for therapeutic consolidation.
 *
 * Color logic (days remaining):
 *  > 14  → emerald  "Prime window open"
 *  7–14  → amber    "Mid-window — prioritise integration"
 *  1–6   → red      "Window closing — urgent integration support"
 *  0     → slate    "Window closed"
 */

import React from 'react';
import { Brain } from 'lucide-react';
import { AdvancedTooltip } from '../ui/AdvancedTooltip';

interface NeuroplasticityWindowBadgeProps {
    /** ISO date string (YYYY-MM-DD) or Date of the dosing session */
    sessionDate: string | Date;
    /** Total window length in days. Defaults to 21 per Ly et al. (2018). */
    windowDays?: number;
}

function getDaysRemaining(sessionDate: string | Date, windowDays: number): number {
    const session = typeof sessionDate === 'string' ? new Date(sessionDate) : sessionDate;
    const now = new Date();
    const elapsed = Math.floor((now.getTime() - session.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, windowDays - elapsed);
}

export const NeuroplasticityWindowBadge: React.FC<NeuroplasticityWindowBadgeProps> = ({
    sessionDate,
    windowDays = 21,
}) => {
    const remaining = getDaysRemaining(sessionDate, windowDays);
    const elapsed = windowDays - remaining;
    const progressPct = Math.min(100, (elapsed / windowDays) * 100);

    const getConfig = () => {
        if (remaining === 0) return {
            label: 'Neuroplasticity Window Closed',
            sublabel: 'Integration window has passed',
            barColor: 'bg-slate-600',
            textColor: 'text-slate-400',
            borderColor: 'border-slate-700/50',
            bgColor: 'bg-slate-900/40',
            glowColor: '',
            dotColor: 'bg-slate-500',
        };
        if (remaining > 14) return {
            label: `${remaining} days remaining`,
            sublabel: 'Neuroplasticity window — prime period',
            barColor: 'bg-emerald-500',
            textColor: 'text-emerald-300',
            borderColor: 'border-emerald-700/40',
            bgColor: 'bg-emerald-950/30',
            glowColor: 'shadow-[0_0_16px_rgba(52,211,153,0.2)]',
            dotColor: 'bg-emerald-400 animate-pulse',
        };
        if (remaining >= 7) return {
            label: `${remaining} days remaining`,
            sublabel: 'Mid-window — prioritise integration',
            barColor: 'bg-amber-500',
            textColor: 'text-amber-300',
            borderColor: 'border-amber-700/40',
            bgColor: 'bg-amber-950/30',
            glowColor: 'shadow-[0_0_16px_rgba(245,158,11,0.2)]',
            dotColor: 'bg-amber-400 animate-pulse',
        };
        return {
            label: `${remaining} day${remaining === 1 ? '' : 's'} remaining`,
            sublabel: 'Window closing — urgent integration support',
            barColor: 'bg-red-500',
            textColor: 'text-red-300',
            borderColor: 'border-red-700/50',
            bgColor: 'bg-red-950/30',
            glowColor: 'shadow-[0_0_20px_rgba(239,68,68,0.25)]',
            dotColor: 'bg-red-400 animate-pulse',
        };
    };

    const cfg = getConfig();

    const tooltipContent = (
        <div className="space-y-2 max-w-xs">
            <p className="font-black text-white text-sm">🧠 Neuroplasticity Window</p>
            <p className="text-slate-300 text-xs leading-relaxed">
                Research shows that psilocybin and MDMA promote heightened synaptic plasticity
                for approximately 2–3 weeks post-session. This window represents the highest
                opportunity for therapeutic consolidation through integration work.
            </p>
            <p className="text-slate-400 text-xs leading-relaxed">
                Prioritise integration sessions, journaling, and therapeutic support during
                this period to maximise long-term treatment gains.
            </p>
            <div className="pt-1 border-t border-slate-700">
                <p className="text-slate-500 text-[10px] font-mono">
                    Ly et al. (2018) Cell; Castrén &amp; Hen (2013) Nat Rev Neurosci
                </p>
                <a
                    href="https://pubmed.ncbi.nlm.nih.gov/29677511/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-400 hover:text-indigo-300 text-[10px] font-semibold mt-0.5 inline-block"
                >
                    ↗ View source (PubMed)
                </a>
            </div>
        </div>
    );

    return (
        <AdvancedTooltip content={tooltipContent} side="bottom">
            <div
                className={`
                    flex items-center gap-4 px-5 py-3.5 rounded-2xl border
                    ${cfg.bgColor} ${cfg.borderColor} ${cfg.glowColor}
                    cursor-help transition-all duration-300
                `}
                role="status"
                aria-label={`${cfg.label} in neuroplasticity window`}
            >
                {/* Icon + dot */}
                <div className="flex items-center gap-2 flex-shrink-0">
                    <Brain className={`w-5 h-5 ${cfg.textColor}`} />
                    {remaining > 0 && (
                        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${cfg.dotColor}`} />
                    )}
                </div>

                {/* Text block */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2">
                        <span className={`text-sm font-black ${cfg.textColor}`}>
                            {cfg.label}
                        </span>
                        <span className="text-[10px] uppercase tracking-widest font-bold text-slate-500">
                            in neuroplasticity window
                        </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{cfg.sublabel}</p>
                </div>

                {/* Progress bar */}
                <div className="flex-shrink-0 w-28">
                    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all duration-500 ${cfg.barColor}`}
                            style={{ width: `${progressPct}%` }}
                        />
                    </div>
                    <p className="text-[10px] text-slate-600 mt-0.5 text-right font-mono">
                        Day {elapsed}/{windowDays}
                    </p>
                </div>
            </div>
        </AdvancedTooltip>
    );
};

export default NeuroplasticityWindowBadge;
