
import React, { useMemo } from 'react';
import { 
  ComposedChart, 
  Line, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';
import { MOCK_TRAJECTORY_DATA } from '../../constants/analyticsData';
import { TrendingDown, Info } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const userScore = payload.find((p: any) => p.name === 'userScore')?.value;
    const rangeArray = payload.find((p: any) => p.name === 'Confidence Interval')?.value;
    const lowerBound = rangeArray ? rangeArray[0] : null;
    const upperBound = rangeArray ? rangeArray[1] : null;

    let status = 'typical';
    let statusText = 'Typical Response';
    let statusColor = 'text-blue-400';
    let insight = null;

    if (userScore !== undefined && lowerBound !== null && upperBound !== null) {
      if (userScore < lowerBound) {
        status = 'outperforming';
        statusText = 'Outperforming Cohort';
        statusColor = 'text-emerald-400';
      } else if (userScore > upperBound) {
        status = 'suboptimal';
        statusText = 'Sub-Optimal Trajectory';
        statusColor = 'text-amber-500';
        insight = 'Patient trajectory regressing beyond the 95% cohort interval. Consider reviewing integration variables, sleep patterns, or environmental stressors.';
      }
    }

    return (
      <div className="bg-[#0f172a] border border-slate-700 p-3 rounded-xl shadow-2xl backdrop-blur-md max-w-[280px]">
        <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-black text-slate-500 uppercase tracking-widest">Day {label}</p>
            <span className={`text-sm font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-md bg-slate-800 ${statusColor}`}>
              {statusText}
            </span>
        </div>
        {payload.map((p: any, i: number) => {
          // Skip the confidence interval array in the tooltip for cleaner UI
          if (p.name === 'Confidence Interval') return null;
          return (
            <div key={i} className="flex items-center gap-2 mb-1 last:mb-0">
              <div className="size-2 rounded-full" style={{ backgroundColor: p.color }}></div>
              <span className="text-sm font-bold text-slate-300">
                {p.name === 'userScore' ? 'Patient Score' : 'Community Mean'}:
              </span>
              <span className="text-sm font-mono font-black text-slate-300">{p.value}</span>
            </div>
          );
        })}
        
        {insight && (
          <div className="mt-3 pt-3 border-t border-slate-800">
             <div className="flex items-start gap-2">
                 <div className="size-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0"></div>
                 <p className="text-sm text-slate-400 leading-snug">{insight}</p>
             </div>
          </div>
        )}
      </div>
    );
  }
  return null;
};

const ConfidenceCone: React.FC = () => {
  
  // Transformation: Recharts Area expects [min, max] array for range charts
  const chartData = useMemo(() => {
    return MOCK_TRAJECTORY_DATA.map(point => ({
      ...point,
      range: [point.rangeLower, point.rangeUpper] as [number, number]
    }));
  }, []);

  // Calculate current status based on the most recent data point
  const currentStatus = useMemo(() => {
    if (chartData.length === 0) return null;
    const latest = chartData[chartData.length - 1];
    
    if (latest.userScore < latest.rangeLower) {
        return {
            text: 'Result: Outperforming Cohort (Top 5%)',
            color: 'text-emerald-500',
            bg: 'bg-emerald-500'
        };
    } else if (latest.userScore > latest.rangeUpper) {
        return {
            text: 'Action Required: Trajectory Sub-Optimal',
            color: 'text-amber-500',
            bg: 'bg-amber-500'
        };
    } else {
        return {
            text: 'Result: Typical Cohort Response',
            color: 'text-blue-500',
            bg: 'bg-blue-500'
        };
    }
  }, [chartData]);

  return (
    <div className="bg-[#0a0c10] border border-slate-800 rounded-[2.5rem] p-6 sm:p-8 shadow-xl flex flex-col h-full relative overflow-hidden group">
      
      {/* Header */}
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20">
              <TrendingDown size={18} />
            </div>
            <h3 className="text-lg font-black text-slate-300 tracking-tight">Predictive Trajectory</h3>
          </div>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-widest ml-1">Patient vs. Aggregate (N=14k)</p>
        </div>
        <div className="group/info relative">
          <Info size={16} className="text-slate-600 hover:text-slate-300 transition-colors cursor-help" />
          <div className="absolute right-0 top-6 w-56 p-3 bg-slate-900 border border-slate-700 rounded-xl text-sm text-slate-300 opacity-0 group-hover/info:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl">
            Gray area represents the 95% Confidence Interval of the responding community cohort. Hover over data points for contextual insights.
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1 w-full min-h-[300px] relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="ciGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#64748b" stopOpacity={0.15}/>
                <stop offset="95%" stopColor="#64748b" stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="day" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#64748b', fontSize: 12, fontWeight: 700 }} 
              dy={10}
              tickFormatter={(val) => `Day ${val}`}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#64748b', fontSize: 12, fontWeight: 700 }} 
              domain={[0, 27]}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }} />
            <Legend 
              verticalAlign="top" 
              height={36} 
              iconType="circle"
              iconSize={8}
              content={({ payload }) => (
                <div className="flex justify-end gap-4 mb-4">
                  {payload?.map((entry, index) => (
                    <div key={`item-${index}`} className="flex items-center gap-2">
                      <div 
                        className={`size-2 rounded-full ${entry.value === 'Confidence Interval' ? 'rounded-sm' : ''}`} 
                        style={{ backgroundColor: entry.color }}
                      ></div>
                      <span className="text-sm font-black text-slate-300 uppercase tracking-widest">{entry.value}</span>
                    </div>
                  ))}
                </div>
              )}
            />
            
            {/* 95% Confidence Interval Band */}
            <Area 
              type="monotone" 
              dataKey="range" 
              name="Confidence Interval" 
              stroke="none" 
              fill="url(#ciGradient)" 
            />

            {/* Community Benchmark Mean */}
            <Line 
              type="monotone" 
              dataKey="benchmarkMean" 
              name="Community Mean" 
              stroke="#64748b" 
              strokeWidth={2} 
              strokeDasharray="4 4" 
              dot={false} 
              activeDot={false}
            />

            {/* User Trajectory */}
            <Line 
              type="monotone" 
              dataKey="userScore" 
              name="Patient Score" 
              stroke="#3b82f6" 
              strokeWidth={3} 
              dot={{ r: 4, fill: '#0a0c10', stroke: '#3b82f6', strokeWidth: 2 }} 
              activeDot={{ r: 6, fill: '#3b82f6', stroke: '#fff' }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Insight */}
      {currentStatus && (
        <div className="mt-4 pt-4 border-t border-slate-800 flex items-center gap-2">
          <div className={`size-1.5 rounded-full ${currentStatus.bg} ${currentStatus.bg === 'bg-amber-500' ? 'animate-pulse' : ''}`}></div>
          <p className={`text-sm font-mono uppercase tracking-widest ${currentStatus.color}`}>
            {currentStatus.text}
          </p>
        </div>
      )}
    </div>
  );
};

export default ConfidenceCone;
