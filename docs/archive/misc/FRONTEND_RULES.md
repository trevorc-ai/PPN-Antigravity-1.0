# 🎨 **FRONTEND DEVELOPMENT RULES v1.0**

**Parent Document:** `PROJECT_GOVERNANCE_RULES.md`  
**Effective Date:** 2026-02-10  
**Status:** ACTIVE AND ENFORCED

---

## 📋 **QUICK REFERENCE**

### **Critical Rules (MUST FOLLOW)**
- ✅ TypeScript for all components
- ✅ Min font size: 10px
- ✅ Color + icon/text (never color alone)
- ✅ Handle loading/error states
- ❌ No `alert()` calls
- ❌ No `any` types without justification

---

## 1️⃣ **COMPONENT DEVELOPMENT**

### **A. TypeScript Requirements**

#### **All Components Must:**
- ✅ Use TypeScript (`.tsx` extension)
- ✅ Define explicit prop types
- ✅ Use interfaces for complex types
- ✅ Export types alongside components

#### **Forbidden:**
- ❌ `any` types without justification comment
- ❌ Implicit `any` from missing types
- ❌ Type assertions without validation

**Example:**
```typescript
// ✅ GOOD
interface CardProps {
  title: string;
  description?: string;
  onClick?: () => void;
  variant?: 'default' | 'highlighted';
}

export const Card: React.FC<CardProps> = ({ 
  title, 
  description, 
  onClick,
  variant = 'default' 
}) => {
  return (
    <div 
      className={`card ${variant === 'highlighted' ? 'card-highlighted' : ''}`}
      onClick={onClick}
    >
      <h3>{title}</h3>
      {description && <p>{description}</p>}
    </div>
  );
};

// ❌ BAD
export const Card = (props: any) => {
  return <div>{props.title}</div>;
};
```

---

### **B. Component Structure**

#### **File Organization:**
- ✅ One component per file
- ✅ Named exports (not default)
- ✅ Co-locate types with component
- ✅ Import order: React → External → Internal → Types

**Example:**
```typescript
// ✅ GOOD FILE STRUCTURE
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { AdvancedTooltip } from '../components/ui/AdvancedTooltip';

interface MyComponentProps {
  // ...
}

export const MyComponent: React.FC<MyComponentProps> = (props) => {
  // ...
};
```

#### **Component Patterns:**
- ✅ Functional components with hooks
- ✅ Props destructuring in function signature
- ✅ Early returns for loading/error states
- ❌ No class components

---

## 2️⃣ **STATE MANAGEMENT**

### **A. Global State (React Context)**

#### **When to Use:**
- Authentication state
- User profile
- Theme/preferences
- Site-wide settings

#### **Pattern:**
```typescript
// ✅ GOOD - Context pattern
import { createContext, useContext, useState } from 'react';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

---

### **B. Local State (useState)**

#### **When to Use:**
- Component-specific data
- Form inputs
- UI state (modals, dropdowns)
- Temporary data

#### **Pattern:**
```typescript
// ✅ GOOD - Local state
const [isOpen, setIsOpen] = useState(false);
const [formData, setFormData] = useState<FormData>({
  name: '',
  email: ''
});
```

---

### **C. Server State (Supabase)**

#### **Required Pattern:**
```typescript
// ✅ GOOD - Complete pattern
const [data, setData] = useState<Substance[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('ref_substances')
        .select('*')
        .eq('is_active', true);
      
      if (error) throw error;
      setData(data || []);
      
    } catch (err: any) {
      console.error('Error fetching substances:', err);
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };
  
  fetchData();
}, []);

