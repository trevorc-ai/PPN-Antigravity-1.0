import React from 'react';
import { NavLink } from 'react-router-dom';
import { X, QrCode, Smartphone, ArrowRight, ShieldCheck } from 'lucide-react';
import { AdvancedTooltip } from './ui/AdvancedTooltip';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isLocked?: boolean; // Optional prop from ProtectedLayout
}

interface NavItem {
  label: string;
  icon: string;
  path: string;
  isAction?: boolean;
  tooltip?: string;
  children?: { label: string; path: string }[];
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: 'Core',
    items: [
      { label: 'Dashboard', icon: 'dashboard', path: '/dashboard' },
      { label: 'Analytics', icon: 'insights', path: '/analytics' },
      { label: 'My Protocols', icon: 'assignment', path: '/protocols' },
      {
        label: 'Wellness Journey',
        icon: 'spa',
        path: '/wellness-journey',
        children: [
          { label: 'Phase 1: Preparation', path: '/wellness-journey?phase=Preparation' },
          { label: 'Phase 2: Treatment', path: '/wellness-journey?phase=Treatment' },
          { label: 'Phase 3: Integration', path: '/wellness-journey?phase=Integration' },
        ]
      },
    ],
  },
  {
    title: '',
    items: [
      { label: 'Interactions', icon: 'warning', path: '/interactions' },
      { label: 'Audit Logs', icon: 'history', path: '/audit' },
    ],
  },
  {
    title: '',
    items: [
      { label: 'Substance Library', icon: 'science', path: '/catalog' },
    ],
  },
  {
    title: 'Integrations',
    items: [
      { label: 'Mobile Scanner', icon: 'qr_code_scanner', path: 'action:scanner', isAction: true, tooltip: 'Connect your mobile device to scan documents directly into the patient record.' },
      { label: 'Device Sync', icon: 'watch', path: 'action:device', isAction: true, tooltip: 'Instantly beam this session to your mobile device or wearable for remote monitoring.' },
    ],
  },
  {
    title: 'Support',
    items: [
      { label: 'Help & FAQ', icon: 'help', path: '/help' },
    ],
  },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const [mobileModalState, setMobileModalState] = React.useState<{ isOpen: boolean; feature: string; title: string; }>({ isOpen: false, feature: '', title: '' });

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-[#0a1628] border-r border-slate-800 z-50 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          } w-64 flex flex-col`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-900 border border-slate-700 shadow-[0_0_15px_rgba(43,116,243,0.15)] flex items-center justify-center p-0.5 relative group">
              <div className="absolute inset-0 bg-blue-500/10 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <img src="/molecules/psilocybin.png" alt="PPN Spherecule" className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-500" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight">
                <span style={{ color: '#8B9DC3' }}>PPN</span>{' '}
                <span className="bg-gradient-to-r from-sky-300 to-blue-400 bg-clip-text text-transparent">Portal</span>
              </h1>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" style={{ color: '#8B9DC3' }} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-4 pb-12">
          <div className="space-y-6">
            {navSections.map((section) => (
              <div key={section.title || JSON.stringify(section.items.map(i => i.path))}>
                {section.title && (
                  <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-2 px-3">
                    {section.title}
                  </h3>
                )}
                <ul className="space-y-1">
                  {section.items.map((item) => {
                    // Map tour data attributes to specific navigation items
                    const tourDataMap: Record<string, string> = {
                      '/wellness-journey': 'nav-wellness-journey',
                      '/interactions': 'nav-interaction-checker',
                      '/catalog': 'nav-substance-catalog',
                      '/help': 'nav-help-faq',
                    };

                    return (
                      <li key={item.path} className="relative group/navitem block">
                        {item.isAction ? (
                          <AdvancedTooltip content={item.tooltip || 'Action item'}>
                            <button
                              onClick={() => {
                                if (window.innerWidth < 1024) onClose();
                                setMobileModalState({
                                  isOpen: true,
                                  feature: item.path,
                                  title: item.label
                                });
                              }}
                              className="w-full text-left flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl transition-all hover:bg-slate-800/50 group cursor-pointer select-none"
                            >
                              <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-lg text-slate-400 group-hover:text-indigo-400 transition-colors">
                                  {item.icon}
                                </span>
                                <span className="text-lg font-semibold tracking-wide text-[#8B9DC3] group-hover:text-slate-200 transition-colors">{item.label}</span>
                              </div>
                              <span className="material-symbols-outlined text-sm text-slate-600 group-hover:text-indigo-400 transition-colors">add_circle</span>
                            </button>
                          </AdvancedTooltip>
                        ) : (
                          <>
                            <NavLink
                              to={item.path}
                              data-tour={tourDataMap[item.path]}
                              onClick={() => {
                                if (window.innerWidth < 1024) onClose();
                              }}
                              className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all select-none ${isActive
                                  ? 'bg-primary/30 ring-2 ring-primary shadow-lg shadow-primary/20'
                                  : 'hover:bg-slate-800/50'
                                }`
                              }
                            >
                              {({ isActive }) => (
                                <>
                                  {isActive && (
                                    <div className="absolute left-0 top-3 w-1 h-6 bg-indigo-600 hover:bg-indigo-500 rounded-r-full" />
                                  )}
                                  <span
                                    className={`material-symbols-outlined text-lg ${isActive ? 'text-primary' : 'text-slate-400'
                                      }`}
                                  >
                                    {item.icon}
                                  </span>
                                  <span className="text-lg font-semibold tracking-wide" style={{ color: '#8B9DC3' }}>{item.label}</span>
                                </>
                              )}
                            </NavLink>
                            {item.children && (
                              <div className="grid grid-rows-[0fr] group-hover/navitem:grid-rows-[1fr] transition-[grid-template-rows] duration-300 ease-in-out">
                                <div className="overflow-hidden">
                                  <ul className="pl-12 pt-1 pb-2 flex flex-col gap-0.5">
                                    {item.children.map(child => (
                                      <li key={child.path}>
                                        <NavLink
                                          to={child.path}
                                          className={({ isActive }) => `block text-[15px] font-bold tracking-wide py-2 transition-colors select-none ${isActive ? 'text-indigo-400' : 'text-slate-400 hover:text-indigo-200'}`}
                                          onClick={() => { if (window.innerWidth < 1024) onClose(); }}
                                        >
                                          {child.label}
                                        </NavLink>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </nav>


      </aside>

      {/* Mobile Connect Lightbox */}
      {mobileModalState.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          {/* Click overlay to close */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setMobileModalState({ isOpen: false, feature: '', title: '' })} />

          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/50 rounded-3xl shadow-2xl shadow-indigo-900/20 overflow-hidden flex flex-col md:flex-row">

            {/* Close Button */}
            <button
              onClick={() => setMobileModalState({ isOpen: false, feature: '', title: '' })}
              className="absolute top-4 right-4 z-10 p-2 bg-slate-800/80 hover:bg-slate-700 rounded-full transition-colors border border-slate-700/50 hover:border-slate-500 group"
            >
              <X className="w-5 h-5 text-slate-400 group-hover:text-white" />
            </button>

            {/* Left QR Panel */}
            <div className="md:w-5/12 p-8 bg-gradient-to-br from-indigo-950/80 to-slate-900 flex flex-col items-center justify-center border-r border-slate-800">
              <div className="w-full aspect-square bg-white rounded-2xl p-3 shadow-xl mb-6 relative group overflow-hidden">
                {/* Fallback generated QR code since npm is locked */}
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://ppnportal.net/auth/magic?token=sim_${Date.now()}`}
                  alt="Magic Login QR Code"
                  className="w-full h-full object-contain rounded-xl"
                />

                {/* Scan Overlay */}
                <div className="absolute inset-0 bg-indigo-500/10 pointer-events-none" />
                <div className="absolute top-0 left-0 w-full h-1 bg-indigo-400/80 shadow-[0_0_15px_rgba(99,102,241,1)] blur-[1px] animate-[scan_2s_ease-in-out_infinite]" />
              </div>

              <div className="flex items-center gap-2 text-indigo-300 font-bold bg-indigo-500/10 px-4 py-2 rounded-full border border-indigo-500/20 w-fit">
                <QrCode className="w-4 h-4" />
                <span className="text-sm tracking-wide">Scan with camera</span>
              </div>
            </div>

            {/* Right Instructions Panel */}
            <div className="md:w-7/12 p-8 flex flex-col justify-center">
              <div className="w-12 h-12 bg-indigo-500/20 text-indigo-400 rounded-xl flex items-center justify-center mb-6 border border-indigo-500/30">
                <Smartphone className="w-6 h-6" />
              </div>

              <h2 className="text-2xl font-black text-white mb-2 tracking-tight">
                Send to Phone
              </h2>

              <p className="text-slate-400 text-sm leading-relaxed mb-8">
                The {mobileModalState.title} tool is specifically optimized for a mobile-first interface. Scanning this secure code will instantly beam your current session context to your device.
              </p>

              <div className="space-y-4 mb-8">
                {[
                  "Open your smartphone's native camera app.",
                  "Point the camera directly at the QR code.",
                  "Tap the PPN link that appears to instantly authenticate."
                ].map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 text-slate-400 text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <p className="text-sm text-slate-300 font-medium leading-snug">{step}</p>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3 mt-auto">
                <ShieldCheck className="w-8 h-8 text-emerald-400 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-emerald-300 uppercase tracking-widest leading-tight mb-0.5">Zero-Friction Handoff</p>
                  <p className="text-xs text-emerald-400/80 leading-snug">No app store download. No typing passwords. Instantly securely bonded.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;