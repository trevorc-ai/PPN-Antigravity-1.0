/**
 * analytics.ts — WO-206 Service Layer Isolation
 *
 * Responsible for: aggregate read queries ONLY.
 * EVERY query that touches patient data MUST include k-anonymity guard:
 *   minimum 5 distinct patients before returning results.
 *
 * Single-patient reads (fetching one patient's own trajectory) are allowed
 * as they are the patient's own data, not population-level aggregates.
 */

import { supabase } from '../supabaseClient';

// ============================================================================
// HELPER: Integration needs predictor
// (pure function — no DB access, moved here to co-locate with analytics)
// ============================================================================

/**
 * Calculate predicted integration needs based on baseline scores.
 * ACE (0-10) 30% weight, GAD-7 (0-21) 25%, Expectancy (1-100 inverted) 20%, PHQ-9 (0-27) 25%.
 */
function calculateIntegrationNeeds(baseline: Record<string, number>) {
    const { ace_score = 0, gad7_score = 0, expectancy_scale = 50, phq9_score = 0 } = baseline;

    const aceRisk = (ace_score / 10) * 30;
    const gad7Risk = (gad7_score / 21) * 25;
    const expectancyRisk = ((100 - expectancy_scale) / 100) * 20;
    const phq9Risk = (phq9_score / 27) * 25;
    const totalRisk = aceRisk + gad7Risk + expectancyRisk + phq9Risk;

    let sessionCount: number;
    let riskLevel: 'low' | 'moderate' | 'high' | 'critical';
    let schedule: string;
    let rationale: string;

    if (totalRisk < 25) {
        sessionCount = 4; riskLevel = 'low';
        schedule = 'Weekly for 1 month';
        rationale = 'Low baseline risk. Standard integration protocol recommended.';
    } else if (totalRisk < 50) {
        sessionCount = 8; riskLevel = 'moderate';
        schedule = 'Twice weekly for 1 month, then weekly for 1 month';
        rationale = 'Moderate baseline risk. Enhanced integration support recommended.';
    } else if (totalRisk < 75) {
        sessionCount = 12; riskLevel = 'high';
        schedule = 'Twice weekly for 2 months, then weekly for 2 months';
        rationale = 'High baseline risk. Intensive integration protocol recommended.';
    } else {
        sessionCount = 16; riskLevel = 'critical';
        schedule = 'Three times weekly for 1 month, then twice weekly for 2 months';
        rationale = 'Critical baseline risk. Maximum integration support required.';
    }

    return {
        sessionCount, riskLevel, schedule, rationale,
        riskScore: Math.round(totalRisk),
        breakdown: {
            aceRisk: Math.round(aceRisk),
            gad7Risk: Math.round(gad7Risk),
            expectancyRisk: Math.round(expectancyRisk),
            phq9Risk: Math.round(phq9Risk),
        },
    };
}

// ============================================================================
// PATIENT-SCOPED READS (own data — k-anon not required)
// ============================================================================

/**
 * Retrieves PHQ-9 + GAD-7 trajectory for symptom decay curve.
 * Single-patient read — patient's own data, no k-anonymity floor needed.
 */
export async function getSymptomTrajectory(patientId: string, days: number = 180) {
    try {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        const startDateStr = startDate.toISOString().split('T')[0];

        const { data, error } = await supabase
            .from('log_longitudinal_assessments')
            .select('assessment_date, days_post_session, phq9_score, gad7_score, whoqol_score')
            .eq('patient_id', patientId)
            .gte('assessment_date', startDateStr)
            .order('assessment_date', { ascending: true });

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('[analytics] getSymptomTrajectory:', error);
        return { success: false, error };
    }
}

/**
 * Retrieves augmented intelligence predictions for a patient.
 * Reads one patient's baseline — patient's own data, no k-anonymity floor needed.
 */
export async function getAugmentedIntelligence(patientId: string) {
    try {
        const { data: baseline, error } = await supabase
            .from('log_baseline_assessments')
            .select('*')
            .eq('patient_id', patientId)
            .order('assessment_date', { ascending: false })
            .limit(1)
            .single();

        if (error) throw error;
        if (!baseline) return { success: false, error: 'No baseline assessment found' };

        const prediction = calculateIntegrationNeeds(baseline);
        return { success: true, data: prediction };
    } catch (error) {
        console.error('[analytics] getAugmentedIntelligence:', error);
        return { success: false, error };
    }
}
