import React, { useState, useMemo } from 'react';
import { SUBSTANCES } from '../constants';
import { PageContainer } from '../components/layouts/PageContainer';
import { Section } from '../components/layouts/Section';
import SubstanceCard from '../components/substance/SubstanceCard';

interface FilterOption {
  label: string;
  value: string;
  matchFn: (s: typeof SUBSTANCES[number]) => boolean;
}

const FILTERS: FilterOption[] = [
  { label: 'All', value: 'all', matchFn: () => true },
  { label: 'Tryptamines', value: 'tryptamine', matchFn: s => s.class?.toLowerCase().includes('tryptamine') },
  { label: 'Lysergamides', value: 'lysergamide', matchFn: s => s.class?.toLowerCase().includes('lysergamide') },
  { label: 'Phenethylamines', value: 'phenethylamine', matchFn: s => s.class?.toLowerCase().includes('phenethylamine') },
  { label: 'Dissociatives', value: 'dissociative', matchFn: s => s.class?.toLowerCase().includes('arylcyclohexylamine') },
  { label: 'Botanical', value: 'botanical', matchFn: s => s.class?.toLowerCase().includes('botanical') },
  { label: 'FDA Approved', value: 'approved', matchFn: s => s.phase === 'Approved' },
];

/**
 * SubstanceCatalog — preview page for the 10-substance clinical reference library.
 *
 * This page is a thin orchestrator — all card logic lives in SubstanceCard.
 * Provides: search, class filters, responsive grid.
 */
const SubstanceCatalog: React.FC = () => {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const filtered = useMemo(() => {
    const filterFn = FILTERS.find(f => f.value === activeFilter)?.matchFn ?? (() => true);
    const q = search.toLowerCase();
    return SUBSTANCES.filter(s =>
      filterFn(s) &&
      (!q || s.name.toLowerCase().includes(q) || s.chemicalName.toLowerCase().includes(q))
    );
  }, [search, activeFilter]);

  return (
    <div className="min-h-full bg-gradient-to-br from-[#0a0e1a] via-[#050810] to-[#020408] animate-in fade-in duration-700">
      <PageContainer className="max-w-screen-2xl mx-auto px-6 py-10 sm:px-10 lg:px-14 space-y-10">
        <Section spacing="default">

          {/* Page header */}
          <header className="space-y-1">
            <h1
              className="text-4xl sm:text-5xl font-black tracking-tighter"
              style={{ color: '#8BA5D3' }}
            >
              Substance Reference Library
            </h1>
            <p className="text-base text-slate-500 font-medium">
              {SUBSTANCES.length} substances indexed · Clinical-grade pharmacological reference for psychedelic practitioners
            </p>
          </header>

          {/* Search + Filter toolbar */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            {/* Search */}
            <div className="relative w-full sm:w-72">
              <span
                className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 text-lg pointer-events-none"
                aria-hidden="true"
              >
                search
              </span>
              <input
                id="catalog-search"
                type="search"
                placeholder="Search by name or chemical name…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-900/60 border border-slate-800 rounded-xl text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:border-slate-600 transition-colors"
                aria-label="Search substances"
              />
            </div>

            {/* Filter pills */}
            <div
              className="flex flex-wrap gap-2"
              role="group"
              aria-label="Filter substances by class"
            >
              {FILTERS.map(filter => {
                const count = SUBSTANCES.filter(filter.matchFn).length;
                const isActive = activeFilter === filter.value;
                return (
                  <button
                    key={filter.value}
                    id={`filter-${filter.value}`}
                    onClick={() => setActiveFilter(filter.value)}
                    aria-pressed={isActive}
                    className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest border transition-all ${isActive
                        ? 'bg-slate-700 border-slate-600 text-slate-200'
                        : 'bg-slate-900/50 border-slate-800 hover:bg-slate-800 text-slate-500'
                      }`}
                  >
                    {filter.label}
                    {filter.value !== 'all' && (
                      <span className="ml-1.5 opacity-60">{count}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Grid */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
              {filtered.map(sub => (
                <SubstanceCard key={sub.id} substance={sub} />
              ))}
            </div>
          ) : (
            <div className="py-24 text-center col-span-full">
              <span className="material-symbols-outlined text-5xl text-slate-800" aria-hidden="true">
                search_off
              </span>
              <p className="mt-4 text-slate-500 text-base font-medium">
                No substances match this filter or search.
              </p>
              <button
                onClick={() => { setSearch(''); setActiveFilter('all'); }}
                className="mt-4 text-sm text-slate-500 hover:text-slate-400 underline underline-offset-4 transition-colors"
              >
                Clear filters
              </button>
            </div>
          )}
        </Section>
      </PageContainer>
    </div>
  );
};

export default SubstanceCatalog;
