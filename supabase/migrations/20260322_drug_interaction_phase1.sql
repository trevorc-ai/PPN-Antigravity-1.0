-- ============================================================
-- PPN Portal — Drug Interaction Checker Phase 1 Migration
-- Created: 2026-03-22
-- Scope:
--   PART A: Add 10 columns to ref_clinical_interactions
--   PART B: Backfill risk_bucket for 11 pre-existing rows
--   PART C: Seed 25 validated interaction rules
--
-- SAFETY:
--   All ADD COLUMN uses IF NOT EXISTS — safe to re-run
--   No columns dropped. No types changed. No RLS policy changes.
--   Pre-existing RLS covers all new columns automatically:
--     SELECT: any authenticated user (ref_clinical_interactions_read)
--     INSERT/UPDATE/DELETE: network_admin or service_role
--
-- USER: Run manually in Supabase SQL Editor.
-- ============================================================

-- ============================================================
-- PART A: SCHEMA MIGRATION — Additive columns
-- ============================================================

ALTER TABLE ref_clinical_interactions
  -- 5-tier clinical risk bucket (the primary decision field)
  ADD COLUMN IF NOT EXISTS risk_bucket         text,
  -- Interaction mechanism category
  ADD COLUMN IF NOT EXISTS interaction_type    text,
  -- Direction of the interaction impact
  ADD COLUMN IF NOT EXISTS effect_direction    text,
  -- Confidence level of evidence
  ADD COLUMN IF NOT EXISTS confidence          text,
  -- Evidence tier from source literature
  ADD COLUMN IF NOT EXISTS evidence_level      text,
  -- Washout period in days (NULL if not applicable)
  ADD COLUMN IF NOT EXISTS washout_days        integer,
  -- Plain-language washout instructions for practitioner display
  ADD COLUMN IF NOT EXISTS washout_note        text,
  -- Plain-language screening guidance shown in Phase 1 safety screen
  ADD COLUMN IF NOT EXISTS screening_note      text,
  -- Whether the interaction applies equally in both directions
  ADD COLUMN IF NOT EXISTS is_bidirectional    boolean DEFAULT true,
  -- Stable unique key for programmatic reference (e.g. 'PSI-SSRI-ESC')
  ADD COLUMN IF NOT EXISTS rule_key            text;

-- Unique partial index on rule_key (NULL-safe: only constraints non-null entries)
CREATE UNIQUE INDEX IF NOT EXISTS idx_rci_rule_key
  ON ref_clinical_interactions (rule_key)
  WHERE rule_key IS NOT NULL;

-- ============================================================
-- UNIQUE constraint required by ON CONFLICT (substance_name, interactor_name).
-- Live DB has 'unique_interaction' (confirmed VQ-3 2026-03-22).
-- DO block checks for BOTH names — safe to re-run regardless of state.
-- ============================================================
DO $$
BEGIN
  -- Only add if neither the legacy 'unique_interaction' nor the canonical
  -- 'uq_rci_substance_interactor' constraint already exists on this table.
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname IN ('unique_interaction', 'uq_rci_substance_interactor')
      AND conrelid = 'ref_clinical_interactions'::regclass
  ) THEN
    ALTER TABLE ref_clinical_interactions
      ADD CONSTRAINT uq_rci_substance_interactor
      UNIQUE (substance_name, interactor_name);
  END IF;
END $$;

