-- ============================================================
-- PPN Portal — Drug Interaction Checker Phase 2 Migration
-- Created: 2026-03-27
-- WO: WO-705
-- Source: Zepbound-Propranolo-Pristiq-research-report.md
--         (Dr. Allen clinical research request)
--
-- Pre-Flight Schema Verification (completed 2026-03-27):
--   ✅ ref_clinical_interactions — EXISTS (queried by InteractionChecker.tsx)
--   ✅ ref_medications — EXISTS (queried by InteractionChecker.tsx for dropdown)
--   ✅ 'Propranolol' — already in ref_medications (exact match confirmed)
--   ⚠️  'Zepbound (tirzepatide)' — NOT in ref_medications → added in PART A
--   ⚠️  'Pristiq (desvenlafaxine)' — NOT in ref_medications → added in PART A
--   ✅ interactor_name match rule: must exactly match ref_medications.medication_name
--   ✅ 6 new flag columns — NOT in ref_clinical_interactions → added in PART B
--   ✅ All existing CHECK constraints on risk_bucket, confidence, etc. — compatible
--   ✅ RLS on ref_medications: SELECT for authenticated; INSERT for network_admin
--   ✅ RLS on ref_clinical_interactions: auto-inherited for new columns
--
-- Scope:
--   PART A: Add Zepbound + Pristiq to ref_medications (prerequisite)
--   PART B: 6 additive flag columns to ref_clinical_interactions
--   PART C: Seed 30 validated interaction records
--
-- SAFETY:
--   All ADD COLUMN uses IF NOT EXISTS — safe to re-run
--   ON CONFLICT (medication_name) DO NOTHING — safe to re-run
--   No columns dropped. No types changed. No RLS policy changes.
--   ON CONFLICT (substance_name, interactor_name) DO UPDATE — idempotent
--
-- USER: Run manually in Supabase SQL Editor.
-- ============================================================


-- ============================================================
-- PART A: PREREQUISITE — Add new medications to ref_medications
--
-- The InteractionChecker sources its medication picker from
-- ref_medications.medication_name. The interactor_name field in
-- ref_clinical_interactions MUST exactly match these strings,
-- or lookups will silently miss.
--
-- Propranolol is already seeded (confirmed in migration 004).
-- Zepbound and Pristiq are new and must exist here first.
-- ============================================================

INSERT INTO public.ref_medications (medication_name, medication_category)
VALUES
  ('Zepbound (tirzepatide)',       'GLP-1/GIP Agonist'),
  ('Pristiq (desvenlafaxine)',     'SSRI/SNRI')
ON CONFLICT (medication_name) DO NOTHING;


-- ============================================================
-- PART B: SCHEMA MIGRATION — 6 additive columns on ref_clinical_interactions
-- These supplemental flag fields support route-aware and
-- mechanism-aware screening logic from the research report.
-- ============================================================

ALTER TABLE ref_clinical_interactions
  ADD COLUMN IF NOT EXISTS route_context           text,
  ADD COLUMN IF NOT EXISTS timing_context          text,
  ADD COLUMN IF NOT EXISTS onset_shift_flag        text,
  ADD COLUMN IF NOT EXISTS gi_hydration_risk_flag  text,
  ADD COLUMN IF NOT EXISTS vitals_masking_flag     text,
  ADD COLUMN IF NOT EXISTS maoi_exposure_flag      boolean DEFAULT false;

-- CHECK constraints (idempotent DO blocks)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'ck_rci_onset_shift_flag'
      AND conrelid = 'ref_clinical_interactions'::regclass
  ) THEN
    ALTER TABLE ref_clinical_interactions
      ADD CONSTRAINT ck_rci_onset_shift_flag CHECK (
        onset_shift_flag IS NULL OR onset_shift_flag IN (
          'none', 'possible_delay', 'likely_delay'
        )
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'ck_rci_gi_hydration_risk_flag'
      AND conrelid = 'ref_clinical_interactions'::regclass
  ) THEN
    ALTER TABLE ref_clinical_interactions
      ADD CONSTRAINT ck_rci_gi_hydration_risk_flag CHECK (
        gi_hydration_risk_flag IS NULL OR gi_hydration_risk_flag IN (
          'none', 'possible', 'high'
        )
      );
  END IF;
END $$;


-- ============================================================
-- PART C: SEED — 30 interaction records
--
-- interactor_name values MUST match ref_medications.medication_name
-- exactly. Verified against migration 004 seed data:
--   'Propranolol'              — exact match in 004
--   'Zepbound (tirzepatide)'   — added in PART A above
--   'Pristiq (desvenlafaxine)' — added in PART A above
--
-- Conflict strategy: ON CONFLICT (substance_name, interactor_name)
-- DO UPDATE SET — safe on re-run; enriches Phase 1 RULE-013
-- (MDMA + Propranolol) with updated notes and new flag columns.
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
  rule_key,
  route_context,
  timing_context,
  onset_shift_flag,
  gi_hydration_risk_flag,
  vitals_masking_flag,
  maoi_exposure_flag
) VALUES

-- ══════════════════════════════════════════════════════════════
-- BLOCK 1: ZEPBOUND (tirzepatide) × 10 Psychedelics
-- ══════════════════════════════════════════════════════════════

