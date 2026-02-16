import React from 'react';
import { IsometricMolecule } from '../components/science';
import { Atom, Sparkles, Info } from 'lucide-react';

/**
 * Isometric Molecules Demo - WO_032 (Revised)
 * 
 * Showcases molecules with CSS 3D isometric projection effects
 */
const IsometricMoleculesDemo: React.FC = () => {
    const molecules = [
        {
            name: 'Psilocybin',
            formula: 'C₁₂H₁₇N₂O₄P',
            image: '/molecules/Psilocybin.webp',
            glowColor: '#8b5cf6'
        },
        {
            name: 'LSD-25',
            formula: 'C₂₀H₂₅N₃O',
            image: '/molecules/LSD-25.webp',
            glowColor: '#ec4899'
        },
        {
            name: 'DMT',
            formula: 'C₁₂H₁₆N₂',
            image: '/molecules/Dimethyltryptamine.webp',
            glowColor: '#10b981'
        },
        {
            name: 'MDMA',
            formula: 'C₁₁H₁₅NO₂',
            image: '/molecules/MDMA.webp',
            glowColor: '#f59e0b'
        },
        {
            name: 'Ketamine',
            formula: 'C₁₃H₁₆ClNO',
            image: '/molecules/Ketamine.webp',
            glowColor: '#3b82f6'
        },
        {
            name: 'Mescaline',
            formula: 'C₁₁H₁₇NO₃',
            image: '/molecules/Mescaline.webp',
            glowColor: '#14b8a6'
        },
        {
            name: 'Ibogaine',
            formula: 'C₂₀H₂₆N₂O',
            image: '/molecules/Ibogaine.webp',
            glowColor: '#a855f7'
        },
        {
            name: '5-MeO-DMT',
            formula: 'C₁₃H₁₈N₂O',
            image: '/molecules/5-MeO-DMT.webp',
            glowColor: '#06b6d4'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0a1628] via-[#0d1b2a] to-[#05070a] p-8">
            <div className="max-w-7xl mx-auto space-y-12">
                {/* Header */}
                <div className="text-center space-y-4">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Sparkles className="w-12 h-12 text-emerald-400" />
                        <h1 className="text-5xl font-black text-slate-200 tracking-tight">
                            Isometric Molecules
                        </h1>
                    </div>
                    <p className="text-lg text-slate-400 max-w-3xl mx-auto">
                        3D isometric projection using CSS transforms • Hover for interactive tilt effects
                    </p>
                    <div className="flex items-center justify-center gap-6 text-sm text-slate-500">
                        <div className="flex items-center gap-2">
                            <Atom className="w-4 h-4" />
                            <span>CSS 3D Transforms</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4" />
                            <span>Glassmorphism</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Info className="w-4 h-4" />
                            <span>Hover Effects</span>
                        </div>
                    </div>
                </div>

                {/* Instructions */}
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6">
                    <div className="flex items-start gap-3">
                        <Info className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                        <div>
                            <h3 className="text-emerald-300 font-semibold mb-2">Isometric Projection</h3>
                            <p className="text-emerald-200 text-sm leading-relaxed">
                                These molecules are displayed using CSS 3D transforms to create an isometric projection effect.
                                Hover over any molecule to see it tilt and glow. The effect is achieved using <code className="px-1.5 py-0.5 bg-emerald-900/30 rounded text-emerald-300">rotateX()</code> and <code className="px-1.5 py-0.5 bg-emerald-900/30 rounded text-emerald-300">rotateY()</code> transforms
                                combined with <code className="px-1.5 py-0.5 bg-emerald-900/30 rounded text-emerald-300">perspective</code> for depth.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Molecules Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {molecules.map((molecule) => (
                        <IsometricMolecule
                            key={molecule.name}
                            image={molecule.image}
                            name={molecule.name}
                            formula={molecule.formula}
                            tiltOnHover={true}
                            glowColor={molecule.glowColor}
                            className="w-full"
                        />
                    ))}
                </div>

                {/* Technical Details */}
                <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8">
                    <h2 className="text-2xl font-bold text-slate-200 mb-6">Technical Details</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <h3 className="text-emerald-400 font-semibold">CSS 3D Transforms</h3>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                Uses <code className="text-emerald-400 bg-slate-800/50 px-1.5 py-0.5 rounded">perspective</code>,
                                <code className="text-emerald-400 bg-slate-800/50 px-1.5 py-0.5 rounded ml-1">rotateX()</code>, and
                                <code className="text-emerald-400 bg-slate-800/50 px-1.5 py-0.5 rounded ml-1">rotateY()</code> to create
                                isometric projection. No WebGL or heavy libraries required.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-blue-400 font-semibold">Performance</h3>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                Lightweight CSS-only approach. Hardware-accelerated transforms ensure smooth 60fps animations.
                                Works on all modern browsers including mobile devices.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-purple-400 font-semibold">Glassmorphism</h3>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                Cards use <code className="text-purple-400 bg-slate-800/50 px-1.5 py-0.5 rounded">backdrop-blur</code> and
                                semi-transparent backgrounds for a modern glassmorphic aesthetic that matches the PPN design system.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-amber-400 font-semibold">Hover Effects</h3>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                Interactive tilt on hover with smooth cubic-bezier easing. Includes glow effects, brightness adjustments,
                                and subtle shine overlays for premium feel.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Implementation */}
                <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8">
                    <h2 className="text-2xl font-bold text-slate-200 mb-4">Usage Example</h2>

                    <pre className="bg-slate-800/50 border border-slate-700/30 rounded-lg p-4 overflow-x-auto">
                        <code className="text-sm text-slate-300">{`import { IsometricMolecule } from '../components/science';

<IsometricMolecule
  image="/molecules/Psilocybin.webp"
  name="Psilocybin"
  formula="C₁₂H₁₇N₂O₄P"
  tiltOnHover={true}
  glowColor="#8b5cf6"
  className="w-full"
/>`}</code>
                    </pre>

                    <div className="mt-6 space-y-3">
                        <h3 className="text-slate-300 font-semibold">Props:</h3>
                        <ul className="text-slate-400 text-sm space-y-2">
                            <li><code className="text-emerald-400 bg-slate-800/50 px-1.5 py-0.5 rounded">image</code> - Path to molecule image</li>
                            <li><code className="text-emerald-400 bg-slate-800/50 px-1.5 py-0.5 rounded">name</code> - Molecule name</li>
                            <li><code className="text-emerald-400 bg-slate-800/50 px-1.5 py-0.5 rounded">formula</code> - Chemical formula (optional)</li>
                            <li><code className="text-emerald-400 bg-slate-800/50 px-1.5 py-0.5 rounded">tiltOnHover</code> - Enable hover tilt effect (default: true)</li>
                            <li><code className="text-emerald-400 bg-slate-800/50 px-1.5 py-0.5 rounded">glowColor</code> - Glow color on hover (default: #10b981)</li>
                            <li><code className="text-emerald-400 bg-slate-800/50 px-1.5 py-0.5 rounded">autoRotate</code> - Enable auto-rotation (default: false)</li>
                        </ul>
                    </div>
                </div>

                {/* Note */}
                <div className="text-center">
                    <p className="text-sm text-slate-400">
                        Component: <code className="text-emerald-400">src/components/science/IsometricMolecule.tsx</code>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default IsometricMoleculesDemo;
