import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, BarChart3, FileText, ArrowRight, Network, Lock, TrendingUp } from 'lucide-react';

// ── GO-591: Clinical Front Door — Variation 1 (Clinical Audience) ─────────────
// Built by BUILDER 2026-03-12 per approved USER wireframe, design system, content matrix.
// Sources:
//   _GROWTH_ORDERS/04_VISUAL_REVIEW/Clinical_Front_Door_Wireframe.html
//   _GROWTH_ORDERS/03_MOCKUP_SANDBOX/design.md
//   _GROWTH_ORDERS/01_DRAFTING/WO-559_Variation_1_Clinical_Matrix.md
// Route: /for-clinicians — LEAD confirmed, updates this existing page.
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

      {/* ── NAV ── */}
      <nav className="sticky top-0 z-50 bg-[#020408]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0">
              <Network className="w-4 h-4 text-white" aria-hidden="true" />
            </div>
            <span className="text-slate-200 font-semibold text-sm tracking-tight">
              Psychedelic Practitioner Network
            </span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <a href="#benefits" className="text-sm text-slate-400 hover:text-slate-200 transition-colors">
              How It Works
            </a>
            <button
              onClick={() => navigate('/waitlist')}
              aria-label="Sign in to PPN Portal"
              className="px-5 py-2 rounded-full bg-slate-800 border border-slate-700 text-slate-200 text-sm font-medium hover:bg-slate-700 transition-all"
            >
              Sign In
            </button>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative pt-24 pb-16 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-indigo-600/6 blur-[120px] rounded-full pointer-events-none" aria-hidden="true" />
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-sm font-semibold text-indigo-400 mb-8 tracking-wide">
            <Shield className="w-3.5 h-3.5" aria-hidden="true" />
            Clinical Intelligence Dashboard
          </div>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-slate-50 leading-[1.1] mb-6">
            Elevate Your Practice with Zero-PHI Clinical Intelligence.
          </h1>
          <p className="text-xl font-medium tracking-tight text-slate-400 max-w-3xl mx-auto leading-relaxed mb-10">
            The first documentation and network intelligence platform built specifically
            for psychedelic therapy practitioners. Log sessions effortlessly, benchmark
            your outcomes against a global peer network, and guarantee absolute patient
            anonymity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/waitlist')}
              aria-label="Join the Psychedelic Practitioner Network"
              className="px-8 py-3.5 rounded-full bg-indigo-600 text-white font-medium text-base transition-all hover:scale-[1.02] hover:bg-indigo-500 active:scale-[0.98] shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2"
            >
              Join the Network
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
            <button
              onClick={() => navigate('/landing')}
              aria-label="Learn more about PPN"
              className="px-8 py-3.5 rounded-full bg-slate-800 text-white font-medium text-base transition-all hover:scale-[1.02] hover:bg-slate-700 border border-slate-700 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* ── HERO VISUAL ── */}
      <section className="px-6 pb-12 max-w-6xl mx-auto">
        <div className="relative bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-[2rem] overflow-hidden h-64 md:h-80 flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/40 via-slate-900/20 to-indigo-950/60" aria-hidden="true" />
          <div className="relative flex flex-col items-center gap-3 opacity-30">
            <Network className="w-16 h-16 text-indigo-400" aria-hidden="true" />
            <p className="text-xs text-indigo-400 font-mono tracking-widest uppercase">Zero-Knowledge Clinical Network</p>
          </div>
        </div>
      </section>

      {/* ── BENEFIT CARDS ── */}
      <section id="benefits" className="px-6 pb-16 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              icon: <FileText className="w-6 h-6 text-indigo-400" aria-hidden="true" />,
              heading: 'Documenting a treatment should be as natural as conducting one.',
              body: 'We provide every practitioner — regardless of technical ability — a fast, schema-stable way to document every treatment protocol. Every entry is a permanent, immutable clinical record.',
            },
            {
              icon: <Lock className="w-6 h-6 text-indigo-400" aria-hidden="true" />,
              heading: 'Absolute privacy. Zero compromise.',
              body: 'Protect your practice and patients. PPN uses synthetic Subject_IDs so no patient health information ever touches our servers. Your data is secure, and your patients are anonymous.',
            },
            {
              icon: <TrendingUp className="w-6 h-6 text-indigo-400" aria-hidden="true" />,
              heading: 'Smarter decisions with every session logged.',
              body: 'Because our database structure never changes, PPN generates beautiful, real-time visual analytics — so you can benchmark your outcomes against the global peer network.',
            },
          ].map(({ icon, heading, body }) => (
            <div key={heading} className="bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-[2rem] p-8 shadow-xl shadow-black/40 hover:border-white/[0.14] transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-indigo-950/60 border border-indigo-500/20 flex items-center justify-center mb-6">
                {icon}
              </div>
              <h2 className="text-xl font-medium tracking-tight text-slate-200 mb-3">{heading}</h2>
              <p className="ppn-body text-slate-400 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FOOTER CTA ── */}
      <section className="px-6 pb-20 max-w-6xl mx-auto">
        <div className="bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-[2rem] p-16 text-center shadow-2xl shadow-black/40">
          <h2 className="text-2xl font-medium tracking-tight text-slate-200 max-w-xl mx-auto mb-6">
            Ready to join the vanguard of psychedelic medicine?
          </h2>
          <p className="ppn-body text-slate-400 max-w-lg mx-auto mb-10">
            Get instant access to the clinical tools, outcome tracking, and global benchmark intelligence — built for practitioners ready to lead.
          </p>
          <button
            onClick={() => navigate('/waitlist')}
            aria-label="Create your zero-PHI account"
            className="px-10 py-4 rounded-full bg-indigo-600 text-white font-medium text-base transition-all hover:scale-[1.02] hover:bg-indigo-500 active:scale-[0.98] shadow-lg shadow-indigo-600/20 inline-flex items-center gap-2"
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
