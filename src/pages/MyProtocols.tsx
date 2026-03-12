import { useDataCache } from '../hooks/useDataCache';
import { supabase } from '../supabaseClient';
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Search, ChevronRight, ClipboardList, ChevronUp, ChevronDown } from 'lucide-react';

const SESSION_TYPE_LABELS: Record<number, string> = {
    1: 'Preparation',
    2: 'Dosing',
    3: 'Integration',
};

// ─── Substance color palette ──────────────────────────────────────────────────
const SUBSTANCE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
    'Psilocybin':  { bg: 'rgba(139,92,246,0.12)', text: '#a78bfa', border: 'rgba(139,92,246,0.35)' },
    'MDMA':        { bg: 'rgba(244,63,94,0.12)',  text: '#fb7185', border: 'rgba(244,63,94,0.35)' },
    'Ketamine':    { bg: 'rgba(6,182,212,0.12)',   text: '#22d3ee', border: 'rgba(6,182,212,0.35)' },
    'Ibogaine':    { bg: 'rgba(245,158,11,0.12)',  text: '#fbbf24', border: 'rgba(245,158,11,0.35)' },
    'LSD':         { bg: 'rgba(99,102,241,0.12)',  text: '#818cf8', border: 'rgba(99,102,241,0.35)' },
    'Mescaline':   { bg: 'rgba(16,185,129,0.12)',  text: '#34d399', border: 'rgba(16,185,129,0.35)' },
    'Cannabis':    { bg: 'rgba(132,204,22,0.12)',  text: '#a3e635', border: 'rgba(132,204,22,0.35)' },
    'Ayahuasca':   { bg: 'rgba(217,119,6,0.12)',   text: '#f59e0b', border: 'rgba(217,119,6,0.35)' },
    '5-MeO-DMT':   { bg: 'rgba(236,72,153,0.12)',  text: '#f472b6', border: 'rgba(236,72,153,0.35)' },
};
const DEFAULT_SUBSTANCE_COLOR = { bg: 'rgba(100,116,139,0.12)', text: '#94a3b8', border: 'rgba(100,116,139,0.35)' };

// ─── Types ────────────────────────────────────────────────────────────────────

interface Protocol {
    id: string;
    patient_ref: string;        // patient_link_code (PT-XXXXXXXXXX)
    substance_name: string;
    session_date: string;
    submitted_at: string | null;
    session_type_id: number | null;
    status: string;
    // New columns
    indication_name: string;    // Treatment
    sex_label: string;          // Gender
    patient_age: string;        // Age
    smoking_status: string;     // Smoking
    weight_label: string;       // Weight
}

type SortField =
    | 'patient_ref'
    | 'substance_name'
    | 'session_date'
    | 'status'
    | 'indication_name'
    | 'sex_label'
    | 'patient_age'
    | 'smoking_status'
    | 'weight_label';

type SortDirection = 'asc' | 'desc';

// ─── Ref lookup helpers ───────────────────────────────────────────────────────

function buildMap<T extends Record<string, any>>(
    rows: T[] | null,
    idKey: string,
    labelKey: string,
): Record<number, string> {
    const map: Record<number, string> = {};
    for (const row of rows ?? []) map[row[idKey]] = row[labelKey];
    return map;
}

// ─── Component ───────────────────────────────────────────────────────────────

