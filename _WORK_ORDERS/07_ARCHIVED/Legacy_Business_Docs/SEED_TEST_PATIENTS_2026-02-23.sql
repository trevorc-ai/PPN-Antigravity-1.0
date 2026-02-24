-- ============================================================
-- SEED TEST PATIENTS — WO-411 Demo Fix
-- Run this in: Supabase Dashboard → SQL Editor → New Query
--
-- site_id:         d8dfcf1a-cebb-4b9b-a305-5541b97b74d7  (from console log)
-- practitioner_id: 05d03169-b2e2-450e-94f5-be675c436a44  (from console log)
-- ============================================================

INSERT INTO log_clinical_records
    (patient_link_code, site_id, practitioner_id, session_date, session_number, session_type)
VALUES
    ('PT-DEMO000001', 'd8dfcf1a-cebb-4b9b-a305-5541b97b74d7', '05d03169-b2e2-450e-94f5-be675c436a44', CURRENT_DATE - 14, 1, 'preparation'),
    ('PT-DEMO000002', 'd8dfcf1a-cebb-4b9b-a305-5541b97b74d7', '05d03169-b2e2-450e-94f5-be675c436a44', CURRENT_DATE - 7,  1, 'treatment'),
    ('PT-DEMO000003', 'd8dfcf1a-cebb-4b9b-a305-5541b97b74d7', '05d03169-b2e2-450e-94f5-be675c436a44', CURRENT_DATE,      1, 'integration');

-- Verify:
SELECT patient_link_code, session_date, session_number
FROM log_clinical_records
WHERE site_id = 'd8dfcf1a-cebb-4b9b-a305-5541b97b74d7'
ORDER BY session_date DESC;
