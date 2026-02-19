import React from 'react';
import { useNavigate } from 'react-router-dom';

const TermsOfService: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#07101e] text-slate-300">
            {/* Nav */}
            <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-[#07101e]/90 backdrop-blur-md border-b border-slate-800/60">
                <button onClick={() => navigate('/landing')} className="flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors text-sm font-bold">
                    <span className="material-symbols-outlined text-base">arrow_back</span>
                    Back to Portal
                </button>
                <p className="text-sm font-black text-slate-200 tracking-[0.15em] uppercase">PPN Portal</p>
            </header>

            <main className="max-w-3xl mx-auto px-6 pt-32 pb-24 space-y-12">
                <div className="space-y-3">
                    <p className="text-xs font-black uppercase tracking-[0.4em] text-primary">Legal</p>
                    <h1 className="text-4xl font-black tracking-tight text-slate-200">Terms of Service</h1>
                    <p className="text-slate-500 font-medium">Effective Date: February 19, 2026 · Last Updated: February 19, 2026</p>
                </div>

                <div className="p-5 bg-slate-900/60 border border-primary/20 rounded-2xl">
                    <p className="text-sm font-bold text-slate-300 leading-relaxed">
                        <strong className="text-primary">Notice:</strong> PPN Portal is a measurement and benchmarking tool.
                        It does not provide medical advice, treatment recommendations, or dosing guidance.
                        Use of this platform does not constitute a clinical relationship between PPN and any patient.
                    </p>
                </div>

                <Section title="1. Acceptance of Terms">
                    <p>
                        By accessing or using PPN Portal (ppnportal.net), operated by Precision Psychedelic Network ("PPN"),
                        you agree to be bound by these Terms of Service. If you do not agree, do not use the platform.
                    </p>
                    <p>
                        These Terms apply to all practitioners, clinic administrators, and institutional members who
                        access PPN Portal under any subscription tier.
                    </p>
                </Section>

                <Section title="2. Eligibility & Practitioner Verification">
                    <p>PPN Portal is available exclusively to:</p>
                    <ul className="list-disc list-inside space-y-2 text-slate-400 pl-2">
                        <li>Licensed healthcare practitioners legally authorized to administer or supervise psychedelic-assisted therapy in their jurisdiction</li>
                        <li>Institutional researchers affiliated with IRB-approved protocols</li>
                        <li>Authorized clinic administrators supporting the above</li>
                    </ul>
                    <p>
                        By creating an account, you represent that you meet these eligibility requirements.
                        PPN reserves the right to verify credentials and suspend any account that does not meet them.
                    </p>
                </Section>

                <Section title="3. Acceptable Use">
                    <p>You agree to use PPN Portal only for lawful purposes and in accordance with these Terms. You agree not to:</p>
                    <ul className="list-disc list-inside space-y-2 text-slate-400 pl-2">
                        <li>Enter any Protected Health Information (PHI) or patient-identifiable data into the platform</li>
                        <li>Share your account credentials with unauthorized persons</li>
                        <li>Attempt to reverse-engineer, scrape, or extract benchmarking data for competitive use</li>
                        <li>Use the platform to provide clinical decisions to patients without independent professional judgment</li>
                        <li>Misrepresent your credentials or institution during registration</li>
                    </ul>
                </Section>

                <Section title="4. De-identification Obligation">
                    <p>
                        <strong className="text-slate-200">You are solely responsible</strong> for ensuring that all data you
                        enter into PPN Portal is fully de-identified in accordance with HIPAA Safe Harbor standards
                        (45 CFR §164.514(b)) before entry. PPN is not liable for PHI submitted in violation of this obligation.
                    </p>
                    <p>
                        PPN's platform enforces de-identification through structured, coded inputs — but technical controls
                        do not substitute for your professional obligation to de-identify data before submission.
                    </p>
                </Section>

                <Section title="5. Subscription & Billing">
                    <p>
                        Access to PPN Portal requires an active subscription. Subscriptions are offered on monthly
                        or annual terms as described on the pricing page. Billing is handled by Stripe. By subscribing,
                        you authorize recurring charges to your payment method.
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-slate-400 pl-2">
                        <li>Subscriptions auto-renew unless cancelled before the renewal date</li>
                        <li>Refunds are not provided for partial billing periods</li>
                        <li>Enterprise and multi-site agreements are governed by a separate Master Subscription Agreement</li>
                    </ul>
                </Section>

                <Section title="6. Intellectual Property">
                    <p>
                        PPN Portal, including its software, benchmarking methodology, safety surveillance algorithms,
                        and user interface, is the intellectual property of Precision Psychedelic Network.
                        You are granted a limited, non-exclusive, non-transferable license to access and use the platform
                        for your internal clinical and research purposes only.
                    </p>
                    <p>
                        De-identified aggregate benchmark data derived from the alliance pool is PPN's proprietary
                        intelligence. You may not export, republish, or commercialize it without written permission.
                    </p>
                </Section>

                <Section title="7. No Medical Advice">
                    <p>
                        PPN Portal provides statistical benchmarks, safety alerts, and outcome tracking tools.
                        <strong className="text-slate-200"> It does not provide medical advice, clinical diagnoses,
                            treatment recommendations, or dosing guidance.</strong> All clinical decisions remain the
                        sole responsibility of the licensed practitioner.
                    </p>
                </Section>

                <Section title="8. Limitation of Liability">
                    <p>
                        To the fullest extent permitted by law, PPN shall not be liable for any indirect, incidental,
                        special, consequential, or punitive damages arising out of your use of or inability to use
                        the platform, including any clinical outcomes or decisions influenced by benchmarking data.
                    </p>
                </Section>

                <Section title="9. Termination">
                    <p>
                        PPN may suspend or terminate your account at any time for violation of these Terms, including
                        submission of PHI or misrepresentation of credentials. You may cancel your subscription at
                        any time through the billing portal. Upon termination, your access to the platform will cease
                        at the end of the current billing period.
                    </p>
                </Section>

                <Section title="10. Governing Law">
                    <p>
                        These Terms are governed by the laws of the State of Maryland, without regard to conflict of law
                        principles. Any disputes shall be resolved exclusively in the state or federal courts located
                        in Baltimore, Maryland.
                    </p>
                </Section>

                <Section title="11. Contact">
                    <p>
                        Precision Psychedelic Network (PPN)<br />
                        Legal: <a href="mailto:legal@ppnportal.net" className="text-primary hover:underline">legal@ppnportal.net</a><br />
                        Platform: ppnportal.net
                    </p>
                    <p className="text-slate-500 text-sm">
                        These Terms may be updated as the platform evolves. Material changes will be communicated
                        via email with at least 14 days notice before taking effect.
                    </p>
                </Section>
            </main>

            <footer className="border-t border-slate-900 py-8 text-center">
                <p className="text-xs text-slate-700 font-medium tracking-widest uppercase">
                    © 2026 Precision Psychedelic Network (PPN) · All Rights Reserved
                </p>
            </footer>
        </div>
    );
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section className="space-y-4">
        <h2 className="text-xl font-black text-slate-200 tracking-tight border-b border-slate-800 pb-3">{title}</h2>
        <div className="space-y-3 text-slate-400 leading-relaxed">{children}</div>
    </section>
);

export default TermsOfService;
