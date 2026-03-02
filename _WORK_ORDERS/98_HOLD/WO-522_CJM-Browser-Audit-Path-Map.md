---
id: WO-522
title: PPN Customer Journey — Full Browser Audit & Path Map
owner: INSPECTOR
status: 01_TRIAGE
authored_by: PRODDY
priority: P1
created: 2026-02-28
depends_on: none
blocks: WO-523
---

## PRODDY PRD

> **Work Order:** WO-522 — PPN Customer Journey — Full Browser Audit & Path Map
> **Authored by:** PRODDY
> **Date:** 2026-02-28
> **Status:** Draft → Pending LEAD review

---

### 1. Problem Statement

No complete, documented map of the PPN customer journey exists. The application has 40+ routes across two states (unauthenticated and authenticated), and no one has walked every path end-to-end and documented what a visitor or practitioner actually encounters. Without this map, it is impossible to objectively score or improve the journey. INSPECTOR must walk every path in the browser and document what exists, what is missing, and where users can get stuck or exit unintentionally.

---

### 2. Target User + Job-To-Be-Done

The practitioner-owner needs a complete, path-by-path map of the PPN customer journey so that the UX scoring work in WO-523 is grounded in what actually exists in the product, not assumptions.

---

### 3. Success Metrics

1. INSPECTOR documents every named public and authenticated route (all 40+ confirmed in `src/App.tsx`) — zero routes omitted from the map.
2. The delivered map identifies at least 1 entry point, 1 primary CTA, and 1 exit/dead-end for each major journey stage (Awareness, Conversion, Auth, Core Use, Retention).
3. The map is produced as a structured markdown document with a Mermaid flowchart — reviewed and accepted by the practitioner in 1 pass.

---

### 4. Feature Scope

#### ✅ In Scope

INSPECTOR must open the application in the browser at `https://ppnportal.net` (or localhost) and walk every path listed below, documenting for each: what the user sees, what CTAs are present, where they lead, and any friction points. The full known route inventory from `src/App.tsx` is:

**Unauthenticated / Public Paths:**
- `/landing` (entry point — header to footer, every CTA)
- `/about`, `/pricing`, `/contribution`, `/waitlist`, `/secure-gate`
- `/privacy`, `/terms`
- `/login`, `/forgot-password`, `/reset-password`
- `/academy`, `/partner-demo`, `/checkout`
- `/deep-dives/` (8 pages: patient-flow, clinic-performance, patient-constellation, molecular-pharmacology, protocol-efficiency, workflow-chaos, safety-surveillance, risk-matrix)

**Authenticated Core Paths:**
- `/search` (post-login entry), `/dashboard`
- `/analytics`, `/news`, `/catalog`, `/monograph/:id`, `/interactions`
- `/wellness-journey`, `/companion/:sessionId`
- `/protocols`, `/protocol/:id`, `/clinician/:id`
- `/help` (and 9 sub-routes)
- `/notifications`, `/settings`, `/profile/edit`
- `/data-export`, `/session-export`, `/clinical-report-pdf`

**For each path, INSPECTOR documents:**
1. Page title / primary heading
2. Primary CTA (button label + destination)
3. Secondary CTAs or navigation options
4. Footer links (if present)
5. Dead ends (pages with no forward path)
6. Broken or unexpected behaviors observed in browser

**Final deliverable:** A structured markdown file (`WO-522_Journey-Map.md`) placed in `_WORK_ORDERS/00_INBOX/` containing:
- A Mermaid flowchart of the complete journey (unauthenticated + authenticated branches)
- A table: one row per route, columns = entry points | primary CTA | exits | friction notes

#### ❌ Out of Scope

- Scoring any path against a rubric — that is WO-523.
- Making recommendations — that is WO-523.
- /arc-of-care-* demo routes and dev showcase routes (`/component-showcase`, `/hidden-components`) — these are internal dev tools, not part of the customer journey.
- Any database queries or schema inspection.

---

### 5. Priority Tier

**[x] P1** — High value, ship this sprint

**Reason:** WO-523 (the scored assessment + recommendations) cannot begin without this map. INSPECTOR can run this in parallel with WO-521 — no dependency between them.

---

### 6. Open Questions for LEAD

✅ All questions resolved by LEAD (2026-02-28).

1. ~~Walk order?~~ → **Two separate passes**: unauthenticated visitor first (landing through conversion), then authenticated practitioner. Document them as two clearly labelled sections in the map.
2. ~~Mobile viewport alongside desktop?~~ → **Desktop only** for this initial map. Mobile is a separate audit and would double the scope. Flag any obvious mobile-only issues seen in passing, but do not formally document mobile paths.
3. ~~`/signup` redirect to `/academy` — journey gap?~~ → **Yes, flag it as a gap.** The expected signup flow should deliver a practitioner to their dashboard or onboarding, not the Academy page. INSPECTOR should document this as a broken conversion path in the journey map friction notes.

*None — spec is complete.*

---

### PRODDY Sign-Off Checklist

- [x] Problem Statement is ≤100 words and contains no solution ideas
- [x] Job-To-Be-Done is a single sentence in the correct format
- [x] All 3 success metrics contain a measurable number or specific observable event
- [x] Out of Scope is populated (not empty)
- [x] Priority tier has a named reason (not just "seems important")
- [x] Open Questions list is ≤5 items
- [x] Total PRD word count is ≤600 words
- [x] No code, SQL, or schema written anywhere in this document
- [x] Frontmatter updated: `owner: INSPECTOR`, `status: 00_INBOX`
- [x] Response wrapped in `==== PRODDY ====`
