import { useDataCache } from '../hooks/useDataCache';
import { supabase } from '../supabaseClient';
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Search, ChevronRight, ClipboardList, Activity, Info, ChevronUp, ChevronDown } from 'lucide-react';

interface Protocol {
    id: string; // Changed from number to string (UUID)
    subject_id: string;
    session_number: number;
    substance_name: string;
    indication_name: string;
    session_date: string;
    submitted_at: string | null;
    dosage_mg: number;
    dosage_unit: string;
    status: string;
    patient_sex: string;
}

type SortField = 'subject_id' | 'substance_name' | 'patient_sex' | 'dosage_mg' | 'status';
type SortDirection = 'asc' | 'desc';

export const MyProtocols = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [sortField, setSortField] = useState<SortField>('subject_id');
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

    const { data: cachedProtocols, loading, refetch, lastFetchedAt } = useDataCache(
        'my-protocols',
        async () => {
            try {
                const { data, error } = await supabase
                    .from('log_clinical_records')
                    .select(`
              id,
              patient_id,
              session_date,
              substance_id,
              patient_sex,
              ref_substances (substance_name)
            `)
                    .order('created_at', { ascending: false })
                    .limit(100);

                if (error) throw error;

                const formattedData = data?.map((record: any) => ({
                    id: record.id,
                    subject_id: `PT-${String(record.patient_id).padStart(6, '0')}`,
                    session_number: 1,
                    substance_name: record.ref_substances?.substance_name || 'Unknown',
                    indication_name: 'Research',
                    session_date: record.session_date || new Date().toISOString().split('T')[0],
                    submitted_at: record.created_at,
                    dosage_mg: 25,
                    dosage_unit: 'mg',
                    status: 'Completed',
                    patient_sex: record.patient_sex || 'Unknown',
                })) || [];

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
        const filtered = protocols.filter(p =>
            p.subject_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.substance_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.patient_sex.toLowerCase().includes(searchQuery.toLowerCase())
        );

        // Sort the filtered results
        return filtered.sort((a, b) => {
            let aVal = a[sortField];
            let bVal = b[sortField];

            // Handle numeric sorting for dosage
            if (sortField === 'dosage_mg') {
                aVal = Number(aVal);
                bVal = Number(bVal);
            }

            if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });
    }, [protocols, searchQuery, sortField, sortDirection]);

    const SortableHeader: React.FC<{ field: SortField; label: string }> = ({ field, label }) => (
        <th
            className="px-8 py-6 cursor-pointer hover:text-primary transition-colors select-none"
            onClick={() => handleSort(field)}
        >
            <div className="flex items-center gap-2">
                <span>{label}</span>
                {sortField === field && (
                    sortDirection === 'asc' ?
                        <ChevronUp className="w-3 h-3" /> :
                        <ChevronDown className="w-3 h-3" />
                )}
            </div>
        </th>
    );

    return (
        <div className="min-h-full p-6 sm:p-10 space-y-10 animate-in fade-in duration-700 max-w-[1600px] mx-auto pb-24">
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
                        className="px-8 py-4 bg-primary hover:bg-blue-600 text-white text-xs font-black rounded-2xl uppercase tracking-[0.2em] transition-all shadow-xl shadow-primary/20 active:scale-95 flex items-center gap-3"
                    >
                        <PlusCircle size={18} />
                        Create New Protocol
                    </button>
                </div>
            </div>

            <div className="space-y-6">
                <div className="relative group max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Search local protocols..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-12 bg-[#0f172a] border border-slate-700 rounded-xl pl-12 pr-6 text-sm font-bold placeholder:text-slate-600 focus:outline-none focus:border-primary transition-all" style={{ color: '#8B9DC3' }}
                    />
                </div>

                <div className="bg-slate-900/40 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-xl">
                    {loading ? (
                        <div className="py-20 text-center">
                            <p className="font-black uppercase tracking-widest text-sm" style={{ color: '#8B9DC3' }}>Loading protocols...</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] border-b border-slate-800/50">
                                        <SortableHeader field="subject_id" label="Protocol Reference" />
                                        <SortableHeader field="substance_name" label="Substance" />
                                        <SortableHeader field="patient_sex" label="Gender" />
                                        <SortableHeader field="dosage_mg" label="Dosage" />
                                        <SortableHeader field="status" label="Status" />
                                        <th className="px-8 py-6 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/30">
                                    {filteredProtocols.map((p) => (
                                        <tr key={p.id} className="hover:bg-primary/5 transition-colors group">
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col">
                                                    <span className="text-base font-black leading-tight uppercase" style={{ color: '#9DAEC8' }}>
                                                        {p.substance_name} Protocol
                                                    </span>
                                                    <span className="text-xs font-mono text-slate-500 font-bold uppercase tracking-tight mt-1">
                                                        {p.subject_id} • Session {p.session_number}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="text-sm font-bold" style={{ color: '#8B9DC3' }}>{p.substance_name}</span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="text-sm font-bold" style={{ color: '#8B9DC3' }}>{p.patient_sex}</span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="text-sm font-bold" style={{ color: '#8B9DC3' }}>{p.patient_sex}</span>
                                            </td>
                                            <td className="px-8 py-6 text-sm font-mono" style={{ color: '#8B9DC3' }}>
                                                {p.dosage_mg} {p.dosage_unit}
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-2">
                                                    <div className={`size-1.5 rounded-full ${p.status === 'Completed' ? 'bg-clinical-green' : 'bg-primary'}`}></div>
                                                    <span className={`text-xs font-black uppercase tracking-widest ${p.status === 'Completed' ? 'text-clinical-green' : 'text-slate-500'}`}>
                                                        {p.status}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <button
                                                    onClick={() => navigate(`/protocol/${p.id}`)}
                                                    className="text-xs font-black text-primary hover:text-slate-300 uppercase tracking-widest transition-colors flex items-center justify-end gap-2 ml-auto"
                                                >
                                                    Open Protocol
                                                    <ChevronRight className="size-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
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
