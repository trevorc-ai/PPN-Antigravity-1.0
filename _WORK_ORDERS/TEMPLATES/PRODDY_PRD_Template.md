<!--
  PRODDY PRD TEMPLATE — v1.0 (2026-02-23)
  
  HOW TO USE:
  Copy this entire block into the work order ticket you are completing.
  Fill in every section. Do NOT delete any section header.
  Do NOT exceed the word/item limits listed on each section.
  When done, update frontmatter: owner: LEAD, status: 01_TRIAGE.
-->

## PRODDY PRD

> **Work Order:** WO-[ID] — [Ticket Title]  
> **Authored by:** PRODDY  
> **Date:** [YYYY-MM-DD]  
> **Status:** Draft → Pending LEAD review  

---

### 1. Problem Statement
*(≤100 words. Describe the pain, who feels it, and what happens today without this feature. No solution ideas.)*

[Write here]

---

### 2. Target User + Job-To-Be-Done
*(One sentence. Format: "[User role] needs to [accomplish X] so that [outcome Y].")*

[Write here]

---

### 3. Success Metrics
*(3 maximum. Each must contain a specific measurable number or observable event. Vague metrics will be rejected.)*

1. [Metric 1 — e.g. "Feature X performs action Y in < Z seconds for N% of sessions"]
2. [Metric 2]
3. [Metric 3]

---

### 4. Feature Scope

#### ✅ In Scope
*(Specific, bounded features this ticket delivers)*

- [Item 1]
- [Item 2]
- [Item 3]

#### ❌ Out of Scope
*(Things that could be confused as in-scope but are explicitly NOT part of this ticket)*

- [Item 1]
- [Item 2]

---

### 5. Priority Tier
*(Circle one and state the reason)*

**[ ] P0** — Demo blocker / safety critical  
**[ ] P1** — High value, ship this sprint  
**[ ] P2** — Useful but deferrable  

**Reason:** [Why this tier? Name the specific deadline, user impact, or safety concern.]

---

### 6. Open Questions for LEAD
*(5 maximum. Unresolved decisions PRODDY cannot answer — architecture, data model, policy. PRODDY does NOT answer these.)*

1. [Question 1]
2. [Question 2]
3. [Question 3]

*If none: write "None — spec is complete."*

---

### PRODDY Sign-Off Checklist
*(PRODDY checks these before handing off. INSPECTOR will verify.)*

- [ ] Problem Statement is ≤100 words and contains no solution ideas
- [ ] Job-To-Be-Done is a single sentence in the correct format
- [ ] All 3 success metrics contain a measurable number or specific observable event
- [ ] Out of Scope is populated (not empty)
- [ ] Priority tier has a named reason (not just "seems important")
- [ ] Open Questions list is ≤5 items
- [ ] Total PRD word count is ≤600 words
- [ ] No code, SQL, or schema written anywhere in this document
- [ ] Frontmatter updated: `owner: LEAD`, `status: 01_TRIAGE`
- [ ] Response wrapped in `==== PRODDY ====`
