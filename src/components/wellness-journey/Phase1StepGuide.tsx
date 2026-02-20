import React, { useEffect, useRef } from 'react';
import { CheckCircle, ArrowRight } from 'lucide-react';
import type { WellnessFormId } from './WellnessFormRouter';

export interface Phase1Step {
    id: WellnessFormId;
    label: string;
    description: string;
    required: boolean;
    icon: string;
    color: string;       // tailwind text color for the hero card accent
    bgColor: string;     // tailwind bg color for the hero card
    borderColor: string; // tailwind border color for the hero card
}

export const PHASE1_STEPS: Phase1Step[] = [
    {
        id: 'consent',
        label: 'Informed Consent',
        description: 'Document patient consent before any clinical activity begins.',
        required: true,
        icon: 'check_circle',
        color: 'text-blue-300',
        bgColor: 'bg-blue-500/10',
        borderColor: 'border-blue-500/40',
    },
    {
        id: 'structured-safety',
        label: 'Safety Screen & Eligibility',
        description: 'Screen for contraindications, suicidality risk, and treatment eligibility.',
        required: true,
        icon: 'shield',
        color: 'text-amber-300',
        bgColor: 'bg-amber-500/10',
        borderColor: 'border-amber-500/40',
    },
    {
        id: 'mental-health',
        label: 'Mental Health Screening',
        description: 'Administer PHQ-9, GAD-7, and baseline psychological assessment.',
        required: true,
        icon: 'psychology',
        color: 'text-purple-300',
        bgColor: 'bg-purple-500/10',
        borderColor: 'border-purple-500/40',
    },
    {
        id: 'set-and-setting',
        label: 'Set & Setting',
        description: 'Document environment, expectations, and the integration plan.',
        required: true,
        icon: 'home_health',
        color: 'text-emerald-300',
        bgColor: 'bg-emerald-500/10',
        borderColor: 'border-emerald-500/40',
    },
    {
        id: 'baseline-observations',
        label: 'Baseline Observations',
        description: 'Record pre-treatment clinical observations and vital notes.',
        required: false,
        icon: 'visibility',
        color: 'text-slate-300',
        bgColor: 'bg-slate-500/10',
        borderColor: 'border-slate-500/40',
    },
];

interface Phase1StepGuideProps {
    completedFormIds: Set<string>;
    onStartStep: (formId: WellnessFormId) => void;
}

