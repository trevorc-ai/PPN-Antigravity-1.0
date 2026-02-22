import React, { useState, useRef } from 'react';
import { FileCheck, Save, CheckCircle, AlertTriangle, ShieldCheck, Copy, Check } from 'lucide-react';
import { FormField } from '../shared/FormField';
import { FormFooter } from '../shared/FormFooter';

/**
 * ConsentForm — Informed Consent Documentation
 *
 * UX flow (per WO-118 spec):
 *   1. Checkbox is always visible first.
 *   2. Checking the box auto-stamps the Verification DateTime and reveals the
 *      consent type selector.
 *   3. Button clicks NEVER trigger a DB write — they only update local state.
 *   4. A single explicit "Save Consent" button fires onSave exactly once,
 *      guarded by hasSavedRef so double-clicks and re-renders are harmless.
 *
 * No useEffect auto-save — that pattern caused one DB round-trip per button
 * click and buried the form in error toasts.
 */

export interface ConsentData {
    consent_types: string[];
    consent_obtained: boolean;
    verification_datetime?: string;
}

interface ConsentFormProps {
    onSave?: (data: ConsentData) => Promise<boolean> | boolean | void;
    initialData?: ConsentData;
    patientId?: string;
    onNext?: () => void;
    onExit?: () => void;
    onBack?: () => void;
}

const CONSENT_TYPES = [
    {
        value: 'informed_consent',
        label: 'Informed Consent',
        selectedClasses: 'bg-emerald-700 text-slate-200 shadow-lg shadow-emerald-700/30 border-emerald-500',
    },
    {
        value: 'hipaa_authorization',
        label: 'HIPAA Authorization',
        selectedClasses: 'bg-amber-600 text-slate-200 shadow-lg shadow-amber-600/30 border-amber-500',
    },
    {
        value: 'research_participation',
        label: 'Research Participation',
        selectedClasses: 'bg-violet-700 text-slate-200 shadow-lg shadow-violet-700/30 border-violet-500',
    },
    {
        value: 'photography_recording',
        label: 'Photography / Recording',
        selectedClasses: 'bg-cyan-700 text-slate-200 shadow-lg shadow-cyan-700/30 border-cyan-500',
    },
];

