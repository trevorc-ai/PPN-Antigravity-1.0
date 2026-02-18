
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../components/layouts/PageContainer';
import { Section } from '../components/layouts/Section';
import {
  Bar, ResponsiveContainer,
  BarChart, Cell
} from 'recharts';
import { SUBSTANCES, MEDICATIONS_LIST } from '../constants';
import { ResearchPhase } from '../types';

const trendData = [
  { name: 'Jan', val: 30 },
  { name: 'Feb', val: 45 },
  { name: 'Mar', val: 70 },
  { name: 'Apr', val: 55 },
  { name: 'May', val: 85 },
  { name: 'Jun', val: 95 },
  { name: 'Jul', val: 80 },
];

const SubstanceCard: React.FC<{ sub: any }> = ({ sub }) => {
  const navigate = useNavigate();

  const getScheduleStyle = (schedule: string) => {
    if (schedule === 'Schedule I') return 'text-red-400 bg-red-500/10 border-red-500/20';
    return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
  };

  const getPhaseStyle = (phase: string) => {
    if (phase === 'Approved' || phase === ResearchPhase.Approved || sub.name === 'Ketamine') return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
  };

  return (
    <div className="group bg-[#0d1117]/80 border border-slate-800/60 rounded-[1.5rem] overflow-hidden transition-all duration-300 flex flex-col justify-between shadow-2xl hover:border-primary/40 relative h-full">
      <div className="flex flex-col flex-1">
        <div className="h-64 bg-[#05070a] relative flex items-center justify-center p-0 overflow-hidden border-b border-slate-800/40 shrink-0">
          <div className="absolute inset-0 opacity-[0.05] pointer-events-none"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }}>
          </div>

          <div className="absolute top-4 right-4 z-10">
            <span className={`px-3 py-1 text-xs font-black uppercase tracking-widest rounded border ${getScheduleStyle(sub.schedule)}`}>
              {sub.schedule}
            </span>
          </div>

          <div className="absolute top-3 left-3 size-2 border-t border-l border-slate-700/50"></div>
          <div className="absolute bottom-3 right-3 size-2 border-b border-r border-slate-700/50"></div>

          <div className="relative size-48 flex items-center justify-center">
            <div className="absolute inset-0 bg-[#030508] rounded-full border border-slate-800/40 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] group-hover:scale-105 transition-transform duration-700"></div>
            <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-700 opacity-50"></div>

            <img
              src={sub.imageUrl}
              alt={`${sub.name} Molecular Structure`}
              loading="eager"
              style={{ mixBlendMode: 'screen' }}
              className="w-full h-full object-contain transition-transform duration-1000 group-hover:scale-110 relative z-10 drop-shadow-[0_0_15px_rgba(0,0,0,0.8)]"
            />
          </div>
        </div>

        <div className="p-8 flex flex-col gap-4">
          <div className="min-w-0 space-y-1.5">
            <h3 className="text-3xl font-black tracking-tighter truncate group-hover:text-primary transition-colors" style={{ color: '#9DAEC8' }}>{sub.name}</h3>
            <p className="text-[12px] text-slate-500 font-bold italic leading-relaxed line-clamp-2">
              {sub.chemicalName}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            <span className={`px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest border ${getPhaseStyle(sub.phase)}`}>
              {sub.name === 'Ketamine' ? 'APPROVED' : sub.phase.toUpperCase()}
            </span>
            <span className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-lg text-xs font-black uppercase tracking-widest">
              {sub.class}
            </span>
          </div>
        </div>
      </div>

      <div className="px-8 pb-8">
        <button
          onClick={() => navigate(`/monograph/${sub.id}`)}
          className="w-full py-4 bg-primary hover:bg-blue-600 text-slate-300 text-xs font-black rounded-xl uppercase tracking-[0.2em] transition-all shadow-xl active:scale-95 border-t border-white/10"
        >
          View Full Monograph
        </button>
      </div>
    </div>
  );
};

