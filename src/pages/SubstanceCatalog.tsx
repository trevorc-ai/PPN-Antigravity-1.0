
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../components/layouts/PageContainer';
import { Section } from '../components/layouts/Section';
import { SUBSTANCES } from '../constants';
import { ResearchPhase } from '../types';

const FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'Tryptamines', value: 'tryptamine' },
  { label: 'Phenethylamines', value: 'phenethylamine' },
  { label: 'Dissociatives', value: 'dissociative' },
  { label: 'Ibogaoids', value: 'ibogaoid' },
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
            <div
              className="absolute inset-0 rounded-full blur-3xl opacity-50 group-hover:opacity-80 transition-all duration-700"
              style={{ background: sub.color ? `${sub.color}25` : 'rgba(99,102,241,0.1)' }}
            ></div>

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
            <p className="text-sm text-slate-500 font-medium italic leading-relaxed line-clamp-2">
              {sub.chemicalName}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            <span className={`px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest border ${getPhaseStyle(sub.phase)}`}>
              {sub.name === 'Ketamine' ? 'APPROVED' : sub.phase.toUpperCase()}
            </span>
            <span className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-lg text-xs font-black uppercase tracking-widest">
              {sub.class}
            </span>
          </div>

          {/* Efficacy bar */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-600 uppercase tracking-widest">Aggregate Efficacy</span>
              <span className="text-xs font-black" style={{ color: sub.color || '#53d22d' }}>{(sub.efficacy * 100).toFixed(0)}%</span>
            </div>
            <div className="w-full bg-slate-800/50 h-1.5 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${sub.efficacy * 100}%`, background: sub.color || '#53d22d', boxShadow: `0 0 8px ${sub.color || '#53d22d'}60` }}
              ></div>
            </div>
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
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredSubstances = activeFilter === 'all'
    ? SUBSTANCES
    : SUBSTANCES.filter(s => s.class?.toLowerCase().includes(activeFilter));

  return (
    <div className="min-h-full bg-gradient-to-br from-[#0a0e1a] via-[#050810] to-[#020408] animate-in fade-in duration-700">
      <PageContainer className="max-w-7xl mx-auto p-6 sm:p-10 lg:p-12 space-y-12">
        <Section spacing="default" className="space-y-10">

          {/* Header */}
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-5xl font-black tracking-tighter" style={{ color: '#8BA5D3' }}>Substance Catalog</h1>
              <p className="text-base text-slate-500 font-medium">
                {SUBSTANCES.length} substances indexed · Clinical-grade pharmacological reference
              </p>
            </div>

            {/* Filter pills */}
            <div className="flex flex-wrap gap-3">
              {FILTERS.map(filter => (
                <button
                  key={filter.value}
                  onClick={() => setActiveFilter(filter.value)}
                  className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all border ${activeFilter === filter.value
                    ? 'bg-slate-700 border-slate-600 text-slate-200'
                    : 'bg-slate-900/50 border-slate-800 hover:bg-slate-800 text-slate-500'
                    }`}
                >
                  {filter.label}
                  {filter.value !== 'all' && (
                    <span className="ml-2 opacity-60">
                      {SUBSTANCES.filter(s => s.class?.toLowerCase().includes(filter.value)).length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 pb-20">
            {filteredSubstances.length > 0
              ? filteredSubstances.map(sub => (
                <SubstanceCard key={sub.id} sub={sub} />
              ))
              : (
                <div className="col-span-full py-20 text-center">
                  <p className="text-slate-500 text-base">No substances match this filter.</p>
                </div>
              )
            }
          </div>

        </Section>
      </PageContainer>
    </div>
  );
};

export default SubstanceCatalog;
