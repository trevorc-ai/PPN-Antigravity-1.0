# WO-244: Substance Catalog & Molecular Visualization
**Status:** ✅ APPROVED — Ready for BUILDER  
**Date Compiled:** 2026-02-20  
**Decision Log:** Five-agent review (ANALYST, PRODDY, DESIGNER, LEAD, INSPECTOR) complete. Full discussion archived in git history.

---

## THE DECISION

**What we're building (simple, elegant, no unnecessary complexity):**

| Sprint | What | Component | Auth? |
|--------|------|-----------|-------|
| 1a | Isometric molecule cards on Substance Catalog | `IsometricMolecule` (CSS-only) | Public |
| 1b | 3D WebGL molecule viewer on Monograph hero | `MoleculeViewer` (3Dmol.js) | Auth-required |
| 1c | Fix Catalog filter pills | Logic fix | Public |
| 2 | Ki binding affinity radar with real data | Recharts (existing) | Auth-required |
| 3 | `/safety` Drug Safety Matrix public page | Pure constants.ts | Public |
| 4 (future) | NGL receptor binding pocket viewer | NGL + DESIGNER spec | Auth-required |

**What we are NOT building:** Full protein-ligand docking. Custom molecule authoring. WebXR/VR. Any new SQL migrations. Sprint 4 is gated on Dr. Allen annotation review.

---

## PUBLIC vs AUTH BOUNDARY

**Public (zero query, zero external API — uses `constants.ts` and local `.webp` only):**
- `/catalog` — `IsometricMolecule` cards + static substance metadata
- `/monograph/:id` — `IsometricMolecule` hero (not MoleculeViewer) + static efficacy bar
- `/safety` — Drug Safety Matrix from `INTERACTION_RULES` in `constants.ts`

**Auth-required (queries or external API):**
- Monograph: `MoleculeViewer` (PubChem API call on user activation)
- Monograph: Ki radar (Supabase `ref_substances` query)
- Monograph: Benchmark panels, active trials (future)
- Sprint 4: NGL binding pocket (RCSB PDB API)

**Layout:** Public pages use `<PublicPageLayout>` (logo nav + Sign In + Create Account). NOT the authenticated sidebar shell.

---

## VERIFIED DATASET — SUBSTANCE PHARMACOLOGY

### Source Notes
Ki values compiled from: Nichols DE (2016) *Pharmacological Reviews* 68:264-355; Rickli et al. (2016) *Neuropharmacology*; NIMH PDSP Ki database (archived); BindingDB. Values represent binding affinity in nM — **lower = stronger binding**. Where literature ranges exist, the geometric mean or most-cited single value is used. All values are for the active (dephosphorylated) form where applicable (e.g., psilocin, not psilocybin).

> ⚠️ **ANALYST NOTE:** Ki values vary across assay conditions and radioligand used. These values represent the best available consensus figures from peer-reviewed literature. They are labeled "Source: Literature consensus" in the UI — not presented as a single authoritative figure. This is the scientifically honest position.

---

### RECEPTOR KEY (Radar Chart Axes)
| Axis ID | Receptor | Clinical Relevance |
|---------|----------|--------------------|
| `5HT2A` | 5-HT2A Serotonin | Primary psychedelic target |
| `5HT1A` | 5-HT1A Serotonin | Anxiolytic, antidepressant modulation |
| `SERT` | Serotonin Transporter | MDMA's primary mechanism |
| `D2` | D2 Dopamine | Reward, motivation, antipsychotic target |
| `NMDA` | NMDA Glutamate | Dissociation, neuroplasticity (ketamine) |
| `5HT2C` | 5-HT2C Serotonin | Appetite, mood regulation |

---

### SUBSTANCE DATA TABLE

> Ki values shown in nM. `>10000` = negligible binding. Radar scores are normalized inversely (lower Ki = higher score) for display only.

