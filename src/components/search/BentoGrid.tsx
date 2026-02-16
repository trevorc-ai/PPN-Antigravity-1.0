import React from 'react';
import { motion } from 'framer-motion';

interface BentoGridProps {
    children: React.ReactNode;
    className?: string;
}

/**
 * Bento Grid layout component with staggered entry animations
 * Uses CSS Grid for responsive vertical stacking
 * Respects prefers-reduced-motion for accessibility
 */
const BentoGrid: React.FC<BentoGridProps> = ({ children, className = '' }) => {
    // Check for reduced motion preference
    const prefersReducedMotion =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Animation variants for container
    const containerVariants = {
        hidden: { opacity: prefersReducedMotion ? 1 : 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: prefersReducedMotion ? 0 : 0.1,
                delayChildren: prefersReducedMotion ? 0 : 0.05,
            },
        },
    };

    // Animation variants for individual items
    const itemVariants = {
        hidden: {
            opacity: prefersReducedMotion ? 1 : 0,
            y: prefersReducedMotion ? 0 : 20,
        },
        show: {
            opacity: 1,
            y: 0,
            transition: {
                duration: prefersReducedMotion ? 0 : 0.3,
                ease: 'easeOut',
            },
        },
    };

    return (
        <motion.div
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}
            variants={containerVariants}
            initial="hidden"
            animate="show"
        >
            {React.Children.map(children, (child, index) => (
                <motion.div
                    key={index}
                    variants={itemVariants}
                    layout={!prefersReducedMotion}
                >
                    {child}
                </motion.div>
            ))}
        </motion.div>
    );
};

export default BentoGrid;
export { BentoGrid };
