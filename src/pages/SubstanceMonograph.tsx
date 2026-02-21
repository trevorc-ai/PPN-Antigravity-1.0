import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SUBSTANCES, INTERACTION_RULES } from '../constants';
import { GoogleGenAI } from '@google/genai';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PageContainer } from '../components/layouts/PageContainer';
import { Section } from '../components/layouts/Section';
import { MonographHero } from '../components/substance/MonographHero';
import SubstanceRegistry from '../components/substance/SubstanceRegistry';
import AffinityRadar from '../components/substance/AffinityRadar';
import MechanismPanel from '../components/substance/MechanismPanel';
import ToxicityRiskPanel from '../components/substance/ToxicityRiskPanel';
import RiskTierBadge from '../components/substance/RiskTierBadge';

/* ─── AI grounding sources ──────────────────────────────────────── */
const ResearchSources: React.FC<{ chunks: any[] }> = ({ chunks }) => {
  const sources = chunks
    .filter(c => c.web?.uri)
    .map(c => ({ title: c.web.title || 'Clinical Research Source', uri: c.web.uri }));
  if (!sources.length) return null;
  return (
    <div className="mt-6 pt-5 border-t border-white/5 space-y-3">
      <h4 className="text-xs font-black text-indigo-400 uppercase tracking-[0.2em] flex items-center gap-2">
        <span className="material-symbols-outlined text-sm" aria-hidden="true">database</span>
        Grounded Research Nodes
      </h4>
      <div className="space-y-2">
        {sources.map((s, i) => (
          <a
            key={i}
            href={s.uri}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between gap-3 p-3 bg-slate-900/40 border border-slate-800 rounded-xl hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-all"
          >
            <span className="text-sm text-slate-300 font-medium truncate">{s.title}</span>
            <span className="material-symbols-outlined text-[14px] text-slate-600 group-hover:text-indigo-400 transition-colors shrink-0" aria-hidden="true">
              arrow_outward
            </span>
          </a>
        ))}
      </div>
    </div>
  );
};

/* ─── SubstanceMonograph ────────────────────────────────────────── */
/**
 * SubstanceMonograph — detail page for a single substance.
 *
 * This is a thin orchestrator. All section logic lives in dedicated components:
 *   MonographHero → identity + molecule display
 *   SubstanceRegistry → CAS, PK data
 *   AffinityRadar → Ki radar chart
 *   MechanismPanel → mechanism + therapeutic hypothesis + critical safety note
 *   ToxicityRiskPanel → toxicity, contraindications, screening checklist
 *   [inline] Clinical Velocity → efficacy trend chart
 *   [inline] Neural Synthesis AI → Gemini grounded synthesis
 *   [inline] Interactions → drug-drug interaction cards
 */
