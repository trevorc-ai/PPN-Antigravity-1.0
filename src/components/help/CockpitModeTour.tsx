/**
 * CockpitModeTour — WO-084
 * 6-step mini guided tour for Cockpit Mode.
 * Tone: professional, efficient, empowering. "You're in control."
 * Entry: first time user activates Cockpit Mode → modal prompt.
 * CRITICAL: tooltips must NOT obscure vitals panel — positioned to side/bottom.
 */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronRight, ChevronLeft, X, Gauge } from 'lucide-react';

const STORAGE_KEY = 'ppn_cockpit_mode_tour_seen';

interface TourStep {
    title: string;
    target: string;
    tooltip: string;
    action: string;
    preferSide?: boolean; // if true, position to right of target (never center)
}

const STEPS: TourStep[] = [
    {
        title: "You're in Cockpit Mode",
        target: '[data-tour="cockpit-overlay"]',
        tooltip: "Everything you need for this session is here. Nothing you don't need.",
        action: 'Observe',
    },
    {
        title: 'Patient vitals — left panel',
        target: '[data-tour="cockpit-vitals"]',
        tooltip: 'Heart rate, blood pressure, SpO2. Updates when you log a new reading.',
        action: 'Observe',
        preferSide: true,
    },
    {
        title: 'Session timeline — center',
        target: '[data-tour="cockpit-timeline"]',
        tooltip: 'Every event logged in this session appears here, in order. Scroll to review.',
        action: 'Scroll',
        preferSide: true,
    },
    {
        title: 'Protocol — right panel',
        target: '[data-tour="cockpit-protocol"]',
        tooltip: 'Your dosing protocol and elapsed time. The next scheduled check is highlighted.',
        action: 'Observe',
        preferSide: true,
    },
    {
        title: 'Quick log',
        target: '[data-tour="cockpit-log-vital"]',
        tooltip: 'One tap to log a vital sign without leaving Cockpit Mode.',
        action: 'Tap button',
    },
    {
        title: "When you're done",
        target: '[data-tour="cockpit-exit"]',
        tooltip: 'Tap here to return to standard view. Everything is saved automatically.',
        action: 'Tap Exit',
    },
];

const CARD_W = 320;
const CARD_H = 190;
const GAP = 16;

interface CockpitModeTourProps {
    onClose: () => void;
}

