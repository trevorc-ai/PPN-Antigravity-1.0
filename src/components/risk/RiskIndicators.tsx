import React from 'react';
import { Shield, AlertTriangle } from 'lucide-react';
import { BaselineRiskFlags } from './BaselineRiskFlags';
import { SessionRiskFlags } from './SessionRiskFlags';
import { ProgressRiskFlags } from './ProgressRiskFlags';
import { getRiskColor, getRiskIcon, type RiskLevel, type RiskFlag } from '../../utils/riskCalculator';
import { downloadReport } from '../../services/reportGenerator';
import { AdvancedTooltip } from '../ui/AdvancedTooltip';


interface PatientCharacteristics {
    gender: string;
    age: number;
    weight: string;
    ethnicity: string;
    medications: string[];
    treatment: string;
    notes?: string;
}

export interface RiskIndicatorsProps {
    overallRiskLevel: RiskLevel;
    baselineFlags: RiskFlag[];
    vitalFlags: RiskFlag[];
    progressFlags: RiskFlag[];
    patientId?: string;
    patientCharacteristics?: PatientCharacteristics;
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
    patientCharacteristics,
    sessionTime
}) => {
    const totalFlags = baselineFlags.length + vitalFlags.length + progressFlags.length;

    return (
        <div className="space-y-6">
            {/* Risk Summary Widget */}
            <div className={`relative card-glass rounded-2xl p-6 transition-all duration-300 ${overallRiskLevel === 'high' ? 'border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.2)]' :
                overallRiskLevel === 'moderate' ? 'border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.1)]' :
                    ''
                }`}>

                {/* Top Row: Icon + Title | Risk Level Badge */}
                <div className="grid grid-cols-2 mb-3" style={{ minHeight: '72px' }}>
                    {/* Left: Icon + Title + Patient ID */}
                    <div className="flex items-start gap-4">
                        <div className={`p-4 rounded-xl flex-shrink-0 ${overallRiskLevel === 'high' ? 'bg-red-500/20' :
                            overallRiskLevel === 'moderate' ? 'bg-yellow-500/20' :
                                'bg-emerald-500/20'
                            }`}>
                            {overallRiskLevel === 'low' ? (
                                <Shield className="w-8 h-8 text-emerald-400" />
                            ) : overallRiskLevel === 'moderate' ? (
                                <AlertTriangle className="w-8 h-8 text-amber-400" />
                            ) : (
                                <AlertTriangle className="w-8 h-8 text-red-500" />
                            )}
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-[#A8B5D1]">Risk Analysis</h3>
                            {patientId && (
                                <div className="mt-1">
                                    <span className="text-sm text-slate-400">Patient: </span>
                                    <span className="text-sm text-[#A8B5D1] font-medium">{patientId}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right: Risk Level Badge — centered both axes */}
                    <div className="flex items-center justify-center">
                        <div className="flex items-center gap-2">
                            <span className="text-3xl">{getRiskIcon(overallRiskLevel)}</span>
                            <span className={`text-4xl font-black uppercase tracking-wide ${getRiskColor(overallRiskLevel)}`}>
                                {overallRiskLevel}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Tooltip — absolute top-right corner, opens bottom-left */}
                <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem' }}>
                    <AdvancedTooltip
                        tier="guide"
                        type="info"
                        side="bottom-left"
                        title="Risk Calculation Logic"
                        width="w-80"
                        content={
                            <div className="text-sm">
                                Risk level is calculated based on baseline assessments (PHQ-9, GAD-7, ACE), real-time vitals, and algorithmic prediction of adverse event probability compared to the global patient population.
                                <div className="mt-2 pt-2 border-t border-slate-700 text-slate-400 text-xs">Clinical decision support only — not a substitute for practitioner judgment.</div>
                            </div>
                        }
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500 cursor-help hover:text-slate-300 transition-colors"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                    </AdvancedTooltip>
                </div>

                {/* Patient Characteristics — Left justified, below header */}
                {patientCharacteristics && (
                    <div className="mb-5 pl-1 space-y-1 border-b border-slate-700/50 pb-4">
                        <div className="text-sm font-medium text-[#A8B5D1]">
                            {patientCharacteristics.age}yo {patientCharacteristics.gender} • {patientCharacteristics.weight} • {patientCharacteristics.ethnicity}
                        </div>
                        <div className="text-sm text-slate-300">
                            {patientCharacteristics.treatment}
                        </div>
                        <div className="text-sm text-slate-400">
                            {patientCharacteristics.medications.join(', ') || 'None'}
                        </div>
                    </div>
                )}


                {/* Active Flags Summary */}
                {totalFlags > 0 && (
                    <div className="pt-4 border-t border-slate-700/50">
                        <p className="text-sm text-slate-400 mb-3">
                            <strong className="text-slate-300">Active Flags:</strong>
                        </p>
                        <div className="space-y-2">
                            {baselineFlags.slice(0, 3).map((flag, index) => (
                                <div key={index} className="flex items-start gap-2 text-sm">
                                    <span>{getRiskIcon(flag.severity)}</span>
                                    <span className="text-slate-300">{flag.message} ({flag.metric})</span>
                                </div>
                            ))}
                            {baselineFlags.length > 3 && (
                                <p className="text-sm text-slate-400 pl-6">
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
                            <p className="text-sm text-yellow-400">
                                ↑ {vitalFlags.length} vital sign anomal{vitalFlags.length !== 1 ? 'ies' : 'y'} detected
                            </p>
                        )}
                        {progressFlags.length > 0 && (
                            <p className="text-sm text-yellow-400 mt-1">
                                ↑ {progressFlags.length} declining trend{progressFlags.length !== 1 ? 's' : ''} detected
                            </p>
                        )}
                    </div>
                )}

                {/* View Full Report Button */}
                {totalFlags > 0 && (
                    <button
                        className="w-full mt-6 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-[#A8B5D1] rounded-lg font-medium transition-colors"
                        onClick={() => downloadReport({
                            patientId: patientId ?? 'UNKNOWN',
                            baseline: {
                                phq9: baselineFlags.find(f => f.metric === 'PHQ-9 (Depression)')?.value as number | undefined,
                                gad7: baselineFlags.find(f => f.metric === 'GAD-7 (Anxiety)')?.value as number | undefined,
                                pcl5: baselineFlags.find(f => f.metric === 'PCL-5 (PTSD)')?.value as number | undefined,
                            }
                        }, 'audit')}
                    >
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
