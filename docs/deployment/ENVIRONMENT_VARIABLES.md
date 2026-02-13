# Environment Variables Template

## Production Environment Variables for Vercel

Copy these to Vercel Project Settings → Environment Variables

---

## Supabase

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Where to find:**
- Go to Supabase Dashboard → Project Settings → API
- Copy "Project URL" for `VITE_SUPABASE_URL`
- Copy "anon public" key for `VITE_SUPABASE_ANON_KEY`

---

## Stripe (Production)

```bash
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

**Where to find:**
- Go to Stripe Dashboard → Developers → API keys
- Toggle to "Live mode"
- Copy "Publishable key" for `VITE_STRIPE_PUBLISHABLE_KEY`
- Copy "Secret key" for `STRIPE_SECRET_KEY`
- Create webhook endpoint, copy signing secret for `STRIPE_WEBHOOK_SECRET`

---

## App Configuration

```bash
VITE_APP_URL=https://your-domain.com
VITE_DEMO_MODE=false
```

**Notes:**
- `VITE_APP_URL`: Your production domain (e.g., https://ppnresearch.com)
- `VITE_DEMO_MODE`: Set to `false` for production

---

## Analytics (Optional - Can add later)

```bash
VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_MIXPANEL_TOKEN=your-mixpanel-token
VITE_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
```

**Where to find:**
- **GA4:** Google Analytics → Admin → Data Streams → Measurement ID
- **Mixpanel:** Mixpanel → Project Settings → Project Token
- **Sentry:** Sentry → Project Settings → Client Keys (DSN)

---

## Supabase Edge Functions Secrets

Set these using Supabase CLI:

```bash
supabase secrets set STRIPE_SECRET_KEY=sk_live_...
supabase secrets set SUPABASE_URL=https://your-project.supabase.co
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...
```

**Where to find:**
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase Dashboard → Project Settings → API → service_role key

---

## Security Notes

⚠️ **NEVER commit these values to git**  
⚠️ **Use environment variables only**  
⚠️ **Rotate keys if exposed**  

✅ Store in Vercel environment variables  
✅ Store in password manager (1Password, LastPass)  
✅ Document in secure location  

---

## Checklist

- [ ] All Supabase variables added to Vercel
- [ ] All Stripe variables added to Vercel
- [ ] App configuration variables added to Vercel
- [ ] Edge Function secrets set via Supabase CLI
- [ ] All variables marked as "Production" environment
- [ ] Test deployment to verify variables work
