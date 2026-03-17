/**
 * SymptomMoodHeatmap — Phase 3 Integration Compass Dashboard
 * 
 * Day-by-day color-coded severity grid:
 * Rows: Mood Elevation, Sleep Quality, Depressive Symptoms, Anxiety Level
 * Columns: Day 1 → Day 30 (or up to 90 days, paginated)
 * Color scale: light blue (improvement/low severity) → dark blue (high severity)
 * 
 * Matches the "SYMPTOM & MOOD SEVERITY HEATMAP" shown in the Integration Compass spec.
 * Uses deterministic dummy data until live PROM feed is wired.
 */
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// ─── Dummy PROM data ──────────────────────────────────────────────────────────
// Severity scale 1–10 (1 = improvement/best, 10 = highest severity)
// For Mood Elevation, 1 = elevated/good mood; for others, 1 = minimal symptom

function seedRand(seed: number) {
    let s = seed;
    return () => {
        s = (s * 16807) % 2147483647;
        return (s - 1) / 2147483646;
    };
}

interface HeatmapRow {
    label: string;
    key: string;
    values: (number | null)[]; // 1–10 or null (missing/not submitted)
}

function generateDummyHeatmap(days = 90): HeatmapRow[] {
    const rand = seedRand(77);
    const makeRow = (label: string, key: string, startHigh: boolean) => ({
        label,
        key,
        values: Array.from({ length: days }, (_, i) => {
            const submitted = rand() > 0.14; // ~86% adherence
            if (!submitted) return null;
            const t = i / (days - 1);
            const trend = startHigh ? 10 - t * 7 : 1 + t * 0.5; // decay vs stable-good
            const noise = (rand() - 0.5) * 2.5;
            return Math.min(10, Math.max(1, Math.round(trend + noise)));
        }),
    });

    return [
        makeRow('Mood Elevation', 'mood', false),       // starts low severity (good mood)
        makeRow('Sleep Quality',  'sleep', false),       // starts moderate, improves
        makeRow('Depressive Symptoms', 'depression', true), // starts high, decays
        makeRow('Anxiety Level',  'anxiety', true),     // starts high, decays
    ];
}

const DUMMY_DATA = generateDummyHeatmap(90);

// ─── Color scale ──────────────────────────────────────────────────────────────
// 1 = lightest blue (improvement), 10 = darkest navy (high severity)
// Matches spec gradient: "Improvement (1) ←→ High Severity (10)"

function severityColor(val: number | null): string {
    if (val === null) return 'rgba(30,45,69,0.3)'; // missing = very dim
    // 1 = light blue (#93c5fd), 10 = dark navy (#1e3a5f)
    const stops: [number, number, number][] = [
        [147, 197, 253],  // 1: sky-300
        [96,  165, 250],  // 2
        [59,  130, 246],  // 3: blue-500
        [37,  99,  235],  // 4: blue-600
        [29,  78,  216],  // 5: blue-700
        [30,  58,  138],  // 6: blue-900
        [23,  37,  84],   // 7: indigo-950
        [22,  30,  64],   // 8
        [20,  24,  55],   // 9
        [15,  18,  45],   // 10
    ];
    const idx = Math.max(0, Math.min(9, Math.round(val) - 1));
    const [r, g, b] = stops[idx];
    return `rgb(${r},${g},${b})`;
}

// ─── Component ────────────────────────────────────────────────────────────────

const DAYS_PER_PAGE = 30;

interface TooltipInfo { row: string; day: number; value: number | null; x: number; y: number; }

interface SymptomMoodHeatmapProps {
    data?: HeatmapRow[];
    totalDays?: number;
}

