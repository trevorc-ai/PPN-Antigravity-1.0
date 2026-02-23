import React from 'react';

// ─── Screenshot Block ──────────────────────────────────────────────────────
// Drop a renamed screenshot into public/screenshots/ named help-[slug].png
// It will automatically appear here. No other code changes needed.
const ScreenshotBlock = ({ src, alt }: { src: string; alt: string }) => {
    const [loaded, setLoaded] = React.useState(false);
    const [errored, setErrored] = React.useState(false);

    return (
        <div className="mt-8 bg-slate-900/40 p-1.5 sm:p-2.5 rounded-3xl border border-slate-700/60 shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden relative group max-w-4xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 z-0" />
            {!errored ? (
                <>
                    {!loaded && (
                        <div className="flex flex-col items-center justify-center opacity-50 z-10 gap-4 py-20 px-10 text-center w-full min-h-[300px]">
                            <span className="material-symbols-outlined text-5xl text-indigo-400/40">photo_library</span>
                            <span className="text-sm font-black uppercase tracking-widest text-slate-600">Loading screenshot…</span>
                        </div>
                    )}
                    <img
                        src={src}
                        alt={alt}
                        onLoad={() => setLoaded(true)}
                        onError={() => setErrored(true)}
                        className={`relative z-10 w-full rounded-2xl border border-slate-800 shadow-sm transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0 absolute'}`}
                    />
                </>
            ) : (
                <div className="flex flex-col items-center justify-center opacity-50 z-10 gap-4 py-20 px-10 text-center w-full min-h-[300px]">
                    <span className="material-symbols-outlined text-5xl text-indigo-400/40">photo_library</span>
                    <span className="text-sm font-black uppercase tracking-widest text-slate-600">Screenshot coming soon</span>
                    <span className="text-xs text-slate-700 font-mono">Drop file: public/screenshots/{src.split('/').pop()}</span>
                </div>
            )}
        </div>
    );
};

// ─── Shared UI Atoms ────────────────────────────────────────────────────────
const SectionBadge = ({ icon, label, color = 'indigo' }: { icon: string; label: string; color?: string }) => (
    <div className={`inline-flex items-center gap-2 px-4 py-1.5 bg-${color}-500/10 border border-${color}-500/20 rounded-full text-xs font-black text-${color}-400 uppercase tracking-widest mb-4`}>
        <span className="material-symbols-outlined text-sm">{icon}</span>
        {label}
    </div>
);

const GlossaryCard = ({ term, definition }: { term: string; definition: string }) => (
    <div className="p-4 bg-slate-900/60 border border-slate-700/40 rounded-xl">
        <p className="text-xs font-black text-indigo-400 uppercase tracking-wider mb-1">{term}</p>
        <p className="text-sm text-slate-400 leading-relaxed">{definition}</p>
    </div>
);

const FAQItem = ({ q, a }: { q: string; a: string }) => (
    <div className="py-5 border-b border-slate-800/60 last:border-0">
        <p className="text-base font-bold text-slate-200 mb-2">{q}</p>
        <p className="text-sm text-slate-400 leading-relaxed">{a}</p>
    </div>
);

