import React, { useState } from 'react';
import { useArcOfCareApi } from '../hooks/useArcOfCareApi';
import SetAndSettingCard from '../components/arc-of-care/SetAndSettingCard';
import ObservationSelector from '../components/common/ObservationSelector';
import RequestNewOptionModal from '../components/common/RequestNewOptionModal';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

/**
 * Wellness Journey Demo - Phase 1: Protocol Builder
 * 
 * Demonstrates baseline assessment submission and augmented intelligence
 * Part of WO_042
 * 
 * PHI COMPLIANCE: Uses controlled vocabulary (ObservationSelector) instead of free-text notes
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

        // Submit baseline assessment
        const result = await submitBaselineAssessment({
            subject_id: subjectId,
            site_id: siteId,
            expectancy_scale: expectancyScale,
            ace_score: aceScore,
            gad7_score: gad7Score,
            phq9_score: phq9Score,
            observation_ids: selectedObservations
        });

        if (result.success) {
            setSubmitted(true);

            // Fetch augmented intelligence prediction
            const aiResult = await fetchAugmentedIntelligence(subjectId);
            if (aiResult.success) {
                setPrediction(aiResult.data);
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#0a1628] p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="text-center space-y-4">
                    <h1 className="text-5xl font-black text-slate-300 tracking-tight">
                        Wellness Journey - Phase 1
                    </h1>
                    <p className="text-lg text-slate-300 max-w-3xl mx-auto">
                        Protocol Builder: Baseline Assessment & Augmented Intelligence
                    </p>
                </div>



                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left: Input Form */}
                    <div className="space-y-6">
                        <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                            <h2 className="text-2xl font-bold text-slate-300 mb-6">Baseline Assessment</h2>

                            {/* Expectancy Scale */}
                            <div className="space-y-2 mb-6">
                                <label className="text-slate-300 text-sm font-medium">
                                    Treatment Expectancy: {expectancyScale}
                                </label>
                                <input
                                    type="range"
                                    min="1"
                                    max="100"
                                    value={expectancyScale}
                                    onChange={(e) => setExpectancyScale(Number(e.target.value))}
                                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                                />
                                <p className="text-slate-300 text-sm">1 = No belief, 100 = Complete confidence</p>
                            </div>

                            {/* ACE Score */}
                            <div className="space-y-2 mb-6">
                                <label className="text-slate-300 text-sm font-medium">
                                    ACE Score: {aceScore}
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="10"
                                    value={aceScore}
                                    onChange={(e) => setAceScore(Number(e.target.value))}
                                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                                />
                                <p className="text-slate-300 text-sm">0 = No trauma, 10 = Severe childhood trauma</p>
                            </div>

                            {/* GAD-7 Score */}
                            <div className="space-y-2 mb-6">
                                <label className="text-slate-300 text-sm font-medium">
                                    GAD-7 Score: {gad7Score}
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="21"
                                    value={gad7Score}
                                    onChange={(e) => setGad7Score(Number(e.target.value))}
                                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                                />
                                <p className="text-slate-300 text-sm">0 = No anxiety, 21 = Severe anxiety</p>
                            </div>

                            {/* PHQ-9 Score */}
                            <div className="space-y-2 mb-6">
                                <label className="text-slate-300 text-sm font-medium">
                                    PHQ-9 Score: {phq9Score}
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="27"
                                    value={phq9Score}
                                    onChange={(e) => setPhq9Score(Number(e.target.value))}
                                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                />
                                <p className="text-slate-300 text-sm">0 = No depression, 27 = Severe depression</p>
                            </div>

                            {/* Clinical Observations (PHI-Safe) */}
                            <ObservationSelector
                                category="baseline"
                                selectedIds={selectedObservations}
                                onChange={setSelectedObservations}
                                onRequestNew={() => setShowRequestModal(true)}
                                className="mb-6"
                            />

                            {/* Submit Button */}
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-700 disabled:cursor-not-allowed text-slate-300 font-medium rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle className="w-5 h-5" />
                                        Submit Assessment
                                    </>
                                )}
                            </button>

                            {/* Error Message */}
                            {error && (
                                <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-red-300 text-sm font-medium">Error</p>
                                        <p className="text-red-200 text-sm">{error}</p>
                                    </div>
                                </div>
                            )}

                            {/* Success Message */}
                            {submitted && !error && (
                                <div className="mt-4 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-emerald-300 text-sm font-medium">Assessment Submitted</p>
                                        <p className="text-emerald-200 text-sm">Baseline data saved successfully</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right: Visualization */}
                    <div className="space-y-6">
                        <SetAndSettingCard
                            expectancyScale={expectancyScale}
                            aceScore={aceScore}
                            gad7Score={gad7Score}
                            phq9Score={phq9Score}
                        />

                        {/* Augmented Intelligence Prediction */}
                        {prediction && (
                            <div className="bg-slate-900/40 backdrop-blur-xl border border-emerald-500/30 rounded-2xl p-6">
                                <h3 className="text-emerald-400 text-xl font-bold mb-4">
                                    🧠 Augmented Intelligence Prediction
                                </h3>

                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-slate-800/50 rounded-lg p-4">
                                            <p className="text-slate-300 text-sm mb-1">Risk Level</p>
                                            <p className={`text-2xl font-bold ${prediction.riskLevel === 'low' ? 'text-emerald-400' :
                                                prediction.riskLevel === 'moderate' ? 'text-yellow-400' :
                                                    prediction.riskLevel === 'high' ? 'text-orange-400' :
                                                        'text-red-400'
                                                }`}>
                                                {prediction.riskLevel.toUpperCase()}
                                            </p>
                                        </div>

                                        <div className="bg-slate-800/50 rounded-lg p-4">
                                            <p className="text-slate-300 text-sm mb-1">Risk Score</p>
                                            <p className="text-2xl font-bold text-slate-300">{prediction.riskScore}/100</p>
                                        </div>
                                    </div>

                                    <div className="bg-slate-800/50 rounded-lg p-4">
                                        <p className="text-slate-300 text-sm mb-1">Recommended Sessions</p>
                                        <p className="text-3xl font-bold text-emerald-400">{prediction.sessionCount}</p>
                                        <p className="text-slate-300 text-sm mt-2">{prediction.schedule}</p>
                                    </div>

                                    <div className="bg-slate-800/50 rounded-lg p-4">
                                        <p className="text-slate-300 text-sm mb-2">Clinical Rationale</p>
                                        <p className="text-slate-300 text-sm leading-relaxed">{prediction.rationale}</p>
                                    </div>

                                    <div className="bg-slate-800/50 rounded-lg p-4">
                                        <p className="text-slate-300 text-sm mb-3">Risk Breakdown</p>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-slate-300 text-sm">ACE Risk</span>
                                                <span className="text-amber-400 font-medium">{prediction.breakdown.aceRisk}%</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-slate-300 text-sm">GAD-7 Risk</span>
                                                <span className="text-purple-400 font-medium">{prediction.breakdown.gad7Risk}%</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-slate-300 text-sm">Expectancy Risk</span>
                                                <span className="text-blue-400 font-medium">{prediction.breakdown.expectancyRisk}%</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-slate-300 text-sm">PHQ-9 Risk</span>
                                                <span className="text-cyan-400 font-medium">{prediction.breakdown.phq9Risk}%</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Request New Option Modal */}
                <RequestNewOptionModal
                    isOpen={showRequestModal}
                    onClose={() => setShowRequestModal(false)}
                    category="baseline"
                    type="observation"
                />
            </div>
        </div>
    );
};

export default ArcOfCareDemo;
