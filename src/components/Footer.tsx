
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
    <footer className="bg-[#020408] border-t border-white/5 py-4 mt-8">
      <div className="max-w-[1600px] mx-auto px-6 sm:px-10 flex flex-col sm:flex-row items-center justify-between gap-3">

        {/* Left: brand + copyright */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-black text-slate-500 tracking-tight">
            PPN<span className="bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">Portal</span>
          </span>
          <span className="text-slate-800">·</span>
          <p className="text-xs text-slate-600">© 2025 Psychedelic Practitioners Network</p>
          <span className="text-slate-800 hidden sm:inline">·</span>
          <span className="text-xs font-mono text-slate-700 hidden sm:inline">v1.5.2</span>
        </div>

        {/* Right: compliance badges + policy links */}
        <div className="flex items-center gap-3 flex-wrap justify-center sm:justify-end">
          {['HIPAA', 'GDPR', 'SOC2'].map(badge => (
            <span key={badge} className="px-2 py-0.5 bg-slate-900/50 border border-slate-800 rounded text-xs font-bold text-slate-600 uppercase tracking-wide">
              {badge}
            </span>
          ))}
          <span className="text-slate-800">·</span>
          <button onClick={() => navigate('/privacy')} className="text-xs text-slate-600 hover:text-slate-400 transition-colors">Privacy</button>
          <button onClick={() => navigate('/data-policy')} className="text-xs text-slate-600 hover:text-slate-400 transition-colors">Data Policy</button>
          <button onClick={() => navigate('/terms')} className="text-xs text-slate-600 hover:text-slate-400 transition-colors">Terms</button>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
