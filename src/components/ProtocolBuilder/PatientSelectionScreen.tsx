import React from 'react';
import { User, Search, ArrowLeft } from 'lucide-react';

interface PatientSelectionScreenProps {
    onNewPatient: () => void;
    onExistingPatient: () => void;
    onBack?: () => void;
}

export const PatientSelectionScreen: React.FC<PatientSelectionScreenProps> = ({
    onNewPatient,
    onExistingPatient,
    onBack,
}) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#020408] via-[#0a0e1a] to-[#020408] flex items-center justify-center p-6">
            <div className="max-w-4xl w-full">
                {/* Back Button */}
                {onBack && (
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-[#94a3b8] hover:text-[#f8fafc] transition-colors mb-6"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to My Protocols
                    </button>
                )}

                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-[#f8fafc] mb-3">
                        Protocol Builder
                    </h1>
                    <p className="text-lg text-[#94a3b8]">
                        Select patient to begin session
                    </p>
                </div>

                {/* Two Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* New Patient Card */}
                    <button
                        onClick={onNewPatient}
                        className="group bg-[#0f1218] border border-[#1e293b] rounded-xl p-8 hover:border-[#14b8a6] transition-all duration-300 hover:shadow-lg hover:shadow-[#14b8a6]/20 text-left"
                    >
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="w-16 h-16 rounded-full bg-[#14b8a6]/10 flex items-center justify-center group-hover:bg-[#14b8a6]/20 transition-colors">
                                <User className="w-8 h-8 text-[#14b8a6]" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-semibold text-[#f8fafc] mb-2">
                                    New Patient
                                </h2>
                                <p className="text-[#94a3b8] mb-1">Generate anonymized ID</p>
                                <p className="text-[#94a3b8]">Start Session 1</p>
                            </div>
                        </div>
                    </button>

                    {/* Existing Patient Card */}
                    <button
                        onClick={onExistingPatient}
                        className="group bg-[#0f1218] border border-[#1e293b] rounded-xl p-8 hover:border-[#10b981] transition-all duration-300 hover:shadow-lg hover:shadow-[#10b981]/20 text-left"
                    >
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="w-16 h-16 rounded-full bg-[#10b981]/10 flex items-center justify-center group-hover:bg-[#10b981]/20 transition-colors">
                                <Search className="w-8 h-8 text-[#10b981]" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-semibold text-[#f8fafc] mb-2">
                                    Existing Patient
                                </h2>
                                <p className="text-[#94a3b8] mb-1">Search by characteristics</p>
                                <p className="text-[#94a3b8]">Continue treatment</p>
                            </div>
                        </div>
                    </button>
                </div>

                {/* HIPAA Compliance Notice */}
                <div className="bg-[#0f1218] border border-[#1e293b] rounded-lg p-4 text-center">
                    <p className="text-sm text-[#94a3b8]">
                        🔒 <span className="font-medium text-[#f8fafc]">HIPAA Compliant</span> - No PHI collected. All patient identifiers are anonymized.
                    </p>
                </div>
            </div>
        </div>
    );
};
