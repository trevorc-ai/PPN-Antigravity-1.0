import React from 'react';
import PatientFlowSankey from '../../components/analytics/PatientFlowSankey';

const PatientRetention: React.FC = () => {
    return (
        <div className="p-8 min-h-screen bg-[#05070a] text-white">
            <h1 className="text-3xl font-black tracking-tighter uppercase mb-2">Patient Retention</h1>
            <div className="max-w-4xl mx-auto mt-10">
                <PatientFlowSankey />
            </div>
        </div>
    );
};

export default PatientRetention;
