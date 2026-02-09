
import { ResearchPhase, Substance, PatientRecord, AuditLog, Clinician, NewsArticle, FAQItem, InteractionRule } from './types';

export const NEWS_ARTICLES: NewsArticle[] = [
  {
    id: 'NEWS-001',
    title: 'FDA Grants Breakthrough Therapy Designation for LSD-Assisted Anxiety Treatment',
    summary: 'Clinical results from Phase IIb trials demonstrate rapid and sustained reduction in anxiety symptoms following a single high-dose administration.',
    category: 'Regulation',
    source: 'FDA.gov',
    timestamp: '2h ago',
    impactScore: 94,
    readTime: '4 min',
    imageUrl: 'https://images.unsplash.com/photo-1532187863486-abf9bdad1b4c?auto=format&fit=crop&q=80&w=800',
    verified: true,
    sentiment: 'positive'
  },
  {
    id: 'NEWS-002',
    title: 'Zurich Node Reports 85% Efficacy in Phase 3 TRD Trials',
    summary: 'Institutional data from the Swiss research hub indicates significant efficacy lift in treatment-resistant depression cohorts.',
    category: 'Clinical Trials',
    source: 'Zurich Clinical Hub',
    timestamp: '5h ago',
    impactScore: 82,
    readTime: '7 min',
    imageUrl: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=800',
    verified: true,
    sentiment: 'positive',
    isPartner: true
  },
  {
    id: 'NEWS-003',
    title: 'New Protocol Guidelines: MDMA-Assisted Therapy v2.4',
    summary: 'Global research council releases updated dosing and integration frameworks for Phase III MDMA applications.',
    category: 'Clinical Trials',
    source: 'MAPS Public Benefit Corp',
    timestamp: '1d ago',
    impactScore: 98,
    readTime: '5 min',
    imageUrl: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=800',
    verified: true,
    sentiment: 'positive'
  },
  {
    id: 'NEWS-004',
    title: 'Global Patent Landscape Shifts as Synthetic DMT Production Scales',
    summary: 'Several biotech firms announce breakthroughs in cost-effective synthesis, potentially lowering the barrier for entry in therapeutic settings.',
    category: 'Industry',
    source: 'PharmaWire',
    timestamp: '2d ago',
    impactScore: 65,
    readTime: '3 min',
    imageUrl: 'https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&q=80&w=800',
    verified: true,
    sentiment: 'positive'
  }
];

