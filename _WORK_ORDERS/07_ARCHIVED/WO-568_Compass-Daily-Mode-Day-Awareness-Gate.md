---
id: WO-568
title: Integration Compass — Component Extraction + Daily Mode + Day-Awareness + Practitioner Panel Gate
owner: BUILDER
status: 00_INBOX
authored_by: PRODDY
reviewed_by: LEAD_APPROVED
date: 2026-03-02
priority: P0
tags: [patient-facing, compass, daily-ritual, ux-architecture, PatientReport, day-awareness, component-extraction, showcase]
failure_count: 0
depends_on: [WO-563, WO-565, WO-567]
blocks: [WO-566, WO-569]
---

## PRODDY PRD

### 1. Problem Statement

The Integration Compass collects daily patient check-ins that power the practitioner's
intelligence dashboard. But the page's architecture works against the habit it needs to
form. Every daily visit requires a patient to scroll past ~1,500px of static context
before reaching the check-in form buried in Zone 3. There is no time-awareness — the
page cannot distinguish Day 1 from Day 28, and speaks to the patient identically on
both. The practitioner's control panel (zone toggles, copy-link, customize options) is
visible on the same URL the patient opens. These three structural issues are the primary
reason daily check-in compliance will fail to reach target.

---

### 2. Target User + Job-To-Be-Done

A patient 1–28 days post-session needs to open their Compass link each morning, see
their check-in form immediately without scrolling, submit in under 60 seconds, receive
one meaningful piece of feedback about their progress, and close the page feeling
witnessed — so that the habit of daily return is formed and sustained.

---

### 3. Success Metrics

1. Time-to-first-slider-interaction ≤ 3 seconds from page load on return visits
   (patient has prior check-ins) — measured by observing the check-in form appearing
   above the fold without any scroll at 390×844 (iPhone viewport)
2. The string `daysPostSession` is rendered correctly in at least one visible UI
   element on every Compass load where `session_date` is available — verified by
   INSPECTOR grep of rendered output across test sessions at day 1, 7, and 21
3. Zero instances of the practitioner customize panel visible on any Compass URL that
   does not include a valid `practitionerToken` query parameter — verified by loading
   the page without the param and confirming the panel is absent from the DOM

---

### 4. Feature Scope

#### In Scope

**Feature D — Component Extraction (MUST complete before Features A/B/C)**

> **Architectural mandate (user-authorized, 2026-03-02):** No components are to remain
> hard-coded inside page files. All Compass components must be extracted to
> `src/components/compass/`, registered in the Component Showcase, and imported
> back into `PatientReport.tsx`. This makes every component reusable, testable,
> and independently improvable.

BUILDER must extract the following from `PatientReport.tsx` into separate files:

| Current inline component | Extract to | Showcase entry |
|---|---|---|
| `Zone` (zone shell/wrapper) | `src/components/compass/CompassZone.tsx` | CompassZone |
| `SliderField` (custom range input) | `src/components/compass/CompassSlider.tsx` | CompassSlider |
| `FeelingWave` (feeling pills + ghost state) | `src/components/compass/FeelingWave.tsx` | FeelingWave |
| `EMAGraph` (EMA line chart, SVG) | `src/components/compass/CompassEMAGraph.tsx` | CompassEMAGraph |

New components to build (do NOT exist yet — build them fresh in `src/components/compass/`):

| New component | File | Purpose |
|---|---|---|
| `DailyCheckInCard` | `src/components/compass/DailyCheckInCard.tsx` | Promoted check-in form for Daily Mode. Contains 4 CompassSliders + submit + insight line |
| `DayAwarenessHeader` | `src/components/compass/DayAwarenessHeader.tsx` | Day-aware greeting text, driven by `daysPostSession` prop |
| `CompassInsightLine` | `src/components/compass/CompassInsightLine.tsx` | Post-submission insight: trend or streak |

All components must:
- Be registered in the Component Showcase (add entry to the existing showcase page/registry)
- Accept all required data via props — zero direct Supabase calls inside a component
- Export a typed Props interface
- Include an empty/loading state
- Be usable independently of `PatientReport.tsx`

Once extraction is complete, `PatientReport.tsx` becomes an assembly file: it imports
and wires components, manages page-level state, and handles routing. No component
definitions remain inline.

---

**Feature A — Daily Mode vs. Full Report Mode**

The page detects whether the patient has any prior check-ins logged for this session
(`hasAnyCheckins: boolean`, derived from `usePhase3Data` — truthy if `emaPoints.length > 0`).

- **First-ever load (no prior check-ins):** Page renders exactly as it does today —
  Full Report mode, all 5 zones visible, check-in form in Zone 3. This is the
  practitioner-intended onboarding experience and should not change.

- **Return load (≥1 prior check-in exists):** Page renders in Daily Mode.
  Daily Mode layout:
  1. The hero header renders as normal (compact — no change)
  2. Immediately below the header, before any zone card, a **Daily Check-In card**
     renders full-width. This is the same check-in form currently in Zone 3,
     promoted to position 1 on the page
  3. The day-aware greeting replaces the current "How are you today, traveler?" copy
     (see Feature B below)
  4. After submission, a single insight line renders below the success state:
     derive from the last 3 check-ins — if any metric improved, surface it (e.g.,
     "Your mood has risen 3 points over the last 3 days."). If no trend, show the
     streak count: "You've checked in N days in a row."
  5. Below the submitted check-in card, a disclosure link: "See your full journey ↓"
     — clicking it smoothly scrolls to Zone 1 and all 5 zones become visible below.

  The Zone 3 check-in block is HIDDEN (not removed) in Daily Mode to avoid
  duplication. It remains in the DOM for Full Report mode only.

**Feature B — Day-Awareness**

