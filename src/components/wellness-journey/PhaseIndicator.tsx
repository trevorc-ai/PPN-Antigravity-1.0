import React from 'react';
import { Calendar, Activity, TrendingUp, CheckCircle } from 'lucide-react';
import { AdvancedTooltip } from '../ui/AdvancedTooltip';

interface PhaseIndicatorProps {
    currentPhase: 1 | 2 | 3;
    completedPhases: number[];
    onPhaseChange: (phase: 1 | 2 | 3) => void;
}

// Per-phase accent tokens
const PHASE_CONFIG = {
    1: {
        icon: Calendar,
        label: 'Preparation',
        // Active: tab bg + border colour
        activeBg: 'bg-red-900/50',
        activeBorder: 'border-red-500/70',
        activeText: 'text-red-200',
        // Indicator line at top of active tab
        activeLine: 'bg-red-500',
        tooltipTitle: 'Phase 1: Preparation',
        tooltip: 'Establish the patient baseline before any dosing session. Complete 5 clinical forms: Informed Consent, Safety Screening, Set & Setting, Baseline Observations, and MEQ-30.',
    },
    2: {
        icon: Activity,
        label: 'Dosing Session',
        activeBg: 'bg-amber-900/40',
        activeBorder: 'border-amber-500/70',
        activeText: 'text-amber-200',
        activeLine: 'bg-amber-500',
        tooltipTitle: 'Phase 2: Treatment Session',
        tooltip: 'Live documentation during the dosing session. Record vitals, annotate the timeline, log observations, and document adverse events. Unlocks when Phase 1 is complete.',
    },
    3: {
        icon: TrendingUp,
        label: 'Integration',
        activeBg: 'bg-emerald-900/40',
        activeBorder: 'border-emerald-500/70',
        activeText: 'text-emerald-200',
        activeLine: 'bg-emerald-500',
        tooltipTitle: 'Phase 3: Integration',
        tooltip: 'Post-session monitoring. Track behavioral changes, conduct integration sessions, re-administer PHQ-9/GAD-7, and run safety checks. Unlocks when Phase 2 is complete.',
    },
} as const;

export const PhaseIndicator: React.FC<PhaseIndicatorProps> = ({
    currentPhase,
    completedPhases,
    onPhaseChange,
}) => {
    return (
        <div className="w-full">
            {/* ── Desktop: true tab row ──────────────────────────────────────── */}
            <div className="hidden md:flex items-end gap-0" role="tablist" aria-label="Journey phases">
                {([1, 2, 3] as const).map((phaseId) => {
                    const cfg = PHASE_CONFIG[phaseId];
                    const Icon = cfg.icon;
                    const isActive = currentPhase === phaseId;
                    const isCompleted = completedPhases.includes(phaseId);
                    const isLocked =
                        phaseId > 1 &&
                        !completedPhases.includes((phaseId - 1) as 1 | 2 | 3) &&
                        !isActive;

                    return (
                        <AdvancedTooltip
                            key={phaseId}
                            content={cfg.tooltip}
                            title={cfg.tooltipTitle}
                            type="info"
                            tier="detailed"
                            side="top"
                            width="w-72"
                        >
                            {/* Tab button — bottom border removed when active so it
                                visually bleeds into the panel below */}
                            <button
                                onClick={() => !isLocked && onPhaseChange(phaseId)}
                                disabled={isLocked}
                                role="tab"
                                aria-selected={isActive}
                                aria-controls={`phase-panel-${phaseId}`}
                                aria-label={`Phase ${phaseId}: ${cfg.label}${isCompleted && !isActive ? ' — complete' : ''}${isLocked ? ' — locked' : ''}`}
                                className={[
                                    // Base shape — top corners rounded, bottom flat to merge with panel
                                    'relative flex-1 flex items-center justify-center gap-2.5 px-5 py-3.5',
                                    'rounded-t-xl transition-all duration-200 select-none',
                                    'border-l border-r border-t',
                                    // Active: coloured bg, border matches panel's side/top border
                                    isActive
                                        ? `${cfg.activeBg} ${cfg.activeBorder} ${cfg.activeText} font-bold`
                                        : isCompleted
                                            ? 'bg-slate-800/50 border-slate-700/60 text-slate-300 hover:bg-slate-800/70 hover:text-slate-200 font-semibold cursor-pointer'
                                            : 'bg-slate-900/40 border-slate-800/60 text-slate-500 font-semibold cursor-pointer hover:text-slate-400',
                                ].join(' ')}
                                style={isActive ? {
                                    // Push active tab 2px down so its bottom overlaps the panel's top border
                                    marginBottom: '-2px',
                                    zIndex: 10,
                                } : { zIndex: 1 }}
                            >
                                {/* Accent line at very top of active tab */}
                                {isActive && (
                                    <span
                                        className={`absolute top-0 left-0 right-0 h-0.5 rounded-t-xl ${cfg.activeLine}`}
                                        aria-hidden="true"
                                    />
                                )}

                                {isCompleted && !isActive
                                    ? <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" aria-hidden="true" />
                                    : <Icon className="w-4 h-4 flex-shrink-0" aria-hidden="true" />}

                                <span className="text-sm">
                                    <span className={`font-black mr-1 ${isActive ? '' : 'text-slate-500'}`}>{phaseId}</span>
                                    {cfg.label}
                                    {isCompleted && !isActive && (
                                        <CheckCircle
                                            className="inline w-3.5 h-3.5 text-emerald-400 ml-1.5 -mt-0.5"
                                            aria-label="complete"
                                        />
                                    )}
                                </span>
                            </button>
                        </AdvancedTooltip>
                    );
                })}
            </div>

            {/* ── Mobile: select ──────────────────────────────────────────────── */}
            <div className="md:hidden">
                <select
                    value={currentPhase}
                    onChange={(e) => onPhaseChange(Number(e.target.value) as 1 | 2 | 3)}
                    className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700 rounded-xl text-slate-300 text-sm font-bold"
                    aria-label="Select phase"
                >
                    {([1, 2, 3] as const).map((id) => (
                        <option key={id} value={id}>
                            {id} — {PHASE_CONFIG[id].label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};