-- INT-PSI-TIRZ-001: Psilocybin + Zepbound
('Psilocybin', 'Zepbound (tirzepatide)', 'GLP-1/GIP Agonist', 3, 'Moderate',
 'Demonstrated delayed gastric emptying with potential impact on oral psilocybin absorption. Delayed or variable onset increases risk of premature non-response conclusion and dose stacking. Nausea overlap may worsen tolerability.',
 'Demonstrated delayed gastric emptying (FDA label); reduced acetaminophen Cmax/delayed Tmax after 5 mg dose. Psychedelic-specific PK effect is mechanistic only.',
 'FDA label (Zepbound 2025) + mechanistic',
 NULL, true,
 'CLINICIAN_REVIEW', 'PHYSIOLOGICAL_SHIFT', 'UNCERTAIN', 'LOW', 'MECHANISTIC',
 NULL,
 'Flag oral absorption delay possible during Zepbound dose escalation. Avoid early redosing based on delayed onset. Screen for active nausea/vomiting.',
 true, 'PSI-TIRZ-001',
 'oral', 'especially_during_dose_escalation', 'likely_delay', 'possible', NULL, false),

-- INT-LSD-TIRZ-001: LSD + Zepbound
('LSD', 'Zepbound (tirzepatide)', 'GLP-1/GIP Agonist', 3, 'Moderate',
 'Delayed gastric emptying can shift LSD onset timing. Particularly high-leverage for LSD due to its long session duration — misinterpretation of non-response early in session magnifies dose-stacking risk.',
 'Demonstrated delayed gastric emptying (FDA label). LSD-specific PK shift is mechanistic only. Long duration makes early timing errors high-consequence.',
 'FDA label (Zepbound 2025) + mechanistic',
 NULL, true,
 'CLINICIAN_REVIEW', 'PHYSIOLOGICAL_SHIFT', 'UNCERTAIN', 'LOW', 'MECHANISTIC',
 NULL,
 'Extra conservative for LSD — long session duration magnifies early timing errors. Avoid redosing based on absent early effects. Screen for GI tolerance.',
 true, 'LSD-TIRZ-001',
 'oral', 'especially_during_dose_escalation', 'likely_delay', 'possible', NULL, false),

-- INT-MDMA-TIRZ-001: MDMA + Zepbound
('MDMA', 'Zepbound (tirzepatide)', 'GLP-1/GIP Agonist', 3, 'Moderate',
 'Delayed oral absorption may encourage premature redosing. Zepbound-related nausea/dehydration and AKI warning adds to physiologic strain in an already cardiovascularly demanding session.',
 'Demonstrated delayed gastric emptying and altered peak concentrations for oral meds. Zepbound GI adverse events and dehydration-linked AKI warning are label-demonstrated.',
 'FDA label (Zepbound 2025) + mechanistic',
 NULL, true,
 'CLINICIAN_REVIEW', 'PHYSIOLOGICAL_SHIFT', 'UNCERTAIN', 'LOW', 'MECHANISTIC',
 NULL,
 'Do not redose based on delayed onset. Screen for GI intolerance and dehydration risk. Hydration plan must be documented.',
 true, 'MDMA-TIRZ-001',
 'oral', 'especially_during_dose_escalation', 'possible_delay', 'possible', NULL, false),

-- INT-KET-TIRZ-001: Ketamine + Zepbound
('Ketamine', 'Zepbound (tirzepatide)', 'GLP-1/GIP Agonist', 1, 'Low',
 'No direct pharmacokinetic interaction for IV/IM ketamine. Main concern is additive nausea/vomiting burden and dehydration. Ketamine label highlights hemodynamic instability; dehydration can worsen post-dose hypotension.',
 'No plausible PK DDI for parenteral ketamine. Zepbound nausea/vomiting/diarrhea and dehydration-linked AKI are label-demonstrated.',
 'FDA label (Zepbound 2025) + FDA label (Ketalar) + mechanistic',
 NULL, true,
 'MONITOR_ONLY', 'PHYSIOLOGICAL_SHIFT', 'UNCERTAIN', 'LOW', 'MECHANISTIC',
 NULL,
 'Ensure hydration plan and emesis precautions documented. Not a drug-level contraindication. Monitor tolerability and vitals.',
 true, 'KET-TIRZ-001',
 'IV/IM', 'any', 'none', 'possible', NULL, false),

-- INT-ESK-TIRZ-001: Esketamine + Zepbound
('Esketamine', 'Zepbound (tirzepatide)', 'GLP-1/GIP Agonist', 1, 'Low',
 'Both medications commonly cause nausea/vomiting. Zepbound dehydration warning adds tolerability concern around supervised dosing visits. Intranasal route means no oral absorption delay concern.',
 'No direct DDI evidence. Esketamine is intranasal — oral absorption delay not applicable. Both cause nausea/GI effects.',
 'FDA label (Zepbound 2025) + FDA label (Spravato) + mechanistic',
 NULL, true,
 'MONITOR_ONLY', 'PHYSIOLOGICAL_SHIFT', 'UNCERTAIN', 'LOW', 'MECHANISTIC',
 NULL,
 'Plan for nausea/emesis and hydration monitoring around supervised dosing visits. Not a pharmacological contraindication.',
 true, 'ESK-TIRZ-001',
 'intranasal', 'any', 'none', 'possible', NULL, false),

