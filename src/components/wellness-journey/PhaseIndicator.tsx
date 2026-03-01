import React from 'react';
import { Calendar, Activity, TrendingUp, CheckCircle, Lock } from 'lucide-react';

interface PhaseIndicatorProps {
    currentPhase: 1 | 2 | 3;
    completedPhases: number[];
    onPhaseChange: (phase: 1 | 2 | 3) => void;
}

// ── LOCKED PHASE COLOR SYSTEM ─────────────────────────────────────────────
// Phase 1 = Indigo  (calm, methodical preparation — blue-violet family)
// Phase 2 = Amber   (active, focused — warm attention)
// Phase 3 = Teal    (healing, growth — muted cool)
// RED is RESERVED for warnings, adverse events, and safety flags ONLY.
const PHASE_CONFIG = {
    1: {
        icon: Calendar,
        label: 'Preparation',
        activeBg: 'bg-indigo-950/70',
        activeBorder: 'border-indigo-500/70',
        activeText: 'text-indigo-200',
        activeTopLine: 'bg-indigo-500',
        tooltipTitle: 'Phase 1: Preparation',
        tooltip: 'Establish the patient baseline before any dosing session. Complete 4 clinical forms: Informed Consent, Safety Screening, Mental Health Screening, and Set & Setting (includes clinical observations).',
    },
    2: {
        icon: Activity,
        label: 'Dosing Session',
        activeBg: 'bg-amber-950/60',
        activeBorder: 'border-amber-500/70',
        activeText: 'text-amber-200',
        activeTopLine: 'bg-amber-500',
        tooltipTitle: 'Phase 2: Treatment Session',
        tooltip: 'Live documentation during the dosing session. Record vitals, annotate the timeline, log observations, and document adverse events. Unlocks when Phase 1 is complete.',
    },
    3: {
        icon: TrendingUp,
        label: 'Integration',
        activeBg: 'bg-teal-950/60',
        activeBorder: 'border-teal-500/70',
        activeText: 'text-teal-200',
        activeTopLine: 'bg-teal-500',
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
            {/* ── Desktop: true tab row ─────────────────────────────── */}
            {/*
              The "connected tab" illusion:
              - Tabs have rounded-t-xl (top corners rounded, bottom flat)
              - Active tab: marginBottom: -1px so it overlaps the panel's top border
              - Active tab: has NO bottom border — its bottom bleeds into the panel
              - Active tab: z-index 10 so it sits in front of the panel border
              - Inactive tabs: full border, slightly lower opacity bg
            */}
            <div
                className="hidden md:flex items-end w-full"
                role="tablist"
                aria-label="Journey phases"
            >
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
                        <button
                            key={phaseId}
                            onClick={() => !isLocked && onPhaseChange(phaseId)}
                            disabled={isLocked}
                            role="tab"
                            aria-selected={isActive}
                            aria-controls={`phase-panel-${phaseId}`}
                            aria-label={`Phase ${phaseId}: ${cfg.label}${isCompleted && !isActive ? ' (complete)' : ''}${isLocked ? ' (locked)' : ''}`}
                            className={[
                                'relative flex-1 flex items-center justify-center gap-2.5 overflow-hidden',
                                'px-6 py-5 rounded-t-xl transition-all duration-200 select-none',
                                isActive
                                    ? `${cfg.activeBg} border-l border-r border-t ${cfg.activeBorder} ${cfg.activeText} font-bold`
                                    : isCompleted
                                        ? 'bg-slate-800/50 border border-slate-700/60 text-slate-300 hover:bg-slate-800/70 hover:text-[#A8B5D1] font-semibold cursor-pointer'
                                        : 'bg-slate-900/40 border border-slate-800/50 text-slate-500 font-semibold cursor-pointer hover:text-slate-400',
                            ].join(' ')}
                            style={isActive ? {
                                marginBottom: '-2px',
                                zIndex: 10,
                            } : { zIndex: 1 }}
                        >
                            {/* Accent stripe at top of active tab */}
                            {isActive && (
                                <span
                                    className={`absolute top-0 left-0 right-0 h-0.5 rounded-t-xl ${cfg.activeTopLine}`}
                                    aria-hidden="true"
                                />
                            )}

                            {/* Icon: Lock / CheckCircle / phase icon */}
                            {isLocked
                                ? <Lock className="w-5 h-5 text-slate-600 flex-shrink-0" aria-hidden="true" />
                                : isCompleted && !isActive
                                    ? <CheckCircle className="w-5 h-5 text-teal-400 flex-shrink-0" aria-hidden="true" />
                                    : <Icon className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                            }

                            <span className="text-lg md:text-xl font-semibold">
                                <span className={`font-black mr-1.5 ${isActive ? '' : isLocked ? 'text-slate-600' : 'text-slate-500'}`}>
                                    {phaseId}
                                </span>
                                {cfg.label}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* ── Mobile: select ──────────────────────────────────── */}
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
