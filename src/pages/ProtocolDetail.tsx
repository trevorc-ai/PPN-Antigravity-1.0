
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Tooltip, ResponsiveContainer, AreaChart, Area, ReferenceLine,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend,
  XAxis, YAxis, CartesianGrid
} from 'recharts';
import { PATIENTS } from '../constants';
import { Info, ChevronRight, HelpCircle } from 'lucide-react';
import { PageContainer } from '../components/layouts/PageContainer';
import { AdvancedTooltip } from '../components/ui/AdvancedTooltip';

const ProtocolDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Strict match against standardized IDs
  const record = PATIENTS.find(p => p.id === id);

  if (!record) {
    return (
      <div className="min-h-full bg-[#020408] flex items-center justify-center animate-in fade-in duration-500">
        <div className="text-center space-y-8">
          <div className="size-24 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto shadow-2xl">
            <span className="material-symbols-outlined text-5xl text-slate-700">person_off</span>
          </div>
          <div className="space-y-3">
            <h2 className="text-3xl font-black text-slate-300 uppercase tracking-widest leading-none">Record Not Found</h2>
            <p className="text-slate-3000 font-mono text-base uppercase tracking-widest">Registry_Node_Lookup: {id}</p>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-10 py-4 bg-primary hover:bg-blue-600 text-slate-300 text-sm font-black rounded-xl uppercase tracking-widest transition-all active:scale-95 shadow-xl shadow-primary/20"
          >
            Return to Registry
          </button>
        </div>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  // --- DERIVED DATA ---
  const demographicsString = `${record.demographics.age}yo ${record.demographics.sex} • ${record.demographics.weight}kg`;

  const settingIcon = record.context?.setting.toLowerCase().includes('home') ? 'home' :
    record.context?.setting.toLowerCase().includes('retreat') ? 'landscape' :
      'medical_services';

  const prepHours = record.context?.prepHours || 0;
  const integHours = record.context?.integrationHours || 0;
  const totalHours = prepHours + integHours;

  // Calculate Timeline Percentages (prevent div by zero)
  const prepPct = totalHours > 0 ? (prepHours / totalHours) * 100 : 0;
  const integPct = totalHours > 0 ? (integHours / totalHours) * 100 : 0;

  // --- SIMILAR CASE FINDER (COLLECTIVE INTELLIGENCE) ---
  const similarCases = PATIENTS.filter(p =>
    p.id !== record.id &&
    (p.protocol.substance === record.protocol.substance ||
      (Math.abs(p.demographics.age - record.demographics.age) <= 10 && p.demographics.sex === record.demographics.sex))
  ).slice(0, 3);

  // Enhance outcomes data for chart visualization if sparse
  const chartData = record.outcomes.length > 0 ? record.outcomes : [
    { date: 'Baseline', score: 0 },
    { date: 'Endpoint', score: 0 }
  ];

  return (
    <div className="min-h-full bg-[#020408] text-slate-300 p-4 sm:p-8 animate-in fade-in duration-700 relative overflow-hidden print:bg-white print:text-black print:p-0 print:overflow-visible font-sans">

      {/* Print-Specific Styles to force high contrast */}
      <style>{`
        @media print {
          @page { margin: 0.5cm; size: auto; }
          body { -webkit-print-color-adjust: exact; }
          .print-hidden { display: none !important; }
          /* Force Chart High Contrast */
          .recharts-cartesian-grid-horizontal line { stroke: #e2e8f0 !important; }
          .recharts-cartesian-grid-vertical line { display: none !important; }
          .recharts-text { fill: #000 !important; font-weight: bold !important; }
          path.recharts-curve { stroke: #000 !important; stroke-width: 2px !important; }
          .recharts-reference-line line { stroke: #000 !important; stroke-dasharray: 4 4 !important; }
        }
      `}</style>

      {/* Decorative Background (Hidden on Print) */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[180px] pointer-events-none print:hidden"></div>

      <PageContainer width="wide" className="!max-w-[1600px] space-y-8 relative z-10">

        {/* NAVIGATION HEADER (Hidden on Print) */}
        <div className="flex justify-between items-center print:hidden">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors group px-2 py-1"
          >
            <span className="material-symbols-outlined text-lg group-hover:-translate-x-1 transition-transform">arrow_back</span>
            <span className="text-xs font-bold uppercase tracking-widest">Back to Search</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 border border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-slate-200 rounded-lg transition-all text-xs font-black uppercase tracking-widest"
          >
            <span className="material-symbols-outlined text-lg">print</span>
            Print Record
          </button>
        </div>

        {/* IDENTITY HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 border-b border-white/5 pb-8 print:border-black/10">
          <div className="space-y-1">
            <div className="flex items-center gap-4">
              <h1 className="text-4xl font-black tracking-tight text-slate-200 print:text-black">
                {record.demographics.patientHash ? record.demographics.patientHash.substring(0, 12) + '...' : 'ANONYMOUS'}
              </h1>
              <span className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest border print:border-black print:text-black print:bg-transparent ${record.status === 'Active' ? 'bg-primary/20 text-primary border-primary/30' :
                'bg-slate-800 text-slate-400 border-slate-700'
                }`}>
                {record.status}
              </span>
            </div>
            <p className="text-slate-3000 text-sm font-bold tracking-widest uppercase print:text-slate-600">{demographicsString}</p>
          </div>

          <div className="print:hidden">
            <span className="text-[11px] font-mono text-slate-600 uppercase tracking-widest">Secure Node 0x7</span>
          </div>
        </div>

        {/* ASYMMETRIC GRID LAYOUT: 2/3 + 1/3 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT PANEL: The Clinical Journey (Span 2) */}
          <div className="lg:col-span-2 space-y-8">

            {/* NEW: Receptor Affinity Radar (Micro View) */}
            <section className="bg-[#0b0e14] border border-slate-800 rounded-[2.5rem] p-8 sm:p-10 shadow-2xl relative print:bg-white print:border-black/20 print:shadow-none print:rounded-xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="size-10 sm:size-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400 border border-purple-500/20 print:border-black print:text-black print:bg-transparent">
                  <span className="material-symbols-outlined text-2xl">hexagon</span>
                </div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-black text-slate-200 uppercase tracking-[0.2em] print:text-black">Receptor Affinity Profile</h3>
                  <AdvancedTooltip content="Comparative binding affinity logic: Target Substance vs. Endogenous Standard (Serotonin/Dopamine Baselne).">
                    <Info className="text-slate-600 hover:text-slate-200 transition-colors cursor-help print:hidden" size={16} />
                  </AdvancedTooltip>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                <div className="md:col-span-1 space-y-4">
                  <p className="text-sm font-bold text-slate-400 leading-relaxed print:text-black">
                    <span className="text-slate-300 print:text-black">Micro-Pharmacology Analysis:</span> Visualizing the binding potency across critical safety and efficacy targets.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3">
                      <div className="size-2 rounded-full bg-blue-500"></div>
                      <span className="text-[11px] font-black text-slate-300 uppercase tracking-widest print:text-black">{record.protocol.substance} (Target)</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="size-2 rounded-full bg-slate-600"></div>
                      <span className="text-[11px] font-black text-slate-3000 uppercase tracking-widest print:text-black">Standard (Baseline)</span>
                    </li>
                  </ul>
                  <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-2xl mt-4 print:bg-white print:border-black">
                    <span className="block text-[11px] font-black text-purple-400 uppercase tracking-widest mb-1 print:text-black">Primary Mechanism</span>
                    <span className="text-xs font-bold text-slate-300 print:text-black">5-HT2A Agonism (Psychedelic)</span>
                  </div>
                </div>

                <div className="md:col-span-2 h-[300px] w-full bg-slate-900/30 rounded-3xl border border-slate-800 p-2 print:bg-white print:border-gray-200">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={[
                      { subject: '5-HT2A (Psych)', A: 120, B: 100, fullMark: 150 },
                      { subject: '5-HT2B (Cardio)', A: record.protocol.substance === 'MDMA' ? 110 : 40, B: 90, fullMark: 150 },
                      { subject: 'D2 (Dopamine)', A: 80, B: 110, fullMark: 150 },
                      { subject: 'Adrenergic (HR)', A: 95, B: 90, fullMark: 150 },
                      { subject: 'SERT', A: record.protocol.substance === 'MDMA' ? 140 : 60, B: 85, fullMark: 150 },
                      { subject: 'NMDA', A: record.protocol.substance === 'Ketamine' ? 130 : 20, B: 50, fullMark: 150 },
                    ]}>
                      <PolarGrid stroke="#334155" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                      <Radar name={record.protocol.substance} dataKey="A" stroke="#8b5cf6" strokeWidth={3} fill="#8b5cf6" fillOpacity={0.5} />
                      <Radar name="Standard" dataKey="B" stroke="#475569" strokeWidth={2} fill="#475569" fillOpacity={0.1} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', color: '#fff' }}
                        itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </section>

            {/* CARD 2: Therapeutic Envelope */}
            <section className="bg-[#0b0e14] border border-slate-800 rounded-[2.5rem] p-8 sm:p-10 shadow-2xl overflow-hidden relative print:bg-white print:border-black/20 print:shadow-none print:rounded-xl">
              <div className="flex items-center gap-4 mb-8">
                <div className="size-10 sm:size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 print:border-black print:text-black print:bg-transparent">
                  <span className="material-symbols-outlined text-2xl">psychology_alt</span>
                </div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-black text-slate-200 uppercase tracking-[0.2em] print:text-black">Therapeutic Envelope</h3>
                  <AdvancedTooltip content="Environmental setting, support staff ratio, and integration time allocation.">
                    <Info className="text-slate-600 hover:text-slate-200 transition-colors cursor-help print:hidden" size={16} />
                  </AdvancedTooltip>
                </div>
              </div>

              <div className="space-y-10">
                {/* Setting & Support Big Blocks */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-3xl space-y-2 print:bg-gray-50 print:border-gray-200">
                    <div className="flex items-center gap-3 text-slate-3000 mb-2 print:text-black">
                      <span className="material-symbols-outlined text-xl">{settingIcon}</span>
                      <span className="text-sm font-bold uppercase tracking-widest">Environment</span>
                    </div>
                    <p className="text-xl font-bold text-slate-300 print:text-black">{record.context?.setting || 'Not Specified'}</p>
                  </div>
                  <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-3xl space-y-2 print:bg-gray-50 print:border-gray-200">
                    <div className="flex items-center gap-3 text-slate-3000 mb-2 print:text-black">
                      <span className="material-symbols-outlined text-xl">group</span>
                      <span className="text-sm font-bold uppercase tracking-widest">Support Ratio</span>
                    </div>
                    <p className="text-xl font-bold text-slate-300 print:text-black">{record.context?.supportRatio || 'Unsupervised'}</p>
                  </div>
                </div>

                {/* The Timeline Bar */}
                <div className="space-y-4">
                  <div className="flex justify-between items-end px-1">
                    <span className="text-sm font-bold text-slate-3000 uppercase tracking-widest print:text-black">Integration Timeline</span>
                    <span className="text-sm font-mono font-bold text-slate-300 print:text-black">Total Contact: {totalHours}h</span>
                  </div>
                  <div className="h-14 w-full flex rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-inner print:bg-gray-100 print:border-gray-300">
                    {prepHours > 0 && (
                      <div
                        style={{ width: `${prepPct}%` }}
                        className="bg-blue-600/90 h-full flex items-center justify-center border-r border-black/20 print:bg-gray-400 print:border-white"
                      >
                        <span className="text-sm font-black text-slate-300 tracking-widest uppercase px-2 whitespace-nowrap print:text-black">
                          {prepHours}h Prep
                        </span>
                      </div>
                    )}
                    {integPct > 0 && (
                      <div
                        style={{ width: `${integPct}%` }}
                        className="bg-indigo-600/90 h-full flex items-center justify-center print:bg-gray-300"
                      >
                        <span className="text-sm font-black text-slate-300 tracking-widest uppercase px-2 whitespace-nowrap print:text-black">
                          {integHours}h Integration
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Music Badge Footer */}
                  {record.context?.musicPresence && (
                    <div className="flex justify-start pt-2">
                      <AdvancedTooltip content="Curated music playlist used to guide the therapeutic session.">
                        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-emerald-900/20 border border-emerald-800/50 text-emerald-400 print:bg-transparent print:text-black print:border-black cursor-help">
                          <span className="material-symbols-outlined text-lg">music_note</span>
                          <span className="text-xs font-black uppercase tracking-widest">Auditory Drive Active</span>
                        </div>
                      </AdvancedTooltip>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* CARD 4: Efficacy Trajectory */}
            <section className="bg-[#0b0e14] border border-slate-800 rounded-[2.5rem] p-8 sm:p-10 shadow-2xl relative print:bg-white print:border-black/20 print:shadow-none print:rounded-xl">
              <div className="flex items-center gap-4 mb-10">
                <div className="size-10 sm:size-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20 print:border-black print:text-black print:bg-transparent">
                  <span className="material-symbols-outlined text-2xl">monitoring</span>
                </div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-black text-slate-200 uppercase tracking-[0.2em] print:text-black">EFFICACY TRAJECTORY (PHQ-9)</h3>
                  <AdvancedTooltip content="Longitudinal tracking of clinical outcome measures (e.g., PHQ-9) vs. baseline.">
                    <Info className="text-slate-600 hover:text-slate-200 transition-colors cursor-help print:hidden" size={16} />
                  </AdvancedTooltip>
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">

                {/* Subjective Difficulty Slider Viz */}
                <div className="space-y-6 p-6 bg-slate-900/30 rounded-3xl border border-slate-800 flex flex-col justify-center print:bg-gray-50 print:border-gray-200">
                  <h4 className="text-sm font-bold text-slate-3000 uppercase tracking-widest print:text-black">Subjective Difficulty</h4>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black text-slate-300 print:text-black">{record.experience?.difficultyScore || '—'}</span>
                    <span className="text-xl font-bold text-slate-600 print:text-black">/ 10</span>
                  </div>

                  <div className="h-4 w-full rounded-full bg-gradient-to-r from-emerald-500 via-amber-500 to-red-600 relative opacity-80 print:border print:border-black/20">
                    {record.experience?.difficultyScore && (
                      <div
                        className="absolute top-1/2 -translate-y-1/2 size-6 bg-white border-4 border-slate-900 rounded-full shadow-xl transform transition-all duration-500 print:border-black"
                        style={{ left: `${(record.experience.difficultyScore / 10) * 100}%` }}
                      ></div>
                    )}
                  </div>
                  <div className="flex justify-between text-xs font-black text-slate-600 uppercase tracking-widest print:text-black">
                    <span>Flow State</span>
                    <span>High Distress</span>
                  </div>
                  <div className="pt-4 border-t border-slate-800/50 mt-auto print:border-gray-300">
                    <span className="text-xs font-bold text-slate-400 block mb-1 uppercase tracking-widest print:text-black">Status</span>
                    <span className="text-base font-bold text-slate-300 print:text-black">{record.experience?.resolutionStatus}</span>
                  </div>
                </div>

                {/* CHART UPGRADE: Efficacy Trajectory */}
                <div className="flex flex-col gap-4">
                  <div className="h-[250px] w-full bg-slate-900/30 rounded-3xl border border-slate-800 p-4 print:bg-white print:border-gray-200">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#2b74f3" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#2b74f3" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid stroke="#334155" strokeDasharray="3 3" vertical={false} opacity={0.1} />
                        <XAxis
                          dataKey="date"
                          tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                          axisLine={false}
                          tickLine={false}
                          dy={10}
                        />
                        <YAxis
                          tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                          axisLine={false}
                          tickLine={false}
                          width={40}
                          domain={[0, 27]}
                        />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f1f5f9', borderRadius: '12px' }}
                          itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                          labelStyle={{ color: '#94a3b8', marginBottom: '5px', textTransform: 'uppercase', fontSize: '10px', letterSpacing: '1px' }}
                        />
                        <ReferenceLine y={5} stroke="#10b981" strokeDasharray="3 3" label={{ value: 'Remission', fill: '#10b981', fontSize: 10, position: 'insideBottomRight' }} />
                        <Area type="monotone" dataKey="score" name="PHQ-9 Score" stroke="#2b74f3" strokeWidth={3} fill="url(#chartGrad)" dot={{ r: 4, fill: '#2b74f3', strokeWidth: 0 }} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="text-center">
                    <p className="text-[11px] font-black text-slate-3000 uppercase tracking-widest print:text-black">
                      Lower Score = Improvement (Remission &lt; 5)
                    </p>
                  </div>
                </div>

              </div>
            </section>
          </div>

          {/* RIGHT PANEL: Safety Rail (Span 1) */}
          <div className="lg:col-span-1 space-y-8">

            {/* CARD 1: Protocol Architecture */}
            <section className="bg-[#0b0e14] border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl print:bg-white print:border-black/20 print:shadow-none print:rounded-xl print:break-inside-avoid">
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <label className="text-sm font-bold text-slate-3000 uppercase tracking-widest print:text-black">Protocol</label>
                    <AdvancedTooltip content="Core pharmacological and identity parameters of the recorded intervention.">
                      <Info className="text-slate-600 hover:text-primary transition-colors cursor-help print:hidden" size={14} />
                    </AdvancedTooltip>
                  </div>
                  <p className="text-3xl font-black text-slate-300 tracking-tight print:text-black">{record.protocol.substance}</p>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-800/50 print:border-gray-300">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-slate-3000 uppercase tracking-widest print:text-black">Dosage</span>
                    <span className="text-lg font-bold text-slate-300 print:text-black">{record.protocol.dosage} {record.protocol.dosageUnit}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-slate-3000 uppercase tracking-widest print:text-black">Route</span>
                    <span className="text-lg font-bold text-slate-300 print:text-black">{record.protocol.route}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-slate-3000 uppercase tracking-widest print:text-black">Date</span>
                    <span className="text-base font-mono font-bold text-slate-400 print:text-black">{record.protocol.startDate}</span>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-800/50 print:border-gray-300">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-widest block mb-2 print:text-black">Patient Hash</label>
                  <div className="p-4 bg-black border border-slate-800 rounded-xl font-mono text-xs text-slate-400 break-all leading-relaxed print:bg-white print:border-black print:text-black">
                    {record.demographics.patientHash || record.id}
                  </div>
                </div>
              </div>
            </section>

            {/* CARD 3: Safety & Interactions */}
            <section className="bg-[#0b0e14] border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden print:bg-white print:border-black/20 print:shadow-none print:rounded-xl print:break-inside-avoid">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-[50px] pointer-events-none print:hidden"></div>

              <div className="flex items-center gap-3 mb-8 relative z-10">
                <span className="material-symbols-outlined text-3xl text-red-500 print:text-black">medical_services</span>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-slate-200 uppercase tracking-widest print:text-black">Safety Monitor</h3>
                  <AdvancedTooltip
                    content="Real-time monitoring of concomitant medications and adverse events."
                    side="bottom"
                  >
                    <Info className="text-slate-600 hover:text-slate-200 transition-colors cursor-help print:hidden" size={14} />
                  </AdvancedTooltip>
                </div>
              </div>

              <div className="space-y-8 relative z-10">
                {/* Concomitant Meds */}
                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-3000 uppercase tracking-widest block print:text-black">Concomitant Meds</label>
                  <div className="flex flex-col gap-3">
                    {record.context?.concomitantMeds && record.context.concomitantMeds.length > 0 ? (
                      record.context.concomitantMeds.map((med, i) => (
                        <button
                          key={i}
                          onClick={() => navigate(`/interactions?agentA=${encodeURIComponent(record.protocol.substance)}&agentB=${encodeURIComponent(med)}`)}
                          className="w-full flex items-center justify-between px-5 py-4 bg-slate-900/50 border border-slate-700 hover:border-red-500/50 hover:bg-red-500/10 rounded-xl transition-all group print:bg-white print:border-black"
                          title="Run Interaction Analysis"
                        >
                          <span className="text-sm font-bold text-slate-200 group-hover:text-red-200 print:text-black">{med}</span>
                          <span className="material-symbols-outlined text-slate-600 group-hover:text-red-400 text-lg print:hidden">science</span>
                        </button>
                      ))
                    ) : (
                      <div className="p-4 bg-slate-900/30 border border-slate-800 rounded-xl text-center print:bg-white print:border-black">
                        <span className="text-xs font-bold text-slate-3000 uppercase tracking-widest print:text-black">None Reported</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Adverse Events */}
                <div className="space-y-3 pt-4 border-t border-slate-800/50 print:border-gray-300">
                  <label className="text-sm font-bold text-slate-3000 uppercase tracking-widest block print:text-black">Adverse Events</label>
                  {record.safetyEvents.length > 0 ? (
                    <div className="space-y-3">
                      {record.safetyEvents.map(ev => (
                        <div key={ev.id} className="p-5 bg-red-950/20 border border-red-900/50 rounded-2xl print:bg-white print:border-black">
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-sm font-black text-red-400 uppercase print:text-black">{ev.type}</span>
                            <span className="px-2 py-0.5 bg-red-900/40 rounded text-[11px] font-black text-red-200 uppercase tracking-widest print:bg-white print:border print:border-black print:text-black">Grade {ev.severity}</span>
                          </div>
                          <p className="text-xs font-medium text-red-300/70 leading-relaxed print:text-black">Causality: {ev.causality}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 p-4 bg-emerald-950/20 border border-emerald-900/30 rounded-2xl print:bg-white print:border-black">
                      <span className="material-symbols-outlined text-emerald-500 print:text-black">check_circle</span>
                      <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest print:text-black">No Events</span>
                    </div>
                  )}
                </div>
              </div>
            </section>

          </div>

        </div>

        {/* SECTION: Cohort Matches (Collective Intelligence) */}
        <section className="bg-[#05070a]/50 border border-slate-800/50 rounded-[2.5rem] p-8 sm:p-12 mt-12 mb-20 animate-in slide-in-from-bottom-10 duration-1000 print:hidden">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">hub</span>
                <h3 className="text-2xl font-black text-slate-200 uppercase tracking-tighter">Cohort Matches</h3>
              </div>
              <p className="text-slate-3000 text-sm font-bold tracking-widest uppercase">Global Research Registry: Hive Mind Intelligence</p>
            </div>
            <div className="px-5 py-2.5 bg-primary/10 border border-primary/20 rounded-xl">
              <span className="text-xs font-black text-primary uppercase tracking-widest">Scanning {PATIENTS.length} Remote Nodes...</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {similarCases.map((caseItem) => (
              <div
                key={caseItem.id}
                onClick={() => navigate(`/protocol/${caseItem.id}`)}
                className="group p-6 bg-slate-900/30 border border-slate-800 hover:border-primary/50 hover:bg-primary/5 rounded-[2rem] transition-all cursor-pointer relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ChevronRight className="text-primary" size={18} />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <span className="text-[11px] font-black text-slate-3000 uppercase tracking-widest block">Subject Reference</span>
                      <span className="text-sm font-mono font-black text-slate-300 uppercase">{caseItem.demographics.patientHash?.substring(0, 8) || caseItem.id}</span>
                    </div>
                    <div className="px-3 py-1 bg-slate-800 rounded-lg text-[11px] font-black text-slate-400">
                      {caseItem.demographics.age}yr {caseItem.demographics.sex.charAt(0)}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800/50 space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-3000 uppercase tracking-widest">Protocol</span>
                      <span className="font-black text-slate-200">{caseItem.protocol.substance}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-3000 uppercase tracking-widest">Clinical Outcome</span>
                      <span className={`font-black ${caseItem.status === 'Completed' ? 'text-clinical-green' : 'text-primary'}`}>
                        {caseItem.outcomes[caseItem.outcomes.length - 1]?.interpretation.split(':')[1] || caseItem.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Empty State / Search More */}
            <div className="group p-6 border-2 border-dashed border-slate-800 hover:border-primary/30 rounded-[2rem] flex flex-col items-center justify-center text-center space-y-4 opacity-60 hover:opacity-100 transition-all cursor-pointer">
              <div className="size-12 rounded-full bg-slate-900 flex items-center justify-center text-slate-600 transition-colors group-hover:text-primary">
                <span className="material-symbols-outlined">search</span>
              </div>
              <span className="text-xs font-black text-slate-3000 uppercase tracking-widest">Explore Full Registry</span>
            </div>
          </div>
        </section>
      </PageContainer>

      {/* Print Footer */}
      <div className="hidden print:block fixed bottom-0 left-0 w-full text-center text-[11px] font-mono font-bold uppercase text-black pb-4">
        Confidential Clinical Dossier • PPN Research Node 0x7 • Do Not Distribute
      </div>
    </div >
  );
};

export default ProtocolDetail;