-- CHECK constraints — wrapped in DO blocks for idempotency
DO $$
BEGIN
  -- risk_bucket: 6-value 5-tier model (INSUFFICIENT_EVIDENCE = "no data" state)
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'ck_rci_risk_bucket'
      AND conrelid = 'ref_clinical_interactions'::regclass
  ) THEN
    ALTER TABLE ref_clinical_interactions
      ADD CONSTRAINT ck_rci_risk_bucket CHECK (
        risk_bucket IS NULL OR risk_bucket IN (
          'ABSOLUTE_CONTRAINDICATION',
          'STRONG_CAUTION',
          'CLINICIAN_REVIEW',
          'POSSIBLE_EFFICACY_BLUNTING',
          'MONITOR_ONLY',
          'INSUFFICIENT_EVIDENCE'
        )
      );
  END IF;

  -- interaction_type: mechanistic category
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'ck_rci_interaction_type'
      AND conrelid = 'ref_clinical_interactions'::regclass
  ) THEN
    ALTER TABLE ref_clinical_interactions
      ADD CONSTRAINT ck_rci_interaction_type CHECK (
        interaction_type IS NULL OR interaction_type IN (
          'TOXICITY_AMPLIFICATION',
          'EFFICACY_BLUNTING',
          'PD_INTERACTION',
          'PK_INTERACTION',
          'PHYSIOLOGICAL_SHIFT',
          'MIXED',
          'UNKNOWN'
        )
      );
  END IF;

  -- confidence: evidence quality
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'ck_rci_confidence'
      AND conrelid = 'ref_clinical_interactions'::regclass
  ) THEN
    ALTER TABLE ref_clinical_interactions
      ADD CONSTRAINT ck_rci_confidence CHECK (
        confidence IS NULL OR confidence IN ('HIGH', 'MODERATE', 'LOW')
      );
  END IF;

  -- effect_direction: which way the interaction pushes
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'ck_rci_effect_direction'
      AND conrelid = 'ref_clinical_interactions'::regclass
  ) THEN
    ALTER TABLE ref_clinical_interactions
      ADD CONSTRAINT ck_rci_effect_direction CHECK (
        effect_direction IS NULL OR effect_direction IN (
          'DANGER_INCREASE',
          'EFFICACY_REDUCTION',
          'UNCERTAIN',
          'BOTH'
        )
      );
  END IF;
END $$;


-- ============================================================
-- PART B: BACKFILL — Map old severity_grade → risk_bucket
--         for the 11 pre-existing rows.
-- NOTE: This mapping is approximate. A clinical advisor should
--       review all rows where rule_key IS NULL post-migration.
-- ============================================================

UPDATE ref_clinical_interactions
SET risk_bucket = CASE severity_grade
  WHEN 'Life-Threatening' THEN 'ABSOLUTE_CONTRAINDICATION'
  WHEN 'High'             THEN 'STRONG_CAUTION'
  WHEN 'Moderate'         THEN 'CLINICIAN_REVIEW'
  WHEN 'Low'              THEN 'MONITOR_ONLY'
  ELSE                         'INSUFFICIENT_EVIDENCE'
END
WHERE risk_bucket IS NULL;


-- ============================================================
-- PART C: SEED — 25 validated interaction rules
--   Source: Psychedelic Drug Interaction Research.csv (RULE-001..025)
--   Conflict strategy: ON CONFLICT (substance_name, interactor_name)
--   DO UPDATE SET — safe on re-run, updates any existing stub rows.
-- ============================================================

INSERT INTO ref_clinical_interactions (
  substance_name,
  interactor_name,
  interactor_category,
  risk_level,
  severity_grade,
  clinical_description,
  mechanism,
  evidence_source,
  source_url,
  is_verified,
  risk_bucket,
  interaction_type,
  effect_direction,
  confidence,
  evidence_level,
  washout_note,
  screening_note,
  is_bidirectional,
  rule_key
) VALUES

-- RULE-001: Ibogaine + Methadone — ABSOLUTE_CONTRAINDICATION
('Ibogaine', 'Methadone', 'Opioids / Methadone', 5, 'Life-Threatening',
 'Torsades de Pointes, fatal arrhythmia risk from additive hERG channel blockade and CYP2D6 competition.',
 'Additive hERG channel blockade, CYP2D6 competition',
 'Case report, Mechanistic',
 'https://pmc.ncbi.nlm.nih.gov/articles/PMC4382526/',
 true,
 'ABSOLUTE_CONTRAINDICATION', 'TOXICITY_AMPLIFICATION', 'DANGER_INCREASE', 'HIGH', 'CASE_REPORT',
 NULL,
 'Absolute contraindication; strict ECG clearance required.',
 true, 'IBO-OPI-MET'),

