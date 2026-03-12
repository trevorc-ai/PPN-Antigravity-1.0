import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Shield, BarChart3, Users, ArrowRight } from 'lucide-react';

// ── GO-585: BetaWelcome Screen ────────────────────────────────────────────────
// Built by BUILDER 2026-03-12 per approved content matrix and design spec.
// Sources:
//   _GROWTH_ORDERS/03_MOCKUP_SANDBOX/GO-585_BetaWelcome_Content_Matrix.md
//   _GROWTH_ORDERS/03_MOCKUP_SANDBOX/GO-585_BetaWelcome_Design.md
// ─────────────────────────────────────────────────────────────────────────────

const BetaWelcome: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const firstName = searchParams.get('name');

  // SEO — per GO-585 content matrix
  useEffect(() => {
    const prev = document.title;
    document.title = 'PPN Portal - Founding Member Access';

    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    const prevDesc = meta?.content ?? '';
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'description';
      document.head.appendChild(meta);
    }
    meta.content =
      'You have been selected for early access to the PPN Portal. 1,500+ real clinical outcome records, zero-PHI by design, built for psychedelic therapy practitioners.';

    // JSON-LD MedicalOrganization schema — GO-585 requirement
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'beta-welcome-jsonld';
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'MedicalOrganization',
      name: 'Psychedelic Practitioner Network',
      description:
        'The PPN Portal is the first clinical documentation and network intelligence platform built for psychedelic therapy practitioners.',
    });
    document.head.appendChild(script);

    return () => {
      document.title = prev;
      if (meta) meta.content = prevDesc;
      document.getElementById('beta-welcome-jsonld')?.remove();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#020408] via-[#080c14] to-[#020408] flex flex-col items-center justify-between py-10 px-4">

      {/* Badge — FIX: text-xs → text-sm, Shield icon added */}
      <div className="flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/25 rounded-full text-sm font-semibold text-indigo-400 tracking-wide">
        <Shield className="w-4 h-4 shrink-0" aria-hidden="true" />
        Founding Member Access
      </div>

      {/* Main Card — FIX: mandated glass card pattern */}
      <div className="w-full max-w-[440px] bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-[2rem] p-6 flex flex-col gap-6 my-8 shadow-2xl shadow-black/40">

        {/* Network icon */}
        <div className="w-12 h-12 rounded-2xl bg-indigo-950/60 border border-indigo-500/20 flex items-center justify-center mx-auto">
          <BarChart3 className="w-6 h-6 text-indigo-400" aria-hidden="true" />
        </div>

        {/* Greeting — FIX (copy): active voice, approved text */}
        <div>
          <p className="ppn-body text-slate-400 mb-1">
            {firstName ? 'Welcome back,' : 'Welcome.'}
          </p>
          {firstName && (
            <h1 className="ppn-page-title text-slate-50 leading-tight">{firstName}</h1>
          )}
        </div>

        {/* Orientation paragraph — FIX: em dash → comma */}
        <p className="ppn-body text-slate-400 leading-relaxed">
          You are seeing the PPN Portal before anyone else. This is the first clinical
          documentation and network intelligence platform built for psychedelic therapy
          practitioners, and the data you are about to see is real.
        </p>

        {/* Stat block */}
        <div className="bg-indigo-950/40 border border-indigo-500/20 rounded-2xl p-5 flex gap-4 items-start">
          <BarChart3 className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <p className="text-2xl font-black text-slate-50 leading-none">1,500+</p>
            {/* FIX: ppn-meta → ppn-body */}
            <p className="ppn-body text-slate-400 mt-1">
              anonymized clinical outcome records, live in the network now.
            </p>
          </div>
        </div>

        {/* Social proof — FIX: ppn-meta → ppn-body */}
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-indigo-400 shrink-0" aria-hidden="true" />
          <p className="ppn-body text-slate-400">
            You are among the first practitioners to see the network.
          </p>
        </div>

        {/* CTA */}
        <button
          onClick={() => navigate('/search')}
          aria-label="Enter the PPN Network"
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white font-semibold text-base transition-all duration-200 shadow-lg shadow-indigo-700/30"
        >
          Enter the Network
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </button>

        {/* Footer confirm — FIX: ppn-meta → ppn-body */}
        <p className="ppn-body text-slate-500 text-center">
          Your access is active. No setup required.
        </p>
      </div>

      {/* Wordmark — FIX: ppn-meta → ppn-body */}
      <p className="ppn-body text-slate-600 text-center tracking-wide">
        Psychedelic Practitioner Network
      </p>
    </div>
  );
};

export default BetaWelcome;
