---
id: WO-506
slug: First-Login-Onboarding-UX
status: 00_INBOX
owner: PENDING
priority: HIGH
failure_count: 0
created: 2026-02-26
---

# WO-506: First-Login Onboarding UX

## User Request (Verbatim)
> "It just goes right to the dashboard when logging in. And there's no obvious first step especially on mobile — it is not very welcoming. We designed a guided tour specifically for new users, which should auto run on first login. Also, I think we need to have a little bit of a nicer hero section on the dashboard. In the original design, that's where the search portal was. It looks sort of like a Google homepage, but that has since been removed. We need to tighten up the first parts of the UX."

---

## Context

Beta testing is now live with the first external user (Jason Bluth). The guided tour (`GuidedTour.tsx`) is fully built and working but requires manual trigger — it does not fire automatically on first login. The dashboard header currently shows only the static text "Dashboard" in large type, which is cold and provides no orientation for a new user landing there for the first time, especially on mobile.

The metric cards in the dashboard (`ClinicPerformanceCard`) show hardcoded placeholder numbers (23 protocols, 71%, 4.2 hrs). A brand-new user with zero real sessions sees fabricated data. This is a credibility issue.

---

## Acceptance Criteria

### 1. Auto-Tour on First Login (REQUIRED)

- On first visit to `/dashboard`, detect whether the user has completed the tour using **Supabase `user_metadata`**, not `localStorage`
- Check: `session.user?.user_metadata?.onboarding_toured !== true`
- If true (first time), auto-start `GuidedTour` after a **1500ms delay** from dashboard mount — user sees the dashboard briefly before the tour begins, which is the correct UX pattern
- When the tour `onComplete` callback fires (whether user finishes OR skips), immediately call:
  ```ts
  supabase.auth.updateUser({ data: { onboarding_toured: true } })
  ```
- This flag must persist across devices, browsers, and login sessions
- The delay timer must be **cancelled on component unmount** to prevent memory leaks

### 2. Personalized Dashboard Header (REQUIRED)

- Replace the static `h1 "Dashboard"` with a **personalized greeting** using the clinician's display name
- Source priority: (1) `clinician_profiles.display_name` or `full_name`, (2) email prefix before `@`, (3) fallback to "Welcome"
- Show the current date below the greeting (e.g., `Thursday, February 26`)
- The existing "System Online" badge and "Log New Session" CTA must remain exactly as-is
- The `data-tour="dashboard-header"` attribute must remain intact — the guided tour depends on it

**Example output:**
```
Good morning, Jason.
Thursday, February 26
```

### 3. Empty-State Aware Metric Cards (REQUIRED)

- The `ClinicPerformanceCard` component currently receives `protocols.length` to conditionally handle data — extend this pattern
- When `protocols.length === 0` (new user, no real data):
  - **Value** displays `--` instead of hardcoded numbers
  - **Change badge** displays `No data yet` instead of `+12%`
  - **Comparison line** displays `Log your first session to start tracking`
- When `protocols.length > 0`, existing behavior applies (real data or current fallback)
- The "Safety Alerts" and "Avg Session Time" cards are not directly driven by protocol count — leave their hardcoded values as-is for now (tracked separately)
- The "Suggested Next Steps" section hardcoded items are acceptable to remain as-is

---

## Technical Notes

### Files to Modify
| File | Change |
|---|---|
| `src/pages/Dashboard.tsx` | Add first-login tour trigger logic + personalized greeting + empty-state metric cards |
| `src/components/GuidedTour.tsx` | Call `supabase.auth.updateUser` on `onComplete` and on skip |
| `src/contexts/AuthContext.tsx` | *(Already modified in this session — no further changes needed)* |

### Reading Clinician Name
The `clinician_profiles` table exists. Use the existing `useAuth()` hook to get `user`, then query the profile. If the profile query is async and blocking, use the email prefix as the immediate fallback while it loads — do not delay the dashboard render.

### Do Not
- Do not use `localStorage` for the tour flag — it can be cleared
- Do not add a new onboarding widget, modal, or separate page
- Do not change any tour steps or tour logic — only add the auto-trigger and the `updateUser` call
- Do not show a "You're one of the first" or similar beta-specific messages
- Do not block the dashboard render waiting for the profile query

---

## Definition of Done

- [ ] New user (no `user_metadata.onboarding_toured`) lands on dashboard, sees it for ~1.5s, then tour begins automatically
- [ ] Completing or skipping the tour sets `user_metadata.onboarding_toured: true` in Supabase
- [ ] Returning user (flag set) sees dashboard with no tour trigger
- [ ] Dashboard header shows personalized greeting with current date
- [ ] `ClinicPerformanceCard` shows `--` / `No data yet` when user has zero protocols
- [ ] No regressions on mobile — tour and header stack correctly on small screens
- [ ] Tested with Jason Bluth's account (first-time login confirms auto-tour fires)

