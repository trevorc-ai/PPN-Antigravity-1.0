---
id: WO-089
title: "Legacy Transcript — Cryptographically Verified Proof of Experience"
status: 04_QA
owner: INSPECTOR
ticket_type: EVALUATION (not a direct build order)
priority: P2 (High)
category: Feature / Trust / Legal Defense / Grey Market
failure_count: 0
created_date: 2026-02-17T18:47:35-08:00
estimated_complexity: 8/10
feasibility: Medium-High (8/10)
strategic_alignment: Grey Market "Phantom Shield" (Extension of Model #2)
requested_by: Trevor Calton
source: gemini_recommendation
proddy_validation_required: true
related_tickets:
  - WO_006 (07_ARCHIVED — stats dashboard only, no crypto signing)
  - WO-077 (01_TRIAGE — plain PDF export, no tamper-proof chain)
---


## AGENT INSTRUCTIONS
1.  **READ**: Review the Pre-Screen Brief.
2.  **EXECUTE**: detailed Pre-Screen Audit (INSPECTOR).
3.  **HANDOFF**: Follow the instructions at the bottom of this file.

# User Request (Verbatim)

> "Legacy Transcript" (Proof of Experience)
> Feasibility: Medium-High (8/10). The challenge is trust. How do we know the user didn't just type in "500 sessions" yesterday?
> Technical Implementation:
> Cryptographic Signing: Every time a session is logged, the server generates a digital signature (hash) of that log.
> Chain: "Transcript" is just a collection of these signatures.
> Proof: When the user exports their PDF, it includes a QR code that validates against the server's signatures: "Verified: This log was created on Feb 14, 2025, and has not been altered."
> Real-World Precedent: DocuSign and Chain-of-Custody software in law enforcement.

---

## Strategic Context

This feature addresses the **trust problem** in grey market credentialing: a practitioner claiming "500 sessions of experience" has no verifiable proof. Anyone could fabricate session counts retroactively.

The Legacy Transcript creates a **cryptographically verifiable record of experience** — a practitioner's "résumé" that cannot be backdated or falsified, because each session log is signed by the server at the moment of creation.

**Real-World Precedents:**
- **DocuSign** — Tamper-evident document signing with audit trail
- **Chain-of-Custody software** (law enforcement) — Immutable evidence logs
- **Certificate Transparency Logs** — Append-only, publicly verifiable logs
- **Git commit signing** — Cryptographic proof of authorship and timestamp

**Use Cases:**
1. Practitioner applies to a training program: "Here is my verified transcript of 200 sessions"
2. Practitioner defends competency in court: "My logs prove I had 3 years of documented experience"
3. Insurance underwriter assesses risk: "Verified session count and safety score"
4. Peer supervision network vets a new member: "Scan QR to verify their experience"

---

## The Trust Problem (Core Challenge)

> "How do we know the user didn't just type in '500 sessions' yesterday?"

Without cryptographic signing, any session count is self-reported and unverifiable. The solution is:

1. **Server-side signing at creation time** — When a session is saved, the server immediately generates an HMAC-SHA256 signature of the session data + timestamp
2. **Append-only chain** — Each new signature references the previous one (like a blockchain, but simpler)
3. **Verification endpoint** — A public URL that accepts a signature and returns: "✅ Verified: Created Feb 14, 2025. Not altered."
4. **QR code in PDF** — Links to the verification endpoint with the session's signature hash

---

## Technical Implementation

### Architecture: Server-Side HMAC Signing

```
Session saved by user
  → Supabase Edge Function triggered (on INSERT to log_sessions)
  → Function generates:
      signature = HMAC-SHA256(
        key: SERVER_SIGNING_SECRET,
        data: session_id + practitioner_id_hash + created_at_utc + session_count
      )
  → Stores signature in session_signatures table
  → Signature is immutable (no UPDATE policy)
```

### New Database Table: `session_signatures`

```sql
CREATE TABLE session_signatures (
    signature_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES log_sessions(session_id) ON DELETE RESTRICT,
    -- HMAC-SHA256 of (session_id || practitioner_hash || created_at)
    signature_hex TEXT NOT NULL,
    -- Reference to previous signature (chain integrity)
    previous_signature_hex TEXT,
    -- Server timestamp at signing (not user-controlled)
    signed_at_utc TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    -- Incremental session number for this practitioner
    session_sequence_number INTEGER NOT NULL,
    -- Public verification token (safe to embed in QR code)
    verification_token UUID DEFAULT gen_random_uuid() NOT NULL,

    CONSTRAINT unique_session_signature UNIQUE (session_id),
    CONSTRAINT unique_verification_token UNIQUE (verification_token)
);

-- Indexes
CREATE INDEX idx_session_signatures_session_id ON session_signatures(session_id);
CREATE INDEX idx_session_signatures_verification_token ON session_signatures(verification_token);

-- RLS: Practitioners can read their own signatures
ALTER TABLE session_signatures ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Practitioners can view own signatures"
    ON session_signatures FOR SELECT
    USING (
        session_id IN (
            SELECT session_id FROM log_sessions
            WHERE practitioner_id = auth.uid()
        )
    );

-- NO INSERT policy (server-only via Edge Function)
-- NO UPDATE policy (immutable)
-- NO DELETE policy (immutable)
```

### Supabase Edge Function: `sign-session`

```typescript
// supabase/functions/sign-session/index.ts
// Triggered via database webhook on INSERT to log_sessions

import { createHmac } from "https://deno.land/std/crypto/mod.ts";

Deno.serve(async (req) => {
  const { session_id, practitioner_hash, created_at } = await req.json();

  // Get previous signature for chain integrity
  const { data: prevSig } = await supabase
    .from('session_signatures')
    .select('signature_hex, session_sequence_number')
    .eq('practitioner_hash', practitioner_hash)
    .order('session_sequence_number', { ascending: false })
    .limit(1)
    .single();

  const sequenceNumber = (prevSig?.session_sequence_number ?? 0) + 1;
  const previousHex = prevSig?.signature_hex ?? '0'.repeat(64);

  // Generate HMAC-SHA256 signature
  const payload = `${session_id}|${practitioner_hash}|${created_at}|${sequenceNumber}|${previousHex}`;
  const signature = createHmac('sha256', Deno.env.get('SESSION_SIGNING_SECRET')!)
    .update(payload)
    .digest('hex');

  // Store signature (server-only insert, bypasses RLS)
  await supabase.from('session_signatures').insert({
    session_id,
    signature_hex: signature,
    previous_signature_hex: previousHex,
    signed_at_utc: new Date().toISOString(),
    session_sequence_number: sequenceNumber,
  });

  return new Response(JSON.stringify({ success: true, signature }));
});
```

### Public Verification Endpoint

```typescript
// supabase/functions/verify-session/index.ts
// Public endpoint — no auth required

Deno.serve(async (req) => {
  const url = new URL(req.url);
  const token = url.searchParams.get('token');

  const { data: sig } = await supabase
    .from('session_signatures')
    .select('signature_hex, signed_at_utc, session_sequence_number, previous_signature_hex')
    .eq('verification_token', token)
    .single();

  if (!sig) {
    return new Response(JSON.stringify({
      verified: false,
      message: "Token not found or invalid."
    }), { status: 404 });
  }

  // Re-derive and compare signature to detect tampering
  // (server recomputes HMAC and compares to stored value)
  const isValid = await recomputeAndVerify(sig);

  return new Response(JSON.stringify({
    verified: isValid,
    signed_at: sig.signed_at_utc,
    session_number: sig.session_sequence_number,
    message: isValid
      ? `✅ Verified: This session log was created on ${sig.signed_at_utc} and has not been altered.`
      : `❌ Verification failed: This record may have been tampered with.`
  }));
});
```

### PDF Export: Legacy Transcript

The exported PDF includes:

```
┌─────────────────────────────────────────────────────────┐
│           PPN RESEARCH PORTAL                           │
│        VERIFIED PRACTITIONER TRANSCRIPT                 │
│                                                         │
│  Practitioner ID: [Anonymized Hash]                     │
│  Export Date: February 17, 2026                         │
│  Verification Status: ✅ CRYPTOGRAPHICALLY VERIFIED     │
│                                                         │
│  ─────────────────────────────────────────────────────  │
│                                                         │
│  EXPERIENCE SUMMARY                                     │
│  Total Verified Sessions: 47                            │
│  Date Range: Jan 2024 – Feb 2026 (verified)             │
│  Safety Score: 94.2% (sessions without intervention)    │
│  Unique Protocols: 12                                   │
│                                                         │
│  ─────────────────────────────────────────────────────  │
│                                                         │
│  SESSION LOG (Cryptographically Signed)                 │
│                                                         │
│  #47  Feb 14, 2026  [QR] Sig: a3f9...c2d1              │
│  #46  Feb 01, 2026  [QR] Sig: 8b2e...f4a7              │
│  #45  Jan 22, 2026  [QR] Sig: 1c7d...e9b3              │
│  ...                                                    │
│                                                         │
│  ─────────────────────────────────────────────────────  │
│                                                         │
│  CHAIN INTEGRITY: ✅ All 47 signatures form a           │
│  verified, unbroken chain. No gaps detected.            │
│                                                         │
│  [QR CODE — Scan to verify entire transcript]           │
│  https://ppn.app/verify?token=abc123...                 │
│                                                         │
│  ─────────────────────────────────────────────────────  │
│  ⚠️ This transcript is for documentation purposes only. │
│  Not a professional license or medical credential.      │
└─────────────────────────────────────────────────────────┘
```

---

## Distinction from Existing Tickets

| Feature | WO_006 (Archived) | WO-077 (Triage) | WO-089 (This ticket) |
|---|---|---|---|
| PDF export | ✅ | ✅ | ✅ |
| Session stats | ✅ | ✅ | ✅ |
| Digital signatures | ❌ | Placeholder only | ✅ Real HMAC-SHA256 |
| Server-side signing | ❌ | ❌ | ✅ Edge Function |
| Tamper detection | ❌ | ❌ | ✅ Chain verification |
| QR code verification | ❌ | ❌ | ✅ Public endpoint |
| Chain integrity | ❌ | ❌ | ✅ Linked signatures |
| Backdating prevention | ❌ | ❌ | ✅ Server timestamp |

---

## Open Questions for LEAD

1. **Signing secret rotation:** How do we handle `SESSION_SIGNING_SECRET` rotation without invalidating old signatures? (Answer: store key version alongside signature)
2. **Chain scope:** Should the chain be per-practitioner or global? Per-practitioner is simpler and sufficient.
3. **WO-077 integration:** Should this ticket extend WO-077's PDF export, or be a separate "Transcript" export distinct from the "Audit Report"?
4. **Public verification privacy:** The verification endpoint reveals `signed_at` and `session_sequence_number`. Is this acceptable for a public endpoint, or should it require a token?

---

## Acceptance Criteria

### Cryptographic Integrity
- [ ] Every new session INSERT triggers server-side HMAC-SHA256 signing
- [ ] Each signature references the previous (chain integrity)
- [ ] Signatures stored in `session_signatures` with no UPDATE/DELETE policies
- [ ] Public verification endpoint returns tamper status + creation date
- [ ] Re-computation of HMAC detects any data alteration

### PDF Export
- [ ] "Legacy Transcript" PDF includes all signed sessions
- [ ] Each session row shows sequence number, date, and truncated signature
- [ ] QR code per session links to public verification endpoint
- [ ] Master QR code verifies entire transcript chain
- [ ] Chain integrity summary ("All 47 signatures verified, unbroken")

### Security
- [ ] `SESSION_SIGNING_SECRET` stored as Supabase secret (never in code)
- [ ] Verification endpoint is rate-limited (prevent brute force)
- [ ] No PHI/PII in signatures or verification response
- [ ] Practitioner identity is anonymized hash only

### Accessibility
- [ ] PDF is screen-reader compatible (searchable text, not images)
- [ ] QR codes have text alternative (URL printed below)
- [ ] Minimum 12px fonts throughout
- [ ] High contrast for dark mode PDF theme

---

## Dependencies

- `log_sessions` table (exists — WO_002 COMPLETE)
- Supabase Edge Functions (available)
- `SESSION_SIGNING_SECRET` environment variable (new — SOOP/LEAD to provision)
- WO-077 (Exportable Audit Reports) — coordinate PDF template

## Estimated Timeline

- **Database schema (`session_signatures`):** 2 hours (SOOP)
- **Edge Function (`sign-session`):** 4-6 hours (BUILDER)
- **Verification endpoint (`verify-session`):** 3-4 hours (BUILDER)
- **PDF transcript template:** 4-6 hours (BUILDER)
- **QR code generation:** 2 hours (BUILDER)
- **Security audit:** 2-3 hours (INSPECTOR)

**Total:** 17-22 hours (2-3 days)

---

## 🚦 Status

**01_TRIAGE → PRODDY** — Evaluation ticket. PRODDY to assess strategic fit, user demand, and build priority before any pipeline commitment. May not proceed to BUILD.

---

## 🔍 INSPECTOR PRE-SCREEN BRIEF (2026-02-17T23:15 PST)

**Type:** Pre-build security + feasibility audit.

**INSPECTOR: Review this spec and confirm before BUILDER begins:**

1. **Cryptographic design** — Is HMAC-SHA256 with a server-held secret the right approach? Confirm the signing secret rotation strategy (key versioning) is addressed before build.
2. **`log_sessions` FK reference** — The `session_signatures` table references `log_sessions(session_id)` but the live table PK is `id`, not `session_id`. Verify column name before SOOP writes the migration.
3. **Edge Function security** — The `sign-session` function bypasses RLS to insert. Confirm this is acceptable and document the service-role key usage.
4. **Public verification endpoint** — Confirm the endpoint reveals no PHI. `signed_at` + `session_sequence_number` are safe to expose publicly.
5. **WO-077 coordination** — Does WO-077 (Exportable Audit Reports) already have a PDF template? Avoid duplicate PDF infrastructure.

**Output:** Append `## INSPECTOR PRE-SCREEN: [PASS/FAIL]` with notes. PASS → `03_BUILD`. FAIL → `01_TRIAGE`.

---

## 📣 PRODDY STRATEGIC EVALUATION — COMPLETE (2026-02-18 00:09 PST)

### VERDICT: ✅ APPROVED — P2, Coordinate with WO-077, Key Version in Signature

**1. Strategic Fit:** ✅ HIGH. The trust problem is real and unsolved. No competitor offers cryptographically verified experience transcripts. This is a genuine moat and a powerful sales tool for both segments.

**2. Open Questions Resolved:**
- **Signing secret rotation:** Store `key_version` (integer) alongside each signature. When rotating, increment version. Verification endpoint uses the correct key for the version stored. Old signatures remain valid.
- **Chain scope:** Per-practitioner chain. Simpler, sufficient, and avoids cross-practitioner data leakage.
- **WO-077 integration:** This is a SEPARATE export from WO-077's Audit Report. WO-077 = operational audit trail. WO-089 = credentialing transcript. Different audiences, different use cases. Coordinate on PDF template infrastructure only (share the PDF generation library).
- **Public verification privacy:** `signed_at` + `session_sequence_number` are safe to expose. No PHI. Acceptable.

**3. INSPECTOR Pre-Screen:** PRODDY endorses the pre-screen brief. The FK column name issue (`session_id` vs `id`) is a real risk — SOOP must verify live schema before writing migration.

**4. Priority:** Build AFTER WO-077 (Exportable Audit Reports) — share PDF infrastructure. Sequence: WO-077 → WO-089.

**PRODDY SIGN-OFF:** ✅ Approved. Route to INSPECTOR for pre-screen, then SOOP, then BUILDER.

**Routing:** `owner: LEAD` — route to INSPECTOR pre-screen first.

---

## HANDOFF INSTRUCTIONS
**IF YOU ARE INSPECTOR (PRE-SCREEN):**
1.  **PASS**:
    - Change `status` to `03_BUILD`.
    - Change `owner` to `SOOP`.
    - Move file to `_WORK_ORDERS/03_BUILD/`.
2.  **FAIL**:
    - Change `status` to `01_TRIAGE`.
    - Change `owner` to `PRODDY`.
    - Move file to `_WORK_ORDERS/01_TRIAGE/`.

