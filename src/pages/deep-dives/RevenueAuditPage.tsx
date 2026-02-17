import React from 'react';
import RevenueForensics from '../../components/analytics/RevenueForensics';

const RevenueAudit: React.FC = () => {
    return (
        <div className="p-8 min-h-screen bg-gradient-to-b from-[#0a1628] via-[#0d1b2a] to-[#05070a] text-slate-300">
            <h1 className="text-5xl font-black tracking-tighter mb-2">Revenue Audit</h1>
            <div className="max-w-4xl mx-auto mt-10">
                <RevenueForensics />
            </div>
        </div>
    );
};

export default RevenueAudit;
