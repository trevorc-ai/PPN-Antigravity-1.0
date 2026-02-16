
import React, { useState, useMemo } from 'react';
import { AUDIT_LOGS } from '../constants';
import { PageContainer } from '../components/layouts/PageContainer';
import { Section } from '../components/layouts/Section';

const AuditLogs: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('All');

  const getActionColor = (action: string) => {
    const act = action.toUpperCase();
    if (act.includes('CRITICAL') || act.includes('DELETE') || act.includes('FAILURE') || act.includes('ALERT') || act.includes('SAFETY')) {
      return 'text-rose-500 font-bold shadow-rose-500/10';
    }
    if (act.includes('UPDATE') || act.includes('SUCCESS') || act.includes('SYNC') || act.includes('VERIFIED')) {
      return 'text-emerald-400 font-bold';
    }
    if (act.includes('LOGIN') || act.includes('AUTH') || act.includes('EXPORT') || act.includes('PROTOCOL')) {
      return 'text-blue-400 font-bold';
    }
    return 'text-slate-300';
  };

  const filteredLogs = useMemo(() => {
    if (activeFilter === 'Security') {
      return AUDIT_LOGS.filter(log =>
        log.action.includes('SECURITY') || log.action.includes('AUTH') || log.action.includes('SAFETY') || log.status === 'ALERT_TRIGGERED'
      );
    }
    if (activeFilter === 'Clinical') {
      return AUDIT_LOGS.filter(log => log.action.includes('PROTOCOL') || log.action.includes('DATA') || log.action.includes('SEARCH'));
    }
    return AUDIT_LOGS;
  }, [activeFilter]);

  return (
    <PageContainer width="wide" className="h-full flex flex-col gap-8 animate-in fade-in duration-500 bg-[#020408]">

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 pt-6 sm:pt-10 px-6 sm:px-0">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-5xl font-black">history_edu</span>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tighter text-slate-200 uppercase">Audit Logs</h1>
          </div>
          <p className="text-slate-3000 text-sm font-bold tracking-[0.2em] uppercase">
            Institutional Research Ledger • <span className="text-emerald-500">Node Synchronized</span>
          </p>
        </div>

        <div className="flex gap-3 bg-[#0a0c10] p-1.5 rounded-2xl border border-slate-800">
          {['All', 'Security', 'Clinical'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-8 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${activeFilter === filter
                ? 'bg-primary text-slate-300 shadow-lg shadow-primary/20'
                : 'text-slate-3000 hover:text-slate-300'
                }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <Section spacing="default" className="flex-1 overflow-hidden flex flex-col">
        <div className="bg-[#0a0c10] border border-slate-800 rounded-[2.5rem] flex-1 overflow-hidden flex flex-col shadow-2xl backdrop-blur-xl">
          <div className="overflow-x-auto custom-scrollbar flex-1">
            <table className="w-full text-left border-collapse min-w-[1200px]">
              <thead className="bg-black/40 sticky top-0 z-10 border-b border-slate-800">
                <tr className="text-sm font-black uppercase tracking-[0.3em] text-slate-3000">
                  <th className="px-10 py-8">Timestamp (UTC)</th>
                  <th className="px-10 py-8">Practitioner</th>
                  <th className="px-10 py-8 w-2/5">Activity Event Log</th>
                  <th className="px-10 py-8">Status</th>
                  <th className="px-10 py-8 text-right">Ledger Hash</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/[0.03] transition-all group border-b border-slate-800/30">
                    <td className="px-10 py-6">
                      <span className="text-sm font-mono text-slate-3000">{log.timestamp.split(' ')[0]}</span>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-black text-slate-400 uppercase tracking-widest">{log.actor}</span>
                        <span className="text-sm text-slate-700 font-mono tracking-tighter uppercase">ID: {log.id}</span>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex flex-col gap-1">
                        <span className={`text-base tracking-tight leading-none ${getActionColor(log.action)}`}>
                          {log.action}
                        </span>
                        <span className="text-sm text-slate-600 font-medium italic tracking-tight">
                          "{log.details}"
                        </span>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-3">
                        <div className={`size-3 rounded-full ${(log.status === 'AUTHORIZED' || log.status === 'VERIFIED') ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' :
                          log.status === 'ALERT_TRIGGERED' ? 'bg-rose-500 shadow-[0_0_10px_#f43f5e]' :
                            'bg-primary shadow-[0_0_10px_#2b74f3]'
                          }`}></div>
                        <span className={`text-sm font-black uppercase tracking-widest ${(log.status === 'AUTHORIZED' || log.status === 'VERIFIED') ? 'text-emerald-500' :
                          log.status === 'ALERT_TRIGGERED' ? 'text-rose-500' :
                            'text-primary'
                          }`}>
                          {log.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <span className="px-4 py-1.5 bg-black rounded-xl border border-slate-800 font-mono text-[12px] text-slate-600 font-bold group-hover:border-primary/50 group-hover:text-primary transition-all">
                        {log.hash}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredLogs.length === 0 && (
              <div className="py-40 text-center space-y-6">
                <span className="material-symbols-outlined text-7xl text-slate-800">search_off</span>
                <p className="text-slate-600 font-black uppercase tracking-[0.4em] text-lg">No Matching Ledger Entries Found</p>
              </div>
            )}
          </div>

          <div className="px-10 py-8 border-t border-slate-800 bg-black/20 flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-6">
              <span className="text-sm font-bold text-slate-600 uppercase tracking-widest">
                Total Record Nodes: <span className="text-slate-400">{AUDIT_LOGS.length}</span>
              </span>
              <div className="h-6 w-px bg-slate-800"></div>
              <div className="flex items-center gap-3">
                <div className="size-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]"></div>
                <span className="text-sm font-mono text-slate-3000 uppercase tracking-widest">Global Uplink: Stable</span>
              </div>
            </div>

            <div className="flex gap-4">
              <button className="px-6 py-3 bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all">
                Export Parquet
              </button>
              <button className="px-8 py-3 bg-primary hover:bg-blue-600 text-slate-300 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-2xl shadow-primary/30 transition-all active:scale-95">
                Verify Node Integrity
              </button>
            </div>
          </div>
        </div>
      </Section>
    </PageContainer>
  );
};

export default AuditLogs;
