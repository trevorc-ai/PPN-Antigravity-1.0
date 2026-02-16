import React, { useState, useRef, useEffect } from 'react';
import { Info, AlertTriangle, ShieldAlert, Activity, Microscope, CheckCircle, HelpCircle, X, ExternalLink, BookOpen } from 'lucide-react';

// --- TYPES ---

export type TooltipTier = 'micro' | 'standard' | 'guide';
export type TooltipType = 'info' | 'warning' | 'critical' | 'clinical' | 'science' | 'success';
export type TooltipSide = 'top' | 'right' | 'bottom' | 'left';

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
    glossaryTerm
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false); // For Tier 3 click
    const timeoutRef = useRef<NodeJS.Timeout>();

    const config = TYPE_CONFIG[type];
    const Icon = config.icon;

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    const handleMouseEnter = () => {
        if (tier === 'guide') return; // Guide is click-only usually, or immediate
        timeoutRef.current = setTimeout(() => setIsVisible(true), tier === 'micro' ? 200 : delay);
    };

    const handleMouseLeave = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setIsVisible(false);
    };

    const handleFocus = () => {
        setIsFocused(true);
        if (tier !== 'guide') setIsVisible(true);
    };

    const handleBlur = () => {
        setIsFocused(false);
        setIsVisible(false);
    };

    const handleClick = (e: React.MouseEvent) => {
        if (tier === 'guide') {
            e.stopPropagation();
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

    // --- RENDERING TIERS ---

    // TIER 1: MICRO (Simple label)
    if (tier === 'micro') {
        return (
            <div
                className="relative inline-flex items-center"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onFocus={handleFocus}
                onBlur={handleBlur}
            >
                {children}
                {isVisible && (
                    <div className={`
            absolute z-[100] px-3 py-1.5 rounded-lg
            ${side === 'top' ? 'bottom-full left-1/2 -translate-x-1/2 mb-2' : ''}
            ${side === 'bottom' ? 'top-full left-1/2 -translate-x-1/2 mt-2' : ''}
            ${side === 'right' ? 'left-full top-1/2 -translate-y-1/2 ml-2' : ''}
            ${side === 'left' ? 'right-full top-1/2 -translate-y-1/2 mr-2' : ''}
            bg-slate-900 border border-slate-700 text-slate-200 
            text-[10px] font-bold uppercase tracking-wider
            whitespace-nowrap shadow-xl animate-in fade-in zoom-in-95 duration-200
            ${config.glow}
          `}>
                        {content}
                        {/* Micro-arrow */}
                        <div className={`
               absolute w-2 h-2 bg-slate-900 border-slate-700 rotate-45
               ${side === 'top' ? 'bottom-[-5px] left-1/2 -translate-x-1/2 border-b border-r' : ''}
               ${side === 'bottom' ? 'top-[-5px] left-1/2 -translate-x-1/2 border-t border-l' : ''}
               ${side === 'right' ? 'left-[-5px] top-1/2 -translate-y-1/2 border-b border-l' : ''}
               ${side === 'left' ? 'right-[-5px] top-1/2 -translate-y-1/2 border-t border-r' : ''}
             `}></div>
                    </div>
                )}
            </div>
        );
    }

    // TIER 3: GUIDE (Click to open, rich content)
    if (tier === 'guide') {
        return (
            <div className="relative inline-flex items-center">
                <div
                    onClick={handleClick}
                    className="cursor-help transition-all hover:scale-110 active:scale-95"
                    role="button"
                    tabIndex={0}
                    aria-expanded={isDetailsOpen}
                    aria-label={`Learn more about ${title}`}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClick(e as any); }}
                >
                    {children}
                </div>

                {isDetailsOpen && (
                    <div
                        className={`
              absolute z-50 p-0
              ${side === 'top' ? 'bottom-full left-1/2 -translate-x-1/2 mb-3' : ''}
              ${side === 'bottom' ? 'top-full left-1/2 -translate-x-1/2 mt-3' : ''}
              ${side === 'right' ? 'left-full top-1/2 -translate-y-1/2 ml-3' : ''}
              ${side === 'left' ? 'right-full top-1/2 -translate-y-1/2 mr-3' : ''}
              ${width || 'w-80 sm:w-96'}
            `}
                        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
                    >
                        {/* Backdrop click to close handled by parent or transparent overlay if needed, 
                 but typically click-outside logic is better for modals. 
                 For this tooltip, we'll just use the close button. */}

                        <div className={`
              relative overflow-hidden rounded-2xl 
              bg-[#0f172a]/95 backdrop-blur-xl
              border ${config.border}
              shadow-2xl ${config.glow}
              animate-in fade-in zoom-in-95 duration-300
              flex flex-col
            `}>
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
                                    className="text-slate-3000 hover:text-slate-200 transition-colors"
                                >
                                    <X size={16} />
                                </button>
                            </div>

                            {/* Body */}
                            <div className="p-5 text-sm text-slate-300 font-medium leading-relaxed">
                                {content}
                            </div>

                            {/* Footer / Meta */}
                            {(glossaryTerm || type === 'critical') && (
                                <div className="px-5 py-3 border-t border-slate-800/50 bg-black/20 flex justify-between items-center text-[11px]">
                                    {glossaryTerm && (
                                        <button className="flex items-center gap-1.5 text-slate-400 hover:text-primary transition-colors font-bold uppercase tracking-wider">
                                            <BookOpen size={12} />
                                            {glossaryTerm}
                                        </button>
                                    )}
                                    {type === 'critical' && (
                                        <span className="flex items-center gap-1.5 text-red-400 font-bold uppercase tracking-wider">
                                            <ShieldAlert size={12} />
                                            Safety Protocol
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Arrow */}
                        <div className={`
               absolute w-3 h-3 bg-[#0f172a] border-t border-l ${config.border} rotate-45
               ${side === 'top' ? 'bottom-[-6px] left-1/2 -translate-x-1/2 border-b border-r border-t-0 border-l-0' : ''}
               ${side === 'bottom' ? 'top-[-6px] left-1/2 -translate-x-1/2' : ''}
               ${side === 'right' ? 'left-[-6px] top-1/2 -translate-y-1/2 border-b border-l border-t-0 border-r-0' : ''}
               ${side === 'left' ? 'right-[-6px] top-1/2 -translate-y-1/2 border-t border-r border-b-0 border-l-0' : ''}
             `}></div>
                    </div>
                )}
            </div>
        );
    }

    // TIER 2: STANDARD (Hover/Focus, rich enough)
    return (
        <div
            className="relative inline-flex items-center group"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onFocus={handleFocus}
            onBlur={handleBlur}
        >
            {children}
            {/* Keyboard Hint */}
            {isFocused && !isVisible && (
                <div className="absolute top-0 right-0 -mt-2 -mr-2 bg-blue-500 text-slate-300 text-[10px] px-1 rounded">?</div>
            )}

            {isVisible && (
                <div className={`
          absolute z-[100] 
          ${side === 'top' ? 'bottom-full left-1/2 -translate-x-1/2 mb-2' : ''}
          ${side === 'bottom' ? 'top-full left-1/2 -translate-x-1/2 mt-2' : ''}
          ${side === 'right' ? 'left-full top-1/2 -translate-y-1/2 ml-2' : ''}
          ${side === 'left' ? 'right-full top-1/2 -translate-y-1/2 mr-2' : ''}
          ${width || 'w-64'}
        `}>
                    <div className={`
            relative rounded-xl p-3.5
            bg-[#0f172a]/95 backdrop-blur-md
            border border-slate-700
            shadow-2xl ${config.glow}
            animate-in fade-in slide-in-from-bottom-2 duration-200
          `}>
                        {/* Title Row */}
                        {title && (
                            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-700/50">
                                <Icon size={12} className={config.color} />
                                <span className={`text-[10px] font-black uppercase tracking-widest ${config.color}`}>{title}</span>
                            </div>
                        )}

                        <div className="text-xs text-slate-300 font-medium leading-relaxed">
                            {content}
                        </div>

                        {/* Micro-arrow */}
                        <div className={`
               absolute w-2 h-2 bg-[#0f172a] border-slate-700 rotate-45
               ${side === 'top' ? 'bottom-[-5px] left-1/2 -translate-x-1/2 border-b border-r' : ''}
               ${side === 'bottom' ? 'top-[-5px] left-1/2 -translate-x-1/2 border-t border-l' : ''}
               ${side === 'right' ? 'left-[-5px] top-1/2 -translate-y-1/2 border-b border-l' : ''}
               ${side === 'left' ? 'right-[-5px] top-1/2 -translate-y-1/2 border-t border-r' : ''}
             `}></div>
                    </div>
                </div>
            )}
        </div>
    );
};
