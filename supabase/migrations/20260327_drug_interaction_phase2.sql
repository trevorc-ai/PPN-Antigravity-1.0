-- ============================================================
-- PPN Portal — Drug Interaction Checker Phase 2 Migration
-- Created: 2026-03-27
-- WO: WO-705
-- Source: Zepbound-Propranolo-Pristiq-research-report.md
--         (Dr. Allen clinical research request)
--
-- Scope:
--   PART A: 6 additive columns to ref_clinical_interactions
--   PART B: Seed 30 validated interaction records for:
--             - Zepbound (tirzepatide) × 10 psychedelics
--             - Propranolol × 10 psychedelics
--             - Pristiq (desvenlafaxine) × 10 psychedelics
--
-- SAFETY:
--   All ADD COLUMN uses IF NOT EXISTS — safe to re-run
--   No columns dropped. No types changed. No RLS policy changes.
--   Pre-existing RLS covers all new columns automatically:
--     SELECT: any authenticated user (ref_clinical_interactions_read)
--     INSERT/UPDATE/DELETE: network_admin or service_role
--   ON CONFLICT (substance_name, interactor_name) DO UPDATE SET
--     is safe on re-run; updates Phase 1 records if they overlap
--     (specifically RULE-013: MDMA + Propranolol — now enriched)
--
-- USER: Run manually in Supabase SQL Editor.
-- ============================================================


-- ============================================================
-- PART A: SCHEMA MIGRATION — 6 additive columns
-- These are supplemental metadata flags introduced by the
-- research report for route-aware and mechanism-aware logic.
-- ============================================================

ALTER TABLE ref_clinical_interactions
  -- Route context for Zepbound PK relevance (oral PK delay only applies to oral routes)
  ADD COLUMN IF NOT EXISTS route_context           text,
  -- Timing modifier (e.g., "early dose escalation", "stable maintenance dosing")
  ADD COLUMN IF NOT EXISTS timing_context          text,
  -- Onset shift flag for gastric-emptying-related delays
  ADD COLUMN IF NOT EXISTS onset_shift_flag        text,
  -- GI / hydration aggregate risk (especially relevant for ayahuasca, mescaline + Zepbound)
  ADD COLUMN IF NOT EXISTS gi_hydration_risk_flag  text,
  -- Beta-blocker vitals masking flag (masked tachycardia while hypertension persists)
  ADD COLUMN IF NOT EXISTS vitals_masking_flag     text,
  -- MAOI exposure flag: TRUE when ayahuasca/harmalas trigger MAOI-type contraindication logic
  ADD COLUMN IF NOT EXISTS maoi_exposure_flag      boolean DEFAULT false;

-- ── CHECK constraints (idempotent DO blocks) ───────────────────────────────────
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
-- PART B: SEED — 30 interaction records
--
-- Source IDs map to research report CSV (interaction_id column).
-- Rule key format: {PSYCHEDELIC-ABBREV}-{MED-ABBREV}-{SEQ}
--   TIRZ = Zepbound (tirzepatide)
--   PROP = Propranolol
--   DESV = Pristiq (desvenlafaxine)
--
-- Risk bucket summary:
--   ABSOLUTE_CONTRAINDICATION : Ayahuasca + Pristiq
--   STRONG_CAUTION            : Ibogaine+Prop, Ibogaine+Tirz,
--                               MDMA+Pristiq, Ayahuasca+Tirz,
--                               Mescaline+Pristiq*
--   CLINICIAN_REVIEW          : MDMA+Prop (update of RULE-013),
--                               Psilocybin+Tirz, Psilocybin+Pristiq,
--                               LSD+Tirz, LSD+Pristiq, MDMA+Tirz,
--                               Ketamine+Prop, Ketamine+Pristiq,
--                               Esketamine+Tirz, Esketamine+Pristiq,
--                               Ibogaine+Pristiq, Mescaline+Tirz,
--                               Mescaline+Prop, Ayahuasca+Prop,
--                               5-MeO-DMT+Pristiq
--   POSSIBLE_EFFICACY_BLUNTING: Psilocybin+Pristiq (blunting vector)
--                               — filed under CLINICIAN_REVIEW per
--                               report (mixed blunting + BP risk)
--   MONITOR_ONLY              : Ketamine+Tirz, Esketamine+Prop,
--                               Esketamine+Pristiq (BP gate only),
--                               LSD+Prop, DMT+Tirz, DMT+Prop,
--                               DMT+Pristiq, 5-MeO+Tirz, 5-MeO+Prop
--   INSUFFICIENT_EVIDENCE     : DMT+Tirz, 5-MeO+Tirz
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
-- Primary risk vector: delayed gastric emptying (oral routes),
-- nausea/vomiting/diarrhea, dehydration-linked AKI.
-- No direct PK interaction with inhaled routes (DMT, 5-MeO-DMT).
-- ══════════════════════════════════════════════════════════════

-- INT-PSI-TIRZ-001: Psilocybin + Zepbound — CLINICIAN_REVIEW
('Psilocybin', 'Zepbound (tirzepatide)', 'GLP-1/GIP Agonists', 3, 'Moderate',
 'Demonstrated delayed gastric emptying with potential impact on oral psilocybin absorption. Delayed or variable onset increases risk of premature non-response conclusion and dose stacking. Nausea overlap may worsen tolerability.',
 'Demonstrated delayed gastric emptying (FDA label); reduced acetaminophen Cmax/delayed Tmax after 5 mg dose. Psychedelic-specific PK effect is mechanistic only.',
 'FDA label (Zepbound 2025) + mechanistic',
 NULL,
 true,
 'CLINICIAN_REVIEW', 'PHYSIOLOGICAL_SHIFT', 'UNCERTAIN', 'LOW', 'MECHANISTIC',
 NULL,
 'Flag oral absorption delay possible during Zepbound dose escalation. Avoid early redosing based on delayed onset. Screen for active nausea/vomiting.',
 true, 'PSI-TIRZ-001',
 'oral', 'especially_during_dose_escalation', 'likely_delay', 'possible', NULL, false),

