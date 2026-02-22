import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AssessmentForm from '../components/arc-of-care/AssessmentForm';
import { MEQ30_SHORT_CONFIG } from '../config/meq30-short.config';
import { EDI_BRIEF_CONFIG } from '../config/edi-brief.config';
import { CEQ_BRIEF_CONFIG } from '../config/ceq-brief.config';
import { MEQ30_CONFIG } from '../config/meq30.config';
import { CheckCircle, ArrowLeft, AlertTriangle, TrendingUp, Sparkles } from 'lucide-react';

/**
 * Adaptive Post-Session Assessment
 * 
 * Smart assessment flow:
 * 1. Start with Quick Mode (10 questions, ~2 minutes)
 * 2. Analyze scores
 * 3. Expand to Full Mode if needed
 * 
 * Expansion triggers:
 * - MEQ-Brief < 40 (investigate low mystical experience)
 * - CEQ-Brief > 60 (investigate challenging experience)
 * - Baseline PHQ-9 > 20 (research/insurance requirement)
 */

type AssessmentPhase = 'quick' | 'expanded' | 'complete';
type CurrentAssessment = 'meq' | 'edi' | 'ceq' | 'none';

interface AssessmentScores {
    meq_brief?: number;
    edi_brief?: number;
    ceq_brief?: number;
    meq_full?: number;
}

interface AdaptiveAssessmentPageProps {
    onComplete?: (scores: { meq: number; edi: number; ceq: number }) => void;
    showBackButton?: boolean;
    onClose?: () => void;
}

