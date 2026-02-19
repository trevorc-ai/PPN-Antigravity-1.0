import React from 'react';
import { useToast } from '../../contexts/ToastContext';

// All 20 pre-built arc-of-care forms
import {
    // Phase 1: Preparation
    MentalHealthScreeningForm,
    SetAndSettingForm,
    BaselinePhysiologyForm,
    BaselineObservationsForm,
    ConsentForm,
    // Phase 2: Dosing Session
    DosingProtocolForm,
    SessionVitalsForm,
    SessionObservationsForm,
    PostSessionAssessmentsForm,
    MEQ30QuestionnaireForm,
    AdverseEventForm,
    SafetyEventObservationsForm,
    RescueProtocolForm,
    SessionTimelineForm,
    // Phase 3: Integration
    DailyPulseCheckForm,
    LongitudinalAssessmentForm,
    StructuredIntegrationSessionForm,
    BehavioralChangeTrackerForm,
    // Ongoing Safety
    StructuredSafetyCheckForm,
} from '../arc-of-care-forms';

/**
 * WellnessFormRouter — WO-113
 *
 * Maps QuickActionsMenu formId strings to the correct pre-built form component.
 * All forms log to console (mock) and show a toast on save.
 * Swap console.log for Supabase mutations after Arc of Care schema deployment.
 */

export type WellnessFormId =
    // Phase 1
    | 'mental-health'
    | 'set-and-setting'
    | 'baseline-physiology'
    | 'baseline-observations'
    | 'consent'
    // Phase 2
    | 'dosing-protocol'
    | 'session-vitals'
    | 'session-timeline'
    | 'session-observations'
    | 'post-session-assessments'
    | 'meq30'
    | 'adverse-event'
    | 'safety-observations'
    | 'rescue-protocol'
    // Phase 3
    | 'daily-pulse'
    | 'longitudinal-assessment'
    | 'structured-integration'
    | 'behavioral-tracker'
    // Ongoing
    | 'structured-safety';

interface WellnessFormRouterProps {
    formId: WellnessFormId;
    patientId?: string;
    sessionId?: number;
    onComplete?: () => void;
}

export const WellnessFormRouter: React.FC<WellnessFormRouterProps> = ({
    formId,
    patientId = 'PT-MOCK',
    sessionId = 1,
    onComplete,
}) => {
    const { addToast } = useToast();

    // Generic save handler — each form calls this on submit
    const handleSave = (label: string) => (data: any) => {
        // TODO: replace with real Supabase mutation after schema deployment
        console.log(`[MOCK] Saved "${label}" for patient ${patientId}:`, data);
        addToast({
            title: `${label} Saved`,
            message: 'Data recorded. Pending DB sync after schema deployment.',
            type: 'success',
        });
        onComplete?.();
    };

    switch (formId) {
        // ── Phase 1: Preparation ─────────────────────────────────────────────
        case 'mental-health':
            return <MentalHealthScreeningForm onSave={handleSave('Mental Health Screening')} />;

        case 'set-and-setting':
            return <SetAndSettingForm onSave={handleSave('Set & Setting')} />;

        case 'baseline-physiology':
            return <BaselinePhysiologyForm onSave={handleSave('Baseline Physiology')} />;

        case 'baseline-observations':
            return <BaselineObservationsForm onSave={handleSave('Baseline Observations')} />;

        case 'consent':
            return <ConsentForm onSave={handleSave('Informed Consent')} />;

        // ── Phase 2: Dosing Session ──────────────────────────────────────────
        case 'dosing-protocol':
            return <DosingProtocolForm onSave={handleSave('Dosing Protocol')} />;

        case 'session-vitals':
            return <SessionVitalsForm onSave={handleSave('Session Vitals')} />;

        case 'session-timeline':
            return <SessionTimelineForm onSave={handleSave('Session Timeline')} />;

        case 'session-observations':
            return <SessionObservationsForm onSave={handleSave('Session Observations')} />;

        case 'post-session-assessments':
            return <PostSessionAssessmentsForm onSave={handleSave('Post-Session Assessments')} />;

        case 'meq30':
            return <MEQ30QuestionnaireForm onSave={handleSave('MEQ-30 Questionnaire')} />;

        case 'adverse-event':
            return <AdverseEventForm onSave={handleSave('Adverse Event')} />;

        case 'safety-observations':
            return <SafetyEventObservationsForm onSave={handleSave('Safety Observations')} />;

        case 'rescue-protocol':
            return <RescueProtocolForm onSave={handleSave('Rescue Protocol')} />;

        // ── Phase 3: Integration ─────────────────────────────────────────────
        case 'daily-pulse':
            return <DailyPulseCheckForm onSave={handleSave('Daily Pulse Check')} />;

        case 'longitudinal-assessment':
            return <LongitudinalAssessmentForm onSave={handleSave('Longitudinal Assessment')} />;

        case 'structured-integration':
            return <StructuredIntegrationSessionForm onSave={handleSave('Integration Session')} />;

        case 'behavioral-tracker':
            return <BehavioralChangeTrackerForm onSave={handleSave('Behavioral Change')} />;

        // ── Ongoing Safety ───────────────────────────────────────────────────
        case 'structured-safety':
            return <StructuredSafetyCheckForm onSave={handleSave('Safety Check')} />;

        default:
            return (
                <div className="p-8 text-center text-slate-400">
                    <p className="text-base">
                        Form not recognized: <code className="text-slate-300 font-mono">{formId}</code>
                    </p>
                    <p className="text-sm mt-2 text-slate-500">
                        Add this formId to WellnessFormRouter.tsx to connect it.
                    </p>
                </div>
            );
    }
};

export default WellnessFormRouter;
