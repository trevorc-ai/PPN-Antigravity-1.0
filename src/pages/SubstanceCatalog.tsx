
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../components/layouts/PageContainer';
import { Section } from '../components/layouts/Section';
import { SUBSTANCES, INTERACTION_RULES } from '../constants';
import { ResearchPhase, RiskTier, Substance } from '../types';

// ─── Filter configuration with colors ─────────────────────────────────────────
const FILTERS = [
  { label: 'All', value: 'all', activeClasses: 'bg-slate-600  border-slate-500  text-white', countClasses: 'bg-slate-500  text-white' },
  { label: 'Tryptamines', value: 'tryptamine', activeClasses: 'bg-indigo-600 border-indigo-500 text-white', countClasses: 'bg-indigo-500 text-white' },
  { label: 'Lysergamides', value: 'lysergamide', activeClasses: 'bg-pink-600   border-pink-500   text-white', countClasses: 'bg-pink-500   text-white' },
  { label: 'Phenethylamines', value: 'phenethylamine', activeClasses: 'bg-purple-600 border-purple-500 text-white', countClasses: 'bg-purple-500 text-white' },
  { label: 'Dissociatives', value: 'arylcyclohexylamine', activeClasses: 'bg-blue-600 border-blue-500   text-white', countClasses: 'bg-blue-500   text-white' },
  { label: 'Ibogaoids', value: 'apocynaceel', activeClasses: 'bg-violet-600 border-violet-500 text-white', countClasses: 'bg-violet-500 text-white' },
  { label: 'Botanical', value: 'botanical', activeClasses: 'bg-amber-600  border-amber-500  text-white', countClasses: 'bg-amber-500  text-white' },
];


// ─── Risk tier chip config ────────────────────────────────────────────────────
const RISK_CONFIG: Record<RiskTier, { icon: string; classes: string; label: string }> = {
  'CARDIAC RISK': { icon: '⚠', classes: 'bg-red-500/10 text-red-400 border-red-500/20', label: 'Cardiac Risk — EKG required' },
  'MAOI INTERACTION RISK': { icon: '⚡', classes: 'bg-amber-500/10 text-amber-400 border-amber-500/20', label: 'MAOI Interaction Risk' },
  'FDA APPROVED · REMS': { icon: '✓', classes: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', label: 'FDA Approved · REMS Program' },
  'DISSOCIATIVE PROTOCOL': { icon: '◎', classes: 'bg-blue-500/10 text-blue-400 border-blue-500/20', label: 'Dissociative Protocol' },
  'STANDARD MONITORING': { icon: '○', classes: 'bg-slate-700/40 text-slate-400 border-slate-600/30', label: 'Standard Monitoring' },
};

// ─── Interaction popover ───────────────────────────────────────────────────────
interface InteractionEntry { agent: string; severity: string; description: string; isHigh: boolean }

const InteractionBadge: React.FC<{ interactions: InteractionEntry[] }> = ({ interactions }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  if (interactions.length === 0) return null;
  const hasHigh = interactions.some(i => i.isHigh);
  const count = interactions.length;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        aria-expanded={open}
        aria-haspopup="dialog"
        className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg border transition-all
          ${hasHigh
            ? 'bg-red-950/30 text-red-400 border-red-700/30 hover:border-red-500/50'
            : 'bg-amber-950/20 text-amber-400 border-amber-700/20 hover:border-amber-500/40'}`}
      >
        <span aria-hidden="true">{hasHigh ? '⚠' : '△'}</span>
        {count} interaction{count > 1 ? 's' : ''}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label={`Drug interactions for this substance`}
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
          className="absolute bottom-full left-0 mb-2 z-50 w-72 bg-[#0d1117] border border-slate-700 rounded-xl shadow-2xl p-4 space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-150"
        >
          <p className="text-sm font-semibold text-slate-400">Documented Interactions</p>
          {interactions.map((inter, i) => (
            <div key={i} className={`p-3 rounded-lg border text-left space-y-1
              ${inter.isHigh ? 'bg-red-950/20 border-red-700/20' : 'bg-amber-950/15 border-amber-700/15'}`}>
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-semibold text-slate-200">{inter.agent}</span>
                <span className={`text-xs px-2 py-0.5 rounded font-medium
                  ${inter.isHigh ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'}`}>
                  {inter.isHigh ? '⚠ ' : '△ '}{inter.severity}
                </span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">{inter.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
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

  const phaseStyle = sub.phase === ResearchPhase.Approved
    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    : sub.phase === ResearchPhase.Phase3
      ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
      : 'bg-amber-500/10 text-amber-400 border-amber-500/20';

  const riskConfig = sub.riskTier ? RISK_CONFIG[sub.riskTier] : RISK_CONFIG['STANDARD MONITORING'];

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
        <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-md text-xs font-semibold border
          ${sub.schedule === 'Schedule I'
            ? 'bg-red-950/60 text-red-400 border-red-800/40'
            : 'bg-blue-950/60 text-blue-400 border-blue-800/40'}`}
        >
          {sub.schedule}
        </span>
      </div>

      {/* Card body */}
      <div className="p-6 flex flex-col gap-4 flex-1">

        {/* Name — always visible. Chemical name hidden, shown on hover */}
        <div className="min-h-[3.5rem] space-y-1">
          <h3 className="text-xl font-bold text-slate-100 group-hover:text-white transition-colors leading-tight">
            {sub.name}
          </h3>
          {/* Chemical name: hidden by default, revealed on group hover */}
          <p className="text-sm text-slate-500 leading-snug line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 h-9">
            {sub.chemicalName}
          </p>
        </div>

        {/* Class + Phase chips */}
        <div className="flex flex-wrap gap-2">
          <span className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${phaseStyle}`}>
            {sub.phase}
          </span>
          <span className="px-2.5 py-1 rounded-md text-xs font-medium border bg-slate-800/60 text-slate-400 border-slate-700/40">
            {sub.class.charAt(0) + sub.class.slice(1).toLowerCase()}
          </span>
        </div>

        {/* Risk tier chip */}
        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium ${riskConfig.classes}`}>
          <span aria-hidden="true" className="text-base leading-none">{riskConfig.icon}</span>
          <span>{riskConfig.label}</span>
        </div>

        {/* Efficacy bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500">Aggregate Efficacy</span>
            <span className="text-sm font-semibold" style={{ color: sub.color || '#64748b' }}>
              {(sub.efficacy * 100).toFixed(0)}%
            </span>
          </div>
          <div className="w-full bg-slate-800/60 h-1 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${sub.efficacy * 100}%`, background: sub.color || '#64748b' }}
            />
          </div>
        </div>

        {/* Interaction popover badge */}
        <InteractionBadge interactions={interactions} />
      </div>

      {/* CTA — blue */}
      <div className="px-6 pb-6 mt-auto">
        <button
          onClick={() => navigate(`/monograph/${sub.id}`)}
          className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-all duration-200 active:scale-[0.98] shadow-md shadow-blue-900/30"
        >
          View Full Monograph →
        </button>
      </div>
    </article>
  );
};

