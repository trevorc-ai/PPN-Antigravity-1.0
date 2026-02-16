import React, { useState, useEffect } from 'react';
import { X, Search, ChevronRight, Clock } from 'lucide-react';
import { supabase } from '../../supabaseClient';

interface PatientRecord {
    subject_id: string;
    patient_age: string;
    patient_sex: string;
    patient_weight_range: string;
    indication_id: number;
    substance_id: number;
    session_date: string;
    session_number: number;
    total_sessions: number;
    indication_name?: string;
    substance_name?: string;
}

interface PatientLookupModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectPatient: (patient: PatientRecord) => void;
}

export const PatientLookupModal: React.FC<PatientLookupModalProps> = ({
    isOpen,
    onClose,
    onSelectPatient,
}) => {
    const [searchCriteria, setSearchCriteria] = useState({
        patient_age: '',
        patient_sex: '',
        patient_weight_range: '',
        indication_id: '',
        substance_id: '',
        date_range: '30',
    });

    const [searchResults, setSearchResults] = useState<PatientRecord[]>([]);
    const [loading, setLoading] = useState(false);
    const [indications, setIndications] = useState<any[]>([]);
    const [substances, setSubstances] = useState<any[]>([]);

    useEffect(() => {
        if (isOpen) {
            loadReferenceData();
        }
    }, [isOpen]);

    const loadReferenceData = async () => {
        const [indicationsRes, substancesRes] = await Promise.all([
            supabase.from('ref_indications').select('*').order('indication_name'),
            supabase.from('ref_substances').select('*').order('substance_name'),
        ]);

        if (indicationsRes.data) setIndications(indicationsRes.data);
        if (substancesRes.data) setSubstances(substancesRes.data);
    };

    const handleSearch = async () => {
        setLoading(true);

        let query = supabase
            .from('log_clinical_records')
            .select(`
        subject_id,
        patient_age,
        patient_sex,
        patient_weight_range,
        indication_id,
        substance_id,
        session_date,
        session_number,
        ref_indications(indication_name),
        ref_substances(substance_name)
      `)
            .order('session_date', { ascending: false })
            .limit(50);

        if (searchCriteria.patient_age) query = query.eq('patient_age', searchCriteria.patient_age);
        if (searchCriteria.patient_sex) query = query.eq('patient_sex', searchCriteria.patient_sex);
        if (searchCriteria.patient_weight_range) query = query.eq('patient_weight_range', searchCriteria.patient_weight_range);
        if (searchCriteria.indication_id) query = query.eq('indication_id', searchCriteria.indication_id);
        if (searchCriteria.substance_id) query = query.eq('substance_id', searchCriteria.substance_id);

        if (searchCriteria.date_range) {
            const daysAgo = parseInt(searchCriteria.date_range);
            const dateThreshold = new Date();
            dateThreshold.setDate(dateThreshold.getDate() - daysAgo);
            query = query.gte('session_date', dateThreshold.toISOString());
        }

        const { data, error } = await query;

        if (error) {
            console.error('Search error:', error);
            setLoading(false);
            return;
        }

        // Group by subject_id and get latest session
        const grouped = (data || []).reduce((acc: any, record: any) => {
            if (!acc[record.subject_id] || new Date(record.session_date) > new Date(acc[record.subject_id].session_date)) {
                acc[record.subject_id] = {
                    ...record,
                    indication_name: record.ref_indications?.indication_name,
                    substance_name: record.ref_substances?.substance_name,
                };
            }
            return acc;
        }, {});

        // Count total sessions per patient
        const results = Object.values(grouped).map((patient: any) => ({
            ...patient,
            total_sessions: (data || []).filter((r: any) => r.subject_id === patient.subject_id).length,
        }));

        setSearchResults(results as PatientRecord[]);
        setLoading(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#0f1218] border border-[#1e293b] rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-[#1e293b]">
                    <h2 className="text-2xl font-semibold text-[#f8fafc]">Find Existing Patient</h2>
                    <button
                        onClick={onClose}
                        className="text-[#94a3b8] hover:text-[#f8fafc] transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Search Criteria */}
                <div className="p-6 border-b border-[#1e293b]">
                    <p className="text-sm text-[#94a3b8] mb-4">Search by Characteristics</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Age Range */}
                        <div>
                            <label className="block text-sm font-medium text-[#f8fafc] mb-2">Age Range</label>
                            <select
                                value={searchCriteria.patient_age}
                                onChange={(e) => setSearchCriteria({ ...searchCriteria, patient_age: e.target.value })}
                                className="w-full bg-[#020408] border border-[#1e293b] rounded-lg px-4 py-2.5 text-[#f8fafc] focus:border-[#14b8a6] focus:outline-none"
                            >
                                <option value="">Any</option>
                                <option value="18-25">18-25</option>
                                <option value="26-35">26-35</option>
                                <option value="36-45">36-45</option>
                                <option value="46-55">46-55</option>
                                <option value="56-65">56-65</option>
                                <option value="66+">66+</option>
                            </select>
                        </div>

                        {/* Sex */}
                        <div>
                            <label className="block text-sm font-medium text-[#f8fafc] mb-2">Biological Sex</label>
                            <select
                                value={searchCriteria.patient_sex}
                                onChange={(e) => setSearchCriteria({ ...searchCriteria, patient_sex: e.target.value })}
                                className="w-full bg-[#020408] border border-[#1e293b] rounded-lg px-4 py-2.5 text-[#f8fafc] focus:border-[#14b8a6] focus:outline-none"
                            >
                                <option value="">Any</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Intersex">Intersex</option>
                                <option value="Unknown">Unknown</option>
                            </select>
                        </div>

                        {/* Weight Range */}
                        <div>
                            <label className="block text-sm font-medium text-[#f8fafc] mb-2">Weight Range</label>
                            <select
                                value={searchCriteria.patient_weight_range}
                                onChange={(e) => setSearchCriteria({ ...searchCriteria, patient_weight_range: e.target.value })}
                                className="w-full bg-[#020408] border border-[#1e293b] rounded-lg px-4 py-2.5 text-[#f8fafc] focus:border-[#14b8a6] focus:outline-none"
                            >
                                <option value="">Any</option>
                                <option value="40-50kg">40-50kg</option>
                                <option value="51-60kg">51-60kg</option>
                                <option value="61-70kg">61-70kg</option>
                                <option value="71-80kg">71-80kg</option>
                                <option value="81-90kg">81-90kg</option>
                                <option value="91-100kg">91-100kg</option>
                                <option value="101+kg">101+kg</option>
                            </select>
                        </div>

                        {/* Indication */}
                        <div>
                            <label className="block text-sm font-medium text-[#f8fafc] mb-2">Primary Indication</label>
                            <select
                                value={searchCriteria.indication_id}
                                onChange={(e) => setSearchCriteria({ ...searchCriteria, indication_id: e.target.value })}
                                className="w-full bg-[#020408] border border-[#1e293b] rounded-lg px-4 py-2.5 text-[#f8fafc] focus:border-[#14b8a6] focus:outline-none"
                            >
                                <option value="">Any</option>
                                {indications.map((ind) => (
                                    <option key={ind.indication_id} value={ind.indication_id}>
                                        {ind.indication_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Substance */}
                        <div>
                            <label className="block text-sm font-medium text-[#f8fafc] mb-2">Substance</label>
                            <select
                                value={searchCriteria.substance_id}
                                onChange={(e) => setSearchCriteria({ ...searchCriteria, substance_id: e.target.value })}
                                className="w-full bg-[#020408] border border-[#1e293b] rounded-lg px-4 py-2.5 text-[#f8fafc] focus:border-[#14b8a6] focus:outline-none"
                            >
                                <option value="">Any</option>
                                {substances.map((sub) => (
                                    <option key={sub.substance_id} value={sub.substance_id}>
                                        {sub.substance_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Last Session */}
                        <div>
                            <label className="block text-sm font-medium text-[#f8fafc] mb-2">Last Session</label>
                            <select
                                value={searchCriteria.date_range}
                                onChange={(e) => setSearchCriteria({ ...searchCriteria, date_range: e.target.value })}
                                className="w-full bg-[#020408] border border-[#1e293b] rounded-lg px-4 py-2.5 text-[#f8fafc] focus:border-[#14b8a6] focus:outline-none"
                            >
                                <option value="7">Last 7 days</option>
                                <option value="30">Last 30 days</option>
                                <option value="90">Last 90 days</option>
                                <option value="180">Last 6 months</option>
                                <option value="">Any time</option>
                            </select>
                        </div>
                    </div>

                    <button
                        onClick={handleSearch}
                        disabled={loading}
                        className="mt-4 bg-[#14b8a6] hover:bg-[#0d9488] text-slate-300 px-6 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        <Search className="w-4 h-4" />
                        {loading ? 'Searching...' : 'Search'}
                    </button>
                </div>

                {/* Results */}
                <div className="flex-1 overflow-y-auto p-6">
                    {searchResults.length === 0 && !loading && (
                        <div className="text-center py-12">
                            <p className="text-[#94a3b8]">No results. Adjust search criteria and try again.</p>
                        </div>
                    )}

                    {loading && (
                        <div className="text-center py-12">
                            <p className="text-[#94a3b8]">Searching...</p>
                        </div>
                    )}

                    <div className="space-y-4">
                        {searchResults.map((patient) => (
                            <div
                                key={patient.subject_id}
                                className="bg-[#020408] border border-[#1e293b] rounded-lg p-4 hover:border-[#14b8a6] transition-colors"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="font-mono text-[#14b8a6] font-semibold">
                                                {patient.subject_id}
                                            </span>
                                            <span className="text-[#94a3b8]">•</span>
                                            <span className="text-[#f8fafc]">
                                                {patient.patient_age} {patient.patient_sex} • {patient.patient_weight_range}
                                            </span>
                                        </div>
                                        <p className="text-sm text-[#94a3b8] mb-1">
                                            Last: {patient.indication_name} + {patient.substance_name}
                                        </p>
                                        <div className="flex items-center gap-4 text-xs text-[#94a3b8]">
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {new Date(patient.session_date).toLocaleDateString()}
                                            </span>
                                            <span>Sessions: {patient.total_sessions}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => onSelectPatient(patient)}
                                        className="bg-[#10b981] hover:bg-[#059669] text-slate-300 px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                                    >
                                        Select
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
