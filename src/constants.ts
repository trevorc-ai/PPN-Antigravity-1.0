
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
    imageUrl: '/molecules/ketamine.png',
    rxnorm_cui: 6130,
    color: '#3b82f6',
    pubchemCid: 3821,
    smiles: 'CNC1(CCCCC1=O)c2ccccc2Cl',
    riskTier: 'DISSOCIATIVE PROTOCOL',
    pkData: { bioavailability: '93% (IV) / ~20% (oral)', halfLife: '2–3 hours', tmax: 'Varies by route', primaryRoute: 'IV / IM' },
    kiProfile: { ht2a: 10000, ht1a: 10000, ht2c: 10000, d2: 10000, sert: 10000, nmda: 500 },
    mechanismText: 'Ketamine acts as a non-competitive NMDA receptor antagonist, binding to the PCP site within the ion channel. Blockade of NMDA receptors reduces excitatory glutamatergic transmission and triggers downstream AMPA receptor potentiation and BDNF release.',
    therapeuticHypothesis: 'Rapid NMDA blockade followed by a surge in AMPA signaling and synaptogenesis is hypothesized to restore synaptic plasticity in depression-related neural circuits, producing antidepressant effects within hours rather than weeks.',
    criticalSafetyNote: 'Dissociation, blood pressure elevation, and emergence reactions require monitored clinical settings. Abuse potential and potential for cystitis with chronic use must be assessed.',
    toxicityHighlights: ['Blood pressure elevation (monitor)', 'Dissociative emergence reactions', 'Urinary tract toxicity with chronic use', 'Abuse/dependence potential (Schedule III)'],
    absoluteContraindications: ['Uncontrolled hypertension', 'Schizophrenia or active psychosis', 'Recent stroke or elevated intracranial pressure'],
    requiredScreening: ['Blood pressure baseline', 'Psychiatric history (psychosis screening)', 'Renal/urinary history for repeat dosing']
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
    imageUrl: '/molecules/mdma.png',
    rxnorm_cui: 6853,
    color: '#a855f7',
    pubchemCid: 1615,
    smiles: 'CC(NC)Cc1ccc2c(c1)OCO2',
    riskTier: 'STANDARD MONITORING',
    pkData: { bioavailability: '~80–90% (oral)', halfLife: '6–9 hours', tmax: '1–3 hours', primaryRoute: 'Oral' },
    kiProfile: { ht2a: 10000, ht1a: 1200, ht2c: 1500, d2: 1300, sert: 240, nmda: 10000 },
    mechanismText: 'MDMA is a substrate for the serotonin, dopamine, and norepinephrine transporters (SERT/DAT/NET), causing massive monoamine release rather than direct receptor agonism. SERT reversal dominates, producing oxytocin release and the characteristic empathogenic state.',
    therapeuticHypothesis: 'MDMA-facilitated PTSD therapy uses the acute oxytocin surge and fear extinction window to allow patients to re-process traumatic memories without the defensive avoidance that typically limits psychotherapy.',
    criticalSafetyNote: 'Concurrent SSRI, SNRI, or MAOI use is contraindicated — risk of serotonin syndrome. Cardiovascular effects (tachycardia, hypertension) require monitoring.',
    toxicityHighlights: ['Serotonin neurotoxicity at high/repeated doses', 'Hyperthermia risk in uncontrolled settings', 'Cardiovascular: tachycardia, hypertension', 'Not for use with serotoninergic medications'],
    absoluteContraindications: ['Concurrent SSRI/SNRI/MAOI use', 'Cardiovascular disease (uncontrolled)', 'Liver disease', 'History of hyponatremia'],
    requiredScreening: ['Full cardiovascular assessment', 'Current medication list (serotonergic agents)', 'Liver function tests', 'Psychiatric history']
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
    imageUrl: '/molecules/psilocybin.png',
    rxnorm_cui: 1433,
    color: '#6366f1',
    pubchemCid: 10258,
    smiles: 'CN(C)CCc1c[nH]c2ccc(O)cc12',
    riskTier: 'STANDARD MONITORING',
    pkData: { bioavailability: '~50–60% (oral)', halfLife: '2–3 hours (active psilocin)', tmax: '1–2 hours', primaryRoute: 'Oral' },
    kiProfile: { ht2a: 28, ht1a: 150, ht2c: 63, d2: 10000, sert: 10000, nmda: 10000 },
    mechanismText: 'Psilocybin is dephosphorylated to psilocin in vivo, which acts as a partial agonist at 5-HT2A receptors in the prefrontal cortex and default mode network. This disrupts normal thalamo-cortical gating, producing the characteristic perceptual and introspective effects.',
    therapeuticHypothesis: 'Transient 5-HT2A-mediated disruption of the Default Mode Network reduces rigid self-referential thinking patterns associated with depression and OCD, while promoting neuroplasticity and psychological flexibility.',
    criticalSafetyNote: 'Concurrent lithium is an absolute contraindication — combined with psilocybin/psilocin, lithium significantly lowers the seizure threshold, creating a life-threatening risk of seizures and fugue states.',
    toxicityHighlights: ['Physiologically well-tolerated at clinical doses', 'Transient anxiety, confusion during acute phase', 'No known direct organ toxicity', 'Psychological distress possible without adequate preparation'],
    absoluteContraindications: ['Lithium (seizure risk)', 'Personal/family history of psychosis or schizophrenia', 'Pregnancy'],
    requiredScreening: ['Psychiatric history (psychosis, bipolar screening)', 'Current medication list (lithium, tramadol)', 'Cardiovascular baseline']
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
    imageUrl: '/molecules/lsd-25.png',
    rxnorm_cui: 4439,
    color: '#ec4899',
    pubchemCid: 5761,
    smiles: 'CCN(CC)C(=O)[C@H]1CN([C@@H]2Cc3c[nH]c4cccc(c34)C2=C1)C',
    riskTier: 'STANDARD MONITORING',
    pkData: { bioavailability: '~70–71% (oral)', halfLife: '8–12 hours', tmax: '1–3 hours', primaryRoute: 'Oral / Sublingual' },
    kiProfile: { ht2a: 2.9, ht1a: 5.1, ht2c: 8.5, d2: 250, sert: 10000, nmda: 10000 },
    mechanismText: 'LSD acts as a high-potency partial agonist at 5-HT2A receptors (Ki 2.9 nM). Uniquely, the extracellular loop 2 (ECL2) of the receptor closes over the LSD molecule after binding, creating a kinetic "lid" that markedly slows dissociation — the structural basis for its 8–12 hour duration.',
    therapeuticHypothesis: 'LSD\'s prolonged 5-HT2A engagement produces sustained disruption of the Default Mode Network with extended neuroplasticity windows, potentially making it useful for anxiety disorders and addiction where longer experiential processing is beneficial.',
    criticalSafetyNote: 'The exceptional potency (active at 50–200 mcg) makes dose control critical; the extended duration (8–12 hours) requires dedicated clinical time and experienced monitoring throughout.',
    toxicityHighlights: ['Physiologically very well-tolerated', 'Extreme potency requires precise dosing (microgram scale)', 'HPPD risk with repeated use', 'Prolonged duration demands extended clinical oversight'],
    absoluteContraindications: ['Personal/family history of psychosis or schizophrenia', 'Lithium', 'Pregnancy'],
    requiredScreening: ['Psychiatric history (psychosis screening)', 'Medication reconciliation', 'Time/setting availability >8 hours']
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
    imageUrl: '/molecules/5-MeO-DMT.webp',
    color: '#06b6d4',
    pubchemCid: 1832,
    smiles: 'CN(C)CCc1c[nH]c2ccc(OC)cc12',
    riskTier: 'STANDARD MONITORING',
    pkData: { bioavailability: '~5–7% oral / high (smoked/IM)', halfLife: '15–30 minutes (smoked)', tmax: '1–5 minutes (smoked)', primaryRoute: 'Insufflated / Smoked / IM' },
    kiProfile: { ht2a: 295, ht1a: 2.1, ht2c: 820, d2: 10000, sert: 10000, nmda: 10000 },
    mechanismText: '5-MeO-DMT is distinguished from other tryptamines by its primary activity at 5-HT1A receptors (Ki 2.1 nM) rather than 5-HT2A. This gives it a fundamentally different subjective and physiological profile — more anxiolytic and ego-dissolving at low doses, with a shorter and more intense onset.',
    therapeuticHypothesis: 'Strong 5-HT1A agonism produces rapid anxiolysis and a complete dissolution of self-referential consciousness, a state associated with high rates of mystical experience scores and sustained reductions in depression and anxiety measures at single-dose follow-up.',
    criticalSafetyNote: 'Onset is extremely rapid (seconds to 1–2 minutes when smoked) and intensity often overwhelming — requires experienced facilitation and should not be combined with other serotoninergic agents.',
    toxicityHighlights: ['Rapid, overwhelming onset requires expert facilitation', 'Risk of accidental high doses without precise titration', 'Not for use with serotoninergic drugs'],
    absoluteContraindications: ['MAOI use (risk of serotonin crisis)', 'Concurrent serotoninergic medications', 'Cardiovascular instability'],
    requiredScreening: ['Medication list (MAOI, SSRI)', 'Cardiac assessment', 'Facilitation competency (rapid onset risk)']
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
    imageUrl: '/molecules/ibogaine.png',
    rxnorm_cui: 1243,
    color: '#8b5cf6',
    pubchemCid: 197101,
    smiles: 'CC[C@H]1CN2CCc3c([nH]c4ccccc34)[C@H]2C[C@@H]1CC1NCCc2c1[nH]c1ccccc21',
    riskTier: 'CARDIAC RISK',
    pkData: { bioavailability: '~50–80% (oral)', halfLife: '24–76 hours', tmax: '2–3 hours', primaryRoute: 'Oral' },
    kiProfile: { ht2a: 700, ht1a: 580, ht2c: 420, d2: 460, sert: 640, nmda: 2000 },
    mechanismText: 'Ibogaine has the most complex multi-target pharmacology in this class — interacting with opioid receptors (mu/kappa), sigma-2 receptors, NMDA channels, SERT/NET transporters, and multiple 5-HT receptor subtypes. No single receptor accounts for its clinical effects.',
    therapeuticHypothesis: 'Ibogaine appears to interrupt opioid dependence by resetting receptor sensitivity and dopamine signaling simultaneously with a prolonged introspective state that supports motivational change — a unique combination not replicated by any approved therapy.',
    criticalSafetyNote: 'CARDIAC RISK: Ibogaine prolongs the QTc interval and has been associated with fatal cardiac arrhythmias. An EKG, electrolyte panel (K+, Mg2+), and cardiac clearance are mandatory before any administration.',
    toxicityHighlights: ['QTc prolongation — potentially fatal arrhythmia', 'Hepatotoxic potential at high doses', 'Very long duration (24–72 hours) requires sustained monitoring', 'Multiple drug interactions via CYP2D6 inhibition'],
    absoluteContraindications: ['Long QT syndrome or QTc >450ms', 'Bradycardia or structural heart disease', 'Liver disease (hepatotoxicity risk)', 'Concurrent opioid use without medical supervision'],
    requiredScreening: ['12-lead EKG (mandatory)', 'Electrolytes: potassium and magnesium', 'Liver function tests', 'Full cardiac history and assessment', 'CYP2D6 inhibitor review']
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
    imageUrl: '/molecules/mescaline.png',
    rxnorm_cui: 6952,
    color: '#14b8a6',
    pubchemCid: 4276,
    smiles: 'COc1cc(CCN)cc(OC)c1OC',
    riskTier: 'STANDARD MONITORING',
    pkData: { bioavailability: '~90% (oral)', halfLife: '6–10 hours', tmax: '1–2 hours', primaryRoute: 'Oral' },
    kiProfile: { ht2a: 3000, ht1a: 10000, ht2c: 2000, d2: 10000, sert: 10000, nmda: 10000 },
    mechanismText: 'Mescaline acts as a low-potency 5-HT2A agonist with micromolar affinity — roughly 1,000× less potent than LSD. Its phenethylamine scaffold also gives it mild dopaminergic activity. High doses (300–500mg) are required for clinical effect, compared to microgram quantities for LSD.',
    therapeuticHypothesis: 'Mescaline\'s long duration (10–12 hours) and relatively gentle onset may make it useful for prolonged processing-focused therapeutic work. The Native American Church has used peyote (the mescaline-containing cactus) sacramentally for centuries with an extensive cultural safety record.',
    criticalSafetyNote: 'The high doses required produce significant nausea and cardiovascular stimulation; cardiovascular baseline assessment and antiemetic preparation are important for clinical use.',
    toxicityHighlights: ['Nausea and vomiting at onset (common)', 'Cardiovascular stimulation at high doses', 'Very long duration (10–12 hours) — scheduling constraint', 'Low toxicity overall at clinical doses'],
    absoluteContraindications: ['Cardiovascular disease (stimulant effect)', 'MAOIs (potentiation risk)'],
    requiredScreening: ['Cardiovascular baseline', 'Medication list (MAOIs)', 'Antiemetic planning']
  },
  {
    id: 'DMT-0601',
    name: 'DMT',
    chemicalName: 'N,N-Dimethyltryptamine',
    class: 'TRYPTAMINE',
    phase: ResearchPhase.Phase1,
    schedule: 'Schedule I',
    cas: '61-50-7',
    molecularWeight: '188.27 g/mol',
    formula: 'C12H16N2',
    efficacy: 0.68,
    historicalEfficacy: [0.62, 0.68],
    imageUrl: '/molecules/Dimethyltryptamine.webp',
    color: '#10b981',
    pubchemCid: 6089,
    smiles: 'CN(C)CCc1c[nH]c2ccccc12',
    riskTier: 'STANDARD MONITORING',
    pkData: { bioavailability: '<1% oral without MAOI', halfLife: '10–20 minutes (smoked/IV)', tmax: '1–5 minutes (smoked)', primaryRoute: 'Smoked / IV / IM' },
    kiProfile: { ht2a: 150, ht1a: 12, ht2c: 60, d2: 10000, sert: 10000, nmda: 10000 },
    mechanismText: 'DMT acts as a broad serotonin partial agonist (5-HT2A/2C/1A) with rapid clearance. Extraordinarily short duration when smoked (15–30 minutes) is due to rapid MAO-A metabolism in the gut and liver. The sigma-1 receptor is also a significant target and may account for DMT\'s neuroprotective properties.',
    therapeuticHypothesis: 'IV-infusion DMT studies (Small Pharma Phase 1) are investigating whether sustained DMT delivery can produce therapeutic effects comparable to longer-acting psychedelics, with the advantage of a fully controlled, titratable clinical experience.',
    criticalSafetyNote: 'Orally inactive without an MAOI co-administration; smoking or IV routes produce immediate, disorienting onset — expert facilitation and monitored setting are required.',
    toxicityHighlights: ['Immediate, disorienting onset when inhaled/IV', 'Very short duration limits sustained monitoring need', 'Physiologically well-tolerated', 'Risk of falls/injury during acute phase without support'],
    absoluteContraindications: ['MAOI use (risk of serotonin crisis via oral route)', 'Concurrent serotoninergic medications'],
    requiredScreening: ['Medication list (MAOIs, SSRIs)', 'Setting and facilitation readiness']
  },
  {
    id: 'ESK-3822',
    name: 'Esketamine',
    chemicalName: '(S)-Ketamine (Spravato®)',
    class: 'ARYLCYCLOHEXYLAMINE',
    phase: ResearchPhase.Approved,
    schedule: 'Schedule III',
    cas: '33643-46-8',
    molecularWeight: '237.7 g/mol',
    formula: 'C13H16ClNO',
    efficacy: 0.88,
    historicalEfficacy: [0.75, 0.82, 0.88],
    imageUrl: '/molecules/esketamine.png',
    color: '#0ea5e9',
    pubchemCid: 182137,
    smiles: 'CN[C@@]1(CCCCC1=O)c2ccccc2Cl',
    riskTier: 'FDA APPROVED · REMS',
    pkData: { bioavailability: '~8% intranasal', halfLife: '7–12 hours', tmax: '20–40 minutes', primaryRoute: 'Intranasal (clinical setting only)' },
    kiProfile: { ht2a: 10000, ht1a: 10000, ht2c: 10000, d2: 10000, sert: 10000, nmda: 250 },
    mechanismText: 'Esketamine is the S-enantiomer of racemic ketamine with approximately 2× greater NMDA receptor affinity (Ki ~250 nM vs 500 nM for racemic). Given intranasally (Spravato), it undergoes systemic absorption and crosses the blood-brain barrier to antagonize NMDA receptors.',
    therapeuticHypothesis: 'Rapid NMDA blockade triggers downstream AMPA upregulation and BDNF release, producing antidepressant effects within hours. FDA-approved for Treatment-Resistant Depression (TRD) and Major Depressive Disorder with acute suicidal ideation.',
    criticalSafetyNote: 'REMS program required: Spravato must be administered under direct observation in a certified healthcare setting. Patient cannot self-administer. 2-hour monitoring post-dose is mandatory due to dissociation and blood pressure elevation risk.',
    toxicityHighlights: ['Dissociation during and after administration (monitored)', 'Blood pressure elevation (2-hour post-dose monitoring required)', 'Sedation — patient cannot drive on treatment days', 'REMS certification required for prescribing facility'],
    absoluteContraindications: ['Aneurysmal vascular disease', 'History of intracerebral hemorrhage', 'Concurrent MAOIs'],
    requiredScreening: ['Blood pressure baseline', 'REMS program enrollment (facility and patient)', 'Psychiatric assessment (TRD diagnosis criteria)', 'Driving/transportation plan']
  },
  {
    id: 'AYA-7701',
    name: 'Ayahuasca',
    chemicalName: 'DMT + β-Carboline Brew (Banisteriopsis caapi + Psychotria viridis)',
    class: 'BOTANICAL COMBINATION',
    phase: ResearchPhase.Phase2,
    schedule: 'Schedule I',
    cas: 'N/A',
    molecularWeight: 'Variable (combination)',
    formula: 'DMT + Harmine + Harmaline + THH',
    efficacy: 0.76,
    historicalEfficacy: [0.68, 0.72, 0.76],
    imageUrl: '/molecules/Ayahuasca.webp',
    color: '#f59e0b',
    pubchemCid: 6089,
    smiles: 'CN(C)CCc1c[nH]c2ccccc12',
    riskTier: 'MAOI INTERACTION RISK',
    pkData: { bioavailability: 'Bioavailable (β-carbolines enable oral DMT)', halfLife: '3–5 hours', tmax: '1–2 hours', primaryRoute: 'Oral (brew)' },
    kiProfile: { ht2a: 150, ht1a: 12, ht2c: 60, d2: 10000, sert: 10000, nmda: 10000 },
    mechanismText: 'Ayahuasca combines N,N-DMT (from Psychotria viridis) with β-carboline MAO-A inhibitors — harmine, harmaline, and tetrahydroharmine (from Banisteriopsis caapi). The β-carbolines prevent first-pass DMT metabolism, enabling oral bioavailability. Harmine also inhibits serotonin reuptake, adding a serotoninergic dimension.',
    therapeuticHypothesis: 'The combination of 5-HT2A agonism (DMT) with serotonin reuptake inhibition (tetrahydroharmine) produces a multi-hour therapeutic window. Emerging evidence supports utility in treatment-resistant depression, substance use disorders, and end-of-life distress.',
    criticalSafetyNote: 'The β-carboline MAO-A inhibitors create a dangerous interaction with serotoninergic drugs (SSRIs, SNRIs, tryptophan) and tyramine-rich foods. SSRI/SNRI use within 2 weeks is an absolute contraindication due to serotonin syndrome risk.',
    toxicityHighlights: ['MAOI + SSRI/SNRI = serotonin syndrome risk (serious)', 'Dietary tyramine restriction required (MAO-A inhibition)', 'Intense nausea, purging common ("la purga")', 'Cardiovascular stimulation (tachycardia, hypertension)'],
    absoluteContraindications: ['SSRI/SNRI within 14 days', 'MAOI medications', 'Lithium (seizure risk with tryptamines)', 'Cardiovascular disease', 'Schizophrenia/active psychosis'],
    requiredScreening: ['Complete medication reconciliation (serotonergic agents)', 'Dietary history (tyramine-containing foods)', 'Cardiovascular baseline', 'Psychiatric history (psychosis screening)']
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
  },
  // NEW: Multi-session treatment timeline examples
  {
    id: 'TL-001',
    siteId: 'NODE-01',
    status: 'Active',
    demographics: {
      age: 38,
      sex: 'Female',
      race: '2106-3',
      weight: 68,
      patientHash: '6f9a2b3c4d5e8f1a'
    },
    protocol: { substance: 'Psilocybin', dosage: '25', dosageUnit: 'mg', frequency: 'Monthly', route: 'Oral', startDate: '2024-01-01' },
    context: {
      setting: 'Clinical (Medical)',
      supportRatio: '1:1',
      musicPresence: true,
      prepHours: 4,
      integrationHours: 6,
      modalities: ['CBT'],
      concomitantMeds: []
    },
    experience: {
      difficultyScore: 4,
      resolutionStatus: 'Resolved'
    },
    safetyEvents: [],
    outcomes: [
      { date: '2024-01-01', score: 18, type: 'PHQ-9', interpretation: 'Session 1: Moderate' },
      { date: '2024-01-08', score: 15, type: 'PHQ-9', interpretation: 'Session 2: Moderate' },
      { date: '2024-01-12', score: 12, type: 'PHQ-9', interpretation: 'Session 3: Moderate' },
      { date: '2024-01-16', score: 11, type: 'PHQ-9', interpretation: 'Session 4: Mild' }
    ],
    consent: { verified: true, timestamp: '2023-12-28', type: 'Research-Sharing' },
    lastUpdated: '2024-01-16'
  },
  {
    id: 'TL-002',
    siteId: 'NODE-01',
    status: 'Active',
    demographics: {
      age: 42,
      sex: 'Male',
      race: '2054-5',
      weight: 85,
      patientHash: 'a1b2c3d4e5f67890'
    },
    protocol: { substance: 'Psilocybin', dosage: '50', dosageUnit: 'mg', frequency: 'Bi-Weekly', route: 'Oral', startDate: '2024-01-05' },
    context: {
      setting: 'Clinical (Medical)',
      supportRatio: '2:1',
      musicPresence: true,
      prepHours: 6,
      integrationHours: 10,
      modalities: ['Psychodynamic', 'Somatic'],
      concomitantMeds: ['Escitalopram (Lexapro)']
    },
    experience: {
      difficultyScore: 5,
      resolutionStatus: 'Resolved'
    },
    safetyEvents: [
      {
        id: 'AE-TL2-1',
        date: '2024-01-19',
        type: 'Nausea',
        severity: 2,
        causality: 'Related',
        description: 'Mild nausea during onset, resolved within 30 minutes.',
        meddraCode: 10028813
      }
    ],
    outcomes: [
      { date: '2024-01-05', score: 21, type: 'PHQ-9', interpretation: 'Session 1: Severe' },
      { date: '2024-01-12', score: 17, type: 'PHQ-9', interpretation: 'Session 2: Moderate' },
      { date: '2024-01-19', score: 14, type: 'PHQ-9', interpretation: 'Session 3: Moderate' },
      { date: '2024-01-26', score: 9, type: 'PHQ-9', interpretation: 'Session 4: Mild' },
      { date: '2024-02-02', score: 6, type: 'PHQ-9', interpretation: 'Session 5: Mild' }
    ],
    consent: { verified: true, timestamp: '2024-01-01', type: 'Research-Sharing' },
    lastUpdated: '2024-02-02'
  },
  {
    id: 'TL-003',
    siteId: 'NODE-04',
    status: 'Completed',
    demographics: {
      age: 29,
      sex: 'Female',
      race: '2106-3',
      weight: 62,
      patientHash: 'b2c3d4e5f6789012'
    },
    protocol: { substance: 'MDMA', dosage: '100', dosageUnit: 'mg', frequency: 'Monthly', route: 'Oral', startDate: '2023-09-01' },
    context: {
      setting: 'Clinical (Medical)',
      supportRatio: '1:1',
      musicPresence: true,
      prepHours: 3,
      integrationHours: 8,
      modalities: ['IFS', 'Somatic'],
      concomitantMeds: []
    },
    experience: {
      difficultyScore: 7,
      resolutionStatus: 'Resolved in Session'
    },
    safetyEvents: [],
    outcomes: [
      { date: '2023-09-01', score: 19, type: 'PHQ-9', interpretation: 'Session 1: Moderate' },
      { date: '2023-10-01', score: 14, type: 'PHQ-9', interpretation: 'Session 2: Moderate' },
      { date: '2023-11-01', score: 8, type: 'PHQ-9', interpretation: 'Session 3: Mild' },
      { date: '2023-12-01', score: 4, type: 'PHQ-9', interpretation: 'Session 4: Remission' }
    ],
    consent: { verified: true, timestamp: '2023-08-25', type: 'Research-Sharing' },
    lastUpdated: '2023-12-15'
  },
  {
    id: 'TL-004',
    siteId: 'NODE-07',
    status: 'Active',
    demographics: {
      age: 51,
      sex: 'Male',
      race: '2054-5',
      weight: 88,
      patientHash: 'c3d4e5f678901234'
    },
    protocol: { substance: 'Ketamine', dosage: '0.5', dosageUnit: 'mg/kg', frequency: 'Weekly', route: 'Intravenous', startDate: '2024-01-10' },
    context: {
      setting: 'Clinical (Soft)',
      supportRatio: '1:1',
      musicPresence: true,
      prepHours: 0,
      integrationHours: 2,
      modalities: ['None/Sitter'],
      concomitantMeds: ['Venlafaxine (Effexor)', 'Lorazepam (Ativan)']
    },
    experience: {
      difficultyScore: 2,
      resolutionStatus: 'Resolved'
    },
    safetyEvents: [],
    outcomes: [
      { date: '2024-01-10', score: 28, type: 'MADRS', interpretation: 'Session 1: Severe' },
      { date: '2024-01-17', score: 22, type: 'MADRS', interpretation: 'Session 2: Moderate' },
      { date: '2024-01-24', score: 18, type: 'MADRS', interpretation: 'Session 3: Moderate' },
      { date: '2024-01-31', score: 14, type: 'MADRS', interpretation: 'Session 4: Mild' },
      { date: '2024-02-07', score: 12, type: 'MADRS', interpretation: 'Session 5: Mild' }
    ],
    consent: { verified: true, timestamp: '2024-01-05', type: 'Research-Sharing' },
    lastUpdated: '2024-02-07'
  },
  // Substance switch example
  {
    id: 'TL-005',
    siteId: 'NODE-01',
    status: 'Active',
    demographics: {
      age: 35,
      sex: 'Female',
      race: '2106-3',
      weight: 70,
      patientHash: 'd4e5f67890123456'
    },
    protocol: { substance: 'MDMA', dosage: '120', dosageUnit: 'mg', frequency: 'Monthly', route: 'Oral', startDate: '2024-01-03' },
    context: {
      setting: 'Clinical (Medical)',
      supportRatio: '1:1',
      musicPresence: true,
      prepHours: 4,
      integrationHours: 12,
      modalities: ['IFS'],
      concomitantMeds: []
    },
    experience: {
      difficultyScore: 6,
      resolutionStatus: 'Resolved'
    },
    safetyEvents: [],
    outcomes: [
      { date: '2024-01-03', score: 20, type: 'PHQ-9', interpretation: 'Session 1 (Psilocybin 25mg): Moderate' },
      { date: '2024-01-10', score: 16, type: 'PHQ-9', interpretation: 'Session 2 (Psilocybin 50mg): Moderate' },
      { date: '2024-01-17', score: 13, type: 'PHQ-9', interpretation: 'Session 3 (MDMA 100mg): Moderate' },
      { date: '2024-01-24', score: 8, type: 'PHQ-9', interpretation: 'Session 4 (MDMA 120mg): Mild' }
    ],
    consent: { verified: true, timestamp: '2024-01-01', type: 'Research-Sharing' },
    lastUpdated: '2024-01-24'
  },
  // Dose escalation example
  {
    id: 'TL-006',
    siteId: 'NODE-02',
    status: 'Active',
    demographics: {
      age: 47,
      sex: 'Male',
      race: '2106-3',
      weight: 92,
      patientHash: 'e5f678901234567a'
    },
    protocol: { substance: 'Psilocybin', dosage: '50', dosageUnit: 'mg', frequency: 'Bi-Weekly', route: 'Oral', startDate: '2024-01-02' },
    context: {
      setting: 'Clinical (Medical)',
      supportRatio: '2:1',
      musicPresence: true,
      prepHours: 6,
      integrationHours: 8,
      modalities: ['CBT', 'Psychodynamic'],
      concomitantMeds: ['Bupropion (Wellbutrin)']
    },
    experience: {
      difficultyScore: 5,
      resolutionStatus: 'Resolved'
    },
    safetyEvents: [],
    outcomes: [
      { date: '2024-01-02', score: 22, type: 'PHQ-9', interpretation: 'Session 1 (15mg): Severe' },
      { date: '2024-01-09', score: 19, type: 'PHQ-9', interpretation: 'Session 2 (25mg): Moderate' },
      { date: '2024-01-16', score: 15, type: 'PHQ-9', interpretation: 'Session 3 (35mg): Moderate' },
      { date: '2024-01-23', score: 11, type: 'PHQ-9', interpretation: 'Session 4 (50mg): Mild' },
      { date: '2024-01-30', score: 7, type: 'PHQ-9', interpretation: 'Session 5 (50mg): Mild' }
    ],
    consent: { verified: true, timestamp: '2023-12-30', type: 'Research-Sharing' },
    lastUpdated: '2024-01-30'
  },
  // High-frequency treatment
  {
    id: 'TL-007',
    siteId: 'NODE-07',
    status: 'Active',
    demographics: {
      age: 33,
      sex: 'Female',
      race: '2054-5',
      weight: 59,
      patientHash: 'f67890123456789b'
    },
    protocol: { substance: 'Ketamine', dosage: '0.5', dosageUnit: 'mg/kg', frequency: 'Twice Weekly', route: 'Intravenous', startDate: '2024-01-08' },
    context: {
      setting: 'Clinical (Soft)',
      supportRatio: '1:1',
      musicPresence: true,
      prepHours: 0,
      integrationHours: 1,
      modalities: ['None/Sitter'],
      concomitantMeds: ['Duloxetine (Cymbalta)']
    },
    experience: {
      difficultyScore: 1,
      resolutionStatus: 'Resolved'
    },
    safetyEvents: [],
    outcomes: [
      { date: '2024-01-08', score: 26, type: 'PHQ-9', interpretation: 'Session 1: Severe' },
      { date: '2024-01-11', score: 23, type: 'PHQ-9', interpretation: 'Session 2: Severe' },
      { date: '2024-01-15', score: 19, type: 'PHQ-9', interpretation: 'Session 3: Moderate' },
      { date: '2024-01-18', score: 16, type: 'PHQ-9', interpretation: 'Session 4: Moderate' },
      { date: '2024-01-22', score: 13, type: 'PHQ-9', interpretation: 'Session 5: Moderate' },
      { date: '2024-01-25', score: 10, type: 'PHQ-9', interpretation: 'Session 6: Mild' },
      { date: '2024-01-29', score: 8, type: 'PHQ-9', interpretation: 'Session 7: Mild' }
    ],
    consent: { verified: true, timestamp: '2024-01-05', type: 'Research-Sharing' },
    lastUpdated: '2024-01-29'
  },
  // Rapid responder
  {
    id: 'TL-008',
    siteId: 'NODE-04',
    status: 'Completed',
    demographics: {
      age: 26,
      sex: 'Male',
      race: '2106-3',
      weight: 75,
      patientHash: 'g78901234567890c'
    },
    protocol: { substance: 'Psilocybin', dosage: '30', dosageUnit: 'mg', frequency: 'Single Session', route: 'Oral', startDate: '2023-12-01' },
    context: {
      setting: 'Retreat Center',
      supportRatio: '1:2',
      musicPresence: true,
      prepHours: 8,
      integrationHours: 16,
      modalities: ['Psychodynamic', 'Somatic'],
      concomitantMeds: []
    },
    experience: {
      difficultyScore: 8,
      resolutionStatus: 'Resolved in Session'
    },
    safetyEvents: [],
    outcomes: [
      { date: '2023-12-01', score: 24, type: 'PHQ-9', interpretation: 'Session 1: Severe' },
      { date: '2023-12-08', score: 9, type: 'PHQ-9', interpretation: 'Session 2: Mild' },
      { date: '2023-12-15', score: 4, type: 'PHQ-9', interpretation: 'Session 3: Remission' }
    ],
    consent: { verified: true, timestamp: '2023-11-28', type: 'Research-Sharing' },
    lastUpdated: '2023-12-20'
  },
  // Non-responder with adverse events
  {
    id: 'TL-009',
    siteId: 'NODE-02',
    status: 'Observation',
    demographics: {
      age: 52,
      sex: 'Female',
      race: '2106-3',
      weight: 78,
      patientHash: 'h89012345678901d'
    },
    protocol: { substance: 'LSD-25', dosage: '150', dosageUnit: 'ug', frequency: 'Monthly', route: 'Oral', startDate: '2023-11-15' },
    context: {
      setting: 'Clinical (Medical)',
      supportRatio: '2:1',
      musicPresence: false,
      prepHours: 6,
      integrationHours: 10,
      modalities: ['CBT'],
      concomitantMeds: ['Quetiapine (Seroquel)']
    },
    experience: {
      difficultyScore: 9,
      resolutionStatus: 'Unresolved/Lingering'
    },
    safetyEvents: [
      {
        id: 'AE-TL9-1',
        date: '2023-11-15',
        type: 'Anxiety',
        severity: 3,
        causality: 'Related',
        description: 'Severe anxiety during peak, required benzodiazepine intervention.',
        meddraCode: 10002855
      },
      {
        id: 'AE-TL9-2',
        date: '2023-12-15',
        type: 'Panic Attack',
        severity: 2,
        causality: 'Related',
        description: 'Panic attack during onset, resolved with grounding techniques.',
        meddraCode: 10033664
      }
    ],
    outcomes: [
      { date: '2023-11-15', score: 17, type: 'GAD-7', interpretation: 'Session 1: Severe' },
      { date: '2023-12-15', score: 18, type: 'GAD-7', interpretation: 'Session 2: Severe' },
      { date: '2024-01-15', score: 16, type: 'GAD-7', interpretation: 'Session 3: Severe' }
    ],
    consent: { verified: true, timestamp: '2023-11-10', type: 'Research-Sharing' },
    lastUpdated: '2024-01-20'
  },
  // Long-term maintenance
  {
    id: 'TL-010',
    siteId: 'NODE-01',
    status: 'Active',
    demographics: {
      age: 44,
      sex: 'Male',
      race: '2054-5',
      weight: 80,
      patientHash: 'i90123456789012e'
    },
    protocol: { substance: 'Psilocybin', dosage: '25', dosageUnit: 'mg', frequency: 'Quarterly', route: 'Oral', startDate: '2023-06-01' },
    context: {
      setting: 'Clinical (Medical)',
      supportRatio: '1:1',
      musicPresence: true,
      prepHours: 4,
      integrationHours: 6,
      modalities: ['CBT', 'IFS'],
      concomitantMeds: []
    },
    experience: {
      difficultyScore: 3,
      resolutionStatus: 'Resolved'
    },
    safetyEvents: [],
    outcomes: [
      { date: '2023-06-01', score: 20, type: 'PHQ-9', interpretation: 'Session 1: Moderate' },
      { date: '2023-09-01', score: 8, type: 'PHQ-9', interpretation: 'Session 2: Mild' },
      { date: '2023-12-01', score: 5, type: 'PHQ-9', interpretation: 'Session 3: Mild' },
      { date: '2024-03-01', score: 4, type: 'PHQ-9', interpretation: 'Session 4: Remission' }
    ],
    consent: { verified: true, timestamp: '2023-05-28', type: 'Research-Sharing' },
    lastUpdated: '2024-03-05'
  },
  // Mixed modality with route change
  {
    id: 'TL-011',
    siteId: 'NODE-07',
    status: 'Active',
    demographics: {
      age: 39,
      sex: 'Female',
      race: '2106-3',
      weight: 64,
      patientHash: 'j01234567890123f'
    },
    protocol: { substance: 'Ketamine', dosage: '0.75', dosageUnit: 'mg/kg', frequency: 'Weekly', route: 'Intramuscular', startDate: '2024-01-05' },
    context: {
      setting: 'Clinical (Soft)',
      supportRatio: '1:1',
      musicPresence: true,
      prepHours: 1,
      integrationHours: 3,
      modalities: ['Somatic', 'IFS'],
      concomitantMeds: ['Mirtazapine (Remeron)']
    },
    experience: {
      difficultyScore: 4,
      resolutionStatus: 'Resolved'
    },
    safetyEvents: [],
    outcomes: [
      { date: '2024-01-05', score: 25, type: 'PHQ-9', interpretation: 'Session 1 (IV): Severe' },
      { date: '2024-01-12', score: 21, type: 'PHQ-9', interpretation: 'Session 2 (IV): Severe' },
      { date: '2024-01-19', score: 17, type: 'PHQ-9', interpretation: 'Session 3 (IM): Moderate' },
      { date: '2024-01-26', score: 13, type: 'PHQ-9', interpretation: 'Session 4 (IM): Moderate' },
      { date: '2024-02-02', score: 9, type: 'PHQ-9', interpretation: 'Session 5 (IM): Mild' }
    ],
    consent: { verified: true, timestamp: '2024-01-01', type: 'Research-Sharing' },
    lastUpdated: '2024-02-02'
  },
  // Combination therapy
  {
    id: 'TL-012',
    siteId: 'NODE-04',
    status: 'Active',
    demographics: {
      age: 31,
      sex: 'Male',
      race: '2106-3',
      weight: 77,
      patientHash: 'k12345678901234g'
    },
    protocol: { substance: 'MDMA', dosage: '125', dosageUnit: 'mg', frequency: 'Bi-Weekly', route: 'Oral', startDate: '2024-01-04' },
    context: {
      setting: 'Clinical (Medical)',
      supportRatio: '1:1',
      musicPresence: true,
      prepHours: 3,
      integrationHours: 10,
      modalities: ['IFS', 'Somatic', 'Psychodynamic'],
      concomitantMeds: []
    },
    experience: {
      difficultyScore: 7,
      resolutionStatus: 'Resolved in Session'
    },
    safetyEvents: [
      {
        id: 'AE-TL12-1',
        date: '2024-01-18',
        type: 'Tachycardia',
        severity: 2,
        causality: 'Related',
        description: 'Elevated heart rate (110 bpm) during peak, monitored and resolved.',
        meddraCode: 10043071
      }
    ],
    outcomes: [
      { date: '2024-01-04', score: 23, type: 'PHQ-9', interpretation: 'Session 1: Severe' },
      { date: '2024-01-18', score: 18, type: 'PHQ-9', interpretation: 'Session 2: Moderate' },
      { date: '2024-02-01', score: 12, type: 'PHQ-9', interpretation: 'Session 3: Moderate' },
      { date: '2024-02-15', score: 7, type: 'PHQ-9', interpretation: 'Session 4: Mild' }
    ],
    consent: { verified: true, timestamp: '2024-01-01', type: 'Research-Sharing' },
    lastUpdated: '2024-02-15'
  }
];

export const SAMPLE_INTERVENTION_RECORDS = PATIENTS;

// --- AUDIT LOG DATA ---
// Import generated audit logs (200 diverse records)
export { AUDIT_LOGS } from './data/generateAuditLogs';
