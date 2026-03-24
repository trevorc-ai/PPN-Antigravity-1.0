import { useEffect, useRef, useCallback, useState } from 'react';

/**
 * useFormCompletion — WO-662 Smart Progressive Save
 *
 * A three-layer hook that activates when a form transitions to complete:
 *
 *   Layer 1: sessionStorage draft persistence (zero DB writes per answer)
 *   Layer 3: CTA pulse animation + scroll-into-view on completion
 *   Layer 4: Bare Enter key binding + ephemeral toast (non-consent forms only)
 *
 * Layer 2 (auto-advance pages) lives in AssessmentForm.tsx — already implemented.
 *
 * @param isComplete     True when all required fields are filled
 * @param onSubmit       The save/complete handler to call when Enter is pressed
 * @param options.consent       Consent forms: activate button only, no pulse/scroll/Enter
 * @param options.storageKey    Unique key for sessionStorage draft persistence
 * @param options.draftValue    Current serialisable form state to persist as draft
 */

interface UseFormCompletionOptions {
    /** Consent forms skip pulse, scroll, and Enter binding */
    consent?: boolean;
    /** sessionStorage key for draft persistence. Omit to skip Layer 1. */
    storageKey?: string;
    /** Current form state to persist. Must be JSON-serialisable. */
    draftValue?: unknown;
}

interface UseFormCompletionReturn {
    /** Attach to the primary CTA button element for pulse + scroll */
    ctaRef: React.RefObject<HTMLButtonElement | null>;
    /** True while the "Form complete — press ↵ Enter to save" toast is visible */
    showEnterToast: boolean;
}

export function useFormCompletion(
    isComplete: boolean,
    onSubmit: (() => void) | undefined,
    options: UseFormCompletionOptions = {},
): UseFormCompletionReturn {
    const { consent = false, storageKey, draftValue } = options;

    const ctaRef = useRef<HTMLButtonElement | null>(null);
    const [showEnterToast, setShowEnterToast] = useState(false);

    // ─── Layer 1: sessionStorage draft persistence ───────────────────────────
    // Runs on every draftValue change — zero DB writes.
    useEffect(() => {
        if (!storageKey || draftValue === undefined) return;
        try {
            sessionStorage.setItem(storageKey, JSON.stringify(draftValue));
        } catch {
            // sessionStorage unavailable or quota exceeded — silent fail
        }
    }, [storageKey, draftValue]);

    // ─── Layers 3 & 4: CTA pulse + scroll + Enter toast ─────────────────────
    // Fires once when isComplete transitions false → true.
    const prevCompleteRef = useRef(false);

    useEffect(() => {
        const justCompleted = isComplete && !prevCompleteRef.current;
        prevCompleteRef.current = isComplete;

        if (!justCompleted) return;

        // Layer 3a: scroll CTA into view
        if (!consent && ctaRef.current) {
            ctaRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        // Layer 3b: pulse animation — add class, remove after one cycle (600ms)
        if (!consent && ctaRef.current) {
            const btn = ctaRef.current;
            btn.classList.add('ppn-cta-pulse');
            const cleanup = setTimeout(() => btn.classList.remove('ppn-cta-pulse'), 700);
            return () => clearTimeout(cleanup);
        }

        // Layer 4: Enter toast (non-consent only)
        if (!consent) {
            setShowEnterToast(true);
            const toastTimer = setTimeout(() => setShowEnterToast(false), 4000);
            return () => clearTimeout(toastTimer);
        }
    }, [isComplete, consent]);

    // ─── Layer 4: bare Enter key handler ─────────────────────────────────────
    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (consent || !isComplete || !onSubmit) return;
            if (e.key !== 'Enter') return;

            // Do not intercept Enter when focus is inside a text input or textarea
            const target = e.target as HTMLElement;
            const isTextField =
                (target.tagName === 'INPUT' &&
                    (target as HTMLInputElement).type !== 'checkbox' &&
                    (target as HTMLInputElement).type !== 'radio' &&
                    (target as HTMLInputElement).type !== 'button' &&
                    (target as HTMLInputElement).type !== 'submit') ||
                target.tagName === 'TEXTAREA' ||
                target.isContentEditable;

            if (isTextField) return;

            e.preventDefault();
            setShowEnterToast(false);
            onSubmit();
        },
        [consent, isComplete, onSubmit],
    );

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    return { ctaRef, showEnterToast };
}

/**
 * readFormDraft — utility to restore a sessionStorage draft on form mount.
 *
 * Usage:
 *   const draft = readFormDraft<MyFormState>('ppn-draft-consent-abc123');
 *   const [state, setState] = useState<MyFormState>(draft ?? defaultState);
 */
export function readFormDraft<T>(storageKey: string): T | null {
    try {
        const raw = sessionStorage.getItem(storageKey);
        if (!raw) return null;
        return JSON.parse(raw) as T;
    } catch {
        return null;
    }
}

/**
 * clearFormDraft — call on successful submit to remove the draft.
 */
export function clearFormDraft(storageKey: string): void {
    try {
        sessionStorage.removeItem(storageKey);
    } catch {
        // silent
    }
}
