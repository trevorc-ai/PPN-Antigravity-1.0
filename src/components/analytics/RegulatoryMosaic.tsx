import React, { useState } from 'react';
import {
    Map, Radio, AlertTriangle, Activity, Lock, CheckCircle,
    FileText, TrendingUp, DollarSign, Scale, Globe
} from 'lucide-react';

// --- MOCK DATA ---
interface StateData {
    id: string;
    name: string;
    status: 'Legal' | 'Decriminalized' | 'Medical' | 'Restricted';
    measure: string;
    color: string;
    details: {
        license_cost: string;
        tax_revenue: string;
        provider_count: number;
        outlook: 'Positive' | 'Neutral' | 'Negative';
        next_vote?: string;
    };
    news: {
        date: string;
        title: string;
        type: 'alert' | 'info' | 'success';
    }[];
}

const STATES: StateData[] = [
    {
        id: 'OR', name: 'Oregon', status: 'Legal', measure: 'Measure 109', color: 'bg-emerald-500',
        details: { license_cost: '$10,000/yr', tax_revenue: '$4.2M (Proj)', provider_count: 312, outlook: 'Positive' },
        news: [
            { date: '2h ago', title: 'OHA updates facilitator testing requirements', type: 'info' },
            { date: '1d ago', title: 'New service center opens in Bend', type: 'success' }
        ]
    },
    {
        id: 'CO', name: 'Colorado', status: 'Decriminalized', measure: 'Prop 122', color: 'bg-amber-500',
        details: { license_cost: 'Pending', tax_revenue: 'N/A', provider_count: 0, outlook: 'Positive', next_vote: '2025 Rules' },
        news: [
            { date: '4h ago', title: 'Advisory Board submits final recs', type: 'info' },
            { date: '2d ago', title: 'Personal use limits defined', type: 'alert' }
        ]
    },
    {
        id: 'CA', name: 'California', status: 'Medical', measure: 'SB-58 (Vetoed)', color: 'bg-blue-500',
        details: { license_cost: 'N/A', tax_revenue: 'N/A', provider_count: 0, outlook: 'Neutral', next_vote: 'Nov 2026' },
        news: [
            { date: '1w ago', title: 'Governor calls for new therapeutic bill', type: 'info' }
        ]
    },
    {
        id: 'TX', name: 'Texas', status: 'Medical', measure: 'HB 1802', color: 'bg-blue-500',
        details: { license_cost: 'Research Only', tax_revenue: 'N/A', provider_count: 2, outlook: 'Neutral' },
        news: []
    },
    {
        id: 'WA', name: 'Washington', status: 'Restricted', measure: 'SB 5263', color: 'bg-slate-600',
        details: { license_cost: 'N/A', tax_revenue: 'N/A', provider_count: 0, outlook: 'Negative' },
        news: []
    },
    {
        id: 'NY', name: 'New York', status: 'Restricted', measure: 'Assembly A114', color: 'bg-slate-600',
        details: { license_cost: 'N/A', tax_revenue: 'N/A', provider_count: 0, outlook: 'Neutral' },
        news: []
    }
];

const GLOBAL_NEWS = [
    { source: 'FDA', time: '14m ago', event: 'Breakthrough Status reviewed for COMP360', level: 'info' },
    { source: 'DEA', time: '2h ago', event: 'Scheduled hearing on rescheduling metrics', level: 'warning' },
    { source: 'MAPS', time: '5h ago', event: 'Phase 3b results published in Nature', level: 'success' },
    { source: 'JAMA', time: '1d ago', event: 'Study confirms safety profile in older adults', level: 'info' },
];

