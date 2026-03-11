==== PRODDY ====
---
owner: LEAD
status: 99_COMPLETED
authored_by: PRODDY
priority: P0
created: 2026-03-06
---

## PRODDY PRD

> **Work Order:** WO-563 — Curious Patient Front Door Landing Page  
> **Authored by:** PRODDY  
> **Date:** 2026-03-06  
> **Status:** 99_COMPLETED

---

### 1. Problem Statement
Individuals exploring or currently undergoing psychedelic therapy lack a secure, scientifically validated tool to log their protocols. While PPN's primary focus is B2B clinical infrastructure (practitioners, insurance, researchers), turning away motivated individual patients ignores highly valuable "citizen science" data. Every valid protocol entered by a self-reporting patient increases the density and value of the global benchmark network.

---

### 2. Target User + Job-To-Be-Done
A proactive, self-directed psychedelic therapy patient needs a tailored secondary entry point focused on personal tracking so that they can securely document their journeys and contribute to the global average without needing a practitioner.

---

### 3. Success Metrics

1. The Curious Patient Front Door achieves a > 12% conversion rate to the Waitlist or Beta Sign-up within 14 days of launch.
2. 100% of leads captured via this route are automatically tagged with "Segment: Patient" (or `role: patient`) in the backend/auth flow.
3. The page clearly communicates the "Phantom Shield" (Zero-PHI) data protection model in consumer-friendly language to establish absolute trust above the fold.

---

### 4. Feature Scope

#### ✅ In Scope
- A dedicated route (e.g., `/for-patients` or `/my-journey`).
- Copywriting framed around "Personal Empowerment", "Citizen Science", "Track Your Healing", and consumer-grade "Phantom Shield" privacy guarantees.
- Visualizations showcasing the "Wellness Journey" and personal timeline features in a compelling, relatable way.
- An integrated lead-capture CTA ("Start Tracking Your Journey" or "Join the Patient Beta") passing the "patient" tag.

#### ❌ Out of Scope
- Building the actual patient portal application logic or redefining RLS (Row Level Security) policies (this is purely marketing communication and lead tagging).
- Allowing patients to access the Clinical-grade Interaction Checker without a practitioner limit/disclaimer.

---

### 5. Priority Tier

**[X] P1** — High value, ship this sprint  

**Reason:** While self-reporting patients are not the primary target audience, PPN's long-term data moat relies on capturing high-volume records. Each valid protocol increases the value of the entire site. Enabling this "secondary" intake funnel allows for organic network growth from citizen scientists.

---

### 6. Open Questions for LEAD

1. When a "Patient" signs up, do they go straight into the main app (with limited RLS views), or do we send them to a specific "Patient Waitlist" for a later consumer module launch?
2. How heavily should we emphasize the "Compare your journey to the Global Benchmark" feature in the consumer messaging vs. pure "Private Journaling"?

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