-- RULE-002: Ayahuasca + Fluoxetine — ABSOLUTE_CONTRAINDICATION
('Ayahuasca', 'Fluoxetine', 'SSRIs', 5, 'Life-Threatening',
 'Severe to fatal serotonin syndrome from MAO-A inhibition combined with serotonin reuptake inhibition.',
 'MAO-A inhibition combined with serotonin reuptake inhibition',
 'Case report, Consensus Guideline',
 'https://templeofthewayoflight.org/resources/ayahuasca-medical-guidelines/',
 true,
 'ABSOLUTE_CONTRAINDICATION', 'PD_INTERACTION', 'DANGER_INCREASE', 'HIGH', 'CONSENSUS_GUIDELINE',
 'Requires 2-5 week washout before ayahuasca administration; minimum 5 weeks for fluoxetine.',
 'Requires 2-5 week washout before ayahuasca administration. Fluoxetine requires minimum 5 weeks due to long half-life.',
 true, 'AYA-SSRI-FLU'),

-- RULE-003: Psilocybin + Lithium — ABSOLUTE_CONTRAINDICATION
('Psilocybin', 'Lithium', 'Mood Stabilizer', 5, 'Life-Threatening',
 'Significant seizure risk (47% in observational data) from suspected synergistic excitatory neurotoxicity.',
 'Unknown; suspected synergistic excitatory neurotoxicity',
 'Observational, Case series',
 'https://pubmed.ncbi.nlm.nih.gov/34348413/',
 true,
 'ABSOLUTE_CONTRAINDICATION', 'PD_INTERACTION', 'DANGER_INCREASE', 'MODERATE', 'OBSERVATIONAL',
 NULL,
 'Contraindicate psilocybin if active lithium use. Lamotrigine appears safe and may be an alternative.',
 true, 'PSI-LITH-LIT'),

-- RULE-004: MDMA + Venlafaxine — STRONG_CAUTION
('MDMA', 'Venlafaxine', 'SNRIs', 4, 'High',
 'High risk of cardiovascular and serotonergic overload from competitive CYP2D6 inhibition and massive 5-HT release.',
 'Competitive CYP2D6 inhibition, massive 5-HT release',
 'Clinical trial, Case report',
 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9177763/',
 true,
 'STRONG_CAUTION', 'MIXED', 'DANGER_INCREASE', 'HIGH', 'CLINICAL_TRIAL',
 NULL,
 'High risk of cardiovascular and serotonergic overload. Requires clinical review and washout planning.',
 true, 'MDMA-SNRI-VEN'),

-- RULE-005: Ketamine + Alprazolam — STRONG_CAUTION
('Ketamine', 'Alprazolam', 'CNS Depressants', 4, 'High',
 'Sedation, coma, and respiratory depression risk from synergistic CNS depression at GABA and opioid receptors.',
 'Synergistic CNS depression at GABA and opioid receptors',
 'FDA Label, REMS',
 'https://www.accessdata.fda.gov/drugsatfda_docs/label/2025/211243s016lbl.pdf',
 true,
 'STRONG_CAUTION', 'PD_INTERACTION', 'DANGER_INCREASE', 'HIGH', 'FDA_LABEL',
 NULL,
 'Avoid concomitant use or adjust dosing heavily. FDA REMS protocols mandate monitoring.',
 true, 'KET-CNS-ALP'),

-- RULE-006: LSD + Quetiapine — POSSIBLE_EFFICACY_BLUNTING
('LSD', 'Quetiapine', 'Antipsychotics', 2, 'Moderate',
 'Efficacy blunting and premature termination of therapeutic session from 5-HT2A and D2 antagonism. Risk of over-sedation and hypotension.',
 '5-HT2A and D2 antagonism',
 'Clinical trial, Observational',
 'https://bmjgroup.com/potentially-harmful-trip-killers-to-cut-short-bad-drug-trips-emerging-concern-warn-doctors/',
 true,
 'POSSIBLE_EFFICACY_BLUNTING', 'EFFICACY_BLUNTING', 'EFFICACY_REDUCTION', 'HIGH', 'CLINICAL_TRIAL',
 NULL,
 'Used recreationally as ''trip killers''. May prematurely terminate therapeutic session. Risk of over-sedation and hypotension.',
 true, 'LSD-ANTIP-QUE'),

