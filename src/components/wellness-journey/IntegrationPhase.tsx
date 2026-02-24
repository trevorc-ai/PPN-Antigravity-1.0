import React, { useState } from 'react';
import { TrendingUp, CheckCircle, ChevronDown, ChevronUp, Download, Heart, Activity, Award, FileText } from 'lucide-react';
import { AdvancedTooltip } from '../ui/AdvancedTooltip';
import SymptomDecayCurve from '../arc-of-care/SymptomDecayCurve';
import PulseCheckWidget from '../arc-of-care/PulseCheckWidget';
import { PatientOutcomePanel } from './PatientOutcomePanel';
import { NeuroplasticityWindowBadge } from './NeuroplasticityWindowBadge';
import { PatientProgressSummary, type ProgressSummaryData } from './PatientProgressSummary';
import { downloadDischargeSummary, type DischargeSummaryData } from '../../services/dischargeSummary';
import { useToast } from '../../contexts/ToastContext';
import { usePhase3Data } from '../../hooks/usePhase3Data';
import { DemoDataBadge } from './DemoDataBadge';

interface IntegrationPhaseProps {
    journey: any;
}

// Mock fallback removed — real data supplied by usePhase3Data hook

export const IntegrationPhase: React.FC<IntegrationPhaseProps> = ({ journey }) => {
    const [showPulseCheck, setShowPulseCheck] = useState(true);
    const [showProgressSummary, setShowProgressSummary] = useState(false);
    const { addToast } = useToast();

    // ── Phase 3 real data hook (WO-402) ────────────────────────────────────────
    const phase3 = usePhase3Data(journey.sessionId, journey.patientId);

    // Derive session date — use journey session date or fall back to ~7 days ago (demo)
    const sessionDateForBadge = journey.sessionDate
        ? new Date(journey.sessionDate)
        : (() => { const d = new Date(); d.setDate(d.getDate() - 7); return d; })();

    // Active pulse trend data — real if available, mock fallback otherwise
    const activePulseTrend = phase3.pulseTrend ?? [];

    // Export 7-day trend as CSV (uses live or mock trend)
    const handleExportTrend = () => {
        const csvRows = [
            'date,day,connection_level,sleep_quality',
            ...activePulseTrend.map(d => `${d.date},${d.day},${d.connection},${d.sleep}`),
        ];
        const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `pulse_check_trend_${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    // Calculate 7-day averages for trend display
    const avgConnection = activePulseTrend.length > 0
        ? (activePulseTrend.reduce((s, d) => s + d.connection, 0) / activePulseTrend.length).toFixed(1)
        : '—';
    const avgSleep = activePulseTrend.length > 0
        ? (activePulseTrend.reduce((s, d) => s + d.sleep, 0) / activePulseTrend.length).toFixed(1)
        : '—';

    // Compliance values — live or mock
    const pulseCompliance = phase3.pulseCheckCompliance ?? journey.integration.pulseCheckCompliance ?? 0;
    const phq9Compliance = phase3.phq9Compliance ?? journey.integration.phq9Compliance ?? 0;
    const intAttended = phase3.integrationSessionsAttended ?? journey.integration.integrationSessionsAttended ?? 0;
    const intScheduled = phase3.integrationSessionsScheduled ?? journey.integration.integrationSessionsScheduled ?? 0;

    // Decay points — live or mock
    const decayPoints = phase3.decayPoints ?? [
        { day: 7, phq9: 14 }, { day: 14, phq9: 11 }, { day: 30, phq9: 9 },
        { day: 60, phq9: 7 }, { day: 90, phq9: 6 }, { day: 120, phq9: 5 },
        { day: 180, phq9: journey.integration.currentPhq9 ?? 4 },
    ];
    const baselinePhq9 = phase3.baselinePhq9 ?? journey.baseline.phq9 ?? 22;

    const handleDischargeSummary = () => {
        // In a real app, this would be fetched from the database
        const mockDischargeData: DischargeSummaryData = {
            patientId: "PT-RISK9W2P",
            siteId: "SITE-001",
            clinicianId: "Provider-1",
            treatmentStart: "2025-08-01",
            treatmentEnd: "2025-11-20",
            dosingSessionsCount: 3,
            integrationSessionsCount: 6,
            diagnosis: "Treatment-Resistant Depression (F33.2)",
            substanceName: "Psilocybin Extract",
            substanceDose: "25mg oral",
            protocolName: "TRD Standard 3-Dose",
            baseline: { phq9: 18, gad7: 15, caps5: 20 },
            final: { phq9: 5, gad7: 6, caps5: 12 },
            meq30Peak: 78,
            responseAchieved: 'YES (>=50% reduction)',
            remissionAchieved: 'YES',
            adverseEventsCount: 1,
            grade3EventsCount: 0,
            chemicalRescueUsed: 'NO',
            ongoingVulnerabilities: "Mild residual anxiety around social situations. No suicidality.",
            referralName: "Unassigned (Pending Referral)",
            followUpWeeks: 4,
            emergencyPlanSummary: "Contact crisis line 988 if symptoms return. Safety plan PDF on file.",
            selfCareSummary: "Continue daily meditation, maintain sleep hygiene, and exercise 3x/week.",
            clinicianStatement: "Patient showed remarkable progress and has achieved clinical remission for TRD. Discharging to step-down outpatient care."
        };

        downloadDischargeSummary(mockDischargeData);
        addToast({ title: 'Discharge Summary Generated', message: 'Final clinical outcome report exported securely.', type: 'success' });
    };

    // Build ProgressSummaryData from current journey
    const progressSummaryData: ProgressSummaryData = {
        subjectId: journey.patientId ?? 'PT-DEMO',
        clinicianName: 'Attending Practitioner',
        clinicName: 'PPN Partner Clinic',
        primaryInstrument: 'PHQ-9',
        baselineScore: journey.baseline?.phq9 ?? 22,
        endpointScore: journey.integration?.currentPhq9 ?? 9,
        followupWeeks: Math.round((journey.daysPostSession ?? 42) / 7),
        completedStages: ['intake', 'preparation', 'dosing', 'integration'],
        nextSteps: [
            '30-day reassessment (PHQ-9) recommended',
            'Continue weekly integration sessions',
            'Maintain daily pulse check logging',
        ],
        sessionDate: journey.sessionDate
            ? new Date(journey.sessionDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
            : undefined,
        substance: journey.session?.substance,
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">

            {/* ── Neuroplasticity Window Badge (WO-241 P1.5) ──────────────── */}
            <NeuroplasticityWindowBadge sessionDate={sessionDateForBadge} windowDays={21} />


            {/* NEW: Longitudinal Outcome Visualizations (WO-312) */}
            {/* WO-402: Fixed sessionId — must be UUID from log_clinical_records, not sessionNumber */}
            <PatientOutcomePanel
                patientId={journey.patientId ?? 'PT-RISK9W2P'}
                sessionId={journey.sessionId ?? ''}
            />

            {/* 1. TOP ROW: Symptom Decay & Pulse Check Widget (Full Width Stack) */}
            <div className="space-y-6">

                {/* Symptom Decay Curve — live data via usePhase3Data */}
                <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-900/10 border-2 border-emerald-500/50 rounded-3xl p-6 shadow-lg shadow-emerald-900/20">
                    <div className="flex items-center justify-between gap-3 mb-6">
                        <div className="flex items-center gap-3">
                            <TrendingUp className="w-8 h-8 text-emerald-400" />
                            <div>
                                <h3 className="text-2xl font-black text-emerald-100">Symptom Decay</h3>
                                <p className="text-xs text-emerald-400/70 font-bold uppercase tracking-widest">PHQ-9 Trajectory</p>
                            </div>
                        </div>
                        <DemoDataBadge isDemo={!phase3.hasRealDecayData} />
                    </div>
                    {phase3.isLoading ? (
                        <div className="h-48 bg-slate-800/30 rounded-2xl animate-pulse" aria-label="Loading symptom decay data" />
                    ) : (
                        <SymptomDecayCurve
                            baselinePhq9={baselinePhq9}
                            dataPoints={decayPoints}
                        />
                    )}
                </div>

                {/* Daily Pulse Check Widget + 7-Day Trend */}
                <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Heart className="w-32 h-32 text-pink-500" />
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <Heart className="w-8 h-8 text-pink-400" />
                                <div>
                                    <h3 className="text-2xl font-bold text-[#A8B5D1]">Daily Pulse</h3>
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Mood & Sleep Tracking</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <AdvancedTooltip content="Export 7-day pulse check trend as CSV for integration session review." tier="micro">
                                    <button
                                        onClick={handleExportTrend}
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400 hover:text-white text-xs font-bold rounded-lg transition-colors uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <Download className="w-3 h-3" />
                                        CSV
                                    </button>
                                </AdvancedTooltip>
                                <button
                                    onClick={() => setShowPulseCheck(!showPulseCheck)}
                                    className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-800 hover:bg-slate-700 transition-colors border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    aria-label={showPulseCheck ? 'Collapse pulse check' : 'Expand pulse check'}
                                >
                                    {showPulseCheck ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                                </button>
                            </div>
                        </div>

                        {showPulseCheck && (
                            <div className="space-y-6 animate-in slide-in-from-top duration-300">
                                {/* 7-Day Trend Summary */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-4 bg-slate-800/40 rounded-xl text-center border border-slate-700/50">
                                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">Avg Connection</p>
                                        {phase3.isLoading
                                            ? <div className="h-8 w-20 mx-auto bg-slate-700/50 rounded-lg animate-pulse" />
                                            : <p className="text-3xl font-black text-pink-400">{avgConnection}<span className="text-base text-slate-600 font-normal">/5</span></p>
                                        }
                                    </div>
                                    <div className="p-4 bg-slate-800/40 rounded-xl text-center border border-slate-700/50">
                                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">Avg Sleep</p>
                                        {phase3.isLoading
                                            ? <div className="h-8 w-20 mx-auto bg-slate-700/50 rounded-lg animate-pulse" />
                                            : <p className="text-3xl font-black text-blue-400">{avgSleep}<span className="text-base text-slate-600 font-normal">/5</span></p>
                                        }
                                    </div>
                                </div>

                                {/* 7-Day Bar Chart */}
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">7-Day Trend</p>
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-1.5">
                                                <div className="w-2 h-2 rounded-full bg-pink-500" />
                                                <span className="text-xs text-slate-500 font-bold uppercase">Connection</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <div className="w-2 h-2 rounded-full bg-blue-500" />
                                                <span className="text-xs text-slate-500 font-bold uppercase">Sleep</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-7 gap-2 h-32 items-end pb-2">
                                        {activePulseTrend.map((d) => (
                                            <div key={d.day} className="flex flex-col items-center gap-2 h-full justify-end group/bar">
                                                {/* Stacked Bars */}
                                                <div className="w-full relative flex flex-col items-center gap-1">
                                                    <div
                                                        className="w-full bg-blue-500/20 border-t-2 border-blue-500 rounded-sm transition-all group-hover/bar:bg-blue-500/40"
                                                        style={{ height: `${(d.sleep / 5) * 40}px` }}
                                                        title={`Sleep: ${d.sleep}/5`}
                                                    />
                                                    <div
                                                        className="w-full bg-pink-500/20 border-t-2 border-pink-500 rounded-sm transition-all group-hover/bar:bg-pink-500/40"
                                                        style={{ height: `${(d.connection / 5) * 40}px` }}
                                                        title={`Connection: ${d.connection}/5`}
                                                    />
                                                </div>
                                                <span className="text-xs font-bold text-slate-500 group-hover/bar:text-slate-300">{d.day.slice(0, 1)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Today's Pulse Check Widget */}
                                <div className="pt-4 border-t border-slate-800">
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-3">Today's Check-In</p>
                                    <PulseCheckWidget
                                        patientId="patient-001"
                                        sessionId={journey.session.sessionNumber}
                                        onSubmit={(data) => {
                                            console.log('[WO-064] Pulse check submitted:', data);
                                        }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* 2. BOTTOM ROW: 3-Column Layout for Compliance, Outcomes, and Insights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Compliance Metrics — live via usePhase3Data */}
                <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 flex flex-col">
                    <div className="flex items-center justify-between gap-3 mb-6">
                        <div className="flex items-center gap-3">
                            <Activity className="w-6 h-6 text-indigo-400" />
                            <h3 className="text-xl font-bold text-[#A8B5D1]">Compliance</h3>
                        </div>
                        <DemoDataBadge isDemo={!phase3.hasRealComplianceData} />
                    </div>

                    <div className="space-y-6 flex-1">
                        {/* Pulse Check Compliance */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
                                <span>Daily Pulse</span>
                                <span className={pulseCompliance >= 80 ? "text-emerald-400" : "text-amber-400"}>
                                    {pulseCompliance}%
                                </span>
                            </div>
                            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-700 ${pulseCompliance >= 80 ? "bg-emerald-500" : "bg-amber-500"}`}
                                    style={{ width: `${pulseCompliance}%` }}
                                />
                            </div>
                        </div>

                        {/* PHQ-9 Compliance */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
                                <span>Weekly PHQ-9</span>
                                <span className={phq9Compliance >= 90 ? "text-emerald-400" : "text-amber-400"}>
                                    {phq9Compliance}%
                                </span>
                            </div>
                            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-700 ${phq9Compliance >= 90 ? "bg-emerald-500" : "bg-amber-500"}`}
                                    style={{ width: `${phq9Compliance}%` }}
                                />
                            </div>
                        </div>

                        {/* Integration Sessions */}
                        <div className="p-4 bg-slate-800/40 border border-slate-700/50 rounded-xl text-center mt-auto">
                            <div className="text-3xl font-black text-indigo-400 mb-1">
                                {intAttended}<span className="text-xl text-slate-500 font-normal">/{intScheduled}</span>
                            </div>
                            <div className="text-xs text-slate-500 font-bold uppercase tracking-widest">Integration Sessions</div>
                        </div>
                    </div>
                </div>

                {/* Quality of Life Improvements */}
                <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <Award className="w-6 h-6 text-amber-400" />
                        <h3 className="text-xl font-bold text-[#A8B5D1]">Key Outcomes</h3>
                    </div>

                    <div className="space-y-4">
                        <div className="p-4 bg-slate-800/40 border border-slate-700/50 rounded-xl flex items-center justify-between">
                            <div>
                                <div className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">WHOQOL-BREF</div>
                                <div className="text-lg font-bold text-slate-300">Quality of Life</div>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-black text-emerald-400">+21%</div>
                                <div className="text-xs text-emerald-500/70 font-bold">68 → 82</div>
                            </div>
                        </div>

                        <div>
                            <div className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-3">Behavioral Wins</div>
                            <div className="space-y-2">
                                {journey.integration.behavioralChanges.map((change: string, index: number) => (
                                    <div key={index} className="flex items-center gap-3 p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-lg">
                                        <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                        <span className="text-sm font-medium text-emerald-100">{change}</span>
                                    </div>
                                ))}
                                {journey.integration.behavioralChanges.length === 0 && (
                                    <div className="p-3 bg-slate-800/20 border border-slate-700/30 rounded-lg text-center">
                                        <span className="text-sm text-slate-500 italic">No behavioral changes recorded yet.</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* AI Insights (Behavioral Correlation) */}
                <div className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-indigo-500/20 rounded-2xl p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Activity className="w-32 h-32 text-indigo-400" />
                    </div>

                    <div className="relative z-10 flex flex-col h-full">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="text-2xl">💡</span>
                            <h3 className="text-xl font-bold text-[#A8B5D1]">Smart Insight</h3>
                        </div>

                        <div className="text-sm font-medium text-slate-300 leading-relaxed flex-1">
                            "Your anxiety (GAD-7) drops by <span className="text-emerald-400 font-bold">40%</span> on weeks where you log at least 3 'Nature Walks' in your journal."
                        </div>

                        <div className="mt-6 pt-4 border-t border-white/5">
                            <div className="flex items-center gap-2 text-xs text-indigo-300 font-bold uppercase tracking-widest">
                                <Activity className="w-3 h-3" />
                                Correlation Found
                            </div>
                            <p className="text-xs text-slate-500 mt-1">Based on 26 weeks of behavioral data.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action row: Progress Summary + Discharge Summary */}
            <div className="pt-8 border-t border-slate-700/50 flex flex-col sm:flex-row items-center gap-4 justify-center">
                {/* Patient Progress Summary (word-of-mouth growth engine) */}
                <button
                    onClick={() => setShowProgressSummary(true)}
                    className="flex items-center justify-center gap-3 w-full sm:w-1/2 py-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-black text-base tracking-wide rounded-2xl shadow border border-slate-600/50 transition-all hover:scale-[1.01] active:scale-[0.99]"
                >
                    <FileText className="w-5 h-5 text-indigo-400" />
                    Generate Patient Progress Summary
                </button>

                {/* Discharge Summary (existing) */}
                <button
                    onClick={handleDischargeSummary}
                    className="flex items-center justify-center gap-3 w-full sm:w-1/2 py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-black text-base tracking-wide rounded-2xl shadow-lg shadow-emerald-900/40 transition-all hover:scale-[1.01] active:scale-[0.99] border border-emerald-500/30"
                >
                    <CheckCircle className="w-5 h-5" />
                    Complete Journey &amp; Discharge Summary
                </button>
            </div>

            {/* Patient Progress Summary Modal */}
            {showProgressSummary && (
                <PatientProgressSummary
                    data={progressSummaryData}
                    onClose={() => setShowProgressSummary(false)}
                />
            )}
        </div>
    );
};
