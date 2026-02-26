-- Migration 021: Expand ref_user_roles to 9-Tier Role System
-- Date: 2026-02-26
-- Author: INSPECTOR (authored per WO-506)
-- Approved by: USER (PRODDY tier recommendation confirmed 2026-02-26)
-- Strategy: ADDITIVE ONLY — existing rows (admin=1, partner=2, user=3) are untouched
-- Idempotency: ON CONFLICT (role_name) DO NOTHING on all inserts
-- NOTE: Live table schema is (id, role_name, created_at) — no description column in production.

INSERT INTO public.ref_user_roles (role_name) VALUES
    ('owner'),
    ('partner_free'),
    ('partner_paid'),
    ('beta_observer'),
    ('user_free'),
    ('user_pro'),
    ('user_premium'),
    ('user_enterprise')
ON CONFLICT (role_name) DO NOTHING;

-- ============================================================
-- VERIFICATION: Run after applying this migration
-- ============================================================
-- SELECT id, role_name FROM public.ref_user_roles ORDER BY id;
-- Expected: 11 rows total (3 existing + 8 new)
-- ============================================================
