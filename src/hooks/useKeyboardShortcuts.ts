import { useEffect, useCallback, useRef } from 'react';

type ModifierKey = 'cmd' | 'ctrl' | 'alt' | 'shift';
type ShortcutKey = string; // e.g. 's', 'enter', 'escape', 'k'

interface ShortcutDefinition {
    key: ShortcutKey;
    modifiers?: ModifierKey[];
    handler: (e: KeyboardEvent) => void;
    description?: string;
    /** If true, fires even when focus is inside an input/textarea */
    allowInInputs?: boolean;
}

/**
 * useKeyboardShortcuts
 * 
 * Registers global keyboard shortcuts that respect:
 * - prefers-reduced-motion (no side effects)
 * - Input focus (skips shortcuts unless allowInInputs is true)
 * - Cleanup on unmount
 * 
 * WO-076: Keyboard Shortcuts & Micro-Interactions
 */
export function useKeyboardShortcuts(shortcuts: ShortcutDefinition[]) {
    // Keep a stable ref to avoid re-registering on every render
    const shortcutsRef = useRef(shortcuts);
    shortcutsRef.current = shortcuts;

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        const target = e.target as HTMLElement;
        const isInInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) || target.isContentEditable;

        for (const shortcut of shortcutsRef.current) {
            if (isInInput && !shortcut.allowInInputs) continue;

            const keyMatch = e.key.toLowerCase() === shortcut.key.toLowerCase();
            if (!keyMatch) continue;

            const modifiers = shortcut.modifiers ?? [];
            const cmdOrCtrl = modifiers.includes('cmd') || modifiers.includes('ctrl');
            const needsAlt = modifiers.includes('alt');
            const needsShift = modifiers.includes('shift');

            const metaMatch = cmdOrCtrl ? (e.metaKey || e.ctrlKey) : (!e.metaKey && !e.ctrlKey);
            const altMatch = needsAlt ? e.altKey : !e.altKey;
            const shiftMatch = needsShift ? e.shiftKey : !e.shiftKey;

            if (metaMatch && altMatch && shiftMatch) {
                e.preventDefault();
                shortcut.handler(e);
                break;
            }
        }
    }, []);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);
}

/**
 * useFormKeyboardShortcuts
 * 
 * Convenience wrapper for common form shortcuts:
 * - Cmd/Ctrl+S → save
 * - Cmd/Ctrl+Enter → submit
 * - Escape → cancel/close
 * - Alt+1..5 → wizard step navigation
 */
export function useFormKeyboardShortcuts(options: {
    onSave?: () => void;
    onSubmit?: () => void;
    onCancel?: () => void;
    onStepChange?: (step: number) => void;
}) {
    const shortcuts: ShortcutDefinition[] = [];

    if (options.onSave) {
        shortcuts.push({
            key: 's',
            modifiers: ['cmd'],
            handler: options.onSave,
            description: 'Save current form (Cmd+S)',
            allowInInputs: true,
        });
    }

    if (options.onSubmit) {
        shortcuts.push({
            key: 'enter',
            modifiers: ['cmd'],
            handler: options.onSubmit,
            description: 'Submit form (Cmd+Enter)',
            allowInInputs: true,
        });
    }

    if (options.onCancel) {
        shortcuts.push({
            key: 'escape',
            modifiers: [],
            handler: options.onCancel,
            description: 'Cancel / close (Escape)',
        });
    }

    if (options.onStepChange) {
        [1, 2, 3, 4, 5].forEach((step) => {
            shortcuts.push({
                key: String(step),
                modifiers: ['alt'],
                handler: () => options.onStepChange!(step),
                description: `Jump to step ${step} (Alt+${step})`,
            });
        });
    }

    useKeyboardShortcuts(shortcuts);
}

/**
 * triggerHaptic
 * 
 * Triggers haptic feedback on supported mobile devices via the Vibration API.
 * Silently no-ops on unsupported platforms.
 */
export function triggerHaptic(type: 'light' | 'medium' | 'heavy' | 'success' | 'error' = 'light') {
    if (!navigator.vibrate) return;

    const patterns: Record<typeof type, number | number[]> = {
        light: 10,
        medium: 25,
        heavy: 50,
        success: [10, 50, 10],
        error: [50, 30, 50],
    };

    navigator.vibrate(patterns[type]);
}
