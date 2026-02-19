---
id: WO-090
title: "Clients Table — Ghost Record (Zero-Knowledge Client Identity)"
status: 03_BUILD
owner: SOOP
ticket_type: EVALUATION (not a direct build order)
priority: P2 (High)
category: Database / Privacy / Zero-Knowledge / Grey Market
failure_count: 0
created_date: 2026-02-17T18:51:06-08:00
estimated_complexity: 8/10
source: gemini_recommendation
proddy_validation_required: true
strategic_alignment: Grey Market "Phantom Shield" — Zero-Knowledge Architecture
requested_by: Trevor Calton
related_tickets:
  - WO_002 (06_COMPLETE — Shadow Market Schema, has client_blind_hash on sessions table)
  - migration 022_shadow_market_schema.sql (DEPLOYED — client_blind_hash on log_sm_sessions)
---

# User Request (Verbatim)

> 1. Clients Table ("Ghost" Record)
> Instead of storing PII, we store an encrypted blob and a blind index for lookups.

```sql
CREATE TABLE clients (
    client_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    practitioner_id UUID REFERENCES practitioners(id),
    
    -- BLIND INDEXING (For "Bad Actor" Checks & Lookups)
    -- This is a HMAC-SHA256 hash of the phone number using a secret 'Pepper' key 
    -- stored ONLY on the mobile device/HSM. The server never sees the real number.
    phone_blind_index_hash VARCHAR(64) NOT NULL UNIQUE, 
    
    -- ENCRYPTED IDENTITY (For the Practitioner's Eyes Only)
    -- This field contains the JSON blob {"name": "John Doe", "notes": "..."}
    -- Encrypted client-side with the Practitioner's Key. Server sees garbage.
    encrypted_identity_blob TEXT NOT NULL,
    
    -- RISK FLAGS (Visible to Server for Vetting Logic)
    -- Set by the practitioner to warn the network (e.g., "Violent", "Non-Payment")
    risk_flag_status VARCHAR(20) DEFAULT 'CLEAN' CHECK (risk_flag_status IN ('CLEAN', 'WATCHLIST', 'BANNED')),
    risk_notes_hash VARCHAR(64), -- Content of the risk is also hashed/hidden
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## Strategic Context

This table is the **privacy-preserving foundation for a client identity network** across grey market practitioners. The core insight: practitioners need to share risk signals about bad actors (violent clients, non-payers) without exposing client PII to the server or to each other.

**The "Ghost" pattern:**
- Server stores only: a peppered HMAC hash (for lookups) + an encrypted blob (unreadable to server) + a risk flag (readable to server for vetting)
- Practitioner's device stores: the decryption key and the pepper
- Result: Server can answer "Is this phone number on the watchlist?" without ever knowing the phone number

---

## Relationship to Existing Schema

### What Already Exists (Do NOT duplicate)

`log_sm_sessions.client_blind_hash` (migration 022 — DEPLOYED):
- Plain SHA-256 hash of client identifier on the **sessions** table
- Used for session-level client tracking
- **Not peppered** (no HMAC secret key) — weaker privacy guarantee
- **Not a standalone client record** — no identity blob, no risk flags

### What This Adds (Net-New)

A dedicated **`clients` entity** with:
1. **Peppered HMAC blind index** (stronger than plain SHA-256 — requires device-held pepper to compute)
2. **Client-side encrypted identity blob** (server sees ciphertext only)
3. **Network-level risk flagging** (`CLEAN` / `WATCHLIST` / `BANNED`)
4. **Practitioner ownership** (FK to practitioners table)

---

## Technical Deep-Dive

### Blind Indexing (HMAC-SHA256 with Pepper)

```
// On practitioner's device only:
pepper = device_secure_storage.get('CLIENT_PEPPER')  // Never sent to server
phone_normalized = normalize("+1-555-867-5309")       // E.164 format
blind_index = HMAC-SHA256(key=pepper, data=phone_normalized)
// → "a3f9c2d1..." (64 hex chars)

// Server receives only the blind index — never the phone number
// Server can answer: "Does this blind index exist?" → Yes/No
// Server CANNOT reverse the blind index to get the phone number
```

**Why HMAC over plain SHA-256?**
- Plain SHA-256 is reversible via rainbow tables (phone numbers have limited entropy)
- HMAC with a device-held pepper requires the pepper to compute — server cannot brute-force

### Client-Side Encryption (Identity Blob)

```typescript
// On practitioner's device:
const identityJSON = JSON.stringify({
  name: "John Doe",
  notes: "Referred by Dr. Smith. History of anxiety.",
  dob_year: 1985,  // Year only — no full DOB
});

// Encrypt with practitioner's key (derived from their real PIN)
const encryptedBlob = await crypto.subtle.encrypt(
  { name: 'AES-GCM', iv: crypto.getRandomValues(new Uint8Array(12)) },
  practitionerKey,
  new TextEncoder().encode(identityJSON)
);

