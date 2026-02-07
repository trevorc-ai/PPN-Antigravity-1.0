import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PATIENTS } from '../constants';
import RegulatoryMosaic from '../components/analytics/RegulatoryMosaic';
import SafetyBenchmark from '../components/analytics/SafetyBenchmark';

const TelemetryItem: React.FC<{ label: string; value: string | number; trend?: string; color: string; onClick?: () => void }> = ({ label, value, trend, color, onClick }) => (
  <div role={onClick ? "button" : undefined} onClick={onClick} className={`flex flex-col gap-1 px-3 py-3 sm:px-6 sm:py-4 border border-slate-800/60 bg-[#0f1218] rounded-2xl hover:bg-slate-800/40 transition-all w-full shadow-lg ${onClick ? 'cursor-pointer' : ''}`}>
    <div className="flex items-center gap-2.5">
      <span className={`size-2 rounded-full ${color} shadow-[0_0_8px_currentColor]`}></span>
      <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">{label}</span>
    </div>
    <div className="flex items-end gap-3 mt-1">
      <span className="text-2xl sm:text-3xl font-black text-slate-200 tracking-tighter leading-none font-mono">{value}</span>
      {trend && <span className="text-[10px] font-bold text-emerald-500/80 mb-1">{trend}</span>}
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ active: 0, sessions: 0, outcomes: 0, safety: 0 });

  useEffect(() => {
    setStats({
      active: PATIENTS.filter(p => p.status === 'Active').length,
      sessions: 142,
      outcomes: 68,
      safety: PATIENTS.filter(p => p.status === 'Review').length
    });
  }, []);

  return (
    <div className="p-4 sm:p-8 space-y-8 animate-in fade-in duration-500 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase mb-1">Command <span className="text-indigo-500">Center</span></h1>
          <div className="flex items-center gap-3">
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-500 uppercase tracking-wider">System Nominal</span>
            <span className="text-[10px] font-medium text-slate-500">Node ID: 0x8842-Alpha</span>
          </div>
        </div>
        <button onClick={() => navigate('/protocol-builder')} className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-blue-600 text-white text-[11px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-primary/20">
          <span className="material-symbols-outlined text-lg">add</span> New Protocol
        </button>
      </div>

      {/* Telemetry */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <TelemetryItem label="Active Cohort" value={stats.active} trend="+12%" color="bg-blue-500" onClick={() => navigate('/advanced-search')} />
        <TelemetryItem label="Total Sessions" value={stats.sessions} trend="98% Adherence" color="bg-purple-500" />
        <TelemetryItem label="Network Index" value={stats.outcomes} trend="Top 15%" color="bg-emerald-500" />
        <TelemetryItem label="Safety Events" value={stats.safety} color="bg-amber-500" />
      </div>

      {/* Operational Signals (New Layout) */}
      <div className="space-y-4 pt-6 border-t border-slate-800/50">
        <h3 className="text-xl font-black text-white tracking-tighter uppercase flex items-center gap-3">
          <span className="material-symbols-outlined text-indigo-500">radar</span> Operational Signals
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[320px]">
          <RegulatoryMosaic />
          <SafetyBenchmark />

          {/* Quick Actions Card */}
          <div className="bg-[#0f1218] border border-slate-800/60 rounded-3xl p-5 flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-black text-slate-300 uppercase tracking-widest mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full p-3 bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500/20 text-indigo-400 rounded-xl text-[11px] font-bold uppercase tracking-wider text-left transition-all">
                  New Protocol
                </button>
                <button className="w-full p-3 bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 text-amber-500 rounded-xl text-[11px] font-bold uppercase tracking-wider text-left transition-all">
                  Urgent Review
                </button>
                <button className="w-full p-3 bg-slate-800/50 border border-slate-700 hover:bg-slate-700 text-slate-300 rounded-xl text-[11px] font-bold uppercase tracking-wider text-left transition-all">
                  Export Log
                </button>
              </div>
            </div>
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
              <p className="text-[9px] text-slate-500 leading-relaxed">
                <strong className="text-slate-400">Note:</strong> Weekly data sync is scheduled for Sunday 02:00 UTC.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;