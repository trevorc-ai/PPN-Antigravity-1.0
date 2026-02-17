import React from 'react';
import { Activity, TrendingUp } from 'lucide-react';
import { getRiskColor, getRiskIcon, type RiskFlag } from '../../utils/riskCalculator';

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
        <div className="bg-yellow-500/10 backdrop-blur-xl border border-yellow-500/30 rounded-2xl p-6">
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
                        <p className="text-xs text-yellow-400/70 mt-1">
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
                                <p className="text-xs text-slate-400 mt-1">
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
                <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                    {flags.map((flag, index) => (
                        <li key={index}>{flag.recommendation}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};
