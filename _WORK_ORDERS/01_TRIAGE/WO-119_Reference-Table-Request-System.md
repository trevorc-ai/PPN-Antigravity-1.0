---
id: WO-119
status: 03_BUILD
owner: BUILDER
failure_count: 0
created: 2026-02-19
priority: MEDIUM
ticket_type: build
pages_affected:
  - src/components/common/ObservationSelector.tsx (has "Request New Option" button — needs wiring)
  - src/components/common/RefTableRequestModal.tsx (new)
  - src/hooks/useRefTableRequest.ts (new)
related_architecture: Turning_Point.md — ref_* + log_* only system
related_tickets: WO-118 (Practitioner Directory uses same log_feature_requests table)
user_prompt_verbatim: "You may recall that we are going to create functionality that allows people to request additions to the reference tables because we are running the entire system off reference tables and long tables only as discussed in turning_point.md"
---

## LEAD ARCHITECTURE

### Context from Turning_Point.md
The entire PPN system is `ref_* vocabulary → log_* user selections → analytics JOINs`. No free-text ever touches a DB column. This means any "new option" a user needs (new clinical observation, new modality, new medication) must go through a structured request → admin approval → SQL seed workflow.

The infrastructure already exists: `log_feature_requests` table (created in migration 051) with fields: `request_type`, `requested_text`, `category`, `status`, `user_id`, `site_id`.

The UI hook already exists: `ObservationSelector.tsx` has a "Request New Option" button (line 97–103) that calls `onRequestNew` — which currently does nothing. Wire it.

---

## TASK 1 — Create RefTableRequestModal Component

Create `src/components/common/RefTableRequestModal.tsx`:

A structured modal for requesting a new vocabulary item. NO free-text clinical content — the request itself is NOT stored as clinical data, it's an administrative request.

```
Props:
  isOpen: boolean
  onClose: () => void
  refTable: 'observations' | 'medications' | 'practitioners' | 'other'
  category?: string  // for observations: 'baseline' | 'session' | 'integration' | 'safety'
```

Modal fields:
- **What type of item?** (read-only, derived from `refTable` prop — e.g. "Clinical Observation")
- **Category** (read-only if passed in prop, else select from available categories)
- **Suggested Label** (text input, max 80 chars — this is the display text for the new option)
- **Rationale** (select from structured options — NOT a free-text narrative):
  - `Missing from current vocabulary`
  - `Commonly observed in my practice`
  - `Required by my site's protocol`
  - `Clinically validated but not listed`
  - `Other (see label)`
- **Priority** (Low / Medium / High toggle)

On submit:
```ts
await supabase.from('log_feature_requests').insert({
  user_id: currentUser.id,
  site_id: userSiteId,
  request_type: refTable,       // 'observations', 'medications', etc.
  requested_text: suggestedLabel, // the proposed new vocabulary item
  category: category,            // which ref_ subcategory
  status: 'pending'
});
```

Success state: `"Request submitted. Network admins will review and seed approved items within 1–2 weeks."`

---

## TASK 2 — Wire ObservationSelector "Request New Option" Button

In `ObservationSelector.tsx`, the `onRequestNew` prop is passed from parent forms but never fires a real modal. 

Update each parent form that uses `ObservationSelector` to pass a real `onRequestNew` handler:
```tsx
const [showRequestModal, setShowRequestModal] = useState(false);
// ...
<ObservationSelector
  category="baseline"
  selectedIds={selectedIds}
  onChange={setSelectedIds}
  onRequestNew={() => setShowRequestModal(true)}
/>
<RefTableRequestModal
  isOpen={showRequestModal}
  onClose={() => setShowRequestModal(false)}
  refTable="observations"
  category="baseline"
/>
```

Affected forms (grep for `onRequestNew`):
- `BaselineObservationsForm.tsx`
- `SessionObservationsForm.tsx`  
- `StructuredIntegrationSessionForm.tsx`
- `StructuredSafetyCheckForm.tsx`

---

## TASK 3 — Admin Review Surface (Minimal — Phase 1)

Create a simple admin view at `src/pages/AdminReview.tsx` (gated behind `network_admin` role check):
- Fetches `log_feature_requests WHERE status = 'pending'`
- Displays as a table: request_type | category | requested_text | submitted_by | submitted_at
- Action buttons: `[Approve]` (marks status = 'approved') | `[Reject]` (marks status = 'rejected')
- Approved items show a SQL snippet the admin can copy + run to seed the ref_ table:
  ```
  INSERT INTO ref_clinical_observations (observation_code, observation_text, category, sort_order)
  VALUES ('NEW_CODE', '{requested_text}', '{category}', 999);
  ```
- This page does NOT need to be linked from the main nav yet — accessed via direct URL `/admin/review`

---

## Acceptance Criteria
- [ ] `RefTableRequestModal` component created with structured inputs (no free-text clinical fields)
- [ ] Modal submits to `log_feature_requests` via Supabase
- [ ] Success state shown after submission
- [ ] `onRequestNew` in all 4 ObservationSelector usages opens the modal
- [ ] Category pre-filled based on which form opens the modal
- [ ] Admin review page exists at `/admin/review` (gated behind role check)
- [ ] Admin page shows pending requests with approve/reject actions + SQL snippet
- [ ] Zero new TypeScript errors
- [ ] No PHI stored — `requested_text` is proposed vocabulary label only (e.g. "Patient reports heightened sensory awareness")