-- INT-LSD-TIRZ-001: LSD + Zepbound — CLINICIAN_REVIEW
('LSD', 'Zepbound (tirzepatide)', 'GLP-1/GIP Agonists', 3, 'Moderate',
 'Delayed gastric emptying can shift LSD onset timing. Particularly high-leverage for LSD due to its long session duration — misinterpretation of non-response early in session magnifies dose-stacking risk.',
 'Demonstrated delayed gastric emptying (FDA label). LSD-specific PK shift is mechanistic only. Long duration makes early timing errors high-consequence.',
 'FDA label (Zepbound 2025) + mechanistic',
 NULL,
 true,
 'CLINICIAN_REVIEW', 'PHYSIOLOGICAL_SHIFT', 'UNCERTAIN', 'LOW', 'MECHANISTIC',
 NULL,
 'Extra conservative for LSD — long session duration magnifies early timing errors. Avoid redosing based on absent early effects. Screen for GI tolerance.',
 true, 'LSD-TIRZ-001',
 'oral', 'especially_during_dose_escalation', 'likely_delay', 'possible', NULL, false),

-- INT-MDMA-TIRZ-001: MDMA + Zepbound — CLINICIAN_REVIEW
('MDMA', 'Zepbound (tirzepatide)', 'GLP-1/GIP Agonists', 3, 'Moderate',
 'Delayed oral absorption may encourage premature redosing. Zepbound-related nausea/dehydration and AKI warning adds to physiologic strain in an already cardiovascularly demanding session.',
 'Demonstrated delayed gastric emptying and altered peak concentrations for oral meds. Zepbound GI adverse events and dehydration-linked AKI warning are label-demonstrated.',
 'FDA label (Zepbound 2025) + mechanistic',
 NULL,
 true,
 'CLINICIAN_REVIEW', 'PHYSIOLOGICAL_SHIFT', 'UNCERTAIN', 'LOW', 'MECHANISTIC',
 NULL,
 'Do not redose based on delayed onset. Screening required for GI intolerance and dehydration risk. Hydration plan must be documented.',
 true, 'MDMA-TIRZ-001',
 'oral', 'especially_during_dose_escalation', 'possible_delay', 'possible', NULL, false),

-- INT-KET-TIRZ-001: Ketamine + Zepbound — MONITOR_ONLY
-- (Ketamine IV/IM bypasses oral absorption concern; main issue is nausea/hydration)
('Ketamine', 'Zepbound (tirzepatide)', 'GLP-1/GIP Agonists', 1, 'Low',
 'No direct pharmacokinetic interaction for IV/IM ketamine. Main concern is additive nausea/vomiting burden and dehydration. Ketamine label highlights hemodynamic instability; dehydration can worsen post-dose hypotension.',
 'No plausible PK DDI for parenteral ketamine. Zepbound nausea/vomiting/diarrhea and dehydration-linked AKI are label-demonstrated. Mechanistic concern is physiological, not drug-level.',
 'FDA label (Zepbound 2025) + FDA label (Ketalar) + mechanistic',
 NULL,
 true,
 'MONITOR_ONLY', 'PHYSIOLOGICAL_SHIFT', 'UNCERTAIN', 'LOW', 'MECHANISTIC',
 NULL,
 'Ensure hydration plan and emesis precautions documented. Not a drug-level contraindication. Monitor tolerability and vitals.',
 true, 'KET-TIRZ-001',
 'IV/IM', 'any', 'none', 'possible', NULL, false),

-- INT-ESK-TIRZ-001: Esketamine + Zepbound — MONITOR_ONLY
('Esketamine', 'Zepbound (tirzepatide)', 'GLP-1/GIP Agonists', 1, 'Low',
 'Both medications commonly cause nausea/vomiting. Esketamine label emphasizes BP monitoring and clinically meaningful sedation. Zepbound dehydration warning adds tolerability concern around monitored dosing visits.',
 'No direct DDI evidence. Esketamine is intranasal — oral absorption delay not applicable. Both cause nausea/GI effects.',
 'FDA label (Zepbound 2025) + FDA label (Spravato) + mechanistic',
 NULL,
 true,
 'MONITOR_ONLY', 'PHYSIOLOGICAL_SHIFT', 'UNCERTAIN', 'LOW', 'MECHANISTIC',
 NULL,
 'Plan for nausea/emesis and hydration monitoring around supervised dosing visits. Not a pharmacological contraindication.',
 true, 'ESK-TIRZ-001',
 'intranasal', 'any', 'none', 'possible', NULL, false),

-- INT-IBO-TIRZ-001: Ibogaine + Zepbound — STRONG_CAUTION
-- Zepbound vomiting/diarrhea can worsen electrolytes; ibogaine has severe QTc risk.
-- Electrolyte derangement from any cause is a QT risk multiplier.
('Ibogaine', 'Zepbound (tirzepatide)', 'GLP-1/GIP Agonists', 4, 'High',
 'Ibogaine is associated with marked QTc prolongation (>500 ms in safety studies). Zepbound causes vomiting, diarrhea, and dehydration-linked AKI — all of which can cause electrolyte derangements that further amplify QT risk. Dehydration from any source is a recognized torsades risk multiplier.',
 'Ibogaine QTc prolongation is observational (Knuijver 2021). Zepbound GI adverse events and dehydration-linked AKI are label-demonstrated. Electrolyte disturbance mechanism is guideline-supported.',
 'Knuijver 2021 QTc safety study + FDA label (Zepbound 2025) + mechanistic',
 NULL,
 true,
 'STRONG_CAUTION', 'TOXICITY_AMPLIFICATION', 'DANGER_INCREASE', 'LOW', 'OBSERVATIONAL',
 NULL,
 'Strong caution: treat active vomiting, diarrhea, or dehydration as a major risk multiplier for ibogaine QTc. ECG protocol and electrolyte status required. Strong med review before any ibogaine workflow.',
 true, 'IBO-TIRZ-001',
 'oral', 'any', 'possible_delay', 'high', NULL, false),

