
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../components/layouts/PageContainer';
import { Section } from '../components/layouts/Section';
import { SUBSTANCES, INTERACTION_RULES } from '../constants';
import { ResearchPhase, RiskTier, Substance } from '../types';

// ─── Filter configuration with per-class colors ───────────────────────────────
const FILTERS = [
  { label: 'All', value: 'all', activeClasses: 'bg-slate-600   border-slate-500  text-[#A8B5D1]', countClasses: 'bg-slate-500  text-[#A8B5D1]' },
  { label: 'Tryptamines', value: 'tryptamine', activeClasses: 'bg-indigo-700  border-indigo-600 text-[#A8B5D1]', countClasses: 'bg-indigo-600 text-[#A8B5D1]' },

  { label: 'Phenethylamines', value: 'phenethylamine', activeClasses: 'bg-purple-700  border-purple-600 text-[#A8B5D1]', countClasses: 'bg-purple-600 text-[#A8B5D1]' },
  { label: 'Dissociatives', value: 'arylcyclohexylamine', activeClasses: 'bg-blue-700  border-blue-600   text-[#A8B5D1]', countClasses: 'bg-blue-600   text-[#A8B5D1]' },

  { label: 'Botanical', value: 'botanical', activeClasses: 'bg-amber-700   border-amber-600  text-[#A8B5D1]', countClasses: 'bg-amber-600  text-[#A8B5D1]' },
];

// ─── Risk tier chip config — WCAG AA contrast: text-color-200 on bg-color-900 ──
const RISK_CONFIG: Record<RiskTier, { icon: string; classes: string; label: string }> = {
  'CARDIAC RISK': { icon: '⚠', classes: 'bg-red-900/70    text-red-200    border-red-700/60', label: 'Cardiac Risk — EKG required' },
  'MAOI INTERACTION RISK': { icon: '⚡', classes: 'bg-amber-900/60  text-amber-200  border-amber-700/50', label: 'MAOI Interaction Risk' },
  'FDA APPROVED · REMS': { icon: '✓', classes: 'bg-emerald-900/60 text-emerald-200 border-emerald-700/50', label: 'FDA Approved · REMS Program' },
  'DISSOCIATIVE PROTOCOL': { icon: '◎', classes: 'bg-blue-900/60   text-blue-200   border-blue-700/50', label: 'Dissociative Protocol' },
  'STANDARD MONITORING': { icon: '○', classes: 'bg-slate-800/70  text-slate-300  border-slate-600/50', label: 'Standard Monitoring' },
};

// ─── Inline accordion interaction list ───────────────────────────────────────
interface InteractionEntry { agent: string; severity: string; description: string; isHigh: boolean }

const InteractionLink: React.FC<{ interactions: InteractionEntry[], substanceName: string }> = ({ interactions, substanceName }) => {
  const navigate = useNavigate();
  if (interactions.length === 0) return null;
  const hasHigh = interactions.some(i => i.isHigh);

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        navigate(`/safety?query=${substanceName}`);
      }}
      className={`w-full flex items-center justify-between gap-2 text-sm font-medium px-3 py-2 rounded-lg border transition-all
        ${hasHigh
          ? 'bg-red-900/60 text-red-200 border-red-700/50 hover:bg-red-900/80 hover:border-red-600/70'
          : 'bg-amber-900/50 text-amber-200 border-amber-700/40 hover:bg-amber-900/70 hover:border-amber-600/60'}`}
    >
      <span className="flex items-center gap-2">
        <span aria-hidden="true">{hasHigh ? '⚠' : '△'}</span>
        {interactions.length} Documented Interaction{interactions.length !== 1 ? 's' : ''}
      </span>
      <span aria-hidden="true" className="text-xs transition-transform duration-200 hover:translate-x-1">→</span>
    </button>
  );
};

