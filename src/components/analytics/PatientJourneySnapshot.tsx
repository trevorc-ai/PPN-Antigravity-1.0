import React, { useMemo } from 'react';
import {
    ComposedChart,
    Line,
    Scatter,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
} from 'recharts';
// WO-717: MOCK_JOURNEY_DATA import removed -- mock PHQ-9 decay data eliminated per DB-First policy.
import { Pill, Brain, AlertTriangle, FileText, CalendarCheck, Info } from 'lucide-react';
import { supabase } from '../../supabaseClient';
import { useDataCache } from '../../hooks/useDataCache';

/**
 * WO-680: PatientJourneySnapshot — Live Data
 *
 * Changes from WO-680:
 * 1. When a real sessionId is provided, events are fetched from log_safety_events
 *    (joined on session_id) instead of relying on phase2Events props.
 * 2. All phase band reference lines carry the mandatory sub-label:
 *    "Protocol-estimated timing. Not a pharmacokinetic measurement."
 * 3. The PHQ-9 symptom decay line still uses MOCK_JOURNEY_DATA when no real
 *    assessment data is available — this is explicitly labeled "Sample trajectory"
 *    in the chart header.
 */

// ── Live AE event fetcher ─────────────────────────────────────────────────────
interface LiveEvent {
    type: 'dose' | 'safety' | 'integration';
    label: string;
    date: string;
    value: string | null;
    details: string | null;
    displayDate: string;
    score: null;
    eventY: 0;
}

function useJourneyEvents(sessionId?: string): { events: LiveEvent[]; loading: boolean } {
    const { data, loading } = useDataCache(
        sessionId ? `journey-events-${sessionId}` : 'journey-events-empty',
        async () => {
            if (!sessionId || !/^[0-9a-f-]{36}$/i.test(sessionId)) {
                return { data: [], error: null };
            }
            try {
                const { data: safetyEvents, error } = await supabase
                    .from('log_safety_events')
                    .select([
                        'id',
                        'created_at',
                        'ref_safety_events(safety_event_name)',
                        'ctcae_grade',
                        'intervention_type_id',
                    ].join(','))
                    .eq('session_id', sessionId)
                    .order('created_at', { ascending: true });

                if (error) throw error;

                type SafetyEventRow = {
                    created_at: string;
                    ref_safety_events?: { safety_event_name?: string } | null;
                    ctcae_grade?: number | null;
                    intervention_type_id?: number | null;
                };
                const events: LiveEvent[] = (safetyEvents as unknown as SafetyEventRow[] || []).map((ev) => {
                    const date = ev.created_at;
                    const eventName = ev.ref_safety_events?.safety_event_name ?? 'Adverse Event';
                    const grade = ev.ctcae_grade;
                    const hasIntervention = ev.intervention_type_id != null;

                    return {
                        type: hasIntervention ? 'dose' : 'safety',
                        label: eventName,
                        date,
                        value: grade != null ? `CTCAE Grade ${grade}` : null,
                        details: grade != null ? `CTCAE Grade ${grade} adverse event` : null,
                        displayDate: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                        score: null,
                        eventY: 0 as const,
                    };
                });

                return { data: events, error: null };
            } catch (err: unknown) {
                const message = err instanceof Error ? err.message : 'Failed to load events';
                console.error('[useJourneyEvents] query failed:', message); // allow-console
                return { data: [], error: message };
            }
        },
        { ttl: 2 * 60 * 1000, enabled: !!sessionId }
    );

    return { events: data ?? [], loading };
}

// ── Custom tooltip ────────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: { type?: string; displayDate?: string; label?: string; score?: number | null; value?: string | null; details?: string | null } }> }) => {
    if (!active || !payload?.length) return null;
    const data = payload[0].payload;
    const isEvent = data.type !== 'assessment';

    return (
        <div className="bg-[#0f172a] border border-slate-700 p-3 rounded-xl shadow-2xl backdrop-blur-md z-50">
            <div className="flex items-center gap-2 mb-2 border-b border-slate-700/50 pb-2">
                <span className="ppn-meta font-mono text-slate-300 uppercase tracking-widest">{data.displayDate}</span>
                {isEvent && (
                    <span className={`ppn-meta font-black uppercase px-1.5 py-0.5 rounded ${
                        data.type === 'dose' ? 'bg-cyan-500/10 text-cyan-500' :
                        data.type === 'safety' ? 'bg-amber-500/10 text-amber-500' :
                        'bg-indigo-500/10 text-indigo-500'
                    }`}>
                        {data.type}
                    </span>
                )}
            </div>
            <div className="space-y-1">
                <p className="ppn-body font-bold text-slate-300 leading-tight">{data.label}</p>
                {data.score != null ? (
                    <div className="flex justify-between gap-4 mt-1">
                        <span className="ppn-meta font-bold text-slate-500 uppercase tracking-wide">Score:</span>
                        <span className="ppn-meta text-indigo-400 font-black">{data.score} / 27</span>
                    </div>
                ) : data.value ? (
                    <div className="flex justify-between gap-4 mt-1">
                        <span className="ppn-meta font-bold text-slate-500 uppercase tracking-wide">Value:</span>
                        <span className="ppn-meta text-slate-300 font-mono font-bold">{data.value}</span>
                    </div>
                ) : null}
                {data.details && (
                    <p className="ppn-meta text-slate-500 italic mt-2 border-t border-slate-800 pt-2 leading-relaxed max-w-[200px]">
                        "{data.details}"
                    </p>
                )}
            </div>
        </div>
    );
};

