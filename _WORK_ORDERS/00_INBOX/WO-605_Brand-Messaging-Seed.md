---
owner: LEAD
status: 00_INBOX
authored_by: PRODDY
date: 2026-03-10
priority: P2
---

## PRODDY PRD

> **Work Order:** WO-605 — Brand Messaging Seed: Benchmark Intelligence & The Person at the Screen  
> **Authored by:** PRODDY  
> **Date:** 2026-03-10  
> **Status:** Draft → Pending LEAD review  

---

### 1. Problem Statement

PPN's benchmark intelligence layer is scientifically rigorous — grounded in 10+ landmark studies, AACT trial registry data, and Lancet-tier publications. But our current marketing and in-product copy treats this as a data feature rather than a human experience. The practitioner and patient reading our platform don't feel seen by the copy. They see study names and numbers. They need to feel like the platform understands what *they* are asking, in *their* moment. Without this framing, our most differentiating capability reads like a research dashboard instead of a clinical partner.

---

### 2. Target User + Job-To-Be-Done

The MARKETER needs to develop a canonical brand voice for PPN's benchmark intelligence so that all product copy, landing pages, and in-app messaging speak to the person at the screen — not the data behind the screen.

---

### 3. Success Metrics

1. Landing page hero copy updated with person-first benchmark framing within 1 sprint of WO approval — zero reference to study author names in the headline or subheadline
2. At least 3 in-product benchmark copy strings (practitioner + patient + landing page) drafted, reviewed by USER, and committed to the repo
3. The canonical messaging seed document (`public/internal/admin_uploads/messaging/benchmark_messaging_seed.md`) exists and is referenced in at least 1 subsequent MARKETER work order within 30 days

---

### 4. Feature Scope

#### ✅ In Scope

- Canonical messaging seed document capturing the brand voice philosophy below
- Homepage / landing page benchmark section copy rewrite (person-first, citation-as-footnote)
- In-product practitioner benchmark copy: outcome trajectory context, response rate signal, AE rate context
- In-product patient Compass copy: mood arc validation sentence, milestone marker, forward-looking context sentence
- Tone guide: warm + precise, no jargon, no name-dropping upfront, citation always footnote

#### ❌ Out of Scope

- Any new UI components or layout changes (those are in the benchmark delivery WOs)
- Full landing page redesign
- Social media copy or external marketing campaigns
- Changes to clinical documentation copy or form labels

---

### 5. Priority Tier

**[x] P2** — Useful but deferrable  

**Reason:** The benchmark data infrastructure is still being seeded (WO-504 status unknown). Messaging should be finalized close to the moment the features ship so copy and product are in sync. However, the seed document should be created now while the philosophical framing is fresh.

---

### 6. Open Questions for LEAD

1. Should `benchmark_messaging_seed.md` live in `public/internal/admin_uploads/messaging/` or a new `public/internal/brand/` directory?
2. Is MARKETER cleared to update landing page copy directly, or does it require a separate BUILDER handoff for component changes?
3. Should the patient Compass copy be a single string per condition, or dynamically assembled from condition + modality + protocol phase?

---

## Canonical Messaging Seed

*The following passage is the philosophical foundation for all PPN benchmark intelligence copy. MARKETER MUST read and internalize this before writing a single word. It is not a brief — it is the voice.*

---

> **The practitioner's signals aren't uniform.** A trauma specialist running MDMA protocols needs completely different signal packaging than a clinician doing ketamine infusions for TRD. The data underneath might come from the same cohorts, but the question they're asking is different, the moment they're asking it is different, and the shape of the answer must match both.
>
> **The patient's signals are even more intimate.** They're asking *"was my experience real? Does it matter?"* The right visual doesn't show them a clinical trial comparison. It shows them their own arc, with a quiet line beneath it that says: *others have been here too.* The trial data is the footnote that makes it true. The patient never has to read it.

---

### Applied Voice Principles (for every benchmark-adjacent copy string)

| Principle | In Practice |
|---|---|
| **Person first, data second** | Lead with what they feel or need. The number is the evidence, not the story. |
| **Citation as footnote** | Studies are superscript. Authors are never in the headline. Credibility is implied, not announced. |
| **Match the moment** | Practitioner post-session ≠ patient reviewing Compass ≠ investor on landing page. Each needs different warmth, urgency, and specificity. |
| **Warmth and precision are not opposites** | *"You've reached a level of improvement that most people in comparable programs don't reach until week 10."* is warm AND exact. Both. Always. |
| **The benchmark is the horizon line** | Always background. The person's data is the story. The benchmark is what makes it make sense. |

---

### Draft Copy Strings (MARKETER to refine, not replace)

**Practitioner — Outcome Trajectory:**
> *"Your patient is responding ahead of where comparable cases typically are at this stage."*  
> *(footnote: based on N comparable cohort outcomes — DOI)*

**Practitioner — Response Rate:**
> *"82% response rate — above comparable cohorts."*  
> *(That's it. Nothing else on screen.)*

**Patient — Mood Arc:**
> *"Your trajectory over these weeks mirrors what thousands of people with similar experiences have reported."*  
> *(footnote: ¹ peer-reviewed data)*

**Patient — Milestone:**
> *"You've reached a level of improvement that clinicians consider a meaningful response. That matters."*

**Patient — Forward Looking:**
> *"Most people at this stage continue to see improvement over the next several weeks. You're on the path."*

**Landing Page — Benchmark Counter:**
> *"Every outcome on this platform is measured against the most rigorous published research in the field."*  
> *(below: the live counter — N studies, N participants, N modalities)*

---

### PRODDY Sign-Off Checklist

- [x] Problem Statement is ≤100 words and contains no solution ideas
- [x] Job-To-Be-Done is a single sentence in the correct format
- [x] All 3 success metrics contain a measurable number or specific observable event
- [x] Out of Scope is populated (not empty)
- [x] Priority tier has a named reason
- [x] Open Questions list is ≤5 items
- [x] Total PRD word count is ≤600 words *(excluding the Messaging Seed, which is an appendix)*
- [x] No code, SQL, or schema written anywhere in this document
- [x] Frontmatter updated: `owner: LEAD`, `status: 00_INBOX`
- [x] Response wrapped in `==== PRODDY ====`

==== PRODDY ====
