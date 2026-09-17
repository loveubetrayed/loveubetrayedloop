import { NextRequest, NextResponse } from "next/server";
import { verifyEmailToken } from "@/lib/email-token";
import { getDownloadUrl } from "@/lib/store";
import { addContact } from "@/lib/resend";
import { recordLead } from "@/lib/leads";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  const origin = req.nextUrl.origin;

  if (!token) {
    return NextResponse.redirect(`${origin}/free?error=missing_token`);
  }

  const result = verifyEmailToken(token);
  if (!result) {
    return NextResponse.redirect(`${origin}/free?error=expired`);
  }

  // Only now — after the email is proven to be real and reachable — do we
  // mark it confirmed. Fake/typo'd addresses never make it this far.
  addContact(result.email);
  await recordLead(result.email, "free-kit-confirmed", result.slug);

  const fileUrl = await getDownloadUrl(result.slug);
  if (!fileUrl) {
    return NextResponse.redirect(`${origin}/free?error=not_uploaded`);
  }

  return NextResponse.redirect(fileUrl);
}