-- INT-DMT-TIRZ-001: DMT (inhaled) + Zepbound — INSUFFICIENT_EVIDENCE
('DMT', 'Zepbound (tirzepatide)', 'GLP-1/GIP Agonists', 1, 'Low',
 'No plausible pharmacokinetic interaction for inhaled DMT. Zepbound primarily affects oral absorption and GI tolerability — neither applies to the inhaled route. Monitor for background nausea or hydration confounds only.',
 'No direct DDI evidence. DMT is inhaled — Zepbound gastric emptying effect not applicable. Background GI/hydration confound is the only mechanistic concern.',
 'FDA label (Zepbound 2025) + mechanistic',
 NULL,
 true,
 'INSUFFICIENT_EVIDENCE', 'UNKNOWN', 'UNCERTAIN', 'LOW', 'MECHANISTIC',
 NULL,
 'Inhaled route bypasses oral absorption concern. Monitor tolerability and hydration only. No clinically meaningful drug-level interaction expected.',
 true, 'DMT-TIRZ-001',
 'inhaled', 'any', 'none', 'none', NULL, false),

-- INT-5MEO-TIRZ-001: 5-MeO-DMT + Zepbound — INSUFFICIENT_EVIDENCE
('5-MeO-DMT', 'Zepbound (tirzepatide)', 'GLP-1/GIP Agonists', 1, 'Low',
 'No plausible pharmacokinetic interaction for inhaled 5-MeO-DMT. No clinically meaningful drug interaction expected beyond background GI or dehydration confounds.',
 'No direct DDI evidence. 5-MeO-DMT is typically inhaled — Zepbound gastric emptying effect not applicable.',
 'FDA label (Zepbound 2025) + mechanistic',
 NULL,
 true,
 'INSUFFICIENT_EVIDENCE', 'UNKNOWN', 'UNCERTAIN', 'LOW', 'MECHANISTIC',
 NULL,
 'Monitor only unless patient has severe GI intolerance or dehydration from Zepbound. No drug-level interaction.',
 true, '5MEO-TIRZ-001',
 'inhaled', 'any', 'none', 'none', NULL, false),

-- INT-MESC-TIRZ-001: Mescaline + Zepbound — CLINICIAN_REVIEW
('Mescaline', 'Zepbound (tirzepatide)', 'GLP-1/GIP Agonists', 3, 'Moderate',
 'Mescaline commonly causes nausea. Zepbound''s delayed gastric emptying and high nausea/vomiting/diarrhea rates create additive GI burden and timing uncertainty for an already emetogenic substance. Dehydration risk is compounded.',
 'Label-demonstrated delayed gastric emptying and GI adverse events. Mescaline emetogenicity is established. Synergistic GI burden is mechanistic inference.',
 'FDA label (Zepbound 2025) + mechanistic',
 NULL,
 true,
 'CLINICIAN_REVIEW', 'PHYSIOLOGICAL_SHIFT', 'UNCERTAIN', 'LOW', 'MECHANISTIC',
 NULL,
 'Treat Zepbound as an emesis and dehydration risk multiplier for mescaline. Onset timing may be delayed. Dehydration plan required.',
 true, 'MESC-TIRZ-001',
 'oral', 'especially_during_dose_escalation', 'likely_delay', 'high', NULL, false),

-- INT-AYA-TIRZ-001: Ayahuasca + Zepbound — STRONG_CAUTION
-- Ayahuasca + purging + Zepbound GI effects = severe dehydration/electrolyte risk.
('Ayahuasca', 'Zepbound (tirzepatide)', 'GLP-1/GIP Agonists', 4, 'High',
 'Ayahuasca commonly causes vomiting (the "purge"). Zepbound''s nausea/vomiting/diarrhea and dehydration-linked AKI warning create severe additive risk. Electrolyte derangements could compound cardiovascular vulnerability. Delayed gastric emptying adds onset timing uncertainty.',
 'Label-demonstrated Zepbound GI adverse events and dehydration-linked AKI. Additive emesis burden with ayahuasca is mechanistic. Onset timing shift for oral ayahuasca is theoretical.',
 'FDA label (Zepbound 2025) + mechanistic',
 NULL,
 true,
 'STRONG_CAUTION', 'TOXICITY_AMPLIFICATION', 'DANGER_INCREASE', 'LOW', 'MECHANISTIC',
 NULL,
 'Strong caution: treat dehydration and electrolyte disturbance as a safety blocker for ayahuasca sessions. Active GI intolerance is a session go/no-go factor. Timing will not be typical.',
 true, 'AYA-TIRZ-001',
 'oral', 'any', 'possible_delay', 'high', NULL, false),


-- ══════════════════════════════════════════════════════════════
-- BLOCK 2: PROPRANOLOL × 10 Psychedelics
-- Primary risk vectors:
--   1. Vitals masking (masked tachycardia, BP persists)
--   2. CYP2D6 substrate (MDMA is potent mechanism-based inhibitor)
--   3. Bradycardia + ibogaine QTc = torsades risk multiplier
--   4. MAOI physiology (ayahuasca) + beta-blockade = BP instability
-- Note: MDMA + Propranolol (RULE-013) already seeded in Phase 1.
--   ON CONFLICT → enriched with new flag columns and upgraded notes.
-- ══════════════════════════════════════════════════════════════

