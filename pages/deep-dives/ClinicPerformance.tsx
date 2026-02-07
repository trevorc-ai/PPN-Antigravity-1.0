import React from 'react';
import ClinicPerformanceRadar from '../../components/analytics/ClinicPerformanceRadar';

const ClinicPerformance: React.FC = () => {
    return (
        <div className="p-8 min-h-screen bg-[#05070a] text-white">
            <h1 className="text-3xl font-black tracking-tighter uppercase mb-2">Clinic Performance Radar</h1>
            <div className="max-w-4xl mx-auto mt-10">
                <ClinicPerformanceRadar />
            </div>
        </div>
    );
};

export default ClinicPerformance;
