/**
 * GlobalBenchmarkIntelligence.tsx
 * ================================
 * WO-231 | BUILDER/ANALYST
 *
 * Displays live data from the seeded benchmark_cohorts + benchmark_trials tables.
 * Renders three tiers:
 *   1. Social proof counter — "Grounded in 1,565 global clinical trials"
 *   2. Benchmark cohort cards — the 9 seeded landmark studies
 *   3. Modality comparison bar — effect sizes across psilocybin / MDMA / ketamine
 *
 * All data is real. Zero mock values. Source citations shown on every card.
 */

import React, { useEffect, useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip,
    ResponsiveContainer, ReferenceLine, Cell,
} from 'recharts';
import { FlaskConical, BookOpen, Globe, TrendingUp, Users, ExternalLink } from 'lucide-react';
import {
    getBenchmarkSummary,
    getBenchmarkCohorts,
    type BenchmarkCohort,
    type BenchmarkSummary,
} from '../../lib/benchmarks';
import { useDataContributionStatus } from '../../hooks/useDataContributionStatus';
import { Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface EffectSizeBar {
    name: string;
    g: number;
    n: number;
    condition: string;
    fill: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

const MODALITY_COLORS: Record<string, string> = {
    psilocybin: '#8b5cf6',
    mdma: '#3b82f6',
    ketamine: '#06b6d4',
    esketamine: '#f59e0b',
};

const MODALITY_LABELS: Record<string, string> = {
    psilocybin: 'Psilocybin',
    mdma: 'MDMA',
    ketamine: 'Ketamine',
    esketamine: 'Esketamine',
};

const CONDITION_LABELS: Record<string, string> = {
    PTSD: 'PTSD',
    MDD: 'Depression',
    TRD: 'Treatment-Resistant Depression',
    AUD: 'Alcohol Use Disorder',
    Mixed: 'Mixed Conditions',
};

function StatusChip({ label, positive }: { label: string; positive: boolean }) {
    return (
        <span className={`text-xs font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${positive
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
            }`}>
            {label}
        </span>
    );
}

function EffectSizeBar_({ g }: { g: number | null }) {
    if (g == null) return <span className="text-slate-600 text-xs">—</span>;
    const abs = Math.abs(g);
    const width = Math.min(abs / 1.5 * 100, 100);
    return (
        <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-400"
                    style={{ width: `${width}%` }}
                />
            </div>
            <span className="text-xs font-mono text-slate-400 w-12 text-right">
                g = {g.toFixed(2)}
            </span>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Custom tooltip for the bar chart
// ─────────────────────────────────────────────────────────────────────────────

function BenchmarkTooltip({ active, payload }: any) {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload as EffectSizeBar;
    return (
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm shadow-xl max-w-xs">
            <p className="font-black text-white mb-1">{d.name}</p>
            <p className="text-slate-400 text-xs mb-1">{CONDITION_LABELS[d.condition] ?? d.condition}</p>
            <p className="text-slate-300">Effect size: <span className="font-bold text-white">g = {d.g.toFixed(2)}</span></p>
            <p className="text-slate-400 text-xs mt-1">n = {d.n.toLocaleString()} participants</p>
            <p className="text-slate-500 text-xs mt-1">Lower g = larger improvement vs. control</p>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────

export default function GlobalBenchmarkIntelligence() {
    const [summary, setSummary] = useState<BenchmarkSummary | null>(null);
    const [cohorts, setCohorts] = useState<BenchmarkCohort[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expanded, setExpanded] = useState<string | null>(null);
    const { isContributor, outcomesNeeded, isLoading: statusLoading } = useDataContributionStatus();

    useEffect(() => {
        let cancelled = false;
        async function load() {
            if (!isContributor || statusLoading) {
                if (!statusLoading) setLoading(false);
                return;
            }
            try {
                setLoading(true);
                // Fetch in parallel
                const [summaryData, allCohorts] = await Promise.all([
                    getBenchmarkSummary(),
                    // Get all cohorts: fetch each condition separately and merge
                    Promise.all([
                        getBenchmarkCohorts('mdma', 'PTSD', 'CAPS-5'),
                        getBenchmarkCohorts('psilocybin', 'MDD', 'GRID-HAMD'),
                        getBenchmarkCohorts('psilocybin', 'TRD', 'MADRS'),
                        getBenchmarkCohorts('psilocybin', 'TRD', 'QIDS-SR-16'),
                        getBenchmarkCohorts('psilocybin', 'AUD', 'AUDIT-C'),
                        getBenchmarkCohorts('psilocybin', 'Mixed', 'PHQ-9'),
                        getBenchmarkCohorts('ketamine', 'MDD', 'MADRS'),
                        getBenchmarkCohorts('ketamine', 'PTSD', 'CAPS'),
                    ]).then(results => results.flat()),
                ]);

                if (!cancelled) {
                    setSummary(summaryData);
                    // De-duplicate by cohort_name (in case a cohort appears in multiple queries)
                    const seen = new Set<string>();
                    const unique = allCohorts.filter(c => {
                        if (seen.has(c.cohort_name)) return false;
                        seen.add(c.cohort_name);
                        return true;
                    });
                    // Sort by effect size magnitude (most impactful first)
                    unique.sort((a, b) =>
                        Math.abs(b.effect_size_hedges_g ?? 0) - Math.abs(a.effect_size_hedges_g ?? 0)
                    );
                    setCohorts(unique);
                }
            } catch (err: any) {
                if (!cancelled) setError(err?.message ?? 'Failed to load benchmark data');
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        load();
        return () => { cancelled = true; };
    }, [isContributor, statusLoading]);

    // Build bar chart data from cohorts that have both effect size and n
    const barData: EffectSizeBar[] = cohorts
        .filter(c => c.effect_size_hedges_g != null && c.n_participants != null)
        .map(c => ({
            // Shorten name for axis
            name: c.cohort_name.replace(/ \(.*?\)/, '').replace(/Phase \d.*/, '').trim(),
            g: Math.abs(c.effect_size_hedges_g!),
            n: c.n_participants,
            condition: c.condition,
            fill: MODALITY_COLORS[c.modality] ?? '#6366f1',
        }))
        .slice(0, 8);  // max 8 bars for readability

    if (loading || statusLoading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map(i => (
                    <div key={i} className="animate-pulse bg-slate-800/40 rounded-2xl h-24" />
                ))}
            </div>
        );
    }

    if (!isContributor) {
        return (
            <div className="bg-[#0a0c12]/60 border border-slate-800/50 rounded-2xl p-8 text-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="mx-auto w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-6">
                    <Lock className="w-8 h-8 text-indigo-400" />
                </div>
                <h3 className="text-xl font-black text-white mb-3 tracking-wide">Market Benchmarks Locked</h3>
                <p className="text-slate-400 text-sm max-w-md mx-auto mb-6 leading-relaxed">
                    The PPN Research Alliance operates on a "Give-to-Get" model. Submit <span className="text-indigo-400 font-bold">{outcomesNeeded} more</span> valid clinical outcome{outcomesNeeded !== 1 ? 's' : ''} to unlock global benchmark data.
                </p>
                <Link
                    to="/wellness-journey"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-colors shadow-lg shadow-indigo-500/20"
                >
                    Record a Session
                </Link>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-red-400 text-sm">
                [STATUS: FAIL] Could not load benchmark data: {error}
            </div>
        );
    }

    return (
        <div className="space-y-8">

            {/* ── SOCIAL PROOF COUNTER ─────────────────────────────────────────── */}
            {summary && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        {
                            icon: Globe,
                            value: summary.trialCount.toLocaleString(),
                            label: 'Global Clinical Trials',
                            sub: 'from ClinicalTrials.gov',
                            color: 'text-violet-400',
                            border: 'border-violet-500/20',
                            bg: 'bg-violet-500/5',
                        },
                        {
                            icon: BookOpen,
                            value: summary.cohortCount.toLocaleString(),
                            label: 'Published Benchmarks',
                            sub: 'open-access papers',
                            color: 'text-blue-400',
                            border: 'border-blue-500/20',
                            bg: 'bg-blue-500/5',
                        },
                        {
                            icon: FlaskConical,
                            value: (summary.modalityCounts['psilocybin'] ?? 0).toLocaleString(),
                            label: 'Psilocybin Trials',
                            sub: 'indexed & queryable',
                            color: 'text-purple-400',
                            border: 'border-purple-500/20',
                            bg: 'bg-purple-500/5',
                        },
                        {
                            icon: Users,
                            value: cohorts.reduce((acc, c) => acc + (c.n_participants ?? 0), 0).toLocaleString() + '+',
                            label: 'Published Participants',
                            sub: 'across benchmark studies',
                            color: 'text-cyan-400',
                            border: 'border-cyan-500/20',
                            bg: 'bg-cyan-500/5',
                        },
                    ].map((stat, i) => (
                        <div key={i} className={`${stat.bg} border ${stat.border} rounded-2xl p-4 flex flex-col gap-2`}>
                            <div className="flex items-center gap-2">
                                <stat.icon className={`w-4 h-4 ${stat.color}`} />
                                <span className="text-xs font-black uppercase tracking-widest text-slate-500">{stat.label}</span>
                            </div>
                            <div className={`text-3xl font-black tracking-tight ${stat.color}`}>{stat.value}</div>
                            <div className="text-xs text-slate-500">{stat.sub}</div>
                        </div>
                    ))}
                </div>
            )}

            {/* ── EFFECT SIZE COMPARISON BAR CHART ────────────────────────────── */}
            {barData.length > 0 && (
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-base font-black tracking-tight" style={{ color: '#A8B5D1' }}>
                                Effect Sizes by Study — Global Benchmarks
                            </h3>
                            <p className="text-xs mt-0.5 text-slate-500">
                                Hedges' g (absolute) — larger bar = stronger improvement vs. control
                            </p>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-500">
                            {Object.entries(MODALITY_COLORS).slice(0, 3).map(([mod, color]) => (
                                <span key={mod} className="flex items-center gap-1.5">
                                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                                    {MODALITY_LABELS[mod]}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="bg-[#0a0c12]/60 border border-slate-800/50 rounded-2xl p-5">
                        {/* Reference lines */}
                        <div className="flex items-center gap-6 mb-3 text-xs font-bold uppercase tracking-widest text-slate-600">
                            <span className="flex items-center gap-1"><span className="w-3 h-px bg-slate-700 inline-block" /> Small effect (0.2)</span>
                            <span className="flex items-center gap-1"><span className="w-3 h-px bg-slate-600 inline-block" /> Medium (0.5)</span>
                            <span className="flex items-center gap-1"><span className="w-3 h-px bg-indigo-700 inline-block" /> Large (0.8)</span>
                        </div>
                        <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={barData} layout="vertical" margin={{ left: 8, right: 50, top: 4, bottom: 4 }}>
                                <XAxis
                                    type="number"
                                    domain={[0, 1.4]}
                                    tickFormatter={v => `${v}`}
                                    tick={{ fill: '#4b5563', fontSize: 11 }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis
                                    type="category"
                                    dataKey="name"
                                    width={160}
                                    tick={{ fill: '#6b7280', fontSize: 11 }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <Tooltip content={<BenchmarkTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                                {/* Reference lines */}
                                <ReferenceLine x={0.2} stroke="#374151" strokeDasharray="3 3" />
                                <ReferenceLine x={0.5} stroke="#4b5563" strokeDasharray="3 3" />
                                <ReferenceLine x={0.8} stroke="#4f46e5" strokeDasharray="3 3" />
                                <Bar dataKey="g" radius={[0, 6, 6, 0]} maxBarSize={20}>
                                    {barData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} fillOpacity={0.85} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            {/* ── BENCHMARK COHORT CARDS ───────────────────────────────────────── */}
            {cohorts.length > 0 && (
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-base font-black tracking-tight" style={{ color: '#A8B5D1' }}>
                                Landmark Study Benchmarks
                            </h3>
                            <p className="text-xs mt-0.5 text-slate-500">
                                Your outcomes are compared against these published open-access studies
                            </p>
                        </div>
                        <TrendingUp className="w-4 h-4 text-slate-600" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                        {cohorts.map(cohort => {
                            const isExpanded = expanded === cohort.id;
                            const color = MODALITY_COLORS[cohort.modality] ?? '#6366f1';
                            const hasResponse = cohort.response_rate_pct != null;
                            const hasEndpoint = cohort.endpoint_mean != null && cohort.baseline_mean != null;
                            const improvement = hasEndpoint
                                ? Math.round(((cohort.baseline_mean! - cohort.endpoint_mean!) / cohort.baseline_mean!) * 100)
                                : null;

                            return (
                                <button
                                    key={cohort.id}
                                    onClick={() => setExpanded(isExpanded ? null : cohort.id)}
                                    className="text-left bg-[#0a0c12]/60 border border-slate-800/50 hover:border-slate-700 rounded-2xl p-4 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                                    aria-expanded={isExpanded}
                                >
                                    {/* Modality accent bar */}
                                    <div className="h-0.5 w-12 rounded-full mb-3" style={{ backgroundColor: color }} />

                                    {/* Title row */}
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <p className="text-sm font-black leading-tight" style={{ color: '#A8B5D1' }}>
                                            {cohort.cohort_name.replace(/ \(.*?\)$/, '')}
                                        </p>
                                        <span
                                            className="text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded-full border flex-shrink-0"
                                            style={{ color, borderColor: `${color}40`, backgroundColor: `${color}10` }}
                                        >
                                            {MODALITY_LABELS[cohort.modality] ?? cohort.modality}
                                        </span>
                                    </div>

                                    {/* Condition + instrument */}
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="text-xs text-slate-500">
                                            {CONDITION_LABELS[cohort.condition] ?? cohort.condition}
                                        </span>
                                        <span className="text-slate-700">·</span>
                                        <span className="text-xs font-mono text-slate-500">{cohort.instrument}</span>
                                        <span className="text-slate-700">·</span>
                                        <span className="text-xs text-slate-600">n={cohort.n_participants.toLocaleString()}</span>
                                    </div>

                                    {/* Key stats row */}
                                    <div className="flex items-center gap-4 mb-3">
                                        {hasResponse && (
                                            <div>
                                                <div className="text-xl font-black" style={{ color }}>
                                                    {cohort.response_rate_pct}%
                                                </div>
                                                <div className="text-xs text-slate-500 uppercase tracking-widest">Response</div>
                                            </div>
                                        )}
                                        {improvement != null && (
                                            <div>
                                                <div className="text-xl font-black text-emerald-400">
                                                    {improvement}%
                                                </div>
                                                <div className="text-xs text-slate-500 uppercase tracking-widest">Improvement</div>
                                            </div>
                                        )}
                                        {cohort.followup_weeks != null && (
                                            <div>
                                                <div className="text-xl font-black text-slate-400">
                                                    Wk {cohort.followup_weeks}
                                                </div>
                                                <div className="text-xs text-slate-500 uppercase tracking-widest">Endpoint</div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Effect size bar */}
                                    <EffectSizeBar_ g={cohort.effect_size_hedges_g} />

                                    {/* Expanded: citation + extra stats */}
                                    {isExpanded && (
                                        <div className="mt-4 pt-4 border-t border-slate-800 space-y-3">
                                            {cohort.remission_rate_pct != null && (
                                                <div className="flex justify-between text-xs">
                                                    <span className="text-slate-500">Remission rate</span>
                                                    <span className="text-white font-bold">{cohort.remission_rate_pct}%</span>
                                                </div>
                                            )}
                                            {cohort.baseline_mean != null && cohort.endpoint_mean != null && (
                                                <div className="flex justify-between text-xs">
                                                    <span className="text-slate-500">{cohort.instrument} baseline → endpoint</span>
                                                    <span className="text-white font-bold font-mono">
                                                        {cohort.baseline_mean} → {cohort.endpoint_mean}
                                                    </span>
                                                </div>
                                            )}
                                            {cohort.adverse_event_rate_pct != null && (
                                                <div className="flex justify-between text-xs">
                                                    <span className="text-slate-500">Adverse event rate</span>
                                                    <span className="font-bold" style={{ color: cohort.adverse_event_rate_pct < 10 ? '#34d399' : '#f59e0b' }}>
                                                        {cohort.adverse_event_rate_pct}%
                                                    </span>
                                                </div>
                                            )}
                                            {/* Setting badge */}
                                            {cohort.setting && (
                                                <StatusChip
                                                    label={cohort.setting.replace('_', ' ')}
                                                    positive={cohort.setting === 'clinical_trial'}
                                                />
                                            )}
                                            {/* Citation */}
                                            <div className="flex items-start gap-1.5 pt-1">
                                                <ExternalLink className="w-3 h-3 text-slate-600 flex-shrink-0 mt-0.5" />
                                                <p className="text-xs text-slate-600 leading-relaxed break-words">
                                                    {cohort.source_citation}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    <p className="text-xs text-slate-600 mt-4 flex items-center gap-1.5">
                        <BookOpen className="w-3 h-3" />
                        All benchmarks sourced from peer-reviewed open-access publications. Click any card to see citation.
                    </p>
                </div>
            )}

            {/* Empty state — shouldn't appear after seeding but handles gracefully */}
            {!loading && cohorts.length === 0 && (
                <div className="text-center py-12 text-slate-600 text-sm">
                    No benchmark data available yet.
                </div>
            )}

        </div>
    );
}
