---
id: WO-227
status: 03_BUILD
owner: BUILDER
priority: P1
failure_count: 0
repeat_request: false
created: 2026-02-19
---

# WO-227: Substance Monograph Page — Full Rebuild (Partner Credibility Risk)

## User Prompt (verbatim)
"This page was one of the original core features requested by the partners to provide deep research and scientific data on the substances. Unless we populate this page with meaningful data, this page cannot be shipped because it's a destroyer of credibility. It's 95% filler or broken elements."

## Known Issues (user audit)
### Hero Section
- Molecule element and aggregate efficacy stacked vertically (requested: horizontal layout)
- Hero background is gradient with visible grid lines
- Subheading is bold and doesn't match CSS
- Filler text present: "REGISTRY ACCESS", "LIVE SEARCH ENRICHED", "INSTITUTIONAL RESEARCH NODE", "STRUCTURAL", "0X2500", "VERIFIED", "C20H25N3O", "AGGREGATE EFFICACY", "NODE_SIGMA"

### Registry Container
- 5 different fonts in one container, none matching CSS
- No tooltips
- Contains dev filler: "MOD_0x2500"

### Other Components
- "Affinity" component: no legend or label explanations
- "Clinical Velocity": no explanation, purpose unclear, looks like filler
- Filler text: "LIVE MONITORING ACTIVE", "GLOBAL SAFETY NODE INTELLIGENCE"
- "CLINICAL ARCHIVE" element: dead links, "FULL REGISTRY ACCESS" button non-functional, no purpose
- "NEURAL SYNTHESIS": not functioning

## Risk Level
🔴 HIGH — Partners were specifically promised this page. Shipping it in current state would damage credibility.

## Acceptance Criteria
- [ ] All filler text and dev artifacts removed
- [ ] Hero layout is horizontal (molecule + efficacy side by side)
- [ ] Single consistent font matching global CSS
- [ ] All components have meaningful, real data (or are gracefully hidden if data unavailable)
- [ ] All buttons link to real destinations or are removed
- [ ] Affinity component has legend
- [ ] No broken elements visible to user

## LEAD NOTES
Block the "View Full Monograph" buttons on SubstanceCatalog until this is resolved.
Route to BUILDER after DESIGNER provides layout spec.
