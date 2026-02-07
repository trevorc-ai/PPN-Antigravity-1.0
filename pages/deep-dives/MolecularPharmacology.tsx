import React from 'react';
import MolecularBridge from '../../components/analytics/MolecularBridge';

const MolecularPharmacology: React.FC = () => {
    return (
        <div className="p-8 min-h-screen bg-[#05070a] text-white">
            <h1 className="text-3xl font-black tracking-tighter uppercase mb-2">Molecular Pharmacology</h1>
            <div className="max-w-4xl mx-auto mt-10">
                <MolecularBridge />
            </div>
        </div>
    );
};

export default MolecularPharmacology;
