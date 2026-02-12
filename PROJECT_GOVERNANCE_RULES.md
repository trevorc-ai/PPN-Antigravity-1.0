# 🏛️ **PPN RESEARCH PORTAL - PROJECT GOVERNANCE RULES v1.0**

**Effective Date:** 2026-02-10  
**Authority:** Project Owner + Expert Review (ChatGPT)  
**Status:** ACTIVE AND ENFORCED

---

## 📋 **TABLE OF CONTENTS**

1. [Introduction & Authority](#introduction)
2. [Core Principles](#core-principles)
3. [Database Rules](#database-rules)
4. [Frontend Development Rules](#frontend-rules)
5. [Design System Rules](#design-system-rules)
6. [Agent Collaboration Rules](#agent-collaboration-rules)
7. [Enforcement & Violations](#enforcement)
8. [Quick Reference](#quick-reference)

---

## 1️⃣ **INTRODUCTION & AUTHORITY** {#introduction}

### **Purpose**
This document establishes non-negotiable governance rules for the PPN Research Portal project. These rules ensure:
- **Privacy & Security:** No PHI/PII collection, strict RLS enforcement
- **Quality & Consistency:** Standardized code, design, and processes
- **Collaboration:** Clear roles and handoff protocols
- **Compliance:** HIPAA-aligned practices, accessibility standards

### **Authority**
- **Source:** Project owner requirements + ChatGPT expert review
- **Scope:** All code, database, design, and deployment changes
- **Enforcement:** Mandatory for all agents (INVESTIGATOR, DESIGNER, BUILDER, Antigravity)

### **Violations**
Violations of CRITICAL rules require immediate work stoppage and user notification.

---

## 2️⃣ **CORE PRINCIPLES** {#core-principles}

### **Privacy First**
- No PHI, no PII, no direct identifiers
- All patient linking via cryptographic hash only
- No free-text clinical narratives

### **Additive-Only Changes**
- Add tables, columns, features
- Never drop, rename, or destructively modify
- Migrations are version history

### **Controlled Data Only**
- Every answer is a foreign key, numeric, or boolean
- No free-text answer fields
- Reference tables for all enumerations

### **Accessibility Always**
- Minimum 10px font size (user is colorblind)
- Color + icon/text (never color alone)
- Semantic HTML, ARIA labels, keyboard navigation

### **Security by Default**
- RLS on all patient-level tables
- Site isolation via `user_sites`
- Small-cell suppression (N ≥ 10) for benchmarks

---

## 3️⃣ **DATABASE RULES** {#database-rules}

**Full Documentation:** `DATABASE_GOVERNANCE_RULES.md`  
**Verification Queries:** `migrations/VERIFICATION_QUERIES.sql`  
**Quick Reference:** `DATABASE_GOVERNANCE_QUICKREF.md`

### **Summary of Critical Rules:**

1. ✅ **Public schema only** - No touching `auth`, `storage`, etc.
2. ✅ **Additive-only** - No drops, no renames, no type changes
3. ✅ **No PHI** - No direct identifiers, no free-text narratives
4. ✅ **No free-text answers** - Only FKs, numerics, booleans
5. ✅ **RLS mandatory** - Every patient table must have RLS
6. ✅ **Small-cell suppression** - N ≥ 10 for all benchmarks
7. ✅ **Migrations only** - No Table Editor changes
8. ✅ **Verification required** - Run queries after every change

**See full database governance document for complete rules and workflow.**

---

## 4️⃣ **FRONTEND DEVELOPMENT RULES** {#frontend-rules}

**Full Documentation:** `FRONTEND_RULES.md`

### **A. Component Development**

#### **TypeScript Requirements**
- ✅ Use TypeScript for all components
- ✅ Props must have explicit types
- ✅ Use interfaces for complex types
- ❌ No `any` types without justification comment
- ❌ No class components (use functional + hooks)

**Example:**
```typescript
// ✅ GOOD
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({ label, onClick, variant = 'primary' }) => {
  // ...
};

// ❌ BAD
export const Button = (props: any) => {
  // ...
};
```

#### **Component Structure**
- ✅ One component per file
- ✅ Co-locate types with component
- ✅ Use named exports (not default)
- ✅ Props destructuring in function signature

---

### **B. State Management**

#### **Global State**
- ✅ Use React Context for auth, user, theme
- ✅ Context providers in `App.tsx`
- ❌ No Redux or external state libraries

#### **Local State**
- ✅ Use `useState` for component-specific data
- ✅ Use `useEffect` for side effects
- ✅ Custom hooks for reusable logic

#### **Server State**
- ✅ Supabase queries via hooks only
- ✅ Handle loading states
- ✅ Handle error states
- ✅ Use constants for demo/hardcoded data

**Example:**
```typescript
// ✅ GOOD
const [data, setData] = useState<Substance[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  const fetchData = async () => {
    try {
      const { data, error } = await supabase.from('ref_substances').select('*');
      if (error) throw error;
      setData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, []);
```

---

### **C. Styling**

#### **Tailwind CSS**
- ✅ Use Tailwind utility classes
- ✅ Follow design system tokens
- ✅ Use responsive modifiers (`sm:`, `md:`, `lg:`)
- ❌ No inline styles
- ❌ No custom CSS files (except `index.css`)

#### **Font Size (CRITICAL)**
- ✅ Minimum font size: 10px (`text-[10px]`)
- ❌ **FORBIDDEN:** `text-[9px]` or smaller
- **Why:** User is colorblind and needs larger text

#### **Class Organization**
```typescript
// ✅ GOOD - Logical grouping
className="flex items-center gap-4 px-6 py-3 bg-primary hover:bg-blue-600 text-white rounded-xl transition-all"

// ❌ BAD - Random order
className="text-white px-6 rounded-xl bg-primary gap-4 flex py-3 items-center hover:bg-blue-600 transition-all"
```

---

### **D. Data Fetching**

#### **Supabase Client**
- ✅ Use `supabaseClient.ts` singleton
- ✅ Handle auth context
- ✅ Use RLS-protected queries
- ❌ No direct API calls

#### **Error Handling**
- ✅ Try/catch for all async operations
- ✅ Display user-friendly error messages
- ✅ Log errors for debugging (dev only)
- ❌ No silent failures

---

### **E. Accessibility (CRITICAL)**

#### **Semantic HTML**
- ✅ Use `<button>` for clickable actions
- ✅ Use `<a>` for navigation
- ✅ Use `<header>`, `<main>`, `<section>`, `<footer>`
- ❌ No `<div>` with `onClick` (use `<button>`)

#### **ARIA Labels**
- ✅ Add `aria-label` to icon-only buttons
- ✅ Use `aria-describedby` for tooltips
- ✅ Use `role` attributes where needed

#### **Keyboard Navigation**
- ✅ All interactive elements must be keyboard accessible
- ✅ Visible focus states
- ✅ Tab order must be logical

#### **Color Accessibility (CRITICAL)**
- ✅ **ALWAYS** pair color with icon or text
- ❌ **NEVER** use color alone to convey meaning
- **Why:** User is colorblind (Deuteranopia/Protanopia)

**Example:**
```typescript
// ✅ GOOD - Color + Icon + Text
<div className="flex items-center gap-2">
  <AlertTriangle className="text-amber-500" />
  <span className="text-amber-500 font-bold">Warning</span>
</div>

// ❌ BAD - Color only
<div className="text-red-500">Error</div>
```

---

### **F. User Feedback**

#### **Toast Notifications (Future)**
- ✅ Use Toast system for success/error messages
- ❌ **FORBIDDEN:** `alert()` calls
- ❌ **FORBIDDEN:** `confirm()` calls

**Current State:** `alert()` still exists in 11 locations (see `_agent_status.md`)  
**Action Required:** Replace with Toast component

---

## 5️⃣ **DESIGN SYSTEM RULES** {#design-system-rules}

**Full Documentation:** `DESIGN_SYSTEM_RULES.md`

### **A. Color Palette**

#### **Primary Colors**
- **Primary:** `bg-primary` (Indigo/Blue) - Main actions
- **Success:** `bg-emerald-500` - Positive outcomes
- **Warning:** `bg-amber-500` - Caution states
- **Error:** `bg-rose-500` - Errors, failures
- **Neutral:** `bg-slate-*` - Backgrounds, borders

#### **Usage Rules**
- ✅ Use design tokens from Tailwind config
- ✅ Pair color with icon/text (colorblind accessibility)
- ❌ No arbitrary color values (`bg-[#123456]`)
- ❌ No color-only meaning

---

### **B. Typography**

#### **Font Sizes (CRITICAL)**
- **Minimum:** 10px (`text-[10px]`)
- **Body:** 14px (`text-sm`)
- **Headings:** 24px+ (`text-2xl`, `text-3xl`, etc.)
- ❌ **FORBIDDEN:** `text-[9px]` or smaller

#### **Font Weights**
- **Regular:** 400 (`font-normal`)
- **Medium:** 500 (`font-medium`)
- **Bold:** 700 (`font-bold`)
- **Black:** 900 (`font-black`)

#### **Letter Spacing**
- ✅ Use `tracking-wider` for uppercase labels
- ✅ Use `tracking-tight` for large headings

---

### **C. Spacing**

#### **Padding/Margin**
- ✅ Use Tailwind spacing scale (4px increments)
- ✅ Consistent spacing: `p-4`, `p-6`, `p-8`
- ❌ No arbitrary values (`p-[13px]`)

#### **Gap (Flexbox/Grid)**
- ✅ Use `gap-2`, `gap-4`, `gap-6`, `gap-8`
- ✅ Consistent across similar components

---

### **D. Components**

#### **Glassmorphism Style**
- ✅ Use `backdrop-blur-sm` or `backdrop-blur-md`
- ✅ Use `bg-slate-900/50` or similar transparency
- ✅ Use `border border-slate-800`
- ✅ Use `rounded-2xl` or `rounded-3xl`

**Example:**
```typescript
className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm"
```

#### **Tooltips**
- ✅ Use `AdvancedTooltip` component (3-tier system)
- ✅ Tiers: `hint`, `guide`, `deep`
- ❌ No raw `title` attributes
- ❌ No custom tooltip implementations

#### **Buttons**
- ✅ Use consistent button patterns
- ✅ Hover states with `hover:` modifiers
- ✅ Active states with `active:scale-95`
- ✅ Transitions with `transition-all`

---

### **E. Responsive Design**

#### **Breakpoints**
- **Mobile:** Default (< 640px)
- **Tablet:** `sm:` (640px+)
- **Desktop:** `md:` (768px+), `lg:` (1024px+)
- **Wide:** `xl:` (1280px+)

#### **Mobile-First**
- ✅ Design for mobile first
- ✅ Add `sm:`, `md:`, `lg:` modifiers for larger screens
- ✅ Test at 375px, 768px, 1024px, 1920px

---

## 6️⃣ **AGENT COLLABORATION RULES** {#agent-collaboration-rules}

**Full Documentation:** `AGENT_COLLABORATION_RULES.md`

### **A. Role Definitions**

#### **INVESTIGATOR**
- **Purpose:** Find breaks, diagnose issues
- **Scope:** Read code, identify problems, report findings
- **Restrictions:** Don't fix unless explicitly instructed
- **Output:** Diagnostic reports, root cause analysis

#### **DESIGNER**
- **Purpose:** Define look, ensure UX best practices
- **Scope:** Create specs, mockups, design decisions
- **Restrictions:** **DO NOT WRITE CODE**
- **Output:** Design specs, component requirements, style guides

#### **BUILDER**
- **Purpose:** Implement features, write code
- **Scope:** Write code, create components, implement specs
- **Restrictions:** Wait for INVESTIGATOR report before complex logic
- **Output:** Working code, components, features

---

### **B. Handoff Protocol**

#### **Standard Workflow**
1. **User Request** → INVESTIGATOR analyzes
2. **INVESTIGATOR Report** → User reviews
3. **User Approval** → DESIGNER creates spec
4. **DESIGNER Spec** → User reviews
5. **User Approval** → BUILDER implements
6. **BUILDER Complete** → INVESTIGATOR verifies

#### **Emergency Workflow (Simple Changes)**
- User request → BUILDER implements directly
- **Criteria:** Simple, low-risk, well-defined
- **Examples:** Fix typo, update constant, add tooltip

---

### **C. Communication**

#### **Artifacts**
- ✅ Use `task.md` for task breakdown
- ✅ Use `implementation_plan.md` for detailed plans
- ✅ Use `walkthrough.md` for completed work
- ✅ Keep artifacts concise and scannable

#### **User Review**
- ✅ Request review via `notify_user`
- ✅ Set `BlockedOnUser: true` when waiting for approval
- ✅ Set `ShouldAutoProceed: false` for critical decisions
- ❌ Don't implement without approval on critical changes

---

### **D. Decision Authority**

#### **INVESTIGATOR Can Decide:**
- Which files to examine
- What diagnostic queries to run
- How to structure findings

#### **DESIGNER Can Decide:**
- Color choices (within design system)
- Layout approaches
- Component structure

#### **BUILDER Can Decide:**
- Implementation details (within spec)
- Variable names
- Code organization

#### **USER Must Decide:**
- Database schema changes
- Breaking changes
- New features
- Security changes
- Design system changes

---

## 7️⃣ **ENFORCEMENT & VIOLATIONS** {#enforcement}

### **Violation Levels**

#### **🔴 CRITICAL (Stop Work Immediately)**
- Database drops/renames
- PHI/PII collection
- RLS disabled
- Security bypass in production
- Font size below 10px
- Color-only meaning (accessibility)

**Action:** Stop work, report to user, await permission

---

#### **🟡 HIGH (Fix Before Merge)**
- Missing TypeScript types
- Missing error handling
- Missing loading states
- `alert()` calls
- Accessibility violations
- Missing RLS on new tables

**Action:** Fix before committing

---

#### **🟢 MEDIUM (Fix in Next Sprint)**
- Missing tests
- `console.log` statements
- Non-optimal performance
- Missing documentation
- Code duplication

**Action:** Create issue, fix when time allows

---

### **Reporting Violations**

**If I Violate a Rule:**
1. ⏸️ Stop work immediately
2. 🚨 Report violation to user
3. 📋 Document what happened
4. ⏳ Await explicit permission to proceed

**If I Discover a Violation:**
1. 📊 Document the violation
2. 🎯 Assess severity (Critical/High/Medium)
3. 💬 Report to user with recommendation
4. ⏳ Await user decision

---

## 8️⃣ **QUICK REFERENCE** {#quick-reference}

### **Database**
- ✅ Public schema only
- ✅ Additive-only changes
- ✅ No PHI, no free-text answers
- ✅ RLS mandatory
- ✅ Migrations only

### **Frontend**
- ✅ TypeScript for all components
- ✅ Tailwind CSS only
- ✅ Min font size: 10px
- ✅ Handle loading/error states
- ❌ No `alert()` calls

### **Design**
- ✅ Glassmorphism style
- ✅ Color + icon/text (never color alone)
- ✅ Use `AdvancedTooltip`
- ✅ Mobile-first responsive

### **Collaboration**
- 🔍 INVESTIGATOR: Find, don't fix
- 🎨 DESIGNER: Spec, don't code
- 🔨 BUILDER: Wait for report

---

**END OF PROJECT GOVERNANCE RULES v1.0**

**Last Updated:** 2026-02-10  
**Next Review:** 2026-03-10 (30 days)
