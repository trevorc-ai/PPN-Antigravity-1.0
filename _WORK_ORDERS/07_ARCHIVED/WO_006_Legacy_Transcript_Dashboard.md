---
work_order_id: WO_006
title: Feature - Legacy Transcript Dashboard
type: FEATURE
category: Feature
priority: MEDIUM
status: ASSIGNED
created: 2026-02-14T19:02:11-08:00
reviewed_by: LEAD
reviewed_at: 2026-02-14T19:07:27-08:00
requested_by: PPN Admin
assigned_to: BUILDER
estimated_complexity: 7/10
failure_count: 0
---

# Work Order: Feature - Legacy Transcript Dashboard

## 🎯 THE GOAL

Create a "Practitioner Stats" dashboard to visualize `log_sessions` data.

### Metrics

1. **"Verified Hours"** - Sum of session durations
2. **"Safety Score"** - Percentage of sessions without "Chemical Intervention"
3. **"Unique Protocols"** - Count distinct protocol IDs
4. **Chart:** A simple SVG line chart showing Hours per Month
5. **Export:** A button to generate a PDF summary of these stats (Client-side generation)

### UI
Professional "Certificate" aesthetic, Dark Mode

---

## 🎯 THE BLAST RADIUS (Authorized Target Area)

You are ONLY allowed to modify the following specific files/areas:

- `src/pages/Dashboard.tsx` (Modify existing page)
- `src/components/analytics/StatCard.tsx` (New Component - CREATE THIS)

---

## ⚡ THE ELECTRIC FENCE (Strict "DO NOT TOUCH" Constraints)

**DO NOT:**
- Display any client hashes or individual session IDs in the summary
- Pull data from other users (RLS will enforce this, but handle empty states gracefully)
- Use external analytics libraries that track user behavior (e.g., Google Analytics)
- Modify any other pages or components
- Touch the database schema
- Add new routes or navigation
- Store analytics data externally

