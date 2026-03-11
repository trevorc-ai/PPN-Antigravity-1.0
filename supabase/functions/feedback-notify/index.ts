// supabase/functions/feedback-notify/index.ts
// WO-613: Email notification on new user_feedback row INSERT.
// Deploy: supabase functions deploy feedback-notify
// Webhook: Supabase Dashboard → Database → Webhooks → Table: user_feedback, Event: INSERT

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') ?? '';
const TO_EMAIL = Deno.env.get('FEEDBACK_TO_EMAIL') ?? '';

serve(async (req) => {
  try {
    const payload = await req.json();
    const record = payload?.record;

    if (!record) {
      console.warn('[feedback-notify] No record in webhook payload');
      return new Response('No record in payload', { status: 400 });
    }

    const { type, message, page_url, metadata, created_at } = record;

    const feedbackType = (type ?? 'UNKNOWN').toUpperCase();

    // Build metadata HTML block (only for BUG reports which include browser details)
    const metaBlock = metadata
      ? Object.entries(metadata as Record<string, unknown>)
          .map(([k, v]) => `<li><b>${k}:</b> ${String(v)}</li>`)
          .join('')
      : '';

    const html = `
      <h2 style="color:#4f46e5;">New PPN Feedback — ${feedbackType}</h2>
      <p><b>Submitted:</b> ${created_at ?? 'unknown'}</p>
      <p><b>Page:</b> ${page_url ?? 'unknown'}</p>
      <hr/>
      <p style="white-space:pre-wrap;">${message ?? '(no message)'}</p>
      ${metaBlock ? `<hr/><h3>Browser Details</h3><ul>${metaBlock}</ul>` : ''}
    `;

    if (!RESEND_API_KEY || !TO_EMAIL) {
      console.error('[feedback-notify] Missing RESEND_API_KEY or FEEDBACK_TO_EMAIL secret');
      return new Response('Server misconfiguration', { status: 500 });
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'PPN Feedback <noreply@ppnportal.net>',
        to: [TO_EMAIL],
        subject: `[PPN ${feedbackType}] New feedback submitted`,
        html,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('[feedback-notify] Resend error:', err);
      return new Response('Email send failed', { status: 500 });
    }

    console.log(`[feedback-notify] Email sent for ${feedbackType} feedback`);
    return new Response('OK', { status: 200 });
  } catch (e) {
    console.error('[feedback-notify] Unexpected error:', e);
    return new Response('Internal error', { status: 500 });
  }
});
