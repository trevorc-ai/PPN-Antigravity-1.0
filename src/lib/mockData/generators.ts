/**
 * Mock Data Generators for Integration Batch Testing
 * 
 * Generates realistic test data for Arc of Care components.
 * Supports multiple scenarios: success, moderate, poor outcomes, and adverse events.
 */

import type {
    BaselineAssessment,
    SessionTimeline,
    VitalSignReading,
    LongitudinalAssessment,
    PulseCheck,
    PatientJourney
} from './types';

// ========== Helper Functions ==========

function randomInRange(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

function formatDateTime(date: Date): string {
    return date.toISOString();
}

// ========== Scenario Configurations ==========

const SCENARIOS = {
    success: {
        baseline: { phq9: 18, gad7: 16, ace: 3, pcl5: 42, expectancy: 75 },
        improvement: { phq9: -12, gad7: -11, whoqol: +35 }, // Large improvement
        vitalsStability: 'stable',
        pulseCheckAdherence: 0.85 // 85% completion rate
    },
    moderate: {
        baseline: { phq9: 14, gad7: 12, ace: 5, pcl5: 38, expectancy: 60 },
        improvement: { phq9: -6, gad7: -5, whoqol: +20 }, // Moderate improvement
        vitalsStability: 'mostly-stable',
        pulseCheckAdherence: 0.65
    },
    poor: {
        baseline: { phq9: 22, gad7: 19, ace: 7, pcl5: 58, expectancy: 40 },
        improvement: { phq9: -2, gad7: -1, whoqol: +5 }, // Minimal improvement
        vitalsStability: 'variable',
        pulseCheckAdherence: 0.40
    },
    'adverse-event': {
        baseline: { phq9: 16, gad7: 14, ace: 4, pcl5: 45, expectancy: 70 },
        improvement: { phq9: -8, gad7: -6, whoqol: +25 }, // Good improvement despite event
        vitalsStability: 'spike-at-peak',
        pulseCheckAdherence: 0.75
    }
};

// ========== WO-060: Generate Baseline Assessment ==========

export function generateBaselineAssessment(
    patientId: string,
    sessionId: string,
    scenario: keyof typeof SCENARIOS = 'success'
): BaselineAssessment {
    const config = SCENARIOS[scenario];
    const baseDate = new Date('2025-10-01T10:00:00Z');

    return {
        id: `baseline_${sessionId}`,
        patient_id: patientId,
        session_id: sessionId,
        assessment_date: formatDateTime(baseDate),

        phq9_score: config.baseline.phq9,
        gad7_score: config.baseline.gad7,
        ace_score: config.baseline.ace,
        pcl5_score: config.baseline.pcl5,
        expectancy_scale: config.baseline.expectancy,

        practitioner_id: 'prac_demo_001',
        practitioner_npi: '1234567890',
        created_at: formatDateTime(baseDate),
        updated_at: formatDateTime(baseDate)
    };
}

// ========== WO-061: Generate Session Timeline ==========

export function generateSessionTimeline(
    patientId: string,
    sessionId: string,
    scenario: keyof typeof SCENARIOS = 'success'
): SessionTimeline {
    const sessionDate = new Date('2025-10-15T09:00:00Z');
    const doseTime = sessionDate;
    const onsetTime = addDays(doseTime, 0);
    onsetTime.setMinutes(onsetTime.getMinutes() + 45); // T+00:45
    const peakTime = addDays(onsetTime, 0);
    peakTime.setHours(peakTime.getHours() + 2); // T+02:45
    const resolutionTime = addDays(peakTime, 0);
    resolutionTime.setHours(resolutionTime.getHours() + 4); // T+06:45

    const actualDuration = (resolutionTime.getTime() - doseTime.getTime()) / (1000 * 60 * 60);

    return {
        id: `timeline_${sessionId}`,
        session_id: sessionId,
        patient_id: patientId,

        dose_time: formatDateTime(doseTime),
        onset_time: formatDateTime(onsetTime),
        peak_time: formatDateTime(peakTime),
        resolution_time: formatDateTime(resolutionTime),

        substance_type: 'Psilocybin',
        dosage_mg: 25,
        route_of_administration: 'Oral',

        expected_duration_hours: 6,
        actual_duration_hours: actualDuration,

        practitioner_id: 'prac_demo_001',
        created_at: formatDateTime(sessionDate),
        updated_at: formatDateTime(resolutionTime)
    };
}

// ========== WO-062: Generate Session Vitals ==========

export function generateSessionVitals(
    patientId: string,
    sessionId: string,
    scenario: keyof typeof SCENARIOS = 'success'
): VitalSignReading[] {
    const sessionDate = new Date('2025-10-15T09:00:00Z');
    const vitals: VitalSignReading[] = [];

    const phases: Array<{ phase: VitalSignReading['session_phase'], offset: number }> = [
        { phase: 'baseline', offset: 0 },
        { phase: 'onset', offset: 45 },
        { phase: 'peak', offset: 165 },
        { phase: 'resolution', offset: 405 }
    ];

    phases.forEach(({ phase, offset }, index) => {
        const timestamp = new Date(sessionDate);
        timestamp.setMinutes(timestamp.getMinutes() + offset);

        let hr = 72;
        let bpSys = 118;
        let bpDia = 76;

        // Adjust vitals based on phase and scenario
        if (phase === 'peak') {
            if (scenario === 'adverse-event') {
                hr = 135; // Spike
                bpSys = 145;
                bpDia = 92;
            } else {
                hr = 88;
                bpSys = 125;
                bpDia = 82;
            }
        } else if (phase === 'onset') {
            hr = 82;
            bpSys = 122;
            bpDia = 78;
        }

        vitals.push({
            id: `vital_${sessionId}_${index}`,
            session_id: sessionId,
            patient_id: patientId,

            heart_rate: hr,
            hrv: randomInRange(40, 80),
            bp_systolic: bpSys,
            bp_diastolic: bpDia,
            spo2: randomInRange(96, 99),

            recorded_at: formatDateTime(timestamp),
            session_phase: phase,
            data_source: 'device',
            device_id: 'POLAR_H10_001',

            practitioner_id: 'prac_demo_001',
            created_at: formatDateTime(timestamp)
        });
    });

    return vitals;
}

// ========== WO-063: Generate Longitudinal Assessments ==========

export function generateLongitudinalAssessments(
    patientId: string,
    sessionId: string,
    scenario: keyof typeof SCENARIOS = 'success'
): LongitudinalAssessment[] {
    const config = SCENARIOS[scenario];
    const sessionDate = new Date('2025-10-15T09:00:00Z');
    const assessments: LongitudinalAssessment[] = [];

    const timepoints: Array<{
        timepoint: LongitudinalAssessment['timepoint'],
        daysOffset: number,
        improvementFactor: number
    }> = [
            { timepoint: 'baseline', daysOffset: -14, improvementFactor: 0 },
            { timepoint: 'post-session', daysOffset: 1, improvementFactor: 0.3 },
            { timepoint: '1-week', daysOffset: 7, improvementFactor: 0.5 },
            { timepoint: '1-month', daysOffset: 30, improvementFactor: 0.8 },
            { timepoint: '3-month', daysOffset: 90, improvementFactor: 1.0 },
            { timepoint: '6-month', daysOffset: 180, improvementFactor: 0.9 } // Slight regression
        ];

    const baselinePHQ9 = config.baseline.phq9;
    const baselineGAD7 = config.baseline.gad7;
    const baselineWHOQOL = 45; // Typical baseline QOL

    timepoints.forEach(({ timepoint, daysOffset, improvementFactor }) => {
        const assessmentDate = addDays(sessionDate, daysOffset);

        const phq9 = Math.max(0, Math.round(baselinePHQ9 + (config.improvement.phq9 * improvementFactor)));
        const gad7 = Math.max(0, Math.round(baselineGAD7 + (config.improvement.gad7 * improvementFactor)));
        const whoqol = Math.min(100, Math.round(baselineWHOQOL + (config.improvement.whoqol * improvementFactor)));

        assessments.push({
            id: `long_${sessionId}_${timepoint}`,
            patient_id: patientId,
            session_id: sessionId,

            phq9_score: phq9,
            gad7_score: gad7,
            whoqol_score: whoqol,

            assessment_date: formatDateTime(assessmentDate),
            timepoint,
            days_since_session: daysOffset,

            phq9_change_from_baseline: timepoint === 'baseline' ? undefined : phq9 - baselinePHQ9,
            gad7_change_from_baseline: timepoint === 'baseline' ? undefined : gad7 - baselineGAD7,
            whoqol_change_from_baseline: timepoint === 'baseline' ? undefined : whoqol - baselineWHOQOL,

            practitioner_id: 'prac_demo_001',
            created_at: formatDateTime(assessmentDate),
            updated_at: formatDateTime(assessmentDate)
        });
    });

    return assessments;
}

// ========== WO-064: Generate Daily Pulse Checks ==========

export function generatePulseChecks(
    patientId: string,
    sessionId: string,
    scenario: keyof typeof SCENARIOS = 'success'
): PulseCheck[] {
    const config = SCENARIOS[scenario];
    const sessionDate = new Date('2025-10-15T09:00:00Z');
    const pulseChecks: PulseCheck[] = [];

    // Generate 30 days of pulse checks with adherence rate
    for (let day = 1; day <= 30; day++) {
        // Skip some days based on adherence rate
        if (Math.random() > config.pulseCheckAdherence) continue;

        const checkDate = addDays(sessionDate, day);

        // Ratings improve over time (1-5 scale)
        const improvementFactor = Math.min(1, day / 30);
        const connection = Math.min(5, Math.round(2 + (3 * improvementFactor)));
        const sleep = Math.min(5, Math.round(2.5 + (2.5 * improvementFactor)));
        const mood = Math.min(5, Math.round(2 + (3 * improvementFactor)));
        const anxiety = Math.max(1, Math.round(4 - (3 * improvementFactor))); // Lower is better

        pulseChecks.push({
            id: `pulse_${sessionId}_day${day}`,
            patient_id: patientId,
            session_id: sessionId,

            connection_rating: connection,
            sleep_rating: sleep,
            mood_rating: mood,
            anxiety_rating: anxiety,

            check_date: formatDateTime(checkDate),
            days_since_session: day,

            created_at: formatDateTime(checkDate)
        });
    }

    return pulseChecks;
}

// ========== Generate Complete Patient Journey ==========

export function generatePatientJourney(
    patientId: string = 'PT-KXMR9W2P',
    sessionId: string = 'SESSION-001',
    scenario: keyof typeof SCENARIOS = 'success'
): PatientJourney {
    return {
        patient_id: patientId,
        session_id: sessionId,

        baseline: generateBaselineAssessment(patientId, sessionId, scenario),
        timeline: generateSessionTimeline(patientId, sessionId, scenario),
        vitals: generateSessionVitals(patientId, sessionId, scenario),
        longitudinal: generateLongitudinalAssessments(patientId, sessionId, scenario),
        pulseChecks: generatePulseChecks(patientId, sessionId, scenario),

        completedPhases: [1, 2, 3],
        currentPhase: 3
    };
}

// ========== Export Multiple Scenarios ==========

export const MOCK_JOURNEYS = {
    success: generatePatientJourney('PT-SUCCESS-001', 'SESSION-SUCCESS-001', 'success'),
    moderate: generatePatientJourney('PT-MODERATE-001', 'SESSION-MODERATE-001', 'moderate'),
    poor: generatePatientJourney('PT-POOR-001', 'SESSION-POOR-001', 'poor'),
    adverseEvent: generatePatientJourney('PT-ADVERSE-001', 'SESSION-ADVERSE-001', 'adverse-event')
};
