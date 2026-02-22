import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, ChevronDown, ChevronUp, Edit3, CheckCircle2 } from 'lucide-react';
import type { WellnessFormId } from './WellnessFormRouter';
import { RiskEligibilityReport } from './RiskEligibilityReport';
import { runContraindicationEngine, type IntakeScreeningData } from '../../services/contraindicationEngine';

// ── PHASE 1 COLOR: INDIGO ─────────────────────────────────────────────────────
// Red = warnings/adverse events ONLY.

export interface Phase1Step {
    id: WellnessFormId;
    label: string;
    description: string;
    required: boolean;
    icon: string;
}

export const PHASE1_STEPS: Phase1Step[] = [
    {
        id: 'consent',
        label: 'Informed Consent',
        description: 'Document patient consent before any clinical activity begins.',
        required: true,
        icon: 'check_circle',
    },
    {
        id: 'structured-safety',
        label: 'Safety Screen & Eligibility',
        description: 'Screen for contraindications and treatment eligibility.',
        required: true,
        icon: 'shield',
    },
    {
        id: 'mental-health',
        label: 'Mental Health Screening',
        description: 'PHQ-9, GAD-7, and baseline psychological assessment.',
        required: true,
        icon: 'psychology',
    },
    {
        id: 'set-and-setting',
        label: 'Set & Setting',
        description: 'Treatment expectancy, clinical observations, and pre-session mindset.',
        required: true,
        icon: 'home_health',
    },
];

// ── EligibilityPanel ──────────────────────────────────────────────────────────
interface EligibilityPanelProps {
    steps: Phase1Step[];
    completedFormIds: Set<string>;
    onStartStep: (formId: WellnessFormId) => void;
    onCompletePhase?: () => void;
}

