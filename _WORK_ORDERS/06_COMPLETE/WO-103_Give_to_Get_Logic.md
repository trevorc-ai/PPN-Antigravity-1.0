---
id: WO-103
title: "Feature Gating Logic: 'Give-to-Get' Data Model"
status: 03_BUILD
owner: BUILDER
priority: P1
category: Backend / RLS
depends_on: WO-094
---

# WO-103: 'Give-to-Get' Feature Gating Logic

## 🎯 OBJECTIVE
Implement the backend logic to enforce the "Give-to-Get" model:Users can ONLY view aggregate market data (benchmarks) IF they contribute their own anonymized data.

## 📋 REQUIREMENTS
1. **User Profile Flag:** Add `data_contributor_status` (boolean) to user profile.
2. **Contribution Counter:** Track number of *valid* outcomes submitted (must meet minimum quality threshold, e.g. complete pre/post scores).
3. **RLS Policy Update:**
   - The `market_benchmarks` view (or API endpoint) must have a check:
   - `IF user.data_contributor_status = TRUE THEN RETURN all_data`
   - `ELSE RETURN user_own_data_only`
4. **UI Gate (Frontend Hook):** 
   - If a non-contributor tries to access "Market Comparison", show a blurry state or a "Contribute to Unlock" modal.

## 🚚 DELIVERABLES
- [ ] Database Migration (User flags)
- [ ] RLS Policy for `benchmarks` view.
- [ ] API Middleware for gating.
- [ ] React Hook `useDataContributionStatus()`

## 🔗 LINKS
- Reference WO-094 for strategy.

## [STATUS: PASS] - INSPECTOR APPROVED
