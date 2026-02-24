---
status: 08_BACKLOG
owner: DESIGNER
failure_count: 0
priority: MEDIUM
created: 2026-02-20
sprint: 4
blocked_by: "WO-245a, WO-245b (must ship first) + Dr. Allen annotation review + DESIGNER UX spec"
gate: "USER must explicitly approve before BUILDER starts. Dr. Allen sign-off required on annotation text OR USER written waiver."
---

# WO-245d: NGL Receptor Binding Pocket Viewer (Phase 2 — GATED)

## Context
The NGL-powered receptor binding pocket viewer is the most advanced visualization in the platform. Psilocin shown inside the 5-HT2A receptor. LSD's extracellular loop "lid" visible and annotated. This is Dr. Allen's specific request and PPN's strongest scientific differentiator. It is gated until prerequisites are met.

## Gate Conditions (ALL must be true before this ticket moves to 03_BUILD)

```
[ ] WO-245a shipped and approved by INSPECTOR
[ ] WO-245b shipped and approved by INSPECTOR  
[ ] DESIGNER has written Staged Reveal UX spec (States 1-4 wireframes)
[ ] Binding pocket preview PNG images generated (PyMOL or equivalent) and committed to public/binding_pockets/
[ ] Annotation text written per substance (ANALYST) and reviewed by Dr. Allen OR USER waiver issued
[ ] USER formally approves moving this ticket to 03_BUILD
```

## Pre-Work (Can Begin Now, Parallel to Sprint 1)

### DESIGNER — Staged Reveal UX Spec
Define the four interaction states for the binding pocket panel:
- **State 1 COLLAPSED:** Preview PNG + substance × receptor label + "Initialize Receptor View" button (auth-only)
- **State 2 LOADING:** Progress bar "Fetching PDB structure..." (3-5s)
- **State 3 ACTIVE:** Full NGL viewer — protein ribbon + drug molecule + highlighted pocket
- **State 4 ANNOTATED:** CSS overlay callout labels connected by SVG leader lines on hover

### ANALYST — Annotation Text Per Substance
For each substance × receptor pair, write 2-3 annotation callouts (max 1 sentence each):
- Drug molecule: "Indole ring — primary 5-HT2A contact point"
- Binding pocket: "Orthosteric site — where endogenous serotonin and psilocin compete"
- Unique structural note: (substance-specific clinical relevance)

All annotation text must be reviewed by Dr. Allen or equivalent pharmacology expert before shipping.

### BUILDER — PyMOL Preview Images (~ 2 hours, one-time)
Generate static preview PNGs for collapsed state and mobile fallback:

```python
# Run headless via: pymol -cq render_binding_pockets.py
import pymol
from pymol import cmd

structures = {
    'psilocybin': ('7WC5', 'PSN'),   # Psilocin × 5-HT2A
    'lsd':        ('7WC4', 'LSD'),   # LSD × 5-HT2A (if available)
    'ketamine':   ('7LCN', 'KET'),   # Ketamine × NMDA (verify PDB ID)
    'mdma':       ('7F4D', 'MDM'),   # MDMA × 5-HT2B (verify PDB ID)
}

for name, (pdb_id, ligand) in structures.items():
    cmd.reinitialize()
    cmd.fetch(pdb_id)
    cmd.show_as('cartoon', 'protein')
    cmd.show('sticks', f'resname {ligand}')
    cmd.color('slate', 'protein')
    cmd.color('yellow', f'resname {ligand}')
    cmd.zoom(f'resname {ligand}', 8)
    cmd.png(f'public/binding_pockets/{name}_receptor.png', width=1200, height=800, dpi=150, ray=0)
```

Commit PNGs to `public/binding_pockets/`. Not to be bundled — served as static assets.

---

## Build Spec (When Gates Clear)

### PDB ID Reference Table (ANALYST verified)
| Substance | PDB ID | Receptor | Resolution | Notes |
|-----------|--------|----------|------------|-------|
| Psilocin | 7WC5 | 5-HT2A | 3.2 Å | Fan et al. 2022, Nature |
| LSD | 7WC4 | 5-HT2A | — | Fan et al. 2022 |
| LSD (long-acting) | 7F3N | 5-HT2A | — | Shows ECL2 "lid" |
| MDMA | 7F4D | 5-HT2B | — | Xu et al. 2021 |
| Ketamine | Verify at RCSB | NMDA | — | BUILDER to verify before using |

### Critical Architecture Constraints (LEAD — Non-Negotiable)

```typescript
// MANDATORY — NGL must be dynamically imported ONLY:
const initNGLViewer = async () => {
  const NGL = await import('ngl');  // ← dynamic only, never static import
  // ~1.5MB loads ONLY when user clicks "Initialize Receptor View"
};

// Timeout + fallback required:
const PDB_TIMEOUT_MS = 10000;
const controller = new AbortController();
setTimeout(() => controller.abort(), PDB_TIMEOUT_MS);
// On abort: setFallbackMode(true) → show static preview PNG
```

### Annotation System (DESIGNER spec)
- Annotations rendered as absolutely positioned CSS divs OVER the NGL canvas — NOT inside WebGL
- Connected to predefined screen positions with SVG `<line>` elements
- Positions hardcoded per substance (updated on window resize)
- Screen reader: `aria-label` on annotation container
- All annotation text ≥ 14px, paired with text label (never color-only)

### Mobile Behavior
- Mobile: Show static preview PNG only. Hide "Initialize" button. Show "Desktop required for interactive view."
- Desktop: Full NGL interaction

### Auth Gate
Button reads: "Initialize Receptor View" — visible only to authenticated users.
Anonymous users see: preview PNG + "Sign in to access receptor binding visualization →"

## Acceptance Criteria (Pre-populated for when Sprint 4 runs)
```
[ ] NGL imported dynamically (grep -n "await import.*ngl" → returns result)
[ ] No static NGL import in bundle (npx vite-bundle-analyzer confirms ngl not in main chunk)
[ ] ReceptorBindingPanel component exists in src/components/substance/
[ ] Staged reveal works: Collapsed → Loading → Active → Annotated
[ ] CSS annotation overlays visible and positioned correctly on Psilocybin/7WC5
[ ] Mobile shows static PNG, hides Initialize button
[ ] FCP regression < 100ms vs Sprint 1 baseline
[ ] Dr. Allen annotation review completed (confirmation message or USER waiver)
[ ] git log shows (HEAD -> main, origin/main)
```

---
*LEAD routing: This ticket stays in 08_BACKLOG until ALL gate conditions are met. DESIGNER and ANALYST can begin pre-work immediately. BUILDER does NOT touch this until LEAD formally moves it to 03_BUILD.*
