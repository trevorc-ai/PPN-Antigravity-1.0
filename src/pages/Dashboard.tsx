import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity, AlertTriangle, TrendingUp, Users,
  Map, ArrowRight, Plus, Clock,
  BarChart3, Target, Share2, ChevronDown, ChevronUp,
  Search, X, HeartPulse, Zap, FlaskConical, BookOpen, Sparkles,
  PlayCircle, CheckCircle2, Clock3,
} from 'lucide-react';

import { PageContainer } from '../components/layouts/PageContainer';
import { Section } from '../components/layouts/Section';
import { usePractitionerProtocols } from '../hooks/usePractitionerProtocols';
import { useSiteDashboard } from '../hooks/useSiteDashboard';
import { DataQualityPanel } from '../components/admin/DataQualityPanel';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../supabaseClient';
import { PatientJourneyValidation } from '../features/patient-portal';
import { getPrimaryBenchmark, type BenchmarkCohort } from '../lib/benchmarks';

// ─────────────────────────────────────────────────────────────────────────────
// SEARCH INDEX (client-side only, zero network cost)
// ─────────────────────────────────────────────────────────────────────────────
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
    description: 'Log preparation, dosing sessions, and integration - 3-phase clinical documentation.',
    path: '/wellness-journey',
    icon: HeartPulse,
    iconColor: 'text-teal-400',
    keywords: ['session', 'patient', 'protocol', 'preparation', 'dosing', 'integration', 'wellness', 'journey', 'arc', 'care', 'log', 'phase'],
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
    description: 'Monographs for psilocybin, MDMA, ketamine, ibogaine and more - receptor binding, dosing ranges, contraindications.',
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
    page: 'Help and FAQ',
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

