import React from 'react';

interface SkeletonCardProps {
    variant?: 'patient' | 'substance' | 'clinician';
}

/**
 * Custom skeleton loader that matches the exact shape of result cards
 * Provides visual feedback during search loading states
 */
const SkeletonCard: React.FC<SkeletonCardProps> = ({ variant = 'patient' }) => {
    return (
        <div
            className="card-glass rounded-3xl p-6 border border-slate-800 animate-pulse"
            role="status"
            aria-label="Loading search results"
        >
            {/* Header Section */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1 space-y-3">
                    {/* Icon placeholder */}
                    <div className="size-12 bg-slate-800 rounded-xl" />

                    {/* Title placeholder */}
                    <div className="h-6 bg-slate-800 rounded-lg w-3/4" />

                    {/* Subtitle placeholder */}
                    <div className="h-4 bg-slate-800 rounded w-1/2" />
                </div>

                {/* Badge placeholder */}
                <div className="h-6 w-20 bg-slate-800 rounded-full" />
            </div>

            {/* Content Section */}
            <div className="space-y-3 mt-6">
                {variant === 'patient' && (
                    <>
                        {/* Patient-specific placeholders */}
                        <div className="flex gap-2">
                            <div className="h-8 w-24 bg-slate-800 rounded-lg" />
                            <div className="h-8 w-24 bg-slate-800 rounded-lg" />
                            <div className="h-8 w-24 bg-slate-800 rounded-lg" />
                        </div>
                        <div className="h-4 bg-slate-800 rounded w-full" />
                        <div className="h-4 bg-slate-800 rounded w-5/6" />
                    </>
                )}

                {variant === 'substance' && (
                    <>
                        {/* Substance-specific placeholders */}
                        <div className="h-4 bg-slate-800 rounded w-full" />
                        <div className="h-4 bg-slate-800 rounded w-4/5" />
                        <div className="flex gap-2 mt-4">
                            <div className="h-6 w-16 bg-slate-800 rounded" />
                            <div className="h-6 w-16 bg-slate-800 rounded" />
                        </div>
                    </>
                )}

                {variant === 'clinician' && (
                    <>
                        {/* Clinician-specific placeholders */}
                        <div className="h-4 bg-slate-800 rounded w-3/4" />
                        <div className="h-4 bg-slate-800 rounded w-2/3" />
                        <div className="flex gap-2 mt-4">
                            <div className="h-8 w-20 bg-slate-800 rounded-lg" />
                            <div className="h-8 w-20 bg-slate-800 rounded-lg" />
                        </div>
                    </>
                )}
            </div>

            {/* Screen reader text */}
            <span className="sr-only">Loading search results...</span>
        </div>
    );
};

export default SkeletonCard;
