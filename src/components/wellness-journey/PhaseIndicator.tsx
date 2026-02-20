import React from 'react';
import { Calendar, Activity, TrendingUp, CheckCircle } from 'lucide-react';
import { AdvancedTooltip } from '../ui/AdvancedTooltip';

interface PhaseIndicatorProps {
    currentPhase: 1 | 2 | 3;
    completedPhases: number[];
    onPhaseChange: (phase: 1 | 2 | 3) => void;
}

export const PhaseIndicator: React.FC<PhaseIndicatorProps> = ({
    currentPhase,
    completedPhases,
    onPhaseChange
}) => {
    const phases = [
        {
            id: 1 as const,
            label: 'Preparation',
            icon: Calendar,
            color: 'red',
            bgColor: 'bg-red-500/20',
            borderColor: 'border-red-500',
            textColor: 'text-red-300',
            tooltipTitle: 'Phase 1: Preparation',
            tooltip: 'Establish the patient baseline before any dosing session. Complete 5 clinical forms: Informed Consent, Safety Screening, Set & Setting, Baseline Observations, and MEQ-30. All Phase 2 data is anchored to this baseline.'
        },
        {
            id: 2 as const,
            label: 'Treatment',
            icon: Activity,
            color: 'amber',
            bgColor: 'bg-amber-500/20',
            borderColor: 'border-amber-500',
            textColor: 'text-amber-300',
            tooltipTitle: 'Phase 2: Treatment Session',
            tooltip: 'Live documentation during the dosing session. Record session vitals at intervals, annotate the session timeline, log observations, and document any adverse events or rescue protocol use. Unlocks when Phase 1 is complete.'
        },
        {
            id: 3 as const,
            label: 'Integration',
            icon: TrendingUp,
            color: 'emerald',
            bgColor: 'bg-emerald-500/20',
            borderColor: 'border-emerald-500',
            textColor: 'text-emerald-300',
            tooltipTitle: 'Phase 3: Integration',
            tooltip: 'Post-session monitoring and support. Track behavioral changes, conduct structured integration sessions, re-administer PHQ-9/GAD-7 at timepoints, and run safety checks. Outcome metrics are compared against Phase 1 baseline. Unlocks when Phase 2 is complete.'
        }
    ];

    return (
        <div className="w-full mb-8">
            {/* Desktop: Horizontal Tabs */}
            <div className="hidden md:flex gap-2 border-b border-slate-800 pb-2">
                {phases.map((phase, index) => {
                    const isActive = currentPhase === phase.id;
                    const isCompleted = completedPhases.includes(phase.id);
                    const isDisabled = !isCompleted && phase.id > 1 && !completedPhases.includes(phase.id - 1);

                    return (
                        <React.Fragment key={phase.id}>
                            <AdvancedTooltip
                                content={phase.tooltip}
                                title={phase.tooltipTitle}
                                type={phase.id === 1 ? 'info' : phase.id === 2 ? 'warning' : 'success'}
                                tier="detailed"
                                side="bottom"
                                width="w-80"
                            >
                                <button
                                    onClick={() => onPhaseChange(phase.id)}
                                    className={`
                  flex items-center gap-3 px-6 py-4 rounded-t-2xl transition-all
                  ${isActive
                                            ? `${phase.bgColor} border-2 ${phase.borderColor} ${phase.textColor} font-bold`
                                            : isCompleted
                                                ? 'bg-slate-800/40 border border-slate-700 text-slate-300 hover:text-slate-300'
                                                : 'bg-slate-900/40 border border-slate-700 text-slate-400 hover:text-slate-300 hover:bg-slate-800/40 cursor-pointer'
                                        }
                `}
                                    role="tab"
                                    aria-selected={isActive}
                                    aria-controls={`panel-${phase.id}`}
                                    aria-label={`Phase ${phase.id}: ${phase.label}`}
                                >
                                    <div className="flex items-center gap-3">
                                        {isCompleted && !isActive ? (
                                            <CheckCircle className="w-5 h-5 text-emerald-400" />
                                        ) : (
                                            <phase.icon className="w-5 h-5" />
                                        )}
                                        <div className="text-left">
                                            <div className="text-sm uppercase tracking-wide">Phase {phase.id}</div>
                                            <div className={`text-base ${isActive ? 'font-black' : 'font-semibold'}`}>
                                                {phase.label} {isCompleted && !isActive && '✓'}
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            </AdvancedTooltip>

                            {/* Arrow connector */}
                            {index < phases.length - 1 && (
                                <div className="flex items-center px-2 text-slate-700">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            )}
                        </React.Fragment>
                    );
                })}
            </div>

            {/* Mobile: Dropdown Selector */}
            <div className="md:hidden">
                <select
                    value={currentPhase}
                    onChange={(e) => onPhaseChange(Number(e.target.value) as 1 | 2 | 3)}
                    className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700 rounded-xl text-slate-300 text-sm font-bold"
                    aria-label="Select phase"
                >
                    {phases.map(phase => (
                        <option key={phase.id} value={phase.id}>
                            Phase {phase.id}: {phase.label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};
