import React from 'react';
import { ArrowRight, CheckCircle, Lock } from 'lucide-react';

export type PhaseType = 1 | 2 | 3;
export type ActionStatus = 'active' | 'completed' | 'locked';

interface WorkflowActionCardProps {
    phase: PhaseType;
    status: ActionStatus;
    title: string;
    description?: string;
    icon?: React.ReactNode;
    date?: string;
    onClick?: () => void;
}

export const WorkflowActionCard: React.FC<WorkflowActionCardProps> = ({
    phase,
    status,
    title,
    description,
    icon,
    date,
    onClick
}) => {
    // Colors matching design spec
    // Phase 1: Sky Blue
    // Phase 2: Fuchsia/Purple
    // Phase 3: Emerald

    let activeBorder = 'border-slate-700 hover:border-sky-500/50';
    let activeText = 'text-sky-400';
    let bgHover = 'hover:bg-sky-500/5';
    let actionArrowColor = 'text-sky-400';

    if (phase === 2) {
        activeBorder = 'border-slate-700 hover:border-fuchsia-500/50';
        activeText = 'text-fuchsia-400';
        bgHover = 'hover:bg-fuchsia-500/5';
        actionArrowColor = 'text-fuchsia-400';
    } else if (phase === 3) {
        activeBorder = 'border-slate-700 hover:border-emerald-500/50';
        activeText = 'text-emerald-400';
        bgHover = 'hover:bg-emerald-500/5';
        actionArrowColor = 'text-emerald-400';
    }

    const isComplete = status === 'completed';
    const isLocked = status === 'locked';

    return (
        <button
            onClick={!isLocked ? onClick : undefined}
            disabled={isLocked}
            className={`relative flex flex-col p-4 rounded-xl border text-left transition-all ${!isLocked ? 'hover:scale-[1.02] active:scale-[0.98]' : 'opacity-50 cursor-not-allowed'}
                ${isComplete
                    ? 'bg-emerald-900/10 border-emerald-500/30 hover:bg-emerald-900/20'
                    : `bg-slate-800/40 ${activeBorder} ${bgHover}`
                }`}
        >
            <div className="flex items-center justify-between mb-3 w-full">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isComplete ? 'bg-emerald-500/20 text-emerald-400' :
                        isLocked ? 'bg-slate-800 border-2 border-slate-700 text-slate-500' :
                            `bg-slate-800 border overflow-hidden ${activeBorder} ${activeText}`
                    }`}>
                    {isComplete ? <CheckCircle className="w-5 h-5" /> : isLocked ? <Lock className="w-4 h-4" /> : icon || <div className="w-3 h-3 rounded-full bg-current opacity-50" />}
                </div>
                {isComplete && date && <span className="text-[10px] font-mono font-bold text-emerald-500/70 bg-emerald-500/10 px-2 py-1 rounded tracking-wider uppercase">{date}</span>}
            </div>
            <div>
                <h3 className={`font-bold text-[15px] ${isComplete ? 'text-emerald-100' : isLocked ? 'text-slate-500' : 'text-[#A8B5D1]'}`}>{title}</h3>
                {description && <p className={`text-xs mt-1.5 line-clamp-2 leading-relaxed ${isLocked ? 'text-slate-600' : 'text-slate-400'}`}>{description}</p>}
            </div>
            {!isComplete && !isLocked && (
                <div className={`mt-4 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider ${actionArrowColor}`}>
                    Action Required <ArrowRight className="w-3.5 h-3.5" />
                </div>
            )}
            {isLocked && (
                <div className="mt-4 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                    Locked
                </div>
            )}
        </button>
    );
};

interface WorkflowOutputCardProps {
    title: string;
    description?: string;
    icon?: React.ReactNode;
    actionLabel?: string;
    actionIcon?: React.ReactNode;
    onClick?: () => void;
    children?: React.ReactNode;
    className?: string; // Additional classes for wrapper
}

export const WorkflowOutputCard: React.FC<WorkflowOutputCardProps> = ({
    title,
    description,
    icon,
    actionLabel,
    actionIcon,
    onClick,
    children,
    className = ''
}) => {
    return (
        <div className={`bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-sm flex flex-col ${className}`}>
            <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-3">
                    {icon && <div className="text-slate-400 shrink-0 w-6 h-6">{icon}</div>}
                    <div>
                        <h3 className="text-[14px] font-bold text-[#A8B5D1] uppercase tracking-widest">{title}</h3>
                        {description && <p className="text-xs text-slate-400 mt-1">{description}</p>}
                    </div>
                </div>
                {actionLabel && onClick && (
                    <button
                        onClick={onClick}
                        className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg text-xs font-bold text-slate-300 transition-colors shrink-0"
                    >
                        {actionIcon}
                        {actionLabel}
                    </button>
                )}
            </div>
            <div className="flex-1 w-full relative">
                {children}
            </div>
        </div>
    );
};
