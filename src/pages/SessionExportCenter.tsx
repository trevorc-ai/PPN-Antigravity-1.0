import React, { useState } from 'react';
import {
    Download, FileText, Shield, FlaskConical, ClipboardList,
    ChevronRight, CheckCircle, Loader2, AlertCircle, Calendar,
    Activity, Heart, Brain, TrendingDown, Package,
    Lock, Zap, BarChart3, Clock, User, BarChart2, Smile, BookOpen
} from 'lucide-react';
import { downloadReport, PatientReportData, ReportType } from '../services/reportGenerator';
import { exportResearchCSV, ResearchRecord } from '../utils/csvExporter';
import { AdvancedTooltip } from '../components/ui/AdvancedTooltip';

// ─── Mock patient / session context ──────────────────────────────────────────
// In production this would come from route params / Supabase context

const MOCK_PATIENT: PatientReportData = {
    patientId: 'SUB-2024-0842',
    treatmentPeriod: { start: '2025-07-14', end: '2026-01-18' },
    baseline: {
        phq9: 21, gad7: 18, ace: 6, pcl5: 52, hrv: 34,
        bp: '128/82', assessmentDate: '2025-07-14',
    },
    dosingSession: {
        date: '2025-08-03',
        substance: 'MDMA-Assisted Therapy',
        doseMg: 125,
        route: 'Oral',
        durationHours: 7.5,
        vitalsCount: 14,
        meq30Score: 72,
        adverseEvents: 1,
    },
    integration: {
        sessionsAttended: 8,
        sessionsScheduled: 10,
        behavioralChanges: 6,
        pulseCheckDays: 82,
        pulseCheckTotal: 90,
        phq9Followup: 8,
        gad7Followup: 7,
        pcl5Followup: 19,
    },
    benchmarkReadiness: 91,
    ageGroup: '35-44',
};

const MOCK_SESSIONS = [
    { id: 'SES-001', date: '2025-08-03', substance: 'MDMA', doseLabel: '125mg oral', durationHours: 7.5, vitalsLogged: 14, meq30: 72, adverseEvents: 1, status: 'complete' as const },
    { id: 'SES-002', date: '2025-09-14', substance: 'MDMA', doseLabel: '125mg oral', durationHours: 7.2, vitalsLogged: 12, meq30: 78, adverseEvents: 0, status: 'complete' as const },
    { id: 'SES-003', date: '2025-11-02', substance: 'MDMA', doseLabel: '100mg oral', durationHours: 6.8, vitalsLogged: 11, meq30: 81, adverseEvents: 0, status: 'complete' as const },
];

// ─── Export package definitions ───────────────────────────────────────────────

interface ExportPackage {
    id: string;
    type: ReportType | 'full-bundle' | 'raw-csv' | 'clinical-pdf' | 'patient-report' | 'data-policy';
    title: string;
    subtitle: string;
    description: string;
    icon: React.ElementType;
    accentColor: string;
    bgColor: string;
    borderColor: string;
    textColor: string;
    badge?: string;
    includes: string[];
    format: 'txt' | 'pdf' | 'csv' | 'zip';
    formatLabel: string;
}

