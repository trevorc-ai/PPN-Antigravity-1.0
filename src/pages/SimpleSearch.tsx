/**
 * SimpleSearch.tsx — WO-510 (rebuilt)
 *
 * Post-login home. Replaces /dashboard as the default authenticated route.
 *
 * Structure:
 *   1. WelcomeHeroBanner     — first-time users only (localStorage flag)
 *   2. Portal header + "coming soon" search bar
 *   3. Quick-access chips    — 4 live destinations
 *   4. Receptor Binding Affinity Matrix  — filterable, self-contained
 *   5. Global Benchmark Intelligence     — real outcome data, alwaysShow=true for beta
 *
 * Props:
 *   onStartTour  — wired from ProtectedLayout via App.tsx, triggers GuidedTour
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Zap,
  HeartPulse,
  FlaskConical,
  BarChart3,
  SearchX,
} from 'lucide-react';

import WelcomeHeroBanner from '../components/WelcomeHeroBanner';
import ReceptorBindingHeatmap from '../components/analytics/ReceptorBindingHeatmap';
import GlobalBenchmarkIntelligence from '../components/analytics/GlobalBenchmarkIntelligence';
import { useAuth } from '../contexts/AuthContext';

interface SimpleSearchProps {
  onStartTour?: () => void;
}

// ─── Quick-access chip definitions ───────────────────────────────────────────

const QUICK_LINKS = [
  {
    label: 'Interaction Checker',
    path: '/interactions',
    icon: Zap,
    description: 'Check compound safety combinations',
    color: 'text-amber-400',
    border: 'border-amber-500/20 hover:border-amber-500/40',
    bg: 'hover:bg-amber-500/5',
  },
  {
    label: 'Wellness Journey',
    path: '/wellness-journey',
    icon: HeartPulse,
    description: 'Log and track patient sessions',
    color: 'text-teal-400',
    border: 'border-teal-500/20 hover:border-teal-500/40',
    bg: 'hover:bg-teal-500/5',
  },
  {
    label: 'Substance Catalog',
    path: '/catalog',
    icon: FlaskConical,
    description: 'Monographs, dosing, and pharmacology',
    color: 'text-indigo-400',
    border: 'border-indigo-500/20 hover:border-indigo-500/40',
    bg: 'hover:bg-indigo-500/5',
  },
  {
    label: 'Clinical Analytics',
    path: '/analytics',
    icon: BarChart3,
    description: 'Outcomes, benchmarks, and reporting',
    color: 'text-violet-400',
    border: 'border-violet-500/20 hover:border-violet-500/40',
    bg: 'hover:bg-violet-500/5',
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

const SimpleSearch: React.FC<SimpleSearchProps> = ({ onStartTour }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Welcome banner — shown once, dismissed via localStorage
  const [showBanner, setShowBanner] = useState(
    !localStorage.getItem('ppn_has_seen_welcome')
  );

  const handleStartTour = () => {
    localStorage.setItem('ppn_has_seen_welcome', 'true');
    setShowBanner(false);
    onStartTour?.();
  };

  const handleDismissBanner = () => {
    localStorage.setItem('ppn_has_seen_welcome', 'true');
    setShowBanner(false);
  };

  // Derive display name from email prefix
  const userName = user?.email?.split('@')[0] ?? '';

  return (
    <div className="min-h-screen animate-in fade-in duration-500">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">

        {/* ── 1. Welcome Banner (first-time only) ─────────────────────────── */}
        {showBanner && (
          <WelcomeHeroBanner
            userName={userName}
            onStartTour={handleStartTour}
            onDismiss={handleDismissBanner}
          />
        )}

        {/* ── 2. Portal header + disabled search bar ──────────────────────── */}
        <div className="text-center space-y-6">
          {/* Eyebrow */}
          <div className="flex items-center justify-center gap-2">
            <span className="ppn-meta uppercase tracking-widest text-indigo-400">
              PPN Research Portal
            </span>
            <span className="ppn-meta text-slate-600">·</span>
            <span className="ppn-meta uppercase tracking-widest text-slate-500">
              Beta
            </span>
          </div>

          {/* Heading — only shown when banner is not present */}
          {!showBanner && (
            <h1 className="ppn-section-title">
              {userName ? `Welcome back, ${userName}.` : 'Clinical Intelligence Portal'}
            </h1>
          )}

          {/* Search bar — visually present, marked coming soon */}
          <div className="relative max-w-2xl mx-auto group">
            {/* Ambient glow on focus */}
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/10 via-violet-500/10 to-indigo-500/10 blur-2xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity duration-700 pointer-events-none" />
            <div className="relative flex items-center">
              <input
                type="text"
                disabled
                placeholder="Neural Copilot search — coming soon..."
                aria-label="Search — Neural Copilot (coming soon)"
                className="
                  w-full h-16 sm:h-[4.5rem]
                  bg-slate-900/60 border border-slate-700/50
                  rounded-[2rem] px-8 sm:px-12
                  text-sm text-slate-500
                  placeholder:text-slate-600
                  cursor-not-allowed
                  backdrop-blur-xl
                  font-medium
                "
              />
              <div
                aria-hidden="true"
                className="absolute right-3 size-11 sm:size-14 bg-slate-800/60 border border-slate-700/50 rounded-full flex items-center justify-center"
              >
                <SearchX className="w-5 h-5 text-slate-600" />
              </div>
            </div>
            <p className="ppn-meta text-slate-600 mt-2 text-center">
              Semantic search across substances, protocols, and clinical outcomes is in development.
            </p>
          </div>
        </div>

        {/* ── 3. Quick-access chips ────────────────────────────────────────── */}
        <div className="space-y-3">
          <p className="ppn-label text-center text-slate-600">Quick Access</p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {QUICK_LINKS.map((link) => (
              <button
                key={link.path}
                id={`quick-link-${link.path.replace('/', '')}`}
                onClick={() => navigate(link.path)}
                className={`
                  flex flex-col items-start gap-2 p-4 rounded-2xl
                  bg-slate-900/40 ${link.bg}
                  border ${link.border}
                  transition-all hover:scale-[1.02] active:scale-[0.98]
                  text-left
                `}
              >
                <link.icon className={`w-5 h-5 ${link.color} flex-shrink-0`} aria-hidden="true" />
                <div>
                  <p className={`text-sm font-black ${link.color} leading-tight`}>
                    {link.label}
                  </p>
                  <p className="ppn-meta text-slate-500 mt-0.5 leading-snug">
                    {link.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ── 4. Receptor Binding Affinity Matrix ─────────────────────────── */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <h2 className="ppn-card-title text-slate-400">Molecular Pharmacology</h2>
            <span className="ppn-meta uppercase tracking-widest text-slate-600">
              10 compounds · 8 receptor systems
            </span>
          </div>
          <ReceptorBindingHeatmap />
        </div>

        {/* ── 5. Global Benchmark Intelligence ────────────────────────────── */}
        <div className="space-y-3 pb-12">
          <div className="flex items-center gap-3">
            <h2 className="ppn-card-title text-slate-400">Global Benchmark Intelligence</h2>
            <span className="ppn-meta uppercase tracking-widest text-slate-600">
              Live data
            </span>
          </div>
          {/* alwaysShow=true bypasses the isContributor gate for all beta testers */}
          <GlobalBenchmarkIntelligence alwaysShow={true} />
        </div>

      </div>
    </div>
  );
};

export default SimpleSearch;
