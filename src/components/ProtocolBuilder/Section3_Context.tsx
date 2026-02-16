import React from 'react';

export const Section3_Context = ({ protocol, onChange }) => {
  return (
    <div className={`p-6 rounded-2xl border border-slate-700 bg-slate-900/40 opacity-0 translate-y-8 animate-in fade-in slide-in-from-bottom-12 duration-1000 fill-mode-forwards`}>
      <h2 className="text-xl font-bold text-slate-200 mb-6 flex items-center gap-3">
        <span className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-sm">3</span>
        Environmental Context (Set & Setting)
      </h2>

      <div className="space-y-4">
        <div className="flex gap-4 p-4 rounded-xl bg-slate-800/20 border border-slate-700 hover:border-slate-500 transition-colors">
          <input type="checkbox" className="w-5 h-5 bg-slate-900 border-slate-600 rounded" />
          <div>
            <h4 className="font-bold text-slate-300">Music Protocol (Mendel Kaelen)</h4>
            <p className="text-sm text-slate-400">Standardized playlists for emotional peaks.</p>
          </div>
        </div>

        <div className="flex gap-4 p-4 rounded-xl bg-slate-800/20 border border-slate-700 hover:border-slate-500 transition-colors">
          <input type="checkbox" className="w-5 h-5 bg-slate-900 border-slate-600 rounded" />
          <div>
            <h4 className="font-bold text-slate-300">Somatic Support</h4>
            <p className="text-sm text-slate-400">Touch therapy available on request.</p>
          </div>
        </div>

        <div className="flex gap-4 p-4 rounded-xl bg-slate-800/20 border border-slate-700 hover:border-slate-500 transition-colors">
          <input type="checkbox" defaultChecked className="w-5 h-5 bg-emerald-500 border-emerald-600 rounded" />
          <div>
            <h4 className="font-bold text-emerald-400">Safety Sitter Present</h4>
            <p className="text-sm text-slate-400">Required for high-dose sessions.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
