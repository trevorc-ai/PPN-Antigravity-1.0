
import React from 'react';
import { MoleculeViewer } from '../components/MoleculeViewer';

/**
 * DMT 3D Molecular Visualization Demo
 */
export const DMTDemo: React.FC = () => {
    // DMT 3D structure data (SDF format from PubChem CID: 3016)
    const dmtSDF = `
3016
  -OEChem-02142604572D

 23 24  0     1  0  0  0  0  0999 V2000
    2.0000    1.7010    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0
    3.4027    1.1274    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    2.5355   -1.1274    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0
    2.0000    3.3220    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    2.0000    0.0385    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    4.1037   -0.5350    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    4.1037    2.7899    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    5.5436   -1.3664    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    6.9835   -0.5350    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    5.5436    3.6214    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    6.9835    2.7899    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    7.7034    1.1274    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    8.4234   -1.3664    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    2.5355   -2.2624    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    1.4650    3.8570    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    2.5350    3.8570    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    0.9174    1.3492    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    1.3996   -0.3081    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    5.5436   -2.4564    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    5.5436    4.7114    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    7.5185   -0.8440    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    7.5185    3.7165    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    8.7773    1.1274    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
  1  2  1  0  0  0  0
  1  4  1  0  0  0  0
  1  5  1  0  0  0  0
  1 17  1  0  0  0  0
  2  7  2  0  0  0  0
  2  9  1  0  0  0  0
  3  5  1  0  0  0  0
  3  6  1  0  0  0  0
  3 14  1  0  0  0  0
  4 15  1  0  0  0  0
  4 16  1  0  0  0  0
  5 18  1  0  0  0  0
  6  8  2  0  0  0  0
  6 10  1  0  0  0  0
  7 11  1  0  0  0  0
  8 10  1  0  0  0  0
  8 19  1  0  0  0  0
  9 11  2  0  0  0  0
  9 12  1  0  0  0  0
  9 13  1  0  0  0  0
 10 20  1  0  0  0  0
 11 21  1  0  0  0  0
 11 22  1  0  0  0  0
 12 23  1  0  0  0  0
M  END
> <PUBCHEM_COMPOUND_CID>
3016

> <PUBCHEM_IUPAC_NAME>
2-(1H-indol-3-yl)-N,N-dimethylethanamine
$$$$
`;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-teal-950 to-slate-950 p-8">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">DMT</h1>
                    <p className="text-slate-300 text-lg">3D Molecular Structure Visualization</p>
                    <div className="mt-4 flex gap-4 text-sm">
                        <span className="px-3 py-1 bg-teal-500/20 text-teal-300 rounded-full border border-teal-500/30">C₁₂H₁₆N₂</span>
                        <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full border border-purple-500/30">PubChem CID: 3016</span>
                    </div>
                </div>

                <MoleculeViewer
                    moleculeName="DMT"
                    moleculeData={dmtSDF}
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

export default DMTDemo;