-- INT-IBO-TIRZ-001: Ibogaine + Zepbound — STRONG_CAUTION
('Ibogaine', 'Zepbound (tirzepatide)', 'GLP-1/GIP Agonist', 4, 'High',
 'Ibogaine is associated with marked QTc prolongation (>500 ms in safety studies). Zepbound causes vomiting, diarrhea, and dehydration-linked AKI — all of which can cause electrolyte derangements that amplify QT risk. Dehydration from any source is a recognized torsades risk multiplier.',
 'Ibogaine QTc prolongation is observational (Knuijver 2021). Zepbound GI adverse events and dehydration-linked AKI are label-demonstrated. Electrolyte disturbance mechanism is guideline-supported.',
 'Knuijver 2021 QTc safety study + FDA label (Zepbound 2025) + mechanistic',
 NULL, true,
 'STRONG_CAUTION', 'TOXICITY_AMPLIFICATION', 'DANGER_INCREASE', 'LOW', 'OBSERVATIONAL',
 NULL,
 'Strong caution: treat active vomiting, diarrhea, or dehydration as a major QTc risk multiplier for ibogaine. ECG protocol and electrolyte status required.',
 true, 'IBO-TIRZ-001',
 'oral', 'any', 'possible_delay', 'high', NULL, false),

-- INT-DMT-TIRZ-001: DMT (inhaled) + Zepbound — INSUFFICIENT_EVIDENCE
('DMT', 'Zepbound (tirzepatide)', 'GLP-1/GIP Agonist', 1, 'Low',
 'No plausible pharmacokinetic interaction for inhaled DMT. Zepbound primarily affects oral absorption and GI tolerability. Monitor for background nausea or hydration confounds only.',
 'No direct DDI evidence. DMT is inhaled — Zepbound gastric emptying effect not applicable.',
 'FDA label (Zepbound 2025) + mechanistic',
 NULL, true,
 'INSUFFICIENT_EVIDENCE', 'UNKNOWN', 'UNCERTAIN', 'LOW', 'MECHANISTIC',
 NULL,
 'Inhaled route bypasses oral absorption concern. Monitor tolerability and hydration only. No clinically meaningful drug-level interaction expected.',
 true, 'DMT-TIRZ-001',
 'inhaled', 'any', 'none', 'none', NULL, false),

-- INT-5MEO-TIRZ-001: 5-MeO-DMT + Zepbound — INSUFFICIENT_EVIDENCE
('5-MeO-DMT', 'Zepbound (tirzepatide)', 'GLP-1/GIP Agonist', 1, 'Low',
 'No plausible pharmacokinetic interaction for inhaled 5-MeO-DMT. No clinically meaningful drug interaction expected beyond background GI or dehydration confounds.',
 'No direct DDI evidence. 5-MeO-DMT is typically inhaled — Zepbound gastric emptying effect not applicable.',
 'FDA label (Zepbound 2025) + mechanistic',
 NULL, true,
 'INSUFFICIENT_EVIDENCE', 'UNKNOWN', 'UNCERTAIN', 'LOW', 'MECHANISTIC',
 NULL,
 'Monitor only unless patient has severe GI intolerance or dehydration from Zepbound. No drug-level interaction.',
 true, '5MEO-TIRZ-001',
 'inhaled', 'any', 'none', 'none', NULL, false),

-- INT-MESC-TIRZ-001: Mescaline + Zepbound
('Mescaline', 'Zepbound (tirzepatide)', 'GLP-1/GIP Agonist', 3, 'Moderate',
 'Mescaline commonly causes nausea. Zepbound''s delayed gastric emptying and high nausea/vomiting/diarrhea rates create additive GI burden and timing uncertainty. Dehydration risk is compounded.',
 'Label-demonstrated delayed gastric emptying and GI adverse events. Mescaline emetogenicity is established. Synergistic GI burden is mechanistic inference.',
 'FDA label (Zepbound 2025) + mechanistic',
 NULL, true,
 'CLINICIAN_REVIEW', 'PHYSIOLOGICAL_SHIFT', 'UNCERTAIN', 'LOW', 'MECHANISTIC',
 NULL,
 'Treat Zepbound as an emesis and dehydration risk multiplier for mescaline. Onset timing may be delayed. Dehydration plan required.',
 true, 'MESC-TIRZ-001',
 'oral', 'especially_during_dose_escalation', 'likely_delay', 'high', NULL, false),

