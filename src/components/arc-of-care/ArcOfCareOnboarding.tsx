import React from 'react';
import { ArrowLeft } from 'lucide-react';

export interface ArcOfCareOnboardingProps {
    onClose: () => void;
    onGetStarted: () => void;
}

/**
 * Arc of Care Onboarding Modal
 *
 * First-time user onboarding explaining the 3-phase workflow.
 * Fixed UX: "← Back to Dashboard" strip replaces the hidden top-left X icon.
 */
export const ArcOfCareOnboarding: React.FC<ArcOfCareOnboardingProps> = ({
    onClose,
    onGetStarted,
}) => {
    const [dontShowAgain, setDontShowAgain] = React.useState(false);

    // Escape key closes
    React.useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose(); };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dontShowAgain]);

    const handleClose = () => {
        if (dontShowAgain) localStorage.setItem('arcOfCareOnboardingSeen', 'true');
        onClose();
    };

    const handleGetStarted = () => {
        if (dontShowAgain) localStorage.setItem('arcOfCareOnboardingSeen', 'true');
        onGetStarted();
    };

    return (
        // Backdrop — tap outside to close
        <div
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/75 backdrop-blur-sm p-4"
            onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
        >
            <div
                className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col"
                style={{ maxHeight: '95dvh' }}
                role="dialog"
                aria-labelledby="onboarding-title"
                aria-modal="true"
            >
                {/* ── BACK BAR — unmissable on every screen size ─────────────── */}
                <button
                    onClick={handleClose}
                    aria-label="Go back to Dashboard"
                    className="
                        flex items-center gap-2.5
                        w-full px-5 py-3.5
                        bg-slate-800/80 hover:bg-slate-700/80
                        border-b border-slate-700/60
                        rounded-t-2xl
                        text-slate-400 hover:text-white
                        text-sm font-bold
                        transition-colors
                        group
                    "
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" aria-hidden="true" />
                    Back to Dashboard
                </button>

                {/* ── Header ────────────────────────────────────────────────── */}
                <div className="flex-shrink-0 px-6 pt-7 pb-5 bg-gradient-to-br from-blue-600/20 to-emerald-600/20 border-b border-slate-700">
                    <h2
                        id="onboarding-title"
                        className="text-2xl font-black text-slate-200 mb-2"
                    >
                        Welcome to the Wellness Journey
                    </h2>
                    <p className="text-sm text-slate-400 leading-relaxed">
                        Track complete patient progress across 3 phases of psychedelic-assisted therapy.
                    </p>
                </div>

                {/* ── Phase cards ───────────────────────────────────────────── */}
                <div className="flex-1 overflow-y-auto px-6 py-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                        {/* Phase 1 */}
                        <div className="flex items-start gap-4 md:flex-col md:items-center p-5 rounded-2xl bg-blue-500/5 border border-blue-500/20">
                            <div className="w-14 h-14 flex-shrink-0 bg-blue-500/20 rounded-2xl flex items-center justify-center">
                                <span className="text-2xl font-black text-blue-400">1</span>
                            </div>
                            <div className="md:text-center">
                                <h3 className="text-base font-black text-[#A8B5D1] mb-1">Preparation</h3>
                                <p className="text-sm text-slate-400 leading-relaxed">
                                    Baseline assessments, safety screening, and set &amp; setting preparation
                                </p>
                            </div>
                        </div>

                        {/* Phase 2 */}
                        <div className="flex items-start gap-4 md:flex-col md:items-center p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20">
                            <div className="w-14 h-14 flex-shrink-0 bg-emerald-500/20 rounded-2xl flex items-center justify-center">
                                <span className="text-2xl font-black text-emerald-400">2</span>
                            </div>
                            <div className="md:text-center">
                                <h3 className="text-base font-black text-[#A8B5D1] mb-1">Dosing Session</h3>
                                <p className="text-sm text-slate-400 leading-relaxed">
                                    Real-time vitals monitoring, subjective experience tracking, and safety protocols
                                </p>
                            </div>
                        </div>

                        {/* Phase 3 */}
                        <div className="flex items-start gap-4 md:flex-col md:items-center p-5 rounded-2xl bg-purple-500/5 border border-purple-500/20">
                            <div className="w-14 h-14 flex-shrink-0 bg-purple-500/20 rounded-2xl flex items-center justify-center">
                                <span className="text-2xl font-black text-purple-400">3</span>
                            </div>
                            <div className="md:text-center">
                                <h3 className="text-base font-black text-[#A8B5D1] mb-1">Integration</h3>
                                <p className="text-sm text-slate-400 leading-relaxed">
                                    Longitudinal tracking, symptom decay curves, and behavioral change documentation
                                </p>
                            </div>
                        </div>

                    </div>
                </div>

                {/* ── CTAs — pinned to bottom ───────────────────────────────── */}
                <div className="flex-shrink-0 px-6 py-4 border-t border-slate-700/60 bg-slate-900 rounded-b-2xl flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <label className="flex items-center gap-2.5 cursor-pointer group select-none">
                        <div className="relative flex items-center justify-center flex-shrink-0">
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
                        <span className="text-sm font-medium text-slate-400 group-hover:text-slate-300 transition-colors">
                            Don't show me this again
                        </span>
                    </label>

                    <button
                        onClick={handleGetStarted}
                        className="w-full sm:w-auto px-8 py-3 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-black text-sm rounded-xl transition-colors focus:outline-none focus:ring-4 focus:ring-indigo-500/50"
                    >
                        Get Started →
                    </button>
                </div>
            </div>
        </div>
    );
};
