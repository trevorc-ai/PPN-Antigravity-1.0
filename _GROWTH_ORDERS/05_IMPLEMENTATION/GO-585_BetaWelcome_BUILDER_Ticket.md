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
target_file: src/components/BetaWelcome.tsx
---

# BUILDER TICKET — GO-585: Beta Welcome Screen Implementation

## Status
USER-approved content matrix and design spec. BUILDER implements now.
Both source documents are linked above — read BOTH before touching code.

---

## What To Build

Implement the approved copy and fix all 10 violations in `src/components/BetaWelcome.tsx`.

### Violation Fix Checklist (implement ALL of these)

- [ ] **Badge:** Replace `text-xs` with `ppn-body` minimum (minimum `text-sm`). Pill shape, indigo accent, Shield icon.
- [ ] **L88:** Remove em dash → replace with comma
- [ ] **L76:** Remove em dash → replace with comma
- [ ] **L95:** Replace `ppn-meta` → `ppn-body`
- [ ] **L112:** Replace `ppn-meta` → `ppn-body`
- [ ] **L118:** Replace `ppn-meta` → `ppn-body`
- [ ] **Glass card:** Change `rounded-3xl border-slate-700/50` → `rounded-[2rem] border-white/10` with `backdrop-blur-md bg-slate-900/60`
- [ ] **Copy rewrite:** Use all copy exactly as written in the Content Matrix. Active voice only. No em dashes.
- [ ] **SEO:** Add `<Helmet>` or equivalent with title `PPN Portal - Founding Member Access` and the meta description from the matrix. Use existing pattern in `ForClinicians.tsx`.
- [ ] **JSON-LD:** Add `MedicalOrganization` schema block. Use existing pattern in `ForClinicians.tsx`.

### Approved Copy Summary (full text in Content Matrix)

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

- [ ] All 10 violation fixes implemented and verified against the checklist
- [ ] No `ppn-meta` class remaining on any visible text element in this component
- [ ] No em dashes in any text content
- [ ] Glass card uses mandated pattern exactly: `bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-[2rem] p-6`
- [ ] `<title>` and `<meta name="description">` present via Helmet pattern
- [ ] JSON-LD `MedicalOrganization` schema is present in page head
- [ ] Passes `ppn-ui-standards` audit before commit
- [ ] Passes `inspector-qa-script` before commit

---

## PRODDY Routing Note

Content matrix was in `03_MOCKUP_SANDBOX`. Design spec was duplicate-filed in `05_IMPLEMENTATION` and `06_QA`.
All upstream content artifacts remain in place as reference. This ticket is the authoritative build order.
