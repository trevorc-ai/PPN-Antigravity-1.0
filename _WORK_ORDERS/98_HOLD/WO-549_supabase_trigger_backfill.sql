-- ================================================================
-- WO-549: handle_new_user trigger + backfill
-- Run in Supabase SQL Editor on STAGING first, then PRODUCTION.
--
-- What this does:
--   1. Creates a function that fires on every new auth.users INSERT
--   2. Inserts a log_user_profiles row (identity record, role=clinician)
--   3. Inserts a log_user_sites row (access control, required for site_id)
--   4. Backfills all EXISTING users who are missing a log_user_sites row
--      (this unblocks YOU, Jason, and any other current users)
-- ================================================================

-- Step 1: Create/replace the provisioning function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_site_id UUID;
BEGIN
    -- Get the first active site.
    -- During pilot, all users share the single active site.
    SELECT site_id INTO v_site_id
    FROM public.log_sites
    WHERE is_active = true
    LIMIT 1;

    -- Insert identity record (idempotent)
    INSERT INTO public.log_user_profiles (user_id, role_id, created_at)
    VALUES (NEW.id, 3, NOW())  -- role_id 3 = clinician (default)
    ON CONFLICT DO NOTHING;

    -- Insert access control record (only if an active site exists)
    IF v_site_id IS NOT NULL THEN
        INSERT INTO public.log_user_sites (user_id, site_id, role, is_active, created_at)
        VALUES (NEW.id, v_site_id, 'clinician', true, NOW())
        ON CONFLICT DO NOTHING;
    END IF;

    RETURN NEW;
END;
$$;

-- Step 2: Install the trigger on auth.users (idempotent)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Step 3: Backfill existing users with no log_user_sites row
-- This is the most important step for the immediate P0 unblock.
-- Every user in auth.users who has NO row in log_user_sites gets one now.
DO $$
DECLARE
    v_site_id UUID;
    v_user RECORD;
    v_count INTEGER := 0;
BEGIN
    SELECT site_id INTO v_site_id
    FROM public.log_sites
    WHERE is_active = true
    LIMIT 1;

    IF v_site_id IS NULL THEN
        RAISE NOTICE 'WARNING: No active site found in log_sites. Backfill skipped.';
        RAISE NOTICE 'You must have at least one row in log_sites with is_active=true.';
        RETURN;
    END IF;

    RAISE NOTICE 'Active site_id: %', v_site_id;

    FOR v_user IN
        SELECT id FROM auth.users u
        WHERE NOT EXISTS (
            SELECT 1 FROM public.log_user_sites lus WHERE lus.user_id = u.id
        )
    LOOP
        -- Provision profile row (idempotent)
        INSERT INTO public.log_user_profiles (user_id, role_id, created_at)
        VALUES (v_user.id, 3, NOW())
        ON CONFLICT DO NOTHING;

        -- Provision site access row (idempotent)
        INSERT INTO public.log_user_sites (user_id, site_id, role, is_active, created_at)
        VALUES (v_user.id, v_site_id, 'clinician', true, NOW())
        ON CONFLICT DO NOTHING;

        v_count := v_count + 1;
        RAISE NOTICE 'Provisioned user: %', v_user.id;
    END LOOP;

    RAISE NOTICE 'Backfill complete. % user(s) provisioned.', v_count;
END;
$$;

-- Confirm results
SELECT
    u.email,
    lus.user_id,
    lus.site_id,
    lus.role,
    lus.is_active
FROM auth.users u
LEFT JOIN public.log_user_sites lus ON lus.user_id = u.id
ORDER BY u.email;
