/**
 * PulseCheckTrendChart
 * 90-day trend of Pulse Check submissions: connection, sleep, overall mood.
 * Plain-English legend. Gaps shown for missed days.
 * Uses dummy data until live Pulse Check submissions are wired.
 */
import React, { useState, useRef, useCallback } from 'react';
import { Heart, Moon, TrendingUp, CircleDot } from 'lucide-react';

// ─── Dummy data ───────────────────────────────────────────────────────────────

function seedRand(seed: number) {
    let s = seed;
    return () => {
        s = (s * 16807) % 2147483647;
        return (s - 1) / 2147483646;
    };
}

interface PulsePoint {
    day: number;
    connection: number; // 1-5
    sleep: number;      // 1-5
    mood: number;       // computed avg
    submitted: boolean;
}

function generateDummyPulse(): PulsePoint[] {
    const rand = seedRand(99);
    return Array.from({ length: 90 }, (_, i) => {
        const day = i + 1;
        const t = i / 89;
        // ~85% adherence, skipping some days
        const submitted = rand() > 0.15;
        const noise = () => (rand() - 0.5) * 1.2;
        const connection = Math.min(5, Math.max(1, parseFloat((1.5 + t * 3 + noise()).toFixed(1))));
        const sleep = Math.min(5, Math.max(1, parseFloat((2 + t * 2.5 + noise()).toFixed(1))));
        const mood = parseFloat(((connection + sleep) / 2).toFixed(1));
        return { day, connection, sleep, mood, submitted };
    });
}

const DUMMY = generateDummyPulse();

// ─── Chart config ─────────────────────────────────────────────────────────────

const W = 700; const H = 200;
const PAD = { t: 14, r: 20, b: 36, l: 36 };
const cW = W - PAD.l - PAD.r;
const cH = H - PAD.t - PAD.b;

const toX = (day: number) => ((day - 1) / 89) * cW;
const toY = (v: number) => cH - ((v - 1) / 4) * cH;

function buildSegments(pts: PulsePoint[], key: 'connection' | 'sleep' | 'mood'): string[] {
    // Break path at gaps (missed days) — returns array of SVG path strings
    const segments: string[] = [];
    let current = '';
    pts.forEach((p, i) => {
        if (!p.submitted) {
            if (current) { segments.push(current); current = ''; }
            return;
        }
        const x = toX(p.day).toFixed(1);
        const y = toY(p[key]).toFixed(1);
        current += current ? ` L ${x} ${y}` : `M ${x} ${y}`;
        if (i === pts.length - 1 && current) segments.push(current);
    });
    return segments;
}

// ─── Component ────────────────────────────────────────────────────────────────

interface SeriesConfig { key: 'connection' | 'sleep' | 'mood'; label: string; color: string; Icon: React.ComponentType<{ className?: string }>; }

const SERIES: SeriesConfig[] = [
    { key: 'connection', label: 'Feeling connected', color: '#a78bfa', Icon: Heart },
    { key: 'sleep',      label: 'Sleeping well',     color: '#60a5fa', Icon: Moon },
    { key: 'mood',       label: 'Overall mood',      color: '#34d399', Icon: TrendingUp },
];

interface TooltipInfo { day: number; x: number; connection: number; sleep: number; mood: number; submitted: boolean; }

interface PulseCheckTrendChartProps {
    data?: PulsePoint[];
}

