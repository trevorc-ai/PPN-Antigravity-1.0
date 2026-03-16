
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ResponsiveContainer, AreaChart, Area, ReferenceLine,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip,
} from 'recharts';
import { Info, ChevronRight, Loader2, AlertCircle, Activity, Calendar, FlaskConical, ClipboardList, CheckCircle, AlertTriangle, Minus } from 'lucide-react';
import { PageContainer } from '../components/layouts/PageContainer';
import { AdvancedTooltip } from '../components/ui/AdvancedTooltip';
import { supabase } from '../supabaseClient';
import PractitionerProtocolBenchmark from '../features/practitioner-analytics/PractitionerProtocolBenchmark';

// ─── Types ────────────────────────────────────────────────────────────────────

interface SessionRecord {
  id: string;
  patient_uuid: string | null;
  patient_link_code_hash: string | null;
  session_date: string | null;
  session_type_id: number | null;
  substance_id: number | null;
  site_id: string | null;
  practitioner_id: string | null;
  route_id: number | null;
  concomitant_med_ids: number[] | null;
  dosage_mg: number | null;
}

interface Vital {
  recorded_at: string;
  heart_rate: number | null;
  bp_systolic: number | null;
  bp_diastolic: number | null;
  oxygen_saturation: number | null;
}

interface SafetyEvent {
  ae_id: string;
  safety_event_type_id: number | null;
  severity_grade_id: string | null;
  is_resolved: boolean | null;
  event_name?: string;
}

interface BaselineAssessment {
  phq9_score: number | null;
  gad7_score: number | null;
  assessment_date: string | null;
}

interface LongitudinalPoint {
  assessment_date: string;
  phq9_score: number | null;
  gad7_score: number | null;
}

interface PatientSession {
  id: string;
  session_date: string | null;
  session_type_id: number | null;
  substance_name?: string;
}

interface PriorProtocolSummaryRow {
  current_session_id: string;
  prior_session_id: string | null;
  prior_session_date: string | null;
  prior_substance_name: string | null;
}

interface TreatmentResultRow {
  patient_uuid: string | null;
  session_id: string | null;
  concept_code: string | null;
  concept_name: string | null;
  time_point_label: string | null;
  value_as_number: number | null;
  observation_timestamp: string | null;
}