export const SUBSTANCES: Substance[] = [
  {
    id: 'KET-9921',
    name: 'Ketamine',
    chemicalName: '2-(2-Chlorophenyl)-2-(methylamino)cyclohexan-1-one',
    class: 'ARYLCYCLOHEXYLAMINE',
    phase: ResearchPhase.Approved,
    schedule: 'Schedule III',
    cas: '6740-88-1',
    molecularWeight: '237.7 g/mol',
    formula: 'C13H16ClNO',
    efficacy: 0.85,
    historicalEfficacy: [0.65, 0.72, 0.81, 0.85],
    imageUrl: 'molecules/Ketamine.webp',
    rxnorm_cui: 6130
  },
  {
    id: 'MDM-4410',
    name: 'MDMA',
    chemicalName: '3,4-Methylenedioxymethamphetamine',
    class: 'PHENETHYLAMINE',
    phase: ResearchPhase.Phase3,
    schedule: 'Schedule I',
    cas: '42542-10-9',
    molecularWeight: '193.25 g/mol',
    formula: 'C11H15NO2',
    efficacy: 0.92,
    historicalEfficacy: [0.70, 0.82, 0.88, 0.92],
    imageUrl: 'molecules/MDMA.webp',
    rxnorm_cui: 6853
  },
  {
    id: 'PSL-2201',
    name: 'Psilocybin',
    chemicalName: '[3-(2-Dimethylaminoethyl)-1H-indol-4-yl] dihydrogen phosphate',
    class: 'TRYPTAMINE',
    phase: ResearchPhase.Phase2,
    schedule: 'Schedule I',
    cas: '520-52-5',
    molecularWeight: '284.25 g/mol',
    formula: 'C12H17N2O4P',
    efficacy: 0.78,
    historicalEfficacy: [0.60, 0.68, 0.78],
    imageUrl: 'molecules/Psilocybin.webp',
    rxnorm_cui: 1433
  },
  {
    id: 'LSD-2500',
    name: 'LSD-25',
    chemicalName: '(6aR,9R)-N,N-diethyl-7-methyl-4,6,6a,7,8,9-hexahydroindolo[4,3-fg]quinoline-9-carboxamide',
    class: 'LYSERGAMIDE',
    phase: ResearchPhase.Phase2,
    schedule: 'Schedule I',
    cas: '50-37-3',
    molecularWeight: '323.43 g/mol',
    formula: 'C20H25N3O',
    efficacy: 0.82,
    historicalEfficacy: [0.55, 0.74, 0.82],
    imageUrl: 'molecules/LSD-25.webp',
    rxnorm_cui: 4439
  },
  {
    id: 'DMT-1102',
    name: '5-MeO-DMT',
    chemicalName: '5-methoxy-N,N-dimethyltryptamine',
    class: 'TRYPTAMINE',
    phase: ResearchPhase.Phase1,
    schedule: 'Schedule I',
    cas: '61-50-7',
    molecularWeight: '188.27 g/mol',
    formula: 'C12H16N2',
    efficacy: 0.91,
    historicalEfficacy: [0.88, 0.91],
    imageUrl: 'molecules/5-MeO-DMT.webp'
  },
  {
    id: 'IBO-5501',
    name: 'Ibogaine',
    chemicalName: '12-Methoxyibogamine',
    class: 'APOCYNACEEL ALKALOID',
    phase: ResearchPhase.Phase1,
    schedule: 'Schedule I',
    cas: '83-74-9',
    molecularWeight: '310.43 g/mol',
    formula: 'C20H26N2O',
    efficacy: 0.74,
    historicalEfficacy: [0.65, 0.74],
    imageUrl: 'molecules/Ibogaine.webp',
    rxnorm_cui: 1243
  },
  {
    id: 'MES-3301',
    name: 'Mescaline',
    chemicalName: '3,4,5-Trimethoxyphenethylamine',
    class: 'PHENETHYLAMINE',
    phase: ResearchPhase.Phase1,
    schedule: 'Schedule I',
    cas: '54-04-6',
    molecularWeight: '211.26 g/mol',
    formula: 'C11H17NO3',
    efficacy: 0.65,
    historicalEfficacy: [0.55, 0.60, 0.65],
    imageUrl: 'molecules/Mescaline.webp',
    rxnorm_cui: 6952
  }
];

export const SAFETY_EVENT_CODES: Record<string, number> = {
  "Nausea": 10028813,
  "Headache": 10019211,
  "Dizziness": 10013573,
  "Anxiety": 10002855,
  "Hypertension": 10020772,
  "Dissociation": 10013372,
  "Panic Attack": 10033664,
  "Confusional State": 10010305,
  "Visual Hallucination": 10047580,
  "Paranoia": 10033864,
  "Tachycardia": 10043071,
  "Insomnia": 10022437,
  "Other - Non-PHI Clinical Observation": 10069999
};

