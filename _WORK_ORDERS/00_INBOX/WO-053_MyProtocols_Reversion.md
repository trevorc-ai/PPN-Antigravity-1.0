---
id: WO-053
status: 00_INBOX
priority: P1 (Critical)
category: Feature / UI Reversion
owner: PENDING_LEAD_ASSIGNMENT
failure_count: 0
created_date: 2026-02-16T06:55:37-08:00
---

# ORIGINAL USER REQUEST (VERBATIM)

**Work order Request:** MyProtocols Reversion 

My vision is for the 'My Protocols' page to look like it did previously (see attached), but without the modal. In the public/admin_uploads folder you'll find the old version of the page (MyProtocols_plus_Modal.tsx) which includes the original ProtocolBuilder modal. 

**Instructions:** Replace the current page with the old version 'MyProtocols_plus_Modal.tsx' and remove the modal completely. We are building a new and improved version of the ProtocolBuilder modal called 'Arc of Care' (working title), which we will connect to the 'Create New Protocol' button. Only add the page, connect the display to the log tables in the database, and update to match the current CSS; do not add the modal.

**File Reference:** 
- Source file: `public/admin_uploads/MyProtocols_plus_Modal.tsx`
- Target file: `src/pages/MyProtocols.tsx`
- Screenshot attached (see above)

---

# User Request Summary

Revert the My Protocols page to the previous design (without the modal) and prepare it for the new "Arc of Care" Protocol Builder feature.

## User's Vision

The My Protocols page should look like the previous version (see screenshot) with:
- Clean protocol list display
- "Create New Protocol" button
- Search functionality
- Protocol reference, current status, dosage, and action columns
- Outcome Velocity sidebar widget
- **NO modal** - the old modal will be replaced with a new "Arc of Care" feature

## Current State

**Current My Protocols page:**
- Table-based layout with filters
- Simple "+ New Protocol" button
- Navigates to separate Protocol Builder page

**Old version available:**
- `public/admin_uploads/MyProtocols_plus_Modal.tsx` - Previous design with modal

## Desired State

**Replace current My Protocols with old design:**
- Use `MyProtocols_plus_Modal.tsx` as the base
- **Remove the modal completely**
- Connect "Create New Protocol" button to future "Arc of Care" feature (placeholder for now)
- Update database queries to use current `log_*` tables
- Update styling to match current CSS theme

---

## THE BLAST RADIUS (Authorized Target Area)

### Files to Review

**SOURCE:**
- `public/admin_uploads/MyProtocols_plus_Modal.tsx` - Old version to restore

**TARGET:**
- `src/pages/MyProtocols.tsx` - Replace with old design (minus modal)

### Required Changes

1. **Copy old design structure** from `MyProtocols_plus_Modal.tsx`
2. **Remove modal component** and all modal-related code
3. **Update database queries** to use current schema:
   - `log_clinical_records` (current table)
   - Join with `ref_substances`, `ref_indications`
4. **Update CSS classes** to match current theme
5. **Connect "Create New Protocol" button** to placeholder route (for future Arc of Care)

---

## ⚡ THE ELECTRIC FENCE (Strict "DO NOT TOUCH" Constraints)

**DO NOT:**
- Include any modal functionality
- Build the "Arc of Care" feature yet (placeholder only)
- Modify other pages or components
- Change the database schema
- Touch the Protocol Builder page

**MUST:**
- Remove all modal-related code from old version
- Update database queries to current schema
- Match current CSS theme and colors
- Preserve search and filter functionality
- Maintain accessibility standards

---

## ✅ Acceptance Criteria

### Page Restoration
- [ ] Old My Protocols design restored (layout, structure, widgets)
- [ ] Modal component completely removed
- [ ] No modal-related imports or state management
- [ ] Clean, modal-free implementation

### Database Integration
- [ ] Queries updated to use `log_clinical_records`
- [ ] Joins with `ref_substances` for substance names
- [ ] Joins with `ref_indications` for indication names
- [ ] All data displays correctly from current schema

### UI/UX
- [ ] "Create New Protocol" button visible and styled
- [ ] Button navigates to placeholder route (e.g., `/arc-of-care` or shows "Coming Soon")
- [ ] Search functionality works
- [ ] Protocol list displays correctly
- [ ] Outcome Velocity widget displays (if in old version)
- [ ] Responsive design maintained

### Styling
- [ ] CSS updated to match current theme
- [ ] Colors match current palette (teal accents, dark backgrounds)
- [ ] Typography consistent with current design
- [ ] Spacing and layout polished

### Testing
- [ ] Page loads without errors
- [ ] Data fetches correctly from database
- [ ] Search and filters work
- [ ] Navigation works
- [ ] Mobile responsive
- [ ] No console errors

---

## 📝 MANDATORY COMPLIANCE

### ACCESSIBILITY
- Minimum 12px font size
- Keyboard accessible
- Screen reader friendly
- Sufficient color contrast
- ARIA labels where needed

### SECURITY
- RLS policies enforced on queries
- No PHI/PII exposure
- User data isolation maintained

---

## 🚦 Status

**INBOX** - Awaiting LEAD architectural review

---

## 📋 Technical Implementation Notes

### Old File Location
```
public/admin_uploads/MyProtocols_plus_Modal.tsx
```

### Current Database Schema

**Table:** `log_clinical_records`
**Joins:**
- `ref_substances(substance_name)`
- `ref_indications(indication_name)`
- `ref_routes(route_name)` (if needed)

**Key fields:**
- `id`, `subject_id`, `session_number`
- `substance_id`, `indication_id`, `route_id`
- `dosage_mg`, `dosage_unit`
- `session_date`, `submitted_at`
- `patient_age`, `patient_sex`, `patient_weight_range`

### Modal Removal Checklist

Remove from old version:
- [ ] Modal component imports
- [ ] Modal state management (`isModalOpen`, etc.)
- [ ] Modal open/close handlers
- [ ] Modal JSX rendering
- [ ] Any modal-related styling

### "Create New Protocol" Button

**Placeholder implementation:**
```tsx
<button
  onClick={() => navigate('/arc-of-care')}
  // OR
  onClick={() => alert('Arc of Care feature coming soon!')}
  className="... current theme classes ..."
>
  Create New Protocol
</button>
```

### Expected Layout (from screenshot)

**Header:**
- "My Protocols" title
- Protocol count indicator
- "Create New Protocol" button (blue/teal)

**Main Content:**
- Search bar
- Protocol table with columns:
  - Protocol Reference (name/ID)
  - Current Status (Active, Completed, Observation)
  - Dosage
  - Action (Open Protocol button)

**Sidebar:**
- Outcome Velocity widget
- Other metrics/widgets

---

## Design Reference

User provided screenshot showing:
- Dark theme with blue/teal accents
- Clean table layout
- Status badges (green for completed, blue for active)
- Dosage displayed with units
- "Open Protocol" action buttons
- Right sidebar with "Outcome Velocity" widget
- Search functionality

---

## Dependencies

**Prerequisite:**
- Old version file must exist at `public/admin_uploads/MyProtocols_plus_Modal.tsx`

**Future Work:**
- Arc of Care Protocol Builder (separate work order)

---

## Notes

This is a **reversion + cleanup** task. The goal is to restore the previous design that the user prefers, remove the modal that's no longer needed, and prepare the page for the upcoming "Arc of Care" feature.

The "Arc of Care" is a new Protocol Builder modal/feature that will be built separately and connected to the "Create New Protocol" button in a future work order.
