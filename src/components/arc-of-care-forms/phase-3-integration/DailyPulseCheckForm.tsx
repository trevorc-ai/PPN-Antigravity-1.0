import React, { useState, useEffect } from 'react';
import { Heart, Save, CheckCircle } from 'lucide-react';
import { FormField } from '../shared/FormField';
import { StarRating } from '../shared/StarRating';
import { FormFooter } from '../shared/FormFooter';

/**
 * DailyPulseCheckForm - Daily Wellness Check-In
 * Simple 1-5 star ratings for Connection, Sleep, Mood, Anxiety
 */

export interface DailyPulseCheckData {
    connection_level?: number;
    sleep_quality?: number;
    mood_level?: number;
    anxiety_level?: number;
    check_in_date?: string;
}

interface DailyPulseCheckFormProps {
    onSave?: (data: DailyPulseCheckData) => void;
    initialData?: DailyPulseCheckData;
    patientId?: string;
    onComplete?: () => void;
    onExit?: () => void;
    onBack?: () => void;
}

const DailyPulseCheckForm: React.FC<DailyPulseCheckFormProps> = ({
    onSave,
    initialData = {} as DailyPulseCheckData,
    patientId,
    onComplete,
    onExit,
    onBack
}) => {
    const [data, setData] = useState<DailyPulseCheckData>({
        ...initialData,
        check_in_date: initialData.check_in_date || new Date().toISOString().slice(0, 10)
    });
    const [isSaving, setIsSaving] = useState(false);

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

    const updateField = (field: keyof DailyPulseCheckData, value: any) => {
        setData(prev => ({ ...prev, [field]: value }));
    };

    const isComplete = data.connection_level && data.sleep_quality && data.mood_level && data.anxiety_level;

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                <h2 className="text-2xl font-black text-slate-300 flex items-center gap-3">
                    <Heart className="w-7 h-7 text-pink-400" />
                    Daily Pulse Check
                </h2>
                <p className="text-slate-300 text-sm mt-2">
                    Quick daily check-in to track your wellness journey.
                </p>
            </div>

            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 space-y-8">
                <FormField label="Check-In Date">
                    <input
                        type="date"
                        value={data.check_in_date ?? ''}
                        onChange={(e) => updateField('check_in_date', e.target.value)}
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-300"
                    />
                </FormField>

                <FormField label="How connected do you feel today?" required>
                    <StarRating
                        value={data.connection_level}
                        onChange={(val) => updateField('connection_level', val)}
                    />
                </FormField>

                <FormField label="How was your sleep quality?" required>
                    <StarRating
                        value={data.sleep_quality}
                        onChange={(val) => updateField('sleep_quality', val)}
                    />
                </FormField>

                <FormField label="How is your mood today?" required>
                    <StarRating
                        value={data.mood_level}
                        onChange={(val) => updateField('mood_level', val)}
                    />
                </FormField>

                <FormField label="How is your anxiety level?" required>
                    <StarRating
                        value={data.anxiety_level}
                        onChange={(val) => updateField('anxiety_level', val)}
                    />
                </FormField>

                {isComplete && (
                    <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-lg text-center">
                        <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                        <p className="text-emerald-400 font-semibold">Check-in ready to save!</p>
                    </div>
                )}
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

export default DailyPulseCheckForm;