export const CLINICIANS: Clinician[] = [
  {
    id: 'MD-101',
    name: 'Dr. Sarah Chen',
    role: 'Lead Psychiatrist',
    specialization: 'Treatment-Resistant Depression',
    match: '98%',
    imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71f1536780?auto=format&fit=crop&q=80&w=200',
    institution: 'Zurich Clinical Hub',
    education: 'MD, PhD Neuroscience',
    location: 'Zurich Node',
    experience: '12 Years',
    status: 'Available',
    tags: ['Psilocybin', 'Clinical Research', 'FDA Liaison']
  },
  {
    id: 'MD-102',
    name: 'Dr. Marcus Thorne',
    role: 'Neuro-Pharmacologist',
    specialization: 'Molecular Synthesis',
    match: '94%',
    imageUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=200',
    institution: 'Harvard Medical School',
    education: 'PharmD, Stanford',
    location: 'Boston Node',
    experience: '15 Years',
    status: 'In Session',
    tags: ['Ketamine', 'Drug Design', 'Safety Oversight']
  },
  {
    id: 'RN-204',
    name: 'Elena Rodriguez',
    role: 'Lead Facilitator',
    specialization: 'Integration Therapy',
    match: '91%',
    imageUrl: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=200',
    institution: 'The Sanctuary Node',
    education: 'MSN, RN',
    location: 'Mexico City Node',
    experience: '8 Years',
    status: 'Available',
    tags: ['Breathwork', 'Harm Reduction', 'Peer Support']
  },
  {
    id: 'MD-105',
    name: 'Dr. James Wilson',
    role: 'Clinical Supervisor',
    specialization: 'Regulatory Compliance',
    match: '89%',
    imageUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=200',
    institution: 'King\'s College London',
    education: 'MD, Yale',
    location: 'London Node',
    experience: '20 Years',
    status: 'Offline',
    tags: ['Ethics', 'Protocol Design']
  },
  {
    id: 'RES-301',
    name: 'Dr. Aris Thorne',
    role: 'Protocol Architect',
    specialization: 'Pharmacokinetics',
    match: '92%',
    imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71f1536780?auto=format&fit=crop&q=80&w=200',
    institution: 'Edge Research Node',
    education: 'PhD Pharmacology',
    location: 'Remote (US)',
    experience: '10 Years',
    status: 'Available',
    tags: ['Microdosing', 'LSD-25', 'Registry Architecture']
  }
];

export const FAQ_DATA: FAQItem[] = [
  { id: 'FAQ-001', question: 'How do I reset my secure PPN credentials?', answer: 'Contact your node administrator or use the 2FA reset flow in Settings.', category: 'Security' },
  { id: 'FAQ-002', question: 'Exporting patient data for external analysis', answer: 'Patient data exports are strictly controlled. Use the "Registry Upload" tab for de-identified bulk tasks.', category: 'Clinical' }
];

// --- MEDICATIONS LIST (Protocol Builder & Safety Checks) ---
export const MEDICATIONS_LIST = [
  // Antidepressants (SSRIs/SNRIs)
  "Fluoxetine (Prozac)", "Sertraline (Zoloft)", "Citalopram (Celexa)", "Escitalopram (Lexapro)", "Paroxetine (Paxil)", "Venlafaxine (Effexor)", "Duloxetine (Cymbalta)",
  // MAOIs
  "Phenelzine (Nardil)", "Tranylcypromine (Parnate)", "Selegiline (Emsam)",
  // Mood Stabilizers
  "Lithium", "Valproate (Depakote)", "Lamotrigine (Lamictal)", "Carbamazepine (Tegretol)",
  // Benzodiazepines
  "Alprazolam (Xanax)", "Clonazepam (Klonopin)", "Diazepam (Valium)", "Lorazepam (Ativan)",
  // Antipsychotics
  "Quetiapine (Seroquel)", "Olanzapine (Zyprexa)", "Risperidone (Risperdal)", "Aripiprazole (Abilify)",
  // Stimulants
  "Amphetamine/Dextroamphetamine (Adderall)", "Methylphenidate (Ritalin)", "Lisdexamfetamine (Vyvanse)", "Modafinil (Provigil)",
  // Somatic
  "Propranolol", "Atenolol", "Atorvastatin", "Simvastatin", "Levothyroxine", "Metformin", "Omeprazole", "Lisinopril",
  // Other Psych
  "Bupropion (Wellbutrin)", "Trazodone", "Buspirone", "Gabapentin", "Pregabalin (Lyrica)"
];

