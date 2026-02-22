import React, { useState } from 'react';
import { Brain, Save, CheckCircle, Award, ChevronDown } from 'lucide-react';
import { FormFooter } from '../shared/FormFooter';

/**
 * MEQ30QuestionnaireForm - Full MEQ-30 Detailed Assessment
 *
 * Fields: 30 questions (0-5 scale) + 5 calculated scores
 * Layout: Vertical list, 1 question per row
 * Features:
 *   - Sticky header progress bar
 *   - Auto-save on every answer (debounced)
 *   - "Save & Done" footer after the last question — the ONLY exit for long-form flows
 *   - onComplete closes the SlideOutPanel without extra scrolling
 */

export interface MEQ30Data {
    responses: Record<number, number>; // question number → score
}

interface MEQ30QuestionnaireFormProps {
    onSave?: (data: MEQ30Data) => void;
    /** Called after explicit Save & Done — closes the SlideOutPanel */
    onComplete?: () => void;
    initialData?: MEQ30Data;
    patientId?: string;
    sessionId?: string;
    onExit?: () => void;
    onBack?: () => void;
}

// Simplified MEQ-30 questions (in production, load from database)
const MEQ30_QUESTIONS = Array.from({ length: 30 }, (_, i) => ({
    number: i + 1,
    text: `MEQ-30 Question ${i + 1}: [Full question text would be loaded from database]`,
    subscale: i < 7 ? 'Mystical' : i < 14 ? 'Positive Mood' : i < 21 ? 'Transcendence' : 'Ineffability',
}));

const SCALE_OPTIONS = [
    { value: 0, label: 'None' },
    { value: 1, label: 'So slight' },
    { value: 2, label: 'Slight' },
    { value: 3, label: 'Moderate' },
    { value: 4, label: 'Strong' },
    { value: 5, label: 'Extreme' },
];

const MEQ30QuestionnaireForm: React.FC<MEQ30QuestionnaireFormProps> = ({
    onSave,
    onComplete,
    initialData = { responses: {} },
    patientId,
    sessionId,
    onExit,
    onBack
}) => {
    const [data, setData] = useState<MEQ30Data>(initialData);
    const [isSaving, setIsSaving] = useState(false);
    const [isDone, setIsDone] = useState(false);

    const handleSaveAndExit = () => {
        if (onSave) {
            setIsSaving(true);
            onSave(data);
            setTimeout(() => {
                setIsSaving(false);
                if (onExit) onExit();
            }, 300);
        } else if (onExit) {
            onExit();
        }
    };

    const handleSaveAndContinue = () => {
        if (onSave) {
            setIsSaving(true);
            onSave(data);
            setIsDone(true);
            setTimeout(() => {
                setIsSaving(false);
                if (onComplete) onComplete();
            }, 300);
        } else if (onComplete) {
            onComplete();
        }
    };

    const updateResponse = (questionNumber: number, value: number) => {
        setData(prev => ({
            responses: { ...prev.responses, [questionNumber]: value },
        }));
    };

    const answeredCount = Object.keys(data.responses).length;
    const progressPercentage = Math.round((answeredCount / 30) * 100);
    const totalScore = (Object.values(data.responses) as number[]).reduce((sum, val) => sum + val, 0);
    const normalizedScore = Math.round(((totalScore as number) / 150) * 100); // Max: 30 × 5 = 150

    const isComplete = answeredCount === 30;
    const isMysticalExperience = normalizedScore >= 60;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* ── Compact Sticky Progress Header ────────────────────────────── }
            <div className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-xl p-3 sm:p-4 shadow-sm flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 mt-0">
                <div className="flex-1 space-y-1.5 w-full">
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                        <span className="text-slate-300 font-medium tracking-wide">Progress: {answeredCount}/30</span>
                        <span className="text-emerald-400 font-bold">{progressPercentage}%</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-300"
                            style={{ width: `${progressPercentage}%` }}
                        />
                    </div>
                </div>

                {answeredCount > 0 && (
                    <div className="flex items-center gap-2 shrink-0">
                        <div className="px-3 py-2 bg-purple-500/10 border border-purple-500/20 rounded-lg flex items-baseline gap-1.5">
                            <span className="text-xs font-semibold text-purple-300 uppercase tracking-widest">Score:</span>
                            <span className="text-sm font-black text-purple-400">{normalizedScore}</span>
                        </div>
                        {isMysticalExperience && (
                            <div className="px-3 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center gap-1.5" title="Mystical Experience Threshold Met">
                                <Award className="w-4 h-4 text-emerald-400" />
                                <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest hidden sm:inline">Mystical</span>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* ── Questions ────────────────────────────────────────────────── */}
            <div className="space-y-4">
                {MEQ30_QUESTIONS.map((question) => {
                    const isAnswered = data.responses[question.number] !== undefined;

                    return (
                        <div
                            key={question.number}
                            className={`bg-slate-900/60 backdrop-blur-xl border rounded-2xl p-6 transition-all ${isAnswered
                                ? 'border-emerald-500/50 bg-emerald-500/5'
                                : 'border-slate-700/50'
                                }`}
                        >
                            <div className="flex items-start gap-3 mb-4">
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isAnswered
                                        ? 'bg-emerald-500/20 text-emerald-400'
                                        : 'bg-slate-700/50 text-slate-300'
                                        }`}
                                >
                                    {isAnswered ? (
                                        <CheckCircle className="w-5 h-5" />
                                    ) : (
                                        <span className="text-sm font-bold">{question.number}</span>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <p className="text-slate-300 text-base font-medium leading-relaxed">
                                        {question.text}
                                    </p>
                                    <p className="text-slate-400 text-sm mt-1">
                                        Subscale: {question.subscale}
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {SCALE_OPTIONS.map((option) => (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => updateResponse(question.number, option.value)}
                                        className={`flex-1 min-w-[70px] px-3 py-2 rounded-lg font-medium text-sm transition-all active:scale-95 ${data.responses[question.number] === option.value
                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                                            : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 border border-slate-700/50'
                                            }`}
                                        aria-label={`Question ${question.number}: ${option.label} (${option.value})`}
                                        aria-pressed={data.responses[question.number] === option.value}
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

            {/* ── Progress Indicators ──────────────────────────────────────── */}
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-xl">
                {isComplete ? (
                    <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                        <div>
                            <p className="text-sm font-bold text-emerald-300">All 30 questions answered</p>
                            <p className="text-xs text-slate-500">Score: {normalizedScore}/100
                                {isMysticalExperience ? ' · Mystical experience threshold met' : ''}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div>
                        <p className="text-sm font-semibold text-slate-300">
                            {30 - answeredCount} question{30 - answeredCount !== 1 ? 's' : ''} remaining
                        </p>
                        <p className="text-xs text-slate-500">
                            You can save partial responses and return later
                        </p>
                    </div>
                )}
            </div>

            <FormFooter
                onBack={onBack}
                onSaveAndExit={handleSaveAndExit}
                onSaveAndContinue={handleSaveAndContinue}
                isSaving={isSaving}
                hasChanges={Object.keys(data.responses).length > 0}
                saveAndContinueLabel={isComplete ? 'Save & Done' : 'Save & Continue'}
                isDone={isDone}
            />
        </div>
    );
};

export default MEQ30QuestionnaireForm;
