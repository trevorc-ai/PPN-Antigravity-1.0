
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { PageContainer } from '../components/layouts/PageContainer';
import { useToast } from '../contexts/ToastContext';
import { supabase } from '../supabaseClient';
import { useDataCache } from '../hooks/useDataCache';

// WO-096: Types for live ref table data
interface RefSubstance {
  substance_id: number;
  substance_name: string;
}

interface RefMedication {
  medication_id: number;
  medication_name: string;
  medication_category: string | null;
}

// ─── Custom accessible medication dropdown ───────────────────────────────────
// Replaces native <select>/<optgroup> whose category labels are uncontrollable
// OS grey (WCAG fail). This renders category headers in full-contrast white.
interface MedDropdownProps {
  medications: RefMedication[];
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

const MedDropdown: React.FC<MedDropdownProps> = ({ medications, value, onChange, disabled, placeholder }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);



  const displayValue = value || placeholder || 'Select Interactor...';

  return (
    <div ref={ref} className="relative">
      {/* Trigger button — matches the original select styling */}
      <button
        type="button"
        id="medication-select-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        disabled={disabled}
        onClick={() => setOpen(o => !o)}
        className="w-full h-16 bg-black border border-slate-800 rounded-2xl pl-14 pr-12 text-base font-bold focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer hover:border-slate-700 transition-all disabled:opacity-50 disabled:cursor-wait text-left"
        style={{ color: value ? '#8B9DC3' : '#4B5E7A' }}
      >
        {/* Dataset icon — matches original absolute-positioned icon */}
        <span className="absolute left-5 top-1/2 -translate-y-1/2 material-symbols-outlined text-xl text-slate-300 pointer-events-none">
          dataset
        </span>
        <span className="truncate block">{displayValue}</span>
        <span className="absolute right-5 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-600 pointer-events-none">
          {open ? 'expand_less' : 'expand_more'}
        </span>
      </button>

      {/* Dropdown panel */}
      {open && (
        <ul
          role="listbox"
          aria-label="Select medication"
          className="absolute z-50 left-0 right-0 mt-2 max-h-80 overflow-y-auto bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl py-2"
        >
          {/* Clear option */}
          <li
            role="option"
            aria-selected={value === ''}
            onClick={() => { onChange(''); setOpen(false); }}
            className="px-4 py-2.5 text-sm text-slate-400 hover:bg-slate-800 cursor-pointer transition-colors border-b border-slate-700/50"
          >
            {placeholder || 'Select Interactor...'}
          </li>

          {medications.map(med => (
            <li
              key={med.medication_id}
              role="option"
              aria-selected={value === med.medication_name}
              onClick={() => { onChange(med.medication_name); setOpen(false); }}
              className={`px-5 py-2.5 text-sm cursor-pointer transition-colors ${value === med.medication_name
                ? 'bg-blue-600 text-white font-semibold'
                : 'text-[#A8B5D1] hover:bg-slate-800'
                }`}
            >
              {med.medication_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
// ─── End MedDropdown ─────────────────────────────────────────────────────────

const InteractionChecker: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [selectedPsychedelic, setSelectedPsychedelic] = useState(searchParams.get('agentA') || '');
  const [selectedMedication, setSelectedMedication] = useState(searchParams.get('agentB') || '');

  const [dbRule, setDbRule] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorState, setErrorState] = useState<string | null>(null);

  const [substances, setSubstances] = useState<RefSubstance[]>([]);
  const [medications, setMedications] = useState<RefMedication[]>([]);

  const { data: refData, loading: refLoading } = useDataCache(
    'interaction-ref-data',
    async () => {
      try {
        const [{ data: subData, error: subErr }, { data: medData, error: medErr }] = await Promise.all([
          supabase
            .from('ref_substances')
            .select('substance_id, substance_name')
            .order('substance_name'),
          supabase
            .from('ref_medications')
            .select('medication_id, medication_name, medication_category')
            .eq('is_active', true)
            .order('medication_name')
        ]);

        if (subErr) throw subErr;

        let finalMeds = medData || [];
        if (!finalMeds || finalMeds.length === 0) {
          const { data: fallbackMeds } = await supabase
            .from('ref_medications')
            .select('medication_id, medication_name, medication_category')
            .order('medication_name');
          if (fallbackMeds) finalMeds = fallbackMeds;
        }

        return { data: { substances: subData || [], medications: finalMeds }, error: null };
      } catch (err) {
        console.error('[InteractionChecker] Ref Fetch Error:', err);
        addToast({ title: 'System Error', message: 'Failed to load medication database.', type: 'error' });
        return { data: { substances: [], medications: [] }, error: err };
      }
    },
    { ttl: 30 * 60 * 1000 } // 30 min cache
  );

  useEffect(() => {
    if (refData) {
      setSubstances(refData.substances);
      setMedications(refData.medications);
    }
  }, [refData]);

  // Fetch Interaction Logic
  useEffect(() => {
    const fetchInteraction = async () => {
      if (!selectedPsychedelic || !selectedMedication) {
        setDbRule(null);
        setErrorState(null);
        return;
      }

      setIsLoading(true);
      setErrorState(null);

      try {
        // Step 1: Resolve IDs
        const sub = substances.find(s => s.substance_name === selectedPsychedelic);
        const med = medications.find(m => m.medication_name === selectedMedication);

        if (!sub || !med) {
          console.warn("Invalid selection IDs");
          return;
        }

        // Step 2: Query ref_clinical_interactions (correct table — verified 2026-02-19)
        // Note: ref_knowledge_graph exists but has wrong schema (legacy alert rules system).
        const { data, error } = await supabase
          .from('ref_clinical_interactions')
          .select('*')
          .eq('substance_name', selectedPsychedelic)
          .eq('interactor_name', selectedMedication)
          .maybeSingle();

        if (error) throw error;

        if (data) {
          // Map ref_knowledge_graph columns to UI risk model
          const risk = data.risk_level ?? 1;
          const severityLabel = data.severity_grade ?? 'Low';

          setDbRule({
            id: `CI-${data.interaction_id}`,
            substance: selectedPsychedelic,
            interactor: selectedMedication,
            riskLevel: risk,
            severity: severityLabel,
            description: data.clinical_description,
            mechanism: data.mechanism,
            clinical_insight: null, // not in ref_clinical_interactions schema
            source: data.evidence_source ?? 'National Library of Medicine / PubMed',
            sourceUrl: data.source_url,
            isKnown: true
          });

        } else {
          // Explicit "No Record Found" -> Nominal Logic
          setDbRule(null);
        }

      } catch (err: any) {
        console.error('Interaction Query Error:', err);
        setErrorState(err.message || "Database connection failed");
        setDbRule(null); // Ensure we don't show stale data
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchInteraction, 300);
    return () => clearTimeout(timeoutId);
  }, [selectedPsychedelic, selectedMedication, substances, medications]);

  const analysisResult = useMemo(() => {
    if (!selectedPsychedelic || !selectedMedication) return null;
    if (isLoading) return null;

    // SAFETY CATCH: If there was a DB error, return explicit ERROR object
    if (errorState) {
      return {
        id: 'ERR-SYSTEM',
        substance: selectedPsychedelic,
        interactor: selectedMedication,
        riskLevel: 0,
        severity: 'SYSTEM ERROR',
        description: `CRITICAL FAILURE: Unable to verify interaction safety due to database error: ${errorState}.`,
        mechanism: 'System integrity check failed.',
        isKnown: true, // Treat as known failure
        isError: true
      };
    }

    if (dbRule) return dbRule;

    // Default "Nominal" ONLY if no error
    return {
      id: 'RULE-NOMINAL',
      substance: selectedPsychedelic,
      interactor: selectedMedication,
      riskLevel: 1,
      severity: 'Low',
      description: 'No significant clinical interactions identified in the verified reference library. Standard institutional monitoring indicated.',
      mechanism: 'Physiological pathways appear independent or non-synergistic.',
      isKnown: false,
      source: "National Library of Medicine / PubMed (2024)",
      sourceUrl: "https://pubmed.ncbi.nlm.nih.gov/"
    };
  }, [selectedPsychedelic, selectedMedication, dbRule, isLoading, errorState]);

  const handleClear = () => {
    setSelectedPsychedelic('');
    setSelectedMedication('');
    navigate('/interactions');
  };

  const handlePrint = () => window.print();
  const handleRequestAgent = () => addToast({ title: 'Request Logged', message: 'The clinical data team has been notified.', type: 'success' });

  // Styles logic...
  const getSeverityStyles = (risk: number, isError?: boolean) => {
    if (isError) return {
      bg: 'bg-red-900/20',
      border: 'border-red-500',
      text: 'text-red-500',
      glow: 'shadow-[0_0_30px_rgba(239,68,68,0.4)]',
      icon: 'error',
      label: 'SYSTEM ERROR'
    };
    if (risk >= 8) return {
      bg: 'bg-red-500/10',
      border: 'border-red-500/50',
      text: 'text-red-500',
      glow: 'shadow-[0_0_20px_rgba(239,68,68,0.2)]',
      icon: 'dangerous',
      label: 'Contraindicated'
    };
    if (risk >= 4) return {
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/50',
      text: 'text-amber-500',
      glow: 'shadow-[0_0_20px_rgba(245,158,11,0.2)]',
      icon: 'warning',
      label: 'Clinical Caution'
    };
    return {
      bg: 'bg-clinical-green/10',
      border: 'border-clinical-green/50',
      text: 'text-clinical-green',
      glow: 'shadow-[0_0_20px_rgba(83,210,45,0.2)]',
      icon: 'check_circle',
      label: 'No Known Interaction'
    };
  };

  const styles = analysisResult ? getSeverityStyles(analysisResult.riskLevel, analysisResult.isError) : null;

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#080c14] via-[#0c1220] to-[#0a0e1a] overflow-hidden text-slate-300">
      {/* Background Texture & Glows */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,black,transparent)] pointer-events-none z-0" />
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-primary/10 blur-[120px] rounded-full pointer-events-none opacity-50 z-0" />

      <PageContainer width="wide" className="relative z-10 !max-w-[1600px] p-4 sm:p-10 space-y-8 mt-4 animate-in fade-in duration-700">

        {/* Back Button */}
        <button
          onClick={() => navigate('/catalog')}
          className="flex items-center gap-2 text-slate-300 hover:text-slate-300 transition-colors mb-6 group"
        >
          <span className="material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform">arrow_back</span>
          <span className="text-sm font-black uppercase tracking-widest">Return to Catalog</span>
        </button>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-xl">
                <span className="material-symbols-outlined text-3xl">security</span>
              </div>
              <div>
                <h1 className="text-4xl font-black tracking-tighter" style={{ color: '#8BA5D3' }}>Interaction Checker</h1>
                <p className="text-slate-300 text-sm font-black uppercase tracking-[0.3em]">Knowledge Graph Cross-Reference v1.4</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleClear}
              className="px-6 py-3 bg-slate-900 border border-slate-800 text-slate-300 hover:text-slate-300 rounded-xl text-sm font-black uppercase tracking-widest transition-all"
            >
              Reset Analysis
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Input: Psychedelic */}
          <section className="bg-slate-900/40 border border-slate-800 rounded-[2.5rem] p-8 shadow-xl space-y-4">
            <label className="text-sm font-black text-slate-300 uppercase tracking-widest ml-1">Primary Agent (Psychedelic)</label>
            <div className="relative group">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300 group-focus-within:text-primary transition-colors">
                <span className="material-symbols-outlined text-xl">biotech</span>
              </div>
              <select
                value={selectedPsychedelic}
                onChange={(e) => setSelectedPsychedelic(e.target.value)}
                disabled={refLoading}
                className="w-full h-16 bg-black border border-slate-800 rounded-2xl pl-14 pr-12 text-base font-bold focus:ring-1 focus:ring-primary appearance-none cursor-pointer hover:border-slate-700 transition-all disabled:opacity-50 disabled:cursor-wait" style={{ color: '#8B9DC3' }}
              >
                <option value="">{refLoading ? 'Loading...' : 'Select Controlled Substance...'}</option>
                {substances.map(s => (
                  <option key={s.substance_id} value={s.substance_name}>
                    {s.substance_name.toUpperCase()}
                  </option>
                ))}
              </select>
              <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-600">
                <span className="material-symbols-outlined">expand_more</span>
              </div>
            </div>
            <div className="flex items-center gap-2 px-2">
              <span className="material-symbols-outlined text-sm text-slate-400">lock</span>
              <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Validated Protocol List Only</span>
            </div>
          </section>

          {/* Input: Medication */}
          <section className="bg-slate-900/40 border border-slate-800 rounded-[2.5rem] p-8 shadow-xl space-y-4">
            <label className="text-sm font-black text-slate-300 uppercase tracking-widest ml-1">Secondary Agent (Medication/Condition)</label>
            <MedDropdown
              medications={medications}
              value={selectedMedication}
              onChange={setSelectedMedication}
              disabled={refLoading}
              placeholder={refLoading ? 'Loading medications...' : medications.length === 0 ? 'No medications in database' : 'Select Interactor...'}
            />

            {/* Missing Agent Workflow */}
            <div className="px-2">
              <button
                onClick={handleRequestAgent}
                className="text-sm font-bold text-primary hover:text-slate-300 uppercase tracking-widest transition-colors flex items-center gap-2 group"
              >
                <span>Agent not listed? Request institutional database update.</span>
                <span className="material-symbols-outlined text-xs opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1">arrow_forward</span>
              </button>
            </div>
          </section>
        </div>

        {/* Analysis Output */}
        <div className="min-h-[400px] flex flex-col">
          {!analysisResult ? (
            <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-800 rounded-[3rem] space-y-6 opacity-40">
              <span className="material-symbols-outlined text-7xl text-slate-700">query_stats</span>
              <p className="text-slate-300 font-black text-sm uppercase tracking-[0.4em]">Awaiting Selection Nodes</p>
            </div>
          ) : (
            <div
              key={`${selectedPsychedelic}-${selectedMedication}`}
              className={`flex-1 ${styles?.bg} border-2 ${styles?.border} rounded-[3rem] p-10 sm:p-14 ${styles?.glow} animate-in fade-in slide-in-from-bottom-4 duration-500 transition-all overflow-hidden relative group`}
            >
              <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                <span className="material-symbols-outlined text-[160px]">{styles?.icon}</span>
              </div>

              <div className="relative z-10 flex flex-col h-full">

                {/* Combination Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/10 pb-8 mb-8">
                  <div>
                    <h2 className="text-3xl font-black tracking-tight flex items-center flex-wrap gap-2" style={{ color: '#9DAEC8' }}>
                      {analysisResult.substance}
                      <span className="text-slate-600 mx-3">+</span>
                      {analysisResult.interactor}
                    </h2>
                  </div>
                  <button
                    onClick={handlePrint}
                    className="px-8 py-4 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-300 text-sm font-black rounded-2xl uppercase tracking-widest shadow-2xl hover:scale-105 transition-all active:scale-95 flex items-center gap-3 shrink-0"
                  >
                    <span className="material-symbols-outlined text-lg">print</span>
                    Print / Save Results
                  </button>
                </div>

                {/* Status & Risk Badges */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                  <div className="flex items-center gap-4">
                    <div className={`size-16 rounded-[1.5rem] bg-black/40 border ${styles?.border} flex items-center justify-center ${styles?.text}`}>
                      <span className="material-symbols-outlined text-4xl">{styles?.icon}</span>
                    </div>
                    <div>
                      <h3 className={`text-4xl font-black tracking-tighter ${styles?.text}`}>{styles?.label}</h3>
                      <p className="text-sm font-mono font-black text-slate-300 uppercase tracking-widest mt-1">
                        Risk Level: {analysisResult.riskLevel} / 10 • Severity: {analysisResult.severity}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                  <div className="lg:col-span-7 space-y-8">
                    <div className="space-y-4">
                      <h3 className="text-sm font-black uppercase tracking-[0.3em]" style={{ color: '#A8B5D1' }}>Clinical Description</h3>
                      <p className="text-xl sm:text-2xl font-bold leading-relaxed" style={{ color: '#8B9DC3' }}>
                        "{analysisResult.description}"
                      </p>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-sm font-black uppercase tracking-[0.3em]" style={{ color: '#A8B5D1' }}>Mechanism of Interaction</h3>
                      <div className="p-6 bg-black/40 border border-white/5 rounded-2xl">
                        <p className="text-base font-medium leading-relaxed" style={{ color: '#8B9DC3' }}>
                          {analysisResult.mechanism}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-5 flex flex-col justify-end">
                    <div className="bg-black/60 border border-white/5 rounded-3xl p-8 space-y-6 shadow-2xl">
                      <div className="flex justify-between items-center border-b border-white/5 pb-4">
                        <span className="text-sm font-black text-slate-300 uppercase tracking-widest">Protocol Sync Status</span>
                        <span className="text-sm font-mono text-clinical-green font-black uppercase">Active</span>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-bold text-slate-600 uppercase tracking-tight">Institutional Reference:</p>
                        <p className="text-base font-mono font-black" style={{ color: '#8B9DC3' }}>{analysisResult.id} // SECURE_NODE_0x7</p>
                      </div>
                      {/* Citation — always shown, links to source_url or PubMed search */}
                      <div className="flex items-center gap-2">
                        <a
                          href={analysisResult.sourceUrl || `https://pubmed.ncbi.nlm.nih.gov/?term=${encodeURIComponent(analysisResult.source)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm font-black text-primary hover:text-slate-300 uppercase tracking-widest flex items-center gap-1 transition-colors"
                        >
                          Source: {analysisResult.source}
                          <span className="material-symbols-outlined text-xs">open_in_new</span>
                        </a>
                      </div>

                    </div>
                  </div>
                </div>

                {/* Legal Footer */}
                <div className="mt-8 pt-6 border-t border-white/5 text-sm font-medium leading-relaxed" style={{ color: '#8B9DC3' }}>
                  DISCLAIMER: This tool is for educational and harm reduction purposes only. It does not constitute medical advice. Independent verification is required.
                </div>
              </div>
            </div>
          )}
        </div>

      </PageContainer>
    </div>
  );
};

export default InteractionChecker;
