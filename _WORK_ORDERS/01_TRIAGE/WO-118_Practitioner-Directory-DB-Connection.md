---
id: WO-118
status: 03_BUILD
owner: BUILDER
failure_count: 0
created: 2026-02-19
priority: HIGH
ticket_type: build + db read
pages_affected:
  - src/pages/ClinicianDirectory.tsx
  - src/constants/index.ts (CLINICIANS array — to be replaced with live query)
  - src/hooks/useClinicianDirectory.ts (new)
related_tickets: WO-119 (Reference Table Request System)
user_prompt_verbatim: "The practitioner directory hasn't been fixed yet, but that has been on the back burner for a long time. However, I want to have that ready to go, and that means we have to give the users the ability to upload their information; I don't know if we can do this because we are not allowing people to write to the database, but let's explore our options."
---

## LEAD ARCHITECTURE

### The "No Direct Writes" Problem — Solved
This system uses `ref_*` + `log_*` tables only. Practitioners are NOT a user-table entity — they are a **reference vocabulary** (`ref_practitioners`). The pattern is:

1. **Network admins seed `ref_practitioners`** via SQL migration (same as all other ref_ tables)
2. **Practitioners submit their info via `log_feature_requests`** (already built in migration 051) — the same mechanism used for requesting new observation vocab
3. A network admin reviews and approves → seeds the practitioner into `ref_practitioners` via the admin SQL dashboard
4. **For launch**: pre-seed 5–10 demo practitioners via migration. The directory reads from `ref_practitioners` — no writes from the app.

This is architecturally clean, PHI-safe, and consistent with turning_point.md principles.

---

## TASK 1 — Create ref_practitioners Table (LEAD handles SQL — SOOP deactivated)

LEAD will write and commit the migration. BUILDER should NOT write SQL.

Migration `052_create_ref_practitioners.sql` will create:
```sql
CREATE TABLE IF NOT EXISTS public.ref_practitioners (
    practitioner_id  BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    display_name     TEXT NOT NULL,
    role             TEXT NOT NULL,  -- e.g. 'Psychiatrist', 'Facilitator'
    location_city    TEXT NOT NULL,
    location_country TEXT NOT NULL DEFAULT 'United States',
    license_type     TEXT,           -- 'MD', 'LCSW', 'PhD', etc.
    modalities       TEXT[],         -- ['Psilocybin', 'Ketamine', 'MDMA']
    accepting_clients BOOLEAN NOT NULL DEFAULT true,
    verified         BOOLEAN NOT NULL DEFAULT false,
    verification_level TEXT NOT NULL DEFAULT 'L1',
    profile_url      TEXT,
    image_url        TEXT,
    site_id          UUID REFERENCES log_sites(site_id),
    is_active        BOOLEAN NOT NULL DEFAULT true,
    sort_order       INT NOT NULL DEFAULT 0,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS: read-only for authenticated users
ALTER TABLE public.ref_practitioners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ref_practitioners_read" ON public.ref_practitioners
    FOR SELECT TO authenticated USING (is_active = true);
```

Include seed of 8 demo practitioners matching the existing `CLINICIANS` constants array.

---

## TASK 2 — Create useClinicianDirectory Hook

Create `src/hooks/useClinicianDirectory.ts`:
```ts
// Fetches from ref_practitioners, falls back to CLINICIANS constants if empty
import { supabase } from '../supabaseClient';
import { CLINICIANS } from '../constants';

export function useClinicianDirectory() {
  const [practitioners, setPractitioners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data, error } = await supabase
        .from('ref_practitioners')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');
      
      if (error || !data?.length) {
        setPractitioners(CLINICIANS); // fallback to constants
      } else {
        setPractitioners(data.map(mapToClinicianShape));
      }
      setLoading(false);
    };
    fetch();
  }, []);

  return { practitioners, loading };
}
```

Map `ref_practitioners` DB fields to the existing `practitioner` shape that `PractitionerCard` expects (`name`, `role`, `location`, `imageUrl`, `status`, `verificationLevel`, `id`).

---

## TASK 3 — Replace CLINICIANS constant with hook in ClinicianDirectory.tsx

In `ClinicianDirectory.tsx`:
- Replace `import { CLINICIANS } from '../constants'` with `import { useClinicianDirectory } from '../hooks/useClinicianDirectory'`
- Add `const { practitioners, loading } = useClinicianDirectory()`
- Replace `CLINICIANS` references with `practitioners`
- Add loading skeleton: 8 ghost cards while fetching (same card dimensions, `animate-pulse bg-slate-800/40`)

---

## TASK 4 — "List Your Practice" Submission Form

Add a "List Your Practice" CTA button in the `ClinicianDirectory.tsx` header (right side, next to filters).

When clicked, opens a modal with a structured form (NO free-text clinical fields):
```
Display Name (text input — this is professional identity, not PHI)
Role (select: Psychiatrist | Facilitator | LCSW | PhD Researcher | Nurse Practitioner | Other)
Location City (text)
Location Country (select: US | Canada | UK | Australia | Netherlands | Other)
License Type (select: MD | DO | LCSW | LPC | PhD | Other)
Modalities (multi-check: Psilocybin | Ketamine | MDMA | Ibogaine | Cannabis)
Accepting New Clients (toggle)
Website URL (text input, optional)
Contact Email (text input — for admin follow-up only, NOT stored in ref_practitioners)
```

On submit: POST to `log_feature_requests` table:
```ts
await supabase.from('log_feature_requests').insert({
  user_id: auth.uid(), // if logged in
  request_type: 'practitioner_listing',
  requested_text: JSON.stringify(formData), // structured, not narrative PHI
  category: 'directory',
  status: 'pending'
});
```

Show success state: `"Your listing request has been submitted. Our team will review and activate within 2–3 business days."`

Note: `contact_email` field is used for admin follow-up only — stored temporarily in `requested_text` JSON alongside other profile data and reviewed by network admin before activation.

---

## Acceptance Criteria
- [ ] `ref_practitioners` table created with RLS (LEAD writes migration)
- [ ] 8 demo practitioners seeded matching existing CLINICIANS constants shape
- [ ] `useClinicianDirectory` hook created with constants fallback
- [ ] `ClinicianDirectory.tsx` reads from hook, not constants directly
- [ ] Loading skeleton (8 ghost cards) shown while fetching
- [ ] "List Your Practice" CTA button visible in header
- [ ] Submission form uses structured inputs only — no free-text clinical fields
- [ ] Submission goes to `log_feature_requests` table
- [ ] Success state shown after submission
- [ ] Zero new TypeScript errors
- [ ] No PHI inputs — contact email is administrative, not clinical
