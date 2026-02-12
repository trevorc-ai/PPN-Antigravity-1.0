# 📋 PROJECT RULES - QUICK REFERENCE

**Full Documentation:** [PROJECT_RULES.md](PROJECT_RULES.md)

---

## 🚨 CRITICAL RULES (NEVER VIOLATE)

### **Zero-Deletion Policy**
❌ **NEVER** delete features, components, or UI elements without **EXPLICIT, DOUBLE CONFIRMATION**

### **Privacy-First**
❌ **NO PHI, NO PII** - No names, emails, phone numbers, addresses, DOB, MRNs, free-text inputs

### **Colorblind-Friendly Design**
✅ **REQUIRED:** Color + icon + text for all status indicators (user is colorblind)

### **Minimum Font Size**
✅ **REQUIRED:** 11px minimum (including tooltips, chart legends)

---

## 📐 Design System

### **Colors**
- Primary: `#2b74f3` (blue)
- Background: `#05070a`, `#0b0e14`, `#080a10`
- Success: `text-clinical-green`
- Error: `text-red-500`
- Warning: `text-amber-500`

### **Typography**
- Headings: `Manrope` (font-black, uppercase)
- Body: `Inter` (font-medium)
- Mono: `JetBrains Mono`

### **Spacing**
- Use Tailwind scale: `p-2` (8px), `p-4` (16px), `p-6` (24px), `p-8` (32px)

---

## 💻 Code Standards

### **TypeScript**
✅ All new code must be TypeScript  
✅ No `any` types  
✅ Explicit return types  
✅ Define interfaces in `types.ts`

### **Components**
✅ Functional components only  
✅ Props interface required  
✅ One component per file  
✅ PascalCase for files (`ProtocolBuilder.tsx`)

### **State Management**
✅ Local state (`useState`) for component-specific  
✅ Context API for shared state  
❌ No global mutable state

---

## 🗄️ Database

### **Schema Changes**
✅ Additive-only (add tables, columns, indexes)  
❌ No dropping tables, columns, or renaming  
✅ All changes via SQL migrations

### **Data Capture**
✅ Foreign keys to `ref_*` tables  
❌ No free-text answers in `log_*` tables  
✅ RLS enabled on all patient-level tables

---

## ♿ Accessibility

### **Required**
✅ ARIA labels for icon-only buttons  
✅ Keyboard navigation support  
✅ Visible focus states  
✅ High contrast (WCAG AA)

### **Testing**
✅ Test on Chrome, Firefox, Safari  
✅ Test mobile (375px), tablet (768px), desktop (1440px)  
✅ Test keyboard navigation  
✅ Test with colorblind simulation

---

## 📦 Layout Components

### **PageContainer**
```tsx
<PageContainer width="wide" padding="default">
  {/* Content */}
</PageContainer>
```

**Width:** `default` (1440px), `wide` (1920px), `narrow` (1024px), `full`  
**Padding:** `compact`, `default`, `spacious`

---

## 🔧 Common Patterns

### **Data Fetching**
```typescript
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

try {
  const data = await fetchData();
  setData(data);
} catch (err) {
  setError(err.message);
} finally {
  setIsLoading(false);
}
```

### **Colorblind-Safe Status**
```tsx
// ✅ GOOD
<span className="flex items-center gap-2 text-clinical-green">
  <span>●</span>
  <span>↓</span>
  <span>-20% Improvement</span>
</span>

// ❌ BAD
<span className="text-clinical-green">Improvement</span>
```

---

## 📝 Git Commits

**Format:**
```
<type>(<scope>): <subject>

Examples:
feat(timeline): Add treatment history visualization
fix(auth): Resolve login redirect loop
docs(readme): Update installation instructions
```

---

## 🚀 Workflow

### **Planning Mode**
1. Create `task.md` with checklist
2. Create `implementation_plan.md` with spec
3. Request user review via `notify_user`
4. Wait for approval
5. Update task status via `task_boundary`

### **Agent Roles**
- **DESIGNER:** Visual specs (no code)
- **INVESTIGATOR:** Validates data, identifies blockers
- **BUILDER:** Implements features
- **Antigravity:** Coordinates, enforces rules

---

## ⚠️ Common Mistakes

❌ Storing "Psilocybin" as TEXT instead of `substance_id`  
❌ Mixing UUID and BIGINT for same entity  
❌ No error handling on async operations  
❌ Color-only status indicators  
❌ Font size < 11px  
❌ Deleting features without confirmation  
❌ Using `any` types  
❌ No ARIA labels on icon buttons

---

## 📚 Related Documents

- [PROJECT_RULES.md](PROJECT_RULES.md) - Full rules
- [DATABASE_GOVERNANCE_RULES.md](DATABASE_GOVERNANCE_RULES.md) - Database rules
- [SQL_MANDATORY_RULES.md](SQL_MANDATORY_RULES.md) - SQL best practices
- [WORKSPACE_RULES.md](WORKSPACE_RULES.md) - Workspace rules

---

**Version:** 2.0 | **Date:** 2026-02-10 | **Status:** ACTIVE
