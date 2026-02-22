import React from 'react';

interface ChartSkeletonProps {
    height?: string | number;
    className?: string;
}

export const ChartSkeleton: React.FC<ChartSkeletonProps> = ({
    height = '400px',
    className = ''
}) => {
    return (
        <div
            className={`animate-pulse bg-slate-800/50 rounded-lg ${className}`}
            style={{ height }}
            role="status"
            aria-label="Loading chart data"
        >
            <div className="flex items-center justify-center h-full">
                <div className="text-slate-500 text-sm font-medium">Loading chart...</div>
            </div>
        </div>
    );
};
