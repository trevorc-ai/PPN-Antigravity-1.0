import React, { useState } from 'react';
import { Brain, Save, CheckCircle, Star } from 'lucide-react';
import { FormField } from '../shared/FormField';

/**
 * StructuredIntegrationSessionForm - Structured Integration Session (NEW DESIGN)
 * Replaces free-text session notes with structured, PHI-safe inputs
 * 100% compliant with Arc of Care Design Guidelines v2.0
 */

export interface StructuredIntegrationSessionData {
    session_number: number;
    session_date: string;
    session_duration_minutes: 30 | 45 | 60 | 90;
    attendance_status: 'attended' | 'cancelled' | 'no_show';
    session_focus_ids: number[];
    insight_integration_rating: 1 | 2 | 3 | 4 | 5;
    emotional_processing_rating: 1 | 2 | 3 | 4 | 5;
    behavioral_application_rating: 1 | 2 | 3 | 4 | 5;
    engagement_level_rating: 1 | 2 | 3 | 4 | 5;
    homework_assigned_ids: number[];
    therapist_observation_ids: number[];
    next_session_scheduled?: string;
}

interface StructuredIntegrationSessionFormProps {
    onSave?: (data: StructuredIntegrationSessionData) => void;
    initialData?: Partial<StructuredIntegrationSessionData>;
    patientId?: string;
}

const SESSION_FOCUS_AREAS = [
    { id: 1, name: 'Processing Dosing Experience', category: 'processing' },
    { id: 2, name: 'Relationship Insights', category: 'relational' },
    { id: 3, name: 'Career/Purpose Exploration', category: 'existential' },
    { id: 4, name: 'Grief/Loss Processing', category: 'processing' },
    { id: 5, name: 'Trauma Integration', category: 'processing' },
    { id: 6, name: 'Behavioral Change Planning', category: 'behavioral' },
    { id: 7, name: 'Relapse Prevention', category: 'behavioral' },
    { id: 8, name: 'Spiritual/Existential Themes', category: 'existential' }
];

const HOMEWORK_TYPES = [
    { id: 1, name: 'Daily Journaling', frequency: '10 min/day' },
    { id: 2, name: 'Meditation Practice', frequency: '10 min/day' },
    { id: 3, name: 'Gratitude List', frequency: '3 items/day' },
    { id: 4, name: 'Nature Walks', frequency: '3x/week' },
    { id: 5, name: 'Reconnect with Family Member', frequency: 'once/week' },
    { id: 6, name: 'Creative Expression Activity', frequency: '2x/week' },
    { id: 7, name: 'Breathwork Practice', frequency: '5 min/day' },
    { id: 8, name: 'Values Clarification Exercise', frequency: 'once/week' }
];

const THERAPIST_OBSERVATIONS = [
    { id: 1, name: 'Patient shows insight into patterns', valence: 'positive' },
    { id: 2, name: 'Actively applying learnings', valence: 'positive' },
    { id: 3, name: 'Resistance to change noted', valence: 'concern' },
    { id: 4, name: 'Regression in symptoms', valence: 'concern' },
    { id: 5, name: 'Breakthrough moment occurred', valence: 'positive' },
    { id: 6, name: 'Increased self-compassion', valence: 'positive' },
    { id: 7, name: 'Strong therapeutic alliance', valence: 'positive' }
];

const StarRating: React.FC<{ value: number; onChange: (value: number) => void; label: string }> = ({ value, onChange, label }) => {
    return (
        <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">{label}</label>
            <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => onChange(star as 1 | 2 | 3 | 4 | 5)}
                        className="focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                    >
                        <Star
                            className={`w-8 h-8 transition-all ${star <= value
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-slate-400 hover:text-slate-400'
                                }`}
                        />
                    </button>
                ))}
                <span className="ml-2 text-sm text-slate-300">({value}/5)</span>
            </div>
        </div>
    );
};

