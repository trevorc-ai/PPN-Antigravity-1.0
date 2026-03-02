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

                // Parallel fetch: sessions + all reference tables needed for client-side join
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
                            session_date,
                            session_type_id,
                            substance_id,
                            indication_id,
                            patient_sex_id,
                            patient_age_years,
                            weight_range_id,
                            patient_smoking_status_id
                        `)
                        .eq('practitioner_id', user.id)
                        .order('created_at', { ascending: false })
                        .limit(100),
                    supabase.from('ref_substances').select('substance_id, substance_name'),
                    supabase.from('ref_indications').select('indication_id, indication_name'),
                    supabase.from('ref_sex').select('id, sex_label'),
                    supabase.from('ref_weight_ranges').select('id, range_label'),
                    supabase.from('ref_smoking_status').select('smoking_status_id, status_name'),
                ]);

                if (sessionResult.error) throw sessionResult.error;

                // Build client-side lookup maps
                const substanceMap = buildMap(substanceResult.data, 'substance_id', 'substance_name');
                const indicationMap = buildMap(indicationResult.data, 'indication_id', 'indication_name');
                const sexMap = buildMap(sexResult.data, 'id', 'sex_label');
                const weightMap = buildMap(weightResult.data, 'id', 'range_label');
                const smokingMap = buildMap(smokingResult.data, 'smoking_status_id', 'status_name');

                const formattedData: Protocol[] = (sessionResult.data ?? []).map((record: any) => ({
                    id: record.id,
                    // patient_link_code dropped in migration 079, use UUID prefix as reference
                    patient_ref: record.id
                        ? `SID-${record.id.substring(0, 8).toUpperCase()}`
                        : '—',
                    substance_name: substanceMap[record.substance_id] ?? (record.substance_id ? `Substance #${record.substance_id}` : '—'),
                    session_date: record.session_date || '—',
                    submitted_at: record.created_at ?? null,
                    session_type_id: record.session_type_id ?? null,
                    status: SESSION_TYPE_LABELS[record.session_type_id as number] ?? 'In Progress',
                    // New columns, display '—' when not yet recorded
                    indication_name: indicationMap[record.indication_id] ?? '—',
                    sex_label: sexMap[record.patient_sex_id] ?? '—',
                    patient_age: record.patient_age_years != null ? `${record.patient_age_years}` : '—',
                    smoking_status: smokingMap[record.patient_smoking_status_id] ?? '—',
                    weight_label: weightMap[record.weight_range_id] ?? '—',
                }));

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
                    <h1 className="text-4xl sm:text-5xl font-black tracking-tighter" style={{ color: '#8BA5D3' }}>My Protocols</h1>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={refetch}
                        disabled={loading}
                        title={lastFetchedAt ? `Last updated: ${lastFetchedAt.toLocaleTimeString()}` : 'Not loaded'}
                        style={{
                            background: 'transparent',
                            border: '1px solid rgba(56,139,253,0.2)',
                            color: '#6b7a8d',
                            fontSize: 12,
                            padding: '4px 10px',
                            borderRadius: 6,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                        }}
                        className="hover:bg-slate-800/50 transition-colors"
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
                <div className="relative group max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Search protocols, substances, treatments..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-12 bg-[#0f172a] border border-slate-700 rounded-xl pl-12 pr-6 text-sm font-bold placeholder:text-slate-600 focus:outline-none focus:border-primary transition-all"
                        style={{ color: '#8B9DC3' }}
                    />
                </div>

                {/* Table */}
                <div className="bg-slate-900/40 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-xl">
                    {loading ? (
                        <div className="py-20 text-center">
                            <p className="font-black uppercase tracking-widest text-sm" style={{ color: '#8B9DC3' }}>Loading protocols...</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left min-w-[1100px]">
                                <thead>
                                    <tr className="text-slate-500 border-b border-slate-800/50">
                                        {/* Fixed: narrower left padding for reference col */}
                                        <SortableHeader field="patient_ref" label="Patient Reference" className="pl-6" />
                                        <SortableHeader field="substance_name" label="Substance" />
                                        <SortableHeader field="indication_name" label="Treatment" />
                                        <SortableHeader field="sex_label" label="Gender" />
                                        <SortableHeader field="patient_age" label="Age" />
                                        <SortableHeader field="smoking_status" label="Smoking" />
                                        <SortableHeader field="weight_label" label="Weight" />
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

                                            {/* Substance */}
                                            <Cell value={p.substance_name} />

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

                                            {/* Smoking */}
                                            <Cell value={abbreviateSmoking(p.smoking_status)} dim={p.smoking_status === '—'} />

                                            {/* Weight */}
                                            <Cell value={abbreviateWeight(p.weight_label)} dim={p.weight_label === '—'} />

                                            {/* Date */}
                                            <Cell value={p.session_date} mono />

                                            {/* Status */}
                                            <td className="px-4 py-5">
                                                <div className="flex items-center gap-2">
                                                    <div className={`size-1.5 rounded-full flex-shrink-0 ${p.status === 'Integration' ? 'bg-clinical-green' : 'bg-primary'}`} />
                                                    <span className={`text-xs font-black uppercase tracking-widest whitespace-nowrap ${p.status === 'Integration' ? 'text-clinical-green' : 'text-primary'}`}>
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
