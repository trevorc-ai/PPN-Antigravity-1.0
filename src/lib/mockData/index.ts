/**
 * Mock Data Library - Central Export
 * 
 * Import from this file to use mock data in Integration Batch components.
 */

// Types
export type {
    BaselineAssessment,
    SessionTimeline,
    VitalSignReading,
    LongitudinalAssessment,
    PulseCheck,
    PatientJourney,
    MockDataConfig
} from './types';

// Generators
export {
    generateBaselineAssessment,
    generateSessionTimeline,
    generateSessionVitals,
    generateLongitudinalAssessments,
    generatePulseChecks,
    generatePatientJourney,
    MOCK_JOURNEYS
} from './generators';

// Hooks
export {
    useBaselineAssessment,
    useSessionTimeline,
    useSessionVitals,
    useLongitudinalAssessments,
    usePulseChecks,
    usePatientJourney,
    useSaveBaselineAssessment,
    useSaveVitalSign,
    useSavePulseCheck,
    USE_MOCK_DATA
} from './hooks';
