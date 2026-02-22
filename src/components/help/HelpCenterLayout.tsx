import React, { useState } from 'react';
import { PageContainer } from '../layouts/PageContainer';
import { Section } from '../layouts/Section';
import { Search, ChevronRight, Menu, X } from 'lucide-react';
import { useLocation, Link, Outlet } from 'react-router-dom';

const navSegments = [
    {
        title: "Getting Started",
        links: [
            { label: "Quickstart Guide", path: "/help/quickstart" },
            { label: "Platform Overview", path: "/help/overview" },
        ]
    },
    {
        title: "Clinical Tools",
        links: [
            { label: "Interaction Checker", path: "/help/interaction-checker" },
            { label: "Wellness Journey Logs", path: "/help/wellness-journey" },
            { label: "Session Reporting", path: "/help/reports" },
        ]
    },
    {
        title: "Integrations & Setup",
        links: [
            { label: "Patient Bridge Scanner", path: "/help/scanner" },
            { label: "Device Syncing", path: "/help/devices" },
        ]
    },
    {
        title: "Account & Billing",
        links: [
            { label: "Settings", path: "/help/settings" },
            { label: "Invoices", path: "/help/billing" },
        ]
    }
];

export const HelpCenterLayout: React.FC = () => {
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#080c14] via-[#0c1220] to-[#0a0e1a] text-slate-300 font-sans pb-20">
            {/* Minimal Help Header w/ Search */}
            <div className="relative pt-12 pb-12 px-8 border-b border-slate-800/80 mb-8 bg-slate-900/40">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-black text-[#A8B5D1] tracking-tight">Help Center</h1>
                        <p className="text-slate-400 text-sm mt-1">Documentation and User Manuals</p>
                    </div>

                    <div className="relative w-full md:w-96">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search manuals..."
                            className="w-full bg-[#0a0e1a] border border-slate-700/50 rounded-xl py-3 pl-12 pr-4 text-slate-300 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all text-sm shadow-inner"
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                    </div>
                </div>
            </div>

            <PageContainer width="wide" className="!max-w-[1600px] px-4 sm:px-10">
                <div className="flex flex-col lg:flex-row gap-10 items-start">

                    {/* Mobile Nav Toggle */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="lg:hidden flex items-center gap-2 px-4 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-slate-300 font-bold text-sm w-full shadow-lg"
                    >
                        {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
                        {mobileMenuOpen ? 'Close Menu' : 'Documentation Menu'}
                    </button>

                    {/* Left Sidebar Nav */}
                    <aside className={`w-full lg:w-64 shrink-0 bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-3xl p-6 h-fit sticky top-24 shadow-xl ${mobileMenuOpen ? 'block' : 'hidden lg:block'}`}>
                        <nav className="space-y-8">
                            {navSegments.map((segment, sIdx) => (
                                <div key={sIdx}>
                                    <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3 px-2">{segment.title}</h4>
                                    <ul className="space-y-1">
                                        {segment.links.map((link, lIdx) => {
                                            const isActive = location.pathname.includes(link.path);
                                            return (
                                                <li key={lIdx}>
                                                    <Link
                                                        to={link.path}
                                                        onClick={() => setMobileMenuOpen(false)}
                                                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${isActive
                                                            ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                                                            : 'text-slate-400 hover:text-[#A8B5D1] hover:bg-slate-800/50 border border-transparent'}`}
                                                    >
                                                        {isActive && <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />}
                                                        {link.label}
                                                    </Link>
                                                </li>
                                            )
                                        })}
                                    </ul>
                                </div>
                            ))}
                        </nav>
                    </aside>

                    {/* Main Content Area */}
                    <main className="flex-1 min-w-0 bg-slate-900/20 border border-slate-800/50 rounded-3xl min-h-[600px] shadow-2xl relative overflow-hidden">
                        {/* Soft Glow */}
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none opacity-50 z-0" />

                        <div className="relative z-10 p-8 sm:p-12">
                            <Outlet />
                        </div>
                    </main>
                </div>
            </PageContainer>
        </div>
    );
};
