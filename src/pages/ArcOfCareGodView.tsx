import React, { useState } from 'react';
import { Calendar, Activity, TrendingUp, CheckCircle, Download, ChevronDown, ChevronUp, X, Sparkles } from 'lucide-react';
import { AdvancedTooltip } from '../components/ui/AdvancedTooltip';
import SymptomDecayCurve from '../components/arc-of-care/SymptomDecayCurve';
import AdaptiveAssessmentPage from './AdaptiveAssessmentPage';

/**
 * Arc of Care: "God View" Dashboard (Minimalist Visual-First Design)
 * 
 * Complete 6-month patient journey visualization
 * Based on DESIGNER mockup 4 with progressive disclosure
 * 
 * Features:
 * - Visual-first design (charts, bars, icons)
 * - Collapsible AI panels (reduce cognitive load)
 * - Tooltips for context (hover-to-reveal)
 * - Icon-based metrics (less text)
 * - Progress bars for scores
 * 
 * This is the primary clinician interface for understanding patient progress
 */

interface PatientJourney {
    patientId: string;
    sessionDate: string;
    daysPostSession: number;

    baseline: {
        phq9: number;
        gad7: number;
        aceScore: number;
        expectancy: number;
    };

    session: {
        substance: string;
        dosage: string;
        sessionNumber: number;
        meq30Score: number | null;
        ediScore: number | null;
        ceqScore: number | null;
        safetyEvents: number;
        chemicalRescueUsed: boolean;
    };

    integration: {
        currentPhq9: number;
        pulseCheckCompliance: number;
        phq9Compliance: number;
        integrationSessionsAttended: number;
        integrationSessionsScheduled: number;
        behavioralChanges: string[];
    };
}

