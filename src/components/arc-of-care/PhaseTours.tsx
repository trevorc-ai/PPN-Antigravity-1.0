import React, { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft, Compass } from 'lucide-react';

interface TourStep {
    title: string;
    description: string;
    detail?: string;
    selector?: string;
}

interface PhaseTourProps {
    phase: 1 | 2 | 3;
    steps: TourStep[];
    phaseColor: 'emerald' | 'amber' | 'blue';
    onClose: () => void;
    storageKey: string;
}

const COLOR_MAP = {
    emerald: {
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/30',
        text: 'text-emerald-400',
        dot: 'bg-emerald-500',
        btn: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/30',
    },
    amber: {
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/30',
        text: 'text-amber-400',
        dot: 'bg-amber-500',
        btn: 'bg-amber-500/20 border-amber-500/40 text-amber-400 hover:bg-amber-500/30',
    },
    blue: {
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/30',
        text: 'text-blue-400',
        dot: 'bg-blue-500',
        btn: 'bg-blue-500/20 border-blue-500/40 text-blue-400 hover:bg-blue-500/30',
    },
};

const PhaseTour: React.FC<PhaseTourProps> = ({ phase, steps, phaseColor, onClose, storageKey }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [dontShowAgain, setDontShowAgain] = useState(false);
    const colors = COLOR_MAP[phaseColor];
    const step = steps[currentStep];
    const isLast = currentStep === steps.length - 1;

    const handleClose = () => {
        if (dontShowAgain) {
            localStorage.setItem(storageKey, 'seen');
        }
        onClose();
    };

    const handleNext = () => {
        if (isLast) {
            handleClose();
        } else {
            setCurrentStep((s) => s + 1);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-label={`Phase ${phase} Guided Tour`}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />

            {/* Modal */}
            <div className={`relative w-full max-w-md bg-slate-900 border ${colors.border} rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200`}>
                {/* Header */}
                <div className={`flex items-center justify-between px-6 py-4 ${colors.bg} border-b ${colors.border}`}>
                    <div className="flex items-center gap-2">
                        <Compass className={`w-5 h-5 ${colors.text}`} />
                        <span className={`text-sm font-black uppercase tracking-widest ${colors.text}`}>
                            Phase {phase} Tour — Step {currentStep + 1}/{steps.length}
                        </span>
                    </div>
                    <button
                        onClick={handleClose}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-800/50 hover:bg-slate-700/50 transition-colors"
                        aria-label="Close tour"
                    >
                        <X className="w-4 h-4 text-slate-400" />
                    </button>
                </div>

                {/* Progress dots */}
                <div className="flex items-center gap-1.5 px-6 pt-4">
                    {steps.map((_, i) => (
                        <div
                            key={i}
                            className={`h-1.5 rounded-full transition-all ${i === currentStep ? `w-6 ${colors.dot}` : i < currentStep ? `w-3 ${colors.dot} opacity-50` : 'w-3 bg-slate-700'
                                }`}
                        />
                    ))}
                </div>

                {/* Content */}
                <div className="px-6 py-5 space-y-3 animate-in fade-in duration-200">
                    <h3 className="text-lg font-black text-slate-200">{step.title}</h3>
                    <p className="text-sm text-slate-300 leading-relaxed">{step.description}</p>
                    {step.detail && (
                        <div className={`p-3 rounded-xl ${colors.bg} border ${colors.border}`}>
                            <p className="text-xs text-slate-400 leading-relaxed">{step.detail}</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 pb-5 space-y-3">
                    <div className="flex items-center gap-3">
                        {currentStep > 0 && (
                            <button
                                onClick={() => setCurrentStep((s) => s - 1)}
                                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-700 text-slate-400 text-sm font-bold hover:border-slate-600 transition-all"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                Back
                            </button>
                        )}
                        <button
                            onClick={handleNext}
                            className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl border text-sm font-black uppercase tracking-widest transition-all ml-auto ${colors.btn}`}
                        >
                            {isLast ? 'Got it!' : 'Next'}
                            {!isLast && <ChevronRight className="w-4 h-4" />}
                        </button>
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={dontShowAgain}
                            onChange={(e) => setDontShowAgain(e.target.checked)}
                            className="w-4 h-4 rounded accent-slate-500"
                        />
                        <span className="text-xs text-slate-500">Don't show again</span>
                    </label>
                </div>
            </div>
        </div>
    );
};

// ─── Phase 1 Tour ────────────────────────────────────────────────────────────

const PHASE1_STEPS: TourStep[] = [
    {
        title: 'Baseline Metrics Dashboard',
        description: 'These scores show how your patient is feeling right now, before treatment starts. We use these numbers to predict how much support they\'ll need after the session.',
        detail: 'PHQ-9 measures depression (0–27). GAD-7 measures anxiety (0–21). ACE Score counts childhood experiences. Higher scores mean more support is needed.',
    },
    {
        title: 'Algorithm Predictions',
        description: 'Our system looks at the baseline scores and predicts how much help your patient will need. This helps you plan ahead before the session happens.',
    },
    {
        title: 'Risk Flags & Safety Warnings',
        description: 'These warnings tell you if it may be unsafe to proceed with treatment right now. Always review these carefully before the session.',
    },
    {
        title: 'Schedule Integration Sessions',
        description: 'Use the predictions to schedule follow-up appointments now, before the session happens. This makes sure your patient gets the help they need afterward.',
    },
    {
        title: 'Complete Phase 1',
        description: 'When you\'ve reviewed all the baseline scores and scheduled the follow-up sessions, mark Phase 1 complete. This unlocks Phase 2: Dosing Session.',
    },
];

export const Phase1Tour: React.FC<{ onClose: () => void }> = ({ onClose }) => (
    <PhaseTour
        phase={1}
        steps={PHASE1_STEPS}
        phaseColor="emerald"
        onClose={onClose}
        storageKey="ppn_phase1_tour_seen"
    />
);

// ─── Phase 2 Tour ────────────────────────────────────────────────────────────

const PHASE2_STEPS: TourStep[] = [
    {
        title: 'Start Session',
        description: 'Click this button when the patient takes the medicine. It starts a timer and begins tracking their heart rate and blood pressure automatically.',
    },
    {
        title: 'Real-Time Vitals Dashboard',
        description: 'This shows the patient\'s heart rate, blood pressure, and oxygen levels in real-time. If their Apple Watch is connected, it updates automatically every 30 seconds.',
    },
    {
        title: 'Log Safety Events',
        description: 'Click this button if something important happens during the session. Examples: patient feels nauseous, starts crying, or has a breakthrough moment.',
    },
    {
        title: 'Rescue Protocol Checklist',
        description: 'If the patient is having a difficult reaction (panic, scary visions), use this checklist. It tells you exactly what to do step-by-step to help them feel safe.',
    },
    {
        title: 'Post-Session Assessments',
        description: 'After the medicine wears off, ask the patient to fill out these quick tests. They measure how intense the experience was and if they felt connected to something bigger.',
    },
    {
        title: 'End Session',
        description: 'Click this button when the patient is back to normal and ready to go home. This saves all the data and unlocks Phase 3: Integration Tracking.',
    },
];

export const Phase2Tour: React.FC<{ onClose: () => void }> = ({ onClose }) => (
    <PhaseTour
        phase={2}
        steps={PHASE2_STEPS}
        phaseColor="amber"
        onClose={onClose}
        storageKey="ppn_phase2_tour_seen"
    />
);

// ─── Phase 3 Tour ────────────────────────────────────────────────────────────

const PHASE3_STEPS: TourStep[] = [
    {
        title: 'Symptom Decay Curve',
        description: 'This chart shows if the patient\'s depression is getting better over time. The line should go down if the treatment is working.',
    },
    {
        title: 'Compliance Tracking',
        description: 'This shows if the patient is doing their homework (therapy sessions, daily check-ins, lifestyle changes). Green means they\'re doing great, red means they need a reminder.',
    },
    {
        title: 'Red Alerts & Intervention Triggers',
        description: 'These are warnings that need your attention right away. Example: patient says they\'re thinking about hurting themselves. Call them immediately.',
    },
    {
        title: 'Automated Check-In Schedule',
        description: 'The system automatically sends messages to the patient asking how they\'re doing. You can see their responses here and know when to reach out.',
    },
    {
        title: 'Export Report',
        description: 'Click this button to create a report with all the patient\'s data. You can send this to insurance companies to prove the treatment is working and get reimbursed.',
    },
];

export const Phase3Tour: React.FC<{ onClose: () => void }> = ({ onClose }) => (
    <PhaseTour
        phase={3}
        steps={PHASE3_STEPS}
        phaseColor="blue"
        onClose={onClose}
        storageKey="ppn_phase3_tour_seen"
    />
);

// ─── Compass Icon Button ──────────────────────────────────────────────────────

interface CompassTourButtonProps {
    phase: 1 | 2 | 3;
    onClick: () => void;
}

export const CompassTourButton: React.FC<CompassTourButtonProps> = ({ phase, onClick }) => {
    const colorMap = {
        1: 'bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/30 hover:border-emerald-500/50 text-emerald-400',
        2: 'bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/30 hover:border-amber-500/50 text-amber-400',
        3: 'bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/30 hover:border-blue-500/50 text-blue-400',
    };

    return (
        <button
            onClick={onClick}
            className={`p-2 border rounded-lg transition-all group ${colorMap[phase]}`}
            aria-label={`Take guided tour of Phase ${phase}`}
            title={`Phase ${phase} Guided Tour`}
        >
            <Compass className="w-5 h-5 group-hover:rotate-12 transition-transform duration-200" />
        </button>
    );
};

// ─── Auto-trigger hook ────────────────────────────────────────────────────────

export function usePhaseTourAutoTrigger(completedPhases: number[]) {
    const [showPhase1, setShowPhase1] = useState(false);
    const [showPhase2, setShowPhase2] = useState(false);
    const [showPhase3, setShowPhase3] = useState(false);

    useEffect(() => {
        if (!localStorage.getItem('ppn_phase1_tour_seen')) {
            setShowPhase1(true);
        }
    }, []);

    useEffect(() => {
        if (completedPhases.includes(1) && !localStorage.getItem('ppn_phase2_tour_seen')) {
            setShowPhase2(true);
        }
    }, [completedPhases]);

    useEffect(() => {
        if (completedPhases.includes(2) && !localStorage.getItem('ppn_phase3_tour_seen')) {
            setShowPhase3(true);
        }
    }, [completedPhases]);

    return {
        showPhase1, setShowPhase1,
        showPhase2, setShowPhase2,
        showPhase3, setShowPhase3,
    };
}
