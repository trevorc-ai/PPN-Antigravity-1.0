
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

const StepCard: React.FC<{ number: string; title: string; points: string[]; icon: string }> = ({ number, title, points, icon }) => (
  <div className="bg-[#111418] border border-slate-800 p-8 rounded-[2.5rem] space-y-6 relative overflow-hidden group hover:border-primary/50 transition-all shadow-2xl h-full">
    <div className="absolute -top-4 -right-4 size-24 bg-primary/5 rounded-full flex items-center justify-center text-primary/10 font-black text-6xl group-hover:scale-110 transition-transform">
      {number}
    </div>
    <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 relative z-10">
      <span className="material-symbols-outlined text-3xl">{icon}</span>
    </div>
    <div className="space-y-4 relative z-10">
      <h3 className="text-xl font-black text-slate-300 tracking-tight">{title}</h3>
      <ul className="space-y-3">
        {points.map((point, i) => (
          <li key={i} className="flex gap-3 text-sm text-slate-3000 font-medium leading-relaxed">
            <span className="text-primary mt-1 select-none">•</span>
            {point}
          </li>
        ))}
      </ul>
    </div>
  </div>
);

const FAQItem: React.FC<{ q: string; a: string }> = ({ q, a }) => (
  <div className="p-8 bg-slate-900/40 border border-slate-800 rounded-[2rem] space-y-4 transition-all hover:bg-slate-900/60">
    <div className="flex gap-4">
      <span className="text-primary font-black text-lg select-none">Q:</span>
      <h4 className="text-slate-300 font-bold leading-tight italic">"{q}"</h4>
    </div>
    <div className="flex gap-4 border-t border-slate-800/50 pt-4">
      <span className="text-clinical-green font-black text-lg select-none">A:</span>
      <p className="text-slate-300 text-sm leading-relaxed font-medium">"{a}"</p>
    </div>
  </div>
);

interface ContributionModelProps {
  onMenuClick?: () => void;
}

import { PageContainer } from '../components/layouts/PageContainer';
import { Section } from '../components/layouts/Section';

