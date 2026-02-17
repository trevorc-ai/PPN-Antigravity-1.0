import React from 'react';
import { Brain, Heart, Shield, Calendar } from 'lucide-react';
import { AdvancedTooltip } from '../ui/AdvancedTooltip';
import ExpectancyScaleGauge from './ExpectancyScaleGauge.tsx';
import ACEScoreBarChart from './ACEScoreBarChart.tsx';
import GAD7SeverityZones from './GAD7SeverityZones.tsx';
import PredictedIntegrationNeeds from './PredictedIntegrationNeeds.tsx';

interface SetAndSettingCardProps {
    expectancyScale: number; // 1-100
    aceScore: number; // 0-10
    gad7Score: number; // 0-21
    phq9Score?: number; // 0-27 (optional, for integration prediction)
    onScheduleSessions?: () => void;
}

/**
 * SetAndSettingCard - Phase 1: Protocol Builder Component
 * 
 * Displays baseline "Set & Setting" analysis including:
 * - Treatment expectancy (belief in therapy)
 * - ACE score (childhood trauma)
 * - GAD-7 anxiety severity
 * - Predicted integration needs
 * 
 * Part of Wellness Journey system (WO_042)
 */
const SetAndSettingCard: React.FC<SetAndSettingCardProps> = ({
    expectancyScale,
    aceScore,
    gad7Score,
    phq9Score = 0,
    onScheduleSessions
}) => {
    return (
        <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-500/10 rounded-lg">
                        <Brain className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                        <h3 className="text-slate-200 text-lg font-semibold">Set & Setting Analysis</h3>
                        <p className="text-slate-400 text-sm">Baseline psychological profile</p>
                    </div>
                </div>

                <AdvancedTooltip
                    content="Set & Setting refers to the patient's mindset (set) and environment (setting) before treatment. These factors significantly influence therapeutic outcomes."
                    type="info"
                    tier="standard"
                    side="left"
                >
                    <div className="p-2 hover:bg-slate-800/50 rounded-lg transition-colors cursor-help">
                        <Shield className="w-5 h-5 text-slate-400" />
                    </div>
                </AdvancedTooltip>
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Expectancy Scale */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <Heart className="w-4 h-4 text-blue-400" />
                        <h4 className="text-slate-200 text-sm font-medium">Treatment Expectancy</h4>
                        <AdvancedTooltip
                            content="Treatment expectancy measures how much the patient believes the therapy will help them. Higher belief (>70) correlates with 25% better outcomes due to positive placebo effects."
                            type="info"
                            tier="detailed"
                            title="Why Expectancy Matters"
                            side="top"
                        >
                            <div className="text-slate-400 hover:text-slate-300 cursor-help">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </AdvancedTooltip>
                    </div>
                    <ExpectancyScaleGauge score={expectancyScale} />
                </div>

                {/* ACE Score */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-amber-400" />
                        <h4 className="text-slate-200 text-sm font-medium">ACE Score</h4>
                        <AdvancedTooltip
                            content="Adverse Childhood Experiences (ACE) score measures childhood trauma (0-10). Higher scores indicate lower baseline resilience and may require additional integration support."
                            type="warning"
                            tier="detailed"
                            title="Understanding ACE"
                            side="top"
                        >
                            <div className="text-slate-400 hover:text-slate-300 cursor-help">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </AdvancedTooltip>
                    </div>
                    <ACEScoreBarChart score={aceScore} />
                </div>

                {/* GAD-7 Anxiety */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <Brain className="w-4 h-4 text-purple-400" />
                        <h4 className="text-slate-200 text-sm font-medium">Anxiety Severity (GAD-7)</h4>
                        <AdvancedTooltip
                            content="Generalized Anxiety Disorder scale (0-21). Scores >10 predict a 45% likelihood of challenging experiences during the session. Anxiolytic support may be beneficial."
                            type="warning"
                            tier="detailed"
                            title="GAD-7 Clinical Significance"
                            side="top"
                        >
                            <div className="text-slate-400 hover:text-slate-300 cursor-help">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </AdvancedTooltip>
                    </div>
                    <GAD7SeverityZones score={gad7Score} />
                </div>

                {/* Predicted Integration Needs */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-emerald-400" />
                        <h4 className="text-slate-200 text-sm font-medium">Predicted Integration Needs</h4>
                        <AdvancedTooltip
                            content="Based on baseline risk factors (ACE, GAD-7, Expectancy), this algorithm predicts the optimal number and frequency of integration sessions for sustained benefit."
                            type="info"
                            tier="detailed"
                            title="Integration Prediction Algorithm"
                            side="top"
                        >
                            <div className="text-slate-400 hover:text-slate-300 cursor-help">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </AdvancedTooltip>
                    </div>
                    <PredictedIntegrationNeeds
                        aceScore={aceScore}
                        gad7Score={gad7Score}
                        expectancyScale={expectancyScale}
                        phq9Score={phq9Score}
                    />
                </div>
            </div>

            {/* Schedule Sessions CTA */}
            {onScheduleSessions && (
                <div className="mt-6 pt-6 border-t border-slate-700/50">
                    <button
                        onClick={onScheduleSessions}
                        className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                    >
                        <Calendar className="w-5 h-5" />
                        Schedule Integration Sessions
                    </button>
                </div>
            )}
        </div>
    );
};

export default SetAndSettingCard;
