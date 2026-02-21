import React, { useState } from 'react';

interface IsometricMoleculeProps {
    image: string;
    name: string;
    formula?: string;
    tiltOnHover?: boolean;
    autoRotate?: boolean;
    glowColor?: string;
    showLabel?: boolean;
    className?: string;
}

/**
 * IsometricMolecule — CSS 3D isometric projection for molecular structure images.
 *
 * Applies a rotateX/Y perspective transform to any molecule .webp, producing
 * a convincing isometric 3D effect with no WebGL required. A per-substance
 * colored radial glow intensifies on hover.
 *
 * Used on:
 *   - SubstanceCard (catalog) — showLabel=false, compact size
 *   - MonographHero (monograph) — showLabel=true when no MoleculeViewer
 */
const IsometricMolecule: React.FC<IsometricMoleculeProps> = ({
    image,
    name,
    formula,
    tiltOnHover = true,
    autoRotate = false,
    glowColor = '#6366f1',
    showLabel = true,
    className = '',
}) => {
    const [isHovered, setIsHovered] = useState(false);

    const transform = isHovered && tiltOnHover
        ? 'rotateX(30deg) rotateY(30deg) translateZ(24px) scale(1.04)'
        : 'rotateX(18deg) rotateY(-22deg) translateZ(0px)';

    return (
        <div
            className={`relative group select-none ${className}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Glow layer — behind the image */}
            <div
                className="absolute inset-0 rounded-full pointer-events-none transition-all duration-500"
                style={{
                    background: `radial-gradient(ellipse at center, ${glowColor}${isHovered ? '55' : '30'} 0%, transparent 70%)`,
                    filter: `blur(${isHovered ? '18px' : '12px'})`,
                }}
                aria-hidden="true"
            />

            {/* 3D perspective container */}
            <div
                style={{
                    perspective: '900px',
                    perspectiveOrigin: '50% 50%',
                }}
            >
                <div
                    style={{
                        transform,
                        transformStyle: 'preserve-3d',
                        transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
                        animation: autoRotate ? 'spin 12s linear infinite' : undefined,
                    }}
                >
                    <img
                        src={image}
                        alt={`${name} molecular structure`}
                        className="relative w-full h-auto drop-shadow-2xl"
                        style={{
                            filter: isHovered
                                ? `drop-shadow(0 0 16px ${glowColor}80) drop-shadow(0 0 6px ${glowColor}60)`
                                : `drop-shadow(0 0 8px ${glowColor}40)`,
                            transition: 'filter 0.5s ease',
                        }}
                    />
                </div>
            </div>

            {/* Label — optional, shown on standalone/demo usage */}
            {showLabel && (
                <div className="mt-4 text-center space-y-1">
                    <h3 className="text-base font-bold text-slate-300 group-hover:text-slate-100 transition-colors duration-300">
                        {name}
                    </h3>
                    {formula && (
                        <p className="text-sm text-slate-500 font-mono">{formula}</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default IsometricMolecule;
