import React from 'react';
// Import the Engine (Component)
import MolecularPharmacology from '../../components/analytics/MolecularPharmacology';

const MolecularPharmacologyPage = () => {
    return (
        <div className="p-8 min-h-screen bg-[#05070a] text-white">
            <h1 className="text-5xl font-black tracking-tighter mb-2">Molecular Pharmacology</h1>
            <div className="max-w-6xl mx-auto mt-10">
                <MolecularPharmacology />
            </div>
        </div>
    );
};

export default MolecularPharmacologyPage;
