import React, { useState, useEffect } from 'react';
import { CheckCircle, ChevronLeft, ChevronRight, Save } from 'lucide-react';
import { AdvancedTooltip } from '../ui/AdvancedTooltip';

/**
 * Reusable Assessment Form Component
 * 
 * Used for MEQ-30, EDI, CEQ, and other standardized assessments
 * 
 * Features:
 * - Multi-page with progress indicator
 * - Auto-save on answer change
 * - Visual feedback (score calculation)
 * - Mobile-friendly (large touch targets)
 * - Accessible (keyboard navigation)
 */

export interface AssessmentQuestion {
    id: string;
    text: string;
    subscale?: string;
    tooltip?: string; // WO-113
    citation?: string; // WO-113
    type: 'likert' | 'slider';
    min: number;
    max: number;
    labels?: { value: number; label: string }[];
}

export interface AssessmentConfig {
    id: string;
    name: string;
    shortName: string;
    description: string;
    questions: AssessmentQuestion[];
    questionsPerPage: number;
    scoring: {
        method: 'sum' | 'average';
        normalize?: { from: number; to: number };
    };
}

interface AssessmentFormProps {
    config: AssessmentConfig;
    onComplete: (responses: Record<string, number>, score: number) => void;
    onSave?: (responses: Record<string, number>) => void;
    initialResponses?: Record<string, number>;
}

