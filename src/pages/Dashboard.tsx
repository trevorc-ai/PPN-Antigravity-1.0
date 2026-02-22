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
  return (
    <div
      onClick={() => link && navigate(link)}
      className={`card-glass rounded-3xl p-6 border-2 border-indigo-500/30 hover:border-indigo-500/50 transition-all ${link ? 'cursor-pointer hover:scale-[1.02] active:scale-95 hover:shadow-xl hover:shadow-amber-500/10' : ''}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-2xl ${color} bg-opacity-10`}>
          <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
        </div>
        {percentile && (
          <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <span className="text-xs font-black text-emerald-400">{percentile}</span>
          </div>
        )}
      </div>
      <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-2">{title}</h3>
      <div className="text-4xl font-black tracking-tight mb-1" style={{ color: '#9DAEC8' }}>{value}</div>
      <div className="flex items-center gap-2 text-sm">
        <span className={`font-bold ${change.startsWith('+') ? 'text-emerald-400' : 'text-slate-300'}`}>
          {change}
        </span>
        <span className="text-slate-500">vs last month</span>
      </div>
      <div className="mt-2 text-sm text-slate-300">
        {comparison}
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
      className="flex items-center gap-4 p-4 rounded-2xl bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 hover:border-indigo-500/50 transition-all group text-left w-full"
    >
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-black text-sm ${urgent ? 'bg-red-500/20 text-red-400 border-2 border-red-500/50' : 'bg-indigo-500/20 text-indigo-400'
        }`}>
        {number}
      </div>
      <span className="flex-1 text-sm font-medium text-slate-300 group-hover:text-slate-300 transition-colors">
        {text}
      </span>
      <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-colors" />
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
    <PageContainer className="min-h-screen bg-gradient-to-br from-[#080c14] via-[#0c1220] to-[#0a0e1a] text-slate-300 flex flex-col gap-8">

      {/* HEADER SECTION */}
      <Section spacing="tight" data-tour="dashboard-header" className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-800 pb-8">
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
          <h1 className="text-5xl font-black tracking-tighter" style={{ color: '#8BA5D3' }}>
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

      <Section spacing="tight">
        <div className="flex items-center gap-3 mb-4">
          <CheckCircle className="w-5 h-5 text-indigo-400" />
          <h2 className="text-xl font-black tracking-tight" style={{ color: '#A8B5D1' }}>Recommended Next Steps</h2>
          <span className="ml-auto text-xs text-slate-500 font-medium">Updated today</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <NextStepItem
            number={1}
            text="Start a new Wellness Journey session"
            link="/wellness-journey"
            urgent={false}
          />
          <NextStepItem
            number={2}
            text="View your Clinical Intelligence report"
            link="/analytics"
          />
          <NextStepItem
            number={3}
            text="Log pending follow-up sessions"
            link="/wellness-journey"
          />
        </div>
      </Section>



      {/* YOUR CLINIC PERFORMANCE (PRIMARY SECTION) */}
      < Section spacing="tight" >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black tracking-tight" style={{ color: '#A8B5D1' }}>Your Clinic Performance</h2>
          <span className="text-xs text-slate-500 font-medium">This Month</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <ClinicPerformanceCard
            title="Protocols Logged"
            value={protocols.length > 0 ? String(protocols.length) : '—'}
            change={protocols.length > 0 ? '+12%' : 'No data yet'}
            comparison={protocols.length > 0 ? 'Network avg: 18' : 'Log your first session'}
            icon={BarChart3}
            color="bg-indigo-500"
          />
          <ClinicPerformanceCard
            title="Benchmark Score"
            value={protocols.length > 0 ? '71%' : '—'}
            change={protocols.length > 0 ? '+3%' : 'Pending'}
            comparison={protocols.length > 0 ? 'Network avg: 68%' : 'Requires 10+ sessions'}
            percentile={protocols.length > 0 ? '62nd percentile' : undefined}
            icon={Target}
            color="bg-emerald-500"
          />
          <ClinicPerformanceCard
            title="Safety Alerts"
            value="—"
            change="Active monitoring"
            comparison="No active alerts"
            icon={AlertTriangle}
            color="bg-amber-500"
            link="/deep-dives/molecular-pharmacology"
          />
          <ClinicPerformanceCard
            title="Avg Session Time"
            value={protocols.length > 0 ? '4.2 hrs' : '—'}
            change={protocols.length > 0 ? '+0.3' : 'Pending data'}
            comparison={protocols.length > 0 ? 'Network avg: 4.0 hrs' : 'Requires session logs'}
            icon={Clock}
            color="bg-blue-500"
          />
        </div>
      </Section >


      {/* QUICK ACTIONS */}
      <Section spacing="tight">
        <h2 className="text-xl font-black tracking-tight mb-4" style={{ color: '#A8B5D1' }}>Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <button
            data-tour="wellness-journey"
            onClick={() => navigate('/wellness-journey')}
            className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-indigo-500/10 hover:bg-indigo-500 text-indigo-300 hover:text-slate-300 border border-indigo-500/20 hover:border-indigo-500 transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="w-6 h-6" />
            <span className="text-sm font-black uppercase tracking-wider">Log Protocol</span>
          </button>
          <button
            onClick={() => navigate('/analytics')}
            className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-blue-500/10 hover:bg-blue-500 text-blue-300 hover:text-slate-300 border border-blue-500/20 hover:border-blue-500 transition-all active:scale-95 cursor-pointer"
          >
            <BarChart3 className="w-6 h-6" />
            <span className="text-sm font-black uppercase tracking-wider">Analytics</span>
          </button>
          <button
            data-tour="interaction-checker"
            onClick={() => navigate('/interactions')}
            className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-amber-500/10 hover:bg-amber-500 text-amber-300 hover:text-slate-300 border border-amber-500/20 hover:border-amber-500 transition-all active:scale-95 cursor-pointer"
          >
            <Activity className="w-6 h-6" />
            <span className="text-sm font-black uppercase tracking-wider">Check Interactions</span>
          </button>
          <button
            onClick={() => navigate('/data-export')}
            className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500 text-emerald-300 hover:text-slate-300 border border-emerald-500/20 hover:border-emerald-500 transition-all active:scale-95 cursor-pointer"
          >
            <TrendingUp className="w-6 h-6" />
            <span className="text-sm font-black uppercase tracking-wider">Export Data</span>
          </button>
          <button
            onClick={() => navigate('/deep-dives/clinic-performance')}
            className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-purple-500/10 hover:bg-purple-500 text-purple-300 hover:text-slate-300 border border-purple-500/20 hover:border-purple-500 transition-all active:scale-95 cursor-pointer"
          >
            <Users className="w-6 h-6" />
            <span className="text-sm font-black uppercase tracking-wider">Benchmarks</span>
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
  );
}