import React, { useEffect, useState } from 'react';
import { X, Info, CheckCircle, AlertCircle } from 'lucide-react';

/**
 * FeedbackToast - Instant Feedback Messages
 * 
 * Provides contextual insights after form submission.
 * Critical for Week 1 value delivery.
 */

interface FeedbackToastProps {
    message: string;
    type: 'info' | 'success' | 'warning';
    action?: string;
    onActionClick?: () => void;
    onClose?: () => void;
    autoClose?: boolean;
    autoCloseDelay?: number; // milliseconds, default: 5000
}

export const FeedbackToast: React.FC<FeedbackToastProps> = ({
    message,
    type,
    action,
    onActionClick,
    onClose,
    autoClose = true,
    autoCloseDelay = 5000
}) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        if (autoClose) {
            const timer = setTimeout(() => {
                setIsVisible(false);
                onClose?.();
            }, autoCloseDelay);

            return () => clearTimeout(timer);
        }
    }, [autoClose, autoCloseDelay, onClose]);

    const getIcon = () => {
        switch (type) {
            case 'success':
                return <CheckCircle className="w-5 h-5 text-emerald-400" />;
            case 'warning':
                return <AlertCircle className="w-5 h-5 text-amber-400" />;
            default:
                return <Info className="w-5 h-5 text-blue-400" />;
        }
    };

    const getStyles = () => {
        switch (type) {
            case 'success':
                return 'bg-emerald-500/20 border-emerald-500/50';
            case 'warning':
                return 'bg-amber-500/20 border-amber-500/50';
            default:
                return 'bg-blue-500/20 border-blue-500/50';
        }
    };

    if (!isVisible) return null;

    return (
        <div
            className={`fixed top-24 right-6 z-50 max-w-md backdrop-blur-xl border rounded-xl p-4 shadow-2xl
                 animate-slide-in-right ${getStyles()}`}
            role="alert"
            aria-live="polite"
        >
            <div className="flex items-start gap-3">
                {/* Icon */}
                <div className="flex-shrink-0 mt-0.5">{getIcon()}</div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-300 leading-relaxed">
                        {message}
                    </p>

                    {/* Action Button */}
                    {action && onActionClick && (
                        <button
                            onClick={onActionClick}
                            className="mt-2 text-xs font-bold text-blue-400 hover:text-blue-300 underline
                       focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                        >
                            {action}
                        </button>
                    )}
                </div>

                {/* Close Button */}
                <button
                    onClick={() => {
                        setIsVisible(false);
                        onClose?.();
                    }}
                    className="flex-shrink-0 p-1 rounded-lg hover:bg-slate-800 transition-colors
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Close notification"
                >
                    <X className="w-4 h-4 text-slate-300" />
                </button>
            </div>
        </div>
    );
};

// Add animation to global CSS or Tailwind config
// @keyframes slide-in-right {
//   from {
//     transform: translateX(100%);
//     opacity: 0;
//   }
//   to {
//     transform: translateX(0);
//     opacity: 1;
//   }
// }
