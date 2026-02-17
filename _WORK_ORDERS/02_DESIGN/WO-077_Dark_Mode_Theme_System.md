---
id: WO-077
status: 02_DESIGN
priority: P2 (High)
category: Feature / Design System
owner: DESIGNER
failure_count: 0
---

# Dark Mode & Theme System

## User Request
Implement auto dark mode based on time of day or system preference to reduce eye strain during late-night sessions and improve battery life on mobile devices.

## 🔧 LEAD ARCHITECTURE (UPDATED P2 PRIORITY)

### ⚡ CRITICAL CONTEXT:

This is a **DESIGNER-led design system task**. DESIGNER should create the theme specifications, color palettes, and component patterns. BUILDER will implement the technical infrastructure after DESIGNER approval.

**DESIGNER Deliverables:**
1. Light theme color palette (with WCAG AAA contrast verification)
2. Dark theme color palette (with WCAG AAA contrast verification)
3. Component theming patterns (buttons, inputs, cards, etc.)
4. Theme toggle UI design
5. Transition/animation specifications

**BUILDER Deliverables (after DESIGNER approval):**
1. ThemeContext implementation
2. Auto-detection logic
3. Component updates
4. Persistence layer

---

### Technical Strategy
Build a theme system that supports light/dark modes with automatic switching based on:
1. System preference (prefers-color-scheme)
2. Time of day (auto-enable dark mode after 8 PM)
3. Manual toggle (user preference)

### Files to Touch
- `src/contexts/ThemeContext.tsx` (NEW)
- `src/hooks/useTheme.ts` (NEW)
- `src/styles/themes/light.ts` (NEW)
- `src/styles/themes/dark.ts` (NEW)
- `src/components/ThemeToggle.tsx` (NEW)

### Constraints
- Must respect system preference by default
- Must persist user preference (localStorage)
- Must transition smoothly (no flash of wrong theme)
- Must maintain WCAG 2.1 AAA contrast ratios in both modes

## Proposed Changes

### Feature 1: Theme System

**Light Theme Colors:**
```typescript
const lightTheme = {
  background: '#FFFFFF',
  surface: '#F3F4F6',
  text: '#1F2937',
  textSecondary: '#6B7280',
  primary: '#10B981', // emerald-500
  primaryHover: '#059669', // emerald-600
  danger: '#EF4444', // red-500
  warning: '#F59E0B', // amber-500
  success: '#10B981', // emerald-500
};
```

**Dark Theme Colors:**
```typescript
const darkTheme = {
  background: '#111827', // gray-900
  surface: '#1F2937', // gray-800
  text: '#F9FAFB', // gray-50
  textSecondary: '#D1D5DB', // gray-300
  primary: '#34D399', // emerald-400
  primaryHover: '#10B981', // emerald-500
  danger: '#F87171', // red-400
  warning: '#FBBF24', // amber-400
  success: '#34D399', // emerald-400
};
```

---

### Feature 2: Auto-Detection

**Priority Order:**
1. User manual preference (if set)
2. System preference (prefers-color-scheme)
3. Time of day (dark mode after 8 PM)

**Implementation:**
```typescript
const useTheme = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    // 1. Check user preference
    const saved = localStorage.getItem('theme');
    if (saved) return saved as 'light' | 'dark';
    
    // 2. Check system preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    // 3. Check time of day
    const hour = new Date().getHours();
    if (hour >= 20 || hour < 6) {
      return 'dark';
    }
    
    return 'light';
  });
  
  return { theme, setTheme };
};
```

---

### Feature 3: Theme Toggle UI

**Location:** User menu (top-right corner)

**UI:**
```
[☀️ Light] [🌙 Dark] [🔄 Auto]
```

**States:**
- **Light:** Always light mode
- **Dark:** Always dark mode
- **Auto:** System preference or time-based

---

### Feature 4: Smooth Transitions

**CSS:**
```css
* {
  transition: background-color 300ms ease-in-out,
              color 300ms ease-in-out,
              border-color 300ms ease-in-out;
}
```

**Prevent Flash:**
```html
<script>
  // Run before React loads
  const theme = localStorage.getItem('theme') || 'light';
  document.documentElement.classList.add(theme);
</script>
```

---

### Feature 5: Component Updates

**All components must support both themes:**

**Example:**
```tsx
const Button = ({ variant = 'primary' }) => {
  const { theme } = useTheme();
  
  return (
    <button
      className={`
        ${theme === 'dark' ? 'bg-emerald-400' : 'bg-emerald-600'}
        ${theme === 'dark' ? 'text-gray-900' : 'text-white'}
      `}
    >
      Click Me
    </button>
  );
};
```

---

## Verification Plan

### Automated Tests
```bash
npm run test -- useTheme.test.ts
npm run test -- ThemeContext.test.tsx
```

### Manual Verification
1. **System Preference:** Verify respects OS dark mode setting
2. **Time-Based:** Verify auto-enables dark mode after 8 PM
3. **Manual Toggle:** Verify can override with manual selection
4. **Persistence:** Verify preference saved to localStorage
5. **Smooth Transition:** Verify no flash when switching themes
6. **Contrast:** Verify WCAG AAA contrast in both modes
7. **All Pages:** Verify all pages support dark mode

### Accessibility
- Sufficient contrast in both modes (WCAG AAA)
- Theme toggle keyboard accessible
- Screen reader announces theme change

---

## Dependencies
- None (standalone feature)

## Estimated Effort
**12-16 hours** (3-4 days)

## Success Criteria
- ✅ Light and dark themes defined
- ✅ Auto-detection works (system, time, manual)
- ✅ Theme toggle UI functional
- ✅ Smooth transitions (no flash)
- ✅ All components support both themes
- ✅ Preference persists across sessions
- ✅ WCAG AAA contrast in both modes

---

**Status:** Ready for LEAD assignment
