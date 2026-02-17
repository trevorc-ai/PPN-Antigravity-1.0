import React, { useState, useEffect } from 'react';
import { Brain, Save, CheckCircle } from 'lucide-react';
import { FormField } from '../shared/FormField';
import { NumberInput } from '../shared/NumberInput';

/**
 * MentalHealthScreeningForm - Baseline Mental Health Assessments
 * 
 * Fields: PHQ-9, GAD-7, ACE, PCL-5
 * Layout: 2x2 grid (desktop), 1 column (mobile)
 * Features: Color-coded severity, auto-save, interpretation text
 */

export interface MentalHealthScreeningData {
    phq9_score?: number;
    gad7_score?: number;
    ace_score?: number;
    pcl5_score?: number;
}

interface MentalHealthScreeningFormProps {
    onSave?: (data: MentalHealthScreeningData) => void;
    initialData?: MentalHealthScreeningData;
    patientId?: string;
}

const MentalHealthScreeningForm: React.FC<MentalHealthScreeningFormProps> = ({
    onSave,
    initialData = {},
    patientId
}) => {
    const [data, setData] = useState<MentalHealthScreeningData>(initialData);
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

    const updateField = (field: keyof MentalHealthScreeningData, value: number | undefined) => {
        setData(prev => ({ ...prev, [field]: value }));
    };

    const getSeverity = (score: number | undefined, type: 'phq9' | 'gad7' | 'ace' | 'pcl5'): { level: string; color: string; text: string } => {
        if (!score) return { level: '', color: '', text: '' };

        switch (type) {
            case 'phq9':
                if (score <= 4) return { level: 'Minimal', color: 'text-emerald-400', text: 'Minimal depression' };
                if (score <= 9) return { level: 'Mild', color: 'text-yellow-400', text: 'Mild depression' };
                if (score <= 14) return { level: 'Moderate', color: 'text-orange-400', text: 'Moderate depression' };
                if (score <= 19) return { level: 'Moderately Severe', color: 'text-red-400', text: 'Moderately severe depression' };
                return { level: 'Severe', color: 'text-red-500', text: 'Severe depression' };

            case 'gad7':
                if (score <= 4) return { level: 'Minimal', color: 'text-emerald-400', text: 'Minimal anxiety' };
                if (score <= 9) return { level: 'Mild', color: 'text-yellow-400', text: 'Mild anxiety' };
                if (score <= 14) return { level: 'Moderate', color: 'text-orange-400', text: 'Moderate anxiety' };
                return { level: 'Severe', color: 'text-red-400', text: 'Severe anxiety' };

            case 'ace':
                if (score <= 3) return { level: 'Low', color: 'text-emerald-400', text: 'Low ACE score' };
                if (score <= 6) return { level: 'Moderate', color: 'text-yellow-400', text: 'Moderate ACE score' };
                return { level: 'High', color: 'text-red-400', text: 'High ACE score' };

            case 'pcl5':
                if (score < 31) return { level: 'Below Threshold', color: 'text-emerald-400', text: 'Below PTSD threshold' };
                if (score <= 44) return { level: 'Moderate', color: 'text-yellow-400', text: 'Moderate PTSD symptoms' };
                return { level: 'Severe', color: 'text-red-400', text: 'Severe PTSD symptoms' };
        }
    };

    const phq9Severity = getSeverity(data.phq9_score, 'phq9');
    const gad7Severity = getSeverity(data.gad7_score, 'gad7');
    const aceSeverity = getSeverity(data.ace_score, 'ace');
    const pcl5Severity = getSeverity(data.pcl5_score, 'pcl5');

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                <div className="flex items-start justify-between">
                    <div>
                        <h2 className="text-2xl font-black text-slate-200 flex items-center gap-3">
                            <Brain className="w-7 h-7 text-purple-400" />
                            Mental Health Screening
                        </h2>
                        <p className="text-slate-400 text-sm mt-2">
                            Baseline psychological assessments to establish treatment eligibility and track outcomes.
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

            {/* Assessment Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* PHQ-9 */}
                <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 space-y-4">
                    <FormField
                        label="PHQ-9 Score"
                        tooltip="Patient Health Questionnaire-9: Depression screening (0-27)"
                        required
                    >
                        <NumberInput
                            value={data.phq9_score}
                            onChange={(val) => updateField('phq9_score', val)}
                            min={0}
                            max={27}
                            placeholder="0-27"
                        />
                    </FormField>
                    {data.phq9_score !== undefined && (
                        <div className={`p-3 rounded-lg bg-slate-800/50 border ${phq9Severity.color} border-current/20`}>
                            <p className={`text-sm font-bold ${phq9Severity.color}`}>
                                {phq9Severity.level}: {phq9Severity.text}
                            </p>
                        </div>
                    )}
                </div>

                {/* GAD-7 */}
                <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 space-y-4">
                    <FormField
                        label="GAD-7 Score"
                        tooltip="Generalized Anxiety Disorder-7: Anxiety screening (0-21)"
                        required
                    >
                        <NumberInput
                            value={data.gad7_score}
                            onChange={(val) => updateField('gad7_score', val)}
                            min={0}
                            max={21}
                            placeholder="0-21"
                        />
                    </FormField>
                    {data.gad7_score !== undefined && (
                        <div className={`p-3 rounded-lg bg-slate-800/50 border ${gad7Severity.color} border-current/20`}>
                            <p className={`text-sm font-bold ${gad7Severity.color}`}>
                                {gad7Severity.level}: {gad7Severity.text}
                            </p>
                        </div>
                    )}
                </div>

                {/* ACE */}
                <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 space-y-4">
                    <FormField
                        label="ACE Score"
                        tooltip="Adverse Childhood Experiences: Trauma history (0-10)"
                        required
                    >
                        <NumberInput
                            value={data.ace_score}
                            onChange={(val) => updateField('ace_score', val)}
                            min={0}
                            max={10}
                            placeholder="0-10"
                        />
                    </FormField>
                    {data.ace_score !== undefined && (
                        <div className={`p-3 rounded-lg bg-slate-800/50 border ${aceSeverity.color} border-current/20`}>
                            <p className={`text-sm font-bold ${aceSeverity.color}`}>
                                {aceSeverity.level}: {aceSeverity.text}
                            </p>
                        </div>
                    )}
                </div>

                {/* PCL-5 */}
                <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 space-y-4">
                    <FormField
                        label="PCL-5 Score"
                        tooltip="PTSD Checklist for DSM-5: PTSD screening (0-80)"
                        required
                    >
                        <NumberInput
                            value={data.pcl5_score}
                            onChange={(val) => updateField('pcl5_score', val)}
                            min={0}
                            max={80}
                            placeholder="0-80"
                        />
                    </FormField>
                    {data.pcl5_score !== undefined && (
                        <div className={`p-3 rounded-lg bg-slate-800/50 border ${pcl5Severity.color} border-current/20`}>
                            <p className={`text-sm font-bold ${pcl5Severity.color}`}>
                                {pcl5Severity.level}: {pcl5Severity.text}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MentalHealthScreeningForm;
