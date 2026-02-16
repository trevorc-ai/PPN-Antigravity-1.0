import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AssessmentForm from '../components/arc-of-care/AssessmentForm';
import { MEQ30_CONFIG } from '../config/meq30.config';
import { CheckCircle, ArrowLeft } from 'lucide-react';

/**
 * MEQ-30 Assessment Page
 * 
 * Post-session assessment to measure mystical experience intensity
 * 
 * Administered:
 * - Immediately after session (within 24 hours)
 * - Takes ~5 minutes to complete
 * - Score ≥60 indicates "complete mystical experience"
 */

const MEQ30Page: React.FC = () => {
    const navigate = useNavigate();
    const [isComplete, setIsComplete] = useState(false);
    const [finalScore, setFinalScore] = useState<number | null>(null);

    const handleComplete = (responses: Record<string, number>, score: number) => {
        console.log('MEQ-30 Responses:', responses);
        console.log('MEQ-30 Score:', score);

        setFinalScore(score);
        setIsComplete(true);

        // TODO: Save to Supabase
        // await supabase.from('log_session_assessments').insert({
        //     session_id: sessionId,
        //     assessment_type: 'meq30',
        //     responses: responses,
        //     total_score: score
        // });
    };

    const handleSave = (responses: Record<string, number>) => {
        console.log('Auto-saving MEQ-30:', responses);
        // TODO: Auto-save to Supabase
    };

    const getSeverityInfo = (score: number) => {
        if (score >= 60) return {
            label: 'Complete Mystical Experience',
            color: 'text-emerald-400',
            bgColor: 'bg-emerald-500/10',
            borderColor: 'border-emerald-500/20',
            description: 'Score ≥60 indicates a complete mystical experience. Research shows 87% remission rate at 6 months for patients with this level of experience.',
            icon: '✨'
        };
        if (score >= 40) return {
            label: 'Strong Mystical Experience',
            color: 'text-blue-400',
            bgColor: 'bg-blue-500/10',
            borderColor: 'border-blue-500/20',
            description: 'Significant mystical elements present. Correlates with positive therapeutic outcomes.',
            icon: '🌟'
        };
        if (score >= 20) return {
            label: 'Moderate Mystical Experience',
            color: 'text-amber-400',
            bgColor: 'bg-amber-500/10',
            borderColor: 'border-amber-500/20',
            description: 'Some mystical elements present. May benefit from additional integration support.',
            icon: '⭐'
        };
        return {
            label: 'Minimal Mystical Experience',
            color: 'text-slate-400',
            bgColor: 'bg-slate-500/10',
            borderColor: 'border-slate-500/20',
            description: 'Limited mystical elements. Consider factors that may have influenced the experience.',
            icon: '💫'
        };
    };

    if (isComplete && finalScore !== null) {
        const severityInfo = getSeverityInfo(finalScore);

        return (
            <div className="min-h-screen bg-gradient-to-b from-[#0a1628] via-[#0d1b2a] to-[#05070a] p-4 sm:p-6 lg:p-8">
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
                            Thank you for completing the MEQ-30
                        </p>
                    </div>

                    {/* Score Card */}
                    <div className={`backdrop-blur-xl border rounded-2xl p-8 ${severityInfo.bgColor} ${severityInfo.borderColor}`}>
                        <div className="text-center mb-6">
                            <div className="text-6xl mb-4">{severityInfo.icon}</div>
                            <div className={`text-5xl font-black mb-2 ${severityInfo.color}`}>
                                {finalScore}/100
                            </div>
                            <div className={`text-xl font-bold mb-4 ${severityInfo.color}`}>
                                {severityInfo.label}
                            </div>
                            <p className="text-slate-300 text-sm max-w-2xl mx-auto leading-relaxed">
                                {severityInfo.description}
                            </p>
                        </div>

                        {/* Subscale Breakdown (Optional) */}
                        <div className="mt-8 pt-8 border-t border-slate-700/50">
                            <h3 className="text-slate-200 text-sm font-bold mb-4 text-center">
                                What This Means
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div className="p-3 bg-slate-900/40 rounded-lg">
                                    <p className="text-slate-400 mb-1">Clinical Significance</p>
                                    <p className="text-slate-200">
                                        {finalScore >= 60
                                            ? 'Strongly predictive of sustained therapeutic benefit'
                                            : 'May benefit from additional integration sessions'}
                                    </p>
                                </div>
                                <div className="p-3 bg-slate-900/40 rounded-lg">
                                    <p className="text-slate-400 mb-1">Next Steps</p>
                                    <p className="text-slate-200">
                                        {finalScore >= 60
                                            ? 'Continue with standard integration protocol'
                                            : 'Schedule follow-up with therapist to discuss experience'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-center gap-4">
                        <button
                            onClick={() => navigate('/arc-of-care-god-view')}
                            className="flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg font-medium transition-all"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Dashboard
                        </button>
                        <button
                            onClick={() => {
                                // TODO: Navigate to next assessment (EDI)
                                alert('EDI assessment coming soon!');
                            }}
                            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-all"
                        >
                            Continue to EDI Assessment
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0a1628] via-[#0d1b2a] to-[#05070a] p-4 sm:p-6 lg:p-8">
            {/* Back Button */}
            <div className="max-w-4xl mx-auto mb-6">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 rounded-lg text-sm transition-all"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </button>
            </div>

            {/* Assessment Form */}
            <AssessmentForm
                config={MEQ30_CONFIG}
                onComplete={handleComplete}
                onSave={handleSave}
            />
        </div>
    );
};

export default MEQ30Page;
