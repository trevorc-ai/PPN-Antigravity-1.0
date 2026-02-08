import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Map, Radio, Activity, ExternalLink, CheckCircle, Lock } from 'lucide-react';

// State regulatory data
interface StateRegulation {
    code: string;
    name: string;
    status: 'Legal (Regulated)' | 'Decriminalized' | 'Medical Only' | 'Illegal' | 'Pending';
    license: string;
    keyForm?: string;
    color: string;
}

const STATE_DATA: Record<string, StateRegulation> = {
    OR: { code: 'OR', name: 'Oregon', status: 'Legal (Regulated)', license: 'Facilitator Required', keyForm: 'Consent for Touch', color: 'bg-[#5B8FA3]' },
    CO: { code: 'CO', name: 'Colorado', status: 'Decriminalized', license: 'Pending Regulations', color: 'bg-[#7BA05B]' },
    CA: { code: 'CA', name: 'California', status: 'Medical Only', license: 'Research Protocol', color: 'bg-[#4A6B8A]' },
    WA: { code: 'WA', name: 'Washington', status: 'Pending', license: 'Under Review', color: 'bg-slate-600' },
    TX: { code: 'TX', name: 'Texas', status: 'Medical Only', license: 'Research (HB 1802)', color: 'bg-[#4A6B8A]' },
    ny: { code: 'NY', name: 'New York', status: 'Medical Only', license: 'Research Protocol', color: 'bg-[#4A6B8A]' },
    FL: { code: 'FL', name: 'Florida', status: 'Illegal', license: 'N/A', color: 'bg-slate-700' },
    MA: { code: 'MA', name: 'Massachusetts', status: 'Medical Only', license: 'Research Protocol', color: 'bg-[#4A6B8A]' },
    MI: { code: 'MI', name: 'Michigan', status: 'Pending', license: 'Under Review', color: 'bg-slate-600' },
    AZ: { code: 'AZ', name: 'Arizona', status: 'Illegal', license: 'N/A', color: 'bg-slate-700' },
    NV: { code: 'NV', name: 'Nevada', status: 'Decriminalized', license: 'Pending Regulations', color: 'bg-[#7BA05B]' },
    CT: { code: 'CT', name: 'Connecticut', status: 'Medical Only', license: 'Research Protocol', color: 'bg-[#4A6B8A]' },
};