-- INT-AYA-TIRZ-001: Ayahuasca + Zepbound — STRONG_CAUTION
('Ayahuasca', 'Zepbound (tirzepatide)', 'GLP-1/GIP Agonist', 4, 'High',
 'Ayahuasca commonly causes vomiting (the "purge"). Zepbound''s nausea/vomiting/diarrhea and dehydration-linked AKI warning create severe additive risk. Electrolyte derangements could compound cardiovascular vulnerability.',
 'Label-demonstrated Zepbound GI adverse events and dehydration-linked AKI. Additive emesis burden with ayahuasca is mechanistic.',
 'FDA label (Zepbound 2025) + mechanistic',
 NULL, true,
 'STRONG_CAUTION', 'TOXICITY_AMPLIFICATION', 'DANGER_INCREASE', 'LOW', 'MECHANISTIC',
 NULL,
 'Strong caution: treat dehydration and electrolyte disturbance as a safety blocker for ayahuasca sessions. Active GI intolerance is a session go/no-go factor.',
 true, 'AYA-TIRZ-001',
 'oral', 'any', 'possible_delay', 'high', NULL, false),


-- ══════════════════════════════════════════════════════════════
-- BLOCK 2: PROPRANOLOL × 10 Psychedelics
-- interactor_name = 'Propranolol' (confirmed in migration 004)
-- ══════════════════════════════════════════════════════════════

-- INT-PSI-PROP-001: Psilocybin + Propranolol
('Psilocybin', 'Propranolol', 'Cardiovascular', 1, 'Low',
 'Theoretical: beta blockade may blunt heart rate and somatic anxiety during psilocybin sessions. Propranolol contraindications (asthma, bradycardia, AV block) must be screened. No direct psilocybin-propranolol studies found.',
 'Beta-adrenergic blockade reduces HR and adrenergic symptoms. Psychedelic-specific effect is mechanistic only.',
 'FDA label (Inderal) + mechanistic',
 NULL, true,
 'MONITOR_ONLY', 'PHYSIOLOGICAL_SHIFT', 'UNCERTAIN', 'LOW', 'MECHANISTIC',
 NULL,
 'Monitor vitals. Do not assume propranolol makes the session cardio-safe. Screen for asthma, bradycardia, AV block.',
 true, 'PSI-PROP-001',
 'oral', 'any', 'none', 'none', 'possible_masked_tachycardia', false),

-- INT-LSD-PROP-001: LSD + Propranolol
('LSD', 'Propranolol', 'Cardiovascular', 1, 'Low',
 'A historical clinical report (Lancet 1971) describes propranolol use for LSD-induced anxiety. Evidence is sparse. Bradycardia and bronchospasm risk from propranolol apply. Not appropriate as routine premedication.',
 'Adrenergic symptom reduction via beta blockade. Case-report level evidence only.',
 'Linken 1971 Lancet (PMID 4108099) + FDA label (Inderal)',
 'https://pubmed.ncbi.nlm.nih.gov/4108099/', true,
 'MONITOR_ONLY', 'PHYSIOLOGICAL_SHIFT', 'UNCERTAIN', 'LOW', 'CASE_REPORT',
 NULL,
 'Allow only as clinician-directed rescue or support — not routine premedication. Screen asthma and bradycardia.',
 true, 'LSD-PROP-001',
 'oral', 'any', 'none', 'none', 'possible_masked_tachycardia', false),

-- INT-MDMA-PROP-001: MDMA + Propranolol — enriches RULE-013 from Phase 1
('MDMA', 'Propranolol', 'Cardiovascular', 3, 'Moderate',
 'Beta blockade (demonstrated with pindolol) prevents MDMA-induced tachycardia but fails to prevent BP elevation. MDMA is a potent mechanism-based CYP2D6 inhibitor; propranolol is a CYP2D6 substrate — plausible increase in propranolol exposure raises bradycardia and hypotension risk during recovery.',
 'Human beta-blocker trial (pindolol): HR blunted, MAP rise persists. MDMA mechanism-based CYP2D6 inhibition demonstrated in humans (Yubero-Lahoz 2011). Propranolol CYP2D6 substrate per FDA label.',
 'Hysek 2010 pindolol-MDMA trial; Yubero-Lahoz 2011 CYP2D6; Inderal label',
 NULL, true,
 'CLINICIAN_REVIEW', 'MIXED', 'DANGER_INCREASE', 'MODERATE', 'CLINICAL_TRIAL',
 NULL,
 'Clinician review required. Beta-blockade does not reduce cardiovascular risk of MDMA — may worsen pressor response via unopposed alpha activation. Monitor BP closely.',
 true, 'MDMA-BETA-PRO',
 'oral', 'any', 'none', 'none', 'masked_tachycardia_confirmed', false),

-- INT-KET-PROP-001: Ketamine + Propranolol
('Ketamine', 'Propranolol', 'Cardiovascular', 1, 'Low',
 'Ketamine has variable hemodynamic effects. Propranolol lowers HR and can cause bradycardia and hypotension. No direct pairing studies found.',
 'Ketamine hemodynamic variability per FDA label. Propranolol label beta-blockade effects. No direct pairing data.',
 'FDA label (Ketalar) + FDA label (Inderal) + mechanistic',
 NULL, true,
 'MONITOR_ONLY', 'PHYSIOLOGICAL_SHIFT', 'UNCERTAIN', 'LOW', 'MECHANISTIC',
 NULL,
 'Monitor BP and HR closely. Screen for cardiac conduction disease.',
 true, 'KET-PROP-001',
 'IV/IM', 'any', 'none', 'none', 'possible_masked_tachycardia', false),

