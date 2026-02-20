import React, { useEffect, useState } from 'react';

export const PreviewPanel = ({ protocol, networkStats, timeSaved, onSave, isValid }) => {
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    if (networkStats.remission_rate > 0) setShowStats(true);
  }, [networkStats]);

  return (
    <div className="sticky top-6 space-y-6">
      {/* MAIN PREVIEW */}
      <div className="p-6 bg-gradient-to-br from-indigo-900/40 to-slate-900 border border-indigo-500/30 rounded-3xl backdrop-blur-xl shadow-2xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-indigo-500/5 group-hover:bg-indigo-500/10 transition-colors pointer-events-none" />

        <div className="flex justify-between items-start mb-6 border-b border-indigo-500/20 pb-4">
          <div>
            <h3 className="text-sm font-black text-indigo-300 uppercase tracking-widest">Protocol ID</h3>
            <div className="text-2xl font-mono text-slate-300 tracking-widest">{protocol.subject_id}</div>
          </div>
          <div className={`w-3 h-3 rounded-full ${isValid ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-slate-300">Date</span>
            <span className="font-mono text-slate-300">{protocol.session_date.toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-300">Status</span>
            <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">DRAFTING</span>
          </div>

          {showStats && (
            <div className="mt-8 pt-8 border-t border-indigo-500/20 space-y-4 animate-in fade-in transition-all duration-700">
              <div className="p-4 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                <div className="text-sm uppercase font-bold text-indigo-300 mb-1">Projected Remission Rate</div>
                <div className="text-3xl font-black text-slate-300">{networkStats.remission_rate}%</div>
                <div className="text-sm text-indigo-400 mt-1">Based on global outcomes</div>
              </div>

              <div className="flex gap-4">
                <div className="flex-1 p-3 bg-slate-800/50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-emerald-400">{timeSaved}s</div>
                  <div className="text-sm uppercase font-bold text-slate-500">Admin Time Saved</div>
                </div>
                <div className="flex-1 p-3 bg-slate-800/50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-400">{networkStats.confidence}%</div>
                  <div className="text-sm uppercase font-bold text-slate-500">AI Confidence</div>
                </div>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={onSave}
          disabled={!isValid}
          className="w-full mt-6 py-4 bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 disabled:text-slate-500 text-slate-300 font-black uppercase tracking-widest rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] disabled:shadow-none hover:scale-[1.02] active:scale-95"
        >
          Deploy Protocol
        </button>
      </div>
    </div>
  );
};
