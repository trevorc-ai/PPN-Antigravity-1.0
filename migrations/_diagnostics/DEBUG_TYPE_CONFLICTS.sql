-- Find ALL columns that might have type conflicts
SELECT 
    table_name,
    column_name,
    data_type,
    udt_name
FROM information_schema.columns
WHERE table_schema = 'public'
  AND (column_name LIKE '%site%' OR column_name LIKE '%user%')
  AND data_type IN ('bigint', 'uuid', 'integer')
ORDER BY column_name, data_type, table_name;