// ─── Catalog page ─────────────────────────────────────────────────────────────
const SubstanceCatalog: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSubstances = useMemo(() => {
    let results = SUBSTANCES;
    if (activeFilter !== 'all') {
      if (activeFilter === 'approved') {
        results = results.filter(s => s.phase === ResearchPhase.Approved);
      } else {
        results = results.filter(s => s.class.toLowerCase().includes(activeFilter));
      }
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
    if (value === 'approved') return SUBSTANCES.filter(s => s.phase === ResearchPhase.Approved).length;
    return SUBSTANCES.filter(s => s.class.toLowerCase().includes(value)).length;
  };

  const activeFilterCfg = FILTERS.find(f => f.value === activeFilter) ?? FILTERS[0];

  return (
    <div className="min-h-full bg-gradient-to-b from-[#0d1526] via-[#0b1220] to-[#091018] animate-in fade-in duration-500">
      <PageContainer className="max-w-7xl mx-auto px-6 py-10 sm:px-10 lg:px-12 space-y-10">
        <Section spacing="default" className="space-y-8">

          {/* Page header */}
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight" style={{ color: '#c4d0e8' }}>
              Substance Library
            </h1>
            <p className="text-base text-slate-500">
              {SUBSTANCES.length} substances indexed · Clinical-grade pharmacological reference
            </p>
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
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900/60 border border-slate-700/50 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500/50 transition-all"
              />
            </div>

            {/* Filter pills — coloured, with legible count badges */}
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by substance class">
              {FILTERS.map(filter => {
                const count = getFilterCount(filter.value);
                const isActive = activeFilter === filter.value;
                return (
                  <button
                    key={filter.value}
                    onClick={() => setActiveFilter(filter.value)}
                    aria-pressed={isActive}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all border
                      ${isActive
                        ? filter.activeClasses
                        : 'bg-slate-900/40 border-slate-700/40 text-slate-400 hover:bg-slate-800/60 hover:text-slate-200 hover:border-slate-600/60'}`}
                  >
                    {filter.label}
                    {/* Count badge — always white text on coloured pill when active, always legible */}
                    <span className={`inline-flex items-center justify-center min-w-[1.3rem] h-5 rounded-full px-1.5 text-xs font-bold
                      ${isActive ? filter.countClasses : 'bg-slate-700 text-slate-200'}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Results count when filtered */}
          {(activeFilter !== 'all' || searchQuery) && (
            <p className="text-sm text-slate-500">
              Showing {filteredSubstances.length} of {SUBSTANCES.length} substances
              {activeFilter !== 'all' && ` · ${activeFilterCfg.label}`}
            </p>
          )}

          {/* Grid — max 3 columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-20">
            {filteredSubstances.length > 0
              ? filteredSubstances.map(sub => (
                <SubstanceCard key={sub.id} sub={sub} />
              ))
              : (
                <div className="col-span-full py-24 text-center space-y-3">
                  <p className="text-2xl" aria-hidden="true">🔬</p>
                  <p className="text-slate-400 text-base font-medium">No substances match this filter.</p>
                  <button
                    onClick={() => { setActiveFilter('all'); setSearchQuery(''); }}
                    className="text-sm text-slate-500 hover:text-slate-300 underline"
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
