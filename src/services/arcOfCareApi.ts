/**
 * Arc of Care API Service
 * 
 * Handles all API calls for the Arc of Care system (WO_042)
 * Phase 1: Protocol Builder
 * Phase 2: Session Logger  
 * Phase 3: Integration Tracker
 */

import { supabase } from '../supabaseClient';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface BaselineAssessmentData {
    subject_id: string;
    site_id: number;
    expectancy_scale: number; // 1-100
    ace_score: number; // 0-10
    gad7_score: number; // 0-21
    phq9_score: number; // 0-27
    observation_ids?: number[]; // PHI-safe: controlled vocabulary only
}

export interface SessionEventData {
    session_id: number;
    event_type_id: number;
    severity_id?: number;
    notes?: string;
}

export interface PulseCheckData {
    subject_id: string;
    connection_level: number; // 1-5
    sleep_quality: number; // 1-5
    notes?: string;
}

// ============================================================================
// PHASE 1: PROTOCOL BUILDER APIs
// ============================================================================

/**
 * POST /api/phase1/baseline-assessment
 * 
 * Creates a new baseline assessment for a patient
 */
export async function createBaselineAssessment(data: BaselineAssessmentData) {
    try {
        // Insert baseline assessment
        const { data: result, error } = await supabase
            .from('log_baseline_assessments')
            .insert([{
                subject_id: data.subject_id,
                site_id: data.site_id,
                expectancy_scale: data.expectancy_scale,
                ace_score: data.ace_score,
                gad7_score: data.gad7_score,
                phq9_score: data.phq9_score,
                created_at: new Date().toISOString()
            }])
            .select()
            .single();

        if (error) throw error;

        // If observations were selected, link them
        if (data.observation_ids && data.observation_ids.length > 0 && result) {
            const observations = data.observation_ids.map(obs_id => ({
                baseline_assessment_id: result.baseline_assessment_id,
                observation_id: obs_id
            }));

            const { error: obsError } = await supabase
                .from('log_baseline_observations')
                .insert(observations);

            if (obsError) {
                console.error('Error linking observations:', obsError);
                // Don't fail the whole request if observation linking fails
            }
        }

        return { success: true, data: result };
    } catch (error) {
        console.error('Error creating baseline assessment:', error);
        return { success: false, error };
    }
}

/**
 * GET /api/phase1/augmented-intelligence/:patientId
 * 
 * Retrieves augmented intelligence predictions for a patient
 * Calculates predicted integration needs based on baseline scores
 */
export async function getAugmentedIntelligence(subjectId: string) {
    try {
        // Fetch latest baseline assessment
        const { data: baseline, error } = await supabase
            .from('log_baseline_assessments')
            .select('*')
            .eq('subject_id', subjectId)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        if (error) throw error;
        if (!baseline) {
            return { success: false, error: 'No baseline assessment found' };
        }

        // Calculate predicted integration needs
        const prediction = calculateIntegrationNeeds(baseline);

        return { success: true, data: prediction };
    } catch (error) {
        console.error('Error fetching augmented intelligence:', error);
        return { success: false, error };
    }
}

// ============================================================================
// PHASE 2: SESSION LOGGER APIs
// ============================================================================

/**
 * POST /api/phase2/session-event
 * 
 * Logs a session event (safety event, intervention, milestone)
 */
export async function createSessionEvent(data: SessionEventData) {
    try {
        const { data: result, error } = await supabase
            .from('log_safety_events')
            .insert([{
                session_id: data.session_id,
                event_type_id: data.event_type_id,
                severity_id: data.severity_id,
                notes: data.notes,
                created_at: new Date().toISOString()
            }])
            .select()
            .single();

        if (error) throw error;
        return { success: true, data: result };
    } catch (error) {
        console.error('Error creating session event:', error);
        return { success: false, error };
    }
}

/**
 * GET /api/phase2/session-vitals/:sessionId
 * 
 * Retrieves real-time vitals for a session
 */
