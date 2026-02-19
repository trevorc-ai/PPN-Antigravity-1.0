---
id: WO-076
status: 03_BUILD
priority: P3 (Normal)
category: Feature
owner: BUILDER
failure_count: 0
---

# Keyboard Shortcuts & Micro-Interactions

## User Request
Add keyboard shortcuts for power users and micro-interactions (animations, haptic feedback) to make forms feel polished and delightful.

## LEAD ARCHITECTURE

### Technical Strategy
Implement global keyboard shortcuts for common actions and add subtle animations/haptic feedback to improve perceived performance and user satisfaction.

### Files to Touch
- `src/hooks/useKeyboardShortcuts.ts` (NEW)
- `src/utils/haptics.ts` (NEW)
- `src/components/animations/MicroInteractions.tsx` (NEW)
- `src/styles/animations.css` (NEW)

### Constraints
- Shortcuts must not conflict with browser defaults
- Animations must be subtle (< 300ms)
- Haptic feedback only on mobile/tablet
- Must be accessible (can disable animations)

## Proposed Changes

### Feature 1: Global Keyboard Shortcuts

**Shortcuts:**
- `Cmd/Ctrl + S` - Save current form
- `Cmd/Ctrl + Enter` - Submit form
- `Cmd/Ctrl + K` - Open quick actions menu
- `Esc` - Close modal/bottom sheet
- `Tab` - Next field
- `Shift + Tab` - Previous field
- `Alt + 1-5` - Jump to wizard step 1-5

**Implementation:**
```typescript
useKeyboardShortcuts({
  'cmd+s': handleSave,
  'cmd+enter': handleSubmit,
  'cmd+k': openQuickActions,
  'escape': closeModal
});
```

**UI Indicator:**
```
[Submit] Cmd+Enter
[Save] Cmd+S
```

---

### Feature 2: Micro-Interactions

#### **Button Press Animation**
```css
button:active {
  transform: scale(0.95);
  transition: transform 100ms ease-out;
}
```

#### **Form Submit Animation**
```
[Submit button pressed]
  ↓
[Button shows loading spinner]
  ↓
[Checkmark animation appears]
  ↓
[Success message fades in]
```

#### **Star Rating Animation**
```
[Tap star]
  ↓
[Star fills with smooth animation (200ms)]
  ↓
[Haptic feedback (mobile)]
  ↓
[Subtle bounce effect]
```

#### **Progress Bar Transition**
```
[Step 2 → Step 3]
  ↓
[Progress dots animate smoothly]
  ↓
[Step title fades in]
```

#### **Error Shake**
```
[Invalid field]
  ↓
[Field shakes left-right (3 times, 300ms total)]
  ↓
[Error message fades in below]
```

---

### Feature 3: Haptic Feedback (Mobile/Tablet)

**Triggers:**
- Button tap (light impact)
- Star rating selection (medium impact)
- Form submission success (success notification)
- Error validation (error notification)
- Swipe navigation (selection feedback)

**Implementation:**
```typescript
import { triggerHaptic } from '@/utils/haptics';

const handleStarTap = (rating: number) => {
  setRating(rating);
  triggerHaptic('medium');
};
```

---

### Feature 4: Loading States

**Skeleton Screens:**
```
[Form loading]
  ↓
[Show skeleton UI with pulsing animation]
  ↓
[Fade in actual content]
```

**Button Loading:**
```
[Submit] → [Submitting...] → [✓ Submitted]
```

---

### Feature 5: Toast Notifications

**Success:**
```
✅ Form saved successfully
[Auto-dismiss after 3 seconds]
```

**Error:**
```
❌ Failed to save form
[Retry] [Dismiss]
```

**Info:**
```
ℹ️ Auto-saved 5 seconds ago
[Auto-dismiss after 2 seconds]
```

---

## Verification Plan

### Automated Tests
```bash
npm run test -- useKeyboardShortcuts.test.ts
npm run test -- haptics.test.ts
```

### Manual Verification
1. **Keyboard Shortcuts:** Verify all shortcuts work
2. **Button Press:** Verify scale-down animation
3. **Form Submit:** Verify checkmark animation
4. **Star Rating:** Verify fill animation + haptic
5. **Error Shake:** Verify invalid field shakes
6. **Toast:** Verify notifications appear and dismiss
7. **Haptic:** Verify vibrations on mobile (iOS/Android)

### Accessibility
- Can disable animations (prefers-reduced-motion)
- Keyboard shortcuts don't interfere with screen readers
- Focus indicators remain visible during animations

---

## Dependencies
- None (standalone feature)

## Estimated Effort
**8-12 hours** (2-3 days)

## Success Criteria
- ✅ All keyboard shortcuts functional
- ✅ Button press animations smooth (< 100ms)
- ✅ Form submit shows checkmark animation
- ✅ Star ratings animate on tap
- ✅ Error fields shake on validation failure
- ✅ Haptic feedback works on mobile
- ✅ Toast notifications appear and auto-dismiss
- ✅ Can disable animations (accessibility)

---

**Status:** Ready for LEAD assignment
