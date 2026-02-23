import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { UserPlus, Search, ChevronRight, Clock, Activity, ArrowUp, ArrowDown, X, Loader2, AlertCircle, Camera, Lock, QrCode } from 'lucide-react';
import { supabase } from '../../supabaseClient';
import { getCurrentSiteId, generatePatientId } from '../../services/identity';

/**
 * PatientSelectModal — WO-118 Live DB Integration
 *
 * Fetches real patient records from log_clinical_records filtered by the
 * practitioner's current site_id (from log_user_sites via getCurrentSiteId).
 *
 * Previous: MOCK_PATIENTS hardcoded array
 * Now:      Live Supabase query, grouped by patient_link_code
 */

interface PatientSelectModalProps {
    onSelect: (patientId: string, isNew: boolean, phase: Phase) => void;
    onClose?: () => void;
    /** Phase 1 → 'choose' (New + Existing). Phase 2/3 → 'existing' (lookup only). */
    initialView?: 'choose' | 'existing';
}

type Phase = 'Preparation' | 'Treatment' | 'Integration' | 'Complete';

interface LivePatient {
    id: string;
    lastSession: string;
    phase: Phase;
    sessionCount: number;
    sessionType: string;
    substance?: string;
}

const PHASE_COLORS: Record<Phase, string> = {
    Preparation: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    Treatment: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    Integration: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    Complete: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
};

const ALL_PHASES: Phase[] = ['Preparation', 'Treatment', 'Integration', 'Complete'];

/** Derive a Phase from the most recent session_type in log_clinical_records */
function derivePhase(sessionType: string | null): Phase {
    if (!sessionType) return 'Preparation';
    const t = sessionType.toLowerCase();
    if (t.includes('integrat')) return 'Integration';
    if (t.includes('dos') || t.includes('treatment') || t.includes('medicine')) return 'Treatment';
    if (t.includes('complet') || t.includes('follow')) return 'Complete';
    return 'Preparation';
}

// generatePatientId() imported from ../../services/identity (WO-206 service isolation)

