
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SUBSTANCES, INTERACTION_RULES } from '../constants';
import { GoogleGenAI } from "@google/genai";
import {
  ResponsiveContainer, RadarChart, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Radar, Customized
} from 'recharts';
import { ChevronDown, ChevronLeft } from 'lucide-react';
import { SubstanceKiProfile } from '../types';

// ─── Ki radar normalisation: high affinity (low Ki nM) → high score ───────────
const normalizeKi = (ki: number): number => {
  if (ki >= 10000) return 2;
  return Math.max(Math.round(150 - Math.log10(ki) * 50), 5);
};

const buildRadarData = (kiProfile: SubstanceKiProfile) => {
  // If the substance has D1 data AND SERT is not significant, swap SERT for D1
  // This gives LSD-25's chart a meaningful 6th spoke instead of an empty SERT space
  const useDopamineD1 = kiProfile.d1 !== undefined && kiProfile.sert >= 10000;
  // If the substance has DAT data AND NMDA is not significant, swap NMDA for DAT
  // This gives MDMA's chart a meaningful 6th spoke (DAT) instead of the empty NMDA space
  const useDAT = kiProfile.dat !== undefined && kiProfile.nmda >= 10000;
  return [
    { subject: '5-HT2A', value: normalizeKi(kiProfile.ht2a), ki: kiProfile.ht2a, fullMark: 150 },
    { subject: '5-HT1A', value: normalizeKi(kiProfile.ht1a), ki: kiProfile.ht1a, fullMark: 150 },
    { subject: '5-HT2C', value: normalizeKi(kiProfile.ht2c), ki: kiProfile.ht2c, fullMark: 150 },
    { subject: 'D2', value: normalizeKi(kiProfile.d2), ki: kiProfile.d2, fullMark: 150 },
    useDopamineD1
      ? { subject: 'D1', value: normalizeKi(kiProfile.d1!), ki: kiProfile.d1!, fullMark: 150 }
      : { subject: 'SERT', value: normalizeKi(kiProfile.sert), ki: kiProfile.sert, fullMark: 150 },
    useDAT
      ? { subject: 'DAT', value: normalizeKi(kiProfile.dat!), ki: kiProfile.dat!, fullMark: 150 }
      : { subject: 'NMDA', value: normalizeKi(kiProfile.nmda), ki: kiProfile.nmda, fullMark: 150 },
  ];
};

const RECEPTOR_DESCRIPTIONS: Record<string, { role: string; clinicalNote: string }> = {
  '5-HT2A': { role: 'Serotonin 2A Receptor', clinicalNote: 'Primary driver of psychedelic effects. Agonism promotes neuroplasticity and altered perception.' },
  '5-HT1A': { role: 'Serotonin 1A Receptor', clinicalNote: 'Modulates anxiety and mood. Partial agonism associated with anxiolytic effects during sessions.' },
  '5-HT2C': { role: 'Serotonin 2C Receptor', clinicalNote: 'Influences appetite and impulsivity. Agonism linked to serotonin syndrome risk in SSRI combinations.' },
  'D2': { role: 'Dopamine D2 Receptor', clinicalNote: 'Modulates reward and psychosis risk. Relevance varies significantly by compound class.' },
  'D1': { role: 'Dopamine D1 Receptor', clinicalNote: 'Unique to ergolines like LSD. D1 agonism contributes to the energetic, stimulating, and analytical character of the LSD experience — absent in tryptamines.' },
  'SERT': { role: 'Serotonin Transporter', clinicalNote: 'Blocks serotonin reuptake. High affinity raises serotonin syndrome risk with concurrent SSRIs/SNRIs.' },
  'DAT': { role: 'Dopamine Transporter', clinicalNote: "MDMA's second major transporter target. DAT reversal releases presynaptic dopamine, contributing to euphoria and stimulant effects. Explains abuse potential and cardiovascular strain." },
  'NMDA': { role: 'NMDA Glutamate Receptor', clinicalNote: 'Antagonism produces dissociative states. Relevant for ketamine and PCP-class compounds.' },
};

