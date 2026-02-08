import React from 'react';
import SafetyRiskMatrix from '../../components/analytics/SafetyRiskMatrix';

const RiskMatrix: React.FC = () => {
    return (
        <div className="p-8 min-h-screen bg-[#05070a] text-white">
            <h1 className="text-5xl font-black tracking-tighter mb-2">Risk Matrix</h1>
            <div className="max-w-4xl mx-auto mt-10">
                <SafetyRiskMatrix />
            </div>
        </div>
    );
};

export default RiskMatrix;
