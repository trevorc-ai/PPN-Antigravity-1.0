import React, { useState, useEffect } from 'react';
import { TrendingUp, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { FormField } from '../shared/FormField';
import { FormFooter } from '../shared/FormFooter';

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
    onComplete?: () => void;
    onExit?: () => void;
    onBack?: () => void;
}

const LongitudinalAssessmentForm: React.FC<LongitudinalAssessmentFormProps> = ({
    onSave,
    initialData = {} as LongitudinalAssessmentData,
    baselineScores = {} as { phq9?: number; gad7?: number },
    patientId,
    onComplete,
    onExit,
    onBack
}) => {
    const today = new Date().toISOString().slice(0, 10); // WO-600 Fix F: constrain date to today-or-earlier
    const [data, setData] = useState<LongitudinalAssessmentData>({
        ...initialData,
        assessment_date: initialData.assessment_date || today
    });
    const [isSaving, setIsSaving] = useState(false);
    const [showAlert, setShowAlert] = useState(false);

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
            setTimeout(() => {
                setIsSaving(false);
                if (onComplete) onComplete();
            }, 300);
        } else if (onComplete) {
            onComplete();
        }
    };

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
        return { icon: Minus, color: 'text-slate-300', label: 'Stable' };
    };

    const phq9Change = getChangeIndicator(data.phq9_score, baselineScores.phq9);
    const gad7Change = getChangeIndicator(data.gad7_score, baselineScores.gad7);

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                <h2 className="text-2xl font-black text-slate-300 flex items-center gap-3">
                    <TrendingUp className="w-7 h-7 text-blue-400" />
                    Longitudinal Assessment
                </h2>
                <p className="text-slate-300 text-sm mt-2">
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
                            max={today}
                            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-300"
                        />
                    </FormField>

                    <FormField label="PHQ-9 Score" tooltip="The PHQ-9 measures how severe your patient's depression symptoms are, on a scale from 0 to 27. Lower scores are better. Compare to the baseline score recorded in Phase 1 to see how much has changed.">
                        <div className="space-y-2">
                            <select
                                value={data.phq9_score ?? ''}
                                onChange={(e) => updateField('phq9_score', e.target.value !== '' ? parseInt(e.target.value) : undefined)}
                                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none"
                            >
                                <option value="">— Select —</option>
                                {[0,1,2,3,4].map(n => <option key={n} value={n}>{n} — None-minimal</option>)}
                                {[5,6,7,8,9].map(n => <option key={n} value={n}>{n} — Mild</option>)}
                                {[10,11,12,13,14].map(n => <option key={n} value={n}>{n} — Moderate</option>)}
                                {[15,16,17,18,19].map(n => <option key={n} value={n}>{n} — Moderately Severe</option>)}
                                {[20,21,22,23,24,25,26,27].map(n => <option key={n} value={n}>{n} — Severe</option>)}
                            </select>
                            {phq9Change && (
                                <div className={`flex items-center gap-2 text-sm ${phq9Change.color}`}>
                                    <phq9Change.icon className="w-4 h-4" />
                                    <span>{phq9Change.label} from baseline ({baselineScores.phq9})</span>
                                </div>
                            )}
                        </div>
                    </FormField>

                    <FormField label="GAD-7 Score" tooltip="The GAD-7 measures anxiety severity from 0 to 21. Lower scores are better. Use this alongside the PHQ-9 to get a full picture of your patient's mental health at this stage.">
                        <div className="space-y-2">
                            <select
                                value={data.gad7_score ?? ''}
                                onChange={(e) => updateField('gad7_score', e.target.value !== '' ? parseInt(e.target.value) : undefined)}
                                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none"
                            >
                                <option value="">— Select —</option>
                                {[0,1,2,3,4].map(n => <option key={n} value={n}>{n} — Minimal</option>)}
                                {[5,6,7,8,9].map(n => <option key={n} value={n}>{n} — Mild</option>)}
                                {[10,11,12,13,14].map(n => <option key={n} value={n}>{n} — Moderate</option>)}
                                {[15,16,17,18,19,20,21].map(n => <option key={n} value={n}>{n} — Severe</option>)}
                            </select>
                            {gad7Change && (
                                <div className={`flex items-center gap-2 text-sm ${gad7Change.color}`}>
                                    <gad7Change.icon className="w-4 h-4" />
                                    <span>{gad7Change.label} from baseline ({baselineScores.gad7})</span>
                                </div>
                            )}
                        </div>
                    </FormField>

                    <FormField label="WHOQOL Score" tooltip="The WHOQOL measures your patient's quality of life across four areas: physical health, mental and emotional health, social relationships, and living environment. Higher scores mean better overall quality of life. Scale is 0 to 100.">
                        <select
                            value={data.whoqol_score ?? ''}
                            onChange={(e) => updateField('whoqol_score', e.target.value !== '' ? parseInt(e.target.value) : undefined)}
                            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none"
                        >
                            <option value="">— Select —</option>
                            {Array.from({ length: 21 }, (_, i) => i * 5).map(n => (
                                <option key={n} value={n}>{n}</option>
                            ))}
                        </select>
                    </FormField>

                    <FormField label="PSQI Score" tooltip="The PSQI measures how well your patient has been sleeping over the past month. Scale is 0 to 21. Scores of 4 or below indicate good sleep. Scores of 5 or above indicate poor sleep quality and may need follow-up.">
                        <select
                            value={data.psqi_score ?? ''}
                            onChange={(e) => updateField('psqi_score', e.target.value !== '' ? parseInt(e.target.value) : undefined)}
                            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none"
                        >
                            <option value="">— Select —</option>
                            {[0,1,2,3,4].map(n => <option key={n} value={n}>{n} — Good Sleep</option>)}
                            {Array.from({ length: 17 }, (_, i) => i + 5).map(n => <option key={n} value={n}>{n} — Poor Sleep</option>)}
                        </select>
                    </FormField>

                    <FormField label="C-SSRS Score" tooltip="The C-SSRS measures suicidal thinking and behavior on a scale of 0 to 5. This field is required. Scores of 1 or 2 indicate passive thoughts. Scores of 3 or above indicate thoughts with intent or a plan, and will trigger an immediate clinical alert." required>
                        <select
                            value={data.cssrs_score ?? ''}
                            onChange={(e) => updateField('cssrs_score', e.target.value !== '' ? parseInt(e.target.value) : undefined)}
                            className={`w-full px-4 py-3 bg-slate-800/50 border rounded-lg text-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none ${
                                data.cssrs_score !== undefined && data.cssrs_score >= 3 ? 'border-red-500' : 'border-slate-700/50'
                            }`}
                        >
                            <option value="">— Select —</option>
                            <option value="0">0 — No ideation</option>
                            <option value="1">1 — Passive ideation</option>
                            <option value="2">2 — Passive ideation</option>
                            <option value="3">3 — ⚠️ Active ideation</option>
                            <option value="4">4 — ⚠️ Active ideation</option>
                            <option value="5">5 — ⚠️ Active ideation</option>
                        </select>
                    </FormField>
                </div>
            </div>

            <FormFooter
                onBack={onBack}
                onSaveAndExit={handleSaveAndExit}
                onSaveAndContinue={handleSaveAndContinue}
                isSaving={isSaving}
                hasChanges={Object.keys(data).length > 1}
            />
        </div>
    );
};

export default LongitudinalAssessmentForm;
