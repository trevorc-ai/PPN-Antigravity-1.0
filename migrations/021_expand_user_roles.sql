-- Migration 021: Expand ref_user_roles to 9-Tier Role System
-- Date: 2026-02-26
-- Author: INSPECTOR (authored per WO-506)
-- Approved by: USER (PRODDY tier recommendation confirmed 2026-02-26)
-- Strategy: ADDITIVE ONLY — existing rows (admin=1, partner=2, user=3) are untouched
-- Idempotency: ON CONFLICT (role_name) DO NOTHING on all inserts

INSERT INTO public.ref_user_roles (role_name, description) VALUES
    ('owner',           'Business owner — full data access, no system admin controls'),
    ('partner_free',    'Free pilot partner — full Wellness Journey (TEST data only), no Analytics/Protocol Builder/Export'),
    ('partner_paid',    'Paid pilot partner — Wellness Journey + Protocol Builder + Analytics + Data Export'),
    ('beta_observer',   'Non-practitioner UI/UX tester — demo shell, read-only. Time-boxed role.'),
    ('user_free',       'Free tier — limited access, no multi-patient dashboard or analytics'),
    ('user_pro',        'Paid Tier 1 — individual practitioners and researchers'),
    ('user_premium',    'Paid Tier 2 — advanced features unlocked'),
    ('user_enterprise', 'Multi-seat — clinics and research organizations')
ON CONFLICT (role_name) DO NOTHING;

-- Update table comment to reflect expanded role set
COMMENT ON TABLE public.ref_user_roles IS
    'Reference table for user role tiers: admin, owner, partner_free, partner_paid, beta_observer, user_free, user_pro, user_premium, user_enterprise. Legacy roles (partner, user) retained for FK compatibility.';

-- ============================================================
-- VERIFICATION: Run after applying this migration
-- ============================================================
-- SELECT id, role_name, description FROM public.ref_user_roles ORDER BY id;
-- Expected: 11 rows total (3 existing + 8 new)
-- ============================================================