const StructuredIntegrationSessionForm: React.FC<StructuredIntegrationSessionFormProps> = ({
    onSave,
    initialData = {},
    patientId
}) => {
    const [data, setData] = useState<StructuredIntegrationSessionData>({
        session_number: initialData.session_number || 1,
        session_date: initialData.session_date || new Date().toISOString().slice(0, 10),
        session_duration_minutes: initialData.session_duration_minutes || 45,
        attendance_status: initialData.attendance_status || 'attended',
        session_focus_ids: initialData.session_focus_ids || [],
        insight_integration_rating: initialData.insight_integration_rating || 3,
        emotional_processing_rating: initialData.emotional_processing_rating || 3,
        behavioral_application_rating: initialData.behavioral_application_rating || 3,
        engagement_level_rating: initialData.engagement_level_rating || 3,
        homework_assigned_ids: initialData.homework_assigned_ids || [],
        therapist_observation_ids: initialData.therapist_observation_ids || [],
        next_session_scheduled: initialData.next_session_scheduled
    });

    const updateField = <K extends keyof StructuredIntegrationSessionData>(
        field: K,
        value: StructuredIntegrationSessionData[K]
    ) => {
        setData(prev => ({ ...prev, [field]: value }));
    };

    const toggleArrayItem = (field: 'session_focus_ids' | 'homework_assigned_ids' | 'therapist_observation_ids', id: number) => {
        setData(prev => ({
            ...prev,
            [field]: prev[field].includes(id)
                ? prev[field].filter(i => i !== id)
                : [...prev[field], id]
        }));
    };

    const handleSave = () => {
        onSave?.(data);
    };

    const setToday = () => {
        updateField('session_date', new Date().toISOString().slice(0, 10));
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                <div className="flex items-start justify-between">
                    <div>
                        <h2 className="text-2xl font-black text-slate-300 flex items-center gap-3">
                            <Brain className="w-7 h-7 text-purple-400" />
                            Structured Integration Session
                        </h2>
                        <p className="text-slate-300 text-sm mt-2">
                            PHI-safe structured session documentation with zero free-text inputs
                        </p>
                    </div>
                    <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-3 py-1">
                        <span className="text-xs font-bold text-emerald-400">✓ 100% COMPLIANT</span>
                    </div>
                </div>
            </div>

            {/* Session Details */}
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField label="Session Number">
                        <input
                            type="number"
                            value={data.session_number}
                            onChange={(e) => updateField('session_number', parseInt(e.target.value) || 1)}
                            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-300"
                            min="1"
                        />
                    </FormField>

                    <FormField label="Session Date">
                        <div className="flex gap-2">
                            <input
                                type="date"
                                value={data.session_date}
                                onChange={(e) => updateField('session_date', e.target.value)}
                                className="flex-1 px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-300"
                            />
                            <button
                                type="button"
                                onClick={setToday}
                                className="px-4 py-3 bg-blue-500 hover:bg-blue-600 text-slate-300 rounded-lg font-medium transition-colors"
                            >
                                Today
                            </button>
                        </div>
                    </FormField>
                </div>

                <FormField label="Session Duration">
                    <div className="flex gap-2">
                        {[30, 45, 60, 90].map((duration) => (
                            <button
                                key={duration}
                                type="button"
                                onClick={() => updateField('session_duration_minutes', duration as 30 | 45 | 60 | 90)}
                                className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${data.session_duration_minutes === duration
                                    ? 'bg-blue-500 text-slate-300'
                                    : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 border border-slate-700/50'
                                    }`}
                            >
                                {duration} min
                            </button>
                        ))}
                    </div>
                </FormField>

                <FormField label="Attendance">
                    <div className="flex gap-2">
                        {[
                            { value: 'attended', label: 'Attended', color: 'emerald' },
                            { value: 'cancelled', label: 'Cancelled', color: 'yellow' },
                            { value: 'no_show', label: 'No-Show', color: 'red' }
                        ].map(({ value, label, color }) => (
                            <button
                                key={value}
                                type="button"
                                onClick={() => updateField('attendance_status', value as 'attended' | 'cancelled' | 'no_show')}
                                className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${data.attendance_status === value
                                    ? `bg-${color}-500 text-slate-300`
                                    : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 border border-slate-700/50'
                                    }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </FormField>
            </div>

            {/* Session Focus Areas */}
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 space-y-4">
                <FormField label="Session Focus Areas" tooltip="Select all themes discussed">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {SESSION_FOCUS_AREAS.map((focus) => (
                            <button
                                key={focus.id}
                                type="button"
                                onClick={() => toggleArrayItem('session_focus_ids', focus.id)}
                                className={`px-4 py-3 rounded-lg text-left font-medium transition-all ${data.session_focus_ids.includes(focus.id)
                                    ? 'bg-purple-500 text-slate-300'
                                    : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 border border-slate-700/50'
                                    }`}
                            >
                                <div className="flex items-center gap-2">
                                    <CheckCircle className={`w-4 h-4 ${data.session_focus_ids.includes(focus.id) ? 'opacity-100' : 'opacity-0'}`} />
                                    {focus.name}
                                </div>
                            </button>
                        ))}
                    </div>
                </FormField>
            </div>

            {/* Patient Progress Indicators */}
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 space-y-6">
                <h3 className="text-lg font-bold text-slate-300">Patient Progress Indicators</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <StarRating
                        label="Insight Integration"
                        value={data.insight_integration_rating}
                        onChange={(value) => updateField('insight_integration_rating', value)}
                    />
                    <StarRating
                        label="Emotional Processing"
                        value={data.emotional_processing_rating}
                        onChange={(value) => updateField('emotional_processing_rating', value)}
                    />
                    <StarRating
                        label="Behavioral Application"
                        value={data.behavioral_application_rating}
                        onChange={(value) => updateField('behavioral_application_rating', value)}
                    />
                    <StarRating
                        label="Engagement Level"
                        value={data.engagement_level_rating}
                        onChange={(value) => updateField('engagement_level_rating', value)}
                    />
                </div>
            </div>

            {/* Homework Assigned */}
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 space-y-4">
                <FormField label="Homework/Practice Assigned" tooltip="Select all assigned practices">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {HOMEWORK_TYPES.map((homework) => (
                            <button
                                key={homework.id}
                                type="button"
                                onClick={() => toggleArrayItem('homework_assigned_ids', homework.id)}
                                className={`px-4 py-3 rounded-lg text-left font-medium transition-all ${data.homework_assigned_ids.includes(homework.id)
                                    ? 'bg-cyan-500 text-slate-300'
                                    : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 border border-slate-700/50'
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className={`w-4 h-4 ${data.homework_assigned_ids.includes(homework.id) ? 'opacity-100' : 'opacity-0'}`} />
                                        {homework.name}
                                    </div>
                                    <span className="text-xs opacity-75">({homework.frequency})</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </FormField>
            </div>

            {/* Therapist Observations */}
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 space-y-4">
                <FormField label="Therapist Observations" tooltip="Select all that apply">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {THERAPIST_OBSERVATIONS.map((obs) => (
                            <button
                                key={obs.id}
                                type="button"
                                onClick={() => toggleArrayItem('therapist_observation_ids', obs.id)}
                                className={`px-4 py-3 rounded-lg text-left font-medium transition-all ${data.therapist_observation_ids.includes(obs.id)
                                    ? obs.valence === 'positive' ? 'bg-emerald-600 text-slate-300' : 'bg-yellow-600 text-slate-300'
                                    : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 border border-slate-700/50'
                                    }`}
                            >
                                <div className="flex items-center gap-2">
                                    <CheckCircle className={`w-4 h-4 ${data.therapist_observation_ids.includes(obs.id) ? 'opacity-100' : 'opacity-0'}`} />
                                    {obs.name}
                                </div>
                            </button>
                        ))}
                    </div>
                </FormField>
            </div>

            {/* Next Session */}
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                <FormField label="Next Session Scheduled">
                    <input
                        type="date"
                        value={data.next_session_scheduled || ''}
                        onChange={(e) => updateField('next_session_scheduled', e.target.value || undefined)}
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-300"
                    />
                </FormField>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
                <button
                    onClick={handleSave}
                    className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-slate-300 rounded-lg font-medium flex items-center gap-2 transition-colors"
                >
                    <Save className="w-5 h-5" />
                    Save Session
                </button>
            </div>
        </div>
    );
};

export default StructuredIntegrationSessionForm;