export async function getSessionVitals(sessionId: number) {
    try {
        const { data, error } = await supabase
            .from('log_session_vitals')
            .select('*')
            .eq('session_id', sessionId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error fetching session vitals:', error);
        return { success: false, error };
    }
}

// ============================================================================
// PHASE 3: INTEGRATION TRACKER APIs
// ============================================================================

/**
 * POST /api/phase3/pulse-check
 * 
 * Creates a daily pulse check entry
 */
export async function createPulseCheck(data: PulseCheckData) {
    try {
        const { data: result, error } = await supabase
            .from('log_pulse_checks')
            .insert([{
                subject_id: data.subject_id,
                connection_level: data.connection_level,
                sleep_quality: data.sleep_quality,
                notes: data.notes,
                created_at: new Date().toISOString()
            }])
            .select()
            .single();

        if (error) throw error;
        return { success: true, data: result };
    } catch (error) {
        console.error('Error creating pulse check:', error);
        return { success: false, error };
    }
}

/**
 * GET /api/phase3/symptom-trajectory/:patientId
 * 
 * Retrieves PHQ-9 trajectory data for symptom decay curve
 */
export async function getSymptomTrajectory(subjectId: string, days: number = 180) {
    try {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const { data, error } = await supabase
            .from('log_longitudinal_assessments')
            .select('*')
            .eq('subject_id', subjectId)
            .eq('assessment_scale_id', 1) // PHQ-9
            .gte('created_at', startDate.toISOString())
            .order('created_at', { ascending: true });

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error fetching symptom trajectory:', error);
        return { success: false, error };
    }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Calculate predicted integration needs based on baseline scores
 * 
 * Algorithm:
 * - ACE Score (0-10): Higher = more sessions needed
 * - GAD-7 Score (0-21): Higher = more sessions needed
 * - Expectancy Scale (1-100): Lower = more sessions needed
 * - PHQ-9 Score (0-27): Higher = more sessions needed
 */
function calculateIntegrationNeeds(baseline: any) {
    const { ace_score, gad7_score, expectancy_scale, phq9_score } = baseline;

    // Calculate risk score (0-100)
    const aceRisk = (ace_score / 10) * 30; // 30% weight
    const gad7Risk = (gad7_score / 21) * 25; // 25% weight
    const expectancyRisk = ((100 - expectancy_scale) / 100) * 20; // 20% weight (inverted)
    const phq9Risk = (phq9_score / 27) * 25; // 25% weight

    const totalRisk = aceRisk + gad7Risk + expectancyRisk + phq9Risk;

    // Determine session count and schedule
    let sessionCount: number;
    let riskLevel: 'low' | 'moderate' | 'high' | 'critical';
    let schedule: string;
    let rationale: string;

    if (totalRisk < 25) {
        sessionCount = 4;
        riskLevel = 'low';
        schedule = 'Weekly for 1 month';
        rationale = 'Low baseline risk. Standard integration protocol recommended.';
    } else if (totalRisk < 50) {
        sessionCount = 8;
        riskLevel = 'moderate';
        schedule = 'Twice weekly for 1 month, then weekly for 1 month';
        rationale = 'Moderate baseline risk. Enhanced integration support recommended.';
    } else if (totalRisk < 75) {
        sessionCount = 12;
        riskLevel = 'high';
        schedule = 'Twice weekly for 2 months, then weekly for 2 months';
        rationale = 'High baseline risk. Intensive integration protocol recommended.';
    } else {
        sessionCount = 16;
        riskLevel = 'critical';
        schedule = 'Three times weekly for 1 month, then twice weekly for 2 months';
        rationale = 'Critical baseline risk. Maximum integration support required.';
    }

    return {
        sessionCount,
        riskLevel,
        schedule,
        rationale,
        riskScore: Math.round(totalRisk),
        breakdown: {
            aceRisk: Math.round(aceRisk),
            gad7Risk: Math.round(gad7Risk),
            expectancyRisk: Math.round(expectancyRisk),
            phq9Risk: Math.round(phq9Risk)
        }
    };
}

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

export function validateBaselineAssessment(data: BaselineAssessmentData): string | null {
    if (!data.subject_id) return 'Subject ID is required';
    if (!data.site_id) return 'Site ID is required';
    if (data.expectancy_scale < 1 || data.expectancy_scale > 100) return 'Expectancy scale must be 1-100';
    if (data.ace_score < 0 || data.ace_score > 10) return 'ACE score must be 0-10';
    if (data.gad7_score < 0 || data.gad7_score > 21) return 'GAD-7 score must be 0-21';
    if (data.phq9_score < 0 || data.phq9_score > 27) return 'PHQ-9 score must be 0-27';
    return null;
}

export function validatePulseCheck(data: PulseCheckData): string | null {
    if (!data.subject_id) return 'Subject ID is required';
    if (data.connection_level < 1 || data.connection_level > 5) return 'Connection level must be 1-5';
    if (data.sleep_quality < 1 || data.sleep_quality > 5) return 'Sleep quality must be 1-5';
    return null;
}
