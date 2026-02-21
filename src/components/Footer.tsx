
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
    <footer className="bg-[#020408] border-t border-white/5 pt-16 pb-8 mt-24">
      <div className="max-w-[1600px] mx-auto px-6 sm:px-10">

        {/* Main Footer Content - Simplified 3 Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">

          {/* Column 1: Brand */}
          <div className="space-y-4">
            {/* PPN Portal Logo */}
            <div className="flex items-baseline gap-1 cursor-default">
              <span className="text-3xl font-black tracking-tight text-slate-300 leading-none">PPN</span>
              <span className="text-3xl font-black tracking-tight bg-gradient-to-r from-sky-300 to-blue-400 bg-clip-text text-transparent leading-none">Portal</span>
            </div>

            <p className="text-sm text-slate-500 leading-relaxed font-medium max-w-xs">
              The institutional standard for outcomes tracking and safety surveillance in psychedelic therapy.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-300 tracking-wider uppercase">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { label: 'Dashboard', path: '/dashboard' },
                { label: 'My Protocols', path: '/protocols' },
                { label: 'Analytics', path: '/analytics' },
                { label: 'Membership Tiers', path: '/checkout' }
              ].map((item) => (
                <li key={item.label}>
                  <button
                    onClick={() => navigate(item.path)}
                    className="text-sm text-slate-500 hover:text-slate-300 transition-colors font-medium"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Compliance */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-300 tracking-wider uppercase">Compliance</h4>
            <div className="flex flex-wrap gap-2">
              {['HIPAA', 'GDPR', 'SOC2'].map(badge => (
                <div key={badge} className="px-3 py-1.5 bg-slate-900/50 border border-slate-800 rounded-lg">
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">{badge}</span>
                </div>
              ))}
            </div>
            <ul className="space-y-3 pt-2">
              <li><button className="text-sm text-slate-500 hover:text-slate-300 transition-colors font-medium">Privacy Policy</button></li>
              <li><button className="text-sm text-slate-500 hover:text-slate-300 transition-colors font-medium">Terms of Service</button></li>
            </ul>
          </div>
        </div>

        {/* Medical Disclaimer - Simplified */}
        <div className="mb-8">
          <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 flex items-start gap-3">
            <span className="material-symbols-outlined text-amber-400/80 text-xl flex-shrink-0" aria-hidden="true">
              warning
            </span>
            <p className="text-sm text-slate-300 leading-relaxed">
              <span className="font-bold text-amber-400/90">Medical Disclaimer:</span> This is for informational purposes only. For medical advice or diagnosis, consult a professional.
            </p>
          </div>
        </div>

        {/* Legal Banner - Simplified */}
        <div className="border-t border-white/[0.03] pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-600 text-center md:text-left">
            © 2025 Psychedelic Practitioners Network. All Rights Reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs font-mono text-slate-700">v1.5.2</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
