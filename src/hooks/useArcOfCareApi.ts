/**
 * Wellness Journey API Hook
 * 
 * React hook for Wellness Journey API calls with loading/error states
 * Part of WO_042
 */

import { useState } from 'react';
import {
    createBaselineAssessment,
    getAugmentedIntelligence,
    createSessionEvent,
    getSessionVitals,
    createPulseCheck,
    getSymptomTrajectory,
    validateBaselineAssessment,
    validatePulseCheck,
    type BaselineAssessmentData,
    type SessionEventData,
    type PulseCheckData
} from '../services/arcOfCareApi';

export function useArcOfCareApi() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // ============================================================================
    // PHASE 1: PROTOCOL BUILDER
    // ============================================================================

    const submitBaselineAssessment = async (data: BaselineAssessmentData) => {
        setLoading(true);
        setError(null);

        // Validate
        const validationError = validateBaselineAssessment(data);
        if (validationError) {
            setError(validationError);
            setLoading(false);
            return { success: false, error: validationError };
        }

        // Submit
        const result = await createBaselineAssessment(data);
        setLoading(false);

        if (!result.success) {
            setError(result.error?.message || 'Failed to submit baseline assessment');
        }

        return result;
    };

    const fetchAugmentedIntelligence = async (subjectId: string) => {
        setLoading(true);
        setError(null);

        const result = await getAugmentedIntelligence(subjectId);
        setLoading(false);

        if (!result.success) {
            setError(result.error?.message || 'Failed to fetch augmented intelligence');
        }

        return result;
    };

    // ============================================================================
    // PHASE 2: SESSION LOGGER
    // ============================================================================

    const logSessionEvent = async (data: SessionEventData) => {
        setLoading(true);
        setError(null);

        const result = await createSessionEvent(data);
        setLoading(false);

        if (!result.success) {
            setError(result.error?.message || 'Failed to log session event');
        }

        return result;
    };

    const fetchSessionVitals = async (sessionId: number) => {
        setLoading(true);
        setError(null);

        const result = await getSessionVitals(sessionId);
        setLoading(false);

        if (!result.success) {
            setError(result.error?.message || 'Failed to fetch session vitals');
        }

        return result;
    };

    // ============================================================================
    // PHASE 3: INTEGRATION TRACKER
    // ============================================================================

    const submitPulseCheck = async (data: PulseCheckData) => {
        setLoading(true);
        setError(null);

        // Validate
        const validationError = validatePulseCheck(data);
        if (validationError) {
            setError(validationError);
            setLoading(false);
            return { success: false, error: validationError };
        }

        // Submit
        const result = await createPulseCheck(data);
        setLoading(false);

        if (!result.success) {
            setError(result.error?.message || 'Failed to submit pulse check');
        }

        return result;
    };

    const fetchSymptomTrajectory = async (subjectId: string, days: number = 180) => {
        setLoading(true);
        setError(null);

        const result = await getSymptomTrajectory(subjectId, days);
        setLoading(false);

        if (!result.success) {
            setError(result.error?.message || 'Failed to fetch symptom trajectory');
        }

        return result;
    };

    // ============================================================================
    // RETURN
    // ============================================================================

    return {
        loading,
        error,
        clearError: () => setError(null),

        // Phase 1
        submitBaselineAssessment,
        fetchAugmentedIntelligence,

        // Phase 2
        logSessionEvent,
        fetchSessionVitals,

        // Phase 3
        submitPulseCheck,
        fetchSymptomTrajectory
    };
}
