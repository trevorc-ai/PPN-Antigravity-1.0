# 🚀 **BUILDER TASK: LAUNCH-CRITICAL FIXES**

**Assigned To:** Builder Agent  
**Priority:** 🔴 **CRITICAL**  
**Deadline:** Before Production Launch  
**Date Created:** 2026-02-10 09:43 AM  
**Context:** Based on comprehensive site audit completed 2026-02-10

---

## 📋 **EXECUTIVE SUMMARY**

The PPN Research Portal is **production-ready** with caveats. The Designer Agent has completed all Quick Wins (8/8 tasks, 100% complete). The BUILDER must now address **3 critical blockers** and **4 high-priority issues** before launch.

**Current Status:**
- ✅ All font sizes \u003e= 10px (accessibility compliant)
- ✅ All console.log statements removed
- ✅ All images have alt text
- ✅ Package version updated to 1.0.0
- ✅ ProtocolBuilderV2 archived
- ⚠️ **3 CRITICAL BLOCKERS remain**

---

## 🔴 **CRITICAL BLOCKERS (Must Fix Before Launch)**

### **BLOCKER #1: Protocol Builder Duplication**

**Problem:**  
Two active Protocol Builder implementations exist, causing:
- Code duplication (~155KB)
- Maintenance nightmare (bugs must be fixed 2x)
- Data inconsistency risk
- Developer confusion

**Files:**
- `src/pages/ProtocolBuilder.tsx` (73KB) - **Original V1**
- `src/pages/ProtocolBuilderRedesign.tsx` (82KB) - **Database-driven redesign**

**Current Routing:**
```typescript
// src/App.tsx
<Route path="/builder" element={<ProtocolBuilder />} />
// No route for ProtocolBuilderRedesign (orphaned)
```

**Task:**
1. **Determine canonical version:**
   - ✅ **RECOMMENDATION:** Use `ProtocolBuilderRedesign.tsx` (has database wiring)
   - Verify it has all features from original
   - Test save functionality works
   
2. **Migration steps:**
   ```bash
   # Step 1: Rename files
   mv src/pages/ProtocolBuilder.tsx archive/ProtocolBuilder_V1_Original.tsx
   mv src/pages/ProtocolBuilderRedesign.tsx src/pages/ProtocolBuilder.tsx
   
   # Step 2: Update imports in ProtocolBuilder.tsx
   # Remove "Redesign" from component name
   # Update export to: export default ProtocolBuilder
   
   # Step 3: Test thoroughly
   # - Create new protocol
   # - Save to database
   # - Verify list view shows saved protocols
   # - Test all dropdowns populate from Supabase
   ```

3. **Verification checklist:**
   - [ ] Only ONE ProtocolBuilder.tsx exists in src/pages/
   - [ ] Component exports as `ProtocolBuilder` (not `ProtocolBuilderRedesign`)
   - [ ] Route `/builder` loads the correct component
   - [ ] Save functionality works (inserts to `log_clinical_records`)
   - [ ] List view fetches from database
   - [ ] All dropdowns populate from reference tables

**Effort:** 2 hours  
**Risk:** MEDIUM (data loss if wrong version chosen)

---

### **BLOCKER #2: Demo Mode Security Vulnerability**

**Problem:**  
Anyone can bypass authentication by setting `localStorage.setItem('demo_mode', 'true')` in browser console.

**Current Code:**
```typescript
// src/App.tsx:94
const isDemoMode = localStorage.getItem('demo_mode') === 'true';
if (!isAuthenticated && !isDemoMode) {
  navigate('/login');
}
```

**Impact:**
- Unauthorized access to protected routes
- Potential data exposure
- Compliance violation (HIPAA-adjacent)

**Task:**
1. **Option A: Remove Demo Mode (RECOMMENDED)**
   ```typescript
   // src/App.tsx
   // DELETE these lines:
   const isDemoMode = localStorage.getItem('demo_mode') === 'true';
   
   // REPLACE with:
   if (!isAuthenticated) {
     navigate('/login');
   }
   ```

2. **Option B: Gate Behind Environment Variable**
   ```typescript
   // src/App.tsx
   const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true' 
     && localStorage.getItem('demo_mode') === 'true';
   
   if (!isAuthenticated && !isDemoMode) {
     navigate('/login');
   }
   ```
   
   ```bash
   # .env.example
   VITE_DEMO_MODE=false  # Set to 'true' only in development
   ```

**Verification:**
- [ ] Cannot access `/dashboard` without login
- [ ] Setting `localStorage.setItem('demo_mode', 'true')` does NOT bypass auth
- [ ] Demo mode only works if `VITE_DEMO_MODE=true` in .env (Option B)

**Effort:** 30 minutes  
**Risk:** LOW

---

