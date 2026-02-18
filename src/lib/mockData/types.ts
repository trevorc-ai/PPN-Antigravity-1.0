/**
 * Mock Data Types for Integration Batch Testing
 * 
 * These types mirror the expected database schema for the Arc of Care tables.
 * Once the real database is deployed, we can swap mock data for real queries.
 */

// ========== WO-060: Baseline Assessments ==========
export interface BaselineAssessment {
    id: string;
    patient_id: string;
    session_id: string;
    assessment_date: string;

    // Mental Health Scores
    phq9_score: number;        // 0-27 (depression)
    gad7_score: number;        // 0-21 (anxiety)
    ace_score: number;         // 0-10 (adverse childhood experiences)
    pcl5_score: number;        // 0-80 (PTSD)
    expectancy_scale: number;  // 1-100 (treatment expectancy)

    // Metadata
    practitioner_id: string;
    practitioner_npi?: string;
    created_at: string;
    updated_at: string;
}

// ========== WO-061: Session Timeline ==========
export interface SessionTimeline {
    id: string;
    session_id: string;
    patient_id: string;

    // Timeline Events
    dose_time: string;
    onset_time?: string;
    peak_time?: string;
    resolution_time?: string;

    // Session Details
    substance_type: string;
    dosage_mg: number;
    route_of_administration: string;

    // Expected vs Actual
    expected_duration_hours: number;
    actual_duration_hours?: number;

    // Metadata
    practitioner_id: string;
    created_at: string;
    updated_at: string;
}

// ========== WO-062: Session Vitals ==========
export interface VitalSignReading {
    id: string;
    session_id: string;
    patient_id: string;

    // Vital Signs
    heart_rate: number;           // bpm
    hrv?: number;                 // ms (heart rate variability)
    bp_systolic: number;          // mmHg
    bp_diastolic: number;         // mmHg
    spo2: number;                 // % (oxygen saturation)

    // Context
    recorded_at: string;
    session_phase: 'baseline' | 'onset' | 'peak' | 'resolution';
    data_source: 'manual' | 'device' | 'wearable';
    device_id?: string;

    // Metadata
    practitioner_id: string;
    created_at: string;
}

// ========== WO-063: Longitudinal Assessments ==========
export interface LongitudinalAssessment {
    id: string;
    patient_id: string;
    session_id: string;

    // Outcome Scores
    phq9_score: number;        // 0-27
    gad7_score: number;        // 0-21
    whoqol_score: number;      // 0-100 (quality of life)

    // Timepoint
    assessment_date: string;
    timepoint: 'baseline' | 'post-session' | '1-week' | '1-month' | '3-month' | '6-month';
    days_since_session: number;

    // Change Metrics
    phq9_change_from_baseline?: number;
    gad7_change_from_baseline?: number;
    whoqol_change_from_baseline?: number;

    // Metadata
    practitioner_id: string;
    created_at: string;
    updated_at: string;
}

// ========== WO-064: Daily Pulse Checks ==========
export interface PulseCheck {
    id: string;
    patient_id: string;
    session_id: string;

    // Wellness Ratings (1-5 scale)
    connection_rating: number;  // 1-5
    sleep_rating: number;       // 1-5
    mood_rating: number;        // 1-5
    anxiety_rating: number;     // 1-5

    // Date
    check_date: string;
    days_since_session: number;

    // Metadata
    created_at: string;
}

// ========== Aggregate Types ==========
export interface PatientJourney {
    patient_id: string;
    session_id: string;

    baseline: BaselineAssessment;
    timeline: SessionTimeline;
    vitals: VitalSignReading[];
    longitudinal: LongitudinalAssessment[];
    pulseChecks: PulseCheck[];

    // Computed Fields
    completedPhases: number[];
    currentPhase: 1 | 2 | 3;
}

// ========== Mock Data Configuration ==========
export interface MockDataConfig {
    useMockData: boolean;
    patientId?: string;
    sessionId?: string;
    scenario?: 'success' | 'moderate' | 'poor' | 'adverse-event';
}