-- RULE-007: Psilocybin + Escitalopram — POSSIBLE_EFFICACY_BLUNTING
('Psilocybin', 'Escitalopram', 'SSRIs', 2, 'Moderate',
 'Efficacy blunting and attenuated subjective effects from 5-HT2A receptor downregulation. Does not cause physical danger.',
 '5-HT2A receptor downregulation from chronic SSRI use',
 'Clinical trial, Meta-analysis',
 'https://pmc.ncbi.nlm.nih.gov/articles/PMC12572353/',
 true,
 'POSSIBLE_EFFICACY_BLUNTING', 'EFFICACY_BLUNTING', 'EFFICACY_REDUCTION', 'HIGH', 'CLINICAL_TRIAL',
 'Requires clinical decision on tapering vs. accepting blunting for ongoing SSRIs.',
 'Does not cause physical danger. Requires clinical decision on tapering vs. accepting blunting. Risk of serotonin syndrome is vastly overstated.',
 true, 'PSI-SSRI-ESC'),

-- RULE-008: MDMA + Dextromethorphan — ABSOLUTE_CONTRAINDICATION
('MDMA', 'Dextromethorphan', 'OTC Antitussives', 5, 'Life-Threatening',
 'Severe to fatal serotonin toxicity from dual 5-HT reuptake inhibition and releasing agent action.',
 'Dual 5-HT reuptake inhibition and releasing agent action',
 'Case report, Mechanistic',
 'https://pmc.ncbi.nlm.nih.gov/articles/PMC12264311/',
 true,
 'ABSOLUTE_CONTRAINDICATION', 'PD_INTERACTION', 'DANGER_INCREASE', 'HIGH', 'CASE_REPORT',
 NULL,
 'Absolute contraindication. High risk among recreational and self-medicating users. Includes OTC cough medicines.',
 true, 'MDMA-OTC-DXM'),

-- RULE-009: 5-MeO-DMT + Harmaline — ABSOLUTE_CONTRAINDICATION
('5-MeO-DMT', 'Harmaline', 'MAOIs', 5, 'Life-Threatening',
 'Fatalities and severe toxicity reported. Inhibition of 5-MeO-DMT deamination leads to serotonin syndrome and prolonged systemic exposure.',
 'Inhibition of deamination metabolism of 5-MeO-DMT',
 'Case report, PK data',
 'https://pdfs.semanticscholar.org/7c98/ab951d1eeac74b8cd5b207f1af31188e1afe.pdf',
 true,
 'ABSOLUTE_CONTRAINDICATION', 'PK_INTERACTION', 'DANGER_INCREASE', 'HIGH', 'CASE_REPORT',
 NULL,
 'Fatalities and severe toxicity reported when combined with harmala alkaloids. Absolute contraindication.',
 true, 'DMT-MAOI-HAR'),

-- RULE-010: Ketamine + Levothyroxine — CLINICIAN_REVIEW
('Ketamine', 'Levothyroxine', 'Thyroid Meds', 3, 'Moderate',
 'Hypertension and tachycardia risk from unknown sympathetic synergy. Hyperthyroid patients at elevated cardiovascular risk.',
 'Unknown sympathetic synergy',
 'Case report',
 NULL,
 true,
 'CLINICIAN_REVIEW', 'PHYSIOLOGICAL_SHIFT', 'DANGER_INCREASE', 'LOW', 'CASE_REPORT',
 NULL,
 'Monitor BP and HR carefully in hyperthyroid or supplemented patients.',
 true, 'KET-THYR-LEV'),

-- RULE-011: Ketamine + Insulin — CLINICIAN_REVIEW
('Ketamine', 'Insulin', 'Diabetes Meds', 3, 'Moderate',
 'Glycemic volatility (hyper/hypoglycemia) from sympathetic α2 activation increasing epinephrine and altering gluconeogenesis.',
 'Sympathetic α2 activation increasing epinephrine, altering gluconeogenesis',
 'Preclinical, Case report',
 'https://pmc.ncbi.nlm.nih.gov/articles/PMC12845205/',
 true,
 'CLINICIAN_REVIEW', 'PHYSIOLOGICAL_SHIFT', 'BOTH', 'LOW', 'PRECLINICAL',
 NULL,
 'Monitor blood glucose before, during, and after infusion. Requires intensive bedside blood glucose monitoring.',
 true, 'KET-DIAB-INS'),

