---
work_order_id: WO_043
title: Fix Text Brightness Site-Wide (Slate-200 Maximum)
type: BUILD
category: Accessibility
priority: HIGH
status: 04_QA
created: 2026-02-15T03:56:00-08:00
requested_by: Trevor Calton
assigned_to: INSPECTOR
assigned_date: 2026-02-16T00:54:00-08:00
completed_date: 2026-02-16T00:54:00-08:00
estimated_complexity: 6/10
failure_count: 0
builder_notes: "Verified complete - 0 instances of text-white found. Text hierarchy: text-slate-200 (305x headers), text-slate-300 (445x body), text-slate-400 (334x secondary)"
---

# Work Order: Fix Text Brightness Site-Wide

## 🎯 THE GOAL

Replace ALL instances of `text-white`, `text-slate-100`, and `text-slate-50` with appropriate slate colors to prevent eye strain for users with dilated pupils (psychedelic therapy practitioners).

**Critical Rule:** **NOTHING BRIGHTER THAN `slate-200` ANYWHERE IN THE APPLICATION**

---

## 📋 SCOPE

**Site-wide replacement covering ALL elements:**
- Headers (H1, H2, H3, H4, H5, H6)
- Body text
- Button labels
- Form inputs
- Table content
- Navigation items
- Footer text
- Modal content
- Toast notifications
- Error messages
- Loading states
- **EVERYTHING**

---

## 🎨 REPLACEMENT STRATEGY

### Current Violations (475+ instances)

**Replace:**
1. **Headers:** `text-white` → `text-slate-200` (maximum allowed)
2. **Body Text:** `text-white` → `text-slate-300` (most comfortable)
3. **Secondary Text:** Keep `text-slate-400` (already compliant)
4. **Remove:** Any `text-slate-100` or `text-slate-50` instances

---

## 📊 TEXT COLOR HIERARCHY

### Tier 1: Headers & Critical Info (Maximum Brightness)
- **Color:** `text-slate-200` (`#e2e8f0`)
- **Contrast:** 12.63:1 (WCAG AAA)
- **Use:** H1/H2 headers, critical safety alerts, primary CTAs
- **Rule:** **ABSOLUTE MAXIMUM - NOTHING BRIGHTER**

### Tier 2: Primary Body Text (Default)
- **Color:** `text-slate-300` (`#cbd5e1`)
- **Contrast:** 8.59:1 (WCAG AAA)
- **Use:** Main content, descriptions, form labels, AI synthesis

### Tier 3: Secondary/Metadata
- **Color:** `text-slate-400` (`#94a3b8`)
- **Contrast:** 4.73:1 (WCAG AA)
- **Use:** Timestamps, helper text, secondary labels

### Tier 4: Tertiary/Subtle
- **Color:** `text-slate-500` (`#64748b`)
- **Contrast:** 2.85:1 (⚠️ Fails WCAG AA)
- **Use:** Disabled states, placeholder text ONLY

---

## 🚫 FORBIDDEN COLORS

**NEVER USE:**
- ❌ `text-white` (`#ffffff`)
- ❌ `text-slate-50` (`#f8fafc`)
- ❌ `text-slate-100` (`#f1f5f9`)

**Reason:** Causes glare and eye strain for users with dilated pupils

---

## 🔍 FILES TO MODIFY

Based on grep search, the following files have `text-white` violations:

### Pages (High Priority)
- `src/pages/AuditLogs.tsx`
- `src/pages/About.tsx`
- `src/pages/SubstanceCatalog.tsx`
- `src/pages/HelpFAQ.tsx`
- `src/pages/BillingPortal.tsx`
- `src/pages/ProtocolDetail.tsx`
- `src/pages/SearchPortal.tsx`
- `src/pages/Dashboard.tsx`
- All other pages in `src/pages/`

### Components (High Priority)
- `src/components/TopHeader.tsx`
- `src/components/Sidebar.tsx`
- `src/components/GuidedTour.tsx`
- All other components in `src/components/`

### Global Styles
- `src/index.css` (if applicable)
- `tailwind.config.js` (update theme defaults)

---

## ✅ ACCEPTANCE CRITERIA

1. **Zero instances** of `text-white` in codebase
2. **Zero instances** of `text-slate-100` or `text-slate-50`
3. **All headers** use `text-slate-200` maximum
4. **All body text** uses `text-slate-300` or darker
5. **WCAG AAA compliance** maintained (minimum 7:1 contrast)
6. **Visual regression test** passes (no broken layouts)

---

## 🧪 TESTING CHECKLIST

- [ ] Search codebase for `text-white` (should return 0 results)
- [ ] Search codebase for `text-slate-100` (should return 0 results)
- [ ] Search codebase for `text-slate-50` (should return 0 results)
- [ ] Visual inspection of all pages in browser
- [ ] Contrast checker on headers (should be 12.63:1)
- [ ] Contrast checker on body text (should be 8.59:1)
- [ ] User testing with dilated pupils (if possible)

---

## 📝 IMPLEMENTATION NOTES

### Recommended Approach

1. **Global Find & Replace (Careful):**
   ```bash
   # Headers (H1-H6, critical alerts)
   text-white → text-slate-200
   
   # Body text (paragraphs, labels)
   text-white → text-slate-300
   ```

2. **Manual Review:**
   - Check each replacement for context
   - Ensure proper hierarchy (headers vs body)
   - Verify no layout breaks

3. **Tailwind Config (Optional):**
   ```js
   // tailwind.config.js
   theme: {
     extend: {
       colors: {
         'text-primary': '#e2e8f0',   // slate-200 (max)
         'text-body': '#cbd5e1',       // slate-300 (default)
         'text-secondary': '#94a3b8',  // slate-400
       }
     }
   }
   ```

---

## 🎯 PRIORITY

**HIGH** - This directly impacts user comfort and accessibility for the target audience (practitioners with dilated pupils).

---

## 📚 REFERENCE

See: `/brain/text_brightness_spec.md` for full specification
