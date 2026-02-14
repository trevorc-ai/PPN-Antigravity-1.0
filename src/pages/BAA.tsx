import React from 'react';
import { LegalPageLayout } from '../components/LegalPageLayout';
import { FileText } from 'lucide-react';

const tableOfContents = [
    { id: 'recitals', title: 'Recitals' },
    { id: 'section-1', title: '1. Definitions' },
    { id: 'section-2', title: '2. Obligations of Business Associate' },
    { id: 'section-3', title: '3. Permitted Uses and Disclosures by Business Associate' },
    { id: 'section-4', title: '4. Obligations of Covered Entity' },
    { id: 'section-5', title: '5. Term and Termination' },
    { id: 'section-6', title: '6. Breach Notification' },
    { id: 'section-7', title: '7. Indemnification' },
    { id: 'section-8', title: '8. Miscellaneous' },
    { id: 'section-9', title: '9. Signatures' },
];

const BAA: React.FC = () => {
    return (
        <LegalPageLayout
            title="Business Associate Agreement (BAA)"
            effectiveDate="February 13, 2026"
            tableOfContents={tableOfContents}
        >
            {/* Header */}
            <div className="mb-12 p-6 bg-slate-900/50 border border-slate-800 rounded-lg">
                <p className="text-slate-300 leading-relaxed mb-4">
                    This Business Associate Agreement ("Agreement") is entered into between:
                </p>
                <p className="text-slate-300 leading-relaxed mb-2">
                    <strong>COVERED ENTITY:</strong> [User/Organization Name]
                </p>
                <p className="text-slate-300 leading-relaxed">
                    <strong>BUSINESS ASSOCIATE:</strong> PPN Research Portal, LLC
                </p>
            </div>

            {/* Recitals */}
            <section id="recitals" className="mb-12">
                <h2 className="text-2xl font-bold text-slate-100 mb-4">RECITALS</h2>
                <p className="text-slate-300 leading-relaxed mb-4">
                    WHEREAS, Covered Entity and Business Associate have entered into a subscription agreement for the use of PPN Research Portal ("Service");
                </p>
                <p className="text-slate-300 leading-relaxed mb-4">
                    WHEREAS, the Service is architected to operate entirely on de-identified, anonymized data and does NOT collect, store, or transmit Protected Health Information ("PHI") or Personally Identifiable Information ("PII");
                </p>
                <p className="text-slate-300 leading-relaxed mb-4">
                    WHEREAS, this architecture eliminates HIPAA compliance requirements and breach liability for both parties;
                </p>
                <p className="text-slate-300 leading-relaxed mb-4">
                    NOW, THEREFORE, in consideration of the mutual covenants and agreements herein contained, the parties agree as follows:
                </p>
            </section>

            {/* Section 1 */}
            <section id="section-1" className="mb-12">
                <h2 className="text-2xl font-bold text-slate-100 mb-4">1. DEFINITIONS</h2>
                <p className="text-slate-300 leading-relaxed mb-4">
                    Terms used but not otherwise defined in this Agreement shall have the same meaning as those terms in the HIPAA Rules (45 CFR Parts 160 and 164).
                </p>
            </section>

            {/* Section 2 */}
            <section id="section-2" className="mb-12">
                <h2 className="text-2xl font-bold text-slate-100 mb-4">2. OBLIGATIONS OF BUSINESS ASSOCIATE</h2>

                <h3 className="text-xl font-semibold text-slate-200 mb-3">2.1 Data Architecture</h3>
                <p className="text-slate-300 leading-relaxed mb-4">
                    <strong>Business Associate will NOT receive, maintain, or transmit Protected Health Information (PHI) or Personally Identifiable Information (PII).</strong> All data processed by the Service is de-identified and anonymized at source using system-generated Subject IDs with no linkage to real patient identities.
                </p>
                <p className="text-slate-300 leading-relaxed mb-4">
                    This architecture eliminates HIPAA compliance requirements and breach liability for both parties.
                </p>

                <h3 className="text-xl font-semibold text-slate-200 mb-3">2.2 Privacy-by-Design Principles</h3>
                <p className="text-slate-300 leading-relaxed mb-4">
                    Business Associate implements the following privacy-by-design principles:
                </p>
                <ul className="list-disc list-inside text-slate-300 leading-relaxed mb-4 space-y-2">
                    <li>Data minimization: Collect only what is necessary for clinical intelligence</li>
                    <li>Anonymization at source: Patient identifiers never enter the system</li>
                    <li>Aggregation by default: Individual-level data is aggregated for network insights</li>
                    <li>Zero breach liability: No PHI means no HIPAA breach risk</li>
                </ul>

                <h3 className="text-xl font-semibold text-slate-200 mb-3">2.3 Data Security</h3>
                <p className="text-slate-300 leading-relaxed mb-4">
                    Business Associate shall implement enterprise-grade security safeguards including:
                </p>
                <ul className="list-disc list-inside text-slate-300 leading-relaxed mb-4 space-y-2">
                    <li>Encryption in transit (TLS 1.3) and at rest (AES-256)</li>
                    <li>Role-based access control (RBAC)</li>
                    <li>Activity logging and audit trails</li>
                    <li>SOC 2 Type II certified infrastructure</li>
                </ul>

                <h3 className="text-xl font-semibold text-slate-200 mb-3">2.4 Subcontractors</h3>
                <p className="text-slate-300 leading-relaxed mb-4">
                    Business Associate shall ensure that any subcontractors processing de-identified data agree to maintain the same privacy and security standards.
                </p>
            </section>

            {/* Section 3 */}
            <section id="section-3" className="mb-12">
                <h2 className="text-2xl font-bold text-slate-100 mb-4">3. PERMITTED USES AND DISCLOSURES BY BUSINESS ASSOCIATE</h2>

                <h3 className="text-xl font-semibold text-slate-200 mb-3">3.1 De-Identified Data Processing</h3>
                <p className="text-slate-300 leading-relaxed mb-4">
                    Business Associate processes only de-identified, anonymized data for:
                </p>
                <ul className="list-disc list-inside text-slate-300 leading-relaxed mb-4 space-y-2">
                    <li>Clinical intelligence and decision support services</li>
                    <li>Network-wide analytics and benchmarking</li>
                    <li>Research and evidence generation</li>
                    <li>Platform operation and improvement</li>
                </ul>

                <h3 className="text-xl font-semibold text-slate-200 mb-3">3.2 Data Architecture Compliance</h3>
                <p className="text-slate-300 leading-relaxed mb-4">
                    All data is anonymized at source using system-generated Subject IDs in accordance with 45 CFR § 164.514(a)-(c). No re-identification is possible or permitted.
                </p>
            </section>

            {/* Section 4 */}
            <section id="section-4" className="mb-12">
                <h2 className="text-2xl font-bold text-slate-100 mb-4">4. OBLIGATIONS OF COVERED ENTITY</h2>

                <h3 className="text-xl font-semibold text-slate-200 mb-3">4.1 Data Anonymization Responsibility</h3>
                <p className="text-slate-300 leading-relaxed mb-4">
                    Covered Entity is solely responsible for ensuring all data submitted to the Service is de-identified and anonymized before entry, using system-generated Subject IDs with no linkage to patient identities.
                </p>

                <h3 className="text-xl font-semibold text-slate-200 mb-3">4.2 Compliance with Privacy-by-Design</h3>
                <p className="text-slate-300 leading-relaxed mb-4">
                    Covered Entity agrees to use the Service in accordance with its privacy-by-design architecture and shall not attempt to upload, transmit, or store any PHI or PII.
                </p>

                <h3 className="text-xl font-semibold text-slate-200 mb-3">4.3 Audit Rights</h3>
                <p className="text-slate-300 leading-relaxed mb-4">
                    Covered Entity may request audit logs to verify that only de-identified data is processed by the Service.
                </p>
            </section>

            {/* Section 5 */}
            <section id="section-5" className="mb-12">
                <h2 className="text-2xl font-bold text-slate-100 mb-4">5. TERM AND TERMINATION</h2>

                <h3 className="text-xl font-semibold text-slate-200 mb-3">5.1 Term</h3>
                <p className="text-slate-300 leading-relaxed mb-4">
                    This Agreement shall be effective as of the Effective Date and shall remain in effect for the duration of the Service Agreement.
                </p>

                <h3 className="text-xl font-semibold text-slate-200 mb-3">5.2 Termination for Cause</h3>
                <p className="text-slate-300 leading-relaxed mb-4">
                    Upon Covered Entity's knowledge of a material breach by Business Associate, Covered Entity may:
                </p>
                <ul className="list-disc list-inside text-slate-300 leading-relaxed mb-4 space-y-2">
                    <li>Provide an opportunity for Business Associate to cure the breach and terminate if not cured within 30 days; or</li>
                    <li>Immediately terminate the Service Agreement if cure is not possible.</li>
                </ul>

                <h3 className="text-xl font-semibold text-slate-200 mb-3">5.3 Effect of Termination</h3>
                <p className="text-slate-300 leading-relaxed mb-4">
                    Upon termination, Business Associate shall:
                </p>
                <ul className="list-disc list-inside text-slate-300 leading-relaxed mb-4 space-y-2">
                    <li>Delete all de-identified data associated with Covered Entity's account within 30 days</li>
                    <li>Provide written confirmation of data deletion upon request</li>
                    <li>Retain no copies of Covered Entity's data except as required by law</li>
                </ul>
            </section>

            {/* Section 6 */}
            <section id="section-6" className="mb-12">
                <h2 className="text-2xl font-bold text-slate-100 mb-4">6. BREACH NOTIFICATION</h2>

                <h3 className="text-xl font-semibold text-slate-200 mb-3">6.1 Security Incident Notification</h3>
                <p className="text-slate-300 leading-relaxed mb-4">
                    Business Associate shall notify Covered Entity within 10 business days of discovery of any security incident affecting de-identified data integrity or availability.
                </p>

                <h3 className="text-xl font-semibold text-slate-200 mb-3">6.2 Incident Report Content</h3>
                <p className="text-slate-300 leading-relaxed mb-4">
                    The notification shall include:
                </p>
                <ul className="list-disc list-inside text-slate-300 leading-relaxed mb-4 space-y-2">
                    <li>Description of the security incident and affected systems</li>
                    <li>Date and time of the incident and discovery</li>
                    <li>Types of de-identified data potentially affected</li>
                    <li>Remediation steps taken and preventive measures implemented</li>
                    <li>Contact information for technical and security inquiries</li>
                </ul>
                <p className="text-slate-300 leading-relaxed mb-4">
                    <strong>Note:</strong> Because the Service processes only de-identified data, security incidents do NOT constitute HIPAA breaches and do NOT trigger breach notification requirements under 45 CFR § 164.404.
                </p>
            </section>

            {/* Section 7 */}
            <section id="section-7" className="mb-12">
                <h2 className="text-2xl font-bold text-slate-100 mb-4">7. INDEMNIFICATION</h2>
                <p className="text-slate-300 leading-relaxed mb-4">
                    Business Associate shall indemnify and hold harmless Covered Entity from any claims, damages, or expenses arising from Business Associate's breach of this Agreement, including but not limited to security incidents, data integrity failures, or violations of applicable data protection laws.
                </p>
            </section>

            {/* Section 8 */}
            <section id="section-8" className="mb-12">
                <h2 className="text-2xl font-bold text-slate-100 mb-4">8. MISCELLANEOUS</h2>

                <h3 className="text-xl font-semibold text-slate-200 mb-3">8.1 Regulatory References</h3>
                <p className="text-slate-300 leading-relaxed mb-4">
                    A reference in this Agreement to a section in the HIPAA Rules means the section as in effect or as amended.
                </p>

                <h3 className="text-xl font-semibold text-slate-200 mb-3">8.2 Amendment</h3>
                <p className="text-slate-300 leading-relaxed mb-4">
                    The parties agree to take such action as is necessary to amend this Agreement to comply with changes in HIPAA or other applicable law.
                </p>

                <h3 className="text-xl font-semibold text-slate-200 mb-3">8.3 Interpretation</h3>
                <p className="text-slate-300 leading-relaxed mb-4">
                    Any ambiguity in this Agreement shall be resolved in favor of a meaning that permits Covered Entity to comply with HIPAA.
                </p>

                <h3 className="text-xl font-semibold text-slate-200 mb-3">8.4 Survival</h3>
                <p className="text-slate-300 leading-relaxed mb-4">
                    The obligations of Business Associate under Section 5.3 shall survive termination of this Agreement.
                </p>
            </section>

            {/* Section 9 - Signatures */}
            <section id="section-9" className="mb-12">
                <h2 className="text-2xl font-bold text-slate-100 mb-4 flex items-center gap-2">
                    <FileText className="w-6 h-6 text-teal-400" />
                    9. SIGNATURES
                </h2>

                <div className="grid md:grid-cols-2 gap-8 mt-6">
                    {/* Covered Entity */}
                    <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-slate-100 mb-4">COVERED ENTITY:</h3>
                        <div className="space-y-3 text-sm text-slate-400">
                            <div className="border-b border-slate-700 pb-2">
                                <span className="text-slate-500">Signature:</span> _________________________
                            </div>
                            <div className="border-b border-slate-700 pb-2">
                                <span className="text-slate-500">Name:</span> _____________________________
                            </div>
                            <div className="border-b border-slate-700 pb-2">
                                <span className="text-slate-500">Title:</span> _____________________________
                            </div>
                            <div className="border-b border-slate-700 pb-2">
                                <span className="text-slate-500">Date:</span> _____________________________
                            </div>
                        </div>
                    </div>

                    {/* Business Associate */}
                    <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-slate-100 mb-4">BUSINESS ASSOCIATE:</h3>
                        <div className="space-y-3 text-sm text-slate-400">
                            <div className="border-b border-slate-700 pb-2">
                                <span className="text-slate-500">Signature:</span> _________________________
                            </div>
                            <div className="border-b border-slate-700 pb-2">
                                <span className="text-slate-500">Name:</span> PPN Research Portal, LLC
                            </div>
                            <div className="border-b border-slate-700 pb-2">
                                <span className="text-slate-500">Title:</span> Authorized Representative
                            </div>
                            <div className="border-b border-slate-700 pb-2">
                                <span className="text-slate-500">Date:</span> _____________________________
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 text-center">
                    <p className="text-slate-400 text-sm">
                        For questions about this BAA, contact:{' '}
                        <a href="mailto:legal@ppnresearch.com" className="text-teal-400 hover:text-teal-300 underline">
                            legal@ppnresearch.com
                        </a>
                    </p>
                </div>
            </section>
        </LegalPageLayout>
    );
};

export default BAA;
