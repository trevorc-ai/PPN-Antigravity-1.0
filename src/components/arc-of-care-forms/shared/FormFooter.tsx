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
}) => {
    return (
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
                    disabled={isSaving || !hasChanges}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl border text-sm font-semibold transition-all bg-slate-800/60 hover:bg-slate-700/60 border-slate-600/50 text-slate-300 disabled:opacity-50"
                    aria-label="Save and exit panel"
                >
                    <LogOut className="w-4 h-4" aria-hidden="true" />
                    {saveAndExitLabel}
                </button>
            )}

            {/* Save & Continue */}
            {onSaveAndContinue && (
                <button
                    type="button"
                    onClick={onSaveAndContinue}
                    disabled={isSaving || !hasChanges}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all shadow-lg bg-indigo-700/50 hover:bg-indigo-600/60 border border-indigo-500/50 text-indigo-100 shadow-indigo-950/50 disabled:opacity-50"
                    aria-label="Save and continue"
                >
                    {isSaving ? <Save className="w-4 h-4 animate-pulse" aria-hidden="true" /> : <CheckCircle className="w-4 h-4" aria-hidden="true" />}
                    {isSaving ? 'Saving...' : saveAndContinueLabel}
                    {!isSaving && !isDone && <ChevronRight className="w-4 h-4" aria-hidden="true" />}
                </button>
            )}
        </div>
    );
};
