import React, { useState } from 'react';
import { TrendingUp, CheckCircle, ChevronDown, ChevronUp, Download, Heart, Activity, Calendar, Award } from 'lucide-react';
import { AdvancedTooltip } from '../ui/AdvancedTooltip';
import SymptomDecayCurve from '../arc-of-care/SymptomDecayCurve';
import PulseCheckWidget from '../arc-of-care/PulseCheckWidget';

interface IntegrationPhaseProps {
    journey: any;
}

// Mock 7-day pulse check trend data
const MOCK_PULSE_TREND = [
    { day: 'Mon', connection: 3, sleep: 2, date: '2025-10-13' },
    { day: 'Tue', connection: 3, sleep: 3, date: '2025-10-14' },
    { day: 'Wed', connection: 4, sleep: 3, date: '2025-10-15' },
    { day: 'Thu', connection: 4, sleep: 4, date: '2025-10-16' },
    { day: 'Fri', connection: 5, sleep: 4, date: '2025-10-17' },
    { day: 'Sat', connection: 4, sleep: 5, date: '2025-10-18' },
    { day: 'Sun', connection: 5, sleep: 4, date: '2025-10-19' },
];

export const IntegrationPhase: React.FC<IntegrationPhaseProps> = ({ journey }) => {
    const [showPulseCheck, setShowPulseCheck] = useState(true);

    // Export 7-day trend as CSV
    const handleExportTrend = () => {
        const csvRows = [
            'date,day,connection_level,sleep_quality',
            ...MOCK_PULSE_TREND.map(d => `${d.date},${d.day},${d.connection},${d.sleep}`),
        ];
        const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `pulse_check_trend_${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    // Calculate 7-day averages for trend display
    const avgConnection = (MOCK_PULSE_TREND.reduce((s, d) => s + d.connection, 0) / MOCK_PULSE_TREND.length).toFixed(1);
    const avgSleep = (MOCK_PULSE_TREND.reduce((s, d) => s + d.sleep, 0) / MOCK_PULSE_TREND.length).toFixed(1);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">

            {/* 1. TOP ROW: Symptom Decay & Pulse Check Widget (Full Width Stack) */}
            <div className="space-y-6">

                {/* Symptom Decay Curve */}
                <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-900/10 border-2 border-emerald-500/50 rounded-3xl p-6 shadow-lg shadow-emerald-900/20">
                    <div className="flex items-center gap-3 mb-6">
                        <TrendingUp className="w-8 h-8 text-emerald-400" />
                        <div>
                            <h3 className="text-2xl font-black text-emerald-100">Symptom Decay</h3>
                            <p className="text-xs text-emerald-400/70 font-bold uppercase tracking-widest">PHQ-9 Trajectory</p>
                        </div>
                    </div>
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

                {/* Daily Pulse Check Widget + 7-Day Trend */}
                <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Heart className="w-32 h-32 text-pink-500" />
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <Heart className="w-8 h-8 text-pink-400" />
                                <div>
                                    <h3 className="text-2xl font-bold text-slate-200">Daily Pulse</h3>
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Mood & Sleep Tracking</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <AdvancedTooltip content="Export 7-day pulse check trend as CSV for integration session review." tier="micro">
                                    <button
                                        onClick={handleExportTrend}
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400 hover:text-white text-xs font-bold rounded-lg transition-colors uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <Download className="w-3 h-3" />
                                        CSV
                                    </button>
                                </AdvancedTooltip>
                                <button
                                    onClick={() => setShowPulseCheck(!showPulseCheck)}
                                    className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-800 hover:bg-slate-700 transition-colors border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    aria-label={showPulseCheck ? 'Collapse pulse check' : 'Expand pulse check'}
                                >
                                    {showPulseCheck ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                                </button>
                            </div>
                        </div>

                        {showPulseCheck && (
                            <div className="space-y-6 animate-in slide-in-from-top duration-300">
                                {/* 7-Day Trend Summary */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-4 bg-slate-800/40 rounded-xl text-center border border-slate-700/50">
                                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">Avg Connection</p>
                                        <p className="text-3xl font-black text-pink-400">{avgConnection}<span className="text-base text-slate-600 font-normal">/5</span></p>
                                    </div>
                                    <div className="p-4 bg-slate-800/40 rounded-xl text-center border border-slate-700/50">
                                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">Avg Sleep</p>
                                        <p className="text-3xl font-black text-blue-400">{avgSleep}<span className="text-base text-slate-600 font-normal">/5</span></p>
                                    </div>
                                </div>

                                {/* 7-Day Bar Chart */}
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">7-Day Trend</p>
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-1.5">
                                                <div className="w-2 h-2 rounded-full bg-pink-500" />
                                                <span className="text-xs text-slate-500 font-bold uppercase">Connection</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <div className="w-2 h-2 rounded-full bg-blue-500" />
                                                <span className="text-xs text-slate-500 font-bold uppercase">Sleep</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-7 gap-2 h-32 items-end pb-2">
                                        {MOCK_PULSE_TREND.map((d) => (
                                            <div key={d.day} className="flex flex-col items-center gap-2 h-full justify-end group/bar">
                                                {/* Stacked Bars */}
                                                <div className="w-full relative flex flex-col items-center gap-1">
                                                    <div
                                                        className="w-full bg-blue-500/20 border-t-2 border-blue-500 rounded-sm transition-all group-hover/bar:bg-blue-500/40"
                                                        style={{ height: `${(d.sleep / 5) * 40}px` }}
                                                        title={`Sleep: ${d.sleep}/5`}
                                                    />
                                                    <div
                                                        className="w-full bg-pink-500/20 border-t-2 border-pink-500 rounded-sm transition-all group-hover/bar:bg-pink-500/40"
                                                        style={{ height: `${(d.connection / 5) * 40}px` }}
                                                        title={`Connection: ${d.connection}/5`}
                                                    />
                                                </div>
                                                <span className="text-xs font-bold text-slate-500 group-hover/bar:text-slate-300">{d.day.slice(0, 1)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Today's Pulse Check Widget */}
                                <div className="pt-4 border-t border-slate-800">
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-3">Today's Check-In</p>
                                    <PulseCheckWidget
                                        patientId="patient-001"
                                        sessionId={journey.session.sessionNumber}
                                        onSubmit={(data) => {
                                            console.log('[WO-064] Pulse check submitted:', data);
                                        }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* 2. BOTTOM ROW: 3-Column Layout for Compliance, Outcomes, and Insights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Compliance Metrics */}
                <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 flex flex-col">
                    <div className="flex items-center gap-3 mb-6">
                        <Activity className="w-6 h-6 text-indigo-400" />
                        <h3 className="text-xl font-bold text-slate-200">Compliance</h3>
                    </div>

                    <div className="space-y-6 flex-1">
                        {/* Pulse Check Compliance */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
                                <span>Daily Pulse</span>
                                <span className={journey.integration.pulseCheckCompliance >= 80 ? "text-emerald-400" : "text-amber-400"}>
                                    {journey.integration.pulseCheckCompliance}%
                                </span>
                            </div>
                            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full ${journey.integration.pulseCheckCompliance >= 80 ? "bg-emerald-500" : "bg-amber-500"}`}
                                    style={{ width: `${journey.integration.pulseCheckCompliance}%` }}
                                />
                            </div>
                        </div>

                        {/* PHQ-9 Compliance */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
                                <span>Weekly PHQ-9</span>
                                <span className={journey.integration.phq9Compliance >= 90 ? "text-emerald-400" : "text-amber-400"}>
                                    {journey.integration.phq9Compliance}%
                                </span>
                            </div>
                            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full ${journey.integration.phq9Compliance >= 90 ? "bg-emerald-500" : "bg-amber-500"}`}
                                    style={{ width: `${journey.integration.phq9Compliance}%` }}
                                />
                            </div>
                        </div>

                        {/* Integration Sessions */}
                        <div className="p-4 bg-slate-800/40 border border-slate-700/50 rounded-xl text-center mt-auto">
                            <div className="text-3xl font-black text-indigo-400 mb-1">
                                {journey.integration.integrationSessionsAttended}<span className="text-xl text-slate-500 font-normal">/{journey.integration.integrationSessionsScheduled}</span>
                            </div>
                            <div className="text-xs text-slate-500 font-bold uppercase tracking-widest">Integration Sessions</div>
                        </div>
                    </div>
                </div>

                {/* Quality of Life Improvements */}
                <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <Award className="w-6 h-6 text-amber-400" />
                        <h3 className="text-xl font-bold text-slate-200">Key Outcomes</h3>
                    </div>

                    <div className="space-y-4">
                        <div className="p-4 bg-slate-800/40 border border-slate-700/50 rounded-xl flex items-center justify-between">
                            <div>
                                <div className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">WHOQOL-BREF</div>
                                <div className="text-lg font-bold text-slate-300">Quality of Life</div>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-black text-emerald-400">+21%</div>
                                <div className="text-xs text-emerald-500/70 font-bold">68 → 82</div>
                            </div>
                        </div>

                        <div>
                            <div className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-3">Behavioral Wins</div>
                            <div className="space-y-2">
                                {journey.integration.behavioralChanges.map((change: string, index: number) => (
                                    <div key={index} className="flex items-center gap-3 p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-lg">
                                        <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                        <span className="text-sm font-medium text-emerald-100">{change}</span>
                                    </div>
                                ))}
                                {journey.integration.behavioralChanges.length === 0 && (
                                    <div className="p-3 bg-slate-800/20 border border-slate-700/30 rounded-lg text-center">
                                        <span className="text-sm text-slate-500 italic">No behavioral changes recorded yet.</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* AI Insights (Behavioral Correlation) */}
                <div className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-indigo-500/20 rounded-2xl p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Activity className="w-32 h-32 text-indigo-400" />
                    </div>

                    <div className="relative z-10 flex flex-col h-full">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="text-2xl">💡</span>
                            <h3 className="text-xl font-bold text-slate-200">Smart Insight</h3>
                        </div>

                        <div className="text-sm font-medium text-slate-300 leading-relaxed flex-1">
                            "Your anxiety (GAD-7) drops by <span className="text-emerald-400 font-bold">40%</span> on weeks where you log at least 3 'Nature Walks' in your journal."
                        </div>

                        <div className="mt-6 pt-4 border-t border-white/5">
                            <div className="flex items-center gap-2 text-xs text-indigo-300 font-bold uppercase tracking-widest">
                                <Activity className="w-3 h-3" />
                                Correlation Found
                            </div>
                            <p className="text-xs text-slate-500 mt-1">Based on 26 weeks of behavioral data.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
