import React, { useState, useCallback } from 'react';
import { Calendar, TrendingUp, Star, ChevronDown } from 'lucide-react';
import { createBehavioralChange } from '../../services/clinicalLog';
import { RefPicker, RefPickerItem } from '../ui/RefPicker';

interface BehavioralChangeTrackerProps {
    patientId: string;
    sessionId?: number;
    onSave?: (data: BehavioralChangeData) => void;
}

interface BehavioralChangeData {
    change_date: string;
    change_type: string;
    what_changed_ids: number[];   // FK integer IDs — WO-214
    is_positive: boolean;
    impact_level: 'highly_positive' | 'moderately_positive' | 'neutral' | 'moderately_negative' | 'highly_negative';
    confidence_score: number;
    session_relation: 'direct' | 'indirect' | 'unrelated';
}

const CHANGE_TYPES = [
    { id: 'relationship', label: 'Relationship', icon: '🤝' },
    { id: 'substance_use', label: 'Substance Use', icon: '🚫' },
    { id: 'exercise', label: 'Exercise', icon: '🏃' },
    { id: 'work_career', label: 'Work / Career', icon: '💼' },
    { id: 'hobby_creative', label: 'Hobby / Creative', icon: '🎨' },
    { id: 'self_care', label: 'Self-Care', icon: '🧘' },
    { id: 'sleep', label: 'Sleep', icon: '😴' },
    { id: 'nutrition', label: 'Nutrition', icon: '🥗' },
];

// WO-214: Numeric IDs are interim (1-8) — will align to ref_behavioral_change_actions
// PKs once that table is seeded. Using offset 301+ to avoid collision.
const WHAT_CHANGED_ITEMS: RefPickerItem[] = [
    { id: 301, label: 'Set new boundaries' },
    { id: 302, label: 'Started new practice / habit' },
    { id: 303, label: 'Ended unhealthy pattern' },
    { id: 304, label: 'Reached out to someone' },
    { id: 305, label: 'Forgave someone / let go' },
    { id: 306, label: 'Expressed needs openly' },
    { id: 307, label: 'Reduced avoidance behavior' },
    { id: 308, label: 'Increased present-moment awareness' },
];

const IMPACT_OPTIONS = [
    { id: 'highly_positive', label: 'Highly Positive', color: 'emerald' },
    { id: 'moderately_positive', label: 'Moderately Positive', color: 'teal' },
    { id: 'neutral', label: 'Neutral', color: 'slate' },
    { id: 'moderately_negative', label: 'Moderately Negative', color: 'amber' },
    { id: 'highly_negative', label: 'Highly Negative', color: 'red' },
] as const;

const SESSION_RELATION_OPTIONS = [
    { id: 'direct', label: 'Direct insight from session' },
    { id: 'indirect', label: 'Indirectly influenced by session' },
    { id: 'unrelated', label: 'Unrelated to treatment' },
] as const;

const StarRating: React.FC<{
    value: number;
    onChange: (v: number) => void;
    label: string;
}> = ({ value, onChange, label }) => (
    <div>
        <p className="text-sm font-black text-slate-400 uppercase tracking-widest mb-2">{label}</p>
        <div className="flex items-center gap-2" role="group" aria-label={`${label} rating`}>
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={() => onChange(star)}
                    aria-label={`${star} out of 5`}
                    aria-pressed={value >= star}
                    className="transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary rounded"
                >
                    <Star
                        className={`w-6 h-6 ${value >= star ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`}
                    />
                </button>
            ))}
            <span className="ml-1 text-sm font-bold text-slate-400">{value}/5</span>
        </div>
    </div>
);

