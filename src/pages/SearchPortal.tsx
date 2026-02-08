import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { SUBSTANCES, CLINICIANS, PATIENTS } from '../constants';
import { GoogleGenAI } from "@google/genai";

// --- TYPES & INTERFACES ---
type SearchCategory = 'All' | 'Substances' | 'Clinicians' | 'Patients' | 'Safety';

interface FilterState {
  setting: string;
  substance: string;
  minEfficacy: string; // 'Any', '>5pts PHQ-9', '>10pts PHQ-9'
}

// --- CONSTANTS ---
const SETTING_OPTIONS = ['All', 'Clinical (Medical)', 'Home (Supervised)', 'Retreat Center'];
const SUBSTANCE_OPTIONS = ['All', ...SUBSTANCES.map(s => s.name)];
const EFFICACY_OPTIONS = ['Any', '>5pts PHQ-9', '>10pts PHQ-9'];

const CATEGORIES: { label: SearchCategory; icon: string }[] = [
  { label: 'All', icon: 'apps' },
  { label: 'Patients', icon: 'personal_injury' },
  { label: 'Safety', icon: 'warning' },
  { label: 'Substances', icon: 'biotech' },
  { label: 'Clinicians', icon: 'groups' },
];

// --- HELPER COMPONENTS ---

const SectionHeader: React.FC<{ title: string; icon: string; count: number; onSeeAll?: () => void }> = ({ title, icon, count, onSeeAll }) => (
  <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/5">
    <div className="flex items-center gap-3">
      <div className="size-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500">
        <span className="material-symbols-outlined text-sm">{icon}</span>
      </div>
      <h3 className="text-sm font-black text-white uppercase tracking-widest">{title}</h3>
      <span className="px-2 py-0.5 rounded-md bg-slate-800 text-[11px] font-mono text-slate-400 font-bold">{count}</span>
    </div>
    {onSeeAll && (
      <button onClick={onSeeAll} className="text-[12px] font-black text-primary uppercase tracking-widest hover:underline">
        View All
      </button>
    )}
  </div>
);

// --- RICH CARD COMPONENTS ---

