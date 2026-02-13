# 🚨 CRITICAL: Protocol Builder Mobile Optimization

**Priority:** P0 - BLOCKING LAUNCH  
**Assigned To:** DESIGNER  
**Date:** 2026-02-12 04:15 PST  
**Estimated Effort:** 2-3 hours  
**Status:** 🔴 CRITICAL - MOBILE BROKEN

---

## 📱 **MOBILE TESTING RESULTS**

### **Test Environment:**
- **Device:** iPhone 14 Pro (393x852px)
- **Browser:** Chrome/Safari mobile viewport
- **URL:** http://localhost:3000/#/builder

### **Critical Issues Found:**

#### **🔴 ISSUE 1: ButtonGroups Overflow on Mobile**
**Severity:** CRITICAL  
**Impact:** Buttons are cut off, unusable on mobile

**Current Behavior:**
- Biological Sex buttons (Male, Female, Intersex, Unknown) display side-by-side
- "Unknown" button is clipped/pushed off-screen
- Horizontal overflow on 393px viewport

**Measured Dimensions:**
```javascript
{
  "Male": { height: 42px, width: ~90px },
  "Female": { height: 42px, width: ~90px },
  "Intersex": { height: 42px, width: ~90px },
  "Unknown": { height: 42px, width: ~90px }
}
// Total width: ~360px + gaps = OVERFLOW on 393px screen
```

**Root Cause:**
```tsx
// Current: flex gap-2 (always horizontal)
<div className="flex gap-2">
  {options.map((option) => (
    <button className="flex-1 px-4 py-2...">
```

**Required Fix:**
```tsx
// Mobile-first: Stack vertically on small screens
<div className="flex flex-col sm:flex-row gap-2">
  {options.map((option) => (
    <button className="w-full sm:flex-1 px-4 py-2...">
```

---

#### **🔴 ISSUE 2: Smoking Status ButtonGroup Layout Break**
**Severity:** CRITICAL  
**Impact:** Horizontal scroll, broken UX

**Current Behavior:**
- 4 buttons: "Current Smoker (Daily)", "Current Smoker (Occasional)", "Former Smoker", "Non-Smoker"
- Mixed wrapping causes horizontal overflow of 433px on 393px screen
- Not forming clean 2x2 grid

**Required Fix:**
- Force 2x2 grid on mobile OR
- Stack all 4 buttons vertically

---

#### **🟡 ISSUE 3: Accordion Auto-Open Fails on Mobile**
**Severity:** HIGH  
**Impact:** Extra tap required, violates Phase 1 spec

**Current Behavior:**
- "Patient Demographics" accordion is CLOSED by default on mobile
- Requires manual tap to open

**Expected Behavior:**
- Should auto-open on ALL viewports (per Phase 1 spec line 469)

**Current Code:**
```tsx
const [activeSection, setActiveSection] = useState<string>('demographics');
```

**Diagnosis:**
- State is set correctly
- Likely CSS issue with accordion animation on mobile
- May need to check `isOpen` prop rendering

---

#### **🟡 ISSUE 4: Touch Targets Below Minimum**
**Severity:** MEDIUM  
**Impact:** Accessibility violation (WCAG 2.1 AA)

**Measured:**
- Button height: 42px
- **Required:** 44px minimum (iOS/Android standard)

**Fix:**
```tsx
// Change from py-2 (8px) to py-3 (12px)
className="flex-1 px-4 py-3 rounded-lg..."
// This gives: 16px (text) + 24px (padding) = 40px + border = 44px
```

---

#### **🟡 ISSUE 5: Modal Not Full-Screen on Mobile**
**Severity:** MEDIUM  
**Impact:** Wasted screen real estate

**Current Behavior:**
- Modal has significant margins/padding on mobile
- Restricts available space for form fields

**Required Fix:**
```tsx
// Current
className="rounded-none sm:rounded-[2.5rem]"

// Should also apply to width
className="w-full sm:max-w-5xl rounded-none sm:rounded-[2.5rem]"
```

---

## 🎯 **REQUIRED CHANGES**

### **File:** `/src/components/forms/ButtonGroup.tsx`

**Change 1: Make ButtonGroup Responsive**
```tsx
// Line 31: Change flex container
<div className="flex flex-col sm:flex-row gap-2">
  {options.map((option) => (
    <button
      key={option.value}
      type="button"
      onClick={() => onChange(option.value)}
      className={`
        w-full sm:flex-1 px-4 py-3 rounded-lg border transition-all duration-200
        ${value === option.value
          ? 'bg-indigo-500 border-indigo-500 text-white font-semibold'
          : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700 hover:border-indigo-500 hover:text-slate-200'
        }
      `}
    >
      {option.label}
    </button>
  ))}
</div>
```

