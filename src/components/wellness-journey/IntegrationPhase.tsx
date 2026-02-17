import React, { useState } from 'react';
import { TrendingUp, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { AdvancedTooltip } from '../ui/AdvancedTooltip';
import SymptomDecayCurve from '../arc-of-care/SymptomDecayCurve';

interface IntegrationPhaseProps {
    journey: any;
}

export const IntegrationPhase: React.FC<IntegrationPhaseProps> = ({ journey }) => {
    const [showChanges, setShowChanges] = useState(false);

    return (
        <div className="space-y-6">
            {/* Symptom Decay Curve - REUSE EXISTING COMPONENT */}
            <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-900/10 border-2 border-emerald-500/50 rounded-3xl p-6">
                <div className="flex items-center gap-3 mb-4">
                    <TrendingUp className="w-6 h-6 text-emerald-400" />
                    <h3 className="text-xl font-black text-emerald-300">Symptom Decay Curve</h3>
                </div>

                {/* USE EXISTING SymptomDecayCurve COMPONENT */}
                <SymptomDecayCurve
                    baselinePhq9={journey.baseline.phq9}
                    dataPoints={[
                        { day: 7, phq9: 14 },
                        { day: 14, phq9: 11 },
                        { day: 30, phq9: 9 },
                        { day: 60, phq9: 7 },
                        { day: 90, phq9: 6 },
                        { day: 120, phq9: 5 },
                        { day: 180, phq9: journey.integration.currentPhq9 }
                    ]}
                />
            </div>

            {/* 2x2 Grid of Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Compliance Metrics */}
                <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <CheckCircle className="w-6 h-6 text-emerald-400" />
                        <h3 className="text-lg font-black text-slate-300">Compliance</h3>
                    </div>

                    <div className="space-y-4">
                        <AdvancedTooltip
                            content="Daily pulse checks measure mood, sleep, and well-being. High compliance (>90%) correlates with better outcomes."
                            tier="standard"
                            type="clinical"
                        >
                            <div className="cursor-help">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="text-sm text-slate-300">Daily Pulse Checks</div>
                                    <div className="text-sm font-bold text-emerald-400">{journey.integration.pulseCheckCompliance}%</div>
                                </div>
                                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500" style={{ width: `${journey.integration.pulseCheckCompliance}%` }}></div>
                                </div>
                            </div>
                        </AdvancedTooltip>

                        <AdvancedTooltip
                            content="Weekly PHQ-9 assessments track depression symptoms over time. 100% compliance indicates excellent engagement."
                            tier="standard"
                            type="clinical"
                        >
                            <div className="cursor-help">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="text-sm text-slate-300">Weekly PHQ-9</div>
                                    <div className="text-sm font-bold text-emerald-400">{journey.integration.phq9Compliance}%</div>
                                </div>
                                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500" style={{ width: `${journey.integration.phq9Compliance}%` }}></div>
                                </div>
                            </div>
                        </AdvancedTooltip>

                        <div className="pt-3 border-t border-slate-800">
                            <div className="px-3 py-2 bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-center">
                                <div className="text-2xl font-black text-emerald-400">
                                    {journey.integration.integrationSessionsAttended}/{journey.integration.integrationSessionsScheduled}
                                </div>
                                <div className="text-sm text-emerald-300 uppercase tracking-wide">Integration Sessions</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quality of Life Improvements */}
                <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <TrendingUp className="w-6 h-6 text-blue-400" />
                        <h3 className="text-lg font-black text-slate-300">Quality of Life</h3>
                    </div>

                    <div className="space-y-3">
                        <div className="p-3 bg-slate-800/40 rounded-xl">
                            <div className="text-sm text-slate-300 mb-1">WHOQOL-BREF</div>
                            <div className="text-2xl font-black text-emerald-400">68 → 82 (+21%)</div>
                        </div>

                        <div className="text-sm text-slate-300 uppercase tracking-wide mb-2">Behavioral Changes:</div>
                        <div className="space-y-2">
                            {journey.integration.behavioralChanges.map((change: string, index: number) => (
                                <div key={index} className="flex items-center gap-2 text-sm text-slate-300">
                                    <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                                    <span>{change}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Alerts & Next Steps */}
                <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <CheckCircle className="w-6 h-6 text-emerald-400" />
                        <h3 className="text-lg font-black text-slate-300">Status</h3>
                    </div>

                    <div className="space-y-4">
                        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center">
                            <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                            <div className="text-sm font-bold text-emerald-300">No active alerts ✓</div>
                            <div className="text-sm text-slate-300 mt-1">Patient is stable and progressing well</div>
                        </div>

                        <div className="text-sm text-slate-300 uppercase tracking-wide">Next Steps:</div>
                        <div className="space-y-2">
                            <div className="flex items-start gap-2 p-2 bg-slate-800/40 rounded-lg">
                                <span className="text-sm text-slate-300">📅 Schedule PHQ-9 at Day 60</span>
                            </div>
                            <div className="flex items-start gap-2 p-2 bg-slate-800/40 rounded-lg">
                                <span className="text-sm text-slate-300">📅 Integration Session #4 due</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Personalized Insights */}
                <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="text-2xl">💡</span>
                        <h3 className="text-lg font-black text-slate-300">Personalized Insight</h3>
                    </div>

                    <div className="p-4 bg-gradient-to-br from-amber-500/10 to-amber-900/10 border border-amber-500/20 rounded-2xl">
                        <div className="flex items-start gap-3">
                            <span className="text-2xl flex-shrink-0">💡</span>
                            <div>
                                <div className="text-sm font-medium text-slate-300 leading-relaxed">
                                    Your anxiety (GAD-7) drops by 40% on weeks where you log at least 3 "Nature Walks" in your journal. Keep it up! 🌲
                                </div>
                                <div className="text-sm text-slate-500 mt-2">
                                    Based on 26 weeks of data correlation
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
