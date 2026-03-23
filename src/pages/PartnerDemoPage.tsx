import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

/**
 * PartnerDemoPage — WO-654-A
 *
 * Standalone, unauthenticated video player for the /partner-demo route.
 * Primary CTA destination from every waitlist confirmation email.
 * Designed for PsyCon Denver QR code visitors (April 9, 2026).
 *
 * Design spec:
 * - Background: #070b14 (exact hex per WO-654, not a Tailwind approximation)
 * - No PageContainer, no Section, no sidebar, no nav
 * - Full-viewport dark stage with centered video + wordmark + CTA
 */

const PartnerDemoPage: React.FC = () => {
  return (
    <div
      className="min-h-screen w-full flex flex-col"
      style={{ backgroundColor: '#070b14' }}
    >
      {/* ── Wordmark (top-left) ───────────────────────────────────────── */}
      <header className="absolute top-0 left-0 p-6 z-10">
        <span className="text-sm font-black uppercase tracking-widest text-primary">
          PPN Portal
        </span>
      </header>

      {/* ── Main stage ───────────────────────────────────────────────── */}
      <main className="flex flex-col items-center justify-center flex-1 px-4 py-20 gap-8">

        {/* Eyebrow */}
        <div className="text-center space-y-2">
          <p className="ppn-meta uppercase tracking-widest text-primary">
            2-Minute Platform Overview
          </p>
          <h1 className="ppn-page-title text-slate-200">
            Clinical Infrastructure for Psychedelic Therapy
          </h1>
        </div>

        {/* ── Video player ─────────────────────────────────────────────
            - autoPlay muted playsInline: no friction, no audio on load
            - controls: visible at all times per WO-654 spec
            - max-w-5xl caps at reasonable desktop size
            - rounded-xl matches PPN card radius
            - object-contain preserves 16:9 without cropping on mobile   */}
        <div className="w-full max-w-5xl">
          <video
            className="w-full rounded-xl shadow-2xl"
            style={{ maxHeight: '60vh' }}
            src="/video/PPN Portal - Navigating the Psychedelic Frontier HB.mp4"
            autoPlay
            muted
            controls
            playsInline
            preload="metadata"
            aria-label="PPN Portal 2-minute product overview video"
          >
            Your browser does not support the video tag.
          </video>
        </div>

        {/* ── CTA ──────────────────────────────────────────────────── */}
        <div className="flex flex-col items-center gap-3 text-center">
          <Link
            to="/waitlist"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-indigo-700/50 hover:bg-indigo-600/60 border border-indigo-500/50 text-indigo-100 text-sm font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-indigo-900/40"
          >
            Join the Waitlist
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
          <p className="ppn-meta text-slate-500">
            Founding partner access, no commitment required
          </p>
        </div>

      </main>

      {/* ── Footer ───────────────────────────────────────────────────── */}
      <footer className="text-center pb-8">
        <p className="ppn-meta text-slate-600">
          PPN Portal &nbsp;·&nbsp; Zero-PHI clinical infrastructure
        </p>
      </footer>
    </div>
  );
};

export default PartnerDemoPage;