const AssessmentForm: React.FC<AssessmentFormProps> = ({
    config,
    onComplete,
    onSave,
    initialResponses = {}
}) => {
    const [responses, setResponses] = useState<Record<string, number>>(initialResponses);
    const [currentPage, setCurrentPage] = useState(0);
    const [isSaving, setIsSaving] = useState(false);

    const totalPages = Math.ceil(config.questions.length / config.questionsPerPage);
    const startIdx = currentPage * config.questionsPerPage;
    const endIdx = Math.min(startIdx + config.questionsPerPage, config.questions.length);
    const currentQuestions = config.questions.slice(startIdx, endIdx);

    // Calculate progress
    const answeredCount = Object.keys(responses).length;
    const progressPercentage = Math.round((answeredCount / config.questions.length) * 100);

    // Calculate score
    const calculateScore = () => {
        const values = Object.values(responses) as number[];
        if (values.length === 0) return 0;

        let rawScore = 0;
        if (config.scoring.method === 'sum') {
            rawScore = values.reduce((sum, val) => sum + val, 0);
        } else {
            rawScore = values.reduce((sum, val) => sum + val, 0) / values.length;
        }

        // Normalize if needed
        if (config.scoring.normalize) {
            const { from, to } = config.scoring.normalize;
            rawScore = (rawScore / from) * to;
        }

        return Math.round(rawScore);
    };

    const currentScore = calculateScore();

    // Auto-save on response change
    useEffect(() => {
        if (onSave && Object.keys(responses).length > 0) {
            setIsSaving(true);
            const timer = setTimeout(() => {
                onSave(responses);
                setIsSaving(false);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [responses, onSave]);

    const handleResponse = (questionId: string, value: number) => {
        setResponses(prev => ({ ...prev, [questionId]: value }));
    };

    const handleNext = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(prev => prev + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handlePrevious = () => {
        if (currentPage > 0) {
            setCurrentPage(prev => prev - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleComplete = () => {
        // Always allow completion — assessment is optional, partial saves are valid
        onComplete(responses, currentScore);
    };

    const isComplete = answeredCount === config.questions.length;
    const canGoNext = currentPage < totalPages - 1;
    const canGoPrevious = currentPage > 0;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h2 className="text-2xl font-black text-slate-300">{config.name}</h2>
                        <p className="text-slate-300 text-base mt-1">{config.description}</p>
                    </div>
                    {isSaving && (
                        <div className="flex items-center gap-2 text-blue-400 text-sm">
                            <Save className="w-4 h-4 animate-pulse" />
                            <span>Saving...</span>
                        </div>
                    )}
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-300">
                            Progress: {answeredCount}/{config.questions.length} questions
                        </span>
                        <span className="text-emerald-400 font-bold">{progressPercentage}%</span>
                    </div>
                    <div className="h-2 bg-slate-900/60 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-emerald-400 transition-all duration-500"
                            style={{ width: `${progressPercentage}%` }}
                        />
                    </div>
                </div>

                {/* Current Score */}
                {answeredCount > 0 && (
                    <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                        <div className="flex items-center justify-between">
                            <span className="text-emerald-300 text-base font-semibold">
                                Current {config.shortName} Score
                            </span>
                            <span className="text-2xl font-black text-emerald-400">
                                {currentScore}/100
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* Questions */}
            <div className="space-y-8">
                {currentQuestions.map((question, idx) => {
                    const questionNumber = startIdx + idx + 1;
                    const isAnswered = responses[question.id] !== undefined;

                    return (
                        <div
                            key={question.id}
                            className={`bg-slate-900/60 backdrop-blur-xl border rounded-2xl p-8 transition-all ${isAnswered
                                ? 'border-emerald-500/50 bg-emerald-500/5'
                                : 'border-slate-700/50'
                                }`}
                        >
                            {/* Question Header */}
                            <div className="flex items-start gap-4 mb-6">
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${isAnswered
                                        ? 'bg-emerald-500/20 text-emerald-400'
                                        : 'bg-slate-700/50 text-slate-300'
                                        }`}
                                >
                                    {isAnswered ? (
                                        <CheckCircle className="w-6 h-6" />
                                    ) : (
                                        <span className="text-base font-bold">{questionNumber}</span>
                                    )}
                                </div>
                                <div className="flex-1 space-y-2">
                                    <div className="flex items-center gap-2">
                                        <p className="text-slate-300 text-2xl font-bold leading-relaxed">
                                            {question.text}
                                        </p>
                                        {question.tooltip && (
                                            <AdvancedTooltip content={question.tooltip} tier="standard">
                                                <span className="material-symbols-outlined text-slate-500 hover:text-primary cursor-help text-lg">help</span>
                                            </AdvancedTooltip>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-4">
                                        {question.subscale && (
                                            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-sm font-medium uppercase tracking-wider">
                                                {question.subscale}
                                            </span>
                                        )}
                                        {question.citation && (
                                            <span className="text-slate-500 text-sm italic">
                                                Ref: {question.citation}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Response Options */}
                            {question.type === 'likert' && (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                                    {question.labels?.map((option) => (
                                        <button
                                            key={option.value}
                                            onClick={() => handleResponse(question.id, option.value)}
                                            className={`flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all border ${responses[question.id] === option.value
                                                ? 'bg-emerald-500 border-emerald-400 text-white shadow-lg shadow-emerald-500/20 transform scale-[1.02]'
                                                : 'bg-slate-800/60 border-slate-700/50 text-slate-200 hover:bg-slate-700/60 hover:border-slate-600'
                                                }`}
                                        >
                                            <span className="text-base font-black mb-0.5">{option.value}</span>
                                            <span className={`text-xs font-medium text-center leading-tight ${responses[question.id] === option.value ? 'text-white/90' : 'text-slate-400'}`}>
                                                {option.label}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            )}

                            {question.type === 'slider' && (
                                <div className="space-y-3">
                                    <input
                                        type="range"
                                        min={question.min}
                                        max={question.max}
                                        value={responses[question.id] ?? 50}
                                        onChange={(e) =>
                                            handleResponse(question.id, parseInt(e.target.value))
                                        }
                                        className="w-full h-5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500 assessment-slider"
                                    />
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-slate-300">{question.min}</span>
                                        <span className="text-emerald-400 font-bold text-lg">
                                            {responses[question.id] ?? 50}
                                        </span>
                                        <span className="text-slate-300">{question.max}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Navigation */}
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                <div className="flex items-center justify-between">
                    <button
                        onClick={handlePrevious}
                        disabled={!canGoPrevious}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${canGoPrevious
                            ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                            : 'bg-slate-800/50 text-slate-600 cursor-not-allowed'
                            }`}
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Previous
                    </button>

                    <div className="text-center">
                        <p className="text-slate-300 text-sm">
                            Page {currentPage + 1} of {totalPages}
                        </p>
                    </div>

                    {canGoNext ? (
                        <button
                            onClick={handleNext}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-slate-300 rounded-lg font-medium transition-all"
                        >
                            Next
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    ) : (
                        <button
                            onClick={handleComplete}
                            className="flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/30"
                        >
                            <CheckCircle className="w-5 h-5" />
                            Complete Assessment
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AssessmentForm;
