import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CheckCircle, Award, ChevronLeft, ChevronRight } from 'lucide-react';
import { FormFooter } from '../shared/FormFooter';

/**
 * MEQ30QuestionnaireForm — Single-Card Wizard (WO-658 REVISED)
 *
 * Standards applied:
 *   - ppn-ui-standards Rule 2: text-sm minimum (no text-xs anywhere)
 *   - ppn-ui-standards Rule 6c: Phase 3 = Teal palette throughout
 *   - ppn-ui-standards Rule 8: Mobile-first. grid-cols-3 sm:grid-cols-6,
 *     touch targets min-h-[44px] / min-w-[44px], no hover-only interactions
 *   - frontend-best-practices: ppn-* typography classes on all text elements
 *   - optimize-mobile: active:scale-95 kinetic feedback, sticky bottom footer,
 *     thumb-zone-friendly score grid
 *
 * UX: One question at a time. Tap a score → card slides to next question automatically.
 * Keyboard: digit keys 0–5 fire the answer and advance.
 * 31 total actions: 30 score taps + 1 Save & Done.
 * Final screen: summary grid of all 30 answers for review before saving.
 */

export interface MEQ30Data {
    responses: Record<number, number>;
}

interface MEQ30QuestionnaireFormProps {
    onSave?: (data: MEQ30Data) => void;
    onComplete?: () => void;
    initialData?: MEQ30Data;
    patientId?: string;
    sessionId?: string;
    onExit?: () => void;
    onBack?: () => void;
}

// MEQ-30 – Mystical Experience Questionnaire (30-item version)
// Source: Barrett et al. (2015), Psychopharmacology 232(23):4337-4347.
const MEQ30_QUESTIONS: { number: number; text: string; subscale: string }[] = [
    { number: 1,  text: 'Experience of the insight that "all is one."',                                                                     subscale: 'Mystical' },
    { number: 2,  text: 'Experience of something holy and sacred.',                                                                        subscale: 'Mystical' },
    { number: 3,  text: 'Experience of seeing how everything in the world fits together.',                                                  subscale: 'Mystical' },
    { number: 4,  text: 'Gain of insightful knowledge experienced at an intuitive level.',                                                  subscale: 'Mystical' },
    { number: 5,  text: 'Experience of the fusion of your personal self into a larger whole.',                                              subscale: 'Mystical' },
    { number: 6,  text: 'Experience of the conviction that you had encountered ultimate reality (more real than any every-day reality).',   subscale: 'Mystical' },
    { number: 7,  text: 'Sense of reverence or awe.',                                                                                      subscale: 'Mystical' },
    { number: 8,  text: 'Experience of feelings of tenderness and gentleness.',                                                            subscale: 'Positive Mood' },
    { number: 9,  text: 'Experience of joy.',                                                                                              subscale: 'Positive Mood' },
    { number: 10, text: 'Experience of the certainty that the experience would always be available for reference.',                         subscale: 'Positive Mood' },
    { number: 11, text: 'Experience of profound peace.',                                                                                   subscale: 'Positive Mood' },
    { number: 12, text: 'Experience of a sense of living in a friendly universe.',                                                         subscale: 'Positive Mood' },
    { number: 13, text: 'Experience of gratitude.',                                                                                        subscale: 'Positive Mood' },
    { number: 14, text: 'Loss of your usual sense of time.',                                                                               subscale: 'Transcendence' },
    { number: 15, text: 'Being in a realm with no sense of time or space.',                                                                subscale: 'Transcendence' },
    { number: 16, text: 'Loss of usual sense of space.',                                                                                   subscale: 'Transcendence' },
    { number: 17, text: 'Feeling that you experienced eternity or infinity.',                                                              subscale: 'Transcendence' },
    { number: 18, text: 'Experience of oneness or unity with objects and/or persons perceived in your surroundings.',                      subscale: 'Transcendence' },
    { number: 19, text: 'Feeling that you were experiencing the ground of ultimate reality.',                                              subscale: 'Transcendence' },
    { number: 20, text: 'Experience of the fusion of your personal self into a larger unity.',                                             subscale: 'Transcendence' },
    { number: 21, text: 'Experience of things seeming to be simultaneously different and yet the same (paradoxical).',                    subscale: 'Ineffability' },
    { number: 22, text: 'Feeling of being outside of time, in a timeless present.',                                                       subscale: 'Ineffability' },
    { number: 23, text: 'Sense that the experience cannot be expressed adequately in words.',                                              subscale: 'Ineffability' },
    { number: 24, text: 'Feeling that you could not do justice to your experience by describing it in words.',                             subscale: 'Ineffability' },
    { number: 25, text: 'Feeling that it would be difficult to communicate the experience to others who have not had similar experiences.',subscale: 'Ineffability' },
    { number: 26, text: 'Experience that defied description in ordinary language.',                                                        subscale: 'Ineffability' },
    { number: 27, text: 'Certainty of encounter with a power that was ultimate, holy, or divine.',                                        subscale: 'Ineffability' },
    { number: 28, text: 'Experience of your own self as something that is typically NOT recognized as "you."',                             subscale: 'Ineffability' },
    { number: 29, text: 'Experience of seeming to be beyond all ordinary categories of space and time.',                                  subscale: 'Ineffability' },
    { number: 30, text: 'Experience of something that cannot be described in physical terms.',                                             subscale: 'Ineffability' },
];

