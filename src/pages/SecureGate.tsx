import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CLINICIANS, NEWS_ARTICLES } from '../constants';
import { PageContainer } from '../components/layouts/PageContainer';
import { Section } from '../components/layouts/Section';

interface SecureGateProps {
  onMenuClick?: () => void;
}

const FeatureItem: React.FC<{ text: string; locked?: boolean }> = ({ text, locked }) => (
  <div className={`flex items-start gap-3 ${locked ? 'opacity-40' : ''}`}>
    <span className={`material-symbols-outlined text-lg ${locked ? 'text-slate-600' : 'text-primary font-black'}`}>
      {locked ? 'lock' : 'check_circle'}
    </span>
    <span className="text-[11px] font-bold text-slate-300 tracking-tight">{text}</span>
  </div>
);

const PricingCard: React.FC<{
  type: string;
  title: string;
  price: string;
  priceSub?: string;
  buttonText: string;
  buttonClass: string;
  features: string[];
  lockedFeatures?: string[];
  isPrimary?: boolean;
  tag?: string;
  onAction: () => void;
}> = ({ type, title, price, priceSub, buttonText, buttonClass, features, lockedFeatures, isPrimary, tag, onAction }) => (
  <div className={`flex flex-col bg-[#1c222d]/40 border ${isPrimary ? 'border-primary/50 shadow-2xl shadow-primary/10' : 'border-slate-800'} rounded-[3rem] p-10 sm:p-12 transition-all hover:bg-[#1c222d]/60 group`}>
    <div className="flex justify-between items-start mb-4">
      <span className="text-[11px] font-black text-primary tracking-[0.2em]">{type}</span>
      {tag && <span className="px-3 py-1 rounded-xl bg-accent-amber/10 text-accent-amber border border-accent-amber/20 text-[11px] font-black tracking-widest">{tag}</span>}
    </div>
    <h3 className="text-3xl font-black text-slate-300 tracking-tight mb-8">{title}</h3>

    <div className="mb-10">
      <div className="flex items-baseline gap-1.5">
        <span className="text-5xl font-black text-slate-300">{price}</span>
      </div>
      {priceSub && <p className="text-[11px] font-bold text-slate-3000 tracking-widest mt-2">{priceSub}</p>}
    </div>

    <button
      onClick={onAction}
      className={`w-full py-5 rounded-2xl text-sm font-black tracking-[0.2em] transition-all active:scale-95 mb-12 shadow-lg ${buttonClass}`}
    >
      {buttonText}
    </button>

    <div className="space-y-5">
      {features.map((f, i) => <FeatureItem key={i} text={f} />)}
      {lockedFeatures?.map((f, i) => <FeatureItem key={i} text={f} locked />)}
    </div>
  </div>
);

const Testimonial: React.FC<{ name: string; role: string; quote: string; image: string }> = ({ name, role, quote, image }) => (
  <div className="bg-[#0c0f16]/80 border border-slate-800 p-8 rounded-[2rem] flex flex-col gap-6 hover:bg-[#0c0f16] transition-all duration-300 group">
    <div className="flex items-center gap-4">
      <div className="size-14 rounded-2xl bg-cover bg-center border border-slate-700 shrink-0" style={{ backgroundImage: `url(${image})` }}></div>
      <div className="min-w-0">
        <h4 className="text-sm font-black text-slate-300 leading-tight truncate">{name}</h4>
        <p className="text-[11px] font-black text-primary tracking-[0.15em] mt-1">{role}</p>
      </div>
    </div>
    <div className="space-y-6">
      <p className="text-slate-300 text-[13px] font-bold italic leading-relaxed">
        "{quote}"
      </p>
      <div className="flex gap-2">
        <div className="size-1.5 rounded-full bg-primary/40"></div>
        <div className="size-1.5 rounded-full bg-primary/20"></div>
      </div>
    </div>
  </div>
);

