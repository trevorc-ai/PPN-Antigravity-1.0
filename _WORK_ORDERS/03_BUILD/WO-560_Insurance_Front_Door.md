==== PRODDY ====
---
owner: LEAD
status: 01_TRIAGE
authored_by: PRODDY
priority: P0
created: 2026-03-06
---

## PRODDY PRD

> **Work Order:** WO-560 — Insurance Front Door Landing Page  
> **Authored by:** PRODDY  
> **Date:** 2026-03-06  
> **Status:** Draft → Pending LEAD review  

---

### 1. Problem Statement
Insurance underwriters, health economists, and institutional payers require structured, auditable outcomes data to design coverage policies. When these stakeholders visit the generic PPN landing page, the emphasis on practitioner workflow tools (e.g., interaction checkers and protocol builders) obscures the platform's core value to payers: acting as a high-fidelity actuarial database and safety surveillance layer for psychedelic therapies.

---

### 2. Target User + Job-To-Be-Done
An insurance underwriter or health economics analyst needs to land on a tailored page showcasing aggregate benchmark data and safety surveillance so that they evaluate PPN as the industry-standard data provider for determining rehabilitative value and coverage risk.

---

### 3. Success Metrics

1. The Insurance Front Door achieves a > 10% conversion rate to Demo Requests/Consultations within 14 days of launch.
2. 100% of leads captured via this route are automatically tagged with "Segment: Insurance" in the backend CRM/database.
3. The page loads and paints its first meaningful visualization in < 1.5 seconds on a fast desktop connection.

---

### 4. Feature Scope

#### ✅ In Scope
- A dedicated route (e.g., `/for-payers` or `/for-insurance`).
- Copywriting framed entirely around "Outcome Validation", "Continuous Safety Surveillance", and "Actuarial Intelligence".
- High-fidelity visual mockups or interactive components highlighting the Global Benchmark and Safety Matrix specifically.
- An integrated lead-capture CTA ("Request Data Access" or "Schedule Briefing") that passes the "insurance" tag.

#### ❌ Out of Scope
- Building distinct reporting dashboards or new features for insurance users (this is marketing/positioning only).
- Providing live, unauthenticated access to the production benchmark database.
- The standard "Start Free Trial" registration flow (payers require enterprise consultation, not self-serve SaaS signup).

---

### 5. Priority Tier

**[X] P0** — Demo blocker / safety critical  

**Reason:** PPN must aggressively position itself as the industry standard for outcomes data before large payers establish their own siloed registries. Securing initial payer conversations during the beta pilot phase requires this targeted narrative.

---

### 6. Open Questions for LEAD

1. Given that we do not permit non-practitioners to register standard accounts, should the CTA for Insurance route to a custom "Consultation Request" form rather than the standard App auth flow?
2. Which Data Viz component best represents our "Actuarial Intelligence" value to this specific audience to use as the hero image?

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
- [x] Frontmatter updated: `owner: LEAD`, `status: 01_TRIAGE`
- [x] Response wrapped in `==== PRODDY ====`

==== PRODDY ====
