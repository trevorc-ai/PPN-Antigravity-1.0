import React, { useMemo } from 'react';

interface Star {
    x: number;
    y: number;
    size: number;
    opacity: number;
}

/**
 * Organic starfield — 220 stars at truly random positions.
 * Uses a seeded LCG PRNG (deterministic — same pattern every render).
 * Gamma-curved brightness so most stars are dim, a few are bright (real sky).
 * Stars are static — no synchronized breathing or bobbing.
 * Only very subtle parallax scroll shift applied to the whole field.
 */
const StarField: React.FC<{ scrollY?: number }> = ({ scrollY = 0 }) => {
    const stars = useMemo<Star[]>(() => {
        // LCG seeded PRNG — deterministic, reproducible pattern
        let seed = 2718281;
        const rand = () => {
            seed = (seed * 1664525 + 1013904223) & 0xffffffff;
            return (seed >>> 0) / 0xffffffff;
        };

        return Array.from({ length: 220 }, () => {
            const raw = rand();
            // Gamma curve: skews distribution toward dim stars (like a real sky)
            const brightness = Math.pow(raw, 2.5);
            return {
                x: rand() * 100,                        // random 0–100% horizontal
                y: rand() * 100,                        // random 0–100% vertical
                size: 0.3 + rand() * 1.6,              // 0.3–1.9px radius (no giant blobs)
                opacity: 0.05 + brightness * 0.75,     // 0.05–0.8, skewed dim
            };
        });
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
            {/* Base sky */}
            <div className="absolute inset-0 bg-[#07101e]" />

            {/* Subtle depth glow — slight brightness at upper-center, fades to edges */}
            <div
                className="absolute inset-0"
                style={{
                    background:
                        'radial-gradient(ellipse 70% 45% at 50% 35%, rgba(25,45,95,0.20) 0%, transparent 100%)',
                }}
            />

            {/* Stars — SVG with SMIL per-element animation for natural individual twinkle */}
            <svg
                className="absolute inset-0 w-full h-full"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                    // Ultra-slow parallax: 1px per 50px scroll — nearly imperceptible
                    transform: `translateY(${scrollY * 0.005}px)`,
                }}
            >
                {stars.map((star, i) => (
                    <circle
                        key={i}
                        cx={`${star.x}%`}
                        cy={`${star.y}%`}
                        r={star.size}
                        fill="white"
                    >
                        {/* SVG SMIL animation — per-star relative opacity, no shared keyframe */}
                        <animate
                            attributeName="opacity"
                            values={`${star.opacity.toFixed(3)};${(star.opacity * 0.12).toFixed(3)};${star.opacity.toFixed(3)}`}
                            dur={`${14 + (i % 23) * 1.3}s`}
                            begin={`${(i % 19) * 1.1}s`}
                            repeatCount="indefinite"
                            calcMode="spline"
                            keyTimes="0;0.5;1"
                            keySplines="0.4 0 0.6 1;0.4 0 0.6 1"
                        />
                    </circle>
                ))}
            </svg>
        </div>
    );
};

export default StarField;
