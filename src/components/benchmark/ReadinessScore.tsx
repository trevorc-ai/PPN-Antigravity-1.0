import React from 'react';
import { Target, CheckCircle, AlertCircle } from 'lucide-react';
import { getProgressSegments, formatScore, type BenchmarkReadinessResult } from '../../utils/benchmarkReadinessCalculator';

export interface ReadinessScoreProps {
    result: BenchmarkReadinessResult;
    onViewBenchmarks?: () => void;
}

/**
 * ReadinessScore - Visual progress widget for benchmark readiness
 * 
 * Shows:
 * - Percentage score (0-100%)
 * - Progress bar with 5 segments
 * - Met vs. missing requirements
 * - Call-to-action button
 */
export const ReadinessScore: React.FC<ReadinessScoreProps> = ({
    result,
    onViewBenchmarks
}) => {
    const segments = getProgressSegments(result.metCount);
    const isBenchmarkReady = result.isBenchmarkReady;

    return (
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
                <div className={`p-3 rounded-lg ${isBenchmarkReady ? 'bg-emerald-500/20' : 'bg-blue-500/20'}`}>
                    <Target className={`w-6 h-6 ${isBenchmarkReady ? 'text-emerald-400' : 'text-blue-400'}`} />
                </div>
                <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-300">
                        Benchmark Readiness: {formatScore(result.score)}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                        {result.metCount} of {result.totalCount} Requirements Met
                    </p>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="flex items-center gap-2 mb-6">
                {segments.map((met, index) => (
                    <div
                        key={index}
                        className={`flex-1 h-3 rounded-full transition-all ${met
                                ? 'bg-emerald-500'
                                : 'bg-slate-700/50'
                            }`}
                        aria-label={`Requirement ${index + 1} ${met ? 'met' : 'not met'}`}
                    />
                ))}
            </div>

            {/* Requirements Summary */}
            <div className="space-y-2 mb-6">
                {result.requirements.map((req, index) => (
                    <div key={index} className="flex items-start gap-2">
                        {req.met ? (
                            <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        ) : (
                            <AlertCircle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                        )}
                        <span className={`text-sm ${req.met ? 'text-slate-300' : 'text-slate-400'}`}>
                            {req.met ? '✓' : '⚠️'} {req.name}
                        </span>
                    </div>
                ))}
            </div>

            {/* Call to Action */}
            {isBenchmarkReady ? (
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4">
                    <p className="text-emerald-300 font-semibold mb-3">
                        🎉 Episode is benchmark-ready!
                    </p>
                    {onViewBenchmarks && (
                        <button
                            onClick={onViewBenchmarks}
                            className="w-full px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-slate-300 rounded-lg font-medium transition-colors"
                        >
                            View Network Benchmarks
                        </button>
                    )}
                </div>
            ) : (
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                    <p className="text-blue-300 text-sm">
                        Complete {5 - result.metCount} more requirement{5 - result.metCount !== 1 ? 's' : ''} to reach benchmark-ready status
                    </p>
                </div>
            )}
        </div>
    );
};