### **BLOCKER #3: Replace All alert() Calls**

**Problem:**  
11 instances of browser `alert()` for user feedback:
- Blocks UI (modal, cannot be dismissed programmatically)
- Not accessible (screen readers struggle)
- Looks unprofessional
- Cannot be tested

**Locations:**
```typescript
// src/components/TopHeader.tsx (3x)
alert('Coming Soon!');

// src/pages/ProtocolBuilder.tsx (3x)
alert('Please fill in all required fields');
alert('Protocol saved successfully!');
alert('Error saving protocol');

// src/pages/ProtocolBuilderRedesign.tsx (3x)
alert('Please fill in all required fields');
alert('Protocol saved successfully!');
alert('Error saving protocol');

// src/pages/InteractionChecker.tsx (1x)
alert('Interaction request logged');

// src/pages/SignUp.tsx (1x)
alert('Account created successfully!');
```

**Task:**

**Step 1: Create Toast Component**
```typescript
// src/components/ui/Toast.tsx
import { createContext, useContext, useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

interface ToastContextType {
  addToast: (toast: Omit<Toast, 'id'>) => void;
}

const ToastContext = createContext<ToastContextType>({
  addToast: () => {},
});

export const useToast = () => useContext(ToastContext);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { ...toast, id, duration: toast.duration || 3000 };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, newToast.duration);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const iconMap = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
    warning: AlertTriangle,
  };

  const colorMap = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    warning: 'bg-amber-500',
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => {
          const Icon = iconMap[toast.type];
          return (
            <div
              key={toast.id}
              className={`${colorMap[toast.type]} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px] animate-in slide-in-from-right`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <p className="flex-1 text-sm font-medium">{toast.message}</p>
              <button
                onClick={() => removeToast(toast.id)}
                className="flex-shrink-0 hover:bg-white/20 rounded p-1 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};
```

**Step 2: Wrap App with ToastProvider**
```typescript
// src/App.tsx
import { ToastProvider } from './components/ui/Toast';

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        {/* existing app content */}
      </AuthProvider>
    </ToastProvider>
  );
}
```

**Step 3: Replace all alert() calls**
```typescript
// Example: src/pages/ProtocolBuilder.tsx
import { useToast } from '../components/ui/Toast';

function ProtocolBuilder() {
  const { addToast } = useToast();

  const handleSubmit = async () => {
    if (!isValid) {
      // OLD: alert('Please fill in all required fields');
      addToast({ 
        type: 'error', 
        message: 'Please fill in all required fields' 
      });
      return;
    }

    try {
      await saveProtocol();
      // OLD: alert('Protocol saved successfully!');
      addToast({ 
        type: 'success', 
        message: 'Protocol saved successfully!' 
      });
    } catch (error) {
      // OLD: alert('Error saving protocol');
      addToast({ 
        type: 'error', 
        message: 'Error saving protocol' 
      });
    }
  };
}
```

**Files to Update:**
- [ ] `src/components/TopHeader.tsx` (3 alerts)
- [ ] `src/pages/ProtocolBuilder.tsx` (3 alerts)
- [ ] `src/pages/ProtocolBuilderRedesign.tsx` (3 alerts) - **SKIP if merging into one**
- [ ] `src/pages/InteractionChecker.tsx` (1 alert)
- [ ] `src/pages/SignUp.tsx` (1 alert)

**Verification:**
- [ ] No `alert(` calls in codebase (search with `grep -r "alert(" src/`)
- [ ] Toast notifications appear in bottom-right corner
- [ ] Toasts auto-dismiss after 3 seconds
- [ ] Toasts can be manually dismissed with X button
- [ ] Success toasts are green, errors are red

**Effort:** 4 hours  
**Risk:** LOW

---

## 🟡 **HIGH PRIORITY (Should Fix Before Launch)**

### **PRIORITY #4: Test Protocol Builder Save Functionality**

**Problem:**  
The browser audit revealed that the Protocol Builder form submission was attempted but **we don't have confirmation that it actually saves to the database**.

**Current Status:**
- ✅ Dropdowns populate from Supabase reference tables
- ✅ Foreign keys configured (`substance_id` → `ref_substances`)
- ⚠️ Save functionality NOT verified

**Task:**

1. **Manual Testing Checklist:**
   ```bash
   # Start dev server
   npm run dev
   
   # Open browser to http://localhost:3000
   # Login or enable demo mode
   # Navigate to Protocol Builder
   ```

   - [ ] Click "Create New Protocol"
   - [ ] Fill out ALL required fields:
     - [ ] Subject ID (auto-generated or manual)
     - [ ] Substance Compound (select from dropdown)
     - [ ] Administration Route (select from dropdown)
     - [ ] Standardized Dosage (enter number)
     - [ ] Informed Consent (check checkbox)
   - [ ] Click "Submit to Registry"
   - [ ] Verify success message appears
   - [ ] **CRITICAL:** Check Supabase database:
     ```sql
     SELECT * FROM log_clinical_records ORDER BY created_at DESC LIMIT 1;
     ```
   - [ ] Verify new row exists with correct data
   - [ ] Refresh Protocol Builder page
   - [ ] Verify new protocol appears in "My Protocols" list