// Handle states in render
if (loading) return <LoadingSpinner />;
if (error) return <ErrorMessage message={error} />;
if (data.length === 0) return <EmptyState />;
```

#### **Required Elements:**
- ✅ Loading state
- ✅ Error state
- ✅ Try/catch block
- ✅ Finally block to clear loading
- ✅ Empty state handling

---

## 3️⃣ **STYLING**

### **A. Tailwind CSS**

#### **Required:**
- ✅ Use Tailwind utility classes
- ✅ Follow design system tokens
- ✅ Use responsive modifiers
- ✅ Logical class grouping

#### **Forbidden:**
- ❌ Inline styles (`style={{}}`)
- ❌ Custom CSS files (except `index.css`)
- ❌ Arbitrary values without justification

**Example:**
```typescript
// ✅ GOOD - Logical grouping
className="
  flex items-center justify-between gap-4
  px-6 py-3
  bg-primary hover:bg-blue-600
  text-white text-sm font-bold
  rounded-xl
  transition-all
  active:scale-95
"

// ❌ BAD - Random order
className="text-white px-6 rounded-xl bg-primary gap-4 flex py-3 items-center hover:bg-blue-600 transition-all text-sm font-bold active:scale-95 justify-between"
```

---

### **B. Font Size (CRITICAL)**

#### **Accessibility Rule:**
- ✅ **Minimum:** 10px (`text-[10px]`)
- ❌ **FORBIDDEN:** `text-[9px]` or smaller
- **Why:** User is colorblind and needs larger text for readability

#### **Standard Sizes:**
```typescript
// Labels, metadata
text-[10px]  // 10px - Minimum allowed
text-[11px]  // 11px - Small labels
text-xs      // 12px - Tiny text

// Body text
text-sm      // 14px - Default body
text-base    // 16px - Emphasized body

// Headings
text-lg      // 18px - Small heading
text-xl      // 20px - Medium heading
text-2xl     // 24px - Large heading
text-3xl     // 30px - XL heading
text-4xl     // 36px - XXL heading
text-5xl     // 48px - Hero heading
```

---

### **C. Responsive Design**

#### **Breakpoints:**
```typescript
// Mobile-first approach
className="
  text-sm           // Mobile (< 640px)
  sm:text-base      // Tablet (640px+)
  md:text-lg        // Desktop (768px+)
  lg:text-xl        // Large (1024px+)
"
```

#### **Common Patterns:**
```typescript
// Grid layout
className="
  grid
  grid-cols-1       // Mobile: 1 column
  sm:grid-cols-2    // Tablet: 2 columns
  lg:grid-cols-3    // Desktop: 3 columns
  gap-4
"

// Flex direction
className="
  flex
  flex-col          // Mobile: vertical
  md:flex-row       // Desktop: horizontal
  gap-4
"
```

---

## 4️⃣ **ACCESSIBILITY (CRITICAL)**

### **A. Semantic HTML**

#### **Required:**
```typescript
// ✅ GOOD
<button onClick={handleClick}>Click me</button>
<a href="/page">Navigate</a>
<header>...</header>
<main>...</main>
<section>...</section>

// ❌ BAD
<div onClick={handleClick}>Click me</div>
<div onClick={() => navigate('/page')}>Navigate</div>
```

---

### **B. Color Accessibility (CRITICAL)**

#### **Rule: NEVER use color alone**
- ✅ **ALWAYS** pair color with icon or text
- ❌ **NEVER** rely on color alone to convey meaning
- **Why:** User is colorblind (Deuteranopia/Protanopia spectrum)

**Examples:**
```typescript
// ✅ GOOD - Color + Icon + Text
<div className="flex items-center gap-2">
  <AlertTriangle className="w-5 h-5 text-amber-500" />
  <span className="text-amber-500 font-bold">Warning</span>
  <span className="text-slate-300">Check your inputs</span>
</div>

// ✅ GOOD - Color + Icon
<button className="flex items-center gap-2 text-emerald-500">
  <CheckCircle className="w-5 h-5" />
  <span>Success</span>
</button>

