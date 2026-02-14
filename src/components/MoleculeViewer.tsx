import React, { useEffect, useRef, useState } from 'react';

// Type declaration for 3Dmol
declare global {
    interface Window {
        $3Dmol: any;
    }
}

interface MoleculeViewerProps {
    /** Molecule name for display */
    moleculeName?: string;
    /** SMILES string or PDB data */
    moleculeData: string;
    /** Data format: 'smiles', 'pdb', 'sdf', 'mol' */
    format?: 'smiles' | 'pdb' | 'sdf' | 'mol';
    /** Visualization style: 'stick', 'sphere', 'cartoon' */
    style?: 'stick' | 'sphere' | 'cartoon' | 'line';
    /** Width of viewer container */
    width?: string;
    /** Height of viewer container */
    height?: string;
    /** Enable auto-rotation */
    autoRotate?: boolean;
    /** Background color (transparent for glassmorphism) */
    backgroundColor?: string;
}

/**
 * MoleculeViewer - Interactive 3D Molecular Visualization Component
 * 
 * Uses 3Dmol.js for scientifically accurate rendering of molecular structures.
 * Follows the molecular-visualization skill protocol for Clinical Sci-Fi aesthetic.
 * 
 * @example
 * ```tsx
 * <MoleculeViewer
 *   moleculeName="Psilocybin"
 *   moleculeData="CN1CCC2=CC(=C3C=C2C1CC4=CC=C(C=C4)O)O3"
 *   format="smiles"
 *   autoRotate={true}
 * />
 * ```
 */
