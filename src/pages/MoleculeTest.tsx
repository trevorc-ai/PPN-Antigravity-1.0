import React from 'react';
import { MoleculeViewer } from '../components/science';

/**
 * Test page for PubChem API integration
 */
const MoleculeTest: React.FC = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0a1628] via-[#0d1b2a] to-[#05070a] p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <h1 className="text-4xl font-black text-slate-200 text-center">
                    Molecule Viewer Test
                </h1>

                <p className="text-slate-400 text-center">
                    Testing PubChem API integration with Psilocybin (CID: 10624)
                </p>

                {/* Test with PubChem CID */}
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-emerald-400">Using PubChem CID</h2>
                    <MoleculeViewer
                        substanceName="Psilocybin"
                        pubchemCid={10624}
                        placeholderImage="/molecules/Psilocybin.webp"
                        autoRotate={true}
                        className="w-full h-96"
                    />
                </div>

                {/* Instructions */}
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                    <p className="text-blue-200 text-sm">
                        <span className="font-semibold">Desktop:</span> Hover to activate •
                        <span className="font-semibold ml-2">Mobile:</span> Tap button •
                        <span className="font-semibold ml-2">Rotate:</span> Click & drag •
                        <span className="font-semibold ml-2">Zoom:</span> Scroll
                    </p>
                </div>

                {/* Console Instructions */}
                <div className="bg-slate-900/40 border border-slate-700/50 rounded-xl p-4">
                    <p className="text-slate-300 text-sm">
                        Open browser console (F12) to see loading logs
                    </p>
                </div>
            </div>
        </div>
    );
};

export default MoleculeTest;
