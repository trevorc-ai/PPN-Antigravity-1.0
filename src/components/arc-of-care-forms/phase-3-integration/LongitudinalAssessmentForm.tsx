import React, { useState, useEffect } from 'react';
import { TrendingUp, Save, CheckCircle, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { FormField } from '../shared/FormField';
import { NumberInput } from '../shared/NumberInput';

/**
 * LongitudinalAssessmentForm - Follow-up Assessments
 * Track PHQ-9, GAD-7, WHOQOL, PSQI, C-SSRS over time with baseline comparison
 */

export interface LongitudinalAssessmentData {
    phq9_score?: number;
    gad7_score?: number;
    whoqol_score?: number;
    psqi_score?: number;
    cssrs_score?: number;
    assessment_date?: string;
    days_post_session?: number;
}

interface LongitudinalAssessmentFormProps {
    onSave?: (data: LongitudinalAssessmentData) => void;
    initialData?: LongitudinalAssessmentData;
    baselineScores?: { phq9?: number; gad7?: number };
    patientId?: string;
}

const LongitudinalAssessmentForm: React.FC<LongitudinalAssessmentFormProps> = ({
    onSave,
    initialData = {},
    baselineScores = {},
    patientId
}) => {
    const [data, setData] = useState<LongitudinalAssessmentData>({
        ...initialData,
        assessment_date: initialData.assessment_date || new Date().toISOString().slice(0, 10)
    });
    const [isSaving, setIsSaving] = useState(false);
    const [showAlert, setShowAlert] = useState(false);

    useEffect(() => {
        if (onSave && Object.keys(data).length > 1) {
            setIsSaving(true);
            const timer = setTimeout(() => {
                onSave(data);
                setIsSaving(false);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [data, onSave]);

    useEffect(() => {
        if (data.cssrs_score && data.cssrs_score >= 3) {
            setShowAlert(true);
        }
    }, [data.cssrs_score]);

    const updateField = (field: keyof LongitudinalAssessmentData, value: any) => {
        setData(prev => ({ ...prev, [field]: value }));
    };

    const getChangeIndicator = (current?: number, baseline?: number) => {
        if (!current || !baseline) return null;
        const diff = current - baseline;
        if (diff < -2) return { icon: ArrowDown, color: 'text-emerald-400', label: 'Improved' };
        if (diff > 2) return { icon: ArrowUp, color: 'text-red-400', label: 'Worsened' };
        return { icon: Minus, color: 'text-slate-400', label: 'Stable' };
    };

    const phq9Change = getChangeIndicator(data.phq9_score, baselineScores.phq9);
    const gad7Change = getChangeIndicator(data.gad7_score, baselineScores.gad7);

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                <h2 className="text-2xl font-black text-slate-200 flex items-center gap-3">
                    <TrendingUp className="w-7 h-7 text-blue-400" />
                    Longitudinal Assessment
                </h2>
                <p className="text-slate-400 text-sm mt-2">
                    Follow-up assessments to track treatment outcomes over time.
                </p>
            </div>

            {showAlert && (
                <div className="bg-red-500/10 border-2 border-red-500 rounded-2xl p-6">
                    <h3 className="text-red-400 font-black text-lg mb-2">🚨 RED ALERT: High C-SSRS Score</h3>
                    <p className="text-red-300 text-sm">
                        C-SSRS score ≥3 indicates suicidal ideation. Immediate clinical follow-up required.
                    </p>
                </div>
            )}

            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField label="Assessment Date">
                        <input
                            type="date"
                            value={data.assessment_date ?? ''}
                            onChange={(e) => updateField('assessment_date', e.target.value)}
                            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-200"
                        />
                    </FormField>

                    <FormField label="PHQ-9 Score" tooltip="Depression (0-27)">
                        <div className="space-y-2">
                            <NumberInput
                                value={data.phq9_score}
                                onChange={(val) => updateField('phq9_score', val)}
                                min={0}
                                max={27}
                            />
                            {phq9Change && (
                                <div className={`flex items-center gap-2 text-sm ${phq9Change.color}`}>
                                    <phq9Change.icon className="w-4 h-4" />
                                    <span>{phq9Change.label} from baseline ({baselineScores.phq9})</span>
                                </div>
                            )}
                        </div>
                    </FormField>

                    <FormField label="GAD-7 Score" tooltip="Anxiety (0-21)">
                        <div className="space-y-2">
                            <NumberInput
                                value={data.gad7_score}
                                onChange={(val) => updateField('gad7_score', val)}
                                min={0}
                                max={21}
                            />
                            {gad7Change && (
                                <div className={`flex items-center gap-2 text-sm ${gad7Change.color}`}>
                                    <gad7Change.icon className="w-4 h-4" />
                                    <span>{gad7Change.label} from baseline ({baselineScores.gad7})</span>
                                </div>
                            )}
                        </div>
                    </FormField>

                    <FormField label="WHOQOL Score" tooltip="Quality of Life (0-100)">
                        <NumberInput
                            value={data.whoqol_score}
                            onChange={(val) => updateField('whoqol_score', val)}
                            min={0}
                            max={100}
                        />
                    </FormField>

                    <FormField label="PSQI Score" tooltip="Sleep Quality (0-21)">
                        <NumberInput
                            value={data.psqi_score}
                            onChange={(val) => updateField('psqi_score', val)}
                            min={0}
                            max={21}
                        />
                    </FormField>

                    <FormField label="C-SSRS Score" tooltip="Suicidal Ideation (0-5)" required>
                        <NumberInput
                            value={data.cssrs_score}
                            onChange={(val) => updateField('cssrs_score', val)}
                            min={0}
                            max={5}
                            status={data.cssrs_score && data.cssrs_score >= 3 ? 'critical' : 'normal'}
                        />
                    </FormField>
                </div>
            </div>
        </div>
    );
};

export default LongitudinalAssessmentForm;
