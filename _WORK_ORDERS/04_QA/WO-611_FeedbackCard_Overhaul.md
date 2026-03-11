---
id: WO-611
title: FeedbackCard.tsx — Type-Aware Structured Forms + Metadata Capture
owner: BUILDER
authored_by: INSPECTOR
routed_to: LEAD → BUILDER
status: 03_BUILD
priority: P1
created: 2026-03-11
depends_on: WO-610 (schema must be applied first)
---

## Context

The current `FeedbackCard` (`src/components/FeedbackCard.tsx`) uses a single unstructured textarea for all three feedback types. This WO upgrades it to:
1. **BUG:** Auto-capture browser/OS/viewport/route metadata on submit
2. **FEATURE:** Render a 3-field structured form instead of a blank box
3. **COMMENT:** Unchanged

The schema changes (new `metadata JSONB` column) are handled by WO-610.

---

## File to Modify

**`src/components/FeedbackCard.tsx`** — single file, no other files touched.

---

## Detailed Implementation

### 1 — Update the `FeedbackCard` Insert Payload

The current insert at lines 94–101 is:
```ts
await supabase.from('user_feedback').insert({
  user_id: user?.id,
  type,
  message: message.trim().slice(0, 1000),
  page_url: window.location.hash || window.location.pathname,
});
```

Replace with a helper that builds `metadata` when type is `'bug'`:

```ts
const buildMetadata = () => {
  if (type !== 'bug') return null;
  return {
    userAgent: navigator.userAgent,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    route: window.location.hash || window.location.pathname,
    language: navigator.language,
    timestamp: new Date().toISOString(),
  };
};

// In handleSubmit, replace the insert object:
const { error: insertError } = await supabase
  .from('user_feedback')
  .insert({
    user_id: user?.id,
    type,
    message: buildPayloadMessage(),   // see below
    page_url: window.location.hash || window.location.pathname,
    metadata: buildMetadata(),
  });
```

### 2 — FEATURE Mode: Structured State

Add three new state fields for feature mode. Initialize alongside the existing `message` state:

```ts
const [featureFields, setFeatureFields] = useState({
  problem: '',
  value: '',
  context: '',
});
```

Add a helper to build the final message string when type is `'feature'`:
```ts
const buildPayloadMessage = (): string => {
  if (type !== 'feature') return message.trim().slice(0, 1000);
  return [
    `Problem: ${featureFields.problem}`,
    `Value: ${featureFields.value}`,
    `Context: ${featureFields.context}`,
  ].join('\n\n').slice(0, 1000);
};
```

Reset `featureFields` alongside `message` in `handleClose`:
```ts
setFeatureFields({ problem: '', value: '', context: '' });
```

### 3 — Conditional UI Rendering

Replace the current single `<textarea>` block with a conditional render:

```tsx
{type === 'feature' ? (
  <div className="space-y-3">
    {[
      { key: 'problem', label: 'What problem are you trying to solve?', placeholder: 'e.g. I cannot find the patient timeline after session close...' },
      { key: 'value',   label: 'How would this help you?',             placeholder: 'e.g. I would spend less time searching and more time with patients...' },
      { key: 'context', label: 'Any other context?',                   placeholder: 'Optional — screenshots, workarounds, related features...' },
    ].map(({ key, label, placeholder }) => (
      <div key={key}>
        <label className="ppn-meta text-slate-400 block mb-1">{label}</label>
        <textarea
          value={featureFields[key as keyof typeof featureFields]}
          onChange={(e) => setFeatureFields(prev => ({ ...prev, [key]: e.target.value.slice(0, 400) }))}
          placeholder={placeholder}
          rows={2}
          className="w-full resize-none rounded-xl px-4 py-3 text-sm text-slate-300 placeholder:text-slate-600 bg-slate-900 border border-slate-700 focus:border-indigo-500/60 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
        />
      </div>
    ))}
  </div>
) : (
  /* Existing single textarea — unchanged for BUG and COMMENT */
  <textarea ... />
)}
```

### 4 — Disable condition for submit button

Update the disabled condition to handle feature mode:
```ts
// Current:
disabled={!message.trim() || submitting}

// Replace with:
disabled={
  submitting ||
  (type === 'feature'
    ? !featureFields.problem.trim()
    : !message.trim())
}
```

---

## Constraints

- **No changes to the component's props interface**
- **No new imports except standard React hooks**
- **No changes to the type selector UI or the success state**
- **No changes to TopHeader.tsx**

---

## Acceptance Criteria

- [ ] Selecting BUG → single textarea remains; submitted payload has `metadata` JSON with `userAgent`, `viewport`, `route`, `timestamp`
- [ ] Selecting FEATURE → three labeled text fields appear; submitted payload combines them into a single `message` string
- [ ] Selecting COMMENT → unchanged behavior
- [ ] Submit disabled if `problem` field is empty in FEATURE mode
- [ ] All fields reset on close in all modes
- [ ] `npm run build` clean
