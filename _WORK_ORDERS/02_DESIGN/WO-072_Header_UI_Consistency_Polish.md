---
id: WO-072
status: 02_DESIGN
priority: P2 (High)
category: Design
owner: DESIGNER
failure_count: 0
created: 2026-02-16T20:51:55-08:00
---

# User Request

The user has identified three UI consistency issues in the header area that need to be addressed:

1. **Update Breadcrumb Font for CSS Consistency**
   - Current breadcrumb styling does not match the established CSS design system
   - Should match existing navigation/UI font patterns

2. **Update User Menu Font for CSS Consistency**
   - User menu (showing "User" / "Practitioner" dropdown) needs font styling updates
   - Should align with the same CSS standards as other header elements

3. **Delete "Node_Status: Nominal" Filler Text**
   - Located directly below the user menu, horizontally aligned with the breadcrumb
   - This is placeholder/debug text that should be removed from production UI

## Visual References

User provided three screenshots showing:
- Breadcrumb navigation ("PORTAL > WELLNESS JOURNEY")
- User menu dropdown ("User / Practitioner")
- "Node_Status: Nominal" debug text in header area

## Context

- Priority is P3 (visual polish), but user notes these small issues tend to get overlooked
- User has requested similar fixes multiple times previously
- Goal is to ensure consistent typography and remove development artifacts

## Expected Outcome

- Breadcrumb and User menu fonts match the established design system (likely slate color palette: `text-slate-300` or `text-slate-400`)
- "Node_Status: Nominal" text completely removed from the UI
- Header area presents a clean, consistent visual appearance

---

## 🔧 LEAD ARCHITECTURE

### Technical Strategy:

This is a **quick-win UI polish task** - 3 simple fixes to header consistency. Estimated time: **30 minutes**.

**Files to Modify:**
1. `src/components/Header.tsx` (or `TopHeader.tsx` if that's the component name)
2. Possibly `src/components/Breadcrumb.tsx` if it's a separate component

**Specific Changes:**

#### 1. **Breadcrumb Font Update**
**Current:** Likely using default browser font or inconsistent Tailwind class  
**Target:** Match navigation font styling

**Find:** Breadcrumb component (likely in Header.tsx)  
**Update:** Apply consistent font class: `text-slate-300` or `text-slate-400`

**Example:**
```tsx
// Before
<div className="breadcrumb">PORTAL > WELLNESS JOURNEY</div>

// After
<div className="text-slate-300 font-medium">PORTAL > WELLNESS JOURNEY</div>
```

#### 2. **User Menu Font Update**
**Current:** Inconsistent font styling on "User / Practitioner" dropdown  
**Target:** Match header typography standards

**Find:** User menu component (top-right corner)  
**Update:** Apply consistent font class: `text-slate-300` or `text-slate-400`

**Example:**
```tsx
// Before
<div className="user-menu">User / Practitioner</div>

// After
<div className="text-slate-300 font-medium">User / Practitioner</div>
```

#### 3. **Remove "Node_Status: Nominal" Debug Text**
**Current:** Debug/placeholder text visible in production UI  
**Target:** Complete removal

**Find:** Search for "Node_Status" or "Nominal" in Header.tsx  
**Action:** DELETE the entire element

**Example:**
```tsx
// DELETE THIS ENTIRELY
<div className="debug-status">Node_Status: Nominal</div>
```

---

### Constraints:
- **DO NOT** change any functionality - only visual styling
- **DO NOT** modify layout or positioning - only fonts and removal
- **DO** use existing Tailwind classes (`text-slate-300`, `text-slate-400`, `font-medium`)
- **DO** verify changes in browser before submitting

---

### Success Criteria:
1. ✅ Breadcrumb uses `text-slate-300` or `text-slate-400` (matches nav)
2. ✅ User menu uses `text-slate-300` or `text-slate-400` (matches nav)
3. ✅ "Node_Status: Nominal" text completely removed
4. ✅ No layout shifts or visual regressions
5. ✅ Changes verified in browser

---

### Estimated Time: **30 minutes**

---
