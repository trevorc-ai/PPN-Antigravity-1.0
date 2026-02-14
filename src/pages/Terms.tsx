import React from 'react';
import { LegalPageLayout } from '../components/LegalPageLayout';

const tableOfContents = [
    { id: 'section-1', title: '1. Acceptance of Terms' },
    { id: 'section-2', title: '2. Description of Service' },
    { id: 'section-3', title: '3. User Accounts' },
    { id: 'section-4', title: '4. Subscription and Payment' },
    { id: 'section-5', title: '5. Data and Privacy' },
    { id: 'section-6', title: '6. Acceptable Use' },
    { id: 'section-7', title: '7. Intellectual Property' },
    { id: 'section-8', title: '8. Disclaimers' },
    { id: 'section-9', title: '9. Indemnification' },
    { id: 'section-10', title: '10. Termination' },
    { id: 'section-11', title: '11. Changes to Terms' },
    { id: 'section-12', title: '12. Governing Law' },
    { id: 'section-13', title: '13. Contact' },
];

const Terms: React.FC = () => {
    return (
        <LegalPageLayout
            title="Terms of Service"
            effectiveDate="February 13, 2026"
            tableOfContents={tableOfContents}
        >
            {/* Section 1 */}
            <section id="section-1" className="mb-12">
                <h2 className="text-2xl font-bold text-slate-100 mb-4">1. Acceptance of Terms</h2>
                <p className="text-slate-300 leading-relaxed mb-4">
                    By accessing or using the PPN Research Portal ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, do not use the Service.
                </p>
            </section>

            {/* Section 2 */}
            <section id="section-2" className="mb-12">
                <h2 className="text-2xl font-bold text-slate-100 mb-4">2. Description of Service</h2>
                <p className="text-slate-300 leading-relaxed mb-4">
                    PPN Research Portal is a HIPAA-compliant platform for psychedelic therapy practitioners to log protocols, track patient outcomes, and access clinical decision support tools.
                </p>
            </section>

            {/* Section 3 */}
            <section id="section-3" className="mb-12">
                <h2 className="text-2xl font-bold text-slate-100 mb-4">3. User Accounts</h2>

                <h3 className="text-xl font-semibold text-slate-200 mb-3">3.1 Registration</h3>
                <p className="text-slate-300 leading-relaxed mb-4">
                    You must provide accurate, current, and complete information during registration. You are responsible for maintaining the confidentiality of your account credentials.
                </p>

                <h3 className="text-xl font-semibold text-slate-200 mb-3">3.2 Eligibility</h3>
                <p className="text-slate-300 leading-relaxed mb-4">
                    You must be a licensed healthcare professional authorized to practice psychedelic-assisted therapy in your jurisdiction.
                </p>

                <h3 className="text-xl font-semibold text-slate-200 mb-3">3.3 Account Security</h3>
                <p className="text-slate-300 leading-relaxed mb-4">
                    You are responsible for all activities under your account. Notify us immediately of any unauthorized access.
                </p>
            </section>

            {/* Section 4 */}
            <section id="section-4" className="mb-12">
                <h2 className="text-2xl font-bold text-slate-100 mb-4">4. Subscription and Payment</h2>

                <h3 className="text-xl font-semibold text-slate-200 mb-3">4.1 Subscription Plans</h3>
                <ul className="list-disc list-inside text-slate-300 leading-relaxed mb-4 space-y-2">
                    <li><strong>Solo Practitioner:</strong> $99/month</li>
                    <li><strong>Clinic:</strong> $499/month</li>
                    <li><strong>Enterprise:</strong> Custom pricing</li>
                </ul>

                <h3 className="text-xl font-semibold text-slate-200 mb-3">4.2 Free Trial</h3>
                <p className="text-slate-300 leading-relaxed mb-4">
                    New users receive a 14-day free trial. No credit card required to start trial. After trial, subscription begins unless canceled.
                </p>

                <h3 className="text-xl font-semibold text-slate-200 mb-3">4.3 Billing</h3>
                <p className="text-slate-300 leading-relaxed mb-4">
                    Subscriptions are billed monthly in advance. Payment is processed via Stripe. You authorize us to charge your payment method.
                </p>

                <h3 className="text-xl font-semibold text-slate-200 mb-3">4.4 Cancellation</h3>
                <p className="text-slate-300 leading-relaxed mb-4">
                    You may cancel at any time. Cancellation takes effect at the end of the current billing period. No refunds for partial months.
                </p>

                <h3 className="text-xl font-semibold text-slate-200 mb-3">4.5 Price Changes</h3>
                <p className="text-slate-300 leading-relaxed mb-4">
                    We may change prices with 30 days' notice. Continued use after price change constitutes acceptance.
                </p>
            </section>

            {/* Section 5 */}
            <section id="section-5" className="mb-12">
                <h2 className="text-2xl font-bold text-slate-100 mb-4">5. Data and Privacy</h2>

                <h3 className="text-xl font-semibold text-slate-200 mb-3">5.1 HIPAA Compliance</h3>
                <p className="text-slate-300 leading-relaxed mb-4">
                    We are HIPAA-compliant and will sign a Business Associate Agreement (BAA) with all users.
                </p>

                <h3 className="text-xl font-semibold text-slate-200 mb-3">5.2 Data Ownership</h3>
                <p className="text-slate-300 leading-relaxed mb-4">
                    You retain all rights to your data. We do not sell or share your data with third parties except as required by law.
                </p>

                <h3 className="text-xl font-semibold text-slate-200 mb-3">5.3 Data Security</h3>
                <p className="text-slate-300 leading-relaxed mb-4">
                    We use industry-standard encryption (AES-256) and security measures to protect your data.
                </p>

                <h3 className="text-xl font-semibold text-slate-200 mb-3">5.4 Data Deletion</h3>
                <p className="text-slate-300 leading-relaxed mb-4">
                    Upon account termination, you have 30 days to export your data. After 30 days, all data is permanently deleted per HIPAA requirements.
                </p>
            </section>

            {/* Section 6 */}
            <section id="section-6" className="mb-12">
                <h2 className="text-2xl font-bold text-slate-100 mb-4">6. Acceptable Use</h2>

                <h3 className="text-xl font-semibold text-slate-200 mb-3">6.1 Permitted Use</h3>
                <p className="text-slate-300 leading-relaxed mb-4">
                    Use the Service only for lawful purposes and in accordance with these Terms.
                </p>

                <h3 className="text-xl font-semibold text-slate-200 mb-3">6.2 Prohibited Use</h3>
                <p className="text-slate-300 leading-relaxed mb-4">You may NOT:</p>
                <ul className="list-disc list-inside text-slate-300 leading-relaxed mb-4 space-y-2">
                    <li>Use the Service for illegal activities</li>
                    <li>Share your account with unauthorized users</li>
                    <li>Attempt to hack, reverse engineer, or compromise the Service</li>
                    <li>Upload malicious code or viruses</li>
                    <li>Violate any applicable laws or regulations</li>
                </ul>
            </section>

            {/* Section 7 */}
            <section id="section-7" className="mb-12">
                <h2 className="text-2xl font-bold text-slate-100 mb-4">7. Intellectual Property</h2>

                <h3 className="text-xl font-semibold text-slate-200 mb-3">7.1 Our IP</h3>
                <p className="text-slate-300 leading-relaxed mb-4">
                    The Service, including all content, features, and functionality, is owned by PPN and protected by copyright, trademark, and other intellectual property laws.
                </p>

                <h3 className="text-xl font-semibold text-slate-200 mb-3">7.2 Your IP</h3>
                <p className="text-slate-300 leading-relaxed mb-4">
                    You retain ownership of all data you upload. By using the Service, you grant us a license to process your data to provide the Service.
                </p>
            </section>

            {/* Section 8 */}
            <section id="section-8" className="mb-12">
                <h2 className="text-2xl font-bold text-slate-100 mb-4">8. Disclaimers</h2>

                <h3 className="text-xl font-semibold text-slate-200 mb-3">8.1 Clinical Decisions</h3>
                <p className="text-slate-300 leading-relaxed mb-4">
                    The Service provides clinical decision support tools but does NOT replace professional medical judgment. You are solely responsible for all clinical decisions.
                </p>

                <h3 className="text-xl font-semibold text-slate-200 mb-3">8.2 No Warranties</h3>
                <p className="text-slate-300 leading-relaxed mb-4">
                    THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED.
                </p>

                <h3 className="text-xl font-semibold text-slate-200 mb-3">8.3 Limitation of Liability</h3>
                <p className="text-slate-300 leading-relaxed mb-4">
                    TO THE MAXIMUM EXTENT PERMITTED BY LAW, PPN SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES ARISING FROM USE OF THE SERVICE.
                </p>
            </section>

            {/* Section 9 */}
            <section id="section-9" className="mb-12">
                <h2 className="text-2xl font-bold text-slate-100 mb-4">9. Indemnification</h2>
                <p className="text-slate-300 leading-relaxed mb-4">
                    You agree to indemnify and hold PPN harmless from any claims, damages, or expenses arising from your use of the Service or violation of these Terms.
                </p>
            </section>

            {/* Section 10 */}
            <section id="section-10" className="mb-12">
                <h2 className="text-2xl font-bold text-slate-100 mb-4">10. Termination</h2>

                <h3 className="text-xl font-semibold text-slate-200 mb-3">10.1 By You</h3>
                <p className="text-slate-300 leading-relaxed mb-4">
                    You may terminate your account at any time by canceling your subscription.
                </p>

                <h3 className="text-xl font-semibold text-slate-200 mb-3">10.2 By Us</h3>
                <p className="text-slate-300 leading-relaxed mb-4">
                    We may suspend or terminate your account if you violate these Terms or for any reason with 30 days' notice.
                </p>
            </section>

            {/* Section 11 */}
            <section id="section-11" className="mb-12">
                <h2 className="text-2xl font-bold text-slate-100 mb-4">11. Changes to Terms</h2>
                <p className="text-slate-300 leading-relaxed mb-4">
                    We may update these Terms at any time. We will notify you of material changes via email. Continued use after changes constitutes acceptance.
                </p>
            </section>

            {/* Section 12 */}
            <section id="section-12" className="mb-12">
                <h2 className="text-2xl font-bold text-slate-100 mb-4">12. Governing Law</h2>
                <p className="text-slate-300 leading-relaxed mb-4">
                    These Terms are governed by the laws of the State of California, USA, without regard to conflict of law principles.
                </p>
            </section>

            {/* Section 13 */}
            <section id="section-13" className="mb-12">
                <h2 className="text-2xl font-bold text-slate-100 mb-4">13. Contact</h2>
                <p className="text-slate-300 leading-relaxed mb-4">
                    For questions about these Terms, contact us at:
                </p>
                <p className="text-slate-300 leading-relaxed mb-2">
                    <strong>Email:</strong>{' '}
                    <a href="mailto:legal@ppnresearch.com" className="text-teal-400 hover:text-teal-300 underline">
                        legal@ppnresearch.com
                    </a>
                </p>
                <p className="text-slate-300 leading-relaxed">
                    <strong>Address:</strong> [Your Business Address]
                </p>
            </section>

            {/* Final Statement */}
            <div className="mt-16 p-6 bg-slate-900/50 border border-slate-800 rounded-lg">
                <p className="text-slate-300 text-center leading-relaxed">
                    <strong>By using PPN Research Portal, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.</strong>
                </p>
            </div>
        </LegalPageLayout>
    );
};

export default Terms;
