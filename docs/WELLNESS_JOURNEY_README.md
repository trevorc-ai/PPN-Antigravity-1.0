# Wellness Journey Documentation

**Complete documentation for the Wellness Journey feature integration.**

---

## 📚 Documentation Index

### 1. **[Full Integration Guide](./WELLNESS_JOURNEY_INTEGRATION.md)**
   - **Purpose:** Comprehensive documentation covering architecture, features, and implementation
   - **Audience:** All team members, new developers
   - **Contents:**
     - Overview and objectives
     - Architecture and file structure
     - Features implemented (Phase A)
     - Component documentation
     - User experience flow
     - Technical implementation details
     - Accessibility and design guidelines
     - Future roadmap (Phases B-D)
     - Troubleshooting guide

### 2. **[Quick Reference Guide](./WELLNESS_JOURNEY_QUICK_REF.md)**
   - **Purpose:** Fast lookup for common tasks and code patterns
   - **Audience:** Developers actively working on the feature
   - **Contents:**
     - Quick start examples
     - Component props reference
     - Styling guidelines
     - Common tasks with code snippets
     - Debugging tips
     - Data flow diagrams
     - Performance optimization
     - Best practices

---

## 🎯 Quick Links

| Task | Documentation |
|------|---------------|
| Understanding the feature | [Full Integration Guide](./WELLNESS_JOURNEY_INTEGRATION.md#overview) |
| Adding a new assessment | [Quick Reference](./WELLNESS_JOURNEY_QUICK_REF.md#1-add-new-assessment-type) |
| Customizing styles | [Quick Reference](./WELLNESS_JOURNEY_QUICK_REF.md#-styling-guidelines) |
| Troubleshooting issues | [Full Integration Guide](./WELLNESS_JOURNEY_INTEGRATION.md#troubleshooting) |
| Future development | [Full Integration Guide](./WELLNESS_JOURNEY_INTEGRATION.md#future-roadmap) |

---

## 🚀 Getting Started

### For New Developers

1. **Read the [Overview](./WELLNESS_JOURNEY_INTEGRATION.md#overview)** to understand the feature's purpose
2. **Review the [Architecture](./WELLNESS_JOURNEY_INTEGRATION.md#architecture)** to see how files are organized
3. **Study the [User Experience Flow](./WELLNESS_JOURNEY_INTEGRATION.md#user-experience-flow)** to understand the user journey
4. **Bookmark the [Quick Reference](./WELLNESS_JOURNEY_QUICK_REF.md)** for daily development

### For Existing Developers

1. **Jump to [Quick Reference](./WELLNESS_JOURNEY_QUICK_REF.md)** for code snippets
2. **Check [Common Tasks](./WELLNESS_JOURNEY_QUICK_REF.md#-common-tasks)** for implementation patterns
3. **Review [Best Practices](./WELLNESS_JOURNEY_QUICK_REF.md#-best-practices)** before making changes

---

## 📊 Feature Status

### Phase A: Core Integration ✅ **COMPLETE**
- [x] Terminology update ("Wellness Journey" → "Wellness Journey")
- [x] Assessment modal integration
- [x] Navigation enhancement
- [x] Visual polish (Quick Wins)

### Phase B: Supabase Integration 🔄 **PLANNED**
- [ ] Connect to database tables
- [ ] Fetch real patient data
- [ ] Save assessment responses
- [ ] Implement RLS policies

### Phase C: Complete Assessment Flow 📋 **PLANNED**
- [ ] Baseline assessments (PHQ-9, GAD-7, ACE)
- [ ] Integration pulse checks
- [ ] Additional assessments (C-SSRS, PSQI)
- [ ] Assessment scheduling

### Phase D: Advanced Features 🚀 **FUTURE**
- [ ] PDF export
- [ ] Comparative analytics
- [ ] Predictive modeling
- [ ] Longitudinal analysis

---

## 🎨 Design Principles

1. **Accessibility First:** WCAG AA compliance, minimum 12px fonts, no color-only meaning
2. **Visual Hierarchy:** Clear typography scale, prominent scores, readable labels
3. **Responsive Design:** Mobile-first approach, works on all screen sizes
4. **Consistent Spacing:** Tailwind spacing scale, predictable gaps and padding
5. **Polished Interactions:** Smooth transitions, hover effects, loading states

---

## 🔧 Key Components

| Component | File | Purpose |
|-----------|------|---------|
| **Wellness Journey Dashboard** | `ArcOfCareGodView.tsx` | Main 3-phase view |
| **Adaptive Assessment** | `AdaptiveAssessmentPage.tsx` | MEQ/EDI/CEQ flow |
| **Sidebar Navigation** | `Sidebar.tsx` | App navigation |
| **Route Config** | `App.tsx` | URL routing |

---

## 📝 Code Examples

### Opening the Assessment Modal

```typescript
// In ArcOfCareGodView.tsx
const [showAssessmentModal, setShowAssessmentModal] = useState(false);

<button onClick={() => setShowAssessmentModal(true)}>
  Complete Post-Session Assessments
</button>

{showAssessmentModal && (
  <div className="fixed inset-0 bg-black/80 z-50">
    <AdaptiveAssessmentPage 
      showBackButton={false}
      onComplete={handleAssessmentComplete}
    />
  </div>
)}
```

### Handling Assessment Completion

```typescript
const handleAssessmentComplete = (scores: { meq: number; edi: number; ceq: number }) => {
  setAssessmentScores(scores);
  setAssessmentCompleted(true);
  
  setTimeout(() => {
    setShowAssessmentModal(false);
  }, 3000);
};
```

---

## 🐛 Common Issues

| Issue | Solution | Documentation |
|-------|----------|---------------|
| Modal doesn't open | Check state management | [Troubleshooting](./WELLNESS_JOURNEY_INTEGRATION.md#1-assessment-modal-doesnt-open) |
| Back button visible | Pass `showBackButton={false}` | [Troubleshooting](./WELLNESS_JOURNEY_INTEGRATION.md#2-back-button-still-visible-in-modal) |
| Dashboard not updating | Verify `onComplete` callback | [Troubleshooting](./WELLNESS_JOURNEY_INTEGRATION.md#3-dashboard-doesnt-update-after-assessment) |
| Excessive dead space | Check spacing classes | [Troubleshooting](./WELLNESS_JOURNEY_INTEGRATION.md#5-dead-space-in-phase-1-card) |

---

## 📞 Support

For questions or issues:
1. **Check the documentation** - Most answers are here
2. **Review code examples** - See working implementations
3. **Contact the team** - BUILDER, DESIGNER, or LEAD

---

## 📅 Changelog

### February 16, 2026 - v1.0
- ✅ Initial documentation release
- ✅ Full integration guide created
- ✅ Quick reference guide created
- ✅ Phase A implementation complete

---

**Maintained by:** Development Team  
**Last Updated:** February 16, 2026  
**Version:** 1.0