const ArcOfCareGodView: React.FC = () => {
    // Collapsible state
    const [showPhase1AI, setShowPhase1AI] = useState(false);
    const [showPhase1Benchmarks, setShowPhase1Benchmarks] = useState(false);
    const [showPhase2AI, setShowPhase2AI] = useState(false);
    const [showPhase3Changes, setShowPhase3Changes] = useState(false);

    // Assessment modal state
    const [showAssessmentModal, setShowAssessmentModal] = useState(false);
    const [assessmentCompleted, setAssessmentCompleted] = useState(false);
    const [assessmentScores, setAssessmentScores] = useState<{
        meq: number;
        edi: number;
        ceq: number;
    } | null>(null);

    // Mock data
    const [journey] = useState<PatientJourney>({
        patientId: 'PT-KXMR9W2P',
        sessionDate: '2025-10-15',
        daysPostSession: 180,

        baseline: {
            phq9: 21,
            gad7: 12,
            aceScore: 4,
            expectancy: 85
        },

        session: {
            substance: 'Psilocybin',
            dosage: '25mg (Oral)',
            sessionNumber: 1,
            meq30Score: 75,
            ediScore: 77,
            ceqScore: 31,
            safetyEvents: 2,
            chemicalRescueUsed: false
        },

        integration: {
            currentPhq9: 5,
            pulseCheckCompliance: 93,
            phq9Compliance: 100,
            integrationSessionsAttended: 8,
            integrationSessionsScheduled: 8,
            behavioralChanges: [
                'Reconnected with father',
                'Started meditation practice',
                'Quit smoking',
                'New job (Day 130)'
            ]
        }
    });

    // Calculate metrics
    const totalImprovement = journey.baseline.phq9 - journey.integration.currentPhq9;
    const improvementPercentage = Math.round((totalImprovement / journey.baseline.phq9) * 100);
    const isRemission = journey.integration.currentPhq9 < 5;

    // Helper: Get severity label and emoji
    const getSeverityInfo = (score: number, type: 'phq9' | 'gad7') => {
        if (type === 'phq9') {
            if (score >= 20) return { label: 'Severe Depression', emoji: '😰', color: 'text-red-400' };
            if (score >= 15) return { label: 'Moderately Severe Depression', emoji: '😔', color: 'text-orange-400' };
            if (score >= 10) return { label: 'Moderate Depression', emoji: '😟', color: 'text-amber-400' };
            if (score >= 5) return { label: 'Mild Depression', emoji: '😕', color: 'text-yellow-400' };
            return { label: 'Minimal Depression', emoji: '😊', color: 'text-emerald-400' };
        } else {
            if (score >= 15) return { label: 'Severe Anxiety', emoji: '😰', color: 'text-red-400' };
            if (score >= 10) return { label: 'Moderate Anxiety', emoji: '😟', color: 'text-amber-400' };
            if (score >= 5) return { label: 'Mild Anxiety', emoji: '😕', color: 'text-yellow-400' };
            return { label: 'Minimal Anxiety', emoji: '😊', color: 'text-emerald-400' };
        }
    };

    const phq9Info = getSeverityInfo(journey.baseline.phq9, 'phq9');
    const gad7Info = getSeverityInfo(journey.baseline.gad7, 'gad7');

    // Helper: Progress bar component
    const ProgressBar: React.FC<{ value: number; max: number; color: string; label: string }> = ({ value, max, color, label }) => {
        const percentage = (value / max) * 100;
        return (
            <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">{label}</span>
                    <span className={`font-bold ${color}`}>{value}/{max}</span>
                </div>
                <div className="h-2 bg-slate-900/60 rounded-full overflow-hidden">
                    <div
                        className={`h-full ${color.replace('text-', 'bg-')} transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                    />
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0a1628] via-[#0d1b2a] to-[#05070a] p-4 sm:p-6 lg:p-8">
            <div className="max-w-[1600px] mx-auto space-y-6">

                {/* Header */}
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-200 tracking-tight">
                            Complete Wellness Journey
                        </h1>
                        <p className="text-slate-400 mt-2 text-sm sm:text-base">
                            Patient: {journey.patientId} • 6-Month Journey
                        </p>
                    </div>

                    <AdvancedTooltip
                        content="Export complete patient journey report as PDF for insurance, team review, or patient records."
                        tier="standard"
                        type="info"
                        side="left"
                    >
                        <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition-colors">
                            <Download className="w-4 h-4" />
                            <span className="hidden sm:inline">Export PDF</span>
                        </button>
                    </AdvancedTooltip>
                </div>

                {/* 3-Phase Timeline */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Phase 1: Preparation */}
                    <div className="bg-gradient-to-br from-red-500/10 to-red-900/10 border-2 border-red-500/50 rounded-2xl p-5 space-y-2.5">
                        {/* Phase header */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                                    <Calendar className="w-5 h-5 text-red-400" />
                                </div>
                                <div>
                                    <p className="text-red-300 text-xs font-semibold uppercase tracking-wide">Phase 1</p>
                                    <h3 className="text-slate-200 text-base font-bold">Preparation</h3>
                                </div>
                            </div>
                            <CheckCircle className="w-5 h-5 text-red-400" />
                        </div>

                        {/* Duration */}
                        <p className="text-slate-400 text-xs">Oct 1-14, 2025 • 2 weeks</p>

                        {/* Key Metrics (Icon-based) */}
                        <div className="grid grid-cols-2 gap-2.5">
                            <AdvancedTooltip
                                content={`PHQ-9: ${journey.baseline.phq9} - ${phq9Info.label}. Patient Health Questionnaire measures depression severity on a 0-27 scale.`}
                                tier="standard"
                                type="clinical"
                                title="PHQ-9"
                            >
                                <div className="p-4 bg-slate-900/40 rounded-lg text-center cursor-help hover:bg-slate-900/60 transition-colors">
                                    <div className={`text-3xl mb-2 ${phq9Info.color}`}>{phq9Info.emoji}</div>
                                    <div className={`text-4xl font-black ${phq9Info.color}`}>{journey.baseline.phq9}</div>
                                    <div className="text-sm text-slate-400 font-semibold mt-1">PHQ-9</div>
                                </div>
                            </AdvancedTooltip>

                            <AdvancedTooltip
                                content={`GAD-7: ${journey.baseline.gad7} - ${gad7Info.label}. Generalized Anxiety Disorder scale measures anxiety severity on a 0-21 scale.`}
                                tier="standard"
                                type="clinical"
                                title="GAD-7"
                            >
                                <div className="p-4 bg-slate-900/40 rounded-lg text-center cursor-help hover:bg-slate-900/60 transition-colors">
                                    <div className={`text-3xl mb-2 ${gad7Info.color}`}>{gad7Info.emoji}</div>
                                    <div className={`text-4xl font-black ${gad7Info.color}`}>{journey.baseline.gad7}</div>
                                    <div className="text-sm text-slate-400 font-semibold mt-1">GAD-7</div>
                                </div>
                            </AdvancedTooltip>

                            <AdvancedTooltip
                                content={`ACE Score: ${journey.baseline.aceScore}. Adverse Childhood Experiences score (0-10). Higher scores correlate with increased trauma and may predict challenging experiences during therapy.`}
                                tier="standard"
                                type="warning"
                                title="ACE Score"
                            >
                                <div className="p-4 bg-slate-900/40 rounded-lg text-center cursor-help hover:bg-slate-900/60 transition-colors">
                                    <div className="text-3xl mb-2">⚠️</div>
                                    <div className="text-4xl font-black text-amber-400">{journey.baseline.aceScore}</div>
                                    <div className="text-sm text-slate-400 font-semibold mt-1">ACE</div>
                                </div>
                            </AdvancedTooltip>

                            <AdvancedTooltip
                                content={`Expectancy: ${journey.baseline.expectancy}/100 - High. Patient's belief in treatment efficacy. High expectancy (>75) correlates with 25% better outcomes.`}
                                tier="standard"
                                type="success"
                                title="Expectancy"
                            >
                                <div className="p-4 bg-slate-900/40 rounded-lg text-center cursor-help hover:bg-slate-900/60 transition-colors">
                                    <div className="text-3xl mb-2">✨</div>
                                    <div className="text-4xl font-black text-emerald-400">{journey.baseline.expectancy}</div>
                                    <div className="text-sm text-slate-400 font-semibold mt-1">Expect</div>
                                </div>
                            </AdvancedTooltip>
                        </div>

                        {/* Collapsible AI Panel */}
                        <button
                            onClick={() => setShowPhase1AI(!showPhase1AI)}
                            className="w-full p-2.5 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center justify-between hover:bg-blue-500/20 transition-colors group"
                        >
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 rounded bg-blue-500/20 flex items-center justify-center">
                                    <span className="text-blue-400 text-xs font-bold">AI</span>
                                </div>
                                <span className="text-blue-300 text-sm font-semibold">Statistical Insights</span>
                                <span className="text-blue-400 text-xs">(2,847 patients)</span>
                            </div>
                            {showPhase1AI ? <ChevronUp className="w-4 h-4 text-blue-400" /> : <ChevronDown className="w-4 h-4 text-blue-400 group-hover:animate-bounce" />}
                        </button>

                        {showPhase1AI && (
                            <div className="space-y-2 animate-in slide-in-from-top duration-300 mt-2">
                                <div className="p-3 bg-slate-900/40 rounded-lg">
                                    <p className="text-xs text-slate-400 mb-1">Historical Success Rate</p>
                                    <p className="text-emerald-400 text-sm font-bold">72% achieved remission (PHQ-9 &lt; 5)</p>
                                    <p className="text-slate-500 text-xs mt-1">At 6-month follow-up</p>
                                </div>
                                <div className="p-3 bg-slate-900/40 rounded-lg">
                                    <p className="text-xs text-slate-400 mb-1">Experience Pattern</p>
                                    <p className="text-amber-400 text-sm font-bold">45% experienced challenging moments</p>
                                    <p className="text-slate-500 text-xs mt-1">CEQ score &gt; 50 during session</p>
                                </div>
                                <div className="p-3 bg-slate-900/40 rounded-lg">
                                    <p className="text-xs text-slate-400 mb-1">Integration Pattern</p>
                                    <p className="text-blue-400 text-sm font-bold">Average: 6 sessions over 6 months</p>
                                    <p className="text-slate-500 text-xs mt-1">Among patients with ACE ≥ 4</p>
                                </div>
                                <AdvancedTooltip
                                    content="This system provides statistical data and historical patterns for informational purposes only. It does not provide medical advice, diagnosis, or treatment recommendations. All clinical decisions remain the sole responsibility of the licensed healthcare provider."
                                    tier="standard"
                                    type="warning"
                                    title="Legal Disclaimer"
                                >
                                    <div className="flex items-center justify-center gap-1 text-slate-500 text-xs cursor-help hover:text-slate-400 transition-colors">
                                        <span>⚠️</span>
                                        <span className="italic">For informational purposes only</span>
                                    </div>
                                </AdvancedTooltip>
                            </div>
                        )}

                        {/* Collapsible Benchmarks */}
                        <button
                            onClick={() => setShowPhase1Benchmarks(!showPhase1Benchmarks)}
                            className="w-full p-2.5 bg-purple-500/10 border border-purple-500/20 rounded-lg flex items-center justify-between hover:bg-purple-500/20 transition-colors group"
                        >
                            <span className="text-purple-300 text-sm font-semibold">Comparative Benchmarks</span>
                            {showPhase1Benchmarks ? <ChevronUp className="w-4 h-4 text-purple-400" /> : <ChevronDown className="w-4 h-4 text-purple-400 group-hover:animate-bounce" />}
                        </button>

                        {showPhase1Benchmarks && (
                            <div className="space-y-3 animate-in slide-in-from-top duration-300 mt-2">
                                <div className="space-y-1">
                                    <p className="text-xs text-slate-400 mb-2">PHQ-9 Comparison</p>
                                    <div className="flex items-center gap-2 text-xs">
                                        <span className="w-16 text-slate-500">You</span>
                                        <div className="flex-1 h-2 bg-slate-900/60 rounded-full overflow-hidden">
                                            <div className="h-full bg-red-400" style={{ width: `${(journey.baseline.phq9 / 27) * 100}%` }} />
                                        </div>
                                        <span className="w-8 text-red-400 font-bold">{journey.baseline.phq9}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs">
                                        <span className="w-16 text-slate-500">Clinic</span>
                                        <div className="flex-1 h-2 bg-slate-900/60 rounded-full overflow-hidden">
                                            <div className="h-full bg-slate-400" style={{ width: `${(18 / 27) * 100}%` }} />
                                        </div>
                                        <span className="w-8 text-slate-400">18</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs">
                                        <span className="w-16 text-slate-500">Global</span>
                                        <div className="flex-1 h-2 bg-slate-900/60 rounded-full overflow-hidden">
                                            <div className="h-full bg-slate-400" style={{ width: `${(17 / 27) * 100}%` }} />
                                        </div>
                                        <span className="w-8 text-slate-400">17</span>
                                    </div>
                                </div>
                                <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded text-xs text-emerald-300">
                                    💡 High expectancy (85) correlates with 25% better outcomes
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Phase 2: Dosing Session */}
                    <div className="bg-gradient-to-br from-amber-500/10 to-amber-900/10 border-2 border-amber-500/50 rounded-2xl p-6 space-y-4">
                        {/* Phase header */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                                    <Activity className="w-5 h-5 text-amber-400" />
                                </div>
                                <div>
                                    <p className="text-amber-300 text-xs font-semibold uppercase tracking-wide">Phase 2</p>
                                    <h3 className="text-slate-200 text-base font-bold">Dosing Session</h3>
                                </div>
                            </div>
                            <CheckCircle className="w-5 h-5 text-amber-400" />
                        </div>

                        {/* Duration */}
                        <p className="text-slate-400 text-xs">Oct 15, 2025 • 8 hours</p>

                        {/* Session Info */}
                        <div className="p-3 bg-slate-900/40 rounded-lg text-xs text-slate-400">
                            <p>{journey.session.substance} {journey.session.dosage}</p>
                            <p>Session #{journey.session.sessionNumber}</p>
                        </div>

                        {/* Complete Assessment Button */}
                        {!assessmentCompleted ? (
                            <button
                                onClick={() => setShowAssessmentModal(true)}
                                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl font-bold text-lg transition-all shadow-xl shadow-amber-500/40 hover:shadow-2xl hover:shadow-amber-500/50 hover:scale-[1.02] active:scale-[0.98]"
                            >
                                <Sparkles className="w-5 h-5" />
                                Complete Post-Session Assessments
                            </button>
                        ) : (
                            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                                <div className="flex items-center gap-2 mb-3">
                                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                                    <span className="text-emerald-300 font-semibold text-sm">Assessments Complete</span>
                                </div>
                                {assessmentScores && (
                                    <div className="space-y-2 text-xs">
                                        <div className="flex items-center justify-between">
                                            <span className="text-slate-400">MEQ-30 (Mystical)</span>
                                            <span className="text-emerald-400 font-bold">{assessmentScores.meq}/100</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-slate-400">EDI (Ego Dissolution)</span>
                                            <span className="text-blue-400 font-bold">{assessmentScores.edi}/100</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-slate-400">CEQ (Challenging)</span>
                                            <span className="text-amber-400 font-bold">{assessmentScores.ceq}/100</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Experience Metrics (Progress Bars) */}
                        <div className="space-y-4">
                            <p className="text-slate-200 text-sm font-bold mb-3 uppercase tracking-wide">Experience Metrics</p>

                            <AdvancedTooltip
                                content="MEQ-30: Mystical Experience Questionnaire. Scores ≥60 indicate 'complete mystical experience' and correlate with 87% remission rate at 6 months."
                                tier="standard"
                                type="science"
                                title="MEQ-30"
                            >
                                <div className="cursor-help">
                                    <ProgressBar
                                        value={journey.session.meq30Score!}
                                        max={100}
                                        color="text-emerald-400"
                                        label="MEQ-30 (Mystical)"
                                    />
                                </div>
                            </AdvancedTooltip>

                            <AdvancedTooltip
                                content="EDI: Ego Dissolution Inventory. Measures the intensity of ego dissolution during the experience. Scores ≥70 indicate high ego dissolution."
                                tier="standard"
                                type="science"
                                title="EDI"
                            >
                                <div className="cursor-help">
                                    <ProgressBar
                                        value={journey.session.ediScore!}
                                        max={100}
                                        color="text-emerald-400"
                                        label="EDI (Ego Dissolution)"
                                    />
                                </div>
                            </AdvancedTooltip>

                            <AdvancedTooltip
                                content="CEQ: Challenging Experience Questionnaire. Scores 30-50 indicate moderately challenging experience. Higher scores may require additional integration support."
                                tier="standard"
                                type="warning"
                                title="CEQ"
                            >
                                <div className="cursor-help">
                                    <ProgressBar
                                        value={journey.session.ceqScore!}
                                        max={100}
                                        color="text-amber-400"
                                        label="CEQ (Challenging)"
                                    />
                                </div>
                            </AdvancedTooltip>
                        </div>

                        {/* Safety */}
                        <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg mt-2">
                            <p className="text-amber-200 text-sm font-bold mb-2 uppercase tracking-wide">Safety</p>
                            <p className="text-slate-200 text-sm font-medium">✓ {journey.session.safetyEvents} events (resolved)</p>
                            <p className="text-slate-200 text-sm font-medium">✓ No chemical rescue</p>
                        </div>

                        {/* Collapsible AI Panel */}
                        <button
                            onClick={() => setShowPhase2AI(!showPhase2AI)}
                            className="w-full p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center justify-between hover:bg-blue-500/20 transition-colors group"
                        >
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 rounded bg-blue-500/20 flex items-center justify-center">
                                    <span className="text-blue-400 text-xs font-bold">AI</span>
                                </div>
                                <span className="text-blue-300 text-sm font-semibold">Outcome Prediction</span>
                                <span className="text-blue-400 text-xs">(1,247 patients)</span>
                            </div>
                            {showPhase2AI ? <ChevronUp className="w-4 h-4 text-blue-400" /> : <ChevronDown className="w-4 h-4 text-blue-400 group-hover:animate-bounce" />}
                        </button>

                        {showPhase2AI && (
                            <div className="space-y-2 animate-in slide-in-from-top duration-300">
                                <div className="p-3 bg-slate-900/40 rounded-lg">
                                    <p className="text-xs text-slate-400 mb-1">6-Month Remission Rate</p>
                                    <p className="text-emerald-400 text-sm font-bold">89% achieved PHQ-9 &lt; 5</p>
                                    <p className="text-slate-500 text-xs mt-1">Among patients with MEQ ≥ 70</p>
                                </div>
                                <div className="p-3 bg-slate-900/40 rounded-lg">
                                    <p className="text-xs text-slate-400 mb-1">Sustained Benefit</p>
                                    <p className="text-emerald-400 text-sm font-bold">76% maintained gains at 12 months</p>
                                    <p className="text-slate-500 text-xs mt-1">Only 2% relapsed</p>
                                </div>
                                <div className="p-3 bg-slate-900/40 rounded-lg">
                                    <p className="text-xs text-slate-400 mb-1">Integration Pattern</p>
                                    <p className="text-blue-400 text-sm font-bold">Standard protocol (6 sessions)</p>
                                    <p className="text-slate-500 text-xs mt-1">CEQ 30-40: 78% success</p>
                                </div>
                                <AdvancedTooltip
                                    content="Historical data for context only. Provider determines treatment approach."
                                    tier="standard"
                                    type="warning"
                                >
                                    <div className="flex items-center justify-center gap-1 text-slate-500 text-xs cursor-help hover:text-slate-400 transition-colors">
                                        <span>⚠️</span>
                                        <span className="italic">Provider determines approach</span>
                                    </div>
                                </AdvancedTooltip>
                            </div>
                        )}
                    </div>

                    {/* Phase 3: Integration */}
                    <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-900/10 border-2 border-emerald-500/50 rounded-2xl p-6 space-y-4">
                        {/* Phase header */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                                </div>
                                <div>
                                    <p className="text-emerald-300 text-xs font-semibold uppercase tracking-wide">Phase 3</p>
                                    <h3 className="text-slate-200 text-base font-bold">Integration</h3>
                                </div>
                            </div>
                            <CheckCircle className="w-5 h-5 text-emerald-400" />
                        </div>

                        {/* Duration */}
                        <p className="text-slate-400 text-xs">Oct 16, 2025 - Apr 1, 2026 • 6 months</p>

                        {/* Symptom Decay Curve */}
                        <SymptomDecayCurve
                            baselinePhq9={journey.baseline.phq9}
                            dataPoints={[
                                { day: 7, phq9: 14 },
                                { day: 14, phq9: 11 },
                                { day: 30, phq9: 9 },
                                { day: 60, phq9: 7 },
                                { day: 90, phq9: 6 },
                                { day: 120, phq9: 5 },
                                { day: 180, phq9: journey.integration.currentPhq9 }
                            ]}
                        />

                        {/* Quality of Life Improvements (Collapsible) */}
                        <button
                            onClick={() => setShowPhase3Changes(!showPhase3Changes)}
                            className="w-full p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center justify-between hover:bg-emerald-500/20 transition-colors group"
                        >
                            <span className="text-emerald-300 text-sm font-semibold">Quality of Life</span>
                            <div className="flex items-center gap-2">
                                <span className="text-emerald-400 text-xs">✓ {journey.integration.behavioralChanges.length} changes</span>
                                {showPhase3Changes ? <ChevronUp className="w-4 h-4 text-emerald-400" /> : <ChevronDown className="w-4 h-4 text-emerald-400 group-hover:animate-bounce" />}
                            </div>
                        </button>

                        {showPhase3Changes && (
                            <div className="space-y-2 animate-in slide-in-from-top duration-300">
                                {journey.integration.behavioralChanges.map((change, index) => (
                                    <div key={index} className="flex items-start gap-2 text-xs text-emerald-300 p-2 bg-slate-900/40 rounded">
                                        <CheckCircle className="w-3 h-3 flex-shrink-0 mt-0.5" />
                                        <span>{change}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Compliance Metrics (Visual) */}
                        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg space-y-2">
                            <p className="text-emerald-300 text-xs font-semibold mb-2">Compliance</p>

                            <AdvancedTooltip
                                content="Daily pulse checks measure mood, sleep, and well-being. High compliance (>90%) correlates with better outcomes."
                                tier="standard"
                                type="clinical"
                            >
                                <div className="cursor-help">
                                    <div className="flex items-center justify-between text-xs mb-1">
                                        <span className="text-slate-400">Pulse Checks</span>
                                        <span className="text-emerald-400 font-bold">{journey.integration.pulseCheckCompliance}%</span>
                                    </div>
                                    <div className="h-1.5 bg-slate-900/60 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-400" style={{ width: `${journey.integration.pulseCheckCompliance}%` }} />
                                    </div>
                                </div>
                            </AdvancedTooltip>

                            <AdvancedTooltip
                                content="Weekly PHQ-9 assessments track depression symptoms over time. 100% compliance indicates excellent engagement."
                                tier="standard"
                                type="clinical"
                            >
                                <div className="cursor-help">
                                    <div className="flex items-center justify-between text-xs mb-1">
                                        <span className="text-slate-400">Weekly PHQ-9</span>
                                        <span className="text-emerald-400 font-bold">{journey.integration.phq9Compliance}%</span>
                                    </div>
                                    <div className="h-1.5 bg-slate-900/60 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-400" style={{ width: `${journey.integration.phq9Compliance}%` }} />
                                    </div>
                                </div>
                            </AdvancedTooltip>

                            <div className="flex items-center justify-between text-xs pt-1">
                                <span className="text-slate-400">Integration Sessions</span>
                                <span className="text-emerald-400 font-bold">
                                    {journey.integration.integrationSessionsAttended}/{journey.integration.integrationSessionsScheduled}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Status Bar */}
                <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                        {/* Total Improvement */}
                        <div>
                            <p className="text-slate-400 text-xs mb-2">Total Improvement</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-black text-emerald-400">-{totalImprovement}</span>
                                <span className="text-slate-400 text-sm">points</span>
                            </div>
                            <div className="flex items-center gap-2 mt-1 text-xs">
                                <span className="text-red-400">Baseline: {journey.baseline.phq9}</span>
                                <span className="text-slate-500">→</span>
                                <span className="text-emerald-400">Today: {journey.integration.currentPhq9}</span>
                            </div>
                            <p className="text-emerald-300 text-sm font-semibold mt-2">
                                {isRemission ? '✓ REMISSION' : '↗ IMPROVING'}
                            </p>
                        </div>

                        {/* MEQ-30 Correlation */}
                        <div>
                            <p className="text-slate-400 text-xs mb-2">MEQ-30 Score</p>
                            <div className="text-2xl font-black text-emerald-400">{journey.session.meq30Score}/100</div>
                            <p className="text-emerald-300 text-xs mt-2">
                                High mystical experience → Sustained benefit ✓
                            </p>
                        </div>

                        {/* Risk Level */}
                        <div>
                            <p className="text-slate-400 text-xs mb-2">Risk Level</p>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                                </div>
                                <span className="text-2xl font-black text-emerald-400">LOW</span>
                            </div>
                            <p className="text-slate-400 text-xs mt-2">Excellent compliance</p>
                        </div>

                        {/* Next Steps */}
                        <div>
                            <p className="text-slate-400 text-xs mb-2">Next</p>
                            <p className="text-slate-200 text-sm font-semibold">Maintenance protocol</p>
                            <p className="text-slate-400 text-xs mt-2">
                                Transition to quarterly check-ins
                            </p>
                        </div>
                    </div>
                </div>

                {/* Global Disclaimer */}
                <AdvancedTooltip
                    content="This system provides statistical data and historical patterns for informational purposes only. It does not provide medical advice, diagnosis, or treatment recommendations. All clinical decisions remain the sole responsibility of the licensed healthcare provider."
                    tier="standard"
                    type="warning"
                    title="Legal Disclaimer"
                    width="w-96"
                >
                    <div className="bg-slate-900/40 border border-slate-700/30 rounded-lg p-3 cursor-help hover:bg-slate-900/60 transition-colors">
                        <p className="text-slate-500 text-xs text-center">
                            <strong className="text-slate-400">⚠️ Clinical Decision Support:</strong> Hover for legal disclaimer
                        </p>
                    </div>
                </AdvancedTooltip>
            </div>

            {/* Assessment Modal */}
            {showAssessmentModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-gradient-to-b from-[#0a1628] via-[#0d1b2a] to-[#05070a] rounded-2xl shadow-2xl">
                        {/* Close button */}
                        <button
                            onClick={() => setShowAssessmentModal(false)}
                            className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-slate-800/80 hover:bg-slate-700 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5 text-slate-300" />
                        </button>

                        {/* Assessment content */}
                        <div className="p-6">
                            <AdaptiveAssessmentPage
                                showBackButton={false}
                                onComplete={(scores) => {
                                    // Update state with scores
                                    setAssessmentScores(scores);
                                    setAssessmentCompleted(true);
                                    // Close modal after a brief delay to show completion
                                    setTimeout(() => {
                                        setShowAssessmentModal(false);
                                    }, 3000);
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ArcOfCareGodView;