const SCALE_OPTIONS = [
    { value: 0, label: 'None' },
    { value: 1, label: 'So Slight' },
    { value: 2, label: 'Slight' },
    { value: 3, label: 'Moderate' },
    { value: 4, label: 'Strong' },
    { value: 5, label: 'Extreme' },
];

// Rule 6c: Phase 3 is Teal. Subscales use teal-toned variants only.
// Icon + text pairing on all color uses (Rule 1 / 6b).
const SUBSCALE_LABELS: Record<string, string> = {
    'Mystical':     'Mystical',
    'Positive Mood':'Positive Mood',
    'Transcendence':'Transcendence',
    'Ineffability': 'Ineffability',
};

const MEQ30QuestionnaireForm: React.FC<MEQ30QuestionnaireFormProps> = ({
    onSave,
    onComplete,
    initialData = { responses: {} },
    onExit,
    onBack,
}) => {
    const [data, setData] = useState<MEQ30Data>(initialData);
    const [currentIndex, setCurrentIndex] = useState<number>(() => {
        const answered = Object.keys(initialData.responses).map(Number);
        if (answered.length === 30) return 30;
        for (let i = 0; i < 30; i++) {
            if (!answered.includes(MEQ30_QUESTIONS[i].number)) return i;
        }
        return 30;
    });
    const [animDir, setAnimDir] = useState<'forward' | 'back'>('forward');
    const [isAnimating, setIsAnimating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isDone, setIsDone] = useState(false);

    const answeredCount = Object.keys(data.responses).length;
    const progressPct = Math.round((answeredCount / 30) * 100);
    const totalScore = (Object.values(data.responses) as number[]).reduce((s, v) => s + v, 0);
    const normalizedScore = Math.round((totalScore / 150) * 100);
    const isComplete = answeredCount === 30;
    const isMystical = normalizedScore >= 60;
    const isOnSummary = currentIndex >= 30;

    // ── Animation helper ─────────────────────────────────────────────────────
    const navigateTo = useCallback((index: number, dir: 'forward' | 'back') => {
        if (isAnimating) return;
        setAnimDir(dir);
        setIsAnimating(true);
        setTimeout(() => {
            setCurrentIndex(index);
            setIsAnimating(false);
        }, 150);
    }, [isAnimating]);

    // ── Answer + auto-advance ────────────────────────────────────────────────
    const handleAnswer = useCallback((questionNumber: number, value: number) => {
        setData(prev => ({ responses: { ...prev.responses, [questionNumber]: value } }));
        navigateTo(currentIndex + 1, 'forward');
    }, [currentIndex, navigateTo]);

    // ── Keyboard digit 0–5 ───────────────────────────────────────────────────
    useEffect(() => {
        if (isOnSummary || isAnimating) return;
        const handleKey = (e: KeyboardEvent) => {
            const tag = (e.target as HTMLElement)?.tagName;
            if (tag === 'INPUT' || tag === 'TEXTAREA') return;
            const digit = parseInt(e.key, 10);
            if (!isNaN(digit) && digit >= 0 && digit <= 5) {
                e.preventDefault();
                const q = MEQ30_QUESTIONS[currentIndex];
                if (q) handleAnswer(q.number, digit);
            }
        };
        document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, [currentIndex, isOnSummary, isAnimating, handleAnswer]);

    // ── Save handlers ────────────────────────────────────────────────────────
    const handleSaveAndExit = () => {
        if (onSave && answeredCount > 0) {
            setIsSaving(true);
            onSave(data);
            setTimeout(() => { setIsSaving(false); if (onExit) onExit(); }, 300);
        } else {
            if (onExit) onExit();
        }
    };

    const handleSaveAndContinue = () => {
        if (onSave && answeredCount > 0) {
            setIsSaving(true);
            onSave(data);
            setIsDone(true);
            setTimeout(() => { setIsSaving(false); if (onComplete) onComplete(); }, 300);
        } else {
            setIsDone(true);
            if (onComplete) onComplete();
        }
    };

    // ── Slide animation classes ──────────────────────────────────────────────
    const slideClass = isAnimating
        ? animDir === 'forward' ? 'opacity-0 translate-x-6' : 'opacity-0 -translate-x-6'
        : 'opacity-100 translate-x-0';

    const question = !isOnSummary ? MEQ30_QUESTIONS[currentIndex] : null;

    return (
        // Rule 8a: max-w-* with mx-auto, no hardcoded px widths
        <div className="max-w-2xl mx-auto flex flex-col gap-4">

            {/* ── Sticky Progress Header ─────────────────────────────────────
                Rule 3: bg-slate-900/60 backdrop-blur-md border border-white/10
                Rule 8b: full-width, stacks vertically on mobile           */}
            <div className="sticky top-0 z-10 bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="flex-1 space-y-2">
                        {/* Rule 2b: ppn-label for form group labels */}
                        <div className="flex items-center justify-between">
                            <span className="ppn-label text-slate-300">
                                {isOnSummary ? 'Review and Save' : `Question ${currentIndex + 1} of 30`}
                            </span>
                            {/* Rule 6c: Phase 3 = teal. Icon paired with text (Rule 1) */}
                            <span className="ppn-label text-teal-400">{progressPct}%</span>
                        </div>
                        {/* Accessible progress bar: role + aria attributes (Rule 4/accessibility) */}
                        <div
                            role="progressbar"
                            aria-valuenow={progressPct}
                            aria-valuemax={100}
                            aria-label="MEQ-30 completion progress"
                            className="h-2 bg-slate-800 rounded-full overflow-hidden"
                        >
                            <div
                                className="h-full bg-gradient-to-r from-teal-600 to-teal-400 transition-all duration-500"
                                style={{ width: `${progressPct}%` }}
                            />
                        </div>
                    </div>

                    {/* Score badge: CheckCircle icon paired with score text (Rule 1) */}
                    {answeredCount > 0 && (
                        <div className="flex items-center gap-2 shrink-0">
                            <div className="px-3 py-2 bg-teal-500/10 border border-teal-500/20 rounded-xl flex items-baseline gap-1.5">
                                <span className="ppn-label text-teal-400">Score:</span>
                                <span className="ppn-label text-teal-300 font-black">{normalizedScore}</span>
                            </div>
                            {/* Award icon + text (Rule 1: never color alone) */}
                            {isMystical && (
                                <div className="px-3 py-2 bg-teal-500/10 border border-teal-500/20 rounded-xl flex items-center gap-1.5">
                                    <Award className="w-4 h-4 text-teal-400 shrink-0" aria-hidden="true" />
                                    <span className="ppn-label text-teal-300 hidden sm:inline">Mystical</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* ── Dot Navigator ──────────────────────────────────────────
                    Rule 8b: min touch target — each dot row uses min-h-[44px]
                    to collectively form a reachable tap zone               */}
                <div
                    className="flex items-center gap-1 mt-3 flex-wrap min-h-[44px] content-center"
                    aria-label="Question navigation dots"
                >
                    {MEQ30_QUESTIONS.map((q, i) => {
                        const answered = data.responses[q.number] !== undefined;
                        const isCurrent = i === currentIndex && !isOnSummary;
                        return (
                            <button
                                key={q.number}
                                onClick={() => navigateTo(i, i < currentIndex ? 'back' : 'forward')}
                                // Rule 8b: min-h-[44px] touch target on each dot
                                // active:scale-95 kinetic feedback (optimize-mobile rule 2)
                                className={`min-h-[44px] flex items-center justify-center px-1 transition-all duration-200
                                    active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400
                                    ${isCurrent ? 'w-8' : 'w-5'}`}
                                aria-label={`Go to question ${q.number}${answered ? ` (answered: ${data.responses[q.number]})` : ' (unanswered)'}`}
                                aria-current={isCurrent ? 'true' : undefined}
                            >
                                <span className={`rounded-full block transition-all duration-200 ${
                                    isCurrent
                                        ? 'w-6 h-3 bg-teal-500'
                                        : answered
                                        ? 'w-3 h-3 bg-teal-600/70 hover:bg-teal-500'
                                        : 'w-3 h-3 bg-slate-700 hover:bg-slate-500'
                                }`} />
                            </button>
                        );
                    })}
                    {/* Summary dot */}
                    <button
                        onClick={() => isComplete && navigateTo(30, 'forward')}
                        disabled={!isComplete}
                        className={`min-h-[44px] flex items-center justify-center px-1 transition-all duration-200
                            active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400
                            disabled:cursor-not-allowed ${isOnSummary ? 'w-8' : 'w-5'}`}
                        aria-label="Summary screen"
                    >
                        <span className={`rounded-full block ${
                            isOnSummary ? 'w-6 h-3 bg-teal-500' : isComplete ? 'w-3 h-3 bg-slate-500' : 'w-3 h-3 bg-slate-800'
                        }`} />
                    </button>
                </div>
            </div>

            {/* ── Question Card ──────────────────────────────────────────────
                Rule 3: bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-2xl
                Rule 6c: Phase 3 = Teal. Card uses teal border/bg accent.
                Rule 8: Mobile-first layout. Score grid: grid-cols-3 sm:grid-cols-6 */}
            {!isOnSummary && question && (
                <div className={`transition-all duration-150 ease-in-out ${slideClass}`}>
                    <div className="bg-slate-900/60 backdrop-blur-md border border-teal-500/30 rounded-2xl p-6 sm:p-8 shadow-xl bg-teal-950/10">

                        {/* Subscale badge: icon + text (Rule 1, Rule 6c teal palette) */}
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 mb-6">
                            <span className="w-2 h-2 rounded-full bg-teal-400 shrink-0" aria-hidden="true" />
                            {/* ppn-label minimum 14px (Rule 2) */}
                            <span className="ppn-label text-teal-300 uppercase tracking-widest">
                                {SUBSCALE_LABELS[question.subscale] ?? question.subscale}
                            </span>
                        </div>

                        {/* Question text: ppn-body (Rule frontend-best-practices) */}
                        <p className="ppn-body text-slate-100 font-semibold mb-8 leading-relaxed">
                            {question.text}
                        </p>

                        {/* Score grid
                            Rule 8b: grid-cols-3 on mobile, grid-cols-6 on sm+
                            Rule 8b: min-h-[44px] touch target on each button    */}
                        <div
                            role="radiogroup"
                            aria-label={`Rate question ${question.number}`}
                            className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3"
                        >
                            {SCALE_OPTIONS.map((option) => {
                                const isSelected = data.responses[question.number] === option.value;
                                return (
                                    <button
                                        key={option.value}
                                        type="button"
                                        role="radio"
                                        aria-checked={isSelected}
                                        onClick={() => handleAnswer(question.number, option.value)}
                                        // Rule 8b: min-h-[44px] for fat-finger compliance
                                        // active:scale-95 kinetic feedback (optimize-mobile rule 2)
                                        // Rule 6c: teal selected state (Phase 3)
                                        className={`flex flex-col items-center justify-center min-h-[44px] rounded-xl font-bold
                                            transition-all duration-150 active:scale-95
                                            focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:outline-none
                                            ${isSelected
                                                ? 'bg-teal-600/80 text-white shadow-lg shadow-teal-600/30 scale-105 border border-teal-400/50'
                                                : 'bg-slate-800/70 text-slate-200 hover:bg-slate-700 hover:text-white border border-slate-700/50 hover:border-teal-500/30'
                                            }`}
                                        aria-label={`${option.value}, ${option.label}`}
                                    >
                                        {/* ppn-label minimum 14px — NO text-xs or sub-pixel sizes */}
                                        <span className="ppn-label font-black text-current">{option.value}</span>
                                        {/* ppn-meta is 12px minimum — used for badge/metadata only */}
                                        <span className="ppn-meta text-current opacity-75 leading-none mt-0.5">{option.label}</span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Keyboard hint: ppn-meta (12px) — badge context only */}
                        <p className="ppn-meta text-slate-500 text-center mt-5">
                            Press{' '}
                            <kbd className="px-2 py-0.5 bg-slate-800 border border-slate-700 rounded font-mono text-slate-400">0</kbd>
                            {' '}–{' '}
                            <kbd className="px-2 py-0.5 bg-slate-800 border border-slate-700 rounded font-mono text-slate-400">5</kbd>
                            {' '}to answer
                        </p>
                    </div>

                    {/* Back / counter / Next — ppn-body sizing, full min-h touch targets */}
                    <div className="flex items-center justify-between mt-3 px-1">
                        <button
                            onClick={() => navigateTo(Math.max(0, currentIndex - 1), 'back')}
                            disabled={currentIndex === 0}
                            className="flex items-center gap-1.5 ppn-label text-slate-400 hover:text-slate-200
                                disabled:opacity-0 disabled:pointer-events-none transition-colors
                                min-h-[44px] px-3 rounded-xl hover:bg-slate-800/50 active:scale-95"
                        >
                            <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                            Back
                        </button>
                        <span className="ppn-meta text-slate-500">{currentIndex + 1} / 30</span>
                        {data.responses[question.number] !== undefined ? (
                            <button
                                onClick={() => navigateTo(currentIndex + 1, 'forward')}
                                className="flex items-center gap-1.5 ppn-label text-slate-400 hover:text-slate-200
                                    transition-colors min-h-[44px] px-3 rounded-xl hover:bg-slate-800/50 active:scale-95"
                            >
                                Next
                                <ChevronRight className="w-4 h-4" aria-hidden="true" />
                            </button>
                        ) : (
                            <span className="w-16" aria-hidden="true" />
                        )}
                    </div>
                </div>
            )}

            {/* ── Summary / Review Screen ────────────────────────────────────
                Rule 3: standard panel classes
                Rule 1: CheckCircle icon + text for success state
                Rule 6c: teal palette throughout                          */}
            {isOnSummary && (
                <div className={`transition-all duration-150 ease-in-out ${slideClass}`}>
                    <div className="bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
                        <div className="flex items-start gap-3">
                            {/* Rule 1: CheckCircle icon + text (never color alone) */}
                            <CheckCircle className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" aria-hidden="true" />
                            <div>
                                <p className="ppn-card-title text-slate-200">All 30 questions answered</p>
                                <p className="ppn-body text-slate-400 mt-1">
                                    Normalized score:{' '}
                                    <span className="font-bold text-teal-300">{normalizedScore}/100</span>
                                    {isMystical && (
                                        // Rule 1: Award icon + text alongside color (teal)
                                        <span className="inline-flex items-center gap-1 ml-2 text-teal-300">
                                            <Award className="w-4 h-4" aria-hidden="true" />
                                            Mystical experience threshold met
                                        </span>
                                    )}
                                </p>
                            </div>
                        </div>

                        {/* Summary grid
                            Rule 8b: grid-cols-5 mobile, grid-cols-6 on sm
                            Rule 8b: min-h-[44px] touch targets              */}
                        <div className="grid grid-cols-5 sm:grid-cols-6 gap-2">
                            {MEQ30_QUESTIONS.map((q) => {
                                const val = data.responses[q.number];
                                const unanswered = val === undefined;
                                return (
                                    <button
                                        key={q.number}
                                        onClick={() => navigateTo(q.number - 1, 'back')}
                                        // Rule 1: color + label text (Q# above value)
                                        // Rule 8b: min-h-[44px] touch target
                                        className={`flex flex-col items-center justify-center min-h-[44px] rounded-xl border
                                            transition-all active:scale-95 hover:scale-105 focus-visible:ring-2 focus-visible:ring-teal-400
                                            ${unanswered
                                                ? 'bg-slate-800/50 border-slate-700/50'
                                                : 'bg-teal-900/30 border-teal-500/30'
                                            }`}
                                        aria-label={`Edit question ${q.number}${val !== undefined ? `, current answer ${val}` : ', unanswered'}`}
                                    >
                                        {/* ppn-meta for badge context (12px minimum) */}
                                        <span className="ppn-meta text-slate-500 leading-none">Q{q.number}</span>
                                        <span className={`ppn-label font-black leading-none mt-0.5 ${unanswered ? 'text-slate-600' : 'text-teal-300'}`}>
                                            {val ?? '–'}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Subscale legend: icon + text per entry (Rule 1) */}
                        <div className="flex flex-wrap gap-3 pt-2 border-t border-slate-800">
                            {Object.keys(SUBSCALE_LABELS).map((name) => (
                                <div key={name} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-teal-500/10 border border-teal-500/20">
                                    <span className="w-2 h-2 rounded-full bg-teal-400 shrink-0" aria-hidden="true" />
                                    <span className="ppn-meta text-teal-300">{SUBSCALE_LABELS[name]}</span>
                                </div>
                            ))}
                        </div>

                        <p className="ppn-meta text-slate-500 text-center">
                            Tap any cell to revise that answer, then navigate back here via the dot bar.
                        </p>
                    </div>
                </div>
            )}

            {/* ── Footer
                Rule 8b: FormFooter already handles w-full sm:w-auto
                Only shows Save & Done on summary screen so user reviews before saving */}
            <FormFooter
                onBack={onBack}
                onSaveAndExit={handleSaveAndExit}
                onSaveAndContinue={isOnSummary ? handleSaveAndContinue : undefined}
                isSaving={isSaving}
                hasChanges={true}
                saveAndContinueLabel={isComplete ? 'Save & Done' : 'Complete Assessment'}
                isDone={isDone}
            />
        </div>
    );
};

export default MEQ30QuestionnaireForm;
