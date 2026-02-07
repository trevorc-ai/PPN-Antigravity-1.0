
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
  ReferenceLine
} from 'recharts';
import { MOCK_JOURNEY_DATA } from '../../constants/analyticsData';
import { Pill, Brain, AlertTriangle, FileText, CalendarCheck, Info } from 'lucide-react';

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const isEvent = data.type !== 'assessment';

    return (
      <div className="bg-[#0f172a] border border-slate-700 p-3 rounded-xl shadow-2xl backdrop-blur-md z-50">
        <div className="flex items-center gap-2 mb-2 border-b border-slate-700/50 pb-2">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">{data.displayDate}</span>
          {isEvent && (
            <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${data.type === 'dose' ? 'bg-cyan-500/10 text-cyan-500' :
                data.type === 'safety' ? 'bg-amber-500/10 text-amber-500' :
                  'bg-indigo-500/10 text-indigo-500'
              }`}>
              {data.type}
            </span>
          )}
        </div>

        <div className="space-y-1">
          <p className="text-xs font-bold text-white leading-tight">{data.label}</p>
          {data.score !== null ? (
            <div className="flex justify-between gap-4 mt-1">
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wide">Score:</span>
              <span className="text-[10px] text-primary font-mono font-black">{data.score} / 27</span>
            </div>
          ) : (
            <div className="flex justify-between gap-4 mt-1">
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wide">Value:</span>
              <span className="text-[10px] text-slate-300 font-mono font-bold">{data.value}</span>
            </div>
          )}
          {data.details && (
            <p className="text-[9px] text-slate-500 italic mt-2 border-t border-slate-800 pt-2 leading-relaxed max-w-[200px]">
              "{data.details}"
            </p>
          )}
        </div>
      </div>
    );
  }
  return null;
};

const CustomEventDot = (props: any) => {
  const { cx, cy, payload } = props;
  const size = 20;
  const x = cx - size / 2;
  const y = cy - size / 2;

  // Icon mapping based on event type
  const getIcon = () => {
    switch (payload.type) {
      case 'dose': return <Pill size={14} className="text-cyan-950" />;
      case 'integration': return <Brain size={14} className="text-indigo-950" />;
      case 'safety': return <AlertTriangle size={14} className="text-amber-950" />;
      default: return <CalendarCheck size={14} className="text-slate-950" />;
    }
  };

  const getBgColor = () => {
    switch (payload.type) {
      case 'dose': return '#06b6d4'; // cyan-500
      case 'integration': return '#8b5cf6'; // violet-500
      case 'safety': return '#f59e0b'; // amber-500
      default: return '#64748b'; // slate-500
    }
  };

  if (payload.type === 'assessment') return null; // Don't render scatter dot for assessments (Line handles it)

  return (
    <foreignObject x={x} y={y} width={size} height={size} style={{ overflow: 'visible' }}>
      <div
        className="flex items-center justify-center rounded-full shadow-lg border border-white/20 transition-transform hover:scale-125 cursor-pointer"
        style={{
          width: size,
          height: size,
          backgroundColor: getBgColor()
        }}
      >
        {getIcon()}
      </div>
    </foreignObject>
  );
};

const PatientJourneySnapshot: React.FC = () => {

  // ETL: Normalize data for Recharts composed view
  const chartData = useMemo(() => {
    return MOCK_JOURNEY_DATA.map(item => {
      let score = null;
      let eventY = null;

      // Logic: 
      // - If type is 'assessment', parse the Score for the Line Chart (Y-Axis).
      // - If type is NOT 'assessment', assign a fixed Y value (e.g., 0) for the Scatter Plot timeline.

      if (item.type === 'assessment') {
        // Parse "Score: 12" -> 12
        const match = item.value?.toString().match(/\d+/);
        score = match ? parseInt(match[0]) : null;
      } else {
        eventY = 0; // Events sit on the baseline
      }

      return {
        ...item,
        displayDate: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        score,
        eventY
      };
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, []);

  return (
    <div className="bg-[#0a0c10] border border-slate-800 rounded-[2.5rem] p-6 sm:p-8 shadow-xl flex flex-col h-full relative overflow-hidden group">

      {/* Header */}
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
              <FileText size={18} />
            </div>
            <h3 className="text-lg font-black text-white tracking-tight">Clinical Journey</h3>
          </div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Intervention Timeline & Outcome (PHQ-9)</p>
        </div>

        <div className="group/info relative">
          <Info size={16} className="text-slate-600 hover:text-slate-400 transition-colors cursor-help" />
          <div className="absolute right-0 top-6 w-56 p-3 bg-slate-900 border border-slate-700 rounded-xl text-[10px] text-slate-400 opacity-0 group-hover/info:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl">
            Composed chart correlating symptom scores (Line) with discrete clinical events (Timeline Dots).
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1 w-full min-h-[300px] relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
            <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" vertical={false} opacity={0.5} />

            <XAxis
              dataKey="displayDate"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }}
              dy={10}
            />

            <YAxis
              yAxisId="left"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }}
              domain={[0, 27]}
              label={{ value: 'Severity (PHQ-9)', angle: -90, position: 'insideLeft', fill: '#475569', fontSize: 9, fontWeight: 900, dy: 40 }}
            />

            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }} />

            {/* Threshold Line for Remission */}
            <ReferenceLine y={5} yAxisId="left" stroke="#10b981" strokeDasharray="3 3" strokeOpacity={0.5} label={{ value: 'Remission (<5)', fill: '#10b981', fontSize: 9, position: 'insideTopRight' }} />

            {/* Layer 1: Symptom Line */}
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

            {/* Layer 2: Event Timeline */}
            <Scatter
              yAxisId="left"
              dataKey="eventY"
              shape={<CustomEventDot />}
            />

          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Legend */}
      <div className="mt-2 pt-4 border-t border-slate-800 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="size-2 rounded-full bg-cyan-500"></div>
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Dosing</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="size-2 rounded-full bg-indigo-500"></div>
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Integration</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="size-2 rounded-full bg-amber-500"></div>
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Safety Check</span>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <div className="w-4 h-0.5 bg-blue-500"></div>
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Symptom Score</span>
        </div>
      </div>

    </div>
  );
};

export default PatientJourneySnapshot;
