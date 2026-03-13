/**
 * PractitionerProtocolBenchmark.tsx
 * ===================================
 * WO-EPIC-606 | BUILDER
 *
 * Treatment Trend Forecast — injected into ProtocolDetail.tsx.
 *
 * Shows the patient's PHQ-9 arc vs. a 2-point community shadow-line
 * derived from ref_benchmark_cohorts (baseline_mean → endpoint_mean).
 * Fires an amber risk banner if PHQ-9 ≥ 20 or upward trend ≥ 5 pts.
 *
 * LEAD CORRECTIONS APPLIED:
 * - Uses ref_benchmark_cohorts via getPrimaryBenchmark() — not direct supabase query
 * - Notes accordion is a static placeholder (log_integration_notes does not exist)
 * - Section heading uses .ppn-section-title without amber color override
 * - phqChartData is passed from ProtocolDetail (no new query)
 */

import React, { useEffect, useMemo, useState } from 'react';
import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceArea,
} from 'recharts';
import {
  TrendingUp,
  Info,
  AlertTriangle,
  ChevronRight,
  CalendarDays,
  ClipboardList,
} from 'lucide-react';
import { getPrimaryBenchmark, type BenchmarkCohort } from '../../lib/benchmarks';
import { AdvancedTooltip } from '../../components/ui/AdvancedTooltip';

// ─── Substance → Modality mapping ─────────────────────────────────────────────
const SUBSTANCE_TO_MODALITY: Record<string, string> = {
  Ketamine: 'ketamine',
  Esketamine: 'esketamine',
  Psilocybin: 'psilocybin',
  MDMA: 'mdma',
  LSD: 'psilocybin', // proxy — closest available benchmark
};

function resolveModality(substanceName: string): string {
  for (const [key, mod] of Object.entries(SUBSTANCE_TO_MODALITY)) {
    if (substanceName.toLowerCase().includes(key.toLowerCase())) return mod;
  }
  return 'psilocybin'; // default fallback
}

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface PractitionerProtocolBenchmarkProps {
  sessionId: string;
  substanceName: string;
  /** Already computed in ProtocolDetail — passed directly, no re-fetch */
  phqChartData: Array<{ date: string; score: number | null }>;
  patientLinkCodeHash: string | null;
}

// ─── Custom Tooltip ────────────────────────────────────────────────────────────

function BenchmarkTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ dataKey: string; name: string; color: string; value: number | null }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0f172a] border border-slate-700 p-3 rounded-xl shadow-2xl backdrop-blur-md">
      <p className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-2">{label}</p>
      {payload.map((entry) => (
        <div key={entry.dataKey} className="flex justify-between gap-4">
          <span className="text-xs font-bold uppercase tracking-wide" style={{ color: entry.color }}>
            {entry.name}
          </span>
          <span className="text-xs font-mono font-black text-slate-200">
            {entry.value != null ? `${entry.value} / 27` : '—'}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

const PractitionerProtocolBenchmark: React.FC<PractitionerProtocolBenchmarkProps> = ({
  sessionId: _sessionId,
  substanceName,
  phqChartData,
  patientLinkCodeHash: _patientLinkCodeHash,
}) => {
  const [benchmark, setBenchmark] = useState<BenchmarkCohort | null>(null);
  const [loadingBenchmark, setLoadingBenchmark] = useState(true);

  // Fetch the best matching benchmark cohort for this substance
  useEffect(() => {
    let cancelled = false;
    const modality = resolveModality(substanceName);
    setLoadingBenchmark(true);
    getPrimaryBenchmark(modality, 'MDD', 'PHQ-9')
      .then(result => {
        if (!cancelled) setBenchmark(result);
      })
      .catch(() => {
        if (!cancelled) setBenchmark(null);
      })
      .finally(() => {
        if (!cancelled) setLoadingBenchmark(false);
      });
    return () => { cancelled = true; };
  }, [substanceName]);

  // Build merged chart data: patient arc + interpolated community shadow-line
  const chartData = useMemo(() => {
    const communityBaseline = benchmark?.baseline_mean ?? null;
    const communityEndpoint = benchmark?.endpoint_mean ?? null;
    const len = phqChartData.length;

    return phqChartData.map((point, idx) => {
      let communityScore: number | null = null;
      if (communityBaseline != null && communityEndpoint != null && len > 1) {
        const progress = idx / (len - 1);
        const raw = communityBaseline + (communityEndpoint - communityBaseline) * progress;
        communityScore = Math.round(raw * 10) / 10;
      }
      return {
        date: point.date,
        patientScore: point.score,
        communityScore,
      };
    });
  }, [phqChartData, benchmark]);

  // SD band for ReferenceArea around endpoint
  const sdBand = useMemo(() => {
    if (benchmark?.endpoint_mean == null) return null;
    const sd = benchmark.endpoint_sd ?? 3;
    return {
      y1: Math.max(0, benchmark.endpoint_mean - sd),
      y2: Math.min(27, benchmark.endpoint_mean + sd),
    };
  }, [benchmark]);

  // Risk flag logic: PHQ-9 ≥ 20 OR last > first by ≥ 5
  const riskInfo = useMemo(() => {
    const scored = phqChartData.filter(d => d.score != null);
    if (scored.length === 0) return null;
    const highPoint = scored.find(d => (d.score ?? 0) >= 20);
    if (highPoint) {
      return {
        message: `PHQ-9 ≥ 20 detected at ${highPoint.date} — clinical review recommended.`,
      };
    }
    const first = scored[0].score ?? 0;
    const last = scored[scored.length - 1].score ?? 0;
    if (last > first + 5) {
      return {
        message: 'Symptom scores are trending upward — consider protocol adjustment or booster session.',
      };
    }
    return null;
  }, [phqChartData]);

  const hasChartData = phqChartData.filter(d => d.score != null).length >= 2;

  return (
    <section
      className="bg-[#0b0e14] border border-amber-900/30 rounded-[2.5rem] p-8 sm:p-10 shadow-2xl relative overflow-hidden"
      aria-labelledby="ppb-heading"
    >
      {/* Ambient glow */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" aria-hidden="true" />

      {/* Header */}
      <div className="flex items-start gap-4 mb-6 relative z-10">
        <div className="size-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
          <TrendingUp className="w-6 h-6" aria-hidden="true" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 id="ppb-heading" className="ppn-section-title">Treatment Trend Forecast</h2>
            <AdvancedTooltip content="Your patient's depression score over time, compared to the typical path of similar patients in published studies. The shaded band shows the range where most outcomes fall." learnMoreUrl="/help/overview">
              <button type="button" aria-label="About this chart" className="text-slate-600 hover:text-slate-300 transition-colors print:hidden">
                <Info className="w-4 h-4" aria-hidden="true" />
              </button>
            </AdvancedTooltip>
          </div>
          <p className="ppn-meta text-slate-500 uppercase tracking-widest mt-1">
            {substanceName} · PHQ-9
            {!loadingBenchmark && benchmark && ` · n=${benchmark.n_participants.toLocaleString()} matched participants`}
            {!loadingBenchmark && !benchmark && ' · (no matched benchmark found)'}
          </p>
        </div>
      </div>

      {/* Risk Flag Banner */}
      {riskInfo && (
        <div
          role="alert"
          className="flex items-center gap-3 p-4 bg-amber-950/40 border border-amber-700/40 rounded-2xl mb-6 relative z-10"
        >
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" aria-hidden="true" />
          <p className="ppn-body text-amber-300 flex-1">{riskInfo.message}</p>
          <a
            href="#/wellness-journey"
            className="ml-auto shrink-0 flex items-center gap-1.5 px-4 py-2 bg-amber-900/50 hover:bg-amber-800/60 border border-amber-700/50 text-amber-200 text-xs font-black rounded-xl uppercase tracking-widest transition-all"
            aria-label="Review protocol in Wellness Journey"
          >
            Review Protocol <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
          </a>
        </div>
      )}

      {/* Chart */}
      {hasChartData ? (
        <div
          className="h-[380px] w-full bg-slate-900/20 rounded-3xl border border-slate-800 p-3 mt-2 relative z-10"
          role="img"
          aria-label={`PHQ-9 treatment trend chart for ${substanceName}. Patient arc shown in indigo vs. community trajectory in slate.`}
        >
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 16, right: 16, left: -20, bottom: 20 }}>
              <defs>
                <filter id="ppb-glow-indigo">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <linearGradient id="ppb-patient-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" vertical={false} opacity={0.5} />

              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 11, fontWeight: 700 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 11, fontWeight: 700 }}
                domain={[0, 27]}
                width={36}
              />

              <Tooltip content={<BenchmarkTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.07)', strokeWidth: 1 }} />

              {/* Remission threshold */}
              <ReferenceLine
                y={5}
                stroke="#14b8a6"
                strokeDasharray="4 4"
                strokeOpacity={0.6}
                label={{ value: 'Remission (<5)', fill: '#14b8a6', fontSize: 9, position: 'insideTopRight' }}
              />

              {/* Community SD band */}
              {sdBand && (
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                <ReferenceArea
                  y1={sdBand.y1}
                  y2={sdBand.y2}
                  {...({ fill: '#6366f1', fillOpacity: 0.07, ifOverflow: 'hidden' } as any)}
                />
              )}

              {/* Community shadow-line */}
              <Line
                type="monotone"
                dataKey="communityScore"
                stroke="#64748b"
                strokeWidth={2}
                strokeDasharray="6 4"
                dot={false}
                connectNulls
                name="Community Median"
              />

              {/* Patient arc */}
              <Area
                type="monotone"
                dataKey="patientScore"
                stroke="#6366f1"
                strokeWidth={3}
                fill="url(#ppb-patient-fill)"
                filter="url(#ppb-glow-indigo)"
                dot={{ r: 5, fill: '#0b0e14', stroke: '#6366f1', strokeWidth: 2 }}
                activeDot={{ r: 7, fill: '#6366f1', stroke: '#fff', strokeWidth: 1 }}
                connectNulls
                name="This Patient"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-[160px] flex flex-col items-center justify-center bg-slate-900/20 rounded-3xl border border-slate-800 gap-3 relative z-10">
          <TrendingUp className="w-10 h-10 text-slate-700" aria-hidden="true" />
          <p className="ppn-meta text-slate-600 uppercase tracking-widest text-center px-4">
            Minimum 2 PHQ-9 assessments required to render trend
          </p>
        </div>
      )}

      {/* Legend */}
      <div className="mt-4 flex items-center gap-5 flex-wrap relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-5 h-0.5 bg-indigo-500 rounded-full" />
          <span className="ppn-meta text-slate-500 uppercase tracking-widest">This Patient</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-px" style={{ background: 'repeating-linear-gradient(to right, #64748b 0, #64748b 5px, transparent 5px, transparent 9px)' }} />
          <span className="ppn-meta text-slate-500 uppercase tracking-widest">Community Median</span>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <div className="w-4 h-px" style={{ background: 'repeating-linear-gradient(to right, #14b8a6 0, #14b8a6 4px, transparent 4px, transparent 8px)' }} />
          <span className="ppn-meta text-slate-500 uppercase tracking-widest">Remission</span>
        </div>
      </div>

      {/* Session Notes — placeholder (log_integration_notes table not yet created) */}
      <div className="mt-8 pt-6 border-t border-slate-800/50 relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="size-8 rounded-lg bg-slate-800/60 border border-slate-700/50 flex items-center justify-center text-slate-500">
            <ClipboardList className="w-4 h-4" aria-hidden="true" />
          </div>
          <h3 className="ppn-card-title">Session Notes</h3>
        </div>
        <div
          className="bg-slate-900/30 border border-slate-800/50 rounded-xl p-6"
          role="note"
          aria-label="Session notes — coming soon"
        >
          <div className="flex items-start gap-3">
            <CalendarDays className="w-4 h-4 text-slate-600 mt-0.5 shrink-0" aria-hidden="true" />
            <p className="ppn-body text-slate-600">
              Session notes will appear here once the integration note-taking feature is live.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PractitionerProtocolBenchmark;
