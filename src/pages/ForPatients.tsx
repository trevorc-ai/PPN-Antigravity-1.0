/**
 * ForPatients.tsx
 * ================
 * WO-EPIC-606 | BUILDER
 *
 * Patient-facing portal page. Replaces the "Coming Soon" stub.
 *
 * Renders PatientJourneyValidation as the hero section.
 * MVP: patientPhqData is empty (patient link-code data wiring is a future WO).
 * Community shadow-line operates from ref_benchmark_cohorts benchmark only.
 *
 * Route: /for-patients (already wired in App.tsx)
 */

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, FileText, LayoutDashboard } from 'lucide-react';
import { getPrimaryBenchmark, type BenchmarkCohort } from '../lib/benchmarks';
import PatientJourneyValidation from '../features/patient-portal/PatientJourneyValidation';

// Default substance for MVP community arc (psilocybin has widest benchmark data)
const DEFAULT_MODALITY = 'psilocybin';
const DEFAULT_CONDITION = 'MDD';
const DEFAULT_INSTRUMENT = 'PHQ-9';

const ForPatients: React.FC = () => {
  const [benchmark, setBenchmark] = useState<BenchmarkCohort | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getPrimaryBenchmark(DEFAULT_MODALITY, DEFAULT_CONDITION, DEFAULT_INSTRUMENT)
      .then(result => {
        if (!cancelled) setBenchmark(result);
      })
      .catch(() => {
        if (!cancelled) setBenchmark(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] via-[#0d0b1f] to-[#0a1628] text-slate-300">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-violet-900/20" aria-label="Patient portal navigation">
        <Link
          to="/dashboard"
          className="flex items-center gap-2 text-slate-500 hover:text-violet-300 transition-colors text-xs font-bold uppercase tracking-widest"
          aria-label="Return to dashboard"
        >
          <LayoutDashboard className="w-4 h-4" aria-hidden="true" />
          Dashboard
        </Link>
        <span className="ppn-meta text-violet-500/50 uppercase tracking-widest">Your Portal</span>
        <Link
          to="/for-patients/report"
          className="flex items-center gap-2 text-slate-500 hover:text-violet-300 transition-colors text-xs font-bold uppercase tracking-widest"
          aria-label="View your session report"
        >
          <FileText className="w-4 h-4" aria-hidden="true" />
          My Report
        </Link>
      </nav>

      {/* Main content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-8">
        {loading ? (
          /* Loading state */
          <div className="flex flex-col items-center justify-center py-24 gap-4" aria-busy="true" aria-label="Loading your journey data">
            <div className="size-14 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 animate-pulse">
              <span className="material-symbols-outlined text-3xl">auto_awesome</span>
            </div>
            <p className="ppn-meta text-violet-400/60 uppercase tracking-widest">Loading your journey…</p>
          </div>
        ) : (
          /* PatientJourneyValidation hero */
          <PatientJourneyValidation
            patientPhqData={[]}
            primaryBenchmark={benchmark}
            completedSessions={0}
            totalPlannedSessions={6}
            substanceName={benchmark ? (benchmark.modality.charAt(0).toUpperCase() + benchmark.modality.slice(1)) : 'Psychedelic Therapy'}
          />
        )}

        {/* Action Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
          <Link
            to="/for-patients/report"
            className="group flex items-center justify-between p-5 bg-violet-950/20 border border-violet-800/30 rounded-2xl hover:bg-violet-950/30 hover:border-violet-700/40 transition-all"
            aria-label="View your full session report"
          >
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-violet-400" aria-hidden="true" />
              <div>
                <p className="ppn-card-title text-violet-200">My Session Report</p>
                <p className="ppn-meta text-slate-500">Full outcomes &amp; timeline</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-violet-400/50 group-hover:text-violet-400 group-hover:translate-x-1 transition-all" aria-hidden="true" />
          </Link>

          <Link
            to="/dashboard"
            className="group flex items-center justify-between p-5 bg-slate-900/30 border border-slate-800/50 rounded-2xl hover:bg-slate-900/50 hover:border-slate-700/50 transition-all"
            aria-label="Return to practitioner dashboard"
          >
            <div className="flex items-center gap-3">
              <LayoutDashboard className="w-5 h-5 text-slate-400" aria-hidden="true" />
              <div>
                <p className="ppn-card-title text-slate-300">Back to Dashboard</p>
                <p className="ppn-meta text-slate-500">Practitioner view</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300 group-hover:translate-x-1 transition-all" aria-hidden="true" />
          </Link>
        </div>

        {/* Privacy note */}
        <p className="ppn-meta text-slate-700 text-center uppercase tracking-widest pb-8">
          Your data is anonymous and secure. No personal identifiers are stored.
        </p>
      </main>
    </div>
  );
};

export default ForPatients;
