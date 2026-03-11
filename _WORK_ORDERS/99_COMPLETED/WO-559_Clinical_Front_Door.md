==== PRODDY ====
---
owner: LEAD
status: 99_COMPLETED
authored_by: PRODDY
priority: P0
created: 2026-03-06
---

## PRODDY PRD

> **Work Order:** WO-559 — Clinical Front Door Landing Page  
> **Authored by:** PRODDY  
> **Date:** 2026-03-06  
> **Status:** 99_COMPLETED

---

### 1. Problem Statement
Psychedelic therapy clinics and individual practitioners struggle with fragmented data entry and lack of standardized clinical measurement. When directing these professionals to a generic PPN landing page, the immediate clinical value—standardized protocol builder, Zero-PHI compliance, and structured interaction checkers—is diluted by broader industry messaging, causing high bounce rates among our most critical supply-side demographic.

---

### 2. Target User + Job-To-Be-Done
A clinic director or licensed practitioner needs to land on a tailored page showcasing clinical workflow tools so that they immediately understand how the platform replaces their messy spreadsheets and safely secures their patients' data.

---

### 3. Success Metrics

1. The Clinical Front Door achieves a > 15% conversion rate to Beta sign-up within 14 days of launch.
2. The page loads and becomes interactive in < 1.5 seconds on a 4G mobile connection.
3. 100% of the leads captured via this route are automatically tagged with "Segment: Clinical" in the Supabase database.

---

### 4. Feature Scope

#### ✅ In Scope
- A dedicated route (e.g., `/for-clinicians`) containing tailored copywriting focused on clinical utility (EHR replacement, interaction checker, protocol builder).
- A hero section highlighting the "Zero-PHI Architecture" specifically as a clinical liability shield.
- A "Request Beta Invite" CTA button that passes the "clinical" segment tag to the auth/registration payload.

#### ❌ Out of Scope
- Building new clinical features or visualizations (this is purely marketing/routing).
- Designing separate authentication modal logic (it will use the central auth system but inject a tag).

---

### 5. Priority Tier

**[X] P0** — Demo blocker / safety critical  

**Reason:** We are launching an exclusive beta test specifically geared towards practitioners. Without a dedicated Clinical entry point, we cannot effectively onboard our primary test cohort (e.g., Dr. Allen's clinic) efficiently or track their source.

---

### 6. Open Questions for LEAD

1. Should the "Clinical" landing page sit within the main React app routing or be hosted as a lightweight static page to maximize performance?
2. What specific visual asset (e.g., screenshot of the protocol builder) should be the hero image for this segment?

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

---
## INSPECTOR QA Sign-off
**Date:** 2026-03-11
**Verdict:** APPROVED. Code fixes verified on main branch.
