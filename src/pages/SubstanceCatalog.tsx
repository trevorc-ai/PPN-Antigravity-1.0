
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../components/layouts/PageContainer';
import { Section } from '../components/layouts/Section';
import { SUBSTANCES, INTERACTION_RULES } from '../constants';
import { ResearchPhase, RiskTier, Substance } from '../types';

// ─── Filter configuration ─────────────────────────────────────────────────────
const FILTERS = [
  { label: 'All', value: 'all', activeClasses: 'bg-slate-600   border-slate-500  text-slate-100', countClasses: 'bg-slate-500  text-slate-100' },
  { label: 'Tryptamines', value: 'tryptamine', activeClasses: 'bg-indigo-700  border-indigo-600 text-slate-100', countClasses: 'bg-indigo-600 text-slate-100' },
  { label: 'Phenethylamines', value: 'phenethylamine', activeClasses: 'bg-purple-700  border-purple-600 text-slate-100', countClasses: 'bg-purple-600 text-slate-100' },
  { label: 'Dissociatives', value: 'arylcyclohexylamine', activeClasses: 'bg-blue-700  border-blue-600   text-slate-100', countClasses: 'bg-blue-600   text-slate-100' },
  { label: 'Botanical', value: 'botanical', activeClasses: 'bg-amber-700   border-amber-600  text-slate-100', countClasses: 'bg-amber-600  text-slate-100' },
];

// ─── Risk tier config — WCAG AA contrast ─────────────────────────────────────
const RISK_CONFIG: Record<RiskTier, { icon: string; classes: string; label: string }> = {
  'CARDIAC RISK': { icon: '⚠', classes: 'bg-red-900/70    text-red-200    border-red-700/60', label: 'Cardiac Risk — EKG required' },
  'MAOI INTERACTION RISK': { icon: '⚡', classes: 'bg-amber-900/60  text-amber-200  border-amber-700/50', label: 'MAOI Interaction Risk' },
  'FDA APPROVED · REMS': { icon: '✓', classes: 'bg-emerald-900/60 text-emerald-200 border-emerald-700/50', label: 'FDA Approved · REMS Program' },
  'DISSOCIATIVE PROTOCOL': { icon: '◎', classes: 'bg-blue-900/60   text-blue-200   border-blue-700/50', label: 'Dissociative Protocol' },
  'STANDARD MONITORING': { icon: '○', classes: 'bg-slate-800/70  text-slate-300  border-slate-600/50', label: 'Standard Monitoring' },
};

