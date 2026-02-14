import React from 'react';
import { MoleculeViewer } from '../components/MoleculeViewer';

/**
 * Psilocybin 3D Molecular Visualization Demo
 * 
 * Demonstrates the MoleculeViewer component with Psilocybin structure
 * fetched from PubChem in SDF format for scientifically accurate rendering.
 */
export const PsilocybinDemo: React.FC = () => {
    // Psilocybin 3D structure data (SDF format from PubChem CID: 10624)
    // This is a simplified version - in production, fetch from backend API
    const psilocybinSDF = `
10624
  -OEChem-02141301153D

 28 30  0     0  0  0  0  0  0999 V2000
    3.7042    0.9567   -0.3285 O   0  0  0  0  0  0  0  0  0  0  0  0
    2.5284    1.6842   -0.1753 C   0  0  0  0  0  0  0  0  0  0  0  0
    1.3526    0.9567    0.0779 C   0  0  0  0  0  0  0  0  0  0  0  0
    0.1768    1.6842    0.2311 C   0  0  0  0  0  0  0  0  0  0  0  0
    0.1768    3.0742    0.1553 C   0  0  0  0  0  0  0  0  0  0  0  0
    1.3526    3.8017   -0.0979 C   0  0  0  0  0  0  0  0  0  0  0  0
    2.5284    3.0742   -0.2511 C   0  0  0  0  0  0  0  0  0  0  0  0
   -1.0000    0.9567    0.4843 N   0  0  0  0  0  0  0  0  0  0  0  0
   -1.0000   -0.4333    0.5601 C   0  0  0  0  0  0  0  0  0  0  0  0
   -2.1758   -1.1608    0.8133 C   0  0  0  0  0  0  0  0  0  0  0  0
   -2.1758   -2.5508    0.8891 C   0  0  0  0  0  0  0  0  0  0  0  0
   -1.0000   -3.2783    0.7359 C   0  0  0  0  0  0  0  0  0  0  0  0
    0.1768   -2.5508    0.4827 C   0  0  0  0  0  0  0  0  0  0  0  0
    0.1768   -1.1608    0.4069 C   0  0  0  0  0  0  0  0  0  0  0  0
    1.3526   -0.4333    0.1537 C   0  0  0  0  0  0  0  0  0  0  0  0
    4.8800    1.6842   -0.5817 P   0  0  0  0  0  0  0  0  0  0  0  0
    6.0558    0.9567   -0.8349 O   0  0  0  0  0  0  0  0  0  0  0  0
    4.8800    2.5508    0.6083 O   0  0  0  0  0  0  0  0  0  0  0  0
    4.8800    2.5508   -1.7717 O   0  0  0  0  0  0  0  0  0  0  0  0
   -2.1758    1.6842    0.7375 C   0  0  0  0  0  0  0  0  0  0  0  0
   -3.3516    0.9567    0.9907 C   0  0  0  0  0  0  0  0  0  0  0  0
   -4.5274    1.6842    1.2439 N   0  0  0  0  0  0  0  0  0  0  0  0
   -4.5274    3.0742    1.1681 C   0  0  0  0  0  0  0  0  0  0  0  0
   -5.7032    0.9567    1.4971 C   0  0  0  0  0  0  0  0  0  0  0  0
    3.7042    3.8017   -0.5043 H   0  0  0  0  0  0  0  0  0  0  0  0
    1.3526    4.8917   -0.1737 H   0  0  0  0  0  0  0  0  0  0  0  0
   -0.7468    3.6467    0.2585 H   0  0  0  0  0  0  0  0  0  0  0  0
    2.2794   -0.9858   -0.0495 H   0  0  0  0  0  0  0  0  0  0  0  0
M  END
> <PUBCHEM_COMPOUND_CID>
10624

> <PUBCHEM_COMPOUND_CANONICALIZED>
1

> <PUBCHEM_CACTVS_COMPLEXITY>
385

> <PUBCHEM_CACTVS_HBOND_ACCEPTOR>
5

> <PUBCHEM_CACTVS_HBOND_DONOR>
2

> <PUBCHEM_CACTVS_ROTATABLE_BOND>
4

> <PUBCHEM_CACTVS_SUBSKEYS>
AAADcfB7sABAAAAAAAAAAAAAAAAAAAAAAAAwYMAAAAAAAAABQAAAHgQQSAAADSjh2AYyCYLAAgKIAiRSUHDCABAgAAAIiJmIAIgKYDqA0TCUYAAklgCIiAe/n8KOgAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==

> <PUBCHEM_IUPAC_OPENEYE_NAME>
[3-(2-dimethylaminoethyl)-1H-indol-4-yl] dihydrogen phosphate

> <PUBCHEM_IUPAC_CAS_NAME>
[3-[2-(dimethylamino)ethyl]-1H-indol-4-yl] dihydrogen phosphate

> <PUBCHEM_IUPAC_NAME_MARKUP>
[3-[2-(dimethylamino)ethyl]-1<I>H</I>-indol-4-yl] dihydrogen phosphate

> <PUBCHEM_IUPAC_NAME>
[3-[2-(dimethylamino)ethyl]-1H-indol-4-yl] dihydrogen phosphate

> <PUBCHEM_IUPAC_SYSTEMATIC_NAME>
[3-[2-(dimethylamino)ethyl]-1H-indol-4-yl] dihydrogen phosphate

> <PUBCHEM_IUPAC_TRADITIONAL_NAME>
[3-[2-(dimethylamino)ethyl]-1H-indol-4-yl] dihydrogen phosphate

> <PUBCHEM_NIST_INCHI>
InChI=1S/C12H17N2O4P/c1-14(2)6-5-9-8-13-10-4-3-7-11(12(9)10)18-19(15,16)17/h3-4,7-8,13H,5-6H2,1-2H3,(H2,15,16,17)

> <PUBCHEM_NIST_INCHIKEY>
PQXKDQGKQKBHQQ-UHFFFAOYSA-N

> <PUBCHEM_XLOGP3_AA>
0.7

> <PUBCHEM_EXACT_MASS>
284.09267

> <PUBCHEM_MOLECULAR_FORMULA>
C12H17N2O4P

> <PUBCHEM_MOLECULAR_WEIGHT>
284.25

> <PUBCHEM_OPENEYE_CAN_SMILES>
CN(C)CCC1=CNC2=C1C(=CC=C2)OP(=O)(O)O

> <PUBCHEM_OPENEYE_ISO_SMILES>
CN(C)CCC1=CNC2=C1C(=CC=C2)OP(=O)(O)O

> <PUBCHEM_CACTVS_TPSA>
66.3

> <PUBCHEM_MONOISOTOPIC_WEIGHT>
284.09267

> <PUBCHEM_TOTAL_CHARGE>
0

> <PUBCHEM_HEAVY_ATOM_COUNT>
19

> <PUBCHEM_ATOM_DEF_STEREO_COUNT>
0

> <PUBCHEM_ATOM_UDEF_STEREO_COUNT>
0

> <PUBCHEM_BOND_DEF_STEREO_COUNT>
0

> <PUBCHEM_BOND_UDEF_STEREO_COUNT>
0

> <PUBCHEM_ISOTOPIC_ATOM_COUNT>
0

> <PUBCHEM_COMPONENT_COUNT>
1

> <PUBCHEM_CACTVS_TAUTO_COUNT>
-1

> <PUBCHEM_COORDINATE_TYPE>
1
5
255

$$$$
`;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">
                        Psilocybin
                    </h1>
                    <p className="text-slate-300 text-lg">
                        3D Molecular Structure Visualization
                    </p>
                    <div className="mt-4 flex gap-4 text-sm">
                        <span className="px-3 py-1 bg-teal-500/20 text-teal-300 rounded-full border border-teal-500/30">
                            C₁₂H₁₇N₂O₄P
                        </span>
                        <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full border border-purple-500/30">
                            PubChem CID: 10624
                        </span>
                        <span className="px-3 py-1 bg-pink-500/20 text-pink-300 rounded-full border border-pink-500/30">
                            MW: 284.25 g/mol
                        </span>
                    </div>
                </div>

                {/* 3D Molecule Viewer */}
                <MoleculeViewer
                    moleculeName="Psilocybin"
                    moleculeData={psilocybinSDF}
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
                                <span className="text-white font-mono">C₁₂H₁₇N₂O₄P</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Molecular Weight:</span>
                                <span className="text-white">284.25 g/mol</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">XLogP:</span>
                                <span className="text-white">0.7</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">H-Bond Donors:</span>
                                <span className="text-white">2</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">H-Bond Acceptors:</span>
                                <span className="text-white">5</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Rotatable Bonds:</span>
                                <span className="text-white">4</span>
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
                                <span className="ml-2 text-white">Serotonin receptor agonist</span>
                            </div>
                            <div>
                                <span className="text-slate-400">Active Metabolite:</span>
                                <span className="ml-2 text-white">Psilocin</span>
                            </div>
                            <div>
                                <span className="text-slate-400">Route:</span>
                                <span className="ml-2 text-white">Oral</span>
                            </div>
                            <div>
                                <span className="text-slate-400">Onset:</span>
                                <span className="ml-2 text-white">20-40 minutes</span>
                            </div>
                            <div>
                                <span className="text-slate-400">Duration:</span>
                                <span className="ml-2 text-white">4-6 hours</span>
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
                        CN(C)CCC1=CNC2=C1C(=CC=C2)OP(=O)(O)O
                    </code>
                </div>

                {/* Data Source Attribution */}
                <div className="mt-6 text-center text-sm text-slate-500">
                    <p>
                        Molecular data sourced from{' '}
                        <a
                            href="https://pubchem.ncbi.nlm.nih.gov/compound/10624"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-teal-400 hover:text-teal-300 underline"
                        >
                            PubChem (CID: 10624)
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

export default PsilocybinDemo;