const PulseCheckTrendChart: React.FC<PulseCheckTrendChartProps> = ({ data }) => {
    const rows = data ?? DUMMY;
    const [activeSeries, setActiveSeries] = useState<Set<string>>(new Set(['connection', 'sleep', 'mood']));
    const [tooltip, setTooltip] = useState<TooltipInfo | null>(null);
    const svgRef = useRef<SVGSVGElement>(null);

    const toggle = (key: string) =>
        setActiveSeries(prev => {
            const n = new Set(prev);
            n.has(key) ? n.delete(key) : n.add(key);
            return n;
        });

    const handleMouseMove = useCallback((e: React.MouseEvent<SVGRectElement>) => {
        const rect = svgRef.current?.getBoundingClientRect();
        if (!rect) return;
        const svgX = (e.clientX - rect.left) * (W / rect.width) - PAD.l;
        const day = Math.max(1, Math.min(90, Math.round((svgX / cW) * 89) + 1));
        const row = rows[day - 1];
        if (!row) return;
        setTooltip({ day, x: PAD.l + toX(day), submitted: row.submitted, connection: row.connection, sleep: row.sleep, mood: row.mood });
    }, [rows]);

    // Stats
    const submitted = rows.filter(r => r.submitted);
    const adherence = Math.round((submitted.length / rows.length) * 100);
    const avgConn = submitted.length ? (submitted.reduce((s, r) => s + r.connection, 0) / submitted.length).toFixed(1) : '—';
    const avgSleep = submitted.length ? (submitted.reduce((s, r) => s + r.sleep, 0) / submitted.length).toFixed(1) : '—';
    const trend = submitted.length >= 14
        ? submitted.slice(-14).reduce((s, r) => s + r.mood, 0) / 14 >
          submitted.slice(0, 14).reduce((s, r) => s + r.mood, 0) / 14
            ? 'improving' : 'stable'
        : 'stable';

    return (
        <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-5">
                <div>
                    <h3 className="text-slate-100 font-black text-lg">Pulse Check Trends</h3>
                    <p className="text-slate-400 text-sm mt-0.5">Daily check-in history — connection, sleep, and overall mood</p>
                </div>
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-xl border text-xs font-bold ${
                    trend === 'improving'
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                        : 'bg-slate-800/60 border-slate-700/50 text-slate-400'
                }`}>
                    <CircleDot className="w-3 h-3" />
                    {trend === 'improving' ? 'Trending up' : 'Stable'}
                </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3 mb-5">
                {[
                    { label: 'Check-in rate', value: `${adherence}%`, color: 'text-amber-400', sub: `${submitted.length}/90 days` },
                    { label: 'Avg. connection', value: avgConn + '/5', color: 'text-violet-400', sub: 'Feeling connected' },
                    { label: 'Avg. sleep', value: avgSleep + '/5', color: 'text-blue-400', sub: 'Sleeping well' },
                ].map(s => (
                    <div key={s.label} className="p-3 bg-slate-800/40 border border-slate-700/40 rounded-xl text-center">
                        <div className={`text-xl font-black ${s.color}`}>{s.value}</div>
                        <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mt-0.5">{s.label}</div>
                        <div className="text-xs text-slate-600 mt-0.5">{s.sub}</div>
                    </div>
                ))}
            </div>

            {/* Legend toggles */}
            <div className="flex flex-wrap gap-2 mb-4">
                {SERIES.map(s => {
                    const active = activeSeries.has(s.key);
                    const Icon = s.Icon;
                    return (
                        <button
                            key={s.key}
                            onClick={() => toggle(s.key)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                                active ? 'bg-slate-800/60' : 'border-slate-700/40 bg-slate-900/40 opacity-40'
                            }`}
                            style={{ color: s.color, borderColor: active ? s.color + '50' : undefined }}
                            aria-pressed={active}
                        >
                            <Icon className="w-3.5 h-3.5" />
                            {s.label}
                        </button>
                    );
                })}
            </div>

            {/* Chart */}
            <div className="relative">
                <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} width="100%"
                    className="overflow-visible"
                    aria-label="Pulse check trend chart" role="img">
                    <g transform={`translate(${PAD.l},${PAD.t})`}>
                        {/* Grid */}
                        {[1, 2, 3, 4, 5].map(v => (
                            <g key={v}>
                                <line x1={0} y1={toY(v)} x2={cW} y2={toY(v)} stroke="#1e2d45" strokeWidth={1} />
                                <text x={-6} y={toY(v) + 4} textAnchor="end" fill="#475569" fontSize={8}>{v}</text>
                            </g>
                        ))}

                        {/* Missed-day markers */}
                        {rows.filter(r => !r.submitted).map(r => (
                            <line key={r.day}
                                x1={toX(r.day)} y1={0}
                                x2={toX(r.day)} y2={cH}
                                stroke="#1e293b" strokeWidth={1} />
                        ))}

                        {/* Series lines (segment-aware for gaps) */}
                        {SERIES.filter(s => activeSeries.has(s.key)).map(s => {
                            const segs = buildSegments(rows, s.key);
                            return segs.map((d, i) => (
                                <path key={`${s.key}-${i}`} d={d}
                                    fill="none" stroke={s.color} strokeWidth={2.5}
                                    strokeLinecap="round" strokeLinejoin="round" opacity={0.9} />
                            ));
                        })}

                        {/* Crosshair */}
                        {tooltip && (
                            <line x1={tooltip.x - PAD.l} y1={0} x2={tooltip.x - PAD.l} y2={cH}
                                stroke="#475569" strokeWidth={1} strokeDasharray="3 3" />
                        )}

                        {/* Axes */}
                        <line x1={0} y1={cH} x2={cW} y2={cH} stroke="#1e2d45" strokeWidth={1.5} />
                        <line x1={0} y1={0} x2={0} y2={cH} stroke="#1e2d45" strokeWidth={1.5} />

                        {/* X labels */}
                        {[1, 15, 30, 45, 60, 75, 90].map(d => (
                            <text key={d} x={toX(d)} y={cH + 14}
                                textAnchor="middle" fill="#475569" fontSize={8}>Day {d}</text>
                        ))}

                        {/* Hover rect */}
                        <rect x={0} y={0} width={cW} height={cH}
                            fill="transparent" style={{ cursor: 'crosshair' }}
                            onMouseMove={handleMouseMove}
                            onMouseLeave={() => setTooltip(null)} />
                    </g>
                </svg>

                {/* Tooltip */}
                {tooltip && (
                    <div className="absolute pointer-events-none bg-[#0c1929] border border-slate-700/60 rounded-xl p-3 shadow-2xl text-xs z-10"
                        style={{
                            left: Math.min(tooltip.x / (W / 100), 65) + '%',
                            top: '8%',
                            transform: 'translateX(-50%)',
                            minWidth: 160,
                        }}
                        role="tooltip" aria-live="polite">
                        <div className="text-slate-400 font-bold mb-2 uppercase tracking-widest text-[10px]">
                            Day {tooltip.day} {!tooltip.submitted && <span className="text-slate-600 normal-case">(missed)</span>}
                        </div>
                        {tooltip.submitted ? (
                            SERIES.filter(s => activeSeries.has(s.key)).map(s => (
                                <div key={s.key} className="flex items-center justify-between gap-3 mb-1">
                                    <span style={{ color: s.color }} className="font-bold">{s.label}</span>
                                    <div className="flex gap-0.5">
                                        {[1, 2, 3, 4, 5].map(i => (
                                            <div key={i} className="w-2 h-2 rounded-full"
                                                style={{ backgroundColor: i <= Math.round((tooltip as any)[s.key]) ? s.color : '#1e293b' }} />
                                        ))}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-slate-600 italic">No check-in recorded</p>
                        )}
                    </div>
                )}
            </div>

            <p className="text-slate-600 text-xs mt-3 italic">
                * Preview data shown. Live trends populate as daily check-ins are submitted.
            </p>
        </div>
    );
};

export default PulseCheckTrendChart;
