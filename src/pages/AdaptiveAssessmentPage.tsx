import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import AssessmentForm from '../components/arc-of-care/AssessmentForm';
import { MEQ30_SHORT_CONFIG } from '../config/meq30-short.config';
import { EDI_BRIEF_CONFIG } from '../config/edi-brief.config';
import { CEQ_BRIEF_CONFIG } from '../config/ceq-brief.config';
import { MEQ30_CONFIG } from '../config/meq30.config';
import { CheckCircle, ArrowLeft, AlertTriangle, TrendingUp, Sparkles, CheckSquare, Square, X } from 'lucide-react';

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

// WO-549: Assessment registry, each entry has a stable id, display name, and config key.
// Adding a new assessment means adding one entry here; no code changes needed elsewhere.
const ASSESSMENT_REGISTRY = [
    { id: 'meq', label: 'Quick Experience Check', sublabel: 'MEQ-Brief · ~2 min', required: true },
    { id: 'edi', label: 'Ego Dissolution Check', sublabel: 'EDI-Brief · ~1 min', required: false },
    { id: 'ceq', label: 'Challenge Check', sublabel: 'CEQ-Brief · ~1 min', required: false },
] as const;

type AssessmentId = typeof ASSESSMENT_REGISTRY[number]['id'];
type AssessmentPhase = 'selector' | 'quick' | 'expanded' | 'complete';
type CurrentAssessment = AssessmentId | 'none';

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

    // WO-549: Selector modal, defaults all assessments selected
    const [phase, setPhase] = useState<AssessmentPhase>('selector');
    const [selectedIds, setSelectedIds] = useState<Set<AssessmentId>>(
        new Set(ASSESSMENT_REGISTRY.map(a => a.id))
    );
    const [currentAssessment, setCurrentAssessment] = useState<CurrentAssessment>('none');
    const [scores, setScores] = useState<AssessmentScores>({});
    const [needsExpansion, setNeedsExpansion] = useState(false);
    const [expansionReason, setExpansionReason] = useState('');

    // Ordered list of assessments the practitioner chose to include
    const selectedAssessments = useMemo(
        () => ASSESSMENT_REGISTRY.filter(a => selectedIds.has(a.id)).map(a => a.id),
        [selectedIds]
    );

    // Helper: advance to the next selected assessment after current one completes or is skipped
    const advanceToNext = (after: AssessmentId, finalScores: AssessmentScores) => {
        const idx = selectedAssessments.indexOf(after);
        const next = selectedAssessments[idx + 1];
        if (next) {
            setCurrentAssessment(next);
        } else {
            // All done
            if (onComplete) {
                onComplete({
                    meq: finalScores.meq_full ?? finalScores.meq_brief ?? 0,
                    edi: finalScores.edi_brief ?? 0,
                    ceq: finalScores.ceq_brief ?? 0,
                });
            }
            setPhase('complete');
            setCurrentAssessment('none');
        }
    };

    // WO-558: baselinePhq9 removed, was hardcoded to 21 (dummy data).
    // The Predicted Journey stat block using this value has been removed from the
    // completion screen below. Real PHQ-9 data lives in log_longitudinal_assessments.

    const handleQuickMEQComplete = (responses: Record<string, number>, score: number) => {
        console.log('MEQ-Brief complete:', score);
        const updated = { ...scores, meq_brief: score };
        setScores(updated);

        // Check if expansion needed
        if (score < 40) {
            setNeedsExpansion(true);
            setExpansionReason('Your MEQ score correlates with a less intense mystical experience. We\'d like to gather more detail to better support your integration.');
            setPhase('expanded');
        } else {
            advanceToNext('meq', updated);
        }
    };

    const handleEDIComplete = (responses: Record<string, number>, score: number) => {
        console.log('EDI-Brief complete:', score);
        const updated = { ...scores, edi_brief: score };
        setScores(updated);
        advanceToNext('edi', updated);
    };

    const handleCEQComplete = (responses: Record<string, number>, score: number) => {
        console.log('CEQ-Brief complete:', score);
        const updated = { ...scores, ceq_brief: score };
        setScores(updated);

        // Check if expansion needed
        if (score > 60) {
            setNeedsExpansion(true);
            setExpansionReason('Your responses indicate you experienced significant challenges. We\'d like to understand this better to provide appropriate integration support.');
            setPhase('expanded');
            setCurrentAssessment('ceq');
        } else {
            advanceToNext('ceq', updated);
        }
    };

    const handleFullMEQComplete = (responses: Record<string, number>, score: number) => {
        console.log('MEQ-Full complete:', score);
        const updated = { ...scores, meq_full: score };
        setScores(updated);
        advanceToNext('meq', updated);
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

    // ── SELECTOR MODAL (WO-549) ────────────────────────────────────────────────
    if (phase === 'selector') {
        const toggleAssessment = (id: AssessmentId) => {
            const item = ASSESSMENT_REGISTRY.find(a => a.id === id)!;
            if (item.required) return; // MEQ is always required
            setSelectedIds(prev => {
                const next = new Set(prev);
                next.has(id) ? next.delete(id) : next.add(id);
                return next;
            });
        };

        const startFlow = () => {
            // Always start with MEQ if selected, otherwise first selected
            const first = selectedAssessments[0] ?? 'meq';
            setCurrentAssessment(first);
            setPhase('quick');
        };

        return (
            <div className="w-full h-full bg-[#0a1628] p-4 sm:p-6 lg:p-8">
                <div className="max-w-2xl mx-auto space-y-6">
                    {showBackButton && (
                        <button
                            onClick={() => onClose ? onClose() : navigate(-1)}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 rounded-lg text-base transition-all"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back
                        </button>
                    )}

                    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8">
                        <h2 className="text-2xl font-black text-slate-200 mb-1">Post-Session Assessments</h2>
                        <p className="text-slate-400 text-sm mb-6">Select the assessments to include for this session. Quick Experience Check is always required.</p>

                        <div className="space-y-3 mb-8">
                            {ASSESSMENT_REGISTRY.map(a => {
                                const isSelected = selectedIds.has(a.id);
                                return (
                                    <button
                                        key={a.id}
                                        onClick={() => toggleAssessment(a.id)}
                                        disabled={a.required}
                                        className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left ${isSelected
                                            ? 'bg-indigo-500/10 border-indigo-500/40 text-indigo-200'
                                            : 'bg-slate-800/40 border-slate-700/50 text-slate-400 hover:border-slate-600'
                                            } ${a.required ? 'opacity-80 cursor-default' : 'cursor-pointer'}`}
                                        aria-pressed={isSelected}
                                    >
                                        <span className={`text-xl ${isSelected ? 'text-indigo-400' : 'text-slate-600'}`}>
                                            {isSelected ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
                                        </span>
                                        <div className="flex-1">
                                            <p className="font-bold text-base">{a.label}</p>
                                            <p className={`text-xs mt-0.5 ${isSelected ? 'text-indigo-400/70' : 'text-slate-600'}`}>{a.sublabel}</p>
                                        </div>
                                        {a.required && (
                                            <span className="text-xs font-bold uppercase tracking-widest text-indigo-500/60 border border-indigo-500/20 px-2 py-0.5 rounded">Required</span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        <button
                            onClick={startFlow}
                            className="w-full py-4 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-black text-lg rounded-xl shadow-lg shadow-indigo-900/40 transition-all hover:scale-[1.01] active:scale-[0.99]"
                        >
                            Begin {selectedAssessments.length} Assessment{selectedAssessments.length !== 1 ? 's' : ''}
                        </button>

                        {onClose && (
                            <button
                                onClick={onClose}
                                className="w-full mt-3 py-2 text-slate-500 hover:text-slate-300 text-sm transition-colors"
                            >
                                <X className="w-3.5 h-3.5 inline mr-1.5" />
                                Cancel, return to session closeout
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // Completion screen
    if (phase === 'complete') {
        const finalMEQScore = scores.meq_full || scores.meq_brief || 0;
        const severityInfo = getSeverityInfo(finalMEQScore);

        return (
            // WO-549: overflow-hidden removes the spurious scrollbar on the completion screen
            <div className="w-full h-full bg-[#0a1628] p-4 sm:p-6 lg:p-8 overflow-hidden">
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


                    {/* WO-582: Score Summary removed from patient-facing view.
                        Raw scores (MEQ, EDI, CEQ) are written to the DB via onComplete()
                        above and visible in the practitioner clinical record — not here.
                        Patient sees only an affirming qualitative message. */}
                    <div className="backdrop-blur-xl border rounded-2xl p-8 bg-teal-500/5 border-teal-500/20">
                        <div className="text-center">
                            <div className="flex items-center justify-center mb-4">
                                <TrendingUp className="w-12 h-12 text-teal-400" />
                            </div>
                            <div className="text-xl font-bold text-teal-300 mb-3">
                                Your responses have been recorded
                            </div>
                            <p className="text-slate-300 text-base max-w-2xl mx-auto leading-relaxed">
                                Your practitioner will review your assessment and use it to guide your integration support. Every response helps shape a more personalised care plan.
                            </p>
                        </div>

                        {/* Next Steps */}
                        <div className="mt-8 pt-8 border-t border-slate-700/50">
                            <h3 className="text-slate-300 text-base font-bold mb-4">Next Steps</h3>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3 p-3 bg-slate-900/40 rounded-lg">
                                    <div className="w-6 h-6 rounded-full bg-teal-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <span className="text-teal-400 text-sm font-bold">1</span>
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

    // Progress bar: based on selectedAssessments order
    const selectedIdx = currentAssessment !== 'none' ? selectedAssessments.indexOf(currentAssessment) : 0;

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
                            {selectedIdx + 1} of {selectedAssessments.length}
                        </span>
                    </div>
                    <div className="flex gap-2">
                        {selectedAssessments.map((id, i) => (
                            <div
                                key={id}
                                className={`h-2 flex-1 rounded-full transition-all duration-300 ${i < selectedIdx
                                    ? 'bg-emerald-400'
                                    : i === selectedIdx
                                        ? 'bg-indigo-400'
                                        : 'bg-slate-700'
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Current assessment */}
            {currentAssessment === 'meq' && (
                <AssessmentForm
                    config={MEQ30_SHORT_CONFIG}
                    onComplete={handleQuickMEQComplete}
                    onSkip={() => advanceToNext('meq', scores)}
                />
            )}

            {currentAssessment === 'edi' && (
                <AssessmentForm
                    config={EDI_BRIEF_CONFIG}
                    onComplete={handleEDIComplete}
                    onSkip={() => advanceToNext('edi', scores)}
                />
            )}

            {currentAssessment === 'ceq' && (
                <AssessmentForm
                    config={CEQ_BRIEF_CONFIG}
                    onComplete={handleCEQComplete}
                    onSkip={() => advanceToNext('ceq', scores)}
                />
            )}
        </div>
    );
};

export default AdaptiveAssessmentPage;
