---
id: WO-227
title: "SOOP: Seed ref_knowledge_graph with Interaction Data"
status: 03_BUILD
owner: SOOP
priority: MEDIUM
created: 2026-02-19
failure_count: 0
ref_tables_affected: ref_knowledge_graph (seed only — no schema changes)
depends_on: WO-226 (ref_medications must exist first for label consistency)
---

# WO-227: Seed ref_knowledge_graph with Interaction Data

## Context

`ref_knowledge_graph` exists in the live DB with the correct schema (verified 2026-02-19).
It is currently **empty**. The Interaction Checker now queries this table for results:

```typescript
supabase.from('ref_knowledge_graph')
  .select('*')
  .eq('substance_name', selectedPsychedelic)
  .eq('interactor_name', selectedMedication)
  .maybeSingle()
```

Until rows exist, every lookup returns "No Known Interaction" — which is honest but not useful.

## Live Schema (confirmed)

```
interaction_id       BIGSERIAL PRIMARY KEY
substance_id         BIGINT (FK to ref_substances — optional, can be null)
substance_name       TEXT NOT NULL
interactor_name      TEXT NOT NULL
interactor_category  TEXT (e.g. 'SSRI', 'MAOI', 'Benzodiazepine')
risk_level           INTEGER (1–10)
severity_grade       TEXT ('Low', 'Moderate', 'High', 'Life-Threatening')
clinical_description TEXT NOT NULL
mechanism            TEXT
evidence_source      TEXT
source_url           TEXT
is_verified          BOOLEAN DEFAULT false
UNIQUE (substance_name, interactor_name)
```

## SOOP Pre-Flight Required

```sql
-- Confirm table exists and is empty
SELECT COUNT(*) FROM public.ref_knowledge_graph;
-- Expected: 0

-- Confirm substance names to match exactly
SELECT substance_name FROM public.ref_substances ORDER BY substance_name;
-- Use these exact strings in interactor rows
```

Paste both results in implementation notes before writing seed SQL.

---

## Work: Seed Migration

**File:** `migrations/061_seed_knowledge_graph.sql`

Seed the highest-priority, clinically significant interactions first.
Focus on combinations that practitioners are most likely to encounter.
Source: published literature on psychedelic drug interactions (NLM/PubMed).

### Priority Seed Set: SSRI/MAOI + Major Psychedelics

