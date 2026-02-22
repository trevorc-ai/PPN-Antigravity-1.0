import React from 'react';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#07101e] text-slate-300">
            {/* Nav */}
            <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-[#07101e]/90 backdrop-blur-md border-b border-slate-800/60">
                <button onClick={() => navigate('/landing')} className="flex items-center gap-2 text-slate-400 hover:text-[#A8B5D1] transition-colors text-sm font-bold">
                    <span className="material-symbols-outlined text-base">arrow_back</span>
                    Back to Portal
                </button>
                <p className="text-sm font-black text-[#A8B5D1] tracking-[0.15em] uppercase">PPN Portal</p>
            </header>

            <main className="max-w-3xl mx-auto px-6 pt-32 pb-24 space-y-12">
                <div className="space-y-3">
                    <p className="text-xs font-black uppercase tracking-[0.4em] text-primary">Legal</p>
                    <h1 className="text-4xl font-black tracking-tight text-[#A8B5D1]">Privacy and Anonymity Policy</h1>
                    <p className="text-slate-500 font-medium">Effective Date: February 19, 2026 · Last Updated: February 19, 2026</p>
                </div>

                <div className="p-5 bg-slate-900/60 border border-primary/20 rounded-2xl">
                    <p className="text-sm font-bold text-slate-300 leading-relaxed">
                        <strong className="text-primary">Important (Zero Architecture):</strong> It is more than just a policy that we never collect names: we <em>can't</em>. It is technically not possible for us to collect names, emails, or personal identifiers. We guarantee privacy upfront by structural design—we literally do not have the database fields to store them. PPN Portal relies on our "Phantom Shield" architecture to guarantee absolute anonymity for the gray market and clinical networks alike.
                    </p>
                </div>

                <Section title="1. About PPN Portal">
                    <p>
                        Precision Psychedelic Network ("PPN," "we," "our," or "us") operates PPN Portal, a clinical
                        intelligence platform for psychedelic wellness practitioners. PPN Portal enables practitioners
                        to log de-identified protocol and outcome data, receive safety alerts, and benchmark their
                        practice against de-identified peer data.
                    </p>
                    <p>
                        This Privacy and Anonymity Policy describes how we collect, use, and protect information in connection
                        with your use of our platform at ppnportal.net.
                    </p>
                </Section>

                <Section title="2. Information We Collect">
                    <SubSection title="Account Information">
                        <p>When you create an account, we collect your professional email address, name, credentials
                            (e.g., license type, state), and clinic or practice name. We do not collect your home address,
                            Social Security Number, or personal financial information except as required for billing.</p>
                    </SubSection>
                    <SubSection title="Clinical Protocol Data (De-identified Only)">
                        <p>You may submit protocol and outcome data. Per our platform design and data agreement,
                            <strong> all data entered must be fully de-identified</strong> — no patient names, dates of birth,
                            MRN numbers, geographic data smaller than state, or any other HIPAA Safe Harbor identifiers.
                            We do not accept, store, or process PHI.</p>
                    </SubSection>
                    <SubSection title="Usage Data">
                        <p>We automatically collect standard server log data including IP addresses, browser type,
                            pages visited, and session duration for security and performance purposes.</p>
                    </SubSection>
                </Section>

                <Section title="3. De-identification Policy">
                    <p>
                        PPN Portal operates under HIPAA Safe Harbor de-identification standards (45 CFR §164.514(b)).
                        Before any outcome data enters our system:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-slate-400 pl-2">
                        <li>All 18 HIPAA Safe Harbor identifiers must be removed</li>
                        <li>Patient ages are generalized (e.g., "35–44" age band, not exact DOB)</li>
                        <li>Geographic data is limited to state level or above</li>
                        <li>Session dates are generalized to month/year only</li>
                        <li>No free-text notes containing identifiable information are accepted</li>
                    </ul>
                    <p className="text-slate-400">
                        Our system enforces these constraints at the form and API level — structured inputs only,
                        coded selections stored as foreign key IDs, not free text.
                    </p>
                </Section>

                <Section title="4. How We Use Your Information">
                    <ul className="list-disc list-inside space-y-2 text-slate-400 pl-2">
                        <li>To provide, operate, and improve PPN Portal</li>
                        <li>To generate de-identified benchmarks and safety signals for the alliance</li>
                        <li>To send you service notifications, safety alerts, and product updates</li>
                        <li>To process subscription billing via Stripe (we do not store card numbers)</li>
                        <li>To comply with applicable laws and professional standards</li>
                    </ul>
                    <p className="text-slate-400">We do not sell your data. We do not share your data with third-party advertisers.</p>
                </Section>

                <Section title="5. Data Security">
                    <p>
                        PPN Portal is built on enterprise-grade infrastructure with the following security controls:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-slate-400 pl-2">
                        <li>All data encrypted in transit (TLS 1.3) and at rest (AES-256)</li>
                        <li>Row-Level Security (RLS) enforced at the database level</li>
                        <li>Role-based access control — practitioners can only access their own clinic's data</li>
                        <li>HIPAA-compliant cloud infrastructure (SOC 2 compliant provider)</li>
                        <li>Audit logs maintained for all data access events</li>
                    </ul>
                </Section>

                <Section title="6. Data Retention">
                    <p>
                        We retain your account data for as long as your account is active. De-identified protocol
                        data contributed to the alliance benchmarking pool is retained indefinitely as part of the
                        longitudinal dataset. You may request deletion of your account and personal account information
                        at any time by contacting us at <a href="mailto:privacy@ppnportal.net" className="text-primary hover:underline">privacy@ppnportal.net</a>.
                    </p>
                </Section>

                <Section title="7. Third-Party Services">
                    <ul className="list-disc list-inside space-y-2 text-slate-400 pl-2">
                        <li><strong className="text-slate-300">Supabase</strong> — Database and authentication infrastructure (SOC 2 Type II compliant)</li>
                        <li><strong className="text-slate-300">Stripe</strong> — Payment processing (PCI DSS Level 1 compliant; we never see your card number)</li>
                        <li><strong className="text-slate-300">Vercel</strong> — Application hosting (SOC 2 compliant)</li>
                    </ul>
                </Section>

                <Section title="8. Your Rights">
                    <p>Depending on your jurisdiction, you may have rights including:</p>
                    <ul className="list-disc list-inside space-y-2 text-slate-400 pl-2">
                        <li>Right to access the personal information we hold about you</li>
                        <li>Right to correct inaccurate personal information</li>
                        <li>Right to request deletion of your personal account data</li>
                        <li>Right to data portability (your submitted protocol records)</li>
                        <li>Right to opt out of non-essential communications</li>
                    </ul>
                    <p>Contact us at <a href="mailto:privacy@ppnportal.net" className="text-primary hover:underline">privacy@ppnportal.net</a> to exercise any of these rights.</p>
                </Section>

                <Section title="9. Contact">
                    <p>
                        Precision Psychedelic Network (PPN)<br />
                        Privacy Officer: <a href="mailto:privacy@ppnportal.net" className="text-primary hover:underline">privacy@ppnportal.net</a><br />
                        Platform: ppnportal.net
                    </p>
                    <p className="text-slate-500 text-sm">
                        This policy will be updated as our platform and legal obligations evolve. Material changes
                        will be communicated via email to registered practitioners.
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
        <h2 className="text-xl font-black text-[#A8B5D1] tracking-tight border-b border-slate-800 pb-3">{title}</h2>
        <div className="space-y-3 text-slate-400 leading-relaxed">{children}</div>
    </section>
);

const SubSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="space-y-2">
        <h3 className="text-base font-bold text-slate-300">{title}</h3>
        <div className="text-slate-400 leading-relaxed">{children}</div>
    </div>
);

export default PrivacyPolicy;
