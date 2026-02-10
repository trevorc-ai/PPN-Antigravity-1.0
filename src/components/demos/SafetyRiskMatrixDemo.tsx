import React from 'react';

// Simplified Safety Risk Matrix Demo for Landing Page
// Mirrors the actual SafetySurveillancePage component structure

const SafetyRiskMatrixDemo: React.FC = () => {
    // Demo data matching actual severity grades
    const severityGrades = ['G1\nMild', 'G2\nModerate', 'G3\nSevere', 'G4\nLife-\nThreat', 'G5\nDeath'];
    const frequencyLevels = ['Very Common\n(>10%)', 'Common\n(1-10%)', 'Uncommon\n(0.1-1%)', 'Rare\n(0.01-0.1%)', 'Very Rare\n(<0.01%)'];

    // Heatmap data: [frequency][severity] = count
    const heatmapData = [
        [145, 82, 18, 4, 0],  // Very Common
        [92, 26, 6, 1, 0],    // Common
        [12, 8, 2, 0, 0],     // Uncommon
        [7, 3, 1, 0, 0],      // Rare
        [0, 0, 0, 0, 0]       // Very Rare
    ];

    const getCellColor = (freq: number, sev: number) => {
        const count = heatmapData[freq][sev];
        if (count === 0) return 'bg-slate-900/40 border-slate-800/50';

        // Dramatic, vibrant colors for visual impact
        if (sev <= 1) {
            // Mild/Moderate - Bright emerald/teal
            return count > 50
                ? 'bg-emerald-500/60 border-emerald-400/80'
                : 'bg-emerald-500/40 border-emerald-400/60';
        }
        if (sev === 2) {
            // Severe - Vibrant amber/orange
            return count > 10
                ? 'bg-amber-500/60 border-amber-400/80'
                : 'bg-amber-500/40 border-amber-400/60';
        }
        // Life-threatening/Death - Bold red/crimson
        return count > 0
            ? 'bg-red-500/60 border-red-400/80'
            : 'bg-red-500/40 border-red-400/60';
    };

    const getCellTextColor = (freq: number, sev: number) => {
        const count = heatmapData[freq][sev];
        if (count === 0) return 'text-slate-600';
        if (sev <= 1) return 'text-emerald-100 font-black'; // Brighter text
        if (sev === 2) return 'text-amber-100 font-black';
        return 'text-red-100 font-black';
    };

    return (
        <div className="w-full space-y-6">
            {/* Top Metrics */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Risk Index</p>
                    <p className="text-3xl font-black text-emerald-400">0.4%</p>
                    <p className="text-sm text-slate-600 font-medium mt-1">Current Low Risk</p>
                </div>
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Serious Events</p>
                    <p className="text-3xl font-black text-slate-400">0</p>
                    <p className="text-sm text-slate-600 font-medium mt-1">No G4/G5 Events</p>
                </div>
            </div>

            {/* Heatmap */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Frequency × Severity Matrix</p>

                <div className="overflow-x-auto">
                    <div className="inline-block min-w-full">
                        {/* Header Row */}
                        <div className="flex items-center mb-2">
                            <div className="w-24 shrink-0"></div>
                            {severityGrades.map((grade, i) => (
                                <div key={i} className="flex-1 min-w-[60px] text-center">
                                    <p className="text-sm font-black text-slate-500 uppercase tracking-wider whitespace-pre-line leading-tight">
                                        {grade}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Data Rows */}
                        {frequencyLevels.map((freq, freqIdx) => (
                            <div key={freqIdx} className="flex items-center mb-1">
                                <div className="w-24 shrink-0 pr-2">
                                    <p className="text-sm font-black text-slate-500 uppercase tracking-wider text-right whitespace-pre-line leading-tight">
                                        {freq}
                                    </p>
                                </div>
                                {severityGrades.map((_, sevIdx) => {
                                    const count = heatmapData[freqIdx][sevIdx];
                                    return (
                                        <div key={sevIdx} className="flex-1 min-w-[60px] px-1">
                                            <div className={`aspect-square rounded-lg border ${getCellColor(freqIdx, sevIdx)} flex items-center justify-center transition-all hover:scale-105`}>
                                                {count > 0 && (
                                                    <span className={`text-sm font-black ${getCellTextColor(freqIdx, sevIdx)}`}>
                                                        {count}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Legend */}
                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-800/50">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-emerald-500/50 border border-emerald-400/70"></div>
                        <span className="text-sm font-bold text-slate-500 uppercase">Mild/Moderate</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-amber-500/50 border border-amber-400/70"></div>
                        <span className="text-sm font-bold text-slate-500 uppercase">Severe</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-red-500/50 border border-red-400/70"></div>
                        <span className="text-sm font-bold text-slate-500 uppercase">Critical</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SafetyRiskMatrixDemo;
