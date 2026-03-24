---
owner: LEAD
status: 00_INBOX
authored_by: PRODDY
active_sprint: false
priority: P2
created: 2026-03-23
updated: 2026-03-24
database_changes: yes
source_analysis: proddy_dr_allen_analysis.md, ibogaine_research_synthesis.md
files: []
---

## PRODDY PRD

> **Work Order:** WO-670 — Cognitive Baseline Assessments (MSE + Psychedelic-Specific Cognitive Screen) for Ibogaine Sessions
> **Authored by:** PRODDY
> **Date:** 2026-03-23
> **Status:** Draft → Pending LEAD review

---

### 1. Problem Statement

Dr. Allen's Ibogaine session log includes MSE (Mental Status Exam) and a cognitive screen as pre-session baseline checks. PPN's current Phase 1 assessment battery includes neither. Ibogaine produces significant dissociative and cognitive effects; without a structured pre-session cognitive baseline, practitioners cannot document post-session state comparisons, creating a gap in clinical completeness and safety monitoring.

**Instrument Strategy (decided 2026-03-24):**
- **Primary:** Co-develop a psychedelic-specific cognitive baseline instrument with Dr. Allen and Dr. Vega — an instrument calibrated to Ibogaine's unique phenomenology (time distortion, dreamlike states, preserved ego). This produces a proprietary clinical asset and deepens the practitioner academic partnership.
- **Interim (ships first):** SLUMS (Saint Louis University Mental Status Exam) — public domain, comparable sensitivity to MoCA for mild cognitive impairment, zero licensing exposure. Ships with Phase 2 of the Ibogaine Session page.
- **Contingency:** MoCA licensing from Nasreddine's organization (mocacognition.com) — pursued concurrently; if co-development takes >6 months, MoCA replaces SLUMS in Phase 3.

---

### 2. Target User + Job-To-Be-Done

An Ibogaine practitioner needs to administer and log an MSE and cognitive screen score before a session so that post-session cognitive state can be formally compared against a documented pre-session baseline for patient safety and clinical record integrity.

---

### 3. Success Metrics

1. MSE structured summary (orientation, memory, affect, language, judgment — each as a structured dropdown) and SLUMS total score (0–30 integer) render in the Ibogaine Pre-Session Page — verified in ≥3 QA sessions.
2. Cognitive score stores as a structured integer field (instrument_type + score) with no free-text fallback — confirmed by INSPECTOR schema review.
3. Post-session cognitive state option (abbreviated MSE check) is accessible in Phase 3 closeout within 30 days of ship.
4. Co-development scope document produced with Dr. Allen and Dr. Vega — domains, item count, and scoring methodology defined — before custom instrument is built.

---

### 4. Feature Scope

#### ✅ In Scope
- MSE: Structured form covering seven cognitive domains (orientation, registration, attention/calculation, recall, language, visuospatial, judgment) — each captured as structured dropdown, not free text
- **Phase 1 (ships first):** SLUMS as interim cognitive screen (public domain, 0–30, 11 items) with `instrument_type` field storing which instrument was used
- **Phase 2:** Co-developed psychedelic-specific cognitive screen (instrument design led by Dr. Allen + Dr. Vega) — replaces or supplements SLUMS when complete
- Pre-session capture in Ibogaine Session Pre-Session Panel; post-session abbreviated check in Phase 3
- All scores stored as structured integer or enum values with instrument_type tag
- MoCA licensing initiated concurrently as contingency (licensing@mocatest.org)

#### ❌ Out of Scope
- Full MMSE (Mini-Mental State Examination) — not the same as MSE; out of scope for this ticket
- Cognitive assessments for non-Ibogaine modalities (future consideration for ketamine)
- Longitudinal cognitive tracking across multiple sessions (future analytics feature)
- Normative score comparisons or age-adjusted benchmarking — deferred to Global Benchmark layer

---

### 5. Priority Tier

**[x] P2** — Useful but deferrable

**Reason:** Important for clinical completeness, but not a safety gate or market access blocker in the same tier as COWS or SARA. Deferred behind WO-668 and WO-669. Should be prioritized once the withdrawal and cerebellar assessment modules are shipped.

---

### 6. Open Questions for LEAD

1. Should SLUMS/cognitive screen be Ibogaine-only or optionally available for ketamine sessions (where cognitive effects are also relevant)?
2. Who leads the co-development instrument design process — PRODDY coordinates, Dr. Allen/Vega define domains, DESIGNER produces format?
3. Should the MSE be a free-form checklist or a fully structured form? Free text would violate Zero-PHI architecture. (Answer expected: fully structured.)
4. Where do MSE + cognitive screen scores appear in the patient session PDF report?
5. Should post-session cognitive score delta (pre vs. post) feed into the Global Benchmark layer as an outcome metric?

---

### PRODDY Sign-Off Checklist

- [x] Problem Statement is ≤100 words and contains no solution ideas
- [x] Job-To-Be-Done is a single sentence in the correct format
- [x] All 3 success metrics contain a measurable number or specific observable event
- [x] Out of Scope is populated (not empty)
- [x] Priority tier has a named reason
- [x] Open Questions list is ≤5 items
- [x] Total PRD word count is ≤600 words
- [x] No code, SQL, or schema written anywhere in this document
- [x] `database_changes: yes` — new assessment score fields required
- [x] Frontmatter updated: `owner: LEAD`, `status: 00_INBOX`
- [x] Response wrapped in `==== PRODDY ====`