interface SafetyFlagRow {
  session_id: string | null;
  flag_type: string | null;
  flag_code: string | null;
  flag_label: string | null;
  flag_timestamp: string | null;
  resolution_status: string | null;
  ctcae_grade: number | null;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const SESSION_TYPE_LABELS: Record<number, string> = {
  1: 'Preparation',
  2: 'Dosing',
  3: 'Integration',
};

const PHASE_COLORS: Record<string, string> = {
  Preparation: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  Dosing: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  Treatment: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  Integration: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
};

// AC #2 — Route labels
const ROUTE_LABELS: Record<number, string> = {
  1: 'IV (Intravenous)',
  2: 'IM (Intramuscular)',
  3: 'Oral / Sublingual',
  4: 'Intranasal',
  5: 'Transdermal',
};

// AC #4 — PHQ-9 severity bands (CANMAT / APA consensus)
function phq9Severity(score: number): { label: string; color: string } {
  if (score >= 20) return { label: 'Severe', color: 'text-red-400' };
  if (score >= 15) return { label: 'Mod-Severe', color: 'text-orange-400' };
  if (score >= 10) return { label: 'Moderate', color: 'text-amber-400' };
  if (score >= 5)  return { label: 'Mild', color: 'text-yellow-400' };
  return { label: 'None', color: 'text-emerald-400' };
}

// AC #4 — GAD-7 severity bands
function gad7Severity(score: number): { label: string; color: string } {
  if (score >= 15) return { label: 'Severe', color: 'text-red-400' };
  if (score >= 10) return { label: 'Moderate', color: 'text-amber-400' };
  if (score >= 5)  return { label: 'Mild', color: 'text-yellow-400' };
  return { label: 'None', color: 'text-emerald-400' };
}

// ─── Radar data builder ───────────────────────────────────────────────────────

function buildRadarData(substanceName: string) {
  const s = substanceName.toLowerCase();
  return [
    { subject: '5-HT2A (Psych)', A: s.includes('psilocybin') || s.includes('lsd') ? 120 : s.includes('mdma') ? 60 : 30, B: 100 },
    { subject: '5-HT2B (Cardio)', A: s.includes('mdma') ? 110 : 40, B: 90 },
    { subject: 'D2 (Dopamine)', A: 80, B: 110 },
    { subject: 'Adrenergic (HR)', A: s.includes('ibogaine') ? 120 : 95, B: 90 },
    { subject: 'SERT', A: s.includes('mdma') ? 140 : 60, B: 85 },
    { subject: 'NMDA', A: s.includes('ketamine') ? 130 : 20, B: 50 },
  ];
}

function scoreConceptMatch(conceptCode: string | null, conceptName: string | null, needle: 'phq9' | 'gad7'): boolean {
  const code = (conceptCode ?? '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const name = (conceptName ?? '').toLowerCase().replace(/[^a-z0-9]/g, '');
  if (needle === 'phq9') return code.includes('phq9') || name.includes('phq9');
  return code.includes('gad7') || name.includes('gad7');
}

// ─── Loading / Error shells ───────────────────────────────────────────────────

const LoadingState = () => (
  <div className="min-h-screen bg-[#0a1628] flex items-center justify-center">
    <div className="flex flex-col items-center gap-4 text-slate-400">
      <Loader2 className="w-10 h-10 animate-spin text-indigo-400" />
      <p className="text-sm font-bold uppercase tracking-widest">Loading clinical record…</p>
    </div>
  </div>
);

const ErrorState = ({ message, onBack }: { message: string; onBack: () => void }) => (
  <div className="min-h-screen bg-[#0a1628] flex items-center justify-center">
    <div className="max-w-md text-center space-y-4">
      <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
      <p className="text-white font-bold text-lg">Record not found</p>
      <p className="text-slate-400 text-sm">{message}</p>
      <button onClick={onBack} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black rounded-xl uppercase tracking-widest transition-all">
        ← Back to Protocols
      </button>
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const ProtocolDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Core data
  const [session, setSession] = useState<SessionRecord | null>(null);
  const [substanceName, setSubstanceName] = useState<string>('Unknown');
  const [vitals, setVitals] = useState<Vital[]>([]);
  const [safetyEvents, setSafetyEvents] = useState<SafetyEvent[]>([]);
  const [baseline, setBaseline] = useState<BaselineAssessment | null>(null);
  const [longitudinal, setLongitudinal] = useState<LongitudinalPoint[]>([]);
  const [patientSessions, setPatientSessions] = useState<PatientSession[]>([]);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    async function loadAll() {
      setLoading(true);
      setError(null);

      try {
        // 1. Fetch the primary session (migration 079: patient_link_code dropped → patient_link_code_hash)
        const { data: sessionData, error: sessionErr } = await supabase
          .from('log_clinical_records')
          .select('id, patient_uuid, patient_link_code_hash, session_date, session_type_id, substance_id, site_id, practitioner_id, route_id, concomitant_med_ids, dosage_mg')
          .eq('id', id)
          .single();

        if (sessionErr) throw new Error(`DB error: ${sessionErr.message} (code: ${sessionErr.code})`);
        if (!sessionData) throw new Error(
          'Session not found. This may be a permissions issue — confirm this session belongs to your clinic. Session ID: ' + id
        );
        if (cancelled) return;
        setSession(sessionData as SessionRecord);

        const patientUuid = sessionData.patient_uuid;

        // 2. Parallel fetches: substances ref + vitals + safety events + patient sessions
        // Migration 079: baseline/longitudinal use patient_uuid (not on log_clinical_records); skip those fetches when no patient_uuid
        const [
          substanceResult,
          vitalsResult,
          safetyResult,
          priorSummaryResult,
          treatmentResult,
        ] = await Promise.all([
          // All substance names
          supabase.from('ref_substances').select('substance_id, substance_name'),

          // Vitals for this session
          supabase
            .from('log_session_vitals')
            .select('recorded_at, heart_rate, bp_systolic, bp_diastolic, oxygen_saturation')
            .eq('session_id', id)
            .order('recorded_at', { ascending: true })
            .limit(50),

          // Outstanding safety flags for this session (view-backed)
          supabase
            .from('vw_protocol_detail_outstanding_safety_flags')
            .select('session_id, flag_type, flag_code, flag_label, flag_timestamp, resolution_status, ctcae_grade')
            .eq('session_id', id)
            .limit(20),

          // Prior protocol summary (view-backed)
          supabase
            .from('vw_protocol_detail_prior_protocol_summary')
            .select('current_session_id, prior_session_id, prior_session_date, prior_substance_name')
            .eq('current_session_id', id)
            .limit(1)
            .maybeSingle(),

          // Treatment results over time (view-backed)
          patientUuid
            ? supabase
              .from('vw_protocol_detail_treatment_results_over_time')
              .select('patient_uuid, session_id, concept_code, concept_name, time_point_label, value_as_number, observation_timestamp')
              .eq('patient_uuid', patientUuid)
              .order('observation_timestamp', { ascending: true })
              .limit(500)
            : Promise.resolve({ data: [], error: null }),
        ]);

        if (cancelled) return;

        // Build substance lookup map
        const sMap: Record<number, string> = {};
        for (const s of (substanceResult.data ?? [])) {
          sMap[s.substance_id] = s.substance_name;
        }
        const resolvedName = sessionData.substance_id
          ? (sMap[sessionData.substance_id] ?? `Substance #${sessionData.substance_id}`)
          : 'Unknown';
        setSubstanceName(resolvedName);

        setVitals((vitalsResult.data ?? []) as Vital[]);

        const mappedSafety = ((safetyResult.data ?? []) as SafetyFlagRow[]).map((row, index) => ({
          ae_id: `${row.session_id ?? id}-${index}`,
          safety_event_type_id: null,
          severity_grade_id: row.ctcae_grade != null ? String(row.ctcae_grade) : null,
          is_resolved: row.resolution_status ? row.resolution_status.toLowerCase().includes('resolved') : false,
          event_name: row.flag_label ?? row.flag_code ?? row.flag_type ?? 'Safety Flag',
        }));
        setSafetyEvents(mappedSafety);

        const priorSummary = priorSummaryResult.data as PriorProtocolSummaryRow | null;
        const priorSessions: PatientSession[] = priorSummary?.prior_session_id
          ? [{
            id: priorSummary.prior_session_id,
            session_date: priorSummary.prior_session_date,
            session_type_id: null,
            substance_name: priorSummary.prior_substance_name ?? undefined,
          }]
          : [];
        const currentSession: PatientSession = {
          id: sessionData.id,
          session_date: sessionData.session_date,
          session_type_id: sessionData.session_type_id,
          substance_name: resolvedName,
        };
        setPatientSessions([currentSession, ...priorSessions]);

        const treatmentRows = (treatmentResult.data ?? []) as TreatmentResultRow[];
        const byDate = new Map<string, { date: string; ts: number; phq9_score: number | null; gad7_score: number | null }>();
        for (const row of treatmentRows) {
          if (row.value_as_number == null) continue;
          const isPhq9 = scoreConceptMatch(row.concept_code, row.concept_name, 'phq9');
          const isGad7 = scoreConceptMatch(row.concept_code, row.concept_name, 'gad7');
          if (!isPhq9 && !isGad7) continue;

          const ts = row.observation_timestamp ? Date.parse(row.observation_timestamp) : Number.NaN;
          const dateKey = row.time_point_label
            ?? (row.observation_timestamp ? row.observation_timestamp.slice(0, 10) : 'Unknown');
          const existing = byDate.get(dateKey) ?? {
            date: dateKey,
            ts: Number.isNaN(ts) ? Number.MAX_SAFE_INTEGER : ts,
            phq9_score: null,
            gad7_score: null,
          };

          if (!Number.isNaN(ts)) existing.ts = Math.min(existing.ts, ts);
          if (isPhq9) existing.phq9_score = row.value_as_number;
          if (isGad7) existing.gad7_score = row.value_as_number;
          byDate.set(dateKey, existing);
        }

        const ordered = [...byDate.values()]
          .sort((a, b) => a.ts - b.ts)
          .map(({ date, phq9_score, gad7_score }) => ({ assessment_date: date, phq9_score, gad7_score }));

        setBaseline(ordered.length > 0 ? {
          assessment_date: ordered[0].assessment_date,
          phq9_score: ordered[0].phq9_score,
          gad7_score: ordered[0].gad7_score,
        } : null);
        setLongitudinal(ordered.slice(1));

      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadAll();
    return () => { cancelled = true; };
  }, [id]);

  if (loading) return <LoadingState />;
  if (error || !session) return <ErrorState message={error ?? 'Session data unavailable'} onBack={() => navigate('/protocols')} />;

  // ─── Derived display values ─────────────────────────────────────────────────
  const sessionLabel = SESSION_TYPE_LABELS[session.session_type_id ?? 0] ?? 'Session';
  const patientRef = session.patient_link_code_hash ?? session.id.substring(0, 12).toUpperCase();
  const displayDate = session.session_date ?? '—';
  const radarData = buildRadarData(substanceName);

  // PHQ-9 chart data: baseline → longitudinal points
  const phqChartData: Array<{ date: string; score: number | null }> = [];
  if (baseline?.phq9_score != null) {
    phqChartData.push({ date: baseline.assessment_date ?? 'Baseline', score: baseline.phq9_score });
  }
  for (const l of longitudinal) {
    if (l.phq9_score != null) {
      phqChartData.push({ date: l.assessment_date, score: l.phq9_score });
    }
  }
  if (phqChartData.length < 2) {
    phqChartData.push({ date: displayDate, score: null });
  }

  // AC #1 — Vitals chart data including diastolic
  const vitalChartData = vitals.map((v, i) => ({
    t: i + 1,
    hr: v.heart_rate,
    sys: v.bp_systolic,
    dia: v.bp_diastolic,
  })).filter(v => v.hr || v.sys || v.dia);

  // AC #2 — Route label derived value
  const routeLabel = session.route_id ? (ROUTE_LABELS[session.route_id] ?? `Route #${session.route_id}`) : null;

  // AC #3 — Session series position ("Session X of Y")
  const sortedSessions = [...patientSessions].sort((a, b) =>
    (a.session_date ?? '').localeCompare(b.session_date ?? '')
  );
  const sessionSeriesIndex = sortedSessions.findIndex(s => s.id === session.id) + 1;
  const sessionSeriesTotal = patientSessions.length;
  const seriesLabel = sessionSeriesTotal > 0
    ? `Session ${sessionSeriesIndex} of ${sessionSeriesTotal}`
    : null;

  // AC #5 — Pre-Session Clearance: BP from latest vitals
  const latestVitals = vitals.length > 0 ? vitals[vitals.length - 1] : null;
  const lastSys = latestVitals?.bp_systolic ?? null;
  const lastDia = latestVitals?.bp_diastolic ?? null;
  const bpStatus: 'green' | 'amber' | 'red' | 'grey' =
    lastSys == null ? 'grey'
    : lastSys > 160 ? 'red'
    : lastSys >= 140 ? 'amber'
    : 'green';
  const medCount = (session.concomitant_med_ids ?? []).length;
  const safetyEventCount = safetyEvents.length;

  const otherSessions = patientSessions.filter(s => s.id !== session.id);

  return (
    <div className="min-h-full bg-[#0a1628] text-slate-300 p-4 sm:p-8 animate-in fade-in duration-700 relative overflow-hidden print:bg-white print:text-black print:p-0 font-sans">

      {/* Print styles */}
      <style>{`
        @media print {
          @page { margin: 0.5cm; size: auto; }
          body { -webkit-print-color-adjust: exact; }
          .print-hidden { display: none !important; }
          .recharts-text { fill: #000 !important; font-weight: bold !important; }
        }
      `}</style>

      {/* Decorative glow */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-600/5 rounded-full blur-[180px] pointer-events-none print:hidden" />

      <PageContainer width="wide" className="!max-w-[1600px] space-y-8 relative z-10">

        {/* ── Nav Header ────────────────────────────────────────────── */}
        <div className="flex justify-between items-center print:hidden">
          <button
            onClick={() => navigate('/protocols')}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group px-2 py-1"
          >
            <span className="material-symbols-outlined text-lg group-hover:-translate-x-1 transition-transform">arrow_back</span>
            <span className="text-xs font-bold uppercase tracking-widest">Back to Protocols</span>
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 min-h-[44px] px-4 py-2 border border-slate-700 hover:bg-slate-800 text-slate-300 rounded-lg transition-all text-xs font-black uppercase tracking-widest"
          >
            <span className="material-symbols-outlined text-lg">print</span>
            Print Record
          </button>
        </div>

        {/* ── Identity Header ───────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/5 pb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-4 flex-wrap">
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight" style={{ color: '#8BA5D3' }}>
                {patientRef}
              </h1>
              <span className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest border ${PHASE_COLORS[sessionLabel] ?? 'bg-slate-800 text-slate-300 border-slate-700'}`}>
                {sessionLabel}
              </span>
            </div>
            <p className="text-slate-500 text-sm font-bold tracking-widest uppercase">
              {substanceName} · {displayDate}
              {patientSessions.length > 1 && ` · ${patientSessions.length} sessions on record`}
            </p>
          </div>
          <span className="text-xs font-mono text-slate-600 uppercase tracking-widest print:hidden">
            Session {session.id.substring(0, 8).toUpperCase()}
          </span>
        </div>

        {/* ── Main Grid ────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT PANEL */}
          <div className="lg:col-span-2 space-y-8">

            {/* Receptor Affinity Radar */}
            <section className="bg-[#0b0e14] border border-slate-800 rounded-[2.5rem] p-8 sm:p-10 shadow-2xl relative">
              <div className="flex items-center gap-4 mb-6">
                <div className="size-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                  <span className="material-symbols-outlined text-2xl">hexagon</span>
                </div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-black uppercase tracking-[0.2em]" style={{ color: '#A8B5D1' }}>Receptor Affinity Profile</h3>
                  <AdvancedTooltip content="Shows how strongly this substance binds to key receptors in the brain and body, compared to the normal baseline. Each point on the chart is a different biological target." side="top" learnMoreUrl="/help/overview">
                    <Info className="text-slate-600 hover:text-slate-300 transition-colors cursor-help print:hidden" size={16} />
                  </AdvancedTooltip>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                <div className="md:col-span-1 space-y-4">
                  <p className="text-sm font-bold leading-relaxed" style={{ color: '#8B9DC3' }}>
                    Micro-Pharmacology Analysis: Binding potency across critical safety and efficacy targets.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3">
                      <div className="size-2 rounded-full bg-blue-500" />
                      <span className="text-xs font-black text-slate-300 uppercase tracking-widest">{substanceName} (Target)</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="size-2 rounded-full bg-slate-600" />
                      <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Standard (Baseline)</span>
                    </li>
                  </ul>
                  <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-2xl">
                    <span className="block text-xs font-black text-purple-400 uppercase tracking-widest mb-1">Primary Mechanism</span>
                    <span className="text-xs font-bold text-slate-300">
                      {substanceName.toLowerCase().includes('ketamine') ? 'NMDA Antagonism' :
                        substanceName.toLowerCase().includes('mdma') ? 'SERT / 5-HT Release' :
                          substanceName.toLowerCase().includes('ibogaine') ? 'Multi-receptor / NaV' :
                            '5-HT2A Agonism (Psychedelic)'}
                    </span>
                  </div>
                </div>

                <div className="md:col-span-2 h-[300px] w-full bg-slate-900/30 rounded-3xl border border-slate-800 p-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                      <PolarGrid stroke="#334155" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                      <Radar name={substanceName} dataKey="A" stroke="#8b5cf6" strokeWidth={3} fill="#8b5cf6" fillOpacity={0.5} />
                      <Radar name="Standard" dataKey="B" stroke="#475569" strokeWidth={2} fill="#475569" fillOpacity={0.1} />
                      <ReTooltip
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', color: '#fff' }}
                        itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </section>

            {/* Vitals / Session Data */}
            <section className="bg-[#0b0e14] border border-slate-800 rounded-[2.5rem] p-8 sm:p-10 shadow-2xl">
              <div className="flex items-center gap-4 mb-8">
                <div className="size-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <Activity className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-black uppercase tracking-[0.2em]" style={{ color: '#A8B5D1' }}>Session Vitals</h3>
                  <AdvancedTooltip content="Heart rate and blood pressure readings logged during this session. Each point on the chart is one recorded reading." side="top" learnMoreUrl="/help/overview">
                    <Info className="text-slate-600 hover:text-slate-300 transition-colors cursor-help print:hidden" size={16} />
                  </AdvancedTooltip>
                </div>
              </div>

              {/* AC #1 — Vitals chart with diastolic + CANMAT SBP reference lines */}
              {vitalChartData.length > 0 ? (
                <div className="h-[240px] w-full bg-slate-900/30 rounded-3xl border border-slate-800 p-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={vitalChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="hrGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="sysGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="diaGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f97316" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="#334155" strokeDasharray="3 3" vertical={false} opacity={0.1} />
                      <XAxis dataKey="t" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} label={{ value: 'Reading #', fill: '#475569', fontSize: 10, position: 'insideBottom', offset: -5 }} />
                      <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} width={40} />
                      <ReTooltip
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f1f5f9', borderRadius: '12px' }}
                        itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                      />
                      {/* CANMAT SBP thresholds */}
                      <ReferenceLine y={140} stroke="#f59e0b" strokeDasharray="4 3" strokeWidth={1.5}
                        label={{ value: 'Do Not Start (SBP)', fill: '#f59e0b', fontSize: 9, position: 'insideTopRight' }}
                      />
                      <ReferenceLine y={160} stroke="#ef4444" strokeDasharray="4 3" strokeWidth={1.5}
                        label={{ value: 'Pause / Stop (SBP)', fill: '#ef4444', fontSize: 9, position: 'insideTopRight' }}
                      />
                      <Area type="monotone" dataKey="hr" name="Heart Rate (bpm)" stroke="#f59e0b" strokeWidth={2} fill="url(#hrGrad)" dot={{ r: 3, fill: '#f59e0b', strokeWidth: 0 }} connectNulls />
                      <Area type="monotone" dataKey="sys" name="Systolic BP (mmHg)" stroke="#ef4444" strokeWidth={2} fill="url(#sysGrad)" dot={{ r: 3, fill: '#ef4444', strokeWidth: 0 }} connectNulls />
                      <Area type="monotone" dataKey="dia" name="Diastolic BP (mmHg)" stroke="#f97316" strokeWidth={2} fill="url(#diaGrad)" dot={{ r: 3, fill: '#f97316', strokeWidth: 0 }} connectNulls />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="py-12 text-center space-y-3 bg-slate-900/20 rounded-3xl border border-slate-800/50">
                  <Activity className="w-10 h-10 text-slate-700 mx-auto" />
                  <p className="text-slate-600 font-black uppercase tracking-widest text-xs">No vitals recorded for this session</p>
                </div>
              )}

              {/* AC #1 — Latest vitals summary with Avg Diastolic */}
              {vitals.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                  {([
                    { label: 'Avg HR', value: Math.round(vitals.filter(v => v.heart_rate).reduce((a, v) => a + (v.heart_rate ?? 0), 0) / (vitals.filter(v => v.heart_rate).length || 1)), unit: 'bpm', color: 'text-amber-400' },
                    { label: 'Avg Systolic', value: Math.round(vitals.filter(v => v.bp_systolic).reduce((a, v) => a + (v.bp_systolic ?? 0), 0) / (vitals.filter(v => v.bp_systolic).length || 1)), unit: 'mmHg', color: 'text-red-400' },
                    { label: 'Avg Diastolic', value: Math.round(vitals.filter(v => v.bp_diastolic).reduce((a, v) => a + (v.bp_diastolic ?? 0), 0) / (vitals.filter(v => v.bp_diastolic).length || 1)), unit: 'mmHg', color: 'text-orange-400' },
                    { label: 'Avg O₂ Sat', value: Math.round(vitals.filter(v => v.oxygen_saturation).reduce((a, v) => a + (v.oxygen_saturation ?? 0), 0) / (vitals.filter(v => v.oxygen_saturation).length || 1)), unit: '%', color: 'text-emerald-400' },
                  ] as { label: string; value: number; unit: string; color: string }[]).map(stat => (
                    stat.value > 0 && (
                      <div key={stat.label} className="p-4 bg-slate-900/40 border border-slate-800 rounded-2xl">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
                        <p className={`text-2xl font-black ${stat.color}`}>{stat.value}<span className="text-xs text-slate-500 ml-1 font-bold">{stat.unit}</span></p>
                      </div>
                    )
                  ))}
                </div>
              )}
            </section>

            {/* PHQ-9 Efficacy Trajectory */}
            <section className="bg-[#0b0e14] border border-slate-800 rounded-[2.5rem] p-8 sm:p-10 shadow-2xl" id="phq9-trajectory">
              <div className="flex items-center gap-4 mb-8">
                <div className="size-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <span className="material-symbols-outlined text-2xl">monitoring</span>
                </div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-black uppercase tracking-[0.2em]" style={{ color: '#A8B5D1' }}>Efficacy Trajectory (PHQ-9)</h3>
                  <AdvancedTooltip content="Your patient's PHQ-9 depression scores over time. Lower scores mean less depression. The dashed green line marks the remission threshold (score of 5 or below)." side="top" learnMoreUrl="/help/overview">
                    <Info className="text-slate-600 hover:text-slate-300 transition-colors cursor-help print:hidden" size={16} />
                  </AdvancedTooltip>
                </div>
              </div>

              {phqChartData.filter(d => d.score != null).length >= 2 ? (
                <div className="h-[250px] w-full bg-slate-900/30 rounded-3xl border border-slate-800 p-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={phqChartData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2b74f3" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#2b74f3" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="#334155" strokeDasharray="3 3" vertical={false} opacity={0.1} />
                      <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} dy={10} />
                      <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} width={40} domain={[0, 27]} />
                      <ReTooltip
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f1f5f9', borderRadius: '12px' }}
                        itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                        labelStyle={{ color: '#94a3b8', fontSize: '10px', textTransform: 'uppercase' }}
                      />
                      <ReferenceLine y={5} stroke="#10b981" strokeDasharray="3 3" label={{ value: 'Remission', fill: '#10b981', fontSize: 10, position: 'insideBottomRight' }} />
                      <Area type="monotone" dataKey="score" name="PHQ-9 Score" stroke="#2b74f3" strokeWidth={3} fill="url(#chartGrad)" dot={{ r: 4, fill: '#2b74f3', strokeWidth: 0 }} connectNulls />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="py-12 text-center space-y-3 bg-slate-900/20 rounded-3xl border border-slate-800/50">
                  <span className="material-symbols-outlined text-4xl text-slate-700">bar_chart</span>
                  <p className="text-slate-600 font-black uppercase tracking-widest text-xs">
                    {baseline ? 'Baseline recorded, no follow-up assessments yet' : 'No PHQ-9 assessments on record'}
                  </p>
                  {baseline && (
                    <p className="text-slate-500 text-sm">
                      Baseline PHQ-9: <span className="text-white font-bold">{baseline.phq9_score ?? '—'}</span>
                    </p>
                  )}
                </div>
              )}
            </section>

            {/* WO-EPIC-606: Treatment Trend Forecast */}
            <PractitionerProtocolBenchmark
              sessionId={session.id}
              substanceName={substanceName}
              phqChartData={phqChartData}
              patientLinkCodeHash={session.patient_link_code_hash}
              gad7BaselineScore={baseline?.gad7_score ?? null}
              recentSessions={patientSessions.slice(0, 2)}
            />

          </div>

          {/* RIGHT PANEL */}
          <div className="lg:col-span-1 space-y-8">

            {/* Protocol Card */}
            <section className="bg-[#0b0e14] border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl">
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <label className="text-sm font-bold text-slate-500 uppercase tracking-widest">Protocol</label>
                    <AdvancedTooltip content="The substance, session type, date, and dosage logged for this protocol record." side="top" learnMoreUrl="/help/overview">
                      <Info className="text-slate-600 hover:text-indigo-400 transition-colors cursor-help print:hidden" size={14} />
                    </AdvancedTooltip>
                  </div>
                  <p className="text-3xl font-black tracking-tight" style={{ color: '#9DAEC8' }}>{substanceName}</p>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-800/50">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Session Type</span>
                    <span className="text-base font-bold text-slate-300">{sessionLabel}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Date</span>
                    <span className="text-base font-mono font-bold text-slate-300">{displayDate}</span>
                  </div>

                  {/* AC #2 — Route of administration */}
                  {routeLabel && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Route</span>
                      <span className="text-base font-bold text-slate-300">{routeLabel}</span>
                    </div>
                  )}

                  {/* AC #2 — Dosage (dosage_mg verified present on log_clinical_records) */}
                  {session.dosage_mg != null && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Dosage</span>
                      <span className="text-base font-bold text-amber-300">{session.dosage_mg} mg</span>
                    </div>
                  )}

                  {/* AC #3 — Session series ("Session X of Y") */}
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Session Series</span>
                    <span className="text-base font-bold text-indigo-400">{seriesLabel ?? `${sessionSeriesTotal} on record`}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800/50">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-widest block mb-2">Patient Reference</label>
                  <div className="p-3 bg-black border border-slate-800 rounded-xl font-mono text-xs text-slate-300 break-all leading-relaxed">
                    {patientRef}
                  </div>
                </div>

                {/* AC #4 — Baseline Assessments with severity band labels */}
                {baseline && (
                  <div className="pt-4 border-t border-slate-800/50 space-y-3">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-widest block">Baseline Assessments</label>
                    {baseline.phq9_score != null && (() => {
                      const sev = phq9Severity(baseline.phq9_score!);
                      return (
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">PHQ-9</span>
                          <div className="text-right">
                            <span className={`text-base font-black ${sev.color}`}>{baseline.phq9_score}/27</span>
                            <span className={`block text-xs font-bold ${sev.color} opacity-80`}>{sev.label}</span>
                          </div>
                        </div>
                      );
                    })()}
                    {baseline.gad7_score != null && (() => {
                      const sev = gad7Severity(baseline.gad7_score!);
                      return (
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">GAD-7</span>
                          <div className="text-right">
                            <span className={`text-base font-black ${sev.color}`}>{baseline.gad7_score}/21</span>
                            <span className={`block text-xs font-bold ${sev.color} opacity-80`}>{sev.label}</span>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            </section>

            {/* AC #5 — Pre-Session Clearance Checklist Strip (read-only, display-only, no DB writes) */}
            <section className="bg-[#0b0e14] border border-slate-800 rounded-[2.5rem] p-6 shadow-2xl">
              <div className="flex items-center gap-3 mb-5">
                <span className="material-symbols-outlined text-2xl text-indigo-400">checklist</span>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black uppercase tracking-widest" style={{ color: '#A8B5D1' }}>Session Clearance</h3>
                  <AdvancedTooltip content="Read-only safety snapshot at time of review. BP threshold: CANMAT guideline (do not start above 140/90 mmHg, pause or stop above 160 mmHg systolic)." side="bottom" learnMoreUrl="/help/overview">
                    <Info className="text-slate-600 hover:text-slate-300 transition-colors cursor-help print:hidden" size={13} />
                  </AdvancedTooltip>
                </div>
              </div>
              <div className="space-y-3">
                {/* BP Pre-Dose row */}
                <div className="flex items-center gap-3 py-2 border-b border-slate-800/50">
                  {bpStatus === 'green' && <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />}
                  {bpStatus === 'amber' && <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />}
                  {bpStatus === 'red'   && <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />}
                  {bpStatus === 'grey'  && <Minus className="w-4 h-4 text-slate-600 shrink-0" />}
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex-1">BP Pre-Dose</span>
                  {lastSys != null ? (
                    <span className={`text-sm font-black ${
                      bpStatus === 'green' ? 'text-emerald-400' :
                      bpStatus === 'amber' ? 'text-amber-400' : 'text-red-400'
                    }`}>{lastSys}{lastDia != null ? `/${lastDia}` : ''} mmHg</span>
                  ) : (
                    <span className="text-sm font-bold text-slate-600">No data</span>
                  )}
                </div>
                {/* Concomitant Meds row */}
                <div className="flex items-center gap-3 py-2 border-b border-slate-800/50">
                  {medCount > 0
                    ? <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                    : <Minus className="w-4 h-4 text-slate-600 shrink-0" />}
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex-1">Concomitant Meds</span>
                  {medCount > 0
                    ? <span className="text-sm font-black text-amber-400">{medCount} listed</span>
                    : <span className="text-sm font-bold text-slate-600">None</span>}
                </div>
                {/* Safety Events row */}
                <div className="flex items-center gap-3 py-2 border-b border-slate-800/50">
                  {safetyEventCount === 0
                    ? <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    : <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />}
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex-1">Safety Events</span>
                  {safetyEventCount === 0
                    ? <span className="text-sm font-black text-emerald-400">None</span>
                    : <span className="text-sm font-black text-red-400">{safetyEventCount} logged</span>}
                </div>
                {/* Session Series row */}
                <div className="flex items-center gap-3 py-2">
                  <Minus className="w-4 h-4 text-slate-500 shrink-0" />
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex-1">Sessions on Record</span>
                  <span className="text-sm font-bold text-indigo-400">{seriesLabel ?? `${sessionSeriesTotal} total`}</span>
                </div>
              </div>
            </section>

            {/* Safety Monitor */}
            <section className="bg-[#0b0e14] border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-[50px] pointer-events-none" />

              <div className="flex items-center gap-3 mb-6 relative z-10">
                <span className="material-symbols-outlined text-3xl text-red-400">medical_services</span>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black uppercase tracking-widest" style={{ color: '#A8B5D1' }}>Safety Monitor</h3>
                  <AdvancedTooltip content="Any adverse events logged during this session, including their severity grade and whether they were resolved." side="bottom" learnMoreUrl="/help/overview">
                    <Info className="text-slate-600 hover:text-slate-300 transition-colors cursor-help print:hidden" size={14} />
                  </AdvancedTooltip>
                </div>
              </div>

              <div className="relative z-10">
                {safetyEvents.length > 0 ? (
                  <div className="space-y-3">
                    {safetyEvents.map(ev => (
                      <div key={ev.ae_id} className="p-4 bg-red-950/20 border border-red-900/50 rounded-2xl">
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-sm font-black text-red-400 uppercase">
                            {ev.event_name ?? `Event #${ev.safety_event_type_id}`}
                          </span>
                          {ev.severity_grade_id && (
                            <span className="px-2 py-0.5 bg-red-900/40 rounded text-xs font-black text-red-200 uppercase tracking-widest">
                              Grade {ev.severity_grade_id}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-red-300/70">
                          {ev.is_resolved ? '✓ Resolved' : '⚠ Unresolved'}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-4 bg-emerald-950/20 border border-emerald-900/30 rounded-2xl">
                    <span className="material-symbols-outlined text-emerald-500">check_circle</span>
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">No Events Recorded</span>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>

        {/* ── Patient Session History ──────────────────────────────── */}
        {otherSessions.length > 0 && (
          <section className="bg-[#05070a]/50 border border-slate-800/50 rounded-[2.5rem] p-8 sm:p-12 mb-20 animate-in slide-in-from-bottom-10 duration-1000">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <ClipboardList className="text-indigo-400 w-6 h-6" />
                  <h3 className="text-2xl font-black uppercase tracking-tighter" style={{ color: '#A8B5D1' }}>Session History</h3>
                </div>
                <p className="text-slate-500 text-sm font-bold tracking-widest uppercase">
                  All sessions for patient {patientRef}
                </p>
              </div>
              <div className="px-5 py-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                <span className="text-xs font-black text-indigo-400 uppercase tracking-widest">
                  {patientSessions.length} Sessions Total
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {otherSessions.map(s => {
                const label = SESSION_TYPE_LABELS[s.session_type_id ?? 0] ?? 'Session';
                return (
                  <div
                    key={s.id}
                    onClick={() => navigate(`/protocol/${s.id}`)}
                    className="group p-6 bg-slate-900/30 border border-slate-800 hover:border-indigo-500/50 hover:bg-indigo-500/5 rounded-[2rem] transition-all cursor-pointer relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ChevronRight className="text-indigo-400" size={18} />
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <span className="text-xs font-black text-slate-500 uppercase tracking-widest block">Session ID</span>
                          <span className="text-sm font-mono font-black text-slate-300 uppercase">{s.id.substring(0, 8).toUpperCase()}</span>
                        </div>
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg border ${PHASE_COLORS[label] ?? 'bg-slate-800 text-slate-400 border-slate-700'}`}>
                          {label}
                        </span>
                      </div>
                      <div className="pt-3 border-t border-slate-800/50 space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-slate-500 uppercase tracking-widest">Date</span>
                          <span className="font-black text-slate-300">{s.session_date ?? '—'}</span>
                        </div>
                        {s.substance_name && (
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-bold text-slate-500 uppercase tracking-widest">Substance</span>
                            <span className="font-black text-indigo-300">{s.substance_name}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

      </PageContainer>

      {/* Print footer */}
      <div className="hidden print:block fixed bottom-0 left-0 w-full text-center text-xs font-mono font-bold uppercase text-black pb-4">
        Confidential Clinical Record · PPN Platform · Do Not Distribute
      </div>
    </div>
  );
};

export default ProtocolDetail;