const SymptomMoodHeatmap: React.FC<SymptomMoodHeatmapProps> = ({
    data = DUMMY_DATA,
    totalDays = 90,
}) => {
    const [page, setPage] = useState(0);
    const [tooltip, setTooltip] = useState<TooltipInfo | null>(null);

    const totalPages = Math.ceil(totalDays / DAYS_PER_PAGE);
    const dayOffset = page * DAYS_PER_PAGE;
    const daysOnPage = Math.min(DAYS_PER_PAGE, totalDays - dayOffset);
    const dayIndices = Array.from({ length: daysOnPage }, (_, i) => dayOffset + i);

    // Column width in % of available chart area
    const LABEL_WIDTH = 144; // px, fixed
    const CELL_H = 32;
    const CELL_GAP = 2;
    const ROW_GAP = 6;

    return (
        <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-5">
                <div>
                    <div className="text-xs font-black uppercase tracking-widest text-slate-500 mb-1">Phase 3 Integration</div>
                    <h3 className="text-slate-100 font-black text-lg">Symptom & Mood Severity Heatmap</h3>
                    <p className="text-slate-400 text-sm mt-0.5">
                        Daily patient-reported outcomes — color shows severity level, day by day
                    </p>
                </div>

                {/* Color legend */}
                <div className="flex flex-col items-end gap-1.5">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span className="font-bold">Improvement (1)</span>
                        <div className="flex">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(v => (
                                <div
                                    key={v}
                                    className="w-4 h-3.5"
                                    style={{ backgroundColor: severityColor(v) }}
                                />
                            ))}
                        </div>
                        <span className="font-bold">High Severity (10)</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-600 mt-0.5">
                        <div className="w-4 h-3.5 rounded-sm" style={{ backgroundColor: severityColor(null) }} />
                        <span>No check-in</span>
                    </div>
                </div>
            </div>

            {/* Heatmap grid */}
            <div className="relative overflow-hidden">
                {/* Sticky row labels + grid */}
                <div className="flex gap-0" style={{ position: 'relative' }}>
                    {/* Row labels */}
                    <div style={{ minWidth: LABEL_WIDTH, flexShrink: 0 }}>
                        {/* Empty header above labels */}
                        <div style={{ height: 24 }} />
                        {data.map((row, ri) => (
                            <div
                                key={row.key}
                                className="flex items-center"
                                style={{ height: CELL_H, marginBottom: ri < data.length - 1 ? ROW_GAP : 0 }}
                            >
                                <span className="text-xs font-bold text-slate-400 truncate pr-3">
                                    {row.label}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Day columns */}
                    <div className="flex-1 overflow-hidden">
                        {/* Day labels */}
                        <div className="flex mb-1" style={{ height: 24, gap: CELL_GAP }}>
                            {dayIndices.map(di => {
                                const dayNum = di + 1;
                                const showLabel = daysOnPage <= 30
                                    ? (dayNum === 1 || dayNum % 5 === 0 || dayNum === totalDays)
                                    : (dayNum % 10 === 0);
                                return (
                                    <div
                                        key={di}
                                        className="flex-1 flex items-end justify-center"
                                        style={{ minWidth: 0 }}
                                    >
                                        {showLabel && (
                                            <span className="text-[9px] text-slate-500 font-bold leading-none">
                                                D{dayNum}
                                            </span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Heatmap cells */}
                        {data.map((row, ri) => (
                            <div
                                key={row.key}
                                className="flex"
                                style={{ height: CELL_H, marginBottom: ri < data.length - 1 ? ROW_GAP : 0, gap: CELL_GAP }}
                            >
                                {dayIndices.map((di, ci) => {
                                    const val = row.values[di] ?? null;
                                    const bg = severityColor(val);
                                    return (
                                        <div
                                            key={di}
                                            className="flex-1 rounded-sm transition-opacity"
                                            style={{
                                                minWidth: 0,
                                                backgroundColor: bg,
                                                cursor: 'pointer',
                                                opacity: tooltip && tooltip.day !== di + 1 ? 0.7 : 1,
                                            }}
                                            onMouseEnter={e => {
                                                const rect = (e.target as HTMLElement).getBoundingClientRect();
                                                setTooltip({ row: row.label, day: di + 1, value: val, x: rect.x, y: rect.y });
                                            }}
                                            onMouseLeave={() => setTooltip(null)}
                                            aria-label={`${row.label} Day ${di + 1}: ${val !== null ? `severity ${val}/10` : 'no data'}`}
                                        />
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tooltip */}
                {tooltip && (
                    <div
                        className="fixed pointer-events-none bg-[#0c1929] border border-slate-700/60 rounded-xl p-3 shadow-2xl text-xs z-50"
                        style={{ left: tooltip.x, top: tooltip.y - 80, transform: 'translateX(-50%)' }}
                        role="tooltip"
                    >
                        <div className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-1">
                            {tooltip.row} · Day {tooltip.day}
                        </div>
                        {tooltip.value !== null ? (
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: severityColor(tooltip.value) }} />
                                <span className="text-slate-200 font-black">{tooltip.value}</span>
                                <span className="text-slate-500">/ 10</span>
                                <span className="text-slate-400 ml-1">
                                    {tooltip.value <= 3 ? '— Low' : tooltip.value <= 6 ? '— Moderate' : '— High'}
                                </span>
                            </div>
                        ) : (
                            <span className="text-slate-600 italic">No check-in recorded</span>
                        )}
                    </div>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-800">
                    <button
                        onClick={() => setPage(p => Math.max(0, p - 1))}
                        disabled={page === 0}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/60 border border-slate-700/50 rounded-xl text-xs font-bold text-slate-400 hover:text-slate-300 disabled:opacity-30 transition-all"
                        aria-label="Previous 30 days"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Prev 30 days
                    </button>
                    <span className="text-xs text-slate-500 font-bold">
                        Days {dayOffset + 1}–{dayOffset + daysOnPage} of {totalDays}
                    </span>
                    <button
                        onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                        disabled={page === totalPages - 1}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/60 border border-slate-700/50 rounded-xl text-xs font-bold text-slate-400 hover:text-slate-300 disabled:opacity-30 transition-all"
                        aria-label="Next 30 days"
                    >
                        Next 30 days
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            )}

            <p className="text-slate-600 text-xs mt-3 italic">
                * Showing generated preview data — heatmap populates as daily Pulse Check submissions arrive.
                Interactive — hover any cell for day detail.
            </p>
        </div>
    );
};

export default SymptomMoodHeatmap;
