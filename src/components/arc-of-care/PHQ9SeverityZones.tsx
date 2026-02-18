import React from 'react';
import { Brain, Activity, AlertTriangle, ShieldAlert } from 'lucide-react';

interface PHQ9SeverityZonesProps {
    score: number; // 0-27
}

/**
 * PHQ9SeverityZones - Patient Health Questionnaire-9 (Depression) severity visualization
 * 
 * Displays depression severity with clinical zones:
 * - 0-4: Minimal (Green)
 * - 5-9: Mild (Blue)
 * - 10-14: Moderate (Amber)
 * - 15-27: Moderately Severe to Severe (Red)
 * 
 * PHQ-9 is the gold standard for depression screening in clinical settings.
 */
const PHQ9SeverityZones: React.FC<PHQ9SeverityZonesProps> = ({ score }) => {
    // Clamp score to valid range
    const clampedScore = Math.max(0, Math.min(27, score));

    // Determine severity
    const getSeverity = (value: number) => {
        if (value <= 4) return {
            label: 'Minimal',
            color: 'emerald',
            icon: Brain,
            risk: 'No clinically significant depression',
            recommendation: 'Standard protocol appropriate'
        };
        if (value <= 9) return {
            label: 'Mild',
            color: 'blue',
            icon: Activity,
            risk: 'Mild depression symptoms present',
            recommendation: 'Monitor symptoms during integration'
        };
        if (value <= 14) return {
            label: 'Moderate',
            color: 'amber',
            icon: AlertTriangle,
            risk: 'Moderate depression documented',
            recommendation: 'Enhanced safety monitoring recommended'
        };
        return {
            label: 'Severe',
            color: 'red',
            icon: ShieldAlert,
            risk: 'Moderately severe to severe depression',
            recommendation: 'Psychiatric consultation and safety protocol required'
        };
    };

    const severity = getSeverity(clampedScore);
    const Icon = severity.icon;

    // Define zones
    const zones = [
        { label: 'Minimal', range: '0-4', min: 0, max: 4, color: 'emerald' },
        { label: 'Mild', range: '5-9', min: 5, max: 9, color: 'blue' },
        { label: 'Moderate', range: '10-14', min: 10, max: 14, color: 'amber' },
        { label: 'Severe', range: '15-27', min: 15, max: 27, color: 'red' }
    ];

    // Color classes
    const colorClasses = {
        emerald: {
            bg: 'bg-emerald-500',
            text: 'text-emerald-400',
            border: 'border-emerald-500/30',
            ring: 'ring-emerald-500/50'
        },
        blue: {
            bg: 'bg-blue-500',
            text: 'text-blue-400',
            border: 'border-blue-500/30',
            ring: 'ring-blue-500/50'
        },
        amber: {
            bg: 'bg-amber-500',
            text: 'text-amber-400',
            border: 'border-amber-500/30',
            ring: 'ring-amber-500/50'
        },
        red: {
            bg: 'bg-red-500',
            text: 'text-red-400',
            border: 'border-red-500/30',
            ring: 'ring-red-500/50'
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
                    <span className="text-slate-300 text-sm">/27</span>
                </div>
                <div className={`px-3 py-1 rounded-full ${colors.bg}/10 border ${colors.border}`}>
                    <span className={`text-sm font-medium ${colors.text}`}>{severity.label}</span>
                </div>
            </div>

            {/* Severity Zones */}
            <div className="grid grid-cols-4 gap-2">
                {zones.map((zone) => {
                    const isActive = clampedScore >= zone.min && clampedScore <= zone.max;
                    const zoneColors = colorClasses[zone.color];

                    return (
                        <div
                            key={zone.label}
                            className={`
                p-3 rounded-lg border transition-all duration-300
                ${isActive
                                    ? `${zoneColors.bg}/20 ${zoneColors.border} ring-2 ${zoneColors.ring}`
                                    : 'bg-slate-800/30 border-slate-700/30'
                                }
              `}
                        >
                            <div className={`text-xs font-medium mb-1 ${isActive ? zoneColors.text : 'text-slate-300'}`}>
                                {zone.label}
                            </div>
                            <div className={`text-xs ${isActive ? 'text-slate-300' : 'text-slate-500'}`}>
                                {zone.range}
                            </div>
                            {isActive && (
                                <div className="mt-2 flex items-center justify-center">
                                    <div className={`w-2 h-2 rounded-full ${zoneColors.bg} animate-pulse`}></div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Visual Scale */}
            <div className="relative h-2 bg-slate-800/50 rounded-full overflow-hidden">
                {/* Background gradient zones */}
                <div className="absolute inset-0 flex">
                    <div className="flex-[4] bg-emerald-500/20"></div>
                    <div className="flex-[5] bg-blue-500/20"></div>
                    <div className="flex-[5] bg-amber-500/20"></div>
                    <div className="flex-[13] bg-red-500/20"></div>
                </div>

                {/* Score indicator */}
                <div
                    className="absolute top-0 bottom-0 w-1 bg-white shadow-lg"
                    style={{ left: `${(clampedScore / 27) * 100}%` }}
                >
                    <div className="absolute -top-1 -left-1 w-3 h-3 bg-white rounded-full shadow-lg"></div>
                </div>
            </div>

            {/* Clinical Insight */}
            <div className="mt-3 p-3 bg-slate-800/30 rounded-lg border border-slate-700/30">
                <div className="space-y-2">
                    <div className="flex items-start gap-2">
                        <AlertTriangle className={`w-4 h-4 ${colors.text} mt-0.5 flex-shrink-0`} />
                        <div>
                            <p className={`text-sm font-semibold ${colors.text}`}>{severity.risk}</p>
                            <p className="text-slate-300 text-sm mt-1">{severity.recommendation}</p>
                        </div>
                    </div>

                    {clampedScore >= 15 && (
                        <div className="mt-2 pt-2 border-t border-slate-700/30">
                            <p className="text-slate-300 text-xs">
                                <span className="font-semibold">Note:</span> PHQ-9 score ≥15 indicates moderately severe to severe depression. Consider psychiatric consultation and enhanced safety monitoring throughout treatment.
                            </p>
                        </div>
                    )}

                    {clampedScore >= 10 && clampedScore < 15 && (
                        <div className="mt-2 pt-2 border-t border-slate-700/30">
                            <p className="text-slate-300 text-xs">
                                <span className="font-semibold">Note:</span> Moderate depression documented. Monitor for symptom changes during integration phase.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PHQ9SeverityZones;
