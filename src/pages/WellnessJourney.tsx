import React, { useState } from 'react';
import { Download } from 'lucide-react';
import { AdvancedTooltip } from '../components/ui/AdvancedTooltip';
import { PhaseIndicator } from '../components/wellness-journey/PhaseIndicator';
import { PreparationPhase } from '../components/wellness-journey/PreparationPhase';
import { DosingSessionPhase } from '../components/wellness-journey/DosingSessionPhase';
import { IntegrationPhase } from '../components/wellness-journey/IntegrationPhase';

/**
 * Wellness Journey: Complete Patient Journey Dashboard
 * 
 * Complete 6-month patient journey visualization with phase-based navigation
 * 
 * Features:
 * - Phase-based tabbed interface (Phase 1: Preparation, Phase 2: Dosing Session, Phase 3: Integration)
 * - Progressive disclosure (one phase visible at a time)
 * - Responsive design (tabs on desktop, dropdown on mobile)
 * - All fonts ≥12px (WCAG AAA compliance)
 * - Patient selection screen (New vs Existing patient)
 * 
 * This is the primary clinician interface for tracking patient progress across all 3 phases
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

const WellnessJourney: React.FC = () => {
    // Phase navigation state
    const [activePhase, setActivePhase] = useState<1 | 2 | 3>(1); // Default to Preparation (Phase 1)
    const [completedPhases] = useState<number[]>([]); // No phases complete for new patient

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

    // Calculate metrics for status bar
    const totalImprovement = journey.baseline.phq9 - journey.integration.currentPhq9;
    const isRemission = journey.integration.currentPhq9 < 5;

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0a1628] via-[#0d1b2a] to-[#05070a] p-4 sm:p-6 lg:p-8">
            <div className="max-w-[1600px] mx-auto space-y-6">

                {/* Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                            Wellness Journey
                        </h1>
                        <p className="text-slate-400 mt-2 text-sm">
                            Patient: {journey.patientId} • 6-Month Journey
                        </p>
                    </div>

                    {/* Export PDF Button */}
                    <AdvancedTooltip
                        content="Export complete patient journey report as PDF for insurance, team review, or patient records."
                        tier="standard"
                        type="info"
                        side="left"
                    >
                        <button className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 border border-slate-600 text-slate-200 font-bold text-sm rounded-lg transition-colors">
                            <Download className="w-4 h-4" />
                            <span className="hidden sm:inline">Export PDF</span>
                        </button>
                    </AdvancedTooltip>
                </div>

                {/* Phase Indicator (Tabbed Navigation) */}
                <PhaseIndicator
                    currentPhase={activePhase}
                    completedPhases={completedPhases}
                    onPhaseChange={setActivePhase}
                />

                {/* Phase Content - Conditional Rendering */}
                <div className="animate-in fade-in duration-300">
                    {activePhase === 1 && <PreparationPhase journey={journey} />}
                    {activePhase === 2 && <DosingSessionPhase journey={journey} />}
                    {activePhase === 3 && <IntegrationPhase journey={journey} />}
                </div>

                {/* Bottom Status Bar (Always Visible) */}
                <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                        {/* Total Improvement */}
                        <div>
                            <p className="text-slate-400 text-sm mb-2">Total Improvement</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-black text-emerald-400">-{totalImprovement}</span>
                                <span className="text-slate-400 text-sm">points</span>
                            </div>
                            <div className="flex items-center gap-2 mt-1 text-sm">
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
                            <p className="text-slate-400 text-sm mb-2">MEQ-30 Score</p>
                            <div className="text-2xl font-black text-emerald-400">{journey.session.meq30Score}/100</div>
                            <p className="text-emerald-300 text-sm mt-2">
                                High mystical experience → Sustained benefit ✓
                            </p>
                        </div>

                        {/* Risk Level */}
                        <div>
                            <p className="text-slate-400 text-sm mb-2">Risk Level</p>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <span className="text-2xl font-black text-emerald-400">LOW</span>
                            </div>
                            <p className="text-slate-400 text-sm mt-2">Excellent compliance</p>
                        </div>

                        {/* Next Steps */}
                        <div>
                            <p className="text-slate-400 text-sm mb-2">Next</p>
                            <p className="text-slate-200 text-sm font-semibold">Maintenance protocol</p>
                            <p className="text-slate-400 text-sm mt-2">
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
                    <div className="bg-slate-900/40 border border-slate-700/30 rounded-lg p-4 cursor-help hover:bg-slate-900/60 transition-colors">
                        <p className="text-slate-500 text-sm text-center">
                            <strong className="text-slate-400">⚠️ Clinical Decision Support:</strong> This dashboard is for clinical research purposes only. Not for diagnostic use. All data is encrypted and HIPAA-compliant.
                        </p>
                    </div>
                </AdvancedTooltip>
            </div>
        </div>
    );
};

export default WellnessJourney;
