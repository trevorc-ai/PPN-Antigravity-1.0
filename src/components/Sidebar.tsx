import React, { useState, useMemo } from 'react';
// Corrected imports for named exports
import { Link, NavLink, useLocation } from 'react-router-dom';
import { BarChart, Bar, Cell, ResponsiveContainer, XAxis, Tooltip } from 'recharts';
import { PATIENTS } from '../constants';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isLocked?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, isLocked = false }) => {
  const location = useLocation();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const isSearchActive = location.pathname === '/advanced-search';

  // DYNAMIC CHART DATA: Aggregated from real PATIENTS registry
  const chartData = useMemo(() => {
    const counts = {
      'Psilocybin': 0,
      'MDMA': 0,
      'Ketamine': 0,
      'LSD': 0,
      'Other': 0
    };

    PATIENTS.forEach(p => {
      // Guard against missing protocol data to prevent sidebar crash
      const sub = p.protocol?.substance;
      if (!sub) return;

      if (sub === 'Psilocybin') counts['Psilocybin']++;
      else if (sub === 'MDMA') counts['MDMA']++;
      else if (sub === 'Ketamine') counts['Ketamine']++;
      else if (sub === 'LSD' || sub === 'LSD-25') counts['LSD']++;
      else counts['Other']++;
    });

    return [
      { name: 'KET', count: counts['Ketamine'], color: '#2b74f3', label: 'Ketamine' },
      { name: 'PSL', count: counts['Psilocybin'], color: '#53d22d', label: 'Psilocybin' },
      { name: 'MDM', count: counts['MDMA'], color: '#f59e0b', label: 'MDMA' },
      { name: 'LSD', count: counts['LSD'], color: '#8b5cf6', label: 'LSD-25' },
      { name: 'OTH', count: counts['Other'], color: '#cbd5e1', label: 'Investigational' },
    ].filter(d => d.count > 0);
  }, []);

  const activeProtocolsCount = PATIENTS.filter(p => p.status === 'Active').length;

  const sections = [
    {
      title: 'Core Research',
      items: [
        { label: 'Research Portal', icon: 'search_insights', path: '/advanced-search' },
        // { label: 'Analytics', icon: 'query_stats', path: '/analytics' },
        { label: 'Dashboard', icon: 'dashboard', path: '/dashboard' },
        { label: 'News', icon: 'newspaper', path: '/news' },
        { label: 'Practitioners', icon: 'groups', path: '/clinicians' },
        { label: 'Substances', icon: 'biotech', path: '/catalog' },
        { label: 'My Protocols', icon: 'article', path: '/builder' },
      ]
    },
    {
      title: 'Intelligence',
      items: [
        { label: "Regulatory Map", icon: "public", path: "/deep-dives/regulatory-map" },
        { label: "Clinical Radar", icon: "radar", path: "/deep-dives/clinic-performance" },
        { label: "Patient Galaxy", icon: "hub", path: "/deep-dives/patient-constellation" },
        { label: "Molecular DB", icon: "science", path: "/deep-dives/molecular-pharmacology" },
        { label: "Protocol ROI", icon: "savings", path: "/deep-dives/protocol-efficiency" }
      ]
    },
    {
      title: 'Clinical Safety',
      items: [
        { label: 'Interaction Checker', icon: 'security', path: '/interactions' },
        { label: 'Audit Logs', icon: 'manage_search', path: '/audit' },
      ]
    },
    {
      title: 'Preferences',
      items: [
        { label: 'Settings', icon: 'settings', path: '/settings' },
        { label: 'Help & FAQ', icon: 'help_center', path: '/help', id: 'tour-help-node' },
      ]
    }
  ];

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        id="tour-sidebar-nav"
        className={`fixed lg:static inset-y-0 left-0 xl:w-64 lg:w-20 flex flex-col border-r border-border-dark bg-[#0a0c10] shrink-0 h-full z-[70] transition-all duration-300 transform ${isOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'} ${isLocked ? 'grayscale opacity-40 pointer-events-none' : ''}`}
        aria-label="Main Navigation"
      >
        {isLocked && (
          <div className="absolute inset-0 z-[80] bg-[#0a0c10]/20 backdrop-blur-[1px]" />
        )}

        <div className="p-4 pb-2 flex items-center justify-between shrink-0 lg:justify-center xl:justify-start">
          <Link
            to="/advanced-search"
            className={`flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg p-2 transition-all ${isSearchActive
              ? 'bg-primary/20 ring-1 ring-primary/40 shadow-[0_0_15px_rgba(43,116,243,0.2)]'
              : 'hover:bg-white/5'
              }`}
            aria-label="PPN Research Portal Home"
          >
            <div className="relative shrink-0">
              <div className={`absolute inset-0 bg-primary/40 blur-lg rounded-lg transition-all ${isSearchActive ? 'opacity-50' : 'group-hover:bg-primary/60'}`}></div>
              <div className={`relative rounded-lg p-1.5 flex items-center justify-center shadow-lg transition-colors ${isSearchActive ? 'bg-[#0a0c10]' : 'bg-primary'}`}>
                <span className={`material-symbols-outlined text-xl transition-colors ${isSearchActive ? 'text-primary' : 'text-white'}`}>science</span>
              </div>
            </div>
            <div className={`flex flex-col ${isOpen ? 'flex' : 'lg:hidden xl:flex'}`}>
              <h1 className="text-white text-[14px] uppercase font-black leading-tight tracking-tight whitespace-nowrap">PPN Portal</h1>
              <div className="flex items-center gap-1">
                <div className="size-1 rounded-full bg-clinical-green animate-pulse"></div>
                <p className="text-slate-400 text-[11px] font-bold tracking-[0.2em] whitespace-nowrap">Live: 04</p>
              </div>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden text-slate-500 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md"
            aria-label="Close menu"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Chart Widget - Hidden on collapsed sidebar (LG), Visible on XL and Mobile Open */}
        <div className={`px-3 py-2 shrink-0 ${isOpen ? 'block' : 'lg:hidden xl:block'}`}>
          <div className="p-3 rounded-xl bg-[#111318] border border-slate-800/50 relative overflow-hidden group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-black text-slate-400 tracking-widest whitespace-nowrap">Active Protocols</span>
              <div className="flex items-center gap-1">
                <span className="text-[11px] font-mono font-bold text-primary px-1 bg-primary/10 rounded">LIVE</span>
              </div>
            </div>
            <div className="h-[70px] w-full mb-1" style={{ height: 70 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <XAxis dataKey="name" hide />
                  <Tooltip
                    cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-[#0f172a] border border-[#334155] rounded-lg px-2.5 py-1.5 shadow-2xl animate-in fade-in zoom-in-95 pointer-events-none z-50">
                            <p className="text-[11px] font-black text-white tracking-widest leading-none mb-1">{data.label}</p>
                            <p className="text-[11px] font-mono font-black text-primary leading-none">{data.count} Active</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar
                    dataKey="count"
                    radius={[2, 2, 0, 0]}
                    barSize={16}
                    onMouseEnter={(_, index) => setActiveIndex(index)}
                    onMouseLeave={() => setActiveIndex(null)}
                    isAnimationActive={true}
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        fillOpacity={activeIndex === null || activeIndex === index ? 1 : 0.4}
                        style={{ transition: 'fill-opacity 0.2s ease', cursor: 'pointer' }}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-x-2 gap-y-1 mb-2 pt-1 border-t border-slate-800/20">
              {chartData.map((d, i) => (
                <div key={d.name} className={`flex items-center gap-1 transition-opacity duration-200 ${activeIndex !== null && activeIndex !== i ? 'opacity-30' : 'opacity-100'}`}>
                  <div className="size-1 rounded-full" style={{ backgroundColor: d.color }}></div>
                  <span className="text-[11px] font-bold text-slate-400">{d.name}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between border-t border-slate-800/40 pt-1.5">
              <div className="flex items-center gap-1">
                <div className="size-1.5 rounded-full bg-clinical-green shadow-[0_0_6px_#53d22d]"></div>
                <span className="text-[11px] font-black text-slate-400 tracking-widest whitespace-nowrap">Node Sync</span>
              </div>
              <span className="text-[11px] font-mono text-slate-600">0x7</span>
            </div>
          </div>
        </div>

        <div className="flex-1 px-3 py-1 space-y-6 overflow-y-auto custom-scrollbar">
          {sections.map((section) => (
            <nav key={section.title} className="space-y-2" aria-label={section.title}>
              <div className={`px-3 ${isOpen ? 'block' : 'lg:hidden xl:block'}`}>
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest opacity-80 whitespace-nowrap">
                  {section.title}
                </h3>
              </div>

              {/* Divider for collapsed view */}
              <div className={`px-2 my-2 ${isOpen ? 'hidden' : 'lg:block xl:hidden'}`}>
                <div className="h-px bg-white/5 w-full"></div>
              </div>

              <ul className="space-y-0.5">
                {section.items.map((item) => (
                  <li key={item.path} id={item.id}>
                    <NavLink
                      to={item.path}
                      onClick={() => {
                        // Only close sidebar on mobile
                        if (window.innerWidth < 1024) onClose();
                      }}
                      className={({ isActive }) => `group relative flex items-center ${isOpen ? 'gap-2.5 px-3' : 'lg:justify-center lg:px-0 lg:gap-0 xl:justify-start xl:gap-2.5 xl:px-3'} gap-2.5 px-3 py-2 rounded-xl transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${isActive
                        ? 'bg-primary/20 text-white ring-1 ring-primary/40 shadow-[0_0_15px_rgba(43,116,243,0.2)]'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
                        }`}
                      title={item.label} // Tooltip for collapsed mode
                    >
                      {({ isActive }) => (
                        <>
                          {isActive && (
                            <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-primary rounded-r-full shadow-[0_0_8px_#2b74f3] ${isOpen ? '' : 'lg:left-1 xl:left-0'}`}></div>
                          )}
                          <span className={`material-symbols-outlined text-[18px] transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-primary' : 'group-hover:text-primary/70'
                            }`} aria-hidden="true">
                            {item.icon}
                          </span>
                          <span className={`text-[14px] font-bold uppercase tracking-wide whitespace-nowrap ${isOpen ? 'block' : 'lg:hidden xl:block'}`}>{item.label}</span>
                        </>
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;