export const MyProtocols = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [sortField, setSortField] = useState<SortField>('session_date');
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

    const { data: cachedProtocols, loading, refetch, lastFetchedAt } = useDataCache(
        'my-protocols',
        async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return { data: [], error: null };

                // WO-592: Resolve site_id first — query scoped to practitioner's clinic
                const { data: userSite } = await supabase
                    .from('log_user_sites')
                    .select('site_id')
                    .eq('user_id', user.id)
                    .maybeSingle();

                if (!userSite) return { data: [], error: null };
                const siteId = userSite.site_id;

                // Step 1: Parallel fetch — sessions (scoped to this site) + ref tables
                const [
                    sessionResult,
                    substanceResult,
                    indicationResult,
                    sexResult,
                    weightResult,
                    smokingResult,
                ] = await Promise.all([
                    supabase
                        .from('log_clinical_records')
                        .select(`
                            id,
                            patient_uuid,
                            session_date,
                            session_type_id,
                            session_status,
                            substance_id,
                            is_submitted,
                            session_ended_at,
                            created_at
                        `)
                        .eq('site_id', siteId)
                        .neq('session_status', 'draft')
                        .order('created_at', { ascending: false })
                        .limit(100),
                    supabase.from('ref_substances').select('substance_id, substance_name'),
                    supabase.from('ref_indications').select('indication_id, indication_name'),
                    supabase.from('ref_sex').select('sex_id, sex_label'),
                    supabase.from('ref_weight_ranges').select('id, range_label'),
                    supabase.from('ref_smoking_status').select('smoking_status_id, status_name'),
                ]);

                if (sessionResult.error) throw sessionResult.error;

                // Step 2: Fetch indications + patient profiles for all patients in this result set
                // indication_id lives in log_patient_indications, demographics in log_patient_profiles
                const patientUuids = [
                    ...new Set((sessionResult.data ?? []).map((r: any) => r.patient_uuid).filter(Boolean))
                ];

                const [{ data: indicationsRaw }, { data: profilesRaw }, { data: linkCodesRaw }] = await Promise.all([
                    patientUuids.length > 0
                        ? supabase
                            .from('log_patient_indications')
                            .select('patient_uuid, indication_id, is_primary')
                            .in('patient_uuid', patientUuids)
                        : Promise.resolve({ data: [] }),
                    patientUuids.length > 0
                        ? supabase
                            .from('log_patient_profiles')
                            .select('patient_uuid, sex_id, age_at_intake, weight_range_id, smoking_status_id')
                            .in('patient_uuid', patientUuids)
                        : Promise.resolve({ data: [] }),
                    patientUuids.length > 0
                        ? supabase
                            .from('log_patient_site_links')
                            .select('patient_uuid, patient_link_code')
                            .in('patient_uuid', patientUuids)
                        : Promise.resolve({ data: [] }),
                ]);

                // Build patient → link code map (for PT-XXXXXXXXXX display)
                const linkCodeMap = new Map<string, string>();
                for (const l of (linkCodesRaw || []) as any[]) {
                    if (l.patient_link_code) linkCodeMap.set(l.patient_uuid, l.patient_link_code);
                }

                // Build patient → demographics map (from log_patient_profiles)
                const profileMap = new Map<string, any>();
                for (const p of (profilesRaw || []) as any[]) {
                    profileMap.set(p.patient_uuid, p);
                }

                // Build patient → primary indication_id map
                const patientIndicationMap = new Map<string, number>();
                for (const ind of (indicationsRaw || []) as any[]) {
                    const existing = patientIndicationMap.get(ind.patient_uuid);
                    if (!existing || ind.is_primary) {
                        patientIndicationMap.set(ind.patient_uuid, ind.indication_id);
                    }
                }

                // Step 3: Build client-side lookup maps from ref tables
                const substanceMap = buildMap(substanceResult.data, 'substance_id', 'substance_name');
                const indicationMap = buildMap(indicationResult.data, 'indication_id', 'indication_name');
                // FIX: ref_sex uses 'sex_id' as PK, not 'id'
                const sexMap = buildMap(sexResult.data, 'sex_id', 'sex_label');
                const weightMap = buildMap(weightResult.data, 'id', 'range_label');
                const smokingMap = buildMap(smokingResult.data, 'smoking_status_id', 'status_name');

                const formattedData: Protocol[] = (sessionResult.data ?? []).map((record: any) => {
                    const indicationId = patientIndicationMap.get(record.patient_uuid) ?? null;
                    const profile = profileMap.get(record.patient_uuid);
                    const linkCode = linkCodeMap.get(record.patient_uuid);

                    // Derive status: prefer submitted > integration > session_type_id > active
                    let derivedStatus: string;
                    if (record.is_submitted) {
                        derivedStatus = 'Completed';
                    } else if (record.session_ended_at) {
                        derivedStatus = 'Integration';
                    } else if (record.session_type_id === 2) {
                        derivedStatus = 'Dosing';
                    } else if (record.session_type_id === 1) {
                        derivedStatus = 'Preparation';
                    } else if (record.session_type_id === 3) {
                        derivedStatus = 'Integration';
                    } else {
                        derivedStatus = 'Active';
                    }

                    return {
                        id: record.id,
                        patient_ref: linkCode ?? `SID-${record.id.substring(0, 8).toUpperCase()}`,
                        substance_name: substanceMap[record.substance_id] ?? (record.substance_id ? `Substance #${record.substance_id}` : '—'),
                        session_date: record.session_date || '—',
                        submitted_at: record.created_at ?? null,
                        session_type_id: record.session_type_id ?? null,
                        status: derivedStatus,
                        indication_name: indicationId ? (indicationMap[indicationId] ?? '—') : '—',
                        sex_label: profile?.sex_id ? (sexMap[profile.sex_id] ?? '—') : '—',
                        patient_age: profile?.age_at_intake != null ? `${profile.age_at_intake}` : '—',
                        smoking_status: profile?.smoking_status_id ? (smokingMap[profile.smoking_status_id] ?? '—') : '—',
                        weight_label: profile?.weight_range_id ? (weightMap[profile.weight_range_id] ?? '—') : '—',
                    };
                });

                return { data: formattedData, error: null };
            } catch (error) {
                console.error('Error fetching protocols:', error);
                return { data: null, error };
            }
        }
    );

    const protocols = cachedProtocols || [];

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const filteredProtocols = useMemo(() => {
        const q = searchQuery.toLowerCase();
        const filtered = protocols.filter(p =>
            p.patient_ref.toLowerCase().includes(q) ||
            p.substance_name.toLowerCase().includes(q) ||
            p.session_date.toLowerCase().includes(q) ||
            p.indication_name.toLowerCase().includes(q) ||
            p.sex_label.toLowerCase().includes(q) ||
            p.patient_age.toLowerCase().includes(q)
        );

        return filtered.sort((a, b) => {
            const aVal = a[sortField] ?? '';
            const bVal = b[sortField] ?? '';
            if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });
    }, [protocols, searchQuery, sortField, sortDirection]);

    // ─── Sortable column header ────────────────────────────────────────────────

    const SortableHeader: React.FC<{ field: SortField; label: string; className?: string }> = ({ field, label, className = '' }) => (
        <th
            className={`px-4 py-5 cursor-pointer hover:text-primary transition-colors select-none whitespace-nowrap ${className}`}
            onClick={() => handleSort(field)}
        >
            <div className="flex items-center gap-1.5">
                <span className="text-xs font-black uppercase tracking-[0.15em]">{label}</span>
                {sortField === field && (
                    sortDirection === 'asc'
                        ? <ChevronUp className="w-3 h-3 flex-shrink-0" />
                        : <ChevronDown className="w-3 h-3 flex-shrink-0" />
                )}
            </div>
        </th>
    );

    // ─── Cell component for consistent styling ─────────────────────────────────

    const Cell: React.FC<{ value: string; mono?: boolean; dim?: boolean }> = ({ value, mono, dim }) => (
        <td className="px-4 py-5">
            <span
                className={`text-sm font-bold ${mono ? 'font-mono text-xs tracking-tight' : ''}`}
                style={{ color: dim || value === '—' ? '#4B5563' : '#8B9DC3' }}
            >
                {value}
            </span>
        </td>
    );

    // ─── Smoking abbreviation (saves column width) ─────────────────────────────
    const abbreviateSmoking = (s: string) => {
        if (s === '—') return '—';
        if (s.startsWith('Non')) return 'Non-Smoker';
        if (s.startsWith('Former')) return 'Former';
        if (s.includes('Occasional')) return 'Occasional';
        if (s.includes('Daily')) return 'Daily';
        return s;
    };

    // ─── Weight abbreviation ───────────────────────────────────────────────────
    const abbreviateWeight = (w: string) => {
        // "60-65 kg (132-143 lbs)" → "60-65 kg"
        if (w === '—') return '—';
        const match = w.match(/^[\d<> -]+\s*kg/);
        return match ? match[0].trim() : w;
    };

    return (
        <div className="min-h-full p-6 sm:p-10 space-y-10 animate-in fade-in duration-700 max-w-[1800px] mx-auto pb-24">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="space-y-1">
                    <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tighter" style={{ color: '#8BA5D3' }}>My Protocols</h1>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={refetch}
                        disabled={loading}
                        title={lastFetchedAt ? `Last updated: ${lastFetchedAt.toLocaleTimeString()}` : 'Not loaded'}
                        className="min-h-[44px] px-3 flex items-center gap-1.5 rounded-lg border border-blue-500/20 bg-transparent text-xs font-bold text-slate-500 hover:bg-slate-800/50 active:scale-95 transition-all"
                    >
                        {loading ? '...' : '↻ Refresh'}
                    </button>
                    <button
                        onClick={() => navigate('/wellness-journey')}
                        className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black rounded-2xl uppercase tracking-[0.2em] transition-all shadow-xl shadow-primary/20 active:scale-95 flex items-center gap-3"
                    >
                        <PlusCircle size={18} />
                        Create New Protocol
                    </button>
                </div>
            </div>

            <div className="space-y-6">
                {/* Search */}
                <div className="relative group w-full max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Search protocols, substances, treatments..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full min-h-[44px] h-12 bg-[#0f172a] border border-slate-700 rounded-xl pl-12 pr-6 text-sm font-bold placeholder:text-slate-600 focus:outline-none focus:border-primary transition-all"
                        style={{ color: '#8B9DC3' }}
                    />
                </div>

                {/* Table */}
                <div className="bg-slate-900/40 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-xl">

                    {/* ── Mobile card list (< md) ── additive, does not touch desktop table */}
                    {!loading && (
                        <div className="md:hidden divide-y divide-slate-800/30">
                            {filteredProtocols.length === 0 ? (
                                <div className="py-20 text-center space-y-4">
                                    <ClipboardList className="mx-auto text-slate-800" size={48} />
                                    <p className="text-slate-600 font-black uppercase tracking-widest text-sm">Zero Protocol Matches Found</p>
                                </div>
                            ) : filteredProtocols.map((p) => (
                                <button
                                    key={`mobile-${p.id}`}
                                    onClick={() => navigate(`/protocol/${p.id}`)}
                                    className="w-full text-left px-5 py-4 min-h-[72px] flex items-center justify-between gap-4 hover:bg-primary/5 active:bg-primary/10 active:scale-[0.99] transition-all"
                                >
                                    <div className="flex-1 min-w-0 space-y-1">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="text-sm font-black font-mono uppercase tracking-tight" style={{ color: '#9DAEC8' }}>
                                                {p.patient_ref}
                                            </span>
                                            <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${p.status === 'Integration' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-indigo-500/10 text-indigo-400'}`}>
                                                {p.status}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-slate-500 font-bold flex-wrap">
                                            <span>{p.substance_name !== '—' ? p.substance_name : ''}</span>
                                            {p.indication_name !== '—' && <span className="text-slate-700">·</span>}
                                            {p.indication_name !== '—' && <span className="truncate max-w-[160px]">{p.indication_name}</span>}
                                            <span className="text-slate-700">·</span>
                                            <span className="font-mono">{p.session_date}</span>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-slate-600 flex-shrink-0" />
                                </button>
                            ))}
                        </div>
                    )}
                    {loading ? (
                        <div className="py-20 text-center">
                            <p className="font-black uppercase tracking-widest text-sm" style={{ color: '#8B9DC3' }}>Loading protocols...</p>
                        </div>
                    ) : null}

                    {/* ── Desktop table (≥ md) ── untouched ── */}
                    {!loading && (
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-left min-w-[1100px]">
                                <thead>
                                    <tr className="text-slate-500 border-b border-slate-800/50">
                                        {/* Fixed: narrower left padding for reference col */}
                                        <SortableHeader field="patient_ref" label="Patient Reference" className="pl-6" />
                                        <SortableHeader field="substance_name" label="Substance" />
                                        <SortableHeader field="indication_name" label="Treatment" />
                                        <SortableHeader field="sex_label" label="Gender" />
                                        <SortableHeader field="patient_age" label="Age" />
                                        <SortableHeader field="session_date" label="Date" />
                                        <SortableHeader field="status" label="Status" />
                                        <th className="px-4 py-5 text-right text-xs font-black text-slate-500 uppercase tracking-[0.15em] pr-6">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/30">
                                    {filteredProtocols.map((p) => (
                                        <tr
                                            key={p.id}
                                            onClick={() => navigate(`/protocol/${p.id}`)}
                                            className="hover:bg-primary/5 transition-colors group cursor-pointer"
                                        >
                                            {/* Patient Reference, shows PT-XXXXXXXXXX */}
                                            <td className="pl-6 pr-4 py-5">
                                                <div className="flex flex-col">
                                                    <span
                                                        className="text-sm font-black font-mono uppercase tracking-tight leading-tight"
                                                        style={{ color: '#9DAEC8' }}
                                                    >
                                                        {p.patient_ref}
                                                    </span>
                                                    {p.substance_name !== '—' && (
                                                        <span className="text-xs text-slate-600 font-bold mt-0.5 truncate max-w-[160px]">
                                                            {p.substance_name}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Substance — color pill */}
                                            <td className="px-4 py-5">
                                                {p.substance_name === '—' ? (
                                                    <span className="text-sm font-bold" style={{ color: '#374151' }}>—</span>
                                                ) : (() => {
                                                    const sc = SUBSTANCE_COLORS[p.substance_name] ?? DEFAULT_SUBSTANCE_COLOR;
                                                    return (
                                                        <span
                                                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-black tracking-wide border"
                                                            style={{ background: sc.bg, color: sc.text, borderColor: sc.border }}
                                                        >
                                                            {p.substance_name}
                                                        </span>
                                                    );
                                                })()}
                                            </td>

                                            {/* Treatment (Indication) */}
                                            <td className="px-4 py-5 max-w-[140px]">
                                                <span
                                                    className="text-sm font-bold block truncate"
                                                    style={{ color: p.indication_name === '—' ? '#374151' : '#8B9DC3' }}
                                                    title={p.indication_name}
                                                >
                                                    {p.indication_name}
                                                </span>
                                            </td>

                                            {/* Gender */}
                                            <Cell value={p.sex_label} dim={p.sex_label === '—'} />

                                            {/* Age */}
                                            <Cell value={p.patient_age !== '—' ? `${p.patient_age} yrs` : '—'} />



                                            {/* Date */}
                                            <Cell value={p.session_date} mono />

                                            {/* Status — 4-state color-coded */}
                                            <td className="px-4 py-5">
                                                <div className="flex items-center gap-2">
                                                    <div className={`size-1.5 rounded-full flex-shrink-0 ${
                                                        p.status === 'Completed'   ? 'bg-emerald-400'
                                                        : p.status === 'Integration' ? 'bg-indigo-400'
                                                        : p.status === 'Dosing'      ? 'bg-amber-400'
                                                        : 'bg-primary'
                                                    }`} />
                                                    <span className={`text-xs font-black uppercase tracking-widest whitespace-nowrap ${
                                                        p.status === 'Completed'   ? 'text-emerald-400'
                                                        : p.status === 'Integration' ? 'text-indigo-400'
                                                        : p.status === 'Dosing'      ? 'text-amber-400'
                                                        : 'text-primary'
                                                    }`}>
                                                        {p.status}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Action */}
                                            <td className="px-4 py-5 pr-6 text-right">
                                                <span className="text-xs font-black text-primary group-hover:text-slate-300 uppercase tracking-widest transition-colors flex items-center justify-end gap-1 ml-auto whitespace-nowrap">
                                                    Open
                                                    <ChevronRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Empty state */}
                    {!loading && filteredProtocols.length === 0 && (
                        <div className="py-20 text-center space-y-4">
                            <ClipboardList className="mx-auto text-slate-800" size={48} />
                            <p className="text-slate-600 font-black uppercase tracking-widest text-sm">
                                Zero Protocol Matches Found
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyProtocols;
