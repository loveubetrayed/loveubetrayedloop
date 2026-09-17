import { NextRequest, NextResponse } from "next/server";
import { getDownloadUrl, getFreeProduct } from "@/lib/store";
import { addContact, sendConfirmationEmail, emailConfigured } from "@/lib/resend";
import { signEmailToken } from "@/lib/email-token";
import { recordLead } from "@/lib/leads";

export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const { email, subscribeOnly, productSlug } = await req.json();

    if (typeof email !== "string" || !EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "Enter a valid email address" }, { status: 400 });
    }

    // Newsletter-only signups (footer) skip the confirmation flow — there's
    // no file being gated, so there's nothing to confirm.
    if (subscribeOnly) {
      addContact(email);
      await recordLead(email, "newsletter");
      return NextResponse.json({ mode: "subscribed" });
    }

    // Which product is being unlocked — defaults to the featured free kit
    // for backwards compatibility with the original /free page.
    const slug = productSlug || (await getFreeProduct()).slug;

    // No email service configured — there's no way to actually deliver a
    // confirmation link, so fall back to instant on-screen delivery instead
    // of leaving the person with a dead end.
    if (!emailConfigured) {
      addContact(email);
      await recordLead(email, "free-kit-confirmed", slug);
      const downloadUrl = (await getDownloadUrl(slug)) || null;
      return NextResponse.json({ mode: "instant", downloadUrl });
    }

    await recordLead(email, "free-kit-requested", slug);

    const origin = req.headers.get("origin") || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const token = signEmailToken(email, slug);
    const confirmUrl = `${origin}/api/confirm?token=${token}`;

    await sendConfirmationEmail(email, confirmUrl);

    return NextResponse.json({ mode: "confirm" });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