-- RULE-012: LSD + Warfarin — MONITOR_ONLY
('LSD', 'Warfarin', 'Anticoagulants', 1, 'Low',
 'Theoretical bleeding risk from peripheral 5-HT2A antagonism on platelets. Largely theoretical with low evidence.',
 'Peripheral 5-HT2A antagonism on platelets',
 'Mechanistic theory only',
 NULL,
 true,
 'MONITOR_ONLY', 'PD_INTERACTION', 'UNCERTAIN', 'LOW', 'MECHANISTIC',
 NULL,
 'Largely theoretical; monitor INR but not an absolute contraindication.',
 true, 'LSD-ANTI-WAR'),

-- RULE-013: MDMA + Propranolol — CLINICIAN_REVIEW
('MDMA', 'Propranolol', 'Beta Blockers', 3, 'Moderate',
 'Beta blockade fails to prevent MDMA-induced hypertension; may worsen pressor response via unopposed alpha-receptor activation.',
 'Unopposed alpha-receptor activation',
 'Clinical trial',
 NULL,
 true,
 'CLINICIAN_REVIEW', 'PHYSIOLOGICAL_SHIFT', 'DANGER_INCREASE', 'MODERATE', 'CLINICAL_TRIAL',
 NULL,
 'Does not reduce overall cardiovascular risk of MDMA; may worsen pressor response. Clinical review required.',
 true, 'MDMA-BETA-PRO'),

-- RULE-014: Ketamine + Amphetamine — STRONG_CAUTION
('Ketamine', 'Amphetamine', 'Stimulants', 4, 'High',
 'Severe hypertension and tachycardia risk from additive sympathomimetic effects.',
 'Additive sympathomimetic effects',
 'FDA Label',
 'https://www.accessdata.fda.gov/drugsatfda_docs/label/2025/211243s016lbl.pdf',
 true,
 'STRONG_CAUTION', 'TOXICITY_AMPLIFICATION', 'DANGER_INCREASE', 'HIGH', 'FDA_LABEL',
 NULL,
 'Monitor blood pressure rigorously; consider holding stimulant doses on ketamine infusion day.',
 true, 'KET-STIM-AMP'),

-- RULE-015: Ayahuasca + Cocaine — ABSOLUTE_CONTRAINDICATION
('Ayahuasca', 'Cocaine', 'Stimulants / Illicit', 5, 'Life-Threatening',
 'Lethal cardiovascular load: hypertensive crisis, stroke, and myocardial infarction from MAO inhibition plus massive catecholamine release.',
 'MAO inhibition + massive catecholamine release',
 'Mechanistic, Observational',
 NULL,
 true,
 'ABSOLUTE_CONTRAINDICATION', 'TOXICITY_AMPLIFICATION', 'DANGER_INCREASE', 'HIGH', 'OBSERVATIONAL',
 'Abstain from cocaine and amphetamines for minimum 24 hours before ayahuasca.',
 'Absolute contraindication due to lethal cardiovascular load. Includes cocaine, amphetamines, and all sympathomimetic stimulants.',
 true, 'AYA-STIM-COC'),

-- RULE-016: Mescaline + Fluoxetine — POSSIBLE_EFFICACY_BLUNTING
('Mescaline', 'Fluoxetine', 'SSRIs', 2, 'Moderate',
 'Efficacy blunting and attenuated subjective effects similar to other classic psychedelics from 5-HT2A receptor competition.',
 'Receptor competition at 5-HT2A',
 'Observational',
 NULL,
 true,
 'POSSIBLE_EFFICACY_BLUNTING', 'EFFICACY_BLUNTING', 'EFFICACY_REDUCTION', 'MODERATE', 'OBSERVATIONAL',
 'Requires clinical decision on tapering vs. accepting blunted session.',
 'Likely blunts subjective effects similar to other classic psychedelics. Clinical judgment on tapering required.',
 true, 'MES-SSRI-FLU'),

