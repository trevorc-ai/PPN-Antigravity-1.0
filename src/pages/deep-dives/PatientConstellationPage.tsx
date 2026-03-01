import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ClipboardList, ChevronRight } from 'lucide-react';
import { SAMPLE_INTERVENTION_RECORDS } from '../../constants';
import PatientConstellationComponent from '../../components/analytics/PatientConstellation';
import { PageContainer } from '../../components/layouts/PageContainer';
import { Section } from '../../components/layouts/Section';

const PatientConstellation: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const filteredProtocols = useMemo(() => {
        return SAMPLE_INTERVENTION_RECORDS.filter((p: any) =>
            p.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.protocol?.substance?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.siteId?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery]);

    return (
        <PageContainer className="py-8">
            <Section>
                <div className="border-b border-slate-800 pb-6">
                    <h1 className="sr-only">Patient Constellation</h1>
                    <p className="text-slate-300 text-xl sm:text-2xl font-medium max-w-4xl leading-relaxed">
                        This chart maps patient outcomes based on their treatment resistance and symptom severity. Each dot represents a patient, allowing you to see patterns in how different people respond to treatments.
                    </p>
                </div>
                <div className="mt-8">
                    <PatientConstellationComponent />
                </div>

                {/* Filterable Table Section */}
                <div className="mt-12 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-black text-slate-300 tracking-tight">Active Protocols</h2>
                        <div className="relative group w-full max-w-md">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="Search protocols, IDs, or substances..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full h-12 bg-slate-900/50 border border-slate-800 rounded-xl pl-12 pr-6 text-sm font-bold text-slate-300 focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-slate-600"
                            />
                        </div>
                    </div>

                    <div className="bg-slate-900/40 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-xl">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] border-b border-slate-800/50">
                                        <th className="px-8 py-6">Protocol Reference</th>
                                        <th className="px-8 py-6">Current Status</th>
                                        <th className="px-8 py-6">Dosage</th>
                                        <th className="px-8 py-6 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/30">
                                    {filteredProtocols.map((p) => (
                                        <tr key={p.id} className="hover:bg-primary/5 transition-colors group">
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col">
                                                    <span className="text-base font-black text-slate-300 leading-tight">{p.protocol.substance} Protocol</span>
                                                    <span className="text-xs font-mono text-slate-500 font-bold tracking-tight mt-1">{p.id} • {p.siteId}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-2">
                                                    <div className={`size-1.5 rounded-full ${p.status === 'Completed' ? 'bg-clinical-green' : p.status === 'Active' ? 'bg-primary' : 'bg-slate-500'}`}></div>
                                                    <span className={`text-xs font-black uppercase tracking-widest ${p.status === 'Completed' ? 'text-clinical-green' : 'text-slate-500'}`}>{p.status}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-sm font-mono text-slate-300">{p.protocol.dosage} {p.protocol.dosageUnit}</td>
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
                        {filteredProtocols.length === 0 && (
                            <div className="py-20 text-center space-y-4">
                                <ClipboardList className="mx-auto text-slate-800" size={48} />
                                <p className="text-slate-600 font-black uppercase tracking-widest text-sm">Zero Protocol Matches Found</p>
                            </div>
                        )}
                    </div>
                </div>
            </Section>
        </PageContainer>
    );
};

export default PatientConstellation;
