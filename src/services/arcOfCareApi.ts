/**
 * arcOfCareApi.ts — Backward-compatibility barrel
 *
 * WO-206: arcOfCareApi.ts was split into domain services on 2026-02-19.
 * This file re-exports everything so existing imports continue to work
 * without any changes to consumers.
 *
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │  NEW canonical locations:                                               │
 * │  identity.ts    → getCurrentSiteId()                                   │
 * │  vocabulary.ts  → getSessionFocusAreas(), getHomeworkTypes(), etc.     │
 * │  clinicalLog.ts → createBaseline…(), createConsent(), createSession…() │
 * │  analytics.ts   → getSymptomTrajectory(), getAugmentedIntelligence()  │
 * │  quality.ts     → validateBaselineAssessment(), validatePulseCheck()  │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * Once all consumers are updated to import from the canonical locations,
 * this barrel can be deleted (WO-206 Acceptance Criteria step 4).
 */

export { getCurrentSiteId } from './identity';

export {
    getSessionFocusAreas,
    getHomeworkTypes,
    getTherapistObservations,
    getBehavioralChangeTypes,
    invalidateVocabularyCache,
} from './vocabulary';

export type {
    SessionFocusArea,
    HomeworkType,
    TherapistObservation,
    BehavioralChangeType,
} from './vocabulary';

export {
    createBaselineAssessment,
    createConsent,
    createSessionEvent,
    createSessionVital,
    getSessionVitals,
    createSessionObservation,
    createTimelineEvent,
    createPulseCheck,
    createIntegrationSession,
    createBehavioralChange,
    createLongitudinalAssessment,
} from './clinicalLog';

export type {
    BaselineAssessmentData,
    SessionEventData,
    PulseCheckData,
    SessionVitalData,
    TimelineEventData,
    IntegrationSessionData,
    BehavioralChangeData,
    LongitudinalAssessmentData,
    ConsentData,
} from './clinicalLog';

export {
    getSymptomTrajectory,
    getAugmentedIntelligence,
} from './analytics';

export {
    validateBaselineAssessment,
    validatePulseCheck,
} from './quality';
