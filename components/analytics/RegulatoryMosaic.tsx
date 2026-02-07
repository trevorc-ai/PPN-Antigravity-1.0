import React, { useState } from 'react';
import { Map, Radio, AlertTriangle, Activity, Lock, CheckCircle, FileText } from 'lucide-react';

interface StateData {
    id: string;
    code: string;
    name: string;
    status: 'Legal' | 'Decriminalized' | 'Active Legislation' | 'Restricted';
    measure: string;
    license: string;
    signal: string;
    color: string;
    pulse: boolean;
}

const states: StateData[] = [
    {
        id: 'OR',
        code: 'OR',
        name: 'Oregon',
        status: 'Legal',
        measure: 'MEASURE 109',
        license: 'FACILITATOR REQ',
        signal: '2026 Tax Revenue: $4.2M',
        color: 'bg-emerald-500',
        pulse: true
    },
    {
        id: 'CO',
        code: 'CO',
        name: 'Colorado',
        status: 'Decriminalized',
        measure: 'PROP 122',
        license: 'HEALING CENTER (PENDING)',
        signal: 'Personal Use Limits Active',
        color: 'bg-amber-500',
        pulse: true
    },
    {
        id: 'CA',
        code: 'CA',
        name: 'California',
        status: 'Active Legislation',
        measure: 'SB-58 (VETOED)',
        license: 'RESEARCH ONLY',
        signal: 'Local Decrim (Oakland/SF)',
        color: 'bg-blue-500',
        pulse: false
    },
    {
        id: 'WA',
        code: 'WA',
        name: 'Washington',
        status: 'Active Legislation',
        measure: 'SB-5263',
        license: 'PILOT PROGRAM',
        signal: 'Health Committee Review',
        color: 'bg-blue-500',
        pulse: false
    },
    {
        id: 'NY',
        code: 'NY',
        name: 'New York',
        status: 'Active Legislation',
        measure: 'A114',
        license: 'MEDICAL MODEL',
        signal: 'Assembly Debate Scheduled',
        color: 'bg-blue-500',
        pulse: false
    },
    {
        id: 'TX',
        code: 'TX',
        name: 'Texas',
        status: 'Restricted',
        measure: 'HB-1802',
        license: 'CLINICAL TRIALS',
        signal: 'Veterans PTSD Study',
        color: 'bg-slate-600',
        pulse: false
    }
];

const newsFeed = [
    { id: 1, source: 'FDA-CDER', event: 'Advisory: Psilocybin Risks', time: '2h ago', level: 'warning' },
    { id: 2, source: 'DEA-HQ', event: 'Hearing: Rescheduling Docket', time: '5h ago', level: 'critical' },
    { id: 3, source: 'MAPS-PBC', event: 'New Phase 3 Data Released', time: '1d ago', level: 'info' },
    { id: 4, source: 'OR-OHA', event: 'License Cap Reached', time: '2d ago', level: 'neutral' }
];