export const CockpitModeTour: React.FC<CockpitModeTourProps> = ({ onClose }) => {
    const [step, setStep] = useState(0);
    const [pos, setPos] = useState<React.CSSProperties>({ top: '50%', left: '50%' });
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
    const [visible, setVisible] = useState(false);
    const skipRef = useRef<HTMLButtonElement>(null);

    const current = STEPS[step];

    const position = useCallback(() => {
        const el = document.querySelector(current.target);
        if (!el) {
            setPos({ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' });
            setTargetRect(null);
            setVisible(true);
            return;
        }
        const rect = el.getBoundingClientRect();
        setTargetRect(rect);

        let top: number;
        let left: number;

        if (current.preferSide) {
            // Position to the RIGHT of target to avoid obscuring vitals
            top = rect.top;
            left = rect.right + GAP;
            if (left + CARD_W > window.innerWidth - 10) {
                // Flip to left
                left = rect.left - CARD_W - GAP;
            }
            if (left < 10) left = 10;
            if (top + CARD_H > window.innerHeight - 10) top = window.innerHeight - CARD_H - 10;
        } else {
            // Default: below target
            top = rect.bottom + GAP;
            left = rect.left + rect.width / 2 - CARD_W / 2;
            if (top + CARD_H > window.innerHeight - 10) top = rect.top - CARD_H - GAP;
            if (left < 10) left = 10;
            if (left + CARD_W > window.innerWidth - 10) left = window.innerWidth - CARD_W - 10;
            if (top < 10) top = 10;
        }

        setPos({ top, left, width: CARD_W });
        setVisible(true);
    }, [current.target, current.preferSide]);

    useEffect(() => {
        const t = setTimeout(position, 120);
        window.addEventListener('resize', position);
        return () => { clearTimeout(t); window.removeEventListener('resize', position); };
    }, [position]);

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose(); };
        document.addEventListener('keydown', handleEsc);
        return () => document.removeEventListener('keydown', handleEsc);
    }, []);

    useEffect(() => { skipRef.current?.focus(); }, [step]);

    const handleClose = useCallback(() => {
        localStorage.setItem(STORAGE_KEY, 'true');
        onClose();
    }, [onClose]);

    const handleNext = () => {
        if (step < STEPS.length - 1) {
            setVisible(false);
            setTimeout(() => setStep((s) => s + 1), 120);
        } else {
            handleClose();
        }
    };

    const handlePrev = () => {
        if (step > 0) {
            setVisible(false);
            setTimeout(() => setStep((s) => s - 1), 120);
        }
    };

    if (!visible) return null;

    return (
        <div
            className="fixed inset-0 z-[9998] pointer-events-none"
            role="dialog"
            aria-modal="true"
            aria-label="Cockpit Mode guided tour"
        >
            {/* Lighter backdrop — don't obscure session data */}
            <div className="absolute inset-0 bg-black/30 pointer-events-auto" />

            {/* Target highlight — amber for cockpit */}
            {targetRect && (
                <div
                    className="absolute border-2 border-amber-400 rounded-xl pointer-events-none z-[9999]"
                    style={{
                        top: targetRect.top - 8,
                        left: targetRect.left - 8,
                        width: targetRect.width + 16,
                        height: targetRect.height + 16,
                        boxShadow: '0 0 0 4px rgba(251,191,36,0.15), 0 0 20px rgba(251,191,36,0.35)',
                    }}
                    aria-hidden="true"
                />
            )}

            {/* Tour card */}
            <div
                className="absolute bg-[#0c1016] border-2 border-amber-500/60 rounded-2xl p-5 shadow-2xl pointer-events-auto z-[10000] animate-in fade-in zoom-in-95 duration-200"
                style={pos}
                aria-live="polite"
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <Gauge className="w-4 h-4 text-amber-400" aria-hidden="true" />
                        <span className="text-xs font-black text-amber-400 uppercase tracking-widest">
                            Cockpit Tour — {step + 1}/{STEPS.length}
                        </span>
                    </div>
                    <button
                        ref={skipRef}
                        onClick={handleClose}
                        className="text-slate-500 hover:text-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400/50 rounded"
                        aria-label="Skip tour"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Content */}
                <h3 className="text-base font-black text-slate-300 mb-1 leading-tight">{current.title}</h3>
                <p className="text-sm text-slate-300 leading-relaxed mb-4">{current.tooltip}</p>
                <p className="text-sm text-slate-500 italic mb-4">Action: {current.action}</p>

                {/* Footer */}
                <div className="flex items-center justify-between">
                    {/* Progress dots */}
                    <div className="flex gap-1.5" role="tablist" aria-label="Tour progress">
                        {STEPS.map((_, i) => (
                            <div
                                key={i}
                                role="tab"
                                aria-current={i === step ? 'step' : undefined}
                                className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? 'w-5 bg-amber-400' : i < step ? 'w-3 bg-amber-400/40' : 'w-1.5 bg-slate-700'
                                    }`}
                            />
                        ))}
                    </div>

                    {/* Nav */}
                    <div className="flex items-center gap-2">
                        {step > 0 && (
                            <button
                                onClick={handlePrev}
                                className="flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-slate-300 transition-all focus:outline-none focus:ring-2 focus:ring-amber-400/50 rounded px-1"
                                aria-label="Previous step"
                            >
                                <ChevronLeft className="w-3.5 h-3.5" />
                                Back
                            </button>
                        )}
                        <button
                            onClick={handleNext}
                            className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black text-xs font-black rounded-xl uppercase tracking-widest transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-amber-400/50 min-h-[44px]"
                            aria-label={step === STEPS.length - 1 ? 'Finish tour' : 'Next step'}
                        >
                            {step === STEPS.length - 1 ? 'Done' : 'Next'}
                            <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

/**
 * Hook: returns true if the Cockpit Mode tour should auto-trigger.
 * Call this in the component that activates Cockpit Mode.
 */
export function useCockpitModeTour() {
    const [showTour, setShowTour] = useState(false);

    const triggerIfNew = useCallback(() => {
        if (!localStorage.getItem(STORAGE_KEY)) {
            setShowTour(true);
        }
    }, []);

    const closeTour = useCallback(() => {
        localStorage.setItem(STORAGE_KEY, 'true');
        setShowTour(false);
    }, []);

    return { showTour, triggerIfNew, closeTour };
}

export default CockpitModeTour;
