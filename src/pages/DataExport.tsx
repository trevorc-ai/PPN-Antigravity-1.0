import React, { useState, useEffect } from 'react';
import { Download, FileText, AlertCircle, CheckCircle, XCircle, Eye, Shield } from 'lucide-react';
import { PageContainer } from '../components/layouts/PageContainer';
import { Section } from '../components/layouts/Section';
import { DateInput } from '../components/forms/DateInput';

interface ExportConfig {
    dateStart: string;
    dateEnd: string;
    substanceId: string;
    indications: string[];
    format: 'csv' | 'json' | 'pdf';
}

interface ExportRecord {
    id: string;
    fileName: string;
    filters: string;
    generated: string;
    count: number;
    status: 'complete' | 'failed' | 'generating';
    format: 'csv' | 'json' | 'pdf';
}

const DataExport: React.FC = () => {
    const [config, setConfig] = useState<ExportConfig>({
        dateStart: '',
        dateEnd: '',
        substanceId: 'all',
        indications: [],
        format: 'csv'
    });

    const [isGenerating, setIsGenerating] = useState(false);
    const [progress, setProgress] = useState(0);
    const [exportHistory, setExportHistory] = useState<ExportRecord[]>([
        {
            id: 'EXP-2023-10-ALPHA',
            fileName: 'EXP-2023-10-ALPHA.csv',
            filters: 'Psilocybin, TRD, PTSD',
            generated: 'Oct 24, 2023 at 14:30:25 by You',
            count: 1240,
            status: 'complete',
            format: 'csv'
        },
        {
            id: 'EXP-2023-10-BETA',
            fileName: 'EXP-2023-10-BETA.json',
            filters: 'MDMA-AT, PTSD',
            generated: 'Oct 22, 2023 at 09:16:00 by Dr. A. Smith',
            count: 856,
            status: 'complete',
            format: 'json'
        },
        {
            id: 'EXP-2023-09-FINAL',
            fileName: 'EXP-2023-09-FINAL.pdf',
            filters: 'All Protocols, ALL',
            generated: 'Sep 30, 2023 at 23:45:12 by You',
            count: 0,
            status: 'failed',
            format: 'pdf'
        },
        {
            id: 'EXP-2023-09-RAW',
            fileName: 'EXP-2023-09-RAW.csv',
            filters: 'Ketamine Assisted, TRD',
            generated: 'Sep 15, 2023 at 11:20:05 by Dr. L. Wei',
            count: 432,
            status: 'complete',
            format: 'csv'
        }
    ]);

    const indications = ['MDD', 'PTSD', 'TRD', 'Anorexia', 'AUD', 'OCD'];

    const handleIndicationToggle = (indication: string) => {
        setConfig(prev => ({
            ...prev,
            indications: prev.indications.includes(indication)
                ? prev.indications.filter(i => i !== indication)
                : [...prev.indications, indication]
        }));
    };

    const handleGenerateExport = async () => {
        setIsGenerating(true);
        setProgress(0);

        // Simulate export generation with progress
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setIsGenerating(false);

                    // Add to export history
                    const newExport: ExportRecord = {
                        id: `EXP-${new Date().toISOString().split('T')[0]}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
                        fileName: `export-${Date.now()}.${config.format}`,
                        filters: `${config.substanceId === 'all' ? 'All Substances' : config.substanceId}, ${config.indications.join(', ') || 'All Indications'}`,
                        generated: new Date().toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit'
                        }) + ' by You',
                        count: Math.floor(Math.random() * 1000) + 100,
                        status: 'complete',
                        format: config.format
                    };

                    setExportHistory(prev => [newExport, ...prev]);
                    return 100;
                }
                return prev + 8;
            });
        }, 100);
    };

    const getStatusIcon = (status: ExportRecord['status']) => {
        switch (status) {
            case 'complete':
                return <CheckCircle className="text-emerald-500" size={18} />;
            case 'failed':
                return <XCircle className="text-red-500" size={18} />;
            case 'generating':
                return <div className="size-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />;
        }
    };

    const getFormatIcon = (format: string) => {
        switch (format) {
            case 'csv':
                return <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded uppercase tracking-widest">CSV</span>;
            case 'json':
                return <span className="text-xs font-black text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded uppercase tracking-widest">JSON</span>;
            case 'pdf':
                return <span className="text-xs font-black text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded uppercase tracking-widest">PDF</span>;
        }
    };

    return (
        <div className="p-6 sm:p-10 min-h-screen bg-[#05070a]">
            <PageContainer width="wide">
                {/* Header */}
                <Section spacing="tight" className="border-b border-slate-800 pb-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                        <div>
                            <h1 className="text-4xl font-black text-white tracking-tight">Data Export Manager</h1>
                            <p className="text-slate-400 text-lg mt-2">
                                Generate de-identified research datasets for outcomes benchmarking and risk surveillance.
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center gap-2">
                                <Shield className="text-emerald-400" size={16} />
                                <span className="text-sm font-bold text-emerald-400">SECURE CONNECTION</span>
                            </div>
                        </div>
                    </div>
                </Section>

                {/* PII Warning Banner */}
                <Section spacing="tight">
                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-start gap-3">
                        <Shield className="text-amber-400 mt-0.5" size={20} />
                        <div>
                            <p className="text-sm font-bold text-amber-400 mb-1">STRICTLY CONFIDENTIAL</p>
                            <p className="text-sm text-slate-300">
                                Personally Identifiable Information (PII) is automatically scrubbed from all generated files.
                                Do not attempt to re-identify patients. All exports are logged under 21 CFR Part 11 compliance standards.
                            </p>
                        </div>
                    </div>
                </Section>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Panel - Export Configuration */}
                    <div className="lg:col-span-5">
                        <Section spacing="default">
                            <div className="card-glass rounded-3xl p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="material-symbols-outlined text-3xl text-primary">download</span>
                                    <h2 className="text-xl font-black text-white">New Export</h2>
                                </div>

                                <div className="space-y-6">
                                    {/* Date Range */}
                                    <div>
                                        <label className="text-sm font-black text-slate-500 uppercase tracking-widest mb-2 block">
                                            Date Range
                                        </label>
                                        <div className="grid grid-cols-2 gap-3">
                                            <DateInput
                                                value={config.dateStart}
                                                onChange={(value) => setConfig({ ...config, dateStart: value })}
                                                placeholder="Start: MM/DD/YYYY"
                                            />
                                            <DateInput
                                                value={config.dateEnd}
                                                onChange={(value) => setConfig({ ...config, dateEnd: value })}
                                                placeholder="End: MM/DD/YYYY"
                                            />
                                        </div>
                                    </div>

                                    {/* Substance Protocol */}
                                    <div>
                                        <label className="text-sm font-black text-slate-500 uppercase tracking-widest mb-2 block">
                                            Substance Protocol
                                        </label>
                                        <select
                                            value={config.substanceId}
                                            onChange={(e) => setConfig({ ...config, substanceId: e.target.value })}
                                            className="w-full bg-[#0a0c10] border border-slate-800 rounded-xl px-4 py-3 text-sm font-medium text-white focus:outline-none focus:border-primary transition-colors appearance-none cursor-pointer"
                                        >
                                            <option value="all">All Protocols</option>
                                            <option value="psilocybin">Psilocybin</option>
                                            <option value="mdma">MDMA-AT</option>
                                            <option value="ketamine">Ketamine Assisted</option>
                                            <option value="lsd">LSD-25 Microdose</option>
                                        </select>
                                    </div>

                                    {/* Clinical Indication */}
                                    <div>
                                        <label className="text-sm font-black text-slate-500 uppercase tracking-widest mb-2 block">
                                            Clinical Indication
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {indications.map(indication => (
                                                <button
                                                    key={indication}
                                                    onClick={() => handleIndicationToggle(indication)}
                                                    className={`px-3 py-1.5 rounded-lg text-sm font-bold uppercase tracking-wider transition-all ${config.indications.includes(indication)
                                                        ? 'bg-primary text-white border border-primary'
                                                        : 'bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700'
                                                        }`}
                                                >
                                                    {indication}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Output Format */}
                                    <div>
                                        <label className="text-sm font-black text-slate-500 uppercase tracking-widest mb-2 block">
                                            Output Format
                                        </label>
                                        <div className="grid grid-cols-3 gap-3">
                                            {(['csv', 'json', 'pdf'] as const).map(format => (
                                                <button
                                                    key={format}
                                                    onClick={() => setConfig({ ...config, format })}
                                                    className={`p-4 rounded-xl border transition-all ${config.format === format
                                                        ? 'bg-primary/10 border-primary text-primary'
                                                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                                                        }`}
                                                >
                                                    <FileText className="mx-auto mb-2" size={24} />
                                                    <div className="text-sm font-black uppercase tracking-widest">{format}</div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Generate Button */}
                                    <button
                                        onClick={handleGenerateExport}
                                        disabled={isGenerating}
                                        className="w-full bg-primary hover:bg-blue-600 disabled:bg-slate-800 disabled:text-slate-600 text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                                    >
                                        {isGenerating ? (
                                            <>
                                                <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                Generating Export...
                                            </>
                                        ) : (
                                            <>
                                                <Download size={18} />
                                                Generate Export
                                            </>
                                        )}
                                    </button>

                                    {/* Progress Bar */}
                                    {isGenerating && (
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm font-bold text-slate-400">
                                                <span>Generating EXP-{new Date().toISOString().split('T')[0]}-BETA.{config.format}...</span>
                                                <span>{progress}%</span>
                                            </div>
                                            <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-primary transition-all duration-300"
                                                    style={{ width: `${progress}%` }}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* PII Warning */}
                                    <div className="pt-4 border-t border-slate-800">
                                        <div className="flex items-start gap-2 text-sm text-slate-500">
                                            <AlertCircle size={14} className="mt-0.5 shrink-0" />
                                            <p>
                                                <span className="font-bold text-red-400">PII Warning:</span> All exports are logged.
                                                Re-identification is strictly prohibited. Action logged as: <span className="font-mono text-slate-400">admin_chen_1</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Section>
                    </div>

                    {/* Right Panel - Export History */}
                    <div className="lg:col-span-7">
                        <Section spacing="default">
                            <div className="card-glass rounded-3xl p-8">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-black text-white">Recent Exports</h2>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Search by file ID..."
                                            className="bg-[#0a0c10] border border-slate-800 rounded-lg px-4 py-2 pl-10 text-sm font-medium text-white focus:outline-none focus:border-primary transition-colors w-64"
                                        />
                                        <span className="material-symbols-outlined absolute left-3 top-2 text-slate-500 text-lg">search</span>
                                    </div>
                                </div>

                                {/* Table */}
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-slate-800">
                                                <th className="text-left py-3 px-4 text-sm font-black text-slate-500 uppercase tracking-widest">File Name</th>
                                                <th className="text-left py-3 px-4 text-sm font-black text-slate-500 uppercase tracking-widest">Filters</th>
                                                <th className="text-left py-3 px-4 text-sm font-black text-slate-500 uppercase tracking-widest">Generated</th>
                                                <th className="text-center py-3 px-4 text-sm font-black text-slate-500 uppercase tracking-widest">Count</th>
                                                <th className="text-center py-3 px-4 text-sm font-black text-slate-500 uppercase tracking-widest">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {exportHistory.map((record) => (
                                                <tr key={record.id} className="border-b border-slate-800/50 hover:bg-slate-900/20 transition-colors">
                                                    <td className="py-4 px-4">
                                                        <div className="flex items-center gap-3">
                                                            {getStatusIcon(record.status)}
                                                            <div>
                                                                <div className="text-sm font-bold text-white">{record.fileName}</div>
                                                                <div className="text-sm text-slate-500 font-mono">ID: {record.id}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <div className="flex flex-wrap gap-1">
                                                            {record.filters.split(', ').map((filter, idx) => (
                                                                <span key={idx} className="text-sm font-bold text-slate-400 bg-slate-800/50 px-2 py-0.5 rounded">
                                                                    {filter}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <div className="text-sm text-slate-400">{record.generated}</div>
                                                    </td>
                                                    <td className="py-4 px-4 text-center">
                                                        {record.status === 'complete' ? (
                                                            <span className="text-sm font-black text-white">{record.count.toLocaleString()}</span>
                                                        ) : (
                                                            <span className="text-sm text-slate-600">--</span>
                                                        )}
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <div className="flex items-center justify-center gap-2">
                                                            {record.status === 'complete' && (
                                                                <>
                                                                    <button
                                                                        className="p-2 hover:bg-slate-800 rounded-lg transition-colors group"
                                                                        title="Preview"
                                                                    >
                                                                        <Eye className="text-slate-400 group-hover:text-white" size={16} />
                                                                    </button>
                                                                    <button
                                                                        className="p-2 bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors group"
                                                                        title="Download"
                                                                    >
                                                                        <Download className="text-primary" size={16} />
                                                                    </button>
                                                                </>
                                                            )}
                                                            {record.status === 'failed' && (
                                                                <button className="px-3 py-1 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm font-bold hover:bg-red-500/20 transition-colors">
                                                                    Export Failed
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination */}
                                <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-800">
                                    <div className="text-sm text-slate-500">
                                        Showing <span className="font-bold text-white">1-4</span> of <span className="font-bold text-white">28</span> exports
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="px-4 py-2 bg-slate-900 border border-slate-800 text-slate-400 rounded-lg text-sm font-bold hover:border-slate-700 transition-colors">
                                            Previous
                                        </button>
                                        <button className="px-4 py-2 bg-slate-900 border border-slate-800 text-white rounded-lg text-sm font-bold hover:border-slate-700 transition-colors">
                                            Next
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Section>
                    </div>
                </div>

                {/* Footer Compliance */}
                <Section spacing="tight">
                    <div className="flex items-center justify-center gap-6 text-sm text-slate-600">
                        <div className="flex items-center gap-2">
                            <Shield size={14} />
                            <span>HIPAA Compliant</span>
                        </div>
                        <div className="h-3 w-px bg-slate-800" />
                        <div className="flex items-center gap-2">
                            <Shield size={14} />
                            <span>FDA 21 CFR PART 11</span>
                        </div>
                        <div className="h-3 w-px bg-slate-800" />
                        <span>© 2023 Psychedelic Research Portal • Data Version: 2.1.0-BETA • PsyRes Platform v2.2.1</span>
                    </div>
                </Section>
            </PageContainer>
        </div>
    );
};

export default DataExport;
