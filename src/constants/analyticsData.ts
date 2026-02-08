
import { 
  TrajectoryPoint, 
  ClusterPoint, 
  InteractionRisk, 
  FlowEdge, 
  JourneyEvent 
} from '../types';

// --- MODULE 1: PREDICTIVE TRAJECTORY (CONFIDENCE CONE) ---
// METRIC: PHQ-9 Depression Severity (LOINC: 44261-6)
// CONTEXT: Longitudinal tracking over 6 weeks.
// STANDARDS: Adheres to CDISC SDTM (Study Data Tabulation Model) for subject domain.
export const MOCK_TRAJECTORY_DATA: TrajectoryPoint[] = [
  { day: 0, userScore: 24, benchmarkMean: 22.0, rangeLower: 19, rangeUpper: 25 }, // Baseline
  { day: 7, userScore: 18, benchmarkMean: 19.5, rangeLower: 16, rangeUpper: 23 }, // Post-Dose 1
  { day: 14, userScore: 12, benchmarkMean: 16.0, rangeLower: 13, rangeUpper: 20 }, // Integration
  { day: 21, userScore: 9, benchmarkMean: 14.5, rangeLower: 11, rangeUpper: 18 }, // Post-Dose 2
  { day: 28, userScore: 7, benchmarkMean: 12.0, rangeLower: 9, rangeUpper: 16 },  // Integration
  { day: 42, userScore: 5, benchmarkMean: 10.5, rangeLower: 7, rangeUpper: 14 }   // Endpoint (Remission)
];

