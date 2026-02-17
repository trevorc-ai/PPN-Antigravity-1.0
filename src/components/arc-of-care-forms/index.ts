/**
 * Arc of Care Forms - Central Export
 * 
 * 20 modular form components organized by phase
 */

// ========== SHARED COMPONENTS ==========
export { FormField } from './shared/FormField';
export { NumberInput } from './shared/NumberInput';
export { StarRating } from './shared/StarRating';
export { SegmentedControl } from './shared/SegmentedControl';
export { UserPicker } from './shared/UserPicker';
export type { UserOption } from './shared/UserPicker';

// ========== PHASE 1: PREPARATION (5 forms) ==========
export { default as MentalHealthScreeningForm } from './phase-1-preparation/MentalHealthScreeningForm';
export type { MentalHealthScreeningData } from './phase-1-preparation/MentalHealthScreeningForm';

export { default as SetAndSettingForm } from './phase-1-preparation/SetAndSettingForm';
export type { SetAndSettingData } from './phase-1-preparation/SetAndSettingForm';

export { default as BaselinePhysiologyForm } from './phase-1-preparation/BaselinePhysiologyForm';
export type { BaselinePhysiologyData } from './phase-1-preparation/BaselinePhysiologyForm';

export { default as BaselineObservationsForm } from './phase-1-preparation/BaselineObservationsForm';
export type { BaselineObservationsData } from './phase-1-preparation/BaselineObservationsForm';

export { default as ConsentForm } from './phase-1-preparation/ConsentForm';
export type { ConsentData } from './phase-1-preparation/ConsentForm';

// ========== PHASE 2: DOSING SESSION (9 forms) ==========
export { default as DosingProtocolForm } from './phase-2-dosing/DosingProtocolForm';
export type { DosingProtocolData } from './phase-2-dosing/DosingProtocolForm';

export { default as SessionVitalsForm } from './phase-2-dosing/SessionVitalsForm';
export type { VitalSignReading } from './phase-2-dosing/SessionVitalsForm';

export { default as SessionTimelineForm } from './phase-2-dosing/SessionTimelineForm';
export type { SessionTimelineData } from './phase-2-dosing/SessionTimelineForm';

export { default as SessionObservationsForm } from './phase-2-dosing/SessionObservationsForm';
export type { SessionObservationsData } from './phase-2-dosing/SessionObservationsForm';

export { default as PostSessionAssessmentsForm } from './phase-2-dosing/PostSessionAssessmentsForm';
export type { PostSessionAssessmentsData } from './phase-2-dosing/PostSessionAssessmentsForm';

export { default as MEQ30QuestionnaireForm } from './phase-2-dosing/MEQ30QuestionnaireForm';
export type { MEQ30Data } from './phase-2-dosing/MEQ30QuestionnaireForm';

export { default as AdverseEventForm } from './phase-2-dosing/AdverseEventForm';
export type { AdverseEventData } from './phase-2-dosing/AdverseEventForm';

export { default as SafetyEventObservationsForm } from './phase-2-dosing/SafetyEventObservationsForm';
export type { SafetyEventObservationsData } from './phase-2-dosing/SafetyEventObservationsForm';

export { default as RescueProtocolForm } from './phase-2-dosing/RescueProtocolForm';
export type { RescueProtocolData } from './phase-2-dosing/RescueProtocolForm';

// ========== PHASE 3: INTEGRATION (4 forms) ==========
export { default as DailyPulseCheckForm } from './phase-3-integration/DailyPulseCheckForm';
export type { DailyPulseCheckData } from './phase-3-integration/DailyPulseCheckForm';

export { default as LongitudinalAssessmentForm } from './phase-3-integration/LongitudinalAssessmentForm';
export type { LongitudinalAssessmentData } from './phase-3-integration/LongitudinalAssessmentForm';

export { default as IntegrationSessionNotesForm } from './phase-3-integration/IntegrationSessionNotesForm';
export type { IntegrationSessionNotesData } from './phase-3-integration/IntegrationSessionNotesForm';

export { default as IntegrationInsightsForm } from './phase-3-integration/IntegrationInsightsForm';
export type { IntegrationInsightsData } from './phase-3-integration/IntegrationInsightsForm';

// ========== ONGOING SAFETY (2 forms) ==========
export { default as OngoingSafetyMonitoringForm } from './ongoing-safety/OngoingSafetyMonitoringForm';
export type { OngoingSafetyMonitoringData } from './ongoing-safety/OngoingSafetyMonitoringForm';

export { default as ProgressNotesForm } from './ongoing-safety/ProgressNotesForm';
export type { ProgressNotesData } from './ongoing-safety/ProgressNotesForm';
