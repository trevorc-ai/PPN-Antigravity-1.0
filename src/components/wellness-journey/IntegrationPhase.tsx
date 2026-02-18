import React, { useState } from 'react';
import { TrendingUp, CheckCircle, ChevronDown, ChevronUp, Download, Heart } from 'lucide-react';
import { AdvancedTooltip } from '../ui/AdvancedTooltip';
import SymptomDecayCurve from '../arc-of-care/SymptomDecayCurve';
import PulseCheckWidget from '../arc-of-care/PulseCheckWidget';

interface IntegrationPhaseProps {
    journey: any;
}

// WO-064: Mock 7-day pulse check trend data
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
    const [showPulseCheck, setShowPulseCheck] = useState(true); // WO-064

    // WO-064: Export 7-day trend as CSV
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

    // WO-064: Calculate 7-day averages for trend display
    const avgConnection = (MOCK_PULSE_TREND.reduce((s, d) => s + d.connection, 0) / MOCK_PULSE_TREND.length).toFixed(1);
    const avgSleep = (MOCK_PULSE_TREND.reduce((s, d) => s + d.sleep, 0) / MOCK_PULSE_TREND.length).toFixed(1);

    return (
        <div className="space-y-6">
            {/* Symptom Decay Curve - REUSE EXISTING COMPONENT */}
            <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-900/10 border-2 border-emerald-500/50 rounded-3xl p-6">
                <div className="flex items-center gap-3 mb-4">
                    <TrendingUp className="w-8 h-8 text-emerald-400" />
                    <h3 className="text-2xl font-black text-emerald-100">Symptom Decay Curve</h3>
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

            {/* WO-064: Daily Pulse Check Widget + 7-Day Trend */}
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <Heart className="w-8 h-8 text-pink-400" />
                        <h3 className="text-2xl font-bold text-slate-300">Daily Pulse Check</h3>
                        <span className="text-sm text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">
                            7-day streak ✓
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <AdvancedTooltip content="Export 7-day pulse check trend as CSV for integration session review." tier="micro">
                            <button
                                onClick={handleExportTrend}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/50 text-slate-300 text-sm rounded-lg transition-colors"
                            >
                                <Download className="w-4 h-4" />
                                Export CSV
                            </button>
                        </AdvancedTooltip>
                        <button
                            onClick={() => setShowPulseCheck(!showPulseCheck)}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-700/50 hover:bg-slate-700/70 transition-colors"
                            aria-label={showPulseCheck ? 'Collapse pulse check' : 'Expand pulse check'}
                        >
                            {showPulseCheck ? <ChevronUp className="w-4 h-4 text-slate-300" /> : <ChevronDown className="w-4 h-4 text-slate-300" />}
                        </button>
                    </div>
                </div>

                {showPulseCheck && (
                    <div className="space-y-6 animate-in slide-in-from-top duration-200">
                        {/* 7-Day Trend Summary */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 bg-slate-800/40 rounded-xl text-center">
                                <p className="text-sm text-slate-500 uppercase tracking-wide mb-1">Avg Connection</p>
                                <p className="text-2xl font-black text-pink-400">{avgConnection}<span className="text-sm text-slate-500">/5</span></p>
                            </div>
                            <div className="p-3 bg-slate-800/40 rounded-xl text-center">
                                <p className="text-sm text-slate-500 uppercase tracking-wide mb-1">Avg Sleep</p>
                                <p className="text-2xl font-black text-blue-400">{avgSleep}<span className="text-sm text-slate-500">/5</span></p>
                            </div>
                        </div>

                        {/* 7-Day Bar Chart */}
                        <div>
                            <p className="text-sm text-slate-500 uppercase tracking-wide mb-3">7-Day Trend</p>
                            <div className="grid grid-cols-7 gap-1">
                                {MOCK_PULSE_TREND.map((d) => (
                                    <div key={d.day} className="flex flex-col items-center gap-1">
                                        {/* Connection bar */}
                                        <div className="w-full flex flex-col items-center gap-0.5">
                                            <div
                                                className="w-full bg-pink-500/70 rounded-sm transition-all"
                                                style={{ height: `${(d.connection / 5) * 40}px` }}
                                                title={`Connection: ${d.connection}/5`}
                                            />
                                            {/* Sleep bar */}
                                            <div
                                                className="w-full bg-blue-500/70 rounded-sm transition-all"
                                                style={{ height: `${(d.sleep / 5) * 40}px` }}
                                                title={`Sleep: ${d.sleep}/5`}
                                            />
                                        </div>
                                        <span className="text-sm text-slate-400">{d.day.slice(0, 1)}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="flex items-center gap-4 mt-2">
                                <div className="flex items-center gap-1">
                                    <div className="w-3 h-3 rounded-sm bg-pink-500/70" />
                                    <span className="text-sm text-slate-400">Connection</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="w-3 h-3 rounded-sm bg-blue-500/70" />
                                    <span className="text-sm text-slate-400">Sleep</span>
                                </div>
                            </div>
                        </div>

                        {/* Today's Pulse Check Widget */}
                        <div>
                            <p className="text-sm text-slate-500 uppercase tracking-wide mb-3">Today's Check-In</p>
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

            {/* 2x2 Grid of Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Compliance Metrics */}
                <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <CheckCircle className="w-8 h-8 text-emerald-400" />
                        <h3 className="text-2xl font-black text-slate-300">Compliance</h3>
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
                        <TrendingUp className="w-8 h-8 text-blue-400" />
                        <h3 className="text-2xl font-black text-slate-300">Quality of Life</h3>
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
                        <CheckCircle className="w-8 h-8 text-emerald-400" />
                        <h3 className="text-2xl font-black text-slate-300">Status</h3>
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
                        <span className="text-3xl">💡</span>
                        <h3 className="text-2xl font-black text-slate-300">Personalized Insight</h3>
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
