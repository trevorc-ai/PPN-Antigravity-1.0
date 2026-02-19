-- ============================================================================
-- Migration: 056_fix_audit_trigger.sql
-- Purpose:   Fix broken audit chain: append_system_event() + log_audit_event()
--
-- ROOT CAUSE:
--   Two trigger functions reference public.system_events which does not exist.
--   The live audit table is public.log_system_events.
--
--   Call chain that was failing:
--     INSERT into log_clinical_records
--       → trigger: audit_log_clinical_records
--         → function: audit_row_change()
--           → function: append_system_event()   ← ROOT CAUSE (broken)
--             → INSERT into public.system_events ← DOES NOT EXIST
--
--   Secondary: log_audit_event() also referenced public.system_events.
--
-- FIX:
--   Rewrite both functions to write directly to log_system_events.
--   No mapping layer. No indirection. Clean column names.
--
-- SAFETY:
--   EXCEPTION WHEN OTHERS in both functions ensures audit failures
--   NEVER block clinical data writes.
--
-- IDEMPOTENT: Yes (CREATE OR REPLACE)
-- ADDITIVE:   Yes (function replacement only — no schema changes)
-- ============================================================================

-- ── Fix 1: append_system_event() ─────────────────────────────────────────────
-- This is the ROOT CAUSE. audit_row_change() calls this function.
-- Old signature wrote to system_events(actor_id, action_type, target_resource, event_hash)
-- New signature writes to log_system_events(actor_id, event_type, event_details, ledger_hash)
CREATE OR REPLACE FUNCTION append_system_event(
    p_action_type    TEXT,
    p_target_resource TEXT,
    p_row_data       JSONB DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO public.log_system_events (
        actor_id,
        event_type,
        event_details,
        ledger_hash,
        event_status
    )
    VALUES (
        auth.uid(),
        p_action_type,
        jsonb_build_object('target', p_target_resource, 'data', p_row_data),
        CASE WHEN p_row_data IS NULL THEN NULL ELSE md5(p_row_data::text) END,
        'captured'
    );
EXCEPTION WHEN OTHERS THEN
    -- Audit must NEVER block a clinical write.
    RAISE WARNING 'append_system_event() failed: % %', SQLERRM, SQLSTATE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ── Fix 2: log_audit_event() ─────────────────────────────────────────────────
-- Secondary broken function. Also referenced public.system_events directly.
-- Rewritten to write to log_system_events cleanly.
CREATE OR REPLACE FUNCTION log_audit_event()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.log_system_events (
        actor_id,
        event_type,
        event_details,
        event_status
    )
    VALUES (
        auth.uid(),
        TG_OP || '_' || TG_TABLE_NAME,
        jsonb_build_object(
            'table',     TG_TABLE_NAME,
            'operation', TG_OP,
            'schema',    TG_TABLE_SCHEMA
        ),
        'captured'
    );
    RETURN NEW;
EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'log_audit_event() failed: % %', SQLERRM, SQLSTATE;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ============================================================================
-- VERIFY: Run after executing the above to confirm both functions updated
-- ============================================================================
-- SELECT routine_name, routine_definition
-- FROM information_schema.routines
-- WHERE routine_schema = 'public'
--   AND routine_name IN ('append_system_event', 'log_audit_event');
-- ============================================================================
-- STEP 3: Check which tables this trigger is attached to
-- Run this to see the full blast radius of the broken trigger:
-- ============================================================================
--     event_object_table  AS table_name,
--     event_manipulation  AS fires_on,
--     action_timing       AS timing
-- FROM information_schema.triggers
-- WHERE trigger_schema = 'public'
--   AND action_statement LIKE '%log_audit_event%'
-- ORDER BY event_object_table;

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================
-- Expected result after running 056 then 055:
--   All seed inserts succeed.
--   log_system_events gains audit rows for each clinical record insert.
--   Trigger is safe to re-enable on any additional tables going forward.
-- ============================================================================
