import React, { useState } from 'react';
import { Brain, Activity, Heart, Link as LinkIcon, Check, Share2, X, ShieldAlert, Eye } from 'lucide-react';

interface MagicLinkModalProps {
    isOpen: boolean;
    onClose: () => void;
    patientHash: string; // e.g., "e3b0c44298fc1c14"
    sessionId?: string;  // Needed to open the Integration Compass preview
}

const MagicLinkModal: React.FC<MagicLinkModalProps> = ({ isOpen, onClose, patientHash, sessionId }) => {
    // --- State Management ---
    const [toggles, setToggles] = useState({
        neurobiology: false, // Off by default (can overwhelm some patients)
        flightPlan: true,    // On by default (normalizes somatic sensations)
        pems: true,          // On by default (provides grounding framework)
    });

    const [isGenerating, setIsGenerating] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const [isCopiedOnly, setIsCopiedOnly] = useState(false); // WO-601: for dedicated Copy Link button
    const [generatedLink, setGeneratedLink] = useState("");

    if (!isOpen) return null;

    // --- Toggle Handler ---
    const handleToggle = (key: keyof typeof toggles) => {
        setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    // --- Payload Generation & Submission ---
    const handleGenerateLink = () => {
        setIsGenerating(true);

        // 1. Construct the secure JSON Payload
        const payload = {
            magic_link_token: crypto.randomUUID().split('-')[0], // Simulated token
            patient_hash: patientHash,
            session_metadata: {
                days_since_session: 0, // Day 0 setup
                substance_display_name: "Psilocybin",
                protocol_type: "Macro-dose Integration"
            },
            practitioner_toggles: {
                show_dual_radar: toggles.neurobiology,
                show_flight_plan: toggles.flightPlan,
                show_brain_network: toggles.neurobiology,
                show_daily_pulse: true, // Hardcoded TRUE: Critical for clinical radar
                show_pems: toggles.pems
            }
        };

        // 2. Simulate API Call to Supabase to store toggles and generate link
        setTimeout(() => {
            console.log("Secure Payload saved to Supabase:", payload);

            const newLink = `https://ppnportal.net/journey/auth?token=${payload.magic_link_token}&id=${payload.patient_hash}`;
            setGeneratedLink(newLink);

            // 3. Share via native share sheet (or clipboard fallback)
            const shareData = { title: 'Your Integration Compass', url: newLink };
            if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
                navigator.share(shareData).catch(() => {
                    navigator.clipboard.writeText(newLink);
                });
            } else {
                navigator.clipboard.writeText(newLink);
            }
            setIsCopied(true);
            setIsGenerating(false);

            // Reset state after 3 seconds
            setTimeout(() => setIsCopied(false), 3000);
        }, 1200);
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            {/* Modal Container: Glassmorphism 2.0 */}
            <div className="w-full max-w-2xl bg-slate-900/90 backdrop-blur-md border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/5">
                    <div>
                        {/* AC-1: ppn-card-title replaces text-xl font-bold text-slate-100 */}
                        <h2 className="ppn-card-title flex items-center gap-2">
                            {/* AC-4: Phase 3 = teal, not indigo */}
                            <LinkIcon className="text-teal-400 w-5 h-5" />
                            Customize Patient Journey Link
                        </h2>
                        {/* AC-1: ppn-body replaces text-sm text-slate-400 */}
                        <p className="ppn-body text-slate-400 mt-1">
                            Select which clinical modules this patient is ready to see.
                            {/* AC-4: teal replaces emerald for Phase 3 patient hash */}
                            <span className="text-teal-400 ml-1">ID: {patientHash.substring(0, 8)}...</span>
                        </p>
                    </div>
                    {/* AC-3: aria-label on icon-only close button */}
                    <button
                        onClick={onClose}
                        aria-label="Close modal"
                        className="p-2 text-slate-400 hover:text-slate-100 hover:bg-white/5 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body: Toggle Options */}
                <div className="p-6 space-y-4">

                    {/* Option 1: Neurobiology */}
                    <div className="flex items-center justify-between p-4 bg-slate-800/50 border border-slate-700/50 rounded-xl hover:bg-slate-800 transition-colors">
                        <div className="flex gap-4">
                            <div className="p-3 bg-slate-900 rounded-lg h-fit border border-white/5">
                                <Brain className="w-6 h-6 text-cyan-400" />
                            </div>
                            <div>
                                {/* AC-1: ppn-label replaces text-base font-semibold text-slate-200 */}
                                <h3 className="ppn-label text-slate-200">Neurobiology &amp; Brain Maps</h3>
                                {/* AC-1: ppn-body replaces text-sm text-slate-400 */}
                                <p className="ppn-body text-slate-400 mt-1 max-w-sm">
                                    Includes the Dual-Mode Radar Chart and DMN fMRI visualizations. Best for highly analytical patients needing scientific validation.
                                </p>
                            </div>
                        </div>
                        {/* AC-3: role=switch, aria-checked, aria-label, focus-visible ring */}
                        <button
                            onClick={() => handleToggle('neurobiology')}
                            role="switch"
                            aria-checked={toggles.neurobiology}
                            aria-label={toggles.neurobiology ? 'Disable Neurobiology & Brain Maps' : 'Enable Neurobiology & Brain Maps'}
                            className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${toggles.neurobiology ? 'bg-teal-600' : 'bg-slate-700'}`}
                        >
                            <span className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${toggles.neurobiology ? 'translate-x-7' : 'translate-x-0'}`} />
                        </button>
                    </div>

                    {/* Option 2: Flight Plan */}
                    <div className="flex items-center justify-between p-4 bg-slate-800/50 border border-slate-700/50 rounded-xl hover:bg-slate-800 transition-colors">
                        <div className="flex gap-4">
                            <div className="p-3 bg-slate-900 rounded-lg h-fit border border-white/5">
                                <Activity className="w-6 h-6 text-indigo-400" />
                            </div>
                            <div>
                                <h3 className="ppn-label text-slate-200">Pharmacokinetic Flight Plan</h3>
                                <p className="ppn-body text-slate-400 mt-1 max-w-sm">
                                    Includes the timeline curve and synchronized somatic body map. Helps normalize physical sensations and reduces health anxiety.
                                </p>
                            </div>
                        </div>
                        {/* AC-3: role=switch, aria-checked, aria-label, focus-visible ring */}
                        <button
                            onClick={() => handleToggle('flightPlan')}
                            role="switch"
                            aria-checked={toggles.flightPlan}
                            aria-label={toggles.flightPlan ? 'Disable Pharmacokinetic Flight Plan' : 'Enable Pharmacokinetic Flight Plan'}
                            className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${toggles.flightPlan ? 'bg-teal-600' : 'bg-slate-700'}`}
                        >
                            <span className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${toggles.flightPlan ? 'translate-x-7' : 'translate-x-0'}`} />
                        </button>
                    </div>

                    {/* Option 3: P.E.M.S. */}
                    <div className="flex items-center justify-between p-4 bg-slate-800/50 border border-slate-700/50 rounded-xl hover:bg-slate-800 transition-colors">
                        <div className="flex gap-4">
                            <div className="p-3 bg-slate-900 rounded-lg h-fit border border-white/5">
                                <Heart className="w-6 h-6 text-purple-400" />
                            </div>
                            <div>
                                <h3 className="ppn-label text-slate-200">P.E.M.S. Integration Framework</h3>
                                <p className="ppn-body text-slate-400 mt-1 max-w-sm">
                                    Includes the somatic tag-cloud and structured journaling prompts. Essential for grounding patients in the days following a session.
                                </p>
                            </div>
                        </div>
                        {/* AC-3: role=switch, aria-checked, aria-label, focus-visible ring */}
                        <button
                            onClick={() => handleToggle('pems')}
                            role="switch"
                            aria-checked={toggles.pems}
                            aria-label={toggles.pems ? 'Disable P.E.M.S. Framework' : 'Enable P.E.M.S. Framework'}
                            className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${toggles.pems ? 'bg-teal-600' : 'bg-slate-700'}`}
                        >
                            <span className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${toggles.pems ? 'translate-x-7' : 'translate-x-0'}`} />
                        </button>
                    </div>

                    {/* Zero-Knowledge Disclaimer */}
                    <div className="flex items-center gap-3 p-4 mt-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
                        <ShieldAlert className="text-amber-400 w-5 h-5 shrink-0" />
                        {/* AC-1: ppn-body replaces text-sm text-amber-200/80 */}
                        <p className="ppn-body text-amber-200/80">
                            <strong>Zero-Knowledge Safety:</strong> This link is cryptographically tied to the patient hash. It contains zero PII and maintains your full HIPAA Safe Harbor status.
                        </p>
                    </div>
                </div>

                {/* Footer: Action & Result */}
                <div className="p-6 bg-slate-950/50 border-t border-white/5 flex flex-col gap-4">

                    {generatedLink && (
                        <div className="flex items-center gap-3 p-3 bg-black/40 border border-indigo-500/30 rounded-lg">
                            <input
                                type="text"
                                readOnly
                                value={generatedLink}
                                // AC-1: ppn-body replaces text-sm text-slate-300
                                className="bg-transparent ppn-body text-slate-300 w-full outline-none select-all"
                            />
                            {/* WO-601: Explicit Copy Link button (clipboard only, no native share sheet) */}
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(generatedLink);
                                    setIsCopiedOnly(true);
                                    setTimeout(() => setIsCopiedOnly(false), 3000);
                                }}
                                aria-label={isCopiedOnly ? 'Link copied' : 'Copy link to clipboard'}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 ppn-body text-slate-200 rounded-md transition-colors shrink-0 text-sm"
                            >
                                {isCopiedOnly ? <Check className="w-4 h-4 text-teal-400" /> : <LinkIcon className="w-4 h-4" />}
                                {isCopiedOnly ? 'Copied!' : 'Copy'}
                            </button>
                            <button
                                onClick={() => {
                                    const shareData = { title: 'Your Integration Compass', url: generatedLink };
                                    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
                                        navigator.share(shareData).catch(() => navigator.clipboard.writeText(generatedLink));
                                    } else {
                                        navigator.clipboard.writeText(generatedLink);
                                    }
                                    setIsCopied(true);
                                    setTimeout(() => setIsCopied(false), 3000);
                                }}
                                aria-label={isCopied ? 'Link shared' : 'Share link'}
                                className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 ppn-body text-slate-200 rounded-md transition-colors"
                            >
                                {/* AC-2: teal replaces emerald-400 */}
                                {isCopied ? <Check className="w-4 h-4 text-teal-400" /> : <Share2 className="w-4 h-4" />}
                                {isCopied ? 'Shared' : 'Share'}
                            </button>
                        </div>
                    )}

                    <div className="flex items-center justify-between gap-4">
                        {/* View button: opens the patient compass in a new tab so the practitioner can preview it */}
                        {sessionId ? (
                            <button
                                onClick={() => window.open(`/integration-compass?sessionId=${sessionId}`, '_blank', 'noopener,noreferrer')}
                                aria-label="View patient compass in a new tab"
                                className="flex items-center gap-2 px-5 py-3 ppn-body font-medium text-teal-300 hover:text-teal-100 bg-teal-900/20 hover:bg-teal-900/40 border border-teal-700/40 hover:border-teal-500/60 rounded-xl transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                            >
                                <Eye className="w-4 h-4" />
                                View
                            </button>
                        ) : <div />}

                        <div className="flex items-center gap-4">
                            <button
                                onClick={onClose}
                                className="px-6 py-3 ppn-body font-medium text-slate-300 hover:text-white transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleGenerateLink}
                                disabled={isGenerating}
                                className={`flex items-center gap-2 px-8 py-3 ppn-body font-bold text-white rounded-xl shadow-lg transition-all ${isCopied
                                    // AC-2: teal replaces emerald for success state
                                    ? 'bg-teal-700 hover:bg-teal-600 shadow-teal-900/40 border border-teal-500/30'
                                    : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/25'
                                    }`}
                            >
                                {isGenerating ? (
                                    <span className="animate-pulse">Generating Secure Payload...</span>
                                ) : isCopied ? (
                                    <><Check className="w-4 h-4" /> Link Ready to Share</>
                                ) : (
                                    <><LinkIcon className="w-4 h-4" /> Generate Magic Link</>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default MagicLinkModal;
