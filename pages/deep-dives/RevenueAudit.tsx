import React from 'react';
import RevenueForensics from '../../components/analytics/RevenueForensics';

const RevenueAudit: React.FC = () => {
    return (
        <div className="p-8 min-h-screen bg-[#05070a] text-white">
            <h1 className="text-3xl font-black tracking-tighter uppercase mb-2">Revenue Audit</h1>
            <div className="max-w-4xl mx-auto mt-10">
                <RevenueForensics />
            </div>
        </div>
    );
};

export default RevenueAudit;