-- INT-ESK-PROP-001: Esketamine + Propranolol
('Esketamine', 'Propranolol', 'Cardiovascular', 1, 'Low',
 'Esketamine can transiently increase BP. Propranolol may blunt HR response while BP elevation persists. Risk of hypotension or bradycardia during recovery.',
 'Esketamine transient BP increase per FDA label (Spravato). Propranolol beta-blockade per label.',
 'FDA label (Spravato) + FDA label (Inderal) + mechanistic',
 NULL, true,
 'MONITOR_ONLY', 'PHYSIOLOGICAL_SHIFT', 'UNCERTAIN', 'LOW', 'MECHANISTIC',
 NULL,
 'Monitor BP and HR. Do not rely on beta-blocker to mitigate esketamine BP elevation.',
 true, 'ESK-PROP-001',
 'intranasal', 'any', 'none', 'none', 'possible_masked_tachycardia', false),

-- INT-IBO-PROP-001: Ibogaine + Propranolol — STRONG_CAUTION
('Ibogaine', 'Propranolol', 'Cardiovascular', 4, 'High',
 'Ibogaine is associated with severe QTc prolongation (>500 ms documented in safety study). Bradycardia is a recognized risk factor for torsades de pointes in drug-induced long QT states. Propranolol lowers heart rate and can cause bradycardia, functioning as a meaningful QT risk multiplier.',
 'Ibogaine QTc prolongation: Knuijver 2021. Bradycardia as TdP risk factor: AHA arrhythmia guidelines. Propranolol bradycardia risk: FDA label.',
 'Knuijver 2021 ibogaine QT safety study + AHA arrhythmia statement + FDA label (Inderal)',
 NULL, true,
 'STRONG_CAUTION', 'TOXICITY_AMPLIFICATION', 'DANGER_INCREASE', 'MODERATE', 'OBSERVATIONAL',
 NULL,
 'High-risk combination. ECG protocol and specialist cardiac oversight required if ibogaine is being considered. Bradycardia increases torsades vulnerability.',
 true, 'IBO-PROP-001',
 'oral', 'any', 'none', 'none', 'masked_tachycardia_confirmed', false),

-- INT-DMT-PROP-001: DMT (inhaled) + Propranolol
('DMT', 'Propranolol', 'Cardiovascular', 1, 'Low',
 'DMT can acutely raise BP and HR in some contexts. Propranolol blunts HR but not necessarily BP. Propranolol contraindications (asthma, bradycardia) apply.',
 'General psychedelic cardiovascular physiology. Propranolol label contraindications. No direct DMT-propranolol pairing data.',
 'FDA label (Inderal) + mechanistic',
 NULL, true,
 'MONITOR_ONLY', 'PHYSIOLOGICAL_SHIFT', 'UNCERTAIN', 'LOW', 'MECHANISTIC',
 NULL,
 'Monitor BP and HR. Avoid in asthma or bradycardia.',
 true, 'DMT-PROP-001',
 'inhaled', 'any', 'none', 'none', 'possible_masked_tachycardia', false),

-- INT-5MEO-PROP-001: 5-MeO-DMT + Propranolol
('5-MeO-DMT', 'Propranolol', 'Cardiovascular', 1, 'Low',
 'No direct pairing evidence. Theoretical hemodynamic blunting of tachycardia without preventing BP effects. Propranolol label contraindications apply.',
 'Beta-adrenergic blockade per label. No direct 5-MeO-DMT-propranolol data.',
 'FDA label (Inderal) + mechanistic',
 NULL, true,
 'MONITOR_ONLY', 'PHYSIOLOGICAL_SHIFT', 'UNCERTAIN', 'LOW', 'MECHANISTIC',
 NULL,
 'Do not treat propranolol as protective. Screen for asthma and bradycardia. Monitor BP and HR.',
 true, '5MEO-PROP-001',
 'inhaled', 'any', 'none', 'none', 'possible_masked_tachycardia', false),

-- INT-MESC-PROP-001: Mescaline + Propranolol
('Mescaline', 'Propranolol', 'Cardiovascular', 3, 'Moderate',
 'Mescaline can increase BP and HR via sympathomimetic tone. Propranolol may blunt tachycardia but not necessarily prevent hypertensive response. Propranolol label includes unopposed alpha/catecholamine warnings.',
 'Mescaline sympathomimetic effects. Propranolol unopposed alpha caution per FDA label. No direct pairing data.',
 'FDA label (Inderal) + mechanistic',
 NULL, true,
 'CLINICIAN_REVIEW', 'PHYSIOLOGICAL_SHIFT', 'DANGER_INCREASE', 'LOW', 'MECHANISTIC',
 NULL,
 'Clinician review required for patients on propranolol planning mescaline sessions, especially with cardiovascular disease. BP plan must be documented.',
 true, 'MESC-PROP-001',
 'oral', 'any', 'none', 'none', 'possible_masked_tachycardia', false),

