# PPN Research Portal - Style Guide

## Color Palette

### Primary Colors
| Color Name | Hex Code | Usage |
|------------|----------|-------|
| **Primary Blue** | `#2b74f3` | Primary actions, links, highlights, focus states |
| **Clinical Green** | `#53d22d` | Success states, online indicators, positive metrics |
| **Accent Amber** | `#fbbf24` | Warnings, highlights, special callouts |

### Background Colors
| Color Name | Hex Code | Usage |
|------------|----------|-------|
| **Deep Black** | `#020408` | Footer, deepest backgrounds |
| **Dark Base** | `#05070a` | Primary page backgrounds |
| **Dark Elevated** | `#06090F` | Slightly elevated surfaces |
| **Card Dark** | `#080a0f` | Card backgrounds, elevated sections |
| **Card Medium** | `#0a0c10` | Secondary card backgrounds |
| **Card Light** | `#0d1117` | Lighter card backgrounds, borders |
| **Modal Background** | `#0f172a` | Modal dialogs, overlays |
| **Elevated Surface** | `#0f1218` | Solid card backgrounds |
| **Glass Surface** | `#111418` | Glassmorphism cards (with 60% opacity) |
| **Secondary Surface** | `#0D121C` | Input fields, secondary surfaces |
| **Tertiary Surface** | `#1A2233` | Buttons, interactive elements |

### Gradient Backgrounds
| Gradient Name | CSS Value | Usage |
|---------------|-----------|-------|
| **Hero Gradient** | `from-[#0a1628] via-[#0d1b2a] to-[#05070a]` | Landing page hero sections |

### Text Colors
| Color Name | Hex Code | Usage |
|------------|----------|-------|
| **White** | `#ffffff` | Primary headings, high-emphasis text |
| **Off-White** | `#F5F5F0` | Body text (from body tag) |
| **Light Gray** | `#e2e8f0` | Secondary text |
| **Slate 100** | `#f1f5f9` | Light text on dark backgrounds |
| **Slate 200** | `#e2e8f0` | Muted text |
| **Slate 300** | `#cbd5e1` | Body text |
| **Slate 400** | `#94a3b8` | Tertiary text |
| **Slate 500** | `#64748b` | Placeholder text, disabled states |
| **Slate 600** | `#475569` | Subtle text, labels |
| **Slate 700** | `#334155` | Very subtle text |

### Border Colors
| Color Name | CSS Value | Usage |
|------------|-----------|-------|
| **Subtle Border** | `border-white/5` | Very subtle dividers |
| **Light Border** | `border-white/8` | Light borders on glass elements |
| **Standard Border** | `border-white/10` | Standard borders |
| **Slate Border** | `border-slate-800` | Primary border color |
| **Slate Border Subtle** | `border-slate-800/40` | Subtle slate borders |
| **Slate Border Medium** | `border-slate-800/60` | Medium opacity slate borders |
| **Slate Border Strong** | `border-slate-800/80` | Strong slate borders |
| **Slate 700 Border** | `border-slate-700` | Secondary borders |

### Status Colors
| Status | Hex Code | Shadow | Usage |
|--------|----------|--------|-------|
| **Success/Authorized** | `#10b981` (emerald-500) | `shadow-[0_0_10px_#10b981]` | Success states, authorized actions |
| **Error/Alert** | `#f43f5e` (rose-500) | `shadow-[0_0_10px_#f43f5e]` | Error states, alerts |
| **Info** | `#2b74f3` (primary) | `shadow-[0_0_10px_#2b74f3]` | Info states, general highlights |
| **Clinical Green** | `#53d22d` | `shadow-[0_0_8px_#53d22d]` | Clinical metrics, online status |

### Gradient Utilities

#### Text Gradients
```css
/* Primary Blue Gradient */
.text-gradient-primary {
  background: linear-gradient(90deg, #2b74f3 0%, #60a5fa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: #2b74f3; /* Fallback */
}

/* Purple-Pink Gradient */
.text-gradient-purple {
  background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: #a855f7; /* Fallback */
}

/* Cyan Gradient */
.text-gradient-cyan {
  background: linear-gradient(90deg, #06b6d4 0%, #22d3ee 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: #06b6d4; /* Fallback */
}
```

#### Data Visualization Gradients
```css
/* Viridis Gradient (Colorblind-friendly) */
.viridis-gradient {
  background: linear-gradient(90deg, #440154 0%, #3b528b 25%, #21918c 50%, #5ec962 75%, #fde725 100%);
}

/* Cividis Gradient (Colorblind-friendly) */
.cividis-gradient {
  background: linear-gradient(90deg, #00204d 0%, #414d6b 33%, #7d7c78 66%, #ffea46 100%);
}
```

## Typography

