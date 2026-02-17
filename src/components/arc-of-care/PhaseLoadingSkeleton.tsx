import React from 'react';

/**
 * Phase Loading Skeleton
 * 
 * Loading skeleton for lazy-loaded phase components
 * Prevents layout shift during phase transitions
 */
export const PhaseLoadingSkeleton: React.FC = () => {
    return (
        <div className="space-y-6 animate-pulse">
            {/* Header Skeleton */}
            <div className="h-8 w-64 bg-slate-700/50 rounded-lg" />

            {/* Card Skeletons */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6 space-y-4">
                    <div className="h-6 w-48 bg-slate-700/50 rounded" />
                    <div className="h-4 w-full bg-slate-700/30 rounded" />
                    <div className="h-4 w-3/4 bg-slate-700/30 rounded" />
                </div>

                <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6 space-y-4">
                    <div className="h-6 w-48 bg-slate-700/50 rounded" />
                    <div className="h-4 w-full bg-slate-700/30 rounded" />
                    <div className="h-4 w-3/4 bg-slate-700/30 rounded" />
                </div>
            </div>

            {/* Chart Skeleton */}
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6">
                <div className="h-6 w-40 bg-slate-700/50 rounded mb-4" />
                <div className="h-64 w-full bg-slate-700/30 rounded" />
            </div>
        </div>
    );
};
