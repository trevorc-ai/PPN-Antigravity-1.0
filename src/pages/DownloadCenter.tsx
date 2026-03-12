import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Download, FileText, Database, Shield, FileOutput,
    ClipboardList, FlaskConical, FileBadge, CodeSquare, Loader2, CheckCircle,
    ChevronDown, Search, X
} from 'lucide-react';
import { PageContainer } from '../components/layouts/PageContainer';
import { Section } from '../components/layouts/Section';
import { exportAllData } from '../services/exportService';
import { AdvancedTooltip } from '../components/ui/AdvancedTooltip';
import { useToast } from '../contexts/ToastContext';

// --- Type Definitions ---
interface DownloadItem {
    id: string;
    title: string;
    description: string;
    icon: React.ElementType;
    format: 'pdf' | 'csv' | 'zip' | 'json';
    actionType: 'route' | 'function' | 'new-tab' | 'simulated';
    actionTarget: string;
    badge?: string;
    accentColor: string;
    bgColor: string;
    borderColor: string;
    textColor: string;
}

interface DownloadCategory {
    title: string;
    description: string;
    items: DownloadItem[];
}

const DOWNLOAD_CATEGORIES: DownloadCategory[] = [
    {
        title: 'Patient & Clinical Records',
        description: 'Export specific patient outcomes, vitals logs, and clinical reports.',
        items: [
            {
                id: 'full-treatment-bundle',
                title: 'Full Treatment Series Bundle',
                description: 'Comprehensive ZIP file with all session vitals, clinical notes, and integration progress for a selected patient.',
                icon: FileOutput,
                format: 'zip',
                actionType: 'route',
                actionTarget: '/session-export',
                accentColor: 'text-blue-400',
                bgColor: 'bg-blue-500/10',
                borderColor: 'border-blue-500/30',
                textColor: 'text-blue-400',
            },
            {
                id: 'clinical-pdf',
                title: 'Clinical Outcomes PDF',
                description: 'Visual tracking of symptom trajectory (PHQ-9, GAD-7) across the treatment cycle. Formatted for print.',
                icon: FileText,
                format: 'pdf',
                actionType: 'route',
                actionTarget: '/session-export',
                accentColor: 'text-teal-400',
                bgColor: 'bg-teal-500/10',
                borderColor: 'border-teal-500/30',
                textColor: 'text-teal-400',
                badge: 'PRINT READY'
            },
            {
                id: 'audit-compliance',
                title: 'Audit & Compliance Reports',
                description: 'Event logs including consent documentation, adverse events, and rescue protocol activations for legal review.',
                icon: Shield,
                format: 'pdf',
                actionType: 'route',
                actionTarget: '/session-export',
                accentColor: 'text-indigo-400',
                bgColor: 'bg-indigo-500/10',
                borderColor: 'border-indigo-500/30',
                textColor: 'text-indigo-400',
            }
        ]
    },
    {
        title: 'Network & Research Data',
        description: 'Aggregate, de-identified datasets for outcomes benchmarking and organizational reporting.',
        items: [
            {
                id: 'custom-dataset-export',
                title: 'Custom Research Datasets',
                description: 'Generate advanced queries filtered by protocol, indication, and date range. Guaranteed Zero-PHI.',
                icon: Database,
                format: 'csv',
                actionType: 'route',
                actionTarget: '/data-export',
                accentColor: 'text-emerald-400',
                bgColor: 'bg-emerald-500/10',
                borderColor: 'border-emerald-500/30',
                textColor: 'text-emerald-400',
                badge: 'DE-IDENTIFIED'
            },
            {
                id: 'json-api-export',
                title: 'Machine-Readable JSON',
                description: 'Export structured cohort metrics for ingestion into external statistical analysis tools (SPSS, R).',
                icon: CodeSquare,
                format: 'json',
                actionType: 'route',
                actionTarget: '/data-export',
                accentColor: 'text-emerald-400',
                bgColor: 'bg-emerald-500/10',
                borderColor: 'border-emerald-500/30',
                textColor: 'text-emerald-400',
            }
        ]
    },
    {
        title: 'Compliance & Infrastructure',
        description: 'System-level auditing and governance documentation.',
        items: [
            {
                id: 'system-audit-logs',
                title: 'System Audit Logs',
                description: 'Complete 21 CFR Part 11 compliant ledger of all user actions, security events, and clinical operations.',
                icon: ClipboardList,
                format: 'csv',
                actionType: 'function',
                actionTarget: 'exportAllData',
                accentColor: 'text-amber-400',
                bgColor: 'bg-amber-500/10',
                borderColor: 'border-amber-500/30',
                textColor: 'text-amber-400',
                badge: 'FULL LEDGER'
            },
            {
                id: 'data-protection-policy',
                title: 'Sterile Schema Data Policy',
                description: 'Official PPN "What We Collect" policy for practitioner legal protection and patient transparency.',
                icon: FileBadge,
                format: 'pdf',
                actionType: 'new-tab',
                actionTarget: '/#/data-policy/print',
                accentColor: 'text-rose-400',
                bgColor: 'bg-rose-500/10',
                borderColor: 'border-rose-500/30',
                textColor: 'text-rose-400',
            }
        ]
    },
    {
        title: 'Forms & Templates',
        description: 'Blank, printable clinical documents for offline use.',
        items: [
            {
                id: 'blank-informed-consent',
                title: 'Informed Consent Template',
                description: 'Standardized informed consent outlining protocols, risks, and clinical setting boundaries.',
                icon: FileText,
                format: 'pdf',
                actionType: 'simulated',
                actionTarget: 'informed-consent.pdf',
                accentColor: 'text-slate-400',
                bgColor: 'bg-slate-800',
                borderColor: 'border-slate-700',
                textColor: 'text-slate-400',
            },
            {
                id: 'blank-meq',
                title: 'Blank MEQ-30 Assessment',
                description: 'Printable version of the Mystical Experience Questionnaire (30-item) for offline patient administration.',
                icon: FlaskConical,
                format: 'pdf',
                actionType: 'simulated',
                actionTarget: 'meq-30-blank.pdf',
                accentColor: 'text-slate-400',
                bgColor: 'bg-slate-800',
                borderColor: 'border-slate-700',
                textColor: 'text-slate-400',
            }
        ]
    }
];

