import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken } from "@/lib/admin-auth";
import { getFreeProduct, saveFreeProduct, getDownloadUrl, saveDownloadUrl, kvConfigured } from "@/lib/store";

export const dynamic = "force-dynamic";

function authed(req: NextRequest) {
  return verifyAdminToken(req.cookies.get("admin_session")?.value);
}

export async function GET(req: NextRequest) {
  if (!authed(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const freeProduct = await getFreeProduct();
  const downloadUrl = (await getDownloadUrl(freeProduct.slug)) || "";
  return NextResponse.json({ freeProduct, downloadUrl, kvConfigured });
}

export async function PUT(req: NextRequest) {
  if (!authed(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { downloadUrl, ...freeProduct } = await req.json();

  const saved = await saveFreeProduct({
    ...freeProduct,
    price: 0,
    tags: Array.isArray(freeProduct.tags)
      ? freeProduct.tags
      : String(freeProduct.tags || "").split(",").map((t: string) => t.trim()).filter(Boolean),
    contains: Array.isArray(freeProduct.contains)
      ? freeProduct.contains
      : String(freeProduct.contains || "").split(",").map((t: string) => t.trim()).filter(Boolean)
  });
  if (downloadUrl !== undefined) await saveDownloadUrl(freeProduct.slug, downloadUrl);

  if (!saved) {
    return NextResponse.json({
      ok: true,
      warning: "Redis isn't connected — this was NOT saved permanently. See the banner above for setup steps."
    });
  }
  return NextResponse.json({ ok: true });
}
