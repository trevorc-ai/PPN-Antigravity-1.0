
import React, { useState, useMemo } from 'react';
import { AUDIT_LOGS } from '../constants';
import { PageContainer } from '../components/layouts/PageContainer';
import { Section } from '../components/layouts/Section';
import { exportAllData } from '../services/exportService';
import { Download } from 'lucide-react';

const AuditLogs: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [siteFilter, setSiteFilter] = useState('All Sites');
  const [actorFilter, setActorFilter] = useState('All Actors');
  const [riskFilter, setRiskFilter] = useState('All Risks');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [sortField, setSortField] = useState<'timestamp' | 'gender' | 'substance' | 'age' | 'weightRange' | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const handleSort = (field: 'timestamp' | 'gender' | 'substance' | 'age' | 'weightRange') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Handle CSV export
  const handleExport = async () => {
    try {
      setIsExporting(true);
      setExportError(null);
      await exportAllData();
      // Success - file will download automatically
    } catch (error) {
      console.error('Export failed:', error);
      setExportError('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const getActionColor = (action: string) => {
    const act = action.toUpperCase();
    if (act.includes('CRITICAL') || act.includes('DELETE') || act.includes('FAILURE') || act.includes('ALERT') || act.includes('SAFETY') || act.includes('CONTRAINDICATION') || act.includes('ADVERSE')) {
      return 'text-rose-500 font-bold shadow-rose-500/10';
    }
    if (act.includes('UPDATE') || act.includes('SUCCESS') || act.includes('SYNC') || act.includes('VERIFIED') || act.includes('COMPLETE') || act.includes('APPROVED')) {
      return 'text-emerald-400 font-bold';
    }
    if (act.includes('LOGIN') || act.includes('AUTH') || act.includes('EXPORT') || act.includes('PROTOCOL') || act.includes('VIEW')) {
      return 'text-blue-400 font-bold';
    }
    return 'text-slate-300';
  };

  // Get unique values for dropdown filters
  const uniqueSites = useMemo(() => {
    const sites = new Set(AUDIT_LOGS.map(log => log.site).filter(Boolean));
    return ['All Sites', ...Array.from(sites).sort()];
  }, []);

  const uniqueActors = useMemo(() => {
    const actors = new Set(AUDIT_LOGS.map(log => log.actor));
    return ['All Actors', ...Array.from(actors).sort()];
  }, []);

  const uniqueRisks = useMemo(() => {
    const risks = new Set(AUDIT_LOGS.map(log => log.riskLevel).filter(Boolean));
    return ['All Risks', ...Array.from(risks).sort()];
  }, []);

  const uniqueStatuses = useMemo(() => {
    const statuses = new Set(AUDIT_LOGS.map(log => log.status));
    return ['All Statuses', ...Array.from(statuses).sort()];
  }, []);

  const filteredLogs = useMemo(() => {
    let logs = AUDIT_LOGS;

    // Category filter (All, Security, Clinical)
    if (activeFilter === 'Security') {
      logs = logs.filter(log =>
        log.action.includes('SECURITY') || log.action.includes('AUTH') || log.action.includes('SAFETY') || log.status === 'ALERT_TRIGGERED' || log.category === 'Security'
      );
    } else if (activeFilter === 'Clinical') {
      logs = logs.filter(log => log.action.includes('PROTOCOL') || log.action.includes('DATA') || log.action.includes('SEARCH') || log.category === 'Clinical');
    }

    // Site filter
    if (siteFilter !== 'All Sites') {
      logs = logs.filter(log => log.site === siteFilter);
    }

    // Actor filter
    if (actorFilter !== 'All Actors') {
      logs = logs.filter(log => log.actor === actorFilter);
    }

    // Risk filter
    if (riskFilter !== 'All Risks') {
      logs = logs.filter(log => log.riskLevel === riskFilter);
    }

    // Status filter
    if (statusFilter !== 'All Statuses') {
      logs = logs.filter(log => log.status === statusFilter);
    }

    // Sorting
    if (sortField) {
      logs = [...logs].sort((a, b) => {
        let aVal: any = a[sortField];
        let bVal: any = b[sortField];

        if (sortField === 'timestamp') {
          aVal = new Date(aVal).getTime();
          bVal = new Date(bVal).getTime();
        } else if (sortField === 'age') {
          aVal = aVal || 0;
          bVal = bVal || 0;
        } else {
          aVal = aVal || '';
          bVal = bVal || '';
        }

        if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return logs;
  }, [activeFilter, siteFilter, actorFilter, riskFilter, statusFilter, sortField, sortDirection]);

  return (
    <PageContainer width="wide" className="h-full flex flex-col gap-8 animate-in fade-in duration-500 bg-[#0a1628]">

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 pt-6 sm:pt-10 px-6 sm:px-0">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-5xl font-black">history_edu</span>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tighter text-slate-400">Audit Logs</h1>
          </div>
          <p className="text-slate-400 text-sm font-bold tracking-[0.2em] uppercase">
            Institutional Research Ledger • <span className="text-emerald-500">Node Synchronized</span>
          </p>
        </div>

        <div className="flex gap-3 bg-[#0a0c10] p-1.5 rounded-2xl border border-slate-800">
          {['All', 'Security', 'Clinical'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-8 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${activeFilter === filter
                ? 'bg-primary text-slate-400 shadow-lg shadow-primary/20'
                : 'text-slate-4000 hover:text-slate-400'
                }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Dropdown Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-6 sm:px-0">
        {/* Site Filter */}
        <div className="space-y-2">
          <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Site</label>
          <select
            value={siteFilter}
            onChange={(e) => setSiteFilter(e.target.value)}
            className="w-full px-4 py-3 bg-[#0a0c10] border border-slate-800 rounded-xl text-sm font-bold text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
          >
            {uniqueSites.map(site => (
              <option key={site} value={site}>{site}</option>
            ))}
          </select>
        </div>

        {/* Actor Filter */}
        <div className="space-y-2">
          <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Practitioner</label>
          <select
            value={actorFilter}
            onChange={(e) => setActorFilter(e.target.value)}
            className="w-full px-4 py-3 bg-[#0a0c10] border border-slate-800 rounded-xl text-sm font-bold text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
          >
            {uniqueActors.map(actor => (
              <option key={actor} value={actor}>{actor}</option>
            ))}
          </select>
        </div>

        {/* Risk Level Filter */}
        <div className="space-y-2">
          <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Risk Level</label>
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="w-full px-4 py-3 bg-[#0a0c10] border border-slate-800 rounded-xl text-sm font-bold text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
          >
            {uniqueRisks.map(risk => (
              <option key={risk} value={risk}>{risk}</option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="space-y-2">
          <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-4 py-3 bg-[#0a0c10] border border-slate-800 rounded-xl text-sm font-bold text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
          >
            {uniqueStatuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>

      <Section spacing="default" className="flex-1 overflow-hidden flex flex-col">
        <div className="bg-[#0a0c10] border border-slate-800 rounded-[2.5rem] flex-1 overflow-hidden flex flex-col shadow-2xl backdrop-blur-xl">
          <div className="overflow-x-auto custom-scrollbar flex-1">
            <table className="w-full text-left border-collapse min-w-[1400px]">
              <thead className="bg-black/40 sticky top-0 z-10 border-b border-slate-800">
                <tr className="text-sm font-black uppercase tracking-[0.3em] text-slate-3000">
                  <th
                    className="px-6 py-8 cursor-pointer hover:text-primary transition-colors"
                    onClick={() => handleSort('timestamp')}
                  >
                    Timestamp {sortField === 'timestamp' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    className="px-6 py-8 cursor-pointer hover:text-primary transition-colors"
                    onClick={() => handleSort('gender')}
                  >
                    Gender {sortField === 'gender' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    className="px-6 py-8 cursor-pointer hover:text-primary transition-colors"
                    onClick={() => handleSort('substance')}
                  >
                    Substance {sortField === 'substance' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    className="px-6 py-8 cursor-pointer hover:text-primary transition-colors"
                    onClick={() => handleSort('age')}
                  >
                    Age {sortField === 'age' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    className="px-6 py-8 cursor-pointer hover:text-primary transition-colors"
                    onClick={() => handleSort('weightRange')}
                  >
                    Weight {sortField === 'weightRange' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="px-6 py-8 w-2/5">Activity Event Log</th>
                  <th className="px-6 py-8">Status</th>
                  <th className="px-6 py-8 text-right">Hash</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/[0.03] transition-all group border-b border-slate-800/30">
                    <td className="px-6 py-6">
                      <span className="text-sm font-mono text-slate-4000">{log.timestamp.split(' ')[0]}</span>
                    </td>
                    <td className="px-6 py-6">
                      <span className="text-sm font-bold text-slate-400">{log.gender || 'N/A'}</span>
                    </td>
                    <td className="px-6 py-6">
                      <span className="text-sm font-bold text-primary">{log.substance || 'N/A'}</span>
                    </td>
                    <td className="px-6 py-6">
                      <span className="text-sm font-bold text-slate-400">{log.age || 'N/A'}</span>
                    </td>
                    <td className="px-6 py-6">
                      <span className="text-sm font-bold text-slate-400">{log.weightRange || 'N/A'}</span>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex flex-col gap-1">
                        <span className={`text-base tracking-tight leading-none ${getActionColor(log.action)}`}>
                          {log.action}
                        </span>
                        <span className="text-sm text-slate-600 font-medium italic tracking-tight">
                          "{log.details}"
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-6">
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
                    <td className="px-6 py-6 text-right">
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
                Total Record Nodes: <span className="text-slate-300">{AUDIT_LOGS.length}</span>
              </span>
              <div className="h-6 w-px bg-slate-800"></div>
              <div className="flex items-center gap-3">
                <div className="size-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]"></div>
                <span className="text-sm font-mono text-slate-3000 uppercase tracking-widest">Global Uplink: Stable</span>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleExport}
                disabled={isExporting}
                className="px-6 py-3 bg-slate-900 border border-slate-800 text-slate-300 hover:text-slate-300 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isExporting ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    Export CSV
                  </>
                )}
              </button>
              <button className="px-8 py-3 bg-primary hover:bg-blue-600 text-slate-300 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-2xl shadow-primary/30 transition-all active:scale-95">
                Verify Node Integrity
              </button>
            </div>

            {/* Export Error Message */}
            {exportError && (
              <div className="absolute bottom-24 right-10 bg-rose-500/20 border border-rose-500 text-rose-300 px-4 py-2 rounded-lg text-sm font-bold animate-in fade-in slide-in-from-bottom-2">
                {exportError}
              </div>
            )}
          </div>
        </div>
      </Section>
    </PageContainer>
  );
};

export default AuditLogs;
