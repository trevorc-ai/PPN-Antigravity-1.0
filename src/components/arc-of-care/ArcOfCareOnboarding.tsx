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
    const handleDontShowAgain = () => {
        localStorage.setItem('arcOfCareOnboardingSeen', 'true');
        onClose();
    };

    const handleGetStarted = () => {
        localStorage.setItem('arcOfCareOnboardingSeen', 'true');
        onGetStarted();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div
                className="relative w-full max-w-4xl mx-4 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden"
                role="dialog"
                aria-labelledby="onboarding-title"
                aria-modal="true"
            >
                {/* Close Button */}
                <button
                    onClick={handleDontShowAgain}
                    className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-300 hover:bg-slate-800 rounded-lg transition-colors z-10"
                    aria-label="Close onboarding"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Header */}
                <div className="p-8 pb-6 bg-gradient-to-br from-blue-600/20 to-emerald-600/20 border-b border-slate-700">
                    <h2
                        id="onboarding-title"
                        className="text-3xl font-black text-slate-300 mb-3"
                    >
                        Welcome to the Wellness Journey
                    </h2>
                    <p className="text-lg text-slate-300">
                        Track complete patient progress across 3 phases of psychedelic-assisted therapy
                    </p>
                </div>

                {/* Content */}
                <div className="p-8">
                    {/* 3-Phase Visual Guide */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {/* Phase 1 */}
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-4 bg-blue-500/20 rounded-full flex items-center justify-center">
                                <span className="text-3xl font-black text-blue-400">1</span>
                            </div>
                            <h3 className="text-lg font-bold text-slate-300 mb-2">
                                Phase 1: Preparation
                            </h3>
                            <p className="text-sm text-slate-400">
                                Baseline assessments, safety screening, and set & setting preparation
                            </p>
                        </div>

                        {/* Phase 2 */}
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-4 bg-emerald-500/20 rounded-full flex items-center justify-center">
                                <span className="text-3xl font-black text-emerald-400">2</span>
                            </div>
                            <h3 className="text-lg font-bold text-slate-300 mb-2">
                                Phase 2: Dosing Session
                            </h3>
                            <p className="text-sm text-slate-400">
                                Real-time vitals monitoring, subjective experience tracking, and safety protocols
                            </p>
                        </div>

                        {/* Phase 3 */}
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-4 bg-purple-500/20 rounded-full flex items-center justify-center">
                                <span className="text-3xl font-black text-purple-400">3</span>
                            </div>
                            <h3 className="text-lg font-bold text-slate-300 mb-2">
                                Phase 3: Integration
                            </h3>
                            <p className="text-sm text-slate-400">
                                Longitudinal tracking, symptom decay curves, and behavioral change documentation
                            </p>
                        </div>
                    </div>

                    {/* Key Benefits */}
                    <div className="bg-slate-800/50 rounded-xl p-6 mb-8">
                        <h3 className="text-lg font-bold text-slate-300 mb-4">
                            Why Use the Wellness Journey?
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-blue-500/20 rounded-lg flex-shrink-0">
                                    <Target className="w-5 h-5 text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-slate-300 mb-1">
                                        Predict Outcomes
                                    </p>
                                    <p className="text-sm text-slate-400">
                                        Algorithm-based predictions for integration needs
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-emerald-500/20 rounded-lg flex-shrink-0">
                                    <Shield className="w-5 h-5 text-emerald-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-slate-300 mb-1">
                                        Ensure Safety
                                    </p>
                                    <p className="text-sm text-slate-400">
                                        Real-time vitals and rescue protocol tracking
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-purple-500/20 rounded-lg flex-shrink-0">
                                    <TrendingUp className="w-5 h-5 text-purple-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-slate-300 mb-1">
                                        Prove Value
                                    </p>
                                    <p className="text-sm text-slate-400">
                                        Longitudinal data for insurance and research
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            onClick={handleGetStarted}
                            className="flex-1 px-6 py-4 bg-emerald-600 hover:bg-emerald-700 text-slate-300 font-bold rounded-lg transition-colors focus:outline-none focus:ring-4 focus:ring-emerald-500/50"
                            tabIndex={1}
                        >
                            Get Started with Phase 1
                        </button>
                        <button
                            onClick={handleDontShowAgain}
                            className="px-6 py-4 bg-slate-700 hover:bg-slate-600 text-slate-300 font-medium rounded-lg transition-colors focus:outline-none focus:ring-4 focus:ring-slate-500/50"
                            tabIndex={2}
                        >
                            Don't Show Again
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