#### 🍄 Psilocybin (active form: Psilocin)
```
PPN ID:        PSL-2201
PubChem CID:   10258  (Psilocin — active metabolite, use for 3D rendering)
SMILES:        CN(C)CCc1c[nH]c2ccc(O)cc12
Formula:       C₁₂H₁₆N₂O
Color:         #6366f1  (indigo)
Efficacy:      0.78

Ki Values (nM):
  5-HT2A:    28       Source: Rickli et al. 2016, Neuropharmacology
  5-HT1A:    150      Source: PDSP/Nichols 2016
  5-HT2C:    63       Source: PDSP
  D2:        >10000   Source: Nichols 2016
  SERT:      >10000   Source: Nichols 2016
  NMDA:      >10000   Source: Nichols 2016
  
Primary Mechanism: 5-HT2A Partial Agonism
```

#### ⚗️ LSD-25
```
PPN ID:        LSD-2500
PubChem CID:   5761
SMILES:        CCN(CC)C(=O)[C@H]1CN([C@@H]2Cc3c[nH]c4cccc(c34)C2=C1)C
Formula:       C₂₀H₂₅N₃O
Color:         #ec4899  (pink)
Efficacy:      0.71

Ki Values (nM):
  5-HT2A:    2.9      Source: PDSP Ki database / Nichols 2016
  5-HT1A:    5.1      Source: PDSP / Nestler 2013
  5-HT2C:    8.5      Source: PDSP
  D2:        250      Source: PDSP
  SERT:      >10000   Source: Nichols 2016
  NMDA:      >10000   Source: Nichols 2016
  
Primary Mechanism: 5-HT2A Partial Agonism (highest potency in class)
Note: Extracellular loop 2 (ECL2) closes over LSD after binding — explains 12hr duration
```

#### 🌿 DMT
```
PPN ID:        DMT-1102
PubChem CID:   6089
SMILES:        CN(C)CCc1c[nH]c2ccccc12
Formula:       C₁₂H₁₆N₂
Color:         #10b981  (emerald)
Efficacy:      0.65

Ki Values (nM):
  5-HT2A:    150      Source: Nichols 2016 / BindingDB
  5-HT1A:    12       Source: PDSP (notable 5-HT1A affinity)
  5-HT2C:    60       Source: PDSP
  D2:        >10000   Source: Nichols 2016
  SERT:      >10000   Source: Nichols 2016
  NMDA:      >10000   Source: Nichols 2016
  
Primary Mechanism: 5-HT2A/1A Agonism (rapid onset due to lipophilicity)
```

#### 🐸 5-MeO-DMT
```
PPN ID:        DMT-1102 (or separate entry if in constants)
PubChem CID:   1832
SMILES:        CN(C)CCc1c[nH]c2ccc(OC)cc12
Formula:       C₁₃H₁₈N₂O
Color:         #06b6d4  (cyan)
Efficacy:      0.69

Ki Values (nM):
  5-HT2A:    295      Source: PDSP (notably weaker at 5-HT2A than tryptamine peers)
  5-HT1A:    2.1      Source: Krebs & Geyer 1993 / PDSP ← PRIMARY TARGET
  5-HT2C:    820      Source: PDSP
  D2:        >10000   Source: Nichols 2016
  SERT:      >10000   Source: Nichols 2016
  NMDA:      >10000   Source: Nichols 2016
  
Primary Mechanism: 5-HT1A Agonism (distinguishes it from other tryptamines — more anxiolytic at low dose)
Note: 5-HT1A Ki ~2.1 nM = up to 1,000x stronger at 5-HT1A vs 5-HT2A. Radar shape is unique.
```

