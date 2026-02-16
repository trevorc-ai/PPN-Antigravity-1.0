
import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SUBSTANCES, INTERACTION_RULES } from '../constants';
import { GoogleGenAI } from "@google/genai";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, RadarChart, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { PageContainer } from '../components/layouts/PageContainer';
import { Section } from '../components/layouts/Section';
import { MonographHero } from '../components/substance/MonographHero';

const ResearchSources: React.FC<{ chunks: any[] }> = ({ chunks }) => {
  if (!chunks || chunks.length === 0) return null;

  const sources = chunks
    .filter(chunk => chunk.web && chunk.web.uri)
    .map(chunk => ({
      title: chunk.web.title || 'Clinical Research Source',
      uri: chunk.web.uri
    }));

  if (sources.length === 0) return null;

  return (
    <div className="mt-8 pt-6 border-t border-white/5 space-y-4">
      <h4 className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.2em] flex items-center gap-2">
        <span className="material-symbols-outlined text-sm">database</span>
        Verified Intelligence Nodes
      </h4>
      <div className="space-y-2">
        {sources.map((s, i) => (
          <a
            key={i}
            href={s.uri}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col gap-1 bg-slate-900/40 p-3 rounded-2xl border border-slate-800 hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300 font-bold truncate group-hover:text-slate-200 transition-colors">{s.title}</span>
              <span className="material-symbols-outlined text-[14px] text-slate-600 group-hover:text-indigo-400 transition-colors">arrow_outward</span>
            </div>
            <span className="text-[11px] font-mono text-slate-600 truncate">{s.uri}</span>
          </a>
        ))}
      </div>
    </div>
  );
};

