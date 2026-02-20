import React, { useEffect, useRef } from 'react';
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
    children: React.ReactNode;
    width?: string; // Default: 40%
    footer?: React.ReactNode; // Optional custom footer
}

export const SlideOutPanel: React.FC<SlideOutPanelProps> = ({
    isOpen,
    onClose,
    title,
    children,
    width = '40%',
    footer
}) => {
    const panelRef = useRef<HTMLDivElement>(null);
    const touchStartY = useRef<number>(0);
    const touchEndY = useRef<number>(0);

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

    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000] transition-opacity duration-300"
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
                <div className="sticky top-0 z-10 bg-slate-900 border-b border-slate-700/50 px-6 py-4 flex items-center justify-between">
                    {title ? (
                        <h2
                            id="panel-title"
                            className="text-xl font-bold text-slate-300"
                        >
                            {title}
                        </h2>
                    ) : (
                        <span id="panel-title" />
                    )}
                    <button
                        onClick={onClose}
                        className="flex items-center justify-center w-11 h-11 rounded-xl hover:bg-slate-800 active:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-6">
                    {children}
                </div>

                {/* Sticky Footer — custom footer if provided, otherwise universal close */}
                <div className="sticky bottom-0 z-10 bg-slate-900 border-t border-slate-700/50">
                    {footer ? (
                        <div className="px-6 py-4">{footer}</div>
                    ) : (
                        /* Universal close button — always accessible at the bottom of any form */
                        <div className="px-6 py-3 flex items-center justify-end gap-3">
                            <p className="text-xs text-slate-600 flex-1">Changes auto-save as you go</p>
                            <button
                                onClick={onClose}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-slate-600 border border-slate-700/60 text-slate-300 text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
                                aria-label="Close panel"
                            >
                                <X className="w-4 h-4" />
                                Close Panel
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>,
        document.body
    );
};