-- INT-PSI-PROP-001: Psilocybin + Propranolol — MONITOR_ONLY
('Psilocybin', 'Propranolol', 'Beta Blockers', 1, 'Low',
 'Theoretical: beta blockade may blunt heart rate and somatic anxiety during psilocybin sessions. Propranolol contraindications (asthma, bradycardia, AV block) must be screened. No direct psilocybin-propranolol studies found.',
 'Beta-adrenergic blockade reduces HR and adrenergic symptoms. Psychedelic-specific effect is mechanistic only.',
 'FDA label (Inderal) + mechanistic',
 NULL,
 true,
 'MONITOR_ONLY', 'PHYSIOLOGICAL_SHIFT', 'UNCERTAIN', 'LOW', 'MECHANISTIC',
 NULL,
 'Monitor vitals. Do not assume propranolol makes the session "cardio-safe." Screen for asthma, bradycardia, AV block per propranolol contraindications.',
 true, 'PSI-PROP-001',
 'oral', 'any', 'none', 'none', 'possible_masked_tachycardia', false),

-- INT-LSD-PROP-001: LSD + Propranolol — MONITOR_ONLY
-- Historical Lancet 1971 case report exists for LSD-induced anxiety use.
('LSD', 'Propranolol', 'Beta Blockers', 1, 'Low',
 'A historical clinical report (Lancet 1971) describes propranolol use for LSD-induced anxiety. Evidence is sparse and from a 50-year-old single publication. Bradycardia and bronchospasm risk from propranolol apply as per label. Not appropriate as routine premedication.',
 'Adrenergic symptom reduction via beta blockade. Case-report level evidence only. Propranolol label bradycardia/asthma contraindications apply.',
 'Linken 1971 Lancet (PMID 4108099) + FDA label (Inderal)',
 'https://pubmed.ncbi.nlm.nih.gov/4108099/',
 true,
 'MONITOR_ONLY', 'PHYSIOLOGICAL_SHIFT', 'UNCERTAIN', 'LOW', 'CASE_REPORT',
 NULL,
 'Allow only as clinician-directed rescue or support — not routine premedication. Evidence limited to a 1971 case report. Screen asthma and bradycardia.',
 true, 'LSD-PROP-001',
 'oral', 'any', 'none', 'none', 'possible_masked_tachycardia', false),

-- INT-MDMA-PROP-001: MDMA + Propranolol — CLINICIAN_REVIEW (UPDATE of RULE-013)
-- RULE-013 already seeded in Phase 1. ON CONFLICT will enrich it with:
-- - new flag columns, upgraded screening_note, and new evidence fields.
('MDMA', 'Propranolol', 'Beta Blockers', 3, 'Moderate',
 'Beta blockade (demonstrated with pindolol in human trial) prevents MDMA-induced tachycardia but fails to prevent BP elevation. Additionally, MDMA is a potent mechanism-based CYP2D6 inhibitor, and propranolol is a CYP2D6 substrate — plausible increase in propranolol exposure increases bradycardia and hypotension risk during recovery. Do not treat propranolol as protective.',
 'Human beta-blocker trial (pindolol): HR blunted, MAP rise persists. MDMA mechanism-based CYP2D6 inhibition demonstrated in humans (Yubero-Lahoz 2011). Propranolol CYP2D6 substrate per FDA label.',
 'Hysek 2010 pindolol-MDMA trial; Yubero-Lahoz 2011 CYP2D6; Inderal label',
 NULL,
 true,
 'CLINICIAN_REVIEW', 'MIXED', 'DANGER_INCREASE', 'MODERATE', 'CLINICAL_TRIAL',
 NULL,
 'Clinician review required. Beta-blockade does not reduce cardiovascular risk of MDMA — may worsen pressor response via unopposed alpha activation. Monitor BP closely. Risk of increased propranolol exposure during recovery phase.',
 true, 'MDMA-BETA-PRO',
 'oral', 'any', 'none', 'none', 'masked_tachycardia_confirmed', false),

-- INT-KET-PROP-001: Ketamine + Propranolol — MONITOR_ONLY
('Ketamine', 'Propranolol', 'Beta Blockers', 1, 'Low',
 'Ketamine has variable hemodynamic effects including both increased and decreased BP/HR. Propranolol lowers HR and can cause bradycardia and hypotension. No direct ketamine-propranolol pairing studies found. Risk is hemodynamic unpredictability in a patient receiving both.',
 'Ketamine hemodynamic variability per FDA label. Propranolol beta-blockade effects per label. No direct pairing data.',
 'FDA label (Ketalar) + FDA label (Inderal) + mechanistic',
 NULL,
 true,
 'MONITOR_ONLY', 'PHYSIOLOGICAL_SHIFT', 'UNCERTAIN', 'LOW', 'MECHANISTIC',
 NULL,
 'Monitor BP and HR closely. Do not assume ketamine BP elevation will offset beta-blockade. Screen for cardiac conduction disease.',
 true, 'KET-PROP-001',
 'IV/IM', 'any', 'none', 'none', 'possible_masked_tachycardia', false),

-- INT-ESK-PROP-001: Esketamine + Propranolol — MONITOR_ONLY
('Esketamine', 'Propranolol', 'Beta Blockers', 1, 'Low',
 'Esketamine can transiently increase BP. Propranolol may blunt HR response while BP elevation persists. Risk of hypotension or bradycardia during recovery. No direct pairing data.',
 'Esketamine transient BP increase per FDA label (Spravato). Propranolol beta-blockade per label. HR/BP dissociation plausible.',
 'FDA label (Spravato) + FDA label (Inderal) + mechanistic',
 NULL,
 true,
 'MONITOR_ONLY', 'PHYSIOLOGICAL_SHIFT', 'UNCERTAIN', 'LOW', 'MECHANISTIC',
 NULL,
 'Monitor BP and HR. Do not rely on beta-blocker to mitigate esketamine BP elevation. Screen for bradycardia at baseline.',
 true, 'ESK-PROP-001',
 'intranasal', 'any', 'none', 'none', 'possible_masked_tachycardia', false),