const EXPORT_PACKAGES: ExportPackage[] = [
    {
        id: 'audit',
        type: 'audit',
        title: 'Audit & Compliance Report',
        subtitle: 'Malpractice Defense Ready',
        description: 'Zero-PHI visual PDF with a multi-axis clinical timeline, structured administration log, MedDRA-coded adverse events and interventions, and a SHA-256 cryptographic seal. Ready for legal review, sponsor audits, and medical board submissions.',
        icon: Shield,
        accentColor: 'text-blue-400',
        bgColor: 'bg-blue-500/10',
        borderColor: 'border-blue-500/30',
        textColor: 'text-blue-400',
        badge: 'PDF PREVIEW',
        includes: [
            'Informed consent with timestamp',
            'Full vitals log (all readings)',
            'Adverse event log with severity (MedDRA coded)',
            'Rescue protocol activations',
            'Clinician annotations & observations',
            'Session timeline with elapsed times',
        ],
        format: 'pdf',
        formatLabel: 'PDF',
    },
    {
        id: 'insurance',
        type: 'insurance',
        title: 'Insurance & Billing Report',
        subtitle: 'Payer Audit Ready',
        description: 'PHQ-9 and GAD-7 trajectory with session outcomes. Formatted to support medical necessity documentation and CPT code reimbursement requests.',
        icon: ClipboardList,
        accentColor: 'text-emerald-400',
        bgColor: 'bg-emerald-500/10',
        borderColor: 'border-emerald-500/30',
        textColor: 'text-emerald-400',
        badge: 'CPT READY',
        includes: [
            'PHQ-9 baseline → follow-up comparison',
            'GAD-7 and PCL-5 trajectory',
            'Percentage improvement calculation',
            'Session count and duration summary',
            'Protocol and dosing record',
            'Integration session attendance',
        ],
        format: 'txt',
        formatLabel: 'TXT',
    },
    {
        id: 'research',
        type: 'research',
        title: 'Research Export',
        subtitle: 'HIPAA Safe Harbor De-identified',
        description: 'All clinical data with PHI stripped to Safe Harbor standard. MedDRA-coded adverse events. Contributes to the anonymized network benchmark dataset. Suitable for IRB submission.',
        icon: FlaskConical,
        accentColor: 'text-indigo-400',
        bgColor: 'bg-indigo-500/10',
        borderColor: 'border-indigo-500/30',
        textColor: 'text-indigo-400',
        badge: 'MedDRA + CSV',
        includes: [
            'Age group (not DOB)',
            'Substance, dose, route, duration',
            'MEQ-30 mystical experience score',
            'Outcome trajectory (PHQ-9, GAD-7, PCL-5)',
            'Adverse events — MedDRA SOC / PT / LLT coded',
            'Benchmark percentile position',
        ],
        format: 'csv',
        formatLabel: 'CSV',
    },
    {
        id: 'full-bundle',
        type: 'full-bundle',
        title: 'Full Treatment Series Bundle',
        subtitle: 'All Sessions + Integration',
        description: 'Every data point from first screening through final integration session. All three report types combined into a single comprehensive package.',
        icon: Package,
        accentColor: 'text-amber-400',
        bgColor: 'bg-amber-500/10',
        borderColor: 'border-amber-500/30',
        textColor: 'text-amber-400',
        badge: 'ALL 3 REPORTS',
        includes: [
            'Audit Report (compliance)',
            'Insurance Report (billing)',
            'Research Export (de-identified)',
            'Session-by-session vitals CSV',
            'MEQ-30 questionnaire responses',
            'Pulse check 90-day trend data',
        ],
        format: 'zip',
        formatLabel: 'ZIP',
    },
    {
        id: 'clinical-pdf',
        type: 'clinical-pdf',
        title: 'Clinical Outcomes PDF',
        subtitle: 'Full Visual Report, Print Ready',
        description: '7-page visual report with inline charts: PHQ-9 trajectory, session vitals graph, event log, integration summary, and network benchmarking. Opens in a print preview.',
        icon: BarChart2,
        accentColor: 'text-teal-400',
        bgColor: 'bg-teal-500/10',
        borderColor: 'border-teal-500/30',
        textColor: 'text-teal-400',
        badge: 'PDF PREVIEW',
        includes: [
            'Cover + Executive Summary (Page 1)',
            'Baseline Clinical Profile (Page 2)',
            'PHQ-9 Symptom Trajectory chart (Page 3)',
            'Dosing Session vitals chart + event log (Page 4)',
            'Experience Quality, MEQ-30, CEQ, EDI (Page 5)',
            'Integration + Safety events table (Page 6)',
            'Network Benchmarking + Certification (Page 7)',
        ],
        format: 'pdf',
        formatLabel: 'PDF',
    },
    {
        id: 'patient-report',
        type: 'patient-report',
        title: 'Patient Wellness Report',
        subtitle: 'Jargon-Free · QR-Accessible',
        description: 'A 3-page plain-language summary of the patient\'s wellness journey, designed to be shared directly with the patient. Includes a QR code for mobile access.',
        icon: Smile,
        accentColor: 'text-emerald-400',
        bgColor: 'bg-emerald-500/10',
        borderColor: 'border-emerald-500/30',
        textColor: 'text-emerald-400',
        badge: 'PATIENT-FACING',
        includes: [
            'Emotional arc waveform (plain language)',
            'Before/after comparison table',
            'Wellness radar chart',
            'MEQ-30 experience depth score',
            'What comes next — integration guidance',
            'QR code for mobile access',
        ],
        format: 'pdf',
        formatLabel: 'PDF',
    },
    {
        id: 'data-policy',
        type: 'data-policy',
        title: 'Data Policy PDF',
        subtitle: 'Zero-PHI Architecture · IRB Ready',
        description: 'A 2-page technical document explaining what data is collected, what is stripped, how de-identification works, and MedDRA coding guidance. Always accompanies research exports.',
        icon: BookOpen,
        accentColor: 'text-violet-400',
        bgColor: 'bg-violet-500/10',
        borderColor: 'border-violet-500/30',
        textColor: 'text-violet-400',
        badge: 'IRB COMPANION',
        includes: [
            'Zero-PHI architecture overview',
            'Complete list of exported fields',
            'List of 18 identifiers never included',
            'MedDRA adverse event coding guide',
            'Audit trail & access controls',
            'Citation block for publications',
        ],
        format: 'pdf',
        formatLabel: 'PDF',
    },
];

