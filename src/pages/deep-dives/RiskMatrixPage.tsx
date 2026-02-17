import React from 'react';
import SafetyRiskMatrix from '../../components/analytics/SafetyRiskMatrix';

const RiskMatrix: React.FC = () => {
    return (
        <div className="p-8 min-h-screen bg-[#0a1628] text-slate-300">
            <div className="border-b border-slate-800 pb-6 mb-8">
                <h1 className="text-5xl font-black tracking-tighter mb-2">Safety Risk Matrix</h1>
                <p className="text-slate-300 text-xl sm:text-2xl font-medium max-w-4xl leading-relaxed">
                    This grid identifies potential risks by cross-referencing substances with existing medical conditions or medications. It highlights safety concerns to prevent adverse interactions.
                </p>
            </div>
            <div className="max-w-4xl mx-auto mt-10">
                <SafetyRiskMatrix />
            </div>
        </div>
    );
};

export default RiskMatrix;
