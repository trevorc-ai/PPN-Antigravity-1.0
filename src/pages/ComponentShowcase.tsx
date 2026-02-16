import React from 'react';
import { PageContainer } from '../components/layouts/PageContainer';
import { Section } from '../components/layouts/Section';
import { GlassmorphicCard } from '../components/ui/GlassmorphicCard';

// USER_REVIEW Components - Check actual exports
import { DosageCalculator } from '../components/session/DosageCalculator';
import { CrisisLogger } from '../components/session/CrisisLogger';
import { BlindVetting } from '../components/security/BlindVetting';
import ProfileEdit from '../pages/ProfileEdit';

// Analytics Components
import ClinicPerformanceRadar from '../components/analytics/ClinicPerformanceRadar';
import PatientConstellation from '../components/analytics/PatientConstellation';
import ProtocolEfficiency from '../components/analytics/ProtocolEfficiency';
import MolecularPharmacology from '../components/analytics/MolecularPharmacology';
import MetabolicRiskGauge from '../components/analytics/MetabolicRiskGauge';
import SafetyBenchmark from '../components/analytics/SafetyBenchmark';

// Deep-Dive Orphan Components
import RegulatoryMosaic from '../components/analytics/RegulatoryMosaic';
import PatientJourneySnapshot from '../components/analytics/PatientJourneySnapshot';
import RevenueForensics from '../components/analytics/RevenueForensics';
import ConfidenceCone from '../components/analytics/ConfidenceCone';
import SafetyRiskMatrix from '../components/analytics/SafetyRiskMatrix';
import PatientFlowSankey from '../components/analytics/PatientFlowSankey';

