import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { X } from 'lucide-react';

/**
 * SlideOutPanel - Context-Aware Form Display Component
 * 
 * Features:
 * - 40% width on desktop, full-screen on mobile
 * - Slides in from right with backdrop blur
 * - Sticky header and footer
 * - Swipe-down to dismiss on mobile
 * - WCAG 2.1 AAA compliant
 */

interface SlideOutPanelProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    /** Optional one-line description shown below the title */
    subtitle?: string;
    /** Optional icon element shown left of the title */
    icon?: React.ReactNode;
    children: React.ReactNode;
    width?: string; // Default: 40%
    footer?: React.ReactNode; // Optional custom footer
}

export const SlideOutPanel: React.FC<SlideOutPanelProps> = ({
    isOpen,
    onClose,
    title,
    subtitle,
    icon,
    children,
    width = '40%',
    footer
}) => {
    const panelRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const touchStartY = useRef<number>(0);
    const touchEndY = useRef<number>(0);

    const [shouldRender, setShouldRender] = useState(isOpen);

    useEffect(() => {
        if (isOpen) {
            setShouldRender(true);
        } else {
            const timer = setTimeout(() => setShouldRender(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    // Scroll content to top whenever the panel opens or switches to a different form
    useEffect(() => {
        if (isOpen && contentRef.current) {
            contentRef.current.scrollTop = 0;
        }
    }, [isOpen, title]);

    // Handle Escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    // Lock body scroll when panel is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    // Swipe down to dismiss (mobile)
    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        touchEndY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = () => {
        const swipeDistance = touchEndY.current - touchStartY.current;
        // If swiped down more than 100px, close panel
        if (swipeDistance > 100) {
            onClose();
        }
    };

    if (!shouldRender) return null;

    return ReactDOM.createPortal(
        <>
            <div
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Panel */}
            <div
                ref={panelRef}
                className="fixed top-0 right-0 h-full bg-slate-900 shadow-2xl z-[1001] flex flex-col transition-transform duration-300 ease-out"
                style={{
                    width: window.innerWidth < 1024 ? '100%' : width,
                    transform: isOpen ? 'translateX(0)' : 'translateX(100%)'
                }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                role="dialog"
                aria-modal="true"
                aria-labelledby="panel-title"
            >
                {/* Sticky Header */}
                <div className="sticky top-0 z-10 bg-slate-900 border-b border-slate-700/50 px-6 py-4 flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                        {icon && (
                            <div className="flex-shrink-0 mt-0.5">
                                {icon}
                            </div>
                        )}
                        <div className="min-w-0">
                            {title ? (
                                <h2
                                    id="panel-title"
                                    className="text-2xl font-bold text-indigo-400 truncate tracking-tight"
                                >
                                    {title}
                                </h2>
                            ) : (
                                <span id="panel-title" />
                            )}
                            {subtitle && (
                                <p className="text-sm text-slate-400 mt-0.5 leading-snug">{subtitle}</p>
                            )}
                            <a
                                href="mailto:support@phantom.dev?subject=Feature%20Request/Addition"
                                className="inline-block mt-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-400 transition-colors underline decoration-slate-700/80 hover:decoration-indigo-400/50 underline-offset-4"
                            >
                                Request a feature or addition
                            </a>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="flex-shrink-0 flex items-center justify-center w-11 h-11 rounded-xl hover:bg-slate-800 active:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label="Close panel"
                        title="Close"
                    >
                        <X className="w-5 h-5 text-slate-400" />
                    </button>
                </div>

                {/* Swipe indicator (mobile only) */}
                <div className="md:hidden flex justify-center py-2 bg-slate-900">
                    <div className="w-12 h-1 bg-slate-700 rounded-full" aria-hidden="true" />
                </div>

                {/* Content */}
                <div ref={contentRef} className="flex-1 overflow-y-auto custom-scrollbar px-6 py-6">
                    {children}
                </div>

                {/* Sticky Footer — custom footer if provided; forms own their own footers otherwise */}
                {footer && (
                    <div className="sticky bottom-0 z-10 bg-slate-900 border-t border-slate-700/50">
                        <div className="px-6 py-4">{footer}</div>
                    </div>
                )}
            </div>
        </>,
        document.body
    );
};