export default function RegulatoryMosaic() {
    const [selectedState, setSelectedState] = useState<StateData | null>(STATES[0]);

    return (
        <div className="bg-[#0f1218] border border-slate-800 rounded-3xl p-6 h-[600px] flex flex-col md:flex-row gap-6 relative overflow-hidden shadow-2xl">

            {/* LEFT: Map Grid */}
            <div className="flex-1 flex flex-col min-w-0">
                <div className="flex items-center justify-between mb-6 shrink-0">
                    <div>
                        <h3 className="text-lg font-black text-white uppercase tracking-tighter flex items-center gap-2">
                            <Map className="w-5 h-5 text-indigo-500" />
                            Regulatory Mosaic
                        </h3>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                            Jurisdiction Status • Live Signals
                        </p>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase">
                        <span className="flex items-center gap-1 text-emerald-400"><span className="size-2 bg-emerald-500 rounded-full"></span> Legal</span>
                        <span className="flex items-center gap-1 text-amber-400"><span className="size-2 bg-amber-500 rounded-full"></span> Decrim</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                    {STATES.map((state) => (
                        <button
                            key={state.id}
                            onClick={() => setSelectedState(state)}
                            className={`p-4 rounded-xl border transition-all text-left relative overflow-hidden group ${selectedState?.id === state.id
                                    ? 'bg-slate-800 border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.2)]'
                                    : 'bg-slate-900/50 border-slate-800 hover:border-slate-600'
                                }`}
                        >
                            <div className={`absolute top-0 left-0 w-1 h-full ${state.color} transition-opacity duration-300 ${selectedState?.id === state.id ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}`}></div>
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-2xl font-black text-slate-200">{state.id}</span>
                                {state.status === 'Legal' && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                                {state.status === 'Restricted' && <Lock className="w-4 h-4 text-slate-600" />}
                            </div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">{state.name}</p>
                            <p className={`text-[9px] font-mono mt-1 ${state.status === 'Legal' ? 'text-emerald-400' :
                                    state.status === 'Decriminalized' ? 'text-amber-400' : 'text-slate-500'
                                }`}>
                                {state.status}
                            </p>
                        </button>
                    ))}
                </div>

                {/* Selected State Detail View */}
                {selectedState && (
                    <div key={selectedState.id} className="mt-auto p-5 bg-slate-900/80 border border-slate-700 rounded-2xl animate-in slide-in-from-bottom-4 fade-in duration-300">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h4 className="text-xl font-black text-white uppercase flex items-center gap-2">
                                    {selectedState.name}
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border bg-opacity-10 ${selectedState.status === 'Legal' ? 'bg-emerald-500 border-emerald-500 text-emerald-400' :
                                            selectedState.status === 'Decriminalized' ? 'bg-amber-500 border-amber-500 text-amber-400' :
                                                'bg-slate-500 border-slate-500 text-slate-400'
                                        }`}>{selectedState.status}</span>
                                </h4>
                                <span className="text-xs text-indigo-400 font-mono tracking-tight">{selectedState.measure}</span>
                            </div>
                            <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${selectedState.details.outlook === 'Positive' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                                    selectedState.details.outlook === 'Negative' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                                        'bg-slate-700/50 border-slate-600 text-slate-400'
                                }`}>
                                {selectedState.details.outlook} Outlook
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-black/20 rounded-lg border border-slate-800/50">
                                <div className="flex items-center gap-2 mb-1 text-slate-500">
                                    <DollarSign className="w-3 h-3" />
                                    <span className="text-[10px] font-bold uppercase tracking-wider">Licensing Cost</span>
                                </div>
                                <p className="text-sm font-mono text-slate-200 font-medium">{selectedState.details.license_cost}</p>
                            </div>
                            <div className="p-3 bg-black/20 rounded-lg border border-slate-800/50">
                                <div className="flex items-center gap-2 mb-1 text-slate-500">
                                    <Scale className="w-3 h-3" />
                                    <span className="text-[10px] font-bold uppercase tracking-wider">Active Providers</span>
                                </div>
                                <p className="text-sm font-mono text-slate-200 font-medium">{selectedState.details.provider_count}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* RIGHT: Live Signal Feed */}
            <div className="w-full md:w-80 border-l border-slate-800 md:pl-6 flex flex-col shrink-0">
                <div className="flex items-center gap-2 mb-6 shrink-0">
                    <Radio className="w-5 h-5 text-amber-500 animate-pulse" />
                    <h3 className="text-sm font-black text-white uppercase tracking-widest">Intercepted Signals</h3>
                </div>

                <div className="flex-1 overflow-y-auto space-y-3 pr-2 -mr-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                    {/* Selected State News */}
                    {selectedState?.news.length > 0 && (
                        <div className="mb-4 space-y-3">
                            <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest sticky top-0 bg-[#0f1218] py-1 z-10 border-b border-indigo-500/20 mb-2">
                                {selectedState.id} Wire
                            </div>
                            {selectedState.news.map((news, i) => (
                                <div key={`state-news-${i}`} className="p-3 bg-indigo-500/5 border border-indigo-500/20 rounded-xl relative group animate-in slide-in-from-right-2 fade-in duration-500" style={{ animationDelay: `${i * 100}ms` }}>
                                    <div className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]"></div>
                                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">{news.date}</span>
                                    <p className="text-[11px] font-medium text-slate-300 leading-snug">{news.title}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Global News Stream */}
                    <div className="space-y-3">
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest sticky top-0 bg-[#0f1218] py-1 z-10 border-b border-slate-800 mb-2">
                            Global Stream
                        </div>
                        {GLOBAL_NEWS.map((news, i) => (
                            <div key={`global-${i}`} className="p-3 bg-slate-900/50 border border-slate-800 rounded-xl hover:border-slate-600 transition-colors cursor-default group">
                                <div className="flex justify-between items-start mb-1">
                                    <span className={`text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded border bg-opacity-10 ${news.level === 'warning' ? 'text-amber-500 border-amber-500 bg-amber-500' :
                                            news.level === 'success' ? 'text-emerald-500 border-emerald-500 bg-emerald-500' : 'text-slate-400 border-slate-600 bg-slate-600'
                                        }`}>
                                        {news.source}
                                    </span>
                                    <span className="text-[9px] text-slate-600 font-mono">{news.time}</span>
                                </div>
                                <p className="text-[11px] font-medium text-slate-400 leading-snug group-hover:text-slate-300 transition-colors">{news.event}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-4 p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center gap-3 shrink-0">
                    <Activity className="w-4 h-4 text-emerald-500" />
                    <p className="text-[10px] text-slate-500 leading-tight">
                        <strong className="text-slate-300 block mb-0.5">System Status</strong>
                        Monitoring 52 legislative bodies.
                    </p>
                </div>
            </div>
        </div>
    );
}
