// Optional. Only used by app/api/lead/route.ts to (a) add the email to an
// audience/list and (b) send the "here's your free kit" email.
//
// If RESEND_API_KEY isn't set, /api/lead still works — it just skips sending
// an email and returns the download link directly on the page instead, which
// is enough to ship the core "email for a free kit" flow.
//
// Swap Resend for Mailchimp/ConvertKit/Beehiiv/whatever you already use — the
// only two things this route needs from an ESP are "store this contact" and
// "send this email", both trivial to re-point at another provider's API.

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID;

export const emailConfigured = Boolean(RESEND_API_KEY);

export async function addContact(email: string) {
  if (!RESEND_API_KEY || !RESEND_AUDIENCE_ID) return;
  await fetch(`https://api.resend.com/audiences/${RESEND_AUDIENCE_ID}/contacts`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email })
  }).catch((err) => console.error("Resend addContact failed:", err));
}

export async function sendConfirmationEmail(email: string, confirmUrl: string) {
  if (!RESEND_API_KEY) return;
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM || "iloveubetrayed <hello@yourdomain.com>",
      to: email,
      subject: "Confirm your email to get your free kit",
      html: `
        <p>One click and it's yours:</p>
        <p><a href="${confirmUrl}">Confirm & download</a></p>
        <p>This link expires in 24 hours. If you didn't request this, ignore it.</p>
        <p>— iloveubetrayed</p>
      `
    })
  }).catch((err) => console.error("Resend sendConfirmationEmail failed:", err));
}

export async function sendKitEmail(email: string, downloadUrl: string) {
  if (!RESEND_API_KEY) return;
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM || "iloveubetrayed <hello@yourdomain.com>",
      to: email,
      subject: "Your free kit 🤍",
      html: `
        <p>Here's your download:</p>
        <p><a href="${downloadUrl}">${downloadUrl}</a></p>
        <p>— iloveubetrayed</p>
      `
    })
  }).catch((err) => console.error("Resend sendKitEmail failed:", err));
}
