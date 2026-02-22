import React from 'react';
import { TrendingDown } from 'lucide-react';
import { getRiskColor, getRiskIcon, type RiskFlag } from '../../utils/riskCalculator';
import { AdvancedTooltip } from '../ui/AdvancedTooltip';

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
        <div className="relative bg-yellow-500/10 backdrop-blur-xl border border-yellow-500/30 rounded-2xl p-6">

            {/* Tooltip — top-right corner, opens inward */}
            <div style={{ position: 'absolute', top: '1.25rem', right: '1.25rem' }}>
                <AdvancedTooltip
                    tier="guide"
                    type="warning"
                    side="bottom-left"
                    title="Evidence Sources"
                    width="w-80"
                    content={
                        <div className="space-y-2 text-sm">
                            <div><span className="font-bold text-[#A8B5D1]">PHQ-9 Trend:</span> Kroenke & Spitzer (2002). J Gen Intern Med.</div>
                            <div><span className="font-bold text-[#A8B5D1]">GAD-7 Trend:</span> Spitzer et al. (2006). Arch Intern Med.</div>
                            <div><span className="font-bold text-[#A8B5D1]">PCL-5 Trend:</span> Weathers et al. (2013). VA PTSD Research.</div>
                            <div className="pt-2 border-t border-slate-700 text-slate-400 text-xs">Declining trends defined as ≥5% regression toward baseline over 2+ consecutive check-ins. Clinical decision support only — not a substitute for practitioner judgment.</div>
                        </div>
                    }
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-600 cursor-help hover:text-yellow-400 transition-colors"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                </AdvancedTooltip>
            </div>

            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-yellow-500/20 rounded-lg">
                    <TrendingDown className="w-6 h-6 text-yellow-400" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-yellow-300">
                        Declining Progress Detected
                    </h3>
                    <p className="text-sm text-yellow-400/70 mt-1">
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
                                <p className="text-sm text-slate-400 mt-1">
                                    {flag.message}
                                </p>
                            </div>
                        </div>

                        {/* Recommendation */}
                        <div className="pl-9">
                            <p className="text-sm text-slate-400">
                                <strong className="text-[#A8B5D1]">Recommended Actions:</strong>
                            </p>
                            <p className="text-sm text-slate-400 mt-1">
                                {flag.recommendation}
                            </p>
                        </div>
                    </div>
                ))}
            </div>


        </div>
    );
};