### Font Families
- **Primary**: System font stack (default sans-serif)
- **Monospace**: Used for code, version numbers, technical data

### Font Sizes
| Size Class | Pixel Size | Usage |
|------------|------------|-------|
| `text-[11px]` | 11px | **MINIMUM SIZE** - Small labels, badges, metadata, uppercase tracking text |
| `text-[12px]` | 12px | Secondary labels, small body text |
| `text-[13px]` | 13px | Body text, descriptions |
| `text-sm` | 14px | Standard body text |
| `text-base` | 16px | Default body text, buttons |
| `text-lg` | 18px | Large body text |
| `text-xl` | 20px | Small headings |
| `text-2xl` | 24px | Section headings |
| `text-3xl` | 30px | Card titles |
| `text-4xl` | 36px | Page section titles |
| `text-5xl` | 48px | Page headings |
| `text-6xl` | 60px | Hero headings |
| `text-7xl` | 72px | Large hero headings |

**CRITICAL**: No fonts should be smaller than 11px (including tooltips, chart legends, etc.)

### Font Weights
| Weight Class | Value | Usage |
|--------------|-------|-------|
| `font-medium` | 500 | Body text, descriptions |
| `font-bold` | 700 | Emphasis, labels |
| `font-black` | 900 | **PRIMARY WEIGHT** - Headings, labels, buttons, important text |

### Letter Spacing
| Spacing Class | Usage |
|---------------|-------|
| `tracking-tight` | Tight spacing for large headings |
| `tracking-tighter` | Very tight spacing for display text |
| `tracking-wide` | Wide spacing for small labels |
| `tracking-widest` | Very wide spacing for uppercase labels |
| `tracking-[0.2em]` | Custom 0.2em spacing |
| `tracking-[0.25em]` | Custom 0.25em spacing |
| `tracking-[0.3em]` | Custom 0.3em spacing |
| `tracking-[0.4em]` | Custom 0.4em spacing |
| `tracking-[0.6em]` | Custom 0.6em spacing |

### Text Styles
- **Uppercase Labels**: `text-[11px] font-black uppercase tracking-[0.4em]`
- **Card Titles**: `text-3xl font-black tracking-tighter`
- **Page Headings**: `text-5xl font-black tracking-tighter`
- **Body Text**: `text-[13px] text-slate-500 leading-relaxed`
- **Monospace Technical**: `text-[11px] font-mono font-black tracking-tighter`

## Spacing & Layout

### Border Radius
| Radius Class | Usage |
|--------------|-------|
| `rounded-lg` | Small elements (8px) |
| `rounded-xl` | Medium elements (12px) |
| `rounded-2xl` | Large elements (16px) |
| `rounded-3xl` | Extra large elements (24px) |
| `rounded-[1.5rem]` | Cards (24px) |
| `rounded-[2rem]` | Large cards (32px) |
| `rounded-[2.5rem]` | Modals, large containers (40px) |
| `rounded-[3rem]` | Extra large containers (48px) |
| `rounded-full` | Circular elements |

### Padding
- **Page Container**: `p-6 sm:p-10 lg:p-12`
- **Card Padding**: `p-8` or `p-6`
- **Button Padding**: `px-8 py-3` (large), `px-3 py-1` (small)
- **Input Padding**: `px-4 py-4`

### Gaps
- **Small Gap**: `gap-2` (8px)
- **Medium Gap**: `gap-4` (16px)
- **Large Gap**: `gap-8` (32px)
- **Extra Large Gap**: `gap-12` (48px)

## Effects & Interactions

### Shadows
```css
/* Standard Shadow */
shadow-xl

/* Glow Shadows */
shadow-[0_0_8px_#2b74f3]    /* Primary glow */
shadow-[0_0_8px_#53d22d]    /* Clinical green glow */
shadow-[0_0_10px_#10b981]   /* Success glow */
shadow-[0_0_10px_#f43f5e]   /* Error glow */
shadow-[0_0_20px_rgba(43,116,243,0.3)]  /* Primary soft glow */

/* Modal Shadow */
shadow-[0_0_50px_-12px_rgba(43,116,243,0.5)]

/* Inset Shadow */
shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]
```

### Glassmorphism
```css
.card-glass {
  background: rgba(13, 17, 23, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.card-solid {
  background: #0f1218;
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

### Transitions
- **Standard**: `transition-all duration-300`
- **Slow**: `transition-all duration-700`
- **Transform**: `transition-transform duration-1000`
- **Colors**: `transition-colors`

### Hover States
- **Scale Up**: `hover:scale-105` or `group-hover:scale-110`
- **Color Change**: `hover:text-primary`, `hover:border-primary/40`
- **Background**: `hover:bg-blue-600`

### Animations
```css
/* Twinkle Animation */
@keyframes twinkle {
  0%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
}

