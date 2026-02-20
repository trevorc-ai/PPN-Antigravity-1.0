---
id: WO-120
status: 03_BUILD
owner: BUILDER
failure_count: 0
created: 2026-02-19
priority: HIGH
ticket_type: audit + fix
user_prompt_verbatim: "We need to do the crawl audit soon to test for broken links and buttons and just general cleanup."
---

## LEAD ARCHITECTURE

Pre-launch crawl audit. BUILDER uses the browser skill + grep to systematically find and fix dead routes, unwired buttons, and placeholder content before the partner demo.

---

## AUDIT CHECKLIST

### Phase 1 — Route Audit (static analysis)

Grep `src/` for all `navigate(` and `to="` calls. Cross-reference against `src/App.tsx` route definitions.

```bash
# Find all navigate() calls
grep -rn "navigate('" src/ --include="*.tsx" | grep -oP "navigate\('\K[^']+" | sort -u

# Find all Link to= paths
grep -rn "to=\"/" src/ --include="*.tsx" | grep -oP 'to="\K[^"]+' | sort -u
```

For each path found, verify it exists in App.tsx. Flag any that resolve to 404 or are missing.

**Known suspects from previous sessions:**
- `/contribution` (Pricing page CTA — likely missing)
- `/data-export` (Dashboard Quick Action — likely missing)
- `/deep-dives/risk-matrix` (Dashboard "View Detailed Analysis" button)
- `/deep-dives/molecular-pharmacology` (Safety Alert Quick Action)
- `/deep-dives/clinic-performance` (Benchmarks Quick Action)
- `/clinician/:id` (ClinicianDirectory profile link — needs dynamic route)
- `/admin/review` (new from WO-119)
- `/reset-password` (Password reset redirect)
- `/news?tab=regulatory` (WO-116 redirect)

For each missing route: either add a placeholder page (`ComingSoon.tsx`) or redirect to the closest existing page.

### Phase 2 — Button Audit (browser crawl)

Use the browser skill to visit each main page and verify every visible button fires correctly:

Pages to crawl:
1. `/` (Landing/Home)
2. `/dashboard`
3. `/analytics`
4. `/news`
5. `/pricing`
6. `/login`
7. `/wellness-journey`
8. `/practitioners`
9. `/interactions`
10. `/advanced-search`

For each page, log:
- Button label + action expected
- [STATUS: PASS] or [STATUS: FAIL]
- If fail: describe what happened (console error, 404, no-op, wrong route)

### Phase 3 — Console Error Sweep

Open browser DevTools on each page. Log any:
- Uncaught TypeScript/React errors
- Failed network requests (404, 401, 500)
- Missing environment variables
- Supabase query errors

### Phase 4 — Placeholder Content Audit

Grep for hardcoded placeholder strings:
```bash
grep -rn "Dr. Sarah Chen\|TODO\|PLACEHOLDER\|Coming Soon\|lorem ipsum\|fake\|mock data" src/ --include="*.tsx"
```

Replace or flag each instance. Hardcoded user names (like "Dr. Sarah Chen" in Analytics print header) should be replaced with `auth.user.email` or removed.

### Phase 5 — Mobile Responsive Spot-Check

Check these 3 pages at 375px width (mobile):
- Dashboard
- Wellness Journey
- Practitioner Directory

Flag any overflow, hidden content, or broken layouts.

---

## DELIVERABLE

BUILDER produces an **Audit Report** committed to `_WORK_ORDERS/04_QA/WO-120_Crawl_Audit_Report.md` with:
- Complete route audit table (route | exists? | fix applied)
- Button audit table per page (button | status | notes)
- Console error log
- Placeholder content list
- Mobile issues list

Then fixes all [STATUS: FAIL] items inline, commits, and routes to INSPECTOR.

---

## Acceptance Criteria
- [ ] All `navigate()` calls resolve to existing routes or placeholder pages
- [ ] All visible buttons fire the correct action (no no-ops on key CTAs)
- [ ] Zero console errors on Dashboard, Analytics, News pages
- [ ] "Dr. Sarah Chen" hardcoded name removed from Analytics print header
- [ ] Mobile layout functional at 375px on 3 key pages
- [ ] Audit report committed to `04_QA/`