export const Phase1StepGuide: React.FC<Phase1StepGuideProps> = ({
    completedFormIds,
    onStartStep,
}) => {
    const heroRef = useRef<HTMLDivElement>(null);

    const currentStepIndex = PHASE1_STEPS.findIndex(
        (step) => !completedFormIds.has(step.id)
    );
    const allComplete = currentStepIndex === -1;
    const currentStep = allComplete ? null : PHASE1_STEPS[currentStepIndex];
    const completedCount = completedFormIds.size;

    // Scroll the hero card into view whenever the step advances
    useEffect(() => {
        if (heroRef.current) {
            heroRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }, [currentStepIndex]);

    return (
        <div className="space-y-3">

            {/* ── HERO: Current Step ─────────────────────────────────────────── */}
            {!allComplete && currentStep && (
                <div
                    ref={heroRef}
                    className={`relative overflow-hidden rounded-2xl border ${currentStep.borderColor} ${currentStep.bgColor} backdrop-blur-xl shadow-2xl`}
                >
                    {/* Subtle ambient glow behind the card */}
                    <div className="absolute inset-0 opacity-20 pointer-events-none"
                        style={{ background: 'radial-gradient(ellipse at 30% 50%, rgba(59,130,246,0.3) 0%, transparent 70%)' }}
                    />

                    <div className="relative z-10 p-8">
                        <div className="flex flex-col sm:flex-row items-start sm:justify-between gap-5">
                            {/* Left: Step identity */}
                            <div className="flex-1">
                                {/* Step counter */}
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                                        Step {currentStepIndex + 1} of {PHASE1_STEPS.length}
                                    </span>
                                    {currentStep.required && (
                                        <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-widest bg-amber-500/15 border border-amber-500/25 text-amber-400 rounded-md">
                                            Required
                                        </span>
                                    )}
                                </div>

                                {/* Icon + Title */}
                                <div className="flex items-center gap-4 mb-3">
                                    <div className={`w-14 h-14 rounded-2xl ${currentStep.bgColor} border ${currentStep.borderColor} flex items-center justify-center flex-shrink-0`}>
                                        <span className={`material-symbols-outlined text-3xl ${currentStep.color}`}>
                                            {currentStep.icon}
                                        </span>
                                    </div>
                                    <h2 className={`text-2xl font-black ${currentStep.color} leading-tight`}>
                                        {currentStep.label}
                                    </h2>
                                </div>

                                {/* Description */}
                                <p className="text-slate-400 text-base leading-relaxed max-w-lg">
                                    {currentStep.description}
                                </p>
                            </div>

                            {/* Right: CTA — full-width on mobile, inline on sm+ */}
                            <div className="w-full sm:w-auto flex-shrink-0 flex flex-col items-stretch sm:items-center gap-2">
                                <button
                                    id={`phase1-step-${currentStepIndex + 1}-start`}
                                    onClick={() => onStartStep(currentStep.id)}
                                    aria-label={`Begin ${currentStep.label}`}
                                    className="flex items-center gap-3 px-8 py-4 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/50 hover:border-emerald-400/70 text-emerald-300 font-black text-base rounded-2xl transition-all active:scale-95 shadow-lg shadow-emerald-900/30 group"
                                >
                                    Begin
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                                <span className="text-xs text-slate-600 font-medium">
                                    Opens clinical form
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── All complete state ─────────────────────────────────────────── */}
            {allComplete && (
                <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/20 mb-4">
                        <CheckCircle className="w-8 h-8 text-emerald-400" />
                    </div>
                    <h2 className="text-2xl font-black text-emerald-300 mb-2">Phase 1 Complete</h2>
                    <p className="text-slate-400 text-base">All preparation steps are done. Advance to Phase 2: Treatment Session.</p>
                </div>
            )}

            {/* ── Step rail (progress context) ──────────────────────────────── */}
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {PHASE1_STEPS.map((step, index) => {
                    const isComplete = completedFormIds.has(step.id);
                    const isCurrent = index === currentStepIndex;
                    const isUpcoming = !isComplete && index > currentStepIndex;

                    return (
                        <button
                            key={step.id}
                            type="button"
                            onClick={() => onStartStep(step.id)}
                            aria-label={`${isComplete ? 'Amend' : 'Start'} ${step.label}`}
                            className={`relative flex flex-col items-center gap-2 p-3 rounded-xl border transition-all text-center group
                                ${isComplete
                                    ? 'bg-emerald-500/8 border-emerald-500/25 hover:bg-emerald-500/15 cursor-pointer'
                                    : isCurrent
                                        ? `${step.bgColor} ${step.borderColor} cursor-pointer`
                                        : 'bg-slate-900/40 border-slate-800/60 opacity-40 cursor-pointer hover:opacity-60'
                                }`}
                        >
                            {/* Status icon */}
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all
                                ${isComplete
                                    ? 'bg-emerald-500/20'
                                    : isCurrent
                                        ? `${step.bgColor} ring-2 ring-offset-1 ring-offset-slate-900`
                                        : 'bg-slate-800/60'
                                }`}
                            >
                                {isComplete ? (
                                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                                ) : (
                                    <span className={`material-symbols-outlined text-sm ${isCurrent ? step.color : 'text-slate-600'}`}>
                                        {step.icon}
                                    </span>
                                )}
                            </div>

                            {/* Label */}
                            <span className={`text-[11px] font-bold leading-tight
                                ${isComplete ? 'text-emerald-400' : isCurrent ? step.color : 'text-slate-600'}
                            `}>
                                {step.label}
                            </span>

                            {/* Amend hint on completed */}
                            {isComplete && (
                                <span className="text-[9px] font-semibold text-slate-600 uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                                    Amend
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* ── Progress bar ─────────────────────────────────────────────── */}
            <div className="flex items-center gap-3 px-1">
                <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 rounded-full transition-all duration-700"
                        style={{ width: `${(completedCount / PHASE1_STEPS.length) * 100}%` }}
                    />
                </div>
                <span className="text-xs font-bold text-slate-500 flex-shrink-0">
                    {completedCount}/{PHASE1_STEPS.length} complete
                </span>
            </div>
        </div>
    );
};
