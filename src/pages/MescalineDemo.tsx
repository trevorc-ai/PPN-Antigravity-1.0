
import React from 'react';
import { MoleculeViewer } from '../components/MoleculeViewer';

/**
 * Mescaline 3D Molecular Visualization Demo
 */
export const MescalineDemo: React.FC = () => {
    // Mescaline 3D structure data (SDF format from PubChem CID: 4076)
    const mescalineSDF = `
4076
  -OEChem-02142604562D

 25 25  0     1  0  0  0  0  0999 V2000
    2.0000    1.7010    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0
    9.1419   -1.1274    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0
    3.4027    1.1274    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    7.7034    1.1274    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0
    7.7034   -3.3822    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0
    3.4027   -0.5350    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    4.8418   -1.3662    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    9.1419    3.6214    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    6.2809   -0.5350    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    4.8418   -3.0286    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    6.2809    1.1274    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    7.7191   -1.3662    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    9.1419   -4.2134    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    6.2809   -3.8598    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    7.7191   -3.0286    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    0.9174    1.3492    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    2.2628    2.6568    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    2.7937    1.4791    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    4.0117    1.4791    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    2.7937   -0.8867    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    4.0117   -0.8867    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    9.1419    4.7114    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    8.1983    3.0766    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    10.0855   3.0766    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    4.3014   -3.3406    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
  1  3  1  0  0  0  0
  1 16  1  0  0  0  0
  1 17  1  0  0  0  0
  2 12  1  0  0  0  0
  2 21  1  0  0  0  0
  3  6  1  0  0  0  0
  3 18  1  0  0  0  0
  3 19  1  0  0  0  0
  4  8  1  0  0  0  0
  4 11  1  0  0  0  0
  5 13  1  0  0  0  0
  5 15  1  0  0  0  0
  6  7  1  0  0  0  0
  6 20  1  0  0  0  0
  6 21  1  0  0  0  0
  7  9  2  0  0  0  0
  7 10  1  0  0  0  0
  8 22  1  0  0  0  0
  8 23  1  0  0  0  0
  8 24  1  0  0  0  0
  9 11  1  0  0  0  0
  9 12  1  0  0  0  0
 10 14  2  0  0  0  0
 10 25  1  0  0  0  0
 12 15  2  0  0  0  0
 14 15  1  0  0  0  0
M  END
> <PUBCHEM_COMPOUND_CID>
4076

> <PUBCHEM_IUPAC_NAME>
2-(3,4,5-trimethoxyphenyl)ethanamine
$$$$
`;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-teal-950 to-slate-950 p-8">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">Mescaline</h1>
                    <p className="text-slate-300 text-lg">3D Molecular Structure Visualization</p>
                    <div className="mt-4 flex gap-4 text-sm">
                        <span className="px-3 py-1 bg-teal-500/20 text-teal-300 rounded-full border border-teal-500/30">C₁₁H₁₇NO₃</span>
                        <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full border border-purple-500/30">PubChem CID: 4076</span>
                    </div>
                </div>

                <MoleculeViewer
                    moleculeName="Mescaline"
                    moleculeData={mescalineSDF}
                    format="sdf"
                    style="stick"
                    width="100%"
                    height="600px"
                    autoRotate={true}
                />
            </div>
        </div>
    );
};

export default MescalineDemo;
