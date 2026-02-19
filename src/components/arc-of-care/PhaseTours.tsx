/**
 * PhaseTours.tsx — Driver.js-style Element-Spotlight Tour
 *
 * DESIGNER SPEC (WO-111 / WO-066):
 * - Each step highlights the *specific element* it describes using a box-shadow
 *   "cutout" technique: the target element itself gets position:relative + a high
 *   z-index so it punches through the dark overlay.
 * - A pulsing glow ring draws the eye to the highlighted element.
 * - The popover card anchors near the target (4-direction, collision-detected).
 * - Falls back to a centered modal on mobile or when element not found.
 * - Smooth scroll brings off-screen targets into view before highlighting.
 * - Zero new dependencies — all vanilla React.
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { X, ChevronRight, ChevronLeft, Compass } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface TourStep {
    title: string;
    description: string;
    detail?: string;
    /** CSS selector for the element to spotlight. Omit for intro/outro slides. */
    selector?: string;
    /** Preferred popover side. Auto-detected if omitted. */
    preferredPosition?: 'top' | 'bottom' | 'left' | 'right';
}

interface PhaseTourProps {
    phase: 1 | 2 | 3;
    steps: TourStep[];
    phaseColor: 'emerald' | 'amber' | 'blue';
    onClose: () => void;
    storageKey: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const CARD_W = 340;
const CARD_H = 220; // approximate, used for collision detection
const GAP = 16;     // gap between element edge and popover card
const PAD = 10;     // padding around the spotlight cutout

const COLOR_MAP = {
    emerald: {
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/40',
        borderHex: 'rgba(16,185,129,0.6)',
        glowHex: 'rgba(16,185,129,0.35)',
        text: 'text-emerald-400',
        dot: 'bg-emerald-500',
        btn: 'bg-emerald-600 hover:bg-emerald-500 text-white border-transparent',
        badge: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    },
    amber: {
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/40',
        borderHex: 'rgba(245,158,11,0.6)',
        glowHex: 'rgba(245,158,11,0.35)',
        text: 'text-amber-400',
        dot: 'bg-amber-500',
        btn: 'bg-amber-600 hover:bg-amber-500 text-white border-transparent',
        badge: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
    },
    blue: {
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/40',
        borderHex: 'rgba(59,130,246,0.6)',
        glowHex: 'rgba(59,130,246,0.35)',
        text: 'text-blue-400',
        dot: 'bg-blue-500',
        btn: 'bg-blue-600 hover:bg-blue-500 text-white border-transparent',
        badge: 'bg-blue-500/15 text-blue-400 border border-blue-500/30',
    },
};

// ─── Popover positioning ──────────────────────────────────────────────────────

interface PopoverPosition {
    top: number;
    left: number;
    arrowDir: 'up' | 'down' | 'left' | 'right' | null;
}

function computePopoverPosition(
    rect: DOMRect,
    preferred: 'top' | 'bottom' | 'left' | 'right' = 'bottom'
): PopoverPosition {
    const { innerWidth: vw, innerHeight: vh } = window;

    const fits = {
        bottom: rect.bottom + GAP + CARD_H < vh,
        top: rect.top - GAP - CARD_H > 0,
        right: rect.right + GAP + CARD_W < vw,
        left: rect.left - GAP - CARD_W > 0,
    };

    // Pick the preferred side if it fits, otherwise fall back
    const order: Array<'bottom' | 'top' | 'right' | 'left'> = [
        preferred,
        'bottom',
        'top',
        'right',
        'left',
    ];
    const side = order.find((s) => fits[s]) ?? 'bottom';

    let top = 0;
    let left = 0;

    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    switch (side) {
        case 'bottom':
            top = rect.bottom + GAP;
            left = cx - CARD_W / 2;
            break;
        case 'top':
            top = rect.top - GAP - CARD_H;
            left = cx - CARD_W / 2;
            break;
        case 'right':
            top = cy - CARD_H / 2;
            left = rect.right + GAP;
            break;
        case 'left':
            top = cy - CARD_H / 2;
            left = rect.left - GAP - CARD_W;
            break;
    }

    // Clamp to viewport
    left = Math.max(10, Math.min(left, vw - CARD_W - 10));
    top = Math.max(80, Math.min(top, vh - CARD_H - 10));

    const arrowDir: PopoverPosition['arrowDir'] =
        side === 'bottom' ? 'up'
            : side === 'top' ? 'down'
                : side === 'right' ? 'left'
                    : 'right';

    return { top, left, arrowDir };
}

// ─── Main Component ───────────────────────────────────────────────────────────

const PhaseTour: React.FC<PhaseTourProps> = ({
    phase,
    steps,
    phaseColor,
    onClose,
    storageKey,
}) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [dontShowAgain, setDontShowAgain] = useState(false);
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
    const [popoverPos, setPopoverPos] = useState<PopoverPosition | null>(null);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const colors = COLOR_MAP[phaseColor];
    const step = steps[currentStep];
    const isLast = currentStep === steps.length - 1;
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

