-- =============================================================
-- WO-519: Add last_name to log_waitlist
-- Date: 2026-03-03
-- Author: BUILDER (WO-519)
-- Safe: additive only, nullable column, no data loss
-- Run via /migration-execution-protocol BEFORE deploying Waitlist form changes
-- =============================================================

ALTER TABLE public.log_waitlist
  ADD COLUMN IF NOT EXISTS last_name TEXT;
