import React, { useState } from 'react';
import { Download, FileText, Shield, FlaskConical, Loader2, CheckCircle } from 'lucide-react';
import { downloadReport, generateReport, PatientReportData, ReportType } from '../../services/reportGenerator';

/**
 * ExportButton — One-Click Audit Report Export
 * WO-077: Exportable Audit Reports
 *
 * Wires directly to reportGenerator.ts to produce real downloadable text reports.
 * Three report types: Audit (compliance), Insurance (billing), Research (de-identified).
 */

interface ExportButtonProps {
    patientId: string;
    reportData?: PatientReportData;
    reportType: ReportType;
    label?: string;
    disabled?: boolean;
    className?: string;
}

const REPORT_CONFIG: Record<ReportType, { icon: React.ElementType; label: string; description: string }> = {
    audit: {
        icon: Shield,
        label: 'Audit Report',
        description: 'Compliance & malpractice defense',
    },
    insurance: {
        icon: FileText,
        label: 'Insurance Report',
        description: 'Billing & medical necessity',
    },
    research: {
        icon: FlaskConical,
        label: 'Research Export',
        description: 'De-identified (HIPAA Safe Harbor)',
    },
};

export const ExportButton: React.FC<ExportButtonProps> = ({
    patientId,
    reportData,
    reportType,
    label,
    disabled = false,
    className = '',
}) => {
    const [status, setStatus] = useState<'idle' | 'exporting' | 'done' | 'error'>('idle');
    const config = REPORT_CONFIG[reportType];
    const Icon = config.icon;

    const handleExport = async () => {
        if (status === 'exporting') return;
        setStatus('exporting');

        try {
            const data: PatientReportData = reportData ?? { patientId };
            // Simulate brief async (future: fetch live data from Supabase here)
            await new Promise(resolve => setTimeout(resolve, 300));
            downloadReport(data, reportType);
            setStatus('done');
            setTimeout(() => setStatus('idle'), 3000);
        } catch (err) {
            console.error('Export failed:', err);
            setStatus('error');
            setTimeout(() => setStatus('idle'), 3000);
        }
    };

    const buttonLabel =
        status === 'exporting' ? 'Exporting...' :
            status === 'done' ? '[STATUS: PASS] Exported' :
                status === 'error' ? '[STATUS: FAIL] Retry' :
                    (label ?? config.label);

    return (
        <button
            type="button"
            onClick={handleExport}
            disabled={disabled || status === 'exporting'}
            aria-label={`Export ${config.label} for patient ${patientId}`}
            aria-busy={status === 'exporting'}
            className={`
        flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest
        transition-all border focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed active:scale-95
        ${status === 'done'
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : status === 'error'
                        ? 'bg-red-500/10 border-red-500/30 text-red-400'
                        : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:border-slate-600 hover:bg-slate-800'
                }
        ${className}
      `}
        >
            {status === 'exporting'
                ? <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
                : status === 'done'
                    ? <CheckCircle className="w-3.5 h-3.5" aria-hidden="true" />
                    : <Icon className="w-3.5 h-3.5" aria-hidden="true" />
            }
            <span>{buttonLabel}</span>
        </button>
    );
};

/**
 * ExportButtonGroup — All three report types in one row
 * Drop this anywhere a patient context is available.
 */
interface ExportButtonGroupProps {
    patientId: string;
    reportData?: PatientReportData;
    className?: string;
}

export const ExportButtonGroup: React.FC<ExportButtonGroupProps> = ({
    patientId,
    reportData,
    className = '',
}) => {
    return (
        <div className={`flex flex-wrap gap-2 ${className}`} role="group" aria-label="Export patient reports">
            <ExportButton patientId={patientId} reportData={reportData} reportType="audit" />
            <ExportButton patientId={patientId} reportData={reportData} reportType="insurance" />
            <ExportButton patientId={patientId} reportData={reportData} reportType="research" />
        </div>
    );
};

export default ExportButton;