// ── Event dot ────────────────────────────────────────────────────────────────
const CustomEventDot = (props: { cx?: number; cy?: number; payload?: { type?: string } }) => {
    const { cx, cy, payload } = props;
    if (!cx || !cy) return null;
    const size = 20;
    const x = cx - size / 2;
    const y = cy - size / 2;

    if (payload?.type === 'assessment') return null;

    const getIcon = () => {
        switch (payload?.type) {
            case 'dose':        return <Pill size={14} className="text-cyan-950" />;
            case 'integration': return <Brain size={14} className="text-indigo-950" />;
            case 'safety':      return <AlertTriangle size={14} className="text-amber-950" />;
            default:            return <CalendarCheck size={14} className="text-slate-950" />;
        }
    };

    const getBgColor = () => {
        switch (payload?.type) {
            case 'dose':        return '#06b6d4';
            case 'integration': return '#8b5cf6';
            case 'safety':      return '#f59e0b';
            default:            return '#64748b';
        }
    };

    return (
        <foreignObject x={x} y={y} width={size} height={size} style={{ overflow: 'visible' }}>
            <div
                className="flex items-center justify-center rounded-full shadow-lg border border-white/20 transition-transform hover:scale-125 cursor-pointer"
                style={{ width: size, height: size, backgroundColor: getBgColor() }}
            >
                {getIcon()}
            </div>
        </foreignObject>
    );
};

// ── Main Component ────────────────────────────────────────────────────────────
interface PatientJourneySnapshotProps {
    sessionId?: string;
    /** @deprecated — WO-680: events now fetched from log_safety_events internally when sessionId is set */
    phase2Events?: Array<{ event_type?: string; event_timestamp?: string; metadata?: Record<string, unknown> }>;
}

