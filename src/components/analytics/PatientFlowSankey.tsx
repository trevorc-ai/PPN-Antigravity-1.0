import React, { useMemo } from 'react';
import { Sankey, Tooltip, ResponsiveContainer, Layer, Rectangle } from 'recharts';
import { GitMerge, Info, BarChart2 } from 'lucide-react';
import { ChartSkeleton } from './ChartSkeleton';
import { usePatientFlow, FLOW_MIN_N } from '../../hooks/usePatientFlow';

/**
 * WO-679: PatientFlowSankey — Live Data
 *
 * Stage funnel built from session_status counts in log_clinical_records.
 * Zero-state if < FLOW_MIN_N sessions.
 */

// ── Same tooltip content structure as before, typed ──────────────────────────
const SankeyTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: { name?: string; source?: { name: string }; target?: { name: string }; value?: number }; value?: number }> }) => {
    if (!active || !payload?.length) return null;
    const data = payload[0];
    const isNode = data.payload.name && !data.payload.source;

    return (
        <div className="bg-[#0f172a] border border-slate-700 p-3 rounded-xl shadow-2xl backdrop-blur-md z-50">
            {isNode ? (
                <>
                    <p className="ppn-meta font-black text-slate-500 uppercase tracking-widest mb-1">Clinical Stage</p>
                    <span className="ppn-meta font-bold text-slate-300">{data.payload.name}</span>
                    <div className="mt-2 pt-2 border-t border-slate-800">
                        <span className="ppn-meta text-slate-500">Volume: {data.value ?? 0} sessions</span>
                    </div>
                </>
            ) : (
                <>
                    <div className="flex items-center gap-2 mb-2 border-b border-slate-700/50 pb-2">
                        <span className="ppn-meta font-black text-slate-300 uppercase tracking-widest">
                            {data.payload.source?.name} → {data.payload.target?.name}
                        </span>
                    </div>
                    <div className="flex justify-between gap-4">
                        <span className="ppn-meta font-bold text-slate-500 uppercase tracking-wide">Advancing:</span>
                        <span className="ppn-meta font-black text-emerald-400">{data.value} sessions</span>
                    </div>
                </>
            )}
        </div>
    );
};

const CustomNode = ({ x, y, width, height, index, payload, containerWidth }: {
    x?: number; y?: number; width?: number; height?: number;
    index?: number; payload?: { name?: string }; containerWidth?: number;
}) => (
    <Layer key={`custom-node-${index}`}>
        <Rectangle
            x={x} y={y} width={width} height={height}
            fill="#334155" fillOpacity={0.9} stroke="#475569" strokeWidth={1}
            radius={[4, 4, 4, 4]}
        />
        <text
            x={(x ?? 0) < (containerWidth ?? 400) / 2 ? (x ?? 0) + (width ?? 0) + 6 : (x ?? 0) - 6}
            y={(y ?? 0) + (height ?? 0) / 2}
            textAnchor={(x ?? 0) < (containerWidth ?? 400) / 2 ? 'start' : 'end'}
            dominantBaseline="middle"
            fill="#94a3b8"
            fontSize={11}
            fontWeight={700}
            style={{ pointerEvents: 'none', textShadow: '0 1px 2px rgba(0,0,0,0.9)' }}
        >
            {payload?.name}
        </text>
    </Layer>
);

const FlowZeroState = ({ totalSessions, error }: { totalSessions: number; error: string | null }) => (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 py-8">
        <div className="w-12 h-12 rounded-2xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-center">
            <BarChart2 className="w-6 h-6 text-slate-500" />
        </div>
        {error ? (
            <p className="ppn-body text-slate-500 text-center max-w-xs">{error}</p>
        ) : (
            <>
                <h3 className="ppn-card-title text-slate-300 text-center">Insufficient session data</h3>
                <p className="ppn-body text-slate-500 text-center max-w-xs">
                    Need {FLOW_MIN_N} sessions to render the retention flow.
                    {totalSessions > 0 && (
                        <> You have <strong className="text-slate-300">{totalSessions}</strong> so far.</>
                    )}
                </p>
            </>
        )}
    </div>
);

const PatientFlowSankey: React.FC = () => {
    const { sankeySupressed, totalSessions, flowEdges, loading, error } = usePatientFlow();

    const sankeyData = useMemo(() => {
        if (!flowEdges.length) return { nodes: [], links: [] };

        const nodeLabels = Array.from(new Set(flowEdges.flatMap(e => [e.source, e.target])));
        const nodes = nodeLabels.map(name => ({ name }));

        const links = flowEdges.map(edge => ({
            source: nodes.findIndex(n => n.name === edge.source),
            target: nodes.findIndex(n => n.name === edge.target),
            value: edge.value,
        })).filter(l => l.source !== -1 && l.target !== -1 && l.source !== l.target);

        return { nodes, links };
    }, [flowEdges]);

    return (
        <div className="bg-[#0a0c10] border border-slate-800 rounded-[2.5rem] p-6 sm:p-8 shadow-xl flex flex-col h-full relative overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-start mb-6 relative z-10">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <div className="size-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500 border border-indigo-500/20">
                            <GitMerge size={18} />
                        </div>
                        <h3 className="ppn-card-title text-slate-300">Retention Flow</h3>
                    </div>
                    <p className="ppn-meta font-bold text-slate-500 uppercase tracking-widest ml-1">
                        Stage Drop-Off Analysis · Live Data
                    </p>
                </div>
                <div className="group/info relative">
                    <Info size={16} className="text-slate-600 hover:text-slate-300 transition-colors cursor-help" />
                    <div className="absolute right-0 top-6 w-60 p-3 bg-slate-900 border border-slate-700 rounded-xl ppn-meta text-slate-300 opacity-0 group-hover/info:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl">
                        Sankey shows patient session throughput at each clinical stage. Width = volume.
                        Derived from <code className="text-indigo-400">session_status</code> in live records.
                    </div>
                </div>
            </div>

            {/* Loading */}
            {loading && <ChartSkeleton height="280px" />}

            {/* Zero state */}
            {!loading && (sankeySupressed || error) && (
                <FlowZeroState totalSessions={totalSessions} error={error} />
            )}

            {/* Live Sankey */}
            {!loading && !sankeySupressed && !error && sankeyData.nodes.length > 0 && (
                <>
                    <div className="flex-1 w-full min-h-[280px] relative z-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <Sankey
                                data={sankeyData}
                                node={<CustomNode />}
                                nodePadding={50}
                                margin={{ left: 10, right: 10, top: 10, bottom: 10 }}
                                link={{ stroke: '#64748b', strokeOpacity: 0.3 }}
                            >
                                <Tooltip content={<SankeyTooltip />} cursor={{ fill: 'transparent' }} />
                            </Sankey>
                        </ResponsiveContainer>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-800 flex items-center gap-2">
                        <div className="size-1.5 rounded-full bg-indigo-500" />
                        <p className="ppn-meta text-slate-500 uppercase tracking-widest">
                            {totalSessions} total sessions · Live data from session_status
                        </p>
                    </div>
                </>
            )}
        </div>
    );
};

export default PatientFlowSankey;
