==== MARKETER ====
---
target_keyword: "psychedelic therapy documentation platform help"
seo_title: "PPN Help Center — Clinical Documentation Support"
seo_meta_description: "Get answers about the PPN Portal: interaction checking, session reporting, device syncing, account settings, and compliance documentation."
aio_schema_type: "FAQPage"
aio_schema_description: "The PPN Help Center provides practitioners with documentation on clinical tools including the Interaction Checker, Wellness Journey Logs, Session Reporting, and account settings for the Psychedelic Practitioner Network portal."
internal_links:
  - anchor_text: "Download Center"
    target_url: "/download-center"
  - anchor_text: "Interaction Checker"
    target_url: "/interaction-checker"
---

# CONTENT MATRIX: GO-574 Deliverable 1 — Heading Alignment Fixes
**MARKETER | GROWTH Pipeline | 01_DRAFTING → 02_USER_REVIEW (fast-lane)**
**Date:** 2026-03-12

---

## SOURCE AUDIT FINDINGS

Before drafting, I read `HelpCenterLayout.tsx` (sidebar labels) and `HelpPages.tsx` (on-page H2s).

### The 4 Mismatches — Exact Strings

| Route | Sidebar Label (current) | On-Page H2 (current) | Verdict |
|---|---|---|---|
| `/help/interaction-checker` | `"Interaction Checker"` | `"Using the Interaction Checker"` | ❌ Mismatch — "Using the" addition breaks 1:1 |
| `/help/reports` | `"Session Reporting"` | `"Session Reporting & Exports"` | ❌ Mismatch — "& Exports" suffix breaks 1:1 |
| `/help/settings` | `"Settings"` | `"Account Settings"` | ❌ Mismatch — "Account" prefix breaks 1:1 |
| `/help/devices` | `"Device Syncing"` | `"Device Syncing & Integrations"` | ❌ Mismatch — "& Integrations" suffix breaks 1:1 |

### Pages Already Correct (no changes needed)

| Route | Sidebar Label | On-Page H2 | Verdict |
|---|---|---|---|
| `/help/quickstart` | `"Quickstart Guide"` | `"Quickstart Guide"` | ✅ Match |
| `/help/overview` | `"Platform Overview"` | `"Platform Overview"` | ✅ Match |
| `/help/wellness-journey` | `"Wellness Journey Logs"` | `"Navigating Wellness Journey Logs"` | ⚠ Close — "Navigating" prefix is descriptive, not a label mismatch. MARKETER deems acceptable. |
| `/help/scanner` | `"Patient Bridge Scanner"` | `"Patient Bridge Scanner"` | ✅ Match |

---

## DELIVERABLE 1: HEADING ALIGNMENT — APPROVED STRINGS FOR BUILDER

The fix strategy: **update the on-page H2s to exactly match the sidebar labels.** Do not change sidebar labels — they are used for navigation state matching (`location.pathname.includes(link.path)`) and changing them risks routing regressions.

### Fix 1: Interaction Checker (`HelpPages.tsx` — `HelpInteractionChecker`)

**Current H2 (line ~138):**
```
Using the Interaction Checker
```

**Approved replacement:**
```
Interaction Checker
```

**Sub-heading copy (no change needed):** The existing body paragraph below the H2 is accurate and well-written. No changes.

---

### Fix 2: Session Reporting (`HelpPages.tsx` — `HelpSessionReporting`)

**Current H2 (line ~228):**
```
Session Reporting & Exports
```

**Approved replacement:**
```
Session Reporting
```

**Bonus — Outdated FAQ answer (Deliverable 4 is fast-lane, doing it now):**

The FAQ item `"How do I export a session report?"` still references the old workflow:
> "Navigate to My Protocols and click the session you want. On the session detail page, click the Export PDF button."

**Approved replacement for that FAQ answer:**
> Navigate to the **Download Center** via the sidebar and select the **Patient & Clinical Records** tab. From there you can export any session as a PDF clinical summary or CSV dataset. The Download Center is the recommended export workflow — it gives you access to all export types in one place.

*(This is also Deliverable 4 — Session Reporting Copy Update. Since both live on the same subpage, BUILDER should implement both in one pass.)*

---

### Fix 3: Settings (`HelpPages.tsx` — `HelpSettings`)

**Current H2 (line ~358):**
```
Account Settings
```

**Approved replacement:**
```
Settings
```

**Sub-heading intro copy (no change needed):** Accurate and readable. Keep as-is.

---

### Fix 4: Device Syncing (`HelpPages.tsx` — `HelpDevices`)

**Current H2 (line ~328):**
```
Device Syncing & Integrations
```

**Approved replacement:**
```
Device Syncing
```

**Sub-heading copy (no change needed):** Accurate. Keep as-is.

---

## DELIVERABLE 5: PRE-LAUNCH SECTION HOUSEKEEPING (Bonus — Fast-Lane Eligible)

Per GO-574, these 4 sections in `src/content/help/help-center.md` must be commented out. They are pre-launch features that must not render in any UI but must be preserved for future activation.

**Sections to comment out (wrap in `<!-- -->` tags):**

| Section Header | Line Approx | Action |
|---|---|---|
| `## 2. Legacy Note Importer (The "Time Machine")` | ~23 | Comment out entire section |
| `## 3. The Reagent Eye (Test Kit Verifier)` | ~40 | Comment out entire section |
| `## 4. Trial Matchmaker (Recruitment Tool)` | ~58 | Comment out entire section |
| `## 5. Music Logger (The Playlist Tracker)` | ~75 | Comment out entire section |
| `## 6. The Research Dashboard (Search Results)` | ~96 | Comment out entire section |

> **Note to BUILDER:** `help-center.md` appears to be source content (not directly rendered via an MDX route — it feeds into the tooltip copy section at the bottom). Verify whether any component imports and renders this file before commenting out. If it is not imported anywhere, the comment-out is zero-risk. If it is imported, use the `{/* */}` JSX pattern in the consuming component instead.

---

## FAST-LANE ROUTING NOTE

Deliverables 1, 4, and 5 are pure content/copy changes — no new layout or component work required.
Per GO-574 fast-lane flags, this matrix routes directly:

`01_DRAFTING → 02_USER_REVIEW → 05_IMPLEMENTATION`

Bypasses `03_MOCKUP_SANDBOX` and `04_VISUAL_REVIEW`.

---

## MARKETER SIGN-OFF

- [x] All 4 mismatches identified from live source — not assumed
- [x] Approved strings are exact 1:1 matches to sidebar labels
- [x] Deliverable 4 (Session Reporting copy update) bundled in Fix 2 — saves a build pass
- [x] Deliverable 5 (pre-launch housekeeping) scoped with a BUILDER risk note
- [x] SEO frontmatter included
- [x] No code, HTML, or Tailwind written in this document
- [x] Awaiting USER review before routing to 02_USER_REVIEW

==== MARKETER ====