const NewsSnippet: React.FC<{ title: string; category: string; time: string }> = ({ title, category, time }) => (
  <div className="py-4 border-b border-slate-800/40 last:border-none group cursor-pointer hover:bg-white/[0.02] -mx-4 px-4 rounded-2xl transition-colors h-auto">
    <div className="flex items-center gap-3 mb-2">
      <span className={`px-2 py-1 rounded-lg text-[11px] font-black tracking-widest ${category === 'Regulatory' ? 'bg-primary/10 text-primary border border-primary/20' :
        'bg-slate-800 text-slate-300 border border-slate-700'
        }`}>
        {category}
      </span>
      <span className="text-[11px] font-mono text-slate-600 tracking-widest">{time}</span>
    </div>
    <h4 className="text-sm font-medium text-slate-300 group-hover:text-slate-300 transition-colors line-clamp-1 leading-tight tracking-tight">{title}</h4>
  </div>
);

const SecureGate: React.FC<SecureGateProps> = () => {
  const navigate = useNavigate();

  const scrollToLogin = () => {
    document.getElementById('secure-access-node')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToAbout = () => {
    document.getElementById('institutional-identity')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToPricing = () => {
    document.getElementById('membership-tiers')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-full bg-[#05070a] text-slate-300 font-sans overflow-x-hidden">
      {/* Hero Section */}
      <div className="flex flex-col lg:flex-row min-h-[800px] relative overflow-hidden border-b border-white/5">
        <div className="absolute top-1/4 left-1/4 size-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 size-[500px] bg-accent-amber/5 rounded-full blur-[140px] pointer-events-none"></div>

        {/* Left Content Column */}
        <div className="flex-1 p-8 lg:p-24 space-y-16 relative flex flex-col justify-center">
          <div className="border-[1.5px] border-primary/30 rounded-[2.5rem] p-10 sm:p-20 bg-slate-900/5 backdrop-blur-sm relative z-10 overflow-hidden">
            <div className="space-y-6">
              <div className="flex items-center gap-4 text-primary mb-4">
                <span className="material-symbols-outlined font-black text-xl">verified_user</span>
                <span className="text-[11px] font-black tracking-[0.5em]">Encrypted Network Psychedelic Practitioner: 0x7</span>
              </div>
              <h1 className="text-4xl sm:text-8xl font-black tracking-tighter text-slate-300 leading-[1.0]">
                Psychedelic <br />
                Practitioners <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-primary to-primary/50">Network (PPN)</span>
              </h1>

              <h2 className="text-[#f59e0b] text-2xl sm:text-4xl font-black tracking-tight opacity-90 leading-tight">
                Clinical Research & Practitioner Insights Portal
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 relative z-10 items-stretch">
            <div className="bg-slate-900/40 border-l-4 border-[#f59e0b] rounded-r-[3rem] p-10 space-y-6 shadow-2xl backdrop-blur-sm flex flex-col justify-center">
              <div className="flex items-center gap-3 text-[#f59e0b]">
                <span className="material-symbols-outlined font-black text-2xl">emoji_objects</span>
                <span className="text-[11px] font-black tracking-[0.4em]">Institutional Mission</span>
              </div>
              <p className="text-xl sm:text-2xl font-medium text-slate-300 italic leading-snug tracking-tight">
                "Advancing clinical excellence through collaborative research and cross-node data insights."
              </p>
            </div>

            <div className="bg-[#111827]/40 border border-slate-800/60 rounded-[3rem] p-10 flex flex-col shadow-2xl backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4 text-primary">
                  <span className="material-symbols-outlined font-black text-2xl">newspaper</span>
                  <span className="text-[11px] font-black tracking-[0.4em]">Latest Dispatches</span>
                </div>
              </div>
              <div className="space-y-2">
                {NEWS_ARTICLES.slice(0, 3).map(article => (
                  <NewsSnippet key={article.id} title={article.title} category={article.category} time={article.timestamp} />
                ))}
              </div>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center gap-8">
            <button
              onClick={() => navigate('/login')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-4 px-12 py-6 bg-primary text-slate-300 text-sm font-black rounded-2xl tracking-[0.3em] transition-all shadow-xl shadow-primary/20 active:scale-95 group"
            >
              Login to Portal
              <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </button>
            <button
              onClick={scrollToAbout}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-4 px-12 py-6 bg-white/5 hover:bg-white/10 text-slate-300 text-sm font-black rounded-2xl tracking-[0.3em] transition-all border border-white/10 group"
            >
              Explore Identity
              <span className="material-symbols-outlined text-lg group-hover:translate-y-1 transition-transform">expand_more</span>
            </button>
          </div>
        </div>

        {/* Right Sidebar Login Panel */}
        <aside id="secure-access-node" className="w-full lg:w-[500px] bg-[#0a0c10]/80 backdrop-blur-3xl border-l border-white/5 flex flex-col p-10 sm:p-24 justify-center relative shadow-2xl z-20">
          <div className="space-y-4 mb-12">
            <h2 className="text-5xl font-black text-slate-300 tracking-tighter">Secure Access</h2>
            <p className="text-slate-3000 font-bold text-[11px] tracking-[0.3em]">Institutional Verification Psychedelic Practitioner</p>
          </div>

          <div className="space-y-8">
            <div className="p-8 bg-[#111418] border border-slate-800 rounded-[2rem] space-y-6 shadow-xl">
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-lg">
                  <span className="material-symbols-outlined text-2xl">lock</span>
                </div>
                <div>
                  <h3 className="text-slate-300 font-black tracking-widest text-[14px]">Restricted Node</h3>
                  <p className="text-slate-3000 text-[11px] font-bold mt-1">Authorized Personnel Only</p>
                </div>
              </div>
              <p className="text-slate-300 text-[12px] font-medium leading-relaxed">
                Access to the PPN Portal requires a verified practitioner credential. Sessions are logged and audited.
              </p>
              <button
                onClick={() => navigate('/login')}
                className="w-full py-5 bg-primary hover:bg-blue-600 text-slate-300 text-sm font-black rounded-xl tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-primary/30 active:scale-95 group"
              >
                Log In to Portal
                <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </button>
              <button
                onClick={() => navigate('/login?tab=request')}
                className="w-full py-4 bg-transparent border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-slate-300 text-sm font-black rounded-xl tracking-[0.2em] transition-all"
              >
                Request Access
              </button>
            </div>
          </div>

          <div className="mt-16">
            <div className="bg-slate-900/50 border border-slate-800/40 p-8 rounded-[2.5rem] flex gap-6 items-start shadow-xl">
              <div className="size-12 rounded-2xl bg-accent-amber/10 flex items-center justify-center text-accent-amber shrink-0 border border-accent-amber/20 shadow-lg">
                <span className="material-symbols-outlined text-2xl">security</span>
              </div>
              <p className="text-[11px] font-bold text-slate-3000 leading-relaxed tracking-tight">
                Sessions are end-to-end encrypted. <span className="text-slate-300">HIPAA / GDPR</span> compliance modules active. Local synchronization via global gateway.
              </p>
            </div>
          </div>
        </aside>
      </div>

      {/* Network Perspectives */}
      <div className="py-12 bg-[#05070a]">
        <PageContainer>
          <div className="border-[1.5px] border-primary/30 rounded-[2.5rem] p-12 sm:p-20 relative overflow-hidden bg-slate-900/10 backdrop-blur-md">
            <div className="flex items-center justify-center gap-6 mb-16 relative z-10">
              <div className="h-px bg-slate-800/60 flex-1"></div>
              <h3 className="text-sm font-black text-slate-3000 tracking-[1.0em] whitespace-nowrap">Network Perspectives</h3>
              <div className="h-px bg-slate-800/60 flex-1"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
              <Testimonial
                name="Dr. Aris Thorne"
                role="LEAD PI // BALTIMORE PRACTITIONER"
                image={CLINICIANS[2].imageUrl}
                quote="The PPN Portal has revolutionized our clinic's longitudinal tracking for complex mood disorders."
              />
              <Testimonial
                name="Sarah Jenkins"
                role="SENIOR RESEARCH NURSE"
                image={CLINICIANS[0].imageUrl}
                quote="A truly seamless interface for secure practitioner collaboration and real-time protocol updates."
              />
              <Testimonial
                name="Dr. Marcus Vane"
                role="CLINICAL PSYCHOLOGIST"
                image={CLINICIANS[1].imageUrl}
                quote="Finally, a robust network that prioritizes data integrity while maintaining HIPAA compliance."
              />
            </div>
          </div>
        </PageContainer>
      </div>

      {/* Institutional Identity Section */}
      <div id="institutional-identity" className="relative py-24 bg-gradient-to-b from-[#0a1628] via-[#0d1b2a] to-[#05070a] border-b border-white/5">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] bg-primary/5 rounded-full blur-[140px] pointer-events-none"></div>
        <PageContainer className="relative z-10 text-center space-y-12">
          <div className="inline-flex items-center gap-4 px-6 py-2.5 rounded-full bg-primary/10 border border-primary/20 text-sm font-black text-primary tracking-[0.5em] mb-6 shadow-2xl">
            <span className="material-symbols-outlined text-lg">info</span>
            Registry ID: 0x9921-PPN
          </div>
          <h2 className="text-4xl sm:text-8xl font-black tracking-tighter text-slate-300 leading-none">
            Advancing the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-primary to-primary/50">Science</span> of Psychedelic Therapy.
          </h2>
          <p className="max-w-3xl mx-auto text-slate-300 text-xl sm:text-2xl font-medium leading-relaxed opacity-80">
            PPN is a secure, cross-node clinical network dedicated to the rigorous study and safe implementation of psychedelic-assisted therapies.
          </p>
        </PageContainer>
      </div>

      {/* Stats Area - Unified Framework Section */}
      <div className="py-24 bg-[#05070a]">
        <PageContainer>
          <div className="border-[1.5px] border-primary/30 rounded-[2.5rem] p-12 sm:p-20 bg-slate-900/5 backdrop-blur-sm relative z-10 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
              <div className="space-y-10">
                <h3 className="text-4xl sm:text-7xl font-black tracking-tighter text-slate-300 leading-none">
                  A <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-primary to-primary/50">Unified</span> <br />
                  Framework for <br />
                  Excellence.
                </h3>
                <div className="space-y-8 text-slate-300 text-xl leading-relaxed font-medium opacity-80">
                  <p>Founded on the principles of open collaboration and radical data integrity, the Psychedelic Practitioners Network (PPN) bridge the gap between discovery and clinical practice.</p>
                  <p>We believe that the future of mental health requires a high-fidelity infrastructure capable of tracking long-term outcomes, managing complex substance interactions, and facilitating secure practitioner knowledge exchange.</p>
                </div>
                <div className="pt-6">
                  <button
                    onClick={scrollToLogin}
                    className="px-14 py-6 bg-primary hover:bg-blue-600 text-slate-300 text-sm font-black rounded-2xl tracking-[0.3em] transition-all shadow-xl shadow-primary/20 active:scale-95"
                  >
                    Start Researching
                  </button>
                </div>
              </div>
              <div className="relative">
                <div className="absolute -inset-10 bg-primary/10 blur-[120px] rounded-full opacity-50"></div>
                <div className="relative bg-[#0c0f14] border border-slate-800 rounded-[3rem] p-10 sm:p-14 shadow-2xl backdrop-blur-2xl">
                  <div className="grid grid-cols-2 gap-6 sm:gap-10">
                    {[
                      { val: '12k+', label: 'Enrolled Subjects', color: 'text-slate-300' },
                      { val: '04', label: 'Global Hubs', color: 'text-clinical-green' },
                      { val: '85%', label: 'Avg. Outcome Lift', color: 'text-primary' },
                      { val: '99.9%', label: 'Data Integrity', color: 'text-accent-amber' },
                    ].map((stat) => (
                      <div key={stat.label} className="p-6 sm:p-10 bg-black/40 border border-slate-800 rounded-[2rem] space-y-4 hover:border-slate-600 transition-all hover:scale-105 shadow-xl">
                        <span className={`text-4xl sm:text-5xl font-black ${stat.color} leading-none block tracking-tighter`}>{stat.val}</span>
                        <p className="text-xs font-black text-slate-3000 tracking-[0.4em] leading-tight">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </PageContainer>
      </div>

      {/* Principles Section */}
      <div id="security-compliance" className="py-24 bg-gradient-to-b from-[#0a1628]/50 via-[#0d1b2a]/50 to-[#05070a]/50 border-y border-white/5">
        <PageContainer className="space-y-24">
          <div className="text-center space-y-12">
            <h3 className="text-sm font-black text-primary tracking-[0.8em]">Core Principles</h3>
            <div className="max-w-3xl mx-auto border-[1.5px] border-primary/40 rounded-2xl p-10 backdrop-blur-sm shadow-[0_0_30px_rgba(43,116,243,0.1)]">
              <h2 className="text-4xl sm:text-7xl font-black text-slate-300 tracking-tight leading-none">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-primary to-primary/50">Built</span> for Regulatory Rigor.
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
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
              <div key={i} className="bg-slate-900/40 border border-slate-800 p-12 sm:p-14 rounded-[4rem] space-y-10 hover:bg-slate-900/60 transition-all group shadow-2xl hover:border-primary/30">
                <div className={`size-28 rounded-[2.5rem] bg-slate-950 flex items-center justify-center border border-slate-800 group-hover:scale-110 transition-transform ${principle.color} shadow-2xl`}>
                  <span className="material-symbols-outlined text-6xl">{principle.icon}</span>
                </div>
                <div className="space-y-6">
                  <h4 className="text-3xl font-black text-slate-300 tracking-tight leading-none">{principle.title}</h4>
                  <p className="text-lg text-slate-3000 font-medium leading-relaxed italic">"{principle.desc}"</p>
                </div>
              </div>
            ))}
          </div>
        </PageContainer>
      </div>

      {/* Global Map Node Section */}
      <div id="global-network" className="py-24">
        <PageContainer>
          <div className="border-[1.5px] border-primary/30 rounded-[2.5rem] p-16 sm:p-32 relative overflow-hidden bg-slate-900/5 backdrop-blur-sm shadow-[0_0_80px_rgba(0,0,0,0.3)] text-center flex flex-col items-center space-y-16">
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] bg-primary/10 rounded-full blur-[150px] pointer-events-none"></div>

            <div className="space-y-8 max-w-3xl relative z-10">
              <h2 className="text-4xl sm:text-8xl font-black text-slate-300 tracking-tighter leading-none">
                The Global <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-primary to-primary/50">Psychedelic Practitioner</span> <br />
                Network.
              </h2>
              <p className="text-slate-300 font-medium text-xl sm:text-2xl leading-relaxed opacity-80">
                PPN operates across 14 institutional sites globally, facilitating the world's most comprehensive longitudinal study on psychedelic therapy.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-16 w-full max-w-4xl relative z-10 border-t border-slate-800/60 pt-20">
              {['Baltimore', 'London', 'Zurich', 'Palo Alto'].map(loc => (
                <div key={loc} className="space-y-4 group cursor-default">
                  <p className="text-3xl font-black text-slate-300 group-hover:text-primary transition-colors leading-none">{loc}</p>
                  <div className="flex items-center justify-center gap-2.5">
                    <span className="size-2.5 rounded-full bg-clinical-green animate-pulse shadow-[0_0_12px_#53d22d]"></span>
                    <span className="text-[11px] font-black text-slate-3000 tracking-widest">Active Practitioner</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </PageContainer>
      </div>

      {/* Membership Tiers Section */}
      <div id="membership-tiers" className="py-24 bg-gradient-to-b from-[#0a1628] via-[#0d1b2a] to-[#05070a] border-t border-white/5 relative overflow-hidden">
        <PageContainer className="space-y-28 relative z-10">
          <div className="text-center space-y-8">
            <div className="inline-flex items-center gap-4 px-6 py-2.5 rounded-full bg-accent-amber/10 border border-accent-amber/20 text-sm font-black text-accent-amber tracking-[0.6em] mb-4 shadow-2xl">
              <span className="material-symbols-outlined text-lg">payments</span>
              Membership Framework
            </div>
            <h2 className="text-4xl sm:text-8xl font-black text-slate-300 tracking-tighter leading-none">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-primary to-primary/50">Access</span> the Network.
            </h2>
            <p className="max-w-2xl mx-auto text-slate-3000 text-xl sm:text-2xl font-medium leading-relaxed opacity-80">
              Professional membership and subscription tiers for the PPN community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-stretch">
            <PricingCard
              type="Individual"
              title="The Guild Member"
              price="Free*"
              priceSub="*With validated data contribution"
              buttonText="Join the Guild"
              buttonClass="bg-primary hover:bg-blue-600 text-slate-300 shadow-xl shadow-primary/20"
              isPrimary
              tag="GIVE-TO-GET"
              onAction={scrollToLogin}
              features={[
                'Private Record Management',
                'Global Database Access',
                'Peer-to-Peer Consultations'
              ]}
              lockedFeatures={[
                'Individual Profile Access only'
              ]}
            />
            <PricingCard
              type="Clinic Director"
              title="The Enterprise User"
              price="Variable"
              priceSub="Per facility / per month"
              buttonText="Request Demo"
              buttonClass="bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
              onAction={() => navigate('/help')}
              features={[
                'Clinic View Analytics',
                'Team Management (10+ seats)',
                'Protocol Adherence Tracking',
                'Facility-wide Efficacy Benchmarking'
              ]}
            />
            <PricingCard
              type="Data Consumer"
              title="Researcher / Pharma"
              price="Custom"
              priceSub="Enterprise Licensing"
              buttonText="Contact Sales"
              buttonClass="bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
              onAction={() => navigate('/help')}
              features={[
                'Aggregated Datasets',
                'Adverse Event Reporting',
                'Bulk Export (CSV/JSON/Parquet)',
                'Regulatory Compliance Ready (HIPAA/GDPR)'
              ]}
            />
          </div>
        </PageContainer>
      </div>

      {/* Final Call to Action */}
      <div className="py-24 bg-gradient-to-b from-[#0a1628] via-[#0d1b2a] to-[#05070a] border-t border-white/5 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
        <PageContainer width="narrow" className="text-center space-y-16 relative z-10">
          <div className="space-y-6">
            <h2 className="text-5xl sm:text-8xl font-black text-slate-300 tracking-tighter leading-none">Join the Cooperative.</h2>
            <p className="text-slate-3000 font-medium text-xl sm:text-3xl leading-relaxed max-w-3xl mx-auto opacity-80">
              Qualified practitioners and research institutions are invited to apply for institutional access.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-8">
            <button
              onClick={scrollToLogin}
              className="px-16 py-7 bg-white text-black text-sm font-black rounded-2xl tracking-[0.5em] transition-all hover:bg-slate-200 hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.1)]"
            >
              Login to Session
            </button>
            <button
              onClick={scrollToPricing}
              className="px-16 py-7 bg-transparent border-2 border-slate-800 text-slate-300 text-sm font-black rounded-2xl tracking-[0.5em] transition-all hover:bg-white/5 active:scale-95"
            >
              Inquire for Access
            </button>
          </div>
          <div className="flex items-center justify-center gap-10 pt-12 opacity-20 grayscale hover:opacity-50 transition-opacity">
            <span className="text-[11px] font-black text-slate-3000 tracking-[0.4em]">Compliance Matrix:</span>
            <span className="text-2xl font-black text-slate-300 italic tracking-tighter">HIPAA</span>
            <span className="text-2xl font-black text-slate-300 italic tracking-tighter">GDPR</span>
            <span className="text-2xl font-black text-slate-300 italic tracking-tighter">GMP</span>
          </div>
        </PageContainer>
      </div>
    </div >
  );
};

export default SecureGate;
