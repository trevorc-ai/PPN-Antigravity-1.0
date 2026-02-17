import React from 'react';
import { Shield, AlertTriangle, AlertCircle } from 'lucide-react';

interface ACEScoreBarChartProps {
    score: number; // 0-10
}

/**
 * ACEScoreBarChart - Adverse Childhood Experiences visualization
 * 
 * Displays trauma score with severity zones:
 * - 0: None (Green)
 * - 1-3: Low (Blue)
 * - 4-6: Moderate (Amber)
 * - 7-10: High (Red)
 * 
 * Higher ACE scores indicate lower baseline resilience.
 */
const ACEScoreBarChart: React.FC<ACEScoreBarChartProps> = ({ score }) => {
    // Clamp score to valid range
    const clampedScore = Math.max(0, Math.min(10, score));

    // Determine severity
    const getSeverity = (value: number) => {
        if (value === 0) return { label: 'None', color: 'emerald', icon: Shield, risk: 'No additional support needed' };
        if (value <= 3) return { label: 'Low', color: 'blue', icon: Shield, risk: 'Standard integration protocol' };
        if (value <= 6) return { label: 'Moderate', color: 'amber', icon: AlertCircle, risk: '4-6 integration sessions recommended' };
        return { label: 'High', color: 'red', icon: AlertTriangle, risk: '6-8 integration sessions strongly recommended' };
    };

    const severity = getSeverity(clampedScore);
    const Icon = severity.icon;

    // Color classes
    const colorClasses = {
        emerald: {
            bg: 'bg-emerald-500',
            text: 'text-emerald-400',
            border: 'border-emerald-500/30',
            glow: 'shadow-[0_0_15px_rgba(16,185,129,0.2)]'
        },
        blue: {
            bg: 'bg-blue-500',
            text: 'text-blue-400',
            border: 'border-blue-500/30',
            glow: 'shadow-[0_0_15px_rgba(59,130,246,0.2)]'
        },
        amber: {
            bg: 'bg-amber-500',
            text: 'text-amber-400',
            border: 'border-amber-500/30',
            glow: 'shadow-[0_0_15px_rgba(245,158,11,0.2)]'
        },
        red: {
            bg: 'bg-red-500',
            text: 'text-red-400',
            border: 'border-red-500/30',
            glow: 'shadow-[0_0_15px_rgba(239,68,68,0.2)]'
        }
    };

    const colors = colorClasses[severity.color];

    return (
        <div className="space-y-3">
            {/* Score Display */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Icon className={`w-5 h-5 ${colors.text}`} />
                    <span className={`text-2xl font-bold ${colors.text}`}>{clampedScore}</span>
                    <span className="text-slate-300 text-sm">/10</span>
                </div>
                <div className={`px-3 py-1 rounded-full ${colors.bg}/10 border ${colors.border}`}>
                    <span className={`text-sm font-medium ${colors.text}`}>{severity.label}</span>
                </div>
            </div>

            {/* Bar Chart */}
            <div className="space-y-2">
                {[...Array(10)].map((_, index) => {
                    const barNumber = index + 1;
                    const isActive = barNumber <= clampedScore;

                    // Determine bar color based on zone
                    let barColor = 'bg-slate-700/30';
                    if (isActive) {
                        if (barNumber <= 3) barColor = 'bg-blue-500';
                        else if (barNumber <= 6) barColor = 'bg-amber-500';
                        else barColor = 'bg-red-500';
                    }

                    return (
                        <div key={barNumber} className="flex items-center gap-2">
                            <span className="text-slate-300 text-xs w-4">{barNumber}</span>
                            <div className="flex-1 h-6 bg-slate-800/50 rounded overflow-hidden">
                                <div
                                    className={`h-full ${barColor} transition-all duration-300 ${isActive ? colors.glow : ''}`}
                                    style={{ width: isActive ? '100%' : '0%' }}
                                >
                                    {isActive && (
                                        <div className="h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Zone Legend */}
            <div className="flex gap-3 text-xs">
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-blue-500 rounded"></div>
                    <span className="text-slate-300">Low (1-3)</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-amber-500 rounded"></div>
                    <span className="text-slate-300">Moderate (4-6)</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-red-500 rounded"></div>
                    <span className="text-slate-300">High (7-10)</span>
                </div>
            </div>

            {/* Clinical Recommendation */}
            <div className="mt-3 p-3 bg-slate-800/30 rounded-lg border border-slate-700/30">
                <p className="text-slate-300 text-sm leading-relaxed">
                    <span className={`font-semibold ${colors.text}`}>{severity.risk}.</span>
                    {clampedScore >= 7 && (
                        <> Patients with high ACE scores have lower baseline resilience and benefit significantly from structured integration support.</>
                    )}
                    {clampedScore >= 4 && clampedScore < 7 && (
                        <> Moderate trauma history suggests need for additional integration to process emerging material.</>
                    )}
                    {clampedScore >= 1 && clampedScore < 4 && (
                        <> Low trauma history indicates good baseline resilience. Standard protocol is appropriate.</>
                    )}
                    {clampedScore === 0 && (
                        <> No reported childhood trauma. Patient has strong baseline resilience.</>
                    )}
                </p>
            </div>
        </div>
    );
};

export default ACEScoreBarChart;
