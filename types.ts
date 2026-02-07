export interface InteractionRisk {
  pairId: string;
  substanceA: string;
  substanceB: string;
  riskLevel: 1 | 2 | 3 | 4 | 5;
  category: string;
  description: string;
}

// --- PATIENT FLOW & JOURNEY INTERFACES ---
export interface FlowEdge { source: string; target: string; value: number; dropOffRate?: number; } // Visualization helper for the "Gap"

export interface JourneyEvent { date: string; type: 'dose' | 'integration' | 'assessment' | 'safety'; label: string; value?: string | number; details?: string; status?: 'completed' | 'missed' | 'scheduled'; }

// --- CORE CLINICAL TYPES ---

export enum ResearchPhase {
  Approved = 'Approved',
  Phase3 = 'Phase 3',
  Phase2 = 'Phase 2',
  Phase1 = 'Phase 1',
  PreClinical = 'Pre-Clinical'
}

export interface Substance {
  id: string;
  name: string;
  chemicalName: string;
  class: string;
  phase: ResearchPhase | string;
  schedule: string;
  cas: string;
  molecularWeight: string;
  formula: string;
  efficacy: number;
  historicalEfficacy?: number[];
  imageUrl: string;
  rxnorm_cui?: number;
}

export interface SafetyEvent {
  id: string;
  date: string;
  type: string;
  severity: 1 | 2 | 3 | 4 | 5;
  causality: string;
  description: string;
  meddraCode?: number;
}

export interface Outcome {
  date: string;
  score: number;
  type: string;
  interpretation: string;
}

export interface PatientRecord {
  id: string;
  siteId: string;
  status: 'Active' | 'Completed' | 'Observation' | 'Withdrawn' | string;
  demographics: {
    age: number;
    sex: string;
    race: string;
    weight: number;
    patientHash?: string;
    smokingStatus?: string;
  };
  protocol: {
    substance: string;
    dosage: string;
    dosageUnit: string;
    frequency: string;
    route: string;
    startDate: string;
  };
  context?: {
    setting: string;
    supportRatio: string;
    musicPresence: boolean;
    prepHours: number;
    integrationHours: number;
    modalities: string[];
    concomitantMeds: string[];
  };
  experience?: {
    difficultyScore: number;
    resolutionStatus: string;
  };
  safetyEvents: SafetyEvent[];
  outcomes: Outcome[];
  consent: {
    verified: boolean;
    timestamp: string;
    type: string;
  };
  lastUpdated: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  details: string;
  status: string;
  hash: string;
}

export interface Clinician {
  id: string;
  name: string;
  role: string;
  specialization: string;
  match: string;
  imageUrl: string;
  institution: string;
  education: string;
  location: string;
  experience: string;
  status: string;
  tags: string[];
  verificationLevel?: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  category: string;
  source: string;
  timestamp: string;
  impactScore: number;
  readTime: string;
  imageUrl: string;
  verified: boolean;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface InteractionRule {
  id: string;
  substance: string;
  interactor: string;
  riskLevel: number;
  severity: string;
  description: string;
  mechanism: string;
  source: string;
  sourceUrl: string;
}

// --- ANALYTICS TYPES ---

export interface TrajectoryPoint {
  day: number;
  userScore: number;
  benchmarkMean: number;
  rangeLower: number;
  rangeUpper: number;
}

export interface ClusterPoint {
  id: string;
  x: number;
  y: number;
  isUser: boolean;
  protocol: string;
  outcome: number;
}
