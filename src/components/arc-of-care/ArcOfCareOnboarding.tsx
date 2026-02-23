import React from 'react';
import { X, Target, Shield, TrendingUp } from 'lucide-react';

export interface ArcOfCareOnboardingProps {
    onClose: () => void;
    onGetStarted: () => void;
}

/**
 * Arc of Care Onboarding Modal
 * 
 * First-time user onboarding explaining the 3-phase workflow
 * 
 * Features:
 * - 3-phase visual guide
 * - Key benefits section
 * - "Get Started" and "Don't show again" CTAs
 * - Accessible (keyboard navigation, ARIA labels)
 */
export const ArcOfCareOnboarding: React.FC<ArcOfCareOnboardingProps> = ({
    onClose,
    onGetStarted
}) => {
    const [dontShowAgain, setDontShowAgain] = React.useState(false);

    const handleClose = () => {
        if (dontShowAgain) {
            localStorage.setItem('arcOfCareOnboardingSeen', 'true');
        }
        onClose();
    };

    const handleGetStarted = () => {
        if (dontShowAgain) {
            localStorage.setItem('arcOfCareOnboardingSeen', 'true');
        }
        onGetStarted();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div
                className="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col"
                style={{ maxHeight: '95dvh' }}
                role="dialog"
                aria-labelledby="onboarding-title"
                aria-modal="true"
            >
                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 flex items-center justify-center w-11 h-11 text-slate-400 hover:text-slate-300 hover:bg-slate-800 rounded-xl transition-colors z-10"
                    aria-label="Close onboarding"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Header — fixed, never scrolls away */}
                <div className="flex-shrink-0 px-6 pt-8 pb-5 bg-gradient-to-br from-blue-600/20 to-emerald-600/20 border-b border-slate-700 rounded-t-2xl">
                    <h2
                        id="onboarding-title"
                        className="text-2xl font-black text-slate-300 mb-2 pr-8"
                    >
                        Welcome to the Wellness Journey - Here's what to expect:
                    </h2>
                    <p className="text-base text-slate-400">
                        You'll track complete patient progress across 3 phases of psychedelic-assisted therapy.
                    </p>
                </div>

                {/* Scrollable content — phases */}
                <div className="flex-1 overflow-y-auto px-6 py-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {/* Phase 1 */}
                        <div className="flex items-start gap-4 md:flex-col md:text-center md:items-center p-4 rounded-xl bg-slate-800/40 border border-slate-700/50">
                            <div className="w-14 h-14 flex-shrink-0 bg-blue-500/20 rounded-full flex items-center justify-center md:mx-auto">
                                <span className="text-2xl font-black text-blue-400">1</span>
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-[#A8B5D1] mb-1">
                                    Preparation
                                </h3>
                                <p className="text-sm text-slate-400 leading-relaxed">
                                    Baseline assessments, safety screening, and set &amp; setting preparation
                                </p>
                            </div>
                        </div>

                        {/* Phase 2 */}
                        <div className="flex items-start gap-4 md:flex-col md:text-center md:items-center p-4 rounded-xl bg-slate-800/40 border border-slate-700/50">
                            <div className="w-14 h-14 flex-shrink-0 bg-emerald-500/20 rounded-full flex items-center justify-center md:mx-auto">
                                <span className="text-2xl font-black text-emerald-400">2</span>
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-[#A8B5D1] mb-1">
                                    Dosing Session
                                </h3>
                                <p className="text-sm text-slate-400 leading-relaxed">
                                    Real-time vitals monitoring, subjective experience tracking, and safety protocols
                                </p>
                            </div>
                        </div>

                        {/* Phase 3 */}
                        <div className="flex items-start gap-4 md:flex-col md:text-center md:items-center p-4 rounded-xl bg-slate-800/40 border border-slate-700/50">
                            <div className="w-14 h-14 flex-shrink-0 bg-purple-500/20 rounded-full flex items-center justify-center md:mx-auto">
                                <span className="text-2xl font-black text-purple-400">3</span>
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-[#A8B5D1] mb-1">
                                    Integration
                                </h3>
                                <p className="text-sm text-slate-400 leading-relaxed">
                                    Longitudinal tracking, symptom decay curves, and behavioral change documentation
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTAs — pinned to bottom, always visible */}
                <div className="flex-shrink-0 px-6 py-4 border-t border-slate-700/60 bg-slate-900 rounded-b-2xl flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer group">
                        <div className="relative flex items-center justify-center">
                            <input
                                type="checkbox"
                                checked={dontShowAgain}
                                onChange={(e) => setDontShowAgain(e.target.checked)}
                                className="peer appearance-none w-5 h-5 border-2 border-slate-600 rounded bg-slate-800 checked:bg-indigo-500 checked:border-indigo-500 transition-colors focus:ring-2 focus:ring-indigo-500/50 outline-none"
                            />
                            <svg className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <span className="text-sm font-medium text-slate-400 group-hover:text-slate-300 transition-colors select-none">
                            Don't show me this again
                        </span>
                    </label>

                    <div className="flex gap-3 w-full sm:w-auto">
                        <button
                            onClick={handleGetStarted}
                            className="flex-1 sm:flex-none px-8 py-3 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-bold text-sm rounded-xl transition-colors focus:outline-none focus:ring-4 focus:ring-indigo-500/50"
                            tabIndex={1}
                        >
                            Get Started
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
