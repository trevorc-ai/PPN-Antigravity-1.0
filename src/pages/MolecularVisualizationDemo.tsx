import React from 'react';
import { MoleculeViewer } from '../components/science';
import { Atom, Beaker, Info } from 'lucide-react';

/**
 * Molecular Visualization Demo - WO_032
 * 
 * Showcases the MoleculeViewer component with 3D molecular structures
 * of common psychedelic substances.
 */
const MolecularVisualizationDemo: React.FC = () => {
    // SMILES strings for psychedelic molecules
    const molecules = [
        {
            name: 'Psilocybin',
            fullName: '4-phosphoryloxy-N,N-dimethyltryptamine',
            smiles: 'CN(C)CCc1c[nH]c2ccc(OP(=O)(O)O)cc12',
            placeholderImage: '/molecules/Psilocybin.webp',
            description: 'Naturally occurring psychedelic prodrug compound produced by more than 200 species of fungi.'
        },
        {
            name: 'LSD-25',
            fullName: 'Lysergic Acid Diethylamide',
            smiles: 'CCN(CC)C(=O)[C@H]1CN([C@@H]2Cc3c[nH]c4cccc(c34)C2=C1)C',
            placeholderImage: '/molecules/LSD-25.webp',
            description: 'Semi-synthetic psychedelic drug derived from ergot alkaloids, known for its profound effects on consciousness.'
        },
        {
            name: 'DMT',
            fullName: 'N,N-Dimethyltryptamine',
            smiles: 'CN(C)CCc1c[nH]c2ccccc12',
            placeholderImage: '/molecules/Dimethyltryptamine.webp',
            description: 'Naturally occurring tryptamine found in many plants and animals, known for intense short-duration experiences.'
        },
        {
            name: 'MDMA',
            fullName: '3,4-Methylenedioxymethamphetamine',
            smiles: 'CC(NC)Cc1ccc2c(c1)OCO2',
            placeholderImage: '/molecules/MDMA.webp',
            description: 'Empathogenic substance being studied for PTSD treatment, known for enhancing emotional connection and empathy.'
        },
        {
            name: 'Ketamine',
            fullName: '2-(2-Chlorophenyl)-2-(methylamino)cyclohexanone',
            smiles: 'CNC1(CCCCC1=O)c2ccccc2Cl',
            placeholderImage: '/molecules/Ketamine.webp',
            description: 'Dissociative anesthetic approved for treatment-resistant depression, works through NMDA receptor antagonism.'
        },
        {
            name: 'Mescaline',
            fullName: '3,4,5-Trimethoxyphenethylamine',
            smiles: 'COc1cc(CCN)cc(OC)c1OC',
            placeholderImage: '/molecules/Mescaline.webp',
            description: 'Naturally occurring psychedelic alkaloid found in peyote and San Pedro cacti, used ceremonially for thousands of years.'
        },
        {
            name: 'Ibogaine',
            fullName: '12-Methoxyibogamine',
            smiles: 'CC[C@H]1CN2CCc3c([nH]c4ccccc34)[C@H]2C[C@@H]1C[C@@H]5NCCc6c5[nH]c7ccccc67',
            placeholderImage: '/molecules/Ibogaine.webp',
            description: 'Psychoactive indole alkaloid from the iboga plant, being studied for addiction treatment and interruption.'
        },
        {
            name: '5-MeO-DMT',
            fullName: '5-Methoxy-N,N-Dimethyltryptamine',
            smiles: 'CN(C)CCc1c[nH]c2ccc(OC)cc12',
            placeholderImage: '/molecules/5-MeO-DMT.webp',
            description: 'Potent naturally occurring psychedelic tryptamine found in various plants and the Sonoran Desert toad.'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0a1628] via-[#0d1b2a] to-[#05070a] p-8">
            <div className="max-w-7xl mx-auto space-y-12">
                {/* Header */}
                <div className="text-center space-y-4">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Atom className="w-12 h-12 text-emerald-400" />
                        <h1 className="text-5xl font-black text-slate-200 tracking-tight">
                            Molecular Visualization
                        </h1>
                    </div>
                    <p className="text-lg text-slate-400 max-w-3xl mx-auto">
                        High-performance 3D molecular structures with lazy-loading WebGL and scientific-grade rendering
                    </p>
                    <div className="flex items-center justify-center gap-6 text-sm text-slate-500">
                        <div className="flex items-center gap-2">
                            <Beaker className="w-4 h-4" />
                            <span>Ball & Stick Rendering</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Info className="w-4 h-4" />
                            <span>CPK Coloring</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Atom className="w-4 h-4" />
                            <span>Auto-Rotate</span>
                        </div>
                    </div>
                </div>

                {/* Instructions */}
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6">
                    <div className="flex items-start gap-3">
                        <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                        <div>
                            <h3 className="text-blue-300 font-semibold mb-2">How to Interact</h3>
                            <ul className="text-blue-200 text-sm space-y-1">
                                <li><span className="font-semibold">Desktop:</span> Hover over any molecule to activate 3D view</li>
                                <li><span className="font-semibold">Mobile:</span> Tap "Interact with 3D Model" button</li>
                                <li><span className="font-semibold">Rotate:</span> Click and drag to rotate the molecule</li>
                                <li><span className="font-semibold">Zoom:</span> Scroll to zoom in/out</li>
                                <li><span className="font-semibold">Reset:</span> Click the reset button to return to default view</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Molecules Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {molecules.map((molecule) => (
                        <div key={molecule.name} className="space-y-4">
                            {/* Molecule Info */}
                            <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                                <h2 className="text-2xl font-bold text-slate-200 mb-1">{molecule.name}</h2>
                                <p className="text-sm text-slate-400 mb-3">{molecule.fullName}</p>
                                <p className="text-sm text-slate-300 leading-relaxed">{molecule.description}</p>

                                {/* SMILES String */}
                                <div className="mt-4 p-3 bg-slate-800/50 rounded-lg border border-slate-700/30">
                                    <div className="text-xs text-slate-500 mb-1">SMILES String:</div>
                                    <code className="text-xs text-emerald-400 font-mono break-all">{molecule.smiles}</code>
                                </div>
                            </div>

                            {/* 3D Viewer */}
                            <MoleculeViewer
                                substanceName={molecule.name}
                                smiles={molecule.smiles}
                                placeholderImage={molecule.placeholderImage}
                                autoRotate={true}
                                className="w-full h-96"
                            />
                        </div>
                    ))}
                </div>

                {/* Technical Info */}
                <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8">
                    <h2 className="text-2xl font-bold text-slate-200 mb-6">Technical Features</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <h3 className="text-emerald-400 font-semibold">Lazy-Loading</h3>
                            <p className="text-slate-300 text-sm">
                                Static 2D image loads first. WebGL context initializes only on hover/tap. Zero performance penalty for inactive molecules.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-blue-400 font-semibold">Scientific Rendering</h3>
                            <p className="text-slate-300 text-sm">
                                "Ball and Stick" representation with CPK coloring (Jmol colorscheme). Lab-instrument quality visualization.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-purple-400 font-semibold">Performance</h3>
                            <p className="text-slate-300 text-sm">
                                Intersection Observer prevents off-screen rendering. Smooth 60fps auto-rotation. Multiple molecules on page supported.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-amber-400 font-semibold">Accessibility</h3>
                            <p className="text-slate-300 text-sm">
                                WCAG AAA compliant. ARIA labels for screen readers. Keyboard focus support. High contrast instructions.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-red-400 font-semibold">Graceful Fallback</h3>
                            <p className="text-slate-300 text-sm">
                                Comprehensive error handling. Always shows static image if 3D fails. No crashes on malformed data.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-emerald-400 font-semibold">Interactions</h3>
                            <p className="text-slate-300 text-sm">
                                Auto-rotate on load. Click-and-drag rotation. Scroll to zoom. Reset view button. Smooth animations.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Implementation Details */}
                <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8">
                    <h2 className="text-2xl font-bold text-slate-200 mb-4">Implementation</h2>

                    <div className="space-y-4">
                        <div>
                            <h3 className="text-slate-300 font-semibold mb-2">Component Usage:</h3>
                            <pre className="bg-slate-800/50 border border-slate-700/30 rounded-lg p-4 overflow-x-auto">
                                <code className="text-sm text-slate-300">{`import { MoleculeViewer } from '../components/science';

<MoleculeViewer
  substanceName="Psilocybin"
  smiles="CN(C)CCc1c[nH]c2ccc(OP(=O)(O)O)cc12"
  placeholderImage="/images/molecules/psilocybin.png"
  autoRotate={true}
  className="w-full h-96"
/>`}</code>
                            </pre>
                        </div>

                        <div>
                            <h3 className="text-slate-300 font-semibold mb-2">Dependencies:</h3>
                            <ul className="text-slate-400 text-sm space-y-1">
                                <li>• <span className="text-emerald-400 font-mono">3Dmol.js</span> - Loaded via CDN in index.html</li>
                                <li>• <span className="text-blue-400 font-mono">Intersection Observer API</span> - Native browser API</li>
                                <li>• <span className="text-purple-400 font-mono">requestAnimationFrame</span> - Native browser API</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-slate-300 font-semibold mb-2">Files Created:</h3>
                            <ul className="text-slate-400 text-sm space-y-1 font-mono">
                                <li>• src/components/science/MoleculeViewer.tsx</li>
                                <li>• src/components/science/index.ts</li>
                                <li>• src/components/science/README.md</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Documentation Link */}
                <div className="text-center">
                    <p className="text-sm text-slate-400">
                        Full documentation: <code className="text-emerald-400">src/components/science/README.md</code>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default MolecularVisualizationDemo;
