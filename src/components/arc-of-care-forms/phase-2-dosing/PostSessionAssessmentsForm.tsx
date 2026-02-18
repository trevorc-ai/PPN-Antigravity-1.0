import React, { useState, useEffect } from 'react';
import { Sparkles, Save, CheckCircle } from 'lucide-react';
import { FormField } from '../shared/FormField';
import { NumberInput } from '../shared/NumberInput';
import { NowButton, RelativeTimeDisplay } from '../shared/NowButton';

/**
 * PostSessionAssessmentsForm - Post-Session Experience Assessments
 * 
 * Fields: MEQ-30, EDI, CEQ scores + timestamps
 * Layout: 3-row grid (score + timestamp pairs)
 * Features: Auto-fill timestamp on score entry, color-coded interpretations
 */

export interface PostSessionAssessmentsData {
    meq30_total_score?: number;
    meq30_completed_at?: string;
    edi_score?: number;
    edi_completed_at?: string;
    ceq_score?: number;
    ceq_completed_at?: string;
}

interface PostSessionAssessmentsFormProps {
    onSave?: (data: PostSessionAssessmentsData) => void;
    initialData?: PostSessionAssessmentsData;
    patientId?: string;
    sessionId?: string;
    sessionEndTime?: Date; // Time when session ended (for relative time display)
}

