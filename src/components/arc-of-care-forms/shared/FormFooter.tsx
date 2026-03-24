import React from 'react';
import { ChevronLeft, LogOut, CheckCircle, ChevronRight, Save } from 'lucide-react';

export interface FormFooterProps {
    onBack?: () => void;
    onSaveAndExit?: () => void;
    onSaveAndContinue?: () => void;
    isSaving?: boolean;
    hasChanges?: boolean;
    saveAndContinueLabel?: string;
    saveAndExitLabel?: string;
    isDone?: boolean; // For when it's the absolute last step
    isValid?: boolean; // Whether the form passes validation
    /** WO-662: ref forwarded to the primary CTA button for pulse + scroll-into-view */
    ctaRef?: React.RefObject<HTMLButtonElement | null>;
    /** WO-662: when true, shows "Form complete — press ↵ Enter to save" toast */
    showEnterToast?: boolean;
}

export const FormFooter: React.FC<FormFooterProps> = ({
    onBack,
    onSaveAndExit,
    onSaveAndContinue,
    isSaving = false,
    hasChanges = true,
    saveAndContinueLabel = 'Save & Continue',
    saveAndExitLabel = 'Save & Exit',
    isDone = false,
    isValid = true,
    ctaRef,
    showEnterToast = false,
}) => {
    return (
        <div className="space-y-2 w-full">
            {/* WO-662 Layer 4: Enter-key toast — non-consent forms only */}
            {showEnterToast && (
                <div
                    role="status"
                    aria-live="polite"
                    className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-sm font-medium animate-pulse"
                >
                    <CheckCircle className="w-4 h-4 text-indigo-400" aria-hidden="true" />
                    Form complete, press{' '}
                    <kbd className="px-1.5 py-0.5 rounded bg-indigo-500/20 border border-indigo-500/30 text-xs md:text-sm font-mono">
                        ↵ Enter
                    </kbd>{' '}
                    to save
                </div>
            )}

            <div className="flex items-center gap-3 pt-2 pb-4 w-full">
                {/* Back */}
                {onBack && (
                    <button
                        type="button"
                        onClick={onBack}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700/50 text-slate-300 text-sm font-semibold transition-all disabled:opacity-50"
                        aria-label="Go back without saving"
                    >
                        <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                        Back
                    </button>
                )}

                {/* Spacer */}
                <div className="flex-1" />

                {/* Save & Exit */}
                {onSaveAndExit && (
                    <button
                        type="button"
                        onClick={onSaveAndExit}
                        disabled={isSaving || !hasChanges || !isValid}
                        className="flex items-center gap-2 px-5 py-3 rounded-xl border text-sm font-semibold transition-all bg-slate-800/60 hover:bg-slate-700/60 border-slate-600/50 text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Save and exit panel"
                    >
                        <LogOut className="w-4 h-4" aria-hidden="true" />
                        {saveAndExitLabel}
                    </button>
                )}

                {/* Save & Continue — primary CTA */}
                {onSaveAndContinue && (
                    <button
                        ref={ctaRef}
                        type="button"
                        onClick={onSaveAndContinue}
                        disabled={isSaving || !hasChanges || !isValid}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all shadow-lg bg-indigo-700/50 hover:bg-indigo-600/60 border border-indigo-500/50 text-indigo-100 shadow-indigo-950/50 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Save and continue"
                    >
                        {isSaving ? <Save className="w-4 h-4 animate-pulse" aria-hidden="true" /> : <CheckCircle className="w-4 h-4" aria-hidden="true" />}
                        {isSaving ? 'Saving...' : saveAndContinueLabel}
                        {!isSaving && !isDone && <ChevronRight className="w-4 h-4" aria-hidden="true" />}
                    </button>
                )}
            </div>
        </div>
    );
};