// ─── Page: Quickstart Guide ────────────────────────────────────────────────
export const HelpQuickstart = () => (
    <div className="space-y-10">
        <div>
            <SectionBadge icon="rocket_launch" label="Getting Started" color="emerald" />
            <h2 className="text-3xl font-black text-slate-200 tracking-tight">Quickstart Guide</h2>
            <p className="text-slate-400 text-base leading-relaxed max-w-3xl mt-3">
                Get from zero to your first logged session in under 10 minutes. This guide walks you through the four essential steps every new practitioner should complete.
            </p>
        </div>

        <div className="space-y-6">
            {[
                { step: 1, title: 'Log In & Verify Your Credentials', desc: 'Visit ppnportal.net and sign in with your registered email. If this is your first time, check your inbox for an onboarding email from the PPN team with your temporary credentials.' },
                { step: 2, title: 'Complete Your Practitioner Profile', desc: 'Navigate to Settings → Profile to add your license number, clinic name, and specialisation. This connects your data to the right alliance node.' },
                { step: 3, title: 'Run Your First Safety Check', desc: 'Go to Interaction Checker in the sidebar. Select a substance (e.g., Psilocybin) and add any medications your patient is currently taking. The system will instantly flag any dangerous combinations.' },
                { step: 4, title: 'Log Your First Protocol', desc: 'Navigate to My Protocols → New Protocol. Assign a Subject ID, fill in the session details, and click Submit to Registry. Your data is now contributing to the global benchmark.' },
            ].map(({ step, title, desc }) => (
                <div key={step} className="flex gap-5 p-5 bg-slate-900/40 border border-slate-800/60 rounded-2xl hover:border-slate-700 transition-all">
                    <div className="w-10 h-10 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-indigo-400 font-black text-sm">{step}</span>
                    </div>
                    <div>
                        <p className="text-base font-bold text-slate-200 mb-1">{title}</p>
                        <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
                    </div>
                </div>
            ))}
        </div>

        <ScreenshotBlock src="/screenshots/wellness_welcome.png" alt="PPN Portal Quickstart Onboarding Flow" />
    </div>
);

// ─── Page: Platform Overview ───────────────────────────────────────────────
export const HelpOverview = () => (
    <div className="space-y-10">
        <div>
            <SectionBadge icon="grid_view" label="Platform Overview" color="indigo" />
            <h2 className="text-3xl font-black text-slate-200 tracking-tight">Platform Overview</h2>
            <p className="text-slate-400 text-base leading-relaxed max-w-3xl mt-3">
                PPN Portal is a measurement and benchmarking tool for psychedelic therapy practitioners. Here's what each major section does.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
                { icon: 'dashboard', title: 'Dashboard', desc: 'Your command centre. See real-time KPIs: session count, safety alert count, and benchmark scores at a glance.' },
                { icon: 'query_stats', title: 'Clinical Intelligence', desc: 'Deep-dive analytics showing longitudinal patient outcomes, protocol efficacy, and alliance benchmarks.' },
                { icon: 'medication', title: 'Substance Library', desc: 'A curated database of psychedelic substances with pharmacology profiles, receptor affinities, and dosing data.' },
                { icon: 'security', title: 'Interaction Checker', desc: "Cross-references your patient's current medications against your selected substance. Flags dangerous combinations in real-time." },
                { icon: 'favorite', title: 'Wellness Journey', desc: 'Phase-by-phase tracking for each patient: Preparation → Dosing → Integration. Log vitals, assessments, and pulse checks.' },
                { icon: 'clinical_notes', title: 'Protocol Builder', desc: 'Log de-identified session data. Each submission strengthens the alliance benchmark and contributes to the global evidence base.' },
                { icon: 'newspaper', title: 'News & Updates', desc: 'Curated research headlines and regulatory updates from the psychedelic therapy field, refreshed daily.' },
                { icon: 'manage_search', title: 'Audit Logs', desc: 'A complete, tamper-evident record of every action taken within your account — for compliance and peace of mind.' },
            ].map(({ icon, title, desc }) => (
                <div key={title} className="flex gap-4 p-5 bg-slate-900/40 border border-slate-800/60 rounded-2xl hover:border-indigo-500/20 transition-all group">
                    <span className="material-symbols-outlined text-indigo-400 text-2xl flex-shrink-0 group-hover:scale-110 transition-transform">{icon}</span>
                    <div>
                        <p className="text-base font-bold text-slate-200 mb-1">{title}</p>
                        <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
                    </div>
                </div>
            ))}
        </div>

        <ScreenshotBlock src="/screenshots/dashboard.png" alt="PPN Portal Platform Overview Dashboard" />
        <ScreenshotBlock src="/screenshots/neural_search.png" alt="PPN Neural Search Interface" />
    </div>
);

