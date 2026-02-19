/**
 * GuidedTour.tsx — Global Site Tour (Spotlight Edition)
 *
 * Animation model:
 *  - The CARD wrapper stays mounted the whole tour; only its CONTENT fades+slides
 *    via the `key` trick — React remounts the inner div on step change, triggering
 *    the CSS @keyframes "stepIn" animation. No disappear/reappear flash.
 *  - The SPOTLIGHT div glides via CSS transition (top/left/width/height) so it
 *    smoothly follows the new target element.
 *  - Page remains fully scrollable (pointerEvents: 'none' on spotlight).
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight, CheckCircle, Info, Compass } from 'lucide-react';

// ─── Step definitions ─────────────────────────────────────────────────────────

interface TourStep {
  title: string;
  description: React.ReactNode;
  selector: string;
  preferredPosition: 'bottom' | 'right' | 'left' | 'top';
}

const TOUR_STEPS: TourStep[] = [
  {
    title: 'Dashboard',
    description:
      'This is your home base for tracking protocols, safety alerts, and clinic performance all in one place.',
    selector: '[data-tour="dashboard-header"]',
    preferredPosition: 'bottom',
  },
  {
    title: 'Wellness Journey',
    description:
      'This is where you can track the complete longitudinal arc of patient care, from preparation to integration, and get data-driven insights in real time.',
    selector: '[data-tour="nav-wellness-journey"]',
    preferredPosition: 'right',
  },
  {
    title: 'Check Drug Interactions',
    description:
      'The Interaction Checker scans for dangerous combinations like Serotonin Syndrome. Always check before dosing.',
    selector: '[data-tour="nav-interaction-checker"]',
    preferredPosition: 'right',
  },
  {
    title: 'Substance Catalog',
    description:
      'Evidence-based guidelines, contraindications, and safety protocols for common psychedelic therapy substances.',
    selector: '[data-tour="nav-substance-catalog"]',
    preferredPosition: 'right',
  },
  {
    title: 'Get Help Anytime',
    description:
      'Access FAQs, tutorials, and live support. You can restart this tour from the Help Center anytime.',
    selector: '[data-tour="nav-help-faq"]',
    preferredPosition: 'right',
  },
  {
    title: 'More Info and Tours',
    description: (
      <span className="flex flex-col gap-2">
        <span>
          To learn more about any element, click{' '}
          <Info
            className="inline-block align-middle w-4 h-4 text-blue-400"
            aria-label="info icon"
          />
        </span>
        <span>
          Or take a guided tour through the Portal anywhere you see a compass{' '}
          <Compass
            className="inline-block align-middle w-4 h-4 text-blue-400"
            aria-label="compass icon"
          />
        </span>
      </span>
    ),
    selector: '[data-tour="nav-help-faq"]',
    preferredPosition: 'right',
  },
];

// ─── Constants ────────────────────────────────────────────────────────────────

const CARD_W = 340;
const CARD_H = 230; // estimate for collision detection (slightly taller for step 6)
const GAP = 16;    // px between element edge and popover
const PAD = 10;    // px spotlight padding around element

interface GuidedTourProps {
  onComplete: () => void;
}

// ─── Popover position helper ──────────────────────────────────────────────────

function computePosition(
  rect: DOMRect,
  preferred: TourStep['preferredPosition']
): React.CSSProperties {
  const { innerWidth: vw, innerHeight: vh } = window;

  const fits = {
    bottom: rect.bottom + GAP + CARD_H < vh,
    top: rect.top - GAP - CARD_H > 0,
    right: rect.right + GAP + CARD_W < vw,
    left: rect.left - GAP - CARD_W > 0,
  };

  const order: TourStep['preferredPosition'][] = [preferred, 'right', 'bottom', 'top', 'left'];
  const side = order.find((s) => fits[s]) ?? 'bottom';

  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;

  let top = 0, left = 0;

  if (side === 'bottom') { top = rect.bottom + GAP; left = cx - CARD_W / 2; }
  if (side === 'top') { top = rect.top - GAP - CARD_H; left = cx - CARD_W / 2; }
  if (side === 'right') { top = cy - CARD_H / 2; left = rect.right + GAP; }
  if (side === 'left') { top = cy - CARD_H / 2; left = rect.left - GAP - CARD_W; }

  // Clamp to viewport
  left = Math.max(10, Math.min(left, vw - CARD_W - 10));
  top = Math.max(70, Math.min(top, vh - CARD_H - 10));

  return { position: 'fixed', top, left, width: CARD_W };
}

// ─── Main component ───────────────────────────────────────────────────────────

const GuidedTour: React.FC<GuidedTourProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [cardStyle, setCardStyle] = useState<React.CSSProperties>({});
  const [cardVisible, setCardVisible] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const skipBtnRef = useRef<HTMLButtonElement>(null);

  const step = TOUR_STEPS[currentStep];
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  // ── Position on an element ──────────────────────────────────────────────────

  const positionOn = useCallback(
    (el: Element) => {
      const rect = el.getBoundingClientRect();
      setTargetRect(rect);

      if (isMobile) {
        setCardStyle({ position: 'fixed', bottom: 16, left: 16, right: 16 });
      } else {
        setCardStyle(computePosition(rect, step.preferredPosition));
      }

      setCardVisible(true);
    },
    [step.preferredPosition, isMobile]
  );

  // ── Find target element and handle off-screen ───────────────────────────────

  const updatePosition = useCallback(() => {
    const el = document.querySelector(step.selector);
    if (!el) {
      // No matching element — show card in a default centred position
      setTargetRect(null);
      setCardStyle({
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: CARD_W,
      });
      setCardVisible(true);
      return;
    }

    const rect = el.getBoundingClientRect();
    const inViewport =
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= window.innerHeight &&
      rect.right <= window.innerWidth;

    if (!inViewport) {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      setTimeout(() => positionOn(el), 450);
    } else {
      positionOn(el);
    }
  }, [step, positionOn]);

  // ── Step change effect ──────────────────────────────────────────────────────
  // NOTE: We do NOT hide the card here — the card stays visible and the
  // content inside it is re-keyed (triggering the stepIn animation).
  // The spotlight glides to the new position via CSS transition.

  useEffect(() => {
    if (currentStep === 0 && location.pathname !== '/dashboard') {
      navigate('/dashboard');
      setTimeout(updatePosition, 700);
    } else {
      setTimeout(updatePosition, 120);
    }
  }, [currentStep]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Reposition on resize / scroll (passive — never blocks scrolling) ─────────

  useEffect(() => {
    const handler = () => {
      const el = document.querySelector(step.selector);
      if (el) positionOn(el);
    };
    window.addEventListener('resize', handler, { passive: true });
    window.addEventListener('scroll', handler, { passive: true, capture: true });
    return () => {
      window.removeEventListener('resize', handler);
      window.removeEventListener('scroll', handler, true);
    };
  }, [step, positionOn]);

  // ── Keyboard nav ────────────────────────────────────────────────────────────

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleSkip();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep]);

  // ── Focus management ────────────────────────────────────────────────────────

  useEffect(() => {
    if (cardVisible && skipBtnRef.current) {
      skipBtnRef.current.focus();
    }
  }, [cardVisible, currentStep]);

  // ── Navigation handlers ──────────────────────────────────────────────────────

  const handleNext = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep((p) => p + 1);
    } else {
      setIsComplete(true);
      setTimeout(() => onComplete(), 3500);
    }
  };

  const handlePrev = () => { if (currentStep > 0) setCurrentStep((p) => p - 1); };
  const handleSkip = () => onComplete();

  // ─── Completion screen ────────────────────────────────────────────────────

  if (isComplete) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none">
        <div
          className="bg-[#0c1016] border-2 border-emerald-500/60 rounded-3xl p-8 w-[340px] text-center shadow-2xl animate-in zoom-in-95 duration-300 pointer-events-auto"
          style={{ boxShadow: '0 0 0 9999px rgba(0,0,0,0.65), 0 0 40px rgba(16,185,129,0.3)' }}
        >
          <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
          <h3 className="text-lg font-black text-slate-200 mb-2">You're all set!</h3>
          <p className="text-sm text-slate-400 mb-6 leading-relaxed">
            You've completed the PPN portal tour. You can restart it anytime from the Help Center.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => { onComplete(); navigate('/dashboard'); }}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black rounded-xl uppercase tracking-widest transition-all"
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

  // ─── Spotlight overlay ─────────────────────────────────────────────────────
  //
  // A single div positioned over the target. Its box-shadow creates the
  // "dark world + cutout" effect. CSS transition makes it GLIDE to the next
  // target rather than jumping. pointerEvents:'none' keeps the page scrollable.

  const spotlightStyle: React.CSSProperties | undefined =
    targetRect && !isMobile
      ? {
        position: 'fixed',
        top: targetRect.top - PAD,
        left: targetRect.left - PAD,
        width: targetRect.width + PAD * 2,
        height: targetRect.height + PAD * 2,
        borderRadius: 10,
        pointerEvents: 'none',
        zIndex: 9990,
        boxShadow: [
          '0 0 0 9999px rgba(0,0,0,0.45)',   // light mask
          '0 0 0 3px rgba(59,130,246,0.95)',  // bright blue border
          '0 0 0 5px rgba(59,130,246,0.25)',  // tight glow
          '0 0 20px 6px rgba(59,130,246,0.2)',// diffuse glow
        ].join(', '),
        // Smooth glide to next element
        transition: [
          'top 0.35s cubic-bezier(.4,0,.2,1)',
          'left 0.35s cubic-bezier(.4,0,.2,1)',
          'width 0.35s cubic-bezier(.4,0,.2,1)',
          'height 0.35s cubic-bezier(.4,0,.2,1)',
        ].join(', '),
      }
      : undefined;

  // Mobile fallback dim
  const mobileBackdropStyle: React.CSSProperties | undefined =
    isMobile && cardVisible
      ? {
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.55)',
        backdropFilter: 'blur(2px)',
        zIndex: 9989,
        pointerEvents: 'none',
      }
      : undefined;

  return (
    <>
      {/* Inline keyframes for the step-content slide animation */}
      <style>{`
        @keyframes ppn-step-in {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0);  }
        }
        .ppn-step-content {
          animation: ppn-step-in 0.25s cubic-bezier(.4,0,.2,1) both;
        }
      `}</style>

      <div role="dialog" aria-modal="true" aria-label="Guided tour" className="contents">

        {/* Spotlight cutout (desktop) */}
        {spotlightStyle && (
          <div style={spotlightStyle} aria-hidden="true" />
        )}

        {/* Mobile dim */}
        {mobileBackdropStyle && (
          <div style={mobileBackdropStyle} aria-hidden="true" />
        )}

        {/* Popover card — stays mounted; content re-keys per step */}
        {cardVisible && (
          <div
            className="bg-[#0c1016] border-2 border-primary/60 rounded-[1.5rem] p-6
              shadow-[0_0_30px_rgba(43,116,243,0.3),0_20px_60px_rgba(0,0,0,0.5)]
              flex flex-col gap-4"
            style={{ ...cardStyle, zIndex: 10000 }}
          >
            {/* Step content — re-keyed on step change to trigger slide-in animation */}
            <div key={currentStep} className="ppn-step-content flex flex-col gap-4" aria-live="polite">

              {/* Header row */}
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
                <h3 className="text-lg font-black text-slate-200 tracking-tight leading-tight">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-400 font-medium leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Footer: progress dots + navigation */}
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
                    onClick={handleNext}
                    className="flex items-center gap-1.5 px-5 py-2.5 bg-primary hover:bg-blue-500 text-white text-xs font-black rounded-xl uppercase tracking-widest transition-all shadow-lg active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    aria-label={currentStep === TOUR_STEPS.length - 1 ? 'Finish tour' : 'Next step'}
                  >
                    {currentStep === TOUR_STEPS.length - 1 ? 'Finish' : 'Next'}
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>{/* end .ppn-step-content */}
          </div>
        )}
      </div>
    </>
  );
};

export default GuidedTour;
