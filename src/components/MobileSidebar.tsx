import React, { useState, useMemo } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { BarChart, Bar, Cell, ResponsiveContainer, XAxis, Tooltip, PieChart, Pie } from 'recharts';
import { PATIENTS } from '../constants';
import { useSafetyAlerts } from '../hooks/useSafetyAlerts';
import { useAuth } from '../contexts/AuthContext';

interface MobileSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

/**
 * Mobile-optimized sidebar navigation
 * 
 * Features:
 * - Full-screen overlay (not partial slide-in)
 * - Touch-friendly spacing (56px minimum)
 * - User profile card at top
 * - Grouped navigation sections
 * - Active protocols visualization
 * - Swipe-to-close gesture support
 * 
 * Design:
 * - Glassmorphism aesthetic
 * - Dark mode optimized
 * - High contrast for accessibility
 * - Material icons
 */
const MobileSidebar: React.FC<MobileSidebarProps> = ({ isOpen, onClose }) => {
    const location = useLocation();
    const { user } = useAuth();
    const { alertCount } = useSafetyAlerts();
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    // Chart data for active protocols
    const chartData = useMemo(() => {
        const counts = {
            'Psilocybin': 0,
            'MDMA': 0,
            'Ketamine': 0,
            'LSD': 0,
            'Other': 0
        };

        PATIENTS.forEach(p => {
            const sub = p.protocol?.substance;
            if (!sub) return;

            if (sub === 'Psilocybin') counts['Psilocybin']++;
            else if (sub === 'MDMA') counts['MDMA']++;
            else if (sub === 'Ketamine') counts['Ketamine']++;
            else if (sub === 'LSD' || sub === 'LSD-25') counts['LSD']++;
            else counts['Other']++;
        });

        return [
            { name: 'Ketamine', count: counts['Ketamine'], color: '#06b6d4' },
            { name: 'Psilocybin', count: counts['Psilocybin'], color: '#6366f1' },
            { name: 'MDMA', count: counts['MDMA'], color: '#a855f7' },
            { name: 'LSD', count: counts['LSD'], color: '#ec4899' },
            { name: 'Other', count: counts['Other'], color: '#64748b' },
        ].filter(d => d.count > 0);
    }, []);

    const sections = [
        {
            title: 'Core Research',
            items: [
                { label: 'Dashboard', icon: 'dashboard', path: '/dashboard' },
                { label: 'Wellness Journey', icon: 'psychology', path: '/wellness-journey' },
                { label: 'News', icon: 'newspaper', path: '/news' },
                { label: 'Practitioners', icon: 'groups', path: '/clinicians' },
                { label: 'Substances', icon: 'biotech', path: '/catalog' },
                { label: 'My Protocols', icon: 'article', path: '/builder' },
            ]
        },
        {
            title: 'Intelligence',
            items: [
                { label: "Clinical Radar", icon: "radar", path: "/deep-dives/clinic-performance" },
                { label: "Patient Galaxy", icon: "hub", path: "/deep-dives/patient-constellation" },
                { label: "Molecular DB", icon: "science", path: "/deep-dives/molecular-pharmacology" },
                { label: "Protocol ROI", icon: "savings", path: "/deep-dives/protocol-efficiency" }
            ]
        },
        {
            title: 'Clinical Safety',
            items: [
                { label: 'Safety Surveillance', icon: 'shield_with_heart', path: '/deep-dives/safety-surveillance', badge: alertCount },
                { label: 'Interaction Checker', icon: 'security', path: '/interactions' },
                { label: 'Audit Logs', icon: 'manage_search', path: '/audit' },
            ]
        },
        {
            title: 'Preferences',
            items: [
                { label: 'Settings', icon: 'settings', path: '/settings' },
                { label: 'Help & FAQ', icon: 'help_center', path: '/help' },
            ]
        }
    ];

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/70 backdrop-blur-md z-[100] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Mobile Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 w-full max-w-sm bg-[#0a0c10] z-[110] transform transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    } flex flex-col`}
                aria-label="Mobile Navigation"
            >
                {/* Compact Header - Thumb-optimized */}
                <div className="shrink-0 px-4 py-3 border-b border-slate-800/50 flex items-center justify-between">
                    {/* Logo - Tap to go home */}
                    <Link
                        to="/advanced-search"
                        onClick={onClose}
                        className="flex items-center gap-2 group active:scale-95 transition-transform"
                    >
                        <div className="relative">
                            <div className="absolute inset-0 bg-indigo-500/40 blur-md rounded-lg" />
                            <div className="relative rounded-lg p-1.5 bg-indigo-500 flex items-center justify-center">
                                <span className="material-symbols-outlined text-lg text-slate-300">science</span>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-slate-300 text-xs uppercase font-black leading-tight tracking-tight">
                                PPN Portal
                            </h1>
                            <div className="flex items-center gap-1">
                                <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                                <p className="text-slate-300 text-sm font-bold tracking-wider">ONLINE</p>
                            </div>
                        </div>
                    </Link>

                    {/* Close Button - Thumb-reach zone (top right) */}
                    <button
                        onClick={onClose}
                        className="p-2.5 text-slate-300 hover:text-slate-300 hover:bg-slate-800/50 rounded-lg transition-colors active:scale-95"
                        aria-label="Close menu"
                    >
                        <span className="material-symbols-outlined text-2xl">close</span>
                    </button>
                </div>

                {/* Navigation Sections */}
                <div className="flex-1 overflow-y-auto custom-scrollbar px-4 py-4 space-y-6">
                    {sections.map((section) => (
                        <nav key={section.title} className="space-y-2">
                            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest px-2">
                                {section.title}
                            </h3>
                            <ul className="space-y-1">
                                {section.items.map((item) => (
                                    <li key={item.path}>
                                        <NavLink
                                            to={item.path}
                                            onClick={onClose}
                                            className={({ isActive }) =>
                                                `group relative flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 ${isActive
                                                    ? 'bg-indigo-500/20 text-slate-300 ring-1 ring-indigo-500/40 shadow-lg shadow-indigo-500/10'
                                                    : 'text-slate-300 hover:text-slate-300 hover:bg-slate-800/50 active:scale-95'
                                                }`
                                            }
                                        >
                                            {({ isActive }) => (
                                                <>
                                                    {/* Active Indicator */}
                                                    {isActive && (
                                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-500 rounded-r-full shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                                                    )}

                                                    {/* Icon */}
                                                    <span
                                                        className={`material-symbols-outlined text-xl transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-indigo-400' : 'group-hover:text-indigo-400'
                                                            }`}
                                                    >
                                                        {item.icon}
                                                    </span>

                                                    {/* Label */}
                                                    <span className="text-sm font-bold uppercase tracking-wide flex-1">
                                                        {item.label}
                                                    </span>

                                                    {/* Badge */}
                                                    {item.badge !== undefined && item.badge > 0 && (
                                                        <span className="px-2 py-0.5 rounded-full bg-red-500 text-slate-300 text-xs font-black min-w-[20px] text-center">
                                                            {item.badge}
                                                        </span>
                                                    )}

                                                    {/* Chevron */}
                                                    <span className="material-symbols-outlined text-sm text-slate-600 group-hover:text-slate-300 transition-colors">
                                                        chevron_right
                                                    </span>
                                                </>
                                            )}
                                        </NavLink>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    ))}
                </div>

                {/* Active Protocols Chart */}
                <div className="shrink-0 p-4 border-t border-slate-800/50">
                    <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-black text-slate-300 uppercase tracking-wider">
                                Active Protocols
                            </span>
                            <span className="text-xs font-mono font-bold text-indigo-400 px-2 py-0.5 bg-indigo-500/10 rounded">
                                LIVE
                            </span>
                        </div>

                        {/* Pie Chart */}
                        <div className="h-32 w-full mb-2">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={chartData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={30}
                                        outerRadius={50}
                                        dataKey="count"
                                        onMouseEnter={(_, index) => setActiveIndex(index)}
                                        onMouseLeave={() => setActiveIndex(null)}
                                    >
                                        {chartData.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={entry.color}
                                                fillOpacity={activeIndex === null || activeIndex === index ? 1 : 0.3}
                                                style={{ transition: 'fill-opacity 0.2s ease', cursor: 'pointer' }}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        content={({ active, payload }) => {
                                            if (active && payload && payload.length) {
                                                const data = payload[0].payload;
                                                return (
                                                    <div className="bg-[#0f172a] border border-slate-700 rounded-lg px-3 py-2 shadow-xl">
                                                        <p className="text-sm font-bold text-slate-300">{data.name}</p>
                                                        <p className="text-sm font-mono text-indigo-400">{data.count} Active</p>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Legend */}
                        <div className="flex flex-wrap gap-x-3 gap-y-1.5">
                            {chartData.map((d, i) => (
                                <div
                                    key={d.name}
                                    className={`flex items-center gap-1.5 transition-opacity duration-200 ${activeIndex !== null && activeIndex !== i ? 'opacity-30' : 'opacity-100'
                                        }`}
                                >
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                                    <span className="text-xs font-medium text-slate-300">{d.name}</span>
                                    <span className="text-xs font-mono text-slate-600">({d.count})</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default MobileSidebar;
