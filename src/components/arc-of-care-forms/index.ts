/**
 * Arc of Care Forms - Central Export
 * 
 * 18 modular form components organized by phase
 */

// ========== SHARED COMPONENTS ==========
export { FormField } from './shared/FormField';
export { NumberInput } from './shared/NumberInput';
export { StarRating } from './shared/StarRating';
export { SegmentedControl } from './shared/SegmentedControl';
export { UserPicker } from './shared/UserPicker';
export type { UserOption } from './shared/UserPicker';
export { NowButton, RelativeTimeDisplay } from './shared/NowButton';
export { VitalPresetsBar, VITAL_PRESETS } from './shared/VitalPresetsBar';
export type { VitalPreset } from './shared/VitalPresetsBar';
export { BatchRegistrationModal } from './shared/BatchRegistrationModal';
export type { BatchData } from './shared/BatchRegistrationModal';
export { DeviceRegistrationModal } from './shared/DeviceRegistrationModal';
export type { DeviceData } from './shared/DeviceRegistrationModal';
export { VisualTimeline } from './shared/VisualTimeline';
export type { VisualTimelineProps } from './shared/VisualTimeline';
export { FormFooter } from './shared/FormFooter';
export type { FormFooterProps } from './shared/FormFooter';

// ========== PHASE 1: PREPARATION (4 forms) ==========
export { default as MEQ30QuestionnaireForm } from './phase-1-preparation/MEQ30QuestionnaireForm';
export type { MEQ30Data } from './phase-1-preparation/MEQ30QuestionnaireForm';

export { default as SetAndSettingForm } from './phase-1-preparation/SetAndSettingForm';
export type { SetAndSettingData } from './phase-1-preparation/SetAndSettingForm';

export { default as BaselineObservationsForm } from './phase-1-preparation/BaselineObservationsForm';
export type { BaselineObservationsData } from './phase-1-preparation/BaselineObservationsForm';

export { default as ConsentForm } from './phase-1-preparation/ConsentForm';
export type { ConsentData } from './phase-1-preparation/ConsentForm';

export { default as MentalHealthScreeningForm } from '../wizards/BaselineAssessmentWizard';
// ========== PHASE 2: DOSING SESSION (7 forms) ==========
export { default as DosingProtocolForm } from './phase-2-dosing/DosingProtocolForm';
export type { DosingProtocolData } from './phase-2-dosing/DosingProtocolForm';

export { default as SessionVitalsForm } from './phase-2-dosing/SessionVitalsForm';
export type { VitalSignReading } from './phase-2-dosing/SessionVitalsForm';

export { default as SessionTimelineForm } from './phase-2-dosing/SessionTimelineForm';
export type { TimelineEvent } from './phase-2-dosing/SessionTimelineForm';



export { default as SessionObservationsForm } from './phase-2-dosing/SessionObservationsForm';
export type { SessionObservationsData } from './phase-2-dosing/SessionObservationsForm';



// Unified replacement for AdverseEventForm + SafetyEventObservationsForm
export { default as SafetyAndAdverseEventForm } from './phase-2-dosing/SafetyAndAdverseEventForm';
export type { SafetyAndAdverseEventData, ObservationLogEntry } from './phase-2-dosing/SafetyAndAdverseEventForm';

export { default as RescueProtocolForm } from './phase-2-dosing/RescueProtocolForm';
export type { RescueProtocolData } from './phase-2-dosing/RescueProtocolForm';

// ========== PHASE 3: INTEGRATION (4 forms - 100% PHI-Safe) ==========
export { default as DailyPulseCheckForm } from './phase-3-integration/DailyPulseCheckForm';
export type { DailyPulseCheckData } from './phase-3-integration/DailyPulseCheckForm';

export { default as LongitudinalAssessmentForm } from './phase-3-integration/LongitudinalAssessmentForm';
export type { LongitudinalAssessmentData } from './phase-3-integration/LongitudinalAssessmentForm';

export { default as StructuredIntegrationSessionForm } from './phase-3-integration/StructuredIntegrationSessionForm';
export type { StructuredIntegrationSessionData } from './phase-3-integration/StructuredIntegrationSessionForm';

export { default as BehavioralChangeTrackerForm } from './phase-3-integration/BehavioralChangeTrackerForm';
export type { BehavioralChangeData } from './phase-3-integration/BehavioralChangeTrackerForm';

// ========== ONGOING SAFETY (1 form - 100% PHI-Safe) ==========
export { default as StructuredSafetyCheckForm } from './ongoing-safety/StructuredSafetyCheckForm';
export type { StructuredSafetyCheckData } from './ongoing-safety/StructuredSafetyCheckForm';

