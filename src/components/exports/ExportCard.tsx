import React from 'react';
import { Download, Loader2, CheckCircle } from 'lucide-react';
import { FormatBadge } from './FormatBadge';
import { AdvancedTooltip } from '../ui/AdvancedTooltip';

// ─── WO-666: ExportCard — shared component extracted from
//     DownloadCenter.tsx (lines 235–301) and SessionExportCenter.tsx (lines 500–581).
//     Visual contract preserved exactly. Zero style changes per WO spec.

interface ExportCardProps {
    id: string;
    title: string;
    description: string;
    icon: React.ElementType;
    format: 'pdf' | 'csv' | 'zip' | 'json' | 'txt';
    badge?: string;
    accentColor: string;
    bgColor: string;
    borderColor: string;
    textColor: string;
    /** Optional includes list — shown in SessionExportCenter, hidden by default */
    includes?: string[];
    /** Optional subtitle — shown in SessionExportCenter cards */
    subtitle?: string;
    actionType: 'route' | 'function' | 'new-tab' | 'download';
    /** Defaults to 'Download' or 'Open Tool' based on actionType */
    actionLabel?: string;
    onAction: () => void;
    isDownloading?: boolean;
    isDone?: boolean;
    isDisabled?: boolean;
}

export const ExportCard: React.FC<ExportCardProps> = ({
    id,
    title,
    description,
    icon: Icon,
    format,
    badge,
    accentColor,
    bgColor,
    borderColor,
    textColor,
    includes,
    subtitle,
    actionType,
    actionLabel,
    onAction,
    isDownloading = false,
    isDone = false,
    isDisabled = false,
}) => {
    const defaultActionLabel = actionType === 'route' ? 'Open Tool' : 'Download';
    const buttonLabel = actionLabel ?? defaultActionLabel;
    const tooltipContent = isDone
        ? 'Completed!'
        : actionType === 'route'
            ? 'Go to Generator'
            : `Download ${format.toUpperCase()}`;

    return (
        <div
            className={`relative bg-slate-900/60 backdrop-blur-xl border rounded-3xl p-6 transition-all group flex flex-col h-full
                ${isDone ? 'border-emerald-500/40' : borderColor}
                ${isDisabled ? 'opacity-50' : 'hover:bg-slate-900/80 hover:border-slate-600'}
            `}
        >
            {/* Badge */}
            {badge && (
                <div className={`absolute top-4 right-4 px-2.5 py-1 rounded-lg text-sm font-black uppercase tracking-widest ${bgColor} ${textColor} border ${borderColor}`}>
                    {badge}
                </div>
            )}

            {/* Header */}
            <div className="flex items-start gap-4 mb-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${bgColor} border ${borderColor}`}>
                    <Icon className={`w-6 h-6 ${accentColor}`} />
                </div>
                <div className="flex-1 pr-16">
                    <h3 className="text-base font-black text-[#A8B5D1] leading-tight mb-1">{title}</h3>
                    {subtitle && (
                        <p className={`text-sm font-bold uppercase tracking-widest ${textColor} mt-0.5`}>{subtitle}</p>
                    )}
                </div>
            </div>

            {/* Description */}
            <p className="text-sm text-slate-400 mb-5 flex-1 leading-relaxed">{description}</p>

            {/* Optional includes list (SessionExportCenter pattern) */}
            {includes && includes.length > 0 && (
                <div className="space-y-1.5 mb-5">
                    {includes.map((item, i) => (
                        <div key={i} className="flex items-start gap-2">
                            <span className={`text-sm shrink-0 mt-0.5 ${accentColor}`}>›</span>
                            <span className="text-sm text-slate-400">{item}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* Footer: Format badge + action button */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800/80 mt-auto">
                <FormatBadge format={format} />

                <AdvancedTooltip content={tooltipContent} tier="micro">
                    <button
                        onClick={onAction}
                        disabled={isDisabled || isDownloading}
                        aria-label={`${buttonLabel} ${title}`}
                        aria-busy={isDownloading}
                        className={`
                            flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-black uppercase tracking-wider
                            transition-all border focus:outline-none focus:ring-2 focus:ring-indigo-500
                            active:scale-95 disabled:cursor-not-allowed
                            ${isDone
                                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                                : `bg-slate-800 border-slate-700 text-slate-300 hover:text-white hover:border-slate-500`
                            }
                        `}
                    >
                        {isDownloading ? (
                            <><Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" /><span>Fetching</span></>
                        ) : isDone ? (
                            <><CheckCircle className="w-4 h-4" aria-hidden="true" /><span>Done</span></>
                        ) : actionType === 'route' ? (
                            <span>Open Tool</span>
                        ) : (
                            <><Download className="w-3.5 h-3.5" aria-hidden="true" /><span>{buttonLabel}</span></>
                        )}
                    </button>
                </AdvancedTooltip>
            </div>
        </div>
    );
};

export default ExportCard;
