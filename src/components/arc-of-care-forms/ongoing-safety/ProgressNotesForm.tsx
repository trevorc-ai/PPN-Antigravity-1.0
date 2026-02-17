import React, { useState, useEffect } from 'react';
import { FileText, Save, CheckCircle } from 'lucide-react';
import { FormField } from '../shared/FormField';

/**
 * ProgressNotesForm - General Clinical Progress Notes
 * Free-text progress notes for ongoing documentation
 */

export interface ProgressNotesData {
    note_date?: string;
    note_type?: string;
    progress_note?: string;
}

interface ProgressNotesFormProps {
    onSave?: (data: ProgressNotesData) => void;
    initialData?: ProgressNotesData;
    patientId?: string;
}

const NOTE_TYPES = [
    'Check-In Call',
    'Clinical Assessment',
    'Safety Follow-Up',
    'Integration Support',
    'General Progress',
    'Coordination of Care'
];

const ProgressNotesForm: React.FC<ProgressNotesFormProps> = ({
    onSave,
    initialData = {},
    patientId
}) => {
    const [data, setData] = useState<ProgressNotesData>({
        ...initialData,
        note_date: initialData.note_date || new Date().toISOString().slice(0, 10)
    });
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);

    useEffect(() => {
        if (onSave && data.progress_note) {
            setIsSaving(true);
            const timer = setTimeout(() => {
                onSave(data);
                setIsSaving(false);
                setLastSaved(new Date());
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [data, onSave]);

    const updateField = (field: keyof ProgressNotesData, value: any) => {
        setData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                <div className="flex items-start justify-between">
                    <div>
                        <h2 className="text-2xl font-black text-slate-200 flex items-center gap-3">
                            <FileText className="w-7 h-7 text-slate-400" />
                            Progress Notes
                        </h2>
                        <p className="text-slate-400 text-sm mt-2">
                            Document clinical progress, observations, and ongoing care activities.
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

            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField label="Note Date">
                        <input
                            type="date"
                            value={data.note_date ?? ''}
                            onChange={(e) => updateField('note_date', e.target.value)}
                            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </FormField>

                    <FormField label="Note Type">
                        <select
                            value={data.note_type ?? ''}
                            onChange={(e) => updateField('note_type', e.target.value)}
                            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Select note type...</option>
                            {NOTE_TYPES.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </FormField>
                </div>

                <FormField label="Progress Note" required>
                    <textarea
                        value={data.progress_note ?? ''}
                        onChange={(e) => updateField('progress_note', e.target.value)}
                        rows={12}
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono text-sm"
                        placeholder="SOAP Format Recommended:

S (Subjective): Patient-reported symptoms, concerns, experiences
O (Objective): Observable data, vital signs, assessment scores
A (Assessment): Clinical interpretation and diagnosis
P (Plan): Treatment plan, interventions, follow-up actions"
                    />
                    <div className="flex items-center justify-between mt-2">
                        <p className="text-xs text-slate-500">
                            {data.progress_note?.length || 0} characters
                        </p>
                        <p className="text-xs text-slate-500">
                            {data.progress_note?.split('\n').length || 0} lines
                        </p>
                    </div>
                </FormField>

                {data.progress_note && data.progress_note.length > 100 && (
                    <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-lg">
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-emerald-400" />
                            <p className="text-emerald-400 font-semibold text-sm">
                                Progress note saved and will be included in patient record.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProgressNotesForm;
