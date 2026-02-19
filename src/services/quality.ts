/**
 * quality.ts — WO-206 Service Layer Isolation
 *
 * Responsible for: client-side validation and documentation completeness checks.
 * Pure functions only — no Supabase calls.
 */

import type { BaselineAssessmentData, PulseCheckData } from './clinicalLog';

/** Validates baseline assessment data. Returns error message or null if valid. */
export function validateBaselineAssessment(data: BaselineAssessmentData): string | null {
    if (!data.patient_id) return 'Patient ID is required';
    if (!data.site_id) return 'Site ID is required';
    if (data.expectancy_scale !== undefined && (data.expectancy_scale < 1 || data.expectancy_scale > 100))
        return 'Expectancy scale must be 1-100';
    if (data.ace_score !== undefined && (data.ace_score < 0 || data.ace_score > 10))
        return 'ACE score must be 0-10';
    if (data.gad7_score !== undefined && (data.gad7_score < 0 || data.gad7_score > 21))
        return 'GAD-7 score must be 0-21';
    if (data.phq9_score !== undefined && (data.phq9_score < 0 || data.phq9_score > 27))
        return 'PHQ-9 score must be 0-27';
    return null;
}

/** Validates pulse check data. Returns error message or null if valid. */
export function validatePulseCheck(data: PulseCheckData): string | null {
    if (!data.patient_id) return 'Patient ID is required';
    if (data.connection_level < 1 || data.connection_level > 5) return 'Connection level must be 1-5';
    if (data.sleep_quality < 1 || data.sleep_quality > 5) return 'Sleep quality must be 1-5';
    return null;
}
