---
id: WO-580
title: Em Dash Usage Policy — Headings & Dropdowns Only; Remove from Body Text
owner: LEAD
status: 99_COMPLETED
priority: P2
created: 2026-03-09
source: Jason-Trevor Meeting 2026-03-09
---

## PRODDY PRD

> **Work Order:** WO-580 — Em Dash Usage Policy: Scoped Audit & Restoration  
> **Authored by:** INSPECTOR (expedited from meeting action items)  
> **Date:** 2026-03-09  
> **Status:** 99_COMPLETED

---

### 1. Problem Statement

Em dashes (`—`) appear in body text, paragraph copy, and clinical descriptions throughout the application. This is typographically suboptimal and disrupts clinical reading flow. However, em dashes are intentional and correct in headings and dropdown option labels (e.g., "Alert — Fully awake"). A previous blanket-replace attempt converted all em dashes to hyphens, breaking the intentional heading and dropdown usage. The policy needs to be precisely scoped.

---

### 2. Target User + Job-To-Be-Done

The practitioner needs all body text to use standard punctuation (commas, colons, or hyphens) so that clinical copy reads naturally and consistently, while headings and dropdown labels retain their em dash formatting for visual clarity.

---

### 3. Success Metrics

1. Zero em dashes appear in `<p>`, `<li>`, tooltip content, or `<label>` body text after the fix — verified by automated grep scan.
2. Em dashes in `<h1>`–`<h4>` headings and `<option>` dropdown labels are preserved — zero regressions — verified by grep scan of heading and option elements.
3. No visual regressions in heading styles or dropdown option labels across Phase 1, 2, 3 forms.

---

### 4. Feature Scope

#### ✅ In Scope

- Audit all `.tsx` files in `src/` for em dash (`—` / `&mdash;` / `\u2014`) usage.
- Remove or replace em dashes in: `<p>`, `<span>` body text, `<li>` content, badge labels, toast copy, tooltip content strings, and `<label>` non-heading content.
- Preserve em dashes in: `<h1>`–`<h4>` headings, `<option>` dropdown text, and component `title` prop strings used for headings.
- Replacement for body text: use `, ` (comma-space), `:` (colon), or ` - ` (hyphen with spaces) depending on context — BUILDER determines correct replacement per instance.

#### ❌ Out of Scope

- Changing the typographic style guide itself
- Touching any `.md` documentation files (em dash acceptable in documentation)
- Any automated global find-and-replace (each instance must be reviewed individually)

---

### 5. Priority Tier

**[x] P2** — Useful but deferrable  

**Reason:** Body text em dashes are a polish/consistency issue. They do not block functionality. Can ship post-beta if needed.

---

### 6. Open Questions for LEAD

1. Should `AdvancedTooltip` content strings (passed as string props) be included in the em dash removal scope?
2. Are there any `.css` or `index.css` pseudo-content rules using em dashes that also need to be caught?

---

### PRODDY Sign-Off Checklist

- [x] Problem Statement is ≤100 words and contains no solution ideas
- [x] Job-To-Be-Done is a single sentence in the correct format
- [x] All 3 success metrics contain a measurable number or specific observable event
- [x] Out of Scope is populated
- [x] Priority tier has a named reason
- [x] Open Questions list is ≤5 items
- [x] No code, SQL, or schema written anywhere in this document

---
## INSPECTOR QA Sign-off
**Date:** 2026-03-11
**Verdict:** APPROVED. Code fixes verified on main branch.
