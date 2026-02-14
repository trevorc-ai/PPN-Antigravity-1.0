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
                    WHEREAS, in connection with the Service, Business Associate may create, receive, maintain, or transmit Protected Health Information ("PHI") on behalf of Covered Entity;
                </p>
                <p className="text-slate-300 leading-relaxed mb-4">
                    WHEREAS, the Health Insurance Portability and Accountability Act of 1996 ("HIPAA"), as amended by the Health Information Technology for Economic and Clinical Health Act ("HITECH"), requires Business Associate to enter into this Agreement;
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

                <h3 className="text-xl font-semibold text-slate-200 mb-3">2.1 Permitted Uses and Disclosures</h3>
                <p className="text-slate-300 leading-relaxed mb-4">
                    Business Associate may use or disclose PHI only as permitted by this Agreement or as required by law.
                </p>

                <h3 className="text-xl font-semibold text-slate-200 mb-3">2.2 Safeguards</h3>
                <p className="text-slate-300 leading-relaxed mb-4">
                    Business Associate shall implement appropriate safeguards to prevent use or disclosure of PHI other than as provided for by this Agreement, including administrative, physical, and technical safeguards that reasonably and appropriately protect the confidentiality, integrity, and availability of electronic PHI.
                </p>

                <h3 className="text-xl font-semibold text-slate-200 mb-3">2.3 Reporting</h3>
                <p className="text-slate-300 leading-relaxed mb-4">
                    Business Associate shall report to Covered Entity any use or disclosure of PHI not provided for by this Agreement, including breaches of unsecured PHI, within 10 business days of discovery.
                </p>

                <h3 className="text-xl font-semibold text-slate-200 mb-3">2.4 Subcontractors</h3>
                <p className="text-slate-300 leading-relaxed mb-4">
                    Business Associate shall ensure that any subcontractors that create, receive, maintain, or transmit PHI on behalf of Business Associate agree to the same restrictions and conditions that apply to Business Associate.
                </p>

                <h3 className="text-xl font-semibold text-slate-200 mb-3">2.5 Access to PHI</h3>
                <p className="text-slate-300 leading-relaxed mb-4">
                    Business Associate shall provide access to PHI in a Designated Record Set to Covered Entity or an Individual as necessary to satisfy Covered Entity's obligations under 45 CFR § 164.524.
                </p>

                <h3 className="text-xl font-semibold text-slate-200 mb-3">2.6 Amendment of PHI</h3>
                <p className="text-slate-300 leading-relaxed mb-4">
                    Business Associate shall make any amendments to PHI in a Designated Record Set as directed by Covered Entity pursuant to 45 CFR § 164.526.
                </p>

                <h3 className="text-xl font-semibold text-slate-200 mb-3">2.7 Accounting of Disclosures</h3>
                <p className="text-slate-300 leading-relaxed mb-4">
                    Business Associate shall document disclosures of PHI and information related to such disclosures as would be required for Covered Entity to respond to a request for an accounting of disclosures pursuant to 45 CFR § 164.528.
                </p>

                <h3 className="text-xl font-semibold text-slate-200 mb-3">2.8 Availability of Books and Records</h3>
                <p className="text-slate-300 leading-relaxed mb-4">
                    Business Associate shall make its internal practices, books, and records relating to the use and disclosure of PHI available to the Secretary of Health and Human Services for purposes of determining Covered Entity's compliance with HIPAA.
                </p>
            </section>

            {/* Section 3 */}
            <section id="section-3" className="mb-12">
                <h2 className="text-2xl font-bold text-slate-100 mb-4">3. PERMITTED USES AND DISCLOSURES BY BUSINESS ASSOCIATE</h2>

                <h3 className="text-xl font-semibold text-slate-200 mb-3">3.1 General Use and Disclosure Provisions</h3>
                <p className="text-slate-300 leading-relaxed mb-4">
                    Business Associate may use or disclose PHI:
                </p>
                <ul className="list-disc list-inside text-slate-300 leading-relaxed mb-4 space-y-2">
                    <li>To perform functions, activities, or services for, or on behalf of, Covered Entity as specified in the Service Agreement</li>
                    <li>For the proper management and administration of Business Associate</li>
                    <li>To carry out the legal responsibilities of Business Associate</li>
                    <li>As required by law</li>
                </ul>

                <h3 className="text-xl font-semibold text-slate-200 mb-3">3.2 De-Identification</h3>
                <p className="text-slate-300 leading-relaxed mb-4">
                    Business Associate may de-identify PHI in accordance with 45 CFR § 164.514(a)-(c) and use such de-identified data for research, analytics, and benchmarking purposes.
                </p>
            </section>

            {/* Section 4 */}
            <section id="section-4" className="mb-12">
                <h2 className="text-2xl font-bold text-slate-100 mb-4">4. OBLIGATIONS OF COVERED ENTITY</h2>

                <h3 className="text-xl font-semibold text-slate-200 mb-3">4.1 Permissible Requests</h3>
                <p className="text-slate-300 leading-relaxed mb-4">
                    Covered Entity shall not request Business Associate to use or disclose PHI in any manner that would not be permissible under the HIPAA Rules if done by Covered Entity.
                </p>

                <h3 className="text-xl font-semibold text-slate-200 mb-3">4.2 Notice of Privacy Practices</h3>
                <p className="text-slate-300 leading-relaxed mb-4">
                    Covered Entity shall provide Business Associate with a copy of its Notice of Privacy Practices and any changes thereto.
                </p>

                <h3 className="text-xl font-semibold text-slate-200 mb-3">4.3 Restrictions</h3>
                <p className="text-slate-300 leading-relaxed mb-4">
                    Covered Entity shall notify Business Associate of any restriction on the use or disclosure of PHI that Covered Entity has agreed to.
                </p>
            </section>

            {/* Section 5 */}
            <section id="section-5" className="mb-12">
                <h2 className="text-2xl font-bold text-slate-100 mb-4">5. TERM AND TERMINATION</h2>

                <h3 className="text-xl font-semibold text-slate-200 mb-3">5.1 Term</h3>
                <p className="text-slate-300 leading-relaxed mb-4">
                    This Agreement shall be effective as of the Effective Date and shall terminate when all PHI provided by Covered Entity to Business Associate, or created or received by Business Associate on behalf of Covered Entity, is destroyed or returned to Covered Entity.
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
                    <li>Return or destroy all PHI received from Covered Entity, or created or received by Business Associate on behalf of Covered Entity</li>
                    <li>Retain no copies of PHI</li>
                    <li>If return or destruction is not feasible, extend the protections of this Agreement to such PHI and limit further uses and disclosures</li>
                </ul>
            </section>

            {/* Section 6 */}
            <section id="section-6" className="mb-12">
                <h2 className="text-2xl font-bold text-slate-100 mb-4">6. BREACH NOTIFICATION</h2>

                <h3 className="text-xl font-semibold text-slate-200 mb-3">6.1 Discovery of Breach</h3>
                <p className="text-slate-300 leading-relaxed mb-4">
                    Business Associate shall notify Covered Entity within 10 business days of discovery of a breach of unsecured PHI.
                </p>

                <h3 className="text-xl font-semibold text-slate-200 mb-3">6.2 Content of Notification</h3>
                <p className="text-slate-300 leading-relaxed mb-4">
                    The notification shall include:
                </p>
                <ul className="list-disc list-inside text-slate-300 leading-relaxed mb-4 space-y-2">
                    <li>Identification of each individual whose unsecured PHI has been, or is reasonably believed to have been, accessed, acquired, or disclosed</li>
                    <li>A brief description of what happened, including the date of the breach and the date of discovery</li>
                    <li>A description of the types of unsecured PHI involved</li>
                    <li>A brief description of what Business Associate is doing to investigate, mitigate harm, and prevent further breaches</li>
                    <li>Contact information for individuals to ask questions or learn additional information</li>
                </ul>
            </section>

            {/* Section 7 */}
            <section id="section-7" className="mb-12">
                <h2 className="text-2xl font-bold text-slate-100 mb-4">7. INDEMNIFICATION</h2>
                <p className="text-slate-300 leading-relaxed mb-4">
                    Business Associate shall indemnify and hold harmless Covered Entity from any claims, damages, or expenses arising from Business Associate's breach of this Agreement or violation of HIPAA.
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
