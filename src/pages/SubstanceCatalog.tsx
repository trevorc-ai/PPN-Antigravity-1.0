
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../components/layouts/PageContainer';
import { Section } from '../components/layouts/Section';
import { SUBSTANCES, INTERACTION_RULES } from '../constants';
import { ResearchPhase, RiskTier, Substance } from '../types';

// ─── Filter configuration ─────────────────────────────────────────────────────
const FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'Tryptamines', value: 'tryptamine' },
  { label: 'Lysergamides', value: 'lysergamide' },
  { label: 'Phenethylamines', value: 'phenethylamine' },
  { label: 'Dissociatives', value: 'arylcyclohexylamine' },
  { label: 'Ibogaoids', value: 'apocynaceel' },
  { label: 'Botanical', value: 'botanical' },
  { label: 'FDA Approved', value: 'approved' },
];

// ─── Risk tier chip config ────────────────────────────────────────────────────
const RISK_CONFIG: Record<RiskTier, { icon: string; classes: string; label: string }> = {
  'CARDIAC RISK': {
    icon: '⚠',
    classes: 'bg-red-500/10 text-red-400 border-red-500/20',
    label: 'Cardiac Risk — EKG required',
  },
  'MAOI INTERACTION RISK': {
    icon: '⚡',
    classes: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    label: 'MAOI Interaction Risk',
  },
  'FDA APPROVED · REMS': {
    icon: '✓',
    classes: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    label: 'FDA Approved · REMS Program',
  },
  'DISSOCIATIVE PROTOCOL': {
    icon: '◎',
    classes: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    label: 'Dissociative Protocol',
  },
  'STANDARD MONITORING': {
    icon: '○',
    classes: 'bg-slate-700/40 text-slate-400 border-slate-600/30',
    label: 'Standard Monitoring',
  },
};

// ─── Individual substance card ────────────────────────────────────────────────
const SubstanceCard: React.FC<{ sub: Substance }> = ({ sub }) => {
  const navigate = useNavigate();

  const interactionCount = useMemo(
    () => INTERACTION_RULES.filter(r => r.substance === sub.name).length,
    [sub.name]
  );

  const phaseStyle = (sub.phase === ResearchPhase.Approved)
    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    : sub.phase === ResearchPhase.Phase3
      ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
      : 'bg-amber-500/10 text-amber-400 border-amber-500/20';

  const riskConfig = sub.riskTier ? RISK_CONFIG[sub.riskTier] : RISK_CONFIG['STANDARD MONITORING'];

  return (
    <article className="group bg-[#0a0d14] border border-slate-800/50 rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:border-slate-700/70 hover:shadow-2xl shadow-lg h-full">

      {/* Molecule image zone — pure black, 3D image floats */}
      <div className="h-60 bg-black relative flex items-center justify-center overflow-hidden shrink-0">
        <img
          src={sub.imageUrl}
          alt={`${sub.name} molecular structure — 3D ball-and-stick model`}
          loading="eager"
          className="w-52 h-52 object-contain transition-transform duration-500 group-hover:-translate-y-2"
        />
        {/* Schedule badge — top right */}
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

        {/* Name + chemical name */}
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-slate-100 group-hover:text-white transition-colors leading-tight">
            {sub.name}
          </h3>
          <p className="text-sm text-slate-500 leading-snug line-clamp-2">
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

        {/* Risk tier chip — icon + label (never color alone) */}
        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium ${riskConfig.classes}`}>
          <span aria-hidden="true" className="text-base leading-none">{riskConfig.icon}</span>
          <span>{riskConfig.label}</span>
        </div>

        {/* Efficacy bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Aggregate Efficacy</span>
            <span className="text-xs font-semibold" style={{ color: sub.color || '#64748b' }}>
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

        {/* Interaction count */}
        {interactionCount > 0 && (
          <div className="flex items-center gap-2 text-xs text-amber-400/80">
            <span aria-hidden="true">⚠</span>
            <span>{interactionCount} documented interaction{interactionCount > 1 ? 's' : ''}</span>
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="px-6 pb-6 mt-auto">
        <button
          onClick={() => navigate(`/monograph/${sub.id}`)}
          className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-sm font-semibold rounded-xl transition-all duration-200 border border-slate-700/50 hover:border-slate-600 active:scale-[0.98]"
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

    // Apply class/type filter
    if (activeFilter !== 'all') {
      if (activeFilter === 'approved') {
        results = results.filter(s => s.phase === ResearchPhase.Approved);
      } else {
        results = results.filter(s => s.class.toLowerCase().includes(activeFilter));
      }
    }

    // Apply search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      results = results.filter(
        s =>
          s.name.toLowerCase().includes(q) ||
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

  return (
    <div className="min-h-full bg-gradient-to-b from-[#080b14] to-[#040609] animate-in fade-in duration-500">
      <PageContainer className="max-w-7xl mx-auto px-6 py-10 sm:px-10 lg:px-12 space-y-10">
        <Section spacing="default" className="space-y-8">

          {/* Page header */}
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight" style={{ color: '#c4d0e8' }}>
              Substance Reference Library
            </h1>
            <p className="text-base text-slate-500">
              {SUBSTANCES.length} substances indexed · Clinical-grade pharmacological reference
            </p>
          </div>

          {/* Search + filter row */}
          <div className="space-y-4">
            {/* Search */}
            <div className="relative max-w-md">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" aria-hidden="true">
                🔍
              </span>
              <input
                type="search"
                placeholder="Search by name or chemical name…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900/60 border border-slate-700/50 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500/50 transition-all"
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
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all border
                      ${isActive
                        ? 'bg-slate-700 border-slate-500 text-slate-100'
                        : 'bg-slate-900/40 border-slate-700/40 text-slate-400 hover:bg-slate-800/60 hover:text-slate-300'}`}
                  >
                    {filter.label}
                    <span className={`text-xs ${isActive ? 'text-slate-300' : 'text-slate-600'}`}>
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
            </p>
          )}

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 pb-20">
            {filteredSubstances.length > 0
              ? filteredSubstances.map(sub => (
                <SubstanceCard key={sub.id} sub={sub} />
              ))
              : (
                <div className="col-span-full py-24 text-center space-y-3">
                  <p className="text-2xl">🔬</p>
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
