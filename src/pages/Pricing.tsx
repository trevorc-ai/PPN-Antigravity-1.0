
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { PageContainer } from '../components/layouts/PageContainer';
import { Section } from '../components/layouts/Section';

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
}> = ({ type, title, price, priceSub, buttonText, buttonClass, features, lockedFeatures, isPrimary, tag }) => {
  const navigate = useNavigate();
  return (
    <div className={`flex flex-col bg-[#1c222d]/40 border ${isPrimary ? 'border-primary/50 shadow-2xl shadow-primary/10' : 'border-slate-800'} rounded-[2.5rem] p-8 sm:p-10 transition-all hover:bg-[#1c222d]/60 group`}>
      <div className="flex justify-between items-start mb-2">
        <span className="text-[11px] font-black text-primary uppercase tracking-[0.2em]">{type}</span>
        {tag && <span className="px-2 py-0.5 rounded bg-accent-amber/10 text-accent-amber border border-accent-amber/20 text-[11px] font-black uppercase tracking-widest">{tag}</span>}
      </div>
      <h3 className="text-2xl font-black text-slate-200 tracking-tight mb-6">{title}</h3>

      <div className="mb-8">
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-black text-slate-300">{price}</span>
        </div>
        {priceSub && <p className="text-[11px] font-bold text-slate-3000 uppercase tracking-widest mt-1">{priceSub}</p>}
      </div>

      <button
        onClick={() => navigate('/login')}
        className={`w-full py-4 rounded-xl text-sm font-black uppercase tracking-[0.2em] transition-all active:scale-95 mb-10 ${buttonClass}`}
      >
        {buttonText}
      </button>

      <div className="space-y-4">
        {features.map((f, i) => <FeatureItem key={i} text={f} />)}
        {lockedFeatures?.map((f, i) => <FeatureItem key={i} text={f} locked />)}
      </div>
    </div>
  );
};

const Pricing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-full bg-[#05070a] text-slate-300 font-sans animate-in fade-in duration-700 pb-24 overflow-x-hidden">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 pt-20 pb-12 space-y-4">
        <h1 className="text-4xl sm:text-6xl font-black tracking-tighter text-slate-200">
          PPN Membership & Access Tiers
        </h1>
        <p className="max-w-2xl text-slate-3000 text-sm sm:text-lg font-medium leading-relaxed">
          Professional membership and subscription tiers for the PPN Research community. Secure your access to the global clinical network.
        </p>
      </div>

      <PageContainer className="px-6 sm:px-12 space-y-12">
        {/* Give-to-get Banner */}
        <Section spacing="default" className="relative group">
          <div className="absolute -inset-0.5 bg-accent-amber/20 blur opacity-75 rounded-[2.5rem]"></div>
          <div className="relative bg-[#0c0f14] border border-accent-amber/30 rounded-[2.5rem] p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex gap-6 items-start">
              <div className="size-12 rounded-2xl bg-accent-amber/10 flex items-center justify-center text-accent-amber border border-accent-amber/20 shrink-0">
                <span className="material-symbols-outlined text-2xl">info</span>
              </div>
              <div className="space-y-2">
                <h3 className="text-xs font-black text-accent-amber uppercase tracking-[0.3em]">Give-to-Get Model</h3>
                <p className="text-slate-300 text-sm leading-relaxed max-w-2xl font-medium">
                  <span className="text-slate-300 font-bold">The Power of Peer Networking:</span> Contribute your anonymized clinical data to the global database to unlock premium researcher features for free. We prioritize community-driven insights over corporate paywalls.
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate('/contribution')}
              className="px-8 py-4 bg-accent-amber hover:bg-amber-500 text-black text-sm font-black rounded-2xl uppercase tracking-[0.2em] transition-all flex items-center gap-2 shrink-0 active:scale-95 shadow-xl shadow-accent-amber/10"
            >
              Learn About Contribution
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        </Section>

        {/* Pricing Grid */}
        <Section spacing="default" className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <PricingCard
            type="Individual"
            title="The Guild Member"
            price="Free*"
            priceSub="*With validated data contribution"
            buttonText="Join the Guild"
            buttonClass="bg-primary hover:bg-blue-600 text-slate-300 shadow-xl shadow-primary/20"
            isPrimary
            tag="GIVE-TO-GET"
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
            features={[
              'Aggregated Datasets',
              'Adverse Event Reporting',
              'Bulk Export (CSV/JSON/Parquet)',
              'Regulatory Compliance Ready (HIPAA/GDPR)'
            ]}
          />
        </Section>

        {/* Comparison Table Section */}
        <Section spacing="spacious" className="space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-black text-slate-200 tracking-tight">Detailed Feature Comparison</h2>
            <p className="text-slate-3000 text-[11px] font-black uppercase tracking-widest">Compare all tools and infrastructure features across tiers.</p>
          </div>

          <div className="bg-[#0c0f14] border border-slate-800 rounded-[3rem] overflow-hidden shadow-2xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/40 border-b border-slate-800">
                  <th className="px-10 py-6 text-[11px] font-black text-slate-3000 uppercase tracking-[0.2em]">Feature</th>
                  <th className="px-10 py-6 text-[11px] font-black text-slate-3000 uppercase tracking-[0.2em] text-center">Guild</th>
                  <th className="px-10 py-6 text-[11px] font-black text-slate-3000 uppercase tracking-[0.2em] text-center">Enterprise</th>
                  <th className="px-10 py-6 text-[11px] font-black text-slate-3000 uppercase tracking-[0.2em] text-center">Researcher</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {[
                  { name: 'Anonymized Data Insights', guild: true, ent: true, res: true },
                  { name: 'Custom Dashboards', guild: false, ent: true, res: true },
                  { name: 'API Access', guild: false, ent: false, res: true },
                  { name: 'Batch Export Tools', guild: false, ent: true, res: true },
                  { name: 'Dedicated Support Node', guild: false, ent: true, res: true },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-10 py-6 text-sm font-bold text-slate-300">{row.name}</td>
                    <td className="px-10 py-6 text-center">
                      {row.guild ? <span className="material-symbols-outlined text-primary font-black">check</span> : <span className="text-slate-700">—</span>}
                    </td>
                    <td className="px-10 py-6 text-center">
                      {row.ent ? <span className="material-symbols-outlined text-primary font-black">check</span> : <span className="text-slate-700">—</span>}
                    </td>
                    <td className="px-10 py-6 text-center">
                      {row.res ? <span className="material-symbols-outlined text-primary font-black">check</span> : <span className="text-slate-700">—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      </PageContainer>
    </div>
  );
};

export default Pricing;
