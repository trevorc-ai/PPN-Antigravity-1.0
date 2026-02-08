import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity, AlertTriangle, TrendingUp, Users,
  Map, Zap, BrainCircuit, ArrowRight, Plus, ShieldCheck, Clock
} from 'lucide-react';
import ConnectFeedButton from '../components/ui/ConnectFeedButton';

// --- COMPONENT: CLEAN INSIGHT CARD ---
const InsightCard = ({ title, value, subtext, icon: Icon, color, link, delay }: any) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(link)}
      className={`group relative overflow-hidden rounded-3xl border border-slate-800 bg-[#0f1218] p-6 hover:border-slate-600 hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between h-[200px] animate-in fade-in slide-in-from-bottom-4 duration-700`}
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
        <div className="text-3xl font-black text-white tracking-tight mb-2">{value}</div>
        <p className="text-sm font-medium text-slate-500 leading-snug group-hover:text-slate-300 transition-colors">
          {subtext}
        </p>
      </div>
    </div>
  );
};

// --- COMPONENT: METRIC PILL ---
const MetricPill = ({ icon: Icon, label, value, color }: any) => (
  <div className="flex items-center gap-4 p-4 rounded-2xl border border-slate-800 bg-[#0f1218]">
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

  return (
    <div className="p-8 min-h-screen bg-[#05070a] text-white flex flex-col gap-8 max-w-7xl mx-auto">

      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-800 pb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wide">System Online</span>
            </span>
            <span className="text-xs font-medium text-slate-500 font-mono">ID: 8842-ALPHA</span>
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-white">
            Dashboard
          </h1>
        </div>
        {/* Header Actions */}
        <div className="flex items-center gap-4">
          <ConnectFeedButton />
        </div>
      </div>

      {/* TELEMETRY ROW */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricPill icon={Users} label="Active Cohort" value="42" color="blue" />
        <MetricPill icon={ShieldCheck} label="Safety Score" value="98/100" color="emerald" />
        <MetricPill icon={Zap} label="Efficiency" value="+18%" color="amber" />
        <MetricPill icon={AlertTriangle} label="Open Alerts" value="3" color="rose" />
      </div>

      {/* DEEP DIVE LAUNCHPAD */}
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-6">
          <Activity className="w-5 h-5 text-indigo-500" />
          <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest">Intelligence Feeds</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <InsightCard
            title="Regulatory Map"
            value="Regulatory Updates"
            subtext="Measure 109 license cap adjusted. Click to review impact."
            icon={Map}
            color="bg-amber-500"
            link="/deep-dives/regulatory-map"
            delay={100}
          />

          <InsightCard
            title="Protocol Efficiency"
            value="Ketamine + IFS"
            subtext="Currently trending as your highest margin protocol (+42%)."
            icon={TrendingUp}
            color="bg-emerald-500"
            link="/deep-dives/protocol-efficiency"
            delay={200}
          />
          <InsightCard
            title="Patient Constellation"
            value="2 New Matches"
            subtext="High-resistance patients matched with successful remission profiles."
            icon={BrainCircuit}
            color="bg-blue-500"
            link="/deep-dives/patient-constellation"
            delay={300}
          />
          <InsightCard
            title="Pharmacology Lab"
            value="Safety Alert"
            subtext="New Adrenergic binding data for MDMA. Review cardiac risks."
            icon={Activity}
            color="bg-rose-500"
            link="/deep-dives/molecular-pharmacology"
            delay={400}
          />
          <InsightCard
            title="Clinic Radar"
            value="Retention: 85%"
            subtext="Your clinic is outperforming the network average by 12%."
            icon={Users}
            color="bg-indigo-500"
            link="/deep-dives/clinic-performance"
            delay={500}
          />

          {/* Action Buttons */}
          <div className="flex gap-4 h-[200px]">
            {/* New Protocol Button */}
            <div
              onClick={() => navigate('/builder')}
              className="
                group flex-1 rounded-3xl border-2 border-dashed border-indigo-800 bg-indigo-900/20 p-6
                hover:border-indigo-600 hover:bg-indigo-900/50 cursor-pointer transition-all
                flex flex-col items-center justify-center gap-4
              "
            >
              <div className="p-4 rounded-full bg-indigo-800 group-hover:bg-indigo-600 group-hover:scale-110 transition-all">
                <Plus className="w-8 h-8 text-indigo-400 group-hover:text-white" />
              </div>
              <span className="text-sm font-bold text-indigo-500 uppercase tracking-widest group-hover:text-white transition-colors">New Protocol</span>
            </div>

            {/* Add/Update Profile Button */}
            <div
              onClick={() => navigate('/clinician/profile')}
              className="
                group flex-1 rounded-3xl border-2 border-dashed border-emerald-800 bg-emerald-900/20 p-6
                hover:border-emerald-600 hover:bg-emerald-900/50 cursor-pointer transition-all
                flex flex-col items-center justify-center gap-4
              "
            >
              <div className="p-4 rounded-full bg-emerald-800 group-hover:bg-emerald-600 group-hover:scale-110 transition-all">
                <Users className="w-8 h-8 text-emerald-400 group-hover:text-white" />
              </div>
              <span className="text-sm font-bold text-emerald-500 uppercase tracking-widest group-hover:text-white transition-colors text-center">Add/Update Profile</span>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center pt-10 border-t border-slate-900 mt-auto">
        <p className="text-xs text-slate-600 font-mono">
          Antigravity Clinical OS • v1.2.4 • Encrypted
        </p>
      </div>
    </div>
  );
}