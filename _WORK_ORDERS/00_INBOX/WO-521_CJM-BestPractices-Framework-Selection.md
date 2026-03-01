---
id: WO-521
title: Customer Journey Best Practices + UX Scoring Framework Selection
owner: PRODDY
status: 00_INBOX
authored_by: PRODDY
priority: P1
created: 2026-02-28
depends_on: none
blocks: WO-523
---

## PRODDY PRD

> **Work Order:** WO-521 — Customer Journey Best Practices + UX Scoring Framework Selection
> **Authored by:** PRODDY
> **Date:** 2026-02-28
> **Status:** Draft → Pending LEAD review

---

### 1. Problem Statement

PPN has no established customer journey map or release-gate scoring standard. Standard software release protocols — such as Critical User Journey (CUJ) testing — require mapping key user paths and scoring them against defined acceptance criteria before a release is approved. Without a chosen framework, PPN has no objective way to determine whether a release is ready, or to catch journey regressions between releases. This ticket selects that framework.

---

### 2. Target User + Job-To-Be-Done

The practitioner-owner needs a written best practices reference and a chosen UX scoring framework so that PPN's customer journey can be evaluated objectively against an established external standard before any UI changes are proposed.

---

### 3. Success Metrics

1. PRODDY delivers a single document containing both the best practices summary and the selected scoring framework — reviewed and accepted by the practitioner in 1 pass with no follow-up clarification requests.
2. The scoring framework chosen is a named, published methodology with ≥3 cited sources — no invented rubrics.
3. The framework translates into a scoring grid usable in WO-523 — each criterion has a defined scale (e.g. 1–5) and a category label (e.g. "Clarity", "Trust", "Conversion").

---

### 4. Feature Scope

#### ✅ In Scope

- Research and summarize best practices for **release-gate customer journey testing** in clinical SaaS products. Priority sources: Google's Critical User Journey (CUJ) protocol, Google's HEART framework (Happiness, Engagement, Adoption, Retention, Task Success), Baymard Institute UX benchmarking, Nielsen Norman Group release readiness criteria, and ISO 9241-210 (human-centred design acceptance criteria).
- Identify **2–3 candidate frameworks** from the above that include both (a) journey mapping AND (b) a pass/fail or scored acceptance criteria component — suitable for use as a release gate, not just a design review.
- **Select one framework** as the recommended release-testing standard for PPN — explain the selection rationale in ≤3 sentences, specifically addressing why it fits a clinical SaaS product with gated practitioner access.
- Adapt the selected framework into a **scoring grid** that PRODDY will use in WO-523: columns = journey stage (Awareness → Conversion → Auth → Core Use → Retention), rows = framework criteria, cells = 1–5 scale with defined pass/fail threshold per criterion.
- Deliver as a single structured markdown document placed in `_WORK_ORDERS/00_INBOX/` as a companion research artifact to WO-521.

#### ❌ Out of Scope

- Scoring the actual PPN journey — that is WO-523.
- Visiting the PPN application in the browser — that is WO-522.
- Writing any code, CSS, or UI recommendations.
- Inventing scoring criteria not grounded in a published source.

---

### 5. Priority Tier

**[x] P1** — High value, ship this sprint

**Reason:** WO-523 (scoring + recommendations) cannot begin until this framework exists. The sooner it's done, the sooner the practitioner has an objective benchmark tool to assess every future UX decision.

---

### 6. Open Questions for LEAD

1. Should the scoring framework weight clinical trust/safety signals more heavily than standard consumer SaaS rubrics (given PPN's practitioner user base)? PRODDY will flag this in the framework selection but defers to LEAD on weighting.
2. Should PRODDY deliver the scoring grid in the same document as the best practices summary, or as a separate companion file?

*No additional open questions at this time.*

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
- [x] Frontmatter updated: `owner: PRODDY`, `status: 00_INBOX`
- [x] Response wrapped in `==== PRODDY ====`
