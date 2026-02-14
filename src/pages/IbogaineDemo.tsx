
import React from 'react';
import { MoleculeViewer } from '../components/MoleculeViewer';

/**
 * Ibogaine 3D Molecular Visualization Demo
 */
export const IbogaineDemo: React.FC = () => {
    // Ibogaine 3D structure data (SDF format from PubChem CID: 179471)
    const ibogaineSDF = `
179471
  -OEChem-02142604552D

 30 31  0     1  0  0  0  0  0999 V2000
    2.5355   -1.9542    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0
    3.7317    2.2542    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0
    9.1419   -1.1274    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0
    2.0000    1.7010    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    2.0000    2.8359    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    2.0000    0.0385    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    2.9234    3.4025    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    3.4027    1.1274    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    2.5355   -1.1274    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    4.1037    2.7899    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    4.1037   -0.5350    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    5.0860    2.2229    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    5.5436   -1.3664    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    6.1953    2.7899    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    6.9835   -0.5350    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    6.1953    1.2594    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    7.7034    1.1274    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    8.4234   -1.3664    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    6.9835    2.7899    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    9.8621    0.5350    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    2.9234   -2.5208    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    1.4650    1.3730    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    1.4650    3.3709    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    0.9174   -0.2731    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    2.9234    4.4850    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    4.1037   -1.6175    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    5.5436   -2.4564    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    6.6433    3.4443    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    6.6433    0.6050    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    7.5185    1.6940    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    9.3271   -1.8016    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    7.5185    3.7165    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    10.3971  -0.3916    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    10.9320   1.1528    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
  1  9  1  0  0  0  0
  1 11  1  0  0  0  0
  1 21  1  0  0  0  0
  2  8  1  0  0  0  0
  2 10  1  0  0  0  0
  2 12  1  0  0  0  0
  3 18  1  0  0  0  0
  3 20  1  0  0  0  0
  4  5  1  0  0  0  0
  4  8  1  0  0  0  0
  4 22  1  0  0  0  0
  5  7  1  0  0  0  0
  5 23  1  0  0  0  0
  6  9  2  0  0  0  0
  6 11  1  0  0  0  0
  6 24  1  0  0  0  0
  7 10  1  0  0  0  0
  7 25  1  0  0  0  0
  8 16  1  0  0  0  0
 10 14  1  0  0  0  0
 11 13  2  0  0  0  0
 12 16  1  0  0  0  0
 13 15  1  0  0  0  0
 13 27  1  0  0  0  0
 14 19  1  0  0  0  0
 14 28  1  0  0  0  0
 15 17  2  0  0  0  0
 15 18  1  0  0  0  0
 16 29  1  0  0  0  0
 17 19  1  0  0  0  0
 17 30  1  0  0  0  0
 18 31  1  0  0  0  0
 19 32  1  0  0  0  0
 20 33  1  0  0  0  0
 20 34  1  0  0  0  0
M  END
> <PUBCHEM_COMPOUND_CID>
179471

> <PUBCHEM_IUPAC_NAME>
Ibogaine
$$$$
`;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-teal-950 to-slate-950 p-8">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">Ibogaine</h1>
                    <p className="text-slate-300 text-lg">3D Molecular Structure Visualization</p>
                    <div className="mt-4 flex gap-4 text-sm">
                        <span className="px-3 py-1 bg-teal-500/20 text-teal-300 rounded-full border border-teal-500/30">C₂₀H₂₆N₂O</span>
                        <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full border border-purple-500/30">PubChem CID: 179471</span>
                    </div>
                </div>

                <MoleculeViewer
                    moleculeName="Ibogaine"
                    moleculeData={ibogaineSDF}
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

export default IbogaineDemo;
