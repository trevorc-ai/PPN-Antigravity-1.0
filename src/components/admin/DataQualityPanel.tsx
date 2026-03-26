import React, { useState } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, ChevronDown, ChevronUp, Database } from 'lucide-react';
import { useSiteDataQuality, type FollowupWindowCompliance } from '../../hooks/useSiteDataQuality';
import type { FollowupWindowCompliance as FWC } from '../../hooks/useSiteDataQuality';

/**
 * DataQualityPanel — WO-701
 *
 * Site-level intelligence layer readiness panel.
 * Visible only when userRole === 'site_admin'.
 *
 * Sources:
 *   - mv_site_documentation_summary (capability #6)
 *   - mv_site_followup_compliance (capability #5)
 *   - log_clinical_records direct counts (protocol_id gap, safety event gap)
 *
 * Status thresholds:
 *   🔴 < 30%  |  🟡 30–79%  |  ✅ ≥ 80%
 */

interface DataQualityPanelProps {
  practitionerId: string;
  userRole: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// STATUS HELPERS
// ─────────────────────────────────────────────────────────────────────────────
function getStatus(ratio: number | null): 'green' | 'amber' | 'red' | 'empty' {
  if (ratio === null) return 'empty';
  if (ratio >= 0.8) return 'green';
  if (ratio >= 0.3) return 'amber';
  return 'red';
}

function StatusIcon({ status }: { status: ReturnType<typeof getStatus> }) {
  if (status === 'green') return <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" aria-label="Good" />;
  if (status === 'amber') return <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" aria-label="Needs improvement" />;
  if (status === 'red') return <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" aria-label="Critical" />;
  return <span className="w-4 h-4 flex-shrink-0 text-slate-600" aria-label="No data">—</span>;
}

function StatusBar({ ratio }: { ratio: number | null }) {
  if (ratio === null) return (
    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
      <div className="h-full w-0 bg-slate-700 rounded-full" />
    </div>
  );
  const pct = Math.round(ratio * 100);
  const color = ratio >= 0.8 ? 'bg-emerald-500' : ratio >= 0.3 ? 'bg-amber-500' : 'bg-red-500';
  return (
    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
      <div
        className={`h-full ${color} rounded-full transition-all duration-700`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// METRIC ROW
// ─────────────────────────────────────────────────────────────────────────────
function MetricRow({
  label, numerator, denominator, ratio,
}: { label: string; numerator: number | null; denominator: number | null; ratio: number | null }) {
  const status = getStatus(ratio);
  const display = numerator !== null && denominator !== null
    ? `${numerator} / ${denominator}`
    : ratio !== null
      ? `${Math.round(ratio * 100)}%`
      : '—';
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <StatusIcon status={status} />
          <span className="text-sm font-medium text-slate-300 truncate">{label}</span>
        </div>
        <span className={`text-sm font-black tabular-nums flex-shrink-0 ${
          status === 'green' ? 'text-emerald-400'
          : status === 'amber' ? 'text-amber-400'
          : status === 'red' ? 'text-red-400'
          : 'text-slate-500'
        }`}>{display}</span>
      </div>
      <StatusBar ratio={ratio} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FOLLOW-UP WINDOW TABLE
// ─────────────────────────────────────────────────────────────────────────────
function FollowupTable({ rows }: { rows: FollowupWindowCompliance[] }) {
  if (rows.length === 0) return (
    <p className="text-sm text-slate-500 italic">No follow-up window data available.</p>
  );
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs text-slate-500 uppercase tracking-wider border-b border-slate-800">
            <th className="pb-2 pr-4 font-bold">Day</th>
            <th className="pb-2 pr-4 font-bold">Expected</th>
            <th className="pb-2 pr-4 font-bold">Completed</th>
            <th className="pb-2 font-bold">Rate</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60">
          {rows.map((r) => {
            const rate = r.completion_rate != null ? Math.round(r.completion_rate * 100) : null;
            const status = getStatus(r.completion_rate);
            return (
              <tr key={r.expected_day} className="py-2">
                <td className="py-2 pr-4 text-slate-300 font-medium">Day {r.expected_day}</td>
                <td className="py-2 pr-4 text-slate-400">{r.total_expected}</td>
                <td className="py-2 pr-4 text-slate-400">{r.total_completed}</td>
                <td className={`py-2 font-black tabular-nums ${
                  status === 'green' ? 'text-emerald-400'
                  : status === 'amber' ? 'text-amber-400'
                  : 'text-red-400'
                }`}>{rate !== null ? `${rate}%` : '—'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export const DataQualityPanel: React.FC<DataQualityPanelProps> = ({
  practitionerId, userRole,
}) => {
  // Role gate — non-admins cannot see this component
  if (userRole !== 'admin') return null;

  const { data, loading, error } = useSiteDataQuality(practitionerId);
  const [followupOpen, setFollowupOpen] = useState(false);

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div
        className="w-full bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 animate-pulse"
        aria-label="Loading data quality panel"
      >
        <div className="h-5 w-48 bg-slate-800 rounded mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[0, 1, 2, 3].map((i) => <div key={i} className="h-10 bg-slate-800/50 rounded-xl" />)}
        </div>
      </div>
    );
  }

  // ── Error ──────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="w-full bg-red-950/20 border border-red-900/30 rounded-3xl p-5">
        <p className="text-sm text-red-400 font-medium">Data quality panel unavailable: {error}</p>
      </div>
    );
  }

  // ── Zero-state: no session data yet ───────────────────────────────────────
  if (!data) {
    return (
      <div className="w-full bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 text-center">
        <Database className="w-10 h-10 text-slate-600 mx-auto mb-4" aria-hidden="true" />
        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-2">Intelligence Layer Readiness</h3>
        <p className="text-sm text-slate-500">No session data yet. Log your first session to activate the intelligence layer.</p>
      </div>
    );
  }

  const totalSessions = data.total_sessions ?? 0;
  const protocolRatio = totalSessions > 0 ? (data.sessions_with_protocol_id ?? 0) / totalSessions : null;
  const safetyRatio = totalSessions > 0 ? Math.min((data.sessions_with_safety_events ?? 0) / totalSessions, 1) : null;

  // Any red metric triggers the callout
  const hasRedMetric =
    getStatus(protocolRatio) === 'red' ||
    getStatus(data.overall_followup_completion_rate) === 'red' ||
    getStatus(data.avg_completeness_score) === 'red';

  return (
    <section
      aria-labelledby="dq-panel-title"
      className="w-full bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-3xl p-5 md:p-6 flex flex-col gap-5"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 id="dq-panel-title" className="text-sm font-black text-slate-300 uppercase tracking-widest mb-0.5">
            Intelligence Layer Readiness
          </h2>
          <p className="ppn-meta text-slate-500">
            Live · mv_site_documentation_summary · mv_site_followup_compliance
          </p>
        </div>
        <div className="flex-shrink-0 p-2 rounded-2xl bg-indigo-500/10 border border-slate-700/50">
          <Database className="w-5 h-5 text-indigo-400" aria-hidden="true" />
        </div>
      </div>

      {/* Row 1 — Intelligence Layer Readiness Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <MetricRow
          label="Sessions with Protocol ID"
          numerator={data.sessions_with_protocol_id}
          denominator={totalSessions}
          ratio={protocolRatio}
        />
        <MetricRow
          label="Sessions with Safety Events"
          numerator={data.sessions_with_safety_events}
          denominator={totalSessions}
          ratio={safetyRatio}
        />
        <MetricRow
          label="Follow-up Windows Completed"
          numerator={null}
          denominator={null}
          ratio={data.overall_followup_completion_rate}
        />
        <MetricRow
          label="Avg Documentation Score"
          numerator={null}
          denominator={null}
          ratio={data.avg_completeness_score}
        />
      </div>

      {/* Row 2 — Follow-up compliance detail (collapsible) */}
      <div className="border-t border-slate-800 pt-4">
        <button
          onClick={() => setFollowupOpen((o) => !o)}
          aria-expanded={followupOpen}
          aria-controls="dq-followup-detail"
          className="flex items-center gap-2 text-sm font-black text-slate-400 hover:text-slate-200 uppercase tracking-widest transition-colors"
        >
          {followupOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          Follow-up Window Compliance
        </button>
        {followupOpen && (
          <div id="dq-followup-detail" className="mt-4">
            <FollowupTable rows={data.followup_compliance} />
          </div>
        )}
      </div>

      {/* Row 3 — Data quality improvement prompt (visible when any metric is 🔴) */}
      {hasRedMetric && (
        <div
          role="note"
          className="flex items-start gap-3 bg-amber-950/30 border border-amber-800/30 rounded-2xl p-4"
        >
          <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-sm text-amber-300 leading-relaxed">
            Complete session records activate the clinical intelligence layer — priority queue, trajectory tracking, and outcome benchmarks.
          </p>
        </div>
      )}
    </section>
  );
};

export default DataQualityPanel;