// ─── Mock research record (used by exportResearchCSV) ────────────────────────
const MOCK_RESEARCH_RECORD: ResearchRecord = {
    subject_id: 'b7f3c2a1-4d9e-4b8f-a2c1-3f7e9d5b1a6c',
    age_group: '35-44',
    substance: 'MDMA',
    dose_mg: 125,
    route: 'Oral',
    session_date: '2025-08-03',
    meq30_total: 72,
    phq9_baseline: 21,
    phq9_followup: 8,
    gad7_baseline: 18,
    gad7_followup: 7,
    pcl5_baseline: 52,
    pcl5_followup: 19,
    pulse_check_adherence_pct: 91,
    integration_sessions_attended: 8,
    adverse_events: [
        { type: 'nausea', severity: 'Grade 1', relatedness: 'Probable', outcome: 'Resolved' },
        { type: 'anxiety', severity: 'Grade 2', relatedness: 'Probable', outcome: 'Resolved' },
    ],
};

// ─── Component ────────────────────────────────────────────────────────────────

const SessionExportCenter: React.FC = () => {
    const [downloading, setDownloading] = useState<string | null>(null);
    const [done, setDone] = useState<Set<string>>(new Set());
    const [selectedSession, setSelectedSession] = useState<string | 'all'>('all');
    const [previewOpen, setPreviewOpen] = useState(false);

    const handleExport = async (pkg: ExportPackage) => {
        if (downloading) return;

        // Audit & Compliance PDF — opens print-preview page in a new tab
        if (pkg.type === 'audit') {
            const sessionParam = selectedSession !== 'all' ? selectedSession : 'PREVIEW';
            window.open(`#/audit-report-pdf?sessionId=${sessionParam}`, '_blank', 'noopener,noreferrer');
            return;
        }

        // Clinical PDF — opens print-preview page in a new tab
        if (pkg.type === 'clinical-pdf') {
            const sessionParam = selectedSession !== 'all' ? selectedSession : '';
            const url = sessionParam
                ? `/clinical-report-pdf?sessionId=${sessionParam}`
                : '/clinical-report-pdf';
            window.open(url, '_blank', 'noopener,noreferrer');
            return;
        }

        // Patient Report PDF — opens jargon-free patient wellness report in a new tab
        if (pkg.type === 'patient-report') {
            const sessionParam = selectedSession !== 'all' ? selectedSession : 'PREVIEW';
            window.open(`#/patient-report-pdf?sessionId=${sessionParam}`, '_blank', 'noopener,noreferrer');
            return;
        }

        // Data Policy PDF — opens Zero-PHI architecture companion doc in a new tab
        if (pkg.type === 'data-policy') {
            window.open('#/data-policy-pdf', '_blank', 'noopener,noreferrer');
            return;
        }

        setDownloading(pkg.id);
        await new Promise(r => setTimeout(r, 1200));

        if (pkg.type === 'insurance') {
            downloadReport(MOCK_PATIENT, pkg.type as ReportType);
        } else if (pkg.type === 'research') {
            // Upgraded: MedDRA-coded CSV output
            exportResearchCSV([MOCK_RESEARCH_RECORD]);
        } else {
            // Full bundle: download all three
            downloadReport(MOCK_PATIENT, 'audit');
            await new Promise(r => setTimeout(r, 200));
            downloadReport(MOCK_PATIENT, 'insurance');
            await new Promise(r => setTimeout(r, 200));
            exportResearchCSV([MOCK_RESEARCH_RECORD]);
        }

        setDownloading(null);
        setDone(prev => new Set([...prev, pkg.id]));
        setTimeout(() => setDone(prev => {
            const next = new Set(prev);
            next.delete(pkg.id);
            return next;
        }), 4000);
    };

    const phq9Improvement = MOCK_PATIENT.baseline?.phq9 && MOCK_PATIENT.integration?.phq9Followup
        ? Math.round(((MOCK_PATIENT.baseline.phq9 - MOCK_PATIENT.integration.phq9Followup) / MOCK_PATIENT.baseline.phq9) * 100)
        : 0;

    const integrationCompliance = MOCK_PATIENT.integration?.sessionsAttended && MOCK_PATIENT.integration?.sessionsScheduled
        ? Math.round((MOCK_PATIENT.integration.sessionsAttended / MOCK_PATIENT.integration.sessionsScheduled) * 100)
        : 0;

    const pulseCompliance = MOCK_PATIENT.integration?.pulseCheckDays && MOCK_PATIENT.integration?.pulseCheckTotal
        ? Math.round((MOCK_PATIENT.integration.pulseCheckDays / MOCK_PATIENT.integration.pulseCheckTotal) * 100)
        : 0;

    return (
        <div className="min-h-screen bg-[#0a1628] p-6 sm:p-10">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* ── Page Header ──────────────────────────────────────────── */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
                                <Download className="w-5 h-5 text-blue-400" />
                            </div>
                            <span className="text-xs font-black uppercase tracking-widest text-blue-400/70">Session Export Center</span>
                        </div>
                        <h1 className="text-4xl font-black tracking-tight text-[#A8B5D1]">Export Clinical Record</h1>
                        <p className="text-lg text-slate-400 mt-2 max-w-xl">
                            Download a complete, structured record of this patient's treatment series, formatted for legal defense, insurance billing, or research contribution.
                        </p>
                    </div>

                    {/* Security badge */}
                    <div className="flex flex-col gap-2 shrink-0">
                        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                            <Lock className="w-4 h-4 text-emerald-400" />
                            <span className="text-xs font-black text-emerald-400 uppercase tracking-widest">HIPAA Compliant</span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/60 border border-slate-700/50 rounded-xl">
                            <Shield className="w-4 h-4 text-slate-400" />
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">21 CFR Part 11 Logged</span>
                        </div>
                    </div>
                </div>

                {/* ── Patient Summary Card ──────────────────────────────────── */}
                <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center">
                                <User className="w-6 h-6 text-slate-400" />
                            </div>
                            <div>
                                <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-0.5">Patient ID</p>
                                <p className="text-xl font-black text-[#A8B5D1] font-mono">{MOCK_PATIENT.patientId}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-slate-500" />
                            <span className="text-sm text-slate-400">
                                Treatment Period: <span className="text-[#A8B5D1] font-bold">Jul 14, 2025, Jan 18, 2026</span>
                            </span>
                        </div>
                    </div>

                    {/* Quick stats row */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {/* PHQ-9 improvement */}
                        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                            <div className="flex items-center gap-2 mb-2">
                                <TrendingDown className="w-4 h-4 text-emerald-400" />
                                <span className="text-xs font-black uppercase tracking-widest text-emerald-400/80">PHQ-9 Δ</span>
                            </div>
                            <p className="text-3xl font-black text-emerald-400">{phq9Improvement}%</p>
                            <p className="text-xs text-emerald-400/70 mt-0.5">21 → {MOCK_PATIENT.integration?.phq9Followup}</p>
                        </div>

                        {/* Dosing sessions */}
                        <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl">
                            <div className="flex items-center gap-2 mb-2">
                                <Zap className="w-4 h-4 text-blue-400" />
                                <span className="text-xs font-black uppercase tracking-widest text-blue-400/80">Dosing Sessions</span>
                            </div>
                            <p className="text-3xl font-black text-blue-400">{MOCK_SESSIONS.length}</p>
                            <p className="text-xs text-blue-400/70 mt-0.5">MDMA-Assisted</p>
                        </div>

                        {/* Integration compliance */}
                        <div className="p-4 bg-slate-800/60 border border-slate-700/50 rounded-2xl">
                            <div className="flex items-center gap-2 mb-2">
                                <Brain className="w-4 h-4 text-indigo-400" />
                                <span className="text-xs font-black uppercase tracking-widest text-slate-500">Integration</span>
                            </div>
                            <p className="text-3xl font-black text-[#A8B5D1]">{integrationCompliance}%</p>
                            <p className="text-xs text-slate-500 mt-0.5">{MOCK_PATIENT.integration?.sessionsAttended}/{MOCK_PATIENT.integration?.sessionsScheduled} sessions</p>
                        </div>

                        {/* Pulse check compliance */}
                        <div className="p-4 bg-slate-800/60 border border-slate-700/50 rounded-2xl">
                            <div className="flex items-center gap-2 mb-2">
                                <Heart className="w-4 h-4 text-pink-400" />
                                <span className="text-xs font-black uppercase tracking-widest text-slate-500">Pulse Checks</span>
                            </div>
                            <p className="text-3xl font-black text-[#A8B5D1]">{pulseCompliance}%</p>
                            <p className="text-xs text-slate-500 mt-0.5">{MOCK_PATIENT.integration?.pulseCheckDays}/{MOCK_PATIENT.integration?.pulseCheckTotal} days</p>
                        </div>
                    </div>
                </div>

                {/* ── Session Scope Selector ───────────────────────────────── */}
                <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <div>
                            <p className="text-sm font-black text-[#A8B5D1] mb-0.5">Export Scope</p>
                            <p className="text-xs text-slate-500">Select a single dosing session or export the full series.</p>
                        </div>
                        <div className="flex flex-wrap gap-2 sm:ml-auto">
                            <button
                                onClick={() => setSelectedSession('all')}
                                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border transition-all ${selectedSession === 'all'
                                    ? 'bg-blue-500/20 border-blue-500/40 text-blue-300'
                                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'}`}
                            >
                                Full Treatment Series
                            </button>
                            {MOCK_SESSIONS.map(session => (
                                <button
                                    key={session.id}
                                    onClick={() => setSelectedSession(session.id)}
                                    className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border transition-all ${selectedSession === session.id
                                        ? 'bg-blue-500/20 border-blue-500/40 text-blue-300'
                                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'}`}
                                >
                                    {session.date} · {session.doseLabel}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Session detail strip (when single session selected) */}
                    {selectedSession !== 'all' && (() => {
                        const s = MOCK_SESSIONS.find(s => s.id === selectedSession);
                        if (!s) return null;
                        return (
                            <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-5 gap-3">
                                {[
                                    { icon: Zap, label: 'Substance', value: s.substance },
                                    { icon: Activity, label: 'Duration', value: `${s.durationHours}h` },
                                    { icon: Heart, label: 'Vitals Logged', value: String(s.vitalsLogged) },
                                    { icon: Brain, label: 'MEQ-30', value: String(s.meq30) },
                                    { icon: AlertCircle, label: 'Adverse Events', value: String(s.adverseEvents) },
                                ].map(item => (
                                    <div key={item.label} className="flex items-center gap-2 p-3 bg-slate-800/40 rounded-xl">
                                        <item.icon className="w-4 h-4 text-slate-400 shrink-0" />
                                        <div>
                                            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">{item.label}</p>
                                            <p className="text-sm font-black text-[#A8B5D1]">{item.value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        );
                    })()}
                </div>

                {/* ── Export Package Cards ─────────────────────────────────── */}
                <div>
                    <h2 className="text-lg font-black text-slate-300 mb-4 uppercase tracking-widest">Choose Export Package</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {EXPORT_PACKAGES.map(pkg => {
                            const Icon = pkg.icon;
                            const isDownloading = downloading === pkg.id;
                            const isDone = done.has(pkg.id);
                            const isDisabled = !!downloading && !isDownloading;

                            return (
                                <div
                                    key={pkg.id}
                                    className={`relative bg-slate-900/60 backdrop-blur-xl border rounded-3xl p-6 transition-all group
                                        ${isDone ? 'border-emerald-500/40' : pkg.borderColor}
                                        ${isDisabled ? 'opacity-50' : 'hover:bg-slate-900/80'}
                                    `}
                                >
                                    {/* Badge */}
                                    {pkg.badge && (
                                        <div className={`absolute top-4 right-4 px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-widest ${pkg.bgColor} ${pkg.textColor} border ${pkg.borderColor}`}>
                                            {pkg.badge}
                                        </div>
                                    )}

                                    {/* Header */}
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${pkg.bgColor} border ${pkg.borderColor}`}>
                                            <Icon className={`w-6 h-6 ${pkg.accentColor}`} />
                                        </div>
                                        <div className="flex-1 pr-20">
                                            <h3 className="text-lg font-black text-[#A8B5D1]">{pkg.title}</h3>
                                            <p className={`text-xs font-bold uppercase tracking-widest ${pkg.textColor} mt-0.5`}>{pkg.subtitle}</p>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <p className="text-sm text-slate-400 mb-5 leading-relaxed">{pkg.description}</p>

                                    {/* Includes list */}
                                    <div className="space-y-1.5 mb-6">
                                        {pkg.includes.map((item, i) => (
                                            <div key={i} className="flex items-start gap-2">
                                                <ChevronRight className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${pkg.accentColor}`} />
                                                <span className="text-xs text-slate-400">{item}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Footer: format tag + download button */}
                                    <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                                        <div className="flex items-center gap-2">
                                            <FileText className="w-4 h-4 text-slate-500" />
                                            <span className={`text-xs font-black uppercase tracking-widest px-2 py-0.5 rounded border ${pkg.bgColor} ${pkg.borderColor} ${pkg.textColor}`}>
                                                {pkg.formatLabel}
                                            </span>
                                            {pkg.id === 'full-bundle' && (
                                                <span className="text-xs text-slate-500 font-bold">· 3 files</span>
                                            )}
                                        </div>

                                        <AdvancedTooltip
                                            content={isDone ? 'Download complete!' : `Download ${pkg.title} as ${pkg.formatLabel}`}
                                            tier="micro"
                                        >
                                            <button
                                                onClick={() => handleExport(pkg)}
                                                disabled={isDisabled || isDownloading}
                                                aria-label={`Download ${pkg.title}`}
                                                aria-busy={isDownloading}
                                                className={`
                                                    flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black uppercase tracking-wider
                                                    transition-all border focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                                                    active:scale-95 disabled:cursor-not-allowed
                                                    ${isDone
                                                        ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400 focus:ring-emerald-500'
                                                        : `${pkg.bgColor} ${pkg.borderColor} ${pkg.textColor} hover:brightness-125`
                                                    }
                                                `}
                                            >
                                                {isDownloading ? (
                                                    <><Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" /><span>Generating...</span></>
                                                ) : isDone ? (
                                                    <><CheckCircle className="w-4 h-4" aria-hidden="true" /><span>Downloaded</span></>
                                                ) : (
                                                    <><Download className="w-4 h-4" aria-hidden="true" /><span>Download</span></>
                                                )}
                                            </button>
                                        </AdvancedTooltip>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* ── Session-by-Session Log ───────────────────────────────── */}
                <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6">
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-3">
                            <BarChart3 className="w-5 h-5 text-slate-400" />
                            <h2 className="text-lg font-black text-[#A8B5D1]">Dosing Session Log</h2>
                        </div>
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{MOCK_SESSIONS.length} sessions</span>
                    </div>

                    <div className="space-y-3">
                        {MOCK_SESSIONS.map((session, index) => (
                            <div
                                key={session.id}
                                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-800/40 border border-slate-700/50 rounded-2xl hover:bg-slate-800/60 transition-colors"
                            >
                                {/* Session identity */}
                                <div className="flex items-center gap-4">
                                    <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center shrink-0">
                                        <span className="text-sm font-black text-blue-400">{index + 1}</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-[#A8B5D1]">{session.date}</p>
                                        <p className="text-xs text-slate-500 font-mono">{session.id}</p>
                                    </div>
                                </div>

                                {/* Session stats */}
                                <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                                    {[
                                        { label: 'Substance', value: session.substance },
                                        { label: 'Dose', value: session.doseLabel },
                                        { label: 'Duration', value: `${session.durationHours}h` },
                                        { label: 'Vitals', value: `${session.vitalsLogged} readings` },
                                        { label: 'MEQ-30', value: String(session.meq30) },
                                    ].map(stat => (
                                        <div key={stat.label} className="text-center">
                                            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">{stat.label}</p>
                                            <p className="text-sm font-black text-slate-300">{stat.value}</p>
                                        </div>
                                    ))}

                                    {/* Adverse event badge */}
                                    <div className={`px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-wider border
                                        ${session.adverseEvents > 0
                                            ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                                            : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'}`
                                    }>
                                        {session.adverseEvents > 0 ? `${session.adverseEvents} AE logged` : 'No AEs'}
                                    </div>
                                </div>

                                {/* Single-session export */}
                                <AdvancedTooltip content="Export audit report for this session only" tier="micro" learnMoreUrl="/help/reports">
                                    <button
                                        onClick={() => handleExport(EXPORT_PACKAGES[0])}
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 text-slate-400 hover:text-[#A8B5D1] text-xs font-bold rounded-xl transition-all uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-blue-500 shrink-0"
                                        aria-label={`Export audit report for session ${session.id}`}
                                    >
                                        <Download className="w-3.5 h-3.5" />
                                        Audit
                                    </button>
                                </AdvancedTooltip>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Compliance Footer ─────────────────────────────────────── */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 pb-6">
                    <div className="flex items-center gap-4 text-xs text-slate-600">
                        <div className="flex items-center gap-1.5">
                            <Shield className="w-3.5 h-3.5" />
                            <span>HIPAA Compliant</span>
                        </div>
                        <div className="h-3 w-px bg-slate-800" />
                        <div className="flex items-center gap-1.5">
                            <Lock className="w-3.5 h-3.5" />
                            <span>FDA 21 CFR Part 11</span>
                        </div>
                        <div className="h-3 w-px bg-slate-800" />
                        <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            <span>All exports logged with timestamp</span>
                        </div>
                    </div>
                    <p className="text-xs text-slate-600">
                        Re-identification of de-identified records is strictly prohibited.
                    </p>
                </div>

            </div>
        </div>
    );
};

export default SessionExportCenter;
