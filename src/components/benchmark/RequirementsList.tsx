import React from 'react';
import { CheckCircle, AlertCircle, Calendar, FileText } from 'lucide-react';
import type { BenchmarkReadinessResult } from '../../utils/benchmarkReadinessCalculator';

export interface RequirementsListProps {
    result: BenchmarkReadinessResult;
    onCompleteRequirement?: (requirementName: string) => void;
}

/**
 * RequirementsList - Detailed list of benchmark requirements
 * 
 * Shows:
 * - Requirement name
 * - Associated form
 * - Completion date (if met)
 * - Action button (if not met)
 */
export const RequirementsList: React.FC<RequirementsListProps> = ({
    result,
    onCompleteRequirement
}) => {
    const formatDate = (dateString?: string): string => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-slate-800 rounded-lg">
                    <FileText className="w-6 h-6 text-slate-400" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-slate-300">
                        Benchmark Requirements
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                        5 requirements for network benchmarking
                    </p>
                </div>
            </div>

            {/* Requirements List */}
            <div className="space-y-4">
                {result.requirements.map((req, index) => (
                    <div
                        key={index}
                        className={`p-4 rounded-lg border ${req.met
                                ? 'bg-emerald-500/5 border-emerald-500/20'
                                : 'bg-slate-800/50 border-slate-700/50'
                            }`}
                    >
                        {/* Requirement Header */}
                        <div className="flex items-start gap-3 mb-2">
                            <div className="flex-shrink-0 mt-0.5">
                                {req.met ? (
                                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                                ) : (
                                    <AlertCircle className="w-5 h-5 text-yellow-400" />
                                )}
                            </div>
                            <div className="flex-1">
                                <h4 className={`font-semibold ${req.met ? 'text-emerald-300' : 'text-slate-300'}`}>
                                    {index + 1}. {req.name}
                                </h4>
                                <p className="text-xs text-slate-500 mt-1">
                                    Form: {req.form}
                                </p>
                            </div>
                        </div>

                        {/* Completion Info or Action */}
                        {req.met ? (
                            <div className="flex items-center gap-2 ml-8 text-xs text-emerald-400">
                                <Calendar className="w-3 h-3" />
                                <span>Completed: {formatDate(req.completedAt)}</span>
                            </div>
                        ) : (
                            <div className="ml-8 mt-3">
                                <p className="text-xs text-slate-400 mb-2">
                                    Action: {req.action}
                                </p>
                                {onCompleteRequirement && (
                                    <button
                                        onClick={() => onCompleteRequirement(req.name)}
                                        className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-slate-300 text-xs rounded-lg font-medium transition-colors"
                                    >
                                        Complete Now
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
