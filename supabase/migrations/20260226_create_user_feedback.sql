-- ============================================================
-- WO-511: user_feedback table
-- Additive only — no drops. RLS enforced.
-- Created: 2026-02-26
-- ============================================================

CREATE TABLE IF NOT EXISTS public.user_feedback (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type        TEXT        NOT NULL CHECK (type IN ('bug', 'feature', 'comment')),
  message     TEXT        NOT NULL CHECK (char_length(message) <= 1000),
  page_url    TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.user_feedback ENABLE ROW LEVEL SECURITY;

-- Authenticated users can insert their own feedback only
CREATE POLICY "users_insert_own_feedback"
  ON public.user_feedback
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Service role can read all feedback (for team review)
CREATE POLICY "service_read_all_feedback"
  ON public.user_feedback
  FOR SELECT
  TO service_role
  USING (true);