// --- SAFETY MATRIX DATA (ENHANCED KNOWLEDGE GRAPH) ---
export const INTERACTION_RULES: InteractionRule[] = [
  {
    id: 'RULE-001',
    substance: 'Psilocybin',
    interactor: 'Lithium',
    riskLevel: 10,
    severity: 'Life-Threatening',
    description: 'High risk of seizures, fugue state, and Hallucinogen Persisting Perception Disorder (HPPD). Even therapeutic doses of Lithium can lower the seizure threshold significantly when combined with tryptamines.',
    mechanism: 'Synergistic 5-HT2A potentiation & sodium channel modulation.',
    source: "National Library of Medicine / PubMed (2024)",
    sourceUrl: "https://pubmed.ncbi.nlm.nih.gov/"
  },
  {
    id: 'RULE-002',
    substance: 'MDMA',
    interactor: 'SSRIs',
    riskLevel: 9,
    severity: 'High',
    description: 'Blocks SERT transporter. Prevents MDMA uptake, neutralizing therapeutic effect (Subjective "0/10"). Higher doses to compensate may trigger Serotonin Syndrome.',
    mechanism: 'Competitive Inhibition at SERT Transporter.',
    source: "MAPS Public Benefit Corp",
    sourceUrl: "https://maps.org"
  },
  {
    id: 'RULE-003',
    substance: 'MDMA',
    interactor: 'MAOIs',
    riskLevel: 10,
    severity: 'Life-Threatening',
    description: 'Risk of fatal Serotonin Syndrome (Hyperthermia, Hypertensive Crisis). Absolute Contraindication.',
    mechanism: 'Inhibition of monoamine oxidase prevents serotonin metabolism, causing toxic accumulation.',
    source: "National Library of Medicine / PubMed",
    sourceUrl: "https://pubmed.ncbi.nlm.nih.gov/"
  },
  {
    id: 'RULE-004',
    substance: 'Ketamine',
    interactor: 'Benzodiazepines',
    riskLevel: 6,
    severity: 'Moderate',
    description: 'Reduces the antidepressant efficacy of Ketamine. Increases sedation and amnesia risk.',
    mechanism: 'GABA-A allosteric modulation opposes glutamatergic surge.',
    source: "Yale School of Medicine",
    sourceUrl: "https://medicine.yale.edu/"
  },
  {
    id: 'RULE-005',
    substance: 'Ketamine',
    interactor: 'Alcohol',
    riskLevel: 8,
    severity: 'High',
    description: 'Severe respiratory depression, profound motor impairment, nausea, and aspiration risk.',
    mechanism: 'Synergistic CNS Depression.',
    source: "National Institutes of Health (NIH)",
    sourceUrl: "https://www.nih.gov/"
  },
  {
    id: 'RULE-006',
    substance: 'Psilocybin',
    interactor: 'SSRIs',
    riskLevel: 5,
    severity: 'Moderate',
    description: 'Blunted subjective effects. May require higher dosage (20-30% increase) to achieve therapeutic breakthrough.',
    mechanism: '5-HT2A receptor downregulation.',
    source: "Imperial College London",
    sourceUrl: "https://www.imperial.ac.uk/"
  },
  {
    id: 'RULE-007',
    substance: 'LSD-25',
    interactor: 'Lithium',
    riskLevel: 10,
    severity: 'Life-Threatening',
    description: 'Extreme neurotoxicity, seizures, and comatose state reported. Absolute Contraindication.',
    mechanism: 'Unknown; hypothesized signal transduction amplification.',
    source: "Erowid / Clinical Case Reports",
    sourceUrl: "https://erowid.org"
  },
  {
    id: 'RULE-008',
    substance: 'Ayahuasca',
    interactor: 'SSRIs',
    riskLevel: 10,
    severity: 'Life-Threatening',
    description: 'Serotonin Syndrome risk due to MAOI content (Harmala alkaloids) in Ayahuasca.',
    mechanism: 'MAO-A Inhibition + Reuptake Blockade.',
    source: "ICEERS Safety Guide",
    sourceUrl: "https://www.iceers.org/"
  },
  {
    id: 'RULE-009',
    substance: 'Ibogaine',
    interactor: 'QT-Prolonging Agents',
    riskLevel: 10,
    severity: 'Life-Threatening',
    description: 'High risk of Torsades de Pointes (Fatal Arrhythmia). Requires ECG monitoring.',
    mechanism: 'hERG Potassium Channel Blockade.',
    source: "Multidisciplinary Association for Psychedelic Studies",
    sourceUrl: "https://maps.org"
  },
  {
    id: 'RULE-010',
    substance: 'MDMA',
    interactor: 'Stimulants',
    riskLevel: 8,
    severity: 'High',
    description: 'Excessive cardiovascular strain (Tachycardia, Hypertension). Neurotoxicity risk increases with body temp.',
    mechanism: 'Additive adrenergic stimulation.',
    source: "NIDA",
    sourceUrl: "https://nida.nih.gov/"
  }
];