-- INT-AYA-PROP-001: Ayahuasca + Propranolol
('Ayahuasca', 'Propranolol', 'Cardiovascular', 3, 'Moderate',
 'Ayahuasca contains MAO-A inhibiting harmala alkaloids. Propranolol FDA label explicitly notes that hypotensive effects of MAO inhibitors may be exacerbated when administered with beta-blockers. MAOI physiology creates complex BP dynamics that propranolol can worsen or mask.',
 'Propranolol label MAOI hypotension interaction. Ayahuasca harmala alkaloids as MAO-A inhibitors. No direct ayahuasca-propranolol study.',
 'FDA label (Inderal) — MAOI interaction section + harmala alkaloid pharmacology',
 NULL, true,
 'CLINICIAN_REVIEW', 'PHYSIOLOGICAL_SHIFT', 'DANGER_INCREASE', 'LOW', 'MECHANISTIC',
 NULL,
 'Clinician review required. MAOI physiology plus beta-blockade creates hemodynamic instability risk. Require documented BP monitoring plan.',
 true, 'AYA-PROP-001',
 'oral', 'any', 'none', 'possible', 'possible_masked_tachycardia', true),


-- ══════════════════════════════════════════════════════════════
-- BLOCK 3: PRISTIQ (desvenlafaxine) × 10 Psychedelics
-- interactor_name = 'Pristiq (desvenlafaxine)' (added in PART A)
-- ══════════════════════════════════════════════════════════════

-- INT-PSI-DESV-001: Psilocybin + Pristiq
('Psilocybin', 'Pristiq (desvenlafaxine)', 'SSRI/SNRI', 3, 'Moderate',
 'Pristiq may attenuate psilocybin effects based on SSRI/SNRI survey observational data (5-HT2A receptor downregulation). Pristiq also carries label warnings for elevated BP and seizure risk. Abrupt discontinuation must not be advised.',
 'SSRI/SNRI 5-HT2A receptor downregulation blunting (Gukasyan 2023). Pristiq BP elevation and seizure warnings: FDA label.',
 'Gukasyan 2023 (SSRI/SNRI + psilocybin observational) + FDA label (Pristiq 2017)',
 NULL, true,
 'CLINICIAN_REVIEW', 'MIXED', 'BOTH', 'MODERATE', 'OBSERVATIONAL',
 NULL,
 'Possible efficacy blunting — inform patient. Screen BP and seizure history. Do not advise abrupt Pristiq discontinuation — taper required.',
 true, 'PSI-DESV-001',
 'oral', 'any', 'none', 'none', NULL, false),

-- INT-LSD-DESV-001: LSD + Pristiq
('LSD', 'Pristiq (desvenlafaxine)', 'SSRI/SNRI', 3, 'Moderate',
 'No direct LSD-desvenlafaxine pairing studies found. Mechanistic concern via Pristiq BP elevation and seizure warnings. Possible blunting via SNRI class effects.',
 'Mechanistic only via SNRI class BP/seizure warnings. No direct LSD-desvenlafaxine study.',
 'FDA label (Pristiq 2017) + mechanistic',
 NULL, true,
 'CLINICIAN_REVIEW', 'PHYSIOLOGICAL_SHIFT', 'UNCERTAIN', 'LOW', 'MECHANISTIC',
 NULL,
 'Insufficient direct evidence. Treat as BP and seizure-risk modifier. Flag possible blunting with low confidence.',
 true, 'LSD-DESV-001',
 'oral', 'any', 'none', 'none', NULL, false),

-- INT-MDMA-DESV-001: MDMA + Pristiq — STRONG_CAUTION
('MDMA', 'Pristiq (desvenlafaxine)', 'SSRI/SNRI', 4, 'High',
 'Controlled human trial (duloxetine SNRI) shows SNRI class inhibits MDMA subjective effects while increasing plasma MDMA levels — blunting does not indicate safety. Pristiq carries label-grade serotonin syndrome and BP warnings.',
 'SNRI class evidence: Hysek 2012 duloxetine-MDMA controlled trial (blunting + increased MDMA exposure). Pristiq serotonin syndrome and BP warnings: FDA label.',
 'Hysek 2012 duloxetine-MDMA clinical trial + FDA label (Pristiq 2017)',
 NULL, true,
 'STRONG_CAUTION', 'TOXICITY_AMPLIFICATION', 'BOTH', 'MODERATE', 'CLINICAL_TRIAL',
 NULL,
 'Strong caution: blunted effects do not indicate reduced exposure — SNRI class data show increased plasma MDMA. Escalate if additional serotonergic drugs present.',
 true, 'MDMA-DESV-001',
 'oral', 'any', 'none', 'none', NULL, false),

-- INT-KET-DESV-001: Ketamine + Pristiq
('Ketamine', 'Pristiq (desvenlafaxine)', 'SSRI/SNRI', 3, 'Moderate',
 'No direct DDI evidence. Pristiq raises BP and has seizure caution. Ketamine can also raise BP. Combined BP elevation risk requires screening.',
 'Ketamine hemodynamic instability per FDA label (Ketalar). Pristiq BP elevation and seizure caution per label.',
 'FDA label (Pristiq 2017) + FDA label (Ketalar) + mechanistic',
 NULL, true,
 'CLINICIAN_REVIEW', 'PHYSIOLOGICAL_SHIFT', 'DANGER_INCREASE', 'LOW', 'MECHANISTIC',
 NULL,
 'Allow but implement BP monitoring threshold logic. Escalate if uncontrolled hypertension or seizure history present.',
 true, 'KET-DESV-001',
 'IV/IM', 'any', 'none', 'none', NULL, false),

