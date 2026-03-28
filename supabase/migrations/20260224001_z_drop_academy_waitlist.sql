-- migration: 20260224_drop_academy_waitlist.sql

-- Drop the legacy waitlist table as it has been replaced by the compliant log_waitlist
DROP TABLE IF EXISTS academy_waitlist;
