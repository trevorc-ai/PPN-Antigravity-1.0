import React from 'react';

interface PPNLogoProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    animated?: boolean;
    className?: string;
}

const sizeMap = {
    sm: { container: 120, text: 'text-xl', subtext: 'text-[8px]' },
    md: { container: 180, text: 'text-3xl', subtext: 'text-[10px]' },
    lg: { container: 240, text: 'text-4xl', subtext: 'text-xs' },
    xl: { container: 320, text: 'text-5xl', subtext: 'text-sm' }
};

export const PPNLogo: React.FC<PPNLogoProps> = ({
    size = 'md',
    animated = false,
    className = ''
}) => {
    const { container, text, subtext } = sizeMap[size];

    return (
        <div className={`flex flex-col items-center gap-4 ${className}`} style={{ width: container }}>
            {/* PPN Text */}
            <h1 className={`${text} font-black tracking-[0.15em] text-slate-900 dark:text-slate-300`}>
                PPN
            </h1>

            {/* Molecular Network Icon */}
            <svg
                width={container}
                height={container * 0.6}
                viewBox="0 0 200 120"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={animated ? 'animate-pulse-slow' : ''}
            >
                {/* Gradient Definitions */}
                <defs>
                    <linearGradient id="moleculeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="50%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>

                    <filter id="glow">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>

                    <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
                        <stop offset="70%" stopColor="#8b5cf6" stopOpacity="0.6" />
                        <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                    </radialGradient>
                </defs>

                {/* Background Network Lines (subtle) */}
                <g opacity="0.15" stroke="url(#moleculeGradient)" strokeWidth="1">
                    <line x1="100" y1="30" x2="40" y2="0" />
                    <line x1="100" y1="30" x2="160" y2="0" />
                    <line x1="130" y1="60" x2="180" y2="50" />
                    <line x1="130" y1="90" x2="180" y2="100" />
                    <line x1="100" y1="120" x2="160" y2="140" />
                    <line x1="100" y1="120" x2="40" y2="140" />
                    <line x1="70" y1="90" x2="20" y2="100" />
                    <line x1="70" y1="60" x2="20" y2="50" />
                </g>

                {/* Hexagonal Molecule Structure */}
                <g filter="url(#glow)">
                    {/* Hexagon Outline */}
                    <path
                        d="M 100 30 L 130 60 L 130 90 L 100 120 L 70 90 L 70 60 Z"
                        stroke="url(#moleculeGradient)"
                        strokeWidth="3"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />

                    {/* Internal Connections */}
                    <line x1="100" y1="30" x2="100" y2="120" stroke="url(#moleculeGradient)" strokeWidth="2" opacity="0.4" />
                    <line x1="70" y1="60" x2="130" y2="90" stroke="url(#moleculeGradient)" strokeWidth="2" opacity="0.4" />
                    <line x1="70" y1="90" x2="130" y2="60" stroke="url(#moleculeGradient)" strokeWidth="2" opacity="0.4" />
                </g>

                {/* Network Nodes (glowing circles at vertices) */}
                <g>
                    {/* Top */}
                    <circle cx="100" cy="30" r="6" fill="url(#nodeGlow)" />
                    <circle cx="100" cy="30" r="3" fill="white" />

                    {/* Top Right */}
                    <circle cx="130" cy="60" r="6" fill="url(#nodeGlow)" />
                    <circle cx="130" cy="60" r="3" fill="white" />

                    {/* Bottom Right */}
                    <circle cx="130" cy="90" r="6" fill="url(#nodeGlow)" />
                    <circle cx="130" cy="90" r="3" fill="white" />

                    {/* Bottom */}
                    <circle cx="100" cy="120" r="6" fill="url(#nodeGlow)" />
                    <circle cx="100" cy="120" r="3" fill="white" />

                    {/* Bottom Left */}
                    <circle cx="70" cy="90" r="6" fill="url(#nodeGlow)" />
                    <circle cx="70" cy="90" r="3" fill="white" />

                    {/* Top Left */}
                    <circle cx="70" cy="60" r="6" fill="url(#nodeGlow)" />
                    <circle cx="70" cy="60" r="3" fill="white" />
                </g>
            </svg>

            {/* Subtitle */}
            <p className={`${subtext} font-medium tracking-[0.2em] text-slate-600 dark:text-slate-300 uppercase text-center`}>
                Psychedelic Practitioners Network
            </p>

            {/* Optional Animation Styles */}
            <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
        </div>
    );
};

export default PPNLogo;
