import { NextRequest, NextResponse } from "next/server";
import { verifyEmailToken } from "@/lib/email-token";
import { addContact } from "@/lib/resend";

export const dynamic = "force-dynamic";

// Just verifies the emailed link and hands off to the branded "Download Now"
// page — it no longer streams the file itself. See /get/[slug] and
// /api/get-file for the rest of the flow.
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

  // The email is proven real and reachable at this point — worth recording
  // as a contact even before they click the final download button.
  addContact(result.email);

  return NextResponse.redirect(`${origin}/get/${result.slug}?token=${token}`);
}
