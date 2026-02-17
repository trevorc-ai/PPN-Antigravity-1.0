import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface ExpectancyScaleGaugeProps {
    score: number; // 1-100
}

/**
 * ExpectancyScaleGauge - Visual gauge for treatment expectancy
 * 
 * Displays patient's belief in therapy effectiveness:
 * - 1-40: Low Belief (Red)
 * - 41-70: Moderate Belief (Yellow)
 * - 71-100: High Belief (Green)
 * 
 * Higher expectancy correlates with better outcomes.
 */
const ExpectancyScaleGauge: React.FC<ExpectancyScaleGaugeProps> = ({ score }) => {
    // Clamp score to valid range
    const clampedScore = Math.max(1, Math.min(100, score));

    // Determine interpretation
    const getInterpretation = (value: number) => {
        if (value >= 71) return { label: 'High Belief', color: 'emerald', icon: TrendingUp };
        if (value >= 41) return { label: 'Moderate Belief', color: 'amber', icon: Minus };
        return { label: 'Low Belief', color: 'red', icon: TrendingDown };
    };

    const interpretation = getInterpretation(clampedScore);
    const Icon = interpretation.icon;

    // Color classes
    const colorClasses = {
        emerald: {
            bg: 'bg-emerald-500',
            text: 'text-emerald-400',
            glow: 'shadow-[0_0_20px_rgba(16,185,129,0.3)]'
        },
        amber: {
            bg: 'bg-amber-500',
            text: 'text-amber-400',
            glow: 'shadow-[0_0_20px_rgba(245,158,11,0.3)]'
        },
        red: {
            bg: 'bg-red-500',
            text: 'text-red-400',
            glow: 'shadow-[0_0_20px_rgba(239,68,68,0.3)]'
        }
    };

    const colors = colorClasses[interpretation.color];

    return (
        <div className="space-y-3">
            {/* Score Display */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Icon className={`w-5 h-5 ${colors.text}`} />
                    <span className={`text-2xl font-bold ${colors.text}`}>{clampedScore}</span>
                    <span className="text-slate-300 text-sm">/100</span>
                </div>
                <div className={`px-3 py-1 rounded-full ${colors.bg}/10 border border-${interpretation.color}-500/20`}>
                    <span className={`text-sm font-medium ${colors.text}`}>{interpretation.label}</span>
                </div>
            </div>

            {/* Gauge Bar */}
            <div className="relative h-3 bg-slate-800/50 rounded-full overflow-hidden">
                {/* Background gradient zones */}
                <div className="absolute inset-0 flex">
                    <div className="w-[40%] bg-red-500/20"></div>
                    <div className="w-[30%] bg-amber-500/20"></div>
                    <div className="w-[30%] bg-emerald-500/20"></div>
                </div>

                {/* Fill bar */}
                <div
                    className={`absolute inset-y-0 left-0 ${colors.bg} ${colors.glow} transition-all duration-500 ease-out`}
                    style={{ width: `${clampedScore}%` }}
                >
                    {/* Animated shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                </div>
            </div>

            {/* Zone Labels */}
            <div className="flex justify-between text-xs text-slate-500">
                <span>Low (1-40)</span>
                <span>Moderate (41-70)</span>
                <span>High (71-100)</span>
            </div>

            {/* Clinical Insight */}
            <div className="mt-3 p-3 bg-slate-800/30 rounded-lg border border-slate-700/30">
                <p className="text-slate-300 text-sm leading-relaxed">
                    {clampedScore >= 71 && (
                        <>
                            <span className="font-semibold text-emerald-400">Excellent expectancy.</span> Patients with high belief in therapy show 25% better outcomes due to positive placebo effects.
                        </>
                    )}
                    {clampedScore >= 41 && clampedScore < 71 && (
                        <>
                            <span className="font-semibold text-amber-400">Moderate expectancy.</span> Consider psychoeducation to strengthen belief in therapeutic mechanism.
                        </>
                    )}
                    {clampedScore < 41 && (
                        <>
                            <span className="font-semibold text-red-400">Low expectancy detected.</span> Pre-session education and expectancy-building interventions strongly recommended.
                        </>
                    )}
                </p>
            </div>
        </div>
    );
};

export default ExpectancyScaleGauge;
