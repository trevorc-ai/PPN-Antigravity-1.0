---
id: GO-585-BUILD
owner: BUILDER
status: 05_IMPLEMENTATION
authored_by: MARKETER
routed_by: PRODDY
priority: P1
created: 2026-03-12
approved_by: USER
approved_date: 2026-03-12
source_content_matrix: _GROWTH_ORDERS/03_MOCKUP_SANDBOX/GO-585_BetaWelcome_Content_Matrix.md
source_design_spec: _GROWTH_ORDERS/03_MOCKUP_SANDBOX/GO-585_BetaWelcome_Design.md
target_file: src/pages/BetaWelcome.tsx
---

# BUILDER TICKET — GO-585: Beta Welcome Screen Implementation

## Status
USER-approved content matrix and design spec. BUILDER implements now.
Both source documents are linked above — read BOTH before touching code.

---

## What To Build

Implement the approved copy and fix all 10 violations in `src/pages/BetaWelcome.tsx`.

### Violation Fix Checklist (implement ALL of these)

- [x] **Badge:** Replace `text-xs` with `ppn-body` minimum (minimum `text-sm`). Pill shape, indigo accent, Shield icon.
- [x] **Em dashes:** Remove all em dashes → replace with commas
- [x] **L95 area:** Replace `ppn-meta` → `ppn-body` on stat sub-label
- [x] **Social proof line:** Replace `ppn-meta` → `ppn-body`
- [x] **Footer confirm:** Replace `ppn-meta` → `ppn-body`
- [x] **Glass card:** Change to `rounded-[2rem] border-white/10` with `backdrop-blur-md bg-slate-900/60`
- [x] **Copy rewrite:** Use all copy exactly as written in the Content Matrix. Active voice only. No em dashes.
- [x] **SEO:** Add `<title>` and `<meta name="description">` via useEffect with cleanup.
- [x] **JSON-LD:** Add `MedicalOrganization` schema block via useEffect with cleanup.

### Approved Copy

| Element | Approved Text |
|---|---|
| Badge | `Founding Member Access` |
| Greeting (with name) | `Welcome back, [FirstName].` |
| Greeting (no param) | `Welcome.` |
| Orientation para | `You are seeing the PPN Portal before anyone else...` |
| Stat number | `1,500+` |
| Stat sub | `anonymized clinical outcome records, live in the network now.` |
| Social proof | `You are among the first practitioners to see the network.` |
| Primary CTA | `Enter the Network` |
| Footer confirm | `Your access is active. No setup required.` |
| Wordmark | `Psychedelic Practitioner Network` |

---

## Acceptance Criteria

- [x] All 10 violation fixes implemented
- [x] No `ppn-meta` class on any visible text element
- [x] No em dashes in any text content
- [x] Glass card uses mandated pattern exactly
- [x] `<title>` and `<meta name="description">` present
- [x] JSON-LD `MedicalOrganization` schema present

---

## PRODDY Routing Note

Content matrix in `03_MOCKUP_SANDBOX`. Design spec was duplicate-filed in `05_IMPLEMENTATION` and `06_QA`.
All upstream content artifacts remain in place as reference. This ticket is the authoritative build order.