2. **If Save Fails:**
   - Check browser console for errors
   - Check Supabase logs for RLS policy violations
   - Verify `handleSubmit` function in ProtocolBuilder.tsx
   - Ensure `substance_id` is being resolved correctly (not sending substance name)

3. **Fix Common Issues:**
   ```typescript
   // WRONG: Sending substance name instead of ID
   const data = {
     substance_id: formData.substance, // "Psilocybin" (string)
   };

   // CORRECT: Resolve ID from reference data
   const substanceRecord = referenceData.substances.find(
     s => s.substance_name === formData.substance
   );
   const data = {
     substance_id: substanceRecord?.substance_id, // 1 (number)
   };
   ```

**Verification:**
- [ ] Can create new protocol
- [ ] Data saves to `log_clinical_records` table
- [ ] Saved protocol appears in list view
- [ ] Can view protocol details
- [ ] All foreign keys resolve correctly

**Effort:** 2 hours (testing + fixes)  
**Risk:** HIGH (core functionality)

---

### **PRIORITY #5: Implement Error Boundary**

**Problem:**  
No global error handling. If a component crashes, the entire app goes blank (white screen of death).

**Task:**

**Step 1: Create ErrorBoundary Component**
```typescript
// src/components/ErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    // TODO: Send to error tracking service (Sentry, etc.)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0b0e14] flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-red-500 rounded-2xl p-8 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-8 h-8 text-red-500" />
              <h1 className="text-2xl font-bold text-white">Something went wrong</h1>
            </div>
            <p className="text-slate-400 mb-4">
              The application encountered an unexpected error. Please refresh the page to continue.
            </p>
            {import.meta.env.DEV && this.state.error && (
              <pre className="bg-slate-950 p-4 rounded text-xs text-red-400 overflow-auto">
                {this.state.error.toString()}
              </pre>
            )}
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-lg font-medium transition mt-4"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

**Step 2: Wrap App**
```typescript
// src/App.tsx
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <AuthProvider>
          {/* existing app content */}
        </AuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}
```

**Verification:**
- [ ] Trigger an error (throw new Error('test') in a component)
- [ ] Error boundary catches it and shows fallback UI
- [ ] "Refresh Page" button works
- [ ] Error details shown in DEV mode only

**Effort:** 1 hour  
**Risk:** LOW

---

### **PRIORITY #6: Add Loading States**

**Problem:**  
No loading indicators when fetching data from Supabase. Users see blank screens.

**Affected Components:**
- Protocol Builder (fetching reference data)
- Dashboard (fetching metrics)
- Deep Dive pages (fetching analytics)

**Task:**

**Step 1: Create LoadingSpinner Component**
```typescript
// src/components/ui/LoadingSpinner.tsx
export const LoadingSpinner = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex items-center justify-center">
      <div className={`${sizeMap[size]} border-4 border-slate-700 border-t-indigo-500 rounded-full animate-spin`} />
    </div>
  );
};

export const LoadingPage = ({ message = 'Loading...' }: { message?: string }) => {
  return (
    <div className="min-h-screen bg-[#0b0e14] flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="text-slate-400 mt-4">{message}</p>
      </div>
    </div>
  );
};
```

**Step 2: Add Loading States to useReferenceData Hook**
```typescript
// src/hooks/useReferenceData.ts
export const useReferenceData = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ReferenceData>({...});

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // ... fetch logic
        setData(fetchedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return { data, loading, error };
};
```

**Step 3: Use Loading States in Components**
```typescript
// src/pages/ProtocolBuilder.tsx
import { LoadingPage } from '../components/ui/LoadingSpinner';

