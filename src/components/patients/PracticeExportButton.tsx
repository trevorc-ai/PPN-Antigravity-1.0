/**
 * PracticeExportButton.tsx — WO-677
 *
 * Self-contained export button for the practitioner's patient panel.
 * Triggers .xlsx download (2-sheet workbook) or .csv download (refresh only).
 *
 * Zero PHI: passes only de-identified ExportRow data to the builder.
 */

import React, { useState } from 'react';
import { Download, Loader2, CheckCircle, FileText } from 'lucide-react';
import {
    buildPracticeExportXlsx,
    buildPracticeExportCsv,
    triggerDownload,
    type ExportRow,
} from '../../utils/practiceExportBuilder';

// ── Types ─────────────────────────────────────────────────────────────────────

interface PracticeExportButtonProps {
    patients: ExportRow[];
    disabled?: boolean;
}

type ButtonState = 'idle' | 'loading' | 'done' | 'error';

// ── Component ─────────────────────────────────────────────────────────────────

export const PracticeExportButton: React.FC<PracticeExportButtonProps> = ({
    patients,
    disabled = false,
}) => {
    const [xlsxState, setXlsxState] = useState<ButtonState>('idle');
    const [csvState, setCsvState] = useState<ButtonState>('idle');

    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    const handleXlsxDownload = async () => {
        if (xlsxState !== 'idle' || disabled || patients.length === 0) return;
        setXlsxState('loading');
        try {
            const blob = buildPracticeExportXlsx(patients);
            triggerDownload(blob, `PPN_Practice_Export_${today}.xlsx`);
            setXlsxState('done');
            setTimeout(() => setXlsxState('idle'), 2500);
        } catch {
            setXlsxState('error');
            setTimeout(() => setXlsxState('idle'), 3000);
        }
    };

    const handleCsvDownload = async () => {
        if (csvState !== 'idle' || disabled || patients.length === 0) return;
        setCsvState('loading');
        try {
            const blob = buildPracticeExportCsv(patients);
            triggerDownload(blob, `PPN_Data_Refresh_${today}.csv`);
            setCsvState('done');
            setTimeout(() => setCsvState('idle'), 2500);
        } catch {
            setCsvState('error');
            setTimeout(() => setCsvState('idle'), 3000);
        }
    };

    const isEmpty = patients.length === 0;
    const isDisabled = disabled || isEmpty;

    return (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            {/* Primary — XLSX download */}
            <div className="relative group">
                <button
                    id="practice-export-xlsx-btn"
                    type="button"
                    onClick={handleXlsxDownload}
                    disabled={isDisabled || xlsxState === 'loading'}
                    aria-label="Download Practice Export as Excel workbook"
                    className={`
                        flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold
                        border transition-all duration-200 active:scale-[0.98] min-h-[44px]
                        ${isDisabled
                            ? 'bg-slate-800/30 border-slate-700/30 text-slate-600 cursor-not-allowed'
                            : xlsxState === 'done'
                                ? 'bg-teal-600/20 border-teal-500/40 text-teal-300'
                                : xlsxState === 'error'
                                    ? 'bg-red-500/10 border-red-500/30 text-red-400'
                                    : 'bg-indigo-700/30 hover:bg-indigo-600/40 border-indigo-500/40 hover:border-indigo-400/60 text-indigo-200 hover:text-white'
                        }
                    `}
                >
                    {xlsxState === 'loading' ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : xlsxState === 'done' ? (
                        <CheckCircle className="w-4 h-4" />
                    ) : (
                        <Download className="w-4 h-4" />
                    )}
                    {xlsxState === 'done' ? 'Downloaded!' : xlsxState === 'error' ? 'Error — retry' : 'Download Practice Export'}
                </button>

                {/* Tooltip */}
                {!isDisabled && xlsxState === 'idle' && (
                    <div
                        role="tooltip"
                        className="
                            absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-10
                            px-3 py-2 rounded-lg bg-slate-800 border border-slate-600/50
                            text-xs text-slate-300 whitespace-nowrap shadow-xl
                            opacity-0 group-hover:opacity-100 pointer-events-none
                            transition-opacity duration-200
                        "
                    >
                        Your de-identified patient panel. Add names and contacts in Sheet 2 — stays on your device.
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
                    </div>
                )}
            </div>

            {/* Secondary — CSV refresh */}
            <button
                id="practice-export-csv-btn"
                type="button"
                onClick={handleCsvDownload}
                disabled={isDisabled || csvState === 'loading'}
                aria-label="Download Refresh CSV — Sheet 1 data only, for pasting into an existing workbook"
                title="Refresh PPN Data (CSV) — paste into existing workbook to update Sheet 1"
                className={`
                    flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold
                    border transition-all duration-200 active:scale-[0.98] min-h-[44px]
                    ${isDisabled
                        ? 'bg-slate-800/20 border-slate-700/20 text-slate-700 cursor-not-allowed'
                        : csvState === 'done'
                            ? 'bg-teal-600/10 border-teal-500/30 text-teal-400'
                            : 'bg-slate-800/40 hover:bg-slate-700/50 border-slate-700/40 hover:border-slate-600/60 text-slate-400 hover:text-slate-200'
                    }
                `}
            >
                {csvState === 'loading' ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : csvState === 'done' ? (
                    <CheckCircle className="w-4 h-4" />
                ) : (
                    <FileText className="w-4 h-4" />
                )}
                {csvState === 'done' ? 'Downloaded!' : 'Refresh CSV'}
            </button>

            {/* Count label */}
            {!isEmpty && (
                <span className="ppn-meta text-slate-500 self-center hidden sm:inline">
                    {patients.length} patient{patients.length !== 1 ? 's' : ''}
                </span>
            )}
            {isEmpty && (
                <span className="ppn-meta text-slate-600 self-center hidden sm:inline">
                    No patients to export
                </span>
            )}
        </div>
    );
};

export default PracticeExportButton;
