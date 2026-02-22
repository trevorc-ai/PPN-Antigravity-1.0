export interface PatientTimepoint {
    week: number;
    label: string;
    phq9: number | null;
    gad7: number | null;
    caps5: number | null;
    pcl5: number | null;
    recordedAt: string;
}

export interface PatientExperienceScore {
    sessionNumber: number;
    meq30: number | null;
    edi: number | null;
    ceq: number | null;
}

export interface PatientOutcomeData {
    patientId: string;
    substance: string;
    timepoints: PatientTimepoint[];
    experienceScores: PatientExperienceScore[];
    responseAchieved: boolean | null;
    remissionAchieved: boolean | null;
    primaryInstrument: 'PHQ-9' | 'CAPS-5' | 'GAD-7' | 'PCL-5';
}

export async function getPatientOutcomeData(
    patientId: string,
    sessionId: string
): Promise<PatientOutcomeData | null> {
    // Mock data for UI demonstrations. In production, fetch via supabase.
    return new Promise((resolve) => {
        setTimeout(() => resolve({
            patientId,
            substance: 'Psilocybin',
            primaryInstrument: 'PHQ-9',
            timepoints: [
                { week: 0, label: 'Baseline', phq9: 24, gad7: 18, caps5: null, pcl5: null, recordedAt: '2023-01-01' },
                { week: 3, label: 'Week 3', phq9: 14, gad7: 12, caps5: null, pcl5: null, recordedAt: '2023-01-22' },
                { week: 6, label: 'Week 6', phq9: 12, gad7: 10, caps5: null, pcl5: null, recordedAt: '2023-02-12' },
                { week: 12, label: 'Week 12', phq9: 11, gad7: 8, caps5: null, pcl5: null, recordedAt: '2023-03-26' },
            ],
            experienceScores: [
                { sessionNumber: 1, meq30: 78, edi: 85, ceq: 40 }
            ],
            responseAchieved: true,
            remissionAchieved: false
        }), 800);
    });
}