// ─────────────────────────────────────────────────────────────────────────────
// RESUME SESSION TYPES
// ─────────────────────────────────────────────────────────────────────────────
interface ResumeSession {
  subject_id: string;
  phase: number;
  substance_name: string | null;
  updated_at: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// SEARCH BAR - shared between header (desktop) and bottom bar (mobile)
// ─────────────────────────────────────────────────────────────────────────────
interface SearchBarProps {
  inputRef: React.RefObject<HTMLInputElement>;
  searchQuery: string;
  searchFocused: boolean;
  searchActiveIdx: number;
  searchResults: SearchResult[];
  showSearchResults: boolean;
  autoFocus?: boolean;
  onQueryChange: (q: string) => void;
  onFocus: () => void;
  onBlur: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onResultClick: (path: string) => void;
  onResultHover: (idx: number) => void;
  onClear: () => void;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  inputRef, searchQuery, searchFocused, searchActiveIdx, searchResults, showSearchResults,
  autoFocus, onQueryChange, onFocus, onBlur, onKeyDown, onResultClick, onResultHover, onClear, className,
}) => (
  <div className={`relative ${className ?? ''}`}>
    <div className={`relative flex items-center transition-all duration-200 ${searchFocused ? 'ring-2 ring-indigo-400/60 rounded-2xl shadow-lg shadow-indigo-900/30' : ''}`}>
      <Search className="absolute left-4 w-4 h-4 text-slate-400 pointer-events-none flex-shrink-0 z-10" aria-hidden="true" />
      <input
        ref={inputRef}
        id="dashboard-search"
        type="text"
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus={autoFocus}
        value={searchQuery}
        onChange={(e) => onQueryChange(e.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        placeholder="Search substances, tools, protocols..."
        aria-label="Search the PPN portal"
        aria-autocomplete="list"
        aria-controls={showSearchResults ? 'dashboard-search-results' : undefined}
        aria-activedescendant={searchActiveIdx >= 0 ? `dsearch-result-${searchActiveIdx}` : undefined}
        autoComplete="off"
        className="w-full h-12 bg-slate-900/90 border border-slate-500/70 hover:border-slate-400/80 rounded-2xl pl-12 pr-10 text-slate-200 placeholder:text-slate-500 text-sm font-medium backdrop-blur-xl focus:outline-none focus:border-indigo-400/80 transition-all duration-200"
      />
      {searchQuery && (
        <button
          onClick={onClear}
          aria-label="Clear search"
          className="absolute right-3 min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 active:scale-95 transition-all"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>

    {/* Dropdown */}
    {showSearchResults && (
      <div
        id="dashboard-search-results"
        role="listbox"
        aria-label="Search results"
        className="absolute bottom-full left-0 right-0 mb-2 md:top-full md:bottom-auto md:mt-2 z-50 bg-slate-900/97 backdrop-blur-xl border border-slate-600/70 rounded-2xl shadow-2xl shadow-slate-950/80 overflow-hidden animate-in fade-in slide-in-from-bottom-2 md:slide-in-from-top-2 duration-150"
      >
        {searchResults.length === 0 ? (
          <div className="px-5 py-4 text-center">
            <p className="text-sm text-slate-500">No results for <span className="text-slate-300 font-semibold">"{searchQuery}"</span></p>
            <p className="text-sm text-slate-600 mt-1">Try: ketamine, patient, analytics, settings</p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-800/60">
            {searchResults.map((result, idx) => {
              const Icon = result.icon;
              return (
                <li key={result.id} id={`dsearch-result-${idx}`} role="option" aria-selected={idx === searchActiveIdx}>
                  <button
                    onClick={() => onResultClick(result.path)}
                    onMouseEnter={() => onResultHover(idx)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors duration-100 group ${idx === searchActiveIdx ? 'bg-indigo-500/10' : 'hover:bg-slate-800/50'}`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-slate-800/80 border border-slate-700/50 flex items-center justify-center flex-shrink-0">
                      <Icon className={`w-3.5 h-3.5 ${result.iconColor}`} aria-hidden="true" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-black text-slate-200 leading-tight">{result.page}</p>
                      <p className="text-sm text-slate-500 mt-0.5 line-clamp-1">{result.description}</p>
                    </div>
                    <ArrowRight className={`w-3.5 h-3.5 flex-shrink-0 transition-all ${idx === searchActiveIdx ? 'text-indigo-400 translate-x-0' : 'text-slate-600 -translate-x-1 group-hover:translate-x-0 group-hover:text-slate-400'}`} />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
        <div className="px-4 py-2 border-t border-slate-800/60 flex items-center gap-3">
          <span className="text-sm text-slate-600">arrows: navigate</span>
          <span className="text-sm text-slate-600">enter: open</span>
          <span className="text-sm text-slate-600">esc: clear</span>
        </div>
      </div>
    )}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// CLINIC PERFORMANCE CARD
// ─────────────────────────────────────────────────────────────────────────────
interface ClinicPerformanceCardProps {
  title: string;
  value: string;
  change: string;
  comparison: string;
  percentile?: string;
  icon: React.ElementType;
  color: string;
  link?: string;
  isEmpty?: boolean;
}

const ClinicPerformanceCard: React.FC<ClinicPerformanceCardProps> = ({
  title, value, change, comparison, icon: Icon, color, link, isEmpty
}) => {
  const navigate = useNavigate();
  const mapColorStyles = (c: string) => {
    switch (c) {
      case 'indigo': return { text: 'text-indigo-400', bg: 'bg-indigo-500', glow: 'bg-indigo-500/20' };
      case 'emerald': return { text: 'text-emerald-400', bg: 'bg-emerald-500', glow: 'bg-emerald-500/20' };
      case 'amber': return { text: 'text-amber-400', bg: 'bg-amber-500', glow: 'bg-amber-500/20' };
      case 'blue': return { text: 'text-blue-400', bg: 'bg-blue-500', glow: 'bg-blue-500/20' };
      default: return { text: 'text-slate-400', bg: 'bg-slate-500', glow: 'bg-slate-500/20' };
    }
  };
  const styles = mapColorStyles(color);

  return (
    <div
      onClick={() => link && navigate(link)}
      className={`relative overflow-hidden bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-3xl p-4 md:p-5 transition-all group ${link ? 'cursor-pointer hover:border-slate-600 hover:shadow-2xl hover:-translate-y-1' : ''}`}
    >
      <div className={`absolute -top-10 -right-10 w-32 h-32 blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none ${styles.bg}`} />

      {/* Row 1: Title (left) + Icon (right) */}
      <div className="flex items-start justify-between mb-3 md:mb-4 relative z-10">
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest leading-snug pr-2">{title}</h3>
        <div className={`flex-shrink-0 p-2.5 rounded-2xl ${styles.glow} bg-opacity-20 border border-slate-700/50`}>
          <Icon className={`w-5 h-5 md:w-6 md:h-6 ${styles.text}`} />
        </div>
      </div>

      {/* Row 2: Value (left) + Change badge (right) */}
      <div className="flex items-end justify-between relative z-10">
        <div>
          {isEmpty ? (
            <button
              onClick={(e) => { e.stopPropagation(); navigate('/wellness-journey'); }}
              className={`text-sm font-black ${styles.text} hover:opacity-80 transition-opacity underline underline-offset-2 decoration-dotted`}
            >
              Log first session
            </button>
          ) : (
            <div className={`text-3xl md:text-4xl font-black tracking-tighter ${styles.text}`}>{value}</div>
          )}
        </div>
        <span className={`flex-shrink-0 font-bold px-2.5 py-1 rounded-lg text-sm ${change.startsWith('+') ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25' : 'bg-slate-800 text-slate-300 border border-slate-700/50'}`}>
          {change}
        </span>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// PHASE LABELS FOR RESUME CARD
// ─────────────────────────────────────────────────────────────────────────────
const PHASE_LABELS: Record<number, { label: string; color: string; icon: React.ElementType }> = {
  1: { label: 'Phase 1 : Preparation', color: 'text-teal-400 border-teal-500/30 bg-teal-500/10', icon: CheckCircle2 },
  2: { label: 'Phase 2 : Facilitation', color: 'text-indigo-400 border-indigo-500/30 bg-indigo-500/10', icon: PlayCircle },
  3: { label: 'Phase 3 : Integration', color: 'text-violet-400 border-violet-500/30 bg-violet-500/10', icon: Clock3 },
};

interface ResumeCardProps { session: ResumeSession; }

const ResumeCard: React.FC<ResumeCardProps> = ({ session }) => {
  const navigate = useNavigate();
  const phase = PHASE_LABELS[session.phase] ?? PHASE_LABELS[1];
  const PhaseIcon = phase.icon;

  return (
    <div
      onClick={() => navigate('/wellness-journey')}
      className="relative overflow-hidden rounded-3xl border border-indigo-500/25 bg-gradient-to-r from-indigo-950/60 via-slate-900/80 to-slate-900/60 backdrop-blur-xl p-5 cursor-pointer group hover:border-indigo-400/40 hover:shadow-xl hover:shadow-indigo-900/30 transition-all duration-300 animate-in fade-in slide-in-from-top-2 duration-500"
      role="region"
      aria-label="Resume active session"
    >
      <div className="absolute -top-8 -right-8 w-48 h-48 bg-indigo-500/8 blur-[80px] rounded-full pointer-events-none" aria-hidden="true" />
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-shrink-0">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-sm font-black text-indigo-400 uppercase tracking-widest">Active Session</span>
              <span className="text-slate-600">:</span>
              <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg border text-sm font-black ${phase.color}`}>
                <PhaseIcon className="w-3 h-3" aria-hidden="true" />
                {phase.label}
              </span>
            </div>
            <p className="text-sm font-bold text-slate-300">
              Subject <span className="font-black text-slate-100">{session.subject_id}</span>
              {session.substance_name && (
                <span className="text-slate-500 font-medium"> : {session.substance_name}</span>
              )}
            </p>
          </div>
        </div>
        <button className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-black tracking-wide shadow-lg shadow-indigo-900/40 transition-all active:scale-95">
          Continue <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
function getTimeOfDayGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function formatCurrentDate(): string {
  return new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN DASHBOARD
// ─────────────────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const navigate = useNavigate();
  const { user, userRole, userProfile } = useAuth();
  const firstName = userProfile?.first_name?.trim() || null;
  const { protocols, loading: protocolsLoading, refetch, lastFetchedAt } = usePractitionerProtocols();

  // ── WO-697: mv_site_dashboard_summary ───────────────────────────────────
  // Source: mv_site_dashboard_summary (capability #10 — site dashboard rollups)
  // Zero-state: null when site has no data — cards render "—" not 0
  const { data: siteKpi } = useSiteDashboard(user?.id);

  const hasProtocols = protocols.length > 0;

  // ── Search state ────────────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchActiveIdx, setSearchActiveIdx] = useState(-1);
  const desktopSearchRef = useRef<HTMLInputElement>(null);
  const mobileSearchRef = useRef<HTMLInputElement>(null);
  const searchResults = useSearch(searchQuery);
  const showSearchResults = searchFocused && searchQuery.trim().length >= 2;

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setSearchActiveIdx(-1);
  }, []);

  const handleSearchKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSearchActiveIdx((i) => Math.min(i + 1, searchResults.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSearchActiveIdx((i) => Math.max(i - 1, -1));
    } else if (e.key === 'Enter' && searchActiveIdx >= 0) {
      navigate(searchResults[searchActiveIdx].path);
      setSearchQuery('');
    } else if (e.key === 'Escape') {
      clearSearch();
    }
  }, [searchResults, searchActiveIdx, navigate, clearSearch]);

  const handleResultClick = useCallback((path: string) => {
    navigate(path);
    setSearchQuery('');
  }, [navigate]);

  const handleResultHover = useCallback((idx: number) => {
    setSearchActiveIdx(idx);
  }, []);

  // ── Detect desktop vs mobile for autoFocus ──────────────────────────────────
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // ── Patient Journey section ─────────────────────────────────────────────────
  const isPatientUser = userRole === 'user';
  const [isJourneyOpen, setIsJourneyOpen] = useState(true);
  const [patientBenchmark, setPatientBenchmark] = useState<BenchmarkCohort | null>(null);

  useEffect(() => {
    if (!isPatientUser) return;
    getPrimaryBenchmark('psilocybin', 'MDD', 'PHQ-9')
      .then(result => setPatientBenchmark(result))
      .catch(() => setPatientBenchmark(null));
  }, [isPatientUser]);

  // ── Resume session + integration pending ────────────────────────────────────
  const [resumeSession, setResumeSession] = useState<ResumeSession | null>(null);
  const [integrationPending, setIntegrationPending] = useState(0);

  useEffect(() => {
    if (!user?.id) return;
    let cancelled = false;
    (async () => {
      try {
        const { data: inProgress } = await supabase
          .from('protocols')
          .select('subject_id, phase, substance_name, updated_at')
          .eq('practitioner_id', user.id)
          .eq('status', 'in_progress')
          .order('updated_at', { ascending: false })
          .limit(1)
          .maybeSingle();
        if (!cancelled && inProgress) setResumeSession(inProgress as ResumeSession);

        const { count } = await supabase
          .from('protocols')
          .select('subject_id', { count: 'exact', head: true })
          .eq('practitioner_id', user.id)
          .eq('phase', 2)
          .eq('status', 'completed');

        if (!cancelled && count && count > 0) {
          const { data: phase2Subjects } = await supabase
            .from('protocols')
            .select('subject_id')
            .eq('practitioner_id', user.id)
            .eq('phase', 2)
            .eq('status', 'completed');

          if (!cancelled && phase2Subjects && phase2Subjects.length > 0) {
            const subjectIds = phase2Subjects.map((r: { subject_id: string }) => r.subject_id);
            const { count: phase3Count } = await supabase
              .from('protocols')
              .select('subject_id', { count: 'exact', head: true })
              .eq('practitioner_id', user.id)
              .eq('phase', 3)
              .in('subject_id', subjectIds);
            if (!cancelled) setIntegrationPending(Math.max(0, subjectIds.length - (phase3Count ?? 0)));
          }
        }
      } catch { /* silently ignore */ }
    })();
    return () => { cancelled = true; };
  }, [user?.id]);

  // ── Scroll position restore ─────────────────────────────────────────────────
  useEffect(() => {
    const saved = sessionStorage.getItem('dashboardScrollY');
    if (saved) setTimeout(() => window.scrollTo({ top: parseInt(saved, 10), behavior: 'instant' }), 50);
    const onScroll = () => sessionStorage.setItem('dashboardScrollY', window.scrollY.toString());
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const searchBarProps = {
    searchQuery,
    searchFocused,
    searchActiveIdx,
    searchResults,
    showSearchResults,
    onQueryChange: (q: string) => { setSearchQuery(q); setSearchActiveIdx(-1); },
    onFocus: () => setSearchFocused(true),
    onBlur: () => setTimeout(() => setSearchFocused(false), 150),
    onKeyDown: handleSearchKeyDown,
    onResultClick: handleResultClick,
    onResultHover: handleResultHover,
    onClear: clearSearch,
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#080c14] via-[#0c1220] to-[#0a0e1a] overflow-hidden text-slate-300">
      {/* Grid texture */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,black,transparent)] pointer-events-none z-0" />

      {/* Aurora glows - richer on hero */}
      <div className="absolute top-0 left-0 w-[700px] h-[500px] bg-indigo-600/12 blur-[130px] rounded-full pointer-events-none z-0" />
      <div className="absolute top-0 right-0 w-[500px] h-[400px] bg-teal-500/8 blur-[120px] rounded-full pointer-events-none z-0" />
      <div className="absolute top-[200px] left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-violet-600/6 blur-[150px] rounded-full pointer-events-none z-0" />

      <PageContainer className="relative z-10 flex flex-col gap-6 md:gap-8 pt-6 md:pt-8 pb-36 lg:pb-8">

        {/* ══════════════════════════════════════════════════════════════════
            HERO HEADER
        ══════════════════════════════════════════════════════════════════ */}
        <Section spacing="tight" data-tour="dashboard-header">

          {/* Greeting row: text left, search right (desktop only) */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              {/* Vibrant greeting with gradient */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-none mb-2">
                <span className="bg-gradient-to-r from-sky-300 via-indigo-300 to-violet-400 bg-clip-text text-transparent">
                  {getTimeOfDayGreeting()}{firstName ? `, ${firstName}` : ''}.
                </span>
              </h1>
              <p className="text-sm font-medium text-slate-400 mt-1">{formatCurrentDate()}</p>

              {/* Vibrant sub-tagline - welcoming for new users */}
              <p className="text-sm font-medium text-slate-500 mt-2 max-w-md leading-relaxed">
                Your clinical documentation platform. Document every session, benchmark every outcome.
              </p>
            </div>

            {/* Desktop search bar - hidden on mobile (shown in sticky bottom bar) */}
            <SearchBar
              {...searchBarProps}
              inputRef={desktopSearchRef}
              autoFocus={isDesktop}
              className="hidden md:block w-full md:w-96 flex-shrink-0"
            />
          </div>

          {/* Horizontal separator */}
          <div className="mt-6 border-b border-slate-800/80" />
        </Section>

        {/* ══════════════════════════════════════════════════════════════════
            RESUME SESSION CARD
        ══════════════════════════════════════════════════════════════════ */}
        {resumeSession && (
          <Section spacing="tight">
            <ResumeCard session={resumeSession} />
          </Section>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            INTEGRATION PENDING ALERT
        ══════════════════════════════════════════════════════════════════ */}
        {integrationPending > 0 && !isPatientUser && (
          <Section spacing="tight">
            <button
              onClick={() => navigate('/wellness-journey')}
              className="w-full flex items-center justify-between gap-4 px-5 py-4 rounded-2xl bg-violet-950/40 border border-violet-500/25 hover:border-violet-400/40 hover:bg-violet-950/60 transition-all group animate-in fade-in duration-500"
              aria-label={`${integrationPending} patient${integrationPending !== 1 ? 's' : ''} awaiting integration session`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-violet-500/15 border border-violet-500/25 flex items-center justify-center flex-shrink-0">
                  <Clock3 className="w-4 h-4 text-violet-400" aria-hidden="true" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-black text-violet-300">
                    {integrationPending} patient{integrationPending !== 1 ? 's' : ''} awaiting integration session
                  </p>
                  <p className="text-sm text-violet-500/70 mt-0.5">
                    Integration is as critical as facilitation. Don't skip it.
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-violet-500 group-hover:text-violet-300 group-hover:translate-x-0.5 transition-all flex-shrink-0" aria-hidden="true" />
            </button>
          </Section>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            CLINIC PERFORMANCE
            Mobile:  2x2 grid
            Tablet:  4-col single row (md:grid-cols-4)
            Desktop: 4-col single row (same, no change)
        ══════════════════════════════════════════════════════════════════ */}
        <Section spacing="tight">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h2 className="text-xl md:text-2xl font-black tracking-tight" style={{ color: '#A8B5D1' }}>Your Clinic Performance</h2>
            <span className="text-sm text-slate-500 font-medium">This Month</span>
          </div>

          {/* Responsive grid: 2x2 on mobile, 4-col on md+ */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <ClinicPerformanceCard
              title="Protocols Logged"
              value={hasProtocols ? String(protocols.length) : '--'}
              change={hasProtocols ? '+12%' : 'No data'}
              comparison={hasProtocols ? 'Network avg: 18' : 'Log first session'}
              icon={BarChart3}
              color="indigo"
              isEmpty={!hasProtocols}
            />
            <ClinicPerformanceCard
              title="Follow-up Completion"
              value={
                siteKpi?.followup_completion_rate != null
                  ? `${Math.round(siteKpi.followup_completion_rate * 100)}%`
                  : hasProtocols ? '—' : '--'
              }
              change={siteKpi?.followup_completion_rate != null ? 'Live' : 'No data'}
              comparison={siteKpi != null ? 'Live · mv_site_dashboard_summary' : 'Log first session'}
              icon={Target}
              color="emerald"
              isEmpty={!hasProtocols && siteKpi == null}
            />
            <ClinicPerformanceCard
              title="Safety Alerts"
              value={
                siteKpi?.unresolved_safety_count != null
                  ? String(siteKpi.unresolved_safety_count)
                  : hasProtocols ? '—' : '--'
              }
              change={siteKpi?.unresolved_safety_count != null ? 'Monitoring' : 'No data'}
              comparison={
                siteKpi?.unresolved_safety_count != null
                  ? 'Review required'
                  : 'Log first session'
              }
              icon={AlertTriangle}
              color="amber"
            />
            <ClinicPerformanceCard
              title="Documentation"
              value={
                siteKpi?.documentation_completeness_pct != null
                  ? `${Math.round(siteKpi.documentation_completeness_pct * 100)}%`
                  : hasProtocols ? '—' : '--'
              }
              change={siteKpi?.documentation_completeness_pct != null ? 'Live' : 'No data'}
              comparison={
                siteKpi != null
                  ? (import.meta.env.DEV ? 'Live · mv_site_dashboard_summary' : 'Avg completeness')
                  : 'Log first session'
              }
              icon={Clock}
              color="blue"
              isEmpty={!hasProtocols && siteKpi == null}
            />
          </div>
        </Section>


        {/* ══════════════════════════════════════════════════════════════════
            ADMIN: DATA QUALITY PANEL — WO-701 / WO-702
            Role-gated: site_admin / admin only.
            Source: mv_site_documentation_summary, mv_site_followup_compliance
        ══════════════════════════════════════════════════════════════════ */}
        {userRole === 'admin' && user?.id && (
          <Section spacing="tight">
            <DataQualityPanel
              practitionerId={user.id}
              userRole={userRole}
            />
          </Section>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            QUICK ACTIONS - uniform 2x3 on mobile, 6-col on lg
        ══════════════════════════════════════════════════════════════════ */}
        <Section spacing="tight">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black tracking-tight" style={{ color: '#A8B5D1' }}>Quick Actions</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">

            {/* Log Protocol - indigo */}
            <button
              id="quick-action-log-protocol"
              data-tour="wellness-journey"
              onClick={() => navigate('/wellness-journey')}
              className="group relative flex flex-col items-center justify-center gap-3 p-5 min-h-[100px] rounded-2xl
                bg-indigo-500/12 hover:bg-indigo-500/22
                border border-indigo-500/35 hover:border-indigo-400/60
                shadow-lg shadow-indigo-900/30
                transition-all active:scale-95 cursor-pointer overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 to-transparent pointer-events-none" />
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/25 flex items-center justify-center shadow-inner">
                <Plus className="w-6 h-6 text-indigo-300" />
              </div>
              <div className="text-center relative z-10">
                <p className="text-sm font-black text-indigo-200 leading-tight">Log Protocol</p>
                <p className="text-sm text-indigo-400/70 mt-0.5 hidden sm:block">New session</p>
              </div>
            </button>

            {/* Analytics - blue */}
            <button
              id="quick-action-analytics"
              onClick={() => navigate('/analytics')}
              className="group relative flex flex-col items-center justify-center gap-3 p-5 rounded-2xl
                bg-blue-500/12 hover:bg-blue-500/22
                border border-blue-500/35 hover:border-blue-400/60
                shadow-lg shadow-blue-900/30
                transition-all active:scale-95 cursor-pointer overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent pointer-events-none" />
              <div className="w-12 h-12 rounded-2xl bg-blue-500/25 flex items-center justify-center shadow-inner">
                <BarChart3 className="w-6 h-6 text-blue-300" />
              </div>
              <div className="text-center relative z-10">
                <p className="text-sm font-black text-blue-200 leading-tight">Analytics</p>
                <p className="text-sm text-blue-400/70 mt-0.5 hidden sm:block">Outcomes</p>
              </div>
            </button>

            {/* Interactions - amber */}
            <button
              id="quick-action-interactions"
              data-tour="interaction-checker"
              onClick={() => navigate('/interactions')}
              className="group relative flex flex-col items-center justify-center gap-3 p-5 rounded-2xl
                bg-amber-500/12 hover:bg-amber-500/22
                border border-amber-500/35 hover:border-amber-400/60
                shadow-lg shadow-amber-900/30
                transition-all active:scale-95 cursor-pointer overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-amber-600/10 to-transparent pointer-events-none" />
              <div className="w-12 h-12 rounded-2xl bg-amber-500/25 flex items-center justify-center shadow-inner">
                <Activity className="w-6 h-6 text-amber-300" />
              </div>
              <div className="text-center relative z-10">
                <p className="text-sm font-black text-amber-200 leading-tight">Interactions</p>
                <p className="text-sm text-amber-400/70 mt-0.5 hidden sm:block">Drug checker</p>
              </div>
            </button>

            {/* Export Data - emerald */}
            <button
              id="quick-action-export"
              onClick={() => navigate('/data-export')}
              className="group relative flex flex-col items-center justify-center gap-3 p-5 rounded-2xl
                bg-emerald-500/12 hover:bg-emerald-500/22
                border border-emerald-500/35 hover:border-emerald-400/60
                shadow-lg shadow-emerald-900/30
                transition-all active:scale-95 cursor-pointer overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 to-transparent pointer-events-none" />
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/25 flex items-center justify-center shadow-inner">
                <TrendingUp className="w-6 h-6 text-emerald-300" />
              </div>
              <div className="text-center relative z-10">
                <p className="text-sm font-black text-emerald-200 leading-tight">Export Data</p>
                <p className="text-sm text-emerald-400/70 mt-0.5 hidden sm:block">CSV / PDF</p>
              </div>
            </button>

            {/* Benchmarks - purple */}
            <button
              id="quick-action-benchmarks"
              onClick={() => navigate('/deep-dives/clinic-performance')}
              className="group relative flex flex-col items-center justify-center gap-3 p-5 rounded-2xl
                bg-purple-500/12 hover:bg-purple-500/22
                border border-purple-500/35 hover:border-purple-400/60
                shadow-lg shadow-purple-900/30
                transition-all active:scale-95 cursor-pointer overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-transparent pointer-events-none" />
              <div className="w-12 h-12 rounded-2xl bg-purple-500/25 flex items-center justify-center shadow-inner">
                <Users className="w-6 h-6 text-purple-300" />
              </div>
              <div className="text-center relative z-10">
                <p className="text-sm font-black text-purple-200 leading-tight">Benchmarks</p>
                <p className="text-sm text-purple-400/70 mt-0.5 hidden sm:block">Peer network</p>
              </div>
            </button>

            {/* Share PPN - rose */}
            <button
              id="quick-action-share-network"
              onClick={() => navigate('/network-library')}
              className="group relative flex flex-col items-center justify-center gap-3 p-5 rounded-2xl
                bg-rose-500/12 hover:bg-rose-500/22
                border border-rose-500/35 hover:border-rose-400/60
                shadow-lg shadow-rose-900/30
                transition-all active:scale-95 cursor-pointer overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-rose-600/10 to-transparent pointer-events-none" />
              <div className="w-12 h-12 rounded-2xl bg-rose-500/25 flex items-center justify-center shadow-inner">
                <Share2 className="w-6 h-6 text-rose-300" />
              </div>
              <div className="text-center relative z-10">
                <p className="text-sm font-black text-rose-200 leading-tight">Share PPN</p>
                <p className="text-sm text-rose-400/70 mt-0.5 hidden sm:block">Invite network</p>
              </div>
            </button>

          </div>
        </Section>

        {/* ══════════════════════════════════════════════════════════════════
            YOUR HEALING JOURNEY - patient role only
        ══════════════════════════════════════════════════════════════════ */}
        {isPatientUser && (
          <Section spacing="tight">
            <div className="flex items-center justify-between mb-4">
              <h2 className="ppn-section-title">Your Healing Journey</h2>
              <button
                id="patient-journey-toggle"
                aria-expanded={isJourneyOpen}
                aria-controls="patient-journey-panel"
                onClick={() => setIsJourneyOpen(v => !v)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-400 text-sm font-black uppercase tracking-widest hover:bg-slate-700/60 transition-all"
              >
                {isJourneyOpen
                  ? <><ChevronUp className="w-3.5 h-3.5" aria-hidden="true" /> Collapse</>
                  : <><ChevronDown className="w-3.5 h-3.5" aria-hidden="true" /> View My Journey</>}
              </button>
            </div>
            {isJourneyOpen && (
              <div id="patient-journey-panel">
                <PatientJourneyValidation
                  patientPhqData={[]}
                  primaryBenchmark={patientBenchmark}
                  completedSessions={protocols.reduce((sum, p) => sum + p.session_count, 0)}
                  totalPlannedSessions={Math.max(protocols.length, 1)}
                  substanceName={protocols.length > 0 && protocols[0].substance_name ? protocols[0].substance_name : 'Your Protocol'}
                />
              </div>
            )}
          </Section>
        )}

        {/* Network Activity placeholder - hidden until live */}
        <Section spacing="tight" className="hidden">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black tracking-tight" style={{ color: '#A8B5D1' }}>Network Activity</h2>
          </div>
          <div className="card-glass rounded-3xl p-10 flex flex-col items-center justify-center gap-4 text-center border border-dashed border-slate-700/50">
            <Map className="w-8 h-8 text-slate-600" />
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Network benchmarks coming soon</p>
          </div>
        </Section>

      </PageContainer>

      {/* ══════════════════════════════════════════════════════════════════
          MOBILE STICKY SEARCH BAR (bottom, replaces floating Log CTA)
          Visible only on screens smaller than md breakpoint.
      ══════════════════════════════════════════════════════════════════ */}
      <div
        className="lg:hidden fixed left-0 right-0 z-[45] px-4"
        style={{ bottom: 'calc(68px + env(safe-area-inset-bottom, 0px))' }}
      >
        {/* Backdrop blur panel */}
        <div className="absolute inset-0 bg-[#090d18]/95 backdrop-blur-xl border-t border-slate-700/50" />
        <div className="relative z-10 py-2.5">
          <SearchBar
            {...searchBarProps}
            inputRef={mobileSearchRef}
            autoFocus={false}
            className="w-full"
          />
        </div>
      </div>

    </div>
  );
}