const PatientJourneySnapshot: React.FC<PatientJourneySnapshotProps> = ({ sessionId }) => {
    const hasRealSession = !!(sessionId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(sessionId));
    const { events: liveEvents, loading: eventsLoading } = useJourneyEvents(hasRealSession ? sessionId : undefined);

    const chartData = useMemo(() => {
        // WO-717: Removed MOCK_JOURNEY_DATA blend. Live events only.
        // When no real session is connected, chartData is empty and the component
        // renders the zero-state below. MOCK_JOURNEY_DATA was fabricated PHQ-9 decay
        // data that could be mistaken for real patient outcomes -- DB-First policy violation.
        if (!hasRealSession || liveEvents.length === 0) return [];

        return liveEvents.map(item => {
            let score: number | null = null;
            let eventY: number | null = null;

            if ((item.type as string) === 'assessment') {
                const match = item.value?.toString().match(/\d+/);
                score = match ? parseInt(match[0]) : null;
            } else {
                eventY = 0;
            }

            return {
                ...item,
                displayDate: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                score,
                eventY,
            };
        }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }, [hasRealSession, liveEvents]);

    const isShowingSampleLine = false; // WO-717: mock data removed; always live or zero-state

    /**
     * MANDATORY WO-680: Protocol-estimated phase band label.
     * All reference lines that represent clinical phase windows must carry this sub-label.
     */
    const PROTOCOL_ESTIMATED_LABEL = 'Protocol-estimated timing. Not a pharmacokinetic measurement.';

    return (
        <div className="bg-[#0a0c10] border border-slate-800 rounded-[2.5rem] p-6 sm:p-8 shadow-xl flex flex-col h-full relative overflow-hidden group">
            {/* Header */}
            <div className="flex justify-between items-start mb-6 relative z-10">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <div className="size-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                            <FileText size={18} />
                        </div>
                        <h3 className="ppn-card-title text-slate-300">Clinical Journey</h3>
                    </div>
                    <p className="ppn-meta font-bold text-slate-500 uppercase tracking-widest ml-1">
                        Intervention Timeline &amp; Outcome (PHQ-9)
                        {isShowingSampleLine && (
                            <span className="ml-2 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 normal-case tracking-normal">
                                Sample trajectory
                            </span>
                        )}
                    </p>
                </div>

                <div className="group/info relative">
                    <Info size={16} className="text-slate-600 hover:text-slate-300 transition-colors cursor-help" />
                    <div className="absolute right-0 top-6 w-64 p-3 bg-slate-900 border border-slate-700 rounded-xl ppn-meta text-slate-300 opacity-0 group-hover/info:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl space-y-2">
                        <p>Composed chart correlating symptom scores (Line) with discrete clinical events (dots).</p>
                        <p className="text-amber-400/80 italic">{PROTOCOL_ESTIMATED_LABEL}</p>
                    </div>
                </div>
            </div>

            {/* Loading overlay */}
            {eventsLoading && (
                <div className="absolute top-6 right-14 flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                    <span className="ppn-meta text-slate-500">Loading live events…</span>
                </div>
            )}

            {/* Chart */}
            <div className="flex-1 w-full min-h-[300px] relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                        <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" vertical={false} opacity={0.5} />

                        <XAxis
                            dataKey="displayDate"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748b', fontSize: 12, fontWeight: 700 }}
                            dy={10}
                        />

                        <YAxis
                            yAxisId="left"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748b', fontSize: 12, fontWeight: 700 }}
                            domain={[0, 27]}
                            label={{ value: 'Severity (PHQ-9)', angle: -90, position: 'insideLeft', fill: '#475569', fontSize: 9, fontWeight: 900, dy: 40 }}
                        />

                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }} />

                        {/* Threshold line for remission */}
                        <ReferenceLine
                            y={5}
                            yAxisId="left"
                            stroke="#10b981"
                            strokeDasharray="3 3"
                            strokeOpacity={0.5}
                            label={{ value: 'Remission (<5)', fill: '#10b981', fontSize: 9, position: 'insideTopRight' }}
                        />

                        {/*
                         * WO-680 MANDATORY: Protocol-estimated phase band labels.
                         * These bands represent clinical protocol phases, NOT pharmacokinetic windows.
                         * All labels must include the protocol-estimated sub-label.
                         */}
                        <ReferenceLine
                            y={20}
                            yAxisId="left"
                            stroke="#6366f1"
                            strokeDasharray="2 4"
                            strokeOpacity={0.3}
                            label={{
                                value: `Onset window · ${PROTOCOL_ESTIMATED_LABEL}`,
                                fill: '#6366f1',
                                fontSize: 8,
                                position: 'insideTopLeft',
                            }}
                        />

                        {/* Real session with no live AE events note */}
                        {hasRealSession && liveEvents.length === 0 && !eventsLoading && (
                            <ReferenceLine
                                y={0}
                                yAxisId="left"
                                stroke="#475569"
                                strokeDasharray="2 4"
                                strokeOpacity={0.4}
                                label={{ value: 'No adverse events logged this session', fill: '#475569', fontSize: 9, position: 'insideTopLeft' }}
                            />
                        )}

                        {/* Symptom score line */}
                        <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="score"
                            stroke="#3b82f6"
                            strokeWidth={3}
                            dot={{ r: 4, fill: '#0a0c10', stroke: '#3b82f6', strokeWidth: 2 }}
                            activeDot={{ r: 6, fill: '#3b82f6', stroke: '#fff' }}
                            connectNulls={true}
                        />

                        {/* Event timeline dots */}
                        <Scatter yAxisId="left" dataKey="eventY" shape={<CustomEventDot />} />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>

            {/* Footer — legend + protocol-estimated disclaimer */}
            <div className="mt-2 pt-4 border-t border-slate-800 space-y-3">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-2">
                        <div className="size-2 rounded-full bg-cyan-500" />
                        <span className="ppn-meta font-black text-slate-500 uppercase tracking-widest">Dosing</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="size-2 rounded-full bg-indigo-500" />
                        <span className="ppn-meta font-black text-slate-500 uppercase tracking-widest">Integration</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="size-2 rounded-full bg-amber-500" />
                        <span className="ppn-meta font-black text-slate-500 uppercase tracking-widest">Safety Event</span>
                    </div>
                    <div className="flex items-center gap-2 ml-auto">
                        <div className="w-4 h-0.5 bg-blue-500" />
                        <span className="ppn-meta font-black text-slate-500 uppercase tracking-widest">PHQ-9 Score</span>
                    </div>
                </div>

                {/* Mandatory WO-680 protocol-estimated disclaimer */}
                <p className="ppn-caption text-slate-600 italic leading-snug">
                    † Phase bands are protocol-estimated timing only. Not a pharmacokinetic or biological measurement.
                    {isShowingSampleLine && ' PHQ-9 line shows sample trajectory data; connect a real session for live events.'}
                </p>
            </div>
        </div>
    );
};

export default PatientJourneySnapshot;