-- RULE-017: MDMA + Bupropion — STRONG_CAUTION
('MDMA', 'Bupropion', 'Atypical Antidepressants', 4, 'High',
 'Exponential increase in MDMA plasma levels and seizure risk from strong CYP2D6 inhibition.',
 'Strong CYP2D6 inhibition',
 'Pharmacokinetic data',
 NULL,
 true,
 'STRONG_CAUTION', 'PK_INTERACTION', 'DANGER_INCREASE', 'HIGH', 'MECHANISTIC',
 'Bupropion washout recommended before MDMA-assisted therapy.',
 'High risk of toxicity amplification. Do not co-administer. CYP2D6 inhibition dramatically raises MDMA exposure.',
 true, 'MDMA-ATYD-BUP'),

-- RULE-018: Psilocybin + Oxycodone — MONITOR_ONLY
('Psilocybin', 'Oxycodone', 'Opioids', 1, 'Low',
 'No established contraindication. No direct pharmacodynamic overlap. Acute pain may alter subjective setting.',
 'No direct pharmacodynamic overlap',
 'Observational',
 NULL,
 true,
 'MONITOR_ONLY', 'UNKNOWN', 'UNCERTAIN', 'MODERATE', 'OBSERVATIONAL',
 NULL,
 'No established contraindication, though acute pain or dependence may alter subjective setting. Monitor.',
 true, 'PSI-OPI-OXY'),

-- RULE-019: LSD + Diazepam — POSSIBLE_EFFICACY_BLUNTING
('LSD', 'Diazepam', 'Benzodiazepines', 2, 'Moderate',
 'Mild efficacy blunting and anxiety reduction from GABA-A positive allosteric modulation. Frequently used as a rescue medication.',
 'GABA-A positive allosteric modulation',
 'Observational, Guideline',
 NULL,
 true,
 'POSSIBLE_EFFICACY_BLUNTING', 'EFFICACY_BLUNTING', 'EFFICACY_REDUCTION', 'HIGH', 'OBSERVATIONAL',
 NULL,
 'Frequently used as rescue medication for challenging experiences. May prematurely terminate therapeutic session.',
 true, 'LSD-BZD-DIA'),

-- RULE-020: Ibogaine + Haloperidol — ABSOLUTE_CONTRAINDICATION
('Ibogaine', 'Haloperidol', 'Antipsychotics', 5, 'Life-Threatening',
 'Torsades de Pointes and fatal arrhythmia from additive QT prolongation.',
 'Additive QT prolongation',
 'Clinical Guideline',
 NULL,
 true,
 'ABSOLUTE_CONTRAINDICATION', 'TOXICITY_AMPLIFICATION', 'DANGER_INCREASE', 'HIGH', 'CONSENSUS_GUIDELINE',
 NULL,
 'Absolute contraindication due to compounded cardiac risk. All QT-prolonging antipsychotics are contraindicated with ibogaine.',
 true, 'IBO-ANTIP-HAL'),

-- RULE-021: Ayahuasca + Pseudoephedrine — ABSOLUTE_CONTRAINDICATION
('Ayahuasca', 'Pseudoephedrine', 'Decongestants', 5, 'Life-Threatening',
 'Hypertensive crisis from MAO inhibition combined with sympathomimetic stimulation. Includes OTC cold medicines.',
 'MAO inhibition + sympathomimetic',
 'Mechanistic, Consensus',
 NULL,
 true,
 'ABSOLUTE_CONTRAINDICATION', 'TOXICITY_AMPLIFICATION', 'DANGER_INCREASE', 'HIGH', 'CONSENSUS_GUIDELINE',
 'Abstain from decongestants with sympathomimetic properties for minimum 24 hours.',
 'High risk of OTC medication interaction. Absolute contraindication. Includes many OTC cold and flu medicines.',
 true, 'AYA-DEC-PSE'),

-- RULE-022: MDMA + Tramadol — ABSOLUTE_CONTRAINDICATION
('MDMA', 'Tramadol', 'Opioids', 5, 'Life-Threatening',
 'Severe serotonin syndrome and seizure risk. Tramadol is uniquely dangerous among opioids due to its SNRI properties.',
 'Tramadol SNRI properties + MDMA 5-HT release',
 'Case report, Mechanistic',
 NULL,
 true,
 'ABSOLUTE_CONTRAINDICATION', 'TOXICITY_AMPLIFICATION', 'DANGER_INCREASE', 'HIGH', 'CASE_REPORT',
 'Tramadol washout required. Minimum 2-3 half-lives.',
 'Absolute contraindication. Tramadol is uniquely dangerous among opioids here due to its serotonergic activity.',
 true, 'MDMA-OPI-TRA'),

