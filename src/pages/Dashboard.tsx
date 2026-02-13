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
}

const ClinicPerformanceCard: React.FC<ClinicPerformanceCardProps> = ({
  title, value, change, comparison, percentile, icon: Icon, color
}) => (
  <div className="card-glass rounded-3xl p-6 border-2 border-indigo-500/30 hover:border-indigo-500/50 transition-all">
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
    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{title}</h3>
    <div className="text-4xl font-black text-white tracking-tight mb-1">{value}</div>
    <div className="flex items-center gap-2 text-sm">
      <span className={`font-bold ${change.startsWith('+') ? 'text-emerald-400' : 'text-slate-400'}`}>
        {change}
      </span>
      <span className="text-slate-500">vs last month</span>
    </div>
    <div className="mt-2 text-sm text-slate-400">
      {comparison}
    </div>
  </div>
);

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
      <span className="flex-1 text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
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
          <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-white" />
        </div>
      </div>

      <div className="relative z-10">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">{title}</h3>
        <div className="text-2xl font-black text-white tracking-tight mb-2">{value}</div>
        <p className="text-xs font-medium text-slate-500 leading-snug group-hover:text-slate-300 transition-colors">
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
      <div className="text-xl font-black text-white">{value}</div>
    </div>
  </div>
);

export default function Dashboard() {
  const navigate = useNavigate();
  const { protocols, loading: protocolsLoading } = usePractitionerProtocols();

  return (
    <PageContainer className="min-h-screen bg-background-dark text-white flex flex-col gap-8">

      {/* HEADER SECTION */}
      <Section spacing="tight" className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-800 pb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wide">System Online</span>
            </span>
            <span className="text-[11px] font-medium text-slate-500 font-mono">ID: 8842-ALPHA</span>
            <span className="text-[11px] font-medium text-slate-500">Last updated: 2 min ago</span>
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-white">
            Dashboard
          </h1>
        </div>
      </Section>

      {/* YOUR CLINIC PERFORMANCE (PRIMARY SECTION) */}
      <Section spacing="tight">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-white tracking-tight">Your Clinic Performance</h2>
          <span className="text-xs text-slate-500 font-medium">This Month</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <ClinicPerformanceCard
            title="Protocols Logged"
            value="23"
            change="+12%"
            comparison="Network avg: 18"
            icon={BarChart3}
            color="bg-indigo-500"
          />
          <ClinicPerformanceCard
            title="Success Rate"
            value="71%"
            change="+3%"
            comparison="Network avg: 68%"
            percentile="62nd percentile"
            icon={Target}
            color="bg-emerald-500"
          />
          <ClinicPerformanceCard
            title="Safety Alerts"
            value="2"
            change="-1"
            comparison="Review needed"
            icon={AlertTriangle}
            color="bg-amber-500"
          />
          <ClinicPerformanceCard
            title="Avg Session Time"
            value="4.2 hrs"
            change="+0.3"
            comparison="Network avg: 4.0 hrs"
            icon={Clock}
            color="bg-blue-500"
          />
        </div>
      </Section>

      {/* SAFETY RISK ASSESSMENT */}
      <Section spacing="tight">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">Safety Risk Assessment</h2>
            <p className="text-sm text-slate-400 mt-1">Your protocols vs. network risk profile</p>
          </div>
          <button
            onClick={() => navigate('/deep-dives/risk-matrix')}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-indigo-500/50 text-sm font-bold text-slate-300 hover:text-white transition-all flex items-center gap-2"
          >
            View Detailed Analysis
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {protocolsLoading ? (
          <div className="card-glass rounded-3xl p-12 flex items-center justify-center">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mb-4"></div>
              <p className="text-sm text-slate-400">Loading safety data...</p>
            </div>
          </div>
        ) : protocols.length > 0 ? (
          <div className="card-glass rounded-3xl p-6 border-2 border-slate-800">
            <SafetyRiskMatrix />
            {protocols.length > 0 && (
              <div className="mt-6 pt-6 border-t border-slate-800">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Your Active Protocols</p>
                <div className="flex flex-wrap gap-2">
                  {protocols.slice(0, 5).map((protocol, index) => (
                    <div
                      key={index}
                      className="px-3 py-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-xs font-medium text-indigo-300"
                    >
                      {protocol.substance_name} for {protocol.indication_name} ({protocol.session_count} sessions)
                    </div>
                  ))}
                  {protocols.length > 5 && (
                    <div className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs font-medium text-slate-400">
                      +{protocols.length - 5} more
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="card-glass rounded-3xl p-12 text-center">
            <p className="text-slate-400 mb-2">No active protocols in the last 90 days</p>
            <p className="text-sm text-slate-500">Log your first protocol to see safety risk assessment</p>
            <button
              onClick={() => navigate('/builder')}
              className="mt-4 px-6 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold transition-all"
            >
              Log Protocol
            </button>
          </div>
        )}
      </Section>

      {/* RECOMMENDED NEXT STEPS */}
      <Section spacing="tight">
        <div className="flex items-center gap-3 mb-4">
          <CheckCircle className="w-5 h-5 text-indigo-400" />
          <h2 className="text-xl font-black text-white tracking-tight">Recommended Next Steps</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <NextStepItem
            number={1}
            text="Review 2 safety alerts from this week"
            link="/deep-dives/molecular-pharmacology"
            urgent={true}
          />
          <NextStepItem
            number={2}
            text="Check your clinic's Q1 benchmarks vs network"
            link="/deep-dives/clinic-performance"
          />
          <NextStepItem
            number={3}
            text="Log 3 pending follow-up sessions"
            link="/builder"
          />
        </div>
      </Section>

      {/* QUICK ACTIONS */}
      <Section spacing="tight">
        <h2 className="text-xl font-black text-white tracking-tight mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <button
            onClick={() => navigate('/builder')}
            className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-indigo-500/10 hover:bg-indigo-500 text-indigo-300 hover:text-white border border-indigo-500/20 hover:border-indigo-500 transition-all active:scale-95"
          >
            <Plus className="w-6 h-6" />
            <span className="text-sm font-black uppercase tracking-wider">Log Protocol</span>
          </button>
          <button
            onClick={() => navigate('/analytics')}
            className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-blue-500/10 hover:bg-blue-500 text-blue-300 hover:text-white border border-blue-500/20 hover:border-blue-500 transition-all active:scale-95"
          >
            <BarChart3 className="w-6 h-6" />
            <span className="text-sm font-black uppercase tracking-wider">Analytics</span>
          </button>
          <button
            onClick={() => navigate('/interactions')}
            className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-amber-500/10 hover:bg-amber-500 text-amber-300 hover:text-white border border-amber-500/20 hover:border-amber-500 transition-all active:scale-95"
          >
            <Activity className="w-6 h-6" />
            <span className="text-sm font-black uppercase tracking-wider">Check Interactions</span>
          </button>
          <button
            onClick={() => navigate('/data-export')}
            className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500 text-emerald-300 hover:text-white border border-emerald-500/20 hover:border-emerald-500 transition-all active:scale-95"
          >
            <TrendingUp className="w-6 h-6" />
            <span className="text-sm font-black uppercase tracking-wider">Export Data</span>
          </button>
          <button
            onClick={() => navigate('/deep-dives/clinic-performance')}
            className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-purple-500/10 hover:bg-purple-500 text-purple-300 hover:text-white border border-purple-500/20 hover:border-purple-500 transition-all active:scale-95"
          >
            <Users className="w-6 h-6" />
            <span className="text-sm font-black uppercase tracking-wider">Benchmarks</span>
          </button>
        </div>
      </Section>

      {/* NETWORK ACTIVITY (SECONDARY) */}
      <Section spacing="tight">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-black text-white tracking-tight">Network Activity</h2>
          <span className="text-xs text-slate-500 font-medium">Last 7 Days</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <InsightCard
            title="Total Protocols"
            value="10,247"
            subtext="127 new protocols this week across 14 sites"
            icon={BarChart3}
            color="bg-slate-500"
            link="/analytics"
            delay={100}
          />
          <InsightCard
            title="Active Sites"
            value="14"
            subtext="Global network spanning 6 countries"
            icon={Map}
            color="bg-slate-500"
            link="/deep-dives/regulatory-map"
            delay={200}
          />
          <InsightCard
            title="Network Avg Success"
            value="68%"
            subtext="Depression treatment outcomes (PHQ-9 reduction)"
            icon={Target}
            color="bg-slate-500"
            link="/analytics"
            delay={300}
          />
        </div>
      </Section>

      <div className="text-center pt-10 border-t border-slate-900 mt-auto">
        <p className="text-[10px] text-slate-600 font-mono">
          Antigravity Clinical OS • v1.2.4 • Encrypted
        </p>
      </div>
    </PageContainer>
  );
}