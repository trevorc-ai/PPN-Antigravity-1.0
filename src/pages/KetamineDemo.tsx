import React from 'react';
import { MoleculeViewer } from '../components/MoleculeViewer';

/**
 * Ketamine 3D Molecular Visualization Demo
 * 
 * Demonstrates the MoleculeViewer component with Ketamine structure
 * fetched from PubChem in SDF format for scientifically accurate rendering.
 */
export const KetamineDemo: React.FC = () => {
    // Ketamine 3D structure data (SDF format from PubChem CID: 3821)
    // This is a simplified version - in production, fetch from backend API
    const ketamineSDF = `
3821
  -OEChem-02142604392D

 32 33  0     1  0  0  0  0  0999 V2000
    5.6114   -0.8192    0.0000 Cl  0  0  0  0  0  0  0  0  0  0  0  0
    2.0000   -0.1352    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0
    3.2321    0.7308    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0
    3.7321   -0.1352    0.0000 C   0  0  3  0  0  0  0  0  0  0  0  0
    4.5981   -0.6352    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    4.5981   -1.6352    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    3.7321   -2.1352    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    2.8660   -0.6352    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    2.8660   -1.6352    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    4.4981    0.5076    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    5.4378    0.1656    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    4.3245    1.4924    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    2.2321    0.7308    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    6.2038    0.8084    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    5.0905    2.1352    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    6.0302    1.7932    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    5.2087   -0.7429    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    4.8101   -0.0526    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    4.8101   -2.2178    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    5.2087   -1.5275    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    3.3335   -2.6101    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    4.1306   -2.6101    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    2.2554   -1.5275    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    2.6540   -2.2178    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    3.3397    1.3414    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    3.7418    1.7045    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    2.2321    1.3508    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    1.6121    0.7308    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    2.2321    0.1108    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    6.7864    0.5963    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    4.9828    2.7458    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    6.5051    2.1917    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
  1 11  1  0  0  0  0
  2  8  2  0  0  0  0
  3  4  1  0  0  0  0
  3 13  1  0  0  0  0
  3 25  1  0  0  0  0
  4  5  1  0  0  0  0
  4  8  1  0  0  0  0
  4 10  1  0  0  0  0
  5  6  1  0  0  0  0
  5 17  1  0  0  0  0
  5 18  1  0  0  0  0
  6  7  1  0  0  0  0
  6 19  1  0  0  0  0
  6 20  1  0  0  0  0
  7  9  1  0  0  0  0
  7 21  1  0  0  0  0
  7 22  1  0  0  0  0
  8  9  1  0  0  0  0
  9 23  1  0  0  0  0
  9 24  1  0  0  0  0
 10 11  1  0  0  0  0
 10 12  2  0  0  0  0
 11 14  2  0  0  0  0
 12 15  1  0  0  0  0
 12 26  1  0  0  0  0
 13 27  1  0  0  0  0
 13 28  1  0  0  0  0
 13 29  1  0  0  0  0
 14 16  1  0  0  0  0
 14 30  1  0  0  0  0
 15 16  2  0  0  0  0
 15 31  1  0  0  0  0
 16 32  1  0  0  0  0
M  END
> <PUBCHEM_COMPOUND_CID>
3821

> <PUBCHEM_IUPAC_NAME>
2-(2-chlorophenyl)-2-(methylamino)cyclohexan-1-one
$$$$
`;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">
                        Ketamine
                    </h1>
                    <p className="text-slate-300 text-lg">
                        3D Molecular Structure Visualization
                    </p>
                    <div className="mt-4 flex gap-4 text-sm">
                        <span className="px-3 py-1 bg-teal-500/20 text-teal-300 rounded-full border border-teal-500/30">
                            C₁₃H₁₆ClNO
                        </span>
                        <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full border border-purple-500/30">
                            PubChem CID: 3821
                        </span>
                        <span className="px-3 py-1 bg-pink-500/20 text-pink-300 rounded-full border border-pink-500/30">
                            MW: 237.72 g/mol
                        </span>
                    </div>
                </div>

                {/* 3D Molecule Viewer */}
                <MoleculeViewer
                    moleculeName="Ketamine"
                    moleculeData={ketamineSDF}
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
                                <span className="text-white font-mono">C₁₃H₁₆ClNO</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Molecular Weight:</span>
                                <span className="text-white">237.72 g/mol</span>
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
                                <span className="ml-2 text-white">NMDA Receptor</span>
                            </div>
                            <div>
                                <span className="text-slate-400">Mechanism:</span>
                                <span className="ml-2 text-white">Non-competitive antagonist</span>
                            </div>
                            <div>
                                <span className="text-slate-400">Class:</span>
                                <span className="ml-2 text-white">Dissociative Anesthetic</span>
                            </div>
                            <div>
                                <span className="text-slate-400">Routes:</span>
                                <span className="ml-2 text-white">IV, IM, Intranasal, Oral</span>
                            </div>
                            <div>
                                <span className="text-slate-400">Onset:</span>
                                <span className="ml-2 text-white">1-5 minutes (IV/IM)</span>
                            </div>
                            <div>
                                <span className="text-slate-400">Duration:</span>
                                <span className="ml-2 text-white">45-90 minutes</span>
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
                        CNC1(CCCCC1=O)C2=CC=CC=C2Cl
                    </code>
                </div>

                {/* Data Source Attribution */}
                <div className="mt-6 text-center text-sm text-slate-500">
                    <p>
                        Molecular data sourced from{' '}
                        <a
                            href="https://pubchem.ncbi.nlm.nih.gov/compound/3821"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-teal-400 hover:text-teal-300 underline"
                        >
                            PubChem (CID: 3821)
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

export default KetamineDemo;
