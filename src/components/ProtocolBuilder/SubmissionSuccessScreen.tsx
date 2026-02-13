import React from 'react';
import { CheckCircle, Download, Mail, Printer, ArrowLeft, Plus, Home } from 'lucide-react';

interface SubmissionSuccessScreenProps {
    subjectId: string;
    sessionNumber: number;
    onBackToReview: () => void;
    onTrackAnother: () => void;
    onReturnToDashboard: () => void;
}

export const SubmissionSuccessScreen: React.FC<SubmissionSuccessScreenProps> = ({
    subjectId,
    sessionNumber,
    onBackToReview,
    onTrackAnother,
    onReturnToDashboard,
}) => {
    const handleExport = (type: string) => {
        // Placeholder for Phase 2
        alert(`${type} export coming in Phase 2`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#020408] via-[#0a0e1a] to-[#020408] flex items-center justify-center p-6">
            <div className="max-w-2xl w-full">
                {/* Success Animation */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-[#10b981]/20 rounded-full mb-4">
                        <CheckCircle className="w-12 h-12 text-[#10b981]" />
                    </div>
                    <h1 className="text-3xl font-bold text-[#f8fafc] mb-2">
                        Protocol Submitted
                    </h1>
                    <p className="text-[#94a3b8]">
                        Subject ID: <span className="font-mono text-[#14b8a6]">{subjectId}</span> • Session {sessionNumber}
                    </p>
                    <p className="text-sm text-[#94a3b8] mt-1">
                        Submitted: {new Date().toLocaleString()}
                    </p>
                </div>

                {/* Export Options */}
                <div className="bg-[#0f1218] border border-[#1e293b] rounded-xl p-6 mb-6">
                    <h2 className="text-lg font-semibold text-[#f8fafc] mb-4">
                        Export for Your Records
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button
                            onClick={() => handleExport('PDF')}
                            className="bg-[#020408] border border-[#1e293b] rounded-lg p-4 hover:border-[#14b8a6] transition-colors text-center"
                        >
                            <Download className="w-6 h-6 text-[#14b8a6] mx-auto mb-2" />
                            <p className="text-sm font-medium text-[#f8fafc]">Download PDF</p>
                        </button>

                        <button
                            onClick={() => handleExport('Email')}
                            className="bg-[#020408] border border-[#1e293b] rounded-lg p-4 hover:border-[#14b8a6] transition-colors text-center"
                        >
                            <Mail className="w-6 h-6 text-[#14b8a6] mx-auto mb-2" />
                            <p className="text-sm font-medium text-[#f8fafc]">Email Copy</p>
                        </button>

                        <button
                            onClick={() => handleExport('Print')}
                            className="bg-[#020408] border border-[#1e293b] rounded-lg p-4 hover:border-[#14b8a6] transition-colors text-center"
                        >
                            <Printer className="w-6 h-6 text-[#14b8a6] mx-auto mb-2" />
                            <p className="text-sm font-medium text-[#f8fafc]">Print</p>
                        </button>
                    </div>
                </div>

                {/* Navigation Options */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={onBackToReview}
                        className="flex-1 bg-[#020408] border border-[#1e293b] text-[#f8fafc] px-6 py-3 rounded-lg font-medium hover:border-[#14b8a6] transition-colors flex items-center justify-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Review
                    </button>

                    <button
                        onClick={onTrackAnother}
                        className="flex-1 bg-[#14b8a6] hover:bg-[#0d9488] text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Track Another Patient
                    </button>

                    <button
                        onClick={onReturnToDashboard}
                        className="flex-1 bg-[#020408] border border-[#1e293b] text-[#f8fafc] px-6 py-3 rounded-lg font-medium hover:border-[#14b8a6] transition-colors flex items-center justify-center gap-2"
                    >
                        <Home className="w-4 h-4" />
                        Return to Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
};
