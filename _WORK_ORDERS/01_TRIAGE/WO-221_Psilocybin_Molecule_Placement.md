---
status: 01_TRIAGE
owner: PRODDY
failure_count: 0
priority: LOW
created: 2026-02-19
---

# WO-221: Psilocybin Molecule — Brand Placement Decision

## User Request (verbatim)
> "I would like to get one custom, super cool 3D psilocybin molecule design designed and get rid of the molview image. I even uploaded a molecule visualization skill for designer."
> "Sure, I'm open minded, but ultimately I'll let designer and proddy and marketer decide."

## Context
- `src/components/PPNLogo.tsx` has been REBUILT (2026-02-19) with a scientifically accurate psilocybin molecule using 3Dmol.js (PubChem CID 10624, public domain data)
- The component supports sizes: `sm | md | lg | xl`, `animated` prop, `showLabel` prop
- It is currently ORPHANED — not rendered anywhere in the app
- The old SVG hexagonal molecule was inspired by molview.com (IP flag, not original art)
- The `/molecules` and `/isometric-molecules` routes exist as demo pages using separate implementations

## IP Note
- New PPNLogo.tsx uses PubChem public domain data — clean
- Old hexagonal SVG is removed

## Decisions Needed (PRODDY → DESIGNER → MARKETER)

### PRODDY
- [ ] Where does the molecule fit in the brand narrative? (science-forward, trust signal, identity icon?)
- [ ] Should it appear on public-facing pages (landing) or only inside the app?
- [ ] Does the molecule compete with or complement the current landing hero animation?

### DESIGNER
- [ ] Placement studies: sidebar icon, landing hero, login screen, loading splash?
- [ ] Size and framing at each breakpoint
- [ ] Should it replace the current indigo square icon in the sidebar, or sit alongside the wordmark?
- [ ] Note: molecular-visualization SKILL.md is available

### MARKETER
- [ ] Does using a psilocybin molecule prominently on the landing page help or hurt first impressions with risk-averse institutional buyers?
- [ ] Context: Dr. Jason Allen is a vocal advocate — scientific credibility angle is strong

## Ready to Deploy
Once decision is made, BUILDER connects `<PPNLogo />` import to chosen location. No further code work needed before that decision.
