
import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { PageContainer } from '../components/layouts/PageContainer';
import { useToast } from '../contexts/ToastContext';
import { supabase } from '../supabaseClient';
import { useDataCache } from '../hooks/useDataCache';
import { ComboSelect, ComboOption } from '../components/ui/ComboSelect';

// ── Types ──────────────────────────────────────────────────────────────────────
interface RefSubstance {
  substance_id: number;
  substance_name: string;
}

interface RefMedication {
  medication_id: number;
  medication_name: string;
  medication_category: string | null;
}

type RiskBucket =
  | 'ABSOLUTE_CONTRAINDICATION'
  | 'STRONG_CAUTION'
  | 'CLINICIAN_REVIEW'
  | 'POSSIBLE_EFFICACY_BLUNTING'
  | 'MONITOR_ONLY'
  | 'INSUFFICIENT_EVIDENCE';

interface InteractionRule {
  id: string;
  substance: string;
  interactor: string;
  risk_bucket: RiskBucket;
  clinical_description: string;
  mechanism: string;
  interaction_type: string | null;
  effect_direction: string | null;
  confidence: string | null;
  evidence_level: string | null;
  washout_note: string | null;
  screening_note: string | null;
  evidence_source: string | null;
  source_url: string | null;
  isKnown: true;
  isError?: false;
}

interface NoRuleResult {
  id: 'RULE-NONE';
  substance: string;
  interactor: string;
  risk_bucket: 'INSUFFICIENT_EVIDENCE';
  isKnown: false;
  isError?: false;
}

interface ErrorResult {
  id: 'ERR-SYSTEM';
  substance: string;
  interactor: string;
  risk_bucket: 'INSUFFICIENT_EVIDENCE';
  isKnown: false;
  isError: true;
  errorMessage: string;
}

type AnalysisResult = InteractionRule | NoRuleResult | ErrorResult;

// ── Risk tier display config ───────────────────────────────────────────────────
const RISK_CONFIG: Record<
  RiskBucket,
  {
    label: string;
    icon: string;
    bg: string;
    border: string;
    text: string;
    glow: string;
    badgeBg: string;
    allowOverride: false;
  }
> = {
  ABSOLUTE_CONTRAINDICATION: {
    label: 'Absolute Contraindication',
    icon: 'dangerous',
    bg: 'bg-red-500/10',
    border: 'border-red-500/70',
    text: 'text-red-400',
    glow: 'shadow-[0_0_30px_rgba(239,68,68,0.25)]',
    badgeBg: 'bg-red-900/40 border border-red-500/50',
    allowOverride: false,
  },
  STRONG_CAUTION: {
    label: 'Strong Caution',
    icon: 'warning',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/50',
    text: 'text-amber-400',
    glow: 'shadow-[0_0_20px_rgba(245,158,11,0.2)]',
    badgeBg: 'bg-amber-900/40 border border-amber-500/50',
    allowOverride: false,
  },
  CLINICIAN_REVIEW: {
    label: 'Clinician Review Required',
    icon: 'policy',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/40',
    text: 'text-yellow-400',
    glow: 'shadow-[0_0_20px_rgba(234,179,8,0.15)]',
    badgeBg: 'bg-yellow-900/40 border border-yellow-500/40',
    allowOverride: false,
  },
  POSSIBLE_EFFICACY_BLUNTING: {
    label: 'Possible Efficacy Blunting',
    icon: 'info',
    bg: 'bg-indigo-500/10',
    border: 'border-indigo-500/40',
    text: 'text-indigo-300',
    glow: 'shadow-[0_0_20px_rgba(99,102,241,0.15)]',
    badgeBg: 'bg-indigo-900/40 border border-indigo-500/40',
    allowOverride: false,
  },
  MONITOR_ONLY: {
    label: 'Monitor Only',
    icon: 'monitor_heart',
    bg: 'bg-slate-800/40',
    border: 'border-slate-600/50',
    text: 'text-slate-300',
    glow: '',
    badgeBg: 'bg-slate-800/60 border border-slate-700/50',
    allowOverride: false,
  },
  INSUFFICIENT_EVIDENCE: {
    label: 'Insufficient Evidence',
    icon: 'help_outline',
    bg: 'bg-slate-800/40',
    border: 'border-slate-700/40',
    text: 'text-slate-400',
    glow: '',
    badgeBg: 'bg-slate-800/60 border border-slate-700/40',
    allowOverride: false,
  },
};