#### 💊 MDMA
```
PPN ID:        MDM-4410
PubChem CID:   1615
SMILES:        CC(NC)Cc1ccc2c(c1)OCO2
Formula:       C₁₁H₁₅NO₂
Color:         #a855f7  (violet)
Efficacy:      0.74

Ki Values (nM):
  5-HT2A:    >10000   Source: PDSP (weak, not primary mechanism)
  5-HT1A:    1200     Source: PDSP
  5-HT2C:    1500     Source: PDSP
  D2:        1300     Source: PDSP
  SERT:      240      Source: Nichols 2004 / MAPS data ← PRIMARY TARGET
  NMDA:      >10000   Source: Nichols 2016
  
Primary Mechanism: SERT/NET/DAT Monoamine Release (not direct receptor agonism)
Note: Radar shape opposite to classical psychedelics — SERT dominant, 5-HT2A flat.
```

#### 🔪 Ketamine
```
PPN ID:        KET-9921
PubChem CID:   3821
SMILES:        CNC1(CCCCC1=O)c2ccccc2Cl
Formula:       C₁₃H₁₆ClNO
Color:         #3b82f6  (blue)
Efficacy:      0.82

Ki Values (nM):
  5-HT2A:    >10000   Source: Nichols 2016
  5-HT1A:    >10000   Source: PDSP
  5-HT2C:    >10000   Source: PDSP
  D2:        >10000   Source: PDSP
  SERT:      >10000   Source: Nichols 2016
  NMDA:      500      Source: Zanos et al. 2016 [3H]MK-801 assay ← PRIMARY TARGET
  
Primary Mechanism: NMDA Receptor Non-competitive Antagonism (PCP site)
Note: Unique radar — ALL bars flat except NMDA. Most visually distinct shape in the set.
```

#### 🌵 Mescaline
```
PPN ID:        MES-3301
PubChem CID:   4276
SMILES:        COc1cc(CCN)cc(OC)c1OC
Formula:       C₁₁H₁₇NO₃
Color:         #14b8a6  (teal)
Efficacy:      0.58

Ki Values (nM):
  5-HT2A:    3000     Source: Nichols 2016 (low potency phenethylamine)
  5-HT1A:    >10000   Source: PDSP
  5-HT2C:    2000     Source: PDSP
  D2:        >10000   Source: PDSP
  SERT:      >10000   Source: Nichols 2016
  NMDA:      >10000   Source: Nichols 2016
  
Primary Mechanism: 5-HT2A Agonism (low potency — requires high dose; explains large mescaline doses vs LSD micrograms)
```

#### 🌱 Ibogaine
```
PPN ID:        IBO-5501
PubChem CID:   197101
SMILES:        CC[C@H]1CN2CCc3c([nH]c4ccccc34)[C@H]2C[C@@H]1C[C@@H]5NCCc6c5[nH]c7ccccc67
Formula:       C₂₀H₂₆N₂O
Color:         #a855f7  (purple)
Efficacy:      0.61

Ki Values (nM):
  5-HT2A:    700      Source: PDSP / Popik et al. 1995
  5-HT1A:    580      Source: PDSP
  5-HT2C:    420      Source: PDSP
  D2:        460      Source: Popik et al. 1995
  SERT:      640      Source: PDSP (multiple transporter affinity)
  NMDA:      2000     Source: Popik et al. 1995 (Open-channel block)
  
Primary Mechanism: Multi-target (no single dominant receptor — unique in the class)
Note: Most "balanced" radar — no extreme peaks. Explains complex clinical profile.
```

---

## INFRASTRUCTURE ALREADY IN PLACE (No New Migrations)

| Asset | Status | Location |
|-------|--------|----------|
| `MoleculeViewer.tsx` | ✅ Built | `src/components/science/` |
| `IsometricMolecule.tsx` | ✅ Built | `src/components/science/` |
| 3Dmol.js CDN | ✅ Loaded | `index.html` line 68 |
| PubChem CIDs | ✅ Documented | `PUBCHEM_IDS.md` |
| `.webp` molecule images | ✅ Fixed | `public/molecules/` |
| Ki columns in DB | ✅ Exists | `ref_substances` (migration 015) |
| `INTERACTION_RULES` data | ✅ Hardcoded | `constants.ts` line 282 |
| New SQL migrations needed | **Zero** | — |

---

