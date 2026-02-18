/**
 * CrisisLoggerTour — WO-084
 * 5-step mini guided tour for Crisis Logger.
 * Tone: calm, direct, confidence-building. Max 90 seconds.
 * Entry: first time user opens Crisis Logger → modal prompt.
 * Reuses the same visual system as GuidedTour (WO-085).
 */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronRight, ChevronLeft, X, Shield } from 'lucide-react';

const STORAGE_KEY = 'ppn_crisis_logger_tour_seen';

interface TourStep {
    title: string;
    target: string; // CSS selector
    tooltip: string;
    action: string;
}

const STEPS: TourStep[] = [
    {
        title: 'This is your safety net',
        target: '[data-tour="crisis-logger-button"]',
        tooltip: "If something unexpected happens, tap this first. Don't wait. The log starts immediately.",
        action: 'Tap to open',
    },
    {
        title: 'What happened?',
        target: '[data-tour="crisis-event-type"]',
        tooltip: 'Choose the closest match. You can add details in the notes field.',
        action: 'Select an option',
    },
    {
        title: 'How serious?',
        target: '[data-tour="crisis-severity"]',
        tooltip: '1 = mild discomfort. 5 = call 911. When in doubt, go higher.',
        action: 'Select severity',
    },
    {
        title: 'What did you do?',
        target: '[data-tour="crisis-intervention"]',
        tooltip:
            "Write exactly what you did: dose, route, time. 'Gave water' is fine. 'Administered 2mg lorazepam IM at 14:32' is better.",
        action: 'Type or skip',
    },
    {
        title: 'Save and continue',
        target: '[data-tour="crisis-save"]',
        tooltip:
            'This creates a timestamped record. You can add more events as the session continues.',
        action: 'Tap Save',
    },
];

const CARD_W = 320;
const CARD_H = 180;
const GAP = 16;

interface CrisisLoggerTourProps {
    onClose: () => void;
}

export const CrisisLoggerTour: React.FC<CrisisLoggerTourProps> = ({ onClose }) => {
    const [step, setStep] = useState(0);
    const [pos, setPos] = useState<React.CSSProperties>({ top: '50%', left: '50%' });
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
    const [visible, setVisible] = useState(false);
    const skipRef = useRef<HTMLButtonElement>(null);

    const current = STEPS[step];

    const position = useCallback(() => {
        const el = document.querySelector(current.target);
        if (!el) {
            // Fallback: center of screen
            setPos({ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' });
            setTargetRect(null);
            setVisible(true);
            return;
        }
        const rect = el.getBoundingClientRect();
        setTargetRect(rect);

        let top = rect.bottom + GAP;
        let left = rect.left + rect.width / 2 - CARD_W / 2;

        // Flip up if off-screen
        if (top + CARD_H > window.innerHeight - 10) top = rect.top - CARD_H - GAP;
        // Boundary clamp
        if (left < 10) left = 10;
        if (left + CARD_W > window.innerWidth - 10) left = window.innerWidth - CARD_W - 10;
        if (top < 10) top = 10;

        setPos({ top, left, width: CARD_W });
        setVisible(true);
    }, [current.target]);

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
            aria-label="Crisis Logger guided tour"
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] pointer-events-auto" />

            {/* Target highlight */}
            {targetRect && (
                <div
                    className="absolute border-2 border-red-400 rounded-xl pointer-events-none z-[9999]"
                    style={{
                        top: targetRect.top - 8,
                        left: targetRect.left - 8,
                        width: targetRect.width + 16,
                        height: targetRect.height + 16,
                        boxShadow: '0 0 0 4px rgba(248,113,113,0.2), 0 0 20px rgba(248,113,113,0.4)',
                    }}
                    aria-hidden="true"
                />
            )}

            {/* Tour card */}
            <div
                className="absolute bg-[#0c1016] border-2 border-red-500/60 rounded-2xl p-5 shadow-2xl pointer-events-auto z-[10000] animate-in fade-in zoom-in-95 duration-200"
                style={pos}
                aria-live="polite"
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-red-400" aria-hidden="true" />
                        <span className="text-xs font-black text-red-400 uppercase tracking-widest">
                            Crisis Logger Tour — {step + 1}/{STEPS.length}
                        </span>
                    </div>
                    <button
                        ref={skipRef}
                        onClick={handleClose}
                        className="text-slate-500 hover:text-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400/50 rounded"
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
                                className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? 'w-5 bg-red-400' : i < step ? 'w-3 bg-red-400/40' : 'w-1.5 bg-slate-700'
                                    }`}
                            />
                        ))}
                    </div>

                    {/* Nav */}
                    <div className="flex items-center gap-2">
                        {step > 0 && (
                            <button
                                onClick={handlePrev}
                                className="flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-slate-300 transition-all focus:outline-none focus:ring-2 focus:ring-red-400/50 rounded px-1"
                                aria-label="Previous step"
                            >
                                <ChevronLeft className="w-3.5 h-3.5" />
                                Back
                            </button>
                        )}
                        <button
                            onClick={handleNext}
                            className="flex items-center gap-1.5 px-4 py-2 bg-red-500 hover:bg-red-600 text-slate-300 text-xs font-black rounded-xl uppercase tracking-widest transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-400/50 min-h-[44px]"
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
 * Hook: returns true if the Crisis Logger tour should auto-trigger.
 * Call this in the component that renders CrisisLogger.
 */
export function useCrisisLoggerTour() {
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

export default CrisisLoggerTour;