// Server stores base64(encryptedBlob) — sees only garbage
```

### Risk Flag Network Logic

```
Practitioner A flags client as WATCHLIST
  → Server stores: phone_blind_index_hash = "a3f9...", risk_flag_status = "WATCHLIST"
  → Server does NOT store why (risk_notes_hash is hashed)

Practitioner B looks up new client by phone:
  → Device computes blind index from phone + pepper
  → Queries: SELECT risk_flag_status FROM clients WHERE phone_blind_index_hash = ?
  → Server returns: "WATCHLIST"
  → Practitioner B sees warning — without server knowing who was looked up
```

---

## Key Design Questions for PRODDY

1. **Pepper sharing:** If the pepper is device-only, how does a practitioner look up a client on a new device? (Options: QR code transfer, encrypted backup, HSM)
2. **Network scope:** Is the risk flag network opt-in? Can practitioners see flags set by OTHER practitioners, or only their own?
3. **`practitioners` table:** Does this table exist? Current schema has `auth.users` — a `practitioners` profile table may need to be created first.
4. **Conflict with existing `client_blind_hash`:** Should `log_sm_sessions.client_blind_hash` be migrated to reference this new `clients` table? (Additive-only rule applies — cannot modify existing column)
5. **Legal exposure:** A network-level `BANNED` flag for a client raises due process questions. Who can set it? Can it be appealed? PRODDY should evaluate this carefully.

---

## Overlap Analysis

| Feature | `log_sm_sessions.client_blind_hash` (existing) | `clients` table (this ticket) |
|---|---|---|
| Blind index | ✅ Plain SHA-256 | ✅ HMAC-SHA256 with pepper (stronger) |
| Encrypted identity | ❌ | ✅ Client-side AES-GCM blob |
| Risk flags | ❌ | ✅ CLEAN / WATCHLIST / BANNED |
| Standalone entity | ❌ (column on sessions) | ✅ First-class table |
| Network lookup | ❌ | ✅ Cross-practitioner vetting |
| Practitioner ownership | ❌ | ✅ FK to practitioners |

---

## Acceptance Criteria (If Approved)

### Database
- [ ] `clients` table created (additive — does not modify existing tables)
- [ ] RLS: practitioners see only their own client records
- [ ] RLS: `risk_flag_status` readable by any authenticated practitioner (for network vetting)
- [ ] No UPDATE policy on `phone_blind_index_hash` (immutable once set)
- [ ] No plain-text PII anywhere in the table

### Application
- [ ] Blind index computed client-side before any server call
- [ ] Identity blob encrypted client-side before any server call
- [ ] Pepper stored in device secure storage (never transmitted)
- [ ] Risk flag lookup works cross-practitioner

### Security
- [ ] Server cannot reverse blind index without device pepper
- [ ] Server cannot read identity blob without practitioner key
- [ ] Risk flag content (`risk_notes_hash`) never stored in plaintext

---

## 🚦 Status

**01_TRIAGE → PRODDY** — Evaluation ticket. PRODDY to assess:
1. Strategic fit with current roadmap
2. Whether `practitioners` table needs to be created first
3. Legal/ethical implications of network-level `BANNED` flag
4. Pepper management UX (new device onboarding)
5. Migration path from existing `client_blind_hash` column

May not proceed to BUILD without PRODDY sign-off.

---

## 📣 PRODDY STRATEGIC EVALUATION — COMPLETE (2026-02-18 00:09 PST)

### VERDICT: ⚠️ CONDITIONAL APPROVAL — Resolve 3 Blockers Before Build

**1. Strategic Fit:** ✅ HIGH. Zero-knowledge client identity is a core Phantom Shield differentiator. The HMAC-SHA256 blind index is the right approach — stronger than the existing plain SHA-256 in `log_sm_sessions`.

**2. Blockers Resolved:**

**Blocker 1 — Pepper Management:** Use QR code transfer for new device onboarding. Practitioner scans QR from existing device to transfer pepper to new device. Simple, no server involvement. Document in user guide.

**Blocker 2 — Network Scope:** Risk flag network is OPT-IN. Practitioners must explicitly enable cross-practitioner vetting. Default = private (only see your own flags). This eliminates the due process concern for the MVP.

**Blocker 3 — `BANNED` flag legal exposure:** DEFER the `BANNED` status for MVP. Ship with only `CLEAN` and `WATCHLIST`. The `BANNED` flag requires a dispute/appeal mechanism that is out of scope for MVP. Add `BANNED` in Phase 2 with proper governance.

**3. `practitioners` table:** SOOP must check if this table exists before writing migration. If not, create a minimal `practitioners` profile table as a prerequisite.

**4. Migration path from `client_blind_hash`:** Do NOT migrate existing column. Create new `clients` table as additive. The existing `client_blind_hash` on `log_sm_sessions` can reference the new table via a new FK column added additively.

**PRODDY SIGN-OFF:** ✅ Conditionally approved. Remove `BANNED` status for MVP. Opt-in network only. Route to SOOP.

**Routing:** `owner: LEAD` — route to SOOP for schema (check `practitioners` table first).
