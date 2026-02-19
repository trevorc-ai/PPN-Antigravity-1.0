import React from 'react';
import { useToast } from '../../contexts/ToastContext';

// All arc-of-care forms — in clinical sequence
import {
    // Phase 1: Preparation
    ConsentForm,
    StructuredSafetyCheckForm,
    BaselineObservationsForm,
    SetAndSettingForm,
    MentalHealthScreeningForm,
    // Phase 2: Dosing Session
    DosingProtocolForm,
    SessionTimelineForm,
    SessionVitalsForm,
    SessionObservationsForm,
    SafetyAndAdverseEventForm,
    RescueProtocolForm,
    // Phase 3: Integration — Early Follow-up
    DailyPulseCheckForm,
    MEQ30QuestionnaireForm,
    // Phase 3: Integration — Integration Work
    StructuredIntegrationSessionForm,
    BehavioralChangeTrackerForm,
    LongitudinalAssessmentForm,
} from '../arc-of-care-forms';

/**
 * WellnessFormRouter — WO-113
 *
 * Maps a formId string to the correct pre-built form component.
 * Clinical sequence matches the arc-of-care protocol:
 *
 * Phase 1 — Preparation:
 *   consent → structured-safety → baseline-observations → set-and-setting
 *
 * Phase 2 — Dosing Session:
 *   dosing-protocol → session-timeline → session-vitals → session-observations
 *   → safety-and-adverse-event → rescue-protocol
 *
 * Phase 3 — Integration (Early, 0–72 hrs):
 *   structured-safety → daily-pulse → meq30 (optional, provider-discretion)
 *
 * Phase 3 — Integration (Longitudinal):
 *   structured-integration → behavioral-tracker → longitudinal-assessment
 *
 * Note: MEQ-30 is phase-agnostic. It is available as a persistent button
 * at all phases. Timing is per individual protocol.
 *
 * TODO: replace console.log with Supabase mutations after schema deployment.
 */

export type WellnessFormId =
    // Phase 1
    | 'consent'
    | 'structured-safety'
    | 'baseline-observations'
    | 'set-and-setting'
    | 'mental-health'
    // Phase 2
    | 'dosing-protocol'
    | 'session-timeline'
    | 'session-vitals'
    | 'session-observations'
    | 'safety-and-adverse-event'
    | 'rescue-protocol'
    // Phase 3 — Early follow-up
    | 'daily-pulse'
    | 'meq30'
    // Phase 3 — Integration work
    | 'structured-integration'
    | 'behavioral-tracker'
    | 'longitudinal-assessment';

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

    const handleSave = (label: string) => (data: unknown) => {
        console.log(`[MOCK] Saved "${label}" for patient ${patientId} session ${sessionId}:`, data);
        addToast({
            title: `${label} Saved`,
            message: 'Data recorded. Pending DB sync after schema deployment.',
            type: 'success',
        });
        onComplete?.();
    };

    switch (formId) {

        // ── Phase 1: Preparation ──────────────────────────────────────────────
        case 'consent':
            return <ConsentForm onSave={handleSave('Informed Consent')} />;

        case 'structured-safety':
            return <StructuredSafetyCheckForm onSave={handleSave('Safety Screen')} />;

        case 'baseline-observations':
            return <BaselineObservationsForm onSave={handleSave('Baseline Observations')} />;

        case 'set-and-setting':
            return <SetAndSettingForm onSave={handleSave('Set & Setting')} />;

        case 'mental-health':
            return <MentalHealthScreeningForm patientId={patientId} onComplete={handleSave('Mental Health Screening')} />;

        // ── Phase 2: Dosing Session ───────────────────────────────────────────
        case 'dosing-protocol':
            return <DosingProtocolForm onSave={handleSave('Dosing Protocol')} />;

        case 'session-timeline':
            return <SessionTimelineForm onSave={handleSave('Session Timeline')} />;

        case 'session-vitals':
            return <SessionVitalsForm onSave={handleSave('Session Vitals')} />;

        case 'session-observations':
            return <SessionObservationsForm onSave={handleSave('Session Observations')} />;

        case 'safety-and-adverse-event':
            return <SafetyAndAdverseEventForm onSave={handleSave('Safety & Adverse Events')} />;

        case 'rescue-protocol':
            return <RescueProtocolForm onSave={handleSave('Rescue Protocol')} />;

        // ── Phase 3: Integration — Early Follow-up ───────────────────────────
        case 'daily-pulse':
            return <DailyPulseCheckForm onSave={handleSave('Daily Pulse Check')} />;

        case 'meq30':
            // Phase-agnostic — available at any phase per provider protocol
            return <MEQ30QuestionnaireForm onSave={handleSave('MEQ-30 Questionnaire')} />;

        // ── Phase 3: Integration — Integration Work ──────────────────────────
        case 'structured-integration':
            return <StructuredIntegrationSessionForm onSave={handleSave('Integration Session')} />;

        case 'behavioral-tracker':
            return <BehavioralChangeTrackerForm onSave={handleSave('Behavioral Change Tracker')} />;

        case 'longitudinal-assessment':
            return <LongitudinalAssessmentForm onSave={handleSave('Longitudinal Assessment')} />;

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