const ContributionModel: React.FC<ContributionModelProps> = ({ onMenuClick }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-full bg-[#0a1628] text-slate-300 font-sans animate-in fade-in duration-700 pb-24 overflow-x-hidden">
      {/* HEADER */}
      <div className="h-16 bg-[#0a0c10]/90 border-b border-white/5 flex items-center justify-between px-4 sm:px-8 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden size-10 flex items-center justify-center rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-slate-300 transition-all"
            aria-label="Open menu"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate('/')}>
            <div className="bg-primary rounded-lg p-1.5 flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-slate-300 text-lg font-black">science</span>
            </div>
            <span className="text-sm font-black text-slate-300 uppercase tracking-[0.2em] hidden sm:block">The Give-to-Get Model</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/" className="hidden lg:flex items-center gap-2 text-[11px] font-black text-slate-3000 hover:text-slate-300 uppercase tracking-widest transition-colors group">
            <span className="material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform">arrow_back</span>
            Back to Home
          </Link>
          <button
            onClick={() => navigate('/#secure-access-node')}
            className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-black rounded-xl uppercase tracking-widest transition-all active:scale-95"
          >
            Login
          </button>
        </div>
      </div>

      {/* HERO */}
      <div className="relative py-20 sm:py-32 bg-[#0a1628] border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[700px] bg-primary/10 rounded-full blur-[160px] pointer-events-none"></div>

        <div className="max-w-5xl mx-auto px-6 relative z-10 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-[11px] font-black text-primary uppercase tracking-[0.4em] mb-4 shadow-xl">
            <span className="material-symbols-outlined text-sm">database</span>
            Clinical Wisdom Economics
          </div>
          <h1 className="text-5xl sm:text-8xl font-black tracking-tighter text-slate-300 leading-none">
            Clinical Wisdom <br />
            is the <span className="text-primary">Currency.</span>
          </h1>
          <p className="max-w-3xl mx-auto text-slate-300 text-lg sm:text-xl font-medium leading-relaxed">
            The PPN Guild operates on a simple principle: <span className="text-slate-300 font-bold">Share high-quality data, and the platform is free.</span> We align practitioner incentives with the expansion of the global evidence base.
          </p>
        </div>
      </div>

      <PageContainer className="py-24 space-y-32">

        {/* HOW IT WORKS - 3 STEPS */}
        <Section spacing="default" className="space-y-16">
          <div className="text-center space-y-4">
            <h3 className="text-xs font-black text-primary tracking-[0.5em]">The Framework</h3>
            <h2 className="text-4xl sm:text-6xl font-black text-slate-300 tracking-tight">How It Works</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StepCard
              number="01"
              title="Log Your Outcomes"
              points={[
                "Contribute 5 anonymized patient records each month.",
                "Every record is securely scrubbed of PII."
              ]}
              icon="clinical_notes"
            />
            <StepCard
              number="02"
              title="Unlock the Trust"
              points={[
                "Meeting your quota instantly waives the $49/month fee.",
                "Gain full access to the Global Wisdom Dashboard."
              ]}
              icon="key"
            />
            <StepCard
              number="03"
              title="Grow the Network"
              points={[
                "Your data helps 500+ other practitioners optimize their care.",
                "Together, we build the evidence base for the future of medicine."
              ]}
              icon="hub"
            />
          </div>
        </Section>

        {/* FAQ SECTION */}
        <Section spacing="default" className="max-w-4xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h3 className="text-xs font-black text-accent-amber tracking-[0.5em]">Verification Details</h3>
            <h2 className="text-4xl font-black text-slate-300 tracking-tight">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-6">
            <FAQItem
              q="What counts as a 'Valid Record'?"
              a="A record must include dosage, substance, and at least one outcome metric (like a PHQ-9 score). Empty forms don't count."
            />
            <FAQItem
              q="What happens if I miss a month?"
              a="You keep access to your own data, but the Global Dashboard locks until you contribute again."
            />
            <FAQItem
              q="Is my patient data safe?"
              a="Absolutely. We never ask for names. All data is anonymized before it enters the global pool."
            />
          </div>
        </Section>

        {/* CTA */}
        <Section spacing="default" className="bg-[#111418]/60 border border-slate-800 rounded-[4rem] p-12 sm:p-24 text-center space-y-10 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-30"></div>
          <div className="space-y-4 relative z-10">
            <h2 className="text-4xl sm:text-7xl font-black text-slate-300 tracking-tighter leading-tight">Ready to join the <span className="text-primary">Cooperative?</span></h2>
            <p className="text-slate-3000 font-medium text-xl leading-relaxed max-w-2xl mx-auto">
              Join 500+ clinical researchers in building the world's most robust repository for psychedelic therapy.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-6 relative z-10">
            <button
              onClick={() => navigate('/#secure-access-node')}
              className="px-12 py-6 bg-primary hover:bg-blue-600 text-slate-300 text-sm font-black rounded-2xl uppercase tracking-[0.3em] transition-all shadow-xl shadow-primary/20 active:scale-95"
            >
              Sign Up for Free Month
            </button>
            <button
              onClick={() => navigate('/#membership-tiers')}
              className="px-12 py-6 bg-transparent border-2 border-slate-800 text-slate-300 text-sm font-black rounded-2xl uppercase tracking-[0.3em] transition-all hover:bg-white/5 active:scale-95"
            >
              View Access Tiers
            </button>
          </div>
        </Section>

      </PageContainer>

      {/* FOOTER */}
      <footer className="py-12 border-t border-white/5 text-center">
        <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.5em]">
          Psychedelic Practitioners Network © 2025 // Node Integrity Verified
        </p>
      </footer>
    </div>
  );
};

export default ContributionModel;
