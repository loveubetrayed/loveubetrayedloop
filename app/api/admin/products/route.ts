import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken } from "@/lib/admin-auth";
import { getProducts, saveProducts, getDownloadSources, saveDownloadUrl, kvConfigured } from "@/lib/store";
import type { Product } from "@/lib/seed-data";

export const dynamic = "force-dynamic";

function authed(req: NextRequest) {
  return verifyAdminToken(req.cookies.get("admin_session")?.value);
}

export async function GET(req: NextRequest) {
  if (!authed(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const [products, downloads] = await Promise.all([getProducts(), getDownloadSources()]);
  const merged = products.map((p) => ({ ...p, downloadUrl: downloads[p.slug] || "" }));
  return NextResponse.json({ products: merged, kvConfigured });
}

export async function POST(req: NextRequest) {
  if (!authed(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const { downloadUrl, ...product } = body as Product & { downloadUrl?: string };

  if (!product.slug || !product.title) {
    return NextResponse.json({ error: "Slug and title are required" }, { status: 400 });
  }

  const products = await getProducts();
  if (products.some((p) => p.slug === product.slug)) {
    return NextResponse.json({ error: "A product with that slug already exists" }, { status: 409 });
  }

  const next = [...products, normalizeProduct(product)];
  const saved = await saveProducts(next);
  if (downloadUrl) await saveDownloadUrl(product.slug, downloadUrl);

  if (!saved) {
    return NextResponse.json({
      ok: true,
      warning: "Redis isn't connected — this was NOT saved permanently. See the banner above for setup steps."
    });
  }
  return NextResponse.json({ ok: true });
}

export async function PUT(req: NextRequest) {
  if (!authed(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const { downloadUrl, ...product } = body as Product & { downloadUrl?: string };

  const products = await getProducts();
  const idx = products.findIndex((p) => p.slug === product.slug);
  if (idx === -1) return NextResponse.json({ error: "Product not found" }, { status: 404 });

  products[idx] = normalizeProduct(product);
  const saved = await saveProducts(products);
  if (downloadUrl !== undefined) await saveDownloadUrl(product.slug, downloadUrl);

  if (!saved) {
    return NextResponse.json({
      ok: true,
      warning: "Redis isn't connected — this was NOT saved permanently. See the banner above for setup steps."
    });
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  if (!authed(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const slug = req.nextUrl.searchParams.get("slug");
  if (!slug) return NextResponse.json({ error: "Missing slug" }, { status: 400 });

  const products = await getProducts();
  const next = products.filter((p) => p.slug !== slug);
  await saveProducts(next);

  return NextResponse.json({ ok: true });
}

// Keeps array/number fields honest even if the form sent plain strings.
function normalizeProduct(p: any): Product {
  return {
    ...p,
    price: Number(p.price) || 0,
    originalPrice: p.originalPrice ? Number(p.originalPrice) : undefined,
    bpm: Number(p.bpm) || 0,
    isNew: Boolean(p.isNew),
    tags: Array.isArray(p.tags) ? p.tags : String(p.tags || "").split(",").map((t: string) => t.trim()).filter(Boolean),
    contains: Array.isArray(p.contains)
      ? p.contains
      : String(p.contains || "").split(",").map((t: string) => t.trim()).filter(Boolean),
    cover: p.cover || { from: "#FFE1EE", to: "#EAF2FF", accent: "#FF6FA5" }
  };
}