// ─── Page: Interaction Checker ─────────────────────────────────────────────
export const HelpInteractionChecker = () => (
    <div className="space-y-10">
        <div>
            <SectionBadge icon="security" label="Safety Shield" color="red" />
            <h2 className="text-3xl font-black text-slate-200 tracking-tight">Using the Interaction Checker</h2>
            <p className="text-slate-400 text-base leading-relaxed max-w-3xl mt-3">
                The Interaction Checker validates clinical combinations against a 13-point safety matrix. Think of it as a spell-checker for medicine — it looks at the substance you plan to use and compares it against the medications your patient is already taking.
            </p>
        </div>

        <div className="space-y-4">
            <FAQItem
                q="What do the alert colours mean?"
                a="Red (Stop): This combination has a high risk of a severe reaction. Strongly consider not proceeding. Yellow (Caution): This combination might cause side effects or reduce treatment effectiveness — proceed with care. Green (Clear): No known conflicts found in our database."
            />
            <FAQItem
                q="How do I check an interaction?"
                a="Select your substance from the dropdown (e.g., Psilocybin), then use the medication search to add any drugs your patient is currently taking. The system cross-checks in real-time and displays a risk severity card for each combination."
            />
            <FAQItem
                q="Is this a clinical recommendation?"
                a="No. PPN is a measurement tool, not a medical advice platform. The Interaction Checker surfaces known pharmacological conflicts from published literature. Final clinical judgment always rests with you."
            />
            <FAQItem
                q="What is Serotonin Toxicity?"
                a="A potentially dangerous condition caused by excess serotonin activity in the nervous system — often triggered by combining serotonergic drugs (like SSRIs) with substances such as psilocybin or MDMA. The checker will flag this risk automatically."
            />
        </div>

        <div>
            <h3 className="text-lg font-black text-slate-300 mb-4 uppercase tracking-widest text-sm">Glossary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <GlossaryCard term="Contraindication" definition="A medical reason not to use a specific treatment because it could be harmful." />
                <GlossaryCard term="Interaction" definition="When two drugs change how the other one works — altering efficacy or increasing risk." />
                <GlossaryCard term="Serotonin Toxicity" definition="A dangerous condition caused by too much serotonin activity, often from mixing certain drugs." />
            </div>
        </div>

        <ScreenshotBlock src="/screenshots/interation_checker.png" alt="Interaction Checker Results Screen" />
        <ScreenshotBlock src="/screenshots/safety_check.png" alt="Safety Check Detail View" />
    </div>
);

// ─── Page: Wellness Journey ────────────────────────────────────────────────
export const HelpWellnessJourney = () => (
    <div className="space-y-10">
        <div>
            <SectionBadge icon="favorite" label="Wellness Journey" color="emerald" />
            <h2 className="text-3xl font-black text-slate-200 tracking-tight">Navigating Wellness Journey Logs</h2>
            <p className="text-slate-400 text-base leading-relaxed max-w-3xl mt-3">
                The Wellness Journey tracks your patient through three clinical phases: Preparation, Dosing, and Integration. Each phase has structured forms and gating criteria that must be met before progressing.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
                { phase: 'Phase 1', name: 'Preparation', icon: 'edit_note', color: 'blue', desc: 'Baseline assessments (PHQ-9, consent), medication review, and pre-session readiness confirmation. Required before dosing can begin.' },
                { phase: 'Phase 2', name: 'Dosing', icon: 'medication', color: 'purple', desc: 'Log the dosing session: substance, dose, route, vitals, and the Session Companion link. All fields must be confirmed to unlock Phase 3.' },
                { phase: 'Phase 3', name: 'Integration', icon: 'psychology', color: 'emerald', desc: 'Post-session pulse checks, MEQ-30 assessment, and integration milestones. Tracks patient recovery and insight consolidation over 90 days.' },
            ].map(({ phase, name, icon, color, desc }) => (
                <div key={phase} className={`p-5 bg-${color}-500/5 border border-${color}-500/20 rounded-2xl`}>
                    <span className={`material-symbols-outlined text-${color}-400 text-2xl mb-3 block`}>{icon}</span>
                    <p className={`text-xs font-black text-${color}-400 uppercase tracking-widest mb-1`}>{phase}</p>
                    <p className="text-base font-bold text-slate-200 mb-2">{name}</p>
                    <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
                </div>
            ))}
        </div>

        <div className="space-y-4">
            <FAQItem
                q="Why can't I move to the next phase?"
                a="Each phase is gated. Phase 2 (Dosing) requires a confirmed Dosing Protocol and Vitals log. Phase 3 (Integration) requires a completed Dosing Session. If a button is greyed out, check the checklist items above it — all must show a green tick."
            />
            <FAQItem
                q="What are Pulse Checks?"
                a="One-tap daily mood ratings (1–10) that the patient submits during the integration window. They take ~30 seconds and feed directly into the longitudinal outcome graph in your Clinical Intelligence dashboard."
            />
            <FAQItem
                q="What is the Neuroplasticity Window?"
                a="The 2–4 weeks following a psychedelic session when the brain is more receptive to new patterns and therapy. PPN highlights this window with a badge in Phase 3 to remind both clinician and patient to prioritise integration work."
            />
        </div>

        <ScreenshotBlock src="/screenshots/wellness_phase_1.png" alt="Wellness Journey Phase 1 - Preparation" />
        <ScreenshotBlock src="/screenshots/Wellness_start.png" alt="Wellness Journey Start Screen" />
    </div>
);

