-- ============================================================================
-- Migration 081: Seed Live Session Event Type Codes into ref_flow_event_types
-- WO-584: Live Session Timeline — Notes Not Persisting, No Color-Coding
-- ============================================================================
-- Purpose:  The live session chip event codes (patient_observation, music_change,
--           clinical_decision, general_note, etc.) are absent from ref_flow_event_types.
--           getEventTypeIdByCode() returns null for all of them, causing ALL
--           chip events and free-text notes to silently fail DB insert.
--           This migration seeds the missing codes idempotently.
--
-- Safe to run: YES — uses ON CONFLICT (event_type_code) DO NOTHING
-- Additive only: YES — no existing rows are modified
-- Stage order:  NULL for all new rows (not part of the care funnel chart)
-- ============================================================================

INSERT INTO public.ref_flow_event_types
    (event_type_code, event_type_label, event_category, stage_order, is_active, description)
VALUES
    -- Dosing events
    ('dose_admin',          'Dose Administered',          'session', NULL, true,
     'Initial substance dose administered to patient during session'),
    ('additional_dose',     'Additional Dose',            'session', NULL, true,
     'Supplemental or booster dose administered during an active session'),
    -- Vitals
    ('vital_check',         'Vital Signs Recorded',       'session', NULL, true,
     'Practitioner recorded one or more vital sign readings'),
    -- Chip quick-log events (the ones that were silently failing)
    ('patient_observation', 'Patient Spoke',              'session', NULL, true,
     'Patient verbally communicated or expressed something notable (P.Spoke chip)'),
    ('music_change',        'Music Changed',              'session', NULL, true,
     'Playlist or music environment was changed during the session (Music chip)'),
    ('clinical_decision',   'Clinical Decision Made',     'session', NULL, true,
     'Practitioner made and documented a clinical decision (Decision chip)'),
    -- Free-text note
    ('general_note',        'General Note',               'session', NULL, true,
     'Free-text practitioner note not mapped to a specific event type'),
    -- Safety / adverse event
    ('safety_event',        'Safety / Adverse Event',     'session', NULL, true,
     'An adverse or safety event was logged during the session'),
    -- Touch consent
    ('touch_consent',       'Touch Consent',              'session', NULL, true,
     'Physical touch consent was checked or re-confirmed with patient'),
    -- Session update (used by Session Update button)
    ('session_update',      'Session Update',             'session', NULL, true,
     'General progress update recorded by the practitioner mid-session')
ON CONFLICT (event_type_code) DO NOTHING;

-- Verify: after seeding, these codes must all be present and active
DO $$
DECLARE
    missing_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO missing_count
    FROM (
        VALUES
            ('dose_admin'), ('additional_dose'), ('vital_check'),
            ('patient_observation'), ('music_change'), ('clinical_decision'),
            ('general_note'), ('safety_event'), ('touch_consent'), ('session_update')
    ) AS required(code)
    WHERE NOT EXISTS (
        SELECT 1 FROM public.ref_flow_event_types
        WHERE event_type_code = required.code AND is_active = true
    );

    IF missing_count > 0 THEN
        RAISE EXCEPTION '❌ Migration 081 failed: % required event type codes are still missing.', missing_count;
    ELSE
        RAISE NOTICE '✅ Migration 081 complete. All 10 session event type codes confirmed present and active.';
    END IF;
END $$;
