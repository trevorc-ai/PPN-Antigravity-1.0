/**
 * PatientListPage.tsx — WO-677
 *
 * Standalone full-page view of the practitioner's patient panel.
 * Includes "Download Practice Export" (.xlsx) and "Refresh CSV" buttons.
 *
 * Data: same log_clinical_records query used in PatientSelectModal,
 * extracted here for independent rendering outside the modal context.
 *
 * Zero PHI: all patient identifiers are de-identified Subject IDs.
 * No name, phone, email, or DOB is ever stored or displayed.
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Search,
    ArrowUp,
    ArrowDown,
    Activity,
    Clock,
    FlaskConical,
    Lock,
    AlertCircle,
    Loader2,
    CheckCircle,
} from 'lucide-react';
import { supabase } from '../supabaseClient';
import { getCurrentSiteId } from '../services/identity';
import { PracticeExportButton } from '../components/patients/PracticeExportButton';
import { fromLivePatients, type LivePatientShape } from '../utils/practiceExportBuilder';

// ── Types ─────────────────────────────────────────────────────────────────────

type Phase = 'Preparation' | 'Treatment' | 'Integration' | 'Complete';

const PHASE_COLORS: Record<Phase, string> = {
    Preparation: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    Treatment: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    Integration: 'text-teal-400 bg-teal-500/10 border-teal-500/20',
    Complete: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
};

const PHASE_ICONS: Record<Phase, React.ReactNode> = {
    Preparation: <Clock className="w-3 h-3" />,
    Treatment: <FlaskConical className="w-3 h-3" />,
    Integration: <Activity className="w-3 h-3" />,
    Complete: <CheckCircle className="w-3 h-3" />,
};

const SESSION_TYPE_LABELS: Record<number, string> = {
    1: 'Preparation',
    2: 'Treatment',
    3: 'Integration',
};

function derivePhase(
    sessionTypeId: number | null,
    sessionEndedAt: string | null,
    isSubmitted: boolean,
): Phase {
    if (isSubmitted) return 'Complete';
    if (sessionEndedAt) return 'Integration';
    if (sessionTypeId === 2) return 'Treatment';
    return 'Preparation';
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function PatientListPage() {
    const navigate = useNavigate();

    const [patients, setPatients] = useState<LivePatientShape[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [sortDir, setSortDir] = useState<'desc' | 'asc'>('desc');
    const [phaseFilter, setPhaseFilter] = useState<Phase | null>(null);

    const fetchPatients = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const siteId = await getCurrentSiteId();
            const { data: { session: authSession } } = await supabase.auth.getSession();
            const practitionerId = authSession?.user?.id ?? null;

            let query = supabase
                .from('log_clinical_records')
                .select('id, patient_link_code_hash, session_date, session_type_id, session_number, session_ended_at, is_submitted, ref_substances(substance_name)')
                .order('session_date', { ascending: false });

            if (siteId) {
                query = query.eq('site_id', siteId);
            } else if (practitionerId) {
                query = query.eq('practitioner_id', practitionerId);
            }

            const { data, error: qErr } = await query;
            if (qErr) throw qErr;

            // Group by patient_link_code_hash (same logic as PatientSelectModal)
            const grouped: Record<string, { sessions: typeof data }> = {};
            for (const row of (data ?? [])) {
                const pid = (row as unknown as { patient_link_code_hash?: string }).patient_link_code_hash || (row as unknown as { id: string }).id;
                if (!pid) continue;
                if (!grouped[pid]) grouped[pid] = { sessions: [] };
                grouped[pid].sessions.push(row);
            }

            const result: LivePatientShape[] = Object.entries(grouped).map(([pid, { sessions }]) => {
                const sorted = [...sessions].sort((a, b) =>
                    ((b as unknown as { session_date?: string }).session_date ?? '').localeCompare(
                        (a as unknown as { session_date?: string }).session_date ?? ''
                    )
                );
                const latest = sorted[0] as unknown as Record<string, unknown>;
                const substanceData = latest?.ref_substances;
                const substanceName = Array.isArray(substanceData)
                    ? (substanceData[0] as Record<string, string>)?.substance_name
                    : (substanceData as Record<string, string> | null)?.substance_name;
                const sessionTypeStr = latest?.session_type_id
                    ? SESSION_TYPE_LABELS[latest.session_type_id as number]
                    : '';

                return {
                    id: pid,
                    phase: derivePhase(
                        (latest?.session_type_id as number | null) ?? null,
                        (latest?.session_ended_at as string | null) ?? null,
                        !!(latest?.is_submitted),
                    ),
                    substance: substanceName ?? undefined,
                    sessionCount: sessions.length,
                    lastSession: (latest?.session_date as string) ?? 'Unknown',
                    sessionType: sessionTypeStr,
                };
            });

            setPatients(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load patients');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchPatients(); }, [fetchPatients]);

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

    const exportRows = useMemo(() => fromLivePatients(filtered), [filtered]);
    const ALL_PHASES: Phase[] = ['Preparation', 'Treatment', 'Integration', 'Complete'];

    return (
        <div className="min-h-screen bg-[#020408] flex flex-col">

            {/* ── Header ─────────────────────────────────────────────────── */}
            <header className="sticky top-0 z-20 bg-[#020408]/95 backdrop-blur-lg border-b border-slate-800/60 px-6 py-4">
                <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate(-1)}
                            aria-label="Go back"
                            className="flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white border border-slate-700/50 hover:border-slate-600 bg-slate-800/40 hover:bg-slate-700/40 px-3 py-2 rounded-xl transition-all"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back
                        </button>
                        <div>
                            <h1 className="ppn-section-title text-white leading-tight">Patient Panel</h1>
                            <p className="ppn-meta text-slate-500 flex items-center gap-1.5 mt-0.5">
                                <Lock className="w-3 h-3 text-indigo-400/70" />
                                Secured and anonymized by Phantom Shield
                            </p>
                        </div>
                    </div>

                    {/* Export buttons */}
                    <PracticeExportButton patients={exportRows} disabled={loading} />
                </div>
            </header>

            {/* ── Search + Filters ────────────────────────────────────────── */}
            <div className="max-w-5xl mx-auto w-full px-6 pt-6 pb-3 space-y-3">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                        id="patient-list-search"
                        type="text"
                        placeholder="Search patient ID..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-slate-800/60 border border-slate-700/50 focus:border-indigo-500/60 rounded-xl text-[#A8B5D1] placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
                    />
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                    <span className="ppn-label text-slate-400 normal-case font-medium">Phase:</span>
                    {ALL_PHASES.map(p => (
                        <button
                            key={p}
                            type="button"
                            onClick={() => setPhaseFilter(prev => prev === p ? null : p)}
                            className={`min-h-[44px] sm:min-h-0 px-3 py-1.5 rounded-lg text-sm font-semibold border transition-all ${
                                phaseFilter === p
                                    ? 'bg-indigo-600 text-white border-indigo-500'
                                    : 'bg-slate-800/60 text-slate-400 border-slate-700/50 hover:border-slate-500 hover:text-[#A8B5D1]'
                            }`}
                        >
                            {p}
                        </button>
                    ))}
                    <button
                        type="button"
                        onClick={() => setSortDir(prev => prev === 'desc' ? 'asc' : 'desc')}
                        aria-label={sortDir === 'desc' ? 'Sort oldest first' : 'Sort newest first'}
                        className="ml-auto flex items-center gap-1.5 px-3 py-2 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 hover:border-slate-600 rounded-lg text-sm font-semibold text-slate-400 hover:text-[#A8B5D1] transition-all"
                    >
                        {sortDir === 'desc' ? <ArrowDown className="w-3.5 h-3.5" /> : <ArrowUp className="w-3.5 h-3.5" />}
                        Date
                    </button>
                </div>

                {/* Result count */}
                <p className="ppn-meta text-slate-500">
                    {loading ? 'Loading…' : `${filtered.length} of ${patients.length} patients`}
                    {phaseFilter && <span className="text-indigo-400 ml-1">· filter active</span>}
                </p>
            </div>

            {/* ── Patient Table ───────────────────────────────────────────── */}
            <main className="max-w-5xl mx-auto w-full px-6 pb-10 flex-1">

                {/* Loading */}
                {loading && (
                    <div className="flex items-center justify-center py-20 gap-3 text-slate-400">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span className="ppn-body">Loading patient panel...</span>
                    </div>
                )}

                {/* Error */}
                {!loading && error && (
                    <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <span className="ppn-body text-red-400">{error}</span>
                        <button
                            onClick={fetchPatients}
                            className="ml-auto text-sm underline hover:no-underline"
                        >
                            Retry
                        </button>
                    </div>
                )}

                {/* Empty */}
                {!loading && !error && filtered.length === 0 && (
                    <p className="text-center ppn-body text-slate-500 py-16">
                        {patients.length === 0 ? 'No patients found for this site.' : 'No patients match these filters.'}
                    </p>
                )}

                {/* Table */}
                {!loading && !error && filtered.length > 0 && (
                    <div className="overflow-x-auto rounded-2xl border border-slate-700/50 mt-2">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-900/80 border-b border-slate-700/50">
                                    <th className="ppn-label normal-case font-semibold text-slate-400 px-4 py-3">Subject ID</th>
                                    <th className="ppn-label normal-case font-semibold text-slate-400 px-4 py-3 hidden sm:table-cell">Phase</th>
                                    <th className="ppn-label normal-case font-semibold text-slate-400 px-4 py-3 hidden md:table-cell">Substance</th>
                                    <th className="ppn-label normal-case font-semibold text-slate-400 px-4 py-3 text-right">Sessions</th>
                                    <th className="ppn-label normal-case font-semibold text-slate-400 px-4 py-3 hidden lg:table-cell">Last Session</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((patient, idx) => (
                                    <tr
                                        key={patient.id}
                                        className={`border-b border-slate-800/50 transition-colors hover:bg-slate-800/30 ${
                                            idx % 2 === 0 ? 'bg-slate-900/30' : 'bg-slate-900/10'
                                        }`}
                                    >
                                        {/* Subject ID */}
                                        <td className="px-4 py-3">
                                            <p className="ppn-body font-mono text-white font-bold tracking-wide">
                                                {patient.id.length >= 32
                                                    ? `SID-${patient.id.substring(0, 8).toUpperCase()}`
                                                    : patient.id}
                                            </p>
                                            {/* Phase visible on mobile only */}
                                            <span className={`sm:hidden inline-flex items-center gap-1 ppn-meta px-1.5 py-0.5 rounded border mt-1 ${PHASE_COLORS[patient.phase as Phase]}`}>
                                                {PHASE_ICONS[patient.phase as Phase]}
                                                {patient.phase}
                                            </span>
                                        </td>

                                        {/* Phase — sm+ */}
                                        <td className="px-4 py-3 hidden sm:table-cell">
                                            <span className={`inline-flex items-center gap-1.5 ppn-meta font-semibold px-2 py-0.5 rounded border ${PHASE_COLORS[patient.phase as Phase]}`}>
                                                {PHASE_ICONS[patient.phase as Phase]}
                                                {patient.phase}
                                            </span>
                                        </td>

                                        {/* Substance — md+ */}
                                        <td className="px-4 py-3 hidden md:table-cell">
                                            {patient.substance ? (
                                                <span className="ppn-meta text-indigo-300 font-semibold px-1.5 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20">
                                                    {patient.substance}
                                                </span>
                                            ) : (
                                                <span className="ppn-meta text-slate-600">—</span>
                                            )}
                                        </td>

                                        {/* Sessions */}
                                        <td className="px-4 py-3 text-right">
                                            <span className="ppn-body text-slate-300 font-semibold tabular-nums">
                                                {patient.sessionCount}
                                            </span>
                                        </td>

                                        {/* Last Session — lg+ */}
                                        <td className="px-4 py-3 hidden lg:table-cell">
                                            <span className="ppn-meta text-slate-400 font-mono">
                                                {patient.lastSession}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </div>
    );
}
