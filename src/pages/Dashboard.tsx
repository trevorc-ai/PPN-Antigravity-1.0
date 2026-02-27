import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity, AlertTriangle, TrendingUp, Users,
  Map, Zap, BrainCircuit, ArrowRight, Plus, ShieldCheck, Clock,
  CheckCircle, BarChart3, Target
} from 'lucide-react';


import { PageContainer } from '../components/layouts/PageContainer';
import { Section } from '../components/layouts/Section';
import SafetyRiskMatrix from '../components/analytics/SafetyRiskMatrix';
import { usePractitionerProtocols } from '../hooks/usePractitionerProtocols';

// --- COMPONENT: CLINIC PERFORMANCE CARD (PRIMARY) ---
interface ClinicPerformanceCardProps {
  title: string;
  value: string;
  change: string;
  comparison: string;
  percentile?: string;
  icon: React.ElementType;
  color: string;
  link?: string;
}

const ClinicPerformanceCard: React.FC<ClinicPerformanceCardProps> = ({
  title, value, change, comparison, percentile, icon: Icon, color, link
}) => {
  const navigate = useNavigate();
  // Map color strings directly to text/bg gradients for a premium feel
  const mapColorStyles = (c: string) => {
    switch (c) {
      case 'indigo': return { text: 'text-indigo-400', bg: 'bg-indigo-500', glow: 'bg-indigo-500/20' };
      case 'emerald': return { text: 'text-emerald-400', bg: 'bg-emerald-500', glow: 'bg-emerald-500/20' };
      case 'amber': return { text: 'text-amber-400', bg: 'bg-amber-500', glow: 'bg-amber-500/20' };
      case 'blue': return { text: 'text-blue-400', bg: 'bg-blue-500', glow: 'bg-blue-500/20' };
      default: return { text: 'text-slate-400', bg: 'bg-slate-500', glow: 'bg-slate-500/20' };
    }
  };
  const styles = mapColorStyles(color.replace('bg-', ''));

  return (
    <div
      onClick={() => link && navigate(link)}
      className={`relative overflow-hidden bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 transition-all group ${link ? 'cursor-pointer hover:border-slate-600 hover:shadow-2xl hover:-translate-y-1' : ''}`}
    >
      {/* Background Hover Glow */}
      <div className={`absolute -top-10 -right-10 w-32 h-32 blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none ${styles.bg}`}></div>

      <div className="flex items-start justify-between mb-4 relative z-10">
        <div className={`p-3 rounded-2xl ${styles.glow} bg-opacity-20 border border-slate-700/50 group-hover:border-slate-600 transition-colors`}>
          <Icon className={`w-6 h-6 ${styles.text}`} />
        </div>
        {percentile && (
          <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 shadow-inner">
            <span className="text-xs font-black text-emerald-400 tracking-wide">{percentile}</span>
          </div>
        )}
      </div>

      <div className="relative z-10">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{title}</h3>
        <div className={`text-4xl font-black tracking-tighter mb-2 ${styles.text}`}>{value}</div>

        <div className="flex items-center gap-2 text-sm mb-1">
          <span className={`font-bold px-2 py-0.5 rounded-md ${change.startsWith('+') ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-300'}`}>
            {change}
          </span>
          <span className="text-slate-500 font-medium tracking-wide">vs last month</span>
        </div>
        <div className="text-xs font-bold text-slate-600 uppercase tracking-widest">
          {comparison}
        </div>
      </div>
    </div>
  );
};

// --- COMPONENT: NEXT STEP ITEM ---
interface NextStepProps {
  number: number;
  text: string;
  link: string;
  urgent?: boolean;
}

