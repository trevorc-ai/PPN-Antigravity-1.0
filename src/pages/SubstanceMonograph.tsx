
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
import { SubstanceKiProfile } from '../types';

// ─── Citation sources from Gemini grounding ───────────────────────────────────
const ResearchSources: React.FC<{ chunks: any[] }> = ({ chunks }) => {
  if (!chunks || chunks.length === 0) return null;
  const sources = chunks
    .filter(chunk => chunk.web?.uri)
    .map(chunk => ({ title: chunk.web.title || 'Clinical Research Source', uri: chunk.web.uri }));
  if (sources.length === 0) return null;
  return (
    <div className="mt-6 pt-5 border-t border-white/5 space-y-3">
      <h4 className="text-xs font-semibold text-indigo-400 flex items-center gap-2">
        <span className="material-symbols-outlined text-sm">database</span>
        Verified Intelligence Nodes
      </h4>
      {sources.map((s, i) => (
        <a key={i} href={s.uri} target="_blank" rel="noopener noreferrer"
          className="group flex flex-col gap-1 bg-slate-900/40 p-3 rounded-xl border border-slate-800 hover:border-indigo-500/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-300 font-medium truncate">{s.title}</span>
            <span className="material-symbols-outlined text-xs text-slate-600 group-hover:text-indigo-400 transition-colors">arrow_outward</span>
          </div>
          <span className="text-xs font-mono text-slate-600 truncate">{s.uri}</span>
        </a>
      ))}
    </div>
  );
};

// ─── Ki radar normalisation: high affinity (low Ki nM) → high score ───────────
const normalizeKi = (ki: number): number => {
  if (ki >= 10000) return 2;
  return Math.max(Math.round(150 - Math.log10(ki) * 50), 5);
};

const buildRadarData = (kiProfile: SubstanceKiProfile) => [
  { subject: '5-HT2A', value: normalizeKi(kiProfile.ht2a), ki: kiProfile.ht2a, fullMark: 150 },
  { subject: '5-HT1A', value: normalizeKi(kiProfile.ht1a), ki: kiProfile.ht1a, fullMark: 150 },
  { subject: '5-HT2C', value: normalizeKi(kiProfile.ht2c), ki: kiProfile.ht2c, fullMark: 150 },
  { subject: 'D2', value: normalizeKi(kiProfile.d2), ki: kiProfile.d2, fullMark: 150 },
  { subject: 'SERT', value: normalizeKi(kiProfile.sert), ki: kiProfile.sert, fullMark: 150 },
  { subject: 'NMDA', value: normalizeKi(kiProfile.nmda), ki: kiProfile.nmda, fullMark: 150 },
];

// ─── Section wrapper card ─────────────────────────────────────────────────────
const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <section className={`bg-slate-900/40 border border-white/5 rounded-2xl p-6 backdrop-blur-xl shadow-xl ${className}`}>
    {children}
  </section>
);

const SectionLabel: React.FC<{ icon: string; label: string; badge?: React.ReactNode }> = ({ icon, label, badge }) => (
  <div className="flex items-center justify-between mb-5">
    <h3 className="text-sm font-semibold text-slate-400 flex items-center gap-3">
      <span className="material-symbols-outlined text-lg text-slate-500">{icon}</span>
      {label}
    </h3>
    {badge}
  </div>
);