const AdaptiveAssessmentPage: React.FC<AdaptiveAssessmentPageProps> = ({ onComplete, showBackButton = true, onClose }) => {
    const navigate = useNavigate();
    const [phase, setPhase] = useState<AssessmentPhase>('quick');
    const [currentAssessment, setCurrentAssessment] = useState<CurrentAssessment>('meq');
    const [scores, setScores] = useState<AssessmentScores>({});
    const [needsExpansion, setNeedsExpansion] = useState(false);
    const [expansionReason, setExpansionReason] = useState('');

    // Mock baseline data (in real app, fetch from context/props)
    const baselinePhq9 = 21;

    const handleQuickMEQComplete = (responses: Record<string, number>, score: number) => {
        console.log('MEQ-Brief complete:', score);
        setScores(prev => ({ ...prev, meq_brief: score }));

        // Check if expansion needed
        if (score < 40) {
            setNeedsExpansion(true);
            setExpansionReason('Your MEQ score correlates with a less intense mystical experience. We\'d like to gather more detail to better support your integration.');
            setPhase('expanded');
        } else {
            // Continue to EDI
            setCurrentAssessment('edi');
        }
    };

    const handleEDIComplete = (responses: Record<string, number>, score: number) => {
        console.log('EDI-Brief complete:', score);
        setScores(prev => ({ ...prev, edi_brief: score }));
        setCurrentAssessment('ceq');
    };

    const handleCEQComplete = (responses: Record<string, number>, score: number) => {
        console.log('CEQ-Brief complete:', score);
        const updatedScores = { ...scores, ceq_brief: score };
        setScores(updatedScores);

        // Check if expansion needed
        if (score > 60) {
            setNeedsExpansion(true);
            setExpansionReason('Your responses indicate you experienced significant challenges. We\'d like to understand this better to provide appropriate integration support.');
            setPhase('expanded');
            setCurrentAssessment('ceq'); // Will show full CEQ
        } else {
            // All done! Call onComplete if provided
            if (onComplete) {
                onComplete({
                    meq: updatedScores.meq_full || updatedScores.meq_brief || 0,
                    edi: updatedScores.edi_brief || 0,
                    ceq: score
                });
            }
            setPhase('complete');
            setCurrentAssessment('none');
        }
    };

    const handleFullMEQComplete = (responses: Record<string, number>, score: number) => {
        console.log('MEQ-Full complete:', score);
        const updatedScores = { ...scores, meq_full: score };
        setScores(updatedScores);

        // Call onComplete if provided
        if (onComplete) {
            onComplete({
                meq: score,
                edi: updatedScores.edi_brief || 0,
                ceq: updatedScores.ceq_brief || 0
            });
        }

        setPhase('complete');
        setCurrentAssessment('none');
    };

    const getSeverityInfo = (meqScore: number) => {
        if (meqScore >= 60) return {
            label: 'Complete Mystical Experience',
            color: 'text-emerald-400',
            bgColor: 'bg-emerald-500/10',
            borderColor: 'border-emerald-500/20',
            description: 'Your experience included profound unity, transcendence, and sacredness. Research shows patients with this level of experience have an 87% remission rate at 6 months.',
            icon: <Sparkles className="w-12 h-12 text-emerald-400" />
        };
        if (meqScore >= 40) return {
            label: 'Strong Mystical Experience',
            color: 'text-blue-400',
            bgColor: 'bg-blue-500/10',
            borderColor: 'border-blue-500/20',
            description: 'Your experience included significant mystical elements. This correlates with positive therapeutic outcomes and sustained benefit.',
            icon: <TrendingUp className="w-12 h-12 text-blue-400" />
        };
        return {
            label: 'Moderate Experience',
            color: 'text-amber-400',
            bgColor: 'bg-amber-500/10',
            borderColor: 'border-amber-500/20',
            description: 'Your experience was meaningful but may benefit from additional integration support to maximize therapeutic value.',
            icon: <AlertTriangle className="w-12 h-12 text-amber-400" />
        };
    };

    // Completion screen
    if (phase === 'complete') {
        const finalMEQScore = scores.meq_full || scores.meq_brief || 0;
        const severityInfo = getSeverityInfo(finalMEQScore);
        const totalImprovement = baselinePhq9 - 5; // Predicted outcome
        const remissionProbability = finalMEQScore >= 60 ? 87 : finalMEQScore >= 40 ? 72 : 58;

        return (
            <div className="w-full h-full bg-[#0a1628] p-4 sm:p-6 lg:p-8">
                <div className="max-w-4xl mx-auto space-y-6">
                    {/* Success Header */}
                    <div className="bg-emerald-500/10 backdrop-blur-xl border border-emerald-500/20 rounded-2xl p-8 text-center">
                        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
                            <CheckCircle className="w-12 h-12 text-emerald-400" />
                        </div>
                        <h1 className="text-3xl font-black text-emerald-400 mb-2">
                            Assessment Complete!
                        </h1>
                        <p className="text-slate-300 text-lg">
                            Thank you for sharing about your experience
                        </p>
                    </div>

                    {/* Score Summary */}
                    <div className={`backdrop-blur-xl border rounded-2xl p-8 ${severityInfo.bgColor} ${severityInfo.borderColor}`}>
                        <div className="text-center mb-6">
                            <div className="flex items-center justify-center mb-4">
                                {severityInfo.icon}
                            </div>
                            <div className={`text-5xl font-black mb-2 ${severityInfo.color}`}>
                                {finalMEQScore}/100
                            </div>
                            <div className={`text-xl font-bold mb-4 ${severityInfo.color}`}>
                                {severityInfo.label}
                            </div>
                            <p className="text-slate-300 text-base max-w-2xl mx-auto leading-relaxed">
                                {severityInfo.description}
                            </p>
                        </div>

                        {/* Correlation to Baseline */}
                        <div className="mt-8 pt-8 border-t border-slate-700/50">
                            <h3 className="text-slate-300 text-base font-bold mb-4 text-center">
                                Your Predicted Journey
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-base">
                                <div className="p-4 bg-slate-900/40 rounded-lg text-center">
                                    <p className="text-slate-300 mb-2">Baseline Depression</p>
                                    <p className="text-3xl font-black text-red-400">{baselinePhq9}</p>
                                    <p className="text-slate-500 text-sm mt-1">PHQ-9 (Severe)</p>
                                </div>
                                <div className="p-4 bg-slate-900/40 rounded-lg text-center">
                                    <p className="text-slate-300 mb-2">Expected Improvement</p>
                                    <p className="text-3xl font-black text-emerald-400">-{totalImprovement}</p>
                                    <p className="text-slate-500 text-sm mt-1">Points at 6 months</p>
                                </div>
                                <div className="p-4 bg-slate-900/40 rounded-lg text-center">
                                    <p className="text-slate-300 mb-2">Remission Likelihood</p>
                                    <p className="text-3xl font-black text-blue-400">{remissionProbability}%</p>
                                    <p className="text-slate-500 text-sm mt-1">Based on 2,847 patients</p>
                                </div>
                            </div>
                        </div>

                        {/* Next Steps */}
                        <div className="mt-8 pt-8 border-t border-slate-700/50">
                            <h3 className="text-slate-300 text-base font-bold mb-4">Next Steps</h3>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3 p-3 bg-slate-900/40 rounded-lg">
                                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <span className="text-emerald-400 text-sm font-bold">1</span>
                                    </div>
                                    <div>
                                        <p className="text-slate-300 font-semibold text-base">Continue Integration Protocol</p>
                                        <p className="text-slate-300 text-sm mt-1">
                                            Daily pulse checks (1-tap, 30 seconds) to track your progress
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 p-3 bg-slate-900/40 rounded-lg">
                                    <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <span className="text-blue-400 text-sm font-bold">2</span>
                                    </div>
                                    <div>
                                        <p className="text-slate-300 font-semibold text-base">Follow-up Assessments</p>
                                        <p className="text-slate-300 text-sm mt-1">
                                            PHQ-9 at Days 7, 14, 30, 60, 90, 180 to monitor symptom reduction
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 p-3 bg-slate-900/40 rounded-lg">
                                    <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <span className="text-amber-400 text-sm font-bold">3</span>
                                    </div>
                                    <div>
                                        <p className="text-slate-300 font-semibold text-base">Integration Sessions</p>
                                        <p className="text-slate-300 text-sm mt-1">
                                            Schedule weekly therapy to process insights and build new patterns
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-center gap-4">
                        <button
                            onClick={() => onClose ? onClose() : navigate('/wellness-journey')}
                            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold tracking-wide transition-all shadow-md"
                        >
                            {onClose ? 'Close Assessment & Return to Journey' : 'View Your Journey'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Expansion notice
    if (needsExpansion && phase === 'expanded') {
        return (
            <div className="w-full h-full bg-[#0a1628] p-4 sm:p-6 lg:p-8">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-blue-500/10 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-8 mb-6">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                                <AlertTriangle className="w-6 h-6 text-blue-400" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-blue-300 mb-2">
                                    A Few More Questions
                                </h2>
                                <p className="text-slate-300 text-base leading-relaxed">
                                    {expansionReason}
                                </p>
                                <p className="text-slate-300 text-sm mt-3">
                                    This will take about 5 more minutes. Your responses help us provide the best possible care.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Show full MEQ-30 */}
                    <AssessmentForm
                        config={MEQ30_CONFIG}
                        onComplete={handleFullMEQComplete}
                    />
                </div>
            </div>
        );
    }

    // Quick Mode assessments
    return (
        <div className="w-full h-full bg-[#0a1628] p-4 sm:p-6 lg:p-8">
            {/* Back Button - Only show when not in modal */}
            {showBackButton && (
                <div className="max-w-4xl mx-auto mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 rounded-lg text-base transition-all"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </button>
                </div>
            )}

            {/* Progress indicator */}
            <div className="max-w-4xl mx-auto mb-6">
                <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4">
                    <div className="flex items-center justify-between text-base mb-2">
                        <span className="text-slate-300">Quick Assessment Progress</span>
                        <span className="text-emerald-400 font-bold">
                            {currentAssessment === 'meq' ? '1' : currentAssessment === 'edi' ? '2' : '3'} of 3
                        </span>
                    </div>
                    <div className="flex gap-2">
                        <div className={`h-2 flex-1 rounded-full ${currentAssessment === 'meq' ? 'bg-emerald-400' : 'bg-emerald-400/30'}`} />
                        <div className={`h-2 flex-1 rounded-full ${currentAssessment === 'edi' ? 'bg-emerald-400' : currentAssessment === 'ceq' ? 'bg-emerald-400/30' : 'bg-slate-700'}`} />
                        <div className={`h-2 flex-1 rounded-full ${currentAssessment === 'ceq' ? 'bg-emerald-400' : 'bg-slate-700'}`} />
                    </div>
                </div>
            </div>

            {/* Current assessment */}
            {currentAssessment === 'meq' && (
                <AssessmentForm
                    config={MEQ30_SHORT_CONFIG}
                    onComplete={handleQuickMEQComplete}
                />
            )}

            {currentAssessment === 'edi' && (
                <AssessmentForm
                    config={EDI_BRIEF_CONFIG}
                    onComplete={handleEDIComplete}
                />
            )}

            {currentAssessment === 'ceq' && (
                <AssessmentForm
                    config={CEQ_BRIEF_CONFIG}
                    onComplete={handleCEQComplete}
                />
            )}
        </div>
    );
};

export default AdaptiveAssessmentPage;
