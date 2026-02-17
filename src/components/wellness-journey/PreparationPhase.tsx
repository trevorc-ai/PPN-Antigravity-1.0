import React, { useState } from 'react';
import { Calendar, Brain, TrendingUp, Shield, ChevronDown, ChevronUp, CheckCircle } from 'lucide-react';
import { AdvancedTooltip } from '../ui/AdvancedTooltip';

interface PreparationPhaseProps {
    journey: any; // Use your existing journey data type
}

export const PreparationPhase: React.FC<PreparationPhaseProps> = ({ journey }) => {
    const [showAI, setShowAI] = useState(false);
    const [showBenchmarks, setShowBenchmarks] = useState(false);

    // Helper: Get severity label and emoji
    const getSeverityInfo = (score: number, type: 'phq9' | 'gad7') => {
        if (type === 'phq9') {
            if (score >= 20) return { label: 'Severe Depression', emoji: '😰', color: 'text-red-400' };
            if (score >= 15) return { label: 'Moderately Severe Depression', emoji: '😔', color: 'text-orange-400' };
            if (score >= 10) return { label: 'Moderate Depression', emoji: '😟', color: 'text-amber-400' };
            if (score >= 5) return { label: 'Mild Depression', emoji: '😕', color: 'text-yellow-400' };
            return { label: 'Minimal Depression', emoji: '😊', color: 'text-emerald-400' };
        } else {
            if (score >= 15) return { label: 'Severe Anxiety', emoji: '😰', color: 'text-red-400' };
            if (score >= 10) return { label: 'Moderate Anxiety', emoji: '😟', color: 'text-amber-400' };
            if (score >= 5) return { label: 'Mild Anxiety', emoji: '😕', color: 'text-yellow-400' };
            return { label: 'Minimal Anxiety', emoji: '😊', color: 'text-emerald-400' };
        }
    };

    const phq9Info = getSeverityInfo(journey.baseline.phq9, 'phq9');
    const gad7Info = getSeverityInfo(journey.baseline.gad7, 'gad7');

    return (
        <div className="space-y-6">
            {/* Baseline Metrics Card */}
            <div className="bg-gradient-to-br from-red-500/10 to-red-900/10 border-2 border-red-500/50 rounded-3xl p-6 space-y-4">
                <div className="flex items-center gap-3 mb-4">
                    <Brain className="w-6 h-6 text-red-400" />
                    <h3 className="text-xl font-black text-red-300">Baseline Metrics</h3>
                </div>

                {/* Grid of 4 metric cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* PHQ-9 */}
                    <AdvancedTooltip
                        content={`PHQ-9: ${journey.baseline.phq9} - ${phq9Info.label}. Patient Health Questionnaire measures depression severity on a 0-27 scale.`}
                        tier="standard"
                        type="clinical"
                        title="PHQ-9"
                    >
                        <div className="p-4 bg-slate-900/40 rounded-2xl flex flex-col items-center justify-center cursor-help hover:bg-slate-900/60 transition-colors">
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <span className={`text-3xl ${phq9Info.color}`}>{phq9Info.emoji}</span>
                                <span className={`text-4xl font-black ${phq9Info.color}`}>{journey.baseline.phq9}</span>
                            </div>
                            <div className="text-sm text-slate-300 font-semibold">PHQ-9</div>
                        </div>
                    </AdvancedTooltip>

                    {/* GAD-7 */}
                    <AdvancedTooltip
                        content={`GAD-7: ${journey.baseline.gad7} - ${gad7Info.label}. Generalized Anxiety Disorder scale measures anxiety severity on a 0-21 scale.`}
                        tier="standard"
                        type="clinical"
                        title="GAD-7"
                    >
                        <div className="p-4 bg-slate-900/40 rounded-2xl flex flex-col items-center justify-center cursor-help hover:bg-slate-900/60 transition-colors">
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <span className={`text-3xl ${gad7Info.color}`}>{gad7Info.emoji}</span>
                                <span className={`text-4xl font-black ${gad7Info.color}`}>{journey.baseline.gad7}</span>
                            </div>
                            <div className="text-sm text-slate-300 font-semibold">GAD-7</div>
                        </div>
                    </AdvancedTooltip>

                    {/* ACE Score */}
                    <AdvancedTooltip
                        content={`ACE Score: ${journey.baseline.aceScore}. Adverse Childhood Experiences score (0-10). Higher scores correlate with increased trauma and may predict challenging experiences during therapy.`}
                        tier="standard"
                        type="warning"
                        title="ACE Score"
                    >
                        <div className="p-4 bg-slate-900/40 rounded-2xl flex flex-col items-center justify-center cursor-help hover:bg-slate-900/60 transition-colors">
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <span className="text-3xl">⚠️</span>
                                <span className="text-4xl font-black text-amber-400">{journey.baseline.aceScore}</span>
                            </div>
                            <div className="text-sm text-slate-300 font-semibold">ACE</div>
                        </div>
                    </AdvancedTooltip>

                    {/* Expectancy */}
                    <AdvancedTooltip
                        content={`Expectancy: ${journey.baseline.expectancy}/100 - High. Patient's belief in treatment efficacy. High expectancy (>75) correlates with 25% better outcomes.`}
                        tier="standard"
                        type="success"
                        title="Expectancy"
                    >
                        <div className="p-4 bg-slate-900/40 rounded-2xl flex flex-col items-center justify-center cursor-help hover:bg-slate-900/60 transition-colors">
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <span className="text-3xl">✨</span>
                                <span className="text-4xl font-black text-emerald-400">{journey.baseline.expectancy}</span>
                            </div>
                            <div className="text-sm text-slate-300 font-semibold">Expect</div>
                        </div>
                    </AdvancedTooltip>
                </div>
            </div>

            {/* Predictions Card */}
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6">
                <div className="flex items-center gap-3 mb-4">
                    <TrendingUp className="w-6 h-6 text-emerald-400" />
                    <h3 className="text-xl font-black text-slate-300">Predicted Outcomes</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                        <div className="text-sm text-slate-300 mb-2">Success Rate</div>
                        <div className="text-3xl font-black text-emerald-400">72%</div>
                        <div className="text-xs text-slate-500 mt-2">Based on similar profiles</div>
                    </div>

                    <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
                        <div className="text-sm text-slate-300 mb-2">Challenging Experience</div>
                        <div className="text-3xl font-black text-amber-400">45%</div>
                        <div className="text-xs text-slate-500 mt-2">Likelihood of difficult moments</div>
                    </div>
                </div>
            </div>

            {/* Collapsible AI Panel */}
            <button
                onClick={() => setShowAI(!showAI)}
                className="w-full p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center justify-between hover:bg-blue-500/20 transition-colors group"
            >
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded bg-blue-500/20 flex items-center justify-center">
                        <span className="text-blue-400 text-xs font-bold">AI</span>
                    </div>
                    <span className="text-blue-300 text-sm font-semibold">Statistical Insights</span>
                    <span className="text-blue-400 text-sm">(2,847 patients)</span>
                </div>
                {showAI ? <ChevronUp className="w-4 h-4 text-blue-400" /> : <ChevronDown className="w-4 h-4 text-blue-400 group-hover:animate-bounce" />}
            </button>

            {showAI && (
                <div className="space-y-2 animate-in slide-in-from-top duration-300">
                    <div className="p-3 bg-slate-900/40 rounded-lg">
                        <p className="text-sm text-slate-300 mb-1">Historical Success Rate</p>
                        <p className="text-emerald-400 text-sm font-bold">72% achieved remission (PHQ-9 &lt; 5)</p>
                        <p className="text-slate-500 text-sm mt-1">At 6-month follow-up</p>
                    </div>
                    <div className="p-3 bg-slate-900/40 rounded-lg">
                        <p className="text-sm text-slate-300 mb-1">Experience Pattern</p>
                        <p className="text-amber-400 text-sm font-bold">45% experienced challenging moments</p>
                        <p className="text-slate-500 text-sm mt-1">CEQ score &gt; 50 during session</p>
                    </div>
                    <div className="p-3 bg-slate-900/40 rounded-lg">
                        <p className="text-sm text-slate-300 mb-1">Integration Pattern</p>
                        <p className="text-blue-400 text-sm font-bold">Average: 6 sessions over 6 months</p>
                        <p className="text-slate-500 text-sm mt-1">Among patients with ACE ≥ 4</p>
                    </div>
                    <AdvancedTooltip
                        content="This system provides statistical data and historical patterns for informational purposes only. It does not provide medical advice, diagnosis, or treatment recommendations. All clinical decisions remain the sole responsibility of the licensed healthcare provider."
                        tier="standard"
                        type="warning"
                        title="Legal Disclaimer"
                    >
                        <div className="flex items-center justify-center gap-1 text-slate-500 text-sm cursor-help hover:text-slate-300 transition-colors">
                            <span>⚠️</span>
                            <span className="italic">For informational purposes only</span>
                        </div>
                    </AdvancedTooltip>
                </div>
            )}

            {/* Collapsible Benchmarks */}
            <button
                onClick={() => setShowBenchmarks(!showBenchmarks)}
                className="w-full p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg flex items-center justify-between hover:bg-purple-500/20 transition-colors group"
            >
                <span className="text-purple-300 text-sm font-semibold">Comparative Benchmarks</span>
                {showBenchmarks ? <ChevronUp className="w-4 h-4 text-purple-400" /> : <ChevronDown className="w-4 h-4 text-purple-400 group-hover:animate-bounce" />}
            </button>

            {showBenchmarks && (
                <div className="space-y-3 animate-in slide-in-from-top duration-300">
                    <div className="space-y-1">
                        <p className="text-sm text-slate-300 mb-2">PHQ-9 Comparison</p>
                        <div className="flex items-center gap-2 text-sm">
                            <span className="w-16 text-slate-500">You</span>
                            <div className="flex-1 h-2 bg-slate-900/60 rounded-full overflow-hidden">
                                <div className="h-full bg-red-400" style={{ width: `${(journey.baseline.phq9 / 27) * 100}%` }} />
                            </div>
                            <span className="w-8 text-red-400 font-bold">{journey.baseline.phq9}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <span className="w-16 text-slate-500">Clinic</span>
                            <div className="flex-1 h-2 bg-slate-900/60 rounded-full overflow-hidden">
                                <div className="h-full bg-slate-400" style={{ width: `${(18 / 27) * 100}%` }} />
                            </div>
                            <span className="w-8 text-slate-300">18</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <span className="w-16 text-slate-500">Global</span>
                            <div className="flex-1 h-2 bg-slate-900/60 rounded-full overflow-hidden">
                                <div className="h-full bg-slate-400" style={{ width: `${(17 / 27) * 100}%` }} />
                            </div>
                            <span className="w-8 text-slate-300">17</span>
                        </div>
                    </div>
                    <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded text-sm text-emerald-300">
                        💡 High expectancy (85) correlates with 25% better outcomes
                    </div>
                </div>
            )}
        </div>
    );
};
