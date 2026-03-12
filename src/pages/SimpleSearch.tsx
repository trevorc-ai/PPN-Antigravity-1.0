/**
 * SimpleSearch.tsx, Post-Login Home (WO-532)
 *
 * Google-style search portal. The first thing every authenticated user
 * sees after login. Live client-side keyword search with inline result
 * cards, quick-link chips, and feature launch tiles.
 *
 * Layout (top to bottom):
 *   1. Personalized greeting
 *   2. Live search bar + inline results
 *   3. Quick-link chips
 *   4. Four bold feature launch tiles
 *   5. Receptor Binding Affinity Matrix
 *   6. Global Benchmark Intelligence
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HeartPulse,
  Zap,
  FlaskConical,
  BarChart3,
  ArrowRight,
  Search,
  X,
  BookOpen,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

import ReceptorBindingHeatmap from '../components/analytics/ReceptorBindingHeatmap';
// WO-MOBILE-OPT: GlobalBenchmarkIntelligence moved to analytics page — import removed (was dead code, never rendered)

// ─── Keyword → page map (client-side only, zero network requests) ─────────────

interface SearchResult {
  id: string;
  page: string;
  description: string;
  path: string;
  icon: React.FC<{ className?: string }>;
  iconColor: string;
  keywords: string[];
}

const SEARCH_INDEX: SearchResult[] = [
  {
    id: 'wellness-journey',
    page: 'Wellness Journey',
    description: 'Log preparation, dosing sessions, and integration, 3-phase clinical documentation.',
    path: '/wellness-journey',
    icon: HeartPulse,
    iconColor: 'text-teal-400',
    keywords: ['session', 'patient', 'protocol', 'preparation', 'dosing', 'integration', 'wellness', 'journey', 'arc', 'care', 'log'],
  },
  {
    id: 'interactions',
    page: 'Interaction Checker',
    description: 'Cross-reference medications against your protocol. Flags dangerous interactions before the session.',
    path: '/interactions',
    icon: Zap,
    iconColor: 'text-amber-400',
    keywords: ['interaction', 'contraindication', 'medication', 'safety', 'serotonin', 'drug', 'mdma', 'ketamine', 'psilocybin', 'ibogaine', 'check'],
  },
  {
    id: 'catalog',
    page: 'Substance Library',
    description: 'Monographs for psilocybin, MDMA, ketamine, ibogaine and more, receptor binding, dosing ranges, contraindications.',
    path: '/catalog',
    icon: FlaskConical,
    iconColor: 'text-indigo-400',
    keywords: ['substance', 'catalog', 'library', 'psilocybin', 'mdma', 'ketamine', 'ibogaine', 'lsd', 'receptor', 'binding', 'pharmacology', 'compound', 'monograph'],
  },
  {
    id: 'analytics',
    page: 'Clinical Analytics',
    description: 'Benchmark your outcomes against the anonymised peer network. Spot protocol gaps before they become liabilities.',
    path: '/analytics',
    icon: BarChart3,
    iconColor: 'text-violet-400',
    keywords: ['analytics', 'report', 'benchmark', 'outcomes', 'performance', 'radar', 'galaxy', 'patient', 'network', 'intelligence', 'clinical'],
  },
  {
    id: 'help',
    page: 'Help & FAQ',
    description: 'Guides, FAQs and platform documentation for practitioners.',
    path: '/help',
    icon: BookOpen,
    iconColor: 'text-slate-400',
    keywords: ['help', 'faq', 'guide', 'support', 'documentation', 'settings', 'onboarding'],
  },
  {
    id: 'settings',
    page: 'Settings',
    description: 'Configure your workspace, notification preferences, and account details.',
    path: '/settings',
    icon: Sparkles,
    iconColor: 'text-slate-400',
    keywords: ['settings', 'account', 'profile', 'workspace', 'configure', 'preferences', 'customize'],
  },
];

const QUICK_LINKS = [
  { label: 'Interaction Checker', path: '/interactions', icon: Zap, color: 'border-amber-500/30 text-amber-400 hover:bg-amber-500/10 hover:border-amber-400/60' },
  { label: 'Wellness Journey', path: '/wellness-journey', icon: HeartPulse, color: 'border-teal-500/30 text-teal-400 hover:bg-teal-500/10 hover:border-teal-400/60' },
  { label: 'Substance Library', path: '/catalog', icon: FlaskConical, color: 'border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10 hover:border-indigo-400/60' },
  { label: 'Clinical Analytics', path: '/analytics', icon: BarChart3, color: 'border-violet-500/30 text-violet-400 hover:bg-violet-500/10 hover:border-violet-400/60' },
];

interface SimpleSearchProps {
  onStartTour?: () => void;
}

// ─── Feature tile definitions ─────────────────────────────────────────────────

const FEATURE_TILES = [
  {
    id: 'wellness-journey',
    label: 'Wellness Journey',
    tagline: 'Full 3-phase patient arc',
    description: 'Log preparation, dosing sessions, and integration, structured clinical documentation from first intake to follow-up.',
    path: '/wellness-journey',
    icon: HeartPulse,
    gradient: 'from-teal-500/20 via-teal-600/10 to-transparent',
    border: 'border-teal-500/30 hover:border-teal-400/60',
    glow: 'shadow-teal-900/40',
    iconColor: 'text-teal-300',
    iconBg: 'bg-teal-500/20',
    tagColor: 'text-teal-400',
    accentBar: 'bg-teal-500',
  },
  {
    id: 'interaction-checker',
    label: 'Interaction Checker',
    tagline: 'Safety screening engine',
    description: 'Cross-reference patient medications against your selected protocol. Flags dangerous interactions including serotonin syndrome before the session.',
    path: '/interactions',
    icon: Zap,
    gradient: 'from-amber-500/20 via-amber-600/10 to-transparent',
    border: 'border-amber-500/30 hover:border-amber-400/60',
    glow: 'shadow-amber-900/40',
    iconColor: 'text-amber-300',
    iconBg: 'bg-amber-500/20',
    tagColor: 'text-amber-400',
    accentBar: 'bg-amber-500',
  },
  {
    id: 'substance-catalog',
    label: 'Substance Library',
    tagline: 'Clinical pharmacology data',
    description: 'Monographs for psilocybin, MDMA, ketamine, ibogaine, and more, with receptor binding, dosing ranges, and contraindication profiles.',
    path: '/catalog',
    icon: FlaskConical,
    gradient: 'from-indigo-500/20 via-indigo-600/10 to-transparent',
    border: 'border-indigo-500/30 hover:border-indigo-400/60',
    glow: 'shadow-indigo-900/40',
    iconColor: 'text-indigo-300',
    iconBg: 'bg-indigo-500/20',
    tagColor: 'text-indigo-400',
    accentBar: 'bg-indigo-500',
  },
  {
    id: 'analytics',
    label: 'Clinical Analytics',
    tagline: 'Outcomes & benchmarks',
    description: 'Compare your efficacy scores against the anonymized peer network. Spot protocol gaps before they become liabilities.',
    path: '/analytics',
    icon: BarChart3,
    gradient: 'from-violet-500/20 via-violet-600/10 to-transparent',
    border: 'border-violet-500/30 hover:border-violet-400/60',
    glow: 'shadow-violet-900/40',
    iconColor: 'text-violet-300',
    iconBg: 'bg-violet-500/20',
    tagColor: 'text-violet-400',
    accentBar: 'bg-violet-500',
  },
] as const;

// ─── Sub-components ────────────────────────────────────────────────────────────

const FeatureTile: React.FC<typeof FEATURE_TILES[number]> = ({
  id, label, tagline, description, path, icon: Icon,
  gradient, border, glow, iconColor, iconBg, tagColor, accentBar,
}) => {
  const navigate = useNavigate();
  return (
    <button
      id={`portal-tile-${id}`}
      onClick={() => navigate(path)}
      className={`
        group relative flex flex-col gap-3 sm:gap-4 p-4 sm:p-6 rounded-3xl text-left
        bg-gradient-to-br ${gradient}
        border ${border}
        shadow-xl ${glow}
        transition-all duration-300
        hover:-translate-y-1 hover:shadow-2xl
        active:scale-[0.98]
        overflow-hidden
      `}
    >
      {/* Accent top bar */}
      <div className={`absolute top-0 left-6 right-6 h-[2px] ${accentBar} rounded-b-full opacity-60 group-hover:opacity-100 transition-opacity`} />

      {/* Icon */}
      <div className={`w-12 h-12 rounded-2xl ${iconBg} flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 duration-300`}>
        <Icon className={`w-6 h-6 ${iconColor}`} aria-hidden="true" />
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className={`text-xs font-black uppercase tracking-widest ${tagColor} mb-1`}>{tagline}</p>
        <h3 className="text-lg font-black text-slate-200 mb-2 leading-snug">{label}</h3>
        <p className="text-sm text-slate-400 leading-relaxed line-clamp-3">{description}</p>
      </div>

      {/* Arrow */}
      <div className="flex items-center justify-end">
        <span className={`flex items-center gap-1 text-xs font-black ${tagColor} opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0 duration-300`}>
          Open <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </button>
  );
};

