import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface MobileAccordionProps {
    title: string;
    subtitle?: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
}

export const MobileAccordion: React.FC<MobileAccordionProps> = ({
    title,
    subtitle,
    children,
    defaultOpen = false,
}) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="md:contents">
            {/* Mobile Wrapper */}
            <div className="md:hidden block bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-3xl overflow-hidden mb-4 print:hidden shadow-lg shadow-black/20">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full flex items-center justify-between p-6 text-left focus:outline-none focus:bg-slate-800/20 active:bg-slate-800/40 transition-colors"
                    aria-expanded={isOpen}
                >
                    <div>
                        <h3 className="text-lg font-black" style={{ color: '#A8B5D1' }}>{title}</h3>
                        {subtitle && (
                            <p className="text-sm mt-0.5" style={{ color: '#8B9DC3' }}>{subtitle}</p>
                        )}
                    </div>
                    <ChevronDown
                        className={`w-5 h-5 text-slate-400 transition-transform duration-300 ease-in-out ${isOpen ? 'rotate-180' : ''}`}
                    />
                </button>

                <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'
                        }`}
                >
                    <div className="p-0 pt-0">
                        {children}
                    </div>
                </div>
            </div>

            {/* Desktop Wrapper (Always visible, standard margins) */}
            <div className="hidden md:block print:block">
                {children}
            </div>
        </div>
    );
};
