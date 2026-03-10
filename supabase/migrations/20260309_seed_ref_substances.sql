-- ===========================================================================
-- Migration: 20260309_seed_ref_substances.sql
-- Purpose:   Seed core psychedelic substances into ref_substances.
--            Required by DosingProtocolForm (useReferenceData hook) so the
--            Substance dropdown is populated and the form can be saved.
-- Authority: INSPECTOR-approved, user executes manually in Supabase SQL Editor.
-- Safety:    Additive only. ON CONFLICT DO NOTHING — safe to re-run.
-- ===========================================================================

INSERT INTO public.ref_substances (
    substance_name,
    substance_class,
    primary_mechanism,
    is_active,
    created_at
) VALUES
    ('Psilocybin',  'Classical Psychedelic',    '5-HT2A Agonist',                       true, now()),
    ('MDMA',        'Entactogen',               'SERT/NET/DAT Releaser',                true, now()),
    ('Ketamine',    'Dissociative',             'NMDA Receptor Antagonist',             true, now()),
    ('LSD',         'Classical Psychedelic',    '5-HT2A Agonist',                       true, now()),
    ('5-MeO-DMT',   'Classical Psychedelic',    '5-HT1A / 5-HT2A Agonist',             true, now()),
    ('Ayahuasca',   'Classical Psychedelic',    '5-HT2A Agonist + MAO-I',              true, now()),
    ('Ibogaine',    'Dissociative / Atypical',  'Multi-receptor (NMDA, kappa, SERT)',   true, now()),
    ('Mescaline',   'Classical Psychedelic',    '5-HT2A Agonist',                       true, now())
ON CONFLICT DO NOTHING;

-- ── Verification (run after execution, expected ≥ 8 rows) ───────────────────
-- SELECT substance_id, substance_name, substance_class, is_active
-- FROM public.ref_substances ORDER BY substance_name;
