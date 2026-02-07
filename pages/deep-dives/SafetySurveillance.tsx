import React from 'react';
import SafetyBenchmark from '../../components/analytics/SafetyBenchmark';

const SafetySurveillance: React.FC = () => {
    return (
        <div className="p-8 min-h-screen bg-[#05070a] text-white">
            <h1 className="text-3xl font-black tracking-tighter uppercase mb-2">Safety Surveillance</h1>
            <div className="max-w-4xl mx-auto mt-10">
                <SafetyBenchmark />
            </div>
        </div>
    );
};

export default SafetySurveillance;
