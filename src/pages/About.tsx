import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../components/layouts/PageContainer';
import { Section } from '../components/layouts/Section';

const About: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-full bg-[#0a1628] text-slate-300 font-sans animate-in fade-in duration-700 pb-20 overflow-x-hidden">
      {/* Hero Section */}
      <div className="relative py-20 sm:py-32 border-b border-white/5 bg-[#0a1628]">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] bg-primary/5 rounded-full blur-[140px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 sm:px-12 relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-black text-primary uppercase tracking-[0.3em] mb-4 shadow-xl">
            <span className="material-symbols-outlined text-sm">info</span>
            Institutional Identity
          </div>
          <h1 className="text-5xl sm:text-8xl font-black tracking-tighter text-slate-300 leading-none">
            Advancing the <br />
            <span className="text-gradient-primary">Science</span> of Psychedelic Therapy.
          </h1>
          <p className="max-w-2xl mx-auto text-slate-300 text-base sm:text-xl font-medium leading-relaxed">
            PPN is a secure, cross-node clinical network dedicated to the rigorous study and safe implementation of psychedelic-assisted therapies.
          </p>
        </div>
      </div>

      <PageContainer className="py-20 space-y-32">

        {/* Mission & Vision */}
        <Section spacing="default" className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-300 leading-tight">
              A <span className="text-gradient-primary">Unified</span> Framework for <br />Clinical Excellence.
            </h2>
            <div className="space-y-6 text-slate-300 text-base leading-relaxed font-medium">
              <p>
                Founded on the principles of open collaboration and radical data integrity, the Psychedelic Practitioners Network (PPN) bridge the gap between discovery and clinical practice.
              </p>
              <p>
                We believe that the future of mental health requires a high-fidelity infrastructure capable of tracking long-term outcomes, managing complex substance interactions, and facilitating secure practitioner knowledge exchange.
              </p>
            </div>
            <div className="pt-4">
              <button
                onClick={() => navigate('/advanced-search')}
                className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 hover:bg-blue-600 text-slate-300 text-sm font-black rounded-2xl uppercase tracking-[0.2em] transition-all shadow-xl shadow-primary/20 active:scale-95"
              >
                Access PPN Portal
              </button>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-primary/10 blur-3xl rounded-full opacity-50"></div>
            <div className="relative bg-[#111418]/60 border border-slate-800 rounded-[3rem] p-8 sm:p-12 shadow-2xl backdrop-blur-xl">
              <div className="grid grid-cols-2 gap-6">
                <div className="p-6 bg-black/40 border border-slate-800 rounded-[2rem] space-y-3">
                  <span className="text-3xl font-black text-slate-300">HIPAA</span>
                  <p className="text-sm font-black text-slate-500 uppercase tracking-widest">Certified Architecture</p>
                </div>
                <div className="p-6 bg-black/40 border border-slate-800 rounded-[2rem] space-y-3">
                  <span className="text-3xl font-black text-clinical-green">21 CFR</span>
                  <p className="text-sm font-black text-slate-500 uppercase tracking-widest">Part 11 Compliant</p>
                </div>
                <div className="p-6 bg-black/40 border border-slate-800 rounded-[2rem] space-y-3">
                  <span className="text-3xl font-black text-primary">RLS</span>
                  <p className="text-sm font-black text-slate-500 uppercase tracking-widest">Row-Level Security</p>
                </div>
                <div className="p-6 bg-black/40 border border-slate-800 rounded-[2rem] space-y-3">
                  <span className="text-3xl font-black text-accent-amber">100%</span>
                  <p className="text-sm font-black text-slate-500 uppercase tracking-widest">De-Identified Data</p>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* Core Principles */}
        <Section spacing="default" className="space-y-16">
          <div className="text-center space-y-8">
            <h3 className="text-xs font-black text-primary tracking-[0.4em] uppercase tracking-[0.8em]">Our Principles</h3>
            <div className="max-w-2xl mx-auto border-[1px] border-primary/30 rounded-xl p-8 backdrop-blur-sm shadow-xl">
              <h2 className="text-3xl sm:text-5xl font-black text-slate-300 tracking-tight">
                <span className="text-gradient-primary">Built</span> for Regulatory Rigor.
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Data Sovereignty',
                icon: 'hub',
                desc: 'Practitioners maintain full ownership of their clinical observations while contributing to a de-identified global dataset.',
                color: 'text-primary'
              },
              {
                title: 'Scientific Integrity',
                icon: 'biotech',
                desc: 'Every protocol on the PPN is subjected to rigorous peer-review and ethical oversight by our global lead investigators.',
                color: 'text-clinical-green'
              },
              {
                title: 'Ethical Access',
                icon: 'shield_person',
                desc: 'We strictly enforce HIPAA and GDPR standards across all practitioners, ensuring patient safety remains the ultimate metric.',
                color: 'text-accent-amber'
              }
            ].map((principle, i) => (
              <div key={i} className="bg-slate-900/40 border border-slate-800 p-10 rounded-[2.5rem] space-y-6 hover:bg-slate-900/60 transition-all group">
                <div className={`size-16 rounded-2xl bg-slate-950 flex items-center justify-center border border-slate-800 group-hover:scale-110 transition-transform ${principle.color}`}>
                  <span className="material-symbols-outlined text-3xl">{principle.icon}</span>
                </div>
                <h4 className="text-xl font-black text-slate-300 tracking-tight">{principle.title}</h4>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">{principle.desc}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Global Network Section */}
        <Section spacing="default" className="bg-slate-900/20 border border-slate-800 rounded-[4rem] p-10 sm:p-20 relative overflow-hidden flex flex-col items-center text-center space-y-10">
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>

          <div className="space-y-4 max-w-2xl relative z-10">
            <h2 className="text-4xl sm:text-6xl font-black text-slate-300 tracking-tighter leading-tight">
              The Global <span className="text-gradient-purple">Psychedelic Practitioner</span> Network.
            </h2>
            <p className="text-slate-300 font-medium text-lg leading-relaxed">
              PPN is building a growing alliance of practitioners focused on the rigorous, safe implementation of psychedelic-assisted therapies.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 w-full max-w-4xl relative z-10">
            {['Baltimore', 'London', 'Zurich', 'Palo Alto'].map(loc => (
              <div key={loc} className="space-y-2">
                <p className="text-2xl font-black text-slate-300">{loc}</p>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-xs font-black text-slate-600 uppercase tracking-widest">Founding Region</span>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* CTA Section */}
        <Section spacing="default" className="flex flex-col items-center space-y-10 py-10">
          <div className="text-center space-y-4">
            <h2 className="text-3xl sm:text-5xl font-black text-slate-300 tracking-tight leading-tight">
              <span className="text-gradient-primary">Join</span> the Alliance.
            </h2>
            <p className="text-slate-500 font-medium max-w-lg mx-auto leading-relaxed">
              Qualified practitioners and research institutions are invited to apply for institutional node access.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate('/#secure-access-node')}
              className="px-10 py-5 bg-white text-black text-sm font-black rounded-2xl uppercase tracking-[0.2em] transition-all hover:bg-slate-200 active:scale-95"
            >
              Login
            </button>
            <button
              onClick={() => navigate('/help')}
              className="px-10 py-5 bg-transparent border border-slate-800 text-slate-300 text-sm font-black rounded-2xl uppercase tracking-[0.2em] transition-all hover:bg-white/5 active:scale-95"
            >
              Inquire for Access
            </button>
          </div>
        </Section>

      </PageContainer>
    </div>
  );
};

export default About;