// ─── Citation sources from Gemini grounding ───────────────────────────────────
const ResearchSources: React.FC<{ chunks: any[] }> = ({ chunks }) => {
  if (!chunks || chunks.length === 0) return null;
  const sources = chunks
    .filter(chunk => chunk.web?.uri)
    .map(chunk => ({ title: chunk.web.title || 'Clinical Research Source', uri: chunk.web.uri }));
  if (sources.length === 0) return null;
  return (
    <div className="mt-4 pt-4 border-t border-white/5 space-y-2">
      <h4 className="text-sm font-semibold text-indigo-400 flex items-center gap-2">
        <span className="material-symbols-outlined text-base">database</span>
        Verified Intelligence Nodes
      </h4>
      {sources.map((s, i) => (
        <a key={i} href={s.uri} target="_blank" rel="noopener noreferrer"
          className="group flex flex-col gap-1 bg-slate-900/40 p-3 rounded-xl border border-slate-800 hover:border-indigo-500/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-300 font-medium truncate">{s.title}</span>
            <span className="material-symbols-outlined text-sm text-slate-600 group-hover:text-indigo-400 transition-colors">arrow_outward</span>
          </div>
          <span className="text-sm font-mono text-slate-600 truncate">{s.uri}</span>
        </a>
      ))}
    </div>
  );
};

// ─── Accordion panel ──────────────────────────────────────────────────────────
interface AccordionPanelProps {
  id: string;
  icon: string;
  title: string;
  teaser: string;
  isOpen: boolean;
  onToggle: () => void;
  accentColor?: string;
  children: React.ReactNode;
}

