import { useState, useCallback, useRef } from 'react';

/**
 * Typical clinical ranges by age group.
 * Used to suggest pre-fill values for numeric form fields.
 * WO-075: Smart Pre-Fill System
 */
export const TYPICAL_RANGES = {
    hrv_ms: {
        '18-25': { min: 55, max: 105, typical: 80 },
        '26-35': { min: 50, max: 95, typical: 72 },
        '36-45': { min: 40, max: 60, typical: 50 },
        '46-55': { min: 25, max: 45, typical: 35 },
        '56+': { min: 20, max: 35, typical: 28 },
    },
    bp_systolic: { typical: 120, min: 90, max: 140 },
    bp_diastolic: { typical: 80, min: 60, max: 90 },
    heart_rate: { typical: 72, min: 50, max: 100 },
    respiratory_rate: { typical: 16, min: 12, max: 20 },
    spo2_percent: { typical: 98, min: 95, max: 100 },
    temperature_f: { typical: 98.6, min: 97.0, max: 99.5 },
} as const;

export interface PreFillSuggestion {
    value: number | string;
    source: 'typical_range' | 'last_entered' | 'patient_baseline';
    label: string;
    confidence: 'high' | 'medium' | 'low';
}

interface SmartPreFillOptions {
    fieldKey: string;
    ageGroup?: string;
    patientBaseline?: Record<string, number | string>;
}

const STORAGE_KEY_PREFIX = 'ppn_prefill_';

function getLastEntered(fieldKey: string): number | null {
    try {
        const raw = localStorage.getItem(`${STORAGE_KEY_PREFIX}${fieldKey}`);
        return raw ? parseFloat(raw) : null;
    } catch {
        return null;
    }
}

function saveLastEntered(fieldKey: string, value: number | string): void {
    try {
        localStorage.setItem(`${STORAGE_KEY_PREFIX}${fieldKey}`, String(value));
    } catch {
        // localStorage unavailable — silently skip
    }
}

/**
 * useSmartPreFill
 * 
 * Returns a suggestion for a form field based on:
 * 1. Patient baseline data (highest priority)
 * 2. Last entered value by this practitioner
 * 3. Typical range for the field (age-adjusted where applicable)
 * 
 * Also provides `acceptSuggestion` and `clearSuggestion` handlers,
 * and `recordEntry` to save the practitioner's actual value for future suggestions.
 */
export function useSmartPreFill(options: SmartPreFillOptions) {
    const { fieldKey, ageGroup = '36-45', patientBaseline } = options;

    const getSuggestion = useCallback((): PreFillSuggestion | null => {
        // Priority 1: Patient baseline
        if (patientBaseline && patientBaseline[fieldKey] !== undefined) {
            return {
                value: patientBaseline[fieldKey],
                source: 'patient_baseline',
                label: `Baseline value: ${patientBaseline[fieldKey]}`,
                confidence: 'high',
            };
        }

        // Priority 2: Last entered by practitioner
        const lastVal = getLastEntered(fieldKey);
        if (lastVal !== null) {
            return {
                value: lastVal,
                source: 'last_entered',
                label: `Last entered: ${lastVal}`,
                confidence: 'medium',
            };
        }

        // Priority 3: Typical range
        const ranges = TYPICAL_RANGES as Record<string, unknown>;
        const fieldRanges = ranges[fieldKey];
        if (fieldRanges) {
            // Age-adjusted (e.g. HRV)
            const ageAdjusted = (fieldRanges as Record<string, { min: number; max: number; typical: number }>)[ageGroup];
            if (ageAdjusted) {
                return {
                    value: ageAdjusted.typical,
                    source: 'typical_range',
                    label: `Typical for age ${ageGroup}: ${ageAdjusted.min}–${ageAdjusted.max}`,
                    confidence: 'low',
                };
            }
            // Non-age-adjusted
            const flat = fieldRanges as { min: number; max: number; typical: number };
            if (flat.typical !== undefined) {
                return {
                    value: flat.typical,
                    source: 'typical_range',
                    label: `Typical range: ${flat.min}–${flat.max}`,
                    confidence: 'low',
                };
            }
        }

        return null;
    }, [fieldKey, ageGroup, patientBaseline]);

    const [accepted, setAccepted] = useState(false);
    const [dismissed, setDismissed] = useState(false);
    const suggestion = (!accepted && !dismissed) ? getSuggestion() : null;

    const acceptSuggestion = useCallback(() => {
        setAccepted(true);
    }, []);

    const clearSuggestion = useCallback(() => {
        setDismissed(true);
    }, []);

    const recordEntry = useCallback((value: number | string) => {
        saveLastEntered(fieldKey, value);
    }, [fieldKey]);

    return { suggestion, acceptSuggestion, clearSuggestion, recordEntry };
}

/**
 * SmartPreFillBadge props — for use in form field components
 * to display and interact with a suggestion.
 */
export interface SmartPreFillBadgeProps {
    suggestion: PreFillSuggestion;
    onAccept: () => void;
    onClear: () => void;
}
