import React from 'react';
import { Activity, TrendingUp } from 'lucide-react';
import { getRiskColor, getRiskIcon, type RiskFlag } from '../../utils/riskCalculator';
import { AdvancedTooltip } from '../ui/AdvancedTooltip';

export interface SessionRiskFlagsProps {
    flags: RiskFlag[];
    sessionTime?: string;
}

/**
 * SessionRiskFlags - Display vital sign anomaly indicators
 * 
 * Shows:
 * - Heart rate anomalies (>30% change from baseline)
 * - Blood pressure elevations
 * - SpO2 drops
 * - Temperature anomalies
 */
export const SessionRiskFlags: React.FC<SessionRiskFlagsProps> = ({
    flags,
    sessionTime
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
                            <div><span className="font-bold text-[#A8B5D1]">Heart Rate:</span> AHA Guidelines for PAT monitoring (2020).</div>
                            <div><span className="font-bold text-[#A8B5D1]">Blood Pressure:</span> JNC 8 Hypertension Guidelines.</div>
                            <div><span className="font-bold text-[#A8B5D1]">SpO2:</span> WHO Pulse Oximetry Training Manual.</div>
                            <div className="pt-2 border-t border-slate-700 text-slate-400 text-xs">Clinical decision support only — not a substitute for practitioner judgment.</div>
                        </div>
                    }
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-600 cursor-help hover:text-yellow-400 transition-colors"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                </AdvancedTooltip>
            </div>

            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-yellow-500/20 rounded-lg">
                    <Activity className="w-6 h-6 text-yellow-400" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-yellow-300">
                        Vitals Anomaly Detected
                    </h3>
                    {sessionTime && (
                        <p className="text-sm text-yellow-400/70 mt-1">
                            Session Time: {sessionTime}
                        </p>
                    )}
                </div>
            </div>

            {/* Vital Anomalies */}
            <div className="space-y-3">
                {flags.map((flag, index) => (
                    <div key={index} className="flex items-start gap-3">
                        <span className="text-lg flex-shrink-0 mt-0.5">
                            {getRiskIcon(flag.severity)}
                        </span>
                        <div className="flex-1">
                            <div className="flex items-start justify-between gap-2">
                                <span className="text-sm font-semibold text-slate-300">
                                    {flag.metric}:
                                </span>
                                <span className={`text-sm font-bold ${getRiskColor(flag.severity)}`}>
                                    {flag.value}
                                </span>
                            </div>
                            {flag.threshold && (
                                <p className="text-sm text-slate-400 mt-1">
                                    Threshold: {flag.threshold}% change from baseline
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Recommended Actions */}
            <div className="mt-4 pt-4 border-t border-yellow-500/20">
                <p className="text-sm text-yellow-300 font-semibold mb-2">
                    Recommended Actions:
                </p>
                <ul className="text-sm text-slate-300 space-y-1 list-disc list-outside pl-4">
                    {flags.map((flag, index) => (
                        <li key={index}>{flag.recommendation}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};
