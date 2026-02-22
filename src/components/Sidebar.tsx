import React from 'react';
import { NavLink } from 'react-router-dom';
import { X } from 'lucide-react';

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
      { label: 'My Protocols', icon: 'assignment', path: '/protocols' },
      { label: 'Wellness Journey', icon: 'spa', path: '/wellness-journey' },
    ],
  },
  {
    title: 'Clinical Safety',
    items: [
      { label: 'Interaction Checker', icon: 'warning', path: '/interactions' },
      { label: 'Audit Logs', icon: 'history', path: '/audit' },
    ],
  },
  {
    title: 'Knowledge Base',
    items: [
      { label: 'Substance Library', icon: 'science', path: '/catalog' },
      { label: 'Intelligence Hub', icon: 'newspaper', path: '/news' },
      { label: 'Clinician Directory', icon: 'people', path: '/clinicians' },
    ],
  },
  {
    title: 'Integrations',
    items: [
      { label: 'Mobile Scanner', icon: 'qr_code_scanner', path: 'action:scanner', isAction: true },
      { label: 'Device Sync', icon: 'watch', path: 'action:device', isAction: true },
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
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-slate-300 text-lg">neurology</span>
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
              <div key={section.title}>
                <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-2 px-3">
                  {section.title}
                </h3>
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
                      <li key={item.path} className="relative">
                        {item.isAction ? (
                          <button
                            onClick={() => {
                              if (window.innerWidth < 1024) onClose();
                              if (item.path === 'action:scanner') {
                                // For desktop scanner action, maybe show an alert or open a specific modal in the future.
                                alert("To scan documents or connect the Patient Bridge, please open this application on your mobile device or navigate directly to /PPN_Bridge_Camera.html");
                              } else if (item.path === 'action:device') {
                                alert("Wearable device synchronization module is currently offline pending FDA clearance.");
                              }
                            }}
                            className="w-full text-left flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl transition-all hover:bg-slate-800/50 group cursor-pointer"
                          >
                            <div className="flex items-center gap-3">
                              <span className="material-symbols-outlined text-lg text-slate-400 group-hover:text-indigo-400 transition-colors">
                                {item.icon}
                              </span>
                              <span className="text-base font-semibold tracking-wide text-[#8B9DC3] group-hover:text-slate-200 transition-colors">{item.label}</span>
                            </div>
                            <span className="material-symbols-outlined text-sm text-slate-600 group-hover:text-indigo-400 transition-colors">add_circle</span>
                          </button>
                        ) : (
                          <NavLink
                            to={item.path}
                            data-tour={tourDataMap[item.path]}
                            onClick={() => {
                              if (window.innerWidth < 1024) onClose();
                            }}
                            className={({ isActive }) =>
                              `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${isActive
                                ? 'bg-primary/30 ring-2 ring-primary shadow-lg shadow-primary/20'
                                : 'hover:bg-slate-800/50'
                              }`
                            }
                          >
                            {({ isActive }) => (
                              <>
                                {isActive && (
                                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-indigo-600 hover:bg-indigo-500 rounded-r-full" />
                                )}
                                <span
                                  className={`material-symbols-outlined text-lg ${isActive ? 'text-primary' : 'text-slate-400'
                                    }`}
                                >
                                  {item.icon}
                                </span>
                                <span className="text-base font-semibold tracking-wide" style={{ color: '#8B9DC3' }}>{item.label}</span>
                              </>
                            )}
                          </NavLink>
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
    </>
  );
};

export default Sidebar;