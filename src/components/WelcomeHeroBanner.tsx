/**
 * WelcomeHeroBanner.tsx — WO-507
 *
 * First-login welcome moment rendered at the top of Dashboard.tsx.
 * Shown only when `localStorage.getItem('ppn_has_seen_welcome')` is falsy.
 * Removed from DOM (not hidden) on dismiss — no re-render flicker.
 *
 * Props:
 *   onStartTour  — dismisses banner immediately, then fires tour
 *   onDismiss    — dismisses banner without launching tour
 *   userName     — email prefix, already stripped by Dashboard
 */

import React from 'react';
import { Compass, ArrowRight, X } from 'lucide-react';

interface WelcomeHeroBannerProps {
    onStartTour: () => void;
    onDismiss: () => void;
    userName: string;
}

const WelcomeHeroBanner: React.FC<WelcomeHeroBannerProps> = ({
    onStartTour,
    onDismiss,
    userName,
}) => {
    return (
        <div
            className="
        relative overflow-hidden rounded-3xl
        bg-gradient-to-br from-indigo-950/60 via-slate-900/80 to-slate-900/60
        backdrop-blur-xl border border-indigo-500/20
        p-8 md:p-10
        animate-in fade-in slide-in-from-top-4 duration-500
        mb-2
      "
            role="banner"
            aria-label="Welcome banner"
        >
            {/* Ambient glow — decorative, pointer-events off */}
            <div
                className="absolute -top-12 -right-12 w-72 h-72 bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none"
                aria-hidden="true"
            />
            <div
                className="absolute -bottom-16 -left-8 w-48 h-48 bg-indigo-800/10 blur-[60px] rounded-full pointer-events-none"
                aria-hidden="true"
            />

            {/* Dismiss button — top-right, icon + sr text for accessibility */}
            <button
                onClick={onDismiss}
                aria-label="Dismiss welcome banner"
                className="
          absolute top-4 right-4
          p-2 rounded-xl
          text-slate-500 hover:text-slate-300
          bg-slate-800/0 hover:bg-slate-800/60
          border border-transparent hover:border-slate-700/50
          transition-all
        "
            >
                <X className="w-4 h-4" aria-hidden="true" />
            </button>

            {/* Content */}
            <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-8">

                {/* Left — text block */}
                <div className="flex-1 min-w-0">
                    {/* Eyebrow label */}
                    <div className="flex items-center gap-2 mb-3">
                        <span className="ppn-meta uppercase tracking-widest text-indigo-400">
                            PPN Research Portal
                        </span>
                        <span className="ppn-meta text-slate-600">/</span>
                        <span className="ppn-meta uppercase tracking-widest text-slate-500">
                            Beta
                        </span>
                    </div>

                    {/* Greeting */}
                    <h2 className="ppn-section-title mb-2">
                        Welcome{userName ? `, ${userName}` : ''}.
                    </h2>

                    {/* Mission tagline */}
                    <p className="ppn-body text-slate-400 max-w-xl">
                        The clinical intelligence platform for psychedelic therapy, built for safety, precision, and outcomes. Start with a quick tour to get oriented.
                    </p>
                </div>

                {/* Right — CTAs */}
                <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row gap-3 flex-shrink-0">
                    {/* Primary: Start Tour */}
                    <button
                        id="welcome-banner-start-tour"
                        onClick={onStartTour}
                        className="
              flex items-center justify-center gap-2.5
              px-6 py-3.5 rounded-2xl
              bg-indigo-600 hover:bg-indigo-500
              text-sm font-black uppercase tracking-widest
              shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40
              transition-all hover:scale-105 active:scale-95
              w-full sm:w-auto
            "
                    >
                        <Compass className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                        Take the Tour
                    </button>

                    {/* Secondary: Log First Session */}
                    <button
                        id="welcome-banner-log-session"
                        data-navigate="/wellness-journey"
                        className="
              flex items-center justify-center gap-2.5
              px-6 py-3.5 rounded-2xl
              bg-slate-800/60 hover:bg-slate-700/60
              border border-slate-600/50 hover:border-slate-500/60
              text-slate-300 text-sm font-black uppercase tracking-widest
              transition-all hover:scale-105 active:scale-95
              w-full sm:w-auto
            "
                        onClick={() => {
                            // Dismiss banner and navigate to wellness journey
                            onDismiss();
                            setTimeout(() => {
                                window.location.hash = '/wellness-journey';
                            }, 50);
                        }}
                    >
                        Log First Session
                        <ArrowRight className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                    </button>
                </div>
            </div>

            {/* Dismiss link — below CTA block on mobile, subtle */}
            <div className="relative z-10 mt-5 flex items-center gap-1">
                <button
                    onClick={onDismiss}
                    className="ppn-meta text-slate-600 hover:text-slate-400 transition-colors underline underline-offset-2 decoration-slate-700 hover:decoration-slate-500 bg-transparent border-0 p-0 cursor-pointer"
                >
                    Skip for now, I'll explore on my own
                </button>
            </div>
        </div>
    );
};

export default WelcomeHeroBanner;
