import React from 'react';
import { TrendingDown, Calendar } from 'lucide-react';
import { getRiskColor, getRiskIcon, type RiskFlag } from '../../utils/riskCalculator';

export interface ProgressRiskFlagsProps {
    flags: RiskFlag[];
}

/**
 * ProgressRiskFlags - Display declining progress trend indicators
 * 
 * Shows:
 * - Metrics increasing for 2+ consecutive weeks
 * - Metrics returning to baseline
 * - Recommended interventions
 */
export const ProgressRiskFlags: React.FC<ProgressRiskFlagsProps> = ({
    flags
}) => {
    if (flags.length === 0) {
        return null;
    }

    return (
        <div className="bg-yellow-500/10 backdrop-blur-xl border border-yellow-500/30 rounded-2xl p-6">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-yellow-500/20 rounded-lg">
                    <TrendingDown className="w-6 h-6 text-yellow-400" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-yellow-300">
                        Declining Progress Detected
                    </h3>
                    <p className="text-xs text-yellow-400/70 mt-1">
                        {flags.length} metric{flags.length !== 1 ? 's' : ''} showing concerning trends
                    </p>
                </div>
            </div>

            {/* Progress Trends */}
            <div className="space-y-4">
                {flags.map((flag, index) => (
                    <div
                        key={index}
                        className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50"
                    >
                        <div className="flex items-start gap-3 mb-3">
                            <span className="text-lg flex-shrink-0">
                                {getRiskIcon(flag.severity)}
                            </span>
                            <div className="flex-1">
                                <h4 className={`font-semibold ${getRiskColor(flag.severity)}`}>
                                    {flag.metric} Trend
                                </h4>
                                <p className="text-sm text-slate-300 mt-1">
                                    Current: {flag.value}
                                </p>
                                <p className="text-xs text-slate-400 mt-1">
                                    {flag.message}
                                </p>
                            </div>
                        </div>

                        {/* Recommendation */}
                        <div className="pl-9">
                            <p className="text-xs text-slate-400">
                                <strong className="text-slate-300">Recommended Actions:</strong>
                            </p>
                            <p className="text-xs text-slate-400 mt-1">
                                {flag.recommendation}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Schedule Integration Session CTA */}
            <div className="mt-6 pt-6 border-t border-yellow-500/20">
                <button className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-slate-300 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Schedule Integration Session
                </button>
            </div>
        </div>
    );
};