    // ── Dismiss ──────────────────────────────────────────────────────────────────
    const handleClose = useCallback(() => {
        if (dontShowAgain) {
            localStorage.setItem(storageKey, 'seen');
        }
        onClose();
    }, [dontShowAgain, onClose, storageKey]);

    // ── Spotlight logic ───────────────────────────────────────────────────────────
    const positionOnElement = useCallback(
        (el: Element) => {
            const rect = el.getBoundingClientRect();
            setTargetRect(rect);
            if (!isMobile) {
                setPopoverPos(
                    computePopoverPosition(rect, step.preferredPosition ?? 'bottom')
                );
            }
        },
        [step.preferredPosition, isMobile]
    );

    const findAndPosition = useCallback(() => {
        if (!step.selector) {
            // Intro/outro slide — no spotlight
            setTargetRect(null);
            setPopoverPos(null);
            return;
        }

        const el = document.querySelector(step.selector);
        if (!el) {
            setTargetRect(null);
            setPopoverPos(null);
            return;
        }

        const rect = el.getBoundingClientRect();
        const inView =
            rect.top >= 60 &&
            rect.left >= 0 &&
            rect.bottom <= window.innerHeight &&
            rect.right <= window.innerWidth;

        if (!inView) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setTimeout(() => positionOnElement(el), 400);
        } else {
            positionOnElement(el);
        }
    }, [step.selector, positionOnElement]);

    // Re-position on step change and on resize/scroll
    useEffect(() => {
        findAndPosition();
    }, [currentStep, findAndPosition]);

    useEffect(() => {
        const update = () => findAndPosition();
        window.addEventListener('resize', update);
        window.addEventListener('scroll', update, true);
        return () => {
            window.removeEventListener('resize', update);
            window.removeEventListener('scroll', update, true);
        };
    }, [findAndPosition]);

    // ── Keyboard ──────────────────────────────────────────────────────────────────
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') handleClose();
            if (e.key === 'ArrowRight' && !isLast) goNext();
            if (e.key === 'ArrowLeft' && currentStep > 0) goPrev();
        };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [handleClose, currentStep, isLast]);

    // ── Navigation ────────────────────────────────────────────────────────────────
    const transition = (fn: () => void) => {
        setIsTransitioning(true);
        setTimeout(() => {
            fn();
            setIsTransitioning(false);
        }, 150);
    };

    const goNext = () => {
        if (isLast) { handleClose(); return; }
        transition(() => setCurrentStep((s) => s + 1));
    };

    const goPrev = () => {
        if (currentStep === 0) return;
        transition(() => setCurrentStep((s) => s - 1));
    };

    // ─── Spotlight overlay ───────────────────────────────────────────────────────
    // We use the "large box-shadow" technique: a single <div> that sits exactly
    // over the target element. Its box-shadow extends 9999px in every direction
    // with rgba(0,0,0,0.72), creating a "dark world except this cutout" effect.
    // A second box-shadow provides the animated glow ring.

    const spotlightRef = useRef<HTMLDivElement>(null);

    const spotlightStyle: React.CSSProperties | undefined =
        targetRect && !isMobile
            ? {
                position: 'fixed',
                top: targetRect.top - PAD,
                left: targetRect.left - PAD,
                width: targetRect.width + PAD * 2,
                height: targetRect.height + PAD * 2,
                borderRadius: 12,
                boxShadow: [
                    // The mask — lighter so page context remains visible
                    `0 0 0 9999px rgba(0,0,0,0.45)`,
                    // Bright blue border ring
                    `0 0 0 3px rgba(59,130,246,0.95)`,
                    // Tight outer glow
                    `0 0 0 5px rgba(59,130,246,0.25)`,
                    // Diffuse glow
                    `0 0 20px 6px rgba(59,130,246,0.15)`,
                ].join(', '),
                zIndex: 9990,
                pointerEvents: 'none',
                transition: 'top 0.3s ease, left 0.3s ease, width 0.3s ease, height 0.3s ease',
            }
            : undefined;

    // ─── Popover card style ───────────────────────────────────────────────────────
    const cardStyle: React.CSSProperties =
        popoverPos && !isMobile
            ? {
                position: 'fixed',
                top: popoverPos.top,
                left: popoverPos.left,
                width: CARD_W,
                zIndex: 10000,
            }
            : {
                // Mobile: fixed bottom
                position: 'fixed',
                bottom: 16,
                left: 16,
                right: 16,
                zIndex: 10000,
            };

    // ─── Render ───────────────────────────────────────────────────────────────────

    return (
        <>
            {/* ── Global backdrop (only when no spotlight target) ── */}
            {(!targetRect || isMobile) && (
                <div
                    className="fixed inset-0 bg-black/65 backdrop-blur-[2px]"
                    style={{ zIndex: 9989 }}
                    onClick={handleClose}
                    aria-hidden="true"
                />
            )}

            {/* ── Spotlight cutout ── */}
            {spotlightStyle && (
                <div
                    ref={spotlightRef}
                    style={spotlightStyle}
                    aria-hidden="true"
                    className="animate-spotlight-in"
                />
            )}

            {/* ── Popover card ── */}
            <div
                role="dialog"
                aria-modal="true"
                aria-label={`Phase ${phase} guided tour, step ${currentStep + 1} of ${steps.length}`}
                aria-live="polite"
                style={cardStyle}
                className={`
          bg-[#0b1120] border ${colors.border} rounded-2xl shadow-2xl
          transition-opacity duration-150
          ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}
        `}
            >
                {/* Arrow connector (desktop only) */}
                {popoverPos?.arrowDir && !isMobile && (
                    <Arrow dir={popoverPos.arrowDir} color={colors.borderHex} />
                )}

                {/* ── Header ── */}
                <div className={`flex items-center justify-between px-5 pt-4 pb-3 border-b ${colors.border}`}>
                    <div className="flex items-center gap-2">
                        <Compass className={`w-4 h-4 ${colors.text} flex-shrink-0`} />
                        <span className={`text-xs font-black uppercase tracking-widest ${colors.text}`}>
                            Phase {phase} Tour — Step {currentStep + 1}/{steps.length}
                        </span>
                    </div>
                    <button
                        onClick={handleClose}
                        className="ml-2 w-7 h-7 flex items-center justify-center rounded-full bg-slate-800/60 hover:bg-slate-700/60 transition-colors flex-shrink-0"
                        aria-label="Close tour"
                    >
                        <X className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                </div>

                {/* ── Progress bar ── */}
                <div className="flex items-center gap-1 px-5 pt-3">
                    {steps.map((_, i) => (
                        <div
                            key={i}
                            className={`h-1 rounded-full transition-all duration-300 ${i === currentStep
                                ? `w-6 ${colors.dot}`
                                : i < currentStep
                                    ? `w-3 ${colors.dot} opacity-40`
                                    : 'w-1.5 bg-slate-700'
                                }`}
                            aria-hidden="true"
                        />
                    ))}
                </div>

                {/* ── Content ── */}
                <div
                    className={`px-5 py-4 space-y-3 transition-opacity duration-150 ${isTransitioning ? 'opacity-0' : 'opacity-100'
                        }`}
                >
                    <h3 className="text-base font-black text-slate-200 leading-snug">
                        {step.title}
                    </h3>
                    <p className="text-sm text-slate-400 leading-relaxed">
                        {step.description}
                    </p>
                    {step.detail && (
                        <div className={`p-3 rounded-xl ${colors.bg} border ${colors.border}`}>
                            <p className="text-xs text-slate-400 leading-relaxed">{step.detail}</p>
                        </div>
                    )}
                </div>

                {/* ── Footer ── */}
                <div className="px-5 pb-4 space-y-3">
                    <div className="flex items-center gap-2">
                        {currentStep > 0 && (
                            <button
                                onClick={goPrev}
                                className="flex items-center gap-1 px-3 py-2 rounded-xl border border-slate-700 text-slate-400 text-xs font-bold hover:border-slate-600 hover:text-slate-300 transition-all"
                                aria-label="Previous step"
                            >
                                <ChevronLeft className="w-3.5 h-3.5" />
                                Back
                            </button>
                        )}
                        <button
                            onClick={goNext}
                            className={`flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ml-auto shadow-lg active:scale-95 ${colors.btn}`}
                            aria-label={isLast ? 'Finish tour' : 'Next step'}
                        >
                            {isLast ? 'Got it!' : 'Next'}
                            {!isLast && <ChevronRight className="w-3.5 h-3.5" />}
                        </button>
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            checked={dontShowAgain}
                            onChange={(e) => setDontShowAgain(e.target.checked)}
                            className="w-3.5 h-3.5 rounded accent-slate-500"
                        />
                        <span className="text-xs text-slate-600">Don't show again</span>
                    </label>
                </div>
            </div>
        </>
    );
};

