-- WO-642: Additive columns on log_waitlist for Denver conference email capture
-- Adds first_name (text) and interest_category (constrained text) -- both nullable/optional
-- ADDITIVE ONLY: no columns dropped, no types changed, no existing rows affected

ALTER TABLE log_waitlist
  ADD COLUMN IF NOT EXISTS first_name text,
  ADD COLUMN IF NOT EXISTS interest_category text
    CHECK (interest_category IN (
      'practitioner_access',
      'research_partnership',
      'general_updates'
    ));