**Changes Made:**
1. `flex` → `flex flex-col sm:flex-row` (stack on mobile, row on desktop)
2. `flex-1` → `w-full sm:flex-1` (full width on mobile, flex on desktop)
3. `py-2` → `py-3` (increase touch target to 44px)

---

### **File:** `/src/pages/ProtocolBuilder.tsx`

**Change 2: Ensure Modal is Full-Width on Mobile**
```tsx
// Line 1036: Update modal container classes
className="w-full max-w-full sm:max-w-5xl bg-[#0f172a] border border-white/10 rounded-none sm:rounded-[2.5rem] min-h-screen sm:min-h-0 h-full sm:h-auto max-h-screen sm:max-h-[90vh] shadow-[0_0_50px_-12px_rgba(43,116,243,0.5)] ring-2 ring-primary/40 overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col"
```

**Change 3: Verify Accordion Auto-Open**
```tsx
// Line 469: Already correct, but verify rendering
const [activeSection, setActiveSection] = useState<string>('demographics');

// Line 1100: Verify isOpen prop
isOpen={activeSection === 'demographics'}
```

---

## 📋 **TESTING CHECKLIST**

After implementing fixes, test on mobile viewport (393x852):

### **ButtonGroup Component:**
- [ ] Biological Sex buttons stack vertically on mobile
- [ ] All 4 buttons visible without horizontal scroll
- [ ] Buttons are full-width on mobile
- [ ] Touch targets are 44px minimum height
- [ ] Buttons switch to horizontal layout on tablet (640px+)

### **Smoking Status ButtonGroup:**
- [ ] All 4 buttons stack vertically on mobile
- [ ] No horizontal overflow
- [ ] Clean, readable layout

### **Modal Layout:**
- [ ] Modal is full-width on mobile (minus minimal padding)
- [ ] No wasted screen space
- [ ] Rounded corners only on desktop

### **Accordion Behavior:**
- [ ] "Patient Demographics" auto-opens on mobile
- [ ] No extra tap required
- [ ] Content is immediately visible

### **Overall Mobile UX:**
- [ ] No horizontal scrolling anywhere
- [ ] All text is readable (16px minimum)
- [ ] All touch targets are 44px minimum
- [ ] Form is usable with one hand
- [ ] Smooth scrolling within modal

---

## 🎨 **EXPECTED MOBILE LAYOUT**

### **Before (Current - BROKEN):**
```
┌─────────────────────────┐
│ [Male] [Female] [Inters │ ← Overflow!
└─────────────────────────┘
```

### **After (Fixed):**
```
┌─────────────────────────┐
│ ┌─────────────────────┐ │
│ │       Male          │ │
│ └─────────────────────┘ │
│ ┌─────────────────────┐ │
│ │      Female         │ │
│ └─────────────────────┘ │
│ ┌─────────────────────┐ │
│ │     Intersex        │ │
│ └─────────────────────┘ │
│ ┌─────────────────────┐ │
│ │      Unknown        │ │
│ └─────────────────────┘ │
└─────────────────────────┘
```

---

## ⚡ **IMPLEMENTATION PRIORITY**

**Immediate (Today):**
1. Fix ButtonGroup responsive layout (Issue #1, #2)
2. Increase touch targets to 44px (Issue #4)

**High Priority (Tomorrow):**
3. Fix accordion auto-open on mobile (Issue #3)
4. Make modal full-width on mobile (Issue #5)

---

## 📊 **ACCEPTANCE CRITERIA**

- [ ] All ButtonGroups stack vertically on mobile (<640px)
- [ ] No horizontal scrolling on any mobile viewport
- [ ] All touch targets meet 44px minimum
- [ ] Patient Demographics accordion auto-opens on mobile
- [ ] Modal uses full screen width on mobile
- [ ] Tested on iPhone 14 Pro (393x852)
- [ ] Tested on iPhone SE (375x667)
- [ ] Tested on Android (360x800)

---

## 🚫 **WHAT NOT TO CHANGE**

- ❌ Do NOT change desktop layout (works perfectly)
- ❌ Do NOT change button colors or styling
- ❌ Do NOT change form logic or data handling
- ❌ Do NOT change accordion animation timing
- ❌ Do NOT add new features

**ONLY fix mobile responsive layout issues.**

---

**Task Created:** 2026-02-12 04:15 PST  
**Blocking:** Production launch, mobile users  
**Next Step:** DESIGNER implements fixes, tests on mobile viewport
