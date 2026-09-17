import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getProducts } from "@/lib/store";

export const dynamic = "force-dynamic";

const BUNDLE_MIN_QTY = 3;
const BUNDLE_DISCOUNT = 0.1; // 10% off when the cart has 3+ items total

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const lines: { slug: string; qty: number }[] = body.lines || [];

    if (!lines.length) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const products = await getProducts();
    const totalQty = lines.reduce((n, l) => n + Math.max(1, Math.min(10, l.qty)), 0);
    const bundleActive = totalQty >= BUNDLE_MIN_QTY;

    // Re-derive prices from the server-side catalog — never trust prices sent
    // by the client. The bundle discount, if it applies, is baked into the
    // unit price here so Stripe's checkout page shows the final price directly.
    const line_items = lines.map((line) => {
      const product = products.find((p) => p.slug === line.slug);
      if (!product) throw new Error(`Unknown product: ${line.slug}`);
      const unitPrice = bundleActive ? product.price * (1 - BUNDLE_DISCOUNT) : product.price;
      return {
        quantity: Math.max(1, Math.min(10, line.qty)),
        price_data: {
          currency: "usd",
          unit_amount: Math.round(unitPrice * 100),
          product_data: {
            name: bundleActive ? `${product.title} (10% bundle discount)` : product.title,
            description: product.contains.join(" / ")
          }
        }
      };
    });

    const origin = req.headers.get("origin") || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cart`,
      metadata: {
        slugs: lines.map((l) => l.slug).join(",")
      }
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || "Checkout failed" }, { status: 500 });
  }
}
