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
    ],
  },
  {
    title: 'Clinical Tools',
    items: [
      { label: 'Wellness Journey', icon: 'timeline', path: '/wellness-journey' },
      { label: 'My Protocols', icon: 'assignment', path: '/protocols' },
      { label: 'Interaction Checker', icon: 'warning', path: '/interactions' },
    ],
  },
  {
    title: 'Knowledge Base',
    items: [
      { label: 'Substance Catalog', icon: 'science', path: '/catalog' },
      { label: 'Intelligence Hub', icon: 'newspaper', path: '/news' },
    ],
  },
  {
    title: 'Network',
    items: [
      { label: 'Clinician Directory', icon: 'people', path: '/clinicians' },
      { label: 'Audit Logs', icon: 'history', path: '/audit' },
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
              <h1 className="text-sm font-black tracking-tight" style={{ color: '#8B9DC3' }}>PPN Portal</h1>
              <p className="text-sm font-mono text-slate-500 uppercase tracking-wider">Research v2.4</p>
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
        <nav className="overflow-y-auto p-4">
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
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
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