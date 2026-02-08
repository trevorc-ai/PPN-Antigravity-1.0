import React from 'react';
import PatientConstellationComponent from '../../components/analytics/PatientConstellation';

const PatientConstellation: React.FC = () => {
    return (
        <div className="p-8 min-h-screen bg-[#05070a] text-white">
            <h1 className="text-5xl font-black tracking-tighter mb-2">Patient Constellation</h1>
            <div className="max-w-4xl mx-auto mt-10">
                <PatientConstellationComponent />
            </div>
        </div>
    );
};

export default PatientConstellation;
