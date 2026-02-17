import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';

/**
 * CompletenessWidget - Benchmark Readiness Dashboard
 * 
 * Shows practitioners their data quality immediately after first form submission.
 * Critical for Week 1 value delivery.
 */

interface CompletenessWidgetProps {
    patientId: string;
    benchmarkReadiness: number; // 0-1 (0% to 100%)
    completedRequirements: string[];
    missingRequirements: string[];
    onCompleteClick?: () => void;
}

const REQUIREMENT_LABELS: Record<string, string> = {
    baseline: 'Baseline outcome measure',
    exposure: 'Coded exposure record',
    setting: 'Coded setting/support',
    followup: 'Follow-up timepoint',
    safety: 'Safety event capture'
};

export const CompletenessWidget: React.FC<CompletenessWidgetProps> = ({
    patientId,
    benchmarkReadiness,
    completedRequirements,
    missingRequirements,
    onCompleteClick
}) => {
    const totalRequirements = completedRequirements.length + missingRequirements.length;
    const percentage = Math.round(benchmarkReadiness * 100);
    const filledDots = Math.round((benchmarkReadiness * 5));

    return (
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 space-y-4">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <span className="text-2xl">📊</span>
                </div>
                <div>
                    <h3 className="text-lg font-bold text-slate-300">Data Completeness</h3>
                    <p className="text-xs text-slate-300">Patient: {patientId}</p>
                </div>
            </div>

            {/* Benchmark Readiness */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-300">Benchmark Readiness</span>
                    <span className="text-2xl font-black text-blue-400">{percentage}%</span>
                </div>

                {/* Progress Dots */}
                <div className="flex items-center gap-2">
                    {[...Array(5)].map((_, i) => (
                        <div
                            key={i}
                            className={`flex-1 h-2 rounded-full transition-colors ${i < filledDots ? 'bg-blue-500' : 'bg-slate-700'
                                }`}
                        />
                    ))}
                </div>

                <p className="text-xs text-slate-300">
                    {completedRequirements.length} of {totalRequirements} requirements met
                </p>
            </div>

            {/* Requirements List */}
            <div className="space-y-2">
                {/* Completed */}
                {completedRequirements.map((req) => (
                    <div key={req} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        <span className="text-slate-300">{REQUIREMENT_LABELS[req] || req}</span>
                    </div>
                ))}

                {/* Missing */}
                {missingRequirements.map((req) => (
                    <div key={req} className="flex items-center gap-2 text-sm">
                        <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                        <span className="text-slate-300">Missing: {REQUIREMENT_LABELS[req] || req}</span>
                    </div>
                ))}
            </div>

            {/* Action Button */}
            {missingRequirements.length > 0 && onCompleteClick && (
                <button
                    onClick={onCompleteClick}
                    className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-slate-300 text-sm font-bold rounded-lg
                   transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Complete Missing Forms
                </button>
            )}
        </div>
    );
};