const PatientCard: React.FC<{ res: any; variant?: 'compact' | 'full' }> = ({ res, variant = 'full' }) => {
  const navigate = useNavigate();

  // 1. Infer Condition from Outcome Type
  const outcomeType = res.outcomes?.[0]?.type || 'Unknown';
  let condition = 'Clinical';
  if (outcomeType === 'PHQ-9' || outcomeType === 'MADRS') condition = 'TRD'; // Treatment Resistant Depression
  else if (outcomeType === 'GAD-7') condition = 'Anxiety'; // General Anxiety
  else if (outcomeType === 'CAPS-5') condition = 'PTSD';

  // 2. Calculate Trajectory (Delta)
  const baseline = res.outcomes?.find((o: any) => o.interpretation.toLowerCase().includes('baseline'))?.score || 0;
  const current = res.outcomes?.[res.outcomes.length - 1]?.score || 0;
  const delta = baseline - current;
  const isResponder = delta >= 5; // Clinical significance threshold

  // 3. Operational Logic
  const integrationHours = res.context?.integrationHours || 0;
  const isUnderbooked = integrationHours < 3;

  // 4. Safety Logic
  const hasSafetyEvent = res.safetyEvents && res.safetyEvents.length > 0;

  // Title Construction: Title Case
  // Helper to capitalize first letter
  const toTitleCase = (str: string) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  const substanceName = res.protocol.substance; // Usually already Title Case in constants
  const routeName = res.protocol.route === 'Intravenous' ? 'IV' : res.protocol.route === 'Intramuscular' ? 'IM' : 'PO';

  const cardTitle = `${condition} • ${substanceName}`;
  const cardSubtitle = `${routeName} • ${res.protocol.dosage}${res.protocol.dosageUnit || 'mg'}`;

  // COMPACT VARIANT (Bento Grid)
  if (variant === 'compact') {
    return (
      <div
        onClick={() => navigate(`/protocol/${res.id}`)}
        className="group bg-slate-900/40 border border-slate-800 hover:border-primary/50 rounded-2xl p-4 transition-all duration-300 cursor-pointer h-24 flex items-center justify-between relative overflow-hidden"
      >
        <div className="flex flex-col justify-center min-w-0 pr-4">
          <div className="flex items-center gap-2 mb-1">
            <span className={`size-1.5 rounded-full ${res.status === 'Active' ? 'bg-clinical-green animate-pulse' : 'bg-slate-600'}`}></span>
            <h4 className="text-sm font-black text-white tracking-tight truncate">{cardTitle}</h4>
          </div>
          <p className="text-[12px] font-bold text-slate-500 tracking-wide pl-3.5">{cardSubtitle}</p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {/* Efficacy Badge */}
          <div className={`px-2.5 py-1.5 rounded-lg border flex items-center gap-1.5 ${isResponder ? 'bg-clinical-green/10 border-clinical-green/20 text-clinical-green' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>
            <span className="material-symbols-outlined text-[12px]">{isResponder ? 'trending_down' : 'remove'}</span>
            <span className="text-[12px] font-black">{delta > 0 ? `${delta}` : '-'}</span>
          </div>
          {/* Safety Dot */}
          <div className={`size-2 rounded-full ${hasSafetyEvent ? 'bg-red-500 animate-pulse' : 'bg-slate-700'}`}></div>
        </div>
      </div>
    );
  }

  // FULL VARIANT (Detailed Grid)
  return (
    <div
      onClick={() => navigate(`/protocol/${res.id}`)}
      className={`group bg-slate-900/40 border ${hasSafetyEvent ? 'border-red-500/30 hover:border-red-500/60' : 'border-slate-800 hover:border-primary/50'} rounded-[2rem] p-6 transition-all duration-300 cursor-pointer flex flex-col gap-6 relative overflow-hidden shadow-lg hover:shadow-2xl h-full`}
    >
      {/* Header: Clinical Context First */}
      <div className="flex justify-between items-start relative z-10">
        <div className="space-y-1">
          <h4 className="text-xl font-black text-white tracking-tight leading-tight">{cardTitle}</h4>
          <p className="text-[11px] font-bold text-slate-500 tracking-wide uppercase">{cardSubtitle}</p>
        </div>
        {/* Patient ID as Discrete Badge */}
        <span className="px-2 py-1 rounded bg-slate-950 border border-slate-800 text-[11px] font-mono font-bold text-slate-500">
          {res.id}
        </span>
      </div>

      {/* Efficacy Metric (The "Clinical HUD") */}
      <div className="space-y-3 relative z-10">
        <div className="flex justify-between items-end">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Efficacy ({outcomeType})</span>
          <span className={`text-2xl font-black ${isResponder ? 'text-clinical-green' : 'text-slate-400'}`}>
            ▼ {delta} pts
          </span>
        </div>
        <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-1000 ${isResponder ? 'bg-clinical-green' : 'bg-slate-600'}`}
            style={{ width: isResponder ? '60%' : '15%' }}
          ></div>
        </div>
      </div>

      {/* Footer: Safety & Ops Status */}
      <div className="mt-auto pt-4 border-t border-slate-800/50 flex flex-col gap-3">
        {/* Safety Line */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`material-symbols-outlined text-base ${hasSafetyEvent ? 'text-red-500 animate-pulse' : 'text-clinical-green'}`}>
              {hasSafetyEvent ? 'warning' : 'check_circle'}
            </span>
            <span className={`text-[11px] font-bold uppercase tracking-widest ${hasSafetyEvent ? 'text-red-400' : 'text-slate-400'}`}>
              {hasSafetyEvent ? 'Adverse Event' : 'Safety Nominal'}
            </span>
          </div>
          {hasSafetyEvent && (
            <span className="text-[11px] font-mono text-red-500 border border-red-500/30 px-1.5 rounded bg-red-500/10 uppercase font-bold">
              Action Req.
            </span>
          )}
        </div>

        {/* Ops Warning */}
        {isUnderbooked && (
          <div className="flex items-center gap-2 text-accent-amber bg-accent-amber/5 px-2.5 py-1.5 rounded-lg border border-accent-amber/10">
            <span className="material-symbols-outlined text-sm">schedule</span>
            <span className="text-[11px] font-bold uppercase tracking-widest">Low Integration Hours</span>
          </div>
        )}
      </div>
    </div>
  );
};

const SubstanceCard: React.FC<{ sub: any; variant?: 'compact' | 'full' }> = ({ sub, variant = 'full' }) => {
  const navigate = useNavigate();

  if (variant === 'compact') {
    return (
      <div
        onClick={() => navigate(`/monograph/${sub.id}`)}
        className="group flex items-center gap-4 bg-slate-900/40 border border-slate-800 rounded-2xl p-3 hover:border-primary/50 transition-all cursor-pointer h-24 overflow-hidden relative"
      >
        <div className="size-16 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 overflow-hidden group-hover:scale-105 transition-transform">
          {sub.imageUrl ? (
            <img src={sub.imageUrl} alt={sub.name} className="w-full h-full object-cover p-1" style={{ mixBlendMode: 'screen', opacity: 0.9 }} />
          ) : (
            <span className="material-symbols-outlined text-2xl text-slate-500">biotech</span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-black text-white truncate group-hover:text-primary transition-colors">{sub.name}</h4>
          <p className="text-[11px] text-slate-500 font-bold tracking-widest uppercase truncate mt-0.5">{sub.class}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[11px] font-mono text-clinical-green bg-clinical-green/10 px-1.5 py-0.5 rounded border border-clinical-green/20">{(sub.efficacy * 100).toFixed(0)}% Eff.</span>
          </div>
        </div>
      </div>
    );
  }

  // Full Variant
  return (
    <div
      onClick={() => navigate(`/monograph/${sub.id}`)}
      className="group bg-slate-900/40 border border-slate-800 hover:border-slate-600 rounded-[2rem] p-6 transition-all duration-300 flex flex-col gap-4 shadow-lg cursor-pointer relative overflow-hidden h-full"
    >
      <div className="flex items-center justify-between relative z-10">
        <div className="px-2 py-1 rounded-lg text-[11px] font-black border uppercase bg-purple-500/10 text-purple-400 border-purple-500/20">
          Substance
        </div>
        <span className="text-[12px] font-black text-slate-500 uppercase tracking-widest">{sub.schedule}</span>
      </div>

      <div className="flex items-center gap-4 relative z-10">
        <div className="size-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 overflow-hidden shadow-md group-hover:scale-105 transition-transform">
          {sub.imageUrl ? (
            <img src={sub.imageUrl} alt={sub.name} className="w-full h-full object-cover p-1" style={{ mixBlendMode: 'screen', opacity: 0.9 }} />
          ) : (
            <span className="material-symbols-outlined text-2xl text-slate-500">biotech</span>
          )}
        </div>
        <div className="min-w-0">
          <h4 className="text-lg font-black text-white truncate group-hover:text-primary transition-colors">{sub.name}</h4>
          <p className="text-[11px] text-slate-500 font-bold tracking-widest uppercase truncate">{sub.class}</p>
        </div>
      </div>

      <div className="pt-3 mt-auto">
        <div className="w-full h-px bg-slate-800/50 mb-3"></div>
        <div className="flex justify-between items-center">
          <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Efficacy</span>
          <span className="text-[11px] font-mono font-bold text-clinical-green">{(sub.efficacy * 100).toFixed(0)}%</span>
        </div>
      </div>
    </div>
  );
};

const ClinicianCard: React.FC<{ clin: any; variant?: 'compact' | 'full' }> = ({ clin, variant = 'full' }) => {
  const navigate = useNavigate();

  if (variant === 'compact') {
    return (
      <div
        onClick={() => navigate(`/clinician/${clin.id}`)}
        className="group flex items-center gap-4 bg-slate-900/40 border border-slate-800 rounded-2xl p-3 hover:border-primary/50 transition-all cursor-pointer h-24"
      >
        <div className="size-14 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 overflow-hidden">
          {clin.imageUrl ? (
            <img src={clin.imageUrl} alt={clin.name} className="w-full h-full object-cover" />
          ) : (
            <span className="material-symbols-outlined text-2xl text-slate-500">groups</span>
          )}
        </div>
        <div className="min-w-0">
          <h4 className="text-sm font-black text-white truncate group-hover:text-primary transition-colors">{clin.name}</h4>
          <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest truncate mt-0.5">{clin.role}</p>
          <div className="flex items-center gap-1 mt-1.5">
            <span className="material-symbols-outlined text-xs text-primary">verified</span>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">Verified Node</span>
          </div>
        </div>
      </div>
    );
  }

  // Full Variant
  return (
    <div
      onClick={() => navigate(`/clinician/${clin.id}`)}
      className="group bg-slate-900/40 border border-slate-800 hover:border-slate-600 rounded-[2rem] p-6 transition-all duration-300 flex flex-col gap-4 shadow-lg cursor-pointer relative overflow-hidden h-full"
    >
      <div className="flex items-center justify-between relative z-10">
        <div className="px-2 py-1 rounded-lg text-[11px] font-black border uppercase bg-blue-500/10 text-blue-400 border-blue-500/20">
          Clinician
        </div>
        <span className="material-symbols-outlined text-slate-600 text-sm">verified</span>
      </div>

      <div className="flex items-center gap-4 relative z-10">
        <div className="size-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 overflow-hidden shadow-md">
          {clin.imageUrl ? (
            <img src={clin.imageUrl} alt={clin.name} className="w-full h-full object-cover" />
          ) : (
            <span className="material-symbols-outlined text-2xl text-slate-500">groups</span>
          )}
        </div>
        <div className="min-w-0">
          <h4 className="text-lg font-black text-white truncate group-hover:text-primary transition-colors">{clin.name}</h4>
          <p className="text-[12px] text-slate-500 font-bold tracking-widest uppercase truncate">{clin.role}</p>
        </div>
      </div>

      <div className="flex gap-2 pt-2 relative z-10 mt-auto">
        <span className="px-2 py-1 rounded bg-slate-800 border border-slate-700 text-[11px] font-bold text-slate-400">Verified Node</span>
        <span className="px-2 py-1 rounded bg-slate-900 border border-slate-700 text-[11px] font-bold text-slate-400">Active</span>
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---

const SearchPortal: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [activeCategory, setActiveCategory] = useState<SearchCategory>('All');

  // SIDEBAR LOGIC
  const [isFilterOpen, setIsFilterOpen] = useState(window.innerWidth >= 1024);

  // Advanced Filters
  const [filters, setFilters] = useState<FilterState>({
    setting: 'All',
    substance: 'All',
    minEfficacy: 'Any'
  });

  const navigate = useNavigate();

  // AI Integration States
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [groundingChunks, setGroundingChunks] = useState<any[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync URL query & category
  useEffect(() => {
    const q = searchParams.get('q');
    const cat = searchParams.get('category');

    if (q !== null && q !== query) {
      setQuery(q);
    }

    if (cat) {
      const validCategories: SearchCategory[] = ['All', 'Substances', 'Clinicians', 'Patients', 'Safety'];
      if (validCategories.includes(cat as SearchCategory)) {
        setActiveCategory(cat as SearchCategory);
      }
    }
  }, [searchParams]);

  const handleCategoryChange = (cat: SearchCategory) => {
    setActiveCategory(cat);
    const newParams = new URLSearchParams(searchParams);
    if (cat === 'All') newParams.delete('category');
    else newParams.set('category', cat);
    setSearchParams(newParams);
  };

  const handleQueryChange = (val: string) => {
    setQuery(val);
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    if (val.trim()) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set('q', val.trim());
      setSearchParams(newParams, { replace: true });

      debounceTimerRef.current = setTimeout(() => {
        generateAiAnalysis(val);
      }, 600);
    } else {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('q');
      setSearchParams(newParams, { replace: true });
      setAiAnalysis(null);
    }
  };

  const generateAiAnalysis = async (searchVal: string) => {
    if (!searchVal.trim()) return;
    setIsAiLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Perform a technical clinical cross-reference for "${searchVal}". Focus on recent 2024-2025 research. Provide a concise synthesis (max 40 words) for a medical research portal.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { tools: [{ googleSearch: {} }] }
      });

      setAiAnalysis(response.text || "Synthesis complete.");
      setGroundingChunks(response.candidates?.[0]?.groundingMetadata?.groundingChunks || []);
    } catch (error) {
      setAiAnalysis("Neural link synchronization required for full synthesis.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleReset = () => {
    setQuery('');
    setSearchParams({}, { replace: true });
    setActiveCategory('All');
    setFilters({ setting: 'All', substance: 'All', minEfficacy: 'Any' });
    setAiAnalysis(null);
  };

  // --- FILTER SEGMENTATION LOGIC ---
  const { patientResults, substanceResults, clinicianResults } = useMemo(() => {
    const q = query.toLowerCase().trim();

    // 1. Filter Patients
    const filteredPatients = PATIENTS.filter(p => {
      const matchesText = !q || p.id.toLowerCase().includes(q) || p.protocol.substance.toLowerCase().includes(q);
      const matchesSetting = filters.setting === 'All' || p.context?.setting === filters.setting;
      const matchesSubstance = filters.substance === 'All' || p.protocol.substance === filters.substance;

      let delta = 0;
      const baseline = p.outcomes.find(o => o.interpretation.toLowerCase().includes('baseline'))?.score || 0;
      const endpoint = p.outcomes.length > 1 ? p.outcomes[p.outcomes.length - 1].score : baseline;
      delta = baseline - endpoint;

      const matchesEfficacy = filters.minEfficacy === 'Any'
        || (filters.minEfficacy === '>5pts PHQ-9' && delta > 5)
        || (filters.minEfficacy === '>10pts PHQ-9' && delta > 10);

      // Special Safety Filter Check
      if (activeCategory === 'Safety' && p.safetyEvents.length === 0) return false;

      return matchesText && matchesSetting && matchesSubstance && matchesEfficacy;
    });

    // 2. Filter Substances
    const filteredSubstances = SUBSTANCES.filter(s => {
      const matchesText = !q || s.name.toLowerCase().includes(q) || s.chemicalName.toLowerCase().includes(q);
      return matchesText;
    });

    // 3. Filter Clinicians
    const filteredClinicians = CLINICIANS.filter(c => {
      const matchesText = !q || c.name.toLowerCase().includes(q) || c.specialization.toLowerCase().includes(q);
      return matchesText;
    });

    return {
      patientResults: filteredPatients,
      substanceResults: filteredSubstances,
      clinicianResults: filteredClinicians
    };
  }, [query, activeCategory, filters]);

  // --- RENDER ---
  return (
    <div className="min-h-screen flex flex-col bg-[#05070a] relative overflow-hidden animate-in fade-in duration-1000">

      {/* Dynamic Background Blobs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-primary/5 rounded-full blur-[140px] pointer-events-none animate-pulse"></div>
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

      {/* CLEAN & GLOWING HERO SECTION */}
      <section className="relative pt-20 pb-12 px-6 sm:px-10 z-10 border-b border-white/5 bg-[#05070a]">
        <div className="max-w-3xl mx-auto flex flex-col items-center text-center space-y-10 relative z-10">

          {/* Title Block */}
          <div className="flex flex-col items-center space-y-4">
            <div className="size-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-primary shadow-lg shadow-primary/10">
              <span className="material-symbols-outlined text-2xl">auto_awesome</span>
            </div>
            <div className="space-y-1">
              <h1 className="text-5xl font-black tracking-tighter mb-4 text-white">
                PPN Research Portal
              </h1>
              <p className="text-slate-400 text-sm sm:text-lg max-w-lg mx-auto leading-relaxed font-medium">Unified Clinical Registry</p>
            </div>
          </div>

          {/* Glowing Search Input */}
          <div className="w-full relative group">
            {/* Background Glow - Behind the search bar only */}
            <div className="absolute -inset-2 bg-gradient-to-r from-primary/30 via-blue-500/30 to-primary/30 blur-3xl rounded-full opacity-60 group-focus-within:opacity-100 transition-opacity duration-700 -z-10"></div>

            <div className="relative">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none z-10">
                <img src="/sparkle-icon.png" alt="" className="w-6 h-6" />
                <span className="text-slate-600 text-lg font-bold">Search protocols, adverse events, or use the Neural Copilot...</span>
              </div>
              <input
                id="tour-search-node"
                type="text"
                value={query}
                onChange={(e) => handleQueryChange(e.target.value)}
                placeholder=""
                className="w-full h-16 sm:h-24 bg-slate-950/95 border-2 border-primary/50 rounded-[2.5rem] px-16 text-lg font-bold text-white focus:ring-0 focus:border-primary transition-all backdrop-blur-2xl text-center hover:border-primary/70"
              />
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`absolute right-4 top-1/2 -translate-y-1/2 size-12 flex items-center justify-center rounded-full border transition-all z-10 ${isFilterOpen ? 'bg-primary border-primary text-white' : 'bg-[#111418] border-slate-800 text-slate-400 hover:border-slate-700'}`}
                title="Toggle Advanced Filters"
              >
                <span className="material-symbols-outlined text-2xl">tune</span>
              </button>
            </div>
          </div>

          {/* Filter Chips */}
          <div className="flex flex-wrap justify-center gap-3">
            {CATEGORIES.map(cat => {
              const isActive = activeCategory === cat.label;
              return (
                <button
                  key={cat.label}
                  onClick={() => handleCategoryChange(cat.label)}
                  className={`px-5 py-2 rounded-full text-[11px] font-black uppercase tracking-widest transition-all border flex items-center gap-2 ${isActive ? 'bg-slate-800 text-white border-slate-700 shadow-lg' : 'bg-transparent text-slate-500 border-transparent hover:bg-slate-900'
                    }`}
                >
                  <span className="material-symbols-outlined text-[16px]">{cat.icon}</span>
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <div className="flex flex-1 overflow-hidden max-w-[1600px] mx-auto w-full relative z-10">

        {/* Smart Filters Sidebar */}
        <aside className={`
          absolute inset-y-0 left-0 z-40 bg-[#05070a]/95 backdrop-blur-xl border-r border-slate-800 p-0 transition-all duration-300 ease-[cubic-bezier(0.25,0.8,0.25,1)] overflow-hidden
          lg:static lg:bg-transparent lg:border-white/5
          ${isFilterOpen ? 'w-72 translate-x-0 shadow-2xl lg:shadow-none lg:w-72 lg:border-r' : 'w-72 -translate-x-full lg:translate-x-0 lg:w-0 lg:border-none'}
        `}>
          <div className="h-full overflow-y-auto custom-scrollbar p-6 space-y-8 pb-20 w-72">
            <div className="flex items-center justify-between lg:hidden mb-2">
              <h3 className="text-sm font-black text-white uppercase tracking-widest">Filters</h3>
              <button onClick={() => setIsFilterOpen(false)} className="p-2 text-slate-500 hover:text-white">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="hidden lg:flex items-center justify-between mb-4">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Smart Filters</h3>
              <button onClick={handleReset} className="text-[12px] font-black text-primary uppercase hover:underline">Reset</button>
            </div>

            <div className="space-y-3">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">location_on</span> Setting
              </label>
              <div className="flex flex-col gap-2">
                {SETTING_OPTIONS.map(opt => (
                  <button
                    key={opt}
                    onClick={() => setFilters(prev => ({ ...prev, setting: opt }))}
                    className={`py-2.5 px-3 rounded-lg text-[11px] font-black uppercase border text-left transition-all ${filters.setting === opt
                      ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300'
                      : 'bg-slate-900/50 border-slate-800 text-slate-500 hover:border-slate-700'
                      }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">science</span> Substance
              </label>
              <div className="flex flex-col gap-2">
                {SUBSTANCE_OPTIONS.map(opt => (
                  <button
                    key={opt}
                    onClick={() => setFilters(prev => ({ ...prev, substance: opt }))}
                    className={`py-2.5 px-4 rounded-lg text-[11px] font-black uppercase text-left border transition-all flex justify-between items-center ${filters.substance === opt
                      ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                      : 'bg-slate-900/50 border-slate-800 text-slate-500 hover:border-slate-700'
                      }`}
                  >
                    {opt}
                    {filters.substance === opt && <span className="material-symbols-outlined text-sm">check</span>}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">trending_down</span> Min. Efficacy
              </label>
              <div className="flex flex-col gap-2">
                {EFFICACY_OPTIONS.map(opt => (
                  <button
                    key={opt}
                    onClick={() => setFilters(prev => ({ ...prev, minEfficacy: opt }))}
                    className={`py-2.5 px-3 rounded-lg text-[9px] font-black uppercase border text-left transition-all ${filters.minEfficacy === opt
                      ? 'bg-primary/20 border-primary text-white shadow-lg'
                      : 'bg-slate-900/50 border-slate-800 text-slate-500 hover:border-slate-700'
                      }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={handleReset} className="lg:hidden w-full py-3 border border-slate-800 hover:bg-slate-800 rounded-xl text-[12px] font-black text-slate-500 hover:text-white uppercase tracking-widest transition-all">
              Reset Filters
            </button>
          </div>
        </aside>

        {/* Results Stream */}
        <section className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-8" onClick={() => { if (window.innerWidth < 1024) setIsFilterOpen(false); }}>

          {/* AI Synthesis */}
          {query.trim().length > 0 && (
            <div className="mb-8 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-[2rem] p-6 sm:p-8 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                  <span className="material-symbols-outlined text-7xl">auto_awesome</span>
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <div className="size-8 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                    <span className="material-symbols-outlined text-lg animate-pulse">psychology</span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[11px] font-black text-indigo-300 tracking-[0.2em] uppercase">Neural Copilot</span>
                  </div>
                </div>

                {isAiLoading ? (
                  <div className="space-y-3">
                    <div className="h-1.5 bg-indigo-500/10 rounded-full w-3/4 animate-pulse"></div>
                    <div className="h-1.5 bg-indigo-500/10 rounded-full w-1/2 animate-pulse"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-xs sm:text-sm font-medium text-slate-200 leading-relaxed opacity-90">
                      {aiAnalysis || "Synthesizing global node data..."}
                    </p>
                    {groundingChunks.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-2">
                        {groundingChunks.filter(c => c.web).slice(0, 3).map((chunk, i) => (
                          <a key={i} href={chunk.web.uri} target="_blank" rel="noreferrer" className="px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-[11px] font-black text-indigo-300 tracking-widest flex items-center gap-2 hover:bg-indigo-500/20 transition-all">
                            <span className="material-symbols-outlined text-[10px]">link</span>
                            {chunk.web.title?.slice(0, 20) || 'Source'}...
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* RENDER LOGIC: Grouped Overview vs Deep Dive */}
          {activeCategory === 'All' ? (
            <div className="space-y-6 pb-20">

              {/* Row 1: Substances (Bento Top) */}
              {substanceResults.length > 0 && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <SectionHeader
                    title="Matched Substances"
                    icon="biotech"
                    count={substanceResults.length}
                    onSeeAll={() => handleCategoryChange('Substances')}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {substanceResults.slice(0, 3).map((sub, i) => (
                      <SubstanceCard key={`sub-${sub.id}-${i}`} sub={sub} variant="compact" />
                    ))}
                  </div>
                </div>
              )}

              {/* Row 2: Split View (Patients Left, Clinicians Right) */}
              {(patientResults.length > 0 || clinicianResults.length > 0) && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

                  {/* Left Col: Patients */}
                  <div className="flex flex-col">
                    {patientResults.length > 0 && (
                      <>
                        <SectionHeader
                          title="Patient Registry"
                          icon="personal_injury"
                          count={patientResults.length}
                          onSeeAll={() => handleCategoryChange('Patients')}
                        />
                        <div className="flex flex-col gap-3">
                          {patientResults.slice(0, 3).map((pat, i) => (
                            <PatientCard key={`pat-${pat.id}-${i}`} res={pat} variant="compact" />
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Right Col: Clinicians */}
                  <div className="flex flex-col">
                    {clinicianResults.length > 0 && (
                      <>
                        <SectionHeader
                          title="Verified Clinicians"
                          icon="groups"
                          count={clinicianResults.length}
                          onSeeAll={() => handleCategoryChange('Clinicians')}
                        />
                        <div className="flex flex-col gap-3">
                          {clinicianResults.slice(0, 3).map((clin, i) => (
                            <ClinicianCard key={`clin-${clin.id}-${i}`} clin={clin} variant="compact" />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Empty State */}
              {substanceResults.length === 0 && patientResults.length === 0 && clinicianResults.length === 0 && (
                <div className="py-24 text-center">
                  <div className="size-20 bg-slate-900/50 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-800">
                    <span className="material-symbols-outlined text-3xl text-slate-700">filter_list_off</span>
                  </div>
                  <p className="text-slate-500 font-black tracking-widest text-[11px] uppercase">No registry nodes found matching criteria.</p>
                  <button onClick={handleReset} className="mt-4 text-primary text-xs font-bold hover:underline">Clear Filters</button>
                </div>
              )}
            </div>
          ) : (
            /* DEEP DIVE: Full Grid for Active Category */
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">

              {activeCategory === 'Substances' && substanceResults.map((sub, i) => (
                <SubstanceCard key={`sub-full-${sub.id}-${i}`} sub={sub} variant="full" />
              ))}

              {(activeCategory === 'Patients' || activeCategory === 'Safety') && patientResults.map((pat, i) => (
                <PatientCard key={`pat-full-${pat.id}-${i}`} res={pat} variant="full" />
              ))}

              {activeCategory === 'Clinicians' && clinicianResults.map((clin, i) => (
                <ClinicianCard key={`clin-full-${clin.id}-${i}`} clin={clin} variant="full" />
              ))}

              {((activeCategory === 'Substances' && substanceResults.length === 0) ||
                ((activeCategory === 'Patients' || activeCategory === 'Safety') && patientResults.length === 0) ||
                (activeCategory === 'Clinicians' && clinicianResults.length === 0)) && (
                  <div className="col-span-full py-24 text-center">
                    <div className="size-20 bg-slate-900/50 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-800">
                      <span className="material-symbols-outlined text-3xl text-slate-700">filter_list_off</span>
                    </div>
                    <p className="text-slate-500 font-black tracking-widest text-[11px] uppercase">No registry nodes found in this category.</p>
                    <button onClick={handleReset} className="mt-4 text-primary text-xs font-bold hover:underline">Clear Filters</button>
                  </div>
                )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default SearchPortal;