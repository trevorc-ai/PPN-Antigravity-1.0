---
id: WO-414
status: 01_TRIAGE
owner: SOOP
priority: P1
failure_count: 0
created: 2026-02-24
tags: [database, schema, refactor, tech-debt]
---

## LEAD ARCHITECTURE
- **Routing:** Route to `01_TRIAGE` and assign to `SOOP`.
- **Context:** The waitlist table `academy_waitlist` was created during a rapid MVP sprint but violates our strict naming conventions and architecture constitution. It needs to be renamed to a generic, scalable name (e.g., `user_waitlist_entries` or `sys_waitlist`).
- **Required Actions (SOOP):** 
  1. Write the safe SQL migration to rename the table and any associated indexes.
  2. Audit for `source` column enum values to ensure it cleanly supports both `ppn_portal_main` and `academy_landing_page`.
- **Required Actions (BUILDER - sequential handoff):**
  1. Update `src/pages/Waitlist.tsx` and `src/pages/Academy.tsx` to insert into the new table name.
  2. Update the Edge Function `send-waitlist-welcome` if it references the table explicitly (it reads the payload, so it might be fine, but verify).
  3. Recreate the Supabase Database Webhook to trigger on the new table name.

# WO-414: Fix Sloppy Database Naming (academy_waitlist)

The CEO has explicitly flagged poor database management regarding the `academy_waitlist` table name. It is unacceptable to have core shared infrastructure bearing the name of a specific feature ("academy") when it is generic infrastructure across the site.

Clean this up.
