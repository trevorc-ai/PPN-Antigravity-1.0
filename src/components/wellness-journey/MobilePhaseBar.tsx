/**
 * MobilePhaseBar — Phase 1 / 2 / 3 switcher for mobile viewports
 *
 * Shown only on mobile/tablet (< md breakpoint).
 * Desktop uses the existing <PhaseIndicator> tab row as normal.
 *
 * Sits sticky at the top of the page scroll area (inside <main>),
 * so it scrolls INTO view with content but then sticks.
 *
 * Lock logic: directly mirrors WellnessJourney's completedPhases array.
 *   Phase 1: always unlocked
 *   Phase 2: unlocked when completedPhases includes 1
 *   Phase 3: unlocked when completedPhases includes 2
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';

interface MobilePhaseBarProps {
    activePhase: 1 | 2 | 3;
    completedPhases: number[];
    onPhaseChange: (phase: 1 | 2 | 3) => void;
}

const SPRING = { type: 'spring', stiffness: 400, damping: 30 } as const;

const PHASES: {
    id: 1 | 2 | 3;
    short: string;
    full: string;
    icon: string;
    color: {
        active: string;
        activeBg: string;
        activeBorder: string;
        done: string;
    };
}[] = [
        {
            id: 1,
            short: 'Prep',
            full: 'Preparation',
            icon: 'checklist',
            color: {
                active: 'text-indigo-200',
                activeBg: 'bg-[rgba(99,102,241,0.20)]',
                activeBorder: 'border-indigo-500/60',
                done: 'text-indigo-400',
            },
        },
        {
            id: 2,
            short: 'Dosing',
            full: 'Dosing Session',
            icon: 'medication',
            color: {
                active: 'text-amber-200',
                activeBg: 'bg-[rgba(245,158,11,0.20)]',
                activeBorder: 'border-amber-500/60',
                done: 'text-amber-400',
            },
        },
        {
            id: 3,
            short: 'Integrate',
            full: 'Integration',
            icon: 'self_improvement',
            color: {
                active: 'text-teal-200',
                activeBg: 'bg-[rgba(20,184,166,0.20)]',
                activeBorder: 'border-teal-500/60',
                done: 'text-teal-400',
            },
        },
    ];

export const MobilePhaseBar: React.FC<MobilePhaseBarProps> = ({
    activePhase,
    completedPhases,
    onPhaseChange,
}) => {
    const isUnlocked = (phase: number) => {
        if (phase === 1) return true;
        if (phase === 2) return completedPhases.includes(1);
        if (phase === 3) return completedPhases.includes(2);
        return false;
    };

    return (
        <div
            className="sticky top-0 z-20 md:hidden bg-[#0a1628]/95 backdrop-blur-md border-b border-slate-800/80 px-3 py-2"
            role="tablist"
            aria-label="Wellness Journey phases"
        >
            <div className="flex gap-2">
                {PHASES.map((phase) => {
                    const isActive = activePhase === phase.id;
                    const unlocked = isUnlocked(phase.id);
                    const isDone = completedPhases.includes(phase.id);

                    return (
                        <motion.button
                            key={phase.id}
                            role="tab"
                            aria-selected={isActive}
                            aria-label={`Phase ${phase.id}: ${phase.full}${!unlocked ? ' — locked' : isDone ? ' — complete' : ''}`}
                            disabled={!unlocked}
                            whileTap={unlocked ? { scale: 0.92 } : {}}
                            transition={SPRING}
                            onClick={() => unlocked && onPhaseChange(phase.id)}
                            className={[
                                'flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl',
                                'border transition-all text-sm font-bold tracking-wide',
                                'min-h-[44px]',
                                isActive
                                    ? `${phase.color.activeBg} ${phase.color.activeBorder} ${phase.color.active}`
                                    : unlocked
                                        ? 'bg-transparent border-slate-800/60 text-slate-500 hover:border-slate-700 hover:text-slate-400'
                                        : 'bg-transparent border-slate-900 text-slate-700 cursor-not-allowed opacity-50',
                            ].join(' ')}
                        >
                            {/* Icon or lock */}
                            {!unlocked ? (
                                <Lock className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                            ) : (
                                <span
                                    className="material-symbols-outlined text-base shrink-0"
                                    aria-hidden="true"
                                >
                                    {isDone && !isActive ? 'check_circle' : phase.icon}
                                </span>
                            )}

                            {/* Label */}
                            <span className="truncate">
                                <span className="hidden sm:inline">{phase.full}</span>
                                <span className="sm:hidden">{phase.short}</span>
                            </span>

                            {/* Active pip */}
                            {isActive && (
                                <motion.span
                                    layoutId="phase-bar-pip"
                                    transition={SPRING}
                                    className="ml-auto w-1.5 h-1.5 rounded-full bg-current opacity-80 shrink-0"
                                />
                            )}
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
};

export default MobilePhaseBar;
