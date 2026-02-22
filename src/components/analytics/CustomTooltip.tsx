import React from 'react';

interface CustomTooltipProps {
    active?: boolean;
    payload?: any[];
    label?: string | number;
    clinicalContext?: string;
    valuePrefix?: string;
    valueSuffix?: string;
}

export const CustomTooltip: React.FC<CustomTooltipProps> = ({
    active,
    payload,
    label,
    clinicalContext,
    valuePrefix = '',
    valueSuffix = ''
}) => {
    if (!active || !payload || !payload.length) return null;

    return (
        <div className="bg-slate-900 border border-slate-700/80 shadow-2xl rounded-lg p-4 min-w-[200px]" role="tooltip">
            {label && <p className="text-slate-100 font-bold mb-3 border-b border-slate-700/50 pb-2 text-sm">{label}</p>}

            <div className="space-y-2">
                {payload.map((entry, index) => (
                    <div key={index} className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <div
                                className="w-2.5 h-2.5 rounded-full"
                                style={{ backgroundColor: entry.color || entry.stroke || entry.fill || '#6366f1' }}
                            />
                            <span className="text-slate-300 text-sm font-medium">
                                {entry.name || entry.dataKey}
                            </span>
                        </div>
                        <strong className="text-slate-100 font-bold">
                            {valuePrefix}{entry.value}{valueSuffix}
                        </strong>
                    </div>
                ))}
            </div>

            {clinicalContext && (
                <div className="mt-3 pt-3 border-t border-slate-700/50">
                    <p className="text-slate-400 text-xs leading-relaxed italic border-l-2 border-indigo-500/50 pl-2">
                        {clinicalContext}
                    </p>
                </div>
            )}
        </div>
    );
};
