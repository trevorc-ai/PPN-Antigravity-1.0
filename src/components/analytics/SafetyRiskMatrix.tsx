
import React from 'react';
import { MOCK_RISK_DATA } from '../../constants/analyticsData';
import { ShieldAlert, Info } from 'lucide-react';

const SUBSTANCES = ['Ketamine', 'Psilocybin', 'MDMA', 'LSD-25', '5-MeO-DMT'];
const MED_CLASSES = ['SSRI', 'MAOI', 'Lithium', 'Benzodiazepines', 'Stimulants'];

const SafetyRiskMatrix: React.FC = () => {

  const getRisk = (sub: string, med: string) => {
    // Fuzzy match to handle RxNorm suffixes in mock data
    const interaction = MOCK_RISK_DATA.find(r =>
      (r.substanceA.includes(sub) || r.substanceB.includes(sub)) &&
      (r.substanceA.includes(med) || r.substanceB.includes(med))
    );

    return interaction ? { level: interaction.riskLevel, desc: interaction.description } : { level: 0, desc: 'No significant interaction noted in current registry.' };
  };

  const getRiskStyle = (level: number) => {
    switch (level) {
      case 5: return 'bg-red-500/20 border-red-500 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]';
      case 4: return 'bg-orange-500/20 border-orange-500 text-orange-500';
      case 3: return 'bg-yellow-500/20 border-yellow-500 text-yellow-500';
      case 2:
      case 1: return 'bg-emerald-500/20 border-emerald-500 text-emerald-500';
      default: return 'bg-slate-800/50 border-slate-700 text-slate-600 hover:border-slate-600';
    }
  };

  return (
    <div className="bg-[#0a0c10] border border-slate-800 rounded-[2.5rem] p-6 sm:p-8 shadow-xl flex flex-col h-full relative overflow-hidden group">

      {/* Header */}
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20">
              <ShieldAlert size={18} />
            </div>
            <h3 className="text-lg font-black text-white tracking-tight">Pharmacovigilance Matrix</h3>
          </div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Cross-Interaction Risk Map</p>
        </div>

        <div className="group/info relative">
          <Info size={16} className="text-slate-600 hover:text-slate-400 transition-colors cursor-help" />
          <div className="absolute right-0 top-6 w-56 p-3 bg-slate-900 border border-slate-700 rounded-xl text-[10px] text-slate-400 opacity-0 group-hover/info:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl">
            Heatmap indicating interaction severity levels (1-5). <span className="text-red-500 font-bold">Level 5</span> indicates absolute contraindication.
          </div>
        </div>
      </div>

      {/* Matrix Grid */}
      <div className="flex-1 w-full min-h-[300px] relative z-10 flex flex-col justify-center">
        <div className="grid grid-cols-6 gap-2 sm:gap-3">

          {/* Header Row */}
          <div className="col-span-1"></div> {/* Spacer for Row Labels */}
          {SUBSTANCES.map((sub) => (
            <div key={sub} className="flex items-end justify-center pb-2">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest -rotate-45 sm:rotate-0 origin-bottom-left sm:origin-center translate-y-2 sm:translate-y-0 whitespace-nowrap">
                {sub.split('-')[0]}
              </span>
            </div>
          ))}

          {/* Data Rows */}
          {MED_CLASSES.map((med) => (
            <React.Fragment key={med}>
              {/* Row Label */}
              <div className="col-span-1 flex items-center justify-end pr-3">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest text-right leading-tight">
                  {med}
                </span>
              </div>

              {/* Interaction Cells */}
              {SUBSTANCES.map((sub) => {
                const { level, desc } = getRisk(sub, med);
                return (
                  <div key={`${med}-${sub}`} className="group/cell relative aspect-square">
                    <div
                      className={`w-full h-full rounded-lg sm:rounded-xl border flex items-center justify-center transition-all duration-300 cursor-help ${getRiskStyle(level)}`}
                    >
                      <span className="text-xs sm:text-sm font-black">{level > 0 ? level : '-'}</span>
                    </div>

                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 bg-[#0f172a] border border-slate-700 rounded-xl shadow-2xl opacity-0 group-hover/cell:opacity-100 transition-opacity pointer-events-none z-50">
                      <div className="flex items-center gap-2 mb-2 border-b border-slate-700/50 pb-2">
                        <div className={`size-1.5 rounded-full ${level >= 4 ? 'bg-red-500 animate-pulse' : 'bg-slate-500'}`}></div>
                        <span className="text-[9px] font-black text-white uppercase tracking-widest">
                          {sub} + {med}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                        {desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Legend Footer */}
      <div className="mt-4 pt-4 border-t border-slate-800 flex justify-center gap-6">
        <div className="flex items-center gap-2">
          <div className="size-2 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]"></div>
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Contraindicated</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="size-2 rounded-full bg-orange-500"></div>
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">High Risk</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="size-2 rounded-full bg-slate-700"></div>
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Safe / No Data</span>
        </div>
      </div>

    </div>
  );
};

export default SafetyRiskMatrix;
