import React, { useState, useRef, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { Info, AlertTriangle, ShieldAlert, Activity, Microscope, CheckCircle, X, ExternalLink, BookOpen } from 'lucide-react';

// --- TYPES ---

export type TooltipTier = 'micro' | 'standard' | 'guide';
export type TooltipType = 'info' | 'warning' | 'critical' | 'clinical' | 'science' | 'success';
export type TooltipSide = 'top' | 'right' | 'bottom' | 'left' | 'bottom-left';

interface AdvancedTooltipProps {
    content: React.ReactNode;
    children: React.ReactNode;
    tier?: TooltipTier;
    type?: TooltipType;
    side?: TooltipSide;
    title?: string; // Required for Tier 3
    width?: string; // e.g. "w-64" or "w-[400px]"
    delay?: number; // ms, default 300 for standard
    glossaryTerm?: string; // Optional link to glossary
    learnMoreUrl?: string; // e.g. "/help/interaction-checker" or "/help/faq#benchmark-hidden"
}

// --- CONFIGURATION ---

const TYPE_CONFIG = {
    info: {
        icon: Info,
        color: 'text-blue-400',
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/20',
        glow: 'shadow-[0_0_15px_rgba(59,130,246,0.15)]'
    },
    warning: {
        icon: AlertTriangle,
        color: 'text-amber-400',
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/20',
        glow: 'shadow-[0_0_15px_rgba(245,158,11,0.15)]'
    },
    critical: {
        icon: ShieldAlert,
        color: 'text-red-400',
        bg: 'bg-red-500/10',
        border: 'border-red-500/20',
        glow: 'shadow-[0_0_15px_rgba(239,68,68,0.2)]'
    },
    clinical: {
        icon: Activity,
        color: 'text-emerald-400',
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/20',
        glow: 'shadow-[0_0_15px_rgba(16,185,129,0.15)]'
    },
    science: {
        icon: Microscope,
        color: 'text-purple-400',
        bg: 'bg-purple-500/10',
        border: 'border-purple-500/20',
        glow: 'shadow-[0_0_15px_rgba(168,85,247,0.15)]'
    },
    success: {
        icon: CheckCircle,
        color: 'text-green-400',
        bg: 'bg-green-500/10',
        border: 'border-green-500/20',
        glow: 'shadow-[0_0_15px_rgba(34,197,94,0.15)]'
    }
};

// --- PORTAL TOOLTIP POPUP ---
// Renders into document.body via a portal so it escapes any overflow:hidden /
// overflow-y:auto scroll container (e.g. SlideOutPanel) and any stacking context.
// Uses position:fixed with coordinates derived from getBoundingClientRect().

interface TooltipPortalProps {
    triggerRect: DOMRect;
    side: TooltipSide;
    width?: string;
    children: React.ReactNode;
    zIndex?: number;
}

const TOOLTIP_GAP = 8; // px gap between trigger and popup

const TooltipPortal: React.FC<TooltipPortalProps> = ({ triggerRect, side, width, children, zIndex = 9999 }) => {
    const popupRef = useRef<HTMLDivElement>(null);
    const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);

    useEffect(() => {
        if (!popupRef.current) return;
        const popup = popupRef.current;
        const popupRect = popup.getBoundingClientRect();
        const vw = window.innerWidth;
        const vh = window.innerHeight;

        let top = 0;
        let left = 0;

        switch (side) {
            case 'top':
                top = triggerRect.top - popupRect.height - TOOLTIP_GAP;
                left = triggerRect.left + triggerRect.width / 2 - popupRect.width / 2;
                break;
            case 'bottom':
            case 'bottom-left':
                top = triggerRect.bottom + TOOLTIP_GAP;
                left = side === 'bottom-left'
                    ? triggerRect.right - popupRect.width
                    : triggerRect.left + triggerRect.width / 2 - popupRect.width / 2;
                break;
            case 'right':
                top = triggerRect.top + triggerRect.height / 2 - popupRect.height / 2;
                left = triggerRect.right + TOOLTIP_GAP;
                break;
            case 'left':
                top = triggerRect.top + triggerRect.height / 2 - popupRect.height / 2;
                left = triggerRect.left - popupRect.width - TOOLTIP_GAP;
                break;
        }

        // Clamp to viewport with 8px edge padding
        left = Math.max(8, Math.min(left, vw - popupRect.width - 8));
        top  = Math.max(8, Math.min(top,  vh - popupRect.height - 8));

        setCoords({ top, left });
    }, [triggerRect, side]);

    return ReactDOM.createPortal(
        <div
            ref={popupRef}
            className={`fixed ${width ?? 'w-80'} max-w-[calc(100vw-1rem)] pointer-events-none`}
            style={{
                zIndex,
                top: coords ? coords.top : -9999,
                left: coords ? coords.left : -9999,
                visibility: coords ? 'visible' : 'hidden',
            }}
        >
            {children}
        </div>,
        document.body
    );
};

