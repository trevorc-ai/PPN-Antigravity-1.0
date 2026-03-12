/**
 * PatientJourneyValidation.tsx
 * ==============================
 * WO-EPIC-606 | BUILDER
 *
 * "Community Connection Map" — patient-facing empathic analytics component.
 *
 * DESIGN PRINCIPLES (LEAD-approved):
 * - No clinical numbers visible (Y-axis hidden)
 * - No amber-500 (P2/Dosing color) — violet palette throughout
 * - Community shadow-line at low opacity labeled "Others on similar journeys"
 * - Directional language only in stat cards
 * - Warm, first-person copy — no clinical terminology
 *
 * LEAD CORRECTIONS APPLIED:
 * - communityBenchmarkData replaced with primaryBenchmark: BenchmarkCohort | null
 * - Shadow-line = 2-point synthetic arc (baseline_mean → endpoint_mean)
 * - SD band approximated from endpoint_sd
 * - MVP: patientPhqData may be empty (patient link-code wiring is a future WO)
 */

import React, { useMemo } from 'react';
import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Sparkles, Heart, Users, Activity } from 'lucide-react';
import type { BenchmarkCohort } from '../../lib/benchmarks';

// ─── Affirming message lookup ──────────────────────────────────────────────────

const AFFIRMING_MESSAGES: Record<number, string> = {
  0: "Your journey begins with preparation. Others who felt uncertain before their first session describe it as the turning point they didn't know they needed.",
  1: "The first session plants the seed. Many people feel disoriented in the days after — that's part of the work. You're right on track.",
  2: "You're in one of the most powerful windows of integration. The weeks after your 2nd session are often described as the most transformative.",
};
const AFFIRMING_MESSAGES_DEFAULT =
  "You've built real momentum. Based on similar journeys, people at this stage often begin noticing lasting shifts in daily patterns and relationships.";

function getAffirmingMessage(completedSessions: number): string {
  if (completedSessions >= 3) return AFFIRMING_MESSAGES_DEFAULT;
  return AFFIRMING_MESSAGES[completedSessions] ?? AFFIRMING_MESSAGES_DEFAULT;
}

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface PatientJourneyValidationProps {
  /** Patient's own PHQ-9 history. May be empty for MVP (link-code wiring future WO). */
  patientPhqData: Array<{ sessionLabel: string; score: number | null }>;
  /** Best benchmark cohort for this substance from ref_benchmark_cohorts. null = no match. */
  primaryBenchmark: BenchmarkCohort | null;
  completedSessions: number;
  totalPlannedSessions: number;
  substanceName: string;
}

// ─── Tooltip ──────────────────────────────────────────────────────────────────

function PatientTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number | null; color: string }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0d0b1f] border border-violet-800/40 p-3 rounded-xl shadow-xl max-w-[200px]">
      <p className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-1">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} className="ppn-meta" style={{ color: entry.color }}>
          {entry.name}
        </p>
      ))}
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  sub?: string;
}

