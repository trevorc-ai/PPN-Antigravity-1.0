import React from 'react';
import { AlertTriangle, Shield } from 'lucide-react';
import { getRiskColor, getRiskIcon, type RiskFlag } from '../../utils/riskCalculator';
import { AdvancedTooltip } from '../ui/AdvancedTooltip';

export interface BaselineRiskFlagsProps {
    flags: RiskFlag[];
    patientId?: string;
}

/**
 * BaselineRiskFlags - Display baseline assessment risk indicators
 * 
 * Shows:
 * - Risk flags from PHQ-9, GAD-7, PCL-5, ACE scores
 * - Severity indicators (high/moderate)
 * - Recommended actions
 */
export const BaselineRiskFlags: React.FC<BaselineRiskFlagsProps> = ({
    flags,
    patientId
}) => {
    if (flags.length === 0) {
        return (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4">
                <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-emerald-400" />
                    <div>
                        <p className="text-emerald-300 font-semibold">No Baseline Risk Indicators</p>
                        <p className="text-emerald-400/70 text-sm mt-1">
                            All baseline assessments within normal ranges
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="card-glass rounded-2xl p-6">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-yellow-500/20 rounded-lg">
                    <AlertTriangle className="w-6 h-6 text-yellow-400" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-slate-300">
                        Risk Indicators Detected
                    </h3>
                    {patientId && (
                        <p className="text-sm text-slate-400 mt-1">
                            Patient: {patientId}
                        </p>
                    )}
                </div>
            </div>

            {/* Risk Flags */}
            <div className="space-y-3">
                {flags.map((flag, index) => (
                    <div
                        key={index}
                        className={`p-4 rounded-lg border ${flag.severity === 'high'
                            ? 'bg-red-500/10 border-red-500/30'
                            : 'bg-yellow-500/10 border-yellow-500/30'
                            }`}
                    >
                        <div className="flex items-start gap-3">
                            <span className="text-xl flex-shrink-0">
                                {getRiskIcon(flag.severity)}
                            </span>
                            <div className="flex-1">
                                <div className="flex items-start justify-between gap-2">
                                    <h4 className={`font-semibold ${getRiskColor(flag.severity)}`}>
                                        {flag.message}
                                    </h4>
                                    <span className="text-sm text-slate-400 whitespace-nowrap">
                                        {flag.metric}
                                    </span>
                                </div>
                                <p className="text-sm font-bold text-[#A8B5D1] mt-1">
                                    Score: {flag.value}
                                    {flag.threshold && ` (Threshold: ≥${flag.threshold})`}
                                </p>
                            </div>
                        </div>

                        {/* Recommendation */}
                        <div className="mt-3 pl-9">
                            <div className="flex items-center gap-1.5">
                                <p className="text-sm text-slate-400">
                                    <strong className="text-[#A8B5D1]">Recommended Actions:</strong>
                                </p>
                                <AdvancedTooltip
                                    tier="guide"
                                    type="science"
                                    side="bottom"
                                    title="Evidence Sources"
                                    width="w-80"
                                    content={
                                        <div className="space-y-2 text-sm">
                                            <div><span className="font-bold text-[#A8B5D1]">PHQ-9:</span> Kroenke &amp; Spitzer (2002). J Gen Intern Med.</div>
                                            <div><span className="font-bold text-[#A8B5D1]">GAD-7:</span> Spitzer et al. (2006). Arch Intern Med.</div>
                                            <div><span className="font-bold text-[#A8B5D1]">PCL-5:</span> Weathers et al. (2013). VA PTSD Research.</div>
                                            <div><span className="font-bold text-[#A8B5D1]">ACE:</span> Felitti et al. (1998). Am J Prev Med.</div>
                                            <div className="pt-2 border-t border-slate-700 text-slate-400 text-xs">Clinical decision support only — not a substitute for practitioner judgment.</div>
                                        </div>
                                    }
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500 cursor-help hover:text-slate-300 transition-colors"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                                </AdvancedTooltip>
                            </div>
                            <p className="text-sm text-slate-400 mt-1">
                                {flag.recommendation}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Summary Actions */}
            <div className="mt-6 pt-6 border-t border-slate-700/50">
                <p className="text-sm text-slate-400 mb-3">
                    <strong className="text-slate-300">General Recommendations:</strong>
                </p>
                <ul className="text-sm text-slate-400 space-y-1 list-disc list-inside">
                    <li>Trauma-informed approach required</li>
                    <li>Close monitoring during session</li>
                    <li>Have rescue medication available</li>
                    <li>Ensure experienced practitioner present</li>
                </ul>
            </div>
        </div>
    );
};
