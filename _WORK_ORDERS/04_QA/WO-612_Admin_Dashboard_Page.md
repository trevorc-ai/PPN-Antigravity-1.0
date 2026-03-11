---
id: WO-612
title: AdminDashboard.tsx — New Admin Hub Page (4 Modules)
owner: BUILDER
authored_by: INSPECTOR
routed_to: LEAD → BUILDER
status: 03_BUILD
priority: P1
created: 2026-03-11
depends_on: WO-610 (schema must be applied first)
---

## Context

There is currently no central admin hub. The only admin-gated page is `/admin/invite` (VIP Invite Tool). This WO creates a new page `/admin/dashboard` with four functional modules accessible from a segmented tab bar.

---

## Files to Create / Modify

| File | Action |
|---|---|
| `src/pages/admin/AdminDashboard.tsx` | [NEW] Main admin page |
| `src/App.tsx` | [MODIFY] Register the new route |

---

## Route Registration (`src/App.tsx`)

### Add lazy import (with other admin imports, after line 41):
```tsx
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
```

### Add route (directly below the `/admin/invite` route at line ~462):
```tsx
<Route
  path="/admin/dashboard"
  element={userRole === 'admin' ? <AdminDashboard /> : <Navigate to="/dashboard" replace />}
/>
```

---

## `src/pages/admin/AdminDashboard.tsx` — Full Spec

### Layout
- Full-width page, no max-width constraint
- Tab bar at the top with 4 tabs: `Feedback Inbox`, `Users`, `Site Map`, `Platform`
- Mobile-responsive: tabs become horizontally scrollable at small viewports
- Each tab renders a panel below the tab bar

---

### Tab 1: Feedback Inbox

**Data:** Query `user_feedback` ordered by `created_at DESC`. Join to `log_user_profiles` to get submitter display name and email.

**Filter chips above the list:** All | Bugs 🐛 | Features ✨ | Comments 💬

**Each card shows:**
- Row 1: Badge (type pill) + submitter name + email + relative time (e.g. "3 hours ago")
- Row 2: Page URL they were on
- Row 3: Message text (full, no truncation)
- Row 4 (BUG only): Collapsible `<details>` panel labeled "Browser Details" showing the `metadata` JSON fields in a readable key/value list
- Row 5: Status badge + one-tap cycle button: `Open → Reviewed → Resolved → Open`

Status cycle writes `UPDATE user_feedback SET status = '<next>' WHERE id = '<id>'` directly via Supabase client.

---

### Tab 2: User Management

**Data:** Query `log_user_profiles` ordered by `created_at DESC`. Join to `auth.users` for last-sign-in-at (via `supabase.auth.admin.listUsers()` — note: this requires the service_role key. **Use a Supabase Edge Function or RPC to proxy this.** Do not expose service_role key to the frontend).

**Actually simpler approach — no service_role needed:** Query `log_user_profiles` only. It has `user_id`, `display_name`, `email` (if stored), `role`, `created_at`. This is sufficient for day-to-day admin.

**Table columns (mobile: stack into cards):**
- User (name + email)
- Role (dropdown: `practitioner` / `admin` / `suspended`)
- Joined
- Actions (link to `/clinician/<user_id>`)

**Role dropdown onChange:** Immediately fires `UPDATE log_user_profiles SET role = '<value>' WHERE user_id = '<id>'`. Show a transient success toast.

**Search:** Client-side filter on name/email. No backend search call needed for the current user count.

> **IMPORTANT — No accidental self-demotion:** If the logged-in admin tries to change their own role away from `admin`, show an inline error and prevent the update. Message: "You cannot change your own admin role."

---

### Tab 3: Site Navigator

A read-only reference panel. No data fetching required — this is hardcoded route data.

**Structure:** Collapsible `<details>` group per category. Each row has:
- Path (monospace)
- Badge: 🔒 if auth-required, 👑 if admin-only, nothing if public
- "Go →" button that calls `navigate(path)` (or `window.open` for routes that generate PDFs)

**Route groups and paths (hardcoded):**

```
Public / Marketing:
  /landing, /about, /pricing, /contribution, /for-clinicians,
  /for-payers, /for-patients, /structural-privacy, /global-network,
  /academy, /partner-demo, /beta-welcome

Auth:
  /login, /signup, /forgot-password, /reset-password, /secure-gate

Legal & Data:
  /privacy, /terms, /data-policy, /data-policy/print

Patient-Facing (No Auth):
  /patient-report, /integration-compass, /meq30,
  /patient-form/:formId [note: requires formId — show as disabled],
  /assessment

Core App 🔒:
  /search, /dashboard, /analytics, /news, /catalog, /interactions, /audit

Wellness Journey 🔒:
  /wellness-journey, /companion/:sessionId [note: requires sessionId — show as disabled]

Protocol 🔒:
  /protocols, /protocol/:id [disabled], /clinician/:id [disabled]

Settings & Exports 🔒:
  /settings, /profile/edit, /data-export, /session-export,
  /download-center

Reports 🔒:
  /clinical-report-pdf, /demo-clinical-report-pdf

Help Center 🔒:
  /help, /help/faq, /help/quickstart, /help/overview,
  /help/interaction-checker, /help/wellness-journey, /help/reports,
  /help/scanner, /help/devices, /help/settings

Deep Dives (Public):
  /deep-dives/patient-flow, /deep-dives/clinic-performance,
  /deep-dives/patient-constellation, /deep-dives/molecular-pharmacology,
  /deep-dives/protocol-efficiency, /deep-dives/workflow-chaos,
  /deep-dives/safety-surveillance, /deep-dives/risk-matrix

Admin Only 👑:
  /admin/dashboard, /admin/invite

Dev / Showcase 🔒:
  /component-showcase, /hidden-components,
  /arc-of-care, /arc-of-care-phase2, /arc-of-care-phase3,
  /arc-of-care-dashboard
```

Routes that require a dynamic `:id` or `:sessionId` segment should render their row with the "Go →" button **disabled** and a note "(requires ID)".

---

### Tab 4: Platform Health

Four stat tiles, loaded once on mount:
- Total Users: `COUNT(*) FROM log_user_profiles`
- Total Sessions: `COUNT(*) FROM log_clinical_records`
- Total Clinics: `COUNT(DISTINCT site_id) FROM log_clinical_records`
- New This Week: `COUNT(*) FROM log_user_profiles WHERE created_at > now() - interval '7 days'`

No charts needed — numbers only, large font, labeled.

---

## Visual / UX Requirements

- Follow existing PPN design tokens: dark backgrounds, `border border-white/10`, `text-slate-300`, etc.
- Tab bar: active tab has `text-indigo-300 border-b-2 border-indigo-500`
- Status badges: `open` = amber / `reviewed` = blue / `resolved` = teal — all with icon, not color-only
- All interactive elements minimum 44px tap height
- Page heading: "Admin Console" with a 👑 emoji prefix

---

## Constraints

- No changes to any file except `App.tsx` and the new `AdminDashboard.tsx`
- No new npm packages
- No changes to Sidebar or TopHeader
- No schema changes (those are in WO-610)

---

## Acceptance Criteria

- [ ] `/admin/dashboard` loads for admin user without error
- [ ] Non-admin is redirected to `/dashboard`
- [ ] Feedback Inbox loads submissions, filter tabs work, status cycle saves
- [ ] User table loads; role dropdown saves; self-demotion blocked with error message
- [ ] Site Navigator: all non-parameterized routes navigate correctly; parameterized routes show as disabled
- [ ] Platform Health: four stat tiles render with real DB counts
- [ ] `npm run build` clean, zero TypeScript errors
