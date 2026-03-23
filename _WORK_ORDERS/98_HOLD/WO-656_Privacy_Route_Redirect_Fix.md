---
id: WO-656
title: "Fix Privacy Policy Route — Public Access Redirect Bug"
owner: BUILDER
authored_by: INSPECTOR
routed_by: LEAD
status: 00_INBOX
priority: P1
created: 2026-03-22
depends_on: none
database_changes: no
admin_visibility: no
parked_context: "Flagged during GO-651 HIPAA legal packet review. A publicly accessible privacy policy is a legal requirement."
target_ship: "2026-03-29"
skills:
  - ".agent/skills/frontend-best-practices/SKILL.md"
failure_count: 0
builder_notes: ""
---

# WO-656 — Fix Privacy Policy Public Route Redirect

## Background

During the GO-651 HIPAA legal packet review (2026-03-22), it was discovered that
`ppnportal.net/#/privacy` redirects to the Dashboard when accessed without authentication.
A publicly accessible privacy policy is a legal requirement independent of HIPAA.

## INSPECTOR Code Audit Findings

The router configuration in `App.tsx` is **already correct**:

```tsx
// App.tsx L403 — correctly registered as a PUBLIC route (outside RequireAuth)
<Route path="/privacy" element={<PrivacyPolicy />} />

// App.tsx L405 — also correctly public
<Route path="/data-policy" element={<DataPolicy />} />  {/* WO-531 */}
```

- `PrivacyPolicy.tsx` contains **no redirect logic** (no `navigate`, `useAuth`, or Dashboard reference)
- `/data-policy` works correctly as a public route — confirmed at `ppnportal.net/#/data-policy`
- The root `/*` catch-all inside the `RequireAuth` block (L539) redirects unauthenticated users
  to `/dashboard` for ALL unmatched paths — but `/privacy` should be matched before it reaches that

**Working hypothesis:** The redirect is caused by either:
1. A **Vercel redirect rule** in `vercel.json` that intercepts `/privacy` before React Router handles it
2. A **browser cache or service worker** serving a stale redirect
3. An incorrect link in a nav or footer component constructing the URL without the `#` prefix
   (e.g., `/privacy` instead of `/#/privacy` causes a server-side redirect on Vercel)

## Acceptance Criteria

- [ ] `ppnportal.net/#/privacy` renders the full PrivacyPolicy page without authentication
- [ ] `ppnportal.net/#/data-policy` continues to work (regression check — it already works)
- [ ] No new auth requirement added to either route
- [ ] BUILDER documents root cause in builder_notes

## Files to Investigate (in priority order)

| File | Check |
|---|---|
| `vercel.json` | Does a redirect rule exist for `/privacy`? If yes, remove it. |
| `public/_redirects` | Any redirect rule for `/privacy`? |
| Footer / Privacy link components | Are links constructed as `/privacy` (wrong — server-side) or `/#/privacy` (correct — hash router)? |
| `src/pages/PrivacyPolicy.tsx` | Confirm no redirect (already checked — none found) |
| Browser DevTools → Network tab | On `ppnportal.net/privacy`, does the server return a 301/302 to `/dashboard`? |

## Quick Diagnostic

```bash
# Check vercel.json for redirect rules
cat vercel.json | grep -i privacy
```

```bash
# Check for hardcoded /privacy links in any component
grep -rn '"/privacy"' src/ | grep -v "/data-policy"
```

## Root Cause Fix (once identified)

**If Vercel redirect:** Remove the conflicting redirect rule from `vercel.json`.

**If incorrect link (missing `#`):** Update the link to `/#/privacy` or use React Router's `<Link to="/privacy">` which respects HashRouter automatically.

**If service worker cache:** Add cache-busting header for the `/privacy` route.

---

## INSPECTOR QA Checklist

- [ ] `ppnportal.net/#/privacy` opens PrivacyPolicy page when logged out (incognito window)
- [ ] `ppnportal.net/#/data-policy` still works (no regression)
- [ ] Root cause documented in builder_notes
- [ ] No TypeScript errors introduced
