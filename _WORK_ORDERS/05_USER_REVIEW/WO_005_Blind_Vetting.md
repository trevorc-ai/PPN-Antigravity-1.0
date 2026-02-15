---
work_order_id: WO_005
title: Feature - Blind Vetting Scanner
type: FEATURE
category: Feature
priority: HIGH
status: ASSIGNED
created: 2026-02-14T19:00:40-08:00
reviewed_by: LEAD
reviewed_at: 2026-02-14T19:07:27-08:00
requested_by: Trevor Calton
assigned_to: BUILDER
estimated_complexity: 6/10
failure_count: 0
---

# Work Order: Feature - Blind Vetting Scanner

## 🎯 THE GOAL

Create a "Client Security Check" terminal interface.

### Requirements

1. **Input:** A phone number field that auto-masks `(XXX) XXX-XXXX`
2. **Logic:**
   - Hash the input locally using SHA-256 + Salt (Client-side only)
   - Call Supabase RPC `check_client_risk` with the hash
   - Display "Green Shield" (Safe) or "Red Alert" (Flagged) based on response
3. **UI:** Monospace font, "Terminal" aesthetic
4. **Warning:** Display disclaimer "Input is hashed locally. No PII sent to server."

---

## 🎯 THE BLAST RADIUS (Authorized Target Area)

You are ONLY allowed to modify the following specific files/areas:

- `src/components/security/BlindVetting.tsx` (New Component - CREATE THIS)
- `src/utils/crypto.ts` (Hashing utility - CREATE THIS)

---

## ⚡ THE ELECTRIC FENCE (Strict "DO NOT TOUCH" Constraints)

**DO NOT:**
- Send the plain-text phone number to the API
- Save the phone number to LocalStorage
- Log the result of the check in the frontend console
- Store any PII in any form
- Modify any other components or pages
- Touch the database schema
- Add new routes or navigation

**MUST:**
- Hash phone number client-side before any network request
- Use SHA-256 with salt for hashing
- Clear input field after check completes
- Provide clear visual feedback (Green/Red)
- Include privacy disclaimer prominently

---

## ✅ Acceptance Criteria

### Functionality
- [ ] Phone number input with auto-masking `(XXX) XXX-XXXX`
- [ ] Client-side SHA-256 hashing with salt
- [ ] RPC call to `check_client_risk(hash)` function
- [ ] Display "Green Shield" icon for safe (0 flags)
- [ ] Display "Red Alert" icon for flagged (1+ flags)
- [ ] Input clears after check completes
- [ ] Privacy disclaimer visible at all times

### UI/UX
- [ ] Monospace font (e.g., `font-mono`, Courier, Monaco)
- [ ] "Terminal" aesthetic (dark background, green/amber text)
- [ ] Clear visual distinction between Safe/Flagged states
- [ ] Responsive design (works on mobile and desktop)
- [ ] Loading state during RPC call
- [ ] Error handling for network failures

### Security & Compliance
- [ ] No plain-text phone number sent to server
- [ ] No phone number stored in LocalStorage/SessionStorage
- [ ] No console logging of results or hashes
- [ ] Hash generated client-side only
- [ ] Salt stored securely (environment variable)
- [ ] Screen reader announces result status

---

## 🧪 Testing Requirements

- [ ] Test phone number masking with various inputs
- [ ] Verify hash is generated correctly (SHA-256)
- [ ] Confirm RPC call uses hash, not plain text
- [ ] Test "Safe" response displays green shield
- [ ] Test "Flagged" response displays red alert
- [ ] Verify no plain-text phone number in network tab
- [ ] Test error handling when RPC fails
- [ ] Verify screen reader announces result
- [ ] Confirm no data persists in browser storage

---

## 📝 MANDATORY COMPLIANCE

### ACCESSIBILITY
- **Screen Reader Support:** Result status must be announced
- **ARIA Labels:** All interactive elements must have labels
- **Keyboard Navigation:** Full keyboard accessibility
- **Color + Text:** Don't rely on color alone (use icons + text)

### SECURITY
- **Client-Side Hashing:** Mandatory before any network request
- **No Plain Text:** Phone number never leaves client in plain form
- **No Logging:** No console.log of sensitive data
- **No Storage:** No LocalStorage/SessionStorage of phone numbers
- **Salt Security:** Use environment variable for salt

---

## 🚦 Status

**INBOX** - Ready for BUILDER assignment

---

## Workflow

1. ⏳ CUE creates work order → **CURRENT STEP**
2. ⏳ BUILDER reviews and accepts
3. ⏳ BUILDER creates crypto utility
4. ⏳ BUILDER creates BlindVetting component
5. ⏳ BUILDER tests hashing and RPC call
6. ⏳ INSPECTOR verifies security compliance
7. ⏳ User approves and deploys

---

## 📋 Technical Notes

### Component Structure
```tsx
// BlindVetting.tsx
interface BlindVettingProps {
  onCheckComplete?: (isSafe: boolean) => void;
}
```

### Hashing Utility
```typescript
// crypto.ts
export async function hashPhoneNumber(phoneNumber: string): Promise<string> {
  const salt = import.meta.env.VITE_HASH_SALT || 'default-salt';
  const normalized = phoneNumber.replace(/\D/g, ''); // Remove non-digits
  const data = normalized + salt;
  
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return hashHex;
}
```

### RPC Call
```typescript
const { data, error } = await supabase.rpc('check_client_risk', {
  client_hash: hashedPhone
});

// Response: { risk_count: number }
const isSafe = data?.risk_count === 0;
```

### Phone Number Masking
```typescript
const formatPhoneNumber = (value: string) => {
  const cleaned = value.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return value;
};
```

---

## 🎨 Design Specifications

### Colors (Terminal Theme)
- Background: `#0a0a0a` (Near Black)
- Text: `#00ff00` (Terminal Green) or `#33ff33`
- Safe: `#22c55e` (Green)
- Flagged: `#ef4444` (Red)
- Border: `#1a1a1a` (Dark Gray)

### Typography
- Font: `font-mono` (Tailwind) or `Courier New, Monaco, monospace`
- Input: 16px minimum
- Disclaimer: 12px, muted color

### Layout
- Centered card/terminal window
- Input at top
- Result display below
- Disclaimer at bottom
- Clear visual hierarchy

### Icons
- Safe: Shield with checkmark (Green)
- Flagged: Alert triangle or X (Red)

---

## Dependencies

**Prerequisite:** WO_002 (Shadow Market Schema) must be completed first to ensure `check_client_risk()` RPC function exists.

---

## 📋 Privacy Disclaimer Text

```
⚠️ PRIVACY NOTICE
Input is hashed locally using SHA-256. No personally identifiable 
information is sent to the server. This check queries a blind database 
of anonymized risk flags only.
```

---

## 🔍 INSPECTOR QA APPROVAL

**Reviewed By:** INSPECTOR  
**Review Date:** 2026-02-14T21:43:23-08:00  
**Status:** ✅ **APPROVED**

### Compliance Verification

**✅ ACCESSIBILITY:**
- Screen reader support mandated
- ARIA labels required for all interactive elements
- Full keyboard accessibility
- Color + text (not color-only)
- Minimum 16px font size

**✅ PHI/SECURITY:**
- Client-side SHA-256 hashing before any network request
- No plain-text phone number sent to server
- No LocalStorage/SessionStorage of PII
- No console logging of sensitive data
- Input cleared after check
- Privacy disclaimer prominently displayed
- No free-text storage (hashed values only)

**VERDICT:** This work order is compliant with all accessibility and PHI rules. Cleared for USER_REVIEW.
