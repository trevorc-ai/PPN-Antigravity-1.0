import React from 'react';
import { BarChart3, Activity, AlertTriangle, Users } from 'lucide-react';

interface ClinicalInsightsPanelProps {
    isVisible: boolean;
}

export const ClinicalInsightsPanel: React.FC<ClinicalInsightsPanelProps> = ({ isVisible }) => {
    if (!isVisible) {
        return (
            <div className="bg-[#0f1218] border border-[#1e293b] rounded-xl p-8 text-center">
                <Activity className="w-12 h-12 text-[#94a3b8] mx-auto mb-4" />
                <p className="text-[#94a3b8]">
                    Complete patient information and protocol details to view clinical insights
                </p>
            </div>
        );
    }

    return (
        <div className="bg-[#0f1218] border border-[#1e293b] rounded-xl p-6 space-y-6">
            <h3 className="text-xl font-semibold text-[#f8fafc] mb-4">Clinical Insights</h3>

            {/* Placeholder sections for Phase 2 */}
            <div className="space-y-4">
                {/* Expected Outcomes */}
                <div className="bg-[#020408] border border-[#1e293b] rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <BarChart3 className="w-5 h-5 text-[#14b8a6]" />
                        <h4 className="font-medium text-[#f8fafc]">Expected Outcomes</h4>
                    </div>
                    <p className="text-sm text-[#94a3b8]">
                        Real-time analytics coming in Phase 2
                    </p>
                </div>

                {/* Receptor Affinity */}
                <div className="bg-[#020408] border border-[#1e293b] rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Activity className="w-5 h-5 text-[#14b8a6]" />
                        <h4 className="font-medium text-[#f8fafc]">Receptor Affinity Profile</h4>
                    </div>
                    <p className="text-sm text-[#94a3b8]">
                        Pharmacological mechanism visualization coming in Phase 2
                    </p>
                </div>

                {/* Drug Interactions */}
                <div className="bg-[#020408] border border-[#1e293b] rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-5 h-5 text-[#f59e0b]" />
                        <h4 className="font-medium text-[#f8fafc]">Drug Interactions</h4>
                    </div>
                    <p className="text-sm text-[#94a3b8]">
                        Interaction alerts coming in Phase 2
                    </p>
                </div>

                {/* Cohort Matches */}
                <div className="bg-[#020408] border border-[#1e293b] rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Users className="w-5 h-5 text-[#14b8a6]" />
                        <h4 className="font-medium text-[#f8fafc]">Similar Patients</h4>
                    </div>
                    <p className="text-sm text-[#94a3b8]">
                        Cohort matching coming in Phase 2
                    </p>
                </div>
            </div>
        </div>
    );
};
