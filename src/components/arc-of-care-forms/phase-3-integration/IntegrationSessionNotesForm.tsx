import React, { useState, useEffect } from 'react';
import { MessageSquare, Save, CheckCircle } from 'lucide-react';
import { FormField } from '../shared/FormField';

/**
 * IntegrationSessionNotesForm - Integration Session Notes
 * Therapist notes from integration sessions with session number tracking
 */

export interface IntegrationSessionNotesData {
    session_number?: number;
    session_date?: string;
    notes?: string;
    themes?: string[];
    homework_assigned?: string;
}

interface IntegrationSessionNotesFormProps {
    onSave?: (data: IntegrationSessionNotesData) => void;
    initialData?: IntegrationSessionNotesData;
    patientId?: string;
}

const COMMON_THEMES = [
    'Insights from Session',
    'Emotional Processing',
    'Behavioral Changes',
    'Relationship Dynamics',
    'Spiritual Experiences',
    'Trauma Processing',
    'Meaning Making'
];

const IntegrationSessionNotesForm: React.FC<IntegrationSessionNotesFormProps> = ({
    onSave,
    initialData = { themes: [] },
    patientId
}) => {
    const [data, setData] = useState<IntegrationSessionNotesData>({
        ...initialData,
        session_date: initialData.session_date || new Date().toISOString().slice(0, 10)
    });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (onSave && data.notes) {
            setIsSaving(true);
            const timer = setTimeout(() => {
                onSave(data);
                setIsSaving(false);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [data, onSave]);

    const updateField = (field: keyof IntegrationSessionNotesData, value: any) => {
        setData(prev => ({ ...prev, [field]: value }));
    };

    const toggleTheme = (theme: string) => {
        setData(prev => ({
            ...prev,
            themes: prev.themes?.includes(theme)
                ? prev.themes.filter(t => t !== theme)
                : [...(prev.themes || []), theme]
        }));
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                <h2 className="text-2xl font-black text-slate-200 flex items-center gap-3">
                    <MessageSquare className="w-7 h-7 text-cyan-400" />
                    Integration Session Notes
                </h2>
                <p className="text-slate-400 text-sm mt-2">
                    Document integration therapy sessions to support patient processing and meaning-making.
                </p>
            </div>

            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField label="Session Number">
                        <input
                            type="number"
                            value={data.session_number ?? ''}
                            onChange={(e) => updateField('session_number', e.target.value ? parseInt(e.target.value) : undefined)}
                            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-200"
                            placeholder="1"
                        />
                    </FormField>

                    <FormField label="Session Date">
                        <input
                            type="date"
                            value={data.session_date ?? ''}
                            onChange={(e) => updateField('session_date', e.target.value)}
                            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-200"
                        />
                    </FormField>
                </div>

                <FormField label="Session Themes" tooltip="Select all themes discussed">
                    <div className="flex flex-wrap gap-2">
                        {COMMON_THEMES.map((theme) => (
                            <button
                                key={theme}
                                onClick={() => toggleTheme(theme)}
                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${data.themes?.includes(theme)
                                        ? 'bg-cyan-500 text-white'
                                        : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50 border border-slate-700/50'
                                    }`}
                            >
                                {theme}
                            </button>
                        ))}
                    </div>
                </FormField>

                <FormField label="Session Notes" required>
                    <textarea
                        value={data.notes ?? ''}
                        onChange={(e) => updateField('notes', e.target.value)}
                        rows={10}
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        placeholder="Document session content, patient insights, therapeutic interventions, and progress..."
                    />
                    <p className="text-xs text-slate-500 mt-2">
                        {data.notes?.length || 0} characters
                    </p>
                </FormField>

                <FormField label="Homework Assigned">
                    <textarea
                        value={data.homework_assigned ?? ''}
                        onChange={(e) => updateField('homework_assigned', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        placeholder="Journaling prompts, reflection exercises, behavioral experiments..."
                    />
                </FormField>
            </div>
        </div>
    );
};

export default IntegrationSessionNotesForm;