// --- PATIENT DATABASE (MOCK) ---
export const PATIENTS: PatientRecord[] = [
  {
    id: 'EX-001',
    siteId: 'NODE-01',
    status: 'Active',
    demographics: {
      age: 45,
      sex: 'Male',
      race: '2106-3',
      weight: 82,
      patientHash: '8f9a2b3c4d5e6f7a'
    },
    protocol: { substance: 'Psilocybin', dosage: '25', dosageUnit: 'mg', frequency: 'Single Session', route: 'Oral', startDate: '2024-01-15' },
    context: {
      setting: 'Clinical (Medical)',
      supportRatio: '2:1',
      musicPresence: true,
      prepHours: 6,
      integrationHours: 8,
      modalities: ['CBT', 'Psychodynamic'],
      // CRITICAL: Lithium added to trigger safety flag in demo
      concomitantMeds: ['Lithium', 'Lisinopril']
    },
    experience: {
      difficultyScore: 3,
      resolutionStatus: 'Resolved'
    },
    safetyEvents: [],
    outcomes: [
      { date: '2024-01-15', score: 25, type: 'PHQ-9', interpretation: 'Baseline: Severe' },
      { date: '2024-02-15', score: 12, type: 'PHQ-9', interpretation: 'Midpoint: Moderate' }
    ],
    consent: { verified: true, timestamp: '2024-01-01', type: 'Research-Sharing' },
    lastUpdated: '2024-02-15'
  },
  {
    id: 'EX-002',
    siteId: 'NODE-04',
    status: 'Completed',
    demographics: {
      age: 32,
      sex: 'Female',
      race: '2106-3',
      weight: 65,
      patientHash: 'e3b0c44298fc1c14'
    },
    protocol: { substance: 'MDMA', dosage: '120', dosageUnit: 'mg', frequency: 'Single Session', route: 'Oral', startDate: '2023-10-10' },
    context: {
      setting: 'Home (Supervised)',
      supportRatio: '1:1',
      musicPresence: true,
      prepHours: 2,
      integrationHours: 12,
      modalities: ['Somatic', 'IFS'],
      concomitantMeds: []
    },
    experience: {
      difficultyScore: 8,
      resolutionStatus: 'Resolved in Session'
    },
    safetyEvents: [
      {
        id: 'AE-1',
        date: '2023-10-10',
        type: 'Nausea',
        severity: 2,
        causality: 'Related',
        description: 'Patient reported severe nausea during onset.',
        meddraCode: 10028813
      }
    ],
    outcomes: [
      { date: '2023-10-10', score: 18, type: 'PHQ-9', interpretation: 'Baseline: Moderate' },
      { date: '2023-11-10', score: 6, type: 'PHQ-9', interpretation: 'Endpoint: Remission' }
    ],
    consent: { verified: true, timestamp: '2023-10-01', type: 'Research-Sharing' },
    lastUpdated: '2023-11-15'
  },
  {
    id: 'EX-003',
    siteId: 'NODE-07',
    status: 'Active',
    demographics: {
      age: 55,
      sex: 'Male',
      race: '2054-5',
      weight: 91,
      patientHash: '7d793037a0b1c2d3'
    },
    protocol: { substance: 'Ketamine', dosage: '0.5', dosageUnit: 'mg/kg', frequency: 'Twice Weekly', route: 'Intravenous', startDate: '2023-05-20' },
    context: {
      setting: 'Clinical (Soft)',
      supportRatio: '1:1',
      musicPresence: true,
      prepHours: 0,
      integrationHours: 1,
      modalities: ['None/Sitter'],
      concomitantMeds: ['Sertraline (Zoloft)']
    },
    experience: {
      difficultyScore: 1,
      resolutionStatus: 'Resolved'
    },
    safetyEvents: [],
    outcomes: [
      { date: '2023-05-20', score: 32, type: 'MADRS', interpretation: 'Baseline: Severe' },
      { date: '2023-07-20', score: 18, type: 'MADRS', interpretation: 'Current: Responder' }
    ],
    consent: { verified: true, timestamp: '2023-05-01', type: 'Research-Sharing' },
    lastUpdated: '2023-07-20'
  },
  {
    id: 'EX-004',
    siteId: 'NODE-02',
    status: 'Observation',
    demographics: {
      age: 28,
      sex: 'Female',
      race: '2106-3',
      weight: 58,
      patientHash: '4d5e6f7g8h9i0j1k'
    },
    protocol: { substance: 'LSD-25', dosage: '100', dosageUnit: 'ug', frequency: 'Weekly Titration', route: 'Oral', startDate: '2023-11-01' },
    context: {
      setting: 'Retreat Center',
      supportRatio: '1:2',
      musicPresence: false,
      prepHours: 10,
      integrationHours: 12,
      modalities: ['Psychodynamic'],
      concomitantMeds: []
    },
    experience: {
      difficultyScore: 6,
      resolutionStatus: 'Unresolved/Lingering'
    },
    safetyEvents: [],
    outcomes: [
      { date: '2023-11-01', score: 15, type: 'GAD-7', interpretation: 'Baseline: Moderate' }
    ],
    consent: { verified: false, timestamp: '2023-11-01', type: 'Clinical-Only' },
    lastUpdated: '2023-11-01'
  }
];