// ─── Flippable substance card ─────────────────────────────────────────────────
const SubstanceCard: React.FC<{ sub: Substance }> = ({ sub }) => {
  const navigate = useNavigate();
  const [isFlipped, setIsFlipped] = useState(false);

  const interactions = useMemo(
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

  const cardBase = 'absolute inset-0 rounded-2xl overflow-hidden flex flex-col border border-slate-800/50 bg-[#0a0d14]';

  return (
    /* Perspective wrapper — fills grid cell height */
    <div className="h-full min-h-[520px]" style={{ perspective: '1200px' }}>
      {/* Flip container */}
      <div
        className="relative h-full"
        style={{
          transformStyle: 'preserve-3d',
          transition: 'transform 0.55s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >

        {/* ── FRONT ──────────────────────────────────────────────────────── */}
        <article
          className={cardBase}
          style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' } as React.CSSProperties}
        >
          {/* Molecule image */}
          <div className="h-56 bg-black relative flex items-center justify-center shrink-0 overflow-hidden">
            <img
              src={sub.imageUrl}
              alt={`${sub.name} molecular structure — 3D ball-and-stick model`}
              loading="eager"
              className="w-48 h-48 object-contain transition-transform duration-500 group-hover:-translate-y-1"
            />
            <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-md text-xs font-semibold border
              ${sub.schedule === 'Schedule I'
                ? 'bg-red-900/70 text-red-200 border-red-700/60'
                : 'bg-blue-900/70 text-blue-200 border-blue-700/60'}`}
            >
              {sub.schedule}
            </span>
          </div>

          {/* Card body */}
          <div className="p-5 flex flex-col gap-3 flex-1">
            {/* Name + chemical (hover) */}
            <div className="space-y-1 group">
              <h3 className="text-xl font-bold text-slate-200 leading-tight">{sub.name}</h3>
              <p className="text-sm text-slate-500 leading-snug line-clamp-1">{sub.chemicalName}</p>
            </div>

            {/* Phase + class chips */}
            <div className="flex flex-wrap gap-1.5">
              <span className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${phaseClasses}`}>
                {sub.phase}
              </span>
              <span className="px-2.5 py-1 rounded-md text-xs font-medium border bg-slate-800/60 text-slate-400 border-slate-700/40">
                {sub.class.charAt(0) + sub.class.slice(1).toLowerCase()}
              </span>
            </div>

            {/* Risk chip */}
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium ${riskConfig.classes}`}>
              <span aria-hidden="true">{riskConfig.icon}</span>
              <span>{riskConfig.label}</span>
            </div>

            {/* Efficacy */}
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-slate-400">Aggregate Efficacy</span>
                <span className="text-sm font-semibold text-slate-300">{(sub.efficacy * 100).toFixed(0)}%</span>
              </div>
              <div className="w-full bg-slate-800/60 h-1.5 rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${sub.efficacy * 100}%`, background: sub.color || '#64748b' }} />
              </div>
            </div>

            {/* Interaction indicator — click card to flip */}
            {interactions.length > 0 && (
              <div className={`flex items-center gap-2 text-sm px-3 py-2 rounded-lg border
                ${interactions.some(i => i.isHigh)
                  ? 'bg-red-900/40 text-red-200 border-red-700/40'
                  : 'bg-amber-900/30 text-amber-200 border-amber-700/30'}`}
              >
                <span aria-hidden="true">{interactions.some(i => i.isHigh) ? '⚠' : '△'}</span>
                <span>{interactions.length} interaction{interactions.length > 1 ? 's' : ''} — click card to review</span>
              </div>
            )}
          </div>

          {/* CTAs */}
          <div className="px-5 pb-5 mt-auto flex gap-2">
            {interactions.length > 0 && (
              <button
                onClick={e => { e.stopPropagation(); setIsFlipped(true); }}
                className="flex-1 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm font-semibold rounded-xl transition-all border border-slate-600/50"
              >
                Interactions ↩
              </button>
            )}
            <button
              onClick={e => { e.stopPropagation(); navigate(`/monograph/${sub.id}`); }}
              className="flex-1 py-2.5 bg-blue-700 hover:bg-blue-600 text-slate-100 text-sm font-semibold rounded-xl transition-all shadow-md shadow-blue-900/30"
            >
              Monograph →
            </button>
          </div>
        </article>

        {/* ── BACK ───────────────────────────────────────────────────────── */}
        <article
          className={cardBase}
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          } as React.CSSProperties}
        >
          {/* Back header */}
          <div className="px-5 pt-5 pb-3 border-b border-white/5 flex items-center justify-between shrink-0">
            <div>
              <h3 className="text-lg font-bold text-slate-200">{sub.name}</h3>
              <p className="text-sm text-slate-500">Drug Interaction Profile</p>
            </div>
            <button
              onClick={() => setIsFlipped(false)}
              aria-label="Flip card back"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-slate-100 transition-all text-sm font-bold border border-slate-700/50"
            >
              ↩ Back
            </button>
          </div>

          {/* Risk chip on back */}
          <div className={`mx-5 mt-4 flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium shrink-0 ${riskConfig.classes}`}>
            <span aria-hidden="true">{riskConfig.icon}</span>
            <span>{riskConfig.label}</span>
          </div>

          {/* Critical safety note */}
          {sub.criticalSafetyNote && (
            <div className="mx-5 mt-3 p-3 bg-red-900/25 border border-red-700/30 rounded-xl shrink-0">
              <p className="text-sm text-red-200 leading-relaxed">{sub.criticalSafetyNote}</p>
            </div>
          )}

          {/* Interactions — scrollable */}
          <div className="flex-1 overflow-y-auto px-5 pb-2 mt-3 space-y-2 min-h-0">
            {interactions.length > 0 ? (
              interactions.map((inter, i) => (
                <div key={i} className={`p-3 rounded-xl border space-y-1.5
                  ${inter.isHigh ? 'bg-red-900/30 border-red-700/40' : 'bg-amber-900/20 border-amber-700/30'}`}>
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-slate-200">{inter.agent}</span>
                    <span className={`text-xs px-2.5 py-0.5 rounded-md font-semibold
                      ${inter.isHigh ? 'bg-red-700/80 text-red-100' : 'bg-amber-700/80 text-amber-100'}`}>
                      {inter.isHigh ? '⚠ ' : '△ '}{inter.severity}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed">{inter.description}</p>
                </div>
              ))
            ) : (
              <div className="py-6 text-center">
                <p className="text-sm text-slate-500">No documented interactions on file.</p>
              </div>
            )}
          </div>

          {/* Back CTA */}
          <div className="px-5 pb-5 mt-auto pt-3 shrink-0">
            <button
              onClick={e => { e.stopPropagation(); navigate(`/monograph/${sub.id}`); }}
              className="w-full py-2.5 bg-blue-700 hover:bg-blue-600 text-slate-100 text-sm font-semibold rounded-xl transition-all"
            >
              View Full Monograph →
            </button>
          </div>
        </article>

      </div>
    </div>
  );
};

// ─── Catalog page ─────────────────────────────────────────────────────────────
const SubstanceCatalog: React.FC = () => {
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
      <PageContainer className="max-w-7xl mx-auto px-6 py-10 sm:px-10 lg:px-12 space-y-10">
        <Section spacing="default" className="space-y-8">

          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight text-slate-300">Substance Library</h1>
            <p className="text-base text-slate-500">
              {SUBSTANCES.length} substances indexed · Click any card to review interactions
            </p>
          </div>

          <div className="space-y-4">
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
                      ${isActive ? filter.countClasses : 'bg-slate-700 text-slate-200'}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {(activeFilter !== 'all' || searchQuery) && (
            <p className="text-base text-slate-400">
              Showing {filteredSubstances.length} of {SUBSTANCES.length} substances
              {activeFilter !== 'all' && ` · ${activeFilterCfg.label}`}
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-20">
            {filteredSubstances.length > 0
              ? filteredSubstances.map(sub => <SubstanceCard key={sub.id} sub={sub} />)
              : (
                <div className="col-span-full py-24 text-center space-y-3">
                  <p className="text-2xl" aria-hidden="true">🔬</p>
                  <p className="text-slate-400 text-lg font-medium">No substances match this filter.</p>
                  <button onClick={() => { setActiveFilter('all'); setSearchQuery(''); }}
                    className="text-base text-slate-500 hover:text-slate-300 underline">
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