-- INT-IBO-PROP-001: Ibogaine + Propranolol — STRONG_CAUTION
('Ibogaine', 'Propranolol', 'Beta Blockers', 4, 'High',
 'Ibogaine is associated with severe QTc prolongation (>500 ms documented in safety study). Bradycardia is a recognized risk factor for torsades de pointes in drug-induced long QT states — an established guideline-level principle. Propranolol lowers heart rate and can cause bradycardia, functioning as a meaningful QT risk multiplier even without a direct ibogaine-propranolol interaction study.',
 'Ibogaine QTc prolongation: Knuijver 2021 observational safety study (QTc >500 ms). Bradycardia as TdP risk factor: AHA arrhythmia guidelines. Propranolol bradycardia risk: FDA label.',
 'Knuijver 2021 ibogaine QT safety study + AHA arrhythmia statement + FDA label (Inderal)',
 NULL,
 true,
 'STRONG_CAUTION', 'TOXICITY_AMPLIFICATION', 'DANGER_INCREASE', 'MODERATE', 'OBSERVATIONAL',
 NULL,
 'High-risk combination. ECG protocol and specialist cardiac oversight required if ibogaine is being considered. Do not assume propranolol is neutral — bradycardia increases torsades vulnerability in ibogaine QT burden.',
 true, 'IBO-PROP-001',
 'oral', 'any', 'none', 'none', 'masked_tachycardia_confirmed', false),

-- INT-DMT-PROP-001: DMT (inhaled) + Propranolol — MONITOR_ONLY
('DMT', 'Propranolol', 'Beta Blockers', 1, 'Low',
 'DMT can acutely raise BP and HR in some contexts. Propranolol blunts HR but not necessarily BP. No direct pairing studies. Propranolol contraindications (asthma, bradycardia) apply.',
 'General psychedelic cardiovascular physiology. Propranolol label contraindications. No direct DMT-propranolol pairing data.',
 'FDA label (Inderal) + mechanistic',
 NULL,
 true,
 'MONITOR_ONLY', 'PHYSIOLOGICAL_SHIFT', 'UNCERTAIN', 'LOW', 'MECHANISTIC',
 NULL,
 'Monitor BP and HR. Avoid in asthma or bradycardia per propranolol contraindications.',
 true, 'DMT-PROP-001',
 'inhaled', 'any', 'none', 'none', 'possible_masked_tachycardia', false),

-- INT-5MEO-PROP-001: 5-MeO-DMT + Propranolol — MONITOR_ONLY
('5-MeO-DMT', 'Propranolol', 'Beta Blockers', 1, 'Low',
 'No direct pairing evidence found. Theoretical hemodynamic blunting of tachycardia without preventing BP effects. Propranolol label contraindications (asthma, bradycardia) apply.',
 'Beta-adrenergic blockade effects per label. No direct 5-MeO-DMT-propranolol data.',
 'FDA label (Inderal) + mechanistic',
 NULL,
 true,
 'MONITOR_ONLY', 'PHYSIOLOGICAL_SHIFT', 'UNCERTAIN', 'LOW', 'MECHANISTIC',
 NULL,
 'Do not treat propranolol as protective. Screen for asthma and bradycardia. Monitor BP and HR.',
 true, '5MEO-PROP-001',
 'inhaled', 'any', 'none', 'none', 'possible_masked_tachycardia', false),

-- INT-MESC-PROP-001: Mescaline + Propranolol — CLINICIAN_REVIEW
('Mescaline', 'Propranolol', 'Beta Blockers', 3, 'Moderate',
 'Mescaline can increase BP and HR via sympathomimetic tone. Propranolol may blunt tachycardia but not necessarily prevent hypertensive response. Propranolol label includes unopposed alpha/catecholamine warnings. No direct mescaline-propranolol studies.',
 'Mescaline sympathomimetic effects. Propranolol unopposed alpha caution per FDA label. No direct pairing data.',
 'FDA label (Inderal) + mechanistic',
 NULL,
 true,
 'CLINICIAN_REVIEW', 'PHYSIOLOGICAL_SHIFT', 'DANGER_INCREASE', 'LOW', 'MECHANISTIC',
 NULL,
 'Clinician review required for patients on propranolol planning mescaline sessions, especially with cardiovascular disease. BP plan must be documented.',
 true, 'MESC-PROP-001',
 'oral', 'any', 'none', 'none', 'possible_masked_tachycardia', false),

-- INT-AYA-PROP-001: Ayahuasca + Propranolol — CLINICIAN_REVIEW
-- Propranolol label explicitly notes MAOI hypotension may be exacerbated with beta-blockers.
('Ayahuasca', 'Propranolol', 'Beta Blockers', 3, 'Moderate',
 'Ayahuasca contains MAO-A inhibiting harmala alkaloids. Propranolol FDA label explicitly notes that hypotensive effects of MAO inhibitors may be exacerbated when administered with beta-blockers. MAOI physiology creates complex BP dynamics (pressor phases + orthostatic hypotension) that propranolol can worsen or mask.',
 'Propranolol label MAOI hypotension interaction. Ayahuasca harmala alkaloids as MAO-A inhibitors. No direct ayahuasca-propranolol study.',
 'FDA label (Inderal) — MAOI interaction section + harmala alkaloid pharmacology',
 NULL,
 true,
 'CLINICIAN_REVIEW', 'PHYSIOLOGICAL_SHIFT', 'DANGER_INCREASE', 'LOW', 'MECHANISTIC',
 NULL,
 'Clinician review required. MAOI physiology plus beta-blockade creates hemodynamic instability risk. Require documented BP monitoring plan.',
 true, 'AYA-PROP-001',
 'oral', 'any', 'none', 'possible', 'possible_masked_tachycardia', true),


