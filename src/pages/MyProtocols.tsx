import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { PageContainer } from '../components/layouts/PageContainer';
import { Section } from '../components/layouts/Section';
import { Plus, Filter, Calendar, ChevronRight } from 'lucide-react';

interface Protocol {
    id: number;
    subject_id: string;
    session_number: number;
    substance_name: string;
    indication_name: string;
    session_date: string;
    submitted_at: string | null;
    dosage_mg: number;
    dosage_unit: string;
    patient_age?: number | null;
    patient_sex?: string | null;
    created_at?: string | null;
    outcome_score?: number | null;
}

export const MyProtocols = () => {
    const navigate = useNavigate();
    const [protocols, setProtocols] = useState<Protocol[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterSubstance, setFilterSubstance] = useState('all');
    const [filterIndication, setFilterIndication] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        fetchProtocols();
    }, []);

    const fetchProtocols = async () => {
        try {
            const { data, error } = await supabase
                .from('log_clinical_records')
                .select(`
          id,
          subject_id,
          session_number,
          session_date,
          submitted_at,
          dosage_mg,
          dosage_unit,
          patient_age,
          patient_sex,
          created_at,
          outcome_score,
          ref_substances (substance_name),
          ref_indications (indication_name)
        `)
                .order('session_date', { ascending: false })
                .limit(100);

            if (error) throw error;

            const formattedData = data?.map((record: any) => ({
                id: record.id,
                subject_id: record.subject_id,
                session_number: record.session_number,
                substance_name: record.ref_substances?.substance_name || 'Unknown',
                indication_name: record.ref_indications?.indication_name || 'Unknown',
                session_date: record.session_date,
                submitted_at: record.submitted_at,
                dosage_mg: record.dosage_mg,
                dosage_unit: record.dosage_unit,
                patient_age: record.patient_age,
                patient_sex: record.patient_sex,
                created_at: record.created_at,
                outcome_score: record.outcome_score,
            })) || [];

            setProtocols(formattedData);
        } catch (error) {
            console.error('Error fetching protocols:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredProtocols = protocols.filter((protocol) => {
        const matchesSubstance = filterSubstance === 'all' || protocol.substance_name === filterSubstance;
        const matchesIndication = filterIndication === 'all' || protocol.indication_name === filterIndication;
        const matchesStatus =
            filterStatus === 'all' ||
            (filterStatus === 'submitted' && protocol.submitted_at) ||
            (filterStatus === 'draft' && !protocol.submitted_at);

        return matchesSubstance && matchesIndication && matchesStatus;
    });

    const uniqueSubstances = Array.from(new Set(protocols.map(p => p.substance_name)));
    const uniqueIndications = Array.from(new Set(protocols.map(p => p.indication_name)));

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const formatRelativeTime = (dateString: string): string => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays}d ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
        return `${Math.floor(diffDays / 30)}mo ago`;
    };

    return (
        <PageContainer>
            <Section>
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-50 mb-2">My Protocols</h1>
                        <p className="text-slate-400">View and manage clinical session records</p>
                    </div>
                    <button
                        onClick={() => navigate('/protocol-builder')}
                        className="flex items-center gap-2 px-6 py-3 bg-[#14b8a6] hover:bg-[#0d9488] text-white rounded-lg transition-colors duration-200 font-medium"
                    >
                        <Plus className="w-5 h-5" />
                        New Protocol
                    </button>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-3 mb-6">
                    <select
                        value={filterSubstance}
                        onChange={(e) => setFilterSubstance(e.target.value)}
                        className="px-4 py-2.5 bg-[#1f2937] border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-[#14b8a6] transition-colors"
                    >
                        <option value="all">All Substances</option>
                        {uniqueSubstances.map((substance) => (
                            <option key={substance} value={substance}>{substance}</option>
                        ))}
                    </select>

                    <select
                        value={filterIndication}
                        onChange={(e) => setFilterIndication(e.target.value)}
                        className="px-4 py-2.5 bg-[#1f2937] border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-[#14b8a6] transition-colors"
                    >
                        <option value="all">All Indications</option>
                        {uniqueIndications.map((indication) => (
                            <option key={indication} value={indication}>{indication}</option>
                        ))}
                    </select>

                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-2.5 bg-[#1f2937] border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-[#14b8a6] transition-colors"
                    >
                        <option value="all">All Status</option>
                        <option value="submitted">Submitted</option>
                        <option value="draft">Draft</option>
                    </select>
                </div>

                {/* Protocols Table */}
                {loading ? (
                    <div className="text-center py-12 text-slate-400">Loading protocols...</div>
                ) : filteredProtocols.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-slate-400 mb-4">No protocols found</p>
                        <button
                            onClick={() => navigate('/protocol-builder')}
                            className="text-[#14b8a6] hover:text-[#0d9488] transition-colors"
                        >
                            Create your first protocol →
                        </button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-700">
                                    <th className="text-left py-4 px-4 text-sm font-semibold text-slate-400 uppercase tracking-wider">Subject ID</th>
                                    <th className="text-left py-4 px-4 text-sm font-semibold text-slate-400 uppercase tracking-wider">Subject</th>
                                    <th className="text-left py-4 px-4 text-sm font-semibold text-slate-400 uppercase tracking-wider">Session</th>
                                    <th className="text-left py-4 px-4 text-sm font-semibold text-slate-400 uppercase tracking-wider">Substance</th>
                                    <th className="text-left py-4 px-4 text-sm font-semibold text-slate-400 uppercase tracking-wider">Dosage</th>
                                    <th className="text-left py-4 px-4 text-sm font-semibold text-slate-400 uppercase tracking-wider">Indication</th>
                                    <th className="text-left py-4 px-4 text-sm font-semibold text-slate-400 uppercase tracking-wider">Created</th>
                                    <th className="text-left py-4 px-4 text-sm font-semibold text-slate-400 uppercase tracking-wider">Outcome</th>
                                    <th className="text-left py-4 px-4 text-sm font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                                    <th className="w-12"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProtocols.map((protocol) => (
                                    <tr
                                        key={protocol.id}
                                        onClick={() => navigate(`/protocol/${protocol.id}`)}
                                        className="border-b border-slate-800 hover:bg-slate-900/50 cursor-pointer transition-colors"
                                    >
                                        <td className="py-4 px-4">
                                            <span className="font-mono text-sm text-[#14b8a6]">{protocol.subject_id}</span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className="font-mono text-sm font-bold text-slate-400">
                                                {protocol.patient_age || '?'}{protocol.patient_sex?.charAt(0) || '?'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className="text-slate-300">{protocol.session_number}</span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className={`
                                                inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold text-white
                                                ${protocol.substance_name === 'Psilocybin' ? 'bg-[#a78bfa]' : ''}
                                                ${protocol.substance_name === 'MDMA' ? 'bg-[#f472b6]' : ''}
                                                ${protocol.substance_name === 'Ketamine' ? 'bg-[#60a5fa]' : ''}
                                                ${protocol.substance_name === 'LSD' ? 'bg-[#22d3ee]' : ''}
                                                ${protocol.substance_name === '5-MeO-DMT' ? 'bg-[#fbbf24]' : ''}
                                                ${!['Psilocybin', 'MDMA', 'Ketamine', 'LSD', '5-MeO-DMT'].includes(protocol.substance_name) ? 'bg-slate-500' : ''}
                                            `}>
                                                {protocol.substance_name}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className="text-slate-300">{protocol.dosage_mg} {protocol.dosage_unit}</span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className="text-slate-300">{protocol.indication_name}</span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-slate-300">
                                                    {protocol.created_at ? formatDate(protocol.created_at) : 'N/A'}
                                                </span>
                                                <span className="text-[10px] text-slate-600 font-mono">
                                                    {protocol.created_at ? formatRelativeTime(protocol.created_at) : ''}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            {protocol.outcome_score !== undefined && protocol.outcome_score !== null ? (
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-2 h-2 rounded-full ${protocol.outcome_score >= 7 ? 'bg-[#10b981] shadow-[0_0_4px_#10b981]' :
                                                            protocol.outcome_score >= 4 ? 'bg-[#f59e0b] shadow-[0_0_4px_#f59e0b]' :
                                                                'bg-[#ef4444] shadow-[0_0_4px_#ef4444]'
                                                        }`}></div>
                                                    <span className={`text-sm font-bold ${protocol.outcome_score >= 7 ? 'text-[#10b981]' :
                                                            protocol.outcome_score >= 4 ? 'text-[#f59e0b]' :
                                                                'text-[#ef4444]'
                                                        }`}>
                                                        {protocol.outcome_score}/10
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-[11px] text-slate-700 font-mono">—</span>
                                            )}
                                        </td>
                                        <td className="py-4 px-4">
                                            {protocol.submitted_at ? (
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#10b981] text-white">
                                                    Complete
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#f59e0b] text-white">
                                                    Draft
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-4 px-4">
                                            <ChevronRight className="w-5 h-5 text-slate-600" />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Results Count */}
                {!loading && filteredProtocols.length > 0 && (
                    <div className="mt-6 text-sm text-slate-400">
                        Showing {filteredProtocols.length} of {protocols.length} protocols
                    </div>
                )}
            </Section>


        </PageContainer>
    );
};
