
import React, { useState } from 'react';
import { FlaskConical, X } from 'lucide-react';

interface DemoDataBadgeProps {
    /** If false (real data present), the badge is not rendered */
    isDemo: boolean;
    className?: string;
}

/**
 * DemoDataBadge
 * 
 * Shows an amber pill indicator when a panel is running on mock/demo data.
 * Disappears automatically when isDemo becomes false (real data loaded).
 * Dismissible by the user for the current session.
 * 
 * Meets accessibility requirements:
 * - Uses text label (not color-only)
 * - Minimum font-size ≥ 12px
 * - role="status" for screen reader announcement
 */
export const DemoDataBadge: React.FC<DemoDataBadgeProps> = ({ isDemo, className = '' }) => {
    const [dismissed, setDismissed] = useState(false);

    if (!isDemo || dismissed) return null;

    return (
        <div
            role="status"
            aria-live="polite"
            aria-label="This panel is displaying demo data. Connect patient records to see live data."
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border
        bg-amber-500/10 border-amber-500/30 text-amber-400
        text-xs font-bold uppercase tracking-widest
        transition-all duration-200
        ${className}`}
        >
            <FlaskConical size={11} aria-hidden="true" />
            <span>[DEMO DATA]</span>
            <button
                onClick={() => setDismissed(true)}
                aria-label="Dismiss demo data indicator"
                className="ml-0.5 hover:text-amber-200 transition-colors focus:outline-none focus:ring-1 focus:ring-amber-400/50 rounded-full"
            >
                <X size={10} />
            </button>
        </div>
    );
};
