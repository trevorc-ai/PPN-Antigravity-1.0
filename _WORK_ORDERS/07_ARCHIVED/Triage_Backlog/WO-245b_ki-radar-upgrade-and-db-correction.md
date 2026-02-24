---
status: 03_BUILD
owner: SOOP
failure_count: 0
priority: HIGH
created: 2026-02-20
sprint: 2
blocked_by: WO-245a (must complete first)
---

# WO-245b: Ki Radar Upgrade + Migration 015 Correction

## Context
The Affinity Radar chart on the Monograph page currently uses hardcoded placeholder values. `migrations/015_add_receptor_affinity_data.sql` already added Ki columns to `ref_substances` but the values have been verified against literature and require correction. Then BUILDER wires the radar to the database.

## Part A: SOOP — Correction Migration

Write `migrations/016b_correct_ki_values.sql`. UPDATE statements only. No DROP, no type changes. RLS remains ON.

### Corrections Required (verified against Nichols 2016, Rickli 2016, PDSP):

```sql
-- Psilocin at 5-HT2A: 6.0 → 28 nM (Rickli et al. 2016)
UPDATE public.ref_substances SET receptor_5ht2a_ki = 28.0
WHERE substance_name ILIKE '%psilocybin%' OR substance_name ILIKE '%psilocin%';

-- MDMA SERT: 500 → 240 nM (Nichols 2004); 5-HT2A: 3000 → >10000
UPDATE public.ref_substances SET receptor_sert_ki = 240.0, receptor_5ht2a_ki = 10000.0
WHERE substance_name ILIKE '%mdma%';

-- LSD 5-HT2A: 2.0 → 2.9 nM (Nichols 2016)
UPDATE public.ref_substances SET receptor_5ht2a_ki = 2.9
WHERE substance_name ILIKE '%lsd%';

-- Mescaline 5-HT2A: 1000 → 3000 nM (low potency phenethylamine, Nichols 2016)
UPDATE public.ref_substances SET receptor_5ht2a_ki = 3000.0
WHERE substance_name ILIKE '%mescaline%';

-- 5-MeO-DMT: 5-HT2A 10 → 295 nM; 5-HT1A confirmed at 2.1 nM
UPDATE public.ref_substances SET receptor_5ht2a_ki = 295.0, receptor_5ht1a_ki = 2.1
WHERE substance_name ILIKE '%5-meo%';

-- Ibogaine 5-HT2A: 100 → 700 nM (Popik et al. 1995)
UPDATE public.ref_substances SET receptor_5ht2a_ki = 700.0
WHERE substance_name ILIKE '%ibogaine%';

-- Ketamine NMDA: 500 confirmed ✅ no change needed
-- DMT 5-HT2A: Update to 150 nM (Nichols 2016)
UPDATE public.ref_substances SET receptor_5ht2a_ki = 150.0, receptor_5ht1a_ki = 12.0
WHERE substance_name ILIKE '%dmt%' AND substance_name NOT ILIKE '%5-meo%' AND substance_name NOT ILIKE '%methoxy%';
```

**SOOP constraints:** Additive UPDATEs only. No schema changes. RLS must remain ON. Include DO block for verification:
```sql
DO $$ BEGIN
  RAISE NOTICE '✅ Migration 016b: Ki value corrections applied.';
END $$;
```

After SOOP completes → hand off to BUILDER.

---

## Part B: BUILDER — Wire Radar to Database

### Supabase query in SubstanceMonograph.tsx
```typescript
const [kiData, setKiData] = useState<any>(null);

useEffect(() => {
  if (!sub) return;
  supabase
    .from('ref_substances')
    .select('receptor_5ht2a_ki, receptor_5ht1a_ki, receptor_5ht2c_ki, receptor_d2_ki, receptor_sert_ki, receptor_nmda_ki, primary_mechanism')
    .ilike('substance_name', `%${sub.name.split(' ')[0]}%`)
    .single()
    .then(({ data }) => setKiData(data));
}, [sub]);
```

### Radar chart normalization (Ki → radar score)
Lower Ki = stronger binding = higher radar score. Use inverse log scale:
```typescript
const kiToScore = (ki: number | null): number => {
  if (!ki || ki >= 10000) return 0;
  // Score 0-100: Ki of 1nM → 100, Ki of 10000nM → 0
  return Math.max(0, Math.round(100 - (Math.log10(ki) / Math.log10(10000)) * 100));
};
```

### Radar data shape:
```typescript
const radarData = [
  { axis: '5-HT2A', score: kiToScore(kiData?.receptor_5ht2a_ki), ki: kiData?.receptor_5ht2a_ki },
  { axis: '5-HT1A', score: kiToScore(kiData?.receptor_5ht1a_ki), ki: kiData?.receptor_5ht1a_ki },
  { axis: '5-HT2C', score: kiToScore(kiData?.receptor_5ht2c_ki), ki: kiData?.receptor_5ht2c_ki },
  { axis: 'D2', score: kiToScore(kiData?.receptor_d2_ki), ki: kiData?.receptor_d2_ki },
  { axis: 'SERT', score: kiToScore(kiData?.receptor_sert_ki), ki: kiData?.receptor_sert_ki },
  { axis: 'NMDA', score: kiToScore(kiData?.receptor_nmda_ki), ki: kiData?.receptor_nmda_ki },
];
```

### Radar fill color
Use `substance.color` for the radar fill/stroke. Animate morph when sub changes.

### Tooltip on each radar axis
On hover: "5-HT2A: 2.9 nM — Source: Nichols 2016, Pharmacological Reviews"
Font: min 14px.

### Loading state
Show skeleton radar (grey outline) while Supabase query loads. Do not show empty/broken.

## Acceptance Criteria
```
[ ] 1. Migration 016b exists and UPDATE counts match expected substance rows
[ ] 2. grep -n "ref_substances" src/pages/SubstanceMonograph.tsx → returns result
[ ] 3. Radar values change visually between Psilocybin and Ketamine monographs
[ ] 4. Ketamine monograph: only NMDA axis has height; all others flat
[ ] 5. MDMA monograph: only SERT axis has height; 5-HT2A flat
[ ] 6. Radar fill color matches substance.color
[ ] 7. Hover tooltip shows Ki value + source text ≥ 14px
[ ] 8. No Ki values hardcoded in constants.ts
[ ] 9. git log shows (HEAD -> main, origin/main)
```
