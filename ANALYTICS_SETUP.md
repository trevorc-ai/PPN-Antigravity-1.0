# Analytics Setup Instructions

**Status:** In Progress  
**Owner:** BUILDER  
**Date:** February 13, 2026

---

## ⚠️ NPM Permission Issue

There's currently an npm cache permission issue that needs to be resolved before installing dependencies.

### Fix Required:

```bash
# Run this command in Terminal (requires password):
sudo chown -R 501:20 "/Users/trevorcalton/.npm"

# Then install dependencies:
cd /Users/trevorcalton/Desktop/PPN-Antigravity-1.0
npm install
```

---

## 1. Create Analytics Accounts

### Google Analytics 4

1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a new GA4 property
3. Set up a Web data stream
4. Copy the **Measurement ID** (format: `G-XXXXXXXXXX`)

### Mixpanel

1. Go to [Mixpanel](https://mixpanel.com/)
2. Create a new project (free tier: 100k events/month)
3. Go to Project Settings
4. Copy the **Project Token**

---

## 2. Configure Environment Variables

1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edit `.env.local` and add your credentials:
   ```bash
   VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
   VITE_MIXPANEL_TOKEN=your_mixpanel_token_here
   ```

3. (Optional) Enable analytics in development:
   ```bash
   VITE_ENABLE_ANALYTICS=true
   ```

---

## 3. Implementation Status

### ✅ Completed
- [x] Created analytics utility module (`src/utils/analytics.ts`)
- [x] Added dependencies to `package.json`
- [x] Created environment variable template

### ⏳ In Progress
- [ ] Fix npm permission issue
- [ ] Install dependencies (`npm install`)
- [ ] Initialize analytics in `App.tsx`
- [ ] Implement event tracking in components

### 📋 To Do
- [ ] Create Supabase analytics views
- [ ] Test GA4 events in DebugView
- [ ] Test Mixpanel events in Live View
- [ ] Privacy audit (no PHI/PII)
- [ ] Performance testing

---

## 4. Testing

### GA4 DebugView
1. Go to GA4 Admin → DebugView
2. Open app in browser
3. Verify events are appearing in real-time

### Mixpanel Live View
1. Go to Mixpanel → Live View
2. Open app in browser
3. Verify events are appearing in real-time

---

## 5. Privacy Compliance

**CRITICAL:** Never track PHI/PII

### ❌ Never Track:
- Patient names, emails, phone numbers
- Patient DOB, MRNs, addresses
- Practitioner names, emails (use UUIDs only)
- Site names (use site IDs only)
- Any free-text fields

### ✅ Safe to Track:
- System-generated UUIDs (`user_id`, `site_id`)
- Aggregate counts (total protocols, total users)
- De-identified user properties (`user_role`, `plan_tier`)
- Behavioral events (page views, clicks, feature usage)

---

## 6. Next Steps

1. **User:** Fix npm permission issue and run `npm install`
2. **BUILDER:** Initialize analytics in `App.tsx`
3. **BUILDER:** Implement event tracking in key components
4. **BUILDER:** Create Supabase analytics views
5. **ANALYST:** Validate data accuracy and set up dashboards

---

**Reference:** [Analytics Infrastructure Plan](file:///Users/trevorcalton/.gemini/antigravity/brain/99ae7eb8-e313-4b39-af58-8fa6624728a6/analytics_infrastructure_plan.md)
