/**
 * SimpleSearch.tsx — Post-Login Hero (WO-510 / hero-page rebuild)
 *
 * The first thing every authenticated user sees after login.
 * Replaces the austere "coming soon" search bar with a vibrant,
 * information-rich hero that immediately communicates value and
 * gives clear next actions without trapping the user.
 *
 * Layout (top to bottom):
 *   1. Personalized greeting + status strip
 *   2. Four bold feature launch tiles (Wellness Journey, Interactions, Catalog, Analytics)
 *   3. Neural Copilot search bar (coming soon — clearly labelled)
 *   4. Receptor Binding Affinity Matrix
 *   5. Global Benchmark Intelligence
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HeartPulse,
  Zap,
  FlaskConical,
  BarChart3,
  ArrowRight,
  Sparkles,
  Activity,
  Shield,
  BookOpen,
  ChevronRight,
} from 'lucide-react';

import ReceptorBindingHeatmap from '../components/analytics/ReceptorBindingHeatmap';
import GlobalBenchmarkIntelligence from '../components/analytics/GlobalBenchmarkIntelligence';
import { useAuth } from '../contexts/AuthContext';

interface SimpleSearchProps {
  onStartTour?: () => void;
}

// ─── Feature tile definitions ─────────────────────────────────────────────────

const FEATURE_TILES = [
  {
    id: 'wellness-journey',
    label: 'Wellness Journey',
    tagline: 'Full 3-phase patient arc',
    description: 'Log preparation, dosing sessions, and integration — structured clinical documentation from first intake to follow-up.',
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
    description: 'Monographs for psilocybin, MDMA, ketamine, ibogaine, and more — with receptor binding, dosing ranges, and contraindication profiles.',
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
        group relative flex flex-col gap-4 p-6 rounded-3xl text-left
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

const SimpleSearch: React.FC<SimpleSearchProps> = ({ onStartTour }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const userName = user?.email?.split('@')[0] ?? '';
  const displayName = userName.charAt(0).toUpperCase() + userName.slice(1);

  return (
    <div className="min-h-screen animate-in fade-in duration-500">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">

        {/* ── 1. Hero greeting strip ───────────────────────────────────────── */}
        <div className="relative rounded-3xl overflow-hidden border border-slate-800/60 bg-gradient-to-br from-slate-900/80 via-[#0d1b2a]/80 to-slate-900/60 backdrop-blur-xl shadow-2xl">
          {/* Animated glow orbs */}
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-teal-500/10 blur-[60px] rounded-full pointer-events-none" />

          <div className="relative z-10 px-6 py-8 sm:px-10 sm:py-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div>
                {/* Status pill */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
                    <span className="text-xs font-black text-emerald-400 uppercase tracking-wide">System Online</span>
                  </span>
                  <span className="px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-black text-indigo-400 uppercase tracking-wide">
                    Beta Access
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-200 mb-2">
                  {displayName ? `Welcome, ${displayName}.` : 'Clinical Intelligence Portal'}
                </h1>
                <p className="text-base text-slate-400 max-w-xl leading-relaxed">
                  Your psychedelic practice intelligence platform. Select a tool below to get started.
                </p>
              </div>

              {/* Quick stats */}
              <div className="flex gap-3 flex-shrink-0">
                <div className="flex flex-col items-center justify-center px-5 py-4 rounded-2xl bg-slate-800/60 border border-slate-700/50 text-center min-w-[80px]">
                  <Activity className="w-4 h-4 text-teal-400 mb-1" />
                  <p className="text-xl font-black text-slate-200">Beta</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Status</p>
                </div>
                <div className="flex flex-col items-center justify-center px-5 py-4 rounded-2xl bg-slate-800/60 border border-slate-700/50 text-center min-w-[80px]">
                  <Shield className="w-4 h-4 text-indigo-400 mb-1" />
                  <p className="text-xl font-black text-slate-200">Zero</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">PHI</p>
                </div>
              </div>
            </div>

            {/* Help / tour strip */}
            <div className="mt-6 pt-5 border-t border-slate-800/60 flex flex-wrap gap-3">
              <button
                onClick={() => navigate('/help')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/60 border border-slate-700/40 hover:border-slate-600 text-slate-400 hover:text-slate-200 text-sm font-bold transition-all group"
              >
                <BookOpen className="w-4 h-4" />
                Help Center
                <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
              <button
                onClick={() => { onStartTour?.(); }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 hover:border-indigo-500/40 text-indigo-400 hover:text-indigo-300 text-sm font-bold transition-all group"
              >
                <Sparkles className="w-4 h-4" />
                Take the Tour
                <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </div>
          </div>
        </div>

        {/* ── 2. Feature tiles ─────────────────────────────────────────────── */}
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

        {/* ── 3. Neural Copilot search bar (coming soon) ───────────────────── */}
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/5 via-violet-500/10 to-indigo-500/5 blur-2xl rounded-full pointer-events-none" />
          <div className="relative flex items-center max-w-3xl mx-auto">
            <div className="flex-1 relative">
              <input
                type="text"
                disabled
                placeholder="Neural Copilot — semantic search across substances, protocols, and outcomes (coming soon)..."
                aria-label="Search — Neural Copilot (coming soon)"
                className="
                  w-full h-14
                  bg-slate-900/60 border border-slate-700/50
                  rounded-2xl px-6
                  text-sm text-slate-600
                  placeholder:text-slate-600
                  cursor-not-allowed
                  backdrop-blur-xl
                  font-medium
                  pr-32
                "
              />
              <div
                aria-hidden="true"
                className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/40 flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-500/60" />
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Soon</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── 4. Receptor Binding Affinity Matrix ──────────────────────────── */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-black text-slate-500 uppercase tracking-widest">Molecular Pharmacology</h2>
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest border border-slate-800 px-2 py-0.5 rounded-md">10 compounds · 8 receptor systems</span>
            <div className="flex-1 h-px bg-slate-800" />
          </div>
          <ReceptorBindingHeatmap />
        </div>

        {/* ── 5. Global Benchmark Intelligence ─────────────────────────────── */}
        <div className="space-y-4 pb-16">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-black text-slate-500 uppercase tracking-widest">Global Benchmark Intelligence</h2>
            <span className="flex items-center gap-1.5 text-[10px] font-black text-emerald-600 uppercase tracking-widest border border-emerald-900/50 px-2 py-0.5 rounded-md">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live data
            </span>
            <div className="flex-1 h-px bg-slate-800" />
          </div>
          {/* alwaysShow=true bypasses the isContributor gate for beta testers */}
          <GlobalBenchmarkIntelligence alwaysShow={true} />
        </div>

      </div>
    </div>
  );
};

export default SimpleSearch;
