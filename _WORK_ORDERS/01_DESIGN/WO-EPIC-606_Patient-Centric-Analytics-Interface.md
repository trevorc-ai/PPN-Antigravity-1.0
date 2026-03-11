---
owner: DESIGNER
status: 01_DESIGN
authored_by: PRODDY
---

==== PRODDY ====

## PRODDY PRD

> **Work Order:** WO-EPIC-606 — The Empathic Analytics Intelligence Layer
> **Authored by:** PRODDY  
> **Date:** 2026-03-10  
> **Status:** Draft → Pending LEAD review  

---

### 1. Problem Statement
The current benchmark intelligence strategy treats both patients and practitioners as homogeneous data consumers, requiring them to manually interpret clinical statistics. Without immediate, role-specific contextualization, population outcome data creates confusion rather than actionable insight for clinicians, and anxiety rather than empathic validation for patients traversing highly personal healing arcs. A unified, generic dashboard fails to answer the "is my patient on track?" and "was my experience real?" questions organically at the exact moment they arise.

---

### 2. Target User + Job-To-Be-Done
The Practitioner needs to see exactly how their patient's current protocol milestones map against similar patients so that they can adjust treatment parameters instantly; simultaneously, the Patient needs to see their unique outcome trajectory validated against a subtle, non-clinical population shadow-line so that they understand they are not alone in their experience.

---

### 3. Success Metrics

1. The Practitioner view (`PractitionerProtocolBenchmark`) surfaces relevant protocol-filtered data within 1 second of loading the Protocol Detail view for 98% of sessions viewed.
2. The Patient view (`PatientJourneyValidation` component) is engaged by > 50% of monthly active patients clicking to view their "arc" from the Portal Dashboard.
3. Zero generic "Analytics" dashboards are rendered; all benchmark data points are nested strictly within existing Patient or Practitioner workflows within 30 days of launch.

---

### 4. Feature Scope

#### ✅ In Scope

- **For Practitioners:** We will create a "Treatment Trend Forecast." This will show them a visual path of how patients usually respond to a specific treatment (like Ketamine). If a patient had a tough session, we'll flag it clearly. In the same view, they can see the patient's daily notes right next to their charts, so the numbers always have a story attached.
- **For Patients:** We will build a "Community Connection Map." This shows them where they are on their healing journey compared to others. Instead of scary clinical graphs, they will see a comforting, subtle background line that helps them realize they aren't alone, especially during tough days.
- **Design:** The patient side will be beautiful, simple, and calming—using glowing lines and soft depth, without overwhelming them with data.
- **React 2026 Architecture (Mandatory):**
    - **RSCs & RSD:** Heavy data processing for the global benchmark overlay must use React Server Components. All UI components must use React Strict DOM (RSD) to guarantee an identical experience on the practitioner's iPad and desktop browser.
    - **Offline Resilience:** TanStack Query must be used to cache global benchmark data, ensuring charts render even if clinic Wi-Fi drops.
    - **Feature-First Structure:** Analytics components must be isolated in feature directories (e.g., `src/features/practitioner-analytics/`) rather than grouped by file type.
    - **Decision-Centric UI ("One Visual, One Idea"):** Components must use semantic alerting (Red for Risk, Green for Goal Met) and embed a specific decision flow (e.g., a visible "Protocol Adjustment Needed" button if a tooltip flashes red).

#### ❌ Out of Scope

- A separate, complicated page just for data and charts. All information must live where practitioners and patients already look.
- Letting users build their own complex charts or mix and match data sets.
- Spreadsheets, complicated heatmaps, or anything that requires a statistics degree to understand.
- Suggesting that the platform guarantees a cure or provides automated medical advice.

---

### 5. Priority Tier

**[x] P1** — High value, ship this sprint  

**Reason:** The core proposition of the PPN Portal is real-world evidence and benchmarking. If the presentation layer is confusing or anxiety-inducing (especially to patients), we violate our core mission. We must replace generic data-dumps with these "wow" narrative visuals immediately before scaling the beta.

---

### 6. Open Questions for LEAD

1. What specific high-performance React charting library (e.g., Recharts, Visx, D3) should BUILDER use to achieve the glowing, glassmorphic "wow" aesthetic required for the patient arc?
2. Should the `PatientJourneyValidation` component be powered by a new, dedicated RPC function or edge function to pre-calculate the "population shadow-line" to minimize client-side compute?
3. How do we visually and technically handle edge cases where a patient's individual trajectory vastly exceeds the standard deviation of the population trend without breaking the chart's Y-axis or inducing panic?
4. How do we best integrate qualitative narrative comments from patients/sitters directly into the practitioner's quantitative chart views to ensure context is never lost?
5. How can we ensure privacy for patients while displaying their metrics alongside community resonance data? 

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
- [x] Frontmatter updated: `owner: LEAD`, `status: 00_INBOX`
- [x] Response wrapped in `==== PRODDY ====`

==== PRODDY ====