-- ══════════════════════════════════════════════════════════════
-- BLOCK 3: PRISTIQ (desvenlafaxine) × 10 Psychedelics
-- Primary risk vectors:
--   1. MAOI contraindication (ayahuasca/harmalas) — ABSOLUTE BLOCK
--   2. Serotonin syndrome + MDMA (SNRI class evidence: duloxetine trial)
--   3. BP elevation + seizure risk across all psychedelics
--   4. Efficacy blunting (psilocybin, LSD via SSRI/SNRI receptor effect)
-- Note: Pristiq does NOT prolong QT (thorough QTc study) —
--   do not over-weight as QT driver for ibogaine pairings.
-- ══════════════════════════════════════════════════════════════

-- INT-PSI-DESV-001: Psilocybin + Pristiq — CLINICIAN_REVIEW
('Psilocybin', 'Pristiq (desvenlafaxine)', 'SNRIs', 3, 'Moderate',
 'Pristiq may attenuate psilocybin effects based on SSRI/SNRI survey observational data (5-HT2A receptor downregulation). Not Pristiq-specific. Pristiq also carries label warnings for elevated BP and seizure risk, requiring screening. Abrupt discontinuation must not be advised.',
 'SSRI/SNRI 5-HT2A receptor downregulation blunting supported by observational survey data (Gukasyan 2023). Pristiq BP elevation and seizure warnings are label-grade. Serotonin syndrome for this pairing is not established.',
 'Gukasyan 2023 (SSRI/SNRI + psilocybin observational) + FDA label (Pristiq 2017)',
 NULL,
 true,
 'CLINICIAN_REVIEW', 'MIXED', 'BOTH', 'MODERATE', 'OBSERVATIONAL',
 NULL,
 'Possible efficacy blunting — inform patient. Screen BP and seizure history. Do not advise abrupt Pristiq discontinuation — taper required. Serotonin syndrome risk is not established for this pairing.',
 true, 'PSI-DESV-001',
 'oral', 'any', 'none', 'none', NULL, false),

-- INT-LSD-DESV-001: LSD + Pristiq — CLINICIAN_REVIEW
('LSD', 'Pristiq (desvenlafaxine)', 'SNRIs', 3, 'Moderate',
 'No direct LSD-desvenlafaxine pairing studies found. Mechanistic concern via Pristiq BP elevation and seizure warnings. Possible blunting via SNRI class effects on serotonergic tone, though LSD evidence is insufficient for Pristiq specifically.',
 'Mechanistic only via SNRI class BP/seizure warnings. No direct LSD-desvenlafaxine study.',
 'FDA label (Pristiq 2017) + mechanistic',
 NULL,
 true,
 'CLINICIAN_REVIEW', 'PHYSIOLOGICAL_SHIFT', 'UNCERTAIN', 'LOW', 'MECHANISTIC',
 NULL,
 'Insufficient direct evidence. Treat as BP and seizure-risk modifier. Flag possible blunting with low confidence. Monitor BP closely.',
 true, 'LSD-DESV-001',
 'oral', 'any', 'none', 'none', NULL, false),

-- INT-MDMA-DESV-001: MDMA + Pristiq — STRONG_CAUTION
('MDMA', 'Pristiq (desvenlafaxine)', 'SNRIs', 4, 'High',
 'Controlled human trial (duloxetine, an SNRI) shows SNRI class inhibits MDMA subjective effects while significantly increasing plasma MDMA levels — blunting does not indicate safety. Pristiq carries label-grade serotonin syndrome and BP warnings. Desvenlafaxine has minimal CYP2D6 interaction potential vs. duloxetine, but class-relevant transporter blockade and serotonergic load risks apply.',
 'SNRI class evidence: Hysek 2012 duloxetine-MDMA controlled trial (blunting + increased MDMA exposure). Pristiq serotonin syndrome and BP warnings: FDA label. PK magnitude may differ from duloxetine due to desvenlafaxine minimal CYP2D6 effect.',
 'Hysek 2012 duloxetine-MDMA clinical trial + FDA label (Pristiq 2017)',
 NULL,
 true,
 'STRONG_CAUTION', 'TOXICITY_AMPLIFICATION', 'BOTH', 'MODERATE', 'CLINICAL_TRIAL',
 NULL,
 'Strong caution: blunted effects do not indicate reduced exposure — SNRI class data show increased plasma MDMA. Escalate if additional serotonergic drugs are present. Monitor BP and temperature closely.',
 true, 'MDMA-DESV-001',
 'oral', 'any', 'none', 'none', NULL, false),

-- INT-KET-DESV-001: Ketamine + Pristiq — CLINICIAN_REVIEW
('Ketamine', 'Pristiq (desvenlafaxine)', 'SNRIs', 3, 'Moderate',
 'No direct DDI evidence. Pristiq raises BP and has seizure caution. Ketamine can also raise BP and HR with hemodynamic instability warnings. Combined BP elevation risk requires screening and threshold monitoring.',
 'Ketamine hemodynamic instability per FDA label (Ketalar). Pristiq BP elevation and seizure caution per label. Mechanistic additive BP concern.',
 'FDA label (Pristiq 2017) + FDA label (Ketalar) + mechanistic',
 NULL,
 true,
 'CLINICIAN_REVIEW', 'PHYSIOLOGICAL_SHIFT', 'DANGER_INCREASE', 'LOW', 'MECHANISTIC',
 NULL,
 'Allow but implement BP monitoring threshold logic. Escalate if uncontrolled hypertension or seizure history present.',
 true, 'KET-DESV-001',
 'IV/IM', 'any', 'none', 'none', NULL, false),