const ComponentShowcase: React.FC = () => {
    // Mock data
    const mockSessionId = 'test-session-123';
    const mockSessionStartTime = new Date(Date.now() - 3600000); // 1 hour ago

    return (
        <PageContainer className="!max-w-7xl space-y-12 pb-20 pt-8">
            {/* Header */}
            <Section spacing="tight">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-5xl font-black tracking-tighter text-white">
                            Component Showcase
                        </h1>
                        <p className="text-slate-400 text-xl mt-2">
                            Visual testing playground - All components in one scrollable page
                        </p>
                    </div>
                    <div className="px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                        <p className="text-xs font-black text-amber-400 uppercase tracking-widest">
                            Testing Only
                        </p>
                    </div>
                </div>
            </Section>

            {/* USER_REVIEW COMPONENTS */}
            <Section spacing="default">
                <h2 className="text-3xl font-black text-white mb-6 flex items-center gap-3">
                    <span className="px-3 py-1 bg-indigo-600 text-white text-sm rounded-lg">
                        USER_REVIEW
                    </span>
                    Components from Work Orders
                </h2>

                {/* WO_003: Dosage Calculator */}
                <div className="mb-12">
                    <div className="mb-4">
                        <h3 className="text-xl font-black text-white">WO_003: Dosage Calculator</h3>
                        <p className="text-sm text-slate-400 font-mono">Potency Normalizer Calculator</p>
                    </div>
                    <div className="bg-black border border-slate-800 rounded-2xl p-8">
                        <DosageCalculator sessionId={mockSessionId} />
                    </div>
                </div>

                {/* WO_004: Crisis Logger */}
                <div className="mb-12">
                    <div className="mb-4">
                        <h3 className="text-xl font-black text-white">WO_004: Crisis Logger</h3>
                        <p className="text-sm text-slate-400 font-mono">Tactical Incident Logging Interface</p>
                    </div>
                    <div className="bg-black border border-slate-800 rounded-2xl p-8">
                        <CrisisLogger
                            sessionId={mockSessionId}
                            sessionStartTime={mockSessionStartTime}
                        />
                    </div>
                </div>

                {/* WO_005: Blind Vetting */}
                <div className="mb-12">
                    <div className="mb-4">
                        <h3 className="text-xl font-black text-white">WO_005: Blind Vetting Scanner</h3>
                        <p className="text-sm text-slate-400 font-mono">Client Security Check Terminal</p>
                    </div>
                    <div className="bg-[#0a0a0a] border border-slate-800 rounded-2xl p-8">
                        <BlindVetting />
                    </div>
                </div>

                {/* WO_008: Profile Edit */}
                <div className="mb-12">
                    <div className="mb-4">
                        <h3 className="text-xl font-black text-white">WO_008: Profile Edit</h3>
                        <p className="text-sm text-slate-400 font-mono">User Profile Editing & Partner Tiers</p>
                    </div>
                    <div className="bg-[#0e1117] border border-slate-800 rounded-2xl overflow-hidden">
                        <ProfileEdit />
                    </div>
                </div>
            </Section>

            {/* ANALYTICS COMPONENTS */}
            <Section spacing="default">
                <h2 className="text-3xl font-black text-white mb-6 flex items-center gap-3">
                    <span className="px-3 py-1 bg-emerald-600 text-white text-sm rounded-lg">
                        ANALYTICS
                    </span>
                    Charts from Analytics Page
                </h2>

                {/* Clinic Performance Radar */}
                <div className="mb-12">
                    <div className="mb-4">
                        <h3 className="text-xl font-black text-white">Clinic Performance Radar</h3>
                        <p className="text-sm text-slate-400 font-mono">Clinic metrics vs Network Average</p>
                    </div>
                    <GlassmorphicCard className="h-[500px] relative overflow-hidden">
                        <ClinicPerformanceRadar />
                    </GlassmorphicCard>
                </div>

                {/* Patient Constellation */}
                <div className="mb-12">
                    <div className="mb-4">
                        <h3 className="text-xl font-black text-white">Patient Galaxy</h3>
                        <p className="text-sm text-slate-400 font-mono">Outcomes clustering analysis</p>
                    </div>
                    <GlassmorphicCard className="h-[500px] relative overflow-hidden">
                        <PatientConstellation />
                    </GlassmorphicCard>
                </div>

                {/* Protocol Efficiency */}
                <div className="mb-12">
                    <div className="mb-4">
                        <h3 className="text-xl font-black text-white">Protocol ROI</h3>
                        <p className="text-sm text-slate-400 font-mono">Financial efficiency modeling</p>
                    </div>
                    <GlassmorphicCard className="h-[500px] relative overflow-hidden">
                        <ProtocolEfficiency />
                    </GlassmorphicCard>
                </div>

                {/* Molecular Pharmacology */}
                <div className="mb-12">
                    <div className="mb-4">
                        <h3 className="text-xl font-black text-white">Molecular Bridge</h3>
                        <p className="text-sm text-slate-400 font-mono">Receptor affinity profiles</p>
                    </div>
                    <GlassmorphicCard className="h-[500px] relative overflow-hidden">
                        <MolecularPharmacology />
                    </GlassmorphicCard>
                </div>

                {/* Metabolic Risk Gauge */}
                <div className="mb-12">
                    <div className="mb-4">
                        <h3 className="text-xl font-black text-white">Genomic Safety</h3>
                        <p className="text-sm text-slate-400 font-mono">CYP450 metabolic risk analysis</p>
                    </div>
                    <GlassmorphicCard className="h-[500px] relative overflow-hidden">
                        <MetabolicRiskGauge />
                    </GlassmorphicCard>
                </div>

                {/* Safety Benchmark */}
                <div className="mb-12">
                    <div className="mb-4">
                        <h3 className="text-xl font-black text-white">Safety Performance Benchmark</h3>
                        <p className="text-sm text-slate-400 font-mono">Adverse event rate vs network average</p>
                    </div>
                    <div className="bg-[#0a0c12]/50 border border-slate-800/50 rounded-2xl p-6">
                        <SafetyBenchmark />
                    </div>
                </div>
            </Section>

            {/* DEEP-DIVE ORPHAN COMPONENTS */}
            <Section spacing="default">
                <h2 className="text-3xl font-black text-white mb-6 flex items-center gap-3">
                    <span className="px-3 py-1 bg-purple-600 text-white text-sm rounded-lg">
                        DEEP-DIVES
                    </span>
                    Orphan Components from Deep-Dive Pages
                </h2>

                {/* Regulatory Mosaic */}
                <div className="mb-12">
                    <div className="mb-4">
                        <h3 className="text-xl font-black text-white">Regulatory Mosaic</h3>
                        <p className="text-sm text-slate-400 font-mono">From RegulatoryMapPage</p>
                    </div>
                    <GlassmorphicCard className="h-[500px] relative overflow-hidden">
                        <RegulatoryMosaic />
                    </GlassmorphicCard>
                </div>

                {/* Patient Journey Snapshot */}
                <div className="mb-12">
                    <div className="mb-4">
                        <h3 className="text-xl font-black text-white">Patient Journey Snapshot</h3>
                        <p className="text-sm text-slate-400 font-mono">From PatientJourneyPage</p>
                    </div>
                    <GlassmorphicCard className="h-[500px] relative overflow-hidden">
                        <PatientJourneySnapshot />
                    </GlassmorphicCard>
                </div>

                {/* Revenue Forensics */}
                <div className="mb-12">
                    <div className="mb-4">
                        <h3 className="text-xl font-black text-white">Revenue Forensics</h3>
                        <p className="text-sm text-slate-400 font-mono">From RevenueAuditPage</p>
                    </div>
                    <GlassmorphicCard className="h-[500px] relative overflow-hidden">
                        <RevenueForensics />
                    </GlassmorphicCard>
                </div>

                {/* Confidence Cone */}
                <div className="mb-12">
                    <div className="mb-4">
                        <h3 className="text-xl font-black text-white">Confidence Cone</h3>
                        <p className="text-sm text-slate-400 font-mono">From ComparativeEfficacyPage</p>
                    </div>
                    <GlassmorphicCard className="h-[500px] relative overflow-hidden">
                        <ConfidenceCone />
                    </GlassmorphicCard>
                </div>

                {/* Safety Risk Matrix */}
                <div className="mb-12">
                    <div className="mb-4">
                        <h3 className="text-xl font-black text-white">Safety Risk Matrix</h3>
                        <p className="text-sm text-slate-400 font-mono">From RiskMatrixPage</p>
                    </div>
                    <GlassmorphicCard className="h-[500px] relative overflow-hidden">
                        <SafetyRiskMatrix />
                    </GlassmorphicCard>
                </div>

                {/* Patient Flow Sankey */}
                <div className="mb-12">
                    <div className="mb-4">
                        <h3 className="text-xl font-black text-white">Patient Flow Sankey</h3>
                        <p className="text-sm text-slate-400 font-mono">From PatientRetentionPage</p>
                    </div>
                    <GlassmorphicCard className="h-[500px] relative overflow-hidden">
                        <PatientFlowSankey />
                    </GlassmorphicCard>
                </div>
            </Section>

            {/* Footer */}
            <Section spacing="tight">
                <div className="text-center text-slate-500 text-sm">
                    <p>Component Showcase • Testing Environment • {new Date().toLocaleDateString()}</p>
                    <p className="mt-2">Navigate to <span className="font-mono text-indigo-400">http://localhost:3000/#/component-showcase</span></p>
                </div>
            </Section>
        </PageContainer>
    );
};

export default ComponentShowcase;
