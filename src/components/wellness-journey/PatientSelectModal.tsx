import React, { useState, useMemo } from 'react';
import { UserPlus, Search, ChevronRight, Clock, Activity, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

/**
 * PatientSelectModal — WO-113 Phase 1 Gate
 *
 * Blocks the Wellness Journey until a provider explicitly chooses:
 *   A) New Patient  → generates a random PT-XXXXXXXXXX hash ID
 *   B) Existing Patient → searchable + filterable + sortable mock patient list
 *
 * Filters: Gender (M / F / NB), Phase (Preparation / Treatment / Integration / Complete)
 * Sort: Last Session Date (Newest → Oldest, Oldest → Newest)
 *
 * TODO: Replace MOCK_PATIENTS with a Supabase query after schema deployment.
 */

interface PatientSelectModalProps {
    onSelect: (patientId: string, isNew: boolean, phase: Phase) => void;
}

type Phase = 'Preparation' | 'Treatment' | 'Integration' | 'Complete';
type Gender = 'Male' | 'Female' | 'Non-binary';

interface MockPatient {
    id: string;
    lastSession: string; // ISO date string YYYY-MM-DD
    phase: Phase;
    sessionCount: number;
    gender: Gender;
    substance: string;
}

const MOCK_PATIENTS: MockPatient[] = [
    { id: 'PT-A7F2K9XR1M', lastSession: '2026-02-14', phase: 'Integration', sessionCount: 3, gender: 'Female', substance: 'Psilocybin' },
    { id: 'PT-B3K8M2NP4Q', lastSession: '2026-02-10', phase: 'Treatment', sessionCount: 1, gender: 'Male', substance: 'Ketamine' },
    { id: 'PT-C9X4R7ZT2K', lastSession: '2026-01-28', phase: 'Preparation', sessionCount: 0, gender: 'Non-binary', substance: 'MDMA' },
    { id: 'PT-D2M6W1YS8J', lastSession: '2026-01-15', phase: 'Complete', sessionCount: 4, gender: 'Male', substance: 'Psilocybin' },
    { id: 'PT-E5N9P3QA6L', lastSession: '2026-02-01', phase: 'Preparation', sessionCount: 0, gender: 'Female', substance: 'Ketamine' },
    { id: 'PT-F8T1V4XB7R', lastSession: '2026-01-22', phase: 'Integration', sessionCount: 2, gender: 'Female', substance: 'MDMA' },
    { id: 'PT-RISK9W2P0X', lastSession: '2026-02-17', phase: 'Preparation', sessionCount: 1, gender: 'Male', substance: 'Psilocybin' },
];

const PHASE_COLORS: Record<Phase, string> = {
    Preparation: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    Treatment: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    Integration: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    Complete: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
};

const ALL_PHASES: Phase[] = ['Preparation', 'Treatment', 'Integration', 'Complete'];
const ALL_GENDERS: Gender[] = ['Male', 'Female', 'Non-binary'];

function generatePatientId(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let id = 'PT-';
    for (let i = 0; i < 10; i++) id += chars[Math.floor(Math.random() * chars.length)];
    return id;
}

// Chip button — highlighted when active
function FilterChip({
    label,
    active,
    onClick,
}: {
    label: string;
    active: boolean;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all active:scale-95 ${active
                ? 'bg-indigo-600 text-white border-indigo-500 shadow shadow-indigo-600/30'
                : 'bg-slate-800/60 text-slate-400 border-slate-700/50 hover:border-slate-500 hover:text-slate-200'
                }`}
        >
            {label}
        </button>
    );
}

export const PatientSelectModal: React.FC<PatientSelectModalProps> = ({ onSelect }) => {
    const [view, setView] = useState<'choose' | 'existing'>('choose');
    const [search, setSearch] = useState('');
    const [sortDir, setSortDir] = useState<'desc' | 'asc'>('desc');
    const [genderFilter, setGenderFilter] = useState<Gender | null>(null);
    const [phaseFilter, setPhaseFilter] = useState<Phase | null>(null);
    const [newId] = useState(generatePatientId);

    const filtered = useMemo(() => {
        let list = [...MOCK_PATIENTS];

        // Search by ID
        if (search.trim()) {
            list = list.filter(p => p.id.toLowerCase().includes(search.toLowerCase()));
        }

        // Gender filter
        if (genderFilter) {
            list = list.filter(p => p.gender === genderFilter);
        }

        // Phase filter
        if (phaseFilter) {
            list = list.filter(p => p.phase === phaseFilter);
        }

        // Sort by lastSession date
        list.sort((a, b) => {
            const cmp = a.lastSession.localeCompare(b.lastSession);
            return sortDir === 'desc' ? -cmp : cmp;
        });

        return list;
    }, [search, genderFilter, phaseFilter, sortDir]);

    const toggleGender = (g: Gender) => setGenderFilter(prev => (prev === g ? null : g));
    const togglePhase = (p: Phase) => setPhaseFilter(prev => (prev === p ? null : p));
    const toggleSort = () => setSortDir(prev => (prev === 'desc' ? 'asc' : 'desc'));

    const activeFiltersCount = (genderFilter ? 1 : 0) + (phaseFilter ? 1 : 0);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#060d1a]/90 backdrop-blur-md">
            <div className="w-full max-w-2xl mx-4">

                {/* ── Choose View ─────────────────────────────────────────── */}
                {view === 'choose' && (
                    <div className="bg-slate-900 border border-slate-700/60 rounded-2xl overflow-hidden shadow-2xl shadow-black/60">
                        <div className="px-8 pt-8 pb-6 border-b border-slate-800">
                            <h2 className="text-2xl font-black text-white">Start a Wellness Session</h2>
                            <p className="text-slate-400 text-sm mt-1">
                                Select a patient before accessing any clinical forms.
                            </p>
                        </div>

                        <div className="p-6 space-y-4">
                            {/* New Patient */}
                            <button
                                onClick={() => onSelect(newId, true, 'Preparation')}
                                className="w-full group flex items-center gap-5 p-5 bg-indigo-600/10 hover:bg-indigo-600/20 border border-indigo-500/30 hover:border-indigo-500/60 rounded-xl transition-all active:scale-[0.99] text-left"
                            >
                                <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center flex-shrink-0">
                                    <UserPlus className="w-6 h-6 text-indigo-400" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-base font-bold text-white">New Patient</p>
                                    <p className="text-sm text-slate-400 mt-0.5">
                                        Assign a new anonymous ID and begin Phase 1
                                    </p>
                                    <p className="text-xs text-indigo-400 font-mono mt-2 tracking-wide">
                                        → {newId}
                                    </p>
                                </div>
                                <ChevronRight className="w-5 h-5 text-indigo-400 group-hover:translate-x-1 transition-transform" />
                            </button>

                            {/* Existing Patient */}
                            <button
                                onClick={() => setView('existing')}
                                className="w-full group flex items-center gap-5 p-5 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 hover:border-slate-600 rounded-xl transition-all active:scale-[0.99] text-left"
                            >
                                <div className="w-12 h-12 rounded-xl bg-slate-700/60 border border-slate-600/50 flex items-center justify-center flex-shrink-0">
                                    <Search className="w-6 h-6 text-slate-400" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-base font-bold text-white">Existing Patient</p>
                                    <p className="text-sm text-slate-400 mt-0.5">
                                        Look up a patient by ID and continue their journey
                                    </p>
                                </div>
                                <ChevronRight className="w-5 h-5 text-slate-500 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>

                        <div className="px-6 pb-5 text-center">
                            <p className="text-xs text-slate-600">
                                All patient data is anonymised. No PHI is stored in free-text fields.
                            </p>
                        </div>
                    </div>
                )}

                {/* ── Existing Patient View ────────────────────────────────── */}
                {view === 'existing' && (
                    <div className="bg-slate-900 border border-slate-700/60 rounded-2xl overflow-hidden shadow-2xl shadow-black/60">
                        {/* Header */}
                        <div className="px-6 pt-6 pb-4 border-b border-slate-800">
                            <button
                                onClick={() => setView('choose')}
                                className="text-xs text-slate-500 hover:text-slate-300 transition-colors mb-3 flex items-center gap-1"
                            >
                                ← Back
                            </button>
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-black text-white">Select Patient</h2>
                                    <p className="text-slate-400 text-sm mt-0.5">
                                        {filtered.length} of {MOCK_PATIENTS.length} patients
                                        {activeFiltersCount > 0 && (
                                            <span className="text-indigo-400 ml-1">· {activeFiltersCount} filter{activeFiltersCount > 1 ? 's' : ''} active</span>
                                        )}
                                    </p>
                                </div>
                                {/* Sort toggle */}
                                <button
                                    type="button"
                                    onClick={toggleSort}
                                    className="flex items-center gap-1.5 px-3 py-2 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 hover:border-slate-600 rounded-lg text-xs font-semibold text-slate-400 hover:text-slate-200 transition-all"
                                    title={sortDir === 'desc' ? 'Newest first — click for oldest first' : 'Oldest first — click for newest first'}
                                >
                                    {sortDir === 'desc'
                                        ? <ArrowDown className="w-3.5 h-3.5" />
                                        : <ArrowUp className="w-3.5 h-3.5" />
                                    }
                                    Date
                                </button>
                            </div>
                        </div>

                        {/* Search + Filters */}
                        <div className="px-6 pt-4 space-y-3">
                            {/* Search */}
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input
                                    type="text"
                                    placeholder="Search patient ID…"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    autoFocus
                                    className="w-full pl-10 pr-4 py-3 bg-slate-800/60 border border-slate-700/50 focus:border-indigo-500/60 rounded-xl text-slate-200 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
                                />
                            </div>

                            {/* Gender filter chips */}
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-xs text-slate-500 font-medium">Gender:</span>
                                {ALL_GENDERS.map(g => (
                                    <React.Fragment key={g}>
                                        <FilterChip
                                            label={g}
                                            active={genderFilter === g}
                                            onClick={() => toggleGender(g)}
                                        />
                                    </React.Fragment>
                                ))}
                            </div>

                            {/* Phase filter chips */}
                            <div className="flex items-center gap-2 flex-wrap pb-1">
                                <span className="text-xs text-slate-500 font-medium">Phase:</span>
                                {ALL_PHASES.map(p => (
                                    <React.Fragment key={p}>
                                        <FilterChip
                                            label={p}
                                            active={phaseFilter === p}
                                            onClick={() => togglePhase(p)}
                                        />
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>

                        {/* Patient List */}
                        <div className="px-6 py-3 space-y-2 max-h-96 overflow-y-auto custom-scrollbar">
                            {filtered.length === 0 && (
                                <p className="text-center text-slate-500 text-sm py-8">No patients match these filters</p>
                            )}
                            {filtered.map(patient => (
                                <button
                                    key={patient.id}
                                    onClick={() => onSelect(patient.id, false, patient.phase)}
                                    className="w-full flex items-center justify-between px-4 py-3.5 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-slate-600 rounded-xl transition-all active:scale-[0.99] text-left group"
                                >
                                    <div>
                                        <p className="text-base font-bold text-white font-mono tracking-wide">
                                            {patient.id}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1.5 text-sm text-slate-400">
                                            <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                                            <span>{patient.lastSession}</span>
                                            <span className="text-slate-600">·</span>
                                            <Activity className="w-3.5 h-3.5 flex-shrink-0" />
                                            <span>{patient.sessionCount} session{patient.sessionCount !== 1 ? 's' : ''}</span>
                                            <span className="text-slate-600">·</span>
                                            <span>{patient.gender}</span>
                                            <span className="text-slate-600">·</span>
                                            <span className="px-2 py-0.5 rounded-md bg-slate-700/60 border border-slate-600/40">
                                                {patient.substance}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`text-sm font-semibold px-2.5 py-1 rounded-lg border ${PHASE_COLORS[patient.phase]}`}>
                                            {patient.phase}
                                        </span>
                                        <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 group-hover:translate-x-0.5 transition-all" />
                                    </div>
                                </button>
                            ))}
                        </div>

                        <div className="px-6 pb-4 pt-1 text-center">
                            <p className="text-xs text-slate-600">
                                {MOCK_PATIENTS.length} patients on record · Mock data · DB sync pending
                            </p>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default PatientSelectModal;
