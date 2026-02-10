import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface GravityButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
}

export const GravityButton: React.FC<GravityButtonProps> = ({ children, onClick }) => {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    // MAGNETIC CURSOR - The 'Button' Effect
    // Logic: Track mouse position and translate button towards cursor within 50px radius
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Apply smooth spring animation for magnetic effect (0.1s dampening)
    const springConfig = { damping: 20, stiffness: 300 };
    const xSpring = useSpring(x, springConfig);
    const ySpring = useSpring(y, springConfig);

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!buttonRef.current) return;

        const rect = buttonRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const distanceX = e.clientX - centerX;
        const distanceY = e.clientY - centerY;
        const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);

        // Apply magnetic pull within 50px radius at 20% intensity
        if (distance < 50) {
            x.set(distanceX * 0.2);
            y.set(distanceY * 0.2);
        }
    };

    const handleMouseLeave = () => {
        // Snap back to original position
        x.set(0);
        y.set(0);
        setIsHovered(false);
    };

    return (
        <motion.button
            ref={buttonRef}
            // KINETIC ENTRY - The 'Load' Effect
            // Elements fly in, scale up on appearance
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
                duration: 0.6,
                ease: [0.25, 0.46, 0.45, 0.94],
            }}
            // MAGNETIC CURSOR - Apply translation
            style={{
                x: xSpring,
                y: ySpring,
            }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
            onClick={onClick}
            className="gravity-button"
        >
            {/* GLASSMORPHISM - The 'Material' Effect */}
            {/* High-contrast distinct layer with blur and semi-transparent background */}
            <div className="gravity-button-glass">
                <span className="gravity-button-text">{children}</span>
            </div>

            <style jsx>{`
        .gravity-button {
          position: relative;
          padding: 0;
          border: none;
          background: transparent;
          cursor: pointer;
          outline: none;
          will-change: transform;
        }

        /* GLASSMORPHISM - CSS implementation */
        .gravity-button-glass {
          padding: 16px 32px;
          backdrop-filter: blur(12px);
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .gravity-button:hover .gravity-button-glass {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.3);
        }

        /* A11Y: High-contrast text on glassmorphic background */
        .gravity-button-text {
          position: relative;
          font-size: 16px;
          font-weight: 600;
          color: #ffffff;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
          z-index: 1;
        }

        /* Respect prefers-reduced-motion */
        @media (prefers-reduced-motion: reduce) {
          .gravity-button {
            transition: none;
          }
          .gravity-button-glass {
            transition: none;
          }
        }
      `}</style>
        </motion.button>
    );
};