export const BehavioralChangeTracker: React.FC<BehavioralChangeTrackerProps> = ({
    patientId,
    sessionId,
    onSave,
}) => {
    const today = new Date().toISOString().slice(0, 10);

    const [form, setForm] = useState<BehavioralChangeData>({
        change_date: today,
        change_type: '',
        what_changed_ids: [],  // number[] — RefPicker (WO-214)
        is_positive: true,
        impact_level: 'moderately_positive',
        confidence_score: 0,
        session_relation: 'direct',
    });

    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

    // WO-214: RefPicker handles toggle internally — onChange provides full number[] directly

    const handleSave = useCallback(async () => {
        if (!form.change_type || form.confidence_score === 0) return;
        setSaveStatus('saving');
        try {
            // WO-213: Routed through clinicalLog service layer (not direct Supabase)
            const result = await createBehavioralChange({
                patient_id: patientId,
                session_id: sessionId !== undefined ? String(sessionId) : undefined,
                change_date: form.change_date,
                change_type: form.change_type,
                change_type_ids: form.what_changed_ids,       // ✅ WO-214: integer FK IDs
                is_positive: ['highly_positive', 'moderately_positive'].includes(form.impact_level),
                impact_on_wellbeing: form.impact_level,
                confidence_sustaining: form.confidence_score,
                related_to_dosing: form.session_relation,
            });
            if (!result.success) throw result.error;
            setSaveStatus('saved');
            onSave?.(form);
            setTimeout(() => setSaveStatus('idle'), 3000);
        } catch {
            setSaveStatus('error');
            setTimeout(() => setSaveStatus('idle'), 3000);
        }
    }, [form, patientId, sessionId, onSave]);

    const isValid = form.change_type && form.confidence_score > 0;

    return (
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                    <h3 className="text-lg font-black text-slate-300">Behavioral Change Tracker</h3>
                    <p className="text-sm text-slate-500 uppercase tracking-widest">Phase 3 — Integration Progress</p>
                </div>
            </div>

            {/* Change Date */}
            <div>
                <label htmlFor="change-date" className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                    Change Date
                </label>
                <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                    <input
                        id="change-date"
                        type="date"
                        value={form.change_date}
                        max={today}
                        onChange={(e) => setForm((f) => ({ ...f, change_date: e.target.value }))}
                        className="w-full bg-slate-800/60 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-slate-300 text-sm font-bold focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                    />
                </div>
            </div>

            {/* Change Type */}
            <div>
                <p className="text-sm font-black text-slate-400 uppercase tracking-widest mb-3">Change Type</p>
                <div className="grid grid-cols-2 gap-2">
                    {CHANGE_TYPES.map((type) => (
                        <button
                            key={type.id}
                            type="button"
                            onClick={() => setForm((f) => ({ ...f, change_type: type.id }))}
                            aria-pressed={form.change_type === type.id}
                            className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-bold transition-all ${form.change_type === type.id
                                ? 'bg-primary/20 border-primary text-primary'
                                : 'bg-slate-800/40 border-slate-700 text-slate-400 hover:border-slate-600'
                                }`}
                        >
                            <span>{type.icon}</span>
                            <span>{type.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* What Changed — RefPicker WO-214 */}
            <RefPicker
                items={WHAT_CHANGED_ITEMS}
                selected={form.what_changed_ids}
                onChange={(ids) => setForm((f) => ({ ...f, what_changed_ids: ids }))}
                label="What Changed? (select all that apply)"
                multi={true}
            />

            {/* Impact on Well-Being */}
            <div>
                <p className="text-sm font-black text-slate-400 uppercase tracking-widest mb-3">Impact on Well-Being</p>
                <div className="relative">
                    <select
                        value={form.impact_level}
                        onChange={(e) => setForm((f) => ({ ...f, impact_level: e.target.value as BehavioralChangeData['impact_level'], is_positive: ['highly_positive', 'moderately_positive'].includes(e.target.value) }))}
                        className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 text-slate-300 text-sm font-bold appearance-none focus:ring-2 focus:ring-primary outline-none transition-all"
                    >
                        {IMPACT_OPTIONS.map((opt) => (
                            <option key={opt.id} value={opt.id}>{opt.label}</option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                </div>
            </div>

            {/* Confidence in Sustaining Change */}
            <StarRating
                label="Confidence in Sustaining Change"
                value={form.confidence_score}
                onChange={(v) => setForm((f) => ({ ...f, confidence_score: v }))}
            />

            {/* Session Relation */}
            <div>
                <p className="text-sm font-black text-slate-400 uppercase tracking-widest mb-3">Related to Dosing Session?</p>
                <div className="space-y-2">
                    {SESSION_RELATION_OPTIONS.map((opt) => (
                        <label
                            key={opt.id}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all ${form.session_relation === opt.id
                                ? 'bg-primary/10 border-primary/40 text-slate-300'
                                : 'bg-slate-800/30 border-slate-700/50 text-slate-400 hover:border-slate-600'
                                }`}
                        >
                            <input
                                type="radio"
                                name="session_relation"
                                value={opt.id}
                                checked={form.session_relation === opt.id}
                                onChange={() => setForm((f) => ({ ...f, session_relation: opt.id }))}
                                className="w-4 h-4 accent-primary"
                            />
                            <span className="text-sm font-medium">{opt.label}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Validation hint */}
            {!isValid && (
                <p className="text-sm text-amber-400 font-bold">
                    ⚠️ Select a change type and confidence rating to save.
                </p>
            )}

            {/* Save Button */}
            <button
                type="button"
                onClick={handleSave}
                disabled={!isValid || saveStatus === 'saving'}
                className={`w-full py-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all ${!isValid
                    ? 'bg-slate-800/40 border border-slate-700 text-slate-600 cursor-not-allowed'
                    : saveStatus === 'saved'
                        ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400'
                        : saveStatus === 'error'
                            ? 'bg-red-500/20 border border-red-500/40 text-red-400'
                            : 'bg-blue-500/20 border border-blue-500/40 text-blue-400 hover:bg-blue-500/30 active:scale-[0.98]'
                    }`}
            >
                {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? '✓ Change Recorded' : saveStatus === 'error' ? '✗ Save Failed' : 'Log Behavioral Change'}
            </button>
        </div>
    );
};

export default BehavioralChangeTracker;
