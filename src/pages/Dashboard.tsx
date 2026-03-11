import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity, AlertTriangle, TrendingUp, Users,
  Map, ArrowRight, Plus, Clock,
  BarChart3, Target, Share2
} from 'lucide-react';

import { PageContainer } from '../components/layouts/PageContainer';
import { Section } from '../components/layouts/Section';
import SafetyRiskMatrix from '../components/analytics/SafetyRiskMatrix';
import { usePractitionerProtocols } from '../hooks/usePractitionerProtocols';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../supabaseClient';

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
      className={`shrink-0 w-[85vw] snap-center md:w-auto md:shrink-1 relative overflow-hidden bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 transition-all group ${link ? 'cursor-pointer hover:border-slate-600 hover:shadow-2xl hover:-translate-y-1' : ''}`}
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

// ── Personalized greeting helpers ────────────────────────────────────────────
function getTimeOfDayGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function formatCurrentDate(): string {
  return new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { protocols, loading: protocolsLoading, refetch, lastFetchedAt } = usePractitionerProtocols();

  const hasProtocols = protocols.length > 0;

  // Restore scroll position when returning to Dashboard
  useEffect(() => {
    const savedScrollY = sessionStorage.getItem('dashboardScrollY');
    if (savedScrollY) {
      // Use a slight timeout to ensure DOM is fully painted before scrolling
      setTimeout(() => {
        window.scrollTo({ top: parseInt(savedScrollY, 10), behavior: 'instant' });
      }, 50);
    }

    const handleScroll = () => {
      sessionStorage.setItem('dashboardScrollY', window.scrollY.toString());
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#080c14] via-[#0c1220] to-[#0a0e1a] overflow-hidden text-slate-300">
      {/* Background Texture & Glows */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,black,transparent)] pointer-events-none z-0" />
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none opacity-50 z-0" />

      <PageContainer className="relative z-10 flex flex-col gap-8 pt-8">

        {/* HEADER SECTION */}
        <Section spacing="tight" data-tour="dashboard-header" className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-800/80 pb-4 md:pb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wide">System Online</span>
              </span>
              <button
                onClick={refetch}
                disabled={protocolsLoading}
                title={lastFetchedAt ? `Last updated: ${lastFetchedAt.toLocaleTimeString()}` : 'Refresh data'}
                className="min-h-[44px] min-w-[44px] px-3 flex items-center gap-1.5 rounded-lg border border-blue-500/20 bg-transparent text-xs font-bold text-slate-500 hover:bg-slate-800/50 active:scale-95 transition-all"
              >
                {protocolsLoading ? '...' : '↻ Refresh'}
              </button>
            </div>
            <h1 className="ppn-page-title mt-3 md:mt-4" style={{ color: '#A8B5D1' }}>
              {getTimeOfDayGreeting()}.
            </h1>
            <p className="ppn-meta text-slate-500 mt-1">{formatCurrentDate()}</p>
          </div>
        </Section>

        {/* YOUR CLINIC PERFORMANCE (PRIMARY SECTION) */}
        <Section spacing="tight">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black tracking-tight" style={{ color: '#A8B5D1' }}>Your Clinic Performance</h2>
            <span className="text-xs text-slate-500 font-medium">This Month</span>
          </div>
          <div className="flex overflow-x-auto overflow-y-hidden snap-x touch-pan-x gap-4 pb-4 md:grid md:grid-cols-2 lg:grid-cols-4 w-full scrollbar-hide">
            <ClinicPerformanceCard
              title="Protocols Logged"
              value={hasProtocols ? String(protocols.length) : '--'}
              change={hasProtocols ? '+12%' : 'No data yet'}
              comparison={hasProtocols ? 'Network avg: 18' : 'Log your first session to start tracking'}
              icon={BarChart3}
              color="bg-indigo-500"
            />
            <ClinicPerformanceCard
              title="Benchmark Score"
              value={hasProtocols ? '71%' : '--'}
              change={hasProtocols ? '+3%' : 'No data yet'}
              comparison={hasProtocols ? 'Network avg: 68%' : 'Log your first session to start tracking'}
              percentile={undefined /* WO-598: removed hardcoded '62nd percentile' — show once computed from live analytics */}
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
              value={hasProtocols ? '4.2 hrs' : '--'}
              change={hasProtocols ? '+0.3' : 'No data yet'}
              comparison={hasProtocols ? 'Network avg: 4.0 hrs' : 'Log your first session to start tracking'}
              icon={Clock}
              color="bg-blue-500"
            />
          </div>
        </Section>




        {/* QUICK ACTIONS — always-on color, not hover-only */}
        <Section spacing="tight">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black tracking-tight" style={{ color: '#A8B5D1' }}>Quick Actions</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">

            {/* Log Protocol — indigo */}
            <button
              id="quick-action-log-protocol"
              data-tour="wellness-journey"
              onClick={() => navigate('/wellness-journey')}
              className="group relative flex flex-col items-center justify-center gap-3 p-5 min-h-[100px] rounded-2xl
                bg-indigo-500/12 hover:bg-indigo-500/22
                border border-indigo-500/35 hover:border-indigo-400/60
                shadow-lg shadow-indigo-900/30
                transition-all duration-300 active:scale-95 cursor-pointer overflow-hidden"
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

            {/* Share PPN — rose (Available to all users) */}
            <button
              id="quick-action-share-network"
              onClick={() => navigate('/network-library')}
              className="group relative flex flex-col items-center justify-center gap-3 p-5 rounded-2xl
                  bg-rose-500/12 hover:bg-rose-500/22
                  border border-rose-500/35 hover:border-rose-400/60
                  shadow-lg shadow-rose-900/30
                  transition-all active:scale-95 cursor-pointer overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-rose-600/10 to-transparent pointer-events-none" />
              <div className="w-12 h-12 rounded-2xl bg-rose-500/25 flex items-center justify-center shadow-inner transition-transform group-hover:scale-110">
                <Share2 className="w-6 h-6 text-rose-300" />
              </div>
              <div className="text-center relative z-10">
                <p className="text-sm font-black text-rose-200 leading-tight">Share PPN</p>
                <p className="text-xs text-rose-400/70 mt-0.5 hidden sm:block">Invite network</p>
              </div>
            </button>

          </div>
        </Section>

        {/* STICKY BOTTOM CTA — Thumb-zone primary action, hidden on desktop where sidebar handles nav */}
        <div className="md:hidden fixed bottom-[72px] left-0 right-0 z-40 flex justify-center px-6 pb-2 pointer-events-none">
          <button
            onClick={() => navigate('/wellness-journey')}
            className="pointer-events-auto w-full max-w-sm flex items-center justify-center gap-3 min-h-[52px] rounded-2xl
              bg-indigo-600 hover:bg-indigo-500 active:scale-95
              text-white font-black text-sm tracking-wide
              shadow-xl shadow-indigo-900/60
              transition-all duration-300"
          >
            <Plus className="w-5 h-5" />
            Log New Protocol
          </button>
        </div>

        {/* NETWORK ACTIVITY — hidden until live data connected */}
        <Section spacing="tight" className="hidden">
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

      </PageContainer>
    </div>
  );
}