// ─── Page: Session Reporting ───────────────────────────────────────────────
export const HelpSessionReporting = () => (
    <div className="space-y-10">
        <div>
            <SectionBadge icon="summarize" label="Session Reporting" color="indigo" />
            <h2 className="text-3xl font-black text-slate-200 tracking-tight">Session Reporting & Exports</h2>
            <p className="text-slate-400 text-base leading-relaxed max-w-3xl mt-3">
                Every session you log creates a structured de-identified record. You can export these as PDF clinical summaries or CSV datasets for insurance, billing, or research purposes.
            </p>
        </div>

        <div className="space-y-4">
            <FAQItem
                q="How do I export a session report?"
                a="Navigate to My Protocols and click the session you want. On the session detail page, click the Export PDF button. The report includes session date, protocol details, dosage, and outcome scores — with all PHI replaced by the anonymous Subject ID."
            />
            <FAQItem
                q="What is a Subject ID?"
                a="A randomly generated code (e.g. PPN-7X2K-9F4M) assigned to each patient. It allows you to track the same patient across sessions without storing any personally identifiable information. Only you know who is behind each ID."
            />
            <FAQItem
                q="Can I export data for Medicare or insurance purposes?"
                a="The CSV export from Audit Logs contains structured, MedDRA-coded session data that many insurance platforms accept. For specific insurance requirements, consult your billing department — PPN provides the data, not the submission workflow."
            />
            <FAQItem
                q="How long is session data retained?"
                a="Indefinitely, for as long as your account is active. All data is encrypted at rest using AES-256 and isolated per site via Row Level Security."
            />
        </div>

        <ScreenshotBlock src="/screenshots/compliance_documents.png" alt="Session Export and Compliance Documents" />
    </div>
);

// ─── Page: Patient Bridge Scanner ─────────────────────────────────────────
export const HelpScanner = () => (
    <div className="space-y-10">
        <div>
            <SectionBadge icon="document_scanner" label="Patient Bridge" color="purple" />
            <h2 className="text-3xl font-black text-slate-200 tracking-tight">Patient Bridge Scanner</h2>
            <p className="text-slate-400 text-base leading-relaxed max-w-3xl mt-3">
                The Patient Bridge leverages OCR (optical character recognition) via mobile camera access to rapidly ingest paperwork and physical questionnaires directly into the secure environment — eliminating manual data entry.
            </p>
        </div>

        <div className="space-y-4">
            <FAQItem
                q="What documents can I scan?"
                a="Any printed form with structured content: intake questionnaires, consent forms, physical PHQ-9 or GAD-7 surveys, or legacy paper session notes. The scanner works best with printed text — handwriting recognition has limited accuracy."
            />
            <FAQItem
                q="How does the Reagent Eye work?"
                a="The Reagent Eye uses your phone camera to analyse chemical test strips. Because human eyes can be tricked by lighting conditions, the app reads the exact colour code (hex value) and compares it to the expected colour for a given substance. This gives you an objective, documented record of test results."
            />
            <FAQItem
                q="Does the Reagent Eye guarantee purity?"
                a="No. It confirms that the colour reaction is consistent with a known substance — a strong indicator, but not conclusive. It cannot detect every possible impurity. Always apply clinical judgment alongside the result."
            />
            <FAQItem
                q="Is scanned data sent to the cloud immediately?"
                a="No. The OCR processing happens locally on your device. Recognised data is shown to you for review before anything is saved to PPN's servers. You approve the record before it's submitted."
            />
        </div>

        <div>
            <h3 className="text-lg font-black text-slate-300 mb-4 uppercase tracking-widest text-sm">Glossary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <GlossaryCard term="OCR" definition="Optical Character Recognition — software that reads printed text from an image or camera feed." />
                <GlossaryCard term="Reagent Test" definition="A chemical drop that changes colour on contact with a specific drug, used to identify substances." />
                <GlossaryCard term="False Positive" definition="When a test reads 'safe' but the substance is actually something else or impure." />
            </div>
        </div>

        <ScreenshotBlock src="/screenshots/informed_consent_0.png" alt="Patient Bridge Scanner and Consent Form" />
    </div>
);

