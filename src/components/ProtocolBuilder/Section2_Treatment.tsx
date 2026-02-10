import React from 'react';

export const Section2_Treatment = ({ protocol, onChange, autoFilled }) => {
  return (
    <div className={`p-6 rounded-2xl border border-indigo-500/20 bg-slate-900/40 opacity-0 translate-y-4 animate-in fade-in slide-in-from-bottom-6 duration-700 fill-mode-forwards`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-3">
          <span className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-sm">2</span>
          Treatment Parameters
        </h2>
        {autoFilled && (
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono border border-emerald-500/20 flex items-center gap-2 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            AI Optimized
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Substance</label>
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 text-white font-mono">
            {protocol.substance_id === 1 ? 'Psilocybin (C12H17N2O4P)' : 'Unknown'}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Route</label>
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 text-white font-mono">
            {protocol.route_id === 1 ? 'Oral Administration' : 'Unknown'}
          </div>
        </div>

        <div className="col-span-2 p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-indigo-300 uppercase tracking-widest">Recommended Dosage Range</span>
            <span className="text-xs text-indigo-400">Based on 847 similar cases</span>
          </div>
          <div className="h-12 flex items-end gap-1">
            {[20, 35, 50, 80, 45, 30, 15].map((h, i) => (
              <div key={i} className="flex-1 bg-indigo-500/40 hover:bg-indigo-400 transition-colors rounded-t-sm" style={{ height: `${h}%` }} />
            ))}
          </div>
          <div className="flex justify-between text-[10px] text-slate-500 mt-2 font-mono">
            <span>10mg</span>
            <span>25mg (Avg)</span>
            <span>40mg</span>
          </div>
        </div>
      </div>
    </div>
  );
};