// ─── Individual substance card ────────────────────────────────────────────────
const SubstanceCard: React.FC<{ sub: Substance }> = ({ sub }) => {
  const navigate = useNavigate();

  const interactions: InteractionEntry[] = useMemo(
    () => INTERACTION_RULES.filter(r => r.substance === sub.name).map(rule => ({
      agent: rule.interactor,
      severity: rule.severity,
      description: rule.description,
      isHigh: rule.severity === 'Life-Threatening' || rule.severity === 'High',
    })),
    [sub.name]
  );

  const riskConfig = sub.riskTier ? RISK_CONFIG[sub.riskTier] : RISK_CONFIG['STANDARD MONITORING'];

  const phaseClasses = sub.phase === ResearchPhase.Approved
    ? 'bg-emerald-900/60 text-emerald-300 border-emerald-700/50'
    : sub.phase === ResearchPhase.Phase3
      ? 'bg-blue-900/60 text-blue-300 border-blue-700/50'
      : 'bg-amber-900/50 text-amber-300 border-amber-700/40';

  return (
    <article className="group bg-[#0a0d14] border border-slate-800/50 rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:border-slate-700/70 hover:shadow-xl shadow-md h-full">

      {/* Molecule image — pure black, 3D image floats */}
      <div className="h-60 bg-black relative flex items-center justify-center overflow-hidden shrink-0">
        <img
          src={sub.imageUrl}
          alt={`${sub.name} molecular structure — 3D ball-and-stick model`}
          loading="eager"
          className="w-52 h-52 object-contain transition-transform duration-500 group-hover:-translate-y-2"
        />
        {/* Schedule badge */}
        <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-md text-sm font-semibold border
          ${sub.schedule === 'Schedule I'
            ? 'bg-red-900/70 text-red-200 border-red-700/60'
            : 'bg-blue-900/70 text-blue-200 border-blue-700/60'}`}
        >
          {sub.schedule}
        </span>
      </div>

      {/* Card body */}
      <div className="p-6 flex flex-col gap-4 flex-1">

        {/* Name + chemical name (revealed on hover) */}
        <div className="min-h-[3.5rem] space-y-1.5">
          <h3 className="text-xl font-bold text-[#A8B5D1] group-hover:text-[#A8B5D1] transition-colors leading-tight">
            {sub.name}
          </h3>
          <p className="text-base text-slate-500 leading-snug line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 min-h-[1.5rem]">
            {sub.chemicalName}
          </p>
        </div>

        {/* Class + Phase chips */}
        <div className="flex flex-wrap gap-2">
          <span className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${phaseClasses}`}>
            {sub.phase}
          </span>
          <span className="px-2.5 py-1 rounded-md text-xs font-medium border bg-slate-800/60 text-slate-400 border-slate-700/40">
            {sub.class.charAt(0) + sub.class.slice(1).toLowerCase()}
          </span>
        </div>

        {/* Risk tier chip — icon + label, high contrast */}
        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium ${riskConfig.classes}`}>
          <span aria-hidden="true" className="text-lg leading-none">{riskConfig.icon}</span>
          <span>{riskConfig.label}</span>
        </div>

        {/* Efficacy bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-400">Aggregate Efficacy</span>
            <span className="text-sm font-semibold text-slate-300">
              {(sub.efficacy * 100).toFixed(0)}%
            </span>
          </div>
          <div className="w-full bg-slate-800/60 h-1.5 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${sub.efficacy * 100}%`, background: sub.color || '#64748b' }}
            />
          </div>
        </div>

        {/* Interaction badge link */}
        <InteractionLink interactions={interactions} substanceName={sub.name} />
      </div>

      {/* CTA button — blue */}
      <div className="px-6 pb-6 mt-auto">
        <button
          onClick={() => navigate(`/monograph/${sub.id}`)}
          className="w-full py-3 bg-blue-700 hover:bg-blue-600 text-[#A8B5D1] text-sm font-semibold rounded-xl transition-all duration-200 active:scale-[0.98] shadow-md shadow-blue-900/30"
        >
          View Full Monograph →
        </button>
      </div>
    </article>
  );
};

