import React from 'react';
import ProtocolEfficiency from '../../components/analytics/ProtocolEfficiency';

const ProtocolEfficiencyPage = () => {
    return (
        <div className="p-8 min-h-screen bg-[#05070a] text-white">
            <h1 className="text-5xl font-black tracking-tighter mb-2">Protocol Efficiency</h1>
            <div className="max-w-6xl mx-auto mt-10">
                <ProtocolEfficiency />
            </div>
        </div>
    );
};

export default ProtocolEfficiencyPage;
