---
id: WO-085
status: 00_INBOX
priority: P2 (High)
category: Content Audit & Correction
owner: PENDING
failure_count: 0
created_at: 2026-02-17T16:14:40-08:00
created_by: CUE
---

# Site Name Correction: Remove "Research" from "PPN Research Portal"

## USER REQUEST (Verbatim)
> please create a ticket to have INSPECTOR audit the entire site to make sure that nothing says "PPN research portal" ... the site name is "PPN Portal" so have all instances of "research "deleted.

## REQUIREMENTS

### Objective
Audit the entire codebase and remove all instances where the site is referred to as "PPN Research Portal". The correct site name is **"PPN Portal"** (without "research").

### Scope
1. **Frontend Code Audit:**
   - All React components (`.tsx`, `.jsx` files)
   - All page titles and meta tags
   - Navigation menus and headers
   - Footer content
   - Error pages (404, 500, etc.)
   - Loading states and placeholders

2. **Documentation Audit:**
   - README files
   - User-facing help content
   - Tooltips and form labels
   - Onboarding/guided tour content

3. **Configuration Files:**
   - `package.json` (project name/description)
   - HTML meta tags in `index.html`
   - Any SEO-related files

4. **Database Content:**
   - Check if any seeded data contains "PPN Research Portal"
   - System messages or notifications

### Success Criteria
- ✅ Zero instances of "PPN Research Portal" remain in codebase
- ✅ All references updated to "PPN Portal"
- ✅ Site title, meta descriptions, and SEO tags reflect correct name
- ✅ No broken functionality after changes
- ✅ Accessibility labels remain clear and descriptive

### Out of Scope
- Changing the actual branding/logo design (visual assets)
- Renaming the project repository or deployment URLs
- Updating external documentation (unless stored in this repo)

## TECHNICAL NOTES

### Search Strategy
```bash
# Recommended grep search patterns:
grep -r "PPN Research Portal" src/
grep -r "PPN Research" src/
grep -ri "research portal" src/
```

### Common Locations to Check
- `src/components/TopHeader.tsx` - Site header/logo area
- `src/pages/Landing.tsx` - Hero section, page title
- `public/index.html` - HTML title tag
- `package.json` - Project metadata
- Any `README.md` files
- Guided tour content files

### Replacement Pattern
- **INCORRECT:** "PPN Research Portal"
- **CORRECT:** "PPN Portal"

**Note:** Be careful with context - if "research" appears separately (e.g., "conduct research on psychedelics"), that should NOT be removed. Only remove "research" when it's part of the site name.

## ACCEPTANCE CRITERIA

### INSPECTOR Checklist
- [ ] Performed site-wide search for "PPN Research Portal"
- [ ] Performed site-wide search for "PPN Research" (case-insensitive)
- [ ] Updated all instances to "PPN Portal"
- [ ] Verified browser tab title shows "PPN Portal"
- [ ] Verified meta description uses "PPN Portal"
- [ ] Verified navigation/header uses "PPN Portal"
- [ ] Verified footer uses "PPN Portal"
- [ ] Verified no broken links or functionality
- [ ] Tested on at least 2 pages to confirm changes

## PRIORITY JUSTIFICATION

**P2 (High)** - This is a branding consistency issue that affects user perception and SEO. While not critical to functionality, it should be corrected promptly to maintain professional appearance.

## ESTIMATED EFFORT
- **Search & Audit:** 15 minutes
- **Corrections:** 15-30 minutes
- **Testing:** 10 minutes
- **Total:** ~1 hour

---

**CUE HANDOFF:** This ticket is ready for LEAD to route to INSPECTOR for immediate execution.
