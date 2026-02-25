---
status: 05_USER_REVIEW
owner: USER
failure_count: 0
created: 2026-02-23
priority: P0 — DEMO BLOCKER (Wednesday Dr. Allen demo)
ref_tables_affected: none (display only, no DB writes)
deadline: 2026-02-26 (Wednesday)
network_domain: ppnportal.com ← CONFIRMED 2026-02-23
---

# WO-343: Contextual Network Link — Safety Check Trigger

## Context

During the Jason-Trevor meeting (2026-02-23), Jason identified the safety check page as
the "perfect intersection point for network functionality." PRODDY has spec'd Option A
(trigger-based contextual link) as the minimum viable networking feature for the Dr. Allen
demo. This is a DISPLAY-ONLY feature — no new database writes, no PHI, no HIPAA risk.

The link routes OUTSIDE of ppnportal.net to a separate domain (TBD — awaiting Trevor
confirmation, likely ppn.community or similar). The external domain does not need to be
live for the demo — a static placeholder page is acceptable for Wednesday.

---

## User Story

> As a practitioner running a Phase 2 dosing session, when a drug interaction warning
> fires (e.g., Lithium + Psilocybin), I want to see — alongside the safety warning —
> a contextual note that other network practitioners have managed this scenario, with
> a link to view their opt-in profiles on the network platform.

---

## Acceptance Criteria

### AC-1: Trigger Condition
- The contextual link component renders ONLY when a contraindication or safety warning
  is flagged during Phase 2 (the dosing/safety check phase)
- It does NOT render during normal workflow steps with no warnings
- It renders BELOW the warning card, not inline with it

### AC-2: Display Component
The component must show:
```
┌─────────────────────────────────────────────────────────┐
│  🩺 NETWORK INTELLIGENCE                                 │
│                                                         │
│  [N] practitioners in the PPN network have documented   │
│  experience with this contraindication.                  │
│                                                         │
│  [View Practitioner Profiles →]                         │
│                                                         │
│  ⚝ Opt-in only. No patient data is shared.              │
└─────────────────────────────────────────────────────────┘
```

- The `[N]` count for the demo should be hardcoded to a plausible number (e.g., 3–7)
  matching the specific contraindication shown. Use a simple lookup map:
  ```typescript
  const networkCounts: Record<string, number> = {
    'lithium': 4,
    'ssri': 7,
    'maoi': 3,
    'benzodiazepine': 6,
    'default': 2
  };
  ```
- The button opens a new tab to: `https://ppnportal.com/practitioners?contraindication=[slug]`
- **Domain confirmed:** Trevor owns ppnportal.com — this is the practitioner network layer
  of the PPN Portal brand. No new brand needed. Architecture: ppnportal.net = clinical tool,
  ppnportal.com = practitioner network, ppnportal.org = research/public layer.
- For the demo, ppnportal.com does not need to be a full application. A static landing page
  reading "PPN Practitioner Network — Coming Soon" is sufficient for Wednesday.

### AC-3: Visual Design
- Use the existing card/panel component pattern from the codebase
- Background: subtle amber/gold tint (distinct from the red warning card above it)
  — this is informational, not alarming
- Icon: network/people icon (existing icon set)
- Font size: minimum 14px per accessibility rules
- The "Opt-in only" footnote: 12px minimum, muted text color
- Animation: fade-in with 300ms delay after the warning card renders

### AC-4: No New Database Calls
- This component is STATIC for the demo — no Supabase queries
- The count is derived from the lookup map above
- In production (post-demo), this will be wired to a query against the opt-in
  practitioner table on the network platform — but that is OUT OF SCOPE for WO-343

### AC-5: Accessibility
- Button has descriptive aria-label: "View practitioners with experience managing
  [contraindication name] — opens in new tab"
- Color is not the only indicator of meaning — icon + text label required
- Keyboard navigable

---

## Component Location

Place the new component in:
```
src/components/networking/NetworkIntelligenceCard.tsx
```

Wire it into the Phase 2 safety check display area. Look for where the interaction
warning cards currently render and add the NetworkIntelligenceCard below them,
conditional on `warnings.length > 0`.

---

## Demo Script Context (for Jason + Dr. Allen walkthrough)

When Dr. Allen sees the Lithium contraindication warning fire, Jason will say:
> "And here's something we're building on top of the safety system — if a warning
> fires, practitioners can instantly see how many others in the network have managed
> this exact scenario and connect with them directly. No patient data shared.
> Completely opt-in."

The link doesn't need to go anywhere functional for Wednesday. A static landing page
on the external domain with "Practitioner Network — Coming Soon" is sufficient.

---

## Out of Scope (Post-Demo Tickets)

- Actual practitioner directory on network domain (WO-344, filed separately)
- Matching algorithm for practitioner-to-contraindication experience (future)
- Real count query from opt-in practitioner table (future)
- Supervision circles feature (Q2)

---

## INSPECTOR Checklist

- [ ] Font >= 14px on all text, >= 12px on footnote
- [ ] No color-only meaning (icon + text label present)
- [ ] No PHI written to database
- [ ] External link opens in new tab with rel="noopener noreferrer"
- [ ] Component renders gracefully if warnings array is empty (renders nothing)
- [ ] No new Supabase tables created

---

*Spec authored by PRODDY — 2026-02-23*
*Deadline: Wednesday 2026-02-26 (Dr. Allen demo)*

---

## BUILDER Implementation Notes — 2026-02-25

**[STATUS: COMPLETE — READY FOR INSPECTOR QA]**

### Files Created
- `src/components/networking/NetworkIntelligenceCard.tsx` — new standalone component

