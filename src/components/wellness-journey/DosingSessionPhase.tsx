import React, { useState } from 'react';
import { Activity, Sparkles, CheckCircle, ChevronDown, ChevronUp, X, Info } from 'lucide-react';
import { AdvancedTooltip } from '../ui/AdvancedTooltip';
import AdaptiveAssessmentPage from '../../pages/AdaptiveAssessmentPage';

interface DosingSessionPhaseProps {
    journey: any;
}

export const DosingSessionPhase: React.FC<DosingSessionPhaseProps> = ({ journey }) => {
    const [showAI, setShowAI] = useState(false);
    const [showAssessmentModal, setShowAssessmentModal] = useState(false);
    const [showMetricsInfo, setShowMetricsInfo] = useState(false);
    const [showSessionInfo, setShowSessionInfo] = useState(false);
    const [assessmentCompleted, setAssessmentCompleted] = useState(false);
    const [assessmentScores, setAssessmentScores] = useState<{
        meq: number;
        edi: number;
        ceq: number;
    } | null>(null);

    // Helper: Progress bar component
    const ProgressBar: React.FC<{ value: number; max: number; color: string; label: string }> = ({ value, max, color, label }) => {
        const percentage = (value / max) * 100;
        return (
            <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">{label}</span>
                    <span className={`font-bold ${color}`}>{value}/{max}</span>
                </div>
                <div className="h-2 bg-slate-900/60 rounded-full overflow-hidden">
                    <div
                        className={`h-full ${color.replace('text-', 'bg-')} transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                    />
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {/* Combined Session Details & Safety Card */}
            <div className="bg-gradient-to-br from-amber-500/10 to-amber-900/10 border-2 border-amber-500/50 rounded-3xl p-6 relative">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <Activity className="w-6 h-6 text-amber-400" />
                        <h3 className="text-xl font-black text-amber-300">Session Details</h3>
                    </div>
                    <button
                        onClick={() => setShowSessionInfo(!showSessionInfo)}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-amber-500/20 hover:bg-amber-500/30 transition-colors"
                        aria-label="Session information"
                    >
                        <Info className="w-4 h-4 text-amber-300" />
                    </button>
                </div>

                {/* Info Modal */}
                {showSessionInfo && (
                    <div className="mb-4 p-4 bg-slate-900/60 rounded-xl border border-amber-500/30">
                        <p className="text-slate-300 text-sm leading-relaxed">
                            This section records the substance, dosage, and safety events from the dosing session. All safety events should be documented and resolved before proceeding to integration.
                        </p>
                    </div>
                )}

                {/* Session Info & Safety in 2-column grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Session Info */}
                    <div className="p-4 bg-slate-900/40 rounded-xl space-y-2">
                        <p className="text-slate-200 font-semibold text-sm">{journey.session.substance} {journey.session.dosage}</p>
                        <p className="text-slate-400 text-sm">Session #{journey.session.sessionNumber}</p>
                        <p className="text-slate-500 text-sm">Oct 15, 2025 • 8 hours</p>
                    </div>

                    {/* Safety Info */}
                    <div className="p-4 bg-slate-900/40 rounded-xl space-y-2">
                        <p className="text-amber-200 text-sm font-bold uppercase tracking-wide">Safety</p>
                        <p className="text-slate-200 text-sm">✓ {journey.session.safetyEvents} events (resolved)</p>
                        <p className="text-slate-200 text-sm">✓ No chemical rescue</p>
                    </div>
                </div>
            </div>

            {/* Experience Metrics - MOVED UP, with visible explanations for mobile */}
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 relative">
                <div className="flex items-center justify-between mb-1">
                    <h3 className="text-lg font-bold text-slate-200">Experience Metrics</h3>
                    <button
                        onClick={() => setShowMetricsInfo(!showMetricsInfo)}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-700/50 hover:bg-slate-700/70 transition-colors"
                        aria-label="Metrics information"
                    >
                        <Info className="w-4 h-4 text-slate-300" />
                    </button>
                </div>

                <p className="text-slate-400 text-sm mb-5">Standardized assessments measuring the quality and depth of the psychedelic experience</p>

                {/* Info Modal */}
                {showMetricsInfo && (
                    <div className="mb-5 p-4 bg-slate-800/60 rounded-xl border border-slate-600/50">
                        <p className="text-slate-300 text-sm leading-relaxed mb-3">
                            These validated psychometric instruments measure different aspects of the psychedelic experience:
                        </p>
                        <ul className="space-y-2 text-sm text-slate-400">
                            <li className="flex gap-2">
                                <span className="text-emerald-400">•</span>
                                <span><strong className="text-slate-300">MEQ-30:</strong> Measures mystical-type experiences, which predict long-term therapeutic outcomes</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="text-emerald-400">•</span>
                                <span><strong className="text-slate-300">EDI:</strong> Quantifies ego dissolution intensity, a key mechanism of psychedelic therapy</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="text-amber-400">•</span>
                                <span><strong className="text-slate-300">CEQ:</strong> Identifies challenging experiences that may require additional integration support</span>
                            </li>
                        </ul>
                    </div>
                )}

                <div className="space-y-6">
                    {/* MEQ-30 */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-300 font-semibold">MEQ-30 (Mystical Experience)</span>
                            <span className="font-bold text-emerald-400">{journey.session.meq30Score}/100</span>
                        </div>
                        <div className="h-2 bg-slate-900/60 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-emerald-400 transition-all duration-500"
                                style={{ width: `${journey.session.meq30Score}%` }}
                            />
                        </div>
                        <p className="text-slate-500 text-sm leading-relaxed">
                            Scores ≥60 indicate a "complete mystical experience" and correlate with 87% remission rate at 6 months.
                        </p>
                    </div>

                    {/* EDI */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-300 font-semibold">EDI (Ego Dissolution)</span>
                            <span className="font-bold text-emerald-400">{journey.session.ediScore}/100</span>
                        </div>
                        <div className="h-2 bg-slate-900/60 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-emerald-400 transition-all duration-500"
                                style={{ width: `${journey.session.ediScore}%` }}
                            />
                        </div>
                        <p className="text-slate-500 text-sm leading-relaxed">
                            Measures the intensity of ego dissolution during the experience. Scores ≥70 indicate high ego dissolution.
                        </p>
                    </div>

                    {/* CEQ */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-300 font-semibold">CEQ (Challenging Experience)</span>
                            <span className="font-bold text-amber-400">{journey.session.ceqScore}/100</span>
                        </div>
                        <div className="h-2 bg-slate-900/60 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-amber-400 transition-all duration-500"
                                style={{ width: `${journey.session.ceqScore}%` }}
                            />
                        </div>
                        <p className="text-slate-500 text-sm leading-relaxed">
                            Scores 30-50 indicate moderately challenging experience. Higher scores may require additional integration support.
                        </p>
                    </div>
                </div>
            </div>

            {/* Assessment Button or Completed State - MOVED TO BOTTOM */}
            {!assessmentCompleted ? (
                <div className="space-y-3">
                    <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                        <p className="text-blue-300 text-sm font-semibold mb-1">Next Step</p>
                        <p className="text-slate-400 text-sm">Complete the post-session assessments to record the patient's experience and generate outcome predictions.</p>
                    </div>
                    <button
                        onClick={() => setShowAssessmentModal(true)}
                        className="w-full flex items-center justify-center gap-3 px-5 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl font-bold text-base transition-all shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/40 hover:scale-[1.01] active:scale-[0.99]"
                    >
                        <Sparkles className="w-5 h-5" />
                        Complete Post-Session Assessments
                    </button>
                </div>
            ) : (
                <div className="p-5 bg-emerald-500/10 border-2 border-emerald-500/30 rounded-xl">
                    <div className="flex items-center gap-2 mb-3">
                        <CheckCircle className="w-6 h-6 text-emerald-400" />
                        <span className="text-emerald-300 font-bold text-base">Post-Session Assessments Complete</span>
                    </div>
                    {assessmentScores && (
                        <div className="space-y-2 text-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-slate-400">MEQ-30 (Mystical)</span>
                                <span className="text-emerald-400 font-bold">{assessmentScores.meq}/100</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-slate-400">EDI (Ego Dissolution)</span>
                                <span className="text-blue-400 font-bold">{assessmentScores.edi}/100</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-slate-400">CEQ (Challenging)</span>
                                <span className="text-amber-400 font-bold">{assessmentScores.ceq}/100</span>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Collapsible AI Panel */}
            <button
                onClick={() => setShowAI(!showAI)}
                className="w-full p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center justify-between hover:bg-blue-500/20 transition-colors group"
            >
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded bg-blue-500/20 flex items-center justify-center">
                        <span className="text-blue-400 text-xs font-bold">AI</span>
                    </div>
                    <span className="text-blue-300 text-sm font-semibold">Outcome Prediction</span>
                    <span className="text-blue-400 text-sm">(1,247 patients)</span>
                </div>
                {showAI ? <ChevronUp className="w-4 h-4 text-blue-400" /> : <ChevronDown className="w-4 h-4 text-blue-400 group-hover:animate-bounce" />}
            </button>

            {showAI && (
                <div className="space-y-2 animate-in slide-in-from-top duration-300">
                    <div className="p-3 bg-slate-900/40 rounded-lg">
                        <p className="text-sm text-slate-400 mb-1">6-Month Remission Rate</p>
                        <p className="text-emerald-400 text-sm font-bold">89% achieved PHQ-9 &lt; 5</p>
                        <p className="text-slate-500 text-sm mt-1">Among patients with MEQ ≥ 70</p>
                    </div>
                    <div className="p-3 bg-slate-900/40 rounded-lg">
                        <p className="text-sm text-slate-400 mb-1">Sustained Benefit</p>
                        <p className="text-emerald-400 text-sm font-bold">76% maintained gains at 12 months</p>
                        <p className="text-slate-500 text-sm mt-1">Only 2% relapsed</p>
                    </div>
                    <div className="p-3 bg-slate-900/40 rounded-lg">
                        <p className="text-sm text-slate-400 mb-1">Integration Pattern</p>
                        <p className="text-blue-400 text-sm font-bold">Standard protocol (6 sessions)</p>
                        <p className="text-slate-500 text-sm mt-1">CEQ 30-40: 78% success</p>
                    </div>
                    <AdvancedTooltip
                        content="Historical data for context only. Provider determines treatment approach."
                        tier="standard"
                        type="warning"
                    >
                        <div className="flex items-center justify-center gap-1 text-slate-500 text-sm cursor-help hover:text-slate-400 transition-colors">
                            <span>⚠️</span>
                            <span className="italic">Provider determines approach</span>
                        </div>
                    </AdvancedTooltip>
                </div>
            )}

            {/* Assessment Modal */}
            {showAssessmentModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-gradient-to-b from-[#0a1628] via-[#0d1b2a] to-[#05070a] rounded-2xl shadow-2xl">
                        {/* Close button */}
                        <button
                            onClick={() => setShowAssessmentModal(false)}
                            className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-slate-800/80 hover:bg-slate-700 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5 text-slate-300" />
                        </button>

                        {/* Assessment content */}
                        <div className="p-6">
                            <AdaptiveAssessmentPage
                                showBackButton={false}
                                onComplete={(scores) => {
                                    // Update state with scores
                                    setAssessmentScores(scores);
                                    setAssessmentCompleted(true);
                                    // Close modal after a brief delay to show completion
                                    setTimeout(() => {
                                        setShowAssessmentModal(false);
                                    }, 3000);
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
