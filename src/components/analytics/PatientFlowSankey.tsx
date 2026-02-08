
import React, { useMemo } from 'react';
import { Sankey, Tooltip, ResponsiveContainer, Layer, Rectangle } from 'recharts';
import { MOCK_FLOW_DATA } from '../../constants/analyticsData';
import { GitMerge, Info } from 'lucide-react';

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    // Check if it's a node (has name) or link (has source/target)
    const isNode = data.payload.name && !data.payload.source;

    if (isNode) {
       return (
        <div className="bg-[#0f172a] border border-slate-700 p-3 rounded-xl shadow-2xl backdrop-blur-md z-50">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Clinical Stage</p>
          <span className="text-xs font-bold text-white">{data.payload.name}</span>
          <div className="mt-2 pt-2 border-t border-slate-800">
             <span className="text-[9px] text-slate-400">Total Volume: {data.value}</span>
          </div>
        </div>
       );
    }

    // It's a link
    const sourceName = data.payload.source?.name;
    const targetName = data.payload.target?.name;
    const value = data.value;

    return (
      <div className="bg-[#0f172a] border border-slate-700 p-3 rounded-xl shadow-2xl backdrop-blur-md z-50">
        <div className="flex items-center gap-2 mb-2 border-b border-slate-700/50 pb-2">
           <span className="text-[10px] font-black text-white uppercase tracking-widest">{sourceName} → {targetName}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wide">Retention:</span>
          <span className="text-[9px] text-emerald-400 font-mono font-black">{value} Patients</span>
        </div>
      </div>
    );
  }
  return null;
};

const CustomNode = ({ x, y, width, height, index, payload, containerWidth }: any) => {
  return (
    <Layer key={`custom-node-${index}`}>
      <Rectangle
        x={x} y={y} width={width} height={height}
        fill="#334155"
        fillOpacity={0.9}
        stroke="#475569"
        strokeWidth={1}
        radius={[4, 4, 4, 4]}
      />
      {/* Label logic: place left or right depending on position */}
      <text
        x={x < containerWidth / 2 ? x + width + 6 : x - 6}
        y={y + height / 2}
        textAnchor={x < containerWidth / 2 ? "start" : "end"}
        dominantBaseline="middle"
        fill="#94a3b8"
        fontSize={10}
        fontWeight={700}
        style={{ pointerEvents: 'none', textShadow: '0 1px 2px rgba(0,0,0,0.9)' }}
      >
        {payload.name}
      </text>
    </Layer>
  );
};

const PatientFlowSankey: React.FC = () => {
  
  // Data Transformation for Recharts Sankey (String IDs -> Numeric Indices)
  const sankeyData = useMemo(() => {
    const nodes = Array.from(new Set(MOCK_FLOW_DATA.flatMap(d => [d.source, d.target])))
      .map(name => ({ name }));
    
    const links = MOCK_FLOW_DATA.map(d => ({
      source: nodes.findIndex(n => n.name === d.source),
      target: nodes.findIndex(n => n.name === d.target),
      value: d.value
    }));
    
    return { nodes, links };
  }, []);

  return (
    <div className="bg-[#0a0c10] border border-slate-800 rounded-[2.5rem] p-6 sm:p-8 shadow-xl flex flex-col h-full relative overflow-hidden group">
      
      {/* Header */}
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500 border border-indigo-500/20">
              <GitMerge size={18} />
            </div>
            <h3 className="text-lg font-black text-white tracking-tight">Retention Flow</h3>
          </div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Integration Gap Analysis</p>
        </div>
        
        <div className="group/info relative">
          <Info size={16} className="text-slate-600 hover:text-slate-400 transition-colors cursor-help" />
          <div className="absolute right-0 top-6 w-56 p-3 bg-slate-900 border border-slate-700 rounded-xl text-[10px] text-slate-400 opacity-0 group-hover/info:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl">
            Sankey diagram visualizing patient throughput. Width of lines represents cohort volume at each stage.
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1 w-full min-h-[300px] relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <Sankey
            data={sankeyData}
            node={<CustomNode />}
            nodePadding={50}
            margin={{ left: 10, right: 10, top: 10, bottom: 10 }}
            link={{ stroke: '#64748b', strokeOpacity: 0.3 }}
          >
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
          </Sankey>
        </ResponsiveContainer>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-slate-800 flex items-center gap-2">
        <div className="size-1.5 rounded-full bg-indigo-500"></div>
        <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
          Gap Identified: 30% drop-off post-induction
        </p>
      </div>
    </div>
  );
};

export default PatientFlowSankey;
