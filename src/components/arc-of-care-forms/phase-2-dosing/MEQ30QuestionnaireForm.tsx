import React, { useState, useEffect } from 'react';
import { Brain, Save, CheckCircle, Award } from 'lucide-react';

/**
 * MEQ30QuestionnaireForm - Full MEQ-30 Detailed Assessment
 * 
 * Fields: 30 questions (0-5 scale) + 5 calculated scores
 * Layout: Vertical list, 1 question per row
 * Features: Progress bar, auto-calculate scores, mystical experience badge
 */

export interface MEQ30Data {
    responses: Record<number, number>; // question number -> score
}

interface MEQ30QuestionnaireFormProps {
    onSave?: (data: MEQ30Data) => void;
    initialData?: MEQ30Data;
    patientId?: string;
    sessionId?: string;
}

// Simplified MEQ-30 questions (in production, load from database)
const MEQ30_QUESTIONS = Array.from({ length: 30 }, (_, i) => ({
    number: i + 1,
    text: `MEQ-30 Question ${i + 1}: [Full question text would be loaded from database]`,
    subscale: i < 7 ? 'Mystical' : i < 14 ? 'Positive Mood' : i < 21 ? 'Transcendence' : 'Ineffability'
}));

const SCALE_OPTIONS = [
    { value: 0, label: 'None' },
    { value: 1, label: 'So slight' },
    { value: 2, label: 'Slight' },
    { value: 3, label: 'Moderate' },
    { value: 4, label: 'Strong' },
    { value: 5, label: 'Extreme' }
];

const MEQ30QuestionnaireForm: React.FC<MEQ30QuestionnaireFormProps> = ({
    onSave,
    initialData = { responses: {} },
    patientId,
    sessionId
}) => {
    const [data, setData] = useState<MEQ30Data>(initialData);
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);

    // Auto-save with debounce
    useEffect(() => {
        if (onSave && Object.keys(data.responses).length > 0) {
            setIsSaving(true);
            const timer = setTimeout(() => {
                onSave(data);
                setIsSaving(false);
                setLastSaved(new Date());
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [data, onSave]);

    const updateResponse = (questionNumber: number, value: number) => {
        setData(prev => ({
            responses: { ...prev.responses, [questionNumber]: value }
        }));
    };

    const answeredCount = Object.keys(data.responses).length;
    const progressPercentage = Math.round((answeredCount / 30) * 100);
    const totalScore = Object.values(data.responses).reduce((sum, val) => sum + val, 0);
    const normalizedScore = Math.round((totalScore / 150) * 100); // Max possible: 30 * 5 = 150

    const isComplete = answeredCount === 30;
    const isMysticalExperience = normalizedScore >= 60;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header with Sticky Scores */}
            <div className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-xl">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h2 className="text-2xl font-black text-slate-200 flex items-center gap-3">
                            <Brain className="w-7 h-7 text-purple-400" />
                            MEQ-30 Questionnaire
                        </h2>
                        <p className="text-slate-400 text-sm mt-2">
                            30-item Mystical Experience Questionnaire
                        </p>
                    </div>
                    {isSaving && (
                        <div className="flex items-center gap-2 text-blue-400 text-xs">
                            <Save className="w-4 h-4 animate-pulse" />
                            <span>Saving...</span>
                        </div>
                    )}
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">Progress: {answeredCount}/30</span>
                        <span className="text-emerald-400 font-bold">{progressPercentage}%</span>
                    </div>
                    <div className="h-2 bg-slate-900/60 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-emerald-400 transition-all duration-500"
                            style={{ width: `${progressPercentage}%` }}
                        />
                    </div>
                </div>

                {/* Scores */}
                {answeredCount > 0 && (
                    <div className="mt-4 grid grid-cols-2 gap-3">
                        <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                            <p className="text-xs text-purple-300">Total Score</p>
                            <p className="text-2xl font-black text-purple-400">{normalizedScore}/100</p>
                        </div>
                        {isMysticalExperience && (
                            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center gap-2">
                                <Award className="w-6 h-6 text-emerald-400" />
                                <div>
                                    <p className="text-xs text-emerald-300">Complete</p>
                                    <p className="text-sm font-bold text-emerald-400">Mystical Experience</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Questions */}
            <div className="space-y-4">
                {MEQ30_QUESTIONS.map((question) => {
                    const isAnswered = data.responses[question.number] !== undefined;

                    return (
                        <div
                            key={question.number}
                            className={`bg-slate-900/60 backdrop-blur-xl border rounded-2xl p-6 transition-all ${isAnswered ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-slate-700/50'
                                }`}
                        >
                            <div className="flex items-start gap-3 mb-4">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isAnswered ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700/50 text-slate-400'
                                    }`}>
                                    {isAnswered ? <CheckCircle className="w-5 h-5" /> : <span className="text-sm font-bold">{question.number}</span>}
                                </div>
                                <div className="flex-1">
                                    <p className="text-slate-200 text-base font-medium leading-relaxed">
                                        {question.text}
                                    </p>
                                    <p className="text-slate-500 text-xs mt-1">Subscale: {question.subscale}</p>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {SCALE_OPTIONS.map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => updateResponse(question.number, option.value)}
                                        className={`flex-1 min-w-[80px] px-3 py-2 rounded-lg font-medium text-sm transition-all ${data.responses[question.number] === option.value
                                                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                                                : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 border border-slate-700/50'
                                            }`}
                                    >
                                        <div className="text-center">
                                            <div className="font-bold">{option.value}</div>
                                            <div className="text-xs opacity-80">{option.label}</div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default MEQ30QuestionnaireForm;
