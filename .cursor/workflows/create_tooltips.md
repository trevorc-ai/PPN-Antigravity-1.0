---
description: How to create and implement tooltips using AdvancedTooltip
---

# Skill: Creating Tooltips

This skill provides step-by-step instructions for implementing tooltips in the PPN Research Portal using the `AdvancedTooltip` component.

---

## 📋 Prerequisites

- The `AdvancedTooltip` component exists at `src/components/ui/AdvancedTooltip.tsx`
- The `Info` icon from `lucide-react` is available
- You understand the three tooltip tiers: `micro`, `standard`, and `guide`

---

## 🎯 When to Use Each Tooltip Tier

### **Tier 1: Micro** (Simple label)
- **Use for:** Quick labels, single-word definitions
- **Delay:** 200ms
- **Example:** Button labels, icon meanings

### **Tier 2: Standard** (Hover/Focus, rich content)
- **Use for:** Short explanations (1-3 sentences)
- **Delay:** 500ms (default)
- **Example:** Field descriptions, feature explanations

### **Tier 3: Guide** (Click-to-open, comprehensive)
- **Use for:** Detailed documentation, multi-section content
- **Interaction:** Click to open, click X to close
- **Example:** Complex feature guides, multi-option definitions

---

## 🔧 Implementation Steps

### **Step 1: Import Dependencies**

Add these imports to your component file:

```tsx
import { AdvancedTooltip } from '../components/ui/AdvancedTooltip';
import { Info } from 'lucide-react';
```

### **Step 2: Choose Tooltip Tier and Position**

Determine the appropriate tier and side based on:

| Side | Use Case |
|------|----------|
| `top` | Default, mid-page elements |
| `bottom` | Headers, top-of-container elements |
| `left` | Right-aligned elements |
| `right` | Left-aligned elements |

### **Step 3: Implement Tooltip**

#### **For Tier 1 (Micro):**

```tsx
<AdvancedTooltip
  tier="micro"
  content="Quick label"
  side="top"
>
  <Info size={14} className="text-slate-500 hover:text-primary cursor-help" />
</AdvancedTooltip>
```

#### **For Tier 2 (Standard):**

```tsx
<AdvancedTooltip
  content="Short explanation of this feature or field."
  side="top"
  width="w-64"
>
  <Info size={16} className="text-slate-600 hover:text-white transition-colors cursor-help" />
</AdvancedTooltip>
```

#### **For Tier 3 (Guide):**

```tsx
<AdvancedTooltip
  tier="guide"
  type="clinical"
  side="bottom"
  title="Feature Name"
  width="w-[480px]"
  content={
    <div className="space-y-4">
      <p className="text-slate-300 leading-relaxed">
        Overview paragraph explaining the feature.
      </p>
      <div className="space-y-3 border-t border-slate-700/50 pt-4">
        <div>
          <h5 className="text-xs font-black text-emerald-400 uppercase tracking-wider mb-1">
            Section Title
          </h5>
          <p className="text-xs text-slate-400 leading-relaxed">
            Section description.
          </p>
        </div>
      </div>
    </div>
  }
>
  <Info size={14} className="text-slate-500 hover:text-emerald-400 cursor-help transition-colors" />
</AdvancedTooltip>
```

---

## 🎨 Styling Guidelines

### **Icon Styling**

Always use these classes for consistency:

```tsx
// Standard tooltip icon
className="text-slate-600 hover:text-white transition-colors cursor-help"

// Clinical/medical context (emerald)
className="text-slate-500 hover:text-emerald-400 cursor-help transition-colors"

// Warning context (amber)
className="text-slate-500 hover:text-amber-400 cursor-help transition-colors"

// Critical context (red)
className="text-slate-500 hover:text-red-400 cursor-help transition-colors"
```

### **Print Behavior**

Always hide tooltips in print mode:

```tsx
<Info className="text-slate-600 hover:text-white cursor-help print:hidden" size={16} />
```

---

## 📍 Positioning Best Practices

### **Avoid Container Overflow**

If tooltip is in a container with:
- `overflow-hidden`
- `overflow-clip`
- `rounded-[2.5rem]` (large border radius)

**Solution:** Use `side="bottom"` or ensure parent allows overflow.

### **Common Patterns**

```tsx
// Header tooltips (near top of container)
<AdvancedTooltip side="bottom" content="...">

// Mid-section tooltips
<AdvancedTooltip side="top" content="...">

// Right sidebar tooltips
<AdvancedTooltip side="left" content="...">
```

