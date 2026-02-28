---
id: WO-511
title: "Global Feedback Widget — Instant Comment Card in TopHeader"
status: 03_BUILD
owner: BUILDER
authored_by: CUE
created: 2026-02-26
failure_count: 0
priority: P1
tags: [feedback, topheader, beta, ux, floating-card]
depends_on: []
---

# WO-511: Global Feedback Widget

## USER REQUEST (Verbatim)
> "One simple feature that I think we should put in the top header, is a comment icon next to the compass icon where from any screen the user can leave a comment for the developers (us.) Request a feature, report a bug, whatever, without having to go fill out some form somewhere on a help page."
>
> Clarification: "Instant comment card"

---

## LEAD ARCHITECTURE

**UX Pattern:** Floating card (not a full modal). Clicks icon → card drops down anchored below the icon, similar to the existing `InstantConnectModal` approach but lighter. Clicking outside dismisses it. On mobile: slides up from bottom as a bottom sheet.

**Component:** `FeedbackCard.tsx` at `src/components/FeedbackCard.tsx`

**Card contents (minimal):**
- Type selector — 3 pill toggle buttons: `🐛 Bug`, `✨ Feature`, `💬 Comment` — single select, default = Comment
- Single textarea — placeholder: "Tell us what you're thinking..." — no character limit shown, max 1000 chars enforced
- Current page auto-captured via `window.location.pathname` — not shown to user, sent silently
- Submit button — `bg-indigo-600`, label "Send Feedback" — shows spinner while inserting, shows "✅ Sent!" for 1.5s then closes card
- No user email field — user is authenticated, `user.id` captured automatically

**Data destination:** `public.user_feedback` Supabase table (SOOP to create via migration — see below). While SOOP migration is pending, BUILDER wraps the insert in try/catch and logs to console. The UI does not break if the table doesn't exist yet.

**TopHeader integration:**
- New comment icon button added directly after the Tour button in the authenticated icon row (line ~232 of `TopHeader.tsx`)
- Icon: `MessageSquarePlus` from `lucide-react`
- Same size/style as Tour button: `size-11 rounded-xl bg-white/5 border`
- Border color: `border-teal-400/50 hover:border-teal-400/80` — teal to distinguish from Tour (blue) and InstantConnect (github-blue)
- Hidden on mobile same as Tour button (`hidden lg:block`) — on mobile, add to the user dropdown menu as a text item "Leave Feedback"

**Accessibility:**
- `aria-label="Leave feedback"` on trigger button
- `aria-live="polite"` on success message
- Focus moves into card on open, returns to trigger button on close

---

## BUILDER MIGRATION

BUILDER to create the migration file at `supabase/migrations/20260226_create_user_feedback.sql`:

```sql
-- additive only, no drops
CREATE TABLE IF NOT EXISTS public.user_feedback (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type        TEXT NOT NULL CHECK (type IN ('bug', 'feature', 'comment')),
  message     TEXT NOT NULL CHECK (char_length(message) <= 1000),
  page_url    TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.user_feedback ENABLE ROW LEVEL SECURITY;

-- Users can insert their own feedback, cannot read others
CREATE POLICY "users_insert_own_feedback"
  ON public.user_feedback FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Service role reads all (for Trevor/Jason to review)
CREATE POLICY "service_read_all_feedback"
  ON public.user_feedback FOR SELECT
  TO service_role USING (true);
```

SOOP: write this as `migrations/20260226_create_user_feedback.sql`. Do not execute — follow `/migration-execution-protocol`.

