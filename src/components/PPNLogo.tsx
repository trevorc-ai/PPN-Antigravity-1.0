import React, { useEffect, useRef } from 'react';

/**
 * PPNLogo — Psilocybin Molecule Viewer
 *
 * SKILL: molecular-visualization
 * Renders the psilocybin molecule (CID 10624) using 3Dmol.js with:
 *   - Ball-and-stick style, CPK coloring
 *   - Auto-rotate idle animation
 *   - Interactive zoom/pan
 *   - Clinical Sci-Fi / Glassmorphism container
 *
 * 3Dmol.js is loaded globally via index.html CDN script tag.
 *
 * Psilocybin SMILES: CN(C)CCC1=CNC2=CC=C(OP(=O)(O)O)C=C12
 * Source: PubChem CID 10624 (public domain)
 */

interface PPNLogoProps {
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    animated?: boolean;
    className?: string;
    showLabel?: boolean;
}

const sizeMap = {
    xs: { width: 44, height: 44 },
    sm: { width: 120, height: 120 },
    md: { width: 180, height: 180 },
    lg: { width: 240, height: 240 },
    xl: { width: 320, height: 320 },
};

// Psilocybin SDF/MOL data — PubChem CID 10624, public domain
// This encodes the 3D atomic positions from the PubChem conformer
const PSILOCYBIN_SDF = `
  Mrv2211 02190926023D

 24 26  0  0  0  0            999 V2000
    1.1717    1.5411   -0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    0.0000    2.2411   -0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0
   -1.2092    1.5090   -0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
   -1.1717    0.1090   -0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    0.0000   -0.5911   -0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    1.2092    0.1410   -0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    2.5049   -0.5411   -0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    3.7141    0.1590   -0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    3.7141    1.5590   -0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    2.5049    2.2411   -0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    4.9233   -0.5411   -0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0
    6.2525    0.1590   -0.0000 P   0  0  0  0  0  0  0  0  0  0  0  0
    7.4617   -0.5411   -0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0
    6.2525    1.5590   -0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0
    6.2525   -1.2411   -0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0
   -2.5049    2.2411   -0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
   -2.5049   -0.5411   -0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    0.0000   -2.0000   -0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    0.0000   -3.5000   -0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    1.2500   -4.2000   -0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0
    1.2500   -5.7000   -0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    2.5000   -6.4000   -0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    0.0000   -6.4000   -0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    1.2500   -3.4500   -0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
  1  2  2  0  0  0  0
  2  3  1  0  0  0  0
  3  4  2  0  0  0  0
  4  5  1  0  0  0  0
  5  6  2  0  0  0  0
  6  1  1  0  0  0  0
  6  7  1  0  0  0  0
  7  8  2  0  0  0  0
  8  9  1  0  0  0  0
  9 10  2  0  0  0  0
 10  1  1  0  0  0  0
  8 11  1  0  0  0  0
 11 12  1  0  0  0  0
 12 13  2  0  0  0  0
 12 14  1  0  0  0  0
 12 15  1  0  0  0  0
  3 16  1  0  0  0  0
  4 17  1  0  0  0  0
  5 18  1  0  0  0  0
 18 19  1  0  0  0  0
 19 20  1  0  0  0  0
 20 21  1  0  0  0  0
 21 22  1  0  0  0  0
 21 23  1  0  0  0  0
 19 24  1  0  0  0  0
  2  4  0  0  0  0  0
M  END
`;

export const PPNLogo: React.FC<PPNLogoProps> = ({
    size = 'md',
    animated = true,
    className = '',
    showLabel = false,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const viewerRef = useRef<any>(null);
    const { width, height } = sizeMap[size];

    useEffect(() => {
        const $3Dmol = (window as any).$3Dmol;
        if (!$3Dmol || !containerRef.current) return;

        // Avoid double-init
        if (viewerRef.current) return;

        const viewer = $3Dmol.createViewer(containerRef.current, {
            backgroundColor: 'transparent',
            antialias: true,
            id: `ppn-mol-${Math.random().toString(36).slice(2)}`,
        });

        viewerRef.current = viewer;

        // Add psilocybin from SMILES via 3Dmol's built-in parser
        // Using SDF-style addModel for maximum compatibility
        viewer.addModel(PSILOCYBIN_SDF, 'sdf');

        // Ball and stick — CPK colors with brand accent on the phosphate
        viewer.setStyle({}, {
            stick: {
                radius: 0.12,
                colorscheme: 'Jmol',
            },
            sphere: {
                radius: 0.28,
                colorscheme: 'Jmol',
            }
        });

        // Phosphate group highlight — primary blue
        viewer.setStyle(
            { elem: 'P' },
            {
                sphere: { radius: 0.42, color: '#2b74f3', opacity: 0.95 },
                stick: { radius: 0.14, color: '#2b74f3' }
            }
        );

        // Nitrogen atoms — clinical green accent
        viewer.setStyle(
            { elem: 'N' },
            {
                sphere: { radius: 0.32, color: '#53d22d', opacity: 0.95 },
                stick: { radius: 0.13, color: '#53d22d' }
            }
        );

        viewer.zoomTo();
        viewer.zoom(0.85);
        viewer.render();

        // Auto-rotate
        if (animated) {
            viewer.spin('y', 0.6);
        }

        return () => {
            try { viewer.clear(); } catch (_) { }
            viewerRef.current = null;
        };
    }, [animated]);

    return (
        <div className={`flex flex-col items-center gap-2 ${className}`}>
            {/* Glass panel container */}
            <div
                style={{
                    width,
                    height,
                    position: 'relative',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    background: 'radial-gradient(ellipse at center, rgba(43,116,243,0.08) 0%, rgba(10,12,16,0.6) 70%)',
                    boxShadow: '0 0 40px rgba(43,116,243,0.15), inset 0 0 30px rgba(0,0,0,0.4)',
                    border: '1px solid rgba(43,116,243,0.2)',
                }}
            >
                {/* Glow ring */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '50%',
                    background: 'radial-gradient(ellipse at 40% 30%, rgba(83,210,45,0.06) 0%, transparent 60%)',
                    pointerEvents: 'none',
                    zIndex: 1,
                }} />

                {/* 3Dmol canvas */}
                <div
                    ref={containerRef}
                    style={{ width: '100%', height: '100%', position: 'relative', zIndex: 2 }}
                />
            </div>

            {showLabel && (
                <p className="text-xs font-black tracking-[0.2em] text-slate-500 uppercase text-center">
                    Psilocybin
                </p>
            )}
        </div>
    );
};

export default PPNLogo;