const ConsentForm: React.FC<ConsentFormProps> = ({
    onSave,
    initialData = { consent_types: [], consent_obtained: false },
    patientId,
    onNext,
    onExit,
    onBack
}) => {
    const [idCopied, setIdCopied] = useState(false);

    const handleCopyId = () => {
        if (!patientId) return;
        navigator.clipboard.writeText(patientId).then(() => {
            setIdCopied(true);
            setTimeout(() => setIdCopied(false), 2000);
        });
    };
    const [data, setData] = useState<ConsentData>(initialData);
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);

    // ── One-shot guard ────────────────────────────────────────────────────────
    // hasSavedRef ensures the DB write fires exactly once per form mount.
    // Re-renders, double-clicks, and StrictMode second-invocations are all safe.
    const hasSavedRef = useRef(false);

    // ── Checkbox handler ──────────────────────────────────────────────────────
    const handleConsentToggle = (checked: boolean) => {
        setData(prev => ({
            ...prev,
            consent_obtained: checked,
            // Auto-stamp now; clear on uncheck
            verification_datetime: checked
                ? new Date().toISOString().slice(0, 16)
                : undefined,
            // Clear type selections on uncheck so the next check starts clean
            consent_types: checked ? prev.consent_types : [],
        }));
        // Allow re-saving if the clinician unchecks and re-checks
        if (!checked) hasSavedRef.current = false;
    };

    // ── Explicit save handler — called ONLY by the Save button ────────────────
    // async so we await the DB round-trip before updating UI state.
    // hasSavedRef resets on failure so the clinician can retry.
    const handleSave = async () => {
        if (!onSave) return;
        if (!data.consent_obtained) return;
        if (hasSavedRef.current) return;

        hasSavedRef.current = true;
        setIsSaving(true);
        try {
            const result = await onSave(data);
            if (result === false) {
                // Router signalled failure — allow retry
                hasSavedRef.current = false;
            } else {
                setLastSaved(new Date());
            }
        } catch {
            hasSavedRef.current = false;
        } finally {
            setIsSaving(false);
        }
    };

    // Consent types are optional — only the checkbox + timestamp are mandatory
    const canSave =
        data.consent_obtained &&
        !!data.verification_datetime;

    const handleSaveAndExit = async () => {
        if (!canSave) return;
        await handleSave();
        if (hasSavedRef.current) {
            setTimeout(() => onExit?.(), 600);
        }
    };

    const handleSaveAndContinue = async () => {
        if (!canSave) return;
        await handleSave();
        if (hasSavedRef.current) {
            setTimeout(() => onNext?.(), 600);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">

            {/* Auto-save indicator — compact, doesn't duplicate the panel title */}
            {(isSaving || lastSaved) && (
                <div className="flex justify-end">
                    {isSaving && (
                        <div className="flex items-center gap-1.5 text-blue-400 text-xs">
                            <Save className="w-3.5 h-3.5 animate-pulse" />
                            <span>Saving…</span>
                        </div>
                    )}
                    {lastSaved && !isSaving && (
                        <div className="flex items-center gap-1.5 text-emerald-400 text-xs">
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Saved {lastSaved.toLocaleTimeString()}</span>
                        </div>
                    )}
                </div>
            )}

            {/* ── Patient Anonymous ID Banner ──────────────────────────────── */}
            {/* This is the most important identity disclosure on the page.     */}
            {/* Displayed inline — NOT as a toast — so clinicians always see it  */}
            {patientId && (
                <div className="relative overflow-hidden rounded-2xl border-2 border-emerald-500/40 bg-emerald-500/5 p-5">
                    {/* Subtle glow accent */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500/60 via-emerald-400/80 to-emerald-500/60 rounded-t-2xl" />

                    <div className="flex items-start gap-4">
                        {/* Shield icon */}
                        <div className="shrink-0 w-11 h-11 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
                            <ShieldCheck className="w-6 h-6 text-emerald-400" />
                        </div>

                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-black text-emerald-400 uppercase tracking-widest mb-1">
                                Anonymous Patient ID — System Generated
                            </p>
                            <p className="text-sm text-slate-300 leading-relaxed mb-3">
                                A unique random hash has been created for this patient. <strong className="text-slate-200">No name, date of birth, or identifying information is stored.</strong> All clinical records are linked to this ID only.
                            </p>

                            {/* ID display with copy button */}
                            <div className="flex items-center gap-3">
                                <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-slate-950/80 border border-emerald-500/30 rounded-xl">
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest shrink-0">Patient ID</span>
                                    <span className="font-mono text-lg font-black text-emerald-300 tracking-widest">
                                        {patientId}
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleCopyId}
                                    title="Copy patient ID to clipboard"
                                    className="shrink-0 flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/50 hover:border-emerald-500/40 text-slate-400 hover:text-emerald-300 transition-all active:scale-95"
                                >
                                    {idCopied
                                        ? <><Check className="w-4 h-4 text-emerald-400" /><span className="text-xs font-bold text-emerald-400">Copied</span></>
                                        : <><Copy className="w-4 h-4" /><span className="text-xs font-bold">Copy</span></>
                                    }
                                </button>
                            </div>

                            <p className="text-xs text-slate-500 mt-2 font-medium">
                                Record this ID in your secure paper trail if required by your site's protocol.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Form body ───────────────────────────────────────────────── */}
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 space-y-8">

                {/* ── Step 1: Consent checkbox (always visible) ─────────── */}
                <div className={`p-6 rounded-lg border-2 transition-all ${data.consent_obtained
                    ? 'bg-emerald-500/5 border-emerald-500/50'
                    : 'bg-slate-800/30 border-slate-700/50'
                    }`}>
                    <label className="flex items-start gap-4 cursor-pointer group">
                        <input
                            id="consent-obtained-checkbox"
                            type="checkbox"
                            checked={data.consent_obtained}
                            onChange={(e) => handleConsentToggle(e.target.checked)}
                            className="mt-1 w-6 h-6 rounded border-slate-600 bg-slate-800/50 text-emerald-500 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-0 cursor-pointer"
                        />
                        <div className="flex-1">
                            <p className="text-lg font-bold text-slate-300 group-hover:text-slate-200 transition-colors">
                                I confirm that informed consent has been obtained from the patient
                            </p>
                            <p className="text-sm text-slate-400 mt-2">
                                By checking this box, you certify that the patient has been fully
                                informed of the treatment, risks, benefits, and alternatives, and
                                has voluntarily agreed to proceed.
                            </p>
                        </div>
                    </label>
                </div>

                {/* Unchecked warning */}
                {!data.consent_obtained && (
                    <div className="flex items-start gap-3 p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-lg">
                        <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-yellow-400 font-semibold text-sm">Consent Required</p>
                            <p className="text-yellow-400/80 text-sm mt-1">
                                Patient consent must be obtained and documented before proceeding
                                with treatment.
                            </p>
                        </div>
                    </div>
                )}

                {/* ── Step 2: Timestamp + type buttons (only after checkbox) ─ */}
                {data.consent_obtained && (
                    <>
                        {/* Auto-stamped verification datetime */}
                        <FormField
                            label="Verification Date & Time"
                            tooltip="Automatically filled when consent is obtained. Adjust if documenting retrospectively."
                            required
                        >
                            <input
                                id="consent-verification-datetime"
                                type="datetime-local"
                                value={data.verification_datetime ?? ''}
                                onChange={(e) =>
                                    setData(prev => ({
                                        ...prev,
                                        verification_datetime: e.target.value,
                                    }))
                                }
                                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            />
                        </FormField>

                        {/* Consent type multi-select */}
                        <FormField
                            label="Consent Type"
                            tooltip="Select all consent types being documented for this patient"
                            required
                        >
                            <div className="grid grid-cols-2 gap-3">
                                {CONSENT_TYPES.map((type) => {
                                    const isSelected = data.consent_types.includes(type.value);
                                    return (
                                        <button
                                            key={type.value}
                                            id={`consent-type-${type.value}`}
                                            type="button"
                                            disabled={!!lastSaved}
                                            onClick={() =>
                                                setData(prev => ({
                                                    ...prev,
                                                    consent_types: isSelected
                                                        ? prev.consent_types.filter(t => t !== type.value)
                                                        : [...prev.consent_types, type.value],
                                                }))
                                            }
                                            className={`flex items-center gap-3 px-5 py-4 rounded-xl text-base font-semibold text-left transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-70 border ${isSelected
                                                ? type.selectedClasses
                                                : 'bg-slate-800/60 text-slate-300 border-slate-700/50 hover:border-slate-500 hover:text-slate-200'
                                                }`}
                                            aria-pressed={isSelected}
                                            aria-label={`${isSelected ? 'Deselect' : 'Select'} ${type.label}`}
                                        >
                                            <CheckCircle
                                                className={`w-4 h-4 flex-shrink-0 transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0'
                                                    }`}
                                                aria-hidden="true"
                                            />
                                            {type.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </FormField>

                        {/* ── Saved confirmation ───────────────────────────── */}
                        {lastSaved && (
                            <div className="flex items-center gap-3 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-lg">
                                <CheckCircle className="w-5 h-5 text-emerald-400" />
                                <p className="text-emerald-400 font-semibold text-sm">
                                    Consent documented and saved — advancing...
                                </p>
                            </div>
                        )}
                    </>
                )}
            </div>

            <FormFooter
                onBack={onBack}
                onSaveAndExit={handleSaveAndExit}
                onSaveAndContinue={handleSaveAndContinue}
                isSaving={isSaving}
                hasChanges={canSave && !lastSaved}
                saveAndContinueLabel="Save Consent Documentation"
            />
        </div>
    );
};

export default ConsentForm;