-- INT-ESK-DESV-001: Esketamine + Pristiq — MONITOR_ONLY (co-use is labeled)
('Esketamine', 'Pristiq (desvenlafaxine)', 'SSRI/SNRI', 1, 'Low',
 'Esketamine (Spravato) is FDA-indicated as monotherapy or with an oral antidepressant — co-use with SNRIs is part of labeled clinical use. Both can raise BP; BP threshold monitoring at each dosing visit is the primary safety gate.',
 'Spravato label: indicated with oral antidepressants. Both Pristiq and Spravato raise BP.',
 'FDA label (Spravato) + FDA label (Pristiq 2017)',
 'https://www.accessdata.fda.gov/drugsatfda_docs/label/2020/211243s004lbl.pdf', true,
 'MONITOR_ONLY', 'PHYSIOLOGICAL_SHIFT', 'DANGER_INCREASE', 'MODERATE', 'FDA_LABEL',
 NULL,
 'Not a contraindication — co-use is part of labeled esketamine use. Enforce BP monitoring threshold at each dosing visit. Screen for seizure history.',
 true, 'ESK-DESV-001',
 'intranasal', 'any', 'none', 'none', NULL, false),

-- INT-IBO-DESV-001: Ibogaine + Pristiq
('Ibogaine', 'Pristiq (desvenlafaxine)', 'SSRI/SNRI', 3, 'Moderate',
 'Ibogaine QT prolongation risk dominates this pairing. Pristiq does NOT prolong QT in a thorough QTc study — it should not be over-weighted as a QT driver. Pristiq contributes BP elevation and seizure screening requirements.',
 'Ibogaine QT prolongation: Knuijver 2021. Pristiq QT-negative: thorough QTc study (FDA label, Pristiq 2017). Pristiq BP/seizure: FDA label.',
 'Knuijver 2021 ibogaine QT + FDA label (Pristiq 2017)',
 NULL, true,
 'CLINICIAN_REVIEW', 'TOXICITY_AMPLIFICATION', 'DANGER_INCREASE', 'LOW', 'OBSERVATIONAL',
 NULL,
 'Do not over-attribute QT risk to Pristiq — it is QT-negative in thorough testing. Ibogaine drives the arrhythmia risk. ECG protocol required. Screen BP and seizure history.',
 true, 'IBO-DESV-001',
 'oral', 'any', 'none', 'none', NULL, false),

-- INT-DMT-DESV-001: DMT (inhaled) + Pristiq
('DMT', 'Pristiq (desvenlafaxine)', 'SSRI/SNRI', 3, 'Moderate',
 'No direct evidence. Pristiq has serotonergic and BP warnings. DMT is a serotonergic agonist but not a serotonin releaser — serotonin syndrome risk is theoretical without MAOI exposure. Escalate only if MAOI or harmala exposure present.',
 'Mechanistic only via Pristiq serotonergic/BP label warnings.',
 'FDA label (Pristiq 2017) + mechanistic',
 NULL, true,
 'CLINICIAN_REVIEW', 'PHYSIOLOGICAL_SHIFT', 'UNCERTAIN', 'LOW', 'MECHANISTIC',
 NULL,
 'Low-evidence serotonergic combination. Escalate to ABSOLUTE_CONTRAINDICATION only if MAOI or harmala exposure present. Monitor BP.',
 true, 'DMT-DESV-001',
 'inhaled', 'any', 'none', 'none', NULL, false),

-- INT-5MEO-DESV-001: 5-MeO-DMT + Pristiq
('5-MeO-DMT', 'Pristiq (desvenlafaxine)', 'SSRI/SNRI', 3, 'Moderate',
 'No direct pairing evidence. 5-MeO-DMT with harmala/MAOI exposure is a documented serotonin toxicity risk — MAOI is the critical multiplier. Without MAOI exposure, treat as low-evidence serotonergic combination.',
 'Mechanistic serotonergic concern. 5-MeO-DMT + harmaline serotonin toxicity case context (Jiang 2015). Pristiq label BP warnings.',
 'Jiang 2015 (harmaline + 5-MeO-DMT case) + FDA label (Pristiq 2017)',
 NULL, true,
 'CLINICIAN_REVIEW', 'PHYSIOLOGICAL_SHIFT', 'UNCERTAIN', 'LOW', 'MECHANISTIC',
 NULL,
 'Flag as low-evidence serotonergic combination. Hard-block if any MAOI or harmala exposure identified. Monitor BP.',
 true, '5MEO-DESV-001',
 'inhaled', 'any', 'none', 'none', NULL, false),

-- INT-MESC-DESV-001: Mescaline + Pristiq
('Mescaline', 'Pristiq (desvenlafaxine)', 'SSRI/SNRI', 3, 'Moderate',
 'No direct pairing evidence. Pristiq raises BP and has seizure caution. Mescaline adds autonomic load and sympathomimetic cardiovascular effects.',
 'Pristiq BP elevation and seizure caution per label. Mescaline sympathomimetic cardiovascular effects are established.',
 'FDA label (Pristiq 2017) + mechanistic',
 NULL, true,
 'CLINICIAN_REVIEW', 'PHYSIOLOGICAL_SHIFT', 'DANGER_INCREASE', 'LOW', 'MECHANISTIC',
 NULL,
 'Escalate if uncontrolled hypertension or seizure history present. BP threshold monitoring required.',
 true, 'MESC-DESV-001',
 'oral', 'any', 'none', 'none', NULL, false),

