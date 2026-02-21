---
status: 03_BUILD
owner: BUILDER
failure_count: 0
priority: HIGH
created: 2026-02-20
sprint: 1
---

# WO-245a: Substance Catalog & Monograph — Component Wiring

## Context
All components and data are already built. This is an integration task only — wiring existing `IsometricMolecule` and `MoleculeViewer` into the live Catalog and Monograph pages, adding `pubchemCid` to constants, fixing filter pills, and implementing a public layout. See full data spec: `.agent/research/WO244_MOLECULAR_VIZ_ANALYST_BRIEF.md`

## Tasks

### 1. Update `constants.ts` — Add pubchemCid and smiles to each substance
Add the following fields to the `Substance` type and all 7 substance objects:

| Substance | pubchemCid | smiles |
|-----------|-----------|--------|
| Psilocybin | 10258 (psilocin, active form) | `CN(C)CCc1c[nH]c2ccc(O)cc12` |
| LSD-25 | 5761 | `CCN(CC)C(=O)[C@H]1CN([C@@H]2Cc3c[nH]c4cccc(c34)C2=C1)C` |
| DMT | 6089 | `CN(C)CCc1c[nH]c2ccccc12` |
| 5-MeO-DMT | 1832 | `CN(C)CCc1c[nH]c2ccc(OC)cc12` |
| MDMA | 1615 | `CC(NC)Cc1ccc2c(c1)OCO2` |
| Ketamine | 3821 | `CNC1(CCCCC1=O)c2ccccc2Cl` |
| Mescaline | 4276 | `COc1cc(CCN)cc(OC)c1OC` |
| Ibogaine | 197101 | `CC[C@H]1CN2CCc3c([nH]c4ccccc34)[C@H]2C[C@@H]1...` |

### 2. Create `<PublicPageLayout>` component (≈ 2 hours)
`src/components/layouts/PublicPageLayout.tsx`
- Minimal top nav: PPN logo (left) + "Sign In" and "Create Account" buttons (right)
- Dark background matching site palette
- No sidebar, no subscription badges, no avatar
- Wrap `/catalog` and `/monograph/:id` — use this layout when `!session` and the authenticated layout when `session` exists

### 3. Swap `SubstanceCatalog.tsx` — Replace `<img>` with `<IsometricMolecule>`
- Import: `import { IsometricMolecule } from '../components/science';`
- Replace the `<img src={sub.imageUrl}.../>` in the card image well
- Props: `image={sub.imageUrl}`, `name={sub.name}`, `formula={sub.formula}`, `glowColor={sub.color}`, `tiltOnHover={true}`
- **Do NOT** use `MoleculeViewer` here — CSS-only (IsometricMolecule) only on the catalog

### 4. Fix Catalog Filter Pills to Actually Filter
Currently the filter buttons (Tryptamines, Phenethylamines, Dissociatives, All) do nothing.
Wire them to filter the `SUBSTANCES` array by `sub.class` value. State: `const [filter, setFilter] = useState('All');`

### 5. Swap `MonographHero.tsx` — Conditional MoleculeViewer / IsometricMolecule
- Auth check via `useSession()` from Supabase auth
- When authenticated: render `<MoleculeViewer pubchemCid={substance.pubchemCid} smiles={substance.smiles} placeholderImage={substance.imageUrl} autoRotate={true} className="w-full h-full [&_.molecule-canvas]:min-h-0 [&_.molecule-canvas]:h-full" />`
- When NOT authenticated: render `<IsometricMolecule image={substance.imageUrl} glowColor={substance.color} tiltOnHover={true} />`
- Add `pubchemCid?: number; smiles?: string; color?: string;` to the `substance` prop interface

### 6. Strip console.log from `MoleculeViewer.tsx`
Remove all 19 `console.log` statements. Keep `console.error` on genuine failure paths, prefixed with `[MoleculeViewer]`.

## Acceptance Criteria
```
[ ] 1. grep -n "IsometricMolecule" src/pages/SubstanceCatalog.tsx → returns import + usage
[ ] 2. grep -n "MoleculeViewer" src/components/substance/MonographHero.tsx → returns import + usage  
[ ] 3. grep -c "pubchemCid" src/constants.ts → returns ≥ 7
[ ] 4. grep -n "glowColor.*color" src/pages/SubstanceCatalog.tsx → returns result
[ ] 5. grep -n "min-h-0" src/components/substance/MonographHero.tsx → returns result
[ ] 6. grep -c "console\.log" src/components/science/MoleculeViewer.tsx → returns 0
[ ] 7. Browser: DevTools Console on /catalog → document.querySelectorAll('canvas').length = 0
[ ] 8. Browser: Clicking "Tryptamines" filter shows only tryptamine substances
[ ] 9. grep -n "PublicPageLayout" src/pages/SubstanceCatalog.tsx → returns result
[ ] 10. No text below 14px (text-xs banned in body/label contexts)
[ ] 11. git log --oneline -1 shows (HEAD -> main, origin/main)
```

## Do NOT
- Add Ki values to `constants.ts` (they live in `ref_substances` Supabase table)
- Use MoleculeViewer on the public-facing catalog cards
- Statically import NGL viewer (not this sprint)
- Create any new SQL migrations (none needed)
