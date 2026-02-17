import React from 'react';
import { Shield, AlertTriangle } from 'lucide-react';
import { BaselineRiskFlags } from './BaselineRiskFlags';
import { SessionRiskFlags } from './SessionRiskFlags';
import { ProgressRiskFlags } from './ProgressRiskFlags';
import { getRiskColor, getRiskIcon, type RiskLevel, type RiskFlag } from '../../utils/riskCalculator';

export interface RiskIndicatorsProps {
    overallRiskLevel: RiskLevel;
    baselineFlags: RiskFlag[];
    vitalFlags: RiskFlag[];
    progressFlags: RiskFlag[];
    patientId?: string;
    sessionTime?: string;
}

/**
 * RiskIndicators - Main risk dashboard widget
 * 
 * Shows:
 * - Overall risk level summary
 * - Baseline risk flags
 * - Session vital anomalies
 * - Progress trend warnings
 */
export const RiskIndicators: React.FC<RiskIndicatorsProps> = ({
    overallRiskLevel,
    baselineFlags,
    vitalFlags,
    progressFlags,
    patientId,
    sessionTime
}) => {
    const totalFlags = baselineFlags.length + vitalFlags.length + progressFlags.length;

    return (
        <div className="space-y-6">
            {/* Risk Summary Widget */}
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className={`p-3 rounded-lg ${overallRiskLevel === 'high' ? 'bg-red-500/20' :
                            overallRiskLevel === 'moderate' ? 'bg-yellow-500/20' :
                                'bg-emerald-500/20'
                        }`}>
                        {overallRiskLevel === 'low' ? (
                            <Shield className="w-6 h-6 text-emerald-400" />
                        ) : (
                            <AlertTriangle className={`w-6 h-6 ${getRiskColor(overallRiskLevel)}`} />
                        )}
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-slate-300">
                            Risk Summary
                        </h3>
                        {patientId && (
                            <p className="text-xs text-slate-500 mt-1">
                                Patient: {patientId}
                            </p>
                        )}
                    </div>
                </div>

                {/* Overall Risk Level */}
                <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-slate-400">Current Risk Level:</span>
                    <div className="flex items-center gap-2">
                        <span className="text-xl">{getRiskIcon(overallRiskLevel)}</span>
                        <span className={`text-2xl font-black uppercase ${getRiskColor(overallRiskLevel)}`}>
                            {overallRiskLevel}
                        </span>
                    </div>
                </div>

                {/* Active Flags Summary */}
                {totalFlags > 0 && (
                    <div className="pt-4 border-t border-slate-700/50">
                        <p className="text-sm text-slate-400 mb-3">
                            <strong className="text-slate-300">Active Flags:</strong>
                        </p>
                        <div className="space-y-2">
                            {baselineFlags.slice(0, 3).map((flag, index) => (
                                <div key={index} className="flex items-start gap-2 text-xs">
                                    <span>{getRiskIcon(flag.severity)}</span>
                                    <span className="text-slate-300">{flag.message} ({flag.metric})</span>
                                </div>
                            ))}
                            {baselineFlags.length > 3 && (
                                <p className="text-xs text-slate-500 pl-6">
                                    +{baselineFlags.length - 3} more baseline flags
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {/* Recent Changes */}
                {(vitalFlags.length > 0 || progressFlags.length > 0) && (
                    <div className="pt-4 border-t border-slate-700/50 mt-4">
                        <p className="text-sm text-slate-400 mb-2">
                            <strong className="text-slate-300">Recent Changes:</strong>
                        </p>
                        {vitalFlags.length > 0 && (
                            <p className="text-xs text-yellow-400">
                                ↑ {vitalFlags.length} vital sign anomal{vitalFlags.length !== 1 ? 'ies' : 'y'} detected
                            </p>
                        )}
                        {progressFlags.length > 0 && (
                            <p className="text-xs text-yellow-400 mt-1">
                                ↑ {progressFlags.length} declining trend{progressFlags.length !== 1 ? 's' : ''} detected
                            </p>
                        )}
                    </div>
                )}

                {/* View Full Report Button */}
                {totalFlags > 0 && (
                    <button className="w-full mt-6 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium transition-colors">
                        View Full Risk Report
                    </button>
                )}
            </div>

            {/* Detailed Risk Flags */}
            {baselineFlags.length > 0 && (
                <BaselineRiskFlags flags={baselineFlags} patientId={patientId} />
            )}

            {vitalFlags.length > 0 && (
                <SessionRiskFlags flags={vitalFlags} sessionTime={sessionTime} />
            )}

            {progressFlags.length > 0 && (
                <ProgressRiskFlags flags={progressFlags} />
            )}
        </div>
    );
};
