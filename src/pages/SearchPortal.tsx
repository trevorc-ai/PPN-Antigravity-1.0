import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { SUBSTANCES, CLINICIANS, PATIENTS } from '../constants';
import { GoogleGenAI } from "@google/genai";
import { PageContainer } from '../components/layouts/PageContainer';
import { Section } from '../components/layouts/Section';
import { PatientRecord, Substance, Clinician, Outcome } from '../types';

// ─── Types ───────────────────────────────────────────────────────────────────
type SearchCategory = 'All' | 'Substances' | 'Clinicians' | 'Patients' | 'Safety';

const CATEGORIES: { label: SearchCategory; icon: string }[] = [
  { label: 'All', icon: 'apps' },
  { label: 'Patients', icon: 'personal_injury' },
  { label: 'Safety', icon: 'warning' },
  { label: 'Substances', icon: 'biotech' },
  { label: 'Clinicians', icon: 'groups' },
];

const EFFICACY_OPTIONS = ['Any', '>5pts PHQ-9', '>10pts PHQ-9'];

interface GroundingChunk { web?: { uri: string; title: string } }

// ─── Card Components (full variant only) ─────────────────────────────────────

const PatientCard: React.FC<{ res: PatientRecord }> = ({ res }) => {
  const navigate = useNavigate();
  const outcomeType = res.outcomes?.[0]?.type || 'Unknown';
  let condition = 'Clinical';
  if (outcomeType === 'PHQ-9' || outcomeType === 'MADRS') condition = 'TRD';
  else if (outcomeType === 'GAD-7') condition = 'Anxiety';
  else if (outcomeType === 'CAPS-5') condition = 'PTSD';

  const baseline = res.outcomes?.find((o: Outcome) => o.interpretation.toLowerCase().includes('baseline'))?.score || 0;
  const current = res.outcomes?.[res.outcomes.length - 1]?.score || 0;
  const delta = baseline - current;
  const isResponder = delta >= 5;
  const integrationHours = res.context?.integrationHours || 0;
  const isUnderbooked = integrationHours < 3;
  const hasSafetyEvent = res.safetyEvents && res.safetyEvents.length > 0;
  const routeName = res.protocol.route === 'Intravenous' ? 'IV' : res.protocol.route === 'Intramuscular' ? 'IM' : 'PO';

  return (
    <div
      onClick={() => navigate(`/protocol/${res.id}`)}
      className={`group bg-gradient-to-br from-slate-900/70 to-slate-800/50 border-2 ${hasSafetyEvent ? 'border-red-500/40 hover:border-red-500/70' : 'border-slate-700 hover:border-primary/60'} rounded-[2rem] p-6 transition-all duration-300 cursor-pointer flex flex-col gap-6 relative overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-primary/30 h-full`}
    >
      <div className="flex justify-between items-start relative z-10">
        <div className="space-y-1">
          <h4 className="text-xl font-black tracking-tight leading-tight" style={{ color: '#8B9DC3' }}>
            {condition} • {res.protocol.substance}
          </h4>
          <p className="text-[12px] font-medium text-slate-400">{routeName} • {res.protocol.dosage}{res.protocol.dosageUnit || 'mg'}</p>
        </div>
        <span className="px-2 py-1 rounded bg-slate-950 border border-slate-800 text-[12px] font-mono font-bold text-slate-400">{res.id}</span>
      </div>

      <div className="space-y-3 relative z-10">
        <div className="flex justify-between items-end">
          <span className="text-[12px] font-medium text-slate-400">Efficacy ({outcomeType})</span>
          <span className={`text-2xl font-black ${isResponder ? 'text-clinical-green' : 'text-slate-300'}`}>▼ {delta} pts</span>
        </div>
        <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
          <div className={`h-full transition-all duration-1000 ${isResponder ? 'bg-clinical-green' : 'bg-slate-600'}`} style={{ width: isResponder ? '60%' : '15%' }} />
        </div>
      </div>

      <div className="mt-auto pt-4 border-t border-slate-800/50 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`material-symbols-outlined text-base ${hasSafetyEvent ? 'text-red-500 animate-pulse' : 'text-clinical-green'}`}>
              {hasSafetyEvent ? 'warning' : 'check_circle'}
            </span>
            <span className={`text-[12px] font-medium ${hasSafetyEvent ? 'text-red-400' : 'text-slate-300'}`}>
              {hasSafetyEvent ? 'Adverse Event' : 'Safety Nominal'}
            </span>
          </div>
          {hasSafetyEvent && (
            <span className="text-[12px] font-mono text-red-500 border border-red-500/30 px-1.5 rounded bg-red-500/10 font-bold">Action Req.</span>
          )}
        </div>
        {isUnderbooked && (
          <div className="flex items-center gap-2 text-accent-amber bg-accent-amber/5 px-2.5 py-1.5 rounded-lg border border-accent-amber/10">
            <span className="material-symbols-outlined text-sm">schedule</span>
            <span className="text-[12px] font-medium">Low Integration Hours</span>
          </div>
        )}
      </div>
    </div>
  );
};

