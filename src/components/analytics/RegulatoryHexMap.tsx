import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { DEFAULT_STATES } from './mockStateData';
import {
    Map as MapIcon,
    Search,
    ExternalLink,
    CheckCircle,
    XCircle,
    AlertTriangle,
    Filter,
    ChevronRight,
    Loader2,
    Activity
} from 'lucide-react';

// --- Types ---
export type RegulatoryStatus = 'Legal (Regulated)' | 'Decriminalized' | 'Medical Only' | 'Illegal' | 'Pending';

export interface StateData {
    id: string; // "OR", "WA"
    name: string;
    status: RegulatoryStatus;
    license: string;
    keyForm?: string; // e.g. "Consent for Touch"
    formUrl?: string; // URL to the Google Drive PDF
    news_count: number;
}

// Fallback Data (used while loading or on error)
const FALLBACK_STATES: Record<string, StateData> = {
    OR: { id: 'OR', name: 'Oregon', status: 'Legal (Regulated)', license: 'Facilitator Required', keyForm: 'Consent for Touch', news_count: 45 },
    // ... (rest of simple fallback data if needed, or initialized empty)
};

// Google Sheet CSV URL (Replace with the user's published sheet URL)
// For now, we will use a demo/placeholder structure, but the code is ready for the real URL.
const GOOGLE_SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR6.../pub?output=csv';

// Hex Grid Layout (offset coordinates) - same as before
const HEX_LAYOUT: Record<string, [number, number]> = {
    // Row 0
    AK: [0, 0], ME: [0, 11],
    // Row 1
    WA: [1, 1], ID: [1, 2], MT: [1, 3], ND: [1, 4], MN: [1, 5], WI: [1, 6], MI: [1, 7], NY: [1, 9], VT: [1, 10], NH: [1, 11],
    // Row 2
    OR: [2, 1], NV: [2, 2], WY: [2, 3], SD: [2, 4], IA: [2, 5], IL: [2, 6], IN: [2, 7], OH: [2, 8], PA: [2, 9], NJ: [2, 10], MA: [2, 11], RI: [2, 12],
    // Row 3 (shifted)
    CA: [3, 1], UT: [3, 2], CO: [3, 3], NE: [3, 4], MO: [3, 5], KY: [3, 6], WV: [3, 7], VA: [3, 8], MD: [3, 9], DE: [3, 10], CT: [3, 11],
    // Row 4
    AZ: [4, 2], NM: [4, 3], KS: [4, 4], AR: [4, 5], TN: [4, 6], NC: [4, 7], SC: [4, 8], DC: [4, 9],
    // Row 5
    OK: [5, 4], LA: [5, 5], MS: [5, 6], AL: [5, 7], GA: [5, 8],
    // Row 6
    HI: [6, 1], TX: [6, 4], FL: [6, 8]
};

// --- Helper Functions ---
const getStatusColor = (status: RegulatoryStatus) => {
    switch (status) {
        case 'Legal (Regulated)': return 'emerald';
        case 'Decriminalized': return 'lime';
        case 'Medical Only': return 'blue';
        case 'Pending': return 'amber';
        case 'Illegal': return 'slate';
        default: return 'slate';
    }
};

const StatusIcon = ({ status }: { status: RegulatoryStatus }) => {
    switch (status) {
        case 'Legal (Regulated)': return <CheckCircle className="w-5 h-5 text-emerald-400" />;
        case 'Decriminalized': return <CheckCircle className="w-5 h-5 text-lime-400" />;
        case 'Medical Only': return <Activity className="w-5 h-5 text-blue-400" />;
        case 'Pending': return <AlertTriangle className="w-5 h-5 text-amber-400" />;
        case 'Illegal': return <XCircle className="w-5 h-5 text-slate-500" />;
    }
}