const SubstanceCatalog: React.FC = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('Showing: All Classes');

  const [selectedMatrixSub, setSelectedMatrixSub] = useState(SUBSTANCES[0].name);
  const [secondaryMed, setSecondaryMed] = useState('');

  const handleSafetyScan = () => {
    if (!secondaryMed.trim()) return;
    navigate(`/interactions?agentA=${encodeURIComponent(selectedMatrixSub)}&agentB=${encodeURIComponent(secondaryMed)}`);
  };

  return (
    <div className="min-h-full flex flex-col lg:flex-row bg-gradient-to-br from-[#0a0e1a] via-[#050810] to-[#020408] animate-in fade-in duration-700">
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <PageContainer className="max-w-7xl mx-auto p-6 sm:p-10 lg:p-12 space-y-12">
          <Section spacing="default" className="space-y-10">
            <div className="space-y-8">
              <h1 className="text-5xl font-black tracking-tighter" style={{ color: '#8BA5D3' }}>Substances</h1>
              <div className="flex flex-wrap gap-3">
                {['Showing: All Classes', 'Clinical Stage Only', 'High Binding Affinity'].map(filter => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all border ${activeFilter === filter
                      ? 'bg-slate-700 border-slate-600'
                      : 'bg-slate-900/50 border-slate-800 hover:bg-slate-800'
                      }`}
                    style={{ color: '#8B9DC3' }}
                  >
                    {filter.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 pb-20">
              {SUBSTANCES.map(sub => (
                <SubstanceCard key={sub.id} sub={sub} />
              ))}
            </div>
          </Section>
        </PageContainer>
      </div>

      <aside className="w-full lg:w-[440px] border-l border-slate-800/60 bg-[#0a0c10] p-10 lg:sticky lg:top-0 h-full overflow-y-auto custom-scrollbar flex flex-col gap-8 backdrop-blur-xl shrink-0">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-accent-amber font-black">health_and_safety</span>
            <h3 className="text-xs font-black uppercase tracking-[0.2em]" style={{ color: '#A8B5D1' }}>Drug Safety Matrix</h3>
          </div>

          <div className="space-y-5 bg-slate-900/40 p-6 rounded-[2rem] border border-slate-800/40 relative overflow-hidden group">
            <div className="absolute inset-0 bg-accent-amber/5 opacity-0 group-hover:opacity-10 transition-opacity"></div>

            <p className="text-sm font-medium leading-relaxed italic relative z-10" style={{ color: '#8B9DC3' }}>
              Perform immediate clinical interaction cross-referencing across the global registry.
            </p>

            <div className="space-y-4 relative z-10">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Substance Compound</label>
                <div className="relative">
                  <select
                    value={selectedMatrixSub}
                    onChange={(e) => setSelectedMatrixSub(e.target.value)}
                    className="w-full bg-[#05070a] border border-slate-800 rounded-xl h-12 px-4 text-sm font-black focus:ring-1 focus:ring-accent-amber appearance-none cursor-pointer hover:border-slate-700 transition-colors" style={{ color: '#8B9DC3' }}
                  >
                    {SUBSTANCES.map(s => <option key={s.id} value={s.name}>{s.name.toUpperCase()}</option>)}
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none">expand_more</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Secondary Medication</label>
                <div className="relative">
                  <select
                    value={secondaryMed}
                    onChange={(e) => setSecondaryMed(e.target.value)}
                    className="w-full bg-[#05070a] border border-slate-800 rounded-xl h-12 px-4 text-sm font-black focus:ring-1 focus:ring-accent-amber appearance-none cursor-pointer hover:border-slate-700 transition-all" style={{ color: '#8B9DC3' }}
                  >
                    <option value="">Select Medication...</option>
                    {MEDICATIONS_LIST.map(med => (
                      <option key={med} value={med}>{med.toUpperCase()}</option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none">expand_more</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleSafetyScan}
              disabled={!secondaryMed}
              className="w-full py-4 bg-accent-amber hover:bg-amber-500 disabled:opacity-50 text-black text-sm font-black rounded-xl uppercase tracking-widest transition-all shadow-xl shadow-accent-amber/10 flex items-center justify-center gap-2 active:scale-95 relative z-10"
            >
              <span className="material-symbols-outlined text-lg">verified_user</span>
              Analyze Interaction
            </button>

            <div className="flex items-center gap-3 p-3 bg-black/40 rounded-xl border border-slate-800/60 relative z-10">
              <div className="size-1.5 rounded-full bg-clinical-green animate-pulse shadow-[0_0_8px_#53d22d]"></div>
              <p className="text-sm text-slate-600 font-black uppercase tracking-widest">Node Status: Protected</p>
            </div>
          </div>
        </div>

        <div className="mt-auto pt-8 border-t border-slate-800/60">
          <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-10 transition-opacity"></div>
            <div className="flex items-center gap-3 mb-3 relative z-10">
              <span className="material-symbols-outlined text-indigo-400 text-2xl font-black">verified</span>
              <span className="text-xs font-black uppercase tracking-widest" style={{ color: '#8B9DC3' }}>Compliance Status: Active</span>
            </div>
            <p className="text-sm text-slate-500 font-medium leading-relaxed italic relative z-10">
              Institutional access verified. All data presented is for research purposes only.
            </p>
          </div>
        </div>
      </aside>
    </div >
  );
};

export default SubstanceCatalog;
