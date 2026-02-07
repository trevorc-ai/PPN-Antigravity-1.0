import React from 'react';
import ConfidenceCone from '../../components/analytics/ConfidenceCone';

const ComparativeEfficacy: React.FC = () => {
    return (
        <div className="p-8 min-h-screen bg-[#05070a] text-white">
            <h1 className="text-3xl font-black tracking-tighter uppercase mb-2">Comparative Efficacy</h1>
            <div className="max-w-4xl mx-auto mt-10">
                <ConfidenceCone />
            </div>
        </div>
    );
};

export default ComparativeEfficacy;
