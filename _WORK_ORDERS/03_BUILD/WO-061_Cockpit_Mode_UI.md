---
id: WO-061
status: 03_BUILD
priority: P1 (Critical)
category: Feature / UI/UX / Grey Market / Accessibility
owner: MARKETER
failure_count: 0
created_date: 2026-02-16T15:01:00-08:00
estimated_complexity: 3/10
estimated_timeline: 1-2 days
strategic_alignment: Grey Market "Phantom Shield" (Model #2)
phase: 1_STRATEGY
---

# User Request

Implement a **"Cockpit Mode" UI theme** optimized for low-light, high-stress ceremony environments where practitioners operate with dilated pupils and impaired motor skills.

## Strategic Context

**From Research:** "Standard 'Clinical White' SaaS design (like Salesforce or EHRs) is actively dangerous for grey market practitioners. They operate in low-light environments (basements, yurts, dim clinics) with clients in altered states. Bright white screens create 'glare shock' for dilated pupils and feel too 'institutional' for a paranoia-prone environment."

**Impact:** Makes the app **actually usable** in ceremony environments. Current UI is unusable for grey market practitioners.

---

## THE BLAST RADIUS (Authorized Target Area)

### New Files to Create

**Frontend Components:**
- `src/components/ui/ThemeToggle.tsx` - Toggle between Clinical and Cockpit modes
- `src/styles/cockpit-theme.css` - Cockpit Mode CSS variables
- `src/contexts/ThemeContext.tsx` - Theme state management
- `src/hooks/useTheme.ts` - Theme hook

### Files to Modify

**Global Styles:**
- `src/index.css` - Add Cockpit Mode CSS variables
- `src/App.tsx` - Wrap with ThemeProvider

**Components to Update:**
- `src/components/TopHeader.tsx` - Add theme toggle button
- `src/components/Sidebar.tsx` - Apply theme classes
- All page components - Apply theme classes

---

## ⚡ THE ELECTRIC FENCE (Strict "DO NOT TOUCH" Constraints)

**DO NOT:**
- Break existing Clinical Sci-Fi theme
- Remove current color scheme
- Change component structure
- Affect functionality

**MUST:**
- Preserve both themes (toggle between them)
- Maintain accessibility (WCAG 2.1 AA)
- Support keyboard shortcuts (Cmd+Shift+D for "Dark")
- Persist theme preference in localStorage
- Provide smooth transitions between themes

---

## 📋 TECHNICAL SPECIFICATION

### Design Philosophy: "Night-Vision Cockpit"

**Aesthetic:** Submarine control room, astronomy app, tactical watch - NOT a doctor's office.

**Core Principles:**
1. **OLED Black** (#000000) - True black for OLED screens, reduces eye strain
2. **Amber/Red Text** - Preserves night vision (like submarine/astronomy apps)
3. **Large Touch Targets** - 80px minimum for impaired motor skills
4. **No Audio** - Haptic feedback only
5. **Minimal Distractions** - Remove unnecessary UI elements

---

### CSS Variables

**File:** `src/index.css`

```css
/* ============================================
   COCKPIT MODE THEME
   ============================================ */

[data-theme="cockpit"] {
  /* BACKGROUNDS */
  --background-dark: #000000;           /* True OLED black */
  --background-card: #0a0a0a;           /* Slightly lighter for cards */
  --background-elevated: #1a1a1a;       /* Elevated elements */
  --background-input: #0f0f0f;          /* Input fields */
  
  /* TEXT COLORS (Amber/Red for night vision) */
  --text-primary: #FFB300;              /* Amber - primary text */
  --text-secondary: #FF8F00;            /* Dark amber - secondary text */
  --text-muted: #FF6F00;                /* Orange - muted text */
  --text-danger: #FF5252;               /* Red - warnings/errors */
  --text-success: #00E676;              /* Green - success (sparingly) */
  
  /* BORDERS */
  --border-color: #333333;              /* Dark grey borders */
  --border-color-light: #1a1a1a;        /* Subtle borders */
  
  /* PRIMARY ACCENT (Keep for important actions) */
  --primary: #FF8F00;                   /* Dark amber */
  --primary-hover: #FFB300;             /* Lighter amber on hover */
  --primary-active: #FF6F00;            /* Darker amber when active */
  
  /* GLASSMORPHISM (Adjusted for dark theme) */
  --glass-bg: rgba(10, 10, 10, 0.6);
  --glass-border: rgba(255, 179, 0, 0.1);
  --glass-blur: blur(12px);
  
  /* SHADOWS (Minimal in dark theme) */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.5);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.5);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.5);
  
  /* STATUS COLORS (Adjusted for dark background) */
  --status-safe: #00E676;               /* Green */
  --status-caution: #FFD600;            /* Yellow */
  --status-warning: #FF9100;            /* Orange */
  --status-danger: #FF5252;             /* Red */
}

/* ============================================
   COCKPIT MODE OVERRIDES
   ============================================ */

[data-theme="cockpit"] body {
  background-color: #000000;
  color: #FFB300;
}

[data-theme="cockpit"] .bg-background-dark {
  background-color: #000000 !important;
}

[data-theme="cockpit"] .text-slate-300,
[data-theme="cockpit"] .text-slate-400,
[data-theme="cockpit"] .text-slate-500 {
  color: #FFB300 !important;
}

[data-theme="cockpit"] .text-white {
  color: #FFB300 !important;
}

[data-theme="cockpit"] .border-slate-800,
[data-theme="cockpit"] .border-slate-700 {
  border-color: #333333 !important;
}

/* BUTTONS - Larger touch targets */
[data-theme="cockpit"] button {
  min-height: 48px; /* Increased from default */
}

[data-theme="cockpit"] button.crisis-button {
  min-height: 80px; /* Extra large for crisis situations */
}

/* INPUTS - Higher contrast */
[data-theme="cockpit"] input,
[data-theme="cockpit"] select,
[data-theme="cockpit"] textarea {
  background-color: #0f0f0f;
  border-color: #333333;
  color: #FFB300;
}

[data-theme="cockpit"] input::placeholder {
  color: #FF6F00;
}

/* CARDS - Subtle elevation */
[data-theme="cockpit"] .card,
[data-theme="cockpit"] .glassmorphism {
  background-color: rgba(10, 10, 10, 0.8);
  border-color: rgba(255, 179, 0, 0.1);
}

/* REMOVE BRIGHT COLORS */
[data-theme="cockpit"] .bg-primary {
  background-color: #FF8F00 !important;
}

[data-theme="cockpit"] .text-primary {
  color: #FFB300 !important;
}

/* SCROLLBARS - Minimal */
[data-theme="cockpit"] ::-webkit-scrollbar-track {
  background: #000000;
}

[data-theme="cockpit"] ::-webkit-scrollbar-thumb {
  background: #333333;
}

[data-theme="cockpit"] ::-webkit-scrollbar-thumb:hover {
  background: #444444;
}
```

---

### Theme Context

**File:** `src/contexts/ThemeContext.tsx`

```typescript
import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'clinical' | 'cockpit';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('clinical');

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('ppn-theme') as Theme;
    if (savedTheme) {
      setThemeState(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('ppn-theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'clinical' ? 'cockpit' : 'clinical';
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
```

---

### Theme Toggle Component

**File:** `src/components/ui/ThemeToggle.tsx`

```typescript
import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="
        flex items-center gap-2 px-4 py-2
        bg-slate-800/50 border border-slate-700
        rounded-xl
        hover:bg-slate-700/50
        transition-all duration-200
      "
      title={`Switch to ${theme === 'clinical' ? 'Cockpit' : 'Clinical'} Mode`}
      aria-label={`Current theme: ${theme}. Click to switch.`}
    >
      {theme === 'clinical' ? (
        <>
          <span className="text-xl">🌙</span>
          <span className="text-sm font-bold text-slate-300">Cockpit Mode</span>
        </>
      ) : (
        <>
          <span className="text-xl">☀️</span>
          <span className="text-sm font-bold">Clinical Mode</span>
        </>
      )}
    </button>
  );
};
```

---

### Keyboard Shortcut

**Add to `src/App.tsx`:**

```typescript
useEffect(() => {
  const handleKeyPress = (e: KeyboardEvent) => {
    // Cmd+Shift+D (Mac) or Ctrl+Shift+D (Windows/Linux)
    if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'D') {
      e.preventDefault();
      toggleTheme();
    }
  };

  window.addEventListener('keydown', handleKeyPress);
  return () => window.removeEventListener('keydown', handleKeyPress);
}, [toggleTheme]);
```

---

## 🎨 UI COMPARISON

### Clinical Sci-Fi Theme (Current)
```
Background: #0e1117 (dark blue-grey)
Text: #cbd5e1 (light slate)
Primary: #3b82f6 (blue)
Borders: #1e293b (slate-800)
Feel: Professional, medical, institutional
```

### Cockpit Mode Theme (New)
```
Background: #000000 (OLED black)
Text: #FFB300 (amber)
Primary: #FF8F00 (dark amber)
Borders: #333333 (dark grey)
Feel: Tactical, low-light, night-vision
```

---

## ✅ ACCEPTANCE CRITERIA

### Functionality
- [ ] Theme toggle button in TopHeader
- [ ] Theme persists in localStorage
- [ ] Keyboard shortcut works (Cmd+Shift+D)
- [ ] Smooth transition between themes (300ms)
- [ ] Theme applies to all pages and components
- [ ] Default theme is Clinical (current)

### Visual Design
- [ ] Cockpit Mode uses OLED black (#000000)
- [ ] Text is amber (#FFB300) for primary content
- [ ] Red (#FF5252) for warnings/errors
- [ ] Minimal use of bright colors
- [ ] Borders are subtle (#333333)
- [ ] No white backgrounds in Cockpit Mode

### Accessibility
- [ ] Sufficient color contrast (WCAG 2.1 AA)
- [ ] Minimum 12px fonts maintained
- [ ] Keyboard navigation works
- [ ] Screen reader announces theme changes
- [ ] Focus states visible in both themes

### Performance
- [ ] No layout shift when switching themes
- [ ] Smooth transitions (no flashing)
- [ ] Theme loads instantly from localStorage
- [ ] No performance impact

---

## 📝 MANDATORY COMPLIANCE

### ACCESSIBILITY (WCAG 2.1 AA)
- Minimum 12px fonts (both themes)
- Keyboard accessible
- Screen reader friendly
- Color contrast compliant
- Focus states visible

### USABILITY
- Theme preference persists across sessions
- Clear visual feedback when switching
- No disruption to workflow
- Keyboard shortcut documented in Help

---

## 🚦 Status

**INBOX** - Awaiting LEAD architectural review and assignment

---

## 📖 NOTES

**Strategic Importance:**
This is a **critical usability feature** for grey market practitioners. The current Clinical Sci-Fi theme is beautiful but **unusable** in low-light ceremony environments. Without Cockpit Mode, grey market practitioners cannot use the app during sessions.

**Implementation Priority:**
1. CSS variables (foundation)
2. Theme context (state management)
3. Theme toggle component (user control)
4. Keyboard shortcut (power user feature)
5. Apply to all components (comprehensive)

**Future Enhancements:**
- Auto-switch based on time of day
- Brightness slider for fine-tuning
- Custom color schemes (user-defined)
- "Flip-to-dim" gesture (phone face-down = screen off)
- Haptic feedback on theme switch

---

## Dependencies

**Prerequisites:**
- None - This is a standalone feature

**Related Features:**
- Crisis Logger (benefits from Cockpit Mode)
- Potency Normalizer (benefits from Cockpit Mode)
- All session-related components

---

## Estimated Timeline

- **CSS variables:** 2-3 hours
- **Theme context:** 2 hours
- **Theme toggle component:** 1-2 hours
- **Keyboard shortcut:** 1 hour
- **Apply to all components:** 3-4 hours
- **Testing:** 2 hours

**Total:** 11-14 hours (1-2 days)

---

## 🎨 DESIGN MOCKUP

### TopHeader with Theme Toggle

```
┌─────────────────────────────────────────────────┐
│  🧬 PPN Research Portal    [🌙 Cockpit Mode]  👤│
└─────────────────────────────────────────────────┘
```

### Cockpit Mode Example (Crisis Logger)

```
┌─────────────────────────────────────────────────┐
│  🚨 CRISIS LOGGER                               │
│  ───────────────────────────────────────────    │
│  (OLED Black background, Amber text)            │
│                                                 │
│  ┌─────────────────┐  ┌─────────────────┐     │
│  │ 🟢 VITALS OK    │  │ 🟡 VITALS HIGH  │     │
│  │ (80px height)   │  │ (80px height)   │     │
│  └─────────────────┘  └─────────────────┘     │
│                                                 │
│  (Large touch targets, high contrast)           │
└─────────────────────────────────────────────────┘
```

---

**INSPECTOR STATUS:** ✅ Work order created. Awaiting LEAD triage.

---

## 🏗️ LEAD ARCHITECTURE

### Strategic Context

This ticket is **3 of 4** in the "Grey Market Phantom Shield" initiative. See master architecture: `.agent/handoffs/GREY_MARKET_PHANTOM_SHIELD_ARCHITECTURE.md`

**Why This Matters:**
From research: "Standard 'Clinical White' SaaS design is actively dangerous for grey market practitioners. They operate in low-light environments with dilated pupils."

**Without Cockpit Mode, the app is unusable during ceremonies.**

### Routing Decision: MARKETER FIRST

**Phase 1: Strategy & Messaging (MARKETER)** ← **CURRENT PHASE**

**MARKETER must define:**

1. **Value Proposition**
   - Target: Practitioners in low-light ceremony environments
   - Pain: "Bright screens cause glare shock for dilated pupils"
   - Solution: OLED black theme with amber text (night vision)
   - Metric: "Usable in 100% dark environments"

2. **Messaging Framework**
   - Hero: "Built for the Dark"
   - Supporting: "Low-light UI designed for ceremony environments"
   - CTA: "Enable Cockpit Mode"
   - Objections: "I like the current theme" → "Toggle anytime with Cmd+Shift+D"

3. **Design Philosophy**
   - Aesthetic: "Submarine control room, not doctor's office"
   - Colors: OLED black + amber/red (preserves night vision)
   - Interactions: Large touch targets for impaired motor skills

### MARKETER Deliverables

Create in this ticket under `## MARKETER DELIVERABLES`:
- [ ] Value Proposition Document
- [ ] Messaging Framework
- [ ] Design Philosophy Statement
- [ ] Conversion Strategy (when to prompt theme switch)

**When complete:** Move to `04_QA` for LEAD review, then route to DESIGNER.

**Estimated Time:** 1 day

---

**LEAD STATUS:** ✅ Routed to MARKETER for Phase 1. See `.agent/handoffs/GREY_MARKET_PHANTOM_SHIELD_ARCHITECTURE.md`.