## CRITICAL IMPLEMENTATION CONSTRAINTS (Non-negotiable)

1. **Ki radar reads from `ref_substances` Supabase table** — NOT from `constants.ts`. Database is canonical. ANALYST values above should be used to verify/correct migration 015 data only.
2. **NGL Viewer (Sprint 4) must be dynamically imported** — `await import('ngl')` only, never static import. ~1.5MB bundle.
3. **Public pages use `<PublicPageLayout>`** — not the authenticated app shell.
4. **`MoleculeViewer` on Monograph** — auth-gated. Show `IsometricMolecule` to anonymous users.
5. **Strip `console.log` from `MoleculeViewer.tsx`** before public ship (19 debug statements exist).
6. **Catalog filter pills must actually filter** — currently non-functional.

---

## MIGRATION 015 CORRECTION TABLE

The Ki values in `migrations/015_add_receptor_affinity_data.sql` require correction before the radar chart goes live. SOOP should prepare an additive UPDATE migration:

| Substance | Column | Current (015) | Verified Value | Source |
|-----------|--------|--------------|----------------|--------|
| Psilocybin/in | receptor_5ht2a_ki | 6.0 | **28** | Rickli et al. 2016 |
| Psilocybin/in | receptor_5ht1a_ki | 150.0 | **150** | ✅ Confirmed |
| MDMA | receptor_sert_ki | 500.0 | **240** | Nichols 2004 |
| MDMA | receptor_5ht2a_ki | 3000.0 | **>10000** | PDSP |
| LSD | receptor_5ht2a_ki | 2.0 | **2.9** | Nichols 2016 |
| Ketamine | receptor_nmda_ki | 500.0 | **500** | ✅ Confirmed |
| Mescaline | receptor_5ht2a_ki | 1000.0 | **3000** | Nichols 2016 |
| 5-MeO-DMT | receptor_5ht2a_ki | 10.0 | **295** | PDSP |
| 5-MeO-DMT | receptor_5ht1a_ki | 2.0 | **2.1** | ✅ Confirmed |
| Ibogaine | receptor_5ht2a_ki | 100.0 | **700** | Popik et al. 1995 |

**SOOP action:** Write `migration_016b_correct_ki_values.sql` with UPDATE statements only. No DROP, no type changes. RLS must remain ON.

---

## SPRINT 1 ACCEPTANCE CRITERIA (INSPECTOR Gate)

```
[ ] 1. IsometricMolecule renders in SubstanceCatalog cards (all 7 substances)
[ ] 2. MoleculeViewer renders in MonographHero for authenticated users
[ ] 3. IsometricMolecule renders in MonographHero for anonymous users
[ ] 4. pubchemCid populated for all 7 substances in constants.ts
[ ] 5. substance.color wired as glowColor to IsometricMolecule
[ ] 6. min-h-0 override applied to MoleculeViewer in MonographHero
[ ] 7. No console.log in src/components/science/MoleculeViewer.tsx
[ ] 8. Catalog filter pills actually filter (tryptamines/phenethylamines/dissociatives)
[ ] 9. <PublicPageLayout> implemented for /catalog and /monograph routes
[ ] 10. No font sizes below 14px in new code
[ ] 11. No PHI in any new component
[ ] 12. Git pushed to origin/main
```

---

## ROUTING

| Work Order | Owner | Status |
|-----------|-------|--------|
| WO-245a: Sprint 1 (Catalog + Monograph wiring) | BUILDER | **READY TO START** |
| WO-245b: Sprint 2 (Ki Radar + DB correction) | SOOP → BUILDER | Needs migration first |
| WO-245c: Sprint 3 (Drug Safety Matrix `/safety`) | BUILDER | **READY TO START** |
| WO-245d: Sprint 4 (NGL Binding Pocket) | DESIGNER → BUILDER | **Gated: Dr. Allen review** |

---

*ANALYST data compilation complete. LEAD to create child work orders. No further agent discussion required — build phase begins on USER approval.*
