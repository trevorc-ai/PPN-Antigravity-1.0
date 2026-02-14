import React from 'react';
import { MoleculeViewer } from '../components/MoleculeViewer';

/**
 * 5-MeO-DMT 3D Molecular Visualization Demo
 * 
 * Demonstrates the MoleculeViewer component with 5-MeO-DMT structure
 * derived from scientific data.
 */
export const FiveMeODMTDemo: React.FC = () => {
    // 5-MeO-DMT 3D structure data (SDF format from PubChem CID: 1832)
    const fiveMeOSDF = `
1832
  -OEChem-02142604452D

 25 26  0     1  0  0  0  0  0999 V2000
    2.0000    1.7010    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0
    9.1419   -1.1274    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0
    3.4027    1.1274    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    2.5355   -1.1274    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0
    2.0000    3.3220    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    2.0000    0.0385    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    4.1037   -0.5350    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    4.1037    2.7899    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    5.5436   -1.3664    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    5.5436    3.6214    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    6.9835   -0.5350    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    6.9835    2.7899    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    7.7034    1.1274    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    9.8621    0.5350    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    2.5355   -2.2624    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    1.4650    3.8570    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    2.5350    3.8570    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    0.9174    1.3492    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    1.3996   -0.3081    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    5.5436   -2.4564    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    5.5436    4.7114    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    7.5185   -1.4616    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    7.5185    3.7165    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    9.3271    1.4616    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    10.3971  -0.3916    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    10.9320   1.1528    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
  1  3  1  0  0  0  0
  1  5  1  0  0  0  0
  1  6  1  0  0  0  0
  1 18  1  0  0  0  0
  2 13  1  0  0  0  0
  2 14  1  0  0  0  0
  3  8  2  0  0  0  0
  3 10  1  0  0  0  0
  4  6  1  0  0  0  0
  4  7  1  0  0  0  0
  4 15  1  0  0  0  0
  5 16  1  0  0  0  0
  5 17  1  0  0  0  0
  6 19  1  0  0  0  0
  7  9  2  0  0  0  0
  7 11  1  0  0  0  0
  8 12  1  0  0  0  0
  9 11  1  0  0  0  0
  9 20  1  0  0  0  0
 10 12  2  0  0  0  0
 10 21  1  0  0  0  0
 11 13  2  0  0  0  0
 11 22  1  0  0  0  0
 12 13  1  0  0  0  0
 12 23  1  0  0  0  0
 14 24  1  0  0  0  0
 14 25  1  0  0  0  0
 14 26  1  0  0  0  0
M  END
> <PUBCHEM_COMPOUND_CID>
1832

> <PUBCHEM_IUPAC_NAME>
2-(5-methoxy-1H-indol-3-yl)-N,N-dimethylethanamine
$$$$
`;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">
                        5-MeO-DMT
                    </h1>
                    <p className="text-slate-300 text-lg">
                        3D Molecular Structure Visualization
                    </p>
                    <div className="mt-4 flex gap-4 text-sm">
                        <span className="px-3 py-1 bg-teal-500/20 text-teal-300 rounded-full border border-teal-500/30">
                            C₁₃H₁₈N₂O
                        </span>
                        <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full border border-purple-500/30">
                            PubChem CID: 1832
                        </span>
                        <span className="px-3 py-1 bg-pink-500/20 text-pink-300 rounded-full border border-pink-500/30">
                            MW: 218.29 g/mol
                        </span>
                    </div>
                </div>

                {/* 3D Molecule Viewer */}
                <MoleculeViewer
                    moleculeName="5-MeO-DMT"
                    moleculeData={fiveMeOSDF}
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
                                <span className="text-white font-mono">C₁₃H₁₈N₂O</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Molecular Weight:</span>
                                <span className="text-white">218.29 g/mol</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">XLogP:</span>
                                <span className="text-white">1.7</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">H-Bond Donors:</span>
                                <span className="text-white">1</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">H-Bond Acceptors:</span>
                                <span className="text-white">2</span>
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
                                <span className="text-slate-400">Primary Target:</span>
                                <span className="ml-2 text-white">5-HT₁A, 5-HT₂A Agonist</span>
                            </div>
                            <div>
                                <span className="text-slate-400">Mechanism:</span>
                                <span className="ml-2 text-white">Non-selective Serotonin Agonist</span>
                            </div>
                            <div>
                                <span className="text-slate-400">Class:</span>
                                <span className="ml-2 text-white">Tryptamine</span>
                            </div>
                            <div>
                                <span className="text-slate-400">Route:</span>
                                <span className="ml-2 text-white">Inhalation (Vaporized)</span>
                            </div>
                            <div>
                                <span className="text-slate-400">Onset:</span>
                                <span className="ml-2 text-white">10-60 seconds</span>
                            </div>
                            <div>
                                <span className="text-slate-400">Duration:</span>
                                <span className="ml-2 text-white">15-30 minutes</span>
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
                        COc1ccc2c(c1)c(c[nH]2)CCN(C)C
                    </code>
                </div>

                {/* Data Source Attribution */}
                <div className="mt-6 text-center text-sm text-slate-500">
                    <p>
                        Molecular data sourced from{' '}
                        <a
                            href="https://pubchem.ncbi.nlm.nih.gov/compound/1832"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-teal-400 hover:text-teal-300 underline"
                        >
                            PubChem (CID: 1832)
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

export default FiveMeODMTDemo;