-- RULE-023: Psilocybin + Ibuprofen — MONITOR_ONLY
('Psilocybin', 'Ibuprofen', 'NSAIDs', 1, 'Low',
 'No pathway overlap. Safe for co-administration based on pharmacokinetic logic.',
 'No pathway overlap',
 'Pharmacokinetic logic',
 NULL,
 true,
 'MONITOR_ONLY', 'UNKNOWN', 'UNCERTAIN', 'HIGH', 'MECHANISTIC',
 NULL,
 'Safe for co-administration. No established interaction pathway.',
 true, 'PSI-NSAID-IBU'),

-- RULE-024: 5-MeO-DMT + Duloxetine — STRONG_CAUTION
('5-MeO-DMT', 'Duloxetine', 'SNRIs', 4, 'High',
 'Serotonin syndrome risk (lower than MAOIs) and possible efficacy blunting from serotonin reuptake inhibition. Sparse evidence.',
 'Serotonin reuptake inhibition',
 'Mechanistic theory',
 NULL,
 true,
 'STRONG_CAUTION', 'TOXICITY_AMPLIFICATION', 'DANGER_INCREASE', 'LOW', 'MECHANISTIC',
 'Sparse evidence, but clinical caution dictates washout review.',
 'Sparse evidence, but clinical caution dictates strong contraindication review. Washout recommended.',
 true, 'DMT-SNRI-DUL'),

-- RULE-025: Ketamine + Semaglutide — CLINICIAN_REVIEW
('Ketamine', 'Semaglutide', 'GLP-1 Agonists', 3, 'Moderate',
 'Glycemic shift and unknown PK interaction from altered gastric emptying and neuroinflammation modulation.',
 'Altered gastric emptying, neuroinflammation modulation',
 'Preclinical, Emerging',
 NULL,
 true,
 'CLINICIAN_REVIEW', 'PHYSIOLOGICAL_SHIFT', 'BOTH', 'LOW', 'PRECLINICAL',
 NULL,
 'Monitor glucose; risk of altered absorption of oral medications. Emerging interaction, evidence limited.',
 true, 'KET-GLP1-SEM')

ON CONFLICT (substance_name, interactor_name) DO UPDATE SET
  risk_bucket      = EXCLUDED.risk_bucket,
  interaction_type = EXCLUDED.interaction_type,
  effect_direction = EXCLUDED.effect_direction,
  confidence       = EXCLUDED.confidence,
  evidence_level   = EXCLUDED.evidence_level,
  washout_note     = EXCLUDED.washout_note,
  screening_note   = EXCLUDED.screening_note,
  is_bidirectional = EXCLUDED.is_bidirectional,
  rule_key         = EXCLUDED.rule_key,
  severity_grade   = EXCLUDED.severity_grade,
  risk_level       = EXCLUDED.risk_level,
  clinical_description = EXCLUDED.clinical_description,
  mechanism        = EXCLUDED.mechanism,
  evidence_source  = EXCLUDED.evidence_source,
  source_url       = EXCLUDED.source_url,
  is_verified      = EXCLUDED.is_verified;


-- ============================================================
-- VERIFICATION QUERIES (run after execution to confirm success)
-- ============================================================
-- 1. Column count (expect 22):
--    SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'ref_clinical_interactions';
--
-- 2. Row counts by risk_bucket:
--    SELECT risk_bucket, COUNT(*) FROM ref_clinical_interactions GROUP BY risk_bucket ORDER BY risk_bucket;
--
-- 3. Duplicate rule_key check (expect 0 rows):
--    SELECT rule_key, COUNT(*) FROM ref_clinical_interactions WHERE rule_key IS NOT NULL GROUP BY rule_key HAVING COUNT(*) > 1;
--
-- 4. Old rows needing clinical review (NULL rule_key = pre-existing rows):
--    SELECT interaction_id, substance_name, interactor_name, severity_grade, risk_bucket FROM ref_clinical_interactions WHERE rule_key IS NULL;
-- ============================================================