// ─── Main component ────────────────────────────────────────────────────────────

// ─── Live Search Hook ─────────────────────────────────────────────────────────

function useSearch(query: string): SearchResult[] {
  return React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    const tokens = q.split(/\s+/);
    return SEARCH_INDEX.filter((result) =>
      tokens.every((token) =>
        result.keywords.some((kw) => kw.includes(token)) ||
        result.page.toLowerCase().includes(token) ||
        result.description.toLowerCase().includes(token)
      )
    );
  }, [query]);
}

// ─── Main component ────────────────────────────────────────────────────────────

const SimpleSearch: React.FC<SimpleSearchProps> = ({ onStartTour }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const results = useSearch(query);

  // Auto-focus on mount — desktop only. On mobile/tablet this triggers the keyboard
  // immediately which crushes the layout and creates a terrible first impression.
  useEffect(() => {
    const isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    if (isTouchDevice) return;
    const t = setTimeout(() => inputRef.current?.focus(), 50);
    return () => clearTimeout(t);
  }, []);

  const clearSearch = useCallback(() => {
    setQuery('');
    setActiveIdx(-1);
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!results.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, -1));
    } else if (e.key === 'Enter' && activeIdx >= 0) {
      navigate(results[activeIdx].path);
      setQuery('');
    } else if (e.key === 'Escape') {
      clearSearch();
    }
  }, [results, activeIdx, navigate, clearSearch]);

  const showResults = isFocused && query.trim().length >= 2;

  return (
    <div className="min-h-screen animate-in fade-in duration-500">
      {/* WO-MOBILE-OPT: pb-20 md:pb-4 ensures bottom nav (mobile) cannot overlay last section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 sm:space-y-12 pb-28 md:pb-8">

        {/* ── 1. Hero greeting ─────────────────────────────────────────────── */}
        <div className="text-center space-y-3 pt-2 sm:pt-4">
          {/* Status pill */}
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
              <span className="text-xs font-black text-emerald-400 uppercase tracking-wide">System Online</span>
            </span>
            <span className="px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-black text-indigo-400 uppercase tracking-wide">
              Beta Access
            </span>
          </div>
          <h1 className="ppn-page-title">
            Welcome to the PPN Portal
          </h1>
          <p className="ppn-body text-slate-400 max-w-lg mx-auto">
            Search the platform, or select a tool below to get started.
          </p>
        </div>

        {/* ── 2. Live Search Bar ───────────────────────────────────────────── */}
        <div className="max-w-3xl mx-auto relative">
          {/* Ambient glow behind search bar */}
          <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500/5 via-violet-500/10 to-indigo-500/5 blur-2xl rounded-full pointer-events-none" />

          <div className="relative">
            {/* Search Input */}
            <div className={`relative flex items-center transition-all duration-200 ${isFocused ? 'ring-2 ring-indigo-500/40' : ''
              } rounded-2xl`}>
              <Search
                className="absolute left-5 w-5 h-5 text-slate-400 pointer-events-none flex-shrink-0 z-10"
                aria-hidden="true"
              />
              <input
                ref={inputRef}
                id="portal-search"
                type="text"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setActiveIdx(-1); }}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setTimeout(() => setIsFocused(false), 150)}
                onKeyDown={handleKeyDown}
                placeholder="Search substances, protocols, interactions, analytics..."
                aria-label="Search the PPN portal"
                aria-autocomplete="list"
                aria-controls={showResults ? 'search-results' : undefined}
                aria-activedescendant={activeIdx >= 0 ? `search-result-${activeIdx}` : undefined}
                autoComplete="off"
                className="
                  w-full h-14
                  bg-slate-900/80 border border-slate-700/60
                  rounded-2xl pl-14 pr-14
                  text-slate-200 placeholder:text-slate-500
                  text-base font-medium
                  backdrop-blur-xl
                  focus:outline-none focus:border-indigo-500/60
                  transition-all duration-200
                "
              />
              {query && (
                <button
                  onClick={clearSearch}
                  aria-label="Clear search"
                  className="absolute right-3 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800/60 active:scale-95 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Inline Result Cards */}
            {showResults && (
              <div
                id="search-results"
                role="listbox"
                aria-label="Search results"
                className="
                  absolute top-full left-0 right-0 mt-2 z-50
                  bg-slate-900/95 backdrop-blur-xl
                  border border-slate-700/60 rounded-2xl
                  shadow-2xl shadow-slate-950/80
                  overflow-hidden
                  animate-in fade-in slide-in-from-top-2 duration-150
                "
              >
                {results.length === 0 ? (
                  <div className="px-6 py-5 text-center">
                    <p className="ppn-body text-slate-500">No results for <span className="text-slate-300 font-semibold">"{query}"</span></p>
                    <p className="ppn-meta text-slate-600 mt-1">Try: ketamine, patient, analytics, settings</p>
                  </div>
                ) : (
                  <ul className="divide-y divide-slate-800/60">
                    {results.map((result, idx) => {
                      const Icon = result.icon;
                      return (
                        <li key={result.id} id={`search-result-${idx}`} role="option" aria-selected={idx === activeIdx}>
                          <button
                            onClick={() => { navigate(result.path); setQuery(''); }}
                            onMouseEnter={() => setActiveIdx(idx)}
                            className={`
                              w-full flex items-center gap-4 px-5 py-4 text-left
                              transition-colors duration-100 group
                              ${idx === activeIdx ? 'bg-indigo-500/10' : 'hover:bg-slate-800/50'}
                            `}
                          >
                            <div className="w-9 h-9 rounded-xl bg-slate-800/80 border border-slate-700/50 flex items-center justify-center flex-shrink-0">
                              <Icon className={`w-4 h-4 ${result.iconColor}`} aria-hidden="true" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-black text-slate-200 leading-tight">{result.page}</p>
                              <p className="ppn-meta text-slate-500 mt-0.5 line-clamp-1">{result.description}</p>
                            </div>
                            <ArrowRight className={`w-4 h-4 flex-shrink-0 transition-all ${idx === activeIdx ? 'text-indigo-400 translate-x-0' : 'text-slate-600 -translate-x-1 group-hover:translate-x-0 group-hover:text-slate-400'
                              }`} />
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
                <div className="px-5 py-2.5 border-t border-slate-800/60 flex items-center gap-3">
                  <span className="ppn-meta text-slate-600">↑↓ navigate</span>
                  <span className="ppn-meta text-slate-600">↵ open</span>
                  <span className="ppn-meta text-slate-600">esc clear</span>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* ── 3. Feature tiles ─────────────────────────────────────────────── */}
        <div>
          <div className="flex items-center gap-3 mb-5">
            <h2 className="text-sm font-black text-slate-500 uppercase tracking-widest">Clinical Tools</h2>
            <div className="flex-1 h-px bg-slate-800" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURE_TILES.map((tile) => (
              <FeatureTile key={tile.id} {...tile} />
            ))}
          </div>
        </div>

        {/* ── 3b. Quick Links chips (WO-MOBILE-OPT: was defined but never rendered) ── */}
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {QUICK_LINKS.map(({ label, path, icon: Icon, color }) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-2xl border bg-slate-900/60 backdrop-blur-sm text-sm font-bold transition-all duration-200 active:scale-95 ${color}`}
              aria-label={`Go to ${label}`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
              {label}
            </button>
          ))}
        </div>



        {/* ── 4. Receptor Binding Affinity Matrix ──────────────────────────── */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-black text-slate-500 uppercase tracking-widest">Molecular Pharmacology</h2>
            <span className="text-xs font-black text-slate-600 uppercase tracking-widest border border-slate-800 px-2 py-0.5 rounded-md">10 compounds · 8 receptor systems</span>
            <div className="flex-1 h-px bg-slate-800" />
          </div>
          <div className="overflow-x-auto w-full">
            <ReceptorBindingHeatmap />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleSearch;
