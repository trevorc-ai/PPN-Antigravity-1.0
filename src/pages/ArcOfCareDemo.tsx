import React, { useState } from 'react';
import { useArcOfCareApi } from '../hooks/useArcOfCareApi';
import SetAndSettingCard from '../components/arc-of-care/SetAndSettingCard';
import ObservationSelector from '../components/common/ObservationSelector';
import RequestNewOptionModal from '../components/common/RequestNewOptionModal';
import { Loader2, CheckCircle, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

/** Collapsible accordion section */
const AccordionSection: React.FC<{
    title: string;
    subtitle?: string;
    defaultOpen?: boolean;
    children: React.ReactNode;
}> = ({ title, subtitle, defaultOpen = true, children }) => {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden">
            <button
                type="button"
                onClick={() => setOpen(v => !v)}
                className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-800/30 transition-colors group"
                aria-expanded={open}
            >
                <div className="text-left">
                    <h2 className="text-base font-bold text-slate-200">{title}</h2>
                    {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
                </div>
                {open
                    ? <ChevronUp className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-colors flex-shrink-0" />
                    : <ChevronDown className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-colors flex-shrink-0" />
                }
            </button>
            {open && <div className="px-6 pb-6">{children}</div>}
        </div>
    );
};

/**
 * Wellness Journey Demo - Phase 1: Protocol Builder
 *
 * Demonstrates baseline assessment submission and augmented intelligence.
 * Layout: single-column vertical stack with collapsible accordion sections.
 * Part of WO_042
 *
 * PHI COMPLIANCE: Uses controlled vocabulary (ObservationSelector) instead of free-text notes.
 */
const ArcOfCareDemo: React.FC = () => {
    const { submitBaselineAssessment, fetchAugmentedIntelligence, loading, error, clearError } = useArcOfCareApi();

    // Form state
    const [subjectId] = useState('DEMO-001');
    const [siteId] = useState(1);
    const [expectancyScale, setExpectancyScale] = useState(75);
    const [aceScore, setAceScore] = useState(3);
    const [gad7Score, setGad7Score] = useState(8);
    const [phq9Score, setPhq9Score] = useState(12);
    const [selectedObservations, setSelectedObservations] = useState<number[]>([]);
    const [showRequestModal, setShowRequestModal] = useState(false);

    // Result state
    const [submitted, setSubmitted] = useState(false);
    const [prediction, setPrediction] = useState<any>(null);

    const handleSubmit = async () => {
        clearError();
        setSubmitted(false);
        setPrediction(null);

        const result = await submitBaselineAssessment({
            subject_id: subjectId,
            site_id: siteId,
            expectancy_scale: expectancyScale,
            ace_score: aceScore,
            gad7_score: gad7Score,
            phq9_score: phq9Score,
            observation_ids: selectedObservations,
        } as any);

        if (result.success) {
            setSubmitted(true);
            const aiResult = await fetchAugmentedIntelligence(subjectId);
            if (aiResult.success) {
                setPrediction(aiResult.data);
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#0a1628] p-8">
            <div className="max-w-3xl mx-auto space-y-4">

                {/* Header */}
                <div className="text-center space-y-2 pb-2">
                    <h1 className="text-4xl font-black text-slate-200 tracking-tight">
                        Wellness Journey — Phase 1
                    </h1>
                    <p className="text-sm text-slate-500">
                        Protocol Builder: Baseline Assessment &amp; Augmented Intelligence
                    </p>
                </div>

                {/* ── 1. Baseline Assessment accordion ── */}
                <AccordionSection
                    title="Baseline Assessment"
                    subtitle="Adjust scores to model the patient's clinical profile"
                    defaultOpen={true}
                >
                    <div className="space-y-6 pt-2">

                        {/* Treatment Expectancy */}
                        <div className="space-y-2">
                            <label className="text-slate-300 text-sm font-medium">
                                Treatment Expectancy: {expectancyScale}
                            </label>
                            <input
                                type="range" min="1" max="100" value={expectancyScale}
                                onChange={(e) => setExpectancyScale(Number(e.target.value))}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                            />
                            <p className="text-slate-500 text-xs">1 = No belief, 100 = Complete confidence</p>
                        </div>

                        {/* ACE Score */}
                        <div className="space-y-2">
                            <label className="text-slate-300 text-sm font-medium">
                                ACE Score: {aceScore}
                            </label>
                            <input
                                type="range" min="0" max="10" value={aceScore}
                                onChange={(e) => setAceScore(Number(e.target.value))}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                            />
                            <p className="text-slate-500 text-xs">0 = No trauma, 10 = Severe childhood trauma</p>
                        </div>

                        {/* GAD-7 */}
                        <div className="space-y-2">
                            <label className="text-slate-300 text-sm font-medium">
                                GAD-7 Score: {gad7Score}
                            </label>
                            <input
                                type="range" min="0" max="21" value={gad7Score}
                                onChange={(e) => setGad7Score(Number(e.target.value))}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                            />
                            <p className="text-slate-500 text-xs">0 = No anxiety, 21 = Severe anxiety</p>
                        </div>

                        {/* PHQ-9 */}
                        <div className="space-y-2">
                            <label className="text-slate-300 text-sm font-medium">
                                PHQ-9 Score: {phq9Score}
                            </label>
                            <input
                                type="range" min="0" max="27" value={phq9Score}
                                onChange={(e) => setPhq9Score(Number(e.target.value))}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                            />
                            <p className="text-slate-500 text-xs">0 = No depression, 27 = Severe depression</p>
                        </div>

                        {/* Clinical Observations */}
                        <ObservationSelector
                            category="baseline"
                            selectedIds={selectedObservations}
                            onChange={setSelectedObservations}
                            onRequestNew={() => setShowRequestModal(true)}
                        />

                        {/* Submit */}
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
                        >
                            {loading
                                ? <><Loader2 className="w-5 h-5 animate-spin" />Submitting...</>
                                : <><CheckCircle className="w-5 h-5" />Submit Assessment</>
                            }
                        </button>

                        {/* Feedback */}
                        {error && (
                            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-red-300 text-sm font-medium">Error</p>
                                    <p className="text-red-200 text-sm">{error}</p>
                                </div>
                            </div>
                        )}
                        {submitted && !error && (
                            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-emerald-300 text-sm font-medium">Assessment Submitted</p>
                                    <p className="text-emerald-200 text-sm">Baseline data saved successfully</p>
                                </div>
                            </div>
                        )}
                    </div>
                </AccordionSection>

                {/* ── 2. Set & Setting Analysis accordion ── */}
                <AccordionSection
                    title="Set &amp; Setting Analysis"
                    subtitle="Live visualizations — updates as you adjust scores above"
                    defaultOpen={true}
                >
                    <div className="pt-2">
                        <SetAndSettingCard
                            expectancyScale={expectancyScale}
                            aceScore={aceScore}
                            gad7Score={gad7Score}
                            phq9Score={phq9Score}
                        />
                    </div>
                </AccordionSection>

                {/* ── 3. AI Prediction — only after submit ── */}
                {prediction && (
                    <AccordionSection
                        title="🧠 Augmented Intelligence Prediction"
                        subtitle="Algorithm-generated integration recommendations"
                        defaultOpen={true}
                    >
                        <div className="space-y-4 pt-2">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-800/50 rounded-xl p-4">
                                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Risk Level</p>
                                    <p className={`text-2xl font-black ${prediction.riskLevel === 'low' ? 'text-emerald-400' :
                                            prediction.riskLevel === 'moderate' ? 'text-yellow-400' :
                                                prediction.riskLevel === 'high' ? 'text-orange-400' : 'text-red-400'
                                        }`}>
                                        {prediction.riskLevel.toUpperCase()}
                                    </p>
                                </div>
                                <div className="bg-slate-800/50 rounded-xl p-4">
                                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Risk Score</p>
                                    <p className="text-2xl font-black text-slate-200">{prediction.riskScore}/100</p>
                                </div>
                            </div>
                            <div className="bg-slate-800/50 rounded-xl p-4">
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Recommended Sessions</p>
                                <p className="text-3xl font-black text-emerald-400">{prediction.sessionCount}</p>
                                <p className="text-slate-400 text-sm mt-1">{prediction.schedule}</p>
                            </div>
                            <div className="bg-slate-800/50 rounded-xl p-4">
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Clinical Rationale</p>
                                <p className="text-slate-300 text-sm leading-relaxed">{prediction.rationale}</p>
                            </div>
                        </div>
                    </AccordionSection>
                )}

            </div>

            <RequestNewOptionModal
                isOpen={showRequestModal}
                onClose={() => setShowRequestModal(false)}
                category="baseline"
                type="observation"
            />
        </div>
    );
};

export default ArcOfCareDemo;