export const SAMPLE_INTERVENTION_RECORDS = PATIENTS;

// --- AUDIT LOG DATA ---
export const AUDIT_LOGS: AuditLog[] = [
  {
    id: 'LOG-8821',
    timestamp: '2026-01-28 14:45:22',
    actor: 'Dr. Sarah Jenkins',
    action: 'SAFETY_CHECK',
    details: 'Interaction Analysis: Psilocybin + Lithium',
    status: 'ALERT_TRIGGERED',
    hash: '0x9928...11a'
  },
  {
    id: 'LOG-8820',
    timestamp: '2026-01-28 14:44:10',
    actor: 'Dr. Sarah Jenkins',
    action: 'PROTOCOL_VIEW',
    details: 'Accessed Dossier: EX-002 (Psilocybin Safety Case)',
    status: 'AUTHORIZED',
    hash: '0x7731...b2c'
  },
  {
    id: 'LOG-8819',
    timestamp: '2026-01-28 14:43:55',
    actor: 'Dr. Sarah Jenkins',
    action: 'SEARCH_QUERY',
    details: 'Query Term: "Nausea"',
    status: 'EXECUTED',
    hash: '0x4421...99d'
  },
  {
    id: 'LOG-8818',
    timestamp: '2026-01-28 10:15:00',
    actor: 'System',
    action: 'LEDGER_SYNC',
    details: 'Daily Node Synchronization (5 New Records)',
    status: 'VERIFIED',
    hash: '0x1102...33f'
  }
];