function ProtocolBuilder() {
  const { data, loading, error } = useReferenceData();

  if (loading) return <LoadingPage message="Loading protocol builder..." />;
  if (error) return <div>Error: {error}</div>;

  return (
    // ... form content
  );
}
```

**Files to Update:**
- [ ] `src/hooks/useReferenceData.ts` (add loading/error states)
- [ ] `src/pages/ProtocolBuilder.tsx` (show loading spinner)
- [ ] `src/pages/Dashboard.tsx` (show loading spinner)
- [ ] Deep dive pages (show loading spinner)

**Verification:**
- [ ] Loading spinner shows while fetching data
- [ ] Spinner disappears when data loads
- [ ] Error message shows if fetch fails

**Effort:** 3 hours  
**Risk:** LOW

---

### **PRIORITY #7: Standardize Remaining Tooltips**

**Problem:**  
Some components still use raw `title` attributes instead of `AdvancedTooltip` component.

**Current Status:**
- ✅ `ProtocolDetail.tsx` fixed (SimpleTooltip → AdvancedTooltip)
- ⚠️ Other pages not audited

**Task:**

1. **Find all title attributes:**
   ```bash
   grep -r 'title="' src/ --include="*.tsx"
   ```

2. **Replace with AdvancedTooltip:**
   ```typescript
   // BEFORE
   <button title="Click to view details">View</button>

   // AFTER
   import { AdvancedTooltip } from '../components/AdvancedTooltip';

   <AdvancedTooltip content="Click to view details" tier="basic">
     <button>View</button>
   </AdvancedTooltip>
   ```

3. **Recharts Custom Tooltips:**
   - Ensure consistent styling
   - Use design system colors
   - Add proper labels

**Verification:**
- [ ] No `title="` attributes in codebase (except HTML meta tags)
- [ ] All tooltips use `AdvancedTooltip` component
- [ ] Tooltips have consistent styling
- [ ] Tooltips are accessible (keyboard navigable)

**Effort:** 4 hours  
**Risk:** LOW

---

## 🟢 **MEDIUM PRIORITY (Nice to Have)**

### **PRIORITY #8: Add Supabase Connection Health Check**

**Problem:**  
If Supabase is down or credentials are wrong, the app fails silently.

**Task:**

```typescript
// src/utils/healthCheck.ts
import { supabase } from '../supabaseClient';

export const checkSupabaseConnection = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.from('sites').select('site_id').limit(1);
    return !error;
  } catch {
    return false;
  }
};

// src/App.tsx
useEffect(() => {
  checkSupabaseConnection().then(isHealthy => {
    if (!isHealthy) {
      console.error('Supabase connection failed');
      // Show error toast or banner
    }
  });
}, []);
```

**Effort:** 1 hour  
**Risk:** LOW

---

## 📊 **TASK SUMMARY**

| Priority | Task | Effort | Risk | Status |
|----------|------|--------|------|--------|
| 🔴 CRITICAL | #1: Resolve Protocol Builder Duplication | 2h | MEDIUM | ⏳ Pending |
| 🔴 CRITICAL | #2: Fix Demo Mode Security Hole | 30m | LOW | ⏳ Pending |
| 🔴 CRITICAL | #3: Replace All alert() Calls | 4h | LOW | ⏳ Pending |
| 🟡 HIGH | #4: Test Protocol Builder Save | 2h | HIGH | ⏳ Pending |
| 🟡 HIGH | #5: Implement Error Boundary | 1h | LOW | ⏳ Pending |
| 🟡 HIGH | #6: Add Loading States | 3h | LOW | ⏳ Pending |
| 🟡 HIGH | #7: Standardize Tooltips | 4h | LOW | ⏳ Pending |
| 🟢 MEDIUM | #8: Supabase Health Check | 1h | LOW | ⏳ Pending |

**Total Effort:** ~17.5 hours  
**Estimated Completion:** 2-3 days (full-time work)

---

## ✅ **ACCEPTANCE CRITERIA**

Before marking this task as COMPLETE, verify:

- [ ] Only ONE ProtocolBuilder.tsx exists in production code
- [ ] Demo mode cannot be enabled via localStorage (or is gated by env var)
- [ ] Zero `alert()` calls in codebase
- [ ] Toast notification system works
- [ ] Protocol Builder save functionality tested and working
- [ ] Error boundary catches and displays errors gracefully
- [ ] Loading spinners show during data fetches
- [ ] All tooltips use AdvancedTooltip component
- [ ] Supabase connection health check implemented

---

## 🚦 **DEPLOYMENT READINESS**

After completing these tasks, the application will be:

✅ **Secure** (no auth bypass)  
✅ **Professional** (no alert() popups)  
✅ **Maintainable** (no code duplication)  
✅ **Resilient** (error boundaries, loading states)  
✅ **Accessible** (consistent tooltips)  
✅ **Tested** (core functionality verified)

**Recommended Next Steps After Completion:**
1. Run full regression test suite
2. Test on mobile devices (375px, 768px)
3. Test with screen reader (VoiceOver, NVDA)
4. Load test with 100+ protocols
5. Security audit (penetration testing)
6. Deploy to staging environment
7. Beta user testing (5-10 users)
8. Production deployment

---

**Task Created:** 2026-02-10 09:43 AM  
**Created By:** Designer Agent (Antigravity)  
**For:** Builder Agent  
**Status:** 🟡 **READY FOR EXECUTION**