// --- MODULE 2: COHORT CONSTELLATION (CLUSTER ANALYSIS) ---
// CONTEXT: Treatment Resistant Depression (TRD) - Comparative Efficacy.
// POINTS: N=50. X=Age, Y=Outcome Delta (Improvement).
// DATA SOURCE: Aggregated Node Registry 0x7.
export const MOCK_CLUSTER_DATA: ClusterPoint[] = [
  // Cluster A: Young Responders (High Neuroplasticity)
  { id: 'PT-101', x: 22, y: 22, isUser: false, protocol: 'Psilocybin [RxNorm: 1433]', outcome: 22 },
  { id: 'PT-102', x: 24, y: 19, isUser: false, protocol: 'MDMA [RxNorm: 6853]', outcome: 19 },
  { id: 'PT-103', x: 21, y: 25, isUser: false, protocol: 'Ketamine [RxNorm: 6130]', outcome: 25 },
  { id: 'PT-104', x: 28, y: 18, isUser: false, protocol: 'Psilocybin [RxNorm: 1433]', outcome: 18 },
  { id: 'PT-105', x: 25, y: 21, isUser: false, protocol: 'LSD-25', outcome: 21 },
  { id: 'PT-106', x: 29, y: 15, isUser: false, protocol: 'Ketamine [RxNorm: 6130]', outcome: 15 },
  { id: 'PT-107', x: 23, y: 24, isUser: false, protocol: 'Psilocybin [RxNorm: 1433]', outcome: 24 },
  { id: 'PT-108', x: 26, y: 20, isUser: false, protocol: 'MDMA [RxNorm: 6853]', outcome: 20 },
  { id: 'PT-109', x: 20, y: 23, isUser: false, protocol: 'Psilocybin [RxNorm: 1433]', outcome: 23 },
  { id: 'PT-110', x: 27, y: 17, isUser: false, protocol: 'Ketamine [RxNorm: 6130]', outcome: 17 },

  // Cluster B: Mid-Life (Variance High)
  { id: 'PT-201', x: 35, y: 12, isUser: false, protocol: 'Psilocybin [RxNorm: 1433]', outcome: 12 },
  { id: 'PT-202', x: 38, y: 14, isUser: false, protocol: 'Ketamine [RxNorm: 6130]', outcome: 14 },
  { id: 'PT-203', x: 33, y: 8, isUser: false, protocol: 'MDMA [RxNorm: 6853]', outcome: 8 },
  { id: 'PT-204', x: 36, y: 19, isUser: true, protocol: 'Psilocybin [RxNorm: 1433]', outcome: 19 }, // CURRENT USER
  { id: 'PT-205', x: 39, y: 5, isUser: false, protocol: 'LSD-25', outcome: 5 },
  { id: 'PT-206', x: 32, y: 16, isUser: false, protocol: 'Ketamine [RxNorm: 6130]', outcome: 16 },
  { id: 'PT-207', x: 37, y: 11, isUser: false, protocol: 'Psilocybin [RxNorm: 1433]', outcome: 11 },
  { id: 'PT-208', x: 34, y: 13, isUser: false, protocol: 'MDMA [RxNorm: 6853]', outcome: 13 },
  { id: 'PT-209', x: 31, y: 9, isUser: false, protocol: 'Ketamine [RxNorm: 6130]', outcome: 9 },
  { id: 'PT-210', x: 40, y: 15, isUser: false, protocol: 'Psilocybin [RxNorm: 1433]', outcome: 15 },

  // Cluster C: Older Adult (Refractory)
  { id: 'PT-301', x: 55, y: 6, isUser: false, protocol: 'Ketamine [RxNorm: 6130]', outcome: 6 },
  { id: 'PT-302', x: 62, y: 4, isUser: false, protocol: 'Psilocybin [RxNorm: 1433]', outcome: 4 },
  { id: 'PT-303', x: 58, y: 8, isUser: false, protocol: 'MDMA [RxNorm: 6853]', outcome: 8 },
  { id: 'PT-304', x: 65, y: 2, isUser: false, protocol: 'LSD-25', outcome: 2 },
  { id: 'PT-305', x: 52, y: 9, isUser: false, protocol: 'Ketamine [RxNorm: 6130]', outcome: 9 },
  { id: 'PT-306', x: 60, y: 5, isUser: false, protocol: 'Psilocybin [RxNorm: 1433]', outcome: 5 },
  { id: 'PT-307', x: 56, y: 7, isUser: false, protocol: 'Ketamine [RxNorm: 6130]', outcome: 7 },
  { id: 'PT-308', x: 68, y: 3, isUser: false, protocol: 'MDMA [RxNorm: 6853]', outcome: 3 },
  { id: 'PT-309', x: 54, y: 10, isUser: false, protocol: 'Psilocybin [RxNorm: 1433]', outcome: 10 },
  { id: 'PT-310', x: 63, y: 4, isUser: false, protocol: 'Ketamine [RxNorm: 6130]', outcome: 4 },

  // Scattered Outliers (High Responders)
  { id: 'PT-401', x: 45, y: 26, isUser: false, protocol: '5-MeO-DMT', outcome: 26 },
  { id: 'PT-402', x: 50, y: 22, isUser: false, protocol: 'Ibogaine', outcome: 22 },
  { id: 'PT-403', x: 42, y: 24, isUser: false, protocol: 'Psilocybin [RxNorm: 1433]', outcome: 24 },
  { id: 'PT-404', x: 48, y: 20, isUser: false, protocol: 'Ketamine [RxNorm: 6130]', outcome: 20 },
  { id: 'PT-405', x: 46, y: 23, isUser: false, protocol: 'MDMA [RxNorm: 6853]', outcome: 23 },
  
  // Additional Density
  { id: 'PT-501', x: 25, y: 16, isUser: false, protocol: 'Ketamine [RxNorm: 6130]', outcome: 16 },
  { id: 'PT-502', x: 30, y: 14, isUser: false, protocol: 'Psilocybin [RxNorm: 1433]', outcome: 14 },
  { id: 'PT-503', x: 35, y: 18, isUser: false, protocol: 'MDMA [RxNorm: 6853]', outcome: 18 },
  { id: 'PT-504', x: 40, y: 12, isUser: false, protocol: 'Ketamine [RxNorm: 6130]', outcome: 12 },
  { id: 'PT-505', x: 45, y: 10, isUser: false, protocol: 'Psilocybin [RxNorm: 1433]', outcome: 10 },
  { id: 'PT-506', x: 50, y: 8, isUser: false, protocol: 'LSD-25', outcome: 8 },
  { id: 'PT-507', x: 55, y: 11, isUser: false, protocol: 'MDMA [RxNorm: 6853]', outcome: 11 },
  { id: 'PT-508', x: 60, y: 6, isUser: false, protocol: 'Ketamine [RxNorm: 6130]', outcome: 6 },
  { id: 'PT-509', x: 65, y: 5, isUser: false, protocol: 'Psilocybin [RxNorm: 1433]', outcome: 5 },
  { id: 'PT-510', x: 70, y: 3, isUser: false, protocol: 'Ketamine [RxNorm: 6130]', outcome: 3 },
  { id: 'PT-511', x: 22, y: 20, isUser: false, protocol: 'MDMA [RxNorm: 6853]', outcome: 20 },
  { id: 'PT-512', x: 28, y: 22, isUser: false, protocol: 'Psilocybin [RxNorm: 1433]', outcome: 22 },
  { id: 'PT-513', x: 32, y: 15, isUser: false, protocol: 'Ketamine [RxNorm: 6130]', outcome: 15 },
  { id: 'PT-514', x: 38, y: 13, isUser: false, protocol: 'LSD-25', outcome: 13 },
  { id: 'PT-515', x: 42, y: 17, isUser: false, protocol: 'Psilocybin [RxNorm: 1433]', outcome: 17 }
];