const EligibilityPanel: React.FC<EligibilityPanelProps> = ({
    steps,
    onStartStep,
    onCompletePhase,
}) => {
    const [reviewOpen, setReviewOpen] = useState(false);

    // Mock data for the engine — in production this comes from the saved DB records
    const mockIntakeData: IntakeScreeningData = {
        patientId: 'PT-RISK9W2P',
        sessionSubstance: 'Psilocybin',
        medications: ['Sertraline (tapering)', 'Lisinopril'], // Relative: SSRI
        psychiatricHistory: ['Anxiety', 'Depression'],
        familyHistory: [],
        cssrsScore: 0,
        lastSystolicBP: 125,
        isPregnant: false,
        ageYears: 34,
        phq9Score: 22,
        gad7Score: 18,
        pcl5Score: 35,
        bmi: 24.5
    };

    const result = runContraindicationEngine(mockIntakeData);

    return (
        <div className="space-y-4">
            <RiskEligibilityReport
                result={result}
                onOverrideConfirmed={(justification) => console.log('Override saved:', justification)}
                onExportPDF={() => console.log('Exporting PDF...')}
                onProceedToPhase2={onCompletePhase}
            />

            <div className="rounded-2xl bg-slate-800/30 overflow-hidden">
                <button
                    onClick={() => setReviewOpen(o => !o)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-800/50 transition-colors"
                    aria-expanded={reviewOpen}
                    aria-controls="phase1-review-panel"
                >
                    <span className="text-sm font-bold text-slate-400">
                        Review completed steps ({steps.length}/{steps.length})
                    </span>
                    {reviewOpen
                        ? <ChevronUp className="w-4 h-4 text-slate-500 flex-shrink-0" />
                        : <ChevronDown className="w-4 h-4 text-slate-500 flex-shrink-0" />}
                </button>

                {reviewOpen && (
                    <div id="phase1-review-panel" className="divide-y divide-slate-700/30">
                        {steps.map((step) => (
                            <div key={step.id} className="flex items-center gap-4 px-5 py-3.5">
                                <CheckCircle2 className="w-4 h-4 text-teal-400 flex-shrink-0" aria-hidden="true" />
                                <p className="text-sm font-semibold text-slate-300 flex-1 truncate">{step.label}</p>
                                <button
                                    onClick={() => onStartStep(step.id)}
                                    className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold text-slate-500 hover:text-slate-300 transition-all"
                                    aria-label={`Amend ${step.label}`}
                                >
                                    <Edit3 className="w-3.5 h-3.5" aria-hidden="true" />
                                    Amend
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

// ── Phase1StepGuide ───────────────────────────────────────────────────────────
interface Phase1StepGuideProps {
    completedFormIds: Set<string>;
    onStartStep: (formId: WellnessFormId) => void;
    onCompletePhase?: () => void;
}

export const Phase1StepGuide: React.FC<Phase1StepGuideProps> = ({
    completedFormIds,
    onStartStep,
    onCompletePhase,
}) => {
    const heroRef = useRef<HTMLDivElement>(null);

    const currentStepIndex = PHASE1_STEPS.findIndex(
        (step) => !completedFormIds.has(step.id)
    );
    const allComplete = currentStepIndex === -1;
    const completedCount = completedFormIds.size;

    useEffect(() => {
        if (heroRef.current) {
            heroRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }, [currentStepIndex]);

    return (
        <div className="space-y-4">

            {/* ── Phase sub-header ──────────────────────────────────────────── */}
            <div className="flex items-center justify-between px-1">
                {/* Section label using site-standard ppn-label class */}
                <h2 className="ppn-label" style={{ color: '#818CF8' }}>
                    Preparation · 4 Steps
                </h2>
                <div className="flex items-center gap-3">
                    <div className="w-28 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-indigo-700 to-indigo-400 rounded-full transition-all duration-700"
                            style={{ width: `${(completedCount / PHASE1_STEPS.length) * 100}%` }}
                            role="progressbar"
                            aria-valuenow={completedCount}
                            aria-valuemax={PHASE1_STEPS.length}
                            aria-label="Preparation progress"
                        />
                    </div>
                    <span className="text-sm font-semibold text-slate-400">
                        {completedCount}/{PHASE1_STEPS.length}
                    </span>
                </div>
            </div>

            {/* ── 4-Step card grid ──────────────────────────────────────────────
                Font sizing follows site standard:
                  Step label (H3-equiv): text-sm font-bold uppercase  — 14px
                  Card title:            text-base font-black          — 16px
                  Description:           text-sm                       — 14px
                  Button text:           text-sm font-semibold+        — 14px
                  Badge / metadata:      text-xs                       — 12px (acceptable for tags)

                Design: no individual card borders — background fills only.
                Active = indigo fill · Completed = teal tint · Upcoming = slate/dimmed
            ──────────────────────────────────────────────────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                {PHASE1_STEPS.map((step, index) => {
                    const isComplete = completedFormIds.has(step.id);
                    const isCurrent = index === currentStepIndex;

                    return (
                        <div
                            key={step.id}
                            ref={isCurrent ? heroRef : undefined}
                            className={[
                                'relative flex flex-col rounded-xl transition-all duration-300 overflow-hidden',
                                isComplete
                                    ? 'bg-teal-900/20'
                                    : isCurrent
                                        ? 'bg-indigo-900/50 shadow-lg shadow-indigo-950/60'
                                        : 'bg-slate-800/20 hover:bg-slate-800/35',
                            ].join(' ')}
                        >
                            {/* Top accent stripe */}
                            <div className={[
                                'h-0.5 w-full',
                                isComplete ? 'bg-teal-600/60' : isCurrent ? 'bg-indigo-400' : 'bg-slate-700/40',
                            ].join(' ')} aria-hidden="true" />

                            <div className="flex flex-col flex-1 p-4 gap-3">

                                {/* Step number label (H3-equiv) + status badge */}
                                <div className="flex items-center justify-between gap-1">
                                    <span className={`text-xs font-bold uppercase tracking-widest ${isComplete ? 'text-teal-500' : isCurrent ? 'text-indigo-400' : 'text-slate-500'
                                        }`}>
                                        Step {index + 1}
                                    </span>
                                    {isComplete ? (
                                        <CheckCircle2 className="w-4 h-4 text-teal-400 flex-shrink-0" aria-label="Complete" />
                                    ) : step.required ? (
                                        <span className="text-xs font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-700/50 text-slate-400">
                                            Req
                                        </span>
                                    ) : null}
                                </div>

                                {/* Icon + title — primary content */}
                                <div className="flex items-start gap-2.5">
                                    <div className={[
                                        'w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5',
                                        isComplete ? 'bg-teal-500/15' : isCurrent ? 'bg-indigo-500/25' : 'bg-slate-700/30',
                                    ].join(' ')}>
                                        <span className={`material-symbols-outlined text-[18px] ${isComplete ? 'text-teal-400' : isCurrent ? 'text-indigo-300' : 'text-slate-500'
                                            }`}>
                                            {step.icon}
                                        </span>
                                    </div>
                                    {/* H3: card title — minimum text-sm */}
                                    <h4 className={`text-sm font-black leading-snug pt-1 ${isComplete ? 'text-teal-200' : isCurrent ? 'text-slate-100' : 'text-slate-400'
                                        }`}>
                                        {step.label}
                                    </h4>
                                </div>

                                {/* Description — only on the active step for space; text-sm */}
                                {isCurrent && (
                                    <p className="text-sm leading-relaxed text-indigo-300/70">
                                        {step.description}
                                    </p>
                                )}

                                {/* CTA buttons — text-sm minimum */}
                                <div className="mt-auto pt-2">
                                    {isComplete ? (
                                        <button
                                            onClick={() => onStartStep(step.id)}
                                            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-slate-500 hover:text-teal-400 transition-all"
                                            aria-label={`Amend ${step.label}`}
                                        >
                                            <Edit3 className="w-3.5 h-3.5" aria-hidden="true" />
                                            Amend
                                        </button>
                                    ) : isCurrent ? (
                                        <button
                                            id={`phase1-step-${index + 1}-start`}
                                            onClick={() => onStartStep(step.id)}
                                            aria-label={`Continue to ${step.label}`}
                                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600/40 hover:bg-indigo-600/60 text-indigo-100 font-black text-sm rounded-xl transition-all active:scale-95 shadow-md shadow-indigo-950/50 group"
                                        >
                                            Continue
                                            <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" aria-hidden="true" />
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => onStartStep(step.id)}
                                            aria-label={`Open ${step.label}`}
                                            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-slate-700/50 bg-slate-800/30 text-sm font-semibold text-slate-500 hover:text-slate-300 hover:bg-slate-700/40 hover:border-slate-600/50 transition-all"
                                        >
                                            Open
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* ── All complete state */}
            {allComplete && (
                <EligibilityPanel
                    steps={PHASE1_STEPS}
                    completedFormIds={completedFormIds}
                    onStartStep={onStartStep}
                    onCompletePhase={onCompletePhase}
                />
            )}
        </div>
    );
};