const DownloadCenter: React.FC = () => {
    const navigate = useNavigate();
    const { addToast } = useToast();
    const [downloading, setDownloading] = useState<string | null>(null);
    const [done, setDone] = useState<Set<string>>(new Set());
    const [searchQuery, setSearchQuery] = useState('');
    const [collapsedCategories, setCollapsedCategories] = useState<Set<number>>(new Set());

    const handleAction = async (item: DownloadItem) => {
        if (downloading) return;

        if (item.actionType === 'route') {
            navigate(item.actionTarget);
            return;
        }

        if (item.actionType === 'new-tab') {
            window.open(item.actionTarget, '_blank', 'noopener,noreferrer');
            return;
        }

        // Handle async simulated/functional downloads
        setDownloading(item.id);

        try {
            if (item.actionType === 'function' && item.actionTarget === 'exportAllData') {
                await exportAllData();
                addToast('System Audit Logs exported successfully.', 'success');
            } else if (item.actionType === 'simulated') {
                // Simulate download delay
                await new Promise(r => setTimeout(r, 1500));
                addToast(`${item.title} downloaded.`, 'success');
            }

            setDone(prev => new Set([...prev, item.id]));
            setTimeout(() => setDone(prev => {
                const next = new Set(prev);
                next.delete(item.id);
                return next;
            }), 4000);

        } catch (error) {
            console.error('Download failed:', error);
            addToast('Download failed. Please try again.', 'error');
        } finally {
            setDownloading(null);
        }
    };

    const toggleCategory = (idx: number) => {
        setCollapsedCategories(prev => {
            const next = new Set(prev);
            if (next.has(idx)) next.delete(idx); else next.add(idx);
            return next;
        });
    };

    const filteredCategories = DOWNLOAD_CATEGORIES.map(cat => ({
        ...cat,
        items: cat.items.filter(item =>
            !searchQuery.trim() ||
            item.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
    })).filter(cat => !searchQuery.trim() || cat.items.length > 0);

    return (
        <div className="p-3 sm:p-10 min-h-screen bg-[#0a1628]">
            <PageContainer width="wide">
                {/* ── Page Header ──────────────────────────────────────────── */}
                <Section spacing="tight" className="border-b border-slate-800 pb-4 sm:pb-8 mb-4 sm:mb-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
                                    <Download className="w-6 h-6 text-indigo-400" />
                                </div>
                                <span className="text-xs font-black uppercase tracking-widest text-indigo-400/70">Resource Hub</span>
                            </div>
                            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-[#A8B5D1]">Download Center</h1>
                            <p className="hidden sm:block text-lg text-slate-400 mt-2 max-w-2xl">
                                Your definitive hub for generating records, querying research datasets, obtaining system logs, and retrieving blank clinical documents.
                            </p>
                        </div>
                    </div>
                </Section>

                {/* ── Search Bar ───────────────────────────────────────────── */}
                <div className="relative mb-4 sm:mb-6">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                    <input
                        type="search"
                        placeholder="Search clinical resources, PDFs, or logs…"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-10 py-2.5 bg-slate-900/60 border border-slate-700/50 rounded-xl text-sm text-slate-300 placeholder-slate-500 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500/50 transition-all"
                    />
                    {searchQuery && (
                        <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {/* ── Categories ───────────────────────────────────────────── */}
                <div className="space-y-4 sm:space-y-10">
                    {filteredCategories.map((category, idx) => {
                        const isCollapsed = collapsedCategories.has(idx);
                        return (
                        <div key={idx} className="border border-slate-800/60 rounded-2xl overflow-hidden">
                            {/* Collapsible header */}
                            <button
                                onClick={() => toggleCategory(idx)}
                                className="w-full flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 bg-slate-900/40 hover:bg-slate-900/70 transition-colors"
                                aria-expanded={!isCollapsed}
                            >
                                <div className="text-left">
                                    <h2 className="text-base sm:text-xl font-black text-slate-200">{category.title}</h2>
                                    <p className="hidden sm:block text-xs font-medium text-slate-500 mt-0.5">{category.description}</p>
                                </div>
                                <ChevronDown className={`w-5 h-5 text-slate-500 shrink-0 transition-transform duration-200 ${isCollapsed ? '' : 'rotate-180'}`} />
                            </button>

                            {/* Collapsible content */}
                            {!isCollapsed && (
                            <div className="p-3 sm:p-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
                                    {category.items.map(item => {
                                        const Icon = item.icon;
                                        const isDownloading = downloading === item.id;
                                        const isDone = done.has(item.id);
                                        const isDisabled = !!downloading && !isDownloading;

                                        return (
                                            <div
                                                key={item.id}
                                                className={`relative bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4 sm:p-6 transition-all group flex flex-col h-full
                                                ${isDisabled ? 'opacity-50' : 'hover:bg-slate-900/80 hover:border-slate-600'}
                                            `}
                                            >
                                                {item.badge && (
                                                    <div className={`absolute top-3 right-3 px-2 py-0.5 rounded text-xs font-black uppercase tracking-widest ${item.bgColor} ${item.textColor} border ${item.borderColor}`}>
                                                        {item.badge}
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.bgColor} border ${item.borderColor}`}>
                                                        <Icon className={`w-5 h-5 ${item.accentColor}`} />
                                                    </div>
                                                    <h3 className="text-sm font-black text-[#A8B5D1] leading-tight pr-12">{item.title}</h3>
                                                </div>
                                                <p className="hidden sm:block text-sm text-slate-400 mb-4 flex-1 leading-relaxed">
                                                    {item.description}
                                                </p>
                                                <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 mt-auto">
                                                    <span className={`text-xs font-black uppercase tracking-widest px-2 py-1 rounded border ${item.bgColor} ${item.borderColor} ${item.textColor}`}>
                                                        {item.format}
                                                    </span>
                                                    <AdvancedTooltip
                                                        content={isDone ? 'Completed!' : item.actionType === 'route' ? 'Go to Generator' : `Download ${item.format.toUpperCase()}`}
                                                        tier="micro"
                                                    >
                                                        <button
                                                            onClick={() => handleAction(item)}
                                                            disabled={isDisabled || isDownloading}
                                                            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all border focus:outline-none focus:ring-2 focus:ring-indigo-500 active:scale-95 disabled:cursor-not-allowed
                                                            ${isDone
                                                                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                                                                : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white hover:border-slate-500'
                                                            }`}
                                                        >
                                                            {isDownloading ? (
                                                                <><Loader2 className="w-3.5 h-3.5 animate-spin" /><span>Fetching</span></>
                                                            ) : isDone ? (
                                                                <><CheckCircle className="w-3.5 h-3.5" /><span>Done</span></>
                                                            ) : item.actionType === 'route' ? (
                                                                <span>Open</span>
                                                            ) : (
                                                                <><Download className="w-3.5 h-3.5" /><span>Download</span></>
                                                            )}
                                                        </button>
                                                    </AdvancedTooltip>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                            )}
                        </div>
                        );
                    })}
                </div>
            </PageContainer>
        </div>
    );
};

export default DownloadCenter;