const FilterChip: React.FC<{ label: string; active: boolean; onClick: () => void }> =
    ({ label, active, onClick }) => {

        return (
            <button
                type="button"
                onClick={onClick}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all active:scale-95 ${active
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow shadow-indigo-600/30'
                    : 'bg-slate-800/60 text-slate-400 border-slate-700/50 hover:border-slate-500 hover:text-[#A8B5D1]'
                    }`}
            >
                {label}
            </button>
        );
    }

export const PatientSelectModal: React.FC<PatientSelectModalProps> = ({ onSelect, onClose, initialView = 'choose' }) => {
    const [view, setView] = useState<'choose' | 'existing'>(initialView);
    const [search, setSearch] = useState('');
    const [sortDir, setSortDir] = useState<'desc' | 'asc'>('desc');
    const [phaseFilter, setPhaseFilter] = useState<Phase | null>(null);
    const [newId] = useState(generatePatientId);
    const [scannerOpen, setScannerOpen] = useState(false);

    // Live data state
    const [patients, setPatients] = useState<LivePatient[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Escape key closes the modal
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose?.(); };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [onClose]);

    // Fetch live patients when existing view opens
    const fetchPatients = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const siteId = await getCurrentSiteId();

            let query = supabase
                .from('log_clinical_records')
                .select('patient_link_code, session_date, session_type, session_number, ref_substances(substance_name)')
                .order('session_date', { ascending: false });

            if (siteId) {
                query = query.eq('site_id', siteId);
            }

            const { data, error: qErr } = await query;
            if (qErr) throw qErr;

            // Group by patient_link_code client-side
            const grouped: Record<string, { sessions: typeof data }> = {};
            for (const row of (data ?? [])) {
                const pid = row.patient_link_code;
                if (!pid) continue;
                if (!grouped[pid]) grouped[pid] = { sessions: [] };
                grouped[pid].sessions.push(row);
            }

            const result: LivePatient[] = Object.entries(grouped).map(([pid, { sessions }]) => {
                const sorted = [...sessions].sort((a, b) =>
                    (b.session_date ?? '').localeCompare(a.session_date ?? '')
                );
                const latest = sorted[0];
                const latestAny = latest as any;
                const substanceData = latestAny?.ref_substances;
                const substanceName = Array.isArray(substanceData) ? substanceData[0]?.substance_name : substanceData?.substance_name;

                return {
                    id: pid,
                    lastSession: latest?.session_date ?? 'Unknown',
                    phase: derivePhase(latest?.session_type ?? null),
                    sessionCount: sessions.length,
                    sessionType: latest?.session_type ?? '',
                    substance: substanceName ?? undefined,
                };
            });

            setPatients(result);
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Failed to load patients';
            setError(msg);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (view === 'existing') fetchPatients();
    }, [view, fetchPatients]);

    const filtered = useMemo(() => {
        let list = [...patients];
        if (search.trim()) {
            list = list.filter(p => p.id.toLowerCase().includes(search.toLowerCase()));
        }
        if (phaseFilter) {
            list = list.filter(p => p.phase === phaseFilter);
        }
        list.sort((a, b) => {
            const cmp = a.lastSession.localeCompare(b.lastSession);
            return sortDir === 'desc' ? -cmp : cmp;
        });
        return list;
    }, [patients, search, phaseFilter, sortDir]);

    const togglePhase = (p: Phase) => setPhaseFilter(prev => (prev === p ? null : p));
    const toggleSort = () => setSortDir(prev => (prev === 'desc' ? 'asc' : 'desc'));
    const activeFiltersCount = phaseFilter ? 1 : 0;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#060d1a]/90 backdrop-blur-md">
            <div className="w-full max-w-2xl mx-4">

                {/* ── Choose View ───────────────────────────────────────────── */}
                {view === 'choose' && (
                    <div className="bg-slate-900 border border-slate-700/60 rounded-2xl overflow-hidden shadow-2xl shadow-black/60">
                        <div className="px-8 pt-8 pb-6 border-b border-slate-800 relative">
                            {onClose && (
                                <button
                                    type="button"
                                    onClick={onClose}
                                    aria-label="Close patient selection"
                                    className="absolute top-0 right-0 p-2 m-3 rounded-lg text-slate-500 hover:text-[#A8B5D1] hover:bg-slate-800 transition-all"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            )}
                            <h2 className="text-2xl font-black text-white">Start a Wellness Session</h2>
                            <p className="text-slate-400 text-sm mt-1">Select a patient before accessing any clinical forms.</p>
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
                                    <p className="text-sm text-slate-400 mt-0.5">Assign a new anonymous ID and begin Phase 1</p>
                                    <p className="text-xs text-indigo-400 font-mono mt-2 tracking-wide">→ {newId}</p>
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
                                    <p className="text-sm text-slate-400 mt-0.5">Look up a patient by ID and continue their journey</p>
                                </div>
                                <ChevronRight className="w-5 h-5 text-slate-500 group-hover:translate-x-1 transition-transform" />
                            </button>

                            {/* Patient Bridge Camera Scan - Collapsible */}
                            <div className="border border-teal-500/30 rounded-xl overflow-hidden mt-4 transition-all">
                                <button
                                    onClick={() => setScannerOpen(!scannerOpen)}
                                    className="w-full flex items-center justify-between p-4 bg-teal-900/20 hover:bg-teal-900/40 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <Camera className="w-5 h-5 text-teal-400" />
                                        <span className="text-base font-bold text-white">Scan Patient Label</span>
                                    </div>
                                    <ChevronRight className={`w-5 h-5 text-teal-500 transition-transform ${scannerOpen ? 'rotate-90' : ''}`} />
                                </button>

                                {scannerOpen && (
                                    <div className="bg-gradient-to-br from-teal-900/40 to-emerald-900/20 border-t border-teal-500/30 p-5">
                                        <a
                                            href="/PPN_Bridge_Camera.html"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full flex items-start gap-5 active:scale-[0.99] text-left group"
                                            aria-label="Open camera scanner to generate patient ID (opens in new tab)"
                                        >
                                            <div className="w-12 h-12 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center flex-shrink-0 mt-1">
                                                <Camera className="w-6 h-6 text-teal-400 group-hover:scale-110 transition-transform" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-lg font-black text-white flex items-center gap-2">
                                                    Open Scanner
                                                </p>
                                                <p className="text-sm text-slate-300 mt-0.5">Point camera at wristband or chart to generate ID</p>
                                                <div className="mt-3 inline-flex items-center gap-1.5 px-2 py-1 rounded bg-black/40 border border-teal-500/30 text-[11px] text-teal-400 font-medium tracking-wide">
                                                    <Lock className="w-3 h-3" /> No data leaves your device
                                                </div>
                                            </div>
                                            <ChevronRight className="w-5 h-5 text-teal-500 group-hover:translate-x-1 transition-transform self-center" />
                                        </a>

                                        {/* QR Code Entry Point */}
                                        <div className="mt-5 pt-4 border-t border-teal-500/20 flex flex-col md:flex-row items-center gap-4">
                                            <div className="bg-white p-1.5 rounded-lg flex-shrink-0">
                                                <img
                                                    src={`https://chart.googleapis.com/chart?cht=qr&chs=120x120&chl=${encodeURIComponent(window.location.origin + '/PPN_Bridge_Camera.html')}`}
                                                    alt="QR code to open Patient Bridge on mobile"
                                                    className="w-20 h-20"
                                                />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-[#A8B5D1]">Or use your phone</p>
                                                <p className="text-xs text-slate-400 mt-1">Scan this QR code with a mobile device to use the Bridge scanner remotely.</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="px-6 pb-5 text-center leading-relaxed">
                            <p className="text-sm text-slate-400 font-medium tracking-wide">
                                All patient data is strictly anonymized via <a href="/privacy" className="text-indigo-400 hover:text-indigo-300 hover:underline font-bold transition-colors">Phantom Shield</a>.<br />
                                No <span className="text-white font-bold">PHI</span> is ever stored or accessible.
                            </p>
                        </div>
                    </div>
                )}

                {/* ── Existing Patient View ─────────────────────────────────── */}
                {view === 'existing' && (
                    <div className="bg-slate-900 border border-slate-700/60 rounded-2xl overflow-hidden shadow-2xl shadow-black/60">
                        {/* Header */}
                        <div className="px-6 pt-6 pb-4 border-b border-slate-800 relative">
                            {onClose && (
                                <button
                                    type="button"
                                    onClick={onClose}
                                    aria-label="Close patient selection"
                                    className="absolute top-0 right-0 p-2 m-3 rounded-lg text-slate-500 hover:text-[#A8B5D1] hover:bg-slate-800 transition-all"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            )}
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
                                        {loading ? 'Loading…' : `${filtered.length} of ${patients.length} patients`}
                                        {activeFiltersCount > 0 && (
                                            <span className="text-indigo-400 ml-1">· {activeFiltersCount} filter active</span>
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Search + Filters */}
                        <div className="px-6 pt-4 space-y-3">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                {/* UI-ONLY: client-side patient ID filter — search term is never persisted to Supabase */}
                                <input
                                    type="text"
                                    placeholder="Search patient ID…"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    autoFocus
                                    className="w-full pl-10 pr-4 py-3 bg-slate-800/60 border border-slate-700/50 focus:border-indigo-500/60 rounded-xl text-[#A8B5D1] placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
                                />
                            </div>

                            <div className="flex items-center gap-2 flex-wrap pb-1">
                                <span className="text-xs text-slate-500 font-medium">Phase:</span>
                                {ALL_PHASES.map(p => (
                                    <FilterChip key={p} label={p} active={phaseFilter === p} onClick={() => togglePhase(p)} />
                                ))}
                                <button
                                    type="button"
                                    onClick={toggleSort}
                                    className="ml-auto flex items-center gap-1.5 px-3 py-2 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 hover:border-slate-600 rounded-lg text-xs font-semibold text-slate-400 hover:text-[#A8B5D1] transition-all"
                                    title={sortDir === 'desc' ? 'Newest first' : 'Oldest first'}
                                >
                                    {sortDir === 'desc' ? <ArrowDown className="w-3.5 h-3.5" /> : <ArrowUp className="w-3.5 h-3.5" />}
                                    Date
                                </button>
                            </div>
                        </div>

                        {/* Patient List */}
                        <div className="px-6 py-3 space-y-2 max-h-96 overflow-y-auto custom-scrollbar">
                            {/* Loading */}
                            {loading && (
                                <div className="flex items-center justify-center py-10 gap-3 text-slate-400">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span className="text-sm">Loading patients…</span>
                                </div>
                            )}

                            {/* Error */}
                            {!loading && error && (
                                <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                    <span>{error}</span>
                                    <button onClick={fetchPatients} className="ml-auto text-xs underline hover:no-underline">Retry</button>
                                </div>
                            )}

                            {/* Empty state */}
                            {!loading && !error && filtered.length === 0 && (
                                <p className="text-center text-slate-500 text-sm py-8">
                                    {patients.length === 0 ? 'No patients found for this site' : 'No patients match these filters'}
                                </p>
                            )}

                            {/* Patient rows */}
                            {!loading && !error && filtered.map(patient => (
                                <button
                                    key={patient.id}
                                    onClick={() => onSelect(patient.id, false, patient.phase)}
                                    className="w-full flex flex-col sm:flex-row sm:items-center justify-between px-4 py-3.5 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-slate-600 rounded-xl transition-all active:scale-[0.99] text-left group gap-3 sm:gap-4"
                                >
                                    <div className="min-w-0 w-full sm:w-auto">
                                        <div className="flex justify-between items-start w-full">
                                            <p className="text-base font-bold text-white font-mono tracking-wide truncate">{patient.id}</p>
                                            <span className={`sm:hidden text-xs font-semibold px-2 py-0.5 rounded border whitespace-nowrap ml-2 shrink-0 ${PHASE_COLORS[patient.phase]}`}>
                                                {patient.phase}
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-2 text-xs sm:text-sm text-slate-400">
                                            <span className="flex items-center gap-1.5 whitespace-nowrap">
                                                <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                                                {patient.lastSession}
                                            </span>
                                            <span className="text-slate-600 hidden sm:inline">·</span>
                                            <span className="flex items-center gap-1.5 whitespace-nowrap">
                                                <Activity className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                                                {patient.sessionCount} session{patient.sessionCount !== 1 ? 's' : ''}
                                            </span>
                                            {patient.sessionType && (
                                                <>
                                                    <span className="text-slate-600 hidden sm:inline">·</span>
                                                    <span className="px-1.5 py-0.5 rounded-md bg-slate-700/60 border border-slate-600/40 text-[10px] sm:text-xs truncate max-w-[120px] inline-block align-middle">
                                                        {patient.sessionType}
                                                    </span>
                                                </>
                                            )}
                                            {patient.substance && (
                                                <>
                                                    <span className="text-slate-600 hidden sm:inline">·</span>
                                                    <span className="text-[10px] sm:text-xs text-indigo-300 font-semibold px-1.5 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 truncate max-w-[120px] inline-block align-middle">
                                                        {patient.substance}
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <div className="hidden sm:flex items-center gap-3 shrink-0">
                                        <span className={`text-sm font-semibold px-2.5 py-1 rounded-lg border whitespace-nowrap ${PHASE_COLORS[patient.phase]}`}>
                                            {patient.phase}
                                        </span>
                                        <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 group-hover:translate-x-0.5 transition-all" />
                                    </div>
                                </button>
                            ))}
                        </div>

                        <div className="px-6 pb-5 pt-3 text-center border-t border-slate-800/50">
                            <p className="text-xs text-slate-500 mb-2">
                                {loading ? 'Fetching from database…' : `${patients.length} patient${patients.length !== 1 ? 's' : ''} on record · Live data`}
                            </p>
                            <p className="text-xs text-slate-500 flex items-center justify-center gap-1.5 font-medium">
                                <Lock className="w-3 h-3 text-indigo-400/70" /> Secured and anonymized by <a href="/privacy" className="text-indigo-400 hover:text-indigo-300 hover:underline transition-colors" target="_blank" rel="noopener noreferrer">Phantom Shield</a>
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PatientSelectModal;