// ─── Page: Device Syncing ──────────────────────────────────────────────────
export const HelpDevices = () => (
    <div className="space-y-10">
        <div>
            <SectionBadge icon="devices" label="Device Syncing" color="sky" />
            <h2 className="text-3xl font-black text-slate-200 tracking-tight">Device Syncing & Integrations</h2>
            <p className="text-slate-400 text-base leading-relaxed max-w-3xl mt-3">
                PPN is designed to work across desktop, tablet, and mobile. All data syncs in real-time via your secure Supabase-backed account — no manual export or import needed between devices.
            </p>
        </div>

        <div className="space-y-4">
            <FAQItem
                q="Can I use PPN on my phone during a session?"
                a="Yes. The interface is fully responsive. The Patient Companion page is specifically designed for a tablet or phone that the patient holds during their session — it displays a calming visual environment and allows pulse check submissions."
            />
            <FAQItem
                q="Is there a native mobile app?"
                a="Not yet. PPN runs as a progressive web app (PWA), which means you can add it to your home screen from your mobile browser for a near-native experience. A dedicated iOS/Android app is on the roadmap."
            />
            <FAQItem
                q="Does data sync between my laptop and tablet?"
                a="Yes — instantly. Because everything is stored in your encrypted cloud account, any device signed into your account will see the same data in real-time."
            />
        </div>

        <ScreenshotBlock src="/screenshots/help-devices.png" alt="PPN Device Compatibility Overview" />
    </div>
);

// ─── Page: Settings ─────────────────────────────────────────────────────
export const HelpSettings = () => (
    <div className="space-y-10">
        <div>
            <SectionBadge icon="settings" label="Account Setup" color="slate" />
            <h2 className="text-3xl font-black text-slate-200 tracking-tight">Account Settings</h2>
            <p className="text-slate-400 text-base leading-relaxed max-w-3xl mt-3">
                Manage your profile, notification preferences, and data export settings from the Settings page. Access it anytime via the sidebar or top-right menu.
            </p>
        </div>

        <div className="space-y-4">
            <FAQItem
                q="How do I update my practitioner profile?"
                a="Go to Settings → Edit Profile. You can update your display name, clinic name, license number, and practice specialisation. These fields are used to link your data to the correct alliance node."
            />
            <FAQItem
                q="How do I change my password?"
                a="On the Settings page, click 'Change Password'. You'll receive a secure reset link to your registered email address. For security, passwords are never stored in plain text."
            />
            <FAQItem
                q="Can I turn off email notifications?"
                a="Yes. In Settings → Notifications, you can toggle individual notification types: safety alerts, benchmark updates, and system announcements."
            />
            <FAQItem
                q="How do I delete my account?"
                a="Contact the PPN team directly at support@ppnportal.net. Account deletion is a manual process to ensure data integrity for the alliance — your de-identified session data may be retained in aggregate form per our privacy policy."
            />
        </div>

        <ScreenshotBlock src="/screenshots/help-settings.png" alt="Account Settings Page" />
    </div>
);
