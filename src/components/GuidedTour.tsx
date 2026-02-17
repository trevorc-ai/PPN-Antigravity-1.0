
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface TourStep {
  title: string;
  description: string;
  selector: string;
  preferredPosition: 'bottom' | 'right' | 'left' | 'top';
}


const TOUR_STEPS: TourStep[] = [
  {
    title: 'Welcome to Your Command Center',
    description: 'This is your Dashboard—your home base for tracking protocols, safety alerts, and clinic performance.',
    selector: '[data-tour="dashboard-header"]',
    preferredPosition: 'bottom'
  },
  {
    title: 'Log Your First Patient Journey',
    description: 'The Wellness Journey tracks the complete arc of care—from preparation to integration. Click here to create your first protocol.',
    selector: 'a[href="/wellness-journey"]',
    preferredPosition: 'right'
  },
  {
    title: 'Prevent Dangerous Interactions',
    description: 'The Interaction Checker scans for dangerous drug combinations like Serotonin Syndrome. Try it now.',
    selector: '[data-tour="interaction-checker"]',
    preferredPosition: 'top'
  },
  {
    title: 'Access Evidence-Based Guidance',
    description: 'The Substance Catalog provides dosing guidelines, contraindications, and safety protocols for 50+ substances.',
    selector: 'a[href="/catalog"]',
    preferredPosition: 'right'
  },
  {
    title: 'We\'re Here to Help',
    description: 'Access FAQs, video tutorials, and live support from the Help Center. You can restart this tour anytime.',
    selector: 'a[href="/help"]',
    preferredPosition: 'right'
  }
];

interface GuidedTourProps {
  onComplete: () => void;
}

const GuidedTour: React.FC<GuidedTourProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [popoverStyle, setPopoverStyle] = useState<React.CSSProperties>({});
  const navigate = useNavigate();
  const location = useLocation();
  const cardRef = useRef<HTMLDivElement>(null);

  const step = TOUR_STEPS[currentStep];

  const updatePosition = useCallback(() => {
    const el = document.querySelector(step.selector);
    if (el) {
      // Auto-scroll to element if it's not in viewport
      const rect = el.getBoundingClientRect();
      const isInViewport = (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= window.innerHeight &&
        rect.right <= window.innerWidth
      );

      if (!isInViewport) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Wait for scroll to complete before positioning
        setTimeout(() => {
          const updatedRect = el.getBoundingClientRect();
          positionTourCard(updatedRect);
        }, 300);
      } else {
        positionTourCard(rect);
      }
    } else {
      setIsVisible(false);
    }
  }, [step]);

  const positionTourCard = (rect: DOMRect) => {
    setTargetRect(rect);

    const gap = 32; // Increased gap for better separation from target
    const cardWidth = 300;
    const cardHeight = 160;
    let top = 0;
    let left = 0;

    // Smart Positioning Engine
    let position = step.preferredPosition;

    // Vertical flip check
    if (position === 'bottom' && rect.bottom + gap + cardHeight > window.innerHeight) position = 'top';
    if (position === 'top' && rect.top - gap - cardHeight < 0) position = 'bottom';

    // Horizontal flip check
    if (position === 'right' && rect.right + gap + cardWidth > window.innerWidth) position = 'left';
    if (position === 'left' && rect.left - gap - cardWidth < 0) position = 'right';

    if (position === 'bottom') {
      top = rect.bottom + gap;
      left = rect.left + (rect.width / 2) - (cardWidth / 2);
    } else if (position === 'top') {
      top = rect.top - cardHeight - gap;
      left = rect.left + (rect.width / 2) - (cardWidth / 2);
    } else if (position === 'right') {
      top = rect.top;
      left = rect.right + gap;
    } else if (position === 'left') {
      top = rect.top;
      left = rect.left - cardWidth - gap;
    }

    // Screen Boundary Safety
    if (left < 10) left = 10;
    if (left + cardWidth > window.innerWidth - 10) left = window.innerWidth - cardWidth - 10;
    if (top < 80) top = 80;
    if (top + cardHeight > window.innerHeight - 10) top = window.innerHeight - cardHeight - 10;

    setPopoverStyle({ top, left });
    setIsVisible(true);
  };

  useEffect(() => {
    if (currentStep === 0 && location.pathname !== '/dashboard') {
      navigate('/dashboard');
    }
  }, [currentStep, location.pathname, navigate]);

  useEffect(() => {
    const timer = setTimeout(updatePosition, 100);
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [currentStep, updatePosition]);

  const handleNext = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setIsVisible(false);
      setTimeout(() => setCurrentStep(prev => prev + 1), 150);
    } else {
      onComplete();
    }
  };

  if (!isVisible || !targetRect) return null;

  return (
    <div className="fixed inset-0 z-[9999] isolate pointer-events-none">
      {/* Minimal backdrop */}
      <div
        className="absolute inset-0 bg-black/10 backdrop-blur-[1px] transition-opacity duration-500 pointer-events-auto"
        onClick={onComplete}
      />

      {/* Target Highlighter (Blue Border) */}
      <div
        className="absolute transition-all duration-300 ease-out border-[3px] border-primary rounded-xl shadow-[0_0_20px_rgba(43,116,243,0.6)] z-[10000] pointer-events-none"
        style={{
          top: targetRect.top - 6,
          left: targetRect.left - 6,
          width: targetRect.width + 12,
          height: targetRect.height + 12,
        }}
      />

      {/* Tour Box (Dual Glow #2) */}
      <div
        ref={cardRef}
        className="absolute w-[300px] bg-[#0c1016] border-2 border-primary rounded-[1.5rem] p-6 shadow-[0_0_15px_rgba(43,116,243,0.5)] animate-in fade-in zoom-in-95 duration-300 pointer-events-auto flex flex-col gap-4 z-[10001]"
        style={popoverStyle}
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-black text-primary uppercase tracking-[0.2em]">
            Step {currentStep + 1} / {TOUR_STEPS.length}
          </span>
          <button
            onClick={onComplete}
            className="text-[11px] font-black text-slate-3000 hover:text-slate-300 uppercase tracking-widest transition-all"
          >
            Skip
          </button>
        </div>

        <div className="space-y-1.5">
          <h3 className="text-lg font-black text-slate-300 tracking-tight leading-none">{step.title}</h3>
          <p className="text-[12px] text-slate-300 font-medium leading-relaxed">
            {step.description}
          </p>
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="flex gap-1.5">
            {TOUR_STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-1 rounded-full transition-all duration-300 ${i === currentStep ? 'w-6 bg-primary shadow-[0_0_8px_rgba(43,116,243,0.6)]' : 'w-1.5 bg-slate-800'}`}
              />
            ))}
          </div>
          <button
            onClick={handleNext}
            className="px-6 py-2.5 bg-primary hover:bg-blue-600 text-slate-300 text-[11px] font-black rounded-xl uppercase tracking-widest transition-all shadow-lg active:scale-95 flex items-center gap-2 group/btn"
          >
            {currentStep === TOUR_STEPS.length - 1 ? 'Finish' : 'Next'}
            <span className="material-symbols-outlined text-sm group-hover/btn:translate-x-0.5 transition-transform">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuidedTour;
