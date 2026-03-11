import React from 'react';
import { useNavigate } from 'react-router-dom';

// WO-531: Sterile Schema — "What We Collect" public trust page
// Route: /data-policy (public, no auth required)
// Source spec: public/admin_uploads/PPN_What We Collect_PDF.md

const DataPolicy: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#07101e] text-slate-300">
            {/* JetBrains Mono — scoped to this page only, no global bundle impact */}
            <style>{`@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap');`}</style>

            {/* Fixed Nav Header */}
            <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-[#07101e]/90 backdrop-blur-md border-b border-slate-800/60">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center gap-2 text-slate-400 hover:text-[#A8B5D1] transition-colors text-sm font-bold"
                    aria-label="Go back"
                >
                    <span className="material-symbols-outlined text-base" aria-hidden="true">arrow_back</span>
                    Back
                </button>
                <p className="text-sm font-black text-[#A8B5D1] tracking-[0.15em] uppercase">PPN Portal</p>
            </header>

            <main className="max-w-3xl mx-auto px-6 pt-32 pb-24 space-y-12">

                {/* Hero */}
                <div className="space-y-3">
                    <p className="text-xs font-black uppercase tracking-[0.4em] text-indigo-400">Architecture & Trust</p>
                    <h1 className="ppn-page-title text-[#A8B5D1]">
                        What We Collect
                    </h1>
                    <p className="text-lg font-semibold text-slate-400 leading-relaxed">
                        The Sterile Schema. What We Protect. Why It Matters.
                    </p>
                    <p className="ppn-body text-slate-500">
                        For psychedelic therapy practitioners, data is often viewed as a liability: evidence that could invite regulatory scrutiny or legal exposure. PPN Portal fundamentally changes this dynamic.
                    </p>
                </div>

                {/* Architecture Callout */}
                <div className="p-5 bg-indigo-950/30 border border-indigo-500/20 rounded-2xl">
                    <p className="ppn-body text-slate-300 leading-relaxed">
                        <strong className="text-indigo-400">Zero-Knowledge, No-PHI Architecture.</strong>{' '}
                        By cryptographically separating the process of care from the identity of the patient, PPN Portal ensures your data acts as an immutable shield of clinical diligence, not a legal vulnerability.
                    </p>
                </div>

                {/* Part 1 — Hard Boundaries */}
                <PolicySection title="Part 1 — The Hard Boundaries" subtitle="What We NEVER Collect">
                    <p className="ppn-body text-slate-400 mb-6">
                        Our architecture is designed around <strong className="text-slate-300">Structural Rejection</strong>. We actively block the entry of high-risk data to eliminate breach liability and subpoena risk.
                    </p>
                    <div className="space-y-4">
                        <HardBoundaryItem
                            label="Personally Identifiable Information (PII/PHI)"
                            detail="We never ask for, or store, patient names, email addresses, street addresses, or Social Security Numbers."
                        />
                        <HardBoundaryItem
                            label="Free-Text Clinical Notes"
                            detail="To prevent the accidental entry of PHI or sensitive narrative disclosures, our clinical forms enforce a strict No Free Text policy. All inputs are driven by standardized dropdowns, toggles, and sliders."
                        />
                    </div>
                    <div className="mt-6 p-4 bg-slate-900/60 border border-slate-800 rounded-2xl">
                        <p className="ppn-label mb-2">How We Track Patients</p>
                        <p className="ppn-body text-slate-400 leading-relaxed">
                            The application is <em>amnesiac</em> regarding patient identity. The system relies entirely on a Client-Side Random ID Generator. Example:{' '}
                            <span className="font-mono text-indigo-300 bg-indigo-950/40 px-2 py-0.5 rounded-lg border border-indigo-800/40" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                                PT-KXMR9W2P
                            </span>
                            . You hold the key connecting that ID to your patient; PPN Portal only sees the anonymized string.
                        </p>
                    </div>
                </PolicySection>

                {/* Part 2 — Evidence of Care */}
                <PolicySection title="Part 2 — The Evidence of Care" subtitle="What We DO Collect">
                    <p className="ppn-body text-slate-400 mb-6">
                        PPN Portal captures the exact data required to prove you followed the standard of care, mapped automatically to institutional-grade medical dictionaries.
                    </p>
                    <div className="space-y-6">

                        <EvidenceSubSection number="1" title="Subject Baseline & Demographics">
                            <p className="ppn-body text-slate-500 italic mb-3">We capture demographic signals to enable cross-site benchmarking without exposing identity.</p>
                            <ul className="space-y-2">
                                <DataItem label="Biological Sex" />
                                <DataItem label="Age Group" detail="collected as a generalized band (e.g., 36–45) per HIPAA Safe Harbor, never as an exact date of birth" />
                                <DataItem label="Body Weight" detail="used exclusively for automated dosage safety threshold checks" />
                                <DataItem label="Primary Indication" detail="e.g., Treatment-Resistant Depression, mapped to standard codes" />
                            </ul>
                        </EvidenceSubSection>

                        <EvidenceSubSection number="2" title="The Container Metrics (Set & Setting)">
                            <p className="ppn-body text-slate-500 italic mb-3">We capture the physical and psychological wrapper of the session to standardize real-world evidence.</p>
                            <ul className="space-y-2">
                                <DataItem label="Setting Code" detail="Clinic (Medical), Clinic (Soft), Home (Supervised), or Retreat Center" />
                                <DataItem label="Support Ratio" detail="1:1 (Single Sitter), 2:1 (Co-Therapy Pair), or Group Setting" />
                                <DataItem label="Preparation & Integration Hours" detail="Numeric inputs of time spent outside the dosing session" />
                                <DataItem label="Support Modalities" detail="Checkbox selections (e.g., CBT, Somatic, Internal Family Systems, Music/Playlist presence)" />
                            </ul>
                        </EvidenceSubSection>

                        <EvidenceSubSection number="3" title="The Clinical Intervention">
                            <p className="ppn-body text-slate-500 italic mb-3">We translate your inputs into standardized, research-grade taxonomy.</p>
                            <ul className="space-y-2">
                                <DataItem label="Substance" detail="Mapped to RxNorm Codes (e.g., Psilocybin = 1433, Ketamine = 6130)" />
                                <DataItem label="Dosage & Route" detail="Mapped to UCUM Codes (e.g., 25mg, Oral; 0.5mg/kg, IV)" />
                                <DataItem label="Additional Medications" detail="Selected via a smart grid (e.g., SSRIs, MAOIs, Lithium) to automatically log interaction risk checks" />
                            </ul>
                        </EvidenceSubSection>

                        <EvidenceSubSection number="4" title="Safety & Outcomes Tracking">
                            <p className="ppn-body text-slate-500 italic mb-3">We capture quantifiable efficacy and safety signals.</p>
                            <ul className="space-y-2">
                                <DataItem label="Psychometric Scores" detail="Baseline and post-session tracking via validated scales (e.g., PHQ-9, GAD-7), mapped to LOINC codes" />
                                <DataItem label="Adverse Events" detail="Coded to the MedDRA standard (e.g., Nausea, Mild Distress) to prove diligent monitoring and resolution" />
                                <DataItem label="Session Experience" detail="Sliders for Intensity and Therapeutic challenge vs. bliss" />
                            </ul>
                        </EvidenceSubSection>

                    </div>
                </PolicySection>

                {/* Part 3 — Why This Architecture Protects You */}
                <PolicySection title="Part 3 — Why This Architecture Protects You" subtitle="">
                    <div className="space-y-4">
                        <ProtectionCard
                            number="1"
                            title="Audit-Ready Documentation"
                            body='If your clinic is ever audited by a medical board or an insurer, "no notes" equates to negligence. PPN Portal allows you to export a forensic, timestamped log proving you checked for contraindications, monitored vitals, and followed a data-backed safety protocol.'
                        />
                        <ProtectionCard
                            number="2"
                            title="Immunity to Subpoenas"
                            body="Because PPN Portal operates on a Zero-Knowledge framework, if law enforcement were to subpoena our data, we have nothing to surrender but a string of random numbers and coded selections. The risk of a targeted raid fueled by a centralized database is eliminated."
                        />
                        <ProtectionCard
                            number="3"
                            title="Network Benchmarking"
                            body="Because we do not store PHI, we bypass the regulatory deadlock that prevents traditional EHRs from sharing data. This allows your anonymized clinical outcomes to be benchmarked in real-time against network averages, giving you the evidence you need to refine your protocols and prove your efficacy."
                        />
                    </div>
                </PolicySection>

                {/* Download CTA */}
                <div className="p-8 bg-indigo-950/20 border border-indigo-500/20 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="space-y-2">
                        <p className="ppn-label">Save a Copy</p>
                        <p className="ppn-body text-slate-500">Download the Sterile Schema document to share with legal counsel, clinical advisors, or your team.</p>
                    </div>
                    <button
                        onClick={() => navigate('/data-policy/print')}
                        className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-black rounded-xl uppercase tracking-widest transition-all shadow-xl active:scale-95 whitespace-nowrap"
                        aria-label="Open print-ready one-pager to save as PDF"
                    >
                        <span className="material-symbols-outlined text-base" aria-hidden="true">download</span>
                        Download PDF
                    </button>
                </div>

            </main>

            <footer className="border-t border-slate-900 py-8 text-center">
                <p className="ppn-caption">
                    © 2026 Precision Psychedelic Network (PPN) · All Rights Reserved
                </p>
                <p className="ppn-caption mt-1">
                    Document version 1.0 · 2026-03-05
                </p>
            </footer>
        </div>
    );
};

