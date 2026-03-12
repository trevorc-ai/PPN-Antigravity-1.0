import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, BarChart3, FileText, ArrowRight, Network, Lock, TrendingUp } from 'lucide-react';

// ── GO-591: Clinical Front Door — Variation 1 (Clinical Audience) ─────────────
// Built by BUILDER 2026-03-12 per approved USER wireframe + design system + content matrix.
// Sources:
//   _GROWTH_ORDERS/04_VISUAL_REVIEW/Clinical_Front_Door_Wireframe.html  (USER-approved layout)
//   _GROWTH_ORDERS/03_MOCKUP_SANDBOX/design.md                          (approved design tokens)
//   _GROWTH_ORDERS/01_DRAFTING/WO-559_Variation_1_Clinical_Matrix.md    (approved copy)
// Route: /for-clinicians (existing — LEAD confirmed, do not create new file)
// Epic: GO-591 / WO-559 · Variations 2-5 reuse this layout blueprint.
// ─────────────────────────────────────────────────────────────────────────────

const ForClinicians: React.FC = () => {
  const navigate = useNavigate();

  // SEO — per content matrix frontmatter
  useEffect(() => {
    const prev = document.title;
    document.title = 'Zero-PHI Clinical Outcomes Tracking for Psychedelic Practitioners';

    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    const prevDesc = meta?.content ?? '';
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'description';
      document.head.appendChild(meta);
    }
    meta.content =
      'Join the Psychedelic Practitioner Network to effortlessly track patient outcomes, benchmark against global peers, and maintain zero-PHI compliance.';

    // JSON-LD MedicalOrganization schema
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'for-clinicians-jsonld';
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'MedicalOrganization',
      name: 'Psychedelic Practitioner Network',
      description:
        'The Psychedelic Practitioner Network (PPN) provides secure, zero-PHI clinical documentation and outcome benchmarking tools for psychedelic therapists and clinicians.',
    });
    document.head.appendChild(script);

    return () => {
      document.title = prev;
      if (meta) meta.content = prevDesc;
      document.getElementById('for-clinicians-jsonld')?.remove();
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#020408] text-slate-300 antialiased">

      {/* ────────────────────────────────────────────────────── */}
      {/* NAV — Section 1 of approved wireframe                 */}
      {/* ────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-[#020408]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo + wordmark */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0">
              <Network className="w-4 h-4 text-white" aria-hidden="true" />
            </div>
            <span className="text-slate-200 font-semibold text-sm tracking-tight">
              Psychedelic Practitioner Network
            </span>
          </div>

          {/* Nav links + CTA */}
          <div className="hidden md:flex items-center gap-6">
            <a href="#benefits" className="text-sm text-slate-400 hover:text-slate-200 transition-colors">
              How It Works
            </a>
            <a
              href="trevor-showcase.html"
              className="text-sm text-slate-400 hover:text-slate-200 transition-colors"
            >
              Showcase
            </a>
            <button
              onClick={() => navigate('/signup')}
              aria-label="Sign in to PPN Portal"
              className="px-5 py-2 rounded-full bg-slate-800 border border-slate-700 text-slate-200 text-sm font-medium hover:bg-slate-700 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              Sign In
            </button>
          </div>
        </div>
      </nav>

      {/* ────────────────────────────────────────────────────── */}
      {/* SECTION 1: HERO — approved wireframe section order    */}
      {/* ────────────────────────────────────────────────────── */}
      <section className="relative pt-24 pb-16 px-6 overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-indigo-600/6 blur-[120px] rounded-full pointer-events-none" aria-hidden="true" />

        <div className="relative max-w-4xl mx-auto text-center">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-sm font-semibold text-indigo-400 mb-8 tracking-wide">
            <Shield className="w-3.5 h-3.5" aria-hidden="true" />
            Clinical Intelligence Dashboard
          </div>

          {/* H1 — single h1 on the page, approved copy */}
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-slate-50 leading-[1.1] mb-6">
            Elevate Your Practice with<br className="hidden md:block" />{' '}
            Zero-PHI Clinical Intelligence.
          </h1>

          {/* H2 subtitle — approved copy */}
          <p className="text-xl md:text-2xl font-medium tracking-tight text-slate-400 max-w-3xl mx-auto leading-relaxed mb-10">
            The first documentation and network intelligence platform built specifically
            for psychedelic therapy practitioners. Log sessions effortlessly, benchmark
            your outcomes against a global peer network, and guarantee absolute patient
            anonymity.
          </p>

          {/* CTAs — both above the fold per approved wireframe */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/signup')}
              aria-label="Join the Psychedelic Practitioner Network"
              className="px-8 py-3.5 rounded-full bg-indigo-600 text-white font-medium text-base transition-all duration-200 hover:scale-[1.02] hover:bg-indigo-500 active:scale-[0.98] shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2"
            >
              Join the Network
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
            <a
              href="trevor-showcase.html"
              aria-label="View the practitioner capabilities showcase"
              className="px-8 py-3.5 rounded-full bg-slate-800 text-white font-medium text-base transition-all duration-200 hover:scale-[1.02] hover:bg-slate-700 border border-slate-700 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              ▶ View Demo Showcase
            </a>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────── */}
      {/* SECTION 2: HERO IMAGE — abstract clinical data visual  */}
      {/* ────────────────────────────────────────────────────── */}
      <section className="px-6 pb-12 max-w-6xl mx-auto" aria-label="Platform visualization">
        <div className="relative bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-[2rem] overflow-hidden h-64 md:h-80 flex items-center justify-center">
          {/* Abstract placeholder — replace with AI-generated image per design.md prompt */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/40 via-slate-900/20 to-indigo-950/60" aria-hidden="true" />
          <div className="relative flex flex-col items-center gap-3 opacity-40">
            <Network className="w-16 h-16 text-indigo-400" aria-hidden="true" />
            <p className="text-sm text-indigo-400 font-mono tracking-widest uppercase">
              Zero-Knowledge Clinical Network
            </p>
          </div>
          {/* Decorative nodes */}
          {[
            { top: '20%', left: '15%', size: 'w-2 h-2' },
            { top: '60%', left: '25%', size: 'w-3 h-3' },
            { top: '30%', left: '70%', size: 'w-2 h-2' },
            { top: '70%', left: '80%', size: 'w-1.5 h-1.5' },
            { top: '50%', left: '50%', size: 'w-4 h-4' },
          ].map((node, i) => (
            <div
              key={i}
              className={`absolute ${node.size} rounded-full bg-indigo-400/30 border border-indigo-400/20`}
              style={{ top: node.top, left: node.left }}
              aria-hidden="true"
            />
          ))}
        </div>
      </section>

      {/* ────────────────────────────────────────────────────── */}
      {/* SECTION 3: 3-COLUMN BENEFIT CARDS — approved layout   */}
      {/* ────────────────────────────────────────────────────── */}
      <section id="benefits" className="px-6 pb-16 max-w-6xl mx-auto" aria-labelledby="benefits-heading">
        <h2 id="benefits-heading" className="sr-only">Platform Benefits</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Benefit 1 */}
          <div className="bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-[2rem] p-8 shadow-xl shadow-black/40 hover:border-white/14 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-indigo-950/60 border border-indigo-500/20 flex items-center justify-center mb-6">
              <FileText className="w-6 h-6 text-indigo-400" aria-hidden="true" />
            </div>
            {/* H3 — approved copy */}
            <h3 className="text-xl font-medium tracking-tight text-slate-200 mb-3">
              Documenting a treatment should be as natural as conducting one.
            </h3>
            <p className="ppn-body text-slate-400 leading-relaxed">
              We provide every practitioner — regardless of technical ability — a fast,
              schema-stable way to document every treatment protocol. Every entry acts as
              a permanent, immutable clinical record.
            </p>
          </div>

          {/* Benefit 2 */}
          <div className="bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-[2rem] p-8 shadow-xl shadow-black/40 hover:border-white/14 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-indigo-950/60 border border-indigo-500/20 flex items-center justify-center mb-6">
              <Lock className="w-6 h-6 text-indigo-400" aria-hidden="true" />
            </div>
            <h3 className="text-xl font-medium tracking-tight text-slate-200 mb-3">
              Absolute privacy. Zero compromise.
            </h3>
            <p className="ppn-body text-slate-400 leading-relaxed">
              Protect your practice and your patients. The PPN platform uses synthetic
              Subject_IDs and foreign key architecture to ensure no naked Patient Health
              Information ever touches our servers. Your data is secure, and your patients
              remain anonymous.
            </p>
          </div>

          {/* Benefit 3 */}
          <div className="bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-[2rem] p-8 shadow-xl shadow-black/40 hover:border-white/14 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-indigo-950/60 border border-indigo-500/20 flex items-center justify-center mb-6">
              <TrendingUp className="w-6 h-6 text-indigo-400" aria-hidden="true" />
            </div>
            <h3 className="text-xl font-medium tracking-tight text-slate-200 mb-3">
              Smarter decisions with every session logged.
            </h3>
            <p className="ppn-body text-slate-400 leading-relaxed">
              Because our database structure never changes, PPN creates beautiful,
              real-time visual analytics. See how your protocol outcomes compare to the
              global peer network and optimize your care.
            </p>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────── */}
      {/* SECTION 4: TRUST SIGNAL — centered pull quote         */}
      {/* ────────────────────────────────────────────────────── */}
      <section className="px-6 pb-16 max-w-6xl mx-auto" aria-labelledby="trust-quote">
        <div className="bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-[2rem] p-16 text-center shadow-2xl shadow-indigo-900/10">
          <blockquote className="max-w-2xl mx-auto">
            <p className="text-2xl font-medium tracking-tight text-slate-200 leading-relaxed italic">
              "PPN is creating the gold standard for clinical documentation in the
              evolving field of psychedelic medicine."
            </p>
          </blockquote>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────── */}
      {/* SECTION 5: FOOTER CTA — approved wireframe            */}
      {/* ────────────────────────────────────────────────────── */}
      <section className="px-6 pb-20 max-w-6xl mx-auto" aria-labelledby="footer-cta-heading">
        <div className="bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-[2rem] p-16 text-center shadow-2xl shadow-black/40">
          <h2 id="footer-cta-heading" className="text-2xl font-medium tracking-tight text-slate-200 max-w-xl mx-auto mb-6">
            Ready to join the vanguard of psychedelic medicine?
          </h2>
          <p className="ppn-body text-slate-400 max-w-lg mx-auto mb-10">
            Get instant access to the clinical tools, outcome tracking, and the{' '}
            <a
              href="trevor-showcase.html"
              className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2 transition-colors"
            >
              practitioner capabilities showcase
            </a>
            .
          </p>
          <button
            onClick={() => navigate('/signup')}
            aria-label="Create your zero-PHI account on the Psychedelic Practitioner Network"
            className="px-10 py-4 rounded-full bg-indigo-600 text-white font-medium text-base transition-all duration-200 hover:scale-[1.02] hover:bg-indigo-500 active:scale-[0.98] shadow-lg shadow-indigo-600/20 inline-flex items-center gap-2"
          >
            Create Your Zero-PHI Account Now
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </section>

    </div>
  );
};

export default ForClinicians;
