---
id: WO-641
title: Admin Dashboard — Onboarding Pipeline Tab
owner: BUILDER
authored_by: INSPECTOR
routed_to: LEAD → BUILDER
status: 097_BACKLOG
priority: P1
created: 2026-03-14
depends_on: WO-612, WO-637
---

## Context

There is currently no visibility into where an invited user is in the onboarding journey. Once an invite is sent, the admin has no way of knowing whether the user clicked the link, set their password, completed the wizard, or logged their first session — without manually checking Supabase. As the beta group grows, this gap becomes unmanageable.

This WO adds a fifth tab to the Admin Dashboard: an **Onboarding Pipeline** that shows every invited/registered user as a card progressing through five stages.

---

## Files to Modify

| File | Action |
|---|---|
| `src/pages/admin/AdminDashboard.tsx` | [MODIFY] Add PipelineTab component and register as 5th tab |

---

## Pipeline Stages

```
[ Invited ] → [ Link Clicked ] → [ Password Set ] → [ Wizard Complete ] → [ First Session ]
```

**How each stage is detected:**

| Stage | Detected By |
|---|---|
| Invited | Record exists in `auth.users` with `last_sign_in_at` IS NULL |
| Link Clicked | `last_sign_in_at` IS NOT NULL (Supabase sets this on first auth) |
| Password Set | Same as Link Clicked — password reset completes the session |
| Wizard Complete | Row exists in `log_user_profiles` with non-null `display_name` |
| First Session | Row exists in `log_clinical_records` for this user's `site_id` |

Since the frontend cannot query `auth.users` directly without service role, this tab uses:
- `log_user_profiles` — present only when wizard is complete
- `log_user_sites` — present only when wizard creates the site
- `log_clinical_records` — count > 0 means first session happened
- Invited users with no profile row are those who haven't completed wizard

For "Link Clicked" and "Password Set" status — these require either:
(a) A Supabase Edge Function that queries `auth.users` with service role, or
(b) Tracking this in a `log_invite_events` table (preferred — no service role needed)

**Recommended approach for MVP:** Use 3 detectable stages via existing tables:
1. **Invited** — user_id exists in a future `log_invite_log` table OR can be inferred from `log_user_profiles` absence
2. **Registered** — `log_user_profiles` row exists with `display_name` not null
3. **Active** — at least one `log_clinical_records` row exists for their site

---

## Component Spec

```tsx
const PIPELINE_STAGES = ['Invited', 'Registered', 'Active'] as const;

interface PipelineUser {
  userId: string;
  email: string;
  displayName: string | null;
  invitedAt: string;      // from log_user_profiles created_at
  registeredAt: string | null;
  firstSessionAt: string | null;
  daysInStage: number;
  stage: typeof PIPELINE_STAGES[number];
}
```

**Layout:** Three columns (one per stage), each containing user cards.

**User card shows:**
- Display name (or email if not yet registered)
- Days in current stage (with amber warning if > 3 days stuck)
- Action button:
  - Invited stage: "Resend Invite" (triggers generate-invite Edge Fn)
  - Registered stage: "View Profile" link
  - Active stage: "View Sessions" (future link)

**Stuck user detection:** If a user has been in "Invited" stage for > 3 days, show amber border + "Follow up?" label.

---

## Data Fetch

```tsx
const loadPipeline = async () => {
  // Get all registered users
  const { data: profiles } = await supabase
    .from('log_user_profiles')
    .select('user_id, display_name, email, created_at');

  // Get all sites (to map user → site)
  const { data: sites } = await supabase
    .from('log_user_sites')
    .select('user_id, site_id');

  // For each site, check if any sessions exist
  const siteIds = sites?.map(s => s.site_id) ?? [];
  const { data: sessions } = await supabase
    .from('log_clinical_records')
    .select('site_id, session_started_at')
    .in('site_id', siteIds)
    .order('session_started_at', { ascending: true });

  // Merge into PipelineUser[] and categorize by stage
};
```

---

## Acceptance Criteria

- [ ] 5th tab "Pipeline" appears in Admin Dashboard tab bar (icon: `route` or `linear_scale`)
- [ ] Three stage columns render with user cards correctly categorized
- [ ] Users stuck for > 3 days in Invited stage show amber border
- [ ] Resend Invite button works (reuses WO-640 logic)
- [ ] Columns show count badge (e.g., "Invited (2)")
- [ ] Empty stage columns show "No users at this stage"
- [ ] `npm run build` clean
