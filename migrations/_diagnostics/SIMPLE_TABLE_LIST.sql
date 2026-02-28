-- Simple, fast table audit
-- Just shows table names grouped by type

-- All tables in public schema
SELECT 
    tablename,
    CASE 
        WHEN tablename LIKE 'log_%' THEN 'DATA'
        WHEN tablename LIKE 'ref_%' THEN 'REFERENCE'
        ELSE 'OTHER'
    END as type
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY type, tablename;
