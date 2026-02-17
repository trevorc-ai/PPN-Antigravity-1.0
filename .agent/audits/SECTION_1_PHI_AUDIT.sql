-- ============================================================================
-- SECTION 1: PHI/PII VERIFICATION AUDIT
-- ============================================================================
-- Check for PHI Column Names (CRITICAL)

SELECT 
    '❌ CRITICAL: PHI Column Detected' as status,
    table_name,
    column_name,
    data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND column_name IN (
    'patient_name', 'first_name', 'last_name', 'full_name',
    'dob', 'date_of_birth', 'birth_date',
    'ssn', 'social_security',
    'mrn', 'medical_record_number',
    'email', 'patient_email',
    'phone', 'phone_number', 'mobile',
    'address', 'street_address', 'home_address',
    'zip', 'zipcode', 'postal_code',
    'city', 'state', 'country'
  )
ORDER BY table_name, column_name;

-- Expected: ZERO rows (no PHI columns should exist)
-- If you see ANY rows, this is a CRITICAL security violation
