---
name: frontend-best-practices
description: Team-specific linting rules, coding standards, and design system documentation for the PPN Research Portal frontend.
---

# Frontend Best Practices Skill

## 🎯 Design System Compliance

### **Color Palette (Strict)**

```css
/* Primary Brand */
--emerald-500: #10b981
--emerald-400: #34d399

/* Backgrounds & Text */
--slate-900: #0f172a
--slate-800: #1e293b
--slate-700: #334155
--slate-300: #cbd5e1
--slate-100: #f1f5f9

/* Semantic */
--rose-500: #f43f5e    /* Error */
--amber-500: #f59e0b   /* Warning */
--blue-500: #3b82f6    /* Info */
```

**Usage:** ✅ `bg-emerald-500` | ❌ `bg-[#10b981]`

---

### **Typography**

**Font Sizes (Minimum Enforced):**
- Body: 16px (`text-base`)
- Labels: 14px (`text-sm`)
- Headings: 24px+ (`text-2xl`)

**❌ NEVER use `text-xs` (12px) except chart legends**

---

### **Spacing**

- Card padding: `p-6` or `p-8`
- Section spacing: `space-y-8`
- Grid gaps: `gap-6`

---

## 🔒 Accessibility (Non-Negotiable)

### **Color Contrast**

- Normal text: 7:1 (AAA) or 4.5:1 (AA minimum)
- Large text: 4.5:1 (AAA) or 3:1 (AA minimum)

**Check:** Use browser DevTools Accessibility panel

---

### **Color Blindness Support**

**❌ BAD - Color only:**
```jsx
<div className="text-rose-500">Error</div>
```

**✅ GOOD - Color + Icon + Text:**
```jsx
<div className="flex items-center gap-2 text-rose-500">
  <AlertTriangle className="w-5 h-5" />
  <span>Error: Unable to save</span>
</div>
```

---

### **Keyboard Navigation**

All interactive elements MUST:
- Be reachable via Tab
- Have visible focus states
- Work with Enter/Space

```jsx
<button className="
  focus:outline-none 
  focus:ring-2 
  focus:ring-emerald-500
">
  Submit
</button>
```

---

## 📝 Code Standards

### **TypeScript (Strict)**

```typescript
// ✅ GOOD - Explicit types
interface ProtocolData {
  protocol_id: string;
  substance_id: number;
}

const fetchProtocol = async (id: string): Promise<ProtocolData> => {
  // ...
};

// ❌ BAD - Any types
const fetchProtocol = async (id: any): Promise<any> => {
  // ...
};
```

**No `any` types allowed**

---

### **Component Structure**

```tsx
import { FC, useState } from 'react';

interface Props {
  title: string;
  value: number;
}

export const Component: FC<Props> = ({ title, value }) => {
  const [state, setState] = useState<string>('');
  
  const handleClick = () => {
    // Event handler
  };
  
  return <div>{/* Content */}</div>;
};
```

---

### **Import Organization**

```typescript
// 1. React
import { FC, useState } from 'react';

// 2. Third-party
import { AlertTriangle } from 'lucide-react';

// 3. Internal
import { supabase } from '@/lib/supabaseClient';

// 4. Components
import { Button } from '@/components/ui/Button';

// 5. Types
import type { Protocol } from '@/types/protocol';
```

---

## 🎨 Component Patterns

### **Card (Glassmorphism)**

```tsx
<div className="
  bg-slate-800/50 backdrop-blur-sm
  border border-slate-700/50
  rounded-xl p-6
  hover:border-slate-600/50 
  transition-all
">
  {/* Content */}
</div>
```

---

### **Button Variants**

```tsx
// Primary CTA
<button className="
  px-6 py-3
  bg-emerald-500 hover:bg-emerald-400
  text-slate-900 font-semibold
  rounded-lg shadow-lg
">
  Primary
</button>

// Secondary
<button className="
  px-6 py-3
  border border-slate-600
  text-slate-300
  rounded-lg
">
  Secondary
</button>
```

---

## 🚫 Linting Rules

### **ESLint**

```json
{
  "rules": {
    "no-console": "warn",
    "@typescript-eslint/no-explicit-any": "error",
    "react-hooks/exhaustive-deps": "warn"
  }
}
```

**Common Violations:**
- ❌ Console logs in production
- ❌ Unused variables
- ❌ Missing useEffect dependencies

---

## ✅ Pre-Commit Checklist

- [ ] No TypeScript errors
- [ ] No ESLint errors
- [ ] All imports organized
- [ ] No console.log statements
- [ ] Accessibility requirements met
- [ ] Font sizes ≥14px
- [ ] Color + icon + text for states
- [ ] Responsive at all breakpoints

---

**END OF FRONTEND BEST PRACTICES SKILL**
