---
id: WO-411
status: 03_BUILD
owner: BUILDER
cue_verified: true
cue_note: "Ticket complete. Part 1 (Steps 1-3) requires Trevor to complete Resend account + domain setup first. Parts 2-4 route to BUILDER once API key is in hand."
priority: P1
failure_count: 0
created: 2026-02-24
parent_ticket: WO-408
sprint: Sprint 2
tags: [email, resend, supabase, webhook, edge-function, builder]
blocked_on: "Trevor must complete DNS verification + Resend API key before INSPECTOR can verify email delivery. Edge function exists in supabase/functions/send-waitlist-welcome/. INSPECTOR hold — not a code failure."
---

## LEAD ARCHITECTURE
- **Routing:** Route to 03_BUILD for `owner: BUILDER`.
- **Strategy:** BUILDER to wire up the Edge Function for Email 1. Trevor needs to verify the domain for Resend first. 
- **Decision:** As for Emails 2 and 3, we will use **Option A (Resend Broadcasts)**. It is simpler for now. (Supabase Cron can be evaluated later if complexity requires it).

# WO-411: Resend Email Automation — Waitlist Welcome Sequence

## User Prompt (verbatim)
"I'll need explicitly detailed step-by-step guidance for setting up Resend, or have an agent do it for me."

## Overview
When a practitioner submits the waitlist form (at `/waitlist` or `/academy`), they must receive an automated email confirmation within 60 seconds. This ticket wires a Supabase Database Webhook to a Resend-powered Edge Function that triggers a 3-email welcome sequence.

Stripe is already configured. This is purely the email automation layer.

---

## PART 1: Account Setup (Trevor does this — ~10 minutes)

