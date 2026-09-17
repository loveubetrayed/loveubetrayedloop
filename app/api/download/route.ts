import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getDownloadUrl } from "@/lib/store";

export const dynamic = "force-dynamic";

// The actual file URLs never reach the browser except as a one-time redirect
// target after Stripe confirms the session is paid AND the requested slug
// was part of that session.
export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("session_id");
  const slug = req.nextUrl.searchParams.get("slug");

  if (!sessionId || !slug) {
    return NextResponse.json({ error: "Missing session_id or slug" }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return NextResponse.json({ error: "Payment not confirmed" }, { status: 402 });
    }

    const purchasedSlugs = (session.metadata?.slugs || "").split(",");
    if (!purchasedSlugs.includes(slug)) {
      return NextResponse.json({ error: "This file isn't part of the paid order" }, { status: 403 });
    }

    const fileUrl = await getDownloadUrl(slug);
    if (!fileUrl) {
      return NextResponse.json({ error: "File not uploaded yet" }, { status: 404 });
    }

    return NextResponse.redirect(fileUrl);
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: "Couldn't deliver the file" }, { status: 500 });
  }
}

// Alternative for small packs: instead of an external storage URL, you can ship
// the actual ZIPs inside the project (e.g. under /private-files, outside
// /public so Next never serves them statically) and stream them here with:
//
//   import fs from "fs";
//   import path from "path";
//   const filePath = path.join(process.cwd(), "private-files", `${slug}.zip`);
//   const file = fs.readFileSync(filePath);
//   return new NextResponse(file, {
//     headers: {
//       "Content-Type": "application/zip",
//       "Content-Disposition": `attachment; filename="${slug}.zip"`
//     }
//   });
//
// This works well for small/medium packs on Vercel. For large audio libraries,
// prefer S3/R2 + signed URLs as set up above — it's cheaper and won't hit
// serverless payload/duration limits.
