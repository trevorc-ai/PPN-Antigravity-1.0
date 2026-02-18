---
id: WO-088
title: "Duress Mode (Fake PIN) — Hidden Database Switching"
status: 01_TRIAGE
owner: PRODDY
ticket_type: EVALUATION (not a direct build order)
priority: P2 (High)
category: Feature / Security / Grey Market / Legal Defense
failure_count: 0
created_date: 2026-02-17T18:46:45-08:00
estimated_complexity: 7/10
feasibility: Medium (7/10)
strategic_alignment: Grey Market "Phantom Shield" (Extension of Model #2)
requested_by: Trevor Calton
source: gemini_recommendation
proddy_validation_required: true
---

# User Request (Verbatim)

> "Duress Mode" (Fake PIN)
> Feasibility: Medium (7/10). Easy to build, hard to get right on iOS/Android due to OS limitations.
> Technical Implementation:
> Local Storage: The app uses an encrypted local database (like Realm or SQLCipher).
> The Trick: The database is encrypted with the User's PIN.
> If they enter PIN 1234 (Real), it decrypts the Real database key.
> If they enter PIN 9999 (Duress), the app logic detects this specific PIN and initializes a fresh, empty database in memory.
> Constraint: You cannot "delete" data securely on flash storage instantly (it takes time). The safer route is to simply not show the data.
> Real-World Precedent: Calculator Vault Apps (hidden photo vaults) and Ledger Hardware Wallets (which have a secondary PIN for a hidden wallet).

---

## Strategic Context

This feature extends the **Grey Market "Phantom Shield"** initiative (WO-059–062). It addresses a specific threat model: **coerced access** — a scenario where a practitioner is pressured (by law enforcement, a hostile party, or a client) to unlock the app and reveal session data.

The Duress PIN creates **plausible deniability**: the app appears empty and innocent when the secondary PIN is entered, while the real data remains encrypted and inaccessible.

**Real-World Precedents:**
- **Calculator Vault Apps** — Hidden photo vaults that appear as a normal calculator
- **Ledger Hardware Wallets** — Secondary PIN unlocks a hidden, empty wallet
- **VeraCrypt Hidden Volumes** — Two passwords: one reveals real data, one reveals decoy data

---

## Threat Model

| Threat | Without Duress Mode | With Duress Mode |
|---|---|---|
| Law enforcement demands phone unlock | Real session data exposed | App shows empty state |
| Hostile client demands to see records | All records visible | No records visible |
| Phone seized/confiscated | Data accessible if PIN known | Duress PIN shows nothing |
| Coerced unlock under pressure | Practitioner has no recourse | Practitioner enters Duress PIN |

---

## Technical Implementation

### Architecture Decision: Web App Constraint

**Critical Note:** This is a **React web app** (not a native iOS/Android app). This changes the implementation significantly:

- ❌ **Cannot use:** Realm, SQLCipher (native mobile only)
- ✅ **Can use:** IndexedDB + Web Crypto API, or Supabase with dual-key RLS

### Recommended Approach: Dual-Key Supabase Architecture

**Option A: Client-Side Encryption (Recommended)**

```
User enters PIN 1234 (Real PIN)
  → Derives encryption key via PBKDF2(PIN, salt)
  → Decrypts locally-cached session data
  → Shows real data

User enters PIN 9999 (Duress PIN)  
  → App detects duress condition (PIN matches stored duress hash)
  → Initializes empty in-memory state
  → Does NOT attempt to decrypt real data
  → Shows empty dashboard — "No sessions recorded"
```

**Option B: Supabase RLS Dual-Profile (Simpler)**

```
Real PIN → logs in as primary Supabase user (real data)
Duress PIN → logs in as secondary "shadow" Supabase user (empty account)
  → Shadow account has zero data
  → Forensically indistinguishable from a new account
```

### Key Technical Constraints

1. **Flash Storage Constraint:** Cannot securely wipe data instantly on flash storage. Solution: **never show data**, not delete it.
2. **Web Crypto API:** Available in all modern browsers. Use `PBKDF2` for PIN-to-key derivation.
3. **No PIN Storage in Plaintext:** Store only `PBKDF2(PIN, salt)` hashes — never the raw PIN.
4. **Duress Detection:** Compare entered PIN hash against stored duress PIN hash. If match → empty state.
5. **Timing Attack Prevention:** Both PIN checks must take equal time (constant-time comparison).

### Database Schema Addition

```sql
-- Extend existing user profile table (additive only)
ALTER TABLE user_profiles
  ADD COLUMN IF NOT EXISTS duress_pin_hash TEXT,        -- PBKDF2 hash of duress PIN
  ADD COLUMN IF NOT EXISTS duress_pin_salt TEXT,        -- Salt for duress PIN hash
  ADD COLUMN IF NOT EXISTS duress_mode_enabled BOOLEAN DEFAULT FALSE;

-- Note: real_pin_hash is managed by Supabase Auth (not stored here)
-- Note: is_duress_mode already exists in log_sessions (WO_002 — COMPLETE)
```

### Frontend Logic

```typescript
// PIN verification flow
async function verifyPIN(enteredPIN: string): Promise<'real' | 'duress' | 'invalid'> {
  const storedRealHash = await getRealPINHash();      // From Supabase Auth
  const storedDuressHash = await getDuressPINHash();  // From user_profiles

  const enteredHash = await pbkdf2Hash(enteredPIN, salt);

  // Constant-time comparison (prevents timing attacks)
  const isReal = constantTimeEqual(enteredHash, storedRealHash);
  const isDuress = constantTimeEqual(enteredHash, storedDuressHash);

  if (isReal) return 'real';
  if (isDuress) return 'duress';
  return 'invalid';
}

// Duress mode state
function initializeDuressMode() {
  // Do NOT fetch any real data
  // Initialize empty in-memory state only
  setSessionData([]);
  setClientData([]);
  setDuressActive(true);
  // Log nothing — no audit trail of duress activation
}
```

---

## UI/UX Requirements

### PIN Entry Screen
- Standard numeric PIN pad (4-6 digits)
- **No visual difference** between real and duress PIN entry (critical for plausible deniability)
- No "Duress Mode" label anywhere visible
- Biometric unlock (Face ID / Touch ID) should only unlock real mode

### Duress State UI
- App appears completely normal — same UI, same navigation
- Dashboard shows: "No sessions recorded yet. Start your first session."
- All data sections show empty states
- **No banner, no indicator, no visual tell** that duress mode is active
- Settings page shows duress PIN setup option (labeled as "Secondary PIN" or "Guest Mode")

### Settings: Duress PIN Setup
- Located in: Settings → Security → Secondary PIN
- Label: "Guest Mode PIN" (not "Duress PIN" — avoids tipping off adversaries)
- Warning: "If entered, app will show an empty workspace. Use to protect sensitive data."
- Requires current real PIN to enable

---

## Acceptance Criteria

### Functionality
- [ ] User can set a secondary "Guest Mode" PIN in Settings → Security
- [ ] Entering real PIN shows all real session data
- [ ] Entering duress PIN shows completely empty app state
- [ ] Entering wrong PIN shows standard error (no hint about duress PIN)
- [ ] Biometric unlock only works for real mode
- [ ] No data is deleted — only hidden from view

### Security
- [ ] PINs stored only as PBKDF2 hashes (never plaintext)
- [ ] Constant-time comparison prevents timing attacks
- [ ] No audit log created when duress mode is activated
- [ ] No visual indicator distinguishes duress from real mode
- [ ] Duress state is in-memory only (cleared on app close)

### Privacy
- [ ] No PHI/PII exposed in duress mode
- [ ] Duress mode leaves no forensic trace in app logs
- [ ] `is_duress_mode` flag in `log_sessions` is NEVER set to `true` in duress state (no writes)

### Accessibility
- [ ] PIN pad meets WCAG 2.1 AA contrast requirements
- [ ] Keyboard navigation works on PIN entry
- [ ] Screen reader does not announce "duress" or "hidden" anywhere
- [ ] Minimum 12px fonts throughout

---

## Dependencies

**Prerequisites:**
- Supabase Auth (already in place)
- `user_profiles` table (verify exists before schema addition)
- `is_duress_mode` field in `log_sessions` (already exists — WO_002 COMPLETE)

**Related Features:**
- WO_002 Shadow Market Schema (COMPLETE — `is_duress_mode` field already exists)
- WO-059 Potency Normalizer (Phantom Shield suite)
- WO-060 Crisis Logger (Phantom Shield suite)
- WO-061 Cockpit Mode UI (Phantom Shield suite)

---

## Open Questions for LEAD

1. **Option A vs B:** Client-side encryption (Web Crypto) vs. dual Supabase user accounts? Option B is simpler but requires managing two auth accounts per user.
2. **Biometric scope:** Should Face ID / Touch ID be disabled entirely in favor of PIN-only for this feature?
3. **Duress PIN length:** Should duress PIN be required to differ from real PIN by ≥ 2 digits to prevent accidental activation?
4. **Audit trail:** Should duress mode activation be silently logged server-side (for product analytics) or truly zero-trace?

---

## Estimated Timeline

- **Schema addition:** 1 hour (SOOP)
- **PIN verification logic:** 4-6 hours (BUILDER)
- **Duress state management:** 3-4 hours (BUILDER)
- **Settings UI (Guest Mode PIN setup):** 3-4 hours (BUILDER)
- **Security audit:** 2-3 hours (INSPECTOR)

**Total:** 13-18 hours (2 days)

---

## 🚦 Status

**01_TRIAGE → PRODDY** — Evaluation ticket. PRODDY to assess strategic fit, user demand, and build priority before any pipeline commitment. May not proceed to BUILD.
