import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { Activity } from 'lucide-react';

const MOCK_DATA = [
  { name: 'National Avg', value: 12.8, color: '#334155' },
  { name: 'Your Node', value: 4.2, color: '#10b981' },
];

const SafetyBenchmark: React.FC = () => {
  return (
    <div className="bg-[#0f1218] border border-slate-800/60 rounded-3xl p-5 h-full flex flex-col shadow-lg">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Activity className="text-slate-400" size={18} />
          <h3 className="text-xs font-black text-slate-300 uppercase tracking-widest">Safety Radar</h3>
        </div>
      </div>
      <div className="flex-1 w-full min-h-[120px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={MOCK_DATA} layout="vertical" margin={{ top:0, right:30, left:0, bottom:0 }} barSize={24}>
            <XAxis type="number" hide />
            <YAxis type="category" dataKey="name" tick={{ fill:'#94a3b8', fontSize:10, fontWeight:700 }} width={80} axisLine={false} tickLine={false} />
            <Tooltip cursor={{fill:'transparent'}} contentStyle={{backgroundColor:'#0f172a', borderColor:'#1e293b', borderRadius:'8px', fontSize:'11px', color:'#fff'}} />
            <Bar dataKey="value" radius={[0,4,4,0]}>
              {MOCK_DATA.map((e, i) => <Cell key={i} fill={e.color} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 pt-3 border-t border-slate-800">
        <p className="text-[10px] font-medium text-slate-400 leading-tight">
          Your adverse event rate is <span className="text-emerald-400 font-bold">67% lower</span> than the FDA FAERS national average.
        </p>
      </div>
    </div>
  );
};

export default SafetyBenchmark;