export const MoleculeViewer: React.FC<MoleculeViewerProps> = ({
    moleculeName = 'Molecule',
    moleculeData,
    format = 'smiles',
    style = 'stick',
    width = '100%',
    height = '500px',
    autoRotate = true,
    backgroundColor = 'transparent'
}) => {
    const viewerRef = useRef<HTMLDivElement>(null);
    const viewerInstanceRef = useRef<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [is3DmolLoaded, setIs3DmolLoaded] = useState(false);

    // Load 3Dmol.js library
    useEffect(() => {
        // Check if already loaded
        if (window.$3Dmol) {
            setIs3DmolLoaded(true);
            return;
        }

        // Load 3Dmol.js from CDN
        const script = document.createElement('script');
        script.src = 'https://3dmol.csb.pitt.edu/build/3Dmol-min.js';
        script.async = true;
        script.onload = () => {
            setIs3DmolLoaded(true);
        };
        script.onerror = () => {
            setError('Failed to load 3Dmol.js library');
            setIsLoading(false);
        };
        document.body.appendChild(script);

        return () => {
            // Cleanup script if component unmounts
            if (script.parentNode) {
                script.parentNode.removeChild(script);
            }
        };
    }, []);

    // Initialize viewer and render molecule
    useEffect(() => {
        if (!is3DmolLoaded || !viewerRef.current || !moleculeData) return;

        try {
            setIsLoading(true);
            setError(null);

            // Create 3Dmol viewer instance
            const config = {
                backgroundColor: backgroundColor === 'transparent' ? 'white' : backgroundColor,
                antialias: true,
                disableFog: true
            };

            const viewer = window.$3Dmol.createViewer(viewerRef.current, config);
            viewerInstanceRef.current = viewer;

            // For SMILES, we need to convert to 3D coordinates
            // In production, this should be done server-side with RDKit
            if (format === 'smiles') {
                // Fallback: Use PubChem to get 3D structure
                // For now, we'll show a message that SMILES needs backend conversion
                setError('SMILES format requires backend conversion to 3D coordinates. Please provide PDB or SDF format.');
                setIsLoading(false);
                return;
            }

            // Add molecule model
            viewer.addModel(moleculeData, format);

            // Apply visualization style with CPK coloring
            const styleConfig: any = {};

            switch (style) {
                case 'stick':
                    styleConfig.stick = {
                        radius: 0.15,
                        colorscheme: 'default' // CPK coloring
                    };
                    break;
                case 'sphere':
                    styleConfig.sphere = {
                        scale: 0.3,
                        colorscheme: 'default'
                    };
                    break;
                case 'cartoon':
                    styleConfig.cartoon = {
                        color: 'spectrum',
                        arrows: true
                    };
                    break;
                case 'line':
                    styleConfig.line = {
                        linewidth: 2,
                        colorscheme: 'default'
                    };
                    break;
            }

            viewer.setStyle({}, styleConfig);

            // Add high-contrast studio lighting
            viewer.setBackgroundColor(backgroundColor === 'transparent' ? 'white' : backgroundColor);

            // Zoom to fit molecule
            viewer.zoomTo();

            // Render the scene
            viewer.render();

            // Enable auto-rotation if specified
            if (autoRotate) {
                viewer.spin(true);
            }

            // Enable interactive controls
            viewer.enableFog(false);

            setIsLoading(false);

        } catch (err) {
            console.error('Error rendering molecule:', err);
            setError('Failed to render molecular structure');
            setIsLoading(false);
        }

        // Cleanup
        return () => {
            if (viewerInstanceRef.current) {
                viewerInstanceRef.current.clear();
            }
        };
    }, [is3DmolLoaded, moleculeData, format, style, autoRotate, backgroundColor]);

    return (
        <div className="relative w-full">
            {/* Aurora Glassmorphism Container */}
            <div
                className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900/60 via-purple-900/40 to-teal-900/40 backdrop-blur-md border border-white/10 shadow-2xl"
                style={{ width, height }}
            >
                {/* Aurora gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 via-purple-500/10 to-pink-500/10 animate-pulse" />

                {/* Molecule name header */}
                {moleculeName && (
                    <div className="absolute top-4 left-4 z-10">
                        <h3 className="text-xl font-semibold text-white drop-shadow-lg">
                            {moleculeName}
                        </h3>
                        <p className="text-sm text-slate-300">
                            Interactive 3D Structure
                        </p>
                    </div>
                )}

                {/* 3Dmol viewer container */}
                <div
                    ref={viewerRef}
                    className="absolute inset-0 w-full h-full"
                    style={{
                        width: '100%',
                        height: '100%',
                        position: 'relative'
                    }}
                />

                {/* Loading state */}
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm">
                        <div className="text-center">
                            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-teal-400 border-r-transparent mb-4" />
                            <p className="text-white text-lg">Loading molecular structure...</p>
                        </div>
                    </div>
                )}

                {/* Error state */}
                {error && (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-900/90 backdrop-blur-sm">
                        <div className="text-center max-w-md px-6">
                            <div className="text-red-400 text-5xl mb-4">⚠️</div>
                            <p className="text-white text-lg font-semibold mb-2">Visualization Error</p>
                            <p className="text-slate-300 text-sm">{error}</p>
                        </div>
                    </div>
                )}

                {/* Controls hint */}
                {!isLoading && !error && (
                    <div className="absolute bottom-4 right-4 z-10">
                        <div className="bg-slate-900/80 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/10">
                            <p className="text-xs text-slate-300">
                                🖱️ Drag to rotate • Scroll to zoom
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Molecule info panel */}
            <div className="mt-4 p-4 rounded-lg bg-slate-900/40 backdrop-blur-sm border border-white/10">
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <span className="text-slate-400">Format:</span>
                        <span className="ml-2 text-white font-mono">{format.toUpperCase()}</span>
                    </div>
                    <div>
                        <span className="text-slate-400">Style:</span>
                        <span className="ml-2 text-white capitalize">{style}</span>
                    </div>
                    <div>
                        <span className="text-slate-400">Auto-rotate:</span>
                        <span className="ml-2 text-white">{autoRotate ? 'Enabled' : 'Disabled'}</span>
                    </div>
                    <div>
                        <span className="text-slate-400">Coloring:</span>
                        <span className="ml-2 text-white">CPK Standard</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MoleculeViewer;
