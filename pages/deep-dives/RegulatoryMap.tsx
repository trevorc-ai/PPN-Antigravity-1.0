import React from 'react';
import RegulatoryMosaic from '../../components/analytics/RegulatoryMosaic';

const RegulatoryMap: React.FC = () => {
    return (
        <div className="p-8 min-h-screen bg-[#05070a] text-white">
            <h1 className="text-3xl font-black tracking-tighter uppercase mb-2">Regulatory Map</h1>
            <div className="max-w-4xl mx-auto mt-10">
                <RegulatoryMosaic />
            </div>
        </div>
    );
};

export default RegulatoryMap;
