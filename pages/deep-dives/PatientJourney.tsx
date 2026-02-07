import React from 'react';
import PatientJourneySnapshot from '../../components/analytics/PatientJourneySnapshot';

const PatientJourney: React.FC = () => {
    return (
        <div className="p-8 min-h-screen bg-[#05070a] text-white">
            <h1 className="text-3xl font-black tracking-tighter uppercase mb-2">Patient Journey</h1>
            <div className="max-w-4xl mx-auto mt-10">
                <PatientJourneySnapshot />
            </div>
        </div>
    );
};

export default PatientJourney;