// ─── Main component ───────────────────────────────────────────────────────────
const SubstanceMonograph: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [groundingChunks, setGroundingChunks] = useState<any[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [activeRadarIndex, setActiveRadarIndex] = useState(0);

  const sub = useMemo(() => SUBSTANCES.find(s => s.id === id), [id]);

  const interactions = useMemo(() => {
    if (!sub) return [];
    return INTERACTION_RULES.filter(r => r.substance === sub.name).map(rule => ({
      agent: rule.interactor,
      severity: rule.severity,
      isHigh: rule.severity === 'Life-Threatening' || rule.severity === 'High',
      description: rule.description,
    }));
  }, [sub]);

  const radarData = useMemo(() => {
    if (!sub?.kiProfile) return [];
    return buildRadarData(sub.kiProfile);
  }, [sub]);

  const efficacyData = useMemo(() => {
    if (!sub?.historicalEfficacy?.length) return [{ phase: 'Current', val: sub?.efficacy || 0 }];
    return sub.historicalEfficacy.map((val, i) => ({
      phase: i === 0 ? 'Initial' : i === sub.historicalEfficacy!.length - 1 ? 'Current' : `Phase ${i}`,
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
        model: 'gemini-2.0-flash',
        contents: prompt,
        config: { tools: [{ googleSearch: {} }] }
      });
      setAiAnalysis(response.text || 'Failed to synthesize grounded data node.');
      setGroundingChunks(response.candidates?.[0]?.groundingMetadata?.groundingChunks || []);
    } catch {
      setAiAnalysis('Neural link error. Synthesis interrupted.');
    } finally {
      setIsAiLoading(false);
    }
  };

  if (!sub) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-6">
        <span className="material-symbols-outlined text-7xl text-slate-800">error</span>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-300">Compound Not Found</h2>
          <p className="text-slate-500">The requested identifier does not exist in the registry.</p>
        </div>
        <button onClick={() => navigate('/catalog')}
          className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-xl transition-all">
          Return to Catalog
        </button>
      </div>
    );
  }

  const subColor = sub.color || '#64748b';
  const isAyahuasca = sub.id === 'AYA-7701';
  const isEsketamine = sub.id === 'ESK-3822';

  return (
    <div className="min-h-full bg-gradient-to-b from-[#080b14] via-[#060910] to-[#040609] animate-in fade-in duration-500 pb-24">

      {/* Hero */}
      <MonographHero substance={sub} />

      <PageContainer width="wide" className="py-10">
        <Section spacing="default" className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* ── LEFT COLUMN (8 cols) ─────────────────────────────────────────── */}
          <div className="lg:col-span-8 space-y-6">

            {/* ── SECTION 1: Pharmacological Registry ─── */}
            <Card>
              <SectionLabel icon="science" label="Pharmacological Registry"
                badge={<span className="text-xs font-mono text-slate-600">MOD_0x{id?.slice(-4)}</span>} />

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { label: 'CAS Registry', value: sub.cas },
                  { label: 'Molecular Weight', value: sub.molecularWeight },
                  { label: 'Formula', value: sub.formula },
                  { label: 'Drug Class', value: sub.class.charAt(0) + sub.class.slice(1).toLowerCase() },
                  { label: 'DEA Schedule', value: sub.schedule },
                  { label: 'Primary Route', value: sub.pkData?.primaryRoute || 'See monograph' },
                  { label: 'Bioavailability', value: sub.pkData?.bioavailability || 'Variable' },
                  { label: 'Half-Life', value: sub.pkData?.halfLife || 'Variable' },
                  { label: 'Tmax', value: sub.pkData?.tmax || 'Variable' },
                ].map((item, i) => (
                  <div key={i} className="p-3 bg-black/30 border border-white/5 rounded-xl hover:border-white/10 transition-colors">
                    <p className="text-xs text-slate-600 font-medium mb-1">{item.label}</p>
                    <p className="text-sm font-mono text-slate-300 break-words">{item.value}</p>
                  </div>
                ))}
              </div>

              {/* Esketamine: REMS notice */}
              {isEsketamine && (
                <div className="mt-4 p-4 bg-emerald-950/30 border border-emerald-700/30 rounded-xl flex items-start gap-3">
                  <span className="text-emerald-400 text-lg mt-0.5">✓</span>
                  <div className="text-sm text-emerald-400/90 space-y-1">
                    <p className="font-semibold">FDA Approved — REMS Program Required</p>
                    <p className="text-emerald-500/70 text-xs">Administered under direct clinical observation only. Patients cannot self-administer. 2-hour post-dose monitoring mandatory (Spravato® label).</p>
                  </div>
                </div>
              )}

              {/* Ayahuasca: combination note */}
              {isAyahuasca && (
                <div className="mt-4 p-4 bg-amber-950/20 border border-amber-700/20 rounded-xl">
                  <p className="text-xs font-semibold text-amber-400 mb-1">Combination Brew — Component Note</p>
                  <p className="text-xs text-amber-500/70 leading-relaxed">Active components: DMT (Psychotria viridis) + Harmine, Harmaline, THH β-carbolines (Banisteriopsis caapi). Registry values above describe the DMT component. β-carbolines enable oral bioavailability via MAO-A inhibition.</p>
                </div>
              )}
            </Card>

            {/* ── SECTION 2: Mechanism of Action ─── */}
            {(sub.mechanismText || sub.therapeuticHypothesis || sub.criticalSafetyNote) && (
              <Card>
                <SectionLabel icon="biotech" label="Mechanism of Action" />

                <div className="space-y-5">
                  {sub.mechanismText && (
                    <div className="space-y-1.5">
                      <h4 className="text-xs font-semibold text-slate-500">Primary Mechanism</h4>
                      <p className="text-sm text-slate-300 leading-relaxed">{sub.mechanismText}</p>
                    </div>
                  )}

                  {sub.therapeuticHypothesis && (
                    <div className="space-y-1.5 pt-2 border-t border-white/5">
                      <h4 className="text-xs font-semibold text-slate-500">Therapeutic Hypothesis</h4>
                      <p className="text-sm text-slate-300 leading-relaxed">{sub.therapeuticHypothesis}</p>
                    </div>
                  )}

                  {sub.criticalSafetyNote && (
                    <div className="p-4 bg-red-950/25 border border-red-700/25 rounded-xl space-y-1.5 mt-2">
                      <div className="flex items-center gap-2">
                        <span className="text-red-400" aria-hidden="true">⚠</span>
                        <h4 className="text-xs font-semibold text-red-400">Critical Safety Note</h4>
                      </div>
                      <p className="text-sm text-red-300/80 leading-relaxed">{sub.criticalSafetyNote}</p>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* ── SECTION 3: Toxicity & Risk Analysis ─── */}
            {(sub.toxicityHighlights || sub.absoluteContraindications || sub.requiredScreening) && (
              <Card>
                <SectionLabel icon="gpp_maybe" label="Toxicity & Risk Analysis"
                  badge={
                    sub.riskTier ? (
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border
                        ${sub.riskTier === 'CARDIAC RISK' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                          sub.riskTier === 'MAOI INTERACTION RISK' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                            sub.riskTier === 'FDA APPROVED · REMS' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                              sub.riskTier === 'DISSOCIATIVE PROTOCOL' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                'bg-slate-800 text-slate-400 border-slate-700'}`}>
                        {sub.riskTier === 'CARDIAC RISK' && '⚠ '}
                        {sub.riskTier === 'MAOI INTERACTION RISK' && '⚡ '}
                        {sub.riskTier === 'FDA APPROVED · REMS' && '✓ '}
                        {sub.riskTier}
                      </span>
                    ) : null
                  }
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  {sub.toxicityHighlights && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-semibold text-slate-500">Toxicity Highlights</h4>
                      <ul className="space-y-2">
                        {sub.toxicityHighlights.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                            <span className="text-slate-600 mt-0.5 shrink-0">•</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {sub.absoluteContraindications && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-semibold text-red-500/70">Absolute Contraindications</h4>
                      <ul className="space-y-2">
                        {sub.absoluteContraindications.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                            <span className="text-red-500/60 mt-0.5 shrink-0">✕</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {sub.requiredScreening && (
                  <div className="mt-5 pt-5 border-t border-white/5 space-y-3">
                    <h4 className="text-xs font-semibold text-slate-500">Required Pre-Session Screening</h4>
                    <div className="flex flex-wrap gap-2">
                      {sub.requiredScreening.map((item, i) => (
                        <span key={i} className="px-3 py-1.5 bg-slate-800/60 border border-slate-700/40 rounded-lg text-xs text-slate-300 font-medium">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            )}

            {/* ── SECTION 4: Clinical Velocity ─── */}
            <Card className="h-[360px] flex flex-col">
              <SectionLabel icon="trending_up" label="Efficacy Trend" />
              <div className="flex-1 w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={efficacyData} margin={{ top: 10, right: 10, left: -24, bottom: 0 }}>
                    <defs>
                      <linearGradient id="effGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={subColor} stopOpacity={0.4} />
                        <stop offset="95%" stopColor={subColor} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="phase" axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 11 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 11 }} domain={[0, 1]} tickFormatter={v => `${Math.round(v * 100)}%`} />
                    <Tooltip
                      formatter={(v: number) => [`${Math.round(v * 100)}%`, 'Network Baseline Efficacy']}
                      contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', fontSize: '13px' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="val"
                      stroke={subColor}
                      strokeWidth={3}
                      fill="url(#effGrad)"
                      dot={{ r: 5, fill: '#0f172a', stroke: subColor, strokeWidth: 2 }}
                      activeDot={{ r: 7, fill: subColor, stroke: '#fff', strokeWidth: 2 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 p-3 bg-slate-800/40 rounded-xl border border-slate-700/50 flex items-start gap-3">
                <span className="material-symbols-outlined text-sm text-indigo-400 mt-0.5">info</span>
                <p className="text-xs text-slate-400 leading-relaxed">
                  <strong className="text-slate-300 font-semibold">Network Benchmark:</strong> This trend represents the aggregated clinical efficacy baseline across the PPN network. Site-specific tuning will activate here automatically once your clinic begins tracking protocols for this compound.
                </p>
              </div>
            </Card>

            {/* ── SECTION 5: Drug Interactions ─── */}
            {interactions.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-red-500/70">gpp_maybe</span>
                  <h2 className="text-lg font-semibold text-slate-300">
                    Drug Interactions
                    <span className="ml-3 text-sm font-normal text-slate-500">
                      {interactions.length} documented
                    </span>
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {interactions.map((inter, i) => (
                    <div key={i} className={`p-5 rounded-2xl border transition-colors
                      ${inter.isHigh
                        ? 'bg-red-950/15 border-red-700/25 hover:border-red-600/40'
                        : 'bg-slate-900/40 border-white/5 hover:border-white/10'}`}>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-base font-semibold text-[#A8B5D1]">{inter.agent}</h4>
                        <span className={`px-2.5 py-1 rounded-md text-xs font-semibold border
                          ${inter.isHigh
                            ? 'bg-red-500/10 text-red-400 border-red-500/20'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                          {inter.isHigh ? '⚠ ' : '△ '}{inter.severity}
                        </span>
                      </div>
                      <p className="text-sm text-slate-400 leading-relaxed">{inter.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── RIGHT COLUMN (4 cols) ────────────────────────────────────────── */}
          <div className="lg:col-span-4 space-y-6">

            {/* ── SECTION 6: Receptor Affinity Radar ─── */}
            {radarData.length > 0 && (
              <Card className="relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a1220] to-[#060a12] opacity-50 z-0 pointer-events-none rounded-2xl" />
                <div className="relative z-10">
                  <SectionLabel icon="hexagon" label="Receptor Affinity Profile"
                    badge={<span className="px-2.5 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full text-xs font-semibold">Ki Binding</span>} />

                  <div className="h-64 -mx-2 relative cursor-crosshair">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart
                        cx="50%"
                        cy="50%"
                        outerRadius="72%"
                        data={radarData}
                        onMouseMove={(e: any) => {
                          if (e && e.activeTooltipIndex !== undefined) {
                            setActiveRadarIndex(e.activeTooltipIndex);
                          }
                        }}
                        onMouseLeave={() => setActiveRadarIndex(0)}
                      >
                        <PolarGrid stroke="#1e293b" />

                        <Radar
                          name="Depth"
                          dataKey={() => 150}
                          stroke="transparent"
                          fill="#0f172a"
                          fillOpacity={0.6}
                          isAnimationActive={false}
                        />

                        <PolarAngleAxis
                          dataKey="subject"
                          tick={(props: any) => {
                            const { x, y, payload } = props;
                            const dataItem = radarData.find((d: any) => d.subject === payload.value);
                            const ki = dataItem?.ki || 0;
                            const displayValue = ki >= 10000 ? 'No sig.' : `${ki} nM`;

                            // Adjust positioning slightly to give room
                            return (
                              <g transform={`translate(${x},${y})`}>
                                <text x={0} y={-4} textAnchor="middle" fill="#64748b" fontSize={10} fontWeight={800} className="uppercase tracking-wider">
                                  {payload.value}
                                </text>
                                <text x={0} y={10} textAnchor="middle" fill={subColor} fontSize={11} fontWeight={700}>
                                  {displayValue}
                                </text>
                              </g>
                            );
                          }}
                        />
                        <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />

                        <Radar
                          name={sub.name}
                          dataKey="value"
                          stroke={subColor}
                          fill={subColor}
                          fillOpacity={0.3}
                          strokeWidth={2}
                        />

                        <Tooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const ki = payload[0].payload.ki;
                              const subject = payload[0].payload.subject;
                              return (
                                <div className="bg-[#0f1218]/95 backdrop-blur-md border border-indigo-500/30 shadow-2xl shadow-indigo-500/20 rounded-xl p-3 min-w-[120px] flex flex-col items-center">
                                  <span className="text-[10px] font-black uppercase tracking-widest text-[#A8B5D1] mb-1">{subject} Receptor</span>
                                  {ki >= 10000 ? (
                                    <span className="text-xs font-bold text-slate-500 text-center">No sig. binding<br />(≥10k nM)</span>
                                  ) : (
                                    <div className="flex items-baseline gap-1">
                                      <span className="text-xl font-black" style={{ color: subColor }}>{ki}</span>
                                      <span className="text-[10px] font-bold text-slate-500 uppercase">nM</span>
                                    </div>
                                  )}
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                      </RadarChart>
                    </ResponsiveContainer>

                    {/* Dynamic Spoke Calculation */}
                    {(() => {
                      const maxRadius = 90; // Approx 72% of 128px (half of 256px h-64 height)
                      const activeData = radarData[activeRadarIndex] || radarData[0];
                      const spokeLength = (activeData.value / 150) * maxRadius;
                      const spokeAngle = -90 + (activeRadarIndex * (360 / radarData.length));

                      return (
                        <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center">
                          <div className="relative w-0 h-0">
                            {/* Center dot */}
                            <div className="absolute left-0 top-0 w-1.5 h-1.5 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 shadow-[0_0_8px_rgba(255,255,255,0.8)] z-20" />
                            {/* Dynamic Line */}
                            <div
                              className="absolute left-0 top-0 h-[1.5px] bg-white origin-left shadow-[0_0_8px_rgba(255,255,255,0.8)] z-10 transition-all duration-300 ease-out"
                              style={{
                                width: `${spokeLength}px`,
                                transform: `rotate(${spokeAngle}deg)`
                              }}
                            />
                            {/* End dot */}
                            <div
                              className="absolute w-2 h-2 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 shadow-[0_0_10px_rgba(255,255,255,1)] z-20 transition-all duration-300 ease-out"
                              style={{
                                left: `${spokeLength * Math.cos(spokeAngle * Math.PI / 180)}px`,
                                top: `${spokeLength * Math.sin(spokeAngle * Math.PI / 180)}px`
                              }}
                            />
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  <p className="text-xs text-slate-500 text-center mt-4 leading-relaxed bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                    <strong className="text-slate-400 font-semibold block mb-1">Ki Binding Affinity (nM)</strong>
                    Lower numerical value = stronger binding affinity.<br />Values ≥10,000 nM represent no significant binding.
                    {isAyahuasca && ' Values reflect DMT component only.'}
                  </p>
                </div>
              </Card>
            )}

            {/* ── SECTION 7: Neural Synthesis (AI) ─── */}
            <Card className="bg-indigo-950/10 border-indigo-500/10">
              <div className="flex items-center gap-3 mb-6">
                <div className="size-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                  <span className="material-symbols-outlined text-xl animate-pulse">auto_awesome</span>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-indigo-300">Neural Synthesis</h3>
                  <p className="text-xs text-indigo-500/60">Live research grounding</p>
                </div>
              </div>

              {isAiLoading ? (
                <div className="py-10 flex flex-col items-center gap-4">
                  <div className="size-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
                  <p className="text-xs text-indigo-500/60 animate-pulse">Accessing grounded registry…</p>
                </div>
              ) : aiAnalysis ? (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-500">
                  <p className="text-sm text-slate-300 leading-relaxed border-l-2 border-indigo-500/30 pl-4">
                    {aiAnalysis}
                  </p>
                  <ResearchSources chunks={groundingChunks} />
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Run a neural synthesis to correlate {sub.name} with the latest grounded clinical research from 2024–2025.
                  </p>
                  <button onClick={runAiSynthesis}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-2 active:scale-95">
                    <span className="material-symbols-outlined text-lg">bolt</span>
                    Initialize Synthesis
                  </button>
                </div>
              )}
            </Card>


          </div>

        </Section>
      </PageContainer>
    </div>
  );
};

export default SubstanceMonograph;
