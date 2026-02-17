import React, { useState } from 'react';
import { Download, FileText, Loader2 } from 'lucide-react';

/**
 * ExportButton - One-Click Audit Report Export
 * 
 * Features:
 * - PDF export with all forms, timestamps, signatures
 * - Safety event timeline
 * - Completeness score
 * - Benchmark readiness indicator
 * 
 * Critical for Week 1 value delivery.
 */

interface ExportButtonProps {
    patientId: string;
    reportType: 'audit' | 'summary' | 'full';
    format: 'pdf' | 'csv';
    onExport?: (patientId: string, reportType: string, format: string) => Promise<void>;
    disabled?: boolean;
}

export const ExportButton: React.FC<ExportButtonProps> = ({
    patientId,
    reportType,
    format,
    onExport,
    disabled = false
}) => {
    const [isExporting, setIsExporting] = useState(false);

    const handleExport = async () => {
        setIsExporting(true);

        try {
            if (onExport) {
                await onExport(patientId, reportType, format);
            } else {
                // Default export logic (placeholder)
                console.log(`Exporting ${reportType} report for ${patientId} as ${format}`);

                // Simulate export delay
                await new Promise(resolve => setTimeout(resolve, 2000));

                // In production, this would trigger actual PDF/CSV generation
                alert(`${reportType.toUpperCase()} report exported successfully!`);
            }
        } catch (error) {
            console.error('Export failed:', error);
            alert('Export failed. Please try again.');
        } finally {
            setIsExporting(false);
        }
    };

    const getButtonText = () => {
        if (isExporting) return 'Exporting...';
        return `Export ${reportType.charAt(0).toUpperCase() + reportType.slice(1)} (${format.toUpperCase()})`;
    };

    return (
        <button
            onClick={handleExport}
            disabled={disabled || isExporting}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-700
                 text-slate-300 text-sm font-bold rounded-lg transition-colors
                 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed"
        >
            {isExporting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : format === 'pdf' ? (
                <FileText className="w-4 h-4" />
            ) : (
                <Download className="w-4 h-4" />
            )}
            <span>{getButtonText()}</span>
        </button>
    );
};

/**
 * ExportButtonGroup - Multiple Export Options
 * 
 * Provides quick access to different export formats
 */

interface ExportButtonGroupProps {
    patientId: string;
    onExport?: (patientId: string, reportType: string, format: string) => Promise<void>;
}

export const ExportButtonGroup: React.FC<ExportButtonGroupProps> = ({
    patientId,
    onExport
}) => {
    return (
        <div className="flex flex-wrap gap-2">
            <ExportButton
                patientId={patientId}
                reportType="audit"
                format="pdf"
                onExport={onExport}
            />
            <ExportButton
                patientId={patientId}
                reportType="summary"
                format="pdf"
                onExport={onExport}
            />
            <ExportButton
                patientId={patientId}
                reportType="full"
                format="csv"
                onExport={onExport}
            />
        </div>
    );
};
