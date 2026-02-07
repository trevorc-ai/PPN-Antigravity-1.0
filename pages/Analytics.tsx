import React from 'react';
import ConfidenceCone from '../components/analytics/ConfidenceCone';
import PatientConstellation from '../components/analytics/PatientConstellation';
import PatientFlowSankey from '../components/analytics/PatientFlowSankey';
import SafetyRiskMatrix from '../components/analytics/SafetyRiskMatrix';
import PatientJourneySnapshot from '../components/analytics/PatientJourneySnapshot';

const Analytics: React.FC = () => {
    return (
        <div className="p-4 sm:p-8 space-y-8 animate-in fade-in duration-500 pb-24">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-black text-white tracking-tighter uppercase">
                    Clinical <span className="text-indigo-500">Intelligence</span>
                </h1>
                <p className="text-sm font-medium text-slate-400 max-w-2xl">
                    Longitudinal Outcomes & Network Benchmarks
                </p>
            </div>

            {/* Analytics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Row 1: Efficacy & Clustering */}
                <ConfidenceCone />
                <PatientConstellation />

                {/* Row 2: Retention & Safety */}
                <PatientFlowSankey />
                <SafetyRiskMatrix />

                {/* Row 3: Timeline (Full Width) */}
                <div className="lg:col-span-2">
                    <PatientJourneySnapshot />
                </div>
            </div>
        </div>
    );
};

export default Analytics;