-- INT-ESK-DESV-001: Esketamine + Pristiq — MONITOR_ONLY (with BP gate)
-- Co-use is explicitly labeled (Spravato indicated as monotherapy or with oral AD).
('Esketamine', 'Pristiq (desvenlafaxine)', 'SNRIs', 1, 'Low',
 'Esketamine (Spravato) is FDA-indicated as monotherapy or with an oral antidepressant — co-use with SNRIs including desvenlafaxine is part of labeled clinical use. Both can raise BP; Pristiq adds BP monitoring requirement and seizure screening. BP threshold monitoring at each dosing visit is the primary safety gate.',
 'Spravato label: indicated with oral antidepressants. Both Pristiq and Spravato raise BP. Seizure caution from Pristiq label.',
 'FDA label (Spravato) + FDA label (Pristiq 2017)',
 'https://www.accessdata.fda.gov/drugsatfda_docs/label/2020/211243s004lbl.pdf',
 true,
 'MONITOR_ONLY', 'PHYSIOLOGICAL_SHIFT', 'DANGER_INCREASE', 'MODERATE', 'FDA_LABEL',
 NULL,
 'Not a contraindication — co-use is part of labeled esketamine use. Enforce BP monitoring threshold at each dosing visit. Screen for uncontrolled hypertension and seizure history.',
 true, 'ESK-DESV-001',
 'intranasal', 'any', 'none', 'none', NULL, false),

-- INT-IBO-DESV-001: Ibogaine + Pristiq — CLINICIAN_REVIEW
-- Pristiq does NOT prolong QT in thorough QTc study — do not over-weight as QT driver.
-- Dominant risk is ibogaine-driven QT; Pristiq adds BP/seizure considerations.
('Ibogaine', 'Pristiq (desvenlafaxine)', 'SNRIs', 3, 'Moderate',
 'Ibogaine QT prolongation risk is severe and dominates this pairing. Pristiq does NOT prolong QT in a thorough QTc study — it should not be over-weighted as a QT driver. However, Pristiq contributes BP elevation and seizure screening requirements. Overall polypharmacy with ibogaine remains high-risk.',
 'Ibogaine QT prolongation: Knuijver 2021 observational safety study. Pristiq QT-negative: thorough QTc study (FDA label, Pristiq 2017). Pristiq BP/seizure: FDA label.',
 'Knuijver 2021 ibogaine QT + FDA label (Pristiq 2017) — thorough QTc section',
 NULL,
 true,
 'CLINICIAN_REVIEW', 'TOXICITY_AMPLIFICATION', 'DANGER_INCREASE', 'LOW', 'OBSERVATIONAL',
 NULL,
 'Do not over-attribute QT risk to Pristiq — it is QT-negative. Ibogaine drives the arrhythmia risk. Treat polypharmacy + ibogaine as uniformly high-risk. ECG protocol required. Screen BP and seizure history.',
 true, 'IBO-DESV-001',
 'oral', 'any', 'none', 'none', NULL, false),

-- INT-DMT-DESV-001: DMT (inhaled) + Pristiq — CLINICIAN_REVIEW
('DMT', 'Pristiq (desvenlafaxine)', 'SNRIs', 3, 'Moderate',
 'No direct evidence. Pristiq has serotonergic and BP warnings. DMT is a serotonergic agonist but not a serotonin releaser — serotonin syndrome risk is theoretical without MAOI exposure. Escalate only if MAOI or harmala exposure is present.',
 'Mechanistic only via Pristiq serotonergic/BP label warnings. DMT agonist pharmacology does not create SNRI-typical serotonin syndrome risk without concurrent MAOI.',
 'FDA label (Pristiq 2017) + mechanistic',
 NULL,
 true,
 'CLINICIAN_REVIEW', 'PHYSIOLOGICAL_SHIFT', 'UNCERTAIN', 'LOW', 'MECHANISTIC',
 NULL,
 'Low-evidence serotonergic combination. Escalate to ABSOLUTE_CONTRAINDICATION only if MAOI or harmala exposure also present. Monitor BP.',
 true, 'DMT-DESV-001',
 'inhaled', 'any', 'none', 'none', NULL, false),

-- INT-5MEO-DESV-001: 5-MeO-DMT + Pristiq — CLINICIAN_REVIEW
('5-MeO-DMT', 'Pristiq (desvenlafaxine)', 'SNRIs', 3, 'Moderate',
 'No direct pairing evidence. 5-MeO-DMT with harmala/MAOI exposure is a documented serotonin toxicity risk — MAOI is the critical multiplier, not the SNRI alone. Without MAOI exposure, treat as low-evidence serotonergic combination. Pristiq BP warnings apply.',
 'Mechanistic serotonergic concern. 5-MeO-DMT + harmaline serotonin toxicity case context (Jiang 2015). Pristiq label BP and serotonergic warnings.',
 'Jiang 2015 (harmaline + 5-MeO-DMT case) + FDA label (Pristiq 2017) + mechanistic',
 NULL,
 true,
 'CLINICIAN_REVIEW', 'PHYSIOLOGICAL_SHIFT', 'UNCERTAIN', 'LOW', 'MECHANISTIC',
 NULL,
 'Flag as low-evidence serotonergic combination. Hard-block to ABSOLUTE_CONTRAINDICATION if any MAOI or harmala exposure is identified. Monitor BP.',
 true, '5MEO-DESV-001',
 'inhaled', 'any', 'none', 'none', NULL, false),

-- INT-MESC-DESV-001: Mescaline + Pristiq — CLINICIAN_REVIEW
('Mescaline', 'Pristiq (desvenlafaxine)', 'SNRIs', 3, 'Moderate',
 'No direct pairing evidence. Pristiq raises BP and has seizure caution. Mescaline adds autonomic load and sympathomimetic cardiovascular effects. Combined BP elevation risk requires screening. Insufficient evidence for confident risk severity characterization.',
 'Pristiq BP elevation and seizure caution per label. Mescaline sympathomimetic cardiovascular effects are established. Additive BP risk is mechanistic.',
 'FDA label (Pristiq 2017) + mechanistic',
 NULL,
 true,
 'CLINICIAN_REVIEW', 'PHYSIOLOGICAL_SHIFT', 'DANGER_INCREASE', 'LOW', 'MECHANISTIC',
 NULL,
 'Escalate if uncontrolled hypertension or seizure history present. BP threshold monitoring required.',
 true, 'MESC-DESV-001',
 'oral', 'any', 'none', 'none', NULL, false),