// --- MODULE 3: PHARMACOVIGILANCE (RISK MATRIX) ---
// STANDARDS: RxNorm for agents, MedDRA for adverse event codes.
export const MOCK_RISK_DATA: InteractionRisk[] = [
  { 
    pairId: 'R-7721', 
    substanceA: 'Psilocybin [RxNorm: 1433]', 
    substanceB: 'Lithium [RxNorm: 6387]', 
    riskLevel: 5, 
    category: 'Proconvulsant', 
    description: 'Life-Threatening. Synergistic lowering of seizure threshold. MedDRA: Seizure [10039906]. Absolute Contraindication.' 
  },
  { 
    pairId: 'R-8842', 
    substanceA: 'MDMA [RxNorm: 6853]', 
    substanceB: 'SSRI [Class: N06AB]', 
    riskLevel: 3, 
    category: 'Pharmacodynamic Competition', 
    description: 'Diminished efficacy due to SERT occupancy competition. Potential risk of Serotonin Syndrome if dose escalated.' 
  },
  {
    pairId: 'R-9910',
    substanceA: 'Ketamine [RxNorm: 6130]',
    substanceB: 'Benzodiazepines [Class: N05BA]',
    riskLevel: 4,
    category: 'Efficacy Dampening',
    description: 'Reduced antidepressant response. Increased sedation and respiratory depression risk (MedDRA: 10038695).'
  }
];

// --- MODULE 4: SANKEY FLOW (PATIENT RETENTION) ---
// CONTEXT: Clinical Funnel Volumetrics.
// NOTE: "Gap" signifies attrition/drop-off rate between stages.
export const MOCK_FLOW_DATA: FlowEdge[] = [
  { source: 'Intake Screening', target: 'Prep Session', value: 100 },
  { source: 'Prep Session', target: 'Dosing 1 (Induction)', value: 95, dropOffRate: 0.05 },
  { source: 'Dosing 1 (Induction)', target: 'Integration 1', value: 66, dropOffRate: 0.30 }, // 30% drop-off per specs
  { source: 'Integration 1', target: 'Dosing 2 (Deepening)', value: 60, dropOffRate: 0.09 },
  { source: 'Dosing 2 (Deepening)', target: 'Integration 2', value: 58, dropOffRate: 0.03 },
  { source: 'Integration 2', target: 'Completion (Exit)', value: 55, dropOffRate: 0.05 }
];

// --- MODULE 5: JOURNEY SNAPSHOT (TIMELINE) ---
// STANDARDS: CPT Codes for procedures, LOINC for assessments, SNOMED for routes.
export const MOCK_JOURNEY_DATA: JourneyEvent[] = [
  { 
    date: '2024-02-01', 
    type: 'dose', 
    label: 'Dosing Session 1', 
    value: '25mg', 
    details: 'Psilocybin via Oral Administration [SNOMED: 26643006]. Protocol ID: P-101.',
    status: 'completed'
  },
  { 
    date: '2024-02-02', 
    type: 'integration', 
    label: 'Integration Session', 
    value: '60 min', 
    details: 'Psychotherapy for crisis intervention [CPT: 90837]. Focus on somatic processing.',
    status: 'completed'
  },
  { 
    date: '2024-02-07', 
    type: 'assessment', 
    label: 'PHQ-9 Assessment', 
    value: 'Score: 12', 
    details: 'Patient Health Questionnaire-9 [LOINC: 44261-6]. Moderate Depression.',
    status: 'completed'
  },
  {
    date: '2024-02-14',
    type: 'safety',
    label: 'Safety Check (Remote)',
    details: 'Adverse Event Check [MedDRA: 10000000]. No events reported.',
    status: 'completed'
  },
  {
    date: '2024-02-21',
    type: 'dose',
    label: 'Dosing Session 2',
    value: '30mg',
    details: 'Dosage Escalation. Protocol Verified.',
    status: 'scheduled'
  }
];
