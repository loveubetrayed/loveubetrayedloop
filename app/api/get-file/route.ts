import { NextRequest, NextResponse } from "next/server";
import { verifyEmailToken } from "@/lib/email-token";
import { getDownloadUrl } from "@/lib/store";
import { recordLead } from "@/lib/leads";
import { streamFile } from "@/lib/stream-file";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) return NextResponse.json({ error: "Missing token" }, { status: 400 });

  const result = verifyEmailToken(token);
  if (!result) return NextResponse.json({ error: "This link has expired" }, { status: 410 });

  const fileUrl = await getDownloadUrl(result.slug);
  if (!fileUrl) return NextResponse.json({ error: "File not uploaded yet" }, { status: 404 });

  // Only counted as a real download once they actually click through here —
  // this is what powers the honest "X got this kit" counts on the site.
  await recordLead(result.email, "free-kit-confirmed", result.slug);

  return streamFile(fileUrl, `${result.slug}.zip`);
}
