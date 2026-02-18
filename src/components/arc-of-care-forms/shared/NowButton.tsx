import React from 'react';
import { Clock } from 'lucide-react';

/**
 * NowButton - Quick timestamp capture button
 * 
 * Reduces time picker touches from 5-7 to 1 click.
 * Used across all Phase 2 forms for timestamp fields.
 */

interface NowButtonProps {
    onSetNow: (timestamp: Date) => void;
    disabled?: boolean;
    label?: string;
}

export const NowButton: React.FC<NowButtonProps> = ({
    onSetNow,
    disabled = false,
    label = 'Now'
}) => {
    const handleClick = () => {
        onSetNow(new Date());
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            disabled={disabled}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 
                 disabled:bg-slate-700 disabled:cursor-not-allowed
                 text-slate-300 text-xs font-bold rounded-lg transition-colors
                 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label={`Set to current time (${label})`}
        >
            <Clock className="w-3.5 h-3.5" />
            <span>{label}</span>
        </button>
    );
};

/**
 * RelativeTimeDisplay - Shows time relative to a reference point
 * 
 * Example: "(2 hours 15 minutes after dose)"
 */

interface RelativeTimeDisplayProps {
    referenceTime: Date;
    currentTime: Date;
    label?: string;
}

export const RelativeTimeDisplay: React.FC<RelativeTimeDisplayProps> = ({
    referenceTime,
    currentTime,
    label = 'after dose'
}) => {
    const diffMs = currentTime.getTime() - referenceTime.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;

    const timeString = hours > 0
        ? `${hours} hour${hours !== 1 ? 's' : ''} ${minutes} minute${minutes !== 1 ? 's' : ''}`
        : `${minutes} minute${minutes !== 1 ? 's' : ''}`;

    return (
        <p className="text-sm text-slate-300 mt-1">
            ({timeString} {label})
        </p>
    );
};
