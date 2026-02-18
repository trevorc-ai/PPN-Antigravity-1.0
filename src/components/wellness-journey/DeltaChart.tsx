import React from 'react';
import { TrendingDown, TrendingUp, Minus } from 'lucide-react';

/**
 * DeltaChart - Baseline → Current Comparison
 * 
 * Shows real-time delta charts for baseline → current comparisons
 * immediately after data entry. Critical for Week 1 value delivery.
 */

interface DeltaChartProps {
    metric: string;
    baseline: number;
    current: number;
    trend: 'improving' | 'worsening' | 'stable';
    unit?: string;
    higherIsBetter?: boolean; // Default: false (lower is better for most clinical metrics)
}

export const DeltaChart: React.FC<DeltaChartProps> = ({
    metric,
    baseline,
    current,
    trend,
    unit = '',
    higherIsBetter = false
}) => {
    const delta = current - baseline;
    const percentChange = baseline !== 0 ? Math.abs((delta / baseline) * 100) : 0;
    const isImproving = higherIsBetter ? delta > 0 : delta < 0;

    const getTrendIcon = () => {
        if (trend === 'improving') return <TrendingDown className="w-5 h-5" />;
        if (trend === 'worsening') return <TrendingUp className="w-5 h-5" />;
        return <Minus className="w-5 h-5" />;
    };

    const getTrendColor = () => {
        if (trend === 'improving') return 'text-emerald-400 bg-emerald-500/20';
        if (trend === 'worsening') return 'text-red-400 bg-red-500/20';
        return 'text-slate-300 bg-slate-500/20';
    };

    const getTrendText = () => {
        if (trend === 'improving') return 'improvement';
        if (trend === 'worsening') return 'worsening';
        return 'stable';
    };

    return (
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4 space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-300">{metric}</h4>
                <div className={`px-2 py-1 rounded-lg flex items-center gap-1 ${getTrendColor()}`}>
                    {getTrendIcon()}
                    <span className="text-xs font-bold">{getTrendText()}</span>
                </div>
            </div>

            {/* Values */}
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-slate-300">Baseline</p>
                    <p className="text-2xl font-black text-slate-300">
                        {baseline}{unit}
                    </p>
                </div>

                <div className="text-center">
                    <p className="text-sm text-slate-300">Change</p>
                    <p className={`text-lg font-bold ${isImproving ? 'text-emerald-400' : 'text-red-400'}`}>
                        {delta > 0 ? '+' : ''}{delta}{unit}
                    </p>
                </div>

                <div className="text-right">
                    <p className="text-sm text-slate-300">Current</p>
                    <p className="text-2xl font-black text-blue-400">
                        {current}{unit}
                    </p>
                </div>
            </div>

            {/* Percent Change */}
            <div className="pt-2 border-t border-slate-700/50">
                <p className="text-sm text-slate-300 text-center">
                    {isImproving ? '↓' : '↑'} {percentChange.toFixed(0)}% {getTrendText()}
                </p>
            </div>

            {/* Mini Chart (Visual Representation) */}
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                    className={`h-full transition-all duration-500 ${isImproving ? 'bg-emerald-500' : 'bg-red-500'
                        }`}
                    style={{ width: `${Math.min(percentChange, 100)}%` }}
                />
            </div>
        </div>
    );
};