export default function RegulatoryMosaic() {
    const [selectedState, setSelectedState] = useState<StateData>(states[0]);

    return (
        <div className="bg-[#0f1218] border border-slate-800 rounded-3xl p-6 h-full flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                    <Map className="w-5 h-5 text-indigo-500" />
                    <h3 className="text-sm font-black text-slate-200 uppercase tracking-widest">Regulatory Mosaic</h3>
                </div>
                <div className="flex items-center gap-2 px-2 py-1 bg-slate-800/50 rounded-lg border border-slate-700">
                    <Radio className="w-3 h-3 text-emerald-500 animate-pulse" />
                    <span className="text-[9px] font-mono text-emerald-500 font-bold">SIGNAL_LIVE</span>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
                {/* Visual Grid (60%) */}
                <div className="flex-[3] flex flex-col gap-4">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {states.map((state) => {
                            const isSelected = selectedState.id === state.id;
                            const isActive = state.status === 'Legal' || state.status === 'Decriminalized';

                            return (
                                <button
                                    key={state.id}
                                    onClick={() => setSelectedState(state)}
                                    className={`relative p-4 rounded-xl border transition-all duration-300 text-left group overflow-hidden ${isSelected
                                            ? 'bg-slate-800 border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.2)]'
                                            : 'bg-[#0a0c10] border-slate-800 hover:border-slate-600'
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <span className={`font-black text-lg ${isSelected ? 'text-white' : 'text-slate-400'}`}>
                                            {state.code}
                                        </span>
                                        <div className={`w-2 h-2 rounded-full ${state.color} ${state.pulse ? 'animate-pulse shadow-[0_0_8px_currentColor]' : ''}`} />
                                    </div>
                                    <div className="space-y-0.5">
                                        <span className="text-[9px] uppercase tracking-wider text-slate-500 block">Status</span>
                                        <span className={`text-[10px] font-bold uppercase truncate block ${isActive ? 'text-slate-200' : 'text-slate-500'}`}>
                                            {state.status}
                                        </span>
                                    </div>

                                    {/* Tactical Corner Markers */}
                                    {isSelected && (
                                        <>
                                            <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-indigo-500" />
                                            <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-indigo-500" />
                                        </>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* HUD / Detail Panel */}
                    <div className="mt-auto bg-slate-900/50 border border-slate-800 rounded-xl p-4 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500" />
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h4 className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1">Jurisdiction</h4>
                                <p className="text-xl font-black text-white">{selectedState.name}</p>
                                <div className="mt-2 flex items-center gap-2">
                                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border bg-opacity-10 ${selectedState.status === 'Legal' ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500' :
                                            selectedState.status === 'Decriminalized' ? 'text-amber-400 border-amber-500/30 bg-amber-500' :
                                                selectedState.status === 'Active Legislation' ? 'text-blue-400 border-blue-500/30 bg-blue-500' :
                                                    'text-slate-400 border-slate-500/30 bg-slate-500'
                                        }`}>
                                        {selectedState.measure}
                                    </span>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div>
                                    <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                                        <Lock className="w-3 h-3" /> License Model
                                    </span>
                                    <p className="text-xs font-bold text-slate-300 mt-0.5">{selectedState.license}</p>
                                </div>
                                <div>
                                    <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                                        <Activity className="w-3 h-3" /> External Signal
                                    </span>
                                    <p className="text-xs font-medium text-emerald-400 mt-0.5">{selectedState.signal}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Live Feed (40%) */}
                <div className="flex-[2] bg-[#0a0c10] rounded-xl border border-slate-800 flex flex-col overflow-hidden">
                    <div className="p-3 border-b border-slate-800 bg-slate-900/30 flex items-center justify-between">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Intercepted Signals</span>
                        <div className="flex gap-1">
                            <span className="w-1 h-1 rounded-full bg-emerald-500 animate-ping" />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
                        {newsFeed.map((news) => (
                            <div key={news.id} className="p-2 rounded border border-slate-800/50 bg-[#0f1218] hover:border-slate-700 transition-colors group">
                                <div className="flex justify-between items-start mb-1">
                                    <span className="text-[9px] font-mono text-indigo-400 group-hover:text-indigo-300 transition-colors">{news.source}</span>
                                    <span className="text-[9px] text-slate-600 font-mono">{news.time}</span>
                                </div>
                                <p className="text-[11px] font-bold text-slate-300 leading-snug">{news.event}</p>
                                {news.level === 'warning' && (
                                    <div className="mt-1.5 flex items-center gap-1">
                                        <AlertTriangle className="w-3 h-3 text-amber-500" />
                                        <span className="text-[9px] text-amber-500 font-bold uppercase">Advisory</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="p-2 border-t border-slate-800 bg-slate-900/30">
                        <div className="flex items-center gap-2 opacity-50">
                            <Activity className="w-3 h-3 text-slate-500" />
                            <span className="text-[9px] font-mono text-slate-500">Scanning...</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
