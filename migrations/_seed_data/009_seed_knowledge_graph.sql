-- ============================================================================
-- SEED DATA FOR KNOWLEDGE GRAPH
-- Use this if the table exists but is empty (count = 0)
-- ============================================================================

INSERT INTO public.ref_knowledge_graph 
  (substance_name, interactor_name, interactor_category, risk_level, severity_grade, clinical_description, mechanism, evidence_source, source_url, is_verified)
VALUES
  -- RULE-001
  ('Psilocybin', 'Lithium', 'Mood Stabilizer', 10, 'Life-Threatening', 
   'High risk of seizures, fugue state, and Hallucinogen Persisting Perception Disorder (HPPD). Even therapeutic doses of Lithium can lower the seizure threshold significantly when combined with tryptamines.',
   'Synergistic 5-HT2A potentiation & sodium channel modulation.',
   'National Library of Medicine / PubMed (2024)',
   'https://pubmed.ncbi.nlm.nih.gov/',
   true),
   
  -- RULE-002
  ('MDMA', 'SSRIs', 'Antidepressant (SSRI)', 9, 'High',
   'Blocks SERT transporter. Prevents MDMA uptake, neutralizing therapeutic effect (Subjective "0/10"). Higher doses to compensate may trigger Serotonin Syndrome.',
   'Competitive Inhibition at SERT Transporter.',
   'MAPS Public Benefit Corp',
   'https://maps.org',
   true),
   
  -- RULE-003
  ('MDMA', 'MAOIs', 'Antidepressant (MAOI)', 10, 'Life-Threatening',
   'Risk of fatal Serotonin Syndrome (Hyperthermia, Hypertensive Crisis). Absolute Contraindication.',
   'Inhibition of monoamine oxidase prevents serotonin metabolism, causing toxic accumulation.',
   'National Library of Medicine / PubMed',
   'https://pubmed.ncbi.nlm.nih.gov/',
   true),
   
  -- RULE-004
  ('Ketamine', 'Benzodiazepines', 'Anxiolytic', 6, 'Moderate',
   'Reduces the antidepressant efficacy of Ketamine. Increases sedation and amnesia risk.',
   'GABA-A allosteric modulation opposes glutamatergic surge.',
   'Yale School of Medicine',
   'https://medicine.yale.edu/',
   true),
   
  -- RULE-005
  ('Ketamine', 'Alcohol', 'CNS Depressant', 8, 'High',
   'Severe respiratory depression, profound motor impairment, nausea, and aspiration risk.',
   'Synergistic CNS Depression.',
   'National Institutes of Health (NIH)',
   'https://www.nih.gov/',
   true),
   
  -- RULE-006
  ('Psilocybin', 'SSRIs', 'Antidepressant (SSRI)', 5, 'Moderate',
   'Blunted subjective effects. May require higher dosage (20-30% increase) to achieve therapeutic breakthrough.',
   '5-HT2A receptor downregulation.',
   'Imperial College London',
   'https://www.imperial.ac.uk/',
   true),
   
  -- RULE-007
  ('LSD-25', 'Lithium', 'Mood Stabilizer', 10, 'Life-Threatening',
   'Extreme neurotoxicity, seizures, and comatose state reported. Absolute Contraindication.',
   'Unknown; hypothesized signal transduction amplification.',
   'Erowid / Clinical Case Reports',
   'https://erowid.org',
   true),
   
  -- RULE-008
  ('Ayahuasca', 'SSRIs', 'Antidepressant (SSRI)', 10, 'Life-Threatening',
   'Serotonin Syndrome risk due to MAOI content (Harmala alkaloids) in Ayahuasca.',
   'MAO-A Inhibition + Reuptake Blockade.',
   'ICEERS Safety Guide',
   'https://www.iceers.org/',
   true),
   
  -- RULE-009
  ('Ibogaine', 'QT-Prolonging Agents', 'Cardiac', 10, 'Life-Threatening',
   'High risk of Torsades de Pointes (Fatal Arrhythmia). Requires ECG monitoring.',
   'hERG Potassium Channel Blockade.',
   'Multidisciplinary Association for Psychedelic Studies',
   'https://maps.org',
   true),
   
  -- RULE-010
  ('MDMA', 'Stimulants', 'Stimulant', 8, 'High',
   'Excessive cardiovascular strain (Tachycardia, Hypertension). Neurotoxicity risk increases with body temp.',
   'Additive adrenergic stimulation.',
   'NIDA',
   'https://nida.nih.gov/',
   true)
ON CONFLICT (substance_name, interactor_name) DO NOTHING;