### Step 1: Create a Resend Account
1. Go to [https://resend.com](https://resend.com)
2. Click **"Sign Up"** — use your business email (`info@ppnportal.net` or Trevor's personal)
3. Verify your email address (check inbox for their confirmation link)
4. You are now on the **Free tier**: 3,000 emails/month, 100/day — sufficient for launch phase

### Step 2: Add and Verify Your Domain
This is required before Resend will send emails from `@ppnportal.net`.

1. In the Resend dashboard, click **"Domains"** in the left sidebar
2. Click **"Add Domain"**
3. Enter: `ppnportal.net`
4. Resend will show you **3 DNS records** to add (2 × TXT records + 1 × MX record)
5. Go to your DNS provider (wherever ppnportal.net is registered — likely Namecheap, GoDaddy, or Cloudflare)
6. Add each DNS record exactly as shown by Resend
7. Return to Resend and click **"Verify DNS Records"**
8. DNS propagation can take 5–30 minutes. Refresh until you see a green checkmark.

> ⚠️ **If you don't know your DNS provider:** Go to [https://lookup.icann.org](https://lookup.icann.org), enter `ppnportal.net`, and it will show you the registrar. Contact Trevor if stuck.

### Step 3: Create an API Key
1. In Resend dashboard, click **"API Keys"** in the left sidebar
2. Click **"Create API Key"**
3. Name it: `PPN Supabase Production`
4. Permission: **"Sending access"** only (not full access)
5. Click **"Add"**
6. **CRITICAL:** Copy the API key immediately. It starts with `re_`. Resend will NEVER show it again.
7. Save it somewhere secure (1Password, etc.) — you will need it in Step 4

---

## PART 2: Supabase Configuration (BUILDER or Trevor — ~15 minutes)

### Step 4: Add API Key as Supabase Secret
Run this in Terminal from the project root:

```bash
npx supabase secrets set RESEND_API_KEY=re_YOUR_KEY_HERE --project-ref rxwsthatjhnixqsthegf
```

Replace `re_YOUR_KEY_HERE` with the actual key from Step 3.

To verify it was saved:
```bash
npx supabase secrets list --project-ref rxwsthatjhnixqsthegf
```
You should see `RESEND_API_KEY` in the list (value will be hidden).

### Step 5: Create the Edge Function
Create the file: `supabase/functions/send-waitlist-welcome/index.ts`

```typescript
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!;
const FROM_EMAIL = 'PPN Portal <welcome@ppnportal.net>';

serve(async (req) => {
  try {
    const payload = await req.json();
    
    // Supabase DB webhook sends { type, table, record, old_record }
    const record = payload.record;
    if (!record || !record.email) {
      return new Response('No record', { status: 400 });
    }

    const { first_name, email, practitioner_type, source } = record;
    
    // Only trigger for portal waitlist and academy waitlist
    const validSources = ['ppn_portal_main', 'academy_landing_page'];
    if (!validSources.includes(source)) {
      return new Response('Source not handled', { status: 200 });
    }

    // Email 1: Immediate confirmation
    const emailHtml = buildConfirmationEmail(first_name, source);

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: email,
        subject: "You're on the list — here's what happens next",
        html: emailHtml,
        reply_to: 'info@ppnportal.net',
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error('Resend error:', error);
      return new Response('Email failed', { status: 500 });
    }

    return new Response('OK', { status: 200 });
  } catch (err) {
    console.error('Edge function error:', err);
    return new Response('Internal error', { status: 500 });
  }
});

function buildConfirmationEmail(firstName: string, source: string): string {
  const isAcademy = source === 'academy_landing_page';
  const productName = isAcademy ? 'PPN Academy' : 'PPN Research Portal';
  const demoLink = 'https://app.ppnportal.net/#/partner-demo';
  
  // Email HTML is defined in WO-412 (MARKETER + DESIGNER)
  // BUILDER: insert the final HTML from WO-412 here
  return `
    <html>
      <body style="margin:0;padding:0;background:#0a1628;font-family:Inter,sans-serif;">
        <!-- WO-412 email template goes here -->
        <p style="color:#9fb0be;padding:40px;">
          Hi ${firstName}, you're on the waitlist for ${productName}. 
          We'll be in touch when founding access opens.
        </p>
        <p style="padding:0 40px;">
          <a href="${demoLink}" style="color:#388bfd;">Watch the 2-minute demo →</a>
        </p>
      </body>
    </html>
  `;
}
```

> **Note:** The placeholder HTML above will be replaced with the final designed email HTML from WO-412. BUILDER should wire the function first with this placeholder, confirm delivery works, then swap in the WO-412 templates.

### Step 6: Deploy the Edge Function
```bash
npx supabase functions deploy send-waitlist-welcome --project-ref rxwsthatjhnixqsthegf
```

After deployment, the function URL will be:
```
https://rxwsthatjhnixqsthegf.supabase.co/functions/v1/send-waitlist-welcome
```

---

## PART 3: Supabase Database Webhook (BUILDER — ~5 minutes in Supabase Dashboard)

### Step 7: Create the Database Webhook

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Select the **PPN project**
3. In the left sidebar: **Database → Webhooks**
4. Click **"Create a new webhook"**
5. Fill in:
   - **Name:** `waitlist_welcome_email`
   - **Table:** `academy_waitlist`
   - **Events:** ✅ `INSERT` only (not UPDATE, not DELETE)
   - **Type:** `HTTP Request`
   - **URL:** `https://rxwsthatjhnixqsthegf.supabase.co/functions/v1/send-waitlist-welcome`
   - **Method:** `POST`
   - **HTTP Headers:** Add one header:
     - Key: `Authorization`
     - Value: `Bearer YOUR_SUPABASE_SERVICE_ROLE_KEY`
     
     > Find the Service Role key in: Supabase Dashboard → Project Settings → API → `service_role` key (secret)
6. Click **"Confirm"**

---

## PART 4: Test the Full Flow

### Step 8: End-to-End Test
1. Open the app locally (`npm run dev`)
2. Navigate to `/waitlist` (after WO-410 is built)
3. Submit the form with a real email you can check
4. Verify:
   - [ ] Row appears in `academy_waitlist` table in Supabase with `source = 'ppn_portal_main'`
   - [ ] Confirmation email arrives within 60 seconds
   - [ ] Email renders correctly (check mobile + desktop)
   - [ ] "Reply-to" address is `info@ppnportal.net`

### Step 9: Check Resend Logs
In Resend dashboard → **"Emails"** tab:
- You should see the sent email with status `Delivered`
- If status is `Failed`, click it to see the error reason

---

## Emails 2 and 3 — Day 3 and Day 7 Follow-ups

These require either:
- **Option A (Recommended):** A Resend Broadcast scheduled via their dashboard (manual for now, automated later). Resend has a "Broadcasts" feature for scheduled campaigns.
- **Option B:** A Supabase cron job (`pg_cron`) that checks the `academy_waitlist` table for rows that are 3 and 7 days old and fires the Edge Function again with a `email_sequence_step` parameter.

**LEAD decision required:** Option A (Resend Broadcasts, simpler) vs Option B (Supabase cron, fully automated). Until decided, Email 1 (immediate confirmation) is the priority. Emails 2 and 3 content is being defined in WO-412.

---

## Acceptance Criteria
- [ ] Resend account created and domain `ppnportal.net` verified (Trevor)
- [ ] `RESEND_API_KEY` stored as Supabase secret
- [ ] Edge Function `send-waitlist-welcome` deployed successfully
- [ ] Database Webhook configured on `academy_waitlist` INSERT event
- [ ] Test submission triggers email delivery within 60 seconds
- [ ] Delivery confirmed in Resend dashboard logs
- [ ] Email appears correctly on mobile and desktop email clients
