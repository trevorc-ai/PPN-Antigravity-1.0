import { Link, useLocation, useNavigate } from 'react-router-dom';
import { SUBSTANCES, CLINICIANS } from '../constants';
import React from 'react';

const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const pathnames = location.pathname.split('/').filter((x) => x);
  const hash = location.hash.replace('#', '');
  const isPortalActive = location.pathname === '/advanced-search';

  // Labels for standard routes and landing page sections (anchors)
  // Synchronized to Master Registry
  const labels: Record<string, string> = {
    dashboard: 'Dashboard',
    analytics: 'Clinical Intelligence',
    catalog: 'Substance Catalog',
    monograph: 'Molecular Profile',
    interactions: 'Interaction Checker',
    audit: 'Audit Logs',
    builder: 'My Protocols',
    protocol: 'My Protocols',
    detail: 'Clinical Dossier',
    clinicians: 'Practitioners',
    clinician: 'Practitioner Profile',
    ingestion: 'Registry Upload',
    news: 'News',
    help: 'Help & FAQ',
    notifications: 'Node Alerts',
    settings: 'Settings',
    'advanced-search': 'Global Research Search',
    'wellness-journey': 'Wellness Journey',
    'arc-of-care-god-view': 'Wellness Journey', // Legacy route
    pricing: 'Membership Tiers',
    contribution: 'Give-to-Get Model',
    login: 'Authentication Gate',
    logout: 'Session End',
    // Anchor mappings for landing page
    'security-compliance': 'Security Protocols',
    'global-network': 'Network Node Map',
    'membership-tiers': 'Membership Framework',
    'institutional-identity': 'Institutional Identity',
    'secure-access-node': 'Node Access'
  };

  const getLabel = (path: string, index: number) => {
    // Resolve specific clinical entity names from IDs for deep links
    if (index > 0 && pathnames[index - 1] === 'monograph') {
      const sub = SUBSTANCES.find(s => s.id === path);
      return sub ? sub.name : path;
    }

    if (index > 0 && pathnames[index - 1] === 'clinician') {
      const clin = CLINICIANS.find(c => c.id === path);
      return clin ? clin.name : path;
    }

    return labels[path] || path.charAt(0).toUpperCase() + path.slice(1);
  };

  return (
    <nav
      aria-label="Breadcrumb"
      className="px-6 sm:px-10 py-3.5 bg-[#0a0c10]/60 border-b border-white/[0.04] backdrop-blur-2xl flex items-center gap-2 overflow-x-auto no-scrollbar whitespace-nowrap z-30 shadow-sm"
    >
      {/* Back Button - Only shows on deep pages (not Dashboard or Portal root) */}
      {location.pathname !== '/dashboard' && location.pathname !== '/advanced-search' && (
        <button
          onClick={() => navigate(-1)}
          className="mr-4 pr-4 border-r border-white/10 hidden sm:flex items-center gap-1 text-[12px] font-black tracking-widest text-slate-3000 hover:text-primary transition-colors group"
        >
          <span className="material-symbols-outlined text-[15px] group-hover:-translate-x-0.5 transition-transform">arrow_back</span>
          Back
        </button>
      )}

      <div className="flex items-center gap-2.5">
        <Link
          to="/advanced-search"
          className={`flex items-center gap-2 text-xs font-black tracking-[0.2em] uppercase transition-all group ${isPortalActive ? 'text-primary' : 'text-slate-3000 hover:text-primary'
            }`}
        >
          <div className={`size-5 rounded-md flex items-center justify-center transition-colors ${isPortalActive ? 'bg-primary/20 text-primary' : 'bg-slate-800 group-hover:bg-primary/20 group-hover:text-primary'
            }`}>
            <span className="material-symbols-outlined text-[16px]">home</span>
          </div>
          Portal
        </Link>

        {/* Handle Path Segments */}
        {pathnames.map((value, index) => {
          const last = index === pathnames.length - 1 && !hash;
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          const label = getLabel(value, index);

          // Skip internal routing keys that are part of a compound path but not meaningful labels on their own
          if ((value === 'monograph' || value === 'clinician' || value === 'detail') && !last) return null;

          return (
            <React.Fragment key={to}>
              <span className="material-symbols-outlined text-slate-700 text-[15px] select-none opacity-50">chevron_right</span>
              {last ? (
                <span className="text-xs font-black text-slate-300 tracking-widest uppercase animate-in fade-in duration-300">
                  {label}
                </span>
              ) : (
                <Link
                  to={to}
                  className="text-xs font-black text-slate-400 tracking-widest uppercase hover:text-slate-200 transition-colors"
                >
                  {label}
                </Link>
              )}
            </React.Fragment>
          );
        })}

        {/* Handle Anchor (Hash) on current path */}
        {hash && labels[hash] && (
          <>
            <span className="material-symbols-outlined text-slate-700 text-[15px] select-none opacity-50">chevron_right</span>
            <span className="text-xs font-black text-slate-300 tracking-widest uppercase animate-in fade-in slide-in-from-left-1 duration-300">
              {labels[hash]}
            </span>
          </>
        )}
      </div>

      {/* Decorative Network Pulse */}
      <div className="ml-auto hidden sm:flex items-center gap-3 pl-4 border-l border-white/5 opacity-40">
        <span className="text-[11px] font-mono text-slate-600 tracking-[0.3em]">Node_Status: Nominal</span>
        <div className="size-1.5 rounded-full bg-clinical-green animate-pulse"></div>
      </div>
    </nav>
  );
};

export default Breadcrumbs;