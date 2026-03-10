---
id: WO-518B-USER
title: "USER ACTION: Fix Supabase Redirect URLs (BUG-518-02)"
owner: USER (Trevor)
priority: P0
est_time: 5 minutes
---

# WO-518B-USER — Supabase Redirect URL Configuration

> **Why this matters:** The "Forgot Password" email is not being delivered because Supabase does not know it's allowed to redirect users to our app after the password reset link is clicked. This is a one-time dashboard config — no code required.

---

## Step 1 — Open Supabase Dashboard

Go to: **https://supabase.com/dashboard**

Log in and make sure you are viewing the **correct project** (check the project name in the top-left matches your staging/production project).

---

## Step 2 — Navigate to Auth Settings

In the left sidebar:
1. Click **"Authentication"**
2. Click **"URL Configuration"**

---

## Step 3 — Set the Site URL

Find the **"Site URL"** field.

| Environment | Value to enter |
|---|---|
| **Staging project** | `http://localhost:3001` |
| **Production project** | `https://ppnportal.net` |

---

## Step 4 — Add Redirect URLs

Find the **"Redirect URLs"** section (below Site URL).

Click **"Add URL"** and add each of these — one at a time:

```
https://ppnportal.net/#/reset-password
http://localhost:3001/#/reset-password
http://localhost:3000/#/reset-password
```

> The `#/reset-password` part is critical — it tells Supabase where to send the user after they click the link in their email.

---

## Step 5 — Save

Click **"Save"** at the bottom of the page.

---

## Step 6 — Verify (Optional Quick Test)

1. Open your staging app: `http://localhost:3001/#/forgot-password`
2. Enter your email and click **"Send Recovery Email"**
3. Check your inbox — the reset email should arrive within 60 seconds
4. Click the link in the email — you should land on the **Reset Password** page inside the portal (not a Supabase error page)

---

## Done

Report back to LEAD once complete. LEAD will mark BUG-518-02 as closed and move this ticket to `99_COMPLETED`.
