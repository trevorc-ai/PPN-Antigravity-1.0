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

// Previously Missing Analytics Components
import GlobalBenchmarkIntelligence from '../components/analytics/GlobalBenchmarkIntelligence';
import ReceptorBindingHeatmap from '../components/analytics/ReceptorBindingHeatmap';
import RegulatoryWeather from '../components/analytics/RegulatoryWeather';
import InsightFeedPanel from '../components/analytics/InsightFeedPanel';

const ComponentShowcase: React.FC = () => {
    // Mock data
    const mockSessionId = 'test-session-123';
    const mockSessionStartTime = new Date(Date.now() - 3600000); // 1 hour ago

    return (
        <PageContainer className="!max-w-7xl space-y-12 pb-20 pt-8">
            {/* READ-ONLY WARNING BANNER */}
            <div className="bg-amber-500/20 border-2 border-amber-500/50 rounded-xl px-6 py-3 -mt-4">
                <p className="text-amber-300 text-sm font-bold text-center">
                    ⚠️ READ-ONLY SHOWCASE - Do not modify without express user permission
                </p>
            </div>

            {/* Header */}
            <Section spacing="tight">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-5xl font-black tracking-tighter text-slate-300">
                            Component Showcase
                        </h1>
                        <p className="text-slate-300 text-xl mt-2">
                            Visual testing playground - All components in one scrollable page
                        </p>
                    </div>
                    <div className="px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                        <p className="text-sm font-black text-amber-400 uppercase tracking-widest">
                            Testing Only
                        </p>
                    </div>
                </div>
            </Section>

            {/* USER_REVIEW COMPONENTS */}
            <Section spacing="default">
                <h2 className="text-3xl font-black text-slate-300 mb-6 flex items-center gap-3">
                    <span className="px-3 py-1 bg-indigo-600 text-slate-300 text-sm rounded-lg">
                        USER_REVIEW
                    </span>
                    Components from Work Orders
                </h2>

                {/* WO_003: Dosage Calculator */}
                <div className="mb-12">
                    <div className="mb-4">
                        <h3 className="text-xl font-black text-slate-300">Dosage Calculator</h3>
                        <p className="text-sm text-slate-400 font-mono mb-2">Potency Normalizer — Ibogaine HCl vs. Total Plant Alkaloid (TPA)</p>
                        <p className="text-sm text-slate-400 leading-relaxed max-w-3xl">
                            <span className="font-semibold text-slate-300">What this shows:</span> Different forms of ibogaine have different strengths — just like the difference between a shot of espresso and a cup of drip coffee. This calculator converts the amount of substance given into a standardized "active dose" so the care team always knows exactly how much ibogaine a patient is actually receiving, regardless of which form was used.
                        </p>
                    </div>
                    <div className="bg-black border border-slate-800 rounded-2xl p-8">
                        <DosageCalculator sessionId={mockSessionId} />
                    </div>
                </div>

                {/* WO_004: Crisis Logger */}
                <div className="mb-12">
                    <div className="mb-4">
                        <h3 className="text-xl font-black text-slate-300">Crisis Logger</h3>
                        <p className="text-sm text-slate-400 font-mono mb-2">Tactical Incident Logging Interface</p>
                        <p className="text-sm text-slate-400 leading-relaxed max-w-3xl">
                            <span className="font-semibold text-slate-300">What this shows:</span> A real-time log where the clinical team records any unexpected safety event during a session — for example, a patient's heart rate spiking or a moment of extreme psychological distress. Each entry is timestamped automatically. This creates a clear, time-stamped record that protects both the patient and the practitioner.
                        </p>
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
                        <h3 className="text-xl font-black text-slate-300">Blind Vetting Scanner</h3>
                        <p className="text-sm text-slate-400 font-mono mb-2">Client Security Check Terminal</p>
                        <p className="text-sm text-slate-400 leading-relaxed max-w-3xl">
                            <span className="font-semibold text-slate-300">What this shows:</span> Before a patient is admitted to a session, this tool runs a background screen to flag any potential safety concerns — like medications that could interact dangerously with the treatment. The review is done without exposing the patient's name or personal details, protecting their privacy while keeping the clinical team informed.
                        </p>
                    </div>
                    <div className="bg-[#0a0a0a] border border-slate-800 rounded-2xl p-8">
                        <BlindVetting />
                    </div>
                </div>

                {/* WO_008: Profile Edit */}
                <div className="mb-12">
                    <div className="mb-4">
                        <h3 className="text-xl font-black text-slate-300">Practitioner Profile</h3>
                        <p className="text-sm text-slate-400 font-mono mb-2">User Profile Editing & Partner Tiers</p>
                        <p className="text-sm text-slate-400 leading-relaxed max-w-3xl">
                            <span className="font-semibold text-slate-300">What this shows:</span> The account settings page where a practitioner manages their personal details, clinic information, and subscription tier. Different tiers unlock different features — similar to how a streaming service offers different plans. Practitioners can update credentials and contact info here.
                        </p>
                    </div>
                    <div className="bg-gradient-to-b from-[#0a1628] via-[#0d1b2a] to-[#05070a] border border-slate-800 rounded-2xl overflow-hidden">
                        <ProfileEdit />
                    </div>
                </div>
            </Section>

            {/* ANALYTICS COMPONENTS */}
            <Section spacing="default">
                <h2 className="text-3xl font-black text-slate-300 mb-6 flex items-center gap-3">
                    <span className="px-3 py-1 bg-emerald-600 text-slate-300 text-sm rounded-lg">
                        ANALYTICS
                    </span>
                    Charts from Analytics Page
                </h2>

                {/* Clinic Performance Radar */}
                <div className="mb-12">
                    <div className="mb-4">
                        <h3 className="text-xl font-black text-slate-300">Clinic Performance Radar</h3>
                        <p className="text-sm text-slate-400 font-mono mb-2">Clinic Metrics vs. Network Average</p>
                        <p className="text-sm text-slate-400 leading-relaxed max-w-3xl">
                            <span className="font-semibold text-slate-300">What this shows:</span> Think of this like a report card for your clinic, displayed as a spider-web shape. Each point on the web represents a different area — patient safety, session completion rates, follow-up compliance, and more. The bigger and more balanced your web is, the stronger your clinic's overall performance. The dotted line shows how other clinics in the network are doing, so you can see where you stand.
                        </p>
                    </div>
                    <GlassmorphicCard className="h-[500px] relative overflow-hidden">
                        <ClinicPerformanceRadar />
                    </GlassmorphicCard>
                </div>

                {/* Patient Constellation */}
                <div className="mb-12">
                    <div className="mb-4">
                        <h3 className="text-xl font-black text-slate-300">Patient Galaxy</h3>
                        <p className="text-sm text-slate-400 font-mono mb-2">Outcomes Clustering Analysis</p>
                        <p className="text-sm text-slate-400 leading-relaxed max-w-3xl">
                            <span className="font-semibold text-slate-300">What this shows:</span> Each dot in this chart is a patient (shown anonymously). Dots that are close together had similar outcomes — for example, a group of patients who all showed major improvement in anxiety scores will cluster together. This helps clinicians spot patterns: "What do our best outcomes have in common?" It's like finding constellations — individual points that together reveal a bigger picture.
                        </p>
                    </div>
                    <GlassmorphicCard className="h-[500px] relative overflow-hidden">
                        <PatientConstellation />
                    </GlassmorphicCard>
                </div>

                {/* Protocol Efficiency */}
                <div className="mb-12">
                    <div className="mb-4">
                        <h3 className="text-xl font-black text-slate-300">Protocol ROI</h3>
                        <p className="text-sm text-slate-400 font-mono mb-2">Financial Efficiency Modeling</p>
                        <p className="text-sm text-slate-400 leading-relaxed max-w-3xl">
                            <span className="font-semibold text-slate-300">What this shows:</span> This chart compares how different treatment protocols perform financially. It answers the question: "For every dollar spent on this protocol, how much clinical outcome do we get back?" A protocol with high-cost and poor outcomes will look very different from one that's cost-effective and produces strong results. Helps clinic operators decide where to invest their resources.
                        </p>
                    </div>
                    <GlassmorphicCard className="h-[500px] relative overflow-hidden">
                        <ProtocolEfficiency />
                    </GlassmorphicCard>
                </div>

                {/* Molecular Pharmacology */}
                <div className="mb-12">
                    <div className="mb-4">
                        <h3 className="text-xl font-black text-slate-300">Molecular Bridge</h3>
                        <p className="text-sm text-slate-400 font-mono mb-2">Receptor Affinity Profiles</p>
                        <p className="text-sm text-slate-400 leading-relaxed max-w-3xl">
                            <span className="font-semibold text-slate-300">What this shows:</span> Every psychedelic substance works by attaching to specific receptors in the brain — like a key fitting into a lock. This chart shows which "locks" each substance prefers, and how strongly it binds. Understanding this helps clinicians predict how a substance will affect a patient's mood, perception, and heart rate before they ever administer it.
                        </p>
                    </div>
                    <GlassmorphicCard className="h-[500px] relative overflow-hidden">
                        <MolecularPharmacology />
                    </GlassmorphicCard>
                </div>

                {/* Metabolic Risk Gauge */}
                <div className="mb-12">
                    <div className="mb-4">
                        <h3 className="text-xl font-black text-slate-300">Genomic Safety Gauge</h3>
                        <p className="text-sm text-slate-400 font-mono mb-2">CYP450 Metabolic Risk Analysis</p>
                        <p className="text-sm text-slate-400 leading-relaxed max-w-3xl">
                            <span className="font-semibold text-slate-300">What this shows:</span> Your liver uses a family of enzymes called CYP450 to break down medications. Some people's genes cause their liver to process drugs faster or slower than average — which changes how long a substance stays in their system. This gauge shows how a patient's genetic profile affects their risk level, helping the clinical team adjust dosing to avoid dangerous drug build-up.
                        </p>
                    </div>
                    <GlassmorphicCard className="h-[500px] relative overflow-hidden">
                        <MetabolicRiskGauge />
                    </GlassmorphicCard>
                </div>

                {/* Safety Benchmark */}
                <div className="mb-12">
                    <div className="mb-4">
                        <h3 className="text-xl font-black text-slate-300">Safety Performance Benchmark</h3>
                        <p className="text-sm text-slate-400 font-mono mb-2">Adverse Event Rate vs. Network Average</p>
                        <p className="text-sm text-slate-400 leading-relaxed max-w-3xl">
                            <span className="font-semibold text-slate-300">What this shows:</span> This tracks how often something unexpected — like a medical complication or a patient needing emergency support — happened in your clinic, compared to other clinics in the PPN network. A lower bar is better. If your clinic is performing above the network average on safety, this chart will show that clearly. It's your safety score card, updated over time.
                        </p>
                    </div>
                    <div className="bg-[#0a0c12]/50 border border-slate-800/50 rounded-2xl p-6">
                        <SafetyBenchmark />
                    </div>
                </div>
            </Section>

            {/* DEEP-DIVE ORPHAN COMPONENTS */}
            <Section spacing="default">
                <h2 className="text-3xl font-black text-slate-300 mb-6 flex items-center gap-3">
                    <span className="px-3 py-1 bg-purple-600 text-slate-300 text-sm rounded-lg">
                        DEEP-DIVES
                    </span>
                    Orphan Components from Deep-Dive Pages
                </h2>

                {/* Regulatory Mosaic */}
                <div className="mb-12">
                    <div className="mb-4">
                        <h3 className="text-xl font-black text-slate-300">Regulatory Mosaic</h3>
                        <p className="text-sm text-slate-400 font-mono mb-2">Legal & Regulatory Landscape Map</p>
                        <p className="text-sm text-slate-400 leading-relaxed max-w-3xl">
                            <span className="font-semibold text-slate-300">What this shows:</span> The rules around psychedelic therapy vary dramatically depending on where you are — what's legal in Oregon may be completely restricted in another state. This mosaic gives a visual overview of the regulatory environment across different regions and substances, so practitioners always know what's allowed where they practice. Think of it as a legal weather map for the field.
                        </p>
                    </div>
                    <GlassmorphicCard className="h-[500px] relative overflow-hidden">
                        <RegulatoryMosaic />
                    </GlassmorphicCard>
                </div>

                {/* Patient Journey Snapshot */}
                <div className="mb-12">
                    <div className="mb-4">
                        <h3 className="text-xl font-black text-slate-300">Patient Journey Snapshot</h3>
                        <p className="text-sm text-slate-400 font-mono mb-2">Timeline View — Preparation Through Integration</p>
                        <p className="text-sm text-slate-400 leading-relaxed max-w-3xl">
                            <span className="font-semibold text-slate-300">What this shows:</span> A bird's-eye view of a single patient's entire treatment timeline — from their first intake appointment, through the dosing session, all the way into their follow-up integration work. Each milestone is marked so the care team can see at a glance where the patient is in their journey and what's coming next. It's like a travel itinerary for the patient's healing process.
                        </p>
                    </div>
                    <GlassmorphicCard className="h-[500px] relative overflow-hidden">
                        <PatientJourneySnapshot />
                    </GlassmorphicCard>
                </div>

                {/* Revenue Forensics */}
                <div className="mb-12">
                    <div className="mb-4">
                        <h3 className="text-xl font-black text-slate-300">Revenue Forensics</h3>
                        <p className="text-sm text-slate-400 font-mono mb-2">Clinic Financial Audit & Trend Analysis</p>
                        <p className="text-sm text-slate-400 leading-relaxed max-w-3xl">
                            <span className="font-semibold text-slate-300">What this shows:</span> A deep look at where your clinic's money is coming from — and where it's leaking out. This view breaks revenue down by service type, time period, and patient category, then highlights unusual patterns worth investigating. If a certain protocol is generating much less revenue than expected, or costs have spiked, this chart will surface it. It's a financial magnifying glass for practice operators.
                        </p>
                    </div>
                    <GlassmorphicCard className="h-[500px] relative overflow-hidden">
                        <RevenueForensics />
                    </GlassmorphicCard>
                </div>

                {/* Confidence Cone */}
                <div className="mb-12">
                    <div className="mb-4">
                        <h3 className="text-xl font-black text-slate-300">Confidence Cone</h3>
                        <p className="text-sm text-slate-400 font-mono mb-2">Outcome Forecast with Uncertainty Range</p>
                        <p className="text-sm text-slate-400 leading-relaxed max-w-3xl">
                            <span className="font-semibold text-slate-300">What this shows:</span> When we project how a patient's outcomes might improve over time, there's always some uncertainty — the future isn't guaranteed. The "cone" shape on this chart shows the most likely path (the center line) alongside the range of possible outcomes (the wide part of the cone). A narrow cone means we're confident in the prediction. A wide cone means there's more uncertainty. It's an honest picture of what the data can and can't tell us.
                        </p>
                    </div>
                    <GlassmorphicCard className="h-[500px] relative overflow-hidden">
                        <ConfidenceCone />
                    </GlassmorphicCard>
                </div>

                {/* Safety Risk Matrix */}
                <div className="mb-12">
                    <div className="mb-4">
                        <h3 className="text-xl font-black text-slate-300">Safety Risk Matrix</h3>
                        <p className="text-sm text-slate-400 font-mono mb-2">Likelihood × Severity Risk Assessment Grid</p>
                        <p className="text-sm text-slate-400 leading-relaxed max-w-3xl">
                            <span className="font-semibold text-slate-300">What this shows:</span> This is a grid that plots potential risks on two axes: how likely something is to happen, and how serious it would be if it did. A risk in the top-right corner (very likely AND very serious) demands immediate attention. A risk in the bottom-left corner (rare AND minor) can be monitored. This helps care teams prioritize which risks to prepare for first — the same framework hospitals use for patient safety planning.
                        </p>
                    </div>
                    <GlassmorphicCard className="h-[500px] relative overflow-hidden">
                        <SafetyRiskMatrix />
                    </GlassmorphicCard>
                </div>

                {/* Patient Flow Sankey */}
                <div className="mb-12">
                    <div className="mb-4">
                        <h3 className="text-xl font-black text-slate-300">Patient Flow Diagram</h3>
                        <p className="text-sm text-slate-400 font-mono mb-2">Retention & Dropout Funnel — From Intake to Completion</p>
                        <p className="text-sm text-slate-400 leading-relaxed max-w-3xl">
                            <span className="font-semibold text-slate-300">What this shows:</span> This flow chart tracks where patients go after each stage of treatment. The width of each stream tells you how many patients moved forward vs. dropped off. If a large number of patients complete the dosing session but don't show up for integration follow-ups, that gap will be clearly visible here. It's a retention funnel — like water flowing through pipes, showing you exactly where the leaks are.
                        </p>
                    </div>
                    <GlassmorphicCard className="h-[500px] relative overflow-hidden">
                        <PatientFlowSankey />
                    </GlassmorphicCard>
                </div>

                {/* Receptor Binding Heatmap */}
                <div className="mb-12">
                    <div className="mb-4">
                        <h3 className="text-xl font-black text-slate-300">Receptor Binding Affinity Matrix</h3>
                        <p className="text-sm text-slate-400 font-mono mb-2">pKi Heatmap — 10 Compounds × 8 Receptor Systems</p>
                        <p className="text-sm text-slate-400 leading-relaxed max-w-3xl">
                            <span className="font-semibold text-slate-300">What this shows:</span> This color-coded grid compares ten different psychedelic substances against eight types of brain receptors. Each cell is shaded based on how strongly that substance "grabs onto" that receptor — darker means stronger binding. This reference lets clinicians quickly understand things like: "If I use this substance, which brain systems will it most strongly affect — serotonin? Dopamine? Both?" It's essentially a fingerprint for each substance.
                        </p>
                    </div>
                    <ReceptorBindingHeatmap />
                </div>

                {/* Regulatory Weather */}
                <div className="mb-12">
                    <div className="mb-4">
                        <h3 className="text-xl font-black text-slate-300">Regulatory Weather</h3>
                        <p className="text-sm text-slate-400 font-mono mb-2">Live Compliance Status Feed — OHA, DORA, FDA</p>
                        <p className="text-sm text-slate-400 leading-relaxed max-w-3xl">
                            <span className="font-semibold text-slate-300">What this shows:</span> Just like a weather forecast tells you whether to bring an umbrella, this panel tells practitioners whether the regulatory environment is calm, shifting, or stormy. It monitors ongoing changes from key agencies like the Oregon Health Authority (OHA), the FDA, and state-level regulators, and summarizes them in plain terms. If new rules are about to affect your clinic, you'll see the warning here before it becomes a problem.
                        </p>
                    </div>
                    <RegulatoryWeather />
                </div>

                {/* Insight Feed Panel */}
                <div className="mb-12">
                    <div className="mb-4">
                        <h3 className="text-xl font-black text-slate-300">Clinical Intelligence Feed</h3>
                        <p className="text-sm text-slate-400 font-mono mb-2">Actionable Insight Cards — Safety, Signals & Opportunities</p>
                        <p className="text-sm text-slate-400 leading-relaxed max-w-3xl">
                            <span className="font-semibold text-slate-300">What this shows:</span> This is your clinic's smart assistant — a live feed of the most important things you should probably know right now. It might surface a safety warning ("Three patients this week had elevated heart rate during Phase 2"), a trend to investigate ("Your integration completion rate dropped 15% this month"), or an opportunity ("This protocol has a 30% better outcome rate for PTSD patients in similar clinics"). It turns raw data into plain-English action items.
                        </p>
                    </div>
                    <div className="bg-[#0a0c12]/50 border border-slate-800/50 rounded-2xl p-6">
                        <InsightFeedPanel siteId={null} />
                    </div>
                </div>

                {/* Global Benchmark Intelligence */}
                <div className="mb-12">
                    <div className="mb-4">
                        <h3 className="text-xl font-black text-slate-300">Global Benchmark Intelligence</h3>
                        <p className="text-sm text-slate-400 font-mono mb-2">Live Data from Peer-Reviewed Clinical Trial Cohorts Worldwide</p>
                        <p className="text-sm text-slate-400 leading-relaxed max-w-3xl">
                            <span className="font-semibold text-slate-300">What this shows:</span> This panel connects your clinic's outcomes to data from published clinical research around the world. Instead of guessing how your results compare to the broader field, you can see it directly: "Our PTSD remission rate is 12% above what peer-reviewed trials found for similar patients using this protocol." It's like having access to a global scorecard — turning your clinic's data into a conversation with the entire field of psychedelic medicine.
                        </p>
                    </div>
                    <div className="bg-[#0a0c12]/50 border border-slate-800/50 rounded-2xl p-6">
                        <GlobalBenchmarkIntelligence />
                    </div>
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