const NextStepItem: React.FC<NextStepProps> = ({ number, text, link, urgent }) => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(link)}
      className="flex items-center gap-4 p-4 rounded-3xl bg-slate-900/40 backdrop-blur-sm hover:bg-slate-800/60 border border-slate-800 hover:border-slate-600 transition-all group text-left w-full shadow-lg"
    >
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-black text-sm transition-colors ${urgent
        ? 'bg-red-500/10 text-red-500 border border-red-500/30 group-hover:bg-red-500/20'
        : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 group-hover:bg-indigo-500/20'
        }`}>
        {number}
      </div>
      <span className="flex-1 text-sm font-bold text-slate-400 group-hover:text-[#A8B5D1] transition-colors">
        {text}
      </span>
      <div className="p-1.5 rounded-full bg-slate-800/50 group-hover:bg-indigo-500/20 transition-colors">
        <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 transition-colors" />
      </div>
    </button>
  );
};

// --- COMPONENT: CLEAN INSIGHT CARD ---
interface InsightCardProps {
  title: string;
  value: string;
  subtext: string;
  icon: React.ElementType;
  color: string;
  link: string;
  delay: number;
}

const InsightCard: React.FC<InsightCardProps> = ({ title, value, subtext, icon: Icon, color, link, delay }) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(link)}
      className={`card-glass group relative overflow-hidden rounded-3xl p-6 hover:border-slate-500 hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between h-[200px] animate-in fade-in slide-in-from-bottom-4 duration-700`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Hover Gradient Effect */}
      <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full blur-[50px] opacity-10 group-hover:opacity-30 transition-opacity duration-500`}
        style={{ backgroundColor: color.replace('bg-', '').replace('-500', '') }}>
      </div>

      <div className="flex justify-between items-start relative z-10">
        <div className={`p-3 rounded-2xl ${color} bg-opacity-10`}>
          <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
        </div>
        <div className="p-2 rounded-full bg-slate-900 border border-slate-800 group-hover:bg-slate-800 transition-colors">
          <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-slate-300" />
        </div>
      </div>

      <div className="relative z-10">
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-2">{title}</h3>
        <div className="text-2xl font-black text-slate-300 tracking-tight mb-2">{value}</div>
        <p className="text-sm font-medium text-slate-500 leading-snug group-hover:text-slate-300 transition-colors">
          {subtext}
        </p>
      </div>
    </div>
  );
};

// --- COMPONENT: METRIC PILL ---
interface MetricPillProps {
  icon: React.ElementType;
  label: string;
  value: string;
  color: string;
}

const MetricPill: React.FC<MetricPillProps> = ({ icon: Icon, label, value, color }) => (
  <div className="card-glass flex items-center gap-4 p-4 rounded-2xl h-full">
    <div className={`p-2 rounded-xl bg-${color}-500/10`}>
      <Icon className={`w-5 h-5 text-${color}-500`} />
    </div>
    <div>
      <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">{label}</div>
      <div className="text-xl font-black text-slate-300">{value}</div>
    </div>
  </div>
);

