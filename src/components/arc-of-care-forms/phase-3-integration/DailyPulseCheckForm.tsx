import React, { useState, useEffect } from 'react';
import { Heart, Save, CheckCircle } from 'lucide-react';
import { FormField } from '../shared/FormField';
import { StarRating } from '../shared/StarRating';

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
}

const DailyPulseCheckForm: React.FC<DailyPulseCheckFormProps> = ({
    onSave,
    initialData = {},
    patientId
}) => {
    const [data, setData] = useState<DailyPulseCheckData>({
        ...initialData,
        check_in_date: initialData.check_in_date || new Date().toISOString().slice(0, 10)
    });
    const [isSaving, setIsSaving] = useState(false);

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

    const updateField = (field: keyof DailyPulseCheckData, value: any) => {
        setData(prev => ({ ...prev, [field]: value }));
    };

    const isComplete = data.connection_level && data.sleep_quality && data.mood_level && data.anxiety_level;

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                <h2 className="text-2xl font-black text-slate-200 flex items-center gap-3">
                    <Heart className="w-7 h-7 text-pink-400" />
                    Daily Pulse Check
                </h2>
                <p className="text-slate-400 text-sm mt-2">
                    Quick daily check-in to track your wellness journey.
                </p>
            </div>

            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 space-y-8">
                <FormField label="Check-In Date">
                    <input
                        type="date"
                        value={data.check_in_date ?? ''}
                        onChange={(e) => updateField('check_in_date', e.target.value)}
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-200"
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
                        <p className="text-emerald-400 font-semibold">Check-in complete! Thank you.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DailyPulseCheckForm;