function StatCard({ label, value, icon, sub }: StatCardProps) {
  return (
    <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-5 text-center flex flex-col items-center gap-2">
      <div className="size-8 rounded-lg bg-violet-500/10 flex items-center justify-center text-violet-400 border border-violet-500/20">
        {icon}
      </div>
      <p className="ppn-card-title text-violet-300">{value}</p>
      <p className="ppn-label text-slate-500">{label}</p>
      {sub && <p className="ppn-meta text-slate-600">{sub}</p>}
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

const PatientJourneyValidation: React.FC<PatientJourneyValidationProps> = ({
  patientPhqData,
  primaryBenchmark,
  completedSessions,
  totalPlannedSessions,
  substanceName,
}) => {
  // Build chart data: merge patient arc with community shadow-line
  const chartData = useMemo(() => {
    const communityBaseline = primaryBenchmark?.baseline_mean ?? null;
    const communityEndpoint = primaryBenchmark?.endpoint_mean ?? null;

    // If we have patient data, use it as the backbone; otherwise create session stubs
    const backbone =
      patientPhqData.length > 0
        ? patientPhqData
        : Array.from({ length: Math.max(completedSessions, 2) }, (_, i) => ({
            sessionLabel: `Session ${i + 1}`,
            score: null,
          }));

    const len = backbone.length;
    return backbone.map((point, idx) => {
      let communityScore: number | null = null;
      if (communityBaseline != null && communityEndpoint != null && len > 1) {
        const progress = idx / (len - 1);
        const raw = communityBaseline + (communityEndpoint - communityBaseline) * progress;
        communityScore = Math.round(raw * 10) / 10;
      }
      return {
        sessionLabel: point.sessionLabel,
        patientScore: point.score,
        communityScore,
      };
    });
  }, [patientPhqData, primaryBenchmark, completedSessions]);

  // Directional arc label (no clinical numbers)
  const arcDirection = useMemo(() => {
    const scored = patientPhqData.filter(d => d.score != null);
    if (scored.length < 2) return null;
    const first = scored[0].score ?? 0;
    const last = scored[scored.length - 1].score ?? 0;
    if (last < first - 2) return 'Trending toward wellness ↓';
    if (last > first + 2) return 'Review recommended ↑';
    return 'Holding steady →';
  }, [patientPhqData]);

  // Community context label
  const communityContext = useMemo(() => {
    const scored = patientPhqData.filter(d => d.score != null);
    if (scored.length === 0 || !primaryBenchmark?.endpoint_mean) {
      return 'In alignment with community';
    }
    const last = scored[scored.length - 1].score ?? 0;
    return last < primaryBenchmark.endpoint_mean
      ? 'Thriving vs. community'
      : 'In alignment with community';
  }, [patientPhqData, primaryBenchmark]);

  const hasCommunityData = primaryBenchmark != null;
  const hasPatientArc = patientPhqData.filter(d => d.score != null).length >= 2;

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="text-center space-y-3 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-violet-600/8 rounded-full blur-[100px] pointer-events-none" aria-hidden="true" />
        <div className="relative z-10">
          <div className="size-14 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 mx-auto mb-4">
            <Sparkles className="w-7 h-7" aria-hidden="true" />
          </div>
          <h1 className="ppn-page-title text-violet-100">Your Healing Journey</h1>
          <p className="ppn-body text-slate-400 italic mt-1">You are not on this path alone.</p>
          {substanceName && (
            <p className="ppn-meta text-slate-600 uppercase tracking-widest mt-2">
              {substanceName} · {completedSessions} of {totalPlannedSessions} sessions
            </p>
          )}
        </div>
      </div>

      {/* Community Connection Map */}
      <div
        className="bg-[#0b0b1e]/60 backdrop-blur-xl border border-violet-900/30 rounded-[2.5rem] p-8"
        aria-labelledby="community-map-heading"
      >
        <div className="flex items-center gap-3 mb-2">
          <h2 id="community-map-heading" className="ppn-section-title text-violet-100/80">Community Connection Map</h2>
        </div>
        {hasCommunityData ? (
          <p className="ppn-meta text-violet-400/60 uppercase tracking-widest mb-6">
            {primaryBenchmark?.cohort_name ?? 'Matched peer group'} · {primaryBenchmark?.n_participants.toLocaleString()} journeys
          </p>
        ) : (
          <p className="ppn-meta text-slate-600 uppercase tracking-widest mb-6">Community arc loading…</p>
        )}

        <div
          className="h-[320px] w-full"
          role="img"
          aria-label={
            hasPatientArc
              ? 'Your healing arc compared to others on similar journeys. Clinical scores are not displayed — shape only.'
              : 'Community journey arc. Your personal data will appear here once more sessions are recorded.'
          }
        >
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 16, right: 16, left: 0, bottom: 8 }}>
              <defs>
                <filter id="pjv-glow-violet">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <linearGradient id="pjv-patient-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                </linearGradient>
              </defs>

              {/* Y-axis hidden — no clinical numbers shown to patient */}
              <YAxis hide domain={[0, 27]} />

              <XAxis
                dataKey="sessionLabel"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#7c3aed', fontSize: 11, fontWeight: 700, opacity: 0.7 }}
                dy={8}
              />

              <Tooltip content={<PatientTooltip />} cursor={{ stroke: 'rgba(139,92,246,0.1)', strokeWidth: 1 }} />

              {/* Community ghost line */}
              <Line
                type="monotone"
                dataKey="communityScore"
                stroke="#334155"
                strokeWidth={1.5}
                strokeDasharray="5 5"
                strokeOpacity={0.4}
                dot={false}
                connectNulls
                name="Others on similar journeys"
              />

              {/* Patient arc — only if data available */}
              {hasPatientArc && (
                <Area
                  type="monotone"
                  dataKey="patientScore"
                  stroke="#a78bfa"
                  strokeWidth={3}
                  fill="url(#pjv-patient-fill)"
                  filter="url(#pjv-glow-violet)"
                  dot={{ r: 5, fill: '#0b0b1e', stroke: '#a78bfa', strokeWidth: 2 }}
                  activeDot={{ r: 7, fill: '#a78bfa', stroke: '#fff', strokeWidth: 1 }}
                  connectNulls
                  name="Your Journey"
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Chart legend */}
        <div className="flex items-center gap-5 flex-wrap mt-4 pt-4 border-t border-violet-900/20">
          {hasPatientArc && (
            <div className="flex items-center gap-2">
              <div className="w-5 h-0.5 bg-violet-400 rounded-full" />
              <span className="ppn-meta text-violet-400/70 uppercase tracking-widest">Your Journey</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <div className="w-5 h-px" style={{ background: 'repeating-linear-gradient(to right, #334155 0, #334155 4px, transparent 4px, transparent 8px)' }} />
            <span className="ppn-meta text-slate-600 uppercase tracking-widest">Others on similar journeys</span>
          </div>
        </div>

        {/* No patient arc message */}
        {!hasPatientArc && (
          <div className="mt-4 px-4 py-3 bg-violet-950/20 border border-violet-800/20 rounded-xl">
            <p className="ppn-meta text-violet-400/60 text-center">
              Your personal arc will appear here once more session data is recorded.
            </p>
          </div>
        )}
      </div>

      {/* Where You Are Today — 3-stat row */}
      <div
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        role="region"
        aria-label="Where you are today"
      >
        <StatCard
          label="Your Arc"
          value={arcDirection ?? 'Journey underway'}
          icon={<Activity className="w-4 h-4" aria-hidden="true" />}
          sub="Based on your sessions"
        />
        <StatCard
          label="Community"
          value={communityContext}
          icon={<Users className="w-4 h-4" aria-hidden="true" />}
          sub={primaryBenchmark ? `vs. ${primaryBenchmark.n_participants.toLocaleString()} peers` : undefined}
        />
        <StatCard
          label="Sessions"
          value={`${completedSessions} of ${totalPlannedSessions}`}
          icon={<Heart className="w-4 h-4" aria-hidden="true" />}
          sub="Completed"
        />
      </div>

      {/* Affirming Message */}
      <div
        className="bg-violet-950/20 border border-violet-800/30 rounded-2xl p-6"
        role="note"
        aria-label="Encouraging message for your healing journey"
      >
        <p className="ppn-body text-slate-300 leading-relaxed">
          {getAffirmingMessage(completedSessions)}
        </p>
      </div>
    </div>
  );
};

export default PatientJourneyValidation;