// ─── Arrow connector ──────────────────────────────────────────────────────────
// A small triangle that visually connects the popover card to the target element.

const Arrow: React.FC<{ dir: 'up' | 'down' | 'left' | 'right'; color: string }> = ({
    dir,
    color,
}) => {
    const sizeBase = 8;

    const style: React.CSSProperties = {
        position: 'absolute',
        width: 0,
        height: 0,
        border: `${sizeBase}px solid transparent`,
        pointerEvents: 'none',
    };

    switch (dir) {
        case 'up':
            return (
                <div
                    style={{
                        ...style,
                        top: -sizeBase * 2,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        borderBottomColor: color,
                    }}
                    aria-hidden="true"
                />
            );
        case 'down':
            return (
                <div
                    style={{
                        ...style,
                        bottom: -sizeBase * 2,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        borderTopColor: color,
                    }}
                    aria-hidden="true"
                />
            );
        case 'left':
            return (
                <div
                    style={{
                        ...style,
                        left: -sizeBase * 2,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        borderRightColor: color,
                    }}
                    aria-hidden="true"
                />
            );
        case 'right':
            return (
                <div
                    style={{
                        ...style,
                        right: -sizeBase * 2,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        borderLeftColor: color,
                    }}
                    aria-hidden="true"
                />
            );
    }
};