const AccordionPanel: React.FC<AccordionPanelProps> = ({
  icon, title, teaser, isOpen, onToggle, accentColor = '#475569', children
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(isOpen ? contentRef.current.scrollHeight : 0);
    }
  }, [isOpen, children]);

  return (
    <div className={`border border-white/5 rounded-2xl overflow-hidden transition-all duration-200 ${isOpen ? 'bg-slate-900/60' : 'bg-slate-900/30 hover:bg-slate-900/50'}`}>
      <div className="flex">
        {/* Left accent bar */}
        <div className="w-1 flex-shrink-0 rounded-l-2xl transition-all duration-200" style={{ backgroundColor: isOpen ? accentColor : 'transparent' }} />
        <div className="flex-1">
          {/* Header — tap anywhere to toggle */}
          <button
            onClick={onToggle}
            className="w-full flex items-center justify-between gap-4 px-5 py-5 text-left"
            aria-expanded={isOpen}
          >
            <div className="flex items-center gap-4 min-w-0">
              <span
                className="material-symbols-outlined text-2xl flex-shrink-0"
                style={{ color: isOpen ? accentColor : '#64748b' }}
              >{icon}</span>
              <div className="min-w-0">
                {/* TITLE: doubled size + black weight */}
                <p className="text-xl font-black leading-tight" style={{ color: '#A8B5D1' }}>{title}</p>
                {!isOpen && (
                  <p className="text-sm text-slate-500 mt-1 truncate">{teaser}</p>
                )}
              </div>
            </div>
            <ChevronDown
              className="w-5 h-5 flex-shrink-0 text-slate-500 transition-transform duration-200"
              style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
            />
          </button>

          {/* Animated content */}
          <div style={{ height: `${height}px`, overflow: 'hidden', transition: 'height 200ms ease-out' }}>
            <div ref={contentRef} className="px-6 pb-6">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────
const SubstanceMonograph: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [groundingChunks, setGroundingChunks] = useState<any[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [openPanel, setOpenPanel] = useState<string | null>('mechanism');
  const chartRef = useRef<HTMLDivElement>(null);
  const [chartDims, setChartDims] = useState({ width: 0, height: 0 });

  // Measure chart container for spoke line overlay
  useEffect(() => {
    if (!chartRef.current) return;
    const obs = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      setChartDims({ width, height });
    });
    obs.observe(chartRef.current);
    return () => obs.disconnect();
  }, []);

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

  // Active receptor state — defaults to first spoke (5-HT2A), updates on hover
  const [activeReceptor, setActiveReceptor] = useState<typeof radarData[0] | null>(null);
  // Reset to first spoke whenever substance changes
  useEffect(() => {
    setActiveReceptor(radarData.length > 0 ? radarData[0] : null);
  }, [sub?.id, radarData.length]);

  const displayReceptor = activeReceptor ?? (radarData.length > 0 ? radarData[0] : null);

  const runAiSynthesis = async () => {
    if (!sub) return;
    setIsAiLoading(true);
    setAiAnalysis(null);
    setGroundingChunks([]);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Synthesize a high-fidelity, technical clinical dossier summary for ${sub.name} (${sub.chemicalName}). Use Google Search to find recent (2024-2025) clinical trials, new pharmacology breakthroughs, and current legal/regulatory changes.`;
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

  const togglePanel = (panelId: string) => {
    setOpenPanel(prev => prev === panelId ? null : panelId);
  };

  if (!sub) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-6">
        <span className="material-symbols-outlined text-7xl text-slate-800">error</span>
        <h2 className="text-2xl font-bold text-slate-300">Compound Not Found</h2>
        <p className="text-base text-slate-500">The requested identifier does not exist in the registry.</p>
        <button onClick={() => navigate('/catalog')}
          className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-base font-medium rounded-xl transition-all">
          Return to Catalog
        </button>
      </div>
    );
  }

  const subColor = sub.color || '#64748b';
  const isAyahuasca = sub.id === 'AYA-7701';
  const isEsketamine = sub.id === 'ESK-3822';

  // Derive affinity label + color for the stationary panel
  const getAffinityMeta = (ki: number) => {
    if (ki >= 10000) return { label: 'No significant binding', color: '#64748b' };
    if (ki <= 50) return { label: 'High affinity', color: '#34d399' };
    if (ki <= 500) return { label: 'Moderate affinity', color: '#fbbf24' };
    return { label: 'Low affinity', color: '#f87171' };
  };

  return (
    <div className="min-h-full bg-gradient-to-b from-[#080b14] via-[#060910] to-[#040609] animate-in fade-in duration-500 pb-24">

      {/* ── TOP NAV ─────────────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-20 bg-[#080b14]/90 backdrop-blur-md border-b border-white/5 px-4 sm:px-6 py-3 flex items-center gap-4">
        <button
          onClick={() => navigate('/catalog')}
          className="flex items-center gap-1.5 text-slate-500 hover:text-slate-300 transition-colors text-sm font-semibold"
        >
          <ChevronLeft className="w-4 h-4" />
          Substance Library
        </button>
        <div className="h-4 w-px bg-slate-800" />
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-600 font-semibold uppercase tracking-widest hidden sm:block">Viewing:</span>
          <select
            value={sub.id}
            onChange={e => navigate(`/monograph/${e.target.value}`)}
            className="bg-slate-800/80 border border-slate-700/60 text-slate-200 text-sm font-bold rounded-xl px-3 py-1.5 focus:outline-none focus:border-indigo-500/60 transition-all cursor-pointer"
            aria-label="Switch substance"
          >
            {SUBSTANCES.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
        {sub.riskTier && (
          <span className={`ml-auto hidden sm:inline-flex px-3 py-1 rounded-full text-sm font-semibold border
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
        )}
      </div>

      {/* ── ABOVE-FOLD HERO ─────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

          {/* LEFT: Identity + key stats */}
          <div className="space-y-6">
            {/* Name + image */}
            <div className="flex items-center gap-5">
              {sub.imageUrl && (
                <div className="w-24 h-24 bg-black rounded-2xl flex-shrink-0 flex items-center justify-center overflow-hidden border border-white/5">
                  <img src={sub.imageUrl} alt={`${sub.name} molecular structure`} className="w-20 h-20 object-contain" />
                </div>
              )}
              <div>
                <h1 className="text-4xl sm:text-5xl font-black text-[#A8B5D1] tracking-tight leading-tight">{sub.name}</h1>
                <p className="text-base text-slate-500 mt-1">{sub.chemicalName}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="px-3 py-1.5 rounded-md text-sm font-semibold border bg-indigo-900/40 text-indigo-300 border-indigo-700/40">{sub.phase}</span>
                  <span className="px-3 py-1.5 rounded-md text-sm font-medium border bg-slate-800/60 text-slate-400 border-slate-700/40">{sub.class.charAt(0) + sub.class.slice(1).toLowerCase()}</span>
                  <span className={`px-3 py-1.5 rounded-md text-sm font-semibold border ${sub.schedule === 'Schedule I' ? 'bg-red-900/50 text-red-300 border-red-700/40' : 'bg-blue-900/50 text-blue-300 border-blue-700/40'}`}>{sub.schedule}</span>
                </div>
              </div>
            </div>

            {/* Key clinical stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: 'Primary Route', value: sub.pkData?.primaryRoute || '—' },
                { label: 'Onset', value: sub.pkData?.tmax || '—' },
                { label: 'Half-Life', value: sub.pkData?.halfLife || '—' },
                { label: 'Bioavailability', value: sub.pkData?.bioavailability || '—' },
                { label: 'DEA Schedule', value: sub.schedule },
                { label: 'CAS Registry', value: sub.cas },
              ].map((item, i) => (
                <div key={i} className="p-4 bg-black/30 border border-white/5 rounded-xl hover:border-white/10 transition-colors">
                  <p className="text-sm text-slate-500 font-medium mb-1">{item.label}</p>
                  <p className="text-base font-mono font-bold text-slate-200 break-words">{item.value}</p>
                </div>
              ))}
            </div>



            {/* REMS / Ayahuasca notices */}
            {isEsketamine && (
              <div className="p-4 bg-emerald-950/30 border border-emerald-700/30 rounded-xl flex items-start gap-3">
                <span className="text-emerald-400 text-xl mt-0.5">✓</span>
                <div className="space-y-1">
                  <p className="text-base font-semibold text-emerald-400">FDA Approved — REMS Program Required</p>
                  <p className="text-sm text-emerald-500/70">Administered under direct clinical observation only. 2-hour post-dose monitoring mandatory (Spravato® label).</p>
                </div>
              </div>
            )}
            {isAyahuasca && (
              <div className="p-4 bg-amber-950/20 border border-amber-700/20 rounded-xl">
                <p className="text-sm font-semibold text-amber-400 mb-1">Combination Brew — Component Note</p>
                <p className="text-sm text-amber-500/70 leading-relaxed">Active components: DMT + β-carbolines (Harmine, Harmaline, THH). Values below describe the DMT component. β-carbolines enable oral bioavailability via MAO-A inhibition.</p>
              </div>
            )}
          </div>

          {/* RIGHT: Receptor Affinity Radar — stationary info panel */}
          <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a1220] to-[#060a12] opacity-50 pointer-events-none rounded-2xl" />
            <div className="relative z-10">
              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold text-slate-400 flex items-center gap-3">
                  <span className="material-symbols-outlined text-2xl text-slate-500">hexagon</span>
                  Receptor Affinity Profile
                </h2>
                <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full text-sm font-semibold">Ki Binding</span>
              </div>

              {radarData.length > 0 ? (
                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  {/* Spider graph */}
                  <div
                    ref={chartRef}
                    className="flex-1 h-64 sm:h-72 cursor-crosshair min-w-0 relative"
                    onMouseLeave={() => setActiveReceptor(radarData[0])}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart
                        key={sub.id}
                        cx="50%" cy="50%" outerRadius="70%"
                        data={radarData}
                      >
                        <PolarGrid stroke="#1e293b" />
                        <Radar name="Depth" dataKey={() => 150} stroke="transparent" fill="#0f172a" fillOpacity={0.6} isAnimationActive={false} />
                        <PolarAngleAxis
                          dataKey="subject"
                          tick={(props: any) => {
                            const { x, y, payload } = props;
                            const dataItem = radarData.find((d: any) => d.subject === payload.value);
                            const ki = dataItem?.ki || 0;
                            const isActive = displayReceptor?.subject === payload.value;
                            const displayValue = ki >= 10000 ? 'No sig.' : `${ki} nM`;
                            return (
                              <g
                                transform={`translate(${x},${y})`}
                                onMouseEnter={() => dataItem && setActiveReceptor(dataItem)}
                                style={{ cursor: 'pointer' }}
                              >
                                {/* Highlight pill behind active label */}
                                {isActive && (
                                  <rect x={-45} y={-24} width={90} height={42} rx={8} fill={subColor} fillOpacity={0.15} />
                                )}
                                <text x={0} y={-6} textAnchor="middle" fill={isActive ? '#a5b4fc' : '#64748b'} fontSize={18} fontWeight={isActive ? 900 : 700}>{payload.value}</text>
                                <text x={0} y={12} textAnchor="middle" fill={isActive ? subColor : '#475569'} fontSize={16} fontWeight={700}>{displayValue}</text>
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
                          isAnimationActive={true}
                          animationDuration={600}
                          animationEasing="ease-out"
                          dot={(props: any) => {
                            const item = radarData[props.index];
                            const isActive = item?.subject === displayReceptor?.subject;
                            return isActive ? (
                              <circle
                                key={`dot-active-${props.index}`}
                                cx={props.cx} cy={props.cy}
                                r={8} fill={subColor} stroke="white" strokeWidth={2}
                                style={{ filter: `drop-shadow(0 0 6px ${subColor})` }}
                              />
                            ) : (
                              <circle
                                key={`dot-${props.index}`}
                                cx={props.cx} cy={props.cy}
                                r={3} fill={subColor} fillOpacity={0.5}
                              />
                            );
                          }}
                        />
                      </RadarChart>
                    </ResponsiveContainer>

                    {/* Spoke line — SVG overlay, always on top */}
                    {chartDims.width > 0 && displayReceptor && (() => {
                      const cx = chartDims.width / 2;
                      const cy = chartDims.height / 2;
                      const r = Math.min(chartDims.width, chartDims.height) * 0.5 * 0.7;
                      const activeIndex = radarData.findIndex((d: any) => d.subject === displayReceptor.subject);
                      if (activeIndex === -1) return null;
                      const angleDeg = 90 - activeIndex * (360 / radarData.length);
                      const angleRad = angleDeg * (Math.PI / 180);
                      const x2 = cx + r * Math.cos(angleRad);
                      const y2 = cy - r * Math.sin(angleRad);
                      return (
                        <svg
                          className="absolute inset-0 w-full h-full pointer-events-none"
                          style={{ zIndex: 10 }}
                        >
                          <line
                            x1={cx} y1={cy}
                            x2={x2} y2={y2}
                            stroke="white"
                            strokeWidth={2}
                            strokeOpacity={0.7}
                            strokeLinecap="round"
                          />
                        </svg>
                      );
                    })()}
                  </div>

                  {/* Stationary info panel — always visible, updates on hover */}
                  {displayReceptor && (() => {
                    const ki = displayReceptor.ki;
                    const subject = displayReceptor.subject;
                    const desc = RECEPTOR_DESCRIPTIONS[subject];
                    const { label: affinityLabel, color: affinityColor } = getAffinityMeta(ki);
                    return (
                      <div className="sm:w-[200px] flex-shrink-0 bg-[#0c1220]/80 border border-indigo-500/20 rounded-2xl p-4 space-y-3 transition-all duration-200">
                        <p className="text-xs font-black uppercase tracking-widest text-indigo-400">{desc?.role ?? subject}</p>
                        {ki >= 10000 ? (
                          <p className="text-base font-bold text-slate-500">No sig. binding<br />(≥10,000 nM)</p>
                        ) : (
                          <div className="space-y-1">
                            <div className="flex items-baseline gap-1.5">
                              <span className="text-3xl font-black" style={{ color: subColor }}>{ki}</span>
                              <span className="text-sm font-bold text-slate-500 uppercase">nM Ki</span>
                            </div>
                            <span
                              className="inline-block text-sm font-bold px-2 py-0.5 rounded"
                              style={{ color: affinityColor, backgroundColor: `${affinityColor}20` }}
                            >{affinityLabel}</span>
                          </div>
                        )}
                        {desc && (
                          <p className="text-sm text-slate-400 leading-relaxed border-t border-slate-700/40 pt-2">{desc.clinicalNote}</p>
                        )}
                        <p className="text-xs text-slate-600 italic">Hover axes to explore</p>
                      </div>
                    );
                  })()}
                </div>
              ) : (
                <div className="h-48 flex items-center justify-center">
                  <p className="text-base text-slate-600">Ki binding data not available for this compound.</p>
                </div>
              )}

              <p className="text-sm text-slate-500 text-center mt-4 leading-relaxed">
                Lower Ki = stronger binding.{isAyahuasca && ' DMT component values only.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── ACCORDION SECTIONS ──────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-8 space-y-2">

        {/* 1. Mechanism of Action */}
        {(sub.mechanismText || sub.therapeuticHypothesis || sub.criticalSafetyNote) && (
          <AccordionPanel
            id="mechanism" icon="biotech" title="Mechanism of Action"
            teaser="How this substance works in the brain"
            isOpen={openPanel === 'mechanism'}
            onToggle={() => togglePanel('mechanism')}
            accentColor="#6366f1"
          >
            <div className="space-y-5 pt-1">
              {sub.mechanismText && (
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Primary Mechanism</h4>
                  <p className="text-base text-slate-300 leading-relaxed">{sub.mechanismText}</p>
                </div>
              )}
              {sub.therapeuticHypothesis && (
                <div className="space-y-2 pt-4 border-t border-white/5">
                  <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Therapeutic Hypothesis</h4>
                  <p className="text-base text-slate-300 leading-relaxed">{sub.therapeuticHypothesis}</p>
                </div>
              )}
              {sub.criticalSafetyNote && (
                <div className="p-4 bg-red-950/25 border border-red-700/25 rounded-xl space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-red-400 text-lg" aria-hidden="true">⚠</span>
                    <h4 className="text-sm font-bold text-red-400">[STATUS: CAUTION] Critical Safety Note</h4>
                  </div>
                  <p className="text-base text-red-300/80 leading-relaxed">{sub.criticalSafetyNote}</p>
                </div>
              )}
            </div>
          </AccordionPanel>
        )}

        {/* 2. Safety & Contraindications */}
        {(sub.toxicityHighlights || sub.absoluteContraindications || sub.requiredScreening) && (
          <AccordionPanel
            id="safety" icon="gpp_maybe" title="Safety & Contraindications"
            teaser="Known interactions, risk flags, and required screening"
            isOpen={openPanel === 'safety'}
            onToggle={() => togglePanel('safety')}
            accentColor="#ef4444"
          >
            <div className="space-y-6 pt-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sub.toxicityHighlights && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Toxicity Highlights</h4>
                    <ul className="space-y-2">
                      {sub.toxicityHighlights.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-base text-slate-300">
                          <span className="text-slate-600 mt-1 shrink-0">•</span>{item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {sub.absoluteContraindications && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-bold text-red-500/70 uppercase tracking-widest">Absolute Contraindications</h4>
                    <ul className="space-y-2">
                      {sub.absoluteContraindications.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-base text-slate-300">
                          <span className="text-red-500/60 mt-0.5 shrink-0">✕</span>{item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              {sub.requiredScreening && (
                <div className="pt-4 border-t border-white/5 space-y-3">
                  <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Required Pre-Session Screening</h4>
                  <div className="flex flex-wrap gap-2">
                    {sub.requiredScreening.map((item, i) => (
                      <span key={i} className="px-3 py-2 bg-slate-800/60 border border-slate-700/40 rounded-lg text-sm text-slate-300 font-medium">{item}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </AccordionPanel>
        )}

        {/* 3. Drug Interactions */}
        {interactions.length > 0 && (
          <AccordionPanel
            id="interactions" icon="medication"
            title={`Drug Interactions (${interactions.length} documented)`}
            teaser="Documented interactions with other substances and medications"
            isOpen={openPanel === 'interactions'}
            onToggle={() => togglePanel('interactions')}
            accentColor="#f59e0b"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {interactions.map((inter, i) => (
                <div key={i} className={`p-4 rounded-xl border transition-colors
                  ${inter.isHigh ? 'bg-red-950/15 border-red-700/25' : 'bg-slate-900/40 border-white/5'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-base font-bold text-[#A8B5D1]">{inter.agent}</h4>
                    <span className={`px-2 py-0.5 rounded text-sm font-semibold border
                      ${inter.isHigh ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                      {inter.isHigh ? '⚠ ' : '△ '}{inter.severity}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed">{inter.description}</p>
                </div>
              ))}
            </div>
          </AccordionPanel>
        )}

        {/* 4. Clinical Efficacy Trend */}
        {(sub.historicalEfficacy?.length || sub.efficacy) && (
          <AccordionPanel
            id="efficacy" icon="trending_up" title="Clinical Efficacy Trend"
            teaser="Longitudinal outcome data across the PPN network"
            isOpen={openPanel === 'efficacy'}
            onToggle={() => togglePanel('efficacy')}
            accentColor="#22c55e"
          >
            <div className="pt-2 space-y-3">
              {sub.historicalEfficacy && sub.historicalEfficacy.length > 1 ? (
                <div className="space-y-3">
                  {sub.historicalEfficacy.map((val, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-sm text-slate-500 w-24 flex-shrink-0">
                        {i === 0 ? 'Initial' : i === sub.historicalEfficacy!.length - 1 ? 'Current' : `Phase ${i}`}
                      </span>
                      <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${val * 100}%`, background: subColor }} />
                      </div>
                      <span className="text-sm font-mono font-bold text-slate-400 w-10 text-right">{(val * 100).toFixed(0)}%</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <span className="text-sm text-slate-500">Current Network Baseline</span>
                  <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${sub.efficacy * 100}%`, background: subColor }} />
                  </div>
                  <span className="text-sm font-mono font-bold text-slate-400">{(sub.efficacy * 100).toFixed(0)}%</span>
                </div>
              )}
              <p className="text-sm text-slate-500 italic">Aggregated network baseline — site-specific data activates when your clinic begins tracking this compound.</p>
            </div>
          </AccordionPanel>
        )}

        {/* 5. Technical Data (for nerds) */}
        <AccordionPanel
          id="technical" icon="science" title="Technical Data"
          teaser="Molecular weight, formula, CAS number, and pharmacokinetic parameters"
          isOpen={openPanel === 'technical'}
          onToggle={() => togglePanel('technical')}
          accentColor="#8b5cf6"
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
            {[
              { label: 'CAS Registry', value: sub.cas },
              { label: 'Molecular Weight', value: sub.molecularWeight },
              { label: 'Formula', value: sub.formula },
              { label: 'Drug Class', value: sub.class.charAt(0) + sub.class.slice(1).toLowerCase() },
              { label: 'DEA Schedule', value: sub.schedule },
              { label: 'Primary Route', value: sub.pkData?.primaryRoute || '—' },
              { label: 'Bioavailability', value: sub.pkData?.bioavailability || '—' },
              { label: 'Half-Life', value: sub.pkData?.halfLife || '—' },
              { label: 'Tmax', value: sub.pkData?.tmax || '—' },
            ].map((item, i) => (
              <div key={i} className="p-3 bg-black/30 border border-white/5 rounded-xl hover:border-white/10 transition-colors">
                <p className="text-sm text-slate-500 font-medium mb-1">{item.label}</p>
                <p className="text-base font-mono font-bold text-slate-200 break-words">{item.value}</p>
              </div>
            ))}
          </div>
        </AccordionPanel>

        {/* 6. Neural Synthesis (AI) */}
        <AccordionPanel
          id="ai" icon="auto_awesome" title="Neural Synthesis"
          teaser="Live research grounding via Gemini — recent clinical trials and regulatory updates"
          isOpen={openPanel === 'ai'}
          onToggle={() => togglePanel('ai')}
          accentColor="#6366f1"
        >
          <div className="pt-2">
            {isAiLoading ? (
              <div className="py-8 flex flex-col items-center gap-4">
                <div className="size-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
                <p className="text-sm text-indigo-500/60 animate-pulse">Accessing grounded registry…</p>
              </div>
            ) : aiAnalysis ? (
              <div className="space-y-4 animate-in fade-in duration-500">
                <p className="text-base text-slate-300 leading-relaxed border-l-2 border-indigo-500/30 pl-4">{aiAnalysis}</p>
                <ResearchSources chunks={groundingChunks} />
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-base text-slate-500 leading-relaxed">
                  Run a neural synthesis to correlate {sub.name} with the latest grounded clinical research from 2024–2025.
                </p>
                <button onClick={runAiSynthesis}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-base font-semibold rounded-xl transition-all flex items-center justify-center gap-2 active:scale-95">
                  <span className="material-symbols-outlined text-lg">bolt</span>
                  Initialize Synthesis
                </button>
              </div>
            )}
          </div>
        </AccordionPanel>

      </div>
    </div>
  );
};

export default SubstanceMonograph;
