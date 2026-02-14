import React from 'react';
import { MoleculeViewer } from '../components/MoleculeViewer';

/**
 * LSD-25 3D Molecular Visualization Demo
 * 
 * Demonstrates the MoleculeViewer component with LSD-25 structure
 * fetched from PubChem in SDF format for scientifically accurate rendering.
 */
export const LSDDemo: React.FC = () => {
    // LSD-25 3D structure data (SDF format from PubChem CID: 5761)
    // This is a simplified version - in production, fetch from backend API
    const lsdSDF = `
5761
  -OEChem-02142604402D

 49 52  0     1  0  0  0  0  0999 V2000
    2.0116    0.8669    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0
    5.5437    0.8667    0.0000 N   0  0  3  0  0  0  0  0  0  0  0  0
    6.5317   -3.3235    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0
    2.8718    2.3703    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0
    5.5277   -0.1748    0.0000 C   0  0  1  0  0  0  0  0  0  0  0  0
    4.6616   -0.6748    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    6.3937   -0.6748    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    3.7436    0.8736    0.0000 C   0  0  1  0  0  0  0  0  0  0  0  0
    4.6457    1.3944    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    6.3937   -1.6748    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    4.6616   -1.6748    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    5.5277   -2.1748    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    3.7516   -0.1680    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    5.5437   -3.2164    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    6.4155    1.3566    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    2.8757    1.3703    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    7.0116   -2.4532    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    3.7516   -2.1817    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    4.6457   -3.7441    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    3.7436   -3.2233    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    2.0039    2.8669    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    3.7359    2.8736    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    2.0000    3.8669    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    3.7320    3.8736    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    6.2670    0.2445    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    7.0043   -0.7825    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    6.6057   -0.0922    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    3.7424    1.4936    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    5.0466    1.8673    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    4.2484    1.8704    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    3.2183   -0.4842    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    6.7192    0.8161    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    6.9560    1.6604    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    6.1117    1.8971    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    7.6295   -2.4015    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    3.2183   -1.8655    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    6.8177   -3.8736    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    4.6481   -4.3641    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    3.2055   -3.5312    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    1.3929    2.9722    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    1.7941    2.2835    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    3.9502    2.2918    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    4.3461    2.9836    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    2.6200    3.8693    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    1.9976    4.4869    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    1.3800    3.8645    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    4.3520    3.8760    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    3.7297    4.4936    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    3.1120    3.8712    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
  1 16  2  0  0  0  0
  2  5  1  0  0  0  0
  2  9  1  0  0  0  0
  2 15  1  0  0  0  0
  3 14  1  0  0  0  0
  3 17  1  0  0  0  0
  3 37  1  0  0  0  0
  4 16  1  0  0  0  0
  4 21  1  0  0  0  0
  4 22  1  0  0  0  0
  5  6  1  0  0  0  0
  5  7  1  0  0  0  0
  5 25  1  1  0  0  0
  6 11  1  0  0  0  0
  6 13  2  0  0  0  0
  7 10  1  0  0  0  0
  7 26  1  0  0  0  0
  7 27  1  0  0  0  0
  8  9  1  0  0  0  0
  8 13  1  0  0  0  0
  8 16  1  1  0  0  0
  8 28  1  0  0  0  0
  9 29  1  0  0  0  0
  9 30  1  0  0  0  0
 10 12  1  0  0  0  0
 10 17  2  0  0  0  0
 11 12  2  0  0  0  0
 11 18  1  0  0  0  0
 12 14  1  0  0  0  0
 13 31  1  0  0  0  0
 14 19  2  0  0  0  0
 15 32  1  0  0  0  0
 15 33  1  0  0  0  0
 15 34  1  0  0  0  0
 17 35  1  0  0  0  0
 18 20  2  0  0  0  0
 18 36  1  0  0  0  0
 19 20  1  0  0  0  0
 19 38  1  0  0  0  0
 20 39  1  0  0  0  0
 21 23  1  0  0  0  0
 21 40  1  0  0  0  0
 21 41  1  0  0  0  0
 22 24  1  0  0  0  0
 22 42  1  0  0  0  0
 22 43  1  0  0  0  0
 23 44  1  0  0  0  0
 23 45  1  0  0  0  0
 23 46  1  0  0  0  0
 24 47  1  0  0  0  0
 24 48  1  0  0  0  0
 24 49  1  0  0  0  0
M  END
> <PUBCHEM_COMPOUND_CID>
5761

> <PUBCHEM_IUPAC_NAME>
(6aR,9R)-N,N-diethyl-7-methyl-4,6,6a,7,8,9-hexahydroindolo[4,3-fg]quinoline-9-carboxamide
$$$$
`;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">
                        LSD-25
                    </h1>
                    <p className="text-slate-300 text-lg">
                        3D Molecular Structure Visualization
                    </p>
                    <div className="mt-4 flex gap-4 text-sm">
                        <span className="px-3 py-1 bg-teal-500/20 text-teal-300 rounded-full border border-teal-500/30">
                            C₂₀H₂₅N₃O
                        </span>
                        <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full border border-purple-500/30">
                            PubChem CID: 5761
                        </span>
                        <span className="px-3 py-1 bg-pink-500/20 text-pink-300 rounded-full border border-pink-500/30">
                            MW: 323.43 g/mol
                        </span>
                    </div>
                </div>

                {/* 3D Molecule Viewer */}
                <MoleculeViewer
                    moleculeName="LSD-25"
                    moleculeData={lsdSDF}
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
                                <span className="text-white font-mono">C₂₀H₂₅N₃O</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Molecular Weight:</span>
                                <span className="text-white">323.43 g/mol</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">XLogP:</span>
                                <span className="text-white">2.9</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">H-Bond Donors:</span>
                                <span className="text-white">1</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">H-Bond Acceptors:</span>
                                <span className="text-white">2</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Rotatable Bonds:</span>
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
                                <span className="ml-2 text-white">5-HT₂A Receptor</span>
                            </div>
                            <div>
                                <span className="text-slate-400">Mechanism:</span>
                                <span className="ml-2 text-white">Partial Agonist</span>
                            </div>
                            <div>
                                <span className="text-slate-400">Class:</span>
                                <span className="ml-2 text-white">Psychedelic (Lysergamide)</span>
                            </div>
                            <div>
                                <span className="text-slate-400">Route:</span>
                                <span className="ml-2 text-white">Oral / Sublingual</span>
                            </div>
                            <div>
                                <span className="text-slate-400">Onset:</span>
                                <span className="ml-2 text-white">30-60 minutes</span>
                            </div>
                            <div>
                                <span className="text-slate-400">Duration:</span>
                                <span className="ml-2 text-white">8-12 hours</span>
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
                        CCN(CC)C(=O)C1CN(C2CC3=CNC4=CC=CC(=C34)C2=C1)C
                    </code>
                </div>

                {/* Data Source Attribution */}
                <div className="mt-6 text-center text-sm text-slate-500">
                    <p>
                        Molecular data sourced from{' '}
                        <a
                            href="https://pubchem.ncbi.nlm.nih.gov/compound/5761"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-teal-400 hover:text-teal-300 underline"
                        >
                            PubChem (CID: 5761)
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

export default LSDDemo;
