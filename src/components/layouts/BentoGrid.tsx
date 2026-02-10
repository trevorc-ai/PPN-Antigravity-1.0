import React, { ReactNode } from 'react';

interface BentoGridProps {
    children: ReactNode;
    className?: string;
}

interface BentoCardProps {
    children: ReactNode;
    span?: 1 | 2 | 3 | 4 | 6 | 12; // Grid column spans
    className?: string;
    glass?: boolean; // Enable glassmorphism
}

/**
 * BentoGrid Component
 * 12-column grid system for Dashboard layout
 * No floating elements - everything locks into grid
 */
export const BentoGrid: React.FC<BentoGridProps> = ({ children, className = '' }) => {
    return (
        <div className={`bento-grid ${className}`}>
            {children}

            <style jsx>{`
        .bento-grid {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          gap: 1.5rem;
          width: 100%;
        }
        
        /* Responsive breakpoints */
        @media (max-width: 1024px) {
          .bento-grid {
            grid-template-columns: repeat(6, 1fr);
          }
        }
        
        @media (max-width: 640px) {
          .bento-grid {
            grid-template-columns: repeat(1, 1fr);
            gap: 1rem;
          }
        }
      `}</style>
        </div>
    );
};

/**
 * BentoCard Component
 * Individual card that locks into the Bento Grid
 * Supports glassmorphism effect
 */
export const BentoCard: React.FC<BentoCardProps> = ({
    children,
    span = 4,
    className = '',
    glass = false,
}) => {
    const glassStyles = glass
        ? 'backdrop-blur-[12px] bg-white/5 border-2 border-white/10'
        : 'bg-slate-900/50 border-2 border-slate-800';

    return (
        <div className={`bento-card ${glassStyles} ${className}`} data-span={span}>
            {children}

            <style jsx>{`
        .bento-card {
          grid-column: span ${span};
          border-radius: 1rem;
          padding: 1.5rem;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        
        /* High-contrast border for accessibility */
        .bento-card:hover {
          border-color: rgba(99, 102, 241, 0.3);
          transform: translateY(-2px);
        }
        
        /* Glassmorphism enhancement */
        .bento-card[data-glass="true"] {
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
        
        /* Responsive spans */
        @media (max-width: 1024px) {
          .bento-card[data-span="12"] {
            grid-column: span 6;
          }
          .bento-card[data-span="6"] {
            grid-column: span 6;
          }
          .bento-card[data-span="4"] {
            grid-column: span 3;
          }
          .bento-card[data-span="3"] {
            grid-column: span 3;
          }
        }
        
        @media (max-width: 640px) {
          .bento-card {
            grid-column: span 1 !important;
          }
        }
        
        /* Respect prefers-reduced-motion */
        @media (prefers-reduced-motion: reduce) {
          .bento-card {
            transition: none;
          }
          .bento-card:hover {
            transform: none;
          }
        }
      `}</style>
        </div>
    );
};