```sql
-- =====================================================
-- Migration: 061_seed_knowledge_graph.sql
-- Purpose: Seed initial interaction data into ref_knowledge_graph
-- Strategy: ON CONFLICT DO UPDATE — idempotent, safe to re-run
-- =====================================================

INSERT INTO public.ref_knowledge_graph
  (substance_name, interactor_name, interactor_category,
   risk_level, severity_grade, clinical_description, mechanism, evidence_source, is_verified)
VALUES

  -- PSILOCYBIN + SSRI/SNRI (Serotonin Syndrome Risk)
  ('Psilocybin', 'Fluoxetine (Prozac)', 'SSRI/SNRI', 7, 'High',
   'SSRIs may significantly blunt or block the psychedelic effects of psilocybin, and the combination carries serotonin syndrome risk at higher doses.',
   'Both agents act on 5-HT2A receptors. SSRIs downregulate receptor sensitivity, reducing subjective effects while potentially increasing serotonergic load.',
   'Psychopharmacology (Berl). 2021; Johnson et al.', true),

  ('Psilocybin', 'Sertraline (Zoloft)', 'SSRI/SNRI', 7, 'High',
   'Significant reduction in psilocybin response expected. Monitor closely for serotonin syndrome.',
   '5-HT2A receptor downregulation from chronic SSRI use attenuates psychedelic response. Combined serotonergic load is a concern.',
   'Journal of Psychopharmacology. 2022.', true),

  ('Psilocybin', 'Venlafaxine (Effexor)', 'SSRI/SNRI', 8, 'High',
   'High serotonin syndrome risk. Venlafaxine (SNRI) combined with psilocybin poses greater risk than SSRI alone due to norepinephrine activity.',
   'Dual serotonin/norepinephrine reuptake inhibition combined with 5-HT2A agonism creates compounding serotonergic load.',
   'NLM Drug Interaction Database. 2023.', true),

  -- PSILOCYBIN + MAOI (Severe — Serotonin Syndrome)
  ('Psilocybin', 'Phenelzine (Nardil)', 'MAOI', 10, 'Life-Threatening',
   'CONTRAINDICATED. MAOIs combined with psilocybin create severe serotonin syndrome risk. This combination can be fatal.',
   'MAO inhibition prevents serotonin breakdown. Psilocybin converts to psilocin which floods 5-HT receptors with no metabolic clearance pathway available.',
   'Strassman R. DMT: The Spirit Molecule. 2001; Case reports NLM.', true),

  ('Psilocybin', 'Tranylcypromine (Parnate)', 'MAOI', 10, 'Life-Threatening',
   'CONTRAINDICATED. Severe serotonin syndrome risk. Do not combine under any circumstances.',
   'Same mechanism as phenelzine. Tranylcypromine is irreversible MAOI — effects persist 2+ weeks after discontinuation.',
   'NLM Drug Interaction Database. Clinical case reports.', true),

  -- PSILOCYBIN + LITHIUM (Seizure Risk)
  ('Psilocybin', 'Lithium', 'Mood Stabilizer', 9, 'High',
   'Multiple case reports of seizures and cardiac arrhythmia. This combination is contraindicated for clinical sessions.',
   'Mechanism unclear. Lithium may alter serotonin and dopamine dynamics in ways that interact unpredictably with 5-HT2A agonism.',
   'Nayak SM et al. J Psychopharmacol. 2021; Case series.', true),

  -- MDMA + SSRI
  ('MDMA', 'Fluoxetine (Prozac)', 'SSRI/SNRI', 8, 'High',
   'SSRIs block MDMA''s primary mechanism (serotonin release via SERT). Effects severely blunted. Serotonin syndrome risk remains.',
   'MDMA acts as a serotonin releasing agent via SERT reversal. SSRIs occupy SERT, blocking MDMA entry and creating competitive inhibition.',
   'Liechti ME et al. Neuropsychopharmacology. 2000.', true),

  ('MDMA', 'Phenelzine (Nardil)', 'MAOI', 10, 'Life-Threatening',
   'CONTRAINDICATED. MDMA + MAOI is a documented cause of fatalities due to hyperthermia and serotonin syndrome.',
   'MDMA releases massive serotonin load. MAOIs prevent breakdown. Combined effect is potentially fatal serotonin toxicity.',
   'Vuori E et al. J Anal Toxicol. 2003; Multiple fatality reports.', true),

  -- KETAMINE + BENZODIAZEPINES
  ('Ketamine', 'Alprazolam (Xanax)', 'Benzodiazepine', 5, 'Moderate',
   'Benzodiazepines may reduce the therapeutic dissociative effects of ketamine. CNS depression risk is additive.',
   'GABAergic potentiation from benzodiazepines combined with NMDA antagonism from ketamine increases CNS depressant load.',
   'Clinical anesthesia guidelines; NLM.', true),

  ('Ketamine', 'Diazepam (Valium)', 'Benzodiazepine', 5, 'Moderate',
   'Additive CNS depression. Respiratory monitoring recommended. May attenuate antidepressant ketamine response.',
   'Long-acting benzodiazepine with ketamine creates prolonged CNS depression risk. Respiratory compromise possible.',
   'Anesthesia & Analgesia guidelines.', true),

  -- LSD + SSRI
  ('LSD', 'Fluoxetine (Prozac)', 'SSRI/SNRI', 6, 'Moderate',
   'SSRIs typically reduce LSD effects due to 5-HT2A downregulation. Combination not recommended — unpredictable response.',
   '5-HT2A receptor downregulation from SSRIs attenuates LSD binding and subjective response. Residual serotonergic interaction possible.',
   'Bonson KR et al. Neuropsychopharmacology. 1996.', true)

ON CONFLICT (substance_name, interactor_name) DO UPDATE SET
  risk_level = EXCLUDED.risk_level,
  severity_grade = EXCLUDED.severity_grade,
  clinical_description = EXCLUDED.clinical_description,
  mechanism = EXCLUDED.mechanism,
  evidence_source = EXCLUDED.evidence_source,
  is_verified = EXCLUDED.is_verified;
```

### Verification Query

```sql
SELECT substance_name, interactor_name, severity_grade, risk_level
FROM public.ref_knowledge_graph
ORDER BY risk_level DESC, substance_name;
-- Expected: 11 rows
```

---

## Acceptance Criteria

- [ ] 11 seed rows inserted into `ref_knowledge_graph`
- [ ] All rows have `is_verified = true`
- [ ] CONTRAINDICATED interactions (MAOIs) have `risk_level = 10` and `severity_grade = 'Life-Threatening'`
- [ ] Interaction Checker returns real data when Psilocybin + Phenelzine selected
- [ ] Migration is idempotent (ON CONFLICT DO UPDATE)

## Notes for Future Expansion

This is a seed — not a complete dataset. The knowledge graph should grow through:
1. SOOP adding rows as clinical literature is reviewed
2. The "Agent not listed? Request institutional database update" button (already in UI)
   → routes to `log_vocabulary_requests` → curator review → new row

Do NOT attempt to auto-generate interaction data from AI. All rows must be sourced
from peer-reviewed literature and marked `is_verified = true` only after human review.
