import React from 'react';
import { MoleculeViewer } from '../components/MoleculeViewer';

/**
 * MDMA 3D Molecular Visualization Demo
 * 
 * Demonstrates the MoleculeViewer component with MDMA structure
 * fetched from PubChem in SDF format for scientifically accurate rendering.
 */
export const MDMADemo: React.FC = () => {
    // MDMA 3D structure data (SDF format from PubChem CID: 1615)
    // This is a simplified version - in production, fetch from backend API
    const mdmaSDF = `
1615
  -OEChem-02142604332D

 29 30  0     1  0  0  0  0  0999 V2000
    8.1424    0.4947    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0
    8.1424   -1.1147    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0
    2.8660    0.6900    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0
    3.7321    0.1900    0.0000 C   0  0  3  0  0  0  0  0  0  0  0  0
    4.5981    0.6900    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    5.4641    0.1900    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    3.7321   -0.8100    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    6.3301    0.6900    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    7.1962    0.1900    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    5.4641   -0.8100    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    7.1962   -0.8100    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    6.3301   -1.3100    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    2.0000    0.1900    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    8.7260   -0.3100    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    3.7321    0.8100    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    4.9966    1.1650    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    4.1996    1.1650    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    3.1121   -0.8100    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    3.7321   -1.4300    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    4.3521   -0.8100    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    6.3301    1.3100    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    2.8660    1.3100    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    4.9272   -1.1200    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    6.3301   -1.9300    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    1.6900    0.7269    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    1.4631   -0.1200    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    2.3100   -0.3469    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    9.1869   -0.7247    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    9.1869    0.1047    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
  1  9  1  0  0  0  0
  1 14  1  0  0  0  0
  2 11  1  0  0  0  0
  2 14  1  0  0  0  0
  3  4  1  0  0  0  0
  3 13  1  0  0  0  0
  3 22  1  0  0  0  0
  4  5  1  0  0  0  0
  4  7  1  0  0  0  0
  4 15  1  0  0  0  0
  5  6  1  0  0  0  0
  5 16  1  0  0  0  0
  5 17  1  0  0  0  0
  6  8  2  0  0  0  0
  6 10  1  0  0  0  0
  7 18  1  0  0  0  0
  7 19  1  0  0  0  0
  7 20  1  0  0  0  0
  8  9  1  0  0  0  0
  8 21  1  0  0  0  0
  9 11  2  0  0  0  0
 10 12  2  0  0  0  0
 10 23  1  0  0  0  0
 11 12  1  0  0  0  0
 12 24  1  0  0  0  0
 13 25  1  0  0  0  0
 13 26  1  0  0  0  0
 13 27  1  0  0  0  0
 14 28  1  0  0  0  0
 14 29  1  0  0  0  0
M  END
> <PUBCHEM_COMPOUND_CID>
1615

> <PUBCHEM_IUPAC_NAME>
1-(1,3-benzodioxol-5-yl)-N-methylpropan-2-amine
$$$$
`;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">
                        MDMA
                    </h1>
                    <p className="text-slate-300 text-lg">
                        3D Molecular Structure Visualization
                    </p>
                    <div className="mt-4 flex gap-4 text-sm">
                        <span className="px-3 py-1 bg-teal-500/20 text-teal-300 rounded-full border border-teal-500/30">
                            C₁₁H₁₅NO₂
                        </span>
                        <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full border border-purple-500/30">
                            PubChem CID: 1615
                        </span>
                        <span className="px-3 py-1 bg-pink-500/20 text-pink-300 rounded-full border border-pink-500/30">
                            MW: 193.25 g/mol
                        </span>
                    </div>
                </div>

                {/* 3D Molecule Viewer */}
                <MoleculeViewer
                    moleculeName="MDMA"
                    moleculeData={mdmaSDF}
                    format="sdf"
                    style="stick"
                    width="100%"
                    height="600px"
                    autoRotate={true}
                />

                {/* Molecular Information */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Chemical Properties */}
                    <div className="p-6 rounded-xl bg-slate-900/40 backdrop-blur-sm border border-white/10">
                        <h3 className="text-xl font-semibold text-white mb-4">
                            Chemical Properties
                        </h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-400">Molecular Formula:</span>
                                <span className="text-white font-mono">C₁₁H₁₅NO₂</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Molecular Weight:</span>
                                <span className="text-white">193.25 g/mol</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">XLogP:</span>
                                <span className="text-white">2.1</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">H-Bond Donors:</span>
                                <span className="text-white">1</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">H-Bond Acceptors:</span>
                                <span className="text-white">3</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Rotatable Bonds:</span>
                                <span className="text-white">3</span>
                            </div>
                        </div>
                    </div>

                    {/* Pharmacology */}
                    <div className="p-6 rounded-xl bg-slate-900/40 backdrop-blur-sm border border-white/10">
                        <h3 className="text-xl font-semibold text-white mb-4">
                            Pharmacology
                        </h3>
                        <div className="space-y-3 text-sm">
                            <div>
                                <span className="text-slate-400">Primary Targets:</span>
                                <span className="ml-2 text-white">SERT, NET, DAT</span>
                            </div>
                            <div>
                                <span className="text-slate-400">Mechanism:</span>
                                <span className="ml-2 text-white">Monoamine Releasing Agent</span>
                            </div>
                            <div>
                                <span className="text-slate-400">Class:</span>
                                <span className="ml-2 text-white">Empathogen / Entactogen</span>
                            </div>
                            <div>
                                <span className="text-slate-400">Route:</span>
                                <span className="ml-2 text-white">Oral</span>
                            </div>
                            <div>
                                <span className="text-slate-400">Onset:</span>
                                <span className="ml-2 text-white">30-45 minutes</span>
                            </div>
                            <div>
                                <span className="text-slate-400">Duration:</span>
                                <span className="ml-2 text-white">3-6 hours</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* SMILES String */}
                <div className="mt-6 p-4 rounded-lg bg-slate-900/40 backdrop-blur-sm border border-white/10">
                    <h4 className="text-sm font-semibold text-slate-400 mb-2">
                        Canonical SMILES:
                    </h4>
                    <code className="text-teal-300 font-mono text-sm break-all">
                        CC(CC1=CC2=C(C=C1)OCO2)NC
                    </code>
                </div>

                {/* Data Source Attribution */}
                <div className="mt-6 text-center text-sm text-slate-500">
                    <p>
                        Molecular data sourced from{' '}
                        <a
                            href="https://pubchem.ncbi.nlm.nih.gov/compound/1615"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-teal-400 hover:text-teal-300 underline"
                        >
                            PubChem (CID: 1615)
                        </a>
                    </p>
                    <p className="mt-1">
                        Visualization powered by 3Dmol.js
                    </p>
                </div>
            </div>
        </div>
    );
};

export default MDMADemo;
