import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

// Configure this URL in your Stripe Dashboard → Developers → Webhooks:
//   https://yourdomain.com/api/webhook
// Listen for: checkout.session.completed
// Copy the signing secret into STRIPE_WEBHOOK_SECRET.
//
// This isn't required for the site to work — the success page already verifies
// payment and shows download links. The webhook is a safety net for cases where
// someone pays but closes the tab before reaching /checkout/success (e.g. to
// email them their download links). Wire up an email provider (Resend, Postmark,
// SendGrid...) where indicated below if you want that.

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!secret || !signature) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, secret);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any;
    const email = session.customer_details?.email;
    const slugs = (session.metadata?.slugs || "").split(",").filter(Boolean);

    console.log(`Paid order for ${email}:`, slugs);

    // TODO: send a receipt/download email here, e.g. with Resend:
    // await resend.emails.send({
    //   to: email,
    //   subject: "Your Seraph download links",
    //   html: renderDownloadEmail(slugs, session.id)
    // });
  }

  return NextResponse.json({ received: true });
}