// ─── Sub-components ──────────────────────────────────────────────────────────

const PolicySection: React.FC<{ title: string; subtitle: string; children: React.ReactNode }> = ({ title, subtitle, children }) => (
    <section className="space-y-6">
        <div className="space-y-1 border-b border-slate-800 pb-4">
            <h2 className="ppn-section-title text-[#A8B5D1] tracking-tight">{title}</h2>
            {subtitle && <p className="text-xs font-black uppercase tracking-[0.3em] text-indigo-400">{subtitle}</p>}
        </div>
        {children}
    </section>
);

const HardBoundaryItem: React.FC<{ label: string; detail: string }> = ({ label, detail }) => (
    <div className="flex items-start gap-4 p-4 bg-slate-900/40 border border-slate-800/60 rounded-2xl">
        <span className="text-xl flex-shrink-0 mt-0.5" role="img" aria-label="Prohibited">🚫</span>
        <div className="space-y-0.5">
            <p className="ppn-body font-bold text-[#A8B5D1]">NO {label}</p>
            <p className="ppn-body text-slate-500">{detail}</p>
        </div>
    </div>
);

const EvidenceSubSection: React.FC<{ number: string; title: string; children: React.ReactNode }> = ({ number, title, children }) => (
    <div className="p-5 bg-slate-900/40 border border-slate-800/60 rounded-2xl space-y-3">
        <div className="flex items-center gap-3">
            <span className="size-7 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-xs font-black text-indigo-300">{number}</span>
            <h3 className="ppn-card-title">{title}</h3>
        </div>
        {children}
    </div>
);

const DataItem: React.FC<{ label: string; detail?: string }> = ({ label, detail }) => (
    <li className="flex items-baseline gap-2">
        <span className="text-slate-500 flex-shrink-0" aria-hidden="true">•</span>
        <p className="ppn-body text-slate-400">
            <strong className="text-slate-300">{label}</strong>
            {detail && <span className="text-slate-500">: {detail}</span>}
        </p>
    </li>
);

const ProtectionCard: React.FC<{ number: string; title: string; body: string }> = ({ number, title, body }) => (
    <div className="flex items-start gap-5 p-5 bg-slate-900/40 border border-slate-800/60 rounded-2xl">
        <span className="text-2xl font-black text-indigo-600/50 flex-shrink-0 leading-none mt-1">{number}.</span>
        <div className="space-y-1.5">
            <h3 className="ppn-card-title">{title}</h3>
            <p className="ppn-body text-slate-400 leading-relaxed">{body}</p>
        </div>
    </div>
);

export default DataPolicy;
