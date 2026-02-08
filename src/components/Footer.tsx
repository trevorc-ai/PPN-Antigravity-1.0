
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Footer: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isLanding = location.pathname === '/';

  const handlePricingAction = () => {
    if (isLanding) {
      document.getElementById('membership-tiers')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/#membership-tiers');
    }
  };

  return (
    <footer className="bg-[#020408] border-t border-white/5 pt-20 pb-10 mt-auto">
      <div className="max-w-[1600px] mx-auto px-6 sm:px-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">

        {/* Column 1: Institutional Brand */}
        <div className="space-y-8">
          <div className="flex items-center gap-3 group cursor-default">
            <div className="bg-primary rounded-xl p-2.5 flex items-center justify-center shadow-[0_0_20px_rgba(43,116,243,0.3)] transition-transform group-hover:scale-105">
              <span className="material-symbols-outlined text-white text-xl font-black">science</span>
            </div>
            <div className="flex flex-col">
              <span className="text-base font-black tracking-tight text-white uppercase leading-none mb-1">PPN RESEARCH</span>
              <span className="text-[11px] font-black text-slate-600 uppercase tracking-[0.3em]">Institutional Repository</span>
            </div>
          </div>
          <p className="text-[13px] text-slate-500 leading-relaxed font-medium max-w-xs">
            Operating the global clinical node network for high-fidelity psychedelic research and therapeutic protocol discovery. Certified for IRB-governed longitudinal studies.
          </p>
          <div className="flex items-center gap-4">
            {['hub', 'public', 'psychology', 'database'].map(icon => (
              <div key={icon} className="size-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 hover:text-primary transition-all cursor-pointer group shadow-lg">
                <span className="material-symbols-outlined text-xl group-hover:scale-110 transition-transform">{icon}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Column 2: Portal Nodes */}
        <div className="space-y-6">
          <h4 className="text-[11px] font-black text-white tracking-[0.4em]">Portal Nodes</h4>
          <ul className="space-y-4">
            {['Research Directory', 'Clinical Registry', 'Protocol Architect', 'Membership Tiers', 'Network Identity'].map((item) => (
              <li key={item}>
                <button
                  onClick={item === 'Membership Tiers' ? handlePricingAction : undefined}
                  className="text-[13px] text-slate-500 hover:text-primary transition-colors font-medium flex items-center gap-3 group"
                >
                  <div className="size-1 bg-slate-800 rounded-full group-hover:bg-primary group-hover:scale-150 transition-all"></div>
                  {item}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Regulatory Framework */}
        <div className="space-y-6">
          <h4 className="text-[11px] font-black text-white tracking-[0.4em]">Regulatory</h4>
          <div className="grid grid-cols-2 gap-3">
            {['HIPAA', 'GDPR', 'SOC2', 'FDA-BTI'].map(badge => (
              <div key={badge} className="p-3 bg-slate-900/50 border border-slate-800 rounded-xl flex items-center justify-center">
                <span className="text-[11px] font-black text-slate-600 uppercase tracking-widest">{badge}</span>
              </div>
            ))}
          </div>
          <ul className="space-y-4 pt-2">
            <li><button className="text-[12px] text-slate-400 hover:text-white transition-colors font-bold underline decoration-slate-800 underline-offset-4">Institutional Disclosures</button></li>
            <li><button className="text-[12px] text-slate-400 hover:text-white transition-colors font-bold underline decoration-slate-800 underline-offset-4">Privacy Framework</button></li>
          </ul>
        </div>

        {/* Column 4: System Telemetry */}
        <div className="space-y-6">
          <h4 className="text-[11px] font-black text-white tracking-[0.4em]">Node Telemetry</h4>
          <div className="bg-[#0a0c12] border border-white/5 rounded-3xl p-6 space-y-6 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-3 opacity-5">
              <span className="material-symbols-outlined text-4xl">cloud_sync</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative flex size-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-clinical-green opacity-75"></span>
                <span className="relative inline-flex rounded-full size-2 bg-clinical-green"></span>
              </div>
              <span className="text-[11px] font-black text-slate-300 uppercase tracking-[0.2em]">Global Hub Online</span>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-black text-slate-600 uppercase tracking-widest">Network Latency</span>
                <span className="text-[11px] font-mono text-white font-black tracking-tighter">14.2ms</span>
              </div>
              <div className="h-1 bg-slate-900 rounded-full overflow-hidden">
                <div className="h-full bg-primary shadow-[0_0_8px_#2b74f3]" style={{ width: '92%' }}></div>
              </div>
            </div>

            <div className="flex justify-between items-center text-[11px] font-mono text-slate-700 uppercase tracking-widest">
              <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[11px]">lock</span> AES_256</span>
              <span>SHA-256_SYNC</span>
            </div>
          </div>
        </div>
      </div>

      {/* Legal Banner */}
      <div className="max-w-[1600px] mx-auto px-6 sm:px-10 border-t border-white/[0.03] pt-10 flex flex-col md:flex-row items-center justify-between gap-8">
        <p className="text-[11px] font-black text-slate-700 uppercase tracking-[0.6em] text-center md:text-left">
          © 2025 Psychedelic Practitioners Network. Institutional Access Nodes Verified. All Rights Reserved.
        </p>
        <div className="flex items-center gap-6">
          <div className="px-4 py-1.5 bg-slate-900/80 border border-slate-800 rounded-lg text-[11px] font-mono text-slate-500 font-bold uppercase tracking-widest">
            v1.5.2_PRODUCTION
          </div>
          <button className="text-[11px] font-black text-slate-600 hover:text-slate-400 uppercase tracking-widest transition-colors">
            Jurisdiction Notice
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