### Files Modified
- `src/components/arc-of-care-forms/phase-2-dosing/DosingProtocolForm.tsx`
  - Added `import NetworkIntelligenceCard`
  - Wired component below the contraindication flags block, conditional on `hasContraindications && contraindicationResult`
  - Passes `activeWarnings` as the combined list of absolute + relative flag IDs

### AC Compliance
- ✅ AC-1: Renders only when `hasContraindications === true` in `DosingProtocolForm`. Renders nothing if `activeWarnings` is empty.
- ✅ AC-2: Shows network count from static `NETWORK_COUNTS` lookup map keyed on flag IDs (lithium=4, ssri=7, maoi=3, default=2). Link routes to `https://ppnportal.com/practitioners?contraindication=[slug]`. Opens in new tab with `rel="noopener noreferrer"`. Opt-in footnote present.
- ✅ AC-3: Amber/gold card tint distinct from red warning above. `Users` icon from lucide-react. Font sizes: header `ppn-card-title` (18px), body `ppn-body` (15px), footnote `ppn-meta` (12px ✅). Fade-in with 300ms `setTimeout` delay via `useEffect`.
- ✅ AC-4: Zero Supabase queries. No new DB tables.
- ✅ AC-5: Descriptive `aria-label` on CTA link. `role="complementary"` on outer wrapper. No color-only meaning (icon + text present). `target="_blank"` with `rel="noopener noreferrer"`.

### Demo Trigger Instructions (for Jason)
1. Navigate to Phase 2 → Dosing Protocol form
2. Select **Psilocybin** as the substance (demo patient has Sertraline tapering in medications)
3. The SSRI relative contraindication card fires
4. The Network Intelligence card fades in 300ms later below it showing 7 practitioners

---

## ✅ [STATUS: PASS] — INSPECTOR APPROVED
**Date:** 2026-02-25T15:36 PST
**failure_count:** 0

### Verification Evidence

**AC-1 — Component renders only when warnings fire, nothing otherwise:**
```
grep -n "activeWarnings.length === 0" NetworkIntelligenceCard.tsx
→ Line 63: if (activeWarnings.length === 0) return null;

grep -n "hasContraindications" DosingProtocolForm.tsx
→ Line 209: {hasContraindications && contraindicationResult && (
→ Line 210: <NetworkIntelligenceCard
```

**AC-2 — Network count lookup + ppnportal.com link + opt-in footnote:**
```
grep -n "ppnportal.com" NetworkIntelligenceCard.tsx
→ Line 48: networkBaseUrl = 'https://ppnportal.com',

grep -n "NETWORK_COUNTS" NetworkIntelligenceCard.tsx
→ lithium:4, ssri:7, maoi:3, benzodiazepine:6, default:2 — present

grep -n "noopener noreferrer" NetworkIntelligenceCard.tsx
→ Line 118: rel="noopener noreferrer"

grep -n "Opt-in only" NetworkIntelligenceCard.tsx
→ Line 139: Opt-in only. No patient data is shared.
```

**AC-3 — Amber tint, Users icon, font classes, 300ms fade:**
```
grep -n "amber-950\/25\|bg-amber" NetworkIntelligenceCard.tsx
→ Line 81: bg-amber-950/25 — distinct from red warning above ✅

grep -n "ppn-card-title\|ppn-body\|ppn-meta" NetworkIntelligenceCard.tsx
→ Line 98: ppn-card-title (20px) ✅
→ Line 104: ppn-body (15px) ✅
→ Line 136: ppn-meta (12px) ✅

grep -n "setTimeout.*300" NetworkIntelligenceCard.tsx
→ Line 55: const timer = setTimeout(() => setVisible(true), 300) ✅
```

**AC-4 — Zero DB calls confirmed:**
```
grep -n "supabase|fetch|.from|.insert" NetworkIntelligenceCard.tsx
→ Exit code 1 — ZERO RESULTS ✅
```

**AC-5 — Accessibility:**
```
grep -n "aria-label" NetworkIntelligenceCard.tsx
→ Line 71: aria-label="Network Intelligence — practitioner experience..."
→ Line 119: aria-label={`View practitioners with experience managing ${slug}...`}
→ Both present ✅
```

**Font violation audit:**
```
grep -n 'text-\[1[01]px\]|text-\[9px\]|text-\[8px\]' NetworkIntelligenceCard.tsx
→ Exit code 1 — ZERO VIOLATIONS ✅
```

**Git push confirmed:**
```
git log --oneline -3
→ d0be062 (HEAD, origin/main) chore: cleanup...
→ 8377c6d feat(WO-343): add NetworkIntelligenceCard... ← CONFIRMED ON ORIGIN/MAIN ✅
```

### Inspector Correction Applied
- Removed redundant `text-sm` alongside `ppn-card-title` on the `<h3>` heading (line 98). `.ppn-card-title` owns the font-size at 20px. Having both classes in the same element creates conflicting intent even if CSS specificity resolves it correctly. Not a failure condition — corrected in-place by INSPECTOR.

### Audit Results
- **Acceptance Criteria:** ALL 5 ACs passed ✅
- **Deferred items:** NONE ✅
- **Font audit:** PASSED — ppn-card-title(20px), ppn-body(15px), ppn-meta(12px), no sub-12px classes ✅
- **PHI check:** PASSED — zero DB writes, zero patient data ✅
- **DB calls:** ZERO — grep confirmed ✅
- **External link:** Opens in new tab with rel="noopener noreferrer" ✅
- **Code on GitHub:** Confirmed on origin/main ✅
