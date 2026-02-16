import React, { useState } from 'react';
import GlobalFilterBar, { GlobalFilters } from '../../components/analytics/GlobalFilterBar';
import FunnelChart from '../../components/charts/FunnelChart';
import TimeToStepChart from '../../components/charts/TimeToStepChart';
import ComplianceChart from '../../components/charts/ComplianceChart';

const PatientFlowPage: React.FC = () => {
    const [filters, setFilters] = useState<GlobalFilters>({
        siteIds: [],
        dateRange: { start: '', end: '' },
        substanceIds: [],
        routeIds: [],
        supportModalityIds: [],
        protocolIds: []
    });

    return (
        <div className="min-h-screen bg-[#05070a] p-6">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Page Header */}
                <div className="border-b border-slate-800 pb-8">
                    <div className="flex items-center gap-4 mb-3">
                        <span className="material-symbols-outlined text-4xl text-primary">timeline</span>
                        <h1 className="text-5xl font-black tracking-tighter text-slate-200">Patient Flow</h1>
                    </div>
                    <p className="text-lg text-slate-400 font-medium">
                        Track patient progression through intake, consent, baseline, session, and follow-up stages
                    </p>
                </div>

                {/* Global Filter Bar */}
                <GlobalFilterBar
                    filters={filters}
                    onChange={setFilters}
                />

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Funnel Chart */}
                    <FunnelChart filters={filters} />


                    {/* Time to Next Step */}
                    <TimeToStepChart filters={filters} />


                    {/* Compliance Chart */}
                    <ComplianceChart filters={filters} className="lg:col-span-2" />
                </div>

                {/* Debug: Show Active Filters */}
                {(filters.siteIds.length > 0 ||
                    filters.substanceIds.length > 0 ||
                    filters.routeIds.length > 0 ||
                    filters.supportModalityIds.length > 0 ||
                    filters.protocolIds.length > 0 ||
                    filters.dateRange.start ||
                    filters.dateRange.end) && (
                        <div className="card-glass rounded-2xl p-6">
                            <h4 className="text-sm font-black text-slate-400 tracking-widest uppercase mb-4">
                                Active Filters (Debug)
                            </h4>
                            <pre className="text-xs text-slate-300 font-mono bg-slate-900/50 p-4 rounded-xl overflow-x-auto">
                                {JSON.stringify(filters, null, 2)}
                            </pre>
                        </div>
                    )}
            </div>
        </div>
    );
};

export default PatientFlowPage;
