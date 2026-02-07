import React from 'react';
import ProtocolEfficiencyComponent from '../../components/analytics/ProtocolEfficiency';

const ProtocolEfficiency: React.FC = () => {
    return (
        <div className="p-8 min-h-screen bg-[#05070a] text-white">
            <h1 className="text-3xl font-black tracking-tighter uppercase mb-2">Protocol Efficiency</h1>
            <div className="max-w-4xl mx-auto mt-10">
                <ProtocolEfficiencyComponent />
            </div>
        </div>
    );
};

export default ProtocolEfficiency;