const SubstanceMonograph: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [groundingChunks, setGroundingChunks] = useState<any[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const sub = useMemo(() => SUBSTANCES.find(s => s.id === id), [id]);

  const interactions = useMemo(() => {
    if (!sub) return [];
    return INTERACTION_RULES.filter(r => r.substance === sub.name).map(rule => ({
      agent: rule.interactor,
      risk: (rule.severity === 'Life-Threatening' || rule.severity === 'High') ? 'High' : 'Medium',
      severity: rule.severity,
      description: rule.description,
      mechanism: rule.mechanism,
      source: rule.source,
      sourceUrl: rule.sourceUrl,
    }));
  }, [sub]);

  const efficacyData = useMemo(() => {
    if (!sub) return [];
    if (!sub.historicalEfficacy?.length) {
      return [{ year: 'Baseline', val: 0.1 }, { year: 'Current', val: sub?.efficacy ?? 0.7 }];
    }
    return sub.historicalEfficacy.map((val, i) => ({
      year: i === 0 ? 'Initial' : i === sub.historicalEfficacy!.length - 1 ? 'Current' : `v${i}`,
      val,
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
        config: { tools: [{ googleSearch: {} }] },
      });
      setAiAnalysis(response.text || 'Failed to synthesize grounded data node.');
      setGroundingChunks(response.candidates?.[0]?.groundingMetadata?.groundingChunks || []);
    } catch {
      setAiAnalysis('Neural link error. Synthesis interrupted.');
    } finally {
      setIsAiLoading(false);
    }
  };

  /* Not found state */
  if (!sub) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-6">
        <span className="material-symbols-outlined text-7xl text-slate-800" aria-hidden="true">error</span>
        <div className="space-y-2">
          <h2 className="text-2xl font-black uppercase tracking-tight" style={{ color: '#A8B5D1' }}>
            Compound Not Found
          </h2>
          <p className="text-slate-500 text-base font-medium">
            The identifier <code className="font-mono">{id}</code> does not exist in the registry.
          </p>
        </div>
        <button
          onClick={() => navigate('/catalog')}
          className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold rounded-xl uppercase tracking-widest transition-all"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-gradient-to-b from-[#0a1628] via-[#0d1b2a] to-[#05070a] animate-in fade-in duration-700 pb-24 overflow-x-hidden">

      {/* SLOT 1 — Hero */}
      <MonographHero substance={sub} />

      <PageContainer width="wide" className="py-10">
        <Section spacing="default">

          {/* ── Two-column main layout ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* LEFT COLUMN — 8/12 */}
            <div className="lg:col-span-8 space-y-6">

              {/* SLOT 2 — Chemical Registry */}
              <SubstanceRegistry substance={sub} />

              {/* SLOT 3 — Mechanism of Action */}
              <MechanismPanel substance={sub} />

              {/* SLOT 4 — Clinical Velocity (efficacy trend) */}
              <section
                className="bg-slate-900/40 border border-white/5 rounded-[2rem] p-6 backdrop-blur-3xl shadow-2xl"
                aria-labelledby="velocity-heading"
                style={{ height: '320px' }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="size-8 rounded-lg flex items-center justify-center border shrink-0"
                    style={{ background: `${sub.color}15`, borderColor: `${sub.color}30`, color: sub.color }}
                  >
                    <span className="material-symbols-outlined text-lg" aria-hidden="true">trending_up</span>
                  </div>
                  <div>
                    <h3
                      id="velocity-heading"
                      className="text-[13px] font-black tracking-[0.2em] uppercase"
                      style={{ color: '#A8B5D1' }}
                    >
                      Clinical Velocity
                    </h3>
                    <p className="text-[11px] text-slate-600 font-black uppercase tracking-widest">
                      Efficacy validation trend across research phases
                    </p>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={efficacyData} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
                    <defs>
                      <linearGradient id={`grad-${sub.id}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={sub.color ?? '#6366f1'} stopOpacity={0.4} />
                        <stop offset="95%" stopColor={sub.color ?? '#6366f1'} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 10, fontWeight: 800 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 10, fontWeight: 800 }} domain={[0, 1]} />
                    <Tooltip
                      formatter={(v: number) => [`${Math.round(v * 100)}%`, 'Efficacy']}
                      contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="val"
                      stroke={sub.color ?? '#6366f1'}
                      strokeWidth={3}
                      fill={`url(#grad-${sub.id})`}
                      dot={{ r: 5, fill: sub.color ?? '#6366f1', strokeWidth: 0 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </section>
            </div>

            {/* RIGHT COLUMN — 4/12 */}
            <div className="lg:col-span-4 space-y-6">

              {/* SLOT 5 — Affinity Radar */}
              <AffinityRadar substance={sub} />

              {/* SLOT 6 — Neural Synthesis */}
              <section
                className="bg-indigo-600/5 border border-indigo-500/20 rounded-[2rem] p-6 shadow-2xl flex flex-col relative overflow-hidden"
                aria-labelledby="synthesis-heading"
              >
                <div className="absolute top-0 right-0 p-5 opacity-5 pointer-events-none" aria-hidden="true">
                  <span className="material-symbols-outlined text-7xl">psychology</span>
                </div>

                <div className="flex items-center gap-3 mb-6 relative z-10">
                  <div className="size-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                    <span className="material-symbols-outlined text-xl animate-pulse" aria-hidden="true">auto_awesome</span>
                  </div>
                  <div>
                    <h3 id="synthesis-heading" className="text-[13px] font-black text-indigo-300 uppercase tracking-[0.2em]">
                      Neural Synthesis
                    </h3>
                    <p className="text-[11px] font-mono text-indigo-500/60 uppercase tracking-widest">AI Grounded Analysis</p>
                  </div>
                </div>

                <div className="flex-1 relative z-10">
                  {isAiLoading ? (
                    <div className="py-10 flex flex-col items-center gap-3">
                      <div className="size-10 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" aria-label="Loading" />
                      <p className="text-sm font-black text-indigo-500/60 uppercase tracking-widest animate-pulse font-mono">
                        Accessing Grounded Registry…
                      </p>
                    </div>
                  ) : aiAnalysis ? (
                    <div className="animate-in fade-in slide-in-from-top-2 duration-500 space-y-3">
                      <p className="text-sm font-medium leading-relaxed text-slate-400 border-l-2 border-indigo-500/30 pl-4 italic">
                        "{aiAnalysis}"
                      </p>
                      <ResearchSources chunks={groundingChunks} />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-sm text-slate-500 font-medium leading-relaxed">
                        Run a neural synthesis to correlate {sub.name} with the latest grounded clinical
                        research from 2024–2025.
                      </p>
                      <button
                        onClick={runAiSynthesis}
                        className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-slate-100 text-sm font-black rounded-xl uppercase tracking-[0.2em] transition-all shadow-xl shadow-indigo-900/20 flex items-center justify-center gap-2 active:scale-95"
                        aria-label={`Run neural synthesis for ${sub.name}`}
                      >
                        <span className="material-symbols-outlined text-lg" aria-hidden="true">bolt</span>
                        Initialize Synthesis
                      </button>
                    </div>
                  )}
                </div>
              </section>
            </div>
          </div>

          {/* ── FULL WIDTH SLOTS ── */}

          {/* SLOT 7 — Toxicity & Risk Analysis */}
          <ToxicityRiskPanel substance={sub} />

          {/* SLOT 8 — Drug Interactions */}
          {interactions.length > 0 && (
            <section
              className="space-y-5 pt-2"
              aria-labelledby="interactions-heading"
            >
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
                    <span className="material-symbols-outlined text-xl" aria-hidden="true">gpp_maybe</span>
                  </div>
                  <div>
                    <h2
                      id="interactions-heading"
                      className="text-xl font-black tracking-tight"
                      style={{ color: '#A8B5D1' }}
                    >
                      Drug Interactions
                    </h2>
                    <p className="text-sm text-slate-600 font-black uppercase tracking-widest">
                      {interactions.length} documented interaction{interactions.length > 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                {sub.riskTier && <RiskTierBadge tier={sub.riskTier} size="md" />}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {interactions.map((inter, i) => (
                  <article
                    key={i}
                    className={`bg-slate-900/40 border rounded-[1.75rem] p-5 backdrop-blur-3xl shadow-xl transition-all hover:bg-slate-900/60 ${inter.risk === 'High' ? 'border-red-500/20 hover:border-red-500/40' : 'border-amber-500/15 hover:border-amber-500/30'
                      }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2.5">
                        <span
                          className="material-symbols-outlined text-lg shrink-0"
                          style={{ color: inter.risk === 'High' ? '#ef4444' : '#f59e0b' }}
                          aria-hidden="true"
                        >
                          {inter.risk === 'High' ? 'emergency' : 'warning'}
                        </span>
                        <h4 className="text-base font-black tracking-tight text-slate-200">
                          {inter.agent}
                        </h4>
                      </div>
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-widest border shrink-0 ${inter.risk === 'High'
                            ? 'bg-red-500/10 text-red-400 border-red-500/20'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          }`}
                      >
                        {inter.severity}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed mb-3">{inter.description}</p>
                    {inter.mechanism && (
                      <p className="text-xs text-slate-600 font-medium leading-snug border-t border-white/5 pt-2 mt-2">
                        <span className="font-bold text-slate-500">Mechanism:</span> {inter.mechanism}
                      </p>
                    )}
                    {inter.sourceUrl && (
                      <a
                        href={inter.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-slate-600 hover:text-slate-400 transition-colors mt-2"
                        aria-label={`View source: ${inter.source}`}
                      >
                        <span className="material-symbols-outlined text-[12px]" aria-hidden="true">open_in_new</span>
                        {inter.source}
                      </a>
                    )}
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* SLOT 9 — Clinical Archive placeholder */}
          <section
            className="bg-slate-900/20 border border-white/5 rounded-[2rem] p-6 text-center"
            aria-labelledby="archive-heading"
          >
            <span className="material-symbols-outlined text-4xl text-slate-800 mt-2" aria-hidden="true">
              folder_open
            </span>
            <h3
              id="archive-heading"
              className="text-sm font-black text-slate-600 uppercase tracking-widest mt-3"
            >
              Clinical Archive
            </h3>
            <p className="text-sm text-slate-600 font-medium mt-1">
              No clinical archive entries available for {sub.name} yet.
              Site-level data uploads will appear here.
            </p>
          </section>

        </Section>
      </PageContainer>
    </div>
  );
};

export default SubstanceMonograph;