**MUST:**
- Respect Row Level Security (only show current user's data)
- Handle empty states gracefully (new users with no sessions)
- Generate PDF client-side only (no server upload)
- Use SVG for charts (no external chart libraries with tracking)

---

## ✅ Acceptance Criteria

### Functionality
- [ ] "Verified Hours" metric calculates total session duration
- [ ] "Safety Score" calculates percentage of sessions without Chemical Intervention
- [ ] "Unique Protocols" counts distinct protocol IDs from sessions
- [ ] SVG line chart displays hours per month
- [ ] PDF export button generates summary client-side
- [ ] All data filtered by current user (RLS enforced)
- [ ] Empty state displays when no sessions exist

### UI/UX
- [ ] Professional "Certificate" aesthetic
- [ ] Dark mode design
- [ ] StatCard component is reusable
- [ ] Chart has clear axis labels
- [ ] PDF export includes all 3 metrics + chart
- [ ] Responsive design (mobile and desktop)
- [ ] Loading states during data fetch

### Security & Compliance
- [ ] No client hashes displayed
- [ ] No session IDs shown in UI
- [ ] RLS prevents cross-user data access
- [ ] No external analytics tracking
- [ ] PDF generated client-side only
- [ ] Charts have text alternatives for accessibility

---

## 🧪 Testing Requirements

- [ ] Test with user who has multiple sessions
- [ ] Test with user who has zero sessions (empty state)
- [ ] Verify Safety Score calculation accuracy
- [ ] Verify Verified Hours calculation accuracy
- [ ] Test SVG chart renders correctly
- [ ] Test PDF export downloads successfully
- [ ] Verify no other users' data is visible
- [ ] Test screen reader announces chart data
- [ ] Verify no external tracking libraries loaded

---

## 📝 MANDATORY COMPLIANCE

### ACCESSIBILITY
- **Charts Must Have Text Alternatives:** Provide data table or ARIA labels
- **Keyboard Navigation:** All interactive elements accessible via keyboard
- **Screen Reader Support:** Metrics announced clearly
- **Color Contrast:** Meet WCAG standards for dark mode

### SECURITY
- **Data Visualization Only:** No data export to external services
- **RLS Enforcement:** Only current user's data visible
- **No PII Display:** No client hashes or session IDs
- **Client-Side PDF:** No server upload of generated PDFs
- **No Tracking:** No Google Analytics or similar services

---

## 🚦 Status

**INBOX** - Ready for BUILDER assignment

---

## Workflow

1. ⏳ CUE creates work order → **CURRENT STEP**
2. ⏳ BUILDER reviews and accepts
3. ⏳ BUILDER creates StatCard component
4. ⏳ BUILDER modifies Dashboard.tsx
5. ⏳ BUILDER implements SVG chart
6. ⏳ BUILDER implements PDF export
7. ⏳ INSPECTOR verifies compliance
8. ⏳ User approves and deploys

---

## 📋 Technical Notes

### Metrics Calculation

```typescript
// Verified Hours
const totalHours = sessions.reduce((sum, session) => {
  const duration = (session.end_time - session.start_time) / (1000 * 60 * 60);
  return sum + duration;
}, 0);

// Safety Score
const sessionsWithoutChemical = sessions.filter(session => {
  return !session.interventions.some(i => i.intervention_id === 4); // Chemical Intervention
});
const safetyScore = (sessionsWithoutChemical.length / sessions.length) * 100;

// Unique Protocols
const uniqueProtocols = new Set(sessions.map(s => s.protocol_id)).size;
```

### SVG Chart Structure
```tsx
<svg width="100%" height="300" viewBox="0 0 800 300">
  <g className="chart-lines">
    {/* Line chart path */}
  </g>
  <g className="chart-axes">
    {/* X and Y axes */}
  </g>
</svg>
```

### PDF Export (Client-Side)
```typescript
// Use jsPDF or similar client-side library
import { jsPDF } from 'jspdf';

const exportPDF = () => {
  const doc = new jsPDF();
  doc.text('Practitioner Stats Summary', 20, 20);
  doc.text(`Verified Hours: ${verifiedHours}`, 20, 40);
  doc.text(`Safety Score: ${safetyScore}%`, 20, 50);
  doc.text(`Unique Protocols: ${uniqueProtocols}`, 20, 60);
  doc.save('practitioner-stats.pdf');
};
```

### Database Query
```typescript
const { data: sessions } = await supabase
  .from('log_sessions')
  .select(`
    id,
    created_at,
    protocol_id,
    interventions:log_interventions(intervention_id)
  `)
  .eq('user_id', user.id);
```

---

## 🎨 Design Specifications

### Colors (Certificate Theme)
- Background: `#0a0a0a` (Dark)
- Card Background: `#1a1a1a` (Dark Gray)
- Border: `#2a2a2a` (Medium Gray)
- Accent: `#3b82f6` (Blue) or `#8b5cf6` (Purple)
- Text: `#f1f5f9` (Slate 100)
- Muted Text: `#94a3b8` (Slate 400)

### Typography
- Metric Value: 32px, bold
- Metric Label: 14px, uppercase, tracking-wide
- Chart Labels: 12px

### Layout
- 3-column grid for StatCards (responsive to 1 column on mobile)
- Chart below metrics
- Export button at bottom right
- Adequate spacing between elements

### StatCard Component
```tsx
interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
}
```

---

## Dependencies

**Prerequisite:** WO_002 (Shadow Market Schema) must be completed first to ensure `log_sessions` and `log_interventions` tables exist.

---

## 📦 Required Libraries

- `jspdf` - Client-side PDF generation (no tracking)
- No external chart libraries (use native SVG)
- No analytics libraries (Google Analytics, Mixpanel, etc.)

---

## 🔍 INSPECTOR QA APPROVAL

**Reviewed By:** INSPECTOR  
**Review Date:** 2026-02-14T21:43:23-08:00  
**Status:** ✅ **APPROVED**

### Compliance Verification

**✅ ACCESSIBILITY:**
- Charts must have text alternatives (data table or ARIA labels)
- Keyboard navigation for all interactive elements
- Screen reader support for metrics
- WCAG color contrast for dark mode
- Minimum 12px font size specified

**✅ PHI/SECURITY:**
- No client hashes displayed
- No session IDs shown in UI
- RLS enforcement (only current user's data)
- No external analytics tracking
- PDF generated client-side only (no server upload)
- Data visualization only (no PII export)
- No free-text fields (read-only dashboard)

**VERDICT:** This work order is compliant with all accessibility and PHI rules. Cleared for USER_REVIEW.