.animate-twinkle {
  animation: twinkle 3s ease-in-out infinite;
}

/* Built-in Animations */
animate-pulse          /* Pulsing effect */
animate-ping          /* Ping effect for indicators */
animate-in fade-in    /* Fade in on mount */
```

## Accessibility

### Focus States (WCAG 2.4.7 Compliant)
```css
/* Standard Focus */
:focus-visible {
  outline: 3px solid #2b74f3;
  outline-offset: 3px;
  border-radius: 4px;
}

/* Button/Link Focus */
button:focus-visible,
a:focus-visible {
  outline: 3px solid #2b74f3;
  outline-offset: 2px;
  box-shadow: 0 0 0 4px rgba(43, 116, 243, 0.2);
}

/* Form Input Focus */
input:focus-visible,
textarea:focus-visible,
select:focus-visible {
  outline: 2px solid #2b74f3;
  outline-offset: 0px;
  border-color: #2b74f3;
  box-shadow: 0 0 0 3px rgba(43, 116, 243, 0.15);
}

/* Interactive Container Focus */
[role="button"]:focus-visible,
[tabindex]:not([tabindex="-1"]):focus-visible {
  outline: 2px solid #2b74f3;
  outline-offset: 2px;
  box-shadow: 0 0 0 4px rgba(43, 116, 243, 0.15);
}
```

### Scrollbar Styling
```css
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #334155;
  border-radius: 10px;
}
```

## Component Patterns

### Badge Styles
```tsx
/* Schedule Badge */
className="px-3 py-1 text-[11px] font-black uppercase tracking-widest rounded border"

/* Status Badge */
className="px-4 py-1.5 bg-slate-900/80 border border-slate-800 rounded-lg text-[11px] font-mono text-slate-500 font-bold uppercase tracking-widest"
```

### Button Styles
```tsx
/* Primary Button */
className="w-full py-4 bg-primary hover:bg-blue-600 text-white text-xs font-black rounded-xl uppercase tracking-[0.2em] transition-all shadow-xl active:scale-95 border-t border-white/10"

/* Secondary Button */
className="px-8 py-3 rounded-full text-[11px] font-black uppercase tracking-widest transition-all border"

/* Icon Button */
className="size-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 hover:text-primary transition-all cursor-pointer group shadow-lg"
```

### Card Styles
```tsx
/* Standard Card */
className="bg-[#0d1117]/80 border border-slate-800/60 rounded-[1.5rem] overflow-hidden transition-all duration-300 shadow-2xl hover:border-primary/40"

/* Glass Card */
className="bg-[#111418]/60 border border-slate-800 rounded-[3rem] p-8 sm:p-12 shadow-2xl backdrop-blur-xl"

/* Metric Card */
className="bg-[#0d1117] border border-slate-800/60 p-8 rounded-[2rem] shadow-xl space-y-2 relative overflow-hidden group"
```

### Input Styles
```tsx
/* Text Input */
className="w-full bg-[#0D121C] border border-slate-800 rounded-lg py-4 px-4 text-white focus:outline-none focus:border-primary transition-all shadow-xl"

/* Select Dropdown */
className="w-full bg-[#05070a] border border-slate-800 rounded-xl h-12 px-4 text-sm font-black text-white focus:ring-1 focus:ring-accent-amber appearance-none cursor-pointer hover:border-slate-700 transition-all"
```

## Icons
- **Icon Library**: Material Symbols Outlined
- **Icon Class**: `material-symbols-outlined`
- **Common Sizes**: `text-xl` (20px), `text-3xl` (30px), `text-4xl` (36px)

## Grid Layouts
```tsx
/* Responsive Card Grid */
className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"

/* Two Column Grid */
className="grid grid-cols-2 gap-5"

/* Four Column Footer */
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16"
```

## Max Widths
- **Wide Container**: `max-w-[1600px]`
- **Standard Container**: `max-w-7xl`
- **Modal**: `max-w-5xl`
- **Text Content**: `max-w-xs` (descriptions)

## Design Principles
1. **High Contrast**: Dark backgrounds with bright white headings
2. **Bold Typography**: Heavy use of `font-black` (900 weight)
3. **Generous Spacing**: Large padding and gaps for breathing room
4. **Rounded Corners**: Extensive use of large border radius (2rem+)
5. **Subtle Borders**: Low opacity borders for depth
6. **Glow Effects**: Box shadows with color for emphasis
7. **Glassmorphism**: Backdrop blur with semi-transparent backgrounds
8. **Colorblind-Friendly**: Never rely on color alone; always include text labels or icons
9. **Minimum Font Size**: 11px minimum for all text (including tooltips, legends)
10. **Accessibility First**: Strong focus states, semantic HTML, proper contrast ratios