const SubstanceCard: React.FC<{ sub: Substance }> = ({ sub }) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/monograph/${sub.id}`)}
      className="group bg-gradient-to-br from-purple-900/30 to-slate-900/70 border-2 border-purple-700/40 hover:border-purple-500/70 rounded-[2rem] p-6 transition-all duration-300 flex flex-col gap-4 shadow-xl hover:shadow-purple-500/30 cursor-pointer relative overflow-hidden h-full"
    >
      <div className="flex items-center justify-between relative z-10">
        <div className="px-2 py-1 rounded-lg text-[12px] font-bold border bg-purple-500/10 text-purple-400 border-purple-500/20">Substance</div>
        <span className="text-[12px] font-medium text-slate-400">{sub.schedule}</span>
      </div>
      <div className="flex items-center gap-4 relative z-10">
        <div className="size-16 rounded-2xl bg-black/80 border border-slate-700 flex items-center justify-center shrink-0 overflow-hidden shadow-md group-hover:scale-105 transition-transform p-2">
          {sub.imageUrl ? (
            <img src={sub.imageUrl} alt={sub.name} className="w-full h-full object-contain" style={{ mixBlendMode: 'screen', opacity: 0.9 }} />
          ) : (
            <span className="material-symbols-outlined text-2xl text-slate-400">biotech</span>
          )}
        </div>
        <div className="min-w-0">
          <h4 className="text-lg font-black text-slate-300 truncate group-hover:text-primary transition-colors">{sub.name}</h4>
          <p className="text-[12px] text-slate-400 font-medium truncate">{sub.class}</p>
        </div>
      </div>
      <div className="pt-3 mt-auto">
        <div className="w-full h-px bg-slate-800/50 mb-3" />
        <div className="flex justify-between items-center">
          <span className="text-[12px] font-medium text-slate-400">Efficacy</span>
          <span className="text-[12px] font-mono font-bold text-clinical-green">{(sub.efficacy * 100).toFixed(0)}%</span>
        </div>
      </div>
    </div>
  );
};

const ClinicianCard: React.FC<{ clin: Clinician }> = ({ clin }) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/clinician/${clin.id}`)}
      className="group bg-gradient-to-br from-blue-900/30 to-slate-900/70 border-2 border-blue-700/40 hover:border-blue-500/70 rounded-[2rem] p-6 transition-all duration-300 flex flex-col gap-4 shadow-xl hover:shadow-blue-500/30 cursor-pointer relative overflow-hidden h-full"
    >
      <div className="flex items-center justify-between relative z-10">
        <div className="px-2 py-1 rounded-lg text-[12px] font-bold border bg-blue-500/10 text-blue-400 border-blue-500/20">Clinician</div>
        <span className="material-symbols-outlined text-slate-600 text-sm">verified</span>
      </div>
      <div className="flex items-center gap-4 relative z-10">
        <div className="size-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 overflow-hidden shadow-md">
          {clin.imageUrl ? (
            <img src={clin.imageUrl} alt={clin.name} className="w-full h-full object-cover" />
          ) : (
            <span className="material-symbols-outlined text-2xl text-slate-400">groups</span>
          )}
        </div>
        <div className="min-w-0">
          <h4 className="text-lg font-black text-slate-300 truncate group-hover:text-primary transition-colors">{clin.name}</h4>
          <p className="text-[12px] text-slate-400 font-medium truncate">{clin.role}</p>
        </div>
      </div>
      <div className="flex gap-2 pt-2 relative z-10 mt-auto">
        <span className="px-2 py-1 rounded bg-slate-800 border border-slate-700 text-[12px] font-bold text-slate-300">Verified Node</span>
        <span className="px-2 py-1 rounded bg-slate-900 border border-slate-700 text-[12px] font-bold text-slate-300">Active</span>
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const SearchPortal: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [activeCategory, setActiveCategory] = useState<SearchCategory>('All');
  const [minEfficacy, setMinEfficacy] = useState('Any');
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [groundingChunks, setGroundingChunks] = useState<GroundingChunk[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus search input on mount
  useEffect(() => { inputRef.current?.focus(); }, []);

  // Sync URL params
  useEffect(() => {
    const q = searchParams.get('q');
    const cat = searchParams.get('category') as SearchCategory | null;
    if (q !== null && q !== query) setQuery(q);
    if (cat && ['All', 'Substances', 'Clinicians', 'Patients', 'Safety'].includes(cat)) setActiveCategory(cat);
  }, [searchParams]);

  const handleCategoryChange = (cat: SearchCategory) => {
    setActiveCategory(cat);
    const p = new URLSearchParams(searchParams);
    if (cat === 'All') p.delete('category'); else p.set('category', cat);
    setSearchParams(p);
  };

  const handleQueryChange = (val: string) => {
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const p = new URLSearchParams(searchParams);
    if (val.trim()) {
      p.set('q', val.trim());
      setSearchParams(p, { replace: true });
      debounceRef.current = setTimeout(() => generateAiAnalysis(val), 600);
    } else {
      p.delete('q');
      setSearchParams(p, { replace: true });
      setAiAnalysis(null);
    }
  };

  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;

  const generateAiAnalysis = async (searchVal: string) => {
    if (!searchVal.trim()) return;
    // If no API key is configured, show a polite offline message and skip the call
    if (!GEMINI_API_KEY) {
      setAiAnalysis('AI synthesis is offline — configure VITE_GEMINI_API_KEY to enable Neural Copilot.');
      return;
    }
    setIsAiLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: `Perform a technical clinical cross-reference for "${searchVal}". Focus on recent 2024-2025 research. Provide a concise synthesis (max 40 words) for a clinical intelligence portal.`,
        config: { tools: [{ googleSearch: {} }] }
      });
      setAiAnalysis(response.text || 'Synthesis complete.');
      setGroundingChunks(response.candidates?.[0]?.groundingMetadata?.groundingChunks || []);
    } catch (err) {
      console.error('[SearchPortal] AI synthesis error:', err);
      setAiAnalysis('Synthesis unavailable — check your network connection or API key.');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleReset = () => {
    setQuery('');
    setSearchParams({}, { replace: true });
    setActiveCategory('All');
    setMinEfficacy('Any');
    setAiAnalysis(null);
    inputRef.current?.focus();
  };

  // ─── Filter logic ─────────────────────────────────────────────────────────
  const { patientResults, substanceResults, clinicianResults } = useMemo(() => {
    const q = query.toLowerCase().trim();

    const patientResults = PATIENTS.filter(p => {
      const matchesText = !q || p.id.toLowerCase().includes(q) || p.protocol.substance.toLowerCase().includes(q);
      const baseline = p.outcomes.find(o => o.interpretation.toLowerCase().includes('baseline'))?.score || 0;
      const endpoint = p.outcomes.length > 1 ? p.outcomes[p.outcomes.length - 1].score : baseline;
      const delta = baseline - endpoint;
      const matchesEfficacy = minEfficacy === 'Any'
        || (minEfficacy === '>5pts PHQ-9' && delta > 5)
        || (minEfficacy === '>10pts PHQ-9' && delta > 10);
      if (activeCategory === 'Safety' && p.safetyEvents.length === 0) return false;
      return matchesText && matchesEfficacy;
    });

    const substanceResults = SUBSTANCES.filter(s =>
      !q || s.name.toLowerCase().includes(q) || s.chemicalName.toLowerCase().includes(q) || s.class.toLowerCase().includes(q)
    );

    const clinicianResults = CLINICIANS.filter(c =>
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.specialization.toLowerCase().includes(q) ||
      c.role.toLowerCase().includes(q) ||
      (c.institution && c.institution.toLowerCase().includes(q)) ||
      (c.location && c.location.toLowerCase().includes(q)) ||
      (c.tags && c.tags.some(t => t.toLowerCase().includes(q)))
    );

    return { patientResults, substanceResults, clinicianResults };
  }, [query, activeCategory, minEfficacy]);

  // Result counts per category
  const counts: Record<SearchCategory, number> = {
    All: patientResults.length + substanceResults.length + clinicianResults.length,
    Patients: patientResults.length,
    Safety: PATIENTS.filter(p => p.safetyEvents?.length > 0).length,
    Substances: substanceResults.length,
    Clinicians: clinicianResults.length,
  };

  // Determine which results to show in the grid
  const showPatients = activeCategory === 'All' || activeCategory === 'Patients' || activeCategory === 'Safety';
  const showSubstances = activeCategory === 'All' || activeCategory === 'Substances';
  const showClinicians = activeCategory === 'All' || activeCategory === 'Clinicians';

  const totalVisible =
    (showPatients ? patientResults.length : 0) +
    (showSubstances ? substanceResults.length : 0) +
    (showClinicians ? clinicianResults.length : 0);

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col bg-[#0a1628] relative overflow-hidden animate-in fade-in duration-1000">

      {/* Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-primary/5 rounded-full blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      {/* Hero */}
      <section className="relative pt-20 pb-12 px-6 sm:px-10 z-10 border-b border-white/5 bg-[#0a1628]">
        <div className="max-w-3xl mx-auto flex flex-col items-center text-center space-y-8 relative z-10">

          <div className="flex flex-col items-center space-y-4">
            <div className="size-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-primary shadow-lg shadow-primary/10">
              <span className="material-symbols-outlined text-2xl">auto_awesome</span>
            </div>
            <div className="space-y-1">
              <h1 className="text-5xl font-black tracking-tighter mb-2" style={{ color: '#8BA5D3' }}>Neural Search</h1>
              <p className="text-sm sm:text-base max-w-lg mx-auto leading-relaxed font-medium" style={{ color: '#8B9DC3' }}>
                Ask a clinical question or search by patient ID, substance, or clinician
              </p>
            </div>
          </div>

          {/* Search bar */}
          <div className="w-full relative group">
            <div className="absolute -inset-2 bg-gradient-to-r from-primary/30 via-blue-500/30 to-primary/30 blur-3xl rounded-full opacity-60 group-focus-within:opacity-100 transition-opacity duration-700 -z-10" />
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                <span className="material-symbols-outlined text-primary text-xl">auto_awesome</span>
              </div>
              <input
                ref={inputRef}
                id="tour-search-node"
                type="text"
                value={query}
                onChange={e => handleQueryChange(e.target.value)}
                placeholder="Search protocols, adverse events, Ketamine + Neural Cognition..."
                aria-label="Search protocols, substances, and patients"
                className="w-full h-16 sm:h-20 pl-12 pr-14 py-4 bg-slate-900/50 border-2 border-slate-700 rounded-[2.5rem] text-slate-300 placeholder-slate-500 focus:outline-none focus:border-primary/50 focus:bg-slate-900/70 transition-all duration-300 text-base font-bold"
              />
              <button
                onClick={() => generateAiAnalysis(query)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 sm:p-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl hover:bg-blue-600 transition-colors"
                aria-label="Search"
              >
                <span className="material-symbols-outlined text-slate-300">search</span>
              </button>
            </div>
          </div>

          {/* Category chips with result count badges */}
          <div className="flex flex-wrap justify-center gap-2" role="tablist" aria-label="Search categories">
            {CATEGORIES.map(cat => {
              const isActive = activeCategory === cat.label;
              return (
                <button
                  key={cat.label}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => handleCategoryChange(cat.label)}
                  className={`px-4 py-2 rounded-full text-[12px] font-bold transition-all border flex items-center gap-2 ${isActive
                    ? 'bg-slate-800 text-slate-300 border-slate-600 shadow-lg'
                    : 'bg-transparent text-slate-500 border-transparent hover:bg-slate-900 hover:text-slate-300'
                    }`}
                >
                  <span className="material-symbols-outlined text-[16px]">{cat.icon}</span>
                  {cat.label}
                  <span className={`px-1.5 py-0.5 rounded text-xs font-mono font-bold ${isActive ? 'bg-slate-700 text-slate-300' : 'bg-slate-900 text-slate-500'}`}>
                    {counts[cat.label]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Inline efficacy filter — only when Patients/Safety active */}
          {(activeCategory === 'Patients' || activeCategory === 'Safety') && (
            <div className="flex flex-wrap justify-center gap-2 animate-in fade-in duration-200" role="group" aria-label="Efficacy filter">
              <span className="text-[12px] font-bold text-slate-500 self-center">Min efficacy:</span>
              {EFFICACY_OPTIONS.map(opt => (
                <button
                  key={opt}
                  onClick={() => setMinEfficacy(opt)}
                  className={`px-3 py-1.5 rounded-full text-[12px] font-bold border transition-all ${minEfficacy === opt
                    ? 'bg-primary/20 border-primary text-slate-300'
                    : 'bg-transparent border-slate-700 text-slate-500 hover:border-slate-500 hover:text-slate-300'
                    }`}
                  aria-pressed={minEfficacy === opt}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Results */}
      <div className="flex-1 relative z-10">
        <PageContainer width="wide" className="py-8">
          <Section spacing="spacious">

            {/* AI Neural Copilot */}
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
                    <span className="text-[12px] font-bold text-indigo-300">Neural Copilot</span>
                  </div>
                  {isAiLoading ? (
                    <div className="space-y-3">
                      <div className="h-1.5 bg-indigo-500/10 rounded-full w-3/4 animate-pulse" />
                      <div className="h-1.5 bg-indigo-500/10 rounded-full w-1/2 animate-pulse" />
                      <p className="text-xs font-medium text-indigo-400/60 mt-2">Querying global research nodes...</p>
                    </div>
                  ) : (
                    <div className="space-y-4" aria-live="polite">
                      <p className="text-sm font-medium text-slate-300 leading-relaxed opacity-90">
                        {aiAnalysis || 'Synthesizing global node data...'}
                      </p>
                      {groundingChunks.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-2">
                          {groundingChunks.filter(c => c.web).slice(0, 3).map((chunk, i) => (
                            <a
                              key={i}
                              href={chunk.web!.uri}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-[12px] font-black text-indigo-300 tracking-widest flex items-center gap-2 hover:bg-indigo-500/20 transition-all"
                            >
                              <span className="material-symbols-outlined text-[12px]">link</span>
                              {chunk.web!.title?.slice(0, 20) || 'Source'}...
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Results grid — always full cards */}
            {totalVisible > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {showSubstances && substanceResults.map((sub, i) => (
                  <SubstanceCard key={`sub-${sub.id}-${i}`} sub={sub} />
                ))}
                {showPatients && patientResults.map((pat, i) => (
                  <PatientCard key={`pat-${pat.id}-${i}`} res={pat} />
                ))}
                {showClinicians && clinicianResults.map((clin, i) => (
                  <ClinicianCard key={`clin-${clin.id}-${i}`} clin={clin} />
                ))}
              </div>
            ) : (
              <div className="py-24 text-center">
                <div className="size-20 bg-slate-900/50 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-800">
                  <span className="material-symbols-outlined text-3xl text-slate-700">filter_list_off</span>
                </div>
                <p className="text-slate-400 font-medium text-[14px]">No registry nodes found matching criteria.</p>
                <button onClick={handleReset} className="mt-4 text-primary text-[13px] font-bold hover:underline">
                  Clear Filters
                </button>
              </div>
            )}

          </Section>
        </PageContainer>
      </div>
    </div>
  );
};

export default SearchPortal;