// --- COMPONENT ---

export const AdvancedTooltip: React.FC<AdvancedTooltipProps> = ({
    content,
    children,
    tier = 'standard',
    type = 'info',
    side = 'top',
    title,
    width,
    delay = 500,
    glossaryTerm,
    learnMoreUrl
}) => {
    const navigate = useNavigate();
    const isInternal = (url: string) => url.startsWith('/');

    const handleLearnMore = (e: React.MouseEvent, url: string) => {
        e.stopPropagation();
        if (isInternal(url)) {
            navigate(url);
        } else {
            window.open(url, '_blank', 'noreferrer');
        }
    };

    const [isVisible, setIsVisible] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false); // For Tier 3 click
    const [triggerRect, setTriggerRect] = useState<DOMRect | null>(null);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const config = TYPE_CONFIG[type];
    const Icon = config.icon;

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    const isTouchDevice = () => navigator.maxTouchPoints > 0;

    const captureRect = useCallback(() => {
        if (wrapperRef.current) {
            setTriggerRect(wrapperRef.current.getBoundingClientRect());
        }
    }, []);

    const handleMouseEnter = () => {
        if (isTouchDevice()) return;
        if (tier === 'guide') return;
        captureRect();
        timeoutRef.current = setTimeout(() => setIsVisible(true), tier === 'micro' ? 200 : delay);
    };

    const handleMouseLeave = () => {
        if (isTouchDevice()) return;
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setIsVisible(false);
    };

    const handleFocus = () => {
        setIsFocused(true);
        if (tier !== 'guide') {
            captureRect();
            setIsVisible(true);
        }
    };

    const handleBlur = () => {
        setIsFocused(false);
        setIsVisible(false);
    };

    const handleClick = (e: React.MouseEvent) => {
        if (tier === 'guide') {
            e.stopPropagation();
            captureRect();
            setIsDetailsOpen(!isDetailsOpen);
        }
    };

    // Keyboard 'Escape' to close
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setIsVisible(false);
                setIsDetailsOpen(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // --- SHARED POPUP CONTENT ---

    const microContent = (
        <div className={`
            rounded-lg px-3 py-1.5
            bg-slate-900 border border-slate-700 text-slate-300
            text-sm font-bold uppercase tracking-wider
            whitespace-nowrap shadow-xl animate-in fade-in zoom-in-95 duration-200
            ${config.glow}
        `}>
            {content}
            {learnMoreUrl && (
                <button
                    onClick={(e) => handleLearnMore(e, learnMoreUrl)}
                    aria-label={`Learn more about ${title || 'this topic'}`}
                    className="ml-1.5 inline-flex items-center text-slate-400 hover:text-blue-400 transition-colors"
                    style={{ pointerEvents: 'auto' }}
                >
                    {isInternal(learnMoreUrl) ? <BookOpen size={11} /> : <ExternalLink size={11} />}
                </button>
            )}
        </div>
    );

    const standardContent = (
        <div className={`
            relative rounded-xl p-3.5
            bg-[#0f172a]/95 backdrop-blur-md
            border border-slate-700
            shadow-2xl ${config.glow}
            animate-in fade-in slide-in-from-bottom-2 duration-200
        `}>
            {title && (
                <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-700/50">
                    <Icon size={12} className={config.color} />
                    <span className={`text-sm font-black uppercase tracking-widest ${config.color}`}>{title}</span>
                </div>
            )}
            <div className="text-sm text-slate-300 font-medium leading-relaxed max-h-48 overflow-y-auto" style={{ pointerEvents: 'auto' }}>
                {content}
            </div>
            {learnMoreUrl && (
                <button
                    onClick={(e) => handleLearnMore(e, learnMoreUrl)}
                    aria-label={`Learn more about ${title || 'this topic'}`}
                    className="mt-2 flex items-center gap-1.5 text-xs text-slate-400 hover:text-blue-400 transition-colors font-bold uppercase tracking-wider"
                    style={{ pointerEvents: 'auto' }}
                >
                    {isInternal(learnMoreUrl) ? <BookOpen size={11} /> : <ExternalLink size={11} />}
                    Learn more
                </button>
            )}
        </div>
    );

    const guideContent = (
        <div className={`
            relative overflow-hidden rounded-2xl
            bg-[#0f172a]/95 backdrop-blur-xl
            border ${config.border}
            shadow-2xl ${config.glow}
            animate-in fade-in zoom-in-95 duration-300
            flex flex-col
        `} style={{ pointerEvents: 'auto' }}>
            {/* Header */}
            <div className={`px-5 py-4 border-b ${config.border} ${config.bg} flex justify-between items-start`}>
                <div className="flex items-center gap-3">
                    <div className={`p-1.5 rounded-lg bg-black/20 ${config.color}`}>
                        <Icon size={16} />
                    </div>
                    <h4 className={`text-sm font-black uppercase tracking-widest ${config.color}`}>
                        {title || 'Help Guide'}
                    </h4>
                </div>
                <button
                    onClick={() => setIsDetailsOpen(false)}
                    className="text-slate-500 hover:text-slate-300 transition-colors"
                >
                    <X size={16} />
                </button>
            </div>
            {/* Body */}
            <div className="p-5 text-sm text-slate-300 font-medium leading-relaxed">
                {content}
            </div>
            {/* Footer */}
            {(glossaryTerm || learnMoreUrl || type === 'critical') && (
                <div className="px-5 py-3 border-t border-slate-800/50 bg-black/20 flex justify-between items-center text-xs">
                    <div className="flex items-center gap-3">
                        {glossaryTerm && (
                            <button className="flex items-center gap-1.5 text-slate-300 hover:text-primary transition-colors font-bold uppercase tracking-wider">
                                <BookOpen size={12} />
                                {glossaryTerm}
                            </button>
                        )}
                        {learnMoreUrl && (
                            <button
                                onClick={(e) => handleLearnMore(e, learnMoreUrl)}
                                aria-label={`Learn more about ${title || 'this topic'}`}
                                className="flex items-center gap-1.5 text-slate-400 hover:text-blue-400 transition-colors font-bold uppercase tracking-wider"
                            >
                                {isInternal(learnMoreUrl) ? <BookOpen size={12} /> : <ExternalLink size={12} />}
                                Learn more
                            </button>
                        )}
                    </div>
                    {type === 'critical' && (
                        <span className="flex items-center gap-1.5 text-red-400 font-bold uppercase tracking-wider">
                            <ShieldAlert size={12} />
                            Safety Protocol
                        </span>
                    )}
                </div>
            )}
        </div>
    );

    // --- RENDER ---

    return (
        <div
            ref={wrapperRef}
            className="relative inline-flex items-center"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onClick={tier === 'guide' ? handleClick : undefined}
        >
            {children}

            {/* Keyboard hint for focused but not yet visible */}
            {isFocused && !isVisible && tier !== 'guide' && (
                <div className="absolute top-0 right-0 -mt-2 -mr-2 bg-blue-500 text-slate-300 text-xs px-1 rounded">?</div>
            )}

            {/* TIER 1: MICRO — portal popup */}
            {tier === 'micro' && isVisible && triggerRect && (
                <TooltipPortal triggerRect={triggerRect} side={side} width="max-w-xs">
                    {microContent}
                </TooltipPortal>
            )}

            {/* TIER 2: STANDARD — portal popup */}
            {tier === 'standard' && isVisible && triggerRect && (
                <TooltipPortal triggerRect={triggerRect} side={side} width={width ?? 'w-80'}>
                    {standardContent}
                </TooltipPortal>
            )}

            {/* TIER 3: GUIDE — portal popup (click-to-open) */}
            {tier === 'guide' && isDetailsOpen && triggerRect && (
                <TooltipPortal triggerRect={triggerRect} side={side} width={width ?? 'w-80 sm:w-96'} zIndex={10000}>
                    {guideContent}
                </TooltipPortal>
            )}
        </div>
    );
};
