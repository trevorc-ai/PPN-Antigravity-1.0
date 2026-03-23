---
id: WO-613
title: Supabase Edge Function — Feedback Email Notification
owner: BUILDER
authored_by: INSPECTOR
routed_to: LEAD → BUILDER
status: 03_BUILD
priority: P2 (nice-to-have for launch, non-blocking)
created: 2026-03-11
depends_on: WO-610 (schema), WO-611 (feedback form)
---

## Context

Currently feedback is written to the `user_feedback` table but no one is notified. This WO adds a Supabase Edge Function that sends an email to the admin whenever a new feedback row is inserted.

The Admin Dashboard Inbox (WO-612) is the primary review surface. This notification is a secondary "push" layer so nothing gets missed.

---

## Approach: Supabase Database Webhook + Edge Function

We will use a **Supabase Database Webhook** that fires on `INSERT` to `user_feedback` and calls an Edge Function at `supabase/functions/feedback-notify/index.ts`.

The Edge Function will use **Resend** (free tier — 3,000 emails/month) to send the notification.

---

## Prerequisites (Manual Steps for Trevor Before BUILDER Runs This)

1. Create a free account at [https://resend.com](https://resend.com)
2. Get your Resend API key
3. Add it as a Supabase secret: `supabase secrets set RESEND_API_KEY=re_xxx`
4. Confirm the destination email address (the `TO_EMAIL` secret below)
5. Add: `supabase secrets set FEEDBACK_TO_EMAIL=trevor@ppnportal.net` (or preferred address)

> **BUILDER:** Do NOT hardcode the API key or email. Read them from `Deno.env.get()`.

---

## File to Create

**`supabase/functions/feedback-notify/index.ts`**

```ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') ?? '';
const TO_EMAIL = Deno.env.get('FEEDBACK_TO_EMAIL') ?? '';

serve(async (req) => {
  try {
    const payload = await req.json();
    const record = payload?.record;

    if (!record) {
      return new Response('No record in payload', { status: 400 });
    }

    const { type, message, page_url, metadata, created_at } = record;

    const metaBlock = metadata
      ? Object.entries(metadata)
          .map(([k, v]) => `<li><b>${k}:</b> ${v}</li>`)
          .join('')
      : '';

    const html = `
      <h2>New PPN Feedback — ${type.toUpperCase()}</h2>
      <p><b>Submitted:</b> ${created_at}</p>
      <p><b>Page:</b> ${page_url ?? 'unknown'}</p>
      <hr/>
      <p>${message}</p>
      ${metaBlock ? `<hr/><h3>Browser Details</h3><ul>${metaBlock}</ul>` : ''}
    `;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'PPN Feedback <noreply@ppnportal.net>',
        to: [TO_EMAIL],
        subject: `[PPN ${type.toUpperCase()}] New feedback submitted`,
        html,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('[feedback-notify] Resend error:', err);
      return new Response('Email send failed', { status: 500 });
    }

    return new Response('OK', { status: 200 });
  } catch (e) {
    console.error('[feedback-notify] Unexpected error:', e);
    return new Response('Internal error', { status: 500 });
  }
});
```

---

## Database Webhook Setup (Manual — Supabase Dashboard)

After deploying the function, set up the webhook in Supabase Dashboard:
1. Go to **Database → Webhooks → Create Webhook**
2. Table: `user_feedback`, Event: `INSERT`
3. Type: **Supabase Edge Function**
4. Function: `feedback-notify`

---

## Constraints

- **No changes to any frontend file**
- **No changes to any migration file** (WO-610 handles schema)
- **No hardcoded secrets**

---

## Acceptance Criteria

- [ ] Edge function deploys without error (`supabase functions deploy feedback-notify`)
- [ ] Submitting a BUG report via the UI triggers an email within 60 seconds
- [ ] Email subject includes `[PPN BUG]` (or FEATURE / COMMENT as appropriate)
- [ ] Email body includes the message text and, for bugs, the metadata fields
- [ ] Function does NOT crash if `metadata` is null (COMMENT or FEATURE submissions)