// ❌ BAD - Color only
<div className="text-red-500">Error occurred</div>
<span className="text-green-500">Complete</span>
```

---

### **C. ARIA Labels**

#### **Required:**
```typescript
// Icon-only buttons
<button aria-label="Close modal" onClick={onClose}>
  <X className="w-5 h-5" />
</button>

// Tooltips
<div aria-describedby="tooltip-id">
  Hover me
</div>

// Status indicators
<div role="status" aria-live="polite">
  Loading...
</div>
```

---

### **D. Keyboard Navigation**

#### **Required:**
- ✅ All interactive elements keyboard accessible
- ✅ Visible focus states
- ✅ Logical tab order
- ✅ Escape key closes modals

**Example:**
```typescript
// ✅ GOOD - Keyboard support
const Modal = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);
  
  return (
    <div 
      role="dialog" 
      aria-modal="true"
      tabIndex={-1}
    >
      {/* Modal content */}
    </div>
  );
};
```

---

## 5️⃣ **USER FEEDBACK**

### **A. Loading States**

#### **Required:**
```typescript
// ✅ GOOD
if (loading) {
  return (
    <div className="flex items-center justify-center p-8">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
      <span className="ml-3 text-slate-400">Loading...</span>
    </div>
  );
}
```

---

### **B. Error States**

#### **Required:**
```typescript
// ✅ GOOD
if (error) {
  return (
    <div className="flex items-center gap-3 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl">
      <AlertTriangle className="w-5 h-5 text-rose-500" />
      <div>
        <p className="text-sm font-bold text-rose-500">Error</p>
        <p className="text-xs text-slate-300">{error}</p>
      </div>
    </div>
  );
}
```

---

### **C. Toast Notifications (Future)**

#### **Current State:**
- ❌ `alert()` calls exist in 11 locations
- ⏸️ Toast component not yet implemented

#### **Action Required:**
- Create Toast notification system
- Replace all `alert()` calls
- See `_agent_status.md` for locations

---

## 6️⃣ **PERFORMANCE**

### **A. Code Splitting**

#### **Recommended:**
```typescript
// Lazy load heavy pages
const PatientFlowPage = lazy(() => import('./pages/deep-dives/PatientFlowPage'));

// Wrap in Suspense
<Suspense fallback={<LoadingSpinner />}>
  <PatientFlowPage />
</Suspense>
```

---

### **B. Memoization**

#### **When to Use:**
```typescript
// Expensive calculations
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);

// Callback functions passed to children
const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);
```

---

## 7️⃣ **TESTING**

### **A. Manual Testing Checklist**

#### **Before Committing:**
- [ ] Component renders without errors
- [ ] Loading state displays correctly
- [ ] Error state displays correctly
- [ ] Empty state displays correctly
- [ ] All interactive elements work
- [ ] Keyboard navigation works
- [ ] Responsive at 375px, 768px, 1024px
- [ ] No console errors
- [ ] No accessibility violations

---

### **B. Automated Testing (Future)**

#### **Planned:**
- Unit tests for critical functions
- Integration tests for Supabase queries
- E2E tests for critical flows

---

## 8️⃣ **COMMON PATTERNS**

### **A. Form Handling**

```typescript
const [formData, setFormData] = useState({
  name: '',
  email: ''
});

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setFormData(prev => ({
    ...prev,
    [e.target.name]: e.target.value
  }));
};

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  // Handle submission
};
```

---

### **B. Modal Pattern**

```typescript
const [isOpen, setIsOpen] = useState(false);

return (
  <>
    <button onClick={() => setIsOpen(true)}>Open Modal</button>
    
    {isOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <button onClick={() => setIsOpen(false)}>Close</button>
          {/* Modal content */}
        </div>
      </div>
    )}
  </>
);
```

---

**END OF FRONTEND RULES v1.0**

**Last Updated:** 2026-02-10  
**See Also:** `PROJECT_GOVERNANCE_RULES.md`, `DESIGN_SYSTEM_RULES.md`