// ─── Catalog page ─────────────────────────────────────────────────────────────
const SubstanceCatalog: React.FC = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSubstances = useMemo(() => {
    let results = SUBSTANCES;
    if (activeFilter !== 'all') {
      results = results.filter(s => s.class.toLowerCase().includes(activeFilter));
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      results = results.filter(
        s => s.name.toLowerCase().includes(q) ||
          s.chemicalName.toLowerCase().includes(q) ||
          s.class.toLowerCase().includes(q)
      );
    }
    return results;
  }, [activeFilter, searchQuery]);

  const getFilterCount = (value: string) => {
    if (value === 'all') return SUBSTANCES.length;
    return SUBSTANCES.filter(s => s.class.toLowerCase().includes(value)).length;
  };

  const activeFilterCfg = FILTERS.find(f => f.value === activeFilter) ?? FILTERS[0];

  return (
    <div className="min-h-full bg-gradient-to-b from-[#0d1526] via-[#0b1220] to-[#091018] animate-in fade-in duration-500">
      <PageContainer className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8 space-y-10">
        <Section spacing="default" className="space-y-8">

          {/* Page header and Molecular Pharmacology Link */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-2 border-b border-white/5">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tight text-slate-300">
                Substance Library
              </h1>
              <p className="text-base text-slate-500">
                {SUBSTANCES.length} substances indexed · Clinical-grade pharmacological reference
              </p>
            </div>

            <button
              onClick={() => navigate('/deep-dives/molecular-pharmacology')}
              className="group flex flex-col items-center sm:items-end sm:text-right gap-1 px-5 py-3 sm:py-2 bg-indigo-900/20 hover:bg-indigo-900/40 border border-indigo-700/40 hover:border-indigo-500/60 transition-all rounded-xl"
            >
              <div className="flex items-center gap-2 text-indigo-300 font-bold">
                <span className="material-symbols-outlined shrink-0" aria-hidden="true">science</span>
                <span>Compare Molecular Pharmacology</span>
                <span className="shrink-0 transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
              </div>
              <p className="text-xs text-indigo-400/70 font-medium">Receptor heatmaps & affinity matrices</p>
            </button>
          </div>

          {/* Search + filters */}
          <div className="space-y-4">
            {/* Search */}
            <div className="relative max-w-md">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none select-none" aria-hidden="true">🔍</span>
              <input
                type="search"
                placeholder="Search by name or chemical name…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900/60 border border-slate-700/50 rounded-xl text-base text-slate-300 placeholder-slate-500 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500/50 transition-all"
              />
            </div>

            {/* Filter pills */}
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by substance class">
              {FILTERS.map(filter => {
                const count = getFilterCount(filter.value);
                const isActive = activeFilter === filter.value;
                return (
                  <button
                    key={filter.value}
                    onClick={() => setActiveFilter(filter.value)}
                    aria-pressed={isActive}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-base font-medium transition-all border
                      ${isActive
                        ? filter.activeClasses
                        : 'bg-slate-900/40 border-slate-700/40 text-slate-400 hover:bg-slate-800/60 hover:text-slate-300 hover:border-slate-600/60'}`}
                  >
                    {filter.label}
                    <span className={`inline-flex items-center justify-center min-w-[1.4rem] h-5 rounded-full px-1.5 text-sm font-bold
                      ${isActive ? filter.countClasses : 'bg-slate-700 text-[#A8B5D1]'}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Results count when filtered */}
          {(activeFilter !== 'all' || searchQuery) && (
            <p className="text-base text-slate-400">
              Showing {filteredSubstances.length} of {SUBSTANCES.length} substances
              {activeFilter !== 'all' && ` · ${activeFilterCfg.label}`}
            </p>
          )}

          {/* Grid — max 2 columns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-20">
            {filteredSubstances.length > 0
              ? filteredSubstances.map(sub => (
                <SubstanceCard key={sub.id} sub={sub} />
              ))
              : (
                <div className="col-span-full py-24 text-center space-y-3">
                  <p className="text-2xl" aria-hidden="true">🔬</p>
                  <p className="text-slate-400 text-lg font-medium">No substances match this filter.</p>
                  <button
                    onClick={() => { setActiveFilter('all'); setSearchQuery(''); }}
                    className="text-base text-slate-500 hover:text-slate-300 underline"
                  >
                    Clear filters
                  </button>
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
