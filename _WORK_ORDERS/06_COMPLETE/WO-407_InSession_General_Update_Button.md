---
id: WO-407
status: 03_BUILD
owner: BUILDER
priority: HIGH
failure_count: 0
created: 2026-02-23
source: Jason/Trevor Demo Debrief 2/23/26
demo_deadline: Dr. Allen demo (target Wednesday 2/25/26)
---

# WO-407 — Add "General Update" Button to In-Session Monitoring Screen

## USER STORY (verbatim from demo)
> "It feels like there should be a button that's not emergency or turning it off. It's really more of a just an update — just a timed hour one update. And if something goes wrong you do rescue protocol or adverse. But just like normal everything's great — how do you do updates that way?"
> — Jason, 00:57:01

> "I think we should have that as part of our presentation. I think we can assume that here you're a doctor sitting in your session and you click Update and it takes you to the update screen. We should have that — basic."
> — Jason, 00:57:46

> "One should just be an update which will it'll come up."
> — Jason, 01:00:38

## LEAD ARCHITECTURE

The in-session monitoring screen currently has only two action buttons: **Rescue Protocol** and **Adverse Event / End Session**. There is no standard "everything is fine, log a check-in" action.

### What to Build

Add a **"Session Update"** button as the primary (non-emergency) action on the in-session monitoring screen.

**Button hierarchy on the in-session screen should become:**

```
[ ▶ Session Update ]   [ ⚠ Rescue Protocol ]   [ 🛑 End Session ]
```

The "Session Update" button should be visually dominant (primary styling), while Rescue Protocol is secondary/warning and End Session is danger/ghost.

### "Session Update" Modal / Panel behavior:

When the practitioner clicks "Session Update," it opens a panel/modal with:

1. **Vitals quick entry** — same vitals fields as the pre-session screen (BP, temp, respiratory rate, jaw clenching scale, diaphoresis/sweating scale, etc.). Pre-filled to last saved values. Optional — skip if nothing changed.

2. **Pre-loaded observation dropdowns** — a set of fast-tap dropdown categories for the most common in-session observations. Examples:
   - Patient affect: [Calm / Anxious / Euphoric / Dissociative / Tearful / Unresponsive]
   - Responsiveness: [Fully responsive / Partially responsive / Eyes closed, calm / Eyes closed, distressed]
   - Physical comfort: [Normal / Restless / Nausea reported / Requesting blanket / Other]

3. **Free-text note field** (optional, clearly labelled "Session note") — for anything that doesn't fit the dropdowns. Kept intentionally minimal to discourage PHI entry.

4. **Auto-timestamp on save** — every session update is saved with the current timestamp and timer elapsed time (e.g., "T+01:14:32"). Logged as a separate data point in the session log.

5. **"Save Update" button** — returns to the in-session monitoring screen. No session interruption.

### Important notes:
- This does NOT stop or pause the session timer.
- The session log at the bottom of the in-session screen should display all updates chronologically with their timestamps.
- This is separate from the Rescue Protocol flow. Rescue Protocol should remain for comfort interventions. This is for normal monitoring.

---

## ACCEPTANCE CRITERIA
- [ ] "Session Update" button appears prominently on the in-session monitoring screen
- [ ] Clicking it opens a panel/modal with vitals, observation dropdowns, and optional note
- [ ] Each save auto-timestamps and adds a new entry to the session log
- [ ] Timer continues running uninterrupted during update entry
- [ ] Button hierarchy: Update (primary) > Rescue (warning) > End Session (danger)
- [ ] Session log shows all saved updates in chronological order

## FILES LIKELY AFFECTED
- `src/components/WellnessJourney/` — in-session monitoring component (Phase 2)
- Session log component / data layer

## HANDOFF
When done: update `status: 04_QA`, `owner: INSPECTOR`, move to `_WORK_ORDERS/04_QA/`.