const PostSessionAssessmentsForm: React.FC<PostSessionAssessmentsFormProps> = ({
    onSave,
    initialData = {},
    patientId,
    sessionId,
    sessionEndTime
}) => {
    const [data, setData] = useState<PostSessionAssessmentsData>(initialData);
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);

    // Auto-save with debounce
    useEffect(() => {
        if (onSave && Object.keys(data).length > 0) {
            setIsSaving(true);
            const timer = setTimeout(() => {
                onSave(data);
                setIsSaving(false);
                setLastSaved(new Date());
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [data, onSave]);

    const updateScore = (scoreField: keyof PostSessionAssessmentsData, timestampField: keyof PostSessionAssessmentsData, value: number | undefined) => {
        const now = value !== undefined ? new Date().toISOString().slice(0, 16) : undefined;
        setData(prev => ({
            ...prev,
            [scoreField]: value,
            [timestampField]: value !== undefined ? (prev[timestampField] || now) : undefined
        }));
    };

    const updateTimestamp = (field: keyof PostSessionAssessmentsData, value: string) => {
        setData(prev => ({ ...prev, [field]: value }));
    };

    const getMEQInterpretation = (score?: number): { label: string; color: string } | null => {
        if (!score) return null;
        if (score >= 60) return { label: 'Complete Mystical Experience', color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' };
        if (score >= 40) return { label: 'Moderate Mystical Experience', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' };
        return { label: 'Low Mystical Experience', color: 'text-slate-300 bg-slate-500/10 border-slate-500/20' };
    };

    const meqInterpretation = getMEQInterpretation(data.meq30_total_score);

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                <div className="flex items-start justify-between">
                    <div>
                        <h2 className="text-2xl font-black text-slate-300 flex items-center gap-3">
                            <Sparkles className="w-7 h-7 text-purple-400" />
                            Post-Session Assessments
                        </h2>
                        <p className="text-slate-300 text-sm mt-2">
                            Standardized assessments completed immediately after the dosing session to measure experience quality.
                        </p>
                    </div>
                    {isSaving && (
                        <div className="flex items-center gap-2 text-blue-400 text-xs">
                            <Save className="w-4 h-4 animate-pulse" />
                            <span>Saving...</span>
                        </div>
                    )}
                    {lastSaved && !isSaving && (
                        <div className="flex items-center gap-2 text-emerald-400 text-xs">
                            <CheckCircle className="w-4 h-4" />
                            <span>Saved {lastSaved.toLocaleTimeString()}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Assessments Grid */}
            <div className="space-y-6">
                {/* MEQ-30 */}
                <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 space-y-4">
                    <h3 className="text-lg font-bold text-slate-300">MEQ-30 (Mystical Experience Questionnaire)</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            label="Total Score"
                            tooltip="MEQ-30 total score (0-100). Score ≥60 indicates complete mystical experience."
                            required
                        >
                            <NumberInput
                                value={data.meq30_total_score}
                                onChange={(val) => updateScore('meq30_total_score', 'meq30_completed_at', val)}
                                min={0}
                                max={100}
                                placeholder="0-100"
                            />
                        </FormField>

                        <FormField
                            label="Completed At"
                            tooltip="Timestamp when MEQ-30 was completed (auto-filled)"
                        >
                            <div className="flex gap-2">
                                <input
                                    type="datetime-local"
                                    value={data.meq30_completed_at ?? ''}
                                    onChange={(e) => updateTimestamp('meq30_completed_at', e.target.value)}
                                    className="flex-1 px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                />
                                <NowButton
                                    onSetNow={(timestamp) => updateTimestamp('meq30_completed_at', timestamp.toISOString().slice(0, 16))}
                                />
                            </div>
                            {sessionEndTime && data.meq30_completed_at && (
                                <RelativeTimeDisplay
                                    referenceTime={sessionEndTime}
                                    currentTime={new Date(data.meq30_completed_at)}
                                    label="after session ended"
                                />
                            )}
                        </FormField>
                    </div>

                    {meqInterpretation && (
                        <div className={`p-4 rounded-lg border ${meqInterpretation.color}`}>
                            <p className={`text-sm font-bold ${meqInterpretation.color.split(' ')[0]}`}>
                                {meqInterpretation.label}
                            </p>
                            <p className="text-slate-300 text-sm mt-1">
                                {data.meq30_total_score! >= 60 && 'Strong predictor of positive long-term outcomes. Patient reported profound mystical experience.'}
                                {data.meq30_total_score! >= 40 && data.meq30_total_score! < 60 && 'Moderate mystical qualities. Patient experienced some transcendent elements.'}
                                {data.meq30_total_score! < 40 && 'Limited mystical qualities. Focus on integration and therapeutic processing.'}
                            </p>
                        </div>
                    )}

                    <a
                        href="#"
                        className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm transition-colors"
                    >
                        <span>View Full MEQ-30 Questionnaire</span>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                    </a>
                </div>

                {/* EDI */}
                <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-slate-300 mb-4">EDI (Ego Dissolution Inventory)</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            label="EDI Score"
                            tooltip="Ego Dissolution Inventory score (0-100)"
                            required
                        >
                            <NumberInput
                                value={data.edi_score}
                                onChange={(val) => updateScore('edi_score', 'edi_completed_at', val)}
                                min={0}
                                max={100}
                                placeholder="0-100"
                            />
                        </FormField>

                        <FormField
                            label="Completed At"
                            tooltip="Timestamp when EDI was completed (auto-filled)"
                        >
                            <div className="flex gap-2">
                                <input
                                    type="datetime-local"
                                    value={data.edi_completed_at ?? ''}
                                    onChange={(e) => updateTimestamp('edi_completed_at', e.target.value)}
                                    className="flex-1 px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                />
                                <NowButton
                                    onSetNow={(timestamp) => updateTimestamp('edi_completed_at', timestamp.toISOString().slice(0, 16))}
                                />
                            </div>
                            {sessionEndTime && data.edi_completed_at && (
                                <RelativeTimeDisplay
                                    referenceTime={sessionEndTime}
                                    currentTime={new Date(data.edi_completed_at)}
                                    label="after session ended"
                                />
                            )}
                        </FormField>
                    </div>
                </div>

                {/* CEQ */}
                <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-slate-300 mb-4">CEQ (Challenging Experience Questionnaire)</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            label="CEQ Score"
                            tooltip="Challenging Experience Questionnaire score (0-100)"
                            required
                        >
                            <NumberInput
                                value={data.ceq_score}
                                onChange={(val) => updateScore('ceq_score', 'ceq_completed_at', val)}
                                min={0}
                                max={100}
                                placeholder="0-100"
                            />
                        </FormField>

                        <FormField
                            label="Completed At"
                            tooltip="Timestamp when CEQ was completed (auto-filled)"
                        >
                            <div className="flex gap-2">
                                <input
                                    type="datetime-local"
                                    value={data.ceq_completed_at ?? ''}
                                    onChange={(e) => updateTimestamp('ceq_completed_at', e.target.value)}
                                    className="flex-1 px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                />
                                <NowButton
                                    onSetNow={(timestamp) => updateTimestamp('ceq_completed_at', timestamp.toISOString().slice(0, 16))}
                                />
                            </div>
                            {sessionEndTime && data.ceq_completed_at && (
                                <RelativeTimeDisplay
                                    referenceTime={sessionEndTime}
                                    currentTime={new Date(data.ceq_completed_at)}
                                    label="after session ended"
                                />
                            )}
                        </FormField>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostSessionAssessmentsForm;
