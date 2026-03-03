-- Check for duplicate field names across tables
-- This finds fields that appear in multiple tables (potential redundancy)

SELECT 
    column_name,
    COUNT(DISTINCT table_name) as table_count,
    STRING_AGG(table_name, ', ' ORDER BY table_name) as tables_with_this_field
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name NOT LIKE '%_old'
AND table_name NOT LIKE '%_backup'
GROUP BY column_name
HAVING COUNT(DISTINCT table_name) > 1
ORDER BY table_count DESC, column_name;
