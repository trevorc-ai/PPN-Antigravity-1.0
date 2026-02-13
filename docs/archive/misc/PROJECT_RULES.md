# 📋 PPN RESEARCH PORTAL - PROJECT RULES & GUIDELINES

**Version:** 2.0  
**Date:** 2026-02-10  
**Status:** ACTIVE AND ENFORCED  
**Applies To:** All agents (INVESTIGATOR, BUILDER, DESIGNER, Antigravity)

---

## 🎯 Purpose

This document consolidates all project rules, standards, and guidelines for the PPN Research Portal. It extends existing database governance rules with frontend development, testing, deployment, and workflow standards.

**Related Documents:**
- [DATABASE_GOVERNANCE_RULES.md](DATABASE_GOVERNANCE_RULES.md) - Database schema and RLS rules
- [SQL_MANDATORY_RULES.md](SQL_MANDATORY_RULES.md) - SQL best practices
- [WORKSPACE_RULES.md](WORKSPACE_RULES.md) - Workspace-specific rules

---

## 📑 Table of Contents

1. [Core Principles](#core-principles)
2. [Frontend Development Rules](#frontend-development-rules)
3. [Component Architecture](#component-architecture)
4. [Styling & Design System](#styling--design-system)
5. [Accessibility Standards](#accessibility-standards)
6. [Testing Requirements](#testing-requirements)
7. [Code Quality Standards](#code-quality-standards)
8. [Git & Version Control](#git--version-control)
9. [Deployment & Environment](#deployment--environment)
10. [Workflow & Communication](#workflow--communication)

---

## 1️⃣ Core Principles

### **1.1 Zero-Deletion Policy (CRITICAL)**

> **NEVER** delete or remove any visual elements, components, sections, containers, or functionality without **EXPLICIT, DOUBLE CONFIRMATION** from the user.

**Rules:**
- ❌ **FORBIDDEN:** Removing existing features, components, or UI elements
- ✅ **ALLOWED:** Adding new features, hiding elements with flags, deprecating with migration path
- ⚠️ **REQUIRED:** Propose removal changes BEFORE executing them

**Why:** Prevents accidental loss of functionality and maintains user trust.

---

### **1.2 Literal Instruction Interpretation**

> Follow instructions **literally**. Do not infer unstated goals.

**Rules:**
- If instruction is "Add X", simply add X. Do not modify Y.
- Maintain strict focus on requested feature
- Do not refactor, clean up, or reorganize unrelated code unless specifically asked

**Why:** Prevents scope creep and unintended changes.

---

### **1.3 Privacy-First Architecture**

> **NO PHI, NO PII, NO HIPAA-risk data collection.**

**Rules:**
- ❌ **FORBIDDEN:** Collecting names, emails, phone numbers, addresses, DOB, MRNs, exact dates tied to identity
- ❌ **FORBIDDEN:** Free-text inputs (textareas, notes fields)
- ✅ **REQUIRED:** All data capture must be structured, enumerated, stored via IDs
- ✅ **REQUIRED:** Track subjects across sessions using system-generated `Subject_ID`

**Why:** Product credibility depends on truthfully saying "We never collect PHI."

---

## 2️⃣ Frontend Development Rules

### **2.1 Technology Stack**

**Core Technologies:**
- ✅ **Framework:** React 18+ with TypeScript
- ✅ **Routing:** React Router v6
- ✅ **State Management:** React Context + Hooks (no Redux unless approved)
- ✅ **Backend:** Supabase (Auth, Database, RLS)
- ✅ **Build Tool:** Vite
- ✅ **Styling:** Tailwind CSS v3

**Required Libraries:**
- ✅ **Charts:** Recharts (for data visualization)
- ✅ **Icons:** Material Symbols (Outlined variant)
- ✅ **Animations:** Framer Motion (for complex animations)

---

### **2.2 File Organization**

```
src/
├── components/          # Reusable UI components
│   ├── layouts/        # Layout components (PageContainer, Section, etc.)
│   ├── ui/             # Base UI components (Button, Input, etc.)
│   └── [feature]/      # Feature-specific components
├── pages/              # Route-level page components
│   └── deep-dives/     # Deep dive analysis pages
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── types.ts            # TypeScript type definitions
├── constants.ts        # Application constants
├── supabaseClient.ts   # Supabase client configuration
└── App.tsx             # Root application component
```

**Rules:**
- ✅ **REQUIRED:** Place components in appropriate directories
- ✅ **REQUIRED:** One component per file (except small, tightly-coupled helpers)
- ✅ **REQUIRED:** Use PascalCase for component files (`ProtocolBuilder.tsx`)
- ✅ **REQUIRED:** Use camelCase for utility files (`timelineHelpers.ts`)

---

### **2.3 TypeScript Standards**

**Rules:**
- ✅ **REQUIRED:** All new code must be TypeScript
- ✅ **REQUIRED:** Define interfaces for all data structures in `types.ts`
- ✅ **REQUIRED:** No `any` types (use `unknown` if type is truly unknown)
- ✅ **REQUIRED:** Explicit return types for functions
- ⚠️ **AVOID:** Type assertions (`as`) unless absolutely necessary

**Example:**
```typescript
// ✅ GOOD
interface Treatment {
  id: string;
  sessionNumber: number;
  phq9Score: number;
}

function calculateDelta(prev: number, current: number): number {
  return Math.round(((prev - current) / prev) * 100);
}

// ❌ BAD
function calculateDelta(prev: any, current: any) {
  return Math.round(((prev - current) / prev) * 100);
}
```

---

### **2.4 Component Patterns**

**Functional Components Only:**
```typescript
// ✅ GOOD
export const ProtocolBuilder: React.FC = () => {
  const [protocols, setProtocols] = useState<Protocol[]>([]);
  // ...
};

// ❌ BAD (class components)
export class ProtocolBuilder extends React.Component {
  // ...
}
```

**Props Interface:**
```typescript
// ✅ REQUIRED
interface TreatmentTimelineProps {
  patientId: string;
  onFilterChange?: (filters: FilterState) => void;
}

export const TreatmentTimeline: React.FC<TreatmentTimelineProps> = ({
  patientId,
  onFilterChange
}) => {
  // ...
};
```

---

### **2.5 State Management**

**Rules:**
- ✅ **PREFERRED:** Local component state (`useState`) for component-specific data
- ✅ **PREFERRED:** Context API for shared state (auth, theme, site context)
- ⚠️ **AVOID:** Prop drilling (use Context if passing props >2 levels deep)
- ❌ **FORBIDDEN:** Global mutable state outside React

**Example:**
```typescript
// ✅ GOOD - Local state
const [isOpen, setIsOpen] = useState(false);

// ✅ GOOD - Context for shared state
const { user, site } = useAuth();

// ❌ BAD - Global mutable
window.currentUser = user; // NEVER DO THIS
```

---

## 3️⃣ Component Architecture

### **3.1 Layout Components**

**PageContainer:**
```typescript
<PageContainer width="wide" padding="default">
  {/* Page content */}
</PageContainer>
```

**Width Options:**
- `default`: 1440px max-width (standard pages)
- `wide`: 1920px max-width (data-heavy pages like ProtocolBuilder)
- `narrow`: 1024px max-width (focused content)
- `full`: No max-width (full viewport)

**Padding Options:**
- `compact`: Minimal padding (px-4 sm:px-6)
- `default`: Standard padding (px-6 sm:px-8 xl:px-10)
- `spacious`: Extra padding (px-8 sm:px-12 xl:px-16)

---

### **3.2 Reusable Components**

**Required Components:**
- ✅ `Button` - Standardized button with variants
- ✅ `Input` - Form input with validation
- ✅ `AdvancedTooltip` - Multi-tier tooltip system
- ✅ `PageContainer` - Page layout wrapper
- ✅ `Section` - Content section wrapper

**Component Requirements:**
- ✅ **REQUIRED:** Props interface with TypeScript
- ✅ **REQUIRED:** Accessibility attributes (ARIA labels, roles)
- ✅ **REQUIRED:** Keyboard navigation support
- ✅ **REQUIRED:** Responsive design (mobile-first)

---

### **3.3 Data Fetching Patterns**

**Supabase Queries:**
```typescript
// ✅ GOOD - Explicit error handling
const fetchProtocols = async (siteId: string): Promise<Protocol[]> => {
  const { data, error } = await supabase
    .from('log_clinical_records')
    .select(`
      id,
      session_number,
      substance:ref_substances(substance_id, substance_name)
    `)
    .eq('site_id', siteId)
    .order('session_date', { ascending: true });
  
  if (error) {
    console.error('Failed to fetch protocols:', error);
    throw new Error(`Protocol fetch failed: ${error.message}`);
  }
  
  return data || [];
};

// ❌ BAD - No error handling
const fetchProtocols = async (siteId: string) => {
  const { data } = await supabase
    .from('log_clinical_records')
    .select('*')
    .eq('site_id', siteId);
  
  return data;
};
```

**Loading States:**
```typescript
// ✅ REQUIRED
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  const loadData = async () => {
    try {
      setIsLoading(true);
      const data = await fetchProtocols(siteId);
      setProtocols(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };
  loadData();
}, [siteId]);

if (isLoading) return <LoadingSpinner />;
if (error) return <ErrorMessage message={error} />;
```

---

## 4️⃣ Styling & Design System

### **4.1 Color Palette (STRICT)**

**Primary Colors:**
- `#2b74f3` - Primary blue (CTAs, links, highlights)
- `#05070a` - Deep black (main background)
- `#0b0e14` - Slate black (containers)
- `#080a10` - Background dark

**Text Colors:**
- `text-white` - Primary text
- `text-slate-400` - Secondary text
- `text-slate-500` - Tertiary text
- `text-slate-600` - Disabled text

**Semantic Colors:**
- `text-clinical-green` - Success, improvement (↓ PHQ-9)
- `text-red-500` - Error, worsening (↑ PHQ-9)
- `text-amber-500` - Warning, caution
- `text-indigo-400` - Info, neutral

**Rules:**
- ✅ **REQUIRED:** Use defined palette only
- ❌ **FORBIDDEN:** Arbitrary hex colors (e.g., `#ff0000`)
- ✅ **REQUIRED:** Use Tailwind color classes

---

### **4.2 Typography**

**Font Families:**
- **Headings:** `Manrope` (font-black, uppercase, tight tracking)
- **Body:** `Inter` (font-medium)
- **Monospace:** `JetBrains Mono` (font-mono)

**Font Sizes (Minimum 11px):**
```typescript
// ✅ ALLOWED
text-[11px]  // 11px (minimum)
text-xs      // 12px
text-sm      // 14px
text-base    // 16px
text-lg      // 18px
text-xl      // 20px

// ❌ FORBIDDEN
text-[9px]   // Too small
text-[10px]  // Too small
```

**Font Weights:**
- `font-medium` (500) - Body text
- `font-bold` (700) - Emphasis
- `font-black` (900) - Headings

**Rules:**
- ✅ **REQUIRED:** Minimum 11px font size (including tooltips, chart legends)
- ✅ **REQUIRED:** Use defined font families
- ⚠️ **AVOID:** Mixing font families within same component

---

### **4.3 Spacing & Layout**

**Spacing Scale:**
```typescript
// Tailwind spacing (4px base)
p-2   // 8px
p-4   // 16px
p-6   // 24px
p-8   // 32px
p-10  // 40px
p-12  // 48px
```

**Border Radius:**
```typescript
rounded-lg      // 8px (standard)
rounded-xl      // 12px (medium)
rounded-2xl     // 16px (large)
rounded-[2.5rem] // 40px (extra large, containers)
```

**Rules:**
- ✅ **REQUIRED:** Use Tailwind spacing scale
- ✅ **REQUIRED:** Consistent border radius within component
- ⚠️ **AVOID:** Arbitrary spacing values (e.g., `p-[13px]`)

---

### **4.4 Responsive Design**

**Breakpoints:**
```typescript
sm:   // 640px
md:   // 768px
lg:   // 1024px
xl:   // 1280px
2xl:  // 1536px
```

**Mobile-First Approach:**
```typescript
// ✅ GOOD - Mobile first
<div className="text-sm sm:text-base lg:text-lg">
  {/* Starts at 14px, grows to 16px on sm, 18px on lg */}
</div>

// ❌ BAD - Desktop first
<div className="text-lg sm:text-base">
  {/* Shrinks on mobile, harder to maintain */}
</div>
```

**Rules:**
- ✅ **REQUIRED:** Mobile-first responsive design
- ✅ **REQUIRED:** Test on mobile (375px), tablet (768px), desktop (1440px)
- ✅ **REQUIRED:** Use responsive Tailwind classes

---

## 5️⃣ Accessibility Standards

### **5.1 Colorblind-Friendly Design (CRITICAL)**

> **User is colorblind. Do not introduce color-only meaning.**

**Rules:**
- ❌ **FORBIDDEN:** Color-only status indicators
- ✅ **REQUIRED:** Color + icon + text for all status
- ✅ **REQUIRED:** High contrast (WCAG AA minimum)

**Examples:**
```typescript
// ✅ GOOD - Color + icon + text
<span className="flex items-center gap-2 text-clinical-green">
  <span className="text-lg">●</span>
  <span>↓</span>
  <span>-20% Improvement</span>
</span>

// ❌ BAD - Color only
<span className="text-clinical-green">
  Improvement
</span>
```

---

### **5.2 ARIA Labels & Roles**

**Rules:**
- ✅ **REQUIRED:** `aria-label` for icon-only buttons
- ✅ **REQUIRED:** `role` for custom interactive elements
- ✅ **REQUIRED:** `aria-describedby` for form inputs with help text

**Examples:**
```typescript
// ✅ GOOD
<button aria-label="Print treatment timeline" onClick={handlePrint}>
  <span className="material-symbols-outlined">print</span>
</button>

<input
  type="text"
  aria-label="Patient ID"
  aria-describedby="patient-id-help"
/>
<span id="patient-id-help">Enter the patient's unique identifier</span>
```

---

### **5.3 Keyboard Navigation**

**Rules:**
- ✅ **REQUIRED:** All interactive elements must be keyboard accessible
- ✅ **REQUIRED:** Visible focus states
- ✅ **REQUIRED:** Logical tab order

**Examples:**
```typescript
// ✅ GOOD - Keyboard accessible
<button
  onClick={handleClick}
  onKeyDown={(e) => e.key === 'Enter' && handleClick()}
  className="focus:ring-2 focus:ring-primary focus:outline-none"
>
  Submit
</button>

// ❌ BAD - No keyboard support
<div onClick={handleClick}>
  Submit
</div>
```

---

## 6️⃣ Testing Requirements

### **6.1 Testing Philosophy**

**Current State:**
- ⚠️ **CRITICAL GAP:** No automated tests exist
- ✅ **REQUIRED:** Manual testing for all new features
- 🎯 **GOAL:** Establish testing infrastructure

**Testing Priorities:**
1. Critical user flows (authentication, protocol creation)
2. Data integrity (Supabase queries, RLS policies)
3. UI components (accessibility, responsive design)

---

### **6.2 Manual Testing Checklist**

**For Every New Feature:**
- [ ] Test on Chrome, Firefox, Safari
- [ ] Test on mobile (375px width)
- [ ] Test on tablet (768px width)
- [ ] Test on desktop (1440px width)
- [ ] Test keyboard navigation (Tab, Enter, Escape)
- [ ] Test screen reader (VoiceOver on Mac, NVDA on Windows)
- [ ] Test with colorblind simulation (Chrome DevTools)
- [ ] Test print layout (if applicable)

---

### **6.3 Browser Testing**

**Supported Browsers:**
- ✅ Chrome 100+
- ✅ Firefox 100+
- ✅ Safari 15+
- ✅ Edge 100+

**Testing Tools:**
- ✅ Chrome DevTools (Responsive mode, Lighthouse)
- ✅ Firefox DevTools (Accessibility inspector)
- ✅ Safari Web Inspector

---

## 7️⃣ Code Quality Standards

### **7.1 Code Review Checklist**

**Before Committing:**
- [ ] No `console.log()` statements (use proper logging)
- [ ] No commented-out code (delete or explain)
- [ ] No `TODO` comments without issue tracking
- [ ] No hardcoded values (use constants)
- [ ] No magic numbers (define constants)
- [ ] TypeScript errors resolved
- [ ] ESLint warnings addressed
- [ ] Formatting consistent (Prettier)

---

### **7.2 Error Handling**

**Rules:**
- ✅ **REQUIRED:** Try-catch for all async operations
- ✅ **REQUIRED:** User-friendly error messages
- ✅ **REQUIRED:** Log errors for debugging
- ❌ **FORBIDDEN:** Silent failures

**Examples:**
```typescript
// ✅ GOOD
try {
  const data = await fetchProtocols(siteId);
  setProtocols(data);
} catch (error) {
  console.error('Failed to fetch protocols:', error);
  setError('Unable to load protocols. Please try again.');
}

// ❌ BAD
try {
  const data = await fetchProtocols(siteId);
  setProtocols(data);
} catch (error) {
  // Silent failure
}
```

---

### **7.3 Performance Optimization**

**Rules:**
- ✅ **REQUIRED:** Memoize expensive calculations (`useMemo`)
- ✅ **REQUIRED:** Debounce search inputs
- ✅ **REQUIRED:** Lazy load images
- ✅ **REQUIRED:** Code splitting for large pages
- ⚠️ **AVOID:** Unnecessary re-renders

**Examples:**
```typescript
// ✅ GOOD - Memoized calculation
const summary = useMemo(() => {
  return calculateSummary(treatments);
}, [treatments]);

// ✅ GOOD - Debounced search
const debouncedSearch = useMemo(
  () => debounce((query: string) => {
    performSearch(query);
  }, 300),
  []
);
```

---

## 8️⃣ Git & Version Control

### **8.1 Commit Messages**

**Format:**
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting, no code change
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance

**Examples:**
```
feat(timeline): Add treatment history visualization

- Implemented horizontal timeline chart
- Added PHQ-9 progression tracking
- Included substance switch detection

Closes #123

---

fix(auth): Resolve login redirect loop

- Fixed infinite redirect when user already authenticated
- Added proper session check

Fixes #456
```

---

### **8.2 Branch Strategy**

**Branch Naming:**
```
<type>/<description>

Examples:
feat/treatment-timeline
fix/login-redirect
docs/api-documentation
```

**Rules:**
- ✅ **REQUIRED:** Create feature branches from `main`
- ✅ **REQUIRED:** Keep branches short-lived (<1 week)
- ✅ **REQUIRED:** Delete branches after merge

---

## 9️⃣ Deployment & Environment

### **9.1 Environment Variables**

**Required Variables:**
```bash
VITE_SUPABASE_URL=<your-supabase-url>
VITE_SUPABASE_ANON_KEY=<your-anon-key>
```

**Rules:**
- ✅ **REQUIRED:** Use `.env.local` for local development
- ❌ **FORBIDDEN:** Commit `.env` files to Git
- ✅ **REQUIRED:** Document all environment variables in README

---

### **9.2 Build & Deploy**

**Build Command:**
```bash
npm run build
```

**Deploy Command:**
```bash
npm run deploy
```

**Rules:**
- ✅ **REQUIRED:** Test build locally before deploying
- ✅ **REQUIRED:** Verify environment variables in production
- ✅ **REQUIRED:** Check console for errors after deployment

---

## 🔟 Workflow & Communication

### **10.1 Agent Roles**

**DESIGNER:**
- Creates visual mockups and specifications
- Defines UI/UX patterns
- Documents design decisions
- **Does NOT write code**

**INVESTIGATOR:**
- Reviews specifications
- Validates data availability
- Identifies technical blockers
- Approves implementation plans

**BUILDER:**
- Implements features per specifications
- Writes code following all rules
- Tests implementations
- Documents changes

**Antigravity (You):**
- Coordinates between roles
- Enforces project rules
- Reviews all changes
- Maintains documentation

---

### **10.2 Planning Mode Workflow**

**When in Planning Mode:**
1. ✅ Create `task.md` with checklist
2. ✅ Create `implementation_plan.md` with detailed spec
3. ✅ Use `notify_user` to request review
4. ✅ Wait for approval before proceeding
5. ✅ Update task status via `task_boundary`

**Rules:**
- ✅ **REQUIRED:** Create artifacts for complex tasks
- ✅ **REQUIRED:** Request user review before execution
- ✅ **REQUIRED:** Update task boundaries regularly
- ❌ **FORBIDDEN:** Proceeding without approval

---

### **10.3 Communication Standards**

**With User:**
- ✅ **REQUIRED:** Use `notify_user` when in task mode
- ✅ **REQUIRED:** Be concise and specific
- ✅ **REQUIRED:** Ask clarifying questions when ambiguous
- ⚠️ **AVOID:** Assuming user intent

**In Artifacts:**
- ✅ **REQUIRED:** Use markdown formatting
- ✅ **REQUIRED:** Include code examples
- ✅ **REQUIRED:** Link to related files
- ✅ **REQUIRED:** Use visual diagrams (ASCII art, Mermaid)

---

## ✅ Enforcement

**This document is NON-NEGOTIABLE.**

Any agent who violates these rules must:
1. Immediately stop work
2. Report violation to user
3. Await explicit permission before proceeding

**No exceptions without explicit user approval.**

---

## 📚 Additional Resources

- [DATABASE_GOVERNANCE_RULES.md](DATABASE_GOVERNANCE_RULES.md)
- [SQL_MANDATORY_RULES.md](SQL_MANDATORY_RULES.md)
- [WORKSPACE_RULES.md](WORKSPACE_RULES.md)
- [TREATMENT_TIMELINE_IMPLEMENTATION_SPEC.md](TREATMENT_TIMELINE_IMPLEMENTATION_SPEC.md)

---

**END OF PROJECT RULES v2.0**

**Signed:** Antigravity AI Agent  
**Date:** 2026-02-10  
**Status:** ACTIVE AND ENFORCED
