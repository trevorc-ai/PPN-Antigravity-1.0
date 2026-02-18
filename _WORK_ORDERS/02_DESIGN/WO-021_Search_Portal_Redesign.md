---
work_order_id: WO-021
title: Search Portal Page Redesign
type: DESIGN
category: Design / UX Strategy
priority: P2 (High)
status: 02_DESIGN
created: 2026-02-17T17:58:00-08:00
requested_by: USER
assigned_to: DESIGNER
owner: DESIGNER
estimated_complexity: 6/10
failure_count: 0
---

# Work Order: Search Portal Page Redesign

## 🎯 THE GOAL

Redesign the Search Portal page (`/search`) to be **simpler, cleaner, and less redundant** with the Dashboard. The current page is overly complex and duplicates functionality already available elsewhere.

### User's Direction

**"Designer should propose a new version of that page. Something not so complicated to factor. This page is somewhat redundant to the dashboard anyway."**

### Key Requirement

**The only element that MUST be preserved:** The **hero search bar** (the main search input at the top of the page)

Everything else is up for redesign/removal/simplification.

---

## 🎯 THE BLAST RADIUS (Authorized Target Area)

**DESIGNER Deliverables:**
- Layout mockup/wireframe for new Search Portal page
- Component breakdown (what stays, what goes, what's new)
- User flow diagram (how search works in new design)
- Recommendations for reducing redundancy with Dashboard

**Files to Consider (for reference only):**
- `src/pages/SearchPortal.tsx` (current 808-line implementation)
- `src/pages/Dashboard.tsx` (to identify redundancies)

---

## 🚨 DESIGNER HARD STOP - READ FIRST

**DESIGNER PRODUCES DESIGN PROPOSALS ONLY.**

### ❌ ABSOLUTELY FORBIDDEN:
- **DO NOT write any code** (no TSX, no CSS, no JS)
- **DO NOT edit any source files** (no `src/` files)
- **DO NOT run any terminal commands**
- **DO NOT modify any existing components**
- **DO NOT touch `SearchPortal.tsx` or any other file in the codebase**
- **DO NOT install any packages**

### ✅ DESIGNER DELIVERABLES ARE:
- Written design proposals (markdown text in this ticket)
- Layout descriptions (written, not coded)
- Component recommendations (what to keep/remove/add)
- User flow descriptions
- Wireframe sketches (ASCII or written descriptions)

**When complete:** Update ticket frontmatter `status: 03_BUILD`, `owner: BUILDER` and move to `_WORK_ORDERS/03_BUILD/`. BUILDER will write all code.

---

## 📋 DESIGNER DELIVERABLES

### 1. **Current State Analysis** (30 min)

Review the existing Search Portal page and identify:
- What features overlap with Dashboard?
- What features are unique and valuable?
- What features are rarely used or unnecessary?
- What makes the page "too complicated"?

**Document findings in ticket.**

---

### 2. **Proposed Redesign** (2-3 hours)

Create a **simplified layout proposal** that includes:

#### **Required Element:**
- ✅ **Hero Search Bar** (preserved from current design)
  - Prominent placement at top of page
  - Same functionality as current (search substances, patients, etc.)
  - Clean, minimal styling

#### **Optional Elements (Your Choice):**
- Recent searches (if valuable)
- Quick filters (if valuable)
- Search suggestions (if valuable)
- AI-powered insights (if valuable)
- Anything else that enhances search UX without complexity

#### **Elements to Consider Removing:**
- Bento Grid layout (too complex)
- Federated search results (redundant with Dashboard?)
- Vertical stacking animations (unnecessary complexity)
- Smart conditional filters (too complex)
- Anything else that duplicates Dashboard functionality

---

### 3. **Layout Options** (Provide 2-3 alternatives)

**Option A:** Minimal Search Page
- Hero search bar
- Recent searches
- Nothing else (ultra-simple)

**Option B:** Search + Quick Actions
- Hero search bar
- Quick filters (substance type, phase, etc.)
- Recent searches
- Search suggestions

**Option C:** Search Hub
- Hero search bar
- Categorized search (Substances, Patients, Trials)
- Quick stats (total substances, active trials, etc.)
- Recent activity feed

**Or propose your own options!**

---

### 4. **Component Breakdown**

For your recommended layout, specify:
- **Components to keep** (from current SearchPortal.tsx)
- **Components to remove** (redundant or too complex)
- **New components to create** (if any)
- **Estimated implementation complexity** (1-10 scale)

---

### 5. **User Flow Diagram**

Show how users will:
1. Land on Search Portal page
2. Enter search query
3. View results
4. Navigate to details

**Key question:** Where do search results display?
- On the same page?
- Navigate to Dashboard with filter applied?
- Navigate to dedicated results page?
- Something else?

---

## ✅ ACCEPTANCE CRITERIA

### Analysis Complete
- [ ] Current Search Portal reviewed and analyzed
- [ ] Redundancies with Dashboard identified
- [ ] Complexity issues documented

### Design Proposals Created
- [ ] 2-3 layout options provided
- [ ] Hero search bar preserved in all options
- [ ] Each option is significantly simpler than current design
- [ ] Redundancy with Dashboard reduced/eliminated

### Documentation Complete
- [ ] Component breakdown provided
- [ ] User flow diagram created
- [ ] Implementation complexity estimated
- [ ] Recommendation made (which option to build)

### Design Quality
- [ ] Matches Clinical Sci-Fi aesthetic
- [ ] Clean, minimal, professional
- [ ] Easy to implement (not overly complex)
- [ ] Responsive design considered

---

## 📝 MANDATORY COMPLIANCE

### ACCESSIBILITY
- Minimum 12px fonts
- Hero search bar must be keyboard accessible
- Proper ARIA labels for search input
- Screen reader friendly

### UX PRINCIPLES
- **Simplicity over complexity**
- **Clarity over cleverness**
- **Functionality over decoration**
- **Easy to implement over impressive animations**

---

## 🚦 STATUS

**02_DESIGN** - Awaiting DESIGNER proposal

---

## 📋 CONTEXT & BACKGROUND

### Current Search Portal Issues

The current `SearchPortal.tsx` is **808 lines** and includes:
- Bento Grid layout
- Federated search across multiple categories
- Complex animations (staggered entry, collapse/expand)
- Smart conditional filters
- Custom skeleton loaders
- AI Insight bar
- Vertical stacking (Substance/Clinical/Network)

**User feedback:** "Too complicated to factor" and "somewhat redundant to the dashboard"

### What We're Looking For

A **simplified, clean Search Portal** that:
- Focuses on the core value: **search**
- Eliminates unnecessary complexity
- Reduces redundancy with Dashboard
- Is easy to implement and maintain
- Provides a great UX without over-engineering

---

## 🎨 DESIGN PRINCIPLES FOR THIS PROJECT

1. **Less is More** - Simplify aggressively
2. **Preserve Core Value** - Keep the hero search bar
3. **Avoid Redundancy** - Don't duplicate Dashboard features
4. **Easy to Build** - Prioritize simple implementations
5. **Clinical Sci-Fi** - Maintain brand aesthetic

---

## 📚 REFERENCE MATERIALS

**Current Search Portal:**
- File: `src/pages/SearchPortal.tsx` (808 lines)
- Route: `/search`

**Dashboard (for comparison):**
- File: `src/pages/Dashboard.tsx`
- Route: `/dashboard`

**Design System:**
- Glassmorphism cards
- Deep blue gradient backgrounds
- Primary blue accents
- Slate color palette
- 12px minimum fonts

---

## 🎯 SUCCESS METRICS

**DESIGNER Success:**
- Proposed design is **significantly simpler** than current (< 400 lines to implement)
- Redundancy with Dashboard **reduced by 50%+**
- Hero search bar **preserved and enhanced**
- User can **easily understand** the page purpose
- BUILDER can **implement in 1-2 days** (not 1 week)

---

## 💡 DESIGNER NOTES

**Key Questions to Answer:**

1. **What is the unique value of the Search Portal?**
   - If it's just search, maybe it should be ultra-minimal
   - If it's a search hub, what makes it different from Dashboard?

2. **Where should search results go?**
   - Stay on Search Portal page?
   - Redirect to Dashboard with filters applied?
   - Dedicated results page?

3. **What features are actually used?**
   - Hero search bar (definitely)
   - Filters (maybe?)
   - AI insights (maybe?)
   - Recent searches (maybe?)

4. **How can we make this page feel valuable without duplicating Dashboard?**

---

**DESIGNER:** Propose a simplified Search Portal redesign that preserves the hero search bar and eliminates unnecessary complexity. Provide 2-3 layout options with your recommendation.

**Estimated Time:** 3-4 hours (analysis + design proposals)

---

**Status:** Ready for DESIGNER to begin

---

## 🔄 WORKFLOW

1. **DESIGNER** creates design proposals (this ticket)
2. **USER** reviews and selects preferred option
3. **LEAD** architects implementation strategy
4. **BUILDER** implements chosen design
5. **INSPECTOR** reviews for quality/accessibility
6. **USER** final approval

---

**Priority:** P2 (High) - Simplifying this page will reduce maintenance burden and improve UX