Compute `daysPostSession` from `sessionDate` (already available in `usePhase3Data`
as the dosing session date). Use it in the following places:

- **Daily Mode check-in greeting (replaces static copy):**
  - Days 1–3: "Day {N} — The first days are often the most intense. How are you today?"
  - Days 4–7: "Day {N} of your integration window. How are you?"
  - Days 8–14: "Day {N} — You're in the heart of the neuroplastic window. How are you today?"
  - Days 15–21: "Day {N} — Your window is still open. How are you showing up?"
  - Days 22–28: "Day {N} — You're approaching the end of the standard integration window. How do you feel?"
  - Days 29+: "Integration continues. How are you today?"

- **Zone 3 header sentence (the one WO-563 specified but never built):**
  When `daysPostSession` is available, below the EMA graph heading add:
  `"You are on Day {N} of your integration window."` in teal, 14px, weight 600.
  If days > 28: `"Your standard integration window has closed, but integration continues."`
  If `sessionDate` is null/unknown: do not render this line.

- **Neuroplastic window glow label (Zone 3 EMA graph):**
  The golden window overlay on the graph already exists visually. Add a text label
  inside it at the right edge: `"← Day 21"` in gold at 11px (SVG `<text>` element,
  exempt from font minimum rule per frontend-best-practices).

**Feature C — Practitioner Panel Gate**

The customize panel (zone toggles, personal message textarea, Copy Link, Print PDF)
must only be visible when the viewer is the practitioner, not the patient.

Implementation approach (LEAD to confirm):
- Add a `practitionerView` boolean derived from the URL: parse `searchParams.get('pv')`
  — if this param is present and equals `'1'`, `practitionerView = true`.
- The practitioner generates the patient link WITHOUT this param (as today).
- The practitioner views their own customization panel by opening the link with `?pv=1`
  appended (the existing "Copy Link" button in Phase 3 generates this variant for
  the practitioner's own browser).
- In `PatientReport.tsx`, gate the entire customize panel JSX on `practitionerView`:
  `{practitionerView && (<CustomizePanel ... />)}`
- The practitioner trigger pill button (`⚙ Practitioner: Customize this Compass`)
  is also gated on `practitionerView` — it never renders for the patient.

> ZERO PHI requirement maintained: `?pv=1` is not authentication. It is a UI gate
> only. The practitioner customize panel does not write to the database, does not
> expose PHI, and the personal message is never stored. Removing it from the patient
> URL is a trust/UX decision, not a security one.

#### Out of Scope

- Patient authentication or login (explicitly excluded in WO-563, remains excluded)
- Push notifications or SMS reminders for daily check-in (separate WO)
- Animated transitions between Daily Mode and Full Report mode (post-V1)
- Any database schema changes
- Any changes to the practitioner portal Phase 3 view
- WO-566 self-reporting expansion (behavioral chips, PHQ-2, safety gate) —
  that ticket depends on this one completing first
- Streak persistence to database (v1 streak is derived client-side from `emaPoints`
  count — no new write required)

---

### 5. Priority Tier

**P1** — This ticket is a prerequisite for WO-566 (self-reporting expansion) which
cannot be built on top of the current Zone 3 layout without a merge conflict. It also
directly determines whether daily check-in compliance reaches the 60% target metric
in WO-563. Every day the page ships without Daily Mode, patients learn the habit of
*not* returning because the effort cost is too high.

---

### 6. LEAD Decisions (Pre-Authorized — Unblocks BUILDER Immediately)

1. **`practitionerView` param:** Use `?pv=1`. Zero-PHI payload, same obscurity
   model as the session UUID. No server-side token required for v1. If practitioners
   report patients gaming this, a token approach is a fast follow.

2. **Daily Mode trigger:** ≥1 prior check-in. A patient who has submitted even once
   has already seen the Full Report (it was their first load). Daily Mode on return
   is correct.

3. **`sessionDate` source:** BUILDER must check `usePhase3Data.ts` — if `session_date`
   is not already selected, add it to the existing sessions query. One line, no migration.
   If `session_date` is unavailable (older sessions), `daysPostSession` defaults to
   `null` and all day-aware copy falls back to the timeless variants gracefully.

---

## INSPECTOR Pre-Acceptance Criteria

- [ ] On first-ever load (no check-ins): page renders in Full Report mode — all 5
  zones visible, check-in in Zone 3. No regression from current behavior.
- [ ] On return load (≥1 check-ins): Daily Mode check-in card appears above Zone 1
  without any scroll required at 390×844 viewport
- [ ] Day-aware greeting renders correctly for at least 3 test cases:
  Day 1, Day 10, Day 25 (use `?sessionId=` params pointing to seeds with different
  session dates, or mock via `daysPostSession` override)
- [ ] "You are on Day N of your integration window." renders in Zone 3 when
  `sessionDate` is available
- [ ] Practitioner customize panel: NOT present in DOM when page loads without `?pv=1`
- [ ] Practitioner customize panel: IS present in DOM when page loads with `?pv=1`
- [ ] Insight line renders after check-in submission (streak count or metric trend)
- [ ] "See your full journey ↓" disclosure link scrolls to Zone 1 correctly
- [ ] TypeScript: zero new `any` types
- [ ] Mobile: Daily Mode check-in card is touch-friendly, sliders full-width at 390px

---

*PRODDY Sign-Off:*
- [x] Problem Statement ≤ 100 words
- [x] All 3 metrics are measurable with specific numbers or events
- [x] Out of Scope section is explicit and non-empty
- [x] Priority P1 with stated reason
- [x] Open Questions are genuine architecture decisions, not answered by PRODDY
- [x] No code, SQL, or schema authored in this document
- [x] Total PRD < 600 words
