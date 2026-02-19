import React from 'react';
import { TrendingDown, TrendingUp, Minus, AlertCircle, CheckCircle } from 'lucide-react';
import { AdvancedTooltip } from '../ui/AdvancedTooltip';

interface SymptomDecayCurveChartProps {
    patientId: string;
    sessionId: number;
    data: Array<{ day: number; phq9Score: number; assessmentDate: string }>;
    sessionDate: Date;
}

/**
 * SymptomDecayCurveChart - PHQ-9 trajectory visualization
 * 
 * Displays depression symptom progression over time:
 * - X-axis: Days post-session (0, 7, 14, 30, 60, 90, 180)
 * - Y-axis: PHQ-9 Score (0-27)
 * - Color-coded severity zones
 * - Afterglow period annotation (Days 1-14)
 * - Trend indicators
 */
const SymptomDecayCurveChart: React.FC<SymptomDecayCurveChartProps> = ({
    patientId,
    sessionId,
    data = [],   // WO-117: default prevents crash when caller passes undefined
    sessionDate
}) => {
    // WO-117: Guard invalid sessionDate before any date math
    const safeSessionDate = sessionDate instanceof Date && !isNaN(sessionDate.getTime())
        ? sessionDate
        : new Date();

    // WO-117: Coerce data to safe array (belt-and-suspenders)
    const safeData = Array.isArray(data) ? data : [];

    // Define severity zones
    const zones = [
        { label: 'Minimal', range: '0-4', min: 0, max: 4, color: 'emerald' },
        { label: 'Mild', range: '5-9', min: 5, max: 9, color: 'blue' },
        { label: 'Moderate', range: '10-14', min: 10, max: 14, color: 'amber' },
        { label: 'Moderately Severe', range: '15-19', min: 15, max: 19, color: 'orange' },
        { label: 'Severe', range: '20-27', min: 20, max: 27, color: 'red' }
    ];

    // Calculate trend
    const getTrend = () => {
        if (safeData.length < 2) return null;
        const recent = safeData.slice(-2);
        const diff = recent[1].phq9Score - recent[0].phq9Score;
        if (diff < -2) return { direction: 'improving', icon: TrendingDown, color: 'emerald', label: 'Improving' };
        if (diff > 2) return { direction: 'declining', icon: TrendingUp, color: 'red', label: 'Declining' };
        return { direction: 'stable', icon: Minus, color: 'blue', label: 'Stable' };
    };

    const trend = getTrend();

    // Get current score
    const currentScore = safeData.length > 0 ? safeData[safeData.length - 1].phq9Score : null;
    const baselineScore = safeData.length > 0 ? safeData[0].phq9Score : null;
    const improvement = baselineScore !== null && currentScore !== null ? baselineScore - currentScore : null;

    // Determine current zone
    const getCurrentZone = (score: number | null) => {
        if (score === null) return null;
        return zones.find(z => score >= z.min && score <= z.max);
    };

    const currentZone = getCurrentZone(currentScore);

    // Check if in afterglow period
    const daysPostSession = safeData.length > 0
        ? Math.floor((new Date(safeData[safeData.length - 1].assessmentDate).getTime() - safeSessionDate.getTime()) / (1000 * 60 * 60 * 24))
        : 0;
    const isAfterglowPeriod = daysPostSession <= 14;

    // WO-117: Empty data state — render graceful fallback instead of crashing
    if (safeData.length === 0) {
        return (
            <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                <h3 className="text-slate-300 font-semibold text-lg mb-2">Symptom Decay Curve</h3>
                <p className="text-slate-500 text-sm">PHQ-9 Depression Score Over Time</p>
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                    <div className="w-12 h-12 rounded-full bg-slate-800/60 border border-slate-700/50 flex items-center justify-center">
                        <TrendingDown className="w-5 h-5 text-slate-600" />
                    </div>
                    <p className="text-slate-500 text-sm text-center">
                        No assessment data recorded yet.<br />
                        <span className="text-slate-600 text-xs">Complete a longitudinal assessment to see trajectory.</span>
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-slate-300 font-semibold text-lg">Symptom Decay Curve</h3>
                    <p className="text-slate-300 text-sm">PHQ-9 Depression Score Over Time</p>
                </div>

                {trend && (
                    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg bg-${trend.color}-500/10 border border-${trend.color}-500/30`}>
                        {React.createElement(trend.icon, { className: `w-5 h-5 text-${trend.color}-400` })}
                        <span className={`text-sm font-medium text-${trend.color}-400`}>{trend.label}</span>
                    </div>
                )}
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                {/* Current Score */}
                <div className={`p-4 rounded-xl border ${currentZone ? `bg-${currentZone.color}-500/10 border-${currentZone.color}-500/30` : 'bg-slate-800/30 border-slate-700/30'}`}>
                    <div className="text-xs text-slate-300 mb-1">Current</div>
                    <div className={`text-2xl font-bold ${currentZone ? `text-${currentZone.color}-400` : 'text-slate-300'}`}>
                        {currentScore !== null ? currentScore : '--'}
                    </div>
                    {currentZone && (
                        <div className={`text-xs text-${currentZone.color}-400 mt-1`}>{currentZone.label}</div>
                    )}
                </div>

                {/* Baseline */}
                <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/30">
                    <div className="text-xs text-slate-300 mb-1">Baseline</div>
                    <div className="text-2xl font-bold text-slate-300">
                        {baselineScore !== null ? baselineScore : '--'}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">Day 0</div>
                </div>

                {/* Improvement */}
                <div className={`p-4 rounded-xl border ${improvement !== null && improvement > 0 ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-slate-800/30 border-slate-700/30'}`}>
                    <div className="text-xs text-slate-300 mb-1">Change</div>
                    <div className={`text-2xl font-bold ${improvement !== null && improvement > 0 ? 'text-emerald-400' : 'text-slate-300'}`}>
                        {improvement !== null ? (improvement > 0 ? `-${improvement}` : `+${Math.abs(improvement)}`) : '--'}
                    </div>
                    <div className={`text-xs mt-1 ${improvement !== null && improvement > 0 ? 'text-emerald-400' : 'text-slate-500'}`}>
                        {improvement !== null && improvement > 0 ? 'Improved' : 'Changed'}
                    </div>
                </div>
            </div>

            {/* Chart Area */}
            <div className="relative h-64 bg-slate-800/30 rounded-xl p-4 mb-4">
                {/* Y-axis labels (severity zones) */}
                <div className="absolute left-0 top-0 bottom-0 w-16 flex flex-col justify-between text-xs text-slate-500">
                    <span>27</span>
                    <span>20</span>
                    <span>15</span>
                    <span>10</span>
                    <span>5</span>
                    <span>0</span>
                </div>

                {/* Background zones */}
                <div className="absolute left-16 right-4 top-4 bottom-8 flex flex-col">
                    {zones.reverse().map((zone) => {
                        const height = ((zone.max - zone.min + 1) / 28) * 100;
                        return (
                            <div
                                key={zone.label}
                                className={`bg-${zone.color}-500/5 border-b border-${zone.color}-500/10`}
                                style={{ height: `${height}%` }}
                            />
                        );
                    })}
                </div>

                {/* Afterglow period overlay */}
                {isAfterglowPeriod && (
                    <div className="absolute left-16 right-4 top-4 bottom-8 bg-blue-500/5 border-2 border-dashed border-blue-500/20 rounded">
                        <div className="absolute top-2 left-2 text-xs text-blue-400 font-medium">Afterglow Period</div>
                    </div>
                )}

                {/* Data points */}
                {safeData.length > 0 && (
                    <svg className="absolute left-16 right-4 top-4 bottom-8" style={{ width: 'calc(100% - 5rem)', height: 'calc(100% - 3rem)' }}>
                        {/* Line */}
                        <polyline
                            points={safeData.map((point, i) => {
                                const x = (i / (safeData.length - 1 || 1)) * 100;
                                const y = 100 - ((point.phq9Score / 27) * 100);
                                return `${x}%,${y}%`;
                            }).join(' ')}
                            fill="none"
                            stroke="rgb(139, 92, 246)"
                            strokeWidth="2"
                            className="drop-shadow-lg"
                        />

                        {/* Points */}
                        {safeData.map((point, i) => {
                            const x = (i / (safeData.length - 1 || 1)) * 100;
                            const y = 100 - ((point.phq9Score / 27) * 100);
                            return (
                                <circle
                                    key={i}
                                    cx={`${x}%`}
                                    cy={`${y}%`}
                                    r="4"
                                    fill="rgb(139, 92, 246)"
                                    className="drop-shadow-lg"
                                />
                            );
                        })}
                    </svg>
                )}

                {/* X-axis */}
                <div className="absolute left-16 right-4 bottom-0 h-8 flex justify-between text-xs text-slate-500">
                    <span>0d</span>
                    <span>7d</span>
                    <span>14d</span>
                    <span>30d</span>
                    <span>60d</span>
                    <span>90d</span>
                    <span>180d</span>
                </div>
            </div>

            {/* Annotations */}
            <div className="space-y-2">
                {isAfterglowPeriod && (
                    <AdvancedTooltip
                        content="The first 1-2 weeks post-session often show rapid improvement due to acute neuroplastic effects. True efficacy is measured at 6+ weeks when the 'afterglow' fades."
                        type="info"
                        tier="detailed"
                        title="Afterglow Period"
                        side="top"
                    >
                        <div className="flex items-start gap-2 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20 cursor-help">
                            <AlertCircle className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-blue-300">
                                Currently in afterglow period (Day {daysPostSession}). Rapid improvement is expected.
                            </p>
                        </div>
                    </AdvancedTooltip>
                )}

                {daysPostSession >= 60 && improvement !== null && improvement > 5 && (
                    <div className="flex items-start gap-2 p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                        <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-emerald-300">
                            ✓ Sustained improvement beyond 60 days indicates genuine therapeutic benefit.
                        </p>
                    </div>
                )}

                {trend && trend.direction === 'declining' && (
                    <div className="flex items-start gap-2 p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
                        <AlertCircle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-amber-300">
                            ⚠️ Scores are increasing. Consider scheduling check-in or second session.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SymptomDecayCurveChart;
