==== INSPECTOR ====
---
owner: LEAD
status: 00_INBOX
authored_by: INSPECTOR
---

## WORK ORDER: WO-541

> **Work Order:** WO-541 — Implement `log_sites` and `log_user_sites` Registration on Authentication Form
> **Authored by:** INSPECTOR  
> **Date:** 2026-03-04  
> **Status:** Pending LEAD review  
> **Priority:** P0

### Objective
Update the authentication and registration flow to naturally capture and establish correct relationships between practitioners and their clinical sites (`log_sites` and `log_user_sites`). 

### Context & Requirements
- Driven by the requirement from Dr. Jason Allen to accommodate multiple practitioners working with the same patient during a treatment session.
- First name and last name have successfully been added to the Database.
- We need the registration form to now connect the newly created user to their designated site or allow them to create a new site.

### Tasks
- [ ] Update the authentication/registration form UI to incorporate Site selection or creation.
- [ ] Add Supabase integration logic to insert records into `log_sites` and `log_user_sites` upon new account creation.
- [ ] Ensure that practitioners correctly inherit their `site_id` so that Row Level Security (RLS) is maintained for all patient and session data.
- [ ] Validate that the implementation adheres to the Zero-PHI policy (no free-text patient inputs, site names must not contain PHI).

### Sign-Off Checklist
- [x] Clear Objective defined
- [x] Context & Requirements provided
- [x] Actionable tasks identified
- [x] Priority tagged as P0
- [x] Routed to `00_INBOX` for LEAD triage
==== INSPECTOR ====
