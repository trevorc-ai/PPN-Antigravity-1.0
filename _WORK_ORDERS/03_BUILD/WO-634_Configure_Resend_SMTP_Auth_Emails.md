# WO-634: Configure Custom SMTP via Resend for Production Auth Emails

**Queue:** 00_INBOX → 03_BUILD  
**Priority:** P1 - High (production blocker for scale)  
**Type:** Infrastructure  
**Agent:** BUILDER  
**Estimated effort:** Small (1-2 hours)

---

## Problem

Supabase auth emails (Invite user, Magic link, etc.) are currently using Supabase's built-in email service. The Supabase Dashboard explicitly flags this as not suitable for production:

> "This service has rate limits and is not meant to be used for production apps."

Rate limits will become a hard blocker the moment VIP invites go out at any volume.

## Solution

Configure Supabase to send all auth emails through Resend — already integrated in this project for `feedback-notify` and `send-waitlist-welcome` functions. No new vendor, no new API key to manage.

Resend SMTP credentials are the bridge: Supabase sends auth emails via SMTP, Resend handles delivery with production-grade reliability and full analytics.

## Acceptance Criteria

- [ ] Supabase Dashboard → Authentication → Email → SMTP Settings configured with Resend SMTP credentials
- [ ] Test invite sent and received via Resend (not Supabase built-in emailer)
- [ ] Resend dashboard shows the email in sent log with delivery confirmation
- [ ] No rate limit warnings in Supabase Dashboard Email section
- [ ] All 6 auth email templates still render correctly (Invite user and Magic link are PPN-branded; others remain default)

## Implementation Steps

### Step 1 — Generate a Resend SMTP API Key

1. Go to [resend.com/api-keys](https://resend.com/api-keys)
2. Click **Add API Key** (top right)
3. Name: `PPN Auth - Supabase SMTP`
4. Permission: **Sending access** (not Full access)
5. Click **Add**
6. **Copy the key immediately** — Resend only shows it once

### Step 2 — Verify the sending domain

1. Go to [resend.com/domains](https://resend.com/domains)
2. Confirm `ppnportal.net` shows status **Verified**
3. If it's not verified or missing — click **Add Domain**, enter `ppnportal.net`, and follow the DNS instructions (add the 3 DNS records Resend provides to your domain registrar). DNS propagation can take up to 30 min.

### Step 3 — Configure Supabase SMTP

1. Go to [Supabase Dashboard](https://supabase.com/dashboard) → Select **PPN Portal Production** project
2. Left sidebar → **Authentication** → **Email** → click the **SMTP Settings** tab
3. Toggle **Enable Custom SMTP** to ON
4. Fill in the fields exactly:

| Field | Value |
|---|---|
| Host | `smtp.resend.com` |
| Port | `465` |
| Sender name | `PPN Portal` |
| Sender email | `noreply@ppnportal.net` |
| Username | `resend` |
| Password | *(the API key you copied in Step 1)* |

5. Click **Save**

### Step 4 - Test the configuration

1. Left sidebar: **Authentication** > **Users**
2. Top right of the users list: click **Add user** dropdown > **Send invitation**
3. Enter your own email address and click **Send invitation**
4. Check your inbox - the PPN-branded "You're in." email should arrive within 30 seconds
5. Confirm delivery: go to [resend.com/emails](https://resend.com/emails) - the email should appear with status **Delivered**

If it does not arrive:
- Check [resend.com/emails](https://resend.com/emails) for an error status
- Confirm `ppnportal.net` is **Verified** in [resend.com/domains](https://resend.com/domains)
- Re-check the API key in Supabase SMTP settings (no trailing spaces)

## Notes

- `RESEND_API_KEY` is already set in Supabase Edge Function secrets — SMTP setup is a separate credential
- Sender domain `ppnportal.net` must be verified in Resend (likely already done for existing email functions)
- No code changes required — this is a Supabase Dashboard configuration only

---

*Created by PRODDY | 2026-03-12*
