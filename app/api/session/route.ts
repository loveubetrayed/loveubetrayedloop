import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getProduct } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("session_id");
  if (!sessionId) {
    return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return NextResponse.json({ error: "Payment not confirmed" }, { status: 402 });
    }

    const slugs = (session.metadata?.slugs || "").split(",").filter(Boolean);
    const items = (
      await Promise.all(
        slugs.map(async (slug) => {
          const p = await getProduct(slug);
          return p ? { slug: p.slug, title: p.title } : null;
        })
      )
    ).filter(Boolean);

    return NextResponse.json({ items, email: session.customer_details?.email || null });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }
}
