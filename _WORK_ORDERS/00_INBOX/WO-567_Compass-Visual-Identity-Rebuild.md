---
id: WO-567
title: Integration Compass — Visual Identity Ground-Up Rebuild
owner: BUILDER
status: 00_INBOX
authored_by: PRODDY
reviewed_by: LEAD_PENDING
date: 2026-03-02
priority: P1
tags: [patient-facing, design-system, compass, accessibility, branding, PatientReport]
failure_count: 0
depends_on: [WO-563, WO-565]
blocks: [WO-566]
---

## PRODDY PRD

### 1. Problem Statement

The Integration Compass fails the foundational trust test: a patient receiving this link post-session should feel held, oriented, and calm. Instead they encounter inconsistent zone badge colors (violet/rose/teal with no system logic), untreated browser-default sliders with a muddy brown track, ghost feeling pills so low-opacity they read as broken, a scroll-indicator emoji erroneously rendered inside the Zone 2 heading, and slider end-labels ("Struggling / Thriving") copy-pasted verbatim onto the Anxiety dimension where they are semantically wrong. The page does not feel like a premium clinical product. It feels unfinished.

---

### 2. Target User + Job-To-Be-Done

A patient 1–28 days post-session needs to open their Compass link, immediately feel calm and oriented, log their daily check-in in under 90 seconds, and leave feeling their healing is witnessed — so they return tomorrow.

---

### 3. Success Metrics

1. Zero rendered browser-default form controls visible in the check-in section at 1440×900 and 390×844 — all sliders use custom CSS styling (teal track, rounded thumb, zero brown/grey runnable track)
2. All visible text elements pass WCAG AA (4.5:1 for body, 3:1 for large text) against actual rendered background — verified by INSPECTOR contrast audit
3. Every zone number badge (1–5) uses identical visual treatment — single teal-ring / slate-bg / white-numeral system; arbitrary per-zone accent colors removed from badges

---

### 4. Feature Scope

#### In Scope
- **Zone badge system:** Consistent treatment across all 5 zones — teal ring, slate background, white numeral. Zone title text color maps to domain (Physical=teal, Emotional=rose, Mental=violet, Spiritual=gold) but applied *intentionally*, never arbitrarily
- **Custom slider CSS:** Replace browser-default `<input type="range">` appearance with styled track (`-webkit-slider-runnable-track`, `-moz-range-track`): teal for filled portion, slate-700 for unfilled. Smooth teal-500 thumb with box-shadow glow. Applies to all 4 check-in sliders
- **Slider end-labels corrected (semantically accurate per dimension):**
  - Mood 🌤 → "Low" / "High"
  - Sleep quality 🌙 → "Poor" / "Restful"
  - Sense of connection 💛 → "Isolated" / "Connected"
  - Anxiety 🌊 → "Calm" / "Anxious"
- **Zone 2 artifact removed:** Identify and remove the scroll-indicator/cursor emoji rendering inside "THE EMOTIONAL TERRAIN" heading — source is likely a Unicode character or a CSS `cursor:` visual glitch in the heading JSX
- **Ghost feeling pills contrast lifted:** opacity → 0.75, border-color opacity → 0.35, text opacity → 0.65 — readable as intentional preview, not broken UI
- **Typography system enforced:** All headings use `ppn-page-title`, `ppn-section-title`, `ppn-card-title`. All body text uses `ppn-body`. All metadata uses `ppn-meta`. No ad-hoc `fontSize` inline styles. BUILDER must choose one of the two approaches in Open Question 2 and apply it consistently
- **Phase 3 color lock applied:** Primary accent = `#14b8a6` (teal). Gold = benchmark stats + Spiritual domain only. Violet = Emotional zone accent only. Rose = REMOVED from all structural elements; reserved for safety/adverse events exclusively
- **"Share with a Friend" button:** Background `rgba(15,23,42,0.4)` (dark slate), gold border `rgba(245,158,11,0.35)`, gold text — reads as intentional secondary CTA

#### Out of Scope
- Any Supabase query changes, schema changes, or hook changes
- WO-566 self-reporting expansion
- Print view
- Changes to any file other than `PatientReport.tsx` (except `GLOBAL_CSS` constants within it)

---

### 5. Priority Tier

**P1** — Patient-facing page linked from practitioner workflow. Current visual state degrades trust at first impression. Every day it ships in this state risks a patient abandoning the daily check-in habit that drives the entire dataset.

---

### 6. Open Questions for LEAD

1. **Mouse emoji artifact source:** Is the scroll cursor visible next to "THE EMOTIONAL TERRAIN" a Unicode character in the JSX string, a CSS `cursor: not-allowed` bleeding into the heading render, or a rogue emoji in the zone title constant? BUILDER must `grep` for it before removing
2. **Typography system approach:** `PatientReport.tsx` uses inline `style={{}}` not Tailwind classes. LEAD to decide: (a) migrate headings to `ppn-*` Tailwind classes (architecturally clean, moderate risk for this self-contained file), or (b) replicate the type scale as CSS custom properties inside the existing `GLOBAL_CSS` template literal (zero dependency risk). PRODDY recommends (b) to stay within the file's current architecture
3. **Safari iOS slider CSS:** Custom `<input type="range">` styling requires `-webkit-` prefixes. LEAD to confirm mobile Safari is a required target for the patient Compass (likely yes — patients open this on their phones)

---

## INSPECTOR Pre-Acceptance Criteria

- [ ] Zero browser-default slider appearance visible (screenshot proof required)
- [ ] All zone badges render identically — same size, same color treatment
- [ ] Anxiety slider shows "Calm" / "Anxious" (not "Struggling" / "Thriving")
- [ ] No rose/pink color used on any badge, heading, or structural element
- [ ] Ghost feeling pills are visible and legible as a preview state
- [ ] Zone 2 heading contains no extraneous character or emoji artifact
- [ ] TypeScript: zero new `any` types
- [ ] WCAG AA contrast: body text on Zone 3 check-in background ≥ 4.5:1

---

*PRODDY Sign-Off:*
- [x] Problem Statement ≤ 100 words
- [x] All metrics are measurable with specific numbers or events
- [x] Out of Scope section is explicit and non-empty
- [x] Priority P1 with stated reason
- [x] Open Questions are genuine architecture decisions, not answered by PRODDY
- [x] No code, SQL, or schema authored in this document
- [x] Total PRD < 600 words