export default function RegulatoryHexMap() {
    const navigate = useNavigate();
    const [statesData, setStatesData] = useState<Record<string, StateData>>(FALLBACK_STATES);
    const [loading, setLoading] = useState(false); // Using local data for now, set to true when real URL is ready
    const [selectedId, setSelectedId] = useState<string>('OR');
    const [filter, setFilter] = useState<RegulatoryStatus | 'All'>('All');

    // Fetch Data from Google Sheet
    useEffect(() => {
        // Uncomment this to enable real fetching once you have the published CSV URL
        /*
        setLoading(true);
        Papa.parse(GOOGLE_SHEET_URL, {
            download: true,
            header: true,
            complete: (results) => {
                const parsedStates: Record<string, StateData> = {};
                results.data.forEach((row: any) => {
                    if (row.id) {
                        parsedStates[row.id] = {
                            id: row.id,
                            name: row.name,
                            status: row.status as RegulatoryStatus,
                            license: row.license_info,
                            keyForm: row.form_name,
                            formUrl: row.form_url,
                            news_count: parseInt(row.news_count || '0')
                        };
                    }
                });
                setStatesData(parsedStates);
                setLoading(false);
            },
            error: (error) => {
                console.error("Error fetching sheet data:", error);
                setLoading(false);
            }
        });
        */

        // For development, we'll populate full map with the static data we had before
        // This ensures the map works fully while the sheet is being set up
        // For development, we'll populate full map with the static data we had before
        // This ensures the map works fully while the sheet is being set up
        setStatesData(DEFAULT_STATES);

    }, []);

    const activeState = statesData[selectedId];

    // Status Filters
    const STATUS_FILTERS: RegulatoryStatus[] = ['Legal (Regulated)', 'Decriminalized', 'Medical Only', 'Pending', 'Illegal'];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[500px] w-full bg-[#0B0E14] rounded-3xl border border-slate-800">
                <div className="text-center">
                    <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mx-auto mb-4" />
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Loading Regulatory Data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col lg:flex-row gap-6 h-full w-full bg-[#0B0E14] p-4 sm:p-6 rounded-3xl border border-slate-800/50 shadow-2xl">

            {/* LEFT: Map & Controls (Flexible, grows) */}
            <div className="flex-1 flex flex-col min-h-0 gap-6">

                {/* Header & Controls - Simplified */}
                <div className="flex flex-col xl:flex-row xl:items-center justify-start gap-6 shrink-0">
                    {/* Primary Control: Dropdown Selector */}
                    <div className="relative group w-full max-w-xs z-20">
                        <select
                            value={selectedId}
                            onChange={(e) => setSelectedId(e.target.value)}
                            className="w-full appearance-none bg-slate-900 border border-slate-700 hover:border-indigo-500 rounded-xl px-4 py-3 pr-10 text-white font-bold shadow-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer"
                        >
                            {Object.values(statesData).sort((a: any, b: any) => a.name.localeCompare(b.name)).map((state: StateData) => (
                                <option key={state.id} value={state.id}>
                                    {state.name} ({state.id})
                                </option>
                            ))}
                        </select>
                        <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none rotate-90" />
                    </div>

                    {/* Filters - Clean Buttons */}
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setFilter('All')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border ${filter === 'All' ? 'bg-white text-black border-white' : 'bg-transparent text-slate-400 border-slate-700 hover:border-slate-500 hover:text-white'}`}
                        >
                            All
                        </button>
                        {STATUS_FILTERS.map(s => {
                            const color = getStatusColor(s);
                            const isActive = filter === s;
                            return (
                                <button
                                    key={s}
                                    onClick={() => setFilter(isActive ? 'All' : s)}
                                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-all ${isActive
                                        ? `bg-${color}-500/20 border-${color}-500 text-${color}-400`
                                        : 'bg-transparent border-slate-800 text-slate-500 hover:border-slate-600 hover:text-slate-300'
                                        }`}
                                >
                                    {s.replace(' (Regulated)', '').replace(' Only', '')}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* THE MAP (Interactive Hex Grid) */}
                <div className="relative flex-1 bg-[#151921] rounded-2xl border border-slate-800/50 overflow-hidden p-4 sm:p-8 flex items-center justify-start min-h-[400px]">

                    {/* Background Grid Pattern - Subtle */}
                    <div className="absolute inset-0 opacity-5"
                        style={{ backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
                    </div>

                    <div className="relative w-full max-w-5xl aspect-[1.6/1]">
                        {Object.keys(HEX_LAYOUT).map(stateCode => {
                            const [row, col] = HEX_LAYOUT[stateCode];
                            const data = statesData[stateCode];
                            const isActive = selectedId === stateCode;
                            const isDimmed = filter !== 'All' && filter !== data?.status;

                            // Hex positioning logic
                            const x = col * 8 + (row % 2) * 4;
                            const y = row * 9;

                            // Color logic - Simplified for speed
                            let baseColor = 'slate';
                            if (data) baseColor = getStatusColor(data.status);

                            let colorClass = `bg-${baseColor}-900/40 border-${baseColor}-700/50 text-${baseColor}-400`;
                            if (isActive) colorClass = `bg-${baseColor}-600 text-white border-white scale-110 z-10 shadow-[0_0_20px_rgba(255,255,255,0.2)]`;
                            else if (isDimmed) colorClass = "bg-slate-900/20 border-slate-800/30 text-slate-700 opacity-40";
                            else colorClass += ` hover:bg-${baseColor}-800/60 hover:border-${baseColor}-400 hover:text-white hover:scale-105 hover:z-10`;

                            return (
                                <button
                                    key={stateCode}
                                    onClick={() => data && setSelectedId(stateCode)}
                                    style={{
                                        position: 'absolute',
                                        left: `${x}%`,
                                        top: `${y}%`,
                                        width: '7%',
                                        height: '10%'
                                    }}
                                    className={`
                                         hexagon-clip transition-all duration-150 ease-out flex items-center justify-center
                                         border-b-[3px] cursor-pointer group select-none
                                         ${colorClass}
                                     `}
                                >
                                    <span className={`text-[10px] sm:text-xs font-black tracking-tight ${isActive ? 'text-white' : ''}`}>{stateCode}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* RIGHT: Detail Panel (Simple & Fast) */}
            <div className="w-full lg:w-[360px] shrink-0 flex flex-col gap-4">

                {activeState ? (
                    <div className="flex-1 bg-[#151921] rounded-2xl border border-slate-800 overflow-hidden flex flex-col shadow-lg animate-in slide-in-from-right-4 duration-300">
                        {/* Header */}
                        <div className={`p-6 border-b border-slate-800/50 relative overflow-hidden`}>
                            <div className={`absolute top-0 right-0 p-3 opacity-10 pointer-events-none`}>
                                <span className="text-9xl font-black text-white">{activeState.id}</span>
                            </div>

                            <div className="relative z-10">
                                <h2 className="text-3xl font-black text-white tracking-tight mb-1">{activeState.name}</h2>
                                <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-${getStatusColor(activeState.status)}-500/10 border border-${getStatusColor(activeState.status)}-500/20`}>
                                    <StatusIcon status={activeState.status} />
                                    <span className={`text-xs font-bold uppercase tracking-wide text-${getStatusColor(activeState.status)}-400`}>
                                        {activeState.status}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Fast Facts */}
                        <div className="p-6 space-y-6">
                            <div>
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1 flex items-center gap-1">
                                    License Framework
                                    <span title="State-defined requirements for centers and facilitators" className="cursor-help text-slate-600 hover:text-slate-400">?</span>
                                </h4>
                                <p className="text-white font-medium text-base">{activeState.license}</p>
                            </div>

                            {activeState.keyForm && (
                                <div>
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Key Documentation</h4>
                                    <div className="flex items-center gap-2">
                                        <p className="text-indigo-300 font-medium text-base">{activeState.keyForm}</p>

                                        {/* Document Link */}
                                        {activeState.formUrl && (
                                            <a
                                                href={activeState.formUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center justify-center p-1.5 bg-indigo-500/20 hover:bg-indigo-500 rounded-md text-indigo-400 hover:text-white transition-colors"
                                                title="View Document"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div>
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Live Updates</h4>
                                <p className="text-emerald-400 font-medium text-sm flex items-center gap-2">
                                    <Activity className="w-3 h-3" />
                                    {activeState.news_count} Recent Activities
                                </p>
                            </div>
                        </div>

                        {/* Action - Sticky Bottom */}
                        <div className="mt-auto p-4 border-t border-slate-800 bg-slate-900/30">
                            <button
                                onClick={() => navigate(`/news?search=${activeState.name}`)}
                                className="w-full flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-black font-bold uppercase tracking-widest py-3 rounded-lg transition-colors text-xs"
                            >
                                View Intelligence Feed
                                <ExternalLink className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>
                ) : null}
            </div>

            <style>{`
                .hexagon-clip {
                    clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
                }
            `}</style>
        </div>
    );
}