// ── Component ──────────────────────────────────────────────────────────────────
const InteractionChecker: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [selectedPsychedelic, setSelectedPsychedelic] = useState(searchParams.get('agentA') || '');
  const [selectedMedication, setSelectedMedication] = useState(searchParams.get('agentB') || '');
  const [dbRule, setDbRule] = useState<InteractionRule | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorState, setErrorState] = useState<string | null>(null);
  const [substances, setSubstances] = useState<RefSubstance[]>([]);
  const [medications, setMedications] = useState<RefMedication[]>([]);

  // Clear stale result immediately on selection change (flash bug prevention)
  const handlePsychedelicChange = (val: string) => {
    setSelectedPsychedelic(val);
    setDbRule(null);
    setErrorState(null);
    if (val && selectedMedication) setIsLoading(true);
  };

  const handleMedicationChange = (val: string) => {
    setSelectedMedication(val);
    setDbRule(null);
    setErrorState(null);
    if (selectedPsychedelic && val) setIsLoading(true);
  };

  // ── Reference data (30-min cache) ──────────────────────────────────────────
  const { data: refData, loading: refLoading } = useDataCache(
    'interaction-ref-data',
    async () => {
      try {
        const [{ data: subData, error: subErr }, { data: medData, error: medErr }] = await Promise.all([
          supabase.from('ref_substances').select('substance_id, substance_name').order('substance_name'),
          supabase.from('ref_medications').select('medication_id, medication_name, medication_category').eq('is_active', true).order('medication_name'),
        ]);

        if (subErr) throw subErr;

        let finalMeds = medData || [];
        if (!finalMeds.length) {
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
    { ttl: 30 * 60 * 1000 }
  );

  useEffect(() => {
    if (refData) {
      setSubstances(refData.substances);
      setMedications(refData.medications);
    }
  }, [refData]);

  const substanceOptions: ComboOption[] = useMemo(
    () => substances.map((s) => ({ value: s.substance_name, label: s.substance_name })),
    [substances]
  );
  const medicationOptions: ComboOption[] = useMemo(
    () => medications.map((m) => ({ value: m.medication_name, label: m.medication_name })),
    [medications]
  );

  // ── Interaction query (300ms debounce) ────────────────────────────────────
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
        const { data, error } = await supabase
          .from('ref_clinical_interactions')
          .select(`
            interaction_id,
            substance_name,
            interactor_name,
            risk_bucket,
            clinical_description,
            mechanism,
            interaction_type,
            effect_direction,
            confidence,
            evidence_level,
            washout_note,
            screening_note,
            evidence_source,
            source_url
          `)
          .eq('substance_name', selectedPsychedelic)
          .eq('interactor_name', selectedMedication)
          .maybeSingle();

        if (error) throw error;

        if (data) {
          setDbRule({
            id: `CI-${data.interaction_id}`,
            substance: data.substance_name,
            interactor: data.interactor_name,
            // Fall back to INSUFFICIENT_EVIDENCE if risk_bucket not yet populated (pre-migration rows)
            risk_bucket: (data.risk_bucket as RiskBucket) ?? 'INSUFFICIENT_EVIDENCE',
            clinical_description: data.clinical_description ?? '',
            mechanism: data.mechanism ?? '',
            interaction_type: data.interaction_type,
            effect_direction: data.effect_direction,
            confidence: data.confidence,
            evidence_level: data.evidence_level,
            washout_note: data.washout_note,
            screening_note: data.screening_note,
            evidence_source: data.evidence_source,
            source_url: data.source_url,
            isKnown: true,
          });
        } else {
          setDbRule(null);
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Database connection failed';
        console.error('[InteractionChecker] Query Error:', err);
        setErrorState(msg);
        setDbRule(null);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchInteraction, 300);
    return () => clearTimeout(timeoutId);
  }, [selectedPsychedelic, selectedMedication, substances, medications]);

  // ── Derived result ────────────────────────────────────────────────────────
  const analysisResult = useMemo((): AnalysisResult | null => {
    if (!selectedPsychedelic || !selectedMedication) return null;
    if (isLoading) return null;

    if (errorState) {
      return {
        id: 'ERR-SYSTEM',
        substance: selectedPsychedelic,
        interactor: selectedMedication,
        risk_bucket: 'INSUFFICIENT_EVIDENCE',
        isKnown: false,
        isError: true,
        errorMessage: errorState,
      };
    }

    if (dbRule) return dbRule;

    // No rule found — NOT a "safe" result; data gap
    return {
      id: 'RULE-NONE',
      substance: selectedPsychedelic,
      interactor: selectedMedication,
      risk_bucket: 'INSUFFICIENT_EVIDENCE',
      isKnown: false,
    };
  }, [selectedPsychedelic, selectedMedication, dbRule, isLoading, errorState]);

  const riskConfig = analysisResult ? RISK_CONFIG[analysisResult.risk_bucket] : null;

  const handleClear = () => {
    setSelectedPsychedelic('');
    setSelectedMedication('');
    navigate('/interactions');
  };

  const handlePrint = () => {
    const prev = document.title;
    document.title = `PPN Interaction Report ${new Date().toISOString().slice(0, 10)}`;
    window.print();
    window.addEventListener('afterprint', () => { document.title = prev; }, { once: true });
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#080c14] via-[#0c1220] to-[#0a0e1a] overflow-hidden text-slate-300">
      <style>{`
        @media print {
          body { background: #ffffff !important; color: #0f172a !important; }
          .bg-gradient-to-br, [class*="bg-"] { background: #ffffff !important; box-shadow: none !important; }
          [class*="border-"] { border-color: #cbd5e1 !important; }
          [class*="text-slate"], [class*="text-primary"] { color: #0f172a !important; }
          button, nav, .sticky, [class*="blur"] { display: none !important; }
          [class*="shadow"], [class*="glow"] { box-shadow: none !important; }
          h1, h2, h3 { color: #0f172a !important; page-break-after: avoid; }
          @page { margin: 1.5cm 2cm; size: letter portrait; }
        }
      `}</style>

      {/* Background */}
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

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-xl">
                <span className="material-symbols-outlined text-3xl">security</span>
              </div>
              <div>
                <h1 className="ppn-page-title" style={{ color: '#8BA5D3' }}>Interaction Checker</h1>
                <p className="text-slate-400 text-sm font-black uppercase tracking-[0.3em]">Clinical Safety Reference v2.0</p>
              </div>
            </div>
          </div>
          <button
            onClick={handleClear}
            className="px-6 py-3 bg-slate-900 border border-slate-800 text-slate-300 hover:text-slate-300 rounded-xl text-sm font-black uppercase tracking-widest transition-all"
          >
            Reset Analysis
          </button>
        </div>

        {/* Agent Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className={`rounded-[2.5rem] p-8 shadow-xl space-y-4 transition-all duration-300 ${selectedPsychedelic ? 'bg-primary/5 border-2 border-primary/40 shadow-primary/10' : 'bg-slate-900/40 border border-slate-800'}`}>
            <label className="ppn-label ml-1" htmlFor="primary-agent-select">
              Primary Agent (Psychedelic / Controlled Substance)
            </label>
            <ComboSelect
              options={substanceOptions}
              value={selectedPsychedelic}
              onChange={handlePsychedelicChange}
              disabled={refLoading}
              placeholder={refLoading ? 'Loading...' : 'Select Controlled Substance...'}
              leftIcon="biotech"
              id="primary-agent-select"
            />
            <div className="flex items-center gap-2 px-2">
              <span className="material-symbols-outlined text-sm text-slate-400">lock</span>
              <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Validated list only</span>
            </div>
          </section>

          <section className={`rounded-[2.5rem] p-8 shadow-xl space-y-4 transition-all duration-300 ${selectedMedication ? 'bg-primary/5 border-2 border-primary/40 shadow-primary/10' : 'bg-slate-900/40 border border-slate-800'}`}>
            <label className="ppn-label ml-1" htmlFor="secondary-agent-select">
              Secondary Agent (Medication / Substance)
            </label>
            <ComboSelect
              options={medicationOptions}
              value={selectedMedication}
              onChange={handleMedicationChange}
              disabled={refLoading}
              placeholder={refLoading ? 'Loading medications...' : medications.length === 0 ? 'No medications in database' : 'Select Interactor...'}
              leftIcon="dataset"
              id="secondary-agent-select"
            />
            <div className="px-2">
              <a
                href="mailto:support@ppnportal.net?subject=Database%20Update%20Request&body=Please%20add%20the%20following%20agent%20to%20the%20institutional%20database%3A%0A%0AAgent%20Name%3A%20%0AAgent%20Class%3A%20%0AReference%20Source%3A%20"
                className="text-sm font-bold text-[#93c5fd] hover:text-[#bfdbfe] uppercase tracking-widest transition-colors flex items-center gap-2 group focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#93c5fd]"
                aria-label="Request institutional database update via email"
              >
                <span>Agent not listed? Request institutional database update.</span>
                <span className="material-symbols-outlined text-xs opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1" aria-hidden="true">arrow_forward</span>
              </a>
            </div>
          </section>
        </div>

        {/* Analysis Output */}
        <div className="min-h-[400px] flex flex-col">

          {/* Loading spinner */}
          {isLoading && (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 border-2 border-dashed border-slate-700 rounded-[3rem]">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="ppn-body text-slate-400 uppercase tracking-[0.3em] text-sm">Checking interaction database...</p>
            </div>
          )}

          {/* Awaiting selection */}
          {!analysisResult && !isLoading && (
            <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-800 rounded-[3rem] space-y-6 opacity-40">
              <span className="material-symbols-outlined text-7xl text-slate-700">query_stats</span>
              <p className="ppn-body text-slate-300 font-black text-sm uppercase tracking-[0.4em]">Awaiting Selection</p>
            </div>
          )}

          {/* Result card */}
          {analysisResult && !isLoading && riskConfig && (
            <div
              key={`${selectedPsychedelic}-${selectedMedication}`}
              className={`flex-1 ${riskConfig.bg} border-2 ${riskConfig.border} rounded-[3rem] p-10 sm:p-14 ${riskConfig.glow} animate-in fade-in slide-in-from-bottom-4 duration-500 transition-all overflow-hidden relative group`}
            >
              {/* Watermark icon */}
              <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                <span className="material-symbols-outlined text-[160px]">{riskConfig.icon}</span>
              </div>

              <div className="relative z-10 flex flex-col h-full">

                {/* Combination header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/10 pb-8 mb-8">
                  <h2 className="ppn-section-title flex items-center flex-wrap gap-2" style={{ color: '#9DAEC8' }}>
                    {analysisResult.substance}
                    <span className="text-slate-600 mx-3">+</span>
                    {analysisResult.interactor}
                  </h2>
                  {analysisResult.isKnown && (
                    <button
                      onClick={handlePrint}
                      className="px-8 py-4 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-300 text-sm font-black rounded-2xl uppercase tracking-widest shadow-2xl hover:scale-105 transition-all active:scale-95 flex items-center gap-3 shrink-0"
                    >
                      <span className="material-symbols-outlined text-lg">print</span>
                      Export
                    </button>
                  )}
                </div>

                {/* Risk tier badge */}
                <div className="flex items-center gap-4 mb-10">
                  <div className={`size-16 rounded-[1.5rem] bg-black/40 border ${riskConfig.border} flex items-center justify-center ${riskConfig.text}`}>
                    <span className="material-symbols-outlined text-4xl" aria-hidden="true">{riskConfig.icon}</span>
                  </div>
                  <div>
                    <h3 className={`text-2xl sm:text-4xl font-black tracking-tighter break-words ${riskConfig.text}`}>
                      {riskConfig.label}
                    </h3>
                    {analysisResult.isKnown && (
                      <div className="flex items-center gap-3 mt-2 flex-wrap">
                        {(analysisResult as InteractionRule).interaction_type && (
                          <span className={`text-xs font-black uppercase tracking-wide px-3 py-1 rounded-full ${riskConfig.badgeBg} ${riskConfig.text}`}>
                            {(analysisResult as InteractionRule).interaction_type?.replace(/_/g, ' ')}
                          </span>
                        )}
                        {(analysisResult as InteractionRule).confidence && (
                          <span className="text-xs font-black uppercase tracking-wide px-3 py-1 rounded-full bg-slate-800/60 border border-slate-700/50 text-slate-300">
                            {(analysisResult as InteractionRule).confidence} confidence
                          </span>
                        )}
                        {(analysisResult as InteractionRule).evidence_level && (
                          <span className="text-xs font-black uppercase tracking-wide px-3 py-1 rounded-full bg-slate-800/60 border border-slate-700/50 text-slate-400">
                            {(analysisResult as InteractionRule).evidence_level?.replace(/_/g, ' ')}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Content grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                  <div className="lg:col-span-7 space-y-8">

                    {/* Insufficient evidence / error state */}
                    {!analysisResult.isKnown && (
                      <div className="space-y-3">
                        {(analysisResult as ErrorResult).isError ? (
                          <>
                            <h3 className="ppn-label text-red-400">Database Error</h3>
                            <p className="ppn-body text-slate-300">
                              The interaction database could not be reached. This is a system error — it does not mean the combination is safe.
                              <strong className="text-red-400"> Do not proceed without manual verification.</strong>
                            </p>
                            <p className="ppn-meta text-slate-500">Error: {(analysisResult as ErrorResult).errorMessage}</p>
                          </>
                        ) : (
                          <>
                            <h3 className="ppn-label text-slate-400">No Rule Found in Database</h3>
                            <p className="ppn-body text-slate-300">
                              This combination is <strong>not currently documented</strong> in the PPN interaction reference library.
                              The absence of a rule <strong className="text-slate-200">does not indicate safety</strong> — it indicates a data gap.
                            </p>
                            <p className="ppn-body text-slate-400">
                              Consult primary literature and relevant clinical guidelines before proceeding with this combination.
                              Use the link below to request this combination be added to the database.
                            </p>
                          </>
                        )}
                      </div>
                    )}

                    {/* Known interaction */}
                    {analysisResult.isKnown && (
                      <>
                        <div className="space-y-3">
                          <h3 className="ppn-label" style={{ color: '#A8B5D1' }}>Clinical Description</h3>
                          <p className="text-xl sm:text-2xl font-bold leading-relaxed" style={{ color: '#8B9DC3' }}>
                            "{(analysisResult as InteractionRule).clinical_description}"
                          </p>
                        </div>

                        <div className="space-y-3">
                          <h3 className="ppn-label" style={{ color: '#A8B5D1' }}>Mechanism of Interaction</h3>
                          <div className="p-6 bg-black/40 border border-white/5 rounded-2xl">
                            <p className="ppn-body" style={{ color: '#8B9DC3' }}>
                              {(analysisResult as InteractionRule).mechanism}
                            </p>
                          </div>
                        </div>

                        {/* Screening note */}
                        {(analysisResult as InteractionRule).screening_note && (
                          <div className="space-y-3">
                            <h3 className="ppn-label" style={{ color: '#A8B5D1' }}>Screening Guidance</h3>
                            <div className={`p-5 rounded-2xl ${riskConfig.badgeBg}`}>
                              <p className="ppn-body text-slate-200">
                                {(analysisResult as InteractionRule).screening_note}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Washout note */}
                        {(analysisResult as InteractionRule).washout_note && (
                          <div className="space-y-3">
                            <h3 className="ppn-label" style={{ color: '#A8B5D1' }}>Washout Requirements</h3>
                            <div className="p-5 rounded-2xl bg-amber-900/20 border border-amber-500/30 flex items-start gap-3">
                              <span className="material-symbols-outlined text-amber-400 text-lg flex-shrink-0 mt-0.5" aria-hidden="true">timer</span>
                              <p className="ppn-body text-amber-200">
                                {(analysisResult as InteractionRule).washout_note}
                              </p>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {/* Right column: citation + no-override notice */}
                  <div className="lg:col-span-5 flex flex-col justify-end gap-4">

                    {/* Absolute contraindication hard-stop notice */}
                    {analysisResult.risk_bucket === 'ABSOLUTE_CONTRAINDICATION' && (
                      <div className="p-5 bg-red-900/30 border-2 border-red-500/60 rounded-2xl flex items-start gap-3" role="alert">
                        <span className="material-symbols-outlined text-red-400 text-xl flex-shrink-0 mt-0.5" aria-hidden="true">block</span>
                        <div>
                          <p className="text-sm font-black text-red-400 uppercase tracking-wider mb-1">Protocol Blocked</p>
                          <p className="ppn-body text-red-200">
                            This combination is an absolute contraindication. Session documentation cannot be completed while this medication is active.
                            The medication must be discontinued and the required washout period completed before proceeding.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Citation box */}
                    {analysisResult.isKnown && (
                      <div className="bg-black/60 border border-white/5 rounded-3xl p-8 shadow-2xl">
                        <p className="ppn-meta text-slate-500 mb-2 uppercase tracking-widest">Evidence Source</p>
                        <a
                          href={(analysisResult as InteractionRule).source_url || `https://pubmed.ncbi.nlm.nih.gov/?term=${encodeURIComponent((analysisResult as InteractionRule).evidence_source ?? '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm font-black text-primary hover:text-slate-300 uppercase tracking-widest flex items-center gap-1 transition-colors"
                        >
                          {(analysisResult as InteractionRule).evidence_source || 'PubMed / NLM'}
                          <span className="material-symbols-outlined text-xs">open_in_new</span>
                        </a>
                      </div>
                    )}

                    {/* Data gap: request link */}
                    {!analysisResult.isKnown && !((analysisResult as ErrorResult).isError) && (
                      <div className="bg-black/40 border border-slate-700/50 rounded-3xl p-6">
                        <p className="ppn-meta text-slate-500 mb-3 uppercase tracking-widest">Missing from database?</p>
                        <a
                          href="mailto:support@ppnportal.net?subject=Interaction%20Database%20Request"
                          className="text-sm font-black text-[#93c5fd] hover:text-[#bfdbfe] uppercase tracking-widest transition-colors flex items-center gap-2"
                        >
                          Request this combination be added
                          <span className="material-symbols-outlined text-xs">arrow_forward</span>
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Legal disclaimer */}
                <div className="mt-8 pt-6 border-t border-white/5">
                  <p className="ppn-meta text-slate-500 leading-relaxed">
                    DISCLAIMER: This tool is for clinical reference and harm reduction purposes only. It does not constitute medical advice.
                    Independent verification against current primary literature is required. Absence of a rule does not indicate safety.
                  </p>
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
