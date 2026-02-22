---
status: 04_QA
owner: INSPECTOR
failure_count: 0
---
Edge Function returned a non-2xx status code

(This error was seen on the /checkout page with the pricing cards)

## BUILDER IMPLEMENTATION NOTES
- Identified stale React state issue in `handleCheckout` when clicking "Join as Research Partner" button causing `priceId` derivation mismatch. Fixed by explicitly passing `tier` to `handleCheckout`.
- Implemented robust error catching for Supabase edge functions to properly extract the JSON message body instead of returning a generic non-2xx error.