// ─── Phase 1 Tour ─────────────────────────────────────────────────────────────

const PHASE1_STEPS: TourStep[] = [
    {
        title: 'Baseline Metrics Dashboard',
        description:
            'These scores show how your patient is feeling right now, before treatment starts. We use these numbers to predict how much support they\'ll need after the session.',
        detail:
            'PHQ-9 measures depression (0–27). GAD-7 measures anxiety (0–21). ACE Score counts childhood experiences. Higher scores mean more support is needed.',
        selector: '[data-tour="baseline-metrics"]',
        preferredPosition: 'bottom',
    },
    {
        title: 'Algorithm Predictions',
        description:
            'Our system looks at the baseline scores and predicts how much help your patient will need. This helps you plan ahead before the session happens.',
        selector: '[data-tour="algorithm-predictions"]',
        preferredPosition: 'right',
    },
    {
        title: 'Risk Flags & Safety Warnings',
        description:
            'These warnings tell you if it may be unsafe to proceed with treatment right now. Always review these carefully before the session.',
        selector: '[data-tour="risk-flags"]',
        preferredPosition: 'bottom',
    },
    {
        title: 'Schedule Integration Sessions',
        description:
            'Use the predictions to schedule follow-up appointments now, before the session happens. This makes sure your patient gets the help they need afterward.',
        selector: '[data-tour="schedule-integration"]',
        preferredPosition: 'right',
    },
    {
        title: 'Complete Phase 1',
        description:
            'When you\'ve reviewed all the baseline scores and scheduled the follow-up sessions, mark Phase 1 complete. This unlocks Phase 2: Dosing Session.',
        selector: '[data-tour="complete-phase-1"]',
        preferredPosition: 'top',
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

// ─── Phase 2 Tour ─────────────────────────────────────────────────────────────

const PHASE2_STEPS: TourStep[] = [
    {
        title: 'Start Session',
        description:
            'Click this button when the patient takes the medicine. It starts a timer and begins tracking their heart rate and blood pressure automatically.',
        selector: '[data-tour="start-session"]',
        preferredPosition: 'bottom',
    },
    {
        title: 'Real-Time Vitals Dashboard',
        description:
            'This shows the patient\'s heart rate, blood pressure, and oxygen levels in real-time. If their Apple Watch is connected, it updates automatically every 30 seconds.',
        selector: '[data-tour="vitals-dashboard"]',
        preferredPosition: 'right',
    },
    {
        title: 'Log Safety Events',
        description:
            'Click this button if something important happens during the session. Examples: patient feels nauseous, starts crying, or has a breakthrough moment.',
        selector: '[data-tour="log-safety-events"]',
        preferredPosition: 'bottom',
    },
    {
        title: 'Rescue Protocol Checklist',
        description:
            'If the patient is having a difficult reaction (panic, scary visions), use this checklist. It tells you exactly what to do step-by-step to help them feel safe.',
        selector: '[data-tour="rescue-protocol"]',
        preferredPosition: 'right',
    },
    {
        title: 'Post-Session Assessments',
        description:
            'After the medicine wears off, ask the patient to fill out these quick tests. They measure how intense the experience was and if they felt connected to something bigger.',
        selector: '[data-tour="post-session-assessments"]',
        preferredPosition: 'bottom',
    },
    {
        title: 'End Session',
        description:
            'Click this button when the patient is back to normal and ready to go home. This saves all the data and unlocks Phase 3: Integration Tracking.',
        selector: '[data-tour="end-session"]',
        preferredPosition: 'top',
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

// ─── Phase 3 Tour ─────────────────────────────────────────────────────────────

const PHASE3_STEPS: TourStep[] = [
    {
        title: 'Symptom Decay Curve',
        description:
            'This chart shows if the patient\'s depression is getting better over time. The line should go down if the treatment is working.',
        selector: '[data-tour="symptom-decay-curve"]',
        preferredPosition: 'bottom',
    },
    {
        title: 'Compliance Tracking',
        description:
            'This shows if the patient is doing their homework (therapy sessions, daily check-ins, lifestyle changes). Green means they\'re doing great, yellow means they need a reminder.',
        selector: '[data-tour="compliance-tracking"]',
        preferredPosition: 'right',
    },
    {
        title: 'Red Alerts & Intervention Triggers',
        description:
            'These are warnings that need your attention right away. Example: patient says they\'re thinking about hurting themselves. Call them immediately.',
        selector: '[data-tour="red-alerts"]',
        preferredPosition: 'bottom',
    },
    {
        title: 'Automated Check-In Schedule',
        description:
            'The system automatically sends messages to the patient asking how they\'re doing. You can see their responses here and know when to reach out.',
        selector: '[data-tour="checkin-schedule"]',
        preferredPosition: 'right',
    },
    {
        title: 'Export Report',
        description:
            'Click this button to create a report with all the patient\'s data. You can send this to insurance companies to prove the treatment is working and get reimbursed.',
        selector: '[data-tour="export-report"]',
        preferredPosition: 'top',
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
        2: 'bg-amber-500/10  hover:bg-amber-500/20  border-amber-500/30  hover:border-amber-500/50  text-amber-400',
        3: 'bg-blue-500/10   hover:bg-blue-500/20   border-blue-500/30   hover:border-blue-500/50   text-blue-400',
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
            // Small delay lets the page paint before spotlight measures elements
            setTimeout(() => setShowPhase1(true), 600);
        }
    }, []);

    useEffect(() => {
        if (completedPhases.includes(1) && !localStorage.getItem('ppn_phase2_tour_seen')) {
            setTimeout(() => setShowPhase2(true), 600);
        }
    }, [completedPhases]);

    useEffect(() => {
        if (completedPhases.includes(2) && !localStorage.getItem('ppn_phase3_tour_seen')) {
            setTimeout(() => setShowPhase3(true), 600);
        }
    }, [completedPhases]);

    return {
        showPhase1, setShowPhase1,
        showPhase2, setShowPhase2,
        showPhase3, setShowPhase3,
    };
}
