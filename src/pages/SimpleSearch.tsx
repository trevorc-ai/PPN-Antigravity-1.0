
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../components/layouts/PageContainer';

const SimpleSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/advanced-search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const quickLinks = [
    { label: 'Ketamine Protocols', icon: 'biotech', path: '/catalog' },
    { label: 'Practitioners', icon: 'groups', path: '/clinicians' },
    { label: 'Safety Matrix', icon: 'health_and_safety', path: '/interactions' },
    { label: 'Audit Logs', icon: 'history', path: '/audit' },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 sm:p-12 pt-24 lg:pt-0 relative overflow-hidden animate-in fade-in duration-1000">
      {/* Dynamic Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-primary/5 rounded-full blur-[140px] pointer-events-none animate-pulse"></div>
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

      <PageContainer width="narrow" className="space-y-10 relative z-10 text-center">
        <div className="space-y-4">
          <div className="inline-flex items-center justify-center size-20 rounded-[2rem] bg-slate-900 border border-slate-800 shadow-2xl mb-4 group hover:border-primary/50 transition-all duration-500">
            <span className="material-symbols-outlined text-4xl text-primary group-hover:scale-110 transition-transform">auto_awesome</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tighter text-slate-300">PPN Portal</h1>
          <p className="text-slate-300 text-sm sm:text-lg max-w-lg mx-auto leading-relaxed font-medium">
            Access the unified clinical database for high-fidelity molecular research and protocol discovery.
          </p>
        </div>

        <form onSubmit={handleSearch} className="relative group max-w-2xl mx-auto">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-accent-blue/20 to-primary/20 blur-2xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity duration-700"></div>
          <div className="relative">
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && query.trim()) {
                  e.preventDefault();
                  navigate(`/advanced-search?q=${encodeURIComponent(query.trim())}`);
                }
              }}
              placeholder="Search protocols, adverse events, or ask the Neural Copilot..."
              aria-label="Search the PPN clinical database"
              className="w-full h-16 sm:h-24 bg-slate-900/90 border border-slate-700/50 rounded-[2.5rem] px-10 sm:px-14 text-sm text-slate-300 focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all backdrop-blur-2xl shadow-2xl placeholder:text-slate-600 font-bold"
            />
            <button
              type="submit"
              className="absolute right-4 top-1/2 -translate-y-1/2 size-12 sm:size-16 bg-primary hover:bg-blue-600 rounded-full flex items-center justify-center text-slate-300 transition-all shadow-xl active:scale-95 group/btn"
            >
              <span className="material-symbols-outlined text-2xl sm:text-3xl group-hover/btn:translate-x-1 transition-transform">arrow_forward</span>
            </button>
          </div>
        </form>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-6">
          <span className="text-sm font-black text-slate-500 tracking-[0.2em] mr-2 w-full sm:w-auto mb-2 sm:mb-0">Fast Access Nodes:</span>
          {quickLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => navigate(link.path)}
              className="px-6 py-3 bg-slate-900/40 hover:bg-slate-800/80 border border-slate-800 hover:border-primary/30 rounded-full text-sm font-black text-slate-300 hover:text-slate-300 transition-all flex items-center gap-3 shadow-lg group/link"
            >
              <span className="material-symbols-outlined text-lg group-hover:link:text-primary transition-colors">{link.icon}</span>
              <span className="tracking-widest">{link.label}</span>
            </button>
          ))}
        </div>

        <div className="pt-16 grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-2xl mx-auto border-t border-slate-800/50">
          <div className="text-center space-y-1">
            <p className="text-2xl font-black text-slate-300">12,482</p>
            <p className="text-sm font-black text-slate-500 tracking-widest">Indexed Nodes</p>
          </div>
          <div className="text-center space-y-1">
            <p className="text-2xl font-black text-clinical-green">14.2ms</p>
            <p className="text-sm font-black text-slate-500 tracking-widest">Query Latency</p>
          </div>
          <div className="text-center space-y-1">
            <p className="text-2xl font-black text-primary">Live</p>
            <p className="text-sm font-black text-slate-500 tracking-widest">Protocol Sync</p>
          </div>
          <div className="text-center space-y-1">
            <p className="text-2xl font-black text-indigo-400">98%</p>
            <p className="text-sm font-black text-slate-500 tracking-widest">Search Recall</p>
          </div>
        </div>
      </PageContainer>
    </div>
  );
};

export default SimpleSearch;
