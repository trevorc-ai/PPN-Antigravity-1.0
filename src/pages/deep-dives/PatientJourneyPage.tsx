import React from 'react';
import PatientJourneySnapshot from '../../components/analytics/PatientJourneySnapshot';

const PatientJourney: React.FC = () => {
    return (
        <div className="p-8 min-h-screen bg-[#05070a] text-white">
            <div className="border-b border-slate-800 pb-6 mb-8">
                <h1 className="text-5xl font-black tracking-tighter mb-2">Patient Journey</h1>
                <p className="text-slate-400 text-xl sm:text-2xl font-medium max-w-4xl leading-relaxed">
                    This graph tracks a patient's progress over time compared to typical recovery patterns. It measures symptom scores at key intervals to show if a treatment is working as expected.
                </p>
            </div>
            <div className="max-w-4xl mx-auto mt-10">
                <PatientJourneySnapshot />
            </div>
        </div>
    );
};

export default PatientJourney;