-- INT-AYA-DESV-001: Ayahuasca + Pristiq — ABSOLUTE_CONTRAINDICATION
-- Pristiq is MAOI-contraindicated at the label level. Ayahuasca contains MAO-A inhibiting
-- harmala alkaloids. Labeled washout rules apply. This is a hard block.
('Ayahuasca', 'Pristiq (desvenlafaxine)', 'SNRIs', 5, 'Life-Threatening',
 'ABSOLUTE CONTRAINDICATION. Pristiq is contraindicated with MAOIs and has explicit washout guidance (do not use MAOIs with Pristiq or within 7 days of stopping Pristiq; do not use Pristiq within 14 days of stopping an MAOI). Ayahuasca''s harmala alkaloids (harmine, harmaline, related β-carbolines) inhibit MAO-A — treat as MAOI exposure. High risk of serotonin syndrome, hypertensive crisis, and death. Older literature explicitly warns of this combination.',
 'Pristiq MAOI contraindication: FDA label (mandatory washout). Ayahuasca harmala β-carbolines as MAO-A inhibitors: established pharmacology. Serotonin syndrome risk with MAOI + SNRI: label-based + case context.',
 'FDA label (Pristiq 2017) — MAOI contraindication section + harmala alkaloid MAOI pharmacology + serotonin syndrome case literature',
 NULL,
 true,
 'ABSOLUTE_CONTRAINDICATION', 'TOXICITY_AMPLIFICATION', 'DANGER_INCREASE', 'HIGH', 'FDA_LABEL',
 'Washout required per Pristiq label: no MAOIs within 7 days of stopping Pristiq; no Pristiq within 14 days of stopping an MAOI. Ayahuasca harmala exposure should be treated as MAOI exposure. Specialist oversight required for washout planning.',
 'Hard block. Treat ayahuasca/harmala alkaloids as MAOI exposure. Enforce Pristiq label washout rules. Do not proceed with documentation for this protocol while Pristiq is active.',
 true, 'AYA-DESV-001',
 'oral', 'any', 'none', 'none', NULL, true)


ON CONFLICT (substance_name, interactor_name) DO UPDATE SET
  risk_bucket           = EXCLUDED.risk_bucket,
  interaction_type      = EXCLUDED.interaction_type,
  effect_direction      = EXCLUDED.effect_direction,
  confidence            = EXCLUDED.confidence,
  evidence_level        = EXCLUDED.evidence_level,
  washout_note          = EXCLUDED.washout_note,
  screening_note        = EXCLUDED.screening_note,
  is_bidirectional      = EXCLUDED.is_bidirectional,
  rule_key              = EXCLUDED.rule_key,
  severity_grade        = EXCLUDED.severity_grade,
  risk_level            = EXCLUDED.risk_level,
  clinical_description  = EXCLUDED.clinical_description,
  mechanism             = EXCLUDED.mechanism,
  evidence_source       = EXCLUDED.evidence_source,
  source_url            = EXCLUDED.source_url,
  is_verified           = EXCLUDED.is_verified,
  route_context         = EXCLUDED.route_context,
  timing_context        = EXCLUDED.timing_context,
  onset_shift_flag      = EXCLUDED.onset_shift_flag,
  gi_hydration_risk_flag = EXCLUDED.gi_hydration_risk_flag,
  vitals_masking_flag   = EXCLUDED.vitals_masking_flag,
  maoi_exposure_flag    = EXCLUDED.maoi_exposure_flag;


-- ============================================================
-- VERIFICATION QUERIES (run after execution to confirm success)
-- ============================================================
-- 1. Confirm 6 new columns exist (expect all 6 listed):
--    SELECT column_name, data_type
--    FROM information_schema.columns
--    WHERE table_name = 'ref_clinical_interactions'
--      AND column_name IN (
--        'route_context','timing_context','onset_shift_flag',
--        'gi_hydration_risk_flag','vitals_masking_flag','maoi_exposure_flag'
--      );
--
-- 2. Row counts by risk_bucket:
--    SELECT risk_bucket, COUNT(*) FROM ref_clinical_interactions
--    GROUP BY risk_bucket ORDER BY risk_bucket;
--
-- 3. Confirm all 3 new medications seeded (expect 10 rows each):
--    SELECT interactor_name, COUNT(*) AS interaction_count
--    FROM ref_clinical_interactions
--    WHERE interactor_name IN (
--      'Zepbound (tirzepatide)', 'Propranolol', 'Pristiq (desvenlafaxine)'
--    )
--    GROUP BY interactor_name;
--
-- 4. Confirm hard-block: Ayahuasca + Pristiq (expect ABSOLUTE_CONTRAINDICATION):
--    SELECT substance_name, interactor_name, risk_bucket, maoi_exposure_flag
--    FROM ref_clinical_interactions
--    WHERE substance_name = 'Ayahuasca'
--      AND interactor_name = 'Pristiq (desvenlafaxine)';
--
-- 5. Confirm strong caution: Ibogaine + Propranolol (expect STRONG_CAUTION):
--    SELECT substance_name, interactor_name, risk_bucket, vitals_masking_flag
--    FROM ref_clinical_interactions
--    WHERE substance_name = 'Ibogaine'
--      AND interactor_name = 'Propranolol';
--
-- 6. Duplicate rule_key check (expect 0 rows):
--    SELECT rule_key, COUNT(*) FROM ref_clinical_interactions
--    WHERE rule_key IS NOT NULL
--    GROUP BY rule_key HAVING COUNT(*) > 1;
-- ============================================================
