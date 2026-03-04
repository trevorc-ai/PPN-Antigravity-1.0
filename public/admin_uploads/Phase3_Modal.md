Here is the complete, copy-paste-ready React and Tailwind code for the **Patient Journey Magic Link Modal**.

This component uses standard `useState` to manage the customization toggles, compiles your requested JSON payload, simulates a secure database write, and copies the generated Magic Link to the practitioner's clipboard.

It strictly follows your "Clinical Sci-Fi" aesthetic (Deep Slate, glass panels, indigo accents) and enforces the 14px minimum typography rule.

### The React Component (`MagicLinkModal.tsx`)

```tsx
import React, { useState } from 'react';
import { Brain, Activity, Heart, Link as LinkIcon, Check, Copy, X, ShieldAlert } from 'lucide-react';

interface MagicLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientHash: string; // e.g., "e3b0c44298fc1c14"
}

const MagicLinkModal: React.FC<MagicLinkModalProps> = ({ isOpen, onClose, patientHash }) => {
  // --- State Management ---
  const [toggles, setToggles] = useState({
    neurobiology: false, // Off by default (can overwhelm some patients)
    flightPlan: true,    // On by default (normalizes somatic sensations)
    pems: true,          // On by default (provides grounding framework)
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
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
      
      // 3. Copy to clipboard
      navigator.clipboard.writeText(newLink);
      setIsCopied(true);
      setIsGenerating(false);

      // Reset copy state after 3 seconds
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
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <LinkIcon className="text-indigo-400 w-5 h-5" />
              Customize Patient Journey Link
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Select which clinical modules this patient is ready to see. 
              <span className="text-emerald-400 ml-1">ID: {patientHash.substring(0,8)}...</span>
            </p>
          </div>
          <button 
            onClick={onClose}
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
                <h3 className="text-base font-semibold text-slate-200">Neurobiology & Brain Maps</h3>
                <p className="text-sm text-slate-400 mt-1 max-w-sm">
                  Includes the Dual-Mode Radar Chart and DMN fMRI visualizations. Best for highly analytical patients needing scientific validation.
                </p>
              </div>
            </div>
            <button 
              onClick={() => handleToggle('neurobiology')}
              className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${toggles.neurobiology ? 'bg-indigo-500' : 'bg-slate-700'}`}
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
                <h3 className="text-base font-semibold text-slate-200">Pharmacokinetic Flight Plan</h3>
                <p className="text-sm text-slate-400 mt-1 max-w-sm">
                  Includes the timeline curve and synchronized somatic body map. Helps normalize physical sensations and reduces health anxiety.
                </p>
              </div>
            </div>
            <button 
              onClick={() => handleToggle('flightPlan')}
              className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${toggles.flightPlan ? 'bg-indigo-500' : 'bg-slate-700'}`}
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
                <h3 className="text-base font-semibold text-slate-200">P.E.M.S. Integration Framework</h3>
                <p className="text-sm text-slate-400 mt-1 max-w-sm">
                  Includes the somatic tag-cloud and structured journaling prompts. Essential for grounding patients in the days following a session.
                </p>
              </div>
            </div>
            <button 
              onClick={() => handleToggle('pems')}
              className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${toggles.pems ? 'bg-indigo-500' : 'bg-slate-700'}`}
            >
              <span className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${toggles.pems ? 'translate-x-7' : 'translate-x-0'}`} />
            </button>
          </div>

          {/* Zero-Knowledge Disclaimer */}
          <div className="flex items-center gap-3 p-4 mt-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
             <ShieldAlert className="text-amber-400 w-5 h-5 shrink-0" />
             <p className="text-sm text-amber-200/80">
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
                className="bg-transparent text-sm text-slate-300 w-full outline-none select-all"
              />
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(generatedLink);
                  setIsCopied(true);
                  setTimeout(() => setIsCopied(false), 3000);
                }}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-sm text-slate-200 rounded-md transition-colors"
              >
                {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                {isCopied ? 'Copied' : 'Copy'}
              </button>
            </div>
          )}

          <div className="flex items-center justify-end gap-4">
            <button 
              onClick={onClose}
              className="px-6 py-3 text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleGenerateLink}
              disabled={isGenerating}
              className={`flex items-center gap-2 px-8 py-3 text-sm font-bold text-white rounded-xl shadow-lg transition-all ${
                isCopied 
                  ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/25' 
                  : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/25'
              }`}
            >
              {isGenerating ? (
                <span className="animate-pulse">Generating Secure Payload...</span>
              ) : isCopied ? (
                <><Check className="w-4 h-4" /> Link Copied to Clipboard</>
              ) : (
                <><LinkIcon className="w-4 h-4" /> Generate Magic Link</>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MagicLinkModal;

```

### How to Implement This in Phase 3

To seamlessly integrate this into your existing architecture, you just need a button on your Phase 3 Dashboard (perhaps in the "Actions" section at the bottom, right next to "Generate Progress Summary") that flips a state variable to open this modal.

**Example Integration in `Phase3Dashboard.tsx`:**

```tsx
// 1. Add state to your main page
const [isMagicLinkModalOpen, setIsMagicLinkModalOpen] = useState(false);
const currentPatientHash = "pt-8842-xyz"; // Pull this from your current context

// 2. Add the trigger button to your Actions section
<button 
  onClick={() => setIsMagicLinkModalOpen(true)}
  className="flex items-center gap-2 px-6 py-3 bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 rounded-xl hover:bg-indigo-600/30 transition-colors"
>
  <LinkIcon className="w-4 h-4" />
  Share Patient Journey Link
</button>

// 3. Render the Modal at the bottom of your component return
<MagicLinkModal 
  isOpen={isMagicLinkModalOpen} 
  onClose={() => setIsMagicLinkModalOpen(false)}
  patientHash={currentPatientHash} 
/>

```

With this modal, the clinician serves as the curator of the patient's integration experience, reinforcing the **"Dual-Dashboard"** strategy. Would you like me to review the backend Supabase setup to ensure the `log_outcomes` table is perfectly configured to accept the incoming Daily Pulse data generated by this magic link?