-- INT-AYA-DESV-001: Ayahuasca + Pristiq — ABSOLUTE_CONTRAINDICATION
('Ayahuasca', 'Pristiq (desvenlafaxine)', 'SSRI/SNRI', 5, 'Life-Threatening',
 'ABSOLUTE CONTRAINDICATION. Pristiq is contraindicated with MAOIs. Washout required: no MAOIs within 7 days of stopping Pristiq; no Pristiq within 14 days of stopping an MAOI. Ayahuasca harmala alkaloids (harmine, harmaline) inhibit MAO-A — treat as MAOI exposure. High risk of serotonin syndrome, hypertensive crisis, and death.',
 'Pristiq MAOI contraindication: FDA label (mandatory washout). Ayahuasca harmala β-carbolines as MAO-A inhibitors: established pharmacology.',
 'FDA label (Pristiq 2017) — MAOI contraindication section + harmala alkaloid MAOI pharmacology',
 NULL, true,
 'ABSOLUTE_CONTRAINDICATION', 'TOXICITY_AMPLIFICATION', 'DANGER_INCREASE', 'HIGH', 'FDA_LABEL',
 'Washout required per Pristiq label: no MAOIs within 7 days of stopping Pristiq; no Pristiq within 14 days of stopping an MAOI. Treat ayahuasca harmala exposure as MAOI exposure.',
 'Hard block. Treat ayahuasca/harmala alkaloids as MAOI exposure. Do not proceed with documentation for this protocol while Pristiq is active.',
 true, 'AYA-DESV-001',
 'oral', 'any', 'none', 'none', NULL, true)


ON CONFLICT (substance_name, interactor_name) DO UPDATE SET
  risk_bucket            = EXCLUDED.risk_bucket,
  interaction_type       = EXCLUDED.interaction_type,
  effect_direction       = EXCLUDED.effect_direction,
  confidence             = EXCLUDED.confidence,
  evidence_level         = EXCLUDED.evidence_level,
  washout_note           = EXCLUDED.washout_note,
  screening_note         = EXCLUDED.screening_note,
  is_bidirectional       = EXCLUDED.is_bidirectional,
  rule_key               = EXCLUDED.rule_key,
  severity_grade         = EXCLUDED.severity_grade,
  risk_level             = EXCLUDED.risk_level,
  clinical_description   = EXCLUDED.clinical_description,
  mechanism              = EXCLUDED.mechanism,
  evidence_source        = EXCLUDED.evidence_source,
  source_url             = EXCLUDED.source_url,
  is_verified            = EXCLUDED.is_verified,
  route_context          = EXCLUDED.route_context,
  timing_context         = EXCLUDED.timing_context,
  onset_shift_flag       = EXCLUDED.onset_shift_flag,
  gi_hydration_risk_flag = EXCLUDED.gi_hydration_risk_flag,
  vitals_masking_flag    = EXCLUDED.vitals_masking_flag,
  maoi_exposure_flag     = EXCLUDED.maoi_exposure_flag;


-- ============================================================
-- VERIFICATION QUERIES (run after execution to confirm success)
-- ============================================================
-- 1. Confirm new medications in ref_medications (expect 2 rows):
--    SELECT medication_name, medication_category
--    FROM ref_medications
--    WHERE medication_name IN (
--      'Zepbound (tirzepatide)', 'Pristiq (desvenlafaxine)'
--    );
--
-- 2. Confirm 6 new columns on ref_clinical_interactions:
--    SELECT column_name FROM information_schema.columns
--    WHERE table_name = 'ref_clinical_interactions'
--      AND column_name IN ('route_context','timing_context','onset_shift_flag',
--        'gi_hydration_risk_flag','vitals_masking_flag','maoi_exposure_flag');
--
-- 3. Confirm 10 records per medication (expect 10 each):
--    SELECT interactor_name, COUNT(*) AS n
--    FROM ref_clinical_interactions
--    WHERE interactor_name IN (
--      'Zepbound (tirzepatide)', 'Propranolol', 'Pristiq (desvenlafaxine)'
--    )
--    GROUP BY interactor_name;
--
-- 4. Hard-block check (expect ABSOLUTE_CONTRAINDICATION + maoi_exposure_flag = true):
--    SELECT substance_name, interactor_name, risk_bucket, maoi_exposure_flag
--    FROM ref_clinical_interactions
--    WHERE substance_name = 'Ayahuasca'
--      AND interactor_name = 'Pristiq (desvenlafaxine)';
--
-- 5. Duplicate rule_key check (expect 0 rows):
--    SELECT rule_key, COUNT(*) FROM ref_clinical_interactions
--    WHERE rule_key IS NOT NULL
--    GROUP BY rule_key HAVING COUNT(*) > 1;
-- ============================================================
