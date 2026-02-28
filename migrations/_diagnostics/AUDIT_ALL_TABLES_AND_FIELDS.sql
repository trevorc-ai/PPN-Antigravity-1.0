-- =====================================================
-- COMPREHENSIVE DATABASE AUDIT
-- Shows all tables and their columns in public schema
-- =====================================================

-- PART 1: List all tables with row counts
SELECT 
    schemaname,
    tablename,
    CASE 
        WHEN tablename LIKE 'log_%' THEN 'DATA TABLE'
        WHEN tablename LIKE 'ref_%' THEN 'REFERENCE TABLE'
        ELSE 'OTHER'
    END as table_type
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY table_type, tablename;

-- PART 2: Detailed column information for all tables
SELECT 
    t.table_name,
    c.column_name,
    c.data_type,
    c.character_maximum_length,
    c.is_nullable,
    c.column_default,
    CASE 
        WHEN pk.column_name IS NOT NULL THEN 'PRIMARY KEY'
        WHEN fk.column_name IS NOT NULL THEN 'FOREIGN KEY → ' || fk.foreign_table_name || '(' || fk.foreign_column_name || ')'
        ELSE ''
    END as key_info
FROM information_schema.tables t
JOIN information_schema.columns c 
    ON t.table_name = c.table_name 
    AND t.table_schema = c.table_schema
LEFT JOIN (
    SELECT 
        kcu.table_name,
        kcu.column_name
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu 
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
    WHERE tc.constraint_type = 'PRIMARY KEY'
    AND tc.table_schema = 'public'
) pk ON c.table_name = pk.table_name AND c.column_name = pk.column_name
LEFT JOIN (
    SELECT 
        kcu.table_name,
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu 
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage ccu
        ON ccu.constraint_name = tc.constraint_name
        AND ccu.table_schema = tc.table_schema
    WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_schema = 'public'
) fk ON c.table_name = fk.table_name AND c.column_name = fk.column_name
WHERE t.table_schema = 'public'
AND t.table_type = 'BASE TABLE'
ORDER BY t.table_name, c.ordinal_position;

-- PART 3: Count tables by prefix
SELECT 
    CASE 
        WHEN tablename LIKE 'log_%' THEN 'log_* (data tables)'
        WHEN tablename LIKE 'ref_%' THEN 'ref_* (reference tables)'
        ELSE 'other'
    END as table_category,
    COUNT(*) as table_count
FROM pg_tables 
WHERE schemaname = 'public'
GROUP BY table_category
ORDER BY table_category;

-- PART 4: Recently created tables (if created_at exists)
SELECT 
    tablename,
    CASE 
        WHEN tablename LIKE 'log_%' THEN 'DATA TABLE'
        WHEN tablename LIKE 'ref_%' THEN 'REFERENCE TABLE'
        ELSE 'OTHER'
    END as table_type
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

-- PART 5: List all functions
SELECT 
    routine_name,
    routine_type,
    data_type as return_type
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_type = 'FUNCTION'
ORDER BY routine_name;
