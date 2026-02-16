# Wellness Journey - Quick Reference

**Quick start guide for developers working with the Wellness Journey feature.**

---

## 🚀 Quick Start

### Accessing the Dashboard

```typescript
// Navigate to Wellness Journey
navigate('/wellness-journey');

// Or use legacy route
navigate('/arc-of-care-god-view');
```

### Opening Assessment Modal

```typescript
// In ArcOfCareGodView.tsx
const [showAssessmentModal, setShowAssessmentModal] = useState(false);

// Trigger modal
<button onClick={() => setShowAssessmentModal(true)}>
  Complete Assessments
</button>
```

---

## 📦 Component Props

### AdaptiveAssessmentPage

```typescript
interface AdaptiveAssessmentPageProps {
  onComplete?: (scores: { meq: number; edi: number; ceq: number }) => void;
  showBackButton?: boolean; // Default: true
}
```

**Usage:**
```tsx
<AdaptiveAssessmentPage 
  showBackButton={false}  // Hide back button in modal
  onComplete={(scores) => {
    console.log('MEQ:', scores.meq);
    console.log('EDI:', scores.edi);
    console.log('CEQ:', scores.ceq);
  }}
/>
```

---

## 🎨 Styling Guidelines

### Card Spacing
```tsx
// Phase cards container
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

// Individual phase card
<div className="p-5 space-y-2.5">
```

### Typography
```tsx
// Page title
<h1 className="text-3xl font-black text-slate-200">

// Score numbers
<div className="text-4xl font-black text-red-400">21</div>

// Labels
<div className="text-sm font-semibold text-slate-400">PHQ-9</div>

// Section headings
<p className="text-sm font-bold uppercase tracking-wide text-slate-200">
```

### Buttons
```tsx
// Primary action button
<button className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl font-bold text-lg transition-all shadow-xl shadow-amber-500/40 hover:shadow-2xl hover:shadow-amber-500/50 hover:scale-[1.02] active:scale-[0.98]">

// Accordion button
<button className="w-full p-2.5 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center justify-between hover:bg-blue-500/20 transition-colors">
```

---

## 🔧 Common Tasks

### 1. Add New Assessment Type

```typescript
// In AdaptiveAssessmentPage.tsx
const [newAssessmentScore, setNewAssessmentScore] = useState<number | null>(null);

// Update onComplete callback
onComplete?.({
  meq: meqScore,
  edi: ediScore,
  ceq: ceqScore,
  newAssessment: newAssessmentScore // Add new score
});
```

### 2. Customize Modal Behavior

```typescript
// Auto-close after different duration
setTimeout(() => {
  setShowAssessmentModal(false);
}, 5000); // 5 seconds instead of 3

// Prevent auto-close
// Simply remove the setTimeout
```

### 3. Add New Phase Card

```tsx
{/* Phase 4 Example */}
<div className="bg-gradient-to-br from-purple-500/10 to-purple-900/10 border-2 border-purple-500/50 rounded-2xl p-5 space-y-2.5">
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
        <Icon className="w-5 h-5 text-purple-400" />
      </div>
      <div>
        <p className="text-purple-300 text-xs font-semibold uppercase tracking-wide">Phase 4</p>
        <h3 className="text-slate-200 text-base font-bold">Your Phase Name</h3>
      </div>
    </div>
    <CheckCircle className="w-5 h-5 text-purple-400" />
  </div>
  
  {/* Your content */}
</div>
```

---

## 🐛 Debugging

### Check Assessment Completion

```typescript
// Add console logs
const handleAssessmentComplete = (scores) => {
  console.log('Assessment completed:', scores);
  console.log('MEQ:', scores.meq);
  console.log('EDI:', scores.edi);
  console.log('CEQ:', scores.ceq);
  
  setAssessmentScores(scores);
  setAssessmentCompleted(true);
};
```

### Verify Modal State

```typescript
// Log modal state changes
useEffect(() => {
  console.log('Modal visible:', showAssessmentModal);
}, [showAssessmentModal]);

useEffect(() => {
  console.log('Assessment completed:', assessmentCompleted);
}, [assessmentCompleted]);
```

---

## 📊 Data Flow

```
User clicks button
    ↓
setShowAssessmentModal(true)
    ↓
Modal opens with AdaptiveAssessmentPage
    ↓
User completes assessments
    ↓
onComplete({ meq, edi, ceq }) called
    ↓
handleAssessmentComplete updates state
    ↓
Dashboard re-renders with new data
    ↓
setTimeout closes modal after 3s
```

---

## ⚡ Performance Tips

1. **Memoize expensive calculations:**
```typescript
const severityInfo = useMemo(() => 
  getSeverityInfo(journey.baseline.phq9, 'phq9'),
  [journey.baseline.phq9]
);
```

2. **Lazy load modal content:**
```typescript
{showAssessmentModal && (
  <AdaptiveAssessmentPage {...props} />
)}
```

3. **Debounce state updates:**
```typescript
import { debounce } from 'lodash';

const debouncedUpdate = debounce((scores) => {
  setAssessmentScores(scores);
}, 300);
```

---

## 🎯 Best Practices

### ✅ DO
- Use semantic HTML (`<button>`, `<nav>`, `<section>`)
- Maintain consistent spacing (use Tailwind's spacing scale)
- Test with keyboard navigation
- Verify color contrast ratios
- Add loading states for async operations

### ❌ DON'T
- Use inline styles (use Tailwind classes)
- Hardcode colors (use design tokens)
- Forget to handle error states
- Skip accessibility attributes
- Use `any` types in TypeScript

---

## 📱 Responsive Breakpoints

```tsx
// Mobile first approach
<div className="
  grid 
  grid-cols-1          // Mobile: stack vertically
  lg:grid-cols-3       // Desktop: 3 columns
  gap-4                // Mobile: smaller gap
  lg:gap-6             // Desktop: larger gap
">
```

---

## 🔗 Related Files

- `src/pages/ArcOfCareGodView.tsx` - Main dashboard
- `src/pages/AdaptiveAssessmentPage.tsx` - Assessment flow
- `src/components/Sidebar.tsx` - Navigation
- `src/App.tsx` - Route configuration
- `docs/WELLNESS_JOURNEY_INTEGRATION.md` - Full documentation

---

## 📞 Support

For questions or issues:
1. Check the full documentation
2. Review the troubleshooting section
3. Contact the development team

---

**Last updated:** February 16, 2026
