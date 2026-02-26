/**
 * send-waitlist-welcome — WO-411 / WO-412
 *
 * Supabase Edge Function triggered by a Database Webhook on:
 *   Table: academy_waitlist  |  Event: INSERT
 *
 * Sends Email 1 (immediate confirmation) via Resend.
 * Emails 2 + 3 (Day 3 / Day 7) are delivered via Resend Broadcasts (manual,
 * per LEAD decision in WO-411 §Emails 2 and 3).
 *
 * Required secret: RESEND_API_KEY  (set via `supabase secrets set`)
 */

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!;
const FROM_EMAIL = 'PPN Portal <welcome@ppnportal.net>';
const REPLY_TO = 'info@ppnportal.net';
const DEMO_LINK = 'https://ppnportal.net/#/partner-demo';

// ── Valid intake sources ──────────────────────────────────────────────────────
const VALID_SOURCES = ['ppn_portal_main', 'academy_landing_page'] as const;

// ── Handler ───────────────────────────────────────────────────────────────────
serve(async (req: Request) => {
  try {
    const payload = await req.json();

    // Supabase DB webhook envelope: { type, table, record, old_record }
    const record = payload?.record;
    if (!record?.email) {
      return new Response('No record or missing email', { status: 400 });
    }

    const { first_name = 'there', email, source } = record;

    // Guard: only handle known sources
    if (!VALID_SOURCES.includes(source)) {
      console.log(`[send-waitlist-welcome] Skipping unknown source: ${source}`);
      return new Response('Source not handled', { status: 200 });
    }

    const isAcademy = source === 'academy_landing_page';

    // ── Send Email 1: Immediate Confirmation ─────────────────────────────────
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
        html: buildEmail1(first_name, isAcademy),
        reply_to: REPLY_TO,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('[send-waitlist-welcome] Resend API error:', errText);
      return new Response('Email send failed', { status: 500 });
    }

    console.log(`[send-waitlist-welcome] Email 1 delivered to ${email}`);
    return new Response('OK', { status: 200 });

  } catch (err) {
    console.error('[send-waitlist-welcome] Unhandled error:', err);
    return new Response('Internal error', { status: 500 });
  }
});

// ── Email 1: Immediate Confirmation ──────────────────────────────────────────
// WO-412 spec: dark #0a1628 background, Inter font, max-width 560px,
// single CTA, minimal copy, clinically credible tone.
function buildEmail1(firstName: string, isAcademy: boolean): string {
  const product = isAcademy ? 'PPN Academy' : 'PPN Research Portal';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>You're on the list — ${product}</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap" rel="stylesheet" />
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: #0a1628;
      font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      color: #9fb0be;
      -webkit-font-smoothing: antialiased;
    }
    a { color: #388bfd; text-decoration: none; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body style="background:#0a1628;padding:40px 16px;">

  <!-- Outer wrapper -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td align="center">

        <!-- Card -->
        <table role="presentation" width="100%" style="max-width:560px;" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="
              background:rgba(12,26,50,0.95);
              border:1px solid rgba(56,139,253,0.15);
              border-radius:16px;
              padding:40px 36px;
            ">

              <!-- Logo / wordmark -->
              <p style="
                font-size:11px;
                font-weight:900;
                letter-spacing:0.25em;
                text-transform:uppercase;
                color:#388bfd;
                margin-bottom:28px;
              ">PPN Research Portal</p>

              <!-- Divider -->
              <div style="height:1px;background:rgba(56,139,253,0.12);margin-bottom:28px;"></div>

              <!-- Body copy -->
              <p style="font-size:16px;font-weight:600;color:#c8d8e8;line-height:1.6;margin-bottom:16px;">
                Hi ${firstName},
              </p>

              <p style="font-size:15px;color:#9fb0be;line-height:1.7;margin-bottom:20px;">
                You're on the waitlist for ${product}.
              </p>

              <p style="font-size:15px;color:#9fb0be;line-height:1.7;margin-bottom:20px;">
                PPN is clinical infrastructure for psychedelic therapy practitioners — one platform for session documentation, safety surveillance, and outcomes benchmarking, built on a zero-PHI architecture so your data is defensible by design.
              </p>

              <p style="font-size:15px;color:#9fb0be;line-height:1.7;margin-bottom:28px;">
                When our founding cohort opens, you'll be among the first we contact.
              </p>

              <!-- What happens next -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:32px;">
                <tr>
                  <td style="padding:12px 16px;background:rgba(56,139,253,0.06);border-radius:10px;">
                    <p style="font-size:11px;font-weight:900;letter-spacing:0.2em;text-transform:uppercase;color:#6b7a8d;margin-bottom:12px;">What happens next</p>
                    <p style="font-size:14px;color:#9fb0be;line-height:1.7;margin-bottom:6px;">→ &nbsp;You're confirmed on the waitlist</p>
                    <p style="font-size:14px;color:#9fb0be;line-height:1.7;margin-bottom:6px;">→ &nbsp;We'll notify you directly when founding access opens</p>
                    <p style="font-size:14px;color:#9fb0be;line-height:1.7;">→ &nbsp;Founding practitioners get priority onboarding and direct access to our team</p>
                  </td>
                </tr>
              </table>

              <!-- CTA -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:32px;">
                <tr>
                  <td style="border-radius:10px;background:linear-gradient(135deg,#388bfd,#2060cc);">
                    <a href="${DEMO_LINK}" style="
                      display:inline-block;
                      padding:14px 32px;
                      font-size:14px;
                      font-weight:700;
                      color:#ffffff;
                      text-decoration:none;
                      border-radius:10px;
                      letter-spacing:0.05em;
                    ">Watch the 2-minute demo →</a>
                  </td>
                </tr>
              </table>

              <!-- Divider -->
              <div style="height:1px;background:rgba(56,139,253,0.08);margin-bottom:24px;"></div>

              <!-- Footer -->
              <p style="font-size:12px;color:#4a5f72;line-height:1.6;text-align:center;">
                PPN Research Portal &nbsp;·&nbsp; <a href="mailto:info@ppnportal.net" style="color:#4a5f72;">info@ppnportal.net</a><br/>
                No payments. No spam. <a href="https://ppnportal.net/#/waitlist?unsubscribe=1" style="color:#4a5f72;">Unsubscribe</a>
              </p>

            </td>
          </tr>
        </table>
        <!-- /Card -->

      </td>
    </tr>
  </table>

</body>
</html>`;
}
