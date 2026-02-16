import React from 'react';
import { Rss } from 'lucide-react';

interface ConnectFeedButtonProps {
    className?: string;
    onClick?: () => void;
}

const ConnectFeedButton: React.FC<ConnectFeedButtonProps> = ({ className = '', onClick }) => {
    return (
        <button
            onClick={onClick}
            className={`
                group relative overflow-hidden
                flex items-center gap-3 px-5 py-3 
                bg-indigo-500 hover:bg-indigo-400 
                border border-indigo-400/50 hover:border-indigo-300
                rounded-xl shadow-lg shadow-indigo-900/20
                transition-all duration-300 ease-out
                hover:scale-[1.02] hover:-translate-y-0.5
                ${className}
            `}
        >
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />

            {/* Icon Box */}
            <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm group-hover:bg-white/30 transition-colors">
                <Rss className="w-4 h-4 text-slate-300" />
            </div>

            {/* Text */}
            <span className="font-bold text-sm text-slate-300 tracking-wide uppercase">
                Connect Your Blog/Feed
            </span>
        </button>
    );
};

export default ConnectFeedButton;
