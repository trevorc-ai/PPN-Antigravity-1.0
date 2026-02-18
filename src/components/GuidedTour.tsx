import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';

interface TourStep {
  title: string;
  description: string;
  selector: string;
  preferredPosition: 'bottom' | 'right' | 'left' | 'top';
}

// ─── Revised step list per DESIGNER spec (WO-085) ────────────────────────────
// All selectors target sidebar links (always in DOM) except Step 1
const TOUR_STEPS: TourStep[] = [
  {
    title: 'Welcome to Your Command Center',
    description: 'This is your Dashboard — home base for tracking protocols, safety alerts, and clinic performance.',
    selector: '[data-tour="dashboard-header"]',
    preferredPosition: 'bottom',
  },
  {
    title: 'Log a Patient Journey',
    description: 'The Wellness Journey tracks the complete arc of care — from preparation to integration. Click here to create your first protocol.',
    selector: 'a[href="/wellness-journey"]',
    preferredPosition: 'right',
  },
  {
    title: 'Check Drug Interactions',
    description: 'The Interaction Checker scans for dangerous combinations like Serotonin Syndrome. Always check before dosing.',
    selector: 'a[href="/interactions"]',  // FIX: was [data-tour="interaction-checker"] (Dashboard only)
    preferredPosition: 'right',
  },
  {
    title: 'Browse the Substance Catalog',
    description: 'Evidence-based dosing guidelines, contraindications, and safety protocols for 50+ substances.',
    selector: 'a[href="/catalog"]',
    preferredPosition: 'right',
  },
  {
    title: 'Get Help Anytime',
    description: 'Access FAQs, tutorials, and live support. You can restart this tour from the Help Center anytime.',
    selector: 'a[href="/help"]',
    preferredPosition: 'right',
  },
];

interface GuidedTourProps {
  onComplete: () => void;
}

const CARD_WIDTH = 340;
const CARD_HEIGHT = 200;
const GAP = 20;

