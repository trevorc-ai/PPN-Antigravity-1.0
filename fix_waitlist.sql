-- Naming Correction: sys_waitlist -> log_waitlist

CREATE TABLE IF NOT EXISTS log_waitlist (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at timestamp with time zone DEFAULT now(),
    first_name text NOT NULL,
    email text UNIQUE NOT NULL,
    practitioner_type text NOT NULL,
    source text DEFAULT 'landing_page'::text
);
ALTER TABLE log_waitlist ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON log_waitlist;
CREATE POLICY "Enable insert for authenticated users only" ON log_waitlist FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Enable read access for all users" ON log_waitlist;
CREATE POLICY "Enable read access for all users" ON log_waitlist FOR SELECT USING (true);

-- Migrate existing data
INSERT INTO log_waitlist (id, created_at, first_name, email, practitioner_type, source)
SELECT id, created_at, first_name, email, practitioner_type, source
FROM academy_waitlist
ON CONFLICT (email) DO NOTHING;

-- Since sys_waitlist was just created and the frontend isn't using it yet, it is safe to drop.
DROP TABLE IF EXISTS sys_waitlist;
