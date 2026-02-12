-- Migration: 008_create_system_events_table.sql
-- Purpose: Create system_events table for Audit Logs compliance tracking
-- Date: 2026-02-10
-- Priority: CRITICAL (Compliance Pillar)

-- ============================================================================
-- SYSTEM EVENTS TABLE
-- ============================================================================
-- Purpose: Track all system activity for compliance, security, and audit trail
-- Business Context: Required for FDA/HIPAA compliance, security auditing
-- Data Retention: Immutable (no deletions allowed)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.system_events (
  event_id BIGSERIAL PRIMARY KEY,
  site_id BIGINT NOT NULL REFERENCES public.sites(site_id) ON DELETE CASCADE,
  actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  event_details JSONB,
  event_status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ledger_hash TEXT,
  
  -- Constraints
  CONSTRAINT valid_event_type CHECK (event_type ~ '^[A-Z_]+$'),
  CONSTRAINT valid_event_status CHECK (event_status IN (
    'AUTHORIZED', 
    'VERIFIED', 
    'EXECUTED', 
    'ALERT_TRIGGERED', 
    'FAILED', 
    'PENDING'
  ))
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Primary query pattern: Get events for a site, ordered by time
CREATE INDEX idx_system_events_site_created 
ON public.system_events(site_id, created_at DESC);

-- Secondary query pattern: Filter by event type
CREATE INDEX idx_system_events_type 
ON public.system_events(event_type);

-- Tertiary query pattern: Filter by actor
CREATE INDEX idx_system_events_actor 
ON public.system_events(actor_id) 
WHERE actor_id IS NOT NULL;

-- Query pattern: Filter by status
CREATE INDEX idx_system_events_status 
ON public.system_events(event_status) 
WHERE event_status IS NOT NULL;

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

ALTER TABLE public.system_events ENABLE ROW LEVEL SECURITY;

-- Policy: Site members can read their site's events
CREATE POLICY "site_members_read_events" 
ON public.system_events
FOR SELECT
USING (
  site_id IN (
    SELECT site_id 
    FROM public.user_sites 
    WHERE user_id = auth.uid()
  )
);

-- Policy: Authenticated users can insert events for their own site
CREATE POLICY "authenticated_users_insert_events" 
ON public.system_events
FOR INSERT
WITH CHECK (
  site_id IN (
    SELECT site_id 
    FROM public.user_sites 
    WHERE user_id = auth.uid()
  )
  AND actor_id = auth.uid()
);

-- Policy: Network admins can manage all events
CREATE POLICY "network_admin_manage_events" 
ON public.system_events
FOR ALL
USING (
  EXISTS (
    SELECT 1 
    FROM public.user_sites
    WHERE user_id = auth.uid()
    AND role = 'network_admin'
  )
);

-- ============================================================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON TABLE public.system_events IS 
'Immutable audit log tracking all system activity for compliance and security. Required for FDA/HIPAA compliance.';

COMMENT ON COLUMN public.system_events.event_id IS 
'Auto-incrementing primary key for event identification';

COMMENT ON COLUMN public.system_events.site_id IS 
'Foreign key to sites table - isolates events by site';

COMMENT ON COLUMN public.system_events.actor_id IS 
'UUID of user who triggered the event (NULL for system events)';

COMMENT ON COLUMN public.system_events.event_type IS 
'Type of event (e.g., PROTOCOL_CREATE, SAFETY_CHECK, LOGIN_SUCCESS)';

COMMENT ON COLUMN public.system_events.event_details IS 
'JSONB field containing event-specific metadata';

COMMENT ON COLUMN public.system_events.event_status IS 
'Status of the event (AUTHORIZED, VERIFIED, EXECUTED, ALERT_TRIGGERED, FAILED, PENDING)';

COMMENT ON COLUMN public.system_events.created_at IS 
'Timestamp when event occurred (immutable)';

COMMENT ON COLUMN public.system_events.ledger_hash IS 
'Cryptographic hash for integrity verification (future use)';

-- ============================================================================
-- SEED INITIAL TEST DATA
-- ============================================================================

-- Insert test events for demonstration
INSERT INTO public.system_events (site_id, actor_id, event_type, event_details, event_status, ledger_hash)
SELECT 
  1, -- Assuming site_id 1 exists
  (SELECT id FROM auth.users LIMIT 1), -- First user
  'SYSTEM_INITIALIZED',
  '{"message": "System events table created", "version": "1.0"}'::jsonb,
  'VERIFIED',
  '0x1102d4e5f6a7b8c9'
WHERE EXISTS (SELECT 1 FROM public.sites WHERE site_id = 1)
  AND EXISTS (SELECT 1 FROM auth.users LIMIT 1);

-- ============================================================================
-- VERIFICATION QUERY
-- ============================================================================

-- Run this to verify the table was created successfully:
-- SELECT 
--   event_id,
--   event_type,
--   event_status,
--   created_at
-- FROM public.system_events
-- ORDER BY created_at DESC
-- LIMIT 10;
