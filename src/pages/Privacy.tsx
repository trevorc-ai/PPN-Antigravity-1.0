import React from 'react';
import { LegalPageLayout } from '../components/LegalPageLayout';
import { Shield, Lock, Check } from 'lucide-react';

const tableOfContents = [
    { id: 'section-1', title: '1. Introduction' },
    { id: 'section-2', title: '2. Information We Collect' },
    { id: 'section-3', title: '3. How We Use Your Information' },
    { id: 'section-4', title: '4. HIPAA Compliance' },
    { id: 'section-5', title: '5. Data Security' },
    { id: 'section-6', title: '6. Data Sharing' },
    { id: 'section-7', title: '7. Data Retention' },
    { id: 'section-8', title: '8. Your Rights' },
    { id: 'section-9', title: '9. Cookies and Tracking' },
    { id: 'section-10', title: '10. Children\'s Privacy' },
    { id: 'section-11', title: '11. International Users' },
    { id: 'section-12', title: '12. Changes to This Policy' },
    { id: 'section-13', title: '13. Contact Us' },
    { id: 'section-14', title: '14. Complaints' },
];

const Privacy: React.FC = () => {
    return (
        <LegalPageLayout
            title="Privacy Policy"
            effectiveDate="February 13, 2026"
            tableOfContents={tableOfContents}
        >
            {/* Section 1 */}
            <section id="section-1" className="mb-12">
                <h2 className="text-2xl font-bold text-slate-100 mb-4">1. Introduction</h2>
                <p className="text-slate-300 leading-relaxed mb-4">
                    PPN Research Portal ("we," "us," "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Service.
                </p>
            </section>

            {/* Section 2 */}
            <section id="section-2" className="mb-12">
                <h2 className="text-2xl font-bold text-slate-100 mb-4">2. Information We Collect</h2>

                <h3 className="text-xl font-semibold text-slate-200 mb-3">2.1 Account Information</h3>
                <ul className="list-disc list-inside text-slate-300 leading-relaxed mb-4 space-y-2">
                    <li>Name</li>
                    <li>Email address</li>
                    <li>Professional credentials (license number, specialty)</li>
                    <li>Organization/clinic name</li>
                </ul>

                <h3 className="text-xl font-semibold text-slate-200 mb-3">2.2 Usage Data</h3>
                <ul className="list-disc list-inside text-slate-300 leading-relaxed mb-4 space-y-2">
                    <li>Login times and IP addresses</li>
                    <li>Pages visited and features used</li>
                    <li>Device and browser information</li>
                    <li>Analytics data (anonymized)</li>
                </ul>

                <h3 className="text-xl font-semibold text-slate-200 mb-3">2.3 Clinical Data (De-Identified)</h3>
                <ul className="list-disc list-inside text-slate-300 leading-relaxed mb-4 space-y-2">
                    <li>Protocol information (substance, dosage, indication)</li>
                    <li>Patient outcomes (de-identified, no PHI/PII)</li>
                    <li>Aggregated benchmarking data</li>
                </ul>

                <h3 className="text-xl font-semibold text-slate-200 mb-3">2.4 Payment Information</h3>
                <p className="text-slate-300 leading-relaxed mb-4">
                    Payment information is processed by Stripe. We do not store credit card numbers.
                </p>
            </section>

            {/* Section 3 */}
            <section id="section-3" className="mb-12">
                <h2 className="text-2xl font-bold text-slate-100 mb-4">3. How We Use Your Information</h2>

                <h3 className="text-xl font-semibold text-slate-200 mb-3">3.1 To Provide the Service</h3>
                <ul className="list-disc list-inside text-slate-300 leading-relaxed mb-4 space-y-2">
                    <li>Create and manage your account</li>
                    <li>Process payments</li>
                    <li>Provide clinical decision support</li>
                    <li>Generate analytics and benchmarking</li>
                </ul>

                <h3 className="text-xl font-semibold text-slate-200 mb-3">3.2 To Improve the Service</h3>
                <ul className="list-disc list-inside text-slate-300 leading-relaxed mb-4 space-y-2">
                    <li>Analyze usage patterns</li>
                    <li>Develop new features</li>
                    <li>Conduct research (aggregated, de-identified data only)</li>
                </ul>

                <h3 className="text-xl font-semibold text-slate-200 mb-3">3.3 To Communicate</h3>
                <ul className="list-disc list-inside text-slate-300 leading-relaxed mb-4 space-y-2">
                    <li>Send service updates and notifications</li>
                    <li>Respond to support requests</li>
                    <li>Send marketing communications (opt-out available)</li>
                </ul>
            </section>

            {/* Section 4 - HIPAA Compliance (Highlighted) */}
            <section id="section-4" className="mb-12">
                <div className="border-l-4 border-teal-400 pl-6 py-2 bg-teal-950/20">
                    <h2 className="text-2xl font-bold text-slate-100 mb-4 flex items-center gap-2">
                        <Shield className="w-6 h-6 text-teal-400" />
                        4. HIPAA Compliance
                    </h2>

                    <h3 className="text-xl font-semibold text-slate-200 mb-3">4.1 Business Associate Agreement</h3>
                    <p className="text-slate-300 leading-relaxed mb-4">
                        We are a HIPAA-covered Business Associate and will sign a BAA with all users.
                    </p>

                    <h3 className="text-xl font-semibold text-slate-200 mb-3">4.2 Protected Health Information (PHI)</h3>
                    <p className="text-slate-300 leading-relaxed mb-4">
                        We do NOT collect or store PHI. All patient data must be de-identified before entry into the system.
                    </p>

                    <h3 className="text-xl font-semibold text-slate-200 mb-3">4.3 Minimum Necessary Standard</h3>
                    <p className="text-slate-300 leading-relaxed mb-4">
                        We collect only the minimum data necessary to provide the Service.
                    </p>
                </div>
            </section>

            {/* Section 5 - Data Security */}
            <section id="section-5" className="mb-12">
                <h2 className="text-2xl font-bold text-slate-100 mb-4 flex items-center gap-2">
                    <Lock className="w-6 h-6 text-teal-400" />
                    5. Data Security
                </h2>

                <h3 className="text-xl font-semibold text-slate-200 mb-3">5.1 Encryption</h3>
                <ul className="list-disc list-inside text-slate-300 leading-relaxed mb-4 space-y-2">
                    <li>Data in transit: TLS 1.3</li>
                    <li>Data at rest: AES-256 encryption</li>
                </ul>

                <h3 className="text-xl font-semibold text-slate-200 mb-3">5.2 Access Controls</h3>
                <ul className="list-disc list-inside text-slate-300 leading-relaxed mb-4 space-y-2">
                    <li>Role-based access control (RBAC)</li>
                    <li>Multi-factor authentication (MFA) available</li>
                    <li>Activity logging and audit trails</li>
                </ul>

                <h3 className="text-xl font-semibold text-slate-200 mb-3">5.3 Infrastructure</h3>
                <ul className="list-disc list-inside text-slate-300 leading-relaxed mb-4 space-y-2">
                    <li>HIPAA-compliant hosting (AWS US-East)</li>
                    <li>SOC 2 Type II certified</li>
                    <li>Regular security audits</li>
                </ul>
            </section>

            {/* Section 6 */}
            <section id="section-6" className="mb-12">
                <h2 className="text-2xl font-bold text-slate-100 mb-4">6. Data Sharing</h2>

                <h3 className="text-xl font-semibold text-slate-200 mb-3">6.1 We Do NOT Sell Your Data</h3>
                <p className="text-slate-300 leading-relaxed mb-4">
                    We will never sell your personal information or clinical data to third parties.
                </p>

                <h3 className="text-xl font-semibold text-slate-200 mb-3">6.2 Service Providers</h3>
                <p className="text-slate-300 leading-relaxed mb-4">
                    We share data with trusted service providers who assist in operating the Service:
                </p>
                <ul className="list-disc list-inside text-slate-300 leading-relaxed mb-4 space-y-2">
                    <li>Supabase (database hosting)</li>
                    <li>Stripe (payment processing)</li>
                    <li>Vercel (application hosting)</li>
                    <li>Sentry (error monitoring)</li>
                </ul>
                <p className="text-slate-300 leading-relaxed mb-4">
                    All service providers are HIPAA-compliant and bound by BAAs.
                </p>

                <h3 className="text-xl font-semibold text-slate-200 mb-3">6.3 Legal Requirements</h3>
                <p className="text-slate-300 leading-relaxed mb-4">
                    We may disclose information if required by law, court order, or government request.
                </p>

                <h3 className="text-xl font-semibold text-slate-200 mb-3">6.4 Aggregated Data</h3>
                <p className="text-slate-300 leading-relaxed mb-4">
                    We may share aggregated, de-identified data for research purposes. This data cannot be traced back to individual users or patients.
                </p>
            </section>

            {/* Section 7 */}
            <section id="section-7" className="mb-12">
                <h2 className="text-2xl font-bold text-slate-100 mb-4">7. Data Retention</h2>

                <h3 className="text-xl font-semibold text-slate-200 mb-3">7.1 Active Accounts</h3>
                <p className="text-slate-300 leading-relaxed mb-4">
                    We retain your data for as long as your account is active.
                </p>

                <h3 className="text-xl font-semibold text-slate-200 mb-3">7.2 Deleted Accounts</h3>
                <p className="text-slate-300 leading-relaxed mb-4">
                    Upon account deletion, you have 30 days to export your data. After 30 days, all data is permanently deleted per HIPAA requirements.
                </p>

                <h3 className="text-xl font-semibold text-slate-200 mb-3">7.3 Legal Holds</h3>
                <p className="text-slate-300 leading-relaxed mb-4">
                    We may retain data longer if required by law or legal proceedings.
                </p>
            </section>

            {/* Section 8 - Your Rights */}
            <section id="section-8" className="mb-12">
                <h2 className="text-2xl font-bold text-slate-100 mb-4">8. Your Rights</h2>

                <div className="space-y-4">
                    <div className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-teal-400 mt-1 flex-shrink-0" />
                        <div>
                            <h3 className="text-xl font-semibold text-slate-200 mb-2">8.1 Access</h3>
                            <p className="text-slate-300 leading-relaxed">
                                You may access your data at any time through the Service.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-teal-400 mt-1 flex-shrink-0" />
                        <div>
                            <h3 className="text-xl font-semibold text-slate-200 mb-2">8.2 Correction</h3>
                            <p className="text-slate-300 leading-relaxed">
                                You may correct inaccurate data through your account settings.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-teal-400 mt-1 flex-shrink-0" />
                        <div>
                            <h3 className="text-xl font-semibold text-slate-200 mb-2">8.3 Deletion</h3>
                            <p className="text-slate-300 leading-relaxed">
                                You may request deletion of your account and data at any time.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-teal-400 mt-1 flex-shrink-0" />
                        <div>
                            <h3 className="text-xl font-semibold text-slate-200 mb-2">8.4 Export</h3>
                            <p className="text-slate-300 leading-relaxed">
                                You may export your data in CSV format at any time.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-teal-400 mt-1 flex-shrink-0" />
                        <div>
                            <h3 className="text-xl font-semibold text-slate-200 mb-2">8.5 Opt-Out</h3>
                            <p className="text-slate-300 leading-relaxed">
                                You may opt out of marketing communications at any time.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 9 */}
            <section id="section-9" className="mb-12">
                <h2 className="text-2xl font-bold text-slate-100 mb-4">9. Cookies and Tracking</h2>

                <h3 className="text-xl font-semibold text-slate-200 mb-3">9.1 Essential Cookies</h3>
                <p className="text-slate-300 leading-relaxed mb-4">
                    We use cookies to maintain your session and provide the Service.
                </p>

                <h3 className="text-xl font-semibold text-slate-200 mb-3">9.2 Analytics Cookies</h3>
                <p className="text-slate-300 leading-relaxed mb-4">
                    We use Google Analytics to understand how users interact with the Service. You may opt out via browser settings.
                </p>

                <h3 className="text-xl font-semibold text-slate-200 mb-3">9.3 Third-Party Cookies</h3>
                <p className="text-slate-300 leading-relaxed mb-4">
                    Stripe may set cookies for payment processing.
                </p>
            </section>

            {/* Section 10 */}
            <section id="section-10" className="mb-12">
                <h2 className="text-2xl font-bold text-slate-100 mb-4">10. Children's Privacy</h2>
                <p className="text-slate-300 leading-relaxed mb-4">
                    The Service is not intended for users under 18. We do not knowingly collect data from children.
                </p>
            </section>

            {/* Section 11 */}
            <section id="section-11" className="mb-12">
                <h2 className="text-2xl font-bold text-slate-100 mb-4">11. International Users</h2>

                <h3 className="text-xl font-semibold text-slate-200 mb-3">11.1 Data Location</h3>
                <p className="text-slate-300 leading-relaxed mb-4">
                    All data is stored in the United States (AWS US-East).
                </p>

                <h3 className="text-xl font-semibold text-slate-200 mb-3">11.2 GDPR Compliance</h3>
                <p className="text-slate-300 leading-relaxed mb-4">
                    For users in the European Union, we comply with GDPR requirements:
                </p>
                <ul className="list-disc list-inside text-slate-300 leading-relaxed mb-4 space-y-2">
                    <li>Right to access</li>
                    <li>Right to rectification</li>
                    <li>Right to erasure</li>
                    <li>Right to data portability</li>
                    <li>Right to object</li>
                </ul>

                <h3 className="text-xl font-semibold text-slate-200 mb-3">11.3 CCPA Compliance</h3>
                <p className="text-slate-300 leading-relaxed mb-4">
                    For users in California, we comply with CCPA requirements:
                </p>
                <ul className="list-disc list-inside text-slate-300 leading-relaxed mb-4 space-y-2">
                    <li>Right to know</li>
                    <li>Right to delete</li>
                    <li>Right to opt-out of sale (we do not sell data)</li>
                </ul>
            </section>

            {/* Section 12 */}
            <section id="section-12" className="mb-12">
                <h2 className="text-2xl font-bold text-slate-100 mb-4">12. Changes to This Policy</h2>
                <p className="text-slate-300 leading-relaxed mb-4">
                    We may update this Privacy Policy at any time. We will notify you of material changes via email. Continued use after changes constitutes acceptance.
                </p>
            </section>

            {/* Section 13 */}
            <section id="section-13" className="mb-12">
                <h2 className="text-2xl font-bold text-slate-100 mb-4">13. Contact Us</h2>
                <p className="text-slate-300 leading-relaxed mb-4">
                    For questions about this Privacy Policy or to exercise your rights, contact us at:
                </p>
                <p className="text-slate-300 leading-relaxed mb-2">
                    <strong>Email:</strong>{' '}
                    <a href="mailto:privacy@ppnresearch.com" className="text-teal-400 hover:text-teal-300 underline">
                        privacy@ppnresearch.com
                    </a>
                </p>
                <p className="text-slate-300 leading-relaxed mb-2">
                    <strong>Address:</strong> [Your Business Address]
                </p>
                <p className="text-slate-300 leading-relaxed">
                    <strong>Data Protection Officer:</strong> [Name, if applicable]
                </p>
            </section>

            {/* Section 14 */}
            <section id="section-14" className="mb-12">
                <h2 className="text-2xl font-bold text-slate-100 mb-4">14. Complaints</h2>
                <p className="text-slate-300 leading-relaxed mb-4">
                    If you believe we have violated your privacy rights, you may file a complaint with:
                </p>
                <p className="text-slate-300 leading-relaxed mb-2">
                    <strong>U.S. Department of Health and Human Services</strong>
                </p>
                <p className="text-slate-300 leading-relaxed mb-2">
                    Office for Civil Rights
                </p>
                <p className="text-slate-300 leading-relaxed">
                    <a
                        href="https://www.hhs.gov/ocr/privacy/hipaa/complaints/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-teal-400 hover:text-teal-300 underline"
                    >
                        https://www.hhs.gov/ocr/privacy/hipaa/complaints/
                    </a>
                </p>
            </section>

            {/* Final Statement */}
            <div className="mt-16 p-6 bg-slate-900/50 border border-slate-800 rounded-lg">
                <p className="text-slate-300 text-center leading-relaxed">
                    <strong>By using PPN Research Portal, you acknowledge that you have read and understood this Privacy Policy.</strong>
                </p>
            </div>
        </LegalPageLayout>
    );
};

export default Privacy;