---

## 🎯 Type-Specific Styling

The `type` prop controls the color scheme:

| Type | Color | Use Case |
|------|-------|----------|
| `info` | Blue | General information |
| `clinical` | Emerald | Medical/clinical context |
| `warning` | Amber | Cautions, important notes |
| `critical` | Red | Safety warnings, errors |
| `science` | Purple | Scientific/technical info |
| `success` | Green | Confirmations, positive feedback |

---

## ✅ Checklist

Before implementing a tooltip, verify:

- [ ] Imported `AdvancedTooltip` and `Info` icon
- [ ] Chose appropriate tier (micro/standard/guide)
- [ ] Set correct `side` based on position
- [ ] Applied consistent icon styling
- [ ] Added `print:hidden` class
- [ ] Tested tooltip visibility (not cut off by overflow)
- [ ] Verified keyboard accessibility (Tab, Enter, Escape)
- [ ] Checked color contrast for colorblind users

---

## 🚫 Common Mistakes to Avoid

1. **Don't use raw `title` attributes** - Use AdvancedTooltip instead
2. **Don't forget `side` prop** - Defaults to `top`, may be cut off
3. **Don't use color-only meaning** - Always pair with text/icons
4. **Don't make tooltips too wide** - Max 480px for readability
5. **Don't nest tooltips** - One tooltip per trigger element

---

## 📚 Examples from Codebase

### **Example 1: Simple Field Tooltip**

```tsx
// From ProtocolDetail.tsx, line 379
<AdvancedTooltip content="Core pharmacological and identity parameters of the recorded intervention.">
  <Info className="text-slate-600 hover:text-primary transition-colors cursor-help print:hidden" size={14} />
</AdvancedTooltip>
```

### **Example 2: Header Tooltip (Bottom-Positioned)**

```tsx
// From ProtocolDetail.tsx, line 418
<AdvancedTooltip 
  content="Real-time monitoring of concomitant medications and adverse events."
  side="bottom"
>
  <Info className="text-slate-600 hover:text-white transition-colors cursor-help print:hidden" size={14} />
</AdvancedTooltip>
```

### **Example 3: Guide Tier with Rich Content**

```tsx
// From ProtocolBuilder.tsx, line 1036
<AdvancedTooltip
  tier="guide"
  type="clinical"
  side="bottom"
  title="Therapeutic Modalities"
  width="w-[480px]"
  content={
    <div className="space-y-4">
      <p className="text-slate-300 leading-relaxed">
        Select all therapeutic frameworks used to support the psychedelic session.
      </p>
      <div className="space-y-3 border-t border-slate-700/50 pt-4">
        <div>
          <h5 className="text-xs font-black text-emerald-400 uppercase tracking-wider mb-1">
            CBT (Cognitive Behavioral Therapy)
          </h5>
          <p className="text-xs text-slate-400 leading-relaxed">
            Structured approach focusing on identifying and changing negative thought patterns.
          </p>
        </div>
        {/* More sections... */}
      </div>
    </div>
  }
>
  <Info size={14} className="text-slate-500 hover:text-emerald-400 cursor-help transition-colors mb-1.5" />
</AdvancedTooltip>
```

---

## 🔍 Testing Checklist

After implementing a tooltip:

1. **Visual Test:**
   - [ ] Tooltip appears on hover
   - [ ] Tooltip is not cut off by container
   - [ ] Arrow points to trigger element
   - [ ] Content is readable

2. **Keyboard Test:**
   - [ ] Tab focuses the trigger
   - [ ] Enter/Space opens guide tooltips
   - [ ] Escape closes tooltips

3. **Accessibility Test:**
   - [ ] Icon has `cursor-help` class
   - [ ] Tooltip has sufficient contrast
   - [ ] Content is not color-dependent

4. **Print Test:**
   - [ ] Tooltip icon hidden in print mode
   - [ ] Print layout not affected

---

## 📖 Reference

- **Component:** `src/components/ui/AdvancedTooltip.tsx`
- **Audit Report:** `TOOLTIP_AUDIT_REPORT.md`
- **Examples:** `ProtocolDetail.tsx`, `ProtocolBuilder.tsx`

---

**Skill Version:** 1.0  
**Last Updated:** 2026-02-10  
**Maintainer:** Builder Agent