const GuidedTour: React.FC<GuidedTourProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [popoverStyle, setPopoverStyle] = useState<React.CSSProperties>({});
  const navigate = useNavigate();
  const location = useLocation();
  const cardRef = useRef<HTMLDivElement>(null);
  const skipBtnRef = useRef<HTMLButtonElement>(null);
  const nextBtnRef = useRef<HTMLButtonElement>(null);

  const step = TOUR_STEPS[currentStep];
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  const positionTourCard = useCallback((rect: DOMRect) => {
    setTargetRect(rect);

    if (isMobile) {
      // Mobile: fixed bottom positioning
      setPopoverStyle({
        position: 'fixed',
        bottom: 16,
        left: 16,
        right: 16,
        width: 'auto',
      });
      setIsVisible(true);
      return;
    }

    let top = 0;
    let left = 0;
    let position = step.preferredPosition;

    // Smart collision detection
    if (position === 'bottom' && rect.bottom + GAP + CARD_HEIGHT > window.innerHeight) position = 'top';
    if (position === 'top' && rect.top - GAP - CARD_HEIGHT < 0) position = 'bottom';
    if (position === 'right' && rect.right + GAP + CARD_WIDTH > window.innerWidth) position = 'left';
    if (position === 'left' && rect.left - GAP - CARD_WIDTH < 0) position = 'right';

    if (position === 'bottom') {
      top = rect.bottom + GAP;
      left = rect.left + rect.width / 2 - CARD_WIDTH / 2;
    } else if (position === 'top') {
      top = rect.top - CARD_HEIGHT - GAP;
      left = rect.left + rect.width / 2 - CARD_WIDTH / 2;
    } else if (position === 'right') {
      top = rect.top;
      left = rect.right + GAP;
    } else {
      top = rect.top;
      left = rect.left - CARD_WIDTH - GAP;
    }

    // Screen boundary safety
    if (left < 10) left = 10;
    if (left + CARD_WIDTH > window.innerWidth - 10) left = window.innerWidth - CARD_WIDTH - 10;
    if (top < 80) top = 80;
    if (top + CARD_HEIGHT > window.innerHeight - 10) top = window.innerHeight - CARD_HEIGHT - 10;

    setPopoverStyle({ top, left, width: CARD_WIDTH });
    setIsVisible(true);
  }, [step, isMobile]);

  const updatePosition = useCallback(() => {
    const el = document.querySelector(step.selector);
    if (!el) {
      setIsVisible(false);
      return;
    }
    const rect = el.getBoundingClientRect();
    const inViewport =
      rect.top >= 0 && rect.left >= 0 &&
      rect.bottom <= window.innerHeight && rect.right <= window.innerWidth;

    if (!inViewport) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => positionTourCard(el.getBoundingClientRect()), 500);
    } else {
      positionTourCard(rect);
    }
  }, [step, positionTourCard]);

  // Navigation: Step 0 needs extra time for dashboard to render
  useEffect(() => {
    if (currentStep === 0 && location.pathname !== '/dashboard') {
      navigate('/dashboard');
      setTimeout(updatePosition, 600); // FIX: was 100ms — too fast
    } else {
      setTimeout(updatePosition, 150);
    }
  }, [currentStep, location.pathname, navigate, updatePosition]);

  useEffect(() => {
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [updatePosition]);

  // Escape key to dismiss — FIX: was backdrop click (accidental dismissal)
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleSkip();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  // Focus trap within tour card
  useEffect(() => {
    if (isVisible && skipBtnRef.current) {
      skipBtnRef.current.focus();
    }
  }, [isVisible, currentStep]);

  const handleNext = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setIsVisible(false);
      setTimeout(() => setCurrentStep((p) => p + 1), 150);
    } else {
      setIsComplete(true);
      setTimeout(() => onComplete(), 3000);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setIsVisible(false);
      setTimeout(() => setCurrentStep((p) => p - 1), 150);
    }
  };

  const handleSkip = () => onComplete();

  // Tour completion screen
  if (isComplete) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="bg-[#0c1016] border-2 border-emerald-500/60 rounded-3xl p-8 w-[340px] text-center shadow-2xl animate-in zoom-in-95 duration-300">
          <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
          <h3 className="text-lg font-black text-slate-300 mb-2">You're all set!</h3>
          <p className="text-sm text-slate-400 mb-6 leading-relaxed">
            You've completed the PPN portal tour. You can restart it anytime from the Help Center.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => { onComplete(); navigate('/dashboard'); }}
              className="px-4 py-2.5 bg-primary hover:bg-blue-600 text-slate-300 text-xs font-black rounded-xl uppercase tracking-widest transition-all"
            >
              Go to Dashboard
            </button>
            <button
              onClick={onComplete}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-all"
            >
              Explore on my own
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!isVisible || !targetRect) return null;

  return (
    <div className="fixed inset-0 z-[9998] isolate pointer-events-none" role="dialog" aria-modal="true" aria-label="Guided tour">
      {/* Backdrop — FIX: removed onClick dismiss, only Escape key dismisses */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] pointer-events-auto" />

      {/* Target Highlight Ring */}
      {!isMobile && (
        <div
          className="absolute border-2 border-primary rounded-xl pointer-events-none z-[9999]"
          style={{
            top: targetRect.top - 8,
            left: targetRect.left - 8,
            width: targetRect.width + 16,
            height: targetRect.height + 16,
            boxShadow: '0 0 0 4px rgba(43,116,243,0.15), 0 0 20px rgba(43,116,243,0.4)',
            animation: 'highlight-pulse 2s ease-in-out infinite',
          }}
          aria-hidden="true"
        />
      )}

      {/* Tour Card */}
      <div
        ref={cardRef}
        className="absolute bg-[#0c1016] border-2 border-primary/60 rounded-[1.5rem] p-6 shadow-[0_0_30px_rgba(43,116,243,0.3),0_20px_60px_rgba(0,0,0,0.5)] animate-in fade-in zoom-in-95 duration-300 pointer-events-auto flex flex-col gap-4 z-[10000]"
        style={popoverStyle}
        aria-live="polite"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-primary uppercase tracking-[0.2em]">
            Step {currentStep + 1} / {TOUR_STEPS.length}
          </span>
          <button
            ref={skipBtnRef}
            onClick={handleSkip}
            className="text-xs font-bold text-slate-500 hover:text-slate-300 uppercase tracking-widest transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 rounded"
            aria-label="Skip tour"
          >
            Skip Tour
          </button>
        </div>

        {/* Content */}
        <div className="space-y-2">
          <h3 className="text-lg font-black text-slate-300 tracking-tight leading-tight">{step.title}</h3>
          <p className="text-sm text-slate-300 font-medium leading-relaxed">{step.description}</p>
        </div>

        {/* Footer: dots + navigation */}
        <div className="flex items-center justify-between">
          {/* Progress dots */}
          <div className="flex gap-1.5" role="tablist" aria-label="Tour progress">
            {TOUR_STEPS.map((_, i) => (
              <div
                key={i}
                role="tab"
                aria-current={i === currentStep ? 'step' : undefined}
                aria-label={`Step ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${i === currentStep
                    ? 'w-6 bg-primary shadow-[0_0_8px_rgba(43,116,243,0.6)]'
                    : i < currentStep
                      ? 'w-3 bg-primary/40'
                      : 'w-1.5 bg-slate-700'
                  }`}
              />
            ))}
          </div>

          {/* Nav buttons */}
          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <button
                onClick={handlePrev}
                className="flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-slate-300 transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 rounded px-1"
                aria-label="Previous step"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                Back
              </button>
            )}
            <button
              ref={nextBtnRef}
              onClick={handleNext}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-primary hover:bg-blue-600 text-slate-300 text-xs font-black rounded-xl uppercase tracking-widest transition-all shadow-lg active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary/50"
              aria-label={currentStep === TOUR_STEPS.length - 1 ? 'Finish tour' : 'Next step'}
            >
              {currentStep === TOUR_STEPS.length - 1 ? 'Finish' : 'Next'}
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuidedTour;