export default function RegulatoryMosaic() {
    const navigate = useNavigate();
    const [selectedState, setSelectedState] = useState<string | null>('OR');

    const stateData = selectedState ? STATE_DATA[selectedState] : null;

    return (
        <div className="bg-[#0f1218] border border-slate-800 rounded-3xl p-6 h-[600px] flex flex-col relative overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 shrink-0">
                <div>
                    <h3 className="text-lg font-black text-white uppercase tracking-tighter flex items-center gap-2">
                        <Map className="w-5 h-5 text-indigo-500" />
                        Regulatory Mosaic (Grid View)
                    </h3>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        Navigating Legal Complexity • State-by-State Status
                    </p>
                </div>
                <div className="flex items-center gap-3 text-[10px] font-bold uppercase">
                    <span className="flex items-center gap-1.5">
                        <span className="size-2.5 bg-[#5B8FA3] rounded-full"></span>
                        <span className="text-emerald-400">Legal</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="size-2.5 bg-[#7BA05B] rounded-full"></span>
                        <span className="text-green-400">Decrim</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="size-2.5 bg-[#4A6B8A] rounded-full"></span>
                        <span className="text-blue-400">Medical</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="size-2.5 bg-slate-600 rounded-full"></span>
                        <span className="text-slate-400">Pending</span>
                    </span>
                </div>
            </div>

            {/* State Grid */}
            <div className="flex-1 flex gap-6 overflow-hidden">
                {/* Grid of States */}
                <div className="flex-1 grid grid-cols-3 sm:grid-cols-4 gap-3 content-start overflow-y-auto pr-2 custom-scrollbar">
                    {Object.values(STATE_DATA).map((state) => (
                        <button
                            key={state.code}
                            onClick={() => setSelectedState(state.code)}
                            className={`group relative p-4 rounded-xl border-2 transition-all text-left overflow-hidden ${selectedState === state.code
                                    ? 'border-indigo-400 bg-slate-800/90 shadow-[0_0_30px_rgba(99,102,241,0.4)] scale-[1.02]'
                                    : 'border-slate-700/50 bg-slate-800/40 hover:border-slate-600 hover:bg-slate-800/60 hover:shadow-lg'
                                }`}
                        >
                            {/* Color indicator - now thicker and more prominent */}
                            <div className={`absolute top-0 left-0 w-full h-2 ${state.color} transition-all shadow-lg ${selectedState === state.code ? 'opacity-100 h-3' : 'opacity-80 group-hover:opacity-100 group-hover:h-2.5'
                                }`}></div>

                            {/* State code */}
                            <div className="flex justify-between items-start mb-2 mt-1">
                                <span className="text-3xl font-black text-white drop-shadow-lg">{state.code}</span>
                                {state.status.includes('Legal') && <CheckCircle className="w-5 h-5 text-emerald-400" />}
                                {state.status === 'Illegal' && <Lock className="w-5 h-5 text-slate-500" />}
                            </div>

                            {/* State name */}
                            <p className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">{state.name}</p>

                            {/* Status badge */}
                            <p className={`text-[10px] font-mono ${state.status.includes('Legal') ? 'text-emerald-400' :
                                    state.status === 'Decriminalized' ? 'text-green-400' :
                                        state.status === 'Medical Only' ? 'text-blue-400' :
                                            state.status === 'Pending' ? 'text-amber-400' :
                                                'text-slate-500'
                                }`}>
                                {state.status}
                            </p>
                        </button>
                    ))}
                </div>

                {/* Selected State Detail Panel */}
                {stateData && (
                    <div className="w-80 shrink-0 flex flex-col gap-4">
                        {/* State Header */}
                        <div className="p-5 bg-slate-900 border-2 border-slate-700 rounded-2xl shadow-2xl shadow-black/50">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h4 className="text-2xl font-black text-white uppercase mb-1">{stateData.name}</h4>
                                    <span className="text-xs text-slate-500 font-mono">{stateData.code}</span>
                                </div>
                                <span className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase border ${stateData.status.includes('Legal') ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
                                        stateData.status === 'Decriminalized' ? 'bg-green-500/10 border-green-500/30 text-green-400' :
                                            stateData.status === 'Medical Only' ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' :
                                                stateData.status === 'Pending' ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' :
                                                    'bg-slate-500/10 border-slate-500/30 text-slate-400'
                                    }`}>
                                    {stateData.status}
                                </span>
                            </div>

                            {/* Details */}
                            <div className="space-y-3 pt-3 border-t border-slate-700">
                                <div>
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                                        License Requirement
                                    </span>
                                    <span className="text-sm font-medium text-slate-300">{stateData.license}</span>
                                </div>

                                {stateData.keyForm && (
                                    <div>
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                                            Key Form
                                        </span>
                                        <span className="text-sm font-medium text-indigo-400">{stateData.keyForm}</span>
                                    </div>
                                )}
                            </div>

                            {/* View News Button */}
                            <button
                                onClick={() => navigate(`/news?search=${stateData.name}`)}
                                className="w-full mt-4 px-4 py-3 bg-primary/10 hover:bg-primary/20 border border-primary/30 hover:border-primary/50 rounded-lg text-xs font-bold text-primary hover:text-white uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                            >
                                <ExternalLink className="w-3.5 h-3.5" />
                                View {stateData.code} News
                            </button>
                        </div>

                        {/* System Status */}
                        <div className="p-4 bg-slate-900 rounded-xl border-2 border-slate-700 flex items-center gap-3 shadow-lg">
                            <Radio className="w-4 h-4 text-amber-500 animate-pulse" />
                            <div className="flex-1">
                                <p className="text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-0.5">
                                    System Status
                                </p>
                                <p className="text-[10px] text-slate-500 leading-tight">
                                    Monitoring 52 legislative bodies for regulatory changes.
                                </p>
                            </div>
                            <Activity className="w-4 h-4 text-emerald-500" />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
