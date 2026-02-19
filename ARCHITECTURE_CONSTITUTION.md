# PPN Portal — Architecture Constitution
**Version 2.0 — Effective 2026-02-19**
**Primary USER Contact: INSPECTOR** (delegates to other agents on USER's behalf)
**Source of Truth: `public/turning_point.md`**

> ⚠️ ALL AGENTS MUST READ THIS DOCUMENT AT THE START OF EVERY SESSION.
> This supersedes all prior plans, MASTER_PLAN.md, and any work order written before 2026-02-19.

---

## 1. The Core Architecture — One Sentence

**PPN Portal is a structured clinical survey instrument where the survey questions are `ref_` tables, the answers are integer IDs stored in `log_` tables, and the analytics layer is pure COUNT/GROUP BY on those integers joined back to `ref_` for labels.**

Nothing else. That's the whole system.

---

## 2. The Data Model — Absolute Law

### What IS allowed in the database:

| Data Type | Examples |
|---|---|
| `INTEGER FK` | `session_focus_ids[]`, `observation_id`, `substance_id` |
| `NUMERIC score` | `phq9_score`, `heart_rate`, `confidence_sustaining` |
| `DATE / TIMESTAMP` | `session_date`, `recorded_at`, `check_date` |
| `BOOLEAN` | `attended`, `verified`, `is_resolved` |
| `CONSTRAINED VARCHAR` | `event_type IN ('dose_admin','vital_check',...)` |
| `UUID` | session references, user references |
| `VARCHAR(20) patient_id` | cryptographically random, site-scoped, never sequential |

### What is NEVER allowed:
- Free-text patient descriptions
- Names, DOB, or any linkable PHI
- Sequential patient IDs (PT-0001, PT-0002)
- Text columns without a `CHECK` constraint
- Any column that requires human interpretation to query

**If a practitioner types a sentence, it does not enter this database. Ever.**

---

## 3. The Two Table Patterns — Forever

```sql
-- Pattern A: Vocabulary (90% of future migrations)
CREATE TABLE ref_new_concept (
  concept_id  BIGINT PRIMARY KEY,
  label       TEXT NOT NULL,
  category    TEXT,
  is_active   BOOLEAN DEFAULT true,
  valid_from  DATE DEFAULT CURRENT_DATE,
  valid_to    DATE     -- NULL = currently active
);
INSERT INTO ref_new_concept VALUES (...);
ALTER TABLE ref_new_concept ENABLE ROW LEVEL SECURITY;
CREATE POLICY "authenticated_read" ON ref_new_concept FOR SELECT TO authenticated USING (true);

-- Pattern B: New tracking dimension (10% of future migrations)
ALTER TABLE log_relevant_table
  ADD COLUMN new_concept_id INTEGER REFERENCES ref_new_concept(concept_id);
```

**No other migration patterns exist.**

---

## 4. The Roundabout — Identity Layer (The Most Important Concept)

Every clinical encounter flows through ONE canonical center before reaching any table:

```
Real World          →    Roundabout (Identity Layer)    →    Database
─────────────            ──────────────────────────          ────────
"Jane Smith"        →    HMAC(name + site_secret + nonce) →  "PT-7K2MX9QR4F"
  walks in               traffic passes through               exits anonymized
                         original path is erased             can never go back
```

**Rules:**
- Patient IDs are generated via `crypto.randomBytes(8).toString('base64url').slice(0,9).toUpperCase()` prefixed with `PT-`
- The site-specific secret is stored in env variables, NEVER in the database
- The same patient at two different sites gets two different PT- codes
- Even PPN Portal staff cannot decode a patient ID without the site secret
- `patient_id` is `VARCHAR(20)` — ~281 trillion combinations, non-guessable, non-sequential
- **No form, no API, no query bypasses patient selection.** The PatientSelectModal IS the roundabout.

---

## 5. Service Layer Architecture — How Code Is Organized

`arcOfCareApi.ts` is being split. Final target:

```
src/services/
├── identity.ts        ← Patient ID generation, site resolution (getCurrentSiteId)
├── vocabulary.ts      ← All ref_ table reads + 24hr localStorage cache
├── clinicalLog.ts     ← All log_ table writes (one insert per form)
├── analytics.ts       ← All aggregate queries with k-anonymity guard
├── quality.ts         ← Documentation completeness scoring
└── auth.ts            ← Authentication layer (existing)
```

**Rules:**
- Every service passes through `identity.ts` to resolve patient context
- Services NEVER import from each other directly — only through `identity.ts`
- `vocabulary.ts` caches ALL ref_ data in `sessionStorage` with 24hr TTL
- Every analytics query in `analytics.ts` has HAVING COUNT(DISTINCT patient_id) >= 5

---

## 6. The Ref_ Picker Pattern — One Component, Three Modes

The universal interaction in every form:

```
≤12 items    → Full chip/button grid (current pattern)
13-40 items  → Grouped collapsible sections by category
41+ items    → Searchable dropdown, recently-used surfaced first
```

One `RefPicker` component handles all three modes automatically based on item count.

**The UX principle:** A practitioner mid-session should not think about the UI. Select options. Done. No typing.

---

## 7. Database Rules — Immutable

1. **Additive only.** Never DROP a column, never change a type, never DELETE a ref_ row.
2. **Soft-delete only.** Retire vocabulary items by setting `is_active = false` and `valid_to = CURRENT_DATE`. Never hard-delete.
3. **RLS on every table.** Every new table gets `ENABLE ROW LEVEL SECURITY` + an explicit policy. A table with RLS enabled but no policy is equivalent to `USING (false)`.
4. **GIN indexes on every array FK column.** `session_focus_ids INTEGER[]` without a GIN index will table-scan at 10k+ rows.
5. **Array FKs have no native constraint enforcement.** Validate array FK contents at the application layer before every insert.
6. **log_corrections table exists** for amending records. Never modify an original row. Annotate with a correction record instead.
7. **K-anonymity floor:** Never return an aggregate covering fewer than 5 distinct `patient_id` values. This is a query-level guard, not just a UI check.

---

## 8. Vocabulary Governance — The Growth Loop

```
Practitioner encounters unlisted concept
  → submits to log_vocabulary_requests (text stored temporarily)
  → Advisory Board reviews
  → Thresholds:
      ≥3 sites requested  → elevate to agenda
      ≥7 sites requested  → fast-track (30-day review)
      ≥15 sites requested → presumptive approval pending safety review
  → Approved: new row added to ref_ table
  → text in log_vocabulary_requests DELETED after conversion
  → requesting practitioners notified
  → all sites immediately benefit
```

**This loop IS the product moat.**

---

## 9. The QA Checklist — Five Items (Full List)

For every INSPECTOR review, the entire checklist is:

```
□ Does every selectable field FK to a ref_ table?
□ Is RLS enabled on every new table with at least one explicit policy?
□ Is there any TEXT column without a CHECK constraint?
□ Is patient_id always VARCHAR(20) cryptographically random?
□ Does the form store INTEGER IDs (not string labels)?
```

Five items. If all five pass, the work is correct. The architecture makes other mistakes structurally impossible.

---

## 10. Agent Role Boundaries — Strictly Enforced

| Agent | Does | Never Does |
|---|---|---|
| **CUE** | Intake, tickets, frontmatter | SQL, code, queries |
| **LEAD** | Architecture, routing, unblocking | Implementation |
| **PRODDY** | PRDs, vocabulary proposals, advisory board | Code, SQL |
| **DESIGNER** | UI specs, RefPicker design, accessibility | Backend, SQL |
| **SOOP** | All `.sql` migrations, schema decisions | React code |
| **BUILDER** | All `.tsx/.ts` implementation | Schema design |
| **MARKETER** | Copy, positioning, GTM | Code, SQL |
| **ANALYST** | Analytics queries, k-anon guards, KPIs | Frontend |
| **INSPECTOR** | Final QA gate, **primary USER contact**, delegates work | Writes code themselves |

---

## 11. Competitor Context — Safar (joinsafar.com)

- **What they do:** "OS for Human Transformation" — extends practitioner reach between sessions via voice analysis, AI adaptive protocols, PHQ-9/MEQ-30 tracking
- **Their edge:** Voice-based emotional sensing (we don't have this)
- **Our edge:** Clinical-grade data rigor, network federation, no PHI, IRB-compatible data model, ref_ vocabulary depth, benchmarking across sites
- **Design language:** They're "spiritual/wellness tech." We're clinical rigor with a premium UX. Different buyers — we target clinic administrators and regulatory-aware practitioners.
- **Advisory board:** They have one. We need ours seated before launch.

---

## 12. The Analytics Picture — Every Query Is This

```sql
-- "What focus areas are most common in integration sessions?"
SELECT r.focus_label, COUNT(*) as session_count
FROM log_integration_sessions li
CROSS JOIN unnest(li.session_focus_ids) AS focus_id
JOIN ref_session_focus_areas r ON r.focus_area_id = focus_id
WHERE COUNT(DISTINCT li.patient_id) >= 5  -- k-anonymity floor
GROUP BY r.focus_label
ORDER BY session_count DESC;
```

That's it. Every analytics query is a variation of this pattern. No text parsing. No ambiguity.

---

## 13. Current Database State (as of 2026-02-19)

**Migrations run on production:**
- `000-012`: Core tables, RLS, initial schema
- `054`: Form schema alignment (Wellness Journey columns)
- `055`: Test seed data (3 patients, 18 tables, ~180 rows after 2 runs)
- `056`: Audit trigger fixes (append_system_event, log_audit_event, auto_refresh_analytics)
- `057`: Analytics materialized views (mv_outcomes_summary, mv_clinic_benchmarks, mv_network_benchmarks)
- `058`: log_consent id sequence + seed RLS patch (user_id = practitioner_id)

**Known gaps (new migration queue):**
- `ref_` table seeds don't match form component constants → FK IDs decode to wrong labels in analytics
- No GIN indexes on array FK columns
- No `log_vocabulary_requests` table
- No `log_corrections` table
- Patient IDs still VARCHAR(10) sequential — needs HMAC upgrade

---

## 14. New Work Order Registry (WO-200+)

All work orders below WO-200 are archived. Active pipeline:

| WO | Title | Owner | Priority |
|---|---|---|---|
| WO-200 | Ref_ Tables Reseed (sync to form constants) | SOOP | 🔴 CRITICAL |
| WO-201 | GIN Indexes on Array FK Columns | SOOP | 🔴 CRITICAL |
| WO-202 | log_vocabulary_requests Table | SOOP | 🟡 HIGH |
| WO-203 | log_corrections Table | SOOP | 🟡 HIGH |
| WO-204 | HMAC Patient ID Upgrade (VARCHAR 20) | SOOP | 🟡 HIGH |
| WO-205 | RefPicker Unified Component (3 modes) | DESIGNER | 🟡 HIGH |
| WO-206 | Service Layer Isolation (split arcOfCareApi.ts) | BUILDER | 🟡 HIGH |
| WO-207 | K-Anonymity Floor on Analytics Queries | ANALYST | 🟡 HIGH |
| WO-208 | Advisory Board PRD | PRODDY | 🟡 HIGH |
| WO-209 | Documentation Quality Scoring System | PRODDY | 🟢 NORMAL |
| WO-210 | Fix Consent Form + Patient List (immediate bugs) | SOOP+BUILDER | ✅ IN PROGRESS |

---

## 15. How to Use the AI Effectively (for the USER)

- **Start every session:** "Read ARCHITECTURE_CONSTITUTION.md" — this resyncs all agents
- **For new features:** Describe what a practitioner needs to do. The agents will map it to ref_/log_ patterns.
- **For bugs:** Paste the error. Don't diagnose — let INSPECTOR triage first.
- **For strategy:** Tag PRODDY or LEAD. They think at the product level.
- **For schema:** Tag SOOP. No schema changes happen without SOOP writing the migration.
- **For UI:** Tag DESIGNER. They design first, BUILDER builds second.
- **You don't need to know what an FK is.** When you said "logging combinations of reference queries" — that IS a foreign key. The team translates concepts to code.

---

*Last updated: 2026-02-19 02:09 PST*
*Source conversation: `public/turning_point.md`*
*Next checkpoint: After WO-200 and WO-201 are deployed*
