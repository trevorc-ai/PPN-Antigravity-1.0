import React, { useState } from 'react';
import { Download, FileText, ChevronDown } from 'lucide-react';
import { PatientReportData, ReportType, downloadReport } from '../../services/reportGenerator';

interface ExportReportButtonProps {
    data: PatientReportData;
    className?: string;
}

const REPORT_TYPES: { id: ReportType; label: string; description: string; icon: string }[] = [
    {
        id: 'audit',
        label: 'Audit Report',
        description: 'Full compliance documentation with timestamps',
        icon: '🔍',
    },
    {
        id: 'insurance',
        label: 'Insurance Report',
        description: 'Billing summary with outcomes',
        icon: '📋',
    },
    {
        id: 'research',
        label: 'Research Export',
        description: 'De-identified (HIPAA Safe Harbor)',
        icon: '🔬',
    },
];

export const ExportReportButton: React.FC<ExportReportButtonProps> = ({ data, className = '' }) => {
    const [open, setOpen] = useState(false);
    const [downloading, setDownloading] = useState<ReportType | null>(null);

    const handleDownload = async (type: ReportType) => {
        setDownloading(type);
        setOpen(false);
        // Small delay to show loading state
        await new Promise((r) => setTimeout(r, 300));
        downloadReport(data, type);
        setDownloading(null);
    };

    return (
        <div className={`relative ${className}`}>
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 px-4 py-2.5 bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700 hover:border-slate-600 rounded-xl text-sm font-bold text-slate-300 transition-all"
                aria-expanded={open}
                aria-haspopup="listbox"
            >
                {downloading ? (
                    <>
                        <div className="w-4 h-4 border-2 border-slate-500 border-t-slate-300 rounded-full animate-spin" />
                        <span>Generating...</span>
                    </>
                ) : (
                    <>
                        <Download className="w-4 h-4" />
                        <span>Export Report</span>
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
                    </>
                )}
            </button>

            {open && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setOpen(false)}
                        aria-hidden="true"
                    />

                    {/* Dropdown */}
                    <div
                        className="absolute right-0 top-full mt-2 w-72 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl z-20 overflow-hidden animate-in slide-in-from-top-2 duration-150"
                        role="listbox"
                        aria-label="Report type"
                    >
                        {REPORT_TYPES.map((type) => (
                            <button
                                key={type.id}
                                onClick={() => handleDownload(type.id)}
                                role="option"
                                className="w-full flex items-start gap-3 px-4 py-3.5 hover:bg-slate-800/60 transition-colors text-left border-b border-slate-800 last:border-0"
                            >
                                <span className="text-xl flex-shrink-0 mt-0.5">{type.icon}</span>
                                <div>
                                    <div className="text-sm font-bold text-slate-300">{type.label}</div>
                                    <div className="text-xs text-slate-500 mt-0.5">{type.description}</div>
                                </div>
                                <FileText className="w-4 h-4 text-slate-600 flex-shrink-0 ml-auto mt-1" />
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default ExportReportButton;