const SubstanceMonograph: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [groundingChunks, setGroundingChunks] = useState<any[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const sub = useMemo(() => SUBSTANCES.find(s => s.id === id), [id]);

  // Refactored to use centralized registry
  const interactions = useMemo(() => {
    if (!sub) return [];
    return INTERACTION_RULES.filter(r => r.substance === sub.name).map(rule => ({
      agent: rule.interactor,
      risk: (rule.severity === 'Life-Threatening' || rule.severity === 'High') ? 'High' : 'Medium',
      description: rule.description
    }));
  }, [sub]);

  const receptorData = useMemo(() => [
    { subject: '5-HT2A', A: 120, fullMark: 150 },
    { subject: '5-HT1A', A: 98, fullMark: 150 },
    { subject: 'D2', A: 86, fullMark: 150 },
    { subject: 'NMDA', A: sub?.name === 'Ketamine' ? 140 : 20, fullMark: 150 },
    { subject: 'SERT', A: sub?.name === 'MDMA' ? 135 : 40, fullMark: 150 },
    { subject: 'NET', A: sub?.name === 'MDMA' ? 110 : 30, fullMark: 150 },
  ], [sub]);

  const efficacyData = useMemo(() => {
    if (!sub || !sub.historicalEfficacy) return [
      { year: 'Baseline', val: 0.1 },
      { year: 'Discovery', val: 0.35 },
      { year: 'Phase I', val: 0.58 },
      { year: 'Current', val: sub?.efficacy || 0.8 }
    ];
    return sub.historicalEfficacy.map((val, i) => ({
      year: i === 0 ? 'Initial' : i === sub.historicalEfficacy!.length - 1 ? 'Current' : `v${i}`,
      val
    }));
  }, [sub]);

  const runAiSynthesis = async () => {
    if (!sub) return;
    setIsAiLoading(true);
    setAiAnalysis(null);
    setGroundingChunks([]);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Synthesize a high-fidelity, technical clinical dossier summary for ${sub.name} (${sub.chemicalName}). Use Google Search to find recent (2024-2025) clinical trials, new pharmacology breakthroughs, and current legal/regulatory changes. Provide a highly technical analysis for research leads.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }]
        }
      });

      setAiAnalysis(response.text || "Failed to synthesize grounded data node.");
      setGroundingChunks(response.candidates?.[0]?.groundingMetadata?.groundingChunks || []);
    } catch (e) {
      setAiAnalysis("Neural link error. Synthesis interrupted.");
    } finally {
      setIsAiLoading(false);
    }
  };

  if (!sub) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-6">
        <span className="material-symbols-outlined text-7xl text-slate-800">error</span>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-200 uppercase tracking-tight">Compound Node Not Found</h2>
          <p className="text-slate-3000 font-medium">The requested identifier 0x{id} does not exist in the institutional registry.</p>
        </div>
        <button
          onClick={() => navigate('/catalog')}
          className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold rounded-xl uppercase tracking-widest transition-all"
        >
          Return to Registry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[#080a0f] animate-in fade-in duration-700 pb-20 overflow-x-hidden">
      {/* Hero Section */}
      <MonographHero substance={sub} />

      <PageContainer width="wide" className="py-12">
        <Section spacing="default" className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* LEFT COLUMN: Pharmacological & Clinical Record (Span 8) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Bento Cell 1: Registry */}
              <section className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-6 backdrop-blur-3xl shadow-2xl flex flex-col group/registry">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-[13px] font-black text-slate-200 tracking-[0.2em] flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                      <span className="material-symbols-outlined text-lg">science</span>
                    </div>
                    Registry
                  </h3>
                  <span className="text-[11px] font-mono text-slate-600 font-black tracking-widest">MOD_0x{id?.slice(-4)}</span>
                </div>

                <div className="grid grid-cols-2 gap-3 flex-1">
                  {[
                    { label: 'CAS Registry', val: sub.cas, icon: 'tag' },
                    { label: 'Mol. Weight', val: sub.molecularWeight, icon: 'weight' },
                    { label: 'Formula', val: sub.formula, icon: 'formula' },
                    { label: 'Drug Class', val: sub.class, icon: 'category' },
                    { label: 'Bioavailability', val: '78-92%', icon: 'speed' },
                    { label: 'Half-Life', val: '2.5 - 4.2h', icon: 'timer' },
                  ].map((item, i) => (
                    <div key={i} className="p-3 bg-black/40 border border-white/5 rounded-[1.2rem] hover:border-primary/30 hover:bg-primary/5 transition-all duration-300 group/item">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="material-symbols-outlined text-[13px] text-slate-600 group-hover/item:text-primary transition-colors">{item.icon}</span>
                        <span className="text-[11px] font-black text-slate-600 uppercase tracking-widest">{item.label}</span>
                      </div>
                      <span className="text-sm font-mono font-bold text-slate-200 truncate block group-hover/item:text-slate-300 transition-colors">{item.val}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Bento Cell 2: Affinity */}
              <section className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-6 backdrop-blur-3xl shadow-2xl h-[420px] flex flex-col group/radar">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[13px] font-black text-slate-200 tracking-[0.2em] flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                      <span className="material-symbols-outlined text-lg">hexagon</span>
                    </div>
                    Affinity
                  </h3>
                  <div className="px-3 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full text-[11px] font-black uppercase tracking-widest">Ki Spec</div>
                </div>
                <div className="flex-1 min-h-0 bg-black/20 rounded-[2rem] p-2 border border-white/5">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="75%" data={receptorData}>
                      <PolarGrid stroke="#1e293b" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 10, fontWeight: 900 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                      <Radar name={sub.name} dataKey="A" stroke="#2b74f3" fill="#2b74f3" fillOpacity={0.3} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px' }} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </section>
            </div>

            {/* Bento Cell 4: Velocity */}
            <section className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-3xl shadow-2xl h-[400px] flex flex-col group/velocity">
              <div className="flex items-center justify-between mb-6">
                <div className="space-y-1">
                  <h3 className="text-[13px] font-black text-slate-200 tracking-[0.2em] flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                      <span className="material-symbols-outlined text-lg">trending_up</span>
                    </div>
                    Clinical Velocity
                  </h3>
                  <p className="text-[11px] text-slate-600 font-black uppercase tracking-[0.2em] ml-11">Efficacy validation trend across versions</p>
                </div>
              </div>
              <div className="flex-1 min-h-0 bg-black/40 rounded-[2rem] p-6 border border-white/5">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={efficacyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="efficacyGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2b74f3" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#2b74f3" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 10, fontWeight: 800 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 10, fontWeight: 800 }} domain={[0, 1]} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '16px' }} />
                    <Area type="monotone" dataKey="val" stroke="#2b74f3" strokeWidth={5} fill="url(#efficacyGrad)" dot={{ r: 5, fill: '#2b74f3' }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN: AI Synthesis & Archives (Span 4) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Bento Cell 3: Neural Synthesis */}
            <section className="bg-indigo-600/5 border border-indigo-500/20 rounded-[2.5rem] p-8 shadow-2xl flex flex-col group/synthesis relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                <span className="material-symbols-outlined text-7xl">psychology</span>
              </div>
              <div className="flex items-center gap-4 mb-8 relative z-10">
                <div className="size-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                  <span className="material-symbols-outlined text-2xl animate-pulse">auto_awesome</span>
                </div>
                <div>
                  <h3 className="text-[14px] font-black text-indigo-300 uppercase tracking-[0.2em]">Neural Synthesis</h3>
                  <p className="text-[11px] font-mono text-indigo-500/60 uppercase tracking-widest">Node_4.2 Analysis</p>
                </div>
              </div>

              <div className="flex-1 space-y-4 relative z-10">
                {isAiLoading ? (
                  <div className="h-full py-12 flex flex-col items-center justify-center space-y-4">
                    <div className="size-10 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin"></div>
                    <p className="text-[11px] font-black text-indigo-500/60 uppercase tracking-widest animate-pulse font-mono">Accessing Grounded Registry...</p>
                  </div>
                ) : aiAnalysis ? (
                  <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-500">
                    <p className="text-sm text-slate-300 font-medium leading-relaxed italic border-l-2 border-indigo-500/30 pl-4">
                      "{aiAnalysis}"
                    </p>
                    <ResearchSources chunks={groundingChunks} />
                  </div>
                ) : (
                  <div className="h-full flex flex-col justify-between space-y-6">
                    <p className="text-[14px] text-slate-3000 font-medium leading-relaxed">
                      Run a neural synthesis to correlate this compound with the latest grounded clinical research from 2024-2025.
                    </p>
                    <button
                      onClick={runAiSynthesis}
                      className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-slate-300 text-sm font-black rounded-2xl uppercase tracking-[0.2em] transition-all shadow-xl shadow-indigo-900/20 flex items-center justify-center gap-2 group active:scale-95"
                    >
                      <span className="material-symbols-outlined text-lg group-hover:rotate-12 transition-transform">bolt</span>
                      Initialize Synthesis
                    </button>
                  </div>
                )}
              </div>
            </section>

            {/* Bento Cell 5: Clinical Archive */}
            <section className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-3xl shadow-2xl space-y-6 group/archives">
              <div className="space-y-1">
                <h3 className="text-[13px] font-black text-slate-200 tracking-[0.2em] uppercase">Clinical Archive</h3>
                <p className="text-[11px] text-slate-600 font-black uppercase tracking-widest">Authorized Site Uploads</p>
              </div>
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="p-3.5 bg-black/20 border border-white/5 rounded-2xl flex items-center justify-between group cursor-pointer hover:bg-black/40 hover:border-white/10 transition-all duration-300">
                    <div className="flex items-center gap-3">
                      <div className="size-9 rounded-xl bg-slate-950 flex items-center justify-center text-slate-600 group-hover:text-primary border border-white/5 transition-colors">
                        <span className="material-symbols-outlined text-lg">folder_zip</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-300 group-hover:text-slate-200 transition-colors">Log_0x{i}2</p>
                        <p className="text-[11px] font-mono text-slate-600 font-bold uppercase tracking-widest leading-none">OCT 2025</p>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-slate-700 text-sm group-hover:text-slate-200 transition-colors">download</span>
                  </div>
                ))}
                <button className="w-full py-3.5 mt-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-black rounded-2xl uppercase tracking-widest transition-all">
                  Full Registry Access
                </button>
              </div>
            </section>
          </div>

          {/* FULL WIDTH: Safety & Contraindications (Span 12) */}
          <section className="lg:col-span-12 space-y-6 pt-10 border-t border-white/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 shadow-lg">
                  <span className="material-symbols-outlined text-2xl">gpp_maybe</span>
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-200 tracking-tight">Safety & Interactions</h2>
                  <p className="text-[11px] text-slate-600 font-black uppercase tracking-[0.2em]">Global Safety Node Intelligence</p>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl">
                <span className="size-1.5 bg-red-500 rounded-full animate-ping"></span>
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest leading-none font-mono">Live Monitoring Active</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {interactions.map((inter, i) => (
                <div key={i} className={`group bg-slate-900/40 border rounded-[2rem] p-6 backdrop-blur-3xl shadow-xl transition-all hover:bg-slate-900/60 ${inter.risk === 'High' ? 'border-red-500/20 hover:border-red-500/40' : 'border-white/5 hover:border-white/10'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`size-3 rounded-full ${inter.risk === 'High' ? 'bg-red-500 shadow-[0_0_12px_#ef4444]' : 'bg-accent-amber shadow-[0_0_12px_#f59e0b]'}`}></div>
                      <h4 className="text-lg font-black text-slate-300 tracking-tight">{inter.agent}</h4>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[11px] font-black uppercase border ${inter.risk === 'High' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-accent-amber/10 text-accent-amber border-accent-amber/20'}`}>{inter.risk} RISK</span>
                  </div>
                  <p className="text-sm text-slate-400 font-medium leading-relaxed">{inter.description}</p>
                </div>
              ))}
            </div>
          </section>
        </Section>
      </PageContainer>
    </div>
  );
};

export default SubstanceMonograph;
