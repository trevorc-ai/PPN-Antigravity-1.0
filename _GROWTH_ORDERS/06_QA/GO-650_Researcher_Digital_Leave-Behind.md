==== PRODDY ====
---
owner: MARKETER
status: 00_BACKLOG
authored_by: LEAD
priority: P1
created: 2026-03-20
epic_type: Outreach_Leave-Behind
target_audience: Academic Researchers / Principal Investigators / CROs
notebook_source: https://notebooklm.google.com/notebook/fda83df4-8b3d-440e-9918-9ea669100c43
prototype_reference: public/outreach/researcher/PPN_Researcher_Portfolio.html
---

## GROWTH ORDER — Researcher Digital Leave-Behind (Institutional RWE Portfolio)

> **Origin:** WO-648 (routed incorrectly through _WORK_ORDERS — now corrected)
> **Type:** Self-contained HTML interactive portfolio
> **Audience:** Academic researchers, Principal Investigators (PIs), CROs, IRB members, and data scientists evaluating PPN as a longitudinal RWE data source

---

### 1. Brief

A curated, self-contained HTML leave-behind targeting institutional researchers. The tone must be academic and precise. The reader evaluates data platforms, not clinical software. They respond to ontology standards, IRB alignment, statistical readiness, and data fidelity — not billing tools or workflow automation.

The format is a three-module tabbed portfolio:
- **Module 1:** RWE and Cohort Analytics (structured longitudinal data, statistical readiness)
- **Module 2:** Telemetry and Pharmacokinetics (pharmacological context, physiological-psychological correlation)
- **Module 3:** Data Integrity and Audit Standards (21 CFR Part 11, MedDRA, CTCAE v5.0, Zero-PHI)

**CRITICAL:** Do NOT reference billing, insurance, or clinical workflow tools. This audience will immediately dismiss the platform as a commercial billing tool if those exhibits appear.

---

### 2. MARKETER Tasks

PROCESS AFTER GO-649 IS USER-APPROVED. Do not begin until user explicitly says "Proceed to GO-650."

1. Read the NotebookLM at `notebook_source`.
2. For each module, select the **2-3 strongest exhibits** that speak to a researcher's needs: data fidelity, ontology compliance, statistical readiness, audit integrity.
3. Produce a `CONTENT_MATRIX.md` containing:
   - SEO/AIO frontmatter block
   - Hero copy (headline, academic-register sub, body ~150 words)
   - Architecture callout strip (3 cells: ontology standards, data integrity, PHI architecture)
   - Module 1/2/3 copy: title, tagline, exhibit cards (title, desc, callout)
   - Footer CTA copy
4. All technical terms (MedDRA, RxNorm, CTCAE, IRB, 21 CFR Part 11) must be used correctly and not over-explained.
5. No em dashes. No billing/insurance language. No "clinic director" framing anywhere.

---

### 3. Reference Assets

- **Prototype HTML:** `public/outreach/researcher/PPN_Researcher_Portfolio.html`
- **NotebookLM session:** Continue the active session from GO-649 or open new
- **Synthetic fixture:** `public/outreach/fixtures/synthetic_cohort_PSIL2026Q1.json`
- **Footer CTA email:** `info@ppnportal.net`

---

### 4. Fast-Lane Flags

- [ ] Pure Content (Fast-Lane)
- [x] Prototype Exists: DESIGNER reviews at 03_MOCKUP_SANDBOX. BUILDER makes targeted corrections only.

---

### LEAD Sign-Off

- [x] Audience sharply differentiated from GO-649
- [x] Critical prohibition stated clearly (no billing/insurance exhibits)
- [x] Notebook source linked
- [x] Prototype reference linked
- [x] MARKETER serialization enforced (must wait for GO-649 user approval)

==== PRODDY ====
