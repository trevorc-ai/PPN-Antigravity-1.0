import React from 'react';

// ─── WO-666: FormatBadge — shared component extracted from DownloadCenter,
//     SessionExportCenter, and DataExport. Replaces inline format badge JSX
//     across all three files. Visual contract preserved exactly.

interface FormatBadgeProps {
    format: 'pdf' | 'csv' | 'zip' | 'json' | 'txt';
    /** 'xs' = card footer size (default). 'sm' = slightly larger label. */
    size?: 'sm' | 'xs';
}

const FORMAT_STYLES: Record<FormatBadgeProps['format'], string> = {
    pdf: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    csv: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    json: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    zip: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    txt: 'text-slate-400 bg-slate-500/10 border-slate-500/20',
};

export const FormatBadge: React.FC<FormatBadgeProps> = ({ format, size = 'xs' }) => {
    const sizeClass = size === 'sm'
        ? 'text-sm px-2.5 py-1'
        : 'text-sm px-2 py-0.5'; // Rule 2: text-sm minimum; never bare text-xs
    return (
        <span
            className={`font-black uppercase tracking-widest rounded border ${sizeClass} ${FORMAT_STYLES[format]}`}
        >
            {format}
        </span>
    );
};

export default FormatBadge;
