import React, { useState } from 'react';

interface IsometricMoleculeProps {
    image: string;
    name: string;
    formula?: string;
    tiltOnHover?: boolean;
    rotateOnHover?: boolean;
    autoRotate?: boolean;
    glowColor?: string;
    className?: string;
}

/**
 * IsometricMolecule - CSS 3D Isometric Projection Display
 * 
 * Displays molecule images with isometric 3D effects using CSS transforms.
 * Features:
 * - Isometric projection (rotateX + rotateY)
 * - Hover tilt effect
 * - Optional auto-rotation
 * - Glassmorphic card wrapper
 * - Glow effects
 * - Dark theme optimized
 * 
 * Part of WO_032 (revised approach)
 */
const IsometricMolecule: React.FC<IsometricMoleculeProps> = ({
    image,
    name,
    formula,
    tiltOnHover = true,
    rotateOnHover = true,
    autoRotate = false,
    glowColor = '#10b981',
    className = ''
}) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className={`relative group ${className}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Transparent container - no card */}
            <div className="relative">

                {/* 3D Isometric Container */}
                <div
                    className="relative"
                    style={{
                        perspective: '1000px',
                        transformStyle: 'preserve-3d'
                    }}
                >
                    {/* Molecule Image with Isometric Transform */}
                    <div
                        className={`relative transition-all duration-700 ease-out ${autoRotate ? 'animate-spin-slow' : ''
                            }`}
                        style={{
                            transform: isHovered && tiltOnHover
                                ? 'rotateX(25deg) rotateY(25deg) translateZ(20px)'
                                : 'rotateX(20deg) rotateY(-20deg)',
                            transformStyle: 'preserve-3d',
                            transition: 'transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)'
                        }}
                    >
                        {/* Main Image - Only visible element */}
                        <img
                            src={image}
                            alt={`${name} molecular structure`}
                            className="relative w-full h-auto"
                            style={{
                                transformStyle: 'preserve-3d'
                            }}
                        />
                    </div>
                </div>

                {/* Label */}
                <div className="mt-6 text-center space-y-1">
                    <h3 className="text-xl font-bold text-slate-300 group-hover:text-emerald-400 transition-colors duration-300">
                        {name}
                    </h3>
                    {formula && (
                        <p className="text-sm text-slate-300 font-mono">
                            {formula}
                        </p>
                    )}
                </div>

                {/* Hover Indicator */}
                {(tiltOnHover || rotateOnHover) && (
                    <div className="mt-4 text-center">
                        <p className="text-xs text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            Hover to tilt
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default IsometricMolecule;
