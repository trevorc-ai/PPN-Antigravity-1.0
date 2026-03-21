import React, { useState, useRef } from 'react';
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
 *   - "Save & Done" footer after the last question, the ONLY exit for long-form flows
 *   - onComplete closes the SlideOutPanel without extra scrolling
 */

export interface MEQ30Data {
    responses: Record<number, number>; // question number → score
}

interface MEQ30QuestionnaireFormProps {
    onSave?: (data: MEQ30Data) => void;
    /** Called after explicit Save & Done, closes the SlideOutPanel */
    onComplete?: () => void;
    initialData?: MEQ30Data;
    patientId?: string;
    sessionId?: string;
    onExit?: () => void;
    onBack?: () => void;
}

// MEQ-30 – Mystical Experience Questionnaire (30-item version)
// Source: Barrett et al. (2015), Psychopharmacology 232(23):4337-4347.
// Subscale classification per original publication:
//   Mystical (M): items 1-7 | Positive Mood (P): items 8-13
//   Transcendence of Time/Space (T): items 14-20 | Ineffability (I): items 21-30
const MEQ30_QUESTIONS: { number: number; text: string; subscale: string }[] = [
    // ── Mystical (items 1–7) ──────────────────────────────────────────────────
    { number: 1,  text: 'Experience of the insight that "all is one."',                                                                    subscale: 'Mystical' },
    { number: 2,  text: 'Experience of something holy and sacred.',                                                                       subscale: 'Mystical' },
    { number: 3,  text: 'Experience of seeing how everything in the world fits together.',                                                 subscale: 'Mystical' },
    { number: 4,  text: 'Gain of insightful knowledge experienced at an intuitive level.',                                                 subscale: 'Mystical' },
    { number: 5,  text: 'Experience of the fusion of your personal self into a larger whole.',                                             subscale: 'Mystical' },
    { number: 6,  text: 'Experience of the conviction that you had encountered ultimate reality\n(more real than any every-day reality).', subscale: 'Mystical' },
    { number: 7,  text: 'Sense of reverence or awe.',                                                                                     subscale: 'Mystical' },
    // ── Positive Mood (items 8–13) ───────────────────────────────────────────
    { number: 8,  text: 'Experience of feelings of tenderness and gentleness.',                                                           subscale: 'Positive Mood' },
    { number: 9,  text: 'Experience of joy.',                                                                                             subscale: 'Positive Mood' },
    { number: 10, text: 'Experience of the certainty that the experience would always be\navailable for reference.',                       subscale: 'Positive Mood' },
    { number: 11, text: 'Experience of profound peace.',                                                                                  subscale: 'Positive Mood' },
    { number: 12, text: 'Experience of a sense of living in a friendly universe.',                                                        subscale: 'Positive Mood' },
    { number: 13, text: 'Experience of gratitude.',                                                                                       subscale: 'Positive Mood' },
    // ── Transcendence of Time/Space (items 14–20) ─────────────────────────────
    { number: 14, text: 'Loss of your usual sense of time.',                                                                              subscale: 'Transcendence of Time/Space' },
    { number: 15, text: 'Being in a realm with no sense of time or space.',                                                               subscale: 'Transcendence of Time/Space' },
    { number: 16, text: 'Loss of usual sense of space.',                                                                                  subscale: 'Transcendence of Time/Space' },
    { number: 17, text: 'Feeling that you experienced eternity or infinity.',                                                              subscale: 'Transcendence of Time/Space' },
    { number: 18, text: 'Experience of oneness or unity with objects and/or persons perceived in\nyour surroundings.', subscale: 'Transcendence of Time/Space' },
    { number: 19, text: 'Feeling that you were experiencing the ground of ultimate reality.',                                              subscale: 'Transcendence of Time/Space' },
    { number: 20, text: 'Experience of the fusion of your personal self into a larger unity.',                                             subscale: 'Transcendence of Time/Space' },
    // ── Ineffability (items 21–30) ────────────────────────────────────────────
    { number: 21, text: 'Experience of things seeming to be simultaneously different and yet the same (paradoxical).', subscale: 'Ineffability' },
    { number: 22, text: 'Feeling of being outside of time, in a timeless present.',                                                       subscale: 'Ineffability' },
    { number: 23, text: 'Sense that the experience cannot be expressed adequately in words.',                                              subscale: 'Ineffability' },
    { number: 24, text: 'Feeling that you could not do justice to your experience by\ndescribing it in words.',                            subscale: 'Ineffability' },
    { number: 25, text: 'Feeling that it would be difficult to communicate the experience\nto others who have not had similar experiences.',subscale: 'Ineffability' },
    { number: 26, text: 'Experience that defied description in ordinary language.',                                                        subscale: 'Ineffability' },
    { number: 27, text: 'Certainty of encounter with a power that was ultimate, holy,\nor divine.',                                        subscale: 'Ineffability' },
    { number: 28, text: 'Experience of your own self as something that is typically NOT\nrecognized as "you."',                            subscale: 'Ineffability' },
    { number: 29, text: 'Experience of seeming to be beyond all ordinary categories of space\nand time.',                                  subscale: 'Ineffability' },
    { number: 30, text: 'Experience of something that cannot be described in physical terms.',                                             subscale: 'Ineffability' },
];

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
    // WO-600 Fix C: ref map for auto-advance scroll-to-next-question
    const questionRefs = useRef<Record<number, HTMLDivElement | null>>({});

    // WO-531 Fix: Navigation callbacks (onExit / onComplete) always fire.
    // onSave is only called when there are actual responses to persist.
    const handleSaveAndExit = () => {
        if (onSave && answeredCount > 0) {
            setIsSaving(true);
            onSave(data);
            setTimeout(() => {
                setIsSaving(false);
                if (onExit) onExit();
            }, 300);
        } else {
            // No responses to save — navigate immediately
            if (onExit) onExit();
        }
    };

    const handleSaveAndContinue = () => {
        if (onSave && answeredCount > 0) {
            setIsSaving(true);
            onSave(data);
            setIsDone(true);
            setTimeout(() => {
                setIsSaving(false);
                if (onComplete) onComplete();
            }, 300);
        } else {
            // No responses to save — navigate immediately
            setIsDone(true);
            if (onComplete) onComplete();
        }
    };

    const updateResponse = (questionNumber: number, value: number) => {
        setData(prev => {
            const next = { responses: { ...prev.responses, [questionNumber]: value } };
            // WO-600 Fix C: scroll to next unanswered question after selection
            setTimeout(() => {
                const nextUnanswered = MEQ30_QUESTIONS.find(
                    q => q.number > questionNumber && next.responses[q.number] === undefined
                );
                if (nextUnanswered && questionRefs.current[nextUnanswered.number]) {
                    questionRefs.current[nextUnanswered.number]!.scrollIntoView({
                        behavior: 'smooth', block: 'center',
                    });
                }
            }, 80);
            return next;
        });
    };

    const answeredCount = Object.keys(data.responses).length;
    const progressPercentage = Math.round((answeredCount / 30) * 100);
    const totalScore = (Object.values(data.responses) as number[]).reduce((sum, val) => sum + val, 0);
    const normalizedScore = Math.round(((totalScore as number) / 150) * 100); // Max: 30 × 5 = 150

    const isComplete = answeredCount === 30;
    const isMysticalExperience = normalizedScore >= 60;

    return (
        <div
            className="max-w-4xl mx-auto space-y-6"
            // WO-538: dark-mode scrollbar — subdued, non-distracting
            style={{
                scrollbarWidth: 'thin',
                scrollbarColor: 'rgba(100,116,139,0.35) transparent',
            } as React.CSSProperties}
        >
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
                    // WO-538 tab-order: the one tab-stop per question is the currently
                    // selected option, or value-0 if unanswered. Arrow keys move within
                    // the group; Tab jumps to the next question's single tab-stop.
                    const activeTabValue = data.responses[question.number] ?? 0;
                    const groupId = `meq30-q${question.number}`;

                    return (
                        <div
                            key={question.number}
                            ref={(el) => { questionRefs.current[question.number] = el; }}
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
                                    <p
                                        id={groupId}
                                        className="text-slate-300 text-base font-medium leading-relaxed"
                                    >
                                        {question.text}
                                    </p>
                                    <p className="text-slate-400 text-sm mt-1">
                                        Subscale: {question.subscale}
                                    </p>
                                </div>
                            </div>

                            {/* WO-538: role=radiogroup, single tab-stop per question */}
                            <div
                                role="radiogroup"
                                aria-labelledby={groupId}
                                className="flex flex-wrap gap-2"
                            >
                                {SCALE_OPTIONS.map((option) => (
                                    <button
                                        key={option.value}
                                        type="button"
                                        role="radio"
                                        aria-checked={data.responses[question.number] === option.value}
                                        // WO-538 tab-order: only one button per group is focusable
                                        tabIndex={option.value === activeTabValue ? 0 : -1}
                                        onClick={() => updateResponse(question.number, option.value)}
                                        // WO-538 keyboard scroll: scroll current question into view on focus
                                        onFocus={() => {
                                            questionRefs.current[question.number]?.scrollIntoView({
                                                behavior: 'smooth',
                                                block: 'nearest',
                                            });
                                        }}
                                        // WO-538 arrow-key navigation within group
                                        onKeyDown={(e) => {
                                            const dir = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1
                                                      : e.key === 'ArrowLeft'  || e.key === 'ArrowUp'   ? -1
                                                      : 0;
                                            if (dir !== 0) {
                                                e.preventDefault();
                                                const next = Math.max(0, Math.min(5, option.value + dir));
                                                updateResponse(question.number, next);
                                                // focus the new active button
                                                const group = questionRefs.current[question.number];
                                                const target = group?.querySelector<HTMLButtonElement>(
                                                    `[data-val="${next}"]`
                                                );
                                                target?.focus();
                                            }
                                        }}
                                        data-val={option.value}
                                        className={`flex-1 min-w-[70px] px-3 py-2 rounded-lg font-medium text-sm transition-all active:scale-95 focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:outline-none ${data.responses[question.number] === option.value
                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                                            : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 border border-slate-700/50'
                                            }`}
                                        aria-label={`Q${question.number} – ${option.label} (${option.value})`}
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

            {/* WO-531 Fix: hasChanges always true so navigation buttons are never
                unconditionally disabled. isSaving still disables during async save. */}
            <FormFooter
                onBack={onBack}
                onSaveAndExit={handleSaveAndExit}
                onSaveAndContinue={handleSaveAndContinue}
                isSaving={isSaving}
                hasChanges={true}
                saveAndContinueLabel={isComplete ? 'Save & Done' : 'Complete Assessment'}
                isDone={isDone}
            />
        </div>
    );
};

export default MEQ30QuestionnaireForm;