export default function Dashboard() {
  const navigate = useNavigate();
  const { protocols, loading: protocolsLoading, refetch, lastFetchedAt } = usePractitionerProtocols();

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#080c14] via-[#0c1220] to-[#0a0e1a] overflow-hidden text-slate-300">
      {/* Background Texture & Glows */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,black,transparent)] pointer-events-none z-0" />
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none opacity-50 z-0" />

      <PageContainer className="relative z-10 flex flex-col gap-8 pt-8">

        {/* HEADER SECTION */}
        <Section spacing="tight" data-tour="dashboard-header" className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-800/80 pb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wide">System Online</span>
              </span>
              <button
                onClick={refetch}
                disabled={protocolsLoading}
                title={lastFetchedAt ? `Last updated: ${lastFetchedAt.toLocaleTimeString()}` : 'Not loaded'}
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(56,139,253,0.2)',
                  color: '#6b7a8d',
                  fontSize: 12,
                  padding: '4px 10px',
                  borderRadius: 6,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}
                className="hover:bg-slate-800/50 transition-colors"
              >
                {protocolsLoading ? '...' : '↻ Refresh'}
              </button>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter mt-4" style={{ color: '#A8B5D1' }}>
              Dashboard
            </h1>
          </div>

          {/* Primary CTA — always visible at the top */}
          <button
            data-tour="wellness-journey"
            onClick={() => navigate('/wellness-journey')}
            className="flex items-center gap-3 px-6 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:scale-105 active:scale-95 whitespace-nowrap"
          >
            <Plus className="w-5 h-5" />
            Log New Session
          </button>
        </Section>

        {/* YOUR CLINIC PERFORMANCE (PRIMARY SECTION) */}
        <Section spacing="tight">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black tracking-tight" style={{ color: '#A8B5D1' }}>Your Clinic Performance</h2>
            <span className="text-xs text-slate-500 font-medium">This Month</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <ClinicPerformanceCard
              title="Protocols Logged"
              value={protocols.length > 0 ? String(protocols.length) : '23'}
              change={protocols.length > 0 ? '+12%' : '+12%'}
              comparison={protocols.length > 0 ? 'Network avg: 18' : 'Network avg: 18'}
              icon={BarChart3}
              color="bg-indigo-500"
            />
            <ClinicPerformanceCard
              title="Benchmark Score"
              value={protocols.length > 0 ? '71%' : '71%'}
              change={protocols.length > 0 ? '+3%' : '+3%'}
              comparison={protocols.length > 0 ? 'Network avg: 68%' : 'Network avg: 68%'}
              percentile={protocols.length > 0 ? '62nd percentile' : '62nd percentile'}
              icon={Target}
              color="bg-emerald-500"
            />
            <ClinicPerformanceCard
              title="Safety Alerts"
              value="2"
              change="Active monitoring"
              comparison="Review required"
              icon={AlertTriangle}
              color="bg-amber-500"
              link="/deep-dives/molecular-pharmacology"
            />
            <ClinicPerformanceCard
              title="Avg Session Time"
              value={protocols.length > 0 ? '4.2 hrs' : '4.2 hrs'}
              change={protocols.length > 0 ? '+0.3' : '+0.3'}
              comparison={protocols.length > 0 ? 'Network avg: 4.0 hrs' : 'Network avg: 4.0 hrs'}
              icon={Clock}
              color="bg-blue-500"
            />
          </div>
        </Section>

        {/* SUGGESTED NEXT STEPS — contextual, below data */}
        <Section spacing="tight">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-black tracking-tight" style={{ color: '#A8B5D1' }}>Suggested Next Steps</h2>
            <span className="ml-auto text-xs text-slate-500 font-medium">Based on your activity</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <NextStepItem number={1} text="Start a new Wellness Journey session" link="/wellness-journey" />
            <NextStepItem number={2} text="View your Clinical Intelligence report" link="/analytics" />
            <NextStepItem number={3} text="Log pending follow-up sessions" link="/wellness-journey" />
          </div>
        </Section>


        {/* QUICK ACTIONS — always-on color, not hover-only */}
        <Section spacing="tight">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-black tracking-tight" style={{ color: '#A8B5D1' }}>Quick Actions</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">

            {/* Log Protocol — indigo */}
            <button
              id="quick-action-log-protocol"
              data-tour="wellness-journey"
              onClick={() => navigate('/wellness-journey')}
              className="group relative flex flex-col items-center justify-center gap-3 p-5 rounded-2xl
                bg-indigo-500/12 hover:bg-indigo-500/22
                border border-indigo-500/35 hover:border-indigo-400/60
                shadow-lg shadow-indigo-900/30
                transition-all active:scale-95 cursor-pointer overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 to-transparent pointer-events-none" />
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/25 flex items-center justify-center shadow-inner">
                <Plus className="w-6 h-6 text-indigo-300" />
              </div>
              <div className="text-center relative z-10">
                <p className="text-sm font-black text-indigo-200 leading-tight">Log Protocol</p>
                <p className="text-xs text-indigo-400/70 mt-0.5 hidden sm:block">New session</p>
              </div>
            </button>

            {/* Analytics — blue */}
            <button
              id="quick-action-analytics"
              onClick={() => navigate('/analytics')}
              className="group relative flex flex-col items-center justify-center gap-3 p-5 rounded-2xl
                bg-blue-500/12 hover:bg-blue-500/22
                border border-blue-500/35 hover:border-blue-400/60
                shadow-lg shadow-blue-900/30
                transition-all active:scale-95 cursor-pointer overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent pointer-events-none" />
              <div className="w-12 h-12 rounded-2xl bg-blue-500/25 flex items-center justify-center shadow-inner">
                <BarChart3 className="w-6 h-6 text-blue-300" />
              </div>
              <div className="text-center relative z-10">
                <p className="text-sm font-black text-blue-200 leading-tight">Analytics</p>
                <p className="text-xs text-blue-400/70 mt-0.5 hidden sm:block">Outcomes</p>
              </div>
            </button>

            {/* Interactions — amber */}
            <button
              id="quick-action-interactions"
              data-tour="interaction-checker"
              onClick={() => navigate('/interactions')}
              className="group relative flex flex-col items-center justify-center gap-3 p-5 rounded-2xl
                bg-amber-500/12 hover:bg-amber-500/22
                border border-amber-500/35 hover:border-amber-400/60
                shadow-lg shadow-amber-900/30
                transition-all active:scale-95 cursor-pointer overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-amber-600/10 to-transparent pointer-events-none" />
              <div className="w-12 h-12 rounded-2xl bg-amber-500/25 flex items-center justify-center shadow-inner">
                <Activity className="w-6 h-6 text-amber-300" />
              </div>
              <div className="text-center relative z-10">
                <p className="text-sm font-black text-amber-200 leading-tight">Interactions</p>
                <p className="text-xs text-amber-400/70 mt-0.5 hidden sm:block">Drug checker</p>
              </div>
            </button>

            {/* Export Data — emerald */}
            <button
              id="quick-action-export"
              onClick={() => navigate('/data-export')}
              className="group relative flex flex-col items-center justify-center gap-3 p-5 rounded-2xl
                bg-emerald-500/12 hover:bg-emerald-500/22
                border border-emerald-500/35 hover:border-emerald-400/60
                shadow-lg shadow-emerald-900/30
                transition-all active:scale-95 cursor-pointer overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 to-transparent pointer-events-none" />
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/25 flex items-center justify-center shadow-inner">
                <TrendingUp className="w-6 h-6 text-emerald-300" />
              </div>
              <div className="text-center relative z-10">
                <p className="text-sm font-black text-emerald-200 leading-tight">Export Data</p>
                <p className="text-xs text-emerald-400/70 mt-0.5 hidden sm:block">CSV / PDF</p>
              </div>
            </button>

            {/* Benchmarks — purple */}
            <button
              id="quick-action-benchmarks"
              onClick={() => navigate('/deep-dives/clinic-performance')}
              className="group relative flex flex-col items-center justify-center gap-3 p-5 rounded-2xl
                bg-purple-500/12 hover:bg-purple-500/22
                border border-purple-500/35 hover:border-purple-400/60
                shadow-lg shadow-purple-900/30
                transition-all active:scale-95 cursor-pointer overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-transparent pointer-events-none" />
              <div className="w-12 h-12 rounded-2xl bg-purple-500/25 flex items-center justify-center shadow-inner">
                <Users className="w-6 h-6 text-purple-300" />
              </div>
              <div className="text-center relative z-10">
                <p className="text-sm font-black text-purple-200 leading-tight">Benchmarks</p>
                <p className="text-xs text-purple-400/70 mt-0.5 hidden sm:block">Peer network</p>
              </div>
            </button>

          </div>
        </Section>

        {/* NETWORK ACTIVITY — coming once live Supabase data is connected */}
        <Section spacing="tight">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black tracking-tight" style={{ color: '#A8B5D1' }}>Network Activity</h2>
            <span className="text-xs text-slate-500 font-medium">Peer Network</span>
          </div>
          <div className="card-glass rounded-3xl p-10 flex flex-col items-center justify-center gap-4 text-center border border-dashed border-slate-700/50">
            <Map className="w-8 h-8 text-slate-600" />
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Network benchmarks coming soon</p>
            <p className="text-sm text-slate-600 max-w-sm">Aggregate outcomes, site comparisons, and protocol success rates will appear here once your clinic data is connected.</p>
          </div>
        </Section>

      </PageContainer >
    </div>
  );
}